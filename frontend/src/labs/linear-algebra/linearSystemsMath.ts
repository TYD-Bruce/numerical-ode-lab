import {
  createNativeMath,
  mathIdentifier,
  mathMatrix,
  mathNumber,
  mathNumberLiteral,
  mathOperator,
  mathOver,
  mathRow,
  mathSubscript,
  type NativeMathNode,
} from "../../math/nativeMath";
import {
  formatMathNumber,
  type MathNumberContext,
} from "../../math/structuredMath";

export function xHatNode(): NativeMathNode {
  return mathOver(mathIdentifier("x"), mathOperator("^"));
}

export function indexedNode(
  base: string | NativeMathNode,
  ...indices: readonly number[]
): NativeMathNode {
  const baseNode = typeof base === "string" ? mathIdentifier(base) : base;
  return mathSubscript(
    baseNode,
    mathNumberLiteral(indices.map((index) => index + 1).join(""))
  );
}

export function multiplyNodes(
  left: NativeMathNode,
  right: NativeMathNode
): NativeMathNode {
  return mathRow([left, mathOperator("⁢"), right]);
}

export function numericMatrixNode(
  matrix: readonly (readonly number[])[],
  context: MathNumberContext = "matrix"
): NativeMathNode {
  return mathMatrix(
    matrix.map((row) => row.map((value) => mathNumber(value, context)))
  );
}

export function numericVectorNode(
  vector: readonly number[],
  context: MathNumberContext = "matrix"
): NativeMathNode {
  return numericMatrixNode(vector.map((value) => [value]), context);
}

export function spokenNumber(
  value: number,
  context: MathNumberContext
): string {
  return formatMathNumber(value, context).accessibleText;
}

export function spokenVector(
  vector: readonly number[],
  context: MathNumberContext
): string {
  return vector.map((value) => spokenNumber(value, context)).join(", ");
}

export function spokenMatrix(
  matrix: readonly (readonly number[])[],
  context: MathNumberContext
): string {
  return matrix
    .map((row) => row.map((value) => spokenNumber(value, context)).join(", "))
    .join("; ");
}

export function createSystemEquation(
  className = "ls-native-equation"
): HTMLElement {
  return createNativeMath(
    [
      multiplyNodes(mathIdentifier("A"), mathIdentifier("x")),
      mathOperator("="),
      mathIdentifier("b"),
    ],
    "A times x equals b",
    { className, display: "block", dataMath: "system-equation" }
  );
}

export function createComputedSolution(
  values: readonly number[],
  className = "ls-computed-solution-math"
): HTMLElement {
  return createNativeMath(
    [
      xHatNode(),
      mathOperator("="),
      numericVectorNode(values, "solution"),
    ],
    `x hat equals the column vector ${spokenVector(values, "solution")}`,
    { className, display: "block", dataMath: "computed-solution" }
  );
}

export function createNamedMatrix(
  symbol: string,
  matrix: readonly (readonly number[])[],
  accessibleName: string,
  options: {
    readonly className?: string;
    readonly dataMath?: string;
    readonly context?: MathNumberContext;
  } = {}
): HTMLElement {
  const context = options.context ?? "matrix";
  return createNativeMath(
    [
      mathIdentifier(symbol),
      mathOperator("="),
      numericMatrixNode(matrix, context),
    ],
    `${accessibleName} equals the matrix with rows ${spokenMatrix(matrix, context)}`,
    {
      className: options.className ?? "ls-native-matrix",
      display: "block",
      dataMath: options.dataMath ?? `matrix-${symbol.toLowerCase()}`,
    }
  );
}

export function createNamedVector(
  symbol: string | NativeMathNode,
  vector: readonly number[],
  accessibleName: string,
  options: {
    readonly className?: string;
    readonly dataMath?: string;
    readonly context?: MathNumberContext;
  } = {}
): HTMLElement {
  const context = options.context ?? "matrix";
  const symbolNode = typeof symbol === "string" ? mathIdentifier(symbol) : symbol;
  return createNativeMath(
    [symbolNode, mathOperator("="), numericVectorNode(vector, context)],
    `${accessibleName} equals the column vector ${spokenVector(vector, context)}`,
    {
      className: options.className ?? "ls-native-vector",
      display: "block",
      dataMath: options.dataMath,
    }
  );
}

export function createPluRelation(
  approximate = false,
  className = "ls-native-equation"
): HTMLElement {
  return createNativeMath(
    [
      multiplyNodes(mathIdentifier("P"), mathIdentifier("A")),
      mathOperator(approximate ? "≈" : "="),
      multiplyNodes(mathIdentifier("L"), mathIdentifier("U")),
    ],
    approximate
      ? "P times A is approximately equal to L times U"
      : "P times A equals L times U",
    {
      className,
      display: "block",
      dataMath: approximate ? "rounded-factorization" : "factorization-relation",
    }
  );
}
