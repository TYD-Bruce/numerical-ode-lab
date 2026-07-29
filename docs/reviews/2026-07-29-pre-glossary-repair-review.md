# Pre-Glossary Repair Review

## 1. Metadata

- Date: 2026-07-29
- Task type: narrow pre-E language and deterministic-behavior repair
- Starting branch: `main`
- Starting HEAD: `697d6eee2b0e3d744ba4be34a118c799dfc7bcf9`
- Commit 1: `55db8e717c517f90d08911e4324c77c50c3d854f` —
  `Repair pre-Glossary language inconsistencies`
- Commit 2 boundary: `Fix deterministic Tutor intent matching`
- Finding authority:
  [Pre-Glossary Project-Language Consistency Review](2026-07-29-pre-glossary-project-language-consistency-review.md)
- Standards authority: Project Language Standard Version 1
- Verdict: **PRE-E REPAIR COMPLETE — GROUP E MAY BE PLANNED**
- Runtime impact: approved copy literals plus one bounded deterministic/demo
  intent predicate
- Production Glossary impact: none
- Remote/deployment impact: none

This verdict closes the five accepted Group F1 P2 findings locally. It does
not authorize Group E, production Glossary content, annotations, or an ODE
Glossary binding.

## 2. Starting state

The task began on clean local `main` at the expected HEAD
`697d6eee2b0e3d744ba4be34a118c799dfc7bcf9`, whose latest commit was
`Complete pre-Glossary language consistency review`. The accepted Group F1
review existed, all five P2 findings were open, production Glossary entries
were absent, the ODE route exposed no Glossary binding, and no other agent was
writing.

The exact owners, current literals or predicate, approved replacements, direct
tests, numerical contracts, deterministic fallback order, chart ownership,
and production lazy boundaries were inventoried before editing. No finding was
stale and no owner had moved.

## 3. Two-commit boundary

Commit 1 contains only the four approved language repairs and their direct
tests:

- production owners: `src/convergenceTeaching.ts`, `src/solvers.ts`,
  `api/chatHandler.ts`, and `src/ode/odeApp.ts`;
- direct tests: `src/convergenceTeaching.test.ts`, `src/solvers.test.ts`,
  `api/chatHandler.test.ts`, and `src/ode/odeLifecycle.test.ts`.

Commit 1 does not contain the bounded intent predicate. Its production changes
are string/copy-only.

Commit 2 contains only:

- the bounded table/summary predicate in `api/chatHandler.ts`;
- its exact regressions in `api/chatHandler.test.ts`;
- this review and the five authorized status-document updates.

No third commit, amendment, branch, worktree, push, fetch, pull, or deployment
is part of this repair.

## 4. `F1-LANG-001` repair

Owner: `src/convergenceTeaching.ts`,
`buildConvergenceTeachingSections`.

The stale learner-facing `Measured order`, `primary measured maximum-error
order`, `maximum-error order`, and metric-name `maximum error` aliases were
replaced only where they named the accepted concepts. The final direct
explanation is:

> Observed order can differ from the theoretical order before the experiment
> reaches the asymptotic region or when other numerical effects influence the
> error data.

Available evidence now reports:

> The theoretical order is 4, while the primary observed order based on
> maximum global error is 3.995.

Unavailable evidence now reports:

> The theoretical order is 4, but no primary reliable observed order based on
> maximum global error is available.

The eight-section teaching order, formulas, numerical interpolation, and valid
measured-data language such as `parallel measured and reference slopes` remain
unchanged. Focused tests cover the approved phrases, stale-phrase absence,
formula identity, section count, and order.

Status: `CLOSED_VERIFIED`.

## 5. `F1-LANG-002` repair

Owner: `src/solvers.ts`.

The integer validation now reads exactly:

> The theoretical order p must be an integer.

The method explanation now reads exactly, with the existing order value
interpolated for `p`:

> Under the usual regularity and stability assumptions, the method has
> theoretical order p, so its nodal error is O(h^p).

The validation branch, allowed order values, method metadata, formulas,
coefficients, startup behavior, and all solver calculations remain unchanged.
Focused tests retain the existing validation and metadata checks while
asserting the exact new language.

Status: `CLOSED_VERIFIED`.

## 6. `F1-LANG-003` repair

Owner: `api/chatHandler.ts`, `buildMockResponse`.

The deterministic/demo replies now use:

- `theoretical order p`;
- `primary interpretation based on maximum global error`;
- `primary maximum-global-error evidence status`; and
- `primary observed order based on maximum global error`.

Branch conditions, ordering, evidence availability, supplied numerical values,
grounding interpolation, request/response shape, and real-provider behavior
remain unchanged in Commit 1. API and prompt tests verify the final terms and
the unchanged numerical grounding.

Status: `CLOSED_VERIFIED`.

## 7. `F1-LANG-004` repair

Owners: `src/ode/odeApp.ts` and `api/chatHandler.ts`.

The ODE chart title is now exactly:

> Numerical approximation vs time

The deterministic Tutor graph reply begins:

> The chart shows the numerical approximation uₙ versus t ...

The graph reply still explains the computed curve and states that rapid growth
or oscillation can motivate an absolute-stability check while the plot alone
does not prove instability or accuracy. Chart data, axes, series, points,
rendering, final values, and the graph branch remain unchanged.

Status: `CLOSED_VERIFIED`.

## 8. `F1-BEH-001` repair

Owner: `api/chatHandler.ts`, `buildMockResponse`.

The prior predicate was:

```typescript
q.includes("table") || q.includes("summary")
```

It treated the letters `table` inside `unstable` as table intent. The final
predicate is:

```typescript
/\btable\b/.test(q) || /\bsummary\b/.test(q)
```

The exact prompt `Why is this unstable?` previously returned the existing
`Table summary for Forward Euler on the current IVP:` response and an
`error_table` chart instruction with title `Mock result summary` and the
supplied Forward Euler rows. After the repair it follows the existing fallback:

> You asked about “Why is this unstable?” for Forward Euler.
>
> Context from this run: y′ = -1000y; h = 0.1; 11 points; final u ≈ 0.001000
> at t = 1.000000.
>
> The method metadata reports theoretical order p = 1 for this run.

The repaired unstable response remains status 200 with `demoMode: true` and no
`chartInstruction`. `Show me the table.` and `Give me a summary.` still return
the existing table-summary message and the unchanged `error_table` shape:
`Mock result summary`, `{t: 1, u: 0.001, method: "Forward Euler"}`, and
`{h: 0.1, points: 11, family: "forward_euler"}`.

No stability branch, broad parser, provider-path change, API/schema change, or
new reply was added.

Status: `CLOSED_VERIFIED`.

## 9. Focused tests

Tests-first evidence:

- language red gate: 6 files, 123 tests; exactly the 14 newly added language
  assertions failed and the other 109 tests passed;
- language green gate: the same 6 files and all 123 tests passed;
- behavior red gate: 2 files, 36 tests; only the exact unstable-prompt
  regression failed and the other 35 tests passed;
- behavior green gate: both files and all 36 tests passed;
- cumulative focused gate: 10 files and 161 tests passed.

The cumulative gate covered Convergence teaching, solvers, deterministic and
prompt API behavior, the IVP route and lifecycle, Convergence view behavior,
ODE Tutor grounding, Platform Tutor ownership, and Tutor lazy loading. Both
application and API TypeScript checks passed.

## 10. Full verification

`npm.cmd run verify` passed from the final source state:

- 73 test files passed;
- 1,048 tests passed;
- application typecheck passed;
- API typecheck passed;
- production build passed with 79 transformed modules;
- the only build warning was the accepted deferred large-chunk warning.

All focused and full checks used the existing installed dependencies. No
package installation or update occurred. `git diff --check` also passed at
each commit boundary and after the cumulative source repair.

## 11. Browser/demo evidence

A fresh isolated localhost tab used only the deterministic/demo Tutor API and
the app on `127.0.0.1`. The helper API was explicitly bound to
`127.0.0.1:3001`, forced `AI_TUTOR_MOCK=true`, and did not load `.env.local`.
The app was explicitly bound to `127.0.0.1:5173`. Both ports were closed after
the review.

At approximately 1440×900 and 390×844:

- `/ode` and `/ode/initial-value-problems` had no page-level horizontal
  overflow;
- route focus was visible;
- Forward Euler retained theoretical order 1, its formula, 26 stored points,
  final time `5.000000`, and final numerical approximation `0.00377789`;
- the chart visibly read `Numerical approximation vs time`;
- the current three-level Convergence Study retained maximum global error,
  theoretical order 1, primary observed order 1.031, its formulas, and the
  `Observed order is consistent with theory` classification;
- the expanded teaching disclosures showed the exact asymptotic-region
  sentence, maximum-global-error wording, observed/theoretical distinction,
  unchanged formulas, and valid measured/reference-slope wording;
- the Tutor reported theoretical order 1, current supplied
  maximum-global-error evidence, `numerical approximation uₙ`, and the
  unchanged plot limitations;
- genuine table and summary prompts retained the table response;
- `Why is this unstable?` returned the existing grounded fallback and no table
  summary;
- the desktop Tutor remained an internally scrolling panel;
- the mobile Tutor remained a contained named dialog with body scroll lock,
  visible close-button focus, internal transcript scrolling, and focus
  restoration to `Open AI Tutor`;
- no task-caused console warning or error appeared.

The rare integer-order validation path and the generic order-description
literal were not forced through unsafe browser input. Their exact behavior is
covered by the focused direct-owner tests. No real provider, model, API key, or
external Tutor request was used.

## 12. Production/static evidence

The baseline and final production inventories both contain:

- 8 JavaScript files;
- 7 CSS files;
- the same normalized 12 static import edges;
- the same 5 unique dynamic import edges.

The directly affected existing browser chunks changed only by bounded string
deltas:

| Existing chunk owner | Baseline raw/gzip | Final raw/gzip | Delta |
|---|---:|---:|---:|
| `convergenceStudyState` | 58,885 / 17,475 | 58,882 / 17,451 | -3 / -24 |
| `initialValueProblemsRoute` | 241,898 / 80,391 | 242,024 / 80,393 | +126 / +2 |

Entry raw and gzip size remained exactly 52,815 / 16,329 bytes. Other raw
chunk sizes were unchanged; small deterministic-gzip differences in
hash-referencing chunks came from changed imported filenames.

The chart and Convergence copy remain in their existing lazy owners. Tutor and
Glossary surface runtimes remain lazy. Server-only Tutor responses and the
bounded intent predicate do not occur in browser JavaScript. The production
assets contain no DEV Glossary fixture or Playground marker. The core
Glossary registry remains an empty frozen array, and the ODE route still
exposes no `getGlossaryBinding`.

No new browser chunk, dynamic import, entry/Home ownership, dependency, or
network integration was introduced.

## 13. Structural and numerical non-change

For Commit 1, string-insensitive AST/source fingerprints matched before and
after for all four production owners:

- `src/convergenceTeaching.ts`: 1,214 structural items;
- `src/solvers.ts`: 5,213 structural items;
- `api/chatHandler.ts`: 4,720 structural items;
- `src/ode/odeApp.ts`: 15,233 structural items.

The audit normalized only the authorized solver validation conversion from a
template literal to the exact static string. Imports, exports, signatures,
branches, conditions, operators, numeric literals, object fields, formulas,
chart data, solver metadata, and response shapes otherwise matched.

Commit 2 changes only the accepted table/summary predicate. Direct diff,
focused regressions, cumulative tests, and full verification confirm no change
to solver calculations, order values, method options, chart values,
Convergence metrics or classifications, Tutor grounding values, provider or
model selection, API schema, response shape, requests, sessions, aborts,
queues, transcript ownership, panels, modals, focus, lazy loading, or
persistence.

## 14. Remaining active terminology scan

The four repaired production owners contain zero active occurrences of:

- `primary measured maximum-error order`;
- `maximum-error order`;
- `order of accuracy p`;
- `primary maximum-error interpretation`;
- `primary maximum-error status`;
- `primary maximum-error observed order`;
- `Numerical solution vs time`;
- `The chart shows the numerical solution uₙ`; and
- learner-facing `Measured order`.

Valid measured-data wording remains: the deterministic Convergence graph reply
still uses `measured-error slope`, and Convergence teaching still uses
`parallel measured and reference slopes`.

No additional terminology cleanup was performed.

## 15. Findings closure table

| Finding | Severity | Owner | Status |
|---|---:|---|---|
| `F1-LANG-001` | P2 | `src/convergenceTeaching.ts` | `CLOSED_VERIFIED` |
| `F1-LANG-002` | P2 | `src/solvers.ts` | `CLOSED_VERIFIED` |
| `F1-LANG-003` | P2 | `api/chatHandler.ts` | `CLOSED_VERIFIED` |
| `F1-LANG-004` | P2 | `src/ode/odeApp.ts`, `api/chatHandler.ts` | `CLOSED_VERIFIED` |
| `F1-BEH-001` | P2 | `api/chatHandler.ts` | `CLOSED_VERIFIED` |

Remaining pre-E findings: `P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 0`.

## 16. Explicit non-changes

This repair does not implement or authorize:

- Group E or Group F2;
- a production Glossary term, definition, formula, annotation, Tutor card,
  queue, or ODE binding;
- a new Tutor branch, parser, provider, model, request, response, session,
  abort, transcript, panel, modal, or lazy-loading behavior;
- a numerical method, formula, coefficient, grid rule, tolerance,
  classification, chart-data change, preset, or option;
- persistence, package, dependency, configuration, branch, worktree, remote,
  push, preview, or deployment work.

Accepted Groups A–D and the Group F1 `COPY-043` implementation are otherwise
unchanged. The accepted Group F1 review remains historical evidence and was
not edited.

## 17. Group E planning readiness

The five pre-E repairs are locally complete and verified. Group E remains
unauthorized. It may be planned only after maintainer acceptance of both
repair commits, followed by a separate Production Glossary Wave 1 design and
content authorization. Planning readiness is not implementation authority.

## 18. F2 carry-forward

Group F2 remains mandatory after Group E. It must repeat the final
cross-surface language and behavior review against the actual approved
production Glossary integration. Nothing in this repair satisfies or starts
that post-Glossary gate.
