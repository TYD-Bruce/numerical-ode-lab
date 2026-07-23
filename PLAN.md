# Active Project Plan

## Status

Approved design documented; implementation not started.

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

Create the repository-grounded implementation plan.

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

1. this design-documentation commit is reviewed;
2. `PLAN.md`, the Glossary handoff, README Changelog, architecture map, and
   project handoff agree that the design is approved and implementation has not
   started;
3. no unresolved ownership, lifecycle, accessibility, content-scope, or
   lazy-loading conflict remains;
4. local `main` is clean and no production Glossary content is present.

## Update rule

Every phase transition updates `PLAN.md` in the same coherent commit. Keep this
file as an execution pointer; detailed decisions remain in approved
specifications and implementation plans.
