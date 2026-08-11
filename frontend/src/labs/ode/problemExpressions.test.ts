import { describe, expect, it } from "vitest";
import { createMathExpressionFromLegacy } from "@numerical-t-lab/numerics/expressions/legacy-adapter";
import {
  compileProductionExpression,
  createDefaultMathExpressionState,
  createSuccessfulExpressionSnapshot,
  currentReadyExpression,
  persistMathFieldSnapshot,
} from "./problemExpressions";
import { validateMathFieldDraft } from "../../math/ui/mathFieldState";
import { buildOdeLabContext } from "../../tutor/aiTutor";
import { integrateFirstOrder } from "@numerical-t-lab/numerics/ode/solvers";

describe("production problem expressions", () => {
  it("provides AST-backed first- and second-order defaults", () => {
    const first = createDefaultMathExpressionState("rhs");
    const second = createDefaultMathExpressionState("second_order_rhs");

    expect(first.draftLatex).toBe("-y");
    expect(first.confirmed.canonicalAst).toEqual({
      kind: "negate",
      operand: { kind: "variable", name: "y" },
    });
    expect(second.draftLatex).toBe("-u");
    expect(compileProductionExpression(first.confirmed, "rhs")(0, 2)).toBe(-2);
    expect(compileProductionExpression(second.confirmed, "second_order_rhs")(0, 3)).toBe(-3);
  });

  it("compiles supported visual and legacy-normalized expressions without source execution", () => {
    const exponential = createMathExpressionFromLegacy("Math.exp(t)", "rhs");
    const damped = createMathExpressionFromLegacy("Math.sin(t)-0.1*y", "rhs");

    expect(exponential.latex).toBe("e^{t}");
    expect(compileProductionExpression(exponential, "rhs")(1, 0)).toBe(Math.exp(1));
    expect(compileProductionExpression(damped, "rhs")(0.5, 2)).toBeCloseTo(
      Math.sin(0.5) - 0.2
    );
  });

  it("never treats an older confirmation as the current invalid draft", () => {
    const previous = createDefaultMathExpressionState("rhs");
    const invalid = validateMathFieldDraft("x", "rhs", previous.confirmed, true);
    const persisted = persistMathFieldSnapshot("rhs", invalid, previous);

    expect(persisted.draftLatex).toBe("x");
    expect(persisted.validationKind).toBe("invalid");
    expect(persisted.confirmed).toBe(previous.confirmed);
    expect(currentReadyExpression(invalid)).toBeUndefined();
  });

  it("captures an immutable successful-run equation snapshot", () => {
    const expression = createMathExpressionFromLegacy("Math.sin(t)-0.1*y", "rhs");
    const snapshot = createSuccessfulExpressionSnapshot(expression, "rhs");

    expect(snapshot.equation.latex).toBe("y'=\\sin\\left(t\\right)-\\left(0.1\\cdot y\\right)");
    expect(snapshot.equationDisplay).toContain("y prime equals");
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.expression.canonicalAst)).toBe(true);

    const later = validateMathFieldDraft("x", "rhs", expression, true);
    expect(currentReadyExpression(later)).toBeUndefined();
    expect(snapshot.expression.latex).toContain("\\sin");
  });

  it("copies optional exact and preset identity into the successful-run snapshot", () => {
    const rhs = createMathExpressionFromLegacy("-y", "rhs");
    const exact = createMathExpressionFromLegacy("exp(-t)", "exact_solution");
    const snapshot = createSuccessfulExpressionSnapshot(rhs, "rhs", {
      exactSolutionEnabled: true,
      exactSolution: exact,
      customizationSourcePresetId: "exponential_decay",
    });

    expect(snapshot).toMatchObject({
      exactSolutionEnabled: true,
      customizationSourcePresetId: "exponential_decay",
    });
    expect(snapshot.exactSolution?.displayText).toBe("e raised to the quantity negative t");
    expect(snapshot.exactSolution).not.toBe(exact);
    expect(Object.isFrozen(snapshot.exactSolution?.canonicalAst)).toBe(true);
  });

  it("grounds Tutor context in the successful AST-generated equation text", () => {
    const expression = createMathExpressionFromLegacy("Math.exp(t)", "rhs");
    const snapshot = createSuccessfulExpressionSnapshot(expression, "rhs");
    const result = integrateFirstOrder(
      { family: "forward_euler" },
      {
        t0: 0,
        y0: 1,
        tEnd: 0.2,
        h: 0.1,
        f: compileProductionExpression(expression, "rhs"),
      }
    );
    const context = buildOdeLabContext(result, {
      kind: "first_order",
      equationDisplay: snapshot.equationDisplay,
      t0: 0,
      tEnd: 0.2,
      h: 0.1,
      y0: 1,
    });

    expect(context.problem.equationDisplay).toBe("y prime equals e raised to t");
    expect(context.problem.equationDisplay).not.toContain("Math.exp");
  });
});
