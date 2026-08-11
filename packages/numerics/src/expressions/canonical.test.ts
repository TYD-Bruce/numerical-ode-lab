import { describe, expect, it } from "vitest";

import {
  addNode,
  constantNode,
  divideNode,
  functionNode,
  multiplyNode,
  negateNode,
  numberNode,
  powerNode,
  variableNode,
} from "./ast";
import {
  MATH_AST_SERIALIZATION_VERSION,
  canonicalizeMathAst,
  normalizeMultiplication,
  normalizeSubtraction,
  serializeMathAst,
} from "./canonical";

const t = variableNode("t");
const y = variableNode("y");
const one = numberNode(1);
const two = numberNode(2);
const three = numberNode(3);

describe("canonical normalization", () => {
  it("normalizes subtraction only to add plus negate", () => {
    expect(normalizeSubtraction(t, y)).toEqual(addNode(t, negateNode(y)));
  });

  it("preserves nested grouping and child order without flattening or sorting", () => {
    const nested = addNode(addNode(t, y), one);
    const reversed = addNode(y, t);

    expect(canonicalizeMathAst(nested)).toEqual(nested);
    expect(canonicalizeMathAst(reversed)).toEqual(reversed);
  });

  it("does not fold constants or flatten nested multiplication", () => {
    const nested = multiplyNode(two, multiplyNode(three, t));
    expect(canonicalizeMathAst(nested)).toEqual(nested);
  });

  it("keeps exp, standalone e, and general power as distinct nodes", () => {
    const exp = functionNode("exp", t);
    const standaloneE = constantNode("e");
    const power = powerNode(constantNode("e"), t);

    expect(canonicalizeMathAst(exp)).toEqual(exp);
    expect(canonicalizeMathAst(standaloneE)).toEqual(standaloneE);
    expect(canonicalizeMathAst(power)).toEqual(power);
    expect(canonicalizeMathAst(power)).not.toEqual(exp);
  });
});
describe("math-ast-v1 serialization", () => {
  it("uses a fixed version prefix and explicit length fields", () => {
    expect(serializeMathAst(numberNode(2))).toBe("math-ast-v1|n1:2");
    expect(serializeMathAst(t)).toBe("math-ast-v1|v1:t");
    expect(serializeMathAst(addNode(t, y))).toBe("math-ast-v1|a2;4:v1:t4:v1:y");
    expect(MATH_AST_SERIALIZATION_VERSION).toBe("math-ast-v1");
  });

  it.each([
    numberNode(0.1),
    constantNode("pi"),
    variableNode("y0"),
    negateNode(t),
    addNode(t, y),
    multiplyNode(two, t),
    divideNode(one, addNode(one, t)),
    powerNode(t, two),
    functionNode("abs", y),
  ])("serializes every node deterministically", (ast) => {
    const first = serializeMathAst(ast);
    expect(serializeMathAst(ast)).toBe(first);
    expect(first.startsWith("math-ast-v1|")).toBe(true);
  });

  it.each([0.1, Number.MIN_VALUE, Number.MAX_VALUE, 1e-7, 1e21])(
    "uses JavaScript round-trip number spelling for %s",
    (value) => {
      expect(serializeMathAst(numberNode(value))).toContain(String(value));
    }
  );

  it("normalizes negative zero only in serialization", () => {
    expect(serializeMathAst(numberNode(-0))).toBe(serializeMathAst(numberNode(0)));
    expect(Object.is((canonicalizeMathAst(numberNode(-0)) as { value: number }).value, -0)).toBe(
      true
    );
  });

  it.each([
    [addNode(addNode(t, y), one), addNode(t, addNode(y, one))],
    [multiplyNode(two, multiplyNode(three, t)), multiplyNode(multiplyNode(two, three), t)],
    [addNode(t, y), addNode(y, t)],
    [divideNode(t, y), multiplyNode(t, powerNode(y, numberNode(-1)))],
    [functionNode("exp", t), powerNode(variableNode("y"), t)],
  ])("distinguishes grouping, order, or node structure", (left, right) => {
    expect(serializeMathAst(left)).not.toBe(serializeMathAst(right));
  });

  it("serializes structurally identical constructor results identically", () => {
    const first = addNode(variableNode("t"), numberNode(1));
    const second = { kind: "add", terms: [variableNode("t"), numberNode(1)] };
    expect(serializeMathAst(first)).toBe(serializeMathAst(second));
  });

  it("gives future explicit and implicit multiplication one AST serialization", () => {
    const explicit = normalizeMultiplication([two, t]);
    const implicit = normalizeMultiplication([numberNode(2), variableNode("t")]);
    expect(serializeMathAst(explicit)).toBe(serializeMathAst(implicit));
  });

  it("does not equate exp with a retained power-of-e node", () => {
    expect(serializeMathAst(functionNode("exp", t))).not.toBe(
      serializeMathAst(powerNode(constantNode("e"), t))
    );
  });
});
