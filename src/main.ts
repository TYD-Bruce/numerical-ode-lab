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
import {
  compileProductionExpression,
  createDefaultMathExpressionState,
  createSuccessfulExpressionSnapshot,
  currentReadyExpression,
  persistMathFieldSnapshot,
  type PersistedMathExpressionState,
  type ProductionMathProfile,
  type SuccessfulExpressionSnapshot,
} from "./math/problemExpressions";
import type { EditableMathFieldHandle } from "./math/ui/editableMathField";
import {
  mountExpressionErrorSummary,
  type ExpressionErrorSummaryHandle,
} from "./math/ui/expressionErrorSummary";
import "./style.css";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
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
  y0: "1",
  u0: "1",
  v0: "0",
  order: "2",
};
let lastProblemInputs: ProblemInputs | null = null;
let comparePickError = "";
let activeExpressionField: EditableMathFieldHandle | null = null;
let activeExpressionSummary: ExpressionErrorSummaryHandle | null = null;

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
    y0: persisted?.y0 ?? "1",
    u0: String(fd.get("u0") ?? "1"),
    v0: String(fd.get("v0") ?? "0"),
    order: persisted?.order ?? "2",
  };
}

function readPersistedFromFormEl(form: HTMLFormElement): void {
  const fd = new FormData(form);
  if (fd.has("y0")) persistFromFirstOrderFd(fd);
  else persistFromSecondOrderFd(fd);
}

function disposeExpressionUi(): void {
  activeExpressionField?.dispose();
  activeExpressionSummary?.dispose();
  activeExpressionField = null;
  activeExpressionSummary = null;
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
  profile: ProductionMathProfile
): Promise<EditableMathFieldHandle | undefined> {
  const persistedState =
    profile === "rhs" ? persisted.firstExpression : persisted.secondExpression;
  const fieldId = profile === "rhs" ? "rhs-expression" : "second-order-rhs-expression";
  const fieldLabel =
    profile === "rhs"
      ? "Right-hand side of y prime"
      : "Leap-Frog acceleration right-hand side";
  const host = wrap.querySelector<HTMLElement>("[data-expression-field]")!;
  const summaryHost = wrap.querySelector<HTMLElement>("[data-expression-summary]")!;

  activeExpressionSummary = mountExpressionErrorSummary(summaryHost);
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
      activeExpressionSummary?.render([]);
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

function requireFiniteField(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
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
    </div>
    <form class="form" id="ode-form">
      ${!isSecond ? orderFieldHtml(meta) : ""}
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${t0v}" step="any" required />
      </label>
      <label class="field">
        <span>End time t_end</span>
        <input name="tEnd" type="number" value="${tEndv}" step="any" required />
      </label>
      <label class="field">
        <span>Step size h = Δt</span>
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

  const expressionField = mountProductionExpressionField(
    wrap,
    isSecond ? "second_order_rhs" : "rhs"
  );

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) readPersistedFromFormEl(form);
    step = "choose";
    selected = null;
    lastResult = null;
    lastResultExpression = null;
    lastCompare = null;
    lastProblemInputs = null;
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
      const expression = requireCurrentExpression(mountedExpressionField);
      if (!expression) return;

      let result: SolverResult;
      if (isSecond) {
        persistFromSecondOrderFd(fd);
        const u0 = Number(fd.get("u0"));
        const v0 = Number(fd.get("v0"));
        const a = compileProductionExpression(expression, "second_order_rhs");
        result = integrateSecondOrder({ t0, u0, v0, tEnd, h, a });
      } else {
        persistFromFirstOrderFd(fd);
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
        isSecond ? "second_order_rhs" : "rhs"
      );
      lastCompare = null;
      lastResult = result;
      lastResultExpression = expressionSnapshot;
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

  const expressionField = mountProductionExpressionField(wrap, "rhs");

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) persistFromFirstOrderFd(new FormData(form));
    step = "choose";
    lastCompare = null;
    lastResult = null;
    lastResultExpression = null;
    lastProblemInputs = null;
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
