import type { MethodCatalogEntry } from "@numerical-t-lab/numerics/ode/method-catalog";
import type { ReadonlyMathContent } from "./readonlyMath";

export interface MethodMathContent {
  formula?: ReadonlyMathContent;
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

const LEAPFROG_TEACHING_FORMULA: ReadonlyMathContent = Object.freeze({
  latex:
    "\\begin{aligned}v_{-1/2}&=v_0-\\frac{h}{2}a(t_0,u_0),\\\\v_{n+1/2}&=v_{n-1/2}+h a(t_n,u_n),\\\\u_{n+1}&=u_n+h v_{n+1/2},\\\\v_{n+1}&=v_{n+1/2}+\\frac{h}{2}a(t_{n+1},u_{n+1})\\end{aligned}",
  displayText:
    "v₋₁⁄₂ = v₀ − (h/2)a(t₀,u₀); vₙ₊₁⁄₂ = vₙ₋₁⁄₂ + h a(tₙ,uₙ); uₙ₊₁ = uₙ + h vₙ₊₁⁄₂; vₙ₊₁ = vₙ₊₁⁄₂ + (h/2)a(tₙ₊₁,uₙ₊₁)",
  ariaLabel:
    "Initialize the half-step velocity before the initial time from v zero minus one half h times acceleration at t zero and u zero; update the next half-step velocity from the previous half-step velocity plus h times current acceleration; update the next whole-step position; then reconstruct the next full-step velocity with one half h times acceleration at the new time and position.",
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
