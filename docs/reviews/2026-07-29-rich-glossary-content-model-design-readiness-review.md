# Rich Glossary Content Model Design Readiness Review

**Date:** 2026-07-29

**Review type:** Documentation-only architecture and implementation-design
readiness

**Reviewed decision:** `E1-SCHEMA-01 = Option 2`

**Reviewed design:**
[Rich Glossary Content Model and Complete Surface Design](../superpowers/specs/2026-07-29-rich-glossary-content-model-design.md)

**Field evidence:**
[Rich Glossary Content Field Matrix](../content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md)

**Implementation state:** Not started

## 1. Executive finding

The confirmed E1 mismatch is real and release-blocking for content-only E1.
The accepted compact model cannot faithfully carry all approved Wave 1 card
fields. The proposed extension resolves the mismatch without creating an
ODE-only model, renaming the existing preview definition, changing annotation
ownership, or moving transient surface state into Store/session state.

All design decisions required for implementation are closed. Runtime work
still requires separate maintainer authorization and an independent
implementation acceptance before E1 restarts.

## 2. Source evidence reviewed

The review compared the proposal with:

- current `GlossaryEntry`, `GlossaryModuleOverride`,
  `ResolvedGlossaryEntry`, `GlossarySurfaceRequest`, and diagnostic contracts;
- entry/override builders and registry cloning/composition;
- scope/controller request construction and explicit occurrence ownership;
- Platform Host surface, focus, modal, asynchronous, and disposal ownership;
- compact, pinned, and mobile surface rendering;
- readonly formula rendering and accessible ownership;
- current builder, registry, scope, Host, and surface tests;
- the neutral DEV fixture set and production-exclusion boundary;
- the accepted framework design, implementation plan, and final review;
- the approved Wave 1 design, ten-card content packet, and approval checklist;
  and
- current numerical, content-source, notation, terminology, teaching-voice,
  privacy, and repository operating contracts.

No private corpus, external site, remote, deployment, account, or network
service was accessed.

## 3. Binding requirement review

| Requirement | Result | Evidence |
|---|---|---|
| Confirmed mismatch | PASS | Current model has only compact identity/definition/why/formula/Tutor fields; the approved cards require nine additional rich capabilities |
| Compact projection rejected | PASS | The design records Option 2 and prohibits concatenation, omission, or a parallel Wave 1 card |
| Field completeness | PASS | The matrix classifies all 29 term-card fields, all 21 annotation-record fields, and all six ownership/composition columns |
| Content-agnostic model | PASS | Every proposed runtime field is generic; no ODE term, label, path, formula, or ownership field enters the model |
| Backward compatibility | PASS | `definition` remains required preview content; every new base field is optional; complete cards use `fullDefinition ?? definition` |
| Accepted aliases remain runtime | PASS | Aliases remain the existing immutable lookup/display metadata |
| Override safety | PASS | The explicit allow-list preserves current names and forbids canonical identity, preview/full definition, intuition, limits, and misconception replacement |
| D05 composition | PASS | Canonical Core entry -> context-only module override -> immutable composed entry |
| Builder immutability | PASS | The design requires copying/freezing arrays, formulas, misconception records, related records, and composed output |
| Builder validation | PASS | Duplicate/self/unresolved references, empty future labels, formula pairs, invalid targets, conflicting aliases, prohibited override keys, and runtime-object payloads are covered |
| Future related terms | PASS | They use labeled union records, render as plain nonfocusable text, and do not count as unresolved live IDs |
| Live related terms | PASS | They resolve against the module-composed registry and navigate inside the existing surface |
| Prerequisite behavior | PASS | Nonempty prerequisites render and navigate using stable registered IDs; empty sections are omitted |
| Commonly confused behavior | PASS | Structured misconception remains separate; the term list renders under **Often confused with** |
| Compact-preview non-change | PASS | Current label, `definition`, prompt, and status behavior remain; no rich field or formula is added |
| Complete-card order | PASS | Eleven positions are fixed exactly, with optional empty sections omitted |
| Definition/context behavior | PASS | Canonical definition renders once; contextual copy remains subordinate in the same first section |
| Formula accessibility | PASS | Existing readonly-math path remains the sole accessible formula owner |
| Semantic structure | PASS | One card heading, real section headings, semantic lists, native controls, and text labels are specified |
| Desktop long-content behavior | PASS AT DESIGN | Viewport-constrained internal scroll and reachable header are required; browser proof remains an implementation gate |
| Mobile behavior | PASS AT DESIGN | Existing modal owner, named header, focus trap, internal scroll, page lock, and no nested modal are preserved; browser proof remains an implementation gate |
| Related navigation policy | PASS | One-level surface-local Back is fully specified |
| Focus lifecycle | PASS | Replacement/Back focus the displayed heading; mobile focusables recalculate; Escape remains Host-owned |
| Dynamic context isolation | PASS | Live scope context applies only to the original term and is reapplied from the latest snapshot after Back |
| Route disposal | PASS | Surface disposal atomically clears displayed-card and Back state; no second lease or Host identity exists |
| Store/session boundary | PASS | Resolver and history are transient request/surface capabilities; no Store, Lab session, History API, or meaningful-work write occurs |
| Tutor boundary | PASS | Existing optional metadata/injector only; no default button, injector, request, queue, transcript, API, Keep, or Replace behavior |
| Lazy-loading impact | PASS | Rich DOM stays in the existing lazy surface; Home/static, Tutor, MathLive, DEV, and empty-production boundaries remain |
| Existing fixture compatibility | PASS AT DESIGN | New fields are optional and current shapes remain accepted; automated proof belongs to implementation |
| Empty production registry | PASS | Design requires it to stay empty and adds no content |
| Annotation/binding non-change | PASS | The 21 annotation fields remain classified outside this implementation; E2 remains separate |
| Implementation scope | PASS | Exact expected production, test, and DEV fixture files are bounded |
| Testing scope | PASS | Tests-first builder/registry/surface/navigation/context/focus/compatibility plan is specified |
| Rollback boundary | PASS | One model-extension commit restores the accepted compact framework without changing governance or A-D language |
| Wave 1 compatibility | PASS | Every approved field has an exact runtime, override, governance, or display destination |
| Private-source safety | PASS | Evidence and governance metadata are explicitly excluded from runtime and normal tests |

“PASS AT DESIGN” means the behavior is fully specified but not implemented or
browser-verified by this documentation task.

## 4. Confirmed mismatch

The current base entry has:

- `id`;
- `label`;
- `aliases`;
- `definition`;
- `whyItMatters`;
- optional `formula`; and
- `tutorTopic`.

The current module override has:

- `termId`;
- optional `contextualDefinition`;
- optional `whyItMattersHere`;
- optional formula replacement/suppression; and
- optional `tutorTopic`.

All ten approved Wave 1 cards carry content beyond that projection. The missing
generic capabilities are:

- separate full definition;
- intuition;
- assumptions and limits;
- structured misconception and correction;
- prerequisite IDs;
- live/future related terms;
- commonly confused terms; and
- module note.

The mismatch affects every approved card because the packet requires the same
complete 29-field governance shape for all ten terms. Attempting to force
those fields into `definition` or `whyItMatters` would erase section semantics,
validation, navigation, and canonical/module ownership.

## 5. Model and override assessment

The proposal is minimal:

- eight optional rich base capabilities are added;
- one generic related-term union covers live and future items;
- one structured misconception object prevents runtime prose parsing;
- current compact fields and names remain;
- current override names remain;
- context-only lists/note/formula/Tutor metadata can vary by module; and
- canonical teaching content cannot be replaced by a module.

The design deliberately does not serialize logical owner, physical owner,
source evidence, status, review date, priority, scope, or maintainer decisions.
Those are approval facts, not learner-facing card data.

## 6. Composition and validation assessment

Local builder checks and registry-wide checks are assigned to the correct
authority. A builder can copy/freeze shapes and reject local duplicates,
self-links, malformed formulas, empty future labels, invalid payloads, and
prohibited override keys. Only the complete registry can prove uniqueness,
alias ownership, override targets, and live/prerequisite resolution.

Future labels are explicitly outside live-resolution diagnostics. Controlled
production fallback cannot turn an invalid live reference into a broken
button; the current valid surface remains in place.

No duplicate canonical card is introduced. Dynamic annotation context remains
a transient presentation overlay for the original term only.

## 7. Surface and navigation assessment

Compact behavior is frozen. Rich sections exist only in pinned/mobile complete
surfaces.

The exact complete order is:

1. Full definition
2. Plain-language intuition
3. Why it matters here
4. Formula
5. Assumptions and limits
6. Common misconception
7. In this Lab
8. Prerequisites
9. Related terms
10. Often confused with
11. optional existing Tutor handoff

One-level Back is safe within current ownership because the lazy surface
already owns its DOM, internal focus controls, listeners, and disposal. The
Host can continue to own the original trigger/scope identity and single
popover/modal lease. The only additional transient state is the displayed
entry, one previous entry, and the latest original-term snapshot.

The design prevents recursive focus loss: a successful replacement focuses
the new card heading, Back focuses the restored heading, future text is not
focusable, mobile focusables are recalculated, and close/Escape still belong
to the existing surface/Host contract.

## 8. Compatibility and lazy-boundary assessment

No data migration is required to implement the generic extension. Existing
fixtures omit optional fields and continue to represent valid compact cards.
Existing cards get the fallback definition. The production registry remains
empty, so the generic implementation creates no user-visible term.

The only expected richer UI code remains behind the existing Glossary surface
dynamic import. The proposal adds no framework, package, storage, route,
networking, or executable content path. The DEV Playground remains the only
place neutral rich fixtures may exercise the surface before content work.

## 9. Implementation and test boundary

The proposed implementation commit is:

```text
Extend Glossary rich content model
```

It is bounded to generic types, builders, registry/composition, scope request
resolution, lazy complete surface and styles, focused tests, and neutral
DEV-only fixtures. Host tests may receive compatibility coverage only if
implementation evidence requires it; Host architecture is not redesigned.

Required implementation evidence includes:

- red/green builder and registry validation cases;
- deep immutability;
- existing-fixture compatibility;
- exact complete-card order and omission;
- unchanged preview;
- definition fallback;
- one accessible formula owner;
- live and future item rendering;
- one-level Back/focus/history disposal;
- dynamic-context isolation;
- mobile focus containment;
- production empty-registry and DEV-exclusion scans;
- full verification and bundle graph;
- browser checks at 1440 x 900 and 390 x 844; and
- independent review before E1.

No Wave 1 content, ODE annotation, ODE binding, Tutor integration, numerical
change, or session change belongs in that commit.

## 10. Rollback assessment

The generic model, renderer, neutral fixtures, and focused tests can move in
one atomic implementation commit. Reverting it returns to the accepted compact
framework. Because E1 does not restart before independent acceptance, rollback
does not require removing content or editing the approved Wave 1 packet.

## 11. Privacy and governance assessment

The field matrix separates learner-facing data from content governance.
Content-review evidence, source ownership/audit metadata, avoided wording,
scope, relevance, annotation priority, approval rationale/status, maintainer
choice/notes, and review date remain tracked documentation only.

No private path, basename, hash, manifest, quotation, or source payload is
required by the model, implementation plan, tests, runtime, build, or CI.

## 12. Unresolved decisions

None.

The following decisions are explicit:

- retain `definition` for preview;
- add optional `fullDefinition`;
- do not allow module intuition overrides;
- render prerequisites in v1;
- use the live/future discriminated union;
- render future terms as plain text;
- use one-level surface-local Back;
- keep current context-field names;
- keep dynamic scope context on the original term only;
- keep compact output unchanged;
- keep Tutor optional and unchanged; and
- restart E1 only after separate implementation acceptance.

## 13. Explicit non-evidence

This review does not claim:

- model or surface implementation;
- passing source tests for unimplemented behavior;
- real-browser rich-card evidence;
- a production term, annotation, binding, or surface;
- E1 resumption or completion;
- E2/E3/F2 authorization;
- push, Preview, Production, or remote evidence; or
- access to private-source material.

## 14. Verdict

**RICH GLOSSARY MODEL DESIGN COMPLETE — IMPLEMENTATION AUTHORIZATION REQUIRED**

The documentation closes the schema/design questions, but it grants no runtime
authority. The next gate is maintainer acceptance of this design and separate
authorization of the generic model/surface implementation.
