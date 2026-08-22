import { describe, expect, it } from "vitest";

import { bdfCoefficients } from "./polynomial";
import {
  integrateFirstOrder,
  integrateSecondOrder,
  type SeriesPoint,
  type SolverResult,
} from "./solvers";

type ScalarRhs = (t: number, y: number) => number;

const BDF_ORDERS = [1, 2, 3, 4, 5, 6] as const;
const EXP_GROWTH: ScalarRhs = (_t, y) => y;
const EXP_DECAY: ScalarRhs = (_t, y) => -y;

function solveBdf(
  order: number,
  h: number,
  f: ScalarRhs = EXP_GROWTH,
  tEnd = 1,
  y0 = 1
): SolverResult {
  return integrateFirstOrder(
    { family: "bdf", order },
    { t0: 0, y0, tEnd, h, f }
  );
}

function finalError(result: SolverResult, exact: number): number {
  return Math.abs(result.points.at(-1)!.y - exact);
}

function observedOrder(coarseError: number, fineError: number): number {
  return Math.log2(coarseError / fineError);
}

function bdfResidual(
  points: SeriesPoint[],
  alpha: number[],
  pointIndex: number,
  h: number,
  f: ScalarRhs
): number {
  let lhs = 0;
  for (let j = 0; j < alpha.length; j++) {
    lhs += alpha[j]! * points[pointIndex - j]!.y;
  }
  const point = points[pointIndex]!;
  return lhs - h * f(point.t, point.y);
}

describe("BDF regression", () => {
  it("computes a convergent BDF4 solution instead of reading shifted history", () => {
    const errors = [0.1, 0.05, 0.025].map((h) =>
      finalError(solveBdf(4, h), Math.E)
    );

    expect(errors.every(Number.isFinite)).toBe(true);
    expect(errors[0]).toBeLessThan(1e-4);
    expect(errors[1]).toBeLessThan(errors[0]!);
    expect(errors[2]).toBeLessThan(errors[1]!);
  });
});

describe("BDF numerical properties", () => {
  it.each(BDF_ORDERS)(
    "BDF%d preserves a constant solution",
    (order) => {
      const y0 = 3.25;
      const result = solveBdf(order, 0.05, () => 0, 1, y0);

      for (const point of result.points) {
        expect(Math.abs(point.y - y0)).toBeLessThan(1e-11);
      }
    }
  );

  it.each(BDF_ORDERS)(
    "BDF%d remains finite and converges for linear decay",
    (order) => {
      const coarse = solveBdf(order, 0.1, EXP_DECAY);
      const fine = solveBdf(order, 0.05, EXP_DECAY);
      const coarseError = finalError(coarse, Math.exp(-1));
      const fineError = finalError(fine, Math.exp(-1));

      expect(coarse.points.every((point) => Number.isFinite(point.y))).toBe(
        true
      );
      expect(fine.points.every((point) => Number.isFinite(point.y))).toBe(true);
      expect(fine.points.at(-1)!.t).toBeCloseTo(1, 12);
      expect(fineError).toBeLessThan(coarseError);
    }
  );

  it.each(BDF_ORDERS)(
    "BDF%d approaches its expected observed order on y'=y",
    (order) => {
      const hs = [0.1, 0.05, 0.025];
      const results = hs.map((h) => solveBdf(order, h));
      const errors = results.map((result) => finalError(result, Math.E));
      const observed = [
        observedOrder(errors[0]!, errors[1]!),
        observedOrder(errors[1]!, errors[2]!),
      ];

      for (const result of results) {
        expect(result.points.every((point) => Number.isFinite(point.y))).toBe(
          true
        );
        expect(result.points.at(-1)!.t).toBeCloseTo(1, 12);
      }
      expect(errors[1]).toBeLessThan(errors[0]!);
      expect(errors[2]).toBeLessThan(errors[1]!);

      // These floors are deliberately below the asymptotic orders. The grids
      // are modest, and BDF5/BDF6 use a fixed number of RK4 startup steps.
      // RK4 startup errors are O(h^5), so BDF6 is expected to approach order 5
      // in this end-to-end experiment rather than its ideal order 6.
      const minimumObservedOrder = [0, 0.9, 1.6, 2.4, 3.2, 3.5, 4.3][
        order
      ]!;
      expect(Math.min(...observed)).toBeGreaterThan(minimumObservedOrder);
    }
  );

  it("satisfies the BDF2 formula on its first implicit step", () => {
    const h = 0.1;
    const result = solveBdf(2, h, EXP_GROWTH, 0.2);
    const [uNm1, uN, uNext] = result.points;
    const residual =
      (3 / 2) * uNext!.y -
      2 * uN!.y +
      (1 / 2) * uNm1!.y -
      h * EXP_GROWTH(uNext!.t, uNext!.y);

    expect(Math.abs(residual)).toBeLessThan(1e-9);
  });

  it.each(BDF_ORDERS)(
    "BDF%d keeps every implicit-step residual small",
    (order) => {
      const h = 0.05;
      const result = solveBdf(order, h);
      const alpha = bdfCoefficients(order);

      // Points 0..p-1 are RK4 startup values. Point p is the first value that
      // must satisfy the p-step BDF algebraic equation.
      for (let pointIndex = order; pointIndex < result.points.length; pointIndex++) {
        const residual = bdfResidual(
          result.points,
          alpha,
          pointIndex,
          h,
          EXP_GROWTH
        );
        expect(Math.abs(residual)).toBeLessThan(1e-8);
      }
    }
  );
});

const FIRST_ORDER_CONFIGS = [
  { family: "forward_euler" },
  { family: "backward_euler" },
  { family: "taylor" },
  { family: "rk4" },
  { family: "adams_bashforth", order: 3 },
  { family: "adams_moulton", order: 3 },
  { family: "bdf", order: 4 },
] as const;

function expectFixedGrid(
  result: SolverResult,
  t0: number,
  tEnd: number,
  h: number
): void {
  const expectedSteps = Math.round((tEnd - t0) / h);
  expect(result.points).toHaveLength(expectedSteps + 1);
  expect(result.points[0]!.t).toBe(t0);
  expect(result.points.at(-1)!.t).toBeCloseTo(tEnd, 12);

  for (let i = 0; i < result.points.length; i++) {
    const point = result.points[i]!;
    expect(Number.isFinite(point.y)).toBe(true);
    if (point.v !== undefined) expect(Number.isFinite(point.v)).toBe(true);
    if (i > 0) {
      const previous = result.points[i - 1]!;
      expect(point.t).toBeGreaterThan(previous.t);
      expect(point.t - previous.t).toBeCloseTo(h, 12);
    }
  }
}

describe("fixed-step solver contract", () => {
  it.each(FIRST_ORDER_CONFIGS)(
    "$family rejects a misaligned grid instead of silently stopping at 0.9",
    (config) => {
      expect(() =>
        integrateFirstOrder(config, {
          t0: 0,
          y0: 1,
          tEnd: 1,
          h: 0.3,
          f: () => 0,
        })
      ).toThrow("Fixed-step methods require (t_end - t₀) / h to be an integer");
    }
  );

  it("Leap-Frog rejects a misaligned grid", () => {
    expect(() =>
      integrateSecondOrder({
        t0: 0,
        u0: 1,
        v0: 0,
        tEnd: 1,
        h: 0.3,
        a: () => 0,
      })
    ).toThrow("Fixed-step methods require (t_end - t₀) / h to be an integer");
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite y₀ (%p)",
    (y0) => {
      expect(() =>
        integrateFirstOrder(
          { family: "forward_euler" },
          { t0: 0, y0, tEnd: 1, h: 0.1, f: () => 0 }
        )
      ).toThrow("Initial value y₀ must be finite.");
    }
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite Leap-Frog initial values (%p)",
    (value) => {
      expect(() =>
        integrateSecondOrder({
          t0: 0,
          u0: value,
          v0: 0,
          tEnd: 1,
          h: 0.1,
          a: () => 0,
        })
      ).toThrow("Initial displacement u₀ must be finite.");
      expect(() =>
        integrateSecondOrder({
          t0: 0,
          u0: 0,
          v0: value,
          tEnd: 1,
          h: 0.1,
          a: () => 0,
        })
      ).toThrow("Initial velocity v₀ must be finite.");
    }
  );

  it("checks a first-order RHS at every evaluation", () => {
    expect(() =>
      integrateFirstOrder(
        { family: "forward_euler" },
        { t0: 0, y0: 1, tEnd: 0.1, h: 0.1, f: () => Number.NaN }
      )
    ).toThrow("non-finite derivative at t=0");
    expect(() =>
      integrateFirstOrder(
        { family: "rk4" },
        {
          t0: 0,
          y0: 1,
          tEnd: 0.4,
          h: 0.1,
          f: (t) => (t >= 0.2 ? Number.POSITIVE_INFINITY : 0),
        }
      )
    ).toThrow("non-finite derivative at t=0.2");
  });

  it("checks a Leap-Frog acceleration at every evaluation", () => {
    expect(() =>
      integrateSecondOrder({
        t0: 0,
        u0: 1,
        v0: 0,
        tEnd: 0.1,
        h: 0.1,
        a: () => Number.POSITIVE_INFINITY,
      })
    ).toThrow("non-finite acceleration at t=0");
    expect(() =>
      integrateSecondOrder({
        t0: 0,
        u0: 1,
        v0: 0,
        tEnd: 0.4,
        h: 0.1,
        a: (t) => (t >= 0.2 ? Number.NaN : 0),
      })
    ).toThrow("non-finite acceleration at t=0.2");
  });

  it("rejects a step count over the shared limit before evaluating the RHS", () => {
    expect(() =>
      integrateFirstOrder(
        { family: "forward_euler" },
        {
          t0: 0,
          y0: 1,
          tEnd: 100_001,
          h: 1,
          f: () => {
            throw new Error("RHS must not be evaluated");
          },
        }
      )
    ).toThrow("above the current limit of 100000");
  });

  it.each(FIRST_ORDER_CONFIGS)(
    "$family produces the complete aligned grid with finite values",
    (config) => {
      const result = integrateFirstOrder(config, {
        t0: 0.2,
        y0: 1,
        tEnd: 1.2,
        h: 0.1,
        f: (_t, y) => -y,
      });
      expectFixedGrid(result, 0.2, 1.2, 0.1);
    }
  );

  it("Leap-Frog produces the complete aligned grid with finite values", () => {
    const result = integrateSecondOrder({
      t0: 0.2,
      u0: 1,
      v0: 0,
      tEnd: 1.2,
      h: 0.1,
      a: (_t, u) => -u,
    });
    expectFixedGrid(result, 0.2, 1.2, 0.1);
  });
});

const MULTISTEP_FAMILIES = [
  ["adams_bashforth", "Adams-Bashforth"],
  ["adams_moulton", "Adams-Moulton"],
  ["bdf", "Backward Differentiation Formula"],
] as const;

describe("multistep minimum-grid contract", () => {
  it("uses theoretical-order language without changing validation ownership", () => {
    expect(() =>
      integrateFirstOrder(
        { family: "bdf", order: 2.5 },
        { t0: 0, y0: 1, tEnd: 1, h: 0.1, f: (_t, y) => -y }
      )
    ).toThrow("The theoretical order p must be an integer.");
  });

  it("qualifies the multistep nodal-error order without changing metadata", () => {
    const result = integrateFirstOrder(
      { family: "adams_bashforth", order: 3 },
      { t0: 0, y0: 1, tEnd: 1, h: 0.1, f: (_t, y) => -y }
    );

    expect(result.metadata.order).toBe(3);
    expect(result.metadata.startupMethod).toBe("Runge-Kutta 4");
    expect(result.metadata.notes).toContain(
      "Under the usual regularity and stability assumptions, the method has theoretical order p, so its nodal error is O(h^p)."
    );
    expect(result.metadata.notes.join(" ")).not.toContain(
      "If the local truncation error"
    );
    expect(result.points).toHaveLength(11);
    expect(result.points.at(-1)!.t).toBeCloseTo(1, 12);
  });

  it.each(MULTISTEP_FAMILIES)(
    "%s rejects N < p before bootstrap can create an internal grid error",
    (family, displayName) => {
      expect(() =>
        integrateFirstOrder(
          { family, order: 4 },
          { t0: 0, y0: 1, tEnd: 0.2, h: 0.1, f: (_t, y) => -y }
        )
      ).toThrow(
        `${displayName} of order 4 requires at least 4 fixed steps; this grid provides N = 2.`
      );
    }
  );

  it.each(MULTISTEP_FAMILIES)(
    "%s applies an order-p multistep update when N = p",
    (family) => {
      const result = integrateFirstOrder(
        { family, order: 4 },
        { t0: 0, y0: 1, tEnd: 0.4, h: 0.1, f: (_t, y) => -y }
      );

      expect(result.points).toHaveLength(5);
      expect(result.points.at(-1)!.t).toBeCloseTo(0.4, 12);
      expect(result.points.every((point) => Number.isFinite(point.y))).toBe(
        true
      );
    }
  );
});

describe("implicit Newton diagnostics", () => {
  it("reports the actual nonlinear method in Adams-Moulton and BDF result notes", () => {
    const defaultAm = integrateFirstOrder(
      { family: "adams_moulton", order: 1 },
      { t0: 0, y0: 1, tEnd: 0.1, h: 0.1, f: (_t, y) => -y }
    );
    const defaultBdf = integrateFirstOrder(
      { family: "bdf", order: 1 },
      { t0: 0, y0: 1, tEnd: 0.1, h: 0.1, f: (_t, y) => -y }
    );
    const fixedPointAm = integrateFirstOrder(
      { family: "adams_moulton", order: 1 },
      {
        t0: 0,
        y0: 1,
        tEnd: 0.1,
        h: 0.1,
        f: (_t, y) => -y,
        implicitSolver: { method: "fixed_point" },
      }
    );

    expect(defaultAm.metadata.notes.join(" ")).toContain("Newton iteration");
    expect(defaultBdf.metadata.notes.join(" ")).toContain("Newton iteration");
    expect(defaultAm.metadata.notes.join(" ").toLowerCase()).not.toContain(
      "fixed-point correction"
    );
    expect(fixedPointAm.metadata.notes.join(" ")).toContain(
      "fixed-point iteration"
    );
  });

  it("solves stiff Backward Euler even though its fixed-point map is non-contractive", () => {
    const h = 0.1;
    const result = integrateFirstOrder(
      { family: "backward_euler" },
      { t0: 0, y0: 1, tEnd: h, h, f: (_t, y) => -1000 * y }
    );
    const u1 = result.points[1]!.y;

    expect(Number.isFinite(u1)).toBe(true);
    expect(u1).toBeCloseTo(1 / 101, 10);
    expect(Math.abs(u1 - 1 - h * (-1000 * u1))).toBeLessThan(1e-10);
    expect(result.metadata.implicitDiagnostics).toMatchObject({
      nonlinearMethod: "newton",
      failedSteps: 0,
    });
    expect(result.metadata.implicitDiagnostics!.totalIterations).toBeGreaterThan(0);
    expect(result.metadata.implicitDiagnostics!.maxResidual).toBeLessThan(1e-10);
  });

  it("reports fixed-point failure separately from Backward Euler stability", () => {
    expect(() =>
      integrateFirstOrder(
        { family: "backward_euler" },
        {
          t0: 0,
          y0: 1,
          tEnd: 0.1,
          h: 0.1,
          f: (_t, y) => -1000 * y,
          implicitSolver: {
            method: "fixed_point",
            maxIterations: 10,
          },
        }
      )
    ).toThrow("Fixed-point iteration did not converge");
  });

  it("keeps Newton residuals small for implicit Adams-Moulton and BDF", () => {
    const f: ScalarRhs = (_t, y) => -1000 * y;
    const am = integrateFirstOrder(
      { family: "adams_moulton", order: 2 },
      { t0: 0, y0: 1, tEnd: 0.02, h: 0.01, f }
    );
    const bdf = integrateFirstOrder(
      { family: "bdf", order: 1 },
      { t0: 0, y0: 1, tEnd: 0.1, h: 0.1, f }
    );

    expect(am.points.every((point) => Number.isFinite(point.y))).toBe(true);
    expect(bdf.points.every((point) => Number.isFinite(point.y))).toBe(true);
    expect(am.metadata.implicitDiagnostics!.maxResidual).toBeLessThan(1e-9);
    expect(bdf.metadata.implicitDiagnostics!.maxResidual).toBeLessThan(1e-10);
  });
});
