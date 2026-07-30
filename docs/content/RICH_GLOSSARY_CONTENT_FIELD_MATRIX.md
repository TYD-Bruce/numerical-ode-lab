# Rich Glossary Content Field Matrix

**Status:** Design complete; runtime implementation requires separate
authorization

**Date:** 2026-07-29

**Applies to:** the approved ODE Glossary Wave 1
[content packet](ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md) and the generic rich
Glossary extension described by the
[design specification](../superpowers/specs/2026-07-29-rich-glossary-content-model-design.md)

This matrix gives every approved Wave 1 packet field an explicit destination.
It does not create runtime content, authorize E1, or turn governance evidence
into production data.

## 1. Classification rules

- **Existing runtime field** means the accepted compact framework already has
  the field or behavior.
- **New generic runtime field** means the future content-agnostic model
  extension must add it.
- **Module-context override field** means a module may supply contextual
  presentation without replacing canonical Core content.
- **Governance-only field** remains in tracked approval, evidence, ownership,
  or rollout documents and must not enter production entries.
- **Derived/display-only field** is computed or supplied at an annotation
  call site and is not persisted in a card record.

Accepted aliases remain runtime-safe lookup/display metadata. Private evidence,
absolute paths, source manifests, approval notes, and ownership-audit metadata
remain outside runtime.

## 2. Approved term-card fields

| Packet field | Classification | Runtime name and type | Rendered surface | Validation | Owner | Wave 1 example | Migration behavior |
|---|---|---|---|---|---|---|---|
| Stable ID | Existing runtime field | `id: GlossaryTermId` | Internal identity; not a separate visible section | Existing stable-ID syntax; unique across the registry | Canonical entry | `step_size` | No rename or migration |
| Display label | Existing runtime field | `label: string` | Preview/card heading | Nonempty plain text | Canonical entry | `Time-step size` | Copies into the existing field |
| Accepted aliases | Existing runtime field | `aliases: readonly GlossaryTermDisplay[]` | Lookup and authored trigger validation; not a card section | Deep-copy/freeze; nonempty; no conflicting alias owner | Canonical entry | `ODE` | Remains runtime metadata |
| Avoided wording | Governance-only field | None | Not rendered | Content-review checklist only | Content governance | Do not call an ODE a solution | Remains in the packet |
| Scope | Governance-only field | None | Not rendered as card data | Governance review | Content governance | Scalar first-order current Lab scope | Runtime limits belong in `assumptionsAndLimits`, not this audit field |
| Product relevance | Governance-only field | None | Not rendered | Rollout review | Content governance | Wave 1 foundation | Remains in catalog/packet |
| Prerequisites | New generic runtime field; override-capable | `prerequisiteTermIds?: readonly GlossaryTermId[]` | Complete card: **Prerequisites** | Unique; no self-reference; every ID resolves in the composed registry | Canonical entry, or context-only module override | `step_size` before `time_grid` | Approved labels convert to stable IDs when E1 restarts |
| Related terms | New generic runtime field; override-capable | `relatedTerms?: readonly GlossaryRelatedTerm[]` | Complete card: **Related terms** | Unique live IDs; no self-link; live IDs resolve; future labels are nonempty | Canonical entry, or context-only module override | live `initial_condition`; future `partial_differential_equation` | Live references become IDs; future references become `{ kind: "future", label }` |
| Commonly confused terms | New generic runtime field; override-capable | `commonlyConfusedTerms?: readonly GlossaryRelatedTerm[]` | Complete card: **Often confused with** | Same live/future checks as related terms | Canonical entry, or context-only module override | future `partial differential equation` | No fake IDs; unresolved planned concepts remain future labels |
| Annotation priority | Governance-only field | None | Not rendered | Rollout review | Content governance | High | Remains in packet |
| Short preview definition | Existing runtime field | `definition: string` | Compact preview; complete-card fallback | Nonempty plain text | Canonical entry | One-sentence ODE definition | Copies into the existing field; no breaking rename |
| Full definition | New generic runtime field | `fullDefinition?: string` | Complete card: **Full definition** | Optional nonempty plain text | Canonical entry only | ODE definition with current-Lab boundary | Complete card uses `fullDefinition ?? definition` |
| Plain-language intuition | New generic runtime field | `intuition?: string` | Complete card: **Plain-language intuition** | Optional nonempty plain text | Canonical entry only | “It is a rule describing how a state changes.” | Added only after model implementation |
| Why it matters in the current IVP Lab | Existing runtime field or module-context override field | Base `whyItMatters: string`; Core context `whyItMattersHere?: string` | Complete card: **Why it matters here** | Nonempty plain text when present | Module-owned canonical entry or context-only override | Method uses entered `f(t,y)` | Module-owned cards use the existing base field; Core cards use the override |
| Formula, when useful | Existing runtime field; override-capable | `formula?: GlossaryFormula`; override may use `GlossaryFormula \| null` | Complete card: **Formula** | LaTeX, accessible text, and optional display mode must form one valid pair | Canonical entry or context-only override | `y'(t)=f(t,y(t))` | Combines with the next packet field |
| Accessible formula explanation | Existing runtime field component | `formula.accessibleText: string` | The formula's sole accessible name | Required and nonempty whenever a formula exists | Same owner as formula | “y prime of t equals...” | Stored with formula; never rendered as duplicate speech text |
| Assumptions and limits | New generic runtime field | `assumptionsAndLimits?: string` | Complete card: **Assumptions and limits** | Optional nonempty plain text | Canonical entry only | Scalar, first-order current-Lab limits | Added after model implementation |
| Common misconception | New generic runtime field | `misconception?: Readonly<{ statement: string; correction: string }>` | Complete card: **Common misconception** | Both strings required, nonempty, copied, and frozen | Canonical entry only | ODE is not the plotted curve; the chart shows approximations | Approved prose is authored into two explicit fields; runtime does not parse arbitrary prose |
| Module-specific note | New generic runtime field; override-capable | `moduleNote?: string` | Complete card: **In this Lab** | Optional nonempty plain text | Module-owned canonical entry or context-only override | Read the equation with the starting value and interval | Added after model implementation |
| Tutor topic | Existing runtime field; override-capable | `tutorTopic: string`; override `tutorTopic?: string` | Existing optional Tutor handoff area only when an injector exists | Nonempty plain text; existing structured handoff boundary | Canonical entry or context-only override | Identify the state and derivative | No injector, queue, request, or Tutor change |
| Approved annotation locations | Governance-only field | None | Not rendered | Cross-check against annotation map | Content/rollout governance | `ODE-W1-ANN-001` | Remains in packet; E2 stays separate |
| Approved future runtime owner | Governance-only field | None | Not rendered | Ownership audit | Architecture governance | Future ODE content module | Physical paths do not enter entries |
| Approved card-content owner | Governance-only field | None | Not rendered | D05 ownership review | Content governance | ODE-owned or Core-owned with override | Logical ownership remains documented, not serialized |
| Content-review evidence | Governance-only field | None | Not rendered | Evidence-policy and privacy review | Content governance | Catalog and numerical-contract references | Never copied into runtime or normal tests |
| Approval rationale | Governance-only field | None | Not rendered | Maintainer review | Maintainer/content governance | Approved refined card | Remains in packet |
| Maintainer choice | Governance-only field | None | Not rendered | Maintainer review | Maintainer | Approved with revisions | Remains in checklist/packet |
| Maintainer notes | Governance-only field | None | Not rendered | Maintainer review and privacy scan | Maintainer | Exact revisions recorded | Remains in packet |
| Review date | Governance-only field | None | Not rendered | Approval audit | Maintainer/content governance | `2026-07-29` | Remains in packet |
| Approved status | Governance-only field | None | Not rendered | Approval lifecycle | Maintainer/content governance | `APPROVED_WITH_REVISIONS` | Remains in packet |

All 29 approved term-card fields are classified. None is silently dropped.

## 3. Approved annotation-record fields

The rich-model extension does not implement annotations, but the packet's
21-field annotation records also have explicit destinations.

| Packet field | Classification | Destination | Wave 1 example | Migration behavior |
|---|---|---|---|---|
| Annotation ID | Governance-only field | Approval and traceability record | `ODE-W1-ANN-001` | No entry field |
| Stable term ID | Existing runtime field | `createTerm({ termId })` | `ordinary_differential_equation` | E2-only call-site input |
| Route | Governance-only field | Rollout map | `/ode/initial-value-problems` | No entry field |
| File | Governance-only field | Repository-grounded owner map | `src/ode/odeApp.ts` | No runtime metadata |
| Owner function/component | Governance-only field | Lifecycle audit | `mountOdeApp.render` | No runtime metadata |
| Exact visible text | Derived/display-only field | Existing `display` argument at the authored call site | `ordinary differential equation` | Must remain an accepted label/alias |
| Surrounding context | Governance-only field | Approved page-copy and placement record | Complete-Lab lede | E2 remains separately gated |
| Surface | Governance-only field | Placement review | lede | No entry field |
| Trigger type supported by the framework | Derived/display-only field | Existing native trigger created by `GlossaryScopeController` | text-like button | Framework behavior unchanged |
| First-use or repeated-use status | Derived/display-only field | Existing per-scope occurrence tracking | first use | Not persisted |
| Desktop behavior | Governance-only field | Existing Host/surface acceptance criteria | preview then pinned card | No entry field |
| Mobile behavior | Governance-only field | Existing Host/modal acceptance criteria | one bottom sheet | No entry field |
| Accessible trigger name | Derived/display-only field | Existing authored display/native button name | term text | Not duplicated in card data |
| Keyboard behavior | Governance-only field | Existing accessibility acceptance criteria | Tab, Enter/Space, Escape | No entry field |
| Rerender lifecycle | Governance-only field | Existing scope-transaction acceptance criteria | `beginScopeRerender(...)` | No entry field |
| Route-disposal lifecycle | Governance-only field | Existing Host/Lab disposal acceptance criteria | Host disconnect before Lab disposal | No entry field |
| Whether the annotation survives result rerender | Governance-only field | Existing replacement policy | exact same-scope/same-term transfer | No entry field |
| Whether it is excluded from editable MathLive content | Governance-only field | Security/accessibility acceptance criterion | yes | No entry field |
| Duplicate-term policy | Governance-only field | Existing first-occurrence scope rule | later mentions remain text | No entry field |
| Implementation dependency | Governance-only field | E1/E2 rollout gate | accepted E1 data before E2 | No entry field |
| Review status | Governance-only field | Approval lifecycle | `APPROVED` | No entry field |

All 21 approved annotation-record fields are classified. The annotation model,
binding contract, first-occurrence rule, and E2 authorization gate remain
unchanged.

## 4. Approved ownership/composition fields

The packet's ownership proposal adds six cross-card columns. They are also
classified so the structured `plannedLazyOwner` and `odeContextOverride`
projections cannot become an accidental parallel model.

| Packet field | Classification | Runtime name and type | Rendered surface | Validation | Owner | Wave 1 example | Migration behavior |
|---|---|---|---|---|---|---|---|
| Stable ID | Existing runtime field | `GlossaryEntry.id` | Internal identity | Same stable-ID validation as the card | Canonical entry | `numerical_approximation` | Same field already classified above |
| Logical owner | Governance-only field | None | Not rendered | D05 ownership audit | Content governance | Core or ODE | Never serialized |
| Approved future E1 physical owner | Governance-only field | None | Not rendered | Import/lazy-boundary audit | Architecture governance | Future ODE content module | File path remains design metadata |
| ODE override / structured `odeContextOverride` | Module-context override field | One `GlossaryModuleOverride` using only the approved allow-list | Complete-card contextual copy/lists/note/formula as present | Valid target; no canonical replacement; deep immutable composition | ODE module extension | Context for `numerical_approximation` and `explicit_scheme` | Converted only after generic implementation; no second card |
| Reusable complete card? | Governance-only field | None | Not rendered | Canonical-content ownership review | Content governance | Yes for the two Core cards | No runtime boolean |
| Lazy implication / structured `plannedLazyOwner` | Governance-only field | None | Not rendered | Manifest/import review | Architecture governance | Complete ODE route only | Enforced by source ownership and bundle tests, not card data |

## 5. Generic rich runtime projection

The future generic entry projection is:

```ts
interface GlossaryEntry {
  readonly id: GlossaryTermId;
  readonly label: string;
  readonly aliases: readonly GlossaryTermDisplay[];
  readonly definition: string;
  readonly fullDefinition?: string;
  readonly intuition?: string;
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormula;
  readonly assumptionsAndLimits?: string;
  readonly misconception?: Readonly<{
    statement: string;
    correction: string;
  }>;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
  readonly moduleNote?: string;
  readonly tutorTopic: string;
}

type GlossaryRelatedTerm =
  | Readonly<{ kind: "term"; termId: GlossaryTermId }>
  | Readonly<{ kind: "future"; label: string }>;
```

The module override allow-list is:

```ts
interface GlossaryModuleOverride {
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

The current names `contextualDefinition` and `whyItMattersHere` are retained
for compatibility. A module cannot override canonical identity, label, aliases,
preview definition, full definition, intuition, assumptions/limits, or
misconception/correction.

## 6. Wave 1 conversion rule

When a separately authorized E1 restarts:

1. start from the approved packet, not the blocked E1 worktree;
2. copy runtime-safe fields according to this matrix;
3. split each approved misconception into explicit `statement` and
   `correction` authoring fields before builder input;
4. use live stable IDs only for terms admitted to the composed registry;
5. represent planned-but-unregistered concepts as noninteractive future
   labels, including `implicit scheme`;
6. keep all governance and evidence fields in tracked documents; and
7. run the future rich-model validation before any content acceptance claim.

No conversion is authorized by this document.
