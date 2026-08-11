import { describe, expect, it } from "vitest";
import { createMathExpressionFromLatex } from "../mathJsonAdapter";
import {
  importLegacyMathFieldExpression,
  inspectIncompleteLatex,
  validateMathFieldDraft,
} from "./mathFieldState";

describe("inspectIncompleteLatex", () => {
  it.each([
    ["", "empty_expression"],
    ["t^{}", "empty_exponent"],
    ["t^", "empty_exponent"],
    ["t^{\\placeholder{}}", "empty_exponent"],
    ["\\frac{}{t}", "empty_numerator"],
    ["\\frac{t}{}", "empty_denominator"],
    ["\\frac{\\placeholder{}}{t}", "empty_numerator"],
    ["\\sqrt{}", "empty_root"],
    ["\\sin()", "empty_function_argument"],
    ["\\ln(\\placeholder{})", "empty_function_argument"],
    ["\\left|\\placeholder{}\\right|", "empty_absolute_value"],
    ["t\\sqrt{\\placeholder{}}", "empty_root"],
    ["t\\sin(\\placeholder{})", "empty_function_argument"],
    ["t\\cos(\\placeholder{})", "empty_function_argument"],
    ["t\\tan(\\placeholder{})", "empty_function_argument"],
    ["t\\ln(\\placeholder{})", "empty_function_argument"],
    ["t\\left|\\placeholder{}\\right|", "empty_absolute_value"],
    ["(t+y", "unclosed_group"],
    ["t+#?", "placeholder"],
  ])("classifies %s as %s", (latex, kind) => {
    expect(inspectIncompleteLatex(latex)?.kind).toBe(kind);
  });

  it.each([
    "0",
    "t^0",
    "t^{1+{2}}",
    "\\frac{0}{1+t}",
    "\\sqrt{0}",
    "\\sin(t)",
    "\\left|y\\right|",
    "t\\pi",
    String.raw`\\{t\\}`,
    "(t)+(y)",
  ])("accepts complete nested or adjacent notation: %s", (latex) => {
    expect(inspectIncompleteLatex(latex)).toBeUndefined();
  });
});

describe("validateMathFieldDraft", () => {
  const confirmed = createMathExpressionFromLatex("-y", "rhs");

  it("keeps the confirmed meaning during gentle incomplete editing", () => {
    const snapshot = validateMathFieldDraft("t^{}", "rhs", confirmed, false);
    expect(snapshot).toMatchObject({
      strict: false,
      state: { kind: "incomplete", confirmed },
    });
  });

  it("turns incompleteness into a specific strict error without replacing confirmation", () => {
    const snapshot = validateMathFieldDraft("t^{}", "rhs", confirmed, true);
    expect(snapshot).toMatchObject({
      strict: true,
      state: {
        kind: "invalid",
        confirmed,
        error: { code: "incomplete_expression", message: "Finish the exponent before continuing." },
      },
    });
  });

  it("confirms complete expressions through the shared adapter", () => {
    const snapshot = validateMathFieldDraft("y(1-y)", "rhs", confirmed, false);
    expect(snapshot.state.kind).toBe("ready");
    if (snapshot.state.kind === "ready") {
      expect(snapshot.state.confirmed.canonicalAst.kind).toBe("multiply");
      expect(snapshot.state.confirmed.latex).toBe("y(1-y)");
    }
  });

  it.each([
    ["rhs", "u", "Use only t and y"],
    ["second_order_rhs", "y", "Use only t and u"],
    ["exact_solution", "y", "Use only t, t₀, and y₀"],
  ] as const)("enforces the %s profile", (profile, latex, message) => {
    const snapshot = validateMathFieldDraft(latex, profile, undefined, true);
    expect(snapshot.state.kind).toBe("invalid");
    if (snapshot.state.kind === "invalid") expect(snapshot.state.error.message).toContain(message);
  });
});

describe("legacy field import boundary", () => {
  it.each([
    ["rhs", "Math.sin(t)-0.1*y", "\\sin\\left(t\\right)-\\left(0.1\\cdot y\\right)"],
    ["second_order_rhs", "-u", "-u"],
    ["exact_solution", "y0 * exp(-(t - t0))", "y_0\\cdot e^{-\\left(t-t_0\\right)}"],
  ] as const)("imports controlled %s text into textbook LaTeX", (profile, source, latex) => {
    const result = importLegacyMathFieldExpression(source, profile);
    expect(result.kind).toBe("ready");
    if (result.kind === "ready") expect(result.expression.latex).toBe(latex);
  });

  it("returns a controlled error for executable legacy text", () => {
    const result = importLegacyMathFieldExpression("window.alert(1)", "rhs");
    expect(result.kind).toBe("invalid");
    if (result.kind === "invalid") {
      expect(result.error.code).toBe("invalid_legacy_expression");
      expect(result.error.message).toContain("not an approved legacy alias");
    }
  });
});
