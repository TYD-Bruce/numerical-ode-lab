# Numerical Notation Standard

Status: Private-source-reviewed draft; maintainer approval pending.

## Purpose and scope

This document proposes a coherent notation foundation for Numerical T-Lab. It
is a review draft, not a production contract. Existing numerical contracts and
implemented formulas remain unchanged until a separate maintainer-authorized
migration.

Notation is context-sensitive. The draft does not force one symbol to carry
the same meaning across linear algebra, ODEs, PDEs, approximation, and
iteration when those contexts describe different mathematical objects.

## General principles

- Define every symbol before relying on it.
- Distinguish exact quantities, numerical approximations, errors, and residuals.
- Put a subscript on a norm when the choice affects interpretation.
- State the refinement variable before discussing convergence or order.
- Use qualified stability terms.
- Preserve conventional domain notation when it avoids unnecessary cognitive
  translation.
- Keep display notation and accessible text synchronized.

## Draft conventions

| Topic | Draft convention | Context | Competing convention | Evidence rationale | Project migration impact | Decision status |
|---|---|---|---|---|---|---|
| Scalars | Italic lowercase, such as \(a\), \(h\), \(t\), \(x\), or \(y\) | All modules | Plain or context-only typography | Separates scalar quantities from future vector and matrix state | Low for current scalar ODE UI; documentation and accessible text review | `PRIORITY_RESOLVED_DRAFT` |
| Vectors | Bold lowercase, such as \(\mathbf{x}\) or \(\mathbf{u}_n\) | Linear Algebra, systems of ODEs, PDE state vectors | Arrow notation or plain lowercase | Visually separates component collections from scalars | Future-facing; current scalar ODE formulas stay scalar | `DECISION_REQUIRED` |
| Matrices | Bold uppercase, such as \(\mathbf{A}\) | Linear Algebra and systems | Plain uppercase | Pairs naturally with bold vector notation | Future-facing; current source identifiers are unaffected | `DECISION_REQUIRED` |
| Linear systems | \(\mathbf{A}\mathbf{x}=\mathbf{b}\) | Linear Algebra and algebraic subproblems | \(Ax=b\) without typographic distinction | Makes object types visible to beginners | Future copy and formula migration only | `DECISION_REQUIRED` |
| Exact scalar solution | \(y(t)\) | Scalar ODE | \(x(t)\), \(u(t)\), or problem-specific symbols | Matches the implemented first-order ODE teaching boundary | Current display mostly aligned; audit generic Output labels | `PRIORITY_RESOLVED_DRAFT` |
| Numerical ODE approximation | \(u_n\approx y(t_n)\) | Scalar fixed-step ODE | \(y_n\), \(Y_n\), or \(x_n\) | Keeps exact function and computed sequence visibly distinct | Current Convergence teaching is largely aligned; generic result labels need review | `PRIORITY_RESOLVED_DRAFT` |
| Time grid | \(t_n=t_0+nh\) | Fixed-step ODE | \(x_n=x_0+nh\) or \(\Delta t\)-only notation | Supported across the primary corpus and current numerical contract | Low; preserve the released fixed-grid rule | `PRIORITY_RESOLVED_DRAFT` |
| ODE step size | \(h>0\) | ODE time stepping | \(\Delta t\) | Primary-source preference and current Convergence formulas use \(h\) | Audit Run labels that currently show equivalent forms | `PRIORITY_RESOLVED_DRAFT` |
| Spatial grid spacing | \(\Delta x\), \(\Delta y\), or \(h_x\), \(h_y\) when multiple directions matter | PDE | Reusing unqualified \(h\) everywhere | Avoids confusing time-step and spatial-spacing roles | Future PDE module only | `PRIORITY_RESOLVED_DRAFT` |
| Grid index | Integer subscripts \(n\) for time and \(i,j\) for space | ODE/PDE | Context-free \(k\) for every index | Keeps iteration count and grid location distinguishable | Future PDE and iterative-solver copy | `PRIORITY_RESOLVED_DRAFT` |
| Absolute error | \(E_{\mathrm{abs}}=|q_{\mathrm{approx}}-q_{\mathrm{ref}}|\) | Cross-cutting reporting | Signed error presented as “absolute error” | Magnitude is invariant under the unresolved signed-error orientation | Current metric copy can align without numerical change | `ALIGNED` |
| Signed nodal error | Declare either \(e_n=u_n-y(t_n)\) or its negative before use | ODE analysis | Assuming the sign from context | Source conventions differ, while magnitudes do not | No production signed-error display until reviewed | `DECISION_REQUIRED` |
| Relative error | \(E_{\mathrm{rel}}=|q_{\mathrm{approx}}-q_{\mathrm{ref}}|/|q_{\mathrm{ref}}|\) only when the reference denominator is valid | Cross-cutting | Protected denominator or percent-only definition | Makes the reference quantity and zero limitation explicit | Future helper/error text requires a zero-reference policy | `DECISION_REQUIRED` |
| Linear-system residual | \(\mathbf{r}=\mathbf{b}-\mathbf{A}\widehat{\mathbf{x}}\) | Linear Algebra | Opposite sign | Residual must be separate from solution error; sign has little effect on norm-only reporting | Future Linear Algebra diagnostics | `PRIORITY_RESOLVED_DRAFT` |
| Nonlinear residual | \(G(\widehat{u})\) with the stopping test stated separately | Implicit scalar solves | Calling the update or solution error a residual | Matches the current algebraic solve boundary without changing tolerances | Copy-only future clarification; numerical contract unchanged | `PRIORITY_RESOLVED_DRAFT` |
| Local truncation error | Show the defining one-step defect and state whether it is divided by \(h\) | ODE methods | Unqualified \(O(h^{p+1})\) or \(O(h^p)\) claims | Sources use both unscaled and step-normalized conventions | Tutor and Glossary wording blocked pending review | `DECISION_REQUIRED` |
| Global ODE error | \(e_n=u_n-y(t_n)\) for a declared sign; aggregate metrics receive separate symbols | ODE convergence | Calling endpoint or maximum error simply “the global error” | Separates nodal, endpoint, and maximum objects | Current Convergence labels should remain metric-specific | `DECISION_REQUIRED` |
| Final-time error | \(E_{\mathrm{final}}(h)=|u_N-y(t_{\mathrm{end}})|\) | Current Convergence Study | Endpoint error without a defined endpoint | Matches the released numerical contract | No numerical change; terminology-only audit | `ALIGNED` |
| Maximum global error | \(E_\infty(h)=\max_n|u_n-y(t_n)|\) | Current Convergence Study | RMS or endpoint metric under the same symbol | Matches the released numerical contract and names the aggregation | No numerical change | `ALIGNED` |
| Vector norms | \(\|\mathbf{x}\|_p\), with \(p\) explicit when material | Linear Algebra and systems | Bare double bars | Prevents silent switching among Euclidean, maximum, and other norms | Future modules and accessible text | `PRIORITY_RESOLVED_DRAFT` |
| Matrix norms | \(\|\mathbf{A}\|_p\) for induced norms; \(\|\mathbf{A}\|_F\) for Frobenius norm | Linear Algebra | Bare double bars or \(|A|\) | Distinguishes induced and entrywise constructions | Future Linear Algebra module | `PRIORITY_RESOLVED_DRAFT` |
| Condition number | \(\kappa_p(\mathbf{A})=\|\mathbf{A}\|_p\|\mathbf{A}^{-1}\|_p\) when \(\mathbf{A}\) is invertible | Linear Algebra | Unsubscripted \(\kappa\) without a norm | The norm choice is part of the quantity | Future Linear Algebra module | `PRIORITY_RESOLVED_DRAFT` |
| Derivatives | \(y'(t)\), \(y''(t)\), and partial-derivative notation appropriate to PDEs | ODE/PDE | Dot notation without a declared time variable | Keeps independent variables explicit | Current ODE formulas mostly aligned | `PRIORITY_RESOLVED_DRAFT` |
| Finite differences | Name forward, backward, or central difference and display its stencil | Approximation/PDE | Calling every stencil “the finite difference” | Direction and accuracy depend on the stencil | Future content only | `ALIGNED` |
| Theoretical order | \(p\) | Method metadata and analysis | “Order” without qualification | Matches current method metadata while keeping observed order separate | Current method cards largely aligned | `PRIORITY_RESOLVED_DRAFT` |
| Observed order | \(p_{\mathrm{obs}}=\log(E(h)/E(h/r))/\log r\), with \(r=2\) for binary refinement | Convergence experiments | A base-two formula presented as universal | Preserves the current halving case and exposes the general refinement ratio | Formula wording only; classification contract unchanged | `DECISION_REQUIRED` |
| Stability test equation | \(y'=\lambda y\), \(z=h\lambda\) | ODE absolute stability | Different dependent-variable letters | The object is standard; letter choice is notation-only | Future Glossary/Tutor formula | `PRIORITY_RESOLVED_DRAFT` |
| Stability function | \(R(z)\) only after defining it for the method | ODE absolute stability | Method-specific amplification factors without a named function | A general symbol aids comparison but is not uniform across sources | Blocked pending maintainer notation review | `DECISION_REQUIRED` |
| Stability region | \(\mathcal{S}=\{z:|R(z)|\le 1\}\) as a candidate | ODE absolute stability | Other region symbols or an unnamed set | Makes the set explicit; the symbol itself varies | Blocked pending maintainer notation review | `DECISION_REQUIRED` |
| Factorizations | \(\mathbf{P}\mathbf{A}=\mathbf{L}\mathbf{U}\) for a row-permuted LU convention, with the permutation orientation declared | Linear Algebra | \(\mathbf{A}=\mathbf{P}\mathbf{L}\mathbf{U}\) or \(\mathbf{A}=\mathbf{P}^{T}\mathbf{L}\mathbf{U}\) | Equivalent conventions move the permutation and cannot be mixed silently | Future Linear Algebra plan must choose one orientation | `DECISION_REQUIRED` |
| QR factorization | \(\mathbf{A}=\mathbf{Q}\mathbf{R}\), with dimensions and reduced/full form stated | Linear Algebra | Unqualified “QR decomposition” | Dimensions affect uniqueness and storage | Future Linear Algebra module | `PRIORITY_RESOLVED_DRAFT` |
| SVD | \(\mathbf{A}=\mathbf{U}\boldsymbol{\Sigma}\mathbf{V}^{T}\) over real data, with dimensions stated | Linear Algebra | \(\mathbf{V}^{*}\) or economy-size factors without context | Transpose/conjugate transpose and shape depend on the field and form | Future Linear Algebra module | `PRIORITY_RESOLVED_DRAFT` |

## Context rules

### ODE and PDE spacing

An ODE time step and a PDE spatial grid spacing may both be denoted by \(h\) in
source material. Numerical T-Lab should qualify the quantity in prose and use
directional spatial symbols when both time and space appear together.

### Error and residual

Error compares an approximation with a reference quantity. A residual measures
failure to satisfy an equation. A small residual does not automatically imply a
small solution error; conditioning controls part of that relationship.

### Stability

The draft never uses one formula as the definition of every stability sense.
Algorithmic numerical stability, ODE absolute stability, multistep
zero-stability, and stability of equilibria retain separate term IDs and
context.

## Migration rule

No notation in this draft changes a released solver coefficient, evaluation
order, tolerance, grid rule, error metric, Convergence classification, Tutor
contract, accessible formula, or user-facing label. Each production migration
requires a separate copy/formula plan, focused tests, accessible-text review,
and browser verification.
