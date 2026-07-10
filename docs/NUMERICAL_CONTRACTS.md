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
