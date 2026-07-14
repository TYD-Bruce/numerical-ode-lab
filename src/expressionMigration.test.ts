import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

describe("production expression migration boundary", () => {
  const main = source("./main.ts");
  const odeApp = source("./ode/odeApp.ts");
  const solvers = source("./solvers.ts");
  const productionExpression = source("./math/problemExpressions.ts");
  const convergenceView = source("./convergenceStudyView.ts");

  it("contains no production dynamic expression compiler", () => {
    const productionSources = `${main}\n${odeApp}\n${solvers}\n${productionExpression}`;
    expect(productionSources).not.toMatch(/\bnew\s+Function\b/);
    expect(productionSources).not.toMatch(/\beval\s*\(/);
    expect(productionSources).not.toContain("compileScalarExpr");
  });

  it("mounts only the approved production variable profiles", () => {
    expect(odeApp).toContain('mountProductionExpressionField(wrap, "rhs")');
    expect(odeApp).toContain('isSecond ? "second_order_rhs" : "rhs"');
    expect(odeApp).not.toContain('name="expr"');
    expect(odeApp).toContain('profile: "exact_solution"');
  });

  it("keeps the solver module independent of UI and expression-source formats", () => {
    expect(solvers).not.toMatch(/mathlive|MathJSON|Mathfield|editableMath|readonlyMath|latex/i);
    expect(solvers).not.toMatch(/from\s+["'].+math\//);
  });

  it("keeps exact-solution editing in Step 2 and convergence display read-only", () => {
    expect(odeApp).toContain("I know the exact solution");
    expect(odeApp).toContain("exactSolution: expressionSnapshot.exactSolution");
    expect(convergenceView).toContain("options.snapshot.exactSolution");
    expect(convergenceView).toContain("renderMath(exactMath");
    expect(convergenceView).not.toContain("mountExactSolutionField");
    expect(convergenceView).not.toContain("editableMathField");
  });
});
