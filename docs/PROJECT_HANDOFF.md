# Numerical ODE Lab — Project Handoff

This document is the durable handoff for future Cursor agents. **Do not rely on prior chat history.** Use this file plus the codebase as the source of truth.

Repository: [TYD-Bruce/numerical-ode-lab](https://github.com/TYD-Bruce/numerical-ode-lab)

---

## 1. Project identity

| Field | Value |
|--------|--------|
| **App title** | Numerical ODE Lab |
| **Subtitle / eyebrow** | AI-Assisted Educational Solver |
| **Purpose** | Educational web app for numerical methods on **scalar initial value problems (IVPs)**. Students choose a method, enter a model and time grid, run the solver, and inspect numeric output, plots, method metadata, and (for multistep methods) generated coefficients. |

The app should feel like a real teaching tool, not a toy starter template.

---

## 2. Current technical stack

| Layer | Choice |
|--------|--------|
| Language | TypeScript (strict) |
| Bundler / dev server | Vite 5 (`npm run dev` → http://localhost:5173/) |
| Charts | Chart.js 4 |
| Tests | Vitest (`npm run test:run`) |
| CI | GitHub Actions runs `npm ci` then `npm run verify` on push and pull requests |
| Math in UI | **Unicode / plain text only** (KaTeX was removed; do not reintroduce raw LaTeX in visible UI without a renderer) |

### Main source files

| File | Role |
|------|------|
| `src/solvers.ts` | Integration API, one-step and generic multistep solvers, expression compile, `SolverResult` + metadata |
| `src/grid.ts` | Shared fixed-step grid validation, alignment tolerance, and browser-safe step cap |
| `src/polynomial.ts` | Polynomial helpers + Lagrange-based coefficient generators (AB, AM, BDF) |
| `src/coefficientValidation.ts` | Self-checks for reference coefficients + simple Forward Euler sanity log |
| `src/methodCatalog.ts` | Display names, blurbs, Unicode `formulaDisplay` strings |
| `src/mathDisplay.ts` | `escapeHtml`, `formatCoefficients` for UI |
| `src/main.ts` | 3-step UI: choose method → data → results; compare-two-methods flow |
| `src/style.css` | Dark educational theme |
| `index.html` | Shell + fonts (no KaTeX CDN) |

### npm scripts

```bash
npm install
npm run dev      # local development
npm run test:run # deterministic Vitest suite
npm run verify   # tests, frontend/API type checks, and production build
npm run build    # tsc && vite build
npm run preview  # preview production build
```

---

## 3. Mathematical notation rules

### Standard IVP (first-order)

- **IVP:** y′ = f(t, y), y(t₀) = y₀

### Time grid and solution

- h = Δt  
- tₙ = t₀ + nh  
- yₙ = y(tₙ) (exact)  
- uₙ ≈ yₙ (numerical)  
- fₙ = f(tₙ, uₙ)

### Multistep history (code convention)

- `uHistory[0]` = uₙ, `uHistory[1]` = uₙ₋₁, …  
- `fHistory[0]` = fₙ, `fHistory[1]` = fₙ₋₁, …

### Visible UI text

- Use **human-readable Unicode / plain math** (e.g. y′, t₀, uₙ₊₁, Σ, α, β, Δ).
- **Do not** show raw LaTeX delimiters or commands in normal UI: no `\( ... \)`, `\[ ... \]`, `\alpha_j`, `u_{n+1}`, etc.

**Correct (UI):**  
`First-order IVP: y′ = f(t, y), y(t₀) = y₀.`

**Incorrect (UI):**  
`\(y'=f(t,y)\)`, `\(y(t_0)=y_0\)`

### TypeScript code identifiers

Use readable **ASCII** names in code, not Greek letters as variable names:

- `alpha[j]`, `beta[j]`, `uNext`, `uHistory`, `fHistory`, `tNext`, `order`, etc.

Internal storage may keep a future LaTeX field name only if it is **not** injected into visible HTML without a renderer.

---

## 4. UI naming rules

Internal `MethodFamily` ids use snake_case (e.g. `adams_bashforth`). **User-visible** names must be capitalized and polished:

| Internal family | Visible name |
|-----------------|--------------|
| `forward_euler` | Forward Euler |
| `backward_euler` | Backward Euler |
| `taylor` | Taylor Method (Order 2) |
| `rk4` | Runge-Kutta 4 |
| `adams_bashforth` | Adams-Bashforth (Order p) |
| `adams_moulton` | Adams-Moulton (Order p) |
| `bdf` | Backward Differentiation Formula (Order p) or **BDF (Order p)** |
| `leapfrog` | Leap-Frog |

Do not show snake_case method ids in the UI.

---

## 5. Current implemented solver architecture

### Entry points

```ts
interface MethodConfig {
  family: MethodFamily;
  order?: number;  // required for AB, AM, BDF
}

integrateFirstOrder(config, params) → SolverResult  // { points, metadata }
integrateSecondOrder(params) → SolverResult         // Leap-Frog only
compileScalarExpr(expr, "first" | "second")         // JS expression → function
```

`SolverResult.metadata` includes: `displayName`, `family`, `order`, `formulaDisplay`, `coefficients` (alpha/beta when applicable), `isImplicit`, `startupMethod`, `notes`, and optional `implicitDiagnostics` for implicit runs. Diagnostics aggregate the nonlinear method, iteration totals, per-step maximum, final/max residuals, and failed-step count.

### One-step methods (fixed implementations)

| Method | Status |
|--------|--------|
| Forward Euler | Implemented (`forwardEulerCore`) |
| Backward Euler | Implemented; scalar Newton solve by default (fixed-point remains an internal option) |
| Taylor Method (Order 2) | Implemented; numeric fₜ, fᵧ, y″ = fₜ + fᵧ f |
| Runge-Kutta 4 | Implemented |
| Leap-Frog | Implemented for u″ = a(t, u); **separate** second-order path |

### Generic multistep (coefficient-driven)

| Method | Arbitrary order? | Order UI range |
|--------|------------------|----------------|
| Adams-Bashforth | **Yes** — `adamsBashforthCoefficients(p)` + `adamsBashforthCore` | 1 ≤ p ≤ 8 |
| Adams-Moulton | **Yes** — `adamsMoultonCoefficients(p)` + `adamsMoultonCore` | 1 ≤ p ≤ 8 |
| BDF | **Yes** — `bdfCoefficients(p)` + `bdfCore` | 1 ≤ p ≤ 6 |

**Generic coefficient generators exist** in `src/polynomial.ts`:

- `adamsBashforthCoefficients(order)`
- `adamsMoultonCoefficients(order)`
- `bdfCoefficients(order)`
- Helpers: `lagrangeBasis`, `integrateLagrangeBasis`, `derivativeOfLagrangeAt`, polynomial add/multiply/integrate/derivative, etc.

There are **no** separate hard-coded `AB3`, `AB4`, `BDF3` functions — orders are generated from Lagrange interpolation.

### Validation

- `src/coefficientValidation.ts` runs on module load: checks AB/AM/BDF reference coefficients (tolerance 1e-10) and a simple Forward Euler decay sanity log in dev.
- Vitest covers coefficient, BDF, fixed-grid, finite-input/RHS, nonlinear-solver, and solver-result invariants. The suite evolves; run `npm run test:run` for the current count.
- All fixed-step solvers require a positive, grid-aligned integer `N = (tEnd - t0) / h`; no final short step is used. The active limit is 100,000 steps, and numeric inputs plus evaluated RHS outputs must be finite. See `docs/NUMERICAL_CONTRACTS.md`.

### Known incomplete / out-of-scope (do not assume done)

- No systems of ODEs.
- No adaptive time stepping.
- No arbitrary Runge-Kutta order or arbitrary Taylor order.
- No PDE content.
- Expression evaluation uses `new Function` — acceptable for **local educational use only**; not safe for untrusted public input.
- Compare mode: order defaults come from method cards; users can edit order on the compare form for multistep methods, but picking two methods on the grid does not yet expose per-method order before the data step (only on compare form).
- No README in repo root (handoff + code only).
- Observed order / global error study UI not implemented (sanity check is console-only).

---

## 6. Multistep method requirements

### Adams-Bashforth (order p)

**Formula (UI):**  
uₙ₊₁ = uₙ + h Σ βⱼ fₙ₋ⱼ, j = 0,…,p−1

**Coefficients:**  
s = (t − tₙ) / h. Interpolation nodes s = 0, −1, …, −(p−1).  
βⱼ = ∫₀¹ Lⱼ(s) ds where Lⱼ is the Lagrange basis for node −j.

**Implementation:** `adamsBashforthCoefficients` + explicit step using `fHistory`.

### Adams-Moulton (order p)

**Formula (UI):**  
uₙ₊₁ = uₙ + h(β₋₁ fₙ₊₁ + β₀ fₙ + …)

**Coefficients:**  
Nodes s = 1, 0, −1, …, −(p−2). Integrate each Lⱼ over [0, 1].  
β[0] corresponds to fₙ₊₁, β[1] to fₙ, etc.

**Implicit solve:** Adams-Bashforth predictor followed by a scalar Newton solve by default. Fixed-point iteration remains available internally for tests/teaching comparisons. The nonlinear solver uses both update and residual tolerances and reports controlled failure reasons; convergence of this iteration is distinct from method stability.

### BDF (order p)

**Formula (UI):**  
Σ αⱼ uₙ₊₁₋ⱼ = h f(tₙ₊₁, uₙ₊₁), j = 0,…,p

**Coefficients:**  
Interpolate through solution nodes s = 0, −1, …, −p (s = 0 → uₙ₊₁).  
αⱼ = (d/ds Lⱼ)|_{s=0}.

**Solve:**  
The BDF algebraic residual is solved by scalar Newton iteration by default; its fixed-point rearrangement remains available internally. A nonlinear-iteration failure does not by itself imply BDF scheme instability.

**History indexing:** `bdfCore` uses `history[j - 1]` for each historical αⱼ term, where `history[0] = uₙ`.

**Restrict:** 1 ≤ p ≤ 6 in UI and validation.

---

## 7. Startup values

- Multistep method of order p needs **p − 1** startup steps after the initial value (p = 1 needs none beyond u₀).
- **Startup method:** Runge-Kutta 4 with the **same** step size h as the main integration.
- Bootstrap builds `uHistory` / `fHistory` with **newest first**: `history[0]` = current uₙ, `history[1]` = uₙ₋₁, etc.
- AB, AM, and BDF share `bootstrapMultistep(p, order)`; BDF does not bootstrap an extra point. Every order-p multistep run requires at least p fixed steps so its selected formula executes at least once.

Metadata should show: **Startup method: Runge-Kutta 4** when applicable.

---

## 8. Required coefficient checks

Tolerance: `|a − b| < 1e−10` (see `COEFF_TOL` in `polynomial.ts`).

| Method | Order | Expected coefficients |
|--------|-------|------------------------|
| AB | 1 | [1] |
| AB | 2 | [3/2, −1/2] |
| AB | 3 | [23/12, −16/12, 5/12] |
| AM | 1 | [1] |
| AM | 2 | [1/2, 1/2] |
| AM | 3 | [5/12, 8/12, −1/12] |
| BDF | 1 | [1, −1] |
| BDF | 2 | [3/2, −2, 1/2] |

Implemented in `runCoefficientValidation()` in `src/coefficientValidation.ts`.

---

## 9. Current known UI issue (resolved — guard against regression)

**Problem that was fixed:** Visible UI showed raw LaTeX such as `\(y'=f(t,y)\)` because KaTeX was not reliably rendering.

**Current rule:** All user-facing strings must use Unicode/plain math (see §3). Formulas use `formulaDisplay` in `methodCatalog.ts` / `SolverMetadata`, rendered as plain HTML via `escapeHtml` in `mathDisplay.ts`. **Do not** add `\( ... \)` to labels, hints, errors, or notes without installing and wiring a math renderer end-to-end.

If adding KaTeX/MathJax later:

1. Load the library in `index.html`.
2. Render only designated formula nodes.
3. Keep fallback plain Unicode for labels and errors.

---

## 10. UI flow (current)

1. **Method** — grid of methods; optional **Compare two methods** (first-order only; Leap-Frog excluded).
2. **Data** — t₀, t_end, h, y₀ (or u₀, v₀ for Leap-Frog), expression; order selector p for AB / AM / BDF.
3. **Output** — final values, Chart.js plot, method metadata panel (formula, coefficients, notes), last 12 steps table. Successful implicit runs also show aggregate nonlinear-solve diagnostics; explicit runs omit that section.

The AI Method Tutor context copies `implicitDiagnostics` only when present in the actual `SolverResult.metadata`, so live and demo responses can discuss measured iteration counts and residuals without fabricating them.

Navigation:

- **All methods (keep my numbers)** — returns to step 1 and preserves form values in memory.
- Compare flow: pick method A, then B → shared data form → overlaid plot + difference table.

---

## 11. Next recommended tasks (ordered, small scope)

1. **Add `README.md`** at repo root with install, `npm run dev`, project overview, and link to this handoff — lowest risk, helps new contributors.
2. **Compare mode UX:** when picking two methods on the grid, allow setting **different orders p** per method on the compare data form (partially exists; verify disabled fields for non-multistep and document behavior).
3. **Educational “observed order” panel** for the model y′ = y, y(0) = 1: run two step sizes, estimate order from error at t = 1 vs e — small UI addition, reuses existing solvers.
4. **Persist inputs in `localStorage`** so refresh does not lose t₀, h, expression, and order p — small `main.ts` change, high student UX value.

---

## 12. Agent guidelines

- Prefer **small, focused diffs**; do not rewrite the whole app unless asked.
- Keep charting and expression parsing working unless intentionally changing them.
- Match existing naming: `MethodFamily`, `MethodConfig`, `SolverResult`, `METHOD_CATALOG`.
- After changing coefficient math, run / extend validation in `coefficientValidation.ts`.
- Before shipping UI copy, grep for `\\(`, `\\)`, `\\alpha`, `\\beta`, `_{`, `^{` in `src/main.ts` and user-visible catalog strings.

---

*Last updated to reflect the codebase after generic multistep solvers, Unicode UI math, compare flow, and removal of KaTeX.*
