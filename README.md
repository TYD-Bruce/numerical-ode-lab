# Numerical Analysis Lab

Numerical Analysis Lab is an interactive, AI-assisted platform for learning numerical analysis through computation, visualization, error analysis, and guided experiments.

The implemented module is the **Initial Value Problems Lab**, a browser-based teaching environment for scalar fixed-step ODE methods. It preserves the established **Method -> Data -> Output** workflow, numerical plots and tables, method comparison, exact-solution checks, Convergence Study, and grounded AI Method Tutor.

**Deployment target:** [numerical-ode-lab-wai.vercel.app](https://numerical-ode-lab-wai.vercel.app/) — verify the reviewed Platform Shell commits in a Vercel preview before production promotion.

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

## Sessions, Resume, and New experiment

Lab and Tutor sessions are held **in memory for the current tab only**. Internal navigation preserves the current Lab, Tutor conversation, meaningful-work metadata, Resume card, and approved scroll positions.

There is no browser storage or account persistence. Refreshing, closing the tab, or closing the browser loses the session. Resume cards are current-tab navigation aids, not saved history.

**New experiment** restores the authoritative Beginner Starter. It can clear the Tutor conversation or preserve it behind a typed divider, and it resets visible, per-Lab, and current-history-entry scroll state so the old experiment position cannot return.

## Local development

Requires a current Node.js LTS release.

```bash
git clone https://github.com/TYD-Bruce/numerical-ode-lab.git
cd numerical-ode-lab
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

- `src/app/`: router, shell, store, Tutor Host, scroll/history lifecycle, theme tokens, and platform bootstrap.
- `src/pages/`: Home, overview, About, and Not Found route modules.
- `src/ode/`: pure ODE session, mountable Lab, route adapter, Beginner Starter, Tutor binding, and New experiment behavior.
- `src/tutor/`: pure Tutor session operations, lazy panel, and API client.
- `src/math/`: AST, validation, serialization, evaluator, adapters, and deferred mathematical UI.
- `src/solvers.ts`: numerical integration APIs and algorithms.
- `docs/PROJECT_HANDOFF.md`: current contributor handoff.
- `docs/NUMERICAL_CONTRACTS.md`: numerical correctness boundaries.

## Current limitations

- Sessions are memory-only and do not survive refresh or tab closure.
- ODE support is scalar and fixed-step; there are no systems or adaptive solvers.
- Tutor and Convergence Study are not available for Compare output.
- Convergence Study is single-method, first-order, exact-solution-based, and synchronous.
- MathLive and editable/Compute Engine chunks are intentionally deferred but substantial.
- Numerical Linear Algebra is in development; Numerical PDE is planned.
- The final semantic theme is not a theme switch or final fantasy brand treatment.

The next milestone is **Interactive Term Glossary**. A **Linear Systems Lab** is a later milestone.

## Changelog

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
