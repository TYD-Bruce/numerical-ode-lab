// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { updatePresetProblemFields } from "../problemPresets";
import { createBeginnerStarterSession } from "./odeSession";

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

vi.mock("../aiTutorPanel", () => ({
  mountAiTutorPanel: vi.fn(),
  resetTutorConversation: vi.fn(),
}));

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

    expect(firstTarget.querySelector("h1")?.textContent).toBe("Numerical ODE Lab");
    expect(secondTarget.querySelector("h1")?.textContent).toBe("Numerical ODE Lab");
    expect(first.getSession().form.presetId).toBe("exponential_decay");
    expect(first.getTutorBinding().moduleId).toBe("ode");

    first.dispose();
    expect(firstTarget.childElementCount).toBe(0);
    expect(secondTarget.querySelector("h1")).not.toBeNull();
    second.dispose();
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

    const forwardEuler = [...target.querySelectorAll<HTMLButtonElement>(".card")].find(
      (button) => button.querySelector("h2")?.textContent === "Forward Euler"
    )!;
    forwardEuler.click();
    expect(target.querySelector<HTMLInputElement>('[name="h"]')?.value).toBe("0.05");
    expect(
      target.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")?.checked
    ).toBe(false);
    expect(mounted.getSession().form.presetId).toBeUndefined();
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
    remounted.dispose();
  });
});
