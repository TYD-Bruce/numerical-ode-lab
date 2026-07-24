# Content-Agnostic Interactive Glossary Framework Handoff

## Status

Approved design and corrected repository-grounded implementation plan
documented; conservative re-audit verdict **SAFE TO IMPLEMENT**. Commit 1,
`Build glossary model and scope lifecycle`, is accepted after its conservative
audit returned **SAFE TO PROCEED**. Commit 2, `Fix readonly math accessible
ownership`, is implemented and locally verified; conservative accessibility
audit is pending.

The active milestone is **Content-Agnostic Interactive Glossary Framework**.
Production contains no Glossary terms, term annotations, Host behavior,
definition surface, Tutor handoff, queue, or Playground route. Commit 1 adds
content-agnostic model and lifecycle infrastructure only, with no visible
production behavior. Commit 2 corrects the existing shared readonly-math
accessibility path without adding a Glossary surface or content. No canonical
numerical notation is defined by this feature.

The repository-grounded planning iteration is complete. The exact plan is:

`docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md`

## Commit 1 implementation baseline

- Starting branch: `main`
- Starting HEAD: `c135c2fab73f2676dba9d6f2601288725f5e899b`
- Final implementation boundary: the local commit containing this handoff,
  named `Build glossary model and scope lifecycle`; its SHA is authoritative
  in Git history and cannot be embedded in the commit whose contents determine
  that SHA.
- Starting worktree: clean, including untracked files
- Nothing was fetched, pulled, pushed, deployed, or sent to a remote.

Created source:

- `src/glossary/glossaryRuntimeTypes.ts`
- `src/glossary/glossaryBuilders.ts`
- `src/glossary/coreGlossary.ts`
- `src/glossary/glossaryRegistry.ts`
- `src/glossary/glossaryScope.ts`
- `src/glossary/glossaryController.ts`

Created focused tests:

- `src/glossary/glossaryBuilders.test.ts`
- `src/glossary/glossaryRegistry.test.ts`
- `src/glossary/glossaryScope.test.ts`
- `src/glossary/glossaryController.test.ts`

Modified existing source and tests:

- `src/app/contracts.ts`
- `src/app/routeBundleOwnership.test.ts`
- `src/ode/initialValueProblemsRoute.test.ts`

Status documents updated in the same implementation commit:

- `PLAN.md`
- `docs/INDEX.md`
- `docs/glossary/HANDOFF.md`

## Commit 1 implemented behavior

- `GlossaryTermId` and `GlossaryScopeId` use exact, branded
  `^[a-z][a-z0-9_]*$` identifiers without trimming, case folding, inference,
  or repair.
- Typed builders defensively copy and freeze entries, aliases, formulas,
  module extensions, overrides, and nested records.
- Strict validation throws `GlossaryValidationError` with a precise diagnostic.
  Injected production fallback reports each equivalent diagnostic at most once
  per owning registry or binding, preserves readable authored display, and
  creates no interactive registration for invalid metadata.
- The frozen production core is empty. Registry construction detects duplicate
  IDs and exact string or `(latex, accessibleText)` alias conflicts. Resolution
  supports module fallback, contextual overrides, formula inheritance,
  replacement, and explicit `null` suppression without mutable results.
- Every explicit scope owns first-occurrence deduplication. The first valid
  occurrence creates a native `button[type="button"]`; later same-scope
  occurrences are plain readable text, while another scope may enhance the
  term once. Validation completes before atomic reservation.
- Triggers created before Host-port connection are valid. Pre-connection hover,
  focus, and activation are no-ops and are never queued or replayed; only later
  fresh interactions reach a connected port.
- One Host port may connect at a time. Strict conflicts fail clearly, production
  fallback refuses safely, and returned disconnect functions are idempotent and
  connection-identity checked. The Lab-owned binding remains final disposal
  owner.
- Dynamic context sources expose pure `getSnapshot()` and `subscribe(listener)`
  contracts. Commit 1 retains only the context-source references required by a
  scope and creates no surface subscription loop.
- Explicit rerender transactions invalidate old preview ownership, dispose the
  old scope, preserve the same scope ID, and transfer only a matching
  pinned/mobile identity to an explicitly registered current-generation
  replacement trigger. Mismatch, absence, abort, conflict, staleness, and
  binding disposal close or invalidate safely.
- Binding and scope disposal are explicit and idempotent. They disconnect the
  active port, invalidate transactions, dispose scopes and triggers, remove
  listeners and transient ARIA state, and release retained context references.
- `MountedLabRoute<TSession>` gains only the optional, type-only
  `getGlossaryBinding?()` edge. The current ODE route validly omits it; no fake
  binding is introduced.
- Source-graph tests prove `AppSessionStore`, `src/app/contracts.ts`, and the
  production entry eager graph do not acquire a Glossary runtime dependency,
  and the Glossary controller graph does not depend on `AppSessionStore`.

Glossary state remains outside `AppSessionStore`, Lab/Tutor sessions, history,
Resume metadata, meaningful-work state, and browser persistence.

## Commit 1 verification

- Tests were written first; the four new suites initially failed at module
  loading because the Glossary implementation files did not yet exist.
- Focused command: 6 test files passed, 67 tests passed.
- Full test suite: 64 test files passed, 927 tests passed.
- `npm.cmd run typecheck`: passed.
- `git diff --check`: passed after the final documentation update.
- No build, browser, preview, deployment, bundle-manifest, or production claim
  is made for Commit 1.

## Commit 1 explicit non-changes

No production terms, definitions, notation, formulas, aliases, annotations, or
placeholder content were added. Commit 1 does not add CSS, routes, bootstrap
integration, a Platform Glossary Host, a definition surface, hover timers,
placement, modal/focus/scroll behavior, Tutor behavior, readonly-math changes,
Playground fixtures, persistence, source/audit metadata, packages,
configuration, generated output, deployment behavior, or numerical changes.

## Commit 2 readonly-math prerequisite

- Starting branch: `main`
- Starting HEAD: `38447a462bcc2878f087ab0c4013287a800cd58f`
- Final HEAD: the local commit containing this handoff, named
  `Fix readonly math accessible ownership`; its SHA is authoritative in Git
  history and is reported after the commit because a commit cannot contain its
  own SHA.
- Starting worktree: clean, including untracked files
- Nothing was fetched, pulled, pushed, deployed, or sent to a remote.

`src/math/ui/readonlyMath.ts` now gives each expression exactly one accessible
owner throughout its lifecycle. The immediate readable fallback owns
`role="math"` and the approved accessible label. After deferred MathLive
enhancement succeeds, the enhanced child assumes that same role and label and
the parent owner attributes are removed. Rejection, synchronous loader failure,
render failure, or an unusable asynchronous enhancement leaves or restores the
single fallback owner. Exact render-state identity prevents stale completions
and stale handles from mutating newer output; the returned handle disposes
idempotently and removes only its own current expression.

Caller inventory and regression coverage are complete for every production
category:

- direct helper behavior in `src/math/ui/readonlyMath.test.ts`;
- ODE method and formula lifecycle in `src/ode/odeLifecycle.test.ts`;
- Convergence Study update and disposal in
  `src/convergenceStudyView.test.ts`;
- controlled, non-executable Tutor math in `src/math/ui/tutorMath.test.ts`.

`src/ode/odeApp.ts` contains the ODE call sites,
`src/convergenceStudyView.ts` contains the Convergence call sites, and
`src/math/ui/tutorMath.ts` contains the Tutor call site. The editable math
helper shares only the deferred `loadMathLiveModule()` boundary and is not
another readonly renderer caller. No additional production caller category was
found.

Verification:

- The first focused run, before changing the helper, failed seven regressions
  across the four caller categories and exposed duplicate parent/child
  accessible labels after enhancement.
- Focused tests: 4 files passed, 52 tests passed.
- Full tests: 64 files passed, 933 tests passed.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed; MathLive remained a separate deferred chunk.
- Local browser route: `/ode/initial-value-problems`, using Beginner Starter,
  Forward Euler, Exponential Decay, a normal simulation run, and a normal
  Convergence Study run.
- Browser DOM inspection found one enhanced child owner and no parent owner for
  both ODE result expressions and for all 11 readonly expressions present
  after expanding and running Convergence. Visible authored LaTeX remained
  unchanged, and the console had no warnings or errors.
- The immediate fallback is covered by deterministic helper tests but completed
  too quickly to observe manually with the real local MathLive backend.
- The local Tutor panel had no controlled-math transcript without sending a
  model request. No message was submitted and no external model call was made;
  Tutor browser evidence remains a manual follow-up, while the focused Tutor
  regression passed.

Commit 2 does not change mathematical expressions, numerical behavior,
MathLive loading order, ODE/Convergence/Tutor source, Glossary model or
lifecycle source, App or Tutor Hosts, routes, CSS, modal behavior, packages,
configuration, generated output, deployment behavior, production Glossary
content, or visible Glossary behavior.

## Later-phase carry-forward finding

`SUSPEND-ARIA-MODAL-ORDER`

Before Commit 3, Tutor suspension must deactivate the mobile Tutor dialog
under the external-modal guard criteria before Glossary attempts acquisition.

This finding is not implemented or resolved by Commit 1 or Commit 2.

## Planning baseline

- Workflow: maintainer-owned local `main`
- Starting HEAD for this planning iteration:
  `b48ed12618c5dcd3dc01936feea8e945ad3767a0`
- Starting worktree: clean, including untracked files
- The plan and status updates are recorded by the local documentation commit
  named `Plan glossary framework implementation`.
- Nothing is pushed by this planning iteration.

## Conservative plan audit correction

The conservative Cursor audit verdict was **SAFE AFTER DOCUMENTATION FIXES**:

- P0: 0
- P1: 3
- P2: 5
- P3: 3

All named documentation findings are resolved in the implementation plan. The
approved resolutions are:

1. The shared-surface commit creates one minimal, committed DEV-only harness at
   `/__dev/glossary-playground` with exact route/fixture modules and production
   exclusion evidence. The final Playground commit expands that same route;
   it does not create a temporary or second harness.
2. The proposed `PlatformModalEnvironment` includes a generic
   controlled-refusal policy when an active external `aria-modal="true"`
   dialog already exists. It neither closes New experiment nor queues
   Tutor/Glossary.
3. Shared readonly-math accessible ownership is corrected in a separate
   prerequisite commit with direct, ODE, Convergence, and Tutor regressions
   before Glossary surfaces begin.

The correction also removes the premature source/audit type, keeps Store tests
unchanged, defines unconnected Host-port behavior, assigns complete educational
label/input/term coverage, and labels the identified Tutor, New experiment,
and ODE helpers as private factory internals. Those planning corrections
enabled the now-complete local Commit 1 implementation.

## Repository-grounded planning completed

The implementation plan inspected and mapped:

- `src/main.ts` and `createPlatformBootstrap()`;
- `createPlatformModuleRegistry()` and the ODE dynamic route boundary;
- `MountedLabRoute<TSession>` and `createCompleteLabRoute()`;
- `mountOdeApp()`, the Initial Value Problems route adapter, rerender
  generations, and Lab-owned disposal;
- `LabTutorBinding`, `TutorSessionAccess`, `PlatformTutorHost`, and the lazy
  Tutor panel;
- Router navigation-start, route disposal, scroll capture, focus, stale-load,
  and Retry behavior;
- `AppSessionStore` pure-state rejection rules;
- App Shell regions, About page construction, route definitions, and the
  confirmed absence of development-route injection;
- current Tutor and New experiment modal/focus/inert/scroll ownership;
- semantic CSS tokens, the 760 px Tutor modal threshold, current modal layer,
  and responsive rules;
- readonly formula fallback and deferred MathLive loading;
- jsdom helpers, lifecycle tests, source-graph tests, and temporary Vite
  manifest tests.

The corrected plan resolves the repository constraints:

- development routes must be added through a new explicit injection seam
  because no current seam exists;
- the shared-surface browser audit needs a committed minimal DEV-only
  Playground shell rather than temporary uncommitted source;
- Glossary cannot use ordinary Tutor `close()` for presentation arbitration
  because panel disposal aborts pending work, so the surface commit must add a
  non-destructive Tutor presentation-suspension path and shared mobile
  inert/scroll coordination;
- Tutor or Glossary must refuse a platform modal while New experiment or
  another external active modal is present;
- readonly-math accessible ownership must be corrected and audited separately
  before Glossary surface integration.

No binding design conflict was found.

## Approved scope

Milestone 2A designs a content-agnostic framework for future ODE, Linear
Algebra, and PDE content:

- stable runtime contracts and typed registries;
- explicit Lab-owned scope controllers and first-occurrence deduplication;
- accessible native-button term triggers;
- one platform-owned responsive definition surface;
- desktop preview/pin and mobile bottom-sheet behavior;
- lifecycle, focus, positioning, and lazy-loading boundaries;
- dynamic scope snapshots and controlled trigger replacement;
- an injectable Tutor handoff contract;
- a development-only visual Playground.

The authoritative specification is
`docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md`.

## Ownership model

```text
Lab
  -> owns LabGlossaryBinding
  -> owns registry/module extension, scopes, triggers, and context sources
  -> owns final binding disposal

Platform Glossary Host
  -> consumes an optional binding
  -> owns the one visible surface, responsive presentation, focus, timers,
     positioning, and lazy surface loading
  -> does not create definitions or own final binding disposal

Generic Lab Adapter
  -> connects after Lab mount
  -> closes and disconnects the Host before Lab disposal
  -> remains unaware of terms, definitions, scopes, and notation
```

Glossary state remains outside `AppSessionStore`, Lab numerical sessions,
Tutor sessions, Resume metadata, history state, meaningful-work tracking, and
browser persistence.

## Included in Milestone 2A

- Content-agnostic branded IDs, entries, displays, formulas, and overrides
- Immutable core-plus-module registry architecture
- Development/test validation and production plain-text fail-closed behavior
- Explicit scopes and first-occurrence-only enhancement
- Accessible term triggers and form-label composition
- One active desktop or mobile surface
- Project-owned placement, scroll-follow, timers, and focus
- Dynamic snapshots and explicit rerender replacement transactions
- Readonly formula fallback and optional deferred enhancement
- Injectable Tutor handoff with a mock/test Playground implementation
- Development-only route, fixtures, Developer Tools entry, and shortcut
- Unit, integration, lifecycle, bundle, accessibility, and manual acceptance
  requirements

Milestone 2A uses content-neutral test/dev fixtures only.

## Explicitly deferred

- Canonical notation and production definitions
- ODE term annotations and production registry entries
- Runtime notation profiles or selector
- Definition sources and audit metadata
- Private-reference processing or notation research tooling
- Real Tutor Glossary API requests, transcript cards, and queue behavior
- Production Linear Algebra or PDE Glossary content
- Persistent Glossary state or Store integration
- Meaningful-work, Resume, `beforeunload`, or browser-persistence changes
- Any numerical, ODE, Tutor, Vite, Vercel, package, or dependency change

The first reviewed ODE term IDs belong to a later vertical slice and are not
defined by the framework design.

## Design decisions captured

- The complete-Lab contract may later expose optional
  `getGlossaryBinding?()`.
- Current ODE may omit the binding; no fake empty binding is introduced.
- One binding is stable for one complete route-mount lifetime.
- Host disconnect precedes Lab disposal; the Lab owns final binding disposal.
- The production Host is inert before a binding and remains lightweight.
- Author-created scopes, not DOM scanning, control enhancement.
- Only the first occurrence of a term in one explicit scope is interactive.
- Invalid production entries retain readable plain text and fail closed.
- Native text-like buttons remain visibly discoverable and keyboard operable.
- The platform allows one active Glossary surface.
- Desktop uses preview, pin, then explicit Tutor handoff.
- Mobile uses one modal bottom sheet with inert/scroll-lock coordination.
- Surface runtime, formula enhancement, Tutor, fixtures, and Playground retain
  independent lazy or development-only boundaries.
- The real Tutor queue is recorded for later work, not implemented in
  Milestone 2A.

The repository-grounded plan maps the design’s conceptual interfaces to exact
implementation files. Commit 1 now implements only its model, registry, scope,
binding, and replacement-lifecycle APIs. Commit 2 corrects shared readonly-math
ownership. Later-phase Host, surface, modal, Tutor, and Playground APIs remain
proposed.

## Planned implementation commits

1. `Build glossary model and scope lifecycle` — accepted after conservative
   audit
2. `Fix readonly math accessible ownership` — implemented locally;
   conservative accessibility audit pending
3. `Add shared glossary surfaces`
4. `Complete glossary framework playground`

Each commit requires focused tests and the ownership, privacy, lazy-loading,
and no-production-content gates in the design.

The repository-grounded plan supplies exact files, APIs, state machines,
tests-first order, browser checks, production-exclusion proof, risks, rollback
points, and stop/review gates for all four commits.

## Documentation files changed through plan correction

- `docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md`
- `docs/glossary/HANDOFF.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`

No source, test, CSS, configuration, package, lockfile, generated output, API,
Vite, Vercel, numerical, ODE, Tutor, deployment, or README change is part of
the plan or audit-correction iterations.

## Planning-iteration verification scope

At that historical checkpoint, the plan correction changed documentation only
and did not claim runtime/browser/bundle evidence. Its documentation
verification confirmed:

- the new plan and all relative links resolve;
- only the plan, `PLAN.md`, `docs/INDEX.md`, this handoff, and
  `docs/PROJECT_HANDOFF.md` changed;
- planned Glossary APIs were not described as implemented before Commit 1;
- no production term, notation, definition, fixture, API, or private-reference
  material was added;
- no source, test, CSS, configuration, package, lockfile, generated output,
  deployment file, remote, or external platform changed.

## Exact next action

Run a conservative accessibility audit of Commit 2, `Fix readonly math
accessible ownership`. Commit 3, `Add shared glossary surfaces`, is not
authorized and must not begin before the Commit 2 audit and maintainer
approval.
