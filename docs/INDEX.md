# Numerical T-Lab Documentation Index

## Start here

- [README](../README.md) — public project overview, operation, limitations, and
  Changelog.
- [AGENTS](../AGENTS.md) — Codex repository map and operating contract.
- [PLAN](../PLAN.md) — active milestone, next action, and review gate.
- [GOALS](../GOALS.md) — durable product direction.
- [ARCHITECTURE](../ARCHITECTURE.md) — current implemented architecture.
- [Project handoff](PROJECT_HANDOFF.md) — latest released platform state.
- [Numerical contracts](NUMERICAL_CONTRACTS.md) — authoritative numerical
  behavior.

## Current active milestone

[PLAN.md](../PLAN.md) points to the Content-Agnostic Interactive Glossary
Framework. Its approved design and repository-grounded implementation plan are
documented; implementation has not started. The bounded Project Identity
Migration is complete. The GitHub repositories, remotes, existing Vercel
project, Git integration, Preview, Production deployment, canonical domain,
and canonical local workspace are migrated and verified. Conservative review
of the Glossary implementation plan is the active gate.

## Product and feature specifications

| Document | Status |
|---|---|
| [Theme-Ready Platform Shell Design](superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md) | Implemented, Vercel Preview-verified, safe to release |
| [Human-Friendly Math Expressions Design](superpowers/specs/2026-07-10-human-friendly-math-expressions-design.md) | Implemented and verified |
| [Observed Convergence Order Experiment Design](superpowers/specs/2026-07-10-convergence-study-design.md) | Implemented, verified, release ready |
| [Content-Agnostic Interactive Glossary Framework Design](superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md) | Approved design; implementation not started |

## Implementation plans

| Document | Status |
|---|---|
| [Theme-Ready Platform Shell Implementation Plan](superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md) | Implemented historical plan; check the final review and architecture map for current state |
| [Numerical T-Lab Rename Migration Plan](superpowers/plans/2026-07-22-numerical-t-lab-rename-migration-plan.md) | Project Identity Migration completed and verified |
| [Content-Agnostic Interactive Glossary Framework Implementation Plan](superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md) | Repository-grounded plan created; conservative review pending; implementation not started |

## Reviews and release evidence

| Document | Verdict or status |
|---|---|
| [Theme-Ready Platform Shell Final Review](reviews/2026-07-14-theme-ready-platform-shell-review.md) | Safe to release |
| [Numerical T-Lab Rename Review](reviews/2026-07-22-numerical-t-lab-rename-review.md) | Project Identity Migration completed and verified |
| [Human-Friendly Math Expressions Review](reviews/2026-07-10-human-friendly-math-expressions-review.md) | Safe to release Version 1 |
| [Observed Convergence Order Experiment Review](reviews/2026-07-10-convergence-study-review.md) | Safe to release Version 1 |

## Feature handoffs

- [Project handoff](PROJECT_HANDOFF.md) — implemented Platform Shell and current
  release baseline.
- [Numerical notation research handoff](research/HANDOFF.md) — non-canonical
  evidence-research continuation state.
- [Content-Agnostic Interactive Glossary Framework handoff](glossary/HANDOFF.md)
  — approved design, completed planning iteration, and plan-audit
  continuation.
- [Project Rename handoff](project-rename/HANDOFF.md) — completed Project
  Identity Migration evidence, including the canonical local workspace reopen.

## Historical documents

Older specifications, plans, and review packages preserve design intent and
point-in-time evidence. They may describe migration baselines or test totals
that have since changed. Check the relevant final review,
[ARCHITECTURE.md](../ARCHITECTURE.md), current source, and
[PROJECT_HANDOFF.md](PROJECT_HANDOFF.md) before treating a historical statement
as current behavior.

Earlier Platform Shell and notation-research records may use **Interactive Term
Glossary** as an earlier working name. The unambiguous current milestone name is
**Content-Agnostic Interactive Glossary Framework**.

## Private references

[The references policy](../references/README.md) explains the public/private
boundary. Private local material may exist under the ignored
`references/private/` directory, but it is not part of the public repository.
Normal runtime, builds, tests, CI, public contribution, and documentation links
must not depend on it. Do not publish private contents, screenshots, hashes, or
machine-local paths.
