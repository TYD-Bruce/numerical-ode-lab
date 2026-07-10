import { describe, expect, it } from "vitest";

import { solveScalarNonlinear } from "./nonlinearSolver";

const NEWTON_OPTIONS = {
  method: "newton" as const,
  maxIterations: 20,
  absoluteTolerance: 1e-12,
  relativeTolerance: 1e-10,
};

describe("scalar Newton solver", () => {
  it("solves a linear equation", () => {
    const result = solveScalarNonlinear({ residual: (u) => u - 2 }, 0, NEWTON_OPTIONS);

    expect(result.converged).toBe(true);
    expect(result.value).toBeCloseTo(2, 12);
    expect(Math.abs(result.residual)).toBeLessThan(1e-12);
    expect(result.method).toBe("newton");
  });

  it("solves a nonlinear equation from a poor initial guess", () => {
    const result = solveScalarNonlinear(
      { residual: (u) => u * u - 2 },
      10,
      NEWTON_OPTIONS
    );

    expect(result.converged).toBe(true);
    expect(result.value).toBeCloseTo(Math.SQRT2, 10);
    expect(result.iterations).toBeGreaterThan(1);
  });

  it("reports a derivative that is too small", () => {
    const result = solveScalarNonlinear(
      { residual: () => 1 },
      0,
      NEWTON_OPTIONS
    );

    expect(result.converged).toBe(false);
    expect(result.reason).toBe("derivative_too_small");
  });

  it("reports a non-finite residual", () => {
    const result = solveScalarNonlinear(
      { residual: () => Number.NaN },
      0,
      NEWTON_OPTIONS
    );

    expect(result.converged).toBe(false);
    expect(result.reason).toBe("non_finite_residual");
  });

  it("reports exhaustion of the iteration budget", () => {
    const result = solveScalarNonlinear(
      { residual: (u) => u * u - 2 },
      10,
      { ...NEWTON_OPTIONS, maxIterations: 1 }
    );

    expect(result.converged).toBe(false);
    expect(result.reason).toBe("max_iterations");
    expect(Number.isFinite(result.residual)).toBe(true);
  });
});

describe("scalar fixed-point solver", () => {
  it("converges for a contraction and reports residual diagnostics", () => {
    const result = solveScalarNonlinear(
      {
        residual: (u) => u - 2,
        fixedPointMap: (u) => (u + 2) / 2,
      },
      0,
      {
        method: "fixed_point",
        maxIterations: 100,
        absoluteTolerance: 1e-12,
        relativeTolerance: 1e-10,
      }
    );

    expect(result.converged).toBe(true);
    expect(result.value).toBeCloseTo(2, 9);
    expect(Math.abs(result.residual)).toBeLessThan(1e-9);
    expect(result.iterations).toBeGreaterThan(0);
  });

  it("reports a finite non-convergent mapping", () => {
    const result = solveScalarNonlinear(
      {
        residual: (u) => -u - 1,
        fixedPointMap: (u) => 2 * u + 1,
      },
      0,
      {
        method: "fixed_point",
        maxIterations: 5,
        absoluteTolerance: 1e-12,
        relativeTolerance: 1e-10,
      }
    );

    expect(result.converged).toBe(false);
    expect(result.reason).toBe("max_iterations");
    expect(Number.isFinite(result.residual)).toBe(true);
  });
});
