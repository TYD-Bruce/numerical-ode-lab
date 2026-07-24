# Content-Agnostic Interactive Glossary Framework Implementation Plan

**Status:** Corrected after conservative audit; re-audit pending;
implementation not started
**Date:** 2026-07-23
**Milestone:** Content-Agnostic Interactive Glossary Framework
**Authoritative design:** [Content-Agnostic Interactive Glossary Framework Design](../specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)

This plan maps the approved design to the repository at
`b48ed12618c5dcd3dc01936feea8e945ad3767a0`. It is executable without prior
chat history. Every interface and file under a **proposed** heading is planned,
not implemented.

## 1. Current repository baseline

### Git and product state

- Branch: `main`
- HEAD: `b48ed12618c5dcd3dc01936feea8e945ad3767a0`
- Worktree at planning start: clean, including untracked files
- Active milestone: **Content-Agnostic Interactive Glossary Framework**
- Approved design: committed
- Repository-grounded plan: this document
- Glossary implementation: not started
- Production Glossary entries, triggers, bindings, Hosts, surfaces, Tutor
  handoffs, and Playground routes: none

### Implemented Platform, Lab, and Tutor ownership

`src/main.ts` calls `createPlatformBootstrap({ target })`.
`createPlatformBootstrap()` in `src/app/platformBootstrap.ts` creates one
`AppShell`, `AppSessionStore`, `PlatformTutorHost`, `ScrollRestoration`,
platform module registry, and `PlatformRouter`. It also owns the minimal
`beforeunload` listener and final platform disposal.

`createPlatformModuleRegistry()` in `src/app/moduleRegistry.ts` dynamically
imports `src/ode/initialValueProblemsRoute.ts`, then delegates to
`createCompleteLabRoute()` in `src/app/labRouteAdapter.ts`. The generic adapter
loads or creates an opaque Lab session, mounts the Lab, connects its
`LabTutorBinding` to live `TutorSessionAccess`, saves pure session/Resume state
on disposal, disconnects Tutor, disposes the Lab, and clears route DOM.

`mountOdeApp()` in `src/ode/odeApp.ts` owns ODE DOM, Charts, expression handles,
Convergence handles, the ODE Tutor binding, rerender generations, and final
runtime disposal. `src/ode/initialValueProblemsRoute.ts` is a thin structural
adapter. The mounted ODE route currently exposes `getSession()`,
`getResumeSummary()`, `getTutorBinding()`, and `dispose()`.

`createPlatformTutorHost()` in `src/app/platformTutorHost.ts` owns Tutor
placement, desktop/mobile presentation, lazy first-open import, focus, body
scroll lock, outlet inert state, and request invalidation. The complete Tutor
panel and networking remain behind
`import("../tutor/platformTutorPanel")`. `AppSessionStore` owns only pure Tutor
session data.

### Implemented routing and lazy loading

- `src/app/routeDefinitions.ts` eagerly registers six public page/Lab paths and
  one Not Found definition.
- `createRouteLoader()` in `src/app/routeLoader.ts` caches one import attempt,
  shares prefetch/navigation work, and evicts only a rejected attempt for
  Retry.
- `createPlatformRouter()` in `src/app/router.ts` owns navigation generations,
  stale-load rejection, route disposal, focus, history, and scroll restoration.
- `src/app/moduleRegistry.ts` is the complete-Lab dynamic import boundary.
- `src/app/platformTutorHost.ts` is the Tutor first-open dynamic import
  boundary.
- `src/math/ui/readonlyMath.ts` keeps MathLive behind a cached dynamic import.
- Home and static pages have no eager source path to ODE, complete Tutor,
  MathLive, or Compute Engine.

### Current test architecture

The repository has 60 tracked Vitest files. Twenty-two declare the jsdom
environment locally. There is no installed real-browser test runner; geometry,
visual viewport, hover fidelity, forced colors, zoom, and real custom-element
behavior therefore require later manual browser evidence.

Current reusable test patterns are local rather than centralized:

- `deferred<T>()` in `src/app/routeLoader.test.ts` and
  `src/app/router.test.ts` for stale asynchronous work;
- `moduleWithText()` and `testRoutes()` in `src/app/router.test.ts`;
- `testLabModule()` and `tutorHostSpy()` in
  `src/app/platformBootstrap.test.ts`;
- a Host double in `src/app/labRouteAdapter.test.ts`;
- injected `loadPanel` and `isMobile` functions in
  `src/app/platformTutorHost.test.ts`;
- connected DOM targets and injected math backends in
  `src/math/ui/readonlyMath.test.ts`;
- temporary external Vite output plus manifest inspection in
  `src/app/viteBase.contract.test.ts`;
- a static eager-import traversal in
  `src/app/routeBundleOwnership.test.ts`.

### Current mobile modal, focus, inert, and scroll ownership

There is no shared modal utility.

- `PlatformTutorHost` records document scroll, writes
  `document.body.style.overflow = "hidden"`, makes the Lab outlet inert, traps
  Tab inside the mobile Tutor, restores scroll, and uses a 760 px media query.
- `mountOdeApp()` independently owns the New experiment dialog. It appends a
  body-level backdrop, snapshots/inerts existing body children, traps focus,
  handles Escape, and restores focus.
- The mobile menu is a non-modal App Shell surface with its own Escape and
  focus behavior.
- `src/app/platform.css` and `src/style.css` both currently use modal
  `z-index: 1000`.

Glossary must not add a third independent body-scroll/inert owner. The shared
surface commit will extract the Tutor-compatible mobile environment into one
platform utility shared by Tutor and Glossary. The Lab-owned New experiment
dialog remains unchanged unless implementation evidence demonstrates that a
minimal semantic marker is required and separately justifies it. A generic
modal-blocking guard refuses a Tutor or Glossary platform modal while an
external active modal dialog, including New experiment, is already present.
When Tutor or Glossary already owns the platform modal environment, its
existing inert ownership prevents the New experiment trigger from being
activated.

### Current development-route and bundle-contract capability

No development-route injection seam, development shortcut, `src/dev` tree, or
Developer Tools area exists. `createRouteDefinitions()` has only
`initialValueProblemsLoader` and `homeSessionSource` options. The shared
surface commit must add the minimum explicit injection seam and committed
development-only Playground shell needed for reproducible browser evidence;
the final Playground commit expands that same route. Neither commit may claim
to reuse a nonexistent utility or create a second temporary harness route.

Bundle protection already exists:

- `src/app/routeBundleOwnership.test.ts` walks local static imports from
  `src/main.ts`;
- `src/app/tutorLazyBoundary.test.ts` checks the Tutor dynamic boundary;
- `src/app/viteBase.contract.test.ts` builds into a temporary external
  directory and reads the Vite manifest and emitted assets;
- `src/app/themeTokens.test.ts` checks semantic platform CSS and heavy import
  exclusions.

### Confirmed missing Glossary runtime

No `src/glossary`, `src/dev/glossary`, `LabGlossaryBinding`,
`PlatformGlossaryHost`, registry, scope controller, term trigger, definition
surface, Glossary Tutor contract, fixture, or Playground source exists.
`ARCHITECTURE.md` correctly labels the names in the approved design as planned
only.

## 2. Repository-grounded source map

### Existing extension seams

| Area | Existing file and symbol | Current responsibility and correct seam | Constraints and current protection |
|---|---|---|---|
| Entry | `src/main.ts` — `createPlatformBootstrap({ target })` call | Thin public entry; must remain unchanged except indirectly through bootstrap | `src/mainConvergenceIntegration.test.ts` and `src/app/routeBundleOwnership.test.ts` keep it platform-only |
| Platform composition | `src/app/platformBootstrap.ts` — `createPlatformBootstrap()` | Creates singleton Shell, Store, Tutor Host, Router, registry, and lifecycle services; correct owner for one Glossary Host and cross-Host coordination | Imported by `src/main.ts`, bootstrap tests, unload tests, and New experiment integration; eager graph must stay light |
| Complete-Lab registration | `src/app/moduleRegistry.ts` — `createPlatformModuleRegistry()` | Owns the ODE dynamic import and constructs the generic route adapter; correct place to pass a platform Glossary Host without importing Glossary content | `src/app/routeBundleOwnership.test.ts`, `src/app/platformBootstrap.test.ts` |
| Generic Lab adapter | `src/app/labRouteAdapter.ts` — `createCompleteLabRoute()` | Coordinates Store, optional Lab bindings, scroll, and disposal while treating domain data as opaque; correct place to connect an optional Glossary binding | `src/app/labRouteAdapter.test.ts`, `src/app/platformBootstrap.test.ts`; must preserve session snapshot and Tutor order |
| Lab contract | `src/app/contracts.ts` — `MountedLabRoute<TSession>`, `LabRouteModule<TSession>` | Shared structural Lab contract; correct location for a type-only optional `getGlossaryBinding?()` edge | Widely imported by app, pages, Tutor, Store, ODE, and tests; no runtime Glossary import is allowed |
| ODE route adapter | `src/ode/initialValueProblemsRoute.ts` — `mount()` and `MountedInitialValueProblemsRoute` | Adapts `MountedOdeApp` to the generic Lab shape | `src/ode/initialValueProblemsRoute.test.ts`; Milestone 2A leaves it without a Glossary binding |
| ODE runtime ownership | `src/ode/odeApp.ts` — `mountOdeApp()` and its private factory-internal `render()` plus the returned `dispose()` | Owns Lab rerender generations and runtime cleanup; the containing factory, not its private `render()`, is the interaction seam | `src/ode/odeLifecycle.test.ts`, `src/ode/newExperiment.test.ts`; no ODE annotation or Glossary binding change in this milestone |
| Tutor binding | `src/app/contracts.ts` — `LabTutorBinding<TContext>` and `TutorSessionAccess`; `src/ode/odeTutorBinding.ts` — `createOdeTutorBinding()` | Lab owns fresh domain context; Store owns live session access | `src/ode/odeTutorBinding.test.ts`, `src/ode/odeLifecycle.test.ts`, `src/app/platformTutorHost.test.ts` |
| Tutor presentation | `src/app/platformTutorHost.ts` — `createPlatformTutorHost()` | Owns Tutor presentation and lazy panel lifecycle; correct coordination seam for non-destructive temporary hiding | `src/app/platformTutorHost.test.ts`, `src/app/tutorLazyBoundary.test.ts`; ordinary `close()` disposes the panel and aborts pending work, so Glossary must not call it |
| Tutor panel | `src/tutor/platformTutorPanel.ts` — `mountPlatformTutorPanel()` | Owns mounted transcript/composer and pending `AbortController`; `dispose()` aborts requests | `src/aiTutorPanel.test.ts`; Commit 3 must keep the panel mounted while suspended and add a presentation-visibility guard so request completion cannot focus hidden Tutor DOM |
| Store | `src/app/appSessionStore.ts` — `createAppSessionStore()`, `assertPureValue()` | Pure Lab/Tutor/route data only | `src/app/appSessionStore.test.ts` rejects DOM, functions, abort objects, errors, cycles, and classes; Glossary does not modify this file |
| Shell and layers | `src/app/appShell.ts` — `createAppShell()` and `AppShell` | Persistent header, menu, outlet, Tutor region; correct owner for an empty Glossary surface region and modal background element references | `src/app/appShell.test.ts`, `src/app/navigationAccessibility.test.ts`, `src/app/platform.css` |
| Router | `src/app/router.ts` — `createPlatformRouter()` and `onNavigationStart` | Calls the navigation-start hook before scroll capture and route disposal; correct place to close/disconnect the global Glossary Host before capture | `src/app/router.test.ts`, `src/app/scrollRestoration.test.ts` |
| Route definitions | `src/app/routeDefinitions.ts` — `createRouteDefinitions()` | Owns route table; must accept explicit development definitions while defaults remain production-safe | `src/app/router.test.ts`, `src/app/navigationAccessibility.test.ts`, bootstrap route matrix |
| About entry | `src/pages/aboutPage.ts` — current `aboutPage` constant | Current About is a static production page; add an optioned factory while retaining the production constant | `src/pages/pages.test.ts`; no static import from About into `src/dev` |
| Static page helper | `src/pages/pageContracts.ts` — `mountStaticPage()`, `createRouteLink()` | Correct DOM-safe helper for the Developer Tools section | `src/pages/pages.test.ts` |
| Mobile Tutor | `src/app/platformTutorHost.ts` — `createPlatformTutorHost()` contains private factory-internal `enableMobileEnvironment()` and `restoreMobileEnvironment()` closures | Existing scroll/inert implementation to extract into a shared utility; the factory is the real extraction seam and the closures are not exported APIs | Host mobile test verifies inert, body overflow, and scroll restoration |
| New experiment modal | `src/ode/odeApp.ts` — `mountOdeApp()` contains private factory-internal `openResetDialog()` and `closeResetDialog()` functions | Lab-owned modal and focus trap; the containing factory is the interaction seam. The dialog remains separate and unchanged unless a minimal semantic marker is demonstrably required | `src/ode/newExperiment.test.ts`, `src/ode/odeLifecycle.test.ts` |
| Safe formula display | `src/math/ui/readonlyMath.ts` — `renderReadonlyMath()` and `loadMathLiveModule()` | Immediate accessible text fallback and deferred MathLive enhancement shared by ODE, Convergence, and Tutor | `src/math/ui/readonlyMath.test.ts`, `src/ode/odeLifecycle.test.ts`, `src/convergenceStudyView.test.ts`, and `src/math/ui/tutorMath.test.ts`; the dedicated prerequisite commit corrects accessible ownership before Glossary surfaces |
| Tokens and layering | `src/app/theme.css`, `src/app/platform.css`, `src/tutor/tutor.css`, `src/style.css` | Semantic tokens, platform layout, Tutor responsive rules, ODE modal layer | `src/app/themeTokens.test.ts`; current modal value is 1000 and no forced-colors/reduced-motion Glossary rule exists |
| Build mode | `vite.config.ts`, Vite-provided `import.meta.env.DEV` | Vite has no custom development-route configuration; compile-time `DEV` is the production-exclusion switch | `src/app/viteBase.contract.test.ts` performs a real production build |
| Manifest contract | `src/app/viteBase.contract.test.ts` | Primary emitted-graph evidence using a temporary outDir | Extend it for Glossary surface and dev exclusions |
| Static graph contract | `src/app/routeBundleOwnership.test.ts` | Supplementary source-graph protection | Extend forbidden eager imports to Glossary registry, surface, fixtures, and Playground |

### Naming discrepancies resolved by repository evidence

- The generic adapter is `src/app/labRouteAdapter.ts`, not part of the router or
  module route file.
- The Store is exactly `src/app/appSessionStore.ts`.
- The complete Lab handle is `MountedLabRoute<TSession>` in
  `src/app/contracts.ts`.
- There is no shared modal/sheet helper and no development route registry.
- The current mobile Tutor threshold is 760 px in both Host logic and Tutor
  CSS. Glossary will reuse that modal threshold; the App Shell’s separate
  48 rem layout breakpoint remains a layout concern.
- Vite environment branching exists through standard `import.meta.env.DEV`,
  but not yet in route creation.

## 3. Proposed ownership model

### Dependency direction

```text
src/main.ts
  -> createPlatformBootstrap()
     -> lightweight PlatformGlossaryHost
     -> shared PlatformModalEnvironment
     -> PlatformTutorHost presentation coordination
     -> createPlatformModuleRegistry()
        -> createCompleteLabRoute()
           -> optional LabGlossaryBinding (type-only platform contract)
              -> module registry + Lab-owned scopes/triggers/context sources
                 -> dynamic Glossary surface runtime on first open
                    -> optional deferred readonly math enhancement

development only
  createRouteDefinitions(developmentRoutes)
    -> dynamic Glossary Playground route
       -> isolated content-neutral fixtures + mock Tutor handoff
```

### Object ownership and lifecycle

| Object | Created by | Owned/finally disposed by | Connection and disconnection | Permitted data and runtime handles |
|---|---|---|---|---|
| Registry/builders | Lab module or dev Playground setup | Binding owner | No platform connection | Immutable strings, branded IDs, readonly entry records; no DOM, Store, or source resolver |
| `LabGlossaryBinding` | Future Lab mount or dev Playground route | The creating Lab/route | Host calls `binding.connect(port)` and retains only the returned disconnect function; Host never calls binding `dispose()` | Registry reference, scope set, Host port, generations, subscriptions; never Store state |
| Scope controller | Binding `createScope()` or rerender transaction | Binding, with idempotent scope disposal | Uses the binding’s current Host port; scope disposal closes or transfers its active request | Dedup set, triggers, event listeners, context subscription handle, transaction identity |
| Platform Glossary Host | `createPlatformBootstrap()` | Platform bootstrap | Generic adapter connects optional Lab binding and disconnects before Lab disposal | One transient request/state, trigger reference, timers, resize/scroll listeners, lazy-load generation, mounted surface |
| Lazy surface runtime | Host’s cached surface loader on first actual opening | Host | Mounts only for the current connection/request; disposed on close/disconnect | Surface DOM, focus trap, formula target, placement measurements |
| `PlatformModalEnvironment` | Platform bootstrap | Platform bootstrap | Tutor or Glossary acquires one lease; release is idempotent and owner-checked | Prior inert flags, prior body overflow, document scroll, active owner identity |
| Tutor presentation suspension | `PlatformTutorHost` | `PlatformTutorHost` | Glossary asks Tutor Host to suspend presentation without disposing its panel; manual Tutor open asks Glossary to close | Existing mounted panel and request remain Host-owned; transcript/draft stay Store-owned |
| Development Playground | Dynamic dev route module | Mounted dev route | Connects its binding and mock handoff; disconnects Host before disposing binding | Test-only fixture registry, controls, mock request log; no Store, API, Resume, or meaningful-work state |
| Tutor handoff placeholder | Injected into Host connection by Playground | Injector | Called only by complete surface; no default production implementation in Milestone 2A | Structured stable IDs and curated string snapshot only |

The following must never enter `AppSessionStore`, Lab numerical sessions, Tutor
sessions, Resume metadata, history state, or browser persistence:

- `LabGlossaryBinding`;
- registry/controller instances;
- scope controllers and rerender transactions;
- trigger or surface DOM;
- Host ports and Host instances;
- timers, listeners, subscriptions, and modal leases;
- active term, preview, pin, sheet, or loading state;
- Tutor handoff functions or pending promises.

### Route-leave order

Both the Router navigation-start hook and direct adapter disposal are safe and
idempotent. The required effective order is:

1. `glossaryHost.close({ restoreFocus: false })`;
2. `glossaryHost.disconnect()`;
3. `tutorHost.closeMobileForNavigation()`;
4. capture route and Lab scroll;
5. capture pure Lab session and Resume summary;
6. `tutorHost.disconnect()`;
7. `mountedLab.dispose()`; the Lab disposes its Glossary binding;
8. clear route DOM.

The Router hook performs steps 1–3 before its scroll capture. The adapter
repeats steps 1–3 defensively when disposed outside normal Router navigation,
then performs steps 5–8.

## 4. Type and API design

All signatures in this section are proposed.

### Runtime IDs, display records, and entries

Future file: `src/glossary/glossaryRuntimeTypes.ts`
Kind: pure/runtime records with erased TypeScript brands

```ts
declare const glossaryTermIdBrand: unique symbol;
declare const glossaryScopeIdBrand: unique symbol;

export type GlossaryTermId =
  string & { readonly [glossaryTermIdBrand]: true };
export type GlossaryScopeId =
  string & { readonly [glossaryScopeIdBrand]: true };

export interface GlossaryFormula {
  readonly latex: string;
  readonly accessibleText: string;
  readonly display?: "inline" | "block";
}

export type GlossaryTermDisplay =
  | string
  | {
      readonly kind: "math";
      readonly latex: string;
      readonly accessibleText: string;
    };

export interface GlossaryEntry {
  readonly id: GlossaryTermId;
  readonly label: string;
  readonly aliases: readonly GlossaryTermDisplay[];
  readonly definition: string;
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormula;
  readonly tutorTopic: string;
}

export interface GlossaryModuleOverride {
  readonly termId: GlossaryTermId;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula | null;
  readonly tutorTopic?: string;
}

export interface GlossaryModuleExtension {
  readonly moduleId: LabModuleId;
  readonly overrides: readonly GlossaryModuleOverride[];
}
```

All source IDs, audit metadata, source-health behavior, and related types are
completely deferred to a later approved source/audit design. Milestone 2A
creates no placeholder source identifier, entry field, resolver, URL, private
path, health record, or source/audit runtime boundary.

### Builders, diagnostics, and registry

Future files:

- `src/glossary/glossaryBuilders.ts` — pure builders/validation
- `src/glossary/coreGlossary.ts` — empty production core
- `src/glossary/glossaryRegistry.ts` — runtime lookup/resolution

```ts
export interface GlossaryDiagnostic {
  readonly code:
    | "invalid_term_id"
    | "invalid_scope_id"
    | "duplicate_term_id"
    | "conflicting_alias"
    | "unknown_term"
    | "unknown_override_target"
    | "invalid_display"
    | "invalid_formula";
  readonly termId?: string;
  readonly scopeId?: string;
  readonly display?: string;
}

export interface GlossaryValidationPolicy {
  readonly mode: "strict" | "production-fallback";
  report(diagnostic: GlossaryDiagnostic): void;
}

export function defineGlossaryTermId(value: string): GlossaryTermId;
export function defineGlossaryScopeId(value: string): GlossaryScopeId;
export function defineGlossaryEntry(input: GlossaryEntryInput): GlossaryEntry;
export function defineGlossaryModuleExtension(
  input: GlossaryModuleExtensionInput
): GlossaryModuleExtension;

export interface GlossaryRegistry {
  resolve(
    moduleId: LabModuleId,
    termId: GlossaryTermId,
    display: GlossaryTermDisplay
  ): GlossaryResolution;
}
```

Term and scope IDs accept only `^[a-z][a-z0-9_]*$`; builders do not trim,
case-fold, or infer IDs. String aliases compare by exact authored value.
Mathematical aliases compare by the tuple `(latex, accessibleText)` rather
than visible DOM text. These rules admit the approved future snake-case IDs
without creating automatic text normalization.

Strict mode throws a typed validation error containing one diagnostic.
Production fallback returns an invalid resolution, reports each diagnostic key
at most once per registry/binding lifetime, and lets the scope return the
original readable display as plain text. The default policy is strict under
Vite development/test and production-fallback under a production build; tests
inject policy/reporting explicitly. `coreGlossary.ts` exports an empty frozen
entry list in Milestone 2A.
Module extensions may override existing core entries only; an unknown target
is a loud strict-mode error and a production fallback diagnostic. Resolved
entries are newly frozen shallow records referencing already frozen nested
records.

### Dynamic context snapshot and subscription

Future file: `src/glossary/glossaryRuntimeTypes.ts`
Kind: pure snapshot plus runtime subscription interface

```ts
export interface GlossaryTermContextSnapshot {
  readonly termId: GlossaryTermId;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula | null;
  readonly curatedTutorContext?: string;
}

export interface GlossaryScopeSnapshot {
  readonly revision: number;
  readonly terms: readonly GlossaryTermContextSnapshot[];
}

export interface GlossaryScopeContextSource {
  getSnapshot(): GlossaryScopeSnapshot;
  subscribe(listener: () => void): () => void;
}
```

Snapshots contain curated display/Tutor strings only. They never contain
`OdeSessionState`, solver points, matrix/PDE records, evaluators, DOM, or
callbacks. Preview reads no context subscription. Pinned and mobile surfaces
read a snapshot and subscribe; Ask reads a fresh snapshot.

Resolution order is deterministic: core entry, then the current module
extension, then the current term’s dynamic scope snapshot for complete
surfaces only. `undefined` inherits the prior value; formula `null` suppresses
an inherited formula; a formula record replaces it. Preview always uses the
core one-sentence definition and never dynamic/module explanatory copy.

### Scope controller, binding, and replacement transaction

Future files:

- `src/glossary/glossaryScope.ts` — scope/trigger implementation
- `src/glossary/glossaryController.ts` — stable binding and transaction owner

```ts
export interface GlossaryScopeController {
  readonly id: GlossaryScopeId;
  createTerm(options: {
    readonly termId: GlossaryTermId;
    readonly display: GlossaryTermDisplay;
  }): GlossaryTermRenderResult;
  dispose(): void;
}

export type GlossaryTermRenderResult =
  | {
      readonly kind: "interactive";
      readonly node: HTMLButtonElement;
      dispose(): void;
    }
  | {
      readonly kind: "plain-text";
      readonly node: Text | HTMLElement;
    };

export interface GlossaryScopeRerenderTransaction {
  readonly scope: GlossaryScopeController;
  commit(): void;
  abort(): void;
}

export interface LabGlossaryBinding {
  readonly moduleId: LabModuleId;
  connect(port: GlossaryHostPort): () => void;
  createScope(options: {
    readonly id: GlossaryScopeId;
    readonly context?: GlossaryScopeContextSource;
  }): GlossaryScopeController;
  beginScopeRerender(options: {
    readonly id: GlossaryScopeId;
    readonly context?: GlossaryScopeContextSource;
  }): GlossaryScopeRerenderTransaction;
  dispose(): void;
}
```

`beginScopeRerender()` closes preview immediately, opens one transfer window,
disposes the old scope, and returns a replacement scope with the same ID.
`commit()` transfers only a pinned/mobile surface whose binding, module, scope,
and term identities match an explicitly registered replacement trigger.
Otherwise it closes. `abort()` always closes and disposes the replacement.
Starting a second transaction for the same scope is a strict-mode failure and
a production-safe close.

`src/app/contracts.ts` adds only a type import and:

```ts
interface MountedLabRoute<TSession> extends MountedRoute {
  // Existing methods unchanged.
  getGlossaryBinding?(): LabGlossaryBinding;
}
```

Current ODE omits the optional method.

A valid, undisposed binding and scope may create triggers before a Host port is
connected. Hover, focus, or activation during that unconnected interval is a
no-op: it does not throw, queue a request, mutate Store or session state, or
create work outside the scope's ordinary interaction handling. A pre-connect
interaction is never replayed. Once one port connects, only future fresh
interactions are delivered. Disposed scopes/bindings and a second simultaneous
connection retain strict development/test failure and controlled
production-safe no-op/close policies.

### Host connection, request, and transient state

Future files:

- `src/glossary/glossaryRuntimeTypes.ts` — request/port types
- `src/app/platformGlossaryHost.ts` — lightweight coordinator

```ts
export type GlossaryOpenIntent =
  | { readonly kind: "hover" }
  | { readonly kind: "keyboard-focus" }
  | { readonly kind: "activate"; readonly pointer: "mouse" | "touch" | "keyboard" };

export interface GlossarySurfaceRequest {
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly termId: GlossaryTermId;
  readonly trigger: HTMLButtonElement;
  readonly display: GlossaryTermDisplay;
  readonly entry: ResolvedGlossaryEntry;
  readonly context?: GlossaryScopeContextSource;
  readonly intent: GlossaryOpenIntent;
  readonly scopeGeneration: number;
}

export interface GlossaryHostPort {
  requestOpen(request: GlossarySurfaceRequest): void;
  requestClose(request: GlossarySurfaceRequest): void;
  scopeDisposed(identity: GlossaryScopeIdentity): void;
  replacementCommitted(result: GlossaryReplacementResult): void;
}

export interface PlatformGlossaryHost {
  connect(
    binding: LabGlossaryBinding,
    options?: { readonly tutorHandoff?: GlossaryTutorHandoff }
  ): void;
  disconnect(): void;
  close(options?: { readonly restoreFocus?: boolean }): void;
  dispose(): void;
}
```

The Host keeps a discriminated internal state:

```ts
type GlossaryHostState =
  | { readonly kind: "closed" }
  | { readonly kind: "loading"; readonly request: GlossarySurfaceRequest }
  | {
      readonly kind: "open";
      readonly mode: "preview" | "pinned" | "mobile-sheet";
      readonly request: GlossarySurfaceRequest;
      readonly mounted: MountedGlossarySurface;
    }
  | { readonly kind: "closing"; readonly request: GlossarySurfaceRequest };
```

The Host compares connection generation, request identity, scope generation,
and current trigger connectivity after every timer, animation-frame, lazy
import, Retry, subscription, and handoff boundary.

### Shared mobile environment and Tutor presentation access

Future files:

- `src/app/platformModalEnvironment.ts` — platform runtime utility
- `src/app/appShell.ts` — existing Shell extended with an empty Glossary region
  and modal background references
- `src/app/platformTutorHost.ts` — existing Host extended with suspension
- `src/tutor/platformTutorPanel.ts` — existing panel extended with a
  presentation-visibility predicate

```ts
export interface PlatformModalLease {
  readonly owner: "tutor" | "glossary";
  release(): void;
}

export type PlatformModalAcquireResult =
  | {
      readonly status: "acquired";
      readonly lease: PlatformModalLease;
    }
  | {
      readonly status: "blocked";
      readonly reason: "external-modal-active";
    };

export interface PlatformModalEnvironment {
  acquire(options: {
    readonly owner: "tutor" | "glossary";
    readonly hostRegion: HTMLElement;
    readonly background: readonly HTMLElement[];
  }): PlatformModalAcquireResult;
  dispose(): void;
}

export interface AppShell {
  // Existing fields and methods unchanged.
  readonly glossaryRegion: HTMLElement;
  modalBackgroundFor(owner: "tutor" | "glossary"): readonly HTMLElement[];
}

export interface PlatformTutorHost {
  // Existing methods unchanged.
  suspendPresentationForGlossary(): void;
  isPresentationVisible(): boolean;
}
```

The modal environment has one active owner and owner-checked leases. It
snapshots each background element's prior inert state, body overflow, and
document scroll. A stale lease cannot unlock a newer owner.
`modalBackgroundFor()` returns the header, mobile menu, route outlet, and the
inactive Host region while excluding the active Host region; it never inerts an
ancestor of the active dialog.

The two-way modal-conflict policy is explicit:

> A Tutor or Glossary platform modal must refuse to acquire/open while another
> active modal dialog outside the requesting Host is already present.

Immediately before acquiring, the generic modal environment inspects connected,
active `[aria-modal="true"]` dialogs outside `hostRegion`. For this guard,
active means connected, without `hidden`, and not `aria-hidden="true"`; no
product-specific class or accessible name participates. If one exists,
`acquire()` returns the controlled `external-modal-active` refusal without
changing focus, scroll, inert state, Host state, or Store/session state. It does
not use an ODE product-name gate, automatically close New experiment, or queue
Tutor/Glossary. The requesting Host also re-checks after lazy import and calls
the guarded acquire immediately before mounting, so a dialog that appears
during loading blocks stale completion. Programmatic and stale callbacks use
the same guard. When a Tutor or Glossary platform modal is already active, its
existing inert ownership keeps the New experiment trigger inactive. After a
blocking dialog closes, only a later fresh interaction may try again.

Tutor Host mounts the lazy panel into a nested presentation container. During
Glossary suspension it hides/inerts that container, releases a Tutor modal
lease, and renders the manual launcher without disposing the panel. The panel’s
existing `isCurrent()` remains true so a pending response may complete and
update the live Store. A new `isPresentationVisible()` option gates only focus
and visibility-dependent DOM effects; request completion never focuses a
hidden input. Manual reopen unhides the existing panel and deliberately calls
its `focus()`.

### Tutor handoff placeholder

Future file: `src/glossary/glossaryTutorContract.ts`
Kind: pure request and runtime injection interface

```ts
export interface GlossaryTutorRequest {
  readonly kind: "glossary_term";
  readonly termId: GlossaryTermId;
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly curatedScopeContext?: string;
}

export interface GlossaryTutorHandoff {
  askTerm(options: {
    readonly request: GlossaryTutorRequest;
    readonly trigger: HTMLElement;
    readonly preserveDraft: true;
  }): Promise<
    | { readonly status: "started"; readonly transcriptItemId?: string }
    | { readonly status: "queued" }
    | { readonly status: "replacement-required" }
    | { readonly status: "cancelled" }
  >;
}
```

Milestone 2A supplies this interface and a Playground mock only. No production
adapter, Store mutation, transcript card, queue, Keep/Replace behavior, or API
request is added.

## 5. State machines

### Term trigger

| State | Entry | Allowed transition | Exit behavior |
|---|---|---|---|
| Unregistered | Before `createTerm()` | Valid lookup → registered; invalid production lookup → plain text | No listener or ARIA surface state |
| Registered | First valid term in scope | Hover/focus/activate → active preview or complete surface | Native button remains in authored position |
| Duplicate-suppressed | Same term already enhanced in scope | Disposal only | Plain authored text, no listener, underline, hidden annotation, or ARIA |
| Active preview | Fine-pointer hover delay or keyboard focus | Activate → pinned/mobile; leave/blur/scroll/new term → registered | Cancel all open/close timers |
| Pinned | Desktop activation | Replacement transaction → replaced; close events → registered | May transfer focus into complete card |
| Replaced after rerender | Matching explicit transaction commit | Remains pinned/mobile on replacement trigger | Old trigger and listeners are disposed; ARIA moves to replacement |
| Disposed | Trigger, scope, binding, or route disposal | Terminal | Close current request, remove listeners/ARIA, never restore focus to detached trigger |

`createTerm()` records the term ID before returning. Strict validation failure
throws before mutation. Production fallback records the diagnostic once and
returns plain authored display. A disposed scope cannot create terms.

### Platform surface

```text
closed
  -> loading
     -> preview
     -> pinned popover
     -> mobile sheet
     -> controlled load failure with Retry

preview -> pinned popover | mobile sheet | closing
pinned popover -> repositioned pinned | replacement pinned | closing
mobile sheet -> replacement sheet | closing
closing -> closed
any state -> stale/disconnected -> closed
```

Detailed event behavior:

- Hover uses a 220 ms open timer only for a mouse/fine-hover event.
- Keyboard focus opens preview immediately unless focus followed a touch
  pointerdown.
- Mouse leave uses a 300 ms close timer. Pointer entry into preview cancels it.
- Click, Enter, or Space use the native button activation. Desktop mouse or
  keyboard activation pins; touch activation or a viewport at/below 760 px
  opens the mobile sheet.
- A mobile request blocked by an active external `aria-modal="true"` dialog
  returns to closed without mounting. It creates no focus, scroll-lock, inert,
  timer, queued-request, stale-surface, or session side effect. Closing the
  blocking dialog does not replay the request; a later fresh activation may
  open normally.
- Escape closes preview, pinned popover, or sheet. Preview does not move focus;
  pinned/sheet close restores focus only to the current connected trigger.
- Outside pointer closes pinned desktop. A pointer inside trigger/surface does
  not.
- Document scroll closes preview immediately. Pinned desktop schedules one
  `requestAnimationFrame` reposition. Surface-internal scroll is ignored.
- Resize, visual viewport change, and desktop Tutor width change reposition or
  switch mode. Mode switching preserves content/focus when safe; moving into
  mobile acquires the modal environment, and moving out releases it.
- A detached or far-offscreen trigger closes. No DOM search attempts recovery.
- Route leave, Host disconnect, binding replacement, scope disposal, or Lab
  disposal closes without focus restoration.
- A stale lazy import may populate the cached loader attempt, but cannot mount.
  Every mobile completion re-checks the external-modal guard after import and
  again through guarded acquisition immediately before mount.
- Host reconnect increments generation, closes the old request, unsubscribes
  old context, and connects only the new binding.

### Tutor coordination

```text
Tutor visible
  -> Tutor presentation temporarily hidden
     -> Glossary opened
        -> Ask handoff requested
           -> Glossary closed
           -> injected handoff invoked
           -> Tutor restored/opened only if the handoff implementation does so

Glossary opened
  -> user manually opens Tutor
     -> Glossary closes without term focus restoration
     -> Tutor opens

any state -> Lab disconnect
  -> Glossary closes/disconnects
  -> Tutor disconnects
```

`PlatformTutorHost` gains a planned `suspendPresentationForGlossary()` method.
It hides/inerts a nested presentation container and releases its mobile modal
lease without disposing `MountedPlatformTutorPanel`, changing
`desktopOpen`, clearing draft/transcript, or aborting a pending request. It
shows the ordinary manual launcher. Closing Glossary does not automatically
unhide Tutor. A later manual Tutor open reuses the mounted panel and current
request state. Ordinary Tutor close and route disconnect keep their existing
disposal/abort semantics.

If New experiment or another external modal is already active, mobile Tutor
and mobile Glossary both receive the same controlled no-open result. Neither
Host suspends the other, mounts a panel/sheet, moves focus, or changes
scroll/inert state for a refused request. A later fresh open after the blocker
closes follows the normal state machine.

## 6. Accessibility and responsive contract

### Trigger and relationship

- Use a native `<button type="button">` with visible authored text/math.
- Keep inherited typography, no visible padding/border/background, no layout
  shift, a persistent dotted underline, stronger hover/focus/open state, and
  the global visible focus ring.
- Use native Enter and Space activation; do not emulate button keyboard
  behavior.
- While a surface shell exists, set `aria-controls` to its unique stable DOM
  ID and `aria-expanded="true"` on the active trigger. Remove both when the
  surface is removed; no inactive trigger points to nonexistent DOM.
- Never place a term button inside a native `label`, button, link, or other
  interactive control.
- For educational labels, keep the input's name in a native/hidden label or
  `aria-labelledby`; render the term button as a sibling, never as a child of
  `<label>`; preserve the input's `aria-describedby` help/error relationship.
  Activating the term opens only Glossary and never activates or unexpectedly
  refocuses the input. A later same-scope occurrence stays plain text. The
  committed minimal Playground fixture and automated/browser checks exercise
  this complete composition in desktop and mobile surface modes.

### Preview announcement

- Pointer hover preview is not a live-region announcement.
- Keyboard-focus preview writes one concise message to a Host-owned
  `role="status" aria-live="polite"` node after the preview is current.
- The visible preview is not focusable and has no Ask/close controls.
- Pinning clears the preview status before moving focus, preventing duplicate
  announcement.
- Opening a replacement term replaces rather than queues the status message.

### Pinned desktop and mobile sheet

- Pinned desktop uses a named non-modal region. Focus remains on the trigger
  unless the user activates the complete card; after pin activation, focus may
  move to the card heading or first action using `preventScroll`.
- Mobile uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, an
  explicit accessible close button, contained Tab/Shift+Tab focus, and an
  independent internal scroll region.
- The shared modal environment makes platform background regions inert,
  closes the mobile menu without restoring its focus, locks body scroll, and
  preserves/restores document position.
- Only the current modal owner may release inert/scroll state. Tutor and
  Glossary can never hold leases simultaneously.
- Escape closes the top Glossary surface. Outside pointer closes pinned
  desktop only; it does not close a modal sheet.
- Focus restoration occurs only when requested and the trigger is connected,
  enabled, visible, and belongs to the current binding/scope generation.
- Coarse/no-hover input never relies on preview. Hybrid devices use mouse hover
  when the event is a fine mouse event and mobile sheet behavior when the
  activation pointer is touch.

### Visual and content acceptance

- Add semantic layer/underline/surface tokens in `src/app/theme.css`; do not
  add literal component colors.
- Forced-colors mode keeps the underline, focus indication, border, text, and
  actions visible using system colors.
- Nonessential surface transitions are disabled under
  `prefers-reduced-motion: reduce`; correctness never depends on animation.
- At 200% zoom and approximately 390 × 844, surface content remains reachable,
  the close action remains visible or scroll-reachable, and the document has no
  horizontal overflow.
- Formula fallback exposes exactly one accessible text representation. The
  dedicated `Fix readonly math accessible ownership` prerequisite corrects
  `renderReadonlyMath()` and verifies all current caller categories before
  Glossary surface work begins. The enhanced child, not both parent and child,
  owns the math role/name; failure restores the single fallback. Shared
  surfaces consume that corrected helper without reopening its global
  ownership.
- Complete cards use one `h2`-level internal heading relative to the surface
  landmark/dialog. Fixture comparison tables use real `th` scope. Fixture
  controls use native labels. Headings are not term triggers when that would
  create nested or ambiguous controls.

jsdom tests prove DOM semantics, ARIA transitions, focus calls, listener
cleanup, and inert attributes. Browser checks prove geometry, hover timing in a
real pointer environment, visual viewport containment, forced colors, zoom,
and screen-reader behavior.

## 7. Lazy loading and production exclusion

### Allowed lightweight complete-Lab code

Before first interaction, a complete Lab with a Glossary binding may load:

- branded runtime types;
- builders and the current module registry;
- binding/scope/trigger logic;
- explicit trigger listeners;
- the lightweight Host coordinator and surface loader;
- no surface DOM or CSS.

Home may contain only the empty Shell Glossary region, lightweight inert Host,
and shared modal coordinator. It must not load a registry, scope controller,
surface runtime, formula renderer, fixtures, or Playground.

### Deferred first-interaction code

`src/glossary/glossarySurfaceLoader.ts` dynamically imports
`src/glossary/surface/glossarySurfaceRuntime.ts`. That module imports
`glossarySurface.css` and placement code. Readonly MathLive enhancement remains
behind the existing later `loadMathLiveModule()` boundary and begins only when
a complete surface actually has a formula.

The loader caches one attempt. Rejection produces a named, accessible failure
surface with Retry. Retry evicts only the rejected attempt and increments Host
generation. A fulfilled stale import is cached but not mounted.

### Development-only direction

```text
shared-surfaces commit
  platformBootstrap.ts
  -> import.meta.env.DEV guarded dynamic route descriptor
     -> dynamic import src/dev/glossary/glossaryPlaygroundRoute.ts
        -> src/dev/glossary/glossaryFixtures.ts

final Playground commit
  the same glossaryPlaygroundRoute.ts
    -> expanded glossaryFixtures.ts
    -> glossaryPlayground.css
  platformBootstrap.ts
    -> import.meta.env.DEV guarded dynamic import
       -> glossaryDevelopmentControls.ts
```

The shared-surfaces commit creates exactly one committed, reproducible
development route, `/__dev/glossary-playground`, using the exact route module
`src/dev/glossary/glossaryPlaygroundRoute.ts` and exact minimal fixture module
`src/dev/glossary/glossaryFixtures.ts`. Its content-neutral shell covers one
valid term trigger, hover preview, pinned desktop popover, mobile sheet,
dynamic context update, explicit replacement, formula fallback/deferred
enhancement, Tutor arbitration through an injected mock handoff, and the full
educational label/input/term composition. It is guarded by
`import.meta.env.DEV`, absent from production route definitions and emitted
chunks, unlinked from About, and unavailable through the development shortcut
at this stage. No second temporary harness route is permitted.

The exact local launch procedure for the committed shell is:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Then open `http://127.0.0.1:5173/__dev/glossary-playground`. This command is
planned for later browser verification; it is not run during this
documentation correction.

The final Playground commit expands these same two files with the full
interaction matrix and richer fixtures, adds final Playground styling, About
Developer Tools, and the development shortcut. `src/pages/aboutPage.ts`
receives only a boolean/path option and never imports `src/dev`. Production
`createRouteDefinitions()` receives no dev definitions. Fixtures never enter
`coreGlossary.ts`, a production module extension, or a production import.

### Required proof

Primary evidence:

1. Production route definitions have no `/__dev/glossary-playground` match;
   direct access resolves Not Found.
2. Production Vite manifest has no key/dynamic import for Playground,
   development controls, or fixtures.
3. Emitted production chunks contain no unique fixture/Playground marker.
4. The entry manifest dynamically references the Glossary surface runtime but
   does not statically import it.
5. Static source graph from `src/main.ts` has no path to registry, scope,
   surface, formula renderer, dev route, fixtures, or Tutor panel.
6. Browser Network: Home has no Glossary surface chunk; complete-Lab mount with
   a binding still has no surface chunk; first definition opening loads it
   once; formula enhancement and Tutor remain independent.

The shared-surfaces commit must prove items 1-3 before using the route for
browser evidence. It must also prove that neither About nor the development
shortcut imports or exposes the route. The final Playground commit repeats and
extends that proof after adding its development-only entry points.

Runtime marker searches are supplementary only. They do not replace manifest,
source-graph, and browser Network evidence.

## 8. Tests-first implementation sequence

### Phase A — model, registry, scopes, and binding

Create tests first:

- `src/glossary/glossaryBuilders.test.ts`
  - branded ID grammar and immutability;
  - valid string/math display;
  - invalid/empty formula records;
  - precise strict diagnostics;
  - production diagnostic de-duplication.
- `src/glossary/glossaryRegistry.test.ts`
  - duplicate term IDs;
  - string/math alias conflicts;
  - unknown override target;
  - module fallback/override;
  - formula replacement and `null` suppression;
  - immutable resolved values;
  - empty production core.
- `src/glossary/glossaryScope.test.ts`
  - first occurrence only;
  - same term in different scopes;
  - duplicate plain text;
  - native trigger semantics;
  - invalid production fallback;
  - keyboard/pointer intent emission;
  - trigger/scope idempotent disposal.
- `src/glossary/glossaryController.test.ts`
  - stable binding identity;
  - valid scope/trigger creation before Host-port connection;
  - pre-connect hover/focus/activation is a no-op with no throw, queue,
    replay, Store/session mutation, or out-of-scope timer;
  - only future fresh interactions reach a subsequently connected port;
  - one Host port connection at a time;
  - dynamic snapshot subscription ownership;
  - disposed binding rejects/no-ops by policy;
  - successful pinned replacement;
  - missing/aborted replacement closes;
  - stale transaction cannot affect a later scope.
- Type-level/structural coverage in `src/ode/initialValueProblemsRoute.test.ts`
  proves current ODE may omit the optional binding.
- Extend `src/app/routeBundleOwnership.test.ts` with source-graph/import
  evidence that `AppSessionStore` has no Glossary runtime dependency.

`src/app/appSessionStore.ts` receives no Glossary API or state field, and
`src/app/appSessionStore.test.ts` remains unchanged. Its existing
`assertPureValue()` tests continue to protect pure state. The only shared
contract edge is type-only and optional; controller/Host tests, plus import
review, prove transient Glossary ownership. Store tests change later only if
Store behavior actually changes, which is outside this milestone.

### Phase B — readonly-math accessible ownership prerequisite

Write regression tests before changing the shared helper:

- `src/math/ui/readonlyMath.test.ts`
  - fallback owns exactly one accessible representation;
  - enhanced output transfers that ownership without duplication;
  - enhancement failure restores the single fallback;
  - visual text and deferred backend behavior remain unchanged.
- `src/ode/odeLifecycle.test.ts`
  - ODE method/formula rendering retains one accessible representation.
- `src/convergenceStudyView.test.ts`
  - Convergence Study readonly formulas retain one accessible representation.
- `src/math/ui/tutorMath.test.ts`
  - controlled Tutor math rendering retains one accessible representation.

This phase modifies only the shared readonly-math helper and these direct
regressions. It adds no Glossary Host, surface, route, or fixture.

### Phase C — Host, modal environment, surfaces, coordination, and minimal harness

Create tests first:

- `src/app/platformModalEnvironment.test.ts`
  - one owner;
  - active external `aria-modal="true"` outside the requesting Host returns a
    controlled refusal;
  - blocking dialog close permits a later fresh acquisition;
  - exact inert snapshot restoration;
  - body overflow and scroll restoration;
  - stale lease cannot release current owner;
  - refusal creates no focus, scroll-lock, inert, or stale-surface side effect;
  - idempotent release/dispose.
- `src/glossary/glossarySurfaceLoader.test.ts`
  - one cached pending/fulfilled attempt;
  - rejection and controlled Retry;
  - stale generation cannot mount.
- `src/glossary/surface/glossaryPlacement.test.ts`
  - bottom preference, top flip, left/right shifts, margins, and max bounds.
- `src/glossary/surface/glossarySurfaceRuntime.test.ts`
  - compact versus complete content;
  - focus containment/restoration contract;
  - Escape/outside pointer;
  - formula fallback;
  - one accessible formula name;
  - dynamic update without remount/reanimation.
- `src/app/platformGlossaryHost.test.ts`
  - inert before binding;
  - connect/replace/disconnect/dispose;
  - one active surface;
  - 220/300 ms timer cancellation with fake timers;
  - click/pin/touch sheet modes;
  - document versus internal scroll;
  - one animation-frame reposition;
  - detached/far-offscreen trigger;
  - resize/mode switch;
  - context subscribe/unsubscribe;
  - stale lazy import, request, binding, and scope generations;
  - New experiment already open makes the mobile sheet refuse to open;
  - a dialog appearing during lazy load prevents stale completion from mount;
  - no focus restoration during route leave.
- Modify `src/app/platformTutorHost.test.ts`
  - suspension preserves the mounted panel, draft, transcript, desktop
    preference, and pending request;
  - a request that completes while suspended updates the live session without
    focusing hidden Tutor DOM;
  - manual reopen reuses the panel;
  - Tutor manual open closes Glossary first;
  - mobile lease transfers without simultaneous inert/scroll ownership;
  - New experiment already open makes mobile Tutor refuse a second modal;
  - platform modal inert ownership keeps the New experiment trigger inactive;
  - blocker close permits a later fresh open;
  - refusal has no focus, scroll-lock, inert, or stale-panel side effect.
- Modify `src/aiTutorPanel.test.ts`
  - request completion remains current while presentation is suspended;
  - hidden presentation receives no completion focus;
  - manual visible presentation retains existing completion focus behavior.
- Modify `src/app/labRouteAdapter.test.ts`
  - optional binding connects after mount;
  - absent binding is a no-op;
  - Host close/disconnect precedes Tutor/mobile/session/Lab disposal;
  - Lab alone finally disposes binding;
  - a Glossary connection failure cleans up without saving fake activity.
- Modify `src/app/platformBootstrap.test.ts`
  - singleton Host creation/disposal;
  - Router start hook closes/disconnects before scroll capture;
  - no Host state on static routes.
- Modify `src/app/appShell.test.ts`,
  `src/app/navigationAccessibility.test.ts`,
  `src/app/themeTokens.test.ts`,
  `src/app/routeBundleOwnership.test.ts`,
  `src/app/tutorLazyBoundary.test.ts`, and
  `src/app/viteBase.contract.test.ts` for their specific contracts.

- Create `src/dev/glossary/glossaryPlaygroundRoute.test.ts`
  - the minimal committed fixture shell mounts at the exact route;
  - valid trigger, hover preview, pin, mobile sheet, dynamic context,
    replacement, formula fallback/enhancement, and mock Tutor arbitration;
  - educational native/hidden label owns the input name;
  - term trigger is a sibling rather than nested in `<label>`;
  - input `aria-describedby` help/error relation remains intact;
  - term activation does not activate or refocus the input;
  - same-scope duplicate stays plain text in desktop and mobile modes;
  - dispose disconnects Host before binding;
  - no Store/Resume/meaningful-work dependency.
- Create `src/app/developmentRoutes.test.ts`
  - explicit dev injection matches the route;
  - default/production definitions resolve the same path to Not Found;
  - dynamic loader shares attempt and Retry behavior.
- Modify `src/app/platformBootstrap.test.ts`,
  `src/app/routeBundleOwnership.test.ts`, and
  `src/app/viteBase.contract.test.ts`
  - DEV-guarded route wiring;
  - production graph/manifest/fixture exclusion;
  - About and shortcut remain absent.

The six required modal-conflict tests are distributed explicitly:

1. `platformGlossaryHost.test.ts`: New experiment open → Glossary sheet
   refusal.
2. `platformTutorHost.test.ts`: New experiment open → mobile Tutor refusal.
3. `platformTutorHost.test.ts` plus browser verification: active platform
   modal → New experiment trigger remains inert.
4. Modal/Host tests: blocker closes → later fresh request opens.
5. `platformGlossaryHost.test.ts`: stale lazy completion after another modal
   opens cannot mount.
6. Modal/Host tests: refusal creates no focus, scroll-lock, inert, or
   stale-surface side effect.

### Phase D — complete development Playground and exclusion

Create tests first:

- Expand `src/dev/glossary/glossaryPlaygroundRoute.test.ts`
  - complete interaction matrix;
  - richer short/long, cross-scope, edge, scroll, invalid, and fixture cases.
- Create `src/dev/glossary/glossaryDevelopmentControls.test.ts`
  - Ctrl/Cmd+Shift+G;
  - ignored prevented events;
  - ignored input, textarea, select, contenteditable, and MathLive targets;
  - no duplicate navigation on current path;
  - listener cleanup.
- Modify `src/pages/pages.test.ts`
  - Developer Tools appears only from the optioned About factory;
  - production `aboutPage` remains unchanged.
- Modify `src/app/platformBootstrap.test.ts`,
  `src/app/routeBundleOwnership.test.ts`, and
  `src/app/viteBase.contract.test.ts`
  - conditional development-control wiring;
  - repeated production graph/manifest/fixture exclusion after expansion.

### Evidence boundary

- jsdom: DOM shape, ARIA state, focus calls, timers, inert attributes,
  listener/subscription cleanup, generation rejection, route/Host lifecycle.
- Pure tests: registry, builders, placement, state transitions, fallback.
- Production build/manifest: static/dynamic graph and dev exclusion.
- Real browser: geometry, hover/coarse/hybrid input, viewport, actual focus
  containment, scroll lock, forced colors, 200% zoom, Network timing, and
  console health.

Behavioral tests are preferred. Source-string assertions remain limited to
import and emitted-marker contracts where behavior alone cannot prove bundle
ownership.

## 9. Exact implementation phases and commits

### Commit 1 — `Build glossary model and scope lifecycle`

Create:

- `src/glossary/glossaryRuntimeTypes.ts`
- `src/glossary/glossaryBuilders.ts`
- `src/glossary/coreGlossary.ts`
- `src/glossary/glossaryRegistry.ts`
- `src/glossary/glossaryScope.ts`
- `src/glossary/glossaryController.ts`
- `src/glossary/glossaryBuilders.test.ts`
- `src/glossary/glossaryRegistry.test.ts`
- `src/glossary/glossaryScope.test.ts`
- `src/glossary/glossaryController.test.ts`

Modify:

- `src/app/contracts.ts` — type-only optional binding edge
- `src/app/routeBundleOwnership.test.ts` — Store-to-Glossary negative
  source-graph evidence
- `src/ode/initialValueProblemsRoute.test.ts` — current ODE omission evidence

Tests first: all Phase A failures listed above.

Verification:

```powershell
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts src/glossary/glossaryRegistry.test.ts src/glossary/glossaryScope.test.ts src/glossary/glossaryController.test.ts src/app/routeBundleOwnership.test.ts src/ode/initialValueProblemsRoute.test.ts
npm.cmd run test:run
npm.cmd run typecheck
git diff --check
git status --short
```

Browser checks: none required; this commit exposes no production UI.

Stop/review gate: conservative audit of IDs, validation/fallback,
first-occurrence behavior, unconnected-port no-op behavior, transaction
ownership, and Store exclusion before the readonly-math prerequisite.

Rollback boundary: revert only this commit; no platform Host or UI depends on
it yet.

Explicit non-changes: no ODE binding/annotation, no production entry, no
surface, no Store state, no Tutor/API work, no CSS, no route.

### Commit 2 — `Fix readonly math accessible ownership`

Create: no new files.

Modify:

- `src/math/ui/readonlyMath.ts`
- `src/math/ui/readonlyMath.test.ts`
- `src/ode/odeLifecycle.test.ts`
- `src/convergenceStudyView.test.ts`
- `src/math/ui/tutorMath.test.ts`

Tests first: all Phase B failures listed above. The helper must expose exactly
one accessible representation in fallback and enhanced states while preserving
current visual output, failure fallback, and the existing deferred MathLive
boundary. The four test categories are direct helper, ODE method/formula,
Convergence Study, and controlled Tutor math rendering.

Verification:

```powershell
npm.cmd run test:run -- src/math/ui/readonlyMath.test.ts src/ode/odeLifecycle.test.ts src/convergenceStudyView.test.ts src/math/ui/tutorMath.test.ts
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run build
git diff --check
git status --short
```

Browser checks: focused accessibility inspection of fallback, enhanced, and
failed enhancement output in current ODE, Convergence, and Tutor views; do not
use or add a Glossary harness in this commit.

Stop/review gate: conservative accessibility audit of exact single accessible
ownership across all current caller categories. Shared Glossary surfaces do
not begin until this gate passes.

Rollback boundary: revert only this prerequisite commit; Commit 1's unused
Glossary model remains intact and current callers return to their exact prior
helper behavior.

Explicit non-changes: no Glossary Host/surface/route/fixture, no visual formula
redesign, no eager MathLive, no ODE numerical behavior, no Tutor behavior, and
no dependency change.

### Commit 3 — `Add shared glossary surfaces`

This is the audited surface phase formerly numbered Commit 2. In the final
four-commit sequence it is Commit 3 because the readonly-math prerequisite was
inserted ahead of it; the approved committed browser-harness requirement stays
with this surface phase.

Create:

- `src/app/platformModalEnvironment.ts`
- `src/app/platformModalEnvironment.test.ts`
- `src/app/platformGlossaryHost.ts`
- `src/app/platformGlossaryHost.test.ts`
- `src/glossary/glossaryTutorContract.ts`
- `src/glossary/glossarySurfaceLoader.ts`
- `src/glossary/glossarySurfaceLoader.test.ts`
- `src/glossary/surface/glossaryPlacement.ts`
- `src/glossary/surface/glossaryPlacement.test.ts`
- `src/glossary/surface/glossarySurfaceRuntime.ts`
- `src/glossary/surface/glossarySurfaceRuntime.test.ts`
- `src/glossary/surface/glossarySurface.css`
- `src/dev/glossary/glossaryFixtures.ts`
- `src/dev/glossary/glossaryPlaygroundRoute.ts`
- `src/dev/glossary/glossaryPlaygroundRoute.test.ts`
- `src/app/developmentRoutes.test.ts`

Modify:

- `src/app/appShell.ts`
- `src/app/appShell.test.ts`
- `src/app/theme.css`
- `src/app/platform.css`
- `src/app/themeTokens.test.ts`
- `src/style.css` — semantic modal layer token only
- `src/app/platformTutorHost.ts`
- `src/app/platformTutorHost.test.ts`
- `src/tutor/platformTutorPanel.ts`
- `src/aiTutorPanel.test.ts`
- `src/app/platformBootstrap.ts`
- `src/app/platformBootstrap.test.ts`
- `src/app/contracts.ts` — add the dev route ID to the closed route union
- `src/app/routeDefinitions.ts` — explicit development definition injection
- `src/app/moduleRegistry.ts`
- `src/app/labRouteAdapter.ts`
- `src/app/labRouteAdapter.test.ts`
- `src/app/navigationAccessibility.test.ts`
- `src/app/routeBundleOwnership.test.ts`
- `src/app/tutorLazyBoundary.test.ts`
- `src/app/viteBase.contract.test.ts`

Tests first: all Phase C failures listed above, including the modal-refusal
matrix, educational label composition, and minimal committed harness.

Verification:

```powershell
npm.cmd run test:run -- src/app/platformModalEnvironment.test.ts src/glossary/glossarySurfaceLoader.test.ts src/glossary/surface/glossaryPlacement.test.ts src/glossary/surface/glossarySurfaceRuntime.test.ts src/app/platformGlossaryHost.test.ts src/app/platformTutorHost.test.ts src/aiTutorPanel.test.ts src/app/labRouteAdapter.test.ts src/app/platformBootstrap.test.ts src/dev/glossary/glossaryPlaygroundRoute.test.ts src/app/developmentRoutes.test.ts src/app/routeBundleOwnership.test.ts src/app/tutorLazyBoundary.test.ts src/app/viteBase.contract.test.ts
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run build
git diff --check
git status --short
```

Browser checks: run the shared-surface subset in Section 10 against the
committed `import.meta.env.DEV`-guarded
`/__dev/glossary-playground` route. Launch it exactly with:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/__dev/glossary-playground`. The minimal fixture
shell must reproduce one valid trigger, hover preview, pin, mobile sheet,
dynamic update, replacement, formula fallback/enhancement, mock Tutor
arbitration, and educational label composition. About remains unlinked and no
development shortcut exists in this commit.

Stop/review gate: browser and conservative code audit of focus, scroll, modal
refusal/lease behavior, Tutor suspension, stale loads, one-surface ownership,
educational composition, and production route/fixture/manifest exclusion.

Rollback boundary: revert Commit 3 while retaining Commit 1's unused model and
Commit 2's independently corrected readonly-math helper. The optional Lab
contract then returns to its Commit 1 state and current ODE still omits it.

Explicit non-changes: no real Tutor handoff, queue, transcript card, API,
production term, ODE annotation, persistence, numerical behavior, dependency,
public route, About Developer Tools entry, or development shortcut.

### Commit 4 — `Complete glossary framework playground`

Create:

- `src/dev/glossary/glossaryPlayground.css`
- `src/dev/glossary/glossaryDevelopmentControls.ts`
- `src/dev/glossary/glossaryDevelopmentControls.test.ts`

Modify:

- `src/dev/glossary/glossaryFixtures.ts` — richer content-neutral matrix
- `src/dev/glossary/glossaryPlaygroundRoute.ts` — expand the same minimal
  route; do not create another harness
- `src/dev/glossary/glossaryPlaygroundRoute.test.ts`
- `src/app/platformBootstrap.ts` — add DEV-guarded controls import to the
  existing DEV route injection
- `src/app/platformBootstrap.test.ts`
- `src/pages/aboutPage.ts` — production constant plus optioned dev factory
- `src/pages/pages.test.ts`
- `src/app/routeBundleOwnership.test.ts`
- `src/app/viteBase.contract.test.ts`
- `src/app/themeTokens.test.ts`
- `ARCHITECTURE.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/glossary/HANDOFF.md`
- `README.md` only if the completed framework is a major public project
  change; update one date group rather than adding multiple same-day entries

Tests first: all Phase D failures listed above.

Verification:

```powershell
npm.cmd run test:run -- src/dev/glossary/glossaryPlaygroundRoute.test.ts src/dev/glossary/glossaryDevelopmentControls.test.ts src/app/developmentRoutes.test.ts src/pages/pages.test.ts src/app/platformBootstrap.test.ts src/app/routeBundleOwnership.test.ts src/app/viteBase.contract.test.ts
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run build
git diff --check
git status --short
```

Browser checks: run the Commit 4 subset and the full Playground matrix in
Section 10 using the same committed route and exact launch command from Commit
3. Verify the About Developer Tools link and shortcut only now.

Stop/review gate: production-exclusion audit. Do not proceed to production
Glossary content.

Rollback boundary: revert Commit 4 to remove the expanded matrix, final
Playground styling, shortcut, and Developer Tools entry while retaining Commit
3's minimal reproducible DEV-only route and fixtures for surface auditing.

Explicit non-changes: no production terms, formal definitions, notation,
private-reference tooling, real Tutor handoff/queue/API, or ODE annotations.

## 10. Browser verification matrix

| Check | After Commit 2 prerequisite | After Commit 3 surfaces | After Commit 4 Playground | Before framework release |
|---|---:|---:|---:|---:|
| Current ODE/Convergence/Tutor formula accessibility | Required | Smoke | Smoke | Required |
| Desktop mouse hover delay/cancel/preview/pin | — | Required | Repeat smoke | Required |
| Keyboard-only focus, Enter/Space, Escape, focus restore | — | Required | Repeat | Required |
| Educational label/input/term composition | — | Required | Required | Required |
| Mobile touch sheet near 390 × 844 | — | Required | Required | Required |
| Hybrid touch/mouse behavior | — | Required | Required | Required |
| Nested surface scroll does not reposition | — | Required | Required | Required |
| Document scroll closes preview/follows pin | — | Required | Required | Required |
| Resize and desktop/mobile mode change while open | — | Required | Required | Required |
| Route navigation closes/disconnects without stale focus | — | Required | Required | Required |
| Tutor open/Glossary open arbitration | — | Required | Required | Required |
| New experiment open refuses Glossary and mobile Tutor | — | Required | Required | Required |
| Active platform modal keeps New experiment trigger inert | — | Required | Required | Required |
| Blocker close permits only a later fresh open | — | Required | Required | Required |
| Pending Tutor request survives temporary presentation hiding | — | Required | Required | Required |
| Mobile menu is closed/inert before sheet | — | Required | Required | Required |
| Reduced motion | — | Required | Required | Required |
| Forced colors/high contrast | — | Required | Required | Required |
| 200% zoom | — | Required | Required | Required |
| Detached trigger and far-offscreen trigger | — | Required | Required | Required |
| Stale lazy import blocked by a newly opened modal | — | Required | Smoke | Required |
| Repeated mount/dispose and Host reconnect | — | Required | Required | Required |
| Replacement trigger transaction | — | Required | Required | Required |
| Dynamic context update without focus loss | — | Required | Required | Required |
| Edge placement: top/bottom/left/right | — | Required | Required | Required |
| Long/short content and internal card scroll | — | Minimal shell | Required | Required |
| Glossary formula fallback and enhanced output | — | Required | Required | Required |
| Mock Tutor handoff sends no network request | — | Required | Required | Required |
| Direct committed dev route | — | Required | Required | Required |
| About Developer Tools link | — | Must be absent | Required | Required |
| Dev shortcut and editable-target exclusions | — | Must be absent | Required | Required |
| Production direct dev path renders Not Found | — | Required | Required | Required |
| Production manifest/chunks exclude fixtures | — | Required | Required | Required |
| Home/Lab/first-open Network chunk sequence | — | Required | Required | Required |
| No horizontal overflow | — | Required | Required | Required |
| Console warnings/errors/unhandled rejections | Required | Required | Required | Required |

Manual evidence records viewport, input mode, route, expected result, actual
result, console state, and Network chunk boundary. jsdom results are not
reported as geometry or real-browser evidence.

## 11. Verification commands

Focused commands are listed under each commit. Use Windows-safe commands and
do not install dependencies.

The final framework release gate is:

```powershell
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd run verify
git diff --check
git status --short
git diff --stat
```

`src/app/viteBase.contract.test.ts` remains the automated temporary-manifest
gate. A release review additionally inspects the real manifest/import graph,
raw/gzip sizes, supplementary emitted markers, and browser Network timing.

No implementation/release command above is part of this planning-only
iteration.

## 12. Risks and rollback points

| Risk | Prevention | Focused test/evidence | Runtime fallback | Rollback boundary |
|---|---|---|---|---|
| Focus/scroll collision with Tutor | Shared modal environment; non-destructive Tutor suspension; one owner lease | Host, modal, bootstrap tests plus mobile browser matrix | Close Glossary without focus restore; preserve Tutor panel/session/request | Revert Commit 3 |
| External modal collision | Generic guard detects an active `aria-modal="true"` outside the requesting Host before acquire, after lazy import, and at pre-mount acquire | Six focused refusal/recovery/stale/inert tests plus New experiment browser check | Controlled no-open; no queue, focus, scroll-lock, inert, or stale surface effect | Revert Commit 3 |
| Stale lazy surface import | Connection/request generations and modal blocker checked after await; cached attempt with rejected-only Retry | Loader and Host deferred-promise tests | Keep readable trigger; controlled failure/Retry or no-open | Revert Commit 3 |
| Detached trigger references | Connectivity/visibility checks before focus, position, update, or transfer | Host detach/far-offscreen tests | Close and clear reference | Revert Commit 3 |
| Duplicate registrations | Scope-local set updated atomically; strict diagnostics | Scope/registry tests | Later occurrence remains plain text | Revert Commit 1 |
| Hybrid-device mode switching | Event-specific pointer intent plus shared 760 px mobile query | Host unit tests and hybrid browser check | Prefer full mobile sheet for touch activation | Revert Commit 3 |
| Z-index conflict | One semantic modal layer token and exclusive modal owner | Token test and mobile browser stacking check | Refuse conflicting modal or close previous platform surface before acquiring layer | Revert Commit 3 |
| Playground fixture leakage | `src/dev` isolation, DEV-guarded dynamic imports, empty core | Production manifest, emitted graph, and direct-path tests in Commits 3 and 4 | Production route is Not Found | Revert the leaking Commit 3/4 change |
| `AppSessionStore` pollution | No Store API/field or runtime dependency; optional Lab edge is type-only | Existing pure-value tests unchanged; source-graph/import review plus controller/Host ownership tests | No Store write path exists; reject the offending architecture change | Revert offending commit; Commit 1 is independently removable |
| Eager bundle regression | Type-only Lab edge, lightweight Host, dynamic surface, DEV-only dynamic imports | Static graph, manifest, build sizes, browser Network | Keep Host inert; rollback eager edge | Revert Commit 3 or 4 |
| Invalid content | Strict dev/test validation and once-only production diagnostics | Builders/registry/scope tests | Preserve authored plain text; no button/surface/Tutor | Revert Commit 1 |
| Readonly-math accessible duplication | Correct shared ownership in a dedicated prerequisite before Glossary integration | Direct helper plus ODE, Convergence, Tutor regressions and accessibility audit | Retain readable single fallback when enhancement fails | Revert Commit 2 only |
| Misleading placeholder content | Empty production core; test/dev fixtures use neutral labels and explicit fixture markers | Registry, manifest, and documentation review | Production has no entries | Revert offending Commit 3/4 fixture change |
| Future Tutor queue contract drift | Keep handoff interface isolated and add no production adapter | Contract/type tests and negative API/Store checks | Ask absent without injected mock | Revert Commit 3 contract without touching Tutor |
| Context subscription leak | Host subscribes only in complete modes and owns idempotent unsubscribe | Controller/Host subscription tests | Close surface and stop updates | Revert Commit 1/3 at owning layer |
| Replacement transaction abandoned | Transaction has explicit commit/abort and binding-disposal invalidation | Controller tests | Close surface and dispose replacement scope | Revert Commit 1 |

High-risk changes stop at their commit review gate. No later commit is used to
hide a failed earlier lifecycle or bundle gate.

## 13. Deferred scope

The framework plan explicitly defers:

- production Glossary terms;
- the first four future ODE terms;
- canonical notation standards;
- formal definition review;
- private-reference processing or tooling;
- all source IDs, audit metadata, source-health behavior, source/audit tooling,
  and related types pending a later approved source/audit design;
- a real structured Tutor request implementation;
- a Glossary request queue;
- Keep/Replace behavior;
- Tutor transcript Glossary cards;
- Tutor/API contract versioning;
- persisted Glossary state;
- `AppSessionStore`, Resume, meaningful-work, or history integration;
- production ODE annotations;
- Linear Algebra or PDE content integration;
- a final fantasy visual theme;
- a theme selector;
- new numerical behavior or methods.

## 14. Resolved implementation questions from plan audit

The conservative plan audit exposed three implementation questions that source
inspection alone could not approve. The maintainer resolved them as follows:

1. **Shared-surface browser harness.** The audited former Commit 2 surface
   phase, now Commit 3 after inserting the readonly-math prerequisite, creates
   the minimum committed DEV-only Playground shell at
   `/__dev/glossary-playground`. It uses the exact route and fixture modules
   named in Sections 7 and 9 and supplies reproducible surface evidence without
   a temporary or second harness route.
2. **New experiment/platform modal overlap.** A generic
   `PlatformModalEnvironment` guard returns a controlled refusal while an
   external active modal is present. It does not close or queue either feature,
   use an ODE-name gate, or change the existing New experiment dialog.
3. **Global readonly-math accessibility.** A separate
   `Fix readonly math accessible ownership` prerequisite commit corrects the
   shared helper and covers direct, ODE, Convergence, and Tutor callers before
   any Glossary surface work.

No implementation question remains that blocks Commit 1. Later conservative,
accessibility, browser, or production-exclusion audits may still stop a
subsequent commit if source evidence contradicts this plan. No approved product
decision was reopened.

## 15. Final recommended execution order

1. Plan review.
2. Conservative Cursor re-audit of this corrected repository-grounded plan.
3. Maintainer approval of the corrected plan.
4. Commit 1 — `Build glossary model and scope lifecycle`.
5. Conservative audit of Commit 1.
6. Commit 2 — `Fix readonly math accessible ownership`.
7. Conservative accessibility audit of Commit 2 and all current callers.
8. Commit 3 — `Add shared glossary surfaces`.
9. Desktop/mobile/accessibility/browser audit of Commit 3 using the committed
   minimal DEV route.
10. Commit 4 — `Complete glossary framework playground`.
11. Production-exclusion and manifest audit.
12. Full framework release review.

```text
plan review
-> Cursor conservative re-audit
-> maintainer approval
-> Commit 1
-> audit
-> Commit 2
-> accessibility audit
-> Commit 3
-> browser audit
-> Commit 4
-> production-exclusion audit
-> full framework release review
```

Implementation must stop after each named gate. Production mathematical
content begins only under a later approved notation/definition and ODE
vertical-slice plan.
