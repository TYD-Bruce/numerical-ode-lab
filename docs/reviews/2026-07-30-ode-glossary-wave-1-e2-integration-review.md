# ODE Glossary Wave 1 E2 Integration Review

**Date:** 2026-07-30

**Group:** E2 — Contract Implementation

**Starting branch:** `main`

**Starting HEAD:** `93a2338d9572e633c8955fc657746f337e34264d`
(`Reconcile ODE Glossary E2 runtime contract`)

**Accepted E1 commit:**
`08b80522283438a233974456a026a6dbc2a96746`

**Verdict:** **E2 ODE GLOSSARY INTEGRATED — READY FOR MAINTAINER ACCEPTANCE**

## 1. Scope and accepted authorities

E1 is maintainer-accepted. The accepted
[E2 Runtime Contract](../content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
controls the exact annotation owners, visible copy, DOM composition, state
and mode visibility, replacement, disposal, accessibility, and direct test
ownership. The approved
[Wave 1 Content Packet](../content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md)
continues to control the ten cards and their mathematical content. No E1 card
content or generic Glossary contract was revised.

This E2 implementation activates Wave 1 only in the complete Initial Value
Problems route. It creates ten annotation definitions and one route-instance
ODE binding. `/ode`, Home, and static pages remain unannotated. Tutor handoff
remains absent.

## 2. Implementation owners

| Owner | E2 responsibility |
|---|---|
| `src/ode/odeGlossary.ts` | ODE-owned two-Core/eight-ODE/two-override composition, ten annotation mappings, four scope IDs, route-local binding, scope-rerender transactions, trigger creation, and disposal |
| `src/ode/odeApp.ts` | Explicit Context, Method, Data, and Output DOM construction at the accepted source owners |
| `src/ode/initialValueProblemsRoute.ts` | Exposes the mounted route's optional Glossary binding port |
| `src/style.css` | Narrow helper, companion-trigger, and mini-heading layout |
| `src/ode/odeGlossary.test.ts` | Direct contract owner for all ten records, rejected duplicates, replacement, mode transitions, reset, and disposal |
| `src/ode/initialValueProblemsRoute.test.ts` | Route-instance binding identity and complete-route integration |

The ODE-owned composition contains exactly two Core entries, eight ODE
entries, two ODE context-only overrides, and ten resolved cards.
`implicit_scheme` is not registered and is not a live related-term link.

## 3. Ten annotation records

| Annotation | Term | Scope | Exact visible trigger | Runtime owner and visibility |
|---|---|---|---|---|
| `ODE-W1-ANN-001` | `ordinary_differential_equation` | Context | `ordinary differential equation` | Exact route lede on every complete-IVP render |
| `ODE-W1-ANN-002` | `initial_value_problem` | Context | `initial value problem` | Exact route lede on every complete-IVP render |
| `ODE-W1-ANN-003` | `initial_condition` | Data | `Initial condition` | First-order Single Data companion outside the native label/input |
| `ODE-W1-ANN-004` | `step_size` | Data | `Time-step size` | Single and Compare Data companion outside the native label/input |
| `ODE-W1-ANN-005` | `time_grid` | Data | `time grid` | Exact helper after the interval/time-step controls |
| `ODE-W1-ANN-006` | `numerical_approximation` | Output | `Final numerical approximation` | Successful Single Output stat label only |
| `ODE-W1-ANN-007` | `exact_solution` | Data | `Exact solution` | First-order Single mini-heading outside the checkbox label and editable MathLive |
| `ODE-W1-ANN-008` | `explicit_scheme` | Method | `Explicit scheme` | Exact Method helper outside every method-selection button |
| `ODE-W1-ANN-009` | `forward_euler_method` | Data | `Forward Euler` | Selected Forward Euler Single Data heading only |
| `ODE-W1-ANN-010` | `backward_euler_method` | Data | `Backward Euler` | Selected Backward Euler Single Data heading only |

There are ten definitions and ten mappings, not ten simultaneous triggers.
The route title, breadcrumb, later prose occurrences, `/ode`, unselected
method cards, native labels, editable MathLive, formulas, charts, tables,
diagnostics, Convergence, Compare Output, and Tutor text remain plain.

## 4. Binding, rerender, and disposal ownership

Each mounted complete-IVP route creates one fresh ODE-owned
`LabGlossaryBinding`. No global mutable active binding exists. Every full
route render begins transactions for:

```text
ode_wave1_context
ode_wave1_method
ode_wave1_data
ode_wave1_output
```

The Context, Method, and Data transactions commit after their explicitly
owned DOM is constructed. Output commits after the current result-generation
microtask mounts its eligible summary. Stale or failed queued work aborts its
uncommitted transaction. Replacement transfer is possible only for the same
annotation ID recreated in the same scope; omitted terms close their card and
release their old handle.

The existing platform teardown order remains:

```text
Platform Glossary Host close
→ Platform Glossary Host disconnect
→ mounted ODE application disposal
→ ODE transactions, scopes, binding, and triggers dispose
→ route DOM clear
```

Glossary state remains transient and does not enter the ODE session,
`AppSessionStore`, numerical output, history state, or meaningful-work logic.

## 5. Context and Method behavior

The complete-IVP lede is exactly:

> Explore fixed-step methods for a first-order ordinary differential equation
> posed as an initial value problem, then analyze numerical error, observed
> convergence, and method behavior as the time-step size changes.

It contains exactly the two approved Context triggers. The route title,
breadcrumb, later occurrences, and `/ode` remain plain.

`E2-CONTRACT-01` is implemented exactly:

> Explicit scheme: the next numerical approximation is computed directly
> from quantities already known before the update.

Only `Explicit scheme` is interactive. The helper is a sibling after the
Method action bar and before the active method grid, outside all
method-selection buttons. No nested method-card control was added.

## 6. Data behavior

The Data owner implements the six approved records:
`ODE-W1-ANN-003`, `004`, `005`, `007`, `009`, and `010`.

- `Initial condition` and `Time-step size` are companion controls outside
  their native labels and inputs.
- The helper copy is exactly: “The current fixed-step time grid includes the
  aligned start and end times.”
- `Exact solution` is a separate mini-heading before the unchanged checkbox
  label and outside its editable MathLive host.
- Only the selected Forward Euler or Backward Euler heading is interactive.
  Switching methods commits an exact replacement and leaves no stale trigger
  or active card.
- Compare Data contains only the Context, step-size, and time-grid triggers;
  its two method choices remain plain.

## 7. Output behavior

`E2-CONTRACT-02` is implemented as the accepted Single-only contract:

- Single before success has no `ODE-W1-ANN-006`.
- Successful Single Output has exactly one
  `Final numerical approximation` trigger.
- A failed Single rerun retains the previous successful result. Data contains
  no hidden Output trigger, and `Return to current output` explicitly
  recreates it.
- Single to Compare disposes `ODE-W1-ANN-006` and closes its active card.
- Compare Output remains plain, including both method-specific final-value
  labels and values.
- Compare to Single recreates the annotation only when a successful Single
  summary exists.
- Clear, New experiment, and route disposal remove the annotation.

There is no Single-to-Compare Output annotation transfer and no invented
Compare heading.

## 8. Accessibility, rich cards, and Tutor boundary

Every trigger is a native button with the accepted visible text as its stable
accessible name. No trigger is nested in a method button or native label, and
no trigger is created inside editable MathLive or readonly formula content.
Desktop compact/pinned surfaces and the mobile modal sheet continue to be
owned by the accepted generic framework.

The composed rich cards expose their accepted full definition, intuition,
why-it-matters text, safe readonly formula and accessible text, assumptions
and limits, misconception and correction, module note, and related-term
navigation. `implicit_scheme` remains plain future text. No Ask Tutor action,
Tutor queue, Tutor API handoff, or second surface was added.

## 9. Tests and verification

Tests were added before the runtime owner. The direct red run failed only
because `src/ode/odeGlossary.ts` and the route binding port did not yet exist.
The unchanged E1 and generic Glossary tests remained green at 65 tests in
seven files.

Final evidence:

| Gate | Result |
|---|---|
| Direct E2 focused run | 13 files, 136 tests passed |
| ODE route/lifecycle run | 5 files, 35 tests passed |
| Application typecheck | Passed |
| API typecheck | Passed |
| `npm.cmd run verify` | 76 files, 1,094 tests; both typechecks and production build passed |
| Production build | 86 modules transformed; only the accepted deferred large-chunk warning |
| `git diff --check` | Passed |

The direct tests cover every annotation ID, term ID, scope, source owner,
visible trigger, DOM composition, mode, replacement, disposal, accessible
name, and rejected duplicate. Existing lifecycle tests continue to prove
failed-run result preservation, session behavior, New experiment, and route
cleanup. Numerical and session contracts remain unchanged.

## 10. Browser evidence

A fresh production build was reviewed through a bounded preview server bound
to `127.0.0.1`. The launcher, preview process, and watchdog PIDs were captured;
the server was stopped in `finally`; port `4173` had no listener afterward.

At exactly `1440×900`:

- `/`, `/about`, and `/ode` had no Wave 1 trigger.
- `/ode/initial-value-problems` matched the Context, Method, Data, and Output
  contracts.
- Rich cards opened, complete details rendered, and related-term navigation
  worked.
- Forward-to-Backward selected-heading replacement left no stale trigger or
  card.
- Successful Single Output created one `ODE-W1-ANN-006`; entering Compare
  removed it and closed its card.
- Compare Output retained plain Forward Euler and Runge–Kutta 4 final-value
  labels.
- `/__dev/glossary-playground` rendered Page Not Found in the production
  build.
- There was no Ask Tutor action, horizontal overflow, console warning, or
  console error.

At exactly `390×844`:

- Method and Data contained the expected trigger sets with no nested
  label/MathLive control and no horizontal overflow.
- Opening a term created one named modal mobile sheet.
- The sheet contained the approved rich content and no Ask Tutor action.

The browser session already completed before governance updates. No source,
test, style, or build-input change followed it, so the accepted evidence was
not repeated.

## 11. Production graph and bundle evidence

The application entry retains the existing dynamic import of the complete IVP
route. The new import edges are confined to that route:

```text
src/app/moduleRegistry.ts
→ dynamic src/ode/initialValueProblemsRoute.ts
→ src/ode/odeApp.ts
→ src/ode/odeGlossary.ts
→ inert Core and ODE Wave 1 content
```

Entry/Home/static pages do not import Wave 1 content, create a binding, or
eagerly load the Glossary surface. `/ode` remains unbound. The generic surface
chunk remains separately lazy, and Tutor remains independent.

| Artifact | Accepted starting build | E2 build |
|---|---:|---:|
| Entry JavaScript | 52,815 B | 52,815 B |
| Entry CSS | 9,518 B | 9,518 B |
| Complete-IVP JavaScript | 242,024 B | 290,571 B |
| Complete-IVP JavaScript gzip | 80.39 kB | 93.02 kB |
| Complete-IVP CSS | 11,636 B | 11,930 B |
| Complete-IVP CSS gzip | 3.11 kB | 3.19 kB |
| Glossary surface JavaScript | 10,132 B | 10,132 B |
| Glossary surface CSS | 3,640 B | 3,640 B |
| Production inventory | 8 JS / 7 CSS / 19 fonts | 8 JS / 7 CSS / 19 fonts |

Wave 1 card and annotation markers occur only in the complete-IVP route
chunk. No DEV or private marker entered production. The route delta is
48,547 B raw JavaScript, 12.63 kB gzip JavaScript, 294 B raw CSS, and 0.08 kB
gzip CSS. No package, lockfile, configuration, or entry-document change was
made.

## 12. Network evidence and carry-forward

**No E2-introduced external traffic.**

The permitted pre-existing chain is limited to the unchanged Google Fonts
declarations in `index.html`:

| Host | Category/type | Initiator | Starting-HEAD owner | E2 owner change |
|---|---|---|---|---|
| `fonts.googleapis.com` | Font stylesheet / link stylesheet | Unchanged `index.html` link | Present | None |
| `fonts.gstatic.com` | Font resources referenced by that stylesheet | Permitted Google Fonts stylesheet chain | Present | None |

The fresh resource inventory independently observed the Google Fonts
stylesheet and no other external host; cached font resources were not
separately reissued in that inventory. The accepted baseline evidence covers
the direct `fonts.gstatic.com` font-resource chain. E2 source owners contain
no `fetch`, XHR, beacon, or WebSocket request. Therefore:

```text
new external host introduced by E2 = 0
new external request owner introduced by E2 = 0
E2 fetch/XHR/beacon/WebSocket request = 0
```

The starting and current `index.html` blobs are both
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`.

`BASELINE-EXT-FONT-001` remains a P3 accepted nonblocking carry-forward owned
by a future Platform/asset-policy review. A browser may disclose normal
request metadata such as IP address and user agent to the font provider. E2
did not introduce or alter the dependency, and Glossary correctness does not
depend on it. Local- or system-font remediation is a separate future decision;
none was performed here. This E2 exception is not blanket approval for future
releases.

## 13. Explicit non-changes

E2 did not change:

- the ten approved cards or their Core/ODE source modules;
- the generic model, builders, registry, resolver, scope, surface, or
  Platform Host;
- `/ode`, Home, or static-page annotation behavior;
- Tutor, Store, session, persistence, history, meaningful-work, numerical,
  formula, MathLive, or API behavior;
- `index.html`, packages, lockfiles, configuration, deployment, or remotes.

No DOM scanning, inferred occurrence replacement, eleventh term, second
surface, Tutor action, push, Preview deployment, or Production deployment was
introduced.

## 14. Findings and next gate

| Severity | Result |
|---|---|
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |
| P3 | `BASELINE-EXT-FONT-001`, accepted nonblocking pre-existing carry-forward |

E2 is locally implemented and verified, pending maintainer acceptance. It is
not marked maintainer-accepted by this review. E3 and Group F2 execution
remain unauthorized. Nothing was pushed or deployed.

## 15. Verdict

**E2 ODE GLOSSARY INTEGRATED — READY FOR MAINTAINER ACCEPTANCE**

E2 has implemented the accepted canonical runtime contract through one
ODE-owned complete-IVP binding and ten explicit annotation records. The
Method helper and Single-only Output behavior match E2-CONTRACT-01 and
E2-CONTRACT-02. No content revision, Framework redesign, Tutor handoff, push,
or deployment occurred. E3 remains unauthorized. The next gate is maintainer
acceptance of this E2 commit followed by a separately authorized independent
E3 review of the exact committed state.
