# Linear Systems Lab Version 1 Implementation Plan

Status: **Repository-grounded; Day 1 core, Day 1.5 structured evidence, and
Day 2 route/UI/platform verification implemented locally; Tutor pending**

Date: 2026-08-10

Authoritative design:
[Linear Systems Lab Version 1 Design](../specs/2026-08-10-linear-systems-lab-v1-design.md)

Authoritative numerical behavior:
[Numerical contracts](../../contracts/NUMERICAL_CONTRACTS.md)

## 1. Starting point and constraints

The accepted public baseline is commit
`b58584a5f7a1d5b09874479d3b413a063b94e061`, tree
`406430a598182fbecfb313f68552e44c473c7367`, on `main` with a clean worktree.
The accepted local Day 1 core starting point for the Day 1.5 trace checkpoint
is commit `d323fec9b4752290f0a88723db31f8c89ec4f0c5`, tree
`27895631400cd862e02398b51c43db5625b09249`.
The Initial Value Problems Lab and accepted Glossary gates are regressions-only
boundaries; this plan does not reopen or redesign them.

No new framework or dependency is required. The platform already provides:

- project-owned routes in `frontend/src/app/routeDefinitions.ts`;
- dynamic complete-Lab registration in `frontend/src/app/moduleRegistry.ts`;
- the generic lifecycle adapter in `frontend/src/app/labRouteAdapter.ts`;
- pure per-module Store/Tutor session isolation;
- lazy Tutor and optional Glossary ports; and
- Home Resume and route scroll infrastructure.

The current `/linear-algebra` page is static. No hidden Linear Algebra or PDE
runtime exists at the starting baseline.

## 2. Day 1 — authoritative pure core

Status: **implemented in this checkpoint**

### Production files

- `packages/numerics/src/linear-algebra/linearSystemsPresets.ts`
  - owns exactly two deeply immutable presets;
  - owns deterministic parsed-input fingerprints and exact preset matching.
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts`
  - validates the `2..6` dense square contract;
  - computes deterministic partial-pivot `P A = L U`;
  - performs forward/backward substitution;
  - computes original-data residual diagnostics;
  - attaches reference comparison only for an exact approved preset; and
  - returns deeply frozen success/failure data without caller aliases.
- `frontend/src/labs/linear-algebra/linearSystemsSession.ts`
  - owns controlled numeric drafts, preset/Custom identity, fingerprints,
    current/stale status, immutable latest success, and meaningful-work state;
  - preserves success across edits and failures; and
  - replaces output only after a complete successful solve.

### Tests

- `packages/numerics/src/linear-algebra/linearSystemsNumerics.test.ts`
- `packages/numerics/src/linear-algebra/linearSystemsPresets.test.ts`
- `frontend/src/labs/linear-algebra/linearSystemsSession.test.ts`

The focused gate covers both presets, dimensions 2 and 6, invalid dimensions
and shapes, finite input, deterministic ties, one/multiple/later-column swaps,
prior-column `L` swapping, `P A ~= L U`, triangular structure, solve accuracy,
residual semantics, zero and near-threshold pivots, direct norm scaling, small
scaled systems, immutability, preset authority, and atomic session behavior.

### Day 1 rollback boundary

The Day 1 commit contains only the three pure modules, their three focused
tests, the design/plan, and narrow current-state documentation updates. It does
not alter an existing runtime import graph because no route imports the new
core yet.

### Day 1.5 — structured computation evidence

Status: **implemented in this checkpoint**

- `packages/numerics/src/trace/computationTrace.ts` owns the small content-agnostic process,
  retention, count, continuation, and immutable-step contract.
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts` emits its discriminated semantic
  trace from the existing matrix-scale, pivot/swap/elimination,
  forward/backward-substitution, residual, and preset-reference loops.
- Successful results carry the complete bounded trace. Pivot-threshold
  failures may carry valid evidence through the rejected pivot without
  publishing partial success.
- `frontend/src/labs/linear-algebra/linearSystemsSession.ts` is unchanged: the session retains
  the trace only through its existing immutable successful result reference.

Focused tests prove generic finite/unbounded retention semantics, defensive
copy/freeze behavior, every Linear Systems trace phase, exact Day 1 numerical
output compatibility, pivot-failure evidence, and current/stale session
reference preservation. No renderer, route, UI, Tutor, ODE trace, Store,
dependency, or persistence work belongs to this checkpoint.

## 3. Phase 1 — route and UI integration

Status: **implemented and locally verified in Day 2**

### Implemented Linear Algebra owners

- `frontend/src/labs/linear-algebra/linearSystemsApp.ts`
- `frontend/src/labs/linear-algebra/linearSystemsApp.test.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.test.ts`
- `frontend/src/labs/linear-algebra/linearSystemsRoute.ts`
- `frontend/src/labs/linear-algebra/linearSystemsRoute.test.ts`
- `frontend/src/labs/linear-algebra/linearSystems.css`

The mounted app owns Method → Data → Output → Diagnostics DOM, cell draft
adapters, Run/reset interactions, semantic matrices/tables, a
presentation-only computation-trace renderer, current/stale presentation,
focus, announcements, and idempotent cleanup. It will use the Day 1 session as
its only pure domain state and must not reconstruct numerical steps from final
factors or the solution.

### Existing integration seams

- `frontend/src/app/contracts.ts`
  - add the Linear Systems route ID;
  - generalize Resume step labels to include Diagnostics only if required by
    the approved UI/Resume decision.
- `frontend/src/app/moduleRegistry.ts`
  - add one cached dynamic loader for the complete Linear Systems route;
  - reuse `createCompleteLabRoute` with module ID `linear_algebra`.
- `frontend/src/app/routeDefinitions.ts`
  - register `/linear-algebra/linear-systems` as a complete Lab route.
- `frontend/src/app/platformBootstrap.ts`
  - pass the new registry loader to route definitions.
- `frontend/src/app/appShell.ts`
  - generalize parent-section navigation state for the Linear Algebra nested
    route while preserving exact `aria-current` behavior.
- `frontend/src/pages/pageContracts.ts`
  - generalize the current ODE-specific intent-prefetch option to an explicit
    route target.
- `frontend/src/pages/linearAlgebraOverviewPage.ts`
  - change the truthful module status only after the complete route exists;
  - link to the runnable Linear Systems Lab.
- `frontend/src/pages/homePage.ts` and `frontend/src/pages/aboutPage.ts`
  - update status/entry copy only after runtime availability is real.

### Focused route/UI tests

- solver failure preserves prior Output/Diagnostics;
- edits mark output stale and exact restoration makes it current;
- preset identity/reference visibility follows fingerprints;
- dimension changes remain within `2..6` and preserve accessible cell names;
- factor/residual tables match the pure result;
- computation presentation consumes semantic trace records without running a
  second elimination or synthesizing missing steps;
- one Run publishes all result sections atomically;
- New experiment and route disposal are idempotent;
- session capture/restoration stores pure data only;
- desktop and mobile keyboard/focus/modal behavior remains accessible; and
- Home/static imports do not eagerly load the Linear Systems chunk.

### Browser and bundle gate

Verify the new route at wide desktop and approximately `390 x 844`, including
direct navigation, refresh, matrix editing, both presets, successful/failed
runs, stale/restored state, focus, semantic table containment, page overflow,
and console health. Inspect the Vite manifest before making any chunk claim.

## 4. Phase 2 — Tutor integration

Status: **planned; next separately gated task**

### Domain context and binding

Likely new files:

- `frontend/src/labs/linear-algebra/linearSystemsTutorBinding.ts`
- `frontend/src/labs/linear-algebra/linearSystemsTutorBinding.test.ts`

The binding will expose a compact, current-only context containing the
approved input, factorization/pivot evidence, computed `xHat`, residual, and
optional preset reference comparison. It must exclude stale, failed, partial,
or fingerprint-mismatched output and must not claim conditioning was computed.

### Shared Tutor changes

- `packages/contracts/src/tutor.ts`
  - replace the ODE-only request context with a prompt-profile-discriminated
    request while preserving ODE compatibility.
- `frontend/src/tutor/platformTutorPanel.ts`
  - build context by `binding.promptProfile` rather than rejecting every
    non-ODE binding;
  - keep transcript/request lifecycle module-isolated.
- `backend/src/ai/chatHandler.ts`
  - select bounded ODE or Linear Algebra system/mock behavior by validated
    profile;
  - preserve safe plain-text/math rendering and server-only provider access.
- `frontend/src/tutor/tutorClient.ts` and focused tests only if the shared request shape
  requires a narrow transport update.

No Linear Systems chart instruction is needed. No real provider migration or
Glossary-to-Tutor handoff belongs in v1.

### Tutor regression gate

Run focused binding/panel/API/prompt tests and the full suite. Prove fresh
context per message, stale exclusion, abort/generation safety, independent ODE
behavior, deterministic demo responses, no invented condition number/error
bound, and unchanged first-open Tutor lazy loading.

## 5. Phase 3 — platform and current-state synchronization

Status: **Day 2 current-state owners synchronized; Tutor/release update pending**

After route and Tutor behavior are verified, synchronize only current-state
owners:

- `AGENTS.md` for durable implemented baseline/milestone pointers;
- `GOALS.md` only if the durable product direction materially changes;
- `docs/architecture/CURRENT_ARCHITECTURE.md` for implemented Linear Systems ownership and lazy boundary;
- `PLAN.md` for the current release phase and next gate;
- `docs/INDEX.md` for authoritative documents/reviews;
- `docs/PROJECT_HANDOFF.md` for verified implementation state and limitations;
- `README.md` only when learner-visible availability is locally verified; and
- relevant page tests for status/copy truth.

Historical Glossary evidence remains historical and accepted. Do not rewrite
it or claim Preview/Production before those gates occur.

## 6. Phase 4 — release verification

Status: **Day 2 route/UI gate verified locally; complete v1 Tutor/release gate pending**

Run, in order:

1. focused Linear Systems numerical/session/UI/route/Tutor tests;
2. routing, lifecycle, Store, Tutor, accessibility, and bundle-ownership
   regressions;
3. `npm.cmd run test:run`;
4. `npm.cmd run typecheck`;
5. `npm.cmd run typecheck:api` after the Tutor/API change;
6. `npm.cmd run build` and Vite manifest/import-graph inspection;
7. `npm.cmd run verify` for the release candidate;
8. `git diff --check` and authorized-scope review; and
9. wide/mobile browser verification with exact commit/tree evidence.

Preview and Production deployment are separate maintainer-authorized gates.
Do not push or deploy merely to create evidence.

## 7. Three-day cut line

Cut before release if necessary:

- Linear Algebra Glossary cards/annotations;
- any chart or matrix visualization beyond semantic tables;
- condition number or any error bound;
- Jacobi, Gauss-Seidel, iterative refinement, Cholesky, or additional direct
  methods;
- arbitrary-size/sparse editors or persistent data;
- ODE teaching expansion;
- PDE implementation or preview changes;
- Tutor provider migration or Glossary handoff;
- unrelated framework, performance, theme, or cosmetic work.

## 8. Exact next gate

Maintainer review and acceptance of the locally verified Day 2 route/UI and
presentation-only Computation Walkthrough. After acceptance, begin the
separately scoped Linear Algebra Tutor integration. Do not add Linear Algebra
Glossary content, new numerical methods, push, or deploy at this gate.
