# Active Project Plan

## Status

Project Identity Migration complete. The Content-Agnostic Interactive Glossary
Framework design is approved and committed. Its repository-grounded
implementation plan was conservatively audited, corrected for documentation
findings, and passed conservative re-audit with verdict **SAFE TO IMPLEMENT**.
Commit 1, `Build glossary model and scope lifecycle`, is implemented and
accepted after its conservative audit returned **SAFE TO PROCEED**. Commit 2,
`Fix readonly math accessible ownership`, is implemented and locally verified.
Commit 3, `Add shared glossary surfaces`, is implemented and locally verified
under direct maintainer authorization. Its conservative audit found two P1
lifecycle defects and one P2 copy defect (`P0 = 0`); the narrow follow-up is
locally implemented and verified. The second conservative re-audit then found
the P1 deferred Tutor restore leak and the P2 pre-mount abort cleanup defect;
both are fixed and locally verified in a second narrow lifecycle follow-up.
The final conservative re-audit of Commit 3 and both follow-ups returned
**SAFE TO PROCEED** with `P0 = P1 = P2 = P3 = 0`. Commit 4, `Complete
glossary framework playground`, is implemented and locally/browser verified.
The production registry still contains no Glossary entries, annotations, or
visible Glossary behavior: the Platform Host remains inert because the current
Lab exposes no Glossary binding, and the complete committed Playground,
development controls,
fixtures, styles, About entry, and shortcut are DEV-only. The complete
four-phase implementation completed its first adversarial local release review
on 2026-07-28 with verdict **RELEASE BLOCKED**. Its P1 pending-load
scope-replacement defect, substantive P2 one-shot Tab-bridge defect, and
DEV-only P3 unbounded-log issue were narrowly repaired. A repeated independent
review of exact repair commit
`8af3ed80b25a520cfa61fa2d7037dea9ed2899d1` then returned
**APPROVED FOR LOCAL FRAMEWORK RELEASE**. The historical blocked review remains
unchanged, while the framework is now locally accepted as complete. The
production registry still contains no active Glossary entries, annotations,
ODE binding, or visible Glossary behavior. Nothing was pushed or deployed by
the repair or final review. The separate project-language gate is also
complete: Yiding (Bruce)
Tian recorded all nine maintainer decisions on 2026-07-28, and the terminology,
notation, and teaching-voice standards are approved as Version 1. This approval
is documentation governance only. The Glossary catalog and project copy audit
are now reconciled against Version 1, with all 197 IDs, 55 copy records, six
implementation groups, and local traceability/validation recorded. Group A
ready records `COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005` are accepted.
Group B records `COPY-006` through `COPY-019` and Group C records `COPY-020`
through `COPY-029` are accepted. Group D records `COPY-030` through `COPY-040`
are accepted in `0a32939c6a0bd218003ba87181f66033695c233b`. Group F1
implements `COPY-043`, completes the pre-Glossary consistency review, and is
accepted as prerequisite state. All twelve `COPY-NC-*` records remain
review-only and are classified.
The four language findings and one deterministic Tutor behavior finding from
that review are now `CLOSED_VERIFIED` in the separately authorized two-commit
[pre-Glossary repair](docs/reviews/2026-07-29-pre-glossary-repair-review.md).
The repair verdict is **PRE-E REPAIR COMPLETE — GROUP E MAY BE PLANNED**,
and the maintainer accepted both repair commits as prerequisites for Group E0.
The documentation-only
[ODE Glossary Wave 1 design](docs/superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md),
[content packet](docs/content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md),
[approval checklist](docs/content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md),
and [readiness review](docs/reviews/2026-07-29-ode-glossary-wave-1-design-readiness-review.md)
now record verdict **DESIGN AND CONTENT APPROVED — E1 AUTHORIZATION
REQUIRED**. Yiding (Bruce) Tian approved D01–D18 as Option A, all ten cards
with exact revisions, and all ten annotation design records on 2026-07-29.
The subsequent E1 implementation authorization stopped before any source or
test change when repository inspection confirmed that the accepted compact
`GlossaryEntry` and module override cannot represent the approved rich card
content. The maintainer selected `E1-SCHEMA-01 = Option 2` and rejected a
compact projection. The documentation-only
[rich Glossary content-model design](docs/superpowers/specs/2026-07-29-rich-glossary-content-model-design.md),
[field matrix](docs/content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md), and
[design-readiness review](docs/reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md)
now close the generic schema, complete-surface, validation, and navigation
decisions. The subsequent repository-grounded
[implementation plan](docs/superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)
and
[plan review](docs/reviews/2026-07-29-rich-glossary-content-model-plan-review.md)
now record verdict **RICH GLOSSARY IMPLEMENTATION PLAN COMPLETE —
AUTHORIZATION REQUIRED**. The maintainer then explicitly authorized the
generic implementation. The model, builders, validation, module composition,
scope resolver, complete rich-card renderer, and surface-local related-term
navigation were implemented and locally verified in commit
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e` (`Extend Glossary rich content
model`), which the maintainer accepted as the fresh E1 starting point. The
[implementation review](docs/reviews/2026-07-29-rich-glossary-content-model-implementation-review.md)
records verdict **RICH GLOSSARY MODEL IMPLEMENTED — READY FOR MAINTAINER
ACCEPTANCE** as its point-in-time verdict. The separately authorized fresh E1
implementation now adds exactly two inert Core entries, eight inert ODE
entries, two ODE context-only overrides, and an exact ten-card composition.
The production registry remains empty, no production importer exists, and no
annotation, ODE binding, or visible Glossary behavior was added. The
[E1 content review](docs/reviews/2026-07-29-ode-glossary-wave-1-e1-content-review.md)
records the local evidence. The maintainer accepted E1 at
`08b80522283438a233974456a026a6dbc2a96746`. The first E2 integration pass
stopped before source/test changes because its Method helper and Compare
Output contracts conflicted or lacked exact copy. The documentation-only
[E2 Runtime Contract](docs/content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
now records `E2-CONTRACT-01` and `E2-CONTRACT-02`, reconciles all ten
annotation records, and is the sole implementation authority for E2
interaction details. E2 source implementation remains incomplete and requires
fresh maintainer reauthorization. `COPY-003` and `src/pages/homePage.ts`
remain held and unchanged. E3, production activation, annotations, and an ODE
binding remain unauthorized; the final Group F2 review remains mandatory after
E3.
Nothing was pushed or deployed.

## Current released baseline

The Theme-Ready Platform Shell and Initial Value Problems Lab are implemented,
locally verified, Preview-verified, and Production-verified at
`https://numerical-t-lab.vercel.app/`. The release state is recorded in
`docs/PROJECT_HANDOFF.md` and the Numerical T-Lab rename review.

## Active milestone

**ODE Glossary Wave 1 E2 — Implementation Reauthorization Gate**

The content-agnostic framework and pre-E repairs are accepted prerequisites.
Group E0 design and content governance is complete and maintainer-approved.
The historical E1 attempt produced no source or test changes and confirmed a
schema mismatch. Option 2 was selected, implemented, accepted at
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`, and used as the required fresh
restart point. E1 is now locally implemented and verified as inert content:
two Core entries, eight ODE entries, two context-only overrides, and ten
composed cards exist in source while the production registry, production
importer count, annotation count, and ODE binding count all remain zero.
E1 is accepted at `08b80522283438a233974456a026a6dbc2a96746`. The canonical
E2 Runtime Contract fixes all ten exact owners, trigger texts, DOM
compositions, state/mode rules, lifecycle rules, duplicates, and direct test
ownership. E2 source/test implementation has not begun and requires fresh
maintainer reauthorization.

## Completed Project Identity Migration

The canonical product is **Numerical T-Lab** with slug
`numerical-t-lab`. Active product UI, internal package, route titles, Tutor
identity wording, migration documentation, and publication-safety preparation
are recorded by:

- [Numerical T-Lab Rename Migration Plan](docs/superpowers/plans/2026-07-22-numerical-t-lab-rename-migration-plan.md)
- [Project Rename Handoff](docs/project-rename/HANDOFF.md)

The public and private GitHub repositories, local remote URLs, existing Vercel
project, Git integration, and canonical Production domain now use
`numerical-t-lab`. Repository IDs, visibility, Vercel Project ID, deployment
settings, and the `main` Production branch were preserved. The former
Production domain remains a verified alias. The local directory rename is
complete at `D:\numerical-t-lab`; Cursor/Codex reopened from that canonical
path with valid Git state, branch `main`, unchanged rename-checkpoint HEAD,
`521d8eba2aad3ad361c289e3e4b1e8e2e7ce6f30`, a clean worktree, and the
canonical remotes. No identity-migration action remains pending.

## Why this milestone

The platform needs shared, accessible, domain-neutral definition infrastructure
before reviewed ODE, Linear Algebra, or PDE terminology is published. The
framework must preserve current ownership, lifecycle, accessibility, and lazy
loading while keeping formal mathematical content separate.

## Authoritative design

[ODE Glossary Wave 1 Design](docs/superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md)

Status: **D01–D18, ten revised cards, and ten annotation records are
maintainer-approved; E1 is accepted and inert; the E2 runtime contract is
complete, while E2 source implementation requires fresh reauthorization and
E3/F2 remain unauthorized.**

[Rich Glossary Content Model and Complete Surface Design](docs/superpowers/specs/2026-07-29-rich-glossary-content-model-design.md)

Status: **Design complete; generic model/surface implementation accepted in
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e` as the E1 starting point.**

## Authoritative rich-model implementation plan

[Rich Glossary Content Model Extension Implementation Plan](docs/superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)

Status: **Repository-grounded plan executed in one locally verified generic
implementation commit and accepted as the E1 starting point.**

Framework authority remains the
[Content-Agnostic Interactive Glossary Framework Design](docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md),
which is implemented and locally accepted. The rich-model design is a bounded
extension prerequisite; it does not reopen the accepted Host, modal, scope,
annotation, Store, or Tutor ownership decisions.

## Historical framework implementation plan

[Content-Agnostic Interactive Glossary Framework Implementation Plan](docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md)

Status: **Repository-grounded plan fully executed locally. The framework is
accepted after the historical blocked review, narrow repairs, and repeated
independent final review. No production content or ODE binding was added.**

## Approved delivery sequence

1. Add and review Codex project guidance on local `main`. Complete.
2. Document the Content-Agnostic Interactive Glossary Framework design on
   local `main`. Complete in the commit containing this plan.
3. Create the repository-grounded implementation plan on local `main`.
   Complete; conservative audit findings were corrected, and the corrected
   plan passed conservative re-audit.
4. Build Glossary model and scope lifecycle. Complete and accepted after
   conservative audit.
5. Fix readonly math accessible ownership as a narrow prerequisite. Complete
   locally.
6. Add shared Glossary surfaces and the minimal committed DEV-only Playground
   harness. Complete locally; two lifecycle audit follow-ups locally verified
   and accepted by final conservative re-audit.
7. Complete the development Glossary Playground. Complete locally and
   browser-verified; production-exclusion audit passed.
8. Complete the first full framework release review. Completed with historical
   verdict **RELEASE BLOCKED**.
9. Repair the P1 pending-load scope-replacement path and P2 one-shot Tab
   bridge, bound the DEV-only logs, add focused regressions, and repeat the
   independent release review. Complete locally; repeated verdict
   **APPROVED FOR LOCAL FRAMEWORK RELEASE**.
10. Resolve and approve the separate notation and definition foundation.
    Complete; all nine decisions are recorded and the three language standards
    are maintainer-approved Version 1.
11. Reconcile the Glossary catalog and project copy audit and create the
    repository-grounded project-language implementation plan. Complete as a
    documentation-only iteration; no recommendation was implemented.
12. Implement Group A, Platform and overview copy, only in a separately scoped
    task with focused tests and browser review. Complete and accepted;
    `COPY-003` remained held.
13. Implement Group B, IVP Method/Data/Output and preset language, only in a
    separately scoped task with focused tests and browser review. Complete and
    accepted.
14. Implement Group C, Convergence and error language, only in a separately
    scoped task with focused tests, numerical/structural audit, browser review,
    and build inspection. Complete and accepted.
15. Implement Group D, Tutor numerical language, only in a separately scoped
    task with focused API/prompt/Host/lazy tests, structural audit, localhost
    demo/browser review, and production artifact inspection. Complete locally
    and accepted.
16. Complete Group F1 before production Glossary integration: implement only
    `COPY-043`, classify all twelve `COPY-NC-*` records, audit accepted A–D
    language and current behavior, and record the pre-E gate. Complete locally
    with verdict **GROUP F1 COMPLETE — PRE-E FIXES REQUIRED**.
17. Repair and accept `F1-LANG-001` through `F1-LANG-004` and
    `F1-BEH-001` in separately authorized focused work. Complete and accepted
    as the Group E0 prerequisite.
18. Prepare the ODE Glossary Wave 1 content, annotation, ownership, binding,
    Tutor-boundary, rollout, checklist, and readiness packet without
    implementation. Complete and maintainer-approved as Group E0 governance;
    no implementation authorized.
19. Begin E1 content data only after explicit maintainer approval. Authorization
    was issued, but work stopped before source/test changes at the confirmed
    rich-field schema mismatch. Historical stop; superseded by step 23.
20. Design the minimal generic rich content model, complete-card surface,
    validation, navigation, compatibility, and rollback boundary. Complete as
    documentation only with verdict **RICH GLOSSARY MODEL DESIGN COMPLETE —
    IMPLEMENTATION AUTHORIZATION REQUIRED**.
21. Create and review the repository-grounded generic rich-model
    implementation plan. Complete as documentation only with verdict **RICH
    GLOSSARY IMPLEMENTATION PLAN COMPLETE — AUTHORIZATION REQUIRED**.
22. Implement and review the generic rich model/surface only after separate
    maintainer authorization. Complete and accepted in
    `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`.
23. Restart E1 from the beginning against the accepted rich model after a new
    explicit gate. Complete, accepted, and inert at
    `08b80522283438a233974456a026a6dbc2a96746`.
24. Reconcile all ten E2 interaction records after the first integration pass
    stopped before source/test changes. Complete as documentation through
    `E2-CONTRACT-01`, `E2-CONTRACT-02`, and the canonical E2 Runtime Contract.
    E2 source/test implementation requires fresh maintainer reauthorization.
25. Complete E3 integration review after E2. Unauthorized.
26. Complete mandatory Group F2 after E3. Not started.
27. Push only when explicitly requested by the maintainer.

## Current next action

Fresh maintainer reauthorization of E2 source/test implementation against the
[canonical E2 Runtime Contract](docs/content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md).
The approved Wave 1 design retains ten terms, keeps
`/ode` static and unannotated, uses two Core plus eight ODE-owned cards,
injects no production Tutor handoff, and separates E1, E2, E3, and mandatory
F2. `COPY-003` remains deferred with the PDE module.

## Parallel content foundation

A private-source-reviewed terminology, notation, teaching-voice, Glossary
candidate, and current-copy foundation exists under
[`docs/content/`](docs/content/). It processed all 29 admitted sources. Yiding
(Bruce) Tian completed the decision packet and approval checklist for the nine
explicit conflicts on 2026-07-28. The terminology, notation, and teaching-voice
documents are now maintainer-approved Version 1 standards; no decision is
deferred.

The [Glossary catalog](docs/content/GLOSSARY_CATALOG.md) and
[project copy audit](docs/content/PROJECT_COPY_AUDIT.md) are reconciled against
Version 1. The catalog retains exactly 197 IDs, separates language approval,
product relevance, runtime readiness, and rollout wave, and includes rich
planning drafts for 10 Wave 1 and 13 high-priority Wave 2 terms. The copy audit
rescans 55 records and maps exact replacements to Groups A–F. The standards and
reconciliation publish no production term, definition, annotation, or notation
migration. Groups A through D and the Group F1/pre-E prerequisite state are
accepted. Group F1 implements only `COPY-043` and records the pre-Glossary
review; it does not complete Group F. `COPY-003` remains held. Group E0 design
and content governance is maintainer-approved. The historical E1 stop led to
the accepted generic rich model; the fresh E1 restart is now locally complete
with two Core entries, eight ODE entries, two context-only overrides, and ten
composed cards. It remains inert and is accepted. The E2 runtime contract is
complete, but E2 source/test implementation requires fresh reauthorization.
E3 remains unauthorized.
Group F2 remains required after E3.
The continuation state is
[the project-language handoff](docs/content/HANDOFF.md). Nothing from these
copy iterations was pushed or deployed.

## Current production behavior

- The Platform Shell is implemented and available.
- Initial Value Problems Lab is the complete numerical Lab.
- Production is verified at `https://numerical-t-lab.vercel.app/`.
- The former Production address remains available as a verified alias.
- The production registry contains no Glossary entries.
- Production initializes an inert Platform Glossary Host, but the current Lab
  supplies no binding and cannot activate a surface.
- The complete DEV-only Playground, its ten neutral fixtures, development
  controls, About entry, shortcut, and route stylesheet are excluded from the
  production build.
- Commits 1 through 4 add no visible production Glossary behavior.
- Project notation is approved as a documentation standard; production
  definitions, formula migration, and visible content remain deferred.

## Explicit non-goals

- No production-active Glossary content.
- No runtime notation migration or notation profile.
- No real Tutor Glossary queue.
- No ODE annotations.
- No Linear Algebra or PDE Glossary content.
- No private-reference processing in runtime or CI.

## Review gate

The framework release gate is closed with
**APPROVED FOR LOCAL FRAMEWORK RELEASE**. The prior **RELEASE BLOCKED** review
remains historical evidence and all three of its findings are closed. The
project-language approval gate is also closed: all nine choices are recorded
and the three standards are approved as Version 1. The catalog/copy
reconciliation gate is also closed with 197 stable IDs and 55 rescanned copy
records. Groups A through D, Group F1, and both pre-E repair commits are
accepted; `COPY-003` remains held. Group E0 Wave 1 design and content
governance is complete. The historical E1 schema stop was resolved by the
accepted Option 2 generic rich model at
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`. The freshly authorized E1 restart
is accepted at `08b80522283438a233974456a026a6dbc2a96746`. Its two Core
entries, eight ODE entries, two context-only overrides, and ten composed cards
remain outside the production registry and import graph. The ten-record E2
runtime contract is complete. The next gate is fresh maintainer
reauthorization of E2 source/test implementation. E2 source, E3, production
activation, annotations, an ODE binding, and visible production Glossary
behavior remain absent; E3 is unauthorized. Group F2 remains mandatory after
E3.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
