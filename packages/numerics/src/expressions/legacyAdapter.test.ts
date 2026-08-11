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
} from "./ast";
import { serializeMathAst } from "./canonical";
import { MathExpressionError } from "./errors";
import {
  createMathExpressionFromLegacy,
  parseLegacyExpression,
  tokenizeLegacyExpression,
} from "./legacyAdapter";

function captureError(source: string, profile: MathVariableProfile = "rhs") {
  try {
    parseLegacyExpression(source, profile);
    throw new Error("Expected legacy parsing to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(MathExpressionError);
    return error as MathExpressionError;
  }
}

const t = variableNode("t");
const y = variableNode("y");

describe("legacy tokenizer", () => {
  it.each([
    ["0", 0],
    ["1.25", 1.25],
    [".5", 0.5],
    ["1.", 1],
    ["1e3", 1000],
    ["2.5E-2", 0.025],
  ])("tokenizes finite number %s", (source, expected) => {
    const token = tokenizeLegacyExpression(source)[0]!;
    expect(token.kind).toBe("number");
    expect(token.numericValue).toBe(expected);
  });

  it("tracks deterministic token positions", () => {
    expect(
      tokenizeLegacyExpression("  Math.sin(t) - 0.1*y").map((token) => [
        token.kind,
        token.position,
      ])
    ).toEqual([
      ["identifier", 2],
      ["left_paren", 10],
      ["identifier", 11],
      ["right_paren", 12],
      ["minus", 14],
      ["number", 16],
      ["star", 19],
      ["identifier", 20],
      ["eof", 21],
    ]);
  });

  it.each(["1e", "1e+", "1e-"])("rejects incomplete scientific notation %s", (source) => {
    expect(captureError(source).code).toBe("invalid_legacy_expression");
  });

  it.each(["1e999", "9.9e9999"])("rejects non-finite literal %s", (source) => {
    expect(captureError(source).code).toBe("invalid_number");
  });
});

describe("legacy approved grammar", () => {
  it.each<[string, MathAst]>([
    ["2", numberNode(2)],
    ["t", t],
    ["e", constantNode("e")],
    ["pi", constantNode("pi")],
    ["Math.PI", constantNode("pi")],
    ["-y", negateNode(y)],
    ["+y", y],
    ["t+y", addNode(t, y)],
    ["t-y", addNode(t, negateNode(y))],
    ["2*y", multiplyNode(numberNode(2), y)],
    ["t/2", divideNode(t, numberNode(2))],
    ["t^2", powerNode(t, numberNode(2))],
  ])("parses %s", (source, expected) => {
    expect(parseLegacyExpression(source, "rhs")).toEqual(expected);
  });

  it.each([
    ["exp", "exp"],
    ["sin", "sin"],
    ["cos", "cos"],
    ["tan", "tan"],
    ["sqrt", "sqrt"],
    ["log", "log"],
    ["ln", "log"],
    ["abs", "abs"],
  ] as const)("parses approved function %s", (source, expected) => {
    expect(parseLegacyExpression(`${source}(t)`, "rhs")).toEqual(
      functionNode(expected, t)
    );
  });

  it("accepts only the exact approved Math function aliases", () => {
    expect(parseLegacyExpression("Math.exp(t)", "rhs")).toEqual(
      functionNode("exp", t)
    );
    expect(parseLegacyExpression("Math.sin(t)", "rhs")).toEqual(
      functionNode("sin", t)
    );
    expect(captureError("Math.cos(t)").code).toBe("invalid_legacy_expression");
    expect(captureError("Math.sqrt(t)").code).toBe("invalid_legacy_expression");
    expect(captureError("Math.random()").code).toBe("invalid_legacy_expression");
  });

  it("parses all current repository expression examples", () => {
    expect(parseLegacyExpression("-y", "rhs")).toEqual(negateNode(y));
    expect(parseLegacyExpression("t-y", "rhs")).toEqual(addNode(t, negateNode(y)));
    expect(parseLegacyExpression("Math.sin(t)-0.1*y", "rhs")).toEqual(
      addNode(
        functionNode("sin", t),
        negateNode(multiplyNode(numberNode(0.1), y))
      )
    );
    expect(parseLegacyExpression("-u", "second_order_rhs")).toEqual(
      negateNode(variableNode("u"))
    );
  });

  it("parses the future exact-solution compatibility example", () => {
    expect(
      parseLegacyExpression("y0 * exp(-(t - t0))", "exact_solution")
    ).toEqual(
      multiplyNode(
        variableNode("y0"),
        functionNode(
          "exp",
          negateNode(addNode(t, negateNode(variableNode("t0"))))
        )
      )
    );
  });
});

describe("legacy precedence and associativity", () => {
  it("makes exponentiation right-associative", () => {
    expect(parseLegacyExpression("t^2^3", "rhs")).toEqual(
      powerNode(t, powerNode(numberNode(2), numberNode(3)))
    );
  });

  it("binds exponentiation more tightly than unary minus", () => {
    expect(parseLegacyExpression("-t^2", "rhs")).toEqual(
      negateNode(powerNode(t, numberNode(2)))
    );
    expect(parseLegacyExpression("(-t)^2", "rhs")).toEqual(
      powerNode(negateNode(t), numberNode(2))
    );
  });

  it("supports a unary exponent while retaining right association", () => {
    expect(parseLegacyExpression("t^-2", "rhs")).toEqual(
      powerNode(t, negateNode(numberNode(2)))
    );
  });

  it("applies multiplication before addition", () => {
    expect(parseLegacyExpression("t+2*y", "rhs")).toEqual(
      addNode(t, multiplyNode(numberNode(2), y))
    );
    expect(parseLegacyExpression("(t+2)*y", "rhs")).toEqual(
      multiplyNode(addNode(t, numberNode(2)), y)
    );
  });

  it("keeps addition, subtraction, multiplication, and division left-associated", () => {
    expect(parseLegacyExpression("t+y+1", "rhs")).toEqual(
      addNode(addNode(t, y), numberNode(1))
    );
    expect(parseLegacyExpression("t-y-1", "rhs")).toEqual(
      addNode(addNode(t, negateNode(y)), negateNode(numberNode(1)))
    );
    expect(parseLegacyExpression("2*3*t", "rhs")).toEqual(
      multiplyNode(multiplyNode(numberNode(2), numberNode(3)), t)
    );
    expect(parseLegacyExpression("t/2/3", "rhs")).toEqual(
      divideNode(divideNode(t, numberNode(2)), numberNode(3))
    );
  });
});

describe("legacy implicit multiplication boundary", () => {
  it.each<[string, MathAst]>([
    ["2t", multiplyNode(numberNode(2), t)],
    ["2 sin(t)", multiplyNode(numberNode(2), functionNode("sin", t))],
    ["2(t+1)", multiplyNode(numberNode(2), addNode(t, numberNode(1)))],
    ["y(1-y)", multiplyNode(y, addNode(numberNode(1), negateNode(y)))],
    [
      "(t+1)(y-1)",
      multiplyNode(
        addNode(t, numberNode(1)),
        addNode(y, negateNode(numberNode(1)))
      ),
    ],
  ])("accepts only approved form %s", (source, expected) => {
    expect(parseLegacyExpression(source, "rhs")).toEqual(expected);
  });

  it.each(["ty", "xya", "t y", "2ty", "sin", "t(y)(t)"])(
    "rejects ambiguous implicit form %s",
    (source) => {
      expect(() => parseLegacyExpression(source, "rhs")).toThrowError(
        MathExpressionError
      );
    }
  );
});

describe("legacy profile enforcement", () => {
  it.each([
    ["rhs", ["t", "y"], ["u", "t0", "y0", "x"]],
    ["exact_solution", ["t", "t0", "y0"], ["y", "u", "x"]],
    ["second_order_rhs", ["t", "u"], ["y", "t0", "y0", "x"]],
  ] as const)("enforces %s through shared validation", (profile, accepted, rejected) => {
    for (const source of accepted) {
      expect(() => parseLegacyExpression(source, profile)).not.toThrow();
    }
    for (const source of rejected) {
      expect(["unknown_variable", "variable_not_allowed"]).toContain(
        captureError(source, profile).code
      );
    }
  });
});

describe("legacy security rejection", () => {
  it.each([
    "t=1",
    "t;1",
    "t?y:1",
    "[t]",
    "{t}",
    "'t'",
    '"t"',
    "`t`",
    "t,y",
    "obj.value",
    "obj[value]",
    "Math.random()",
    "window.alert(1)",
    "globalThis.Math.exp(t)",
    "document.body",
    "constructor.constructor(1)",
    "prototype.value",
    "__proto__.value",
    "toString(t)",
    "__proto__(t)",
    "t=>t",
    "function(t)",
    "t++",
    "t--",
    "t&&y",
    "t||y",
    "t<y",
    "t==y",
    "t&y",
    "t|y",
    "t%y",
    "t**2",
    "t//comment",
    "t/*comment*/",
    "sin(t) trailing",
    "sin(t,y)",
  ])("rejects unsupported or malicious text %s", (source) => {
    const error = captureError(source);
    expect([
      "invalid_legacy_expression",
      "unexpected_token",
      "unknown_variable",
    ]).toContain(error.code);
    expect(error.details.adapter === "legacy" || error.details.profile === "rhs").toBe(
      true
    );
  });

  it("requires full token consumption", () => {
    const error = captureError("sin(t) 2");
    expect(error.code).toBe("unexpected_token");
    expect(error.message).toContain("trailing");
  });

  it("never executes rejected source", () => {
    const marker = { called: false };
    (globalThis as { phaseTwoMarker?: typeof marker }).phaseTwoMarker = marker;
    expect(() => parseLegacyExpression("globalThis.phaseTwoMarker.called=true", "rhs")).toThrow();
    expect(marker.called).toBe(false);
    delete (globalThis as { phaseTwoMarker?: typeof marker }).phaseTwoMarker;
  });
});

describe("legacy exponential and MathExpression normalization", () => {
  it("maps exp and Math.exp to one canonical exp node", () => {
    const plain = parseLegacyExpression("exp(t)", "rhs");
    const alias = parseLegacyExpression("Math.exp(t)", "rhs");
    expect(plain).toEqual(functionNode("exp", t));
    expect(alias).toEqual(plain);
    expect(serializeMathAst(alias)).toBe(serializeMathAst(plain));
  });

  it("keeps standalone e and general powers distinct", () => {
    expect(parseLegacyExpression("e", "rhs")).toEqual(constantNode("e"));
    expect(parseLegacyExpression("2^t", "rhs")).toEqual(powerNode(numberNode(2), t));
  });

  it("normalizes imported source to textbook LaTeX without retaining code syntax", () => {
    const expression = createMathExpressionFromLegacy("Math.exp(-t)", "rhs");
    expect(expression.latex).toBe("e^{-t}");
    expect(expression.canonicalAst).toEqual(functionNode("exp", negateNode(t)));
    expect(expression.displayText).toBe("e raised to the quantity negative t");
    expect(JSON.stringify(expression)).not.toContain("Math.exp");
  });
});
