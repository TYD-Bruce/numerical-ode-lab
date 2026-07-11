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
  type MathFunctionName,
} from "./ast";
import { normalizeSubtraction } from "./canonical";
import { projectAccessibleMath, projectParsedExpression } from "./projection";

const t = variableNode("t");
const y = variableNode("y");

describe("canonical parsed-expression projection", () => {
  it.each([
    [numberNode(2), "2"],
    [numberNode(-0), "0"],
    [constantNode("e"), "e"],
    [constantNode("pi"), "pi"],
    [variableNode("y0"), "y0"],
    [negateNode(y), "-y"],
    [addNode(t, y), "t + y"],
    [multiplyNode(numberNode(2), t), "2 * t"],
    [divideNode(numberNode(1), addNode(numberNode(1), t)), "1 / (1 + t)"],
    [powerNode(t, numberNode(2)), "t ^ 2"],
    [functionNode("sin", t), "sin(t)"],
    [functionNode("abs", y), "abs(y)"],
  ])("projects %# deterministically", (ast, expected) => {
    expect(projectParsedExpression(ast)).toBe(expected);
  });

  it("prints add-plus-negate as readable subtraction", () => {
    expect(projectParsedExpression(normalizeSubtraction(t, variableNode("t0")))).toBe(
      "t - t0"
    );
  });

  it("preserves nested addition and multiplication grouping", () => {
    expect(projectParsedExpression(addNode(addNode(t, y), numberNode(1)))).toBe(
      "(t + y) + 1"
    );
    expect(projectParsedExpression(addNode(t, addNode(y, numberNode(1))))).toBe(
      "t + (y + 1)"
    );
    expect(projectParsedExpression(multiplyNode(numberNode(2), multiplyNode(numberNode(3), t)))).toBe(
      "2 * (3 * t)"
    );
    expect(projectParsedExpression(multiplyNode(multiplyNode(numberNode(2), numberNode(3)), t))).toBe(
      "(2 * 3) * t"
    );
  });

  it("projects the future exact-solution example without JavaScript source", () => {
    const expression = multiplyNode(
      variableNode("y0"),
      functionNode(
        "exp",
        negateNode(normalizeSubtraction(variableNode("t"), variableNode("t0")))
      )
    );
    const projected = projectParsedExpression(expression, "exact_solution");

    expect(projected).toBe("y0 * exp(-(t - t0))");
    expect(projected).not.toMatch(/Math\.|=>|;|new Function|eval/);
  });

  it("uses caret power notation rather than executable JavaScript power syntax", () => {
    expect(projectParsedExpression(powerNode(t, numberNode(2)))).toBe("t ^ 2");
    expect(projectParsedExpression(powerNode(t, numberNode(2)))).not.toContain("**");
  });
});
describe("accessible English projection", () => {
  it.each([
    [negateNode(y), "negative y"],
    [addNode(t, y), "t plus y"],
    [multiplyNode(numberNode(2), t), "2 times t"],
    [
      divideNode(numberNode(1), addNode(numberNode(1), t)),
      "1 divided by the quantity 1 plus t",
    ],
    [powerNode(constantNode("e"), t), "e raised to t"],
    [functionNode("exp", t), "e raised to t"],
    [functionNode("sin", t), "sine of t"],
    [functionNode("abs", y), "absolute value of y"],
    [variableNode("t0"), "t sub zero"],
    [variableNode("y0"), "y sub zero"],
  ])("describes %#", (ast, expected) => {
    expect(projectAccessibleMath(ast)).toBe(expected);
  });

  it.each<[MathFunctionName, string]>([
    ["sin", "sine"],
    ["cos", "cosine"],
    ["tan", "tangent"],
    ["sqrt", "square root"],
    ["log", "natural logarithm"],
    ["abs", "absolute value"],
  ])("uses deterministic wording for %s", (name, wording) => {
    expect(projectAccessibleMath(functionNode(name, t))).toBe(`${wording} of t`);
  });

  it("keeps grouped expressions distinguishable in spoken fallback", () => {
    const leftGrouped = projectAccessibleMath(addNode(addNode(t, y), numberNode(1)));
    const rightGrouped = projectAccessibleMath(addNode(t, addNode(y, numberNode(1))));

    expect(leftGrouped).toBe("the quantity t plus y plus 1");
    expect(rightGrouped).toBe("t plus the quantity y plus 1");
    expect(leftGrouped).not.toBe(rightGrouped);
  });

  it("describes negative numeric literals without raw sign-only speech", () => {
    expect(projectAccessibleMath(numberNode(-2))).toBe("negative 2");
  });
});
