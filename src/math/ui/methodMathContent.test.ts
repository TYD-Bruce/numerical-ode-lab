import { describe, expect, it } from "vitest";
import { METHOD_CATALOG } from "../../methodCatalog";
import { methodMathContent } from "./methodMathContent";

describe("methodMathContent", () => {
  it("provides trusted LaTeX, English accessibility text, and the current fallback for every method", () => {
    for (const entry of METHOD_CATALOG) {
      const formula = methodMathContent(entry).formula;
      expect(formula?.latex.length).toBeGreaterThan(0);
      expect(formula?.ariaLabel).toMatch(/[A-Za-z]/);
      expect(formula?.displayText).toBe(entry.formulaDisplay);
    }
  });

  it("keeps the method catalog fallback separate from trusted LaTeX", () => {
    const rk4 = METHOD_CATALOG.find((entry) => entry.family === "rk4")!;
    const formula = methodMathContent(rk4).formula!;
    expect(formula.latex).toContain("\\frac{h}{6}");
    expect(formula.displayText).toBe(rk4.formulaDisplay);
    expect(formula.latex).not.toBe(formula.displayText);
  });
});
