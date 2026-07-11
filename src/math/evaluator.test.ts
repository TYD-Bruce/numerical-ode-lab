import { afterEach, describe, expect, it, vi } from "vitest";

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
} from "./ast";
import { MathExpressionError } from "./errors";
import { compileMathAst } from "./evaluator";

afterEach(() => {
  vi.restoreAllMocks();
});
function thrownError(run: () => number): MathExpressionError {
  try {
    run();
    throw new Error("Expected evaluation to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(MathExpressionError);
    return error as MathExpressionError;
  }
}

describe("profile-safe compiled evaluators", () => {
  it("evaluates an rhs closure with t and y", () => {
    const evaluate = compileMathAst(addNode(variableNode("t"), variableNode("y")), "rhs");
    expect(evaluate(2, 3)).toBe(5);
  });

  it("evaluates the future exact-solution profile without exposing UI", () => {
    const ast = multiplyNode(
      variableNode("y0"),
      functionNode(
        "exp",
        negateNode(addNode(variableNode("t"), negateNode(variableNode("t0"))))
      )
    );
    const evaluate = compileMathAst(ast, "exact_solution");
    expect(evaluate(2, 1, 4)).toBe(4 * Math.exp(-1));
  });

  it("evaluates the existing Leap-Frog acceleration profile with t and u", () => {
    const evaluate = compileMathAst(
      addNode(negateNode(variableNode("u")), functionNode("sin", variableNode("t"))),
      "second_order_rhs"
    );
    expect(evaluate(Math.PI / 2, 3)).toBe(-2);
  });

  it("validates the profile before producing a closure", () => {
    expect(() => compileMathAst(variableNode("u"), "rhs")).toThrowError(
      MathExpressionError
    );
  });
});

describe("numeric operations", () => {
  it.each<[MathAst, number]>([
    [numberNode(3), 3],
    [constantNode("e"), Math.E],
    [constantNode("pi"), Math.PI],
    [negateNode(numberNode(3)), -3],
    [addNode(numberNode(1), numberNode(2), numberNode(3)), 6],
    [multiplyNode(numberNode(2), numberNode(3), numberNode(4)), 24],
    [divideNode(numberNode(1), numberNode(4)), 0.25],
    [powerNode(numberNode(2), numberNode(3)), 8],
  ])("evaluates operation %#", (ast, expected) => {
    expect(compileMathAst(ast, "rhs")(0, 0)).toBe(expected);
  });

  it.each<["sin" | "cos" | "tan" | "sqrt" | "log" | "abs", number, number]>([
    ["sin", 0.5, Math.sin(0.5)],
    ["cos", 0.5, Math.cos(0.5)],
    ["tan", 0.5, Math.tan(0.5)],
    ["sqrt", 9, 3],
    ["log", Math.E, 1],
    ["abs", -4, 4],
  ])("evaluates %s with native number semantics", (name, input, expected) => {
    expect(compileMathAst(functionNode(name, numberNode(input)), "rhs")(0, 0)).toBe(
      expected
    );
  });

  it("evaluates exp through Math.exp, not a power-of-e rewrite", () => {
    const originalExp = Math.exp;
    const spy = vi.spyOn(Math, "exp").mockImplementation((value) => originalExp(value));
    const evaluate = compileMathAst(functionNode("exp", variableNode("t")), "rhs");

    expect(evaluate(0.1, 0)).toBe(originalExp(0.1));
    expect(spy).toHaveBeenCalledWith(0.1);
  });

  it("keeps standalone e and general power evaluation distinct", () => {
    const powSpy = vi.spyOn(Math, "pow");
    expect(compileMathAst(constantNode("e"), "rhs")(0, 0)).toBe(Math.E);
    expect(compileMathAst(powerNode(numberNode(3), numberNode(2)), "rhs")(0, 0)).toBe(9);
    expect(powSpy).toHaveBeenCalledWith(3, 2);
  });

  it("preserves nested addition grouping and JavaScript rounding", () => {
    const left = addNode(addNode(numberNode(1e16), numberNode(-1e16)), numberNode(1));
    const right = addNode(numberNode(1e16), addNode(numberNode(-1e16), numberNode(1)));

    expect(compileMathAst(left, "rhs")(0, 0)).toBe(1);
    expect(compileMathAst(right, "rhs")(0, 0)).toBe(0);
  });

  it("evaluates children left to right and reports the first failure", () => {
    const divisionFirst = addNode(
      divideNode(numberNode(1), numberNode(0)),
      functionNode("sqrt", numberNode(-1))
    );
    const rootFirst = addNode(
      functionNode("sqrt", numberNode(-1)),
      divideNode(numberNode(1), numberNode(0))
    );

    expect(thrownError(() => compileMathAst(divisionFirst, "rhs")(2, 0)).code).toBe(
      "division_by_zero"
    );
    expect(thrownError(() => compileMathAst(rootFirst, "rhs")(2, 0)).code).toBe(
      "square_root_domain"
    );
  });
});

describe("controlled domain and finite-result errors", () => {
  it.each([0, -0])("rejects division by denominator %s", (denominator) => {
    const evaluate = compileMathAst(
      divideNode(numberNode(1), numberNode(denominator)),
      "rhs"
    );
    const error = thrownError(() => evaluate(3, 0));

    expect(error.code).toBe("division_by_zero");
    expect(error.details).toMatchObject({
      operation: "division",
      operands: [1, denominator],
      inputs: { t: 3, y: 0 },
    });
    expect(error.message).toContain("at t = 3");
  });

  it("rejects square root of a negative real", () => {
    const error = thrownError(() =>
      compileMathAst(functionNode("sqrt", numberNode(-1)), "rhs")(0, 0)
    );
    expect(error.code).toBe("square_root_domain");
  });

  it.each([0, -1])("rejects natural logarithm input %s", (input) => {
    const error = thrownError(() =>
      compileMathAst(functionNode("log", numberNode(input)), "rhs")(0, 0)
    );
    expect(error.code).toBe("logarithm_domain");
  });

  it("rejects a non-real JavaScript power result", () => {
    const error = thrownError(() =>
      compileMathAst(powerNode(numberNode(-1), numberNode(0.5)), "rhs")(0, 0)
    );
    expect(error.code).toBe("power_domain");
    expect(error.details.operands).toEqual([-1, 0.5]);
  });

  it.each([
    functionNode("exp", numberNode(1000)),
    multiplyNode(numberNode(Number.MAX_VALUE), numberNode(2)),
    addNode(numberNode(Number.MAX_VALUE), numberNode(Number.MAX_VALUE)),
    powerNode(numberNode(Number.MAX_VALUE), numberNode(2)),
    divideNode(numberNode(Number.MAX_VALUE), numberNode(Number.MIN_VALUE)),
  ])("reports overflow without returning infinity", (ast) => {
    const error = thrownError(() => compileMathAst(ast, "rhs")(0, 0));
    expect(error.code).toBe("numeric_overflow");
  });

  it("reports a non-finite tangent result with its dedicated code", () => {
    vi.spyOn(Math, "tan").mockReturnValue(Infinity);
    const error = thrownError(() =>
      compileMathAst(functionNode("tan", numberNode(1)), "rhs")(0, 0)
    );
    expect(error.code).toBe("tangent_non_finite");
  });

  it("reports unexpected NaN from a native function without returning it", () => {
    vi.spyOn(Math, "sin").mockReturnValue(NaN);
    const error = thrownError(() =>
      compileMathAst(functionNode("sin", numberNode(1)), "rhs")(0, 0)
    );
    expect(error.code).toBe("non_finite_result");
  });

  it.each([NaN, Infinity, -Infinity])("rejects non-finite rhs input %s", (input) => {
    const evaluate = compileMathAst(addNode(variableNode("t"), variableNode("y")), "rhs");
    const error = thrownError(() => evaluate(input, 1));
    expect(error.code).toBe("non_finite_input");
    expect(error.details.variable).toBe("t");
  });

  it("rejects non-finite inputs in exact and second-order profiles", () => {
    const exact = compileMathAst(variableNode("y0"), "exact_solution");
    const second = compileMathAst(variableNode("u"), "second_order_rhs");

    expect(thrownError(() => exact(0, 0, Infinity)).code).toBe("non_finite_input");
    expect(thrownError(() => second(0, NaN)).code).toBe("non_finite_input");
  });

  it("allows exponential underflow to finite zero", () => {
    expect(compileMathAst(functionNode("exp", numberNode(-1000)), "rhs")(0, 0)).toBe(0);
  });
});
