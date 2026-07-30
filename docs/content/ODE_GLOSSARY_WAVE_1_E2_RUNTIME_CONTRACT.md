# ODE Glossary Wave 1 E2 Runtime Contract

**Status:** Complete implementation contract; E2 source implementation requires
fresh maintainer reauthorization.

**Date:** 2026-07-30

**Authority:** This document is the sole implementation authority for ODE
Glossary Wave 1 E2 interaction details. The content packet and design retain
authority for the accepted ten-card content, term ownership, exclusions, and
rollout gates. When their historical interaction wording differs from this
contract, this contract controls E2.

**Runtime impact of this document:** None. E1 is accepted at
`08b80522283438a233974456a026a6dbc2a96746`; E2 source and test implementation
has not begun.

## 1. Maintainer amendments

### E2-CONTRACT-01 — Exact Method helper

The complete visible sentence is:

> Explicit scheme: the next numerical approximation is computed directly from
> quantities already known before the update.

Its DOM composition is one noninteractive helper paragraph containing, in
order:

1. the interactive trigger `Explicit scheme`;
2. the plain text `: the next numerical approximation is computed directly
   from quantities already known before the update.`

`mountOdeApp.renderChoosePanel` owns the helper. It is inserted after the
current Method action bar and immediately before the active method-selection
grid. It is outside every method-selection button.

### E2-CONTRACT-02 — Compare Output policy

`ODE-W1-ANN-006` belongs only to the successful Single-result summary label
`Final numerical approximation`. Compare Output remains plain in Wave 1. No
`ODE-W1-ANN-006` trigger is created or transferred in Compare mode.

This amendment supersedes the D11 sentence that said Single and Compare used
explicit owner transfer. The ten approved annotation record definitions
remain unchanged in number; their visible triggers are conditional on the
current state and mode.

## 2. Shared runtime ownership

E2 creates `src/ode/odeGlossary.ts` as the ODE-owned composition and
route-instance runtime owner. The immutable registry composes:

- the two accepted Core entries;
- the eight accepted ODE entries;
- the two accepted ODE context overrides;
- exactly ten resolved ODE cards in the accepted teaching order.

Each `mountOdeApp` instance creates one `LabGlossaryBinding` for module `ode`
and exposes it through the existing optional `getGlossaryBinding()` route
port. The complete IVP route is the only route that exposes this binding.
`/ode` remains unannotated and has no binding.

The mounted route owns four scope IDs:

```text
ode_wave1_context
ode_wave1_method
ode_wave1_data
ode_wave1_output
```

Every full `mountOdeApp.render()` starts one
`LabGlossaryBinding.beginScopeRerender` transaction for each scope before the
old route DOM is replaced. New triggers are created explicitly through the
replacement transaction's `scope.createTerm`; E2 performs no text scan or
first-match lookup.

The context, Method, and Data transactions commit after their owned DOM is
constructed. Output mounting currently runs in a queued microtask, so the
Output transaction commits only after the current generation mounts its
result summary and creates any eligible trigger. A stale or failed render
aborts every uncommitted transaction. An inactive scope commits with no term,
which closes any active card formerly owned by that scope.

Replacement transfer is allowed only when the framework finds the same term
ID in the same scope's explicitly constructed replacement generation.
Changing scope, omitting the term, switching mode, clearing output, or
disposing the route closes the card and releases the old trigger. No hidden
DOM or stale trigger is retained.

The existing route teardown order remains:

```text
Platform Glossary Host close
→ Platform Glossary Host disconnect
→ mounted ODE application disposal
→ ODE binding, scopes, transactions, and trigger disposal
→ route DOM clear
```

Glossary state remains transient. It does not enter the ODE session,
`AppSessionStore`, History state, Resume state, Tutor state, or browser
storage.

## 3. Annotation records

All records use route `/ode/initial-value-problems`, exact file
`src/ode/odeApp.ts`, and direct test owner `src/ode/odeGlossary.test.ts`.
Every trigger is the native text-like button returned by
`GlossaryScopeController.createTerm`, so its accessible name is its exact
visible trigger text.

### ODE-W1-ANN-001

- **Annotation ID:** `ODE-W1-ANN-001`
- **Term ID:** `ordinary_differential_equation`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_context`
- **Source symbol/owner:** `DEFAULT_LEDE` and `mountOdeApp.render`
- **Trigger text:** `ordinary differential equation`
- **Accessible name:** `ordinary differential equation`
- **Complete composition:** plain `Explore fixed-step methods for a
  first-order `; trigger `ordinary differential equation`; plain ` posed as
  an `; `ODE-W1-ANN-002`; plain `, then analyze numerical error, observed
  convergence, and method behavior as the time-step size changes.`
- **Visible state/mode:** Every Method, Data, and Output render in Single,
  Compare-pick, and Compare modes.
- **Single/Compare behavior:** Identical context trigger in both modes.
- **Rerender behavior:** Recreated in every Context transaction.
- **Replacement behavior:** The same scope and term ID permit exact framework
  transfer.
- **Disposal:** Omitted only when the route is disposed; route disposal
  releases it.
- **Rejected duplicates:** Breadcrumb `Numerical ODE`, route title, `/ode`,
  and every later ODE mention remain link/plain text.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-002

- **Annotation ID:** `ODE-W1-ANN-002`
- **Term ID:** `initial_value_problem`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_context`
- **Source symbol/owner:** `DEFAULT_LEDE` and `mountOdeApp.render`
- **Trigger text:** `initial value problem`
- **Accessible name:** `initial value problem`
- **Complete composition:** The same exact lede composition as
  `ODE-W1-ANN-001`; this trigger follows plain ` posed as an ` and precedes
  plain `, then analyze numerical error, observed convergence, and method
  behavior as the time-step size changes.`
- **Visible state/mode:** Every Method, Data, and Output render in Single,
  Compare-pick, and Compare modes.
- **Single/Compare behavior:** Identical context trigger in both modes.
- **Rerender behavior:** Recreated in every Context transaction.
- **Replacement behavior:** The same scope and term ID permit exact framework
  transfer.
- **Disposal:** Route disposal releases it.
- **Rejected duplicates:** Route title, breadcrumb, `/ode`, and later IVP
  mentions remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-003

- **Annotation ID:** `ODE-W1-ANN-003`
- **Term ID:** `initial_condition`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm`
- **Trigger text:** `Initial condition`
- **Accessible name:** `Initial condition`
- **Complete DOM composition:** One noninteractive field wrapper with two
  sibling children: first, the unchanged native label whose visible text is
  `Initial value y₀` and whose input remains inside that label; second, the
  standalone trigger `Initial condition`. The trigger is not a descendant of
  the label, input, or MathLive host.
- **Visible state/mode:** Single, first-order Data only.
- **Single/Compare behavior:** Present for every selected first-order Single
  method; absent for second-order Single and all Compare forms. Compare's
  `Initial value y₀` label stays plain.
- **Rerender behavior:** Recreated in each eligible Data transaction. Leaving
  the eligible state commits Data without this term and closes its card.
- **Replacement behavior:** Exact Single first-order replacement may transfer.
- **Disposal:** Data-to-Method, Data-to-Output, second-order selection, Compare
  entry, New experiment, and route disposal release it.
- **Rejected duplicates:** Start time, initial position/velocity, Compare
  initial value, formulas, diagnostics, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-004

- **Annotation ID:** `ODE-W1-ANN-004`
- **Term ID:** `step_size`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm` and
  `mountOdeApp.renderCompareForm`
- **Trigger text:** `Time-step size`
- **Accessible name:** `Time-step size`
- **Complete DOM composition:** One noninteractive field wrapper with two
  sibling children: first, the unchanged native label whose visible text is
  `Time-step size h` and whose input remains inside that label; second, the
  standalone trigger `Time-step size`. The trigger is not a descendant of the
  label or input.
- **Visible state/mode:** Every Single Data form, including second-order
  methods, and every Compare Data form.
- **Single/Compare behavior:** The currently rendered form creates one trigger
  with the same annotation mapping and term ID. Single and Compare never
  coexist in the DOM.
- **Rerender behavior:** Recreated by every eligible Data transaction.
- **Replacement behavior:** Exact Data replacements may transfer across Single
  or Compare composition.
- **Disposal:** Leaving Data, New experiment, or route disposal releases it.
- **Rejected duplicates:** Lede, method cards, Convergence, result metadata,
  chart, table, diagnostics, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-005

- **Annotation ID:** `ODE-W1-ANN-005`
- **Term ID:** `time_grid`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm` and
  `mountOdeApp.renderCompareForm`
- **Trigger text:** `time grid`
- **Accessible name:** `time grid`
- **Complete composition:** One noninteractive helper paragraph immediately
  after the End time and Time-step size controls: plain `The current
  fixed-step `; trigger `time grid`; plain ` includes the aligned start and
  end times.`
- **Visible state/mode:** Every Single Data form and every Compare Data form.
- **Single/Compare behavior:** One helper belongs to the currently rendered
  form; no simultaneous duplicate.
- **Rerender behavior:** Recreated by every eligible Data transaction.
- **Replacement behavior:** Exact Data replacement may transfer.
- **Disposal:** Leaving Data, New experiment, or route disposal releases it.
- **Rejected duplicates:** Output `Grid points stored`, chart axes, tables,
  Compare diagnostics, Convergence, formulas, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-006

- **Annotation ID:** `ODE-W1-ANN-006`
- **Term ID:** `numerical_approximation`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_output`
- **Source symbol/owner:** `mountOdeApp.mountResults`
- **Trigger text:** `Final numerical approximation`
- **Accessible name:** `Final numerical approximation`
- **Complete DOM composition:** In the successful Single result summary, the
  `.stat-label` contains only the trigger `Final numerical approximation`;
  the adjacent `.stat-value` remains plain and immutable.
- **Visible state/mode:** One trigger only when a successful Single result
  summary is mounted.
- **Single/Compare behavior:** Single success creates one trigger. No earlier
  Single success creates none. Compare always commits Output without this
  term; both method-specific Compare labels and all Compare values stay plain.
- **Rerender behavior:** A failed rerun retains the successful Single result
  data but retains no hidden trigger while Data is visible; `Return to current
  output` explicitly recreates the same annotation ownership. Single to
  Compare commits an empty Output scope and closes the active card. Compare to
  Single recreates the trigger only when a successful Single summary exists.
- **Replacement behavior:** Recreating the same successful Single summary in
  the Output scope may transfer; every Compare replacement is empty.
- **Disposal:** Clearing results, New experiment, leaving eligible Single
  Output, entering Compare, and route disposal release it.
- **Rejected duplicates:** Compare labels, values, chart, legend, tooltip,
  table, diagnostics, Convergence, metadata, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-007

- **Annotation ID:** `ODE-W1-ANN-007`
- **Term ID:** `exact_solution`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm`
- **Trigger text:** `Exact solution`
- **Accessible name:** `Exact solution`
- **Complete DOM composition:** One noninteractive mini-heading containing
  only the trigger `Exact solution`, immediately before the unchanged checkbox
  label `I know the exact solution`. The trigger is outside the checkbox label
  and outside `[data-exact-expression-field]`.
- **Visible state/mode:** Single, first-order Data only, whether the checkbox
  is checked or unchecked.
- **Single/Compare behavior:** Absent for second-order Single and every Compare
  form.
- **Rerender behavior:** Recreated in each eligible Data transaction.
- **Replacement behavior:** Exact Single first-order replacement may transfer.
- **Disposal:** Leaving eligible Data, switching to second-order or Compare,
  New experiment, and route disposal release it.
- **Rejected duplicates:** Checkbox text, preset preview, exact-expression
  MathLive, formulas, Output, Convergence, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-008

- **Annotation ID:** `ODE-W1-ANN-008`
- **Term ID:** `explicit_scheme`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_method`
- **Source symbol/owner:** `mountOdeApp.renderChoosePanel`
- **Trigger text:** `Explicit scheme`
- **Accessible name:** `Explicit scheme`
- **Complete composition:** One noninteractive helper paragraph above the
  active method grid: trigger `Explicit scheme`; plain `: the next numerical
  approximation is computed directly from quantities already known before the
  update.`
- **Visible state/mode:** Method step in normal Single selection and
  Compare-pick selection.
- **Single/Compare behavior:** One helper appears above either active grid;
  it is absent from Data and Output.
- **Rerender behavior:** Recreated in every Method transaction.
- **Replacement behavior:** Exact Method replacement may transfer.
- **Disposal:** Leaving Method, New experiment after the fresh Method render
  replaces it, and route disposal release the old generation.
- **Rejected duplicates:** Every method-selection button, `Explicit` card
  blurb, metadata, diagnostics, formulas, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-009

- **Annotation ID:** `ODE-W1-ANN-009`
- **Term ID:** `forward_euler_method`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm`
- **Trigger text:** `Forward Euler`
- **Accessible name:** `Forward Euler`
- **Complete DOM composition:** The existing selected-method Data `<h2>`
  remains a noninteractive heading and contains only the trigger `Forward
  Euler` when Forward Euler is selected.
- **Visible state/mode:** Single Data with Forward Euler selected.
- **Single/Compare behavior:** Absent for every other Single method and all
  Compare headings.
- **Rerender behavior:** Recreated in every eligible Forward Euler Data
  transaction. Selecting another method commits Data without this term.
- **Replacement behavior:** Exact Forward Euler Data replacement may transfer;
  a different method releases it before the replacement heading is active.
- **Disposal:** Leaving Forward Euler Data, New experiment, and route disposal
  release it.
- **Rejected duplicates:** Method card, result heading, metadata, diagnostics,
  chart legend, Convergence, formulas, and Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

### ODE-W1-ANN-010

- **Annotation ID:** `ODE-W1-ANN-010`
- **Term ID:** `backward_euler_method`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Scope:** `ode_wave1_data`
- **Source symbol/owner:** `mountOdeApp.renderForm`
- **Trigger text:** `Backward Euler`
- **Accessible name:** `Backward Euler`
- **Complete DOM composition:** The existing selected-method Data `<h2>`
  remains a noninteractive heading and contains only the trigger `Backward
  Euler` when Backward Euler is selected.
- **Visible state/mode:** Single Data with Backward Euler selected.
- **Single/Compare behavior:** Absent for every other Single method and all
  Compare headings.
- **Rerender behavior:** Recreated in every eligible Backward Euler Data
  transaction. Selecting another method commits Data without this term.
- **Replacement behavior:** Exact Backward Euler Data replacement may
  transfer; a different method releases it before the replacement heading is
  active.
- **Disposal:** Leaving Backward Euler Data, New experiment, and route disposal
  release it.
- **Rejected duplicates:** Method card, result heading, metadata, nonlinear
  diagnostics, chart legend, Convergence, formulas, `implicit_scheme`, and
  Tutor text remain plain.
- **Direct test owner:** `src/ode/odeGlossary.test.ts`

## 4. Source-grounded readiness audit

The audit target is committed HEAD
`08b80522283438a233974456a026a6dbc2a96746`.

| Annotation | Existing owner proof | Existing or exact new node | Nested control result | State/mode and lifecycle result | Test owner |
|---|---|---|---|---|---|
| `001` | `DEFAULT_LEDE`; `mountOdeApp.render` | Existing lede replaced by the exact two-trigger text-node composition | No; paragraph contains plain text and sibling buttons | Complete for every render and route disposal | `src/ode/odeGlossary.test.ts` |
| `002` | `DEFAULT_LEDE`; `mountOdeApp.render` | Same exact lede composition | No | Complete for every render and route disposal | `src/ode/odeGlossary.test.ts` |
| `003` | `mountOdeApp.renderForm` | Exact new wrapper around existing `Initial value y₀` label plus sibling trigger | No; trigger is outside label/input | Complete for first-order Single Data and every exit | `src/ode/odeGlossary.test.ts` |
| `004` | `mountOdeApp.renderForm`; `mountOdeApp.renderCompareForm` | Exact new wrapper around each existing `Time-step size h` label plus sibling trigger | No; trigger is outside label/input | Complete for Single/Compare Data and every exit | `src/ode/odeGlossary.test.ts` |
| `005` | Both form owners | Exact new helper after existing interval/time-step controls | No; noninteractive paragraph owns one button | Complete for Single/Compare Data and every exit | `src/ode/odeGlossary.test.ts` |
| `006` | `mountOdeApp.mountResults` | Existing Single `.stat-label` replaces only its text node; `mountCompareResults` remains unchanged/plain | No; label span is noninteractive and value is a sibling | Complete for absence, success, retained failure, mode changes, reset, and disposal | `src/ode/odeGlossary.test.ts` |
| `007` | `mountOdeApp.renderForm` | Exact new mini-heading before existing checkbox label | No; trigger is outside checkbox and MathLive | Complete for first-order Single Data and every exit | `src/ode/odeGlossary.test.ts` |
| `008` | `mountOdeApp.renderChoosePanel` | Exact new helper between existing action bar and active method grid | No; outside every method button | Complete for normal/Compare-pick Method and every exit | `src/ode/odeGlossary.test.ts` |
| `009` | `mountOdeApp.renderForm` | Existing selected-method `<h2>` receives the explicit trigger | No; heading is noninteractive | Complete for Forward Euler Single Data and every exit/switch | `src/ode/odeGlossary.test.ts` |
| `010` | `mountOdeApp.renderForm` | Existing selected-method `<h2>` receives the explicit trigger | No; heading is noninteractive | Complete for Backward Euler Single Data and every exit/switch | `src/ode/odeGlossary.test.ts` |

The optional `MountedLabRoute.getGlossaryBinding` port exists in
`src/app/contracts.ts`. `src/app/labRouteAdapter.ts` already connects it after
mount, closes and disconnects the Host before mounted-Lab disposal, and clears
route DOM afterward. `src/ode/initialValueProblemsRoute.ts` returns the
`mountOdeApp` result, so the future ODE binding can use the existing port
without a framework change.

The audit found:

```text
10 annotation records
10 exact term mappings
10 exact owners
10 exact trigger texts
10 complete state/mode contracts
10 complete lifecycle contracts
0 pending copy
0 unresolved owner
0 contradictory policy
0 missing test owner
```

## 5. Test ownership and acceptance boundary

`src/ode/odeGlossary.test.ts` is the direct owner for all ten record
definitions, exact mappings, trigger text, explicit DOM construction,
conditional visibility, rejected duplicates, scope transactions, replacement,
and disposal. Existing ODE lifecycle tests remain integration evidence for
successful/failed output, Single/Compare hydration, New experiment, and final
route cleanup. Existing complete-IVP route tests remain integration evidence
for the optional binding port and mounted-route ownership.

E2 implementation must preserve:

- exactly ten record definitions, without requiring ten simultaneous
  triggers;
- accepted E1 card content without revision;
- plain, unregistered future text for `implicit_scheme`;
- no `/ode` annotation or binding;
- no trigger inside native labels, method buttons, editable MathLive, readonly
  formula rendering, charts, tables, diagnostics, or Tutor content;
- no generic Glossary Framework change;
- no Tutor handoff, Store/session change, numerical change, push, or
  deployment.

E1 is accepted. E2 source implementation is incomplete and requires fresh
maintainer reauthorization. E3 and Group F2 execution remain unauthorized.
