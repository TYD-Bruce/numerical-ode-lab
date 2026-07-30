# Rich Glossary Content Model and Complete Surface Design

**Status:** Design complete; implementation not authorized

**Date:** 2026-07-29

**Decision:** `E1-SCHEMA-01 = Option 2`

**Prerequisites:**

- [Content-Agnostic Interactive Glossary Framework Design](2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
- [Accepted Framework Final Review](../../reviews/2026-07-28-content-agnostic-interactive-glossary-framework-final-review.md)
- [ODE Glossary Wave 1 Design](2026-07-29-ode-glossary-wave-1-design.md)
- [Rich Glossary Content Field Matrix](../../content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md)

This design is authoritative for a minimal, content-agnostic rich content-model
and complete-card extension. It changes no source, publishes no term, and does
not resume E1.

## 1. Decision and problem

The maintainer rejects a compact Wave 1 projection. The current accepted model
can represent an ID, label, aliases, one definition, one why-it-matters string,
one optional formula/accessibility pair, and Tutor-topic metadata. It cannot
faithfully represent the approved short/full definition split, intuition,
assumptions and limits, structured misconception/correction, prerequisites,
live and future related terms, commonly confused terms, or module note.

Dropping those fields, concatenating them into one string, or creating an
ODE-only parallel card model would make the approved content packet and the
runtime disagree. E1 therefore stopped before source or test changes. It
remains incomplete.

The selected resolution is a generic model extension plus a richer complete
surface. The existing `definition` name is retained as the compact preview
definition. The complete card uses `fullDefinition ?? definition`.

## 2. Source-grounded baseline

Current source establishes these constraints:

- `GlossaryEntry`, `GlossaryModuleOverride`, `ResolvedGlossaryEntry`, and
  `GlossarySurfaceRequest` live in
  `src/glossary/glossaryRuntimeTypes.ts`.
- builders copy/freeze aliases and formulas, while the registry clones entries,
  applies one module override, and returns a frozen resolved entry;
- `GlossaryScopeController.createTerm()` resolves an authored display and
  creates the request for one explicit annotation;
- `PlatformGlossaryHost` owns the single active surface, the original
  trigger/scope identity, placement, modal coordination, focus restoration,
  asynchronous authority, and disposal;
- the lazy surface owns its DOM subtree, internal listeners, formula handle,
  complete/preview rendering, and mobile focus trap;
- a live scope snapshot can update `contextualDefinition`,
  `whyItMattersHere`, and `formula` for the originally annotated term;
- compact preview currently renders the label and `definition`, plus its
  existing prompt/status behavior; it does not render the formula;
- complete surfaces already have an internally scrollable content region,
  with the mobile header outside that region;
- readonly math already provides one accessible owner, immediate text
  fallback, deferred MathLive enhancement, revision checks, and disposal; and
- the production Core registry is empty and the neutral fixture set is
  DEV-only.

The extension preserves those ownership lines. In particular, the Host does
not become a card navigator, and related navigation does not create a second
popover, sheet, or modal.

## 3. Generic runtime types

The future entry contract is:

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

export interface GlossaryEntry {
  readonly id: GlossaryTermId;
  readonly label: string;
  readonly aliases: readonly GlossaryTermDisplay[];
  readonly definition: string;
  readonly fullDefinition?: string;
  readonly intuition?: string;
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormula;
  readonly assumptionsAndLimits?: string;
  readonly misconception?: GlossaryMisconception;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
  readonly moduleNote?: string;
  readonly tutorTopic: string;
}
```

All new fields are optional. Existing fixtures and future entries using only
the accepted compact fields therefore remain valid.

`definition` is deliberately not renamed. It remains required and feeds the
compact preview. `fullDefinition` is optional and feeds only the complete
card. A complete card renders exactly one canonical definition value:
`fullDefinition ?? definition`.

Accepted aliases remain runtime-safe lookup/display metadata. They are not
governance-only.

### Related-term semantics

`{ kind: "term", termId }` identifies a registered term in the same composed
module registry. It is validated and may render as an in-surface navigation
button.

`{ kind: "future", label }` names a planned or intentionally unavailable
concept. It renders as plain, noninteractive text, receives no focus, opens
nothing, and is not an unresolved reference. It never receives a fake stable
ID. This is the representation for the approved future `implicit scheme`
reference.

### Prerequisite decision

Prerequisites render in v1 of the extension. A nonempty
`prerequisiteTermIds` list becomes a compact **Prerequisites** section in the
complete card. Each item uses the same in-surface navigation behavior as a
live related term. Empty lists omit the section.

Rendering the approved teaching graph is preferable to storing invisible
metadata: it gives the learner a direct path to required concepts while using
the same validated mechanism already needed for related terms.

## 4. Module override contract

The future context-only allow-list retains current source names:

```ts
export interface GlossaryModuleOverride {
  readonly termId: GlossaryTermId;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula | null;
  readonly moduleNote?: string;
  readonly tutorTopic?: string;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
}
```

`contextualDefinition` and `whyItMattersHere` are retained instead of adding
synonymous names. This avoids a needless migration of the implemented
framework.

A module cannot override:

- `id`;
- `label`;
- `aliases`;
- `definition`;
- `fullDefinition`;
- `intuition`;
- `assumptionsAndLimits`; or
- `misconception`.

The answer for canonical intuition is explicitly **no override**. Intuition is
reusable teaching content. Module-local meaning belongs in
`contextualDefinition`, `whyItMattersHere`, and `moduleNote`.

The exact composition order is:

```text
canonical Core entry
-> context-only module override
-> deeply immutable composed entry
```

Composition is property-by-property and deterministic:

- an absent override retains the canonical value;
- `formula: null` suppresses the canonical formula, preserving current
  behavior;
- a present prerequisite/related/confused array replaces that complete
  canonical list; arrays are never concatenated implicitly;
- a present `moduleNote` or `tutorTopic` replaces that contextual presentation
  value;
- `contextualDefinition` and `whyItMattersHere` remain additional context
  fields, not replacements for `definition`, `fullDefinition`, or
  `whyItMatters`; and
- the result is cloned and deeply frozen before resolution returns it.

The resolved entry retains the current `moduleId` and authored `display`, all
canonical base fields, optional composed rich fields, optional
`contextualDefinition`/`whyItMattersHere`, and the composed/suppressed formula.
It does not contain an override object or governance metadata.

The registry never mutates the canonical entry and never constructs an
independent second full card for a Core term. For a module-owned term, the
entry itself supplies the canonical fields; governance documents, not runtime
metadata, record logical and physical ownership.

At presentation time, the existing live scope snapshot may overlay only
`contextualDefinition`, `whyItMattersHere`, and `formula` for the original
annotated term. That transient overlay does not mutate the composed entry and
does not broaden the module override contract.

This preserves Wave 1 decision D05: Core owns canonical mathematical content;
module data adds context only.

## 5. Builder and registry validation

Validation is split at the seam where facts are knowable.

### Entry and override builders

Builders must:

- validate stable IDs with the existing ID contract;
- require all present text fields to be strings and nonempty after the
  project's accepted whitespace policy;
- copy and freeze every array;
- copy and freeze every alias display, formula, misconception object, and
  related-term record;
- reject duplicate prerequisite IDs within one record;
- reject duplicate live related IDs within each related/confused list;
- reject a term's own ID as a prerequisite or live related/confused link;
- reject an empty or whitespace-only future label;
- preserve the current formula contract: nonempty LaTeX, nonempty accessible
  text, and only `inline` or `block` display;
- use an explicit override-key allow-list and reject attempts to supply
  canonical replacement fields; and
- reject non-data payloads such as DOM nodes, functions, class instances, or
  unrecognized nested objects.

Plain strings remain plain text. HTML-looking characters are not executed or
parsed; the surface continues to construct DOM explicitly and insert prose
with `textContent`. This preserves the current safe-text test while forbidding
user HTML authority.

The override builder must reject unknown keys rather than silently discarding
a canonical replacement attempt. The entry builder must likewise prevent
governance/evidence objects from leaking through an unrecognized property.

### Registry-wide validation

After all entries and module overrides are collected, registry construction
must:

- diagnose duplicate stable IDs;
- diagnose conflicting labels/aliases using the existing display-key rules;
- diagnose duplicate or invalid override targets;
- validate every prerequisite ID against the composed registry;
- validate every `kind: "term"` reference against the composed registry;
- ignore `kind: "future"` records for unresolved-live-reference checks;
- re-run self-reference protection after module override composition; and
- clone and deeply freeze every composed field.

Strict DEV policy throws using the existing validation mechanism. Controlled
production fallback remains readable and inert: invalid entries/references do
not create broken interactive controls, and diagnostics remain bounded by the
existing sink behavior. Future implementation may add focused diagnostic
codes, but must not weaken existing codes or failure policy.

Duplicate checks are per semantic list. The same term may appear in
`relatedTerms` and `commonlyConfusedTerms` when the authored teaching purpose
is intentionally different; that cross-list repetition is not automatically
an error.

## 6. Resolution and transient navigation capability

The current registry resolves an annotation by `(moduleId, termId, display)`.
Internal card navigation must not pretend that a related link is another page
annotation. The future registry therefore also exposes a read-only
module-aware resolution seam equivalent to:

```ts
interface GlossarySurfaceTermResolver {
  resolve(termId: GlossaryTermId): ResolvedGlossaryEntry | undefined;
}
```

The binding/scope supplies this resolver with the surface request. It uses the
same already-validated registry and module extension, choosing the canonical
label as the related card's display. It does not create a trigger, claim a
scope occurrence, or write state.

The resolver is runtime-only capability data attached to the transient surface
request. Requests already contain DOM/runtime identities and a live context
source; none enters `AppSessionStore` or a Lab session. The Host passes the
request through without interpreting term relationships.

An unexpected stale/invalid resolution fails closed: the control does not
replace the current card, and the existing surface remains usable.

## 7. Compact preview

Compact preview output remains unchanged:

1. visible label;
2. `definition`;
3. the existing “Click or press Enter for more.” prompt and current
   status/loading/error behavior.

The current preview does not render a formula, so this extension does not add
one. It also does not render full definition, intuition, why-it-matters,
assumptions, misconception, module note, prerequisites, related terms,
confused terms, or Tutor action.

This is a compatibility requirement, not merely a visual preference.

## 8. Complete-card structure

The complete card uses one `h2` card title and `h3` section headings. It renders
the following exact order, omitting empty optional sections:

1. **Full definition**
2. **Plain-language intuition**
3. **Why it matters here**
4. **Formula**
5. **Assumptions and limits**
6. **Common misconception**
7. **In this Lab**
8. **Prerequisites**
9. **Related terms**
10. **Often confused with**
11. the existing Tutor handoff area, only when a handoff injector exists

### Definition and context

The first section renders `fullDefinition ?? definition` exactly once. The
complete card does not render the compact preview body as a second paragraph
when it is identical. If a nonempty `contextualDefinition` exists and differs
from the canonical definition, it follows inside the same first section as a
plain paragraph introduced by the inline text “In this context:”. It is not a
second canonical definition or an extra peer section.

### Why it matters

The third section renders `whyItMattersHere ?? whyItMatters`. The base field
remains required for backward compatibility. A live scope snapshot can replace
the contextual value for the original annotation without remounting.

### Misconception

The misconception section renders two semantic paragraphs with visible text
labels “Misconception” and “Correction”. The labels are not communicated by
color alone. Runtime does not parse a combined string.

### Formula

The formula section uses the existing readonly-math renderer. The fallback
target or enhanced MathLive element is the sole `role="math"` owner at any
instant. The accessible explanation remains the one `aria-label`; no duplicate
screen-reader formula paragraph is added. Replacement or suppression disposes
the prior readonly handle before installing the next one.

### Lists

Prerequisites, related terms, and commonly confused terms use semantic lists.
Live items are native buttons with stable accessible names. Future items are
plain list text and are never focusable.

### Long content

At 1440 x 900, the pinned surface remains viewport-constrained and its content
region scrolls internally while the header/close control remains reachable.
At 390 x 844, the existing modal sheet keeps its named header and close control
outside the internal scroll region, contains focus, prevents page overflow,
and retains the Host/modal environment's scroll-lock ownership. Rich content
does not create nested scroll-lock, inert, modal, or focus-trap owners.

Browser evidence at both sizes is required during implementation; jsdom alone
cannot establish geometry, zoom, wrapping, or real custom-element behavior.

## 9. Related-term navigation and focus

The selected policy is one-level surface-local Back navigation.

When a learner activates a live prerequisite, related term, or confused term:

1. the surface resolves it through the request's read-only resolver;
2. the existing surface replaces only its displayed card subtree;
3. the prior displayed entry becomes the sole Back target;
4. the Host retains the original surface, trigger, scope, placement/modal
   lease, Escape behavior, and disposal authority; and
5. focus moves to the newly rendered card heading, made programmatically
   focusable with `tabindex="-1"` for that transfer.

A small native **Back** button appears in the surface header when a previous
card exists. Activating it restores that immediately previous card, clears the
Back slot, and focuses the restored heading. Selecting a third term replaces
the Back slot with the card just left; history never grows beyond one entry.

This state is:

- owned by the mounted lazy surface;
- bounded to the current surface session;
- cleared on close, route disposal, request replacement, or surface disposal;
- absent from Store, session, Lab state, History API, and meaningful-work
  detection; and
- incapable of opening a second surface.

The surface retains the latest live scope snapshot, but applies it only while
the originally annotated term is displayed. A related card uses its immutable
module-composed entry and never inherits another term's annotation context.
Returning to the original card reapplies the latest valid snapshot.

Future labels remain text, so they never enter the focus order or navigation
history.

Mobile Tab containment recalculates focusable controls after every card
replacement. Desktop's existing one-shot trigger-to-card Tab bridge remains a
Host/surface-entry behavior and is not rearmed by internal term navigation.
Escape continues to close through the Host/modal owner.

## 10. Tutor boundary

Tutor behavior does not change.

`tutorTopic` remains metadata for the existing optional structured handoff. No
Ask button appears unless the current surface was mounted with the existing
injector. No injector, request, queue, transcript mutation, API contract,
Keep/Replace behavior, or automatic Tutor open is added.

If an injector exists in a development or future authorized context, the
existing handoff action describes the currently displayed card and uses its
term ID/topic. A related card receives no borrowed curated context from the
original annotation. This is metadata correctness inside the existing
optional contract, not new Tutor behavior.

Wave 1 decision D13 remains authoritative: the future E1 content-only phase
injects no production handoff.

## 11. Compatibility and migration

The implementation must prove:

- existing entry and module-override inputs compile and build without adding
  new fields;
- existing DEV fixtures remain valid;
- compact preview DOM/text output remains unchanged;
- existing complete cards render `definition` through the fallback and retain
  current context/why/formula behavior;
- the empty production registry remains empty;
- no production term, Wave 1 record, annotation, or ODE binding is added;
- annotation creation, first-occurrence, rerender transaction, Host, and Lab
  binding contracts remain unchanged;
- the current tests are extended with rich cases rather than rewritten
  wholesale;
- no content migration is needed before the generic extension is accepted;
  and
- the blocked E1 worktree is not resumed or reused.

The rich model contains no ODE-specific field, term, path, label, formula, or
ownership metadata.

## 12. Lazy loading, security, and state

The extension adds no dependency and preserves the current import boundaries:

- Home and static pages do not import Glossary surface or content;
- the complete renderer remains in the existing lazy Glossary surface chunk;
- readonly MathLive remains separately deferred;
- Tutor remains separately lazy;
- production Core data remains empty;
- DEV fixtures and Playground remain production-excluded; and
- no ODE content enters the generic implementation.

Richer type and builder code may change the existing small framework path.
Long-form DOM rendering and navigation controls stay inside the lazy surface
runtime. No content is fetched, stored, or executed. All prose is controlled
plain text; formula LaTeX remains display-only; no Markdown, HTML, MathJSON,
`eval`, `new Function`, or arbitrary code authority is introduced.

All surface/navigation state is transient and outside `AppSessionStore`.

## 13. Future implementation scope

A separately authorized implementation should create one coherent commit:

```text
Extend Glossary rich content model
```

Expected production source scope:

- `src/glossary/glossaryRuntimeTypes.ts`
- `src/glossary/glossaryBuilders.ts`
- `src/glossary/glossaryRegistry.ts`
- `src/glossary/glossaryScope.ts`
- `src/glossary/surface/glossarySurfaceRuntime.ts`
- `src/glossary/surface/glossarySurface.css`, only for the designed section,
  control, and scrolling presentation

Expected focused test scope:

- `src/glossary/glossaryBuilders.test.ts`
- `src/glossary/glossaryRegistry.test.ts`
- `src/glossary/glossaryScope.test.ts`, only for resolver/request construction
- `src/glossary/surface/glossarySurfaceRuntime.test.ts`
- existing Host tests only if source evidence shows a compatibility assertion
  is required; no Host behavior rewrite is expected

Expected DEV-only scope:

- `src/dev/glossary/glossaryFixtures.ts`
- directly relevant Playground expectations/styles only if needed to exercise
  every rich section, future text, navigation, Back, and long-content layout

The implementation sequence is:

1. add failing builder/type tests for rich copying, freezing, and local
   validation;
2. add failing registry tests for composition, override restrictions, live
   references, future labels, and unresolved/self/duplicate cases;
3. implement the generic types/builders/registry;
4. add failing surface tests for exact order, omission, fallback, safe text,
   one formula owner, live/future items, one-level Back, focus, current-term
   Tutor metadata, context isolation, and disposal;
5. implement the lazy complete renderer and surface-local navigation;
6. extend neutral DEV fixtures;
7. run focused tests, full verification, manifest/import inspection, production
   exclusion scans, and browser review at 1440 x 900 and 390 x 844; and
8. obtain independent acceptance before restarting E1 from the beginning.

The implementation must not include Wave 1 content, ODE annotations, an ODE
binding, production Tutor integration, numerical/session changes, or a
dependency change.

## 14. Acceptance criteria

Implementation is acceptable only when:

- all fields and shapes in Sections 3 and 4 exist with backward-compatible
  optionality;
- builders and the registry enforce Section 5;
- compact preview is byte/DOM-behavior compatible where existing tests assert
  it;
- complete sections render in the exact order in Section 8;
- related/future/prerequisite/confused behavior matches Sections 3 and 9;
- dynamic context cannot leak from the annotated term to a related term;
- formula accessible ownership remains singular;
- Host/modal/focus/disposal ownership remains unchanged;
- empty production data and DEV production exclusion are proven;
- no Wave 1 content or ODE binding exists;
- focused and full verification pass;
- browser checks cover both required viewports; and
- a separate implementation review accepts the commit.

## 15. Rollback boundary

Reverting the model-extension commit restores the previously accepted compact
framework without touching Wave 1 governance or A-D product language.

No content migration is coupled to that commit. This makes rollback atomic:
types, builders, composition, renderer, neutral fixtures, and their tests move
together; approved content documents remain intact.

## 16. Explicit exclusions and next gate

This design does not:

- implement the model or renderer;
- modify source, tests, CSS, packages, configuration, or deployment;
- add a production entry;
- add an annotation or binding;
- resume or complete E1;
- authorize E2, E3, F2, push, Preview, or Production;
- change Tutor, ODE, numerical, Store, Router, session, or meaningful-work
  behavior; or
- access or publish private-source material.

The next gate is maintainer acceptance of this design and separate
authorization of the generic model/surface implementation. Only after that
implementation is independently accepted may E1 restart from the beginning
against the accepted rich model.
