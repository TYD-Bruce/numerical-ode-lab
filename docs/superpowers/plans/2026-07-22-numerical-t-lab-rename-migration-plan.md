# Numerical T-Lab Rename Migration Plan

**Status:** Internal identity preparation on local `main`; external migration
not started

**Date:** 2026-07-22

**Task boundary:** Product identity, repository names, deployment identity, and
local-directory migration only

## 1. Purpose

This plan prepares one canonical public identity:

- product: **Numerical T-Lab**;
- brand pillars: **Theory · Tools · Teaching**;
- descriptor: **An Interactive Numerical Analysis Laboratory**;
- learner workflow: **Understand → Compute → Visualize → Analyze**;
- canonical slug and npm package: `numerical-t-lab`.

The official public meaning of `T` is Theory, Tools, and Teaching.

This work changes no numerical behavior, ODE ownership, route, session
namespace, Glossary decision, dependency, Vite configuration, Vercel
configuration, remote, or external platform. It does not assert that any target
repository, project name, or domain is available.

## 2. Starting repository state and divergence

This identity iteration began from:

- branch: `main`;
- HEAD: `6da5e4451b18191f75b403b162b31ffcc57c844a`;
- worktree: clean;
- `origin/main`: five commits behind local `main`;
- `vercel/main`: five commits behind local `main`;
- `origin`: `https://github.com/TYD-Bruce/numerical-ode-lab.git`;
- `vercel`: `https://github.com/TYD-Bruce/numerical-ode-lab-w_ai.git`;
- local directory basename: `numerical-ode-lab`
  (machine-local absolute path intentionally omitted from public docs).

The starting HEAD was the local-only generic identity-preparation commit. The
maintainer explicitly authorized superseding that proposal with Numerical
T-Lab without resetting or amending history. Once this plan's commit is
created, local `main` will be six commits ahead of both locally recorded remote
tracking branches. No remote was contacted to refresh those references.

## 3. Current and target identity matrix

Active product UI, package name, titles, and Tutor wording already use
**Numerical T-Lab** / `numerical-t-lab`. The left column is legacy / starting
or still-external evidence only.

| Identity | Legacy, starting, or still-external evidence | Canonical target |
|---|---|---|
| Product display name | Numerical Analysis Lab | Numerical T-Lab (already active in product UI) |
| Brand pillars | Not previously defined | Theory · Tools · Teaching |
| Descriptor | Generic platform description | An Interactive Numerical Analysis Laboratory |
| Learner workflow | Understand → Compute → Visualize → Analyze | Preserve unchanged |
| Slug | Local proposal used `numerical-analysis-lab`; external identity remains legacy | `numerical-t-lab` |
| npm package | `numerical-analysis-lab` at starting HEAD | `numerical-t-lab` (already local) |
| Public repository | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-t-lab` |
| Private deployment repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-t-lab-deploy` |
| Vercel project | Not discoverable from local repository state | `numerical-t-lab` |
| Production address | `numerical-ode-lab-wai.vercel.app` is the current recorded address | Preferred `numerical-t-lab.vercel.app`; availability and deployment unverified |
| Local directory basename | `numerical-ode-lab` | `numerical-t-lab` |
| Git remote names | `origin`, `vercel` | Preserve names; update URLs later |

The target repository names, Vercel project name, and preferred domain have
not been checked for availability.

## 4. Internal identity preparation

The local identity commit contains only:

- active Home, App Shell, route-title, About, Not Found, Tutor, and bootstrap
  product identity;
- a restrained three-line Home hierarchy using existing semantic tokens;
- the official public pillars and descriptor;
- npm package and root lockfile identity;
- focused behavioral and build-contract assertions;
- current operating, architecture, goals, status, and migration documentation;
- honest current-versus-target repository and deployment instructions;
- publication-safety preparation already established at the starting HEAD.

The earlier `.env.local` removal from tracking remains intact. Its ignored local
copy is preserved. `.vercel/` remains ignored.

## 5. Preserved domain and internal identifiers

The following are domain, module, or stable lifecycle terminology and remain
unchanged:

- `/ode`;
- `/ode/initial-value-problems`;
- `src/ode/`;
- `OdeSessionState`;
- `Initial Value Problems Lab`;
- `Numerical ODE`;
- `history.state.numericalAnalysisLab`;
- its related internal history-entry namespace;
- `[ode-lab-api]` in `server/dev.ts`;
- correct phrases such as “complete ODE Lab”;
- solver, Convergence, expression, Tutor, and Glossary identifiers;
- descriptive uses of the academic field “numerical analysis.”

The ODE Tutor remains limited to the current Initial Value Problems Lab.

## 6. Historical evidence preservation

Point-in-time evidence remains unchanged even when it contains a former name
or URL:

- the old verified Preview URL in `docs/PROJECT_HANDOFF.md`;
- `docs/reviews/2026-07-14-theme-ready-platform-shell-review.md`;
- `docs/superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md`;
- the implemented Theme-Ready Platform Shell design;
- `docs/superpowers/specs/2026-07-10-convergence-study-design.md`;
- `docs/superpowers/specs/2026-07-10-human-friendly-math-expressions-design.md`;
- Git history, reflogs, and `FETCH_HEAD`;
- ignored/generated `dist`;
- generated `node_modules/.package-lock.json`.

Later completion documentation must add observed evidence instead of rewriting
these records. The superseded 2026-07-22 generic rename plan is removed because
it was current migration guidance, not released point-in-time evidence; its
exact chronology remains available in Git history.

## 7. Publication safety

Before identity changes:

- `.env.local` was confirmed untracked, present locally, and ignored;
- its current content and reachable tracked revisions were inspected without
  displaying values;
- only placeholders or non-sensitive local defaults were detected;
- `.env.example` covered the required configuration;
- no current or historical live credential was detected;
- the five commits ahead of both locally recorded remote branches were checked
  for credentials, private endpoints, private-reference hashes, and substantial
  private quotations;
- public migration docs record local directory basenames only, not
  machine-local absolute paths;
- ignored private-reference contents were not inspected.

No secret value is recorded in this plan.

## 8. Commit boundaries

### Internal identity commit

Create one local commit:

```text
Prepare Numerical T-Lab identity migration
```

It must contain only the approved active identity, focused tests, and migration
documentation. It must not amend the preceding generic preparation commit.

### External checkpoint: GitHub repositories and remotes

Complete only under a separate maintainer-authorized task.

### External checkpoint: Vercel project, integration, and domain

Complete only after the GitHub checkpoint and under separate authorization.

### Completion record

After verified external migration, create a separate documentation commit that
records observed repository, Vercel, domain, deployment, browser, and
local-directory truth. Do not rewrite or amend the internal identity commit.

## 9. GitHub repository rename sequence

1. Confirm both target names are available.
2. Capture current repository owner, visibility, repository ID, default branch,
   branch protection, Actions settings, issues, and integrations without
   copying secrets.
3. Rename the public repository to `TYD-Bruce/numerical-t-lab`.
4. Verify the new public URL directly.
5. Rename the private deployment repository to
   `TYD-Bruce/numerical-t-lab-deploy`.
6. Verify the new private URL and visibility directly.
7. Record observed old-URL behavior without assuming redirects.
8. Stop if identity, visibility, protection, or integration settings differ
   materially from the captured checkpoint.

## 10. Local remote URL update sequence

After each corresponding GitHub rename is directly verified:

1. Require clean local `main` at the expected identity commit.
2. Record `git remote -v`.
3. Set `origin` to
   `https://github.com/TYD-Bruce/numerical-t-lab.git`.
4. Re-read `origin` fetch and push URLs.
5. Set `vercel` to
   `https://github.com/TYD-Bruce/numerical-t-lab-deploy.git`.
6. Re-read `vercel` fetch and push URLs.
7. Do not push until the Vercel Git-integration checkpoint is ready.

If a target URL fails direct verification, restore the exact prior URL before
continuing.

## 11. Vercel project and Git-integration sequence

1. Capture the current Vercel project ID, account/team scope, project name,
   connected repository, production branch, build settings,
   environment-variable names, protection, domains, and last known-good
   deployment.
2. Confirm the target project name and preferred domain are available.
3. Prefer preserving the existing project ID if observed Vercel controls
   support a safe rename.
4. Rename the project to `numerical-t-lab`.
5. Verify or reconnect Git integration to
   `TYD-Bruce/numerical-t-lab-deploy`.
6. Preserve `main` as the production branch unless separately approved.
7. Preserve environment values without printing or copying them into evidence.
8. Create a Preview from the exact reviewed commit.
9. Do not change production routing until Preview verification passes.

No claim about Vercel rename behavior is made until it is observed.

## 12. New-domain verification and old-domain transition

1. Keep the current recorded production address and last known-good deployment
   available as rollback while testing.
2. Assign `numerical-t-lab.vercel.app` only if Vercel confirms it is available.
3. Verify direct and refreshed `/`, `/ode`,
   `/ode/initial-value-problems`, `/linear-algebra`, `/pde`, `/about`, and an
   unknown route.
4. Verify `/api/chat` remains JSON/function-backed and is not swallowed by the
   SPA fallback.
5. Verify representative JavaScript, CSS, and font assets and their content
   types.
6. Verify route titles, Home hierarchy, App Shell identity, desktop/mobile
   layout, lazy chunk order, and console health.
7. Observe whether the old address serves, aliases, redirects, or retires.
8. Document that observed behavior; do not infer or promise a redirect.
9. Remove or retire the old address only after the new production address and
   rollback path are reviewed.

## 13. Local-directory and workspace reopening sequence

The local directory rename is last:

1. Require clean `main`, expected completion commit, verified external state,
   and canonical remote URLs.
2. Stop local servers.
3. Close terminals, Cursor, and Codex sessions using the old directory.
4. Rename the local workspace directory from basename `numerical-ode-lab` to
   `numerical-t-lab` (do not record the machine-local absolute path in public
   docs).
5. Reopen the renamed workspace directory in Cursor.
6. Reopen a terminal at the new path and confirm branch, HEAD, status, and
   remotes.
7. Reopen the Codex task from the new working directory.
8. Run a focused local start and route-title smoke test.
9. Search workspace/configuration files for stale absolute paths.

Do not rename the directory while an editor, server, terminal, or agent still
owns the old path.

## 14. Test and browser verification matrix

| Area | Local automated gate | Later browser/deployment gate |
|---|---|---|
| Package/bootstrap | package and lockfile root names; generated HTML title | fetched production HTML title |
| Home | heading, pillars, descriptor, learner cycle | desktop and ~390 × 844 hierarchy/overflow |
| App Shell | persistent brand behavior | desktop/mobile navigation |
| Route titles | every public and Not Found title | direct navigation and refresh |
| About | concise pillar explanations; no personal-name expansion | readable desktop/mobile layout |
| Tutor | canonical product/module prompt; ODE-only scope | existing mock/API behavior |
| ODE preservation | focused identity tests plus full verification | Lab route and successful starter smoke |
| Lazy loading | existing manifest/source-graph contracts | Home, ODE, Tutor, and math chunk sequence |
| Deployment | Vite/Vercel contracts | nested routes, API, assets, MIME types, console |

The internal commit requires focused identity tests, both TypeScript checks, a
production build, `npm.cmd run verify`, diff checks, and a classified identity
search. No unrelated numerical or full-data workflow is required.

## 15. Rollback checkpoints

- **Before commit:** discard nothing automatically; stop if unrelated work
  appears.
- **After internal commit:** revert it with a new commit if audit fails; do not
  reset or amend.
- **After either GitHub rename:** rename that exact repository back and restore
  its prior remote URL if verification fails.
- **During Vercel work:** retain project ID, prior name/settings, domains,
  integration details, environment names, and last known-good deployment until
  verification passes.
- **Before production:** keep the old address and deployment as rollback.
- **After local-directory rename:** close applications and rename the directory
  back if reopening fails; Git history is unaffected.
- **Documentation error:** correct with a new commit.

## 16. Risks, blockers, and pending checks

- GitHub target-name availability is unknown.
- Repository visibility, protections, and integrations require external
  inspection.
- The current Vercel project identity is not available from local repository
  state because `.vercel` is absent or ignored.
- Vercel project-name and preferred-domain availability are unknown.
- GitHub and Vercel redirect behavior is unknown.
- The current recorded production address was not re-verified by this local
  task.
- Local `main` will be six commits ahead of both locally recorded remote
  tracking branches after the identity commit.
- The preceding generic identity commit remains in local chronology and must
  not be amended or erased.
- A conservative Cursor audit is required before any external action.

## 17. Recommended final order of operations

1. Complete and locally verify the Numerical T-Lab identity commit.
2. Run the conservative Cursor audit and address only authorized findings.
3. Authorize and complete GitHub repository renames.
4. Update and verify local remote URLs.
5. Authorize and complete Vercel project/Git-integration work.
6. Verify a Preview from the reviewed commit.
7. Assign and verify the preferred production domain if available.
8. Observe and document old-domain behavior.
9. Push or promote only under explicit authorization.
10. Create the external-completion documentation commit.
11. Rename the local directory last and reopen Cursor/Codex at the new path.
12. Return to the repository-grounded Glossary implementation plan.

## 18. Exact next gate

Run a conservative Cursor audit of the committed Numerical T-Lab identity
migration. Stop after the audit; do not contact remotes, change external
platforms, rename the local directory, or begin Glossary implementation.
