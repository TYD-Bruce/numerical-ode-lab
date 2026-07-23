# Numerical T-Lab External Rename Review

**Review date:** 2026-07-23

**Verdict:** External migration verified. The GitHub repositories, local
remotes, existing Vercel project, Git integration, Preview deployment,
Production deployment, and canonical Production domain use the Numerical
T-Lab identity. The local workspace-directory rename remains pending.

## Reviewed commit

The exact application commit reviewed in Preview and Production was:

`ead244ecefb82475414c73e15293184d99e1b78a`

It contains the approved identity commit
`e6c4ca5213fdfc572a6156999ba9e5323d59b0f1` and the separately authorized
conservative Cursor-audit documentation fixes. The worktree was clean before
external actions.

## GitHub evidence

| Repository | Before | After | Repository ID | Visibility | Default branch |
|---|---|---|---:|---|---|
| Public | `TYD-Bruce/numerical-ode-lab` | `TYD-Bruce/numerical-t-lab` | `1238865740` | Public, unchanged | `main`, unchanged |
| Deployment | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-t-lab-deploy` | `1248336378` | Private, unchanged | `main`, unchanged |

Issues/wiki state, Actions state, and the observed branch-protection/rules
state remained unchanged. Neither old repository name was recreated. The
captured public description and deployment-repository homepage were not
modified by this task.

Canonical local remotes:

```text
origin  https://github.com/TYD-Bruce/numerical-t-lab.git
vercel  https://github.com/TYD-Bruce/numerical-t-lab-deploy.git
```

Direct remote-head checks confirmed both remote `main` branches at the exact
reviewed commit before completion documentation.

## Vercel evidence

| Field | Before | After |
|---|---|---|
| Project name | `numerical-ode-lab-w_ai` | `numerical-t-lab` |
| Project ID | `prj_IhfXZrgmIFA0UiI9GGItlbSXf5SX` | Preserved unchanged |
| Connected repository | `TYD-Bruce/numerical-ode-lab-w_ai` | `TYD-Bruce/numerical-t-lab-deploy` |
| Production branch | `main` | `main`, unchanged |
| Framework | Vite | Vite, unchanged |
| Node version | 24.x | 24.x, unchanged |

The existing project was renamed in place; no replacement project was
created. Build command, output directory, root directory, framework, deployment
protection, existing deployments, and rollback target were preserved. The
single project environment-variable name/scope record remained present for all
environments. No environment value was printed, copied, deleted, or changed.

Rollback Production deployment:
`dpl_5whGfYjd9FH9i79UG1hyaDUGZj6E`.

## Preview evidence

- Deployment ID: `dpl_9eRKmCZahUxEa34X9H2rUffCZzEr`
- Deployment URL:
  `https://numerical-t-irmqjzifo-bruce-tian.vercel.app/`
- Git branch: `preview/numerical-t-lab-rename`
- Exact commit: `ead244ecefb82475414c73e15293184d99e1b78a`
- State: READY

The protected Preview was checked through authenticated browser access. It
passed `/`, `/ode`, `/ode/initial-value-problems`, `/linear-algebra`, `/pde`,
`/about`, an unknown route, and direct nested refresh. Titles, Home identity
hierarchy, `Theory · Tools · Teaching`, the descriptor, learner workflow, App
Shell identity, About pillars, desktop layout, and approximately 390 × 844
mobile layout passed. The mobile Tutor was modal, contained inside the
viewport, inerted the background, locked underlying scroll, and introduced no
horizontal overflow.

A successful starter run and a grounded Demo-mode Tutor response proved the
Preview API path reached the function rather than the SPA shell. Protection
prevented a separate unauthenticated raw malformed request; the same exact
commit's deployment contract tests and direct Production raw sample below
confirmed malformed `/api/chat` returns JSON rather than `index.html`.

Observed lazy-load order was entry/platform assets on Home, ODE route and
shared convergence assets on Lab navigation, Tutor assets on first Tutor open,
and editable-math/MathLive assets on Data entry. Browser consoles were clean.

## Production evidence

- Deployment ID: `dpl_GwW9hjgJgX86MEB6Co4Eqrxg8utp`
- Deployment URL:
  `https://numerical-t-7jrvh7pwh-bruce-tian.vercel.app/`
- Exact commit: `ead244ecefb82475414c73e15293184d99e1b78a`
- State: READY / Production
- Canonical domain:
  `https://numerical-t-lab.vercel.app/`

Production passed the same route, direct-refresh, title, identity, About,
desktop, 390 × 844 mobile, starter-run, Tutor, containment, lazy-chunk, and
console matrix. The About page publicly defines `T` only as Theory, Tools, and
Teaching; it does not present the project as named after the maintainer.

Direct raw Production sampling returned:

- malformed `POST /api/chat`: HTTP 400,
  `application/json; charset=utf-8`, with a controlled error object rather than
  `index.html`;
- entry JavaScript: HTTP 200, `application/javascript; charset=utf-8`;
- platform CSS: HTTP 200, `text/css; charset=utf-8`;
- representative WOFF2 font: HTTP 200, `font/woff2`.

No desktop, mobile, or retained-domain browser warning/error was observed.

## Domain transition

Vercel directly accepted and reported valid configuration for
`numerical-t-lab.vercel.app`. The former
`numerical-ode-lab-wai.vercel.app` domain remains assigned. Direct observation
showed that the old address kept its URL and served the same current Numerical
T-Lab Production deployment, so its observed behavior is an alias, not a
redirect. It was not removed.

## Rollback and remaining gate

- Both exact repositories can be renamed back only after rechecking the old
  names and captured settings.
- The canonical remote URLs can be restored to the captured legacy URLs if a
  repository rollback is authorized.
- The preserved Vercel Project ID, settings, old domain, existing deployments,
  and last known-good rollback deployment remain available.
- The temporary Preview branch must be deleted only after the completion
  documentation commit is published and the final Production smoke test
  passes.
- The local directory still uses the legacy basename. Close all old-path
  terminals, editors, servers, and agents before renaming it and reopening
  Cursor/Codex.

No repository was transferred, deleted, recreated, or made more or less
visible. No history was rewritten. No environment value was exposed. No
numerical, routing, session, Tutor-scope, Glossary, or deployment-architecture
behavior changed.
