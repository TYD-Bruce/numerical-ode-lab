import {
  buildConvergencePreview,
  ConvergenceStudyFailure,
  createConvergenceStudyFingerprint,
  createSuccessfulRunFingerprint,
  type ConvergenceMetric,
  type ConvergencePreview,
  type ConvergenceStudyResult,
  type ConvergenceStudyFailureCode,
  type FirstOrderMethodFamily,
} from "./convergenceStudy";
import type { ExactSolutionCheckResult } from "./exactSolution";
import type { MathExpression } from "./math/expression";
import { cloneMathExpression } from "./math/problemExpressions";
import type { SolverMetadata } from "./solvers";
import type { TeachingSectionId } from "./convergenceTeaching";

export const TEACHING_SECTION_IDS: readonly TeachingSectionId[] = [
  "what_testing",
  "exact_solution",
  "refining_h",
  "errors",
  "observed_order",
  "log_log",
  "theory_difference",
  "warnings",
];

export interface SuccessfulFirstOrderRunSnapshot {
  readonly method: Readonly<Pick<SolverMetadata, "family" | "order">> & {
    readonly family: FirstOrderMethodFamily;
  };
  readonly rhs: MathExpression;
  readonly exactSolutionEnabled: boolean;
  readonly exactSolution?: MathExpression;
  readonly t0: number;
  readonly y0: number;
  readonly tEnd: number;
  readonly runStepSize: number;
  readonly presetId?: string;
  readonly customizationSourcePresetId?: string;
  readonly runFingerprint: string;
}

export interface SuccessfulFirstOrderRunSnapshotInput {
  readonly metadata: Pick<SolverMetadata, "family" | "order">;
  readonly rhs: MathExpression;
  readonly exactSolutionEnabled: boolean;
  readonly exactSolution?: MathExpression;
  readonly t0: number;
  readonly y0: number;
  readonly tEnd: number;
  readonly runStepSize: number;
  readonly presetId?: string;
  readonly customizationSourcePresetId?: string;
}

export type ConvergenceEligibilityInput =
  | { readonly kind: "no_output" }
  | { readonly kind: "compare" }
  | { readonly kind: "second_order" }
  | { readonly kind: "first_order"; readonly snapshot: SuccessfulFirstOrderRunSnapshot };

export interface ConvergenceEligibility {
  readonly showDrawer: boolean;
  readonly runnable: boolean;
  readonly guidance?: string;
}

export interface ConvergenceUiState {
  readonly runFingerprint: string;
  readonly drawerOpen: boolean;
  readonly baseStepSizeDraft: string;
  readonly refinementLevelsDraft: string;
  readonly preview?: ConvergencePreview;
  readonly previewFailure?: ConvergenceFailureRecord;
  readonly result?: ConvergenceStudyResult;
  readonly resultStatus: "absent" | "current" | "stale";
  readonly chartMetric: ConvergenceMetric;
  readonly accordionOpen: Readonly<Record<TeachingSectionId, boolean>>;
  readonly consistencyCheck?: ExactSolutionCheckResult;
  readonly consistencyFingerprint?: string;
  readonly pendingWarningConfirmation?: {
    readonly studyFingerprint: string;
  };
  readonly lastAttemptError?: ConvergenceFailureRecord;
}

export interface ConvergenceFailureRecord {
  readonly code: ConvergenceStudyFailureCode;
  readonly message: string;
  readonly level?: number;
  readonly stepSize?: number;
}

export type ConvergenceStateRecord = Readonly<
  Record<string, ConvergenceUiState>
>;

export function toConvergenceFailureRecord(
  failure: ConvergenceStudyFailure | ConvergenceFailureRecord
): ConvergenceFailureRecord {
  if (Object.isFrozen(failure) && !(failure instanceof Error)) return failure;
  return Object.freeze({
    code: failure.code,
    message: failure.message,
    ...(failure.level === undefined ? {} : { level: failure.level }),
    ...(failure.stepSize === undefined ? {} : { stepSize: failure.stepSize }),
  });
}

export function getConvergenceState(
  record: ConvergenceStateRecord,
  fingerprint: string
): ConvergenceUiState | undefined {
  return record[fingerprint];
}

export function setConvergenceState(
  record: ConvergenceStateRecord,
  fingerprint: string,
  state: ConvergenceUiState
): ConvergenceStateRecord {
  if (record[fingerprint] === state) return record;
  return Object.freeze({ ...record, [fingerprint]: state });
}

export function removeConvergenceState(
  record: ConvergenceStateRecord,
  fingerprint: string
): ConvergenceStateRecord {
  if (!(fingerprint in record)) return record;
  const next = { ...record };
  delete next[fingerprint];
  return Object.freeze(next);
}

function emptyAccordions(): Record<TeachingSectionId, boolean> {
  return Object.fromEntries(
    TEACHING_SECTION_IDS.map((id) => [id, false])
  ) as Record<TeachingSectionId, boolean>;
}

function firstSuccessAccordions(): Record<TeachingSectionId, boolean> {
  return {
    ...emptyAccordions(),
    what_testing: true,
    exact_solution: true,
  };
}

function assertEligibleFamily(
  family: SolverMetadata["family"]
): asserts family is FirstOrderMethodFamily {
  if (family === "leapfrog") {
    throw new Error("Leap-Frog cannot create a first-order convergence snapshot.");
  }
}

export function createSuccessfulFirstOrderRunSnapshot(
  input: SuccessfulFirstOrderRunSnapshotInput
): SuccessfulFirstOrderRunSnapshot {
  assertEligibleFamily(input.metadata.family);
  const rhs = cloneMathExpression(input.rhs, "rhs");
  const exactSolution = input.exactSolutionEnabled && input.exactSolution
    ? cloneMathExpression(input.exactSolution, "exact_solution")
    : undefined;
  const method = Object.freeze({
    family: input.metadata.family,
    order: input.metadata.order,
  });
  const runFingerprint = createSuccessfulRunFingerprint({
    method,
    rhs,
    t0: input.t0,
    tEnd: input.tEnd,
    y0: input.y0,
    runStepSize: input.runStepSize,
    exactEnabled: input.exactSolutionEnabled,
    exactSolution,
    presetId: input.presetId,
    customizationSourcePresetId: input.customizationSourcePresetId,
  });
  return Object.freeze({
    method,
    rhs,
    exactSolutionEnabled: input.exactSolutionEnabled,
    exactSolution,
    t0: input.t0,
    y0: input.y0,
    tEnd: input.tEnd,
    runStepSize: input.runStepSize,
    presetId: input.presetId,
    customizationSourcePresetId: input.customizationSourcePresetId,
    runFingerprint,
  });
}

export function convergenceEligibility(
  input: ConvergenceEligibilityInput
): ConvergenceEligibility {
  if (input.kind !== "first_order") return { showDrawer: false, runnable: false };
  if (!input.snapshot.exactSolutionEnabled || !input.snapshot.exactSolution) {
    return {
      showDrawer: true,
      runnable: false,
      guidance: "Add an exact solution in Step 2 to run error and convergence analysis.",
    };
  }
  return { showDrawer: true, runnable: true };
}

function previewFor(
  snapshot: SuccessfulFirstOrderRunSnapshot,
  baseStepSizeDraft: string,
  refinementLevelsDraft: string
): Pick<ConvergenceUiState, "preview" | "previewFailure"> {
  try {
    return {
      preview: buildConvergencePreview({
        t0: snapshot.t0,
        tEnd: snapshot.tEnd,
        baseStepSize: Number(baseStepSizeDraft),
        refinementLevels: Number(refinementLevelsDraft),
        method: snapshot.method,
      }),
    };
  } catch (error) {
    return error instanceof Error && "code" in error
      ? { previewFailure: toConvergenceFailureRecord(error as ConvergenceStudyFailure) }
      : {};
  }
}

export function currentStudyFingerprint(
  state: Pick<ConvergenceUiState, "runFingerprint" | "baseStepSizeDraft" | "refinementLevelsDraft" | "preview">
): string | undefined {
  if (!state.preview) return undefined;
  return createConvergenceStudyFingerprint({
    runFingerprint: state.runFingerprint,
    studyBaseStepSize: Number(state.baseStepSizeDraft),
    refinementLevels: Number(state.refinementLevelsDraft),
  });
}

function resultStatusFor(
  result: ConvergenceStudyResult | undefined,
  fingerprint: string | undefined
): ConvergenceUiState["resultStatus"] {
  if (!result) return "absent";
  return fingerprint === result.configFingerprint ? "current" : "stale";
}

export function createConvergenceUiState(
  snapshot: SuccessfulFirstOrderRunSnapshot
): ConvergenceUiState {
  const baseStepSizeDraft = String(snapshot.runStepSize);
  const refinementLevelsDraft = "3";
  return {
    runFingerprint: snapshot.runFingerprint,
    drawerOpen: false,
    baseStepSizeDraft,
    refinementLevelsDraft,
    ...previewFor(snapshot, baseStepSizeDraft, refinementLevelsDraft),
    resultStatus: "absent",
    chartMetric: "maximum_global",
    accordionOpen: emptyAccordions(),
  };
}

export function reconcileConvergenceUiState(
  existing: ConvergenceUiState | undefined,
  snapshot: SuccessfulFirstOrderRunSnapshot
): ConvergenceUiState {
  return existing?.runFingerprint === snapshot.runFingerprint
    ? existing
    : createConvergenceUiState(snapshot);
}

export function setConvergenceDrawerOpen(
  state: ConvergenceUiState,
  drawerOpen: boolean
): ConvergenceUiState {
  return { ...state, drawerOpen };
}

export function editConvergenceSetup(
  state: ConvergenceUiState,
  snapshot: SuccessfulFirstOrderRunSnapshot,
  update: { readonly baseStepSizeDraft?: string; readonly refinementLevelsDraft?: string }
): ConvergenceUiState {
  const baseStepSizeDraft = update.baseStepSizeDraft ?? state.baseStepSizeDraft;
  const refinementLevelsDraft = update.refinementLevelsDraft ?? state.refinementLevelsDraft;
  if (
    baseStepSizeDraft === state.baseStepSizeDraft &&
    refinementLevelsDraft === state.refinementLevelsDraft
  ) return state;
  const previewState = previewFor(snapshot, baseStepSizeDraft, refinementLevelsDraft);
  const fingerprint = previewState.preview
    ? createConvergenceStudyFingerprint({
        runFingerprint: state.runFingerprint,
        studyBaseStepSize: Number(baseStepSizeDraft),
        refinementLevels: Number(refinementLevelsDraft),
      })
    : undefined;
  const consistencyMatches = state.consistencyFingerprint === fingerprint;
  return {
    ...state,
    baseStepSizeDraft,
    refinementLevelsDraft,
    preview: previewState.preview,
    previewFailure: previewState.previewFailure,
    resultStatus: resultStatusFor(state.result, fingerprint),
    consistencyCheck: consistencyMatches ? state.consistencyCheck : undefined,
    consistencyFingerprint: consistencyMatches ? state.consistencyFingerprint : undefined,
    pendingWarningConfirmation: undefined,
    lastAttemptError: undefined,
  };
}

export function setConvergenceConsistency(
  state: ConvergenceUiState,
  studyFingerprint: string,
  consistencyCheck: ExactSolutionCheckResult
): ConvergenceUiState {
  return {
    ...state,
    consistencyCheck,
    consistencyFingerprint: studyFingerprint,
  };
}

export function requestWarningConfirmation(
  state: ConvergenceUiState,
  studyFingerprint: string
): ConvergenceUiState {
  return {
    ...state,
    pendingWarningConfirmation: { studyFingerprint },
    lastAttemptError: undefined,
  };
}

export function cancelWarningConfirmation(
  state: ConvergenceUiState
): ConvergenceUiState {
  return { ...state, pendingWarningConfirmation: undefined };
}

export function canRunConfirmedWarning(
  state: ConvergenceUiState,
  studyFingerprint: string
): boolean {
  return state.pendingWarningConfirmation?.studyFingerprint === studyFingerprint;
}

export function finishWarningAttempt(state: ConvergenceUiState): ConvergenceUiState {
  return { ...state, pendingWarningConfirmation: undefined };
}

export function recordConvergenceSuccess(
  state: ConvergenceUiState,
  result: ConvergenceStudyResult
): ConvergenceUiState {
  if (
    result.runFingerprint !== state.runFingerprint ||
    result.configFingerprint !== currentStudyFingerprint(state)
  ) {
    throw new ConvergenceStudyFailure(
      "invalid_fingerprint_input",
      "The convergence result does not belong to the current successful run and study settings."
    );
  }
  const firstSuccess = state.result === undefined;
  return {
    ...state,
    result,
    resultStatus: "current",
    consistencyCheck: result.consistencyCheck,
    consistencyFingerprint: result.configFingerprint,
    lastAttemptError: undefined,
    pendingWarningConfirmation: undefined,
    accordionOpen: firstSuccess ? firstSuccessAccordions() : state.accordionOpen,
  };
}

export function recordConvergenceFailure(
  state: ConvergenceUiState,
  failure: ConvergenceStudyFailure | ConvergenceFailureRecord
): ConvergenceUiState {
  return {
    ...state,
    resultStatus: resultStatusFor(state.result, currentStudyFingerprint(state)),
    lastAttemptError: toConvergenceFailureRecord(failure),
  };
}

export function setConvergenceMetric(
  state: ConvergenceUiState,
  chartMetric: ConvergenceMetric
): ConvergenceUiState {
  return { ...state, chartMetric };
}

export function setTeachingAccordion(
  state: ConvergenceUiState,
  id: TeachingSectionId,
  open: boolean
): ConvergenceUiState {
  return {
    ...state,
    accordionOpen: { ...state.accordionOpen, [id]: open },
  };
}
