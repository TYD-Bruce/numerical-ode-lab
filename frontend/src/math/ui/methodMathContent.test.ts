import { describe, expect, it } from "vitest";
import { METHOD_CATALOG } from "@numerical-t-lab/numerics/ode/method-catalog";
import {
  ODE_METHOD_FOUNDATION_MATH,
  methodMathContent,
  methodTeachingMathContent,
} from "./methodMathContent";

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

  it("adds a closed Leap-Frog teaching formula without changing the current UI formula", () => {
    const leapfrog = METHOD_CATALOG.find(
      (entry) => entry.family === "leapfrog"
    )!;
    const currentUiFormula = methodMathContent(leapfrog).formula!;
    const teachingFormula = methodTeachingMathContent(leapfrog).formula!;

    expect(currentUiFormula.displayText).toBe(leapfrog.formulaDisplay);
    expect(currentUiFormula.latex).toBe("u''=a(t,u)");
    expect(teachingFormula.latex).toContain("v_{-1/2}");
    expect(teachingFormula.latex).toContain("v_{n+1/2}");
    expect(teachingFormula.latex).toContain("u_{n+1}");
    expect(teachingFormula.latex).toContain("v_{n+1}");
    expect(teachingFormula.displayText).toContain("v₋₁⁄₂");
    expect(teachingFormula.ariaLabel).toContain("half-step velocity");
    expect(teachingFormula).not.toHaveProperty("html");
    expect(teachingFormula).not.toHaveProperty("evaluate");
  });

  it("owns the closed Phase 2 problem-foundation formulas", () => {
    expect(Object.keys(ODE_METHOD_FOUNDATION_MATH)).toEqual([
      "firstOrderIvp",
      "starterExample",
      "secondOrderProfile",
    ]);
    expect(ODE_METHOD_FOUNDATION_MATH.firstOrderIvp.displayText).toContain(
      "y′(t) = f(t, y)"
    );
    expect(ODE_METHOD_FOUNDATION_MATH.starterExample.displayText).toContain(
      "y(0) = 1"
    );
    expect(ODE_METHOD_FOUNDATION_MATH.secondOrderProfile.displayText).toContain(
      "u′(t₀) = v₀"
    );
    for (const content of Object.values(ODE_METHOD_FOUNDATION_MATH)) {
      expect(Object.keys(content).sort()).toEqual([
        "ariaLabel",
        "displayText",
        "latex",
      ]);
      expect(content).not.toHaveProperty("html");
      expect(content).not.toHaveProperty("evaluate");
      expect(content).not.toHaveProperty("mathJson");
      expect(Object.isFrozen(content)).toBe(true);
    }
  });
});
