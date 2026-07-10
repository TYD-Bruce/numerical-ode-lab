import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { handleChatRequest } from "./chatHandler";

const NEWTON_DIAGNOSTICS = {
  nonlinearMethod: "newton",
  totalIterations: 37,
  maxIterationsPerStep: 6,
  finalResidual: 2.5e-13,
  maxResidual: 8.2e-11,
  failedSteps: 0,
};

const FIXED_POINT_DIAGNOSTICS = {
  ...NEWTON_DIAGNOSTICS,
  nonlinearMethod: "fixed_point",
};

type ContextKind = "newton" | "fixed_point" | "implicit_no_diagnostics" | "explicit";

function context(kind: ContextKind = "newton"): Record<string, unknown> {
  if (kind === "explicit") {
    return {
      problem: { equationDisplay: "y′ = -1000y", t0: 0, tEnd: 1, h: 0.1 },
      method: {
        displayName: "Forward Euler",
        family: "forward_euler",
        order: 1,
        isImplicit: false,
      },
      result: { finalT: 1, finalY: 0.001, pointCount: 11 },
    };
  }

  const diagnostics =
    kind === "newton"
      ? NEWTON_DIAGNOSTICS
      : kind === "fixed_point"
        ? FIXED_POINT_DIAGNOSTICS
        : undefined;

  return {
    problem: { equationDisplay: "y′ = -1000y", t0: 0, tEnd: 1, h: 0.1 },
    method: {
      displayName: "Backward Euler",
      family: "backward_euler",
      order: 1,
      isImplicit: true,
      ...(diagnostics ? { implicitDiagnostics: diagnostics } : {}),
    },
    result: { finalT: 1, finalY: 0.001, pointCount: 11 },
  };
}

async function ask(
  message: string,
  kind: ContextKind = "newton"
): Promise<string> {
  const response = await handleChatRequest({
    messages: [{ role: "user", content: message }],
    context: context(kind),
  });
  expect(response.status).toBe(200);
  expect(response.body.demoMode).toBe(true);
  return String(response.body.message);
}

describe("mock tutor implicit diagnostics", () => {
  const previousMock = process.env.AI_TUTOR_MOCK;

  beforeEach(() => {
    process.env.AI_TUTOR_MOCK = "true";
  });

  afterEach(() => {
    if (previousMock === undefined) delete process.env.AI_TUTOR_MOCK;
    else process.env.AI_TUTOR_MOCK = previousMock;
  });

  it("answers iteration and residual questions from supplied diagnostics", async () => {
    const iterations = await ask("How many Newton iterations were used?");
    const residual = await ask("What does the residual mean?");

    expect(iterations).toContain("37");
    expect(iterations).toContain("6");
    expect(iterations).toContain("Demo mode");
    expect(residual).toContain("2.500e-13");
    expect(residual).toContain("8.200e-11");
    expect(residual.toLowerCase()).toContain("algebraic mismatch");
  });

  it("distinguishes nonlinear convergence evidence from scheme stability", async () => {
    const answer = await ask("Was this method unstable?");

    expect(answer.toLowerCase()).toContain("nonlinear-solver convergence");
    expect(answer.toLowerCase()).toContain("absolute stability");
    expect(answer).toContain("0 failed steps");
    expect(answer.toLowerCase()).not.toContain("the method was unstable");
  });

  it("does not invent diagnostics when they are absent", async () => {
    const answer = await ask(
      "Explain the implicit solve diagnostics.",
      "explicit"
    );

    expect(answer).toContain("did not expose an implicit nonlinear solve");
    expect(answer).not.toContain("37");
    expect(answer).not.toContain("2.500e-13");
    expect(answer).toContain("Demo mode");
  });

  it("does not treat explicit-method stability questions as missing diagnostics", async () => {
    const answer = await ask("Was this method unstable?", "explicit");

    expect(answer).not.toContain("did not expose an implicit nonlinear solve");
    expect(answer).not.toContain("37");
    expect(answer.toLowerCase()).not.toContain("the method was unstable");
    expect(answer).toContain("Demo mode");
  });
});

describe("mock tutor step-by-step nonlinear wording", () => {
  const previousMock = process.env.AI_TUTOR_MOCK;

  beforeEach(() => {
    process.env.AI_TUTOR_MOCK = "true";
  });

  afterEach(() => {
    if (previousMock === undefined) delete process.env.AI_TUTOR_MOCK;
    else process.env.AI_TUTOR_MOCK = previousMock;
  });

  it("mentions Newton when diagnostics report newton", async () => {
    const answer = await ask("Explain this method step by step.", "newton");

    expect(answer).toContain("G(u) = 0");
    expect(answer).toContain("Newton iteration");
    expect(answer.toLowerCase()).not.toContain("fixed-point");
    expect(answer.toLowerCase()).not.toContain("fixed point");
  });

  it("mentions fixed-point when diagnostics report fixed_point", async () => {
    const answer = await ask(
      "Explain this method step by step.",
      "fixed_point"
    );

    expect(answer.toLowerCase()).toContain("fixed-point iteration");
    expect(answer).not.toContain("Newton");
  });

  it("uses neutral implicit wording when diagnostics are absent", async () => {
    const answer = await ask(
      "Explain this method step by step.",
      "implicit_no_diagnostics"
    );

    expect(answer).toContain(
      "Because the method is implicit, each step requires solving an equation for uₙ₊₁."
    );
    expect(answer).not.toContain("Newton");
    expect(answer.toLowerCase()).not.toContain("fixed-point");
    expect(answer.toLowerCase()).not.toContain("fixed point");
  });

  it("does not imply an implicit solve for an explicit method", async () => {
    const answer = await ask("Explain this method step by step.", "explicit");

    expect(answer).toContain("The update is explicit");
    expect(answer).not.toContain("Because the method is implicit");
    expect(answer).not.toContain("Newton");
    expect(answer.toLowerCase()).not.toContain("fixed-point");
    expect(answer.toLowerCase()).not.toContain("fixed point");
  });
});
