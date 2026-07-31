# F2 Final Count and Governance Corrections Review

## 1. Metadata

- Date: 2026-07-30
- Repository: Numerical T-Lab
- Branch: `main`
- Starting commit: `52a80acec610beea37f6d559b416fcbcd59bedf4`
- Starting commit title: `Close remaining F2 terminology findings`
- Task: Final F2 Count and Governance Repair
- Status: locally implemented and verified; maintainer acceptance and a final
  independent F2 rerun remain required

## 2. Authorization

The maintainer authorized only `F2-COMPARE-COUNT-001` and
`F2-GOV-STATUS-001`, their direct Compare test ownership, the eight-document
Current-State Claim Set, and this review. The work does not pass F2 or
authorize a release, push, Preview deployment, or Production deployment.

## 3. Starting state

The pre-edit gate confirmed `main` at exact commit
`52a80acec610beea37f6d559b416fcbcd59bedf4`, parent
`13efd04d848178380ed80de421f23ef7a6529877`, with a clean worktree. No
reset, stash, amend, rebase, merge, revert, cherry-pick, fetch, pull, push, or
history rewrite occurred.

## 4. Final F2 findings

- `F2-COMPARE-COUNT-001` — Compare labeled the `N + 1` stored-array length as
  `Steps (each)` and called its stored tail rows `Last 12 steps (both
  methods)`.
- `F2-GOV-STATUS-001` — active architecture and governance passages retained
  pre-E2 binding and pre-E3/F2 gate claims.

Both findings were acceptance-blocking before this correction.

## 5. Complete count-semantics sweep

The pre-edit sweep covered Single Output, Compare Output, Convergence Study,
diagnostics, tables, and summary statistics in `src/ode/odeApp.ts`.

- Single Output's `Grid points stored` owns `series.length`, so it correctly
  reports `N + 1`.
- Compare's `Steps (each)` owned `seriesA.length`, which was the reported
  defect.
- Compare's last-12 table renders a subset of stored paired grid points, not
  twelve integration steps.
- Convergence Study's `Step count` owns the actual per-level `stepCount`, so it
  correctly reports `N`.
- `Maximum iterations in one step` and `Failed steps` describe nonlinear
  solver work per actual integration step and remain correct.
- Single's `Last 12 values` does not claim that stored rows are steps.

No second P0/P1/P2 count-semantics defect was found.

## 6. `F2-COMPARE-COUNT-001`

`renderComparisonResult` in `src/ode/odeApp.ts` now labels
`seriesA.length` exactly:

```text
Stored grid points (each)
```

The Compare table heading is now exactly:

```text
Last 12 stored grid points (both methods)
```

The stored arrays, table rows, chart data, solver results, annotations, and
fixed-grid construction were not changed.

## 7. Count-contract tests

The direct rendered-Compare owner is
`src/ode/odeLifecycle.test.ts`, in the test that renders a comparison while
preserving successful-result ownership. The regression uses:

```text
t0 = 0
tEnd = 5
h = 0.2
N = 25 time steps
N + 1 = 26 stored grid points
```

Before the source correction, the focused red gate had 97 passing tests and
one intended failure because `Stored grid points (each)` was absent. Existing
grid and solver assertions stayed green. After the source correction, the
same three-file gate passed all 98 tests. The regression requires the new
label and value `26`, rejects `Steps (each)`, requires the new table heading,
rejects the old heading, and leaves Single's `Grid points stored` contract
intact.

## 8. Seven-blocker closure matrix

| Finding | Final source/test result |
|---|---|
| `F2-TUTOR-NOT-001` | Tutor symbols use `h: fixed time-step size`; `h = Δt` remains absent from the affected branch. |
| `F2-TUTOR-TERM-001` | Zoom wording uses `computed numerical approximation`; the chart title remains `Numerical approximation vs time`. |
| `F2-ABOUT-STATUS-001` | The exact approved current About status remains present and the obsolete status remains absent. |
| `F2-TUTOR-NOT-002` | The live `SYSTEM_PROMPT` uses `uₙ ≈ y(tₙ)`. |
| `F2-ODE-OVERVIEW-TERM-001` | `/ode` uses `computed numerical approximations`. |
| `F2-ODE-OVERVIEW-TERM-002` | The same `/ode` sentence uses `time-step size`. |
| `F2-COMPARE-COUNT-001` | The 25-step deterministic run reports 26 stored grid points, not 26 steps. |

All seven states were rechecked from actual source and direct tests.

## 9. Current-State Claim Set

The complete active-state sweep covered:

- `ARCHITECTURE.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`
- `docs/content/HANDOFF.md`
- `docs/content/GLOSSARY_CATALOG.md`
- `docs/content/PROJECT_COPY_AUDIT.md`
- `docs/content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md`

Claims were classified as historical evidence, current local state, deployed
Production state, or future plan. Historical point-in-time records were not
rewritten.

## 10. `F2-GOV-STATUS-001`

Active current-state passages now agree that E1, E2, and E3 are accepted; F2
has not passed; all seven known blockers are locally corrected; and one final
independent F2 rerun is required. They also agree on ten local cards, ten local
annotation definitions, one complete-IVP route-owned binding, zero `/ode`
bindings, and no Glossary-to-Tutor handoff.

## 11. Local versus deployed state

The corrected documents distinguish the committed local repository from the
public deployed site:

```text
Local: E1/E2/E3 accepted; ten cards; ten annotations; one complete-IVP
binding; all seven known F2 blockers corrected; F2 rerun required.

Deployed: no push, Preview deployment, or Production deployment was
authorized or performed; the public site remains on its previously deployed
commit.
```

Local E2 behavior is not described as deployed.

## 12. ARCHITECTURE updates

The active architecture now states that the static `/ode` overview exposes no
Glossary binding, while `/ode/initial-value-problems` owns one optional
route-instance binding composed from ten approved cards and ten explicit
annotation records. The Platform Host connects only during that route mount,
the surface stays independently lazy, Glossary state stays outside
`AppSessionStore` and ODE sessions, and no Glossary-to-Tutor handoff exists.

## 13. Catalog updates

Only current Wave 1 readiness and gate text changed in
`docs/content/GLOSSARY_CATALOG.md`. It records E1/E2/E3 acceptance and the
pending final F2 rerun. The 197 stable IDs, definitions, ownership, and
approved annotation identities remain unchanged; the other 187 catalog rows
received no content revision.

## 14. Copy-audit updates

The active header and current implementation-order section in
`docs/content/PROJECT_COPY_AUDIT.md` now record accepted E1/E2/E3, both prior
correction commits, this locally complete count/governance correction, and the
required final F2 rerun. `COPY-041` and `COPY-042` remain open.

## 15. Remaining governance updates

`PLAN.md`, `docs/INDEX.md`, both handoffs, and the approval checklist now
point to this correction and the same next gate. The checklist records 186
checked approval/prerequisite/authorization/acceptance/local-completion boxes,
five unchecked execution/deployment boxes, and 31 rollout rows. F2, push,
Preview, and Production gates remain unchecked or explicitly unauthorized.

## 16. Current-state validation matrix

The in-memory validation matrix produced the following common values:

| Field | Required and observed value |
|---|---|
| `e1_status` | `accepted` |
| `e2_status` | `accepted` |
| `e3_status` | `accepted` |
| `f2_status` | `correction_complete_reaudit_required` |
| `local_cards` | `10` |
| `local_annotations` | `10` |
| `local_binding` | `1 complete-IVP route binding` |
| `static_ode_binding` | `0` |
| `tutor_handoff` | `absent` |
| `push_status` | `unauthorized_not_performed` |
| `preview_status` | `unauthorized_not_performed` |
| `production_deployment_status` | `unauthorized_not_performed` |
| `copy_041` | `open` |
| `copy_042` | `open` |

No dedicated tracked documentation/status-validator script exists in the
repository package scripts or tests. The existing repository verification
gate was therefore supplemented by the exact in-memory matrix, active-claim
searches, checklist-count validation, catalog-diff review, and
`git diff --check`.

## 17. Focused verification

Focused post-correction verification passed 11 files and 190 tests:

- Tutor live prompt and deterministic response owners;
- About and `/ode` page owners;
- Compare Output and chart-title lifecycle ownership;
- fixed-grid and solver count contracts;
- Core and ODE rich content;
- ODE Glossary composition and route ownership;
- production-empty generic registry.

Application typecheck, API typecheck, and `git diff --check` passed.

## 18. Full verification

`npm.cmd run verify` passed:

- 76 test files;
- 1,098 tests;
- application TypeScript;
- API TypeScript;
- an 86-module production build.

The only build warning was the accepted deferred large-chunk warning.

## 19. Context-sensitive searches

Final searches confirmed:

- Compare contains `Stored grid points (each)` and the corrected last-12
  heading;
- Compare no longer contains either obsolete step label;
- the deterministic contract demonstrates 25 steps and 26 stored points;
- active architecture no longer says the IVP route omits its binding or that
  the surface cannot be requested;
- active catalog/copy-audit state no longer says E2 awaits acceptance or E3 is
  unauthorized;
- the final independent F2 rerun remains explicitly required.

Historical point-in-time statements were retained where their historical
scope is explicit.

## 20. Browser evidence

A fresh production build was reviewed through a bounded preview bound to
`127.0.0.1:4173`.

At both exact `1440×900` and `390×844` viewports:

- a deterministic Forward Euler versus Backward Euler comparison at
  `t0 = 0`, `tEnd = 5`, and `h = 0.2` displayed
  `Stored grid points (each) = 26`;
- the table heading was `Last 12 stored grid points (both methods)`;
- neither obsolete step label appeared;
- Compare remained Glossary-plain;
- Single retained `Grid points stored = 26`;
- `/ode` remained unannotated;
- About retained the exact approved current status;
- no numerical value or workflow changed;
- no horizontal overflow or correction-attributable console warning/error
  appeared.

The preview PID was captured, the review was time-bounded, cleanup ran, and
port `4173` had no listener afterward. No Tutor request was submitted.

## 21. Network evidence

No correction-introduced external traffic was observed. The asset inventory
showed the unchanged Google Fonts stylesheet request to
`fonts.googleapis.com`; `fonts.gstatic.com` remained the only additionally
permitted direct font-resource host but was not observed in this run. No other
external host appeared. This correction adds no fetch, XHR, beacon,
WebSocket, or network owner.

## 22. Explicit non-changes

No Glossary card content, annotation, binding ownership, E2 Runtime Contract,
generic Framework, Tutor, About page, `/ode` overview, solver, grid
construction, Store/session/persistence, CSS, package, lockfile,
configuration, deployment, or `index.html` change occurred. Numerical arrays
and `seriesA.length` were preserved.

## 23. COPY-041

`COPY-041` remains open. `Standard label:` was not changed.

## 24. COPY-042

`COPY-042` remains open. `Click or press Enter for more.` and the missing
opened-details announcement were not changed.

## 25. F2-GLOSSARY-VOICE-001

The packet-approved `Wave 1` wording remains a nonblocking P3 item and was not
modified.

## 26. BASELINE-EXT-FONT-001

The pre-existing Google Fonts dependency remains an accepted nonblocking P3
Platform/asset-policy carry-forward. No font remediation occurred.

## 27. Findings

- P0: 0
- P1: 0 remaining after the authorized correction
- P2: 0 remaining after the authorized correction
- New P3: 0
- Known open carry-forwards: `COPY-041`, `COPY-042`,
  `F2-GLOSSARY-VOICE-001`, `BASELINE-EXT-FONT-001`, and
  `F2-EVIDENCE-001`

## 28. Verdict

**ALL KNOWN F2 BLOCKING FINDINGS CORRECTED — FINAL INDEPENDENT REVIEW REQUIRED**

## 29. Final F2 status

F2 remains unpassed. Maintainer acceptance of this correction commit and
separate authorization are required before one final independent F2 rerun.
Push, Preview deployment, Production deployment, and release remain
unauthorized.
