// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { updatePresetProblemFields } from "./problemPresets";
import {
  createBeginnerStarterSession,
} from "./odeSession";

const chartDestroy = vi.fn();
const chartInstances: Array<{ destroy: typeof chartDestroy }> = [];

vi.mock("chart.js", () => {
  class ChartMock {
    static register = vi.fn();
    destroy = chartDestroy;
    constructor() {
      chartInstances.push(this);
    }
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

describe("Initial Value Problems route", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    chartDestroy.mockClear();
    chartInstances.length = 0;
  });

  it("mounts Beginner Starter and keeps separate mounts isolated", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const firstTarget = document.createElement("div");
    const secondTarget = document.createElement("div");
    document.body.append(firstTarget, secondTarget);

    const first = mount({
      target: firstTarget,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });
    const second = mount({
      target: secondTarget,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });

    expect(firstTarget.querySelector("h1")?.textContent).toBe(
      "Initial Value Problems Lab"
    );
    expect(secondTarget.querySelector("h1")?.textContent).toBe(
      "Initial Value Problems Lab"
    );
    expect(firstTarget.querySelectorAll("h1")).toHaveLength(1);
    expect(firstTarget.querySelector("[data-lab-shell]")).not.toBeNull();
    const breadcrumb = firstTarget.querySelector("[data-lab-breadcrumb]");
    const overviewLink = breadcrumb?.querySelector("a");
    expect(overviewLink?.textContent).toBe("Numerical ODE");
    expect(overviewLink?.getAttribute("href")).toBe("/ode");
    expect(breadcrumb?.textContent).toContain("Initial Value Problems Lab");
    expect(firstTarget.textContent).toContain(
      "Explore fixed-step methods for a first-order ordinary differential equation posed as an initial value problem"
    );
    expect(
      [...firstTarget.querySelectorAll<HTMLButtonElement>("[data-workflow-step]")].map(
        (control) => ({
          key: control.dataset.workflowStep,
          current: control.getAttribute("aria-current"),
          disabled: control.disabled,
        })
      )
    ).toEqual([
      { key: "method", current: "step", disabled: false },
      { key: "data", current: null, disabled: false },
      { key: "output", current: null, disabled: true },
    ]);
    expect(firstTarget.querySelector("[data-stage-role='method']")).not.toBeNull();
    expect(firstTarget.querySelector("[data-experiment-identity]")?.textContent).toContain(
      "Beginner starter"
    );
    expect(first.getSession().form.presetId).toBe("exponential_decay");
    expect(first.getSession()).toMatchObject({
      step: "choose",
      selectedMethod: { family: "forward_euler" },
      form: {
        current: {
          t0: "0",
          y0: "1",
          tEnd: "5",
          runStepSize: "0.2",
          exactSolutionEnabled: true,
          rhs: { draftLatex: "-y" },
          exactSolution: { draftLatex: "e^{-t}" },
        },
      },
    });
    expect(first.getTutorBinding().moduleId).toBe("ode");
    expect(first.getGlossaryBinding().moduleId).toBe("ode");
    expect(first.getGlossaryBinding()).not.toBe(second.getGlossaryBinding());

    first.dispose();
    expect(firstTarget.childElementCount).toBe(0);
    expect(secondTarget.querySelector("h1")).not.toBeNull();
    second.dispose();
  });

  it("uses the approved IVP Method and Data language without changing structure", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mount({
      target,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });

    expect(target.querySelector("[data-lab-header-lede]")?.textContent).toBe(
      "Explore fixed-step methods for a first-order ordinary differential equation posed as an initial value problem, then analyze numerical error, observed convergence, and method behavior as the time-step size changes."
    );
    const cards = [...target.querySelectorAll<HTMLButtonElement>(".card")];
    const card = (name: string) =>
      cards.find((button) => button.querySelector("h3")?.textContent === name)!;
    expect(card("Forward Euler").textContent).toContain(
      "Explicit first-order method. Its theoretical order is 1 under the method’s usual smoothness and stability assumptions."
    );
    expect(card("Backward Euler").textContent).toContain(
      "Implicit first-order method. A-stable for the scalar test equation; each step solves for the next numerical approximation. Absolute stability does not by itself establish accuracy."
    );
    expect(card("Adams-Bashforth").textContent).toContain(
      "Explicit multistep method; choose the theoretical order p below."
    );
    expect(target.textContent).not.toContain("Very stable");
    expect(target.textContent).not.toContain("order of accuracy p below");

    card("Backward Differentiation Formula").click();
    const singleLabels = [
      ...target.querySelectorAll<HTMLElement>(".field > span"),
    ].map((label) => label.textContent);
    expect(singleLabels).toContain("Theoretical order p");
    expect(singleLabels).toContain("End time");
    expect(singleLabels).toContain("Time-step size h");
    expect(singleLabels).not.toContain("Order of accuracy p");
    expect(singleLabels).not.toContain("End time t_end");
    expect(singleLabels).not.toContain("Run step size h = Δt");

    target
      .querySelector<HTMLButtonElement>("[data-back-methods]")!
      .click();
    target.querySelector<HTMLButtonElement>("[data-compare]")!.click();
    [...target.querySelectorAll<HTMLButtonElement>(".card")]
      .find((button) => button.querySelector("h3")?.textContent === "Forward Euler")!
      .click();
    [...target.querySelectorAll<HTMLButtonElement>(".card")]
      .find((button) => button.querySelector("h3")?.textContent === "Runge-Kutta 4")!
      .click();
    const compareLabels = [
      ...target.querySelectorAll<HTMLElement>(".field > span"),
    ].map((label) => label.textContent);
    expect(compareLabels).toContain("End time");
    expect(compareLabels).toContain("Time-step size h");
    expect(compareLabels).not.toContain("End time t_end");
    expect(compareLabels).not.toContain("Step size h");

    mounted.dispose();
  });

  it("hydrates configured method, order, form drafts, and compare errors", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const target = document.createElement("div");
    document.body.append(target);
    const starter = createBeginnerStarterSession();
    const session = {
      ...starter,
      step: "configure" as const,
      workflow: { mode: "single" as const },
      selectedMethod: { family: "bdf" as const, order: 3 },
      comparePickError: "Keep this pure error",
      form: updatePresetProblemFields(starter.form, {
        ...starter.form.current,
        tEnd: "7",
        runStepSize: "0.1",
        rhs: { ...starter.form.current.rhs, draftLatex: "t-y" },
      }),
    };

    const mounted = mount({ target, session, navigate: vi.fn() });
    expect(target.querySelector("h2")?.textContent).toBe(
      "Backward Differentiation Formula"
    );
    expect(target.querySelector<HTMLInputElement>('[name="order"]')?.value).toBe("3");
    expect(target.querySelector<HTMLInputElement>('[name="tEnd"]')?.value).toBe("7");
    expect(target.querySelector<HTMLInputElement>('[name="h"]')?.value).toBe("0.1");
    expect(mounted.getSession().form.current.rhs.draftLatex).toBe("t-y");
    expect(target.textContent).toContain("Keep this pure error");
    expect(target.querySelector("[data-experiment-identity]")?.textContent).toContain(
      "Custom experiment"
    );
    mounted.dispose();
  });

  it("preserves the released compatibility defaults", async () => {
    const {
      createCurrentCompatibilitySession,
      mount,
    } = await import("./initialValueProblemsRoute");
    const target = document.createElement("div");
    document.body.append(target);
    const compatibility = createCurrentCompatibilitySession();
    expect(compatibility).toMatchObject({
      step: "choose",
      workflow: { mode: "single" },
      selectedMethod: null,
      form: {
        current: {
          t0: "0",
          y0: "1",
          tEnd: "5",
          runStepSize: "0.05",
          exactSolutionEnabled: false,
          rhs: { draftLatex: "-y" },
        },
      },
    });
    const mounted = mount({
      target,
      session: compatibility,
      navigate: vi.fn(),
    });

    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")
        ?.disabled
    ).toBe(true);
    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")
        ?.disabled
    ).toBe(true);

    const forwardEuler = [...target.querySelectorAll<HTMLButtonElement>(".card")].find(
      (button) => button.querySelector("h3")?.textContent === "Forward Euler"
    )!;
    forwardEuler.click();
    expect(target.querySelector<HTMLInputElement>('[name="h"]')?.value).toBe("0.05");
    expect(
      target.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")?.checked
    ).toBe(false);
    expect(mounted.getSession().form.presetId).toBeUndefined();
    mounted.dispose();
  });

  it("navigates only to ODE stages authorized by the existing workflow and output state", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mount({
      target,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });

    target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")!.click();
    expect(mounted.getSession().step).toBe("configure");
    expect(
      target
        .querySelector("[data-workflow-step='data']")
        ?.getAttribute("aria-current")
    ).toBe("step");
    expect(target.querySelector("[data-stage-role='data']")).not.toBeNull();

    target.querySelector<HTMLButtonElement>("[data-workflow-step='method']")!.click();
    expect(mounted.getSession().step).toBe("choose");
    expect(
      target
        .querySelector("[data-workflow-step='method']")
        ?.getAttribute("aria-current")
    ).toBe("step");
    expect(target.querySelector("[data-workflow-step='analysis']")).toBeNull();
    mounted.dispose();
  });

  it("hydrates second-order compatibility fields", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const starter = createBeginnerStarterSession();
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mount({
      target,
      session: {
        ...starter,
        step: "configure",
        selectedMethod: { family: "leapfrog" },
        secondOrderForm: {
          ...starter.secondOrderForm,
          u0: "2",
          v0: "-1",
          expression: {
            ...starter.secondOrderForm.expression,
            draftLatex: "-2u",
          },
        },
      },
      navigate: vi.fn(),
    });

    expect(target.querySelector<HTMLInputElement>('[name="u0"]')?.value).toBe("2");
    expect(target.querySelector<HTMLInputElement>('[name="v0"]')?.value).toBe("-1");
    expect(mounted.getSession().secondOrderForm.expression.draftLatex).toBe("-2u");
    mounted.dispose();
  });

  it("rejects two live applications sharing one target", async () => {
    const { mount } = await import("./initialValueProblemsRoute");
    const target = document.createElement("div");
    document.body.append(target);
    const first = mount({
      target,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });
    expect(() =>
      mount({
        target,
        session: createBeginnerStarterSession(),
        navigate: vi.fn(),
      })
    ).toThrow(/already owns/i);
    first.dispose();

    const remounted = mount({
      target,
      session: createBeginnerStarterSession(),
      navigate: vi.fn(),
    });
    target.querySelector<HTMLButtonElement>("[data-compare]")!.click();
    expect(remounted.getSession().workflow).toEqual({
      mode: "compare_pick",
      first: null,
    });
    const compareCards = [
      ...target.querySelectorAll<HTMLButtonElement>(".grid-methods .card"),
    ];
    compareCards[0]!.click();
    const selectedCard = target.querySelector<HTMLButtonElement>(
      ".grid-methods .card.is-selected"
    );
    expect(selectedCard).not.toBeNull();
    expect(selectedCard?.getAttribute("aria-pressed")).toBe("true");
    expect(
      [...target.querySelectorAll<HTMLButtonElement>(".grid-methods .card")]
        .filter((card) => card !== selectedCard)
        .every((card) => card.getAttribute("aria-pressed") === "false")
    ).toBe(true);
    remounted.dispose();
  });
});
