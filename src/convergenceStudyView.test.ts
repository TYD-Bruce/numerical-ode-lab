// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { createMathExpressionFromLegacy } from "./math/legacyAdapter";
import type { ConvergenceStudyResult } from "./convergenceStudy";
import { ConvergenceStudyFailure } from "./convergenceStudy";
import {
  createConvergenceChartConfiguration,
  mountConvergenceStudyView,
  type ConvergenceChartHandle,
  type ConvergenceStudyIntent,
} from "./convergenceStudyView";
import {
  renderReadonlyMath,
  type ReadonlyMathBackendLoader,
  type ReadonlyMathContent,
  type ReadonlyMathDisplay,
  type StaticMathElement,
} from "./math/ui/readonlyMath";
import {
  createConvergenceUiState,
  createSuccessfulFirstOrderRunSnapshot,
  editConvergenceSetup,
  recordConvergenceFailure,
  recordConvergenceSuccess,
  requestWarningConfirmation,
  setConvergenceConsistency,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
  setTeachingAccordion,
  type ConvergenceUiState,
} from "./convergenceStudyState";

function snapshot(exact = true) {
  return createSuccessfulFirstOrderRunSnapshot({
    metadata: { family: "rk4", order: 4 },
    rhs: createMathExpressionFromLegacy("-y", "rhs"),
    exactSolutionEnabled: exact,
    exactSolution: exact
      ? createMathExpressionFromLegacy("exp(-t)", "exact_solution")
      : undefined,
    t0: 0,
    y0: 1,
    tEnd: 1,
    runStepSize: 0.25,
  });
}

const CHECK = {
  status: "passed" as const,
  statement: "This is a numerical consistency check, not a formal proof." as const,
  sampleCount: 9 as const,
  initialValueDifference: 0,
  maximumNormalizedResidual: 1e-8,
  maximumResidualTime: 0.5,
  probes: [],
  issues: [],
};

function study(state: ConvergenceUiState): ConvergenceStudyResult {
  const errors = [1e-3, 6.25e-5, 3.90625e-6];
  return {
    configFingerprint: JSON.stringify([
      "convergence-study-v1",
      state.runFingerprint,
      "0.25",
      3,
    ]),
    runFingerprint: state.runFingerprint,
    theoreticalOrder: 4,
    consistencyCheck: CHECK,
    levels: errors.map((error, index) => ({
      level: index,
      stepSize: 0.25 / 2 ** index,
      stepCount: 4 * 2 ** index,
      finalNumericalValue: Math.exp(-1) + error / 2,
      finalExactValue: Math.exp(-1),
      finalTimeError: error / 2,
      finalResolutionThreshold: 1e-14,
      maximumGlobalError: error,
      maximumErrorTime: 0.5,
      maximumResolutionThreshold: 1e-14,
      ...(index === 0
        ? {}
        : {
            finalObservedOrder: {
              status: "reliable" as const,
              value: 4,
              message: "Reliable final order.",
              coarseLevel: index - 1,
              fineLevel: index,
            },
            maximumObservedOrder: {
              status: index === 2 ? "below_resolution" as const : "reliable" as const,
              ...(index === 2 ? {} : { value: 4 }),
              message: index === 2 ? "Too close to resolution." : "Reliable maximum order.",
              coarseLevel: index - 1,
              fineLevel: index,
            },
          }),
    })),
    interpretation: {
      kind: "not_yet_asymptotic",
      title: "The experiment is not yet in a clear asymptotic regime",
      explanation: "The finest pair reached the resolution boundary.",
      primaryObservedOrder: 4,
      evidencePairs: [[0, 1]],
    },
  };
}

function harness(
  initial: ConvergenceUiState,
  run = snapshot(),
  options: {
    renderMath?: (
      target: HTMLElement,
      content: ReadonlyMathContent,
      options?: { display?: ReadonlyMathDisplay }
    ) => void;
  } = {}
) {
  const host = document.createElement("div");
  document.body.append(host);
  let state = initial;
  const intents: ConvergenceStudyIntent[] = [];
  const destroyed: ReturnType<typeof vi.fn>[] = [];
  const configurations: Record<string, unknown>[] = [];
  const chartFactory = {
    create: vi.fn((_canvas: HTMLCanvasElement, configuration: Record<string, unknown>) => {
      configurations.push(configuration);
      const destroy = vi.fn();
      destroyed.push(destroy);
      return { destroy } satisfies ConvergenceChartHandle;
    }),
  };
  const renderMath = vi.fn((target: HTMLElement, content: { displayText: string }) => {
    target.textContent = content.displayText;
  });
  const view = mountConvergenceStudyView(host, {
    snapshot: run,
    getState: () => state,
    onIntent: (intent) => {
      intents.push(intent);
      switch (intent.type) {
        case "drawer": state = setConvergenceDrawerOpen(state, intent.open); break;
        case "base_step": state = editConvergenceSetup(state, run, { baseStepSizeDraft: intent.value }); break;
        case "levels": state = editConvergenceSetup(state, run, { refinementLevelsDraft: intent.value }); break;
        case "metric": state = setConvergenceMetric(state, intent.metric); break;
        case "accordion": state = setTeachingAccordion(state, intent.id, intent.open); break;
      }
    },
    chartFactory,
    renderMath: options.renderMath ?? renderMath,
  });
  return { host, get state() { return state; }, set state(value) { state = value; }, intents, chartFactory, configurations, destroyed, renderMath, view };
}

describe("Convergence Study drawer", () => {
  it("is collapsed by default and opens without creating a chart", async () => {
    const run = snapshot();
    const value = harness(createConvergenceUiState(run), run);
    const drawer = value.host.querySelector<HTMLDetailsElement>(".convergence-drawer")!;
    expect(drawer.open).toBe(false);
    expect(drawer.querySelector("summary")?.textContent).toBe("Convergence Study");
    drawer.open = true;
    drawer.dispatchEvent(new Event("toggle"));
    await vi.waitFor(() =>
      expect(value.host.querySelector("[data-convergence-base-step]")).not.toBeNull()
    );
    expect(value.state.drawerOpen).toBe(true);
    expect(value.chartFactory.create).not.toHaveBeenCalled();
  });

  it("shows only approved guidance when the successful run has no exact solution", () => {
    const run = snapshot(false);
    const value = harness(setConvergenceDrawerOpen(createConvergenceUiState(run), true), run);
    expect(value.host.textContent).toContain(
      "Add an exact solution in Step 2 to run error and convergence analysis."
    );
    expect(value.host.querySelector("[data-run-convergence]")).toBeNull();
    expect(value.host.querySelector("[data-convergence-base-step]")).toBeNull();
  });

  it("renders exact solution, independent setup labels, preview, and budget explanation", () => {
    const run = snapshot();
    const value = harness(setConvergenceDrawerOpen(createConvergenceUiState(run), true), run);
    expect(value.host.textContent).toContain("Run step size: 0.25");
    expect(value.host.textContent).toContain("Study base step size");
    expect(value.host.textContent).toContain("Estimated total integration steps: 28");
    expect(value.host.textContent).toContain("browser-protection proxy");
    expect(value.host.textContent).toContain("Newton-based implicit methods cost more per step");
    expect(value.renderMath).toHaveBeenCalled();
    expect(value.host.querySelector("[aria-label='Study base step size']")).not.toBeNull();
  });

  it("keeps each readonly formula singly accessible through update and disposal", async () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = setConvergenceDrawerOpen(recordConvergenceSuccess(state, study(state)), true);
    const loadBackend: ReadonlyMathBackendLoader = async () => ({
      createMathSpan: () => {
        const node = document.createElement("span") as StaticMathElement;
        node.render = () => undefined;
        return node;
      },
    });
    const renderMath = (
      target: HTMLElement,
      content: ReadonlyMathContent,
      renderOptions?: { display?: ReadonlyMathDisplay }
    ): void => {
      renderReadonlyMath(target, content, {
        ...renderOptions,
        loadBackend,
      });
    };
    const value = harness(state, run, { renderMath });
    await Promise.resolve();
    await Promise.resolve();

    const firstHosts = [
      ...value.host.querySelectorAll<HTMLElement>(".readonly-math"),
    ];
    expect(firstHosts.length).toBeGreaterThan(1);
    for (const host of firstHosts) {
      expect(
        [host, ...host.querySelectorAll<HTMLElement>("*")].filter(
          (element) => element.hasAttribute("aria-label")
        )
      ).toHaveLength(1);
    }
    expect(value.host.textContent).toContain(
      run.exactSolution?.latex
    );

    value.view.update();
    await Promise.resolve();
    await Promise.resolve();

    expect(firstHosts.every((host) => !host.isConnected)).toBe(true);
    for (const host of value.host.querySelectorAll<HTMLElement>(
      ".readonly-math"
    )) {
      expect(
        [host, ...host.querySelectorAll<HTMLElement>("*")].filter(
          (element) => element.hasAttribute("aria-label")
        )
      ).toHaveLength(1);
    }

    value.view.dispose();
    value.view.dispose();
    expect(value.host.childElementCount).toBe(0);
  });

  it("emits setup edits while keeping the original run step unchanged", async () => {
    const run = snapshot();
    const value = harness(setConvergenceDrawerOpen(createConvergenceUiState(run), true), run);
    const base = value.host.querySelector<HTMLInputElement>("[data-convergence-base-step]")!;
    base.value = "0.125";
    base.dispatchEvent(new Event("input"));
    await vi.waitFor(() => expect(value.state.baseStepSizeDraft).toBe("0.125"));
    expect(run.runStepSize).toBe(0.25);
    expect(value.state.preview?.levels.map((level) => level.stepCount)).toEqual([8, 16, 32]);
  });

  it("shows invalid preview errors and disables Run while preserving stale results", () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = recordConvergenceSuccess(state, study(state));
    state = editConvergenceSetup(state, run, { refinementLevelsDraft: "2" });
    state = setConvergenceDrawerOpen(state, true);
    const value = harness(state, run);
    expect(value.host.querySelector<HTMLButtonElement>("[data-run-convergence]")?.disabled).toBe(true);
    expect(value.host.textContent).toContain("Refinement levels must be an integer from 3 through 6");
    expect(value.host.textContent).toContain("Stale result");
  });

  it("renders warning evidence and emits Cancel and Run anyway intents", async () => {
    const run = snapshot();
    let state = setConvergenceDrawerOpen(createConvergenceUiState(run), true);
    const fingerprint = JSON.stringify(["convergence-study-v1", state.runFingerprint, "0.25", 3]);
    const warning = {
      ...CHECK,
      status: "warning" as const,
      maximumNormalizedResidual: 2e-4,
      issues: [{
        kind: "derivative_warning" as const,
        message: "The derivative residual needs review.",
        normalizedResidual: 2e-4,
        time: 0.5,
      }],
    };
    state = setConvergenceConsistency(state, fingerprint, warning);
    state = requestWarningConfirmation(state, fingerprint);
    const value = harness(state, run);
    expect(value.host.textContent).toContain("Numerical consistency check warning");
    expect(value.host.textContent).toContain("not a formal proof");
    value.host.querySelector<HTMLButtonElement>("[data-cancel-convergence-warning]")!.click();
    await vi.waitFor(() => expect(value.intents.at(-1)?.type).toBe("cancel_warning"));
    value.view.update();
    value.host.querySelector<HTMLButtonElement>("[data-run-convergence-anyway]")!.click();
    await vi.waitFor(() => expect(value.intents.at(-1)?.type).toBe("run_anyway"));
  });
});

describe("Convergence Study results", () => {
  it("renders stale-aware conclusion, complete table, statuses, chart, and teaching content", () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = recordConvergenceSuccess(state, study(state));
    state = editConvergenceSetup(state, run, { baseStepSizeDraft: "0.125" });
    state = setConvergenceDrawerOpen(state, true);
    const value = harness(state, run);
    expect(value.host.textContent).toContain("What this experiment found");
    expect(value.host.textContent).toContain("Runge-Kutta 4");
    expect(value.host.textContent).toContain("Stale result");
    expect(value.host.textContent).toContain("Final numerical");
    expect(value.host.textContent).toContain("Below resolution");
    expect(value.chartFactory.create).toHaveBeenCalledTimes(1);
    expect(value.host.textContent).toContain("Moving right means using a smaller step size");
    expect(value.host.querySelectorAll("[data-teaching-id]")).toHaveLength(8);
    expect(value.host.querySelector(".convergence-table-scroll")).not.toBeNull();
    expect(value.host.querySelector(".convergence-chart-scroll")).not.toBeNull();
  });

  it("changes metric without running and destroys the prior chart", async () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = setConvergenceDrawerOpen(recordConvergenceSuccess(state, study(state)), true);
    const value = harness(state, run);
    const finalMetric = value.host.querySelector<HTMLInputElement>(
      "[data-convergence-metric='final_time']"
    )!;
    finalMetric.checked = true;
    finalMetric.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(value.chartFactory.create).toHaveBeenCalledTimes(2));
    expect(value.state.chartMetric).toBe("final_time");
    expect(value.intents.some((intent) => intent.type === "run")).toBe(false);
    expect(value.destroyed[0]).toHaveBeenCalledTimes(1);
  });

  it("shows Run before a study, hides it for a current result, and shows Rerun when stale", async () => {
    const run = snapshot();
    let state = setConvergenceDrawerOpen(createConvergenceUiState(run), true);
    const value = harness(state, run);
    const initial = value.host.querySelector<HTMLButtonElement>("[data-run-convergence]")!;
    expect(initial.type).toBe("button");
    expect(initial.textContent).toBe("Run convergence study");
    expect(initial.hasAttribute("data-rerun-convergence")).toBe(false);

    state = setConvergenceDrawerOpen(recordConvergenceSuccess(state, study(state)), true);
    value.state = state;
    value.view.update();
    expect(value.host.querySelector("[data-run-convergence]")).toBeNull();
    expect(value.host.textContent).toContain("What this experiment found");

    state = editConvergenceSetup(state, run, { baseStepSizeDraft: "0.125" });
    state = setConvergenceDrawerOpen(state, true);
    value.state = state;
    value.view.update();
    const rerun = value.host.querySelector<HTMLButtonElement>("[data-run-convergence]")!;
    expect(rerun.textContent).toBe("Rerun convergence study");
    expect(rerun.dataset.rerunConvergence).toBe("");
    expect(value.host.textContent).toContain("Stale result");

    state = editConvergenceSetup(state, run, { baseStepSizeDraft: "0.25" });
    state = setConvergenceDrawerOpen(state, true);
    value.state = state;
    value.view.update();
    expect(value.host.querySelector("[data-run-convergence]")).toBeNull();
  });

  it("keeps warning controls and does not restore the initial Run label after a failed attempt", () => {
    const run = snapshot();
    let state = setConvergenceDrawerOpen(createConvergenceUiState(run), true);
    state = recordConvergenceSuccess(state, study(state));
    state = recordConvergenceFailure(
      state,
      new ConvergenceStudyFailure("level_integration_failure", "Level integration failed.")
    );
    state = setConvergenceDrawerOpen(state, true);
    const failed = harness(state, run);
    const retry = failed.host.querySelector<HTMLButtonElement>("[data-run-convergence]")!;
    expect(retry.textContent).toBe("Rerun convergence study");
    expect(failed.host.textContent).toContain("What this experiment found");
    expect(failed.host.textContent).toContain("Level integration failed.");

    const fingerprint = JSON.stringify(["convergence-study-v1", state.runFingerprint, "0.25", 3]);
    let warningState = setConvergenceDrawerOpen(createConvergenceUiState(run), true);
    const warning = {
      ...CHECK,
      status: "warning" as const,
      maximumNormalizedResidual: 2e-4,
      issues: [{
        kind: "derivative_warning" as const,
        message: "The derivative residual needs review.",
        normalizedResidual: 2e-4,
        time: 0.5,
      }],
    };
    warningState = setConvergenceConsistency(warningState, fingerprint, warning);
    warningState = requestWarningConfirmation(warningState, fingerprint);
    const warningView = harness(warningState, run);
    expect(warningView.host.querySelector("[data-run-convergence]")).toBeNull();
    expect(warningView.host.querySelector("[data-cancel-convergence-warning]")).not.toBeNull();
    expect(warningView.host.querySelector("[data-run-convergence-anyway]")).not.toBeNull();
  });

  it("updates accordion state without recreating the chart or submitting a form", async () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = setConvergenceDrawerOpen(recordConvergenceSuccess(state, study(state)), true);
    const value = harness(state, run);
    const form = document.createElement("form");
    const submit = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener("submit", submit);
    form.append(value.host);
    document.body.append(form);

    const warnings = value.host.querySelector<HTMLDetailsElement>("[data-teaching-id='warnings']")!;
    const heading = warnings.querySelector("summary")!;
    expect(heading.tagName).toBe("SUMMARY");
    const chartCreates = value.chartFactory.create.mock.calls.length;
    heading.focus();
    warnings.open = true;
    warnings.dispatchEvent(new Event("toggle"));
    await vi.waitFor(() => expect(value.state.accordionOpen.warnings).toBe(true));
    expect(submit).not.toHaveBeenCalled();
    expect(value.chartFactory.create).toHaveBeenCalledTimes(chartCreates);
    expect(document.activeElement).toBe(heading);
    expect(value.host.querySelector<HTMLDetailsElement>("[data-teaching-id='warnings']")?.open).toBe(true);

    warnings.open = false;
    warnings.dispatchEvent(new Event("toggle"));
    await vi.waitFor(() => expect(value.state.accordionOpen.warnings).toBe(false));
    expect(value.chartFactory.create).toHaveBeenCalledTimes(chartCreates);
    form.remove();
  });

  it("preserves accordion intent and destroys the chart on disposal", async () => {
    const run = snapshot();
    let state = createConvergenceUiState(run);
    state = setConvergenceDrawerOpen(recordConvergenceSuccess(state, study(state)), true);
    const value = harness(state, run);
    const warnings = value.host.querySelector<HTMLDetailsElement>("[data-teaching-id='warnings']")!;
    warnings.open = true;
    warnings.dispatchEvent(new Event("toggle"));
    await vi.waitFor(() => expect(value.state.accordionOpen.warnings).toBe(true));
    value.view.dispose();
    expect(value.destroyed.at(-1)).toHaveBeenCalledTimes(1);
    expect(value.host.childElementCount).toBe(0);
  });
});

describe("convergence chart configuration", () => {
  it("uses independent logarithmic axes, reversed h, and safe measured data", () => {
    const state = createConvergenceUiState(snapshot());
    const configuration = createConvergenceChartConfiguration(study(state), "maximum_global");
    const options = configuration.options as {
      scales: { x: { type: string; reverse: boolean }; y: { type: string } };
    };
    expect(options.scales.x).toMatchObject({ type: "logarithmic", reverse: true });
    expect(options.scales.y.type).toBe("logarithmic");
    const datasets = (configuration.data as { datasets: Array<{ data: Array<{ y: number }> }> }).datasets;
    expect(datasets[0]!.data.every((point) => point.y > 0 && Number.isFinite(point.y))).toBe(true);
  });
});
