# Content-Agnostic Interactive Glossary Framework Design

**Status:** Approved design; implementation not started

**Date:** 2026-07-22

**Scope:** Numerical Analysis Lab, Milestone 2A

## 1. Purpose and decision status

Numerical Analysis Lab will add one Content-Agnostic Interactive Glossary
Framework shared across future Numerical ODE, Numerical Linear Algebra, and
Numerical PDE Labs. The first implementation milestone establishes stable
runtime contracts, registries, scope-level deduplication, accessible term
triggers, a platform-owned definition surface, responsive presentation,
lifecycle and lazy-loading boundaries, an injectable Tutor handoff, and a
development-only visual Playground.

This specification records approved product and architecture decisions. It is
not an invitation to restart product brainstorming or reopen the ownership,
interaction, accessibility, scope, persistence, or delivery choices below.

This documentation task implements nothing. It does not publish a definition,
change numerical notation, connect the real Tutor, or add a runtime route.

## 2. Existing platform foundation

The framework extends the implemented Theme-Ready Platform Shell without
weakening its established boundaries:

- `src/main.ts` remains a thin bootstrap.
- Static pages remain lightweight and domain-neutral.
- Complete Labs mount through the generic Lab adapter and dynamic route
  boundary.
- A Lab owns its domain bindings and runtime resources.
- A platform Host consumes an optional Lab-owned binding.
- The generic adapter connects and disconnects Hosts without understanding
  domain content.
- Runtime objects remain outside `AppSessionStore`.
- Static routes and Home remain outside complete-Lab, Tutor, MathLive, and
  future Glossary surface bundles.
- Route, Host, and Lab disposal remain idempotent and generation-guarded.

The authoritative platform references are:

- `docs/superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md`
- `docs/superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md`
- `docs/reviews/2026-07-14-theme-ready-platform-shell-review.md`
- `docs/PROJECT_HANDOFF.md`

Where the earlier platform lifecycle did not know about Glossary, this design
adds Glossary close/disconnect before Tutor and Lab disposal. It does not
otherwise change platform session, numerical, Tutor, scroll, Resume, or
meaningful-work behavior.

## 3. Approved milestone sequence

The product sequence is:

1. **Milestone 2A — Content-Agnostic Glossary Framework**
2. **Milestone 2B — Private-Reference Notation and Definition Foundation**
3. **Milestone 2C — ODE Glossary Vertical Slice**

Milestone 2A ships no production mathematical content.

Milestone 2C may eventually introduce the first four reviewed term IDs:

- `step_size`
- `stability`
- `global_error`
- `observed_order`

Those identifiers reserve rollout order only. This specification does not
define the terms, select their notation, add aliases, or create placeholder
production entries.

## 4. Milestone 2A outcomes

The first implementation will establish:

- branded stable term and scope identifiers;
- content-agnostic entry, override, display, formula, and request types;
- a validated core registry plus module-extension architecture;
- author-created Glossary scopes with first-occurrence deduplication;
- accessible native-button term triggers;
- plain-text fail-closed behavior;
- one lightweight platform coordinator;
- one lazily loaded visible definition surface;
- desktop preview and pinned-popover behavior;
- a modal mobile bottom sheet;
- project-owned placement and scroll-follow logic;
- dynamic scope snapshots and controlled trigger replacement;
- an injectable Tutor handoff contract with a test/dev mock;
- a development-only visual Playground contract;
- focused unit, integration, lifecycle, bundle, and manual acceptance gates.

The implementation may use content-neutral test and development fixtures. Such
fixtures must stay outside production registry paths and production bundles.

## 5. Explicit exclusions

Milestone 2A does not include:

- canonical numerical notation;
- production Glossary definitions;
- ODE term annotations;
- runtime notation profiles or a notation selector;
- definition sources, audit metadata, notation research, or source-health
  tooling;
- private course-note processing;
- production ODE, Linear Algebra, or PDE Glossary content;
- real Glossary Tutor API requests;
- Tutor transcript Glossary request cards;
- a real Glossary request queue;
- Keep/Replace queue behavior;
- formal mock Tutor mathematical explanations;
- persistent Glossary state;
- `AppSessionStore` integration;
- meaningful-work, Resume, or `beforeunload` changes;
- `localStorage`, `sessionStorage`, IndexedDB, or other browser persistence;
- a production Playground route;
- a new positioning, state-management, or UI dependency;
- changes to numerical methods, results, notation, or definitions.

Existing private-reference research remains separate and non-canonical. The
framework must not import it or turn research candidates into runtime content.

## 6. Ownership and dependency direction

Ownership is fixed as:

```text
Lab
  -> owns LabGlossaryBinding
  -> owns registry/module extension
  -> owns scope controllers and triggers
  -> owns dynamic term context sources
  -> owns final binding disposal

Platform Glossary Host
  -> consumes an optional LabGlossaryBinding
  -> owns the single visible definition surface
  -> owns responsive presentation, positioning, timers, and focus
  -> owns lazy surface-runtime loading
  -> does not construct domain definitions

Generic Lab Adapter
  -> connects an optional binding after Lab mount
  -> disconnects the Host before Lab disposal
  -> does not understand terms, definitions, scopes, or notation
  -> does not dispose the Lab-owned binding directly
```

Glossary state does not enter `AppSessionStore`, a Lab numerical session,
Tutor session, Resume metadata, `history.state`, or meaningful-work metadata.

The dependency direction is:

```text
platform bootstrap
  -> lightweight PlatformGlossaryHost
  -> optional complete-Lab Glossary binding
  -> current module registry and Lab-owned scopes
  -> dynamic surface runtime on first definition opening
  -> optional existing readonly math enhancement
```

The Lab does not import `PlatformGlossaryHost`. The Host does not import ODE,
Linear Algebra, PDE, numerical methods, or `AppSessionStore`.

## 7. Optional complete-Lab contract

The conceptual complete-Lab handle gains one optional and independent binding:

```ts
interface MountedLabRoute<TSession> {
  getSession(): TSession;
  getResumeSummary(): ResumeSummary | undefined;
  getTutorBinding(): LabTutorBinding<unknown>;
  getGlossaryBinding?(): LabGlossaryBinding;
  dispose(): void;
}
```

Rules:

- Tutor and Glossary bindings remain independent.
- The current production ODE Lab may omit `getGlossaryBinding()`.
- Milestone 2A must not create an empty or fake ODE binding.
- Static pages never provide a binding.
- The platform shell never constructs a domain Glossary binding.
- A mounted Lab never imports or retains a Host.
- A binding is stable for one complete route-mount lifetime.

Exact TypeScript file placement and minor naming refinements belong to the
repository-grounded implementation plan. The behavioral boundary above may not
be weakened.

## 8. Stable binding lifetime and stale-work protection

One complete Lab mount creates at most one `LabGlossaryBinding`.

Internal Lab rerenders do not recreate the binding. A stable binding may
replace or recreate:

- scope controllers;
- triggers;
- dynamic context sources;
- resolved term snapshots;
- controlled rerender transactions.

Binding identity changes only when:

- the complete Lab route remounts;
- a different module mounts;
- the Lab is disposed.

The binding, Host connection, surface request, scope, subscription, rerender
transaction, and lazy load each carry enough identity or generation
information to reject stale callbacks. A callback from an old binding or scope
must never update a later mount, surface, or module.

Binding disposal is idempotent. After disposal it may not create scopes,
register replacement triggers, publish snapshots, or send Tutor handoffs.

## 9. Route-leave and final disposal ownership

The conceptual route-leave order is:

1. `GlossaryHost.close({ restoreFocus: false })`
2. `GlossaryHost.disconnect()`
3. Close visible mobile Tutor presentation.
4. Capture route scroll.
5. Snapshot the Lab session.
6. `TutorHost.disconnect()`
7. `mountedLab.dispose()`

The generic Lab adapter owns this coordination order. It does not dispose the
Glossary binding separately.

`mountedLab.dispose()` owns final destruction of:

- the `LabGlossaryBinding`;
- scope controllers;
- triggers;
- dynamic subscriptions;
- rerender transactions;
- existing ODE/runtime resources.

Requirements:

- Glossary Host close and disconnect are idempotent.
- Binding disposal is idempotent.
- Lab disposal is idempotent.
- Disconnect invalidates stale Host work before Lab-owned resources disappear.
- The Host retains no definition-surface DOM after disconnect.
- The Lab retains no detached trigger, subscription, timer, or replacement
  transaction after disposal.
- No route transition restores Glossary focus to a trigger that is being
  removed.

## 10. Inert production Host posture

The production platform may eventually create exactly one lightweight
`PlatformGlossaryHost` coordinator.

Before a complete Lab supplies a Glossary binding, the Host is completely
inert:

- no surface DOM;
- no registry;
- no definitions or formulas;
- no document, hover, focus, click, Escape, resize, or scroll listeners;
- no focus or scroll effects;
- no lazy surface import;
- no meaningful-work or session state.

The coordinator may enter the initial platform bundle only after manifest and
source-graph evidence show that it remains lightweight and does not pull in a
registry, module extension, surface renderer, fixtures, Playground, formula
renderer, or Tutor runtime.

## 11. Content-agnostic runtime type model

Conceptual types include:

```ts
type GlossaryTermId = string & {
  readonly __brand: "GlossaryTermId";
};

type GlossaryScopeId = string & {
  readonly __brand: "GlossaryScopeId";
};

interface GlossaryFormula {
  latex: string;
  accessibleText: string;
  display?: "inline" | "block";
}

type GlossaryTermDisplay =
  | string
  | {
      kind: "math";
      latex: string;
      accessibleText: string;
    };

interface GlossaryEntry {
  id: GlossaryTermId;
  label: string;
  aliases?: readonly string[];
  definition: string;
  whyItMatters: string;
  formula?: GlossaryFormula;
  tutorTopic: string;
  moduleOverrides?: Partial<
    Record<LabModuleId, GlossaryModuleOverride>
  >;
}

interface GlossaryModuleOverride {
  contextualDefinition?: string;
  whyItMattersHere?: string;
  formula?: GlossaryFormula | null;
  tutorTopic?: string;
}
```

The framework implementation uses test/dev fixtures only. Production
registries contain no mathematical entry during Milestone 2A.

Resolved entries are immutable/read-only values. A module override may replace
contextual copy or Tutor topic, replace a formula, or explicitly suppress an
inherited formula with `null`.

## 12. Registry architecture

The intended production source map is:

```text
src/glossary/
  glossaryRuntimeTypes.ts
  glossaryBuilders.ts
  coreGlossary.ts
  glossaryRegistry.ts
  glossaryScope.ts
  glossaryController.ts
  glossarySurfaceLoader.ts
```

Future module extensions may be:

```text
src/ode/odeGlossary.ts
src/linearAlgebra/linearAlgebraGlossary.ts
src/pde/pdeGlossary.ts
```

For Milestone 2A:

- `coreGlossary.ts` remains empty or contains no mathematical entries.
- No ODE production extension is created.
- Test/dev fixtures live outside production registry paths.
- The Home and static-page graphs do not load registry code.

The registry supports:

- stable term IDs;
- controlled labels and aliases;
- module-specific overrides;
- standard and contextual copy;
- formula fallback and `null` suppression;
- display validation;
- immutable resolved entries;
- deterministic duplicate/conflict detection;
- safe lookup without DOM scanning.

Registry builders may support later content-budget linting, but Milestone 2A
does not populate formal content.

## 13. Alias and display rules

One stable term ID may later have controlled visible aliases. A visible label
may differ by authored context, including a readonly mathematical display.

Rules:

- Aliases never trigger automatic DOM scanning.
- An alias validates only an author-supplied display value.
- Tutor requests carry only the stable term ID.
- String displays are plain text.
- Mathematical displays use the readonly `{ kind: "math", latex,
  accessibleText }` record.
- No HTML or trusted-markup escape hatch is accepted.
- Unknown or invalid displays fail loudly in development and testing.
- Milestone 2A adds no real numerical aliases.

The framework does not infer a term from text content, normalize arbitrary
prose, or replace matching strings after render.

## 14. Validation diagnostics and production fallback

Development and test environments fail loudly for:

- unknown term IDs;
- invalid aliases or displays;
- duplicate term IDs;
- conflicting aliases;
- missing module-override targets;
- invalid scope IDs;
- invalid formula records.

Diagnostics include, when applicable:

- a stable diagnostic code;
- term ID;
- scope ID;
- display value.

Production fails closed:

- preserve the original readable authored text;
- do not create a button;
- do not add a dotted underline;
- do not open an empty surface;
- do not invoke Tutor;
- record each controlled diagnostic at most once;
- continue operating other valid terms and scopes.

One invalid term must not break the complete Lab, throw through its render
path, or turn unrelated terms noninteractive.

## 15. Scope controller contract

A Lab-owned controller manages one explicit conceptual scope:

```ts
interface GlossaryScopeController {
  readonly id: GlossaryScopeId;

  createTerm(options: {
    termId: GlossaryTermId;
    display: GlossaryTermDisplay;
  }): GlossaryTermRenderResult;

  dispose(): void;
}

type GlossaryTermRenderResult =
  | {
      kind: "interactive";
      node: HTMLButtonElement;
      dispose(): void;
    }
  | {
      kind: "plain-text";
      node: Text | HTMLElement;
    };
```

The controller:

- validates the scope, term ID, and authored display;
- remembers term IDs already enhanced in that scope;
- enhances only the first occurrence of a term;
- returns plain authored text for later occurrences;
- connects interactive triggers to the platform surface request boundary;
- owns trigger and dynamic-subscription cleanup for the scope;
- closes a surface owned by the scope before final scope disposal;
- stores no state in `AppSessionStore`.

Trigger-level `dispose()` and scope-level `dispose()` are idempotent. Disposing
a scope invalidates all its trigger requests.

## 16. First-occurrence policy

The same term is enhanced only once within one explicit conceptual scope. The
same term may be enhanced again in a different scope.

Future scope examples include:

- problem inputs;
- method explanation;
- output interpretation;
- convergence results.

The framework does not infer scope from the DOM. A normal rerender recreates
scope-level deduplication state unless it participates in the controlled
replacement transaction defined later.

Later duplicate text remains exactly as authored. It receives no button,
underline, hidden annotation, listener, or automatic Tutor behavior.

## 17. Curated annotation boundaries

Future reviewed content may explicitly enhance:

- teaching text;
- section headings or short descriptions;
- method explanation cards;
- educational form labels;
- conceptual result headings;
- Convergence teaching content.

The default prohibited locations are:

- button text;
- input content and placeholders;
- raw numeric cells;
- chart legends and tooltips;
- validation errors;
- Tutor transcript;
- API content;
- user-authored expressions.

Special locations require explicit author opt-in and a dedicated accessibility
review. The framework performs no text scanning or automatic replacement in
any location.

## 18. Educational form-label accessibility

A Glossary trigger is never nested as an interactive control inside a native
`label`.

An educational form label that includes an explicit Glossary term:

- renders the Glossary button separately from the native label;
- keeps the input's accessible name independent;
- uses a visually hidden native label or `aria-labelledby` where appropriate;
- preserves normal input focus behavior for any visible label text;
- makes activation of the Glossary button open only the definition;
- keeps validation and error relationships on the input;
- uses Glossary ARIA attributes only for the definition surface.

A question-mark icon is not a substitute for the visible term. Accessible
tests must cover the complete label/input/term composition.

## 19. Trigger semantics and appearance

An interactive term uses:

```html
<button type="button">authored term display</button>
```

The native button looks like ordinary text:

- no outer border, background, shadow, or visible padding;
- inherited font and text color;
- no horizontal layout shift between states;
- low-contrast dotted underline by default;
- stronger accent underline for hover, focus, pinned, or open state;
- visible focus ring;
- a cursor that communicates help or definition behavior.

The default underline remains visible for beginner discoverability. Later
occurrences in the same scope are plain text without an underline.

The trigger has accurate `aria-expanded` and `aria-controls` only when it owns
or controls a surface. Keyboard behavior retains native Enter and Space
activation. Hover is an enhancement, not the only access path.

## 20. Desktop interaction model

Desktop follows:

```text
preview
  -> pin
  -> explicitly Ask the Tutor
```

Behavior:

- mouse hover waits approximately 220 ms before preview;
- keyboard focus previews immediately;
- mouse leave waits approximately 300 ms before close;
- pointer entry into the preview cancels the close timer;
- opening another term immediately replaces the active surface;
- click, Enter, or Space pins the complete popover;
- Escape closes;
- outside click closes a pinned popover;
- pinned focus may move into the card;
- close restores focus to the current valid trigger when appropriate;
- preview alone never creates meaningful work.

Timer cancellation is explicit. A stale timer from a previous trigger,
binding, or surface generation cannot open or close the current surface.

## 21. Mobile interaction model

On touch or the approved narrow-layout breakpoint:

- tapping a term opens a complete definition bottom sheet;
- there is no compact-preview phase;
- the background becomes inert;
- document scroll locks;
- the sheet owns an independent scroll region;
- an explicit named close control is present;
- focus is contained;
- close restores focus and document position when the trigger remains valid;
- the sheet remains inside the visual viewport;
- no control extends beyond the frame;
- only one modal surface is active.

The mobile Glossary and mobile Tutor must never own inert state or document
scroll lock simultaneously.

## 22. Single active surface and transient state

The entire platform has at most one active Glossary surface:

```ts
interface ActiveGlossarySurface {
  termId: GlossaryTermId;
  moduleId: LabModuleId;
  scopeId: GlossaryScopeId;
  trigger: HTMLElement;
  mode: "preview" | "pinned" | "mobile-sheet";
}
```

Opening a new term closes the previous surface. Route navigation, binding
replacement, scope disposal, detached-trigger detection, or Lab disposal also
closes it.

Active surface state is transient and never enters:

- the Lab session;
- `AppSessionStore`;
- Tutor session;
- `history.state`;
- Resume metadata;
- browser persistence.

## 23. Compact and complete surface content

Desktop hover/focus preview contains only:

- the currently visible term label;
- a one-sentence core definition;
- a short prompt such as “Click or press Enter for more.”

Preview contains no:

- Ask the Tutor action;
- complete module explanation;
- Why it matters section;
- formula enhancement;
- focusable card controls.

Pinned desktop and mobile complete surfaces may contain, in order:

1. visible term label;
2. standard term label when different;
3. core definition;
4. module-specific contextual definition;
5. Why it matters here;
6. optional readonly formula;
7. Ask the Tutor;
8. explicit close action.

The schema remains compatible with these later content budgets:

- core definition: one sentence;
- module definition: one or two short sentences;
- Why it matters: one sentence;
- one principal formula;
- desktop complete card: normally 80–140 English words;
- mobile sheet: normally no more than about 180 English words.

Milestone 2A may test budget validation with content-neutral fixtures only.

## 24. Formula rendering contract

Glossary formulas are readonly curated records:

```ts
interface GlossaryFormula {
  latex: string;
  accessibleText: string;
  display?: "inline" | "block";
}
```

Rules:

- no evaluator;
- no executable AST;
- no user input;
- no HTML;
- visible rendering begins with `accessibleText` as the safe fallback;
- optional enhancement uses the existing safe readonly math renderer;
- MathLive remains deferred;
- Compute Engine is not required for Glossary display;
- enhancement failure retains readable text;
- screen readers do not receive duplicated formula content.

The Playground may use one clearly test-only formula fixture. It does not
establish numerical notation.

## 25. Lazy-loading boundary

The intended graph is:

```text
Platform Home
  -> lightweight inert Glossary Host only
  -> no registry
  -> no surface runtime

Complete Lab with Glossary binding
  -> runtime types
  -> current module registry
  -> scope and trigger logic
  -> lightweight controller
  -> dynamic surface runtime

First actual definition opening
  -> desktop/mobile surface renderer
  -> surface CSS
  -> optional readonly math enhancement

Ask the Tutor
  -> injected Tutor handoff
  -> existing Tutor runtime boundary remains independent
```

Production Home must not load:

- module registries;
- fixtures;
- Playground;
- surface runtime or CSS;
- formula renderer;
- real Tutor Glossary logic.

The surface loader owns one cached import attempt. A rejected attempt presents
a controlled, accessible failure state with Retry rather than an empty card.
Retry evicts the rejected promise and starts a new generation. Load completion
must still match the current binding and surface request before mounting.

## 26. Platform Glossary Host contract

Conceptually:

```ts
interface PlatformGlossaryHost {
  connect(binding: LabGlossaryBinding): void;
  disconnect(): void;

  preview(request: GlossarySurfaceRequest): void;
  pin(request: GlossarySurfaceRequest): void;
  openMobile(request: GlossarySurfaceRequest): void;

  close(options?: {
    restoreFocus?: boolean;
  }): void;

  dispose(): void;
}
```

The Host owns:

- one active surface;
- hover and close timers;
- lazy surface loading and retry state;
- responsive mode selection;
- desktop positioning;
- focus and close restoration;
- Escape and outside-click handling;
- pinned scroll-follow;
- connection and stale-generation protection.

The Host does not:

- import a domain module;
- import `AppSessionStore`;
- construct or edit definitions;
- scan the page;
- own scope controllers;
- own final binding disposal;
- retain a detached Lab trigger after close/disconnect.

`connect()`, `disconnect()`, `close()`, and `dispose()` are safe under repeated
calls. Replacing a connection closes the old surface without allowing old
callbacks to affect the new binding.

## 27. Desktop popover placement

Positioning is project-owned and dependency-free. The default placement is
below the trigger.

When necessary, the placement logic:

- flips above when lower space is insufficient;
- shifts left when the right edge would overflow;
- shifts right when the left edge would overflow;
- retains a viewport safety margin;
- caps width and height;
- permits internal scrolling in a complete card.

The pure function receives:

- trigger `DOMRect`;
- measured surface dimensions;
- viewport dimensions;
- gap;
- safety margin.

It returns:

```ts
interface GlossaryPlacement {
  side: "top" | "bottom";
  left: number;
  top: number;
  maxWidth: number;
  maxHeight: number;
}
```

Milestone 2A adds no Floating UI, Popper, or equivalent dependency.

## 28. Scroll, resize, and reposition behavior

When the document scrolls:

- a preview closes immediately;
- a pinned desktop popover remains open;
- pinned placement updates in `requestAnimationFrame`;
- multiple scroll events in one frame cause one measurement;
- surface-internal scrolling does not invoke document positioning;
- a detached trigger closes the surface;
- a trigger far outside the viewport closes the surface.

Viewport resize and desktop Tutor-width changes reposition a pinned surface.
Route navigation, scope disposal, and binding replacement close immediately.

The mobile bottom sheet locks the background and does not track document
scroll.

## 29. Dynamic scope context

A scope may expose a lightweight reactive source:

```ts
interface GlossaryScopeContextSource {
  getSnapshot(): GlossaryScopeSnapshot;
  subscribe(listener: () => void): () => void;
}
```

Host behavior:

- preview never subscribes;
- pinned popover and mobile sheet subscribe;
- a notification causes a fresh snapshot read;
- updates do not close or reanimate the surface;
- focus remains stable;
- updates create no meaningful work;
- Ask the Tutor reads the latest snapshot when invoked;
- close, disconnect, and disposal unsubscribe idempotently;
- stale scope callbacks cannot update a later binding.

The Host never receives `OdeSessionState`, solver output types, matrix types,
PDE grid types, or another domain-specific session.

## 30. Controlled scope rerender and trigger replacement

A pinned surface may transfer to a replacement trigger only when:

- module ID matches;
- scope ID matches;
- term ID matches;
- binding identity/generation matches;
- an explicit rerender transaction registers the replacement;
- the active mode is pinned, not preview.

There is no DOM search for a matching term.

Conceptually:

```text
beginScopeRerender(scopeId)
  -> dispose old scope under a controlled replacement window
  -> create replacement scope
  -> register replacement trigger
  -> commit
```

On commit:

- a valid replacement re-anchors the surface and preserves surface
  focus/content;
- no valid replacement closes the surface.

A mobile sheet may remain open only if the same module, binding, scope, and term
still exist after commit. Abandoned transactions close safely during binding
or Lab disposal.

## 31. Tutor handoff contract

Milestone 2A defines an injectable contract without real Tutor integration:

```ts
interface GlossaryTutorRequest {
  kind: "glossary_term";
  termId: GlossaryTermId;
  moduleId: LabModuleId;
  scopeId: GlossaryScopeId;
  curatedScopeContext?: string;
}

interface GlossaryTutorHandoff {
  askTerm(options: {
    request: GlossaryTutorRequest;
    trigger: HTMLElement;
    preserveDraft: true;
  }): Promise<
    | { status: "started"; transcriptItemId?: string }
    | { status: "queued" }
    | { status: "replacement-required" }
    | { status: "cancelled" }
  >;
}
```

Milestone 2A behavior:

- the surface enters a temporary submitting state;
- duplicate activation is disabled;
- the Glossary surface closes;
- the injected handoff is invoked;
- the Playground supplies a mock/test handoff;
- no real transcript mutation occurs;
- no queue is created;
- no API request is sent;
- no Glossary request card is rendered.

The request uses the stable term ID and a curated string snapshot, never raw
Lab state or arbitrary DOM text.

## 32. Glossary and Tutor surface coordination

When the user manually opens Tutor:

1. Close the Glossary surface without restoring focus to the term.
2. Open Tutor.
3. Do not send a Glossary request.

When a Glossary term opens while Tutor is visible:

- temporarily hide Tutor presentation;
- preserve transcript, draft, pending request state, and desktop preference;
- do not interpret hiding as a user Tutor close;
- open the Glossary surface;
- do not automatically reopen Tutor when Glossary closes.

Mobile never presents two modal sheets or two simultaneous inert/scroll-lock
owners.

Milestone 2A may provide coordination contracts and focused tests. Full real
Tutor handoff and queue behavior remain deferred.

## 33. Deferred real Tutor queue behavior

A later implementation phase will preserve the already approved behavior:

- preserve an existing Tutor draft;
- add a structured Glossary request card only after processing begins;
- permit at most one transient queued Glossary request;
- do not persist queued state;
- require Keep or Replace for a second queued request;
- leave no transcript record for a replaced queued term;
- pause the queued request when Tutor closes;
- permit it to begin when Tutor reopens;
- discard the transient queue on disconnect;
- read the latest Lab context only when processing begins.

None of this queue or transcript behavior is a Milestone 2A deliverable.

## 34. Development-only Glossary Playground

The future implementation includes:

```text
/__dev/glossary-playground
```

The route exists only when development routes are explicitly enabled.

Playground coverage includes:

- short and long definitions;
- same-scope duplicate terms;
- the same fixture term in different scopes;
- top, bottom, left, and right edge placement;
- long-page scrolling;
- pinned scroll-follow;
- dynamic context update;
- replacement-trigger transactions;
- a test-only readonly formula;
- a mock Tutor handoff;
- desktop and mobile surfaces;
- focus and Escape behavior;
- invalid fixture behavior.

Rules:

- no real numerical definitions;
- no real Tutor API;
- no `AppSessionStore`, Resume, meaningful-work, or `beforeunload` work;
- no production route;
- no production fixture bundle.

## 35. Development route injection

The route table supports conditional injection equivalent to:

```ts
createRouteDefinitions({
  developmentRoutes:
    import.meta.env.DEV
      ? [dynamicGlossaryPlaygroundRoute]
      : [],
});
```

Requirements:

- the Playground route uses a dynamic import;
- tests may inject development routes explicitly;
- the production route table excludes the path;
- production access reaches Not Found;
- production code has no static import into `src/dev`;
- manifest and source-graph tests prove exclusion.

## 36. Development-only entry points

In development only, About contains a small **Developer Tools** area with:

- **Open Glossary Playground**

There is no main-navigation item or floating button. The direct URL remains
available in development.

The development-only shortcut is:

- `Ctrl + Shift + G`
- `Cmd + Shift + G`

It:

- navigates directly through the shared `navigate()` boundary;
- does nothing inside `input`, `textarea`, `select`, `contenteditable`, or
  editable MathLive fields;
- ignores already-prevented events;
- does not add a duplicate history entry when already on the Playground;
- removes its listener on bootstrap disposal;
- is excluded from the production bundle.

## 37. Planned implementation source boundaries

Repository-grounded planning may refine filenames while preserving these
responsibilities:

```text
src/app/
  platformGlossaryHost.ts       lightweight coordinator only
  contracts.ts                  optional complete-Lab binding contract
  platformBootstrap.ts          one Host and lifecycle coordination
  moduleRegistry.ts             generic optional binding connection

src/glossary/
  glossaryRuntimeTypes.ts       content-agnostic public runtime records
  glossaryBuilders.ts           validation and immutable builders
  coreGlossary.ts               empty production core in Milestone 2A
  glossaryRegistry.ts           core + module extension resolution
  glossaryScope.ts              scope, deduplication, trigger lifecycle
  glossaryController.ts         binding/controller coordination
  glossarySurfaceLoader.ts      cached dynamic surface import and Retry

src/glossary/surface/
  glossarySurfaceRuntime.ts     desktop/mobile surface renderer
  glossaryPlacement.ts          pure placement
  glossarySurface.css           lazy surface styles

src/dev/glossary/
  glossaryPlaygroundRoute.ts    development-only route module
  glossaryFixtures.ts           content-neutral fixtures
```

Test/dev fixtures never enter `coreGlossary.ts` or a future production module
extension.

## 38. Planned implementation commits

Implementation will be split into three reviewable commits:

### Commit 1 — `Build glossary model and scope lifecycle`

Includes:

- runtime types;
- builders and validation;
- registry;
- scope controllers;
- first-occurrence deduplication;
- snapshots;
- replacement transactions;
- pure focused tests.

### Commit 2 — `Add shared glossary surfaces`

Includes:

- inert Host coordinator;
- lazy surface runtime;
- preview;
- pinned popover;
- mobile sheet;
- placement and scroll-follow;
- focus and timers;
- Tutor handoff contract;
- focused tests.

### Commit 3 — `Add the glossary framework playground`

Includes:

- development-only route;
- About Developer Tools entry;
- development shortcut;
- fixtures;
- browser verification;
- bundle-exclusion tests;
- HANDOFF and README Changelog updates.

No implementation begins in the design-documentation commit.

## 39. Automated test requirements

### Registry

- duplicate IDs;
- alias validation and conflicts;
- missing module-override target;
- module override fallback;
- formula replacement and `null` suppression;
- immutable/read-only resolved values;
- precise development diagnostics;
- production fail-closed behavior and once-only logging.

### Scope

- first occurrence enhanced only;
- the same term in different scopes;
- later duplicates retain plain authored text;
- invalid term plain-text fallback in production;
- scope and trigger disposal;
- stale trigger safety;
- dynamic context subscription/unsubscription;
- replacement transaction success and no-replacement close.

### Trigger

- native `button type="button"`;
- no interactive nesting in a native label;
- keyboard activation;
- `aria-expanded` and `aria-controls`;
- visible focus and dotted visual class hooks;
- no layout-changing wrapper;
- plain-text fallback.

### Host

- inert state without a binding;
- connect, replacement, and disconnect;
- one active surface;
- preview, pin, and mobile modes;
- open/close timer cancellation;
- lazy-load failure and Retry;
- stale connection/load/scope generations;
- idempotent close, disconnect, and disposal.

### Placement and scroll

- bottom preference;
- top flip;
- left/right shift;
- viewport safety margins;
- max dimensions;
- one animation-frame measurement;
- preview closes on document scroll;
- pinned follow;
- detached and far-offscreen trigger close;
- internal surface scrolling does not reposition.

### Surface and accessibility

- compact versus complete content;
- focus movement and restoration;
- Escape and outside click;
- mobile focus containment;
- inert background and document scroll lock;
- visual-viewport containment;
- one modal owner;
- dynamic context update without reanimation;
- formula fallback and no duplicate accessible text.

### Lifecycle and coordination

- Glossary close/disconnect before Lab disposal;
- final binding disposal by the Lab only;
- no hidden surface DOM or detached trigger;
- Tutor/Glossary visible-surface coordination;
- no Lab, Tutor, Store, history, Resume, persistence, or meaningful-work
  mutation;
- stale callbacks cannot cross a route remount.

### Playground and development controls

- dev route injection only;
- production Not Found behavior;
- production manifest/source-graph exclusion;
- About Developer Tools entry only in development;
- shortcut behavior and editable-target exclusions;
- shortcut-listener cleanup;
- mock handoff only.

### Bundle

- Home excludes registries, surface runtime, formula enhancement, fixtures, and
  Playground;
- production excludes Playground and fixtures;
- MathLive remains deferred;
- Tutor runtime remains independently deferred;
- no production mathematical entries occur in emitted chunks.

## 40. Manual verification requirements

Desktop checks at a wide viewport:

- default dotted trigger appearance;
- hover delay and cancellation;
- immediate focus preview;
- pin and explicit close behavior;
- card placement at every viewport edge;
- pinned scroll-follow;
- internal complete-card scrolling;
- dynamic context update without focus loss;
- replacement-trigger transfer;
- mock handoff;
- no page overflow.

Mobile checks near 390 × 844:

- sheet containment;
- focus containment;
- document scroll lock;
- close and focus restoration;
- no horizontal overflow;
- formula fallback;
- one active modal;
- mock handoff;
- no Tutor/Glossary overlap.

Production build checks:

- no Playground route;
- no fixtures;
- no surface runtime on Home initial load;
- no formal Glossary terms;
- no MathLive or Tutor regression in their independent lazy boundaries.

## 41. Bundle evidence requirements

Implementation acceptance requires:

- a production Vite manifest;
- source-graph tests for the initial platform entry and static pages;
- emitted-chunk inspection for fixtures, Playground, and formal terms;
- browser Network evidence for Home, complete-Lab mount, first definition
  opening, optional formula enhancement, and mock handoff boundaries.

Measurements must distinguish initial, complete-Lab, surface, formula, and
Tutor chunks. A lightweight coordinator may remain eager only when evidence
shows that definitions and surface implementation remain deferred.

## 42. Documentation and living handoff

`docs/glossary/HANDOFF.md` is the durable implementation handoff. It tracks:

- phase and implementation status;
- ownership and APIs;
- completed implementation commit;
- focused and full tests;
- bundle evidence;
- desktop/mobile verification;
- formal content intentionally absent;
- private-reference-dependent content work;
- exact next actions.

Every later Glossary implementation iteration updates the same handoff. README
receives concise public Changelog entries that distinguish framework work from
released production content.

## 43. Acceptance criteria

Milestone 2A implementation will be acceptable only when:

- the complete-Lab contract can optionally expose one stable Glossary binding;
- current ODE can omit the binding without fake content;
- the Host is inert without a binding and lightweight in the entry graph;
- Lab, Host, and adapter ownership follow this specification;
- first-occurrence deduplication is explicit and scope-local;
- invalid production entries remain readable plain text and do not break a Lab;
- triggers are accessible native buttons and never nested in native labels;
- one active surface works on desktop and mobile;
- placement, focus, timers, scroll, and stale generations are tested;
- dynamic snapshots and controlled trigger replacement preserve safe
  ownership;
- the real Tutor remains untouched and the mock handoff sends no request;
- Playground and fixtures are absent from production;
- Glossary remains outside Store, sessions, Resume, history, meaningful work,
  and persistence;
- no production mathematical definition, alias, or canonical notation ships;
- existing numerical and platform behavior remains unchanged.

## 44. Approved-design self-review

This design has been checked against the approved brief:

- It includes no production mathematical definition or formula.
- It names future ODE rollout IDs without defining or annotating them.
- It keeps Glossary state out of `AppSessionStore` and numerical sessions.
- It gives final binding disposal to the Lab, not the Host or generic adapter.
- It prevents the Lab from importing the Host and the Host from importing ODE.
- It prohibits automatic DOM scanning and string replacement.
- It prevents interactive controls from being nested inside native labels.
- It permits only one active Glossary surface.
- It defines mobile Tutor/Glossary coordination so two modal owners cannot
  coexist.
- It preserves lazy surface, math, Tutor, and development-route boundaries.
- It records the real Tutor queue as deferred rather than implemented.
- It keeps notation research, private-reference processing, and audit metadata
  outside Milestone 2A.
- It adds no persistence or meaningful-work behavior.
- It contains no unfinished placeholder markers.
- It makes no implementation or release claim.

The next action after review is repository-grounded implementation planning,
not implementation from this document alone.
