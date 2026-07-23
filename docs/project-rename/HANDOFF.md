# Project Identity Migration Handoff

## Status

Commit 1 internal preparation is ready for conservative audit. External
migration has not started.

The product display name remains **Numerical Analysis Lab**. The canonical
slug is `numerical-analysis-lab`.

## Starting state

- Branch: local maintainer-owned `main`
- Starting HEAD: `76730409945d291f8fcbc734a9eb5a18bb4c25ff`
- Starting worktree: clean
- `origin/main`: four commits behind local `main`
- `vercel/main`: four commits behind local `main`
- Current public remote URL:
  `https://github.com/TYD-Bruce/numerical-ode-lab.git`
- Current deployment remote URL:
  `https://github.com/TYD-Bruce/numerical-ode-lab-w_ai.git`
- Local directory: `D:\numerical-ode-lab`

No remote was contacted during preparation.

## Current and target identity

| Identity | Current | Target |
|---|---|---|
| Display name | Numerical Analysis Lab | Numerical Analysis Lab |
| npm package | `numerical-ode-lab` | `numerical-analysis-lab` |
| Public repository | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-analysis-lab` |
| Private deployment repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-analysis-lab-deploy` |
| Vercel project | Not locally discoverable | `numerical-analysis-lab` |
| Production address | Current recorded `numerical-ode-lab-wai.vercel.app` | Preferred `numerical-analysis-lab.vercel.app`; unverified |
| Local directory | `D:\numerical-ode-lab` | `D:\numerical-analysis-lab` |

Target repository names, Vercel project name, and preferred domain have not
been checked for availability.

## Publication safety

- `.env.local` was tracked at the start.
- Its current content and reachable revisions contain only non-sensitive
  local/default configuration.
- `.env.example` covers the required configuration.
- No current or historical live credential was detected in `.env.local`.
- The four unpushed commits contain no detected live credential, private
  absolute path or endpoint, private-reference hash, or substantial private
  quotation.
- Ignored private reference contents were not inspected.
- `.env.local` is removed from tracking while its ignored local copy is
  preserved.

No secret value is recorded in this handoff.

## Commit 1 scope

Internal preparation changes:

- npm package and root lockfile identity;
- fallback/bootstrap HTML title;
- active Tutor product/module wording only;
- Initial Value Problems Lab development-log prefixes;
- focused identity tests;
- `.vercel/` ignore rule;
- future clone and directory commands;
- honest current-versus-pending deployment wording;
- migration plan, documentation index, and temporary `PLAN.md` gate.

No dependency, numerical, route, session, Store, lifecycle, lazy-loading,
Glossary, Vite, or Vercel configuration change is included.

## Preserved ODE identifiers

- `/ode`
- `/ode/initial-value-problems`
- `src/ode/`
- `OdeSessionState`
- `Initial Value Problems Lab`
- `Numerical ODE`
- `history.state.numericalAnalysisLab`
- `[ode-lab-api]` in `server/dev.ts`

## Historical evidence preservation

Former names and URLs remain where they are point-in-time evidence:

- old verified Preview evidence in the project handoff and final Platform
  Shell review;
- historical feature designs and implementation plans;
- Git history, reflogs, and `FETCH_HEAD`;
- ignored `dist`;
- generated `node_modules/.package-lock.json`.

Do not rewrite those records solely to replace an old identity.

## External checkpoints pending

1. Conservative Cursor audit of Commit 1.
2. Confirm GitHub target-name availability and capture current settings.
3. Rename public repository and update `origin`.
4. Rename private deployment repository and update `vercel`.
5. Inspect, rename, or reconnect the existing Vercel project safely.
6. Verify a reviewed Preview before production.
7. Verify the preferred production domain before claiming it.
8. Record observed old-domain transition behavior.
9. Create Commit 2 with completion evidence.
10. Rename the local directory and reopen Cursor/Codex last.

Every external action requires a new explicit maintainer authorization.

## Rollback points

- Revert Commit 1 with a new commit before external work if audit fails.
- Rename an exact GitHub repository back and restore its remote URL if needed.
- Keep the old Vercel domain, project identity, settings, and deployment until
  the new deployment passes.
- Rename the local directory back after closing applications if reopening
  fails.
- Never reset, amend, rewrite history, or depend on unverified redirects.

## Exact next gate

Run a conservative Cursor audit of Commit 1. Stop after the audit; do not
contact remotes, change external platforms, rename the local directory, or
begin Glossary implementation.
