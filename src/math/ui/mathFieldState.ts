import type { MathVariableProfile } from "../ast";
import { MathExpressionError, isMathExpressionError } from "../errors";
import { createMathExpressionFromLatex } from "../mathJsonAdapter";
import { createMathExpressionFromLegacy } from "../legacyAdapter";
import type { MathExpression } from "../expression";

export type IncompleteLatexKind =
  | "empty_expression"
  | "empty_exponent"
  | "empty_numerator"
  | "empty_denominator"
  | "empty_root"
  | "empty_function_argument"
  | "empty_absolute_value"
  | "placeholder"
  | "unclosed_group";

export interface IncompleteLatexIssue {
  kind: IncompleteLatexKind;
  message: string;
  position: number;
}

export type MathFieldValidationState =
  | { kind: "incomplete"; draftLatex: string; confirmed?: MathExpression }
  | { kind: "ready"; draftLatex: string; confirmed: MathExpression }
  | {
      kind: "invalid";
      draftLatex: string;
      error: MathExpressionError;
      confirmed?: MathExpression;
    };

export interface MathFieldSnapshot {
  state: MathFieldValidationState;
  strict: boolean;
}

export type LegacyMathFieldImportResult =
  | { kind: "ready"; expression: MathExpression }
  | { kind: "invalid"; error: MathExpressionError };

const FUNCTION_COMMANDS = new Set(["sin", "cos", "tan", "ln", "log", "exp"]);

function isEscaped(text: string, index: number): boolean {
  let count = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i -= 1) count += 1;
  return count % 2 === 1;
}

function skipSpace(text: string, from: number): number {
  let index = from;
  while (index < text.length && /\s/.test(text[index]!)) index += 1;
  return index;
}

function groupAt(
  text: string,
  start: number,
  open = "{",
  close = "}"
): { content: string; end: number } | undefined {
  if (text[start] !== open || isEscaped(text, start)) return undefined;
  let depth = 0;
  for (let index = start; index < text.length; index += 1) {
    if (isEscaped(text, index)) continue;
    if (text[index] === open) depth += 1;
    else if (text[index] === close) {
      depth -= 1;
      if (depth === 0) {
        return { content: text.slice(start + 1, index), end: index + 1 };
      }
    }
  }
  return undefined;
}

function commandAt(text: string, index: number): { name: string; end: number } | undefined {
  if (text[index] !== "\\" || isEscaped(text, index)) return undefined;
  const match = /^[A-Za-z]+/.exec(text.slice(index + 1));
  if (!match) return undefined;
  return { name: match[0], end: index + 1 + match[0].length };
}

function isEmptySlot(content: string): boolean {
  const compact = content.replace(/\s/g, "");
  return compact === "" || compact === "#?" || compact === "\\placeholder{}";
}

function issue(
  kind: IncompleteLatexKind,
  message: string,
  position: number
): IncompleteLatexIssue {
  return { kind, message, position };
}

export function inspectIncompleteLatex(latex: string): IncompleteLatexIssue | undefined {
  if (latex.trim() === "") {
    return issue("empty_expression", "Enter an expression before continuing.", 0);
  }

  const parentheses: number[] = [];
  for (let index = 0; index < latex.length; index += 1) {
    if (isEscaped(latex, index)) continue;
    const command = commandAt(latex, index);
    if (command?.name === "placeholder") {
      const slot = groupAt(latex, skipSpace(latex, command.end));
      if (slot && isEmptySlot(slot.content)) {
        return issue("placeholder", "Finish the highlighted part before continuing.", index);
      }
    }

    if (latex.startsWith("#?", index)) {
      return issue("placeholder", "Finish the highlighted part before continuing.", index);
    }

    if (latex[index] === "^") {
      const start = skipSpace(latex, index + 1);
      const exponent = groupAt(latex, start);
      const missingAtom =
        start >= latex.length ||
        "+-*/^)}]".includes(latex[start]!) ||
        latex.startsWith("\\placeholder", start) ||
        latex.startsWith("#?", start);
      if ((exponent && isEmptySlot(exponent.content)) || (!exponent && missingAtom)) {
        return issue("empty_exponent", "Finish the exponent before continuing.", index);
      }
    }

    if (command?.name === "frac") {
      const numeratorStart = skipSpace(latex, command.end);
      const numerator = groupAt(latex, numeratorStart);
      if (!numerator || isEmptySlot(numerator.content)) {
        return issue("empty_numerator", "Finish the numerator before continuing.", numeratorStart);
      }
      const denominatorStart = skipSpace(latex, numerator.end);
      const denominator = groupAt(latex, denominatorStart);
      if (!denominator || isEmptySlot(denominator.content)) {
        return issue("empty_denominator", "Finish the denominator before continuing.", denominatorStart);
      }
    }

    if (command?.name === "sqrt") {
      const rootStart = skipSpace(latex, command.end);
      const root = groupAt(latex, rootStart);
      if (!root || isEmptySlot(root.content)) {
        return issue("empty_root", "Finish the square root before continuing.", rootStart);
      }
    }

    if (command && FUNCTION_COMMANDS.has(command.name)) {
      let argumentStart = skipSpace(latex, command.end);
      const left = commandAt(latex, argumentStart);
      if (left?.name === "left") argumentStart = skipSpace(latex, left.end);
      if (latex[argumentStart] === "(") {
        const argument = groupAt(latex, argumentStart, "(", ")");
        if (!argument || isEmptySlot(argument.content)) {
          return issue(
            "empty_function_argument",
            `Finish the ${command.name === "ln" ? "natural logarithm" : command.name} argument before continuing.`,
            argumentStart
          );
        }
      }
    }

    if (latex.startsWith("\\left|", index) || latex.startsWith("\\lvert", index)) {
      const start = latex.startsWith("\\left|", index) ? index + 6 : index + 6;
      const right = latex.indexOf(latex.startsWith("\\left|", index) ? "\\right|" : "\\rvert", start);
      if (right < 0 || isEmptySlot(latex.slice(start, right))) {
        return issue("empty_absolute_value", "Finish the absolute value before continuing.", index);
      }
    }

    if (latex[index] === "(") parentheses.push(index);
    else if (latex[index] === ")") parentheses.pop();
  }

  if (parentheses.length > 0) {
    return issue("unclosed_group", "Close the open group before continuing.", parentheses.at(-1)!);
  }

  let braceDepth = 0;
  for (let index = 0; index < latex.length; index += 1) {
    if (isEscaped(latex, index)) continue;
    if (latex[index] === "{") braceDepth += 1;
    else if (latex[index] === "}") braceDepth -= 1;
  }
  if (braceDepth > 0) {
    return issue("unclosed_group", "Close the open group before continuing.", latex.length - 1);
  }
  return undefined;
}

function incompleteError(value: IncompleteLatexIssue): MathExpressionError {
  return new MathExpressionError("incomplete_expression", value.message, {
    adapter: "math_json",
    position: value.position,
  });
}

export function validateMathFieldDraft(
  draftLatex: string,
  profile: MathVariableProfile,
  previousConfirmed: MathExpression | undefined,
  strict: boolean
): MathFieldSnapshot {
  const incomplete = inspectIncompleteLatex(draftLatex);
  if (incomplete) {
    return strict
      ? {
          state: {
            kind: "invalid",
            draftLatex,
            error: incompleteError(incomplete),
            confirmed: previousConfirmed,
          },
          strict: true,
        }
      : {
          state: { kind: "incomplete", draftLatex, confirmed: previousConfirmed },
          strict: false,
        };
  }

  try {
    const confirmed = createMathExpressionFromLatex(draftLatex, profile);
    return { state: { kind: "ready", draftLatex, confirmed }, strict };
  } catch (error) {
    const controlled = isMathExpressionError(error)
      ? error
      : new MathExpressionError(
          "invalid_math_json",
          "The expression could not be understood. Check its structure and supported symbols."
        );
    if (!strict && controlled.code === "incomplete_expression") {
      return {
        state: { kind: "incomplete", draftLatex, confirmed: previousConfirmed },
        strict: false,
      };
    }
    return {
      state: {
        kind: "invalid",
        draftLatex,
        error: controlled,
        confirmed: previousConfirmed,
      },
      strict,
    };
  }
}

/** Controlled bridge for saved/pasted legacy text; it never executes the source. */
export function importLegacyMathFieldExpression(
  source: string,
  profile: MathVariableProfile
): LegacyMathFieldImportResult {
  try {
    return {
      kind: "ready",
      expression: createMathExpressionFromLegacy(source, profile),
    };
  } catch (error) {
    return {
      kind: "invalid",
      error: isMathExpressionError(error)
        ? error
        : new MathExpressionError(
            "invalid_legacy_expression",
            "The saved expression could not be imported safely."
          ),
    };
  }
}
