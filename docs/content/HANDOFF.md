# Numerical T-Lab Project Language v1 Handoff

Status: Project Language Standard v1 approved; Glossary catalog, copy audit,
implementation groups, and traceability reconciled; Groups A through D
accepted; Group F1 and its five pre-E repairs accepted as prerequisite state;
ODE Glossary Wave 1 Group E0 design and content governance
maintainer-approved; Option 2 rich-model implementation accepted at
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`; fresh E1 accepted and inert at
`08b80522283438a233974456a026a6dbc2a96746`; E2 runtime contract complete with
source implementation reauthorization required; E3/F2 unauthorized.

Runtime/content implementation tracked separately.

## 1. Iteration boundary

Yiding (Bruce) Tian approved all nine project-language decisions on
2026-07-28. The first documentation-only iteration promoted:

- [Numerical T-Lab Terminology Standard v1](NUMERICAL_TERMINOLOGY_STANDARD.md);
- [Numerical T-Lab Notation Standard v1](NUMERICAL_NOTATION_STANDARD.md); and
- [Numerical T-Lab Teaching Voice Standard v1](TEACHING_VOICE.md).

The binding choices and completion evidence are in the
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md),
[Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md), and
[Terminology Decisions](TERMINOLOGY_DECISIONS.md).

The follow-up documentation-only reconciliation now completes:

- all 197 rows in the [Glossary Catalog](GLOSSARY_CATALOG.md), with separate
  language, relevance, runtime-readiness, and wave dimensions;
- all 55 records in the [Project Copy Audit](PROJECT_COPY_AUDIT.md), with exact
  replacement copy, source/test/browser traceability, and no decision block;
- rich planning drafts for all 10 Wave 1 terms and 13 high-priority Wave 2
  terms; and
- the six-group
  [Project Language Implementation Plan](PROJECT_LANGUAGE_IMPLEMENTATION_PLAN.md).

Neither iteration publishes a production Glossary term, definition,
annotation, formula, Tutor card, notation migration, or product-copy change.
They change no runtime source, tests, CSS, packages, configuration, numerical
contract, deployment, or remote state.

## 2. Approved decisions

| Decision | Recorded choice | Version 1 result |
|---|---|---|
| Signed error | Option A | \(e_n=u_n-y(t_n)\); declare the orientation; aggregates remain absolute |
| Global error | Option A | Propagated nodal-error family; concrete scalars use named nodes or aggregations; no “total error” |
| Local truncation error | Option A | Unscaled LTE is \(O(h^{p+1})\); divided quantity is the step-normalized local defect \(O(h^p)\) |
| Observed order | Option A | Metric, adjacent pair, finite value, and status travel together; only reliable values drive the primary summary |
| A-stability | Custom Option AB | \(z=h\lambda\), \(u_{n+1}=R(z)u_n\), \(\mathcal S=\{z\in\mathbb C:|R(z)|\le1\}\), closed nonpositive half-plane contained in \(\mathcal S\) |
| Stiffness | Option A | Fast and slow behavior plus a stability-driven step restriction; binding plain-first teaching modifier |
| Relative error | Option A | Nonzero reference magnitude; unavailable at zero; separately name scaled metrics; percent is \(100\%\) |
| Tolerance | Option A | Name the algorithm and controlled quantity; adaptive error-control wording remains future |
| Typography | Option A | Italic lowercase scalars/vectors and italic uppercase matrices; dimensions and prose are authoritative |

No decision is deferred. The recorded set is internally compatible. Released
final-time and maximum-global-error formulas, observed-order classifications,
tolerances, and numerical behavior are unchanged.

## 3. Teaching modifier

The binding cross-project rule is:

> Explain the core idea first in the plainest correct language. Add notation,
> assumptions, and exceptions only where they prevent a real mathematical
> misunderstanding.

The preferred sequence is plain core → why it matters → formula → limits and
confusions.

## 4. Terminology result

The terminology standard retains 197 stable candidate IDs. The 18 rows that
previously rolled up to the nine maintainer decisions are no longer
`DECISION_REQUIRED`.

| Readiness | Count after promotion |
|---|---:|
| `CORE_PROJECT_DRAFT` | 63 |
| `MODULE_DRAFT` | 91 |
| `FUTURE_CANDIDATE` | 31 |
| `DECISION_REQUIRED` | 0 |
| `DEFERRED` | 8 |
| `OUT_OF_SCOPE` | 4 |
| **Total** | **197** |

These statuses describe content readiness, not approval of the language
standard and not runtime implementation. Stable IDs and unrelated readiness
rows remain unchanged.

The historical conflict comparison retains 26 records:

- 13 already-aligned distinctions;
- 4 source-priority draft resolutions; and
- 9 formerly decision-required records now superseded by the approved
  resolution index.

## 5. Evidence baseline retained

The bounded content review admitted and processed 29/29 sources:

- 1,073 pages;
- 234 mapped sections;
- 523 source-level candidate occurrences;
- 197 merged stable candidate IDs; and
- 26 conflict records.

Tracked documentation uses abstract source keys and bounded locators only. No
private path, basename, hash, screenshot, raw extraction, or substantial
quotation is published. Private PDFs were not reopened for this promotion.

## 6. Reconciled catalog and copy audit

[Content Source Policy](CONTENT_SOURCE_POLICY.md) remains unchanged and
authoritative for evidence handling. The catalog and copy audit are now
reconciled against Project Language Standard v1.

The catalog:

- retains exactly 197 stable IDs;
- has zero decision-blocked rows;
- records 27 `V1_APPROVED`, 158 `DRAFT_UNAFFECTED`, 8 `DEFERRED`, and
  4 `OUT_OF_SCOPE` language statuses;
- preserves relevance counts of 63 core, 91 module, 31 future, 8 deferred, and
  4 out of scope;
- maps every row to a runtime-readiness status and one planned wave without
  authorizing runtime; and
- reports four required-ID gaps without adding them:
  `step_normalized_local_defect`, `test_equation`, and
  `scaled_stability_parameter`, plus the future Linear Systems prerequisite
  `positive_definite_matrix`.

The 27 `V1_APPROVED` catalog rows include the 18 formerly decision-blocked
rows plus 9 already-ready terms whose approved wording, formula, or distinction
is directly governed by those same Version 1 decisions.

The copy audit retains all 55 stable records: 39 accepted implementation
records, 1 locally implemented Group F1 record, 2
`REQUIRES_CONTENT_WAVE`, 1 `DEFERRED_BY_MODULE`, and 12 `NO_CHANGE`; none is
obsolete or decision-blocked. The original reconciliation implemented no
recommendation.
The separately authorized Group A iteration implements and accepts `COPY-001`,
`COPY-002`, `COPY-004`, and `COPY-005`; `COPY-003` remains held. The separately
authorized Group B iteration implements and accepts `COPY-006` through
`COPY-019`; Group C implements and is accepted for `COPY-020` through
`COPY-029`; Group D is accepted for `COPY-030` through `COPY-040`; and Group
F1 implements `COPY-043` locally while preserving all twelve `COPY-NC-*`
owners as review-only.

## 7. Runtime and numerical non-changes

The original approval and reconciliation iterations did not change:

- runtime TypeScript, API code, HTML behavior, CSS, tests, dependencies,
  package files, or deployment configuration;
- solver methods, coefficients, startup rules, grid/alignment rules,
  tolerances, budgets, exact-solution checks, error metrics, Convergence
  classifications, or solver metadata;
- App, Lab, Tutor, Store, Router, or Glossary ownership and lifecycle;
- Glossary registry entries, ODE annotations, Lab Glossary binding, Tutor
  queue behavior, Keep/Replace behavior, or notation profiles;
- Platform, IVP, Convergence, preset, method-card, Tutor, or other product copy;
- README, approved framework specs/plans/reviews, or private source policy; or
- branches, remotes, Preview, Production, or deployment state.

The locally accepted Content-Agnostic Interactive Glossary Framework remains
content-neutral. The production registry still contains no Glossary entries,
annotations, ODE binding, or visible Glossary behavior.

The Group A iteration changes only `README.md`, visible static-page strings,
and focused copy expectations. It changes no route, link target, module
availability, numerical behavior, session state, Tutor behavior, Store,
persistence, lazy boundary, Glossary entry, annotation, or ODE binding.

The Group B iteration changes only approved IVP workflow, method-card,
result-label, grid-error, and Exponential Decay preset-summary strings plus
focused expectations. It changes no numerical literal or calculation, grid
arithmetic or validation order, method/preset ID or ordering, default state,
route, session, Tutor, Convergence teaching, Glossary content, annotation, or
ODE binding.

## 8. Local artifacts and validation

Ignored structured reconciliation artifacts record the complete catalog, wave
plan, copy audit, implementation groups, traceability, and deterministic
validation report. They extend the earlier decision artifacts but remain local
review aids, not runtime dependencies or tracked sources of public truth.

Documentation validation for this reconciliation covers:

- exactly 197 stable IDs and no duplicate/invalid alias;
- zero decision-blocked catalog or copy rows;
- all Version 1 affected terms, formulas, status dimensions, dependencies, and
  planned waves;
- all Wave 1 and selected Wave 2 rich drafts;
- all 55 copy records, exact replacements, rule/term/file/test/group
  references, and browser requirements;
- six complete implementation groups and machine-checkable traceability;
- approved-standard byte integrity, relative links, privacy,
  unfinished-marker, and cross-document consistency scans;
- allowed tracked paths and the absence of runtime/test changes;
- `git diff --check`; and
- final branch, commit, and clean-worktree evidence.

No npm test, typecheck, build, browser run, bundle inspection, deployment,
remote contact, push, or external access is required or claimed for this
documentation-only iteration.

## 9. Group A implementation checkpoint

The exact ready records `COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005`
are accepted.

- Product files changed: `README.md`, `src/pages/aboutPage.ts`, and
  `src/pages/odeOverviewPage.ts`.
- Focused test changed: `src/pages/pages.test.ts`.
- `src/pages/homeResume.test.ts` remained unchanged and passed as a regression
  check.
- `COPY-003` and `src/pages/homePage.ts` remain review-only and unchanged.
- The initial focused run failed only the two intended About/ODE copy
  expectations; the final focused run passed 2 files and 9 tests.
- The static source-graph regression passed 1 file and 7 tests.
- `npm.cmd run verify` passed 73 files and 1,028 tests, application typecheck,
  API typecheck, and the 79-module production build. Only the accepted large
  deferred-chunk warning remained.
- Isolated localhost review passed `/`, `/about`, `/ode`, `/linear-algebra`,
  and `/pde` at 1440×900 and 390×844 with exact copy, truthful statuses,
  visible focus, no clipped labels or horizontal overflow, and no console
  warning or error.
- Production inspection found an unchanged eight-JavaScript/seven-CSS chunk
  inventory. The main entry increased by 90 raw bytes for the expected string
  delta; every non-entry JavaScript chunk matched the accepted byte baseline.
  Production About excludes Developer Tools, the empty core Glossary remains
  empty, and no ODE Glossary binding exists.
- Nothing was pushed or deployed.

## 10. Group B implementation checkpoint

The exact ready records `COPY-006` through `COPY-019` are
accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

- Product files changed: `src/grid.ts`, `src/methodCatalog.ts`,
  `src/ode/odeApp.ts`, and `src/problemPresets.ts`.
- Focused tests changed: `src/grid.test.ts`,
  `src/ode/beginnerStarter.test.ts`,
  `src/ode/initialValueProblemsRoute.test.ts`,
  `src/ode/odeLifecycle.test.ts`, and `src/problemPresets.test.ts`.
  `src/ode/newExperiment.test.ts` remained unchanged and passed as a
  regression check.
- The tests-first run failed only seven intended copy expectations. The final
  focused run passed 6 files and 57 tests.
- The copy-only numerical audit parsed the four production TypeScript files
  before and after the change. With approved text literals ignored and the
  authorized `COPY-016` template-to-static-label replacement normalized in
  memory, syntax, identifiers, operators, and numeric literals matched.
  Direct diff review confirmed unchanged solver/grid calculations, method and
  preset IDs/order/values, validation branches, sessions, routes, imports,
  Tutor, Convergence teaching, and Glossary ownership.
- `npm.cmd run verify` passed 73 files and 1,031 tests, application typecheck,
  API typecheck, and the 79-module production build. Only the accepted large
  deferred-chunk warning remained.
- Isolated localhost review passed `/ode/initial-value-problems` at 1440×900
  and 390×844 through Beginner Starter, all method cards, Data and MathLive
  labels, Exponential Decay and Stiff Relaxation presets, successful Run and
  Output, Compare, native nonpositive-step validation, aligned-grid
  validation, and the step-budget error. Successful output survived failed
  reruns; visible values and result rows remained unchanged; focus remained
  visible; and no clipping, horizontal overflow, malformed encoding, or
  console warning/error appeared. A brief `/ode` navigation regression also
  passed.
- Production inspection found the unchanged eight-JavaScript/seven-CSS chunk
  inventory and no new dynamic import. Approved strings occur only in the
  existing shared ODE/Convergence chunk and lazy IVP route chunk. The shared
  chunk changed from 58,680/17,377 raw/gzip bytes to 58,841/17,460
  (`+161/+83`); the IVP route changed from 241,437/80,308 to
  241,722/80,370 (`+285/+62`). Entry/Home, Tutor, Glossary, MathLive, and
  readonly-math ownership remains unchanged; no production Glossary content,
  ODE binding, or DEV fixture was added.
- Nothing was pushed or deployed.

## 11. Group C implementation checkpoint

The exact authorized records `COPY-020` through `COPY-029` are accepted in
commit `6e28ba493681a3a2d223724ba4b1688557848717`.

- Product files changed: `src/convergenceStudy.ts`,
  `src/convergenceStudyView.ts`, and `src/convergenceTeaching.ts`.
- Focused tests changed: `src/convergenceStudy.test.ts`,
  `src/convergenceStudyOrder.test.ts`, `src/convergenceStudyView.test.ts`, and
  `src/convergenceTeaching.test.ts`.
  `src/mainConvergenceIntegration.test.ts` remained unchanged and passed as a
  regression check.
- The tests-first run failed only six intended copy assertions; 87 existing
  assertions still passed. The final focused run passed 5 files and 93 tests.
- A TypeScript AST comparison against starting HEAD matched all 8,573
  production nodes with string contents ignored: imports/exports, identifiers,
  operators, numeric literals, status literals, conditions, branch order,
  calls, object fields, loops, and return shapes were unchanged.
- Baseline and final focused evidence preserved eligibility and blocking
  reasons, three-to-six binary refinement levels, step counts, final-time
  error, maximum global error, observed-order values, the six released status
  values and precedence, maximum-global primary ownership, selected chart
  metric, interpretation selection, stale/current state, chart data, stored
  results, and teaching accordion state.
- `npm.cmd run verify` passed 73 files and 1,033 tests, application typecheck,
  API typecheck, and the 79-module production build. Only the accepted large
  deferred-chunk warning remained.
- Isolated localhost review covered `/ode/initial-value-problems` and `/ode` at
  1440×900 and 390×844. Forward Euler produced reliable primary evidence
  (`1.031`); metric switching preserved table values and kept the primary
  maximum-global metric explicitly named. A real six-level RK4 study at
  `h=0.0125` displayed below-resolution pairs without promoting them and kept
  earlier finite reliable values visible. Browser review also covered stale
  settings, missing exact solution, Compare ineligibility, expanded teaching
  sections, navigation away/back, semantic headers, one accessible owner per
  formula, visible focus, contained mobile table/chart scrolling, no page
  overflow, and no console warning or error.
- Negative, near-zero, no-improvement, and synthetic unavailable status cases
  remain deterministic-test evidence only. Current Convergence teaching has no
  local-truncation-error section, so this exact-copy group added none; source
  scan found no contradictory LTE normalization.
- Production inspection retained eight JavaScript and seven CSS chunks with no
  new import or dynamic import. The existing shared ODE/Convergence chunk moved
  from 58,841/17,460 to 58,885/17,475 raw/gzip bytes (`+44/+15`); the lazy IVP
  route moved from 241,722/80,370 to 241,871/80,388 (`+149/+18`). The deltas
  are bounded copy only. Entry/Home, Tutor, Glossary, readonly math, MathLive,
  and editable-math boundaries did not change.
- No Tutor or Glossary source changed. Production still has no Glossary
  content, annotation, ODE binding, or visible Glossary behavior.
- Nothing was pushed or deployed.

## 12. Group D implementation checkpoint

The exact authorized records `COPY-030` through `COPY-040` are
accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

- Product files changed: `api/chatHandler.ts`,
  `src/ode/odeTutorBinding.ts`, and `src/tutor/platformTutorPanel.ts`.
- Focused tests changed: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`,
  `src/ode/odeTutorBinding.test.ts`, and
  `src/app/platformTutorHost.test.ts`.
  `src/app/tutorLazyBoundary.test.ts` remained unchanged and passed as the
  lazy-boundary regression gate.
- The untouched focused baseline passed 43 tests. The tests-first run then
  failed only 10 intended language assertions while 42 behavioral,
  validation, provider, Host/modal, and lazy assertions passed. The final
  focused run passed 5 files and 52 tests.
- Request/API regression evidence preserved the validation order and exact 400
  JSON bodies, JSON content type, demo selection, provider URL,
  `gpt-4o-mini`, POST headers, JSON-object response format, 1,200-token limit,
  message roles/order, response parsing and shape, and chart-instruction shape.
  Provider coverage used only the local fetch stub; no external model was
  contacted.
- Binding/Host evidence preserved fresh source reads per message, successful
  output ownership, stale/current Convergence filtering, Compare
  unavailability, conversation-reset ownership, panel DOM and accessible
  controls, request lifecycle, focus/modal behavior, rendering, and
  independent Tutor lazy loading.
- A strict TypeScript AST comparison against starting HEAD
  `6e28ba493681a3a2d223724ba4b1688557848717` matched all 5,600 production nodes
  and found only 18 authorized text-fragment changes. Imports/exports, types,
  function signatures, conditions, branch order, operators, numeric and status
  literals, field names, request/response shapes, fetch logic, grounding
  fields and values, DOM structure, listeners, focus behavior, and lazy
  imports were unchanged.
- `npm.cmd run verify` passed 73 files and 1,042 tests, application typecheck,
  API typecheck, and the 79-module production build. Only the accepted large
  deferred-chunk warning remained.
- The deterministic localhost API returned the approved smaller-step,
  observed-order, LTE/global-error, graph/absolute-stability, BDF iteration,
  nonlinear residual/iteration, and unavailable-evidence language. A malformed
  request retained status 400 and the exact JSON error body. The API and
  browser used the existing demo path; no real key or model request was used.
- Isolated browser review covered `/ode/initial-value-problems` at 1440×900 and
  390×844. Browser-observed evidence included the approved subtitle and
  suggested questions; smaller-step, graph, theoretical-order, LTE,
  current-observed-order, unavailable-evidence, and implicit diagnostic
  replies; a successful Convergence Study; stale-evidence exclusion after a
  later successful Run; Compare Tutor unavailability; desktop/mobile wrapping,
  focus restoration, internal transcript scrolling, and no horizontal page
  overflow. The console remained free of warnings and errors.
- Stiffness, named-tolerance, step-normalized-defect, provider, and compact
  real-model prompt-policy distinctions remain deterministic-test evidence
  only. No new deterministic reply branch or real-model call was authorized.
- Production inspection retained eight JavaScript and seven CSS chunks with no
  new import or dynamic import. The existing shared ODE/Convergence grounding
  chunk remained 58,885/17,475 raw/gzip bytes. The lazy IVP route moved from
  241,871/80,388 to 241,898/80,391 (`+27/+3`); the independently lazy Tutor
  chunk moved from 11,697/4,449 to 11,705/4,442 (`+8/-7`); entry raw size
  remained 52,815 bytes. Server prompt/reply strings do not appear in browser
  assets. No Glossary content, ODE binding, DEV fixture, or new network
  dependency was added.
- Nothing was pushed or deployed.

## 13. Group F1 pre-Glossary consistency checkpoint

Group F1 implements only `COPY-043`, changing “Parsed expression” to
“Interpreted expression” in `src/math/ui/editableMathField.ts` and adding the
exact focused `dt`-label assertion. The tests-first run failed only that new
assertion; the final editable-field run passed 13 tests. Direct diff review
confirmed no DOM, MathLive, parsing, validation, focus, virtual-keyboard,
accessibility-ownership, import, or cleanup change.

All twelve `COPY-NC-*` records were inspected without changing their product
owners. Their classifications are:

- `CONSISTENT_NO_CHANGE`: `COPY-NC-001`, `002`, `003`, `004`, `007`, and
  `010`;
- `CONSISTENT_WITH_LOCAL_CONTEXT`: `COPY-NC-005`, `006`, `008`, `009`, and
  `011`; and
- `STALE_BUT_NON_BLOCKING`: `COPY-NC-012`, whose captured audit quotation
  predates the current handoff's truthful addition of the absent ODE binding.

The required cross-surface suite passed 13 files and 135 tests.
`npm.cmd run verify` passed 73 files and 1,042 tests, both TypeScript checks,
and the 79-module production build. Development and production-preview review
covered the public routes and IVP Lab at 1440×900 and 390×844, including
accepted A–D copy, `COPY-043`, Convergence, Tutor demo, generic Glossary
surfaces, focus/modal containment, page overflow, and console health.
Production retained eight JavaScript and seven CSS files and an identical
normalized import graph. The existing editable-math chunk grew by only
`+5/+4` raw/deterministic-gzip bytes. Production still excludes DEV routes and
fixtures, contains no Glossary term, and has no ODE binding.

The review verdict is **GROUP F1 COMPLETE — PRE-E FIXES REQUIRED**. Five P2
findings are recorded in the
[pre-Glossary consistency review](../reviews/2026-07-29-pre-glossary-project-language-consistency-review.md):

- `F1-LANG-001` — residual Convergence measured-order/maximum-error aliases;
- `F1-LANG-002` — solver-facing theoretical-order and LTE/global-error
  qualification;
- `F1-LANG-003` — residual Tutor order/maximum-global-error aliases;
- `F1-LANG-004` — numerical-approximation naming in the chart and Tutor; and
- `F1-BEH-001` — deterministic `unstable` → `table` substring routing.

No finding is fixed in Group F1.

## 14. Historical pre-E gate

At the close of Group F1, Groups A through D were accepted and Group E
remained unauthorized. The exact next gate was a separately authorized repair
and maintainer-acceptance checkpoint for `F1-LANG-001` through
`F1-LANG-004` and `F1-BEH-001`, including focused tests, full verification,
desktop/mobile review, and artifact inspection. The accepted Group F1 review
remains unchanged as historical evidence.

## 15. Pre-E repair closure

The separately authorized
[pre-Glossary repair](../reviews/2026-07-29-pre-glossary-repair-review.md)
created exactly two local commits:

1. `Repair pre-Glossary language inconsistencies` closes
   `F1-LANG-001` through `F1-LANG-004` with approved copy-only production
   changes and direct tests.
2. `Fix deterministic Tutor intent matching` closes `F1-BEH-001` with the
   bounded `table`/`summary` predicate, its regressions, and final evidence and
   status documentation.

All five findings are `CLOSED_VERIFIED`. The language red gate failed exactly
14 new assertions while 109 prior assertions passed, then all 123 tests
passed. The behavior red gate failed only the exact `Why is this unstable?`
regression while 35 other tests passed, then all 36 tests passed. The
cumulative focused gate passed 10 files and 161 tests. `npm.cmd run verify`
passed 73 files and 1,048 tests, both TypeScript checks, and the 79-module
production build.

Local deterministic demo review at 1440×900 and 390×844 confirmed the repaired
Convergence, solver/method, chart, and Tutor language; retained table and
summary behavior; corrected unstable routing; responsive containment; visible
focus; and no console warning or error. Production retained eight JavaScript
and seven CSS files and the same normalized 12-static/5-dynamic import graph.
The existing Convergence and lazy IVP chunks changed only by bounded string
deltas. Server-only Tutor strings remain outside browser assets. Production
still contains no Glossary term, annotation, DEV fixture, or ODE binding.
Nothing was pushed or deployed.

## 16. Accepted prerequisite state

The maintainer has accepted both prerequisite commits:

- `55db8e717c517f90d08911e4324c77c50c3d854f` — `Repair pre-Glossary
  language inconsistencies`; and
- `23f0ca817e136b5ed75b4c8324b9a85139aae2be` — `Fix deterministic Tutor
  intent matching`.

Those acceptances close the pre-E gate. They do not authorize production
Glossary content, annotations, a Lab binding, or surface activation.

## 17. Group E0 ODE Glossary Wave 1 approval

Group E0 is documentation/design governance only. Yiding (Bruce) Tian
approved it on 2026-07-29. Its complete review set is:

- the [ODE Glossary Wave 1 Content Packet](ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md);
- the
  [ODE Glossary Wave 1 Design](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md);
- the
  [ODE Glossary Wave 1 Approval Checklist](ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md);
  and
- the
  [ODE Glossary Wave 1 Design Readiness Review](../reviews/2026-07-29-ode-glossary-wave-1-design-readiness-review.md).

The proposed prerequisite order is exactly:

1. `ordinary_differential_equation`;
2. `initial_condition`;
3. `initial_value_problem`;
4. `step_size`;
5. `time_grid`;
6. `numerical_approximation`;
7. `exact_solution`;
8. `explicit_scheme`;
9. `forward_euler_method`;
10. `backward_euler_method`.

The packet contains one complete 29-field card for each of those ten IDs, one
complete 21-field record for each of ten exact approved annotations, four
explicit Lab scopes, and eighteen decision cards. All ten cards are
`APPROVED_WITH_REVISIONS`; all ten annotation records are `APPROVED`; and
D01–D18 record Option A. Core owns `numerical_approximation` and
`explicit_scheme` with ODE context-only overrides; ODE owns the other eight
cards. At the E0 checkpoint, the checklist checked content/design approval and
left E1/E2 implementation, E3/F2 execution, push, Preview, and Production
gates unchecked.

The approved rollout structure remains separately gated:

- E1 would add inert pure content data and focused content validation;
- E2 would add the ODE-owned binding and exact annotations behind the
  existing complete-Lab lazy boundary;
- E3 would perform integrated browser, bundle, and release review; and
- Group F2 would remain a mandatory separate post-Glossary consistency
  review.

No E1, E2, E3, or Group F2 work was authorized by E0 itself. `COPY-041` and
`COPY-042` remain `REQUIRES_CONTENT_WAVE`; no product source, tests, CSS,
package/configuration file, runtime registry, annotation, binding, Tutor
queue/card behavior, Preview, Production, remote, or deployment state changed
in Group E0.

The approval's structural validation covers the exact ten IDs, the 29 required
term-card fields, the ten 21-field annotation records, eighteen Option A
decisions, 163 checked content/design boxes, seven unchecked authorization
boxes, relative links, privacy markers, tracked-path scope, and cross-document
gate language. The final approval validator passed 52 of 52 checks, all 132
relative Markdown links resolved, `git diff --check` passed, and all four local
structured artifacts remain ignored. Its verdict is **DESIGN AND CONTENT
APPROVED — E1 AUTHORIZATION REQUIRED**.

## 18. E1 schema stop and rich-model design

A later maintainer authorization began E1, but repository inspection stopped
the attempt before any source or test change. The current compact
`GlossaryEntry`/module-override projection cannot represent every approved
card field. No term, annotation, binding, registry record, or runtime change
was created, and the blocked worktree must not be resumed.

The maintainer selected `E1-SCHEMA-01 = Option 2` and rejected the compact
projection. The documentation-only review set is:

- the
  [Rich Glossary Content Field Matrix](RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md);
- the
  [Rich Glossary Content Model and Complete Surface Design](../superpowers/specs/2026-07-29-rich-glossary-content-model-design.md);
  and
- the
  [Rich Glossary Content Model Design Readiness Review](../reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md).

The design retains `definition` for compact preview, adds optional generic
rich fields, uses a live/future related-term union, renders prerequisites,
preserves D05 context-only overrides, specifies the complete-card order, and
chooses one-level surface-local Back navigation. It keeps governance/private
metadata out of runtime, preserves the empty production registry, and changes
no Tutor, Store, annotation, binding, or lazy-loading ownership.

Its verdict is **RICH GLOSSARY MODEL DESIGN COMPLETE — IMPLEMENTATION
AUTHORIZATION REQUIRED**.

The subsequent documentation-only planning set is:

- the
  [Rich Glossary Content Model Extension Implementation Plan](../superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md);
  and
- the
  [Rich Glossary Content Model Implementation Plan Review](../reviews/2026-07-29-rich-glossary-content-model-plan-review.md).

It maps the accepted fields to the actual runtime types, builders, registry,
scope request, lazy surface, styles, neutral DEV fixtures, focused tests,
browser checks, production-exclusion checks, one-commit rollback, and clean
E1 restart contract. Its verdict is **RICH GLOSSARY IMPLEMENTATION PLAN
COMPLETE — AUTHORIZATION REQUIRED**.

The maintainer subsequently authorized that generic implementation plan. The
content-neutral runtime types, builders, validation, module composition,
scope resolver, complete-card renderer, one-level surface-local navigation,
minimal styles, and neutral DEV fixtures are now implemented and locally
verified. The
[implementation review](../reviews/2026-07-29-rich-glossary-content-model-implementation-review.md)
records verdict **RICH GLOSSARY MODEL IMPLEMENTED — READY FOR MAINTAINER
ACCEPTANCE** as its point-in-time verdict. The maintainer subsequently
accepted commit `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e` as the fresh E1
starting point. At that generic-model boundary, Production Core remained
empty, no Wave 1 ID or card had been added, and no annotation, ODE binding,
Tutor behavior, Store/session, numerical, package, or configuration change
was made.

## 19. Group E1 inert rich-content implementation

The separately authorized fresh E1 restart adds only inert source content and
focused ownership tests:

- `src/glossary/coreGlossary.ts` exports exactly two Core entries:
  `numerical_approximation` and `explicit_scheme`;
- `src/ode/odeGlossaryContent.ts` exports exactly eight ODE entries and one
  ODE extension with exactly two context-only overrides for the Core entries;
- exact composition produces the approved ten cards in teaching order;
- the production registry entry count, Core-content production importer count,
  annotation count, and ODE binding count remain zero;
- `implicit_scheme` remains unregistered future text, not a live relation;
- the obsolete registry-test assertion that Core content itself must be empty
  was removed while every production-empty and generic registry contract
  remained intact.

The direct tests own exact labels, aliases, preview/full definitions,
intuition, formulas and accessible text, assumptions/limits, misconception
statement/correction, prerequisites, live/future relations, confused terms,
Tutor topics, context-only composition, deep immutability, and plain-data
safety. The
[E1 review](../reviews/2026-07-29-ode-glossary-wave-1-e1-content-review.md)
records focused/full verification, import-graph and artifact inertness, exact
desktop/mobile review, and interactive production-build evidence.
The maintainer accepted E1 at
`08b80522283438a233974456a026a6dbc2a96746`.

`E1-BROWSER-EXCEPTION-01` permits only the pre-existing Google Fonts
stylesheet/font chain owned by unchanged `index.html`; the starting and
current blob are both `912cca340efa743ea0d2ceaa2dac7e0234a889bc`.
`BASELINE-EXT-FONT-001` is a P3 accepted nonblocking carry-forward owned by a
future Platform/asset-policy review. E1 introduced no external traffic and did
not remediate the baseline dependency.

## 20. Group E2 runtime-contract reconciliation

The first authorized E2 integration pass stopped before source/test changes
because the Method helper lacked one exact approved sentence and historical
D11 wording conflicted with the required Compare Output behavior. The
[E2 Runtime Contract](ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md) is now the
sole implementation authority for E2 interaction details.

`E2-CONTRACT-01` fixes the Method helper sentence and its trigger/plain-text
DOM split. `E2-CONTRACT-02` supersedes the old Single/Compare owner-transfer
sentence: only successful Single Output owns `ODE-W1-ANN-006`; Compare remains
plain. The complete source-grounded audit fixes all ten term mappings, owners,
trigger texts, DOM compositions, state/mode rules, rerender, replacement,
disposal rules, rejected duplicates, accessible names, and direct test owners.
No additional maintainer decision remains.

E2 source/test implementation is incomplete and requires fresh maintainer
reauthorization. E3, Group F2, push, Preview, and Production remain
unauthorized.

## 21. Current review gate

The ODE Glossary Wave 1 design, ten revised term cards, ten annotation records,
ownership, and rollout structure remain approved. E1 is accepted and inert.
The E2 runtime contract is complete. The next gate is fresh maintainer
reauthorization of E2 source/test implementation. E3, Group F2, push, Preview,
and Production remain separately gated and unauthorized.
