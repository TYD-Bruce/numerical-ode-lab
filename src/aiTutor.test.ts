import { describe, expect, it } from "vitest";

import { buildOdeLabContext, type ProblemInputs } from "./aiTutor";
import { integrateFirstOrder } from "./solvers";

const PROBLEM: ProblemInputs = {
  kind: "first_order",
  equationDisplay: "y′ = -y",
  t0: 0,
  tEnd: 0.2,
  h: 0.1,
  y0: 1,
};

describe("AI tutor implicit diagnostics context", () => {
  it("copies actual diagnostics exactly without sharing mutable metadata", () => {
    const result = integrateFirstOrder(
      { family: "backward_euler" },
      { t0: 0, y0: 1, tEnd: 0.2, h: 0.1, f: (_t, y) => -y }
    );
    const original = { ...result.metadata.implicitDiagnostics! };

    const context = buildOdeLabContext(result, PROBLEM);

    expect(context.method.implicitDiagnostics).toEqual(original);
    expect(context.method.implicitDiagnostics).not.toBe(
      result.metadata.implicitDiagnostics
    );
    context.method.implicitDiagnostics!.totalIterations = 999;
    expect(result.metadata.implicitDiagnostics).toEqual(original);
  });

  it("omits diagnostics when the result metadata does not contain them", () => {
    const result = integrateFirstOrder(
      { family: "forward_euler" },
      { t0: 0, y0: 1, tEnd: 0.2, h: 0.1, f: (_t, y) => -y }
    );

    const context = buildOdeLabContext(result, PROBLEM);

    expect(context.method).not.toHaveProperty("implicitDiagnostics");
  });
});
