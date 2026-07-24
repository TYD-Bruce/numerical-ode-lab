# Active Project Plan

## Status

Project Identity Migration complete. The Content-Agnostic Interactive Glossary
Framework design is approved and committed. Its repository-grounded
implementation plan was conservatively audited, corrected for documentation
findings, and remains pending re-audit. Implementation has not started, and
Commit 1 is not authorized.

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

Status: **Approved design; implementation not started.**

## Authoritative implementation plan

[Content-Agnostic Interactive Glossary Framework Implementation Plan](docs/superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md)

Status: **Repository-grounded plan corrected after conservative audit;
re-audit pending. Implementation not started.**

## Approved delivery sequence

1. Add and review Codex project guidance on local `main`. Complete.
2. Document the Content-Agnostic Interactive Glossary Framework design on
   local `main`. Complete in the commit containing this plan.
3. Create the repository-grounded implementation plan on local `main`.
   Complete; conservative audit found documentation corrections, and the
   corrected plan is pending re-audit.
4. Build Glossary model and scope lifecycle.
5. Fix readonly math accessible ownership as a narrow prerequisite.
6. Add shared Glossary surfaces and the minimal committed DEV-only Playground
   harness.
7. Complete the development Glossary Playground.
8. Complete the separate notation and definition foundation.
9. Add the reviewed ODE vertical slice.
10. Push only when explicitly requested by the maintainer.

## Current next action

Run a conservative Cursor re-audit of the corrected repository-grounded
Content-Agnostic Interactive Glossary Framework implementation plan. Commit 1
is not authorized; do not begin framework implementation before the corrected
plan is re-audited and approved.

## Current production behavior

- The Platform Shell is implemented and available.
- Initial Value Problems Lab is the complete numerical Lab.
- Production is verified at `https://numerical-t-lab.vercel.app/`.
- The former Production address remains available as a verified alias.
- Production contains no Glossary terms.
- Production contains no Glossary Host behavior.
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

Conservative Cursor re-audit of the corrected repository-grounded
implementation plan is the active gate. The initial audit returned
documentation findings; the plan now records their approved resolutions while
preserving the design. It must be re-audited and approved before Commit 1.
Production Glossary terms and runtime behavior remain absent.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
