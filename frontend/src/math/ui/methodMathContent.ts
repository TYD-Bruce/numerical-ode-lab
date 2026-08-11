import type { MethodCatalogEntry } from "@numerical-t-lab/numerics/ode/method-catalog";
import type { ReadonlyMathContent } from "./readonlyMath";

export interface MethodMathContent {
  formula?: ReadonlyMathContent;
}

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

export function methodMathContent(
  entry: Pick<MethodCatalogEntry, "family" | "formulaDisplay">
): MethodMathContent {
  return { formula: { ...FORMULAS[entry.family], displayText: entry.formulaDisplay } };
}
