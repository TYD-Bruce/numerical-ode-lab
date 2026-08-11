import { describe, expect, it } from "vitest";

import {
  solveLinearSystem,
  type LinearSystemTraceStep,
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

function traceStepsOfKind<K extends LinearSystemTraceStep["kind"]>(
  result: LinearSystemSolveSuccess,
  kind: K
): Extract<LinearSystemTraceStep, { readonly kind: K }>[] {
  return result.trace.steps.filter(
    (step): step is Extract<LinearSystemTraceStep, { readonly kind: K }> =>
      step.kind === kind
  );
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

describe("structured computation evidence", () => {
  it("retains complete setup evidence for the Starter 3×3 matrix scale", () => {
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
    const [setup] = traceStepsOfKind(result, "matrix_scale");

    expect(result.trace).toMatchObject({
      processKind: "bounded_finite",
      retentionPolicy: "all_meaningful_steps",
      retainedStepCount: result.trace.steps.length,
      totalMeaningfulStepCount: result.trace.steps.length,
      omittedMiddleWork: false,
      finalStepRetained: true,
    });
    expect(setup?.rows.map((row) => row.absoluteSum)).toEqual([5, 7, 8]);
    expect(setup?.rows[0]?.terms).toEqual([
      { column: 0, value: 3, absoluteValue: 3 },
      { column: 1, value: 1, absoluteValue: 1 },
      { column: 2, value: -1, absoluteValue: 1 },
    ]);
    expect(setup).toMatchObject({
      selectedMaximumRow: 2,
      matrixInfNorm: result.matrixInfNorm,
      pivotUlpFactor: 64,
      numberEpsilon: Number.EPSILON,
      tauPivot: result.tauPivot,
    });
  });

  it("records deterministic pivot selection and the row swap actually performed", () => {
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
    const [pivot] = traceStepsOfKind(result, "pivot_selection");
    const [swap] = traceStepsOfKind(result, "row_swap");

    expect(pivot).toEqual(
      expect.objectContaining({
        column: 0,
        candidates: [
          { row: 0, value: 0, absoluteValue: 0 },
          { row: 1, value: 1, absoluteValue: 1 },
          { row: 2, value: 2, absoluteValue: 2 },
        ],
        selectedRow: 2,
        selectedPivotValue: 2,
        selectedAbsoluteMagnitude: 2,
        tauPivot: result.tauPivot,
        accepted: true,
      })
    );
    expect(swap).toMatchObject({
      column: 0,
      firstRow: 0,
      secondRow: 2,
      uRowsBefore: [
        { row: 0, values: [0, 2, 1] },
        { row: 2, values: [2, 3, 1] },
      ],
      uRowsAfter: [
        { row: 0, values: [2, 3, 1] },
        { row: 2, values: [0, 2, 1] },
      ],
      permutationBefore: [0, 1, 2],
      permutationAfter: [2, 1, 0],
    });
  });

  it("records actual elimination multipliers and row updates", () => {
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
    const elimination = traceStepsOfKind(result, "elimination").find(
      (step) => step.column === 0 && step.targetRow === 1
    );

    expect(elimination).toMatchObject({
      pivotRow: 0,
      targetRow: 1,
      pivotValue: 2,
      targetColumnValueBefore: 1,
      multiplier: 0.5,
      targetRowBefore: [1, -2, -3],
      pivotRowUsed: [2, 3, 1],
      targetRowAfter: [0, -3.5, -3.5],
      multiplierLocation: { row: 1, column: 0, value: 0.5 },
    });
    expect(elimination?.multiplier).toBe(
      elimination!.targetColumnValueBefore / elimination!.pivotValue
    );
  });

  it("shows the prior-column L exchange at a later pivot", () => {
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
    const swap = traceStepsOfKind(result, "row_swap").find(
      (step) => step.column === 1
    );

    expect(swap?.lPriorColumnsBefore).toEqual([
      { row: 1, entries: [{ column: 0, value: 0.1 }] },
      { row: 2, entries: [{ column: 0, value: 0.2 }] },
    ]);
    expect(swap?.lPriorColumnsAfter).toEqual([
      { row: 1, entries: [{ column: 0, value: 0.2 }] },
      { row: 2, entries: [{ column: 0, value: 0.1 }] },
    ]);
  });

  it("retains factorization completion evidence matching the returned factors", () => {
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
    const [factorization] = traceStepsOfKind(result, "factorization_complete");

    expect(factorization).toMatchObject({
      P: result.P,
      L: result.L,
      U: result.U,
      permutation: result.permutation,
    });
    expect(factorization?.P).not.toBe(result.P);
    expect(factorization?.L).not.toBe(result.L);
    expect(factorization?.U).not.toBe(result.U);
  });

  it("records every triangular-solve component in solver evaluation order", () => {
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
    const forward = traceStepsOfKind(result, "forward_substitution");
    const backward = traceStepsOfKind(result, "backward_substitution");

    expect(forward.map((step) => step.row)).toEqual([0, 1, 2]);
    expect(backward.map((step) => step.row)).toEqual([2, 1, 0]);
    expect(forward[2]?.contributions.map((term) => term.column)).toEqual([0, 1]);
    expect(backward[2]?.contributions.map((term) => term.column)).toEqual([1, 2]);
    expect(backward.map((step) => step.resultingXHat)).toEqual([
      result.xHat[2],
      result.xHat[1],
      result.xHat[0],
    ]);

    for (const step of [...forward, ...backward]) {
      let expectedSum = 0;
      let expectedAccumulator = step.rightHandSideValue;
      for (const term of step.contributions) {
        expectedSum += term.coefficient * term.knownValue;
        expectedAccumulator -= term.product;
        expect(term.product).toBe(term.coefficient * term.knownValue);
        expect(term.accumulatedKnownTermSum).toBe(expectedSum);
        expect(term.accumulatorAfterSubtraction).toBe(expectedAccumulator);
      }
      expect(step.accumulatedKnownTermSum).toBe(expectedSum);
      expect(step.numeratorBeforeDivision).toBe(expectedAccumulator);
    }
  });

  it("does not let a trace-only aggregate change an otherwise finite solve", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [1, 1, 1],
          [0, 1, 0],
          [0, 0, 1],
        ],
        b: [1e308, 1e308, 1e308],
      })
    );
    const rowZero = traceStepsOfKind(result, "backward_substitution").find(
      (step) => step.row === 0
    );

    expect(result.xHat).toEqual([-1e308, 1e308, 1e308]);
    expect(result.residual).toEqual([0, 0, 0]);
    expect(rowZero?.contributions.map((term) => term.product)).toEqual([
      1e308,
      1e308,
    ]);
    expect(rowZero?.contributions[0]?.accumulatedKnownTermSum).toBe(1e308);
    expect(rowZero?.contributions[1]?.accumulatedKnownTermSum).toBeUndefined();
    expect(rowZero?.accumulatedKnownTermSum).toBeUndefined();
    expect(rowZero?.numeratorBeforeDivision).toBe(-1e308);
  });

  it("records residual arithmetic from original A and b in left-to-right order", () => {
    const result = successful(
      solveLinearSystem({
        A: [
          [0.1, 0.2],
          [0.3, 0.7],
        ],
        b: [0.3, 1],
      })
    );
    const components = traceStepsOfKind(result, "residual_component");
    const [norm] = traceStepsOfKind(result, "residual_inf_norm");

    expect(components).toHaveLength(result.dimension);
    for (const step of components) {
      expect(step.originalARow).toEqual(result.originalA[step.row]);
      expect(step.xHatValues).toEqual(result.xHat);
      expect(step.originalBValue).toBe(result.originalB[step.row]);
      let accumulated = 0;
      for (const term of step.terms) {
        expect(term.column).toBe(step.terms.indexOf(term));
        expect(term.product).toBe(term.coefficient * term.solutionValue);
        accumulated += term.product;
        expect(term.accumulatedMatrixVectorValue).toBe(accumulated);
      }
      expect(step.matrixVectorValue).toBe(accumulated);
      expect(step.residualComponent).toBe(step.originalBValue - accumulated);
      expect(step.residualComponent).toBe(result.residual[step.row]);
    }
    expect(norm?.components.map((component) => component.value)).toEqual(
      result.residual
    );
    expect(norm?.residualInfNorm).toBe(result.residualInfNorm);
    expect(norm?.residualInfNorm).toBe(
      Math.max(...norm!.components.map((component) => component.absoluteValue))
    );
  });

  it("records qualified preset-reference evidence for both presets only", () => {
    const starter = successful(
      solveLinearSystem({
        A: [
          [3, 1, -1],
          [2, 4, 1],
          [-1, 2, 5],
        ],
        b: [6, 9, -2],
      })
    );
    const rowSwap = successful(
      solveLinearSystem({
        A: [
          [0, 2, 1],
          [1, -2, -3],
          [2, 3, 1],
        ],
        b: [0, -3, 1],
      })
    );
    const custom = successful(
      solveLinearSystem({
        A: [
          [2, 0],
          [0, 4],
        ],
        b: [2, 8],
      })
    );

    for (const result of [starter, rowSwap]) {
      const [reference] = traceStepsOfKind(result, "preset_reference_difference");
      expect(reference?.presetId).toBe(result.presetId);
      expect(reference?.components.map((component) => component.computedValue)).toEqual(
        result.xHat
      );
      expect(reference?.components.map((component) => component.referenceValue)).toEqual(
        result.referenceSolution
      );
      expect(reference?.referenceDifferenceInf).toBe(result.referenceDifferenceInf);
    }
    expect(traceStepsOfKind(custom, "preset_reference_difference")).toEqual([]);
  });

  it("preserves every accepted Day 1 output exactly while adding trace", () => {
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
    const { trace, ...dayOneOutput } = result;

    expect(trace.retainedStepCount).toBeGreaterThan(0);
    expect(dayOneOutput).toEqual({
      dimension: 3,
      originalA: [
        [3, 1, -1],
        [2, 4, 1],
        [-1, 2, 5],
      ],
      originalB: [6, 9, -2],
      xHat: [1, 2, -1.0000000000000002],
      P: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      L: [
        [1, 0, 0],
        [0.6666666666666666, 1, 0],
        [-0.3333333333333333, 0.7000000000000001, 1],
      ],
      U: [
        [3, 1, -1],
        [0, 3.3333333333333335, 1.6666666666666665],
        [0, 0, 3.5],
      ],
      permutation: [0, 1, 2],
      pivots: [
        { column: 0, selectedRow: 0, pivotValue: 3 },
        { column: 1, selectedRow: 1, pivotValue: 3.3333333333333335 },
        { column: 2, selectedRow: 2, pivotValue: 3.5 },
      ],
      rowSwapCount: 0,
      residual: [0, 0, 8.881784197001252e-16],
      residualInfNorm: 8.881784197001252e-16,
      tauPivot: 1.1368683772161603e-13,
      matrixInfNorm: 8,
      inputFingerprint:
        '{"rows":3,"columns":[3,3,3],"A":[["3","1","-1"],["2","4","1"],["-1","2","5"]],"b":["6","9","-2"]}',
      presetId: "starter_3x3",
      presetName: "Starter 3×3",
      referenceSolution: [1, 2, -1],
      referenceDifferenceInf: 2.220446049250313e-16,
    });
  });

  it("publishes bounded pivot-rejection evidence without a partial success", () => {
    const outcome = solveLinearSystem({
      A: [
        [1, 1],
        [1, 1],
      ],
      b: [2, 2],
    });

    expect(outcome.ok).toBe(false);
    if (outcome.ok) throw new Error("Expected pivot rejection.");
    expect(outcome.error.code).toBe("pivot_rejected");
    expect(outcome.error.message).toContain("or too close to singular");
    expect(outcome.error.message).toContain("pivot acceptance threshold");
    const rejected = outcome.error.trace?.steps.find(
      (step): step is Extract<LinearSystemTraceStep, { kind: "pivot_selection" }> =>
        step.kind === "pivot_selection" && !step.accepted
    );
    expect(rejected).toMatchObject({
      column: 1,
      selectedPivotValue: 0,
      selectedAbsoluteMagnitude: 0,
      tauPivot: 64 * Number.EPSILON * 2,
      accepted: false,
    });
    expect(outcome.error.trace).toMatchObject({
      processKind: "bounded_finite",
      retentionPolicy: "all_meaningful_steps",
      omittedMiddleWork: false,
    });
    expect(Object.isFrozen(outcome.error.trace)).toBe(true);
    expect(Object.isFrozen(outcome.error.trace?.steps)).toBe(true);
    expect(Object.isFrozen(rejected)).toBe(true);
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
    expect(Object.isFrozen(result.trace)).toBe(true);
    expect(Object.isFrozen(result.trace.steps)).toBe(true);
    expect(Object.isFrozen(result.trace.steps[0])).toBe(true);

    const elimination = traceStepsOfKind(result, "elimination")[0]!;
    expect(Object.isFrozen(elimination.targetRowBefore)).toBe(true);
    expect(Object.isFrozen(elimination.multiplierLocation)).toBe(true);

    A[0]![0] = 99;
    b[0] = 99;
    expect(result.originalA[0]![0]).toBe(3);
    expect(result.originalB[0]).toBe(6);
    expect(traceStepsOfKind(result, "matrix_scale")[0]?.rows[0]?.terms[0]?.value).toBe(
      3
    );
    expect(() => (result.xHat as number[]).push(99)).toThrow();
    expect(() => ((result.L[0] as number[])[0] = 99)).toThrow();
    expect(() => (result.trace.steps as LinearSystemTraceStep[]).push(elimination)).toThrow();
    expect(() => (elimination.targetRowAfter as number[]).push(99)).toThrow();
  });
});
