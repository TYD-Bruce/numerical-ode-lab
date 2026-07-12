import type { ExactSolutionEvaluator, RhsEvaluator } from "./math/evaluator";

export const EXACT_SOLUTION_CHECK_STATEMENT =
  "This is a numerical consistency check, not a formal proof." as const;
export const EXACT_SOLUTION_SAMPLE_COUNT = 9 as const;
export const EXACT_INITIAL_ATOL = 1e-10;
export const EXACT_INITIAL_RTOL = 1e-8;
export const DERIVATIVE_WARNING_THRESHOLD = 1e-5;
export const DERIVATIVE_STRONG_WARNING_THRESHOLD = 1e-3;

export type ExactSolutionIssueKind =
  | "non_finite_exact"
  | "initial_value_mismatch"
  | "derivative_warning"
  | "derivative_strong_warning";

export interface ExactSolutionIssue {
  readonly kind: ExactSolutionIssueKind;
  readonly message: string;
  readonly time?: number;
  readonly value?: number;
  readonly normalizedResidual?: number;
}

export interface ExactSolutionDerivativeProbe {
  readonly t: number;
  readonly differenceStep: number;
  readonly derivativeEstimate: number;
  readonly rhsValue: number;
  readonly normalizedResidual: number;
  readonly scheme: "forward" | "central" | "backward";
}

export interface ExactSolutionPrimaryBlocker {
  readonly kind: "non_finite_exact" | "initial_value_mismatch";
  readonly message: string;
  readonly time?: number;
}

export interface ExactSolutionCheckResult {
  readonly status: "passed" | "warning" | "blocked";
  readonly statement: typeof EXACT_SOLUTION_CHECK_STATEMENT;
  readonly sampleCount: typeof EXACT_SOLUTION_SAMPLE_COUNT;
  readonly initialValueDifference?: number;
  readonly maximumNormalizedResidual?: number;
  readonly maximumResidualTime?: number;
  readonly probes: readonly ExactSolutionDerivativeProbe[];
  readonly issues: readonly ExactSolutionIssue[];
  readonly primaryBlocker?: ExactSolutionPrimaryBlocker;
}

export class ExactSolutionCheckInputError extends Error {
  readonly code = "invalid_exact_check_input" as const;

  constructor(message: string) {
    super(message);
    this.name = "ExactSolutionCheckInputError";
  }
}

export interface ExactSolutionCheckInput {
  readonly t0: number;
  readonly tEnd: number;
  readonly y0: number;
  readonly exactSolution: ExactSolutionEvaluator;
  readonly rhs: RhsEvaluator;
}

function requireFiniteInput(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new ExactSolutionCheckInputError(`${label} must be finite.`);
  }
}

export function exactSolutionCheckLocations(t0: number, tEnd: number): readonly number[] {
  requireFiniteInput(t0, "Start time t₀");
  requireFiniteInput(tEnd, "End time t_end");
  if (!(tEnd > t0)) {
    throw new ExactSolutionCheckInputError(
      "End time t_end must be greater than start time t₀ for an exact-solution check."
    );
  }
  const span = tEnd - t0;
  if (!Number.isFinite(span)) {
    throw new ExactSolutionCheckInputError("The exact-solution check interval must be finite.");
  }
  const locations = Array.from(
    { length: EXACT_SOLUTION_SAMPLE_COUNT },
    (_, index) => t0 + (index / 8) * span
  );
  locations[0] = t0;
  locations[locations.length - 1] = tEnd;
  if (locations.some((time) => !Number.isFinite(time))) {
    throw new ExactSolutionCheckInputError(
      "The exact-solution check locations must be finite."
    );
  }
  return locations;
}

export function derivativeProbeStep(t: number, t0: number, tEnd: number): number {
  requireFiniteInput(t, "Derivative sample time");
  requireFiniteInput(t0, "Start time t₀");
  requireFiniteInput(tEnd, "End time t_end");
  const span = tEnd - t0;
  if (!(span > 0) || !Number.isFinite(span)) {
    throw new ExactSolutionCheckInputError(
      "The derivative-probe interval must have a positive finite span."
    );
  }
  const scale = Math.max(1, Math.abs(t), span);
  const step = Math.min(span / 8, 1e-6 * scale);
  if (!(step > 0) || !Number.isFinite(step)) {
    throw new ExactSolutionCheckInputError(
      "The derivative-probe step must be positive and finite."
    );
  }
  return step;
}

function blockedExactResult(
  issue: ExactSolutionIssue,
  probes: readonly ExactSolutionDerivativeProbe[] = [],
  initialValueDifference?: number
): ExactSolutionCheckResult {
  let maximumNormalizedResidual: number | undefined;
  let maximumResidualTime: number | undefined;
  for (const probe of probes) {
    if (
      maximumNormalizedResidual === undefined ||
      probe.normalizedResidual > maximumNormalizedResidual
    ) {
      maximumNormalizedResidual = probe.normalizedResidual;
      maximumResidualTime = probe.t;
    }
  }
  return {
    status: "blocked",
    statement: EXACT_SOLUTION_CHECK_STATEMENT,
    sampleCount: EXACT_SOLUTION_SAMPLE_COUNT,
    ...(initialValueDifference === undefined ? {} : { initialValueDifference }),
    ...(maximumNormalizedResidual === undefined
      ? {}
      : { maximumNormalizedResidual, maximumResidualTime }),
    probes: [...probes],
    issues: [issue],
    primaryBlocker: {
      kind: issue.kind as ExactSolutionPrimaryBlocker["kind"],
      message: issue.message,
      ...(issue.time === undefined ? {} : { time: issue.time }),
    },
  };
}

function evaluateExactFinite(
  evaluator: ExactSolutionEvaluator,
  time: number,
  t0: number,
  y0: number
): { ok: true; value: number } | { ok: false; issue: ExactSolutionIssue } {
  try {
    const value = evaluator(time, t0, y0);
    if (Number.isFinite(value)) return { ok: true, value };
  } catch {
    // Controlled below without exposing the original exception.
  }
  return {
    ok: false,
    issue: {
      kind: "non_finite_exact",
      message: `The exact solution could not produce a finite value at t = ${time}.`,
      time,
    },
  };
}

export function checkExactSolution(input: ExactSolutionCheckInput): ExactSolutionCheckResult {
  requireFiniteInput(input.y0, "Initial value y₀");
  const locations = exactSolutionCheckLocations(input.t0, input.tEnd);
  const sampleValues: number[] = [];
  for (const time of locations) {
    const evaluated = evaluateExactFinite(
      input.exactSolution,
      time,
      input.t0,
      input.y0
    );
    if (!evaluated.ok) return blockedExactResult(evaluated.issue);
    sampleValues.push(evaluated.value);
  }

  const initialValueDifference = Math.abs(sampleValues[0]! - input.y0);
  const initialTolerance =
    EXACT_INITIAL_ATOL + EXACT_INITIAL_RTOL * Math.max(1, Math.abs(input.y0));
  if (initialValueDifference > initialTolerance) {
    const issue: ExactSolutionIssue = {
      kind: "initial_value_mismatch",
      message:
        `The exact solution does not match the initial value at t₀. ` +
        `The difference is ${initialValueDifference}.`,
      time: input.t0,
      value: initialValueDifference,
    };
    return blockedExactResult(issue, [], initialValueDifference);
  }

  const probes: ExactSolutionDerivativeProbe[] = [];
  let maximumNormalizedResidual = -1;
  let maximumResidualTime: number | undefined;
  for (let index = 0; index < locations.length; index += 1) {
    const time = locations[index]!;
    const differenceStep = derivativeProbeStep(time, input.t0, input.tEnd);
    const scheme = index === 0 ? "forward" : index === 8 ? "backward" : "central";
    const leftTime = scheme === "forward" ? time : time - differenceStep;
    const rightTime = scheme === "backward" ? time : time + differenceStep;
    const left =
      leftTime === time
        ? { ok: true as const, value: sampleValues[index]! }
        : evaluateExactFinite(input.exactSolution, leftTime, input.t0, input.y0);
    if (!left.ok) return blockedExactResult(left.issue, probes, initialValueDifference);
    const right =
      rightTime === time
        ? { ok: true as const, value: sampleValues[index]! }
        : evaluateExactFinite(input.exactSolution, rightTime, input.t0, input.y0);
    if (!right.ok) return blockedExactResult(right.issue, probes, initialValueDifference);

    const denominator = scheme === "central" ? 2 * differenceStep : differenceStep;
    const derivativeEstimate = (right.value - left.value) / denominator;
    if (!Number.isFinite(derivativeEstimate)) {
      const issue: ExactSolutionIssue = {
        kind: "non_finite_exact",
        message: `The exact-solution derivative probe was not finite at t = ${time}.`,
        time,
      };
      return blockedExactResult(issue, probes, initialValueDifference);
    }
    let rhsValue: number;
    try {
      rhsValue = input.rhs(time, sampleValues[index]!);
    } catch {
      throw new ExactSolutionCheckInputError(
        `The ODE right-hand side could not be evaluated during the numerical consistency check at t = ${time}.`
      );
    }
    if (!Number.isFinite(rhsValue)) {
      throw new ExactSolutionCheckInputError(
        `The ODE right-hand side must be finite during the numerical consistency check at t = ${time}.`
      );
    }
    const residual =
      Math.abs(derivativeEstimate - rhsValue) /
      (1 + Math.abs(derivativeEstimate) + Math.abs(rhsValue));
    if (!Number.isFinite(residual)) {
      throw new ExactSolutionCheckInputError(
        `The numerical consistency residual was not finite at t = ${time}.`
      );
    }
    probes.push({
      t: time,
      differenceStep,
      derivativeEstimate,
      rhsValue,
      normalizedResidual: residual,
      scheme,
    });
    if (residual > maximumNormalizedResidual) {
      maximumNormalizedResidual = residual;
      maximumResidualTime = time;
    }
  }

  const issues: ExactSolutionIssue[] = [];
  let status: ExactSolutionCheckResult["status"] = "passed";
  if (maximumNormalizedResidual > DERIVATIVE_WARNING_THRESHOLD) {
    status = "warning";
    const strong = maximumNormalizedResidual > DERIVATIVE_STRONG_WARNING_THRESHOLD;
    issues.push({
      kind: strong ? "derivative_strong_warning" : "derivative_warning",
      message: strong
        ? "The exact solution and ODE have a strong numerical derivative inconsistency. This check is not a formal proof."
        : "The exact solution and ODE have a numerical derivative consistency warning. This check is not a formal proof.",
      time: maximumResidualTime,
      normalizedResidual: maximumNormalizedResidual,
    });
  }

  return {
    status,
    statement: EXACT_SOLUTION_CHECK_STATEMENT,
    sampleCount: EXACT_SOLUTION_SAMPLE_COUNT,
    initialValueDifference,
    maximumNormalizedResidual,
    maximumResidualTime,
    probes,
    issues,
  };
}
