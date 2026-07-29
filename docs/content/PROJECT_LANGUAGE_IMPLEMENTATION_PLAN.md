# Numerical T-Lab Project Language Implementation Plan

Status: Implementation plan complete; no implementation group is authorized
by this document alone.

## Purpose and execution boundary

This plan converts the reconciled
[Glossary Catalog](GLOSSARY_CATALOG.md) and
[Project Copy Audit](PROJECT_COPY_AUDIT.md) into six reviewable future
implementation groups. It does not implement any group, publish production
Glossary content, activate an ODE binding, or modify Tutor/numerical behavior.

Groups are sequential unless a later maintainer instruction explicitly
changes the dependency. Each source-changing group requires its own clean
starting state, exact diff review, focused tests, applicable broader
verification, and browser evidence. Group E is expressly unauthorized and
requires a separate design/content implementation task.

## A–F implementation groups

### GROUP_A — Platform and overview copy

- Objective: Align current platform, About, roadmap, and public-status language with the accepted framework and Project Language Standard v1.
- Record count: **5**.
- Exact `COPY-*` records: `COPY-001`, `COPY-002`, `COPY-003`, `COPY-004`, `COPY-005`
- Ready records: `COPY-001`, `COPY-002`, `COPY-004`, `COPY-005`
- Held or review-only records: `COPY-003`
- Exact file count: **4**.
- Exact edit/review files: `README.md`, `src/pages/aboutPage.ts`, `src/pages/homePage.ts`, `src/pages/odeOverviewPage.ts`
- Ready edit files: `README.md`, `src/pages/aboutPage.ts`, `src/pages/odeOverviewPage.ts`
- Held or review-only files: `src/pages/homePage.ts`
- Term IDs: `absolute_stability`, `stability_region`, `numerical_stability`, `global_error`, `grid_spacing`
- Tests: `src/pages/pages.test.ts`, `src/pages/homeResume.test.ts`
- Browser routes/viewports: Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus.
- Numerical non-changes: No route, status model, numerical behavior, lazy boundary, or module availability change.
- Architecture boundaries: Keep page modules static and platform-owned; do not import Glossary or ODE runtime into Home/static routes.
- Proposed commit message: `Align platform and overview language`
- Review gate: Focused page tests, exact-copy review, and desktop/mobile review of all platform overview routes.
- Rollback boundary: Revert the single copy commit; no state or data migration is involved.
- Dependencies: `Reconciled copy audit`, `Project Language Standard v1`
- Authorization: `PLANNED_NOT_AUTHORIZED_BY_THIS_DOCUMENT`

### GROUP_B — IVP Method/Data/Output and presets

- Objective: Use exact IVP method, grid, approximation, reference, stability, and diagnostic language across the current Lab.
- Record count: **14**.
- Exact `COPY-*` records: `COPY-006`, `COPY-007`, `COPY-008`, `COPY-009`, `COPY-010`, `COPY-011`, `COPY-012`, `COPY-013`, `COPY-014`, `COPY-015`, `COPY-016`, `COPY-017`, `COPY-018`, `COPY-019`
- Ready records: `COPY-006`, `COPY-007`, `COPY-008`, `COPY-009`, `COPY-010`, `COPY-011`, `COPY-012`, `COPY-013`, `COPY-014`, `COPY-015`, `COPY-016`, `COPY-017`, `COPY-018`, `COPY-019`
- Held or review-only records: —
- Exact file count: **4**.
- Exact edit/review files: `src/grid.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/problemPresets.ts`
- Ready edit files: `src/grid.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/problemPresets.ts`
- Held or review-only files: —
- Term IDs: `absolute_stability`, `exact_solution`, `global_error`, `initial_value_problem`, `iteration_count`, `numerical_approximation`, `observed_order`, `order_of_convergence`, `step_size`, `time_grid`
- Tests: `src/grid.test.ts`, `src/ode/beginnerStarter.test.ts`, `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts`, `src/ode/odeLifecycle.test.ts`, `src/problemPresets.test.ts`
- Browser routes/viewports: Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states.
- Numerical non-changes: No solver, coefficient, startup, grid/alignment, step budget, nonlinear stopping rule, exact-solution check, or result-state change.
- Architecture boundaries: Keep method metadata in methodCatalog, preset language in problemPresets, validation copy in grid, and view copy in the Lab.
- Proposed commit message: `Align IVP workflow language`
- Review gate: Focused owner tests, full ODE workflow copy review, and desktop/mobile Method/Data/Output/Compare browser review.
- Rollback boundary: Revert the copy-only commit; immutable result and session representations remain compatible.
- Dependencies: `Group A accepted`, `Project Language Standard v1`
- Authorization: `PLANNED_NOT_AUTHORIZED_BY_THIS_DOCUMENT`

### GROUP_C — Convergence and error language

- Objective: Apply approved names for final-time error, maximum global error, theoretical and observed order, evidence status, and asymptotic-region interpretation.
- Record count: **10**.
- Exact `COPY-*` records: `COPY-020`, `COPY-021`, `COPY-022`, `COPY-023`, `COPY-024`, `COPY-025`, `COPY-026`, `COPY-027`, `COPY-028`, `COPY-029`
- Ready records: `COPY-020`, `COPY-021`, `COPY-022`, `COPY-023`, `COPY-024`, `COPY-025`, `COPY-026`, `COPY-027`, `COPY-028`, `COPY-029`
- Held or review-only records: —
- Exact file count: **3**.
- Exact edit/review files: `src/convergenceStudy.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts`
- Ready edit files: `src/convergenceStudy.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts`
- Held or review-only files: —
- Term IDs: `absolute_error`, `relative_error`, `nodal_error`, `global_error`, `final_time_error`, `maximum_global_error`, `local_truncation_error`, `truncation_error`, `discretization_error`, `observed_order`, `order_of_convergence`, `asymptotic_region`, `convergence`
- Tests: `src/convergenceStudy.test.ts`, `src/convergenceStudyOrder.test.ts`, `src/convergenceStudyView.test.ts`, `src/convergenceTeaching.test.ts`, `src/mainConvergenceIntegration.test.ts`
- Browser routes/viewports: Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording.
- Numerical non-changes: Preserve every error calculation, refinement level, eligibility rule, reliability status, precedence, classification, tolerance, and chart datum.
- Architecture boundaries: Change view/teaching strings and expected-copy tests only; do not move interpretation ownership or alter Tutor context contracts.
- Proposed commit message: `Align convergence and error language`
- Review gate: Focused Convergence tests, formula/accessibility review, released-contract diff, and eligible/blocked desktop/mobile browser review.
- Rollback boundary: Revert the copy commit; stored Convergence snapshots and numerical outputs remain byte-compatible.
- Dependencies: `Group B accepted`, `Approved error and observed-order rules`
- Authorization: `PLANNED_NOT_AUTHORIZED_BY_THIS_DOCUMENT`

### GROUP_D — Tutor language

- Objective: Make suggested questions and grounded mock replies use the approved error, order, stability, stiffness, tolerance, and residual distinctions.
- Record count: **11**.
- Exact `COPY-*` records: `COPY-030`, `COPY-031`, `COPY-032`, `COPY-033`, `COPY-034`, `COPY-035`, `COPY-036`, `COPY-037`, `COPY-038`, `COPY-039`, `COPY-040`
- Ready records: `COPY-030`, `COPY-031`, `COPY-032`, `COPY-033`, `COPY-034`, `COPY-035`, `COPY-036`, `COPY-037`, `COPY-038`, `COPY-039`, `COPY-040`
- Held or review-only records: —
- Exact file count: **3**.
- Exact edit/review files: `api/chatHandler.ts`, `src/ode/odeTutorBinding.ts`, `src/tutor/platformTutorPanel.ts`
- Ready edit files: `api/chatHandler.ts`, `src/ode/odeTutorBinding.ts`, `src/tutor/platformTutorPanel.ts`
- Held or review-only files: —
- Term IDs: `absolute_stability`, `global_error`, `local_truncation_error`, `nodal_error`, `numerical_approximation`, `observed_order`, `order_of_convergence`, `residual`, `step_size`, `stiffness`, `tolerance`
- Tests: `src/ode/odeTutorBinding.test.ts`, `src/app/platformTutorHost.test.ts`, `src/app/tutorLazyBoundary.test.ts`, `api/chatHandler.test.ts`, `api/chatPrompt.test.ts`
- Browser routes/viewports: After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state.
- Numerical non-changes: No model, API, system authority, queue, request, abort, state, transcript, chart-instruction, or rendering behavior change.
- Architecture boundaries: Keep domain context in the ODE binding, presentation in the platform Tutor panel, and server-side response wording in chatHandler.
- Proposed commit message: `Align Tutor numerical language`
- Review gate: Focused Tutor/API tests plus desktop/mobile prompt and response review after a successful run.
- Rollback boundary: Revert the Tutor-copy commit; request and session contracts are unchanged.
- Dependencies: `Groups B and C accepted`, `Teaching Voice v1`
- Authorization: `PLANNED_NOT_AUTHORIZED_BY_THIS_DOCUMENT`

### GROUP_E — Production Glossary Wave 1

- Objective: In a later separately authorized task, implement the reviewed ten-term Wave 1 data and current ODE annotations through the existing framework contracts.
- Record count: **2**.
- Exact `COPY-*` records: `COPY-041`, `COPY-042`
- Ready records: —
- Held or review-only records: `COPY-041`, `COPY-042`
- Exact file count: **4**.
- Exact edit/review files: `src/glossary/coreGlossary.ts`, `src/glossary/surface/glossarySurfaceRuntime.ts`, `src/ode/initialValueProblemsRoute.ts`, `src/ode/odeGlossary.ts (planned new file)`
- Ready edit files: —
- Held or review-only files: `src/glossary/coreGlossary.ts`, `src/glossary/surface/glossarySurfaceRuntime.ts`, `src/ode/initialValueProblemsRoute.ts`, `src/ode/odeGlossary.ts (planned new file)`
- Term IDs: `ordinary_differential_equation`, `initial_value_problem`, `initial_condition`, `numerical_approximation`, `exact_solution`, `step_size`, `time_grid`, `explicit_scheme`, `forward_euler_method`, `backward_euler_method`
- Tests: `src/glossary/glossaryRegistry.test.ts`, `src/glossary/glossaryBuilders.test.ts`, `src/glossary/glossaryController.test.ts`, `src/app/labRouteAdapter.test.ts`, `src/app/platformGlossaryHost.test.ts`, `src/ode/initialValueProblemsRoute.test.ts`
- Browser routes/viewports: Future authorization must review Wave 1 triggers, compact preview, pinned popover, mobile sheet, focus, dismissal, and route disposal at 1440×900 and 390×844.
- Numerical non-changes: No numerical, session-store, Tutor queue/API/card, modal ownership, production Playground, or automatic DOM-scanning change.
- Architecture boundaries: Use src/glossary/coreGlossary.ts, a planned src/ode/odeGlossary.ts module, explicit composition sites, a Lab-owned binding, and the existing optional Host port.
- Proposed commit message: `Add reviewed ODE Glossary Wave 1`
- Review gate: Separate design/content authorization, card review, tests, bundle graph check, production-exclusion check, and desktop/mobile accessibility browser review.
- Rollback boundary: Revert Wave 1 data, annotations, and ODE binding together so the Host returns to its inert production state.
- Dependencies: `Groups A–D accepted`, `Wave 1 content approval`, `Separate implementation authorization`
- Authorization: `UNAUTHORIZED_REQUIRES_SEPARATE_TASK`

### GROUP_F — Cross-surface consistency review

- Objective: Verify UI, Glossary, Tutor, accessibility, mobile/desktop layout, terminology scans, and documentation contain no stale or contradictory wording.
- Record count: **13**.
- Exact `COPY-*` records: `COPY-043`, `COPY-NC-001`, `COPY-NC-002`, `COPY-NC-003`, `COPY-NC-004`, `COPY-NC-005`, `COPY-NC-006`, `COPY-NC-007`, `COPY-NC-008`, `COPY-NC-009`, `COPY-NC-010`, `COPY-NC-011`, `COPY-NC-012`
- Ready records: `COPY-043`
- Held or review-only records: `COPY-NC-001`, `COPY-NC-002`, `COPY-NC-003`, `COPY-NC-004`, `COPY-NC-005`, `COPY-NC-006`, `COPY-NC-007`, `COPY-NC-008`, `COPY-NC-009`, `COPY-NC-010`, `COPY-NC-011`, `COPY-NC-012`
- Exact file count: **11**.
- Exact edit/review files: `api/chatHandler.ts`, `docs/PROJECT_HANDOFF.md`, `src/app/platformGlossaryHost.ts`, `src/convergenceStudyView.ts`, `src/glossary/surface/glossarySurfaceRuntime.ts`, `src/math/ui/editableMathField.ts`, `src/math/ui/expressionErrorSummary.ts`, `src/ode/odeApp.ts`, `src/pages/homePage.ts`, `src/pages/linearAlgebraOverviewPage.ts`, `src/problemPresets.ts`
- Ready edit files: `src/math/ui/editableMathField.ts`
- Held or review-only files: `api/chatHandler.ts`, `docs/PROJECT_HANDOFF.md`, `src/app/platformGlossaryHost.ts`, `src/convergenceStudyView.ts`, `src/glossary/surface/glossarySurfaceRuntime.ts`, `src/math/ui/expressionErrorSummary.ts`, `src/ode/odeApp.ts`, `src/pages/homePage.ts`, `src/pages/linearAlgebraOverviewPage.ts`, `src/problemPresets.ts`
- Term IDs: `a_stability`, `absolute_error`, `absolute_stability`, `asymptotic_region`, `condition_number`, `convergence`, `final_time_error`, `global_error`, `linear_system`, `local_truncation_error`, `matrix`, `matrix_norm`, `maximum_global_error`, `nodal_error`, `observed_order`, `order_of_convergence`, `relative_error`, `residual`, `scalar`, `stability_function`, `stability_region`, `step_size`, `stiffness`, `tolerance`, `truncation_error`, `vector`, `vector_norm`
- Tests: `src/pages/pages.test.ts`, `src/ode/initialValueProblemsRoute.test.ts`, `src/convergenceStudyView.test.ts`, `src/convergenceTeaching.test.ts`, `src/ode/odeTutorBinding.test.ts`, `api/chatHandler.test.ts`, `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/math/ui/editableMathField.test.ts`
- Browser routes/viewports: Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review.
- Numerical non-changes: Audit and copy corrections only; any behavior, numerical, architecture, or content expansion becomes a separate task.
- Architecture boundaries: Inspect existing ownership and lazy boundaries; do not consolidate strings across domain boundaries merely for symmetry.
- Proposed commit message: `Complete project language consistency review`
- Review gate: Focused and full verification required by the accumulated source scope, terminology scans, and wide/mobile browser evidence.
- Rollback boundary: Revert only the narrow consistency commit; earlier accepted groups remain intact.
- Dependencies: `Groups A–E accepted as applicable`
- Authorization: `PLANNED_NOT_AUTHORIZED_BY_THIS_DOCUMENT`

## Term-to-standards and term-to-copy traceability

Each terminology rule points to the exact stable-ID row. Notation and voice
IDs resolve through the rule registry in the copy audit. An em dash in the
copy column means the term was reconciled but is not touched by one of the
55 rescanned records.

| Term ID | Terminology rule | Notation rules | Teaching-voice rules | Decision rules | COPY records | Files/surfaces |
|---|---|---|---|---|---|---|
| `a_stability` | `TERM-V1:a_stability` | `NOT-V1:ABSOLUTE_STABILITY` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:a_stability_boundary` | `COPY-007` | `src/methodCatalog.ts` |
| `absolute_error` | `TERM-V1:absolute_error` | `NOT-V1:ABS_REL_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | — | — | — |
| `absolute_stability` | `TERM-V1:absolute_stability` | `NOT-V1:ABSOLUTE_STABILITY` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:a_stability_boundary` | `COPY-004`, `COPY-007`, `COPY-013`, `COPY-037`, `COPY-NC-004`, `COPY-NC-005`, `COPY-NC-009` | `api/chatHandler.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/pages/odeOverviewPage.ts`, `src/problemPresets.ts` |
| `adams_bashforth_method` | `TERM-V1:adams_bashforth_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `adams_moulton_method` | `TERM-V1:adams_moulton_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `adaptive_approximation` | `TERM-V1:adaptive_approximation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `adaptive_quadrature` | `TERM-V1:adaptive_quadrature` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `adi_method` | `TERM-V1:adi_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `amplification_factor` | `TERM-V1:amplification_factor` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `asymptotic_region` | `TERM-V1:asymptotic_region` | `NOT-V1:ORDER` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:observed_order_reliability` | `COPY-026` | `src/convergenceTeaching.ts` |
| `b_spline` | `TERM-V1:b_spline` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `backward_error` | `TERM-V1:backward_error` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `backward_euler_method` | `TERM-V1:backward_euler_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | — | — |
| `band_matrix` | `TERM-V1:band_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `basic_concepts_and_taylor_theorem` | `TERM-V1:basic_concepts_and_taylor_theorem` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `bdf_method` | `TERM-V1:bdf_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `best_approximation_chebyshev_theory` | `TERM-V1:best_approximation_chebyshev_theory` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `best_approximation_least_squares_theory` | `TERM-V1:best_approximation_least_squares_theory` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `big_o_notation` | `TERM-V1:big_o_notation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `bisection_method` | `TERM-V1:bisection_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `boundary_condition` | `TERM-V1:boundary_condition` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `boundary_value_problem` | `TERM-V1:boundary_value_problem` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `central_difference` | `TERM-V1:central_difference` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `characteristic_curve` | `TERM-V1:characteristic_curve` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `cholesky_factorization` | `TERM-V1:cholesky_factorization` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `collocation_method` | `TERM-V1:collocation_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `column_space` | `TERM-V1:column_space` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `computational_cost` | `TERM-V1:computational_cost` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `condition_number` | `TERM-V1:condition_number` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `conditioning` | `TERM-V1:conditioning` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `continuation_method` | `TERM-V1:continuation_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `continued_fractions` | `TERM-V1:continued_fractions` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `convection_diffusion_equation` | `TERM-V1:convection_diffusion_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `convergence` | `TERM-V1:convergence` | `NOT-V1:ORDER` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:observed_order_reliability` | `COPY-032` | `src/tutor/platformTutorPanel.ts` |
| `convexity` | `TERM-V1:convexity` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `crank_nicolson_method` | `TERM-V1:crank_nicolson_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `deflation` | `TERM-V1:deflation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `determinant` | `TERM-V1:determinant` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `diagonalization` | `TERM-V1:diagonalization` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `difference_equations` | `TERM-V1:difference_equations` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `diffusion` | `TERM-V1:diffusion` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `discretization_error` | `TERM-V1:discretization_error` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `divided_difference` | `TERM-V1:divided_difference` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `dot_product` | `TERM-V1:dot_product` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `downwind_scheme` | `TERM-V1:downwind_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `eigenvalue` | `TERM-V1:eigenvalue` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `eigenvector` | `TERM-V1:eigenvector` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `energy_method` | `TERM-V1:energy_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `equilibrium` | `TERM-V1:equilibrium` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `euclidean_norm` | `TERM-V1:euclidean_norm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `euler_maclaurin_formula` | `TERM-V1:euler_maclaurin_formula` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `exact_solution` | `TERM-V1:exact_solution` | `NOT-V1:EXACT_APPROX` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | `COPY-016`, `COPY-017`, `COPY-022`, `COPY-027` | `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts`, `src/ode/odeApp.ts` |
| `existence_and_uniqueness_of_solutions` | `TERM-V1:existence_and_uniqueness_of_solutions` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `explicit_scheme` | `TERM-V1:explicit_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | — | — |
| `fast_fourier_transform` | `TERM-V1:fast_fourier_transform` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `final_time_error` | `TERM-V1:final_time_error` | `NOT-V1:SIGNED_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:signed_error_orientation`, `DEC-V1:global_error_scope` | `COPY-023`, `COPY-024`, `COPY-028`, `COPY-038` | `api/chatHandler.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts` |
| `finite_difference` | `TERM-V1:finite_difference` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `finite_difference_scheme` | `TERM-V1:finite_difference_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `fixed_point_iteration` | `TERM-V1:fixed_point_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `floating_point_number` | `TERM-V1:floating_point_number` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `forward_error` | `TERM-V1:forward_error` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `forward_euler_method` | `TERM-V1:forward_euler_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | — | — |
| `fourier_analysis` | `TERM-V1:fourier_analysis` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `frobenius_norm` | `TERM-V1:frobenius_norm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `gauss_seidel_iteration` | `TERM-V1:gauss_seidel_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `gaussian_elimination` | `TERM-V1:gaussian_elimination` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `gaussian_quadrature` | `TERM-V1:gaussian_quadrature` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `global_error` | `TERM-V1:global_error` | `NOT-V1:SIGNED_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:signed_error_orientation`, `DEC-V1:global_error_scope` | `COPY-005`, `COPY-006`, `COPY-008`, `COPY-013`, `COPY-027`, `COPY-032`, `COPY-037`, `COPY-039`, `COPY-NC-001`, `COPY-NC-008` | `api/chatHandler.ts`, `src/convergenceTeaching.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/pages/aboutPage.ts`, `src/pages/homePage.ts`, `src/problemPresets.ts`, `src/tutor/platformTutorPanel.ts` |
| `gram_schmidt` | `TERM-V1:gram_schmidt` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `grid_point` | `TERM-V1:grid_point` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `grid_spacing` | `TERM-V1:grid_spacing` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | `COPY-003` | `src/pages/homePage.ts` |
| `heat_equation` | `TERM-V1:heat_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `hermite_interpolation` | `TERM-V1:hermite_interpolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `hessenberg_matrix` | `TERM-V1:hessenberg_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `higher_order_ode` | `TERM-V1:higher_order_ode` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `homotopy_method` | `TERM-V1:homotopy_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `householder_reflector` | `TERM-V1:householder_reflector` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `hyperbolic_pde` | `TERM-V1:hyperbolic_pde` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `implicit_scheme` | `TERM-V1:implicit_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `induced_matrix_norm` | `TERM-V1:induced_matrix_norm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `infinity_norm` | `TERM-V1:infinity_norm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `initial_condition` | `TERM-V1:initial_condition` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | — | — |
| `initial_value_problem` | `TERM-V1:initial_value_problem` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | `COPY-006`, `COPY-027`, `COPY-036`, `COPY-NC-001` | `api/chatHandler.ts`, `src/convergenceTeaching.ts`, `src/ode/odeApp.ts`, `src/pages/homePage.ts` |
| `interpolation_in_higher_dimensions` | `TERM-V1:interpolation_in_higher_dimensions` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `inverse_iteration` | `TERM-V1:inverse_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `invertible_matrix` | `TERM-V1:invertible_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `iteration_count` | `TERM-V1:iteration_count` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | `COPY-015`, `COPY-035`, `COPY-040` | `api/chatHandler.ts`, `src/ode/odeApp.ts` |
| `jacobi_iteration` | `TERM-V1:jacobi_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `lagrange_interpolation` | `TERM-V1:lagrange_interpolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `laplace_equation` | `TERM-V1:laplace_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `lax_equivalence_theorem` | `TERM-V1:lax_equivalence_theorem` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `lax_friedrichs_scheme` | `TERM-V1:lax_friedrichs_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `lax_wendroff_scheme` | `TERM-V1:lax_wendroff_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `leapfrog_method` | `TERM-V1:leapfrog_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `least_squares_problem` | `TERM-V1:least_squares_problem` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `linear_differential_equations` | `TERM-V1:linear_differential_equations` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `linear_inequalities` | `TERM-V1:linear_inequalities` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `linear_programming` | `TERM-V1:linear_programming` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `linear_system` | `TERM-V1:linear_system` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `little_o_notation` | `TERM-V1:little_o_notation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `local_truncation_error` | `TERM-V1:local_truncation_error` | `NOT-V1:LOCAL_TRUNCATION` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:local_truncation_scaling` | `COPY-038`, `COPY-039` | `api/chatHandler.ts` |
| `loss_of_significance` | `TERM-V1:loss_of_significance` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `low_rank_approximation` | `TERM-V1:low_rank_approximation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `lu_factorization` | `TERM-V1:lu_factorization` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `machine_epsilon` | `TERM-V1:machine_epsilon` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `matrix` | `TERM-V1:matrix` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `matrix_matrix_multiplication` | `TERM-V1:matrix_matrix_multiplication` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `matrix_norm` | `TERM-V1:matrix_norm` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `matrix_vector_multiplication` | `TERM-V1:matrix_vector_multiplication` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `maximum_global_error` | `TERM-V1:maximum_global_error` | `NOT-V1:SIGNED_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:signed_error_orientation`, `DEC-V1:global_error_scope` | `COPY-020`, `COPY-023`, `COPY-024`, `COPY-028`, `COPY-029` | `src/convergenceStudy.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts` |
| `model_error` | `TERM-V1:model_error` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `multigrid_method` | `TERM-V1:multigrid_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `multistep_method` | `TERM-V1:multistep_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `neumann_series_and_iterative_refinement` | `TERM-V1:neumann_series_and_iterative_refinement` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `newton_method` | `TERM-V1:newton_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | `COPY-040`, `COPY-NC-005`, `COPY-NC-009` | `api/chatHandler.ts`, `src/ode/odeApp.ts` |
| `nodal_error` | `TERM-V1:nodal_error` | `NOT-V1:SIGNED_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:signed_error_orientation` | — | — |
| `normal_equations` | `TERM-V1:normal_equations` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `norms_and_the_analysis_of_errors` | `TERM-V1:norms_and_the_analysis_of_errors` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `null_space` | `TERM-V1:null_space` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `numerical_approximation` | `TERM-V1:numerical_approximation` | `NOT-V1:EXACT_APPROX` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | `COPY-007`, `COPY-016`, `COPY-017`, `COPY-018`, `COPY-022`, `COPY-037` | `api/chatHandler.ts`, `src/convergenceStudyView.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts` |
| `numerical_differentiation` | `TERM-V1:numerical_differentiation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `numerical_integration` | `TERM-V1:numerical_integration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `numerical_stability` | `TERM-V1:numerical_stability` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | `COPY-003`, `COPY-005`, `COPY-029`, `COPY-032` | `src/convergenceStudy.ts`, `src/pages/aboutPage.ts`, `src/pages/homePage.ts`, `src/tutor/platformTutorPanel.ts` |
| `observed_order` | `TERM-V1:observed_order` | `NOT-V1:ORDER` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:observed_order_reliability` | `COPY-006`, `COPY-009`, `COPY-010`, `COPY-020`, `COPY-021`, `COPY-023`, `COPY-025`, `COPY-026`, `COPY-029`, `COPY-030`, `COPY-033`, `COPY-034`, `COPY-038`, `COPY-NC-008` | `api/chatHandler.ts`, `src/convergenceStudy.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/ode/odeTutorBinding.ts` |
| `ode_consistency` | `TERM-V1:ode_consistency` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `one_step_method` | `TERM-V1:one_step_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `operator_splitting` | `TERM-V1:operator_splitting` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `order_of_convergence` | `TERM-V1:order_of_convergence` | `NOT-V1:ORDER` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:observed_order_reliability` | `COPY-008`, `COPY-009`, `COPY-010`, `COPY-021`, `COPY-030`, `COPY-033`, `COPY-039` | `api/chatHandler.ts`, `src/convergenceStudyView.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/ode/odeTutorBinding.ts` |
| `ordinary_differential_equation` | `TERM-V1:ordinary_differential_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS` | — | — | — |
| `orthogonal_matrix` | `TERM-V1:orthogonal_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `orthogonal_projection` | `TERM-V1:orthogonal_projection` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `other_methods_for_hyperbolic_problems` | `TERM-V1:other_methods_for_hyperbolic_problems` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `overflow` | `TERM-V1:overflow` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `p_norm` | `TERM-V1:p_norm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `parabolic_pde` | `TERM-V1:parabolic_pde` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `partial_differential_equation` | `TERM-V1:partial_differential_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `partial_pivoting` | `TERM-V1:partial_pivoting` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `permutation_matrix` | `TERM-V1:permutation_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `pivot` | `TERM-V1:pivot` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `plu_factorization` | `TERM-V1:plu_factorization` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `poisson_equation` | `TERM-V1:poisson_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `polynomial_degree` | `TERM-V1:polynomial_degree` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `polynomial_interpolation` | `TERM-V1:polynomial_interpolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `polynomial_zero` | `TERM-V1:polynomial_zero` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `power_iteration` | `TERM-V1:power_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `problems_without_time_dependence_galerkin_and_ritz_methods` | `TERM-V1:problems_without_time_dependence_galerkin_and_ritz_methods` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `pseudoinverse` | `TERM-V1:pseudoinverse` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `qr_factorization` | `TERM-V1:qr_factorization` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `qr_iteration` | `TERM-V1:qr_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `quadrature` | `TERM-V1:quadrature` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `rank` | `TERM-V1:rank` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `rayleigh_quotient` | `TERM-V1:rayleigh_quotient` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `relative_error` | `TERM-V1:relative_error` | `NOT-V1:ABS_REL_ERROR` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:relative_error_denominator` | — | — |
| `residual` | `TERM-V1:residual` | `NOT-V1:SIGNED_ERROR`, `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:signed_error_orientation` | `COPY-040`, `COPY-NC-005`, `COPY-NC-009` | `api/chatHandler.ts`, `src/ode/odeApp.ts` |
| `richardson_extrapolation` | `TERM-V1:richardson_extrapolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `romberg_integration` | `TERM-V1:romberg_integration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `roundoff_error` | `TERM-V1:roundoff_error` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `row_operation` | `TERM-V1:row_operation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `runge_kutta_method` | `TERM-V1:runge_kutta_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `sard_theory_of_approximating_functionals` | `TERM-V1:sard_theory_of_approximating_functionals` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `scalar` | `TERM-V1:scalar` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `schur_and_gershgorin_theorems` | `TERM-V1:schur_and_gershgorin_theorems` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `secant_method` | `TERM-V1:secant_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `shifted_iteration` | `TERM-V1:shifted_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `shooting_method` | `TERM-V1:shooting_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `simplex_algorithm` | `TERM-V1:simplex_algorithm` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `singular_matrix` | `TERM-V1:singular_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `singular_value` | `TERM-V1:singular_value` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `singular_value_decomposition` | `TERM-V1:singular_value_decomposition` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `smoothing` | `TERM-V1:smoothing` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `solution_of_equations_by_iterative_methods` | `TERM-V1:solution_of_equations_by_iterative_methods` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `sparse_matrix` | `TERM-V1:sparse_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `spatial_grid` | `TERM-V1:spatial_grid` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `spectral_radius` | `TERM-V1:spectral_radius` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `spline_interpolation` | `TERM-V1:spline_interpolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `stability_function` | `TERM-V1:stability_function` | `NOT-V1:ABSOLUTE_STABILITY` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:a_stability_boundary` | — | — |
| `stability_region` | `TERM-V1:stability_region` | `NOT-V1:ABSOLUTE_STABILITY` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:a_stability_boundary` | `COPY-004`, `COPY-007` | `src/methodCatalog.ts`, `src/pages/odeOverviewPage.ts` |
| `stable_equilibrium` | `TERM-V1:stable_equilibrium` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `stationary_iteration` | `TERM-V1:stationary_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `step_size` | `TERM-V1:step_size` | `NOT-V1:EXACT_APPROX` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | — | `COPY-006`, `COPY-008`, `COPY-012`, `COPY-014`, `COPY-031`, `COPY-036`, `COPY-038`, `COPY-NC-004`, `COPY-NC-007` | `api/chatHandler.ts`, `src/convergenceStudyView.ts`, `src/grid.ts`, `src/methodCatalog.ts`, `src/ode/odeApp.ts`, `src/ode/odeTutorBinding.ts`, `src/problemPresets.ts` |
| `stiffness` | `TERM-V1:stiffness` | `NOT-V1:ABSOLUTE_STABILITY` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:EPISTEMIC`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:stiffness_definition` | `COPY-NC-004` | `src/problemPresets.ts` |
| `stopping_criterion` | `TERM-V1:stopping_criterion` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `subspace_iteration` | `TERM-V1:subspace_iteration` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `symmetric_matrix` | `TERM-V1:symmetric_matrix` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `taylor_method` | `TERM-V1:taylor_method` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `taylor_series` | `TERM-V1:taylor_series` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `time_grid` | `TERM-V1:time_grid` | `NOT-V1:EXACT_APPROX` | `VOICE-V1:PLAIN_CORE` | — | `COPY-011`, `COPY-014`, `COPY-015`, `COPY-019`, `COPY-035` | `api/chatHandler.ts`, `src/grid.ts`, `src/ode/odeApp.ts` |
| `tolerance` | `TERM-V1:tolerance` | `NOT-V1:TOLERANCE` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:tolerance_scopes` | `COPY-029` | `src/convergenceStudy.ts` |
| `trigonometric_interpolation` | `TERM-V1:trigonometric_interpolation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `truncation_error` | `TERM-V1:truncation_error` | `NOT-V1:LOCAL_TRUNCATION` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:local_truncation_scaling` | — | — |
| `underflow` | `TERM-V1:underflow` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `upwind_scheme` | `TERM-V1:upwind_scheme` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `vector` | `TERM-V1:vector` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `vector_norm` | `TERM-V1:vector_norm` | `NOT-V1:LINEAR_ALGEBRA` | `VOICE-V1:PLAIN_CORE`, `VOICE-V1:SYMBOL_ACCESS`, `VOICE-V1:DISTINCTIONS` | `DEC-V1:matrix_vector_typography` | — | — |
| `von_neumann_analysis` | `TERM-V1:von_neumann_analysis` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `wave_equation` | `TERM-V1:wave_equation` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |
| `zero_stability` | `TERM-V1:zero_stability` | `NOT-V1:GENERAL` | `VOICE-V1:PLAIN_CORE` | — | — | — |

## Copy-to-group, tests, and browser traceability

| COPY record | Group | Expected tests | Browser check |
|---|---|---|---|
| `COPY-001` | `GROUP_A` | `src/pages/pages.test.ts` | Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus. |
| `COPY-002` | `GROUP_A` | — | Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus. |
| `COPY-003` | `GROUP_A` | `src/pages/pages.test.ts`, `src/pages/homeResume.test.ts` | Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus. |
| `COPY-004` | `GROUP_A` | `src/pages/pages.test.ts` | Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus. |
| `COPY-005` | `GROUP_A` | `src/pages/pages.test.ts` | Review /, /about, /ode, /linear-algebra, and /pde at 1440×900 and 390×844; check wrapping, status truth, and keyboard focus. |
| `COPY-006` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-007` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-008` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-009` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/newExperiment.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-010` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-011` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-012` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-013` | `GROUP_B` | `src/problemPresets.test.ts`, `src/ode/beginnerStarter.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-014` | `GROUP_B` | `src/grid.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-015` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-016` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-017` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-018` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-019` | `GROUP_B` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Review /ode/initial-value-problems at 1440×900 and 390×844 through Method, Data, Run, Output, Compare, preset, and error states. |
| `COPY-020` | `GROUP_C` | `src/convergenceStudyView.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-021` | `GROUP_C` | `src/convergenceStudyView.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-022` | `GROUP_C` | `src/convergenceStudyView.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-023` | `GROUP_C` | `src/convergenceStudyView.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-024` | `GROUP_C` | `src/convergenceTeaching.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-025` | `GROUP_C` | `src/convergenceTeaching.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-026` | `GROUP_C` | `src/convergenceTeaching.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-027` | `GROUP_C` | `src/convergenceTeaching.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-028` | `GROUP_C` | `src/convergenceTeaching.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-029` | `GROUP_C` | `src/convergenceStudy.test.ts`, `src/convergenceStudyOrder.test.ts` | Review eligible, blocked, and unavailable Convergence Study states at 1440×900 and 390×844; check table headers, formulas, chart labels, and evidence wording. |
| `COPY-030` | `GROUP_D` | `src/ode/odeTutorBinding.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-031` | `GROUP_D` | `src/ode/odeTutorBinding.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-032` | `GROUP_D` | `src/app/platformTutorHost.test.ts`, `src/app/tutorLazyBoundary.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-033` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-034` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-035` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-036` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-037` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-038` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-039` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-040` | `GROUP_D` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | After a successful run, review the AI Tutor on desktop and mobile; exercise suggested prompts and mock responses without changing transport or state. |
| `COPY-041` | `GROUP_E` | `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts` | Future authorization must review Wave 1 triggers, compact preview, pinned popover, mobile sheet, focus, dismissal, and route disposal at 1440×900 and 390×844. |
| `COPY-042` | `GROUP_E` | `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts` | Future authorization must review Wave 1 triggers, compact preview, pinned popover, mobile sheet, focus, dismissal, and route disposal at 1440×900 and 390×844. |
| `COPY-043` | `GROUP_F` | `src/math/ui/editableMathField.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-001` | `GROUP_F` | `src/pages/pages.test.ts`, `src/pages/homeResume.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-002` | `GROUP_F` | `src/pages/pages.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-003` | `GROUP_F` | `src/app/platformGlossaryHost.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-004` | `GROUP_F` | `src/problemPresets.test.ts`, `src/ode/beginnerStarter.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-005` | `GROUP_F` | `src/ode/initialValueProblemsRoute.test.ts`, `src/ode/odeLifecycle.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-006` | `GROUP_F` | `src/convergenceStudyView.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-007` | `GROUP_F` | `src/convergenceStudyView.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-008` | `GROUP_F` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-009` | `GROUP_F` | `api/chatHandler.test.ts`, `api/chatPrompt.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-010` | `GROUP_F` | `src/glossary/surface/glossarySurfaceRuntime.test.ts`, `src/app/platformGlossaryHost.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-011` | `GROUP_F` | `src/math/ui/expressionErrorSummary.test.ts` | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |
| `COPY-NC-012` | `GROUP_F` | — | Repeat cross-surface desktop/mobile terminology, accessibility-name, wrapping, focus, console, and stale-copy review. |

## Wave-to-runtime-prerequisite traceability

| Wave | Term IDs | Module/routes | Annotation sites | Data and binding requirements | Blockers |
|---|---|---|---|---|---|
| `WAVE_1_CURRENT_ODE` | `backward_euler_method`, `exact_solution`, `explicit_scheme`, `forward_euler_method`, `initial_condition`, `initial_value_problem`, `numerical_approximation`, `ordinary_differential_equation`, `step_size`, `time_grid` | /ode, /ode/initial-value-problems | ODE overview and Initial Value Problems Lab heading/lede, Method cards for Forward Euler and Backward Euler, Data labels for equation, initial value, interval, and time-step size, Output labels for numerical approximation and exact solution | Reviewed core content data, ODE module overrides where needed, explicit annotation composition, and an ODE-owned binding connected through the existing optional Host port. | — |
| `WAVE_2_CONVERGENCE_ERROR` | `absolute_error`, `asymptotic_region`, `convergence`, `discretization_error`, `final_time_error`, `global_error`, `local_truncation_error`, `maximum_global_error`, `model_error`, `nodal_error`, `observed_order`, `order_of_convergence`, `relative_error`, `truncation_error` | /ode/initial-value-problems (Output and Convergence Study) | Result summary and exact-reference labels, Convergence conclusion, table, chart, and teaching sections, Tutor context labels without changing Tutor behavior | Wave 1 production content and binding first; reviewed error entries and module overrides; no numerical calculation or classification change. | exact_solution, numerical_approximation, step_size, time_grid, step_normalized_local_defect stable ID before any normalized-defect card |
| `WAVE_3_NUMERICAL_RELIABILITY` | `a_stability`, `absolute_stability`, `amplification_factor`, `conditioning`, `floating_point_number`, `loss_of_significance`, `machine_epsilon`, `numerical_stability`, `ode_consistency`, `overflow`, `residual`, `roundoff_error`, `stability_function`, `stability_region`, `stiffness`, `stopping_criterion`, `tolerance`, `underflow`, `zero_stability` | /ode, /ode/initial-value-problems, future cross-module teaching surfaces | Method descriptions and stability roadmap, Stiff preset and implicit diagnostics, Tutor explanations and future reliability summaries | Earlier waves plus approved prerequisite IDs and reviewed content; no solver, nonlinear iteration, or Tutor transport change. | convergence, initial_value_problem, step_size, test_equation stable ID, scaled_stability_parameter stable ID |
| `WAVE_4_LINEAR_SYSTEMS` | `backward_error`, `band_matrix`, `cholesky_factorization`, `column_space`, `condition_number`, `determinant`, `dot_product`, `euclidean_norm`, `forward_error`, `frobenius_norm`, `gaussian_elimination`, `gram_schmidt`, `householder_reflector`, `induced_matrix_norm`, `infinity_norm`, `invertible_matrix`, `least_squares_problem`, `linear_system`, `lu_factorization`, `matrix`, `matrix_matrix_multiplication`, `matrix_norm`, `matrix_vector_multiplication`, `normal_equations`, `null_space`, `orthogonal_matrix`, `orthogonal_projection`, `p_norm`, `partial_pivoting`, `permutation_matrix`, `pivot`, `plu_factorization`, `pseudoinverse`, `qr_factorization`, `rank`, `row_operation`, `scalar`, `singular_matrix`, `sparse_matrix`, `symmetric_matrix`, `vector`, `vector_norm` | /linear-algebra, future Linear Systems Lab | Roadmap copy after module design, future matrix editor, solve results, diagnostics, and teaching surfaces | A future Lab-owned binding and reviewed module registry; no current Linear Algebra runtime exists. | conditioning, positive_definite_matrix, Linear Systems Lab design and implemented ownership |
| `WAVE_5_APPROXIMATION_AND_QUADRATURE` | `adaptive_approximation`, `adaptive_quadrature`, `b_spline`, `best_approximation_chebyshev_theory`, `best_approximation_least_squares_theory`, `bisection_method`, `continuation_method`, `continued_fractions`, `divided_difference`, `euler_maclaurin_formula`, `fixed_point_iteration`, `gaussian_quadrature`, `hermite_interpolation`, `homotopy_method`, `interpolation_in_higher_dimensions`, `lagrange_interpolation`, `low_rank_approximation`, `newton_method`, `numerical_differentiation`, `numerical_integration`, `polynomial_degree`, `polynomial_interpolation`, `polynomial_zero`, `quadrature`, `richardson_extrapolation`, `romberg_integration`, `secant_method`, `spline_interpolation`, `taylor_series`, `trigonometric_interpolation` | future approximation and nonlinear-equations modules | future module-specific teaching surfaces | Future module registry, content data, annotations, and Lab binding after design. | Module selection and architecture/design approval |
| `WAVE_6_EIGENVALUE_AND_ITERATIVE_METHODS` | `deflation`, `diagonalization`, `eigenvalue`, `eigenvector`, `gauss_seidel_iteration`, `hessenberg_matrix`, `inverse_iteration`, `jacobi_iteration`, `power_iteration`, `qr_iteration`, `rayleigh_quotient`, `shifted_iteration`, `singular_value`, `singular_value_decomposition`, `spectral_radius`, `stationary_iteration`, `subspace_iteration` | future Numerical Linear Algebra module routes | future eigenvalue and iterative-method results and teaching surfaces | Future module-owned content and binding; no current route is eligible. | Future module designs and numerical contracts |
| `WAVE_7_PDE_AND_FINITE_DIFFERENCES` | `adi_method`, `boundary_condition`, `central_difference`, `characteristic_curve`, `convection_diffusion_equation`, `crank_nicolson_method`, `diffusion`, `downwind_scheme`, `energy_method`, `finite_difference`, `finite_difference_scheme`, `fourier_analysis`, `grid_spacing`, `heat_equation`, `hyperbolic_pde`, `implicit_scheme`, `laplace_equation`, `lax_equivalence_theorem`, `lax_friedrichs_scheme`, `lax_wendroff_scheme`, `multigrid_method`, `operator_splitting`, `parabolic_pde`, `partial_differential_equation`, `poisson_equation`, `smoothing`, `spatial_grid`, `upwind_scheme`, `von_neumann_analysis`, `wave_equation` | /pde, future PDE Lab routes | Roadmap copy only after content review, future PDE data, grid, result, and teaching surfaces | Future PDE content registry and Lab-owned binding; no current runtime controls exist. | gauss_seidel_iteration, PDE module design and module-specific notation decisions |
| `FUTURE_MODULE` | `adams_bashforth_method`, `adams_moulton_method`, `bdf_method`, `big_o_notation`, `boundary_value_problem`, `collocation_method`, `computational_cost`, `difference_equations`, `equilibrium`, `existence_and_uniqueness_of_solutions`, `fast_fourier_transform`, `grid_point`, `higher_order_ode`, `iteration_count`, `leapfrog_method`, `linear_differential_equations`, `little_o_notation`, `multistep_method`, `one_step_method`, `runge_kutta_method`, `shooting_method`, `stable_equilibrium`, `taylor_method` | future approved module or curriculum surfaces | none in the current product | None until a future module or current-ODE expansion owns the term. | stopping_criterion, Module/curriculum ownership and wave assignment review |
| `DEFERRED` | `basic_concepts_and_taylor_theorem`, `neumann_series_and_iterative_refinement`, `norms_and_the_analysis_of_errors`, `other_methods_for_hyperbolic_problems`, `problems_without_time_dependence_galerkin_and_ritz_methods`, `sard_theory_of_approximating_functionals`, `schur_and_gershgorin_theorems`, `solution_of_equations_by_iterative_methods` | — | — | None. | Explicit future promotion decision |
| `NOT_FOR_RUNTIME` | `convexity`, `linear_inequalities`, `linear_programming`, `simplex_algorithm` | — | — | None. | Out-of-scope classification |

## Cross-group invariants

- Project Language Standard v1 remains byte-for-byte unchanged.
- Numerical contracts remain authoritative; wording never changes a
  coefficient, grouping order, grid/alignment rule, budget, tolerance,
  status, classification, or stored result.
- `AppSessionStore` remains pure data. Glossary state remains transient.
- Home/static routes remain free of ODE, Glossary registry, Tutor runtime,
  MathLive, Compute Engine, and Chart.js eager imports.
- The ODE Lab owns any future Glossary binding and explicit annotations;
  the platform Host owns placement and the one active surface.
- No automatic DOM text scanning, production Playground, real Tutor
  Glossary queue/card, notation profile, private-source runtime, or new
  dependency is introduced.
- Failed operations preserve the last successful output; no copy group
  changes state or lifecycle semantics.

## Review and rollback sequence

1. Implement Group A in a separately scoped task, run focused page tests,
   and complete wide/mobile browser review.
2. Stop for review before Group B. Repeat that gate between B, C, and D.
3. Treat Group E as a new implementation project with content approval,
   tests-first work, bundle verification, and browser accessibility review.
4. Run Group F only after the preceding authorized groups are accepted.
5. Keep one coherent commit per group so a failed review can revert that
   group without rewriting history or disturbing accepted predecessors.

## Exact next gate

The next authorized phase is a separately scoped implementation of Group A,
Platform and overview copy, followed by focused tests and browser review.
