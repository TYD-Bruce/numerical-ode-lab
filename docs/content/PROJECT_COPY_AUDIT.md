# Numerical T-Lab Project Copy Audit

Status: Reconciled against Project Language Standard v1.
Group A ready records are accepted. Group B records `COPY-006` through
`COPY-019` and Group C records `COPY-020` through `COPY-029` are accepted.
Group D records `COPY-030` through `COPY-040` are accepted. The maintainer has
accepted the Group F1 and pre-Glossary repair commits as prerequisite state;
`COPY-043` is implemented, all twelve `COPY-NC-*` records retain their
reviewed classifications, and all five pre-E findings are `CLOSED_VERIFIED`.
`COPY-003` remains held. Group E0 ODE Glossary Wave 1 design and content
governance is maintainer-approved: D01–D18, all ten revised cards, and all ten
annotation records are approved. E1 inert content is locally implemented
pending maintainer acceptance; E2 implementation, E3 and F2 execution,
`COPY-041`, `COPY-042`, production activation, annotations, and an ODE binding
remain unauthorized and unimplemented.

## Purpose and boundary

This is the implementation-ready, repository-grounded wording migration
record for current non-historical user-facing English. It was rescanned at
starting HEAD `b14bf1c7a2cb0f398ccd462dd8747ef76676b8d1` after the three
language standards became Version 1. This document now also records the
separately authorized Group A through Group D implementation evidence. No
numerical contract, production Glossary content, or Tutor behavior is changed.

Exact candidate replacement copy is recorded for all 43 non-no-change
records: 40 are ready for implementation, 2 require the content wave, and 1
remains deferred with its future module. Final wording is reviewed again
inside the separately authorized implementation group.

## Coverage and result

- Records rescanned: **55**.
- Source files represented: **20**.
- Expected focused test files represented: **21**.
- Readiness counts: `{'DEFERRED_BY_MODULE': 1, 'IMPLEMENTED_ACCEPTED': 39, 'IMPLEMENTED_LOCALLY_GROUP_F1': 1, 'NO_CHANGE': 12, 'REQUIRES_CONTENT_WAVE': 2}`.
- Implementation progress: 4 Group A ready records, 14 Group B records,
  10 Group C records, and 11 Group D records accepted; `COPY-043` implemented
  and accepted with Group F1; `COPY-003` held; Group E0 design and content
  governance approved; E1 inert content locally implemented pending
  acceptance; E2 implementation and E3/F2 execution unauthorized; Group F2
  required after E3.
- Former decision-blocked records: **0**.
- Numerical-behavior changes proposed: **0**.

Audit scope covers `src/pages/`, visible `src/app/` owners, the current ODE
Lab and catalogs, Convergence view/teaching, Tutor prompts and replies,
`api/chatHandler.ts`, current Glossary surface copy, mathematical-input
learner copy, README product status, and current-state governance wording.
Historical specs/reviews, generated output, private material, internal-only
identifiers, and tests other than authoritative visible-copy expectations
remain excluded.

## Rule-ID registry

Copy records use compact rule IDs defined by the approved documents:

- `TERM-V1:<term_id>` — the corresponding row in the Terminology Standard.
- `NOT-V1:GENERAL`, `EXACT_APPROX`, `SIGNED_ERROR`, `ABS_REL_ERROR`,
  `LOCAL_TRUNCATION`, `ORDER`, `ABSOLUTE_STABILITY`, `TOLERANCE`,
  `LINEAR_ALGEBRA`, and `MIGRATION_BOUNDARY` — named sections of the
  Notation Standard.
- `VOICE-V1:PLAIN_CORE`, `EPISTEMIC`, `SYMBOL_ACCESS`, `DISTINCTIONS`,
  `ACTIONS`, `RESULTS`, `TUTOR`, and `PREFERRED_WORDING` — named
  requirements in Teaching Voice v1.
- `DEC-V1:<decision_id>` — one of the nine approved maintainer decisions.

## Reconciled records

### COPY-001 — `src/pages/aboutPage.ts` · `aboutPage / Teaching pillar`

- Current text: “The approved Interactive Glossary framework is planned as the next shared learning capability.”
- Mathematical sense: Project status and scope language; no numerical quantity is redefined.
- Issue category: **unsupported claim**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “The locally accepted Interactive Glossary framework is ready for reviewed content integration. No production terms or definitions are published yet.”
- Optional helper/accessibility copy: —
- Rationale: The current repository already contains locally verified shared framework infrastructure, while production remains content-free.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/pages/pages.test.ts`
- Browser review: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Implementation group: `GROUP_A`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_AND_ACCEPTED_GROUP_A`
- Source/test status: `EXACT_REPLACEMENT_IN_aboutPage; pages.test.ts final focused assertion passed`
- Browser verification status: `PASSED_/_about_/_ode_/_linear-algebra_/_pde_AT_1440x900_AND_390x844`
- Behavior status: `VISIBLE_TEXT_ONLY; no route, link, module-status, runtime, or Glossary-content change`
- Notes: Implemented with the approved Group A wording and accepted at commit `75b8539`.

### COPY-002 — `README.md` · `Current limitations / next milestone`

- Current text: “The active milestone is the Content-Agnostic Interactive Glossary Framework. Its four planned implementation phases are complete locally and await full framework release review. The complete Playground is development only, and no production terms, definitions, annotations, or visible Glossary behavior have been released. A Linear Systems Lab is a later milestone.”
- Mathematical sense: Project status and scope language; no numerical quantity is redefined.
- Issue category: **unsupported claim**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “The Content-Agnostic Interactive Glossary Framework is complete and locally accepted. Numerical T-Lab Project Language Standard v1 is approved, while the reconciled catalog and copy plan remain non-runtime. Production still has no Glossary terms, definitions, annotations, ODE binding, or visible Glossary behavior. A Linear Systems Lab remains a later milestone.”
- Optional helper/accessibility copy: —
- Rationale: The sentence predates the locally implemented framework commits and conflicts with PLAN.md and the current handoff.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: —
- Browser review: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Implementation group: `GROUP_A`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_AND_ACCEPTED_GROUP_A`
- Source/test status: `EXACT_REPLACEMENT_IN_README; no focused test owner; full verify and production build passed`
- Browser verification status: `README_NOT_A_BROWSER_SURFACE; all five Group A route regressions passed at both viewports`
- Behavior status: `PUBLIC_STATUS_TEXT_ONLY; no deployment claim, runtime behavior, or module-status change`
- Notes: Implemented with the approved Group A wording and accepted at commit `75b8539`.

### COPY-003 — `src/pages/homePage.ts` · `Numerical PDE module-card description`

- Current text: “Connect discretization, stability, and refinement to spatially varying systems.”
- Mathematical sense: Project status and scope language; no numerical quantity is redefined.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `NOT-V1:GENERAL`, `TERM-V1:grid_spacing`, `TERM-V1:numerical_stability`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: `grid_spacing`, `numerical_stability`
- Exact recommended replacement: “Connect spatial discretization, refinement, and the relevant stability properties of numerical PDE schemes.”
- Optional helper/accessibility copy: —
- Rationale: Bare “stability” can mean several different mathematical properties; the future module should name the sense when content is designed.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/pages/pages.test.ts`, `src/pages/homeResume.test.ts`
- Browser review: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Implementation group: `GROUP_A`
- Readiness: `DEFERRED_BY_MODULE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `HELD_REVIEW_ONLY_UNCHANGED`
- Source/test status: `homePage.ts unchanged; no new assertion forces implementation; pages.test.ts and homeResume.test.ts passed`
- Browser verification status: `CURRENT_WORDING_CONFIRMED_UNCHANGED_AT_1440x900_AND_390x844`
- Behavior status: `NO_CHANGE`
- Notes: Deferred until the owning module has an approved content design.

### COPY-004 — `src/pages/odeOverviewPage.ts` · `ODE roadmap item`

- Current text: “Stability Regions”
- Mathematical sense: Project status and scope language; no numerical quantity is redefined.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `NOT-V1:ABSOLUTE_STABILITY`, `TERM-V1:absolute_stability`, `TERM-V1:stability_region`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `absolute_stability`, `stability_region`
- Exact recommended replacement: “Absolute-stability regions”
- Optional helper/accessibility copy: —
- Rationale: For time-stepping methods, this roadmap item refers to the absolute-stability region, not stability in every sense.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/pages/pages.test.ts`
- Browser review: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Implementation group: `GROUP_A`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_AND_ACCEPTED_GROUP_A`
- Source/test status: `EXACT_REPLACEMENT_IN_odeOverviewPage; pages.test.ts final focused assertion passed`
- Browser verification status: `PASSED_ODE_ROADMAP_AT_1440x900_AND_390x844_WITH_NO_CLIPPING_OR_OVERFLOW`
- Behavior status: `VISIBLE_TEXT_ONLY; route, link target, roadmap status, and static boundary unchanged`
- Notes: Implemented with the approved Group A wording and accepted at commit `75b8539`.

### COPY-005 — `src/pages/aboutPage.ts` · `aboutPage / Theory pillar`

- Current text: “including their assumptions, limitations, stability, and error behavior”
- Mathematical sense: Project status and scope language; no numerical quantity is redefined.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:GENERAL`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:numerical_stability`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `numerical_stability`, `global_error`
- Exact recommended replacement: “including their assumptions, limitations, relevant stability properties, and stated error measures”
- Optional helper/accessibility copy: —
- Rationale: The revision signals that both stability and error need a named scope or metric.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/pages/pages.test.ts`
- Browser review: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Implementation group: `GROUP_A`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_AND_ACCEPTED_GROUP_A`
- Source/test status: `EXACT_REPLACEMENT_IN_aboutPage; pages.test.ts final focused assertion passed`
- Browser verification status: `PASSED_ABOUT_AT_1440x900_AND_390x844_WITH_NO_CLIPPING_OR_OVERFLOW`
- Behavior status: `VISIBLE_TEXT_ONLY; no numerical claim, behavior, ownership, or accessible-structure change`
- Notes: Implemented with the approved Group A wording and accepted at commit `75b8539`.

### COPY-006 — `src/ode/odeApp.ts` · `DEFAULT_LEDE`

- Current text: “Explore fixed-step methods for first-order initial value problems, then study stability, error, and convergence.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:EXACT_APPROX`, `NOT-V1:GENERAL`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:initial_value_problem`, `TERM-V1:observed_order`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `initial_value_problem`, `global_error`, `observed_order`, `step_size`
- Exact recommended replacement: “Explore fixed-step methods for first-order initial value problems, then analyze numerical error, observed convergence, and method behavior as the step size changes.”
- Optional helper/accessibility copy: —
- Rationale: The replacement avoids three unqualified umbrella terms while preserving the learner-facing promise.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/ode/odeApp.ts::DEFAULT_LEDE; initialValueProblemsRoute.test.ts exact copy assertion and all focused regressions passed`
- Browser verification status: `PASSED_IVP_METHOD_DATA_RUN_OUTPUT_COMPARE_PRESET_AND_ERROR_STATES_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; visible text only; no route, session, solver, grid, Tutor, Convergence, or Glossary behavior change`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-007 — `src/methodCatalog.ts` · `METHOD_CATALOG / backward_euler / blurb`

- Current text: “Implicit first-order method. Very stable; each step solves for the next value.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:EXACT_APPROX`, `TERM-V1:a_stability`, `TERM-V1:absolute_stability`, `TERM-V1:numerical_approximation`, `TERM-V1:stability_region`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `a_stability`, `absolute_stability`, `stability_region`, `numerical_approximation`
- Exact recommended replacement: “Implicit first-order method. A-stable for the scalar test equation; each step solves for the next numerical approximation. Absolute stability does not by itself establish accuracy.”
- Optional helper/accessibility copy: —
- Rationale: “Very stable” is an undefined guarantee. The replacement names the test-equation scope and distinguishes a computed approximation from an exact value.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/methodCatalog.ts::METHOD_CATALOG/backward_euler/blurb; initialValueProblemsRoute.test.ts exact copy assertion and newExperiment.test.ts regression passed`
- Browser verification status: `PASSED_ALL_METHOD_CARDS_AND_STABILITY_WORDING_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; catalog text only; method ID, order, solver selection, and workflow behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-008 — `src/methodCatalog.ts` · `METHOD_CATALOG / forward_euler / blurb`

- Current text: “Explicit first-order method. Global error is first order in the step size.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **unsupported claim**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:EXACT_APPROX`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:order_of_convergence`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `order_of_convergence`, `global_error`, `step_size`
- Exact recommended replacement: “Explicit first-order method. Its theoretical order is 1 under the method’s usual smoothness and stability assumptions.”
- Optional helper/accessibility copy: —
- Rationale: The current sentence presents an asymptotic global-error claim without its assumptions or a stated error metric.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/methodCatalog.ts::METHOD_CATALOG/forward_euler/blurb; initialValueProblemsRoute.test.ts exact copy assertion and newExperiment.test.ts regression passed`
- Browser verification status: `PASSED_ALL_METHOD_CARDS_AND_THEORETICAL_ORDER_WORDING_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; catalog text only; method ID, order, solver selection, and workflow behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-009 — `src/methodCatalog.ts` · `METHOD_CATALOG / adams_bashforth / blurb`

- Current text: “Explicit multistep method; choose the order of accuracy p below.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `order_of_convergence`, `observed_order`
- Exact recommended replacement: “Explicit multistep method; choose the theoretical order p below.”
- Optional helper/accessibility copy: —
- Rationale: “Theoretical order” keeps configured method metadata distinct from an observed order estimated from a study.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/methodCatalog.ts::METHOD_CATALOG/adams_bashforth/blurb; initialValueProblemsRoute.test.ts exact copy assertion and newExperiment.test.ts regression passed`
- Browser verification status: `PASSED_ALL_METHOD_CARDS_AND_THEORETICAL_ORDER_WORDING_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; catalog text only; method ID, order range, startup, solver selection, and workflow behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-010 — `src/ode/odeApp.ts` · `orderFieldHtml and metadataPanelHtml`

- Current text: “Order of accuracy p”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `order_of_convergence`, `observed_order`
- Exact recommended replacement: “Theoretical order p”
- Optional helper/accessibility copy: —
- Rationale: The configured or reported method property is theoretical order; the Convergence Study separately reports observed order.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENTS_IN_src/ode/odeApp.ts::orderFieldHtml_AND_metadataPanelHtml; initialValueProblemsRoute.test.ts and odeLifecycle.test.ts exact copy assertions passed`
- Browser verification status: `PASSED_CONFIGURED_AND_REPORTED_THEORETICAL_ORDER_WORDING_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; label text only; configured order, metadata, controls, and state unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-011 — `src/ode/odeApp.ts` · `renderForm / time inputs`

- Current text: “End time t_end”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **notation inconsistency**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:time_grid`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`
- Affected term IDs: `time_grid`
- Exact recommended replacement: “End time”
- Optional helper/accessibility copy: Accessible label: End time.
- Rationale: The display should render the endpoint as a subscripted symbol and provide an accessible name such as “End time t sub end.”
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENTS_IN_src/ode/odeApp.ts::renderForm_AND_renderCompareForm; initialValueProblemsRoute.test.ts exact label assertions and odeLifecycle.test.ts regressions passed`
- Browser verification status: `PASSED_SINGLE_AND_COMPARE_END_TIME_LABELS_AND_ACCESSIBLE_NAMES_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; label text only; input name, value, parsing, validation, session, and grid behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-012 — `src/ode/odeApp.ts` · `renderForm and renderCompareForm / step-size labels`

- Current text: “Run step size h = Δt / Step size h”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **notation inconsistency**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `step_size`
- Exact recommended replacement: “Time-step size h”
- Optional helper/accessibility copy: Accessible label: Time-step size h.
- Rationale: Use h consistently in ODE controls; explain Δt as an alias in teaching content only if needed.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENTS_IN_src/ode/odeApp.ts::renderForm_AND_renderCompareForm; initialValueProblemsRoute.test.ts exact label assertions and odeLifecycle.test.ts regressions passed`
- Browser verification status: `PASSED_SINGLE_AND_COMPARE_TIME_STEP_LABELS_NATIVE_VALIDATION_AND_GRID_ERRORS_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; label text only; input constraints, values, validation precedence, session, and grid behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-013 — `src/problemPresets.ts` · `PROBLEM_PRESETS / exponential_decay / teachingSummary`

- Current text: “Basic decay, global error, and stability.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:absolute_stability`, `TERM-V1:global_error`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `global_error`, `absolute_stability`
- Exact recommended replacement: “Basic decay and global error, with coarse-step behavior that can motivate absolute-stability analysis.”
- Optional helper/accessibility copy: —
- Rationale: The current summary leaves the stability sense unspecified.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/problemPresets.test.ts`, `src/ode/beginnerStarter.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/problemPresets.ts::PROBLEM_PRESETS/exponential_decay/teachingSummary; problemPresets.test.ts and beginnerStarter.test.ts exact assertions passed`
- Browser verification status: `PASSED_EXPONENTIAL_DECAY_AND_STIFF_RELAXATION_PRESET_COPY_VALUES_AND_WRAPPING_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; preset summary text only; preset ID, order, values, expressions, recommended step, compatibility, and warnings unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-014 — `src/grid.ts` · `validateFixedStepGrid / non-finite step count`

- Current text: “Fixed-step grid size must be finite.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:step_size`, `TERM-V1:time_grid`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `time_grid`, `step_size`
- Exact recommended replacement: “The computed number of time steps must be finite.”
- Optional helper/accessibility copy: —
- Rationale: “Grid size” can mean spacing, point count, or storage size; the failing quantity is the computed step count.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_ERROR_TEXT_ONLY; error conditions and control flow remain unchanged`
- Expected test files: `src/grid.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/grid.ts::validateFixedStepGrid/non-finite-step-count; grid.test.ts focused branch assertion passed`
- Browser verification status: `PASSED_REPRESENTATIVE_NATIVE_NONPOSITIVE_ALIGNED_GRID_AND_STEP_BUDGET_VALIDATION_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_NUMERIC_LITERALS_GRID_ARITHMETIC_AND_BRANCH_ORDER_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; error text only; failing condition, validation precedence, error ownership, and control flow unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-015 — `src/ode/odeApp.ts` · `mountResults / summary stat`

- Current text: “Steps taken”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `NOT-V1:GENERAL`, `TERM-V1:iteration_count`, `TERM-V1:time_grid`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`
- Affected term IDs: `time_grid`, `iteration_count`
- Exact recommended replacement: “Grid points stored”
- Optional helper/accessibility copy: —
- Rationale: The displayed value is the result-series length, which includes the initial point and is not the number of time steps.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/ode/odeApp.ts::mountResults/summary-stat; odeLifecycle.test.ts exact assertion passed`
- Browser verification status: `PASSED_BEGINNER_AND_STIFF_OUTPUT_STATS_WITH_26_AND_201_UNCHANGED_GRID_POINTS_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; result label only; result-series length, chart, table, session, and Convergence eligibility unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-016 — `src/ode/odeApp.ts` · `mountResults / final-value stat`

- Current text: “Final y”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **exact/approximate confusion**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:exact_solution`, `TERM-V1:numerical_approximation`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `numerical_approximation`, `exact_solution`
- Exact recommended replacement: “Final numerical approximation”
- Optional helper/accessibility copy: Accessible label: Final numerical approximation.
- Rationale: The result is computed. Using y without qualification makes it look like the exact solution used elsewhere in the Lab.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/ode/odeApp.ts::mountResults/final-value-stat; odeLifecycle.test.ts exact assertion passed`
- Browser verification status: `PASSED_BEGINNER_AND_STIFF_FINAL_APPROXIMATION_LABELS_WITH_VALUES_0.00377789_AND_0.99500441_UNCHANGED_AT_1440x900_AND_390x844`
- Numerical/behavior status: `APPROVED_TEMPLATE_TO_STATIC_LABEL_ONLY; TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_OTHERWISE_UNCHANGED; result label only; numerical value, exact solution, chart, table, session, and Convergence eligibility unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-017 — `src/ode/odeApp.ts` · `mountCompareResults / final-value stats`

- Current text: “Final y — [method]”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **exact/approximate confusion**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:exact_solution`, `TERM-V1:numerical_approximation`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `numerical_approximation`, `exact_solution`
- Exact recommended replacement: “Final numerical approximation — [method]”
- Optional helper/accessibility copy: Accessible label: Final numerical approximation for [method].
- Rationale: Both displayed values are numerical approximations, not exact values.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENTS_IN_src/ode/odeApp.ts::mountCompareResults/final-value-stats; odeLifecycle.test.ts exact assertions passed`
- Browser verification status: `PASSED_COMPARE_LABELS_WITH_METHOD_NAMES_AND_VALUES_0.99500441_AND_0.99500416_UNCHANGED_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; result labels only; both solver results, pairing, chart, table, and session behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-018 — `src/ode/odeApp.ts` · `mountCompareResults / final difference`

- Current text: “|uₙ − yₙ| at final t”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **exact/approximate confusion**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:numerical_approximation`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `numerical_approximation`
- Exact recommended replacement: “Absolute difference between final numerical approximations”
- Optional helper/accessibility copy: Accessible explanation: magnitude of the final approximation from Method A minus the final approximation from Method B.
- Rationale: The current symbols resemble numerical-versus-exact error even though the value compares two numerical methods.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/ode/odeApp.ts::mountCompareResults/final-difference; odeLifecycle.test.ts exact assertion passed`
- Browser verification status: `PASSED_COMPARE_DIFFERENCE_LABEL_WITH_2.4960e-7_VALUE_UNCHANGED_AT_1440x900_AND_390x844`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_AND_NUMERIC_LITERALS_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; result label only; absolute-difference calculation, operands, formatting, chart, table, and session behavior unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-019 — `src/ode/odeApp.ts` · `mountCompareResults / length mismatch`

- Current text: “Series length mismatch; plots may be unreliable.”
- Mathematical sense: Current IVP method, grid, approximation, reference, and diagnostic language.
- Issue category: **warning/error tone**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:time_grid`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`
- Affected term IDs: `time_grid`
- Exact recommended replacement: “The two result series have different lengths, so the comparison plot was not created. Rerun both methods on the same aligned grid.”
- Optional helper/accessibility copy: —
- Rationale: The current implementation stops before plotting; the message should state the actual outcome and a recovery action.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_ERROR_TEXT_ONLY; error conditions and control flow remain unchanged`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Implementation group: `GROUP_B`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Implementation status: `IMPLEMENTED_LOCALLY_GROUP_B_COMMIT_PENDING`
- Source/test status: `EXACT_REPLACEMENT_IN_src/ode/odeApp.ts::mountCompareResults/length-mismatch; odeLifecycle.test.ts focused mismatch-branch assertion passed`
- Browser verification status: `PASSED_COMPARE_WORKFLOW_LAYOUT_AND_ALIGNED_GRID_VALIDATION_AT_1440x900_AND_390x844; synthetic mismatch remains focused-test-only`
- Numerical/behavior status: `TYPESCRIPT_AST_STRUCTURE_IDENTIFIERS_NUMERIC_LITERALS_BRANCH_CONDITION_AND_RETURN_ORDER_UNCHANGED_WHEN_APPROVED_TEXT_LITERALS_ARE_IGNORED; error text only; mismatch condition, no-plot outcome, ownership, and control flow unchanged`
- Notes: Implemented with the exact approved Group B wording and accepted in commit `d2d2130c1ef7354e56497455ccadecd1f991eb59`.

### COPY-020 — `src/convergenceStudyView.ts` · `renderConclusion / primary order label`

- Current text: “Primary maximum-error observed order”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:maximum_global_error`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`, `maximum_global_error`
- Exact recommended replacement: “Primary observed order (maximum global error)”
- Optional helper/accessibility copy: Accessible label: Primary observed order using maximum global error.
- Rationale: The parenthetical metric is easier to parse and matches the full metric name used elsewhere.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-021 — `src/convergenceStudyView.ts` · `renderConclusion / unavailable order`

- Current text: “No reliable order available”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`, `order_of_convergence`
- Exact recommended replacement: “No reliable observed order available”
- Optional helper/accessibility copy: —
- Rationale: Theoretical order remains available, so the missing quantity must be named.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-022 — `src/convergenceStudyView.ts` · `renderErrorTable / value headers`

- Current text: “Final numerical / Final exact”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **exact/approximate confusion**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:exact_solution`, `TERM-V1:numerical_approximation`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `numerical_approximation`, `exact_solution`
- Exact recommended replacement: “Final numerical approximation / Final exact value”
- Optional helper/accessibility copy: —
- Rationale: Both headers should name the mathematical status of the displayed quantity.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-023 — `src/convergenceStudyView.ts` · `renderErrorTable / order headers`

- Current text: “Final observed order / Maximum observed order”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:final_time_error`, `TERM-V1:maximum_global_error`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`, `final_time_error`, `maximum_global_error`
- Exact recommended replacement: “Observed order (final-time error) / Observed order (maximum global error)”
- Optional helper/accessibility copy: Keep the full metric name in each accessible column header.
- Rationale: Observed order depends on the error metric, so the header should name that metric.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-024 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / errors section`

- Current text: “How are final-time and maximum errors calculated?”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:final_time_error`, `TERM-V1:maximum_global_error`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `final_time_error`, `maximum_global_error`
- Exact recommended replacement: “How are final-time error and maximum global error calculated?”
- Optional helper/accessibility copy: —
- Rationale: The existing title shortens a released metric name and makes “maximum error” look like a different quantity.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceTeaching.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-025 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / order example`

- Current text: “giving a measured order of [value]”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`
- Exact recommended replacement: “giving an observed order of [value]”
- Optional helper/accessibility copy: —
- Rationale: The product already uses “observed order” for an empirical estimate; “measured order” creates an unnecessary synonym.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceTeaching.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-026 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / theory_difference`

- Current text: “before the asymptotic range is reached”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:asymptotic_region`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `asymptotic_region`, `observed_order`
- Exact recommended replacement: “before the asymptotic region is reached”
- Optional helper/accessibility copy: —
- Rationale: Version 1 uses the learner-facing term “asymptotic region.”
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/convergenceTeaching.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-027 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / exact_solution`

- Current text: “An exact solution gives the mathematical value used as the reference for numerical error.”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:EXACT_APPROX`, `NOT-V1:GENERAL`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:exact_solution`, `TERM-V1:global_error`, `TERM-V1:initial_value_problem`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `exact_solution`, `initial_value_problem`, `global_error`
- Exact recommended replacement: “An exact solution is a function that satisfies the stated initial value problem and supplies the reference values used to compute numerical error.”
- Optional helper/accessibility copy: —
- Rationale: The current wording calls a function a value and omits the stated-problem scope.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_TEXT_ONLY; no behavior or ownership change`
- Expected test files: `src/convergenceTeaching.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-028 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / accessible error formula`

- Current text: “final error ... maximum error”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:final_time_error`, `TERM-V1:maximum_global_error`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `final_time_error`, `maximum_global_error`
- Exact recommended replacement: “final-time error ... maximum global error”
- Optional helper/accessibility copy: Final-time error is the absolute endpoint difference; maximum global error is the largest absolute grid-point difference.
- Rationale: The accessible description should carry the same metric names as the visible formula and controls.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceTeaching.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-029 — `src/convergenceStudy.ts` · `classifyConvergence / near-theory explanation`

- Current text: “The recent maximum-error orders are stable”
- Mathematical sense: Named ODE error metrics, theoretical/observed order, and evidence status.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `DEC-V1:tolerance_scopes`, `NOT-V1:GENERAL`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `NOT-V1:TOLERANCE`, `TERM-V1:maximum_global_error`, `TERM-V1:numerical_stability`, `TERM-V1:observed_order`, `TERM-V1:tolerance`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:RESULTS`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`, `maximum_global_error`, `numerical_stability`, `tolerance`
- Exact recommended replacement: “The recent maximum-global-error observed orders are consistent across levels, and the latest reliable value is within [tolerance] of the theoretical order.”
- Optional helper/accessibility copy: —
- Rationale: Here “stable” means little variation, not a numerical-stability property.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/convergenceStudy.test.ts`, `src/convergenceStudyOrder.test.ts`
- Browser review: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Implementation group: `GROUP_C`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group C iteration and accepted in `6e28ba493681a3a2d223724ba4b1688557848717`.

#### Group C local implementation evidence

| Record | Exact source owner | Focused evidence | Browser and accessibility evidence |
|---|---|---|---|
| `COPY-020` | `src/convergenceStudyView.ts` · `renderConclusion` | `src/convergenceStudyView.test.ts` asserts the complete primary observed-order label. | Eligible desktop and mobile states exposed the full metric-qualified term; the long label remained contained. |
| `COPY-021` | `src/convergenceStudyView.ts` · `renderConclusion` | `src/convergenceStudyView.test.ts` asserts the unavailable observed-order value and rejects the ambiguous predecessor. | A real RK4 resolution-limited study showed `No reliable observed order available` without promoting non-reliable evidence. |
| `COPY-022` | `src/convergenceStudyView.ts` · `renderErrorTable` | `src/convergenceStudyView.test.ts` asserts both exact value headers and their semantic order. | Desktop and 390×844 review confirmed semantic headers, wrapping, and contained horizontal table scrolling. |
| `COPY-023` | `src/convergenceStudyView.ts` · `renderErrorTable` | `src/convergenceStudyView.test.ts` asserts both metric-qualified order headers and visible status descriptions. | Browser review confirmed full headers, adjacent-pair title text, reliable values, and `Below resolution` states. |
| `COPY-024` | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / errors` | `src/convergenceTeaching.test.ts` asserts the exact approved section title. | The expanded teaching section rendered the approved title at both viewports. |
| `COPY-025` | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / order example` | `src/convergenceTeaching.test.ts` asserts `giving an observed order` and rejects `measured order` in that example. | The expanded real-data example displayed the adjacent refinement values and approved observed-order wording. |
| `COPY-026` | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / theory_difference` | `src/convergenceTeaching.test.ts` asserts `asymptotic region` and rejects `asymptotic range`. | The expanded section showed the approved learner-facing region wording and retained the non-proof limitation. |
| `COPY-027` | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / exact_solution` | `src/convergenceTeaching.test.ts` asserts the exact approved function/problem/reference sentence. | Eligible browser states rendered the plain explanation before the existing formula. |
| `COPY-028` | `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / accessible error formula` | `src/convergenceTeaching.test.ts` asserts both complete metric names in accessible formula text. | Every teaching formula retained exactly one `aria-label` owner through desktop and mobile review. |
| `COPY-029` | `src/convergenceStudy.ts` · `interpretConvergence / consistent_with_theory` | `src/convergenceStudy.test.ts` and `src/convergenceStudyOrder.test.ts` assert the approved explanation while retaining exact classifications and thresholds. | Forward Euler rendered the new consistent-with-theory explanation with unchanged primary values and evidence pairs; the RK4 resolution-limited state retained its separate non-reliable explanation. |

The focused Group C suite passed 5 files and 93 tests. A TypeScript AST
comparison against starting HEAD matched all 8,573 production AST nodes after
ignoring string contents; identifiers, operators, numeric literals, statuses,
branches, calls, object fields, and return shapes were unchanged. Baseline and
final focused runs preserved eligibility, level counts and step sizes, both
error streams, observed-order values, all six status values, precedence,
primary-metric ownership, stale/current state, and chart data. Browser review
covered reliable, below-resolution, stale, missing-exact, and Compare states;
negative, near-zero, no-improvement, and synthetic unavailable classifications
remain deterministic-test evidence only. No Tutor or Glossary source,
integration, content, annotation, or binding changed. Group C is accepted in
`6e28ba493681a3a2d223724ba4b1688557848717`.

### COPY-030 — `src/ode/odeTutorBinding.ts` · `ODE_TUTOR_SUGGESTED_QUESTIONS`

- Current text: “Why is the order of accuracy p?”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `order_of_convergence`, `observed_order`
- Exact recommended replacement: “Why is this method’s theoretical order p?”
- Optional helper/accessibility copy: —
- Rationale: The question should distinguish method metadata from an observed convergence estimate.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `src/ode/odeTutorBinding.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused binding tests, structural non-change audit, and desktop/mobile browser review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-031 — `src/ode/odeTutorBinding.ts` · `ODE_TUTOR_SUGGESTED_QUESTIONS`

- Current text: “What would happen if I used a smaller h?”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **beginner-unfriendly language**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `step_size`
- Exact recommended replacement: “What could happen if I used a smaller time-step size h?”
- Optional helper/accessibility copy: —
- Rationale: The revision defines h and avoids implying that refinement has one guaranteed outcome.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `src/ode/odeTutorBinding.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused binding tests, structural non-change audit, and desktop/mobile browser review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-032 — `src/tutor/platformTutorPanel.ts` · `AI Tutor subtitle`

- Current text: “Ask about the method, variables, coefficients, stability, accuracy, or graph behavior.”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:GENERAL`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:convergence`, `TERM-V1:global_error`, `TERM-V1:numerical_stability`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `global_error`, `convergence`, `numerical_stability`
- Exact recommended replacement: “Ask about the method, variables, coefficients, error, convergence evidence, or graph behavior.”
- Optional helper/accessibility copy: —
- Rationale: The broad menu should avoid inviting an answer about an unspecified stability sense.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `src/app/platformTutorHost.test.ts`, `src/app/tutorLazyBoundary.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; Host/panel and lazy regression tests, structural non-change audit, and desktop/mobile browser review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-033 — `api/chatHandler.ts` · `mockTutorResponse / orderLine`

- Current text: “For this run, the method is treated as order p = [value].”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **terminology inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `order_of_convergence`, `observed_order`
- Exact recommended replacement: “The method metadata reports theoretical order p = [value] for this run.”
- Optional helper/accessibility copy: —
- Rationale: “Treated as order” is vague and can be mistaken for the study’s observed order.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic/browser demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-034 — `api/chatHandler.ts` · `mockTutorResponse / observed-order explanation`

- Current text: “A measured order need not be an integer”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **Tutor voice inconsistency**
- Governing Version 1 rule IDs: `DEC-V1:observed_order_reliability`, `NOT-V1:ORDER`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `observed_order`
- Exact recommended replacement: “An observed order need not be an integer”
- Optional helper/accessibility copy: —
- Rationale: Use the same learner-facing term in the Tutor and Convergence Study.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic/browser demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-035 — `api/chatHandler.ts` · `mockTutorResponse / table summary`

- Current text: “Steps stored: [point count]”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `NOT-V1:GENERAL`, `TERM-V1:iteration_count`, `TERM-V1:time_grid`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:TUTOR`
- Affected term IDs: `time_grid`, `iteration_count`
- Exact recommended replacement: “Grid points stored: [point count]”
- Optional helper/accessibility copy: —
- Rationale: The context value is pointCount, including the initial point, not a count of completed time steps.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-036 — `api/chatHandler.ts` · `mockTutorResponse / step-by-step sketch`

- Current text: “Start from the IVP ... with h = Δt.”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **notation inconsistency**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `NOT-V1:GENERAL`, `TERM-V1:initial_value_problem`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `initial_value_problem`, `step_size`
- Exact recommended replacement: “Start from the IVP ... with time-step size h.”
- Optional helper/accessibility copy: —
- Rationale: The primary ODE notation draft uses h; aliases should be introduced only when they help.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-037 — `api/chatHandler.ts` · `mockTutorResponse / graph interpretation`

- Current text: “the curve reflects how your chosen f and h affect stability and accuracy ... If it blows up, the method may be unstable for this step size.”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **stability-sense confusion**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:EXACT_APPROX`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:absolute_stability`, `TERM-V1:global_error`, `TERM-V1:numerical_approximation`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `numerical_approximation`, `absolute_stability`, `global_error`
- Exact recommended replacement: “The curve shows the computed approximations for this method and time-step size. Rapid growth or oscillation can motivate an absolute-stability check, but the plot alone does not prove instability or accuracy.”
- Optional helper/accessibility copy: —
- Rationale: The current response conflates plot appearance, accuracy, and an unspecified stability sense.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic/browser demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-038 — `api/chatHandler.ts` · `mockTutorResponse / smaller-step reply`

- Current text: “the local truncation error per step shrinks like O(h^p) for order p. Expect a smoother plot and a final value closer to the exact solution”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **unsupported claim**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:local_truncation_scaling`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:EXACT_APPROX`, `NOT-V1:LOCAL_TRUNCATION`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:final_time_error`, `TERM-V1:local_truncation_error`, `TERM-V1:observed_order`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `local_truncation_error`, `step_size`, `final_time_error`, `observed_order`
- Exact recommended replacement: “With a smaller time-step size \(h\), the fixed interval contains more steps. For a method of theoretical order \(p\), the unscaled local truncation error is \(O(h^{p+1})\) under the stated smoothness assumptions. Use the Convergence Study to check whether the selected error metric decreases and whether its observed-order status is reliable.”
- Optional helper/accessibility copy: —
- Rationale: The repository contains the competing unscaled and step-normalized conventions, and refinement does not guarantee a smoother plot or a closer endpoint value.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic/browser demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-039 — `api/chatHandler.ts` · `mockTutorResponse / truncation-error reply`

- Current text: “For a consistent method of order p, LTE is O(h^(p+1)) and global error is typically O(h^p) on a fixed interval.”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:local_truncation_scaling`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:LOCAL_TRUNCATION`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:local_truncation_error`, `TERM-V1:order_of_convergence`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `local_truncation_error`, `global_error`, `order_of_convergence`
- Exact recommended replacement: “Using the unscaled convention, local truncation error is the one-step defect produced by inserting exact data into the update, and a method of theoretical order \(p\) has local truncation error \(O(h^{p+1})\) under the stated smoothness assumptions. Global error is the propagated nodal-error family; a rate \(O(h^p)\) requires the method’s stability and regularity assumptions and a named error metric.”
- Optional helper/accessibility copy: —
- Rationale: The sentence uses one valid convention but does not name it, directly conflicting with the smaller-step reply’s O(h^p) convention.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic/browser demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-040 — `api/chatHandler.ts` · `mockTutorResponse / exam recap`

- Current text: “explain why BDF needs iteration”
- Mathematical sense: Tutor explanations of current ODE quantities under the approved teaching voice.
- Issue category: **ambiguity**
- Governing Version 1 rule IDs: `DEC-V1:signed_error_orientation`, `NOT-V1:GENERAL`, `NOT-V1:LINEAR_ALGEBRA`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:iteration_count`, `TERM-V1:newton_method`, `TERM-V1:residual`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:TUTOR`
- Affected term IDs: `newton_method`, `iteration_count`, `residual`
- Exact recommended replacement: “explain why this implementation uses nonlinear iteration to solve each implicit BDF step”
- Optional helper/accessibility copy: —
- Rationale: BDF is an implicit method family; the implementation choice and algebraic solve should be named instead of implying one universal iteration procedure.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `TUTOR_TEXT_ONLY; no model, prompt authority, API shape, request, queue, chart, or state behavior change`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Implementation group: `GROUP_D`
- Readiness: `IMPLEMENTED_ACCEPTED`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly in the authorized Group D iteration; focused API/prompt tests, structural non-change audit, and deterministic demo review passed; accepted in `0a32939c6a0bd218003ba87181f66033695c233b`.

#### Group D local implementation evidence

The focused Group D suite passed 5 files and 52 tests. Tests cover the exact
suggested questions and subtitle; theoretical/observed-order distinctions;
named maximum-global-error evidence and status; grid-point language; unscaled
LTE and qualified global-error language; graph/absolute-stability boundaries;
smaller-step limitations; BDF nonlinear-iteration wording; unavailable
evidence; compact real-model prompt policy; malformed-request JSON; the
provider request/response contract; fresh binding reads; Host behavior; and the
unchanged lazy boundary.

A strict TypeScript AST comparison against starting HEAD
`6e28ba493681a3a2d223724ba4b1688557848717` matched all 5,600 production nodes
and found only 18 authorized text-fragment changes. Request schema, validation
order, status/content types, provider/model, message roles/order, fetch options,
response parsing and shape, chart instructions, demo routing, grounding fields
and values, session/abort/transcript ownership, panel DOM/listeners/focus, and
lazy imports were unchanged.

`npm.cmd run verify` passed 73 files and 1,042 tests, both TypeScript checks, and
the 79-module production build. Isolated localhost demo/browser review at
1440×900 and 390×844 covered the approved questions and subtitle; smaller-step,
graph, theoretical/observed-order, LTE, unavailable/current/stale-filtered
Convergence, and nonlinear-diagnostic replies; Compare unavailability; focus
and wrapping; and horizontal-overflow/console health. Stiffness,
named-tolerance, step-normalized-defect, and real-provider policy remain
deterministic-test evidence only because Group D adds no reply route or network
behavior. Production retained eight JavaScript and seven CSS chunks, Tutor
remained independently lazy, and server-only prompt/reply text did not enter
browser assets. No production Glossary content, annotation, ODE binding, model
call, push, or deployment was added. Group D is accepted in
`0a32939c6a0bd218003ba87181f66033695c233b`.

### COPY-041 — `src/glossary/surface/glossarySurfaceRuntime.ts` · `complete surface / alternate display label`

- Current text: “Standard label: [entry label]”
- Mathematical sense: Glossary surface action and label language; production content remains absent.
- Issue category: **unsupported claim**
- Governing Version 1 rule IDs: `NOT-V1:MIGRATION_BOUNDARY`, `VOICE-V1:ACTIONS`, `VOICE-V1:PLAIN_CORE`
- Affected term IDs: —
- Exact recommended replacement: “Glossary term: [entry label]”
- Optional helper/accessibility copy: Preserve the entry label as the surface’s accessible name.
- Rationale: “Standard label” implies an approved terminology standard even though production content remains pending review.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `GLOSSARY_SURFACE_TEXT_ONLY; requires the later authorized content wave and must not activate production content by itself`
- Expected test files: `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts`
- Browser review: Future authorization must review Wave 1 triggers, compact preview, pinned popover, mobile sheet, focus, dismissal, and route disposal at 1440×900 and 390×844.
- Implementation group: `GROUP_E`
- Readiness: `REQUIRES_CONTENT_WAVE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: The maintainer-approved Group E0
  [ODE Glossary Wave 1 design](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md)
  retains this record as an unimplemented future E2 surface-copy decision. It
  remains `REQUIRES_CONTENT_WAVE`; E2 is unauthorized, and no production
  wording change, entry, annotation, binding, or activation exists.

### COPY-042 — `src/glossary/surface/glossarySurfaceRuntime.ts` · `preview prompt and live-region copy`

- Current text: “Click or press Enter for more.”
- Mathematical sense: Glossary surface action and label language; production content remains absent.
- Issue category: **button/action clarity**
- Governing Version 1 rule IDs: `NOT-V1:MIGRATION_BOUNDARY`, `VOICE-V1:ACTIONS`, `VOICE-V1:PLAIN_CORE`
- Affected term IDs: —
- Exact recommended replacement: “Open for definition and details.”
- Optional helper/accessibility copy: Live-region copy: Definition details opened.
- Rationale: The control is a native button, so the copy need not prescribe only mouse click or Enter and omit touch and Space.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `GLOSSARY_SURFACE_TEXT_ONLY; requires the later authorized content wave and must not activate production content by itself`
- Expected test files: `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts`
- Browser review: Future authorization must review Wave 1 triggers, compact preview, pinned popover, mobile sheet, focus, dismissal, and route disposal at 1440×900 and 390×844.
- Implementation group: `GROUP_E`
- Readiness: `REQUIRES_CONTENT_WAVE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: The maintainer-approved Group E0
  [ODE Glossary Wave 1 design](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md)
  retains this record as an unimplemented future E2 surface-copy decision. It
  remains `REQUIRES_CONTENT_WAVE`; E2 is unauthorized, and no production
  wording change, entry, annotation, binding, or activation exists.

### COPY-043 — `src/math/ui/editableMathField.ts` · `expression details / parsed label`

- Current text: “Parsed expression”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **beginner-unfriendly language**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “Interpreted expression”
- Optional helper/accessibility copy: Keep the interpreted expression paired with its displayed value.
- Rationale: “Interpreted” better describes the learner-facing normalized form without exposing parser jargon.
- Numerical-behavior risk: `NONE_COPY_ONLY; released calculations, coefficients, grids, tolerances, classifications, and solver behavior must remain unchanged`
- Runtime-behavior risk: `VISIBLE_LABEL_OR_ACCESSIBILITY_COPY; update expected-copy tests and review layout only`
- Expected test files: `src/math/ui/editableMathField.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `IMPLEMENTED_LOCALLY_GROUP_F1`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Implemented exactly as “Interpreted expression” in the separately authorized Group F1 iteration. The tests-first assertion failed only on the prior label; the final focused and cross-surface suites, full verification, desktop/mobile browser review, and production artifact audit passed. DOM, MathLive, parsing, validation, focus, virtual-keyboard ownership, and accessibility ownership remain unchanged.

### COPY-NC-001 — `src/pages/homePage.ts` · `Numerical ODE module-card description`

- Current text: “Experiment with fixed-step methods for initial value problems and analyze numerical error.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:signed_error_orientation`, `NOT-V1:GENERAL`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:initial_value_problem`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `initial_value_problem`, `global_error`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: It accurately scopes the available Lab and does not claim a specific error metric.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/pages/pages.test.ts`, `src/pages/homeResume.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-002 — `src/pages/linearAlgebraOverviewPage.ts` · `roadmap status line`

- Current text: “this module is a roadmap today and does not yet contain runnable controls.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The page accurately distinguishes a roadmap from an implemented Lab.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/pages/pages.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-003 — `src/app/platformGlossaryHost.ts` · `failure message`

- Current text: “The definition could not load. You can retry without leaving the Lab.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The message is calm, states recoverability, and offers an immediate action.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/app/platformGlossaryHost.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-004 — `src/problemPresets.ts` · `PROBLEM_PRESETS / stiff_relaxation / warning`

- Current text: “Explicit methods require very small steps for the fast mode; this is stability guidance, not a guarantee of a particular run outcome.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `DEC-V1:stiffness_definition`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:EXACT_APPROX`, `TERM-V1:absolute_stability`, `TERM-V1:step_size`, `TERM-V1:stiffness`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `stiffness`, `absolute_stability`, `step_size`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The warning explicitly limits the claim and separates guidance from a guaranteed outcome.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/problemPresets.test.ts`, `src/ode/beginnerStarter.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-005 — `src/ode/odeApp.ts` · `implicitDiagnosticsHtml / explanatory note`

- Current text: “Nonlinear-solver convergence is different from absolute stability of the numerical method.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `DEC-V1:signed_error_orientation`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:GENERAL`, `NOT-V1:LINEAR_ALGEBRA`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:absolute_stability`, `TERM-V1:newton_method`, `TERM-V1:residual`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `absolute_stability`, `residual`, `newton_method`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The sentence makes a high-value distinction without overclaiming.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_WITH_LOCAL_CONTEXT`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-006 — `src/convergenceStudyView.ts` · `renderConsistency / proof note`

- Current text: “This check is not a formal proof.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The qualification prevents a numerical diagnostic from being presented as mathematical proof.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_WITH_LOCAL_CONTEXT`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-007 — `src/convergenceStudyView.ts` · `renderChart / direction note`

- Current text: “Moving right means using a smaller step size.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `NOT-V1:EXACT_APPROX`, `TERM-V1:step_size`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `step_size`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The reversed logarithmic horizontal axis makes this short orientation cue useful.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/convergenceStudyView.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-008 — `api/chatHandler.ts` · `mockTutorResponse / missing convergence context`

- Current text: “I do not have current convergence evidence in this Tutor context, so I will not invent an observed order, error value, or interpretation.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `DEC-V1:global_error_scope`, `DEC-V1:observed_order_reliability`, `DEC-V1:signed_error_orientation`, `NOT-V1:ORDER`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:global_error`, `TERM-V1:observed_order`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `observed_order`, `global_error`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The response is evidence-bounded and uses the preferred observed-order term.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_WITH_LOCAL_CONTEXT`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-009 — `api/chatHandler.ts` · `mockTutorResponse / nonlinear diagnostics`

- Current text: “Nonlinear-solver convergence is different from absolute stability of the numerical method.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `DEC-V1:a_stability_boundary`, `DEC-V1:signed_error_orientation`, `NOT-V1:ABSOLUTE_STABILITY`, `NOT-V1:GENERAL`, `NOT-V1:LINEAR_ALGEBRA`, `NOT-V1:SIGNED_ERROR`, `TERM-V1:absolute_stability`, `TERM-V1:newton_method`, `TERM-V1:residual`, `VOICE-V1:DISTINCTIONS`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`, `VOICE-V1:SYMBOL_ACCESS`
- Affected term IDs: `absolute_stability`, `residual`, `newton_method`
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The Tutor correctly separates an algebraic solver outcome from a time-stepping stability property.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_WITH_LOCAL_CONTEXT`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-010 — `src/glossary/surface/glossarySurfaceRuntime.ts` · `complete surface section heading`

- Current text: “Why it matters here”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The heading is concise, contextual, and aligned with the teaching-voice draft.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_NO_CHANGE`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-011 — `src/math/ui/expressionErrorSummary.ts` · `validation summary heading`

- Current text: “Fix [count] expression(s) before running”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The message states the blocker and next action without blaming the learner.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: `src/math/ui/expressionErrorSummary.test.ts`
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `CONSISTENT_WITH_LOCAL_CONTEXT`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

### COPY-NC-012 — `docs/PROJECT_HANDOFF.md` · `current Glossary status`

- Current text: “Production still has no Glossary terms, annotations, or visible Glossary behavior.”
- Mathematical sense: Cross-surface learner language and accessibility wording.
- Issue category: **no change**
- Governing Version 1 rule IDs: `VOICE-V1:PLAIN_CORE`, `VOICE-V1:PREFERRED_WORDING`
- Affected term IDs: —
- Exact recommended replacement: “No change.”
- Optional helper/accessibility copy: —
- Rationale: The current handoff accurately separates local framework progress from production content.
- Numerical-behavior risk: `NONE_NO_CHANGE`
- Runtime-behavior risk: `NONE_NO_CHANGE`
- Expected test files: —
- Browser review: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Implementation group: `GROUP_F`
- Readiness: `NO_CHANGE`
- F1 classification: `STALE_BUT_NON_BLOCKING`
- Source rescan: `RESCANNED_AT_b14bf1c7_CURRENT_PATH_AND_OWNER_CONFIRMED`
- Notes: Sample retained to show reviewed language that already agrees.

#### Group F1 local implementation and review evidence

Group F1 implements only `COPY-043`. Its tests-first run failed exactly the
new label assertion while the other 12 editable-field tests passed; the final
focused file passed 13 tests. The required cross-surface run passed 13 files
and 135 tests. `npm.cmd run verify` passed 73 files and 1,042 tests, both
TypeScript checks, and the 79-module production build. Desktop/mobile
development and production-preview review confirmed the exact new label,
native disclosure focus, contained layout, accepted A–D copy, production DEV
exclusion, and no console warning or error.

The twelve `COPY-NC-*` records remain review-only. Their exact F1
classifications are recorded above and detailed in the
[pre-Glossary consistency review](../reviews/2026-07-29-pre-glossary-project-language-consistency-review.md).
No reviewed product owner was edited. The status-document owner of
`COPY-NC-012` receives only current milestone updates outside its retained,
truthful production-status statement.

The consistency scan created five stable findings, not approved copy records:

| Finding | Severity | Boundary | Current status |
|---|---:|---|---|
| `F1-LANG-001` | P2 | Residual Convergence teaching aliases for observed order and maximum global error | `CLOSED_VERIFIED` |
| `F1-LANG-002` | P2 | Solver-facing theoretical-order and LTE/global-error qualification | `CLOSED_VERIFIED` |
| `F1-LANG-003` | P2 | Residual Tutor order and maximum-global-error terminology | `CLOSED_VERIFIED` |
| `F1-LANG-004` | P2 | Numerical-approximation naming in the ODE chart and Tutor graph reply | `CLOSED_VERIFIED` |
| `F1-BEH-001` | P2 | Deterministic `unstable` → `table` substring-routing collision | `CLOSED_VERIFIED` |

No fix was implemented in the Group F1 review itself. The later, separately
authorized
[pre-Glossary repair](../reviews/2026-07-29-pre-glossary-repair-review.md)
closes all five findings after tests-first gates, 161 cumulative focused tests,
the 1,048-test full verification gate, desktop/mobile deterministic demo
review, structural/numerical audit, and production artifact inspection. Group
E0 design and content governance is now maintainer-approved. E1 and E2
implementation and E3/F2 execution remain unauthorized, and Group F2 remains
required after E3.

## Behavior-preservation contract

- Copy-only changes may update expected-copy tests but may not change
  calculations, coefficients, grid rules, classifications, tolerances,
  stopping rules, session state, requests, ownership, or lifecycle.
- Accessibility-copy changes preserve the same control role and action.
- Longer visible labels require layout review; wrapping is not a behavior
  reason to abbreviate away an approved mathematical distinction.
- A wording recommendation that would imply a capability not present is
  deferred rather than presented as copy-only work.
- `COPY-041` and `COPY-042` remain tied to the unauthorized production
  content wave; editing those strings alone must not activate a surface.

## Implementation order

The exact A–F boundaries, files, tests, browser checks, dependencies,
rollback points, and review gates are in the
[Project Language Implementation Plan](PROJECT_LANGUAGE_IMPLEMENTATION_PLAN.md).
Groups A through D are accepted; `COPY-003` remains held. The maintainer has
accepted the Group F1 and pre-Glossary repair commits as prerequisite state.
The historical Group F1 verdict remains **GROUP F1 COMPLETE — PRE-E FIXES
REQUIRED**, and all five resulting findings remain `CLOSED_VERIFIED` with
repair verdict **PRE-E REPAIR COMPLETE — GROUP E MAY BE PLANNED**.

Group E0 is complete and maintainer-approved for exactly ten revised ODE
Glossary Wave 1 term cards, ten annotation design records, and D01–D18 Option
A. The accepted rich model supports the separately authorized E1 inert
content implementation: exactly two Core entries, eight ODE entries, two
context-only overrides, and ten composed cards now exist in source, while the
production registry/importer, annotation, binding, and visible-behavior counts
remain zero. This does not change the readiness of `COPY-041` or `COPY-042`;
both remain future E2 surface-copy decisions. The next gate is maintainer
acceptance of E1. E2, E3, and F2 remain separately gated and unauthorized.
The original full Group F is not complete; Group F2 remains required after E3.
