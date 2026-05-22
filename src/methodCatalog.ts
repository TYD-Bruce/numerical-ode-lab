import type { MethodFamily } from "./solvers";

export interface MethodCatalogEntry {
  family: MethodFamily;
  displayName: string;
  shortLabel: string;
  blurb: string;
  mode: "first" | "second";
  orderDefault?: number;
  orderMin?: number;
  orderMax?: number;
  hasOrderSelector: boolean;
  isImplicit: boolean;
  /** Human-readable formula for UI (Unicode, not LaTeX). */
  formulaDisplay: string;
  formulaType: string;
  orderOfAccuracy: number | "configurable";
}

export const METHOD_CATALOG: MethodCatalogEntry[] = [
  {
    family: "forward_euler",
    displayName: "Forward Euler",
    shortLabel: "Forward Euler",
    blurb: "Explicit first-order method. Global error is first order in the step size.",
    mode: "first",
    hasOrderSelector: false,
    isImplicit: false,
    orderOfAccuracy: 1,
    formulaType: "one-step-explicit",
    formulaDisplay: "uₙ₊₁ = uₙ + h fₙ",
  },
  {
    family: "backward_euler",
    displayName: "Backward Euler",
    shortLabel: "Backward Euler",
    blurb: "Implicit first-order method. Very stable; each step solves for the next value.",
    mode: "first",
    hasOrderSelector: false,
    isImplicit: true,
    orderOfAccuracy: 1,
    formulaType: "one-step-implicit",
    formulaDisplay: "uₙ₊₁ = uₙ + h f(tₙ₊₁, uₙ₊₁)",
  },
  {
    family: "taylor",
    displayName: "Taylor Method (Order 2)",
    shortLabel: "Taylor Method (Order 2)",
    blurb: "Uses partial derivatives of f for a second-order Taylor step.",
    mode: "first",
    hasOrderSelector: false,
    isImplicit: false,
    orderOfAccuracy: 2,
    formulaType: "one-step-explicit",
    formulaDisplay:
      "uₙ₊₁ = uₙ + h fₙ + (h²/2)(fₜ + fᵧ f) evaluated at (tₙ, uₙ)",
  },
  {
    family: "rk4",
    displayName: "Runge-Kutta 4",
    shortLabel: "Runge-Kutta 4",
    blurb: "Classic fourth-order explicit Runge-Kutta method for smooth problems.",
    mode: "first",
    hasOrderSelector: false,
    isImplicit: false,
    orderOfAccuracy: 4,
    formulaType: "one-step-explicit",
    formulaDisplay: "uₙ₊₁ = uₙ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)",
  },
  {
    family: "adams_bashforth",
    displayName: "Adams-Bashforth",
    shortLabel: "Adams-Bashforth",
    blurb: "Explicit multistep method; choose the order of accuracy p below.",
    mode: "first",
    orderDefault: 2,
    orderMin: 1,
    orderMax: 8,
    hasOrderSelector: true,
    isImplicit: false,
    orderOfAccuracy: "configurable",
    formulaType: "multistep-explicit",
    formulaDisplay: "uₙ₊₁ = uₙ + h Σ βⱼ fₙ₋ⱼ,  j = 0,…,p−1",
  },
  {
    family: "adams_moulton",
    displayName: "Adams-Moulton",
    shortLabel: "Adams-Moulton",
    blurb: "Implicit multistep method; Adams-Bashforth predictor and fixed-point correction.",
    mode: "first",
    orderDefault: 2,
    orderMin: 1,
    orderMax: 8,
    hasOrderSelector: true,
    isImplicit: true,
    orderOfAccuracy: "configurable",
    formulaType: "multistep-implicit",
    formulaDisplay: "uₙ₊₁ = uₙ + h(β₋₁ fₙ₊₁ + β₀ fₙ + ···)",
  },
  {
    family: "bdf",
    displayName: "Backward Differentiation Formula",
    shortLabel: "BDF",
    blurb: "Implicit BDF multistep; practical orders 1 through 6.",
    mode: "first",
    orderDefault: 2,
    orderMin: 1,
    orderMax: 6,
    hasOrderSelector: true,
    isImplicit: true,
    orderOfAccuracy: "configurable",
    formulaType: "multistep-implicit-bdf",
    formulaDisplay: "Σ αⱼ uₙ₊₁₋ⱼ = h f(tₙ₊₁, uₙ₊₁),  j = 0,…,p",
  },
  {
    family: "leapfrog",
    displayName: "Leap-Frog",
    shortLabel: "Leap-Frog",
    blurb: "For second-order equations u″ = a(t, u); separate from first-order IVPs.",
    mode: "second",
    hasOrderSelector: false,
    isImplicit: false,
    orderOfAccuracy: 2,
    formulaType: "second-order",
    formulaDisplay: "u″ = a(t, u)  (centered Leap-Frog stepping)",
  },
];

export function catalogByFamily(family: MethodFamily): MethodCatalogEntry {
  const e = METHOD_CATALOG.find((m) => m.family === family);
  if (!e) throw new Error(`Unknown method family: ${family}`);
  return e;
}

export function displayNameFor(
  family: MethodFamily,
  order?: number
): string {
  const c = catalogByFamily(family);
  if (c.hasOrderSelector && order !== undefined) {
    if (family === "bdf") return `BDF (Order ${order})`;
    if (family === "adams_bashforth")
      return `Adams-Bashforth (Order ${order})`;
    if (family === "adams_moulton")
      return `Adams-Moulton (Order ${order})`;
  }
  return c.displayName;
}

export const FIRST_ORDER_CATALOG = METHOD_CATALOG.filter(
  (m) => m.mode === "first"
);
