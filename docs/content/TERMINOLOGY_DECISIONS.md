# Terminology Decisions

Status: Version 1 maintainer decisions recorded.

## Decision status

Yiding (Bruce) Tian approved the nine project-language decisions on 2026-07-28.
The completed
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md) and
[Project Language Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md)
are the binding records. The terminology, notation, and teaching-voice
standards are approved as Version 1. Runtime, product copy, the draft Glossary
catalog, and production Glossary content remain separate and unauthorized.

The large table below is retained as a **historical pre-approval evidence
record**. Its `DECISION_REQUIRED` and `PRIORITY_RESOLVED_DRAFT` cells describe
the state in which the comparison was prepared; they are not current decision
statuses and must not override the Version 1 resolution index in this document.

## Historical pre-approval comparison

| ID | Concept | Competing wording or notation | Mathematical significance | Project impact | Draft recommendation | Status | Sources |
|---|---|---|---|---|---|---|---|
| `signed_error_orientation` | signed error orientation | exact minus approximation; approximation minus exact | A sign convention changes formulas but not absolute magnitudes. | Affects Tutor explanations and any future signed-error display. | Keep magnitudes in current product copy; require maintainer choice before publishing a signed convention. | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) |
| `relative_error_denominator` | relative error denominator and zero reference | divide by exact/reference value; scale by a protected or problem-specific reference | The denominator defines the metric and zero-reference behavior. | Affects formula help and validation wording. | Use the exact/reference magnitude only in a draft formula and mark zero handling for decision. | `DECISION_REQUIRED` | NLA-CH03 3.3 (pp. 28-30); CHENEY 2.2 (pp. 41-47) |
| `local_truncation_scaling` | local truncation error scaling | unscaled one-step defect of order h^(p+1); step-normalized defect of order h^p | The two quantities differ by one factor of step size. | Affects Tutor definitions and order statements. | Follow NOTES-2025 unscaled language in draft prose but keep the notation decision open. | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8) |
| `global_error_scope` | scope of global error | signed nodal error; full nodal error vector; final-time magnitude; maximum-over-grid magnitude | These are different mathematical objects and aggregations. | Current Convergence UI exposes final-time and maximum metrics. | Keep the objects separate and require maintainer review for the umbrella term. | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) |
| `error_vs_residual` | error versus residual | difference from a reference solution; failure to satisfy the governing equation | The quantities can behave differently, especially for ill-conditioned problems. | Prevents misleading nonlinear-solver and linear-system diagnostics. | Maintain separate term IDs and cross-link them. | `ALIGNED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH03 3.3 (pp. 28-30); CHENEY 8.5 (pp. 516-523) |
| `conditioning_vs_stability` | conditioning versus algorithmic stability | problem sensitivity; algorithm response to numerical perturbations | One is a property of the mathematical problem; the other is a property of an algorithm. | Project-wide teaching must not blame every error on the algorithm. | Maintain separate terms; draft wording follows the NLA chapter sequence. | `ALIGNED` | NLA-CH03 3.4 (pp. 31-33); CHENEY 2.3 (pp. 48-56) |
| `stability_senses` | distinct meanings of stability | algorithmic numerical stability; ODE absolute stability; multistep zero-stability; dynamical stability of equilibria | The same English word names different mathematical properties. | Glossary triggers and Tutor grounding must resolve a scope-specific sense. | Keep separate IDs and avoid an unqualified standalone definition. | `ALIGNED` | NOTES-2025 outline-007 (pp. 15-15); NLA-CH03 3.4 (pp. 31-33); CHENEY 2.3 (pp. 48-56) |
| `a_stability_boundary` | A-stability and absolute-stability region notation | method-specific amplification factor; general R(z); named or unnamed stability-region symbol | Notation varies while the concepts remain related. | Affects future formulas and accessible text. | Draft R(z) only as a candidate; maintainer notation decision required. | `DECISION_REQUIRED` | NOTES-2025 outline-008 (pp. 16-18) |
| `consistency_convergence` | consistency versus convergence | local method consistency; global convergence under refinement; zero-stability condition | For linear multistep methods these are linked by a theorem but are not synonyms. | Prevents overclaiming in convergence teaching. | Keep separate terms and state theorem dependencies only where reviewed. | `ALIGNED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) |
| `convergence_senses` | meanings of convergence | discretization convergence; iteration convergence; empirical rate estimate | Each has a different limiting process and stopping interpretation. | Tutor and copy must name the process being refined or iterated. | Use qualified phrases instead of bare convergence when context is not immediate. | `ALIGNED` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) |
| `order_senses` | meanings of order | theoretical method order; observed convergence order; polynomial or derivative order | These values answer different questions. | Affects method cards and Convergence results. | Keep theoretical and observed order separate; avoid bare order in cross-domain copy. | `ALIGNED` | NOTES-2025 outline-005 (pp. 9-9); CHENEY 6.7 (pp. 354-358) |
| `observed_order_reliability` | observed order and the asymptotic region | report every finite ratio; report only ratios supported by asymptotic evidence | A finite estimate may be misleading before asymptotic behavior or near roundoff. | Current Convergence classification already exposes reliability states. | Retain current contract; richer term wording requires maintainer review. | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8); NOTES-2025 outline-006 (pp. 10-14); NOTES-2025 outline-014 (pp. 27-32) |
| `step_spacing_senses` | ODE step size versus PDE grid spacing | time-step spacing h; spatial mesh width h or delta x | The same symbol can denote different independent-variable spacings. | Future cross-module notation must be context-specific. | Use h for ODE step size draft; prefer explicit spatial symbols in PDE drafts. | `PRIORITY_RESOLVED_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.5 (pp. 16-17) |
| `exact_approximate` | exact solution versus numerical approximation | model-exact mathematical solution; computed discrete approximation | The words describe different epistemic and mathematical status. | Current labels and Tutor explanations must not blur them. | Maintain the distinction and use approximate-result verbs for computed values. | `ALIGNED` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH07 7.1 (pp. 63-65) |
| `invertible_nonsingular` | invertible, nonsingular, and conditioning | invertible and nonsingular as aliases; well-conditioned as a separate quantitative property | An invertible matrix can still be severely ill-conditioned. | Affects future Linear Algebra copy and solver warnings. | Accept invertible/nonsingular as aliases; never use well-conditioned as an alias. | `PRIORITY_RESOLVED_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH01 1.4 (pp. 6-6); CHENEY 5.4 (pp. 258-268) |
| `pivot_permutation` | pivoting versus permutation | pivot selection operation; permutation matrix recording reordering | Related operations and representation are not identical. | Affects PLU explanations. | Keep distinct terms and link them. | `ALIGNED` | NLA-CH03 3.4 (pp. 31-33); CHENEY 4.3 (pp. 139-160) |
| `lu_plu` | LU versus PLU factorization | factorization without explicit row permutation; factorization with permutation recorded | Existence conditions and algorithms differ. | Future Linear Algebra cards need precise labels. | Keep separate IDs; use PLU where pivoting is part of the represented factorization. | `ALIGNED` | NLA-CH04 4.1 (pp. 35-38) |
| `stiffness_definition` | minimum definition of stiffness | wide disparity of solution time scales; explicit stability restriction relative to accuracy; method-suitability symptom | Each captures a useful aspect but no short phrase is universally complete. | Current Stiff Relaxation guidance must avoid equating stiffness with one method. | Use a two-part draft definition and require maintainer approval. | `DECISION_REQUIRED` | NOTES-2025 outline-007 (pp. 15-15); NLA-CH02 2.5 (pp. 16-17); CHENEY 8.12 (pp. 566-571) |
| `tolerance_scopes` | tolerance scopes | nonlinear iteration stopping tolerance; adaptive ODE error-control tolerance; display precision | The tolerances act on different quantities and algorithms. | Current fixed-step Lab uses nonlinear stopping tolerances, not adaptive control. | Qualify every tolerance by its controlled quantity; defer adaptive terminology. | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH10 10.2 (pp. 96-99) |
| `norm_notation` | vector and matrix norm notation | generic double bars with contextual subscript; explicit named or indexed norm in every formula | Omitted subscripts can hide materially different measures. | Affects accessible formula text and error metrics. | Use explicit subscripts in draft standards; maintainer review for context-based omission. | `PRIORITY_RESOLVED_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH07 7.1 (pp. 63-65) |
| `matrix_vector_typography` | scalar, vector, and matrix typography | plain scalar with bold vectors/matrices; plain variables distinguished only by context | Typography changes readability, especially in systems. | Affects future NLA/PDE notation and Tutor text. | Draft bold lowercase vectors and bold uppercase matrices, pending maintainer review. | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH01 1.1 (pp. 1-1); CHENEY 4.1 (pp. 117-125) |
| `iteration_step_language` | iteration versus numerical step | algorithm iteration; ODE time step; PDE grid index; row-operation step | Bare step can name different state transitions. | Buttons, helper text, and Tutor instructions need unambiguous action language. | Use iteration, time step, grid point, or row operation explicitly. | `ALIGNED` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.5 (pp. 16-17) |
| `poisson_laplace` | Poisson versus Laplace equation | Poisson equation with a source; Laplace equation as the zero-source case | They are related but not interchangeable. | Future PDE copy and Glossary cross-links. | Keep separate terms with a parent-child relation. | `ALIGNED` | NOTES-2025 outline-042 (pp. 70-70); NLA-CH02 2.8 (pp. 21-23); CHENEY 9.9 (pp. 631-635) |
| `explicit_implicit` | explicit versus implicit schemes | new state computed directly; new state defined through an equation to solve | The operational distinction affects cost and stability behavior. | Current ODE and future PDE teaching. | Keep separate and avoid claiming implicit automatically means stable or accurate. | `ALIGNED` | NOTES-2025 outline-008 (pp. 16-18); CHENEY 9.1 (pp. 572-579) |
| `svd_naming` | SVD terminology | full name first; abbreviation first | Mostly a teaching and abbreviation choice. | Future Linear Algebra content. | Use full name followed by SVD on first occurrence. | `PRIORITY_RESOLVED_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH09 9.3 (pp. 87-87); CHENEY 5.4 (pp. 258-268) |
| `error_source_layers` | model, discretization, and roundoff error | model assumptions; continuous-to-discrete approximation; finite-precision arithmetic | The three discrepancies arise at different stages and require different remedies. | Project explanations should identify whether a limitation comes from the model, discretization, or arithmetic. | Maintain separate term IDs and cross-link them in error overviews. | `ALIGNED` | NOTES-2025 outline-001 (pp. 1-2); NLA-CH03 3.3 (pp. 28-30); CHENEY 2.1 (pp. 28-40) |

## Aligned distinctions

- `error_vs_residual` — error versus residual
- `conditioning_vs_stability` — conditioning versus algorithmic stability
- `stability_senses` — distinct meanings of stability
- `consistency_convergence` — consistency versus convergence
- `convergence_senses` — meanings of convergence
- `order_senses` — meanings of order
- `exact_approximate` — exact solution versus numerical approximation
- `pivot_permutation` — pivoting versus permutation
- `lu_plu` — LU versus PLU factorization
- `iteration_step_language` — iteration versus numerical step
- `poisson_laplace` — Poisson versus Laplace equation
- `explicit_implicit` — explicit versus implicit schemes
- `error_source_layers` — model, discretization, and roundoff error

## Source-priority draft resolutions

- `step_spacing_senses` — ODE step size versus PDE grid spacing
- `invertible_nonsingular` — invertible, nonsingular, and conditioning
- `norm_notation` — vector and matrix norm notation
- `svd_naming` — SVD terminology

## Approved Version 1 resolution index

The dependency order remains useful for review, but all nine decisions are now
`MAINTAINER_APPROVED_V1`; none is deferred.

| Review order | ID | Recorded choice | Binding result | Approved by/date |
|---:|---|---|---|---|
| 1 | `signed_error_orientation` | Option A | \(e_n=u_n-y(t_n)\); absolute aggregates retain their released formulas | Yiding (Bruce) Tian, 2026-07-28 |
| 2 | `global_error_scope` | Option A | Propagated nodal-error family; every concrete scalar names its node or aggregation | Yiding (Bruce) Tian, 2026-07-28 |
| 3 | `local_truncation_scaling` | Option A | Unscaled LTE is \(O(h^{p+1})\); divided quantity is the step-normalized local defect \(O(h^p)\) | Yiding (Bruce) Tian, 2026-07-28 |
| 4 | `observed_order_reliability` | Option A | Metric, adjacent pair, value, and status travel together; only reliable values drive the primary summary | Yiding (Bruce) Tian, 2026-07-28 |
| 5 | `a_stability_boundary` | Custom Option AB | \(z=h\lambda\), \(u_{n+1}=R(z)u_n\), \(\mathcal S=\{z\in\mathbb C:|R(z)|\le1\}\), and \(\{z\in\mathbb C:\operatorname{Re}(z)\le0\}\subseteq\mathcal S\) | Yiding (Bruce) Tian, 2026-07-28 |
| 6 | `stiffness_definition` | Option A | Fast and slow behavior plus a stability-driven step restriction; plain-first teaching modifier | Yiding (Bruce) Tian, 2026-07-28 |
| 7 | `relative_error_denominator` | Option A | Nonzero reference magnitude; unavailable at zero; percent is \(100\%\) | Yiding (Bruce) Tian, 2026-07-28 |
| 8 | `tolerance_scopes` | Option A | Always name the algorithm and controlled quantity; adaptive wording reserved | Yiding (Bruce) Tian, 2026-07-28 |
| 9 | `matrix_vector_typography` | Option A | Italic lowercase scalars/vectors and italic uppercase matrices; prose and dimensions authoritative | Yiding (Bruce) Tian, 2026-07-28 |

## Distinctions that must not be collapsed

- error and residual;
- conditioning and algorithmic stability;
- algorithmic stability, ODE absolute stability, multistep zero-stability, and equilibrium stability;
- consistency and convergence;
- theoretical and observed order;
- local truncation, nodal global, final-time, and maximum global error;
- ODE time-step size and PDE grid spacing;
- invertibility and good conditioning;
- LU and PLU factorization;
- model, discretization, and roundoff error.

## Approval boundary

The completed
[Project Language Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md)
confirms this documentation-only gate. It promotes standards but does not
rewrite product copy, reconcile the Glossary catalog or copy audit, add
Glossary content, or change runtime.
