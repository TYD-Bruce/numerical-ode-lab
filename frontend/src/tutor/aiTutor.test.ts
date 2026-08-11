import { afterEach, describe, expect, it, vi } from "vitest";

import { buildOdeLabContext, sanitizeTutorText, type ProblemInputs } from "./aiTutor";
import type { TutorConvergenceStudy } from "@numerical-t-lab/contracts/tutor";
import { integrateFirstOrder } from "@numerical-t-lab/numerics/ode/solvers";
import { sendTutorMessage } from "./tutorClient";

afterEach(() => vi.unstubAllGlobals());

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

describe("AI tutor controlled math text", () => {
  it("preserves controlled delimiters while retaining legacy notation cleanup", () => {
    expect(sanitizeTutorText("Order \\(p=\\alpha_j\\).\n\\[E=h^p\\]"))
      .toBe("Order \\(p=αⱼ\\).\n\\[E=h^p\\]");
  });
});

describe("AI tutor convergence context", () => {
  it("adds the supplied serializable DTO without changing existing run context", () => {
    const result = integrateFirstOrder(
      { family: "forward_euler" },
      { t0: 0, y0: 1, tEnd: 0.2, h: 0.1, f: (_t, y) => -y }
    );
    const study: TutorConvergenceStudy = {
      theoreticalOrder: 1,
      interpretation: {
        kind: "consistent_with_theory",
        title: "Consistent with theory",
        explanation: "Orders are stable.",
        primaryObservedOrder: 0.99,
        evidencePairs: [[0, 1]],
      },
      levels: [{ level: 0, h: 0.1, finalTimeError: 0.01, maximumGlobalError: 0.02 }],
      consistencyCheck: {
        status: "passed",
        statement: "This is a numerical consistency check, not a formal proof.",
      },
    };

    expect(buildOdeLabContext(result, PROBLEM).convergenceStudy).toBeUndefined();
    const context = buildOdeLabContext(result, PROBLEM, study);
    expect(context.convergenceStudy).toEqual(study);
    expect(() => JSON.stringify(context)).not.toThrow();
  });
});

describe("Tutor client request cancellation", () => {
  it("passes the owned AbortSignal to the absolute API request", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ message: "Answer" }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    const result = integrateFirstOrder(
      { family: "forward_euler" },
      { t0: 0, y0: 1, tEnd: 0.2, h: 0.1, f: (_t, y) => -y }
    );

    await sendTutorMessage(
      {
        messages: [{ role: "user", content: "Explain" }],
        context: buildOdeLabContext(result, PROBLEM),
      },
      controller.signal
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ signal: controller.signal })
    );
  });
});
