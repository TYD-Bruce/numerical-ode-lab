# ODE Glossary Wave 1 E3 Integration Review

**Date:** 2026-07-30

**Group:** E3 — Independent Integration Review

**Audit branch:** `main`

**Audit target:** `8c8e90a6abc177132f3e033bdb575f2042b982a9`
(`Integrate ODE Glossary Wave 1`)

**Accepted parent:** `93a2338d9572e633c8955fc657746f337e34264d`
(`Reconcile ODE Glossary E2 runtime contract`)

**Accepted E1 commit:**
`08b80522283438a233974456a026a6dbc2a96746`
(`Add reviewed ODE Glossary Wave 1 content`)

**Verdict:** **E3 INTEGRATION REVIEW PASSED — READY FOR F2 AUTHORIZATION**

## 1. Independent scope and authorities

This review independently audited the exact committed E1+E2 integration. It
did not treat the E2 implementation report as proof. The authority order was:

1. the
   [E2 Runtime Contract](../content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
   for interaction details, annotation owners, copy, modes, lifecycle,
   accessibility, and rejected sites;
2. the
   [Wave 1 Content Packet](../content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md)
   for mathematical and teaching content;
3. the accepted generic Glossary Framework and rich-model contracts for
   bindings, scopes, surfaces, focus, navigation, modal behavior, and
   disposal; and
4. the committed source as evidence of the implementation.

`E2-CONTRACT-01` and `E2-CONTRACT-02` control over superseded design wording.
No E1 content, generic Glossary contract, source, test, or style was changed
during E3.

The E2 commit contains exactly the expected 14 tracked paths:

```text
src/ode/odeGlossary.ts
src/ode/odeGlossary.test.ts
src/ode/odeApp.ts
src/ode/initialValueProblemsRoute.ts
src/ode/initialValueProblemsRoute.test.ts
src/style.css
docs/reviews/2026-07-30-ode-glossary-wave-1-e2-integration-review.md
PLAN.md
docs/INDEX.md
docs/PROJECT_HANDOFF.md
docs/content/HANDOFF.md
docs/content/PROJECT_COPY_AUDIT.md
docs/content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md
docs/content/GLOSSARY_CATALOG.md
```

The accepted content files `src/glossary/coreGlossary.ts` and
`src/ode/odeGlossaryContent.ts` are byte-identical to the E2 parent. No generic
Framework, Platform Host, Tutor, package, lockfile, configuration, deployment,
or `index.html` file occurs in the E2 diff.

## 2. Registry, binding, and ownership

The committed ODE composition contains:

```text
Core entries            = 2
ODE complete entries     = 8
ODE overrides            = 2
Composed cards           = 10
Annotation definitions   = 10
Binding per route mount  = 1
/ode bindings            = 0
```

The ten resolved cards retain their approved teaching order.
`implicit_scheme` has no entry and no live relation. There is no second
registry, duplicate card, text scan, inferred occurrence, or module-global
active binding.

Each `mountOdeApp` instance calls the ODE-owned integration owner and receives
one fresh route-local binding. The complete-IVP route exposes that binding
through the existing optional route port. Entry, Home, static routes, and
`/ode` do not import or expose the integration.

The ownership chain is:

```text
complete-IVP route mount
→ ODE-owned Glossary integration
→ optional route binding port
→ Platform Glossary Host
→ one active Glossary surface
```

Glossary state remains transient. No E2 Glossary state enters
`AppSessionStore`, an ODE session, History API state, browser storage, Tutor
state, numerical output, meaningful-work logic, or a network owner.

## 3. Ten annotation records

The direct source and tests match every canonical record:

| Annotation | Term | Scope | Source owner | Exact trigger and active state |
|---|---|---|---|---|
| `ODE-W1-ANN-001` | `ordinary_differential_equation` | `ode_wave1_context` | `DEFAULT_LEDE`; `mountOdeApp.render` | `ordinary differential equation`; every complete-IVP render |
| `ODE-W1-ANN-002` | `initial_value_problem` | `ode_wave1_context` | `DEFAULT_LEDE`; `mountOdeApp.render` | `initial value problem`; every complete-IVP render |
| `ODE-W1-ANN-003` | `initial_condition` | `ode_wave1_data` | `mountOdeApp.renderForm` | `Initial condition`; first-order Single Data only |
| `ODE-W1-ANN-004` | `step_size` | `ode_wave1_data` | `mountOdeApp.renderForm`; `renderCompareForm` | `Time-step size`; current Single or Compare Data form |
| `ODE-W1-ANN-005` | `time_grid` | `ode_wave1_data` | `mountOdeApp.renderForm`; `renderCompareForm` | `time grid`; current Single or Compare Data helper |
| `ODE-W1-ANN-006` | `numerical_approximation` | `ode_wave1_output` | `mountOdeApp.mountResults` | `Final numerical approximation`; successful Single Output only |
| `ODE-W1-ANN-007` | `exact_solution` | `ode_wave1_data` | `mountOdeApp.renderForm` | `Exact solution`; first-order Single Data only |
| `ODE-W1-ANN-008` | `explicit_scheme` | `ode_wave1_method` | `mountOdeApp.renderChoosePanel` | `Explicit scheme`; Single and Compare-pick Method states |
| `ODE-W1-ANN-009` | `forward_euler_method` | `ode_wave1_data` | `mountOdeApp.renderForm` | `Forward Euler`; selected Forward Euler Single Data heading |
| `ODE-W1-ANN-010` | `backward_euler_method` | `ode_wave1_data` | `mountOdeApp.renderForm` | `Backward Euler`; selected Backward Euler Single Data heading |

Each trigger receives its exact visible text as its accessible name. The direct
E2 test owner covers IDs, term mappings, scopes, DOM composition, modes,
replacement, disposal, names, and rejected duplicates. No eleventh definition
or duplicate active owner exists.

## 4. Context and Method contract

The Context lede is exact:

> Explore fixed-step methods for a first-order ordinary differential equation
> posed as an initial value problem, then analyze numerical error, observed
> convergence, and method behavior as the time-step size changes.

Only `ordinary differential equation` and `initial value problem` are
interactive. The route title, breadcrumb, `/ode`, and later occurrences remain
plain.

`E2-CONTRACT-01` is exact:

> Explicit scheme: the next numerical approximation is computed directly from
> quantities already known before the update.

Only `Explicit scheme` is interactive. The remainder is plain text. The helper
is outside every method-selection button and introduces no nested control or
change to method-selection semantics.

## 5. Data contract

All six Data records match their canonical owners:

- `Initial condition` is a separate sibling after the unchanged native label
  and input.
- `Time-step size` uses one annotation ID in the currently rendered Single or
  Compare form; the sibling trigger stays outside the label and input.
- The helper is exactly `The current fixed-step time grid includes the aligned
  start and end times.` Only `time grid` is interactive.
- `Exact solution` is a standalone mini-heading outside the checkbox label and
  editable MathLive host.
- Only the selected Forward Euler or Backward Euler Data heading is
  interactive.
- Switching the selected method releases the old heading handle before the
  replacement becomes active. Compare headings stay plain.

Native label focus ownership, input behavior, method selection, field caret
and selection, parsing, validation, and virtual-keyboard behavior remain
unchanged.

## 6. Single-only Output contract

The implementation matches `E2-CONTRACT-02`:

```text
Single before success:
  no ODE-W1-ANN-006

Single after success:
  exactly one ODE-W1-ANN-006 on "Final numerical approximation"

Failed Single rerun retaining the successful result:
  no hidden trigger while Data is visible
  "Return to current output" explicitly recreates ODE-W1-ANN-006

Single → Compare:
  ODE-W1-ANN-006 is disposed
  its active card is closed
  Compare Output remains plain

Compare → Single:
  recreate only when a successful Single summary is mounted

Clear / New experiment / route disposal:
  remove ODE-W1-ANN-006
```

No Compare summary was invented. Neither method-specific Compare result label
is annotated. Chart, legend, values, table, diagnostics, and repeated Output
copy remain plain.

## 7. Accessibility, MathLive, rich cards, and Tutor

Source, tests, and browser review confirm:

- no trigger is nested in a native label, method-card button, input, editable
  MathLive host, or readonly formula renderer;
- trigger names equal their exact visible labels;
- native button Enter and Space behavior is retained;
- Escape, modal containment, dismissal, and focus restoration remain owned by
  the accepted Platform Host/surface;
- related navigation stays in one surface, focuses the card heading, and a
  one-level Back returns focus to the previous heading;
- the mobile presentation is one named `role="dialog"` bottom sheet with
  `aria-modal="true"`, initial close-control focus, scroll lock, and no
  horizontal overflow;
- accepted E1 rich sections render without source rewriting;
- `implicit_scheme` is plain, nonfocusable future text;
- no Ask Tutor control, handoff injector, Tutor queue, transcript change,
  request, or API mutation exists.

The compact preview and complete rich-card surface remain generic and lazy.
No second surface owner was introduced.

## 8. Rerender and disposal lifecycle

The route owns four explicit scopes:

```text
ode_wave1_context
ode_wave1_method
ode_wave1_data
ode_wave1_output
```

Every full render begins all four transactions before replacing owned DOM.
Context, Method, and Data commit after explicit DOM construction. Output
commits after the eligible result-generation microtask. A stale or failed
queued render aborts its transaction. The Framework reconnects only the same
term/annotation mapping in the same scope; omitted terms release stale
handles and close an active card when required.

Direct and regression evidence covers Context rerender, Method-to-Data,
Forward-to-Backward replacement, Single-to-Compare, Compare-to-Single,
successful-result retention after a failed rerun, Return to current output,
clear, New experiment, route leave, and route return.

The actual teardown order is:

```text
Platform Glossary Host close
→ Platform Glossary Host disconnect
→ mounted ODE application disposal
→ ODE transaction, scope, binding, and trigger disposal
→ route DOM clear
```

The mounted Lab DOM is disposed rather than hidden. No global mutable runtime
or retained E2 document listener exists.

## 9. Style-scope audit

The E2 CSS diff adds only:

```text
.ode-method-glossary-helper
.field-glossary-companion
.field-glossary-companion > .glossary-term-trigger
.ode-exact-solution-glossary-heading
```

These selectors are limited to ODE companion/helper/heading layout. No broad
global element selector, unrelated Platform/Home/About/Tutor/chart/table/input
or MathLive rule, color or typography redesign, or forced-color regression was
introduced. Visible focus remains owned by the existing Glossary trigger
styles. Exact desktop and mobile review found safe wrapping and no horizontal
overflow.

## 10. Fresh automated verification

The independent focused run included the E2 direct and route owners plus ODE
lifecycle, New experiment, session, starter, numerical/grid, Glossary
binding/scope/surface/Host/modal, editable/readonly math, and production
lazy-loading regressions.

| Gate | Fresh E3 result |
|---|---|
| Focused integration/regression run | 19 files, 235 tests passed |
| Application typecheck | Passed |
| API typecheck | Passed |
| `npm.cmd run verify` | 76 files, 1,094 tests passed; both typechecks and production build passed |
| Production build | 86 modules transformed |
| Build warning | Only the accepted deferred large-chunk warning |
| `git diff --check HEAD^ HEAD` | Passed |

No test was weakened, skipped, or changed. No source change followed these
checks.

## 11. Production graph and bundle evidence

A fresh manifest-enabled production build produced:

```text
production modules = 86
JavaScript files   = 8
CSS files          = 7
font files         = 19
static edges       = 12
unique dynamic edges = 5
```

The normalized dynamic ownership remains:

```text
entry → complete-IVP route
entry → Tutor
entry → Glossary surface
complete-IVP route → editable math
readonly math → MathLive
```

The E2 integration path is confined to:

```text
src/app/moduleRegistry.ts
→ dynamic src/ode/initialValueProblemsRoute.ts
→ src/ode/odeApp.ts
→ src/ode/odeGlossary.ts
→ accepted Core and ODE Wave 1 content
```

| Artifact | Raw bytes | Deterministic gzip bytes |
|---|---:|---:|
| Entry JavaScript | 52,815 | 16,277 |
| Complete-IVP JavaScript | 290,571 | 92,860 |
| Complete-IVP CSS | 11,930 | 3,183 |
| Glossary surface JavaScript | 10,132 | 3,491 |
| Glossary surface CSS | 3,640 | 1,103 |
| Tutor JavaScript | 11,705 | 4,442 |

Entry/Home/static pages have no Wave 1 import, binding, or eager surface.
`/ode` has no binding or annotation. The complete-IVP lazy route owns the
ten-card registry, one route binding, and all ten annotation definitions. The
Glossary surface and Tutor remain independently lazy.

`ODE-W1-ANN-*` markers occur only in the complete-IVP chunk. Wave 1 stable IDs
are confined to that ownership path; generic/pre-existing state names such as
`exact_solution` do not constitute Wave 1 annotation markers. DEV fixture,
Playground, private-reference, and `.env.local` markers are absent from the
production artifacts.

## 12. Independent browser and network evidence

A fresh committed production build was reviewed through a preview server
bound to `127.0.0.1`. The launcher, listener, and watchdog PIDs were captured,
the audit was bounded, all browser tabs were finalized, the processes were
stopped in cleanup, and port `4173` had no listener afterward.

At exactly `1440×900`, independent review covered:

- `/`, `/about`, and `/ode`: no Wave 1 trigger or surface;
- `/__dev/glossary-playground`: in-shell Page Not Found;
- exact Context and Method copy and trigger ownership;
- all Data companions, helper, selected headings, and rejected nested sites;
- Forward-to-Backward replacement with no stale trigger;
- no Output trigger before a successful Single run;
- one successful Single Output trigger;
- a failed rerun retaining the successful result and explicit recreation on
  `Return to current output`;
- Single-to-Compare card closure and trigger disposal;
- plain Compare Output and correct Compare-to-Single behavior;
- New experiment cleanup;
- complete rich sections, related navigation, Back, and focus restoration;
- plain, nonfocusable `implicit_scheme`;
- no Tutor action, stale route surface, console warning/error attributable to
  E2, or horizontal overflow.

At exactly `390×844`, Home, About, `/ode`, the production DEV rejection, and
the complete-IVP route remained free of horizontal overflow. The IVP route
opened one modal mobile bottom sheet, rendered the approved rich sections,
kept `implicit_scheme` plain, preserved related navigation and Back focus,
restored trigger focus on Escape, and exposed no Ask Tutor action. Visual
inspection confirmed safe helper/card wrapping and sheet scrolling.

**No E2-introduced external traffic.**

The browser asset inventory observed the unchanged Google Fonts stylesheet
from `fonts.googleapis.com`, initiated by the existing `index.html` link.
Cached `fonts.gstatic.com` font resources were not separately reissued in this
session; that host remains permitted only for font resources referenced by
the accepted stylesheet chain. No other external host appeared. E2-owned
source contains no fetch, XHR, beacon, WebSocket, or EventSource request.

```text
new external host introduced by E2 = 0
new external request owner introduced by E2 = 0
E2 fetch/XHR/beacon/WebSocket request = 0
```

The parent, audit target, and current `index.html` blob remain
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`.

`BASELINE-EXT-FONT-001` remains a P3 accepted nonblocking carry-forward owned
by a future Platform/asset-policy review. Normal request metadata such as IP
address and user agent may be disclosed to the font provider. E1/E2 did not
introduce or alter this dependency, Glossary correctness does not require it,
and no remediation was performed. Local- or system-font replacement remains a
separate future decision; this carry-forward is not blanket approval for a
future release.

## 13. Governance audit

Before E3 documentation, governance consistently recorded E1 as accepted, the
E2 contract as accepted, E2 as locally implemented and committed pending
maintainer acceptance, one complete-IVP binding, ten local annotations,
unannotated `/ode`, no Tutor handoff, E3 as the mandatory next gate, and F2,
push, Preview, and Production as unauthorized.

The current maintainer instruction accepts E2 for entry into E3 and authorizes
this independent review. Passing E3 is recorded as locally complete pending
maintainer acceptance. F2 remains separately gated and unauthorized. Nothing
was pushed or deployed.

`COPY-041` and `COPY-042` remain `REQUIRES_CONTENT_WAVE` because their exact
definitions concern future generic-surface wording. Neither was marked
complete merely because E2 exists.

## 14. Findings

| Classification | Result |
|---|---|
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |
| P3 implementation findings | 0 |
| Accepted baseline carry-forwards | `BASELINE-EXT-FONT-001` — P3 — accepted nonblocking carry-forward |

The baseline font dependency is not an E2 source defect and does not block
E3. No separately authorized implementation repair is required.

## 15. E3 documentation and explicit non-changes

E3 creates this review and narrowly updates:

```text
PLAN.md
docs/INDEX.md
docs/PROJECT_HANDOFF.md
docs/content/HANDOFF.md
docs/content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md
```

E3 changes no product source, tests, styles, content packet, Runtime Contract,
catalog, copy audit, generic Framework, Platform Host, Tutor, Store, session,
Router, numerical behavior, package, lockfile, configuration, deployment, or
`index.html`. It performs no F2 work, push, Preview deployment, or Production
deployment.

## 16. Verdict and next gate

**E3 INTEGRATION REVIEW PASSED — READY FOR F2 AUTHORIZATION**

The exact committed E1+E2 ODE Glossary integration has passed the mandatory
independent E3 review. E3 introduced no product-source change. F2 remains
unauthorized. The next gate is maintainer acceptance of the E3 review commit
and separate authorization of the mandatory F2 cross-surface consistency
review.
