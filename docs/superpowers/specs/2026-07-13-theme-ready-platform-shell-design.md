# Theme-Ready Platform Shell Design

**Status:** Approved; implementation not started

**Date:** 2026-07-13

**Scope:** Numerical Analysis Lab Platform Shell, Milestone 1

## 1. Purpose and decision status

The project will expand from the released single-domain Numerical ODE application into **Numerical Analysis Lab**, an interactive, AI-assisted platform for learning numerical analysis through computation, visualization, error analysis, and guided experiments.

The long-term platform has three domains:

- Numerical ODE
- Numerical Linear Algebra
- Numerical PDE

The current application becomes the first complete Lab, **Initial Value Problems Lab**. This milestone supplies the platform shell around it: routes, navigation, overview pages, in-memory session lifecycle, a shared Tutor host, theme-ready visual primitives, and deployment contracts. It does not add a numerical domain or change a numerical result.

This design is approved. It records implementation contracts and is not an invitation to restart product discovery or reopen route, navigation, persistence, Tutor, or theme decisions.

## 2. Repository baseline

The implementation plan must begin from these observed 2026-07-13 repository facts:

- `src/main.ts` is the root entry and currently owns the full Method -> Data -> Output ODE workflow, mutable UI state, Chart.js registration, form rendering, result rendering, Convergence Study mounting, and Tutor mounting.
- `src/problemPresets.ts` already defines the Exponential Decay problem with `t0 = 0`, `y0 = 1`, `tEnd = 5`, `h = 0.2`, right-hand side `-y`, and exact solution `exp(-t)`. The Platform Shell migration should reuse this validated preset data rather than duplicate its expressions or numbers.
- `src/aiTutorPanel.ts` currently keeps one module-global conversation. The shell migration must move Tutor messages and drafts into module-isolated pure session state while preserving the existing networking, safe rendering, and ODE grounding behavior.
- The root entry currently imports Chart.js eagerly. Route-level extraction must make Chart.js part of the complete ODE Lab path rather than the lightweight Home and overview paths.
- MathLive and Compute Engine already load through deferred boundaries. The new route boundary must preserve those inner lazy-loading boundaries.
- `vercel.json` currently declares only the Vite build, output directory, and framework. `api/chat.ts` is the deployed Tutor API entry. The implementation must inspect and test the actual Vercel routing behavior before adding a rewrite.
- `vite.config.ts` currently uses `base: "./"`. Nested-route asset resolution must be verified as part of repository-grounded implementation planning; this design does not assume that a rewrite alone is sufficient.
- The current visual layer declares a dark color scheme and a small set of literal/custom-property colors. Milestone 1 will consolidate those values behind semantic tokens without adding a theme switch or final fantasy skin.

These are migration constraints, not claims that any Platform Shell feature is already implemented.

## 3. Milestone boundaries

### Included

- A project-owned History API router and shared navigation function.
- A persistent platform shell with desktop and mobile navigation.
- Home, ODE overview, Linear Algebra overview, PDE overview, About, and client-side Not Found pages.
- Migration of the existing ODE experience to `/ode/initial-value-problems` under the name Initial Value Problems Lab.
- Route-level lazy loading, intent prefetch, loading, failure, Retry, and stale-load protection.
- An in-memory App Session Store, meaningful-work policy, Resume cards, and Lab scroll restoration.
- A stable Lab route boundary with explicit mount and dispose behavior.
- A platform-owned Tutor Host with module-isolated Tutor sessions.
- Beginner Starter and New experiment behavior for the complete ODE Lab.
- A semantic, theme-ready token layer and light visual unification.
- The Vercel SPA routing contract and the tests needed to protect it.
- English-only platform UI.

### Excluded

- Interactive Term Glossary or ODE term annotations.
- Linear Systems Lab, a matrix editor, SVD diagnostics, or Linear Algebra Tutor grounding.
- PDE solvers, grids, or visualizations.
- New ODE methods, adaptive stepping, systems of ODEs, or changes to fixed-step numerical behavior.
- Redesign or reordering of Method, Data, Output, forms, results, tables, charts, Convergence Study, or Tutor message behavior.
- Local storage, accounts, authentication, saved history, cross-tab synchronization, service workers, or offline mode.
- React, React Router, another frontend framework, a third-party router, Redux, or another state-management dependency.
- Separate Vite applications.
- Final fantasy branding, starfields, forest art, wizard or animal characters, fantasy iconography, a final brand font, or heavy animation.
- A full SEO system, translation infrastructure, a language switcher, or Chinese product labels.

## 4. Information architecture and route contract

Routes use clean History API paths and exact project-owned route definitions.

| Path | Route ID | Page | Availability |
|---|---|---|---|
| `/` | `home` | Platform Home | Available |
| `/ode` | `ode-overview` | Numerical ODE overview | Available |
| `/ode/initial-value-problems` | `ode-initial-value-problems` | Initial Value Problems Lab | Available, complete Lab |
| `/linear-algebra` | `linear-algebra-overview` | Numerical Linear Algebra overview | In development |
| `/pde` | `pde-overview` | Numerical PDE overview | Planned |
| `/about` | `about` | Platform and project overview | Available |
| any other page path | `not-found` | Client-side Not Found | Available |

The router matches `window.location.pathname`; query strings and fragments are not separate routes. A trailing slash may be normalized to the corresponding clean path, except that `/` remains `/`. The requested unknown path is retained for Not Found and rendered only as text.

Future architecture may reserve these paths, but no current navigation or copy may imply they are implemented:

- `/linear-algebra/linear-systems`
- `/ode/boundary-value-problems`
- `/ode/adaptive-step-size`
- `/ode/stability-regions`
- `/ode/stiff-systems`
- `/pde/heat-equation`
- `/pde/wave-equation`
- `/pde/poisson-equation`

## 5. Platform shell and navigation

The shell remains mounted while route content changes. It owns the platform header, primary navigation, route outlet, loading and failure presentation, mobile menu, Tutor Host region, and the single platform-level `beforeunload` listener.

Desktop navigation is a top bar with:

- Numerical Analysis Lab, linking to `/`
- Overview, linking to `/`
- ODE, linking to `/ode`
- Linear Algebra, linking to `/linear-algebra`
- PDE, linking to `/pde`
- About, linking to `/about`

ODE is active for `/ode` and its available Lab subtree. Linear Algebra and PDE use the same subtree rule. Overview is active only on `/`; About is active only on `/about`; Not Found has no false module active state. Active links use visual treatment and `aria-current="page"` where applicable.

On mobile the same destinations appear in a collapsible menu. The trigger has an accessible name, visible focus, and accurate `aria-expanded` and control association. The menu closes after successful navigation, Escape, or an explicit close action. It must not create horizontal viewport overflow.

Navigation items remain semantic anchors with real `href` values. The shared navigation boundary intercepts only unmodified primary-button activation of same-origin application links that do not request a download or a different target. Modified clicks, external links, downloads, and browser link commands retain native behavior.

The header may be sticky only if route content, focus targets, and anchor/scroll restoration are not covered. The shell must preserve enough main-content width for the current ODE tables and charts.

## 6. Platform Home

The root route is a real homepage rather than the ODE solver.

### Platform identity

The page title is **Numerical Analysis Lab**. Its purpose statement is:

> An interactive, AI-assisted platform for learning numerical analysis through computation, visualization, error analysis, and guided experiments.

The core learning cycle appears as:

```text
Understand -> Compute -> Visualize -> Analyze
```

### Module cards

| Module | Status | Primary action | Destination |
|---|---|---|---|
| Numerical ODE | Available | Open Lab | `/ode/initial-value-problems` |
| Numerical Linear Algebra | In development | View roadmap | `/linear-algebra` |
| Numerical PDE | Planned | View roadmap | `/pde` |

The ODE card or a secondary module link may also expose `/ode`. Incomplete modules receive roadmap links only; they must not display fake Run buttons, editable controls, or simulations.

### Recommended Learning Path

The non-mandatory recommendation is:

1. Initial Value Problems
2. Linear Systems
3. Heat and Poisson Equations

Copy must explicitly say this is a suggested sequence, not a locked progression. Linear Systems and the PDE items are visibly marked as future Labs.

### Resume cards

When meaningful in-memory sessions exist, Home shows a **Continue your experiment** area with at most one card per module and at most three cards in total. Cards are sorted by descending `lastMeaningfulInteraction`.

A card contains safe summary metadata such as Lab name, current step and method, analysis status, and a **Resume Lab** action. It does not contain complete inputs, equations, Tutor message text, or hidden DOM. Selecting it restores the route, pure Lab session, analysis state, module Tutor session, and saved Lab scroll position.

Only the ODE card can exist in Milestone 1 because it is the only complete Lab. Cards disappear on refresh because the store is memory-only.

## 7. Overview, About, and Not Found pages

### Numerical ODE overview

`/ode` explains Numerical ODE, presents Initial Value Problems Lab as available, and offers **Open Initial Value Problems Lab**. Boundary Value Problems, Adaptive Step Size, Stability Regions, and Stiff Systems may appear only as planned roadmap items. The page explains how ODE computation connects to Linear Algebra and PDE without implying those Labs exist.

### Numerical Linear Algebra overview

`/linear-algebra` explains the domain and labels it **In development**. It presents Linear Systems Lab as the first planned vertical slice and lists Least Squares, SVD, and Eigenvalue Labs as future work. It has no matrix editor, runnable controls, or Tutor.

### Numerical PDE overview

`/pde` explains the domain and labels it **Planned**. It introduces future Heat, Wave, and Poisson Labs and explains finite differences, boundary conditions, stability, refinement, and the connection from PDE discretization to Linear Algebra. It has no runnable controls or Tutor.

### About

`/about` describes the platform learning goal, the current complete ODE scope, the educational and AI-assisted approach, and the staged roadmap. It distinguishes released functionality from planned modules.

### Not Found

Unknown paths stay inside the shell. The page title is **Page Not Found**, displays the requested path safely as text, and links to Home and Initial Value Problems Lab. It does not silently redirect to Home.

Overview, About, and Not Found routes normally start at the top and never mount the Tutor Host.

## 8. Initial Value Problems Lab identity

The existing application moves to `/ode/initial-value-problems` and is renamed **Initial Value Problems Lab**.

Page hierarchy is:

```text
Numerical Analysis Lab
Numerical ODE
Initial Value Problems Lab
```

The page uses a lightweight breadcrumb:

```text
Numerical ODE / Initial Value Problems Lab
```

Numerical ODE links to `/ode`. The page title is **Initial Value Problems Lab** and the subtitle is:

> Explore fixed-step methods for first-order initial value problems, then study stability, error, and convergence.

The current internal flow remains:

```text
Method -> Data -> Output
```

This milestone may extract and adapt the current ODE entry so it can mount, serialize state, and dispose cleanly. It must not redesign or reorder method cards, Step 2 forms, Step 3 results, Convergence Study information architecture, tables, Tutor messages, or chart semantics.

## 9. Beginner Starter

Every complete Lab begins with an explicitly identified starter. Initial Value Problems Lab uses:

| Field | Value |
|---|---|
| Preset | Exponential Decay |
| Method | Forward Euler |
| `t0` | `0` |
| `y0` | `1` |
| `tEnd` | `5` |
| `h` | `0.2` |
| Exact solution | Enabled |
| Exact solution expression | `y(t) = e^(-t)` |

The initial notice is:

> **Beginner starter**
>
> This example is ready to run. Use it as-is, choose another preset, or enter your own problem.

Changing a core experiment field changes the state to:

> **Custom experiment**
>
> You have changed the starter problem.

Core fields are method and order, right-hand side, `t0`, `y0`, `tEnd`, `h`, exact-solution enabled/value state, and preset identity. Opening Tutor, toggling Convergence chart metrics, opening teaching accordions, or scrolling does not change starter identity. After the first successful Run, the large notice may collapse to a compact status label without losing its state meaning.

One authoritative `createBeginnerStarterSession()` builder owns the starter. It must reuse the existing Exponential Decay preset definition for problem values and expressions, then add the approved method and initial UI state. Initial entry and **New experiment** both call this builder; no second set of starter constants is allowed.

## 10. Architecture and dependency direction

The intended ownership is:

```text
src/app/
  router.ts
  routeDefinitions.ts
  appShell.ts
  appSessionStore.ts
  platformTutorHost.ts
  moduleRegistry.ts

src/pages/
  homePage.ts
  odeOverviewPage.ts
  linearAlgebraOverviewPage.ts
  pdeOverviewPage.ts
  aboutPage.ts
  notFoundPage.ts

src/ode/
  initialValueProblemsRoute.ts
  odeApp.ts
  odeSession.ts
```

Exact paths may be refined in the repository-grounded implementation plan, but ownership and dependency direction are fixed:

```text
router and app shell
  -> route pages and module registry
  -> lazy complete-Lab route modules
  -> domain UI and numerical code
```

Domain modules do not import the global router, History API, shell, or another domain. They receive navigation, Tutor binding, targets, and other platform services through narrow interfaces. The router never imports ODE methods, equations, convergence types, matrix concepts, or PDE grids.

The current ODE internals may remain relatively large during the first extraction. Platform Shell is an adapter-and-lifecycle migration, not a broad architectural rewrite.

## 11. Router contract

The project-owned router is responsible for:

- matching the current path against route definitions;
- routing all internal navigation through one `navigate(path, options?)` function;
- using `pushState` or `replaceState` for clean same-document navigation;
- responding to `popstate` without pushing a new history entry;
- updating active navigation and `document.title`;
- lazy-loading the matched route module;
- capturing and disposing the previous mounted route;
- rendering loading, load-failure, Retry, and Not Found states in the outlet;
- rejecting stale asynchronous mounts; and
- coordinating scroll restoration with route lifecycle.

The router is not responsible for Lab state interpretation, numerical state, Tutor messages, Resume summary wording, or meaningful-work rules. Those come from the module registry, App Session Store, and mounted Lab boundary.

Each navigation receives a monotonically increasing generation token. After every asynchronous boundary, the router verifies that the token still belongs to the current navigation. An older dynamic import or delayed mount continuation can never replace, dispose, focus, or scroll a newer route. A stale loaded module may populate the JavaScript module cache, but it is not mounted. Rejections are handled so they cannot become unhandled promise rejections.

At navigation start the shell closes any visible mobile Tutor, captures the current history-entry scroll, asks a complete Lab to provide its latest pure session and Resume summary, and disposes the route. It then keeps the shell visible and renders the target loading state. Load failure preserves stored Lab and Tutor sessions and offers Retry.

Retry starts a new navigation generation and a fresh import attempt for the failed route. It does not reset a Lab, discard Tutor history, or reuse a known-rejected cached promise.

## 12. Route-level loading and intent prefetch

Every route definition owns a loader. Home and the shell remain lightweight. The complete ODE implementation is dynamically imported only for `/ode/initial-value-problems`. Its route chunk may load ODE session/form logic, solvers, Chart.js, Convergence Study, AI Tutor, and the existing deferred MathLive/Compute Engine boundaries. Overview pages do not import complete numerical Labs.

Future Linear Algebra and PDE Labs must become their own route chunks rather than growing the ODE chunk or creating separate Vite applications.

The heavy ODE loader uses one cached import promise per route. Prefetch calls and real navigation share that promise. A started prefetch is not cancelled when hover ends. Prefetch rejection is caught and silent; if navigation observes the rejected cached attempt, it renders the normal failure state, and Retry evicts the rejected promise before reimporting.

Prefetch triggers on:

- mouse hover over **Open Lab** or an available Lab card;
- keyboard focus on an available Lab action; and
- other visible navigation links that lead directly to a complete Lab.

There is no automatic idle preload, no prefetch for unimplemented Linear Algebra or PDE Labs, and no touch-specific speculative request. Touch activation loads normally as part of navigation.

The loading state is a lightweight skeleton or panel with no fake numerical values. The shell and navigation remain usable. Failure copy explains that the Lab could not load and provides a keyboard-accessible Retry control.

## 13. Lab route module boundary

The shell needs a stable complete-Lab interface without learning domain details. The conceptual contract is:

```ts
interface LabRouteModule<TSession> {
  createBeginnerStarterSession(): TSession;

  mount(options: {
    target: HTMLElement;
    session: TSession;
    navigate: (path: string) => void;
    tutorBinding: LabTutorBinding<unknown>;
  }): {
    getSession(): TSession;
    getResumeSummary(): ResumeSummary | undefined;
    getScrollPosition(): number;
    dispose(): void;
  };
}
```

Exact TypeScript names may be refined during implementation planning. The behavioral boundary may not be weakened: the shell can create or retrieve a pure session, mount the Lab, request the latest pure session and safe Resume metadata, capture numeric scroll position, and dispose it.

`TSession` is serializable/pure application state in spirit even though Version 1 does not persist it. It may include discriminated domain records and numerical result arrays, but it contains no DOM nodes, custom elements, Chart instances, event listeners, functions, AbortControllers, virtual keyboard references, or mounted component handles.

The Lab owns conversion between its pure state and current ODE runtime variables. The first migration may use an adapter around existing code, but returning to a route must reconstruct UI and runtime objects from pure state rather than cache hidden DOM.

## 14. App Session Store

The platform uses one lightweight, project-owned in-memory store. No state-management dependency or browser persistence is added.

Conceptually:

```ts
type LabModuleId = "ode" | "linear_algebra" | "pde";

interface AppSessionStore {
  labs: {
    ode: OdeSessionState;
    linearAlgebra?: unknown;
    pde?: unknown;
  };
  tutors: Record<LabModuleId, ModuleTutorSession>;
  routeSessions: Record<string, {
    scrollPosition?: number;
    lastMeaningfulInteraction?: number;
  }>;
}
```

Only ODE has a complete Lab session in Milestone 1. Future domain values remain opaque placeholders; this milestone does not design matrix or grid session models prematurely.

Lab and Tutor sessions are separate. Store updates use pure values and module-specific operations rather than exposing a mutable global object to every page. Version 1 writes nothing to `localStorage`, `sessionStorage`, IndexedDB, or another persistence layer. Refreshing or closing the tab clears the store.

The ODE session preserves, when applicable:

- Method/Data/Output step;
- selected method and order;
- expression drafts and confirmed expressions;
- numeric input drafts;
- preset identity, Beginner Starter/custom state, and customization source;
- exact-solution enabled/value state;
- successful numerical result and immutable run snapshots;
- Convergence Study setup, result, stale/current state, chart metric, and teaching accordions;
- module Tutor session through the separate Tutor store entry;
- Tutor panel preference on desktop; and
- numeric Lab scroll position.

No state survives a full refresh.

## 15. Meaningful work, Resume summaries, and unload protection

A Lab session is meaningful when at least one is true:

- the Beginner Starter has been modified;
- an unexecuted core draft differs from the last successful or starter state;
- the user moved beyond Method, the first step;
- a successful numerical result exists;
- an analysis result exists; or
- the module Tutor contains at least one user message.

Simply opening and leaving a pristine Lab is not meaningful. Tutor opening, Convergence metric toggles, accordion state, scrolling, mobile menu use, and other presentation-only actions do not make it meaningful.

`lastMeaningfulInteraction` updates for a core edit, step advance, successful Run, successful analysis, New experiment transition that retains prior Tutor work, or user Tutor message. Passive remounting, Resume selection, scrolling, chart metric changes, and panel open/close do not reorder cards.

Each Lab produces a small `ResumeSummary` from pure state. The summary may name a method, current step, or completed analysis but may not expose complete equations, numeric inputs, or conversation text. Home takes at most the newest summary per module, sorts modules by meaningful activity, and caps the result at three.

The shell registers one `beforeunload` listener. It asks the store whether any Lab or Tutor has meaningful work and calls the standard browser warning mechanism only when needed. Individual Labs and Tutor components do not register unload listeners. Internal navigation never warns because the store preserves the sessions. Browser-defined confirmation text is not customized.

After **New experiment**, a pristine starter with no user Tutor messages is not meaningful and has no Resume card.

## 16. Mount, save, dispose, and restore lifecycle

Leaving a complete Lab follows this order:

1. Close the visible mobile Tutor presentation if applicable.
2. Capture the current pure Lab session and safe Resume summary.
3. Capture the actual main-content scroll position as a number.
4. Save Lab state, route metadata, and the already separate Tutor session.
5. Dispose the mounted Lab.
6. Destroy the primary and Convergence Chart.js instances.
7. Dispose editable and read-only MathLive-owned route elements/handles.
8. Hide the MathLive virtual keyboard.
9. Remove route, form, document, and media-query listeners owned by the Lab.
10. Abort or invalidate route-owned asynchronous UI work where supported.
11. Dispose the active Tutor binding and host presentation without clearing its pure session.
12. Clear the route outlet before the next route mounts.

Returning follows this order:

1. Load or reuse the route-module promise.
2. Obtain the saved pure Lab session, or create the authoritative Beginner Starter on first entry.
3. Mount fresh Lab DOM and runtime objects from that state.
4. Bind the ODE Tutor session to the shared Tutor Host.
5. Wait until the mounted layout is ready and the navigation generation is still current.
6. Restore the appropriate saved numeric scroll position.

The app does not keep hidden Lab DOM mounted. It does not cache DOM fragments, MathLive custom elements, canvases, Tutor panels, or Chart objects. Dispose is idempotent so a failure path cannot double-destroy resources or leave duplicate listeners.

## 17. Scroll restoration

The router sets browser scroll restoration to manual while the application is active and maintains two complementary numeric records:

- a per-history-entry scroll value for Back/Forward; and
- a per-Lab route scroll value in the App Session Store for leaving the Lab for the platform and later resuming it.

Before navigation, the router updates the current history entry with its actual main-content scroll position. A pushed overview/About/Not Found entry starts at the top. First entry to a complete Lab starts at the top. Normal platform navigation back into a previously visited Lab uses that Lab's saved scroll. `popstate` prefers the scroll associated with the target history entry.

Restoration occurs only after mount and layout readiness, and only if its navigation generation is current. It uses actual pixel values for the current viewport; it never infers positions from desktop dimensions or DOM references. Values are clamped by the browser naturally if the new layout is shorter.

Opening or closing Tutor snapshots and preserves the main content scroll. A mobile bottom sheet must not scroll the document behind it. Closing Tutor restores the captured main-content position. Route changes close the mobile Tutor before mounting or scrolling the next page.

## 18. Shared Tutor architecture

The platform owns one Tutor rendering, networking, accessibility, and responsive-layout component, while each complete Lab supplies a typed binding and an independent session.

```ts
type LabContext =
  | { kind: "ode"; context: OdeLabContext }
  | { kind: "linear_algebra"; context: LinearAlgebraLabContext }
  | { kind: "pde"; context: PdeLabContext };

interface LabTutorBinding<TContext> {
  moduleId: LabModuleId;
  getContext(): TContext | undefined;
  suggestedQuestions: string[];
  promptProfile: TutorPromptProfile;
}
```

The union stays discriminated. It does not become one object with many optional ODE, matrix, and PDE properties. In Milestone 1 only the ODE binding is operational; future types are contracts, not implemented grounding.

`getContext()` runs for each sent message so answers use the current successful experiment and current Convergence state. The migration preserves the existing ODE Tutor API behavior, mock/live behavior, safe text/math rendering, structured chart instructions, and grounding rules. Moving the host must not make Tutor math executable or loosen the existing content boundary.

No Tutor appears on Home, any overview, About, Not Found, or a loading/failure page.

### Module Tutor sessions

Conceptually:

```ts
interface ModuleTutorSession {
  messages: TutorMessage[];
  draftMessage: string;
  isOpen: boolean; // desktop module preference
}
```

Each module has its own entry. ODE messages never appear in Linear Algebra or PDE; closing the panel does not clear messages; switching routes preserves the module session; clearing one module does not affect another. The mobile overlay's currently visible state is route-owned presentation state, not a reason to open Tutor automatically on a destination. A mobile route change closes it before the next route mounts. The stored `isOpen` preference controls restoration of that module's desktop panel.

### Responsive Tutor Host

On desktop the host is a collapsible right-side panel. Main Lab content adapts instead of being covered, and closing/reopening preserves main scroll. Returning to ODE restores ODE's desktop open preference.

On mobile the host is a bottom sheet or near-full-screen panel with an explicit close control. Its message list scrolls independently, and input/send controls remain visible above the system keyboard using viewport-aware layout. Opening Tutor hides the MathLive virtual keyboard first. The underlying Lab does not move, scroll, or accept accidental interaction while the sheet is modal.

## 19. New experiment

Every complete Lab exposes **New experiment**. Activation opens a confirmation UI before destructive reset. It contains an enabled-by-default option:

> Also clear this module's Tutor conversation

On confirmation, the action:

- replaces only this Lab's state with `createBeginnerStarterSession()`;
- clears Lab drafts, successful results, analyses, and stale/current analysis ownership;
- returns to Method;
- resets Lab scroll to the top; and
- leaves other module Lab and Tutor sessions unchanged.

If Tutor clearing is enabled, it clears this module's messages and input draft while preserving the desktop open/closed preference where appropriate.

If Tutor clearing is disabled, messages and draft remain and a non-editable divider is appended:

> **New experiment started**
>
> Earlier messages refer to the previous experiment. New answers use the current experiment.

The divider is typed presentation data, not an assistant or user message, and is not submitted as user content. Every subsequent answer obtains fresh context from the new experiment.

Cancelling confirmation changes nothing. Confirming from a pristine starter is allowed but must not accidentally make the new pristine session meaningful.

## 20. Theme-ready visual layer

Milestone 1 uses a neutral, coherent, computation-first presentation. Components depend on semantic custom properties rather than scattered literal colors.

Required semantic tokens include:

```text
--color-page-background
--color-surface-primary
--color-surface-raised
--color-text-primary
--color-text-secondary
--color-accent-primary
--color-accent-secondary
--color-border
--color-focus-ring
--color-success
--color-caution
--color-danger
--shadow-card
--texture-decorative
--space-*
--radius-*
--content-width-*
```

Component styles use the semantic names. A small token-definition layer may contain the literal neutral palette. The decorative texture token defaults to `none` and is a future skin hook, not an invitation to add artwork in this milestone. Chart.js colors that preserve current chart semantics are resolved from centralized semantic values rather than repeated in component code. Focus does not depend on color alone and meets visible keyboard-focus expectations.

Light unification is limited to platform header, content width, spacing, title hierarchy, breadcrumbs, module/status badges, cards, buttons, focus states, responsive behavior, and platform/module/Lab naming. Small ODE style adjustments are allowed only where the existing workflow must fit the shell.

Method cards, Data form structure, Output hierarchy, Convergence Study architecture, tables, Tutor message behavior, and numerical chart meanings remain intact.

The current application declares a dark browser color scheme. Milestone 1 may preserve that neutral dark mapping; theme-ready does not require a light theme, theme switch, or personal skin. Browser form controls and the existing supported color-scheme behavior must remain legible. A future skin may map the same semantic tokens to night sky, forest shadows, moonlit silver, subtle starlight, and restrained magical highlights without changing components. No such final assets or branding ship now.

## 21. Accessibility and responsive behavior

All new UI is keyboard operable and English-only. Semantic links and buttons keep native roles. Focus is visible and moves deliberately after navigation, menu close, load Retry, confirmation, and Tutor open/close. Route changes focus the main page heading or main region without disrupting Back/Forward scroll restoration; the implementation plan must define and test the ordering between focus and scroll.

Status badges include text rather than color alone. Loading is announced without taking focus repeatedly. Failure and validation messages use appropriate live-region behavior. Mobile overlays have a named close control, contained focus behavior appropriate to their modality, and a return-focus target.

Layouts are tested at narrow and wide viewports. The platform shell and Tutor must not make current ODE tables or canvases overflow the viewport; existing table-local scrolling remains available where needed.

## 22. Page titles and metadata

The router sets `document.title` from route definitions:

| Route | Title |
|---|---|
| Home | `Numerical Analysis Lab` |
| ODE overview | `Numerical ODE | Numerical Analysis Lab` |
| Initial Value Problems Lab | `Initial Value Problems Lab | Numerical Analysis Lab` |
| Linear Algebra | `Numerical Linear Algebra | Numerical Analysis Lab` |
| PDE | `Numerical PDE | Numerical Analysis Lab` |
| About | `About | Numerical Analysis Lab` |
| Not Found | `Page Not Found | Numerical Analysis Lab` |

Titles update for direct loads, internal navigation, Back/Forward, and Not Found. This milestone does not add an SEO framework.

## 23. Vercel SPA deployment contract

History API routes require a server fallback, but the implementation must not replace the current configuration with a guessed catch-all. Repository-grounded planning must inspect `vercel.json`, Vercel filesystem routing precedence, the existing `api/chat.ts` function, the built `dist` asset URLs, and the current Vite base.

The deployed behavior must satisfy all of these conditions:

- `/api/*` continues to route to existing and future API handlers and is never swallowed by the page fallback.
- Built JavaScript, CSS, font, and other static asset requests resolve as files and are never rewritten to HTML.
- Known application page routes return `index.html` on direct requests.
- Unknown non-file page paths also return `index.html`, allowing the client router to show Not Found.
- Direct refresh and external links to `/ode/initial-value-problems` work.
- The existing Tutor API contract continues to work in production.

The implementation should add only the minimal verified routing change and any asset-base correction proven necessary by the built output. It must not invent API rewrites, overwrite unrelated configuration, or redirect all unknown paths to `/`.

## 24. Automated test requirements

Tests should follow existing Vitest/jsdom patterns where practical and add focused boundaries rather than one brittle end-to-end unit test.

### Router and navigation

- exact route matching and trailing-slash normalization;
- clean URL push/replace navigation;
- `popstate` without duplicate history entries;
- active links and `aria-current`;
- every page title;
- safe Not Found path rendering;
- loading presentation;
- dynamic-import failure and Retry;
- a failed prefetch remaining silent;
- async route-load race where an older load resolves last;
- no stale route mount, focus, or scroll;
- semantic-link interception rules; and
- desktop and mobile menu state, keyboard behavior, and visible focus hooks.

### App Session Store and Resume

- ODE pure-session preservation across route changes;
- Lab and Tutor session separation;
- no DOM or runtime-object storage;
- every meaningful-work condition and every non-meaningful presentation action;
- platform-level unload decision;
- Resume card omission for a pristine session;
- last-meaningful-activity ordering;
- one Resume card per module and three total; and
- no full inputs or Tutor message text in Resume summaries.

### Lifecycle and scroll

- mount, snapshot, save, dispose, and fresh remount;
- Chart.js, Convergence view, MathLive field, virtual keyboard, and Tutor binding cleanup;
- route/document listener removal and no duplicates after repeated navigation;
- idempotent dispose;
- Lab scroll capture and platform return restoration;
- per-history-entry Back/Forward restoration;
- overview top positioning;
- stale scroll callback rejection; and
- Tutor open/close preserving main scroll.

### Tutor Host

- host mounts only for a complete Lab;
- module-isolated messages, drafts, and desktop preference;
- fresh ODE context for each message;
- desktop restoration;
- mobile route-close with no destination auto-open;
- MathLive virtual keyboard hidden before mobile Tutor opens;
- clear/reset isolation; and
- existing safe rendering, networking, grounding, and chart-instruction regression coverage.

### Beginner Starter and New experiment

- authoritative starter builder uses Exponential Decay preset values plus Forward Euler;
- core edits change Beginner Starter to Custom experiment;
- presentation-only actions do not;
- reset confirmation and cancellation;
- starter reset, first step, cleared results/analyses, and top scroll;
- default Tutor clearing;
- retained-conversation divider and fresh context; and
- other module sessions remain unchanged.

### Lazy loading and prefetch

- Home and overview imports do not load the complete ODE module or Chart.js;
- hover and keyboard focus prefetch only implemented complete Labs;
- one cached promise is shared by prefetch and navigation;
- hover exit does not cancel a started import;
- no idle preload or incomplete-module preload; and
- Retry replaces a rejected cached promise.

### Vercel and regression

- a configuration/contract test protects `/api/*` from the SPA fallback;
- built static assets are served as assets;
- nested and unknown page requests reach `index.html` as intended;
- ODE numerical outputs and fixed-grid behavior are unchanged;
- Convergence Study behavior and results are unchanged;
- exact-solution and preset behavior are unchanged;
- Tutor grounding is unchanged;
- no dynamic expression execution is introduced; and
- all new product UI remains English-only.

## 25. Manual browser verification

Before acceptance, verify:

1. Home loads without the full ODE Lab or Chart.js chunk.
2. Module cards show the approved statuses and actions.
3. Recommended Learning Path is visible and non-mandatory.
4. Numerical ODE overview and planned roadmap are accurate.
5. Open Initial Value Problems Lab from Home and ODE overview.
6. Beginner Starter has the approved method, preset, values, exact solution, and notice.
7. The existing ODE Run works with unchanged numerical output.
8. The existing Convergence Study works unchanged.
9. Existing Tutor grounding, mock/live behavior, and safe rendering still work.
10. Navigate Home and return to the Lab.
11. ODE step, inputs, result, analysis, accordions, chart metric, and Tutor session restore.
12. Lab scroll restores without a visible jump or layout assumption.
13. A meaningful session produces one safe Resume card; a pristine visit does not.
14. Browser Back/Forward restores routes, titles, active links, state, and entry scroll.
15. Direct refresh and external navigation to the nested ODE route work in the target deployment environment.
16. The Vercel SPA fallback shows the client app for page routes.
17. `/api/chat` still reaches the Tutor function.
18. Linear Algebra shows roadmap content, **In development**, and no Run controls.
19. PDE shows roadmap content, **Planned**, and no Run controls.
20. About distinguishes current and future scope.
21. An unknown path shows in-shell Not Found and safe navigation links.
22. A delayed Lab import shows the lightweight route loading state.
23. A simulated chunk failure shows Retry and preserves Lab/Tutor sessions.
24. Hover and keyboard focus prefetch the ODE Lab once; incomplete modules do not prefetch.
25. New experiment confirms, resets to the authoritative starter, and scrolls to top.
26. Tutor clear and preserve options both behave as specified, including the divider.
27. `beforeunload` warns only for meaningful in-memory work and never for internal navigation.
28. Desktop navigation active states, focus, and available width are correct.
29. Mobile menu opens, closes, navigates, and does not overflow.
30. Desktop Tutor panel resizes the Lab and restores module preference.
31. Mobile Tutor hides MathLive's keyboard, keeps controls visible, preserves Lab scroll, and closes on route change.
32. Platform components consistently use semantic tokens.
33. The currently supported dark color-scheme behavior and native controls remain legible; no unapproved theme switch appears.
34. No horizontal viewport overflow occurs at supported widths.
35. There are no console errors, duplicate-listener symptoms, or unhandled promise rejections.

Run the full existing verification command after implementation in addition to these browser checks.

## 26. Delivery sequence and future contracts

The approved product sequence is:

1. Theme-Ready Platform Shell
2. Interactive Term Glossary
3. Linear Systems Lab

Milestone 2 will later provide global and module definitions, hover/focus and touch cards, Ask the Tutor actions, mock/live explanations, initial ODE terms, and a shared glossary component. This document does not design those details or annotate the ODE UI now.

Milestone 3 will later provide the first Linear Algebra vertical slice, including its Problem -> Method -> Results workflow, controlled matrix/scalar input, teaching presets, supported solvers and diagnostics, visualizations, module Tutor session, and glossary integration. This document reserves the route and platform boundaries only; it does not duplicate that Lab's design.

PDE Labs remain planned beyond those milestones.

## 27. Acceptance criteria

Platform Shell implementation is acceptable only when:

- `/` is the lightweight Numerical Analysis Lab homepage and all approved routes behave correctly.
- The existing product is available as Initial Value Problems Lab at `/ode/initial-value-problems` with its Method -> Data -> Output workflow and numerical behavior unchanged.
- Home and overview routes do not load the complete ODE implementation.
- Route loading, Retry, stale-load prevention, Not Found, titles, and Back/Forward behavior are tested.
- Meaningful ODE and Tutor work survives internal navigation in pure in-memory state, with accurate Resume and unload behavior.
- Complete Lab remounts use fresh DOM/runtime objects and the full disposal contract is verified.
- The shared Tutor Host appears only in the complete Lab and keeps module sessions isolated.
- Beginner Starter and New experiment use one authoritative builder.
- Navigation and Tutor layouts work on desktop, mobile, keyboard, and touch without viewport overflow.
- Components use semantic theme tokens without final fantasy branding.
- Direct nested-route requests work without breaking static assets or `/api/*`.
- Existing ODE, expression, preset, Convergence, Tutor, and numerical regression suites remain green.
- No excluded Lab, glossary, persistence system, framework, or product claim is introduced.

## 28. Approved-design self-review

This specification was reviewed against the approved brief. The review resolved the following risks in the document itself:

- It labels the shell as approved but not implemented and keeps the released ODE Version 1 as the current product.
- It distinguishes `/ode` as an overview from `/ode/initial-value-problems` as the complete Lab.
- It keeps the router domain-agnostic and prevents domain modules from importing it.
- It requires pure state remounting and explicitly rejects hidden DOM or custom-element caching.
- It separates Lab and Tutor sessions by module and prevents mobile Tutor auto-open on route changes.
- It defines memory-only persistence and contains no localStorage assumption.
- It gives unfinished modules roadmap actions only, with no fake runnable controls.
- It provides semantic theme readiness without committing final fantasy art, typography, or animation.
- It reserves future glossary and Linear Systems boundaries without duplicating their designs.
- It protects `/api/*` and static files before the SPA fallback and avoids an unverified `vercel.json` snippet.
- It defines cleanup, Retry, rejected-import handling, and navigation generations to prevent stale async mounts.
- It contains no unresolved placeholder markers and requires English-only product UI.

Repository-grounded implementation planning requires review and approval after this design; implementation has not started.
