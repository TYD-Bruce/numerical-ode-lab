import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createAppSessionStore } from "../app/appSessionStore";
import type { SolverResult } from "../solvers";
import { createSuccessfulExpressionSnapshot } from "../math/problemExpressions";
import { updatePresetProblemFields } from "../problemPresets";
import {
  createConvergenceUiState,
  createSuccessfulFirstOrderRunSnapshot,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
} from "../convergenceStudyState";
import {
  computeOdeLabMeaningful,
  createBeginnerStarterSession,
  createOdeResumeSummary,
  createReadonlySolverResult,
  getConvergenceState,
  hasSuccessfulConvergenceAnalysis,
  hasSuccessfulOutput,
  hasUnexecutedCoreDraft,
  removeConvergenceState,
  selectOdePersistedFormState,
  setConvergenceState,
  type OdeSessionState,
} from "./odeSession";

const RAW_RESULT: SolverResult = {
  points: [
    { t: 0, y: 1 },
    { t: 0.2, y: 0.8 },
  ],
  metadata: {
    displayName: "Forward Euler",
    family: "forward_euler",
    order: 1,
    formulaType: "one-step-explicit",
    formulaDisplay: "next = current + h f",
    coefficients: { alpha: [1, -1], beta: [1] },
    isImplicit: false,
    notes: ["Fixed-step result"],
  },
};

function withSuccessfulOutput(): OdeSessionState {
  const starter = createBeginnerStarterSession();
  const current = starter.form.current;
  const expression = createSuccessfulExpressionSnapshot(current.rhs.confirmed, "rhs", {
    exactSolutionEnabled: current.exactSolutionEnabled,
    exactSolution: current.exactSolution.confirmed,
    presetId: starter.form.presetId,
  });
  const firstOrderRun = createSuccessfulFirstOrderRunSnapshot({
    metadata: RAW_RESULT.metadata,
    rhs: current.rhs.confirmed,
    exactSolutionEnabled: true,
    exactSolution: current.exactSolution.confirmed,
    t0: Number(current.t0),
    y0: Number(current.y0),
    tEnd: Number(current.tEnd),
    runStepSize: Number(current.runStepSize),
    presetId: starter.form.presetId,
  });
  return {
    ...starter,
    step: "results",
    output: {
      single: {
        result: createReadonlySolverResult(RAW_RESULT),
        expression,
        firstOrderRun,
        problemInputs: {
          kind: "first_order",
          equationDisplay: expression.equationDisplay,
          t0: 0,
          y0: 1,
          tEnd: 5,
          h: 0.2,
        },
      },
    },
  };
}

describe("readonly solver-result ownership", () => {
  it("copies and freezes points and mutable metadata exactly once", () => {
    const source: SolverResult = structuredClone(RAW_RESULT);
    const snapshot = createReadonlySolverResult(source);

    expect(snapshot).toEqual(source);
    expect(snapshot.points).not.toBe(source.points);
    expect(snapshot.metadata.notes).not.toBe(source.metadata.notes);
    expect(snapshot.metadata.coefficients?.alpha).not.toBe(
      source.metadata.coefficients?.alpha
    );
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.points)).toBe(true);
    expect(Object.isFrozen(snapshot.points[0])).toBe(true);
    expect(Object.isFrozen(snapshot.metadata.notes)).toBe(true);

    source.points[0]!.y = 99;
    source.metadata.notes.push("mutated");
    source.metadata.coefficients!.alpha![0] = 99;
    expect(snapshot.points[0]!.y).toBe(1);
    expect(snapshot.metadata.notes).toEqual(["Fixed-step result"]);
    expect(snapshot.metadata.coefficients?.alpha).toEqual([1, -1]);
    expect(() => (snapshot.points as Array<unknown>).push({ t: 1, y: 0 })).toThrow();
  });
});

describe("pure ODE session compatibility and Convergence records", () => {
  it("round-trips a complete successful session through the pure store boundary", () => {
    const store = createAppSessionStore();
    const session = withSuccessfulOutput();
    store.setLab("ode", session, {
      labMeaningful: true,
      tutorMeaningful: false,
      meaningful: true,
    });

    const restored = store.getLab<OdeSessionState>("ode");
    expect(restored).toBe(session);
    expect(restored).toEqual(session);
    expect(Object.isFrozen(restored?.output.single?.result.points)).toBe(true);
    expect(restored?.output.single?.expression.expression.canonicalAst).toEqual(
      session.output.single?.expression.expression.canonicalAst
    );
  });

  it("round-trips the private main.ts persisted shape without a second first-order form store", () => {
    const session = createBeginnerStarterSession();
    const persisted = selectOdePersistedFormState(session);
    expect(persisted).toMatchObject({
      t0: "0",
      tEnd: "5",
      h: "0.2",
      y0: "1",
      u0: "1",
      v0: "0",
      order: "2",
    });
    expect(persisted.firstExpression).toBe(session.form.current.rhs);
    expect(persisted.exactExpression).toBe(session.form.current.exactSolution);
    expect(persisted.secondExpression).toBe(session.secondOrderForm.expression);
  });

  it("gets, replaces, and removes fingerprint state without mutating records", () => {
    const run = withSuccessfulOutput().output.single!.firstOrderRun!;
    const state = createConvergenceUiState(run);
    const empty = {};
    const first = setConvergenceState(empty, run.runFingerprint, state);
    const changed = setConvergenceState(
      first,
      run.runFingerprint,
      setConvergenceMetric(setConvergenceDrawerOpen(state, true), "final_time")
    );
    const removed = removeConvergenceState(changed, run.runFingerprint);

    expect(empty).toEqual({});
    expect(getConvergenceState(first, run.runFingerprint)).toBe(state);
    expect(getConvergenceState(changed, run.runFingerprint)?.drawerOpen).toBe(true);
    expect(getConvergenceState(first, run.runFingerprint)?.drawerOpen).toBe(false);
    expect(getConvergenceState(removed, run.runFingerprint)).toBeUndefined();
    expect(Object.isFrozen(changed)).toBe(true);
  });
});

describe("meaningful work and safe Resume selectors", () => {
  it("distinguishes executed output from a later unexecuted core draft", () => {
    const successful = withSuccessfulOutput();
    expect(hasSuccessfulOutput(successful)).toBe(true);
    expect(hasUnexecutedCoreDraft(successful)).toBe(false);

    const edited = {
      ...successful,
      form: updatePresetProblemFields(successful.form, {
        ...successful.form.current,
        runStepSize: "0.1",
      }),
    };
    expect(hasUnexecutedCoreDraft(edited)).toBe(true);
  });

  it("counts step advance, output, and analysis as Lab-meaningful", () => {
    const starter = createBeginnerStarterSession();
    expect(computeOdeLabMeaningful(starter)).toBe(false);
    expect(computeOdeLabMeaningful({ ...starter, step: "configure" })).toBe(true);

    const successful = withSuccessfulOutput();
    expect(computeOdeLabMeaningful(successful)).toBe(true);

    const run = successful.output.single!.firstOrderRun!;
    const convergence = {
      ...createConvergenceUiState(run),
      result: { configFingerprint: "stored" },
      resultStatus: "stale" as const,
    } as unknown as ReturnType<typeof createConvergenceUiState>;
    const analyzed = {
      ...starter,
      convergenceByFingerprint: setConvergenceState({}, run.runFingerprint, convergence),
    };
    expect(hasSuccessfulConvergenceAnalysis(analyzed)).toBe(true);
    expect(computeOdeLabMeaningful(analyzed)).toBe(true);
  });

  it("creates a compact Resume DTO with no equations, inputs, results, or Tutor text", () => {
    const session = withSuccessfulOutput();
    const summary = createOdeResumeSummary(session, 12345);
    expect(summary).toEqual({
      moduleId: "ode",
      route: "/ode/initial-value-problems",
      labTitle: "Initial Value Problems Lab",
      stepLabel: "Output",
      methodLabel: "Forward Euler",
      lastMeaningfulInteraction: 12345,
    });
    expect(Object.keys(summary)).not.toEqual(
      expect.arrayContaining(["rhs", "exactSolution", "t0", "y0", "tEnd", "h", "points"])
    );
    const serialized = JSON.stringify(summary);
    for (const prohibited of ["-y", "exp(-t)", "equationDisplay", "points", "Tutor"]) {
      expect(serialized).not.toContain(prohibited);
    }
  });

  it("uses approved step and current/stale analysis labels only", () => {
    const starter = createBeginnerStarterSession();
    expect(createOdeResumeSummary(starter, 1)).toMatchObject({
      stepLabel: "Method",
      methodLabel: "Forward Euler",
    });
    expect(
      createOdeResumeSummary({ ...starter, step: "configure" }, 2)
    ).toMatchObject({ stepLabel: "Data" });

    const successful = withSuccessfulOutput();
    const run = successful.output.single!.firstOrderRun!;
    const base = createConvergenceUiState(run);
    const current = {
      ...base,
      result: { configFingerprint: "stored" },
      resultStatus: "current" as const,
    } as unknown as typeof base;
    const stale = {
      ...current,
      resultStatus: "stale" as const,
    } as typeof base;
    const currentSummary = createOdeResumeSummary(
      {
        ...successful,
        convergenceByFingerprint: setConvergenceState(
          {},
          run.runFingerprint,
          current
        ),
      },
      3
    );
    const staleSummary = createOdeResumeSummary(
      {
        ...successful,
        convergenceByFingerprint: setConvergenceState(
          {},
          run.runFingerprint,
          stale
        ),
      },
      4
    );
    expect(currentSummary.analysisLabel).toBe("Analysis available");
    expect(staleSummary.analysisLabel).toBe("Analysis stale");
  });
});

describe("ODE session runtime boundary", () => {
  it("has no runtime imports of UI, Tutor, Chart.js, MathLive, or the production entry", () => {
    const directory = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(join(directory, "odeSession.ts"), "utf8");
    for (const forbidden of [
      "chart.js",
      "../main",
      "../aiTutor",
      "../aiTutorPanel",
      "convergenceStudyView",
      "editableMathField",
      "mathlive",
    ]) {
      expect(source).not.toContain(forbidden);
    }
    expect(source).not.toMatch(/import\s+(?!type)[^;]+from\s+["']\.\.\/solvers["']/);
    expect(source).not.toMatch(/\b(?:document|window|HTMLElement|Node)\b/);
  });
});
