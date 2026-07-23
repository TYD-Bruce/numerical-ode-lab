# Numerical T-Lab Identity Migration Handoff

## Status

Internal Numerical T-Lab identity preparation is locally verified and ready
for a conservative audit. External migration has not started.

The product is **Numerical T-Lab**.

- Brand pillars: **Theory · Tools · Teaching**
- Descriptor: **An Interactive Numerical Analysis Laboratory**
- Learner workflow: **Understand → Compute → Visualize → Analyze**
- Canonical slug: `numerical-t-lab`

The official public meaning of `T` is Theory, Tools, and Teaching.

## Starting state and divergence

- Branch: local maintainer-owned `main`
- Starting HEAD for this iteration:
  `6da5e4451b18191f75b403b162b31ffcc57c844a`
- Starting worktree: clean
- `origin/main`: five commits behind local `main`
- `vercel/main`: five commits behind local `main`
- Current public remote:
  `https://github.com/TYD-Bruce/numerical-ode-lab.git`
- Current deployment remote:
  `https://github.com/TYD-Bruce/numerical-ode-lab-w_ai.git`
- Current local directory: `D:\numerical-ode-lab`

The starting HEAD contained the earlier generic
`Numerical Analysis Lab`/`numerical-analysis-lab` migration proposal. The
maintainer authorized this new commit to supersede that proposal without
resetting or amending history. The completed identity commit will leave local
`main` six commits ahead of both locally recorded remote tracking branches.
No remote was contacted.

## Current and target identity

| Identity | Current external or starting repository state | Target |
|---|---|---|
| Display name | Numerical Analysis Lab | Numerical T-Lab |
| npm package | `numerical-analysis-lab` | `numerical-t-lab` |
| Public repository | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-t-lab` |
| Private deployment repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-t-lab-deploy` |
| Vercel project | Not locally discoverable | `numerical-t-lab` |
| Production address | Current recorded `numerical-ode-lab-wai.vercel.app` | Preferred `numerical-t-lab.vercel.app`; unverified |
| Local directory | `D:\numerical-ode-lab` | `D:\numerical-t-lab` |

Target repository names, Vercel project name, and preferred domain have not
been checked for availability. The current production address was not
re-verified during this local task.

## Publication safety

- `.env.local` is untracked, present locally, and ignored.
- Its current content and reachable tracked revisions contain only
  placeholders or non-sensitive local/default configuration.
- `.env.example` covers the required configuration.
- No current or historical live credential was detected.
- The five local-only starting commits contain no detected credential, private
  endpoint, private absolute path, private-reference hash, or substantial
  private quotation.
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
- Generated `index.html` uses `Numerical T-Lab`.
- Generated route titles use `Numerical T-Lab`.
- Generated active chunks contain no former product title or old
  coefficient-validation product prefix.
- Source verification confirms the coefficient-validation prefix is
  `[Initial Value Problems Lab]`.
- No browser, remote, deployment, Vercel, domain, or availability check was
  performed.

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

## External checkpoints pending

1. Conservative Cursor audit of the Numerical T-Lab identity commit.
2. Confirm GitHub target-name availability and capture current settings.
3. Rename the public repository and update `origin`.
4. Rename the private deployment repository and update `vercel`.
5. Capture, rename, or safely reconnect the existing Vercel project.
6. Verify a Preview from the exact reviewed commit.
7. Assign `numerical-t-lab.vercel.app` only if availability is observed.
8. Verify production routes, API, assets, titles, layout, chunks, and console.
9. Record observed old-domain behavior without assuming redirects.
10. Create a separate external-completion documentation commit.
11. Rename the local directory and reopen Cursor/Codex last.

Every external action requires new explicit maintainer authorization.

## Rollback points

- Revert the Numerical T-Lab identity commit with a new commit if audit fails.
- Rename an exact GitHub repository back and restore its prior remote URL if
  needed.
- Keep the old Vercel project identity, settings, address, and last known-good
  deployment until the new deployment passes.
- Do not retire the old address until observed transition behavior is
  documented and reviewed.
- Rename the local directory back after closing applications if reopening
  fails.
- Never reset, amend, rewrite history, or depend on an unverified redirect.

## Exact next gate

Run a conservative Cursor audit of the committed Numerical T-Lab identity
migration. Stop after the audit; do not contact remotes, change external
platforms, rename the local directory, or begin Glossary implementation.
