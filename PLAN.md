# Active Project Plan

## Status

Repository guidance is documented on local `main` and awaits maintainer review.
Product behavior is unchanged.

## Current released baseline

The Theme-Ready Platform Shell and Initial Value Problems Lab are implemented,
locally verified, and Vercel Preview-verified. The release state is recorded in
`docs/PROJECT_HANDOFF.md` and the Platform Shell final review.

## Active milestone

**Content-Agnostic Interactive Glossary Framework**

## Why this milestone

The platform needs shared, accessible, domain-neutral definition infrastructure
before reviewed ODE, Linear Algebra, or PDE terminology is published. The
framework must preserve current ownership, lifecycle, accessibility, and lazy
loading while keeping formal mathematical content separate.

## Authoritative design

Pending documentation task:

`docs/superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md`

The design is not yet part of the committed repository.

## Authoritative implementation plan

Not created yet. Repository-grounded planning follows design approval.

## Approved delivery sequence

1. Add Codex project guidance on local `main`.
2. Review the committed guidance.
3. Document the content-agnostic Glossary Framework design on local `main`.
4. Create the repository-grounded implementation plan on local `main`.
5. Build Glossary model and scope lifecycle.
6. Add shared Glossary surfaces.
7. Add the development Glossary Playground.
8. Wait for private course notes and teaching materials.
9. Build the notation and definition foundation.
10. Add the reviewed ODE vertical slice.
11. Push only when explicitly requested by the maintainer.

## Current next action

Review the Codex project-guidance commit, then document the content-agnostic
Glossary Framework design directly on local `main`.

## Current production behavior

- The Platform Shell is implemented and available.
- Initial Value Problems Lab is the complete numerical Lab.
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

1. this guidance commit is reviewed;
2. the content-agnostic design exists in the committed repository;
3. the design is reviewed and approved without unresolved ownership, lifecycle,
   accessibility, content-scope, or lazy-loading conflicts;
4. `PLAN.md`, the Glossary handoff, and README Changelog accurately record the
   design-only state;
5. local `main` is clean and no production Glossary content is present.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
