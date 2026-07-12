import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildUserContextBlock, handleChatRequest } from "./chatHandler";

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

const INTERPRETATION_KINDS = [
  "consistent_with_theory",
  "approaching_theory",
  "not_yet_asymptotic",
  "refinement_not_improving",
  "order_unavailable",
] as const;

function convergenceContext(kind = "consistent_with_theory"): Record<string, unknown> {
  return {
    ...context("explicit"),
    convergenceStudy: {
      theoreticalOrder: 4,
      interpretation: {
        kind,
        title: `Interpretation ${kind}`,
        explanation: `Supplied explanation for ${kind}.`,
        ...(kind === "order_unavailable" ? {} : { primaryObservedOrder: 3.91827364 }),
        evidencePairs: [[1, 2], [2, 3]],
      },
      levels: [
        {
          level: 0,
          h: 0.2,
          finalTimeError: 0.004321,
          maximumGlobalError: 0.006543,
        },
        {
          level: 1,
          h: 0.1,
          finalTimeError: 0.0002876,
          maximumGlobalError: 0.0004332,
          finalObservedOrder: {
            value: 3.908,
            status: "reliable",
            message: "Final-time order is reliable.",
            coarseLevel: 0,
            fineLevel: 1,
          },
          maximumObservedOrder: {
            ...(kind === "order_unavailable" ? {} : { value: 3.91827364 }),
            status: kind === "refinement_not_improving" ? "no_improvement" : kind === "order_unavailable" ? "unavailable" : "reliable",
            message: `Maximum-order evidence for ${kind}.`,
            coarseLevel: 0,
            fineLevel: 1,
          },
        },
      ],
      consistencyCheck: {
        status: "warning",
        maximumNormalizedResidual: 0.000025,
        maximumResidualTime: 0.5,
        statement: "This is a numerical consistency check, not a formal proof.",
      },
    },
  };
}

async function askConvergence(message: string, kind = "consistent_with_theory"): Promise<string> {
  const response = await handleChatRequest({
    messages: [{ role: "user", content: message }],
    context: convergenceContext(kind),
  });
  expect(response.status).toBe(200);
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

describe("mock tutor convergence grounding", () => {
  const previousMock = process.env.AI_TUTOR_MOCK;

  beforeEach(() => {
    process.env.AI_TUTOR_MOCK = "true";
  });

  afterEach(() => {
    if (previousMock === undefined) delete process.env.AI_TUTOR_MOCK;
    else process.env.AI_TUTOR_MOCK = previousMock;
  });

  it.each(INTERPRETATION_KINDS)("uses the supplied %s interpretation", async (kind) => {
    const answer = await askConvergence("Does this look like the asymptotic region?", kind);
    expect(answer).toContain(kind);
    expect(answer).toContain(`Supplied explanation for ${kind}.`);
    if (kind === "order_unavailable") expect(answer).not.toContain("3.91827364");
    else expect(answer).toContain("3.9182736");
  });

  it("uses actual observed-order evidence and does not fabricate unavailable values", async () => {
    const actual = await askConvergence("Why is my observed order not exactly 4?");
    expect(actual).toContain("3.9182736");
    expect(actual).toContain("4.0000000");
    expect(actual).toContain("Zero-based evidence level pairs: 1 to 2, 2 to 3");

    const unavailable = await askConvergence(
      "Why is my observed order not exactly 4?",
      "order_unavailable"
    );
    expect(unavailable.toLowerCase()).toContain("unavailable");
    expect(unavailable.toLowerCase()).toContain("will not replace it with a guess");
    expect(unavailable).not.toContain("3.91827364");
  });

  it("explains both error metrics from the finest supplied level", async () => {
    const answer = await askConvergence("Why are final-time and maximum errors different?");
    expect(answer).toContain("0.10000000");
    expect(answer).toContain("0.00028760000");
    expect(answer).toContain("0.00043320000");
    expect(answer.toLowerCase()).toContain("do not prove cancellation");
  });

  it("explains graph direction and slope-only reference semantics", async () => {
    const answer = await askConvergence("How do I read the convergence log-log graph?");
    expect(answer).toContain("smaller step size h");
    expect(answer).toContain("both axes are logarithmic");
    expect(answer).toContain("compares slope only");
    expect(answer).toContain("maximum global error");
  });

  it("reports a warning as a numerical check rather than proof", async () => {
    const answer = await askConvergence("What does the consistency warning mean?");
    expect(answer).toContain("0.000025000000");
    expect(answer).toContain("0.50000000");
    expect(answer.toLowerCase()).toContain("not a formal proof");
    expect(answer.toLowerCase()).not.toContain("proves the exact solution is wrong");
  });

  it("uses supplied no-improvement status without choosing a cause", async () => {
    const answer = await askConvergence(
      "Why has refinement stopped improving?",
      "refinement_not_improving"
    );
    expect(answer).toContain("no_improvement");
    expect(answer).toContain("Maximum-order evidence for refinement_not_improving.");
    expect(answer.toLowerCase()).toContain("does not prove one specific cause");
  });

  it("requires a current study rather than inventing convergence data", async () => {
    const response = await handleChatRequest({
      messages: [{ role: "user", content: "What is my observed order?" }],
      context: context("explicit"),
    });
    const answer = String(response.body.message);
    expect(answer).toContain("Run a current Convergence Study first");
    expect(answer.toLowerCase()).toContain("will not invent");
    expect(answer).not.toContain("3.91827364");
  });

  it("serializes convergence evidence deterministically without dropping it", () => {
    const first = buildUserContextBlock(convergenceContext());
    const second = buildUserContextBlock(convergenceContext());
    expect(first).toBe(second);
    expect(first).toContain('"convergenceStudy"');
    expect(first).toContain('"primaryObservedOrder":3.91827364');
    expect(first).not.toContain("lastAttemptError");
  });
});
