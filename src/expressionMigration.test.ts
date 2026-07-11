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
    expect(main).not.toContain('"exact_solution"');
  });

  it("keeps the solver module independent of UI and expression-source formats", () => {
    expect(solvers).not.toMatch(/mathlive|MathJSON|Mathfield|editableMath|readonlyMath|latex/i);
    expect(solvers).not.toMatch(/from\s+["'].+math\//);
  });

  it("does not add exact-solution or convergence production controls", () => {
    expect(main).not.toMatch(/I know the exact solution|Convergence Study|convergence drawer/i);
  });
});
