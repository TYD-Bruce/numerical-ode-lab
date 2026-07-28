# Numerical T-Lab — Project Handoff

This is the durable handoff for future contributors. Use it with the current codebase and the authoritative design and plan; do not rely on prior chat history.

**Status (2026-07-28):** Numerical T-Lab is locally verified and
Production-verified at `https://numerical-t-lab.vercel.app/`. The GitHub
repositories, Git remotes, existing Vercel project, Git integration, and
canonical domain use the Numerical T-Lab identity. The local workspace rename
and reopen are complete at `D:\numerical-t-lab`; Project Identity Migration is
complete. See
[the rename review](./reviews/2026-07-22-numerical-t-lab-rename-review.md).

## 1. Product and public routes

The product is **Numerical T-Lab**. The currently implemented numerical module is **Initial Value Problems Lab**, retaining the released Method -> Data -> Output ODE workflow.

| Route | Page | Status |
|---|---|---|
| `/` | Platform Home | Available |
| `/ode` | Numerical ODE overview | Available |
| `/ode/initial-value-problems` | Initial Value Problems Lab | Available |
| `/linear-algebra` | Numerical Linear Algebra roadmap | In development |
| `/pde` | Numerical PDE roadmap | Planned |
| `/about` | Platform/project overview | Available |
| any other page path | In-shell Not Found | Available |

Linear Algebra and PDE are truthful roadmap pages with no runnable controls.
The current next milestone is **Content-Agnostic Interactive Glossary
Framework**; **Linear Systems Lab** is later. The
[authoritative Glossary design](./superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
is approved and committed. Commit 1, the content-agnostic Glossary model and
scope lifecycle, is implemented and accepted after conservative audit.
The readonly-math accessibility prerequisite is locally verified. Commit 3
shared Host/surface/modal infrastructure and a minimal DEV-only Playground are
implemented and locally/browser verified but not deployed. Its prior lifecycle
audit findings have locally verified follow-ups and a final conservative
re-audit verdict of SAFE TO PROCEED. Commit 4 completes the DEV-only Playground
and production-exclusion evidence. The complete framework's 2026-07-28
adversarial local release review returned **RELEASE BLOCKED**: a P1
pending-load scope-replacement defect and substantive P2 one-shot Tab-bridge
defect blocked acceptance, and the review also recorded one DEV-only P3
unbounded-log issue. All three findings are now narrowly repaired and locally
verified, including 1,028 passing full-suite tests and renewed production
exclusion. The blocked review remains historical; a repeated independent
release review of the exact repair commit is required before framework
acceptance. Production still has no Glossary terms, annotations, or visible
Glossary behavior: the current Lab supplies no binding, and production excludes
the Playground. Production content and the ODE vertical slice remain
unauthorized.

## 2. Verification baseline

Final Phase 6 local verification used Node 22.23.1, npm 10.9.8, Vite 5.4.21, TypeScript 5.4, and Vitest 2.1.9.

At the final local reopen checkpoint, Cursor/Codex opened the canonical
`D:\numerical-t-lab` workspace. Git remained valid on branch `main`; HEAD
remained `521d8eba2aad3ad361c289e3e4b1e8e2e7ce6f30` across the physical
folder rename; the worktree remained clean; and `origin` and `vercel` retained
the canonical Numerical T-Lab repository URLs. The local typecheck, API
typecheck, build, and verification evidence recorded below remains applicable,
and the migration-closeout commit reruns those automated gates from the
canonical path.

```bash
npm run test:run
npm run typecheck
npm run typecheck:api
npm run build
npm run verify
npm run dev
npm run dev:api
npm run preview
```

`npm run verify` passed on 2026-07-14:

- 60 test files passed;
- 866 tests passed;
- application typecheck passed;
- API typecheck passed;
- production build passed with only the accepted large deferred-chunk warning.

Local browser checks covered Home, every public overview/page, the nested ODE route, direct preview requests, client Not Found, desktop/mobile navigation, mobile Tutor modal behavior, horizontal overflow, lazy asset loading, and console errors. The local mock API returned HTTP 200 with `demoMode: true`; malformed input returned HTTP 400.

The non-production Vercel Preview for commit `2232595cbea57504a9ba2c3e1c949e3d621bd347` was verified at `https://numerical-ode-lab-w-aq5e8owap-bruce-tian.vercel.app` on 2026-07-14. Direct nested routes and refresh, client Not Found, runtime chunk boundaries, mock Tutor, session lifecycle, New experiment flows, mobile overflow, and a clean console passed. Using a temporary Automation Bypass secret, malformed `POST /api/chat` returned HTTP 400 with `application/json; charset=utf-8` and `{ "error": "messages array is required." }`, not `index.html`. The sampled entry JavaScript, platform CSS, and WOFF2 font returned HTTP 200 with `application/javascript`, `text/css`, and `font/woff2` respectively. The temporary secret was removed immediately after sampling and its revocation was confirmed by the restored Vercel Authentication redirect.

The Numerical T-Lab migration Preview
`dpl_9eRKmCZahUxEa34X9H2rUffCZzEr` and Production deployment
`dpl_GwW9hjgJgX86MEB6Co4Eqrxg8utp` both used exact reviewed commit
`ead244ecefb82475414c73e15293184d99e1b78a`. Route, title, identity,
responsive layout, Tutor, lazy-loading, asset, API, and console checks passed.
Production raw sampling confirmed malformed `/api/chat` returns HTTP 400 JSON
and representative JavaScript, CSS, and WOFF2 assets have the expected content
types. `numerical-t-lab.vercel.app` is the verified canonical domain. The
former `numerical-ode-lab-wai.vercel.app` address remains a verified alias
serving the same Production deployment without redirecting the browser.

## 3. Platform architecture

`src/main.ts` is a thin platform bootstrap. `src/app/platformBootstrap.ts` composes exactly one:

- project-owned History API router;
- persistent App Shell;
- in-memory `AppSessionStore`;
- lightweight `PlatformTutorHost`;
- route/module registry;
- scroll/history lifecycle service;
- minimal `beforeunload` listener.

Static pages remain in `src/pages/`. The complete ODE Lab loads through the dynamic route boundary in `src/app/moduleRegistry.ts`. A generic Lab route adapter obtains or creates the opaque pure Lab session, mounts it, connects its Lab-owned Tutor binding to live Tutor session access, snapshots state on navigation, disconnects the Host before Lab disposal, and retains no hidden Lab DOM.

The platform bootstrap and static pages do not statically import ODE implementation, solvers, Chart.js, Convergence, complete Tutor runtime, ODE Tutor grounding, MathLive, or Compute Engine.

## 4. Session and meaningful-work architecture

`AppSessionStore` owns three independent categories of pure in-memory state:

- Lab sessions by module;
- Tutor sessions by module;
- route/Lab metadata.

The ODE Lab owns and supplies its current `OdeSessionState` and `LabTutorBinding`. It does not import the Store or Tutor Host. Runtime objects such as DOM nodes, Chart instances, MathLive elements, abort controllers, closures, errors, and mounted handles never enter stored state.

Meaningful-work metadata is continuously maintained. A pristine Beginner Starter, Tutor draft, panel open state, scrolling, metric selection, accordion state, and passive remount do not count as meaningful. Core ODE changes, progress beyond Method, successful output, successful Convergence analysis, and submitted user Tutor messages do. Activity timestamps update only for approved meaningful user actions.

Home reads privacy-safe Resume summaries through an injected lightweight service. A summary can contain only module, route, Lab title, Method/Data/Output step, safe method label, current/stale analysis label, and numeric activity time. Equations, input values, numerical results, point arrays, errors, and Tutor text are excluded.

Sessions and Resume cards are **current-tab memory only**. There is no localStorage, sessionStorage, IndexedDB, account, cross-tab state, or persistence. Refresh or tab/browser closure loses all sessions.

The one platform `beforeunload` handler only checks `store.hasMeaningfulWork()`, calls `preventDefault()`, and sets `returnValue` to an empty string. It performs no DOM, MathLive, mounted-Lab snapshot, cloning, reconstruction, or asynchronous work. Internal navigation never shows a custom warning because sessions are preserved.

## 5. Beginner Starter and New experiment

The public first visit to `/ode/initial-value-problems` uses the authoritative Exponential Decay preset:

- Forward Euler;
- Method step;
- `t0 = 0`, `y0 = 1`, `tEnd = 5`, `h = 0.2`;
- RHS `-y`;
- exact solution enabled with `e^(-t)`;
- no output, comparison, Convergence result, or error.

Starter/custom identity is derived from core state rather than a mutable dirty flag.

Confirmed **New experiment** uses that same builder. The user chooses whether to clear Tutor items/draft or preserve them behind a typed “New experiment started” divider; desktop open preference remains intact. The reset zeros:

- visible Lab scroll;
- the per-Lab saved scroll value;
- the namespaced current-history-entry scroll value.

It also invalidates old restoration ownership so a later remount cannot restore the prior experiment position. Cancel and Escape make no changes. Other module sessions remain isolated.

## 6. Scroll and history lifecycle

Platform-owned metadata is merged under `history.state.numericalAnalysisLab`; unrelated state fields are preserved on every push/replace.

- Each history entry has an entry ID and scroll value.
- Back/Forward restores the destination entry.
- Normal forward navigation starts at top.
- Each complete Lab has a saved Lab scroll value for route/Resume return.
- Resume navigation restores the Lab value without changing activity time.
- Focus uses `preventScroll` before the generation-guarded restore.
- Mobile Tutor scroll locking preserves and restores underlying Lab/document scroll.
- New experiment performs the approved triple reset described above.

No browser storage is involved.

## 7. Tutor ownership and security

Ownership is:

```text
Lab -> LabTutorBinding -> Platform Tutor Host
AppSessionStore -> TutorSessionAccess -> Platform Tutor Host
```

The ODE Lab creates fresh grounding from its current successful output for every message. Failed runs retain prior successful grounding. Current/stale Convergence ownership and Compare-disabled behavior are preserved. The binding contains no conversation, panel DOM, Store, or Host reference.

`PlatformTutorHost` owns placement, responsive open/close behavior, focus/scroll/inert handling, lazy-load generation, and request cancellation. The complete panel/networking runtime loads only on first open and always reads/writes through live `TutorSessionAccess`; there is no module-global conversation or stale session snapshot.

User messages are stored before requests. Disconnect, disposal, or connection replacement aborts/invalidates pending work; stale completions cannot append, render, mutate another module, or apply chart instructions. An aborted request may retain the unmatched user message but stores no request handle or transient loading state.

Tutor rendering remains controlled: user content is plain text; assistant math uses the existing non-executable renderer; arbitrary HTML is not trusted; chart instructions are schema-controlled. `/api/chat` remains server-owned, and no browser API key exists.

Ordinary successful ODE Run still clears only that module's Tutor items and draft while preserving desktop-open preference. Failed Run, closing Tutor, route navigation, and remount do not clear the conversation. New experiment uses its separate clear/preserve choice.

## 8. ODE, expression, and numerical contracts

The mountable ODE app owns Method/Data/Output rendering and runtime handles. `getSession()` returns current pure state synchronously and reuses immutable solver-result snapshots rather than recopied point arrays. Full rerender and route disposal destroy Charts, Convergence views, expression handles, delayed generation work, virtual keyboard state, and owned listeners. Disposal is idempotent.

The expression boundary remains:

```text
MathLive draft LaTeX
  -> Compute Engine raw MathJSON
  -> project-owned closed MathAst
  -> profile validation and deterministic serialization
  -> explicit finite numeric evaluator
  -> solver function parameter
```

`MathAst` is numerical authority. LaTeX and raw MathJSON are adapter/display data. Production user expressions use neither `eval` nor `new Function`. Solvers accept numeric closures and do not import MathLive, MathJSON, LaTeX, DOM, or Tutor rendering.

Implemented methods and all fixed-grid, coefficient, Newton, diagnostic, exact-solution, failed-run ownership, comparison, and Convergence rules are unchanged. See `docs/NUMERICAL_CONTRACTS.md`; Phase 6 did not modify it because no numerical contract changed.

## 9. Lazy-loading and final bundle evidence

The final root-base manifest records the entry with dynamic imports to the ODE route and Tutor panel. Local browser asset inventory observed:

- Home: entry JS and platform CSS only (plus external font CSS/favicon);
- ODE navigation: ODE JS/CSS plus the shared ODE/Convergence chunk;
- Tutor open: Tutor JS/CSS;
- entry to Data/math editing: editable/Compute Engine JS/CSS, MathLive JS/CSS, and required fonts.

| Artifact | Raw bytes | Gzip bytes |
|---|---:|---:|
| Initial entry JS | 38,606 | 12,087 |
| Platform CSS | 8,256 | 1,935 |
| ODE route JS | 241,359 | 80,152 |
| ODE route CSS | 11,607 | 3,099 |
| Shared ODE/Convergence/grounding JS | 60,347 | 18,055 |
| Tutor JS | 11,490 | 4,384 |
| Tutor CSS | 2,821 | 930 |
| MathLive JS | 825,514 | 226,675 |
| Editable/Compute Engine JS | 1,144,184 | 306,587 |
| Editable math CSS | 1,756 | 675 |
| MathLive font CSS | 8,027 | 4,230 |
| MathLive static CSS | 18,262 | 7,087 |
| 19 MathLive font files | 256,168 | 256,633 |

The shared `convergenceStudyState` chunk is imported by the ODE route, Tutor panel, and editable field chunk. It contains common numerical/method, expression, read-only math, and Convergence/grounding code. It is requested on ODE navigation, never by initial Home. Tutor open reuses it; its MathLive edge remains dynamic. No measured boundary defect justified `manualChunks`.

For comparison, the pre-platform application entry was approximately 298,639 raw / 96,575 gzip; the Phase 4B entry was approximately 29,322 / 9,360. The final entry is 38,606 / 12,087 after the completed session, Resume, scroll, reset, and release contracts. These are measurements, not claims about network transfer under every hosting/cache configuration.

## 10. Deployment contract

`vite.config.ts` uses `base: "/"` and retains the `/api` development proxy. Generated `index.html`, CSS font URLs, and nested route assets are root-origin safe.

`vercel.json` retains the Vite build/output/framework settings and adds one rewrite from `/(.*)` to `/index.html`. The intended Vercel contract relies on filesystem and function routes resolving before the fallback:

- `/api/chat` reaches `api/chat.ts`;
- `/assets/*` and fonts remain static files;
- known/unknown non-file page paths reach the client router;
- unknown routes render in-shell Not Found without redirecting to `/`.

Contract tests prove the configuration and generated output structurally. The
Numerical T-Lab Preview and Production deployments subsequently proved direct
nested refresh, API/static precedence, unknown-route handling, absence of
redirect/rewrite loops, runtime chunk timing, and console health. Production
raw sampling confirmed API JSON and JavaScript, CSS, and font content types.

## 11. Platform implementation commits

| Commit | Purpose |
|---|---|
| `9a7c5334b0bce5d0d98949ba32ab3f0ab8f8bd6c` | Clarify Platform Shell ownership |
| `dc8dc08f5eb823b02062e064a18f16101d25f834` | Record implementation plan |
| `e8f03f5e86da843418ff489bd273521ab2cfd865` | Router, static shell, and semantic tokens |
| `525201d027296b05157685c3528d620b0e1c9763` | Platform and ODE pure session models |
| `97714594f661d39cd4651a7e76058c09b46a299c` | Mountable Initial Value Problems route |
| `cb80afcbe77e757f2940487015cb8c77f67fa048` | Shared Tutor Host |
| `20ee014c487a63febbebaf781cf4b90e96b7aab0` | Atomic public platform entry switch |
| `865f42bd4b19b85f36e3062b536e20d5de6bf3c3` | Resume and meaningful work |
| `53eba14eaffb2eb083e7c9a523ee21872f120c6f` | Scroll and reset lifecycle |
| `4b236ffa67fd7a4f75abad2afdd0153cd98ead06` | Root-base Vite and Vercel SPA deployment contracts |
| `2232595cbea57504a9ba2c3e1c949e3d621bd347` | README, handoff, design implementation record, and final review |
| `0390c941ae44834b9fc162284b9096968011c1d2` | Keep the Platform Home title inline at desktop widths |

## 12. Known limitations and contributor rules

Known limitations:

- Sessions are memory-only.
- ODE support remains scalar and fixed-step.
- Convergence is synchronous and limited to eligible first-order single-method output with an exact solution.
- Tutor is unavailable for Compare output.
- Deferred MathLive and editable/Compute Engine chunks remain large.
- Linear Algebra and PDE are not runnable Labs.
- The Content-Agnostic Interactive Glossary Framework's four planned phases
  are complete locally. Its blocked-review P1/P2/P3 findings are repaired and
  locally verified, but repeated independent release review is pending.
  Production initializes an inert Host but contains no Glossary terms,
  annotations, activatable surface, Playground, or visible Glossary behavior.

Contributor rules:

- Preserve UI/adapters -> project AST/validation/evaluator -> numeric closures -> solvers.
- Do not reorder, sort, flatten, fold, or symbolically simplify AST arithmetic; grouping and child order can affect numerical behavior.
- Do not restore dynamic code execution as compatibility.
- Keep Lab, Tutor, Store, Host, and Router ownership directions intact.
- Keep Home/static routes outside ODE, Tutor, MathLive, and Compute Engine runtime graphs.
- Preserve namespaced history state and unrelated fields.
- Keep `beforeunload` minimal and synchronous.
- Run `npm run verify` after changes and add focused tests first.

*Last updated: 2026-07-28. Project Identity Migration and prior Production
verification remain complete. All four Glossary framework phases are complete
locally, and the three findings from the blocked framework release review are
locally repaired and verified. A repeated independent release review of the
exact repair commit is the next gate. Production still contains no Glossary
terms, annotations, Playground, activatable surface, or visible behavior.*
