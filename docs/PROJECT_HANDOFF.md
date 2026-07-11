# Numerical ODE Lab — Project Handoff

This is the durable handoff for future contributors and Cursor agents. Use it with the current codebase; do not rely on prior chat history.

**Status:** Human-Friendly Math Expressions implemented and verified on 2026-07-11. The Observed Convergence Order experiment is designed but not implemented.

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
| Tests | Vitest; 543 tests passing at Milestone 1 finalization |
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
| `exact_solution` | `t`, `t0`, `y0` | Pure code and tests only; no UI yet |

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
2. **Data:** edit numeric data and one visual right-hand-side field; choose p for AB/AM/BDF.
3. **Output:** view final values, chart, method metadata, last values, and optional implicit diagnostics. Single-method results can open the AI Tutor.

**All methods (keep my numbers)** preserves per-mode in-memory field state. Compare has one shared `rhs`; Leap-Frog retains independent `second_order_rhs` state. No localStorage or URL fingerprinting was added.

## 9. Scope exclusions and next milestone

Not implemented:

- systems of ODEs or adaptive stepping;
- exact-solution switch/field or exact-solution presets;
- Convergence Study drawer or calculations;
- Compare/Leap-Frog convergence experiments;
- arbitrary JavaScript, arbitrary HTML, unrestricted Markdown, KaTeX, or MathJax;
- Chinese UI.

The Human-Friendly Math Expressions prerequisite is complete. The approved Convergence Study design may now enter implementation planning, but its numerical and UI work remains a separate milestone.

## 10. Performance note

The verified production build is approximately 235.96 kB minified / 79.10 kB gzip for the initial application, 1,143.45 kB / 308.64 kB gzip for the deferred editable/Compute Engine chunk, and 819.11 kB / 228.04 kB gzip for the deferred MathLive chunk. Font and MathLive CSS assets are emitted with hashed deployable paths. The two large lazy chunks trigger Vite size warnings. A small amount of Compute Engine-identifying code appears in both lazy artifacts, but the build inspection does not prove duplicate executable payload; investigate before attempting optimization.

## 11. Contributor guidelines

- Preserve the dependency direction: UI/adapters → project AST/validation/evaluator → numeric closures → solvers.
- Do not reorder, sort, flatten, fold, or symbolically simplify AST arithmetic; grouping and child order are numerical behavior.
- Do not restore dynamic execution as a compatibility fallback.
- Keep `exact_solution` unexposed until the downstream milestone implements its approved UI and consistency checks.
- Run `npm run verify` after changes and extend focused tests for every expression-boundary change.

*Last updated: 2026-07-11 after Human-Friendly Math Expressions Phase 6 verification.*
