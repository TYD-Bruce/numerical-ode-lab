import { describe, expect, it, vi } from "vitest";
import { createMathExpressionFromLegacy } from "../expressions/legacyAdapter";
import type {
  FirstOrderParams,
  MethodConfig,
  SolverMetadata,
  SolverResult,
} from "../ode/solvers";
import { checkExactSolution } from "../ode/exactSolution";
import {
  assessObservedOrder,
  attachObservedOrders,
  buildConvergenceChartModel,
  interpretConvergence,
  runConvergenceStudy,
  type ConvergenceLevelResult,
  type ConvergenceStudyConfig,
  type ConvergenceStudyResult,
  type ObservedOrderAssessment,
} from "./convergenceStudy";

function metadata(family: SolverMetadata["family"], order: number): SolverMetadata {
  return {
    displayName: family,
    family,
    order,
    formulaType: "test",
    formulaDisplay: "test",
    isImplicit: family === "backward_euler" || family === "adams_moulton" || family === "bdf",
    notes: [],
  };
}

function level(
  index: number,
  maximumError: number,
  maximumObservedOrder?: ObservedOrderAssessment,
  finalError = maximumError,
  finalObservedOrder?: ObservedOrderAssessment
): ConvergenceLevelResult {
  return {
    level: index,
    stepSize: 1 / 2 ** index,
    stepCount: 2 ** index,
    finalNumericalValue: finalError,
    finalExactValue: 0,
    finalTimeError: finalError,
    finalResolutionThreshold: 1e-15,
    maximumGlobalError: maximumError,
    maximumErrorTime: 0.5,
    maximumResolutionThreshold: 1e-15,
    ...(finalObservedOrder ? { finalObservedOrder } : {}),
    ...(maximumObservedOrder ? { maximumObservedOrder } : {}),
  };
}

function assessment(
  coarseLevel: number,
  fineLevel: number,
  status: ObservedOrderAssessment["status"],
  value?: number
): ObservedOrderAssessment {
  return {
    coarseLevel,
    fineLevel,
    status,
    message: status,
    ...(value === undefined ? {} : { value }),
  };
}

function interpretationLevels(
  orders: readonly { status: ObservedOrderAssessment["status"]; value?: number }[],
  errors?: readonly number[]
): ConvergenceLevelResult[] {
  const values = errors ?? Array.from({ length: orders.length + 1 }, (_, index) => 2 ** -index);
  return values.map((error, index) =>
    level(
      index,
      error,
      index === 0
        ? undefined
        : assessment(index - 1, index, orders[index - 1]!.status, orders[index - 1]!.value)
    )
  );
}

describe("observed-order assessment", () => {
  const base = {
    coarseError: 1,
    fineError: 0.25,
    coarseThreshold: 1e-14,
    fineThreshold: 1e-14,
    coarseLevel: 0,
    fineLevel: 1,
  };

  it("applies every status in the approved defensive precedence", () => {
    expect(assessObservedOrder({ ...base, coarseError: Number.NaN }).status).toBe("unavailable");
    expect(assessObservedOrder({ ...base, coarseError: 1e-16 }).status).toBe("below_resolution");
    const negative = assessObservedOrder({ ...base, fineError: 1 + 1e-14 });
    expect(negative.status).toBe("negative");
    expect(negative.value).toBeLessThan(0);
    expect(assessObservedOrder({ ...base, fineError: 1 })).toMatchObject({
      status: "no_improvement",
      value: 0,
    });
    const nearZero = assessObservedOrder({ ...base, fineError: 0.95 });
    expect(nearZero.status).toBe("near_zero");
    expect(nearZero.value).toBeCloseTo(Math.log2(1 / 0.95));
    expect(assessObservedOrder(base)).toMatchObject({ status: "reliable", value: 2 });
    expect(assessObservedOrder({
      ...base, coarseError: -1, fineError: -2, coarseThreshold: -3, fineThreshold: -3,
    }).status).toBe("unavailable");
  });

  it("keeps even a very small increase negative before near-equality", () => {
    const result = assessObservedOrder({ ...base, fineError: 1 + 1e-14 });
    expect(result.status).toBe("negative");
    expect(result.message).toContain("Possible, unproven causes");
  });

  it("uses the exact resolution and near-zero boundaries", () => {
    expect(assessObservedOrder({ ...base, coarseError: 1e-14 }).status).toBe("below_resolution");
    expect(assessObservedOrder({ ...base, fineError: 1 / 2 ** 0.1 }).status).toBe("near_zero");
    expect(assessObservedOrder({ ...base, fineError: 1 / 2 ** 0.100001 }).status).toBe("reliable");
  });

  it("keeps final-time and maximum-error streams independent", () => {
    const rows = attachObservedOrders([
      level(0, 1, undefined, 1) as Omit<ConvergenceLevelResult, "finalObservedOrder" | "maximumObservedOrder">,
      level(1, 0.25, undefined, 0.5) as Omit<ConvergenceLevelResult, "finalObservedOrder" | "maximumObservedOrder">,
    ]);
    expect(rows[1]?.maximumObservedOrder).toMatchObject({ status: "reliable", value: 2 });
    expect(rows[1]?.finalObservedOrder).toMatchObject({ status: "reliable", value: 1 });
  });
});

describe("maximum-error interpretation", () => {
  it("covers all five categories", () => {
    const consistent = interpretConvergence(interpretationLevels([
      { status: "reliable", value: 3.9 }, { status: "reliable", value: 4.05 },
    ]), 4);
    expect(consistent.kind).toBe("consistent_with_theory");
    expect(consistent.explanation).toBe(
      "The recent maximum-global-error observed orders are consistent across levels, and the latest reliable value is within 0.400 of the theoretical order."
    );
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 2 }, { status: "reliable", value: 3 },
    ]), 4).kind).toBe("approaching_theory");
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 2.5 },
    ]), 4).kind).toBe("not_yet_asymptotic");
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 2 }, { status: "negative", value: -0.2 },
    ], [1, 0.25, 0.3]), 4).kind).toBe("refinement_not_improving");
    expect(interpretConvergence(interpretationLevels([
      { status: "below_resolution" },
    ]), 4).kind).toBe("order_unavailable");
  });

  it("accepts exact theory tolerance and spread boundaries", () => {
    const exactTolerance = interpretationLevels([
      { status: "reliable", value: 3.65 },
      { status: "reliable", value: 3.6 },
    ]);
    expect(interpretConvergence(exactTolerance, 4).kind).toBe("consistent_with_theory");
    const exactSpread = interpretationLevels([
      { status: "reliable", value: 3.65 },
      { status: "reliable", value: 4 },
    ]);
    expect(interpretConvergence(exactSpread, 4).kind).toBe("consistent_with_theory");
    const aboveSpread = interpretationLevels([
      { status: "reliable", value: 3.649 },
      { status: "reliable", value: 4 },
    ]);
    expect(interpretConvergence(aboveSpread, 4).kind).toBe("not_yet_asymptotic");
    const outsideTolerance = interpretationLevels([
      { status: "reliable", value: 3.5 },
      { status: "reliable", value: 3.599 },
    ]);
    expect(interpretConvergence(outsideTolerance, 4).kind).not.toBe("consistent_with_theory");
  });

  it("selects exact recent evidence and the final reliable primary value", () => {
    const result = interpretConvergence(interpretationLevels([
      { status: "reliable", value: 3.7 },
      { status: "reliable", value: 3.8 },
      { status: "reliable", value: 3.9 },
      { status: "reliable", value: 4.0 },
    ]), 4);
    expect(result.primaryObservedOrder).toBe(4);
    expect(result.evidencePairs).toEqual([[1, 2], [2, 3], [3, 4]]);
  });

  it("uses only the newest two assessments for non-improvement precedence", () => {
    const olderNegative = interpretationLevels([
      { status: "negative", value: -0.2 },
      { status: "reliable", value: 3.8 },
      { status: "reliable", value: 3.9 },
    ], [8, 9, 4, 2]);
    expect(interpretConvergence(olderNegative, 4).kind).toBe("consistent_with_theory");
    const newestNoImprovement = interpretationLevels([
      { status: "reliable", value: 3.8 },
      { status: "no_improvement", value: 0 },
    ]);
    expect(interpretConvergence(newestNoImprovement, 4)).toMatchObject({
      kind: "refinement_not_improving",
      evidencePairs: [[1, 2]],
    });
  });

  it("retains earlier reliable evidence after a below-resolution pair", () => {
    const levels = interpretationLevels([
      { status: "reliable", value: 3.9 },
      { status: "reliable", value: 4.0 },
      { status: "below_resolution" },
    ]);
    const result = interpretConvergence(levels, 4);
    expect(result.kind).toBe("consistent_with_theory");
    expect(result.primaryObservedOrder).toBe(4);
    expect(result.evidencePairs).toEqual([[0, 1], [1, 2]]);
  });

  it("requires strict movement toward theory", () => {
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 2 }, { status: "reliable", value: 3 },
    ]), 4).kind).toBe("approaching_theory");
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 3 }, { status: "reliable", value: 5 },
    ]), 4).kind).toBe("not_yet_asymptotic");
    expect(interpretConvergence(interpretationLevels([
      { status: "reliable", value: 2 },
      { status: "reliable", value: 5 },
      { status: "reliable", value: 2.5 },
    ]), 4).kind).toBe("not_yet_asymptotic");
  });
});

function passedConsistency() {
  return checkExactSolution({
    t0: 0, tEnd: 1, y0: 0, exactSolution: () => 0, rhs: () => 0,
  });
}

function studyResult(levels: ConvergenceLevelResult[], theoreticalOrder = 4): ConvergenceStudyResult {
  return {
    configFingerprint: "study",
    runFingerprint: "run",
    theoreticalOrder,
    consistencyCheck: passedConsistency(),
    levels,
    interpretation: interpretConvergence(levels, theoreticalOrder),
  };
}

describe("pure convergence chart model", () => {
  it("anchors the theoretical slope at the finest reliable measured point", () => {
    const levels = attachObservedOrders([level(0, 1e-2), level(1, 1e-3), level(2, 1e-4)]);
    const chart = buildConvergenceChartModel(studyResult([...levels], 4), "maximum_global");
    expect(chart.measured.map((point) => point.level)).toEqual([0, 1, 2]);
    expect(chart.measured[2]?.observedOrder).toBeCloseTo(Math.log2(10));
    expect(chart.reference[2]?.error).toBeCloseTo(1e-4);
    expect(chart.referenceExplanation).toContain("slope only");
    expect(chart.referenceExplanation).toContain("not use a known theoretical error constant");
  });

  it("keeps final and maximum metrics independent", () => {
    const levels = attachObservedOrders([
      level(0, 1e-2, undefined, 1e-16),
      level(1, 1e-3, undefined, 1e-16),
      level(2, 1e-4, undefined, 1e-16),
    ]);
    const result = studyResult([...levels]);
    expect(buildConvergenceChartModel(result, "maximum_global").reference.length).toBeGreaterThan(0);
    expect(buildConvergenceChartModel(result, "final_time").reference).toEqual([]);
  });

  it("omits zero and resolution-limited levels with readable reasons", () => {
    const levels = attachObservedOrders([
      { ...level(0, 0), maximumResolutionThreshold: 1e-15 },
      { ...level(1, 1e-16), maximumResolutionThreshold: 1e-15 },
      level(2, 1e-4),
    ]);
    const chart = buildConvergenceChartModel(studyResult([...levels]), "maximum_global");
    expect(chart.measured.map((point) => point.level)).toEqual([2]);
    expect(chart.omittedLevels).toHaveLength(2);
    expect(chart.reference).toEqual([]);
  });

  it("returns a safe empty reference if generated values are not finite and positive", () => {
    const levels = attachObservedOrders([level(0, 1), level(1, 0.5), level(2, 0.25)]);
    const chart = buildConvergenceChartModel(studyResult([...levels], 10_000), "maximum_global");
    expect(chart.measured).toHaveLength(3);
    expect(chart.reference).toEqual([]);
  });
});

function config(overrides: Partial<ConvergenceStudyConfig> = {}): ConvergenceStudyConfig {
  return {
    t0: 0,
    tEnd: 1,
    y0: 1,
    baseStepSize: 0.25,
    refinementLevels: 3,
    method: { family: "rk4", order: 4 },
    rhs: createMathExpressionFromLegacy("-y", "rhs"),
    exactSolution: createMathExpressionFromLegacy("exp(-t)", "exact_solution"),
    runFingerprint: "run-test",
    allowConsistencyWarning: false,
    ...overrides,
  };
}

function stubPoints(params: FirstOrderParams, errorScale: number): SolverResult["points"] {
  const steps = Math.round((params.tEnd - params.t0) / params.h);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = params.t0 + index * params.h;
    return { t, y: Math.exp(-t) + (index === 0 ? 0 : errorScale) };
  });
}

describe("pure coarse-to-fine runner", () => {
  it("integrates every level coarse to fine and returns aggregate serializable rows", () => {
    const calls: number[] = [];
    const integrateFirstOrder = vi.fn((method: MethodConfig, params: FirstOrderParams) => {
      calls.push(params.h);
      return {
        points: stubPoints(params, params.h ** 4),
        metadata: metadata(method.family, method.order ?? 4),
      };
    });
    const frozen = Object.freeze(config());
    const result = runConvergenceStudy(frozen, { integrateFirstOrder } as never);
    expect(calls).toEqual([0.25, 0.125, 0.0625]);
    expect(integrateFirstOrder).toHaveBeenCalledTimes(3);
    expect(result.levels).toHaveLength(3);
    expect(result.theoreticalOrder).toBe(4);
    expect(result.configFingerprint).toContain("convergence-study-v1");
    expect(JSON.stringify(result)).not.toContain("points");
    expect(JSON.stringify(result)).not.toContain("canonicalAst");
    expect(frozen.baseStepSize).toBe(0.25);
  });

  it("blocks hard exact failures and unconfirmed warnings before integration", () => {
    const integrateFirstOrder = vi.fn();
    expect(() => runConvergenceStudy(config({
      exactSolution: createMathExpressionFromLegacy("2*exp(-t)", "exact_solution"),
    }), { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({ code: "exact_solution_blocked" })
    );
    expect(integrateFirstOrder).not.toHaveBeenCalled();

    const warningConfig = config({
      rhs: createMathExpressionFromLegacy("0", "rhs"),
      exactSolution: createMathExpressionFromLegacy("1+0.00005*t", "exact_solution"),
    });
    expect(() => runConvergenceStudy(warningConfig, { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({ code: "warning_confirmation_required" })
    );
    expect(integrateFirstOrder).not.toHaveBeenCalled();
  });

  it("proceeds on an explicitly allowed warning without mutating config", () => {
    const integrateFirstOrder = vi.fn((method: MethodConfig, params: FirstOrderParams) => ({
      points: Array.from({ length: Math.round(1 / params.h) + 1 }, (_, index) => ({
        t: index * params.h,
        y: 1,
      })),
      metadata: metadata(method.family, method.order ?? 1),
    }));
    const value = config({
      method: { family: "forward_euler", order: 1 },
      rhs: createMathExpressionFromLegacy("0", "rhs"),
      exactSolution: createMathExpressionFromLegacy("1+0.00005*t", "exact_solution"),
      allowConsistencyWarning: true,
    });
    const before = JSON.stringify(value);
    expect(runConvergenceStudy(value, { integrateFirstOrder } as never).consistencyCheck.status)
      .toBe("warning");
    expect(integrateFirstOrder).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(value)).toBe(before);
  });

  it("aborts on metadata mismatch without publishing a partial result", () => {
    let count = 0;
    const integrateFirstOrder = vi.fn((method: MethodConfig, params: FirstOrderParams) => {
      count += 1;
      return {
        points: stubPoints(params, params.h ** 4),
        metadata: metadata(method.family, count === 2 ? 3 : method.order ?? 4),
      };
    });
    expect(() => runConvergenceStudy(config(), { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({ code: "metadata_contract_failure", level: 1 })
    );
    expect(integrateFirstOrder).toHaveBeenCalledTimes(2);
  });

  it("wraps a failed level and does not execute later levels", () => {
    let count = 0;
    const integrateFirstOrder = vi.fn((method: MethodConfig, params: FirstOrderParams) => {
      count += 1;
      if (count === 2) throw new Error("Newton solve did not converge.");
      return { points: stubPoints(params, params.h ** 4), metadata: metadata(method.family, 4) };
    });
    expect(() => runConvergenceStudy(config(), { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({
        code: "level_integration_failure",
        level: 1,
        stepSize: 0.125,
        message: expect.stringContaining("Newton solve did not converge"),
      })
    );
    expect(integrateFirstOrder).toHaveBeenCalledTimes(2);
  });

  it("rejects an incorrect returned step count", () => {
    const integrateFirstOrder = vi.fn((method: MethodConfig) => ({
      points: [{ t: 0, y: 1 }, { t: 1, y: Math.exp(-1) }],
      metadata: metadata(method.family, 4),
    }));
    expect(() => runConvergenceStudy(config(), { integrateFirstOrder } as never)).toThrow(
      expect.objectContaining({ code: "metadata_contract_failure", level: 0 })
    );
  });
});

describe("deterministic current-solver convergence evidence", () => {
  it.each([
    ["Forward Euler", { family: "forward_euler", order: 1 }, 0.1, 0.85, 1.15],
    ["Taylor 2", { family: "taylor", order: 2 }, 0.1, 1.8, 2.2],
    ["RK4", { family: "rk4", order: 4 }, 0.2, 3.7, 4.3],
    ["AB3", { family: "adams_bashforth", order: 3 }, 0.1, 2.6, 3.3],
    ["AM3", { family: "adams_moulton", order: 3 }, 0.1, 2.6, 3.3],
    ["BDF3", { family: "bdf", order: 3 }, 0.1, 2.6, 3.3],
  ] as const)("reports stable maximum-error order for %s", (_name, method, baseH, low, high) => {
    const result = runConvergenceStudy(config({
      method,
      baseStepSize: baseH,
      refinementLevels: 4,
    }));
    const reliable = result.levels
      .map((row) => row.maximumObservedOrder)
      .filter((value) => value?.status === "reliable");
    expect(reliable).toHaveLength(3);
    for (const value of reliable) {
      expect(value!.value).toBeGreaterThanOrEqual(low);
      expect(value!.value).toBeLessThanOrEqual(high);
    }
  });

  it("measures BDF6 near order five because fixed RK4 startup values have O(h^5) errors", () => {
    const result = runConvergenceStudy(config({
      method: { family: "bdf", order: 6 },
      baseStepSize: 0.1,
      refinementLevels: 3,
    }));
    expect(result.theoreticalOrder).toBe(6);
    const finalOrders = result.levels.slice(1).map((row) => row.finalObservedOrder?.value);
    for (const order of finalOrders) {
      expect(order).toBeGreaterThanOrEqual(4.5);
      expect(order).toBeLessThanOrEqual(5.5);
    }
    expect(result.interpretation.kind).not.toBe("consistent_with_theory");
  });
});
