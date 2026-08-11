# Numerical T Lab Architecture v1 Migration Review

Date: 2026-08-11

Verdict: **ARCHITECTURE V1 LOCALLY MIGRATION-COMPLETE — READY FOR MAINTAINER ACCEPTANCE**

## Scope and baseline

This review covers the behavior-preserving full-stack/workspace migration from
`main` commit `6ab8a88ab760529505672d007f86c0351ef92d55`, tree
`afa3945c51131e31a2f4ac9a77d3c6c8c661e8d0`.

The accepted product, mathematical, route, Tutor, Glossary, session,
accessibility, lazy-loading, and deployment contracts were regression
boundaries. Linear Systems route/UI, computation rendering, Tutor integration,
and PDE work were explicitly excluded.

## Reviewed migration commits

| Commit | Boundary |
|---|---|
| `360354f794d028f066f025be7f8aec1ee09ca591` | Test-only pivot-tie trace ordering evidence |
| `11f1153530c326a6cbca45703b73c036169b7ba2` | npm workspace and TypeScript foundation |
| `fc7f962edc64cb296c873cd7c16427d31ada72c7` | pure numerical-domain extraction |
| `7a959ffe1b0aefb526bd15048e43533652366401` | frontend application ownership |
| `5bcc8cf6064cfc4d0ec8a34e219520dfbb276268` | backend, Vercel adapter, and shared contracts |
| `4b3baee5756dc1987a4b7d4a8dacffafa6f2363a` | boundary tooling and current architecture docs |

## Architecture findings

- `frontend/`, `backend/`, `packages/numerics/`, and `packages/contracts/`
  have explicit runtime ownership.
- Root `api/chat.ts` remains the public `/api/chat` Vercel entry and delegates
  through the backend package surface.
- Numerics and contracts compile without DOM libraries. The repository-owned
  import checker reports no forbidden reverse edge across four owners plus the
  adapter.
- Numerical consumers use deliberate package subpaths; there is no eager root
  barrel that pulls unrelated domains into Home/static graphs.
- Editable/session/workflow state remains frontend-owned even where it is pure
  TypeScript. Mathematical algorithms, immutable presets, and computation
  evidence remain numerical-domain ownership.
- Server prompt, mock/provider behavior, environment access, and errors remain
  backend-only. Cross-boundary contracts contain serializable DTOs only.

## Numerical equivalence

The source migration used file moves and import corrections. It did not change
ODE formulas, method coefficients, grids, nonlinear behavior, exact-solution
checks, Convergence classifications, Linear Systems GEPP/PLU behavior,
`tauPivot`, residual orientation, fingerprints, immutable session publication,
or Computation Trace semantics.

The pre-migration T1 carry-forward was closed with assertions only: equal-
magnitude pivot candidates remain in consideration order (row 0 then row 1),
both magnitudes are 2, row 0 remains selected, and acceptance remains true.

The former Vite-specific coefficient diagnostic was relocated to the ODE
frontend module boundary. It still runs on ODE-module load in DEV, while the
solver package is independently typecheckable without Vite/DOM. Numerical
output is unchanged.

## Automated verification

All commands ran from repository root:

- `npm.cmd run test:run`: **82 files / 1,168 tests passed**;
- `npm.cmd run typecheck`: frontend, numerics, and contracts passed;
- `npm.cmd run typecheck:api`: backend plus root API adapter passed;
- `npm.cmd run build`: passed with Vite 5.4.21, **87 modules transformed**;
- `npm.cmd run verify:boundaries`: passed for four owners plus the Vercel
  adapter; and
- `git diff --check`: passed.

Focused coverage included Linear Systems/trace, ODE solvers and lifecycle,
Convergence, Tutor, Glossary, Store/Resume/history, route-bundle ownership,
Vite base, DEV exclusion, Vercel routing, backend prompt/handler, and the new
root API adapter tests. The adapter tests directly preserve the `405` plus
`Allow: POST` contract and exact handler status/body forwarding.

The final root `npm.cmd run verify` passed and repeated boundary checks, the
full suite, all typechecks, and the build on this review state.

## Build and bundle evidence

An external-output Vite build with manifest enabled recorded:

- entry: `assets/index-D_Vw6UzX.js`, 54.87 kB raw / 17.14 kB gzip;
- entry dynamic imports: Initial Value Problems route, Tutor panel, and
  Glossary surface;
- ODE route: 293.60 kB / 94.04 kB gzip;
- Tutor: 12.14 kB / 4.62 kB gzip;
- Glossary surface: 10.13 kB / 3.50 kB gzip;
- shared Convergence state: 58.11 kB / 17.24 kB gzip;
- MathLive: 819.11 kB / 228.04 kB gzip; and
- editable/Compute Engine: 1,143.84 kB / 308.81 kB gzip.

The entry contains no eager numerical package import. MathLive/Compute Engine
remain interaction-deferred. Production assets contain no DEV Glossary
Playground markers and no private-reference path/content markers. The existing
greater-than-500-kB warning remains accepted; no `manualChunks` or dependency
change was introduced merely to silence it.

## Local browser verification

Browser verification used the supported root `npm run dev` and `npm run
dev:api` commands with deterministic server mock mode. No remote service was
contacted.

- `/`, `/about`, `/ode`, `/ode/initial-value-problems`, `/linear-algebra`,
  `/pde`, and an unknown route loaded with the expected title/content.
- Internal Home-to-ODE navigation worked; Light/Dark switching worked.
- The Exponential Decay + Forward Euler starter ran and produced the expected
  26-point Output ending at `t = 5` with `u = 0.00377789`.
- A three-level Convergence Study ran, produced a table and chart, passed its
  numerical consistency check, and reported primary observed order `1.031`.
- The Tutor lazy-loaded and returned a grounded Demo-mode graph explanation
  through the local `/api/chat` proxy.
- The ODE Glossary lazy-loaded an accepted definition on desktop and as a
  contained mobile `aria-modal` sheet.
- At `390 x 844`, document content width was 375px within the 390px viewport;
  the Tutor sheet measured 351px and the Glossary sheet 375px.
- No browser page errors or Vite error overlay appeared. Console output was
  limited to Vite connection diagnostics and the existing DEV coefficient/
  Forward Euler sanity messages.

## Problems and reusable resolutions

1. Workspace commands can change `process.cwd()`. Keep root `dev:api`
   launching `backend/src/dev.ts` directly when root environment-file lookup is
   contractual.
2. Vercel discovery depends on the physical root `api/` edge. Keep that file
   thin and test method handling plus transparent status/body forwarding.
3. Browser-independent mathematics must not inherit Vite ambient ownership for
   a DEV diagnostic. Place the diagnostic at the frontend module boundary.
4. Source-inspection tests are path-sensitive architecture tests. Update their
   resolver roots and workspace-package awareness; do not merely weaken marker
   assertions after moves.
5. Avoid package root barrels where they would collapse lazy boundaries or
   evaluate unrelated numerical domains.
6. Pure workflow state is still product/frontend state. Classify by authority
   and lifecycle, not by whether a module happens to use the DOM.

## Non-actions and next gate

No feature was added. No numerical contract changed. No dependency was
upgraded. No private material was copied. Nothing was pushed or deployed, and
the private deployment repository was not modified.

The next gate is maintainer acceptance of Architecture v1. The next
implementation task is Linear Systems Day 2 route/UI integration and a
presentation-only computation renderer on these boundaries. Tutor integration
remains a later separately gated phase.
