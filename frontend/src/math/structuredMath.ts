export type StructuredMathContent = StructuredMathPart | readonly StructuredMathPart[];

export type StructuredMathPart =
  | string
  | {
      readonly kind: "subscript";
      readonly base: StructuredMathContent;
      readonly script: StructuredMathContent;
    }
  | {
      readonly kind: "superscript";
      readonly base: StructuredMathContent;
      readonly script: StructuredMathContent;
    };

export type MathNumberContext =
  | "ordinary"
  | "matrix"
  | "solution"
  | "multiplier"
  | "detail"
  | "reference_detail"
  | "diagnostic"
  | "threshold";

export interface FormattedMathNumber {
  readonly notation: "decimal" | "scientific";
  readonly text: string;
  readonly accessibleText: string;
  readonly parts: readonly StructuredMathPart[];
}

const SIGNIFICANT_DIGITS: Readonly<Record<MathNumberContext, number>> = Object.freeze({
  ordinary: 7,
  matrix: 7,
  solution: 8,
  multiplier: 7,
  detail: 10,
  reference_detail: 16,
  diagnostic: 7,
  threshold: 7,
});

const SCIENTIFIC_LOWER_BOUND = 1e-4;
const SCIENTIFIC_UPPER_BOUND = 1e6;

export function subscript(
  base: StructuredMathContent,
  script: StructuredMathContent
): StructuredMathPart {
  return Object.freeze({ kind: "subscript", base, script });
}

export function superscript(
  base: StructuredMathContent,
  script: StructuredMathContent
): StructuredMathPart {
  return Object.freeze({ kind: "superscript", base, script });
}

function appendContent(target: Node, content: StructuredMathContent): void {
  if (typeof content === "string") {
    target.appendChild(document.createTextNode(content));
    return;
  }
  const parts = Array.isArray(content) ? content : [content];
  for (const part of parts) {
    if (typeof part === "string") {
      target.appendChild(document.createTextNode(part));
      continue;
    }
    appendContent(target, part.base);
    const script = document.createElement(part.kind === "subscript" ? "sub" : "sup");
    appendContent(script, part.script);
    target.appendChild(script);
  }
}

export function createStructuredMath(
  content: StructuredMathContent,
  accessibleText: string,
  options: {
    readonly tag?: "span" | "p" | "div";
    readonly className?: string;
    readonly dataMath?: string;
  } = {}
): HTMLElement {
  const owner = document.createElement(options.tag ?? "span");
  owner.className = ["structured-math", options.className]
    .filter((value): value is string => Boolean(value))
    .join(" ");
  owner.setAttribute("role", "math");
  owner.setAttribute("aria-label", accessibleText);
  if (options.dataMath) owner.dataset.math = options.dataMath;

  const visual = document.createElement("span");
  visual.className = "structured-math-visual";
  visual.setAttribute("aria-hidden", "true");
  appendContent(visual, content);
  owner.append(visual);
  return owner;
}

function trimMantissa(value: string): string {
  if (!value.includes(".")) return value;
  return value.replace(/0+$/, "").replace(/\.$/, "");
}

function spokenExponent(exponent: number): string {
  return exponent < 0 ? `minus ${Math.abs(exponent)}` : String(exponent);
}

export function formatMathNumber(
  value: number,
  context: MathNumberContext
): FormattedMathNumber {
  if (!Number.isFinite(value)) {
    throw new Error("Structured mathematical display requires a finite number.");
  }
  if (Object.is(value, -0) || value === 0) {
    return Object.freeze({
      notation: "decimal",
      text: "0",
      accessibleText: "0",
      parts: Object.freeze(["0"]),
    });
  }

  const significantDigits = SIGNIFICANT_DIGITS[context];
  const magnitude = Math.abs(value);
  if (magnitude < SCIENTIFIC_LOWER_BOUND || magnitude >= SCIENTIFIC_UPPER_BOUND) {
    const [rawMantissa, rawExponent] = value
      .toExponential(significantDigits - 1)
      .split("e");
    const mantissa = trimMantissa(rawMantissa!);
    const exponent = Number(rawExponent);
    const visualExponent = exponent < 0 ? `−${Math.abs(exponent)}` : String(exponent);
    const parts = Object.freeze<readonly StructuredMathPart[]>([
      mantissa,
      " × ",
      superscript("10", visualExponent),
    ]);
    return Object.freeze({
      notation: "scientific",
      text: `${mantissa} × 10${visualExponent}`,
      accessibleText: `${mantissa} times ten to the ${spokenExponent(exponent)}`,
      parts,
    });
  }

  const decimal = Number(value.toPrecision(significantDigits)).toString();
  return Object.freeze({
    notation: "decimal",
    text: decimal,
    accessibleText: decimal.replaceAll("-", "minus "),
    parts: Object.freeze([decimal]),
  });
}

export function createMathNumber(
  value: number,
  context: MathNumberContext,
  options: { readonly className?: string } = {}
): HTMLElement {
  const formatted = formatMathNumber(value, context);
  const node = createStructuredMath(formatted.parts, formatted.accessibleText, {
    className: ["structured-math-number", options.className]
      .filter((item): item is string => Boolean(item))
      .join(" "),
  });
  node.dataset.mathNumber = formatted.notation;
  node.dataset.mathNumberContext = context;
  return node;
}
