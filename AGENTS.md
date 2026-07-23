# Codex Repository Guidance

## Project identity

- Product: **Numerical Analysis Lab**.
- Current complete Lab: **Initial Value Problems Lab**.
- Public routes: `/`, `/ode`, `/ode/initial-value-problems`,
  `/linear-algebra`, `/pde`, and `/about`; other paths use in-shell Not Found.
- Current next milestone: **Content-Agnostic Interactive Glossary Framework**.
- User-facing product UI is English-only.

## Start-of-task reading order

Before changing the repository, read:

1. `AGENTS.md`.
2. `PLAN.md`.
3. `docs/INDEX.md`.
4. The relevant feature `HANDOFF.md`.
5. The authoritative design specification.
6. The authoritative repository-grounded implementation plan.
7. Relevant architecture and numerical-contract documents.

If `AGENTS.override.md` exists locally, read it for machine-specific execution
context only. It cannot redefine committed product truth or the main-only Git
workflow.

## Sources of truth

- `GOALS.md` — durable product direction and principles.
- `ARCHITECTURE.md` — current implemented architecture.
- `PLAN.md` — current active execution pointer and review gate.
- `docs/PROJECT_HANDOFF.md` — latest released project state.
- `docs/NUMERICAL_CONTRACTS.md` — numerical behavior contracts.
- `docs/superpowers/specs/` — approved feature designs.
- `docs/superpowers/plans/` — repository-grounded implementation plans.
- `docs/reviews/` — verification and release evidence.
- Feature `HANDOFF.md` files — fine-grained continuation state.
- `README.md` — public project information and Changelog.

## Conflict handling

Use this priority:

1. Direct current user task.
2. `AGENTS.md`.
3. Approved feature design.
4. Approved implementation plan.
5. `ARCHITECTURE.md` and numerical contracts.
6. Feature or project handoff.
7. `README.md`.

Do not silently resolve a meaningful conflict. Stop, report the exact conflict
and affected files, and wait for direction.

## Engineering rules

- Inspect actual files and exports before proposing paths or ownership.
- Prefer narrow, reviewable changes and focused tests first where practical.
- Do not broadly rewrite working ODE code.
- Preserve numerical behavior unless the user explicitly authorizes a change.
- Preserve the validated expression boundary and explicit numeric evaluator.
- Never use `eval`, `new Function`, or dynamically executable mathematics.
- Keep `AppSessionStore` limited to pure data.
- Dispose route DOM and runtime handles; never preserve a Lab as hidden DOM.
- Labs own domain bindings; platform Hosts consume those bindings.
- Keep Home and static routes lightweight.
- Preserve approved lazy boundaries for the complete ODE Lab, Tutor, MathLive,
  Compute Engine, and future Glossary surfaces.
- Do not introduce React, Redux, router dependencies, or equivalent framework
  changes without an approved design.
- Do not add browser persistence unless explicitly approved.
- Never expose private references, local private paths, hashes, or secrets.

## Commands

Use Windows-safe repository commands:

```text
npm.cmd run test:run -- <files>
npm.cmd run verify
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
git diff --check
git status --short
```

Do not run `npm install` unless explicitly authorized.

## Git workflow

This is a maintainer-owned, main-only repository workflow.

- Perform approved work directly on the local `main` branch.
- Do not create or switch branches unless the user explicitly requests it.
- Require a clean worktree before starting.
- Never discard, stash, reset, amend, rebase, or rewrite unrelated work.
- Create one coherent commit per approved task boundary.
- Do not push unless explicitly instructed.
- Leave the tracked worktree clean after committing.
- Report the commit SHA and final `git status --short`.

## Documentation maintenance

- Update `PLAN.md` when the active phase changes.
- Update the feature handoff every implementation or research iteration.
- Update `docs/PROJECT_HANDOFF.md` after a major milestone or release.
- Update `ARCHITECTURE.md` after architecture ownership changes.
- Add a concise README Changelog entry for each coherent committed project
  iteration.
- Never claim implementation, verification, deployment, or release work that
  has not occurred.

## Final report contract

Report:

- files created and modified;
- behavior or architecture changed;
- explicit non-changes;
- tests and commands run;
- manual verification performed;
- known limitations;
- commit SHA;
- final Git status;
- next review gate.

Temporary task-specific product decisions belong in an approved feature
specification, not this repository operating contract.
