# Cross-Lab Method Teaching Alignment v2 — Repository-Grounded Implementation Plan

**Date:** 2026-08-22

**Status:** Design accepted with binding addendum; **Phase 0 and Phase 1 are
implemented and locally verified**. The Phase 1 registry awaits independent
mathematical/content audit. Phase 2 and later phases remain separately gated.

**Milestone:** Cross-Lab Method Teaching Alignment v2

**Authoritative design:** [`../specs/2026-08-22-cross-lab-method-teaching-alignment-v2-design.md`](../specs/2026-08-22-cross-lab-method-teaching-alignment-v2-design.md)

**Current product baseline:** `411e641d8cc6b14240acc408130876781fb1ee84` / tree `92f79cba8bdabafb9a97e3a99d76ddff853fe35c`

**Execution gate:** Phase 0 authority confirmation and the additive Phase 1
pure teaching model are complete. Stop before Phase 2 pending the independent
Phase 1 audit and separate Maintainer authorization.

## 1. Purpose and stop condition

This plan maps the accepted design direction to current repository owners so a later implementation can align the Initial Value Problems Lab with the Linear Systems teaching-first cognitive architecture without changing ODE numerics or flattening ODE’s exploratory personality.

It is deliberately staged. Each implementation phase must start clean, add focused behavioral evidence before or with its source change, finish with a narrow reviewable commit, and stop at its named review gate. A later task must not infer authority to execute the next phase from this document.

The completed bounded task stopped after Phase 1. It added pure reviewed
teaching content/selectors/tests and narrowly aligned stale learner-facing
catalog/result-note wording, but it did not modify browser-visible ODE
composition, CSS, routes, sessions, numerical behavior, or architecture; it
did not resume Presentation Phase 7.

## 2. Recorded binding authority

The Maintainer accepted **Landscape to Lens** and resolved the former authority
questions at documentation checkpoint
`bfe5d514c67b1f5c00a1bc71b128f158e4811a5a`:

1. principal order is Problem → Landscape → Selected method lens → Selected
   concepts → After-solve guidance → Continue to Data;
2. Compare is a secondary branch attached to the landscape, with detailed
   teaching only after entry;
3. method selection chooses family, Data owns editable order, and initialized
   family-specific order survives reselection; default metadata applies only
   at initial construction, New experiment/reset, or first initialization;
4. selection does not auto-scroll, and **Read selected method** is optional
   pending Phase 2 browser evidence;
5. the initial future diagrams are FE/BE update relation, RK4 stage path,
   AB/AM/BDF history rail with predictor/corrector variant, and Leap-Frog
   staggered rail; Taylor begins with formula anatomy/process;
6. UI-default implicit teaching says Newton while fixed-point remains an
   internal override; BDF6 theory remains order 6 with a qualified current
   startup limitation; Taylor's internal centered estimates/five-evaluation
   count are approved at the stated depth; Leap-Frog's current staggered update
   is approved; and stability claims remain source-qualified only.

These are copy and teaching-authority decisions. If implementation inspection
finds a numerical-behavior conflict, stop. No supported input, algorithm,
coefficient, startup, tolerance, diagnostic, or contract may change here.

## 3. Invariants for every phase

### 3.1 Product and numerical invariants

- Keep all eight current methods runnable, with current IDs, formulas, supported/default orders, profile boundaries, startup, fixed-grid rules, solver defaults, tolerances, budgets, and diagnostics.
- Preserve first-order single mode, first-order Compare, Leap-Frog’s second-order single-only profile, presets, optional exact solution, Output, Convergence, Tutor, and Glossary behavior.
- Do not duplicate coefficient tables, preset truth, formula behavior, or method ranges in a new uncontrolled owner.
- Keep immutable successful results until the existing successful-operation rules replace them. Method teaching selection must not silently Run, clear output, or make stale output look current.
- Preserve `AppSessionStore`/ODE session purity; no DOM/runtime/asynchronous handles enter stored state.

### 3.2 Architecture and lifecycle invariants

- Keep `/ode/initial-value-problems` behind its current complete-Lab dynamic route boundary.
- Do not make Home, static pages, or Linear Systems import the ODE teaching registry, ODE solvers, Chart.js, Convergence, Tutor, MathLive, or Compute Engine.
- Preserve deferred MathLive and Compute Engine behavior and first-open Tutor loading.
- Reuse current route/Lab ownership and idempotent disposal. No hidden complete-Lab DOM, duplicate listeners, detached focus, or stale rendering callback may survive navigation.
- Keep Compare inside the ODE Lab and keep `FIRST_ORDER_CATALOG` as its eligibility authority.
- Do not import the global Router into the Lab or add a framework/state library.

### 3.3 Experience invariants

- Preserve the cognitive order: Problem → Landscape → Selected profile → Concepts → After the solve → Data transition. Compare remains a secondary branch rather than an inserted primary section.
- Keep the complete landscape shallow and only the selected profile deep.
- Selection stays on Method; **Continue to Data** owns the primary transition.
- Selection preserves initialized family-specific order. Default-order metadata
  never replaces a supplied current order; Data remains the editable owner.
- Keep mathematics visually and semantically stronger than UI chrome.
- Preserve keyboard operation, visible focus, non-color state, safe formula rendering, meaningful mobile order, Light/Dark parity, and no page-level overflow.

## 4. Current owner map

| Concern | Primary current owner(s) | Planned role |
|---|---|---|
| Method identity/classification/ranges | `packages/numerics/src/ode/methodCatalog.ts` | Imported authority; edit only if an approved copy conflict requires a narrow correction |
| Numerical updates/startup/result metadata | `packages/numerics/src/ode/solvers.ts` | Read-only numerical authority; only approved stale note copy may change, never algorithms |
| Implicit defaults/diagnostics | `packages/numerics/src/ode/nonlinearSolver.ts` | Read-only behavior authority |
| Multistep coefficients | `packages/numerics/src/ode/polynomial.ts` | Imported/generated authority; no copied coefficient tables |
| Formula display models | `frontend/src/math/ui/methodMathContent.ts` | Extend only for approved closed readonly formula models and accessible labels |
| ODE Method composition and interaction | `frontend/src/labs/ode/odeApp.ts` | Integration owner; split only narrow pure teaching helpers/components, not the Lab architecture |
| ODE styling | `frontend/src/labs/ode/odeApp.css` | Token-based implementation owner |
| ODE pure state | `frontend/src/labs/ode/odeSession.ts` | Existing selection/result authority; avoid schema changes unless evidence proves one is necessary |
| Presets and observation guidance | `frontend/src/labs/ode/problemPresets.ts` | Imported authority |
| Expression profiles | `frontend/src/labs/ode/problemExpressions.ts` | Imported authority |
| Convergence teaching/state/view | `frontend/src/labs/ode/convergenceTeaching.ts`, `convergenceStudyState.ts`, `convergenceStudyView.ts` | Existing evidence semantics; link conceptually, do not duplicate calculations |
| Glossary/Tutor integration | `frontend/src/labs/ode/odeGlossaryContent.ts`, `odeGlossary.ts`, `odeTutorBinding.ts`, `convergenceTutor.ts` | Preserve current behavior/lazy ownership; no feature expansion |
| Route/lifecycle | `frontend/src/labs/ode/initialValueProblemsRoute.ts` | Preserve complete-Lab lazy/disposal boundary |
| Linear Systems reference | `frontend/src/labs/linear-algebra/linearSystemsTeaching.ts`, `linearSystemsApp.ts` | Read-only cognitive and editorial reference; no redesign |

Phase 1 implemented the following focused owners after repository inspection:

- `frontend/src/labs/ode/odeMethodTeachingContent.ts` — reviewed prose/content records keyed by existing method family and concept IDs;
- `frontend/src/labs/ode/odeMethodTeaching.ts` — pure composition/selectors that derive a profile from catalog/content/preset authorities;
- `frontend/src/math/ui/methodMathContent.ts` — one additive closed Leap-Frog teaching formula; the existing current-UI formula function and output remain unchanged;
- colocated focused tests for each new pure owner and the additive safe-math record.

No separate teaching-math module or parallel application layer was needed.
The new content/selectors remain unimported by `odeApp.ts` and therefore inert
until a separately authorized integration phase.

## 5. Verification ladder

Every authorized phase uses only the checks proportional to its changes, in this order:

1. start-of-task Git identity/status checks and exact diff inspection;
2. focused tests for the changed owner(s);
3. ODE route/lifecycle/session tests when composition or selection changes;
4. typecheck after TypeScript changes;
5. targeted browser review at the phase’s required states/viewports;
6. full test/build/manifest verification only at the integration/final phases defined below;
7. `git diff --check`, diff scope/self-review, and clean post-commit status.

Browser screenshots belong outside the repository. Browser evidence must distinguish DOM/behavior assertions from visual/layout evidence. jsdom does not prove geometry, typography, real custom-element lifecycle, virtual-keyboard behavior, or mobile overflow.

## 6. Commit and rollback strategy

- Work directly on clean local `main`; no branches/worktrees unless the Maintainer explicitly changes the workflow.
- Use one coherent commit per accepted phase or per clearly named sub-slice below. Stage only approved files; do not amend, rebase, stash, reset, push, or deploy.
- Each phase must leave a behaviorally complete product state. Do not commit a landscape that selects a method without rendering a truthful profile, or a profile that removes the existing path to Data.
- Prefer additive pure content/model commits before composition/CSS commits. This makes rollback possible without touching numerical kernels.
- If a browser slice fails acceptance, fix within that uncommitted phase or stop. Do not pile a compensating redesign onto later phases.
- Phase 8 is an audit/release-readiness decision, not a catch-all rewrite. Material findings return to the smallest owning phase through a new authorized task.

Proposed commit sequence appears with each phase. Exact messages may be adjusted by the Maintainer, but each boundary must remain narrow and truthful.

## 7. Phase 0 — Reconfirm authority and freeze the implementation slice

**Purpose:** prevent source conflicts or stale plans from being converted into learner copy.

### 7.1 Read/inspect

- Repeat the full `AGENTS.md` start protocol and confirm the accepted design/status documents are current.
- Reinspect `methodCatalog.ts`, `solvers.ts`, `nonlinearSolver.ts`, `polynomial.ts`, `grid.ts`, `methodMathContent.ts`, `problemPresets.ts`, `problemExpressions.ts`, `odeSession.ts`, `odeApp.ts`, and all focused tests cited by the design ledger.
- Search for every learner-facing occurrence of “fixed-point,” Adams-Moulton/BDF order wording, Taylor derivatives, Leap-Frog formulas, and stability/accuracy language.
- Record the five decisions in Section 2 in the active HANDOFF or an approved numerical/content decision document. Do not create learner copy from unresolved conclusions.

### 7.2 Deliverable and gate

- A narrow approved authority note/decision, if required, plus a confirmed first implementation slice.
- No product behavior change.
- Stop for numerical-authority/Maintainer review if any owner disagrees with the design ledger.

**Authorized commit:** `Record ODE teaching authority decisions`. It records
the accepted addendum and may include only the approved narrow stale-copy
corrections proved by focused tests.

**Rollback:** documentation-only revert; no numerical/product state is involved.

## 8. Phase 1 — Pure teaching model and content contract

**Purpose:** establish one tested, source-linked teaching model before restructuring the page.

**Outcome:** implemented and locally verified at
`48511a2cf4f3c3d7fd35504a0b49102022f00f32` (tree
`1abfe1d15bd33cfbd215da88ca11be5090962a1c`). The registry contains exactly
eight profiles and fifteen stable concept records. Structural method/order/
Compare facts derive from `METHOD_CATALOG`/`FIRST_ORDER_CATALOG`; preset
availability and suggestions derive from `PROBLEM_PRESETS`; the selector
reflects caller-supplied family order without selecting, replacing, or
mutating it; and formulas use the closed safe readonly math owner. The current
ODE UI, CSS, session, lifecycle, and numerical behavior remain unchanged by
Phase 1.

### 8.1 Tests first

Create focused tests beside the chosen owners, likely:

- `frontend/src/labs/ode/odeMethodTeachingContent.test.ts`
- `frontend/src/labs/ode/odeMethodTeaching.test.ts`
- extend `frontend/src/math/ui/methodMathContent.test.ts` only for new shared safe-math models

Test that:

- exactly one profile exists for every current `METHOD_CATALOG` family and no unknown profile exists;
- identity, profile, explicit/implicit, one-/multistep, supported/default order, and Compare eligibility are derived from current catalog authority;
- configurable order truth is sourced, not hand-copied into prose logic;
- selectors accept the caller-supplied current family order, preserve it on
  reselection, and never choose, mutate, or reset order from default metadata;
- suggested presets are resolved from `PROBLEM_PRESETS`, while all first-order presets remain available;
- every profile supplies core idea, primary formula reference, accessible verbalization, process, concepts, watch point, observation prompt, result/Convergence availability, and review-safe claim IDs;
- unresolved/forbidden claim text cannot appear in publishable content;
- formula records use the closed safe representation and do not accept raw HTML, executable expressions, or unbounded MathJSON;
- concept IDs are stable and each profile selects only its relevant subset;
- BDF6, Taylor derivative, implicit Newton, and Leap-Frog boundary wording matches the recorded Phase 0 decisions.

### 8.2 Implement the pure owners

- Add the smallest reviewed content registry keyed by existing `MethodFamily`.
- Add pure selectors/composers that join catalog metadata, content, and preset guidance without mutating them.
- Extend safe formula content only where the accepted profile requires an expression not represented by the current owner. Keep visible prose, mathematical notation, and accessible verbalization separate.
- Do not import `odeApp.ts`, DOM APIs, session store, Router, Tutor, Glossary host, Chart.js, or numerical evaluator closures into pure teaching files.
- Do not copy generated multistep coefficients. The advanced view will receive them from current result/catalog paths when applicable.

### 8.3 Verification and review gate

Run focused content/math tests, TypeScript typecheck, and import-graph/source review. No browser redesign is visible yet.

Stop for independent mathematical/content review of all eight records before page composition.

**Implemented commit:** `Add reviewed ODE teaching profiles`

**Rollback:** remove the additive registry/selectors/tests; no production composition or state is changed.

## 9. Phase 2 — Problem foundation, landscape, and selection shell

**Purpose:** replace the selection-first card wall with the accepted teaching-first opening while preserving existing selection semantics and Data navigation.

### 9.1 Tests first

Extend focused ODE app/route tests, likely `frontend/src/labs/ode/initialValueProblemsRoute.test.ts`, `odeLifecycle.test.ts`, `odeSession.test.ts`, and a new narrow Method-view test only if the current harness warrants it.

Cover:

- problem foundation and first-/second-order boundary render before editable Data fields;
- three labelled landscape groups contain all eight unique native method controls;
- the session-selected family is visually/semantically selected and maps to one profile shell;
- selection updates the existing session family, stays on Method, preserves the current order for ordered families, and does not Run, advance, clear successful output, or manufacture a new result;
- focus remains on the activated control; a polite status is emitted once; no automatic scroll occurs;
- an explicit read-profile action, if approved, focuses only a connected profile heading;
- Continue to Data still uses the existing step path and reflects the selected profile;
- Compare remains reachable as a secondary first-order action;
- disposal/remount does not duplicate controls/listeners or restore focus into detached DOM.

### 9.2 Implement composition

- Refactor only the Method rendering seam in `odeApp.ts`; avoid broad Lab decomposition or symmetry refactors.
- Render the concise IVP foundation with the existing safe readonly math path.
- Render the shallow catalog-driven landscape using the accepted groups: first-order one-step, first-order history, and second-order staggered.
- Use native button/single-selection semantics and accepted status/focus behavior. Reuse the existing selected-family mutation rather than adding preview state.
- Render a selected-profile shell with stable heading/landmark ownership and the existing Data transition; detailed profiles follow in later phases.
- Keep editable RHS, exact solution, interval, initial values, step size, and order inputs in Data/Compare.

### 9.3 Style and visual review

- Implement only the foundation/landscape/selection-shell styles in `odeApp.css`, using current tokens and presentation grammar.
- Review 1440 × 900 and 390 × 844 in Light/Dark, plus approximately 320px overflow. Confirm one mathematical focal point, no card wall, legible selected state, stable focus, and authored mobile order.
- Compare read-only against Linear Systems’ cognitive rhythm; do not alter Linear Systems markup or CSS.

### 9.4 Gate

Run focused tests, typecheck, browser states above, `git diff --check`, and a static/dynamic import review. Stop for Maintainer visual/cognitive acceptance of the opening and landscape before adding full teaching depth.

**Suggested commit:** `Align the ODE Method opening and landscape`

**Rollback:** revert Method composition/CSS/tests; pure teaching content from Phase 1 remains inert and safe.

## 10. Phase 3 — One-step selected profiles

**Purpose:** complete implementation-ready teaching for Forward Euler, Backward Euler, Taylor 2, and RK4 using the profile schema.

### 10.1 Tests first

Add per-profile behavioral/content tests that verify:

- the core formula, anatomy, actual one-update sequence, order/state/work facts, watch point, observation prompt, relevant concepts, and availability boundaries;
- Forward Euler uses the current slope and does not gain unsupported stability rankings;
- Backward Euler visibly requires an endpoint solve, uses approved Newton wording, and keeps nonlinear convergence distinct from stability/accuracy;
- Taylor states that only `f` is learner input and places internal derivative approximation details at the approved depth;
- RK4 identifies all four stages as evaluations rather than accepted solution points;
- simple and dense formulas each have exactly one accessible owner;
- selection among these profiles preserves focus, output, order state, and Method position.

### 10.2 Implement

- Complete the shared selected-profile renderer in the narrow Method seam.
- Add profile-owned concept subsets, formula anatomy, ordered update, watch point, “what to observe,” after-solve bridge, and selected-aware Data endcap.
- Add only approved static diagrams from the design decision. Use semantic DOM/approved icons and authored accessible descriptions; do not introduce decorative/custom SVG art or animation.
- Keep advanced material in one-level native disclosures; keep required profile/solve/input facts visible.

### 10.3 Browser review and gate

Review all four profiles at desktop/mobile in Light/Dark, with keyboard selection, native disclosures, dense RK4 math, Taylor advanced detail, Backward Euler diagnostics explanation, focus, and overflow. Confirm no result is visually claimed before Run.

Run focused tests, typecheck, and route/lifecycle regressions. Stop for independent math/content/accessibility review of the one-step slice.

**Suggested commit:** `Teach ODE one-step method profiles`

**Rollback:** revert profile rendering/content additions for these records without touching the landscape, Data, or numerical source.

## 11. Phase 4 — History and second-order selected profiles

**Purpose:** add complete Adams-Bashforth, Adams-Moulton, BDF, and Leap-Frog teaching while making startup, solve, and profile boundaries unmistakable.

### 11.1 Tests first

Verify that:

- Adams-Bashforth distinguishes stored slopes, generated coefficients, `N≥p`, `p-1` RK4 startup values, and one new post-startup RHS evaluation;
- Adams-Moulton distinguishes AB prediction from the accepted Newton-corrected value and never renders stale fixed-point learner copy;
- BDF distinguishes solution history from Adams slope history, states current order range, and uses the approved BDF6 limitation wording;
- Leap-Frog teaches `u''=a(t,u)`, `u₀`, `v₀`, the approved staggered initialization/update/reconstruction, and no velocity-dependent/general-system promise;
- changing an ordered family/profile reflects its supplied existing stored
  order without putting an order control in Method or replacing that order
  with catalog default metadata;
- preset suggestions are truthful and never filter availability;
- Leap-Frog has no preset selector, exact-reference promise, Compare entry, or Convergence action;
- coefficient displays consume current generated/result metadata and are absent when no successful relevant result exists.

### 11.2 Implement

- Add the history rail/predict-correct/staggered diagram patterns only if accepted; otherwise use complete formula anatomy and process lists.
- Reuse existing order metadata and result coefficient/diagnostic presentation paths. Do not make teaching copy depend on a successful result; clearly separate generic method structure from run evidence.
- Add profile-specific concept sets: history/startup for Adams/BDF, predictor/corrector and nonlinear residual for Adams-Moulton, derivative history for BDF, staggered state for Leap-Frog.
- Ensure the Data endcap changes cleanly between first- and second-order inputs without moving editable controls into Method.

### 11.3 Browser review and gate

Review longest/densest profiles at 1440 × 900, 390 × 844, and approximately 320px in both themes. Exercise order variants through Data, return to Method, inspect focus/orientation, select Leap-Frog, and verify Compare/Convergence boundaries.

Run focused content/app/session/lifecycle tests and typecheck. Stop for independent numerical/content review, with explicit verdicts on Newton wording, BDF6, and Leap-Frog.

**Suggested commit:** `Teach ODE history and Leap-Frog profiles`

**Rollback:** revert the four profile slice and its tests/styles; one-step profiles and landscape remain usable.

## 12. Phase 5 — Concepts, after-solve bridge, Compare, and transition integration

**Purpose:** complete the full teaching arc and make exploration paths coherent without changing their numerical behavior.

### 12.1 Tests first

Cover the cross-profile behaviors:

- each selected profile renders only its reviewed concept subset and does not dump all concepts;
- “After the solve” accurately branches by evidence availability: optional exact/global error and Convergence for eligible first-order single runs; implicit diagnostics for relevant methods; startup/coefficient evidence for ordered methods; `u/u'` evidence for Leap-Frog;
- the bridge never fabricates a result, diagnostic, exact value, observed order, or stability conclusion;
- Compare entry is visibly secondary, labelled first-order, and leaves Leap-Frog excluded through `FIRST_ORDER_CATALOG`;
- entering/exiting Compare preserves existing selected methods, configured orders, forms, successful snapshots, and ordinary stale-result rules;
- Continue to Data summarizes the currently selected profile and reaches the correct existing first-/second-order form without moving configuration into Method;
- Method → Data → Run/Output → Method reconstructs the selected teaching profile and keeps prior output behavior intact;
- Tutor/Glossary bindings, successful-Run Tutor reset rules, and scroll restoration remain unchanged.

### 12.2 Implement integration

- Finish the selected concepts and after-solve sections with reviewed content records and existing Output/Convergence terminology.
- Keep a compact Compare entry within or immediately after the landscape and
  render detailed comparison teaching only after entry. Do not insert Compare
  as a primary section between Landscape and the selected profile or turn it
  into a ninth method.
- Wire the single primary Continue to Data action through current step navigation and selected session authority.
- Remove obsolete Method card-wall copy/markup only after tests cover all existing navigation and selection responsibilities. Do not delete reusable shared presentation primitives merely because this composition no longer uses one instance.
- Keep Tutor and Glossary behavior out of scope. Existing annotations may continue where their accepted owners attach them; do not add new production terms/cards/requests.

### 12.3 Verification and gate

Run the focused ODE app/session/lifecycle/Compare/Convergence/Tutor/Glossary tests affected by the composition, then typecheck. Browser-test single and Compare round trips, successful and stale results, exact enabled/disabled, Convergence eligibility, Leap-Frog, navigation away/back, scroll/focus, and console health.

Stop for Maintainer acceptance of the complete desktop teaching arc before responsive/polish hardening.

**Suggested commit:** `Integrate ODE teaching with Compare and Data`

**Rollback:** revert the integration commit; profile/landscape owners remain independently testable.

## 13. Phase 6 — Responsive, accessibility, and Light/Dark hardening

**Purpose:** make the accepted composition production-quality at all required viewports and input modes.

### 13.1 Tests first

- Add/extend semantic tests for heading order, native buttons, persistent selection state, status announcements, disclosure names, figure descriptions, formula accessible labels, Compare naming, and primary transition ownership.
- Add focus tests for mouse/keyboard selection, explicit read-profile navigation, disclosure interaction, step transition, remount, and disconnected targets.
- Keep presentation tests behavioral/token-oriented. Do not encode arbitrary CSS strings, pixel dimensions, or screenshots as the only contract.
- Add a no-duplicate-ID/accessibility-name check for eight controls, profiles, figures, and formula owners.

### 13.2 Implement and inspect

- Refine `odeApp.css` using accepted tokens and existing ODE/presentation selectors. Avoid global style leakage and unrelated cross-Lab refactors.
- Author semantic transformations for desktop, 390 × 844, and approximately 320px: compact landscape lists, selected-profile reading order, local formula containment, diagram reflow, readable metadata, separate Compare/Data actions, and no page-level overflow.
- Verify focus/hover/selected/planned states in Light/Dark without color-only meaning.
- Respect reduced motion; no essential interaction or explanation depends on animation.
- Inspect long English labels and every dense formula/profile, not only Forward Euler.

### 13.3 Required browser matrix

| Viewport/theme | Required states |
|---|---|
| 1440 × 900 Light | First open, FE, Backward Euler, RK4, Adams-Moulton, BDF, Leap-Frog, Compare, Data transition |
| 1440 × 900 Dark | Mathematical focal points, selection/focus, simple and dense formulas, diagram, Compare, transition |
| 390 × 844 Light and Dark | Full landscape, longest names, method switch, disclosure, return-to-landscape, Compare, Continue to Data |
| Approximately 320px | Formula/diagram containment, target/label readability, no page overflow, intentional reading order |
| Keyboard + reduced motion | Complete selection/profile/Compare/Data path, focus visibility, no motion-dependent meaning |

Save evidence outside the repository. Record console errors/warnings and distinguish browser-observed behavior from automated semantics.

### 13.4 Gate

Run focused accessibility/presentation/lifecycle tests, typecheck, browser matrix, and `git diff --check`. Stop for Maintainer desktop/mobile Light/Dark visual acceptance.

**Suggested commit:** `Harden ODE method teaching presentation`

**Rollback:** revert responsive/polish CSS and narrow semantic adjustments without losing the complete teaching flow.

## 14. Phase 7 — Integrated regression, bundle, and release-candidate evidence

**Purpose:** prove the complete alignment does not regress numerical behavior, other Labs, lazy boundaries, lifecycle, or production build structure.

Phase 7 in this plan is implementation verification; it does **not** automatically resume or complete the separately paused Cross-Lab Presentation release audit.

### 14.1 Focused and full verification

Run from the clean implementation candidate:

```text
npm.cmd run test:run -- <changed ODE teaching/math/app/session/lifecycle files>
npm.cmd run test:run -- frontend/src/labs/ode/initialValueProblemsRoute.test.ts frontend/src/labs/ode/odeLifecycle.test.ts frontend/src/labs/ode/odeSession.test.ts
npm.cmd run test:run -- <affected Compare/Convergence/Tutor/Glossary tests>
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd run verify
git diff --check
```

Use the repository’s actual supported syntax and update file arguments at execution time. Do not weaken or skip tests to obtain a pass. API typecheck is expected to remain unchanged but is included in final integrated verification.

### 14.2 Bundle and lazy-loading evidence

Inspect in this order:

1. Vite manifest/Rollup graph;
2. static versus dynamic import paths for the new teaching owners;
3. raw and gzip chunk changes;
4. marker searches only as supplementary evidence;
5. browser Network sequence on Home/static, first ODE open, first formula editor use, and first Tutor open.

Required outcome:

- Home/static routes do not pull ODE teaching content, ODE runtime, Chart.js, Convergence, Tutor, MathLive, or Compute Engine;
- ODE remains one complete lazy Lab route;
- MathLive/Compute Engine and Tutor remain deferred at their current boundaries;
- no `manualChunks` workaround is added solely for a warning.

### 14.3 Cross-Lab and lifecycle regression evidence

- Recheck Linear Systems Method/Data/Output desktop and mobile to prove no content, behavior, or styling regression.
- Exercise rapid route changes, repeated Lab entry/disposal, Method selections, Compare entry/exit, Data/Output round trips, New experiment, back/forward restoration, and Tutor/Glossary open/close around navigation.
- Verify old navigation work never mounts, focuses, scrolls, or disposes newer route content.
- Confirm production UI remains English-only and no learner copy exposes internal governance/prompt language.

### 14.4 Gate

Record exact totals, commands, manifest evidence, browser matrix, limitations, and clean status in a new implementation review/HANDOFF update only if the Maintainer authorized that documentation. Stop before release-audit resumption.

**Suggested commit:** `Verify cross-Lab method teaching alignment` for authorized review/status evidence only; do not mix product fixes into this documentation commit.

**Rollback:** no product mutation in the evidence commit. Any failure returns to its owning phase through a separately reviewed fix.

## 15. Phase 8 — Independent audit and Presentation release-audit resumption gate

**Purpose:** obtain an auditor-independent verdict before the paused Presentation Phase 7 can resume.

The auditor inspects committed/stable work and must not perform broad rewrites. Required dimensions:

1. mathematical/content accuracy against the authority ledger and exact source owners;
2. cross-Lab cognitive alignment without visual cloning;
3. all-eight-profile completeness and supported-claim discipline;
4. selection/Data/Compare/output/session/lifecycle preservation;
5. accessibility, mobile, Light/Dark, focus, overflow, formula and diagram ownership;
6. lazy-load/bundle boundaries and absence of numerical/dependency/architecture drift;
7. documentation truth: implemented, locally verified, independently audited, Maintainer accepted, and released remain distinct statuses.

Critical or material findings return to the owning phase. Small unambiguous fixes require explicit write authority, remain uncommitted for primary-worker inspection, and receive focused regression evidence.

Only after:

- the implementation passes this independent audit,
- the Maintainer accepts the completed visual/pedagogical result,
- the active PLAN/HANDOFF explicitly unpauses the release sequence,

may a separate task resume the Cross-Lab Presentation Phase 7 release audit. This plan does not authorize push, preview, production deployment, or release claims.

**Suggested commit:** `Record method teaching alignment audit` for an approved review/status document only.

## 16. Expected file mutation matrix

This is a constrained forecast, not permission to touch every file.

| File | Expected action | Boundary |
|---|---|---|
| `frontend/src/labs/ode/odeMethodTeachingContent.ts` | Add, if approved | Reviewed prose/content only; keyed to current families/concepts |
| `frontend/src/labs/ode/odeMethodTeachingContent.test.ts` | Add | Completeness, authority, forbidden-claim, preset tests |
| `frontend/src/labs/ode/odeMethodTeaching.ts` | Add, if a pure selector seam is useful | Compose imported authorities; no DOM/session/router/runtime handles |
| `frontend/src/labs/ode/odeMethodTeaching.test.ts` | Add | Pure derivation/profile tests |
| `frontend/src/labs/ode/odeMethodTeachingMath.ts` | Optional add | Closed safe formula models only; avoid competing with `methodMathContent.ts` |
| `frontend/src/math/ui/methodMathContent.ts` and test | Narrow modify if shared math ownership is preferred | Safe readonly formula/accessibility only; no parser expansion |
| `frontend/src/labs/ode/odeApp.ts` | Narrow modify | Method composition/selection/transition only; preserve other Lab flows |
| `frontend/src/labs/ode/odeApp.css` | Narrow modify | Accepted Method presentation, responsive, themes; no global redesign |
| `frontend/src/labs/ode/initialValueProblemsRoute.test.ts` | Modify | Route-visible Method/selection/transition behavior |
| `frontend/src/labs/ode/odeLifecycle.test.ts` | Modify | disposal/remount/focus/listener safety |
| `frontend/src/labs/ode/odeSession.test.ts` | Modify if selection/result coverage needs it | Prove existing state is sufficient; do not drive schema expansion |
| Existing Compare/Convergence/Tutor/Glossary tests | Modify only when behavior boundary is exercised | Regression evidence, no feature expansion |
| `packages/numerics/src/ode/methodCatalog.ts` | Normally read-only; narrow copy correction only after authority approval | No IDs, ranges, classification, or numerical behavior change |
| `packages/numerics/src/ode/solvers.ts` | Normally read-only; narrow stale result-note correction only after authority approval | No algorithm/evaluation/startup/default/tolerance change |
| `PLAN.md`, `docs/INDEX.md`, `docs/PROJECT_HANDOFF.md`, review doc | Update only at approved phase transitions | Precise status/evidence; no release claim without evidence |

Files not expected to change include `docs/architecture/CURRENT_ARCHITECTURE.md` unless an implemented architecture genuinely changes and a separately authorized documentation step requires it; numerical algorithms/tests unless numerical behavior is separately authorized; Linear Systems production files; route paths; platform store; API; dependencies; Vite/Vercel configuration.

## 17. Test-first mapping by responsibility

| Responsibility | Primary evidence | Failure boundary |
|---|---|---|
| Authority completeness | Pure registry/catalog/preset/formula tests | Stop before rendering |
| Problem and landscape hierarchy | Route/Method DOM semantics + browser first viewport | Stop before detailed profiles |
| Real method selection | App/session/focus tests | Must not create preview state or advance |
| Profile mathematics | Per-profile content/formula tests + independent math review | Stop affected profile; do not generalize around conflict |
| Compare preservation | Existing Compare integration/regression tests + browser round trip | Stop integration slice |
| Output/Convergence truth | Existing result/stale/Convergence tests | No new diagnostic or eligibility |
| Lifecycle | Existing route/lifecycle tests + rapid browser navigation | No leaked/disconnected mutations |
| Accessibility | Semantic/focus tests + keyboard/manual browser review | No certification claim from jsdom |
| Responsive/themes | Browser at required viewports/themes | No page overflow or desktop-stack mobile |
| Lazy/bundle | Manifest/import graph/sizes/network | No eager ODE/heavy dependency regression |
| Cross-Lab regression | Linear Systems focused/full tests + browser baseline comparison | No Linear Systems rewrite |

## 18. Review evidence required at each stop

Every phase report should include:

- starting and ending branch/HEAD/status;
- exact files and diff scope;
- behavior and authority changed, plus explicit non-changes;
- tests added/changed and exact command/results;
- typecheck/build/full verification only where required;
- browser states, viewports, themes, interaction/focus/overflow findings, and screenshot location outside the repository;
- lifecycle, session, numerical, Compare, and lazy-loading implications;
- unsupported claims or open authority questions;
- self-review findings;
- commit SHA and final clean status;
- the exact next review gate, without self-authorizing it.

## 19. Final implementation acceptance checklist

An eventual implementation is ready for the independent audit only when all are true:

- [ ] The Maintainer accepted the design and each executed phase was explicitly authorized.
- [ ] All eight runnable methods remain present and numerically unchanged.
- [ ] Problem, landscape, selected method, concepts, after-solve, and Data transition appear in the accepted cognitive order.
- [ ] The landscape is complete/shallow and the selected profile singular/deep.
- [ ] Selection uses existing session authority, stays on Method, preserves
      initialized family-specific order, and preserves result/state/lifecycle
      contracts.
- [ ] Compare remains a truthful secondary first-order workflow; Leap-Frog remains excluded.
- [ ] All eight profiles pass authority/content tests and independent mathematical review.
- [ ] Adams-Moulton/BDF, BDF6, Taylor, and Leap-Frog gated language matches recorded decisions.
- [ ] Formula and diagram content follows safe/accessibility ownership contracts.
- [ ] Desktop/mobile/approximately-320px and Light/Dark browser matrices pass.
- [ ] Keyboard, focus, selected state, disclosure, reduced-motion independence, and no overflow pass.
- [ ] Linear Systems remains behaviorally and visually unmodified except for shared-regression evidence.
- [ ] ODE route, Tutor, Glossary, MathLive/Compute Engine, Chart.js, and Convergence lazy boundaries remain intact.
- [ ] Focused/full tests, typechecks, build, verify, bundle inspection, and `git diff --check` pass at the final phase.
- [ ] Documentation distinguishes implementation, local verification, independent audit, Maintainer acceptance, preview, production, and release.
- [ ] No dependency, route, numerical, session-schema, PDE, Motion, or unrelated architecture expansion was introduced.

## 20. Exact next gate

After the completed Phase 0 and Phase 1 stop, the next action is an
**independent mathematical/content audit of the Phase 1 teaching registry**.
Phase 2 opening/landscape implementation then requires separate Maintainer
authorization. Do not modify the real ODE Method UI or CSS, resume the paused
Presentation Phase 7 release audit, push, or deploy under this task.
