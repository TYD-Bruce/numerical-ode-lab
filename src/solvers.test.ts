import { describe, expect, it } from "vitest";

import { bdfCoefficients } from "./polynomial";
import {
  integrateFirstOrder,
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
