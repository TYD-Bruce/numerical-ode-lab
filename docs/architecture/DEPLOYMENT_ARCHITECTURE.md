# Architecture v1 Deployment Architecture

Status: **Local structure verified; no deployment performed by this migration**

## Browser application

`frontend/vite.config.ts` is the Vite authority. Its root is `frontend/`, its
public base is `/`, and its production output is the repository-root `dist/`.
The root `npm run build` command runs workspace typechecks and that frontend
build, preserving the existing Vercel output directory.

## Public API

`api/chat.ts` remains at repository root for Vercel function discovery and
continues to own `/api/chat` method handling. It imports the server
implementation through `@numerical-t-lab/backend/chat-handler`. Provider
secrets and environment access remain outside the frontend.

For local development, root `npm run dev:api` launches
`backend/src/dev.ts` without changing the process working directory. Existing
root `.env.local`/`.env` discovery and the Vite `/api` proxy contract are
therefore preserved.

## SPA fallback and assets

`vercel.json` remains the deployment configuration. Vercel filesystem and
function precedence are relied upon so:

- `/api/chat` resolves to the function adapter;
- `/assets/*` and emitted fonts resolve as static files; and
- other paths fall back to `/index.html` for the History API router.

Generated asset references remain root-based and safe on nested route refresh.
Production-exclusion and route-bundle tests protect development-only Glossary
code and lazy feature boundaries.

## Evidence boundary

Architecture v1 performs local tests, typechecks, builds, manifest inspection,
and bounded browser checks only. It does not push, create a Preview, change
Vercel resources, modify the private deployment repository, or supersede the
last accepted Production provenance.
