# Human-Friendly Math Expressions — Cursor Review Package

**Review date:** 2026-07-11

**Milestone verdict:** Release-ready for conservative Cursor review

**Implementation commits:** `efb6447` → `c9bdb8b` → `1236d71` → `9041f83` → `b469946` → `7378082`

## Scope delivered

Milestone 1 replaced every production user-expression path—single first-order, Compare, and Leap-Frog—with visual MathLive editing, a strict adapter boundary, the project-owned `MathAst`, profile validation, and explicit numeric evaluators. Step 3 and the Tutor use immutable successful-run expression snapshots. The milestone did not add exact-solution controls, presets, convergence controls/calculations, numerical-method changes, arbitrary HTML/Markdown, Chinese UI, KaTeX, or MathJax.

Before this milestone, raw JavaScript-style strings reached `new Function`. After it, LaTeX and legacy strings are non-executable input formats, raw MathJSON is an ephemeral adapter value, `MathAst` is authoritative, and solvers receive profile-safe numeric closures.

## Acceptance-criteria audit

| Requirement | Implementation evidence | Test/browser evidence | Result |
|---|---|---|---|
| Visual MathLive RHS editing | `src/math/ui/editableMathField.ts`, `src/main.ts` | `editableMathField.test.ts`; production smoke | PASS |
| Fixed y′ and u″ prefixes | `src/main.ts` field configs | migration tests; production smoke | PASS |
| Three variable profiles | `ast.ts`, `validation.ts`, `evaluator.ts` | `validation.test.ts`, `evaluator.test.ts` | PASS |
| `exact_solution` tested, not exposed | pure core/adapters only | profile tests; DOM/scope searches | PASS |
| Closed project-owned AST | `src/math/ast.ts` | `ast.test.ts`, `validation.test.ts` | PASS |
| MathJSON adapter-only boundary | `mathJsonAdapter.ts` | `mathLiveApi.contract.test.ts`, adapter tests | PASS |
| Controlled legacy parser | `legacyAdapter.ts` | accepted/rejected grammar tests; paste smoke | PASS |
| No production `eval`/`new Function` | explicit evaluator; compiler removed | repository security search | PASS |
| Versioned canonical serialization | `canonical.ts` (`math-ast-v1`) | `canonical.test.ts` | PASS |
| Grouping/order preservation | core and adapter tree construction | canonical, adapter, evaluator tests | PASS |
| `Math.exp` semantics | adapter-owned exp node; evaluator dispatch | adapter/evaluator tests; focused numerical audit | PASS |
| Implicit multiplication | adapters emit multiply nodes | adapter tests; visual `y(1−y)` smoke | PASS |
| Gentle/strict validation | `mathFieldState.ts`, editable controller | state/controller tests; incomplete/Run smoke | PASS |
| Placeholder detection | raw-LaTeX precheck in editable infrastructure | focused scanner/controller tests | PASS |
| Inline and summary errors | UI error components | error-summary tests; profile/focus smoke | PASS |
| Expression details | editable field infrastructure | controller tests; production smoke | PASS |
| Toolbar and More symbols | `expressionToolbar.ts` | toolbar tests; production clicks/focus smoke | PASS |
| Read-only fallback | `readonlyMath.ts` | async/failure/race tests; Step 3 smoke | PASS |
| Tutor math segmentation | `tutorMath.ts`, `aiTutorPanel.ts` | tokenizer/DOM tests; grounded Tutor smoke | PASS |
| Successful-run snapshot separation | `problemExpressions.ts`, `main.ts` | snapshot/migration tests | PASS |
| Compare behavior | shared `rhs` in `main.ts` | migration tests; FE vs RK4 smoke | PASS |
| Leap-Frog behavior | `second_order_rhs` path in `main.ts` | profile/migration tests; `−u` smoke | PASS |
| English-only UI | production copy | source search and browser text scan | PASS |
| No exact/convergence UI | no production mounting | migration/scope tests and browser scan | PASS |
| Numerical methods unchanged | closures compiled before solver boundary | full solver suite and focused equivalence audit | PASS |

All major requirements in the approved design are implemented. No FAIL or PARTIAL acceptance item remains.

## Exponential ownership and numerical invariants

The raw MathJSON adapter recognizes visual `Power(ExponentialE, x)` and raw `Exp(x)`; the legacy adapter recognizes `exp(x)` and `Math.exp(x)`. Each emits the project `exp` function node, evaluated with `Math.exp`. The Phase 1 core canonicalizer never rewrites a directly constructed project `power(constant("e"), x)` node. General powers use `Math.pow`.

The AST preserves nested add/multiply grouping, left-to-right child order, divide and power structure, and unary negation. No sorting, flattening, reassociation, constant folding, cancellation, distribution, or symbolic simplification is performed. The migration did not change solver coefficients, startup, grids, nonlinear iteration, metadata, or diagnostics.

## Security and compatibility boundary

- No production user expression is dynamically executed.
- Tutor math and rendered LaTeX never reach AST conversion or evaluation.
- Invalid/incomplete visible drafts cannot run by using an older confirmed AST.
- User and Tutor content is constructed with text nodes plus controlled math spans; static application templates are the only remaining `innerHTML` uses.
- Only exact approved legacy aliases (`Math.exp`, `Math.sin`, `Math.PI`) are recognized. `Math.random`, arbitrary property traversal, globals, assignments, statements, ternaries, and trailing tokens are rejected.
- `window.mathVirtualKeyboard` is the documented MathLive UI integration point, not an expression-execution capability.
- Raw MathJSON is accepted as unknown at the adapter and is not persisted in application state or Tutor context.

The intentional compatibility reduction is that arbitrary JavaScript and previously accepted but unapproved `Math.*` properties no longer work. Users receive controlled English errors and can use the supported visual subset instead.

## Verification record

Final required commands:

```text
npm run test:run       543 tests passed
npm run typecheck      passed
npm run typecheck:api  passed
npm run build          passed
npm run verify         passed
npm audit --omit=dev   0 vulnerabilities
git diff --check       passed
```

A focused temporary numerical audit (removed after execution) added nine passing checks for `-y`, `t-y`, legacy `Math.sin(t)-0.1*y`, `-u`, visual e raised to t, implicit multiplication, Forward Euler, RK4, Backward Euler, Leap-Frog, and controlled division/root/log/overflow failures. Safe evaluators matched equivalent native closures exactly at the checked points and within the existing solver contracts.

The production-browser checklist passed all 29 required items. It exercised first-order, Compare, and Leap-Frog fields; true exponent, fraction, root, trig, ln, absolute value, pi, and implicit multiplication; legacy normalization; details; neutral incomplete state; strict Run blocking; profile errors and summary focus; state/snapshot behavior; explicit, implicit, Compare, and Leap-Frog runs; Step 3 math; grounded Tutor output; toolbar/More symbols; responsive/dark-theme styling evidence; lazy assets; an empty console; and the exact/convergence/Chinese-UI exclusions.

## Bundle and deployment note

The verified build emits approximately:

- initial application: 235.96 kB minified / 79.10 kB gzip;
- deferred editable/Compute Engine: 1,143.45 kB / 308.64 kB gzip;
- deferred MathLive: 819.11 kB / 228.04 kB gzip;
- scoped application, editable, and MathLive CSS plus 19 hashed WOFF2 assets.

The landing screen loads the initial bundle only; Step 2 triggers the editable/Compute Engine and MathLive assets. Vite reports the two lazy chunks above 500 kB. Compute Engine-identifying strings occur in both lazy artifacts, which suggests a follow-up inspection, but this evidence does not prove duplicated executable payload. No speculative chunk restructuring was attempted. Hashed `/assets/...` paths work under the existing Vercel `dist` deployment.

## Review findings

No release-blocking defect was found. One apparent toolbar failure was traced to the browser automation helper using paste semantics: physical-keyboard input correctly preserved MathLive insertion structures and caret placement. No code change was warranted.

## Targeted Cursor questions

1. Is any production dynamic expression execution left?
2. Can an invalid visible draft use an older confirmed AST?
3. Can Tutor or rendered LaTeX reach numerical evaluation?
4. Are profile boundaries correct for first-order and Leap-Frog?
5. Is successful-run snapshot separation correct?
6. Did any numerical method behavior change?
7. Are there accessibility or lifecycle bugs in the Step 2 math fields?
8. Are there stale docs or misleading claims?
9. Is any bundle duplication obvious from imports?
10. Is the code safe to begin Convergence Study planning?

Cursor should report focused correctness, security, lifecycle, accessibility, or documentation findings—not propose broad rewrites or aesthetic redesign.
