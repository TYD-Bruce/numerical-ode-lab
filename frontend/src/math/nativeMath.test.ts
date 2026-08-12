// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  MATHML_NAMESPACE,
  createNativeMath,
  mathFraction,
  mathIdentifier,
  mathMatrix,
  mathNumberLiteral,
  mathOperator,
  mathOver,
  mathSubscript,
  mathSuperscript,
} from "./nativeMath";

describe("native authored mathematical display", () => {
  beforeEach(() => document.body.replaceChildren());

  it("keeps the helper closed and dependency-free", () => {
    const source = readFileSync(
      resolve(process.cwd(), "frontend", "src", "math", "nativeMath.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/innerHTML|insertAdjacentHTML/);
    expect(source).not.toMatch(/mathlive|compute-engine/i);
    expect(source).not.toMatch(/@numerical-t-lab\/numerics/);
    expect(source).not.toMatch(/latex|parse(?:r)?\b/i);
  });

  it("creates real MathML namespace structures for accents, tables, fractions, and scripts", () => {
    const xHat = mathOver(
      mathIdentifier("x"),
      mathOperator("^")
    );
    const vector = mathMatrix([
      [mathNumberLiteral("1")],
      [mathNumberLiteral("2")],
      [mathNumberLiteral("−1")],
    ]);
    const formula = createNativeMath([xHat, vector], "x hat equals the column vector 1, 2, minus 1");
    document.body.append(formula);

    const visual = formula.querySelector("math");
    expect(visual?.namespaceURI).toBe(MATHML_NAMESPACE);
    expect(visual?.querySelector("mover")?.getAttribute("accent")).toBe("true");
    expect(visual?.querySelectorAll("mtable > mtr")).toHaveLength(3);
    expect(visual?.querySelectorAll("mtable > mtr > mtd")).toHaveLength(3);

    const structure = createNativeMath(
      [
        mathFraction(mathNumberLiteral("2"), mathNumberLiteral("3")),
        mathSubscript(mathIdentifier("U"), mathNumberLiteral("21")),
        mathSuperscript(mathNumberLiteral("10"), mathNumberLiteral("−16")),
      ],
      "two thirds, U sub 2 1, ten to the minus 16"
    );
    expect(structure.querySelector("mfrac")).not.toBeNull();
    expect(structure.querySelector("msub")).not.toBeNull();
    expect(structure.querySelector("msup")).not.toBeNull();
  });

  it("exposes one accessible owner while hiding visual MathML speech", () => {
    const formula = createNativeMath(
      mathIdentifier("A"),
      "coefficient matrix A"
    );
    document.body.append(formula);

    expect(formula.getAttribute("role")).toBe("math");
    expect(formula.getAttribute("aria-label")).toBe("coefficient matrix A");
    expect(formula.querySelector("math")?.getAttribute("aria-hidden")).toBe(
      "true"
    );
    expect(formula.querySelectorAll("[role='math']")).toHaveLength(0);
    expect(formula.querySelectorAll("math [aria-label]")).toHaveLength(0);
  });
});
