# ODE Glossary Wave 1 Content Packet

Status: Maintainer review packet.
No term content, annotation, binding, or runtime activation is authorized by
this document.

Date: 2026-07-29

## 1. Purpose and authority

This packet refines the ten existing Wave 1 rich drafts in the
[Glossary Catalog](GLOSSARY_CATALOG.md). It applies the approved
[Terminology Standard v1](NUMERICAL_TERMINOLOGY_STANDARD.md),
[Notation Standard v1](NUMERICAL_NOTATION_STANDARD.md), and
[Teaching Voice Standard v1](TEACHING_VOICE.md) to the current Initial Value
Problems Lab. The packet is proposed content, not runtime data.

The companion
[design specification](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md),
[approval checklist](ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md), and
[design-readiness review](../reviews/2026-07-29-ode-glossary-wave-1-design-readiness-review.md)
remain subject to explicit maintainer decisions. No unchecked or completed
field in those documents authorizes E1, E2, E3, or Group F2 by itself.

## 2. Exact term set and teaching order

The proposed set contains exactly these ten existing stable IDs:

1. `ordinary_differential_equation`
2. `initial_condition`
3. `initial_value_problem`
4. `step_size`
5. `time_grid`
6. `numerical_approximation`
7. `exact_solution`
8. `explicit_scheme`
9. `forward_euler_method`
10. `backward_euler_method`

The order differs from the provisional catalog presentation by teaching
`initial_condition` before `initial_value_problem`. The catalog dependency is
`ordinary_differential_equation + initial_condition -> initial_value_problem`;
introducing the two ingredients before the combined problem keeps every later
card's prerequisites behind it. `time_grid` follows `step_size`, and
`numerical_approximation` follows the grid on which \(u_n\) is stored.

`implicit_scheme` is not added. Its handling is a pending maintainer decision
in Section 14 and in the design specification.

## 3. Term cards

### 3.1 Ordinary differential equation (ODE)

- **Stable ID:** `ordinary_differential_equation`
- **Display label:** Ordinary differential equation (ODE)
- **Accepted aliases:** `ODE`; `ordinary differential equation`; the plural
  `ordinary differential equations` only in authored grammatical context.
- **Avoided wording:** Calling the equation a solution; using `differential
  equation` where the ODE/PDE distinction matters; implying that every ODE has
  an exact or unique solution.
- **Scope:** Numerical ODE; the current Lab uses a scalar first-order equation.
- **Product relevance:** Wave 1 foundation for the current IVP Lab.
- **Prerequisites:** None.
- **Related terms:** `initial_condition`, `initial_value_problem`,
  `exact_solution`; future `partial_differential_equation`.
- **Commonly confused terms:** A solution of an ODE; a PDE; a general ODE
  system.
- **Annotation priority:** High; first contextual term in the Lab lede.
- **Short preview definition:** An ordinary differential equation relates an
  unknown function of one variable to one or more of its derivatives.
- **Full definition:** An ordinary differential equation relates an unknown
  function of one independent variable to one or more of its derivatives. The
  current Lab treats time as that variable and uses the scalar first-order form
  \(y'(t)=f(t,y(t))\). More general ODEs may be higher-order equations or
  systems, and they are not all supported here.
- **Plain-language intuition:** It is a rule describing how a state changes.
  The rule is the equation; a function satisfying that rule is a solution.
- **Why it matters in the current IVP Lab:** Every current first-order method
  repeatedly evaluates the entered right-hand side \(f(t,y)\). The Lab does not
  decide existence or uniqueness and does not support every ODE form.
- **Formula, when useful:** \(y'(t)=f(t,y(t))\).
- **Accessible formula explanation:** “y prime of t equals f of t and y of t.”
- **Assumptions and limits:** Scalar, first-order, fixed-interval current Lab
  scope; autonomous and time-dependent right-hand sides are allowed. No
  existence, uniqueness, exact-solvability, or universal Lab-support claim.
- **Common misconception:** Misconception: the ODE is the curve shown in the
  chart. Correction: the ODE is the governing equation; the chart shows
  computed values from a selected numerical method.
- **Module-specific note:** Read this equation together with the starting value
  and interval entered in Data.
- **Tutor topic:** Identify the time variable, state, derivative, and
  right-hand side in the current equation without asserting an exact solution.
- **Proposed annotation locations:** `ODE-W1-ANN-001`; the `/ode` overview
  occurrence is evaluated but excluded pending a separate static-route design.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`, loaded only through the complete ODE route.
- **Proposed card-content owner:** ODE-owned; not reusable as a complete card
  without a future module review.
- **Content-review evidence:** Existing catalog rich draft; terminology rows
  for `ordinary_differential_equation`; current equation form in
  `src/ode/odeApp.ts`; scalar fixed-step limits in
  `docs/NUMERICAL_CONTRACTS.md`.
- **Maintainer recommendation:** Approve the refined card.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.2 Initial condition

- **Stable ID:** `initial_condition`
- **Display label:** Initial condition
- **Accepted aliases:** No general synonym. `Initial value y₀` is allowed only
  as the controlled Data-label display for this card.
- **Avoided wording:** Boundary condition; approximation error; treating
  \(t_0\) or \(y_0\) alone as the complete condition.
- **Scope:** Numerical ODE initial value problems.
- **Product relevance:** Supplies the starting state for every current
  first-order run.
- **Prerequisites:** None.
- **Related terms:** `ordinary_differential_equation`,
  `initial_value_problem`, `time_grid`.
- **Commonly confused terms:** Boundary condition; initial time; first
  numerical error.
- **Annotation priority:** High; Data input composition.
- **Short preview definition:** The initial condition gives the supplied
  solution value at the starting time.
- **Full definition:** The initial condition states that the solution has the
  supplied value \(y_0\) at the starting time \(t_0\). For the current
  first-order Lab it is written \(y(t_0)=y_0\). It starts the numerical
  computation, but it is not a boundary condition at multiple points and is
  not an error estimate.
- **Plain-language intuition:** It tells the method where the trajectory
  starts. The starting time is \(t_0\), and the supplied starting value is
  \(y_0\).
- **Why it matters in the current IVP Lab:** Changing \(y_0\) changes the
  problem even if the differential equation is unchanged. The first stored
  approximation begins from this supplied value.
- **Formula, when useful:** \(y(t_0)=y_0\).
- **Accessible formula explanation:** “y of t zero equals y zero.”
- **Assumptions and limits:** The current card covers one scalar value at one
  starting time; it makes no existence or uniqueness promise.
- **Common misconception:** Misconception: the initial condition measures how
  wrong the first numerical value is. Correction: it supplies the starting
  value; it is not an approximation error.
- **Module-specific note:** Data separately exposes Start time \(t_0\) and
  Initial value \(y_0\); together they state the condition.
- **Tutor topic:** Connect the current start time and initial value to the first
  numerical value without calling the condition a boundary condition.
- **Proposed annotation locations:** `ODE-W1-ANN-003`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned.
- **Content-review evidence:** Existing catalog rich draft; terminology row for
  `initial_condition`; current Data fields in `mountOdeApp.renderForm`.
- **Maintainer recommendation:** Approve the refined card and the separate
  sibling-trigger composition.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.3 Initial value problem (IVP)

- **Stable ID:** `initial_value_problem`
- **Display label:** Initial value problem (IVP)
- **Accepted aliases:** `IVP`; `initial value problem`; `initial-value
  problem`; plural use only in authored grammatical context.
- **Avoided wording:** Numerical method; initial condition by itself; boundary
  value problem; any unconditional existence or uniqueness claim.
- **Scope:** Numerical ODE; current scalar first-order IVP.
- **Product relevance:** Names the complete mathematical problem approximated
  by the current Lab.
- **Prerequisites:** `ordinary_differential_equation`, `initial_condition`.
- **Related terms:** `step_size`, `time_grid`, `numerical_approximation`,
  `exact_solution`.
- **Commonly confused terms:** A solver or numerical method; boundary value
  problem; input form.
- **Annotation priority:** High; first Lab-lede occurrence.
- **Short preview definition:** An initial value problem combines a
  differential equation with the solution value at a starting time.
- **Full definition:** An initial value problem gives a differential equation
  together with the value of its solution at a starting time:
  \(y'(t)=f(t,y(t))\) and \(y(t_0)=y_0\). This pair states the mathematical
  problem. A numerical method is a separate procedure used to approximate its
  solution, and existence or uniqueness requires additional assumptions.
- **Plain-language intuition:** It supplies both the rule for change and the
  place to start.
- **Why it matters in the current IVP Lab:** The selected equation, starting
  time, starting value, and interval identify the problem. Choosing Forward
  Euler or another method does not change that problem.
- **Formula, when useful:** \(y'(t)=f(t,y(t)),\qquad y(t_0)=y_0\).
- **Accessible formula explanation:** “y prime of t equals f of t and y of t,
  with y of t zero equal to y zero.”
- **Assumptions and limits:** Current support is scalar, first-order, and
  fixed-interval. The input form represents an IVP but is not itself the exact
  mathematical solution.
- **Common misconception:** Misconception: Forward Euler is an initial value
  problem. Correction: Forward Euler is one numerical method for approximating
  the solution of an IVP.
- **Module-specific note:** The current Lab does not implement boundary value
  problems or general ODE systems.
- **Tutor topic:** Explain the current equation, \(t_0\), and \(y_0\) as one
  problem and keep the method separate.
- **Proposed annotation locations:** `ODE-W1-ANN-002`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned.
- **Content-review evidence:** Existing catalog rich draft and dependency
  graph; current route title and Data form; terminology standard.
- **Maintainer recommendation:** Approve after approving the prerequisite-aware
  teaching order.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.4 Time-step size

- **Stable ID:** `step_size`
- **Display label:** Time-step size
- **Accepted aliases:** `step size`; `time step` when it means the size rather
  than a count; controlled display `Time-step size h`.
- **Avoided wording:** ODE grid spacing; ambiguous step length; bare step where
  size/count is unclear; a guarantee that refinement improves a result.
- **Scope:** Fixed-step numerical ODE time discretization.
- **Product relevance:** Direct Data input and later refinement parameter.
- **Prerequisites:** `initial_value_problem`.
- **Related terms:** `time_grid`, `numerical_approximation`; future
  `absolute_stability` and `grid_spacing`.
- **Commonly confused terms:** Number of steps; number of stored points; PDE
  spatial grid spacing.
- **Annotation priority:** High; Data input companion.
- **Short preview definition:** The time-step size \(h\) is the spacing between
  consecutive times on the current fixed grid.
- **Full definition:** The time-step size is
  \(h=t_{n+1}-t_n\). The current Lab uses one constant positive \(h\) and
  requires the interval to align with an integer number of steps. A smaller
  \(h\) creates more steps on the same interval, but it does not by itself
  guarantee a more accurate or stable result.
- **Plain-language intuition:** It controls how far the method advances in
  time during each update.
- **Why it matters in the current IVP Lab:** The selected \(h\) determines the
  fixed time grid, computational work, and the step used by the numerical
  method. Convergence and stability interpretations require additional
  evidence.
- **Formula, when useful:** \(h=t_{n+1}-t_n,\qquad h>0\).
- **Accessible formula explanation:** “h equals t sub n plus one minus t sub n,
  and h is positive.”
- **Assumptions and limits:** Constant positive \(h\), aligned endpoints, and
  released step budget. No adaptive or nonuniform-grid support claim.
- **Common misconception:** Misconception: making \(h\) smaller always fixes
  the numerical result. Correction: refinement increases the number of steps,
  but accuracy and stability still depend on the problem, method, arithmetic,
  and whether the relevant assumptions hold.
- **Module-specific note:** This is ODE time-step size, not PDE spatial grid
  spacing.
- **Tutor topic:** Explain the current \(h\), step count, and likely refinement
  effects without promising improvement.
- **Proposed annotation locations:** `ODE-W1-ANN-004`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned because the preferred label,
  formula, and limits are explicitly temporal.
- **Content-review evidence:** Existing catalog rich draft; terminology and
  notation standards; `validateFixedStepGrid` contract; current Data label.
- **Maintainer recommendation:** Approve the ODE-owned card rather than
  prematurely generalizing it as cross-module core content.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.5 Time grid

- **Stable ID:** `time_grid`
- **Display label:** Time grid
- **Accepted aliases:** None.
- **Avoided wording:** PDE spatial grid; arbitrary mesh; using grid points,
  steps, and \(h\) as interchangeable counts or quantities.
- **Scope:** Numerical ODE time discretization.
- **Product relevance:** Locates every stored current numerical approximation.
- **Prerequisites:** `step_size`.
- **Related terms:** `initial_condition`, `numerical_approximation`.
- **Commonly confused terms:** Time-step size; number of steps; stored-point
  count; PDE spatial grid.
- **Annotation priority:** Medium-high; one Data helper occurrence.
- **Short preview definition:** The time grid is the ordered set of times where
  the method stores numerical approximations.
- **Full definition:** A time grid is the ordered set
  \(t_0,t_1,\ldots,t_N\) at which a numerical ODE method stores
  approximations. In the current fixed-step Lab,
  \(t_n=t_0+nh\). There are \(N\) steps between \(N+1\) stored grid points,
  and the current grid includes both aligned endpoints.
- **Plain-language intuition:** It is the sequence of time locations where the
  computed values live.
- **Why it matters in the current IVP Lab:** The plot, table, comparison, and
  exact-reference evaluations rely on aligned time locations. The Lab
  validates one uniform grid rather than an adaptive or nonuniform grid.
- **Formula, when useful:** \(t_n=t_0+nh,\qquad 0\le n\le N\).
- **Accessible formula explanation:** “t sub n equals t zero plus n times h,
  for n from zero through N.”
- **Assumptions and limits:** Constant \(h>0\), finite endpoints, alignment,
  both endpoints stored, and the released point budget.
- **Common misconception:** Misconception: \(N\) steps means \(N\) stored
  points. Correction: a grid with \(N\) steps from \(t_0\) through \(t_N\)
  contains \(N+1\) stored points.
- **Module-specific note:** The card describes the released uniform time grid;
  it does not advertise adaptive or arbitrary grids.
- **Tutor topic:** Relate \(t_0\), \(t_N\), \(h\), step count, and stored-point
  count without changing the alignment contract.
- **Proposed annotation locations:** `ODE-W1-ANN-005`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned because this complete card is
  temporal and tied to the current fixed-grid contract.
- **Content-review evidence:** Existing catalog rich draft; grid contract and
  tests; current Data and Output owners.
- **Maintainer recommendation:** Approve the card and its one explicit helper
  occurrence.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.6 Numerical approximation

- **Stable ID:** `numerical_approximation`
- **Display label:** Numerical approximation
- **Accepted aliases:** `numerical solution` only when nearby language makes
  clear that it is computed and approximate; controlled display
  `Final numerical approximation`.
- **Avoided wording:** Exact value; exact solution; unexplained approximate
  solution where exact/numerical ownership matters.
- **Scope:** Cross-cutting numerical analysis, resolved here for ODE grid
  values.
- **Product relevance:** Names the computed output sequence and final value.
- **Prerequisites:** `initial_value_problem`, `time_grid`.
- **Related terms:** `exact_solution`; future `nodal_error`, `residual`, and
  `global_error`.
- **Commonly confused terms:** Exact solution; error; residual.
- **Annotation priority:** High; primary Output label.
- **Short preview definition:** A numerical approximation is a computed value
  intended to estimate an exact mathematical quantity.
- **Full definition:** A numerical approximation is a computed estimate of an
  exact mathematical quantity. In the current IVP Lab, \(u_n\) is the value
  produced by the selected method at time \(t_n\), so
  \(u_n\approx y(t_n)\). The approximation is distinct from the exact value,
  its error, and any residual of an equation.
- **Plain-language intuition:** It is the method's computed value at one grid
  time, not a claim that the exact value has been found.
- **Why it matters in the current IVP Lab:** The result summary, plot, and
  table display the sequence of computed approximations. Error analysis, when
  available, compares those values with a separate reference.
- **Formula, when useful:** \(u_n\approx y(t_n)\).
- **Accessible formula explanation:** “u sub n approximately equals y of t sub
  n.”
- **Assumptions and limits:** \(u_n\) and \(y(t_n)\) refer to the same grid
  time. The approximation symbol expresses intent, not a certified error
  bound.
- **Common misconception:** Misconception: \(u_n\) is the exact solution at
  \(t_n\). Correction: \(u_n\) is computed by the numerical method; its
  difference from a stated reference is an error, not the approximation
  itself.
- **Module-specific note:** The current Lab stores these values in immutable
  solver-result points and renders them without changing their numerical
  ownership.
- **Tutor topic:** Explain what a displayed \(u_n\) represents and distinguish
  it from exact value, error, and residual.
- **Proposed annotation locations:** `ODE-W1-ANN-006`.
- **Proposed runtime owner:** Future `src/glossary/coreGlossary.ts`, imported by
  the lazy ODE composition only after E2.
- **Proposed card-content owner:** Core-owned with an ODE contextual override
  for “Why it matters here.”
- **Content-review evidence:** Existing catalog rich draft; terminology and
  notation standards; accepted Output wording in `src/ode/odeApp.ts`.
- **Maintainer recommendation:** Approve as reusable core content plus an ODE
  override.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.7 Exact solution

- **Stable ID:** `exact_solution`
- **Display label:** Exact solution
- **Accepted aliases:** None.
- **Avoided wording:** Exact numerical result; exact answer; validated exact
  solution when only the existing numerical consistency check has run.
- **Scope:** Numerical ODE IVPs.
- **Product relevance:** Optional analytical reference for current error and
  Convergence calculations.
- **Prerequisites:** `initial_value_problem`.
- **Related terms:** `numerical_approximation`; future `global_error`,
  `reference_solution`, and `nodal_error`.
- **Commonly confused terms:** Numerical approximation; reference solution;
  a function that matches only the initial condition.
- **Annotation priority:** High; Data exact-reference composition.
- **Short preview definition:** An exact solution is a function that satisfies
  the stated initial value problem.
- **Full definition:** An exact solution satisfies both the differential
  equation and the initial condition throughout the stated interval. In the
  current Lab an optional analytical expression can supply reference values
  for error calculations. The existing consistency check samples numerical
  agreement; it is not a proof that the entered expression is exact.
- **Plain-language intuition:** It is the mathematical function used as a
  reference, not another run of a numerical method.
- **Why it matters in the current IVP Lab:** The Lab needs a usable supplied
  exact solution before it can calculate current exact-reference errors or run
  the Convergence Study.
- **Formula, when useful:** \(y'(t)=f(t,y(t)),\qquad y(t_0)=y_0\).
- **Accessible formula explanation:** “y prime of t equals f of t and y of t,
  with y of t zero equal to y zero.”
- **Assumptions and limits:** The function must satisfy the equation and
  initial condition on the interval. Matching \(y(t_0)=y_0\) alone is
  insufficient. The user's expression is not formally proved exact.
- **Common misconception:** Misconception: passing the Lab's consistency check
  proves the expression is exact. Correction: the check is numerical evidence
  at sampled values, not a mathematical proof.
- **Module-specific note:** Presets may supply an analytical expression, and
  custom input may supply one; neither changes the numerical integration
  itself.
- **Tutor topic:** Explain reference-value use and the proof limitation
  without treating the expression as automatically certified.
- **Proposed annotation locations:** `ODE-W1-ANN-007`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned; the Wave 1 definition, formula,
  and proof limitation are specifically IVP-scoped.
- **Content-review evidence:** Existing catalog rich draft; exact-solution
  numerical contract; Data and Convergence owners.
- **Maintainer recommendation:** Approve as ODE-owned rather than generalizing
  the IVP-specific card into core content.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.8 Explicit scheme

- **Stable ID:** `explicit_scheme`
- **Display label:** Explicit scheme
- **Accepted aliases:** `explicit method`.
- **Avoided wording:** Explicit exact solution; automatically accurate;
  automatically stable; all explicit methods are first order.
- **Scope:** Cross-cutting discrete methods; current example is Forward Euler.
- **Product relevance:** Explains a central Method distinction without adding
  an implicit-scheme card.
- **Prerequisites:** `numerical_approximation`, `step_size`.
- **Related terms:** `forward_euler_method`, `backward_euler_method`; future
  `implicit_scheme` as plain related text only.
- **Commonly confused terms:** Accuracy order; absolute stability; explicit
  closed form for an exact solution.
- **Annotation priority:** Medium-high; one safe Method teaching note outside
  method-card buttons.
- **Short preview definition:** An explicit scheme computes the next numerical
  approximation directly from quantities already known.
- **Full definition:** An explicit scheme computes the next numerical
  approximation directly from data already available at the current step.
  Forward Euler is the current simplest example:
  \(u_{n+1}=u_n+h f(t_n,u_n)\). Explicitness describes how the update is
  formed; it does not determine the method's accuracy order or absolute
  stability by itself.
- **Plain-language intuition:** Known values go in, and the next value comes
  out without solving a new equation for that value.
- **Why it matters in the current IVP Lab:** It helps explain why Forward Euler
  and other explicit choices differ in work and stability behavior from
  Backward Euler and other implicit choices.
- **Formula, when useful:** \(u_{n+1}=u_n+h f(t_n,u_n)\) (Forward Euler
  example).
- **Accessible formula explanation:** “u sub n plus one equals u sub n plus h
  times f of t sub n and u sub n.”
- **Assumptions and limits:** The quantities on the right are already known for
  the stated update. Explicit does not mean first-order, inaccurate,
  unsuitable, or exact.
- **Common misconception:** Misconception: explicit means the exact solution
  has an explicit formula. Correction: explicit describes how the numerical
  update computes its next approximation.
- **Module-specific note:** Forward Euler is the Wave 1 example; other current
  method-family details remain outside this ten-term content review.
- **Tutor topic:** Identify which current quantities are known before the
  selected explicit update is evaluated.
- **Proposed annotation locations:** `ODE-W1-ANN-008`.
- **Proposed runtime owner:** Future `src/glossary/coreGlossary.ts`, imported by
  lazy ODE composition only after E2.
- **Proposed card-content owner:** Core-owned with an ODE contextual override.
- **Content-review evidence:** Existing catalog rich draft; cross-cutting
  terminology row; current Forward Euler formula and method metadata.
- **Maintainer recommendation:** Approve as reusable core content plus an ODE
  override.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.9 Forward Euler method

- **Stable ID:** `forward_euler_method`
- **Display label:** Forward Euler method
- **Accepted aliases:** `Forward Euler`; `forward Euler`; `Euler method` only
  when the current context makes Forward Euler unambiguous.
- **Avoided wording:** Always first-order in observed data; always inaccurate;
  smaller \(h\) fixes every problem.
- **Scope:** Numerical ODE one-step methods.
- **Product relevance:** Current Beginner Starter method and primary explicit
  teaching example.
- **Prerequisites:** `initial_value_problem`, `step_size`, `time_grid`,
  `explicit_scheme`.
- **Related terms:** `numerical_approximation`; future `absolute_stability` and
  `observed_order`.
- **Commonly confused terms:** Backward Euler; theoretical order versus
  observed order; explicitness versus stability.
- **Annotation priority:** High; selected-method Data heading.
- **Short preview definition:** Forward Euler advances directly using the
  derivative at the current time and current approximation.
- **Full definition:** Forward Euler is an explicit one-step method that uses
  the current time \(t_n\) and approximation \(u_n\) to compute
  \(u_{n+1}=u_n+h f(t_n,u_n)\). Its theoretical order is 1 under the usual
  regularity and stability assumptions. It is simple and useful for learning,
  while its absolute-stability restrictions may require small time-step sizes.
- **Plain-language intuition:** It follows the current tangent direction for
  one time step.
- **Why it matters in the current IVP Lab:** Its direct update makes it a clear
  baseline for seeing how method choice and time-step size affect computed
  values. It is also the Beginner Starter method.
- **Formula, when useful:** \(u_{n+1}=u_n+h f(t_n,u_n)\).
- **Accessible formula explanation:** “u sub n plus one equals u sub n plus h
  times f of t sub n and u sub n.”
- **Assumptions and limits:** Theoretical order 1 needs the usual regularity
  and stability assumptions. Observed order need not equal 1 in every finite
  run, and smaller \(h\) is not a universal remedy.
- **Common misconception:** Misconception: every Forward Euler run must show
  observed order exactly 1. Correction: 1 is the theoretical order under the
  usual assumptions; finite observed evidence can differ or be unavailable.
- **Module-specific note:** The card explains the released fixed-step method
  without changing its solver, metadata, or stability contract.
- **Tutor topic:** Walk through one update using the current equation and
  values, then qualify any order or stability statement.
- **Proposed annotation locations:** `ODE-W1-ANN-009`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned.
- **Content-review evidence:** Existing catalog rich draft; current method
  catalog formula, blurb, metadata, solver, and numerical contract.
- **Maintainer recommendation:** Approve the card and safe selected-heading
  annotation; do not nest a trigger in the method selection card.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

### 3.10 Backward Euler method

- **Stable ID:** `backward_euler_method`
- **Display label:** Backward Euler method
- **Accepted aliases:** `Backward Euler`; `backward Euler`.
- **Avoided wording:** Always accurate; every implicit solve succeeds;
  universally best for stiff problems; successful iteration proves
  A-stability.
- **Scope:** Numerical ODE one-step methods.
- **Product relevance:** Current implicit contrast to Forward Euler.
- **Prerequisites:** `initial_value_problem`, `step_size`, `time_grid`.
- **Related terms:** `numerical_approximation`; future `implicit_scheme`,
  `absolute_stability`, `a_stability`, and `stiffness`. The future terms are
  plain text, not live links.
- **Commonly confused terms:** Implicit scheme; nonlinear-solver convergence;
  absolute stability; accuracy.
- **Annotation priority:** High; selected-method Data heading.
- **Short preview definition:** Backward Euler defines the next approximation
  through an equation involving the unknown next value.
- **Full definition:** Backward Euler is an implicit one-step method:
  \(u_{n+1}=u_n+h f(t_{n+1},u_{n+1})\). Because the unknown next value appears
  on both sides, each step must be solved. Its theoretical order is 1 under the
  usual assumptions, and it is A-stable for the scalar test equation.
  A-stability does not establish accuracy or successful nonlinear iteration.
- **Plain-language intuition:** The next value appears inside its own update
  equation, so the method cannot simply evaluate known quantities and move on.
- **Why it matters in the current IVP Lab:** The current implementation may
  use nonlinear iteration and reports its diagnostics separately. That
  iteration evidence must not be confused with a mathematical
  absolute-stability property.
- **Formula, when useful:** \(u_{n+1}=u_n+h f(t_{n+1},u_{n+1})\).
- **Accessible formula explanation:** “u sub n plus one equals u sub n plus h
  times f at t sub n plus one and u sub n plus one.”
- **Assumptions and limits:** Theoretical order 1 needs the usual regularity
  and stability assumptions. A-stability is stated only for the scalar test
  equation. A nonlinear solve can fail, and a successful solve does not prove
  accuracy or A-stability.
- **Common misconception:** Misconception: if the nonlinear iteration
  converges, Backward Euler must be accurate and stable for that run.
  Correction: iteration success, accuracy, and absolute stability are
  different questions.
- **Module-specific note:** Under provisional Option A, this card is
  self-contained: it directly explains the solved next-value equation and
  names `implicit_scheme` only as a future related term.
- **Tutor topic:** Explain why the update is implicit, how this implementation
  iterates, and why nonlinear convergence is different from absolute
  stability.
- **Proposed annotation locations:** `ODE-W1-ANN-010`.
- **Proposed runtime owner:** Future
  `src/ode/odeGlossaryContent.ts`.
- **Proposed card-content owner:** ODE-owned.
- **Content-review evidence:** Existing catalog rich draft; current method
  catalog and implicit diagnostics; nonlinear and stability contracts.
- **Maintainer recommendation:** Approve with provisional implicit-scheme
  Option A; retain the card in the exact ten-term set.
- **Maintainer choice:** Approve / Revise / Defer — unselected.
- **Maintainer notes:** —
- **Review date:** Pending.
- **Approved status, initially pending:** `PENDING_MAINTAINER_REVIEW`.

## 4. Proposed exact annotation map

The map proposes ten annotations, one per card. All are inside the complete
Lab route. `/ode` was evaluated, but its static `RouteModule` has no
Lab-owned Glossary binding; no `/ode` annotation is proposed under the
recommended no-framework-change design.

### ODE-W1-ANN-001

- **Annotation ID:** `ODE-W1-ANN-001`
- **Stable term ID:** `ordinary_differential_equation`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `DEFAULT_LEDE` and `mountOdeApp.render`
- **Exact visible text:** `ordinary differential equation`
- **Surrounding context:** Proposed E2 lede composition: “Explore fixed-step
  methods for a first-order ordinary differential equation posed as an initial
  value problem, then analyze numerical error, observed convergence, and
  method behavior as the time-step size changes.” The exact copy is pending.
- **Surface:** lede
- **Trigger type supported by the framework:** Native text-like button created
  explicitly by `GlossaryScopeController.createTerm`.
- **First-use or repeated-use status:** First use in scope
  `ode_wave1_context`.
- **Desktop behavior:** Immediate preview on focus, delayed preview on hover,
  click/Enter/Space pins the complete card.
- **Mobile behavior:** Tap opens the one modal bottom sheet.
- **Accessible trigger name:** `ordinary differential equation`
- **Keyboard behavior:** Native Tab focus plus Enter/Space activation; Escape
  closes through the Host.
- **Rerender lifecycle:** Recreated through an explicit
  `beginScopeRerender("ode_wave1_context")` transaction.
- **Route-disposal lifecycle:** Host closes/disconnects before the Lab disposes
  the binding and scope.
- **Whether the annotation survives result rerender:** Yes, only through exact
  same-scope/same-term replacement.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Breadcrumb `Numerical ODE` and later ODE mentions
  remain ordinary link/text, never nested triggers.
- **Implementation dependency:** E1-approved card data; E2-approved lede copy,
  ODE runtime composition, and binding.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-002

- **Annotation ID:** `ODE-W1-ANN-002`
- **Stable term ID:** `initial_value_problem`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `DEFAULT_LEDE` and `mountOdeApp.render`
- **Exact visible text:** `initial value problem`
- **Surrounding context:** The same proposed exact lede sentence as
  `ODE-W1-ANN-001`; the route title and breadcrumb remain plain.
- **Surface:** lede
- **Trigger type supported by the framework:** Explicit native text-like
  button.
- **First-use or repeated-use status:** First use in
  `ode_wave1_context`.
- **Desktop behavior:** Framework preview then pinned card.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `initial value problem`
- **Keyboard behavior:** Native Tab, Enter, and Space; Escape closes.
- **Rerender lifecycle:** Controlled same-scope replacement.
- **Route-disposal lifecycle:** Host close/disconnect, then Lab-owned binding
  disposal.
- **Whether the annotation survives result rerender:** Yes through exact
  replacement.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Route title, breadcrumb, and subsequent mentions
  remain plain.
- **Implementation dependency:** Approved E1 content and E2 lede/binding.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-003

- **Annotation ID:** `ODE-W1-ANN-003`
- **Stable term ID:** `initial_condition`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm`
- **Exact visible text:** `Initial condition`
- **Surrounding context:** A new sibling term trigger beside the unchanged
  native `Initial value y₀` input label. It is not placed inside the label.
- **Surface:** label (sibling companion)
- **Trigger type supported by the framework:** Explicit native text-like
  button outside the native label.
- **First-use or repeated-use status:** First use in `ode_wave1_data`.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Initial condition`
- **Keyboard behavior:** Independent Tab stop and native Enter/Space; the
  visible/native input label continues to focus the input.
- **Rerender lifecycle:** Recreated in the Data-scope transaction.
- **Route-disposal lifecycle:** Scope and listeners disposed by the Lab after
  Host disconnect.
- **Whether the annotation survives result rerender:** No; leaving Data closes
  it because Output has no matching Data-scope trigger.
- **Whether it is excluded from editable MathLive content:** Yes; it is outside
  the editable field host.
- **Duplicate-term policy:** Start-time and other initial-value wording remains
  plain.
- **Implementation dependency:** Approved Data composition and accessibility
  tests in E2.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-004

- **Annotation ID:** `ODE-W1-ANN-004`
- **Stable term ID:** `step_size`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm` and
  `mountOdeApp.renderCompareForm`
- **Exact visible text:** `Time-step size`
- **Surrounding context:** One sibling term trigger beside the unchanged native
  `Time-step size h` input label. Single and Compare forms use the same
  annotation ID and active Data scope.
- **Surface:** label (sibling companion)
- **Trigger type supported by the framework:** Explicit native text-like
  sibling button.
- **First-use or repeated-use status:** First use in `ode_wave1_data`; only the
  currently rendered single or Compare form exists.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Time-step size`
- **Keyboard behavior:** Independent native button behavior; the input label
  remains separately operable.
- **Rerender lifecycle:** Data-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect precedes Lab scope disposal.
- **Whether the annotation survives result rerender:** No across Data-to-Output;
  yes across an exact Data-scope replacement.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Lede and Convergence occurrences remain plain;
  Compare does not create two simultaneous triggers.
- **Implementation dependency:** E1 card; E2 label-companion helper and both
  form tests.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-005

- **Annotation ID:** `ODE-W1-ANN-005`
- **Stable term ID:** `time_grid`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm` and
  `mountOdeApp.renderCompareForm`
- **Exact visible text:** `time grid`
- **Surrounding context:** One new helper sentence immediately after the
  interval/time-step controls: “The current fixed-step time grid includes the
  aligned start and end times.” Exact copy is pending.
- **Surface:** helper text
- **Trigger type supported by the framework:** Explicit native text-like
  button inside noninteractive helper prose.
- **First-use or repeated-use status:** First use in `ode_wave1_data`.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `time grid`
- **Keyboard behavior:** Native button with Enter/Space and Escape closure.
- **Rerender lifecycle:** Data-scope controlled replacement.
- **Route-disposal lifecycle:** Scope disposal after Host disconnect.
- **Whether the annotation survives result rerender:** No across Data-to-Output.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Output `Grid points stored`, chart axes, Compare
  diagnostics, and table values remain plain.
- **Implementation dependency:** Maintainer approval of the exact helper copy
  plus E1/E2.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-006

- **Annotation ID:** `ODE-W1-ANN-006`
- **Stable term ID:** `numerical_approximation`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.mountResults`
- **Exact visible text:** `Final numerical approximation`
- **Surrounding context:** Existing result-summary label immediately before the
  immutable final computed value.
- **Surface:** output label
- **Trigger type supported by the framework:** Explicit native text-like
  button replacing only the label text node.
- **First-use or repeated-use status:** First use in `ode_wave1_output`.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Final numerical approximation`
- **Keyboard behavior:** Native button behavior; no change to result value or
  chart focus.
- **Rerender lifecycle:** Output-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect then Lab-owned disposal.
- **Whether the annotation survives result rerender:** Yes when the successful
  single-result label is recreated with the same scope/term; otherwise it
  closes.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Compare labels, chart title, legend, tooltip,
  table cells, and Tutor text remain plain.
- **Implementation dependency:** E1 core entry, ODE override, E2 Output DOM
  composition and lifecycle tests.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-007

- **Annotation ID:** `ODE-W1-ANN-007`
- **Stable term ID:** `exact_solution`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm`
- **Exact visible text:** `Exact solution`
- **Surrounding context:** A new standalone Data mini-heading immediately
  before the unchanged checkbox label `I know the exact solution`; the trigger
  is not inside the checkbox label or editable field.
- **Surface:** heading
- **Trigger type supported by the framework:** Explicit native text-like
  button in a noninteractive heading container.
- **First-use or repeated-use status:** First use in `ode_wave1_data`.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Exact solution`
- **Keyboard behavior:** Native button; checkbox and editable field keep their
  own accessible names and focus behavior.
- **Rerender lifecycle:** Data-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect then Data scope/binding
  disposal.
- **Whether the annotation survives result rerender:** No across Data-to-Output.
- **Whether it is excluded from editable MathLive content:** Yes, explicitly
  outside `[data-exact-expression-field]`.
- **Duplicate-term policy:** Checkbox text, preset preview, Convergence labels,
  formulas, and Tutor transcript remain plain.
- **Implementation dependency:** Approved E1 card and E2 Data composition.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-008

- **Annotation ID:** `ODE-W1-ANN-008`
- **Stable term ID:** `explicit_scheme`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderChoosePanel`
- **Exact visible text:** `Explicit scheme`
- **Surrounding context:** One new short Method teaching note above the method
  grid. The trigger is outside every method-selection button.
- **Surface:** helper text
- **Trigger type supported by the framework:** Explicit native text-like
  button inside noninteractive prose.
- **First-use or repeated-use status:** First use in `ode_wave1_method`.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Explicit scheme`
- **Keyboard behavior:** Native button; method-card keyboard selection remains
  unchanged.
- **Rerender lifecycle:** Method-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect then scope/binding disposal.
- **Whether the annotation survives result rerender:** No; it is a Method-step
  annotation and closes when that scope becomes empty.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** `Explicit` inside method-card button blurbs and
  Output metadata remains plain.
- **Implementation dependency:** Approval of the exact teaching-note copy;
  E1 core entry/ODE override; E2 Method composition.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-009

- **Annotation ID:** `ODE-W1-ANN-009`
- **Stable term ID:** `forward_euler_method`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm`
- **Exact visible text:** `Forward Euler`
- **Surrounding context:** Existing selected-method Data heading. The Method
  selection card remains one intact button and is not annotated.
- **Surface:** heading
- **Trigger type supported by the framework:** Explicit native text-like
  button composed inside the noninteractive heading.
- **First-use or repeated-use status:** First use in `ode_wave1_data` when
  Forward Euler is selected.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Forward Euler`
- **Keyboard behavior:** Native button; route heading and form inputs retain
  their focus order.
- **Rerender lifecycle:** Data-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect then scope/binding disposal.
- **Whether the annotation survives result rerender:** No across
  Data-to-Output; yes across an exact Data rerender.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Selection card, result heading, metadata,
  diagnostics, chart legend, and Tutor text remain plain.
- **Implementation dependency:** E1 card and E2 selected-heading composition.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

### ODE-W1-ANN-010

- **Annotation ID:** `ODE-W1-ANN-010`
- **Stable term ID:** `backward_euler_method`
- **Route:** `/ode/initial-value-problems`
- **File:** `src/ode/odeApp.ts`
- **Owner function/component:** `mountOdeApp.renderForm`
- **Exact visible text:** `Backward Euler`
- **Surrounding context:** Existing selected-method Data heading. The Method
  selection card remains an un-nested selection button.
- **Surface:** heading
- **Trigger type supported by the framework:** Explicit native text-like
  button composed in the noninteractive heading.
- **First-use or repeated-use status:** First use in `ode_wave1_data` when
  Backward Euler is selected.
- **Desktop behavior:** Framework preview/pin.
- **Mobile behavior:** Framework bottom sheet.
- **Accessible trigger name:** `Backward Euler`
- **Keyboard behavior:** Native button; no change to form or method-selection
  semantics.
- **Rerender lifecycle:** Data-scope controlled replacement.
- **Route-disposal lifecycle:** Host disconnect then scope/binding disposal.
- **Whether the annotation survives result rerender:** No across
  Data-to-Output; yes across an exact Data rerender.
- **Whether it is excluded from editable MathLive content:** Yes.
- **Duplicate-term policy:** Selection card, result heading, method metadata,
  nonlinear diagnostics, and Tutor text remain plain.
- **Implementation dependency:** E1 card, maintainer choice on
  `implicit_scheme`, and E2 selected-heading composition.
- **Review status:** `PENDING_MAINTAINER_REVIEW`.

## 5. Annotation density and rejected sites

Recommended density is exactly one proposed primary annotation per Wave 1
term, scoped as follows:

| Conceptual surface | Proposed count | Annotation IDs |
|---|---:|---|
| Lab context/lede | 2 | `001`, `002` |
| Method step | 1 | `008` |
| Data, including selected-method headings | 6 | `003`, `004`, `005`, `007`, `009`, `010` |
| Output | 1 | `006` |

Rejected over-annotation sites:

- `/ode` lede and card title: static route, no Lab-owned binding;
- Lab breadcrumb `Numerical ODE`: already a link, so a nested trigger is
  prohibited;
- method selection cards: each card is already one native button;
- progress pills and action buttons;
- native form-label interiors;
- editable RHS or exact-solution MathLive content and raw formula tokens;
- chart canvas title, legends, and tooltips;
- raw numeric cells and table headings;
- validation and comparison diagnostics;
- Tutor transcript and API content;
- repeated exact-solution, time-grid, and numerical-approximation mentions.

Rejected under-annotation risk: excluding `/ode` means a learner must enter the
complete Lab to use Wave 1; selected method cards are not available until the
learner chooses Forward or Backward Euler; and only one Output term is
interactive. These are deliberate costs of preserving the accepted ownership
and no-nested-control rules. The maintainer may choose a later static-route
design or composite method-card redesign, but neither is silently included.

Maintainer options are recorded without selection in decision cards D06
through D11 of the design specification.

## 6. Content ownership proposal

| Stable ID | Logical owner | Proposed E1 physical owner | ODE override | Reusable complete card? | Lazy implication |
|---|---|---|---|---|---|
| `ordinary_differential_equation` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Unreferenced in E1; lazy ODE graph in E2 |
| `initial_condition` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Same |
| `initial_value_problem` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Same |
| `step_size` | ODE | `src/ode/odeGlossaryContent.ts` | No | No; time-specific | Same |
| `time_grid` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Same |
| `numerical_approximation` | Core | `src/glossary/coreGlossary.ts` | Yes | Yes, with module context | File stays absent from entry graph; imported by ODE only in E2 |
| `exact_solution` | ODE | `src/ode/odeGlossaryContent.ts` | No | No; IVP-specific | Lazy ODE graph |
| `explicit_scheme` | Core | `src/glossary/coreGlossary.ts` | Yes | Yes | Imported by ODE only in E2 |
| `forward_euler_method` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Lazy ODE graph |
| `backward_euler_method` | ODE | `src/ode/odeGlossaryContent.ts` | No | No | Lazy ODE graph |

For the two core entries, the core record owns the short definition, general
why-it-matters text, formula, and Tutor topic. The ODE module override owns the
current-IVP contextual definition, `whyItMattersHere`, and any narrower Tutor
topic. For the eight ODE entries, the complete card is module-owned; no
duplicate “core” record is proposed.

This split deliberately rejects premature core ownership for `step_size` and
`exact_solution`. Their approved Wave 1 labels, formulas, and limits are
time/IVP-specific. A future module can propose a separate core promotion
without changing either stable ID.

## 7. Provisional `implicit_scheme` recommendation

The ten-term set contains Backward Euler but no standalone
`implicit_scheme` card. The provisional recommendation is Option A:

- retain all ten terms;
- keep the Backward Euler card self-contained;
- explain that the unknown next approximation appears in an equation that
  must be solved;
- show `implicit_scheme` only as plain future related text;
- create no broken trigger or live related-term link.

Option B would expand the wave to eleven terms and would require a new
maintainer-authorized catalog, content, dependency, annotation, validation,
and rollout revision. Option C would remove Backward Euler and require a new
exact-set decision. No option is selected in this packet.

## 8. Content packet status

Complete term cards: 10 of 10.

Proposed annotations: 10.

Maintainer-approved cards: 0.

Maintainer-approved annotations: 0.

Production entries, annotations, bindings, and visible behavior: 0.
