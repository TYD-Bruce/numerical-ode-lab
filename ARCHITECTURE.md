# Numerical T-Lab Architecture

## System overview

Numerical T-Lab is a Vite/TypeScript single-page application with a
project-owned History API router. The platform shell and static pages are
lightweight. The complete Initial Value Problems Lab loads through a dynamic
route boundary, and the complete Tutor runtime loads on first Tutor open.

The current application is implemented without React, a router package, or a
global state-management dependency.

Representative entry points:

- `src/main.ts`
- `src/app/platformBootstrap.ts`
- `src/app/routeDefinitions.ts`
- `src/app/moduleRegistry.ts`
- `src/ode/initialValueProblemsRoute.ts`

## Public routes

`src/app/routeDefinitions.ts` owns the route table:

| Path | Current implementation |
|---|---|
| `/` | Platform Home |
| `/ode` | Numerical ODE overview |
| `/ode/initial-value-problems` | Complete Initial Value Problems Lab |
| `/linear-algebra` | In-development roadmap |
| `/pde` | Planned roadmap |
| `/about` | Platform overview |
| other paths | In-shell Not Found |

Query strings and fragments do not create separate routes. The router
normalizes trailing slashes and retains the requested unknown path for Not
Found.

## Dependency direction

```text
platform bootstrap
  → router, shell, store, static pages, and lifecycle services
  → dynamically loaded complete Lab
  → ODE UI, numerical code, Chart.js, and Convergence
  → first-open Tutor runtime
  → deferred MathLive and Compute Engine boundaries

development build only
  → dynamically loaded Glossary development controls
  → DEV-only About composition and complete Glossary Playground route
```

The router and shell do not import ODE equations, methods, session types,
solvers, or Tutor grounding. `src/app/moduleRegistry.ts` is the dynamic
complete-Lab boundary.

## Platform ownership

### Platform bootstrap

`src/app/platformBootstrap.ts` creates one:

- `AppShell`;
- `AppSessionStore`;
- `PlatformTutorHost`;
- `ScrollRestoration`;
- module registry;
- router;
- minimal `beforeunload` handler.

It owns final platform disposal and leaves domain mounting to the module
registry and generic Lab adapter. In development builds only, it also loads one
cached Glossary development module after router startup. That module supplies
the optioned About-page Developer Tools composition and installs the single
Ctrl/Cmd+Shift+G listener; bootstrap owns its idempotent cleanup and prevents a
late module resolution from installing after disposal.

### Router

`src/app/router.ts` owns route matching, navigation, loading/failure/Retry,
document titles, stale-navigation generations, focus, and coordination with
scroll restoration.

### App Shell

`src/app/appShell.ts` owns the persistent header, navigation, route outlet,
mobile menu, and Tutor region. Semantic platform styles live under
`src/app/theme.css` and `src/app/platform.css`.

### App Session Store

`src/app/appSessionStore.ts` owns pure in-memory:

- Lab sessions by module;
- Tutor sessions by module;
- maintained meaningful/Resume metadata;
- route scroll metadata.

The store validates that values contain primitives, arrays, and plain records.
It rejects functions, cycles, DOM/EventTarget objects, abort objects, accessors,
symbols, and unsupported class instances. It deep-freezes accepted state.

### Platform Tutor Host

`src/app/platformTutorHost.ts` owns Tutor placement, open/close behavior,
desktop/mobile presentation, focus and inert handling, lazy panel loading,
request invalidation, and binding/session-access generations. It does not own
Tutor transcript state or ODE grounding.

### Scroll restoration

`src/app/scrollRestoration.ts` owns numeric document scroll, manual browser
restoration while active, per-Lab scroll metadata, and the namespaced
`history.state.numericalAnalysisLab` envelope.

### Generic Lab adapter

`src/app/labRouteAdapter.ts`:

- obtains a saved pure Lab session or authoritative starter;
- mounts a complete Lab;
- connects the Lab-owned Tutor binding to live store session access;
- saves the session and Resume summary;
- disconnects Tutor before Lab disposal;
- clears route-owned DOM.

The adapter treats Lab session and Tutor context as opaque domain data.

## ODE ownership

### Pure session

`src/ode/odeSession.ts` owns `OdeSessionState`, workflow state, persisted form
state, immutable solver-result snapshots, Convergence records, Beginner Starter
creation, meaningful-work selection, and Resume summary construction.

### Mountable application

`src/ode/odeApp.ts` owns the Method → Data → Output UI, forms, runs,
comparisons, charts, Convergence view, expression handles, New experiment
dialog, and current runtime cleanup.

### Route module

`src/ode/initialValueProblemsRoute.ts` adapts the pure session and mountable ODE
application to the generic complete-Lab contract.

### Numerical implementation

- `src/solvers.ts` owns integration algorithms.
- `src/grid.ts` owns fixed-grid validation.
- `src/nonlinearSolver.ts` owns scalar implicit solves.
- `src/convergenceStudy.ts` and related state/view modules own the convergence
  experiment.
- `docs/NUMERICAL_CONTRACTS.md` defines the behavior these files must preserve.

### Expression runtime

The safe expression direction is:

```text
MathLive draft
  → Compute Engine raw MathJSON adapter
  → project-owned validated MathAst
  → deterministic serialization and explicit evaluator
  → numeric closures passed to solvers
```

Relevant files are under `src/math/`. Solvers do not interpret LaTeX, MathJSON,
DOM nodes, or Tutor output.

Shared readonly display math in `src/math/ui/readonlyMath.ts` exposes one
accessible owner at a time. The immediate readable fallback owns the math role
and approved label; a successful deferred MathLive enhancement transfers that
ownership to the enhanced child. Failure keeps or restores the fallback, and
render identity plus idempotent disposal prevents stale asynchronous
enhancement from changing newer or disposed output. MathLive remains deferred.

### ODE Tutor binding

`src/ode/odeTutorBinding.ts` owns ODE suggestions and a binding that reads
current successful ODE/Convergence context. The binding contains no transcript,
Store, Host, or panel DOM.

## Pure state versus runtime handles

Pure state may contain discriminated records, immutable arrays, numerical
result snapshots, drafts, workflow state, Tutor transcript items, and numeric
metadata.

Runtime handles remain mounted and locally owned:

- DOM and custom elements;
- Chart instances;
- MathLive/editable-field handles;
- event listeners and media-query subscriptions;
- closures and evaluator functions;
- `AbortController`/`AbortSignal`;
- mounted view, route, Host, and binding handles.

Runtime handles are disposed and reconstructed. They are never put in
`AppSessionStore` or retained as hidden complete-Lab DOM.

## Session lifecycle

On complete-Lab mount:

1. The adapter reads a saved pure session or creates the Beginner Starter.
2. The Lab creates fresh DOM and runtime handles.
3. The adapter connects the Lab-owned Tutor binding to live module session
   access.
4. If the mounted Lab provides a Glossary binding, the adapter connects it to
   the Platform Glossary Host. The complete Initial Value Problems route
   provides one fresh route-instance binding; the static `/ode` overview does
   not.
5. The router waits for readiness and restores the current navigation's scroll.

On route leave:

1. The Glossary Host closes and disconnects before session capture.
2. Mobile Tutor presentation closes.
3. Router/scroll services capture the current route position.
4. The adapter captures the Lab session and Resume summary.
5. The Tutor Host disconnects and invalidates pending work.
6. The mounted Lab disposes domain bindings and runtime handles.
7. The route outlet is cleared.

Disposal is idempotent and stale generations cannot mutate a later mount.

## Tutor ownership

```text
Lab
  → LabTutorBinding and current domain grounding

AppSessionStore
  → ModuleTutorSession
  → live TutorSessionAccess

PlatformTutorHost
  → placement, responsive presentation, focus, lazy load, request lifecycle

src/tutor/platformTutorPanel.ts
  → transcript UI, safe rendering, send/clear/draft behavior
```

`src/tutor/tutorClient.ts` sends the controlled request to `/api/chat`. User
content remains text, assistant math uses controlled rendering, and stale or
aborted requests cannot append to another module.

## Lazy-loading boundaries

- Home/static routes load platform entry code and platform styles only.
- `src/app/moduleRegistry.ts` dynamically imports the Initial Value Problems
  route.
- `src/app/platformTutorHost.ts` dynamically imports
  `src/tutor/platformTutorPanel.ts` on first open.
- `src/app/platformGlossaryHost.ts` dynamically imports the complete definition
  surface runtime on the first valid Glossary request. A rejected attempt alone
  is retryable; pending and fulfilled attempts are shared.
- A cached DEV-only dynamic module supplies `/__dev/glossary-playground`, the
  development About composition, and the navigation shortcut only under
  `import.meta.env.DEV`.
- The complete Playground route, fixtures, controls, and route stylesheet are
  absent from the production route table, eager source graph, manifest, and
  emitted assets. The production About page remains unchanged.
- Editable math and MathLive/Compute Engine remain behind later ODE interaction
  boundaries.
- Static routes do not import ODE, Chart.js, Convergence implementation,
  complete Tutor runtime, ODE Tutor grounding, MathLive, or Compute Engine.

Source-graph and Vite manifest tests protect these boundaries.

## History and scroll behavior

Platform history metadata is merged under
`history.state.numericalAnalysisLab`, preserving unrelated fields. Normal
forward navigation starts at the top; Back/Forward restores the destination
entry; returning to a Lab may use its per-Lab scroll value. Focus with
`preventScroll` precedes generation-guarded restoration.

All sessions and scroll metadata are current-tab memory only.

## New experiment behavior

Confirmed New experiment recreates the authoritative Exponential Decay +
Forward Euler Beginner Starter. It may clear only the ODE Tutor conversation or
preserve it behind a typed divider. It resets visible, per-Lab, and current
history-entry scroll state and cannot restore the prior experiment position.

Other module sessions remain isolated. Cancel and Escape make no state change.

## Deployment

- `vite.config.ts` uses `base: "/"` and proxies local `/api` requests.
- `vercel.json` retains Vite build/output settings and supplies the SPA
  fallback to `/index.html`.
- Vercel function and filesystem precedence keep `/api/chat` and emitted
  `/assets/*` files ahead of the page fallback.
- Sessions are memory-only; there is no browser or account persistence.

Deployment contracts are tested in `src/app/viteBase.contract.test.ts` and
`src/app/vercelRouting.contract.test.ts`.

## Glossary framework status

The
[Content-Agnostic Interactive Glossary Framework Design](docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
is approved. Commits 1 through 4 now implement the complete content-agnostic
framework and its development verification environment:

- branded term and scope IDs, immutable display/formula records, strict
  builders, and production-safe readable fallback;
- an immutable empty production core and core-plus-module registry;
- scope-local first-occurrence deduplication and native term-trigger creation;
- Lab-owned binding, optional Host-port connection, dynamic context contracts,
  explicit rerender replacement transactions, and idempotent disposal;
- the optional type-only `MountedLabRoute.getGlossaryBinding?()` contract edge.
- a bootstrap-owned `PlatformGlossaryHost` and shared
  `PlatformModalEnvironment`, with one active platform surface, owner-checked
  modal leases, external-modal refusal, Tutor presentation suspension, stale
  generation/identity guards, and route-safe disposal;
- lazily loaded desktop preview, pinned card, and mobile bottom-sheet surfaces,
  including collision-aware placement, live curated-context refresh, safe
  readonly formula rendering, focus restoration/trapping, and explicit trigger
  replacement;
- the typed mockable Tutor handoff boundary, without a real queue or API
  integration;
- one complete DEV-only Playground at the original committed route, with ten
  stable content-neutral fixture IDs and sections for core interactions,
  scopes/duplicates, dynamic snapshots, trigger replacement, readonly formula
  display, educational composition, placement/scrolling, mobile/modal
  arbitration, structured mock Tutor handoff, contained strict diagnostics,
  event evidence, and reset/disposal;
- a development-only About-page entry and Ctrl/Cmd+Shift+G shortcut supplied by
  the same cached dynamic module, with editable-target suppression,
  single-listener ownership, retryable loading, and stale-resolution guards.

This transient runtime state and its DOM/listener/subscription/modal handles
remain outside `AppSessionStore`.

The static `/ode` overview exposes no Glossary binding. The complete
`/ode/initial-value-problems` route owns one optional route-instance Glossary
binding, composed from ten approved Wave 1 cards and ten explicit annotation
records. The Platform Host connects to that binding only while the complete
IVP route is mounted. The Glossary surface remains independently lazy. No
Glossary state enters `AppSessionStore` or an ODE session, and no
Glossary-to-Tutor handoff is implemented.

The generic production registry remains empty. The Playground and all ten
neutral fixtures, its development controls, route stylesheet, About entry,
shortcut, and unique markers remain excluded from production.

Current governance distinguishes this local architecture from the deployed
site. E1, E2, and E3 are accepted locally; all seven known F2 blockers are
corrected, but F2 remains unpassed pending a final independent F2 rerun. No
push, Preview deployment, or Production deployment was authorized or
performed, so the public deployed site remains on its previously deployed
commit.
`COPY-041`, `COPY-042`, `F2-GLOSSARY-VOICE-001`,
`BASELINE-EXT-FONT-001`, and `F2-EVIDENCE-001` remain nonblocking open
items.

## Architecture invariants

- No hidden complete-Lab DOM.
- No runtime handles in `AppSessionStore`.
- No static ODE import from Home or static pages.
- No complete Tutor implementation before first Tutor open.
- No arbitrary executable mathematics.
- No cross-module Tutor transcript or context leakage.
- No browser persistence without explicit approval.
- No production feature, verification, deployment, or release claim without
  corresponding evidence.

Update this document when implemented ownership or dependency direction
changes; planned designs alone do not change the implemented map.
