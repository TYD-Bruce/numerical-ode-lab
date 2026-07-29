# Numerical T-Lab Notation Standard v1

Status: Maintainer-approved language standard.

Runtime/content implementation tracked separately.

Approved by Yiding (Bruce) Tian on 2026-07-28 through the nine decisions
recorded in the
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md). This standard
governs project notation. It does not alter a released formula, solver,
tolerance, metric, classification, or production surface.

## Purpose and scope

This document defines the Version 1 notation used when Numerical T-Lab
documentation and future content describe cross-cutting numerical analysis,
scalar fixed-step ODEs, and foundational linear-algebra objects. Symbols remain
context-sensitive: a symbol must be introduced before use, and prose or
dimensions—not typography alone—must identify its mathematical type.

## General conventions

- Scalars and vectors use italic lowercase variables, such as \(a\), \(h\),
  \(x\), and \(u_n\).
- Matrices use italic uppercase variables, such as \(A\).
- Do not mix bold and plain styles to distinguish vectors or matrices.
- Identify a scalar, vector, matrix, function, grid, or sequence in prose and,
  when useful, by dimensions.
- Use subscripts on norms when the choice affects interpretation.
- Distinguish exact quantities, numerical approximations, signed errors,
  absolute error metrics, and residuals.
- State the refinement variable, metric, and refinement pair before
  interpreting observed order.
- Define each stability symbol and qualify it by method when more than one
  method is present.
- Keep display notation and accessible text semantically aligned.

## Exact and approximate ODE quantities

For the scalar fixed-step ODE context:

\[
y(t) \quad\text{is the exact solution},\qquad
u_n \approx y(t_n) \quad\text{is the numerical approximation},
\]

\[
t_n=t_0+nh,\qquad h>0.
\]

Here, \(h\) is the ODE time-step size. A PDE spatial grid spacing uses
\(\Delta x\), \(\Delta y\), or directional symbols such as \(h_x\) and \(h_y\)
when time and space occur together.

## Signed nodal and global error

Numerical T-Lab uses the signed nodal-error orientation

\[
e_n=u_n-y(t_n).
\]

The symbol \(e_n\) belongs to the propagated nodal-error family. “Global
error” names that family, not one universal aggregate and not a quantity called
“total error.” Concrete reported scalars use separate, explicit names:

\[
E_{\mathrm{final}}(h)=\left|u_N-y(t_{\mathrm{end}})\right|,
\]

\[
E_{\infty}(h)=\max_n\left|u_n-y(t_n)\right|.
\]

These absolute aggregates do not inherit the sign of \(e_n\). A residual is a
separate equation defect and must not be presented as solution error.

## Absolute and relative error

For an approximation \(q_{\mathrm{approx}}\) and stated reference
\(q_{\mathrm{ref}}\),

\[
E_{\mathrm{abs}}
=\left|q_{\mathrm{approx}}-q_{\mathrm{ref}}\right|.
\]

When \(q_{\mathrm{ref}}\ne0\),

\[
E_{\mathrm{rel}}
=\frac{\left|q_{\mathrm{approx}}-q_{\mathrm{ref}}\right|}
       {\left|q_{\mathrm{ref}}\right|}.
\]

Relative error is unavailable when the reference is zero. In that case,
report absolute error or define a separately named scaled error. Percent error
is \(100\%\,E_{\mathrm{rel}}\) and inherits the same nonzero-reference
requirement. Normwise relative error must name the norm.

## Local truncation error

For an order-\(p\) ODE method, “local truncation error” means the unscaled
one-step defect obtained by inserting exact data into the discrete update:

\[
\tau_{n+1}=O(h^{p+1}).
\]

The defining update-specific expression must accompany the symbol when it is
introduced. Dividing that defect by \(h\) produces the distinct
step-normalized local defect:

\[
\frac{\tau_{n+1}}{h}=O(h^p).
\]

Do not call both normalizations “local truncation error” without qualification.
PDE spatial truncation-error notation and scaling remain module-specific and
are not set by this ODE convention.

## Theoretical and observed order

Theoretical order is denoted by \(p\). For a named positive error metric
\(E\), step size \(h\), and refinement ratio \(r>1\), the adjacent-refinement
estimate is

\[
p_{\mathrm{obs}}
=\frac{\log\!\bigl(E(h)/E(h/r)\bigr)}{\log r}.
\]

Binary refinement uses \(r=2\). Every displayed estimate must remain associated
with:

- the named error metric;
- the adjacent refinement pair;
- the finite value, when available; and
- its evidence status.

Useful finite values may be displayed, but only values classified as reliable
by the released Convergence contract may drive the primary summary.
Reliability is finite experimental evidence, not proof that an asymptotic
region has been reached. Prefer reliable evidence from the asymptotic region
when the available experiment supports that interpretation. This standard
does not alter released reliability statuses, precedence, or classification.

## Absolute stability and A-stability

Use the scalar test equation

\[
y'=\lambda y
\]

and define the scaled parameter

\[
z=h\lambda.
\]

For a stated time-stepping method, define its stability function by

\[
u_{n+1}=R(z)u_n.
\]

Its absolute-stability region is denoted by

\[
\mathcal S
=\left\{z\in\mathbb C:\left|R(z)\right|\le1\right\}.
\]

A method is A-stable when

\[
\left\{z\in\mathbb C:\operatorname{Re}(z)\le0\right\}
\subseteq \mathcal S.
\]

The boundary is included. Say “the closed nonpositive half-plane is contained
in the absolute-stability region”; do not replace the set relation with vague
claims such as “very stable” or “stable for every problem.” When several
methods share a surface, qualify the symbols, for example \(R_M\) and
\(\mathcal S_M\).

## Tolerance naming

Never use an unqualified “solver tolerance.” Name both the algorithm and the
controlled quantity. Current preferred names are:

- nonlinear update tolerance;
- nonlinear residual tolerance;
- exact-solution consistency tolerance; and
- Convergence interpretation tolerance.

“Adaptive error-control tolerance” is reserved for a future adaptive method
and is not a current runtime capability. A tolerance is not an accuracy
guarantee and must not be substituted for a global-error metric.

## Linear-algebra notation

Use plain italic variables and declare object types:

\[
Ax=b,
\]

where \(A\) is a matrix and \(x\) and \(b\) are vectors. Examples include

\[
r=b-A\widehat{x},
\qquad
\lVert x\rVert_p,
\qquad
\lVert A\rVert_p,
\]

and, for an invertible matrix under a stated induced norm,

\[
\kappa_p(A)=\lVert A\rVert_p\lVert A^{-1}\rVert_p.
\]

The residual orientation above is a future Linear Algebra content convention;
it does not change current runtime behavior.

## Other aligned conventions

| Topic | Version 1 convention | Boundary |
|---|---|---|
| Grid indices | \(n\) for time and \(i,j\) for space | State when another index denotes an algorithm iteration |
| Derivatives | \(y'(t)\), \(y''(t)\), and variable-explicit partial derivatives | Dot notation requires a declared time variable |
| Finite differences | Name forward, backward, or central difference and show its stencil | Do not use one unqualified stencil name |
| QR factorization | \(A=QR\), with dimensions and reduced/full form stated | Future Linear Algebra content |
| Singular value decomposition | \(A=U\Sigma V^T\) for real data, with dimensions and form stated | Use conjugate transpose when the field requires it |

The row-permuted LU orientation remains a future, module-specific decision.
Until that decision is made, state the permutation orientation wherever a
factorization is shown. It is not one of the nine Version 1 project-language
decisions.

## Context and migration boundaries

- Error compares an approximation with a reference; a residual measures
  failure to satisfy an equation.
- Conditioning, algorithmic numerical stability, ODE absolute stability,
  zero-stability, and equilibrium stability remain distinct.
- Stiffness is a problem property involving fast and slow behavior plus a
  stability-driven step restriction; it is not defined by \(R\) or
  \(\mathcal S\) alone.
- Source identifiers and locator syntax are evidence metadata, not runtime
  notation.
- Existing solver coefficients, evaluation order, grid rules, budgets,
  tolerances, error metrics, Convergence classifications, and Tutor contracts
  remain unchanged.
- Production copy, accessible formulas, and Glossary content require a
  separate reconciliation and implementation plan with focused tests and
  browser review.
