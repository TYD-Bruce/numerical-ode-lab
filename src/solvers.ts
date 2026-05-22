import {
  adamsBashforthCoefficients,
  adamsMoultonCoefficients,
  bdfCoefficients,
} from "./polynomial";
import { catalogByFamily, displayNameFor } from "./methodCatalog";
import { runCoefficientValidation, runSanityCheck } from "./coefficientValidation";

export type OdeMode = "first" | "second";

export type MethodFamily =
  | "forward_euler"
  | "backward_euler"
  | "taylor"
  | "rk4"
  | "adams_bashforth"
  | "adams_moulton"
  | "bdf"
  | "leapfrog";

export interface MethodConfig {
  family: MethodFamily;
  order?: number;
}

export interface FirstOrderParams {
  t0: number;
  y0: number;
  tEnd: number;
  h: number;
  f: (t: number, y: number) => number;
}

export interface SecondOrderParams {
  t0: number;
  u0: number;
  v0: number;
  tEnd: number;
  h: number;
  a: (t: number, u: number) => number;
}

export interface SeriesPoint {
  t: number;
  y: number;
  v?: number;
}

export interface SolverMetadata {
  displayName: string;
  family: MethodFamily;
  order: number;
  formulaType: string;
  formulaDisplay: string;
  coefficients?: { alpha?: number[]; beta?: number[] };
  isImplicit: boolean;
  startupMethod?: string;
  notes: string[];
}

export interface SolverResult {
  points: SeriesPoint[];
  metadata: SolverMetadata;
}

const IMPLICIT_MAX_IT = 100;
const IMPLICIT_TOL = 1e-10;
const STARTUP_LABEL = "Runge-Kutta 4";

function assertStepPositive(h: number): void {
  if (!(h > 0)) {
    throw new Error("Step size h must be positive.");
  }
}

function countSteps(t0: number, tEnd: number, h: number): number {
  if (tEnd < t0) {
    throw new Error("End time must satisfy t_end ≥ t₀.");
  }
  const n = Math.floor((tEnd - t0) / h + 1e-12);
  if (n < 1) {
    throw new Error("Time span is too short for the chosen step size h.");
  }
  return n;
}

function assertFinite(value: number, context: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`Non-finite numerical result during ${context}.`);
  }
}

function solveImplicit(
  g: (uNext: number) => number,
  guess: number,
  label: string
): number {
  let u = guess;
  for (let i = 0; i < IMPLICIT_MAX_IT; i++) {
    const un = g(u);
    if (!Number.isFinite(un)) {
      throw new Error(
        "The implicit iteration produced a non-finite value. Try a smaller step size h."
      );
    }
    if (Math.abs(un - u) < IMPLICIT_TOL) return un;
    u = un;
  }
  throw new Error(
    `The implicit iteration did not converge (${label}). Try a smaller step size h.`
  );
}

function rk4Step(
  f: (t: number, y: number) => number,
  t: number,
  y: number,
  h: number
): { tNext: number; yNext: number } {
  const k1 = f(t, y);
  const k2 = f(t + h / 2, y + (h / 2) * k1);
  const k3 = f(t + h / 2, y + (h / 2) * k2);
  const k4 = f(t + h, y + h * k3);
  const yNext = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  return { tNext: t + h, yNext };
}

function validateOrder(family: MethodFamily, order: number | undefined): number {
  const cat = catalogByFamily(family);
  if (!cat.hasOrderSelector) {
    if (order !== undefined && order !== cat.orderOfAccuracy) {
      /* fixed-order methods ignore extra order */
    }
    return typeof cat.orderOfAccuracy === "number" ? cat.orderOfAccuracy : 1;
  }
  if (order === undefined || !Number.isInteger(order)) {
    throw new Error(`${cat.displayName} requires an integer order of accuracy p.`);
  }
  const min = cat.orderMin ?? 1;
  const max = cat.orderMax ?? 8;
  if (order < min || order > max) {
    if (family === "bdf") {
      throw new Error("BDF is currently restricted to 1 ≤ p ≤ 6.");
    }
    throw new Error(
      `${cat.displayName} requires order p with ${min} ≤ p ≤ ${max}.`
    );
  }
  return order;
}

function buildMetadata(
  config: MethodConfig,
  coeffs?: { alpha?: number[]; beta?: number[] }
): SolverMetadata {
  const cat = catalogByFamily(config.family);
  const order = validateOrder(config.family, config.order ?? cat.orderDefault);
  const notes: string[] = [];

  if (cat.isImplicit) {
    if (config.family === "backward_euler") {
      notes.push(
        "Backward Euler is implicit, so each step solves an equation for uₙ₊₁."
      );
    } else if (config.family === "adams_moulton") {
      notes.push(
        "Adams-Moulton is implicit. The app uses an Adams-Bashforth predictor and fixed-point correction."
      );
    } else if (config.family === "bdf") {
      notes.push(
        "BDF methods are usually restricted to orders 1 through 6 in standard practical use."
      );
      notes.push(
        "Each BDF step solves for uₙ₊₁ with scalar fixed-point iteration."
      );
    }
  }

  if (cat.hasOrderSelector) {
    notes.push(
      "Multistep methods require previous solution values. This app generates startup values using Runge-Kutta 4."
    );
    notes.push(
      "If the local truncation error is O(hᵖ⁺¹), then the global error is usually O(hᵖ), assuming stability."
    );
  }

  if (config.family === "leapfrog") {
    notes.push(
      "Leap-Frog is shown separately because it is naturally used here for second-order equations."
    );
  }

  return {
    displayName: displayNameFor(config.family, order),
    family: config.family,
    order,
    formulaType: cat.formulaType,
    formulaDisplay: cat.formulaDisplay,
    coefficients: coeffs,
    isImplicit: cat.isImplicit,
    startupMethod: cat.hasOrderSelector ? STARTUP_LABEL : undefined,
    notes,
  };
}

function pushPoint(out: SeriesPoint[], t: number, y: number): void {
  assertFinite(y, "integration");
  out.push({ t, y });
}

function forwardEulerCore(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  pushPoint(out, t, y);
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    y = y + h * p.f(t, y);
    t = tNext;
    pushPoint(out, t, y);
  }
  return out;
}

function backwardEulerCore(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  pushPoint(out, t, y);
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const yPred = y + h * p.f(t, y);
    y = solveImplicit(
      (uNext) => y + h * p.f(tNext, uNext),
      yPred,
      "Backward Euler"
    );
    t = tNext;
    pushPoint(out, t, y);
  }
  return out;
}

function taylorOrder2Core(p: FirstOrderParams, eps = 1e-6): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const ft = (t: number, y: number) =>
    (p.f(t + eps, y) - p.f(t - eps, y)) / (2 * eps);
  const fy = (t: number, y: number) =>
    (p.f(t, y + eps) - p.f(t, y - eps)) / (2 * eps);

  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  pushPoint(out, t, y);
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const f0 = p.f(t, y);
    const fp = ft(t, y) + fy(t, y) * f0;
    y = y + h * f0 + (h * h) / 2 * fp;
    t = tNext;
    pushPoint(out, t, y);
  }
  return out;
}

function rk4Core(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  pushPoint(out, t, y);
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const step = rk4Step(p.f, t, y, h);
    y = step.yNext;
    t = tNext;
    pushPoint(out, t, y);
  }
  return out;
}

/** Bootstrap multistep history with RK4; history[0]=current, history[j]=u at n-j. */
function bootstrapMultistep(
  p: FirstOrderParams,
  order: number
): { points: SeriesPoint[]; uHistory: number[]; fHistory: number[]; t: number } {
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let u = p.y0;
  pushPoint(out, t, u);
  const uHistory: number[] = [u];
  const fHistory: number[] = [p.f(t, u)];

  for (let k = 1; k < order; k++) {
    const tNext = Math.min(p.t0 + k * p.h, p.tEnd);
    const hStep = tNext - t;
    if (hStep <= 0) break;
    const { yNext } = rk4Step(p.f, t, u, hStep);
    u = yNext;
    t = tNext;
    uHistory.unshift(u);
    fHistory.unshift(p.f(t, u));
    pushPoint(out, t, u);
  }

  return { points: out, uHistory, fHistory, t };
}

function adamsBashforthCore(p: FirstOrderParams, order: number): SeriesPoint[] {
  const beta = adamsBashforthCoefficients(order);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const boot = bootstrapMultistep(p, order);
  const out = boot.points;
  let { uHistory, fHistory, t } = boot;
  const stepsDone = out.length - 1;

  for (let i = stepsDone; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    let uNext = uHistory[0]!;
    for (let j = 0; j < order; j++) {
      uNext += h * beta[j]! * fHistory[j]!;
    }
    uHistory.unshift(uNext);
    fHistory.unshift(p.f(tNext, uNext));
    uHistory.pop();
    fHistory.pop();
    t = tNext;
    pushPoint(out, t, uNext);
  }
  return out;
}

function adamsMoultonCore(p: FirstOrderParams, order: number): SeriesPoint[] {
  const beta = adamsMoultonCoefficients(order);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const boot = bootstrapMultistep(p, order);
  const out = boot.points;
  let { uHistory, fHistory, t } = boot;
  const stepsDone = out.length - 1;

  for (let i = stepsDone; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const uCurrent = uHistory[0]!;

    let predictor = uCurrent;
    const betaAb = adamsBashforthCoefficients(order);
    for (let j = 0; j < order; j++) {
      predictor += h * betaAb[j]! * fHistory[j]!;
    }

    const corrector = (uGuess: number) => {
      let sum = 0;
      sum += beta[0]! * p.f(tNext, uGuess);
      for (let j = 1; j < order; j++) {
        sum += beta[j]! * fHistory[j - 1]!;
      }
      return uCurrent + h * sum;
    };

    const uNext = solveImplicit(corrector, predictor, "Adams-Moulton");
    uHistory.unshift(uNext);
    fHistory.unshift(p.f(tNext, uNext));
    uHistory.pop();
    fHistory.pop();
    t = tNext;
    pushPoint(out, t, uNext);
  }
  return out;
}

function bdfCore(p: FirstOrderParams, order: number): SeriesPoint[] {
  const alpha = bdfCoefficients(order);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const boot = bootstrapMultistep(p, order + 1);
  const out = boot.points;
  let { uHistory, t } = boot;
  const stepsDone = out.length - 1;

  for (let i = stepsDone; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const history = uHistory.slice(0, order + 1);
    let explicit = 0;
    for (let j = 1; j <= order; j++) {
      explicit += alpha[j]! * history[j]!;
    }
    const a0 = alpha[0]!;
    const guess = history[0]!;
    const uNext = solveImplicit(
      (u) => (h * p.f(tNext, u) - explicit) / a0,
      guess,
      "BDF"
    );
    uHistory.unshift(uNext);
    if (uHistory.length > order + 1) uHistory.pop();
    t = tNext;
    pushPoint(out, t, uNext);
  }
  return out;
}

export function integrateFirstOrder(
  config: MethodConfig,
  p: FirstOrderParams
): SolverResult {
  const order = validateOrder(
    config.family,
    config.order ?? catalogByFamily(config.family).orderDefault
  );

  let points: SeriesPoint[];
  let coeffs: { alpha?: number[]; beta?: number[] } | undefined;

  switch (config.family) {
    case "forward_euler":
      points = forwardEulerCore(p);
      break;
    case "backward_euler":
      points = backwardEulerCore(p);
      break;
    case "taylor":
      points = taylorOrder2Core(p);
      break;
    case "rk4":
      points = rk4Core(p);
      break;
    case "adams_bashforth": {
      const beta = adamsBashforthCoefficients(order);
      coeffs = { beta };
      points = adamsBashforthCore(p, order);
      break;
    }
    case "adams_moulton": {
      const beta = adamsMoultonCoefficients(order);
      coeffs = { beta };
      points = adamsMoultonCore(p, order);
      break;
    }
    case "bdf": {
      const alpha = bdfCoefficients(order);
      coeffs = { alpha };
      points = bdfCore(p, order);
      break;
    }
    case "leapfrog":
      throw new Error("Leap-Frog uses integrateSecondOrder for u″ = a(t, u).");
    default: {
      const _ex: never = config.family;
      return _ex;
    }
  }

  return {
    points,
    metadata: buildMetadata({ family: config.family, order }, coeffs),
  };
}

export function integrateSecondOrder(p: SecondOrderParams): SolverResult {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let u = p.u0;
  let vm = p.v0 - (p.h / 2) * p.a(t, u);
  out.push({ t, y: u, v: p.v0 });
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    vm = vm + h * p.a(t, u);
    u = u + h * vm;
    t = tNext;
    const v = vm + (h / 2) * p.a(t, u);
    assertFinite(u, "Leap-Frog");
    out.push({ t, y: u, v });
  }
  return {
    points: out,
    metadata: buildMetadata({ family: "leapfrog" }),
  };
}

export function compileScalarExpr(
  expr: string,
  mode: OdeMode
): (t: number, y: number) => number {
  const trimmed = expr.trim();
  if (!trimmed) throw new Error("Function expression is empty.");
  try {
    if (mode === "first") {
      const fn = new Function("t", "y", `return (${trimmed});`) as (
        t: number,
        y: number
      ) => unknown;
      return (t, y) => {
        const v = Number(fn(t, y));
        if (!Number.isFinite(v)) {
          throw new Error("Function returned a non-finite value.");
        }
        return v;
      };
    }
    const fn = new Function("t", "u", `return (${trimmed});`) as (
      t: number,
      u: number
    ) => unknown;
    return (t, u) => {
      const v = Number(fn(t, u));
      if (!Number.isFinite(v)) {
        throw new Error("Function returned a non-finite value.");
      }
      return v;
    };
  } catch (e) {
    if (e instanceof Error && e.message.includes("non-finite")) throw e;
    throw new Error("Could not parse the function. Check JavaScript syntax.");
  }
}

/** Legacy alias: returns points only. */
export function integrateFirstOrderPoints(
  config: MethodConfig,
  p: FirstOrderParams
): SeriesPoint[] {
  return integrateFirstOrder(config, p).points;
}

runCoefficientValidation();
runSanityCheck();
