# ODE Glossary Wave 1 Design

**Status:** Maintainer approval design; all decisions remain pending.

**Date:** 2026-07-29

**Authorization boundary:** This specification does not authorize production
content, TypeScript entries, annotations, an ODE Glossary binding, runtime
composition, Tutor integration, E1, E2, E3, or Group F2.

## 1. Purpose

This specification converts the existing ten-card Wave 1 catalog draft into a
repository-grounded production design. It fixes the proposed content,
ownership, annotation, lifecycle, accessibility, lazy-loading, Tutor, staged
rollout, verification, and rollback boundaries tightly enough for later
implementation after explicit maintainer approval.

The proposed card copy and complete 21-field annotation records are in the
[content packet](../../content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md). The
[approval checklist](../../content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md)
begins entirely unchecked.

## 2. Accepted framework and current source facts

The locally accepted Content-Agnostic Interactive Glossary Framework already
provides:

- immutable `GlossaryEntry` records and module overrides;
- `createGlossaryRegistry`;
- a stable Lab-owned `LabGlossaryBinding`;
- explicit scope controllers and first-occurrence deduplication;
- controlled scope-rerender replacement transactions;
- one inert platform Host and one active platform surface;
- desktop preview/pinned behavior and a mobile modal sheet;
- lazy surface loading and retry;
- optional readonly formula rendering;
- an injectable generic Tutor handoff contract;
- ordered Host disconnect before Lab disposal.

Current production facts:

- `src/glossary/coreGlossary.ts` is an empty frozen array;
- `src/ode/initialValueProblemsRoute.ts` and `src/ode/odeApp.ts` expose no
  `getGlossaryBinding`;
- the generic adapter already calls an optional Lab binding and disconnects
  the Host before Lab disposal;
- `/ode/initial-value-problems` is a dynamically loaded complete Lab;
- `/ode` is a static `RouteModule`, not a complete Lab and not a binding owner;
- method cards are native buttons;
- Data inputs and the exact-solution checkbox use native labels;
- editable math loads later and is outside approved annotation targets;
- the surface shows `Ask the Tutor` only when the Host connection receives a
  `tutorHandoff`;
- the current Lab adapter connects only the binding and supplies no production
  Glossary Tutor handoff.

## 3. Exact Wave 1 boundary

Exactly ten stable IDs are proposed:

```text
ordinary_differential_equation
initial_condition
initial_value_problem
step_size
time_grid
numerical_approximation
exact_solution
explicit_scheme
forward_euler_method
backward_euler_method
```

The prerequisite-aware teaching order places `initial_condition` before
`initial_value_problem`, then introduces the grid before the values stored on
it. `implicit_scheme` remains outside the exact set and is governed by pending
decision D02.

## 4. Content ownership

### 4.1 Recommended logical split

Core-owned:

```text
numerical_approximation
explicit_scheme
```

ODE-owned:

```text
ordinary_differential_equation
initial_condition
initial_value_problem
step_size
time_grid
exact_solution
forward_euler_method
backward_euler_method
```

`step_size` is not promoted to core because Wave 1 requires the preferred
temporal label, fixed ODE formula, endpoint-alignment limits, and explicit
separation from PDE spatial grid spacing. `exact_solution` is not promoted
because the required preview, formula, and proof limitation are stated for an
IVP. A future content review may promote either without changing the stable ID.

### 4.2 Proposed physical ownership

Future E1 may create or change only these production content owners:

```text
src/glossary/coreGlossary.ts
  -> two reviewed reusable entries

src/ode/odeGlossaryContent.ts
  -> eight reviewed ODE entries
  -> ODE contextual overrides for the two core entries
  -> pure data only; no DOM, binding, Host, Store, or session
```

`whyItMatters` in a core record remains general. `contextualDefinition`,
`whyItMattersHere`, and a narrower `tutorTopic` belong to the ODE module
override. ODE-owned records carry their complete module-specific content
directly.

E1 does not import either content owner from a production route. Unreferenced
content therefore remains absent from the Rollup graph and inert until E2.

## 5. Planned ODE module

Future E2 may create:

```text
src/ode/odeGlossary.ts
```

Recommended public API:

```ts
export type OdeGlossaryScopeName =
  | "context"
  | "method"
  | "data"
  | "output";

export type OdeWave1AnnotationId =
  | "ODE-W1-ANN-001"
  | "ODE-W1-ANN-002"
  | "ODE-W1-ANN-003"
  | "ODE-W1-ANN-004"
  | "ODE-W1-ANN-005"
  | "ODE-W1-ANN-006"
  | "ODE-W1-ANN-007"
  | "ODE-W1-ANN-008"
  | "ODE-W1-ANN-009"
  | "ODE-W1-ANN-010";

export interface OdeGlossaryRuntime {
  readonly binding: LabGlossaryBinding;
  beginRender(): OdeGlossaryRenderTransaction;
  dispose(): void;
}

export interface OdeGlossaryRenderTransaction {
  createTerm(
    annotationId: OdeWave1AnnotationId
  ): GlossaryTermRenderResult;
  commit(): void;
  abort(): void;
}

export function createOdeGlossaryRuntime(): OdeGlossaryRuntime;
```

The exact TypeScript names remain subject to E2 review, but the responsibilities
do not:

- compose `coreGlossaryEntries`, ODE entries, and ODE overrides;
- create one strict-in-development/controlled-production registry;
- create one stable `LabGlossaryBinding` for module `ode`;
- own the four explicit scope IDs;
- map each annotation ID to one reviewed term ID, display, and scope;
- wrap the framework's four scope-rerender transactions into one all-or-abort
  render transaction;
- return framework-created interactive or readable fallback nodes;
- dispose the binding exactly once when the Lab disposes.

The module imports reusable core content. It remains inside the dynamic ODE
route graph because only `src/ode/odeApp.ts` imports it. It does not import the
platform Host, Store, Router, Tutor panel, MathLive, Compute Engine, or
Chart.js.

## 6. Exact binding design

| Concern | Proposed behavior |
|---|---|
| Binding owner | `mountOdeApp` owns one `OdeGlossaryRuntime`; its binding remains Lab-owned. |
| Creation time | Once per complete ODE mount, before the first `render()`. |
| Connection time | The existing generic adapter calls `getGlossaryBinding?()` after mount and connects it to the existing platform Host. |
| Active route scope | `/ode/initial-value-problems` only. `/ode` remains static and unbound. |
| Available registry | Exactly the ten approved Wave 1 entries resolved for module `ode`. |
| Annotation registry | Exactly `ODE-W1-ANN-001` through `010`; no string scan or inferred term. |
| Context/module overrides | Static reviewed ODE contextual definitions for the two core entries; no raw session or DOM text. |
| Active surface | The existing Host owns at most one surface; the Lab never owns surface DOM. |
| Route navigation | Adapter closes and disconnects the Host before session capture and Lab disposal. |
| Route disposal | `mountedLab.dispose()` disposes `OdeGlossaryRuntime`, all scopes, triggers, listeners, and transactions idempotently. |
| Rerender | `beginRender()` opens four explicit scope replacement transactions before old DOM removal; exact replacements transfer only when current. |
| Result state | Glossary reads curated static content only in Wave 1; numerical output is neither changed nor stored in Glossary state. |
| New experiment | The normal full render transfers lede annotations when exact; Method/Data/Output surfaces without a replacement close. No Glossary state is reset or stored. |
| Session | No Glossary content, surface, scope, or active-term state enters `OdeSessionState` or `AppSessionStore`. |
| Persistence | None; no localStorage, sessionStorage, IndexedDB, history state, or Resume metadata. |
| Tutor handoff | No production handoff is injected under the recommended Wave 1 policy; no Ask button, request, queue, card, or transcript mutation. |
| Error/loading | Invalid content fails to readable plain text; surface-load failure preserves the Lab and exposes existing Retry/Close behavior. |
| Meaningful work | Preview, pin, sheet, and close do not affect meaningful-work or `beforeunload`. |

`MountedOdeApp` and `MountedInitialValueProblemsRoute` may expose the existing
optional `getGlossaryBinding(): LabGlossaryBinding` in E2. That is use of an
accepted framework contract, not a new framework interface.

## 7. Rerender transaction

The current ODE app replaces its full route-owned DOM on Method/Data/Output
changes. E2 must wrap that existing render without retaining hidden DOM:

```text
begin all four scope replacements
  -> dispose current expression, convergence, and chart handles as today
  -> replace route-owned DOM
  -> explicitly create only reviewed annotation nodes
  -> commit all four scopes after successful composition
  -> abort all four scopes if composition throws
```

Fixed scope IDs:

```text
ode_wave1_context
ode_wave1_method
ode_wave1_data
ode_wave1_output
```

Every render creates all four replacement scopes; inactive scopes remain empty.
This ensures that an active term closes when its surface disappears and that
only an exact same-scope/same-term trigger can receive a pinned or mobile
transfer. Preview never transfers. No DOM lookup is used to find replacements.

## 8. Exact annotation map

The complete 21-field records in
[the content packet](../../content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md#4-proposed-exact-annotation-map)
are normative. This table is the matching implementation map:

| ID | Term | Route | Current file and owner | Exact trigger text | Context/surface | Scope | Existing/new | Status |
|---|---|---|---|---|---|---|---|---|
| `ODE-W1-ANN-001` | `ordinary_differential_equation` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `DEFAULT_LEDE`, `render` | `ordinary differential equation` | revised Lab lede | `context` | New exact lede composition | Pending |
| `ODE-W1-ANN-002` | `initial_value_problem` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `DEFAULT_LEDE`, `render` | `initial value problem` | same revised Lab lede | `context` | New exact lede composition | Pending |
| `ODE-W1-ANN-003` | `initial_condition` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderForm` | `Initial condition` | sibling of native initial-value label | `data` | New companion text | Pending |
| `ODE-W1-ANN-004` | `step_size` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderForm`, `renderCompareForm` | `Time-step size` | sibling of native `Time-step size h` label | `data` | New companion text | Pending |
| `ODE-W1-ANN-005` | `time_grid` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · both form owners | `time grid` | fixed-grid helper text | `data` | New exact helper | Pending |
| `ODE-W1-ANN-006` | `numerical_approximation` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `mountResults` | `Final numerical approximation` | existing result label | `output` | Existing text | Pending |
| `ODE-W1-ANN-007` | `exact_solution` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderForm` | `Exact solution` | standalone heading before checkbox label | `data` | New companion heading | Pending |
| `ODE-W1-ANN-008` | `explicit_scheme` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderChoosePanel` | `Explicit scheme` | Method helper outside cards | `method` | New exact helper | Pending |
| `ODE-W1-ANN-009` | `forward_euler_method` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderForm` | `Forward Euler` | existing selected-method heading | `data` | Existing text | Pending |
| `ODE-W1-ANN-010` | `backward_euler_method` | `/ode/initial-value-problems` | `src/ode/odeApp.ts` · `renderForm` | `Backward Euler` | existing selected-method heading | `data` | Existing text | Pending |

The following record-specific matrix completes the first/repeated-use,
rerender, result-survival, duplicate, dependency, and review fields. Together
with the implementation table above and the shared behavior immediately below,
it contains all 21 required fields for every annotation; the content packet
retains the same values in individually readable records.

| ID | First-use or repeated-use status | Rerender lifecycle | Survives result rerender? | Duplicate-term policy | Implementation dependency | Review status |
|---|---|---|---|---|---|---|
| `ODE-W1-ANN-001` | First in `ode_wave1_context` | Controlled same-scope replacement | Yes, through exact context replacement | Breadcrumb and later ODE mentions remain plain | E1 card; E2 lede copy, composition, and binding | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-002` | First in `ode_wave1_context` after ANN-001 | Controlled same-scope replacement | Yes, through exact context replacement | Title, breadcrumb, and later IVP mentions remain plain | E1 card; E2 lede copy, composition, and binding | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-003` | First in `ode_wave1_data` | Recreated in the Data transaction | No across Data-to-Output | Other initial-value wording remains plain | E1 card; E2 Data composition and accessibility tests | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-004` | First in `ode_wave1_data`; current single or Compare form only | Controlled Data replacement | No across Data-to-Output; yes for exact Data replacement | Lede and Convergence stay plain; Compare creates no simultaneous duplicate | E1 card; E2 label companion and both form tests | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-005` | First in `ode_wave1_data` | Controlled Data replacement | No across Data-to-Output | Output, chart, Compare, and Convergence grid wording remains plain | Approved helper copy; E1 card; E2 composition | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-006` | First in `ode_wave1_output` | Controlled Output replacement | Yes only through an exact successful-output replacement; otherwise closes | Compare, chart, tooltip, table, and Tutor wording remains plain | E1 core card and ODE override; E2 Output composition | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-007` | First in `ode_wave1_data` | Controlled Data replacement | No across Data-to-Output | Checkbox, preset, Convergence, and Output references remain plain | E1 card; E2 Data composition | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-008` | First in `ode_wave1_method` | Controlled Method replacement | No after leaving Method | Method-card `Explicit` wording remains plain | Approved helper copy; E1 card; E2 composition and no-nesting tests | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-009` | First in `ode_wave1_data` when Forward Euler is selected | Controlled Data replacement | No across Data-to-Output | Selection card, result heading, metadata, Convergence, and Tutor remain plain | E1 card; E2 selected-heading composition | `PENDING_MAINTAINER_REVIEW` |
| `ODE-W1-ANN-010` | First in `ode_wave1_data` when Backward Euler is selected | Controlled Data replacement | No across Data-to-Output | Selection card, result heading, metadata, diagnostics, Convergence, and Tutor remain plain | E1 card; D02 choice; E2 selected-heading composition | `PENDING_MAINTAINER_REVIEW` |

For every record:

- trigger type is the framework native text-like button;
- desktop uses existing focus/hover preview and pin behavior;
- mobile uses the existing modal sheet;
- the accessible name equals the exact visible text;
- Enter and Space retain native activation and Escape closes through the Host;
- rerender uses the named controlled scope transaction;
- route disposal follows Host close/disconnect then Lab disposal;
- no target is editable MathLive, a nested control, raw formula token, chart
  canvas, numeric cell, diagnostic, Tutor transcript, or scanned text;
- same-scope later occurrences remain plain text;
- the exact per-record dependency and pending status remain unchanged between
  this design and the content packet.

### 8.1 `/ode` evaluation

Current safe-looking strings are the overview lede's “ordinary differential
equations” and the card's “Initial Value Problems Lab.” They are not proposed
because the route is static and the accepted optional binding is a complete-Lab
contract. The breadcrumb on the complete Lab is also rejected because it is
already a link.

If the maintainer requires `/ode` annotations, the exact gap is that
`RouteModule` has no route-owned Glossary binding lifecycle and static page
mounts do not pass through `createCompleteLabRoute`. Adding that capability
would change the accepted framework/route ownership and requires a separate
design and authorization. It is not E2.

## 9. Accessibility design

- No trigger is nested in a method-card button, route link, native label, or
  checkbox label.
- Existing native input labels stay independently named and clickable.
- New Data companion triggers are sibling controls with their own visible
  names.
- Method selection cards remain one native button with unchanged selection
  semantics.
- Selected-method headings may contain one term button because the heading is
  not interactive; its accessible heading text must remain coherent.
- Preview, pinned, and mobile behavior use the already accepted Host/surface
  contracts without a new modal or focus owner.
- The exact formula records provide one `accessibleText` string and use the
  existing readonly renderer only after a card opens.
- E2 tests must cover label/input/trigger relationships, heading names, focus
  order, first-occurrence behavior, same-scope duplicates, rerender transfer,
  close restoration, mobile focus containment, and route disposal.

## 10. Density policy

Recommended policy:

- one reviewed primary annotation for each Wave 1 term;
- first enhanced occurrence per explicit scope;
- no repeated annotation merely because a term appears again;
- no automatic DOM scanning;
- no nested control;
- no editable input, raw math token, chart canvas, tooltip, numeric cell,
  validation error, diagnostic, or Tutor transcript annotation;
- author exact new helper text only where the current safe DOM has no honest
  occurrence.

The proposed count is 10: two context, one Method, six Data, and one Output.
Method-card names remain unannotated because each card is already a native
button. This is a deliberate accessibility choice, not an omission discovered
after implementation.

## 11. Tutor relationship

The framework contains an injectable generic `GlossaryTutorHandoff`, but the
current production adapter does not supply one. Recommended Wave 1 policy:

- keep the generic contract compatible;
- connect the ODE binding without `tutorHandoff`;
- show no Ask the Tutor action in production Wave 1;
- send no automatic request;
- create no queue, card, Keep/Replace behavior, transcript item, topic schema,
  or API path;
- leave the current Tutor binding/session ownership unchanged.

This represents provisional policy Option A without inventing the absent
production integration: the generic affordance may be used only if a later
separately approved product design supplies the existing contract. Option B
would explicitly disable the relationship as a product policy. Option C is a
new queue/card design outside Group E.

## 12. Lazy-loading and bundle design

### E1

No route imports the new data. Therefore:

```text
entry/Home/static graph -> unchanged
ODE lazy graph          -> unchanged
production emitted data -> absent
visible behavior        -> none
```

### E2

`src/ode/odeApp.ts` statically imports `src/ode/odeGlossary.ts` inside the
already dynamic complete-Lab boundary. That module imports ODE content,
selected core content, registry/scope/controller code, and no surface runtime.

```text
entry/Home/static graph
  -> lightweight inert Host and surface loader only

complete ODE route
  -> ODE glossary composition, ten cards, scopes, triggers, binding

first valid definition open
  -> existing lazy surface runtime/CSS

first formula enhancement
  -> existing deferred readonly MathLive path
```

Tutor, editable MathLive, Compute Engine, Chart.js, and ODE solver ownership do
not move. E2 must extend source-graph tests so the entry and all static pages
exclude `coreGlossary`, `odeGlossaryContent`, `odeGlossary`, registry, scope,
controller, definitions, and fixtures.

## 13. Rollout and rollback

### E1 — Content data only

Possible future commit: `Add reviewed ODE Glossary Wave 1 content`

Scope:

- two approved core entries;
- eight approved ODE entries;
- two ODE module overrides;
- aliases and safe formula records;
- content validation tests;
- no route import, annotation, binding, or visible behavior.

Verification:

- exact ten IDs and formulas;
- builder/registry validation;
- duplicate/alias conflicts;
- module override resolution;
- source-graph proof that data is unreferenced by entry, static pages, and ODE
  route;
- production manifest/emitted marker absence.

Rollback: revert E1 alone. No visible or session state exists.

Authorization: not authorized.

### E2 — Explicit annotations and ODE binding

Possible future commit: `Connect ODE Glossary Wave 1`

Scope:

- `src/ode/odeGlossary.ts`;
- `getGlossaryBinding` exposure through current ODE mount/route types;
- exactly ten explicit annotation compositions;
- four controlled scopes;
- focused content-resolution, DOM, accessibility, rerender, disposal, New
  experiment, route-adapter, and lazy-boundary tests;
- visible production vertical slice.

No framework redesign, static `/ode` binding, Tutor handoff, queue, card,
session, numerical, or persistence work.

Browser review:

- 1440×900 and 390×844;
- Method/Data/Output and single/Compare forms;
- Forward/Backward selection;
- preview, pin, sheet, keyboard, focus, close, rerender, New experiment,
  navigation, mobile modal arbitration, overflow, and console health.

Rollback: revert E2 while retaining inert reviewed E1 data. Production returns
to zero visible Glossary behavior.

Authorization: not authorized.

### E3 — Integration review checkpoint

Possible future commit: `Verify ODE Glossary Wave 1 integration`

Scope:

- review/evidence and required status documents only;
- focused and full verification;
- content and annotation checklist closure;
- desktop/mobile evidence;
- manifest, graph, raw/gzip, marker, and production-preview evidence;
- release verdict.

Rollback: documentation-only review commit may be reverted independently; a
blocked verdict leaves E2 local and unreleased for correction or rollback.

Authorization: not authorized.

### F2 — Mandatory post-Glossary consistency review

Separate later gate covering UI, Tutor, Glossary, terminology, accessibility,
lifecycle, production bundle, and cross-surface consistency after E3.

Rollback: findings identify focused correction or E2 rollback boundaries; F2
does not silently rewrite E1/E2.

Authorization: mandatory later, not started and not authorized.

## 14. Required tests for future authorization

### E1 tests

- exact ten IDs, no extra or duplicate;
- every alias accepted only for its owner;
- no cross-term alias conflict;
- formulas and accessible formula explanations match the approved packet;
- all records deeply immutable;
- two core entries resolve with ODE contextual overrides;
- eight ODE records resolve only in the composed ODE registry;
- `implicit_scheme` is not registered;
- no private evidence metadata enters data;
- no production route imports content.

### E2 tests

- one stable binding per Lab mount;
- existing adapter connect/disconnect order;
- four explicit scopes and exactly ten annotations;
- first occurrence enhanced and same-scope duplicates plain;
- no trigger inside link/button/label/checkbox label/MathLive host;
- native input labeling and method-card selection remain intact;
- exact lede/helper/heading/output text;
- explicit rerender transfer and no-replacement close;
- New experiment behavior and pure session snapshots unchanged;
- result values and numerical object identity unchanged;
- failure leaves readable text and usable Lab;
- no meaningful-work, Store, Resume, history, beforeunload, or Tutor-session
  mutation;
- Home/static graphs exclude all content and binding modules;
- surface, readonly math, Tutor, and editable math lazy boundaries remain
  separate.

### E3/F2 evidence

Run focused suites first, then full `npm.cmd run verify`, `git diff --check`,
desktop/mobile browser review, source graph, manifest/Rollup graph, emitted
marker scan, raw/gzip measurements, and production-preview checks. Do not claim
real screen-reader, physical touch, remote, or deployment evidence unless it
is actually obtained under a later authorization.

## 15. Framework-gap result

The recommended complete-Lab-only Wave 1 design needs no framework interface
or behavior change. The existing registry, binding, scopes, Host port, loader,
surface, modal environment, optional `getGlossaryBinding`, and adapter disposal
order are sufficient.

Two optional requests would create separate gaps:

1. `/ode` annotations require a static-route binding ownership/lifecycle
   design.
2. A production Ask the Tutor button requires an approved owner that injects
   the existing generic handoff; a real queue/card remains a larger product
   design.

Neither gap is part of the recommended E1/E2 path or automatically authorized.

## 16. Maintainer decision cards

Every selection below is deliberately blank.

### D01 — Exact ten-term set

- **Question:** Approve the exact ten IDs in Section 3?
- **Options:** A — retain exactly ten; B — return the set for a new scoped
  revision; C — defer Wave 1.
- **Codex recommendation:** A.
- **Rationale:** The set is coherent and catalog-stable; the implicit gap can
  be handled inside Backward Euler.
- **Architectural impact:** A preserves the validated registry boundary.
- **Accessibility impact:** A supports one primary trigger per term.
- **Bundle/lazy-loading impact:** A fixes a bounded ten-card ODE payload.
- **Test impact:** Exact-count and no-extra assertions remain simple.
- **Rollback impact:** E1 can be reverted as one content boundary.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D02 — `implicit_scheme` handling

- **Question:** How should Backward Euler proceed without a standalone
  `implicit_scheme` card?
- **Options:** A — retain ten, make Backward Euler self-contained, and name the
  future term as plain text; B — expand to eleven and redo wave artifacts;
  C — remove Backward Euler until the prerequisite exists.
- **Codex recommendation:** A.
- **Rationale:** The current Backward Euler card can explain the solved
  next-value equation without a broken dependency or link.
- **Architectural impact:** A needs no new entry or annotation.
- **Accessibility impact:** A avoids a nonfunctional related-term control.
- **Bundle/lazy-loading impact:** A preserves the ten-card budget.
- **Test impact:** Assert no registered `implicit_scheme` and no live link.
- **Rollback impact:** A remains within the single-card E1 boundary.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D03 — Teaching order

- **Question:** Which prerequisite-aware card order should govern review?
- **Options:** A — ODE, initial condition, IVP, step size, time grid,
  numerical approximation, exact solution, explicit scheme, Forward Euler,
  Backward Euler; B — provisional ODE, IVP, initial condition order; C —
  maintainer-specified order.
- **Codex recommendation:** A.
- **Rationale:** It introduces both prerequisites before the IVP and the grid
  before \(u_n\).
- **Architectural impact:** None.
- **Accessibility impact:** Logical review/navigation order is clearer.
- **Bundle/lazy-loading impact:** None.
- **Test impact:** Documentation/content-order assertion only.
- **Rollback impact:** Reordering data is isolated before E1 approval.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D04 — Core versus ODE ownership

- **Question:** Which content split should E1 use?
- **Options:** A — two core (`numerical_approximation`,
  `explicit_scheme`) and eight ODE; B — promote exact solution and step size
  too; C — keep all ten ODE-owned.
- **Codex recommendation:** A.
- **Rationale:** Only two cards are reusable without weakening the required ODE
  meaning.
- **Architectural impact:** A uses existing core plus ODE composition.
- **Accessibility impact:** No behavior difference.
- **Bundle/lazy-loading impact:** Core data is still imported only by ODE in
  E2.
- **Test impact:** Two override-resolution cases plus eight ODE records.
- **Rollback impact:** Core and ODE data can be reverted together in E1.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D05 — Core definition and ODE override policy

- **Question:** How should the two core entries gain current-Lab context?
- **Options:** A — core definition plus ODE contextual/why/Tutor overrides;
  B — core text only; C — duplicate complete ODE records.
- **Codex recommendation:** A.
- **Rationale:** It uses the existing override model and avoids duplicated
  authoritative definitions.
- **Architectural impact:** A keeps general and module-specific ownership
  separate.
- **Accessibility impact:** Complete cards retain concise context.
- **Bundle/lazy-loading impact:** No additional runtime edge.
- **Test impact:** Override fallback, replacement, and immutability tests.
- **Rollback impact:** Remove the ODE extension without altering core records.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D06 — Annotation density

- **Question:** How dense should Wave 1 be?
- **Options:** A — exactly ten primary annotations; B — fewer than one per
  card; C — annotate repeated useful occurrences.
- **Codex recommendation:** A.
- **Rationale:** Every approved card is discoverable while the UI avoids
  trigger clutter.
- **Architectural impact:** A fixes four scopes and ten IDs.
- **Accessibility impact:** Bounded tab stops and no control saturation.
- **Bundle/lazy-loading impact:** Negligible relative to fixed content.
- **Test impact:** Exact annotation-count and scope distribution assertions.
- **Rollback impact:** Individual records remain removable before E2 approval.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D07 — Repeated occurrence policy

- **Question:** Should repeated terms become interactive?
- **Options:** A — first occurrence per explicit scope only; B — first
  occurrence for the whole route; C — one per major surface.
- **Codex recommendation:** A.
- **Rationale:** It is the accepted framework policy and supports local
  discoverability without scanning.
- **Architectural impact:** A uses framework scope state unchanged.
- **Accessibility impact:** Repeats stay readable plain text with fewer tab
  stops.
- **Bundle/lazy-loading impact:** None.
- **Test impact:** Same-scope duplicate and cross-scope tests.
- **Rollback impact:** Scope records are explicit.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D08 — ODE overview scope

- **Question:** Should `/ode` receive Wave 1 triggers?
- **Options:** A — no; keep Wave 1 on the complete Lab; B — defer overview
  annotations to a separate static-route design; C — require a framework/route
  extension before E2.
- **Codex recommendation:** A, with B as the future path if desired.
- **Rationale:** Static pages have no Lab-owned binding contract.
- **Architectural impact:** A preserves accepted ownership; C opens a separate
  framework decision.
- **Accessibility impact:** A avoids an ad hoc route-level focus/lifecycle
  owner.
- **Bundle/lazy-loading impact:** A keeps static `/ode` content-neutral.
- **Test impact:** Static graph remains free of registries/content.
- **Rollback impact:** No static change exists to unwind.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D09 — IVP Method annotation scope

- **Question:** How should method concepts be exposed without nested buttons?
- **Options:** A — one Method helper for explicit scheme and selected-method
  Data headings for Forward/Backward Euler; B — refactor method cards into
  composite cards; C — omit method annotations.
- **Codex recommendation:** A.
- **Rationale:** It preserves method-card selection semantics and still exposes
  all three cards.
- **Architectural impact:** A needs no new component architecture.
- **Accessibility impact:** No nested interactive control.
- **Bundle/lazy-loading impact:** None.
- **Test impact:** Method-card non-change plus heading/helper tests.
- **Rollback impact:** Remove three explicit compositions without reverting
  card behavior.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D10 — Data annotation scope

- **Question:** Approve the four Data concepts plus two selected-method
  headings?
- **Options:** A — six Data-scope annotations as mapped; B — only existing-text
  targets; C — annotate additional interval/equation labels.
- **Codex recommendation:** A.
- **Rationale:** It covers the required concepts while preserving native labels
  and excluding MathLive.
- **Architectural impact:** A uses one Data scope.
- **Accessibility impact:** Sibling controls retain independent input names.
- **Bundle/lazy-loading impact:** None.
- **Test impact:** Label/input/trigger, single/Compare, and MathLive-exclusion
  coverage.
- **Rollback impact:** Data composition can be reverted as one E2 section.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D11 — Output annotation scope

- **Question:** How many Output labels should be interactive?
- **Options:** A — only `Final numerical approximation`; B — also repeat exact
  solution and time grid; C — no Output annotation.
- **Codex recommendation:** A.
- **Rationale:** It names the central computed quantity without cluttering
  chart/table/Convergence content reserved for later waves.
- **Architectural impact:** One Output scope record.
- **Accessibility impact:** One bounded additional tab stop.
- **Bundle/lazy-loading impact:** None.
- **Test impact:** Result rerender and Compare-plain-text checks.
- **Rollback impact:** One explicit record.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D12 — Editable MathLive exclusion

- **Question:** May Wave 1 annotate editable math content?
- **Options:** A — exclude all editable MathLive and raw formula tokens; B —
  allow only a separately reviewed readonly display target; C — design an
  editable-field integration.
- **Codex recommendation:** A.
- **Rationale:** User-authored math is not curated Glossary authority.
- **Architectural impact:** A avoids editor ownership changes.
- **Accessibility impact:** No nested/custom-editor control conflict.
- **Bundle/lazy-loading impact:** Annotation does not trigger editable math.
- **Test impact:** Explicit DOM/source exclusion assertions.
- **Rollback impact:** No editor change exists.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D13 — Tutor handoff policy

- **Question:** What Tutor behavior belongs in Wave 1?
- **Options:** A — remain compatible with the generic handoff but inject none
  in E2; B — explicitly disable Glossary-to-Tutor for Wave 1; C — design a new
  queue/card integration.
- **Codex recommendation:** A.
- **Rationale:** It preserves the framework seam without claiming the absent
  production owner or creating queue behavior.
- **Architectural impact:** Adapter continues `connect(binding)` only.
- **Accessibility impact:** No inactive or misleading Ask action.
- **Bundle/lazy-loading impact:** Tutor stays independently lazy.
- **Test impact:** Assert no button, request, queue, card, or transcript change.
- **Rollback impact:** No Tutor code to revert.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D14 — Content-only E1 gate

- **Question:** Should reviewed content land inertly before binding work?
- **Options:** A — separate E1 content-only commit; B — combine E1/E2; C —
  defer content.
- **Codex recommendation:** A.
- **Rationale:** It permits focused mathematical review and a zero-visible-
  behavior rollback boundary.
- **Architectural impact:** Data files remain unreferenced.
- **Accessibility impact:** None until E2.
- **Bundle/lazy-loading impact:** Production emitted artifacts exclude the
  unreferenced data.
- **Test impact:** Content/build graph only.
- **Rollback impact:** Revert E1 independently.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D15 — Binding/annotation E2 gate

- **Question:** Should visible integration be a separate E2 authorization?
- **Options:** A — yes, exact mapped integration only; B — combine with E1;
  C — defer visible behavior.
- **Codex recommendation:** A.
- **Rationale:** Visible lifecycle and accessibility risk deserves its own
  gate.
- **Architectural impact:** Adds ODE composition and existing optional binding.
- **Accessibility impact:** Requires focused and browser review.
- **Bundle/lazy-loading impact:** Adds content/controller code only to the lazy
  ODE graph.
- **Test impact:** Full focused integration matrix.
- **Rollback impact:** Revert E2 while retaining inert E1 data.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D16 — Integration-review E3 gate

- **Question:** Require a separate review checkpoint after E2?
- **Options:** A — yes, documentation/evidence commit; B — fold review into E2;
  C — skip a dedicated checkpoint.
- **Codex recommendation:** A.
- **Rationale:** It separates implementation from final evidence and verdict.
- **Architectural impact:** None.
- **Accessibility impact:** Captures desktop/mobile acceptance.
- **Bundle/lazy-loading impact:** Records manifest and browser evidence.
- **Test impact:** Focused/full/browser/bundle gates.
- **Rollback impact:** Blocked review can hold or roll back E2.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D17 — Mandatory F2 gate

- **Question:** Preserve a separate post-Glossary consistency review?
- **Options:** A — mandatory F2 after E3; B — fold F2 into E3; C — make F2
  optional.
- **Codex recommendation:** A.
- **Rationale:** F2 must compare the real UI, Tutor, Glossary, accessibility,
  lifecycle, terminology, and bundle after integration.
- **Architectural impact:** None in E0–E3.
- **Accessibility impact:** Independent cross-surface review.
- **Bundle/lazy-loading impact:** Rechecks final production boundaries.
- **Test impact:** Full consistency suite and browser evidence.
- **Rollback impact:** Findings map to focused E1/E2 corrections.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

### D18 — Production activation criteria

- **Question:** What explicitly authorizes visible production activation?
- **Options:** A — accepted cards/decisions plus a separately authorized E1,
  then E2, then accepting E3 and later F2; B — E1 content approval activates
  automatically; C — completing this checklist is sufficient.
- **Codex recommendation:** A.
- **Rationale:** Documentation approval, content data, visible integration, and
  release evidence are different authority boundaries.
- **Architectural impact:** Prevents accidental route import during E1.
- **Accessibility impact:** Requires reviewed E2 behavior before visibility.
- **Bundle/lazy-loading impact:** Requires graph/artifact proof before release.
- **Test impact:** Each gate has its own acceptance criteria.
- **Rollback impact:** E1, E2, and review evidence remain separable.
- **Maintainer selection:** Unselected.
- **Maintainer notes:** —
- **Review date:** Pending.

## 17. Acceptance criteria for this design packet

This E0 packet is complete only when:

- all ten cards contain all 29 required fields;
- the exact annotation map contains ten real-file/real-owner records and all 21
  required fields;
- all 18 decisions remain unselected;
- the approval checklist has zero checked boxes;
- the core/ODE split has no duplicate content authority;
- the chosen recommended path needs no framework change;
- `/ode` and Tutor gaps are explicit rather than silently implemented;
- E1, E2, E3, and F2 remain unauthorized;
- no production source, test, CSS, package, config, or deployment file changes;
- local structured validation passes and remains ignored.

Meeting these criteria means the design is ready for maintainer decisions. It
does not mean Group E is authorized.
