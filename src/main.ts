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
import type { FirstOrderMethodId, MethodId, SeriesPoint } from "./solvers";
import {
  integrateFirstOrder,
  leapfrog,
  compileScalarExpr,
} from "./solvers";
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

const METHODS: {
  id: MethodId;
  name: string;
  blurb: string;
  mode: "first" | "second";
}[] = [
  {
    id: "forward_euler",
    name: "Forward Euler",
    blurb: "Explicit first-order; simple and fast, can be unstable for stiff problems.",
    mode: "first",
  },
  {
    id: "backward_euler",
    name: "Backward Euler",
    blurb: "Implicit first-order; very stable, needs a fixed-point solve each step.",
    mode: "first",
  },
  {
    id: "taylor2",
    name: "Taylor (order 2)",
    blurb: "Uses f and numeric estimates of ∂f/∂t and ∂f/∂y for a second-order step.",
    mode: "first",
  },
  {
    id: "rk4",
    name: "Runge–Kutta 4",
    blurb: "Classic fourth-order explicit method; accurate for smooth problems.",
    mode: "first",
  },
  {
    id: "adams_bashforth",
    name: "Adams–Bashforth (2-step)",
    blurb: "Multistep explicit method; bootstrapped with one RK4 step.",
    mode: "first",
  },
  {
    id: "adams_moulton",
    name: "Adams–Moulton (2-step, PECE)",
    blurb: "Predictor–corrector multistep pair; more stable than AB alone.",
    mode: "first",
  },
  {
    id: "leapfrog",
    name: "Leapfrog",
    blurb: "For u'' = a(t, u). Good energy behavior on oscillatory systems.",
    mode: "second",
  },
  {
    id: "bdf2",
    name: "BDF (order 2)",
    blurb: "Implicit multistep; BDF1 bootstrap then BDF2 with fixed-point solves.",
    mode: "first",
  },
];

const FIRST_ORDER_LIST = METHODS.filter((m) => m.mode === "first");

type Step = "choose" | "configure" | "results";

type Session =
  | { mode: "single" }
  | { mode: "compare_pick"; first: MethodId | null }
  | { mode: "compare"; a: MethodId; b: MethodId };

interface PersistedForm {
  t0: string;
  tEnd: string;
  h: string;
  expr: string;
  y0: string;
  u0: string;
  v0: string;
  problemKind: "first" | "second";
}

let step: Step = "choose";
let session: Session = { mode: "single" };
let selected: MethodId | null = null;
let chart: Chart | null = null;
let lastSeries: SeriesPoint[] | null = null;
let lastCompare: {
  a: MethodId;
  b: MethodId;
  seriesA: SeriesPoint[];
  seriesB: SeriesPoint[];
} | null = null;
let persisted: PersistedForm | null = null;
let comparePickError = "";

const app = document.querySelector<HTMLDivElement>("#app")!;

function methodById(id: MethodId) {
  return METHODS.find((m) => m.id === id) ?? null;
}

function selectedMeta() {
  return selected ? methodById(selected) : null;
}

function persistFromFirstOrderFd(fd: FormData): void {
  persisted = {
    t0: String(fd.get("t0") ?? "0"),
    tEnd: String(fd.get("tEnd") ?? "5"),
    h: String(fd.get("h") ?? "0.05"),
    expr: String(fd.get("expr") ?? "-y"),
    y0: String(fd.get("y0") ?? "1"),
    u0: persisted?.u0 ?? "1",
    v0: persisted?.v0 ?? "0",
    problemKind: "first",
  };
}

function persistFromSecondOrderFd(fd: FormData): void {
  persisted = {
    t0: String(fd.get("t0") ?? "0"),
    tEnd: String(fd.get("tEnd") ?? "5"),
    h: String(fd.get("h") ?? "0.05"),
    expr: String(fd.get("expr") ?? "-u"),
    y0: persisted?.y0 ?? "1",
    u0: String(fd.get("u0") ?? "1"),
    v0: String(fd.get("v0") ?? "0"),
    problemKind: "second",
  };
}

function readPersistedFromFormEl(form: HTMLFormElement): void {
  const fd = new FormData(form);
  const hasY0 = fd.has("y0");
  if (hasY0) persistFromFirstOrderFd(fd);
  else persistFromSecondOrderFd(fd);
}

function render(): void {
  const meta = selectedMeta();
  app.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "shell";

  const comparePicking = session.mode === "compare_pick";
  const lede = comparePicking
    ? session.first === null
      ? "Choose the <strong>first</strong> first-order method (Leapfrog is not in this list). Then you will pick a second method and enter one shared model."
      : `First method: <strong>${methodById(session.first!)?.name}</strong>. Now choose a <strong>different</strong> second method.`
    : "Pick a method, enter your model and time settings, then inspect the last value and a time plot. Expressions use JavaScript syntax with variables <code>t</code> and <code>y</code> for first-order problems, or <code>t</code> and <code>u</code> for leapfrog (<code>u'' = a(t,u)</code>).";

  shell.innerHTML = `
    <header class="hero">
      <p class="eyebrow">Starter project</p>
      <h1>Numerical ODE Lab</h1>
      <p class="lede">${lede}</p>
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
      const ma = methodById(session.a);
      const mb = methodById(session.b);
      if (ma && mb) main.append(renderCompareForm(ma, mb));
      else {
        session = { mode: "single" };
        step = "choose";
        main.append(renderChoosePanel());
      }
    } else if (meta) {
      main.append(renderForm(meta));
    } else {
      step = "choose";
      main.append(renderChoosePanel());
    }
  } else if (step === "results") {
    if (lastCompare) {
      const ma = methodById(lastCompare.a);
      const mb = methodById(lastCompare.b);
      if (ma && mb) {
        main.append(
          renderCompareResultsShell(
            ma,
            mb,
            lastCompare.seriesA,
            lastCompare.seriesB
          )
        );
      } else {
        lastCompare = null;
        step = "choose";
        main.append(renderChoosePanel());
      }
    } else if (meta && lastSeries) {
      main.append(renderResultsShell(meta, lastSeries));
    } else {
      step = "configure";
      if (session.mode === "compare") {
        const ma = methodById(session.a);
        const mb = methodById(session.b);
        if (ma && mb) main.append(renderCompareForm(ma, mb));
        else main.append(renderChoosePanel());
      } else if (meta) main.append(renderForm(meta));
      else main.append(renderChoosePanel());
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
    bar.innerHTML = `
      <button type="button" class="btn ghost" data-cancel-compare>Cancel compare</button>
    `;
    bar
      .querySelector("[data-cancel-compare]")!
      .addEventListener("click", () => {
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
    <p class="compare-hint">Uses one shared <code>y′ = f(t,y)</code> setup (first-order solvers only).</p>
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

function renderSingleMethodGrid(): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "grid-methods";

  METHODS.forEach((m) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.innerHTML = `
      <h2>${m.name}</h2>
      <p>${m.blurb}</p>
      <span class="tag">${m.mode === "first" ? "First-order y′ = f(t,y)" : "Second-order u″ = a(t,u)"}</span>
    `;
    card.addEventListener("click", () => {
      session = { mode: "single" };
      selected = m.id;
      step = "configure";
      render();
    });
    grid.append(card);
  });

  return grid;
}

function renderCompareMethodGrid(): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "grid-methods";

  FIRST_ORDER_LIST.forEach((m) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.innerHTML = `
      <h2>${m.name}</h2>
      <p>${m.blurb}</p>
      <span class="tag">First-order y′ = f(t,y)</span>
    `;
    card.addEventListener("click", () => {
      if (session.mode !== "compare_pick") return;
      if (session.first === null) {
        comparePickError = "";
        session = { mode: "compare_pick", first: m.id };
        render();
        return;
      }
      if (session.first === m.id) {
        comparePickError = "Pick a different method for the second choice.";
        render();
        return;
      }
      comparePickError = "";
      session = { mode: "compare", a: session.first, b: m.id };
      step = "configure";
      render();
    });
    grid.append(card);
  });

  return grid;
}

function firstOrderInputDefaults() {
  const p = persisted;
  return {
    t0: p?.t0 ?? "0",
    tEnd: p?.tEnd ?? "5",
    h: p?.h ?? "0.05",
    y0: p?.y0 ?? "1",
    expr: p?.problemKind === "first" ? p.expr : "-y",
  };
}

function secondOrderInputDefaults() {
  const p = persisted;
  return {
    t0: p?.t0 ?? "0",
    tEnd: p?.tEnd ?? "5",
    h: p?.h ?? "0.05",
    u0: p?.u0 ?? "1",
    v0: p?.v0 ?? "0",
    expr: p?.problemKind === "second" ? p.expr : "-u",
  };
}

function renderForm(meta: (typeof METHODS)[number]): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "form-wrap";

  const isSecond = meta.mode === "second";
  const fo = firstOrderInputDefaults();
  const so = secondOrderInputDefaults();
  const t0v = isSecond ? so.t0 : fo.t0;
  const tEndv = isSecond ? so.tEnd : fo.tEnd;
  const hv = isSecond ? so.h : fo.h;

  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← All methods (keep my numbers)</button>
      <h2>${meta.name}</h2>
    </div>
    <form class="form" id="ode-form">
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${t0v}" step="any" required />
      </label>
      <label class="field">
        <span>End time</span>
        <input name="tEnd" type="number" value="${tEndv}" step="any" required />
      </label>
      <label class="field">
        <span>Step size h</span>
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
        <span>Initial velocity u′₀ (v₀)</span>
        <input name="v0" type="number" value="${so.v0}" step="any" required />
      </label>
      <label class="field wide">
        <span>Acceleration u″ = a(t, u) — use <code>t</code> and <code>u</code></span>
        <input name="expr" type="text" value="" required placeholder="-u" />
      </label>
      `
          : `
      <label class="field">
        <span>Initial value y₀</span>
        <input name="y0" type="number" value="${fo.y0}" step="any" required />
      </label>
      <label class="field wide">
        <span>Right-hand side y′ = f(t, y) — use <code>t</code> and <code>y</code></span>
        <input name="expr" type="text" value="" required placeholder="-y" />
      </label>
      `
      }
      <p class="hint">Examples: <code>-y</code>, <code>t - y</code>, <code>Math.sin(t) - 0.1*y</code></p>
      <div class="actions">
        <button type="submit" class="btn primary">Run simulation</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

  const exprEl = wrap.querySelector<HTMLInputElement>('input[name="expr"]');
  if (exprEl) exprEl.value = isSecond ? so.expr : fo.expr;

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) readPersistedFromFormEl(form);
    step = "choose";
    selected = null;
    lastSeries = null;
    lastCompare = null;
    session = { mode: "single" };
    render();
  });

  wrap.querySelector("#ode-form")!.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const err = wrap.querySelector<HTMLParagraphElement>("#form-error")!;
    err.hidden = true;
    try {
      const fd = new FormData(form);
      const t0 = Number(fd.get("t0"));
      const tEnd = Number(fd.get("tEnd"));
      const h = Number(fd.get("h"));
      const expr = String(fd.get("expr") ?? "");

      let series: SeriesPoint[];
      if (isSecond) {
        persistFromSecondOrderFd(fd);
        const u0 = Number(fd.get("u0"));
        const v0 = Number(fd.get("v0"));
        const acc = compileScalarExpr(expr, "second");
        series = leapfrog({ t0, u0, v0, tEnd, h, a: acc });
      } else {
        persistFromFirstOrderFd(fd);
        const y0 = Number(fd.get("y0"));
        const f = compileScalarExpr(expr, "first");
        const base = { t0, y0, tEnd, h, f };
        series = integrateFirstOrder(meta.id as FirstOrderMethodId, base);
      }

      lastCompare = null;
      lastSeries = series;
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
  metaA: (typeof METHODS)[number],
  metaB: (typeof METHODS)[number]
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "form-wrap";
  const fo = firstOrderInputDefaults();

  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back-methods>← Change method pair</button>
      <h2>Compare: ${metaA.name} vs ${metaB.name}</h2>
    </div>
    <form class="form" id="ode-form">
      <label class="field">
        <span>Start time t₀</span>
        <input name="t0" type="number" value="${fo.t0}" step="any" required />
      </label>
      <label class="field">
        <span>End time</span>
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
      <label class="field wide">
        <span>Shared right-hand side y′ = f(t, y) — use <code>t</code> and <code>y</code></span>
        <input name="expr" type="text" value="" required placeholder="-y" />
      </label>
      <p class="hint">Both integrators use the same f(t, y), times, and step size.</p>
      <div class="actions">
        <button type="submit" class="btn primary">Run comparison</button>
      </div>
      <p class="error" id="form-error" hidden></p>
    </form>
  `;

  const exprCmp = wrap.querySelector<HTMLInputElement>('input[name="expr"]');
  if (exprCmp) exprCmp.value = fo.expr;

  wrap.querySelector("[data-back-methods]")!.addEventListener("click", () => {
    const form = wrap.querySelector<HTMLFormElement>("#ode-form");
    if (form) persistFromFirstOrderFd(new FormData(form));
    step = "choose";
    lastCompare = null;
    lastSeries = null;
    session = { mode: "compare_pick", first: null };
    render();
  });

  wrap.querySelector("#ode-form")!.addEventListener("submit", (ev) => {
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
      const expr = String(fd.get("expr") ?? "");
      const y0 = Number(fd.get("y0"));
      const f = compileScalarExpr(expr, "first");
      const base = { t0, y0, tEnd, h, f };
      const idA = session.a as FirstOrderMethodId;
      const idB = session.b as FirstOrderMethodId;
      const seriesA = integrateFirstOrder(idA, base);
      const seriesB = integrateFirstOrder(idB, base);
      lastSeries = null;
      lastCompare = { a: session.a, b: session.b, seriesA, seriesB };
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
  lastSeries = null;
  lastCompare = null;
  session = { mode: "single" };
  render();
}

function renderResultsShell(
  meta: (typeof METHODS)[number],
  series: SeriesPoint[]
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "results-wrap";
  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div id="results-body"></div>
  `;
  wrap.querySelector("[data-back]")!.addEventListener("click", () => {
    step = "configure";
    render();
  });
  wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
    goToMethodListKeepInputs();
  });
  queueMicrotask(() => mountResults(meta, series));
  return wrap;
}

function renderCompareResultsShell(
  metaA: (typeof METHODS)[number],
  metaB: (typeof METHODS)[number],
  seriesA: SeriesPoint[],
  seriesB: SeriesPoint[]
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "results-wrap";
  wrap.innerHTML = `
    <div class="form-head">
      <button type="button" class="btn ghost" data-back>← Edit inputs</button>
      <button type="button" class="btn ghost" data-pair>Change method pair</button>
      <button type="button" class="btn ghost" data-methods>All methods (keep my numbers)</button>
    </div>
    <div id="results-body"></div>
  `;
  wrap.querySelector("[data-back]")!.addEventListener("click", () => {
    step = "configure";
    render();
  });
  wrap.querySelector("[data-pair]")!.addEventListener("click", () => {
    step = "choose";
    lastCompare = null;
    lastSeries = null;
    session = { mode: "compare_pick", first: null };
    render();
  });
  wrap.querySelector("[data-methods]")!.addEventListener("click", () => {
    goToMethodListKeepInputs();
  });
  queueMicrotask(() =>
    mountCompareResults(metaA, metaB, seriesA, seriesB)
  );
  return wrap;
}

function mountResults(
  meta: (typeof METHODS)[number],
  series: SeriesPoint[]
): void {
  const body = document.querySelector("#results-body");
  if (!body) return;

  const last = series[series.length - 1];
  const valueLabel = meta.mode === "second" ? "u" : "y";

  body.innerHTML = `
    <section class="summary">
      <h2>${meta.name} · results</h2>
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
            ? `
        <div class="stat">
          <span class="stat-label">Final u′</span>
          <span class="stat-value">${last.v.toFixed(8)}</span>
        </div>`
            : ""
        }
      </div>
    </section>
    <section class="chart-section">
      <canvas id="plot" height="120"></canvas>
    </section>
    <section class="table-section">
      <h3>Last 12 values</h3>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>t</th>
              <th>${valueLabel}</th>
              ${meta.mode === "second" ? "<th>u′</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${series
              .slice(-12)
              .map(
                (p) =>
                  `<tr><td>${p.t.toFixed(5)}</td><td>${p.y.toFixed(
                    8
                  )}</td>${
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

  const canvas = document.querySelector<HTMLCanvasElement>("#plot");
  if (!canvas) return;

  chart?.destroy();
  const ts = series.map((p) => p.t.toFixed(3));
  const ys = series.map((p) => p.y);

  const datasets =
    meta.mode === "second" && series.some((p) => p.v !== undefined)
      ? [
          {
            label: "u(t)",
            data: ys,
            borderColor: "#5b8cff",
            backgroundColor: "rgba(91, 140, 255, 0.12)",
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
    data: {
      labels: ts,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#d8e2ff" } },
        title: {
          display: true,
          text: "Solution vs time",
          color: "#f2f5ff",
          font: { size: 16, weight: "600" },
        },
        tooltip: {
          callbacks: {
            title: (items) => {
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
          grid: { color: "rgba(255,255,255,0.06)" },
        },
        y: {
          title: {
            display: true,
            text: meta.mode === "second" ? "u , u′" : valueLabel,
            color: "#9fb2df",
          },
          ticks: { color: "#9fb2df" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
    },
  });
}

function mountCompareResults(
  metaA: (typeof METHODS)[number],
  metaB: (typeof METHODS)[number],
  seriesA: SeriesPoint[],
  seriesB: SeriesPoint[]
): void {
  const body = document.querySelector("#results-body");
  if (!body) return;

  const la = seriesA[seriesA.length - 1];
  const lb = seriesB[seriesB.length - 1];
  const diff = Math.abs(la.y - lb.y);

  if (seriesA.length !== seriesB.length) {
    body.innerHTML =
      "<p class=\"compare-error\">Series length mismatch; plots may be unreliable.</p>";
    return;
  }

  body.innerHTML = `
    <section class="summary">
      <h2>Comparison · ${metaA.name} vs ${metaB.name}</h2>
      <div class="stat-grid">
        <div class="stat">
          <span class="stat-label">Steps (each)</span>
          <span class="stat-value">${seriesA.length}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Final time</span>
          <span class="stat-value">${la.t.toFixed(6)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Final y (${metaA.name})</span>
          <span class="stat-value">${la.y.toFixed(8)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Final y (${metaB.name})</span>
          <span class="stat-value">${lb.y.toFixed(8)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">|difference| at final t</span>
          <span class="stat-value">${diff.toExponential(4)}</span>
        </div>
      </div>
    </section>
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
              <th>y (${metaA.name})</th>
              <th>y (${metaB.name})</th>
              <th>|Δy|</th>
            </tr>
          </thead>
          <tbody>
            ${(() => {
              const tailA = seriesA.slice(-12);
              const off = seriesA.length - tailA.length;
              return tailA
                .map((pa, idx) => {
                  const pb = seriesB[off + idx];
                  const d = Math.abs(pa.y - pb.y);
                  return `<tr><td>${pa.t.toFixed(5)}</td><td>${pa.y.toFixed(
                    8
                  )}</td><td>${pb.y.toFixed(8)}</td><td>${d.toExponential(
                    4
                  )}</td></tr>`;
                })
                .join("");
            })()}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>("#plot");
  if (!canvas) return;

  chart?.destroy();
  const ts = seriesA.map((p) => p.t.toFixed(3));
  const ya = seriesA.map((p) => p.y);
  const yb = seriesB.map((p) => p.y);

  chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: ts,
      datasets: [
        {
          label: metaA.name,
          data: ya,
          borderColor: "#5b8cff",
          backgroundColor: "rgba(91, 140, 255, 0.08)",
          tension: 0.15,
          fill: false,
          pointRadius: 0,
        },
        {
          label: metaB.name,
          data: yb,
          borderColor: "#ffb86b",
          backgroundColor: "rgba(255, 184, 107, 0.08)",
          tension: 0.15,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#d8e2ff" } },
        title: {
          display: true,
          text: "y(t): both methods",
          color: "#f2f5ff",
          font: { size: 16, weight: "600" },
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex ?? 0;
              return `t = ${seriesA[i]?.t.toFixed(6)}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "t", color: "#9fb2df" },
          ticks: { color: "#9fb2df", maxTicksLimit: 8 },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
        y: {
          title: { display: true, text: "y", color: "#9fb2df" },
          ticks: { color: "#9fb2df" },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
    },
  });
}

render();
