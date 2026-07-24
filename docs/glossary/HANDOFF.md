# Content-Agnostic Interactive Glossary Framework Handoff

## Status

Approved design and corrected repository-grounded implementation plan
documented; conservative re-audit pending; implementation not started.

The active milestone is **Content-Agnostic Interactive Glossary Framework**.
Production contains no Glossary terms, term annotations, registry, binding,
Host behavior, definition surface, Tutor handoff, queue, or Playground route.
No canonical numerical notation is defined by this feature.

The repository-grounded planning iteration is complete. The exact plan is:

`docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md`

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
and ODE helpers as private factory internals. Implementation remains not
started.

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
future source files. They remain proposed: no current runtime API implements
them.

## Planned implementation commits

1. `Build glossary model and scope lifecycle`
2. `Fix readonly math accessible ownership`
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

The plan correction changes documentation only. It does not run implementation
tests or claim runtime/browser/bundle evidence. Documentation verification
must confirm:

- the new plan and all relative links resolve;
- only the plan, `PLAN.md`, `docs/INDEX.md`, this handoff, and
  `docs/PROJECT_HANDOFF.md` changed;
- current architecture is not described as already implementing Glossary;
- no production term, notation, definition, fixture, API, or private-reference
  material was added;
- no source, test, CSS, configuration, package, lockfile, generated output,
  deployment file, remote, or external platform changed.

## Exact next action

Run a conservative Cursor re-audit of the corrected repository-grounded
implementation plan. Obtain maintainer approval after that re-audit before
Commit 1; Commit 1 is not yet authorized.

No framework implementation begins from this planning task.
