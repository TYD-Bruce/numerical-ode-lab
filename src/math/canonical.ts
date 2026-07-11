import {
  type MathAst,
  type MathVariableProfile,
  addNode,
  negateNode,
  multiplyNode,
} from "./ast";
import { validateMathAst } from "./validation";

export const MATH_AST_SERIALIZATION_VERSION = "math-ast-v1";

export function normalizeSubtraction(left: MathAst, right: MathAst): MathAst {
  return addNode(left, negateNode(right));
}
export function normalizeMultiplication(factors: readonly MathAst[]): MathAst {
  return multiplyNode(...factors);
}

export function canonicalizeMathAst(
  value: unknown,
  profile?: MathVariableProfile
): MathAst {
  validateMathAst(value, profile);
  return cloneCanonical(value);
}

function cloneCanonical(node: MathAst): MathAst {
  switch (node.kind) {
    case "number":
      return { kind: "number", value: node.value };
    case "constant":
      return { kind: "constant", name: node.name };
    case "variable":
      return { kind: "variable", name: node.name };
    case "negate":
      return { kind: "negate", operand: cloneCanonical(node.operand) };
    case "add":
      return { kind: "add", terms: node.terms.map(cloneCanonical) };
    case "multiply":
      return { kind: "multiply", factors: node.factors.map(cloneCanonical) };
    case "divide":
      return {
        kind: "divide",
        numerator: cloneCanonical(node.numerator),
        denominator: cloneCanonical(node.denominator),
      };
    case "power":
      return {
        kind: "power",
        base: cloneCanonical(node.base),
        exponent: cloneCanonical(node.exponent),
      };
    case "function":
      return {
        kind: "function",
        name: node.name,
        argument: cloneCanonical(node.argument),
      };
  }
}

function lengthField(value: string): string {
  return `${value.length}:${value}`;
}

function encodeChildren(tag: string, children: readonly MathAst[]): string {
  const encoded = children.map(encodeNode);
  return `${tag}${encoded.length};${encoded.map(lengthField).join("")}`;
}

function encodeNumber(value: number): string {
  return Object.is(value, -0) ? "0" : String(value);
}

function encodeNode(node: MathAst): string {
  switch (node.kind) {
    case "number":
      return `n${lengthField(encodeNumber(node.value))}`;
    case "constant":
      return `c${lengthField(node.name)}`;
    case "variable":
      return `v${lengthField(node.name)}`;
    case "negate":
      return `g${lengthField(encodeNode(node.operand))}`;
    case "add":
      return encodeChildren("a", node.terms);
    case "multiply":
      return encodeChildren("m", node.factors);
    case "divide":
      return encodeChildren("d", [node.numerator, node.denominator]);
    case "power":
      return encodeChildren("p", [node.base, node.exponent]);
    case "function":
      return `f${lengthField(node.name)}${lengthField(encodeNode(node.argument))}`;
  }
}

export function serializeMathAst(
  value: unknown,
  profile?: MathVariableProfile
): string {
  const ast = canonicalizeMathAst(value, profile);
  return `${MATH_AST_SERIALIZATION_VERSION}|${encodeNode(ast)}`;
}
