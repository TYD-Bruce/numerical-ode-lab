# Numerical T Lab

Numerical T Lab is an interactive, AI-assisted laboratory for learning numerical analysis through theory, computation, visualization, error analysis, and guided experiments.

**Theory · Tools · Teaching**

**An Interactive Numerical Analysis Laboratory**

The implemented module is the **Initial Value Problems Lab**, a browser-based teaching environment for scalar fixed-step ODE methods. It preserves the established **Method -> Data -> Output** workflow, numerical plots and tables, method comparison, exact-solution checks, Convergence Study, an interactive numerical Glossary, and a grounded AI Method Tutor.

## Live Demo

[**Open Numerical T Lab →**](https://numerical-t-lab.vercel.app/)

The canonical Production URL is `https://numerical-t-lab.vercel.app/`.

## Routes and module status

| Route | Page | Status |
|---|---|---|
| `/` | Platform Home | Available |
| `/ode` | Numerical ODE overview | Available |
| `/ode/initial-value-problems` | Initial Value Problems Lab | Available |
| `/linear-algebra` | Numerical Linear Algebra roadmap | In development |
| `/pde` | Numerical PDE roadmap | Planned |
| `/about` | Platform and project overview | Available |

Unknown page paths render the in-shell Not Found page. Linear Algebra and PDE are roadmap pages only; they do not contain runnable Labs.

## Initial Value Problems Lab

The first visit starts with an Exponential Decay example configured for Forward Euler:

- `t0 = 0`, `y0 = 1`, `tEnd = 5`, and `h = 0.2`;
- right-hand side `-y`;
- exact solution enabled with `e^(-t)`.

Implemented methods are Forward Euler, Backward Euler, Taylor Method (Order 2), Runge-Kutta 4, Adams-Bashforth and Adams-Moulton of orders 1-8, BDF of orders 1-6, and scalar second-order Leap-Frog.

The mathematical editor supports the controlled Version 1 expression language: arithmetic, powers, implicit multiplication, fractions, square roots, exponential and trigonometric functions, natural logarithm, absolute value, `e`, and `pi`. User mathematics is converted to the project-owned `MathAst` and evaluated through explicit numeric operations; arbitrary JavaScript is rejected.

Convergence Study is available after a successful single-method first-order run with an exact solution. Compare and Leap-Frog do not offer Convergence Study, and Tutor is available for successful single-method output rather than Compare output.

The interface defaults to a lower-glare Light theme and offers an optional,
persisted Dark theme from the global header. Existing charts redraw with
theme-aware colors without rerunning a solver. Ten reviewed Glossary Wave 1
cards and ten explicit annotations are available only in the complete Initial
Value Problems Lab, with desktop popovers and a contained mobile sheet. The
`/ode` overview and all other routes remain unannotated, Compare output remains
Glossary-plain, and no Glossary-to-Tutor handoff exists.

## Sessions, Resume, and New experiment

Lab and Tutor sessions are held **in memory for the current tab only**. Internal navigation preserves the current Lab, Tutor conversation, meaningful-work metadata, Resume card, and approved scroll positions.

Experiment and Tutor sessions are not written to browser storage or an account.
Refreshing, closing the tab, or closing the browser loses the session. Resume
cards are current-tab navigation aids, not saved history. The only persistent
browser preference is the selected Light or Dark theme.

**New experiment** restores the authoritative Beginner Starter. It can clear the Tutor conversation or preserve it behind a typed divider, and it resets visible, per-Lab, and current-history-entry scroll state so the old experiment position cannot return.

## Local development

Requires a current Node.js LTS release.

```bash
git clone https://github.com/TYD-Bruce/numerical-t-lab.git
cd numerical-t-lab
```

After cloning:

```bash
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173/`.

Start the local Tutor API in a second terminal:

```bash
npm run dev:api
```

Set `AI_TUTOR_MOCK=true` in `.env.local` for deterministic grounded demo replies that require no live model. For live tutoring, set a server-side `OPENAI_API_KEY`. Never give the key a `VITE_` prefix because Vite exposes such variables to browser code. The browser always calls the relative-origin endpoint `/api/chat`.

## Build, preview, and verification

```bash
npm run test:run
npm run typecheck
npm run typecheck:api
npm run build
npm run verify
npm run preview
```

`npm run verify` runs the full Vitest suite, both TypeScript checks, and the production build.

The production Vite base is `/`, so generated entry, stylesheet, font, and nested-route asset references use the root origin. `vercel.json` supplies an SPA rewrite to `/index.html`; Vercel filesystem and function routes remain responsible for emitted `/assets/*` files and `/api/chat` before the client fallback. After deployment, smoke-test a direct refresh at `/ode/initial-value-problems`, `/api/chat`, one JavaScript asset, one CSS asset, one font, and an unknown client route.

## Architecture

The public entry contains the project-owned router, static pages, in-memory store, shared Tutor Host placement, semantic theme tokens, and lifecycle services. The complete ODE Lab is dynamically imported only for `/ode/initial-value-problems`. The complete Tutor panel and networking load on first Tutor open. MathLive and editable/Compute Engine support remain later deferred boundaries.

Expression ownership is:

```text
MathLive field
  -> Compute Engine raw MathJSON adapter
  -> project-owned closed MathAst
  -> profile validation and versioned serialization
  -> explicit numeric evaluator
  -> solver function parameters
```

Tutor ownership is:

```text
Lab -> LabTutorBinding -> Platform Tutor Host
AppSessionStore -> TutorSessionAccess -> Platform Tutor Host
```

Key locations:

- `frontend/src/`: browser application, pages, Labs, Tutor, Glossary, and math UI.
- `backend/src/`: server-only Tutor handler and local API process.
- `packages/numerics/src/`: ODE, Convergence, expression, Linear Systems, and Computation Trace authority.
- `packages/contracts/src/`: shared serializable browser/server DTOs.
- `api/chat.ts`: thin Vercel `/api/chat` adapter.
- `docs/architecture/`: current ownership, dependency, and deployment maps.
- `docs/PROJECT_HANDOFF.md`: current contributor handoff.
- `docs/contracts/NUMERICAL_CONTRACTS.md`: numerical correctness boundaries.

## Current limitations

- Sessions are memory-only and do not survive refresh or tab closure.
- ODE support is scalar and fixed-step; there are no systems or adaptive solvers.
- Tutor and Convergence Study are not available for Compare output.
- Convergence Study is single-method, first-order, exact-solution-based, and synchronous.
- MathLive and editable/Compute Engine chunks are intentionally deferred but substantial.
- Numerical Linear Algebra is in development; Numerical PDE is planned.
- Theme selection supports Light and Dark only; there is no system/automatic third mode.

The **Content-Agnostic Interactive Glossary Framework** and reviewed ODE Wave 1
integration are implemented. Runtime annotations remain explicit and
scope-owned; the development Playground remains excluded from production.
**Numerical T Lab Project Language Standard v1** is approved. A **Linear
Systems Lab** remains a later milestone.

## Project documentation

See [`docs/INDEX.md`](docs/INDEX.md) for the current architecture, active plan,
design specifications, implementation plans, reviews, and feature handoffs.

## Changelog

### 2026-08-01 — Frontend refinement

- Audited the lower-glare Light theme, restored Dark theme, theme-aware charts,
  initial-focus correction, workflow hierarchy, and transcript-led Tutor layout.
- Finalized the learner-facing display brand as **Numerical T Lab** and retained
  the accepted solid crescent theme-toggle icon.
- Full verification and Preview/Production browser review passed; canonical
  Production serves the synchronized refinement.

### 2026-07-28 — Glossary framework Playground completed locally

- Completed the existing DEV-only Glossary Playground with the content-neutral
  scope, dynamic-context, replacement, formula, composition, placement,
  mobile/modal, mock Tutor, strict-diagnostic, event, and reset matrix.
- Added the development-only About entry and Ctrl/Cmd+Shift+G shortcut through
  one dynamically loaded controls boundary with explicit cleanup.
- Passed focused and full verification, isolated localhost desktop/mobile
  review, and production route/graph/manifest/chunk/marker exclusion checks.
- Production remains unchanged: there are no production Glossary terms,
  annotations, Playground route, Developer Tools entry, shortcut, or visible
  Glossary behavior. Nothing was pushed or deployed.
- Detailed status: [`docs/glossary/HANDOFF.md`](docs/glossary/HANDOFF.md)

### 2026-07-23 — Numerical T-Lab Project Identity Migration completed

- Renamed the public and private deployment repositories while preserving
  their identities and visibility.
- Renamed the existing Vercel project in place, preserved its Project ID and
  settings, and verified Preview and Production deployments.
- Verified `numerical-t-lab.vercel.app` as the canonical Production address;
  retained the former address as a working alias.
- Renamed the local workspace to `D:\numerical-t-lab`, reopened Cursor/Codex
  from the canonical path, and confirmed valid Git state on `main` with the
  canonical remotes.
- Project Identity Migration is complete; repository-grounded
  Content-Agnostic Interactive Glossary Framework implementation planning is
  the next gate.

### 2026-07-22 — Numerical T-Lab identity migration prepared

- Adopted **Numerical T-Lab**, **Theory · Tools · Teaching**, and
  **An Interactive Numerical Analysis Laboratory** across active product
  surfaces.
- Prepared the `numerical-t-lab` package, repository, and deployment targets
  without renaming or contacting external services.
- Preserved the Numerical ODE routes, Initial Value Problems Lab identity,
  numerical behavior, and historical release evidence.
- External repository, Vercel, domain, remote, and local-directory changes
  remain pending review and explicit authorization.

### 2026-07-22 — Interactive Glossary framework design started

- Documented the approved Content-Agnostic Interactive Glossary Framework
  design.
- No canonical numerical notation or production Glossary terms have been
  released.
- Formal content will be reviewed from private course materials before ODE
  rollout.
- Detailed status: [`docs/glossary/HANDOFF.md`](docs/glossary/HANDOFF.md)

### 2026-07-22 — Codex project guidance added

- Added repository-level agent instructions and a current active-plan
  dashboard.
- Added durable product goals, implemented architecture documentation, and a
  documentation index.
- Added a local override pattern for private development context.
- No numerical or runtime behavior changed.

### 2026-07-22 — Numerical notation research started

- Began Milestone 2A-1 evidence collection for a future canonical numerical
  notation standard and Interactive Term Glossary.
- Added a private course-note handling boundary and public-source evidence
  workflow.
- Added a living evidence inventory and research handoff.
- Research is in progress; no canonical notation or runtime Glossary content
  has been released.
- Detailed status: [`docs/research/HANDOFF.md`](docs/research/HANDOFF.md)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
