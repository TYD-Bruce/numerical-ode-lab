// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  createComputedSolution,
  createNamedMatrix,
  createSolvedSystemEquation,
  createSystemEquation,
} from "./linearSystemsMath";

describe("Linear Systems native mathematical objects", () => {
  beforeEach(() => document.body.replaceChildren());

  it("owns the system equation once and hides the visual MathML tree", () => {
    const equation = createSystemEquation();
    document.body.append(equation);

    expect(equation.getAttribute("role")).toBe("math");
    expect(equation.getAttribute("aria-label")).toBe("A times x equals b");
    expect(equation.querySelector("math")?.getAttribute("aria-hidden")).toBe("true");
    expect(equation.querySelectorAll("[role='math']")).toHaveLength(0);
  });

  it("renders a true x-hat and a structural column vector", () => {
    const solution = createComputedSolution([1, 2, -1]);
    document.body.append(solution);

    expect(solution.querySelector("mover[accent='true']")).not.toBeNull();
    expect(solution.querySelectorAll("mtable > mtr")).toHaveLength(3);
    expect(solution.querySelectorAll("mtable > mtr > mtd")).toHaveLength(3);
    expect(solution.querySelectorAll("[data-math-number-context='solution']")).toHaveLength(3);
  });

  it("renders named matrices as mathematical tables rather than HTML data tables", () => {
    const matrix = createNamedMatrix("A", [[3, 1], [2, 4]], "coefficient matrix A");
    document.body.append(matrix);

    expect(matrix.querySelectorAll("mtable > mtr")).toHaveLength(2);
    expect(matrix.querySelector("table")).toBeNull();
    expect(matrix.getAttribute("aria-label")).toContain("matrix with rows");
  });

  it("renders the authoritative solved system with an indexed symbolic unknown vector", () => {
    const equation = createSolvedSystemEquation(
      [
        [3, 1, -1],
        [2, 4, 1],
        [-1, 2, 5],
      ],
      [6, 9, -2]
    );
    document.body.append(equation);

    expect(equation.dataset.nativeMath).toBe("solved-system");
    expect(equation.querySelectorAll("mtable")).toHaveLength(3);
    expect(equation.querySelectorAll("mtable")[1]?.querySelectorAll("msub")).toHaveLength(3);
    expect(equation.getAttribute("aria-label")).toContain("right-hand side 6, 9, minus 2");
    expect(equation.querySelectorAll("[role='math']")).toHaveLength(0);
  });
});
