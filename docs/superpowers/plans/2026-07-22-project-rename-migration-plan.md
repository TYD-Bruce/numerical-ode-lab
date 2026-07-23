# Project Rename Migration Plan

**Status:** Internal preparation on local `main`; external migration not
started

**Date:** 2026-07-22

**Task boundary:** Project identity, repository names, deployment identity, and
local-directory migration only

## 1. Purpose

This plan prepares the repository for one canonical identity:
**Numerical Analysis Lab** with slug `numerical-analysis-lab`. It separates
reviewable local changes from GitHub, Git remote, Vercel, domain, and
local-directory actions that require later explicit authorization.

This work does not change numerical behavior, ODE ownership, routes, the
Glossary design, dependencies, deployment configuration, or production state.
It does not assert that any target repository, project name, or domain is
available.

## 2. Starting repository state

Preparation began from:

- branch: `main`;
- HEAD: `76730409945d291f8fcbc734a9eb5a18bb4c25ff`;
- worktree: clean;
- `origin/main`: four commits behind local `main`;
- `vercel/main`: four commits behind local `main`;
- `origin`: `https://github.com/TYD-Bruce/numerical-ode-lab.git`;
- `vercel`: `https://github.com/TYD-Bruce/numerical-ode-lab-w_ai.git`;
- local directory: `D:\numerical-ode-lab`.

The four local commits not present on either remote are:

1. `334a5b1` — Start numerical notation research
2. `fb3e786` — Add Codex project guidance
3. `4ae0eff` — Document the interactive glossary framework
4. `7673040` — Formalize repository agent operating contract

A later push of the identity-preparation commit will also publish these four
commits unless the maintainer authorizes a different plan.

## 3. Canonical identity matrix

| Identity | Current repository evidence | Canonical target |
|---|---|---|
| Product display name | Numerical Analysis Lab | Numerical Analysis Lab |
| Slug | Mixed legacy identity | `numerical-analysis-lab` |
| npm package | `numerical-ode-lab` | `numerical-analysis-lab` |
| Public repository | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-analysis-lab` |
| Private deployment repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-analysis-lab-deploy` |
| Vercel project | Not discoverable from local state | `numerical-analysis-lab` |
| Production address | `numerical-ode-lab-wai.vercel.app` is the current recorded address | Preferred `numerical-analysis-lab.vercel.app`; availability and deployment unverified |
| Local directory | `D:\numerical-ode-lab` | `D:\numerical-analysis-lab` |
| Git remote names | `origin`, `vercel` | Preserve names; update URLs later |

## 4. Preserved domain and runtime identifiers

The following are domain/module ownership rather than branding residue and
must remain unchanged:

- `/ode`;
- `/ode/initial-value-problems`;
- `src/ode/`;
- `OdeSessionState`;
- `Initial Value Problems Lab`;
- `Numerical ODE`;
- `history.state.numericalAnalysisLab`;
- `[ode-lab-api]` in `server/dev.ts`.

The existing route titles already combine module and product identity
correctly. No route, session, Store, numerical, Tutor-behavior, or lazy-loading
contract changes.

## 5. Commit 1 — internal preparation

The local preparation commit contains only:

- safe removal of `.env.local` from Git tracking while preserving the ignored
  local file;
- npm package identity in `package.json` and the two root lockfile fields;
- the fallback HTML product title;
- canonical product/module wording in the existing ODE Tutor prompt and its
  acknowledgement;
- official Initial Value Problems Lab development-log prefixes;
- focused identity assertions;
- `.vercel/` ignore protection;
- README target wording that distinguishes current recorded state from
  unverified future targets;
- this plan, its HANDOFF, `PLAN.md`, and `docs/INDEX.md`.

No dependency installation or dependency change is required.

## 6. Historical evidence preservation

Point-in-time evidence remains unchanged even when it contains a former name
or URL:

- the old verified Preview URL in `docs/PROJECT_HANDOFF.md`;
- `docs/reviews/2026-07-14-theme-ready-platform-shell-review.md`;
- `docs/superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md`;
- `docs/superpowers/specs/2026-07-10-convergence-study-design.md`;
- `docs/superpowers/specs/2026-07-10-human-friendly-math-expressions-design.md`;
- Git history, reflogs, and `FETCH_HEAD`;
- ignored `dist` output;
- generated `node_modules/.package-lock.json`.

Later completion documentation must add new evidence rather than rewriting
these passages.

## 7. Publication safety

Before preparation:

- the tracked `.env.local` file and its reachable revisions were checked
  without exposing values;
- only non-sensitive local/default configuration was present;
- `.env.example` covered the required configuration;
- the four unpushed commits were checked for live credentials, private
  absolute paths or endpoints, private-reference hashes, and substantial
  private quotations;
- ignored private reference contents were not inspected.

The local `.env.local` file is preserved and remains protected by the existing
ignore rule. `.vercel/` is ignored before any future local Vercel link state is
created.

## 8. GitHub and remote checkpoint

This checkpoint requires a separate maintainer-authorized task:

1. Confirm both target repository names are available.
2. Capture current repository visibility, IDs, default branches, protections,
   Actions settings, issues, and integrations without copying secrets.
3. Rename the public repository to
   `TYD-Bruce/numerical-analysis-lab`.
4. Update `origin` with `git remote set-url`.
5. Verify the new public URL directly; do not rely on an old-URL redirect.
6. Rename the private deployment repository to
   `TYD-Bruce/numerical-analysis-lab-deploy`.
7. Update `vercel` with `git remote set-url`.
8. Verify the new private URL and visibility directly.
9. Do not push until the Vercel Git-integration checkpoint is ready.

No repository or remote rename occurs in Commit 1.

## 9. Vercel and domain checkpoint

This checkpoint also requires separate authorization:

1. Capture the current Vercel project ID, team/scope, project name, connected
   repository, production branch, build settings, environment-variable names,
   deployment protection, domains, and last known-good deployment.
2. Confirm the target project name and preferred domain are available.
3. Preserve the existing project ID if the platform supports a safe rename.
4. Rename the project to `numerical-analysis-lab`.
5. Verify or reconnect Git integration to
   `TYD-Bruce/numerical-analysis-lab-deploy`.
6. Keep the production branch as `main` unless separately approved.
7. Keep the old address attached until the new deployment passes.
8. Create and verify a Preview from the exact reviewed commit before any
   production promotion.
9. Verify nested routes, `/api/chat`, emitted assets and content types, Not
   Found, chunk timing, desktop/mobile layout, and console health.
10. Assign `numerical-analysis-lab.vercel.app` only if observed as available.
11. Record whether the old address serves, aliases, redirects, or retires;
    make no unsupported redirect claim.

No Vercel project, integration, deployment, or domain action occurs in
Commit 1.

## 10. Commit 2 — completion record

After external verification, one documentation commit should:

- mark this plan and `docs/project-rename/HANDOFF.md` complete;
- update README from pending target wording to observed deployment truth;
- update `PLAN.md` so Glossary implementation planning is again the immediate
  next action;
- update `docs/INDEX.md`;
- add current identity/deployment state to `docs/PROJECT_HANDOFF.md` without
  changing old Preview evidence;
- add a dated Project Rename review with exact local, GitHub, Vercel, domain,
  and browser evidence.

## 11. Local-directory checkpoint

Rename the local directory only after both commits, authorized pushes, and
external verification:

1. Require clean `main`, expected HEAD, and canonical remote URLs.
2. Stop local servers and close Cursor, Codex, and terminals using the old
   working directory.
3. Rename `D:\numerical-ode-lab` to `D:\numerical-analysis-lab`.
4. Reopen the new directory.
5. Recheck branch, HEAD, status, remotes, local development, and tests.

No committed workspace file contains the old absolute local path. The local
directory rename is deferred and is not part of Commit 1.

## 12. Rollback checkpoints

- **Before external work:** revert Commit 1 with a new revert commit; do not
  reset or rewrite history.
- **After either GitHub rename:** rename that exact repository back and restore
  its remote URL if required.
- **During Vercel work:** retain the old domain, project ID, integration
  details, environment settings, and last known-good deployment until the new
  deployment passes.
- **Before production:** keep the current deployment/address as the rollback
  target.
- **After local-directory rename:** close applications and rename the folder
  back; Git history is unaffected.
- **Documentation error:** correct with a new commit; do not amend published
  history.

## 13. Pending checks and blockers

- GitHub target-name availability is unknown.
- Current repository visibility and protection settings are not available
  locally.
- The Vercel project identity and Git-integration state are not available
  locally because `.vercel` state is absent.
- The preferred Vercel project name and domain availability are unknown.
- Old GitHub and Vercel redirect behavior is unknown and must not be assumed.
- A Preview branch or other deployment path needs explicit authorization.
- Local `main` remains ahead of both remotes.

## 14. Verification gates

Commit 1 requires:

```text
npm.cmd run test:run -- api/chatPrompt.test.ts src/app/viteBase.contract.test.ts
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd run verify
git diff --check
git diff --stat
git status --short
```

Generated output must be rebuilt, not edited. Identity searches must classify
active residue separately from historical evidence, correct ODE terminology,
and generated/local Git metadata.

## 15. Next review gate

The exact next gate is a conservative Cursor audit of the committed internal
preparation. No external rename or Glossary implementation begins before that
audit and a new maintainer-authorized task.
