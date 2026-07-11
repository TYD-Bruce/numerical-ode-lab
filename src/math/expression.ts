import type { MathAst, MathVariableProfile } from "./ast";
import { canonicalizeMathAst, serializeMathAst } from "./canonical";
import {
  compileMathAst,
  type ExactSolutionEvaluator,
  type RhsEvaluator,
  type SecondOrderRhsEvaluator,
} from "./evaluator";
import { projectAccessibleMath } from "./projection";

export interface MathExpression {
  readonly latex: string;
  readonly canonicalAst: MathAst;
  readonly displayText: string;
}

export interface CompiledMathExpression<Args extends readonly number[]> {
  readonly expression: MathExpression;
  readonly evaluate: (...args: Args) => number;
  readonly canonicalSerialization: string;
}

export function createMathExpression(
  latex: string,
  candidateAst: unknown,
  profile: MathVariableProfile
): MathExpression {
  const canonicalAst = canonicalizeMathAst(candidateAst, profile);
  return {
    latex,
    canonicalAst,
    displayText: projectAccessibleMath(canonicalAst, profile),
  };
}

export function compileMathExpression(
  expression: MathExpression,
  profile: "rhs"
): CompiledMathExpression<readonly [t: number, y: number]>;
export function compileMathExpression(
  expression: MathExpression,
  profile: "exact_solution"
): CompiledMathExpression<readonly [t: number, t0: number, y0: number]>;
export function compileMathExpression(
  expression: MathExpression,
  profile: "second_order_rhs"
): CompiledMathExpression<readonly [t: number, u: number]>;
export function compileMathExpression(
  expression: MathExpression,
  profile: MathVariableProfile
): CompiledMathExpression<readonly number[]> {
  const validated = createMathExpression(
    expression.latex,
    expression.canonicalAst,
    profile
  );
  let evaluate: RhsEvaluator | ExactSolutionEvaluator | SecondOrderRhsEvaluator;
  switch (profile) {
    case "rhs":
      evaluate = compileMathAst(validated.canonicalAst, profile);
      break;
    case "exact_solution":
      evaluate = compileMathAst(validated.canonicalAst, profile);
      break;
    case "second_order_rhs":
      evaluate = compileMathAst(validated.canonicalAst, profile);
      break;
  }

  return {
    expression: validated,
    evaluate: evaluate as (...args: readonly number[]) => number,
    canonicalSerialization: serializeMathAst(validated.canonicalAst, profile),
  };
}
