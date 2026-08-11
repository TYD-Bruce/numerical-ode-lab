export type NonlinearMethod = "fixed_point" | "newton";

export interface NonlinearSolveOptions {
  method: NonlinearMethod;
  maxIterations: number;
  absoluteTolerance: number;
  relativeTolerance: number;
  /** Optional central-difference perturbation; defaults to sqrt(eps) scaled by |u|. */
  derivativeStep?: number;
}

export interface NonlinearSolveResult {
  value: number;
  converged: boolean;
  iterations: number;
  residual: number;
  method: NonlinearMethod;
  reason:
    | "converged"
    | "max_iterations"
    | "non_finite_value"
    | "non_finite_residual"
    | "derivative_too_small";
}

export interface ScalarNonlinearProblem {
  residual: (value: number) => number;
  derivative?: (value: number) => number;
  fixedPointMap?: (value: number) => number;
}

function tolerance(value: number, options: NonlinearSolveOptions): number {
  return (
    options.absoluteTolerance +
    options.relativeTolerance * Math.max(1, Math.abs(value))
  );
}

function result(
  value: number,
  converged: boolean,
  iterations: number,
  residual: number,
  method: NonlinearMethod,
  reason: NonlinearSolveResult["reason"]
): NonlinearSolveResult {
  return { value, converged, iterations, residual, method, reason };
}

function finiteResidual(
  problem: ScalarNonlinearProblem,
  value: number
): number | undefined {
  const residual = problem.residual(value);
  return Number.isFinite(residual) ? residual : undefined;
}

function solveNewton(
  problem: ScalarNonlinearProblem,
  initialValue: number,
  options: NonlinearSolveOptions
): NonlinearSolveResult {
  let value = initialValue;
  if (!Number.isFinite(value)) {
    return result(value, false, 0, Number.NaN, "newton", "non_finite_value");
  }

  let residual = finiteResidual(problem, value);
  if (residual === undefined) {
    return result(value, false, 0, Number.NaN, "newton", "non_finite_residual");
  }

  for (let iteration = 0; iteration < options.maxIterations; iteration++) {
    if (Math.abs(residual) <= tolerance(value, options)) {
      return result(value, true, iteration, residual, "newton", "converged");
    }

    const delta =
      options.derivativeStep ??
      Math.sqrt(Number.EPSILON) * Math.max(1, Math.abs(value));
    const derivative = problem.derivative?.(value) ?? (() => {
      const plus = finiteResidual(problem, value + delta);
      const minus = finiteResidual(problem, value - delta);
      if (plus === undefined || minus === undefined) return Number.NaN;
      return (plus - minus) / (2 * delta);
    })();

    if (!Number.isFinite(derivative)) {
      return result(
        value,
        false,
        iteration,
        residual,
        "newton",
        "non_finite_residual"
      );
    }
    if (Math.abs(derivative) <= Number.EPSILON * Math.max(1, Math.abs(residual))) {
      return result(
        value,
        false,
        iteration,
        residual,
        "newton",
        "derivative_too_small"
      );
    }

    const next = value - residual / derivative;
    if (!Number.isFinite(next)) {
      return result(
        next,
        false,
        iteration + 1,
        residual,
        "newton",
        "non_finite_value"
      );
    }
    const nextResidual = finiteResidual(problem, next);
    if (nextResidual === undefined) {
      return result(
        next,
        false,
        iteration + 1,
        Number.NaN,
        "newton",
        "non_finite_residual"
      );
    }
    const update = Math.abs(next - value);
    value = next;
    residual = nextResidual;
    if (
      update <= tolerance(value, options) &&
      Math.abs(residual) <= tolerance(value, options)
    ) {
      return result(value, true, iteration + 1, residual, "newton", "converged");
    }
  }

  return result(value, false, options.maxIterations, residual, "newton", "max_iterations");
}

function solveFixedPoint(
  problem: ScalarNonlinearProblem,
  initialValue: number,
  options: NonlinearSolveOptions
): NonlinearSolveResult {
  let value = initialValue;
  if (!Number.isFinite(value)) {
    return result(value, false, 0, Number.NaN, "fixed_point", "non_finite_value");
  }
  if (!problem.fixedPointMap) {
    return result(value, false, 0, Number.NaN, "fixed_point", "max_iterations");
  }

  let residual = finiteResidual(problem, value);
  if (residual === undefined) {
    return result(
      value,
      false,
      0,
      Number.NaN,
      "fixed_point",
      "non_finite_residual"
    );
  }

  for (let iteration = 0; iteration < options.maxIterations; iteration++) {
    if (Math.abs(residual) <= tolerance(value, options)) {
      return result(value, true, iteration, residual, "fixed_point", "converged");
    }
    const next = problem.fixedPointMap(value);
    if (!Number.isFinite(next)) {
      return result(
        next,
        false,
        iteration + 1,
        residual,
        "fixed_point",
        "non_finite_value"
      );
    }
    const nextResidual = finiteResidual(problem, next);
    if (nextResidual === undefined) {
      return result(
        next,
        false,
        iteration + 1,
        Number.NaN,
        "fixed_point",
        "non_finite_residual"
      );
    }
    const update = Math.abs(next - value);
    value = next;
    residual = nextResidual;
    if (
      update <= tolerance(value, options) &&
      Math.abs(residual) <= tolerance(value, options)
    ) {
      return result(
        value,
        true,
        iteration + 1,
        residual,
        "fixed_point",
        "converged"
      );
    }
  }

  return result(
    value,
    false,
    options.maxIterations,
    residual,
    "fixed_point",
    "max_iterations"
  );
}

export function solveScalarNonlinear(
  problem: ScalarNonlinearProblem,
  initialValue: number,
  options: NonlinearSolveOptions
): NonlinearSolveResult {
  return options.method === "newton"
    ? solveNewton(problem, initialValue, options)
    : solveFixedPoint(problem, initialValue, options);
}
