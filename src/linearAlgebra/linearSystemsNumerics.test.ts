import { describe, expect, it } from "vitest";

import {
  solveLinearSystem,
  type LinearSystemSolveSuccess,
} from "./linearSystemsNumerics";

function successful(
  outcome: ReturnType<typeof solveLinearSystem>
): LinearSystemSolveSuccess {
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) throw new Error(outcome.error.message);
  return outcome.result;
}

function matrixMultiply(
  left: readonly (readonly number[])[],
  right: readonly (readonly number[])[]
): number[][] {
  return left.map((row) =>
    right[0]!.map((_, column) => {
      let value = 0;
      for (let index = 0; index < right.length; index += 1) {
        value += row[index]! * right[index]![column]!;
      }
      return value;
    })
  );
}

function matrixVectorMultiply(
  matrix: readonly (readonly number[])[],
  vector: readonly number[]
): number[] {
  return matrix.map((row) => {
    let value = 0;
    for (let index = 0; index < row.length; index += 1) {
      value += row[index]! * vector[index]!;
    }
    return value;
  });
}

function expectMatricesClose(
  actual: readonly (readonly number[])[],
  expected: readonly (readonly number[])[],
  tolerance = 1e-12
): void {
  expect(actual.length).toBe(expected.length);
  for (let row = 0; row < actual.length; row += 1) {
    expect(actual[row]!.length).toBe(expected[row]!.length);
    for (let column = 0; column < actual[row]!.length; column += 1) {
      expect(Math.abs(actual[row]![column]! - expected[row]![column]!)).toBeLessThanOrEqual(
        tolerance
      );
    }
  }
}

function expectVectorsClose(
  actual: readonly number[],
  expected: readonly number[],
  tolerance = 1e-12
): void {
  expect(actual.length).toBe(expected.length);
  for (let index = 0; index < actual.length; index += 1) {
    expect(Math.abs(actual[index]! - expected[index]!)).toBeLessThanOrEqual(tolerance);
  }
}

describe("Gaussian elimination with partial pivoting", () => {
  it("solves the Starter 3×3 preset and reports its reference difference", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [3, 1, -1],
          [2, 4, 1],
          [-1, 2, 5],
        ],
        b: [6, 9, -2],
      })
    );

    expectVectorsClose(result.xHat, [1, 2, -1]);
    expect(result.presetId).toBe("starter_3x3");
    expect(result.referenceSolution).toEqual([1, 2, -1]);
    expect(result.referenceDifferenceInf).toBe(
      Math.max(
        ...result.xHat.map((value, index) =>
          Math.abs(value - result.referenceSolution![index]!)
        )
      )
    );
    expect(result.referenceDifferenceInf).toBeLessThan(1e-14);
  });

  it("solves the row-swap-required preset with P A = L U", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0, 2, 1],
          [1, -2, -3],
          [2, 3, 1],
        ],
        b: [0, -3, 1],
      })
    );

    expectVectorsClose(result.xHat, [1, -1, 2]);
    expect(result.rowSwapCount).toBeGreaterThan(0);
    expectMatricesClose(
      matrixMultiply(result.P, result.originalA),
      matrixMultiply(result.L, result.U)
    );
  });

  it("accepts the n=2 lower boundary", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [2, 1],
          [1, 3],
        ],
        b: [5, 7],
      })
    );
    expect(result.dimension).toBe(2);
    expectVectorsClose(result.xHat, [1.6, 1.8]);
  });

  it("accepts the n=6 upper boundary", () => {
    const A = Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 6 }, (_, column) => (row === column ? row + 1 : 0))
    );
    const result = successful(solveLinearSystem({ A, b: [1, 2, 3, 4, 5, 6] }));
    expect(result.dimension).toBe(6);
    expectVectorsClose(result.xHat, [1, 1, 1, 1, 1, 1]);
  });

  it.each([
    {
      name: "dimension below 2",
      A: [[1]],
      b: [1],
      code: "dimension_below_minimum",
    },
    {
      name: "dimension above 6",
      A: Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 7 }, (_, column) => (row === column ? 1 : 0))
      ),
      b: Array(7).fill(1),
      code: "dimension_above_maximum",
    },
    {
      name: "non-square A",
      A: [
        [1, 0, 0],
        [0, 1, 0],
      ],
      b: [1, 1],
      code: "non_square_matrix",
    },
    {
      name: "b length mismatch",
      A: [
        [1, 0],
        [0, 1],
      ],
      b: [1],
      code: "right_hand_side_length_mismatch",
    },
  ])("rejects $name", ({ A, b, code }) => {
    const outcome = solveLinearSystem({ A, b });
    expect(outcome).toMatchObject({ ok: false, error: { code } });
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects the non-finite input %s",
    (value) => {
      const outcome = solveLinearSystem({
        A: [
          [1, value],
          [0, 1],
        ],
        b: [1, 1],
      });
      expect(outcome).toMatchObject({ ok: false, error: { code: "non_finite_input" } });
    }
  );

  it("resolves equal-magnitude pivot ties to the first matching row", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [2, 1],
          [-2, 3],
        ],
        b: [3, 1],
      })
    );
    expect(result.pivots[0]).toMatchObject({ column: 0, selectedRow: 0 });
    expect(result.rowSwapCount).toBe(0);
  });

  it("records a required first-column row swap", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0, 1],
          [2, 3],
        ],
        b: [1, 5],
      })
    );
    expect(result.pivots[0]).toMatchObject({ column: 0, selectedRow: 1 });
    expect(result.permutation).toEqual([1, 0]);
    expect(result.rowSwapCount).toBe(1);
  });

  it("supports multiple pivot-row swaps", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0, 1, 0],
          [0, 0, 1],
          [1, 0, 0],
        ],
        b: [2, 3, 1],
      })
    );
    expect(result.rowSwapCount).toBe(2);
    expect(result.permutation).toEqual([2, 0, 1]);
    expectVectorsClose(result.xHat, [1, 2, 3]);
  });

  it("swaps already-computed L columns during a later pivot", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [10, 0, 0],
          [1, 1, 1],
          [2, 5, 1],
        ],
        b: [10, 6, 15],
      })
    );
    expect(result.pivots[1]).toMatchObject({ column: 1, selectedRow: 2 });
    expect(result.L[1]![0]).toBeCloseTo(0.2, 15);
    expect(result.L[2]![0]).toBeCloseTo(0.1, 15);
    expectMatricesClose(
      matrixMultiply(result.P, result.originalA),
      matrixMultiply(result.L, result.U)
    );
  });

  it("returns structurally valid P, unit-lower L, and upper U", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [4, -2, 1],
          [3, 6, -4],
          [2, 1, 8],
        ],
        b: [12, -25, 32],
      })
    );
    for (let row = 0; row < result.dimension; row += 1) {
      expect(result.L[row]![row]).toBe(1);
      for (let column = row + 1; column < result.dimension; column += 1) {
        expect(result.L[row]![column]).toBe(0);
      }
      for (let column = 0; column < row; column += 1) {
        expect(result.U[row]![column]).toBe(0);
      }
    }
    expectMatricesClose(
      matrixMultiply(result.P, result.originalA),
      matrixMultiply(result.L, result.U)
    );
  });

  it("computes xHat that approximately satisfies the original system", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [7, 2, -1],
          [3, 8, 1],
          [-2, 4, 9],
        ],
        b: [4, 13, 7],
      })
    );
    expectVectorsClose(matrixVectorMultiply(result.originalA, result.xHat), result.originalB);
  });
});

describe("residual and reference semantics", () => {
  it("defines residual exactly as b - A xHat using the original data", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0.1, 0.2],
          [0.3, 0.7],
        ],
        b: [0.3, 1],
      })
    );
    const product = matrixVectorMultiply(result.originalA, result.xHat);
    const expected = result.originalB.map((value, index) => value - product[index]!);
    expect(result.residual).toEqual(expected);
  });

  it("uses the maximum absolute residual component for the infinity norm", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0.1, 0.2],
          [0.3, 0.7],
        ],
        b: [0.3, 1],
      })
    );
    expect(result.residualInfNorm).toBe(
      Math.max(...result.residual.map((value) => Math.abs(value)))
    );
  });

  it("omits reference quantities for custom input", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [2, 0],
          [0, 4],
        ],
        b: [2, 8],
      })
    );
    expect(result.presetId).toBeUndefined();
    expect(result.referenceSolution).toBeUndefined();
    expect(result.referenceDifferenceInf).toBeUndefined();
  });
});

describe("pivot threshold and finite-arithmetic safeguards", () => {
  it("rejects the all-zero matrix immediately", () => {
    const outcome = solveLinearSystem({
      A: [
        [0, 0],
        [0, 0],
      ],
      b: [0, 0],
    });
    expect(outcome).toMatchObject({ ok: false, error: { code: "zero_matrix" } });
  });

  it("rejects an exactly zero selected pivot after elimination", () => {
    const outcome = solveLinearSystem({
      A: [
        [1, 1],
        [1, 1],
      ],
      b: [2, 2],
    });
    expect(outcome).toMatchObject({ ok: false, error: { code: "pivot_rejected" } });
  });

  it("rejects a pivot exactly at the scaled threshold", () => {
    const threshold = 64 * Number.EPSILON;
    const outcome = solveLinearSystem({
      A: [
        [threshold, 0],
        [0, 1],
      ],
      b: [threshold, 1],
    });
    expect(outcome).toMatchObject({ ok: false, error: { code: "pivot_rejected" } });
  });

  it("accepts a pivot just above the scaled threshold", () => {
    const pivot = 64 * Number.EPSILON * (1 + 4 * Number.EPSILON);
    const result = successful(
      solveLinearSystem({
        A: [
          [pivot, 0],
          [0, 1],
        ],
        b: [pivot, 1],
      })
    );
    expectVectorsClose(result.xHat, [1, 1]);
    expect(pivot).toBeGreaterThan(result.tauPivot);
  });

  it("scales tauPivot with the original matrix infinity norm", () => {
    const base = successful(
      solveLinearSystem({
        A: [
          [2, 0],
          [0, 3],
        ],
        b: [2, 3],
      })
    );
    const scale = 1e50;
    const scaled = successful(
      solveLinearSystem({
        A: [
          [2 * scale, 0],
          [0, 3 * scale],
        ],
        b: [2 * scale, 3 * scale],
      })
    );
    expect(scaled.matrixInfNorm / base.matrixInfNorm).toBeCloseTo(scale, 12);
    expect(scaled.tauPivot / base.tauPivot).toBeCloseTo(scale, 12);
  });

  it("accepts a very small proportionally well-conditioned scaled system", () => {
    const scale = 1e-100;
    const result = successful(
      solveLinearSystem({
        A: [
          [2 * scale, 0],
          [0, 3 * scale],
        ],
        b: [2 * scale, 6 * scale],
      })
    );
    expect(result.matrixInfNorm).toBeLessThan(1);
    expectVectorsClose(result.xHat, [1, 2]);
  });

  it("rejects non-finite intermediate arithmetic from finite inputs", () => {
    const outcome = solveLinearSystem({
      A: [
        [1e308, 1e308],
        [1e308, -1e308],
      ],
      b: [1, 1],
    });
    expect(outcome).toMatchObject({
      ok: false,
      error: { code: "non_finite_intermediate" },
    });
  });
});

describe("numerical result ownership", () => {
  it("does not mutate caller A or b", () => {
    const A = [
      [0, 2, 1],
      [1, -2, -3],
      [2, 3, 1],
    ];
    const b = [0, -3, 1];
    const originalA = structuredClone(A);
    const originalB = [...b];
    successful(solveLinearSystem({ A, b }));
    expect(A).toEqual(originalA);
    expect(b).toEqual(originalB);
  });

  it("returns deeply frozen copies without mutable caller or work-array aliases", () => {
    const A = [
      [3, 1, -1],
      [2, 4, 1],
      [-1, 2, 5],
    ];
    const b = [6, 9, -2];
    const result = successful(solveLinearSystem({ A, b }));

    expect(result.originalA).not.toBe(A);
    expect(result.originalA[0]).not.toBe(A[0]);
    expect(result.originalB).not.toBe(b);
    expect(result.L).not.toBe(result.U);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.originalA)).toBe(true);
    expect(Object.isFrozen(result.originalA[0])).toBe(true);
    expect(Object.isFrozen(result.xHat)).toBe(true);
    expect(Object.isFrozen(result.P)).toBe(true);
    expect(Object.isFrozen(result.L)).toBe(true);
    expect(Object.isFrozen(result.U)).toBe(true);
    expect(Object.isFrozen(result.pivots[0])).toBe(true);

    A[0]![0] = 99;
    b[0] = 99;
    expect(result.originalA[0]![0]).toBe(3);
    expect(result.originalB[0]).toBe(6);
    expect(() => (result.xHat as number[]).push(99)).toThrow();
    expect(() => ((result.L[0] as number[])[0] = 99)).toThrow();
  });
});
