import { describe, expect, it } from "vitest";
import { createMathExpressionFromLegacy } from "@numerical-t-lab/numerics/expressions/legacy-adapter";
import {
  ConvergenceStudyFailure,
  type ConvergenceStudyResult,
} from "@numerical-t-lab/numerics/convergence";
import {
  canRunConfirmedWarning,
  cancelWarningConfirmation,
  convergenceEligibility,
  createConvergenceUiState,
  createSuccessfulFirstOrderRunSnapshot,
  currentStudyFingerprint,
  editConvergenceSetup,
  finishWarningAttempt,
  getConvergenceState,
  reconcileConvergenceUiState,
  recordConvergenceFailure,
  recordConvergenceSuccess,
  removeConvergenceState,
  requestWarningConfirmation,
  setConvergenceConsistency,
  setConvergenceState,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
  setTeachingAccordion,
  toConvergenceFailureRecord,
  type ConvergenceUiState,
  type SuccessfulFirstOrderRunSnapshot,
} from "./convergenceStudyState";

function snapshot(
  overrides: Partial<Parameters<typeof createSuccessfulFirstOrderRunSnapshot>[0]> = {}
): SuccessfulFirstOrderRunSnapshot {
  return createSuccessfulFirstOrderRunSnapshot({
    metadata: { family: "rk4", order: 4 },
    rhs: createMathExpressionFromLegacy("-y", "rhs"),
    exactSolutionEnabled: true,
    exactSolution: createMathExpressionFromLegacy("exp(-t)", "exact_solution"),
    t0: 0,
    y0: 1,
    tEnd: 1,
    runStepSize: 0.25,
    presetId: "exponential_decay",
    ...overrides,
  });
}

function consistency(status: "passed" | "warning" | "blocked" = "passed") {
  return {
    status,
    statement: "This is a numerical consistency check, not a formal proof." as const,
    sampleCount: 9 as const,
    probes: [],
    issues: [],
  };
}

function result(state: ConvergenceUiState): ConvergenceStudyResult {
  return {
    configFingerprint: currentStudyFingerprint(state)!,
    runFingerprint: state.runFingerprint,
    theoreticalOrder: 4,
    consistencyCheck: consistency(),
    levels: [],
    interpretation: {
      kind: "order_unavailable",
      title: "Observed order is unavailable",
      explanation: "No reliable pairs.",
      evidencePairs: [],
    },
  };
}

describe("successful run ownership and eligibility", () => {
  it("builds an immutable, deterministic snapshot from actual metadata", () => {
    const first = snapshot();
    const identical = snapshot();
    const changed = snapshot({ runStepSize: 0.125 });
    expect(first.method).toEqual({ family: "rk4", order: 4 });
    expect(first.runFingerprint).toBe(identical.runFingerprint);
    expect(changed.runFingerprint).not.toBe(first.runFingerprint);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.method)).toBe(true);
    expect(Object.isFrozen(first.rhs.canonicalAst)).toBe(true);
  });

  it("shows a runnable drawer only for first-order output with an exact solution", () => {
    const value = snapshot();
    expect(convergenceEligibility({ kind: "first_order", snapshot: value })).toEqual({
      showDrawer: true,
      runnable: true,
    });
    const noExact = snapshot({ exactSolutionEnabled: false, exactSolution: undefined });
    expect(convergenceEligibility({ kind: "first_order", snapshot: noExact })).toMatchObject({
      showDrawer: true,
      runnable: false,
      guidance: "Add an exact solution in Step 2 to run error and convergence analysis.",
    });
    expect(convergenceEligibility({ kind: "compare" }).showDrawer).toBe(false);
    expect(convergenceEligibility({ kind: "second_order" }).showDrawer).toBe(false);
    expect(convergenceEligibility({ kind: "no_output" }).showDrawer).toBe(false);
  });
});

describe("convergence UI state", () => {
  it("initializes the approved closed setup with a valid preview", () => {
    const state = createConvergenceUiState(snapshot());
    expect(state).toMatchObject({
      drawerOpen: false,
      baseStepSizeDraft: "0.25",
      refinementLevelsDraft: "3",
      resultStatus: "absent",
      chartMetric: "maximum_global",
    });
    expect(state.preview?.levels.map((level) => level.stepCount)).toEqual([4, 8, 16]);
    expect(Object.values(state.accordionOpen).every((open) => !open)).toBe(true);
  });

  it("preserves identical reruns and resets changed successful runs", () => {
    const run = snapshot();
    const edited = setConvergenceDrawerOpen(createConvergenceUiState(run), true);
    expect(reconcileConvergenceUiState(edited, snapshot())).toBe(edited);
    const reset = reconcileConvergenceUiState(edited, snapshot({ y0: 2 }));
    expect(reset).not.toBe(edited);
    expect(reset.drawerOpen).toBe(false);
    expect(reset.resultStatus).toBe("absent");
  });

  it("marks a preserved result stale and current again when settings are restored", () => {
    const run = snapshot();
    const initial = createConvergenceUiState(run);
    const successful = recordConvergenceSuccess(initial, result(initial));
    const changed = editConvergenceSetup(successful, run, { baseStepSizeDraft: "0.125" });
    expect(changed.result).toBe(successful.result);
    expect(changed.resultStatus).toBe("stale");
    const restored = editConvergenceSetup(changed, run, { baseStepSizeDraft: "0.25" });
    expect(restored.result).toBe(successful.result);
    expect(restored.resultStatus).toBe("current");
  });

  it("keeps prior results visible when setup becomes invalid", () => {
    const run = snapshot();
    const initial = createConvergenceUiState(run);
    const successful = recordConvergenceSuccess(initial, result(initial));
    const invalid = editConvergenceSetup(successful, run, {
      refinementLevelsDraft: "2.5",
    });
    expect(invalid.preview).toBeUndefined();
    expect(invalid.previewFailure?.code).toBe("invalid_refinement_levels");
    expect(invalid.resultStatus).toBe("stale");
    expect(invalid.result).toBe(successful.result);
  });

  it("owns fingerprint-specific one-shot warning confirmation", () => {
    const run = snapshot();
    const initial = createConvergenceUiState(run);
    const fingerprint = currentStudyFingerprint(initial)!;
    const checked = setConvergenceConsistency(initial, fingerprint, consistency("warning"));
    const pending = requestWarningConfirmation(checked, fingerprint);
    expect(canRunConfirmedWarning(pending, fingerprint)).toBe(true);
    expect(canRunConfirmedWarning(pending, `${fingerprint}-other`)).toBe(false);
    expect(cancelWarningConfirmation(pending).pendingWarningConfirmation).toBeUndefined();
    expect(finishWarningAttempt(pending).pendingWarningConfirmation).toBeUndefined();
    const changed = editConvergenceSetup(pending, run, { baseStepSizeDraft: "0.125" });
    expect(changed.pendingWarningConfirmation).toBeUndefined();
    expect(changed.consistencyCheck).toBeUndefined();
  });

  it("clears confirmation after success and preserves results after failure", () => {
    const initial = createConvergenceUiState(snapshot());
    const fingerprint = currentStudyFingerprint(initial)!;
    const pending = requestWarningConfirmation(initial, fingerprint);
    const successful = recordConvergenceSuccess(pending, result(initial));
    expect(successful.pendingWarningConfirmation).toBeUndefined();
    expect(successful.resultStatus).toBe("current");
    expect(successful.accordionOpen.what_testing).toBe(true);
    expect(successful.accordionOpen.exact_solution).toBe(true);
    expect(successful.accordionOpen.errors).toBe(false);

    const stale = editConvergenceSetup(successful, snapshot(), { baseStepSizeDraft: "0.125" });
    const failure = new ConvergenceStudyFailure(
      "level_integration_failure",
      "Refinement level 2 failed.",
      { level: 1, stepSize: 0.0625 }
    );
    const failed = recordConvergenceFailure(stale, failure);
    expect(failed.result).toBe(successful.result);
    expect(failed.resultStatus).toBe("stale");
    expect(failed.lastAttemptError).toEqual({
      code: "level_integration_failure",
      message: "Refinement level 2 failed.",
      level: 1,
      stepSize: 0.0625,
    });
    expect(failed.lastAttemptError).not.toBeInstanceOf(Error);
  });

  it("rejects a result belonging to another run or study fingerprint", () => {
    const initial = createConvergenceUiState(snapshot());
    expect(() => recordConvergenceSuccess(initial, {
      ...result(initial),
      runFingerprint: "another-run",
    })).toThrow(expect.objectContaining({ code: "invalid_fingerprint_input" }));
    expect(() => recordConvergenceSuccess(initial, {
      ...result(initial),
      configFingerprint: "another-study",
    })).toThrow(expect.objectContaining({ code: "invalid_fingerprint_input" }));
  });

  it("preserves independent drawer, metric, and accordion choices", () => {
    let state = createConvergenceUiState(snapshot());
    state = setConvergenceDrawerOpen(state, true);
    state = setConvergenceMetric(state, "final_time");
    state = setTeachingAccordion(state, "warnings", true);
    expect(state.drawerOpen).toBe(true);
    expect(state.chartMetric).toBe("final_time");
    expect(state.accordionOpen.warnings).toBe(true);
  });

  it("stores preview and run failures as pure records while preserving messages", () => {
    const run = snapshot();
    const invalid = editConvergenceSetup(createConvergenceUiState(run), run, {
      refinementLevelsDraft: "2.5",
    });
    expect(invalid.previewFailure).toEqual({
      code: "invalid_refinement_levels",
      message: "Refinement levels must be an integer from 3 through 6.",
    });
    expect(invalid.previewFailure).not.toBeInstanceOf(Error);

    const runtimeFailure = new ConvergenceStudyFailure(
      "level_integration_failure",
      "Refinement level 3 failed.",
      { level: 2, stepSize: 0.03125 }
    );
    const record = toConvergenceFailureRecord(runtimeFailure);
    expect(record).toEqual({
      code: "level_integration_failure",
      message: "Refinement level 3 failed.",
      level: 2,
      stepSize: 0.03125,
    });
    expect(Object.isFrozen(record)).toBe(true);
    expect(JSON.parse(JSON.stringify(record))).toEqual(record);
  });

  it("updates fingerprint records immutably without using Map", () => {
    const firstState = createConvergenceUiState(snapshot());
    const secondState = setConvergenceDrawerOpen(firstState, true);
    const empty = {};
    const first = setConvergenceState(empty, "run-1", firstState);
    const second = setConvergenceState(first, "run-1", secondState);
    const removed = removeConvergenceState(second, "run-1");

    expect(empty).toEqual({});
    expect(getConvergenceState(first, "run-1")).toBe(firstState);
    expect(getConvergenceState(second, "run-1")).toBe(secondState);
    expect(getConvergenceState(first, "run-1")?.drawerOpen).toBe(false);
    expect(getConvergenceState(removed, "run-1")).toBeUndefined();
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(second)).toBe(true);
  });
});
