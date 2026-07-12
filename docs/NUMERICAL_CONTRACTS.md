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
