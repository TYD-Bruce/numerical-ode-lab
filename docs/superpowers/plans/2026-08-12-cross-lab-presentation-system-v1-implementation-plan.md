# Cross-Lab Presentation System v1 Implementation Plan

**Status:** Phases 0 through 5 Maintainer accepted, with final Phase 5 acceptance at `371d151568abb426059da638d8b69c8f6af98227` (tree `9ccd00bf5693ae3e6d66efc28f4c317423b4d103`) and `P0 = P1 = P2 = P3 = 0`; Phase 6 entry-safe ModuleOverview and proven duplicate-style cleanup passed independent audit by baseline `411e641d8cc6b14240acc408130876781fb1ee84` (tree `92f79cba8bdabafb9a97e3a99d76ddff853fe35c`) but has no recorded Maintainer acceptance; Phase 7 is paused pending the separately reviewed [Cross-Lab Method Teaching Alignment v2 design](../specs/2026-08-22-cross-lab-method-teaching-alignment-v2-design.md)

**Design authority:**
[`2026-08-12-cross-lab-presentation-system-v1-design.md`](../specs/2026-08-12-cross-lab-presentation-system-v1-design.md)

**Starting implementation prerequisite:** Satisfied at design commit `3b77f7133a95bef855c2eb3e3a69db37e16f1e46`

**Current gate:** Maintainer review and acceptance of the Cross-Lab Method Teaching Alignment v2 design; do not resume Phase 7

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

**Execution status:** Maintainer accepted at final Phase 0 HEAD
`0c392e218dd7006d43811ddc4d7401a0ccb7c495` (tree
`3d0bc052f9a2e58b50aeb67b52ddb36f10dcd994`).

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

Satisfied: Maintainer approval of token vocabulary and fixture before shared
primitives.

## 5. Phase 1 — Lab shell, header, workflow, and stage

**Execution status:** Maintainer accepted at final Phase 1 HEAD
`881795715799cde4d41f7bd933303bea4db1f8a8` (tree
`5a64a6973ecddf710cad51c01220f7cacd646bdb`) after independent audit and
Maintainer visual review. Its one non-blocking P3 workflow-hierarchy
carry-forward is corrected in the Phase 2 candidate without adding a
completed/visited state.

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

Satisfied by the independent shell/workflow audit and Maintainer visual
acceptance recorded at final Phase 1 HEAD
`881795715799cde4d41f7bd933303bea4db1f8a8`.

## 6. Phase 2 — context, teaching, result, evidence, and walkthrough primitives

**Execution status:** Maintainer accepted with P3 carry-forward at final HEAD
`331bea3e695fb59620e7c316a27480549643c6f4` (tree
`9e49edeae9aff206435dca577933046189a86ddc`). Implemented initially at
`6add7174fb160cf4e377664d486905152583e4c2` (tree
`3f7dd9c49106c2e4631c6e01dde789cb051a4178`). The authored DEV fixture,
structural/accessibility tests, real-Lab workflow-only smoke, lazy-boundary
checks, and full verification passed. The independent audit reported
`P0 = 0`, `P1 = 0`, `P2 = 0`, and `P3 = 4`; Phase 3 closes the shared CSS and
test findings and corrects the handoff formula-owner count, while the Linear
Systems result-identity finding remains Phase 4-owned.

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

**Execution status:** Maintainer accepted at final Phase 3 HEAD
`1e9080f110385fe635885d28cd4a17e810c8421a` (tree
`1dc5b52346fadadf2f92d8ffa2169e7f5dc50cd8`) after the final correction
re-audit passed with `P0 = P1 = P2 = P3 = 0`.
Shared carry-forward closure is recorded at
`249225ea6703dbe53da689b28a67e8cfc35ae91a` and
`033017fa69d9b4b10edcee0e9449ec752d17d7a9`; the ODE migration is
`cc6850b75c6102258101a059856870a57e8657f5`; and final narrow containment is
`e1eefd98480b2f11eb796ea6117e7a428753c62a` (tree
`251220912f44ad28dbe85d56a174e9dde7cea7e4`), followed by explicit local
ARIA-target proof at `4c9720b811e2001683e25ff733052b77c2dca67a` (tree
`874b07332625c1f5d2be6fed38c86d5e452b2847`).

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

**Execution status:** Maintainer accepted at final HEAD
`692551774966bd9774900ecfef3d7fe03de61d7e` (tree
`6d7db2ed156a2c6415d1b362ea870fae4ff0c7ef`) after the final audit and
Maintainer visual review passed with `P0 = P1 = P2 = P3 = 0`. The original
implementation is `15e04db939938ae01234d67149f832c4efeaad60` (tree
`ed6756791fc5c553a1d39d99dd79cd3aabaa155e`).

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

Satisfied by the final independent audit, bounded P3 closure, and Maintainer
visual acceptance recorded at final Phase 4 HEAD
`692551774966bd9774900ecfef3d7fe03de61d7e`.

## 9. Phase 5 — unify Analysis presentation

**Execution status:** Implemented and locally verified as an audit candidate
through `69a3a4a80e3f107d91fc284990f86393ee06852d` (tree
`91a05822d9a281cd2abae62c47f208190267e250`). The production primitive and
both domain migrations preserve presentation-only ownership; focused/full
verification, browser comparison, responsive containment, and lazy-route
gates pass. No Phase 6 work is included.

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

Independent Phase 5 analysis-presentation / state-separation audit, then
Maintainer visual review.

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

Independent Phase 6 overview / cleanup / lazy-boundary audit, then Maintainer
visual review. Do not begin Phase 7 inside Phase 6.

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

Current exact next gate: **independent Phase 4 Linear Systems presentation /
Teaching v2 / trace-equivalence audit**, followed by **Maintainer visual
review**. Stop before Phase 5.
