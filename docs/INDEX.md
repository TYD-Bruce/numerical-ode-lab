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
documented. The corrected plan passed conservative re-audit, Commit 1 was
accepted after conservative audit, the readonly-math prerequisite is locally
verified, and Commit 3 shared surfaces are implemented and locally/browser
verified with two lifecycle follow-ups accepted by final conservative
re-audit. Commit 4 completes the DEV-only Playground, development controls,
About entry, shortcut, fixture matrix, and production-exclusion evidence. The
four-phase implementation completed its 2026-07-28 full framework release
review with verdict **RELEASE BLOCKED**. A P1 pending-load scope-replacement
defect, substantive P2 one-shot Tab-bridge defect, and DEV-only P3 log finding
are now locally repaired and verified. The blocked review remains historical;
a repeated independent review of the exact repair commit is required before
local acceptance.
Production contains no Glossary terms or content and no visible surface
behavior; its Host is inert and all Playground capabilities are DEV-only.
The bounded Project Identity Migration is complete.
The GitHub repositories, remotes, existing Vercel project, Git integration,
Preview, Production deployment, canonical domain, and canonical local
workspace are migrated and verified.

A parallel private-source-reviewed terminology and teaching-language
foundation is now drafted for maintainer review. It does not change the active
Glossary framework review gate, publish production terms, or authorize runtime
copy changes.

## Content foundation drafts

All documents in this section have status **Private-source-reviewed draft;
maintainer approval pending**.

| Document | Purpose |
|---|---|
| [Content Source Policy](content/CONTENT_SOURCE_POLICY.md) | Abstract source keys, evidence priority, conflicts, locators, copyright, and approval lifecycle |
| [Numerical Terminology Standard](content/NUMERICAL_TERMINOLOGY_STANDARD.md) | Complete merged candidate set admitted by the bounded review |
| [Numerical Notation Standard](content/NUMERICAL_NOTATION_STANDARD.md) | Proposed notation conventions and unresolved choices |
| [Teaching Voice](content/TEACHING_VOICE.md) | Learner-facing language, warnings, errors, results, and Tutor tone |
| [Glossary Catalog](content/GLOSSARY_CATALOG.md) | Planning catalog for reviewed candidate terms; not runtime data |
| [Project Copy Audit](content/PROJECT_COPY_AUDIT.md) | Current-copy evidence and staged A–F rewrite plan |
| [Terminology Decisions](content/TERMINOLOGY_DECISIONS.md) | Aligned distinctions, provisional resolutions, and nine maintainer decisions |
| [Content Foundation Handoff](content/HANDOFF.md) | Coverage, counts, validation, limitations, and continuation gate |

## Product and feature specifications

| Document | Status |
|---|---|
| [Theme-Ready Platform Shell Design](superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md) | Implemented, Vercel Preview-verified, safe to release |
| [Human-Friendly Math Expressions Design](superpowers/specs/2026-07-10-human-friendly-math-expressions-design.md) | Implemented and verified |
| [Observed Convergence Order Experiment Design](superpowers/specs/2026-07-10-convergence-study-design.md) | Implemented, verified, release ready |
| [Content-Agnostic Interactive Glossary Framework Design](superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md) | Approved design; four implementation phases complete locally; blocked-review P1/P2/P3 findings locally repaired; repeated independent review pending; production content remains deferred |

## Implementation plans

| Document | Status |
|---|---|
| [Theme-Ready Platform Shell Implementation Plan](superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md) | Implemented historical plan; check the final review and architecture map for current state |
| [Numerical T-Lab Rename Migration Plan](superpowers/plans/2026-07-22-numerical-t-lab-rename-migration-plan.md) | Project Identity Migration completed and verified |
| [Content-Agnostic Interactive Glossary Framework Implementation Plan](superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md) | Four planned phases complete locally; Commit 3 follow-ups accepted; Commit 4 evidence recorded; blocked-review findings locally repaired; repeated independent review pending; no production content or visible behavior |

## Reviews and release evidence

| Document | Verdict or status |
|---|---|
| [Theme-Ready Platform Shell Final Review](reviews/2026-07-14-theme-ready-platform-shell-review.md) | Safe to release |
| [Numerical T-Lab Rename Review](reviews/2026-07-22-numerical-t-lab-rename-review.md) | Project Identity Migration completed and verified |
| [Human-Friendly Math Expressions Review](reviews/2026-07-10-human-friendly-math-expressions-review.md) | Safe to release Version 1 |
| [Observed Convergence Order Experiment Review](reviews/2026-07-10-convergence-study-review.md) | Safe to release Version 1 |
| [Content-Agnostic Interactive Glossary Framework Release Review](reviews/2026-07-28-content-agnostic-interactive-glossary-framework-review.md) | Historical verdict **RELEASE BLOCKED**; its P1/P2/P3 findings are locally repaired in a later commit, with repeated independent review pending |

## Feature handoffs

- [Project handoff](PROJECT_HANDOFF.md) — implemented Platform Shell and current
  release baseline.
- [Numerical notation research handoff](research/HANDOFF.md) — non-canonical
  evidence-research continuation state.
- [Content-Agnostic Interactive Glossary Framework handoff](glossary/HANDOFF.md)
  — approved design, corrected and re-audited implementation plan, accepted
  Commit 1, locally verified readonly-math prerequisite, accepted Commit 3
  lifecycle follow-ups, and the complete locally/browser-verified DEV
  Playground with production-exclusion evidence; all three blocked-review
  findings are locally repaired, with repeated independent review pending.
- [Numerical terminology and teaching-language foundation handoff](content/HANDOFF.md)
  — 29-source draft synthesis, notation/terminology decisions, current-copy
  audit, validation evidence, and maintainer-review continuation state; no
  production content or runtime change.
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
