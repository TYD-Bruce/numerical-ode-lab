# Content-Agnostic Interactive Glossary Framework Handoff

## Status

Approved design documented; implementation not started.

The active milestone is **Content-Agnostic Interactive Glossary Framework**.
Production contains no Glossary terms, term annotations, registry, binding,
Host behavior, definition surface, Tutor handoff, queue, or Playground route.
No canonical numerical notation is defined by this feature.

## Current branch and HEAD

- Workflow: maintainer-owned local `main`
- Starting HEAD for this design iteration:
  `fb3e78691de521155f4723ef2922000180c5ad90`
- The authoritative design and this handoff are recorded by the commit named
  `Document the interactive glossary framework`.
- Nothing is pushed by this iteration.

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

All interface names in the design are conceptual until repository-grounded
planning maps them to existing source files. No current runtime API implements
them.

## Planned implementation commits

1. `Build glossary model and scope lifecycle`
2. `Add shared glossary surfaces`
3. `Add the glossary framework playground`

Each commit requires focused tests and the ownership, privacy, lazy-loading,
and no-production-content gates in the design.

## Files changed this iteration

- `docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md`
- `docs/glossary/HANDOFF.md`
- `PLAN.md`
- `ARCHITECTURE.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`
- `README.md`

No production, test, package, lockfile, API, Vite, Vercel, numerical, ODE, or
Tutor file changes.

## Verification performed

- `npm.cmd run verify`: passed
  - 60 Vitest files passed
  - 868 tests passed
  - application TypeScript check passed
  - API TypeScript check passed
  - production Vite build passed
- `git diff --check`: passed before staging
- Documentation consistency search: inspected every match for the canonical
  milestone name, earlier working name, design status, implementation status,
  Glossary Host, and `getGlossaryBinding`
- Current-state documents use **Content-Agnostic Interactive Glossary
  Framework** and **Approved design; implementation not started**
- Earlier **Interactive Term Glossary** occurrences are confined to
  point-in-time historical records and are labeled in `docs/INDEX.md` as an
  earlier working name
- Relative documentation link check: all checked links resolve
- README documentation pointer, design link, and Glossary handoff link:
  confirmed
- Architecture check: conceptual Glossary APIs are explicitly designed but not
  implemented
- File-scope check: documentation only; no source, test, package, lockfile,
  API, Vite, Vercel, numerical, ODE, Tutor, or runtime file changed
- Privacy check: no private reference file, private text, screenshot, hash,
  secret, or local absolute path added
- Content check: no production Glossary term, formal definition, canonical
  notation, or implementation claim added
- Placeholder check: no unfinished markers appear in changed documentation

## Exact next action

After maintainer review of this design commit, create a repository-grounded
implementation plan. The plan must inspect current platform contracts,
lifecycles, lazy-loading tests, responsive Tutor coordination, and bundle
boundaries before proposing exact source edits.

No framework implementation begins from this documentation task.

## Questions or risks for implementation planning

No product decision is reopened. Repository-grounded planning must resolve:

- exact placement of content-agnostic contracts in the current app type graph;
- how the generic Lab adapter adds optional Glossary coordination without
  weakening Tutor disconnect ordering;
- the smallest inert Host coordinator that preserves the Home bundle boundary;
- development-route injection compatible with the current route definitions;
- ownership of shared inert/scroll-lock coordination between Tutor and
  Glossary;
- focused tests and manifest evidence for every lazy/development-only boundary.
