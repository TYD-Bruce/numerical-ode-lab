import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LogarithmicScale,
  type ChartConfiguration,
} from "chart.js";
import type { MethodFamily, MethodConfig, SeriesPoint, SolverResult } from "./solvers";
import { integrateFirstOrder, integrateSecondOrder } from "./solvers";
import {
  METHOD_CATALOG,
  FIRST_ORDER_CATALOG,
  catalogByFamily,
  displayNameFor,
  type MethodCatalogEntry,
} from "./methodCatalog";
import { escapeHtml, formatCoefficients } from "./mathDisplay";
import type { ProblemInputs } from "./aiTutor";
import { mountAiTutorPanel, resetTutorConversation } from "./aiTutorPanel";
import { methodMathContent } from "./math/ui/methodMathContent";
import { renderReadonlyMath } from "./math/ui/readonlyMath";
import { validateFixedStepGrid } from "./grid";
import { serializeMathAst } from "./math/canonical";
import type { MathExpression } from "./math/expression";
import {
  compileProductionExpression,
  createEmptyExactExpressionState,
  createDefaultMathExpressionState,
  createSuccessfulExpressionSnapshot,
  currentReadyExpression,
  persistMathFieldSnapshot,
  persistOptionalMathFieldSnapshot,
  type PersistedMathExpressionState,
  type PersistedOptionalMathExpressionState,
  type ProductionMathProfile,
  type SuccessfulExpressionSnapshot,
} from "./math/problemExpressions";
import {
  PROBLEM_PRESETS,
  createPresetFormState,
  isPresetFormDirty,
  loadProblemPreset,
  problemPresetById,
  undoProblemPreset,
  updatePresetProblemFields,
  type PresetFormState,
  type ProblemPresetId,
  type TrackedProblemFields,
} from "./problemPresets";
import type { EditableMathFieldHandle } from "./math/ui/editableMathField";
import {
  mountExpressionErrorSummary,
  type ExpressionErrorSummaryHandle,
} from "./math/ui/expressionErrorSummary";
import {
  ConvergenceStudyFailure,
  checkConvergenceStudyConsistency,
  runConvergenceStudy,
  validateConsistencyPermission,
  type ConvergenceStudyConfig,
} from "./convergenceStudy";
import {
  canRunConfirmedWarning,
  cancelWarningConfirmation,
  convergenceEligibility,
  createSuccessfulFirstOrderRunSnapshot,
  currentStudyFingerprint,
  editConvergenceSetup,
  finishWarningAttempt,
  reconcileConvergenceUiState,
  recordConvergenceFailure,
  recordConvergenceSuccess,
  requestWarningConfirmation,
  setConvergenceConsistency,
  setConvergenceDrawerOpen,
  setConvergenceMetric,
  setTeachingAccordion,
  type ConvergenceUiState,
  type SuccessfulFirstOrderRunSnapshot,
} from "./convergenceStudyState";
import {
  mountConvergenceStudyView,
  type ConvergenceChartFactory,
  type ConvergenceStudyIntent,
  type ConvergenceStudyViewHandle,
} from "./convergenceStudyView";
import "./style.css";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface SelectedMethod {
  family: MethodFamily;
  order?: number;
}

type Step = "choose" | "configure" | "results";

type Session =
  | { mode: "single" }
  | { mode: "compare_pick"; first: SelectedMethod | null }
  | { mode: "compare"; a: SelectedMethod; b: SelectedMethod };

interface PersistedForm {
  t0: string;
  tEnd: string;
  h: string;
  firstExpression: PersistedMathExpressionState;
  secondExpression: PersistedMathExpressionState;
  exactSolutionEnabled: boolean;
  exactExpression: PersistedOptionalMathExpressionState;
  y0: string;
  u0: string;
  v0: string;
  order: string;
}

const DEFAULT_LEDE =
  "Explore numerical methods for initial value problems, compare orders of accuracy, and visualize approximate solutions.";

let step: Step = "choose";
let session: Session = { mode: "single" };
let selected: SelectedMethod | null = null;
let chart: Chart | null = null;
let lastResult: SolverResult | null = null;
let lastResultExpression: SuccessfulExpressionSnapshot | null = null;
let lastCompare: {
  a: SelectedMethod;
  b: SelectedMethod;
  resultA: SolverResult;
  resultB: SolverResult;
  expression: SuccessfulExpressionSnapshot;
} | null = null;
let persisted: PersistedForm = {
  t0: "0",
  tEnd: "5",
  h: "0.05",
  firstExpression: createDefaultMathExpressionState("rhs"),
  secondExpression: createDefaultMathExpressionState("second_order_rhs"),
  exactSolutionEnabled: false,
  exactExpression: createEmptyExactExpressionState(),
  y0: "1",
  u0: "1",
  v0: "0",
  order: "2",
};
let presetFormState: PresetFormState = createPresetFormState({
  rhs: persisted.firstExpression,
  exactSolutionEnabled: persisted.exactSolutionEnabled,
  exactSolution: persisted.exactExpression,
  t0: persisted.t0,
  y0: persisted.y0,
  tEnd: persisted.tEnd,
  runStepSize: persisted.h,
});
let lastProblemInputs: ProblemInputs | null = null;
let comparePickError = "";
let activeExpressionField: EditableMathFieldHandle | null = null;
let activeExactExpressionField: EditableMathFieldHandle | null = null;
let activeExpressionSummary: ExpressionErrorSummaryHandle | null = null;
let lastFirstOrderRunSnapshot: SuccessfulFirstOrderRunSnapshot | null = null;
const convergenceStates = new Map<string, ConvergenceUiState>();
let activeConvergenceView: ConvergenceStudyViewHandle | null = null;

const app = document.querySelector<HTMLDivElement>("#app")!;

function catalogEntry(sel: SelectedMethod): MethodCatalogEntry {
  return catalogByFamily(sel.family);
}

function methodLabel(sel: SelectedMethod): string {
  return displayNameFor(sel.family, sel.order);
}

function selectedMeta(): MethodCatalogEntry | null {
  return selected ? catalogEntry(selected) : null;
}

function configFromSelection(sel: SelectedMethod): MethodConfig {
  const cat = catalogEntry(sel);
  const order = cat.hasOrderSelector
    ? Number(sel.order ?? cat.orderDefault ?? 2)
    : undefined;
  return { family: sel.family, order };
}

function persistFromFirstOrderFd(fd: FormData): void {
  persisted = {
    t0: String(fd.get("t0") ?? "0"),
    tEnd: String(fd.get("tEnd") ?? "5"),
    h: String(fd.get("h") ?? "0.05"),
    firstExpression: persisted.firstExpression,
    secondExpression: persisted.secondExpression,
    exactSolutionEnabled: persisted.exactSolutionEnabled,
    exactExpression: persisted.exactExpression,
    y0: String(fd.get("y0") ?? "1"),
    u0: persisted?.u0 ?? "1",
    v0: persisted?.v0 ?? "0",
    order: String(fd.get("order") ?? persisted?.order ?? "2"),
  };
}

function persistFromSecondOrderFd(fd: FormData): void {
  persisted = {
    t0: String(fd.get("t0") ?? "0"),
    tEnd: String(fd.get("tEnd") ?? "5"),
    h: String(fd.get("h") ?? "0.05"),
    firstExpression: persisted.firstExpression,
    secondExpression: persisted.secondExpression,
    exactSolutionEnabled: persisted.exactSolutionEnabled,
    exactExpression: persisted.exactExpression,
    y0: persisted?.y0 ?? "1",
    u0: String(fd.get("u0") ?? "1"),
    v0: String(fd.get("v0") ?? "0"),
    order: persisted?.order ?? "2",
  };
}

function trackedFields(): TrackedProblemFields {
  return {
    rhs: persisted.firstExpression,
    exactSolutionEnabled: persisted.exactSolutionEnabled,
    exactSolution: persisted.exactExpression,
    t0: persisted.t0,
    y0: persisted.y0,
    tEnd: persisted.tEnd,
    runStepSize: persisted.h,
  };
}

function applyTrackedFields(fields: TrackedProblemFields): void {
  persisted.firstExpression = fields.rhs;
  persisted.exactSolutionEnabled = fields.exactSolutionEnabled;
  persisted.exactExpression = fields.exactSolution;
  persisted.t0 = fields.t0;
  persisted.y0 = fields.y0;
  persisted.tEnd = fields.tEnd;
  persisted.h = fields.runStepSize;
}

function recordTrackedEdit(): void {
  presetFormState = updatePresetProblemFields(presetFormState, trackedFields());
}

function readPersistedFromFormEl(form: HTMLFormElement): void {
  const fd = new FormData(form);
  if (fd.has("y0")) persistFromFirstOrderFd(fd);
  else persistFromSecondOrderFd(fd);
}

function disposeExpressionUi(): void {
  activeExpressionField?.dispose();
  activeExactExpressionField?.dispose();
  activeExpressionSummary?.dispose();
  activeExpressionField = null;
  activeExactExpressionField = null;
  activeExpressionSummary = null;
}

function disposeConvergenceUi(): void {
  activeConvergenceView?.dispose();
  activeConvergenceView = null;
}

function orderFieldHtml(cat: MethodCatalogEntry): string {
  if (!cat.hasOrderSelector) return "";
  const min = cat.orderMin ?? 1;
  const max = cat.orderMax ?? 8;
  const val = persisted?.order ?? String(cat.orderDefault ?? 2);
  return `
    <label class="field">
      <span>Order of accuracy p</span>
      <input name="order" type="number" min="${min}" max="${max}" step="1" value="${val}" required />
    </label>
    <p class="hint multistep-note">For multistep methods, startup values are generated by Runge-Kutta 4.</p>
  `;
}

function render(): void {
  const meta = selectedMeta();
  disposeExpressionUi();
  disposeConvergenceUi();
  app.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "shell";

  const comparePicking = session.mode === "compare_pick";
  let lede = DEFAULT_LEDE;
  if (comparePicking && session.mode === "compare_pick") {
    lede =
      session.first === null
        ? "Choose the first first-order method, then a second method. You will enter one shared model y′ = f(t, y)."
        : `First method: ${methodLabel(session.first)}. Choose a different second method.`;
  }

  shell.innerHTML = `
    <header class="hero">
      <p class="eyebrow">AI-Assisted Educational Solver</p>
      <h1>Numerical ODE Lab</h1>
      <p class="lede">${lede}</p>
      <p class="ivp-note">Enter the equation in familiar mathematical notation. First-order fields use t and y; Leap-Frog acceleration uses t and u.</p>
      ${
        comparePickError
          ? `<p class="compare-error" role="alert">${comparePickError}</p>`
          : ""
      }
      <div class="steps" role="navigation" aria-label="Progress">
        <span class="pill ${step === "choose" ? "active" : ""}">1 · Method</span>
        <span class="arrow">→</span>
        <span class="pill ${step === "configure" ? "active" : ""}">2 · Data</span>
        <span class="arrow">→</span>
        <span class="pill ${step === "results" ? "active" : ""}">3 · Output</span>
      </div>
    </header>
  `;

  const main = document.createElement("main");
  main.className = "panel";

  if (step === "choose") {
    main.append(renderChoosePanel());
  } else if (step === "configure") {
    if (session.mode === "compare") {
      main.append(
        renderCompareForm(
          catalogEntry(session.a),
          catalogEntry(session.b),
          session.a,
          session.b
        )
      );
    } else if (meta && selected) {
      main.append(renderForm(meta, selected));
    } else {
      step = "choose";
      main.append(renderChoosePanel());
    }
  } else if (step === "results") {
    if (lastCompare) {
      main.append(
        renderCompareResultsShell(
          catalogEntry(lastCompare.a),
          catalogEntry(lastCompare.b),
          lastCompare.resultA,
          lastCompare.resultB,
          lastCompare.expression
        )
      );
    } else if (meta && lastResult && lastResultExpression) {
      main.append(renderResultsShell(meta, lastResult, lastResultExpression));
    } else {
      step = "configure";
      main.append(renderChoosePanel());
    }
  } else {
    step = "choose";
    main.append(renderChoosePanel());
  }

  shell.append(main);
  app.append(shell);
}

function renderChoosePanel(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "choose-panel";

  if (session.mode === "compare_pick") {
    const bar = document.createElement("div");
    bar.className = "choose-actions";
    bar.innerHTML = `<button type="button" class="btn ghost" data-cancel-compare>Cancel compare</button>`;
    bar.querySelector("[data-cancel-compare]")!.addEventListener("click", () => {
      session = { mode: "single" };
      comparePickError = "";
      render();
    });
    wrap.append(bar);
    wrap.append(renderCompareMethodGrid());
    return wrap;
  }

  const bar = document.createElement("div");
  bar.className = "choose-actions";
  bar.innerHTML = `
    <button type="button" class="btn secondary" data-compare>Compare two methods</button>
    <p class="compare-hint">One shared y′ = f(t, y) setup (first-order methods only).</p>
  `;
  bar.querySelector("[data-compare]")!.addEventListener("click", () => {
    session = { mode: "compare_pick", first: null };
    comparePickError = "";
    render();
  });
  wrap.append(bar);
  wrap.append(renderSingleMethodGrid());
  return wrap;
}

function renderMethodCard(
  cat: MethodCatalogEntry,
  onClick: () => void
): HTMLButtonElement {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  const tag =
    cat.mode === "first"
      ? "First-order y′ = f(t, y)"
      : "Second-order u″ = a(t, u)";
  card.innerHTML = `
    <h2>${cat.displayName}</h2>
    <p>${cat.blurb}</p>
    <span class="tag">${tag}</span>
  `;
  card.addEventListener("click", onClick);
  return card;
}

function renderSingleMethodGrid(): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "grid-methods";
  METHOD_CATALOG.forEach((cat) => {
    grid.append(
      renderMethodCard(cat, () => {
        session = { mode: "single" };
        selected = {
          family: cat.family,
          order: cat.orderDefault,
        };
        step = "configure";
        render();
      })
    );
  });
  return grid;
}

function renderCompareMethodGrid(): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "grid-methods";
  FIRST_ORDER_CATALOG.forEach((cat) => {
    grid.append(
      renderMethodCard(cat, () => {
        if (session.mode !== "compare_pick") return;
        const pick: SelectedMethod = {
          family: cat.family,
          order: cat.orderDefault,
        };
        if (session.first === null) {
          comparePickError = "";
          session = { mode: "compare_pick", first: pick };
          render();
          return;
        }
        const sameConfig =
          session.first.family === pick.family &&
          (session.first.order ?? cat.orderDefault) ===
            (pick.order ?? cat.orderDefault);
        if (sameConfig) {
          comparePickError =
            "Pick a different method (or change order p in the next step).";
          render();
          return;
        }
        comparePickError = "";
        session = { mode: "compare", a: session.first, b: pick };
        step = "configure";
        render();
      })
    );
  });
  return grid;
}

function firstOrderInputDefaults() {
  const p = persisted;
  return {
    t0: p.t0,
    tEnd: p.tEnd,
    h: p.h,
    y0: p.y0,
    order: p.order,
  };
}

function secondOrderInputDefaults() {
  const p = persisted;
  return {
    t0: p.t0,
    tEnd: p.tEnd,
    h: p.h,
    u0: p.u0,
    v0: p.v0,
  };
}

async function mountProductionExpressionField(
  wrap: HTMLElement,
  profile: ProductionMathProfile,
  onStateChanged?: () => void
): Promise<EditableMathFieldHandle | undefined> {
  const persistedState =
    profile === "rhs" ? persisted.firstExpression : persisted.secondExpression;
  const fieldId = profile === "rhs" ? "rhs-expression" : "second-order-rhs-expression";
  const fieldLabel =
    profile === "rhs"
      ? "Right-hand side of y prime"
      : "Leap-Frog acceleration right-hand side";
  const host = wrap.querySelector<HTMLElement>("[data-expression-field]")!;
  host.textContent = "Loading mathematical editor…";
  let mountEditableMathField: typeof import("./math/ui/editableMathField")["mountEditableMathField"];
  try {
    ({ mountEditableMathField } = await import("./math/ui/editableMathField"));
  } catch {
    if (wrap.isConnected) host.textContent = "The mathematical editor could not be loaded.";
    return undefined;
  }
  if (!wrap.isConnected) return undefined;
  activeExpressionField = mountEditableMathField(host, {
    fieldId,
    fieldLabel,
    profile,
    equationPrefix:
      profile === "rhs"
        ? { visual: "y′ =", accessible: "y prime equals" }
        : { visual: "u″ =", accessible: "u double prime equals" },
    initialConfirmed: persistedState.confirmed,
    initialDraftLatex: persistedState.draftLatex,
    initialValidation:
      persistedState.validationKind === "incomplete" ? "gentle" : "strict",
    description:
      profile === "rhs"
        ? "Use only t and y. Enter textbook-style mathematics."
        : "Use only t and u for the Leap-Frog acceleration.",
    onDraftStateChange(snapshot) {
      if (profile === "rhs") {
        persisted.firstExpression = persistMathFieldSnapshot(
          profile,
          snapshot,
          persisted.firstExpression
        );
      } else {
        persisted.secondExpression = persistMathFieldSnapshot(
          profile,
          snapshot,
          persisted.secondExpression
        );
      }
      if (profile === "rhs") recordTrackedEdit();
      activeExpressionSummary?.render([]);
      onStateChanged?.();
    },
    onLegacyPasteError(error) {
      const formError = wrap.querySelector<HTMLParagraphElement>("#form-error");
      if (formError) {
        formError.textContent = error.message;
        formError.hidden = false;
      }
      activeExpressionSummary?.render(
        [
          {
            fieldId,
            fieldLabel,
            message: error.message,
            focus: () => activeExpressionField?.focus(),
          },
        ],
        true
      );
    },
  });
  return activeExpressionField;
}

async function mountExactSolutionField(
  wrap: HTMLElement,
  onStateChanged?: () => void
): Promise<EditableMathFieldHandle | undefined> {
  const host = wrap.querySelector<HTMLElement>("[data-exact-expression-field]")!;
  host.textContent = "Loading mathematical editor…";
  let mountEditableMathField: typeof import("./math/ui/editableMathField")["mountEditableMathField"];
  try {
    ({ mountEditableMathField } = await import("./math/ui/editableMathField"));
  } catch {
    if (wrap.isConnected) host.textContent = "The mathematical editor could not be loaded.";
    return undefined;
  }
  if (!wrap.isConnected) return undefined;
  activeExactExpressionField = mountEditableMathField(host, {
    fieldId: "exact-solution-expression",
    fieldLabel: "Exact solution y of t",
    profile: "exact_solution",
    equationPrefix: { visual: "y(t) =", accessible: "y of t equals" },
    initialConfirmed: persisted.exactExpression.confirmed,
    initialDraftLatex: persisted.exactExpression.draftLatex,
    initialValidation:
      persisted.exactExpression.validationKind === "incomplete" ? "gentle" : "strict",
    description: "Use only t, t₀, and y₀. The exact solution is not used by the numerical solver.",
    onDraftStateChange(snapshot) {
      persisted.exactExpression = persistOptionalMathFieldSnapshot(
        snapshot,
        persisted.exactExpression
      );
      recordTrackedEdit();
      activeExpressionSummary?.render([]);
      onStateChanged?.();
    },
    onLegacyPasteError(error) {
      activeExpressionSummary?.render(
        [{
          fieldId: "exact-solution-expression",
          fieldLabel: "Exact solution y of t",
          message: error.message,
          focus: () => activeExactExpressionField?.focus(),
        }],
        true
      );
    },
  });
  return activeExactExpressionField;
}

function requireCurrentExpression(field: EditableMathFieldHandle) {
  const snapshot = field.validateStrict();
  const expression = currentReadyExpression(snapshot);
  if (expression) {
    activeExpressionSummary?.render([]);
    return expression;
  }
  const issue = field.getIssue();
  activeExpressionSummary?.render(issue ? [issue] : [], true);
  activeExpressionSummary?.element.focus();
  return undefined;
}

function requireCurrentExpressions(
  rhsField: EditableMathFieldHandle,
  exactField: EditableMathFieldHandle | undefined,
  exactEnabled: boolean
): { rhs: MathExpression; exact?: MathExpression } | undefined {
  const rhsSnapshot = rhsField.validateStrict();
  const rhs = currentReadyExpression(rhsSnapshot);
  const exactSnapshot = exactEnabled ? exactField?.validateStrict() : undefined;
  const exact = exactSnapshot ? currentReadyExpression(exactSnapshot) : undefined;
  const issues = [rhsField.getIssue(), exactEnabled ? exactField?.getIssue() : undefined]
    .filter((issue): issue is NonNullable<typeof issue> => Boolean(issue));
  if (!rhs || (exactEnabled && !exact)) {
    activeExpressionSummary?.render(issues, true);
    activeExpressionSummary?.element.focus();
    return undefined;
  }
  activeExpressionSummary?.render([]);
  return { rhs, exact };
}

function presetOptionsHtml(): string {
  return PROBLEM_PRESETS.map(
    (preset) => `<option value="${preset.id}">${preset.name}</option>`
  ).join("");
}

function currentSingleRunHasUnexecutedEdits(isSecond: boolean): boolean {
  if (!lastResult || !lastResultExpression || !lastProblemInputs) return false;
  if (isSecond) {
    if (lastProblemInputs.kind !== "second_order") return true;
    return (
      persisted.secondExpression.validationKind !== "ready" ||
      persisted.secondExpression.draftLatex !== lastResultExpression.expression.latex ||
      Number(persisted.t0) !== lastProblemInputs.t0 ||
      Number(persisted.tEnd) !== lastProblemInputs.tEnd ||
      Number(persisted.h) !== lastProblemInputs.h ||
      Number(persisted.u0) !== lastProblemInputs.u0 ||
      Number(persisted.v0) !== lastProblemInputs.v0
    );
  }
  if (lastProblemInputs.kind !== "first_order") return true;
  const currentRhs = persisted.firstExpression.confirmed;
  const rhsChanged =
    persisted.firstExpression.validationKind !== "ready" ||
    serializeMathAst(currentRhs.canonicalAst, "rhs") !==
      serializeMathAst(lastResultExpression.expression.canonicalAst, "rhs");
  const currentExact = persisted.exactExpression.confirmed;
  const savedExact = lastResultExpression.exactSolution;
  const exactChanged =
    persisted.exactSolutionEnabled !== lastResultExpression.exactSolutionEnabled ||
    (persisted.exactSolutionEnabled &&
      (persisted.exactExpression.validationKind !== "ready" ||
        !currentExact ||
        !savedExact ||
        serializeMathAst(currentExact.canonicalAst, "exact_solution") !==
          serializeMathAst(savedExact.canonicalAst, "exact_solution")));
  return (
    rhsChanged ||
    exactChanged ||
    presetFormState.presetId !== lastResultExpression.presetId ||
    presetFormState.customizationSourcePresetId !==
      lastResultExpression.customizationSourcePresetId ||
    Number(persisted.t0) !== lastProblemInputs.t0 ||
    Number(persisted.tEnd) !== lastProblemInputs.tEnd ||
    Number(persisted.h) !== lastProblemInputs.h ||
    Number(persisted.y0) !== lastProblemInputs.y0
  );
}

function requireFiniteField(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
}

const convergenceChartFactory: ConvergenceChartFactory = {
  create: (canvas, configuration) =>
    new Chart(canvas, configuration as unknown as ChartConfiguration),
};

function convergenceStateFor(
  snapshot: SuccessfulFirstOrderRunSnapshot
): ConvergenceUiState {
  const state = convergenceStates.get(snapshot.runFingerprint);
  const reconciled = reconcileConvergenceUiState(state, snapshot);
  if (reconciled !== state) convergenceStates.set(snapshot.runFingerprint, reconciled);
  return reconciled;
}

function storeConvergenceState(
  snapshot: SuccessfulFirstOrderRunSnapshot,
  state: ConvergenceUiState
): void {
  convergenceStates.set(snapshot.runFingerprint, state);
}

function convergenceConfig(
  snapshot: SuccessfulFirstOrderRunSnapshot,
  state: ConvergenceUiState,
  allowConsistencyWarning: boolean
): ConvergenceStudyConfig | undefined {
  if (!state.preview || !snapshot.exactSolutionEnabled || !snapshot.exactSolution) {
    return undefined;
  }
  return {
    method: snapshot.method,
    rhs: snapshot.rhs,
    exactSolution: snapshot.exactSolution,
    t0: snapshot.t0,
    y0: snapshot.y0,
    tEnd: snapshot.tEnd,
    baseStepSize: Number(state.baseStepSizeDraft),
    refinementLevels: Number(state.refinementLevelsDraft),
    runFingerprint: snapshot.runFingerprint,
    allowConsistencyWarning,
  };
}

function controlledConvergenceFailure(error: unknown): ConvergenceStudyFailure {
  if (error instanceof ConvergenceStudyFailure) return error;
  return new ConvergenceStudyFailure(
    "exact_evaluation_failure",
    error instanceof Error
      ? `The convergence study could not run because ${error.message}`
      : "The convergence study could not run because an unexpected evaluation failure occurred."
  );
}

function attemptConvergenceStudy(
  snapshot: SuccessfulFirstOrderRunSnapshot,
  allowConsistencyWarning: boolean
): void {
  let state = convergenceStateFor(snapshot);
  const fingerprint = currentStudyFingerprint(state);
  try {
    if (!fingerprint) {
      if (state.previewFailure) {
        state = recordConvergenceFailure(state, state.previewFailure);
        storeConvergenceState(snapshot, state);
      }
      return;
    }
    if (allowConsistencyWarning && !canRunConfirmedWarning(state, fingerprint)) {
      throw new ConvergenceStudyFailure(
        "warning_confirmation_required",
        "Confirm the numerical consistency warning for the current study settings before running."
      );
    }
    const config = convergenceConfig(snapshot, state, allowConsistencyWarning);
    if (!config) return;
    const consistencyCheck = checkConvergenceStudyConsistency(config);
    state = setConvergenceConsistency(state, fingerprint, consistencyCheck);
    storeConvergenceState(snapshot, state);
    if (consistencyCheck.status === "warning" && !allowConsistencyWarning) {
      storeConvergenceState(snapshot, requestWarningConfirmation(state, fingerprint));
      return;
    }
    validateConsistencyPermission(consistencyCheck, allowConsistencyWarning);
    const result = runConvergenceStudy(config);
    storeConvergenceState(snapshot, recordConvergenceSuccess(state, result));
  } catch (error) {
    state = convergenceStateFor(snapshot);
    storeConvergenceState(snapshot, recordConvergenceFailure(
      state,
      controlledConvergenceFailure(error)
    ));
  } finally {
    if (allowConsistencyWarning) {
      state = convergenceStateFor(snapshot);
      storeConvergenceState(snapshot, finishWarningAttempt(state));
    }
  }
}

function handleConvergenceIntent(
  snapshot: SuccessfulFirstOrderRunSnapshot,
  intent: ConvergenceStudyIntent
): void {
  let state = convergenceStateFor(snapshot);
  switch (intent.type) {
    case "drawer":
      state = setConvergenceDrawerOpen(state, intent.open);
      break;
    case "base_step":
      state = editConvergenceSetup(state, snapshot, { baseStepSizeDraft: intent.value });
      break;
    case "levels":
      state = editConvergenceSetup(state, snapshot, { refinementLevelsDraft: intent.value });
      break;
    case "metric":
      state = setConvergenceMetric(state, intent.metric);
      break;
    case "accordion":
      state = setTeachingAccordion(state, intent.id, intent.open);
      break;
    case "cancel_warning":
      state = cancelWarningConfirmation(state);
      break;
    case "run":
      attemptConvergenceStudy(snapshot, false);
      return;
    case "run_anyway":
      attemptConvergenceStudy(snapshot, true);
      return;
  }
  storeConvergenceState(snapshot, state);
}

function renderForm(meta: MethodCatalogEntry, sel: SelectedMethod): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "form-wrap";
  const isSecond = meta.mode === "second";
  const fo = firstOrderInputDefaults();
  const so = secondOrderInputDefaults();
  const t0v = isSecond ? so.t0 : fo.t0;
  const tEndv = isSecond ? so.tEnd : fo.tEnd;
  const hv = isSecond ? so.h : fo.h;
  const title = meta.displayName;

  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← All methods (keep my numbers)</button>
      <h2>${title}</h2>
      ${lastResult && lastResultExpression ? '<button type="button" class="btn secondary" data-return-output>Return to current output</button>' : ""}
    </div>
    <p class="unrun-edits-note" data-unrun-edits hidden>Your edits have not been run yet.</p>
    <form class="form" id="ode-form">
      ${!isSecond ? orderFieldHtml(meta) : ""}
      ${
        !isSecond
          ? `
      <section class="preset-panel wide" aria-labelledby="preset-heading">
        <div class="preset-select-row">
          <label class="field" for="problem-preset">
            <span id="preset-heading">Load problem preset</span>
            <select id="problem-preset" data-preset-select>
              <option value="">Choose a preset</option>
              ${presetOptionsHtml()}
            </select>
          </label>
          <button type="button" class="btn ghost" data-undo-preset hidden>Undo preset</button>
        </div>
        <div class="preset-confirmation" data-preset-confirmation hidden>
          <p>Loading this preset will replace the current problem fields.</p>
          <div class="preset-confirmation-actions">
            <button type="button" class="btn ghost" data-cancel-preset>Cancel</button>
            <button type="button" class="btn secondary" data-confirm-preset>Load preset</button>
          </div>
        </div>
        <p class="preset-identity" data-preset-identity></p>
        <div class="preset-guidance" data-preset-guidance hidden>
          <p data-preset-summary></p>
          <p data-preset-observation></p>
          <p data-preset-methods></p>
          <p class="preset-warning" data-preset-warning></p>
          <p data-preset-explicit-guidance hidden></p>
          <div class="preset-math-preview">
            <div><span>Equation</span><div data-preset-rhs-math></div></div>
            <div><span>Exact solution</span><div data-preset-exact-math></div></div>
          </div>
        </div>
      </section>
      `
          : ""
      }
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${t0v}" step="any" required />
      </label>
      <label class="field">
        <span>End time t_end</span>
        <input name="tEnd" type="number" value="${tEndv}" step="any" required />
      </label>
      <label class="field">
        <span>Run step size h = Δt</span>
        <input name="h" type="number" value="${hv}" min="1e-9" step="any" required />
      </label>
      ${
        isSecond
          ? `
      <label class="field">
        <span>Initial position u₀</span>
        <input name="u0" type="number" value="${so.u0}" step="any" required />
      </label>
      <label class="field">
        <span>Initial velocity u′₀</span>
        <input name="v0" type="number" value="${so.v0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      `
          : `
      <label class="field">
        <span>Initial value y₀</span>
        <input name="y0" type="number" value="${fo.y0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      <label class="exact-solution-switch wide">
        <input type="checkbox" data-exact-solution-toggle ${persisted.exactSolutionEnabled ? "checked" : ""} />
        <span>I know the exact solution</span>
      </label>
      <div class="exact-solution-field wide" data-exact-solution-region ${persisted.exactSolutionEnabled ? "" : "hidden"}>
        <div class="field wide" data-exact-expression-field></div>
        <p class="hint">Optional. Use only t, t₀, and y₀. It is checked for expression validity but does not alter the numerical integration.</p>
      </div>
      `
      }
      <p class="hint">${
        isSecond
          ? "Examples: −u, −2u, or cos(t) − u."
          : "Examples: −y, t − y, sin(t) − 0.1y, or e raised to t."
      }</p>
      <div class="wide" data-expression-summary></div>
      <div class="actions">
        <button type="submit" class="btn primary">Run simulation</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

  const summaryHost = wrap.querySelector<HTMLElement>("[data-expression-summary]")!;
  activeExpressionSummary = mountExpressionErrorSummary(summaryHost);

  const refreshUnrunNotice = (): void => {
    const note = wrap.querySelector<HTMLElement>("[data-unrun-edits]");
    if (note) note.hidden = !currentSingleRunHasUnexecutedEdits(isSecond);
  };

  const refreshPresetPresentation = (): void => {
    if (isSecond) return;
    const select = wrap.querySelector<HTMLSelectElement>("[data-preset-select]")!;
    const identity = wrap.querySelector<HTMLElement>("[data-preset-identity]")!;
    const undo = wrap.querySelector<HTMLButtonElement>("[data-undo-preset]")!;
    select.value = presetFormState.presetId ?? "";
    undo.hidden = !presetFormState.undoSnapshot;
    const sourceId = presetFormState.presetId ?? presetFormState.customizationSourcePresetId;
    identity.textContent = presetFormState.presetId
      ? `Loaded preset: ${problemPresetById(presetFormState.presetId).name}`
      : presetFormState.customizationSourcePresetId
        ? `Customised from: ${problemPresetById(presetFormState.customizationSourcePresetId).name}`
        : "";
    const guidance = wrap.querySelector<HTMLElement>("[data-preset-guidance]")!;
    guidance.hidden = !sourceId;
    if (!sourceId) return;
    const preset = problemPresetById(sourceId);
    wrap.querySelector<HTMLElement>("[data-preset-summary]")!.textContent = preset.teachingSummary;
    wrap.querySelector<HTMLElement>("[data-preset-observation]")!.textContent =
      `What to observe: ${preset.observationGuidance}`;
    wrap.querySelector<HTMLElement>("[data-preset-methods]")!.textContent =
      `Suggested methods: ${preset.suggestedMethods.map((family) => displayNameFor(family)).join(", ")}.`;
    wrap.querySelector<HTMLElement>("[data-preset-warning]")!.textContent = preset.warning;
    const explicit = wrap.querySelector<HTMLElement>("[data-preset-explicit-guidance]")!;
    explicit.hidden = !preset.explicitStepGuidance;
    explicit.textContent = preset.explicitStepGuidance ?? "";
    const rhsMath = wrap.querySelector<HTMLElement>("[data-preset-rhs-math]")!;
    const exactMath = wrap.querySelector<HTMLElement>("[data-preset-exact-math]")!;
    renderReadonlyMath(rhsMath, {
      latex: `y'=${preset.rhs.latex}`,
      displayText: `y prime equals ${preset.rhs.displayText}`,
      ariaLabel: `y prime equals ${preset.rhs.displayText}`,
    });
    renderReadonlyMath(exactMath, {
      latex: `y(t)=${preset.exactSolution.latex}`,
      displayText: `y of t equals ${preset.exactSolution.displayText}`,
      ariaLabel: `y of t equals ${preset.exactSolution.displayText}`,
    });
  };

  const expressionField = mountProductionExpressionField(
    wrap,
    isSecond ? "second_order_rhs" : "rhs",
    () => {
      refreshPresetPresentation();
      refreshUnrunNotice();
    }
  );
  const exactExpressionField = isSecond
    ? Promise.resolve(undefined)
    : mountExactSolutionField(wrap, () => {
        refreshPresetPresentation();
        refreshUnrunNotice();
      });

  const syncTrackedFormFields = (): void => {
    if (isSecond) return;
    const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
    persistFromFirstOrderFd(new FormData(form));
    persisted.exactSolutionEnabled =
      wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
    recordTrackedEdit();
  };

  const applyPresetStateToUi = async (): Promise<void> => {
    if (isSecond) return;
    applyTrackedFields(presetFormState.current);
    const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
    for (const [name, value] of [
      ["t0", persisted.t0],
      ["tEnd", persisted.tEnd],
      ["h", persisted.h],
      ["y0", persisted.y0],
    ] as const) {
      form.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value = value;
    }
    const toggle = wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!;
    toggle.checked = persisted.exactSolutionEnabled;
    wrap.querySelector<HTMLElement>("[data-exact-solution-region]")!.hidden = !toggle.checked;
    const [rhsHandle, exactHandle] = await Promise.all([expressionField, exactExpressionField]);
    rhsHandle?.restoreState(
      persisted.firstExpression.draftLatex,
      persisted.firstExpression.confirmed,
      persisted.firstExpression.validationKind === "incomplete" ? "gentle" : "strict"
    );
    exactHandle?.restoreState(
      persisted.exactExpression.draftLatex,
      persisted.exactExpression.confirmed,
      persisted.exactExpression.validationKind === "incomplete" ? "gentle" : "strict"
    );
    activeExpressionSummary?.render([]);
    refreshPresetPresentation();
    refreshUnrunNotice();
  };

  if (!isSecond) {
    let pendingPresetId: ProblemPresetId | undefined;
    const confirmation = wrap.querySelector<HTMLElement>("[data-preset-confirmation]")!;
    const select = wrap.querySelector<HTMLSelectElement>("[data-preset-select]")!;
    select.addEventListener("change", () => {
      if (!select.value) return;
      syncTrackedFormFields();
      pendingPresetId = select.value as ProblemPresetId;
      if (isPresetFormDirty(presetFormState)) {
        confirmation.hidden = false;
        select.value = presetFormState.presetId ?? "";
        return;
      }
      presetFormState = loadProblemPreset(presetFormState, pendingPresetId);
      pendingPresetId = undefined;
      void applyPresetStateToUi();
    });
    wrap.querySelector("[data-cancel-preset]")!.addEventListener("click", () => {
      pendingPresetId = undefined;
      confirmation.hidden = true;
      select.value = presetFormState.presetId ?? "";
    });
    wrap.querySelector("[data-confirm-preset]")!.addEventListener("click", () => {
      if (!pendingPresetId) return;
      presetFormState = loadProblemPreset(presetFormState, pendingPresetId);
      pendingPresetId = undefined;
      confirmation.hidden = true;
      void applyPresetStateToUi();
    });
    wrap.querySelector("[data-undo-preset]")!.addEventListener("click", () => {
      presetFormState = undoProblemPreset(presetFormState);
      void applyPresetStateToUi();
    });
    const exactToggle = wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!;
    exactToggle.addEventListener("change", () => {
      persisted.exactSolutionEnabled = exactToggle.checked;
      recordTrackedEdit();
      wrap.querySelector<HTMLElement>("[data-exact-solution-region]")!.hidden = !exactToggle.checked;
      activeExpressionSummary?.render([]);
      refreshPresetPresentation();
      refreshUnrunNotice();
    });
    for (const input of wrap.querySelectorAll<HTMLInputElement>(
      '[name="t0"], [name="tEnd"], [name="h"], [name="y0"]'
    )) {
      input.addEventListener("input", () => {
        syncTrackedFormFields();
        refreshPresetPresentation();
        refreshUnrunNotice();
      });
    }
    refreshPresetPresentation();
  }
  refreshUnrunNotice();

  wrap.querySelector("[data-return-output]")?.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
    readPersistedFromFormEl(form);
    if (!isSecond) {
      persisted.exactSolutionEnabled =
        wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
      recordTrackedEdit();
    }
    step = "results";
    render();
  });

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) readPersistedFromFormEl(form);
    step = "choose";
    selected = null;
    lastResult = null;
    lastResultExpression = null;
    lastCompare = null;
    lastProblemInputs = null;
    lastFirstOrderRunSnapshot = null;
    session = { mode: "single" };
    render();
  });

  wrap.querySelector("#ode-form")!.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const err = wrap.querySelector<HTMLParagraphElement>("#form-error")!;
    err.hidden = true;
    try {
      const fd = new FormData(form);
      const t0 = Number(fd.get("t0"));
      const tEnd = Number(fd.get("tEnd"));
      const h = Number(fd.get("h"));
      validateFixedStepGrid(t0, tEnd, h);
      if (isSecond) {
        requireFiniteField(Number(fd.get("u0")), "Initial position u₀");
        requireFiniteField(Number(fd.get("v0")), "Initial velocity u′₀");
      } else {
        requireFiniteField(Number(fd.get("y0")), "Initial value y₀");
      }
      const mountedExpressionField = await expressionField;
      if (!mountedExpressionField) {
        throw new Error("The mathematical editor is not available. Return to Step 2 and try again.");
      }
      let expression: MathExpression;
      let exactExpression: MathExpression | undefined;
      if (isSecond) {
        const ready = requireCurrentExpression(mountedExpressionField);
        if (!ready) return;
        expression = ready;
      } else {
        persistFromFirstOrderFd(fd);
        persisted.exactSolutionEnabled =
          wrap.querySelector<HTMLInputElement>("[data-exact-solution-toggle]")!.checked;
        recordTrackedEdit();
        const mountedExactField = await exactExpressionField;
        if (persisted.exactSolutionEnabled && !mountedExactField) {
          throw new Error("The exact-solution editor is not available. Return to Step 2 and try again.");
        }
        const ready = requireCurrentExpressions(
          mountedExpressionField,
          mountedExactField,
          persisted.exactSolutionEnabled
        );
        if (!ready) return;
        expression = ready.rhs;
        exactExpression = ready.exact;
      }

      let result: SolverResult;
      if (isSecond) {
        persistFromSecondOrderFd(fd);
        const u0 = Number(fd.get("u0"));
        const v0 = Number(fd.get("v0"));
        const a = compileProductionExpression(expression, "second_order_rhs");
        result = integrateSecondOrder({ t0, u0, v0, tEnd, h, a });
      } else {
        const y0 = Number(fd.get("y0"));
        const order = Number(fd.get("order"));
        sel.order = order;
        const f = compileProductionExpression(expression, "rhs");
        result = integrateFirstOrder(configFromSelection(sel), {
          t0,
          y0,
          tEnd,
          h,
          f,
        });
      }

      const expressionSnapshot = createSuccessfulExpressionSnapshot(
        expression,
        isSecond ? "second_order_rhs" : "rhs",
        isSecond
          ? {}
          : {
              exactSolutionEnabled: persisted.exactSolutionEnabled,
              exactSolution: exactExpression,
              presetId: presetFormState.presetId,
              customizationSourcePresetId: presetFormState.customizationSourcePresetId,
            }
      );
      lastCompare = null;
      lastResult = result;
      lastResultExpression = expressionSnapshot;
      if (isSecond) {
        lastFirstOrderRunSnapshot = null;
      } else {
        lastFirstOrderRunSnapshot = createSuccessfulFirstOrderRunSnapshot({
          metadata: result.metadata,
          rhs: expressionSnapshot.expression,
          exactSolutionEnabled: expressionSnapshot.exactSolutionEnabled,
          exactSolution: expressionSnapshot.exactSolution,
          t0,
          y0: Number(fd.get("y0")),
          tEnd,
          runStepSize: h,
          presetId: expressionSnapshot.presetId,
          customizationSourcePresetId: expressionSnapshot.customizationSourcePresetId,
        });
        storeConvergenceState(
          lastFirstOrderRunSnapshot,
          reconcileConvergenceUiState(
            convergenceStates.get(lastFirstOrderRunSnapshot.runFingerprint),
            lastFirstOrderRunSnapshot
          )
        );
      }
      lastProblemInputs = isSecond
        ? {
            kind: "second_order",
            equationDisplay: expressionSnapshot.equationDisplay,
            t0,
            tEnd,
            h,
            u0: Number(fd.get("u0")),
            v0: Number(fd.get("v0")),
          }
        : {
            kind: "first_order",
            equationDisplay: expressionSnapshot.equationDisplay,
            t0,
            tEnd,
            h,
            y0: Number(fd.get("y0")),
          };
      resetTutorConversation();
      step = "results";
      render();
    } catch (e) {
      err.textContent = e instanceof Error ? e.message : String(e);
      err.hidden = false;
    }
  });

  return wrap;
}

function renderCompareForm(
  metaA: MethodCatalogEntry,
  metaB: MethodCatalogEntry,
  selA: SelectedMethod,
  selB: SelectedMethod
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "form-wrap";
  const fo = firstOrderInputDefaults();

  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← Change method pair</button>
      <h2>Compare: ${metaA.displayName} vs ${metaB.displayName}</h2>
      ${lastCompare ? '<button type="button" class="btn secondary" data-return-output>Return to current output</button>' : ""}
    </div>
    <p class="hint">Set order p for each multistep method before running (defaults from method cards).</p>
    <form class="form" id="ode-form">
      <label class="field">
        <span>Order p — ${metaA.displayName}</span>
        <input name="orderA" type="number" min="${metaA.orderMin ?? 1}" max="${metaA.orderMax ?? 8}" value="${selA.order ?? metaA.orderDefault ?? 2}" ${metaA.hasOrderSelector ? "required" : "disabled"} />
      </label>
      <label class="field">
        <span>Order p — ${metaB.displayName}</span>
        <input name="orderB" type="number" min="${metaB.orderMin ?? 1}" max="${metaB.orderMax ?? 8}" value="${selB.order ?? metaB.orderDefault ?? 2}" ${metaB.hasOrderSelector ? "required" : "disabled"} />
      </label>
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${fo.t0}" step="any" required />
      </label>
      <label class="field">
        <span>End time t_end</span>
        <input name="tEnd" type="number" value="${fo.tEnd}" step="any" required />
      </label>
      <label class="field">
        <span>Step size h</span>
        <input name="h" type="number" value="${fo.h}" min="1e-9" step="any" required />
      </label>
      <label class="field">
        <span>Initial value y₀</span>
        <input name="y0" type="number" value="${fo.y0}" step="any" required />
      </label>
      <div class="field wide" data-expression-field></div>
      <p class="hint">The same right-hand side is used by both methods.</p>
      <div class="wide" data-expression-summary></div>
      <p class="hint multistep-note">For multistep methods, startup values are generated by Runge-Kutta 4.</p>
      <div class="actions">
        <button type="submit" class="btn primary">Run comparison</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

  activeExpressionSummary = mountExpressionErrorSummary(
    wrap.querySelector<HTMLElement>("[data-expression-summary]")!
  );
  const expressionField = mountProductionExpressionField(wrap, "rhs");

  wrap.querySelector("[data-return-output]")?.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form")!;
    persistFromFirstOrderFd(new FormData(form));
    recordTrackedEdit();
    step = "results";
    render();
  });

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) {
      persistFromFirstOrderFd(new FormData(form));
      recordTrackedEdit();
    }
    step = "choose";
    lastCompare = null;
    lastResult = null;
    lastResultExpression = null;
    lastProblemInputs = null;
    lastFirstOrderRunSnapshot = null;
    session = { mode: "compare_pick", first: null };
    render();
  });

  wrap.querySelector("#ode-form")!.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const err = wrap.querySelector<HTMLParagraphElement>("#form-error")!;
    err.hidden = true;
    if (session.mode !== "compare") return;
    try {
      const fd = new FormData(form);
      persistFromFirstOrderFd(fd);
      recordTrackedEdit();
      const t0 = Number(fd.get("t0"));
      const tEnd = Number(fd.get("tEnd"));
      const h = Number(fd.get("h"));
      const y0 = Number(fd.get("y0"));
      validateFixedStepGrid(t0, tEnd, h);
      requireFiniteField(y0, "Initial value y₀");
      const mountedExpressionField = await expressionField;
      if (!mountedExpressionField) {
        throw new Error("The mathematical editor is not available. Return to Step 2 and try again.");
      }
      const expression = requireCurrentExpression(mountedExpressionField);
      if (!expression) return;
      const f = compileProductionExpression(expression, "rhs");

      const a: SelectedMethod = {
        ...session.a,
        order: metaA.hasOrderSelector
          ? Number(fd.get("orderA"))
          : typeof metaA.orderOfAccuracy === "number"
            ? metaA.orderOfAccuracy
            : undefined,
      };
      const b: SelectedMethod = {
        ...session.b,
        order: metaB.hasOrderSelector
          ? Number(fd.get("orderB"))
          : typeof metaB.orderOfAccuracy === "number"
            ? metaB.orderOfAccuracy
            : undefined,
      };

      const base = { t0, y0, tEnd, h, f };
      const resultA = integrateFirstOrder(configFromSelection(a), base);
      const resultB = integrateFirstOrder(configFromSelection(b), base);
      const expressionSnapshot = createSuccessfulExpressionSnapshot(expression, "rhs");
      lastResult = null;
      lastResultExpression = null;
      lastProblemInputs = null;
      lastFirstOrderRunSnapshot = null;
      lastCompare = { a, b, resultA, resultB, expression: expressionSnapshot };
      resetTutorConversation();
      step = "results";
      render();
    } catch (e) {
      err.textContent = e instanceof Error ? e.message : String(e);
      err.hidden = false;
    }
  });

  return wrap;
}

function goToMethodListKeepInputs(): void {
  step = "choose";
  selected = null;
  lastResult = null;
  lastResultExpression = null;
  lastCompare = null;
  lastProblemInputs = null;
  lastFirstOrderRunSnapshot = null;
  session = { mode: "single" };
  render();
}

function formatImplicitResidual(value: number): string {
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude < 1e-4 || magnitude >= 1e4) {
    return value.toExponential(3);
  }
  return value.toPrecision(6);
}

function implicitDiagnosticsHtml(meta: SolverResult["metadata"]): string {
  const diagnostics = meta.implicitDiagnostics;
  if (!diagnostics) return "";
  const solverName =
    diagnostics.nonlinearMethod === "fixed_point" ? "Fixed-point" : "Newton";
  return `
    <h4>Implicit solve diagnostics</h4>
    <dl class="meta-dl implicit-diagnostics">
      <dt>Nonlinear solver</dt><dd>${solverName}</dd>
      <dt>Total nonlinear iterations</dt><dd>${diagnostics.totalIterations}</dd>
      <dt>Maximum iterations in one step</dt><dd>${diagnostics.maxIterationsPerStep}</dd>
      <dt>Final residual</dt><dd>${formatImplicitResidual(diagnostics.finalResidual)}</dd>
      <dt>Maximum residual</dt><dd>${formatImplicitResidual(diagnostics.maxResidual)}</dd>
      <dt>Failed steps</dt><dd>${diagnostics.failedSteps}</dd>
    </dl>
    <p class="implicit-diagnostics-note">Nonlinear-solver convergence is different from absolute stability of the numerical method. A stable implicit scheme can still fail if its nonlinear equation is not solved successfully.</p>
  `;
}

function metadataPanelHtml(meta: SolverResult["metadata"]): string {
  const coeffText = formatCoefficients(
    meta.coefficients?.alpha,
    meta.coefficients?.beta
  );
  const notesHtml = meta.notes
    .map((n) => `<li>${escapeHtml(n)}</li>`)
    .join("");
  return `
    <section class="edu-panel">
      <h3>Method details</h3>
      <dl class="meta-dl">
        <dt>Method</dt><dd>${escapeHtml(meta.displayName)}</dd>
        <dt>Order of accuracy p</dt><dd>${meta.order}</dd>
        <dt>Type</dt><dd>${meta.isImplicit ? "Implicit" : "Explicit"}</dd>
        ${
          meta.startupMethod
            ? `<dt>Startup</dt><dd>${escapeHtml(meta.startupMethod)}</dd>`
            : ""
        }
      </dl>
      ${implicitDiagnosticsHtml(meta)}
      <h4>Formula</h4>
      <div class="formula-block" data-method-formula>${escapeHtml(meta.formulaDisplay)}</div>
      ${
        coeffText
          ? `<h4>Coefficients</h4><div class="formula-inline">${escapeHtml(coeffText)}</div>`
          : ""
      }
      ${
        notesHtml
          ? `<h4>Notes</h4><ul class="edu-notes">${notesHtml}</ul>`
          : ""
      }
    </section>
  `;
}

function renderMethodFormulas(
  container: Element,
  methods: Array<Pick<MethodCatalogEntry, "family" | "formulaDisplay">>
): void {
  container.querySelectorAll<HTMLElement>("[data-method-formula]").forEach((target, index) => {
    const formula = methods[index] ? methodMathContent(methods[index]!).formula : undefined;
    if (formula) renderReadonlyMath(target, formula, { display: "block" });
  });
}

function renderResultsShell(
  meta: MethodCatalogEntry,
  result: SolverResult,
  expression: SuccessfulExpressionSnapshot
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "results-wrap";
  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div class="results-layout">
      <div class="results-main" id="results-body"></div>
      <div id="ai-tutor-host"></div>
    </div>
  `;
  wrap.querySelector("[data-back]")!.addEventListener("click", () => {
    step = "configure";
    render();
  });
  wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
    goToMethodListKeepInputs();
  });
  queueMicrotask(() => {
    mountResults(meta, result, expression);
    const tutorHost = wrap.querySelector<HTMLDivElement>("#ai-tutor-host");
    if (tutorHost) {
      mountAiTutorPanel(tutorHost, {
        enabled: true,
        result,
        meta,
        problem: lastProblemInputs,
        getChart: () => chart,
      });
    }
  });
  return wrap;
}

function renderCompareResultsShell(
  metaA: MethodCatalogEntry,
  metaB: MethodCatalogEntry,
  resultA: SolverResult,
  resultB: SolverResult,
  expression: SuccessfulExpressionSnapshot
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "results-wrap";
  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-pair>Change method pair</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div class="results-layout">
      <div class="results-main" id="results-body"></div>
      <div id="ai-tutor-host"></div>
    </div>
  `;
  wrap.querySelector("[data-back]")!.addEventListener("click", () => {
    step = "configure";
    render();
  });
  wrap.querySelector("[data-pair]")!.addEventListener("click", () => {
    step = "choose";
    lastCompare = null;
    lastResult = null;
    lastResultExpression = null;
    lastProblemInputs = null;
    lastFirstOrderRunSnapshot = null;
    session = { mode: "compare_pick", first: null };
    render();
  });
  wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
    goToMethodListKeepInputs();
  });
  queueMicrotask(() => {
    mountCompareResults(metaA, metaB, resultA, resultB, expression);
    const tutorHost = wrap.querySelector<HTMLDivElement>("#ai-tutor-host");
    if (tutorHost) {
      mountAiTutorPanel(tutorHost, {
        enabled: false,
        result: null,
        meta: null,
        problem: null,
        getChart: () => chart,
      });
    }
  });
  return wrap;
}

function mountResults(
  meta: MethodCatalogEntry,
  result: SolverResult,
  expression: SuccessfulExpressionSnapshot
): void {
  const body = document.querySelector("#results-body");
  if (!body) return;

  const series = result.points;
  const last = series[series.length - 1]!;
  const valueLabel = meta.mode === "second" ? "u" : "y";

  body.innerHTML = `
    <section class="summary">
      <h2>${result.metadata.displayName} · results</h2>
      <div class="problem-equation" data-problem-equation></div>
      <div class="stat-grid">
        <div class="stat">
          <span class="stat-label">Steps taken</span>
          <span class="stat-value">${series.length}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Final time</span>
          <span class="stat-value">${last.t.toFixed(6)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Final ${valueLabel}</span>
          <span class="stat-value">${last.y.toFixed(8)}</span>
        </div>
        ${
          meta.mode === "second" && last.v !== undefined
            ? `<div class="stat"><span class="stat-label">Final u′</span><span class="stat-value">${last.v.toFixed(8)}</span></div>`
            : ""
        }
      </div>
    </section>
    ${metadataPanelHtml(result.metadata)}
    ${meta.mode === "first" ? '<div data-convergence-study-host></div>' : ""}
    <section class="chart-section">
      <canvas id="plot" height="120"></canvas>
    </section>
    <section class="table-section">
      <h3>Last 12 values</h3>
      <div class="table-scroll">
        <table>
          <thead>
            <tr><th>t</th><th>${valueLabel}</th>${meta.mode === "second" ? "<th>u′</th>" : ""}</tr>
          </thead>
          <tbody>
            ${series
              .slice(-12)
              .map(
                (p) =>
                  `<tr><td>${p.t.toFixed(5)}</td><td>${p.y.toFixed(8)}</td>${
                    meta.mode === "second"
                      ? `<td>${p.v?.toFixed(8) ?? ""}</td>`
                      : ""
                  }</tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const equationTarget = body.querySelector<HTMLElement>("[data-problem-equation]");
  if (equationTarget) renderReadonlyMath(equationTarget, expression.equation, { display: "block" });
  renderMethodFormulas(body, [meta]);

  const convergenceHost = body.querySelector<HTMLElement>("[data-convergence-study-host]");
  if (convergenceHost && lastFirstOrderRunSnapshot) {
    const snapshot = lastFirstOrderRunSnapshot;
    const eligibility = convergenceEligibility({ kind: "first_order", snapshot });
    if (eligibility.showDrawer) {
      convergenceStateFor(snapshot);
      activeConvergenceView = mountConvergenceStudyView(convergenceHost, {
        snapshot,
        getState: () => convergenceStateFor(snapshot),
        onIntent: (intent) => handleConvergenceIntent(snapshot, intent),
        chartFactory: convergenceChartFactory,
      });
    }
  }

  drawSingleChart(meta, series);
}

function drawSingleChart(
  meta: MethodCatalogEntry,
  series: SeriesPoint[]
): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#plot");
  if (!canvas) return;
  chart?.destroy();
  const ts = series.map((p) => p.t.toFixed(3));
  const ys = series.map((p) => p.y);
  const valueLabel = meta.mode === "second" ? "u" : "y";

  const datasets =
    meta.mode === "second" && series.some((p) => p.v !== undefined)
      ? [
          {
            label: "u(t)",
            data: ys,
            borderColor: "#5b8cff",
            tension: 0.15,
            fill: false,
            pointRadius: 0,
          },
          {
            label: "u′(t)",
            data: series.map((p) => p.v ?? NaN),
            borderColor: "#7ae2a8",
            tension: 0.15,
            fill: false,
            pointRadius: 0,
          },
        ]
      : [
          {
            label: `${valueLabel}(t)`,
            data: ys,
            borderColor: "#5b8cff",
            backgroundColor: "rgba(91, 140, 255, 0.12)",
            tension: 0.15,
            fill: true,
            pointRadius: 0,
          },
        ];

  chart = new Chart(canvas, {
    type: "line",
    data: { labels: ts, datasets },
    options: chartOptions(series, meta.mode === "second" ? "u , u′" : valueLabel),
  });
}

function chartOptions(
  series: SeriesPoint[],
  yTitle: string
): object {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: "#d8e2ff" } },
      title: {
        display: true,
        text: "Approximate solution vs time",
        color: "#f2f5ff",
        font: { size: 16, weight: "600" },
      },
      tooltip: {
        callbacks: {
          title: (items: { dataIndex?: number }[]) => {
            const i = items[0]?.dataIndex ?? 0;
            return `t = ${series[i]?.t.toFixed(6)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "t", color: "#9fb2df" },
        ticks: { color: "#9fb2df", maxTicksLimit: 8 },
        grid: { color: "rgba(255, 255, 255, 0.06)" },
      },
      y: {
        title: { display: true, text: yTitle, color: "#9fb2df" },
        ticks: { color: "#9fb2df" },
        grid: { color: "rgba(255, 255, 255, 0.06)" },
      },
    },
  };
}

function mountCompareResults(
  metaA: MethodCatalogEntry,
  metaB: MethodCatalogEntry,
  resultA: SolverResult,
  resultB: SolverResult,
  expression: SuccessfulExpressionSnapshot
): void {
  const body = document.querySelector("#results-body");
  if (!body) return;

  const seriesA = resultA.points;
  const seriesB = resultB.points;
  const la = seriesA[seriesA.length - 1]!;
  const lb = seriesB[seriesB.length - 1]!;
  const diff = Math.abs(la.y - lb.y);

  if (seriesA.length !== seriesB.length) {
    body.innerHTML =
      '<p class="compare-error">Series length mismatch; plots may be unreliable.</p>';
    return;
  }

  body.innerHTML = `
    <section class="summary">
      <h2>Comparison · ${resultA.metadata.displayName} vs ${resultB.metadata.displayName}</h2>
      <div class="problem-equation" data-problem-equation></div>
      <div class="stat-grid">
        <div class="stat"><span class="stat-label">Steps (each)</span><span class="stat-value">${seriesA.length}</span></div>
        <div class="stat"><span class="stat-label">Final time</span><span class="stat-value">${la.t.toFixed(6)}</span></div>
        <div class="stat"><span class="stat-label">Final y — ${escapeHtml(resultA.metadata.displayName)}</span><span class="stat-value">${la.y.toFixed(8)}</span></div>
        <div class="stat"><span class="stat-label">Final y — ${escapeHtml(resultB.metadata.displayName)}</span><span class="stat-value">${lb.y.toFixed(8)}</span></div>
        <div class="stat"><span class="stat-label">|uₙ − yₙ| at final t</span><span class="stat-value">${diff.toExponential(4)}</span></div>
      </div>
    </section>
    <div class="compare-meta-grid">
      ${metadataPanelHtml(resultA.metadata)}
      ${metadataPanelHtml(resultB.metadata)}
    </div>
    <section class="chart-section">
      <canvas id="plot" height="120"></canvas>
    </section>
    <section class="table-section">
      <h3>Last 12 steps (both methods)</h3>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>t</th>
              <th>y — ${escapeHtml(resultA.metadata.displayName)}</th>
              <th>y — ${escapeHtml(resultB.metadata.displayName)}</th>
              <th>|Δy|</th>
            </tr>
          </thead>
          <tbody>
            ${(() => {
              const tailA = seriesA.slice(-12);
              const off = seriesA.length - tailA.length;
              return tailA
                .map((pa, idx) => {
                  const pb = seriesB[off + idx]!;
                  return `<tr><td>${pa.t.toFixed(5)}</td><td>${pa.y.toFixed(8)}</td><td>${pb.y.toFixed(8)}</td><td>${Math.abs(pa.y - pb.y).toExponential(4)}</td></tr>`;
                })
                .join("");
            })()}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const equationTarget = body.querySelector<HTMLElement>("[data-problem-equation]");
  if (equationTarget) renderReadonlyMath(equationTarget, expression.equation, { display: "block" });

  renderMethodFormulas(body, [metaA, metaB]);

  const canvas = document.querySelector<HTMLCanvasElement>("#plot");
  if (!canvas) return;
  chart?.destroy();
  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: seriesA.map((p) => p.t.toFixed(3)),
      datasets: [
        {
          label: resultA.metadata.displayName,
          data: seriesA.map((p) => p.y),
          borderColor: "#5b8cff",
          tension: 0.15,
          pointRadius: 0,
        },
        {
          label: resultB.metadata.displayName,
          data: seriesB.map((p) => p.y),
          borderColor: "#ffb86b",
          tension: 0.15,
          pointRadius: 0,
        },
      ],
    },
    options: chartOptions(seriesA, "y"),
  });
}

render();
