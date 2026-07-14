# Theme-Ready Platform Shell Final Review

**Review date:** 2026-07-14  
**Release verdict:** **SAFE TO RELEASE AFTER LISTED DEPLOYMENT CHECKS**

## 1. Scope reviewed

This review covers the completed Theme-Ready Platform Shell milestone: public routing and static pages, the dynamically mounted Initial Value Problems Lab, pure in-memory Lab/Tutor sessions, shared Tutor Host, Resume and meaningful-work behavior, minimal unload protection, scroll/history lifecycle, New experiment, semantic theme tokens, root-origin Vite output, and the Vercel SPA fallback contract.

The review does not add or claim an Interactive Term Glossary, Linear Systems Lab, PDE Lab, persistence, authentication, new numerical method, numerical algorithm change, final fantasy branding, or final theme switch.

## 2. Authoritative design and plan

- Design: `docs/superpowers/specs/2026-07-13-theme-ready-platform-shell-design.md`
- Implementation plan: `docs/superpowers/plans/2026-07-13-theme-ready-platform-shell-implementation-plan.md`

The implementation preserves the approved ownership directions, lifecycle, route table, in-memory scope, Tutor boundaries, accessible navigation semantics, and New experiment triple scroll reset.

## 3. Implementation commit sequence

| Commit | Gate |
|---|---|
| `9a7c5334b0bce5d0d98949ba32ab3f0ab8f8bd6c` | Clarify Platform Shell ownership |
| `dc8dc08f5eb823b02062e064a18f16101d25f834` | Record repository-grounded implementation plan |
| `e8f03f5e86da843418ff489bd273521ab2cfd865` | Router, static shell, pages, and semantic tokens |
| `525201d027296b05157685c3528d620b0e1c9763` | AppSessionStore and pure ODE sessions |
| `97714594f661d39cd4651a7e76058c09b46a299c` | Mountable Initial Value Problems route |
| `cb80afcbe77e757f2940487015cb8c77f67fa048` | Shared Tutor Host and module Tutor sessions |
| `20ee014c487a63febbebaf781cf4b90e96b7aab0` | Atomic public platform entry switch |
| `865f42bd4b19b85f36e3062b536e20d5de6bf3c3` | Resume, meaningful work, and minimal unload handler |
| `53eba14eaffb2eb083e7c9a523ee21872f120c6f` | Scroll/history and New experiment lifecycle |
| `4b236ffa67fd7a4f75abad2afdd0153cd98ead06` | Root-base Vite and Vercel SPA deployment contracts |
| current documentation commit | Release documentation and this final review |

The Tutor migration and public route switch remain separate reviewable commits as required.

## 4. Final architecture

`src/main.ts` boots `createPlatformBootstrap()` and imports only lightweight platform infrastructure and platform styles. The bootstrap owns one Store, Shell, Router, Tutor Host, module registry, scroll service, and disposal boundary.

Static route modules are eager and domain-light. `src/app/moduleRegistry.ts` registers the Initial Value Problems Lab with a dynamic import. The generic Lab adapter retrieves or creates an opaque pure session, mounts the Lab, connects its Lab-owned Tutor binding to live store access, snapshots on route disposal, disconnects the Host before invalidating the binding, and retains no hidden DOM.

The mounted ODE app owns workflow rendering and ODE runtime handles. Local UI generations reject stale asynchronous continuations. Final disposal destroys Charts, Convergence views, expression fields, virtual-keyboard state, listeners, and route-owned DOM idempotently.

## 5. Route table

| Path | Route | Availability |
|---|---|---|
| `/` | Platform Home | Available |
| `/ode` | Numerical ODE overview | Available |
| `/ode/initial-value-problems` | Initial Value Problems Lab | Available complete Lab |
| `/linear-algebra` | Numerical Linear Algebra overview | In development roadmap |
| `/pde` | Numerical PDE overview | Planned roadmap |
| `/about` | About | Available |
| any other page path | In-shell Not Found | Available |

The router uses exact normalized pathnames, preserves query/hash, uses History API navigation, handles Back/Forward, protects against stale route loads, and keeps failure/Retry inside the shell. Exact routes may use `aria-current="page"`; the ODE parent uses `aria-current="location"` on the nested Lab route.

## 6. Session and Store architecture

`AppSessionStore` owns pure Lab sessions, pure module Tutor sessions, and route/Lab metadata independently. The ODE session is created by the dynamically loaded module, not by the eager Store. Structural guards reject functions, cycles, DOM/EventTarget instances, abort objects, mounted handles, Chart-like objects, and unapproved class instances.

Lab state contains immutable solver snapshots, workflow/form/output state, and a readonly fingerprint-keyed Convergence record. It contains no DOM, Chart, Map, Error, evaluator closure, request, or Tutor panel.

Meaningful metadata combines separate Lab and user-Tutor contributions. Resume summaries are one per meaningful module, sorted by maintained numeric activity time, limited to three, and privacy-safe. All state is memory-only for the current tab.

## 7. Tutor ownership

Final ownership is:

```text
Lab -> LabTutorBinding -> Platform Tutor Host
AppSessionStore -> TutorSessionAccess -> Platform Tutor Host
```

The Lab owns the binding and fresh ODE grounding. The Store owns module-isolated transcript, draft, and desktop-open preference. The Host owns responsive placement, focus/scroll/inert behavior, lazy panel loading, and transient request lifecycle. The panel reads the current session through live access before every update; no module-global conversation or immutable session snapshot remains.

The complete panel, networking, controlled Tutor rendering, chart instructions, and prompt-profile execution load on first open. User messages persist before requests. Abort/generation guards prevent stale completion, cross-module mutation, detached-DOM rendering, and stale chart instructions.

## 8. Lifecycle and disposal

Router and ODE UI generations independently prevent stale work. Navigation closes mobile Tutor, captures scroll and pure Lab state, disconnects the Host, disposes the Lab, and mounts only the current route generation. Loading and failure states never connect Tutor.

ODE disposal destroys primary and Convergence Charts, expression handles, virtual-keyboard state, route/document/media listeners, delayed MathLive work, and owned DOM. Host disposal aborts requests and removes transient UI without clearing pure Tutor sessions. Repeated disposal is safe.

## 9. Scroll and history behavior

The platform sets manual scroll restoration while active and restores the previous browser setting on disposal. It preserves unrelated history fields and stores platform metadata only under `history.state.numericalAnalysisLab`.

- normal forward/static navigation starts at top;
- Back/Forward restores the destination entry's namespaced scroll;
- complete Lab/Resume return uses the per-Lab value;
- focus with `preventScroll` precedes generation-guarded restoration;
- stale route work cannot focus or scroll;
- mobile Tutor lock/unlock preserves underlying document scroll.

## 10. New experiment behavior

Confirmed New experiment recreates the authoritative Exponential Decay + Forward Euler Beginner Starter. Checked reset clears only ODE Tutor items/draft while preserving desktop-open preference. Unchecked reset preserves transcript behind the typed divider, which is rendered but excluded from API messages. Cancel and Escape mutate nothing.

The operation zeros visible Lab scroll, per-Lab saved scroll, and the current history entry's namespaced scroll value, while invalidating old restoration ownership. A later remount cannot recover the prior experiment position. Other module state is isolated.

## 11. Theme-token scope

The platform uses centralized semantic color, spacing, radius, shadow, texture, and content-width tokens. New platform/page CSS is guarded against literal colors outside `theme.css`. Dark color-scheme support, visible focus, text status labels, responsive layouts, and no-horizontal-overflow rules are retained. There is no theme switch, final brand font, fantasy art, or heavy animation.

Legacy ODE workspace styling was not broadly redesigned.

## 12. Vite and Vercel deployment

`vite.config.ts` now uses `base: "/"` and retains the existing `/api` development proxy. Real builds generate `/assets/...` entry and stylesheet links plus root-origin MathLive font URLs.

`vercel.json` retains `npm run build`, `dist`, and `vite`, and adds one rewrite from `/(.*)` to `/index.html`. No redirect, API rewrite, asset rewrite, guessed header, or duplicate build setting was added.

The intended deployed contract is filesystem/function-first: `/api/chat` remains the Vercel Function, emitted files remain files, and non-file page routes reach the client router. Contract tests prove the configuration shape but deliberately do not emulate Vercel precedence. A deployed preview is still required.

## 13. Automated verification

Commands run:

```text
npm.cmd run test:run -- src/app/viteBase.contract.test.ts src/app/vercelRouting.contract.test.ts src/app/routeBundleOwnership.test.ts
npm.cmd run build
npm.cmd exec -- vite build --manifest
npm.cmd run verify
git diff --check
git status --short
```

Final automated result:

- **60/60 test files passed**;
- **866/866 tests passed**;
- application typecheck passed;
- API typecheck passed;
- production build passed;
- Vite 5.4.21 transformed 73 modules;
- only the expected `>500 kB` warning for deferred MathLive/editable chunks remained.

## 14. Final bundle table

Sizes are from the final `npm.cmd exec -- vite build --manifest` output. Gzip values are measured from emitted files.

| Artifact | Raw bytes | Gzip bytes | Load boundary |
|---|---:|---:|---|
| Initial entry JS | 38,606 | 12,087 | Home/entry |
| Platform CSS | 8,256 | 1,935 | Home/entry |
| ODE route JS | 241,359 | 80,152 | ODE route |
| ODE route CSS | 11,607 | 3,099 | ODE route |
| Shared ODE/Convergence/grounding JS | 60,347 | 18,055 | ODE route; reused by Tutor/editable |
| Tutor panel JS | 11,490 | 4,384 | First Tutor open |
| Tutor panel CSS | 2,821 | 930 | First Tutor open |
| MathLive JS | 825,514 | 226,675 | Math rendering/editing request |
| Editable/Compute Engine JS | 1,144,184 | 306,587 | Editable field request |
| Editable field CSS | 1,756 | 675 | Editable field request |
| MathLive font CSS | 8,027 | 4,230 | MathLive request |
| MathLive static CSS | 18,262 | 7,087 | MathLive request |
| 19 MathLive fonts | 256,168 | 256,633 | Individual font use |

The pre-platform eager JS baseline was approximately 298,639 raw / 96,575 gzip. Phase 4B measured approximately 29,322 / 9,360 before Phase 5 lifecycle features. The final entry is 38,606 / 12,087, about 87% smaller than the old eager entry by both raw and gzip measurements. No claim is made beyond the measured artifacts.

## 15. Import and chunk boundary evidence

The Vite manifest is primary evidence:

- `index.html` has no static chunk imports and dynamically reaches the ODE route and Tutor panel;
- the ODE route imports the entry/shared chunk and dynamically reaches the editable field;
- the Tutor panel imports the entry/shared chunk;
- the shared `convergenceStudyState` chunk is imported by ODE, Tutor, and editable boundaries and dynamically reaches MathLive;
- MathLive and editable/Compute Engine remain separate deferred chunks.

Source-graph tests prove that the entry, bootstrap, shell, and static pages have no static runtime path to ODE implementation, Chart.js, solvers, presets, Convergence implementation, complete Tutor runtime/networking, ODE grounding, MathLive, or Compute Engine. Marker inspection was supplementary only.

The shared chunk contains common numerical/method, expression, read-only math, Convergence state/runner, and Tutor-grounding support. Local browser inventory showed it requested on ODE navigation, not Home. Tutor open reused it and added only Tutor JS/CSS. Data/math editing later added editable/Compute Engine, MathLive, math CSS, and fonts. No boundary defect justified `manualChunks`.

## 16. Local preview and API results

Vite preview was run at `http://127.0.0.1:4173`. Direct requests rendered correct titles and headings for `/`, `/ode`, `/ode/initial-value-problems`, `/linear-algebra`, `/pde`, `/about`, and an unknown path. The nested ODE route rendered Beginner Starter and no eager Tutor panel. A local Forward Euler starter run reached Output.

Home's observed local assets were the entry JS and platform CSS only, plus external font CSS and the favicon. ODE navigation added the ODE and shared chunks. Tutor open added Tutor JS/CSS. Entering Data added editable/Compute Engine, MathLive, related CSS, and used font files. No browser console warning/error was observed.

At a 390x844 viewport, the menu exposed its expanded state, the document did not overflow horizontally, and the Tutor opened as an `aria-modal` dialog with one inert background and locked body scroll. Desktop routes also had no horizontal document overflow.

With `AI_TUTOR_MOCK=true`, local `POST /api/chat` returned HTTP 200, `application/json`, a grounded demo reply, and `demoMode: true`. Malformed `{}` input returned HTTP 400. No live provider request or secret was used.

Vite preview proves local production assets, chunk timing, client rendering, and its own direct-route fallback. It does not prove Vercel Function/static precedence.

## 17. Deployed-preview status and required checklist

No Vercel preview was created because the repository workflow requires a push and this phase explicitly prohibits pushing. These checks are **PENDING DEPLOYED PREVIEW**:

1. Open `/ode/initial-value-problems` directly and refresh it.
2. Confirm `POST /api/chat` returns Function JSON, not `index.html`.
3. Request one emitted JavaScript file, one CSS file, and one MathLive font; confirm correct content and content types.
4. Open an unknown non-file path and confirm the in-shell Not Found page.
5. Confirm no redirect to `/`, rewrite loop, or unexpected redirect.
6. Confirm browser Network shows Home without ODE/Tutor/math chunks, then the expected chunks at ODE navigation, Tutor open, and math editing.
7. Confirm no console errors or unhandled rejections.

Production promotion should wait for all seven checks to pass.

## 18. Manual acceptance matrix

`PASS` below means the item has direct local browser/API evidence, focused automated evidence, or both. The four target-platform checks remain explicitly pending.

### Platform and ODE

| # | Check | Status | Evidence |
|---:|---|---|---|
| 1 | Home loads and is lightweight | PASS | Local preview + Home asset inventory |
| 2 | Module cards/statuses/actions | PASS | Browser + page tests |
| 3 | Recommended Learning Path | PASS | Browser + page tests |
| 4 | ODE overview | PASS | Direct local route |
| 5 | Linear Algebra roadmap | PASS | Direct local route; no runnable controls |
| 6 | PDE roadmap | PASS | Direct local route; no runnable controls |
| 7 | About | PASS | Direct local route |
| 8 | In-shell Not Found | PASS | Direct unknown local path |
| 9 | Desktop navigation | PASS | Browser + shell tests |
| 10 | Mobile navigation | PASS | 390x844 browser + shell tests |
| 11 | Keyboard focus/active navigation | PASS | Router/accessibility tests |
| 12 | No horizontal overflow | PASS | Desktop/mobile browser measurement |
| 13 | Beginner Starter values | PASS | Route tests + local starter run |
| 14 | Custom experiment identity | PASS | Beginner/ODE lifecycle tests |
| 15 | Method -> Data -> Output | PASS | ODE lifecycle + local run |
| 16 | Single Run | PASS | Solver/ODE tests + local run |
| 17 | Compare | PASS | ODE regression tests |
| 18 | Exact solution | PASS | Exact-solution/ODE tests |
| 19 | Failed Run preserves successful result | PASS | ODE lifecycle tests |
| 20 | Return to current output | PASS | ODE lifecycle tests |
| 21 | Convergence Study | PASS | Convergence suites |
| 22 | Convergence current/stale | PASS | Convergence state/view tests |
| 23 | Metric and accordion restoration | PASS | Convergence/remount tests |
| 24 | Chart cleanup/remount | PASS | ODE lifecycle destroy-spy tests |
| 25 | MathLive editing | PASS | Editable tests + local Data route |
| 26 | MathLive virtual keyboard cleanup | PASS | ODE/Tutor lifecycle tests |

### Tutor

| # | Check | Status | Evidence |
|---:|---|---|---|
| 27 | First-open lazy loading | PASS | Browser inventory + lazy-boundary tests |
| 28 | Mock send | PASS | Local API 200 with `demoMode: true` |
| 29 | Safe math rendering | PASS | Tutor-math/panel tests |
| 30 | Chart instructions | PASS | Tutor/client/API tests |
| 31 | Successful Run resets conversation | PASS | ODE/Host lifecycle tests |
| 32 | Failed Run does not reset | PASS | ODE lifecycle tests |
| 33 | Close/navigation preserves conversation | PASS | Store/Host/bootstrap tests |
| 34 | Aborted request behavior | PASS | Host/panel generation tests |
| 35 | Desktop panel | PASS | Host tests + desktop browser open |
| 36 | Mobile modal | PASS | 390x844 modal/inert/scroll-lock check |
| 37 | Route close before Lab disposal | PASS | Adapter/bootstrap order tests |
| 38 | No Tutor on static routes | PASS | Browser routes + bootstrap tests |

### Session lifecycle

| # | Check | Status | Evidence |
|---:|---|---|---|
| 39 | ODE -> Home -> ODE restoration | PASS | Bootstrap/navigation tests |
| 40 | Tutor session restoration | PASS | Store/Host/bootstrap tests |
| 41 | Resume only for meaningful work | PASS | Meaningful/Home tests |
| 42 | Resume restores session | PASS | Home/bootstrap tests |
| 43 | `beforeunload` meaningful behavior | PASS | Minimal-handler tests |
| 44 | Back/Forward route restoration | PASS | Router/scroll tests |
| 45 | Per-history-entry scroll | PASS | Scroll restoration tests |
| 46 | Per-Lab scroll | PASS | Scroll restoration tests |
| 47 | Resume scroll | PASS | Scroll/bootstrap tests |
| 48 | Mobile Tutor scroll coordination | PASS | Host/scroll tests + mobile check |
| 49 | New experiment checked clear | PASS | New experiment tests |
| 50 | New experiment unchecked preserve | PASS | New experiment tests |
| 51 | Divider excluded from API | PASS | Tutor session/panel tests |
| 52 | Triple scroll reset | PASS | New experiment/scroll tests |
| 53 | Cancel/Escape no mutation | PASS | New experiment tests |
| 54 | Other module isolation | PASS | Store/New experiment tests |

### Loading, bundles, and deployment

| # | Check | Status | Evidence |
|---:|---|---|---|
| 55 | ODE intent prefetch once | PASS | Loader/bootstrap tests |
| 56 | No incomplete-module prefetch | PASS | Page/loader tests |
| 57 | Loading state | PASS | Router/bootstrap tests |
| 58 | Route failure and Retry | PASS | Router/loader/bootstrap tests |
| 59 | Stale route race | PASS | Router generation tests |
| 60 | Home Network excludes heavy chunks | PASS | Manifest + browser inventory |
| 61 | ODE route loads numerical chunk | PASS | Manifest + browser inventory |
| 62 | Tutor open loads Tutor chunk | PASS | Manifest + browser inventory |
| 63 | MathLive/Compute Engine remain deferred | PASS | Manifest/source/browser evidence |
| 64 | Direct nested refresh on Vercel | PENDING DEPLOYED PREVIEW | Local preview passed; target pending |
| 65 | `/api/chat` protected from fallback | PENDING DEPLOYED PREVIEW | Contract + local mock passed; target pending |
| 66 | Static assets protected from fallback | PENDING DEPLOYED PREVIEW | Root assets local; target precedence pending |
| 67 | Unknown deployed route reaches Not Found | PENDING DEPLOYED PREVIEW | Local preview passed; target pending |
| 68 | No console errors/unhandled rejections | PASS | Local console clean + async tests |

## 19. Numerical regression findings

Solver, nonlinear solve, exact solution, expression, preset, comparison, Convergence, ODE lifecycle, failed-run ownership, and Return-to-output suites pass. Phase 6 changed only deployment configuration, contract tests, and documentation. `docs/NUMERICAL_CONTRACTS.md`, solvers, methods, numerical results, and ODE production source were not modified.

The local Beginner Starter smoke run completed Forward Euler for Exponential Decay on the approved fixed grid and rendered Output. This supplements rather than replaces the numerical suite.

## 20. Security and safe-rendering findings

- Browser expressions still use the closed `MathAst` and explicit numeric evaluator; no dynamic execution fallback was introduced.
- Tutor user content remains plain text; assistant math remains controlled and non-executable; arbitrary HTML is not trusted.
- Chart plans remain schema-validated.
- Tutor grounding remains a whitelisted serializable DTO derived from successful snapshots.
- Server prompt construction and provider access remain server-only.
- `/api/chat` accepts the existing validated contract; malformed local input returned HTTP 400.
- No `VITE_` API key, browser secret, persistence, account, or new data-transmission path was introduced.

## 21. Accessibility and responsive findings

Automated navigation/accessibility tests and local desktop/mobile checks passed. Semantic anchors and buttons remain native; exact and parent-route current semantics are correct; focus is visible and deliberately managed; the mobile menu exposes expansion/control state; the mobile Tutor is an `aria-modal` dialog with inert background and locked body scroll; statuses use text rather than color alone.

Local desktop and 390x844 checks found no horizontal document overflow. Automated tests cover Escape, menu/Tutor close, focus restoration, route semantics, and stale focus/scroll rejection.

## 22. Scope audit and known limitations

Phase 6 source scope is exactly `vite.config.ts`, `vercel.json`, and two deployment contract tests. Release documentation scope is exactly README, PROJECT_HANDOFF, the authoritative design status/record, and this review.

No package or lockfile, dependency, numerical contract, solver, ODE behavior, Tutor content, Vite plugin, framework, glossary, Linear Systems feature, PDE feature, persistence, authentication, or branding feature changed.

Known limitations:

- sessions and Resume are current-tab memory only;
- Vercel deployed-preview checks are pending;
- ODE is scalar and fixed-step;
- Convergence is synchronous and limited to eligible first-order single-method exact-solution runs;
- Tutor is unavailable for Compare output;
- MathLive and editable/Compute Engine remain large but deferred;
- Linear Algebra and PDE are roadmap-only;
- Interactive Term Glossary is not implemented.

## 23. Remaining risks

The only release-gating risk is unobserved target-platform behavior: Vercel function/filesystem precedence and content types must match the structurally verified configuration. The bounded section 17 checklist mitigates that risk before production promotion.

Accepted non-gating risks are the large deferred math chunks and synchronous bounded Convergence execution. The manifest and browser inventory show these costs are outside Home and remain behind user intent. There is no evidence that manual chunking would improve correctness or the approved boundaries.

Future work must preserve Store/Host/Lab ownership, minimal unload behavior, namespaced history merging, stale-generation guards, and current numerical contracts.

## 24. Release verdict

**SAFE TO RELEASE AFTER LISTED DEPLOYMENT CHECKS**

The implementation meets the approved design locally, the complete automated suite is green, the production build and lazy boundaries are measured, local browser/API checks pass, scope is contained, and no numerical contract changed. Release should proceed only after the Vercel preview checklist in section 17 passes. If any listed check fails, stop promotion and fix the concrete deployment defect without broadening product scope.
