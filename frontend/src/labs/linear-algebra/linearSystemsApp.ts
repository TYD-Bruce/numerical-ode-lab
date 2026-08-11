import type {
  LabLifecycleCallbacks,
  LabSessionMetadata,
  ResumeSummary,
} from "../../app/contracts";
import type {
  LinearSystemSolveError,
  LinearSystemSolveSuccess,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import {
  LINEAR_SYSTEMS_PRESETS,
  type LinearSystemsPresetId,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-presets";
import {
  computeLinearSystemsLabMeaningful,
  createLinearSystemsResumeSummary,
  createLinearSystemsSession,
  loadLinearSystemsPreset,
  replaceLinearSystemsDraft,
  resizeLinearSystemsDraft,
  runLinearSystemsSession,
  setLinearSystemsWorkflowStep,
  validateLinearSystemsDraft,
  type LinearSystemsDraft,
  type LinearSystemsDraftIssue,
  type LinearSystemsSessionFailure,
  type LinearSystemsSessionState,
  type LinearSystemsWorkflowStep,
} from "./linearSystemsSession";
import {
  createComputationWalkthrough,
  createNumericMatrixTable,
} from "./computationWalkthrough";
import {
  createMathNumber,
  createStructuredMath,
  formatMathNumber,
  subscript,
  type MathNumberContext,
  type StructuredMathContent,
} from "../../math/structuredMath";
import "./linearSystems.css";

const METHOD_LABEL = "Gaussian elimination with partial pivoting";
const activeMounts = new WeakMap<HTMLElement, object>();
let walkthroughId = 0;

export interface MountLinearSystemsAppOptions {
  readonly target: HTMLElement;
  readonly initialSession: LinearSystemsSessionState;
  readonly navigate?: (path: string) => void;
  readonly lifecycle?: Pick<
    LabLifecycleCallbacks<LinearSystemsSessionState>,
    "updateSession" | "recordMeaningfulInteraction" | "applyConfirmedReset"
  >;
  readonly now?: () => number;
}

export interface MountedLinearSystemsApp {
  getSession(): LinearSystemsSessionState;
  getResumeSummary(): ResumeSummary | undefined;
  dispose(): void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(
  label: string,
  className: string,
  action: () => void
): HTMLButtonElement {
  const control = el("button", label, className);
  control.type = "button";
  control.addEventListener("click", action);
  return control;
}

type Content = string | Node;

function appendContent(target: Node, content: Content): void {
  target.appendChild(
    typeof content === "string" ? document.createTextNode(content) : content
  );
}

function paragraph(contents: readonly Content[], className?: string): HTMLParagraphElement {
  const node = el("p", undefined, className);
  contents.forEach((content) => appendContent(node, content));
  return node;
}

function math(
  content: StructuredMathContent,
  accessibleText: string,
  dataMath: string,
  className = "ls-inline-math"
): HTMLElement {
  return createStructuredMath(content, accessibleText, { className, dataMath });
}

function number(value: number, context: MathNumberContext): HTMLElement {
  return createMathNumber(value, context);
}

function numberCell(value: number, context: MathNumberContext): HTMLTableCellElement {
  const cell = el("td");
  cell.append(number(value, context));
  return cell;
}

function createMetric(
  label: Content,
  value: number,
  context: MathNumberContext
): HTMLElement {
  const metric = el("div", undefined, "ls-metric");
  const term = el("dt");
  appendContent(term, label);
  const description = el("dd");
  description.append(number(value, context));
  metric.append(term, description);
  return metric;
}

function createPivotTable(result: LinearSystemSolveSuccess): HTMLElement {
  const region = el("div", undefined, "ls-table-region");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", "Pivot sequence");
  region.tabIndex = 0;
  const table = el("table", undefined, "ls-evidence-table");
  const caption = el("caption", "Pivot sequence", "sr-only");
  const head = document.createElement("thead");
  const heading = document.createElement("tr");
  ["Column", "Selected row", "Pivot value"].forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    heading.append(th);
  });
  head.append(heading);
  const body = document.createElement("tbody");
  result.pivots.forEach((pivot) => {
    const row = document.createElement("tr");
    const column = document.createElement("th");
    column.scope = "row";
    column.textContent = String(pivot.column + 1);
    row.append(
      column,
      el("td", String(pivot.selectedRow + 1)),
      numberCell(pivot.pivotValue, "ordinary")
    );
    body.append(row);
  });
  table.append(caption, head, body);
  region.append(table);
  return region;
}

function staleNotice(): HTMLElement {
  const notice = el("aside", undefined, "ls-stale-notice");
  notice.dataset.resultStale = "true";
  notice.setAttribute("role", "status");
  notice.append(
    el("strong", "Stale result"),
    document.createTextNode(
      " — this is the latest successful output, but it does not correspond to the current data."
    )
  );
  return notice;
}

export function mountLinearSystemsApp(
  options: MountLinearSystemsAppOptions
): MountedLinearSystemsApp {
  const app = options.target;
  if (activeMounts.has(app)) {
    throw new Error("The Linear Systems Lab target already owns a mounted application.");
  }
  const token = {};
  activeMounts.set(app, token);
  let disposed = false;
  let session = options.initialSession;
  let lastFailure: LinearSystemSolveError | LinearSystemsSessionFailure | undefined;
  let computationExpanded = false;
  let failureComputationExpanded = false;
  let lastMeaningfulInteraction: number | undefined;
  let activeResetDialog: HTMLElement | undefined;
  let resetTrigger: HTMLElement | undefined;
  let inertBackground: Array<{ element: HTMLElement; wasInert: boolean }> = [];
  const instanceId = ++walkthroughId;

  function isCurrent(): boolean {
    return !disposed && activeMounts.get(app) === token;
  }

  function markMeaningful(): void {
    const at = (options.now ?? Date.now)();
    lastMeaningfulInteraction = at;
    options.lifecycle?.recordMeaningfulInteraction?.(at);
  }

  function metadata(): LabSessionMetadata {
    const labMeaningful = computeLinearSystemsLabMeaningful(session);
    return {
      labMeaningful,
      tutorMeaningful: false,
      meaningful: labMeaningful,
      resumeSummary: createLinearSystemsResumeSummary(
        session,
        lastMeaningfulInteraction ?? 0
      ),
      ...(lastMeaningfulInteraction === undefined
        ? {}
        : { lastMeaningfulInteraction }),
    };
  }

  function publish(): void {
    if (!isCurrent()) return;
    options.lifecycle?.updateSession(session, metadata());
  }

  function focusAfterRender(selector: string): void {
    queueMicrotask(() => {
      if (!isCurrent()) return;
      app.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    });
  }

  function announce(message: string): void {
    queueMicrotask(() => {
      if (!isCurrent()) return;
      const status = app.querySelector<HTMLElement>("[data-linear-systems-status]");
      if (status) status.textContent = message;
    });
  }

  function invalidateFailedAttempt(form?: HTMLFormElement): void {
    lastFailure = undefined;
    failureComputationExpanded = false;
    form?.querySelector("[data-solve-failure]")?.remove();
  }

  function goToStep(step: LinearSystemsWorkflowStep): void {
    if (
      (step === "output" || step === "diagnostics") &&
      !session.latestSuccessfulResult
    ) {
      return;
    }
    const next = setLinearSystemsWorkflowStep(session, step);
    if (next === session) return;
    session = next;
    if (step === "output" || step === "diagnostics") markMeaningful();
    publish();
    render();
    focusAfterRender(`[data-workflow-step="${step}"]`);
  }

  function createWorkflowRail(): HTMLElement {
    const nav = el("nav", undefined, "ls-workflow-rail");
    nav.setAttribute("aria-label", "Linear Systems workflow");
    const list = document.createElement("ol");
    const steps: readonly [LinearSystemsWorkflowStep, string][] = [
      ["method", "Method"],
      ["data", "Data"],
      ["output", "Output"],
      ["diagnostics", "Diagnostics"],
    ];
    steps.forEach(([step, label], index) => {
      const item = document.createElement("li");
      const control = button(label, "ls-workflow-step", () => goToStep(step));
      control.dataset.workflowStep = step;
      control.disabled =
        (step === "output" || step === "diagnostics") &&
        !session.latestSuccessfulResult;
      if (session.step === step) {
        control.setAttribute("aria-current", "step");
      }
      item.append(el("span", String(index + 1), "ls-workflow-number"), control);
      list.append(item);
    });
    nav.append(list);
    return nav;
  }

  function createMethodPanel(): HTMLElement {
    const panel = el("section", undefined, "ls-panel ls-workflow-panel ls-stage-method");
    panel.dataset.workflowPanel = "method";
    const heading = el("h2", METHOD_LABEL);
    heading.tabIndex = -1;
    const sequence = el("ol", undefined, "ls-method-sequence");
    sequence.append(
      el("li", "Choose the largest available absolute pivot magnitude in the active column."),
      el("li", "Use a row swap when needed, then eliminate entries below the pivot."),
      (() => {
        const item = el("li");
        item.append(
          document.createTextNode("Record the factors in the public relation "),
          math("P A = L U", "P times A equals L times U", "factorization-relation"),
          document.createTextNode(".")
        );
        return item;
      })(),
      (() => {
        const item = el("li");
        item.append(
          document.createTextNode("Solve "),
          math("L y = P b", "L times y equals P times b", "forward-substitution-relation"),
          document.createTextNode(" and "),
          math("U x̂ = y", "U times x hat equals y", "backward-substitution-relation"),
          document.createTextNode(" with triangular substitution.")
        );
        return item;
      })()
    );
    const boundary = el("aside", undefined, "ls-teaching-note");
    boundary.append(
      el("strong", "Why pivoting matters"),
      el(
        "p",
        "It avoids using a smaller available entry as the active divisor. It does not guarantee accuracy or prove that a matrix is nonsingular."
      )
    );
    panel.append(
      el("p", "One direct method carries this v1 Lab from the original equations to a checked computed solution.", "ls-lede"),
      heading,
      sequence,
      boundary,
      button("Continue to Data", "ls-button ls-button-primary", () => goToStep("data"))
    );
    return panel;
  }

  function currentDraftFromForm(form: HTMLFormElement): LinearSystemsDraft {
    const A = Array.from({ length: session.dimension }, (_, row) =>
      Array.from({ length: session.dimension }, (_, column) =>
        form.querySelector<HTMLInputElement>(
          `[data-matrix-a-row="${row}"][data-matrix-a-column="${column}"]`
        )?.value ?? ""
      )
    );
    const b = Array.from(
      { length: session.dimension },
      (_, row) =>
        form.querySelector<HTMLInputElement>(`[data-vector-b-row="${row}"]`)
          ?.value ?? ""
    );
    return { dimension: session.dimension, A, b };
  }

  function clearFieldErrors(form: HTMLFormElement): void {
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".ls-field-error").forEach((error) => error.remove());
    form.querySelector("[data-validation-summary]")?.remove();
  }

  function inputForIssue(
    form: HTMLFormElement,
    issue: LinearSystemsDraftIssue
  ): HTMLInputElement | undefined {
    if (issue.field === "A" && issue.row !== undefined && issue.column !== undefined) {
      return form.querySelector<HTMLInputElement>(
        `[data-matrix-a-row="${issue.row}"][data-matrix-a-column="${issue.column}"]`
      ) ?? undefined;
    }
    if (issue.field === "b" && issue.row !== undefined) {
      return form.querySelector<HTMLInputElement>(
        `[data-vector-b-row="${issue.row}"]`
      ) ?? undefined;
    }
    return undefined;
  }

  function showValidation(
    form: HTMLFormElement,
    issues: readonly LinearSystemsDraftIssue[]
  ): void {
    clearFieldErrors(form);
    const summary = el("section", undefined, "ls-error-summary");
    summary.dataset.validationSummary = "true";
    summary.setAttribute("role", "alert");
    summary.tabIndex = -1;
    summary.append(el("h3", "Check the system data"));
    const list = document.createElement("ul");
    issues.forEach((issue, index) => {
      list.append(el("li", issue.message));
      const field = inputForIssue(form, issue);
      if (!field) return;
      const errorId = `ls-field-error-${instanceId}-${index}`;
      const error = el("span", issue.message, "ls-field-error");
      error.id = errorId;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", errorId);
      field.closest("td")?.append(error);
    });
    summary.append(list);
    form.prepend(summary);
    const first = inputForIssue(form, issues[0]!);
    queueMicrotask(() => {
      if (!isCurrent()) return;
      (first ?? summary).focus({ preventScroll: false });
    });
  }

  function createEditableMatrix(): HTMLElement {
    const layout = el("div", undefined, "ls-equation-editor");
    layout.dataset.equationEditor = "true";
    layout.append(
      math("A x = b", "A times x equals b", "system-equation", "ls-equation-formula")
    );
    const equationData = el("div", undefined, "ls-equation-data");
    equationData.dataset.equationData = "true";
    const matrixRegion = el("div", undefined, "ls-matrix-region ls-editor-region");
    matrixRegion.setAttribute("role", "region");
    matrixRegion.setAttribute("aria-label", "Editable matrix A input grid");
    matrixRegion.tabIndex = 0;
    const table = el("table", undefined, "ls-input-matrix");
    table.append(el("caption", "Matrix A entries", "sr-only"));
    const body = document.createElement("tbody");
    for (let row = 0; row < session.dimension; row += 1) {
      const tr = document.createElement("tr");
      for (let column = 0; column < session.dimension; column += 1) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.spellcheck = false;
        input.value = session.ADraft[row]?.[column] ?? "";
        input.dataset.matrixARow = String(row);
        input.dataset.matrixAColumn = String(column);
        input.setAttribute(
          "aria-label",
          `Matrix A, row ${row + 1}, column ${column + 1}`
        );
        td.append(input);
        tr.append(td);
      }
      body.append(tr);
    }
    table.append(body);
    matrixRegion.append(table);

    const equals = el("span", "=", "ls-equation-symbol ls-equation-operator");
    equals.setAttribute("aria-hidden", "true");
    const vectorRegion = el("div", undefined, "ls-matrix-region ls-editor-region");
    vectorRegion.setAttribute("role", "region");
    vectorRegion.setAttribute("aria-label", "Editable right-hand-side vector b input grid");
    vectorRegion.tabIndex = 0;
    const vector = el("table", undefined, "ls-input-matrix");
    vector.append(el("caption", "Right-hand-side vector b entries", "sr-only"));
    const vectorBody = document.createElement("tbody");
    for (let row = 0; row < session.dimension; row += 1) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.inputMode = "decimal";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.value = session.bDraft[row] ?? "";
      input.dataset.vectorBRow = String(row);
      input.setAttribute("aria-label", `Vector b, row ${row + 1}`);
      td.append(input);
      tr.append(td);
      vectorBody.append(tr);
    }
    vector.append(vectorBody);
    vectorRegion.append(vector);
    const matrixTerm = el("div", undefined, "ls-equation-term");
    matrixTerm.dataset.equationTerm = "A";
    const matrixLabel = el("span", "A", "ls-equation-label");
    matrixLabel.setAttribute("aria-hidden", "true");
    matrixTerm.append(matrixLabel, matrixRegion);
    const x = el("span", "x", "ls-equation-label ls-equation-operator");
    x.setAttribute("aria-hidden", "true");
    const vectorTerm = el("div", undefined, "ls-equation-term");
    vectorTerm.dataset.equationTerm = "b";
    const vectorLabel = el("span", "b", "ls-equation-label");
    vectorLabel.setAttribute("aria-hidden", "true");
    vectorTerm.append(vectorLabel, vectorRegion);
    equationData.append(matrixTerm, x, equals, vectorTerm);
    layout.append(equationData);
    return layout;
  }

  function updateDataIdentity(form: HTMLFormElement): void {
    const presetSelect = form.querySelector<HTMLSelectElement>("[data-preset-select]");
    if (presetSelect) presetSelect.value = session.selectedPresetId ?? "custom";
    const identity = form.querySelector<HTMLElement>("[data-preset-identity]");
    if (identity) {
      identity.textContent = session.selectedPresetId
        ? `Preset identity: ${LINEAR_SYSTEMS_PRESETS.find((preset) => preset.id === session.selectedPresetId)?.name ?? "Approved preset"}. Reference authority is available after a successful run.`
        : "Preset identity: Custom. No preset reference solution is authoritative.";
    }
  }

  function experimentIdentityText(): string {
    const identity = session.selectedPresetId
      ? `${LINEAR_SYSTEMS_PRESETS.find((preset) => preset.id === session.selectedPresetId)?.name ?? "Approved preset"} · ${session.dimension} × ${session.dimension}`
      : `Custom · ${session.dimension} × ${session.dimension}`;
    if (session.resultStatus === "absent") return identity;
    return `${identity}${session.resultStatus === "current" ? " · result current" : " · result stale"}`;
  }

  function updateExperimentIdentity(): void {
    const identity = app.querySelector<HTMLElement>("[data-experiment-identity]");
    if (identity) identity.textContent = experimentIdentityText();
  }

  function createFailurePanel(
    error: LinearSystemSolveError | LinearSystemsSessionFailure
  ): HTMLElement {
    const panel = el("section", undefined, "ls-solve-failure");
    panel.dataset.solveFailure = error.code;
    panel.setAttribute("role", "alert");
    panel.tabIndex = -1;
    panel.append(el("h3", "The system was not solved"), el("p", error.message));
    if (error.code === "pivot_rejected" && "trace" in error && error.trace) {
      const rejected = [...error.trace.steps]
        .reverse()
        .find((step) => step.kind === "pivot_selection");
      if (rejected?.kind === "pivot_selection") {
        panel.append(
          paragraph([
            `Computation stopped in pivot column ${rejected.column + 1}: selected magnitude `,
            number(rejected.selectedAbsoluteMagnitude, "detail"),
            ", ",
            math(
              [
                subscript("τ", "pivot"),
                " ≈ ",
                ...formatMathNumber(rejected.tauPivot, "threshold").parts,
              ],
              `tau pivot, the pivot acceptance threshold, is approximately ${formatMathNumber(rejected.tauPivot, "threshold").accessibleText}`,
              "tau-pivot"
            ),
            ".",
          ])
        );
      }
      const controlledId = `ls-failure-computation-${instanceId}`;
      const toggle = button(
        failureComputationExpanded ? "Hide computation before failure" : "Show computation before failure",
        "ls-button ls-button-secondary",
        () => {
          failureComputationExpanded = !failureComputationExpanded;
          render();
          focusAfterRender("[data-show-failure-computation]");
        }
      );
      toggle.dataset.showFailureComputation = "true";
      toggle.setAttribute("aria-expanded", String(failureComputationExpanded));
      toggle.setAttribute("aria-controls", controlledId);
      panel.append(toggle);
      if (failureComputationExpanded) {
        const evidence = createComputationWalkthrough(error.trace, {
          headingLevel: 4,
        });
        evidence.id = controlledId;
        evidence.dataset.failureWalkthrough = "true";
        panel.append(evidence);
      }
    }
    if (session.latestSuccessfulResult) {
      panel.append(
        el(
          "p",
          "The previous successful Output and Diagnostics remain available and are marked stale when they do not match the current data.",
          "ls-preserved-result"
        )
      );
    }
    return panel;
  }

  function run(form: HTMLFormElement): void {
    const draft = currentDraftFromForm(form);
    session = replaceLinearSystemsDraft(session, draft);
    const issues = validateLinearSystemsDraft(draft);
    if (issues.length > 0) {
      lastFailure = undefined;
      showValidation(form, issues);
      publish();
      return;
    }
    clearFieldErrors(form);
    const outcome = runLinearSystemsSession(session);
    markMeaningful();
    if (!outcome.ok) {
      session = outcome.session;
      lastFailure = outcome.error;
      failureComputationExpanded = false;
      publish();
      render();
      announce(outcome.error.message);
      queueMicrotask(() => {
        if (!isCurrent()) return;
        app.querySelector<HTMLElement>("[data-solve-failure]")?.focus();
      });
      return;
    }
    session = outcome.session;
    lastFailure = undefined;
    computationExpanded = false;
    failureComputationExpanded = false;
    publish();
    render();
    focusAfterRender(".ls-result-header h2");
    announce("Linear system solved. Computed solution is ready.");
  }

  function createDataPanel(): HTMLElement {
    const panel = el("section", undefined, "ls-panel ls-workflow-panel ls-stage-data");
    panel.dataset.workflowPanel = "data";
    const heading = el("h2", "Data — define A and b");
    heading.tabIndex = -1;
    panel.append(
      heading,
      el(
        "p",
        "Enter a small dense real square system. Each entry accepts a finite decimal or scientific-notation value.",
        "ls-lede"
      )
    );
    const form = document.createElement("form");
    form.noValidate = true;
    form.dataset.linearSystemsForm = "true";
    const controls = el("div", undefined, "ls-data-controls");
    const dimensionLabel = el("label", undefined, "ls-control-field");
    dimensionLabel.append(el("span", "Dimension n"));
    const dimension = document.createElement("select");
    dimension.dataset.dimensionSelect = "true";
    dimension.setAttribute("aria-label", "Matrix dimension");
    for (let value = 2; value <= 6; value += 1) {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = `${value} × ${value}`;
      option.selected = value === session.dimension;
      dimension.append(option);
    }
    dimensionLabel.append(dimension);

    const presetLabel = el("label", undefined, "ls-control-field");
    presetLabel.append(el("span", "Preset"));
    const preset = document.createElement("select");
    preset.dataset.presetSelect = "true";
    preset.setAttribute("aria-label", "Linear system preset");
    LINEAR_SYSTEMS_PRESETS.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      preset.append(option);
    });
    const custom = document.createElement("option");
    custom.value = "custom";
    custom.textContent = "Custom";
    custom.disabled = session.selectedPresetId !== null;
    preset.append(custom);
    preset.value = session.selectedPresetId ?? "custom";
    presetLabel.append(preset);
    controls.append(dimensionLabel, presetLabel);

    const identity = el("p", undefined, "ls-preset-identity");
    identity.dataset.presetIdentity = "true";
    form.append(controls, identity, createEditableMatrix());
    updateDataIdentity(form);

    const actions = el("div", undefined, "ls-form-actions");
    actions.append(
      button("Back to Method", "ls-button ls-button-ghost", () => goToStep("method"))
    );
    const runControl = el("button", "Run", "ls-button ls-button-primary");
    runControl.type = "submit";
    runControl.dataset.runLinearSystem = "true";
    actions.append(runControl);
    form.append(actions);
    if (lastFailure) form.append(createFailurePanel(lastFailure));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      run(form);
    });
    form.addEventListener("input", (event) => {
      if (!(event.target instanceof HTMLInputElement)) return;
      clearFieldErrors(form);
      invalidateFailedAttempt(form);
      const previousStatus = session.resultStatus;
      session = replaceLinearSystemsDraft(session, currentDraftFromForm(form));
      markMeaningful();
      updateDataIdentity(form);
      updateExperimentIdentity();
      publish();
      if (session.resultStatus !== previousStatus) {
        announce(
          session.resultStatus === "stale"
            ? "Inputs changed. The previous successful result is now stale."
            : "The successful input values were restored. The previous result is current again."
        );
      }
    });
    dimension.addEventListener("change", () => {
      const next = resizeLinearSystemsDraft(session, Number(dimension.value));
      if (next === session) return;
      session = next;
      invalidateFailedAttempt();
      markMeaningful();
      publish();
      render();
    });
    preset.addEventListener("change", () => {
      if (preset.value === "custom") return;
      session = loadLinearSystemsPreset(
        session,
        preset.value as LinearSystemsPresetId
      );
      session = setLinearSystemsWorkflowStep(session, "data");
      invalidateFailedAttempt();
      markMeaningful();
      publish();
      render();
    });
    panel.append(form);
    return panel;
  }

  function resultHeader(result: LinearSystemSolveSuccess): HTMLElement {
    const header = el("header", undefined, "ls-result-header");
    const heading = el("h2", "Computed solution");
    heading.tabIndex = -1;
    header.append(
      el("p", "Main answer", "ls-eyebrow"),
      heading
    );
    const solutionLabel = math("x̂ =", "x hat equals", "computed-solution-label");
    const solution = createNumericMatrixTable(
      "Computed solution x hat",
      result.xHat.map((value) => [value]),
      solutionLabel,
      "solution"
    );
    solution.classList.add("ls-solution-vector");
    header.append(solution);
    return header;
  }

  function createOutputPanel(): HTMLElement {
    const panel = el("section", undefined, "ls-panel ls-workflow-panel ls-stage-output");
    panel.dataset.workflowPanel = "output";
    const result = session.latestSuccessfulResult;
    if (!result) {
      const heading = el("h2", "Output");
      heading.tabIndex = -1;
      panel.append(
        heading,
        el("p", "Run a valid system from Data to produce a computed solution."),
        button("Go to Data", "ls-button ls-button-primary", () => goToStep("data"))
      );
      return panel;
    }
    if (session.resultStatus === "stale") panel.append(staleNotice());
    panel.append(resultHeader(result));
    const relation = el("section", undefined, "ls-factorization-rail");
    relation.setAttribute("aria-labelledby", `ls-factorization-title-${instanceId}`);
    const title = el("h3", "Factorization evidence");
    title.id = `ls-factorization-title-${instanceId}`;
    relation.append(
      title,
      math(
        "P A = L U",
        "P times A equals L times U",
        "factorization-relation",
        "ls-factorization-equation"
      ),
      paragraph([
        "The matrices below display rounded entries, so their numerical comparison is ",
        math(
          "P A ≈ L U",
          "P times A is approximately equal to L times U",
          "rounded-factorization"
        ),
        ".",
      ], "ls-muted")
    );
    const factors = el("div", undefined, "ls-factor-grid");
    factors.append(
      createNumericMatrixTable("Permutation matrix P", result.P, "P"),
      createNumericMatrixTable("Unit lower triangular matrix L", result.L, "L"),
      createNumericMatrixTable("Upper triangular matrix U", result.U, "U")
    );
    relation.append(factors);
    const summary = el("div", undefined, "ls-output-summary");
    summary.append(
      el(
        "p",
        `${result.rowSwapCount} row ${result.rowSwapCount === 1 ? "swap" : "swaps"} recorded.`
      ),
      createPivotTable(result)
    );
    if (result.referenceDifferenceInf !== undefined) {
      const reference = el("p", undefined, "ls-reference-difference");
      reference.append(
        el("strong", "Difference from preset reference solution: "),
        number(result.referenceDifferenceInf, "diagnostic")
      );
      summary.append(reference);
    }
    panel.append(relation, summary);

    const computation = el("section", undefined, "ls-computation-shell");
    const computationControlId = `ls-computation-${instanceId}`;
    const toggle = button(
      computationExpanded ? "Hide computation" : "Show computation",
      "ls-button ls-button-secondary ls-computation-toggle",
      () => {
        computationExpanded = !computationExpanded;
        render();
        focusAfterRender("[data-show-computation]");
      }
    );
    toggle.dataset.showComputation = "true";
    toggle.setAttribute("aria-expanded", String(computationExpanded));
    toggle.setAttribute("aria-controls", computationControlId);
    computation.append(
      toggle,
      el(
        "p",
        "Open the computation steps that produced this result.",
        "ls-muted"
      )
    );
    if (computationExpanded) {
      const walkthrough = createComputationWalkthrough(result.trace, {
        headingLevel: 3,
      });
      walkthrough.id = computationControlId;
      computation.append(walkthrough);
    }
    panel.append(computation);
    const actions = el("div", undefined, "ls-panel-actions");
    actions.append(
      button("Edit Data", "ls-button ls-button-ghost", () => goToStep("data")),
      button("View Diagnostics", "ls-button ls-button-primary", () =>
        goToStep("diagnostics")
      )
    );
    panel.append(actions);
    return panel;
  }

  function createDiagnosticsPanel(): HTMLElement {
    const panel = el(
      "section",
      undefined,
      "ls-panel ls-workflow-panel ls-stage-diagnostics"
    );
    panel.dataset.workflowPanel = "diagnostics";
    const heading = el("h2", "Diagnostics — check the equation mismatch");
    heading.tabIndex = -1;
    const result = session.latestSuccessfulResult;
    panel.append(heading);
    if (!result) {
      panel.append(
        el("p", "Run a valid system from Data to produce diagnostics."),
        button("Go to Data", "ls-button ls-button-primary", () => goToStep("data"))
      );
      return panel;
    }
    if (session.resultStatus === "stale") panel.append(staleNotice());
    panel.append(
      el(
        "p",
        "The residual measures how closely the computed solution satisfies the original equations."
      ),
      math(
        "r = b − A x̂",
        "r equals b minus A times x hat",
        "residual-relation",
        "ls-factorization-equation"
      ),
      math(
        ["A x̂ → b − A x̂ → r → ", subscript("‖r‖", "∞")],
        "A times x hat, then b minus A times x hat, then residual r, then the infinity norm of r",
        "residual-chain",
        "ls-residual-chain"
      )
    );
    const diagnostics = el("div", undefined, "ls-diagnostics-layout");
    const residual = el("section", undefined, "ls-diagnostic-card");
    residual.append(
      el("h3", "Residual vector"),
      createNumericMatrixTable(
        "Residual vector r",
        result.residual.map((value) => [value]),
        math("r =", "residual vector r equals", "residual-vector-label"),
        "diagnostic"
      )
    );
    const metrics = el("section", undefined, "ls-diagnostic-card");
    metrics.append(el("h3", "Scale and threshold"));
    const list = el("dl", undefined, "ls-metric-grid");
    list.append(
      createMetric(
        math(subscript("‖r‖", "∞"), "the infinity norm of r", "residual-inf-norm"),
        result.residualInfNorm,
        "diagnostic"
      ),
      createMetric(
        math(subscript("‖A‖", "∞"), "the infinity norm of A", "matrix-inf-norm"),
        result.matrixInfNorm,
        "ordinary"
      ),
      createMetric(
        math(
          subscript("τ", "pivot"),
          "tau pivot, the pivot acceptance threshold",
          "tau-pivot"
        ),
        result.tauPivot,
        "threshold"
      )
    );
    metrics.append(list);
    diagnostics.append(residual, metrics);
    const limitation = el("aside", undefined, "ls-teaching-note ls-diagnostic-boundary");
    limitation.append(
      el("strong", "What this does not establish"),
      el(
        "p",
        "A small residual does not necessarily mean a small solution error. This v1 Lab does not compute conditioning or a forward-error bound."
      )
    );
    panel.append(
      diagnostics,
      limitation,
      el(
        "p",
        `Pivot summary: ${result.rowSwapCount} row ${result.rowSwapCount === 1 ? "swap" : "swaps"}; ${result.pivots.length} accepted pivots.`,
        "ls-muted"
      )
    );
    const actions = el("div", undefined, "ls-panel-actions");
    actions.append(
      button("Back to Output", "ls-button ls-button-ghost", () => goToStep("output")),
      button("Edit Data", "ls-button ls-button-secondary", () => goToStep("data"))
    );
    panel.append(actions);
    return panel;
  }

  function closeResetDialog(restoreFocus: boolean): void {
    if (!activeResetDialog) return;
    activeResetDialog.remove();
    activeResetDialog = undefined;
    document.removeEventListener("keydown", onResetKeydown);
    inertBackground.forEach(({ element, wasInert }) => {
      if (!wasInert) element.removeAttribute("inert");
    });
    inertBackground = [];
    if (restoreFocus && resetTrigger?.isConnected) {
      resetTrigger.focus({ preventScroll: true });
    }
    resetTrigger = undefined;
  }

  function onResetKeydown(event: KeyboardEvent): void {
    const dialog = activeResetDialog;
    if (!dialog) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeResetDialog(true);
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll<HTMLElement>("button")].filter(
      (control) => !control.hasAttribute("disabled")
    );
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function resetExperiment(): void {
    const fresh = createLinearSystemsSession();
    const at = (options.now ?? Date.now)();
    closeResetDialog(false);
    session = fresh;
    lastFailure = undefined;
    computationExpanded = false;
    failureComputationExpanded = false;
    lastMeaningfulInteraction = undefined;
    options.lifecycle?.applyConfirmedReset?.({
      session: fresh,
      metadata: {
        labMeaningful: false,
        tutorMeaningful: false,
        meaningful: false,
        resumeSummary: createLinearSystemsResumeSummary(fresh, 0),
      },
      clearTutorConversation: true,
      at,
    });
    render();
    announce("New experiment started with Starter 3×3.");
    queueMicrotask(() => {
      if (!isCurrent()) return;
      app.querySelector<HTMLElement>("[data-route-focus]")?.focus({
        preventScroll: true,
      });
    });
  }

  function openResetDialog(trigger: HTMLElement): void {
    if (activeResetDialog || disposed) return;
    resetTrigger = trigger;
    const backdrop = el("div", undefined, "ls-reset-backdrop");
    backdrop.dataset.newExperimentDialog = "true";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", `ls-reset-title-${instanceId}`);
    const dialog = el("section", undefined, "ls-reset-dialog");
    const title = el("h2", "Reset the Linear Systems experiment?");
    title.id = `ls-reset-title-${instanceId}`;
    dialog.append(
      title,
      el(
        "p",
        "This returns to Starter 3×3 and clears the current result and local walkthrough view."
      )
    );
    const actions = el("div", undefined, "ls-panel-actions");
    const cancel = button("Cancel", "ls-button ls-button-ghost", () =>
      closeResetDialog(true)
    );
    cancel.dataset.resetCancel = "true";
    const confirm = button("New experiment", "ls-button ls-button-danger", resetExperiment);
    confirm.dataset.resetConfirm = "true";
    actions.append(cancel, confirm);
    dialog.append(actions);
    backdrop.append(dialog);
    activeResetDialog = backdrop;
    inertBackground = [...document.body.children]
      .filter((child): child is HTMLElement => child instanceof HTMLElement)
      .map((element) => ({ element, wasInert: element.hasAttribute("inert") }));
    inertBackground.forEach(({ element }) => element.setAttribute("inert", ""));
    document.body.append(backdrop);
    document.addEventListener("keydown", onResetKeydown);
    cancel.focus();
  }

  function render(): void {
    if (!isCurrent()) return;
    const root = el("div", undefined, "linear-systems-shell");
    const breadcrumb = el("nav", undefined, "ls-breadcrumb");
    breadcrumb.setAttribute("aria-label", "Breadcrumb");
    const overview = document.createElement("a");
    overview.href = "/linear-algebra";
    overview.textContent = "Numerical Linear Algebra";
    breadcrumb.append(
      overview,
      document.createTextNode(" / "),
      el("span", "Linear Systems Lab")
    );
    const header = el("header", undefined, "ls-hero");
    const titleRow = el("div", undefined, "ls-title-row");
    const title = el("h1", "Linear Systems Lab");
    title.dataset.routeFocus = "true";
    title.tabIndex = -1;
    const reset = button("New experiment", "ls-button ls-button-ghost", () =>
      openResetDialog(reset)
    );
    reset.dataset.newExperiment = "true";
    titleRow.append(title, reset);
    header.append(
      breadcrumb,
      titleRow,
      paragraph(
        [
          "Solve ",
          math("A x = b", "A times x equals b", "system-equation"),
          ", inspect how partial pivoting builds ",
          math("P A = L U", "P times A equals L times U", "factorization-relation"),
          ", and check the computed solution against the original equations.",
        ],
        "ls-lede"
      )
    );
    const identity = el("p", undefined, "ls-experiment-identity");
    identity.dataset.experimentIdentity = "true";
    identity.textContent = experimentIdentityText();
    header.append(identity);
    root.append(header, createWorkflowRail());
    if (session.step === "method") root.append(createMethodPanel());
    if (session.step === "data") root.append(createDataPanel());
    if (session.step === "output") root.append(createOutputPanel());
    if (session.step === "diagnostics") root.append(createDiagnosticsPanel());
    const announcements = el("p", undefined, "sr-only");
    announcements.setAttribute("role", "status");
    announcements.setAttribute("aria-live", "polite");
    announcements.setAttribute("aria-atomic", "true");
    announcements.dataset.linearSystemsStatus = "true";
    root.append(announcements);
    app.replaceChildren(root);
  }

  render();
  publish();

  return Object.freeze({
    getSession(): LinearSystemsSessionState {
      return session;
    },
    getResumeSummary(): ResumeSummary | undefined {
      return createLinearSystemsResumeSummary(
        session,
        lastMeaningfulInteraction ?? 0
      );
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      closeResetDialog(false);
      if (activeMounts.get(app) === token) {
        activeMounts.delete(app);
        app.replaceChildren();
      }
    },
  });
}
