/** Scalar ODE helpers for teaching-style solvers. */

export type OdeMode = "first" | "second";

export type MethodId =
  | "forward_euler"
  | "backward_euler"
  | "taylor2"
  | "rk4"
  | "adams_bashforth"
  | "adams_moulton"
  | "leapfrog"
  | "bdf2";

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
  /** u'' = a(t, u) */
  a: (t: number, u: number) => number;
}

export interface SeriesPoint {
  t: number;
  y: number;
  /** For second-order problems, y is position u; this holds velocity when present */
  v?: number;
}

function assertStepPositive(h: number): void {
  if (!(h > 0)) throw new Error("Step size h must be positive.");
}

function countSteps(t0: number, tEnd: number, h: number): number {
  if (tEnd < t0) throw new Error("End time must be >= start time.");
  const n = Math.floor((tEnd - t0) / h + 1e-12);
  if (n < 1) throw new Error("Time span too short for the chosen step size.");
  return n;
}

/** Fixed-point iteration for backward Euler / implicit stages (scalar). */
function solveImplicit(
  g: (yNext: number) => number,
  yGuess: number,
  maxIt = 50,
  tol = 1e-10
): number {
  let y = yGuess;
  for (let i = 0; i < maxIt; i++) {
    const yn = g(y);
    if (Math.abs(yn - y) < tol) return yn;
    y = yn;
  }
  return y;
}

export function forwardEuler(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    y = y + h * p.f(t, y);
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

export function backwardEuler(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const yPred = y + h * p.f(t, y);
    y = solveImplicit((yNext) => y + h * p.f(tNext, yNext), yPred);
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

/** Second-order Taylor using numeric partials of f(t,y). */
export function taylorOrder2(p: FirstOrderParams, eps = 1e-6): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const ft = (t: number, y: number) =>
    (p.f(t + eps, y) - p.f(t - eps, y)) / (2 * eps);
  const fy = (t: number, y: number) =>
    (p.f(t, y + eps) - p.f(t, y - eps)) / (2 * eps);

  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });
  for (let i = 0; i < n; i++) {
    const h = Math.min(p.t0 + (i + 1) * p.h, p.tEnd) - t;
    const f0 = p.f(t, y);
    const fp = ft(t, y) + fy(t, y) * f0;
    y = y + h * f0 + (h * h) / 2 * fp;
    t = t + h;
    out.push({ t, y });
  }
  return out;
}

export function rk4(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });
  for (let i = 0; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const k1 = p.f(t, y);
    const k2 = p.f(t + h / 2, y + (h / 2) * k1);
    const k3 = p.f(t + h / 2, y + (h / 2) * k2);
    const k4 = p.f(t + h, y + h * k3);
    y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

/** Adams–Bashforth 2-step after one RK4 step. */
export function adamsBashforth2(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  if (n < 1) return [{ t: p.t0, y: p.y0 }];

  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });

  const h0 = Math.min(p.h, p.tEnd - t);
  if (h0 <= 0) return out;

  const k1 = p.f(t, y);
  const k2 = p.f(t + h0 / 2, y + (h0 / 2) * k1);
  const k3 = p.f(t + h0 / 2, y + (h0 / 2) * k2);
  const k4 = p.f(t + h0, y + h0 * k3);
  const y1 = y + (h0 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  const t1 = t + h0;
  out.push({ t: t1, y: y1 });

  let fPrev = p.f(t, y);
  let fCurr = p.f(t1, y1);
  t = t1;
  y = y1;

  for (let i = 1; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const yNext = y + (h / 2) * (3 * fCurr - fPrev);
    fPrev = fCurr;
    fCurr = p.f(tNext, yNext);
    y = yNext;
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

/** Adams–Moulton 2-step PECE: AB2 predictor, AM2 corrector (one correction). */
export function adamsMoulton2(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });

  const h0 = Math.min(p.h, p.tEnd - t);
  if (h0 <= 0) return out;

  const k1 = p.f(t, y);
  const k2 = p.f(t + h0 / 2, y + (h0 / 2) * k1);
  const k3 = p.f(t + h0 / 2, y + (h0 / 2) * k2);
  const k4 = p.f(t + h0, y + h0 * k3);
  const y1 = y + (h0 / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  const t1 = t + h0;
  out.push({ t: t1, y: y1 });

  let fPrev = p.f(t, y);
  let fCurr = p.f(t1, y1);
  t = t1;
  y = y1;

  for (let i = 1; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const yPred = y + (h / 2) * (3 * fCurr - fPrev);
    const fPred = p.f(tNext, yPred);
    const yCorr = y + (h / 12) * (5 * fPred + 8 * fCurr - fPrev);
    fPrev = fCurr;
    fCurr = p.f(tNext, yCorr);
    y = yCorr;
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

/** Leapfrog for u'' = a(t, u), with velocity kick initialization. */
export function leapfrog(p: SecondOrderParams): SeriesPoint[] {
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
    out.push({ t, y: u, v });
  }
  return out;
}

/** BDF2: (3 y_{n+1} - 4 y_n + y_{n-1})/(2h) = f(t_{n+1}, y_{n+1}), after BDF1 bootstrap. */
export function bdf2(p: FirstOrderParams): SeriesPoint[] {
  assertStepPositive(p.h);
  const n = countSteps(p.t0, p.tEnd, p.h);
  const out: SeriesPoint[] = [];
  let t = p.t0;
  let y = p.y0;
  out.push({ t, y });

  const h0 = Math.min(p.h, p.tEnd - t);
  if (h0 <= 0) return out;

  const t1 = t + h0;
  const y1 = solveImplicit((yn) => y + h0 * p.f(t1, yn), y + h0 * p.f(t, y));
  out.push({ t: t1, y: y1 });

  let yPrev = y;
  y = y1;
  t = t1;

  for (let i = 1; i < n; i++) {
    const tNext = Math.min(p.t0 + (i + 1) * p.h, p.tEnd);
    const h = tNext - t;
    const explicit = (4 * y - yPrev) / 3;
    const yNext = solveImplicit(
      (yn) => explicit + (2 * h) / 3 * p.f(tNext, yn),
      y
    );
    yPrev = y;
    y = yNext;
    t = tNext;
    out.push({ t, y });
  }
  return out;
}

/** First-order integrators only (shared form y′ = f(t,y)). */
export type FirstOrderMethodId = Exclude<MethodId, "leapfrog">;

export function integrateFirstOrder(
  id: FirstOrderMethodId,
  p: FirstOrderParams
): SeriesPoint[] {
  switch (id) {
    case "forward_euler":
      return forwardEuler(p);
    case "backward_euler":
      return backwardEuler(p);
    case "taylor2":
      return taylorOrder2(p);
    case "rk4":
      return rk4(p);
    case "adams_bashforth":
      return adamsBashforth2(p);
    case "adams_moulton":
      return adamsMoulton2(p);
    case "bdf2":
      return bdf2(p);
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
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
      return (t, y) => Number(fn(t, y));
    }
    const fn = new Function("t", "u", `return (${trimmed});`) as (
      t: number,
      u: number
    ) => unknown;
    return (t, u) => Number(fn(t, u));
  } catch {
    throw new Error("Could not parse the function. Check JavaScript syntax.");
  }
}
