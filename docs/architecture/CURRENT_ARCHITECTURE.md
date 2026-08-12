# Numerical T Lab Architecture v1

Status: **Implemented locally and behavior-preserving**

Numerical T Lab is an npm-workspace repository with four explicit runtime
owners and one deployment adapter:

```text
frontend/                 browser application and teaching presentation
backend/                  server-only Tutor handler and local API process
packages/numerics/        pure mathematical and numerical authority
packages/contracts/       serializable cross-boundary Tutor DTOs
api/chat.ts               thin Vercel function adapter
```

The migration changed physical ownership, imports, and tooling. Subsequent
Linear Systems product integration uses those frozen boundaries without
moving packages or changing numerical, Tutor, Glossary, or deployment
authority.

## Workspace ownership

### Frontend

`frontend/src/main.ts` bootstraps the project-owned History API application.
Browser ownership is organized as:

- `frontend/src/app/`: shell, router, route registry, in-memory Store, Tutor
  and Glossary Hosts, modal/focus ownership, theme, scroll, and lifecycle;
- `frontend/src/pages/`: Home, About, module overviews, and Not Found;
- `frontend/src/labs/ode/`: the mountable Initial Value Problems Lab, ODE
  workflow/session state, Convergence presentation, presets, and bindings;
- `frontend/src/labs/linear-algebra/`: the pure editable session, complete
  Linear Systems route, Method/Data/Output/Diagnostics application, visible
  teaching model, domain-specific MathML composition helpers, and
  presentation-only Computation Walkthrough renderer;
- `frontend/src/tutor/`: browser Tutor session, panel, and `/api/chat` client;
- `frontend/src/glossary/`: production Glossary model, registry, controller,
  and lazy surface;
- `frontend/src/math/`: MathLive/Compute Engine browser adapters, lightweight
  native-MathML authored-math primitives, and safe math presentation; and
- `frontend/src/dev/`: development-only Glossary tooling.

`frontend/vite.config.ts` uses the frontend directory as Vite root and emits
to the repository-root `dist/`. Public base remains `/`.

### Numerical domain

`packages/numerics` is DOM-free and exposes deliberate subpaths rather than an
eager root barrel:

- `src/ode/`: fixed-grid solvers, method catalog, polynomial and nonlinear
  helpers, and exact-solution validation;
- `src/convergence/`: numerical Convergence Study calculations;
- `src/expressions/`: closed AST, canonicalization, validation, projection,
  serialization, and explicit evaluator;
- `src/linear-algebra/`: approved Linear Systems GEPP/PLU authority and
  immutable presets; and
- `src/trace/`: generic immutable Computation Trace authority.

The frontend-owned Linear Systems session is intentionally not in numerics:
it owns editable drafts, preset/Custom workflow, current/stale output, and
meaningful-work metadata rather than mathematical authority.

### Backend and API

`backend/src/ai/chatHandler.ts` owns validation, deterministic mock behavior,
the ODE Tutor system prompt, provider invocation, and server-only environment
access. `backend/src/dev.ts` is the local HTTP entry and is launched by the
root `dev:api` script so `.env.local` and `.env` resolution remains rooted at
the repository.

Root `api/chat.ts` remains the public `/api/chat` Vercel entry. It enforces the
POST-only adapter contract, delegates to
`@numerical-t-lab/backend/chat-handler`, and forwards handler status/body
without interpretation.

### Shared contracts

`packages/contracts/src/tutor.ts` contains only serializable DTOs that cross
the browser/server boundary. Frontend-only editable ODE problem inputs remain
under `frontend/src/labs/ode/odeTutorTypes.ts`; numerical result types remain
in the numerical package.

## Runtime dependency flow

```text
api/chat.ts -> backend -> packages/contracts

frontend -> packages/contracts
frontend -> packages/numerics

packages/numerics -> platform libraries only
packages/contracts -> platform libraries only
```

Forbidden reverse edges are documented in
[Dependency Rules](./DEPENDENCY_RULES.md) and checked by
`npm run verify:boundaries`.

## Route and lazy-load flow

```text
frontend entry
  -> shell, router, store, and static pages
  -> dynamic Initial Value Problems route
  -> ODE UI, numerical package subpaths, Chart.js, and Convergence
  -> first-open Tutor panel
  -> interaction-deferred MathLive and Compute Engine

frontend entry
  -> dynamic Linear Systems route
  -> frontend session and static Teaching v2 matrix/workflow presentation
  -> lightweight native MathML atoms plus controlled DOM/CSS composition
  -> Linear Systems numerical package and immutable computation trace

first valid Glossary request
  -> dynamic Glossary surface

development only
  -> dynamic Glossary controls and Playground
```

Public routes are `/`, `/about`, `/ode`, `/ode/initial-value-problems`,
`/linear-algebra`, `/linear-algebra/linear-systems`, and `/pde`; unknown routes
render the in-shell Not Found page. Both complete Labs have independent dynamic
route boundaries. The Linear Systems route intentionally exposes neither a
Tutor binding nor a Glossary binding at this gate.

The route module registry, Tutor Host, Glossary Host, and editable-math loader
retain distinct dynamic imports. Package extraction does not create an eager
numerics root import.

The Linear Systems walkthrough consumes producer-owned `initialU`, complete
`uBefore`/`uAfter`, `permutedB`, substitution, residual, and reference evidence
without rerunning elimination or reconstructing numerical states. Its current
Phase 2 presentation is intentionally static. The existing motion controller
remains source-owned by the mounted frontend presentation but is not imported
or mounted by the Linear Systems route pending the separate motion-remount
gate.

## State and lifecycle

`AppSessionStore` contains deeply frozen pure data only: Lab sessions, module
Tutor sessions, meaningful-work/Resume metadata, and numeric scroll metadata.
DOM nodes, Charts, MathLive handles, listeners, abort objects, closures, and
mounted instances remain route-owned runtime state.

Complete-Lab disposal closes/disconnects platform surfaces, captures pure
session and scroll state, invalidates stale work, disposes Lab-owned runtime
handles, and clears route DOM. Session data remains memory-only.

Linear Systems reuses this generic lifecycle. Its Store state contains only
the deeply frozen frontend session and the immutable numerical result/trace
reference. Resume metadata contains workflow, method, and current/stale labels
but no matrix, right-hand side, solution, residual, or trace arithmetic.

## Numerical and expression invariants

The move preserves the formulas, evaluation order, tolerances, classifications,
factor conventions, trace emission, residual orientation, and immutable result
semantics recorded in
[Numerical Contracts](../contracts/NUMERICAL_CONTRACTS.md).

The expression authority flow remains:

```text
MathLive draft
  -> Compute Engine adapter
  -> project-owned validated MathAst
  -> explicit finite evaluator
  -> numerical solver callback
```

No production `eval`, `new Function`, arbitrary JavaScript, raw user LaTeX, or
Tutor output becomes numerical authority.

## Deployment

Vite continues to emit root-base static assets to `dist/`; `vercel.json`
continues to preserve functions/assets ahead of the SPA fallback. See
[Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md).

## Contributor entry points

- Operating contract: [AGENTS.md](../../AGENTS.md)
- Current plan: [PLAN.md](../../PLAN.md)
- Dependency rules: [DEPENDENCY_RULES.md](./DEPENDENCY_RULES.md)
- Numerical contracts: [NUMERICAL_CONTRACTS.md](../contracts/NUMERICAL_CONTRACTS.md)
- Project handoff: [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md)

Update this document only when implemented ownership changes. Planned designs
do not change the current architecture map.
