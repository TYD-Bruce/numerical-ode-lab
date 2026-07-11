import {
  addNode,
  constantNode,
  divideNode,
  functionNode,
  multiplyNode,
  negateNode,
  numberNode,
  powerNode,
  variableNode,
  type MathAst,
  type MathFunctionName,
  type MathVariableName,
  type MathVariableProfile,
} from "./ast";
import { canonicalizeMathAst, normalizeSubtraction } from "./canonical";
import { MathExpressionError } from "./errors";
import { createMathExpression, type MathExpression } from "./expression";

type TokenKind =
  | "number"
  | "identifier"
  | "plus"
  | "minus"
  | "star"
  | "slash"
  | "caret"
  | "left_paren"
  | "right_paren"
  | "eof";

interface Token {
  readonly kind: TokenKind;
  readonly text: string;
  readonly position: number;
  readonly numericValue?: number;
}

type ImplicitCategory = "number" | "variable" | "group" | "other";

interface ParsedNode {
  readonly ast: MathAst;
  readonly implicitCategory: ImplicitCategory;
}

const FUNCTION_NAMES = new Map<string, MathFunctionName>([
  ["exp", "exp"],
  ["sin", "sin"],
  ["cos", "cos"],
  ["tan", "tan"],
  ["sqrt", "sqrt"],
  ["log", "log"],
  ["ln", "log"],
  ["abs", "abs"],
  ["Math.exp", "exp"],
  ["Math.sin", "sin"],
]);

function legacyError(
  message: string,
  position: number,
  code: "invalid_legacy_expression" | "unexpected_token" = "invalid_legacy_expression"
): never {
  throw new MathExpressionError(code, message, {
    adapter: "legacy",
    position,
  });
}

function isDigit(character: string | undefined): boolean {
  return character !== undefined && character >= "0" && character <= "9";
}

function isIdentifierStart(character: string | undefined): boolean {
  if (character === undefined) return false;
  return (
    (character >= "a" && character <= "z") ||
    (character >= "A" && character <= "Z") ||
    character === "_"
  );
}

function isIdentifierPart(character: string | undefined): boolean {
  return isIdentifierStart(character) || isDigit(character);
}

function tokenizeNumber(source: string, start: number): Token {
  let cursor = start;
  if (source[cursor] === ".") {
    cursor += 1;
    while (isDigit(source[cursor])) cursor += 1;
  } else {
    while (isDigit(source[cursor])) cursor += 1;
    if (source[cursor] === ".") {
      cursor += 1;
      while (isDigit(source[cursor])) cursor += 1;
    }
  }

  if (source[cursor] === "e" || source[cursor] === "E") {
    cursor += 1;
    if (source[cursor] === "+" || source[cursor] === "-") cursor += 1;
    const exponentStart = cursor;
    while (isDigit(source[cursor])) cursor += 1;
    if (cursor === exponentStart) {
      return legacyError("Finish the scientific-notation exponent.", cursor);
    }
  }

  const text = source.slice(start, cursor);
  const numericValue = Number(text);
  if (!Number.isFinite(numericValue)) {
    throw new MathExpressionError(
      "invalid_number",
      "Legacy numeric literals must be finite JavaScript numbers.",
      { adapter: "legacy", position: start }
    );
  }
  return { kind: "number", text, position: start, numericValue };
}

function tokenizeIdentifier(source: string, start: number): Token {
  let cursor = start;
  while (isIdentifierPart(source[cursor])) cursor += 1;
  while (source[cursor] === ".") {
    cursor += 1;
    if (!isIdentifierStart(source[cursor])) {
      return legacyError("Property access is not supported in legacy expressions.", cursor);
    }
    while (isIdentifierPart(source[cursor])) cursor += 1;
  }
  return {
    kind: "identifier",
    text: source.slice(start, cursor),
    position: start,
  };
}

export function tokenizeLegacyExpression(source: string): readonly Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const character = source[cursor]!;
    if (character === " " || character === "\t" || character === "\n" || character === "\r") {
      cursor += 1;
      continue;
    }
    if (isDigit(character) || (character === "." && isDigit(source[cursor + 1]))) {
      const token = tokenizeNumber(source, cursor);
      tokens.push(token);
      cursor = token.position + token.text.length;
      continue;
    }
    if (isIdentifierStart(character)) {
      const token = tokenizeIdentifier(source, cursor);
      tokens.push(token);
      cursor = token.position + token.text.length;
      continue;
    }

    const doubled = source.slice(cursor, cursor + 2);
    if (doubled === "++" || doubled === "--" || doubled === "**") {
      legacyError(`Operator ${doubled} is not supported.`, cursor);
    }

    const tokenKinds: Partial<Record<string, TokenKind>> = {
      "+": "plus",
      "-": "minus",
      "*": "star",
      "/": "slash",
      "^": "caret",
      "(": "left_paren",
      ")": "right_paren",
    };
    const kind = tokenKinds[character];
    if (!kind) {
      legacyError(`Character ${character} is not allowed in legacy expressions.`, cursor);
    }
    tokens.push({ kind, text: character, position: cursor });
    cursor += 1;
  }

  tokens.push({ kind: "eof", text: "", position: source.length });
  return tokens;
}

function unsafeVariableNode(name: string): MathAst {
  return variableNode(name as MathVariableName);
}

class LegacyParser {
  private index = 0;

  constructor(private readonly tokens: readonly Token[]) {}

  parse(): MathAst {
    const result = this.parseAddition();
    if (this.current().kind !== "eof") {
      legacyError(
        `Unexpected trailing token ${this.current().text}.`,
        this.current().position,
        "unexpected_token"
      );
    }
    return result.ast;
  }

  private current(): Token {
    return this.tokens[this.index]!;
  }

  private consume(kind: TokenKind): Token {
    const token = this.current();
    if (token.kind !== kind) {
      legacyError(
        `Expected ${kind.replace("_", " ")} but found ${token.text || "the end of the expression"}.`,
        token.position,
        "unexpected_token"
      );
    }
    this.index += 1;
    return token;
  }

  private match(kind: TokenKind): boolean {
    if (this.current().kind !== kind) return false;
    this.index += 1;
    return true;
  }

  private parseAddition(): ParsedNode {
    let left = this.parseProduct();
    while (this.current().kind === "plus" || this.current().kind === "minus") {
      const operator = this.current().kind;
      this.index += 1;
      const right = this.parseProduct();
      left = {
        ast:
          operator === "plus"
            ? addNode(left.ast, right.ast)
            : normalizeSubtraction(left.ast, right.ast),
        implicitCategory: "other",
      };
    }
    return left;
  }

  private parseProduct(): ParsedNode {
    let left = this.parseUnary();
    for (;;) {
      if (this.match("star")) {
        const right = this.parseUnary();
        left = {
          ast: multiplyNode(left.ast, right.ast),
          implicitCategory: "other",
        };
        continue;
      }
      if (this.match("slash")) {
        const right = this.parseUnary();
        left = {
          ast: divideNode(left.ast, right.ast),
          implicitCategory: "other",
        };
        continue;
      }
      if (this.allowsImplicitMultiplication(left.implicitCategory)) {
        const right = this.parseUnary();
        left = {
          ast: multiplyNode(left.ast, right.ast),
          implicitCategory: "other",
        };
        continue;
      }
      return left;
    }
  }

  private allowsImplicitMultiplication(left: ImplicitCategory): boolean {
    const next = this.current().kind;
    if (left === "number") return next === "identifier" || next === "left_paren";
    if (left === "variable" || left === "group") return next === "left_paren";
    return false;
  }

  private parseUnary(): ParsedNode {
    if (this.match("plus")) {
      return { ast: this.parseUnary().ast, implicitCategory: "other" };
    }
    if (this.match("minus")) {
      return {
        ast: negateNode(this.parseUnary().ast),
        implicitCategory: "other",
      };
    }
    return this.parsePower();
  }

  private parsePower(): ParsedNode {
    const base = this.parsePrimary();
    if (!this.match("caret")) return base;

    // Exponentiation is right-associative and binds more tightly than unary
    // minus: -t^2 is negate(power(t, 2)), while (-t)^2 retains the grouped base.
    const exponent = this.parseUnary();
    return {
      ast: powerNode(base.ast, exponent.ast),
      implicitCategory: "other",
    };
  }

  private parsePrimary(): ParsedNode {
    const token = this.current();
    if (token.kind === "number") {
      this.index += 1;
      return {
        ast: numberNode(token.numericValue!),
        implicitCategory: "number",
      };
    }
    if (token.kind === "identifier") {
      this.index += 1;
      return this.parseIdentifier(token);
    }
    if (this.match("left_paren")) {
      const expression = this.parseAddition();
      this.consume("right_paren");
      return { ast: expression.ast, implicitCategory: "group" };
    }

    legacyError(
      `Expected a number, variable, function, or parenthesized expression.`,
      token.position,
      "unexpected_token"
    );
  }

  private parseIdentifier(token: Token): ParsedNode {
    if (token.text === "e") {
      return { ast: constantNode("e"), implicitCategory: "other" };
    }
    if (token.text === "pi" || token.text === "Math.PI") {
      return { ast: constantNode("pi"), implicitCategory: "other" };
    }

    const functionName = FUNCTION_NAMES.get(token.text);
    if (functionName) {
      if (!this.match("left_paren")) {
        legacyError(
          `Function ${token.text} requires one parenthesized argument.`,
          token.position,
          "unexpected_token"
        );
      }
      const argument = this.parseAddition();
      this.consume("right_paren");
      return {
        ast: functionNode(functionName, argument.ast),
        implicitCategory: "other",
      };
    }

    if (token.text.includes(".")) {
      legacyError(
        `Property access ${token.text} is not an approved legacy alias.`,
        token.position
      );
    }
    return {
      ast: unsafeVariableNode(token.text),
      implicitCategory: "variable",
    };
  }
}

function latexNeedsGrouping(node: MathAst): boolean {
  return node.kind === "add" || node.kind === "multiply" || node.kind === "divide";
}

function legacyLatex(node: MathAst): string {
  switch (node.kind) {
    case "number":
      return Object.is(node.value, -0) ? "0" : String(node.value);
    case "constant":
      return node.name === "pi" ? "\\pi" : "e";
    case "variable":
      if (node.name === "t0") return "t_0";
      if (node.name === "y0") return "y_0";
      return node.name;
    case "negate": {
      const operand = legacyLatex(node.operand);
      return `-${latexNeedsGrouping(node.operand) ? `\\left(${operand}\\right)` : operand}`;
    }
    case "add":
      return node.terms
        .map((term, index) => {
          if (term.kind === "negate") {
            const operand = legacyLatex(term.operand);
            const text = latexNeedsGrouping(term.operand)
              ? `\\left(${operand}\\right)`
              : operand;
            return index === 0 ? `-${text}` : `-${text}`;
          }
          const text =
            term.kind === "add"
              ? `\\left(${legacyLatex(term)}\\right)`
              : legacyLatex(term);
          return index === 0 ? text : `+${text}`;
        })
        .join("");
    case "multiply":
      return node.factors
        .map((factor) => {
          const text = legacyLatex(factor);
          return latexNeedsGrouping(factor) ? `\\left(${text}\\right)` : text;
        })
        .join("\\cdot ");
    case "divide":
      return `\\frac{${legacyLatex(node.numerator)}}{${legacyLatex(node.denominator)}}`;
    case "power": {
      const base = legacyLatex(node.base);
      return `${latexNeedsGrouping(node.base) ? `\\left(${base}\\right)` : base}^{${legacyLatex(
        node.exponent
      )}}`;
    }
    case "function": {
      const argument = legacyLatex(node.argument);
      switch (node.name) {
        case "exp":
          return `e^{${argument}}`;
        case "sin":
        case "cos":
        case "tan":
          return `\\${node.name}\\left(${argument}\\right)`;
        case "sqrt":
          return `\\sqrt{${argument}}`;
        case "log":
          return `\\ln\\left(${argument}\\right)`;
        case "abs":
          return `\\left|${argument}\\right|`;
      }
    }
  }
}

export function parseLegacyExpression(
  source: string,
  profile: MathVariableProfile
): MathAst {
  const tokens = tokenizeLegacyExpression(source);
  const candidate = new LegacyParser(tokens).parse();
  return canonicalizeMathAst(candidate, profile);
}

export function createMathExpressionFromLegacy(
  source: string,
  profile: MathVariableProfile
): MathExpression {
  const ast = parseLegacyExpression(source, profile);
  return createMathExpression(legacyLatex(ast), ast, profile);
}
