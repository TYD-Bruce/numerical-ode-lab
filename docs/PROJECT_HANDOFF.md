# Numerical ODE Lab — Project Handoff

This is the durable handoff for future contributors and Cursor agents. Use it with the current codebase; do not rely on prior chat history.

**Status:** Human-Friendly Math Expressions and the Version 1 Observed Convergence Order experiment were implemented and verified on 2026-07-11. Cursor final review is complete with the verdict **Safe to release Version 1**. P0 blockers: none. P1 issues: none. The final reviewed implementation commit is `9d7b2f71b1c8013c612f0df0663bb786cabab570`; no future extension is implied by this status.

## 1. Project identity

Numerical ODE Lab is an educational browser application for scalar fixed-step initial value problems. Its three-step flow is **Method → Data → Output**. Students can run one method, compare two first-order methods, inspect plots and method metadata, and ask a grounded AI Method Tutor about successful single-method runs.

## 2. Technical stack

| Layer | Choice |
|---|---|
| Language | Strict TypeScript |
| Frontend | Vite 5 |
| Charts | Chart.js 4 |
| Mathematical editing/rendering | MathLive 0.110.0 |
| LaTeX adapter | Compute Engine 0.58.0 raw MathJSON |
| Tests | Vitest; 701 tests passing across 35 files at Convergence Phase F finalization |
| API | Vercel function plus local `server/dev.ts` |

MathLive and Compute Engine are deferred from the landing-screen bundle. Opening a Step 2 mathematical field loads the editable/Compute Engine chunk and MathLive assets. Static formulas use the shared lazy read-only renderer.

Useful commands:

```bash
npm run test:run
npm run typecheck
npm run typecheck:api
npm run build
npm run verify
npm run dev
npm run dev:api
npm run preview
```

## 3. Expression architecture

The production expression flow is:

```text
MathLive draft LaTeX
  -> raw-LaTeX incomplete-structure check
  -> Compute Engine raw MathJSON
  -> strict MathJSON adapter
  -> project-owned closed MathAst
  -> structural and variable-profile validation
  -> deterministic math-ast-v1 serialization and projections
  -> explicit numeric evaluator
  -> existing solver function parameter
```

### Ownership and trust

- `MathAst` is the authoritative mathematical meaning.
- LaTeX restores/displays the field; raw MathJSON is an adapter value only. Neither enters application run state as numerical authority.
- The controlled legacy tokenizer/parser imports approved text without executing it.
- The evaluator uses exhaustive AST dispatch. Production user expressions use neither `eval` nor `new Function`.
- Solvers receive numeric closures only and do not import MathLive, MathJSON, LaTeX, DOM, or Tutor rendering code.
- Rendering and Tutor mathematics are display-only and cannot become solver input.

### Variable profiles

| Profile | Variables | Production use |
|---|---|---|
| `rhs` | `t`, `y` | First-order single method and Compare |
| `second_order_rhs` | `t`, `u` | Existing Leap-Frog acceleration field |
| `exact_solution` | `t`, `t0`, `y0` | Optional first-order exact-solution field, presets, consistency checks, and convergence studies |

`second_order_rhs` migrates the existing Leap-Frog expression path; it adds no new Leap-Frog capability. Compare continues to share one `rhs` expression.

### Exponential semantics

The input adapters map raw visual e raised to x, raw `Exp(x)`, legacy `exp(x)`, and legacy `Math.exp(x)` to the project `exp` function node. That node evaluates with `Math.exp`. The core canonicalizer does not rewrite a directly constructed project `power(constant("e"), x)` node. General powers remain power nodes and evaluate with `Math.pow`; standalone e remains a constant.

### Drafts, validation, and snapshots

- Draft LaTeX is separate from the last confirmed `MathExpression`.
- Gentle input validation treats recognized unfinished structures neutrally.
- Blur, Run, Expression details, and restoration use strict validation.
- An invalid or incomplete visible draft cannot run by falling back to an older confirmed AST.
- A successful run captures an immutable expression snapshot. Step 3 and Tutor context use that snapshot even if the user later edits Step 2.
- A failed run does not replace the previous successful numerical result, equation snapshot, or Tutor context.

### Important source files

| File or directory | Role |
|---|---|
| `src/math/ast.ts` | Closed project AST |
| `src/math/errors.ts` | Structured expression errors |
| `src/math/validation.ts` | Runtime AST and profile validation |
| `src/math/canonical.ts` | Structure-preserving normalization and `math-ast-v1` serialization |
| `src/math/projection.ts` | Parsed-expression and accessible-text projections |
| `src/math/evaluator.ts` | Explicit finite real-number evaluator/compiler |
| `src/math/mathJsonAdapter.ts` | Strict raw MathJSON conversion |
| `src/math/legacyAdapter.ts` | Controlled legacy tokenizer/parser |
| `src/math/expression.ts` | Validated `MathExpression` construction |
| `src/math/problemExpressions.ts` | AST-backed defaults, persisted field state, successful snapshots |
| `src/math/ui/` | Lazy loader, editable fields, toolbar, errors, details, and read-only rendering |
| `src/main.ts` | Three-step UI, mode state, strict Run integration, Step 3 snapshots |
| `src/problemPresets.ts` | Six immutable AST-backed first-order presets and one-level undo/customization state |
| `src/exactSolution.ts` | Nine-location numerical exact-solution consistency check |
| `src/convergenceStudy.ts` | Pure preview, fingerprints, measurements, observed orders, interpretation, chart model, and coarse-to-fine runner |
| `src/convergenceStudyState.ts` | Successful-run ownership, current/stale/absent state, and one-shot warning confirmation |
| `src/convergenceStudyView.ts` | Default-collapsed drawer, preview, results table, chart lifecycle, and intent-only DOM rendering |
| `src/convergenceTeaching.ts` | Pure beginner teaching and conclusion models |
| `src/convergenceTutor.ts` | Current-only serializable convergence DTO for live and mock Tutor paths |

## 4. User-facing mathematical input

First-order and Compare forms show a fixed non-editable `y′ =` prefix; Leap-Frog shows `u″ =`. The field contains only the right-hand side. The compact toolbar inserts fraction, exponent, square root, exponential, trigonometric, natural-logarithm, absolute-value, and pi structures. **More symbols** opens MathLive's virtual keyboard.

**Expression details** shows read-only LaTeX and deterministic parsed text for the current valid draft. Errors are specific, field-local, and summarized after a blocked Run. The Version 1 UI is English-only.

Legacy compatibility intentionally accepts only the approved grammar and exact aliases such as `Math.exp`, `Math.sin`, and `Math.PI`. Arbitrary property traversal, assignments, statements, globals, and aliases such as `Math.random` are rejected. This is an intentional compatibility reduction from the former arbitrary JavaScript expression field.

## 5. Read-only mathematics and Tutor

`src/math/ui/readonlyMath.ts` immediately renders meaningful plain text, then upgrades to a non-editable, non-tab-stop `MathSpanElement` after the shared cached MathLive import succeeds. Removal, stale-content races, import failure, and rendering failure retain the fallback.

Assistant Tutor text supports only controlled `\(...\)` inline and `\[...\]` block segments. Text uses text nodes and explicit line breaks; arbitrary HTML and unrestricted Markdown remain inert. User messages are always plain text. Tutor formulas never pass through the numerical adapters or evaluator.

## 6. Solver architecture

The stable entry points remain:

```ts
interface MethodConfig {
  family: MethodFamily;
  order?: number;
}

integrateFirstOrder(config, params): SolverResult
integrateSecondOrder(params): SolverResult
```

Expression evaluators are compiled before these calls. `src/solvers.ts` owns no expression parser or dynamic compiler.

Implemented methods:

- Forward Euler, Backward Euler, Taylor Method (Order 2), and Runge-Kutta 4.
- Adams-Bashforth and Adams-Moulton for orders 1–8.
- BDF for orders 1–6.
- Leap-Frog for scalar second-order equations `u″ = a(t,u)`.

Generic multistep coefficients come from `src/polynomial.ts`; no per-order hard-coded solver family exists. Multistep startup uses Runge-Kutta 4 with the same step size and requires at least p fixed steps so the order-p formula runs at least once. Implicit methods use the existing scalar Newton policy and diagnostics. See `docs/NUMERICAL_CONTRACTS.md`.

## 7. Fixed-grid and metadata invariants

- Every run uses a positive aligned integer step count and has a 100,000-step cap.
- No final short step is introduced.
- Numeric inputs and every evaluated derivative/acceleration must be finite.
- `SolverResult.metadata` continues to carry display name, family, order, formula, coefficients, implicit/startup notes, and optional measured implicit diagnostics.
- Human-friendly expression migration changed no method coefficient, time-stepping formula, grid rule, Newton policy, diagnostic, or solver signature.

## 8. UI flow and state

1. **Method:** choose one method or Compare two first-order methods. Leap-Frog remains separate.
2. **Data:** edit numeric data and one visual right-hand-side field; choose p for AB/AM/BDF. First-order forms can load one of six exact-solution presets or enable an optional exact-solution field.
3. **Output:** view final values, chart, method metadata, last values, and optional implicit diagnostics. Single first-order results can open the default-collapsed Convergence Study when an exact solution belongs to the successful run. Single-method results can open the AI Tutor.

**All methods (keep my numbers)** preserves per-mode in-memory field state. Compare has one shared `rhs`; Leap-Frog retains independent `second_order_rhs` state. No localStorage or URL fingerprinting was added.

### Convergence ownership and execution

- A convergence study belongs to an immutable successful first-order snapshot containing actual method metadata, canonical RHS/exact meaning, interval/initial data, run step size, and preset/customization identity.
- `ode-run-v1` and `convergence-study-v1` ordered fingerprints decide ownership. Step 2 drafts never mutate the existing Step 3 result. An identical successful rerun reuses matching state; a changed successful rerun receives fresh state.
- Study base step size is independent from the original run step size. Editing it or the 3–6 refinement count marks a retained result stale; restoring the exact fingerprint makes that result current again.
- Preflight reuses `validateFixedStepGrid`, retains the per-level 100,000-step cap, enforces multistep `N >= p`, and keeps a 250,000 aggregate defense-in-depth proxy.
- The pure runner executes validated levels coarse to fine, aborts atomically, and never reuses or overwrites the original Step 3 solver result. It retains only aggregate per-level evidence, not multi-level point arrays.
- Consistency warnings require fingerprint-specific confirmation. **Run anyway** is one-shot and is cleared after success or failure; hard blockers cannot be overridden.
- Closing the drawer, switching its metric, opening teaching accordions, visiting Step 2, and using **Return to current output** preserve matching state without rerunning.
- Tutor context is rebuilt per message. Only a current fingerprint-matching successful study becomes the serializable convergence DTO; stale results, pending warnings, failed attempts, ASTs, expressions, raw MathJSON/LaTeX, functions, and chart data are omitted.

## 9. Scope exclusions and release status

Not implemented in Convergence Study Version 1:

- systems of ODEs or adaptive stepping;
- Compare/Leap-Frog convergence experiments;
- numerical reference solutions or systems;
- work-precision diagrams, RHS evaluation counts, exports, or complete error-time curves;
- Web Workers, progress, or cancellation;
- arbitrary JavaScript, arbitrary HTML, unrestricted Markdown, KaTeX, or MathJax;
- Chinese UI.

Phases A-E are implemented in commits `574672c`, `b357202`, `8ee2f32`, `ab8976a`, and `f45b858`. Phase F contains only acceptance audit, factual documentation, release verification, and the Cursor review package. Cursor final review completed with the verdict **Safe to release Version 1**, with no P0 blockers and no P1 issues. The final reviewed implementation commit is `9d7b2f71b1c8013c612f0df0663bb786cabab570`. Do not begin an excluded extension merely because Version 1 is release-ready.

## 10. Performance note

The verified Convergence build is approximately 298.03 kB minified / 96.48 kB gzip for the initial application, 1,143.55 kB / 308.67 kB gzip for the deferred editable/Compute Engine chunk, and 819.11 kB / 228.04 kB gzip for the deferred MathLive chunk. Application CSS is about 12.16 kB / 3.19 kB gzip; MathLive/editable CSS and 19 hashed font assets remain deferred/deployable. The two large lazy chunks trigger Vite size warnings. The Convergence Study runs synchronously on the main thread within existing caps; this is an accepted Version 1 performance tradeoff. No speculative chunk restructuring was attempted.

## 11. Approved platform roadmap

The [Theme-Ready Platform Shell design](./superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md) was approved on 2026-07-13; implementation has not started. The future sequence is **Platform Shell -> Interactive Term Glossary -> Linear Systems Lab**. The existing ODE Version 1 remains the current released product, so future routes, module overviews, and platform UI must not be described as already implemented.

## 12. Contributor guidelines

- Preserve the dependency direction: UI/adapters → project AST/validation/evaluator → numeric closures → solvers.
- Do not reorder, sort, flatten, fold, or symbolically simplify AST arithmetic; grouping and child order are numerical behavior.
- Do not restore dynamic execution as a compatibility fallback.
- Keep `exact_solution` restricted to the implemented first-order exact/convergence workflow; do not introduce a second expression language.
- Run `npm run verify` after changes and extend focused tests for every expression-boundary change.

*Last updated: 2026-07-13 after approval of the Theme-Ready Platform Shell design; implementation has not started.*
