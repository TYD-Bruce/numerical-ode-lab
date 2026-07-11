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
