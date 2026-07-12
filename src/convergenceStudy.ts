import { MAX_FIXED_STEPS, validateFixedStepGrid } from "./grid";
import { serializeMathAst } from "./math/canonical";
import type { ExactSolutionEvaluator } from "./math/evaluator";
import { compileMathExpression, type MathExpression } from "./math/expression";
import type {
  MethodFamily,
  SeriesPoint,
  SolverMetadata,
  SolverResult,
  integrateFirstOrder,
} from "./solvers";
import { integrateFirstOrder as defaultIntegrateFirstOrder } from "./solvers";
import { checkExactSolution, type ExactSolutionCheckResult } from "./exactSolution";

export const MAX_CONVERGENCE_STUDY_STEPS = 250_000;
export const RUN_FINGERPRINT_VERSION = "ode-run-v1" as const;
export const STUDY_FINGERPRINT_VERSION = "convergence-study-v1" as const;

export type FirstOrderMethodFamily = Exclude<MethodFamily, "leapfrog">;
export type ConvergenceStudyFailureCode =
  | "invalid_base_step"
  | "invalid_refinement_levels"
  | "fixed_grid_failure"
  | "per_level_step_cap"
  | "aggregate_step_budget"
  | "multistep_insufficient_steps"
  | "invalid_fingerprint_input"
  | "exact_solution_blocked"
  | "exact_evaluation_failure"
  | "invalid_solver_points"
  | "metadata_contract_failure"
  | "warning_confirmation_required"
  | "level_integration_failure";

export class ConvergenceStudyFailure extends Error {
  readonly code: ConvergenceStudyFailureCode;
  readonly level?: number;
  readonly stepSize?: number;

  constructor(
    code: ConvergenceStudyFailureCode,
    message: string,
    details: { level?: number; stepSize?: number } = {}
  ) {
    super(message);
    this.name = "ConvergenceStudyFailure";
    this.code = code;
    if (details.level !== undefined) this.level = details.level;
    if (details.stepSize !== undefined && Number.isFinite(details.stepSize)) {
      this.stepSize = details.stepSize;
    }
  }
}

export interface ConvergencePreviewLevel {
  readonly level: number;
  readonly stepSize: number;
  readonly stepCount: number;
}

export interface ConvergencePreview {
  readonly levels: readonly ConvergencePreviewLevel[];
  readonly totalEstimatedSteps: number;
}

export interface ConvergencePreviewInput {
  readonly t0: number;
  readonly tEnd: number;
  readonly baseStepSize: number;
  readonly refinementLevels: number;
  readonly method: Pick<SolverMetadata, "family" | "order">;
}

export interface ConvergenceStudyDependencies {
  readonly integrateFirstOrder: typeof integrateFirstOrder;
}

export interface ConvergenceStudyConfigFoundation extends ConvergencePreviewInput {
  readonly allowConsistencyWarning: boolean;
}

export interface SuccessfulFirstOrderRunFingerprintInput {
  readonly method: Pick<SolverMetadata, "family" | "order">;
  readonly rhs: MathExpression;
  readonly t0: number;
  readonly tEnd: number;
  readonly y0: number;
  readonly runStepSize: number;
  readonly exactEnabled: boolean;
  readonly exactSolution?: MathExpression;
  readonly presetId?: string;
  readonly customizationSourcePresetId?: string;
}

export interface ConvergenceStudyFingerprintInput {
  readonly runFingerprint: string;
  readonly studyBaseStepSize: number;
  readonly refinementLevels: number;
}

export interface ConvergenceLevelMeasurement {
  readonly stepSize: number;
  readonly stepCount: number;
  readonly methodFamily: FirstOrderMethodFamily;
  readonly methodOrder: number;
  readonly finalNumericalValue: number;
  readonly finalExactValue: number;
  readonly finalTimeError: number;
  readonly finalResolutionThreshold: number;
  readonly maximumGlobalError: number;
  readonly maximumErrorTime: number;
  readonly maximumResolutionThreshold: number;
}

export interface MeasureConvergenceLevelInput {
  readonly result: Pick<SolverResult, "points" | "metadata">;
  readonly exactSolution: ExactSolutionEvaluator;
  readonly t0: number;
  readonly y0: number;
  readonly stepSize: number;
}

const MULTISTEP_FAMILIES = new Set<MethodFamily>([
  "adams_bashforth",
  "adams_moulton",
  "bdf",
]);

function assertFirstOrderMetadata(
  method: Pick<SolverMetadata, "family" | "order">
): asserts method is { family: FirstOrderMethodFamily; order: number } {
  if (method.family === "leapfrog") {
    throw new ConvergenceStudyFailure(
      "metadata_contract_failure",
      "Leap-Frog is not eligible for a first-order convergence study."
    );
  }
  if (!Number.isFinite(method.order) || !Number.isInteger(method.order) || method.order < 1) {
    throw new ConvergenceStudyFailure(
      "metadata_contract_failure",
      "The successful method metadata must contain a positive integer order."
    );
  }
}

export function validateAggregateStepBudget(totalSteps: number): number {
  if (!Number.isSafeInteger(totalSteps) || totalSteps < 0) {
    throw new ConvergenceStudyFailure(
      "aggregate_step_budget",
      "The estimated convergence-study step total must be a safe non-negative integer."
    );
  }
  if (totalSteps > MAX_CONVERGENCE_STUDY_STEPS) {
    throw new ConvergenceStudyFailure(
      "aggregate_step_budget",
      `This study estimates ${totalSteps} integration steps, above the browser-protection budget of ${MAX_CONVERGENCE_STUDY_STEPS}. Increase the study base step size or reduce the refinement levels. This count is a protection proxy, not an exact runtime or right-hand-side evaluation estimate.`
    );
  }
  return totalSteps;
}

export function buildConvergencePreview(input: ConvergencePreviewInput): ConvergencePreview {
  if (!Number.isFinite(input.baseStepSize) || !(input.baseStepSize > 0)) {
    throw new ConvergenceStudyFailure(
      "invalid_base_step",
      "Study base step size must be positive and finite."
    );
  }
  if (
    !Number.isFinite(input.refinementLevels) ||
    !Number.isInteger(input.refinementLevels) ||
    input.refinementLevels < 3 ||
    input.refinementLevels > 6
  ) {
    throw new ConvergenceStudyFailure(
      "invalid_refinement_levels",
      "Refinement levels must be an integer from 3 through 6."
    );
  }
  assertFirstOrderMetadata(input.method);

  const levels: ConvergencePreviewLevel[] = [];
  let totalEstimatedSteps = 0;
  for (let level = 0; level < input.refinementLevels; level += 1) {
    const stepSize = input.baseStepSize / 2 ** level;
    if (!Number.isFinite(stepSize) || !(stepSize > 0)) {
      throw new ConvergenceStudyFailure(
        "invalid_base_step",
        `Refinement level ${level + 1} does not have a positive finite step size.`,
        { level, stepSize }
      );
    }
    let stepCount: number;
    try {
      stepCount = validateFixedStepGrid(input.t0, input.tEnd, stepSize).steps;
    } catch (error) {
      const message = error instanceof Error ? error.message : "The fixed grid is invalid.";
      const code = message.includes(`current limit of ${MAX_FIXED_STEPS}`)
        ? "per_level_step_cap"
        : "fixed_grid_failure";
      throw new ConvergenceStudyFailure(
        code,
        `Refinement level ${level + 1} at h = ${stepSize} is invalid: ${message}`,
        { level, stepSize }
      );
    }
    levels.push({ level, stepSize, stepCount });
    totalEstimatedSteps += stepCount;
    if (!Number.isSafeInteger(totalEstimatedSteps)) {
      throw new ConvergenceStudyFailure(
        "aggregate_step_budget",
        "The estimated convergence-study step total exceeds safe integer arithmetic."
      );
    }
  }

  if (
    MULTISTEP_FAMILIES.has(input.method.family) &&
    levels[0]!.stepCount < input.method.order
  ) {
    throw new ConvergenceStudyFailure(
      "multistep_insufficient_steps",
      `${input.method.family} of order ${input.method.order} requires at least ${input.method.order} fixed steps on the coarsest grid; this preview provides N = ${levels[0]!.stepCount}.`,
      { level: 0, stepSize: levels[0]!.stepSize }
    );
  }

  validateAggregateStepBudget(totalEstimatedSteps);
  return { levels, totalEstimatedSteps };
}

/** Phase B boundary: it validates completely and deliberately never invokes integration. */
export function preflightConvergenceStudy(
  input: ConvergencePreviewInput,
  _dependencies: ConvergenceStudyDependencies
): ConvergencePreview {
  return buildConvergencePreview(input);
}

export function validateConsistencyPermission(
  result: ExactSolutionCheckResult,
  allowConsistencyWarning: boolean
): void {
  if (result.status === "blocked") {
    throw new ConvergenceStudyFailure(
      "exact_solution_blocked",
      result.primaryBlocker?.message ?? "The exact-solution consistency check blocked this study."
    );
  }
  if (result.status === "warning" && !allowConsistencyWarning) {
    throw new ConvergenceStudyFailure(
      "warning_confirmation_required",
      "Confirm the numerical consistency warning before running this study."
    );
  }
}

export function fingerprintNumberKey(value: number): string {
  if (!Number.isFinite(value)) {
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "Fingerprint numeric inputs must be finite."
    );
  }
  return Object.is(value, -0) ? "0" : value.toString();
}

export function createSuccessfulRunFingerprint(
  input: SuccessfulFirstOrderRunFingerprintInput
): string {
  try {
    assertFirstOrderMetadata(input.method);
    if (input.exactEnabled && !input.exactSolution) {
      throw new ConvergenceStudyFailure(
        "invalid_fingerprint_input",
        "An enabled exact solution requires canonical exact-solution meaning."
      );
    }
    const rhs = serializeMathAst(input.rhs.canonicalAst, "rhs");
    const exact = input.exactEnabled
      ? serializeMathAst(input.exactSolution!.canonicalAst, "exact_solution")
      : null;
    return JSON.stringify([
      RUN_FINGERPRINT_VERSION,
      input.method.family,
      input.method.order,
      rhs,
      fingerprintNumberKey(input.t0),
      fingerprintNumberKey(input.tEnd),
      fingerprintNumberKey(input.y0),
      fingerprintNumberKey(input.runStepSize),
      input.exactEnabled,
      exact,
      input.presetId ?? null,
      input.customizationSourcePresetId ?? null,
    ]);
  } catch (error) {
    if (error instanceof ConvergenceStudyFailure && error.code === "invalid_fingerprint_input") {
      throw error;
    }
    if (error instanceof ConvergenceStudyFailure) {
      throw new ConvergenceStudyFailure("invalid_fingerprint_input", error.message);
    }
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "The successful-run fingerprint input is invalid."
    );
  }
}

export function createConvergenceStudyFingerprint(
  input: ConvergenceStudyFingerprintInput
): string {
  if (input.runFingerprint.trim() === "") {
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "A study fingerprint requires a non-empty successful-run fingerprint."
    );
  }
  if (!Number.isFinite(input.studyBaseStepSize) || !(input.studyBaseStepSize > 0)) {
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "Study fingerprint base step size must be positive and finite."
    );
  }
  if (
    !Number.isInteger(input.refinementLevels) ||
    input.refinementLevels < 3 ||
    input.refinementLevels > 6
  ) {
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "Study fingerprint refinement levels must be an integer from 3 through 6."
    );
  }
  return JSON.stringify([
    STUDY_FINGERPRINT_VERSION,
    input.runFingerprint,
    fingerprintNumberKey(input.studyBaseStepSize),
    input.refinementLevels,
  ]);
}

function exactAtPoint(
  exactSolution: ExactSolutionEvaluator,
  point: SeriesPoint,
  t0: number,
  y0: number
): number {
  let exact: number;
  try {
    exact = exactSolution(point.t, t0, y0);
  } catch {
    throw new ConvergenceStudyFailure(
      "exact_evaluation_failure",
      `The exact solution could not be evaluated at t = ${point.t}.`
    );
  }
  if (!Number.isFinite(exact)) {
    throw new ConvergenceStudyFailure(
      "exact_evaluation_failure",
      `The exact solution was not finite at t = ${point.t}.`
    );
  }
  return exact;
}

function resolutionThreshold(exact: number, numerical: number): number {
  return 100 * Number.EPSILON * Math.max(1, Math.abs(exact), Math.abs(numerical));
}

export function measureConvergenceLevel(
  input: MeasureConvergenceLevelInput
): ConvergenceLevelMeasurement {
  assertFirstOrderMetadata(input.result.metadata);
  if (!Number.isFinite(input.t0) || !Number.isFinite(input.y0)) {
    throw new ConvergenceStudyFailure(
      "invalid_solver_points",
      "Measurement initial data must be finite."
    );
  }
  if (!Number.isFinite(input.stepSize) || !(input.stepSize > 0)) {
    throw new ConvergenceStudyFailure(
      "invalid_base_step",
      "Measurement step size must be positive and finite."
    );
  }
  if (input.result.points.length === 0) {
    throw new ConvergenceStudyFailure(
      "invalid_solver_points",
      "A convergence level must contain at least one numerical grid point."
    );
  }

  let maximumGlobalError = -1;
  let maximumErrorTime = 0;
  let maximumResolutionThreshold = 0;
  let finalExactValue = 0;
  let finalNumericalValue = 0;
  let finalTimeError = 0;
  let finalResolutionThreshold = 0;
  input.result.points.forEach((point, index) => {
    if (!Number.isFinite(point.t) || !Number.isFinite(point.y)) {
      throw new ConvergenceStudyFailure(
        "invalid_solver_points",
        `Numerical grid point ${index + 1} must contain finite t and y values.`
      );
    }
    const exact = exactAtPoint(input.exactSolution, point, input.t0, input.y0);
    const error = Math.abs(point.y - exact);
    const threshold = resolutionThreshold(exact, point.y);
    if (!Number.isFinite(error) || !Number.isFinite(threshold)) {
      throw new ConvergenceStudyFailure(
        "invalid_solver_points",
        `Error measurement could not produce finite evidence at t = ${point.t}.`
      );
    }
    if (error > maximumGlobalError) {
      maximumGlobalError = error;
      maximumErrorTime = point.t;
      maximumResolutionThreshold = threshold;
    }
    if (index === input.result.points.length - 1) {
      finalExactValue = exact;
      finalNumericalValue = point.y;
      finalTimeError = error;
      finalResolutionThreshold = threshold;
    }
  });

  return {
    stepSize: input.stepSize,
    stepCount: input.result.points.length - 1,
    methodFamily: input.result.metadata.family,
    methodOrder: input.result.metadata.order,
    finalNumericalValue,
    finalExactValue,
    finalTimeError,
    finalResolutionThreshold,
    maximumGlobalError,
    maximumErrorTime,
    maximumResolutionThreshold,
  };
}

export type ObservedOrderStatus =
  | "reliable"
  | "below_resolution"
  | "no_improvement"
  | "negative"
  | "near_zero"
  | "unavailable";

export interface ObservedOrderAssessment {
  readonly value?: number;
  readonly status: ObservedOrderStatus;
  readonly message: string;
  readonly coarseLevel: number;
  readonly fineLevel: number;
}

export type ConvergenceInterpretationKind =
  | "consistent_with_theory"
  | "approaching_theory"
  | "not_yet_asymptotic"
  | "refinement_not_improving"
  | "order_unavailable";

export interface ConvergenceInterpretation {
  readonly kind: ConvergenceInterpretationKind;
  readonly title: string;
  readonly explanation: string;
  readonly primaryObservedOrder?: number;
  readonly evidencePairs: readonly (readonly [number, number])[];
}

export interface ConvergenceLevelResult {
  readonly level: number;
  readonly stepSize: number;
  readonly stepCount: number;
  readonly finalNumericalValue: number;
  readonly finalExactValue: number;
  readonly finalTimeError: number;
  readonly finalResolutionThreshold: number;
  readonly maximumGlobalError: number;
  readonly maximumErrorTime: number;
  readonly maximumResolutionThreshold: number;
  readonly finalObservedOrder?: ObservedOrderAssessment;
  readonly maximumObservedOrder?: ObservedOrderAssessment;
}

export interface ConvergenceStudyConfig extends ConvergenceStudyConfigFoundation {
  readonly rhs: MathExpression;
  readonly exactSolution: MathExpression;
  readonly y0: number;
  readonly runFingerprint: string;
}

export function checkConvergenceStudyConsistency(
  config: Pick<ConvergenceStudyConfig, "rhs" | "exactSolution" | "t0" | "tEnd" | "y0">
): ExactSolutionCheckResult {
  try {
    const rhs = compileMathExpression(config.rhs, "rhs").evaluate;
    const exact = compileMathExpression(config.exactSolution, "exact_solution").evaluate;
    return checkExactSolution({
      t0: config.t0,
      tEnd: config.tEnd,
      y0: config.y0,
      exactSolution: exact,
      rhs,
    });
  } catch (error) {
    if (error instanceof ConvergenceStudyFailure) throw error;
    const reason = error instanceof Error ? error.message : "the exact solution could not be evaluated";
    throw new ConvergenceStudyFailure(
      "exact_evaluation_failure",
      `The numerical consistency check failed because ${reason}`
    );
  }
}

export interface ConvergenceStudyResult {
  readonly configFingerprint: string;
  readonly runFingerprint: string;
  readonly theoreticalOrder: number;
  readonly consistencyCheck: ExactSolutionCheckResult;
  readonly levels: readonly ConvergenceLevelResult[];
  readonly interpretation: ConvergenceInterpretation;
}

export type ConvergenceMetric = "maximum_global" | "final_time";

export interface ConvergenceChartPoint {
  readonly level: number;
  readonly stepSize: number;
  readonly error: number;
  readonly observedOrder?: number;
}

export interface ConvergenceReferencePoint {
  readonly stepSize: number;
  readonly error: number;
}

export interface ConvergenceChartModel {
  readonly metric: ConvergenceMetric;
  readonly measured: readonly ConvergenceChartPoint[];
  readonly reference: readonly ConvergenceReferencePoint[];
  readonly omittedLevels: readonly { readonly level: number; readonly reason: string }[];
  readonly theoreticalOrder: number;
  readonly referenceExplanation?: string;
}

function displayPair(coarseLevel: number, fineLevel: number): string {
  return `levels ${coarseLevel + 1} and ${fineLevel + 1}`;
}

export function assessObservedOrder(input: {
  readonly coarseError: number;
  readonly fineError: number;
  readonly coarseThreshold: number;
  readonly fineThreshold: number;
  readonly coarseLevel: number;
  readonly fineLevel: number;
}): ObservedOrderAssessment {
  const pair = displayPair(input.coarseLevel, input.fineLevel);
  const base = { coarseLevel: input.coarseLevel, fineLevel: input.fineLevel };
  if (
    !Number.isFinite(input.coarseError) ||
    !Number.isFinite(input.fineError) ||
    !Number.isFinite(input.coarseThreshold) ||
    !Number.isFinite(input.fineThreshold)
  ) {
    return {
      ...base,
      status: "unavailable",
      message: `A reliable observed-order estimate could not be computed from ${pair}.`,
    };
  }
  if (
    input.coarseError <= input.coarseThreshold ||
    input.fineError <= input.fineThreshold
  ) {
    return {
      ...base,
      status: "below_resolution",
      message:
        "The measured error is too close to floating-point resolution for a reliable observed-order estimate.",
    };
  }
  const value = Math.log2(input.coarseError / input.fineError);
  if (input.fineError > input.coarseError) {
    return {
      ...base,
      ...(Number.isFinite(value) ? { value } : {}),
      status: "negative",
      message:
        `Refinement from ${pair} increased the measured error. Possible, unproven causes include instability, roundoff, startup error, an invalid exact solution, or non-asymptotic behavior.`,
    };
  }
  if (
    Math.abs(input.coarseError - input.fineError) <=
    1e-12 * Math.max(input.coarseError, input.fineError)
  ) {
    return {
      ...base,
      value: 0,
      status: "no_improvement",
      message: `Refinement between ${pair} did not measurably reduce the error.`,
    };
  }
  if (Number.isFinite(value) && Math.abs(value) <= 0.1) {
    return {
      ...base,
      value,
      status: "near_zero",
      message: `The error reduction between ${pair} was too small to indicate meaningful convergence.`,
    };
  }
  if (Number.isFinite(value) && value > 0) {
    return {
      ...base,
      value,
      status: "reliable",
      message: `The observed order between ${pair} is ${value.toFixed(3)}.`,
    };
  }
  return {
    ...base,
    status: "unavailable",
    message: `A reliable observed-order estimate could not be computed from ${pair}.`,
  };
}

export function attachObservedOrders(
  source: readonly Omit<ConvergenceLevelResult, "finalObservedOrder" | "maximumObservedOrder">[]
): readonly ConvergenceLevelResult[] {
  return source.map((level, index) => {
    if (index === 0) return { ...level };
    const coarse = source[index - 1]!;
    return {
      ...level,
      finalObservedOrder: assessObservedOrder({
        coarseError: coarse.finalTimeError,
        fineError: level.finalTimeError,
        coarseThreshold: coarse.finalResolutionThreshold,
        fineThreshold: level.finalResolutionThreshold,
        coarseLevel: coarse.level,
        fineLevel: level.level,
      }),
      maximumObservedOrder: assessObservedOrder({
        coarseError: coarse.maximumGlobalError,
        fineError: level.maximumGlobalError,
        coarseThreshold: coarse.maximumResolutionThreshold,
        fineThreshold: level.maximumResolutionThreshold,
        coarseLevel: coarse.level,
        fineLevel: level.level,
      }),
    };
  });
}

function pairOf(assessment: ObservedOrderAssessment): readonly [number, number] {
  return [assessment.coarseLevel, assessment.fineLevel];
}

export function interpretConvergence(
  levels: readonly ConvergenceLevelResult[],
  theoreticalOrder: number
): ConvergenceInterpretation {
  const assessments = levels
    .map((level) => level.maximumObservedOrder)
    .filter((value): value is ObservedOrderAssessment => value !== undefined);
  const newestTwo = assessments.slice(-2);
  const offending = newestTwo.filter(
    (value) => value.status === "negative" || value.status === "no_improvement"
  );
  const finestIncrease =
    levels.length >= 2 &&
    levels.at(-1)!.maximumGlobalError > levels.at(-2)!.maximumGlobalError;
  if (finestIncrease || offending.length > 0) {
    const finestAssessment = levels.at(-1)?.maximumObservedOrder;
    const evidence = offending.length > 0
      ? offending.map(pairOf)
      : finestAssessment
        ? [pairOf(finestAssessment)]
        : [];
    return {
      kind: "refinement_not_improving",
      title: "Refinement did not improve the measured error",
      explanation:
        "The newest evidence does not show a measurable error reduction. This can have several causes, and the experiment does not prove which one applies.",
      evidencePairs: evidence,
    };
  }

  const reliable = assessments.filter(
    (value): value is ObservedOrderAssessment & { value: number } =>
      value.status === "reliable" && Number.isFinite(value.value)
  );
  if (reliable.length === 0) {
    const resolutionLimited = assessments.some((value) => value.status === "below_resolution");
    return {
      kind: "order_unavailable",
      title: "Observed order is unavailable",
      explanation: resolutionLimited
        ? "The available error pairs are too close to floating-point resolution to support a reliable order estimate."
        : "There are not enough reliable adjacent error pairs to estimate convergence order.",
      evidencePairs: [],
    };
  }

  const recent = reliable.slice(-3);
  const final = reliable.at(-1)!;
  const values = recent.map((item) => item.value);
  const tolerance = Math.max(0.25, 0.1 * theoreticalOrder);
  const spread = Math.max(...values) - Math.min(...values);
  const spreadRoundoffAllowance =
    4 * Number.EPSILON * Math.max(1, ...values.map((value) => Math.abs(value)));
  const evidencePairs = recent.map(pairOf);
  if (
    reliable.length >= 2 &&
    Math.abs(final.value - theoreticalOrder) <= tolerance &&
    spread <= 0.35 + spreadRoundoffAllowance
  ) {
    return {
      kind: "consistent_with_theory",
      title: "Observed order is consistent with theory",
      explanation:
        `The recent maximum-error orders are stable and the latest value is within ${tolerance.toFixed(3)} of the theoretical order.`,
      primaryObservedOrder: final.value,
      evidencePairs,
    };
  }

  const errorsDecrease = levels.every(
    (level, index) => index === 0 || level.maximumGlobalError < levels[index - 1]!.maximumGlobalError
  );
  const lastTwoReliable = reliable.slice(-2);
  const approaching =
    reliable.length >= 2 &&
    errorsDecrease &&
    lastTwoReliable.every((item) => Math.abs(item.value - theoreticalOrder) > tolerance) &&
    Math.abs(lastTwoReliable[1]!.value - theoreticalOrder) <
      Math.abs(lastTwoReliable[0]!.value - theoreticalOrder);
  if (approaching) {
    return {
      kind: "approaching_theory",
      title: "Observed order is approaching theory",
      explanation:
        "The errors continue to decrease and the newest reliable order moved closer to the theoretical value, but it is not yet within tolerance.",
      primaryObservedOrder: final.value,
      evidencePairs,
    };
  }

  return {
    kind: "not_yet_asymptotic",
    title: "The experiment is not yet in a clear asymptotic regime",
    explanation:
      "The error decreases, but the reliable observed orders are still sparse, unstable, or offset from theory.",
    primaryObservedOrder: final.value,
    evidencePairs,
  };
}

function metricValues(level: ConvergenceLevelResult, metric: ConvergenceMetric) {
  return metric === "maximum_global"
    ? {
        error: level.maximumGlobalError,
        threshold: level.maximumResolutionThreshold,
        assessment: level.maximumObservedOrder,
      }
    : {
        error: level.finalTimeError,
        threshold: level.finalResolutionThreshold,
        assessment: level.finalObservedOrder,
      };
}

export function buildConvergenceChartModel(
  result: ConvergenceStudyResult,
  metric: ConvergenceMetric
): ConvergenceChartModel {
  const measured: ConvergenceChartPoint[] = [];
  const omittedLevels: { level: number; reason: string }[] = [];
  for (const level of result.levels) {
    const values = metricValues(level, metric);
    if (!Number.isFinite(values.error) || !(values.error > 0)) {
      omittedLevels.push({
        level: level.level,
        reason: "The measured error is zero or non-finite and cannot appear on a logarithmic axis.",
      });
      continue;
    }
    if (!Number.isFinite(values.threshold) || values.error <= values.threshold) {
      omittedLevels.push({
        level: level.level,
        reason: "The measured error is too close to floating-point resolution.",
      });
      continue;
    }
    measured.push({
      level: level.level,
      stepSize: level.stepSize,
      error: values.error,
      ...(values.assessment?.status === "reliable" && values.assessment.value !== undefined
        ? { observedOrder: values.assessment.value }
        : {}),
    });
  }

  const measuredLevels = new Set(measured.map((point) => point.level));
  const anchor = [...result.levels].reverse().find((level) => {
    const assessment = metricValues(level, metric).assessment;
    return (
      assessment?.status === "reliable" &&
      measuredLevels.has(level.level) &&
      measuredLevels.has(assessment.coarseLevel)
    );
  });
  if (!anchor) {
    return {
      metric,
      measured,
      reference: [],
      omittedLevels,
      theoreticalOrder: result.theoreticalOrder,
    };
  }
  const anchorError = metricValues(anchor, metric).error;
  const constant = anchorError / anchor.stepSize ** result.theoreticalOrder;
  const reference = measured.map((point) => ({
    stepSize: point.stepSize,
    error: constant * point.stepSize ** result.theoreticalOrder,
  }));
  if (
    !Number.isFinite(constant) ||
    !(constant > 0) ||
    reference.some((point) => !Number.isFinite(point.error) || !(point.error > 0))
  ) {
    return {
      metric,
      measured,
      reference: [],
      omittedLevels,
      theoreticalOrder: result.theoreticalOrder,
    };
  }
  return {
    metric,
    measured,
    reference,
    omittedLevels,
    theoreticalOrder: result.theoreticalOrder,
    referenceExplanation:
      "The reference line compares the theoretical slope only; it does not use a known theoretical error constant.",
  };
}

function assertMatchingMetadata(
  actual: SolverMetadata,
  expected: Pick<SolverMetadata, "family" | "order">,
  level: number,
  stepSize: number
): void {
  if (
    actual.family !== expected.family ||
    actual.order !== expected.order ||
    !Number.isFinite(actual.order) ||
    !Number.isInteger(actual.order)
  ) {
    throw new ConvergenceStudyFailure(
      "metadata_contract_failure",
      `Refinement level ${level + 1} at h = ${stepSize} returned method metadata that does not match the successful-run contract.`,
      { level, stepSize }
    );
  }
}

export function runConvergenceStudy(
  config: ConvergenceStudyConfig,
  dependencies: ConvergenceStudyDependencies = {
    integrateFirstOrder: defaultIntegrateFirstOrder,
  }
): ConvergenceStudyResult {
  const preview = buildConvergencePreview(config);
  const configFingerprint = createConvergenceStudyFingerprint({
    runFingerprint: config.runFingerprint,
    studyBaseStepSize: config.baseStepSize,
    refinementLevels: config.refinementLevels,
  });
  const consistencyCheck = checkConvergenceStudyConsistency(config);
  validateConsistencyPermission(consistencyCheck, config.allowConsistencyWarning);
  const rhs = compileMathExpression(config.rhs, "rhs").evaluate;
  const exact = compileMathExpression(config.exactSolution, "exact_solution").evaluate;

  const measurements: Omit<
    ConvergenceLevelResult,
    "finalObservedOrder" | "maximumObservedOrder"
  >[] = [];
  let theoreticalOrder: number | undefined;
  for (const level of preview.levels) {
    let solverResult: SolverResult;
    try {
      solverResult = dependencies.integrateFirstOrder(
        { family: config.method.family, order: config.method.order },
        {
          t0: config.t0,
          y0: config.y0,
          tEnd: config.tEnd,
          h: level.stepSize,
          f: rhs,
        }
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : "the numerical integration failed";
      throw new ConvergenceStudyFailure(
        "level_integration_failure",
        `Refinement level ${level.level + 1} failed at h = ${level.stepSize} because ${reason} The convergence study was not updated.`,
        { level: level.level, stepSize: level.stepSize }
      );
    }
    assertMatchingMetadata(solverResult.metadata, config.method, level.level, level.stepSize);
    if (theoreticalOrder === undefined) theoreticalOrder = solverResult.metadata.order;
    else if (
      solverResult.metadata.family !== config.method.family ||
      solverResult.metadata.order !== theoreticalOrder
    ) {
      throw new ConvergenceStudyFailure(
        "metadata_contract_failure",
        `Refinement level ${level.level + 1} returned inconsistent method metadata.`,
        { level: level.level, stepSize: level.stepSize }
      );
    }
    const measured = measureConvergenceLevel({
      result: solverResult,
      exactSolution: exact,
      t0: config.t0,
      y0: config.y0,
      stepSize: level.stepSize,
    });
    if (measured.stepCount !== level.stepCount) {
      throw new ConvergenceStudyFailure(
        "metadata_contract_failure",
        `Refinement level ${level.level + 1} at h = ${level.stepSize} returned ${measured.stepCount} steps instead of the validated ${level.stepCount}.`,
        { level: level.level, stepSize: level.stepSize }
      );
    }
    measurements.push({
      level: level.level,
      stepSize: measured.stepSize,
      stepCount: measured.stepCount,
      finalNumericalValue: measured.finalNumericalValue,
      finalExactValue: measured.finalExactValue,
      finalTimeError: measured.finalTimeError,
      finalResolutionThreshold: measured.finalResolutionThreshold,
      maximumGlobalError: measured.maximumGlobalError,
      maximumErrorTime: measured.maximumErrorTime,
      maximumResolutionThreshold: measured.maximumResolutionThreshold,
    });
  }
  if (theoreticalOrder === undefined) {
    throw new ConvergenceStudyFailure(
      "metadata_contract_failure",
      "The convergence study did not produce method metadata."
    );
  }
  const levels = attachObservedOrders(measurements);
  return {
    configFingerprint,
    runFingerprint: config.runFingerprint,
    theoreticalOrder,
    consistencyCheck,
    levels,
    interpretation: interpretConvergence(levels, theoreticalOrder),
  };
}
