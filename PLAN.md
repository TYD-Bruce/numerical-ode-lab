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
Production still contains no Glossary terms, annotations, or visible Glossary
behavior: the Platform Host remains inert because the current Lab exposes no
Glossary binding, and the committed Playground is DEV-only. Commit 3 and both
lifecycle-fix commits now await final conservative re-audit. Commit 4 remains
unauthorized.

## Current released baseline

The Theme-Ready Platform Shell and Initial Value Problems Lab are implemented,
locally verified, Preview-verified, and Production-verified at
`https://numerical-t-lab.vercel.app/`. The release state is recorded in
`docs/PROJECT_HANDOFF.md` and the Numerical T-Lab rename review.

## Active milestone

**Content-Agnostic Interactive Glossary Framework**

This remains the active product milestone. The identity migration is a bounded
repository and deployment-identity checkpoint; it does not start or alter
Glossary implementation.

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

Status: **Approved design; Commit 1 accepted; readonly-math prerequisite
implemented locally; shared surfaces implemented and locally verified in
Commit 3; two lifecycle audit follow-ups locally verified; final conservative
re-audit pending.**

## Authoritative implementation plan

[Content-Agnostic Interactive Glossary Framework Implementation Plan](docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md)

Status: **Repository-grounded plan corrected after conservative audit and
re-audited SAFE TO IMPLEMENT; Commit 1 accepted; readonly-math prerequisite
implemented locally; shared surfaces implemented and locally verified in
Commit 3; two lifecycle audit follow-ups locally verified; final conservative
re-audit pending.**

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
   harness. Complete locally; two lifecycle audit follow-ups locally verified;
   final conservative re-audit pending.
7. Complete the development Glossary Playground.
8. Complete the separate notation and definition foundation.
9. Add the reviewed ODE vertical slice.
10. Push only when explicitly requested by the maintainer.

## Current next action

Run a final conservative re-audit of Commit 3, `Add shared glossary surfaces`,
together with both lifecycle-fix commits, `Fix shared glossary surface
lifecycle` and `Remove deferred Tutor auto-restore`. Do not begin Commit 4,
`Complete glossary framework playground`, before that re-audit and maintainer
approval.

## Parallel content foundation

A private-source-reviewed terminology, notation, teaching-voice, Glossary
candidate, and current-copy foundation is drafted under
[`docs/content/`](docs/content/). It processed all 29 admitted sources and now
awaits maintainer review, beginning with nine explicit decision-required
conflicts. The package is planning evidence only: it publishes no production
term, definition, annotation, or notation migration and authorizes no runtime
copy change.

This parallel draft does not alter the active milestone, current next action,
or review gate above. Its continuation state is
[the content-foundation handoff](docs/content/HANDOFF.md).

## Current production behavior

- The Platform Shell is implemented and available.
- Initial Value Problems Lab is the complete numerical Lab.
- Production is verified at `https://numerical-t-lab.vercel.app/`.
- The former Production address remains available as a verified alias.
- Production contains no Glossary terms.
- Production initializes an inert Platform Glossary Host, but the current Lab
  supplies no binding and cannot activate a surface.
- The DEV-only Playground and its five neutral fixtures are excluded from the
  production build.
- Commits 1 through 3 add no visible production Glossary behavior.
- Canonical notation and production definitions are intentionally deferred.

## Explicit non-goals

- No production Glossary content.
- No canonical notation standard yet.
- No real Tutor Glossary queue.
- No ODE annotations.
- No Linear Algebra or PDE Glossary content.
- No private-reference processing in runtime or CI.
- No runtime notation profiles or selector.

## Review gate

Final conservative re-audit of Commit 3 plus both locally verified
lifecycle-fix commits is the active gate. Commit 1 was accepted after
conservative audit, the readonly-math prerequisite is locally verified, and
shared surfaces remain content-agnostic and production-inert. Commit 4 remains
unauthorized. Production Glossary terms, annotations, and visible runtime
behavior remain absent.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
