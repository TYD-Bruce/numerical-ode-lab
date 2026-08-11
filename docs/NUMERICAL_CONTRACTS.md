# Numerical contracts

All current solvers use a fixed time grid. A run is accepted only when
`N = (tEnd - t0) / h` is a positive integer within
`32 * Number.EPSILON * max(1, |N|)`. The small 32-ULP allowance accepts normal
binary representations of decimal grids (for example `0.3 / 0.1`) without
accepting materially different endpoint grids.

The solver performs exactly `N` steps and returns `N + 1` points. It does not
shorten a final step: Adams-Bashforth, Adams-Moulton, and BDF coefficients all
assume a constant step size, so a final partial step would require a different
method formulation.

Runs are capped at 100,000 steps. This limit keeps scalar point storage and
Chart.js rendering browser-safe; use a larger `h` or a shorter interval for
larger studies.

All time/initial numeric inputs and every evaluated derivative or acceleration
must be finite. Non-finite values stop the run with a descriptive error rather
than being propagated into result points.

## User-expression boundary

Solvers receive numeric closures only. They do not import or interpret
MathLive fields, MathJSON, LaTeX, DOM nodes, Tutor formulas, or expression
draft state. A production closure is compiled by exhaustive dispatch over a
structurally validated, project-owned `MathAst` using the variable profile for
the active problem.

AST evaluation preserves the explicit tree structure, nested grouping, and
left-to-right child order. Canonical handling does not sort, reassociate,
flatten, fold, cancel, distribute, or otherwise simplify arithmetic. This is
part of the floating-point contract, not merely a display choice.

The canonical `exp` function node evaluates with `Math.exp`. General `power`
nodes evaluate with `Math.pow`; a directly constructed project power with base
e is not rewritten by the core canonicalizer. Division by zero, square root of
a negative real value, logarithm of a non-positive value, non-finite tangent,
overflow, and other non-finite results produce controlled expression errors.
Finite underflow to zero is allowed. Evaluator inputs are checked for
finiteness before dispatch.

The Human-Friendly Math Expressions migration did not alter method formulas,
coefficients, fixed-grid alignment, startup policy, nonlinear iteration,
solver metadata, or diagnostics.

## Implicit nonlinear solves

Each implicit time step requires solving a scalar algebraic equation `G(u) = 0`.
A run succeeds only when both the nonlinear update and residual meet their
scale-aware tolerances; failed steps throw rather than return partial results.
The default solver is scalar Newton iteration with a numerical central-difference
derivative. Nonlinear-solver convergence is distinct from absolute stability of
the time-stepping scheme, and Newton convergence is not universally guaranteed.

## Exact-solution consistency contract

The optional first-order exact solution uses the validated `exact_solution`
profile and is never substituted into the original integration. Before a
convergence study, the checker evaluates exactly nine uniformly spaced locations

`t_i = t0 + (i / 8)(tEnd - t0)`, for `i = 0,...,8`,

including both endpoints. These are check locations only, not finite-difference
step sizes. At each location it uses

`d_i = min((tEnd - t0) / 8, 1e-6 * max(1, |t_i|, tEnd - t0))`.

The derivative estimate is forward at `t0`, central at the seven interior
locations, and backward at `tEnd`. Using the full nine-point spacing would create
false warnings for correctly curved solutions, so it is not permitted.

Every sampled and additional probe value must be finite. The initial-value check
requires

`|y_exact(t0) - y0| <= 1e-10 + 1e-8 * max(1, |y0|)`.

A non-finite exact value or initial mismatch is a hard blocker. Derivative
evidence uses

`r(t) = |y'_num(t) - f(t,y_exact(t))| / (1 + |y'_num(t)| + |f(t,y_exact(t))|)`.

Maximum residual at or below `1e-5` passes; above `1e-5` through `1e-3`
produces a warning; above `1e-3` produces a strong warning. Both warning grades
remain overridable only through the fingerprint-specific UI confirmation. The
pure runner accepts immutable `allowConsistencyWarning` input and consumes no UI
state. The returned and visible statement is: **This is a numerical consistency
check, not a formal proof.**

## Convergence-study contract

The study is available only for a successful scalar first-order run with an
exact solution. Its study base step size is independent from the original run
step size. For `L` levels, where `3 <= L <= 6`, level `l` uses

`h_l = baseH / 2^l`, for `l = 0,...,L-1`.

Every level is validated through the existing `validateFixedStepGrid` contract;
the convergence layer does not copy or replace its 32-ULP alignment policy.
The existing 100,000-step per-level cap remains authoritative. Adams-Bashforth,
Adams-Moulton, and BDF require coarsest-grid `N >= p`. The aggregate 250,000-step
guard is retained as defense-in-depth and as a browser-protection proxy, not an
exact runtime or right-hand-side evaluation estimate. Under current binary
refinement and the per-level cap, the largest valid six-level total is 196,875,
so the aggregate guard is not normally reachable through a valid preview.

The runner integrates each validated level independently from coarse to fine and
never reuses the original Step 3 result as a study level. A level failure aborts
the entire attempt; no partial result is published. Only aggregate level rows are
retained after measurement, so complete multi-level time series are transient.

For each actual returned grid point,

`E_final(h) = |u_N - y(tEnd)|`

uses the returned final point, and

`E_infinity(h) = max_n |u_n - y(t_n)|`.

Exact values are evaluated directly on actual numerical grid times with no
interpolation and no numerical reference solution. Exact ties for the maximum
retain the earliest grid time. The scale-aware floating-point threshold at a
point is

`100 * Number.EPSILON * max(1, |exact|, |numerical|)`.

Adjacent observed order is calculated separately for final-time and maximum
global errors as

`p_obs = log2(E(h) / E(h/2))`.

Maximum-global-error order is the primary educational evidence. Non-finite
inputs yield `unavailable`; errors at or below resolution yield
`below_resolution`; an increase is classified `negative` before near-equality;
near-equality yields `no_improvement`; positive order of magnitude at most `0.1`
yields `near_zero`; and a finite positive normal value is `reliable`. No public
result exposes `NaN` or infinity.

Interpretation examines the newest two assessments for negative/no-improvement
evidence first, then retains all reliable evidence and uses the most recent three
reliable pairs. Consistency with theory requires at least two reliable pairs,
final difference within `max(0.25, 0.1p)`, and recent spread at most `0.35`
(plus a minimal roundoff allowance). Later resolution-limited pairs do not erase
earlier reliable evidence. The theoretical order comes from the actual returned
solver metadata, not a UI label.

BDF6 metadata remains theoretical order 6. A fixed number of RK4 startup steps
introduces startup-value errors of `O(h^5)`, so end-to-end measured final-time
order may be approximately five. Tests require measured evidence in the range
4.5-5.5 rather than falsely requiring order six. No startup rule, method
coefficient, grid contract, nonlinear solve, metadata field, or diagnostic was
changed for the convergence feature.

## Platform Computation Trace contract

A Computation Trace is immutable structured numerical evidence emitted by the
authoritative computation while it executes. It is not reconstructed from a
final answer, generated by Tutor, or stored as HTML, Markdown, learner-facing
prose, or generated LaTeX authority. A later renderer owns presentation only.
Enabling a trace must not change the producer's method, arithmetic order,
numerical output, success/failure classification, or session-publication
semantics.

The shared trace record explicitly distinguishes bounded finite, repetitive
finite, and unbounded processes and records its version, retention policy,
retained count, known total count where applicable, omission state, optional
final-step retention, and immutable semantic steps. Retention is producer-
bounded:

- a single-step or small naturally bounded computation retains all meaningful
  evidence;
- a large repetitive finite computation retains at most the first five
  representative sequential computations plus a distinct final
  computation/result when applicable; and
- an infinite or conceptually unbounded computation retains at most the first
  five sequential computations plus structured continuation metadata and
  cannot claim a final step or known total.

Future high-step-count methods must bound trace generation itself; a renderer
must not receive an arbitrary raw trace and slice it later. Controlled failures
may carry only the valid evidence produced through the failure point, without
publishing partial success or replacing a prior immutable successful snapshot.
Diagnostic calculations may own structured arithmetic evidence when that
evidence explains how the diagnostic was obtained.

## Linear Systems Version 1 contract

The Linear Systems v1 numerical core solves `A x = b` for dense real square
matrices with integer dimension `2 <= n <= 6`. Its only method is Gaussian
elimination with partial pivoting, and its public factorization convention is

`P A = L U`,

where `A` is the original input matrix, `P` is the row-permutation matrix, `L`
is unit lower triangular, and `U` is upper triangular. All supplied entries and
all relevant generated values must remain finite JavaScript binary64 `Number`
values.

At elimination column `k`, the selected pivot row is the first row `p` in
`k..n-1` attaining the maximum `abs(U[p][k])`. Equal magnitudes therefore keep
the first matching row. When `p != k`, complete rows of `U` and `P` are
exchanged, as are the permutation entries. Only the already-computed columns
`0..k-1` of those two rows in `L` are exchanged. This prior-column `L` swap is
required to preserve `P A = L U`.

Using the original matrix, the matrix infinity norm and product safeguard are

`||A||_inf = max_i sum_j abs(A[i][j])`

and

`tauPivot = 64 * Number.EPSILON * ||A||_inf`.

If `||A||_inf == 0`, the solve is rejected immediately. At every elimination
column, the attempt is rejected when

`abs(selectedPivot) <= tauPivot`.

The threshold scales directly with `A`; it must not use a
`max(1, ||A||_inf)` normalization. This threshold is an explicit engineering
safeguard for this educational Lab, not a theorem proving singularity. The
safe learner-facing failure is: **The system is singular or too close to
singular for this Lab's pivot acceptance threshold.**

After factorization, forward substitution solves `L y = P b`, and backward
substitution solves `U xHat = y`. Every input-dependent division and generated
intermediate is checked for finite output. A failure publishes no partial
result and cannot replace a prior successful session snapshot.

The Linear Systems successful result also carries a bounded-finite Computation
Trace with all meaningful steps retained. Its discriminated semantic records
are emitted inside the one authoritative numerical path and cover:

- original-matrix row absolute sums, `||A||_inf`, and `tauPivot`;
- each pivot candidate/selection and the accepted threshold comparison;
- actual row swaps, including affected `U`/`P` rows, permutation state, and
  prior-column `L` evidence;
- each elimination multiplier and actual before/used/after row data;
- completed `P`, `L`, `U`, and permutation evidence;
- ordered contribution data, the actual sequential right-hand-side
  accumulator, and the finite accumulated term sum when representable for
  every forward- and backward-substitution component;
- original-data matrix-vector products, residual components, and residual
  infinity-norm evidence; and
- componentwise preset-reference difference evidence only when the exact
  approved preset fingerprint authorizes it.

All exposed trace numbers are the binary64 values computed by the numerical
path. Trace arrays and nested records are defensively copied and deeply frozen;
they share no mutable working-array or caller-input aliases. A
`pivot_rejected` failure carries bounded evidence through the rejected pivot
selection, including its active zero-based column, selected value/magnitude,
and `tauPivot`. That evidence records a product safeguard failure and does not
prove formal singularity.

The triangular solvers retain their released evaluation order
`value -= product`. Ordered products and every resulting `value` accumulator
are always the authoritative evidence. A separately accumulated known-term sum
is included only while it remains finite; it is omitted if that trace-only
aggregate would overflow even though the authoritative sequential solve stays
finite. This omission cannot turn an accepted Day 1 solve into a failure or
change its numerical values.

Residual is evaluated with the original input in the stored left-to-right loop
order:

`r = b - A xHat`

and

`||r||_inf = max_i abs(r[i])`.

Residual measures equation mismatch. It is not solution error, and product
copy must preserve that **a small residual does not necessarily mean a small
solution error**. Version 1 computes no condition number, backward error,
forward-error estimate, or forward-error bound.

Only an exact approved preset input fingerprint authorizes a reference vector.
For an authorized preset, the core reports

`referenceDifferenceInf = ||xHat - xRef||_inf`.

The learner-facing label is **Difference from preset reference solution** or
an equivalently qualified phrase. It must not be called unqualified “exact
error.” Editing any preset input removes preset/reference authority; restoring
the exact parsed numerical fingerprint restores it.

The two and only two v1 presets are:

- `Starter 3×3`: `A = [[3,1,-1],[2,4,1],[-1,2,5]]`,
  `b = [6,9,-2]`, `xRef = [1,2,-1]`;
- `Row swap required`: `A = [[0,2,1],[1,-2,-3],[2,3,1]]`,
  `b = [0,-3,1]`, `xRef = [1,-1,2]`.

Preset values, copied input, factor work arrays, and successful returned data
must not expose mutable aliases. Determinant, inverse, condition number,
backward/forward error bounds, growth-factor claims, Jacobi, Gauss-Seidel, and
iterative refinement are outside the Version 1 numerical contract.
