# Cross-Lab Presentation System v1 Implementation Plan

**Status:** Phase 0 is the current authorized phase and is implemented locally; maintainer visual approval pending; Phase 1+ not authorized

**Design authority:**
[`2026-08-12-cross-lab-presentation-system-v1-design.md`](../specs/2026-08-12-cross-lab-presentation-system-v1-design.md)

**Starting implementation prerequisite:** Satisfied at design commit `3b77f7133a95bef855c2eb3e3a69db37e16f1e46`

**Current gate:** Stop after Phase 0 before shared primitives or Lab migration

## 1. Objective and boundary

Implement the accepted presentation system as a staged vanilla TypeScript/CSS
migration. The work aligns shared visual and semantic roles without changing
numerical algorithms, sessions, Computation Trace, MathML authority, ODE
expression/Compare/Convergence behavior, Linear Systems Teaching v2, Tutor,
Glossary, Motion, routes, dependencies, or deployment.

The plan is resolved enough to implement because the current owners and lazy
boundaries are explicit:

- platform tokens and entry-safe page styling:
  `frontend/src/app/theme.css`, `frontend/src/app/platform.css`;
- static overviews: `frontend/src/pages/pageContracts.ts`,
  `odeOverviewPage.ts`, `linearAlgebraOverviewPage.ts`, and
  `pdeOverviewPage.ts`;
- ODE composition/style: `frontend/src/labs/ode/odeApp.ts`, `odeApp.css`,
  `convergenceStudyView.ts`, and focused tests;
- Linear Systems composition/style: `frontend/src/labs/linear-algebra/`
  `linearSystemsApp.ts`, `linearSystems.css`, `linearSystemsTeaching.ts`,
  `linearSystemsMath.ts`, `computationWalkthrough.ts`, and focused tests;
- lazy registration and boundaries: `frontend/src/app/moduleRegistry.ts`,
  `routeDefinitions.ts`, import-boundary tests, and the Production manifest.

## 2. Global implementation rules

1. Work on clean local `main` only under the repository contract.
2. Execute one phase per separately approved task and stop at its review gate.
3. Write focused behavioral/DOM/token tests before each migration where
   practical.
4. Add project-owned DOM helpers; do not add a framework or dependency.
5. Keep shared primitive APIs content-oriented and free of domain state types.
6. Import Lab-shared primitives only from complete-Lab route graphs.
7. Preserve old domain classes until the migrated role passes tests and browser
   comparison; then remove only rules proven unused.
8. Do not modify numerical, trace, MathML, Motion, Tutor, Glossary, or
   deployment owners.
9. Do not combine phases merely because the diff is small.

## 3. Proposed shared source layout

Create after Phase 0 approval:

```text
frontend/src/components/lab-presentation/
  labShell.ts
  workflowNavigation.ts
  stageSection.ts
  problemContext.ts
  teachingBlock.ts
  primaryResult.ts
  evidenceBlock.ts
  computationWalkthroughShell.ts
  analysisSurface.ts
  supportingElements.ts
  labPresentation.css
  labPresentation.test.ts

frontend/src/pages/moduleOverview.ts
```

File granularity may be reduced if the first fixture proves that adjacent
helpers are inseparable, but do not create one large `components.ts` or move
domain renderers into this folder.

## 4. Phase 0 — lock tokens and contracts

**Execution status:** Implemented and locally verified at
`b81a8dfc8d1ab49be9f07cd3fff59cb5d7c3cf05` (tree
`56b810a3d4e0f5fe9c4f235b9bde0cfdabff06d0`). The exact stop gate remains
maintainer visual approval of the tokens and DEV fixture. Phase 1 is not
authorized.

### Changes

- Add semantic Lab aliases to `frontend/src/app/theme.css` for stage roles,
  surfaces, borders, typography, spacing, status, controls, and focus.
- Add token-contract tests beside the existing theme/token tests.
- Add a DEV/test-only static fixture for the primitive states only if existing
  jsdom fixtures cannot cover them; keep it outside public route definitions
  and Production assets.
- Record exact before-migration paired screenshots outside the repository.

Do not migrate Lab markup in this phase.

### Focused tests

- both Light/Dark values exist for every semantic color token;
- stage roles remain distinct in name and do not encode domain names;
- shared spacing maps to the existing scale;
- no raw external font, image, or dependency is introduced;
- DEV fixture exclusion if a fixture is added.

### Browser gate

Inspect token fixture or existing surfaces at 1440 x 900, 390 x 844, and 320
pixels in Light/Dark. Verify focus visibility and contrast visually; no claim
of automated contrast compliance without an actual contrast tool.

### Bundle gate

Production entry and route graph are unchanged except small token CSS. DEV
fixture markers are absent.

### Stop gate

Maintainer approval of token vocabulary and fixture before shared primitives.

## 5. Phase 1 — Lab shell, header, workflow, and stage

### Changes

- Create `LabShell`/`LabHeader`, `WorkflowNavigation`, `StageSection`, and shared
  supporting action/status/control classes.
- Exercise helpers with pure DOM fixture tests.
- Migrate only the outer shell/header/workflow/stage wrapper in ODE and Linear
  Systems. Keep internal Method/Data/Output/Diagnostics content unchanged.
- Supply navigation callbacks from each Lab; shared code must not import the
  global Router or a Lab session.
- For ODE, derive safe available-step activation from existing workflow/output
  state. Do not make unavailable Output navigable.

### Expected files

- new `frontend/src/components/lab-presentation/labShell.ts`,
  `workflowNavigation.ts`, `stageSection.ts`, `supportingElements.ts`, and
  `labPresentation.css`;
- `frontend/src/labs/ode/odeApp.ts`, `odeApp.css`, and workflow/lifecycle tests;
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts`,
  `linearSystems.css`, and app/route tests;
- shared token tests and import-boundary tests.

### Focused tests

- one `h1`, breadcrumb ownership, route-focus behavior;
- step order, current `aria-current`, disabled states, click/keyboard behavior;
- current step becomes fully visible in the local mobile rail;
- ODE cannot navigate to Output before success;
- Linear Systems current/stale workflow availability is unchanged;
- New experiment and platform Host buttons retain ownership;
- dispose/remount and scroll tests remain green.

### Browser gate

Paired Method surfaces at desktop/mobile Light/Dark; keyboard traversal; active
step containment at 390 and 320 pixels; New experiment dialog; route leave and
return; no console warnings/errors or page overflow.

### Bundle gate

Manifest proves the shared Lab presentation module is not in the platform
entry and is requested only by complete-Lab routes. Home/static routes still
exclude ODE, Linear Systems, Chart.js, Tutor, Glossary, MathLive, and Compute
Engine runtime.

### Stop gate

Independent shell/workflow accessibility and lazy-boundary review.

## 6. Phase 2 — context, teaching, result, evidence, and walkthrough primitives

### Changes

- Add `ProblemContext`, `TeachingBlock`, `PrimaryResult`, `EvidenceBlock`, and
  `ComputationWalkthroughShell` with fixture-driven slots.
- Add `NumericalTable` and `AdvancedDetails` supporting patterns.
- Do not migrate complete Lab content yet; prove all hierarchy levels with
  authored fixture content and existing renderer nodes.
- Verify that helpers append/compose provided nodes without cloning,
  serializing, or evaluating mathematical content.

### Focused tests

- labelled regions and heading levels;
- one mathematical accessible owner after composition;
- captions and header scopes for numerical tables;
- stale status precedes result and does not create a duplicate live region;
- walkthrough remains complete with no motion controller;
- source/operation/target DOM order and mobile stacking;
- four-level maximum surface fixture.

### Browser gate

Fixture review in Light/Dark at all three widths with long headings, long
scientific notation, matrices, comparison metrics, stale/failure status, wide
tables, and reduced-motion CSS inspection.

### Bundle gate

Fixture remains DEV-only; primitive production modules remain inside the
complete-Lab lazy graph and import no domain/runtime packages.

### Stop gate

Maintainer approval of the compositional hierarchy before a Lab migration.

## 7. Phase 3 — migrate ODE presentation

### Changes

- Compose ODE header, Method, Data, single Output, and Compare Output through
  the accepted primitives.
- Preserve method cards, presets, math editors, exact solution, charts, tables,
  Convergence, Tutor, Glossary, session, focus, scroll, and disposal.
- Move only shared primitive CSS out of `odeApp.css`; keep expression/editor,
  Chart.js canvas, preset, Compare, Convergence-specific, and domain styles
  local.
- Do not redesign Convergence into the shared Analysis surface until Phase 5.

### Expected focused tests

- existing ODE app, lifecycle, route, session, New experiment, Glossary,
  Tutor-host, Compare, exact-solution, chart, and Convergence tests;
- new workflow `aria-current` and availability tests;
- result heading focus and single/Compare metric labels;
- chart canvas/data identity and table rows unchanged;
- successful/failed Run preservation;
- no shared module imports solver/catalog/session authority.

### Browser gate

Single method from Method through Run; Compare pair; validation failure;
successful Output; Convergence setup/run; Glossary open/close; Tutor open/close;
New experiment; route leave/remount; desktop/mobile Light/Dark; no page
overflow or console warnings/errors.

### Bundle gate

ODE remains a complete lazy route; Chart.js remains ODE-owned; Tutor, Glossary,
MathLive, and Compute Engine retain existing deferred boundaries. Compare and
Convergence code do not enter Home.

### Stop gate

Independent ODE behavior-equivalence and presentation review.

## 8. Phase 4 — migrate Linear Systems presentation

### Changes

- Compose accepted Method Teaching v2, Data, successful/stale Output,
  factorization evidence, walkthrough shell, pivot failure, and Diagnostics
  outer hierarchy through shared primitives.
- Keep `linearSystemsTeaching.ts`, `linearSystemsMath.ts`, and
  `computationWalkthrough.ts` authoritative for content and mathematical DOM.
- Keep `linearSystems.css` domain ownership for matrix editor, MathML,
  transformations, and trace-specific layouts.
- Do not remount or alter Motion source.

### Expected focused tests

- all Teaching v2 copy/profile tests;
- native MathML structure and exactly one accessible owner;
- successful result uses `originalA`, `originalB`, and `xHat`;
- stale Output/Diagnostics exclude current edited drafts;
- row-swap and no-swap traces render unchanged;
- controlled pivot failure keeps only evidence through failure;
- computation/arithmetic disclosures and focus behavior;
- planned methods remain non-runnable;
- no Replay/Motion controller appears.

### Browser gate

Starter 3x3, Row swap required, custom decimal system, stale result, pivot
failure, expanded walkthrough/arithmetic, Diagnostics/advanced safeguards,
New experiment, route leave/remount, desktop/mobile Light/Dark, 320-pixel
transformation containment, and clean console/overflow state.

### Bundle gate

Linear Systems remains an independent lazy asset without ODE, Chart.js,
MathLive, Compute Engine, Tutor, Glossary, or DEV fixtures. Dormant Motion
source status is unchanged.

### Stop gate

Independent Teaching v2/MathML/trace equivalence and presentation review.

## 9. Phase 5 — unify Analysis presentation

### Changes

- Add `AnalysisSurface` if not already created as a fixture in Phase 2.
- Compose ODE Convergence and Linear Systems Diagnostics through the shared
  setup/conclusion/evidence/teaching hierarchy.
- Keep Convergence run state, exact-solution validation, budgets,
  classification, chart, and teaching in ODE owners.
- Keep Diagnostics as a read-only view of the Linear Systems successful result.

### Expected focused tests

- Convergence setup preview, run, consistency, classifications, table, metric
  toggle, chart, and teaching disclosures unchanged;
- Diagnostics context, residual purpose/order, reference qualification, and
  safeguards unchanged;
- no shared analysis controller or state type;
- statuses reuse existing live owners without duplicate announcements.

### Browser gate

Paired Convergence/Diagnostics at desktop/mobile Light/Dark, including long
tables, chart, result conclusion, stale Diagnostics, and advanced disclosure.

### Bundle gate

Convergence stays ODE-local; Diagnostics stays Linear Systems-local; the shared
module contains layout only.

### Stop gate

Independent cross-Lab Analysis hierarchy review.

## 10. Phase 6 — module overviews and duplicate-style retirement

### Changes

- Add entry-safe `frontend/src/pages/moduleOverview.ts`.
- Migrate ODE, Linear Algebra, and PDE overview pages to consistent status,
  card, capability/limitation, and action composition.
- Normalize only public copy positioning, not product claims.
- Remove shared duplicate rules from domain CSS only after `rg` usage audit and
  browser equivalence. Keep all domain-specific styles.

### Expected focused tests

- implemented versus planned status association;
- semantic action links and exact routes;
- no fake PDE control;
- existing page copy and navigation state;
- entry-safe module imports no Lab/runtime module;
- unused shared selector inventory is empty after cleanup.

### Browser gate

Home, About, ODE overview, Linear Algebra overview, and PDE roadmap at
desktop/mobile Light/Dark; navigation parent/exact states; no overflow or
console warnings/errors.

### Bundle gate

Compare entry asset against pre-migration manifest. Static routes remain free
of all complete-Lab and deferred runtime. Do not add `manualChunks` solely to
silence a size warning.

### Stop gate

Maintainer visual review of the complete migrated product before final audit.

## 11. Phase 7 — independent presentation release audit

Run an independent audit against the accepted design and exact implementation
commit. It must cover:

- all public routes and paired Lab surfaces;
- Light/Dark, 1440 x 900, 390 x 844, and 320-pixel stress;
- native controls, keyboard workflow, focus-visible, headings, `aria-current`,
  disclosures, statuses/live regions, dialogs/sheets, and mathematical owners;
- ODE single/Compare/Convergence/Tutor/Glossary;
- Linear Systems Teaching v2, both presets, custom/stale/failure,
  walkthrough/arithmetic/Diagnostics/advanced details;
- page-level and contained overflow;
- console health;
- Production manifest, static/dynamic graph, raw/gzip sizes, and DEV marker
  exclusion;
- full required repository verification for shared routing/lifecycle/UI work.

Any P0/P1 or substantive P2 blocks acceptance. Findings must be corrected in a
separate bounded task, not folded into the audit silently. Motion and Tutor
follow only later separately approved gates.

## 12. Verification command matrix

Use focused tests first for the files touched in each phase, then the broader
gates required by the repository contract. Expected commands include:

```text
npm.cmd run test:run -- <phase-focused test files>
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd run verify
git diff --check
git status --short
git diff --stat
```

Run the full suite and `verify` for Lab migrations and the final release audit,
not for an isolated documentation or token-design gate unless the phase changes
shared runtime. Inspect the Vite manifest/import graph before relying on marker
searches.

## 13. Rollback boundaries

- Phase 0 rollback removes semantic aliases/fixture only.
- Phase 1 rollback restores old outer shell/workflow classes while leaving
  internal content untouched.
- Phase 2 rollback removes unconsumed primitives/fixture only.
- Phase 3 rollback is ODE-only because no Linear Systems content is migrated.
- Phase 4 rollback is Linear Systems-only because shared primitives already
  passed ODE review.
- Phase 5 rollback restores domain-specific Analysis wrappers without changing
  their state/content.
- Phase 6 rollback restores overview composition and duplicate selectors from
  its phase commit.

Never roll back with history rewriting, broad checkout, or reset. Use a normal
revert only if the maintainer explicitly authorizes it.

## 14. Completion and next gates

Implementation is complete only after Phase 7 acceptance and documentation
updates accurately label it implemented and locally verified. Production
remains unchanged until a separately authorized release/deployment task.

Current exact next gate: **maintainer visual approval of Phase 0 semantic
tokens and the DEV fixture**. Stop before Phase 1.
