# Linear Systems Teaching v2 Design

**Status:** Maintainer-approved; Phase 0 complete with Outcome B (Hybrid
accepted); Phase 1 trace snapshot extension implemented and locally verified;
independent Phase 1 audit required before Phase 2

**Date:** 2026-08-11

**Starting implementation checkpoint:** `4f6c5810c41dbc0342c5e44ce1946478cbb2795f`
(tree `4f2fb65e4b270728e09e97bd578543b1f61772bb`)

## 1. Decision and scope

### Phase 0 capability decision

The real-route capability spike completed after design approval and selects
**Outcome B — Hybrid accepted**. Native MathML is approved for authored
mathematical atoms: over-accents, matrices and column vectors, fractions,
subscripts/superscripts, norms, scientific notation, and compact algebra.
Controlled semantic DOM/CSS remains responsible for larger composition such
as before/operation/after transformation flow and arrow geometry. This keeps
the mathematical objects stable while allowing horizontal desktop and
vertical narrow-screen arrangements.

The decision is capability approval, not product adoption. The DEV-only spike
does not replace the current Linear Systems presentation. Phase 1 now extends
the authoritative trace with bounded matrix snapshots and explicit `P b`
evidence; Phase 2 Teaching v2 integration remains separately gated.

### Phase 1 trace decision

The single numerical path now emits `factorization_start.initialU`, complete
`uBefore`/`uAfter` snapshots on every row swap and elimination, and one
`right_hand_side_permutation` record copied from the exact `permutedB` used by
forward substitution. The snapshots are deeply immutable and chained in
actual operation order. Current product UI intentionally does not render the
two new standalone step kinds; that presentation belongs to Phase 2.

The current Linear Systems Lab is an engineering-correct checkpoint, not a
teaching-complete product. It solves the approved problem, preserves numerical
authority, exposes immutable computation evidence, and meets the existing
correctness/accessibility gates. Direct maintainer browser review nevertheless
found that the learner-facing surface does not yet satisfy **Theory · Tools ·
Teaching**.

Teaching v2 redesigns the learner contract before further product work. It
does not implement UI, alter the released Gaussian-elimination arithmetic,
change the pivot safeguard, add a method, publish a Glossary wave, or begin
Tutor work.

The Visual + Motion Language v1 implementation remains a useful local
checkpoint. Its final acceptance is paused because Teaching v2 changes the
computation presentation on which row-swap and elimination replay are mounted.
The motion contract, controller ownership, cancellation rules, tokens, and
trace-authority boundary remain valid unless a later implementation exposes a
specific conflict.

## 2. Maintainer blocker ledger

| ID | Confirmed problem | Teaching v2 decision |
|---|---|---|
| `LS-TEACH-01` | The computed solution is a semantic table with a visually weak, poorly placed `x` hat instead of a typeset vector equation. | Present `\hat{x}` and its column vector as one mathematical display with an actual over-accent and matrix delimiters. |
| `LS-TEACH-02` | Matrix scale and `Number.EPSILON` dominate the beginning of the walkthrough. | Start with the system and Gaussian-elimination sequence. Move matrix scale and the pivot threshold to a closed **Solver safeguard details** disclosure. Use `\varepsilon` in learner mathematics; the JavaScript identifier belongs only in a nested implementation detail. |
| `LS-TEACH-03` | The walkthrough describes operations and shows changed rows, but does not show the full matrix transformations that constitute the computation. | For every row swap and elimination, show full authoritative `U` before, the row operation, and full authoritative `U` after. Extend the numerical trace minimally where full snapshots are absent. |
| `LS-TEACH-04` | Diagnostics compresses several relationships into one difficult arrow chain and gives scale/threshold evidence primary weight. | Use separate blocks for `A\hat{x}`, `r=b-A\hat{x}`, `r`, and `\lVert r\rVert_\infty`; follow with interpretation, qualified preset comparison, and closed safeguard details. |
| `LS-TEACH-05` | The Method surface names one runnable algorithm but does not teach the problem, roles, method families, or algorithm framework. | Make the Method step a visible conceptual foundation: `A`, `x`, `b`; linear system; direct versus iterative; Gaussian elimination, pivots, row operations, PLU, triangular solves, residual, conditioning boundary, and singular/near-singular language. Glossary remains supplementary. |

The previous audits were scoped to numerical correctness, lifecycle,
accessibility structure, mathematical notation policy, and motion behavior.
They did not claim to validate curriculum completeness, full equation
typesetting, or whether the walkthrough visually demonstrated the algorithm.

## 3. Evidence and terminology boundary

The design used the bounded KnowledgeBase route:

```text
Knowledge/mathematics/numerical-analysis/INDEX.md
→ linear-systems-and-direct-methods/INDEX.md
→ linear-systems-and-direct-methods/CONCEPT.md
→ linear-systems-and-direct-methods/NOTATION_CROSSWALK.md
→ eigenvalues-svd-and-iterative-methods/INDEX.md
→ eigenvalues-svd-and-iterative-methods/CONCEPT.md
→ eigenvalues-svd-and-iterative-methods/NOTATION_CROSSWALK.md
→ floating-point-and-numerical-reliability/INDEX.md
→ floating-point-and-numerical-reliability/CONCEPT.md
→ floating-point-and-numerical-reliability/NOTATION_CROSSWALK.md
→ NUMERICAL_T_LAB_CROSSWALK.md
```

Project-language cross-checks used
`docs/content/NUMERICAL_TERMINOLOGY_STANDARD.md` and
`docs/content/GLOSSARY_CATALOG.md`.

The KnowledgeBase packages are retrieval-ready but explicitly non-production;
most Linear Algebra concept pages still require review. Existing project term
IDs and draft definitions therefore constrain names and distinctions, while
the compact copy below remains proposed Lab teaching copy until this design is
approved. No private source, locator, quotation, or extraction artifact is
promoted into the product repository.

## 4. Learner outcome

After one complete run, a learner should be able to explain:

1. how `A x = b` represents a linear system and what `A`, `x`, and `b` mean;
2. how a direct method differs operationally from an iterative method;
3. how Gaussian elimination uses pivots, row swaps, and elimination
   multipliers to create an upper-triangular system;
4. how the recorded permutations and multipliers produce `P A = L U`;
5. why forward substitution proceeds top-to-bottom and backward substitution
   bottom-to-top;
6. what the computed vector `\hat{x}` is;
7. how the product computes `A\hat{x}`, then the residual
   `r=b-A\hat{x}`, then `\lVert r\rVert_\infty`; and
8. why a small residual is equation-mismatch evidence rather than proof of a
   small solution error.

## 5. Teaching-term matrix

“Visible” means the concept must be explained directly in the Lab. “Future
Glossary” means a later reviewed Linear Algebra content wave may bind the
term; this design publishes no Glossary content.

| Term / project ID | Proposed compact learner definition | Prerequisite | First visible location | Visible | Future Glossary | Readiness |
|---|---|---|---|---|---|---|
| linear system / `linear_system` | A collection of linear equations written compactly as `A x = b`, with `A` a matrix and `x,b` vectors. | matrix, vector | Method: What are we solving? | Yes | Yes | Canonical ID and module draft exist; KB page review required. |
| coefficient matrix / no ID | `A` contains the coefficients that multiply the unknown components. | linear system | Method roles; repeated in Data | Yes | Not until ID decision | Safe role copy; not a canonical term ID. |
| unknown vector / no ID (`vector` supplies the object term) | `x` is the vector of values the system asks us to find; `\hat{x}` is the computed approximation. | vector | Method roles; Output | Yes | Bind `vector` only after review | Role phrase has no standalone ID. |
| right-hand side / no ID | `b` is the known vector on the right side of the equations. | vector | Method roles; Data | Yes | Not until ID decision | Explicit catalog gap; use as local role copy only. |
| matrix / `matrix` | A rectangular array of scalars representing the coefficients or a linear transformation. | scalar | Method roles | Yes | Yes | Canonical ID and module draft; KB page review required. |
| vector / `vector` | An ordered collection of scalar components; dimensions and prose identify its role. | scalar | Method roles | Yes | Yes | Canonical ID and module draft; KB page review required. |
| direct method / no ID | A method that transforms or factorizes the finite system and then solves the resulting simpler systems. | linear system | Method family comparison | Yes | Not until ID decision | Concept-guide family, no standalone catalog ID. |
| iterative method / no ID (`stationary_iteration` is narrower) | A method that starts from an approximation and produces successive approximations until a stated stopping rule is met. | linear system | Method family comparison | Yes | Not as a generic term yet | Generic umbrella is deferred; exact convergence claims require review. |
| Gaussian elimination / `gaussian_elimination` | A direct procedure that uses row operations to reduce the system to upper-triangular form. | row operation, pivot | Selected method | Yes | Yes | Canonical ID and module draft; current numerical contract supplies exact product behavior. |
| pivot / `pivot` | The active entry used to eliminate entries below it in the current column. | matrix entry | Algorithm outline; walkthrough | Yes | Yes | Canonical ID and module draft; KB page review required. |
| partial pivoting / `partial_pivoting` | At each active column, compare available magnitudes, select the first largest one, and swap rows when needed. | pivot, row swap | Selected method; walkthrough | Yes | Yes | Canonical ID plus exact released tie rule. |
| row operation / `row_operation` | A permitted transformation of rows used to produce an equivalent linear system. | linear system | Algorithm outline; transformation arrow | Yes | Yes | Canonical ID and module draft; KB page review required. |
| elimination multiplier / no ID | `m_{ik}=U_{ik}/U_{kk}` is the scale factor used when subtracting the pivot row from a target row. | pivot, row operation | First elimination | Yes | Not until ID decision | Formula is owned by the approved algorithm/trace; no standalone ID. |
| PLU factorization / `plu_factorization` | `P A = L U` records row permutations in `P`, elimination multipliers in unit lower-triangular `L`, and the final upper-triangular matrix in `U`. | Gaussian elimination | Method outline; Output | Yes | Yes | Canonical ID and module draft; factor convention fixed by numerical contract. |
| permutation matrix / `permutation_matrix` | `P` records how rows were reordered; multiplying by `P` applies that ordering. | row swap | First swap; factor result | Yes | Yes | Canonical ID and module draft; KB page review required. |
| lower-triangular matrix / no ID | A square matrix with zero entries above its diagonal. | matrix | Before forward substitution | Yes | Not until ID decision | No catalog ID; local structural copy only. |
| upper-triangular matrix / no ID | A square matrix with zero entries below its diagonal. | matrix | Elimination goal; before backward substitution | Yes | Not until ID decision | No catalog ID; local structural copy only. |
| forward substitution / no ID | Solve a lower-triangular system from the first row downward because each row uses only already known earlier components. | lower triangular | Forward-substitution phase | Yes | Not until ID decision | Direct-method concept family supports it; no catalog ID. |
| backward substitution / no ID | Solve an upper-triangular system from the last row upward because each row uses already known later components. | upper triangular | Backward-substitution phase | Yes | Not until ID decision | Direct-method concept family supports it; no catalog ID. |
| residual / `residual` | `r=b-A\hat{x}` measures how closely the computed vector satisfies the original equations. It is not solution error. | computed solution, matrix-vector product | Diagnostics | Yes | Yes | Core project language and curated distinction exist; Glossary rich copy still unreviewed. |
| conditioning / `conditioning` | Conditioning describes how sensitive the solution is to small changes in the problem data. | residual versus error | Diagnostics interpretation | Yes, compact boundary | Yes | Curated qualitative claim exists; no condition number or bound is authorized. |
| singular matrix / `singular_matrix` | A square matrix is singular when it is not invertible. The Lab’s pivot safeguard may also stop near this boundary without proving singularity. | invertibility | Failure explanation; advanced safeguard | Yes | Yes | Canonical ID and module draft; keep exact singularity separate from threshold rejection. |

The terms `condition_number`, `forward_error`, and `backward_error` may appear
only as clearly deferred concepts. Teaching v2 does not compute or display
their values.

## 6. Algorithm framework map

| Canonical method | Family | Core idea | Applicability / assumptions at this gate | KB readiness | Visible framework | Runnable now | Trace / walkthrough need | Relative effort |
|---|---|---|---|---|---|---|---|---|
| Gaussian elimination with partial pivoting | Direct elimination | Select an active-column pivot, swap rows, and eliminate below it. | Current approved dense real square `2 <= n <= 6` contract; finite binary64 arithmetic and pivot safeguard. | `gaussian_elimination`, `partial_pivoting`, `pivot`, and `row_operation` route cleanly; exact behavior is product-owned. | Primary selected method | Yes | Full bounded matrix snapshots plus existing pivot/multiplier evidence | M teaching/trace pass |
| PLU factorization | Direct factorization / result of elimination | Record permutations and multipliers so `P A = L U`. | Same current contract and convention. | Canonical IDs exist; review required for future Glossary copy. | Primary framework/result | Not a separate selector | Existing final `P/L/U`; explain how operations populate them | S within Teaching v2 |
| Triangular substitution | Direct solve subproblem | Solve `L y=P b` forward, then `U\hat{x}=y` backward. | Nonzero accepted diagonals under current factorization. | Direct-method package routes the concept, but no project IDs for the two substitutions. | Primary framework | Part of current method | Existing ordered contribution/accumulator trace is sufficient; add explicit `P b` vector evidence | M presentation |
| Cholesky factorization | Specialized direct factorization | Use a triangular factorization for a symmetric positive-definite matrix. | Positive-definite prerequisite is essential. | Method ID exists, but `positive_definite_matrix` is an unresolved stable-ID gap. | Planned method card only, subordinate | No | Would need its own factorization trace and assumption validation | L; defer |
| Stationary iteration | Iterative family | Repeated affine updates from an initial approximation. | Exact convergence assumptions and stopping policy are method/problem specific and unresolved for this Lab. | `stationary_iteration` exists; canonical page review required. | Family-level contrast | No | Repetitive-finite trace: first five + final, plus stop metadata | L platform/product pass |
| Jacobi iteration | Stationary iterative | Compute every new component from the previous iterate. | Initial guess, convergence eligibility, stopping metric/tolerance, iteration cap, and failure classification require a new numerical contract. | `jacobi_iteration` routes cleanly but remains Wave 6 / review required. | Planned method card | Not in Teaching v2 | Per-iteration vector, ordered component terms, residual/stopping evidence; first five + final | L |
| Gauss-Seidel iteration | Stationary iterative | Reuse each newly updated component immediately within the current iterate. | Same unresolved contract items as Jacobi; evaluation order must be explicit. | `gauss_seidel_iteration` routes cleanly but remains Wave 6 / review required. | Planned method card | Not in Teaching v2 | Same bounded iteration evidence, with old/new value ownership explicit | L |

SOR and Conjugate Gradient are not placed in the visible v2 framework. The
bounded canonical packages inspected for this task do not provide approved
project routing sufficient to make them current Lab claims. Eigenvalue
iterations, QR, SVD, least squares, and iterative refinement also remain
outside this system-solving teaching slice.

## 7. Runnable-method roadmap

1. **Teaching v2 implementation:** keep Gaussian elimination with partial
   pivoting as the only runnable method and make its framework and computation
   genuinely visible.
2. **Later Iterative Contrast design:** design Jacobi and Gauss-Seidel
   together so learners can compare “previous iterate only” with “reuse new
   components immediately.” Resolve assumptions, initial guess, stopping
   metric, algorithm-specific tolerance, iteration cap, non-convergence,
   session identity, and trace retention before code.
3. **Later implementation only after approval:** make both runnable in one
   coherent method-family expansion. Do not add only a label or a generic
   iteration engine.
4. **Defer Cholesky:** do not make it runnable until positive-definite
   terminology, validation, teaching scope, and numerical contract are
   approved.

Jacobi and Gauss-Seidel are the best next runnable contrast, but not the next
implementation task. Teaching the existing direct method completely has
higher value and lower risk.

## 8. Direct-versus-iterative teaching strategy

The Method step uses a compact, noninteractive family comparison:

| Direct | Iterative |
|---|---|
| Transforms or factorizes the finite system, then solves simpler systems. | Starts from an approximation and generates successive approximations. |
| Current example: Gaussian elimination with partial pivoting. | Planned examples: Jacobi and Gauss-Seidel. |
| The current computation ends after a bounded elimination and two triangular solves. | A future run needs a stopping rule and may stop without convergence. |

The comparison teaches the framework without creating disabled fake controls.
The selected-method area then identifies **Available now: Gaussian elimination
with partial pivoting** and gives its algorithm outline.

## 9. Math-typesetting decision

| Option | Visual quality | Hat / scripts | Fractions | Matrices / delimiters | Labelled arrows / alignment | Accessible ownership | Browser/mobile | Bundle | Complexity | Decision |
|---|---|---|---|---|---|---|---|---|---|---|
| A. Extend span/sub/sup DOM and CSS | Medium for simple notation; custom layout becomes fragile | Scripts good; over-accent remains custom | Custom stacked CSS | Semantic tables but weak mathematical delimiters | Custom layout | Existing single-owner pattern works | Responsive but many one-off rules | Negligible | M now, increasing over time | Reject as the primary v2 display layer. Keep for simple inline numbers/terms. |
| B. Native MathML visual tree | High for authored algebra supported by MathML Core | Native `mover`, `msub`, `msup` | Native `mfrac` | Native `mtable` with explicit stretchy delimiter operators | `mrow`, `mover`, `mtext`, operator layout | Keep one project-owned `role="math"`/`aria-label` owner; hide the visual MathML subtree from AT | Modern Chromium support is expected; actual current-route visual proof is an implementation gate. Use local overflow containment on narrow screens. | Negligible; no dependency | M | **Recommended.** |
| C. Existing deferred readonly-math / MathLive | High and broad TeX coverage | Strong | Strong | Strong | Strong | Existing controlled owner can work | Requires async custom-element/runtime verification | Loads deferred math runtime for authored Linear Systems displays | M/L lifecycle and bundle cost | Fallback only if the native MathML spike fails an approved browser/accessibility gate. |

The in-app browser audit verified the current span/table limitations but did
not establish a rendered MathML comparison: its URL safety policy rejected an
isolated data-page rendering check. The recommendation is therefore paired
with a mandatory small real-route spike before the renderer is adopted across
the Lab. No implementation may claim browser acceptance from this design
alone.

## 10. Recommended renderer architecture

Add one small project-owned authored-math helper, likely
`frontend/src/math/nativeMath.ts`, rather than a parser or framework.

The helper:

- creates elements with `document.createElementNS` only;
- accepts explicit project-owned node builders, never raw HTML or arbitrary
  LaTeX;
- reuses `formatMathNumber` so display formatting remains presentation-only;
- returns one accessible owner with `role="math"` and a complete `aria-label`;
- marks the visual MathML subtree `aria-hidden="true"` to prevent duplicate
  speech under the existing Mathematical Presentation v1 policy;
- supports only `math`, `mrow`, `mi`, `mn`, `mo`, `mtext`, `msub`, `msup`,
  `msubsup`, `mover`, `mfrac`, `mtable`, `mtr`, and `mtd` initially; and
- uses explicit `mo` delimiters around `mtable`, not a general LaTeX parser or
  deprecated convenience element.

`structuredMath.ts` remains the number formatter and simple-inline helper.
Teaching v2 uses native MathML for over-accents, column vectors, matrices,
fractions, aligned multi-line calculations, and labelled transformation
arrows. Long displays receive a local labelled overflow container; the page
must not overflow.

If the spike shows unacceptable current-browser or assistive-technology
behavior, stop and document the evidence. The fallback is the existing
controlled readonly-math infrastructure, still without a new dependency.

## 11. Page information architecture v2

Retain the four-step route/workflow.

### Method

1. **What are we solving?** Show `A x=b` and directly identify `A`, `x`, and
   `b`.
2. **Linear system.** One compact definition and a 2-equation concrete reading
   of matrix rows.
3. **Method families.** Direct versus iterative comparison, with status labels
   “Available now” and “Planned.”
4. **Selected method.** Gaussian elimination with partial pivoting.
5. **Algorithm outline.** Pivot, optional row swap, eliminate, record PLU,
   forward substitute, backward substitute, check residual.
6. **Key concepts.** Compact always-visible teaching; future Glossary may add
   depth but is not required for comprehension.

### Data

1. Display the typeset relationship `A x=b` next to the existing editable
   system.
2. Retain dimension, preset, validation, fingerprint, and current/stale
   contracts.
3. Add a short assumption line: small dense real square system, `2 <= n <= 6`.
4. Do not add method-specific iterative inputs in Teaching v2.

### Output

1. Properly typeset computed solution `\hat{x}` as one column-vector equation.
2. Show factorization result `P A=L U` and the final factors.
3. Make **Step-by-step computation** the primary teaching disclosure.
4. Within it, lead with full matrix transformations, then `P b`, forward
   substitution, backward substitution, final `\hat{x}`, and residual check.
5. Keep optional operation explanation and raw candidate/detail evidence
   subordinate.

### Diagnostics

1. Residual meaning.
2. `A\hat{x}` calculation/result.
3. `r=b-A\hat{x}` calculation and residual vector.
4. `\lVert r\rVert_\infty` calculation/result.
5. Interpretation and limitation: equation mismatch, not guaranteed solution
   error.
6. Qualified preset reference comparison when authorized.
7. Closed **Solver safeguard details** containing matrix scale, pivot threshold,
   accepted pivots, row-swap summary, and a nested implementation detail.

No fifth top-level workflow step is justified.

## 12. Computation Walkthrough v2

The default sequence is computation-led. Explanatory prose follows the
mathematics rather than replacing it.

### A. Start

- display original `A` and `b`;
- display `U^(0)=A`;
- identify the selected method;
- keep matrix-scale/safeguard material out of this phase.

### B. Pivot and factorization

For every meaningful operation:

```text
full U before
    → labelled row operation →
full U after
```

The card also shows the selected pivot and elimination multiplier when
applicable. Candidate magnitudes, complete pivot comparison, prior-`L` swap
evidence, and binary64 safeguard evidence remain optional details.

### C. Factorization result

- show `P A=L U`;
- show final `P`, `L`, and `U`;
- explain in one sentence: `P` records row order, `L` records multipliers, and
  `U` is the upper-triangular result.

### D. Right-hand-side permutation

- show `P b` as a complete vector;
- when no row swap occurred, still show that `P b=b`;
- consume an explicit trace record rather than applying `P` in the frontend.

### E. Forward substitution

- show `L y=P b`;
- process components from first to last;
- for each component, show one fully parenthesized, trace-ordered calculation
  ending in `y_i`;
- keep contribution-table evidence optional.

### F. Backward substitution

- show `U\hat{x}=y`;
- process components from last to first;
- for each component, show one fully parenthesized, trace-ordered calculation
  ending in `\hat{x}_i`.

### G. Final computed solution

- show the complete, properly typeset `\hat{x}` column vector;
- preserve approximate notation whenever visible numbers are rounded.

### H. Residual check

- show `A\hat{x}` component arithmetic and resulting vector;
- show `r=b-A\hat{x}` and the resulting vector;
- show `\lVert r\rVert_\infty=\max_i |r_i|` and the selected maximum;
- finish with the residual/error limitation;
- show preset comparison afterward when authorized.

## 13. Example full matrix-transformation presentation

The following is a presentation example for **Starter 3×3**. Displayed
decimals are rounded views of trace-owned binary64 values, so `≈` is required
where rounding occurs.

```text
U^(0) = A = [  3   1  −1 ]
              [  2   4   1 ]
              [ −1   2   5 ]

m_21 = U_21 / U_11 ≈ 0.6666667

U^(0)  -- R_2 − m_21 R_1 → R_2 --

U^(1) ≈ [  3          1         −1       ]
         [  0          3.333333   1.666667 ]
         [ −1          2          5        ]

m_31 = U_31 / U_11 ≈ −0.3333333

U^(1)  -- R_3 − m_31 R_1 → R_3 --

U^(2) ≈ [ 3   1          −1       ]
         [ 0   3.333333    1.666667 ]
         [ 0   2.333333    4.666667 ]

m_32 = U_32 / U_22 ≈ 0.7

U^(2)  -- R_3 − m_32 R_2 → R_3 --

U^(3) ≈ [ 3   1          −1       ]
         [ 0   3.333333    1.666667 ]
         [ 0   0           3.5      ]
```

For the row-swap preset, the same card pattern becomes:

```text
U^(k)  -- R_i ↔ R_j -->  U^(k+1)
```

Both full matrices come from the operation’s trace snapshots. The frontend
does not patch a row into a previous matrix or rerun elimination.

## 14. Forward-substitution teaching presentation

After an explicit `P b` block, show one calculation per component. For the
Starter preset, the conceptual shape is:

```text
L y = P b

y_1 = 6 / 1 = 6

y_2 ≈ (9 − 0.6666667 · 6) / 1 = 5

y_3 ≈ ((−2 − (−0.3333333 · 6)) − (0.7 · 5)) / 1 = −3.5
```

The nested parentheses communicate the actual sequential subtraction order.
Every operand, product, intermediate accumulator, diagonal, and result comes
from the existing forward-substitution record. An optional detail may expose
the ordered contribution rows and stored accumulated-known-term sum.

## 15. Backward-substitution teaching presentation

Show solve order explicitly from bottom to top:

```text
U x-hat = y

x-hat_3 ≈ −3.5 / 3.5 = −1

x-hat_2 ≈ (5 − (1.666667 · −1)) / 3.333333 = 2

x-hat_1 ≈ ((6 − (1 · 2)) − (−1 · −1)) / 3 = 1
```

The visual renderer uses a true `\hat{x}` accent rather than the ASCII label
shown in this documentation block. Each previously solved component receives
a static “Solved” marker; no timed sequence is required.

## 16. Diagnostics redesign

The primary display uses four separate mathematical blocks:

```text
A x-hat
  ≈ [ 6,
      9,
     −2.000000000000001 ]

r = b − A x-hat
  ≈ [ 0,
      0,
      8.881784 × 10^−16 ]

||r||_infinity
  = max { 0, 0, 8.881784 × 10^−16 }
  ≈ 8.881784 × 10^−16
```

The implementation uses native mathematical layout, not the baseline text
spelling in this block. Product formatting must retain enough precision for
the displayed `A\hat{x}` component and residual to remain mutually
understandable; it may not round a nonzero residual to visible zero.

Below the mathematics:

> The residual measures equation mismatch. A small residual does not
> necessarily mean a small solution error, because the Lab does not compute
> the conditioning of this system.

The preset reference comparison is secondary. A closed **Solver safeguard
details** disclosure then shows:

```text
||A||_infinity
  = max_i sum_j |a_ij|
  = max {5, 7, 8}
  = 8

tau_pivot = 64 epsilon ||A||_infinity
          ≈ 1.136868 × 10^−13
```

The disclosure identifies this as a product engineering safeguard, not a
singularity proof. A nested **Implementation detail** may state that the
binary64 parameter is read from JavaScript `Number.EPSILON`; that identifier
does not appear in the default walkthrough.

## 17. Trace sufficiency matrix

| Teaching display | Phase 1 evidence | Sufficient? | Missing evidence | Producer status | Frontend without recomputation? |
|---|---|---:|---|---|---:|
| Initial full matrix | `factorization_start.initialU` is copied before the first factorization operation. | Yes | None | Implemented | Yes |
| Pivot candidates | `pivot_selection.candidates` in computation order | Yes | None | None | Yes |
| Selected pivot | Selected row/value/magnitude, threshold, acceptance | Yes | None | None | Yes |
| Row swap full before/after | Each `row_swap` carries complete immutable `uBefore` and `uAfter` plus the accepted row/permutation/prior-`L` evidence. | Yes | None | Implemented around the existing swap | Yes |
| Elimination full before/after | Each elimination carries its own complete sequential `uBefore` and `uAfter`, plus pivot/target rows and multiplier. | Yes | None | Implemented around the existing update | Yes |
| Multiplier | Pivot value, target-column value, multiplier, `L` location | Yes | None | None | Yes |
| Final `P/L/U` | `factorization_complete` has complete factors and permutation | Yes | None | None | Yes |
| `P b` | `right_hand_side_permutation` carries original `b`, the authoritative permutation, and the exact complete `permutedB` consumed by forward substitution. | Yes | None | Implemented on the existing solve path | Yes |
| Forward substitution | Ordered contributions, products, accumulators, numerator, diagonal, result | Yes | None | None | Yes |
| Backward substitution | Ordered contributions, products, accumulators, numerator, diagonal, result | Yes | None | None | Yes |
| Complete `x-hat` | Successful result has `xHat`; backward records carry each component | Yes through result | No trace change needed | Pass the immutable success result to the v2 renderer or use its existing owner | Yes |
| Residual components/vector | Result has vector; trace has original `A` row, `xHat`, ordered products, matrix-vector value, `b_i`, and residual | Yes | None | None | Yes |
| Residual norm | Components, absolute values, maximum row, norm | Yes | None | None | Yes |
| Preset comparison | Complete conditional component differences and maximum | Yes | None | None | Yes |
| Pivot failure | Error code/message plus `factorization_start`, completed operation snapshots, and the rejected pivot; no post-failure solve evidence. | Yes for the controlled pivot-rejection contract | None | Implemented without partial success | Yes |

## 18. Implemented trace extension

Phase 1 extends only the Linear-Systems-specific step union:

1. add `factorization_start` with a deeply frozen complete `initialU`;
2. add complete deeply frozen `uBefore` and `uAfter` matrices to each
   `row_swap` record;
3. add complete deeply frozen `uBefore` and `uAfter` matrices to each
   `elimination` record; and
4. add `right_hand_side_permutation` with `originalB`, `permutation`, and
   `permutedB`.

Because `n <= 6`, these snapshots remain naturally bounded and follow the
existing “retain all meaningful steps” policy. They are copied from the
authoritative work arrays immediately before/after the existing operation and
are not produced by a second Gaussian-elimination pass. Trace-enabled outputs,
arithmetic order, pivots, factors, solution, residual, fingerprints, and
success/failure classification remain exactly compatible.

Do not add prose, HTML, MathML, LaTeX, rendered strings, determinant,
condition number, or new diagnostic claims to the trace.

## 19. Motion v1 reuse decision

- **Reuse:** local mounted-presentation ownership, Replay control, duration and
  easing tokens, static source/target/changed markers, reduced-motion behavior,
  generation cancellation, and session exclusion.
- **Remount:** row-swap replay should move full rendered matrix rows inside the
  new before/after matrix layout; elimination replay should switch once from
  the trace-owned full `uBefore` to full `uAfter` state.
- **Do not freeze yet:** selectors, card layout assumptions, and the current
  changed-row-only replay stage.
- **Still static:** pivots, substitutions, residuals, and all default teaching
  content.

No motion work begins until the trace and static Teaching v2 presentation pass
their own correctness/readability gate.

## 20. Accessibility contract

- Every authored mathematical display has one accessible owner and one
  complete learner-meaningful accessible name.
- Visual MathML is hidden from the accessibility tree when the wrapper owns
  the name; no formula is spoken twice.
- Full matrix transformations have explicit “before,” row-operation, and
  “after” text outside color/motion.
- Learner-facing indices remain one-based.
- Mathematical reading order follows visual computation order.
- Disclosures use native controls, stable `aria-expanded`/`aria-controls`, and
  correct heading nesting.
- Tables used for editable inputs remain semantic controls; authored result
  matrices may use MathML presentation with a complete accessible label.
- No automatic live-region narration of every computation step.
- Pivot failure wording remains controlled and does not upgrade the safeguard
  to proof of singularity.

## 21. Mobile contract

- At approximately 390 px, before, operation, and after matrices stack
  vertically; the operation arrow remains between them.
- At approximately 320 px, each mathematical block may scroll locally with an
  accessible container label; the document must not overflow horizontally.
- Do not shrink matrix entries or the `\hat{x}` accent until they become
  unreadable.
- Detailed candidate/contribution tables remain behind disclosures and use
  labelled stacked rows when necessary.
- Motion may reduce to the complete static before/operation/after layout when
  measured row movement would be ambiguous or clipped.

## 22. Expected implementation areas

Likely product files:

- `frontend/src/math/nativeMath.ts` and focused tests;
- `frontend/src/math/structuredMath.ts` only for narrow integration with the
  existing number formatter/owner policy;
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts` and its test;
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` and its test;
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` and its test;
- `frontend/src/labs/linear-algebra/computationMotion.ts` and focused tests only
  after the static redesign is accepted;
- `frontend/src/labs/linear-algebra/linearSystems.css`;
- current bundle-ownership and theme-token tests if imports/tokens change; and
- `docs/contracts/NUMERICAL_CONTRACTS.md`,
  `docs/contracts/MATHEMATICAL_PRESENTATION.md`, and
  `docs/contracts/VISUAL_MOTION_LANGUAGE.md` only when implementation changes
  their tracked contracts.

The route, AppSessionStore, backend, Tutor, Glossary, ODE, and PDE owners do
not need to change for Teaching v2.

## 23. Acceptance criteria

### Focused tests

- native MathML builder permits only the approved primitive set and creates
  one accessible owner;
- over-accent, vector, matrix, fraction, aligned calculation, and labelled
  arrow structures are semantically testable without string snapshots alone;
- trace snapshots equal the actual authoritative matrices at every operation;
- enabling the extension changes none of the accepted numerical outputs;
- `P b` evidence equals the vector actually consumed by forward substitution;
- the v2 renderer consumes full snapshots and never calls or duplicates the
  solver;
- Method concepts are visible without opening Glossary;
- `Number.EPSILON` is absent from the default walkthrough;
- safeguard detail is subordinate and initially closed;
- forward/backward arithmetic preserves contribution and accumulator order;
- Diagnostics renders distinct `A x-hat`, residual, norm, interpretation,
  reference, and safeguard sections;
- failure/current/stale/session/motion-cancellation behavior remains intact.

### Browser evidence

- native MathML is visually checked in the actual route before broad adoption;
- Starter and Row swap presets show readable full matrix transformations;
- computed `\hat{x}` has a clear accent and vector delimiters;
- substitution equations remain readable and correctly ordered;
- Diagnostics has no concatenated formula chain;
- pivot failure shows threshold evidence only in the appropriate failure or
  safeguard context;
- keyboard, focus, disclosure, and screen-reader ownership are reviewed;
- Light/Dark, 1440 x 900, 390 x 844, and 320-pixel reflow are checked;
- no page overflow, duplicate formula speech owner, console error, eager
  MathLive/Compute Engine load, or motion regression appears.

### Repository gates

Run focused numerical/renderer/app tests, all affected workspace typechecks,
import boundaries, production build/manifest review, full verification,
`git diff --check`, and authorized-scope review before acceptance.

## 24. Explicit non-goals

- no Jacobi or Gauss-Seidel implementation in the Teaching v2 pass;
- no Cholesky, SOR, Conjugate Gradient, iterative refinement, determinant,
  inverse, condition number, backward error, or error bound;
- no new numerical threshold or factorization convention;
- no second elimination path or frontend reconstruction of matrix states;
- no general LaTeX parser, MathJax, KaTeX, new dependency, canvas, or WebGL;
- no Linear Algebra Glossary publication or stable-ID decision;
- no Tutor, Glossary-to-Tutor handoff, ODE/PDE work, route change, Store
  redesign, persistence, push, or deployment;
- no motion expansion before the static computation-led experience is
  accepted.

## 25. Approval gate

The exact next gate is an independent Teaching v2 Phase 1 trace audit. Phase 2
static Teaching v2 integration remains unauthorized until that audit and a
separate maintainer decision. This design does not authorize new iterative
methods, Tutor, Glossary, push, or deployment.
