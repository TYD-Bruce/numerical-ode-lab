// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { assertPureValue } from "../app/appSessionStore";
import type { SolverResult } from "../solvers";
import type { EditableMathFieldHandle } from "../math/ui/editableMathField";
import { createSuccessfulExpressionSnapshot } from "../math/problemExpressions";
import { updatePresetProblemFields } from "../problemPresets";
import { createReadonlySolverResult, createBeginnerStarterSession } from "./odeSession";
import {
  createConvergenceUiState,
  createSuccessfulFirstOrderRunSnapshot,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
  setConvergenceState,
  setTeachingAccordion,
} from "../convergenceStudyState";

const destroyChart = vi.fn();
const disposeConvergence = vi.fn();
const mountConvergence = vi.fn(
  (
    _host: HTMLElement,
    _options: {
      getState(): {
        drawerOpen: boolean;
        chartMetric: string;
        accordionOpen: Record<string, boolean>;
      };
    }
  ) => ({ dispose: disposeConvergence })
);

vi.mock("chart.js", () => {
  class ChartMock {
    static register = vi.fn();
    destroy = destroyChart;
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

vi.mock("../convergenceStudyView", () => ({
  mountConvergenceStudyView: mountConvergence,
}));

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
    formulaDisplay: "next = current + h f",
    isImplicit: false,
    notes: [],
  },
};

function outputSession() {
  const starter = createBeginnerStarterSession();
  const expression = createSuccessfulExpressionSnapshot(
    starter.form.current.rhs.confirmed,
    "rhs"
  );
  const firstOrderRun = createSuccessfulFirstOrderRunSnapshot({
    metadata: RAW_RESULT.metadata,
    rhs: expression.expression,
    exactSolutionEnabled: false,
    t0: 0,
    y0: 1,
    tEnd: 5,
    runStepSize: 0.2,
  });
  const convergence = setTeachingAccordion(
    setConvergenceMetric(
      setConvergenceDrawerOpen(createConvergenceUiState(firstOrderRun), true),
      "final_time"
    ),
    "warnings",
    true
  );
  return {
    ...starter,
    step: "results" as const,
    output: {
      single: {
        result: createReadonlySolverResult(RAW_RESULT),
        expression,
        firstOrderRun,
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
    convergenceByFingerprint: setConvergenceState(
      {},
      firstOrderRun.runFingerprint,
      convergence
    ),
  };
}

function configuredSession() {
  return {
    ...createBeginnerStarterSession(),
    step: "configure" as const,
    selectedMethod: { family: "forward_euler" as const },
  };
}

function editableHandle(dispose = vi.fn()): EditableMathFieldHandle {
  const element = document.createElement("div");
  return {
    element,
    getState: vi.fn(),
    getMathfield: vi.fn(),
    setDraftLatex: vi.fn(),
    loadExpression: vi.fn(),
    restoreState: vi.fn(),
    restoreDraft: vi.fn(),
    validateStrict: vi.fn(),
    getIssue: vi.fn(),
    focus: vi.fn(),
    dispose,
  } as unknown as EditableMathFieldHandle;
}

describe("mounted ODE lifecycle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    destroyChart.mockClear();
    disposeConvergence.mockClear();
    mountConvergence.mockClear();
  });

  it("hydrates successful output and reuses immutable point ownership", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const initial = outputSession();
    const mounted = mountOdeApp({ target, initialSession: initial });
    await Promise.resolve();

    expect(target.textContent).toContain("Forward Euler · results");
    expect(mountConvergence).toHaveBeenCalledTimes(1);
    expect(mountConvergence.mock.calls[0]?.[1].getState().drawerOpen).toBe(true);
    expect(mountConvergence.mock.calls[0]?.[1].getState().chartMetric).toBe(
      "final_time"
    );
    expect(
      mountConvergence.mock.calls[0]?.[1].getState().accordionOpen.warnings
    ).toBe(true);
    expect(mounted.getSession().output.single?.result.points).toBe(
      initial.output.single.result.points
    );
    expect(mounted.getSession().output.single?.result.points).toBe(
      mounted.getSession().output.single?.result.points
    );
    const tutorContext = mounted.getTutorBinding().getContext() as {
      enabled: boolean;
      result: { points: ReadonlyArray<{ t: number; y: number }> };
    };
    expect(tutorContext.enabled).toBe(true);
    expect(tutorContext.result.points.at(-1)).toMatchObject({ t: 0.2, y: 0.8 });
    mounted.dispose();
    mounted.dispose();
    expect(target.childElementCount).toBe(0);
    expect(destroyChart).toHaveBeenCalledTimes(1);
    expect(disposeConvergence).toHaveBeenCalledTimes(1);
  });

  it("hydrates comparison output independently from single output", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const base = outputSession();
    const second = createReadonlySolverResult({
      ...RAW_RESULT,
      metadata: {
        ...RAW_RESULT.metadata,
        family: "rk4",
        displayName: "Runge-Kutta 4",
        order: 4,
      },
    });
    const session = {
      ...base,
      workflow: {
        mode: "compare" as const,
        a: { family: "forward_euler" as const },
        b: { family: "rk4" as const },
      },
      selectedMethod: null,
      output: {
        comparison: {
          a: { family: "forward_euler" as const },
          b: { family: "rk4" as const },
          resultA: base.output.single.result,
          resultB: second,
          expression: base.output.single.expression,
        },
      },
    };
    const mounted = mountOdeApp({ target, initialSession: session });
    await Promise.resolve();

    expect(target.textContent).toContain("Forward Euler vs Runge-Kutta 4");
    expect(mounted.getTutorBinding().getContext()).toEqual({ enabled: false });
    expect(mounted.getSession().output.single).toBeUndefined();
    expect(mounted.getSession().output.comparison?.resultB).toBe(second);
    mounted.dispose();
  });

  it("keeps successful output after a failed Run and across a remount", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({ target, initialSession: outputSession() });
    await Promise.resolve();
    const points = mounted.getSession().output.single!.result.points;

    target.querySelector<HTMLButtonElement>("[data-back]")!.click();
    const form = target.querySelector<HTMLFormElement>("#ode-form")!;
    form.querySelector<HTMLInputElement>('[name="tEnd"]')!.value = "0";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();

    expect(target.querySelector<HTMLElement>("#form-error")?.hidden).toBe(false);
    expect(mounted.getSession().output.single?.result.points).toBe(points);
    expect(
      (mounted.getTutorBinding().getContext() as {
        result: { points: readonly unknown[] };
      }).result.points
    ).toBe(points);
    target.querySelector<HTMLButtonElement>("[data-return-output]")!.click();
    await Promise.resolve();
    const saved = mounted.getSession();
    mounted.dispose();

    const remountTarget = document.createElement("div");
    document.body.append(remountTarget);
    const remounted = mountOdeApp({ target: remountTarget, initialSession: saved });
    await Promise.resolve();
    expect(remountTarget.textContent).toContain("Forward Euler · results");
    expect(remounted.getSession().output.single?.result.points).toBe(points);
    remounted.dispose();
  });

  it("invalidates queued result mounting when a newer render wins", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({ target, initialSession: outputSession() });
    target.querySelector<HTMLButtonElement>("[data-back]")!.click();
    await Promise.resolve();

    expect(target.querySelector("#results-body")).toBeNull();
    expect(destroyChart).not.toHaveBeenCalled();
    mounted.dispose();
  });

  it("reports pure session updates without runtime handles", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const target = document.createElement("div");
    document.body.append(target);
    const updates = vi.fn();
    const mounted = mountOdeApp({
      target,
      initialSession: createBeginnerStarterSession(),
      lifecycle: { updateSession: updates },
    });
    const rk4 = [...target.querySelectorAll<HTMLButtonElement>(".card")].find(
      (button) => button.querySelector("h2")?.textContent === "Runge-Kutta 4"
    )!;
    rk4.click();

    expect(updates).toHaveBeenCalled();
    const latest = updates.mock.calls.at(-1)?.[0];
    expect(latest.selectedMethod).toEqual({ family: "rk4" });
    expect(JSON.stringify(latest)).not.toContain("HTML");
    expect(latest.convergenceByFingerprint).not.toBeInstanceOf(Map);
    expect(() => assertPureValue(latest)).not.toThrow();
    mounted.dispose();
  });

  it("ignores a stale editable-field load after a newer render", async () => {
    const { mountOdeApp } = await import("./odeApp");
    let resolveLoader!: (value: {
      mountEditableMathField: ReturnType<typeof vi.fn>;
    }) => void;
    const pending = new Promise<{
      mountEditableMathField: ReturnType<typeof vi.fn>;
    }>((resolve) => {
      resolveLoader = resolve;
    });
    const mountField = vi.fn(() => editableHandle());
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: configuredSession(),
      loadEditableMathField: () => pending,
    });

    target.querySelector<HTMLButtonElement>("[data-back-methods]")!.click();
    resolveLoader({ mountEditableMathField: mountField });
    await pending;
    await Promise.resolve();

    expect(mountField).not.toHaveBeenCalled();
    expect(target.querySelector(".grid-methods")).not.toBeNull();
    mounted.dispose();
  });

  it("hydrates expression drafts separately from confirmed expressions", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const base = configuredSession();
    const session = {
      ...base,
      form: updatePresetProblemFields(base.form, {
        ...base.form.current,
        rhs: { ...base.form.current.rhs, draftLatex: "t-y" },
        exactSolution: {
          ...base.form.current.exactSolution,
          draftLatex: "e^{-2t}",
        },
      }),
    };
    const mountedOptions: Array<{
      profile: string;
      initialDraftLatex?: string;
      initialConfirmed?: unknown;
    }> = [];
    const mountEditableMathField = vi.fn(
      (
        _target: HTMLElement,
        options: {
          profile: string;
          initialDraftLatex?: string;
          initialConfirmed?: unknown;
        }
      ) => {
        mountedOptions.push(options);
        const handle = editableHandle();
        handle.getState = vi.fn(() => ({
          strict: false,
          state: {
            kind: "ready",
            draftLatex: `${options.initialDraftLatex}-latest`,
            confirmed: options.initialConfirmed,
          },
        })) as EditableMathFieldHandle["getState"];
        return handle;
      }
    );
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: session,
      loadEditableMathField: async () => ({
        mountEditableMathField:
          mountEditableMathField as unknown as typeof import("../math/ui/editableMathField")["mountEditableMathField"],
      }),
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(mountedOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          profile: "rhs",
          initialDraftLatex: "t-y",
          initialConfirmed: base.form.current.rhs.confirmed,
        }),
        expect.objectContaining({
          profile: "exact_solution",
          initialDraftLatex: "e^{-2t}",
          initialConfirmed: base.form.current.exactSolution.confirmed,
        }),
      ])
    );
    const captured = mounted.getSession();
    expect(captured.form.current.rhs.draftLatex).toBe("t-y-latest");
    expect(captured.form.current.exactSolution.draftLatex).toBe(
      "e^{-2t}-latest"
    );
    mounted.dispose();
  });

  it("disposes both editable fields during final route cleanup", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const disposers: Array<ReturnType<typeof vi.fn>> = [];
    const mountEditableMathField = vi.fn(() => {
      const dispose = vi.fn();
      disposers.push(dispose);
      return editableHandle(dispose);
    });
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: configuredSession(),
      loadEditableMathField: async () => ({ mountEditableMathField }),
    });
    await Promise.resolve();
    await Promise.resolve();

    mounted.dispose();
    expect(disposers).toHaveLength(2);
    expect(disposers.every((dispose) => dispose.mock.calls.length === 1)).toBe(true);
  });

  it("preserves the ordinary successful-Run Tutor reset behavior", async () => {
    const { mountOdeApp } = await import("./odeApp");
    const mountEditableMathField = vi.fn(
      (
        _target: HTMLElement,
        options: {
          initialConfirmed?: unknown;
          initialDraftLatex?: string;
          profile: string;
        }
      ) => {
        const handle = editableHandle();
        handle.validateStrict = vi.fn(() => ({
          strict: true,
          state: {
            kind: "ready",
            draftLatex: options.initialDraftLatex ?? "",
            confirmed: options.initialConfirmed,
          },
        })) as EditableMathFieldHandle["validateStrict"];
        return handle;
      }
    );
    const target = document.createElement("div");
    document.body.append(target);
    const mounted = mountOdeApp({
      target,
      initialSession: configuredSession(),
      loadEditableMathField: async () => ({
        mountEditableMathField:
          mountEditableMathField as unknown as typeof import("../math/ui/editableMathField")["mountEditableMathField"],
      }),
    });
    await Promise.resolve();
    await Promise.resolve();

    const resetTutor = vi.fn();
    mounted.getTutorBinding().subscribeConversationReset?.(resetTutor);
    target
      .querySelector<HTMLFormElement>("#ode-form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
    await Promise.resolve();

    expect(resetTutor).toHaveBeenCalledTimes(1);
    expect(mounted.getSession().step).toBe("results");
    expect(mounted.getSession().output.single).toBeDefined();
    mounted.dispose();
  });
});
