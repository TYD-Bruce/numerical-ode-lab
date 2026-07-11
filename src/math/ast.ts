export const MATH_CONSTANT_NAMES = ["e", "pi"] as const;
export type MathConstantName = (typeof MATH_CONSTANT_NAMES)[number];

export const MATH_VARIABLE_NAMES = ["t", "y", "u", "t0", "y0"] as const;
export type MathVariableName = (typeof MATH_VARIABLE_NAMES)[number];

export const MATH_FUNCTION_NAMES = [
  "exp",
  "sin",
  "cos",
  "tan",
  "sqrt",
  "log",
  "abs",
] as const;
export type MathFunctionName = (typeof MATH_FUNCTION_NAMES)[number];

export type MathAst =
  | { readonly kind: "number"; readonly value: number }
  | { readonly kind: "constant"; readonly name: MathConstantName }
  | { readonly kind: "variable"; readonly name: MathVariableName }
  | { readonly kind: "negate"; readonly operand: MathAst }
  | { readonly kind: "add"; readonly terms: readonly MathAst[] }
  | { readonly kind: "multiply"; readonly factors: readonly MathAst[] }
  | {
      readonly kind: "divide";
      readonly numerator: MathAst;
      readonly denominator: MathAst;
    }
  | {
      readonly kind: "power";
      readonly base: MathAst;
      readonly exponent: MathAst;
    }
  | {
      readonly kind: "function";
      readonly name: MathFunctionName;
      readonly argument: MathAst;
    };

export type MathVariableProfile =
  | "rhs"
  | "exact_solution"
  | "second_order_rhs";

export const numberNode = (value: number): MathAst => ({ kind: "number", value });
export const constantNode = (name: MathConstantName): MathAst => ({
  kind: "constant",
  name,
});
export const variableNode = (name: MathVariableName): MathAst => ({
  kind: "variable",
  name,
});
export const negateNode = (operand: MathAst): MathAst => ({ kind: "negate", operand });
export const addNode = (...terms: MathAst[]): MathAst => ({ kind: "add", terms });
export const multiplyNode = (...factors: MathAst[]): MathAst => ({
  kind: "multiply",
  factors,
});
export const divideNode = (numerator: MathAst, denominator: MathAst): MathAst => ({
  kind: "divide",
  numerator,
  denominator,
});
export const powerNode = (base: MathAst, exponent: MathAst): MathAst => ({
  kind: "power",
  base,
  exponent,
});
export const functionNode = (
  name: MathFunctionName,
  argument: MathAst
): MathAst => ({ kind: "function", name, argument });
