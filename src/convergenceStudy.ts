import { MAX_FIXED_STEPS, validateFixedStepGrid } from "./grid";
import { serializeMathAst } from "./math/canonical";
import type { ExactSolutionEvaluator } from "./math/evaluator";
import type { MathExpression } from "./math/expression";
import type {
  MethodFamily,
  SeriesPoint,
  SolverMetadata,
  SolverResult,
  integrateFirstOrder,
} from "./solvers";
import type { ExactSolutionCheckResult } from "./exactSolution";

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
  | "metadata_contract_failure";

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
      "exact_solution_blocked",
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
