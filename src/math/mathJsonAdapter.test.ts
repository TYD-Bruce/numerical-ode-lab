import { describe, expect, it } from "vitest";

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
  type MathVariableProfile,
} from "@numerical-t-lab/numerics/expressions/ast";
import { canonicalizeMathAst, serializeMathAst } from "@numerical-t-lab/numerics/expressions/canonical";
import { MathExpressionError } from "@numerical-t-lab/numerics/expressions/errors";
import {
  convertRawMathJson,
  createMathExpressionFromLatex,
  createMathExpressionFromRawMathJson,
  parseLatexToRawMathJson,
} from "./mathJsonAdapter";

function captureError(raw: unknown, profile: MathVariableProfile = "rhs") {
  try {
    convertRawMathJson(raw, profile);
    throw new Error("Expected conversion to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(MathExpressionError);
    return error as MathExpressionError;
  }
}

const t = variableNode("t");
const y = variableNode("y");

describe("pinned Compute Engine 0.58 raw heads", () => {
  it.each<[unknown, MathAst]>([
    [2, numberNode(2)],
    ["t", t],
    ["e", constantNode("e")],
    ["ExponentialE", constantNode("e")],
    ["Pi", constantNode("pi")],
    [["Delimiter", ["Add", "t", "y"]], addNode(t, y)],
    [["Negate", "y"], negateNode(y)],
    [["Add", "t", "y"], addNode(t, y)],
    [["Subtract", "t", "y"], addNode(t, negateNode(y))],
    [["Multiply", 2, "t"], multiplyNode(numberNode(2), t)],
    [["InvisibleOperator", 2, "t"], multiplyNode(numberNode(2), t)],
    [["Divide", 1, "t"], divideNode(numberNode(1), t)],
    [["Power", 2, "t"], powerNode(numberNode(2), t)],
    [["Exp", "t"], functionNode("exp", t)],
    [["Sin", "t"], functionNode("sin", t)],
    [["Cos", "t"], functionNode("cos", t)],
    [["Tan", "t"], functionNode("tan", t)],
    [["Sqrt", "t"], functionNode("sqrt", t)],
    [["Log", "t"], functionNode("log", t)],
    [["Ln", "t"], functionNode("log", t)],
    [["Abs", "t"], functionNode("abs", t)],
  ])("converts raw fixture %#", (raw, expected) => {
    expect(convertRawMathJson(raw, "rhs")).toEqual(expected);
  });

  it("accepts only the pinned subscript spellings", () => {
    expect(convertRawMathJson("t_0", "exact_solution")).toEqual(variableNode("t0"));
    expect(convertRawMathJson("y_0", "exact_solution")).toEqual(variableNode("y0"));
    expect(captureError("x_0", "exact_solution").code).toBe("unknown_variable");
  });

  it.each([
    ["e", "e"],
    ["pi", "\\pi"],
    ["t0", "t_0"],
    ["y0", "y_0"],
    ["log", "\\log(t)"],
    ["ln", "\\ln(t)"],
    ["abs", "\\lvert t\\rvert"],
  ])("matches the pinned parser fixture for %s", (_name, latex) => {
    const raw = parseLatexToRawMathJson(latex);
    expect(() => convertRawMathJson(raw, latex.includes("_0") ? "exact_solution" : "rhs")).not.toThrow();
  });
});

describe("raw grouping and operation preservation", () => {
  it.each<[unknown, MathAst]>([
    [
      ["Add", ["Delimiter", ["Add", "t", "y"]], 1],
      addNode(addNode(t, y), numberNode(1)),
    ],
    [
      ["Add", "t", ["Delimiter", ["Add", "y", 1]]],
      addNode(t, addNode(y, numberNode(1))),
    ],
    [
      ["Multiply", 2, ["Delimiter", ["Multiply", 3, "t"]]],
      multiplyNode(numberNode(2), multiplyNode(numberNode(3), t)),
    ],
    [
      ["Multiply", ["Delimiter", ["Multiply", 2, 3]], "t"],
      multiplyNode(multiplyNode(numberNode(2), numberNode(3)), t),
    ],
    [["Subtract", "t", "y"], addNode(t, negateNode(y))],
    [
      ["Divide", 1, ["Add", 1, "t"]],
      divideNode(numberNode(1), addNode(numberNode(1), t)),
    ],
    [["Sqrt", "t"], functionNode("sqrt", t)],
    [["Negate", "y"], negateNode(y)],
    [["InvisibleOperator", 2, "t"], multiplyNode(numberNode(2), t)],
    [["InvisibleOperator", "t", "y"], multiplyNode(t, y)],
    [
      ["InvisibleOperator", 2, ["Sin", "t"]],
      multiplyNode(numberNode(2), functionNode("sin", t)),
    ],
    [
      ["InvisibleOperator", "y", ["Delimiter", ["Subtract", 1, "y"]]],
      multiplyNode(y, addNode(numberNode(1), negateNode(y))),
    ],
    [
      [
        "InvisibleOperator",
        ["Delimiter", ["Add", "t", 1]],
        ["Delimiter", ["Subtract", "y", 1]],
      ],
      multiplyNode(
        addNode(t, numberNode(1)),
        addNode(y, negateNode(numberNode(1)))
      ),
    ],
  ])("preserves required tree shape %#", (raw, expected) => {
    expect(convertRawMathJson(raw, "rhs")).toEqual(expected);
  });

  it("normalizes explicit and implicit multiplication to the same project shape", () => {
    expect(convertRawMathJson(["Multiply", 2, "t"], "rhs")).toEqual(
      convertRawMathJson(["InvisibleOperator", 2, "t"], "rhs")
    );
  });
});

describe("raw exponential ownership", () => {
  it("maps pinned visual and Exp heads to the project exp node", () => {
    const visual = convertRawMathJson(["Power", "e", "t"], "rhs");
    const explicitConstant = convertRawMathJson(
      ["Power", "ExponentialE", "t"],
      "rhs"
    );
    const expHead = convertRawMathJson(["Exp", "t"], "rhs");

    expect(visual).toEqual(functionNode("exp", t));
    expect(explicitConstant).toEqual(visual);
    expect(expHead).toEqual(visual);
    expect(serializeMathAst(expHead)).toBe(serializeMathAst(visual));
  });

  it("keeps standalone e and general powers distinct", () => {
    expect(convertRawMathJson("e", "rhs")).toEqual(constantNode("e"));
    expect(convertRawMathJson(["Power", 2, "t"], "rhs")).toEqual(
      powerNode(numberNode(2), t)
    );
  });

  it("does not treat a grouped e base as the exact visual exponential fixture", () => {
    expect(
      convertRawMathJson(["Power", ["Delimiter", "e"], "t"], "rhs")
    ).toEqual(powerNode(constantNode("e"), t));
  });

  it("does not mutate directly constructed Phase 1 power(e,t)", () => {
    const power = powerNode(constantNode("e"), t);
    expect(canonicalizeMathAst(power)).toEqual(power);
    expect(canonicalizeMathAst(power)).not.toEqual(functionNode("exp", t));
  });
});

describe("raw profile enforcement", () => {
  it.each([
    ["rhs", ["t", "y"], ["u", "t_0", "y_0", "x"]],
    ["exact_solution", ["t", "t_0", "y_0"], ["y", "u", "x"]],
    ["second_order_rhs", ["t", "u"], ["y", "t_0", "y_0", "x"]],
  ] as const)("enforces %s", (profile, accepted, rejected) => {
    for (const raw of accepted) {
      expect(() => convertRawMathJson(raw, profile)).not.toThrow();
    }
    for (const raw of rejected) {
      expect(["unknown_variable", "variable_not_allowed"]).toContain(
        captureError(raw, profile).code
      );
    }
  });
});

describe("strict raw rejection", () => {
  it.each([
    null,
    undefined,
    true,
    {},
    { fn: ["Sin", "t"] },
    [],
    [1, "t"],
    ["Negate"],
    ["Negate", "t", "y"],
    ["Add", "t"],
    ["Subtract", "t"],
    ["Divide", 1, "t", "y"],
    ["Power", "t"],
    ["Sin", "t", "y"],
  ])("rejects malformed value %#", (raw) => {
    expect(captureError(raw).code).toBe("invalid_math_json");
  });

  it.each([
    "Assign",
    "Equal",
    "Less",
    "Matrix",
    "Vector",
    "List",
    "Piecewise",
    "Complex",
    "Derivative",
    "Integrate",
    "Sum",
    "Product",
    "Random",
    "Square",
    "toString",
    "__proto__",
  ])("rejects unsupported head %s", (head) => {
    const error = captureError([head, "t", "y"]);
    expect(error.code).toBe("invalid_math_json");
    expect(error.message).toContain(head);
  });

  it.each([NaN, Infinity, -Infinity])("rejects non-finite number %s", (raw) => {
    expect(captureError(raw).code).toBe("invalid_number");
  });

  it("rejects metadata-bearing and sparse arrays", () => {
    const metadata = ["Sin", "t"] as unknown[] & { metadata?: unknown };
    metadata.metadata = { source: "untrusted" };
    const sparse = new Array(2);
    sparse[0] = "Sin";

    expect(captureError(metadata).code).toBe("invalid_math_json");
    expect(captureError(sparse).code).toBe("invalid_math_json");
  });

  it("rejects cyclic raw arrays", () => {
    const cyclic: unknown[] = ["Negate"];
    cyclic.push(cyclic);
    expect(captureError(cyclic).code).toBe("invalid_math_json");
  });

  it.each([
    { raw: ["Error", "missing"] },
    { raw: ["Error", "unexpected-delimiter", ["LatexString", "("]] },
    { raw: ["Divide", 1, ["Error", "missing"]] },
  ])("classifies explicit incomplete node $raw", ({ raw }) => {
    expect(captureError(raw).code).toBe("incomplete_expression");
  });

  it("cannot recover an exponent placeholder already absent from MathJSON", () => {
    expect(convertRawMathJson("t", "rhs")).toEqual(t);
    expect(parseLatexToRawMathJson("t^{}")).toBe("t");
  });
});

describe("MathExpression from raw input", () => {
  it("retains LaTeX only as display data and derives authoritative fields", () => {
    const expression = createMathExpressionFromRawMathJson(
      "2t",
      ["InvisibleOperator", 2, "t"],
      "rhs"
    );

    expect(expression).toEqual({
      latex: "2t",
      canonicalAst: multiplyNode(numberNode(2), t),
      displayText: "2 times t",
    });
    expect(Object.keys(expression)).toEqual(["latex", "canonicalAst", "displayText"]);
  });

  it("creates an expression through the thin pinned LaTeX parser", () => {
    expect(createMathExpressionFromLatex("e^t", "rhs").canonicalAst).toEqual(
      functionNode("exp", t)
    );
  });
});
