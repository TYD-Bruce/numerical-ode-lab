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
Production still contains no Glossary terms, annotations, or visible Glossary
behavior: the Platform Host remains inert because the current Lab exposes no
Glossary binding, and the complete committed Playground, development controls,
fixtures, styles, About entry, and shortcut are DEV-only. The complete
four-phase implementation completed its first adversarial local release review
on 2026-07-28 with verdict **RELEASE BLOCKED**. Its P1 pending-load
scope-replacement defect, substantive P2 one-shot Tab-bridge defect, and
DEV-only P3 unbounded-log issue were narrowly repaired. A repeated independent
review of exact repair commit
`8af3ed80b25a520cfa61fa2d7037dea9ed2899d1` then returned
**APPROVED FOR LOCAL FRAMEWORK RELEASE**. The historical blocked review remains
unchanged, while the framework is now locally accepted as complete. Production
still contains no Glossary terms, annotations, ODE binding, or visible
Glossary behavior. Nothing was pushed or deployed by the repair or final
review. The separate project-language gate is also complete: Yiding (Bruce)
Tian recorded all nine maintainer decisions on 2026-07-28, and the terminology,
notation, and teaching-voice standards are approved as Version 1. This approval
is documentation governance only. The Glossary catalog and project copy audit
are now reconciled against Version 1, with all 197 IDs, 55 copy records, six
implementation groups, and local traceability/validation recorded. Group A
ready records `COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005` are accepted.
Group B records `COPY-006` through `COPY-019` and Group C records `COPY-020`
through `COPY-029` are accepted. Group D records `COPY-030` through `COPY-040`
are accepted in `0a32939c6a0bd218003ba87181f66033695c233b`. Group F1 now
implements `COPY-043` locally and completes the pre-Glossary consistency
review. All twelve `COPY-NC-*` records remain review-only and are classified.
The F1 verdict is **GROUP F1 COMPLETE — PRE-E FIXES REQUIRED**: four
language findings and one deterministic Tutor behavior finding require a
separately authorized repair and acceptance checkpoint before Group E may be
planned. `COPY-003` and `src/pages/homePage.ts` remain held and unchanged.
Group E, production Glossary content, and an ODE binding remain unauthorized;
the final Group F2 review remains required after Group E. Nothing was pushed
or deployed.

## Current released baseline

The Theme-Ready Platform Shell and Initial Value Problems Lab are implemented,
locally verified, Preview-verified, and Production-verified at
`https://numerical-t-lab.vercel.app/`. The release state is recorded in
`docs/PROJECT_HANDOFF.md` and the Numerical T-Lab rename review.

## Active milestone

**Content-Agnostic Interactive Glossary Framework**

This framework milestone is locally complete. Production content integration
has not begun and remains unauthorized.

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

[Content-Agnostic Interactive Glossary Framework Design](docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)

Status: **Implemented and locally accepted after the historical blocked review,
narrow P1/P2/P3 repairs, and a repeated independent final review with verdict
APPROVED FOR LOCAL FRAMEWORK RELEASE. Production content remains deferred.**

## Authoritative implementation plan

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
    `F1-BEH-001` in separately authorized focused work. Not started.
18. Add the reviewed ODE Glossary vertical slice only after the pre-E repair
    gate, separate content approval, and implementation authorization.
19. Complete Group F2 after Group E.
20. Push only when explicitly requested by the maintainer.

## Current next action

Authorize and complete a narrow pre-E repair for `F1-LANG-001` through
`F1-LANG-004` and `F1-BEH-001`, then review and accept its evidence. Group F1
implemented `COPY-043`, classified every `COPY-NC-*` record, and completed the
cross-surface review with 135 focused tests, the 1,042-test full verification
gate, 1440×900 and 390×844 development/production-preview evidence, and an
unchanged normalized production import graph. `COPY-003` remains deferred with
the PDE module. Group E, production Glossary content, an ODE binding, and the
reviewed ODE vertical slice remain unauthorized. Group F2 remains required
after Group E.

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
migration. Groups A through D are accepted. Group F1 implements only
`COPY-043` and records the pre-Glossary review; it does not complete Group F.
`COPY-003` remains held; Group E remains unauthorized, and Group F2 remains
required after Group E.
The continuation state is
[the project-language handoff](docs/content/HANDOFF.md). Nothing from these
copy iterations was pushed or deployed.

## Current production behavior

- The Platform Shell is implemented and available.
- Initial Value Problems Lab is the complete numerical Lab.
- Production is verified at `https://numerical-t-lab.vercel.app/`.
- The former Production address remains available as a verified alias.
- Production contains no Glossary terms.
- Production initializes an inert Platform Glossary Host, but the current Lab
  supplies no binding and cannot activate a surface.
- The complete DEV-only Playground, its ten neutral fixtures, development
  controls, About entry, shortcut, and route stylesheet are excluded from the
  production build.
- Commits 1 through 4 add no visible production Glossary behavior.
- Project notation is approved as a documentation standard; production
  definitions, formula migration, and visible content remain deferred.

## Explicit non-goals

- No production Glossary content.
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
records. Groups A through D are accepted; `COPY-003` remains held. Group F1 is
complete locally with verdict **GROUP F1 COMPLETE — PRE-E FIXES REQUIRED**.
The next gate is a separately authorized repair and maintainer-acceptance
checkpoint for `F1-LANG-001` through `F1-LANG-004` and `F1-BEH-001`.
Production Glossary terms, annotations, an ODE binding, and visible Glossary
behavior remain absent and unauthorized. Group E may not be planned until the
repair gate closes, and Group F2 remains required after Group E.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
