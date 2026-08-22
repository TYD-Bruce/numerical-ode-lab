// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SolverResult } from "@numerical-t-lab/numerics/ode/solvers";
import { createSuccessfulExpressionSnapshot } from "./problemExpressions";
import {
  createBeginnerStarterSession,
  createReadonlySolverResult,
} from "./odeSession";

vi.mock("chart.js", () => {
  class ChartMock {
    static register = vi.fn();
    destroy = vi.fn();
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

const RAW_RESULT: SolverResult = {
  points: [
    { t: 0, y: 1 },
    { t: 0.2, y: 0.8 },
  ],
  metadata: {
    displayName: "Forward Euler",
    family: "forward_euler",
    order: 1,
    formulaType: "one-step-explicit",
    formulaDisplay: "uₙ₊₁ = uₙ + h fₙ",
    isImplicit: false,
    notes: [],
  },
};

function methodControl(target: ParentNode, name: string): HTMLButtonElement {
  const control = [
    ...target.querySelectorAll<HTMLButtonElement>("[data-method-family]"),
  ].find((candidate) => candidate.textContent?.includes(name));
  if (!control) throw new Error(`Missing method control: ${name}`);
  return control;
}

function successfulMethodSession() {
  const starter = createBeginnerStarterSession();
  const expression = createSuccessfulExpressionSnapshot(
    starter.form.current.rhs.confirmed,
    "rhs",
    {
      exactSolutionEnabled: starter.form.current.exactSolutionEnabled,
      exactSolution: starter.form.current.exactSolution.confirmed,
      presetId: starter.form.presetId,
    }
  );
  return {
    ...starter,
    output: {
      single: {
        result: createReadonlySolverResult(RAW_RESULT),
        expression,
        problemInputs: {
          kind: "first_order" as const,
          equationDisplay: expression.equationDisplay,
          t0: 0,
          y0: 1,
          tEnd: 5,
          h: 0.2,
        },
      },
    },
  };
}

describe("ODE Phase 2 Method opening", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders Problem before exactly three complete landscape groups and one selected shell", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    const problem = target.querySelector<HTMLElement>(
      "[data-ode-problem-foundation]"
    )!;
    const landscape = target.querySelector<HTMLElement>(
      "[data-ode-method-landscape]"
    )!;
    expect(problem).not.toBeNull();
    expect(landscape).not.toBeNull();
    expect(
      problem.compareDocumentPosition(landscape) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(problem.textContent).toContain("y′(t) = f(t, y)");
    expect(problem.textContent).toContain("y(t₀) = y₀");
    expect(problem.textContent).toContain("Independent variable / time");
    expect(problem.textContent).toContain("Unknown solution");
    expect(problem.textContent).toContain("Derivative / slope rule");
    expect(problem.textContent).toContain("Starting state");
    expect(problem.textContent).toContain(
      "A numerical approximation is not the same as an exact closed-form solution"
    );
    expect(problem.textContent).toContain("y′ = −y");
    expect(problem.textContent).toContain("y(0) = 1");
    expect(problem.textContent).toContain("u″ = a(t, u)");
    expect(problem.textContent).toContain("u′(t₀) = v₀");
    expect(problem.querySelector("input, select, textarea")).toBeNull();

    const groups = [
      ...landscape.querySelectorAll<HTMLElement>("[data-method-group]"),
    ];
    expect(groups.map((group) => group.dataset.methodGroup)).toEqual([
      "first_order_one_step",
      "first_order_history",
      "second_order_staggered",
    ]);
    expect(
      groups.map((group) => [
        group.querySelector("h3")?.textContent,
        [...group.querySelectorAll<HTMLButtonElement>("[data-method-family]")].map(
          (control) => control.dataset.methodFamily
        ),
      ])
    ).toEqual([
      [
        "First-order · One-step",
        ["forward_euler", "backward_euler", "taylor", "rk4"],
      ],
      [
        "First-order · Uses history",
        ["adams_bashforth", "adams_moulton", "bdf"],
      ],
      ["Second-order · Staggered state", ["leapfrog"]],
    ]);

    const controls = [
      ...landscape.querySelectorAll<HTMLButtonElement>("[data-method-family]"),
    ];
    expect(controls).toHaveLength(8);
    expect(new Set(controls.map((control) => control.dataset.methodFamily)).size).toBe(
      8
    );
    expect(controls.filter((control) => control.ariaPressed === "true")).toHaveLength(
      1
    );
    expect(methodControl(landscape, "Forward Euler").ariaPressed).toBe("true");
    const selectedShell = target.querySelector<HTMLElement>(
      "[data-selected-method-shell]"
    )!;
    const selectedContent = selectedShell.querySelector<HTMLElement>(
      "[data-selected-method-content]"
    );
    expect(selectedShell.textContent).toContain("Forward Euler");
    expect(selectedContent).not.toBeNull();
    expect(selectedContent?.parentElement).toBe(selectedShell);
    expect(selectedShell.children).toHaveLength(1);
    expect(selectedContent?.querySelector(".ode-method-eyebrow")).not.toBeNull();
    expect(
      selectedContent?.querySelector("[data-selected-method-shell-heading]")
    ).not.toBeNull();
    expect(
      selectedContent?.querySelector(".ode-selected-method-metadata")
    ).not.toBeNull();
    expect(
      selectedContent?.querySelector("[data-selected-method-formula]")
    ).not.toBeNull();
    expect(selectedContent?.querySelector(".ode-selected-availability")).not.toBeNull();
    expect(selectedContent?.querySelector(".ode-selected-next")).not.toBeNull();
    expect(selectedContent?.querySelector("[data-selected-method-shell]")).toBeNull();
    expect(
      target.querySelector<HTMLButtonElement>("[data-compare]")?.hasAttribute(
        "data-method-family"
      )
    ).toBe(false);

    mounted.dispose();
  });

  it("keeps real selection on Method with connected focus, no scroll, and one polite update", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    for (const [name, family] of [
      ["Backward Euler", "backward_euler"],
      ["Taylor Method (Order 2)", "taylor"],
      ["Runge-Kutta 4", "rk4"],
      ["Adams-Bashforth", "adams_bashforth"],
      ["Adams-Moulton", "adams_moulton"],
      ["Backward Differentiation Formula", "bdf"],
      ["Leap-Frog", "leapfrog"],
      ["Forward Euler", "forward_euler"],
    ] as const) {
      methodControl(target, name).click();
      await Promise.resolve();
      expect(mounted.getSession().step).toBe("choose");
      expect(mounted.getSession().selectedMethod?.family).toBe(family);
      expect(document.activeElement).toBe(methodControl(target, name));
      expect(
        target.querySelectorAll("[data-method-family][aria-pressed='true']")
      ).toHaveLength(1);
      const statuses = target.querySelectorAll<HTMLElement>(
        "[data-method-selection-status][role='status']"
      );
      expect(statuses).toHaveLength(1);
      expect(statuses[0]?.textContent).toBe(
        `${name} selected. Teaching profile updated.`
      );
      expect(target.querySelector("[data-selected-method-shell]")?.textContent).toContain(
        name
      );
    }
    expect(scrollIntoView).not.toHaveBeenCalled();
    const readSelected = target.querySelectorAll<HTMLButtonElement>(
      "[data-read-selected-method]"
    );
    expect(readSelected).toHaveLength(1);
    readSelected[0]!.click();
    expect(document.activeElement).toBe(
      target.querySelector("[data-selected-method-shell-heading]")
    );
    mounted.dispose();
  });

  it("preserves drafts and successful output while matching Output reachability to selection", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const initial = successfulMethodSession();
    const output = initial.output.single;
    const fieldsBefore = JSON.stringify(initial.form.current);
    const mounted = mountOdeApp({ target, initialSession: initial });

    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")
        ?.disabled
    ).toBe(false);
    methodControl(target, "Runge-Kutta 4").click();
    await Promise.resolve();

    expect(mounted.getSession().step).toBe("choose");
    expect(mounted.getSession().output.single?.result).toBe(output?.result);
    expect(mounted.getSession().output.single?.expression).toBe(
      output?.expression
    );
    expect(JSON.stringify(mounted.getSession().form.current)).toBe(fieldsBefore);
    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")
        ?.disabled
    ).toBe(true);

    methodControl(target, "Forward Euler").click();
    await Promise.resolve();
    expect(mounted.getSession().output.single?.result).toBe(output?.result);
    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")
        ?.disabled
    ).toBe(false);
    mounted.dispose();
  });

  it("preserves distinct family orders through reselection, Data edits, and transition", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const starter = createBeginnerStarterSession();
    const mounted = mountOdeApp({
      target,
      initialSession: {
        ...starter,
        methodOrders: Object.freeze({
          ...starter.methodOrders,
          adams_bashforth: 7,
          adams_moulton: 6,
          bdf: 5,
        }),
      },
    });

    for (const [name, family, order] of [
      ["Adams-Bashforth", "adams_bashforth", 7],
      ["Adams-Moulton", "adams_moulton", 6],
      ["Backward Differentiation Formula", "bdf", 5],
    ] as const) {
      methodControl(target, name).click();
      await Promise.resolve();
      expect(mounted.getSession().selectedMethod).toEqual({ family, order });
      expect(target.querySelector("[data-current-method-order]")?.textContent).toBe(
        String(order)
      );
      methodControl(target, "Runge-Kutta 4").click();
      await Promise.resolve();
      methodControl(target, name).click();
      await Promise.resolve();
      expect(mounted.getSession().selectedMethod).toEqual({ family, order });
    }

    target.querySelector<HTMLButtonElement>("[data-continue-data]")!.click();
    const orderInput = target.querySelector<HTMLInputElement>("[name='order']")!;
    expect(orderInput.value).toBe("5");
    orderInput.value = "4";
    orderInput.dispatchEvent(new Event("input", { bubbles: true }));
    target
      .querySelector<HTMLButtonElement>("[data-workflow-step='method']")!
      .click();
    methodControl(target, "Runge-Kutta 4").click();
    await Promise.resolve();
    methodControl(target, "Backward Differentiation Formula").click();
    await Promise.resolve();
    expect(mounted.getSession().selectedMethod).toEqual({
      family: "bdf",
      order: 4,
    });
    expect(mounted.getSession().methodOrders.bdf).toBe(4);
    mounted.dispose();
  });

  it("keeps Compare secondary and first-order-only with its existing activation path", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    const compare = target.querySelector<HTMLButtonElement>("[data-compare]")!;
    expect(compare.closest("[data-ode-method-landscape]")).not.toBeNull();
    expect(compare.hasAttribute("data-method-family")).toBe(false);
    compare.click();
    expect(mounted.getSession().workflow).toEqual({
      mode: "compare_pick",
      first: null,
    });
    expect(target.querySelectorAll("[data-method-family]")).toHaveLength(7);
    expect(target.querySelector("[data-method-family='leapfrog']")).toBeNull();

    methodControl(target, "Forward Euler").click();
    methodControl(target, "Runge-Kutta 4").click();
    expect(mounted.getSession()).toMatchObject({
      step: "configure",
      workflow: {
        mode: "compare",
        a: { family: "forward_euler" },
        b: { family: "rk4" },
      },
    });
    mounted.dispose();
  });

  it("renders only learner-safe shell fields and transitions to the existing first-/second-order Data surfaces", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });

    methodControl(target, "Adams-Moulton").click();
    await Promise.resolve();
    const shell = target.querySelector<HTMLElement>("[data-selected-method-shell]")!;
    expect(shell.textContent).toContain("First-order IVP");
    expect(shell.textContent).toContain("Uses history");
    expect(shell.textContent).toContain("Implicit");
    expect(shell.textContent).toContain("Supported order");
    expect(shell.textContent).toContain("Current order");
    expect(shell.querySelector("[data-selected-method-formula]")).not.toBeNull();
    const dom = target.innerHTML;
    for (const marker of [
      "sourcePaths",
      "ready_for_independent_audit",
      "source_backed_qualified",
      "packages/",
      "frontend/src/",
      ".test.ts",
      "Maintainer",
      "Codex",
      "Cursor",
    ]) {
      expect(dom).not.toContain(marker);
    }

    target.querySelector<HTMLButtonElement>("[data-continue-data]")!.click();
    expect(mounted.getSession()).toMatchObject({
      step: "configure",
      selectedMethod: { family: "adams_moulton" },
    });
    expect(target.querySelector("[data-expression-field]")).not.toBeNull();
    expect(target.querySelector("[name='y0']")).not.toBeNull();

    target
      .querySelector<HTMLButtonElement>("[data-workflow-step='method']")!
      .click();
    methodControl(target, "Leap-Frog").click();
    await Promise.resolve();
    expect(target.querySelector("[data-selected-method-shell]")?.textContent).toContain(
      "Single-method only"
    );
    target.querySelector<HTMLButtonElement>("[data-continue-data]")!.click();
    expect(target.querySelector("[name='u0']")).not.toBeNull();
    expect(target.querySelector("[name='v0']")).not.toBeNull();
    expect(target.querySelector("[data-exact-solution-toggle]")).toBeNull();
    mounted.dispose();
  });

  it("reconstructs selection without duplicate controls or leaked mount ownership", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const first = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
    });
    methodControl(target, "Backward Euler").click();
    await Promise.resolve();
    expect(target.querySelectorAll("[data-method-family]")).toHaveLength(8);
    const saved = first.getSession();
    first.dispose();
    expect(target.childElementCount).toBe(0);

    const second = mountOdeApp({ target, initialSession: saved });
    expect(target.querySelectorAll("[data-method-family]")).toHaveLength(8);
    expect(
      target.querySelector("[data-method-family='backward_euler']")?.getAttribute(
        "aria-pressed"
      )
    ).toBe("true");
    second.dispose();

    const third = mountOdeApp({ target, initialSession: saved });
    expect(target.querySelectorAll("[data-method-family]")).toHaveLength(8);
    third.dispose();
  });
});
