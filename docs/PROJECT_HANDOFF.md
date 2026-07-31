# Numerical T-Lab — Project Handoff

This is the durable handoff for future contributors. Use it with the current codebase and the authoritative design and plan; do not rely on prior chat history.

**Status (2026-07-30):** Numerical T-Lab is locally verified and
Production-verified at `https://numerical-t-lab.vercel.app/`. The GitHub
repositories, Git remotes, existing Vercel project, Git integration, and
canonical domain use the Numerical T-Lab identity. The local workspace rename
and reopen are complete at `D:\numerical-t-lab`; Project Identity Migration is
complete. See
[the rename review](./reviews/2026-07-22-numerical-t-lab-rename-review.md).
The separate project-language gate is also complete: Yiding (Bruce) Tian
recorded all nine maintainer decisions on 2026-07-28, and the terminology,
notation, and teaching-voice standards are approved as Version 1. That approval
is documentation governance only. The Glossary catalog and project copy audit
are now reconciled across all 197 stable IDs and 55 copy records, with six
future implementation groups and local validation/traceability. The four ready
Group A records (`COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005`) are
accepted. Group B records `COPY-006` through `COPY-019` and Group C records
`COPY-020` through `COPY-029` are accepted. Group D records `COPY-030` through
`COPY-040` are accepted. Group F1 implements `COPY-043`, completes the
pre-Glossary consistency review, and is accepted as prerequisite state. All
twelve `COPY-NC-*` records remain review-only and have explicit
classifications. The four language findings and
one deterministic Tutor behavior finding from that review are now
`CLOSED_VERIFIED` by the separately authorized two-commit
[pre-Glossary repair](./reviews/2026-07-29-pre-glossary-repair-review.md), with
verdict **PRE-E REPAIR COMPLETE — GROUP E MAY BE PLANNED**. Both repair commits
are accepted prerequisites. The documentation-only
[ODE Glossary Wave 1 design](./superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md),
[ten-card content packet](./content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md),
[approval checklist](./content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md),
and
[readiness review](./reviews/2026-07-29-ode-glossary-wave-1-design-readiness-review.md)
now record verdict **DESIGN AND CONTENT APPROVED — E1 AUTHORIZATION
REQUIRED**. Yiding (Bruce) Tian approved D01–D18 as Option A, all ten cards
with exact revisions, and all ten annotation records on 2026-07-29.
The subsequent authorized E1 attempt stopped before source or test changes
when repository inspection confirmed that the compact Glossary model cannot
represent all approved rich card fields. The maintainer selected
`E1-SCHEMA-01 = Option 2`; the
[rich-model design](./superpowers/specs/2026-07-29-rich-glossary-content-model-design.md),
[field matrix](./content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md), and
[readiness review](./reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md)
are complete with verdict **RICH GLOSSARY MODEL DESIGN COMPLETE —
IMPLEMENTATION AUTHORIZATION REQUIRED**. The repository-grounded
[implementation plan](./superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)
and
[plan review](./reviews/2026-07-29-rich-glossary-content-model-plan-review.md)
are complete with verdict **RICH GLOSSARY IMPLEMENTATION PLAN COMPLETE —
AUTHORIZATION REQUIRED**. The subsequently authorized generic implementation
was accepted at `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`, and its
[implementation review](./reviews/2026-07-29-rich-glossary-content-model-implementation-review.md)
records verdict **RICH GLOSSARY MODEL IMPLEMENTED — READY FOR MAINTAINER
ACCEPTANCE** as a point-in-time verdict. The separately authorized fresh E1
restart now contains exactly two inert Core entries, eight inert ODE entries,
two ODE context-only overrides, and ten composed cards. The
[E1 review](./reviews/2026-07-29-ode-glossary-wave-1-e1-content-review.md)
records local verification and verdict **E1 RICH CONTENT IMPLEMENTED AND
INERT — READY FOR MAINTAINER ACCEPTANCE** as its point-in-time verdict. The
maintainer accepted E1 at `08b80522283438a233974456a026a6dbc2a96746`. The
first E2 integration pass stopped before source/test changes at two interaction
contract mismatches. The
[E2 Runtime Contract](./content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
now records `E2-CONTRACT-01`, `E2-CONTRACT-02`, and a complete source-grounded
contract for all ten records. It is the sole implementation authority for E2
interaction details. The separately authorized E2 implementation now creates
exactly one complete-IVP route-instance binding and ten explicit annotations.
The generic production registry remains empty; the accepted ten-card registry
is composed only behind the complete-IVP dynamic route. `/ode` remains plain,
Tutor remains independent, and the maintainer accepted E2 for entry into the
mandatory E3 review at `8c8e90a6abc177132f3e033bdb575f2042b982a9`. The
[E2 integration review](./reviews/2026-07-30-ode-glossary-wave-1-e2-integration-review.md)
records the exact contract, browser, lifecycle, and production-graph evidence.
The independent
[E3 integration review](./reviews/2026-07-30-ode-glossary-wave-1-e3-integration-review.md)
passed the exact committed E1+E2 state with zero P0/P1/P2 findings and no
product-source change. E1, E2, and E3 are accepted. The first mandatory F2
review found two P1 findings (`F2-TUTOR-NOT-001`,
`F2-TUTOR-TERM-001`) and one P2 finding (`F2-ABOUT-STATUS-001`). The
[blocking-corrections review](./reviews/2026-07-30-f2-cross-surface-blocking-corrections-review.md)
records their accepted narrow correction. The fresh corrected-state F2 review
then found `F2-TUTOR-NOT-002` and `F2-ODE-OVERVIEW-TERM-001` at P1, plus
adjacent P3 wording drift `F2-ODE-OVERVIEW-TERM-002`. The
[final terminology corrections review](./reviews/2026-07-30-f2-final-terminology-corrections-review.md)
records their narrow local correction. The final independent F2 review then
found `F2-COMPARE-COUNT-001` and `F2-GOV-STATUS-001`. The
[final count and governance corrections review](./reviews/2026-07-30-f2-final-count-and-governance-corrections-review.md)
records their narrow local correction. All seven known F2 blockers remain
closed. The
[final independent F2 consistency review](./reviews/2026-07-31-ode-glossary-wave-1-final-f2-cross-surface-consistency-review.md)
passed exact commit `451a0cbe5e67afc58b280795dd13d43db09d16af` with
`P0 = P1 = P2 = 0` and no product-source change. F2 is independently passed
pending maintainer acceptance of that review commit.
`E1-BROWSER-EXCEPTION-01` accepts only the unchanged Google Fonts
stylesheet/font request chain for this E1 evidence gate. The source and
starting-HEAD `index.html` blobs are identical at
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`. The pre-existing dependency is
recorded as `BASELINE-EXT-FONT-001` (P3, accepted nonblocking carry-forward,
owner: future Platform/asset-policy review); E1 introduced no external
traffic, and no remediation was performed.
`COPY-003` and `src/pages/homePage.ts` remain review-only and unchanged. These
iterations preserve calculations, classifications, grounding values,
request/API/session behavior, and numerical lifecycle. E2 adds only its
accepted ODE-owned binding, explicit annotations, direct tests, narrow layout,
review, and governance updates. No Tutor handoff or generic Framework redesign
occurred. No push, Preview deployment, or Production deployment was authorized
or performed, so the public deployed site remains unchanged from its
previously deployed commit.

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
The active milestone is **ODE Glossary Wave 1 F2 — Final Consistency Review
Acceptance Gate**;
**Linear Systems Lab** is later. The
[authoritative Glossary design](./superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
is approved and committed. Commit 1, the content-agnostic Glossary model and
scope lifecycle, is implemented and accepted after conservative audit.
The readonly-math accessibility prerequisite is locally verified. Commit 3
shared Host/surface/modal infrastructure and a minimal DEV-only Playground are
implemented and locally/browser verified but not deployed. Its prior lifecycle
audit findings have locally verified follow-ups and a final conservative
re-audit verdict of SAFE TO PROCEED. Commit 4 completes the DEV-only Playground
and production-exclusion evidence. The complete framework's first 2026-07-28
adversarial local release review returned **RELEASE BLOCKED** with one P1, one
P2, and one DEV-only P3 finding. All three were narrowly repaired in
`8af3ed80b25a520cfa61fa2d7037dea9ed2899d1`. The
[repeated independent final review](./reviews/2026-07-28-content-agnostic-interactive-glossary-framework-final-review.md)
then returned **APPROVED FOR LOCAL FRAMEWORK RELEASE** with all 40 binding
requirements passing or passing with explicit manual carry-forwards. The
framework is locally accepted as complete; the blocked review remains
unchanged as history. The generic production registry remains empty and has
no eager Wave 1 importer. The deployed Production baseline remains unchanged
and excludes the Playground. The local E2 production build now activates its
accepted ten-card registry only through one complete-IVP route binding; Home,
static pages, and `/ode` remain unannotated.
Nothing was pushed or deployed by the repair or final review.

The documentation-only project-language reconciliation is also complete. It
retains all 197 candidate IDs, reports four required-ID gaps without adding
them, prepares 10 Wave 1 and 13 high-priority Wave 2 rich drafts, and maps all
55 copy records to Groups A–F. The four ready Group A Platform/overview copy
records are accepted; deferred `COPY-003` remains held with the PDE module.
The 14 Group B IVP Method/Data/Output and preset records and the 10 Group C
Convergence/error records are accepted. The 11 Group D Tutor numerical-language
records are accepted. Group F1 implements `COPY-043`, classifies all twelve
review-only records, and completes the accepted pre-Glossary consistency
checkpoint. Its five P2 findings are `CLOSED_VERIFIED`, and both prerequisite
commits are accepted. Group E0 design and content governance now approves
exactly 10 revised Wave 1 cards and 10 complete-Lab annotation records.
The historical E1 schema stop was closed by the accepted generic rich-model
implementation. The fresh E1 restart is locally complete and inert, with
two Core entries, eight ODE entries, two context-only overrides, and ten
composed cards in source. E1 is accepted. The E2 runtime contract is complete
and its separately authorized source/test implementation is accepted through
one complete-IVP binding and ten explicit annotations. Independent E3 review
passed with zero P0/P1/P2 findings and is accepted. The first Group F2 review
found two P1 and one P2 blocking findings, and its correction remains closed.
The fresh corrected-state F2 review found two additional P1 blockers, and the
same `/ode` sentence carried one adjacent P3 wording drift. Those items are
locally corrected. The final review's Compare count and current-state
governance blockers are also locally corrected. All seven known F2 blockers
remain closed. The final independent F2 review passed with zero P0/P1/P2
findings and is pending maintainer acceptance of the F2 review commit.

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

The Group A Platform/overview copy iteration passed its focused page suite
(2 files, 9 tests), static route-bundle ownership suite (1 file, 7 tests), and
full `npm.cmd run verify` gate (73 files, 1,028 tests, both TypeScript checks,
and a 79-module production build). Browser review covered `/`, `/about`,
`/ode`, `/linear-algebra`, and `/pde` at 1440 × 900 and 390 × 844. Approved
copy rendered exactly; route status and links remained truthful; current-page
and mobile-menu focus remained visible; and no clipping, horizontal overflow,
malformed encoding, or console warning/error was observed. The entry chunk
grew by 90 raw bytes for copy only, the accepted non-entry chunk inventory and
sizes remained unchanged, and production artifacts still exclude the
DEV-only Glossary Playground and content fixtures. No push or deployment was
performed.

The Group B IVP workflow copy iteration passed its focused suite (6 files,
57 tests) and full `npm.cmd run verify` gate (73 files, 1,031 tests, both
TypeScript checks, and a 79-module production build). A TypeScript AST
non-change audit and direct diff review confirmed that numerical literals,
calculations, grid arithmetic, validation order, method/preset identity and
values, default state, routes, sessions, imports, Tutor, Convergence teaching,
and Glossary ownership did not change. Browser review covered
`/ode/initial-value-problems` at 1440 × 900 and 390 × 844 through Method, Data,
presets, Run, Output, Compare, and representative validation errors, plus a
brief `/ode` regression. Numeric output stayed unchanged; failed reruns
preserved the last successful output; and no clipping, horizontal overflow,
malformed encoding, or console warning/error appeared. The existing shared
ODE/Convergence and lazy IVP chunks grew only by plausible copy deltas
(`+161/+83` and `+285/+62` raw/gzip bytes); no chunk, dynamic import, Glossary
content, ODE binding, or DEV fixture was added. No push or deployment was
performed.

The Group C Convergence/error copy iteration passed its focused suite (5 files,
93 tests) and full `npm.cmd run verify` gate (73 files, 1,033 tests, both
TypeScript checks, and a 79-module production build). A TypeScript AST
comparison matched 8,573 production nodes with strings ignored, proving
unchanged imports, identifiers, operators, numeric/status literals, branches,
calls, and return shapes. Browser review covered reliable and real
below-resolution evidence, metric switching, stale and missing-exact states,
Compare ineligibility, teaching sections, formula accessibility, and
1440×900/390×844 layout without page overflow or console issues. The existing
shared ODE/Convergence and lazy IVP chunks changed only by bounded copy deltas
(`+44/+15` and `+149/+18` raw/gzip bytes). Calculations, classifications,
precedence, tolerances, eligibility, chart data, stored results, Tutor, and
Glossary behavior remain unchanged. No push or deployment was performed.

The Group D Tutor numerical-language iteration passed its focused suite (5
files, 52 tests) and full `npm.cmd run verify` gate (73 files, 1,042 tests, both
TypeScript checks, and a 79-module production build). A strict TypeScript AST
comparison against starting HEAD matched 5,600 nodes and found only 18
authorized text-fragment changes across the three production owners. Request
validation, status/content types, provider URL, `gpt-4o-mini` model, message
roles/order, fetch options, response parsing and shape, demo routing, chart
instructions, session access, grounding values, abort/cancellation, transcript,
panel DOM/listeners/focus, and lazy ownership remain unchanged. Isolated
localhost review at 1440×900 and 390×844 covered the updated questions and
subtitle; smaller-step, graph, theoretical-order, LTE, current/unavailable
Convergence, and nonlinear-diagnostic replies; stale-evidence exclusion after a
new Run; Compare unavailability; focus restoration; wrapping; and page overflow.
The console remained clean. Prompt-only stiffness/tolerance policy and provider
contract cases remain deterministic-test evidence because no new demo route or
real-model request was authorized. The existing Tutor chunk changed by
`+8/-7` raw/gzip bytes, the lazy IVP route by `+27/+3`, and entry raw size
remained unchanged; no chunk, import, dynamic import, network dependency,
Glossary content, or ODE binding was added. No push or deployment was
performed.

The Group F1 pre-Glossary consistency iteration changed only the
editable-field label from “Parsed expression” to “Interpreted expression” and
added its exact focused assertion. The tests-first run failed only that
assertion; the final file passed 13 tests. The required cross-surface suite
passed 13 files and 135 tests, and `npm.cmd run verify` passed 73 files and
1,042 tests, both TypeScript checks, and the 79-module production build.
Source review confirmed no DOM, MathLive, parsing, validation, focus,
virtual-keyboard, accessibility-ownership, or cleanup change. Development and
production-preview browser review covered the public routes and IVP Lab at
1440×900 and 390×844, including accepted A–D copy, Convergence, Tutor demo,
generic Glossary surfaces, `COPY-043`, focus/modal containment, page overflow,
and console health. Production retained eight JavaScript and seven CSS files
with the same normalized 12 static and 5 dynamic import edges. The existing
editable-math chunk changed by only `+5/+4` raw/deterministic-gzip bytes.
Production excludes the DEV route/fixtures and still contains no Glossary term
or ODE binding.

All twelve `COPY-NC-*` records remain review-only. Six are
`CONSISTENT_NO_CHANGE`, five are `CONSISTENT_WITH_LOCAL_CONTEXT`, and
`COPY-NC-012` is `STALE_BUT_NON_BLOCKING` because its audit quotation predates
the current handoff's truthful addition of the absent ODE binding. The
[Group F1 review](./reviews/2026-07-29-pre-glossary-project-language-consistency-review.md)
records four P2 language findings (`F1-LANG-001` through `F1-LANG-004`) and
one P2 demo behavior finding (`F1-BEH-001`). No finding was fixed in F1.

The separately authorized
[pre-Glossary repair](./reviews/2026-07-29-pre-glossary-repair-review.md)
closes all five findings as `CLOSED_VERIFIED` in two commits. The language red
gate failed exactly 14 new assertions while 109 prior assertions passed; its
green gate passed 123 tests. The behavior red gate failed only the exact
`Why is this unstable?` regression while 35 other tests passed; its green gate
passed all 36 tests. The cumulative focused gate passed 10 files and 161
tests, and `npm.cmd run verify` passed 73 files and 1,048 tests, both
TypeScript checks, and the 79-module production build. Local deterministic
demo review at 1440×900 and 390×844 confirmed the repaired teaching, solver,
chart, and Tutor language; retained table/summary behavior; corrected unstable
routing; contained responsive layout; visible focus; and no console warning
or error. Production retained eight JavaScript and seven CSS files and the
same normalized 12-static/5-dynamic import graph. The directly affected
existing Convergence and lazy IVP chunks changed by only `-3/-24` and `+126/+2`
raw/deterministic-gzip bytes. Server-only Tutor strings and the bounded
predicate remain outside browser assets; production still contains no Glossary
term, DEV fixture, or ODE binding. Nothing was pushed or deployed.

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
  are complete and locally accepted after repeated independent final review.
  Its generic production registry remains empty and the Playground remains
  excluded from production. The local E2 build composes the accepted registry
  only behind one complete-IVP route binding; the deployed Production baseline
  remains unchanged because nothing was pushed or deployed.
- The private-source-reviewed project-language foundation is approved as
  Version 1 after all nine maintainer decisions were recorded. The Glossary
  catalog and project copy audit are reconciled planning documents, and the
  A–F implementation plan is complete. The four ready Group A
  Platform/overview copy records and Groups B through D are accepted;
  `COPY-003` remains held. The maintainer has accepted the pre-Glossary
  language repair commit and Tutor intent-matching repair commit as
  prerequisite state.
  Group E0 design and content governance is complete and maintainer-approved,
  covering ten revised Wave 1 term cards, ten exact annotation records, and
  eighteen Option A decisions. E1 stopped incomplete before source/test work
  at the confirmed schema mismatch. The Option 2 rich-model design, plan, and
  generic implementation are accepted; the fresh E1 restart is accepted and
  inert at `08b80522283438a233974456a026a6dbc2a96746`. The E2 runtime contract
  is complete and locally implemented through one complete-IVP route-instance
  binding and ten annotations. E2 and the independent E3 review are accepted.
  The first F2 review found two P1 and one P2 blocking findings, and its
  correction remains closed. The fresh F2 review found two additional P1
  findings; both are locally corrected, along with one adjacent P3 `/ode`
  wording drift. The final F2 review's Compare count and governance blockers
  are also locally corrected. All seven known F2 blockers remain closed. The
  final independent F2 review passed with zero P0/P1/P2 findings and is
  pending maintainer acceptance of the F2 review commit.
  `COPY-041`, `COPY-042`, `F2-GLOSSARY-VOICE-001`,
  `BASELINE-EXT-FONT-001`, and `F2-EVIDENCE-001` remain nonblocking open
  items.

Contributor rules:

- Preserve UI/adapters -> project AST/validation/evaluator -> numeric closures -> solvers.
- Do not reorder, sort, flatten, fold, or symbolically simplify AST arithmetic; grouping and child order can affect numerical behavior.
- Do not restore dynamic code execution as compatibility.
- Keep Lab, Tutor, Store, Host, and Router ownership directions intact.
- Keep Home/static routes outside ODE, Tutor, MathLive, and Compute Engine runtime graphs.
- Preserve namespaced history state and unrelated fields.
- Keep `beforeunload` minimal and synchronous.
- Run `npm run verify` after changes and add focused tests first.

*Last updated: 2026-07-30. Project Identity Migration and prior Production
verification remain complete. The Glossary framework is locally accepted as
complete after all three historical blocked-review findings were repaired and
closed by repeated independent final review. No push, Preview deployment, or
Production deployment was authorized or performed for the local Glossary
work.
The generic production registry still contains no Glossary entries or eager
importer, and the deployed Production baseline remains unchanged. The local
E2 build now supplies one route-owned complete-IVP binding and ten explicit
annotations while `/ode` and static pages remain plain. The Playground remains
excluded from production. All nine project-language
decisions are recorded and the terminology, notation, and teaching-voice
standards are approved as Version 1. The catalog and copy audit are reconciled;
Groups A through D are accepted, and the maintainer has accepted both the
pre-Glossary language repair commit and Tutor intent-matching repair commit as
prerequisite state. `COPY-003` plus `src/pages/homePage.ts` remain review-only
and unchanged. Group E0 design and content governance is complete and
maintainer-approved for ten revised Wave 1 terms, ten annotation records, and
eighteen Option A decisions. The historical E1 schema stop was resolved by
the accepted Option 2 rich-model commit
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`. Fresh E1 is locally implemented
and inert with two Core entries, eight ODE entries, two context-only
overrides, and ten composed cards, and is accepted at
`08b80522283438a233974456a026a6dbc2a96746`. The E2 runtime contract is
complete and locally implemented. E2 is accepted for entry into E3. The exact
committed E1+E2 state passed independent E3 review with zero P0/P1/P2 findings
and no product-source change, and E3 is accepted. The first F2 review found two
P1 and one P2 blocking findings, and its accepted correction remains closed.
The fresh F2 review found two additional P1 blockers; both are locally
corrected, with the adjacent `/ode` wording drift normalized in the same
sentence. The final review's Compare count and governance blockers are also
locally corrected. All seven known F2 blockers are closed, but F2 remains
unpassed. The next gate is maintainer acceptance of the final count and
governance correction commit followed by separate authorization of one final
independent F2 rerun. `COPY-041`, `COPY-042`,
`F2-GLOSSARY-VOICE-001`, `BASELINE-EXT-FONT-001`, and
`F2-EVIDENCE-001` remain nonblocking open items. Push, Preview, and
Production remain unauthorized and unperformed.*
