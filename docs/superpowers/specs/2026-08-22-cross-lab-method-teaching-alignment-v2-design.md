# Cross-Lab Method Teaching Alignment v2 Design

**Status:** **DESIGN ACCEPTED WITH BINDING ADDENDUM.** Phase 0 authority work
and Phase 1's pure teaching model are authorized. Phase 2 and all browser-
visible redesign work remain unauthorized.

**Date:** 2026-08-22

**Milestone:** Cross-Lab Method Teaching Alignment v2

**Current product baseline:** `411e641d8cc6b14240acc408130876781fb1ee84`
(tree `92f79cba8bdabafb9a97e3a99d76ddff853fe35c`)

**Predecessor authority:** [Cross-Lab Presentation System v1](2026-08-12-cross-lab-presentation-system-v1-design.md)

**Implementation plan:** [Cross-Lab Method Teaching Alignment v2 implementation plan](../plans/2026-08-22-cross-lab-method-teaching-alignment-v2-implementation-plan.md)

**Acceptance checkpoint:** `bfe5d514c67b1f5c00a1bc71b128f158e4811a5a`
(tree `29c2a1e19718ce312671c8307dc65240e1c5eab6`)

**Next gate:** independent mathematical/content audit of the Phase 1 teaching
registry, followed by separate Maintainer authorization before Phase 2.

## 1. Executive decision

Adopt **Landscape to Lens** as the Method-stage experience for the Initial
Value Problems Lab.

The Method stage will teach in the same cognitive order as the accepted Linear
Systems experience:

```text
Understand the problem
  -> survey the method landscape
  -> identify the selected runnable method
  -> learn how that method works
  -> learn the concepts needed for that method
  -> know what to inspect after solving
  -> continue to Data
```

ODE will express that sequence differently from Linear Systems. It will retain
eight runnable methods, meaningful selection, a first-order/second-order
boundary, Compare, presets, editable mathematics, charts, exact-reference
work, Convergence, Tutor, and Glossary. The shared sequence is a cognitive
contract, not a mandate for identical markup or six matching cards.

The selected experience has five visible editorial movements:

1. a compact initial-value-problem foundation;
2. a curated, selectable method landscape;
3. one selected-method teaching lens;
4. method-specific concepts and an after-solve observation lens; and
5. a concise, explicit transition to Data.

Selection remains a product action. Selecting a method changes the runnable
method, keeps the learner in Method, updates the selected teaching lens, and
prepares the existing Data stage. It does not run a solver, manufacture result
evidence, or create a second preview-method state.

### 1.1 Binding addendum

The Maintainer accepts **Landscape to Lens** with this binding cognitive order:

```text
Problem
  -> Landscape
  -> Selected method lens
  -> Selected concepts
  -> After-solve guidance
  -> Continue to Data
```

Compare is a secondary branch attached to the landscape. A compact entry may
sit within or immediately after the landscape, but Compare is not a full
primary teaching section between Landscape and the selected method lens.
Detailed comparison teaching appears only after the learner enters Compare.

Method selection chooses the family; Data owns editable order. Selecting an
ordered family preserves that family's existing stored order. Default order is
used only during initial session construction, the existing New experiment /
reset contract, or when no family-specific order has ever been initialized
under current product authority. Reselecting Adams-Bashforth, Adams-Moulton,
or BDF must not replace its stored order with catalog default metadata.

Selection does not auto-scroll. **Read selected method** is not a mandatory
always-visible control; Phase 2 may introduce it only if browser evidence shows
a meaningful orientation problem, especially on mobile.

The accepted future static-diagram responsibilities are: one-step update /
endpoint relation for Forward and Backward Euler; stage-sampling path for RK4;
history rail, with a predictor/corrector variant, for Adams-Bashforth,
Adams-Moulton, and BDF; and staggered-state rail for Leap-Frog. Taylor 2 starts
with formula anatomy and an ordered process unless later visual evidence shows
a derivative-chain diagram is clearer. No diagram belongs to Phase 0 or 1.

## 2. Current problem

The Presentation System has aligned shared shells, workflow navigation, stage
roles, teaching surfaces, results, evidence, analysis, and visual grammar.
Those components are not the present problem.

The remaining gap is pedagogical:

| Lab | Current Method-stage sequence | Consequence |
|---|---|---|
| Initial Value Problems | Eight isolated method choices, then an immediate transition to Data | A learner chooses before seeing the problem model, method relationships, selected-method mechanics, or what to inspect later. |
| Linear Systems | Problem foundation, method landscape, selected runnable method, concepts, result-checking guidance, then an explicit Data transition | A learner understands what is being solved and why the runnable method matters before configuring inputs. |

The ODE beginner session already identifies Forward Euler in
`odeSession.ts`, but the first Method screen does not show a selected state
or a Forward Euler deep dive. Its header says “Beginner starter · Forward
Euler” while the main teaching surface still asks the learner to choose among
eight equal-weight cards. That is a mismatch between state and pedagogy.

## 3. Baseline audit

### 3.1 Evidence boundary

The baseline combines repository inspection with a fresh, read-only browser
review of:

- `/ode/initial-value-problems`: Method desktop, Method at 390 × 844,
  Forward Euler transition to Data, and Compare entry;
- `/linear-algebra/linear-systems`: Method desktop, Method at 390 × 844,
  and the transition to Data.

Screenshots were saved outside the repository and were not committed. The
review set includes:

- `ode-method-desktop-viewport.png`;
- `ode-data-desktop-viewport.png`;
- `ode-compare-entry-desktop-viewport.png`;
- `ode-method-mobile.png` and `ode-data-mobile.png`;
- `linear-systems-method-desktop-viewport.png`;
- `linear-systems-data-desktop-viewport.png`; and
- `linear-systems-method-mobile.png` and
  `linear-systems-data-mobile.png`.

At the 390-pixel browser override, both reviewed routes reported no
document-level horizontal overflow, and the reviewed tabs had no captured
warning or error console records. This is visual and DOM evidence only. It is
not screen-reader certification, formal contrast certification, or evidence
for every browser.

### 3.2 ODE findings

1. The first mathematical object in Method is not the IVP. The learner first
   encounters a Compare action and eight method cards.
2. The eight cards mix several nonexclusive dimensions—problem profile,
   explicitness, step structure, and order—without an organizing landscape.
3. The current Beginner Starter method is visible only in the Lab identity,
   not as the selected choice within Method.
4. Activating a single method immediately replaces Method with Data. There is
   no selected-method teaching step or deliberate learning-to-doing control.
5. Compare truthfully says that one first-order problem is shared and excludes
   Leap-Frog, but it appears as a detached utility action before a reason to
   compare or an observation question.
6. Data is comparatively strong: it identifies the selected method, preserves
   values, offers six first-order presets, distinguishes optional exact
   reference input from integration, and provides problem-specific observation
   and warning copy.
7. Output is also strong: it owns the successful problem context, final
   approximation, method metadata, implicit diagnostics when applicable,
   trajectory chart, stored values, and first-order Convergence entry.
8. On mobile, the eight full cards form a long undifferentiated list. The
   selected method and its teaching cannot anchor the reading sequence because
   no selected lens exists.

### 3.3 Linear Systems findings

1. Method opens with the mathematical problem `A x = b`, identifies the
   roles of `A`, `x`, and `b`, and connects equations to matrix form.
2. A method landscape distinguishes direct and iterative families while
   truthfully marking only Gaussian elimination with partial pivoting as
   runnable.
3. The selected runnable method has a clear overview, ordered algorithm,
   concept path, and authored formulas.
4. “After the solve” teaches residual meaning and explicitly limits what a
   small residual can establish without a condition number.
5. “Continue to Data” is an explicit boundary between understanding and
   configuration.
6. Mobile preserves the same authored order rather than moving controls ahead
   of mathematical context, although the complete teaching surface is
   necessarily long.

### 3.4 Diagnosis

ODE does not need Linear Systems content, a matrix-like layout, or fewer
methods. It needs the same answer order:

- What problem is this?
- What kinds of methods are available?
- Which one will run?
- How does it advance the approximation?
- Which concepts apply to it?
- What evidence should I inspect?
- What must I configure next?

## 4. Cross-Lab pedagogical philosophy

The common philosophy is:

> Method teaches the mathematical problem, the method landscape, the selected
> method, and the questions that later evidence can answer. Data configures a
> concrete problem. Output and Analysis present evidence from a successful
> computation.

This yields the product learning cycle:

```text
Understand -> Survey -> Learn -> Configure -> Compute -> Analyze
```

The Method stage must remain useful before any run and after any failed run.
It may describe implemented rules and qualified theory, but it must never
present uncomputed values, inferred performance, or a promised result.

## 5. Shared Method-stage responsibilities

| Responsibility | Required in every complete Lab | Optional variation | Stage boundary |
|---|---|---|---|
| Problem foundation | Governing mathematical object, role of its parts, one concise example or interpretation, and the Lab’s supported profile | More than one profile when the Lab truly supports distinct profiles | Method teaches; Data edits concrete values. |
| Method landscape | Available families, truthful current/planned state, and relationships relevant to learner choice | Compact when only one method is runnable; richer when several are runnable | Method only. |
| Selected runnable method | Unambiguous identity, core idea, defining rule, and runnable status | Fixed in a one-method Lab; selectable in a many-method Lab | Method selects; Data configures. |
| Selected-method concepts | Only the terms and notation needed to understand the selected rule | Depth and diagrams vary by method | Method explains; Glossary may deepen existing approved terms. |
| What to inspect after the solve | Questions the existing Output/Analysis evidence can answer and explicit limitations | Domain-specific evidence vocabulary | Method previews questions; Output/Analysis owns values and conclusions. |
| Transition to Data | Selected method, supported problem profile, required inputs, and one primary continuation action | A short checklist or sentence | Method ends; Data begins. |

A one-method Lab such as current Linear Systems can keep its landscape
explanatory and its selected method fixed. A many-method Lab such as ODE must
make the landscape selectable and keep one current teaching lens. Neither case
requires one production component per responsibility.

### 5.1 What belongs where

- **Method:** problem meaning, supported profiles, method relationships,
  selected rule, relevant concepts, qualified expectations, and observation
  questions.
- **Data:** method order where currently configurable, time interval, step
  size, initial data, editable right-hand side or acceleration, optional
  first-order exact expression, presets, and Run.
- **Output:** successful problem identity, computed approximations, method
  metadata, solver diagnostics, chart, and stored values.
- **Analysis:** exact-reference errors, refinement levels, observed order,
  consistency checks, interpretation, and limitations when eligible.

## 6. ODE domain personality

ODE remains the more exploratory Lab. Its design identity comes from:

- seeing all eight runnable methods as a coherent landscape;
- changing the selected method without leaving Method;
- moving from mathematical reading to editable experiments;
- using the same first-order problem for single runs or Compare;
- observing a trajectory rather than only a terminal number;
- optionally supplying an exact reference;
- refining `h` through the existing Convergence Study;
- asking Tutor questions from current successful evidence; and
- using explicitly authored Glossary terms without turning the Method stage
  into a glossary dump.

Teaching-first therefore makes ODE choice richer. It does not make ODE static,
linear, or visually identical to Linear Systems.

## 7. Desired first-open experience

The Beginner Starter opens Method with Forward Euler already selected.

Within the first viewport at approximately 1440 × 900, the learner should see:

1. one dominant mathematical focal point:

   `y'(t) = f(t,y(t)),   y(t₀) = y₀`;
2. a short explanation that `t` is time, `y(t)` is the unknown solution,
   `f` supplies its derivative rule, and the initial condition supplies the
   starting state;
3. the beginning or complete compact method landscape;
4. a visible “Selected: Forward Euler” state; and
5. an obvious path to learn the selected update and then continue to Data.

The first-open copy should use the existing Exponential Decay starter as its
concise concrete example:

`y' = -y, y(0) = 1`.

It may say that the derivative is the slope of the unknown solution at the
current time and state, and that a numerical method advances stored
approximations on the fixed time grid. It must also say that a numerical
approximation is not the same thing as knowing a closed-form exact solution.
The exact expression remains optional reference input in Data and is not an
input to the numerical integrator.

Leap-Frog requires a visible profile boundary rather than a footnote:

`u'' = a(t,u), u(t₀) = u₀, u'(t₀) = v₀`.

This second-order profile explains why Leap-Frog requires both initial position
and initial velocity and why it does not enter the first-order Compare flow.

## 8. Premium design principles

1. **Clarity before novelty.** Every visual distinction answers a learner
   question or communicates an interaction state.
2. **Mathematics is the focal point.** The IVP and selected update rule carry
   more visual authority than chrome, pills, or actions.
3. **Editorial, not dashboard-like.** Section rhythm, aligned mathematical
   objects, readable measures, and whitespace establish hierarchy.
4. **Controlled density.** All eight method names remain discoverable, while
   only one complete profile is open.
5. **One strong focus at each depth.** Problem, landscape, selected rule,
   concepts, and Data transition are not presented as equal competing cards.
6. **Restrained surfaces.** Use rails, grouping, type, and spacing before
   adding another rounded container.
7. **Tactile selection.** Hover, focus, selected, and activation states are
   visible without animation and never depend on color alone.
8. **Light/Dark parity.** Both themes preserve mathematical contrast,
   selection, depth, and stage identity.
9. **Authored mobile composition.** Mobile preserves the cognitive order,
   compactly rewrites the landscape, and keeps the selected method obvious.
10. **Delight through precision.** No decorative object is added without
    teaching or interaction meaning.

## 9. Explored design directions

### 9.1 Direction A — Landscape to Lens

**Pedagogical flow:** A compact IVP foundation leads to a persistent,
relationship-based method landscape. Selection updates one detailed teaching
lens below it. The lens ends with concepts, after-solve questions, and a Data
transition.

**First-open experience:** The learner sees the IVP and Forward Euler selected
within an organized landscape rather than entering through a card wall.

**Selection model:** One real selected method at a time. Selection stays in
Method, updates the existing runnable selection, and leaves order configuration
to Data.

**Deep-dive model:** The selected lens shows the core idea and primary formula
first, one update sequence second, and method-specific concepts and advanced
details third.

**Compare placement:** A compact secondary “Compare two first-order methods”
entry is attached to the landscape. Detailed comparison teaching appears only
after the learner enters Compare, so the principal reading flow remains
Landscape → Selected method lens.

**Density management:** All eight methods appear in a compact grouped index;
only the selected method receives full depth. Deeper coefficient or stage
details use one level of native disclosure.

**Desktop:** Problem and landscape establish the opening composition; the
selected profile uses a wide editorial reading surface with formula and process
allowed to share a row when that improves comprehension.

**Mobile:** The landscape becomes short grouped rows in authored order, not a
stack of desktop cards. The selected lens follows immediately. Selection does
not force scroll. A deliberate “Read selected method” action may be introduced
later only if Phase 2 browser evidence shows a meaningful orientation problem.

**Strengths:** Closely matches the Linear Systems cognitive sequence, preserves
ODE exploration, keeps relationships visible during selection, and can reuse
the current selected-method authority without new session state.

**Risks:** The opening can still become too long if every classification is
rendered as a badge or if the profile repeats the landscape.

**Fit:** Strong. It feels like a mathematical laboratory index leading into a
carefully edited method plate.

### 9.2 Direction B — Guided Method Chapters

**Pedagogical flow:** Method behaves as a short sequence of internal chapters:
Problem, Families, Selected Method, and Ready to Configure. Entering a method
replaces the landscape chapter with a focused method chapter, with an explicit
return to the method index.

**First-open experience:** The IVP and a concise “Start with Forward Euler”
chapter dominate. The method catalog is a deliberate second chapter rather
than simultaneously visible.

**Selection model:** Selecting from the Families chapter opens a method chapter
and changes the runnable method.

**Deep-dive model:** Each method reads like a compact guided lesson with
previous/next chapter controls and a final Data action.

**Compare placement:** Compare becomes a separate chapter beside Single Method,
with a first-order pair picker and comparison questions.

**Density management:** Only one chapter is visible at a time, so visual density
is low and method profiles can be deep.

**Desktop:** A restrained chapter rail supports the current chapter while the
content occupies one reading column.

**Mobile:** The same chapter sequence works naturally as a single column with a
compact index.

**Strengths:** Excellent focus, predictable reading order, and the shortest
initial viewport.

**Risks:** It hides method relationships during the deep dive, adds an
interaction model inside the existing Method/Data/Output workflow, makes quick
method exploration slower, and risks feeling like a course player instead of a
laboratory.

**Fit:** Moderate. It is pedagogically coherent but underuses ODE’s
choice-rich personality and creates more navigation/lifecycle surface than the
current architecture needs.

## 10. Selected design direction

Select **Direction A — Landscape to Lens**.

It best satisfies the milestone because:

- it adopts the Linear Systems answer order without copying its one-method
  layout;
- it makes all eight ODE methods understandable as related choices;
- it provides full teaching depth for exactly one selected method;
- the IVP and selected formula can create the intended premium first
  impression without decorative spectacle;
- its selection semantics can be keyboard-operable and orientation-preserving;
- it uses the existing `selectedMethod` as the single runnable authority;
- it leaves Data, Compare numerics, Output, Convergence, Tutor, and Glossary
  ownership intact; and
- it can remain entirely inside the existing complete-Lab lazy route.

The design rejects an internal chapter navigator because it would create a
second workflow hierarchy inside Method and make rapid method exploration less
direct.

## 11. ODE information architecture

```text
Method stage
  Problem foundation
    first-order IVP focal point
    role of t, y, f, and the initial condition
    numerical approximation versus exact solution
    second-order boundary for Leap-Frog

  Method landscape
    first-order one-step methods
    first-order history-based methods
    second-order staggered method
    one selected runnable method
    compact secondary Compare entry
      detailed comparison teaching only after entry

  Selected method lens
    core idea
    primary update or defining relation
    anatomy and one-update sequence
    work, requirements, strengths, and limits
    method-specific concepts

  After the solve
    trajectory, final approximation, exact-reference error when eligible,
    refinement, observed order, stability/qualitative questions, limitations

  Ready for Data
    selected method, supported profile, required inputs, configurable order,
    Continue to Data
```

The main Method heading remains subordinate to the route `h1`. Problem,
landscape, selected lens, and transition form one editorial sequence; they do
not each need a separate elevated card.

## 12. Interaction model

### 12.1 Single-method selection

- The Beginner Starter renders Forward Euler as visibly selected on first open.
- All eight methods remain available from the landscape.
- Activating a method commits that family as the existing runnable
  `selectedMethod`, preserves that family's initialized stored order, stays in
  Method, and updates the selected teaching lens. Catalog default order is
  metadata and applies only during initial construction, New experiment/reset,
  or first initialization of that family under current product authority.
- Selection does not run the solver, clear Data drafts, alter numerical
  results, or imply that the method is suitable for the current unrun problem.
- The selected method name and problem profile are repeated at the top of the
  teaching lens and in the Data transition.
- Order ranges are visible as teaching facts in the landscape/profile.
  The actual order control remains in Data for Adams-Bashforth,
  Adams-Moulton, and BDF.
- Returning from Data to Method shows the current family and configured order.

### 12.2 Focus and orientation

- Activation rerenders the teaching lens without automatically scrolling the
  page.
- After rerender, focus is restored with `preventScroll` to the newly selected
  method control in the landscape.
- A concise polite status announces “{method} selected. Teaching profile
  updated.” It does not announce the entire profile.
- A nearby explicit “Read selected method” action is not required. Phase 2 may
  add it only if browser evidence shows meaningful landscape-to-profile
  distance; if present, focus moves only when that action is invoked.
- The selected state uses written text or an accessible state plus shape/border
  treatment; color is supplementary.
- Switching methods preserves the learner’s position in the landscape. Native
  disclosures in the old profile close unless an implementation spike proves
  that preserving them is both useful and unambiguous.

### 12.3 Output authority remains separate

Method teaching is available with or without output. A prior successful result
remains an immutable result snapshot under the existing session contract.
Output navigation remains available only when the existing matching-success
rules say it is current for the selected configuration. Selecting another
method does not relabel old evidence as evidence for the new method.

No teaching-preview method, computed suitability score, completion state, or
visited state is introduced.

## 13. Method landscape

The landscape uses three beginner-readable groups and a small set of
orthogonal columns or equivalent written attributes.

### 13.1 Primary groups

1. **First-order · one-step**
   - Forward Euler
   - Backward Euler
   - Taylor Method (Order 2)
   - Runge-Kutta 4
2. **First-order · uses history**
   - Adams-Bashforth
   - Adams-Moulton
   - Backward Differentiation Formula
3. **Second-order · staggered state**
   - Leap-Frog

These groups answer “what information does an update carry?” They do not imply
that explicit/implicit or accuracy order is a separate family.

### 13.2 Truthful comparison dimensions

| Dimension | Product-safe values | Authority and use |
|---|---|---|
| Problem profile | First-order `y'=f(t,y)`; second-order `u''=a(t,u)` | `methodCatalog.ts`, `odeApp.ts`, and expression profiles. This is the strongest top-level boundary. |
| Step structure | One-step; multistep/history; staggered second-order | Catalog formula types and solver cores. |
| Next-value formation | Direct from known quantities; equation solved for next value | Catalog implicit flag and solver core. Avoid treating this as a universal quality ranking. |
| Theoretical order | 1, 2, 4, configurable 1–8, configurable 1–6 | Catalog and solver validation. Always qualify configurable `p` and assumptions. |
| Startup/history | None; `p-1` RK4 startup values for `p>1`; staggered half-step initialization | `solvers.ts`. |
| Per-step work | Direct RHS samples, history reuse, or nonlinear solve | Solver core. Quantify only where the implementation makes the count exact. |

The landscape must not become a field of pills. Use aligned labels, a compact
comparison rail, or another restrained information structure. The method name
and selection state carry the strongest weight; profile, step structure,
implicitness, and order remain secondary.

### 13.3 Claims excluded from the landscape

Do not place universal “best,” “most stable,” “fastest,” “most accurate,” or
“for stiff problems” rankings in the landscape. Current authority supports a
specific Backward Euler A-stability statement for the scalar test equation and
problem-specific preset guidance, not a complete comparative performance
ranking.

## 14. Method selection design

The landscape is one keyboard-operable single-selection set. Exact control
markup is an implementation choice, but it must expose:

- a stable accessible name for every method;
- exactly one selected/current method in single mode;
- written first-order or second-order profile context;
- visible focus;
- keyboard activation;
- a non-color selected indicator; and
- no nested interactive controls inside the method control.

The compact landscape summary does not repeat each full method blurb. It gives
enough information to make an informed choice, then the selected lens provides
depth. Method-specific order ranges appear as concise facts; editable order
controls remain in Data.

## 15. Compare placement and meaning

Compare is a secondary branch attached to the method landscape. A compact
entry may appear within or immediately after the landscape, but it must not
become a full primary teaching section between Landscape and the selected-
method lens. The principal reading flow remains Landscape → Selected method
lens. Detailed comparison teaching is rendered only after the learner enters
Compare. Its entered-flow lead is:

> Use one first-order initial value problem with two methods, then inspect where
> their trajectories and final approximations agree or separate on the same
> fixed grid.

Before pair selection, the lane identifies three useful questions:

1. Do the two trajectories separate at the chosen `h`?
2. How do their implemented orders and per-step requirements differ?
3. What changes when the problem or step size changes in another run?

The interaction preserves current behavior:

- only the seven first-order methods are eligible;
- Leap-Frog is absent with a visible explanation that it uses the second-order
  profile and different initial data;
- one shared right-hand side, start time, end time, step size, and initial
  value configure both methods;
- configurable orders remain in Compare Data;
- the same pair cannot be selected twice at the same configuration;
- Compare Output owns both successful results, the final absolute difference,
  chart, stored values, and method metadata;
- Compare does not gain Convergence or Tutor support; and
- no numerical code changes.

The pair picker may reuse the compact first-order landscape rather than eight
full profiles. Learners do not need to read every profile before comparing.

## 16. Selected-method profile schema

Every selected method is authored against the following responsibilities.
Visual density may vary, but content authority may not.

| Field | Required content |
|---|---|
| Identity | Method name, problem profile, family/step structure, explicit or implicit status, and runnable state |
| Core idea | One learner-friendly sentence describing how the next state is formed |
| Primary mathematics | One dominant update rule or defining relation with trusted visual and accessible forms |
| Formula anatomy | Meaning of every symbol or grouped term needed for the selected rule |
| Update sequence | Ordered steps for one update, including prediction, solve, history, or staggered state where applicable |
| Implemented order | Fixed order or supported `p` range, with assumptions/limitations |
| Required state | Current value, slopes, derivative estimates, history, startup values, position, or velocity actually used |
| Work requirement | Exact source-grounded RHS/stage count where safe, or qualified nonlinear-solve/history work |
| Teaching strength | What the implementation makes especially useful to learn or inspect, without a universal superiority claim |
| Watch point | Failure, coarse-step, history, solve, or interpretation caveat |
| Accuracy/stability boundary | Explicit separation of theoretical order, observed error, absolute stability, and nonlinear convergence where relevant |
| Lab observation | Specific current chart, values, diagnostics, or Convergence evidence to inspect |
| Preset connection | All current availability plus the source-suggested presets for this method |
| Output connection | Existing successful evidence relevant to the method |
| Convergence connection | Exact eligibility and what existing refinement evidence can establish |
| Configurable parameters | Only controls currently present in Data or Compare |
| Availability | Exact first-/second-order and single/Compare boundary |
| Misconception | One likely incorrect inference and its qualified correction |
| Authority | Exact source owners for the formula, behavior, and teaching copy |
| Review gates | Unsupported, ambiguous, or conflicting statements that cannot ship without authority resolution |

## 17. Eight complete selected-method profiles

### 17.1 Shared first-order product contract

The seven first-order methods share these current product facts:

- Data configures `t₀`, `tEnd`, positive fixed `h`, `y₀`, and a scalar
  right-hand side using only `t` and `y`.
- The interval must align to an integer number of fixed steps and remain inside
  the released grid budget.
- An optional exact expression uses `t`, `t₀`, and `y₀`. It is reference
  authority for consistency/error work and does not alter integration.
- All six first-order presets are loadable for every first-order method. The
  “suggested methods” lists are editorial recommendations, not availability
  filters.
- Every first-order method is eligible for single mode and the current Compare
  picker.
- A successful single run can show the final approximation, grid count, final
  time, method metadata, chart, stored values, and—when applicable—implicit
  diagnostics.
- Convergence is available only from a successful first-order single run. It
  requires an enabled, valid exact expression and reruns the same method on
  refined fixed grids under the released contracts.

The profiles below repeat only the method-specific consequences of this shared
contract.

### 17.2 Forward Euler

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Forward Euler** · first-order · explicit · one-step · fixed theoretical order 1 · Beginner Starter. |
| Core idea | Follow the slope at the current stored approximation for one time step. |
| Primary mathematics | `uₙ₊₁ = uₙ + h f(tₙ,uₙ)`. The trusted learner-facing formula already exists in `methodMathContent.ts`. |
| Formula anatomy | `uₙ` is the current numerical approximation, `f(tₙ,uₙ)` is the current slope, `h` is the fixed time-step size, and `h f(tₙ,uₙ)` is the proposed change. |
| One update | (1) Read `tₙ,uₙ`. (2) Evaluate the current slope once. (3) Multiply it by `h`. (4) Add that change to `uₙ`. (5) Store the result at `tₙ₊₁`. |
| Order and required state | Metadata order 1 under the method’s usual regularity and stability assumptions. It needs only the current time/value and current RHS evaluation; no history or startup method. |
| Work requirement | The current kernel uses one RHS evaluation per fixed step. There is no nonlinear solve. |
| Teaching strength | It is the clearest baseline for connecting slope, step size, and one stored update. This is a teaching role, not a claim that it is generally the best method. |
| Watch point | A coarse explicit step can distort decay, create oscillation, or make values grow on the current Exponential Decay preset. The Stiff Relaxation preset contains problem-specific small-step guidance; it is not a universal threshold. |
| Accuracy/stability boundary | Order 1 does not mean every finite run shows observed order exactly 1. Explicitness does not by itself establish instability, and smaller `h` is not a universal guarantee. |
| What to observe | Compare the numerical trajectory with expected decay/growth shape; inspect the final approximation and stored values; with a valid exact reference, refine `h` and inspect decreasing maximum global error and reliable observed order. |
| Presets | All six first-order presets are loadable. Source-suggested: Exponential Decay, Exponential Growth, and Logistic Growth. Exponential Decay and Stiff Relaxation provide the strongest current coarse-step/stability observation copy. |
| Output and Convergence | Single Output has no implicit diagnostics. Compare can place it against any different first-order configuration. Convergence can test order/error only when exact-reference eligibility holds. |
| Configurable parameters and availability | No method-specific order control. Uses the shared first-order Data fields. Available in single and Compare; unavailable for the second-order acceleration profile. |
| Common misconception | **Incorrect:** “Forward Euler draws the exact tangent curve.” **Correction:** it uses the current slope to form one discrete approximation; repeated updates need not follow the exact curve. |
| Authority | Identity/order/formula fallback: `methodCatalog.ts`; trusted math: `methodMathContent.ts`; update/work: `solvers.ts`; qualified teaching: `odeGlossaryContent.ts`; preset observations: `problemPresets.ts`. |
| Review gate | No new general stability region, error constant, or suitability claim is authorized. Learner copy may reuse the existing qualified Forward Euler Glossary authority. |

### 17.3 Backward Euler

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Backward Euler** · first-order · implicit · one-step · fixed theoretical order 1. |
| Core idea | Choose the next approximation so that the step is consistent with the derivative rule at the new endpoint. |
| Primary mathematics | `uₙ₊₁ = uₙ + h f(tₙ₊₁,uₙ₊₁)`. |
| Formula anatomy | The unknown `uₙ₊₁` occurs both as the new value and inside `f`; this makes the relation implicit. `uₙ` is known and `tₙ₊₁` comes from the fixed grid. |
| One update | (1) Form a Forward Euler predictor. (2) Define the residual `R(z)=z-uₙ-h f(tₙ₊₁,z)`. (3) Use the default scalar Newton solver to drive that residual to its tolerance. (4) Store the converged value or return a controlled solve failure. |
| Order and required state | Metadata order 1 under the usual assumptions. It uses the current value and one new endpoint equation; no multistep history. |
| Work requirement | Every step includes prediction plus a nonlinear solve. Current UI runs use Newton with at most 50 iterations, absolute tolerance `1e-12`, and relative tolerance `1e-10`. These are kernel settings, not Data controls. |
| Teaching strength | It is the current basic example of an implicit update and of keeping nonlinear-solve evidence separate from method-level stability. |
| Watch point | Newton can fail even when a method-level stability property is favorable. A converged solve can still produce an inaccurate result for the chosen `h`. |
| Accuracy/stability boundary | The current approved claim is A-stability **for the scalar test equation**. A-stability does not establish accuracy, suitability for every stiff problem, or nonlinear-solver success. |
| What to observe | On Exponential Decay or Logistic Growth, compare trajectory and error with Forward Euler at the same `h`. On Stiff Relaxation, inspect both trajectory behavior and the separate Newton iteration/residual diagnostics. |
| Presets | All six first-order presets are loadable. Source-suggested: Exponential Decay, Logistic Growth, and Stiff Relaxation. |
| Output and Convergence | Output includes nonlinear method, total/max iterations, final/max residual, and failed-step count. Convergence remains exact-reference gated and does not turn Newton success into an accuracy conclusion. |
| Configurable parameters and availability | No method-specific order or nonlinear-solver control in Data. Uses shared first-order fields. Available in single and Compare. |
| Common misconception | **Incorrect:** “If Newton converges, Backward Euler is accurate and stable for this run.” **Correction:** nonlinear convergence, absolute stability, and accuracy are separate questions. |
| Authority | Formula/classification/A-stability qualification: `methodCatalog.ts` and `odeGlossaryContent.ts`; predictor, residual, default Newton settings, diagnostics: `solvers.ts` and `nonlinearSolver.ts`; output rendering: `odeApp.ts`. |
| Review gate | Do not broaden the scalar-test-equation A-stability claim or market Backward Euler as a universal stiff solver. |

### 17.4 Taylor Method (Order 2)

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Taylor Method (Order 2)** · first-order · explicit · one-step · metadata order 2. |
| Core idea | Add a second-order local change by estimating how the derivative changes with time and with the current state. |
| Primary mathematics | `uₙ₊₁ = uₙ + h fₙ + (h²/2)(fₜ + fᵧ f) at (tₙ,uₙ)`. |
| Formula anatomy | `fₙ=f(tₙ,uₙ)`; `fₜ` describes change with time; `fᵧ` describes change with state; `fₜ+fᵧ f` is the derivative of `f(t,y(t))` along the solution path. |
| One update | (1) Evaluate `fₙ`. (2) Approximate `fₜ` with centered evaluations at `tₙ±ε`. (3) Approximate `fᵧ` with centered evaluations at `uₙ±ε`. (4) form `fₜ+fᵧ fₙ`. (5) add first- and second-order changes. |
| Order and required state | Metadata order 2. The current kernel fixes `ε=1e-6` for both centered differences. The learner enters only `f(t,y)`; there are no derivative input fields. |
| Work requirement | The current implementation performs five RHS evaluations per step: one for `fₙ`, two for `fₜ`, and two for `fᵧ`. There is no nonlinear solve or history. |
| Teaching strength | It exposes derivative-informed local correction and contrasts directly with RK4, which obtains higher-order behavior from staged RHS samples rather than explicit partial-derivative terms. |
| Watch point | The partial derivatives are numerically estimated by the product. Finite-difference scale, floating-point effects, nonsmooth RHS behavior, and step size can affect finite-run evidence. |
| Accuracy/stability boundary | Metadata order 2 is not a universal observed-order promise. No general stability claim is currently authorized. The Stiff Relaxation preset contains problem-specific explicit step guidance only. |
| What to observe | On Exponential Decay/Growth or Linear Forced Equation, compare its trajectory/error with Forward Euler and RK4 at the same `h`; use Convergence to inspect whether reliable error pairs approach the expected order. |
| Presets | All six first-order presets are loadable. Source-suggested: Exponential Decay, Exponential Growth, Linear Forced Equation, and Oscillatory Forcing. |
| Output and Convergence | Output shows order 2, formula, trajectory, and stored values but no derivative-estimate diagnostic. Convergence is exact-reference gated. |
| Configurable parameters and availability | No method-specific order or `ε` control. Uses shared first-order fields and is available in single and Compare. |
| Common misconception | **Incorrect:** “I must enter `fₜ` and `fᵧ`.” **Correction:** the current product estimates both internally from the entered RHS. |
| Authority | Formula/order/blurb: `methodCatalog.ts` and `methodMathContent.ts`; exact derivative estimation and `ε`: `solvers.ts`; Data fields: `odeApp.ts`. |
| Accepted boundary | Beginner copy says that the Lab estimates the needed derivative information internally from the entered RHS. Centered `f_t`/`f_y` approximations and the five-RHS-evaluation count are advanced detail. The fixed difference scale may be named only as an implementation detail, never an editable control or new public numerical contract. |

### 17.5 Runge-Kutta 4

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Runge-Kutta 4** · first-order · explicit · one-step · metadata order 4 for smooth problems. |
| Core idea | Sample four slopes within one time step and combine them with unequal weights. |
| Primary mathematics | `uₙ₊₁ = uₙ + (h/6)(k₁+2k₂+2k₃+k₄)`. In this kernel the `k` values are slopes, not already multiplied by `h`. |
| Formula anatomy | `k₁=f(tₙ,uₙ)`; `k₂=f(tₙ+h/2,uₙ+h k₁/2)`; `k₃=f(tₙ+h/2,uₙ+h k₂/2)`; `k₄=f(tₙ+h,uₙ+h k₃)`. The middle slopes receive double weight. |
| One update | (1) Sample the start slope. (2) Use it to sample a midpoint. (3) use the second slope to sample another midpoint. (4) use the third slope to sample the endpoint. (5) combine all four slopes and store the new value. |
| Order and required state | Metadata order 4 for smooth problems. It uses only the current value plus temporary stage values; no persistent multistep history or startup method. |
| Work requirement | Exactly four RHS evaluations per step in the current kernel. No nonlinear solve. |
| Teaching strength | It shows how several local samples can improve an explicit one-step update without asking the learner for derivative expressions. It also supplies current multistep startup values. |
| Watch point | Higher order does not remove the need to choose an appropriate `h`, satisfy the fixed grid, or inspect finite-run behavior. |
| Accuracy/stability boundary | Order 4 concerns asymptotic accuracy under assumptions; no universal accuracy or stability guarantee follows for a particular coarse run. |
| What to observe | Compare trajectory and error with Forward Euler or Taylor 2 at the same grid; then refine `h` and inspect reliable observed-order evidence. |
| Presets | All six first-order presets are loadable. Source-suggested: Exponential Decay, Exponential Growth, Linear Forced Equation, Logistic Growth, and Oscillatory Forcing. Stiff Relaxation includes problem-specific RK4 step guidance but does not list RK4 as a suggested method. |
| Output and Convergence | Output shows trajectory, final value, formula, and values. Convergence is exact-reference gated. The same RK4 step routine is the startup owner for configurable multistep methods. |
| Configurable parameters and availability | No method-specific order control. Uses shared first-order fields. Available in single and Compare. |
| Common misconception | **Incorrect:** “Fourth order means a coarse RK4 run is automatically accurate.” **Correction:** theoretical order describes refinement behavior under assumptions, not a guarantee for one `h`. |
| Authority | Catalog/order/primary formula: `methodCatalog.ts` and `methodMathContent.ts`; stage definitions and four evaluations: `solvers.ts`; smooth-problem qualification: catalog copy. |
| Review gate | Do not add an unmeasured cost ranking or stability-region claim. |

### 17.6 Adams-Bashforth

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Adams-Bashforth** · first-order · explicit · multistep/history-based · configurable theoretical order `p=1…8`, default 2. |
| Core idea | Reuse a weighted history of already known slopes to advance directly to the next value. |
| Primary mathematics | `uₙ₊₁ = uₙ + h Σⱼ₌₀^{p-1} βⱼ fₙ₋ⱼ`. Coefficients depend on `p`. |
| Formula anatomy | `fₙ₋ⱼ=f(tₙ₋ⱼ,uₙ₋ⱼ)` are stored slopes; `βⱼ` are order-specific weights derived by the coefficient owner; the new RHS value is not inside the equation being solved. |
| One update | (1) Ensure `p` slope/value history entries exist. (2) form the weighted slope sum. (3) add `h` times that sum to `uₙ`. (4) evaluate the RHS at the new stored value. (5) shift the history. |
| Order and required state | Theoretical order `p` under the source’s usual regularity and stability assumptions. The grid must provide at least `N≥p` steps. For `p>1`, the kernel creates `p-1` startup values with RK4; `p=1` needs no preliminary startup step. |
| Work requirement | After startup, one new RHS evaluation per completed step plus a weighted sum over `p` stored slopes. No nonlinear solve. |
| Teaching strength | It makes history reuse concrete and provides a clean explicit counterpart to Adams-Moulton. |
| Watch point | Changing `p` changes coefficients, history length, minimum-grid requirement, and theoretical order. Startup values are part of the computed trajectory and can affect finite-run evidence. |
| Accuracy/stability boundary | Theoretical order `p` is conditional and not an observed-order promise. No broad stability comparison with other methods is currently authorized. |
| What to observe | Use Linear Forced Equation or Oscillatory Forcing to compare two orders or compare with Adams-Moulton on the same fixed grid; inspect startup metadata, trajectory, coefficients, and exact-reference refinement when eligible. |
| Presets | All six first-order presets are loadable. Source-suggested: Linear Forced Equation and Oscillatory Forcing. |
| Output and Convergence | Output shows configured order, RK4 startup metadata, `β` coefficients, trajectory, and values. Convergence uses the same configured order and remains exact-reference gated. |
| Configurable parameters and availability | Data and Compare expose integer `p` from 1 through 8. Uses shared first-order fields. Available in single and Compare. |
| Common misconception | **Incorrect:** “Order 8 means the method can start with only the initial value.” **Correction:** order `p>1` needs `p-1` startup values and a grid with at least `p` steps. |
| Authority | Range/default/classification/formula: `methodCatalog.ts`; coefficients: `polynomial.ts`; startup, history, minimum-grid check, update: `solvers.ts`; order input: `odeApp.ts`. |
| Review gate | Do not hide order-specific requirements behind one generic “multistep” sentence or add an unsupported stability ranking. |

### 17.7 Adams-Moulton

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Adams-Moulton** · first-order · implicit · multistep/history-based · configurable theoretical order `p=1…8`, default 2. |
| Core idea | Combine stored slopes with the slope at the unknown next value, using an explicit Adams-Bashforth prediction to start the implicit solve. |
| Primary mathematics | `uₙ₊₁ = uₙ + h(β₋₁ fₙ₊₁ + β₀ fₙ + …)`, with order-specific coefficients. |
| Formula anatomy | Stored slopes provide history; `fₙ₊₁=f(tₙ₊₁,uₙ₊₁)` depends on the unknown new value; the Adams-Bashforth predictor is an initial guess, not the accepted corrected value. |
| One update | (1) Ensure `p` history entries. (2) form an order-`p` Adams-Bashforth predictor. (3) build the Adams-Moulton corrector relation. (4) solve its residual with the default Newton solver. (5) store the converged value and new slope, then shift history. |
| Order and required state | Supported `p=1…8`; `N≥p`. For `p>1`, `p-1` startup values come from RK4; `p=1` needs none. |
| Work requirement | History-weighted prediction plus a nonlinear solve at every post-startup step. UI runs use the same default Newton settings and diagnostics as the other implicit methods. |
| Teaching strength | It shows the predictor-versus-corrected-value distinction and how an endpoint slope turns a history method into an implicit relation. |
| Watch point | Predictor availability does not remove the solve. Newton may fail, and solve success does not establish accuracy or a method-level stability conclusion. |
| Accuracy/stability boundary | Theoretical order `p` is conditional. No general Adams-Moulton stability or superiority claim is currently authorized. |
| What to observe | On Linear Forced Equation or Oscillatory Forcing, compare with Adams-Bashforth at the same `p,h`; on Stiff Relaxation, inspect trajectory plus Newton iterations/residuals. |
| Presets | All six first-order presets are loadable. Source-suggested: Linear Forced Equation, Oscillatory Forcing, and Stiff Relaxation. |
| Output and Convergence | Output shows `p`, RK4 startup, `β` coefficients, and implicit diagnostics. Convergence remains exact-reference gated and uses the configured method/order. |
| Configurable parameters and availability | Data and Compare expose integer `p` from 1 through 8. The nonlinear method/tolerances are not UI controls. Available in single and Compare. |
| Common misconception | **Incorrect:** “The Adams-Bashforth predictor is the final Adams-Moulton value.” **Correction:** it seeds the implicit corrector solve; the accepted value satisfies the corrected relation within solver tolerance. |
| Authority | Catalog/range/formula: `methodCatalog.ts` and `methodMathContent.ts`; coefficients: `polynomial.ts`; predictor, corrector residual, Newton default, history: `solvers.ts`; diagnostics: `nonlinearSolver.ts` and `odeApp.ts`. |
| Accepted boundary | Learner teaching describes the current UI-default Newton solve, keeps the AB predictor distinct from the accepted corrected value, and separates Newton convergence from accuracy and method stability. Fixed-point remains a genuine internal kernel override. |

### 17.8 Backward Differentiation Formula

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Backward Differentiation Formula (BDF)** · first-order · implicit · multistep/history-based · configurable theoretical order `p=1…6`, default 2. |
| Core idea | Approximate the derivative at the new time from a weighted history of solution values, then require that approximation to equal the RHS at the unknown new value. |
| Primary mathematics | `Σⱼ₌₀^p αⱼ uₙ₊₁₋ⱼ = h f(tₙ₊₁,uₙ₊₁)`. |
| Formula anatomy | The `αⱼ` weights combine the unknown new value and previous solution values. Unlike Adams methods, the history side is built from solution values rather than a weighted integral of stored slopes. |
| One update | (1) Ensure `p` solution-history entries. (2) form the known history contribution. (3) build the implicit residual at `tₙ₊₁`. (4) use the current value as the initial guess for the default Newton solve. (5) store the converged value and shift solution history. |
| Order and required state | Supported theoretical `p=1…6`; `N≥p`. For `p>1`, RK4 supplies `p-1` startup values; `p=1` needs none. |
| Work requirement | A history sum plus a nonlinear solve at every post-startup step. UI runs use Newton and report its diagnostics. |
| Teaching strength | It provides the current contrast between derivative approximation from solution history and the slope-history construction of Adams methods. |
| Watch point | Practical order range, startup history, and nonlinear solution are separate constraints. The source’s BDF6 end-to-end test approaches order 5 because fixed RK4 startup errors are `O(h⁵)`, despite metadata theoretical order 6. |
| Accuracy/stability boundary | The catalog supports the practical order range and conditional theoretical order. It does **not** authorize a broad BDF stability claim. Newton convergence is not a stability or accuracy certificate. |
| What to observe | Stiff Relaxation is the only source-suggested preset. Inspect trajectory, startup, coefficients, Newton residuals, and—after authority-approved wording—the difference between theoretical metadata and finite-run observed behavior at high order. |
| Presets | All six first-order presets are loadable. Source-suggested: Stiff Relaxation. |
| Output and Convergence | Output shows configured `p`, RK4 startup metadata, `α` coefficients, and implicit diagnostics. Convergence is exact-reference gated; BDF6 interpretation must respect the tested startup limitation. |
| Configurable parameters and availability | Data and Compare expose integer `p` from 1 through 6. Nonlinear settings are not UI controls. Available in single and Compare. |
| Common misconception | **Incorrect:** “BDF6 must show observed order 6 in this product.” **Correction:** 6 is the method metadata’s theoretical order; current fixed RK4 startup can limit the measured end-to-end behavior. |
| Authority | Range/formula: `methodCatalog.ts` and `methodMathContent.ts`; coefficients: `polynomial.ts`; derivative-history residual, startup, Newton default: `solvers.ts`; BDF6 evidence: `solvers.test.ts` and `convergenceStudyOrder.test.ts`. |
| Accepted boundary | Learner teaching describes the current UI-default Newton solve. BDF metadata retains theoretical order 6, while advanced limitation copy identifies the current fixed-RK4-startup evidence approaching order 5 without redefining BDF6 theory. |

### 17.9 Leap-Frog

| Profile field | Implementation-ready teaching content |
|---|---|
| Identity | **Leap-Frog** · scalar second-order profile · explicit staggered update · metadata order 2. It is not a first-order `y'=f(t,y)` method in this product. |
| Core idea | Advance velocity on half steps and position on whole steps so the two state components “leap” past one another. |
| Primary mathematics | Product profile: `u''=a(t,u)`. Kernel update: initialize `v₋₁/₂=v₀-(h/2)a(t₀,u₀)`; then `vₙ₊₁/₂=vₙ₋₁/₂+h a(tₙ,uₙ)`, `uₙ₊₁=uₙ+h vₙ₊₁/₂`, and reconstruct `vₙ₊₁=vₙ₊₁/₂+(h/2)a(tₙ₊₁,uₙ₊₁)`. |
| Formula anatomy | `u` is the position-like state, `v=u'` is velocity, and `a(t,u)` is acceleration. The current acceleration expression may use only `t` and `u`; velocity-dependent acceleration is not supported. |
| One update | (1) Initialize the staggered half-step velocity from `u₀,v₀,a(t₀,u₀)`. (2) update half-step velocity using current acceleration. (3) update position. (4) evaluate acceleration at the new position/time. (5) reconstruct and store full-step velocity. |
| Order and required state | Metadata order 2. Data requires `t₀,tEnd,h,u₀,v₀`, and scalar `a(t,u)`. It uses no order selector, no first-order history, and no separate startup integrator. |
| Work requirement | Explicit acceleration evaluations update the staggered velocity and reconstruct stored full-step velocity. There is no nonlinear solve. |
| Teaching strength | It makes the second-order state boundary concrete and connects a two-component stored result to a staggered numerical update. |
| Watch point | The product’s profile excludes acceleration depending on velocity, systems of second-order equations, exact-solution input, and first-order Compare/Convergence. No general long-time conservation or stability claim is authorized. |
| Accuracy/stability boundary | Metadata order 2 is not a guarantee for one finite run. Current source supplies no learner-approved general stability claim. |
| What to observe | Output plots both `u(t)` and `u'(t)`, reports final `u` and final `u'`, and lists both stored values. Explore supported examples such as `a=-u`; interpret only the current trajectory and stored values. |
| Presets | The second-order Data form has no preset selector. Default acceleration is `-u`; current example hints include `-u`, `-2u`, and `cos(t)-u`. |
| Output and Convergence | Single Output is available. Exact-reference input and Convergence are not available for this profile. Leap-Frog is excluded from Compare by `FIRST_ORDER_CATALOG`. |
| Configurable parameters and availability | Shared fixed interval/step plus `u₀`, `v₀`, and `a(t,u)`. Single mode only. |
| Common misconception | **Incorrect:** “Leap-Frog is just another card for the same first-order IVP.” **Correction:** this product routes it through a distinct second-order acceleration profile with two initial state values. |
| Authority | Profile/order/fallback: `methodCatalog.ts`; actual staggered update and stored `v`: `solvers.ts`; variables and fields: `problemExpressions.ts` and `odeApp.ts`; exclusion from Compare/Convergence: `FIRST_ORDER_CATALOG` and `convergenceStudy.ts`. |
| Accepted boundary | The implementation-grounded staggered initialization, half-step velocity update, whole-step position update, and stored full-step velocity reconstruction are approved with an accessible verbalization that says this is the update used by the current Lab. No velocity-dependent acceleration, general system, Compare, exact-reference, or Convergence support may be implied. |

## 18. Method-authority ledger

This ledger is a publication boundary, not merely an implementation inventory. An implementation may re-express an approved fact for clarity, but it must not promote a general textbook property into product truth, copy stale catalog prose over runtime behavior, or make tests into runtime owners. The numerical contract and numerical kernels remain authoritative for behavior; the teaching layer may only compose reviewed, source-backed statements.

### 18.1 Authority hierarchy and discovered owners

| Repository owner | Current responsibility | Teaching-design consequence |
|---|---|---|
| `packages/numerics/src/ode/methodCatalog.ts` | Method identities, families, display labels, first-/second-order profile, explicit/implicit and one-/multistep metadata, supported/default order, compact formula/copy, and `FIRST_ORDER_CATALOG`. | Primary structural catalog. Phase 0 narrowly aligns the product-visible Adams-Moulton blurb with the UI-default Newton path; IDs, ranges, formulas, and behavior remain unchanged. |
| `packages/numerics/src/ode/solvers.ts` | Actual first- and second-order updates, RK4 startup, minimum-grid checks, coefficient use, default nonlinear-solver path, result metadata, and Leap-Frog state reconstruction. | Exact implemented process owner. Phase 0 makes AM/BDF result notes report the actual Newton or fixed-point diagnostic method; teaching steps must follow the unchanged evaluation and startup sequence. |
| `packages/numerics/src/ode/polynomial.ts` | Generated Adams-Bashforth, Adams-Moulton, and BDF coefficients. | Advanced coefficient displays must consume generated coefficients rather than duplicate tables in teaching content. |
| `packages/numerics/src/ode/nonlinearSolver.ts` | Newton and fixed-point implementations, defaults, tolerances, stopping behavior, and diagnostics. | UI-default implicit-method copy must say Newton; fixed-point is an internal override unless separately surfaced by an approved feature. |
| `packages/numerics/src/ode/grid.ts` | Fixed-grid construction, alignment, step-count and budget rules. | Method teaching may explain fixed stepping, while Data remains the owner of concrete interval and step-size input. |
| `packages/numerics/src/ode/exactSolution.ts` | Exact-reference evaluation and validation. | Exact solution is optional comparison evidence, never an input required by the solver. |
| `packages/numerics/src/convergence/convergenceStudy.ts` | First-order Convergence eligibility, refinement execution, errors, observed order, budgets, and classification. | Convergence teaching must remain first-order and exact-reference gated; Leap-Frog is excluded. |
| `frontend/src/math/ui/methodMathContent.ts` | Safe readonly method formula models and accessible math labels. | Current trusted display owner. New formulas need closed, authored math models and the existing readonly renderer—never raw learner-facing LaTeX or a new parser. |
| `frontend/src/labs/ode/odeApp.ts` | Current Method/Data/Output/Compare composition, selection, order controls, Run rendering, result metadata, diagnostics, exact-reference UI, and lifecycle. | Integration owner. The redesign must be narrow and preserve successful result behavior, navigation, Compare, bindings, and disposal. |
| `frontend/src/labs/ode/odeApp.css` | Current Lab presentation and responsive styling. | Future implementation uses the accepted token/presentation grammar; this design makes no CSS change. |
| `frontend/src/labs/ode/odeSession.ts` | Pure Lab session shape, selected method/order, first-/second-order form state, Compare state, successful snapshots, and active step. | Browsing teaching content must derive from existing selection and must not create a second selected-method state or store DOM/disclosure handles. |
| `frontend/src/labs/ode/problemPresets.ts` | Six first-order presets, exact references, observation guidance, warnings, recommended run step sizes, and suggested methods. | Preset recommendations and observation prompts must be sourced here. Every preset remains loadable for every first-order method. |
| `frontend/src/labs/ode/problemExpressions.ts` | First-order RHS/exact and Leap-Frog acceleration expression profiles and allowed variables. | Owns the exact expression boundary: first-order `f(t,y)`, exact `y(t)`, and second-order `a(t,u)` without velocity dependence. |
| `frontend/src/labs/ode/mathDisplay.ts` | Lab-specific safe mathematical display helpers. | Reuse only where it remains the established safe adapter; do not create an independent notation authority. |
| `frontend/src/labs/ode/coefficientValidation.ts` | UI validation of generated coefficient metadata. | Advanced coefficient teaching must preserve these validation expectations. |
| `frontend/src/labs/ode/convergenceTeaching.ts` and `convergenceStudyView.ts` | Learner-facing Convergence concepts, rendering, limits, and cost framing. | “After the solve” links to these existing meanings and does not duplicate or broaden classification claims. |
| `frontend/src/labs/ode/convergenceStudyState.ts` | Pure Convergence snapshots and eligibility-state construction. | Teaching cannot imply eligibility where state construction rejects it. |
| `frontend/src/labs/ode/convergenceTutor.ts` and `odeTutorBinding.ts` | Safe Tutor context derived from current successful numerical evidence. | Method teaching remains display content; it must not place executable math or runtime handles into Tutor/session state. |
| `frontend/src/labs/ode/odeGlossaryContent.ts` and `odeGlossary.ts` | Reviewed ODE glossary content/annotations and Lab-owned Glossary binding. | Concepts may reuse reviewed vocabulary, but this milestone does not add production glossary terms or change Glossary behavior. |
| `frontend/src/labs/ode/initialValueProblemsRoute.ts` | Complete-Lab route loading and lifecycle boundary. | The redesign remains inside the existing lazy Lab route and must not alter route ownership. |
| Focused tests beside the owners above | Behavioral and numerical evidence, including BDF6 startup behavior and implicit Newton diagnostics. | Tests corroborate contracts; they do not become learner-copy owners. Conflicts still require the owning authority’s decision. |

### 18.2 Structural method ledger

| Method identity | Current source owner | Exact implemented formula/process owner | Configurable parameters | Supported order(s) | Classification and problem profile | Startup/history requirement |
|---|---|---|---|---|---|---|
| Forward Euler | `methodCatalog.ts` | `solvers.ts` | Shared first-order IVP and fixed-grid fields; no method-specific parameter | 1 | Explicit; first-order; one-step; current slope | Initial value only; no separate startup/history |
| Backward Euler | `methodCatalog.ts` | `solvers.ts` plus `nonlinearSolver.ts` | Shared first-order fields; nonlinear settings are not UI controls | 1 | Implicit; first-order; one-step; endpoint slope | Initial value only; Newton solve each step |
| Taylor Method (Order 2) | `methodCatalog.ts` | `solvers.ts` | Shared first-order fields; derivative-difference scale is internal | 2 | Explicit; first-order; one-step; derivative-enhanced | Initial value only; no separate startup/history |
| Runge-Kutta 4 | `methodCatalog.ts` | `solvers.ts` | Shared first-order fields; no method-specific parameter | 4 | Explicit; first-order; one-step; four stages | Initial value only; no separate startup/history |
| Adams-Bashforth | `methodCatalog.ts` | `solvers.ts` plus coefficients from `polynomial.ts` | Shared first-order fields and integer `p=1…8`, default 2 | `p=1…8` | Explicit; first-order; multistep; slope history | `N≥p`; RK4 supplies `p-1` startup values for `p>1` |
| Adams-Moulton | `methodCatalog.ts` | `solvers.ts`, `nonlinearSolver.ts`, coefficients from `polynomial.ts` | Shared first-order fields and integer `p=1…8`, default 2; nonlinear settings not exposed | `p=1…8` | Implicit; first-order; multistep; slope history plus endpoint slope | `N≥p`; RK4 supplies `p-1` startup values; AB predictor seeds Newton corrector |
| Backward Differentiation Formula | `methodCatalog.ts` | `solvers.ts`, `nonlinearSolver.ts`, coefficients from `polynomial.ts` | Shared first-order fields and integer `p=1…6`, default 2; nonlinear settings not exposed | `p=1…6` | Implicit; first-order; multistep; solution history | `N≥p`; RK4 supplies `p-1` startup values; Newton solve after startup |
| Leap-Frog | `methodCatalog.ts` | `solvers.ts` | Fixed interval/step, `u₀`, `v₀`, and `a(t,u)`; no order input | 2 metadata | Explicit staggered update; scalar second-order profile; not a first-order multistep choice | Half-step velocity is initialized from `u₀,v₀,a(t₀,u₀)`; no RK4 startup/history selector |

### 18.3 Product-content method ledger

In the table below, “all six” means Exponential Decay, Exponential Growth, Linear Forced Equation, Logistic Growth, Oscillatory Forcing, and Stiff Relaxation. Suggested presets are recommendations from `problemPresets.ts`, not an availability filter.

| Method | Exact-solution relationship | Current presets | Existing teaching copy owners | Claims safe to publish now | Claims requiring authority review |
|---|---|---|---|---|---|
| Forward Euler | Optional exact reference enables error and single-method Convergence; not needed to solve | All six; suggested: Exponential Decay, Exponential Growth, Logistic Growth | `methodCatalog.ts`, `methodMathContent.ts`, `problemPresets.ts`, `convergenceTeaching.ts` | Implemented update, explicit/one-step/order-1 metadata, one RHS evaluation per step, current-slope interpretation, optional exact comparison | Any general stability-region, “worst,” or universal accuracy ranking beyond preset-specific approved guidance |
| Backward Euler | Same first-order exact-reference contract | All six; suggested: Exponential Decay, Logistic Growth, Stiff Relaxation | Same shared owners plus implicit diagnostics in `odeApp.ts` | Implemented endpoint relation, implicit/one-step/order-1 metadata, default Newton solve, scalar-test-equation A-stability qualifier already owned by catalog, solve failure distinct from stability | Broad stiff-problem superiority, nonlinear stability conclusions, or an unqualified A-stability promise |
| Taylor 2 | Same first-order exact-reference contract | All six; suggested: Exponential Decay, Exponential Growth, Linear Forced Equation, Oscillatory Forcing | `methodCatalog.ts`, `methodMathContent.ts`, `solvers.ts` | Implemented second-order update, internal centered approximations of `f_t,f_y`, five RHS evaluations per step, learner supplies only `f` | Any implication that the learner enters analytic partial derivatives; numerical-authority approval of how much internal-difference detail belongs in beginner copy |
| RK4 | Same first-order exact-reference contract | All six; suggested: Exponential Decay, Exponential Growth, Linear Forced Equation, Logistic Growth, Oscillatory Forcing | `methodCatalog.ts`, `methodMathContent.ts`, `solvers.ts` | Implemented four stages, weighted update, explicit/one-step/order-4 metadata, four RHS evaluations per step | Universal accuracy/efficiency superiority or broad stability claims |
| Adams-Bashforth | Same first-order exact-reference contract | All six; suggested: Linear Forced Equation, Oscillatory Forcing | `methodCatalog.ts`, `methodMathContent.ts`, `polynomial.ts`, `solvers.ts` | Supported order range/default, generated coefficient use, explicit slope-history update, `N≥p`, RK4 startup, one new post-startup RHS evaluation | General stability hierarchy, claims that theoretical order must appear in every finite run, or treating startup as exact history |
| Adams-Moulton | Same first-order exact-reference contract | All six; suggested: Linear Forced Equation, Oscillatory Forcing, Stiff Relaxation | Same Adams owners plus `nonlinearSolver.ts` and diagnostics in `odeApp.ts` | Supported order range/default, endpoint-slope corrector, AB predictor, RK4 startup, default Newton solve, reported diagnostics | Phase 0 aligns stale product/result wording while retaining the internal fixed-point override; no broad stability ranking |
| BDF | Same first-order exact-reference contract | All six; suggested: Stiff Relaxation | `methodCatalog.ts`, `methodMathContent.ts`, `polynomial.ts`, `solvers.ts`, focused numerical tests | Supported order range/default, solution-history residual, RK4 startup, default Newton solve, theoretical metadata order | Phase 0 aligns stale result wording; BDF6 teaching must distinguish theoretical order 6 from current startup-limited evidence; no broad stability claim |
| Leap-Frog | No exact input or Convergence in the current second-order profile | No preset selector; defaults/examples are authored in `odeApp.ts` | `methodCatalog.ts`, `methodMathContent.ts`, `problemExpressions.ts`, `solvers.ts`, `odeApp.ts` | Current `u''=a(t,u)` profile, `u₀/v₀` initial data, staggered implemented update, stored `u/u'`, single mode only, order-2 metadata | Exact learner-facing staggered notation and any conservation, symplectic, long-time, or stability claim; no velocity-dependent/general-system implication |

## 19. Formula-teaching strategy

### 19.1 Formula hierarchy

Each selected profile uses four distinct levels so mathematical importance is visible:

1. **Primary formula:** one large readonly mathematical object that expresses the method’s defining update or relation.
2. **Formula anatomy:** short prose-to-symbol mappings immediately owned by that formula. Visible prose explains meaning; rendered mathematics carries notation; its accessible label verbalizes the expression.
3. **One-update process:** an ordered sequence that follows the actual implementation, including stage evaluation, history, prediction, or nonlinear solution where relevant.
4. **Advanced details:** native disclosures for subordinate stage formulas, generated coefficients, derivative approximations, startup, and diagnostic boundaries. Required identity and process are never hidden here.

The current closed mathematical representation and safe readonly renderer remain the only rendering path. New content is authored data and safe DOM, not arbitrary strings rendered as HTML, executable expressions, raw learner-facing LaTeX, unrestricted MathJSON, or a new parser. Every display has one visible prose owner and one accessible verbalization; decorative duplicate formula output is hidden from accessibility APIs.

### 19.2 Method-specific weighting

| Profile | Primary | Subordinate | Advanced |
|---|---|---|---|
| Forward Euler | Tangent update | `fₙ` meaning | Error/stability boundary |
| Backward Euler | Endpoint relation | Residual and unknown endpoint | Newton diagnostics and scalar-test-equation qualifier |
| Taylor 2 | Second-order update | Total derivative `f_t+f_y f` | Internal centered-difference approximation and evaluation cost |
| RK4 | Weighted four-stage update | Stage placement | Full `k₁…k₄` definitions |
| Adams-Bashforth | Weighted stored-slope update | History window | Generated coefficients and RK4 startup |
| Adams-Moulton | Endpoint-slope corrector | Predictor versus accepted correction | Coefficients, startup, Newton residual |
| BDF | Derivative-history relation | Solution-history anatomy | Coefficients, startup limitation, Newton residual |
| Leap-Frog | Staggered velocity/position pair | Half-step initialization and full-step reconstruction | Profile exclusions and supported acceleration variables |

Local horizontal containment is allowed around a complex formula at narrow widths, with a visible affordance and without creating page-level overflow. The essential verbal explanation remains readable without horizontal scrolling.

## 20. Selected-method concepts

Concepts are small, selected-profile teaching atoms—not a generic glossary dump. Each has a stable internal content ID, a short definition in the context of the selected method, an optional owned formula reference, and one misconception or observation when useful. The selected profile chooses four to six relevant atoms; the full cross-method vocabulary is not shown at once.

| Concept atom | Used by | Teaching responsibility |
|---|---|---|
| Numerical state and approximation | All | Distinguish computed values from the unknown exact trajectory. |
| Step size and fixed grid | All | Explain the advance interval and that smaller `h` increases work without guaranteeing a successful or accurate run by itself. |
| Current slope | Forward Euler; Adams history context | Connect `f(tₙ,uₙ)` to the current numerical state. |
| Endpoint slope / implicit equation | Backward Euler, Adams-Moulton, BDF | Show why the unknown new value appears inside a relation that must be solved. |
| Stage slope | RK4 | Explain intermediate probes without calling them stored solution points. |
| Derivative approximation | Taylor 2, BDF | Separate approximation of RHS derivatives from approximation of the solution derivative by history. |
| History window | Adams-Bashforth, Adams-Moulton, BDF | Name what is retained, how order changes required history, and how slope history differs from solution history. |
| Startup value | Adams-Bashforth, Adams-Moulton, BDF | Explain why the initial condition alone is insufficient at `p>1` and that RK4 creates computed starting values. |
| Predictor and corrector | Adams-Moulton | Keep the initial guess distinct from the accepted implicit result. |
| Nonlinear residual and iteration | Backward Euler, Adams-Moulton, BDF | Interpret convergence diagnostics without conflating nonlinear-solver convergence with ODE stability or accuracy. |
| Staggered state | Leap-Frog | Explain whole-step position, half-step velocity, and reconstructed full-step velocity. |
| Local update versus global error | All first-order profiles | Prevent a locally defined formula from being interpreted as a complete error guarantee. |
| Exact reference | First-order profiles | Establish optional evidence used for error/Convergence, not solver authority. |
| Refinement and observed order | First-order profiles | Point forward to Convergence while preserving its eligibility and classification contract. |
| Stability versus accuracy | Method-specific where sourced | State that a bounded/qualitatively plausible result, nonlinear convergence, and small exact error answer different questions. |

Glossary annotations may enhance the first reviewed occurrence under the accepted Glossary contract, but the concepts section owns the teaching sequence and must remain complete when the lazy Glossary surface never loads.

## 21. Static-diagram strategy

Diagrams are optional profile-owned teaching views, not decoration and not numerical output. They render only abstract labeled states or evaluations prescribed by the method; they never plot a fabricated trajectory or imply values from a run.

| Diagram pattern | Profiles | Required mathematical message |
|---|---|---|
| One-step update / endpoint relation | Forward Euler and Backward Euler | Current-state slope versus unknown endpoint relation. |
| Stage path | RK4 | Four evaluations at current, midpoint, midpoint, endpoint positions, labeled as stages rather than accepted solution values. |
| History rail with predictor/corrector variant | Adams-Bashforth, Adams-Moulton, and BDF | A finite ordered window feeds one new value; the variant shows that the AB prediction seeds but does not replace the Adams-Moulton corrector solve. Slope-history and solution-history labels remain distinct. |
| Staggered state rail | Leap-Frog | Position at whole steps, velocity at half steps, and full-step reconstruction. |

Taylor 2 defaults to formula anatomy rather than a diagram; an approved derivative-chain diagram may be added only if it is clearer than the equation and does not imply analytic derivative input.

Each diagram requires adjacent visible explanatory text, a concise accessible description owned by the figure, meaningful labels that do not rely on color, Light/Dark token parity, readable mobile reflow or local containment, and a useful static state when motion is reduced or absent. SVG/DOM labels are authored text; a duplicated visual formula is hidden from assistive technology when the figure description already owns it. No animation is required or authorized.

## 22. After-the-solve teaching

The selected profile ends with a compact **After the solve — what to inspect** bridge. It teaches how to read existing evidence; it does not add a diagnostic.

1. **Trajectory:** inspect overall shape, sign, growth/decay/oscillation, and whether coarse stepping produces behavior worth questioning. A plausible curve is not proof.
2. **Final approximation:** identify the reported endpoint value as one value from one fixed-grid run, not the complete quality verdict.
3. **Exact error, when available:** compare against the optional exact reference and keep final-time error distinct from maximum/global error across the stored grid.
4. **Refinement:** rerun or use the existing Convergence Study to ask whether error changes consistently as `h` decreases. Eligibility and work budgets remain unchanged.
5. **Observed order:** treat it as measured evidence across eligible refinements, not a guaranteed restatement of theoretical metadata.
6. **Qualitative behavior and stability:** inspect method/problem-specific behavior using approved preset guidance. Nonlinear-solver convergence, absolute stability, accuracy, and visual plausibility remain distinct.
7. **Method-specific evidence:** for implicit methods, inspect iteration/residual diagnostics; for multistep methods, inspect configured order, coefficients, and startup metadata; for Leap-Frog, inspect both `u` and `u'`.

This section links conceptually to existing Output and Convergence steps. It does not promise that exact error or Convergence is present in Compare or Leap-Frog, does not add a trace, and does not duplicate the result renderer.

## 23. Transition to Data

One restrained endcap completes the learning-to-doing transition. It states the selected method, supported problem profile, and only the additional configuration implications the learner must remember:

- one-step first-order methods: choose the IVP, interval, initial value, and step size;
- Adams/BDF: also choose order and provide a grid with enough steps for the required startup/history;
- implicit methods: expect a per-step Newton solve and later diagnostics, without exposing new nonlinear controls;
- Leap-Frog: configure `a(t,u)`, `u₀`, and `v₀`; exact-reference, Compare, and Convergence are not offered for this profile.

The primary action is **Continue to Data**. Its accessible name includes the selected method when doing so stays concise; nearby text carries the full profile summary. Activation uses the existing step-transition path, preserves selected family/order, and lets the Data stage own editable expressions and values. The learner does not hunt through the landscape for a second navigation control, and Method does not duplicate Data inputs.

## 24. Responsive design contract

Responsive behavior changes composition, not pedagogical order. At every supported width the source/reading sequence remains Problem → Landscape → Selected profile → Concepts → After the solve → Data transition.

### 24.1 Desktop, approximately 1440 × 900

- The first viewport establishes the IVP as the primary mathematical object, gives a compact orientation to the method landscape, and makes the current selection legible without competing hero surfaces.
- The landscape uses the three semantic families as compact, scan-friendly groups. It may use a wide editorial composition, but method controls remain a single keyboard/logical sequence.
- The selected profile has a comfortable reading measure. Its primary formula and identity share one teaching focus; secondary anatomy/process content aligns beneath it rather than forming a dashboard grid.
- Compare is a secondary pathway adjacent to the landscape’s decision context, not a peer to the selected-profile heading or the Data transition.
- Concepts and after-solve content may use paired editorial columns only when DOM order remains meaningful and neither column becomes a loose collection of cards.

### 24.2 Mobile, 390 × 844

- The IVP and its concise explanation remain first; supporting example/detail follows in normal reading order.
- Each landscape family becomes a labeled compact list of full-width native controls. Method name, classification cue, and selected state remain visible without abbreviations that erase meaning.
- Selecting a method updates the profile in place. The landscape remains immediately reachable through a persistent section heading and a **Choose another method** anchor/control; the page does not force a long reverse scroll without orientation.
- The selected method identity precedes its formula. Metadata wraps as prose or a short definition list rather than a row of tiny badges.
- Complex formulas receive local containment; the document never gains horizontal overflow. Essential meaning is repeated in prose outside any scroll container.
- Advanced details use native disclosures with large enough targets. Only genuinely subordinate material is collapsed by default.
- Compare and Continue to Data are separate, clearly named actions. The Data action appears after the teaching sequence and remains the sole primary transition.

### 24.3 Narrow mobile, approximately 320px

- Method labels remain unabbreviated where practical; classification details may move below the name but may not become icon-only.
- No two controls are forced side by side when that reduces tap target or label clarity.
- Mathematical containers can scroll locally, but headings, prose, selection controls, figures, and primary actions fit the viewport.
- Diagrams simplify spatially while preserving their text alternative and mathematical relationships. They may switch from horizontal to vertical rails; they may not silently drop a state or stage.
- The first-open experience remains editorial rather than becoming a long wall of eight expanded profiles. Only the selected profile is deep.

Browser acceptance must cover all three compositions where tooling allows, with explicit evidence at 1440 × 900 and 390 × 844 and an approximately 320px overflow/readability check.

## 25. Accessibility contract

- Use one native `h1` for the Lab and a monotonic, meaningful heading hierarchy for Method, problem foundation, landscape, selected profile, concepts, after-solve guidance, and transition. Visual size does not determine heading rank.
- Represent each method with a native button in a labelled selection group. Because activation immediately changes the selected product method and profile, expose the persistent state with `aria-pressed` or an equivalently valid single-selection pattern; do not misuse `aria-current="page"` or require a custom ARIA grid.
- The method name stays in the accessible name. Classification and availability cues are visible text or referenced descriptions, not color, position, or icon alone.
- Keyboard order follows visual/reading order. Every method and Compare entry is reachable and activatable with native behavior, with visible focus in both themes.
- On method selection, keep focus on the activated connected control, update its selected state, update the profile synchronously, and announce a short polite status such as “Runge-Kutta 4 selected; teaching profile updated.” Do not auto-scroll or move focus unexpectedly.
- Provide an explicit **Read selected method** action if testing shows the in-place profile is too distant. That action—not selection itself—moves focus with `preventScroll` where appropriate and only to a connected profile heading.
- Formula displays follow `MATHEMATICAL_PRESENTATION.md`: nearby prose explains meaning, safe readonly rendering displays notation, and one accessible label verbalizes it. Never emit duplicate screen-reader formula content.
- Each diagram is a labelled figure with adjacent visible explanation and a concise equivalent description. Nodes/lines are not discoverable only by color or hover.
- Advanced details use native `details/summary` unless a reviewed interaction needs another native control. Disclosure state is understandable without animation and does not trap focus.
- Compare is a native button/action whose name explains that it opens first-order comparison. Leap-Frog’s exclusion is communicated before activation, not discovered as an error.
- Mobile selection never focuses detached content, changes scroll merely because the profile rerendered, or obscures focus behind a sticky surface. Touch targets remain usable.
- Reduced motion does not remove information. Any future nonessential transition is skipped or reduced, and the complete selected state is visible statically.
- Product tests can verify semantics, order, state, focus, and accessible text. Browser/manual review is required for real layout, focus visibility, formula overflow, and custom-element behavior; this design makes no screen-reader-certification claim.

## 26. Light/Dark design contract

Light and Dark use the same semantic hierarchy, spacing, borders, typography, and interaction meaning. Theme adaptation changes approved tokens, not content priority.

- The IVP and primary method formula retain the strongest mathematical contrast in both themes.
- Selected, hover, focus, family grouping, planned/unavailable, and secondary Compare states each remain distinguishable without color alone.
- Formula surfaces, diagrams, rails, arrows, grid lines, and labels meet the project’s contrast expectations in both themes; no diagram depends on a light canvas.
- Dark mode avoids luminous accent saturation and stacked shadows. Light mode avoids low-contrast gray-on-white editorial copy.
- Any texture or tonal field must explain a real boundary and disappear harmlessly without changing meaning.
- Browser visual review compares equivalent viewports and selected profiles in both themes, including one simple formula, one dense formula, one diagram, selection/focus, Compare, and the Data transition.

## 27. Content-density and scroll strategy

The landscape is complete but shallow; the selected profile is singular and deep. That rule prevents both a card wall and arbitrary content truncation.

### 27.1 Always visible

- concise problem foundation and mathematical focal point;
- the three-family landscape with all eight runnable method names;
- current selection, core classification, theoretical order/range, and profile availability;
- selected method’s core idea, primary formula, one-update process, principal watch point, and what to observe;
- the relevant concept set, after-solve bridge, and Continue to Data action.

### 27.2 Progressively disclosed

- complete RK stage equations after the defining update;
- coefficient/anatomy details for Adams/BDF;
- internal Taylor derivative approximation detail;
- extended startup and nonlinear-diagnostic explanation;
- source-bounded limitations that matter after the beginner explanation is understood.

Disclosures are one level deep, independently named, and never the only place that states required inputs, method profile, implicit solve, startup requirement, or a critical limitation.

### 27.3 Orientation and persistence

- Switching methods changes only the selected profile and its relevant concepts; problem foundation, landscape position, and after-solve framework remain stable.
- Existing selected-family authority and family-specific stored order are the
  sole product selection authority. Browsing another method is a real method
  selection and therefore determines the family presented in Data; it does
  not replace an initialized Adams-Bashforth, Adams-Moulton, or BDF order with
  default metadata.
- Returning from Data/Output to Method reconstructs the same profile from the pure session selection. There is no separate “teaching method,” profile tab index, or long-lived scroll target in session state.
- Native disclosure state may remain component-local while mounted and may reset on route disposal. Persistence is optional presentation behavior, not meaningful experiment state.
- An in-page **Choose another method** affordance returns to the landscape with deliberate focus/scroll behavior; browser Back and Lab-step navigation keep their existing ownership.

## 28. State and lifecycle considerations

The redesign is a view/content extension inside the current complete ODE Lab. It does not change numerical ownership, routing, session persistence, or asynchronous boundaries.

- Derive teaching content from the current immutable method catalog plus reviewed teaching records keyed by existing `MethodFamily`. Do not duplicate method identities, order ranges, formulas, preset IDs, or coefficient tables.
- `OdeLabSession` remains pure data. Reuse its selected method, family-specific order, active step, forms, Compare state, and immutable successful results; add no DOM nodes, functions, MathLive handles, listeners, `AbortController`s, disclosure elements, or evaluator closures.
- Method switching continues through the existing selection mutation. It may update teaching and future Data configuration, but must not manufacture activity, clear a successful result, overwrite prior output, silently Run, or imply that old output was computed with the new selection.
- Existing fingerprint/stale-result rules remain authoritative. Teaching selection and output validity are visually separate; the selected profile must not decorate a stale or mismatched result as evidence for the new method.
- Rendered readonly math and optional diagram handles are owned by the mounted Method view/Lab binding and disposed idempotently with the existing Lab route. No hidden complete-Lab DOM survives navigation.
- No asynchronous content fetch is introduced. If any renderer remains deferred under current architecture, stale callbacks must obey existing generation/identity/connected-node checks.
- Tutor and Glossary bindings keep their current owners and lazy boundaries. Selected-method content may supply reviewed display context only through future separately approved integration; this milestone does not alter requests, transcript, glossary registry, or queue behavior.
- The complete ODE Lab remains dynamically loaded behind `/ode/initial-value-problems`. Home/static routes must not gain ODE teaching registries, MathLive, Compute Engine, Tutor, Chart.js, or Convergence imports.
- Compare stays a first-order subflow inside the Lab and must reconstruct cleanly after method browsing. Leap-Frog remains outside `FIRST_ORDER_CATALOG` rather than being disabled by presentation-only logic.

## 29. Cross-Lab alignment matrix

| Cognitive responsibility | Shared grammar | ODE-specific expression | Content owner | Interaction difference | Visual relationship and deliberate asymmetry |
|---|---|---|---|---|---|
| Problem foundation | Lead with the mathematical problem, name its objects, and show a concrete interpretation before controls | First-order IVP plus a concise boundary to the Leap-Frog second-order profile; slope/stepping interpretation | New reviewed ODE teaching content drawing on `problemExpressions.ts`, catalog, and numerical contract | ODE previews two supported profiles; Linear Systems teaches `Ax=b` | Same editorial opening and mathematical authority; different notation and examples, not cloned composition |
| Method landscape | Explain families, current runnable capability, and meaningful distinctions before configuration | Three groups: first-order one-step, first-order history, second-order staggered; all eight selectable | `methodCatalog.ts` plus reviewed teaching registry | ODE has eight runnable choices and Compare; Linear Systems has one current runnable method plus contextual families | Same landscape role and status grammar; ODE is denser, interactive, and choice-rich by design |
| Selected runnable method | Give one method unmistakable identity, core mathematics, process, and runnable status | Profile changes with selected family/order; selection also owns future Data method | Existing session/catalog plus new profile content | ODE selection is mutable; Linear Systems’ current profile is fixed | Same focused editorial “lens”; ODE keeps a compact chooser visible and uses progressive disclosure |
| Selected-method concepts | Present only concepts necessary to understand the runnable method | Profile-specific atoms such as stage slope, history, predictor/corrector, nonlinear residual, or staggered state | New reviewed concept records, existing glossary where applicable | Concept set changes with ODE selection | Same concept-layer purpose and reading rhythm; no forced one-to-one term count or layout |
| After-solve checks | Teach how to interrogate output and name limitations before computation | Trajectory, endpoint, exact/global error when eligible, refinement, observed order, qualitative behavior, implicit/startup metadata | Existing Output/Convergence/preset teaching owners | ODE can link to Convergence and method-specific evidence; LS emphasizes residual and conditioning limits | Same skeptical evidence posture; diagnostics stay domain-specific |
| Transition to Data | End with one explicit bridge from understanding to configuration | Summarize selected profile, order/history/solve implications, then Continue to Data | Existing step navigation and session selection | ODE transition changes with selected method; LS transition is stable | Same primary-action hierarchy and endcap rhythm; ODE text is selected-profile aware |

The result should feel like one product team applying one cognitive standard: teach the problem, survey the space, focus the runnable method, prepare evidence reading, then configure. It must not feel as though Linear Systems markup was copied into ODE or as though ODE’s exploratory identity was reduced to a single-method chapter.

## 30. Visual-quality acceptance criteria

The intended “wow” quality is accepted through observable craft, not a claim about user sentiment:

1. At 1440 × 900, the first viewport has one dominant mathematical focal point and no more than one primary action.
2. In a five-second moderated recognition check, a reviewer can identify the supported problem, current selected method, existence of method families, and next action without opening a disclosure.
3. All eight methods are discoverable before selection, but the page never displays eight full teaching profiles or eight equally heavy cards.
4. The landscape communicates at least problem profile, one-step/history relationship, and explicit/implicit distinction without implying those dimensions are mutually exclusive.
5. Selected state is visible by label/form and non-color styling; selection and profile identity agree at all times.
6. The primary formula is visually stronger than metadata, controls, borders, and decorative surfaces.
7. At every reading depth, one section owns attention; adjacent surfaces do not compete through equal scale, color, shadow, or density.
8. Alignment, readable measure, and whitespace produce an editorial rhythm that remains recognizable in both themes.
9. Every border, surface, diagram, icon, and accent has teaching, grouping, status, focus, or interaction meaning.
10. Forward Euler remains concise while Adams-Moulton/BDF remain complete; depth varies by method without visual inconsistency.
11. At 390 × 844 and approximately 320px, mobile reading order is authored, the selected method remains obvious, and no page-level horizontal overflow occurs.
12. Light/Dark preserve equivalent formula authority, selection clarity, focus visibility, and figure comprehension.
13. A learner can return from a deep profile to the landscape and proceed to Data without searching for navigation.
14. The page feels calm with eight methods because the landscape is shallow and only one profile is deep—not because labels or prose were made tiny.

## 31. Product acceptance tests

### 31.1 Automated behavioral contracts

- The Method view renders the problem foundation, three labelled landscape families, and all eight unique method controls.
- The existing selected family is announced and its matching profile, formula, concepts, availability, and Data summary render; no second selection state exists.
- Activating each method by mouse and keyboard changes the session-selected family and profile but does not advance to Data, Run, clear prior successful output, or create meaningful activity beyond the established selection semantics.
- Selection keeps focus on the activated control, updates a polite status once, and does not call scroll/focus on detached content. The explicit read-profile affordance focuses only a connected heading.
- Order selectors remain in Data/Compare. The profile truthfully reflects the
  caller-supplied current family order and the source-owned supported/default
  metadata without choosing, mutating, or resetting order in Method.
- Adams-Moulton/BDF learner copy says Newton only after the authority conflict is resolved; no stale fixed-point wording remains in the rendered teaching path.
- Leap-Frog renders its second-order profile and `u₀/v₀/a(t,u)` transition, remains absent from Compare and Convergence, and never receives first-order presets/exact claims.
- Compare is available from Method as a secondary, explicitly first-order path and preserves existing Compare selection and successful-result behavior.
- Native heading, button, selection-state, disclosure, figure, formula-label, and action semantics are queryable with stable accessible names.
- Method render/dispose/remount leaves no duplicate listeners, stale math/diagram handles, hidden Lab DOM, or callbacks that mutate a newer route.
- The complete Lab route remains lazy and static routes do not import the new ODE teaching registry.

### 31.2 Focused numerical/content authority tests

- Teaching records are complete and unique for the eight catalog families, and supported order/default/profile classifications match `methodCatalog.ts`.
- Formula records map to the existing safe math owner and have nonempty accessible labels; tests do not snapshot raw presentation markup as numerical truth.
- Method-specific process assertions cover RK4 stages, Taylor internal derivative approximation wording, Adams/BDF startup, default Newton behavior, and Leap-Frog staggered initialization against current owners.
- Preset recommendations are derived from `problemPresets.ts`; tests distinguish “suggested” from “available.”
- Content tests forbid unapproved claims identified in Section 18 and require explicit limitation copy where approved.

### 31.3 Browser acceptance stories

1. At 1440 × 900 in Light and Dark, inspect first-open hierarchy, FE selection, an implicit profile, a multistep profile, Compare entry, and Continue to Data.
2. At 390 × 844, select RK4 and BDF by touch-sized controls, open/close advanced detail, return to the landscape, and continue to Data; verify focus, scroll orientation, formula containment, and no page overflow.
3. At approximately 320px, inspect longest names/formulas, landscape family labels, diagram alternative, Compare, and transition without clipping or tiny controls.
4. Navigate Method → Data → Output → Method and away/back; verify selected profile reconstruction, old-result distinction, scroll restoration ownership, no duplicate UI, and console health.
5. Enter Compare, return to single Method, select Leap-Frog, and verify profile/availability boundaries without lost state or misleading controls.
6. Verify desktop/mobile with reduced motion and keyboard-only use. Perform a manual accessible-name/reading-order review without claiming screen-reader certification.

Full source, type, build, bundle, and regression verification belongs to an authorized implementation/release task, not this design task.

## 32. Scope and non-goals

This design aligns the ODE Method-stage cognitive model and specifies future reviewed teaching content. It does not:

- change, add, remove, retune, or reorder numerical algorithms, coefficients, formulas, supported orders, startup, tolerances, budgets, classifications, or diagnostics;
- change presets, Data fields, Run behavior, exact-reference behavior, Compare numerics, Output, Convergence calculations, or result fingerprints;
- add a computation trace, adaptive stepping, another problem profile, velocity-dependent Leap-Frog acceleration, or new diagnostic;
- redesign Linear Systems, add its Tutor, implement PDE, resume Motion, or alter accepted Glossary behavior/content;
- change Router, route paths, lazy-loading, MathLive/Compute Engine deferral, session schema, persistence, Tutor requests, or lifecycle ownership;
- introduce a framework, dependency, DEV route, product prototype, animation requirement, or theme system;
- implement production TypeScript, CSS, tests, or architecture in this task.

## 33. Risks and mitigations

| Risk | Consequence | Required mitigation/gate |
|---|---|---|
| Catalog copy and runtime nonlinear path conflict | Learners receive factually wrong Adams-Moulton/BDF process teaching | Resolve the narrow Newton-vs-fixed-point authority decision before learner copy is merged; test rendered wording against runtime defaults. |
| BDF6 metadata is mistaken for guaranteed observed order | Product overpromises numerical evidence | Numerical authority approves explicit theoretical-versus-current-startup wording; preserve the existing focused test boundary. |
| Eight methods expand into a long card wall | Cognitive order and mobile calm are lost | Enforce shallow complete landscape + one deep selected profile in design review and screenshots. |
| Teaching registry duplicates numerical constants | Future source drift | Key records to `MethodFamily`; derive classification/order/coefficient/preset data from current owners; fail completeness tests. |
| Selection accidentally advances or invalidates output | Existing exploration workflow regresses | Preserve session mutation/result contracts and add focused navigation/result tests before visual work. |
| Dense formula treatment causes overflow or duplicate speech | Mobile/accessibility failure | Layer formulas, use local containment, supply one accessible owner, and browser-check dense profiles at narrow widths. |
| Cross-Lab alignment becomes visual cloning | ODE loses choice-rich domain personality | Review against the cognitive matrix, not component parity; retain ODE selection and Compare asymmetry. |
| Advanced details hide essential requirements | Beginners miss profile/order/startup boundaries | Keep identity, process, required data, critical limitation, and next action outside disclosures. |
| Generic stability language outruns repository authority | Unsupported mathematical claims ship | Maintain the authority ledger, prohibit broad rankings, and require independent mathematical/content audit. |
| New teaching content affects lazy bundles | Home/static routes regress | Keep all content inside the ODE dynamic route; inspect manifest/import graph and route network sequence during implementation. |
| Large rerender disrupts focus/scroll or retains math handles | Navigation and accessibility regress | Use current lifecycle seams, connected-node/generation checks, idempotent disposal, and browser navigation stress tests. |

## 34. Accepted authority decisions

The Maintainer resolved the former open questions with a binding addendum at
documentation checkpoint `bfe5d514c67b1f5c00a1bc71b128f158e4811a5a`.
These are teaching/content decisions only and authorize no change to numerical
algorithms, formulas, coefficients, startup, tolerances, diagnostics, grid
rules, Convergence classifications, or solver selection.

### 34.1 Numerical and content authority

1. **Adams-Moulton and BDF:** learner teaching describes the current UI-default
   Newton solve. Adams-Moulton's Adams-Bashforth predictor seeds the implicit
   corrector and is not the accepted corrected value. Newton convergence is
   neither an accuracy certificate nor a method-stability certificate.
   Fixed-point remains a genuine internal kernel override. Direct product and
   result-metadata wording may be narrowly aligned with the method actually
   used; implementation behavior remains untouched.
2. **BDF6:** method metadata retains theoretical order 6. The landscape shows
   only supported range 1–6; the selected profile shows theoretical order;
   advanced limitation copy may state that current fixed RK4 startup can limit
   end-to-end observed refinement behavior toward approximately order 5 in the
   existing focused evidence. This does not redefine BDF6 theory.
3. **Taylor 2:** beginner copy says the Lab estimates the derivative
   information required by the method internally from the entered right-hand
   side. Advanced detail may identify centered approximations of `f_t` and
   `f_y` and the current five-RHS-evaluation work count. The finite-difference
   scale is implementation detail only, never an editable control or new
   public contract. Learners do not supply analytic partial derivatives.
4. **Leap-Frog:** the implementation-grounded staggered equations and their
   accessible verbalization are approved. Teaching distinguishes the half-step
   velocity update, whole-step position update, and full-step velocity
   reconstruction stored for output, and says this is the update used by the
   current Lab. It does not imply velocity-dependent acceleration, general
   second-order systems, first-order Compare, exact-reference input, or
   Convergence.
5. **Stability:** publish only the existing Backward Euler A-stability
   qualifier for the scalar test equation, current preset-specific observation
   guidance, and other explicitly source-backed qualified statements. No
   global method ranking or unsupported broad stability claim is authorized.

### 34.2 Interaction and visual authority

1. **Landscape to Lens** and the cognitive order in Section 1.1 are accepted.
2. Compare is a secondary branch attached to the landscape, never a full
   primary teaching section between Landscape and the selected lens.
3. Method selection chooses family, Data owns editable order, and initialized
   family-specific order is preserved as defined in Section 1.1.
4. **Read selected method** is optional and evidence-gated; selection does not
   auto-scroll.
5. The initial future diagram responsibilities are exactly those recorded in
   Section 1.1 and Section 21. No diagram is authorized in Phase 0 or 1.

## 35. Implementation gate

This specification authorizes only **Phase 0 and Phase 1** under the bounded
task recorded in the active plan. Phase 1 is additive pure content/selectors
and must leave the browser-visible ODE Method UI unchanged.

Phase 2 may begin only after:

1. Phase 1 supplies exactly eight source-linked reviewed profiles and pure
   order-preserving derivation;
2. focused tests, typecheck, boundary review, and documentation validation pass;
3. an independent mathematical/content audit accepts the Phase 1 registry; and
4. the Maintainer separately authorizes the Phase 2 opening/landscape slice.

Cross-Lab Presentation Phase 7 remains paused. This acceptance does not resume
the release audit, change implemented architecture, authorize push/deployment,
or authorize any browser-visible Method redesign.
