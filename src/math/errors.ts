import type { MathVariableName, MathVariableProfile } from "./ast";

export type MathExpressionErrorCode =
  | "invalid_ast"
  | "invalid_number"
  | "unsupported_constant"
  | "unknown_variable"
  | "variable_not_allowed"
  | "unsupported_function"
  | "empty_addition"
  | "empty_multiplication"
  | "non_finite_input"
  | "non_finite_result"
  | "division_by_zero"
  | "square_root_domain"
  | "logarithm_domain"
  | "power_domain"
  | "tangent_non_finite"
  | "numeric_overflow"
  | "invalid_math_json"
  | "incomplete_expression"
  | "invalid_legacy_expression"
  | "unexpected_token";

export type MathExpressionErrorDetails = Readonly<{
  profile?: MathVariableProfile;
  variable?: string;
  operation?: string;
  operands?: readonly number[];
  inputs?: Readonly<Record<string, number>>;
  adapter?: "math_json" | "legacy";
  position?: number;
}>;

export class MathExpressionError extends Error {
  readonly code: MathExpressionErrorCode;
  readonly details: MathExpressionErrorDetails;

  constructor(
    code: MathExpressionErrorCode,
    message: string,
    details: MathExpressionErrorDetails = {}
  ) {
    super(message);
    this.name = "MathExpressionError";
    this.code = code;
    this.details = details;
  }
}

export function displayVariableName(name: string): string {
  if (name === "t0") return "t₀";
  if (name === "y0") return "y₀";
  return name;
}

export function variableValidationError(
  name: string,
  profile?: MathVariableProfile,
  known = false
): MathExpressionError {
  const displayName = displayVariableName(name);
  const code: MathExpressionErrorCode = known
    ? "variable_not_allowed"
    : "unknown_variable";

  if (profile === "rhs") {
    if (!known) {
      return new MathExpressionError(
        code,
        `Unknown variable ${displayName}. Use only t and y in the ODE right-hand side.`,
        { profile, variable: name }
      );
    }
    return new MathExpressionError(
      code,
      `Variable ${displayName} is not available in the ODE right-hand side. Use only t and y.`,
      { profile, variable: name }
    );
  }

  if (profile === "exact_solution") {
    const lead = known
      ? `Variable ${displayName} is not available in an exact solution.`
      : `Unknown variable ${displayName}.`;
    return new MathExpressionError(
      code,
      `${lead} Use only t, t₀, and y₀.`,
      { profile, variable: name }
    );
  }

  if (profile === "second_order_rhs") {
    return new MathExpressionError(
      code,
      `Unknown variable ${displayName}. Use only t and u in the Leap-Frog acceleration.`,
      { profile, variable: name }
    );
  }

  return new MathExpressionError(code, `Unknown variable ${displayName}.`, {
    variable: name,
  });
}

export function isMathExpressionError(error: unknown): error is MathExpressionError {
  return error instanceof MathExpressionError;
}

export type KnownMathVariable = MathVariableName;
