# F2 Final Terminology Corrections Review

## 1. Metadata

- Date: 2026-07-30
- Task: F2 Final Terminology Correction
- Starting branch: `main`
- Starting HEAD: `13efd04d848178380ed80de421f23ef7a6529877`
- Starting commit: `Repair F2 cross-surface consistency`
- Starting parent: `dd7f4c9dc479878c8400d74a2350605d7e4fa29a`
- Starting worktree: clean

## 2. Authorization

The maintainer authorized corrections for `F2-TUTOR-NOT-002` and
`F2-ODE-OVERVIEW-TERM-001`, plus the adjacent
`F2-ODE-OVERVIEW-TERM-002` wording normalization. Product changes were limited
to `api/chatHandler.ts` and `src/pages/odeOverviewPage.ts`; their direct test
owners are `api/chatPrompt.test.ts` and `src/pages/pages.test.ts`.

No fresh F2 review, push, Preview deployment, or Production deployment was
authorized.

## 3. Starting state

The branch, HEAD, parent, commit, clean status, recent history, commit stat,
and configured remotes matched the required starting state. No reset, stash,
amend, rebase, merge, revert, cherry-pick, fetch, pull, push, or history
rewrite occurred.

## 4. Fresh F2 findings

- `F2-TUTOR-NOT-002` (P1): the live `SYSTEM_PROMPT` used `uₙ ≈ yₙ`, making
  exact/reference notation ambiguous.
- `F2-ODE-OVERVIEW-TERM-001` (P1): `/ode` called numerical approximations
  “solution curves.”
- `F2-ODE-OVERVIEW-TERM-002` (P3): the same `/ode` sentence used bare “step
  size” instead of “time-step size.”

## 5. Complete pre-edit closure sweep

All five historical F2 blockers and both current source owners were inspected
before editing:

- `F2-TUTOR-NOT-001` remained closed in `api/chatHandler.ts`: the variables
  branch used `h: fixed time-step size`, and `h = Δt` was absent.
- `F2-TUTOR-TERM-001` remained closed: the zoom reply used “computed numerical
  approximation,” emitted no replacement title, and `src/ode/odeApp.ts`
  preserved the ODE-owned title `Numerical approximation vs time`.
- `F2-ABOUT-STATUS-001` remained closed in `src/pages/aboutPage.ts`: the exact
  approved current status was present and the obsolete pre-content status was
  absent.
- `F2-TUTOR-NOT-002` was confirmed in the live `SYSTEM_PROMPT`.
- `F2-ODE-OVERVIEW-TERM-001` and the adjacent
  `F2-ODE-OVERVIEW-TERM-002` were confirmed in the one `/ode` feature-card
  sentence.

No new P0/P1/P2 issue outside the authorized owners was found.

## 6. `F2-TUTOR-NOT-002`

The live `SYSTEM_PROMPT` notation line at `api/chatHandler.ts:21` now reads
exactly:

```text
uₙ ≈ y(tₙ), fₙ = f(tₙ, uₙ)
```

`uₙ` remains the numerical approximation, the exact/reference value uses
function notation, and the established `fₙ` definition is unchanged. No Tutor
API behavior or deterministic mock-response branch changed, and no remote
Tutor request was issued.

## 7. `F2-ODE-OVERVIEW-TERM-001`

The complete feature-card sentence at `src/pages/odeOverviewPage.ts:31` now
reads exactly:

```text
Compare numerical methods, inspect their computed numerical approximations, and study how error changes as the time-step size is refined.
```

It no longer calls numerical results “solution curves.” The remainder of the
overview page, its routing, and its zero-Glossary-binding ownership are
unchanged.

## 8. `F2-ODE-OVERVIEW-TERM-002`

The same approved replacement sentence changes “as the step size is refined”
to “as the time-step size is refined.” No terminology or notation standard was
edited.

## 9. Five-blocker closure matrix

| Finding | Required final result | Evidence |
|---|---|---|
| `F2-TUTOR-NOT-001` | `h: fixed time-step size`; no `Δt` | Source branch and direct mock-response regression remain green |
| `F2-TUTOR-TERM-001` | Numerical-approximation zoom wording; title preserved | Source/action trace, Tutor tests, ODE lifecycle test, and browser run |
| `F2-ABOUT-STATUS-001` | Exact approved About status | Source, direct page regression, and desktop/mobile browser review |
| `F2-TUTOR-NOT-002` | `uₙ ≈ y(tₙ)` in live `SYSTEM_PROMPT` | Exact source and direct prompt regression |
| `F2-ODE-OVERVIEW-TERM-001` | Computed numerical approximations on `/ode` | Exact source, direct page regression, build artifact, and desktop/mobile browser review |

`F2-ODE-OVERVIEW-TERM-002` is also closed through the same exact `/ode`
sentence.

## 10. Exact source owners

- `api/chatHandler.ts` owns the live server `SYSTEM_PROMPT` used as the
  Responses API instruction payload.
- `src/pages/odeOverviewPage.ts` owns the public `/ode` feature-card sentence.

No other product source changed.

## 11. Exact direct test owners

- `api/chatPrompt.test.ts:66` reads the exported live `SYSTEM_PROMPT`, requires
  `uₙ ≈ y(tₙ), fₙ = f(tₙ, uₙ)`, and rejects `uₙ ≈ yₙ`.
- `src/pages/pages.test.ts:66` requires the exact replacement `/ode` sentence
  and rejects both obsolete phrases.
- Existing `api/chatHandler.test.ts` and `src/ode/odeLifecycle.test.ts`
  continue to own the prior symbols, zoom, bounds, and chart-title
  regressions.
- The existing About assertion in `src/pages/pages.test.ts` remains intact.

## 12. Tests-first red gate

Before the source corrections, the unchanged direct owners passed 12 baseline
tests. After adding the new expectations and before source edits, the direct
run produced exactly two intended failing tests and 11 passing tests:

- live `SYSTEM_PROMPT` still contained `uₙ ≈ yₙ`;
- `/ode` still contained “inspect solution curves” and bare “step size” in
  the asserted sentence.

No unrelated baseline assertion failed.

## 13. Focused verification

The four required direct owners passed 61 tests:

- `api/chatPrompt.test.ts`: 6
- `api/chatHandler.test.ts`: 33
- `src/pages/pages.test.ts`: 7
- `src/ode/odeLifecycle.test.ts`: 15

A broader Tutor, prompt/context, mock-response, ODE chart ownership, page,
language, lazy-boundary, and production-exclusion run passed 13 files and 122
tests. Application typecheck, API typecheck, and `git diff --check` passed.

## 14. Full verification

`npm.cmd run verify` passed from the final source/test state:

- 76 test files;
- 1,098 tests;
- application typecheck;
- API typecheck;
- fresh production build with 86 modules.

The only warning was the accepted deferred chunk-size warning. No source or
test file changed afterward.

## 15. Source/artifact searches

Context-sensitive searches confirmed:

- live `SYSTEM_PROMPT`: `uₙ ≈ y(tₙ)` present; `uₙ ≈ yₙ` absent;
- variables branch: `h: fixed time-step size` present; `h = Δt` absent;
- zoom reply: “computed numerical approximation” present; “inspect the
  solution” and `Solution on [...]` absent;
- About: exact approved replacement present; obsolete status absent;
- `/ode`: exact computed-numerical-approximations/time-step sentence present;
  both obsolete phrases absent.

The built entry artifact `dist/assets/index-jo6kZIwN.js` contains the corrected
`/ode` and About copy and excludes their obsolete variants. The server-only
`SYSTEM_PROMPT` is intentionally outside browser artifacts and is covered by
its source-direct API test. Legitimate uses such as “exact solution” and
“solution of an IVP” were not treated as defects.

## 16. Browser evidence

A fresh verified production build was served only on `127.0.0.1` with a
captured PID, watchdog timeout, explicit cleanup, and closed-port proof.

- At exact `1440×900`, `/ode` displayed the exact new sentence, excluded both
  obsolete phrases, exposed zero Glossary triggers, and had no document
  horizontal overflow. `/about` retained the exact approved status.
- At exact `390×844`, the same `/ode` and About checks passed, the IVP route
  rendered without horizontal overflow, and `/ode` still exposed zero
  Glossary triggers.
- A local Forward Euler run displayed `Final numerical approximation` and the
  canvas title `Numerical approximation vs time`.
- No remote Tutor request was made. The prompt correction was verified by
  source and direct tests.
- No correction-attributable console warning or error was observed.

Port `4173` was closed after review.

## 17. Network evidence

No correction-introduced external traffic was observed. The direct production
page asset inventory contained local production assets plus the unchanged
`fonts.googleapis.com` stylesheet declaration. No additional external host,
fetch, XHR, beacon, or WebSocket owner was introduced by these corrections.
`fonts.gstatic.com` remains permitted only as the pre-existing direct font
resource chain when requested; it did not appear as a separate asset in this
review inventory.

## 18. Explicit non-changes

No Glossary entry, annotation, binding, framework, card content, Tutor API
behavior, numerical algorithm, Store/session/persistence behavior, package,
lockfile, configuration, deployment file, style, or `index.html` changed. No
push or deployment occurred, and the next F2 review did not begin.

## 19. `F2-GLOSSARY-VOICE-001`

Status: P3, packet-approved, nonblocking, not modified. The
`explicit_scheme` module note mentioning Wave 1 remains maintainer-approved
content.

## 20. `COPY-041`

Open and unchanged. `Standard label:` remains unchanged.

## 21. `COPY-042`

Open and unchanged. `Click or press Enter for more.` remains unchanged, and no
opened-details announcement was added.

## 22. `BASELINE-EXT-FONT-001`

P3 accepted nonblocking carry-forward, owned by a future Platform/asset-policy
review. The unchanged Google Fonts dependency was neither approved for all
future releases nor remediated here.

## 23. Findings

- P0: 0
- P1: 0 remaining among the five known historical blockers
- P2: 0 remaining among the five known historical blockers
- P3 implementation findings: 0
- Open nonblocking items: `F2-GLOSSARY-VOICE-001`, `COPY-041`, `COPY-042`,
  and `BASELINE-EXT-FONT-001`

## 24. Verdict

**ALL KNOWN F2 BLOCKING CONSISTENCY FINDINGS CORRECTED — READY FOR MAINTAINER ACCEPTANCE**

## 25. Fresh F2 status

This correction does not itself pass F2. A new full independent F2 review of
the exact committed corrected state has not run and requires separate
authorization. Push, Preview deployment, and Production deployment remain
unauthorized.
