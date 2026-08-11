import {
  createLinearSystemsInputFingerprint,
  matchLinearSystemsPreset,
  type LinearSystemsMatrix,
  type LinearSystemsPresetId,
  type LinearSystemsVector,
} from "./linearSystemsPresets";
import {
  createComputationTrace,
  type ComputationTrace,
} from "../trace/computationTrace";

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

export interface LinearSystemMatrixScaleTerm {
  readonly column: number;
  readonly value: number;
  readonly absoluteValue: number;
}

export interface LinearSystemMatrixScaleRow {
  readonly row: number;
  readonly terms: readonly LinearSystemMatrixScaleTerm[];
  readonly absoluteSum: number;
}

export interface LinearSystemMatrixScaleTraceStep {
  readonly kind: "matrix_scale";
  readonly rows: readonly LinearSystemMatrixScaleRow[];
  readonly selectedMaximumRow: number;
  readonly matrixInfNorm: number;
  readonly pivotUlpFactor: number;
  readonly numberEpsilon: number;
  readonly tauPivot: number;
}

export interface LinearSystemPivotCandidate {
  readonly row: number;
  readonly value: number;
  readonly absoluteValue: number;
}

export interface LinearSystemPivotSelectionTraceStep {
  readonly kind: "pivot_selection";
  readonly column: number;
  readonly candidates: readonly LinearSystemPivotCandidate[];
  readonly selectedRow: number;
  readonly selectedPivotValue: number;
  readonly selectedAbsoluteMagnitude: number;
  readonly tauPivot: number;
  readonly accepted: boolean;
}

export interface LinearSystemIndexedRow {
  readonly row: number;
  readonly values: readonly number[];
}

export interface LinearSystemPriorLRow {
  readonly row: number;
  readonly entries: readonly {
    readonly column: number;
    readonly value: number;
  }[];
}

export interface LinearSystemRowSwapTraceStep {
  readonly kind: "row_swap";
  readonly column: number;
  readonly firstRow: number;
  readonly secondRow: number;
  readonly uRowsBefore: readonly LinearSystemIndexedRow[];
  readonly uRowsAfter: readonly LinearSystemIndexedRow[];
  readonly pRowsBefore: readonly LinearSystemIndexedRow[];
  readonly pRowsAfter: readonly LinearSystemIndexedRow[];
  readonly permutationBefore: readonly number[];
  readonly permutationAfter: readonly number[];
  readonly lPriorColumnsBefore: readonly LinearSystemPriorLRow[];
  readonly lPriorColumnsAfter: readonly LinearSystemPriorLRow[];
}

export interface LinearSystemEliminationTraceStep {
  readonly kind: "elimination";
  readonly column: number;
  readonly pivotRow: number;
  readonly targetRow: number;
  readonly pivotValue: number;
  readonly targetColumnValueBefore: number;
  readonly multiplier: number;
  readonly targetRowBefore: readonly number[];
  readonly pivotRowUsed: readonly number[];
  readonly targetRowAfter: readonly number[];
  readonly multiplierLocation: {
    readonly row: number;
    readonly column: number;
    readonly value: number;
  };
}

export interface LinearSystemFactorizationCompleteTraceStep {
  readonly kind: "factorization_complete";
  readonly P: LinearSystemsMatrix;
  readonly L: LinearSystemsMatrix;
  readonly U: LinearSystemsMatrix;
  readonly permutation: readonly number[];
}

export interface LinearSystemSubstitutionContribution {
  readonly column: number;
  readonly coefficient: number;
  readonly knownValue: number;
  readonly product: number;
  readonly accumulatedKnownTermSum?: number;
  readonly accumulatorAfterSubtraction: number;
}

export interface LinearSystemForwardSubstitutionTraceStep {
  readonly kind: "forward_substitution";
  readonly row: number;
  readonly rightHandSideValue: number;
  readonly contributions: readonly LinearSystemSubstitutionContribution[];
  readonly accumulatedKnownTermSum?: number;
  readonly numeratorBeforeDivision: number;
  readonly diagonalValue: number;
  readonly resultingY: number;
}

export interface LinearSystemBackwardSubstitutionTraceStep {
  readonly kind: "backward_substitution";
  readonly row: number;
  readonly rightHandSideValue: number;
  readonly contributions: readonly LinearSystemSubstitutionContribution[];
  readonly accumulatedKnownTermSum?: number;
  readonly numeratorBeforeDivision: number;
  readonly diagonalValue: number;
  readonly resultingXHat: number;
}

export interface LinearSystemResidualProductTerm {
  readonly column: number;
  readonly coefficient: number;
  readonly solutionValue: number;
  readonly product: number;
  readonly accumulatedMatrixVectorValue: number;
}

export interface LinearSystemResidualComponentTraceStep {
  readonly kind: "residual_component";
  readonly row: number;
  readonly originalARow: readonly number[];
  readonly xHatValues: readonly number[];
  readonly terms: readonly LinearSystemResidualProductTerm[];
  readonly matrixVectorValue: number;
  readonly originalBValue: number;
  readonly residualComponent: number;
}

export interface LinearSystemResidualNormTraceStep {
  readonly kind: "residual_inf_norm";
  readonly components: readonly {
    readonly row: number;
    readonly value: number;
    readonly absoluteValue: number;
  }[];
  readonly selectedMaximumRow: number;
  readonly residualInfNorm: number;
}

export interface LinearSystemPresetReferenceTraceStep {
  readonly kind: "preset_reference_difference";
  readonly presetId: LinearSystemsPresetId;
  readonly components: readonly {
    readonly index: number;
    readonly computedValue: number;
    readonly referenceValue: number;
    readonly difference: number;
    readonly absoluteDifference: number;
  }[];
  readonly selectedMaximumIndex: number;
  readonly referenceDifferenceInf: number;
}

export type LinearSystemTraceStep =
  | LinearSystemMatrixScaleTraceStep
  | LinearSystemPivotSelectionTraceStep
  | LinearSystemRowSwapTraceStep
  | LinearSystemEliminationTraceStep
  | LinearSystemFactorizationCompleteTraceStep
  | LinearSystemForwardSubstitutionTraceStep
  | LinearSystemBackwardSubstitutionTraceStep
  | LinearSystemResidualComponentTraceStep
  | LinearSystemResidualNormTraceStep
  | LinearSystemPresetReferenceTraceStep;

export type LinearSystemComputationTrace = ComputationTrace<LinearSystemTraceStep>;

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
  readonly trace: LinearSystemComputationTrace;
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
  readonly trace?: LinearSystemComputationTrace;
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
  column?: number,
  traceSteps?: readonly LinearSystemTraceStep[]
): LinearSystemSolveOutcome {
  const error = Object.freeze({
    code,
    message,
    ...(column === undefined ? {} : { column }),
    ...(traceSteps
      ? {
          trace: createComputationTrace<LinearSystemTraceStep>({
            processKind: "bounded_finite",
            retentionPolicy: "all_meaningful_steps",
            finalStepRetained: traceSteps.length > 0,
            steps: traceSteps,
          }),
        }
      : {}),
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
  const traceSteps: LinearSystemTraceStep[] = [];
  const matrixScaleRows: LinearSystemMatrixScaleRow[] = [];
  let matrixInfNorm = 0;
  let selectedMaximumRow = 0;
  for (let row = 0; row < dimension; row += 1) {
    const terms: LinearSystemMatrixScaleTerm[] = [];
    let rowSum = 0;
    for (let column = 0; column < dimension; column += 1) {
      const value = originalA[row]![column]!;
      const absoluteValue = Math.abs(value);
      rowSum += absoluteValue;
      if (!finite(rowSum)) {
        return failure(
          "non_finite_intermediate",
          "The matrix infinity norm overflowed during finite arithmetic."
        );
      }
      terms.push({ column, value, absoluteValue });
    }
    matrixScaleRows.push({ row, terms, absoluteSum: rowSum });
    if (rowSum > matrixInfNorm) selectedMaximumRow = row;
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

  traceSteps.push({
    kind: "matrix_scale",
    rows: matrixScaleRows,
    selectedMaximumRow,
    matrixInfNorm,
    pivotUlpFactor: LINEAR_SYSTEMS_PIVOT_ULP_FACTOR,
    numberEpsilon: Number.EPSILON,
    tauPivot,
  });

  const U = cloneMatrix(originalA);
  const L = identityMatrix(dimension);
  const P = identityMatrix(dimension);
  const permutation = Array.from({ length: dimension }, (_, index) => index);
  const pivots: LinearSystemPivotStep[] = [];
  let rowSwapCount = 0;

  for (let column = 0; column < dimension; column += 1) {
    const candidates: LinearSystemPivotCandidate[] = [
      {
        row: column,
        value: U[column]![column]!,
        absoluteValue: Math.abs(U[column]![column]!),
      },
    ];
    let selectedRow = column;
    let selectedMagnitude = candidates[0]!.absoluteValue;
    for (let row = column + 1; row < dimension; row += 1) {
      const candidateValue = U[row]![column]!;
      const candidateMagnitude = Math.abs(candidateValue);
      candidates.push({
        row,
        value: candidateValue,
        absoluteValue: candidateMagnitude,
      });
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
    const pivotSelectionStep: LinearSystemPivotSelectionTraceStep = {
      kind: "pivot_selection",
      column,
      candidates,
      selectedRow,
      selectedPivotValue: selectedPivot,
      selectedAbsoluteMagnitude: selectedMagnitude,
      tauPivot,
      accepted: selectedMagnitude > tauPivot,
    };
    traceSteps.push(pivotSelectionStep);
    if (selectedMagnitude <= tauPivot) {
      return failure(
        "pivot_rejected",
        "The system is singular or too close to singular for this Lab's pivot acceptance threshold.",
        column,
        traceSteps
      );
    }

    pivots.push({ column, selectedRow, pivotValue: selectedPivot });
    if (selectedRow !== column) {
      const uRowsBefore = [
        { row: column, values: [...U[column]!] },
        { row: selectedRow, values: [...U[selectedRow]!] },
      ];
      const pRowsBefore = [
        { row: column, values: [...P[column]!] },
        { row: selectedRow, values: [...P[selectedRow]!] },
      ];
      const permutationBefore = [...permutation];
      const lPriorColumnsBefore = [column, selectedRow].map((row) => ({
        row,
        entries: Array.from({ length: column }, (_, priorColumn) => ({
          column: priorColumn,
          value: L[row]![priorColumn]!,
        })),
      }));

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

      traceSteps.push({
        kind: "row_swap",
        column,
        firstRow: column,
        secondRow: selectedRow,
        uRowsBefore,
        uRowsAfter: [
          { row: column, values: [...U[column]!] },
          { row: selectedRow, values: [...U[selectedRow]!] },
        ],
        pRowsBefore,
        pRowsAfter: [
          { row: column, values: [...P[column]!] },
          { row: selectedRow, values: [...P[selectedRow]!] },
        ],
        permutationBefore,
        permutationAfter: [...permutation],
        lPriorColumnsBefore,
        lPriorColumnsAfter: [column, selectedRow].map((row) => ({
          row,
          entries: Array.from({ length: column }, (_, priorColumn) => ({
            column: priorColumn,
            value: L[row]![priorColumn]!,
          })),
        })),
      });
    }

    const pivot = U[column]![column]!;
    for (let row = column + 1; row < dimension; row += 1) {
      const targetRowBefore = [...U[row]!];
      const pivotRowUsed = [...U[column]!];
      const targetColumnValueBefore = U[row]![column]!;
      const multiplier = targetColumnValueBefore / pivot;
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
      traceSteps.push({
        kind: "elimination",
        column,
        pivotRow: column,
        targetRow: row,
        pivotValue: pivot,
        targetColumnValueBefore,
        multiplier,
        targetRowBefore,
        pivotRowUsed,
        targetRowAfter: [...U[row]!],
        multiplierLocation: { row, column, value: L[row]![column]! },
      });
    }
  }

  traceSteps.push({
    kind: "factorization_complete",
    P: cloneMatrix(P),
    L: cloneMatrix(L),
    U: cloneMatrix(U),
    permutation: [...permutation],
  });

  const permutedB = permutation.map((originalRow) => originalB[originalRow]!);
  const y = Array<number>(dimension).fill(0);
  for (let row = 0; row < dimension; row += 1) {
    const contributions: LinearSystemSubstitutionContribution[] = [];
    let knownTermSum: number | undefined = 0;
    let value = permutedB[row]!;
    for (let column = 0; column < row; column += 1) {
      const coefficient = L[row]![column]!;
      const knownValue = y[column]!;
      const product = coefficient * knownValue;
      value -= product;
      const nextKnownTermSum: number | undefined =
        knownTermSum === undefined ? undefined : knownTermSum + product;
      knownTermSum =
        nextKnownTermSum !== undefined && finite(nextKnownTermSum)
          ? nextKnownTermSum
          : undefined;
      if (!finite(product) || !finite(value)) {
        return failure(
          "non_finite_intermediate",
          "Forward substitution produced a non-finite value.",
          row
        );
      }
      contributions.push({
        column,
        coefficient,
        knownValue,
        product,
        ...(knownTermSum === undefined ? {} : { accumulatedKnownTermSum: knownTermSum }),
        accumulatorAfterSubtraction: value,
      });
    }
    const diagonalValue = L[row]![row]!;
    const solved = value / diagonalValue;
    if (!finite(solved)) {
      return failure(
        "non_finite_intermediate",
        "Forward substitution produced a non-finite quotient.",
        row
      );
    }
    y[row] = solved;
    traceSteps.push({
      kind: "forward_substitution",
      row,
      rightHandSideValue: permutedB[row]!,
      contributions,
      ...(knownTermSum === undefined ? {} : { accumulatedKnownTermSum: knownTermSum }),
      numeratorBeforeDivision: value,
      diagonalValue,
      resultingY: solved,
    });
  }

  const xHat = Array<number>(dimension).fill(0);
  for (let row = dimension - 1; row >= 0; row -= 1) {
    const contributions: LinearSystemSubstitutionContribution[] = [];
    let knownTermSum: number | undefined = 0;
    let value = y[row]!;
    for (let column = row + 1; column < dimension; column += 1) {
      const coefficient = U[row]![column]!;
      const knownValue = xHat[column]!;
      const product = coefficient * knownValue;
      value -= product;
      const nextKnownTermSum: number | undefined =
        knownTermSum === undefined ? undefined : knownTermSum + product;
      knownTermSum =
        nextKnownTermSum !== undefined && finite(nextKnownTermSum)
          ? nextKnownTermSum
          : undefined;
      if (!finite(product) || !finite(value)) {
        return failure(
          "non_finite_intermediate",
          "Backward substitution produced a non-finite value.",
          row
        );
      }
      contributions.push({
        column,
        coefficient,
        knownValue,
        product,
        ...(knownTermSum === undefined ? {} : { accumulatedKnownTermSum: knownTermSum }),
        accumulatorAfterSubtraction: value,
      });
    }
    const diagonalValue = U[row]![row]!;
    const solved = value / diagonalValue;
    if (!finite(solved)) {
      return failure(
        "non_finite_intermediate",
        "Backward substitution produced a non-finite quotient.",
        row
      );
    }
    xHat[row] = solved;
    traceSteps.push({
      kind: "backward_substitution",
      row,
      rightHandSideValue: y[row]!,
      contributions,
      ...(knownTermSum === undefined ? {} : { accumulatedKnownTermSum: knownTermSum }),
      numeratorBeforeDivision: value,
      diagonalValue,
      resultingXHat: solved,
    });
  }

  const residual: number[] = [];
  let residualInfNorm = 0;
  let selectedResidualMaximumRow = 0;
  for (let row = 0; row < dimension; row += 1) {
    const terms: LinearSystemResidualProductTerm[] = [];
    let productSum = 0;
    for (let column = 0; column < dimension; column += 1) {
      const coefficient = originalA[row]![column]!;
      const solutionValue = xHat[column]!;
      const product = coefficient * solutionValue;
      productSum += product;
      if (!finite(product) || !finite(productSum)) {
        return failure(
          "non_finite_intermediate",
          "Residual evaluation produced a non-finite value.",
          row
        );
      }
      terms.push({
        column,
        coefficient,
        solutionValue,
        product,
        accumulatedMatrixVectorValue: productSum,
      });
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
    if (Math.abs(component) > residualInfNorm) selectedResidualMaximumRow = row;
    residualInfNorm = Math.max(residualInfNorm, Math.abs(component));
    traceSteps.push({
      kind: "residual_component",
      row,
      originalARow: [...originalA[row]!],
      xHatValues: [...xHat],
      terms,
      matrixVectorValue: productSum,
      originalBValue: originalB[row]!,
      residualComponent: component,
    });
  }
  traceSteps.push({
    kind: "residual_inf_norm",
    components: residual.map((value, row) => ({
      row,
      value,
      absoluteValue: Math.abs(value),
    })),
    selectedMaximumRow: selectedResidualMaximumRow,
    residualInfNorm,
  });

  const inputFingerprint = createLinearSystemsInputFingerprint(originalA, originalB);
  const preset = matchLinearSystemsPreset(originalA, originalB);
  let referenceDifferenceInf: number | undefined;
  if (preset) {
    const components: LinearSystemPresetReferenceTraceStep["components"][number][] = [];
    let selectedMaximumIndex = 0;
    referenceDifferenceInf = 0;
    for (let index = 0; index < dimension; index += 1) {
      const difference = xHat[index]! - preset.xRef[index]!;
      if (!finite(difference)) {
        return failure(
          "non_finite_intermediate",
          "The preset reference comparison produced a non-finite value."
        );
      }
      const absoluteDifference = Math.abs(difference);
      if (absoluteDifference > referenceDifferenceInf) selectedMaximumIndex = index;
      referenceDifferenceInf = Math.max(referenceDifferenceInf, absoluteDifference);
      components.push({
        index,
        computedValue: xHat[index]!,
        referenceValue: preset.xRef[index]!,
        difference,
        absoluteDifference,
      });
    }
    traceSteps.push({
      kind: "preset_reference_difference",
      presetId: preset.id,
      components,
      selectedMaximumIndex,
      referenceDifferenceInf,
    });
  }

  const trace = createComputationTrace<LinearSystemTraceStep>({
    processKind: "bounded_finite",
    retentionPolicy: "all_meaningful_steps",
    finalStepRetained: true,
    steps: traceSteps,
  });

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
    trace,
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
