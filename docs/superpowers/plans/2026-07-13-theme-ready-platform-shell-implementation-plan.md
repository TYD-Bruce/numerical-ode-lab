# Theme-Ready Platform Shell Implementation Plan

**Status:** Approved-design implementation plan

**Date:** 2026-07-13

**Authoritative design:** `docs/superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md`

**Approved design commits:** `bbd57920400de8a96dda5714e682f0b392c5324f`, `9a7c5334b0bce5d0d98949ba32ab3f0ab8f8bd6c`

## 1. Purpose and implementation posture

This plan converts the approved Theme-Ready Platform Shell design into a repository-grounded implementation sequence. It records the current lifecycle, pure-state boundary, route and Tutor ownership, deployment corrections, tests, verification gates, rollback points, and commit sequence.

The implementation is an adapter-and-lifecycle migration around the released Initial Value Problems application. It is not a broad rewrite of ODE internals, a numerical-method change, or a new product-design pass. The public platform entry is switched only after the ODE application can mount, snapshot, dispose, and remount behind the approved complete-Lab boundary and after the shared Tutor Host is independently reviewable.

## 2. Repository baseline

### 2.1 Build and deployment

- `index.html` contains one `#app` root and loads `/src/main.ts`.
- `package.json` uses Vite 5.4, TypeScript 5.4, Vitest 2.1.9, jsdom, Chart.js, MathLive, Compute Engine, and `@vercel/node`. No router or state-management dependency exists.
- The relevant scripts are `dev`, `dev:api`, `test`, `test:run`, `typecheck`, `typecheck:api`, `build`, `verify`, and `preview`.
- `vite.config.ts` currently sets `base: "./"` and proxies `/api` to the local API server.
- `vercel.json` currently declares only the Vite build command, `dist` output, and framework. It has no History API fallback.
- `api/chat.ts` is the production `/api/chat` function. `server/dev.ts` supplies the local mock/live API path. `api/chatHandler.ts` owns validation, the ODE prompt, mock behavior, and the OpenAI call. No browser API key is used.
- `tsconfig.json` is strict and no-emit for `src`; `tsconfig.api.json` covers `api` and `server`.

### 2.2 Verified baseline

Before this plan was recorded:

- 35 Vitest files passed;
- 705 tests passed;
- `npm.cmd run typecheck` passed;
- `npm.cmd run typecheck:api` passed; and
- the worktree was clean at `9a7c5334b0bce5d0d98949ba32ab3f0ab8f8bd6c`.

The full build was not rerun during planning because it would rewrite ignored `dist` output. Bundle evidence below comes from the existing production artifacts and must be re-recorded when implementation begins.

## 3. Current application lifecycle

### 3.1 Root execution and state

`src/main.ts` currently performs all of the following at module execution time:

1. statically imports and registers Chart.js controllers and plugins;
2. imports solvers, method catalog data, presets, expression support, Convergence Study support, and Tutor support;
3. creates module-global Method/Data/Output state;
4. finds `#app`; and
5. calls `render()` immediately.

The principal mutable symbols are:

- `step: Step`;
- `session: Session`;
- `selected: SelectedMethod | null`;
- `lastResult: SolverResult | null`;
- `lastResultExpression: SuccessfulExpressionSnapshot | null`;
- `lastCompare`;
- `persisted: PersistedForm`;
- `presetFormState: PresetFormState`;
- `lastProblemInputs: ProblemInputs | null`;
- `comparePickError`;
- `lastFirstOrderRunSnapshot: SuccessfulFirstOrderRunSnapshot | null`;
- `convergenceStates: Map<string, ConvergenceUiState>`;
- `chart: Chart | null`;
- `activeExpressionField`;
- `activeExactExpressionField`;
- `activeExpressionSummary`; and
- `activeConvergenceView`.

`src/aiTutorPanel.ts` separately owns `conversation: TutorMessage[]` as a module global.

### 3.2 Rendering and disposal

`render()` disposes the active expression and Convergence handles, clears `#app`, reconstructs the current step, and attaches element-local listeners. It does not destroy the primary Chart merely because the root is unmounted. Results finish mounting in a queued microtask without a route/navigation generation guard.

Existing useful lifecycle seams are:

- `disposeExpressionUi()` and `disposeConvergenceUi()` in `src/main.ts`;
- idempotent `EditableMathFieldHandle.dispose()` in `src/math/ui/editableMathField.ts`;
- connected-target and revision checks in `src/math/ui/readonlyMath.ts`;
- idempotent `ConvergenceStudyViewHandle.dispose()` and Chart replacement in `src/convergenceStudyView.ts`; and
- immutable successful expression and first-order run snapshots.

The current application registers no root-level `popstate`, delegated navigation, scroll-restoration, or `beforeunload` listeners. Element and MathLive listeners are owned by their mounted UI. The complete-Lab disposer must also destroy the primary Chart, hide the MathLive virtual keyboard, invalidate pending UI continuations, and remove any route/document/media-query listeners added during the migration.

### 3.3 Existing workflow behavior to preserve

- Method -> Data -> Output ordering and content remain unchanged.
- `goToMethodListKeepInputs()` keeps configured inputs while clearing output according to current behavior.
- Return to current output uses the successful result or first-order run snapshot and must survive a route unmount/remount.
- A failed Run does not replace the last successful result.
- A successful ordinary ODE Run currently resets the Tutor conversation. That reset behavior remains unchanged in this milestone.
- Route navigation and Tutor close/open do not clear the Tutor conversation after migration.
- New experiment alone uses the approved clear-or-preserve Tutor option.
- Compare Tutor-disabled behavior remains unchanged.
- Refresh currently loses all state; Version 1 remains intentionally in-memory only.

## 4. State-purity classification

### 4.1 Pure serializable-style data

The following values are already pure or can become pure with a small adapter:

- `Step`, `Session`, and `SelectedMethod`;
- `PersistedForm` values and expression draft/confirmed records;
- `PresetFormState`, preset identity, customization source, and undo snapshot;
- `MathAst`, `MathExpression`, `SuccessfulExpressionSnapshot`;
- `SolverResult`, `SeriesPoint[]`, and solver metadata;
- `ProblemInputs`;
- `SuccessfulFirstOrderRunSnapshot`;
- Convergence configuration, results, chart metric, drawer state, teaching accordions, and current/stale status; and
- comparison selections/results.

`ConvergenceUiState.previewFailure` and `lastAttemptError` currently hold `ConvergenceStudyFailure` `Error` instances. Replace those two stored values with a pure record:

```ts
interface ConvergenceFailureRecord {
  code: string;
  message: string;
  level?: number;
  stepSize?: number;
}
```

Thrown `ConvergenceStudyFailure` objects remain runtime-only and are converted at the state boundary.

### 4.2 Reconstructible runtime data

Do not store:

- evaluator closures returned from the expression compiler;
- method-catalog lookups;
- Chart.js configurations;
- readonly-math/custom-element render state; or
- derived Tutor context DTOs.

Compile evaluators from confirmed canonical AST immediately before computation. Resolve method metadata from the stored method selection. Build Tutor context on every message from the current successful snapshot and current Convergence state.

### 4.3 Runtime handles prohibited from AppSessionStore

The store must never contain:

- DOM nodes or custom elements;
- `MathfieldElement`, static MathLive elements, or virtual-keyboard references;
- Chart instances or canvas contexts;
- expression/error-summary/Convergence view handles;
- functions, listeners, subscriptions, or mounted route handles;
- `AbortController` or `AbortSignal`; or
- Tutor panel DOM or pending request state.

### 4.4 Solver result ownership

Full `SolverResult.points` arrays remain acceptable in pure in-memory session data. The current product already retains them, and Tutor sampling needs the successful result. After integration, convert the raw result once into a deeply readonly store-owned result by copying/freezing point records and mutable metadata arrays. UI, Tutor binding, Resume calculation, and session state share that immutable snapshot. `getSession()` must not deep-clone a large result during every route transition.

## 5. Proposed source map and ownership

```text
src/main.ts                         thin bootstrap; compatibility first, platform later

src/app/contracts.ts               route/Lab/Tutor shared type-only contracts
src/app/router.ts                  History API, navigation generation, focus/scroll order
src/app/routeDefinitions.ts        exact paths, titles, route loaders
src/app/routeLoader.ts             cached load/prefetch/retry state
src/app/moduleRegistry.ts          opaque complete-Lab registrations
src/app/appShell.ts                header, navigation, outlet, mobile menu
src/app/appSessionStore.ts         pure in-memory Lab/Tutor/route metadata
src/app/platformTutorHost.ts       Tutor placement and responsive presentation
src/app/scrollRestoration.ts       document and namespaced-history scroll lifecycle
src/app/theme.css                  semantic token definitions
src/app/platform.css               shell and platform-page component rules

src/pages/pageContracts.ts
src/pages/homePage.ts
src/pages/odeOverviewPage.ts
src/pages/linearAlgebraOverviewPage.ts
src/pages/pdeOverviewPage.ts
src/pages/aboutPage.ts
src/pages/notFoundPage.ts

src/ode/odeSession.ts              pure OdeSessionState and starter/identity selectors
src/ode/odeApp.ts                  extracted current Method/Data/Output renderer
src/ode/initialValueProblemsRoute.ts
src/ode/odeTutorBinding.ts         Lab-owned binding and fresh context

src/tutor/moduleTutorSession.ts    pure transcript/divider operations
src/tutor/platformTutorPanel.ts    complete first-open Tutor implementation
src/tutor/tutorClient.ts           fetch, sanitization, chart-instruction guards
```

Existing numerical, expression, and Convergence files remain in their current locations. `src/aiTutor.ts`, `src/aiTutorPanel.ts`, and their tests are migrated by responsibility during Phase 4A; unrelated files are not moved merely to create directory symmetry.

Dependency direction is fixed:

```text
platform bootstrap
  -> router, shell, store, lightweight pages, module registry
  -> dynamic complete-Lab route
  -> ODE UI, numerical code, Chart.js, Convergence, Lab-owned Tutor binding
  -> dynamic complete Tutor panel on first open
  -> existing inner MathLive/Compute Engine dynamic boundaries
```

The router does not import ODE types. The shell does not construct ODE grounding. The Tutor Host does not own Tutor messages. Hidden complete-Lab DOM is never retained.

## 6. Shared contracts

### 6.1 Route contracts

```ts
interface MountedRoute {
  ready?: Promise<void>;
  dispose(): void;
}

interface RouteModule {
  mount(options: {
    target: HTMLElement;
    navigate: Navigate;
  }): MountedRoute;
}

interface NavigateOptions {
  replace?: boolean;
  scroll?: "auto" | "top" | "preserve";
}

type Navigate = (
  path: string,
  options?: NavigateOptions
) => Promise<void>;
```

Every route definition contains an exact normalized pathname, route ID, title, route kind, and loader. Matching uses `pathname`; query and hash are preserved in the URL. A pushed hash target may override normal top positioning after mount, while `popstate` entry scroll has priority during Back/Forward.

### 6.2 Complete-Lab contracts

```ts
interface MountedLabRoute<TSession> {
  getSession(): TSession;
  getResumeSummary(): ResumeSummary | undefined;
  getTutorBinding(): LabTutorBinding<unknown>;
  dispose(): void;
}

interface LabLifecycleCallbacks<TSession> {
  updateSession(
    session: TSession,
    metadata: LabSessionMetadata
  ): void;
  recordMeaningfulInteraction(at: number): void;
  applyConfirmedReset(request: ConfirmedLabReset<TSession>): void;
}

interface LabRouteModule<TSession> {
  createBeginnerStarterSession(): TSession;
  mount(options: {
    target: HTMLElement;
    session: TSession;
    navigate: (path: string) => void;
    lifecycle: LabLifecycleCallbacks<TSession>;
  }): MountedLabRoute<TSession>;
}
```

`LabLifecycleCallbacks` is domain-neutral. It never carries a shell-created Tutor binding or numerical types. The ODE Lab creates its binding and returns it from `getTutorBinding()`.

Scroll does not belong on the mounted handle. The inspected application scrolls the document viewport, so the router and store own numeric scroll state.

### 6.3 Tutor contracts

```ts
interface LabTutorBinding<TContext> {
  moduleId: LabModuleId;
  promptProfile: TutorPromptProfile;
  suggestedQuestions: readonly string[];
  getContext(): TContext | undefined;
  prepareForOpen?(): void;
}

interface TutorSessionAccess {
  moduleId: LabModuleId;
  getSession(): ModuleTutorSession;
  updateSession(
    update: (current: ModuleTutorSession) => ModuleTutorSession
  ): void;
}

interface PlatformTutorHost {
  connect(
    binding: LabTutorBinding<unknown>,
    sessionAccess: TutorSessionAccess
  ): void;
  disconnect(): void;
  open(trigger: HTMLElement): Promise<void>;
  close(options?: { restoreFocus?: boolean }): void;
  closeMobileForNavigation(): void;
  dispose(): void;
}
```

`TutorSessionAccess` is a live store adapter. The Host may retain the adapter while connected, but every read and write goes through `getSession()` or `updateSession()`. It never retains a one-time `ModuleTutorSession` snapshot. Disconnect invalidates the binding/session-access generation before pending work can commit.

Ownership remains:

```text
Lab -> owns and supplies LabTutorBinding
AppSessionStore -> owns pure ModuleTutorSession
Platform Tutor Host -> owns placement and presentation
```

## 7. Router and route-loader implementation

### 7.1 Router API

```ts
interface PlatformRouter {
  start(): void;
  navigate(path: string, options?: NavigateOptions): Promise<void>;
  prefetch(routeId: RouteId): void;
  retry(): Promise<void>;
  dispose(): void;
}
```

The exact routes and titles are:

| Path | Route ID | Title |
|---|---|---|
| `/` | `home` | `Numerical Analysis Lab` |
| `/ode` | `ode-overview` | `Numerical ODE | Numerical Analysis Lab` |
| `/ode/initial-value-problems` | `ode-initial-value-problems` | `Initial Value Problems Lab | Numerical Analysis Lab` |
| `/linear-algebra` | `linear-algebra-overview` | `Numerical Linear Algebra | Numerical Analysis Lab` |
| `/pde` | `pde-overview` | `Numerical PDE | Numerical Analysis Lab` |
| `/about` | `about` | `About | Numerical Analysis Lab` |
| other non-file path | `not-found` | `Page Not Found | Numerical Analysis Lab` |

Rules:

- Normalize trailing slashes with `replaceState`, except `/`, while retaining query/hash and unrelated history fields.
- `navigate()` accepts same-origin application paths only.
- Intercept only primary-button, unmodified, same-origin anchors without `download` and without a non-`_self` target.
- Preserve native behavior for modified, external, download, and targeted links.
- `popstate` does not push another entry.
- Exact routes may use `aria-current="page"`.
- On `/ode/initial-value-problems`, the `/ode` primary-navigation item uses the module-active visual state and `aria-current="location"`, never `aria-current="page"`. Future module subroutes follow the same rule.
- Not Found inserts the requested pathname with `textContent`.
- Successful internal navigation closes the mobile menu.
- Loading stays inside the persistent shell and does not repeatedly steal focus.
- Failure preserves Lab/Tutor sessions and presents a keyboard-accessible Retry action.

### 7.2 Cached loaders and prefetch

`routeLoader.ts` stores one attempt record per route:

```ts
type LoaderAttempt<T> =
  | { status: "idle" }
  | { status: "pending"; promise: Promise<T> }
  | { status: "fulfilled"; promise: Promise<T>; value: T }
  | { status: "rejected"; promise: Promise<T>; error: unknown };
```

Hover and keyboard focus on the Home ODE card, Home Open Lab action, ODE overview Lab card, and any direct complete-Lab link call the same cached loader used by navigation. Hover exit does not cancel it. Prefetch catches rejection silently but leaves the attempt marked rejected. Navigation observes that rejection normally. Retry evicts the rejected attempt before creating a new import promise. No idle, touch-specific, incomplete-module, or MathLive prefetch is added.

### 7.3 Navigation generation

The router owns a monotonically increasing `navigationGeneration`.

1. Increment at the start of navigation or Retry.
2. Capture the generation before route loading, awaiting `ready`, focus scheduling, hash handling, and scroll scheduling.
3. Check after every `await`, microtask, and animation frame.
4. A stale loader result may enter the JavaScript module cache but is not mounted.
5. If a locally created mount becomes stale, dispose only that local mount.
6. Never let stale work read, focus, scroll, replace, or dispose `currentMountedRoute`.
7. Prefetch and navigation promises always receive rejection handlers; no rejected import becomes an unhandled rejection.
8. Route disposal invalidates ODE-local UI generations so queued results, editable-field loading, Tutor loading, and request completion cannot target removed DOM.

The required race test starts Route A, completes Route B, resolves A last, and proves that A cannot mount, focus, scroll, or dispose B.

## 8. AppSessionStore

### 8.1 Initial state

```ts
{
  labs: {},
  tutors: {
    ode: { items: [], draftMessage: "", desktopOpen: false },
    linear_algebra: { items: [], draftMessage: "", desktopOpen: false },
    pde: { items: [], draftMessage: "", desktopOpen: false }
  },
  routeSessions: {}
}
```

The ODE Lab session is absent on Home. Importing the starter builder to initialize it eagerly would pull ODE code into the shell. On first complete-Lab entry, the dynamically loaded ODE module creates the authoritative starter and stores it.

### 8.2 Store API

```ts
interface AppSessionStore {
  getLab<T>(moduleId: LabModuleId): T | undefined;
  setLab<T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ): void;

  getTutor(moduleId: LabModuleId): ModuleTutorSession;
  updateTutor(
    moduleId: LabModuleId,
    update: (current: ModuleTutorSession) => ModuleTutorSession
  ): void;
  createTutorSessionAccess(moduleId: LabModuleId): TutorSessionAccess;

  getRouteSession(routeId: RouteId): RouteSessionMetadata | undefined;
  updateRouteSession(
    routeId: RouteId,
    update: RouteSessionMetadata
  ): void;

  resetLab<T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ): void;
  hasMeaningfulWork(): boolean;
  getResumeSummaries(limit?: number): readonly ResumeSummary[];
  subscribe(listener: () => void): () => void;
}
```

`LabSessionMetadata` contains maintained `meaningful`, safe `resumeSummary`, and `lastMeaningfulInteraction` values. Store updates use immutable replacement. Large already-immutable numerical snapshots may be shared.

Add a development/test structural assertion at the store boundary that rejects functions, cycles, DOM nodes, `EventTarget`, custom elements, `AbortController`, mounted handles, and Chart-like objects. `createAppSessionStore()` produces isolated stores for tests. No browser persistence or state dependency is added.

## 9. OdeSessionState and compatibility adapter

```ts
interface OdeSessionState {
  version: 1;
  step: "choose" | "configure" | "results";
  workflow: OdeWorkflowSession;
  selectedMethod: SelectedMethod | null;
  form: PresetFormState;
  comparePickError: string;
  output: {
    single?: {
      result: ReadonlySolverResult;
      expression: SuccessfulExpressionSnapshot;
      firstOrderRun?: SuccessfulFirstOrderRunSnapshot;
      problemInputs: ProblemInputs;
    };
    comparison?: {
      a: SelectedMethod;
      b: SelectedMethod;
      resultA: ReadonlySolverResult;
      resultB: ReadonlySolverResult;
      expression: SuccessfulExpressionSnapshot;
    };
  };
  convergenceByFingerprint: Readonly<
    Record<string, PureConvergenceUiState>
  >;
}
```

Use `PresetFormState` as the tracked form authority and supply compatibility selectors for the current `persisted` field names during extraction. Do not run a second independent form store long term.

The mounted Lab keeps the store current during core edits and meaningful actions through `lifecycle.updateSession()` and `recordMeaningfulInteraction()`. MathLive input callbacks already produce pure draft/confirmed snapshots; update the current pure session from those callbacks rather than querying DOM during unload. Numeric input, method/order, exact-solution, preset, step, successful Run, successful analysis, and user Tutor actions update maintained session/metadata at their existing event points.

Normal internal route disposal still calls `getSession()` once to capture the final synchronous form/session snapshot before unmount. This final snapshot is part of normal navigation, not the unload handler.

## 10. Compatibility-bootstrap strategy

Avoid one commit that simultaneously rewrites root ownership and changes the public URL.

1. Extract `src/ode/odeApp.ts` and `initialValueProblemsRoute.ts` while keeping the current Method/Data/Output behavior.
2. Replace `src/main.ts` temporarily with a thin compatibility bootstrap that eagerly imports the extracted ODE module and mounts it into `#app` at the current root.
3. Run all released ODE, expression, preset, Convergence, and Tutor regressions in that compatibility state.
4. Implement and review the Tutor Host while the compatibility bootstrap remains the production entry.
5. Only in Phase 4B replace the compatibility bootstrap with the platform bootstrap and expose the complete Lab at `/ode/initial-value-problems`.

This gives the extraction and Tutor migration independent review/rollback points while avoiding a half-migrated public platform.

## 11. Tutor migration and Host lifecycle

### 11.1 Pure module session

```ts
type TutorTranscriptItem =
  | {
      kind: "message";
      role: "user" | "assistant";
      content: string;
    }
  | {
      kind: "divider";
      id: string;
      title: "New experiment started";
      body: string;
    };

interface ModuleTutorSession {
  items: readonly TutorTranscriptItem[];
  draftMessage: string;
  desktopOpen: boolean;
}
```

Pending/loading/error/demo-badge state, mobile presentation, focus targets, and request controllers remain transient. Suggested questions are binding configuration, not session state. Divider items render as non-editable presentation data and are filtered out when building API `messages`.

### 11.2 First-open boundary

`platformTutorHost.ts` remains lightweight. `open()` calls the Lab binding's optional `prepareForOpen()` and dynamically imports `src/tutor/platformTutorPanel.ts`. The panel owns rendering, networking, prompt-profile dispatch, controlled Tutor math, and chart-instruction handling. The ODE binding owns fresh ODE context and suggested questions.

The current mixed `src/aiTutor.ts` responsibilities should be separated conservatively during Phase 4A so a binding import cannot accidentally pull the complete panel/networking implementation into the ODE route or shell. ODE context construction stays in `src/ode/odeTutorBinding.ts`; generic fetch/sanitize/chart guards move behind the dynamic Tutor panel in `src/tutor/tutorClient.ts`.

### 11.3 Store-aware Host

On connection, the shell supplies the mounted Lab's binding and `store.createTutorSessionAccess(binding.moduleId)`. The Host reads the current session before every render/send/clear/draft update and commits through the updater. It does not cache a `ModuleTutorSession` value.

Connection state is tagged with a monotonically increasing Host generation and the module ID. `disconnect()` increments the generation, aborts the active request, removes transient UI, and drops binding/session access without clearing store data.

### 11.4 Request cancellation and stale completion

- Extend `sendChatMessage`/the Tutor client to accept an `AbortSignal`.
- Store the user message through `TutorSessionAccess` before starting the request.
- Capture Host generation, request generation, module ID, and binding identity.
- On route disconnect, new send, or Host disposal, abort the owned controller and advance the request generation.
- After network completion, verify all captured identities before adding the assistant message or applying a chart instruction.
- Aborted or stale completions do not mutate another module, a newer request, or detached DOM.
- Mock/live handling remains server-controlled and unchanged.

### 11.5 Reset semantics

- An ordinary successful ODE Run preserves the current product behavior by clearing the ODE module Tutor conversation/draft through its store session operation.
- Internal route navigation preserves the Tutor session.
- Closing or collapsing Tutor preserves the Tutor session.
- New experiment uses its separate checked-by-default clear option; unchecked preservation appends the typed divider.
- No other module's Tutor session is changed by an ODE Run or reset.

### 11.6 Responsive presentation

Desktop uses a collapsible grid column so Lab content resizes rather than being covered. Open/close snapshots document scroll and restores the module's `desktopOpen` preference.

Mobile uses a modal bottom sheet or near-full-screen panel with an explicit close control, independent message scrolling, viewport-aware height, focus containment, and input controls visible above the system keyboard. `prepareForOpen()` hides the MathLive virtual keyboard. The background becomes inert/non-scrolling. Route change closes mobile presentation before route capture; the destination never auto-opens.

## 12. Beginner Starter and experiment identity

Expose a pure helper from `src/problemPresets.ts` equivalent to `createPresetFormStateFromPreset(id)`, reusing the existing private `fieldsFromPreset()` conversion.

`createBeginnerStarterSession()`:

- loads the existing `exponential_decay` preset;
- selects Forward Euler;
- starts at Method;
- uses `t0 = 0`, `y0 = 1`, `tEnd = 5`, `h = 0.2`;
- uses RHS `-y`;
- enables exact solution `e^(-t)`; and
- contains no result, analysis, comparison, or error state.

No starter numerical/expression constants are duplicated outside the preset.

Starter versus Custom is derived by comparing current core state with a fresh starter's core state:

- method/order;
- RHS draft and confirmed expression;
- `t0`, `y0`, `tEnd`, and `h` drafts;
- exact enabled/draft/confirmed state; and
- preset identity.

Tutor visibility, Convergence metric, teaching accordions, scroll, mobile menu, and remount do not affect identity. After successful Run, derive the approved compact status from the same identity plus output existence.

## 13. New experiment

The ODE route owns the confirmation UI. The checked-by-default option is “Also clear this module's Tutor conversation.”

On confirmation:

1. ODE calls `createBeginnerStarterSession()`.
2. It passes the new pure session and clear/preserve choice to the platform lifecycle callback.
3. The store replaces only `labs.ode` and resets its maintained meaningful/Resume metadata.
4. If checked, the store clears ODE Tutor items/draft while preserving `desktopOpen`.
5. If unchecked, it preserves Tutor items/draft and appends the typed divider.
6. The router scroll service cancels pending restoration and sets visible document scroll to zero.
7. It sets the ODE per-Lab saved scroll to zero.
8. It merges `scrollY: 0` into the namespaced current history-entry state.
9. ODE renders or remounts the new starter at Method.

Other Lab and Tutor sessions are untouched. Cancel mutates nothing. A pristine starter and a divider without a user message are not meaningful. A later remount or Back/Forward restoration for the reset entry cannot recover the old experiment's scroll.

## 14. Meaningful work, Resume, and unload

### 14.1 Meaningful work

ODE work is meaningful when any of these holds:

- core state differs from Beginner Starter;
- a core draft differs from the last successful snapshot;
- the step is beyond Method;
- a successful result exists;
- a successful Convergence analysis exists; or
- the ODE Tutor session contains a user message.

Merely opening the Lab/Tutor, changing a chart metric, opening an accordion, scrolling, using the mobile menu, selecting Resume, or passively remounting is not meaningful.

The mounted Lab updates pure session or maintained `LabSessionMetadata.meaningful` at each core edit and meaningful action. Tutor session updates maintain the Tutor-derived meaningful flag. `lastMeaningfulInteraction` updates for core edit, step advance, successful Run, successful analysis, retained prior Tutor work during New experiment, or user Tutor message. Presentation actions do not reorder Resume cards.

### 14.2 Resume summary

```ts
interface ResumeSummary {
  moduleId: LabModuleId;
  route: string;
  labTitle: string;
  stepLabel: "Method" | "Data" | "Output";
  methodLabel?: string;
  analysisLabel?: "Analysis available" | "Analysis stale";
  lastMeaningfulInteraction: number;
}
```

It contains no equation, numerical input, point array, or Tutor text. Home returns at most one card per module, sorts by maintained meaningful activity, and renders at most three. Refresh creates a fresh store, so no card remains.

### 14.3 Minimal beforeunload

The shell registers exactly one listener:

```ts
function handleBeforeUnload(event: BeforeUnloadEvent): void {
  if (store.hasMeaningfulWork()) {
    event.preventDefault();
    event.returnValue = "";
  }
}
```

The handler only reads already maintained store metadata. It must not query MathLive, walk DOM, reconstruct `OdeSessionState`, call a mounted Lab's `getSession()`, deep-clone data, or perform asynchronous work. Internal History API navigation does not invoke it. Shell disposal removes the listener for tests/HMR. Browser-defined confirmation text is not customized.

## 15. Scroll and namespaced history state

The inspected application scrolls the document viewport. Read from `document.scrollingElement?.scrollTop`, falling back to `window.scrollY`, and restore with `window.scrollTo`.

The router sets `history.scrollRestoration = "manual"` while active and restores the prior setting on disposal.

Platform history metadata is namespaced:

```ts
interface NumericalAnalysisLabHistoryState {
  entryId: string;
  scrollY: number;
}

interface PlatformHistoryEnvelope {
  numericalAnalysisLab: NumericalAnalysisLabHistoryState;
}
```

Every `pushState` and `replaceState` uses a helper that shallow-copies existing object fields and replaces only `numericalAnalysisLab`. It also preserves future sibling fields inside that namespace when updating one property. The router never replaces all of `history.state` with a scroll-only object.

Lifecycle:

1. Before disposal, read actual document scroll.
2. Merge it into the current entry's `history.state.numericalAnalysisLab`.
3. If leaving a complete Lab, update its per-Lab route metadata.
4. Push overview/About/Not Found entries with namespaced zero scroll while preserving unrelated current fields.
5. First Lab entry starts at zero.
6. Normal platform re-entry/Resume uses per-Lab saved scroll.
7. `popstate` prefers the destination entry's namespaced scroll.
8. After route readiness, focus the heading with `{ preventScroll: true }`.
9. Restore in generation-guarded animation frames after layout is ready.
10. A stale generation cannot focus or scroll.

Tutor mobile open snapshots document scroll before body locking. Close unlocks and restores it. New experiment cancels pending restoration and zeros visible, per-Lab, and namespaced current-entry values while preserving all unrelated history fields.

## 16. Home, overview, About, and Not Found pages

- `homePage.ts`: Numerical Analysis Lab identity, Understand -> Compute -> Visualize -> Analyze, truthful module cards, Recommended Learning Path, and safe Resume cards.
- `odeOverviewPage.ts`: available Initial Value Problems Lab, planned ODE roadmap, and domain connections.
- `linearAlgebraOverviewPage.ts`: In development, Linear Systems first, Least Squares/SVD/Eigenvalues future, and no controls.
- `pdeOverviewPage.ts`: Planned, Heat/Wave/Poisson future, finite-difference/stability/refinement context, and no controls.
- `aboutPage.ts`: current implemented ODE scope versus planned platform scope.
- `notFoundPage.ts`: safe requested pathname plus Home and IVP links.

No route in this section mounts Tutor or imports the complete ODE, Tutor, Chart.js, Convergence, MathLive, or Compute Engine implementations. Only complete-Lab links prefetch the ODE route.

## 17. Theme-token migration

Create `src/app/theme.css` with the current neutral dark palette centralized under semantic names:

```css
--color-page-background: #0b1020;
--color-surface-primary: #121a33;
--color-surface-raised: #171f3a;
--color-surface-inset: #0f152b;
--color-text-primary: #e9eefc;
--color-text-secondary: #9fb2df;
--color-accent-primary: #6c8cff;
--color-accent-primary-strong: #4d63d8;
--color-accent-secondary: #7ae2a8;
--color-border: rgba(255, 255, 255, 0.12);
--color-focus-ring: #7ea1ff;
--color-success: #7ae2a8;
--color-caution: #ffd18b;
--color-danger: #ff8b8b;
--shadow-card: 0 1rem 2.5rem rgba(0, 0, 0, 0.2);
--texture-decorative: none;
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--radius-lg: 1rem;
--radius-pill: 999px;
--content-width-platform: 77.5rem;
--content-width-reading: 72ch;
```

Migration order:

1. define tokens and temporary aliases for current root variables;
2. implement shell/pages using semantic tokens only;
3. replace repeated ODE color literals without changing layout or hierarchy;
4. align editable-field and focus colors;
5. resolve Chart.js semantic colors through `getComputedStyle(document.documentElement)`; and
6. remove temporary aliases after searches/tests are clean.

Status badges retain text labels. Focus is visible and not color-only. Preserve `color-scheme: dark`. No theme switch, artwork, texture, or fantasy skin is implemented.

## 18. Vite and Vercel deployment decisions

### 18.1 Vite base

Current `base: "./"` emits `./assets/...`. At `/ode/initial-value-problems`, the browser resolves that to `/ode/assets/...`, so direct nested entry fails.

Change the implementation to:

```ts
base: "/"
```

This root-origin deployment keeps local dev, `vite preview`, emitted dynamic imports, CSS/font assets, and Vercel asset URLs rooted at `/`. The existing absolute `/api/chat` request remains correct.

### 18.2 Vercel fallback

The verified minimal target is:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Vercel's documented rewrite behavior checks filesystem routes first. Therefore `api/chat.ts`, built JavaScript/CSS/fonts, and other files resolve before the SPA fallback. Known and unknown non-file page paths reach `index.html`, and the client router renders either the matching page or in-shell Not Found.

Contract tests must verify the configuration shape and built asset URLs. `vite preview` cannot prove Vercel function/filesystem precedence, so a deployed preview smoke test must verify `/api/chat`, an emitted asset, a nested direct refresh, and an unknown page route.

## 19. Implementation phases

Each phase begins with the listed tests. Focused tests and TypeScript checks pass before its commit. The public platform switch occurs only in Phase 4B.

### Phase 0 — Routing, deployment, and import spike

**Tests/evidence first**

- Capture current `dist` asset names/sizes.
- Produce a temporary Vite build with root base and manifest output.
- Inspect manifest entry, imports, and dynamic imports.
- Validate the Vercel rewrite structurally against the approved contract.

**Work**

- Verify `base: "/"` without merging the public platform.
- Verify route and Tutor dynamic-import boundaries in a spike.
- Remove temporary output after recording results.

**Commands**

```text
npm.cmd run typecheck
npm.cmd exec -- vite build --base / --manifest --outDir "$env:TEMP\numerical-ode-lab-platform-shell-spike"
```

**Completion**

- Root assets work from a nested pathname.
- Manifest proves the proposed dynamic edges are possible.
- Vercel fallback/API/static precedence is recorded.

**Commit:** none.

**Rollback:** remove temporary build output; production remains unchanged.

### Phase 1 — Router, shell, static pages, and tokens

**Tests written first**

- `src/app/router.test.ts`
- `src/app/routeLoader.test.ts`
- `src/app/appShell.test.ts`
- `src/app/navigationAccessibility.test.ts`
- `src/pages/pages.test.ts`
- `src/app/themeTokens.test.ts`

Cover exact matching, trailing slash, query/hash preservation, push/replace/popstate, unrelated history-state preservation, titles, active states, parent `aria-current="location"`, semantic link interception, loading/failure/Retry, stale A/B loading, mobile menu, safe Not Found, and semantic token enforcement.

**Implementation files**

- `src/app/contracts.ts`
- `src/app/router.ts`
- `src/app/routeDefinitions.ts`
- `src/app/routeLoader.ts`
- `src/app/moduleRegistry.ts`
- `src/app/appShell.ts`
- `src/app/theme.css`
- `src/app/platform.css`
- `src/pages/*Page.ts`

The new shell remains independently tested; the released root still boots ODE.

**Verification**

```text
npm.cmd run test:run -- src/app/router.test.ts src/app/routeLoader.test.ts src/app/appShell.test.ts src/app/navigationAccessibility.test.ts src/pages/pages.test.ts src/app/themeTokens.test.ts
npm.cmd run typecheck
```

**Manual checks:** keyboard navigation, mobile menu, focus visibility, status text, narrow/wide static layouts.

**Completion:** all static platform behavior works in isolation with no ODE/Tutor runtime import.

**Commit:** `Build platform router and static shell`

**Rollback:** revert this unused shell commit; released ODE entry is unaffected.

### Phase 2 — AppSessionStore and pure ODE session

**Tests written first**

- `src/app/appSessionStore.test.ts`
- `src/ode/odeSession.test.ts`
- `src/ode/beginnerStarter.test.ts`
- additional pure-failure cases in `src/convergenceStudyState.test.ts`

Cover store isolation, immutable updates, runtime-object rejection, Lab/Tutor separation, maintained meaningful metadata, safe Resume DTOs, full session round-trip, authoritative starter values, starter/custom identity, successful snapshots/results, Convergence restoration, and non-meaningful presentation changes.

**Implementation files**

- `src/app/appSessionStore.ts`
- `src/ode/odeSession.ts`
- small pure helpers in `src/problemPresets.ts`
- pure failure records in `src/convergenceStudyState.ts`

**Verification**

```text
npm.cmd run test:run -- src/app/appSessionStore.test.ts src/ode/odeSession.test.ts src/ode/beginnerStarter.test.ts src/convergenceStudyState.test.ts
npm.cmd run typecheck
npm.cmd run test:run -- src/solvers.test.ts src/problemPresets.test.ts src/exactSolution.test.ts
```

**Manual checks:** none beyond inspecting that store values are pure and readable.

**Completion:** a complete ODE session can be reconstructed without DOM/runtime handles.

**Commit:** `Add platform and ODE session models`

**Rollback:** compatibility selectors let current UI continue using existing field names.

### Phase 3 — ODE route extraction and lazy mounting

**Tests written first**

- `src/ode/initialValueProblemsRoute.test.ts`
- `src/ode/odeLifecycle.test.ts`
- behavior-based replacement for `src/mainConvergenceIntegration.test.ts`

Cover mount from starter/saved session, session updates on core edits, final synchronous snapshot, Return to current output, fresh remount, primary/Convergence Chart cleanup, expression cleanup, keyboard hide, listener non-duplication, idempotent dispose, and stale child-load invalidation.

**Implementation files**

- `src/ode/odeApp.ts`
- `src/ode/initialValueProblemsRoute.ts`
- temporary compatibility bootstrap in `src/main.ts`

**Verification**

```text
npm.cmd run test:run -- src/ode/initialValueProblemsRoute.test.ts src/ode/odeLifecycle.test.ts
npm.cmd run test:run -- src/solvers.test.ts src/convergenceStudy.test.ts src/convergenceStudyView.test.ts src/math/ui/editableMathField.test.ts
npm.cmd run typecheck
```

**Manual checks:** released root Method/Data/Output, Run, comparison, Return to output, Convergence, expressions, and repeated mount/dispose.

**Completion:** current ODE behavior runs through a mountable/disposable route while the public URL remains unchanged.

**Commit:** `Extract the Initial Value Problems Lab route`

**Rollback:** revert the compatibility bootstrap/extraction commit.

### Phase 4A — Tutor Host migration

**Tests written first**

- `src/tutor/moduleTutorSession.test.ts`
- `src/app/platformTutorHost.test.ts`
- `src/ode/odeTutorBinding.test.ts`
- `src/app/tutorLazyBoundary.test.ts`
- expanded `src/aiTutorPanel.test.ts`/replacement panel tests

Cover per-module items/drafts/preferences, store-aware `TutorSessionAccess`, no stale snapshot reads/writes, Lab-owned binding, fresh context per message, ordinary Run reset, navigation preservation, close preservation, divider filtering, first-open import, abort/generation protection, wrong-module prevention, Compare-disabled behavior, desktop resizing, mobile close/inert/scroll, and keyboard hide before open.

**Implementation files**

- `src/app/platformTutorHost.ts`
- `src/tutor/moduleTutorSession.ts`
- `src/tutor/platformTutorPanel.ts`
- `src/tutor/tutorClient.ts`
- `src/ode/odeTutorBinding.ts`
- focused migration of `src/aiTutor.ts`, `src/aiTutorPanel.ts`, and `src/aiTypes.ts`

The compatibility ODE bootstrap remains the production entry. No public route switch occurs.

**Verification**

```text
npm.cmd run test:run -- src/tutor/moduleTutorSession.test.ts src/app/platformTutorHost.test.ts src/ode/odeTutorBinding.test.ts src/app/tutorLazyBoundary.test.ts
npm.cmd run test:run -- src/aiTutor.test.ts src/aiTutorPanel.test.ts api/chatHandler.test.ts api/chatPrompt.test.ts
npm.cmd run typecheck
npm.cmd run typecheck:api
```

**Manual checks:** mock/live send, abort on disconnect, repeated open/close, desktop resize, mobile keyboard/focus/scroll, and unchanged chart instructions.

**Completion:** shared Host and pure sessions work without changing the public route entry.

**Commit:** `Add the shared platform Tutor host`

**Rollback:** revert Host migration while retaining mountable ODE extraction.

### Phase 4B — Atomic platform entry switch

**Tests written first**

- `src/app/platformBootstrap.test.ts`
- expanded `src/app/tutorLazyBoundary.test.ts`
- `src/app/routeBundleOwnership.test.ts`

Cover direct platform boot, exact public routes, ODE only at the nested route, Home/overview no Tutor Host, Lab binding consumption, loading/failure preservation, and static-versus-dynamic import boundaries.

**Implementation files**

- switch `src/main.ts` to the platform bootstrap;
- connect route definitions, module registry, store, shell, and Host; and
- remove the temporary root ODE compatibility behavior.

**Verification**

```text
npm.cmd run test:run -- src/app/platformBootstrap.test.ts src/app/routeBundleOwnership.test.ts src/app/tutorLazyBoundary.test.ts
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd exec -- vite build --manifest
```

Inspect the Vite manifest/chunk graph before any marker searches. Then record initial and async chunk sizes and verify in the browser Network panel.

**Manual checks:** Home, each overview, About, Not Found, ODE nested entry, released ODE workflow, Tutor, loading/failure, and hover/focus prefetch.

**Completion:** the approved platform is the public entry and all released regressions pass.

**Commit:** `Mount the ODE Lab in the platform shell`

**Rollback:** revert only the entry switch; Phase 4A remains reviewable.

### Phase 5A — Resume and meaningful work

**Tests written first**

- `src/app/meaningfulWork.test.ts`
- `src/pages/homeResume.test.ts`
- `src/app/beforeUnload.test.ts`

Cover every meaningful/non-meaningful condition, maintained updates during core edits, safe summaries, one card/module, three-card limit, activity order, no card for pristine starter/refresh, Tutor-only work, minimal unload behavior, and no mounted-Lab/DOM work from unload.

**Implementation files**

- meaningful metadata updates in store/ODE/Tutor actions;
- Home Resume rendering; and
- one shell `beforeunload` listener.

**Verification**

```text
npm.cmd run test:run -- src/app/meaningfulWork.test.ts src/pages/homeResume.test.ts src/app/beforeUnload.test.ts
npm.cmd run typecheck
```

**Manual checks:** pristine visit, edited draft, successful result, Tutor-only work, internal navigation, refresh warning, and refresh clearing.

**Completion:** maintained metadata alone drives Resume and unload.

**Commit:** `Add platform resume and meaningful work`

**Rollback:** revert Resume/unload wiring without changing stored Lab sessions.

### Phase 5B — Scroll, history, and New experiment

**Tests written first**

- `src/app/scrollRestoration.test.ts`
- `src/ode/newExperiment.test.ts`
- expanded router history tests

Cover namespaced history merge, unrelated-field preservation for push/replace, capture before disposal, first-entry top, overview top, per-Lab Resume, popstate priority, focus-before-scroll, stale restoration rejection, Tutor scroll preservation, confirmation cancel, checked clear, unchecked divider, fresh context, other-module isolation, and New experiment triple zero with no old remount restoration.

**Implementation files**

- `src/app/scrollRestoration.ts`
- router integration;
- ODE confirmation/reset UI; and
- store/Tutor reset operations.

**Verification**

```text
npm.cmd run test:run -- src/app/scrollRestoration.test.ts src/ode/newExperiment.test.ts src/app/router.test.ts
npm.cmd run typecheck
```

**Manual checks:** long-page desktop/mobile Back/Forward, Resume, Tutor open/close, checked/unchecked reset, cancelled reset, and remount after reset.

**Completion:** route, Lab, Tutor, scroll, and history lifecycle matches the approved design.

**Commit:** `Add Lab scroll and reset lifecycle`

**Rollback:** revert the isolated scroll/reset service commit.

### Phase 6 — Deployment, documentation, and release review

**Tests written first**

- `src/app/viteBase.contract.test.ts`
- `src/app/vercelRouting.contract.test.ts`
- final bundle ownership assertions

Cover `base: "/"`, root asset URLs, the verified SPA rewrite, API/static protection, nested and unknown page behavior, and English-only new UI.

**Implementation/configuration**

- update `vite.config.ts`;
- update `vercel.json`;
- update post-implementation documentation; and
- create one focused implementation review package.

**Verification**

```text
npm.cmd run verify
npm.cmd exec -- vite build --manifest
npm.cmd run preview
git diff --check
git status --short
```

**Manual/deployed checks:** direct nested refresh, unknown client route, emitted JS/CSS/font assets, `/api/chat`, mock/live Tutor, Home Network graph, mobile/desktop acceptance matrix, console errors, and unhandled rejections.

**Completion:** all automated, bundle, browser, and deployed-preview gates pass and documentation matches the released implementation.

**Commits:** `Configure platform SPA deployment`, then `Document the platform shell release`

**Rollback:** deployment configuration is isolated from documentation and feature commits.

## 20. Bundle baseline and verification hierarchy

Existing production artifacts recorded during planning:

| Asset group | Raw bytes | Gzip bytes |
|---|---:|---:|
| Initial JS | 298,639 | 96,575 |
| Initial CSS | 12,163 | 3,192 |
| Editable/Compute Engine JS | 1,144,140 | 308,738 |
| MathLive JS | 825,514 | 228,041 |
| MathLive font CSS | 7,913 | 4,205 |
| MathLive static CSS | 18,148 | 7,076 |

The current initial JS contains Chart.js, solvers, Convergence, `/api/chat`, and Tutor grounding. MathLive, Compute Engine, and editable-field code are already deferred.

Use this verification hierarchy after the platform switch:

1. **Vite manifest/Rollup chunk graph:** generate a manifest and trace `index.html` entry imports and dynamic imports. Prove the ODE route and Tutor panel are dynamic descendants rather than entry imports.
2. **Static versus dynamic ownership:** inspect source imports and the manifest to prove shell/pages do not statically import ODE, Chart.js, Convergence, Tutor runtime, ODE grounding, MathLive, or Compute Engine.
3. **Size records:** record raw/gzip sizes for entry, ODE, Tutor, editable/Compute Engine, MathLive, CSS, and fonts at every release candidate.
4. **Supplementary marker searches:** search chunks for Chart.js, solver-family, Convergence, `/api/chat`, `MathfieldElement`, and `ComputeEngine` markers only as corroborating evidence.
5. **Browser Network verification:** direct-load Home and overviews with a clean cache, verify heavy chunks are absent, trigger ODE intent prefetch once, navigate without a duplicate fetch, and open Tutor to observe its later request.

Home and overview entry paths must exclude Chart.js, ODE solvers, Convergence implementation, complete Tutor implementation, ODE Tutor grounding, MathLive, and Compute Engine. The ODE route may own its numerical dependencies and Lab binding. The complete Tutor panel/network/rendering stays behind first open. MathLive and Compute Engine retain their current inner deferred boundaries.

Do not add `manualChunks` unless the manifest and size records prove duplicated heavy modules or another measured problem. No size reduction is promised before measurement.

## 21. Manual acceptance matrix

Before release, verify:

1. Home loads without ODE, Chart.js, Convergence, Tutor, MathLive, or Compute Engine chunks.
2. Home cards, learning path, statuses, and Resume content are accurate.
3. ODE overview opens the complete Lab; incomplete modules expose no fake controls.
4. Beginner Starter values and exact solution are correct.
5. Existing ODE Run, comparison, exact solution, and fixed-grid numerical output are unchanged.
6. Return to current output survives platform navigation.
7. Convergence results, current/stale behavior, metric, and accordions restore.
8. Tutor mock/live behavior, safe math, chart instructions, ordinary Run reset, route preservation, and close preservation are unchanged.
9. Desktop Tutor resizes content; mobile Tutor hides MathLive's keyboard and preserves Lab scroll.
10. Home and each overview do not mount or preload Tutor.
11. Hover and keyboard focus prefetch ODE exactly once; incomplete modules do not prefetch.
12. Loading, failure, repeated Retry, and stale-route races do not lose sessions or generate unhandled rejections.
13. Back/Forward restores route, title, active state, focus, and namespaced entry scroll.
14. Resume restores Lab, analysis, Tutor session, and per-Lab scroll.
15. `beforeunload` warns only for already-maintained meaningful work.
16. New experiment cancellation changes nothing.
17. Checked New experiment clears only ODE Tutor items/draft and resets the Lab.
18. Unchecked New experiment preserves Tutor state, appends the divider, and uses fresh context.
19. New experiment zeros visible, per-Lab, and namespaced current-entry scroll and cannot restore the old value.
20. Direct Vercel refresh at `/ode/initial-value-problems` works.
21. Unknown page paths show in-shell Not Found.
22. `/api/chat` and emitted assets are not swallowed by the fallback.
23. No duplicate listeners, stuck virtual keyboard, console errors, or horizontal viewport overflow appear.
24. All new UI is English-only and uses semantic tokens.

## 22. Risk register

| Risk | Likelihood | Impact | Mitigation | Verification |
|---|---|---|---|---|
| ODE state remains impure | Medium | High | Pure types and store assertion | Round-trip and rejection tests |
| Successful result is lost | Medium | High | One immutable result owner | Return/remount tests |
| Draft overwrites successful snapshot | Medium | High | Separate draft and snapshot fields | Dirty-result cases |
| Convergence state fails restoration | Medium | High | Pure failure record and fingerprint map | Current/stale round-trip tests |
| Tutor Host reads stale session | Medium | High | Live `TutorSessionAccess` only | Interleaved store/Host update tests |
| Module-global Tutor state survives | High | High | Remove `conversation` ownership from panel | Module-isolation tests and source review |
| Tutor request mutates wrong route/module | High | High | Abort plus Host/request generations | Delayed response tests |
| Ordinary Run/New experiment semantics mix | Medium | High | Separate explicit reducers/actions | Run versus reset tests |
| Async Route A replaces Route B | Medium | High | Navigation generation checks | Required A/B race test |
| Duplicate listeners after remount | Medium | Medium | Idempotent route disposal | Repeated mount counters |
| Primary Chart leaks | High | Medium | Explicit destroy in Lab disposer | Destroy-spy tests |
| MathLive/Convergence leaks | Medium | Medium | Existing handles plus route invalidation | Disposal and late-load tests |
| Virtual keyboard remains open | Medium | High | Binding `prepareForOpen` and dispose hide | Mobile/manual tests |
| Unload handler becomes expensive | Medium | High | Read maintained boolean only | Spies proving no Lab/DOM calls |
| Resume exposes sensitive detail | Low | High | Whitelisted DTO | Negative field assertions |
| Focus changes restored scroll | Medium | Medium | `preventScroll` before guarded restore | Browser and unit ordering tests |
| New reset restores old scroll | Medium | High | Triple zero and token invalidation | Remount/popstate tests |
| History state is overwritten | Medium | High | Namespaced merge helper | Unrelated-field preservation tests |
| Relative nested assets fail | Certain today | High | Root Vite base | Built/direct-refresh checks |
| Vercel fallback swallows API/assets | Low after change | High | Filesystem-first verified rewrite | Contract plus deployed smoke |
| Home imports heavy code | Medium | High | Manifest/static-edge gates | Manifest and Network checks |
| Marker-only bundle test gives false confidence | Medium | Medium | Five-level verification hierarchy | Review artifact includes graph and Network evidence |
| Mobile Tutor overflows | Medium | Medium | `dvh`, independent scrolling, inert background | Narrow viewport matrix |
| Token migration changes ODE hierarchy | Medium | Medium | Literal consolidation only | Existing workflow visual review |
| `main.ts` extraction becomes broad rewrite | High | High | Compatibility bootstrap and adapters | Phase 3 review boundary |
| Source-string tests become brittle | High | Medium | Replace with mounted behavior tests | Integration test review |
| Browser history differs from jsdom | Medium | Medium | Real Chrome/Edge matrix | Manual Back/Forward verification |

## 23. Rollback strategy

- Phase 1 shell/pages are unused until the entry switch and can be reverted independently.
- Phase 2 pure state uses compatibility selectors, allowing reversal without numerical changes.
- Phase 3 keeps public root behavior through a thin compatibility bootstrap.
- Phase 4A changes Tutor ownership without changing public routing.
- Phase 4B is the single atomic public-entry switch and can be reverted alone.
- Phase 5A and 5B separate Resume/unload from scroll/reset lifecycle.
- Vite/Vercel deployment changes are isolated from feature commits.
- Documentation is committed only after the implemented state passes release verification.

No rollback uses destructive history rewriting. Reverts should be ordinary reviewable commits if changes have already been shared.

## 24. Implementation exclusions

This plan does not implement or design:

- Interactive Term Glossary or ODE glossary annotations;
- Linear Systems Lab, matrix editor, `scalar_constant`, SVD, eigenvalue solvers, or other Linear Algebra numerical work;
- PDE Lab implementation;
- a new numerical method or numerical behavior change;
- `localStorage`, `sessionStorage`, IndexedDB, accounts, or persistent history;
- React, a router library, Redux, or a new E2E framework;
- a theme switch, final fantasy skin, artwork, or decorative assets; or
- broad changes to ODE Method/Data/Output, form, result, chart, Convergence, or Tutor message design.

Future modules are consumers of the complete-Lab, store, and Tutor contracts only.

## 25. Documentation after implementation

After all implementation and deployment verification passes:

- update `README.md` with platform routes, local operation, and deployment behavior;
- update `docs/PROJECT_HANDOFF.md` with released state, tests, bundle evidence, and next milestone;
- update the authoritative design's implementation status;
- add one focused `docs/reviews/2026-07-13-theme-ready-platform-shell-review.md`; and
- add focused deployment documentation only if operational findings require it.

`docs/NUMERICAL_CONTRACTS.md` changes only if implementation discovers an actual numerical-contract change. None is planned.

## 26. Final implementation commit sequence

1. `Build platform router and static shell`
2. `Add platform and ODE session models`
3. `Extract the Initial Value Problems Lab route`
4. `Add the shared platform Tutor host`
5. `Mount the ODE Lab in the platform shell`
6. `Add platform resume and meaningful work`
7. `Add Lab scroll and reset lifecycle`
8. `Configure platform SPA deployment`
9. `Document the platform shell release`

Phase 0 produces evidence but no commit. Each implementation commit must pass its focused tests and TypeScript checks. The full `npm.cmd run verify`, manifest/chunk review, browser acceptance matrix, and Vercel preview smoke tests gate release documentation.

## 27. Plan self-review

This plan has been checked for the following failure modes:

- the Tutor Host uses live `TutorSessionAccess`, not a stale session snapshot;
- `beforeunload` reads maintained meaningful state only;
- platform history is namespaced and unrelated `history.state` fields are preserved;
- bundle verification begins with manifest/chunk ownership and uses marker searches only as supplementary evidence;
- the shell and static pages have no eager ODE/Tutor imports;
- complete-Lab DOM is disposed rather than hidden;
- module-global Tutor conversation ownership is removed in Phase 4A;
- ordinary Run reset, route/close preservation, and New experiment clear/preserve semantics are distinct;
- Tutor migration and the public platform entry switch are split into Phase 4A and 4B;
- the Vercel rewrite relies on verified filesystem-first behavior and receives a deployed smoke test;
- no browser persistence is assumed;
- ODE extraction is adapter-based rather than a broad rewrite;
- prospective work is labeled as planned rather than implemented; and
- the plan contains no unresolved placeholder markers.
