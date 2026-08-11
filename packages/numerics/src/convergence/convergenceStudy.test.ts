import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { createMathExpression } from "../expressions/expression";
import { createMathExpressionFromLegacy } from "../expressions/legacyAdapter";
import type { SolverMetadata, SolverResult } from "../ode/solvers";
import {
  MAX_CONVERGENCE_STUDY_STEPS,
  buildConvergencePreview,
  createConvergenceStudyFingerprint,
  createSuccessfulRunFingerprint,
  fingerprintNumberKey,
  measureConvergenceLevel,
  preflightConvergenceStudy,
  validateAggregateStepBudget,
  validateConsistencyPermission,
  type ConvergencePreviewInput,
  type SuccessfulFirstOrderRunFingerprintInput,
} from "./convergenceStudy";
import { checkExactSolution } from "../ode/exactSolution";

function metadata(
  family: SolverMetadata["family"] = "rk4",
  order = 4
): SolverMetadata {
  return {
    displayName: family,
    family,
    order,
    formulaType: "test",
    formulaDisplay: "test",
    isImplicit: false,
    notes: [],
  };
}

function previewInput(overrides: Partial<ConvergencePreviewInput> = {}): ConvergencePreviewInput {
  return {
    t0: 0,
    tEnd: 1,
    baseStepSize: 0.25,
    refinementLevels: 3,
    method: metadata("rk4", 4),
    ...overrides,
  };
}

describe("convergence preview and preflight", () => {
  it("builds zero-based binary levels using validated grid step counts", () => {
    expect(buildConvergencePreview(previewInput())).toEqual({
      levels: [
        { level: 0, stepSize: 0.25, stepCount: 4 },
        { level: 1, stepSize: 0.125, stepCount: 8 },
        { level: 2, stepSize: 0.0625, stepCount: 16 },
      ],
      totalEstimatedSteps: 28,
    });
    expect(buildConvergencePreview(previewInput({ refinementLevels: 6 })).levels)
      .toHaveLength(6);
  });

  it.each([2, 7, 3.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid refinement level value %s",
    (refinementLevels) => {
      expect(() => buildConvergencePreview(previewInput({ refinementLevels })))
        .toThrow(expect.objectContaining({ code: "invalid_refinement_levels" }));
    }
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid study base h %s",
    (baseStepSize) => {
      expect(() => buildConvergencePreview(previewInput({ baseStepSize })))
        .toThrow(expect.objectContaining({ code: "invalid_base_step" }));
    }
  );

  it("wraps current fixed-grid alignment failures with level and h", () => {
    expect(() => buildConvergencePreview(previewInput({ baseStepSize: 0.3 }))).toThrow(
      expect.objectContaining({ code: "fixed_grid_failure", level: 0, stepSize: 0.3 })
    );
  });

  it("preserves the existing per-level 100,000-step cap", () => {
    expect(() => buildConvergencePreview(previewInput({
      tEnd: 100_001,
      baseStepSize: 1,
    }))).toThrow(expect.objectContaining({ code: "per_level_step_cap", level: 0 }));
  });

  it.each(["adams_bashforth", "adams_moulton", "bdf"] as const)(
    "accepts N = p and rejects N < p for %s",
    (family) => {
      expect(buildConvergencePreview(previewInput({
        tEnd: 4,
        baseStepSize: 1,
        method: metadata(family, 4),
      })).levels[0]?.stepCount).toBe(4);
      expect(() => buildConvergencePreview(previewInput({
        tEnd: 3,
        baseStepSize: 1,
        method: metadata(family, 4),
      }))).toThrow(expect.objectContaining({ code: "multistep_insufficient_steps" }));
    }
  );

  it("does not apply the multistep minimum to one-step families", () => {
    expect(buildConvergencePreview(previewInput({
      tEnd: 1,
      baseStepSize: 1,
      method: metadata("forward_euler", 4),
    })).levels[0]?.stepCount).toBe(1);
  });

  it("keeps the aggregate budget as a pure defense-in-depth boundary", () => {
    expect(validateAggregateStepBudget(249_999)).toBe(249_999);
    expect(validateAggregateStepBudget(MAX_CONVERGENCE_STUDY_STEPS)).toBe(250_000);
    expect(() => validateAggregateStepBudget(250_001)).toThrow(
      expect.objectContaining({ code: "aggregate_step_budget" })
    );
    expect(() => validateAggregateStepBudget(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      expect.objectContaining({ code: "aggregate_step_budget" })
    );
  });

  it("demonstrates the maximum valid six-level total remains below 250,000", () => {
    const preview = buildConvergencePreview(previewInput({
      tEnd: 100_000,
      baseStepSize: 32,
      refinementLevels: 6,
    }));
    expect(preview.levels.at(-1)?.stepCount).toBe(100_000);
    expect(preview.totalEstimatedSteps).toBe(196_875);
    expect(preview.totalEstimatedSteps).toBeLessThan(MAX_CONVERGENCE_STUDY_STEPS);
  });

  it.each([
    { baseStepSize: 0 },
    { refinementLevels: 2 },
    { baseStepSize: 0.3 },
    { tEnd: 100_001, baseStepSize: 1 },
    { tEnd: 3, baseStepSize: 1, method: metadata("bdf", 4) },
  ] satisfies Array<Partial<ConvergencePreviewInput>>)(
    "never invokes integration when preflight rejects %#",
    (overrides) => {
      const integrateFirstOrder = vi.fn();
      expect(() => preflightConvergenceStudy(previewInput(overrides), {
        integrateFirstOrder,
      } as never)).toThrow();
      expect(integrateFirstOrder).not.toHaveBeenCalled();
    }
  );

  it("rejects Leap-Frog metadata without invoking integration", () => {
    const integrateFirstOrder = vi.fn();
    expect(() => preflightConvergenceStudy(previewInput({
      method: metadata("leapfrog", 2),
    }), { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({ code: "metadata_contract_failure" })
    );
    expect(integrateFirstOrder).not.toHaveBeenCalled();
  });
});

describe("convergence fingerprints", () => {
  const rhs = createMathExpressionFromLegacy("-y", "rhs");
  const exact = createMathExpressionFromLegacy("exp(-t)", "exact_solution");
  const base: SuccessfulFirstOrderRunFingerprintInput = {
    method: metadata("rk4", 4),
    rhs,
    t0: 0,
    tEnd: 1,
    y0: 1,
    runStepSize: 0.1,
    exactEnabled: true,
    exactSolution: exact,
    presetId: "exponential_decay",
  };

  it("uses a deterministic ordered versioned tuple and canonical AST meaning", () => {
    const first = createSuccessfulRunFingerprint(base);
    const displayVariant = createMathExpression("display text is not authority", rhs.canonicalAst, "rhs");
    const second = createSuccessfulRunFingerprint({ ...base, rhs: displayVariant });
    expect(first).toBe(second);
    expect(JSON.parse(first)[0]).toBe("ode-run-v1");
    expect(first).not.toContain("display text is not authority");
    expect(first).not.toContain(rhs.latex);
  });

  it("changes for every specified run field", () => {
    const original = createSuccessfulRunFingerprint(base);
    const variants: SuccessfulFirstOrderRunFingerprintInput[] = [
      { ...base, method: metadata("rk4", 3) },
      { ...base, method: metadata("forward_euler", 1) },
      { ...base, rhs: createMathExpressionFromLegacy("y", "rhs") },
      { ...base, t0: 0.1 },
      { ...base, tEnd: 2 },
      { ...base, y0: 2 },
      { ...base, runStepSize: 0.2 },
      { ...base, exactEnabled: false, exactSolution: undefined },
      { ...base, exactSolution: createMathExpressionFromLegacy("exp(t)", "exact_solution") },
      { ...base, presetId: "other" },
      { ...base, customizationSourcePresetId: "exponential_decay" },
    ];
    for (const variant of variants) {
      expect(createSuccessfulRunFingerprint(variant)).not.toBe(original);
    }
  });

  it("normalizes negative zero and uses null for disabled exact meaning", () => {
    expect(fingerprintNumberKey(-0)).toBe("0");
    expect(fingerprintNumberKey(0)).toBe("0");
    expect(createSuccessfulRunFingerprint({ ...base, t0: -0 }))
      .toBe(createSuccessfulRunFingerprint({ ...base, t0: 0 }));
    const disabled = JSON.parse(createSuccessfulRunFingerprint({
      ...base,
      exactEnabled: false,
      exactSolution: undefined,
    }));
    expect(disabled[8]).toBe(false);
    expect(disabled[9]).toBeNull();
  });

  it("rejects non-finite and inconsistent fingerprint inputs", () => {
    expect(() => createSuccessfulRunFingerprint({ ...base, y0: Number.NaN })).toThrow(
      expect.objectContaining({ code: "invalid_fingerprint_input" })
    );
    expect(() => createSuccessfulRunFingerprint({
      ...base, exactEnabled: true, exactSolution: undefined,
    })).toThrow(expect.objectContaining({ code: "invalid_fingerprint_input" }));
  });

  it("creates deterministic study fingerprints from run and study settings", () => {
    const runFingerprint = createSuccessfulRunFingerprint(base);
    const study = createConvergenceStudyFingerprint({
      runFingerprint,
      studyBaseStepSize: 0.2,
      refinementLevels: 3,
    });
    expect(JSON.parse(study)).toEqual([
      "convergence-study-v1",
      runFingerprint,
      "0.2",
      3,
    ]);
    expect(createConvergenceStudyFingerprint({
      runFingerprint,
      studyBaseStepSize: 0.1,
      refinementLevels: 3,
    })).not.toBe(study);
    expect(createConvergenceStudyFingerprint({
      runFingerprint,
      studyBaseStepSize: 0.2,
      refinementLevels: 4,
    })).not.toBe(study);
  });
});

describe("convergence level measurement", () => {
  function result(points: SolverResult["points"]): SolverResult {
    return { points, metadata: metadata("rk4", 4) };
  }

  it("measures endpoint and maximum errors on actual returned times", () => {
    const exact = vi.fn((t: number, t0: number, y0: number) => y0 + (t - t0));
    const measured = measureConvergenceLevel({
      result: result([
        { t: 2, y: 5 },
        { t: 2.4, y: 6 },
        { t: 2.9, y: 5.8 },
      ]),
      exactSolution: exact,
      t0: 2,
      y0: 5,
      stepSize: 0.4,
    });
    expect(measured).toMatchObject({
      stepCount: 2,
      finalNumericalValue: 5.8,
      finalExactValue: 5.9,
      maximumErrorTime: 2.4,
      methodFamily: "rk4",
      methodOrder: 4,
    });
    expect(measured.finalTimeError).toBeCloseTo(0.1);
    expect(measured.maximumGlobalError).toBeCloseTo(0.6);
    expect(exact.mock.calls).toEqual([
      [2, 2, 5],
      [2.4, 2, 5],
      [2.9, 2, 5],
    ]);
  });

  it("retains the earliest maximum-error time on exact ties", () => {
    const measured = measureConvergenceLevel({
      result: result([
        { t: 0, y: 1 },
        { t: 0.5, y: -1 },
        { t: 1, y: 0.25 },
      ]),
      exactSolution: () => 0,
      t0: 0,
      y0: 0,
      stepSize: 0.5,
    });
    expect(measured.maximumGlobalError).toBe(1);
    expect(measured.maximumErrorTime).toBe(0);
  });

  it("retains scale thresholds from their respective maximum and final points", () => {
    const measured = measureConvergenceLevel({
      result: result([
        { t: 0, y: 0 },
        { t: 0.5, y: 100 },
        { t: 1, y: 2 },
      ]),
      exactSolution: () => 0,
      t0: 0,
      y0: 0,
      stepSize: 0.5,
    });
    expect(measured.maximumResolutionThreshold).toBe(100 * Number.EPSILON * 100);
    expect(measured.finalResolutionThreshold).toBe(100 * Number.EPSILON * 2);
  });

  it.each([
    { points: [], exact: () => 0, code: "invalid_solver_points" },
    { points: [{ t: 0, y: Number.NaN }], exact: () => 0, code: "invalid_solver_points" },
    { points: [{ t: 0, y: 0 }], exact: () => Number.POSITIVE_INFINITY, code: "exact_evaluation_failure" },
    { points: [{ t: 0, y: 0 }], exact: () => { throw new Error("hidden"); }, code: "exact_evaluation_failure" },
  ])("rejects invalid synthetic measurement %#", ({ points, exact, code }) => {
    expect(() => measureConvergenceLevel({
      result: result(points),
      exactSolution: exact,
      t0: 0,
      y0: 0,
      stepSize: 0.1,
    })).toThrow(expect.objectContaining({ code }));
  });

  it("rejects metadata outside the first-order contract", () => {
    expect(() => measureConvergenceLevel({
      result: { points: [{ t: 0, y: 0 }], metadata: metadata("leapfrog", 2) },
      exactSolution: () => 0,
      t0: 0,
      y0: 0,
      stepSize: 0.1,
    })).toThrow(expect.objectContaining({ code: "metadata_contract_failure" }));
  });
});

describe("consistency permission and pure convergence scope", () => {
  it("treats warning permission as immutable input rather than state", () => {
    const warning = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: (t) => 1 + 5e-5 * t,
      rhs: () => 0,
    });
    expect(() => validateConsistencyPermission(warning, false)).toThrow(
      expect.objectContaining({ code: "warning_confirmation_required" })
    );
    expect(() => validateConsistencyPermission(warning, true)).not.toThrow();
    expect(warning.status).toBe("warning");
  });

  it("keeps the convergence modules pure and free of Phase D UI or Tutor integration", () => {
    const source = ["../ode/exactSolution.ts", "./convergenceStudy.ts"]
      .map((path) => readFileSync(new URL(path, import.meta.url), "utf8"))
      .join("\n");
    expect(source).toContain(
      "The recent maximum-global-error observed orders are consistent across levels"
    );
    expect(source).not.toContain("The recent maximum-error orders are stable");
    expect(source).not.toMatch(/chart\.js|mathlive|Mathfield|document\.|window\.|innerHTML/);
    expect(source).not.toMatch(/aiTutor|Convergence Study drawer/);
    expect(source).not.toMatch(/\bnew\s+Function\b|\beval\s*\(/);
  });
});
