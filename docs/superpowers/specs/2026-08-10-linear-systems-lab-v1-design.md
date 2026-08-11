# Linear Systems Lab Version 1 Design

Status: **Maintainer-approved numerical and product design; Day 1 numerical
core and Day 1.5 structured computation evidence implemented locally**

Date: 2026-08-10

## 1. Purpose and learner goal

Linear Systems Lab is the first runnable Numerical Linear Algebra vertical
slice in Numerical T Lab. It teaches how a small dense system

\[
A x = b
\]

is transformed, solved, and checked in finite-precision arithmetic.

The learner should be able to:

- enter or choose a small square system;
- compute one numerical approximation with Gaussian elimination and partial
  pivoting;
- connect row pivoting to the public factorization `P A = L U`;
- inspect the structured numerical evidence that produced the factors and
  solution;
- inspect the computed solution and residual; and
- understand that a small residual measures equation mismatch, not necessarily
  small solution error.

The v1 workflow is **Method → Data → Output → Diagnostics**. Output and
Diagnostics are published atomically after a successful run.

## 2. Mathematical problem

- Input form: `A x = b`.
- `A` is a real dense square matrix.
- `b` is a real vector with the same dimension as `A`.
- Supported dimensions are integers `2 <= n <= 6`.
- All input entries and all relevant generated values must be finite JavaScript
  binary64 `Number` values.
- Complex, sparse, rectangular, multiple-right-hand-side, and symbolic systems
  are outside v1.

## 3. Numerical algorithm

### 3.1 Method and factorization convention

The only v1 method is Gaussian elimination with partial pivoting. The public
factorization convention is

\[
P A = L U,
\]

where `A` is the original matrix, `P` is the row-permutation matrix, `L` is
unit lower triangular, and `U` is upper triangular.

At elimination column `k`, the implementation selects the row `p` among
`k..n-1` with maximal `abs(U[p][k])`. Equal magnitudes retain the first row
encountered. This deterministic tie rule is part of the product contract.

When rows `k` and `p` differ, the implementation swaps:

- complete rows `k` and `p` of `U`;
- complete rows `k` and `p` of `P`;
- the corresponding permutation entries; and
- only columns `0..k-1` of rows `k` and `p` in `L`.

The last rule preserves previously computed multipliers and is required for
the final `P A = L U` identity.

### 3.2 Pivot acceptance safeguard

Using the original input matrix, define

\[
\lVert A\rVert_\infty = \max_i \sum_j |A_{ij}|
\]

and

\[
\tau_{pivot} = 64\,\mathrm{Number.EPSILON}\,\lVert A\rVert_\infty.
\]

If the original matrix infinity norm is zero, the solve is rejected
immediately. At every elimination column, the selected pivot is rejected when
`abs(selectedPivot) <= tauPivot`.

This threshold is a project engineering safeguard for a small educational Lab.
It is not a theorem proving singularity. It scales directly with the original
matrix norm; v1 does not replace that norm with `max(1, ||A||_inf)`.

The learner-facing pivot failure is:

> The system is singular or too close to singular for this Lab's pivot
> acceptance threshold.

### 3.3 Triangular solves

After factorization, v1 solves

\[
L y = P b
\]

by forward substitution and

\[
U \widehat{x} = y
\]

by backward substitution. Every division, multiplication, accumulation,
subtraction, and generated quotient that can carry input-dependent numerical
data is checked for finite output. A non-finite intermediate rejects the
attempt; no partial result is published.

## 4. Project engineering safeguards

- Numerical code is pure and owns no DOM, storage, chart, MathLive, Tutor,
  route, or Glossary object.
- Input arrays are copied before factorization.
- Successful results are deeply frozen and share no mutable arrays with caller
  input or internal work arrays.
- The numerical loops emit semantic computation evidence as they execute; no
  renderer or Tutor reconstructs the algorithm from final output.
- A failed run cannot overwrite or partially mutate the latest successful
  session snapshot.
- Successful publication is atomic.
- Exact arithmetic, symbolic classification, and formal singularity proofs are
  not claimed.
- The implementation adds no dependency and uses no `eval`, `new Function`,
  or arbitrary expression evaluation.

## 5. Successful numerical result

A successful pure result contains only the data needed by the planned UI:

- dimension;
- original `A` and `b`;
- computed `xHat`;
- `P`, `L`, and `U`;
- row permutation representation;
- pivot sequence;
- row-swap count;
- residual vector and residual infinity norm;
- original matrix infinity norm and `tauPivot`;
- input fingerprint;
- a complete bounded structured computation trace; and
- approved preset/reference metadata when the input exactly matches a preset.

The result deliberately excludes determinant, inverse, condition number,
backward error, forward-error bounds, and growth-factor claims.

### 5.1 Computation Trace ownership and retention

Computation Trace is numerical evidence owned by the computation that produced
the result. Its records contain operation identities, indices, binary64
numbers, vectors, matrices, and semantic metadata. They do not contain HTML,
Markdown, learner-facing prose, or generated LaTeX as numerical authority. A
later renderer may format this evidence but may not rerun or invent the
algorithm. Tutor may eventually explain current trace evidence, but Tutor is
not computation authority.

Linear Systems is a naturally bounded finite process for `2 <= n <= 6`, so v1
retains every pedagogically meaningful setup, pivot, swap, elimination,
factorization, substitution, residual, and authorized reference-comparison
step. The generic platform policy is:

- retain all meaningful steps for bounded small computations;
- for large repetitive finite computations, retain at most the first five
  sequential computations plus distinct final computation/result evidence;
- for unbounded or infinite processes, retain at most the first five
  sequential computations plus structured continuation metadata and never
  invent a final step; and
- bound trace generation at the numerical producer for future high-step-count
  methods rather than retaining an arbitrary trace for a renderer to slice.

Triangular-solve evidence preserves the released sequential
`value -= product` evaluation. It records ordered contribution products and
each resulting accumulator. A separately accumulated known-term sum is
included only while finite, so trace-only aggregation cannot reject a solve
whose authoritative arithmetic remains finite.

A pivot-threshold failure may expose the valid setup and algorithm evidence
through its rejected pivot selection. It remains a failed outcome and cannot
publish a partial successful result or replace the latest successful session
snapshot.

## 6. Residual and reference semantics

The residual is evaluated against the original input:

\[
r = b - A\widehat{x}, \qquad
\lVert r\rVert_\infty = \max_i |r_i|.
\]

The learner-facing meaning is **equation mismatch**. Product copy must preserve
the distinction

> small residual does not necessarily mean small solution error.

Conditioning is not computed in v1, so neither residual quantity may be
presented as a forward-error estimate or accuracy guarantee.

Only an exact approved preset fingerprint supplies an authoritative `xRef`.
For that case, v1 computes

\[
\lVert \widehat{x} - x_{ref}\rVert_\infty.
\]

The learner-facing label is **Difference from preset reference solution**.
It is not labeled unqualified “exact error.” Custom input has no authoritative
reference quantity.

## 7. Approved presets

Version 1 contains exactly:

1. **Starter 3×3**
   - `A = [[3, 1, -1], [2, 4, 1], [-1, 2, 5]]`
   - `b = [6, 9, -2]`
   - `xRef = [1, 2, -1]`
2. **Row swap required**
   - `A = [[0, 2, 1], [1, -2, -3], [2, 3, 1]]`
   - `b = [0, -3, 1]`
   - `xRef = [1, -1, 2]`

Preset data is deeply immutable. Parsed numerical input determines identity.
Editing a preset makes the session Custom and removes reference authority.
Restoring every numerical input to the exact preset fingerprint restores that
preset and its reference authority.

## 8. Pure session contract

The Day 1 session model owns:

- selected dimension;
- editable decimal/scientific-notation string drafts for `A` and `b`;
- exact preset identity or Custom;
- parsed numerical input fingerprint, or `null` for an invalid draft;
- latest immutable successful result;
- result status `absent`, `current`, or `stale`; and
- pure meaningful-work metadata for later Resume integration.

Draft parsing accepts controlled decimal/scientific numeric literals only and
requires finite results. It is not a mathematical expression language.

Any input edit preserves the latest result and recomputes current/stale status.
Restoring the successful fingerprint makes that result current again. A failed
run returns a pure failure record and the unchanged session. A later successful
run atomically replaces the previous successful result.

Sessions remain current-tab memory only. AppSessionStore and Resume integration
are planned route work, not part of Day 1.

## 9. Planned runtime presentation

The planned complete Lab route is `/linear-algebra/linear-systems`, behind an
independent dynamic route boundary. `/linear-algebra` becomes the module
overview and entry point after the Lab is integrated.

The Data step will provide a keyboard-operable matrix/vector editor for
dimensions 2 through 6 and the two presets. Output will show `xHat` and the
factorization data. Diagnostics will show the residual vector, residual
infinity norm, pivot/row-swap evidence, threshold context, and the optional
preset reference difference.

A later presentation-only renderer will expose the approved trace without
recomputing numerical steps. Its exact interaction, responsive layout, and
accessible formula/table presentation remain Day 2 work.

No chart is required. Matrices, vectors, pivots, and diagnostics use semantic
tables or structured definition-style groups with contained horizontal
scrolling only where necessary.

## 10. Accessibility and responsive requirements

- Every cell has a stable accessible name including symbol and one-based row
  and column.
- Validation summaries and cell-level errors use explicit accessible
  relationships.
- Method, preset, dimension, Run, and reset controls are keyboard operable.
- Focus remains visible and successful/failed announcements use controlled
  live regions.
- Matrix tables remain usable near `390 x 844` without page-level horizontal
  overflow.
- Status and diagnostic meaning never rely on color alone.
- Mathematical display has one accessible text owner.
- Reduced motion is respected; no animation is numerically necessary.

## 11. Tutor and Glossary ownership

Tutor integration is a later separately tested phase. The Linear Algebra Lab
will own a fresh, current-only context assembled from the latest successful
result. Stale, failed, partial, or fingerprint-mismatched evidence must be
excluded. The platform retains transcript and presentation ownership. No chart
instruction is needed for this Lab. Tutor may explain selected trace evidence
but must never generate or replace numerical trace authority.

No Linear Algebra Glossary cards or annotations are part of v1. The complete
Lab route may later expose the existing optional Lab-owned Glossary binding,
but Day 1 and the three-day v1 do not publish unreviewed Linear Algebra terms.

## 12. Learner-facing claim boundary

The product may state that:

- partial pivoting chooses the largest available pivot magnitude in the active
  column under the specified deterministic rule;
- the returned factors satisfy the product convention `P A = L U` up to
  binary64 roundoff;
- the residual measures equation mismatch for the displayed computed
  solution; and
- the preset reference difference compares against the approved preset
  reference vector.

The product must not claim that:

- the pivot threshold formally proves singularity;
- a small residual alone proves an accurate solution;
- conditioning, backward error, or a forward-error bound was computed; or
- one successful finite-precision run establishes a universal stability or
  accuracy guarantee.

## 13. Deliberate v1 non-goals

- Jacobi, Gauss-Seidel, convergence of stationary iterations, or iterative
  refinement;
- determinant, inverse, condition number, backward error, or forward-error
  bound;
- Cholesky or positive-definite-matrix teaching;
- least squares, QR, SVD, eigenvalues, or matrix powers;
- sparse/banded storage, complex data, arbitrary dimensions, multiple right
  sides, or persistent files;
- a Linear Algebra Glossary wave;
- Glossary-to-Tutor handoff or live Tutor-provider migration; and
- PDE, ODE, framework, theme, deployment, or dependency changes.

## 14. Acceptance boundary

Day 1.5 is complete only when the shared trace contract and instrumented pure
Linear Systems path pass focused tests, the accepted Day 1 output values remain
exactly unchanged, trace/session immutability holds, the full existing unit
suite remains green, application typecheck passes, the authorized
documentation is synchronized, and the final diff contains no route, UI,
Tutor, Glossary, ODE, CSS, deployment, dependency, or README change.
