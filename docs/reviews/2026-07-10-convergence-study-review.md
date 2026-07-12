# Observed Convergence Order Experiment - Cursor Review Package

**Review date:** 2026-07-11

**Milestone verdict:** Implemented and verified; ready for conservative Cursor review

**Implementation commits:** `574672c` -> `b357202` -> `8ee2f32` -> `ab8976a` -> `f45b858`

## Delivered scope

Version 1 adds six exact-solution presets, optional visual exact-solution input, a numerical consistency check, successful-run/study fingerprints, fixed-grid refinement preview, a pure coarse-to-fine runner, final-time and maximum-global errors, observed-order classification, evidence-based interpretation, one switchable log-log chart, beginner teaching sections, and current-only live/mock Tutor grounding. The feature appears as a default-collapsed Step 3 drawer for successful scalar first-order single-method runs and preserves the existing Method -> Data -> Output flow.

It does not add Compare or Leap-Frog convergence, numerical reference solutions, systems, adaptive stepping, work-precision, RHS counts, exports, workers, progress/cancellation, error-time curves, Chinese UI, or a frontend redesign.

## Architecture and ownership

| Module | Responsibility |
|---|---|
| `src/problemPresets.ts` | Six immutable AST-backed presets, dirty detection, one pre-load snapshot, one-level undo, sticky customization identity |
| `src/exactSolution.ts` | Pure nine-location finite/initial/derivative consistency evidence |
| `src/convergenceStudy.ts` | Pure preview, budgets, fingerprints, measurement, order, interpretation, chart model, and runner |
| `src/convergenceStudyState.ts` | Successful-run ownership, current/stale/absent state, setup drafts, metric/accordions, one-shot warning confirmation |
| `src/convergenceTeaching.ts` | Pure conclusion and eight teaching-section models |
| `src/convergenceStudyView.ts` | Intent-only drawer DOM, table, chart lifecycle, statuses, and rendering |
| `src/convergenceTutor.ts` | Current-only serializable aggregate Tutor DTO |
| `src/main.ts` | Small orchestration boundary connecting successful snapshots, state, runner, view, and per-message Tutor getter |

Dependency direction remains expression AST/evaluator and grid/solver contracts -> pure convergence model -> state/teaching -> view/main/Tutor adapters. Solvers import no MathLive, MathJSON, LaTeX, DOM, chart, convergence UI, or Tutor code.

## Acceptance-criteria audit

| Requirement | Implementation evidence | Automated/browser evidence | Result |
|---|---|---|---|
| Six exact-solution presets | `problemPresets.ts` | `problemPresets.test.ts`; all six production-preview loads | PASS |
| Approved preset defaults | preset catalog constants | exact defaults test; browser recorded `(tEnd,h)` as `(5,.2)`, `(3,.1)`, `(5,.2)`, `(10,.25)`, `(6,.1)`, `(.1,.0005)` | PASS |
| Dirty replacement confirmation and Cancel | `main.ts`, preset state | browser preserved edited value and reset selector on Cancel | PASS |
| Single undo snapshot | `loadProblemPreset`, `undoProblemPreset` | preset tests; browser consumed Undo once | PASS |
| Sticky customization identity | `updatePresetProblemFields` | preset tests; browser displayed `Customised from: Exponential Decay` | PASS |
| Optional exact field | first-order form in `main.ts` | browser toggle visibility and successful exact run | PASS |
| `exact_solution` profile | shared expression core | validation/evaluator/adapter tests; browser rejected `x` | PASS |
| Return to current output | `main.ts` navigation | integration test; browser retained drawer, metric, and rows | PASS |
| Exactly nine check locations | `exactSolutionCheckLocations` | `exactSolution.test.ts` | PASS |
| Local derivative probe | `derivativeProbeStep` | formula/scheme/curved-solution tests | PASS |
| Finite and initial-value blockers | `checkExactSolution` | thrown/non-finite/boundary/scaled tests | PASS |
| Warning thresholds and honest statement | exact constants/result | warning/strong-warning tests; browser warning and not-proof copy | PASS |
| Levels 3-6 and grid reuse | `buildConvergencePreview` imports `validateFixedStepGrid` | boundary/alignment tests; browser preview | PASS |
| Multistep `N >= p` | preview metadata guard | AB/AM/BDF equality/failure tests | PASS |
| Per-level and aggregate budgets | grid cap plus `MAX_CONVERGENCE_STUDY_STEPS` | 100,000 cap, 249,999/250,000/250,001, and maximum-valid-total tests | PASS |
| Coarse-to-fine independent runner | `runConvergenceStudy` | injected call-order/count tests | PASS |
| Original result never reused/overwritten | runner dependencies and `main.ts` | integration/state tests; browser old-output navigation | PASS |
| Final and maximum-global errors | `measureConvergenceLevel` | synthetic actual-time tests | PASS |
| Earliest maximum tie | strict `>` update | synthetic tie test | PASS |
| Six observed-order statuses | `assessObservedOrder` | status and exact-boundary tests | PASS |
| Five interpretation kinds | `interpretConvergence` | fixtures and precedence/boundary tests | PASS |
| Theoretical order from metadata | runner metadata checks | metadata mismatch and known-method tests | PASS |
| Honest BDF6 startup evidence | unchanged solver startup plus order model | metadata 6; measured final orders 4.5-5.5; not classified consistent with six | PASS |
| Slope-only chart model | `buildConvergenceChartModel` | anchor/omission tests; browser reference copy | PASS |
| Default-collapsed eligible drawer | state/view/main | view/integration tests; browser `open=false` | PASS |
| Current/stale/absent states | `ConvergenceUiState` | state tests; browser stale and restoration | PASS |
| Fingerprint-specific one-shot warning | state/main split | state/runner tests; browser Cancel then one successful Run anyway with token cleared | PASS |
| Prior result preserved on failure | atomic runner/state | injected failure tests; browser invalid-preflight preserved three rows | PASS |
| Complete error table | view | view test; browser three complete human-facing rows | PASS |
| Metric toggle without rerun | state/view | intent/chart-destroy test; browser switched to final-time and retained rows | PASS |
| Eight teaching accordions | teaching/state/view | teaching and accordion lifecycle tests; browser rendered current examples | PASS |
| Navigation persistence | run/study map in `main.ts` | integration/state tests; browser Step 2 round trip | PASS |
| Current-only Tutor grounding | DTO helper and per-message getter | DTO/panel/prompt/mock tests; browser absent/current/stale/restored flows | PASS |
| No fabricated Tutor values | mock/live prompt constraints | all interpretation fixtures; browser table value 4.0602195 echoed exactly | PASS |
| No Compare/Leap-Frog convergence | eligibility and single-result mounting | integration/state tests; browser no drawer, Compare Tutor disabled, Leap-Frog no convergence DTO | PASS |
| English-only and no dynamic execution | controlled copy and AST evaluator | source/security searches; browser text scan | PASS |

No FAIL or PARTIAL acceptance item remains.

## Exact numerical rules

- Locations: `t_i = t0 + (i/8)(tEnd-t0)`, exactly nine including endpoints.
- Probe: `d_i = min(span/8, 1e-6 max(1, |t_i|, span))`; forward, seven central, backward.
- Initial check: `|y_exact(t0)-y0| <= 1e-10 + 1e-8 max(1,|y0|)`.
- Residual: absolute derivative/RHS mismatch divided by `1 + |derivative| + |RHS|`; pass through `1e-5`, warning through `1e-3`, strong warning above.
- Refinement: `h_l = baseH / 2^l`, 3-6 levels, current fixed-grid validator, per-level 100,000 cap, coarsest multistep `N >= p`, aggregate 250,000 defense-in-depth proxy.
- Errors: exact values on actual returned grid points, no interpolation; endpoint absolute error and maximum pointwise absolute error with earliest tie.
- Resolution: `100 Number.EPSILON max(1,|exact|,|numerical|)`.
- Order: `log2(E(h)/E(h/2))`, calculated independently for final and maximum error.
- Interpretation: newest negative/no-improvement evidence has first precedence; otherwise most recent reliable maximum-error evidence is primary. Theory tolerance is `max(0.25,0.1p)` and stable spread is at most `0.35` plus roundoff allowance. Later resolution does not erase earlier reliable pairs.
- Theory: actual returned solver metadata. BDF6 keeps metadata order 6 while fixed RK4 startup can limit measured end-to-end order to approximately five.

## State and failure guarantees

`ode-run-v1` fingerprints include actual family/order, canonical RHS/exact AST meaning, numeric problem/run fields, exact enabled state, preset identity, and customization source. `convergence-study-v1` adds study base step size and level count. Ordered tuple serialization, finite number keys, and `-0` normalization avoid object-order dependence.

Step 2 edits are unexecuted drafts until a successful original Run. Failed original Runs preserve the successful output and its matching study. Identical successful reruns reuse the matching state; changed successful runs use a new fingerprint and fresh state. Study edits retain but mark old results stale, and exact setting restoration makes the same result current. A failed level publishes no partial result and cannot overwrite the prior successful study.

Warning confirmation lives only in `ConvergenceUiState`. The runner accepts immutable `allowConsistencyWarning`; it never consumes UI state. The token is tied to the study fingerprint and cleared after Run anyway succeeds or fails. Hard blockers are never confirmable.

## Chart and memory behavior

The ordinary solution chart and convergence chart have separate owners. The view destroys the previous convergence Chart.js instance before rerender and on disposal. Both axes are logarithmic; x is reversed so smaller `h` moves right. Zero, non-finite, and resolution-limited errors are omitted with readable reasons. The theoretical line is anchored to one reliable measured point and compares slope only.

Each solver level's point array exists only while it is measured. The returned study retains aggregate rows and order/interpretation evidence, not complete multi-level time series. Execution is synchronous on the main thread within fixed caps; no worker, progress, or cancellation exists in Version 1.

## Tutor and security boundary

The Tutor DTO contains theoretical order, interpretation, evidence pairs, aggregate level errors/orders, and successful consistency evidence only. It excludes `MathAst`, `MathExpression`, functions, raw MathJSON, raw LaTeX, Chart.js datasets, UI state, pending confirmation, last-attempt errors, and failed partial rows. The panel invokes the getter for every message, so stale data disappears and restored matching data returns without remounting.

Repository security search classifications:

- No production `eval`, `new Function`, `Function(` compiler, or `compileScalarExpr` remains. Matches occur only in rejection assertions/documentation.
- `innerHTML` remains only for application-owned static templates; user/Tutor text uses text nodes, controlled math segmentation, and escaped trusted template values. Convergence view content uses `createElement`/`textContent`.
- `window.mathVirtualKeyboard` is the documented MathLive UI API, not expression execution. Other `window`/`document` matches are legitimate DOM code or rejection tests.
- `globalThis`, `Math.random`, `constructor`, `prototype`, and `__proto__` matches are malicious-input rejection tests or defensive object-shape validation.
- Raw MathJSON is ephemeral unknown adapter input and is never application/Tutor state. Rendered math cannot become solver input.
- `lastAttemptError` is view-only controlled failure data and is explicitly excluded from the Tutor DTO.

No executable security risk was found in the audited matches.

## Numerical regression evidence

The deterministic current-solver tests require reliable maximum-error orders in these unchanged ranges:

| Method | Expected measured range |
|---|---:|
| Forward Euler | 0.85-1.15 |
| Taylor 2 | 1.8-2.2 |
| RK4 | 3.7-4.3 |
| AB3 | 2.6-3.3 |
| AM3 | 2.6-3.3 |
| BDF3 | 2.6-3.3 |
| BDF6 final-time | 4.5-5.5, with metadata order 6 |

The full solver, grid, nonlinear, Compare, Leap-Frog, expression, and metadata suites remain green without changed tolerances.

## Production-preview checklist

All 42 requested items passed through production-preview evidence plus focused automation where deterministic failure injection is required:

1. PASS - all six presets loaded.
2. PASS - exact approved defaults recorded.
3. PASS - RK4 selection remained unchanged during preset loads; metadata/order tests cover configurable methods.
4. PASS - dirty replacement confirmation canceled and preserved the edit.
5. PASS - one-level Undo restored the pre-load state and disappeared.
6. PASS - sticky customization identity displayed.
7. PASS - exact editor visibility followed the switch.
8. PASS - `x` produced the profile-specific exact error.
9. PASS - incomplete exponent stayed neutral while editing and blocked Run strictly.
10. PASS - Exponential Decay ran with RK4.
11. PASS - drawer began collapsed.
12. PASS - exact solution rendered as textbook mathematics.
13. PASS - study base `h=0.2`, levels `3`.
14. PASS - preview counts `25,50,100`, total `175`.
15. PASS - study completed.
16. PASS - not-a-formal-proof consistency statement visible.
17. PASS - conclusion order `4.06` with Levels 1-2 and 2-3 evidence.
18. PASS - three complete table rows.
19. PASS - maximum-global chart default.
20. PASS - final-time toggle changed chart without integration or row changes.
21. PASS - smaller-step-right label visible; reversed logarithmic x asserted in chart config test.
22. PASS - close/reopen retained state.
23. PASS - Step 2/current-output round trip retained state.
24. PASS - unrun Step 2 drafts did not alter output.
25. PASS - setup edit visibly marked old result stale.
26. PASS - exact setting restoration made it current.
27. PASS - changed successful exact problem opened a fresh collapsed/empty study.
28. PASS - warning Cancel returned to normal Run.
29. PASS - Run anyway completed once and the action disappeared.
30. PASS - invalid preflight preserved the prior table; injected runtime failures verify the same atomic rule.
31. PASS - Tutor before study requested a current study and invented no value.
32. PASS - Tutor used actual `4.0602195` and metadata `4`.
33. PASS - stale study was omitted on the next question.
34. PASS - restored fingerprint returned grounding.
35. PASS - Compare had no drawer.
36. PASS - Leap-Frog had no drawer.
37. PASS - Compare Tutor remained disabled; Leap-Frog Tutor received no convergence evidence.
38. PASS - at 390 px override, page width stayed 375 px while chart/table scrolled inside 263 px containers.
39. PASS - dark color scheme and gradient remained active.
40. PASS - drawer summary, fields, chart, table caption, alerts, and Tutor controls exposed accessible labels/roles.
41. PASS - no console warning/error or unhandled rejection.
42. PASS - visible-text Chinese scan returned none.

## Verification record

Final required commands:

```text
npm run test:run       701 tests across 35 files passed
npm run typecheck      passed
npm run typecheck:api  passed
npm run build          passed
npm run verify         passed
npm audit --omit=dev   0 vulnerabilities
git diff --check       passed
```

## Bundle and deployment

- Initial application: 298.03 kB minified / 96.48 kB gzip.
- Deferred MathLive: 819.11 kB / 228.04 kB gzip.
- Deferred editable/Compute Engine: 1,143.55 kB / 308.67 kB gzip.
- Application CSS: 12.16 kB / 3.19 kB gzip; editable and MathLive CSS remain separate.
- Nineteen hashed WOFF2 assets are emitted with relative deployable paths.
- Vite warns that the two existing lazy chunks exceed 500 kB. Phase F performs no speculative optimization.

The landing screen uses the initial chunk. Step 2 mathematical editing loads the editable/Compute Engine and MathLive assets. The convergence model/view is part of the initial application, while the study retains only aggregate evidence after each synchronous level measurement.

## Known limitations

- Study execution is synchronous; the UI has no progress or cancellation.
- Browser protection uses step counts as a proxy, not exact runtime or RHS evaluation counts; RK4 and implicit Newton-based steps cost more than Euler.
- Exact consistency is numerical evidence, not proof.
- BDF6's fixed RK4 startup can limit measured end-to-end order to about five.
- Compare, Leap-Frog, numerical reference solutions, systems, adaptive methods, work-precision, exports, workers, RHS counts, and error-time curves are excluded.
- The existing large deferred math chunks remain a performance tradeoff.

## Targeted Cursor questions

1. Is any numerical policy duplicated in `main.ts`, the view, or Tutor code?
2. Can a stale or mismatched study appear current?
3. Can warning confirmation be reused?
4. Can a failed attempt overwrite a successful study?
5. Can Tutor receive stale or fabricated evidence?
6. Does the exact consistency checker follow the approved local `d_i` rule?
7. Are order/interpretation boundaries correct?
8. Is BDF6 presented honestly as metadata order 6 with observed startup-limited evidence near 5?
9. Are Chart.js instances disposed correctly?
10. Can mobile chart/table overflow escape their containers?
11. Are docs accurate and scope exclusions clear?
12. Is the feature safe to release as Version 1?

Cursor should report focused correctness, security, lifecycle, accessibility, performance-evidence, or documentation findings. It should not propose broad redesign or an excluded new feature.
