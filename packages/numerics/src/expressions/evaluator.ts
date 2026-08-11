import type {
  MathAst,
  MathVariableName,
  MathVariableProfile,
} from "./ast";
import { canonicalizeMathAst } from "./canonical";
import { MathExpressionError } from "./errors";

export type RhsEvaluator = (t: number, y: number) => number;
export type ExactSolutionEvaluator = (t: number, t0: number, y0: number) => number;
export type SecondOrderRhsEvaluator = (t: number, u: number) => number;

type EvaluationInputs = Readonly<Partial<Record<MathVariableName, number>>>;

function displayNumber(value: number): string {
  if (Number.isNaN(value)) return "NaN";
  if (value === Infinity) return "Infinity";
  if (value === -Infinity) return "-Infinity";
  if (Object.is(value, -0)) return "-0";
  return String(value);
}
function location(inputs: EvaluationInputs): string {
  return inputs.t === undefined ? "" : ` at t = ${displayNumber(inputs.t)}`;
}

function errorDetails(
  inputs: EvaluationInputs,
  operation?: string,
  operands?: readonly number[]
) {
  return {
    ...(operation ? { operation } : {}),
    ...(operands ? { operands } : {}),
    inputs: { ...inputs } as Readonly<Record<string, number>>,
  };
}

function requireFiniteInput(
  variable: MathVariableName,
  value: number,
  inputs: EvaluationInputs
): void {
  if (!Number.isFinite(value)) {
    throw new MathExpressionError(
      "non_finite_input",
      `Input ${variable} must be finite. Received ${displayNumber(value)}.`,
      { variable, inputs: { ...inputs } as Readonly<Record<string, number>> }
    );
  }
}

function requireFiniteResult(
  value: number,
  operation: string,
  operands: readonly number[],
  inputs: EvaluationInputs
): number {
  if (Number.isFinite(value)) return value;

  const code = Number.isNaN(value) ? "non_finite_result" : "numeric_overflow";
  const message = Number.isNaN(value)
    ? `The ${operation} operation produced an undefined numeric result${location(inputs)}.`
    : `The ${operation} operation overflowed to a non-finite result${location(inputs)}.`;
  throw new MathExpressionError(code, message, errorDetails(inputs, operation, operands));
}

function evaluateNode(node: MathAst, inputs: EvaluationInputs): number {
  switch (node.kind) {
    case "number":
      return node.value;
    case "constant":
      return node.name === "e" ? Math.E : Math.PI;
    case "variable": {
      const value = inputs[node.name];
      if (value === undefined) {
        throw new MathExpressionError(
          "invalid_ast",
          `No evaluation value was supplied for variable ${node.name}.`,
          { variable: node.name, inputs: { ...inputs } as Readonly<Record<string, number>> }
        );
      }
      return value;
    }
    case "negate": {
      const operand = evaluateNode(node.operand, inputs);
      return requireFiniteResult(-operand, "negation", [operand], inputs);
    }
    case "add": {
      let result = evaluateNode(node.terms[0]!, inputs);
      for (let index = 1; index < node.terms.length; index += 1) {
        const right = evaluateNode(node.terms[index]!, inputs);
        result = requireFiniteResult(result + right, "addition", [result, right], inputs);
      }
      return result;
    }
    case "multiply": {
      let result = evaluateNode(node.factors[0]!, inputs);
      for (let index = 1; index < node.factors.length; index += 1) {
        const right = evaluateNode(node.factors[index]!, inputs);
        result = requireFiniteResult(
          result * right,
          "multiplication",
          [result, right],
          inputs
        );
      }
      return result;
    }
    case "divide": {
      const numerator = evaluateNode(node.numerator, inputs);
      const denominator = evaluateNode(node.denominator, inputs);
      if (denominator === 0) {
        throw new MathExpressionError(
          "division_by_zero",
          `Division by zero is not defined${location(inputs)}.`,
          errorDetails(inputs, "division", [numerator, denominator])
        );
      }
      return requireFiniteResult(
        numerator / denominator,
        "division",
        [numerator, denominator],
        inputs
      );
    }
    case "power": {
      const base = evaluateNode(node.base, inputs);
      const exponent = evaluateNode(node.exponent, inputs);
      const result = Math.pow(base, exponent);
      if (Number.isNaN(result)) {
        throw new MathExpressionError(
          "power_domain",
          `The power is not defined as a real number for base ${displayNumber(
            base
          )} and exponent ${displayNumber(exponent)}${location(inputs)}.`,
          errorDetails(inputs, "power", [base, exponent])
        );
      }
      return requireFiniteResult(result, "power", [base, exponent], inputs);
    }
    case "function": {
      const argument = evaluateNode(node.argument, inputs);
      switch (node.name) {
        case "exp":
          return requireFiniteResult(Math.exp(argument), "exponential", [argument], inputs);
        case "sin":
          return requireFiniteResult(Math.sin(argument), "sine", [argument], inputs);
        case "cos":
          return requireFiniteResult(Math.cos(argument), "cosine", [argument], inputs);
        case "tan": {
          const result = Math.tan(argument);
          if (!Number.isFinite(result)) {
            throw new MathExpressionError(
              "tangent_non_finite",
              `Tangent produced a non-finite result for ${displayNumber(argument)}${location(
                inputs
              )}.`,
              errorDetails(inputs, "tangent", [argument])
            );
          }
          return result;
        }
        case "sqrt":
          if (argument < 0) {
            throw new MathExpressionError(
              "square_root_domain",
              `Square root is not defined for negative real input ${displayNumber(
                argument
              )}${location(inputs)}.`,
              errorDetails(inputs, "square_root", [argument])
            );
          }
          return requireFiniteResult(Math.sqrt(argument), "square root", [argument], inputs);
        case "log":
          if (argument <= 0) {
            throw new MathExpressionError(
              "logarithm_domain",
              `Natural logarithm is defined only for positive real inputs${location(inputs)}.`,
              errorDetails(inputs, "natural_logarithm", [argument])
            );
          }
          return requireFiniteResult(
            Math.log(argument),
            "natural logarithm",
            [argument],
            inputs
          );
        case "abs":
          return requireFiniteResult(Math.abs(argument), "absolute value", [argument], inputs);
      }
    }
  }
}

function evaluateWithInputs(ast: MathAst, inputs: EvaluationInputs): number {
  for (const [name, value] of Object.entries(inputs) as Array<
    [MathVariableName, number]
  >) {
    requireFiniteInput(name, value, inputs);
  }
  return requireFiniteResult(evaluateNode(ast, inputs), "expression", [], inputs);
}

export function compileMathAst(value: unknown, profile: "rhs"): RhsEvaluator;
export function compileMathAst(
  value: unknown,
  profile: "exact_solution"
): ExactSolutionEvaluator;
export function compileMathAst(
  value: unknown,
  profile: "second_order_rhs"
): SecondOrderRhsEvaluator;
export function compileMathAst(
  value: unknown,
  profile: MathVariableProfile
): (...args: number[]) => number {
  const ast = canonicalizeMathAst(value, profile);

  switch (profile) {
    case "rhs":
      return (t: number, y: number) => evaluateWithInputs(ast, { t, y });
    case "exact_solution":
      return (t: number, t0: number, y0: number) =>
        evaluateWithInputs(ast, { t, t0, y0 });
    case "second_order_rhs":
      return (t: number, u: number) => evaluateWithInputs(ast, { t, u });
  }
}
