# Rich Glossary Content Model Extension Implementation Plan

**Status:** Repository-grounded plan complete; implementation authorization
required

**Date:** 2026-07-29

**Planning baseline:** `bb7e8f13aa1ee7b7478f3f5c17820d4beb23a284`
(`Design rich Glossary content model extension`)

**Requested future implementation commit:** `Extend Glossary rich content
model`

**Authority:**

- [Rich Glossary Content Model and Complete Surface Design](../specs/2026-07-29-rich-glossary-content-model-design.md)
- [Rich Glossary Content Field Matrix](../../content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md)
- [Rich Glossary Content Model Design Readiness Review](../../reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md)
- [Content-Agnostic Interactive Glossary Framework Design](../specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
- [Accepted Framework Final Review](../../reviews/2026-07-28-content-agnostic-interactive-glossary-framework-final-review.md)

This document is an execution contract, not implementation authorization. It
adds no runtime field, production entry, annotation, ODE binding, or Tutor
behavior. E1 remains incomplete.

## 1. Starting state and planning evidence

The planning task started on branch `main` at the exact accepted design commit
with a clean worktree. Source inspection confirmed:

- `src/glossary/coreGlossary.ts` still exports an exactly empty, frozen
  `coreGlossaryEntries`;
- no ODE route creates a Glossary binding or annotation;
- the complete surface remains lazy through
  `src/glossary/glossarySurfaceLoader.ts`;
- the ten neutral Playground entries remain DEV-only;
- the current compact entry, override, and resolved-entry shapes cannot carry
  the accepted rich fields; and
- the current Host and modal contracts already provide all outer-surface
  ownership needed by the extension.

The clean focused planning baseline passed:

```powershell
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts src/glossary/glossaryRegistry.test.ts src/glossary/glossaryScope.test.ts src/glossary/glossaryController.test.ts src/glossary/glossarySurfaceLoader.test.ts src/glossary/surface/glossarySurfaceRuntime.test.ts src/app/platformGlossaryHost.test.ts src/app/platformModalEnvironment.test.ts src/app/platformGlossaryTutorIntegration.test.ts src/math/ui/readonlyMath.test.ts src/dev/glossary/glossaryPlaygroundRoute.test.ts src/app/developmentRoutes.test.ts src/app/routeBundleOwnership.test.ts src/app/viteBase.contract.test.ts
```

Result: **14 files and 132 tests passed**. The Vite contract test performed a
temporary production build and passed the current manifest and DEV-exclusion
checks.

The latest verified source-equivalent pre-E production baseline is:

| Artifact | Raw bytes | Deterministic gzip bytes |
|---|---:|---:|
| Main JS | 52,815 | 16,329 |
| Main CSS | 9,518 | 2,240 |
| Lazy Glossary surface JS | 6,769 | 2,450 |
| Lazy Glossary surface CSS | 2,203 | 783 |

That build contained 8 JavaScript files, 7 CSS files, 12 normalized static
import edges, and 5 unique dynamic import edges. Later Wave 1/rich-model design
commits through the planning baseline were documentation-only. These values
are a review reference, not a substitute for fresh implementation evidence.
The implementer must capture a new build/manifest baseline from the then
current authorized HEAD before editing and compare the final build against it.

## 2. Exact repository ownership inventory

### 2.1 Runtime model, builders, registry, and scope

| File | Current symbols and responsibility | Callers | Test owner | Reachability / lazy ownership | Planned disposition |
|---|---|---|---|---|---|
| `src/glossary/glossaryRuntimeTypes.ts` | `GlossaryTermId`, `GlossaryFormula`, `GlossaryEntry`, `GlossaryModuleOverride`, `ResolvedGlossaryEntry`, `GlossaryDiagnostic`, `GlossarySurfaceRequest` | builders, registry, controller/scope, Host, surface, DEV fixtures/tests | Compile coverage through all focused TypeScript callers; no separate runtime-types test exists | Type-only imports erase where applicable; model is generic framework code | Modify types only |
| `src/glossary/glossaryBuilders.ts` | `defineGlossaryEntry`, `defineGlossaryModuleExtension`, ID/display/formula copy and validation, `GlossaryValidationError`, bounded diagnostic sink | registry tests, controller/scope tests, Host tests, DEV fixtures and diagnostics | `src/glossary/glossaryBuilders.test.ts` | Framework path; no surface DOM | Modify construction, allow-lists, copying, local validation |
| `src/glossary/glossaryRegistry.ts` | `GlossaryRegistry`, `createGlossaryRegistry`, alias ownership, override map, `resolve`, clone/freeze/composition | controller/scope; DEV Playground; focused tests | `src/glossary/glossaryRegistry.test.ts` | Not in the Home/static eager graph; production registry data remains empty | Modify registry-wide validation, composition, and by-ID resolution |
| `src/glossary/coreGlossary.ts` | empty frozen `coreGlossaryEntries` | future registry composition and tests | `src/glossary/glossaryRegistry.test.ts` | Production data owner | Read-only; must remain exactly empty |
| `src/glossary/glossaryScope.ts` | `createGlossaryScope`, first occurrence, native trigger, surface-request construction, term disposal | `createLabGlossaryBinding` | `src/glossary/glossaryScope.test.ts` | Complete-Lab/framework path, not Home/static entry | Modify only to construct and attach one module-aware resolver capability |
| `src/glossary/glossaryController.ts` | stable binding, scope generations, rerender transactions, connection and replacement lifecycle | future Lab binding; DEV Playground | `src/glossary/glossaryController.test.ts` | Complete-Lab/DEV ownership | Read-only regression owner |

There is no barrel export to update. These modules export their public types
and builders directly. All existing callers found by repository search are in
the files listed above, the Host/surface files below, and their focused tests.

### 2.2 Surface, Host, modal, formula, and Tutor boundary

| File | Current owner | Test owner | Planned disposition |
|---|---|---|---|
| `src/glossary/surface/glossarySurfaceRuntime.ts` | compact preview DOM; complete pinned/mobile DOM; formula handle; current live scope snapshot; internal listeners; mobile focus trap; close reasons; optional Tutor action; surface disposal | `src/glossary/surface/glossarySurfaceRuntime.test.ts` | Modify complete-card renderer and add surface-local card navigation; preserve preview |
| `src/glossary/surface/glossarySurface.css` | preview/pinned/sheet sizing, internal content scroll, header, formula overflow, forced colors | surface tests plus required browser review | Modify minimally |
| `src/glossary/glossarySurfaceLoader.ts` | cached lazy dynamic import and retry | `src/glossary/glossarySurfaceLoader.test.ts` | Read-only regression owner |
| `src/app/platformGlossaryHost.ts` | one active surface, lazy-load generations, original trigger/scope identity, placement, outside dismissal, trigger replacement, mode change, modal lease, close/focus restoration, Tutor suspension | `src/app/platformGlossaryHost.test.ts` | Source read-only; its request fixtures must gain the required resolver |
| `src/app/platformModalEnvironment.ts` | single platform modal lease, inert background, body scroll lock | `src/app/platformModalEnvironment.test.ts` | Source and test read-only regression owners |
| `src/math/ui/readonlyMath.ts` | immediate accessible fallback, deferred MathLive enhancement, one `role="math"` owner, revision and disposal checks | `src/math/ui/readonlyMath.test.ts` | Source and test read-only regression owners |
| `src/glossary/glossaryTutorContract.ts` | existing structured `GlossaryTutorRequest` and optional handoff interface | `src/app/platformGlossaryTutorIntegration.test.ts` | Source read-only; no topic/payload/queue change |

Rich-card navigation can remain entirely surface-owned. The Host already
passes the request through, keeps the original annotation identity, and owns
the only popover or modal lease. Trigger replacement spreads the active
request, so the resolver capability is retained without Host source changes.
Host mode changes dispose and remount the surface from the original request,
which correctly resets related navigation.

The actual `GlossaryTutorRequest` contains term ID, module ID, scope ID, and
optional curated scope context; it does not contain `tutorTopic`. Therefore
this implementation must not add a Tutor-contract field. The composed
`tutorTopic` remains entry metadata. The optional action sends the currently
displayed card's term ID through the existing contract; curated scope context
is sent only for the original annotated term.

### 2.3 DEV Playground and production exclusion

| File | Current owner | Test owner | Planned disposition |
|---|---|---|---|
| `src/dev/glossary/glossaryFixtures.ts` | ten neutral entries, stable fixture IDs/scopes, math alias, dynamic context variants, DEV marker | `src/dev/glossary/glossaryPlaygroundRoute.test.ts` | Add neutral rich fields and one module extension; no production content |
| `src/dev/glossary/glossaryPlaygroundRoute.ts` | actual binding/registry/Host exercise route, fixture sections, dynamic context, replacement, mock Tutor, diagnostics, reset/disposal | `src/dev/glossary/glossaryPlaygroundRoute.test.ts` | Pass the neutral extension and expose existing controls/card paths needed for review |
| `src/dev/glossary/glossaryPlayground.css` | route laboratory layout, not the surface visual system | Playground browser review | Read-only unless implementation evidence proves a route-only layout defect; not expected in scope |
| `src/app/developmentRoutes.test.ts` | DEV-only route injection and production absence | same file | Read-only regression owner |
| `src/app/routeBundleOwnership.test.ts` | static-import graph and DEV/Glossary eager-boundary assertions | same file | Read-only regression owner; existing path checks already cover the planned files |
| `src/app/viteBase.contract.test.ts` | temporary production build, manifest lazy edges, DEV source/string/CSS exclusion | same file | Modify only to add a unique rich-fixture marker exclusion |

The development route is entered through the existing DEV-only injection. No
new route or production registry is needed.

## 3. Exact runtime and builder type changes

### 3.1 Runtime records

Add to `src/glossary/glossaryRuntimeTypes.ts`:

```ts
export type GlossaryRelatedTerm =
  | Readonly<{
      kind: "term";
      termId: GlossaryTermId;
    }>
  | Readonly<{
      kind: "future";
      label: string;
    }>;

export interface GlossaryMisconception {
  readonly statement: string;
  readonly correction: string;
}
```

Extend `GlossaryEntry` with these optional fields, retaining all current
required and optional fields:

```ts
readonly fullDefinition?: string;
readonly intuition?: string;
readonly assumptionsAndLimits?: string;
readonly misconception?: GlossaryMisconception;
readonly prerequisiteTermIds?: readonly GlossaryTermId[];
readonly relatedTerms?: readonly GlossaryRelatedTerm[];
readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
readonly moduleNote?: string;
```

Extend `GlossaryModuleOverride` with:

```ts
readonly moduleNote?: string;
readonly prerequisiteTermIds?: readonly GlossaryTermId[];
readonly relatedTerms?: readonly GlossaryRelatedTerm[];
readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
```

Keep the existing:

```ts
readonly contextualDefinition?: string;
readonly whyItMattersHere?: string;
readonly formula?: GlossaryFormula | null;
readonly tutorTopic?: string;
```

Do not add canonical override keys for ID, label, aliases, `definition`,
`fullDefinition`, intuition, assumptions/limits, or misconception.

Extend `ResolvedGlossaryEntry` with every canonical rich field plus the four
context-composable fields (`moduleNote`, prerequisite IDs, related terms, and
confused terms). It continues to include `contextualDefinition`,
`whyItMattersHere`, composed/suppressed `formula`, `moduleId`, and authored
`display`.

### 3.2 Builder inputs

Add builder-only input records:

```ts
export type GlossaryRelatedTermInput =
  | Readonly<{ kind: "term"; termId: string }>
  | Readonly<{ kind: "future"; label: string }>;

export interface GlossaryMisconceptionInput {
  readonly statement: string;
  readonly correction: string;
}
```

Add the corresponding optional fields to `GlossaryEntryInput`. Add only
`moduleNote`, prerequisite IDs, related terms, and confused terms to
`GlossaryModuleOverrideInput`. Existing compact object literals remain valid.

Top-level entry keys are allow-listed as:

```text
id, label, aliases, definition, fullDefinition, intuition, whyItMatters,
formula, assumptionsAndLimits, misconception, prerequisiteTermIds,
relatedTerms, commonlyConfusedTerms, moduleNote, tutorTopic
```

Top-level override keys are allow-listed as:

```text
termId, contextualDefinition, whyItMattersHere, formula, moduleNote,
tutorTopic, prerequisiteTermIds, relatedTerms, commonlyConfusedTerms
```

The runtime check rejects every unrecognized own enumerable key, including a
canonical key smuggled into an override through JavaScript or a cast.

### 3.3 Read-only related-card resolver

Add:

```ts
export interface GlossarySurfaceTermResolver {
  resolve(termId: GlossaryTermId): ResolvedGlossaryEntry | undefined;
}
```

Add a required `termResolver: GlossarySurfaceTermResolver` to
`GlossarySurfaceRequest`.

Extend the actual registry interface:

```ts
export interface GlossaryRegistry {
  resolve(
    moduleId: LabModuleId,
    termId: GlossaryTermId,
    display: GlossaryTermDisplay
  ): GlossaryResolution;

  resolveById(
    moduleId: LabModuleId,
    termId: GlossaryTermId
  ): ResolvedGlossaryEntry | undefined;
}
```

`resolveById` uses the same cloned entries, validated extension, and
composition helper as annotation resolution. It supplies the canonical label
as `display`, creates no trigger, claims no scope occurrence, emits no
surface-time unknown-term diagnostic, and returns `undefined` for an
unexpected missing ID.

`createGlossaryScope()` creates one frozen module-aware resolver per scope:

```ts
const termResolver: GlossarySurfaceTermResolver = Object.freeze({
  resolve: (termId) => options.registry.resolveById(options.moduleId, termId),
});
```

Every request from the scope includes that same resolver. It is a transient
runtime capability alongside the request's existing DOM identities and live
context source. It is never session data.

## 4. Validation contract and exact ownership

### 4.1 Error pattern

Preserve the current pattern:

- `GlossaryValidationError` remains the only strict error type;
- its stable message remains
  `Glossary validation failed: <diagnostic.code>`;
- its frozen `diagnostic` remains the structured assertion surface;
- strict mode fails immediately on the first diagnostic;
- production fallback reports each equivalent diagnostic once through the
  existing bounded `GlossaryDiagnosticSink` and returns/filters invalid data;
  and
- no aggregate validator or second validation framework is introduced.

Add these focused diagnostic codes:

```ts
| "invalid_content_field"
| "unexpected_content_field"
| "invalid_related_term"
| "duplicate_prerequisite"
| "duplicate_live_reference"
| "duplicate_future_label"
| "self_reference"
| "unknown_live_reference"
| "duplicate_override_target"
```

Extend `GlossaryDiagnostic` with:

```ts
readonly field?: string;
readonly relatedTermId?: string;
```

Add both values to `diagnosticKey()` so bounded fallback reporting does not
collapse distinct fields or reference targets. Existing diagnostic codes and
message prefixes do not change.

### 4.2 Plain-data and text safety

Add private helpers in `glossaryBuilders.ts` rather than a new module:

- `isPlainDataRecord(value)` accepts only records whose prototype is
  `Object.prototype` or `null`;
- `rejectUnexpectedKeys(record, allowedKeys, sink, context)` enforces exact
  top-level and nested allow-lists;
- `copyNonemptyText(value, field, sink, termId)` requires a string with
  `trim().length > 0` but preserves the authored string; and
- copy helpers for misconception, term-ID arrays, and related-term arrays.

Formula, math-display, misconception, and relationship records use plain-data
checks and exact nested key allow-lists. DOM nodes, functions, class instances,
arrays in object positions, and extra nested objects fail before rendering.
HTML-looking text remains valid text and is assigned with `textContent`; it is
not parsed or executed.

### 4.3 Rule-to-owner matrix

| Rule | Primary owner | Timing and fallback |
|---|---|---|
| Stable entry/override/reference IDs | existing `validateTermId` plus new list copy helpers in `glossaryBuilders.ts` | Builder time; invalid record returns `undefined` in fallback |
| Nonempty required/optional prose | `defineGlossaryEntry`, `defineGlossaryModuleExtension`, `copyNonemptyText` | Builder time; whitespace-only or non-string value rejects the record |
| Formula/accessibility/display pair | strengthened existing `copyGlossaryFormula` | Builder time; preserves current diagnostic and display modes |
| Alias/math-display plain shape | strengthened existing `copyGlossaryTermDisplay` | Builder and annotation-resolution time |
| Unexpected entry or nested fields | `defineGlossaryEntry` allow-lists | Builder time, `unexpected_content_field` |
| Override attempt to replace canonical fields or any unknown key | `defineGlossaryModuleExtension` override allow-list | Builder time, `unexpected_content_field` with exact `field` |
| Misconception statement/correction presence and shape | `copyGlossaryMisconception` | Entry builder only; override has no such field |
| Duplicate prerequisite ID | `copyGlossaryPrerequisiteIds` | Per entry/override list, builder time |
| Self prerequisite | same helper, comparing owner `termId` | Builder time; repeated after composition for raw-input defense |
| Malformed relationship/future label | `copyGlossaryRelatedTerms` | Builder time |
| Duplicate live ID | same helper | Within each individual related/confused list only |
| Duplicate future label | same helper | Exact authored label within each individual list only; no case folding or cross-list rejection |
| Self live related/confused link | same helper | Builder time; repeated after composition |
| Duplicate entry ID | existing registry entry collection | Registry construction |
| Conflicting label/alias owner | existing registry display-key map | Registry construction; exact current display-key rules |
| Unknown override target | existing registry extension collection | Registry construction |
| Duplicate override target | registry extension collection | Registry construction; later duplicate is rejected instead of silently ignored |
| Unknown live prerequisite/related/confused ID | final registry relationship validation | After all entries and extensions are collected, before registry return |
| Deeply immutable composed output | registry clone/composition helpers | Before `resolve`/`resolveById` returns |
| Unexpected missing surface target | `GlossarySurfaceTermResolver.resolve` and surface click handler | Returns/no-ops; current card and focus stay unchanged |

Future labels are excluded from live-resolution checks. The same live term may
appear once in `relatedTerms` and once in `commonlyConfusedTerms`; only
within-list duplication is rejected.

### 4.4 Registry fallback behavior

Strict construction throws immediately. In production fallback:

- a locally malformed builder record is omitted because its builder returns
  `undefined`;
- a duplicate entry, invalid override target, or later duplicate override is
  diagnosed and omitted as today;
- a raw/cast live reference that survives builder boundaries but is missing,
  self-referential, or duplicated is diagnosed and removed from that composed
  list before freezing; and
- remaining valid card content stays readable, with no broken relationship
  button.

Registry validation runs once over canonical entries and once over each
module-composed relationship set. A present override list replaces the base
list before that module's final reference validation.

Surface lookup is deliberately not a second content validator. It only fails
closed if a supposedly valid by-ID target is unexpectedly unavailable.

## 5. Deep immutability and composition

### 5.1 Builder copies

`defineGlossaryEntry()` must create fresh frozen values for:

- aliases array and every math-display alias;
- formula;
- misconception;
- prerequisite array;
- related array and every union record;
- confused array and every union record; and
- the containing entry.

`defineGlossaryModuleExtension()` must create fresh frozen values for:

- every override;
- every optional formula;
- every optional prerequisite array;
- every optional related/confused array and union record;
- the overrides array; and
- the extension.

No nested object or array supplied by a caller is retained.

### 5.2 Registry clones and composed cards

`cloneEntry()` and `cloneOverride()` repeat the deep copy because the public
registry accepts typed runtime records, not only builder results. Add shared
private clone helpers for formulas, misconceptions, term-ID lists,
relationships, and displays.

Use one private composition helper for both `resolve` and `resolveById`:

```text
canonical cloned entry
-> locate at most one validated module override
-> select each allowed field property-by-property
-> validate the final module relationship sets
-> deep-clone and freeze one ResolvedGlossaryEntry
```

Canonical fields are always retained:

```text
id, label, aliases, definition, fullDefinition, intuition, whyItMatters,
assumptionsAndLimits, misconception
```

Context-composable fields use these semantics:

| Field | Present override | Absent override |
|---|---|---|
| `contextualDefinition` | add contextual paragraph | no contextual paragraph |
| `whyItMattersHere` | use contextual why text | use base `whyItMatters` |
| `formula` | replace; `null` suppresses | retain base formula |
| `moduleNote` | replace complete value | retain base module note |
| `tutorTopic` | replace complete value | retain base topic |
| `prerequisiteTermIds` | replace complete list, including explicit empty list | retain base list |
| `relatedTerms` | replace complete list, including explicit empty list | retain base list |
| `commonlyConfusedTerms` | replace complete list, including explicit empty list | retain base list |

No array concatenation is allowed. The composed entry contains no override
object and creates no second canonical card.

### 5.3 Required mutation tests

`glossaryBuilders.test.ts` must mutate every original input after construction
and prove that built aliases, formula, misconception, prerequisite list,
related/confused arrays and records, override arrays, and nested records remain
unchanged and frozen.

`glossaryRegistry.test.ts` must pass manually assembled mutable runtime records,
mutate them after registry construction, and prove that `resolve` and
`resolveById` return unchanged, deeply frozen entries. It must also attempt
mutation of a resolved list/object (expecting a TypeError or unchanged value,
according to the test environment) and prove a later resolution is unchanged.

DEV tests must prove that resetting or remounting the route cannot retain a
fixture mutation from a prior mount.

## 6. Complete surface rendering

### 6.1 Compact preview non-change

The preview branch in `mountGlossarySurface()` remains structurally unchanged:

1. `strong.glossary-preview-label` using the authored visible display;
2. one paragraph using `entry.definition`; and
3. `p.glossary-preview-prompt` with the existing prompt.

Keyboard status text remains label + `definition` + prompt. Preview renders no
formula, rich section, relationship, Back control, or Tutor action. Existing
safe-text behavior remains based on `textContent`.

### 6.2 Complete-card renderer

Replace the current one-time compact complete DOM with a private
surface-local renderer, for example:

```ts
function renderCompleteCard(card: SurfaceCardState): void
```

The outer `root`, header, content scroll container, Close button, Host
listeners, modal identity, and original trigger stay mounted. Each card render
disposes the prior formula handle, clears/rebuilds only card-dependent header
and content children, and installs one new formula handle if needed.

Use a card-aware visible-display helper. The original card title uses its
authored `entry.display`; a by-ID related card has the canonical label as its
display. Do not keep reading `options.request.display` after internal
navigation.

Keep the optional standard-label paragraph immediately before the numbered
sections when `entry.display` differs from `entry.label`. It is metadata, not
an additional peer section.

Render one `h2` card title with the existing stable `aria-labelledby` ID and
`tabIndex = -1`. Render the exact section order below with `h3` headings,
omitting optional sections whose composed content is absent or an empty list:

1. **Full definition** - always present; one paragraph with
   `fullDefinition ?? definition`. If nonempty contextual definition differs
   from that rendered canonical text, append a subordinate paragraph with
   visible inline label `In this context:`.
2. **Plain-language intuition** - optional `intuition`.
3. **Why it matters here** - always present, using current original-term
   snapshot value, then composed `whyItMattersHere`, then `whyItMatters`.
4. **Formula** - optional effective formula; retain readonly math's one
   accessible owner.
5. **Assumptions and limits** - optional `assumptionsAndLimits`.
6. **Common misconception** - optional; two paragraphs with visible labels
   `Misconception` and `Correction`.
7. **In this Lab** - optional `moduleNote`.
8. **Prerequisites** - optional nonempty semantic list of live native buttons.
9. **Related terms** - optional nonempty semantic list of live buttons and
   future plain text.
10. **Often confused with** - optional nonempty semantic list with the same
    live/future behavior.
11. Existing `.glossary-surface-actions` and Ask button, only when
    `onAskTutor` exists.

The old placeholder `No additional context is available.` is removed. An
absent contextual definition creates no placeholder or separate **In this
context** section. The old **Formula example** heading becomes **Formula**.

Live relationship controls are native `button[type="button"]` elements with
their resolved canonical labels as text/accessibility names. Future items are
plain `span`/list text, never buttons, links, or `tabindex` owners.

### 6.3 Live context and formula ownership

Retain `latestSnapshot`, but apply `currentTermContext()` only when the
displayed card ID equals `options.request.termId`. A related card uses only its
immutable module-composed entry. Returning to the original card immediately
reapplies the latest snapshot.

`updateContext()` must not rebuild the complete card or move focus. While the
original card is displayed, patch only the contextual paragraph within the
existing Full definition section, the existing why paragraph, and the formula
target/handle. While a related card is displayed, store the newer snapshot
without touching DOM. This preserves the current same-root and focused-control
contract.

Every card render and context-driven formula replacement:

1. disposes `formulaHandle`;
2. clears its prior target;
3. computes suppression/replacement;
4. renders at most one readonly handle; and
5. leaves exactly one `role="math"` and one `aria-label`.

No hidden duplicate formula explanation is added.

### 6.4 Minimal CSS changes

Modify only `src/glossary/surface/glossarySurface.css` to add:

- a header-actions wrapper holding conditional Back and existing Close;
- compact spacing for peer sections and semantic lists;
- readable visible labels for misconception/correction;
- wrapping native relationship buttons styled as text-like secondary
  controls, with visible `:focus-visible`;
- visually distinct but non-color-only future labels;
- safe wrapping for long headings, labels, prose, and controls;
- retained horizontal formula overflow inside the formula region;
- forced-colors borders/text/focus for Back and relationship controls; and
- any flex/min-height rule needed to preserve the current internal content
  scrolling.

Do not change modal ownership, global tokens, Playground visual design, or
introduce animation beyond the existing reduced-motion contract.

## 7. Related navigation state and lifecycle

### 7.1 Exact state

For complete modes only, the mounted surface owns:

```ts
interface SurfaceCardState {
  readonly entry: ResolvedGlossaryEntry;
  readonly isOriginalAnnotation: boolean;
}

let currentCard: SurfaceCardState;
let previousCard: SurfaceCardState | undefined;
let latestSnapshot: GlossaryScopeSnapshot | undefined;
```

`currentCard` starts with `options.request.entry`;
`isOriginalAnnotation` is true only when its ID equals
`options.request.termId`. The request resolver supplies related cards.

### 7.2 Forward and Back transitions

Forward activation performs:

```text
resolve requested ID
-> if missing or same as current, no-op
-> previousCard = currentCard
-> currentCard = resolved target
-> render
-> focus connected new h2 with preventScroll
```

This produces:

```text
A -> B: current B, previous A
B -> C: current C, previous B; A discarded
Back: current B, previous undefined
```

Back is a small native header button. It is absent/hidden when
`previousCard` is undefined. Successful Back renders the stored card, clears
the slot, and focuses the restored connected heading. A second Back is
impossible.

Missing targets and self-targets do not render, mutate history, or move focus.
Future labels do not have handlers.

### 7.3 Lifecycle edge cases

| Event | Required result |
|---|---|
| Explicit Close, Escape, outside dismissal | Existing Host close path disposes the surface; current/previous/latest snapshot become unreachable |
| Route disconnect | Host closes/disposes before Lab disposal; no surface navigation survives |
| Scope disposal | Existing request identity closes; no related state survives |
| Annotated trigger replacement in a committed scope rerender | Host retains the mounted surface and calls `replaceTrigger`; current related card and one Back slot remain; original close focus transfers to the replacement trigger |
| Annotated entry/trigger disappears during replacement | Existing Host closes the surface; navigation is discarded |
| Desktop/mobile mode change | Host disposes and remounts from the original request; navigation restarts at annotated A with no Back |
| Loader failure/Retry before mount | No card navigation state exists; successful retry starts at annotated A |
| Live context update while related card is displayed | Save latest snapshot but do not apply it to the related card |
| Return to annotated card | Apply latest valid original-term snapshot |
| Related Ask action | Use current card ID; do not borrow original curated context |
| Surface disposal during pending optional handoff | Preserve existing disposed/connected guards; no new state owner |

The mobile Tab trap already queries current focusable descendants on each
keydown, so rebuilt Back/relationship controls are automatically included.
The desktop one-shot trigger-to-surface Tab bridge remains consumed once and
is not rearmed by related navigation.

Keep the existing pending-handoff behavior across card renders with one
surface-local `handoffPending` boolean. A newly rendered optional action
reflects the same disabled `Opening Tutor...` state until the existing promise
settles; this prevents a second submission if a development injector leaves
the surface mounted while navigation occurs. The production Host still closes
the surface synchronously before awaiting the injected handoff.

### 7.4 No state leakage

Do not import or write:

- `AppSessionStore`;
- ODE or other Lab sessions;
- Tutor sessions/transcripts;
- History API state;
- localStorage, sessionStorage, or IndexedDB; or
- meaningful-work metadata.

The resolver closure, current card, previous card, heading reference, and
latest snapshot exist only for one mounted lazy surface.

## 8. Compatibility and migration proof

### 8.1 Builder and registry tests

Extend `src/glossary/glossaryBuilders.test.ts` to prove:

- a legacy compact entry literal builds unchanged;
- a legacy compact override literal builds unchanged;
- all new fields are optional;
- every rich nested value is copied and frozen;
- all exact allow-lists and local diagnostics work;
- formula validation and current ID/display diagnostics remain stable; and
- HTML-looking prose remains data while DOM/functions/classes/unknown records
  are rejected.

Extend `src/glossary/glossaryRegistry.test.ts` to prove:

- current compact fallback/context/formula behavior is unchanged;
- `fullDefinition` and canonical rich fields survive composition;
- allowed override fields replace/fall back exactly;
- explicit empty override arrays suppress base lists;
- duplicate override targets fail;
- duplicate/self/unknown live references fail at the assigned seam;
- future labels do not require registry IDs;
- `resolveById` returns a canonical-label display and the same composed card as
  authored-display resolution;
- production fallback removes invalid controls and reports bounded
  diagnostics;
- resolved output is deeply frozen; and
- `coreGlossaryEntries` remains exactly empty and frozen.

### 8.2 Scope and request tests

Extend `src/glossary/glossaryScope.test.ts` to assert:

- the request carries one frozen resolver;
- it resolves a second valid entry under the same module composition;
- it does not create a trigger or reserve a first occurrence;
- a missing ID returns `undefined`; and
- existing first-occurrence, fallback, connection, and disposal behavior is
  unchanged.

No controller API changes are needed. Run
`src/glossary/glossaryController.test.ts` unchanged as a regression owner.

### 8.3 Surface tests

Extend `src/glossary/surface/glossarySurfaceRuntime.test.ts` with behavioral,
non-snapshot assertions for:

- exact preview text/DOM exclusions with a rich entry;
- complete section heading order;
- `fullDefinition ?? definition` and no duplicate preview definition;
- contextual definition subordinate rendering and omission;
- every optional-section omission on a legacy entry;
- structured misconception labels;
- semantic lists, live buttons, and future noninteractive text;
- one accessible formula owner through initial render, snapshot replace,
  suppression, related navigation, Back, and disposal;
- A -> B -> C one-slot history and Back disappearance;
- missing/self target no-op;
- heading focus after forward/Back;
- latest original context isolation/reapplication;
- mobile focus recalculation with dynamic controls;
- desktop one-shot Tab bridge not rearmed;
- current-card Tutor term ID and no borrowed context;
- existing pending label/disable behavior;
- safe text construction; and
- idempotent disposal.

Because `GlossarySurfaceRequest.termResolver` is required, add neutral
resolver fixtures to this test and to direct request helpers in:

- `src/app/platformGlossaryHost.test.ts`; and
- `src/app/platformGlossaryTutorIntegration.test.ts`.

Those two files change only enough to construct the new transient request
capability and preserve existing Host/Tutor integration assertions. Host and
Tutor source do not change.

### 8.4 Regression-only owners

Run without source/test modification unless an authorized implementation
finding proves otherwise:

- `src/glossary/glossaryController.test.ts`;
- `src/glossary/glossarySurfaceLoader.test.ts`;
- `src/app/platformModalEnvironment.test.ts`;
- `src/math/ui/readonlyMath.test.ts`;
- `src/app/developmentRoutes.test.ts`;
- `src/app/routeBundleOwnership.test.ts`; and
- `src/app/vercelRouting.contract.test.ts`.

There is no production content migration. Existing annotations and bindings
would keep calling `createTerm({ termId, display })`; none currently exist in
production.

## 9. Neutral DEV fixture plan

Keep all current stable fixture IDs. Do not introduce a Wave 1 ID, approved
definition, private-source wording, or real numerical concept.

Enrich `sample_term` with neutral fixture-only content:

- a short `definition` that stays the preview body;
- a distinct `fullDefinition`;
- `intuition`;
- `assumptionsAndLimits`;
- structured `misconception`;
- `moduleNote`;
- prerequisite link to `short_term`;
- live related link to `dynamic_term`;
- future related label `Future fixture concept`;
- live confused link to `plain_term`; and
- its existing or a neutral display-only formula/accessibility pair.

Use `long_term` to exercise long rich paragraphs, long relationship labels,
internal scrolling, and wrapping. Keep `short_term` or `plain_term` compact
with all optional rich fields omitted to prove legacy behavior.

Export one frozen neutral `GLOSSARY_FIXTURE_EXTENSION` from
`glossaryFixtures.ts` using `defineGlossaryModuleExtension`. Apply it in
`createGlossaryRegistry({ extensions: [...] })` inside
`glossaryPlaygroundRoute.ts`. Give one existing neutral entry base
relationship lists and replacement override lists so the Playground and
registry tests exercise present-list replacement, `moduleNote`, and existing
context fields without a parallel fixture model.

Add one unmistakable marker such as
`Rich relationship fixture - development only.` to the rich fixture and assert
in `src/app/viteBase.contract.test.ts` that it is absent from emitted
JavaScript. Retain all existing DEV marker exclusions.

Extend the Playground test to exercise:

- rich sample card and exact section order;
- omitted compact card;
- live prerequisite/related/confused navigation;
- future label noninteractivity;
- A -> B -> C one-level Back;
- heading focus;
- module override output;
- formula ownership;
- mobile sheet controls and focus trap;
- reset/remount immutability; and
- existing replacement, dynamic context, diagnostics, logs, and mock Tutor.

No new production route, content module, registry entry, annotation, or
binding is added.

## 10. Tests-first implementation sequence

The implementation is one authorized task, but must preserve red/green
evidence within the working session.

### Step 1 - clean baseline and artifact capture

Require the authorized HEAD, branch `main`, a clean worktree, and no other
writer. Run:

```powershell
git branch --show-current
git rev-parse HEAD
git status --short
git log --oneline --decorate -15
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts src/glossary/glossaryRegistry.test.ts src/glossary/glossaryScope.test.ts src/glossary/glossaryController.test.ts src/glossary/glossarySurfaceLoader.test.ts src/glossary/surface/glossarySurfaceRuntime.test.ts src/app/platformGlossaryHost.test.ts src/app/platformModalEnvironment.test.ts src/app/platformGlossaryTutorIntegration.test.ts src/math/ui/readonlyMath.test.ts src/dev/glossary/glossaryPlaygroundRoute.test.ts src/app/developmentRoutes.test.ts src/app/routeBundleOwnership.test.ts src/app/viteBase.contract.test.ts
npm.cmd run typecheck
```

Create a temporary production build outside tracked source, record manifest
keys/static/dynamic edges, JS/CSS file counts, and raw/gzip sizes, then remove
only that verified temporary directory.

### Step 2 - builder/type red gate

Modify only `glossaryBuilders.test.ts` first. Add compile-visible legacy and
rich inputs, allow-list, nested-shape, local duplicate/self, future-label,
formula, safe-text, and mutation tests.

Red command:

```powershell
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts
npm.cmd run typecheck
```

Expected red reason: missing rich input/runtime fields and missing diagnostics,
not an unrelated baseline failure.

### Step 3 - registry/composition red gate

Add the composition, by-ID resolution, duplicate override, final live
reference, fallback-filter, and deep immutability tests to
`glossaryRegistry.test.ts`.

```powershell
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts src/glossary/glossaryRegistry.test.ts
```

### Step 4 - implement model and local construction

Modify `glossaryRuntimeTypes.ts` and `glossaryBuilders.ts` exactly as Sections
3 and 4 specify. Do not touch surface, Host, Tutor, Store, ODE, or content.

### Step 5 - implement registry composition and final validation

Modify `glossaryRegistry.ts`. Use one composition helper for `resolve` and
`resolveById`; add no second registry/card model.

Green gate:

```powershell
npm.cmd run test:run -- src/glossary/glossaryBuilders.test.ts src/glossary/glossaryRegistry.test.ts
npm.cmd run typecheck
```

### Step 6 - scope resolver red/green gate

Add the request-resolver cases to `glossaryScope.test.ts`, then modify only
`glossaryScope.ts` to create and attach the frozen resolver.

```powershell
npm.cmd run test:run -- src/glossary/glossaryScope.test.ts src/glossary/glossaryController.test.ts
```

### Step 7 - complete renderer red gate

Extend `glossarySurfaceRuntime.test.ts` with exact order, omission, fallback,
safe-text, structured misconception/list, and formula-owner cases. Update its
request helper with the resolver.

```powershell
npm.cmd run test:run -- src/glossary/surface/glossarySurfaceRuntime.test.ts
```

### Step 8 - implement rich optional sections

Refactor only the complete branch in `glossarySurfaceRuntime.ts`. Preserve the
preview branch and outer surface contract. Add the minimum CSS in
`glossarySurface.css`.

### Step 9 - navigation/focus red gate

Add A -> B -> C, Back, missing/self, heading focus, context isolation,
current-card handoff, mobile focusable recalculation, trigger bridge, and
disposal cases.

```powershell
npm.cmd run test:run -- src/glossary/surface/glossarySurfaceRuntime.test.ts
```

### Step 10 - implement one-level history

Add only surface-local `currentCard`, `previousCard`, latest snapshot, renderer,
and focus transfer. Do not modify Host/modal/Tutor source.

### Step 11 - update direct request test fixtures

Add frozen no-op or real neutral resolvers to:

- `platformGlossaryHost.test.ts`;
- `platformGlossaryTutorIntegration.test.ts`; and
- any compiler-reported direct `GlossarySurfaceRequest` fixture.

Run:

```powershell
npm.cmd run test:run -- src/glossary/surface/glossarySurfaceRuntime.test.ts src/app/platformGlossaryHost.test.ts src/app/platformModalEnvironment.test.ts src/app/platformGlossaryTutorIntegration.test.ts src/math/ui/readonlyMath.test.ts
```

### Step 12 - neutral DEV fixtures

Update `glossaryFixtures.ts`, `glossaryPlaygroundRoute.ts`,
`glossaryPlaygroundRoute.test.ts`, and the rich marker assertion in
`viteBase.contract.test.ts`.

```powershell
npm.cmd run test:run -- src/dev/glossary/glossaryPlaygroundRoute.test.ts src/app/developmentRoutes.test.ts src/app/routeBundleOwnership.test.ts src/app/viteBase.contract.test.ts
```

### Step 13 - cumulative focused green gate

Run the exact 14-file baseline command from Section 1. Every existing test and
all new rich cases must pass.

### Step 14 - typecheck and complete verification

```powershell
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run verify
```

Require all tests, both TypeScript checks, the production build, and only the
accepted large deferred-chunk warning. Do not suppress or broaden tests.

### Step 15 - browser review

Run the existing local DEV application and review
`/__dev/glossary-playground` at 1440 x 900 and 390 x 844. Use the existing
local-only Playground; do not contact external services.

Verify:

- unchanged compact preview;
- every rich section in exact order;
- compact legacy card omissions;
- canonical/context definition behavior;
- one formula accessible owner;
- live and future relationships;
- one-level Back and focus transfer;
- current-card optional mock Tutor handoff;
- Escape and explicit Close;
- desktop placement and internal scroll;
- mobile named sheet, focus trap, scroll lock, internal scroll;
- long formula/label/prose wrapping;
- no page overflow; and
- no console warning/error.

### Step 16 - production-preview and bundle review

Use a local production build/preview only. Verify:

- `__dev/glossary-playground` is Not Found;
- `coreGlossaryEntries` remains empty;
- no production term, annotation, or ODE binding is visible;
- no Wave 1 ID/content marker or new rich DEV marker occurs in emitted assets;
- entry/Home/static eager graph is unchanged;
- the manifest retains dynamic edges for ODE, Tutor, and
  `src/glossary/surface/glossarySurfaceRuntime.ts`;
- readonly MathLive and Tutor stay separately lazy;
- JS/CSS file counts and normalized static/dynamic edges match baseline unless
  a reviewed Rollup hashing/merge difference is explained;
- main entry raw/gzip change is zero or a type-erasure/minification-only
  variance explained by the graph; and
- lazy Glossary surface JS/CSS growth is measured and accepted as the designed
  location for rich DOM/navigation.

No deployment or external traffic is required or authorized.

### Step 17 - review, status, and one commit

Create the implementation review specified in Section 13, update only the
listed status documents, self-review the exact diff, run `git diff --check`,
stage only authorized files, and create one commit:

```text
Extend Glossary rich content model
```

Do not amend or push.

## 11. Verification matrix

| Concern | Focused owner/evidence |
|---|---|
| Types and legacy compile compatibility | builder/registry/request fixture TypeScript plus `npm.cmd run typecheck` |
| Builder validation and deep copy | `glossaryBuilders.test.ts` |
| Registry IDs, aliases, override targets, references, composition, fallback | `glossaryRegistry.test.ts` |
| Resolver/request construction and occurrence neutrality | `glossaryScope.test.ts` |
| Binding/rerender lifecycle | unchanged `glossaryController.test.ts` |
| Compact preview | `glossarySurfaceRuntime.test.ts` exact DOM/text exclusions |
| Complete order/omission/fallback | `glossarySurfaceRuntime.test.ts` |
| Related/future/prerequisite/confused rendering | `glossarySurfaceRuntime.test.ts` and Playground |
| One-level Back, focus, context isolation, disposal | `glossarySurfaceRuntime.test.ts` |
| One active surface, trigger transfer, mode changes, route/scope close | `platformGlossaryHost.test.ts` plus surface tests |
| Mobile modal/inert/scroll | unchanged `platformModalEnvironment.test.ts`, Host tests, Playground/browser |
| Formula accessible ownership | surface integration cases plus unchanged `readonlyMath.test.ts` |
| Optional Tutor boundary | surface current-ID case plus `platformGlossaryTutorIntegration.test.ts` |
| Loader retry | unchanged `glossarySurfaceLoader.test.ts` |
| DEV fixture behavior | `glossaryPlaygroundRoute.test.ts` and browser review |
| DEV production exclusion | `developmentRoutes.test.ts`, `viteBase.contract.test.ts` |
| Entry/static/lazy graph | `routeBundleOwnership.test.ts`, manifest inspection |
| Full application/API/build | `npm.cmd run verify` |

## 12. Exact implementation scope and rollback

### 12.1 Expected modified production source

```text
src/glossary/glossaryRuntimeTypes.ts
src/glossary/glossaryBuilders.ts
src/glossary/glossaryRegistry.ts
src/glossary/glossaryScope.ts
src/glossary/surface/glossarySurfaceRuntime.ts
src/glossary/surface/glossarySurface.css
```

### 12.2 Expected modified DEV source

```text
src/dev/glossary/glossaryFixtures.ts
src/dev/glossary/glossaryPlaygroundRoute.ts
```

`src/dev/glossary/glossaryPlayground.css` is not expected to change.

### 12.3 Expected modified tests

```text
src/glossary/glossaryBuilders.test.ts
src/glossary/glossaryRegistry.test.ts
src/glossary/glossaryScope.test.ts
src/glossary/surface/glossarySurfaceRuntime.test.ts
src/app/platformGlossaryHost.test.ts
src/app/platformGlossaryTutorIntegration.test.ts
src/dev/glossary/glossaryPlaygroundRoute.test.ts
src/app/viteBase.contract.test.ts
```

No new source or test file is required.

### 12.4 Read-only regression files

```text
src/glossary/coreGlossary.ts
src/glossary/glossaryController.ts
src/glossary/glossaryController.test.ts
src/glossary/glossarySurfaceLoader.ts
src/glossary/glossarySurfaceLoader.test.ts
src/glossary/glossaryTutorContract.ts
src/app/platformGlossaryHost.ts
src/app/platformModalEnvironment.ts
src/app/platformModalEnvironment.test.ts
src/math/ui/readonlyMath.ts
src/math/ui/readonlyMath.test.ts
src/app/developmentRoutes.test.ts
src/app/routeBundleOwnership.test.ts
src/app/vercelRouting.contract.test.ts
src/dev/glossary/glossaryPlayground.css
```

If implementation evidence proves a read-only source file must change, stop
and obtain scope approval rather than silently broadening the commit.

### 12.5 Prohibited scope

Do not modify:

- production Glossary content or `coreGlossaryEntries`;
- ODE source, annotations, or a Lab Glossary binding;
- Tutor contract/runtime/queue/API/transcript behavior;
- Store, Router, History, sessions, meaningful-work, or browser storage;
- numerical algorithms/contracts;
- packages, configuration, deployment, or dependencies;
- approved Wave 1 wording, IDs, content packet, or design;
- private references or evidence metadata; or
- README/public release claims.

### 12.6 One atomic commit

Source inspection confirms one commit is safer than two. The new optional
types are only useful with their builder/registry guarantees, and the
relationship records are only learner-usable with the lazy renderer and
resolver. A partial model-only or renderer-only commit would create an
unaccepted intermediate capability.

One commit keeps:

```text
types + validation + composition + resolver + surface + neutral fixtures +
focused tests + implementation review/status
```

as one backward-compatible unit. Reverting `Extend Glossary rich content
model` restores the accepted compact framework without touching Wave 1
governance, A-D language, or any production Glossary data. No database,
session, annotation, or content migration must be rolled back.

## 13. Implementation review and status contract

The later implementation must create:

```text
docs/reviews/2026-07-29-rich-glossary-content-model-implementation-review.md
```

Required sections:

1. Metadata
2. Authorization
3. Starting state
4. Runtime type changes
5. Builder and validation changes
6. Override composition
7. Surface rendering
8. Related-term navigation
9. Accessibility and focus
10. Compatibility
11. DEV fixture evidence
12. Focused tests
13. Full verification
14. Browser evidence
15. Production-preview evidence
16. Bundle/import evidence
17. Explicit non-changes
18. Findings
19. Verdict
20. E1 restart status

Expected passing verdict:

```text
RICH GLOSSARY MODEL IMPLEMENTED — READY FOR MAINTAINER ACCEPTANCE
```

Use a correction/blocking verdict if any requirement is not proven. The
implementation review does not itself accept the commit or authorize E1.

Status updates during implementation are limited to:

```text
PLAN.md
docs/INDEX.md
docs/PROJECT_HANDOFF.md
docs/content/HANDOFF.md
docs/content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md
```

Do not alter approved Wave 1 card wording.

## 14. E1 restart contract

The stopped E1 attempt is historical evidence, not a worktree to resume.

After the generic implementation is independently accepted:

1. require a new explicit E1 authorization;
2. start from the new clean accepted `main` HEAD;
3. rerun E1's inertness precondition: empty production registry, no
   production annotation, no ODE binding, and no visible production surface;
4. reread the approved Wave 1 packet and map every runtime-safe field through
   the implemented rich schema and field matrix;
5. add inert content data and focused content validation only;
6. do not add an annotation, binding, visible surface, or production Tutor
   handoff in E1; and
7. stop for independent E1 acceptance.

E2 remains unauthorized until E1 is accepted. E3 and mandatory Group F2 retain
their separate gates.

## 15. Plan acceptance gate

This plan closes the repository mapping, exact APIs, validation ownership,
immutability, rendering, navigation, compatibility, verification, scope,
rollback, and E1 restart questions. It does not authorize implementation.

**RICH GLOSSARY IMPLEMENTATION PLAN COMPLETE — AUTHORIZATION REQUIRED**

The repository-grounded rich Glossary implementation plan is complete. No
runtime implementation or Wave 1 content has been added. The next gate is
maintainer acceptance of the plan and separate authorization of the generic
model/builder/surface implementation. E1 remains incomplete and must restart
only after that implementation is accepted.
