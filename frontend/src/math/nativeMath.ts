import {
  formatMathNumber,
  type MathNumberContext,
} from "./structuredMath";

export const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";

export type NativeMathNode = Element;
type NativeMathChild = NativeMathNode | string;
type MathMLTag =
  | "math"
  | "mrow"
  | "mi"
  | "mn"
  | "mo"
  | "mtext"
  | "msub"
  | "msup"
  | "msubsup"
  | "mover"
  | "mfrac"
  | "mtable"
  | "mtr"
  | "mtd";

function mathElement(
  tag: MathMLTag,
  children: readonly NativeMathChild[] = []
): NativeMathNode {
  const element = document.createElementNS(MATHML_NAMESPACE, tag);
  for (const child of children) {
    element.append(
      typeof child === "string" ? document.createTextNode(child) : child
    );
  }
  return element;
}

function normalizeChildren(
  children: NativeMathChild | readonly NativeMathChild[]
): readonly NativeMathChild[] {
  return Array.isArray(children) ? children : [children];
}

export function mathIdentifier(value: string): NativeMathNode {
  return mathElement("mi", [value]);
}

export function mathNumberLiteral(value: string): NativeMathNode {
  return mathElement("mn", [value.replace(/^-/, "−")]);
}

export function mathOperator(
  value: string,
  options: { readonly fence?: boolean; readonly stretchy?: boolean } = {}
): NativeMathNode {
  const operator = mathElement("mo", [value]);
  if (options.fence !== undefined) {
    operator.setAttribute("fence", String(options.fence));
  }
  if (options.stretchy !== undefined) {
    operator.setAttribute("stretchy", String(options.stretchy));
  }
  return operator;
}

export function mathText(value: string): NativeMathNode {
  return mathElement("mtext", [value]);
}

export function mathRow(
  children: NativeMathChild | readonly NativeMathChild[]
): NativeMathNode {
  return mathElement("mrow", normalizeChildren(children));
}

export function mathSubscript(
  base: NativeMathNode,
  script: NativeMathNode
): NativeMathNode {
  return mathElement("msub", [base, script]);
}

export function mathSuperscript(
  base: NativeMathNode,
  script: NativeMathNode
): NativeMathNode {
  return mathElement("msup", [base, script]);
}

export function mathSubSuperscript(
  base: NativeMathNode,
  subscript: NativeMathNode,
  superscript: NativeMathNode
): NativeMathNode {
  return mathElement("msubsup", [base, subscript, superscript]);
}

export function mathOver(
  base: NativeMathNode,
  accent: NativeMathNode
): NativeMathNode {
  const over = mathElement("mover", [base, accent]);
  over.setAttribute("accent", "true");
  return over;
}

export function mathFraction(
  numerator: NativeMathNode,
  denominator: NativeMathNode
): NativeMathNode {
  return mathElement("mfrac", [numerator, denominator]);
}

export function mathTable(
  rows: readonly (readonly NativeMathNode[])[]
): NativeMathNode {
  const table = mathElement("mtable");
  rows.forEach((cells, rowIndex) => {
    const row = mathElement("mtr");
    row.setAttribute("data-math-row", String(rowIndex));
    cells.forEach((cell, columnIndex) => {
      const tableCell = mathElement("mtd", [cell]);
      tableCell.setAttribute(
        "data-math-cell",
        `${rowIndex}:${columnIndex}`
      );
      row.append(tableCell);
    });
    table.append(row);
  });
  return table;
}

export function mathMatrix(
  rows: readonly (readonly NativeMathNode[])[]
): NativeMathNode {
  return mathRow([
    mathOperator("[", { fence: true, stretchy: true }),
    mathTable(rows),
    mathOperator("]", { fence: true, stretchy: true }),
  ]);
}

export function mathNumber(
  value: number,
  context: MathNumberContext
): NativeMathNode {
  const formatted = formatMathNumber(value, context);
  if (formatted.notation === "decimal") {
    return mathNumberLiteral(formatted.text);
  }

  const marker = " × 10";
  const markerIndex = formatted.text.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error("Scientific display does not match the project formatter.");
  }
  const mantissa = formatted.text.slice(0, markerIndex);
  const exponent = formatted.text.slice(markerIndex + marker.length);
  const scientific = mathRow([
    mathNumberLiteral(mantissa),
    mathOperator("×"),
    mathSuperscript(mathNumberLiteral("10"), mathNumberLiteral(exponent)),
  ]);
  scientific.setAttribute("data-math-number", "scientific");
  return scientific;
}

export function createNativeMath(
  content: NativeMathChild | readonly NativeMathChild[],
  accessibleText: string,
  options: {
    readonly className?: string;
    readonly display?: "inline" | "block";
    readonly dataMath?: string;
  } = {}
): HTMLElement {
  const owner = document.createElement("span");
  owner.className = ["native-math", options.className]
    .filter((value): value is string => Boolean(value))
    .join(" ");
  owner.setAttribute("role", "math");
  owner.setAttribute("aria-label", accessibleText);
  if (options.dataMath) owner.dataset.math = options.dataMath;

  const visual = mathElement("math", normalizeChildren(content));
  visual.setAttribute("aria-hidden", "true");
  visual.setAttribute("display", options.display ?? "inline");
  visual.classList.add("native-math-visual");
  owner.append(visual);
  return owner;
}
