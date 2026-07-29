# Group F1 — Pre-Glossary Project-Language Consistency Review

## 1. Title and metadata

| Field | Value |
|---|---|
| Review | Group F1 — Pre-Glossary Project-Language Consistency Review |
| Date | 2026-07-29 |
| Task type | One-record copy implementation plus read-only cross-surface audit |
| Starting branch | `main` |
| Starting HEAD | `0a32939c6a0bd218003ba87181f66033695c233b` (`Align Tutor numerical language`) |
| Standards | Numerical Terminology Standard v1, Numerical Notation Standard v1, and Teaching Voice Standard v1 |
| Product baseline | Accepted Groups A–D; locally accepted content-agnostic Glossary framework; no production Glossary content or ODE binding |
| Canonical status | Local implementation and review evidence; not deployment or production-release evidence |

## 2. Verdict

**GROUP F1 COMPLETE — PRE-E FIXES REQUIRED**

`COPY-043` is implemented exactly and verified. All twelve `COPY-NC-*`
records have explicit read-only classifications. The complete current-product
review found no P0 or P1 issue, but it found five P2 inconsistencies or behavior
defects outside this task's authorized write scope. They should be repaired and
accepted in one or more separately authorized, focused pre-E tasks before
Production Glossary Wave 1 is planned.

This verdict does not authorize Group E.

## 3. Scope and F1/F2 boundary

F1 reviews the accepted Group A–D product state before production Glossary
content. It covers current Platform, IVP, Convergence, Tutor, math-input,
accessibility, generic Glossary-framework, and status-document language. It
implements only `COPY-043`; all other source is read-only.

F1 does not complete the original full Group F. A later F2 review remains
required after Group E and must cover production terms, annotations, cards,
popover/sheet content, Tutor handoff consistency, the ODE binding, and final
cross-surface browser evidence.

No Group E content, production entry, annotation, binding, Tutor queue,
Glossary runtime change, numerical change, or unrelated repair is included.

## 4. Accepted Group A–D commit inventory

| Group | Commit | Accepted boundary |
|---|---|---|
| A | `75b853984307ffa67169dbd46cb5ad8c5b6dc261` — `Align platform and overview language` | Platform and overview copy; `COPY-003` held |
| B | `d2d2130c1ef7354e56497455ccadecd1f991eb59` — `Align IVP workflow language` | IVP Method, Data, Output, Compare, grid, method, and preset copy |
| C | `6e28ba493681a3a2d223724ba4b1688557848717` — `Align convergence and error language` | Convergence labels, evidence wording, teaching copy, and accessible formulas |
| D | `0a32939c6a0bd218003ba87181f66033695c233b` — `Align Tutor numerical language` | Tutor subtitle, questions, prompt policy, deterministic replies, and focused expectations |

The cumulative `895593d...0a32939` diff contains only the documented A–D
product owners, focused tests, README, and status documents. This review does
not rewrite accepted history or accepted A–D copy.

## 5. COPY-043 implementation

| Item | Evidence |
|---|---|
| Owner | `src/math/ui/editableMathField.ts` · `mountEditableMathField` |
| Prior text | `Parsed expression` |
| Approved and final text | `Interpreted expression` |
| Governing rules | `VOICE-V1:PLAIN_CORE`; `VOICE-V1:PREFERRED_WORDING` |
| Role | The second `dt` label in the editable-field expression-details disclosure |
| Scope | Learner-facing normalized-expression label only; not error-summary ownership |
| Focused test | `src/math/ui/editableMathField.test.ts` |

The untouched focused baseline passed 13 tests. The tests-first run then failed
exactly one new assertion: it expected `["LaTeX", "Interpreted expression"]`
and received `["LaTeX", "Parsed expression"]`; the other 12 tests passed.
After the one-literal implementation, all 13 tests passed.

Direct source-diff review confirms that imports, exports, types, DOM structure,
attributes, MathLive setup, parsing, AST handling, validation, listeners,
virtual-keyboard ownership, focus, timing, return values, and cleanup are
unchanged. The test change adds only the exact `dt`-label assertion.

## 6. COPY-NC classification table

| Record | File / symbol | Current text or behavior | Classification | Rationale | Follow-up |
|---|---|---|---|---|---|
| `COPY-NC-001` | `src/pages/homePage.ts` · ODE card | “Experiment with fixed-step methods for initial value problems and analyze numerical error.” | `CONSISTENT_NO_CHANGE` | Truthfully scopes the Lab without presenting an unnamed reported scalar. | None. |
| `COPY-NC-002` | `src/pages/linearAlgebraOverviewPage.ts` · roadmap status | “this module is a roadmap today and does not yet contain runnable controls.” | `CONSISTENT_NO_CHANGE` | Accurately distinguishes roadmap status from an implemented Lab. | None. |
| `COPY-NC-003` | `src/app/platformGlossaryHost.ts` · failure message | “The definition could not load. You can retry without leaving the Lab.” | `CONSISTENT_NO_CHANGE` | Calm, actionable, and recoverable without an unsupported content claim. | None. |
| `COPY-NC-004` | `src/problemPresets.ts` · Stiff Relaxation warning | “Explicit methods require very small steps for the fast mode; this is stability guidance, not a guarantee of a particular run outcome.” | `CONSISTENT_NO_CHANGE` | Correctly separates stability guidance from a guarantee. | None. |
| `COPY-NC-005` | `src/ode/odeApp.ts` · implicit diagnostics | “Nonlinear-solver convergence is different from absolute stability of the numerical method.” | `CONSISTENT_WITH_LOCAL_CONTEXT` | The surrounding diagnostic names iteration and residual evidence and preserves the solver/method distinction. | None. |
| `COPY-NC-006` | `src/convergenceStudyView.ts` · `renderConsistency` | “This check is not a formal proof.” | `CONSISTENT_WITH_LOCAL_CONTEXT` | The view renders the exact-solution consistency statement supplied by the existing validator; the qualification correctly limits that numerical check. | None. |
| `COPY-NC-007` | `src/convergenceStudyView.ts` · chart direction note | “Moving right means using a smaller step size.” | `CONSISTENT_NO_CHANGE` | Necessary orientation cue for the reversed logarithmic axis. | None. |
| `COPY-NC-008` | `api/chatHandler.ts` · missing Convergence context | “I do not have current convergence evidence in this Tutor context, so I will not invent an observed order, error value, or interpretation.” | `CONSISTENT_WITH_LOCAL_CONTEXT` | The complete reply first asks for a current study and then preserves this evidence-bounded clause. | None. |
| `COPY-NC-009` | `api/chatHandler.ts` · nonlinear diagnostics | Nonlinear convergence is distinguished from absolute stability. | `CONSISTENT_WITH_LOCAL_CONTEXT` | The complete reply adds named residual and iteration diagnostics without changing the reviewed distinction. | None. |
| `COPY-NC-010` | `src/glossary/surface/glossarySurfaceRuntime.ts` · complete-surface heading | “Why it matters here” | `CONSISTENT_NO_CHANGE` | Plain, contextual, and domain-neutral. | Recheck with real production content in F2. |
| `COPY-NC-011` | `src/math/ui/expressionErrorSummary.ts` · validation heading | Dynamic singular/plural “Fix [count] expression(s) before running” | `CONSISTENT_WITH_LOCAL_CONTEXT` | The implementation generates grammatically correct singular/plural text, states the blocker, and gives the next action. | None. |
| `COPY-NC-012` | `docs/PROJECT_HANDOFF.md` · current Glossary status | Current handoff adds the precise absence of an “ODE binding” to the audited sentence. | `STALE_BUT_NON_BLOCKING` | The audit's captured quotation predates a truthful strengthening; current product status is more precise, not contradictory. | Preserve the current stronger status; do not restore the older quotation. |

No `COPY-NC-*` product string was implemented or rewritten. The
`docs/PROJECT_HANDOFF.md` owner receives only authorized status updates outside
the retained reviewed status claim.

## 7. Terminology scan

The scan covered active user-facing source and directly relevant tests in
`src/`, `api/`, README/current status documents, the Version 1 standards, the
copy audit, and accepted A–D evidence. Historical specs and reviews were
excluded from product-fix counts. It searched the required stability, order,
error, LTE, tolerance, exact/numerical, step/grid, capitalization, and
hyphenation variants.

Correct or contextual matches include:

- negative limitations such as “not stable for every problem or step size”;
- `time steps` where the text means a count rather than a size;
- named `maximum global error`, `final-time error`, `observed order`,
  `theoretical order`, and `asymptotic region`;
- `measured-error slope`, which describes measured error data rather than
  renaming observed order;
- explicitly qualified `absolute stability`, nonlinear residuals, and
  iteration diagnostics;
- test-only negative assertions and historical evidence.

Active stale matches are recorded as findings `F1-LANG-001` through
`F1-LANG-004`. No active positive `Very stable`, `always stable`, `actual
order`, `true order`, `total error`, unqualified `LTE is O(h^p)`, bare solver
tolerance, `Newton error`, or `exact answer` claim was found. `COPY-003` remains
`DEFERRED_TO_FUTURE_MODULE`; `COPY-041` and `COPY-042` remain
`DEFERRED_TO_GROUP_E`.

## 8. Platform review

Home, About, ODE overview, Linear Algebra roadmap, PDE roadmap, and current
public/status language were reviewed. Accepted Group A text is present,
availability labels remain truthful, and held `COPY-003` is unchanged.
Neither roadmap page exposes runnable controls or claims an implemented Lab.
Production About excludes development controls.

No Platform-language finding was opened.

## 9. IVP review

Method, Data, presets, Run, Output, Compare, validation, grid messages,
diagnostics, result summaries, and chart labeling were reviewed. Accepted
Group B wording and all values/workflow behavior remain unchanged.
Stiffness guidance and implicit diagnostics retain the approved epistemic and
stability distinctions.

The chart title “Approximate solution vs time” is part of
`F1-LANG-004`; no chart data, series, axis, method, preset, or numerical
behavior changed.

## 10. Convergence review

The review covered eligible conclusions, selected-metric labels, table
headers, reliable and non-reliable evidence, blocked/unavailable and
stale/current states, teaching sections, chart direction, exact-solution
consistency, and accessible formulas. Accepted Group C conclusions and
formulas are present, and observed-order classifications, values, evidence
pairs, primary-metric ownership, and chart data remain unchanged.

The retained sentence “Measured order can differ from theory…” is not accepted
as a harmless local alias. In the same teaching section, nearby text also uses
“primary measured maximum-error order,” while Version 1 requires `observed
order` and the named `maximum global error` metric. This is a real
cross-surface terminology contradiction and is `F1-LANG-001`.

## 11. Tutor review

The review covered the subtitle, suggested questions, theoretical/observed
order, smaller-step limitations, graph explanation, LTE/global-error
distinction, stability and stiffness, residual/iteration diagnostics,
current/stale/unavailable evidence, Compare unavailability, server prompt
policy, and deterministic demo replies.

Accepted Group D strings and request/grounding behavior are unchanged.
Remaining metric/order/numerical-approximation aliases are documented in
`F1-LANG-003` and `F1-LANG-004`. The deterministic substring-routing collision
is independently reproduced and documented as `F1-BEH-001`; it is not fixed
here.

No real model, provider request, API key, or external service was used.

## 12. Math-input and accessibility review

The real editable-field disclosure renders `LaTeX` and `Interpreted
expression`, retains its native `details`/`summary` semantics, remains focusable
with visible focus, and stays within the desktop and mobile viewport.
Expression-error ownership remains in the existing summary; `COPY-043` adds no
error owner or duplicate announcement. The singular/plural error-summary
heading remains correct.

No DOM, accessible-name relationship, MathLive configuration, virtual-keyboard
binding, validation timing, or CSS changed. Browser review exercised the
production field and disclosure; direct virtual-keyboard presentation was not
separately forced, so its unchanged behavior is supported by the structural
non-change audit and focused regression tests rather than a new manual claim.

## 13. Generic Glossary-framework copy review

Only the content-agnostic framework was reviewed: trigger names, compact
preview, pinned desktop surface, mobile sheet, generic section labels,
failure/status copy, Tutor-handoff status, and DEV-only Playground labels.
The generic “Why it matters here” heading is consistent. `COPY-041` and
`COPY-042` remain deferred to Group E and were not edited.

The core production registry remains empty. The current Lab exposes no
Glossary binding. Production excludes the Playground, its development
controls, and all ten neutral fixtures. No mathematical definition was
reviewed as production content because none exists.

## 14. Behavioral findings

`F1-BEH-001` is independently reproduced in the local deterministic demo.
`buildMockResponse` lowercases the user message and later tests
`q.includes("table") || q.includes("summary")`. For an explicit-method
context, the exact prompt `Why is this unstable?` bypasses the implicit
diagnostic branch and matches `table` inside `unstable`, returning the
unrelated “Table summary for Forward Euler…” response.

Classification:
`PRODUCT_BEHAVIOR_FIX_REQUIRED_BEFORE_GROUP_E`.

The defect affects deterministic/demo behavior in the local API and any
environment using that mock path. The real-provider path does not use this
substring branch. The demo response is learner-facing and misleading. The
smallest separate fix is a token/word-boundary or explicit table-intent
predicate, with a regression for the exact unstable prompt and retention of
the existing real table-summary test.

## 15. Automated verification

| Gate | Result |
|---|---|
| Untouched `editableMathField` baseline | 1 file, 13 tests passed |
| Tests-first COPY-043 run | 1 intended failure; 12 existing tests passed |
| Final COPY-043 run | 1 file, 13 tests passed |
| Required cross-surface focused run | 13 files, 135 tests passed; no listed path was absent |
| Application typecheck | Passed |
| API typecheck | Passed |
| Full `npm.cmd run verify` | 73 files, 1,042 tests, both typechecks, and production build passed |
| Production build | 79 modules; only the accepted deferred-chunk warning |
| Source/diff review | Only the authorized production literal and focused assertion changed |

The focused cross-surface set covered Platform pages, the IVP route,
Convergence view/teaching, Tutor binding/Host/lazy boundary, API
prompt/responses, Glossary surface/Host, editable math, and expression error
summary.

## 16. Browser evidence

Development review used isolated in-app browser tabs and localhost-only
traffic at 1440×900 and 390×844.

- `/`, `/about`, `/ode`, `/linear-algebra`, and `/pde` showed accepted Group A
  wording and truthful availability without horizontal overflow.
- `/ode/initial-value-problems` exercised presets, successful explicit and
  implicit Runs, Output, diagnostics, a three-level Forward Euler Convergence
  Study, teaching sections, Tutor, and the editable-field disclosure.
- `COPY-043` rendered exactly, remained contained at mobile width, and retained
  native disclosure focus.
- Stiff Relaxation guidance, nonlinear/absolute-stability distinction,
  exact-solution proof limitation, chart direction, and missing/current Tutor
  evidence supported the `COPY-NC-*` classifications.
- Desktop Glossary Playground and the mobile Glossary sheet exercised generic
  framework labels, inert background, focus, and containment only.
- The mobile Tutor dialog and Glossary sheet stayed within the viewport with
  body scroll lock, inert background, focused close controls, and no page
  overflow.
- The known explicit `Why is this unstable?` collision returned the unrelated
  table summary exactly as the source analysis predicted.
- Console warning/error checks were empty. Tutor traffic remained local demo
  traffic; no external request or sensitive data was used.

Some synthetic Convergence classifications, provider-only prompt policy, and
real-model behavior remain deterministic-test evidence rather than browser
evidence.

## 17. Production-preview and static evidence

The fresh production build was served only on `127.0.0.1`. At 1440×900 and
390×844, `/`, `/about`, `/ode`, `/ode/initial-value-problems`,
`/linear-algebra`, and `/pde` rendered without horizontal overflow or console
errors. The production math field showed `Interpreted expression`.
`/__dev/glossary-playground` rendered the in-shell Not Found page, and
production About had no Developer Tools.

Vite does not emit `.vite/manifest.json` in this repository. The equivalent
artifact audit therefore compared the complete built inventory and normalized
Rollup import graph against a clean archive of starting HEAD:

| Evidence | Starting HEAD | F1 result |
|---|---:|---:|
| JavaScript chunks | 8 | 8 |
| CSS files | 7 | 7 |
| Normalized static import edges | 12 | 12 |
| Normalized dynamic import edges | 5 | 5 |
| Editable-math chunk raw bytes | 1,144,224 | 1,144,229 |
| Editable-math chunk deterministic gzip bytes | 306,608 | 306,612 |

The legitimate owner delta is `+5` raw and `+4` deterministic gzip bytes.
Vite's rounded build display moved from 308.80 kB to 308.81 kB gzip.
Other chunks retain their raw sizes; dependent content hashes and tiny gzip
differences reflect references to the renamed hashed editable-math chunk.
The normalized graph is identical.

`COPY-043` occurs only in the existing lazy editable-math chunk. Tutor and the
Glossary surface remain lazy. Static marker searches found no Playground path,
Developer Tools label, development-fixture IDs, or production term content.
`coreGlossaryEntries` remains an empty frozen array, and the ODE Lab still
exposes no Glossary binding.

## 18. Findings

| Stable ID | Severity | File / symbol | Exact current wording or behavior | Violated rule or contract | Impact and smallest separate correction | Tests | Blocks Group E? | Maintainer choice? |
|---|---|---|---|---|---|---|---|---|
| `F1-LANG-001` | P2 | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections` | “Measured order can differ…”, “primary measured maximum-error order”, plus nearby “maximum error” / “maximum-error order” phrases | `DEC-V1:observed_order_reliability`; `TERM-V1:observed_order`; named `maximum global error` requirement | Learners see competing names in one teaching surface. Replace only the stale phrases with `observed order` and metric-qualified `maximum global error` wording. | Focused `src/convergenceTeaching.test.ts`; Convergence view regression; desktop/mobile teaching review | Yes | Exact copy should be approved in a focused repair. |
| `F1-LANG-002` | P2 | `src/solvers.ts` · order validation and multistep metadata notes | “integer order of accuracy p”; “the global error is usually O(hᵖ), assuming stability” | Preferred `theoretical order`; LTE/global-error assumptions and plain-first qualification | Rare validation and visible method metadata retain pre-v1 terminology and an underspecified order statement. Use `theoretical order p`; qualify the order relation with the usual regularity and stability assumptions without changing metadata values. | Focused solver/catalog tests and Method-details browser review | Yes | Approve exact learner-facing wording. |
| `F1-LANG-003` | P2 | `api/chatHandler.ts` · `buildMockResponse` | Fallback “order of accuracy p”; “primary maximum-error interpretation/status/observed order” | `TERM-V1:theoretical_order`; `TERM-V1:observed_order`; named `maximum global error` requirement | Deterministic Tutor replies can contradict accepted Group C/D terminology. Replace only these residual server-owned phrases with theoretical-order and maximum-global-error wording. | Focused `api/chatHandler.test.ts` and `api/chatPrompt.test.ts`; local demo review | Yes | Exact reply copy should be approved; no branch change in this copy repair. |
| `F1-LANG-004` | P2 | `src/ode/odeApp.ts` chart title; `api/chatHandler.ts` graph reply | “Approximate solution vs time”; “The chart shows the approximate solution uₙ…” | `NOT-V1:EXACT_APPROX`; preferred `numerical approximation` | UI and Tutor use an avoidable alias where exact/numerical distinction is material. Use `Numerical approximation vs time` and `numerical approximation uₙ` without changing chart data or response routing. | ODE route/chart and API response assertions; desktop/mobile chart/Tutor review | Yes | Approve exact copy. |
| `F1-BEH-001` | P2 | `api/chatHandler.ts` · `buildMockResponse` table branch | `q.includes("table")` matches the letters in `unstable`; `Why is this unstable?` returns a table summary for an explicit method | Tutor intent/evidence relevance; learner-facing behavior contract | Misleading demo reply. Replace substring matching with a bounded table-intent predicate while retaining summary intent. Real-provider behavior is unaffected. | Add exact explicit-context regression for `Why is this unstable?`; retain existing table-summary and implicit-diagnostic tests | Yes | Runtime fix requires separate authorization. |

Counts:

```text
P0 = 0
P1 = 0
P2 = 5
P3 = 0
```

## 19. Carry-forwards

- `COPY-003` remains held and `DEFERRED_TO_FUTURE_MODULE`.
- `COPY-041` and `COPY-042` remain `DEFERRED_TO_GROUP_E`; editing their generic
  surface strings alone must not activate production content.
- The five P2 findings require separate pre-E repair and acceptance.
- Provider-only policy, real-model prose, synthetic Convergence
  classifications, and direct virtual-keyboard presentation retain their
  existing automated or future manual evidence boundaries.
- F2 remains mandatory after Group E.

## 20. Explicit non-changes

This iteration changes no accepted A–D product copy, `COPY-NC-*` product
string, Tutor routing or substring logic, API/provider/request behavior,
numerical coefficient or algorithm, grid or tolerance, Convergence value or
classification, result/session state, DOM structure, accessible ownership,
MathLive configuration, virtual-keyboard behavior, CSS, dependency,
configuration, Glossary model/Host/surface/modal/loader/scope/lifecycle,
production entry, annotation, ODE binding, Tutor queue, remote, deployment, or
external account.

Only `COPY-043`, its focused assertion, this review, and the five authorized
status documents change.

## 21. Group E readiness decision

Group E is not ready to be planned yet. The pre-E gate is:

1. authorize exact copy for `F1-LANG-001` through `F1-LANG-004`;
2. authorize the narrow intent-matching repair for `F1-BEH-001`;
3. add the focused regressions specified above;
4. rerun affected focused suites, both typechecks, full verification,
   desktop/mobile localhost review, and production artifact inspection;
5. obtain maintainer acceptance of the repair checkpoint.

Only after that gate closes may the maintainer decide whether to authorize a
separate Group E design/content implementation task.

## 22. Post-Glossary F2 requirement

After any separately authorized Group E implementation, Group F2 must review
the real production Glossary vertical slice end to end: term content,
annotations, accessible triggers, preview/card/pinned-popover/mobile-sheet
content, dismissal and route lifecycle, Tutor handoff wording, UI/Glossary/Tutor
terminology, production binding and lazy ownership, desktop/mobile behavior,
and production artifact exclusion boundaries.

F1 completion must never be cited as F2 completion or as authorization to
publish production Glossary content.
