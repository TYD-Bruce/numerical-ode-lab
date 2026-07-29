# Numerical T-Lab Project Language v1 Handoff

Status: Project Language Standard v1 approved; Glossary catalog, copy audit,
implementation groups, and traceability reconciled; Groups A through C
accepted; Group D implemented and locally verified.

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

The copy audit retains all 55 stable records: 40 are
`READY_FOR_IMPLEMENTATION`, 2 `REQUIRES_CONTENT_WAVE`, 1
`DEFERRED_BY_MODULE`, and 12 `NO_CHANGE`; none is obsolete or
decision-blocked. The original reconciliation implemented no recommendation.
The separately authorized Group A iteration implements and accepts `COPY-001`,
`COPY-002`, `COPY-004`, and `COPY-005`; `COPY-003` remains held. The separately
authorized Group B iteration implements and accepts `COPY-006` through
`COPY-019`; Group C implements and is accepted for `COPY-020` through
`COPY-029`; and Group D locally implements `COPY-030` through `COPY-040`.

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
content-neutral. Production still contains no Glossary terms, annotations, ODE
binding, or visible Glossary behavior.

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
`IMPLEMENTED_LOCALLY_COMMIT_PENDING`.

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

## 13. Current review gate

Groups A through C are accepted. Group D is implemented and locally verified.
Production Glossary Wave 1 remains unauthorized. The next gate is maintainer
acceptance of the Group D commit and evidence package, followed by a separate
decision on whether to begin Group F consistency review before authorizing
Group E.
