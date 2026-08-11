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
  type MathVariableName,
  type MathVariableProfile,
} from "./ast";
import { MathExpressionError } from "./errors";
import { allowedVariablesForProfile, isMathAst, validateMathAst } from "./validation";

function captureError(value: unknown, profile?: MathVariableProfile): MathExpressionError {
  try {
    validateMathAst(value, profile);
    throw new Error("Expected validation to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(MathExpressionError);
    return error as MathExpressionError;
  }
}

describe("AST structural validation", () => {
  it("accepts every valid node kind in a nested tree", () => {
    const tree = addNode(
      negateNode(variableNode("y")),
      multiplyNode(
        numberNode(2),
        functionNode(
          "sin",
          divideNode(powerNode(variableNode("t"), numberNode(2)), constantNode("pi"))
        )
      )
    );

    expect(() => validateMathAst(tree, "rhs")).not.toThrow();
    expect(isMathAst(tree, "rhs")).toBe(true);
  });

  it.each([NaN, Infinity, -Infinity])("rejects non-finite literal %s", (value) => {
    const error = captureError({ kind: "number", value });
    expect(error.code).toBe("invalid_number");
  });

  it("rejects empty addition and multiplication", () => {
    expect(captureError({ kind: "add", terms: [] }).code).toBe("empty_addition");
    expect(captureError({ kind: "multiply", factors: [] }).code).toBe(
      "empty_multiplication"
    );
  });

  it.each([
    null,
    [],
    2,
    { terms: [] },
    { kind: "unknown" },
    { kind: "number", value: 1, source: "untrusted" },
    { kind: "divide", numerator: numberNode(1) },
  ])("rejects malformed runtime AST value %#", (value) => {
    expect(captureError(value).code).toBe("invalid_ast");
    expect(isMathAst(value)).toBe(false);
  });

  it("rejects non-plain nodes and accessor fields", () => {
    class AstLike {
      kind = "number";
      value = 1;
    }
    const accessor = { kind: "number" } as Record<string, unknown>;
    Object.defineProperty(accessor, "value", {
      enumerable: true,
      get: () => 1,
    });

    expect(captureError(new AstLike()).code).toBe("invalid_ast");
    expect(captureError(accessor).code).toBe("invalid_ast");
  });

  it("rejects unsupported constant and function names", () => {
    expect(captureError({ kind: "constant", name: "tau" }).code).toBe(
      "unsupported_constant"
    );
    expect(
      captureError({ kind: "function", name: "random", argument: numberNode(1) }).code
    ).toBe("unsupported_function");
  });

  it("detects cycles while permitting shared acyclic subtrees", () => {
    const cyclic: { kind: string; operand?: unknown } = { kind: "negate" };
    cyclic.operand = cyclic;
    const error = captureError(cyclic);
    const shared = addNode(variableNode("t"), variableNode("t"));

    expect(error.code).toBe("invalid_ast");
    expect(error.message).toContain("cyclic");
    expect(() => validateMathAst(shared, "rhs")).not.toThrow();
  });
});

const PROFILE_CASES: Array<{
  profile: MathVariableProfile;
  accepted: MathVariableName[];
  rejected: string[];
}> = [
  { profile: "rhs", accepted: ["t", "y"], rejected: ["t0", "y0", "u", "x"] },
  {
    profile: "exact_solution",
    accepted: ["t", "t0", "y0"],
    rejected: ["y", "u", "x"],
  },
  {
    profile: "second_order_rhs",
    accepted: ["t", "u"],
    rejected: ["y", "t0", "y0", "x"],
  },
];

describe("variable profiles", () => {
  it.each(PROFILE_CASES)("accepts only $profile variables", ({ profile, accepted }) => {
    for (const name of accepted) {
      expect(() => validateMathAst(variableNode(name), profile)).not.toThrow();
    }
    expect([...allowedVariablesForProfile(profile)]).toEqual(accepted);
  });

  it.each(PROFILE_CASES)("rejects disallowed $profile variables", ({ profile, rejected }) => {
    for (const name of rejected) {
      const error = captureError({ kind: "variable", name }, profile);
      expect(["unknown_variable", "variable_not_allowed"]).toContain(error.code);
      expect(error.details).toMatchObject({ profile, variable: name });
    }
  });

  it("uses RHS-specific English copy", () => {
    expect(captureError({ kind: "variable", name: "x" }, "rhs").message).toBe(
      "Unknown variable x. Use only t and y in the ODE right-hand side."
    );
  });

  it("uses exact-solution-specific English copy with spoken subscripts", () => {
    expect(captureError(variableNode("y"), "exact_solution").message).toBe(
      "Variable y is not available in an exact solution. Use only t, t₀, and y₀."
    );
  });

  it("uses Leap-Frog-specific English copy", () => {
    expect(captureError(variableNode("y"), "second_order_rhs").message).toBe(
      "Unknown variable y. Use only t and u in the Leap-Frog acceleration."
    );
  });

  it("does not trust a compile-time MathAst assertion", () => {
    const malformed = { kind: "number", value: "1" } as unknown as MathAst;
    expect(captureError(malformed).code).toBe("invalid_number");
  });
});
