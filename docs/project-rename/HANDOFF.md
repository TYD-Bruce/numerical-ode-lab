# Numerical T-Lab Identity Migration Handoff

## Status

The Numerical T-Lab Project Identity Migration is complete and verified,
including the local workspace-directory rename and canonical workspace reopen.
No migration action remains pending.

The product is **Numerical T-Lab**.

- Brand pillars: **Theory · Tools · Teaching**
- Descriptor: **An Interactive Numerical Analysis Laboratory**
- Learner workflow: **Understand → Compute → Visualize → Analyze**
- Canonical slug: `numerical-t-lab`

The official public meaning of `T` is Theory, Tools, and Teaching.

## Starting state and divergence

- Branch: local maintainer-owned `main`
- Reviewed external-migration HEAD:
  `ead244ecefb82475414c73e15293184d99e1b78a`
- Starting worktree: clean
- At the external checkpoint, `origin/main` and `vercel/main` were seven
  commits behind local `main`.
- Current public remote:
  `https://github.com/TYD-Bruce/numerical-t-lab.git`
- Current deployment remote:
  `https://github.com/TYD-Bruce/numerical-t-lab-deploy.git`
- External-checkpoint local directory basename: `numerical-ode-lab`
- Current canonical local workspace: `D:\numerical-t-lab`
- Final reopen checkpoint: branch `main`, HEAD
  `521d8eba2aad3ad361c289e3e4b1e8e2e7ce6f30`, clean worktree, canonical
  `origin` and `vercel` remotes

The reviewed external-migration HEAD contains the identity commit
`e6c4ca5213fdfc572a6156999ba9e5323d59b0f1` and the separately authorized
Cursor-audit fixes in
`ead244ecefb82475414c73e15293184d99e1b78a`. Both renamed remote `main`
branches now contain that exact reviewed HEAD.

## Current and target identity

Active product UI, package name, titles, and Tutor wording already use
**Numerical T-Lab** / `numerical-t-lab`. The “Legacy or starting” column below
is pre-commit / still-external evidence only.

| Identity | Legacy or starting evidence | Target |
|---|---|---|
| Display name | Numerical Analysis Lab | Numerical T-Lab (already active in product UI) |
| npm package | `numerical-analysis-lab` at starting HEAD | `numerical-t-lab` (already local) |
| Public repository | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-t-lab` (complete) |
| Private deployment repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-t-lab-deploy` (complete) |
| Vercel project | `numerical-ode-lab-w_ai` | `numerical-t-lab` (complete; Project ID preserved) |
| Production address | `numerical-ode-lab-wai.vercel.app` | `numerical-t-lab.vercel.app` (verified); old address retained as an alias |
| Local directory basename | `numerical-ode-lab` | `numerical-t-lab` (complete at `D:\numerical-t-lab`) |

Target availability was checked through authenticated controls before the
renames. No replacement Vercel project was created.

## Publication safety

- `.env.local` is untracked, present locally, and ignored.
- Its current content and reachable tracked revisions contain only
  placeholders or non-sensitive local/default configuration.
- `.env.example` covers the required configuration.
- No current or historical live credential was detected.
- The local-only starting commits contain no detected credential, private
  endpoint, private-reference hash, or substantial private quotation.
- Public migration docs record local directory basenames only, not
  machine-local absolute paths.
- Ignored private-reference contents were not inspected.
- `.vercel/` remains ignored.

No secret value is recorded in this handoff.

## Internal identity scope

The identity commit updates:

- npm package and root lockfile names;
- fallback/generated HTML title;
- Home identity hierarchy;
- App Shell product identity;
- every current route title;
- concise About pillar explanations;
- Not Found product wording;
- ODE Tutor product/module wording only;
- focused behavioral and build-contract tests;
- current operating, goals, architecture, plan, index, public README, and
  current-state handoffs/spec identity;
- the Numerical T-Lab migration plan.

The Home hierarchy is:

```text
Numerical T-Lab
Theory · Tools · Teaching
An Interactive Numerical Analysis Laboratory
```

The learner workflow remains separately visible:

```text
Understand → Compute → Visualize → Analyze
```

## Preserved ODE and internal identifiers

- `/ode`
- `/ode/initial-value-problems`
- `src/ode/`
- `OdeSessionState`
- `Initial Value Problems Lab`
- `Numerical ODE`
- `history.state.numericalAnalysisLab`
- related internal history-entry identity
- `[ode-lab-api]` in `server/dev.ts`
- correct “complete ODE Lab” and numerical-analysis terminology

No numerical, route, session, Tutor-scope, dependency, Glossary, Vite, or
Vercel behavior changes.

## Local verification

- Focused Home, App Shell, route-title, About, Tutor-prompt, bootstrap, and
  unload tests: 8 files and 65 tests passed.
- Application and API TypeScript checks passed.
- Production build passed with 73 transformed modules and only the existing
  accepted deferred-chunk size warning.
- Full `npm.cmd run verify`: 60 files and 870 tests passed, followed by both
  TypeScript checks and the production build.
- After the physical folder rename, Cursor/Codex reopened from
  `D:\numerical-t-lab`. Git remained valid; branch stayed `main`; HEAD stayed
  `521d8eba2aad3ad361c289e3e4b1e8e2e7ce6f30`; the worktree stayed clean; and
  the canonical remotes stayed unchanged. The migration-closeout task reruns
  the focused About test, both typechecks, build, and full verification from
  that canonical path.
- Generated `index.html` uses `Numerical T-Lab`.
- Generated route titles use `Numerical T-Lab`.
- Generated active chunks contain no former product title or old
  coefficient-validation product prefix.
- Source verification confirms the coefficient-validation prefix is
  `[Initial Value Problems Lab]`.
- No numerical, route, session, Tutor-scope, dependency, or Glossary behavior
  changed.

## Historical evidence deliberately preserved

- old verified Preview URLs in `docs/PROJECT_HANDOFF.md`;
- the 2026-07-14 Theme-Ready Platform Shell review;
- the 2026-07-13 Platform Shell implementation plan and design;
- the 2026-07-10 Convergence and Human-Friendly Math Expressions designs;
- Git history, reflogs, and `FETCH_HEAD`;
- ignored/generated `dist`;
- generated `node_modules/.package-lock.json`.

The superseded generic rename plan is replaced because it was current migration
guidance, not released evidence. Its chronology remains in Git history.

## External completion evidence

- Public repository: `TYD-Bruce/numerical-t-lab`, repository ID `1238865740`,
  public, default branch `main`.
- Private deployment repository:
  `TYD-Bruce/numerical-t-lab-deploy`, repository ID `1248336378`, private,
  default branch `main`.
- Repository IDs, visibility, issues/wiki state, Actions state, and observed
  branch-protection/rules state were unchanged by the renames.
- Vercel project: `numerical-t-lab`, Project ID
  `prj_IhfXZrgmIFA0UiI9GGItlbSXf5SX`, connected to
  `TYD-Bruce/numerical-t-lab-deploy` with Production branch `main`.
- Framework, build/output/root settings, Node version, deployment protection,
  existing deployments, and the single environment-variable name/scope record
  were preserved; no value was displayed or changed.
- Preview deployment `dpl_9eRKmCZahUxEa34X9H2rUffCZzEr` verified exact
  commit `ead244ecefb82475414c73e15293184d99e1b78a`.
- Production deployment `dpl_GwW9hjgJgX86MEB6Co4Eqrxg8utp` verified the
  same exact commit on `https://numerical-t-lab.vercel.app/`.
- The former address `https://numerical-ode-lab-wai.vercel.app/` was observed
  serving the same current Production deployment as an alias without changing
  the browser URL. It was not removed.
- Routes, direct nested refresh, Not Found, titles, Home identity, pillars,
  descriptor, learner workflow, App Shell, desktop and 390 × 844 mobile
  layouts, Tutor containment and demo response, lazy chunks, malformed API
  JSON, representative asset content types, and clean browser consoles passed.
- Full evidence is in
  [the Numerical T-Lab rename review](../reviews/2026-07-22-numerical-t-lab-rename-review.md).

## Rollback points

- Revert the Numerical T-Lab identity commit with a new commit if audit fails.
- Rename the exact GitHub repositories back and restore their prior remote
  URLs if an external identity rollback becomes necessary.
- The existing Vercel Project ID and prior Production deployment
  `dpl_5whGfYjd9FH9i79UG1hyaDUGZj6E` remain available as rollback evidence.
- Do not retire the old address until observed transition behavior is
  documented and reviewed.
- Rename the local directory back after closing applications if reopening
  fails.
- Never reset, amend, rewrite history, or depend on an unverified redirect.

## Exact next gate

Create and review the repository-grounded Content-Agnostic Interactive
Glossary Framework implementation plan. The design is approved and committed;
implementation has not started and must not begin until the plan is approved.

Former repository names, URLs, and directory names elsewhere in this handoff
are intentional point-in-time migration evidence, not current canonical state.
