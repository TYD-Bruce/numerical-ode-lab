import { describe, expect, it } from "vitest";

import {
  addNode,
  functionNode,
  multiplyNode,
  negateNode,
  numberNode,
  variableNode,
} from "./ast";
import { serializeMathAst } from "./canonical";
import { MathExpressionError } from "./errors";
import {
  compileMathExpression,
  createMathExpression,
  type MathExpression,
} from "./expression";
import {
  createMathExpressionFromLegacy,
  parseLegacyExpression,
} from "./legacyAdapter";
import {
  convertRawMathJson,
  createMathExpressionFromRawMathJson,
} from "./mathJsonAdapter";

describe("MathExpression container", () => {
  it("makes the validated cloned AST authoritative", () => {
    const terms = [variableNode("t"), variableNode("y")];
    const candidate = { kind: "add", terms };
    const expression = createMathExpression("t+y", candidate, "rhs");
    terms[0] = numberNode(99);

    expect(expression).toEqual({
      latex: "t+y",
      canonicalAst: addNode(variableNode("t"), variableNode("y")),
      displayText: "t plus y",
    });
  });

  it("retains only restoration LaTeX, authoritative AST, and generated display text", () => {
    const expression = createMathExpressionFromRawMathJson(
      "\\sin(t)",
      ["Sin", "t"],
      "rhs"
    );
    expect(Object.keys(expression)).toEqual(["latex", "canonicalAst", "displayText"]);
    expect(expression).not.toHaveProperty("rawMathJson");
    expect(expression).not.toHaveProperty("source");
    expect(expression.displayText).toBe("sine of t");
  });

  it("enforces profiles during construction", () => {
    expect(() => createMathExpression("u", variableNode("u"), "rhs")).toThrowError(
      MathExpressionError
    );
  });
});

describe("compiled MathExpression", () => {
  it("derives serialization and evaluation only from the validated AST", () => {
    const original: MathExpression = {
      latex: "2t",
      canonicalAst: multiplyNode(numberNode(2), variableNode("t")),
      displayText: "untrusted replacement text",
    };
    const compiled = compileMathExpression(original, "rhs");

    expect(compiled.expression.displayText).toBe("2 times t");
    expect(compiled.canonicalSerialization).toBe(
      serializeMathAst(compiled.expression.canonicalAst, "rhs")
    );
    expect(compiled.evaluate(3, 0)).toBe(6);
  });

  it("supports exact_solution and second_order_rhs compiled signatures", () => {
    const exact = compileMathExpression(
      createMathExpression("y_0", variableNode("y0"), "exact_solution"),
      "exact_solution"
    );
    const second = compileMathExpression(
      createMathExpression("-u", negateNode(variableNode("u")), "second_order_rhs"),
      "second_order_rhs"
    );

    expect(exact.evaluate(2, 0, 4)).toBe(4);
    expect(second.evaluate(0, 3)).toBe(-3);
  });

  it("uses the Phase 1 controlled evaluator for domain errors", () => {
    const expression = createMathExpression(
      "\\frac{1}{0}",
      { kind: "divide", numerator: numberNode(1), denominator: numberNode(0) },
      "rhs"
    );
    const compiled = compileMathExpression(expression, "rhs");
    expect(() => compiled.evaluate(0, 0)).toThrowError(MathExpressionError);
  });
});

describe("equivalent adapter paths", () => {
  it("converges all four approved exponential inputs to one serialization", () => {
    const asts = [
      convertRawMathJson(["Power", "e", "t"], "rhs"),
      convertRawMathJson(["Exp", "t"], "rhs"),
      parseLegacyExpression("exp(t)", "rhs"),
      parseLegacyExpression("Math.exp(t)", "rhs"),
    ];
    const serializations = asts.map((ast) => serializeMathAst(ast, "rhs"));

    expect(asts).toEqual([
      functionNode("exp", variableNode("t")),
      functionNode("exp", variableNode("t")),
      functionNode("exp", variableNode("t")),
      functionNode("exp", variableNode("t")),
    ]);
    expect(new Set(serializations).size).toBe(1);
  });

  it("produces consistent evaluators from raw and legacy inputs", () => {
    const raw = compileMathExpression(
      createMathExpressionFromRawMathJson(
        "y(1-y)",
        ["InvisibleOperator", "y", ["Delimiter", ["Subtract", 1, "y"]]],
        "rhs"
      ),
      "rhs"
    );
    const legacy = compileMathExpression(
      createMathExpressionFromLegacy("y(1-y)", "rhs"),
      "rhs"
    );

    expect(raw.canonicalSerialization).toBe(legacy.canonicalSerialization);
    expect(raw.evaluate(0, 0.25)).toBe(legacy.evaluate(0, 0.25));
    expect(raw.evaluate(0, 0.25)).toBe(0.1875);
  });

  it("does not retain imported JavaScript-style text as authority", () => {
    const expression = createMathExpressionFromLegacy("Math.sin(t)-0.1*y", "rhs");
    expect(expression.latex).not.toContain("Math.");
    expect(expression.canonicalAst).toEqual(
      addNode(
        functionNode("sin", variableNode("t")),
        negateNode(multiplyNode(numberNode(0.1), variableNode("y")))
      )
    );
    expect(JSON.stringify(expression)).not.toContain("Math.sin");
  });
});
