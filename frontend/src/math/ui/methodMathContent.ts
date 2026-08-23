import type { MethodCatalogEntry } from "@numerical-t-lab/numerics/ode/method-catalog";
import type { ReadonlyMathContent } from "./readonlyMath";

export interface MethodMathContent {
  formula?: ReadonlyMathContent;
}

export type MethodTeachingSupportingFormulaId =
  | "backward_euler_predictor"
  | "backward_euler_residual"
  | "taylor_path_derivative"
  | "rk4_k1"
  | "rk4_k2"
  | "rk4_k3"
  | "rk4_k4"
  | "adams_moulton_predictor"
  | "leapfrog_initialization"
  | "leapfrog_reconstruction";

export interface MethodTeachingSupportingFormula {
  readonly id: MethodTeachingSupportingFormulaId;
  readonly title: string;
  readonly content: ReadonlyMathContent;
}

export const ODE_METHOD_FOUNDATION_MATH = Object.freeze({
  firstOrderIvp: Object.freeze({
    latex:
      "\\begin{aligned}y'(t)&=f(t,y),\\\\y(t_0)&=y_0\\end{aligned}",
    displayText: "y′(t) = f(t, y); y(t₀) = y₀",
    ariaLabel:
      "y prime of t equals f of t and y; y at t zero equals y zero",
  }),
  starterExample: Object.freeze({
    latex: "\\begin{aligned}y'&=-y,\\\\y(0)&=1\\end{aligned}",
    displayText: "y′ = −y; y(0) = 1",
    ariaLabel: "y prime equals negative y; y at zero equals one",
  }),
  secondOrderProfile: Object.freeze({
    latex:
      "\\begin{aligned}u''&=a(t,u),\\\\u(t_0)&=u_0,\\qquad u'(t_0)=v_0\\end{aligned}",
    displayText: "u″ = a(t, u); u(t₀) = u₀; u′(t₀) = v₀",
    ariaLabel:
      "u double prime equals a of t and u; u at t zero equals u zero; u prime at t zero equals v zero",
  }),
} satisfies Record<string, ReadonlyMathContent>);

const FORMULAS: Record<MethodCatalogEntry["family"], Omit<ReadonlyMathContent, "displayText">> = {
  forward_euler: { latex: "u_{n+1}=u_n+h f_n", ariaLabel: "u sub n plus 1 equals u sub n plus h times f sub n" },
  backward_euler: { latex: "u_{n+1}=u_n+h f(t_{n+1},u_{n+1})", ariaLabel: "u sub n plus 1 equals u sub n plus h times f of t sub n plus 1 and u sub n plus 1" },
  taylor: { latex: "u_{n+1}=u_n+h f_n+\\frac{h^2}{2}(f_t+f_y f)\\text{ at }(t_n,u_n)", ariaLabel: "the second-order Taylor method update evaluated at t sub n and u sub n" },
  rk4: { latex: "u_{n+1}=u_n+\\frac{h}{6}(k_1+2k_2+2k_3+k_4)", ariaLabel: "the Runge Kutta 4 weighted stage update" },
  adams_bashforth: { latex: "u_{n+1}=u_n+h\\sum_{j=0}^{p-1}\\beta_j f_{n-j}", ariaLabel: "the order p Adams Bashforth update" },
  adams_moulton: { latex: "u_{n+1}=u_n+h(\\beta_{-1}f_{n+1}+\\beta_0 f_n+\\cdots)", ariaLabel: "the implicit Adams Moulton update" },
  bdf: { latex: "\\sum_{j=0}^{p}\\alpha_j u_{n+1-j}=h f(t_{n+1},u_{n+1})", ariaLabel: "the order p backward differentiation formula" },
  leapfrog: { latex: "u''=a(t,u)", ariaLabel: "u double prime equals a of t and u" },
};

function supportingFormula(
  id: MethodTeachingSupportingFormulaId,
  title: string,
  content: ReadonlyMathContent
): MethodTeachingSupportingFormula {
  return Object.freeze({
    id,
    title,
    content: Object.freeze({ ...content }),
  });
}

const TEACHING_SUPPORTING_MATH: Readonly<
  Partial<
    Record<
      MethodCatalogEntry["family"],
      readonly MethodTeachingSupportingFormula[]
    >
  >
> = Object.freeze({
  backward_euler: Object.freeze([
    supportingFormula(
      "backward_euler_predictor",
      "Forward Euler predictor — starting guess only",
      {
        latex: "u_{n+1}^{(0)}=u_n+h f(t_n,u_n)",
        displayText: "uₙ₊₁⁽⁰⁾ = uₙ + h f(tₙ, uₙ)",
        ariaLabel:
          "the initial guess u sub n plus 1 superscript zero equals u sub n plus h times f of t sub n and u sub n",
      }
    ),
    supportingFormula(
      "backward_euler_residual",
      "Endpoint residual — the equation Newton solves",
      {
        latex: "R(z)=z-u_n-h f(t_{n+1},z)",
        displayText: "R(z) = z − uₙ − h f(tₙ₊₁, z)",
        ariaLabel:
          "R of z equals z minus u sub n minus h times f of t sub n plus 1 and z",
      }
    ),
  ]),
  taylor: Object.freeze([
    supportingFormula(
      "taylor_path_derivative",
      "How the slope changes along the solution path",
      {
        latex: "\\frac{d}{dt}f(t,y(t))=f_t+f_y f",
        displayText: "d/dt f(t, y(t)) = fₜ + fᵧ f",
        ariaLabel:
          "the derivative with respect to t of f of t and y of t equals f sub t plus f sub y times f",
      }
    ),
  ]),
  rk4: Object.freeze([
    supportingFormula("rk4_k1", "Stage 1 · start slope", {
      latex: "k_1=f(t_n,u_n)",
      displayText: "k₁ = f(tₙ, uₙ)",
      ariaLabel: "k 1 equals f of t sub n and u sub n",
    }),
    supportingFormula("rk4_k2", "Stage 2 · first midpoint slope", {
      latex: "k_2=f\\!\\left(t_n+\\frac{h}{2},u_n+\\frac{h}{2}k_1\\right)",
      displayText: "k₂ = f(tₙ + h/2, uₙ + (h/2)k₁)",
      ariaLabel:
        "k 2 equals f at t sub n plus h over 2 and u sub n plus h over 2 times k 1",
    }),
    supportingFormula("rk4_k3", "Stage 3 · second midpoint slope", {
      latex: "k_3=f\\!\\left(t_n+\\frac{h}{2},u_n+\\frac{h}{2}k_2\\right)",
      displayText: "k₃ = f(tₙ + h/2, uₙ + (h/2)k₂)",
      ariaLabel:
        "k 3 equals f at t sub n plus h over 2 and u sub n plus h over 2 times k 2",
    }),
    supportingFormula("rk4_k4", "Stage 4 · endpoint slope", {
      latex: "k_4=f(t_n+h,u_n+h k_3)",
      displayText: "k₄ = f(tₙ + h, uₙ + h k₃)",
      ariaLabel:
        "k 4 equals f at t sub n plus h and u sub n plus h times k 3",
    }),
  ]),
  adams_moulton: Object.freeze([
    supportingFormula(
      "adams_moulton_predictor",
      "Same-order Adams-Bashforth predictor — starting guess only",
      {
        latex:
          "u_{n+1}^{(0)}=u_n+h\\sum_{j=0}^{p-1}\\beta_j^{\\mathrm{AB}}f_{n-j}",
        displayText:
          "uₙ₊₁⁽⁰⁾ = uₙ + h Σⱼ₌₀ᵖ⁻¹ βⱼᴬᴮ fₙ₋ⱼ",
        ariaLabel:
          "the starting guess u sub n plus 1 superscript zero equals u sub n plus h times the sum from j equals zero to p minus one of the same-order Adams Bashforth beta sub j times the stored slope f sub n minus j",
      }
    ),
  ]),
  leapfrog: Object.freeze([
    supportingFormula(
      "leapfrog_initialization",
      "Initialize the staggered half-step velocity",
      {
        latex: "v_{-1/2}=v_0-\\frac{h}{2}a(t_0,u_0)",
        displayText: "v₋₁⁄₂ = v₀ − (h/2)a(t₀, u₀)",
        ariaLabel:
          "the half-step velocity before the initial time equals v zero minus one half h times acceleration at t zero and u zero",
      }
    ),
    supportingFormula(
      "leapfrog_reconstruction",
      "Reconstruction used for stored/output full-step velocity",
      {
        latex:
          "v_{n+1}=v_{n+1/2}+\\frac{h}{2}a(t_{n+1},u_{n+1})",
        displayText:
          "vₙ₊₁ = vₙ₊₁⁄₂ + (h/2)a(tₙ₊₁, uₙ₊₁)",
        ariaLabel:
          "the stored full-step velocity at n plus 1 equals the half-step velocity at n plus one half plus one half h times acceleration at the new time and position",
      }
    ),
  ]),
});

const LEAPFROG_TEACHING_FORMULA: ReadonlyMathContent = Object.freeze({
  latex:
    "\\begin{aligned}v_{n+1/2}&=v_{n-1/2}+h a(t_n,u_n),\\\\u_{n+1}&=u_n+h v_{n+1/2}\\end{aligned}",
  displayText:
    "vₙ₊₁⁄₂ = vₙ₋₁⁄₂ + h a(tₙ, uₙ); uₙ₊₁ = uₙ + h vₙ₊₁⁄₂",
  ariaLabel:
    "Update the next half-step velocity from the previous half-step velocity plus h times current acceleration; then update the next whole-step position using that half-step velocity.",
});

export function methodMathContent(
  entry: Pick<MethodCatalogEntry, "family" | "formulaDisplay">
): MethodMathContent {
  return { formula: { ...FORMULAS[entry.family], displayText: entry.formulaDisplay } };
}

/** Additive safe formula authority for the future teaching lens; current UI callers remain unchanged. */
export function methodTeachingMathContent(
  entry: Pick<MethodCatalogEntry, "family" | "formulaDisplay">
): MethodMathContent {
  if (entry.family === "leapfrog") {
    return { formula: { ...LEAPFROG_TEACHING_FORMULA } };
  }
  return methodMathContent(entry);
}

export function methodTeachingSupportingMathContent(
  family: MethodCatalogEntry["family"]
): readonly MethodTeachingSupportingFormula[] {
  return TEACHING_SUPPORTING_MATH[family] ?? Object.freeze([]);
}
