import { ComputeEngine } from "@cortex-js/compute-engine";

import type { MathAst, MathVariableProfile } from "@numerical-t-lab/numerics/expressions/ast";
import { canonicalizeMathAst, normalizeMultiplication, normalizeSubtraction } from "@numerical-t-lab/numerics/expressions/canonical";
import { MathExpressionError } from "@numerical-t-lab/numerics/expressions/errors";
import { createMathExpression, type MathExpression } from "@numerical-t-lab/numerics/expressions/expression";

const computeEngine = new ComputeEngine();

const FUNCTION_HEADS = new Map<string, "exp" | "sin" | "cos" | "tan" | "sqrt" | "log" | "abs">([
  ["Exp", "exp"],
  ["Sin", "sin"],
  ["Cos", "cos"],
  ["Tan", "tan"],
  ["Sqrt", "sqrt"],
  ["Log", "log"],
  ["Ln", "log"],
  ["Abs", "abs"],
]);

function mathJsonError(message: string, code: "invalid_math_json" | "incomplete_expression" = "invalid_math_json"): never {
  throw new MathExpressionError(code, message, { adapter: "math_json" });
}

function requireDenseArray(value: unknown): readonly unknown[] {
  if (!Array.isArray(value)) {
    return mathJsonError("Raw MathJSON must be a supported symbol, number, or operator array.");
  }

  const enumerableKeys = Reflect.ownKeys(value).filter((key) =>
    Object.prototype.propertyIsEnumerable.call(value, key)
  );
  if (
    enumerableKeys.length !== value.length ||
    enumerableKeys.some(
      (key, index) => typeof key !== "string" || key !== String(index)
    )
  ) {
    return mathJsonError("Raw MathJSON arrays must be dense and contain no metadata fields.");
  }
  return value;
}

function requireArity(
  raw: readonly unknown[],
  head: string,
  operandCount: number
): void {
  if (raw.length !== operandCount + 1) {
    mathJsonError(`${head} requires exactly ${operandCount} operand${operandCount === 1 ? "" : "s"}.`);
  }
}

function requireAtLeastTwoOperands(raw: readonly unknown[], head: string): void {
  if (raw.length < 3) {
    mathJsonError(`${head} requires at least two operands.`);
  }
}

function symbolCandidate(symbol: string): unknown {
  switch (symbol) {
    case "e":
    case "ExponentialE":
      return { kind: "constant", name: "e" };
    case "Pi":
      return { kind: "constant", name: "pi" };
    case "t_0":
      return { kind: "variable", name: "t0" };
    case "y_0":
      return { kind: "variable", name: "y0" };
    default:
      return { kind: "variable", name: symbol };
  }
}

function isRawExponentialBase(value: unknown): boolean {
  return value === "e" || value === "ExponentialE";
}

function convertCandidate(raw: unknown, active: WeakSet<object>): unknown {
  if (typeof raw === "number") return { kind: "number", value: raw };
  if (typeof raw === "string") return symbolCandidate(raw);
  if (typeof raw !== "object" || raw === null) {
    return mathJsonError("Raw MathJSON contains an unsupported scalar value.");
  }
  if (active.has(raw)) {
    return mathJsonError("Raw MathJSON contains a cyclic reference.");
  }

  active.add(raw);
  try {
    const array = requireDenseArray(raw);
    const head = array[0];
    if (typeof head !== "string") {
      return mathJsonError("Raw MathJSON operator arrays require a string head.");
    }

    if (head === "Error") {
      // Explicit Error nodes prove incompleteness. If an empty exponent has
      // already disappeared from MathJSON, this adapter cannot reconstruct it;
      // Phase 4 must inspect the draft LaTeX placeholders before conversion.
      return mathJsonError(
        "The mathematical expression is incomplete.",
        "incomplete_expression"
      );
    }

    if (head === "Delimiter") {
      requireArity(array, head, 1);
      return convertCandidate(array[1], active);
    }
    if (head === "Negate") {
      requireArity(array, head, 1);
      return { kind: "negate", operand: convertCandidate(array[1], active) };
    }
    if (head === "Add") {
      requireAtLeastTwoOperands(array, head);
      return {
        kind: "add",
        terms: array.slice(1).map((operand) => convertCandidate(operand, active)),
      };
    }
    if (head === "Subtract") {
      requireArity(array, head, 2);
      return normalizeSubtraction(
        convertCandidate(array[1], active) as MathAst,
        convertCandidate(array[2], active) as MathAst
      );
    }
    if (head === "Multiply" || head === "InvisibleOperator") {
      requireAtLeastTwoOperands(array, head);
      return normalizeMultiplication(
        array
          .slice(1)
          .map((operand) => convertCandidate(operand, active) as MathAst)
      );
    }
    if (head === "Divide") {
      requireArity(array, head, 2);
      return {
        kind: "divide",
        numerator: convertCandidate(array[1], active),
        denominator: convertCandidate(array[2], active),
      };
    }
    if (head === "Power") {
      requireArity(array, head, 2);
      const argument = convertCandidate(array[2], active);
      if (isRawExponentialBase(array[1])) {
        return { kind: "function", name: "exp", argument };
      }
      return {
        kind: "power",
        base: convertCandidate(array[1], active),
        exponent: argument,
      };
    }

    const functionName = FUNCTION_HEADS.get(head);
    if (functionName) {
      requireArity(array, head, 1);
      return {
        kind: "function",
        name: functionName,
        argument: convertCandidate(array[1], active),
      };
    }

    return mathJsonError(`Raw MathJSON operator ${head} is not supported.`);
  } finally {
    active.delete(raw);
  }
}

export function parseLatexToRawMathJson(latex: string): unknown {
  try {
    return computeEngine.parse(latex, { form: "raw" }).json;
  } catch {
    return mathJsonError("The mathematical notation could not be parsed as raw MathJSON.");
  }
}

export function convertRawMathJson(
  raw: unknown,
  profile: MathVariableProfile
): MathAst {
  const candidate = convertCandidate(raw, new WeakSet<object>());
  return canonicalizeMathAst(candidate, profile);
}

export function createMathExpressionFromRawMathJson(
  latex: string,
  raw: unknown,
  profile: MathVariableProfile
): MathExpression {
  return createMathExpression(latex, convertRawMathJson(raw, profile), profile);
}

export function createMathExpressionFromLatex(
  latex: string,
  profile: MathVariableProfile
): MathExpression {
  return createMathExpressionFromRawMathJson(
    latex,
    parseLatexToRawMathJson(latex),
    profile
  );
}
