# Rich Glossary Content Model Implementation Plan Review

**Date:** 2026-07-29

**Review type:** Documentation-only repository-grounding and execution-readiness
review

**Reviewed plan:**
[Rich Glossary Content Model Extension Implementation Plan](../superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)

**Accepted design:**
[Rich Glossary Content Model and Complete Surface Design](../superpowers/specs/2026-07-29-rich-glossary-content-model-design.md)

**Planning baseline:** `bb7e8f13aa1ee7b7478f3f5c17820d4beb23a284`

**Implementation state:** Not started and not authorized

## 1. Executive finding

The plan is fully grounded in the accepted source tree. It maps every accepted
field and behavior to an existing symbol, assigns every validation rule to one
builder/registry/surface seam, closes the runtime resolver and diagnostic
details needed for execution, and preserves the accepted Host, modal, Tutor,
Store, Lab, and lazy-loading boundaries.

The plan recommends the accepted single atomic implementation commit. It adds
no Wave 1 content, production entry, annotation, binding, or runtime change.
E1 remains incomplete.

## 2. Repository grounding

The review checked the plan against the actual current owners:

- `GlossaryEntry`, `GlossaryModuleOverride`, `ResolvedGlossaryEntry`,
  diagnostics, IDs, formula records, surface requests, and lifecycle
  identities in `src/glossary/glossaryRuntimeTypes.ts`;
- `defineGlossaryEntry`, `defineGlossaryModuleExtension`, the current
  immediate `GlossaryValidationError`, the bounded fallback sink, display
  copying, and formula copying in `src/glossary/glossaryBuilders.ts`;
- `GlossaryRegistry`, `createGlossaryRegistry`, alias ownership, override
  selection, cloning, and resolution in `src/glossary/glossaryRegistry.ts`;
- request construction and explicit first-occurrence ownership in
  `src/glossary/glossaryScope.ts`;
- binding/scope replacement lifecycle in
  `src/glossary/glossaryController.ts`;
- complete/preview DOM, formula handle, snapshot refresh, focus listeners,
  optional Tutor action, and disposal in
  `src/glossary/surface/glossarySurfaceRuntime.ts`;
- surface styles in `src/glossary/surface/glossarySurface.css`;
- outer surface, trigger, placement, modal, lazy-generation, close, and
  replacement authority in `src/app/platformGlossaryHost.ts`;
- inert/scroll-lock ownership in `src/app/platformModalEnvironment.ts`;
- accessible readonly formula ownership in `src/math/ui/readonlyMath.ts`;
- the actual Tutor request boundary in
  `src/glossary/glossaryTutorContract.ts`;
- neutral fixtures and route assembly under `src/dev/glossary/`; and
- the current development-route, eager-graph, and Vite production-exclusion
  tests.

The plan correctly records that no standalone runtime-types test exists.
Type-level compatibility is exercised through the existing TypeScript callers
and application typecheck.

## 3. Requirements review

| Requirement | Result | Plan evidence |
|---|---|---|
| Exact source paths and symbols | PASS | Section 2 inventories model, builder, registry, scope, surface, Host, modal, formula, Tutor, DEV, and bundle owners |
| Exact test ownership | PASS | Sections 2, 8, 10, and 11 separate modified tests from regression-only owners |
| `GlossaryRelatedTerm` union | PASS | Section 3 gives the exact accepted live/future shape |
| Structured misconception | PASS | Section 3 gives the exact statement/correction record |
| Entry field completeness | PASS | All eight optional rich capabilities and existing compact fields are retained |
| Override allow-list | PASS | Exact actual retained names plus four new context-composable fields are listed |
| Canonical override prohibition | PASS | Identity, label, aliases, compact/full definition, intuition, limits, and misconception are excluded and runtime-rejected |
| Resolver seam | PASS | Required request capability and `GlossaryRegistry.resolveById` signatures are exact |
| Existing annotation API | PASS | `createTerm({ termId, display })` remains unchanged |
| Validation owner per rule | PASS | Section 4 assigns builder-local, registry-wide, composed-registry, and surface lookup checks |
| Current error pattern | PASS | Existing error type/message, immediate strict failure, and bounded fallback are preserved |
| Stable diagnostics | PASS | Focused new codes and `field`/`relatedTermId` keys are specified without a new framework |
| Runtime object/HTML safety | PASS | Plain-data/allow-list rejection and `textContent` handling are distinguished |
| Deep immutability | PASS | Builder, registry, composed output, override, nested record, and fixture mutation tests are exact |
| Composition semantics | PASS | Canonical -> context-only override -> deep-frozen resolved entry; present lists replace, absent lists retain |
| No duplicate complete card | PASS | One composition helper and one resolved card are required |
| Compact preview | PASS | Existing label/definition/prompt/status DOM is explicitly unchanged and rich fields/formula remain absent |
| Complete section order | PASS | All eleven positions are exact, with optional omission and standard-label metadata outside the peer sequence |
| Definition fallback | PASS | `fullDefinition ?? definition` renders once; contextual copy remains subordinate |
| Formula accessibility | PASS | Dispose-before-replace and one `role="math"`/`aria-label` owner are required |
| Live/future list semantics | PASS | Native live buttons and nonfocusable future text use semantic lists |
| One-level navigation | PASS | A -> B -> C, single previous slot, Back clear, and no second surface are exact |
| Focus behavior | PASS | Forward and Back focus connected `h2[tabindex="-1"]` with `preventScroll` |
| Missing/self target behavior | PASS | No-op with no card/history/focus mutation |
| Dynamic context isolation | PASS | Latest snapshot is stored but applies only to the original annotated term |
| Context-update focus stability | PASS | Original-card updates patch dynamic nodes/formula without rebuilding the card or moving focus |
| Mode/retry/disposal lifecycle | PASS | Section 7 covers close, route, scope, replacement, mode change, retry, and annotated disappearance |
| Tutor boundary | PASS | Actual request contract remains unchanged; current card ID is used and original context is not borrowed |
| No state leakage | PASS | Store, Lab/Tutor sessions, History, storage, and meaningful work are explicitly excluded |
| Legacy compatibility | PASS | Legacy entries/overrides, compact cards, formula, annotations, fixtures, and empty production registry have exact proof |
| Neutral DEV fixtures | PASS | Existing IDs are reused; rich/omitted/override/navigation/long-content cases remain nonmathematical and DEV-only |
| Production exclusion | PASS | Existing import tests plus one new unique rich fixture marker are required |
| Lazy boundary | PASS | Rich DOM/navigation stays in the current lazy surface; Host/entry/static/Tutor/MathLive ownership is preserved |
| Browser matrix | PASS | Both required viewports and all interaction/layout/accessibility states are specified |
| Bundle evidence | PASS | Latest 8-JS/7-CSS, 12-static/5-dynamic and entry/surface raw-gzip reference is recorded; fresh baseline/final evidence and marker scans are required |
| Tests-first order | PASS | Red/green model, registry, scope, surface, navigation, DEV, focused, full, browser, and artifact gates are executable |
| Exact implementation files | PASS | Production, DEV, test, read-only, and prohibited sets are enumerated |
| Commit boundary | PASS | One atomic commit is justified and named `Extend Glossary rich content model` |
| Rollback | PASS | One revert restores compact framework without content/session migration |
| Implementation review | PASS | Required path, twenty sections, and conditional verdict are fixed |
| E1 restart | PASS | Old worktree is rejected; clean accepted HEAD, inertness rerun, content-only E1, and E2 gate are explicit |
| Privacy | PASS | No private source, path, hash, evidence object, or approved Wave 1 prose enters implementation |

## 4. Type and compatibility assessment

The runtime change is additive. `definition` remains required compact preview
content and every new base field is optional. Existing entry and override
literals therefore remain structurally valid.

The required `GlossarySurfaceRequest.termResolver` is internal transient
capability, not authored content or Lab API. Source inspection found direct
request literals in surface, Host, and Tutor integration tests. The plan
correctly classifies those test helper updates as expected modifications while
leaving Host and Tutor source read-only.

The registry's by-ID method is the smallest source-grounded seam. It reuses
module-aware composition, chooses the canonical label for related-card
display, and avoids manufacturing a page trigger or occurrence.

## 5. Validation and fallback assessment

Local and global checks are assigned where their facts are knowable:

- builders know shape, plain-data status, owner ID, local duplicates, self
  links, future-label validity, formula pairs, and permitted keys;
- registry construction knows duplicate entries, alias ownership, override
  targets/duplicates, all admitted IDs, and final module composition; and
- the surface knows only whether an already-validated by-ID resolution
  unexpectedly failed.

Immediate strict failure remains compatible with the current framework. The
controlled fallback behavior avoids broken controls by omitting invalid local
records or filtering invalid raw/composed references. It does not silently
turn future labels into live IDs.

The proposed diagnostics are sufficiently specific for behavioral tests, and
the existing `GlossaryValidationError` message remains stable.

## 6. Immutability and composition assessment

The plan closes every current shallow-copy gap. It requires deep copies in
both builders and registry entry points because callers can bypass builders
with typed/cast records. It protects:

- alias arrays and math-display records;
- formula records;
- misconception records;
- prerequisite arrays;
- live/future relationship records and arrays;
- override records/arrays; and
- resolved composed entries.

List replacement semantics include explicit empty arrays. That distinction
would be lost by truthiness-based composition, so the plan's present-field
selection requirement is necessary and testable.

No second Core/module card record or parallel Wave 1 model is proposed.

## 7. Surface and accessibility assessment

The compact preview branch stays unchanged. The complete surface remains the
only rich renderer and retains the current outer root, one active Host
identity, mobile modal lease, Close behavior, and internally scrolling content
region.

The renderer contract fixes:

- one `h2` card title and semantic `h3` sections;
- exact eleven-position order;
- definition/context deduplication;
- optional omission without placeholder prose;
- visible misconception/correction labels;
- native live controls and plain future labels;
- one accessible formula owner; and
- the optional existing Tutor action last.

The CSS scope is limited to rich-section/control presentation and current
scroll/wrapping/focus/high-contrast requirements. It does not redesign the
surface.

Real browser evidence remains mandatory because jsdom cannot prove geometry,
scroll containment, custom-element behavior, zoom, or visual focus.

## 8. Navigation lifecycle assessment

The selected state is the minimum accepted state: one current card, one
previous card, and the latest original-term snapshot. It is mounted-surface
state only.

The plan handles:

- A -> B -> C history replacement;
- Back clear and disappearance;
- missing/self no-op;
- heading focus;
- future noninteraction;
- live context isolation;
- trigger replacement;
- annotated disappearance;
- close, route, scope, and disposal;
- desktop/mobile remount reset;
- pre-mount loader retry; and
- optional current-card Tutor handoff.

The Host does not need relationship knowledge. Mobile focus containment
already recalculates descendants on each Tab, and desktop's one-shot bridge
remains an entry behavior rather than internal navigation history.
Original-card context refresh patches only dynamic content, so the existing
same-root/focused-control behavior is preserved. The plan also carries the
existing pending-handoff disabled state across any development-only internal
card render.

## 9. DEV and production boundary assessment

The fixture plan reuses the ten neutral IDs and one DEV-only module extension.
It exercises all fields and states without importing approved Wave 1 IDs,
definitions, formulas, or private evidence.

The existing production graph test already excludes the DEV route/fixtures
and keeps only `glossarySurfaceLoader.ts` in the eager entry graph. The Vite
test is the correct owner for an additional emitted-string marker check. No
new production route or registry data is planned.

The rich lazy surface chunk is expected to grow. The entry/Home graph is not.
The plan requires measured evidence rather than an arbitrary size budget or
`manualChunks`.

## 10. Tests-first and commit-boundary assessment

The sequence is executable against actual scripts and files:

1. current focused/type/bundle baseline;
2. builder/type red;
3. registry/composition red;
4. model/builders;
5. registry;
6. scope resolver;
7. complete renderer red/green;
8. navigation/focus red/green;
9. request-fixture compatibility;
10. neutral DEV integration;
11. cumulative focused and full verification;
12. browser and production artifact review;
13. implementation review/status; and
14. one commit.

Two implementation commits would create a less useful intermediate state. The
accepted generic capability is atomic and backward-compatible, and its revert
does not require content migration. The one-commit recommendation is
confirmed.

## 11. E1 restart assessment

The plan does not resume the stopped E1 worktree. It requires a new
authorization from the clean accepted implementation HEAD, repeats the
production-inertness check, maps all approved packet fields to the implemented
schema, and keeps E1 content-only.

E2 remains unauthorized until E1 is separately accepted. E3 and F2 remain
separately gated.

## 12. Unresolved gaps

None.

The plan resolves the source-grounded Tutor detail conservatively: the actual
handoff request has no `tutorTopic` field, so the generic extension keeps that
contract unchanged and passes the current displayed term ID. Transmitting
topic prose would require a separate Tutor-contract design and is outside this
implementation.

## 13. Planning validation

The planning task:

- read the accepted design, field matrix, design-readiness review, framework
  authorities, Wave 1 governance, source, tests, build boundaries, and current
  handoffs;
- confirmed every planned source/test path exists;
- confirmed the two proposed planning documents are the only new tracked
  files;
- ran the 14-file/132-test focused baseline successfully;
- changed no runtime source, test, CSS, package, configuration, or deployment
  file;
- created only ignored structured planning artifacts outside tracked docs;
- retained the empty production registry and absent ODE binding as
  non-changes; and
- required link, privacy, status, diff, and ignored-artifact validation before
  the planning commit.

## 14. Explicit non-evidence

This review does not claim:

- model, builder, registry, resolver, surface, CSS, or navigation
  implementation;
- passing tests for unimplemented rich behavior;
- browser evidence for rich cards;
- a production term, annotation, ODE binding, or visible surface;
- Tutor, Store, session, Router, numerical, or persistence changes;
- E1 restart/completion or E2/E3/F2 authorization;
- push, Preview, Production, deployment, or remote evidence; or
- access to private-source material.

## 15. Verdict

**RICH GLOSSARY IMPLEMENTATION PLAN COMPLETE — AUTHORIZATION REQUIRED**

The plan is complete and executable, but it grants no runtime authority. The
next gate is maintainer acceptance of the plan and separate authorization of
the generic model/builder/surface implementation.
