import type { MathAst, MathVariableProfile } from "./ast";
import { canonicalizeMathAst } from "./canonical";

function numberText(value: number): string {
  return Object.is(value, -0) ? "0" : String(value);
}
function parsedNeedsParentheses(node: MathAst): boolean {
  return (
    node.kind === "add" ||
    node.kind === "multiply" ||
    node.kind === "divide" ||
    node.kind === "power" ||
    node.kind === "negate"
  );
}

function parsedWrapped(node: MathAst): string {
  const text = parsedNode(node);
  return parsedNeedsParentheses(node) ? `(${text})` : text;
}

function parsedAdd(node: Extract<MathAst, { kind: "add" }>): string {
  return node.terms
    .map((term, index) => {
      if (term.kind === "negate") {
        const operand = parsedNode(term.operand);
        const wrapped = parsedNeedsParentheses(term.operand) ? `(${operand})` : operand;
        return index === 0 ? `-${wrapped}` : ` - ${wrapped}`;
      }

      const text = term.kind === "add" ? `(${parsedNode(term)})` : parsedNode(term);
      return index === 0 ? text : ` + ${text}`;
    })
    .join("");
}

function parsedNode(node: MathAst): string {
  switch (node.kind) {
    case "number":
      return numberText(node.value);
    case "constant":
    case "variable":
      return node.name;
    case "negate": {
      const operand = parsedNode(node.operand);
      return `-${parsedNeedsParentheses(node.operand) ? `(${operand})` : operand}`;
    }
    case "add":
      return parsedAdd(node);
    case "multiply":
      return node.factors
        .map((factor) =>
          factor.kind === "multiply" || parsedNeedsParentheses(factor)
            ? `(${parsedNode(factor)})`
            : parsedNode(factor)
        )
        .join(" * ");
    case "divide":
      return `${parsedWrapped(node.numerator)} / ${parsedWrapped(node.denominator)}`;
    case "power":
      return `${parsedWrapped(node.base)} ^ ${parsedWrapped(node.exponent)}`;
    case "function":
      return `${node.name}(${parsedNode(node.argument)})`;
  }
}

function accessibleNumber(value: number): string {
  if (Object.is(value, -0) || value === 0) return "0";
  return value < 0 ? `negative ${String(-value)}` : String(value);
}

function accessibleVariable(name: string): string {
  if (name === "t0") return "t sub zero";
  if (name === "y0") return "y sub zero";
  return name;
}

function accessibleIsCompound(node: MathAst): boolean {
  return (
    node.kind === "add" ||
    node.kind === "multiply" ||
    node.kind === "divide" ||
    node.kind === "power" ||
    node.kind === "negate"
  );
}

function accessibleQuantity(node: MathAst): string {
  const text = accessibleNode(node);
  return accessibleIsCompound(node) ? `the quantity ${text}` : text;
}

function accessibleAdd(node: Extract<MathAst, { kind: "add" }>): string {
  return node.terms
    .map((term, index) => {
      if (term.kind === "negate") {
        const operand = accessibleQuantity(term.operand);
        return index === 0 ? `negative ${operand}` : ` minus ${operand}`;
      }
      const text = term.kind === "add" ? `the quantity ${accessibleNode(term)}` : accessibleNode(term);
      return index === 0 ? text : ` plus ${text}`;
    })
    .join("");
}

function accessibleNode(node: MathAst): string {
  switch (node.kind) {
    case "number":
      return accessibleNumber(node.value);
    case "constant":
      return node.name === "pi" ? "pi" : "e";
    case "variable":
      return accessibleVariable(node.name);
    case "negate":
      return `negative ${accessibleQuantity(node.operand)}`;
    case "add":
      return accessibleAdd(node);
    case "multiply":
      return node.factors.map(accessibleQuantity).join(" times ");
    case "divide":
      return `${accessibleQuantity(node.numerator)} divided by ${accessibleQuantity(
        node.denominator
      )}`;
    case "power":
      return `${accessibleQuantity(node.base)} raised to ${accessibleQuantity(node.exponent)}`;
    case "function": {
      const argument = accessibleQuantity(node.argument);
      switch (node.name) {
        case "exp":
          return `e raised to ${argument}`;
        case "sin":
          return `sine of ${argument}`;
        case "cos":
          return `cosine of ${argument}`;
        case "tan":
          return `tangent of ${argument}`;
        case "sqrt":
          return `square root of ${argument}`;
        case "log":
          return `natural logarithm of ${argument}`;
        case "abs":
          return `absolute value of ${argument}`;
      }
    }
  }
}

export function projectParsedExpression(
  value: unknown,
  profile?: MathVariableProfile
): string {
  return parsedNode(canonicalizeMathAst(value, profile));
}

export function projectAccessibleMath(
  value: unknown,
  profile?: MathVariableProfile
): string {
  return accessibleNode(canonicalizeMathAst(value, profile));
}
