import {
  buildConvergenceChartModel,
  type ConvergenceMetric,
  type ConvergenceStudyResult,
  type ObservedOrderAssessment,
} from "./convergenceStudy";
import type {
  ConvergenceUiState,
  SuccessfulFirstOrderRunSnapshot,
} from "./convergenceStudyState";
import {
  buildConvergenceConclusion,
  buildConvergenceTeachingSections,
  formatTeachingNumber,
  type TeachingSectionId,
} from "./convergenceTeaching";
import {
  renderReadonlyMath,
  type ReadonlyMathContent,
  type ReadonlyMathDisplay,
} from "./math/ui/readonlyMath";
import { displayNameFor } from "./methodCatalog";

export type ConvergenceStudyIntent =
  | { readonly type: "drawer"; readonly open: boolean }
  | { readonly type: "base_step"; readonly value: string }
  | { readonly type: "levels"; readonly value: string }
  | { readonly type: "run" }
  | { readonly type: "cancel_warning" }
  | { readonly type: "run_anyway" }
  | { readonly type: "metric"; readonly metric: ConvergenceMetric }
  | { readonly type: "accordion"; readonly id: TeachingSectionId; readonly open: boolean };

export interface ConvergenceChartHandle {
  destroy(): void;
}

export interface ConvergenceChartFactory {
  create(canvas: HTMLCanvasElement, configuration: Record<string, unknown>): ConvergenceChartHandle;
}

export interface ConvergenceStudyViewOptions {
  readonly snapshot: SuccessfulFirstOrderRunSnapshot;
  readonly getState: () => ConvergenceUiState;
  readonly onIntent: (intent: ConvergenceStudyIntent) => void | Promise<void>;
  readonly chartFactory: ConvergenceChartFactory;
  readonly renderMath?: (
    target: HTMLElement,
    content: ReadonlyMathContent,
    options?: { display?: ReadonlyMathDisplay }
  ) => void;
}

export interface ConvergenceStudyViewHandle {
  update(): void;
  dispose(): void;
}

interface ChartDatum {
  readonly x: number;
  readonly y: number;
  readonly level: number;
  readonly observedOrder?: number;
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const value = document.createElement(tag);
  if (className) value.className = className;
  if (text !== undefined) value.textContent = text;
  return value;
}

function numeric(value: number): string {
  return formatTeachingNumber(value);
}

function orderDisplay(order: ObservedOrderAssessment | undefined): {
  text: string;
  title?: string;
} {
  if (!order) return { text: "—" };
  const labels: Record<ObservedOrderAssessment["status"], string> = {
    reliable: order.value === undefined ? "Unavailable" : numeric(order.value),
    below_resolution: "Below resolution",
    no_improvement: "No improvement",
    negative: order.value === undefined ? "Negative" : `${numeric(order.value)} (negative)`,
    near_zero: order.value === undefined ? "Near zero" : `${numeric(order.value)} (near zero)`,
    unavailable: "Unavailable",
  };
  return { text: labels[order.status], title: order.message };
}

export function createConvergenceChartConfiguration(
  result: ConvergenceStudyResult,
  metric: ConvergenceMetric
): Record<string, unknown> {
  const model = buildConvergenceChartModel(result, metric);
  const measured: ChartDatum[] = model.measured.map((point) => ({
    x: point.stepSize,
    y: point.error,
    level: point.level,
    ...(point.observedOrder === undefined ? {} : { observedOrder: point.observedOrder }),
  }));
  const reference: ChartDatum[] = model.reference.map((point, index) => ({
    x: point.stepSize,
    y: point.error,
    level: model.measured[index]?.level ?? index,
  }));
  const metricLabel = metric === "maximum_global" ? "Maximum global error" : "Final-time error";
  return {
    type: "line",
    data: {
      datasets: [
        {
          label: metricLabel,
          data: measured,
          borderColor: "#6c8cff",
          backgroundColor: "rgba(108, 140, 255, 0.14)",
          pointRadius: 4,
          tension: 0,
          fill: false,
        },
        ...(reference.length === 0
          ? []
          : [{
              label: `Theoretical slope p = ${result.theoreticalOrder}`,
              data: reference,
              borderColor: "#7ae2a8",
              borderDash: [7, 5],
              pointRadius: 0,
              tension: 0,
              fill: false,
            }]),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: { labels: { color: "#d8e2ff" } },
        tooltip: {
          callbacks: {
            title: (items: Array<{ raw?: ChartDatum }>) => {
              const point = items[0]?.raw;
              return point ? `Level ${point.level + 1}` : "Convergence level";
            },
            label: (context: { raw?: ChartDatum; dataset?: { label?: string } }) => {
              const point = context.raw;
              if (!point) return context.dataset?.label ?? "";
              const order = point.observedOrder === undefined
                ? ""
                : `, observed order ${numeric(point.observedOrder)}`;
              return `${context.dataset?.label ?? "Error"}: h = ${numeric(point.x)}, error = ${numeric(point.y)}${order}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "logarithmic",
          reverse: true,
          title: { display: true, text: "Step size h", color: "#9fb2df" },
          ticks: { color: "#9fb2df" },
          grid: { color: "rgba(255, 255, 255, 0.06)" },
        },
        y: {
          type: "logarithmic",
          title: { display: true, text: metricLabel, color: "#9fb2df" },
          ticks: { color: "#9fb2df" },
          grid: { color: "rgba(255, 255, 255, 0.06)" },
        },
      },
    },
  };
}

function appendDefinition(list: HTMLDListElement, term: string, description: string): void {
  list.append(element("dt", undefined, term), element("dd", undefined, description));
}

function renderConsistency(container: HTMLElement, state: ConvergenceUiState): void {
  const check = state.consistencyCheck;
  if (!check) return;
  const section = element("section", "convergence-consistency");
  const headline = check.status === "passed"
    ? "Numerical consistency check passed."
    : check.status === "warning"
      ? "Numerical consistency check warning."
      : "Numerical consistency check blocked this study.";
  section.append(element("h4", undefined, headline));
  for (const issue of check.issues) section.append(element("p", undefined, issue.message));
  if (check.maximumNormalizedResidual !== undefined) {
    section.append(element(
      "p",
      undefined,
      `Maximum normalized residual: ${numeric(check.maximumNormalizedResidual)}${
        check.maximumResidualTime === undefined ? "" : ` at t = ${numeric(check.maximumResidualTime)}`
      }.`
    ));
  }
  if (check.primaryBlocker) section.append(element("p", "convergence-error", check.primaryBlocker.message));
  section.append(element("p", "convergence-proof-note", check.statement));
  container.append(section);
}

function renderPreview(container: HTMLElement, state: ConvergenceUiState): void {
  if (state.previewFailure) {
    const error = element("p", "convergence-error", state.previewFailure.message);
    error.setAttribute("role", "alert");
    container.append(error);
    return;
  }
  if (!state.preview) return;
  const scroll = element("div", "convergence-table-scroll");
  const table = element("table", "convergence-preview-table");
  const caption = element("caption", "sr-only", "Convergence refinement preview");
  const head = element("thead");
  const headRow = element("tr");
  for (const name of ["Level", "Step size h", "Step count"]) {
    headRow.append(element("th", undefined, name));
  }
  head.append(headRow);
  const body = element("tbody");
  for (const level of state.preview.levels) {
    const row = element("tr");
    row.append(
      element("td", undefined, String(level.level + 1)),
      element("td", undefined, numeric(level.stepSize)),
      element("td", undefined, String(level.stepCount))
    );
    body.append(row);
  }
  table.append(caption, head, body);
  scroll.append(table);
  container.append(
    element("h4", undefined, "Refinement preview"),
    scroll,
    element("p", "convergence-total", `Estimated total integration steps: ${state.preview.totalEstimatedSteps}.`),
    element(
      "p",
      "convergence-budget-note",
      "This total is a browser-protection proxy, not an exact runtime or right-hand-side evaluation estimate. Per-step cost differs: RK4 and Newton-based implicit methods cost more per step than Euler."
    )
  );
}

function renderConclusion(container: HTMLElement, state: ConvergenceUiState, methodName: string): void {
  if (!state.result) return;
  const conclusion = buildConvergenceConclusion(state.result, methodName);
  const card = element("section", "convergence-conclusion");
  if (state.resultStatus === "stale") {
    const stale = element("p", "convergence-stale", "Stale result — rerun the study for the edited settings.");
    stale.setAttribute("role", "status");
    card.append(stale);
  }
  card.append(element("h3", undefined, conclusion.heading));
  const list = element("dl", "meta-dl");
  appendDefinition(list, "Method", conclusion.methodName);
  appendDefinition(list, "Theoretical order", String(conclusion.theoreticalOrder));
  appendDefinition(
    list,
    "Primary observed order (maximum global error)",
    conclusion.primaryObservedOrder === undefined ? "No reliable observed order available" : numeric(conclusion.primaryObservedOrder)
  );
  appendDefinition(list, "Interpretation", conclusion.interpretationTitle);
  card.append(list, element("p", undefined, conclusion.explanation));
  if (conclusion.evidencePairLabels.length > 0) {
    card.append(element("p", undefined, `Evidence pairs: ${conclusion.evidencePairLabels.join(", ")}.`));
  }
  container.append(card);
}

function renderErrorTable(container: HTMLElement, result: ConvergenceStudyResult): void {
  const section = element("section", "convergence-results-table");
  section.append(element("h3", undefined, "Error table"));
  const scroll = element("div", "convergence-table-scroll");
  const table = element("table");
  const caption = element("caption", "sr-only", "Convergence study errors and observed orders");
  const headers = [
    "Level", "h", "Steps", "Final numerical approximation", "Final exact value", "Final-time error",
    "Maximum global error", "Maximum-error time", "Observed order (final-time error)", "Observed order (maximum global error)",
  ];
  const thead = element("thead");
  const headerRow = element("tr");
  headers.forEach((header) => headerRow.append(element("th", undefined, header)));
  thead.append(headerRow);
  const tbody = element("tbody");
  for (const level of result.levels) {
    const finalOrder = orderDisplay(level.finalObservedOrder);
    const maximumOrder = orderDisplay(level.maximumObservedOrder);
    const row = element("tr");
    const values = [
      String(level.level + 1), numeric(level.stepSize), String(level.stepCount),
      numeric(level.finalNumericalValue), numeric(level.finalExactValue), numeric(level.finalTimeError),
      numeric(level.maximumGlobalError), numeric(level.maximumErrorTime), finalOrder.text, maximumOrder.text,
    ];
    values.forEach((value, index) => {
      const cell = element("td", undefined, value);
      const title = index === 8 ? finalOrder.title : index === 9 ? maximumOrder.title : undefined;
      if (title) cell.title = title;
      row.append(cell);
    });
    tbody.append(row);
  }
  table.append(caption, thead, tbody);
  scroll.append(table);
  section.append(scroll);
  container.append(section);
}

function renderChart(
  container: HTMLElement,
  state: ConvergenceUiState,
  chartFactory: ConvergenceChartFactory
): ConvergenceChartHandle | undefined {
  if (!state.result) return undefined;
  const section = element("section", "convergence-chart-section");
  section.append(element("h3", undefined, "Log-log error chart"));
  const toggle = element("fieldset", "convergence-metric-toggle");
  toggle.append(element("legend", undefined, "Error metric"));
  for (const [metric, label] of [
    ["maximum_global", "Maximum global error"],
    ["final_time", "Final-time error"],
  ] as const) {
    const wrapper = element("label");
    const input = element("input");
    input.type = "radio";
    input.name = "convergence-metric";
    input.value = metric;
    input.checked = state.chartMetric === metric;
    input.dataset.convergenceMetric = metric;
    wrapper.append(input, document.createTextNode(label));
    toggle.append(wrapper);
  }
  section.append(toggle);
  const direction = element(
    "p",
    "convergence-chart-direction",
    "Moving right means using a smaller step size."
  );
  section.append(direction);
  const scroll = element("div", "convergence-chart-scroll");
  const region = element("div", "convergence-chart-region");
  const canvas = element("canvas");
  canvas.setAttribute("aria-label", "Log-log convergence error chart");
  canvas.setAttribute("role", "img");
  region.append(canvas);
  scroll.append(region);
  section.append(scroll);
  const model = buildConvergenceChartModel(state.result, state.chartMetric);
  if (model.referenceExplanation) section.append(element("p", "convergence-reference-note", model.referenceExplanation));
  for (const omitted of model.omittedLevels) {
    section.append(element("p", "convergence-omission", `Level ${omitted.level + 1} omitted: ${omitted.reason}`));
  }
  container.append(section);
  return chartFactory.create(canvas, createConvergenceChartConfiguration(state.result, state.chartMetric));
}

function renderTeaching(
  container: HTMLElement,
  state: ConvergenceUiState,
  snapshot: SuccessfulFirstOrderRunSnapshot,
  methodName: string,
  renderMath: NonNullable<ConvergenceStudyViewOptions["renderMath"]>
): void {
  if (!state.result) return;
  const section = element("section", "convergence-teaching");
  section.append(element("h3", undefined, "Understand this experiment"));
  const models = buildConvergenceTeachingSections(state.result, {
    methodName,
    exactSolutionDisplayText: snapshot.exactSolution?.displayText,
    metric: state.chartMetric,
  });
  for (const model of models) {
    const details = element("details", "convergence-teaching-section");
    details.open = state.accordionOpen[model.id];
    details.dataset.teachingId = model.id;
    details.append(element("summary", undefined, model.title));
    const content = element("div", "convergence-teaching-content");
    content.append(element("p", undefined, model.plainLanguage));
    const formula = element("div", "convergence-teaching-formula");
    renderMath(formula, model.formula, { display: "block" });
    content.append(
      formula,
      element("p", "convergence-current-example", model.currentExample),
      element("p", "convergence-why", model.whyThisMatters)
    );
    details.append(content);
    section.append(details);
  }
  container.append(section);
}

export function mountConvergenceStudyView(
  host: HTMLElement,
  options: ConvergenceStudyViewOptions
): ConvergenceStudyViewHandle {
  let disposed = false;
  let revision = 0;
  let chart: ConvergenceChartHandle | undefined;
  const renderMath = options.renderMath ?? renderReadonlyMath;

  const send = (
    intent: ConvergenceStudyIntent,
    sendOptions?: { readonly focusSelector?: string; readonly rerender?: boolean }
  ): void => {
    const currentRevision = revision;
    const shouldRerender = sendOptions?.rerender !== false;
    const focusSelector = sendOptions?.focusSelector;
    void Promise.resolve(options.onIntent(intent))
      .catch(() => {
        // Main orchestration records controlled failures in state.
      })
      .finally(() => {
        if (disposed || currentRevision !== revision) return;
        if (shouldRerender) render();
        if (focusSelector) {
          const target = host.querySelector<HTMLInputElement>(focusSelector);
          target?.focus();
          if (target && target.type !== "number") {
            target.setSelectionRange(target.value.length, target.value.length);
          }
        }
      });
  };

  const render = (): void => {
    if (disposed) return;
    revision += 1;
    chart?.destroy();
    chart = undefined;
    host.replaceChildren();
    const state = options.getState();
    const drawer = element("details", "convergence-drawer");
    drawer.open = state.drawerOpen;
    drawer.append(element("summary", "convergence-drawer-summary", "Convergence Study"));
    const content = element("div", "convergence-drawer-content");
    drawer.append(content);
    host.append(drawer);
    drawer.addEventListener("toggle", () => {
      if (drawer.open !== options.getState().drawerOpen) {
        send({ type: "drawer", open: drawer.open });
      }
    });
    if (!state.drawerOpen) return;

    if (!options.snapshot.exactSolutionEnabled || !options.snapshot.exactSolution) {
      content.append(element(
        "p",
        "convergence-guidance",
        "Add an exact solution in Step 2 to run error and convergence analysis."
      ));
      return;
    }

    content.append(element("h3", undefined, "Experiment setup"));
    const exactBlock = element("div", "convergence-exact");
    exactBlock.append(element("span", "convergence-label", "Exact solution"));
    const exactMath = element("div");
    renderMath(exactMath, {
      latex: `y(t)=${options.snapshot.exactSolution.latex}`,
      displayText: `y of t equals ${options.snapshot.exactSolution.displayText}`,
      ariaLabel: `Exact solution: y of t equals ${options.snapshot.exactSolution.displayText}`,
    }, { display: "block" });
    exactBlock.append(exactMath);
    content.append(exactBlock);

    const runStep = element("p", "convergence-run-step", `Run step size: ${numeric(options.snapshot.runStepSize)}.`);
    content.append(runStep);
    const controls = element("div", "convergence-controls");
    const baseLabel = element("label", "field");
    baseLabel.append(element("span", undefined, "Study base step size"));
    const baseInput = element("input");
    baseInput.type = "number";
    baseInput.step = "any";
    baseInput.value = state.baseStepSizeDraft;
    baseInput.dataset.convergenceBaseStep = "";
    baseInput.setAttribute("aria-label", "Study base step size");
    baseLabel.append(baseInput);
    const levelsLabel = element("label", "field");
    levelsLabel.append(element("span", undefined, "Refinement levels"));
    const levelsInput = element("input");
    levelsInput.type = "number";
    levelsInput.min = "3";
    levelsInput.max = "6";
    levelsInput.step = "1";
    levelsInput.value = state.refinementLevelsDraft;
    levelsInput.dataset.convergenceLevels = "";
    levelsInput.setAttribute("aria-label", "Refinement levels, from 3 through 6");
    levelsLabel.append(levelsInput);
    controls.append(baseLabel, levelsLabel);
    content.append(controls);
    baseInput.addEventListener("input", () => send(
      { type: "base_step", value: baseInput.value },
      { focusSelector: "[data-convergence-base-step]" }
    ));
    levelsInput.addEventListener("input", () => send(
      { type: "levels", value: levelsInput.value },
      { focusSelector: "[data-convergence-levels]" }
    ));

    renderPreview(content, state);
    renderConsistency(content, state);
    if (state.lastAttemptError) {
      const failure = element("p", "convergence-error", state.lastAttemptError.message);
      failure.setAttribute("role", "alert");
      content.append(failure);
    }
    const pending = state.pendingWarningConfirmation;
    if (
      pending &&
      pending.studyFingerprint === state.consistencyFingerprint &&
      state.consistencyCheck?.status === "warning"
    ) {
      const actions = element("div", "convergence-warning-actions");
      const cancel = element("button", "btn ghost", "Cancel");
      cancel.type = "button";
      cancel.dataset.cancelConvergenceWarning = "";
      const anyway = element("button", "btn secondary", "Run anyway");
      anyway.type = "button";
      anyway.dataset.runConvergenceAnyway = "";
      cancel.addEventListener("click", () => send({ type: "cancel_warning" }));
      anyway.addEventListener("click", () => send({ type: "run_anyway" }));
      actions.append(cancel, anyway);
      content.append(actions);
    } else {
      const hasCurrentResult = state.resultStatus === "current" && Boolean(state.result);
      const showRunAction = !hasCurrentResult || Boolean(state.lastAttemptError);
      if (showRunAction) {
        const label = state.result ? "Rerun convergence study" : "Run convergence study";
        const run = element("button", "btn primary", label);
        run.type = "button";
        run.dataset.runConvergence = "";
        if (state.result) run.dataset.rerunConvergence = "";
        run.disabled = !state.preview;
        run.addEventListener("click", () => send({ type: "run" }));
        content.append(run);
      }
    }

    if (state.result) {
      const methodName = displayNameFor(
        options.snapshot.method.family,
        options.snapshot.method.order
      );
      renderConclusion(content, state, methodName);
      renderErrorTable(content, state.result);
      chart = renderChart(content, state, options.chartFactory);
      content.querySelectorAll<HTMLInputElement>("[data-convergence-metric]").forEach((input) => {
        input.addEventListener("change", () => {
          if (input.checked) send({ type: "metric", metric: input.value as ConvergenceMetric });
        });
      });
      renderTeaching(
        content,
        state,
        options.snapshot,
        methodName,
        renderMath
      );
      content.querySelectorAll<HTMLDetailsElement>("[data-teaching-id]").forEach((details) => {
        details.addEventListener("toggle", () => {
          const id = details.dataset.teachingId as TeachingSectionId;
          if (details.open !== options.getState().accordionOpen[id]) {
            // Persist accordion state without replacing the drawer DOM so the
            // page does not jump when a teaching section opens or closes.
            send({ type: "accordion", id, open: details.open }, { rerender: false });
          }
        });
      });
    }
  };

  render();
  return {
    update: render,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      revision += 1;
      chart?.destroy();
      chart = undefined;
      host.replaceChildren();
    },
  };
}
