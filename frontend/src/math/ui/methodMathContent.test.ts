import { describe, expect, it } from "vitest";
import { METHOD_CATALOG } from "@numerical-t-lab/numerics/ode/method-catalog";
import {
  ODE_METHOD_FOUNDATION_MATH,
  methodMathContent,
  methodTeachingSupportingMathContent,
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

  it("adds a closed Leap-Frog formula hierarchy without changing the current UI formula", () => {
    const leapfrog = METHOD_CATALOG.find(
      (entry) => entry.family === "leapfrog"
    )!;
    const currentUiFormula = methodMathContent(leapfrog).formula!;
    const teachingFormula = methodTeachingMathContent(leapfrog).formula!;

    expect(currentUiFormula.displayText).toBe(leapfrog.formulaDisplay);
    expect(currentUiFormula.latex).toBe("u''=a(t,u)");
    expect(teachingFormula.latex).toContain("v_{n+1/2}");
    expect(teachingFormula.latex).toContain("u_{n+1}");
    expect(teachingFormula.latex).not.toContain("v_{-1/2}");
    expect(teachingFormula.latex).not.toContain("v_{n+1}=");
    expect(teachingFormula.ariaLabel).toContain("half-step velocity");
    expect(teachingFormula).not.toHaveProperty("html");
    expect(teachingFormula).not.toHaveProperty("evaluate");

    const supporting = methodTeachingSupportingMathContent("leapfrog");
    expect(supporting.map((formula) => formula.id)).toEqual([
      "leapfrog_initialization",
      "leapfrog_reconstruction",
    ]);
    expect(supporting[0]?.content.latex).toContain("v_{-1/2}");
    expect(supporting[1]?.content.latex).toContain("v_{n+1}");
    expect(supporting[1]?.title).toContain("stored/output");
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

  it("owns the smallest closed supporting mathematics for all teaching lenses", () => {
    expect(
      methodTeachingSupportingMathContent("forward_euler")
    ).toEqual([]);
    expect(
      methodTeachingSupportingMathContent("backward_euler").map(
        (formula) => formula.id
      )
    ).toEqual(["backward_euler_predictor", "backward_euler_residual"]);
    expect(
      methodTeachingSupportingMathContent("taylor").map(
        (formula) => formula.id
      )
    ).toEqual(["taylor_path_derivative"]);
    expect(
      methodTeachingSupportingMathContent("rk4").map((formula) => formula.id)
    ).toEqual(["rk4_k1", "rk4_k2", "rk4_k3", "rk4_k4"]);
    expect(
      methodTeachingSupportingMathContent("adams_bashforth")
    ).toEqual([]);
    expect(
      methodTeachingSupportingMathContent("adams_moulton").map(
        (formula) => formula.id
      )
    ).toEqual(["adams_moulton_predictor"]);
    expect(methodTeachingSupportingMathContent("bdf")).toEqual([]);
    expect(
      methodTeachingSupportingMathContent("leapfrog").map(
        (formula) => formula.id
      )
    ).toEqual(["leapfrog_initialization", "leapfrog_reconstruction"]);

    const rk4 = methodTeachingSupportingMathContent("rk4");
    expect(rk4[0]?.content.displayText).toContain("k₁ = f(tₙ, uₙ)");
    expect(rk4[1]?.content.displayText).toContain("h/2");
    expect(rk4[2]?.content.displayText).toContain("k₂");
    expect(rk4[3]?.content.displayText).toContain("h k₃");

    for (const formula of [
      ...methodTeachingSupportingMathContent("backward_euler"),
      ...methodTeachingSupportingMathContent("taylor"),
      ...rk4,
      ...methodTeachingSupportingMathContent("adams_moulton"),
      ...methodTeachingSupportingMathContent("leapfrog"),
    ]) {
      expect(Object.keys(formula.content).sort()).toEqual([
        "ariaLabel",
        "displayText",
        "latex",
      ]);
      expect(formula.content.ariaLabel).toMatch(/[A-Za-z]/);
      expect(formula.content).not.toHaveProperty("html");
      expect(formula.content).not.toHaveProperty("evaluate");
      expect(formula.content).not.toHaveProperty("mathJson");
    }
  });
});
