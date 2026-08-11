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

describe("MathAst constructors", () => {
  it("constructs every closed AST node kind", () => {
    const t = variableNode("t");
    const nodes: MathAst[] = [
      numberNode(2),
      constantNode("e"),
      t,
      negateNode(t),
      addNode(t, numberNode(1)),
      multiplyNode(numberNode(2), t),
      divideNode(numberNode(1), t),
      powerNode(t, numberNode(2)),
      functionNode("sin", t),
    ];

    expect(nodes.map((node) => node.kind)).toEqual([
      "number",
      "constant",
      "variable",
      "negate",
      "add",
      "multiply",
      "divide",
      "power",
      "function",
    ]);
  });

  it("defines all three approved profiles", () => {
    const profiles: MathVariableProfile[] = [
      "rhs",
      "exact_solution",
      "second_order_rhs",
    ];

    expect(profiles).toHaveLength(3);
  });
});
