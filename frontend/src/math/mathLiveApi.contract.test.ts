import { ComputeEngine } from "@cortex-js/compute-engine";
import type { MathfieldElement, MathSpanElement } from "mathlive";
import { describe, expect, it } from "vitest";

const computeEngine = new ComputeEngine();

function parseRaw(latex: string) {
  return computeEngine.parse(latex, { form: "raw" });
}

describe("Compute Engine 0.58 raw MathJSON contract", () => {
  it.each([
    ["t + y", "t+y", ["Add", "t", "y"]],
    [
      "(t + y) + 1",
      "(t+y)+1",
      ["Add", ["Delimiter", ["Add", "t", "y"]], 1],
    ],
    [
      "t + (y + 1)",
      "t+(y+1)",
      ["Add", "t", ["Delimiter", ["Add", "y", 1]]],
    ],
    [
      "2 * (3 * t)",
      "2\\cdot(3\\cdot t)",
      ["Multiply", 2, ["Delimiter", ["Multiply", 3, "t"]]],
    ],
    [
      "(2 * 3) * t",
      "(2\\cdot3)\\cdot t",
      ["Multiply", ["Delimiter", ["Multiply", 2, 3]], "t"],
    ],
    ["t - y", "t-y", ["Subtract", "t", "y"]],
    ["-y", "-y", ["Negate", "y"]],
    [
      "1 / (1 + t)",
      "\\frac{1}{1+t}",
      ["Divide", 1, ["Add", 1, "t"]],
    ],
    ["t^2", "t^2", ["Power", "t", 2]],
    ["e^t", "e^t", ["Power", "e", "t"]],
    ["exp(t)", "\\exp(t)", ["Exp", "t"]],
    ["sin(t)", "\\sin(t)", ["Sin", "t"]],
    ["cos(t)", "\\cos(t)", ["Cos", "t"]],
    ["tan(t)", "\\tan(t)", ["Tan", "t"]],
    ["sqrt(t)", "\\sqrt{t}", ["Sqrt", "t"]],
    ["ln(t)", "\\ln(t)", ["Ln", "t"]],
    ["|t|", "\\lvert t\\rvert", ["Abs", "t"]],
    ["2t", "2t", ["InvisibleOperator", 2, "t"]],
    ["ty as separate symbols", "ty", ["InvisibleOperator", "t", "y"]],
    [
      "2 sin(t)",
      "2\\sin(t)",
      ["InvisibleOperator", 2, ["Sin", "t"]],
    ],
    [
      "y(1-y)",
      "y(1-y)",
      ["InvisibleOperator", "y", ["Delimiter", ["Subtract", 1, "y"]]],
    ],
    [
      "(t+1)(y-1)",
      "(t+1)(y-1)",
      [
        "InvisibleOperator",
        ["Delimiter", ["Add", "t", 1]],
        ["Delimiter", ["Subtract", "y", 1]],
      ],
    ],
  ])("preserves %s as a raw public MathJSON shape", (_name, latex, expected) => {
    expect(parseRaw(latex).json).toEqual(expected);
  });

  it("keeps explicit and implicit multiplication distinguishable", () => {
    expect(parseRaw("2\\cdot t").json).toEqual(["Multiply", 2, "t"]);
    expect(parseRaw("2t").json).toEqual(["InvisibleOperator", 2, "t"]);
  });

  it("uses the public raw form instead of the default canonical parse", () => {
    const canonical = computeEngine.parse("t+(y+1)");

    expect(canonical.json).toEqual(["Add", "t", "y", 1]);
    expect(parseRaw("t+(y+1)").json).toEqual([
      "Add",
      "t",
      ["Delimiter", ["Add", "y", 1]],
    ]);
  });

  it.each([
    ["incomplete fraction", "\\frac{1}{}", ["Divide", 1, ["Error", "missing"]]],
    [
      "unclosed group",
      "(t+1",
      ["Error", "'unexpected-delimiter'", ["LatexString", "'('"]],
    ],
  ])("returns inspectable errors for an %s", (_name, latex, expected) => {
    const expression = parseRaw(latex);

    expect(expression.isValid).toBe(false);
    expect(expression.json).toEqual(expected);
    expect(expression.errors.length).toBeGreaterThan(0);
  });

  it("currently truncates an incomplete exponent without a Compute Engine error", () => {
    const expression = parseRaw("t^{}");

    expect(expression.isValid).toBe(true);
    expect(expression.json).toBe("t");
    expect(expression.errors).toEqual([]);
  });
});

describe("MathLive 0.110 TypeScript contract", () => {
  it("provides browser element types without local custom-element declarations", () => {
    const checkTypes = (
      field: MathfieldElement,
      staticMath: MathSpanElement
    ): Array<unknown> => [
      field.value,
      field.insert,
      field.readOnly,
      field.mathVirtualKeyboardPolicy,
      field.tabIndex,
      staticMath.render,
    ];

    expect(checkTypes).toBeTypeOf("function");
  });
});
