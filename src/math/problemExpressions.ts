import type { MathAst, MathVariableProfile } from "./ast";
import { compileMathExpression, createMathExpression, type MathExpression } from "./expression";
import { createMathExpressionFromLegacy } from "./legacyAdapter";
import type { MathFieldSnapshot } from "./ui/mathFieldState";
import type { ReadonlyMathContent } from "./ui/readonlyMath";

export type ProductionMathProfile = "rhs" | "second_order_rhs";

export interface PersistedMathExpressionState {
  readonly profile: ProductionMathProfile;
  readonly draftLatex: string;
  readonly validationKind: MathFieldSnapshot["state"]["kind"];
  readonly confirmed: MathExpression;
}

export interface PersistedOptionalMathExpressionState {
  readonly profile: "exact_solution";
  readonly draftLatex: string;
  readonly validationKind: MathFieldSnapshot["state"]["kind"];
  readonly confirmed?: MathExpression;
}

export interface SuccessfulExpressionDetails {
  readonly exactSolutionEnabled?: boolean;
  readonly exactSolution?: MathExpression;
  readonly presetId?: string;
  readonly customizationSourcePresetId?: string;
}

export interface SuccessfulExpressionSnapshot {
  readonly profile: ProductionMathProfile;
  readonly expression: MathExpression;
  readonly equation: ReadonlyMathContent;
  readonly equationDisplay: string;
  readonly exactSolutionEnabled: boolean;
  readonly exactSolution?: MathExpression;
  readonly presetId?: string;
  readonly customizationSourcePresetId?: string;
}

export function createEmptyExactExpressionState(): PersistedOptionalMathExpressionState {
  return {
    profile: "exact_solution",
    draftLatex: "",
    validationKind: "incomplete",
  };
}

function cloneAst(ast: MathAst): MathAst {
  switch (ast.kind) {
    case "number":
      return Object.freeze({ kind: "number", value: ast.value });
    case "constant":
      return Object.freeze({ kind: "constant", name: ast.name });
    case "variable":
      return Object.freeze({ kind: "variable", name: ast.name });
    case "negate":
      return Object.freeze({ kind: "negate", operand: cloneAst(ast.operand) });
    case "add":
      return Object.freeze({
        kind: "add",
        terms: Object.freeze(ast.terms.map(cloneAst)),
      });
    case "multiply":
      return Object.freeze({
        kind: "multiply",
        factors: Object.freeze(ast.factors.map(cloneAst)),
      });
    case "divide":
      return Object.freeze({
        kind: "divide",
        numerator: cloneAst(ast.numerator),
        denominator: cloneAst(ast.denominator),
      });
    case "power":
      return Object.freeze({
        kind: "power",
        base: cloneAst(ast.base),
        exponent: cloneAst(ast.exponent),
      });
    case "function":
      return Object.freeze({
        kind: "function",
        name: ast.name,
        argument: cloneAst(ast.argument),
      });
  }
}

export function cloneMathExpression(
  expression: MathExpression,
  profile: MathVariableProfile
): MathExpression {
  const cloned = createMathExpression(expression.latex, cloneAst(expression.canonicalAst), profile);
  return Object.freeze({
    ...cloned,
    canonicalAst: cloneAst(cloned.canonicalAst),
  });
}

export function createDefaultMathExpressionState(
  profile: ProductionMathProfile
): PersistedMathExpressionState {
  const expression = createMathExpressionFromLegacy(
    profile === "rhs" ? "-y" : "-u",
    profile
  );
  return {
    profile,
    draftLatex: expression.latex,
    validationKind: "ready",
    confirmed: expression,
  };
}

export function persistMathFieldSnapshot(
  profile: ProductionMathProfile,
  snapshot: MathFieldSnapshot,
  previous: PersistedMathExpressionState
): PersistedMathExpressionState {
  const confirmed =
    snapshot.state.kind === "ready"
      ? snapshot.state.confirmed
      : snapshot.state.confirmed ?? previous.confirmed;
  return {
    profile,
    draftLatex: snapshot.state.draftLatex,
    validationKind: snapshot.state.kind,
    confirmed,
  };
}

export function persistOptionalMathFieldSnapshot(
  snapshot: MathFieldSnapshot,
  previous: PersistedOptionalMathExpressionState
): PersistedOptionalMathExpressionState {
  return {
    profile: "exact_solution",
    draftLatex: snapshot.state.draftLatex,
    validationKind: snapshot.state.kind,
    confirmed:
      snapshot.state.kind === "ready"
        ? snapshot.state.confirmed
        : snapshot.state.confirmed ?? previous.confirmed,
  };
}

export function currentReadyExpression(snapshot: MathFieldSnapshot): MathExpression | undefined {
  return snapshot.state.kind === "ready" ? snapshot.state.confirmed : undefined;
}

export function compileProductionExpression(
  expression: MathExpression,
  profile: "rhs"
): (t: number, y: number) => number;
export function compileProductionExpression(
  expression: MathExpression,
  profile: "second_order_rhs"
): (t: number, u: number) => number;
export function compileProductionExpression(
  expression: MathExpression,
  profile: ProductionMathProfile
): (t: number, value: number) => number {
  return profile === "rhs"
    ? compileMathExpression(expression, "rhs").evaluate
    : compileMathExpression(expression, "second_order_rhs").evaluate;
}

export function createSuccessfulExpressionSnapshot(
  expression: MathExpression,
  profile: ProductionMathProfile,
  details: SuccessfulExpressionDetails = {}
): SuccessfulExpressionSnapshot {
  const frozenExpression = cloneMathExpression(expression, profile);
  const firstOrder = profile === "rhs";
  const prefixLatex = firstOrder ? "y'" : "u''";
  const prefixText = firstOrder ? "y prime" : "u double prime";
  const equationDisplay = `${prefixText} equals ${frozenExpression.displayText}`;
  const exactSolution = details.exactSolution
    ? cloneMathExpression(details.exactSolution, "exact_solution")
    : undefined;
  return Object.freeze({
    profile,
    expression: frozenExpression,
    equation: Object.freeze({
      latex: `${prefixLatex}=${frozenExpression.latex}`,
      displayText: equationDisplay,
      ariaLabel: equationDisplay,
    }),
    equationDisplay,
    exactSolutionEnabled: details.exactSolutionEnabled === true,
    exactSolution,
    presetId: details.presetId,
    customizationSourcePresetId: details.customizationSourcePresetId,
  });
}
