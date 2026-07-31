# F2 Cross-Surface Blocking Corrections Review

## 1. Metadata

**Date:** 2026-07-30

**Task:** F2 Blocking Findings — Narrow Correction

**Branch:** `main`

**Starting HEAD:** `dd7f4c9dc479878c8400d74a2350605d7e4fa29a`
(`Review ODE Glossary Wave 1 integration`)

**Verdict:** **F2 BLOCKING CONSISTENCY FINDINGS CORRECTED — READY FOR
MAINTAINER ACCEPTANCE**

## 2. Authorization

The maintainer authorized correction of exactly:

```text
F2-TUTOR-NOT-001
F2-TUTOR-TERM-001
F2-ABOUT-STATUS-001
```

The task did not reopen E1, E2, E3, the approved Wave 1 content, the E2
Runtime Contract, the generic Glossary Framework, annotations, or bindings.
It did not authorize a fresh F2 review, push, Preview deployment, or Production
deployment.

## 3. Starting state

The correction began only after confirming:

```text
branch   = main
HEAD     = dd7f4c9dc479878c8400d74a2350605d7e4fa29a
worktree = clean
```

The starting commit was the documentation-only E3 review commit. Its parent
was exact E2 integration commit
`8c8e90a6abc177132f3e033bdb575f2042b982a9`. E1, E2, and E3 remain accepted
prerequisite state for this repair.

## 4. F2 findings addressed

| Finding | Starting defect | Correction owner | Final status |
|---|---|---|---|
| `F2-TUTOR-NOT-001` | Variables reply introduced `h = Δt` | `api/chatHandler.ts` · `buildMockResponse` | Corrected and directly verified |
| `F2-TUTOR-TERM-001` | Zoom reply and instruction named the numerical curve `Solution`; ODE applied Tutor-owned title text | `api/chatHandler.ts` · `buildMockResponse`; `src/ode/odeApp.ts` · `applyTutorChartInstruction` | Corrected and directly verified |
| `F2-ABOUT-STATUS-001` | About said no production terms or definitions were published | `src/pages/aboutPage.ts` · `createAboutPage` | Corrected and directly verified |

## 5. F2-CORR-01

The deterministic variables/symbols branch now contains exactly:

```text
h: fixed time-step size
```

In the rendered response, the current value follows in parentheses. The branch
does not introduce `Δt`, does not define `h` as an alias, and preserves the
existing list structure and all other symbol explanations.

## 6. F2-CORR-02

The deterministic zoom explanation now says:

```text
computed numerical approximation
```

It no longer names the numerical curve with bare `solution`. Its
`zoom_range` instruction contains only:

```text
type
tMin
tMax
```

The ODE-owned `applyTutorChartInstruction` updates only the existing x-axis
bounds and calls the existing chart update. It no longer reads or applies
`instruction.title` for `zoom_range`.

The shared `ChartInstruction.title` field remains available for backward
compatibility with existing non-zoom instructions such as the unchanged
`error_table` response and possible controlled provider responses. The ODE
chart deliberately ignores that legacy field for `zoom_range`; no action type
or API schema redesign was performed. The canonical title continues to be
owned by `mountOdeApp.chartOptions`:

```text
Numerical approximation vs time
```

## 7. F2-CORR-03

The About Teaching pillar now uses the exact approved replacement:

> Reviewed Glossary terms and definitions are currently available only in the
> complete Initial Value Problems Lab. The Numerical ODE overview and other
> routes remain unannotated, and no Glossary-to-Tutor handoff is available.

The remainder of the About page is unchanged.

## 8. Exact source owners

| File | Symbol | Ownership retained |
|---|---|---|
| `api/chatHandler.ts` | `buildMockResponse` variables branch | Deterministic Tutor symbols language |
| `api/chatHandler.ts` | `buildMockResponse` zoom branch | Deterministic Tutor zoom reply and bounds-only action |
| `src/ode/odeApp.ts` | `applyTutorChartInstruction` | ODE chart mutation and title ownership |
| `src/ode/odeApp.ts` | `chartOptions` | Canonical chart title |
| `src/pages/aboutPage.ts` | `createAboutPage` | Public About composition |

The complete caller sweep also confirmed the unchanged path:

```text
handleChatRequest
→ controlled chartInstruction response
→ platformTutorPanel
→ LabTutorBinding.applyChartInstruction
→ createOdeTutorBinding
→ mountOdeApp.applyTutorChartInstruction
```

## 9. Exact test owners

Before modifying each test, its direct source ownership was established:

| Test file | Affected source symbol |
|---|---|
| `api/chatHandler.test.ts` | `buildMockResponse` variables and zoom branches |
| `src/ode/odeLifecycle.test.ts` | `mountOdeApp.applyTutorChartInstruction` and `chartOptions` |
| `src/pages/pages.test.ts` | `createAboutPage` |

The new direct assertions prove:

- the actual variables branch uses `h: fixed time-step size` and excludes
  `Δt`;
- the actual zoom branch uses `computed numerical approximation`, emits no
  `Solution on ...` title, and returns only the requested bounds;
- a legacy incoming zoom title is ignored while both bounds change and the
  chart title remains byte-for-byte identical;
- closing a locally mounted Platform Tutor Host leaves the chart title
  byte-for-byte identical and unambiguous;
- chart disposal does not introduce an ambiguous title;
- the exact About sentence is present and the obsolete statement is absent.

Existing table and summary tests continue to prove that non-zoom Tutor
instructions retain their prior response and action shape.

## 10. Tests-first red gate

The untouched direct baseline first passed:

```text
3 files
52 tests
```

After adding only the new test assertions, the direct red run produced:

```text
4 intended new failures
51 prior assertions passed
```

The four failures were exactly:

1. variables still emitted `h = Δt: step size`;
2. zoom reply lacked `computed numerical approximation`;
3. ODE applied the incoming `Solution on [0.25, 0.75]` title;
4. About still contained the obsolete framework-ready/no-content statement.

No unrelated baseline test failed.

## 11. Focused verification

The final direct gate passed:

```text
3 files
55 tests
```

The broader focused correction gate passed:

```text
13 files
129 tests
```

It covered the direct owners plus the Tutor prompt and rendering boundaries,
ODE binding and route lifecycle, Convergence terminology, Platform Tutor Host,
Tutor lazy loading, pages, and production route-bundle ownership.

Application typecheck, API typecheck, and `git diff --check` also passed.

## 12. Full verification

`npm.cmd run verify` passed from the final product-source state:

```text
76 test files
1,097 tests
application typecheck passed
API typecheck passed
production build passed
86 modules transformed
```

The only build warning was the accepted deferred large-chunk warning. No
product source changed after this full gate.

## 13. Browser evidence

A fresh production build was served only from `127.0.0.1:4173` by a captured
Node PID with a separate watchdog and strict total timeout. Browser review
used exact viewports:

```text
1440 × 900
390 × 844
```

At both sizes:

- `/about` displayed the exact approved sentence and excluded the obsolete
  sentence;
- `/ode/initial-value-problems` retained its existing Wave 1 behavior and had
  no horizontal page overflow;
- a normal Forward Euler run retained the chart-owned title
  `Numerical approximation vs time`;
- opening and closing Tutor without submitting a request left the chart and
  result intact;
- no new UI or Glossary behavior appeared;
- no correction-attributable console warning or error appeared.

The browser-accessible application has no local UI fixture that injects a
Tutor `zoom_range` instruction without sending a Tutor request. Therefore the
actual bounds mutation and title-preservation behavior is owned by the direct
`odeLifecycle.test.ts` action test. No remote or local Tutor request was sent
during browser review.

The preview and watchdog were stopped in cleanup. Port `4173` had no listener
afterward.

## 14. Network evidence

**No correction-introduced external traffic.**

The observed external asset was only the existing
`fonts.googleapis.com` stylesheet initiated by the unchanged `index.html`
link. `fonts.gstatic.com` remains permitted only for the stylesheet's direct
font-resource chain and was not separately reissued in the captured
inventory. No other external host appeared.

No Tutor request, fetch, XHR, beacon, WebSocket, or EventSource was initiated
by the correction review.

## 15. Source and artifact searches

Final context-sensitive searches established:

```text
affected Tutor symbols branch contains Δt                 = no
affected zoom response contains "inspect the solution"   = no
affected zoom response emits "Solution on ..."            = no
zoom application changes chart title                     = no
obsolete About status sentence                           = no
exact new About sentence in source                       = yes
exact new About sentence in production entry artifact    = yes
```

Legitimate phrases such as `exact solution` remain unchanged. Server-only
deterministic Tutor strings are not emitted into the browser bundle; their
final response shapes are proven by the direct API handler tests. The API
TypeScript build is a no-emit typecheck, so there is no separate committed
server artifact to scan.

The baseline and current `index.html` blobs are identical:

```text
912cca340efa743ea0d2ceaa2dac7e0234a889bc
```

## 16. Explicit non-changes

The correction changes no:

- Glossary card content, registry, annotation, binding, surface, or Framework
  source;
- E2 Runtime Contract or Content Packet;
- numerical method, formula, coefficient, grid rule, solver, error metric,
  Convergence rule, or session result;
- Tutor network call, provider contract, transcript, request lifecycle,
  Store, session, persistence, or Router behavior;
- CSS, package, lockfile, configuration, deployment, or `index.html`;
- push, Preview deployment, or Production deployment state.

## 17. Out-of-scope COPY-041 and COPY-042

`COPY-041` and `COPY-042` remain open `REQUIRES_CONTENT_WAVE` records.

This correction deliberately leaves unchanged:

```text
Standard label:
Click or press Enter for more.
```

It does not add the deferred opened-details announcement.

## 18. Google Fonts carry-forward

`BASELINE-EXT-FONT-001` remains an accepted nonblocking P3 carry-forward owned
by a future Platform/asset-policy review. This repair neither approves it for
future releases nor remediates it.

## 19. Findings

```text
P0 = 0
P1 = 0 unresolved in the authorized correction scope
P2 = 0 unresolved in the authorized correction scope
P3 implementation findings = 0
```

Accepted nonblocking carry-forwards:

- `COPY-041`;
- `COPY-042`;
- `BASELINE-EXT-FONT-001`.

## 20. Verdict

**F2 BLOCKING CONSISTENCY FINDINGS CORRECTED — READY FOR MAINTAINER
ACCEPTANCE**

## 21. Fresh F2 status

This correction review does not pass F2. The three blocking findings from the
first F2 review are locally corrected pending maintainer acceptance. A fresh
independent F2 re-review of the exact correction commit has not run and
requires a separate maintainer gate.

Push, Preview deployment, and Production deployment remain unauthorized.
