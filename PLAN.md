# Active Project Plan

## Status

Approved Glossary design documented; implementation not started. The bounded
Project Identity Migration is externally complete; only the local
workspace-directory rename and reopening check remain before Glossary
implementation planning continues.

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

## Temporary Project Identity Migration gate

The canonical product is **Numerical T-Lab** with target slug
`numerical-t-lab`. Active product UI, internal package, route titles, Tutor
identity wording, migration documentation, and publication-safety preparation
are recorded by:

- [Numerical T-Lab Rename Migration Plan](docs/superpowers/plans/2026-07-22-numerical-t-lab-rename-migration-plan.md)
- [Project Rename Handoff](docs/project-rename/HANDOFF.md)

The public and private GitHub repositories, local remote URLs, existing Vercel
project, Git integration, and canonical Production domain now use
`numerical-t-lab`. Repository IDs, visibility, Vercel Project ID, deployment
settings, and the `main` Production branch were preserved. The former
Production domain remains a verified alias. The local directory still uses its
legacy basename and is intentionally deferred until all old-path processes are
closed.

## Why this milestone

The platform needs shared, accessible, domain-neutral definition infrastructure
before reviewed ODE, Linear Algebra, or PDE terminology is published. The
framework must preserve current ownership, lifecycle, accessibility, and lazy
loading while keeping formal mathematical content separate.

## Authoritative design

[Content-Agnostic Interactive Glossary Framework Design](docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)

Status: **Approved design; implementation not started.**

## Authoritative implementation plan

Not created yet. Repository-grounded planning follows design approval.

## Approved delivery sequence

1. Add and review Codex project guidance on local `main`. Complete.
2. Document the Content-Agnostic Interactive Glossary Framework design on
   local `main`. Complete in the commit containing this plan.
3. Create the repository-grounded implementation plan on local `main`.
4. Build Glossary model and scope lifecycle.
5. Add shared Glossary surfaces.
6. Add the development Glossary Playground.
7. Complete the separate notation and definition foundation.
8. Add the reviewed ODE vertical slice.
9. Push only when explicitly requested by the maintainer.

## Current next action

Close every process that owns the legacy workspace path, rename the local
directory basename to `numerical-t-lab`, reopen Cursor/Codex from the new path,
and confirm branch, HEAD, status, remotes, and a focused local smoke test. Then
return to creating the repository-grounded Glossary implementation plan.

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

Repository-grounded implementation planning may begin only after:

1. the completed Numerical T-Lab external migration is recorded and the local
   workspace is reopened successfully under the canonical basename;
2. the Glossary design-documentation commit is reviewed;
3. `PLAN.md`, the Glossary handoff, README Changelog, architecture map, and
   project handoff agree that the design is approved and implementation has not
   started;
4. no unresolved ownership, lifecycle, accessibility, content-scope, or
   lazy-loading conflict remains;
5. local `main` is clean and no production Glossary content is present.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
