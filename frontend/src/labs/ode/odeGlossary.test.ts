// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GlossaryHostPort } from "../../glossary/glossaryRuntimeTypes";
import { createSuccessfulExpressionSnapshot } from "./problemExpressions";
import type { SolverResult } from "@numerical-t-lab/numerics/ode/solvers";
import {
  createBeginnerStarterSession,
  createReadonlySolverResult,
  type OdeSessionState,
} from "./odeSession";

const chartDestroy = vi.fn();

vi.mock("chart.js", () => {
  class ChartMock {
    static register = vi.fn();
    destroy = chartDestroy;
  }
  return {
    Chart: ChartMock,
    LineController: {},
    LineElement: {},
    PointElement: {},
    LinearScale: {},
    CategoryScale: {},
    LogarithmicScale: {},
    Title: {},
    Tooltip: {},
    Legend: {},
    Filler: {},
  };
});

const FORWARD_RESULT: SolverResult = {
  points: [
    { t: 0, y: 1 },
    { t: 0.2, y: 0.8 },
  ],
  metadata: {
    displayName: "Forward Euler",
    family: "forward_euler",
    order: 1,
    formulaType: "one-step-explicit",
    formulaDisplay: "u_(n+1) = u_n + h f(t_n, u_n)",
    isImplicit: false,
    notes: [],
  },
};

const RUNGE_KUTTA_RESULT: SolverResult = {
  ...FORWARD_RESULT,
  points: [
    { t: 0, y: 1 },
    { t: 0.2, y: 0.8187333333 },
  ],
  metadata: {
    ...FORWARD_RESULT.metadata,
    displayName: "Runge-Kutta 4",
    family: "rk4",
    order: 4,
  },
};

function singleOutputSession(): OdeSessionState {
  const starter = createBeginnerStarterSession();
  const expression = createSuccessfulExpressionSnapshot(
    starter.form.current.rhs.confirmed,
    "rhs"
  );
  return {
    ...starter,
    step: "results",
    workflow: { mode: "single" },
    selectedMethod: { family: "forward_euler" },
    output: {
      single: {
        result: createReadonlySolverResult(FORWARD_RESULT),
        expression,
        problemInputs: {
          kind: "first_order",
          equationDisplay: expression.equationDisplay,
          t0: 0,
          tEnd: 0.2,
          h: 0.2,
          y0: 1,
        },
      },
    },
  };
}

function compareOutputSession(): OdeSessionState {
  const starter = createBeginnerStarterSession();
  const expression = createSuccessfulExpressionSnapshot(
    starter.form.current.rhs.confirmed,
    "rhs"
  );
  const a = { family: "forward_euler" as const };
  const b = { family: "rk4" as const };
  return {
    ...starter,
    step: "results",
    workflow: { mode: "compare", a, b },
    selectedMethod: null,
    output: {
      comparison: {
        a,
        b,
        resultA: createReadonlySolverResult(FORWARD_RESULT),
        resultB: createReadonlySolverResult(RUNGE_KUTTA_RESULT),
        expression,
      },
    },
  };
}

function annotation(
  target: ParentNode,
  id: string
): HTMLButtonElement | null {
  return target.querySelector<HTMLButtonElement>(
    `[data-glossary-annotation-id="${id}"]`
  );
}

function annotationIds(target: ParentNode): string[] {
  return [
    ...target.querySelectorAll<HTMLElement>("[data-glossary-annotation-id]"),
  ].map((node) => node.dataset.glossaryAnnotationId!);
}

function methodCard(target: ParentNode, name: string): HTMLButtonElement {
  const card = [...target.querySelectorAll<HTMLButtonElement>(".card")].find(
    (candidate) => candidate.querySelector("h3")?.textContent === name
  );
  if (!card) throw new Error(`Missing method card: ${name}`);
  return card;
}

function controlledPort() {
  let active:
    | Parameters<GlossaryHostPort["requestOpen"]>[0]
    | undefined;
  const committed: Array<
    Parameters<GlossaryHostPort["replacementCommitted"]>[0]
  > = [];
  const port: GlossaryHostPort = {
    requestOpen(request) {
      active = request;
    },
    requestClose(request) {
      if (active?.identity === request.identity) active = undefined;
    },
    beginScopeRerender(identity) {
      if (active?.identity.scope !== identity) return undefined;
      return { mode: "pinned", identity: active.identity };
    },
    scopeDisposed(identity) {
      if (active?.identity.scope === identity) active = undefined;
    },
    replacementCommitted(result) {
      committed.push(result);
      active =
        result.kind === "transferred"
          ? {
              ...active!,
              identity: result.replacement,
              trigger: result.replacement.trigger,
              scopeGeneration: result.replacement.scopeGeneration,
            }
          : undefined;
    },
  };
  return { port, committed, active: () => active };
}

describe("ODE Wave 1 Glossary runtime contract", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    chartDestroy.mockClear();
  });

  it("owns exactly ten annotation mappings and ten composed rich cards", async () => {
    const {
      ODE_WAVE1_ANNOTATIONS,
      ODE_WAVE1_GLOSSARY_CARDS,
      ODE_WAVE1_SCOPE_IDS,
    } = await import("./odeGlossary");

    expect(ODE_WAVE1_SCOPE_IDS).toEqual({
      context: "ode_wave1_context",
      method: "ode_wave1_method",
      data: "ode_wave1_data",
      output: "ode_wave1_output",
    });
    expect(ODE_WAVE1_ANNOTATIONS).toEqual([
      {
        id: "ODE-W1-ANN-001",
        termId: "ordinary_differential_equation",
        scope: "context",
        display: "ordinary differential equation",
      },
      {
        id: "ODE-W1-ANN-002",
        termId: "initial_value_problem",
        scope: "context",
        display: "initial value problem",
      },
      {
        id: "ODE-W1-ANN-003",
        termId: "initial_condition",
        scope: "data",
        display: "Initial condition",
      },
      {
        id: "ODE-W1-ANN-004",
        termId: "step_size",
        scope: "data",
        display: "Time-step size",
      },
      {
        id: "ODE-W1-ANN-005",
        termId: "time_grid",
        scope: "data",
        display: "time grid",
      },
      {
        id: "ODE-W1-ANN-006",
        termId: "numerical_approximation",
        scope: "output",
        display: "Final numerical approximation",
      },
      {
        id: "ODE-W1-ANN-007",
        termId: "exact_solution",
        scope: "data",
        display: "Exact solution",
      },
      {
        id: "ODE-W1-ANN-008",
        termId: "explicit_scheme",
        scope: "method",
        display: "Explicit scheme",
      },
      {
        id: "ODE-W1-ANN-009",
        termId: "forward_euler_method",
        scope: "data",
        display: "Forward Euler",
      },
      {
        id: "ODE-W1-ANN-010",
        termId: "backward_euler_method",
        scope: "data",
        display: "Backward Euler",
      },
    ]);
    expect(ODE_WAVE1_GLOSSARY_CARDS.map((entry) => entry.id)).toEqual([
      "ordinary_differential_equation",
      "initial_condition",
      "initial_value_problem",
      "step_size",
      "time_grid",
      "numerical_approximation",
      "exact_solution",
      "explicit_scheme",
      "forward_euler_method",
      "backward_euler_method",
    ]);
    expect(
      new Set(ODE_WAVE1_GLOSSARY_CARDS.map((entry) => entry.id)).size
    ).toBe(10);
    expect(
      ODE_WAVE1_GLOSSARY_CARDS.find(
        (entry) => entry.id === "explicit_scheme"
      )?.contextualDefinition
    ).toContain("Forward Euler");
    expect(
      ODE_WAVE1_GLOSSARY_CARDS.some(
        (entry) => String(entry.id) === "implicit_scheme"
      )
    ).toBe(false);
  });

  it("renders the exact Context and Method records without enhancing rejected sites", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    const lede = target.querySelector("[data-lab-header-lede]")!;
    expect(lede.textContent).toBe(
      "Explore fixed-step methods for a first-order ordinary differential equation posed as an initial value problem, then examine error, convergence, and numerical behavior."
    );
    expect(annotation(lede, "ODE-W1-ANN-001")?.textContent).toBe(
      "ordinary differential equation"
    );
    expect(annotation(lede, "ODE-W1-ANN-002")?.textContent).toBe(
      "initial value problem"
    );
    expect(target.querySelector("h1 .glossary-term-trigger")).toBeNull();
    expect(
      target.querySelector("[data-lab-breadcrumb] .glossary-term-trigger")
    ).toBeNull();

    const helper = target.querySelector<HTMLElement>(
      "[data-ode-method-glossary-helper]"
    )!;
    expect(helper.textContent).toBe(
      "Explicit scheme: the next numerical approximation is computed directly from quantities already known before the update."
    );
    expect(annotation(helper, "ODE-W1-ANN-008")?.textContent).toBe(
      "Explicit scheme"
    );
    expect(helper.getAttribute("aria-label")).toBe("Explicit method concept");
    const methodGrid = target.querySelector<HTMLElement>(".grid-methods")!;
    expect(
      methodGrid.compareDocumentPosition(helper) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      target.querySelector(".ode-method-teaching [data-teaching-lead]")
    ).toBeNull();
    expect(helper.closest("button")).toBeNull();
    expect(target.querySelector(".card .glossary-term-trigger")).toBeNull();
    expect(target.textContent).not.toContain("Ask Tutor");

    mounted.dispose();
  });

  it("renders all six Data records at their exact first-order owners and replaces the selected heading", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });
    const connection = controlledPort();
    mounted.getGlossaryBinding().connect(connection.port);

    annotation(target, "ODE-W1-ANN-001")!.click();
    methodCard(target, "Forward Euler").click();

    const forwardHeading = annotation(target, "ODE-W1-ANN-009")!;
    expect(forwardHeading.parentElement?.tagName).toBe("H2");
    expect(forwardHeading.parentElement?.childNodes).toHaveLength(1);
    expect(annotation(target, "ODE-W1-ANN-003")?.textContent).toBe(
      "Initial condition"
    );
    expect(annotation(target, "ODE-W1-ANN-004")?.textContent).toBe(
      "Time-step size"
    );
    expect(annotation(target, "ODE-W1-ANN-005")?.textContent).toBe("time grid");
    expect(annotation(target, "ODE-W1-ANN-007")?.textContent).toBe(
      "Exact solution"
    );

    const initialCompanion = annotation(target, "ODE-W1-ANN-003")!;
    const stepCompanion = annotation(target, "ODE-W1-ANN-004")!;
    const exactCompanion = annotation(target, "ODE-W1-ANN-007")!;
    expect(initialCompanion.closest("label")).toBeNull();
    expect(stepCompanion.closest("label")).toBeNull();
    expect(exactCompanion.closest("label")).toBeNull();
    expect(
      exactCompanion.closest("[data-exact-expression-field]")
    ).toBeNull();
    expect(
      target.querySelector('label input[name="y0"]')
    ).not.toBeNull();
    expect(
      target.querySelector('label input[name="h"]')
    ).not.toBeNull();
    expect(
      target.querySelector(
        'label input[data-exact-solution-toggle]'
      )
    ).not.toBeNull();

    const timeGridHelper = annotation(
      target,
      "ODE-W1-ANN-005"
    )!.parentElement!;
    expect(timeGridHelper.textContent).toBe(
      "The current fixed-step time grid includes the aligned start and end times."
    );
    expect(timeGridHelper.previousElementSibling?.querySelector('[name="h"]'))
      .not.toBeNull();
    expect(connection.committed.some((result) => result.kind === "transferred"))
      .toBe(true);

    forwardHeading.click();
    target
      .querySelector<HTMLButtonElement>("[data-back-methods]")!
      .click();
    methodCard(target, "Backward Euler").click();
    expect(annotation(target, "ODE-W1-ANN-009")).toBeNull();
    expect(annotation(target, "ODE-W1-ANN-010")?.parentElement?.tagName).toBe(
      "H2"
    );
    expect(
      target.querySelectorAll('[data-glossary-term-id="implicit_scheme"]')
    ).toHaveLength(0);
    expect(
      connection.committed.some(
        (result) =>
          result.kind === "closed" &&
          result.previous?.identity.termId === "forward_euler_method"
      )
    ).toBe(true);

    mounted.dispose();
  });

  it("limits Data annotations in second-order and Compare modes", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    methodCard(target, "Leap-Frog").click();
    expect(annotationIds(target)).toEqual([
      "ODE-W1-ANN-001",
      "ODE-W1-ANN-002",
      "ODE-W1-ANN-004",
      "ODE-W1-ANN-005",
    ]);

    target
      .querySelector<HTMLButtonElement>("[data-back-methods]")!
      .click();
    target.querySelector<HTMLButtonElement>("[data-compare]")!.click();
    methodCard(target, "Forward Euler").click();
    methodCard(target, "Runge-Kutta 4").click();
    expect(annotationIds(target)).toEqual([
      "ODE-W1-ANN-001",
      "ODE-W1-ANN-002",
      "ODE-W1-ANN-004",
      "ODE-W1-ANN-005",
    ]);
    expect(target.querySelector(".form-head h2")?.textContent).toContain(
      "Compare: Forward Euler vs Runge-Kutta 4"
    );
    expect(target.querySelector(".form-head h2 button")).toBeNull();
    expect(target.querySelector("label .glossary-term-trigger")).toBeNull();
    expect(
      target.querySelector("[data-expression-field] .glossary-term-trigger")
    ).toBeNull();

    mounted.dispose();
  });

  it("owns ANN-006 only for successful Single output and reconnects it after a failed rerun", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const initialSession = singleOutputSession();
    const mounted = mountOdeApp({ target, initialSession });
    await Promise.resolve();

    const outputTrigger = annotation(target, "ODE-W1-ANN-006")!;
    expect(outputTrigger.textContent).toBe("Final numerical approximation");
    const answerLabel = outputTrigger.closest<HTMLElement>(
      ".lab-primary-result-answer-label"
    )!;
    expect(answerLabel).not.toBeNull();
    expect(
      answerLabel.nextElementSibling?.classList.contains(
        "ode-primary-numeric-value"
      )
    ).toBe(true);

    target.querySelector<HTMLButtonElement>("[data-back]")!.click();
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();
    const h = target.querySelector<HTMLInputElement>('[name="h"]')!;
    h.value = "0";
    target
      .querySelector<HTMLFormElement>("#ode-form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    expect(target.querySelector("#form-error")?.textContent).toMatch(
      /step|positive|greater/i
    );
    expect(mounted.getSession().output.single?.result).toBe(
      initialSession.output.single?.result
    );
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();

    target
      .querySelector<HTMLButtonElement>("[data-return-output]")!
      .click();
    await Promise.resolve();
    expect(annotation(target, "ODE-W1-ANN-006")).not.toBeNull();

    target.querySelector<HTMLButtonElement>("[data-methods]")!.click();
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();
    target.querySelector<HTMLButtonElement>("[data-compare]")!.click();
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();

    target.querySelector<HTMLButtonElement>("[data-new-experiment]")!.click();
    document
      .querySelector<HTMLButtonElement>("[data-reset-confirm]")!
      .click();
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();
    expect(mounted.getSession().output.single).toBeUndefined();

    mounted.dispose();
  });

  it("keeps Compare Output plain and releases every trigger on route disposal", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: compareOutputSession(),
    });
    const binding = mounted.getGlossaryBinding();
    const connection = controlledPort();
    const disconnect = binding.connect(connection.port);
    await Promise.resolve();

    expect(target.textContent).toContain(
      "Final numerical approximation — Forward Euler"
    );
    expect(target.textContent).toContain(
      "Final numerical approximation — Runge-Kutta 4"
    );
    expect(annotation(target, "ODE-W1-ANN-006")).toBeNull();
    expect(
      target.querySelector(".stat-label .glossary-term-trigger")
    ).toBeNull();
    expect(target.textContent).not.toContain("Ask Tutor");

    const contextTrigger = annotation(target, "ODE-W1-ANN-001")!;
    contextTrigger.click();
    expect(connection.active()?.trigger).toBe(contextTrigger);
    disconnect();
    mounted.dispose();
    contextTrigger.click();
    expect(target.childElementCount).toBe(0);
    expect(connection.active()?.trigger).toBe(contextTrigger);
  });

  it("leaves the ODE overview unbound and unannotated", async () => {
    const { odeOverviewPage } = await import("../../pages/odeOverviewPage");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = odeOverviewPage.mount({
      target,
      navigate: vi.fn(async () => undefined),
      location: { pathname: "/ode", search: "", hash: "" },
    });

    expect(target.textContent).toContain("Numerical ordinary differential equations");
    expect(target.querySelector(".glossary-term-trigger")).toBeNull();
    expect(target.querySelector("[data-glossary-annotation-id]")).toBeNull();

    mounted.dispose();
  });
});
