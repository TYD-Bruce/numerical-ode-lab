import {
  createLinearSystemsInputFingerprint,
  matchLinearSystemsPreset,
  type LinearSystemsMatrix,
  type LinearSystemsPresetId,
  type LinearSystemsVector,
} from "./linearSystemsPresets";

export type { LinearSystemsMatrix, LinearSystemsVector };

export const LINEAR_SYSTEMS_MIN_DIMENSION = 2;
export const LINEAR_SYSTEMS_MAX_DIMENSION = 6;
export const LINEAR_SYSTEMS_PIVOT_ULP_FACTOR = 64;

export interface LinearSystemInput {
  readonly A: LinearSystemsMatrix;
  readonly b: LinearSystemsVector;
}

export interface LinearSystemPivotStep {
  readonly column: number;
  readonly selectedRow: number;
  readonly pivotValue: number;
}

export interface LinearSystemSolveSuccess {
  readonly dimension: number;
  readonly originalA: LinearSystemsMatrix;
  readonly originalB: LinearSystemsVector;
  readonly xHat: LinearSystemsVector;
  readonly P: LinearSystemsMatrix;
  readonly L: LinearSystemsMatrix;
  readonly U: LinearSystemsMatrix;
  /** `(P A)[row]` is `A[permutation[row]]`. */
  readonly permutation: readonly number[];
  readonly pivots: readonly LinearSystemPivotStep[];
  readonly rowSwapCount: number;
  readonly residual: LinearSystemsVector;
  readonly residualInfNorm: number;
  readonly tauPivot: number;
  readonly matrixInfNorm: number;
  readonly inputFingerprint: string;
  readonly presetId?: LinearSystemsPresetId;
  readonly presetName?: string;
  readonly referenceSolution?: LinearSystemsVector;
  readonly referenceDifferenceInf?: number;
}

export type LinearSystemSolveFailureCode =
  | "dimension_below_minimum"
  | "dimension_above_maximum"
  | "non_square_matrix"
  | "right_hand_side_length_mismatch"
  | "non_finite_input"
  | "zero_matrix"
  | "pivot_rejected"
  | "non_finite_intermediate";

export interface LinearSystemSolveError {
  readonly code: LinearSystemSolveFailureCode;
  readonly message: string;
  readonly column?: number;
}

export type LinearSystemSolveOutcome =
  | { readonly ok: true; readonly result: LinearSystemSolveSuccess }
  | { readonly ok: false; readonly error: LinearSystemSolveError };

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function failure(
  code: LinearSystemSolveFailureCode,
  message: string,
  column?: number
): LinearSystemSolveOutcome {
  const error = Object.freeze({
    code,
    message,
    ...(column === undefined ? {} : { column }),
  });
  return Object.freeze({ ok: false as const, error });
}

function cloneMatrix(matrix: LinearSystemsMatrix): number[][] {
  return matrix.map((row) => [...row]);
}

function identityMatrix(dimension: number): number[][] {
  return Array.from({ length: dimension }, (_, row) =>
    Array.from({ length: dimension }, (_, column) => (row === column ? 1 : 0))
  );
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

/**
 * Solves a small dense real square system with Gaussian elimination and
 * deterministic partial pivoting. All returned data is defensively copied and
 * deeply frozen.
 */
export function solveLinearSystem(input: LinearSystemInput): LinearSystemSolveOutcome {
  const dimension = input.A.length;
  if (dimension < LINEAR_SYSTEMS_MIN_DIMENSION) {
    return failure(
      "dimension_below_minimum",
      `Matrix dimension must be at least ${LINEAR_SYSTEMS_MIN_DIMENSION}.`
    );
  }
  if (dimension > LINEAR_SYSTEMS_MAX_DIMENSION) {
    return failure(
      "dimension_above_maximum",
      `Matrix dimension must be at most ${LINEAR_SYSTEMS_MAX_DIMENSION}.`
    );
  }
  if (input.A.some((row) => row.length !== dimension)) {
    return failure("non_square_matrix", "A must be a square matrix.");
  }
  if (input.b.length !== dimension) {
    return failure(
      "right_hand_side_length_mismatch",
      "The length of b must match the dimension of A."
    );
  }
  if (
    input.A.some((row) => row.some((value) => !finite(value))) ||
    input.b.some((value) => !finite(value))
  ) {
    return failure(
      "non_finite_input",
      "All entries of A and b must be finite real numbers."
    );
  }

  const originalA = cloneMatrix(input.A);
  const originalB = [...input.b];
  let matrixInfNorm = 0;
  for (const row of originalA) {
    let rowSum = 0;
    for (const value of row) {
      rowSum += Math.abs(value);
      if (!finite(rowSum)) {
        return failure(
          "non_finite_intermediate",
          "The matrix infinity norm overflowed during finite arithmetic."
        );
      }
    }
    matrixInfNorm = Math.max(matrixInfNorm, rowSum);
  }
  if (matrixInfNorm === 0) {
    return failure(
      "zero_matrix",
      "The zero matrix is unsolvable under this Lab's numerical contract."
    );
  }

  const tauPivot =
    LINEAR_SYSTEMS_PIVOT_ULP_FACTOR * Number.EPSILON * matrixInfNorm;
  if (!finite(tauPivot)) {
    return failure(
      "non_finite_intermediate",
      "The pivot acceptance threshold became non-finite."
    );
  }

  const U = cloneMatrix(originalA);
  const L = identityMatrix(dimension);
  const P = identityMatrix(dimension);
  const permutation = Array.from({ length: dimension }, (_, index) => index);
  const pivots: LinearSystemPivotStep[] = [];
  let rowSwapCount = 0;

  for (let column = 0; column < dimension; column += 1) {
    let selectedRow = column;
    let selectedMagnitude = Math.abs(U[column]![column]!);
    for (let row = column + 1; row < dimension; row += 1) {
      const candidateMagnitude = Math.abs(U[row]![column]!);
      if (candidateMagnitude > selectedMagnitude) {
        selectedMagnitude = candidateMagnitude;
        selectedRow = row;
      }
    }

    const selectedPivot = U[selectedRow]![column]!;
    if (!finite(selectedPivot) || !finite(selectedMagnitude)) {
      return failure(
        "non_finite_intermediate",
        "A pivot candidate became non-finite during elimination.",
        column
      );
    }
    if (selectedMagnitude <= tauPivot) {
      return failure(
        "pivot_rejected",
        "The system is singular or too close to singular for this Lab's pivot acceptance threshold.",
        column
      );
    }

    pivots.push({ column, selectedRow, pivotValue: selectedPivot });
    if (selectedRow !== column) {
      const uRow = U[column]!;
      U[column] = U[selectedRow]!;
      U[selectedRow] = uRow;

      const pRow = P[column]!;
      P[column] = P[selectedRow]!;
      P[selectedRow] = pRow;

      const permutationValue = permutation[column]!;
      permutation[column] = permutation[selectedRow]!;
      permutation[selectedRow] = permutationValue;

      for (let priorColumn = 0; priorColumn < column; priorColumn += 1) {
        const multiplier = L[column]![priorColumn]!;
        L[column]![priorColumn] = L[selectedRow]![priorColumn]!;
        L[selectedRow]![priorColumn] = multiplier;
      }
      rowSwapCount += 1;
    }

    const pivot = U[column]![column]!;
    for (let row = column + 1; row < dimension; row += 1) {
      const multiplier = U[row]![column]! / pivot;
      if (!finite(multiplier)) {
        return failure(
          "non_finite_intermediate",
          "An elimination multiplier became non-finite.",
          column
        );
      }
      L[row]![column] = multiplier;
      U[row]![column] = 0;
      for (let trailingColumn = column + 1; trailingColumn < dimension; trailingColumn += 1) {
        const product = multiplier * U[column]![trailingColumn]!;
        const updated = U[row]![trailingColumn]! - product;
        if (!finite(product) || !finite(updated)) {
          return failure(
            "non_finite_intermediate",
            "An elimination update became non-finite.",
            column
          );
        }
        U[row]![trailingColumn] = updated;
      }
    }
  }

  const permutedB = permutation.map((originalRow) => originalB[originalRow]!);
  const y = Array<number>(dimension).fill(0);
  for (let row = 0; row < dimension; row += 1) {
    let value = permutedB[row]!;
    for (let column = 0; column < row; column += 1) {
      const product = L[row]![column]! * y[column]!;
      value -= product;
      if (!finite(product) || !finite(value)) {
        return failure(
          "non_finite_intermediate",
          "Forward substitution produced a non-finite value.",
          row
        );
      }
    }
    const solved = value / L[row]![row]!;
    if (!finite(solved)) {
      return failure(
        "non_finite_intermediate",
        "Forward substitution produced a non-finite quotient.",
        row
      );
    }
    y[row] = solved;
  }

  const xHat = Array<number>(dimension).fill(0);
  for (let row = dimension - 1; row >= 0; row -= 1) {
    let value = y[row]!;
    for (let column = row + 1; column < dimension; column += 1) {
      const product = U[row]![column]! * xHat[column]!;
      value -= product;
      if (!finite(product) || !finite(value)) {
        return failure(
          "non_finite_intermediate",
          "Backward substitution produced a non-finite value.",
          row
        );
      }
    }
    const solved = value / U[row]![row]!;
    if (!finite(solved)) {
      return failure(
        "non_finite_intermediate",
        "Backward substitution produced a non-finite quotient.",
        row
      );
    }
    xHat[row] = solved;
  }

  const residual: number[] = [];
  let residualInfNorm = 0;
  for (let row = 0; row < dimension; row += 1) {
    let productSum = 0;
    for (let column = 0; column < dimension; column += 1) {
      const product = originalA[row]![column]! * xHat[column]!;
      productSum += product;
      if (!finite(product) || !finite(productSum)) {
        return failure(
          "non_finite_intermediate",
          "Residual evaluation produced a non-finite value.",
          row
        );
      }
    }
    const component = originalB[row]! - productSum;
    if (!finite(component)) {
      return failure(
        "non_finite_intermediate",
        "Residual evaluation produced a non-finite component.",
        row
      );
    }
    residual.push(component);
    residualInfNorm = Math.max(residualInfNorm, Math.abs(component));
  }

  const inputFingerprint = createLinearSystemsInputFingerprint(originalA, originalB);
  const preset = matchLinearSystemsPreset(originalA, originalB);
  let referenceDifferenceInf: number | undefined;
  if (preset) {
    referenceDifferenceInf = 0;
    for (let index = 0; index < dimension; index += 1) {
      const difference = xHat[index]! - preset.xRef[index]!;
      if (!finite(difference)) {
        return failure(
          "non_finite_intermediate",
          "The preset reference comparison produced a non-finite value."
        );
      }
      referenceDifferenceInf = Math.max(referenceDifferenceInf, Math.abs(difference));
    }
  }

  const result = deepFreeze({
    dimension,
    originalA,
    originalB,
    xHat,
    P,
    L,
    U,
    permutation,
    pivots,
    rowSwapCount,
    residual,
    residualInfNorm,
    tauPivot,
    matrixInfNorm,
    inputFingerprint,
    ...(preset
      ? {
          presetId: preset.id,
          presetName: preset.name,
          referenceSolution: [...preset.xRef],
          referenceDifferenceInf,
        }
      : {}),
  });
  return Object.freeze({ ok: true as const, result });
}
