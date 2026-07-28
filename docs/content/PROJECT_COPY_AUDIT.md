# Numerical T-Lab Project Copy Audit

Status: Private-source-reviewed draft; maintainer approval pending.

## Purpose and boundary

This is a repository-grounded rewrite plan for current, non-historical,
user-facing English copy. It records proposed copy changes only. No audited
runtime source, test, CSS, package, deployment, README, historical
specification, or historical review file was modified in this iteration.

The mathematical recommendations use the private-source-reviewed draft
terminology and notation foundation, but none is maintainer-approved or
production-ready. Numerical algorithms, tolerances, classifications, solver
metadata, and lifecycle behavior remain unchanged.

## Audit method

- Inspected actual current source owners and callers; unused legacy Tutor files
  and DEV-only Glossary fixtures were not treated as production copy.
- Excluded tests except where they identify expected visible text, historical
  specs/reviews, Git history, generated build output, and private source text.
- Recorded every recommended change with a stable nearby identifier, rationale,
  related draft term IDs, source keys, behavior risk, staged commit group, and
  review status.
- Sampled no-change decisions rather than listing every sound sentence.

## Coverage

| Surface | Files inspected | Copy covered | Outcome |
|---|---|---|---|
| `src/pages/*.ts` | All seven current page modules and their shared page helpers | Platform positioning, module status, roadmap language, route actions, Not Found | Five recommendations; representative no-change samples recorded |
| `src/app/*.ts` user-facing paths | All non-test app modules; visible-copy owners are AppShell, Tutor Host, Glossary Host, route definitions, and the session divider | Navigation, loading/failure states, page titles, resume/Tutor divider | No unrecorded blocker; calm recovery copy sampled |
| `src/ode/*.ts` plus method/preset/grid/exact-solution owners | All four non-test ODE modules plus `methodCatalog.ts`, `problemPresets.ts`, `grid.ts`, and `exactSolution.ts` | Method/Data/Output workflow, presets, controls, diagnostics, result and comparison labels | Core exact/approximation, count, order, and stability recommendations recorded |
| Convergence runtime and teaching | `convergenceStudy.ts`, `convergenceStudyState.ts`, `convergenceStudyView.ts`, `convergenceTeaching.ts`, and `convergenceTutor.ts` | Eligibility, warnings, errors, tables, chart, interpretation, teaching accordions | Metric and observed-order consistency recommendations recorded |
| `src/tutor/*.ts`, ODE binding, and `api/chatHandler.ts` | All current Tutor client/panel/session copy, suggested questions, mock grounded responses, and API errors | Prompts, empty/error states, explanations, generated tables and chart guidance | High-risk truncation-error contradiction and stability claims recorded |
| Mathematical input and readonly UI | Current `src/math/ui` copy owners and user-facing math validation errors | Editor loading, toolbar, expression details, validation and accessible math | One learner-language recommendation; recovery copy sampled |
| Glossary framework shell | Platform Host and lazy surface runtime; DEV-only fixtures excluded as non-production | Preview, complete surface, failure, Tutor handoff actions | Framework-label and action-copy recommendations recorded; no term content audited |
| Current public descriptions | `README.md`, `PLAN.md`, `ARCHITECTURE.md`, `docs/NUMERICAL_CONTRACTS.md`, `docs/PROJECT_HANDOFF.md`, and `docs/INDEX.md` | Present product behavior, active milestone, implemented ownership, numerical contracts | README status drift recorded; current plan/index/handoff claims agree |

Recorded **43 recommended changes** and **12 sampled no-change decisions**.

Recommendation categories:

- Tutor voice inconsistency: 1
- ambiguity: 8
- beginner-unfriendly language: 2
- button/action clarity: 1
- exact/approximate confusion: 4
- notation inconsistency: 3
- stability-sense confusion: 9
- terminology inconsistency: 9
- unsupported claim: 5
- warning/error tone: 1

## Recommended changes

### A — Platform and overview copy

#### COPY-001 — `src/pages/aboutPage.ts` · `aboutPage / Teaching pillar`

- Issue category: **unsupported claim**
- Current text: “The approved Interactive Glossary framework is planned as the next shared learning capability.”
- Recommended replacement: “The content-agnostic Interactive Glossary framework is under development. No production terms or definitions are published yet.”
- Rationale: The current repository already contains locally verified shared framework infrastructure, while production remains content-free.
- Related term IDs: —
- Source keys: Repository state only
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-002 — `README.md` · `Current limitations / next milestone`

- Issue category: **unsupported claim**
- Current text: “Its design is approved; implementation has not started.”
- Recommended replacement: “Its design is approved, and the content-agnostic framework is partially implemented and awaiting its current review gate. Production still contains no Glossary terms.”
- Rationale: The sentence predates the locally implemented framework commits and conflicts with PLAN.md and the current handoff.
- Related term IDs: —
- Source keys: Repository state only
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-003 — `src/pages/homePage.ts` · `Numerical PDE module-card description`

- Issue category: **stability-sense confusion**
- Current text: “Connect discretization, stability, and refinement to spatially varying systems.”
- Recommended replacement: “Connect spatial discretization, refinement, and the relevant stability properties of numerical PDE schemes.”
- Rationale: Bare “stability” can mean several different mathematical properties; the future module should name the sense when content is designed.
- Related term IDs: `grid_spacing`, `numerical_stability`
- Source keys: `NOTES-2025`, `NLA-CH27`
- Behavior risk: Medium — future PDE scope must be reviewed
- Status: `DEFERRED_UNTIL_PDE_CONTENT_REVIEW`

#### COPY-004 — `src/pages/odeOverviewPage.ts` · `ODE roadmap item`

- Issue category: **stability-sense confusion**
- Current text: “Stability Regions”
- Recommended replacement: “Absolute-stability regions”
- Rationale: For time-stepping methods, this roadmap item refers to the absolute-stability region, not stability in every sense.
- Related term IDs: `absolute_stability`, `stability_region`
- Source keys: `NOTES-2025`
- Behavior risk: Low — copy-only; terminology approval pending
- Status: `DECISION_REQUIRED`

#### COPY-005 — `src/pages/aboutPage.ts` · `aboutPage / Theory pillar`

- Issue category: **stability-sense confusion**
- Current text: “including their assumptions, limitations, stability, and error behavior”
- Recommended replacement: “including their assumptions, limitations, relevant stability properties, and stated error measures”
- Rationale: The revision signals that both stability and error need a named scope or metric.
- Related term IDs: `numerical_stability`, `global_error`
- Source keys: `NOTES-2025`, `NLA-CH03`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

### B — Initial Value Problems Lab copy

#### COPY-006 — `src/ode/odeApp.ts` · `DEFAULT_LEDE`

- Issue category: **stability-sense confusion**
- Current text: “Explore fixed-step methods for first-order initial value problems, then study stability, error, and convergence.”
- Recommended replacement: “Explore fixed-step methods for first-order initial value problems, then analyze numerical error, observed convergence, and method behavior as the step size changes.”
- Rationale: The replacement avoids three unqualified umbrella terms while preserving the learner-facing promise.
- Related term IDs: `initial_value_problem`, `global_error`, `observed_order`, `step_size`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-007 — `src/methodCatalog.ts` · `METHOD_CATALOG / backward_euler / blurb`

- Issue category: **stability-sense confusion**
- Current text: “Implicit first-order method. Very stable; each step solves for the next value.”
- Recommended replacement: “Implicit first-order method. On the standard linear test equation, its absolute-stability region contains the left half-plane; each step solves for the next numerical approximation.”
- Rationale: “Very stable” is an undefined guarantee. The replacement names the test-equation scope and distinguishes a computed approximation from an exact value.
- Related term IDs: `absolute_stability`, `stability_region`, `numerical_approximation`
- Source keys: `NOTES-2025`
- Behavior risk: High — mathematical claim; maintainer review required
- Status: `DECISION_REQUIRED`

#### COPY-008 — `src/methodCatalog.ts` · `METHOD_CATALOG / forward_euler / blurb`

- Issue category: **unsupported claim**
- Current text: “Explicit first-order method. Global error is first order in the step size.”
- Recommended replacement: “Explicit method with theoretical order 1 under its usual smoothness and stability assumptions.”
- Rationale: The current sentence presents an asymptotic global-error claim without its assumptions or a stated error metric.
- Related term IDs: `order_of_convergence`, `global_error`, `step_size`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: Medium — mathematical qualification
- Status: `RECOMMENDED`

#### COPY-009 — `src/methodCatalog.ts` · `METHOD_CATALOG / adams_bashforth / blurb`

- Issue category: **terminology inconsistency**
- Current text: “Explicit multistep method; choose the order of accuracy p below.”
- Recommended replacement: “Explicit multistep method; choose the theoretical order p below.”
- Rationale: “Theoretical order” keeps configured method metadata distinct from an observed order estimated from a study.
- Related term IDs: `order_of_convergence`, `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-010 — `src/ode/odeApp.ts` · `orderFieldHtml and metadataPanelHtml`

- Issue category: **terminology inconsistency**
- Current text: “Order of accuracy p”
- Recommended replacement: “Theoretical order p”
- Rationale: The configured or reported method property is theoretical order; the Convergence Study separately reports observed order.
- Related term IDs: `order_of_convergence`, `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-011 — `src/ode/odeApp.ts` · `renderForm / time inputs`

- Issue category: **notation inconsistency**
- Current text: “End time t_end”
- Recommended replacement: “End time tₑₙd”
- Rationale: The display should render the endpoint as a subscripted symbol and provide an accessible name such as “End time t sub end.”
- Related term IDs: `time_grid`
- Source keys: `NOTES-2025`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-012 — `src/ode/odeApp.ts` · `renderForm and renderCompareForm / step-size labels`

- Issue category: **notation inconsistency**
- Current text: “Run step size h = Δt / Step size h”
- Recommended replacement: “Time-step size h”
- Rationale: Use h consistently in ODE controls; explain Δt as an alias in teaching content only if needed.
- Related term IDs: `step_size`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-013 — `src/problemPresets.ts` · `PROBLEM_PRESETS / exponential_decay / teachingSummary`

- Issue category: **stability-sense confusion**
- Current text: “Basic decay, global error, and stability.”
- Recommended replacement: “Basic decay and global error, with coarse-step behavior that can motivate absolute-stability analysis.”
- Rationale: The current summary leaves the stability sense unspecified.
- Related term IDs: `global_error`, `absolute_stability`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-014 — `src/grid.ts` · `validateFixedStepGrid / non-finite step count`

- Issue category: **ambiguity**
- Current text: “Fixed-step grid size must be finite.”
- Recommended replacement: “The computed number of time steps must be finite.”
- Rationale: “Grid size” can mean spacing, point count, or storage size; the failing quantity is the computed step count.
- Related term IDs: `time_grid`, `step_size`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-015 — `src/ode/odeApp.ts` · `mountResults / summary stat`

- Issue category: **ambiguity**
- Current text: “Steps taken”
- Recommended replacement: “Grid points stored”
- Rationale: The displayed value is the result-series length, which includes the initial point and is not the number of time steps.
- Related term IDs: `time_grid`, `iteration_count`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Medium — label must remain aligned with the displayed value
- Status: `RECOMMENDED`

#### COPY-016 — `src/ode/odeApp.ts` · `mountResults / final-value stat`

- Issue category: **exact/approximate confusion**
- Current text: “Final y”
- Recommended replacement: “Final numerical approximation u_N”
- Rationale: The result is computed. Using y without qualification makes it look like the exact solution used elsewhere in the Lab.
- Related term IDs: `numerical_approximation`, `exact_solution`
- Source keys: `NOTES-2025`
- Behavior risk: Medium — notation and accessible rendering
- Status: `RECOMMENDED`

#### COPY-017 — `src/ode/odeApp.ts` · `mountCompareResults / final-value stats`

- Issue category: **exact/approximate confusion**
- Current text: “Final y — [method]”
- Recommended replacement: “Final numerical approximation — [method]”
- Rationale: Both displayed values are numerical approximations, not exact values.
- Related term IDs: `numerical_approximation`, `exact_solution`
- Source keys: `NOTES-2025`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-018 — `src/ode/odeApp.ts` · `mountCompareResults / final difference`

- Issue category: **exact/approximate confusion**
- Current text: “|uₙ − yₙ| at final t”
- Recommended replacement: “Absolute difference between final numerical approximations, |u_N^(A) − u_N^(B)|”
- Rationale: The current symbols resemble numerical-versus-exact error even though the value compares two numerical methods.
- Related term IDs: `numerical_approximation`, `global_error`, `final_time_error`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: High — current label misidentifies the mathematical object
- Status: `RECOMMENDED`

#### COPY-019 — `src/ode/odeApp.ts` · `mountCompareResults / length mismatch`

- Issue category: **warning/error tone**
- Current text: “Series length mismatch; plots may be unreliable.”
- Recommended replacement: “The two result series have different lengths, so the comparison plot was not created. Rerun both methods on the same aligned grid.”
- Rationale: The current implementation stops before plotting; the message should state the actual outcome and a recovery action.
- Related term IDs: `time_grid`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Medium — wording must match the existing early return
- Status: `RECOMMENDED`

### C — Convergence/error language

#### COPY-020 — `src/convergenceStudyView.ts` · `renderConclusion / primary order label`

- Issue category: **terminology inconsistency**
- Current text: “Primary maximum-error observed order”
- Recommended replacement: “Primary observed order (maximum global error)”
- Rationale: The parenthetical metric is easier to parse and matches the full metric name used elsewhere.
- Related term IDs: `observed_order`, `maximum_global_error`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-021 — `src/convergenceStudyView.ts` · `renderConclusion / unavailable order`

- Issue category: **ambiguity**
- Current text: “No reliable order available”
- Recommended replacement: “No reliable observed order available”
- Rationale: Theoretical order remains available, so the missing quantity must be named.
- Related term IDs: `observed_order`, `order_of_convergence`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-022 — `src/convergenceStudyView.ts` · `renderErrorTable / value headers`

- Issue category: **exact/approximate confusion**
- Current text: “Final numerical / Final exact”
- Recommended replacement: “Final numerical approximation / Final exact value”
- Rationale: Both headers should name the mathematical status of the displayed quantity.
- Related term IDs: `numerical_approximation`, `exact_solution`
- Source keys: `NOTES-2025`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-023 — `src/convergenceStudyView.ts` · `renderErrorTable / order headers`

- Issue category: **ambiguity**
- Current text: “Final observed order / Maximum observed order”
- Recommended replacement: “Observed order (final-time error) / Observed order (maximum global error)”
- Rationale: Observed order depends on the error metric, so the header should name that metric.
- Related term IDs: `observed_order`, `final_time_error`, `maximum_global_error`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-024 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / errors section`

- Issue category: **terminology inconsistency**
- Current text: “How are final-time and maximum errors calculated?”
- Recommended replacement: “How are final-time error and maximum global error calculated?”
- Rationale: The existing title shortens a released metric name and makes “maximum error” look like a different quantity.
- Related term IDs: `final_time_error`, `maximum_global_error`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-025 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / order example`

- Issue category: **terminology inconsistency**
- Current text: “giving a measured order of [value]”
- Recommended replacement: “giving an observed order of [value]”
- Rationale: The product already uses “observed order” for an empirical estimate; “measured order” creates an unnecessary synonym.
- Related term IDs: `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-026 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / theory_difference`

- Issue category: **terminology inconsistency**
- Current text: “before the asymptotic range is reached”
- Recommended replacement: “before the asymptotic region is reached”
- Rationale: The draft terminology uses “asymptotic region,” but the final choice remains explicitly pending maintainer review.
- Related term IDs: `asymptotic_region`, `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Medium — terminology decision pending
- Status: `DECISION_REQUIRED`

#### COPY-027 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / exact_solution`

- Issue category: **ambiguity**
- Current text: “An exact solution gives the mathematical value used as the reference for numerical error.”
- Recommended replacement: “An exact solution is a function that satisfies the stated initial value problem and supplies the reference values used to compute numerical error.”
- Rationale: The current wording calls a function a value and omits the stated-problem scope.
- Related term IDs: `exact_solution`, `initial_value_problem`, `global_error`
- Source keys: `NOTES-2025`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-028 — `src/convergenceTeaching.ts` · `buildConvergenceTeachingSections / accessible error formula`

- Issue category: **terminology inconsistency**
- Current text: “final error ... maximum error”
- Recommended replacement: “final-time error ... maximum global error”
- Rationale: The accessible description should carry the same metric names as the visible formula and controls.
- Related term IDs: `final_time_error`, `maximum_global_error`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-029 — `src/convergenceStudy.ts` · `classifyConvergence / near-theory explanation`

- Issue category: **stability-sense confusion**
- Current text: “The recent maximum-error orders are stable”
- Recommended replacement: “The recent maximum-global-error observed orders are consistent across levels”
- Rationale: Here “stable” means little variation, not a numerical-stability property.
- Related term IDs: `observed_order`, `maximum_global_error`, `numerical_stability`
- Source keys: `NOTES-2025`, `NLA-CH03`, `NLA-CH08`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

### D — Tutor terminology and voice

#### COPY-030 — `src/ode/odeTutorBinding.ts` · `ODE_TUTOR_SUGGESTED_QUESTIONS`

- Issue category: **terminology inconsistency**
- Current text: “Why is the order of accuracy p?”
- Recommended replacement: “Why is this method’s theoretical order p?”
- Rationale: The question should distinguish method metadata from an observed convergence estimate.
- Related term IDs: `order_of_convergence`, `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-031 — `src/ode/odeTutorBinding.ts` · `ODE_TUTOR_SUGGESTED_QUESTIONS`

- Issue category: **beginner-unfriendly language**
- Current text: “What would happen if I used a smaller h?”
- Recommended replacement: “What could happen if I used a smaller time-step size h?”
- Rationale: The revision defines h and avoids implying that refinement has one guaranteed outcome.
- Related term IDs: `step_size`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-032 — `src/tutor/platformTutorPanel.ts` · `AI Tutor subtitle`

- Issue category: **stability-sense confusion**
- Current text: “Ask about the method, variables, coefficients, stability, accuracy, or graph behavior.”
- Recommended replacement: “Ask about the method, variables, coefficients, error, convergence evidence, or graph behavior.”
- Rationale: The broad menu should avoid inviting an answer about an unspecified stability sense.
- Related term IDs: `global_error`, `convergence`, `numerical_stability`
- Source keys: `NOTES-2025`, `NLA-CH03`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-033 — `api/chatHandler.ts` · `mockTutorResponse / orderLine`

- Issue category: **terminology inconsistency**
- Current text: “For this run, the method is treated as order p = [value].”
- Recommended replacement: “The method metadata reports theoretical order p = [value] for this run.”
- Rationale: “Treated as order” is vague and can be mistaken for the study’s observed order.
- Related term IDs: `order_of_convergence`, `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-034 — `api/chatHandler.ts` · `mockTutorResponse / observed-order explanation`

- Issue category: **Tutor voice inconsistency**
- Current text: “A measured order need not be an integer”
- Recommended replacement: “An observed order need not be an integer”
- Rationale: Use the same learner-facing term in the Tutor and Convergence Study.
- Related term IDs: `observed_order`
- Source keys: `NOTES-2025`, `NLA-CH08`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-035 — `api/chatHandler.ts` · `mockTutorResponse / table summary`

- Issue category: **ambiguity**
- Current text: “Steps stored: [point count]”
- Recommended replacement: “Grid points stored: [point count]”
- Rationale: The context value is pointCount, including the initial point, not a count of completed time steps.
- Related term IDs: `time_grid`, `iteration_count`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-036 — `api/chatHandler.ts` · `mockTutorResponse / step-by-step sketch`

- Issue category: **notation inconsistency**
- Current text: “Start from the IVP ... with h = Δt.”
- Recommended replacement: “Start from the IVP ... with time-step size h.”
- Rationale: The primary ODE notation draft uses h; aliases should be introduced only when they help.
- Related term IDs: `initial_value_problem`, `step_size`
- Source keys: `NOTES-2025`, `NLA-CH02`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-037 — `api/chatHandler.ts` · `mockTutorResponse / graph interpretation`

- Issue category: **stability-sense confusion**
- Current text: “the curve reflects how your chosen f and h affect stability and accuracy ... If it blows up, the method may be unstable for this step size.”
- Recommended replacement: “The curve shows the computed approximations for this method and time-step size. Rapid growth or oscillation can motivate an absolute-stability check, but the plot alone does not prove instability or accuracy.”
- Rationale: The current response conflates plot appearance, accuracy, and an unspecified stability sense.
- Related term IDs: `numerical_approximation`, `absolute_stability`, `global_error`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: High — Tutor mathematical claim
- Status: `RECOMMENDED`

#### COPY-038 — `api/chatHandler.ts` · `mockTutorResponse / smaller-step reply`

- Issue category: **unsupported claim**
- Current text: “the local truncation error per step shrinks like O(h^p) for order p. Expect a smoother plot and a final value closer to the exact solution”
- Recommended replacement: “A smaller h creates more time steps. State the local-truncation-error definition before assigning O(h^p) or O(h^(p+1)); then use the Convergence Study to check whether the stated error metric decreases on this problem.”
- Rationale: The repository contains the competing unscaled and step-normalized conventions, and refinement does not guarantee a smoother plot or a closer endpoint value.
- Related term IDs: `local_truncation_error`, `step_size`, `final_time_error`, `observed_order`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: High — internally inconsistent mathematical explanation
- Status: `DECISION_REQUIRED`

#### COPY-039 — `api/chatHandler.ts` · `mockTutorResponse / truncation-error reply`

- Issue category: **ambiguity**
- Current text: “For a consistent method of order p, LTE is O(h^(p+1)) and global error is typically O(h^p) on a fixed interval.”
- Recommended replacement: “Define whether local truncation error is the unscaled one-step defect or that defect divided by h before giving its order; then state the assumptions and error metric for any global-error rate.”
- Rationale: The sentence uses one valid convention but does not name it, directly conflicting with the smaller-step reply’s O(h^p) convention.
- Related term IDs: `local_truncation_error`, `global_error`, `order_of_convergence`
- Source keys: `NOTES-2025`, `CHENEY`
- Behavior risk: High — terminology decision and Tutor consistency
- Status: `DECISION_REQUIRED`

#### COPY-040 — `api/chatHandler.ts` · `mockTutorResponse / exam recap`

- Issue category: **ambiguity**
- Current text: “explain why BDF needs iteration”
- Recommended replacement: “explain why this implementation uses nonlinear iteration to solve each implicit BDF step”
- Rationale: BDF is an implicit method family; the implementation choice and algebraic solve should be named instead of implying one universal iteration procedure.
- Related term IDs: `newton_method`, `iteration_count`, `residual`
- Source keys: `NLA-CH10`, `CHENEY`
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

### E — Production Glossary content

#### COPY-041 — `src/glossary/surface/glossarySurfaceRuntime.ts` · `complete surface / alternate display label`

- Issue category: **unsupported claim**
- Current text: “Standard label: [entry label]”
- Recommended replacement: “Glossary term: [entry label]”
- Rationale: “Standard label” implies an approved terminology standard even though production content remains pending review.
- Related term IDs: —
- Source keys: Repository state only
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

#### COPY-042 — `src/glossary/surface/glossarySurfaceRuntime.ts` · `preview prompt and live-region copy`

- Issue category: **button/action clarity**
- Current text: “Click or press Enter for more.”
- Recommended replacement: “Open for more details.”
- Rationale: The control is a native button, so the copy need not prescribe only mouse click or Enter and omit touch and Space.
- Related term IDs: —
- Source keys: Repository state only
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

### F — Final consistency/browser audit

#### COPY-043 — `src/math/ui/editableMathField.ts` · `expression details / parsed label`

- Issue category: **beginner-unfriendly language**
- Current text: “Parsed expression”
- Recommended replacement: “Interpreted expression”
- Rationale: “Interpreted” better describes the learner-facing normalized form without exposing parser jargon.
- Related term IDs: —
- Source keys: Repository state only
- Behavior risk: Low — copy-only
- Status: `RECOMMENDED`

## Sampled no-change decisions

| ID | Path and identifier | Current text | Rationale |
|---|---|---|---|
| COPY-NC-001 | `src/pages/homePage.ts` · `Numerical ODE module-card description` | “Experiment with fixed-step methods for initial value problems and analyze numerical error.” | It accurately scopes the available Lab and does not claim a specific error metric. |
| COPY-NC-002 | `src/pages/linearAlgebraOverviewPage.ts` · `roadmap status line` | “this module is a roadmap today and does not yet contain runnable controls.” | The page accurately distinguishes a roadmap from an implemented Lab. |
| COPY-NC-003 | `src/app/platformGlossaryHost.ts` · `failure message` | “The definition could not load. You can retry without leaving the Lab.” | The message is calm, states recoverability, and offers an immediate action. |
| COPY-NC-004 | `src/problemPresets.ts` · `PROBLEM_PRESETS / stiff_relaxation / warning` | “Explicit methods require very small steps for the fast mode; this is stability guidance, not a guarantee of a particular run outcome.” | The warning explicitly limits the claim and separates guidance from a guaranteed outcome. |
| COPY-NC-005 | `src/ode/odeApp.ts` · `implicitDiagnosticsHtml / explanatory note` | “Nonlinear-solver convergence is different from absolute stability of the numerical method.” | The sentence makes a high-value distinction without overclaiming. |
| COPY-NC-006 | `src/convergenceStudyView.ts` · `renderConsistency / proof note` | “This check is not a formal proof.” | The qualification prevents a numerical diagnostic from being presented as mathematical proof. |
| COPY-NC-007 | `src/convergenceStudyView.ts` · `renderChart / direction note` | “Moving right means using a smaller step size.” | The reversed logarithmic horizontal axis makes this short orientation cue useful. |
| COPY-NC-008 | `api/chatHandler.ts` · `mockTutorResponse / missing convergence context` | “I do not have current convergence evidence in this Tutor context, so I will not invent an observed order, error value, or interpretation.” | The response is evidence-bounded and uses the preferred observed-order term. |
| COPY-NC-009 | `api/chatHandler.ts` · `mockTutorResponse / nonlinear diagnostics` | “Nonlinear-solver convergence is different from absolute stability of the numerical method.” | The Tutor correctly separates an algebraic solver outcome from a time-stepping stability property. |
| COPY-NC-010 | `src/glossary/surface/glossarySurfaceRuntime.ts` · `complete surface section heading` | “Why it matters here” | The heading is concise, contextual, and aligned with the teaching-voice draft. |
| COPY-NC-011 | `src/math/ui/expressionErrorSummary.ts` · `validation summary heading` | “Fix [count] expression(s) before running” | The message states the blocker and next action without blaming the learner. |
| COPY-NC-012 | `docs/PROJECT_HANDOFF.md` · `current Glossary status` | “Production still has no Glossary terms, annotations, or visible Glossary behavior.” | The current handoff accurately separates local framework progress from production content. |

## Staged rewrite plan

### A — Platform and overview copy

Correct product-status drift and qualify broad roadmap language. Keep the runtime milestone gate unchanged and do not publish mathematical Glossary content.

Verification: Copy-only checks for page titles, links, and truthful Available/In development/Planned labels.

### B — Initial Value Problems Lab copy

Align method metadata, controls, result labels, comparison labels, preset guidance, and grid errors with the exact/approximation and time-grid distinctions.

Verification: Focused UI tests plus browser checks of Method, Data, single Output, Compare, implicit diagnostics, and mobile overflow.

### C — Convergence/error language

Use full metric names, distinguish theoretical from observed order, and resolve the asymptotic-region wording before editing the teaching panels.

Verification: Focused Convergence view/teaching tests, numerical-contract non-change review, and desktop/mobile table/chart inspection.

### D — Tutor terminology and voice

Remove conflicting local-truncation-error conventions, qualify stability claims, and harmonize Tutor prompts and responses with the Convergence Study.

Verification: Tutor prompt/response tests, mock API tests, abort/lifecycle regression checks, and browser transcript review.

### E — Production Glossary content

After maintainer approval of term and notation decisions, replace framework language that implies an approved standard and add only reviewed production entries.

Verification: Glossary registry/scope/surface tests, accessible-name review, keyboard/touch checks, and bundle-boundary verification.

### F — Final consistency/browser audit

Run a final repository-wide terminology scan, verify accessible math/copy, and reconcile current README and status documents after the implementation groups are accepted.

Verification: Focused and full verification appropriate to touched code, `git diff --check`, link/privacy scans, wide desktop and approximately 390×844 browser checks.

## Review gates

- Resolve all `DECISION_REQUIRED` terminology/notation items before their
  recommended wording can become production language.
- Treat groups A–F as future coherent implementation boundaries, not
  authorization to edit runtime copy.
- Preserve the active Glossary framework re-audit gate in `PLAN.md`; this
  parallel content foundation does not authorize Commit 4 or a production
  Glossary vertical slice.
- Re-check exact/approximation notation, error metrics, stability senses,
  button labels, accessible names, desktop/mobile layout, and Tutor
  response behavior after each later implementation group.
