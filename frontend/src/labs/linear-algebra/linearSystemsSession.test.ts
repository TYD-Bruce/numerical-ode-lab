import { describe, expect, it } from "vitest";

import {
  computeLinearSystemsLabMeaningful,
  createLinearSystemsSession,
  createLinearSystemsResumeSummary,
  loadLinearSystemsPreset,
  replaceLinearSystemsDraft,
  resizeLinearSystemsDraft,
  runLinearSystemsSession,
  setLinearSystemsWorkflowStep,
  validateLinearSystemsDraft,
  type LinearSystemsDraft,
  type LinearSystemsSessionState,
} from "./linearSystemsSession";

function editableDraft(session: LinearSystemsSessionState): {
  dimension: number;
  A: string[][];
  b: string[];
} {
  return {
    dimension: session.dimension,
    A: session.ADraft.map((row) => [...row]),
    b: [...session.bDraft],
  };
}

function successfulRun(session: LinearSystemsSessionState): LinearSystemsSessionState {
  const outcome = runLinearSystemsSession(session);
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) throw new Error(outcome.error.message);
  return outcome.session;
}

describe("Linear Systems pure session", () => {
  it("creates the immutable Starter 3×3 session without meaningful work", () => {
    const session = createLinearSystemsSession();
    expect(session).toMatchObject({
      version: 1,
      step: "method",
      dimension: 3,
      selectedPresetId: "starter_3x3",
      resultStatus: "absent",
    });
    expect(session.latestSuccessfulResult).toBeUndefined();
    expect(session.ADraft).toEqual([
      ["3", "1", "-1"],
      ["2", "4", "1"],
      ["-1", "2", "5"],
    ]);
    expect(session.bDraft).toEqual(["6", "9", "-2"]);
    expect(computeLinearSystemsLabMeaningful(session)).toBe(false);
    expect(Object.isFrozen(session)).toBe(true);
    expect(Object.isFrozen(session.ADraft)).toBe(true);
    expect(Object.isFrozen(session.ADraft[0])).toBe(true);
  });

  it("owns workflow, deterministic resize, field validation, and privacy-safe Resume metadata", () => {
    const starter = createLinearSystemsSession();
    const data = setLinearSystemsWorkflowStep(starter, "data");
    expect(data.step).toBe("data");
    expect(computeLinearSystemsLabMeaningful(data)).toBe(false);

    const two = resizeLinearSystemsDraft(data, 2);
    expect(two).toMatchObject({ dimension: 2, step: "data" });
    expect(two.ADraft).toEqual([
      ["3", "1"],
      ["2", "4"],
    ]);
    expect(two.bDraft).toEqual(["6", "9"]);

    const six = resizeLinearSystemsDraft(data, 6);
    expect(six.dimension).toBe(6);
    expect(six.ADraft[0]?.slice(0, 3)).toEqual(["3", "1", "-1"]);
    expect(six.ADraft[5]).toEqual(["", "", "", "", "", ""]);
    expect(validateLinearSystemsDraft({
      dimension: six.dimension,
      A: six.ADraft,
      b: six.bDraft,
    })[0]).toMatchObject({ code: "incomplete", field: "A", row: 0, column: 3 });

    const malformed = editableDraft(data);
    malformed.A[0]![0] = "2 + 3";
    malformed.b[0] = "1e309";
    expect(validateLinearSystemsDraft(malformed).map((issue) => issue.code)).toEqual([
      "malformed",
      "non_finite",
    ]);

    const solved = successfulRun(data);
    expect(solved.step).toBe("output");
    const diagnostics = setLinearSystemsWorkflowStep(solved, "diagnostics");
    const summary = createLinearSystemsResumeSummary(diagnostics, 123);
    expect(summary).toEqual({
      moduleId: "linear_algebra",
      route: "/linear-algebra/linear-systems",
      labTitle: "Linear Systems Lab",
      stepLabel: "Diagnostics",
      methodLabel: "Gaussian elimination with partial pivoting",
      resultLabel: "Result current",
      lastMeaningfulInteraction: 123,
    });
    expect(JSON.stringify(summary)).not.toMatch(/\[\[|xHat|residual|trace|inputFingerprint/);
  });

  it("marks an edited preset Custom and removes reference authority", () => {
    const initial = successfulRun(createLinearSystemsSession());
    const draft = editableDraft(initial);
    draft.A[0]![0] = "3.5";
    const edited = replaceLinearSystemsDraft(initial, draft);
    expect(edited.selectedPresetId).toBeNull();
    expect(edited.resultStatus).toBe("stale");
    expect(edited.latestSuccessfulResult).toBe(initial.latestSuccessfulResult);

    const rerun = successfulRun(edited);
    expect(rerun.latestSuccessfulResult?.presetId).toBeUndefined();
    expect(rerun.latestSuccessfulResult?.referenceDifferenceInf).toBeUndefined();
  });

  it("restores preset identity, reference authority, and fingerprint exactly", () => {
    const initial = successfulRun(createLinearSystemsSession());
    const fingerprint = initial.inputFingerprint;
    const draft = editableDraft(initial);
    draft.A[0]![0] = "3.5";
    const edited = replaceLinearSystemsDraft(initial, draft);
    const restoredDraft = editableDraft(edited);
    restoredDraft.A[0]![0] = "3.0";
    const restored = replaceLinearSystemsDraft(edited, restoredDraft);

    expect(restored.selectedPresetId).toBe("starter_3x3");
    expect(restored.inputFingerprint).toBe(fingerprint);
    expect(restored.resultStatus).toBe("current");
    const rerun = successfulRun(restored);
    expect(rerun.latestSuccessfulResult?.presetId).toBe("starter_3x3");
    expect(rerun.latestSuccessfulResult?.referenceDifferenceInf).toBeDefined();
  });

  it("preserves the previous successful snapshot after a failed run", () => {
    const successful = successfulRun(createLinearSystemsSession());
    const prior = successful.latestSuccessfulResult;
    const invalidDraft = editableDraft(successful);
    invalidDraft.A[0]![0] = "not a number";
    const invalid = replaceLinearSystemsDraft(successful, invalidDraft);
    const failed = runLinearSystemsSession(invalid);

    expect(failed.ok).toBe(false);
    if (failed.ok) throw new Error("Expected the invalid draft to fail.");
    expect(failed).toMatchObject({ error: { code: "invalid_numeric_draft" } });
    expect(failed.error).not.toBeInstanceOf(Error);
    expect(failed.session).toBe(invalid);
    expect(failed.session.latestSuccessfulResult).toBe(prior);
    expect(failed.session.resultStatus).toBe("stale");
  });

  it("carries pivot-failure evidence without replacing the traced success", () => {
    const successful = successfulRun(createLinearSystemsSession());
    const prior = successful.latestSuccessfulResult;
    const draft = editableDraft(successful);
    draft.A = [
      ["1", "1", "1"],
      ["1", "1", "1"],
      ["1", "1", "1"],
    ];
    draft.b = ["3", "3", "3"];
    const singularDraft = replaceLinearSystemsDraft(successful, draft);
    const failed = runLinearSystemsSession(singularDraft);

    expect(failed.ok).toBe(false);
    if (failed.ok) throw new Error("Expected pivot-threshold failure.");
    expect(failed.error).toMatchObject({ code: "pivot_rejected" });
    expect("trace" in failed.error).toBe(true);
    expect(failed.session).toBe(singularDraft);
    expect(failed.session.latestSuccessfulResult).toBe(prior);
    expect(failed.session.latestSuccessfulResult?.trace).toBe(prior?.trace);
  });

  it("atomically replaces a successful snapshot only after a later success", () => {
    const first = successfulRun(createLinearSystemsSession());
    const prior = first.latestSuccessfulResult;
    const secondPreset = loadLinearSystemsPreset(first, "row_swap_required");
    expect(secondPreset.latestSuccessfulResult).toBe(prior);
    expect(secondPreset.resultStatus).toBe("stale");

    const second = successfulRun(secondPreset);
    expect(second.latestSuccessfulResult).not.toBe(prior);
    expect(second.latestSuccessfulResult?.presetId).toBe("row_swap_required");
    expect(second.resultStatus).toBe("current");
  });

  it("marks output stale on edit and current again when the successful fingerprint returns", () => {
    const successful = successfulRun(createLinearSystemsSession());
    const tracedSuccess = successful.latestSuccessfulResult;
    const trace = tracedSuccess?.trace;
    const draft = editableDraft(successful);
    draft.b[0] = "7";
    const stale = replaceLinearSystemsDraft(successful, draft);
    expect(stale.resultStatus).toBe("stale");
    expect(stale.latestSuccessfulResult).toBe(tracedSuccess);
    expect(stale.latestSuccessfulResult?.trace).toBe(trace);

    const restoredDraft = editableDraft(stale);
    restoredDraft.b[0] = "6";
    const restored = replaceLinearSystemsDraft(stale, restoredDraft);
    expect(restored.resultStatus).toBe("current");
    expect(restored.latestSuccessfulResult).toBe(tracedSuccess);
    expect(restored.latestSuccessfulResult?.trace).toBe(trace);
    expect(Object.isFrozen(trace)).toBe(true);
  });

  it("tracks meaningful work from input changes, alternate presets, and successful output", () => {
    const initial = createLinearSystemsSession();
    const draft = editableDraft(initial);
    draft.b[0] = "7";
    expect(computeLinearSystemsLabMeaningful(replaceLinearSystemsDraft(initial, draft))).toBe(
      true
    );
    expect(
      computeLinearSystemsLabMeaningful(loadLinearSystemsPreset(initial, "row_swap_required"))
    ).toBe(true);
    expect(computeLinearSystemsLabMeaningful(successfulRun(initial))).toBe(true);
  });

  it("defensively copies replacement drafts and exposes no mutable result aliases", () => {
    const initial = createLinearSystemsSession();
    const draft: LinearSystemsDraft = {
      dimension: 2,
      A: [
        ["2", "0"],
        ["0", "4"],
      ],
      b: ["2", "8"],
    };
    const replaced = replaceLinearSystemsDraft(initial, draft);
    (draft.A[0] as string[])[0] = "99";
    (draft.b as string[])[0] = "99";
    expect(replaced.ADraft[0]![0]).toBe("2");
    expect(replaced.bDraft[0]).toBe("2");

    const solved = successfulRun(replaced);
    expect(Object.isFrozen(solved.latestSuccessfulResult)).toBe(true);
    expect(Object.isFrozen(solved.latestSuccessfulResult?.xHat)).toBe(true);
    expect(() => (solved.latestSuccessfulResult!.xHat as number[]).push(99)).toThrow();
  });

  it("keeps invalid structural drafts pure and lets the run report validation failure", () => {
    const initial = createLinearSystemsSession();
    const invalid = replaceLinearSystemsDraft(initial, {
      dimension: 2,
      A: [["1", "0"]],
      b: ["1", "2"],
    });
    expect(invalid.selectedPresetId).toBeNull();
    expect(invalid.inputFingerprint).toBeNull();
    const run = runLinearSystemsSession(invalid);
    expect(run).toMatchObject({
      ok: false,
      error: { code: "draft_shape_mismatch" },
    });
  });
});
