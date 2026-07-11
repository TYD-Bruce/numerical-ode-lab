# Observed Convergence Order Experiment Design

**Status:** Approved for implementation planning

**Date:** 2026-07-10

**Scope:** Version 1, documentation only

## 1. Purpose

Numerical ODE Lab will add a beginner-friendly, academically responsible **Convergence Study** drawer to Step 3, Output. The experiment will rerun the current single first-order method on a sequence of uniformly refined fixed grids, compare each numerical solution with a supplied exact solution, measure final-time and maximum global errors, estimate observed convergence order, and explain the result without presenting a pass/fail verdict.

The existing three-step flow remains unchanged:

1. Method
2. Data
3. Output

The drawer is analysis attached to a completed run, not a fourth step. It is collapsed by default and never changes the numerical result already shown in Step 3.

The feature teaches the distinction between exact and numerical solutions, what grid refinement means, how global errors are measured, how observed order relates to theoretical order, how to read a log-log error plot, and why finite experiments may not reproduce theory exactly.

## 2. Version 1 boundaries

### Included

- Single-method runs for scalar first-order IVPs.
- User-supplied exact-solution expressions and exact solutions supplied by built-in presets.
- Every fixed-step first-order method currently implemented: Forward Euler, Backward Euler, Taylor Method (Order 2), Runge-Kutta 4, Adams-Bashforth, Adams-Moulton, and BDF, subject to each method's existing order and grid contracts.
- Three through six refinement levels.
- Final-time error, maximum global error, maximum-error time, and adjacent-level observed orders.
- One log-log chart with a switch between maximum global error and final-time error.
- Educational explanations grounded in the current experiment.
- Optional convergence data in the AI Tutor context, including mock mode.

### Excluded

- Compare-mode convergence studies.
- Leap-Frog convergence, phase, or energy analysis.
- Numerical reference solutions or any numerical solution labeled as exact.
- Systems of ODEs, adaptive stepping, work-precision diagrams, RHS evaluation counts, complete error-versus-time series, exports, Web Workers, progress, or cancellation.
- A global frontend redesign or a math-rendering dependency such as KaTeX or MathJax.

These exclusions are not partially implemented or hinted as imminent in Version 1.

## 3. Existing contracts that remain authoritative

The experiment calls the existing `integrateFirstOrder` integration API. It must not copy, fork, or subtly alter solver formulas.

- Each level uses a positive, uniform fixed step and exactly `N_l = (tEnd - t0) / h_l` steps.
- Grid alignment uses `validateFixedStepGrid` and its current 32-ULP tolerance. No final short step is introduced.
- Each individual integration remains subject to `MAX_FIXED_STEPS = 100_000`.
- All inputs, RHS evaluations, numerical solution values, and exact solution values must be finite.
- A multistep method of order `p` requires `N_l >= p`, so that its selected formula executes at least once. Because refinement only increases `N_l`, validating the coarsest level is sufficient, but all preview entries are still validated.
- AB, AM, and BDF continue to use Runge-Kutta 4 startup values at the same level step size.
- Existing implicit nonlinear-solve behavior and failure messages remain unchanged. A Newton failure is not automatically described as method instability.
- The theoretical order is taken from the successful level result's `SolverMetadata.order`, derived from the actual selected method configuration. The study verifies that all levels report the same method family and order.
- Visible mathematics uses Unicode and plain text. No raw LaTeX is added.

The study adds a separate aggregate budget of 250,000 integration steps. A configuration must satisfy both the 100,000-step per-level solver cap and the 250,000-step study cap.

## 4. Architecture and ownership

The experiment model is pure TypeScript and independent of the DOM. `main.ts` coordinates forms, state, and rendering but does not contain numerical checking, error calculation, observed-order, threshold, interpretation, or fingerprint logic.

The planned responsibility split is:

- `src/problemPresets.ts`: immutable preset definitions, preset IDs, recommended inputs, teaching text, suggested methods, and explicit-step warnings.
- `src/exactSolution.ts`: exact-expression compilation and the nine-point numerical consistency check.
- `src/convergenceStudy.ts`: configuration validation, refinement preview, study execution, errors, observed-order assessments, interpretation, theoretical reference data, and stable fingerprints.
- `src/convergenceStudyView.ts`: drawer markup, table, teaching accordions, conclusion card, and Chart.js adapter. It receives model results and emits user intents; it contains no numerical policy.
- `src/main.ts`: integration into the existing Step 2 and Step 3 lifecycle, preset undo state, current-run identity, convergence result persistence, and stale-state transitions.
- `src/aiTypes.ts` and `src/aiTutor.ts`: optional, serialized convergence context built only from a successful model result.

This split is a design target, not authorization for unrelated refactoring. The implementation plan may adjust exact filenames to match repository conventions, but the pure numerical boundary is mandatory.

### Core types

```ts
type ExactSolutionFunction = (
  t: number,
  t0: number,
  y0: number
) => number;

interface FirstOrderProblemDefinition {
  expression: string;
  rhs: (t: number, y: number) => number;
  t0: number;
  y0: number;
  tEnd: number;
  presetId?: ProblemPresetId;
  customizationSourcePresetId?: ProblemPresetId;
}

interface ExactSolutionCheckResult {
  status: "passed" | "warning" | "blocked";
  sampleCount: 9;
  maximumNormalizedResidual?: number;
  maximumResidualTime?: number;
  initialValueDifference?: number;
  statement: "This is a numerical consistency check, not a formal proof.";
  issues: Array<{
    kind:
      | "non_finite_exact"
      | "initial_value_mismatch"
      | "derivative_warning"
      | "derivative_strong_warning";
    message: string;
    sampleTime?: number;
  }>;
}

interface ConvergenceStudyConfig {
  method: MethodConfig;
  problem: FirstOrderProblemDefinition;
  exactSolutionExpression: string;
  exactSolution: ExactSolutionFunction;
  baseStepSize: number;
  refinementLevels: number;
  allowConsistencyWarning: boolean;
}

interface ConvergenceLevelResult {
  level: number;
  stepSize: number;
  stepCount: number;
  finalNumericalValue: number;
  finalExactValue: number;
  finalTimeError: number;
  maximumGlobalError: number;
  maximumErrorTime: number;
  finalObservedOrder?: ObservedOrderAssessment;
  maximumObservedOrder?: ObservedOrderAssessment;
}

type ObservedOrderStatus =
  | "reliable"
  | "below_resolution"
  | "no_improvement"
  | "negative"
  | "near_zero"
  | "unavailable";

interface ObservedOrderAssessment {
  value?: number;
  status: ObservedOrderStatus;
  message: string;
  coarseLevel: number;
  fineLevel: number;
}

type ConvergenceInterpretationKind =
  | "consistent_with_theory"
  | "approaching_theory"
  | "not_yet_asymptotic"
  | "refinement_not_improving"
  | "order_unavailable";

interface ConvergenceInterpretation {
  kind: ConvergenceInterpretationKind;
  title: string;
  explanation: string;
  primaryObservedOrder?: number;
  evidencePairs: Array<[number, number]>;
}

interface ConvergenceStudyResult {
  configFingerprint: string;
  theoreticalOrder: number;
  consistencyCheck: ExactSolutionCheckResult;
  levels: ConvergenceLevelResult[];
  interpretation: ConvergenceInterpretation;
}
```

`evidencePairs` contains `[coarseLevel, fineLevel]` indices for the adjacent maximum-error order assessments used in the conclusion. It does not contain error values.

## 5. Step 2 problem presets

A preset selector appears near the first-order equation input. It is absent from the Leap-Frog form and may be omitted from Compare mode in Version 1 because convergence is unavailable there.

### Replacement, snapshot, and customization behavior

The first-order form tracks whether its problem fields differ from their initial defaults or the last loaded preset. The tracked problem fields are equation, `t0`, `y0`, `tEnd`, `h`, exact-solution enabled state, and exact-solution expression. Method and method order are not preset fields.

- If the tracked fields are unchanged, selecting a preset loads it immediately.
- If any tracked field was edited, selecting a preset opens a confirmation: replacing the current problem will overwrite those fields.
- Immediately before a confirmed load, the app stores one snapshot of all tracked fields and the prior preset/customization identity. A later preset load replaces this snapshot; there is no undo stack.
- After loading, an **Undo preset** action restores that one snapshot exactly and then becomes unavailable.
- Editing any problem field after loading a preset changes the display identity to **Customised from: \<Preset Name\>**. Returning values manually to the preset defaults does not silently remove this label; reloading that preset restores its unmodified identity.
- Undo restores the identity from the snapshot. It does not alter the selected numerical method.

Preset loading sets the ODE expression, `t0`, `y0`, `tEnd`, recommended `h`, enables **I know the exact solution**, fills the exact expression, and exposes the preset's teaching summary and observation guidance.

### Preset catalog

| Preset | Inputs | Recommended setup | Teaching summary and observation guidance |
|---|---|---|---|
| Exponential Decay | `f(t,y) = -y`; `t0 = 0`; `y0 = 1`; exact `Math.exp(-t)` | `tEnd = 5`; base `h = 0.2`; suggested: Forward Euler, Taylor 2, RK4, then implicit or multistep comparisons in separate single runs | Basic decay, global error, and stability. Watch how absolute error changes as the exact solution approaches zero. Explicit Euler is stable for this recommended step; unusually large explicit steps can oscillate or grow. |
| Exponential Growth | `f(t,y) = y`; `t0 = 0`; `y0 = 1`; exact `Math.exp(t)` | `tEnd = 3`; base `h = 0.1`; suggested: Forward Euler, Taylor 2, RK4 | Shows error growth with solution magnitude. Compare absolute error with the rapidly growing exact value; convergence order concerns how error changes with `h`, not whether absolute error is visually small. |
| Linear Forced Equation | `f(t,y) = t - y`; `t0 = 0`; `y0 = 1`; exact `t - 1 + 2 * Math.exp(-t)` | `tEnd = 5`; base `h = 0.2`; suggested: Taylor 2, RK4, Adams-Bashforth, Adams-Moulton | A nonhomogeneous linear equation combining a transient and a growing forcing term. Observe whether final-time and interval-wide error tell the same story. |
| Logistic Growth | `f(t,y) = y * (1 - y)`; `t0 = 0`; `y0 = 0.5`; exact `1 / (1 + Math.exp(-t))` | `tEnd = 10`; base `h = 0.25`; suggested: Forward Euler, RK4, Adams-Moulton | Demonstrates nonlinearity, saturation, and approach to equilibrium. Observe where the maximum error occurs rather than assuming it is at the endpoint. Very large explicit steps can overshoot the physical interval or destabilize the discrete solution. |
| Oscillatory Forcing | `f(t,y) = Math.cos(t)`; `t0 = 0`; `y0 = 0`; exact `Math.sin(t)` | `tEnd = 6`; base `h = 0.1`; suggested: Forward Euler, Taylor 2, RK4, Adams-Bashforth | Shows a periodic solution and why maximum global error can be more informative than endpoint error. At some endpoints, cancellation can make final-time error unusually small and its observed order unreliable. |
| Stiff Relaxation | `f(t,y) = -1000 * (y - Math.cos(t)) - Math.sin(t)`; `t0 = 0`; `y0 = 1`; exact `Math.cos(t)` | `tEnd = 0.1`; base `h = 0.0005`; suggested: Backward Euler, Adams-Moulton, BDF; RK4 only at suitably small `h` | Separates stiffness, absolute stability, and nonlinear-solve diagnostics. Warn that Forward Euler and Taylor 2 require approximately `h < 0.002` on the fast linear mode, while RK4's negative-real-axis limit is approximately `h < 0.0028`; these are linear stability guidance, not guarantees for every run. For explicit Adams-Bashforth orders, avoid a universal numeric threshold and advise using a much smaller step or an implicit method. |

Warnings are educational and do not replace solver validation. For Stiff Relaxation, the UI compares the entered base `h` with the stated method-specific guidance and warns before the original run or study when appropriate. Other presets use qualitative warnings rather than claiming a sharp stability boundary.

## 6. Exact-solution input and compilation

The Step 2 switch is labeled **I know the exact solution**. When enabled, it reveals **Exact solution y(t)**, an input hint listing the only allowed variables (`t`, `t0`, `y0`), and the example:

```text
y0 * Math.exp(-(t - t0))
```

The exact solution is optional. It is evaluated only for consistency checks, error analysis, convergence studies, and grounded explanations. It never changes the RHS, initial data, grid, numerical integration, startup values, or original Step 3 result.

Compilation returns `ExactSolutionFunction`. Version 1 may follow the repository's existing expression strategy, but it must construct a function whose only named arguments are `t`, `t0`, and `y0`; it must not inject application state or permit the expression to mutate the problem object. Syntax/compilation errors become controlled educational errors such as **The exact solution expression could not be parsed. Check its variables and parentheses.** Every evaluation is checked with `Number.isFinite`; `NaN` or infinity blocks the check or study and identifies the sample or grid time.

Using dynamic JavaScript expression execution is acceptable only under the repository's current local educational-use assumption. It is not safe for untrusted public input. A future security hardening task must replace both RHS and exact-expression execution with a whitelist AST parser that permits approved arithmetic and `Math` functions and rejects property traversal, assignment, statements, and global access. This limitation must be documented; Version 1 does not solve it.

## 7. Numerical consistency check

The check samples exactly nine uniformly spaced times including both endpoints:

```ts
t_i = t0 + (i / 8) * (tEnd - t0), i = 0, ..., 8
```

The nine times are the check locations, not the finite-difference increment. Using the full sample spacing as a derivative increment would create avoidable false warnings on otherwise correct curved solutions.

### A. Finite exact values

Evaluate the exact expression at all nine times. Any non-finite value or evaluation exception is a hard blocker. No derivative or integration runs after this failure.

### B. Initial value

The initial condition passes when

```text
|y_exact(t0) - y0| <= atol + rtol * max(1, |y0|)
atol = 1e-10
rtol = 1e-8
```

A mismatch is a hard blocker with the entered and evaluated values. It cannot be overridden.

### C. ODE derivative consistency

At each check location define a small positive derivative probe

```text
span = tEnd - t0
scale_i = max(1, |t_i|, span)
d_i = min(span / 8, 1e-6 * scale_i)
```

The earlier interval validation guarantees `span > 0`, so `d_i > 0`. Evaluate the additional exact values required by these probes and require them to be finite. Estimate the derivative as follows:

```text
i = 0: y'_num(t_i) = [y(t_i + d_i) - y(t_i)] / d_i
i = 8: y'_num(t_i) = [y(t_i) - y(t_i - d_i)] / d_i
otherwise: y'_num(t_i) = [y(t_i + d_i) - y(t_i - d_i)] / (2 d_i)
```

At each sample, evaluate `f(t_i, y_exact(t_i))`, require it to be finite, and compute

```text
r(t_i) = |y'_num(t_i) - f(t_i, y_exact(t_i))|
         / [1 + |y'_num(t_i)| + |f(t_i, y_exact(t_i))|]
```

Interpret the maximum normalized residual as follows:

- `max r <= 1e-5`: passed.
- `1e-5 < max r <= 1e-3`: warning.
- `max r > 1e-3`: strong warning.

Both warning grades allow **Cancel** or **Run anyway**. Choosing Run anyway sets `allowConsistencyWarning` for that exact configuration and run attempt; it is not a permanent suppression. A changed configuration must be checked and confirmed again. An unconfirmed warning is a pre-run blocker.

Every result displays: **This is a numerical consistency check, not a formal proof.** Derivative inconsistency may reflect an incorrect expression, coarse finite differences, scaling, or other numerical effects; the UI and Tutor must not claim it proves the exact solution is wrong.

## 8. Drawer interaction and experiment preview

The default-collapsed **Convergence Study** drawer appears after the normal method details in single first-order Step 3 output. Compare and Leap-Frog output do not show runnable study controls or disabled controls that imply support. They may show a brief availability note only where users would otherwise expect the drawer.

If the completed run has no enabled exact expression, opening the drawer shows:

> Add an exact solution in Step 2 to run error and convergence analysis.

Before a run, the drawer always shows experiment setup, the exact expression, editable base `h`, refinement levels, refinement preview, estimated total steps, and Run button. Base `h` starts from the current original run's `h`; editing it affects only the study. Levels default to 3 and accept integer values from 3 through 6.

For levels `l = 0, ..., L - 1`:

```text
h_l = baseH / 2^l
N_l = validated integer (tEnd - t0) / h_l
```

The preview lists level number, `h_l`, and `N_l`, plus `sum(N_l)`. When the base grid has `N` steps, the exact aggregate is:

```text
N_total = N * (2^L - 1)
```

The preview uses integer validated counts, not an unrounded estimate. Validation happens before any large point arrays are allocated. Execution is blocked when any level is misaligned, any level exceeds 100,000 steps, `N_0 < p` for a multistep method, or `N_total > 250_000`. At exactly 250,000 aggregate steps the budget passes. Budget copy tells the user to increase base `h` while keeping it grid-aligned, shorten the interval in Step 2 and rerun, or reduce levels; the drawer cannot change the original interval.

## 9. Experiment execution and error definitions

After validation and consistency confirmation, the model runs levels from coarse to fine using the same method configuration, RHS, interval, and initial value as the current Step 3 run, changing only `h`. The study does not reuse the original run as a level because the drawer's base `h` may differ; every level is produced consistently by the experiment runner.

For each returned numerical grid point `(t_n, u_n)`, evaluate the exact expression at the actual `t_n`. Do not create an idealized parallel grid, interpolate exact values, interpolate numerical values, or use a numerical reference solution.

```text
E_final(h) = |u_N - y(tEnd)|
E_infinity(h) = max over n of |u_n - y(t_n)|
```

Store `maximumErrorTime` as the actual numerical-grid time for the first occurrence of the maximum. Ties within exact JavaScript numeric equality retain the earlier time, making the result deterministic. `finalNumericalValue` is `u_N`; `finalExactValue` is the finite exact evaluation at the returned final grid time, which the fixed-grid contract requires to coincide with `tEnd` within existing tolerance.

If an exact evaluation or integration fails at any level, abort the entire study. Report the one-based display level, `h`, and controlled underlying reason, for example:

> Refinement level 4 failed at h = 0.00625 because the Newton solve did not converge. The convergence study was not updated.

The original Step 3 solver result and any previous successful convergence result remain untouched. No partial table, chart, or conclusion is published.

## 10. Observed-order assessment

For each adjacent coarse/fine level pair, calculate separate assessments for final-time and maximum global error:

```text
p_obs = log2(E_coarse / E_fine)
```

The assessment is attached to the fine level and identifies both level indices. Maximum-error order is primary for teaching and interpretation; final-time order is a secondary reference because endpoint cancellation can make it atypical.

All classification constants live in `convergenceStudy.ts`, are exported only when tests need them, and are not recreated in UI copy.

### Resolution threshold

For an error measured from exact value `y` and numerical value `u`, define

```text
resolutionThreshold = 100 * Number.EPSILON * max(1, |y|, |u|)
```

For final-time error, use the endpoint values. For maximum global error, use the exact and numerical values at `maximumErrorTime`. If either error in a pair is at or below its corresponding threshold, classify the pair `below_resolution`, omit `value`, and say:

> The measured error is too close to floating-point resolution for a reliable observed-order estimate.

This rule also handles exact zero without division or raw infinity.

### Remaining classifications

After the resolution check:

- If either error is non-finite, classify `unavailable` with no value. This is defensive; normal execution rejects such a result earlier.
- If `E_fine > E_coarse`, calculate the finite order for diagnostics and classify `negative`. The UI message says refinement increased measured error and lists possible, unproven explanations: instability, roundoff, startup error, an invalid exact solution, or non-asymptotic behavior.
- If the errors are numerically indistinguishable using a relative comparison of `1e-12 * max(E_coarse, E_fine)`, classify `no_improvement`, set `value = 0`, and explain that refinement did not measurably reduce the error.
- Otherwise calculate the finite order. If `|p_obs| <= 0.1`, classify `near_zero`; this identifies a slight reduction too small to be meaningful as convergence.
- All other finite, positive orders are `reliable` and retain `value`.

`no_improvement`, `negative`, and `near_zero` values may appear in the table but are never evidence for a theoretical-order conclusion. The model never returns `NaN` or infinity.

## 11. Interpretation logic

Interpretation uses maximum-global-error assessments only. Start with the most recent two or three `reliable` adjacent pairs, preserving chronological refinement order. The final reliable pair supplies `primaryObservedOrder`. `evidencePairs` records exactly the pairs considered.

The theoretical consistency tolerance is:

```text
orderTolerance = max(0.25, 0.1 * theoreticalOrder)
```

Recent-order spread is `max(order) - min(order)`.

Apply categories in this precedence order:

1. **Refinement did not improve** when either of the two most recent maximum-error pairs is `negative` or `no_improvement`, or when the finest maximum error exceeds its predecessor. This category does not assert a cause.
2. **Order unavailable** when fewer than one reliable pair exists, including when resolution is reached before a reliable estimate. Explain whether the limiting evidence was resolution, insufficient pairs, or both.
3. **Consistent with theory** when at least two reliable pairs exist, the final reliable order is within `orderTolerance`, and the spread of the recent two or three reliable orders is at most `0.35`.
4. **Approaching theoretical order** when the last two reliable orders are outside tolerance, all intervening maximum errors decrease, and the absolute distance to theoretical order strictly decreases from the penultimate reliable order to the final reliable order. With only one reliable pair this category is not used.
5. **Not yet asymptotic** for remaining cases where maximum errors decrease but reliable orders are unstable or clearly offset from theory.

If one reliable pair exists and refinement otherwise decreases error, choose **Not yet asymptotic**, not Order unavailable: an order can be reported, but there is too little evidence for stability. Reaching floating-point resolution after earlier reliable pairs does not erase those pairs; the conclusion uses the final reliable evidence and explains that later estimates became resolution-limited.

Interpretations are explanatory categories, not grades. They never use red/green pass/fail semantics and never claim theoretical order has been proved.

## 12. Result table and log-log chart

After a successful run, the drawer always shows **What this experiment found**, the error table, and the chart.

The table includes level, `h`, step count, final numerical value, final exact value, final-time error, maximum global error, maximum-error time, adjacent final-time observed order/status, and adjacent maximum-error observed order/status. The first level shows an em dash for both adjacent orders because no coarse predecessor exists. Formatting may use scientific notation but tooltips or accessible labels retain sufficient precision to distinguish levels.

The chart has one metric toggle:

- Default: **Maximum global error**
- Alternative: **Final-time error**

Both axes are logarithmic. The horizontal axis is `h`, displayed coarse-to-fine from left to right by reversing the x-axis, and includes the note **Moving right means using a smaller step size.** The vertical axis is the selected absolute error. Zero, non-finite, or resolution-limited errors cannot be plotted at zero on a log scale; they are omitted from plotted measured points with an accessible explanation while remaining classified in the table.

The measured series uses the selected errors. A theoretical slope reference uses the actual `theoreticalOrder = p` and

```text
E_reference(h) = C h^p
C = E(h*) / (h*)^p
```

Choose `h*` from the finest measured point that participates in a `reliable` observed-order pair for the selected metric. This deterministic choice anchors the line near current evidence. The line compares slope only; its legend or caption states that the theoretical error constant is not known. If no reliable pair exists for the selected metric, omit the reference line.

Tooltips show level, `h`, selected error, and the adjacent observed order only when its assessment is `reliable`. Switching the metric updates measured points, reference eligibility, tooltips, y-axis label, and explanatory copy without rerunning the study.

## 13. Beginner teaching layout

The drawer's pre-run and post-run content follows the structure above. It also contains these accordion sections:

1. What are we testing?
2. What is an exact solution?
3. What does refining h mean?
4. How are final-time and maximum errors calculated?
5. How is observed order calculated?
6. How to read the log-log graph
7. Why observed and theoretical orders may differ
8. Common warnings and misconceptions

Every section is rendered from a model that supplies four required elements:

1. One plain-language sentence.
2. The mathematical definition in Unicode/plain text.
3. A concrete example populated from the current experiment, such as the current pair's `h`, errors, and calculated order.
4. A **Why this matters** statement.

Before a successful experiment, examples use the validated preview and exact expression where possible and clearly say that errors are not yet measured. After the first successful study for the current run, **What are we testing?** and **What is an exact solution?** default open; all other sections default closed. User open/closed choices persist while that Step 3 run remains current.

The conclusion card **What this experiment found** displays method name, theoretical order, final reliable maximum-error observed order if available, interpretation category, an explanatory sentence, and the refinement pairs used as evidence. It distinguishes “no reliable order available” from a numerical order of zero.

## 14. State, fingerprint, persistence, and invalidation

The app distinguishes the **current completed run configuration** from editable Step 2 draft fields. A successful original run captures an immutable first-order run snapshot containing method family, effective method order, RHS expression, `t0`, `tEnd`, `y0`, run `h`, exact-solution enabled state/expression, preset ID, and customization-source preset ID.

The stable current-run fingerprint uses an explicit versioned canonical serialization, not object property enumeration:

```text
v1|family|effectiveOrder|fExpression|t0|tEnd|y0|runH|
exactEnabled|exactExpression|presetId|customizationSourcePresetId
```

Strings are length-prefixed or JSON-string encoded so delimiters cannot collide. Numbers use a canonical finite representation that distinguishes values exactly as JavaScript uses them; `-0` is normalized to `0`. Whitespace in expressions is preserved because changing entered expressions is an invalidating input even if mathematically equivalent. Hashing is optional; correctness depends on canonical content, not cryptographic security.

The convergence configuration fingerprint combines the current-run fingerprint with canonical study `baseH`, levels, and a model-policy version. It is stored in `ConvergenceStudyResult.configFingerprint`.

- Closing and reopening the drawer preserves setup, successful result, chart metric, and accordion state.
- Returning to Step 2 without running changed draft inputs preserves the completed Step 3 run and its convergence result. Returning to Output without a new original run shows that same completed result.
- Editing Step 2 fields alone does not relabel the old result as belonging to the draft.
- Successfully rerunning after a change to method, effective order, RHS, `t0`, `tEnd`, `y0`, exact expression/enabled state, preset identity, or customization identity establishes a new run fingerprint and invalidates the prior convergence result.
- A rerun with an identical canonical configuration retains the matching convergence result.
- Changing study base `h` or levels marks the displayed convergence result **stale** immediately. The old table/chart may remain visible only with a prominent stale label and disabled conclusion claims; Run is required to replace it. It is never presented as the result of the edited settings.
- A failed original simulation does not replace the current successful Step 3 run or its convergence result.
- A failed convergence attempt does not overwrite a previous successful convergence result.

No result is silently associated with a different completed run.

## 15. Failure handling

Pre-run validation is ordered to fail cheaply before allocation or integration:

1. Confirm single first-order eligibility and a current successful run.
2. Require an enabled, non-empty exact expression and successful compilation.
3. Validate integer levels in `[3, 6]` and a positive finite base `h`.
4. Build and validate every fixed grid with the existing grid validator.
5. Validate the multistep minimum and both per-level and aggregate budgets.
6. Run the nine-point exact-solution consistency check.
7. Require explicit confirmation for a warning or strong warning.

Hard failures are missing/invalid exact solution, non-finite exact value, initial-value mismatch, invalid base `h`, invalid levels, misaligned refinement grid, `N < p`, per-level cap violation, aggregate budget violation, or unconfirmed warning. Errors name the field or level and state a user action.

During execution, the first level failure aborts the study and identifies display level and `h`. The app preserves the original Step 3 result and any last successful study, publishes no partial conclusion, and does not update Tutor context with partial data.

## 16. AI Tutor grounding

`OdeLabContext` gains an optional convergence block only when a non-stale successful study matches the current completed run:

```ts
convergenceStudy?: {
  theoreticalOrder: number;
  interpretation: ConvergenceInterpretation;
  levels: Array<{
    level: number;
    h: number;
    finalTimeError: number;
    maximumGlobalError: number;
    finalObservedOrder?: ObservedOrderAssessment;
    maximumObservedOrder?: ObservedOrderAssessment;
  }>;
  consistencyCheck: {
    status: ExactSolutionCheckResult["status"];
    maximumNormalizedResidual: number;
    statement: string;
  };
};
```

When derivative checking has no residual because a hard failure prevented a study, no convergence context exists. For successful studies, `maximumNormalizedResidual` is finite.

The context builder copies model values; it does not recompute errors or orders. Live and mock Tutor paths receive the same real block. Server and mock prompts permit explanations of non-integer order, differences between the two error streams, apparent asymptotic behavior, loss of improvement, and graph reading. They explicitly prohibit recalculating or overriding model results, describing the consistency check as proof, fabricating values, identifying a failure cause without evidence, or inventing a study when the optional block is absent.

Suggested Tutor questions may be extended only when convergence data exists. A stale or failed study is omitted, so the Tutor cannot accidentally ground an answer in obsolete or partial results.

## 17. Automated test requirements

Tests are deterministic and exercise the pure model separately from DOM rendering. Numerical order assertions use tolerances and grids chosen to avoid roundoff and known startup contamination.

### Exact solution checks

- `y' = -y`, `y = exp(-t)` passes all nine samples.
- Initial-value mismatch blocks and cannot be overridden.
- Exact `NaN`, infinity, thrown evaluation, and non-finite RHS block.
- Moderate and strong derivative residuals produce their respective warning paths.
- Warning confirmation permits execution; absence of confirmation blocks it.
- Interior samples use central differences; endpoints use forward/backward one-sided differences.
- The returned statement and visible copy say numerical consistency check, not proof.

### Known convergence

- Forward Euler approaches order 1.
- Taylor Method (Order 2) approaches order 2.
- RK4 approaches order 4 on a grid whose errors remain above resolution.
- Representative Adams-Bashforth, Adams-Moulton, and BDF orders approach their metadata order.
- A BDF6 test allows that RK4 startup is order 4: it must verify the implementation reports and interprets measured evidence without requiring a false sixth-order result when startup error dominates. The test documents this limitation rather than changing the solver.

### Errors and observed orders

- Hand-check final-time error, maximum global error, and earliest `maximumErrorTime` on a small synthetic grid.
- Verify final-time and maximum-error streams are calculated and classified independently.
- Cover exact zero, below-resolution nonzero error, equal/no-improvement error, increasing/negative order, slight-decrease near-zero order, normal reliable order, and defensive unavailable input.
- Assert no public result contains `NaN` or infinity.

### Budgets and numerical contracts

- Levels reject below 3, above 6, and non-integers; accept 3 and 6.
- Every refinement uses fixed-grid alignment and produces exact integer preview counts.
- Aggregate totals one below, exactly at, and one above 250,000 exercise the boundary where constructible with aligned grids; formula-level unit tests cover arithmetic boundaries independently of the per-level cap.
- A level above 100,000 is rejected even if aggregate validation would otherwise be reached.
- Multistep `N >= p` accepts equality and rejects `N < p` before integration.
- Budget and grid checks occur before solver calls or large allocations, verified with spies or injected integration functions.

### Interpretation

- Fixtures cover all five categories: consistent with theory, approaching theory, not yet asymptotic, refinement did not improve, and order unavailable.
- Boundary tests cover order tolerance, spread `0.35`, evidence precedence, one reliable pair, and later resolution after earlier reliable pairs.

### State and Tutor

- Identical canonical configurations produce identical fingerprints; every invalidating field changes the appropriate fingerprint.
- Drawer close/reopen and Step 2 draft navigation preserve results.
- Study-setting edits produce stale state; a matching rerun restores current state.
- A changed successful original run invalidates the old result; failed runs do not overwrite it.
- Tutor context contains exact model values only for a matching successful study.
- Live/mock grounded responses do not fabricate data or call the check proof; absence/staleness yields no convergence block.

### Regression

- The current numerical suite remains green.
- Existing explicit and implicit outputs, fixed-grid behavior, solver metadata, diagnostics, Compare mode, and Leap-Frog behavior are unchanged.
- Production TypeScript checks and build remain green without new dependencies.

## 18. Manual browser smoke test

1. Load Exponential Decay.
2. Select Runge-Kutta 4.
3. Run the original simulation.
4. Open the default-collapsed Convergence Study drawer.
5. Verify exact-solution consistency and the “not a formal proof” statement.
6. Run three levels.
7. Inspect table, conclusion, interpretation, evidence pairs, and maximum-error order.
8. Switch to final-time error.
9. Inspect log-log measured points, direction label, tooltip, and theoretical slope reference.
10. Close and reopen the drawer; verify the result and UI state persist.
11. Return to Step 2 without rerunning; verify the completed-run result persists.
12. Change the equation and successfully rerun; verify the old study invalidates.
13. Run a supported implicit method and inspect a successful study or a level-specific Newton failure without losing the original output.
14. Confirm Compare and Leap-Frog expose no runnable study.
15. Ask the AI Tutor about an actual error and observed order; verify its numbers match the table.

Also manually exercise preset overwrite confirmation, one-level Undo preset, customized labeling, missing exact-solution guidance, warning override, a stale study after changing its settings, and aggregate-budget blocking.

## 19. Future extensions

Possible later designs may cover Compare-mode convergence, a Leap-Frog phase/energy study, numerical reference solutions, work-precision and RHS counts, background execution with progress/cancellation, exports, and complete error-versus-time curves. Each requires a separate design because it changes evidence, performance, or interaction contracts. None is promised by Version 1.

## 20. Acceptance criteria

The implementation is ready for release when a user can load or enter a scalar first-order problem with a genuine exact solution, complete an unchanged original run, preview and execute a contract-valid 3–6-level refinement study, inspect both errors and safely classified observed orders, compare reliable maximum-error evidence with actual method metadata on a log-log chart, read grounded beginner explanations, and ask the Tutor about the exact computed values.

At the same time, unsupported modes expose no misleading controls; exact-solution problems and consistency uncertainty are communicated honestly; stale, partial, non-finite, or cross-run results are never presented as current; existing solver behavior remains unchanged; no dependency is added; and all automated and manual checks above pass.
