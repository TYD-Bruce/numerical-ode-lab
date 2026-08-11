import { describe, expect, it, vi } from "vitest";
import {
  DERIVATIVE_STRONG_WARNING_THRESHOLD,
  DERIVATIVE_WARNING_THRESHOLD,
  EXACT_INITIAL_ATOL,
  EXACT_INITIAL_RTOL,
  EXACT_SOLUTION_CHECK_STATEMENT,
  checkExactSolution,
  derivativeProbeStep,
  exactSolutionCheckLocations,
} from "./exactSolution";

describe("exact-solution consistency checking", () => {
  it("uses exactly nine uniform locations including both endpoints", () => {
    expect(exactSolutionCheckLocations(2, 10)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(() => exactSolutionCheckLocations(1, 1)).toThrow("greater than");
    expect(() => exactSolutionCheckLocations(Number.NaN, 1)).toThrow("finite");
  });

  it("uses the approved local scale-aware difference step", () => {
    expect(derivativeProbeStep(0.5, 0, 1)).toBe(1e-6);
    expect(derivativeProbeStep(50, 0, 100)).toBeCloseTo(100e-6, 15);
    expect(derivativeProbeStep(1e9, 1e9, 1e9 + 1)).toBe(0.125);
    expect(derivativeProbeStep(5e-9, 0, 1e-8)).toBe(1.25e-9);
  });

  it.each([
    {
      name: "exponential decay",
      t0: 0,
      tEnd: 1,
      y0: 1,
      exact: (t: number) => Math.exp(-t),
      rhs: (_t: number, y: number) => -y,
    },
    {
      name: "oscillatory forcing",
      t0: 0,
      tEnd: 6,
      y0: 0,
      exact: (t: number) => Math.sin(t),
      rhs: (t: number) => Math.cos(t),
    },
    {
      name: "logistic growth",
      t0: 0,
      tEnd: 10,
      y0: 0.5,
      exact: (t: number) => 1 / (1 + Math.exp(-t)),
      rhs: (_t: number, y: number) => y * (1 - y),
    },
  ])("passes the correct curved $name solution", ({ t0, tEnd, y0, exact, rhs }) => {
    const result = checkExactSolution({ t0, tEnd, y0, exactSolution: exact, rhs });
    expect(result.status).toBe("passed");
    expect(result.sampleCount).toBe(9);
    expect(result.probes).toHaveLength(9);
    expect(result.issues).toEqual([]);
    expect(result.maximumNormalizedResidual).toBeLessThanOrEqual(
      DERIVATIVE_WARNING_THRESHOLD
    );
  });

  it("records one forward, seven central, and one backward local probe", () => {
    const calls: number[] = [];
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 0,
      exactSolution: (t) => {
        calls.push(t);
        return t;
      },
      rhs: () => 1,
    });
    expect(result.probes.map((probe) => probe.scheme)).toEqual([
      "forward",
      "central",
      "central",
      "central",
      "central",
      "central",
      "central",
      "central",
      "backward",
    ]);
    for (const probe of result.probes) {
      expect(probe.differenceStep).toBe(
        Math.min(1 / 8, 1e-6 * Math.max(1, Math.abs(probe.t), 1))
      );
    }
    expect(Math.min(...calls)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...calls)).toBeLessThanOrEqual(1);
    expect(calls).toContain(1e-6);
    expect(calls).toContain(0.125 - 1e-6);
    expect(calls).toContain(0.125 + 1e-6);
  });

  it.each([
    [0, 100],
    [1e9, 1e9 + 1],
    [0, 1e-8],
  ] as const)("keeps all local probes inside [%s, %s]", (t0, tEnd) => {
    const calls: number[] = [];
    const result = checkExactSolution({
      t0,
      tEnd,
      y0: 2,
      exactSolution: (t) => {
        calls.push(t);
        return 2;
      },
      rhs: () => 0,
    });
    expect(result.status).toBe("passed");
    expect(Math.min(...calls)).toBeGreaterThanOrEqual(t0);
    expect(Math.max(...calls)).toBeLessThanOrEqual(tEnd);
    for (const probe of result.probes) {
      expect(probe.differenceStep).toBe(
        Math.min((tEnd - t0) / 8, 1e-6 * Math.max(1, Math.abs(probe.t), tEnd - t0))
      );
    }
  });

  it("blocks a non-finite nine-point sample without derivative probes", () => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: (t) => (t === 0.5 ? Number.POSITIVE_INFINITY : 1),
      rhs: () => 0,
    });
    expect(result).toMatchObject({
      status: "blocked",
      probes: [],
      issues: [{ kind: "non_finite_exact", time: 0.5 }],
      primaryBlocker: { kind: "non_finite_exact", time: 0.5 },
    });
    expect(result.issues[0]).not.toHaveProperty("value");
  });

  it("converts a thrown exact evaluation into controlled blocker evidence", () => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: () => { throw new Error("private stack detail"); },
      rhs: () => 0,
    });
    expect(result.status).toBe("blocked");
    expect(result.issues[0]?.message).not.toContain("private stack detail");
    expect(result.primaryBlocker).toEqual(expect.objectContaining({
      kind: "non_finite_exact",
      time: 0,
    }));
  });

  it("blocks a non-finite additional derivative-probe value after sampling", () => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: (t) => (t > 0 && t < 1e-5 ? Number.NaN : 1),
      rhs: () => 0,
    });
    expect(result.status).toBe("blocked");
    expect(result.probes).toHaveLength(0);
    expect(result.issues).toEqual([
      expect.objectContaining({ kind: "non_finite_exact", time: 1e-6 }),
    ]);
  });

  it("retains completed derivative evidence when a later probe blocks", () => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: (t) => (t > 0.25 && t < 0.25001 ? Number.NaN : 1),
      rhs: () => 0,
    });
    expect(result.status).toBe("blocked");
    expect(result.probes).toHaveLength(2);
    expect(result.maximumNormalizedResidual).toBe(0);
    expect(result.maximumResidualTime).toBe(0);
    expect(result.issues[0]).toEqual(expect.objectContaining({
      kind: "non_finite_exact",
      time: 0.250001,
    }));
  });

  it("accepts initial equality and a negative initial value within tolerance", () => {
    const y0 = -2;
    const tolerance = EXACT_INITIAL_ATOL + EXACT_INITIAL_RTOL * Math.max(1, Math.abs(y0));
    const equal = checkExactSolution({
      t0: 0, tEnd: 1, y0, exactSolution: () => y0, rhs: () => 0,
    });
    const within = checkExactSolution({
      t0: 0, tEnd: 1, y0, exactSolution: () => y0 + 0.99 * tolerance, rhs: () => 0,
    });
    expect(equal.status).toBe("passed");
    expect(equal.initialValueDifference).toBe(0);
    expect(within.status).toBe("passed");
  });

  it("accepts the exact initial tolerance boundary", () => {
    const tolerance = EXACT_INITIAL_ATOL + EXACT_INITIAL_RTOL;
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 0,
      exactSolution: () => tolerance,
      rhs: () => 0,
    });
    expect(result.initialValueDifference).toBe(tolerance);
    expect(result.status).toBe("passed");
  });

  it("blocks just outside the scaled initial tolerance and retains evidence", () => {
    const y0 = 1e6;
    const tolerance = EXACT_INITIAL_ATOL + EXACT_INITIAL_RTOL * Math.max(1, Math.abs(y0));
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0,
      exactSolution: () => y0 + 1.01 * tolerance,
      rhs: () => 0,
    });
    expect(result.status).toBe("blocked");
    expect(result.initialValueDifference).toBeGreaterThan(tolerance);
    expect(result.probes).toEqual([]);
    expect(result.issues).toEqual([
      expect.objectContaining({ kind: "initial_value_mismatch", time: 0 }),
    ]);
    expect(result.primaryBlocker?.kind).toBe("initial_value_mismatch");
  });

  it.each([
    [5e-5, "derivative_warning"],
    [0.01, "derivative_strong_warning"],
  ] as const)("classifies deterministic derivative coefficient %s", (coefficient, kind) => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: (t) => 1 + coefficient * t,
      rhs: () => 0,
    });
    expect(result.status).toBe("warning");
    expect(result.issues).toEqual([
      expect.objectContaining({ kind, normalizedResidual: result.maximumNormalizedResidual }),
    ]);
    if (kind === "derivative_warning") {
      expect(result.maximumNormalizedResidual).toBeGreaterThan(DERIVATIVE_WARNING_THRESHOLD);
      expect(result.maximumNormalizedResidual).toBeLessThanOrEqual(
        DERIVATIVE_STRONG_WARNING_THRESHOLD
      );
    } else {
      expect(result.maximumNormalizedResidual).toBeGreaterThan(
        DERIVATIVE_STRONG_WARNING_THRESHOLD
      );
    }
  });

  it("retains the earliest maximum-residual time on exact ties", () => {
    const result = checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 0,
      exactSolution: () => 0,
      rhs: () => 1,
    });
    expect(result.maximumNormalizedResidual).toBeCloseTo(0.5);
    expect(result.maximumResidualTime).toBe(0);
  });

  it("always carries the numerical-not-proof statement", () => {
    const result = checkExactSolution({
      t0: 0, tEnd: 1, y0: 0, exactSolution: () => 2, rhs: () => 0,
    });
    expect(result.statement).toBe(EXACT_SOLUTION_CHECK_STATEMENT);
    expect(result.statement).toContain("numerical consistency check");
    expect(result.statement).toContain("not a formal proof");
  });

  it("rejects invalid finite inputs without calling evaluators", () => {
    const exact = vi.fn(() => 0);
    expect(() => checkExactSolution({
      t0: 0, tEnd: 1, y0: Number.NaN, exactSolution: exact, rhs: () => 0,
    })).toThrow("finite");
    expect(exact).not.toHaveBeenCalled();
  });

  it("rejects non-finite RHS evidence with a controlled error", () => {
    expect(() => checkExactSolution({
      t0: 0,
      tEnd: 1,
      y0: 1,
      exactSolution: () => 1,
      rhs: () => Number.POSITIVE_INFINITY,
    })).toThrow(expect.objectContaining({
      code: "invalid_exact_check_input",
      message: expect.stringContaining("right-hand side must be finite"),
    }));
  });
});
