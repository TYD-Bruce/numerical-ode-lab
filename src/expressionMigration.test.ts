import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

describe("production expression migration boundary", () => {
  const main = source("./main.ts");
  const solvers = source("./solvers.ts");
  const productionExpression = source("./math/problemExpressions.ts");

  it("contains no production dynamic expression compiler", () => {
    const productionSources = `${main}\n${solvers}\n${productionExpression}`;
    expect(productionSources).not.toMatch(/\bnew\s+Function\b/);
    expect(productionSources).not.toMatch(/\beval\s*\(/);
    expect(productionSources).not.toContain("compileScalarExpr");
  });

  it("mounts only the approved production variable profiles", () => {
    expect(main).toContain('mountProductionExpressionField(wrap, "rhs")');
    expect(main).toContain('isSecond ? "second_order_rhs" : "rhs"');
    expect(main).not.toContain('name="expr"');
    expect(main).toContain('profile: "exact_solution"');
  });

  it("keeps the solver module independent of UI and expression-source formats", () => {
    expect(solvers).not.toMatch(/mathlive|MathJSON|Mathfield|editableMath|readonlyMath|latex/i);
    expect(solvers).not.toMatch(/from\s+["'].+math\//);
  });

  it("adds exact-solution input without adding convergence controls", () => {
    expect(main).toContain("I know the exact solution");
    expect(main).not.toMatch(/Convergence Study|convergence drawer|observed order|refinement levels/i);
  });
});
