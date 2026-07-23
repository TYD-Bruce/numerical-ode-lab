> [!IMPORTANT]
> **Status:** Research in progress
>
> **Phase:** Milestone 2A-1, Round 1 — Evidence Inventory
>
> **Canonical:** No
>
> **Runtime impact:** None
>
> **Important:** This document records evidence and research gaps. It does not
> define the project's approved numerical notation.

# Numerical Notation Evidence Inventory

## Scope and evidence rules

This is a living inventory for evidence collection. Round 1 records what the
private course note appears to use, what the current project displays, and what
independent public sources use. Candidate conventions are not approved project
standards.

The private course note is represented by `NS-PRIVATE-001`. Its prose, images,
hash, and local filesystem location are not published here. Its entries are
project-written summaries with chapter, section, and page locators only.

Public evidence is admitted by stable candidate ID. Pages from one course or
book count as one source even when several sections are relevant. The inventory
uses official university material, an open numerical-analysis textbook, and
official scientific-computing documentation so that evidence is independently
checkable and does not depend on the private note.

## Course-note review method

The review proceeded in four layers:

1. **Structure scan.** The table of contents, chapter and section headings, and
   the distribution of definitions, examples, and convergence results were
   scanned first. The ODE locator map was established before topic conclusions
   were recorded.
2. **Targeted close reading.** The ODE material in Chapters 2–4 was reviewed,
   including one-step methods, Runge–Kutta methods, absolute stability,
   backward Euler, multistep methods, convergence theory, and BDF methods.
3. **Definition tracing.** Symbols were traced backward to their first local
   definition. Index roles, scalar versus vector use, norm choices, and
   example-only assumptions were recorded separately.
4. **Cross-section consistency.** Later ODE sections were checked for changes
   in exact/numerical-value notation, error sign and scaling, norm use,
   stability variables, and method-order terminology.

The ODE foundation occupies PDF pages 5–38 (printed pages 3–36). The material
from PDF page 39 onward begins a PDE chapter and was used only to confirm the
ODE chapter boundary.

## Course-Note Locator Map

| Topic | Status | Section or chapter | PDF pages | Printed pages | Project summary | Further reading needed |
|---|---|---|---|---|---|---|
| Initial value problems | course-note-clear | Chapter 2, Background on ODEs | 5 | 3 | Introduces a scalar autonomous IVP, its initial value, and a well-posedness condition before numerical methods. | No for Round 1 |
| Scalar and vector notation | course-note-clear | Chapter 2; §3.3 Runge–Kutta methods | 5, 16 | 3, 14 | Begins with scalar notation and later extends to systems using vector/matrix notation and standard 1-, 2-, and infinity-norms. | Confirm whether typography is consistent in every multistep system example |
| Time grids | course-note-clear | Chapter 2 | 5 | 3 | Uses an equally spaced time grid with integer node indices; the opening presentation locally assumes an initial time of zero. | Review nonzero-initial-time examples if later generality matters |
| Step size | course-note-clear | Chapter 2; Chapters 3–4 | 5–38 | 3–36 | Uses \(h=\Delta t\) for the fixed step and retains \(h\) through the ODE chapters. | No for Round 1 |
| Numerical approximation versus exact solution | course-note-clear | Chapter 2; §§3.1–3.3 | 5–16 | 3–14 | Uses \(y_n=y(t_n)\) for an exact nodal value and \(u_n\) for its numerical approximation. | Check whether every multistep derivation preserves the same pairing |
| Nodal error | course-note-clear | §3.1 Euler's method | 7 | 5 | Defines a signed nodal error as numerical value minus exact nodal value. | Compare the sign with public sources before synthesis |
| Local truncation error | course-note-clear | §§3.1–3.3; §§4.2, 4.4 | 7, 12, 15, 24, 27 | 5, 10, 13, 22, 25 | Uses \(\tau_n\) for an unscaled one-step or multistep defect; an order-\(p\) method has a defect of order \(h^{p+1}\). | Compare with sources that divide the defect by \(h\) |
| Global error | course-note-clear | §§3.1–3.3; §4.6 Convergence theory | 7–16, 35–36 | 5–14, 33–34 | Discusses propagation of the nodal error and bounds its magnitude; vector generalizations use norms. | Clarify whether “global error” denotes each nodal error, a vector, or an aggregate metric in later synthesis |
| Endpoint error | course-note-silent | not located | not located | not located | No named endpoint or final-time error metric was located in the ODE chapters. | needs deeper review |
| Maximum error | course-note-silent | not located | not located | not located | No named maximum-over-grid error metric was located. | needs deeper review |
| RMS error | course-note-silent | not located | not located | not located | No RMS error metric was located. | needs deeper review |
| Theoretical order | course-note-clear | §§3.2–3.3; §§4.2, 4.4, 4.6 | 11–16, 24–36 | 9–14, 22–34 | Relates method order to the leading local defect and the resulting global-error rate. | No for Round 1 |
| Observed order | course-note-silent | not located | not located | not located | No refinement-ratio formula or named observed-order symbol was located. | needs deeper review |
| Convergence | course-note-clear | §§3.1–3.3; §4.6 Convergence theory | 7–16, 35–36 | 5–14, 33–34 | Treats convergence at fixed physical time as the step tends to zero and connects consistency and stability to convergence. | Compare one-step and multistep meanings explicitly in Round 2 |
| Asymptotic region | course-note-silent | §3.1 contains a small-step asymptotic expansion, but no named region | 9 | 7 | Uses a sufficiently-small-step expansion but does not identify an “asymptotic region” for empirical order estimates. | needs deeper review |
| Stability test equation | course-note-clear | §3.4 Absolute stability; §3.5; §4.7 | 17–20, 37 | 15–18, 35 | Uses the scalar linear test equation and the product \(h\lambda\) to compare method amplification with exact decay. | No for Round 1 |
| Stability function | course-note-silent | §§3.4–3.5 derive method-specific amplification factors | 17–20 | 15–18 | Amplification factors are derived, but no general named stability function or stable symbol for it was located. | needs deeper review |
| Absolute stability region | course-note-clear | §§3.4–3.5; §4.7 | 17–20, 37 | 15–18, 35 | Defines regions in the \(h\lambda\)-plane where numerical amplification does not exceed one; no canonical region symbol was located. | Compare public region symbols before synthesis |
| Residual | course-note-silent | not located | not located | not located | No general residual definition was located for either a time-step defect or a nonlinear algebraic solve. | needs deeper review |
| Absolute and relative tolerance | course-note-silent | not located | not located | not located | No absolute/relative tolerance model was located. | needs deeper review |
| Newton iteration | course-note-silent | Chapter 4 closing remarks | 38 | 36 | Newton iteration is listed as an implementation option for implicit schemes but is not defined or notated. | needs deeper review |
| Stiffness | course-note-ambiguous | §3.5 Backward Euler; §4.7 BDF methods | 18–20, 37 | 16–18, 35 | A fast/slow linear example is labeled stiff and stability restrictions are discussed; a general definition of stiffness is not given, and “stiffly stable” is used for a method property. | More independent definitions and scope comparisons are required |

### Definition tracing and internal consistency notes

- The exact/numerical pairing \(y_n=y(t_n)\) and \(u_n\) remains stable across
  the reviewed one-step sections. The multistep chapters retain \(h\), integer
  node indices, and the same local-defect role.
- The signed nodal error is introduced as numerical minus exact. Subsequent
  global-error statements often use absolute values or norms, which erase the
  sign but do not establish a different signed convention.
- The local truncation error is consistently an unscaled scheme defect in the
  reviewed note sections. Some public texts normalize the same defect by
  \(h\); that difference is recorded as a definition boundary, not an error.
- Scalar absolute values become vector norms when systems are introduced. The
  specific norm is local to the surrounding result unless stated explicitly.
- Absolute stability consistently uses the product \(h\lambda\), but the note
  does not supply a general stability-function symbol or a persistent symbol
  for the stability region.
- The terms endpoint error, maximum error, RMS error, observed order,
  asymptotic region, residual, and tolerance were not located as defined ODE
  concepts. Their absence must not be filled in by inference.

## Current Project Notation Inventory

### Inventory layers

| Layer | Representative authoritative locations | Current role | Classification |
|---|---|---|---|
| Public UI | `src/ode/odeApp.ts`, `src/methodCatalog.ts`, `src/problemPresets.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts` | Method cards, Data forms, Output, Convergence Study, tables, charts, teaching text, Beginner Starter, and New experiment | public-ui |
| Accessible math and text | `src/math/ui/readonlyMath.ts`, `src/math/ui/methodMathContent.ts`, `src/math/ui/tutorMath.ts`, canvas/table labels in `src/convergenceStudyView.ts` | Math fallbacks, `aria-label` text, and screen-reader descriptions | accessible-text |
| Tutor | `src/ode/odeTutorBinding.ts`, `src/tutor/platformTutorPanel.ts`, `src/aiTutor.ts`, `src/convergenceTutor.ts`, `api/chatHandler.ts` | Suggested questions, ODE grounding, Mock Tutor responses, API prompt/context, and convergence teaching | tutor-visible |
| Documentation | `README.md`, `docs/NUMERICAL_CONTRACTS.md`, `docs/PROJECT_HANDOFF.md`, implemented specifications and reviews under `docs/superpowers/` and `docs/reviews/` | Public overview, current numerical contracts, implementation handoff, designs, and historical verification | documentation / historical |
| Source and tests | `src/convergenceStudy.ts`, `src/grid.ts`, `src/nonlinearSolver.ts`, `src/solvers.ts`, and representative `*.test.ts` files | Internal field names, numerical types, calculations, and regression expectations | internal-only / test-only |
| User-authored expressions | Problem and exact-solution inputs assembled through the ODE session and math-expression pipeline | Mathematical expressions supplied by the user | user-authored |

Internal names are evidence about implementation mapping, not automatic
requirements for a public display migration.

### Representative concept treatment

| Concept | Current notation or wording | Representative audience | Treatment classification | Inventory observation |
|---|---|---|---|---|
| Step size | Run form: \(h=\Delta t\); Compare form and charts: “Step size \(h\)” | public-ui, accessible-text, tutor-visible | display-migration | The meaning is largely aligned, but equivalent labels are not uniform. |
| Exact versus numerical values | Method formulas use \(u_n\); Output tables and final result use the label \(y\); convergence teaching uses \(u_N\) and \(y(t)\) | public-ui, accessible-text | display-migration | The generic Output label can hide the exact/numerical distinction established elsewhere. |
| Local truncation error | Tutor scope includes the term; one grounded response describes a per-step \(O(h^p)\) rate | tutor-visible, documentation | mapping-required | The current numerical contract and private note use an unscaled order-\(p\) defect of \(O(h^{p+1})\); normalized and unscaled meanings must be separated. |
| Global error | \(E_{\mathrm{final}}(h)=|u_N-y(t_{\mathrm{end}})|\); \(E_\infty(h)=\max_n|u_n-y(t_n)|\) | public-ui, accessible-text, tutor-visible, documentation | mapping-required | The UI uses absolute aggregate metrics, while source material also uses signed nodal errors and error vectors. |
| Theoretical order | Method metadata and UI use \(p\) and “Order of accuracy” | public-ui, tutor-visible, internal-only | already-aligned | Evidence consistently uses an integer or rate \(p\), but no approval is made in Round 1. |
| Observed order | \(p_{\mathrm{obs}}=\log_2(E(h)/E(h/2))\) | public-ui, accessible-text, tutor-visible, documentation | mapping-required | The formula is explicit; the private note is silent and public sources vary in notation and generality. |
| Absolute stability | Method cards, stiff-problem guidance, and Tutor content use “stability”; Backward Euler is described as “Very stable” | public-ui, tutor-visible | mapping-required | Mathematical absolute stability, stiff-problem suitability, and broad teaching language are not always visibly separated. |
| Nonlinear residual | Implicit diagnostics display final and maximum residual; API grounding defines residual through \(G(u)=0\) | public-ui, tutor-visible, internal-only | separate-migration | This is an algebraic-solver residual, distinct from a time-discretization defect. |
| Absolute/relative tolerance | Nonlinear solver fields and diagnostics use absolute and relative tolerances | public-ui, tutor-visible, internal-only | mapping-required | Solver stopping tolerances and adaptive ODE error tolerances are different scopes. The current Lab implements the former. |
| Newton iteration | Implicit-method diagnostics distinguish Newton from fixed-point iteration | public-ui, tutor-visible, internal-only | mapping-required | Public evidence supports the algebraic-solver meaning; the private note supplies only a brief mention. |
| Internal error fields | `finalTimeError`, `maximumGlobalError`, `finalObservedOrder`, `maximumObservedOrder` | internal-only, test-only | no-action | Names map current calculations but do not by themselves prescribe UI notation. |
| Historical design wording | Implemented design and review documents preserve the terminology used when features were built | historical | historical-only | Historical text is evidence of intent, not the current notation authority. |

### Documentation authority

| Document group | Classification | Reason for use in this inventory |
|---|---|---|
| `README.md` | current-authoritative | Current public product scope, commands, architecture, and limitations |
| `docs/NUMERICAL_CONTRACTS.md` | current-authoritative | Current numerical behavior, grid, nonlinear solve, convergence metrics, and observed-order contracts |
| `docs/PROJECT_HANDOFF.md` | current-authoritative | Current implemented-platform state and ownership boundaries |
| `docs/superpowers/specs/2026-07-10-convergence-study-design.md` | design-only | Implemented feature design; useful for provenance, not a notation standard |
| `docs/reviews/2026-07-10-convergence-study-review.md` | historical | Records verification at the time of the feature review |
| Platform Shell and human-friendly spec documents under `docs/superpowers/specs/` | design-only | Design intent for shell and teaching presentation |
| Corresponding Platform Shell and human-friendly reviews under `docs/reviews/` | historical | Point-in-time implementation evidence |

### Representative authoritative location records

#### Concept: Step size

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Run Data form, Compare Data form, convergence refinement table,
  convergence chart x-axis, and smaller-step Tutor questions

**Authoritative implementation**

- Primary files: `src/ode/odeApp.ts`, `src/convergenceStudyView.ts`,
  `src/convergenceTeaching.ts`
- Builders: fixed-grid/session construction in `src/ode/odeSession.ts` and
  grid construction in `src/grid.ts`

**Tutor and API**

- `src/ode/odeTutorBinding.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/grid.test.ts`, `src/ode/odeLifecycle.test.ts`,
  `src/convergenceStudyView.test.ts`

**Current notation:** \(h=\Delta t\) in the Run teaching label, \(h\) in
Compare and convergence displays, and \(t_n=t_0+nh\) in Tutor grounding.

**Additional implementation search required:** No for representative coverage;
Yes before any later display migration.

#### Concept: Exact and numerical solution values

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Method cards, Output summary/table/chart, Compare output, and
  Convergence Study teaching/table

**Authoritative implementation**

- Primary files: `src/methodCatalog.ts`, `src/ode/odeApp.ts`,
  `src/convergenceTeaching.ts`, `src/convergenceStudyView.ts`
- Renderer: `src/math/ui/methodMathContent.ts`

**Tutor and API**

- `src/ode/odeTutorBinding.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/ode/odeLifecycle.test.ts`, `src/convergenceStudyView.test.ts`,
  `src/math/ui/methodMathContent.test.ts`

**Current notation:** Method formulas and convergence teaching use \(u_n\) for
the numerical value and \(y(t_n)\) for the exact value. Generic Output labels
currently use `y` for the numerical series and “Final y” for its endpoint.

**Additional implementation search required:** Yes.

#### Concept: Global and aggregate errors

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Convergence Study teaching, metric selector, table, chart, and
  conclusion

**Authoritative implementation**

- Primary files: `src/convergenceStudy.ts`, `src/convergenceStudyView.ts`,
  `src/convergenceTeaching.ts`
- Current internal fields: `finalTimeError` and `maximumGlobalError`

**Tutor and API**

- `src/convergenceTutor.ts`, `src/aiTutor.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/convergenceStudy.test.ts`, `src/convergenceStudyOrder.test.ts`,
  `src/convergenceStudyView.test.ts`, `api/chatHandler.test.ts`

**Current notation:** The UI defines final-time absolute error as
\(E_{\mathrm{final}}(h)\) and maximum nodal absolute error as
\(E_\infty(h)\). It calls the latter “Maximum global error.”

**Additional implementation search required:** Yes, especially before mapping
signed nodal error, an error vector, and aggregate norms to distinct terms.

#### Concept: Observed order

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Convergence Study teaching cards, results table, and conclusion

**Authoritative implementation**

- Primary files: `src/convergenceStudy.ts`, `src/convergenceTeaching.ts`,
  `src/convergenceStudyView.ts`
- Calculation: base-two ratio for successive halving levels

**Tutor and API**

- `src/convergenceTutor.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/convergenceStudyOrder.test.ts`,
  `src/convergenceStudyView.test.ts`, `src/aiTutor.test.ts`

**Current notation:** \(p_{\mathrm{obs}}=\log_2(E(h)/E(h/2))\), with separate
final-error and maximum-error observed-order columns.

**Additional implementation search required:** No for the current feature;
Yes for a project-wide symbol decision and asymptotic-reliability language.

#### Concept: Stability

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Method cards, stiff-relaxation problem teaching, run guidance,
  implicit diagnostics, and Tutor suggestions

**Authoritative implementation**

- Primary files: `src/methodCatalog.ts`, `src/problemPresets.ts`,
  `src/ode/odeApp.ts`
- Numerical methods: `src/solvers.ts`

**Tutor and API**

- `src/ode/odeTutorBinding.ts`, `src/tutor/platformTutorPanel.ts`,
  `api/chatHandler.ts`

**Key regression tests**

- `src/solvers.test.ts`, `src/ode/odeLifecycle.test.ts`,
  `src/aiTutor.test.ts`, `api/chatHandler.test.ts`

**Current notation:** The UI uses plain-language “stability” and “absolute
stability” but does not expose a general \(R(z)\) or a named stability-region
symbol. Tutor grounding explicitly separates nonlinear-solver convergence from
absolute stability.

**Additional implementation search required:** Yes.

#### Concept: Nonlinear residual, tolerance, and Newton iteration

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Backward Euler controls and implicit-solve diagnostics

**Authoritative implementation**

- Primary files: `src/ode/odeApp.ts`, `src/nonlinearSolver.ts`,
  `src/solvers.ts`
- Internal configuration includes absolute/relative stopping tolerances and a
  Newton/fixed-point method choice.

**Tutor and API**

- `src/ode/odeTutorBinding.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/nonlinearSolver.test.ts`, `src/solvers.test.ts`,
  `api/chatHandler.test.ts`

**Current notation:** The API explains a nonlinear equation \(G(u)=0\) and a
remaining algebraic residual; the UI reports final and maximum residual
magnitudes and identifies the iteration method.

**Additional implementation search required:** Yes, to keep nonlinear stopping
criteria separate from adaptive time-integration error controls not currently
implemented by the Lab.

#### Concept: Accessible mathematical rendering

**Public location**

- Route: `/ode/initial-value-problems`
- UI areas: Method formulas, convergence teaching, Tutor mathematics, tables,
  and chart canvas

**Authoritative implementation**

- `src/math/ui/readonlyMath.ts`, `src/math/ui/methodMathContent.ts`,
  `src/math/ui/tutorMath.ts`, `src/convergenceStudyView.ts`

**Tutor and API**

- `src/aiTutor.ts`, `src/convergenceTutor.ts`, `api/chatHandler.ts`

**Key regression tests**

- `src/math/ui/readonlyMath.test.ts`,
  `src/math/ui/methodMathContent.test.ts`,
  `src/math/ui/tutorMath.test.ts`, `src/convergenceStudyView.test.ts`

**Current notation:** Visible LaTeX is paired with project-authored fallback or
accessible text; table headings and chart canvases also carry text labels.

**Additional implementation search required:** Yes for any later display
migration so visible and accessible representations remain synchronized.

## Candidate Source Inventory

Candidate IDs assigned here are permanent. If a candidate is rejected later,
its ID remains historical and is not reused.

| Source ID | Key | Title | Author or institution | Type | Tier | Evidence role | Public URL | Locator | Topics supported | Independence notes | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| NS-PRIVATE-001 | `course-notes-2025` | Private 2025 course notes | Private internal course material | Private course note | Private | private-internal-reference | Not published | ODE Chapters 2–4; PDF pp. 5–38; printed pp. 3–36 | Full ODE foundation; strongest internal cross-check for course terminology | Private internal reference; never counted as publicly verifiable evidence | candidate-active |
| NS-001 | `mit-18-330-ode-chapter` | Chapter 5: Methods for Ordinary Differential Equations | MIT OpenCourseWare, 18.330 course staff | Official university course chapter | Tier 1 | publicly-verifiable | [MIT OCW PDF](https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/a9d2bd9be098f0ada172af40379a17cc_MIT18_330S12_Chapter5.pdf) | §§5.1–5.2, PDF pp. 1–9 | IVPs, grid and step, exact/numerical values, local/global error, order, convergence, implicit methods | Independent U.S. university course; one course counts as one source | candidate-active |
| NS-002 | `duke-math-361s-ode-notes` | Math 361S Lecture Notes: Numerical Solution of ODEs | Holden Lee and Jeffrey Wong, Duke University | Official university lecture notes | Tier 1 | publicly-verifiable | [Duke Mathematics PDF](https://services.math.duke.edu/~holee/math361-2020/lectures/Lec7-ODEs.pdf) | ODE sections 2–8 | Scalar/vector IVPs, error, convergence, stability, test equations, stiff systems | Independent U.S. university and authors; not a mirror of NS-001 | candidate-active |
| NS-003 | `fnc-open-textbook-ivp` | Fundamentals of Numerical Computation | Tobin A. Driscoll and Richard J. Braun | Open numerical-analysis textbook | Tier 2 | publicly-verifiable | [Open textbook](https://tobydriscoll.net/fnc-julia/home.html) | §§6.1–6.4, 11.3–11.4; nonlinear equations in Chapter 4 | IVPs, vector form, grids, local/global error, convergence, experimental order, stability, stiffness, Newton iteration | Independent textbook authors and publisher; chapters count as one source | candidate-active |
| NS-004 | `ntnu-numerical-ode-stability` | Numerical Solution of Ordinary Differential Equations, Part 2 | NTNU Department of Mathematical Sciences, TMA4130 course staff | Official university course notes | Tier 1 | publicly-verifiable | [NTNU course notes](https://www.math.ntnu.no/emner/TMA4130/2022h/html_notes/NumODE_part2.html) | “Stability function,” “Linear systems,” and “A-stable methods” | Test equation, \(z=h\lambda\), stability function, absolute stability region, systems | Independent university source; particularly useful for named \(R(z)\) and region notation | candidate-active |
| NS-005 | `sundials-cvode-user-guide` | Using CVODE for IVP Solution | SUNDIALS project, Lawrence Livermore National Laboratory | Official scientific-software documentation | Tier 1 | publicly-verifiable | [SUNDIALS CVODE guide](https://sundials.readthedocs.io/en/latest/cvode/Usage/index.html) | §§3.4.3.2–3.4.3.6 and 3.4.4.3 | Vector IVPs, weighted RMS norm, scalar/vector tolerances, Newton/fixed-point solves, residuals, stiff/nonstiff choices | Independent professional implementation source; solver-control scope is explicit | candidate-active |
| NS-006 | `illinois-ode-error-estimation` | Error Estimation | Michael T. Heath, University of Illinois Urbana-Champaign | Official university educational module | Tier 1 | publicly-verifiable | [Illinois IEM module](https://heath.cs.illinois.edu/iem/ode/errorest/) | ODE error-estimation module | Exact/numerical values, local error, global error, time mesh, variable step | Independent U.S. university module; author and institutional provenance are identified | candidate-active |
| NS-007 | `berkeley-ma128a-ode-notes` | MA128A Lecture Notes: Ordinary Differential Equations | James Demmel, University of California, Berkeley | Official university lecture notes | Tier 1 | publicly-verifiable | [Berkeley lecture notes](https://people.eecs.berkeley.edu/~demmel/ma128a_Spr02/LectureNotes/ODEs.html) | ODE error, refinement, implicit methods, and stiff examples | Local/global error, convergence by refinement, implicit solves, stiffness, tolerances | Independent U.S. university author; separate from the MIT and Duke courses | candidate-active |
| NS-008 | `nasa-grid-convergence` | Examining Spatial (Grid) Convergence | NASA Glenn Research Center | Official professional/government guidance | Tier 1 | publicly-verifiable | [NASA Glenn tutorial](https://www.grc.nasa.gov/www/wind/valid/tutorial/spatconv.html) | “Order of Accuracy” and “Asymptotic Range of Convergence” | Theoretical/observed order, refinement ratios, log–log slopes, asymptotic range | Independent cross-domain evidence; admitted only for general convergence-study terminology, not ODE-specific formulas | candidate-active |
| NS-009 | `umbc-numerical-error-metrics` | CMSC 455 Lecture 1: Introduction, Overview, Floating Point | University of Maryland, Baltimore County | Official university course page | Tier 1 | publicly-verifiable | [UMBC course page](https://userpages.umbc.edu/~squire/cs455_l1.html) | Error-measure discussion | Absolute/relative error and maximum, average, and RMS measures over sets of values | Independent general numerical-analysis source; metric evidence is not ODE-specific | candidate-active |
| NS-010 | `scipy-solve-ivp` | `scipy.integrate.solve_ivp` | SciPy community | Official scientific-software API documentation | Tier 1 | publicly-verifiable | [SciPy API reference](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html) | Function definition, parameters, `rtol`/`atol`, method guidance | Vector IVP form, initial data, componentwise tolerance model, stiff/nonstiff solver guidance | Independent implementation documentation; separate codebase and community from SUNDIALS | candidate-active |

### Public evidence observations

- `NS-001`, `NS-006`, and `NS-007` independently support the distinction
  between error introduced by one step and error accumulated over many steps.
  Their signed-error conventions are not uniform.
- `NS-001` uses an unscaled one-step defect of order \(h^{p+1}\) for an
  order-\(p\) method, while `NS-003` also presents a local truncation error
  normalized by the step, of order \(h^p\). Both are mathematically coherent
  when the normalization is made explicit.
- `NS-002`, `NS-003`, and `NS-004` independently support the scalar linear test
  equation and absolute-stability analysis. `NS-004` explicitly names a
  stability function and a stability-region symbol; other sources do not use
  that exact presentation consistently.
- `NS-003` and `NS-008` support empirical order estimation and the need to
  identify an asymptotic refinement range. `NS-008` is cross-domain rather than
  ODE-specific, so it strengthens terminology but cannot alone establish an ODE
  display convention.
- `NS-005` and `NS-010` independently document absolute/relative tolerance
  models for production IVP solvers. Their scope differs from the current Lab's
  nonlinear-iteration stopping tolerances.
- `NS-005`, `NS-007`, and `NS-010` provide independent implementation or course
  perspectives on stiffness. The sources emphasize related but not identical
  symptoms: separated time scales, explicit stability restrictions, and method
  suitability.

## Topic Evidence Matrix

| Topic | Course-note status | Internal locator | Current project usage | Public sources | Evidence strength | Evidence gaps | Blocks first runtime terms |
|---|---|---|---|---|---|---|---|
| IVP notation | course-note-clear | Ch. 2, PDF 5 / printed 3 | Problem forms, Tutor grounding, and numerical contracts use \(y'=f(t,y)\) with initial data | NS-001, NS-002, NS-003, NS-010 | strong | Autonomous private-note opening versus general nonautonomous project/public forms | none |
| Scalar/vector conventions | course-note-clear | Ch. 2; §3.3, PDF 5, 16 / printed 3, 14 | Runtime Lab is scalar; Tutor and future-facing contracts sometimes describe general IVPs | NS-002, NS-003, NS-005, NS-010 | strong | Typography and norm mapping for a future systems rollout | none |
| Grid notation | course-note-clear | Ch. 2, PDF 5 / printed 3 | Fixed grid and \(t_n=t_0+nh\) | NS-001, NS-003, NS-006 | strong | Private opening uses a local \(t_0=0\) assumption | step_size |
| Step size | course-note-clear | Ch. 2, PDF 5 / printed 3 | Run UI shows \(h=\Delta t\); Compare and convergence use \(h\) | NS-001, NS-003, NS-006 | strong | Equivalent display forms and future variable-step indexing | step_size |
| Exact versus numerical values | course-note-clear | Ch. 2; §§3.1–3.3, PDF 5–16 / printed 3–14 | Method/convergence content uses \(u_n\) versus \(y(t_n)\); generic Output labels numerical data as \(y\) | NS-001, NS-003, NS-006 | strong | Generic Output naming is not uniform with teaching notation | global_error |
| Nodal error | course-note-clear | §3.1, PDF 7 / printed 5 | Not separately named in runtime; aggregate absolute errors are displayed | NS-001, NS-003, NS-006 | moderate | Signed convention differs among sources | global_error |
| Local truncation error | course-note-clear | §§3.1–3.3; §§4.2, 4.4 | Tutor term and numerical contract; no dedicated UI term | NS-001, NS-003, NS-006 | strong | Unscaled \(O(h^{p+1})\) versus step-normalized \(O(h^p)\); one Tutor phrase needs later mapping review | global_error |
| Global error | course-note-clear | §§3.1–3.3; §4.6 | “Maximum global error” and final-time error in Convergence Study | NS-001, NS-003, NS-006, NS-007 | strong | Signed nodal value, error vector, max norm, and endpoint metric are not interchangeable | global_error |
| Endpoint error | course-note-silent | not located | \(E_{\mathrm{final}}(h)\), “Final-time error” | NS-003, NS-007 | moderate | Naming and relation to “global error” need a source-level synthesis | global_error |
| Maximum error | course-note-silent | not located | \(E_\infty(h)\), “Maximum global error” | NS-003, NS-009 | moderate | ODE-specific versus generic dataset metric naming | global_error |
| RMS error | course-note-silent | not located | No runtime convergence metric; weighted RMS exists only in external solver evidence | NS-005, NS-009 | moderate | RMS versus weighted RMS and denominator/norm definition | none |
| Theoretical order | course-note-clear | §§3.2–3.3; Ch. 4 | Method metadata and UI use \(p\) | NS-001, NS-003, NS-008 | strong | Local-defect scaling must remain explicit | observed_order |
| Observed order | course-note-silent | not located | \(p_{\mathrm{obs}}\) with base-two halving formula | NS-003, NS-008 | moderate | Symbol, general refinement-ratio formula, and interpretation when errors stagnate | observed_order |
| Convergence | course-note-clear | §§3.1–3.3; §4.6 | Convergence Study compares error decay and theoretical order | NS-001, NS-002, NS-003, NS-007 | strong | Distinguish mathematical convergence from nonlinear iteration convergence | global_error |
| Asymptotic region | course-note-silent | Small-step expansion at PDF 9 / printed 7 | Tutor/conclusion discusses whether results approach expected order without a formal region definition | NS-003, NS-008 | moderate | Entry/exit criteria and finite-precision or cancellation limits | observed_order |
| Stability test equation | course-note-clear | §3.4, PDF 17 / printed 15 | Discussed in teaching/Tutor context, not displayed as a first-class UI formula | NS-002, NS-003, NS-004 | strong | Choice of \(y\), \(u\), or another dependent variable is notation-only | stability |
| Stability function | course-note-silent | Amplification factors in §§3.4–3.5 | No general runtime stability-function symbol | NS-003, NS-004 | moderate | Some sources name \(R(z)\); others present method-specific factors only | stability |
| Stability region | course-note-clear | §§3.4–3.5; §4.7 | Plain-language stability guidance; no region symbol | NS-002, NS-003, NS-004 | strong | Region symbols and boundary conventions vary | stability |
| Residual | course-note-silent | not located | Nonlinear algebraic residual in implicit diagnostics and Tutor grounding | NS-003, NS-005 | moderate | Algebraic residual, time-step defect, and ODE defect can be conflated | stability |
| Tolerance | course-note-silent | not located | Absolute/relative nonlinear stopping tolerances | NS-005, NS-007, NS-010 | strong | Current nonlinear-solve tolerance versus adaptive-IVP error control | stability |
| Newton iteration | course-note-silent | Brief mention at PDF 38 / printed 36 | Backward Euler solver option and diagnostics | NS-003, NS-005, NS-007 | strong | Iteration-index notation and residual stopping test need later mapping | none |
| Stiffness | course-note-ambiguous | §3.5; §4.7 | Stiff Relaxation preset, method guidance, and Tutor content | NS-002, NS-003, NS-005, NS-007, NS-010 | moderate | No single short definition covers every source's use; stiffness versus method stability must remain distinct | stability |

## Evidence Gaps and Conflicts

### Signed nodal error and the scope of global error

- **What is unclear:** Whether a future term should present a signed nodal
  error first, and whether “global error” names each nodal value, the full error
  vector, a maximum norm, or an endpoint metric.
- **Course-note status:** `course-note-clear` for its signed nodal convention,
  but it does not settle the project-wide scope of the phrase “global error.”
- **External disagreement:** `NS-001`, `NS-003`, and `NS-006` use different
  signed orientations and different scopes; magnitudes and norms hide the sign.
- **Difference type:** Primarily notation and terminology, with a mathematical
  type distinction between a value, vector, endpoint functional, and norm.
- **Further evidence needed:** A source-by-source definition table and a check
  of classical textbook conventions in Round 2.
- **First-term impact:** Blocks `global_error`.
- **Deferral:** Detailed vector-norm variants can be deferred, but the first
  runtime term cannot be finalized without the basic boundary.

### Local truncation error scaling and residual terminology

- **What is unclear:** Whether “local truncation error” denotes an unscaled
  scheme defect or that defect divided by the step, and when either quantity is
  called a residual.
- **Course-note status:** `course-note-clear` for the unscaled \(O(h^{p+1})\)
  convention; `course-note-silent` for residual.
- **External disagreement:** `NS-001` aligns with the unscaled order statement;
  `NS-003` explicitly supports a step-normalized \(O(h^p)\) definition.
  `NS-005` uses residual in an algebraic solver context.
- **Difference type:** Mathematical scaling plus terminology.
- **Further evidence needed:** Formal source excerpts reduced to formulas and
  definition boundaries, without adopting a convention in Round 1.
- **First-term impact:** Blocks part of `global_error` teaching and affects
  `stability` through implicit-solver diagnostics.
- **Deferral:** A full local-error term may be deferred, but Tutor wording must
  eventually preserve the distinction.

### Observed order and the asymptotic region

- **What is unclear:** The symbol and general refinement-ratio formula for
  observed order, and the evidence required before an estimate is considered
  asymptotic.
- **Course-note status:** `course-note-silent` for both named concepts.
- **External disagreement:** `NS-003` demonstrates empirical convergence
  behavior; `NS-008` names an asymptotic range and presents general refinement
  analysis. Their application domains differ.
- **Difference type:** Notation plus a substantive interpretation condition.
- **Further evidence needed:** At least one additional ODE-specific university
  source connecting observed order to asymptotic refinement, cancellation, and
  roundoff.
- **First-term impact:** Blocks `observed_order`.
- **Deferral:** Advanced reliability diagnostics can be deferred, but a first
  term needs a clear warning about non-asymptotic ratios.

### Stability function, region symbol, and meanings of “stability”

- **What is unclear:** Whether to expose a general stability function, which
  symbol names the absolute-stability region, and how broad UI claims map to
  absolute stability, A-stability, and stiff-problem suitability.
- **Course-note status:** `course-note-clear` for the test equation and region;
  `course-note-silent` for a named stability function.
- **External disagreement:** `NS-004` explicitly uses a named \(R(z)\) and a
  region symbol; `NS-002` and `NS-003` organize the same mathematics with
  different notation and presentation.
- **Difference type:** Some differences are notation-only; conflating method
  stability with nonlinear convergence or universal robustness is
  mathematically substantive.
- **Further evidence needed:** A compact notation comparison for the test
  equation, amplification factor, function, region, and A-stability.
- **First-term impact:** Blocks `stability`.
- **Deferral:** Detailed stability subclasses can be deferred, but the first
  term must establish the absolute-stability boundary.

### Residual and tolerance scopes

- **What is unclear:** How the current nonlinear residual and stopping
  tolerances should be distinguished from time-discretization defects and
  adaptive IVP error-control tolerances.
- **Course-note status:** `course-note-silent` for residual and tolerances.
- **External disagreement:** `NS-005` and `NS-010` document adaptive-solver
  tolerance models; `NS-003` and `NS-005` also discuss nonlinear equations and
  residual-based iteration. These are compatible only when scope is explicit.
- **Difference type:** Mathematical and operational scope, not merely symbols.
- **Further evidence needed:** Separate evidence records for nonlinear stopping
  criteria and adaptive integration error weights.
- **First-term impact:** Affects and can block examples under `stability`.
- **Deferral:** Adaptive-solver terminology can be deferred because the current
  Lab is fixed-step; nonlinear diagnostic terminology cannot.

### Stiffness definition

- **What is unclear:** Which minimum definition is accurate for an introductory
  term without reducing stiffness to one symptom or a property of a method.
- **Course-note status:** `course-note-ambiguous`.
- **External disagreement:** `NS-002`, `NS-003`, `NS-005`, `NS-007`, and
  `NS-010` emphasize time-scale separation, explicit stability restrictions,
  decay modes, or solver suitability in different proportions.
- **Difference type:** Conceptual emphasis with mathematical consequences.
- **Further evidence needed:** A definition comparison using at least one
  additional classical textbook or formal course treatment.
- **First-term impact:** Blocks examples and cross-links for `stability`.
- **Deferral:** A standalone stiffness term can be deferred, but the stability
  term must not imply that the two concepts are identical.

### Endpoint, maximum, and RMS metric names

- **What is unclear:** Which names and symbols best distinguish endpoint,
  maximum-over-nodes, RMS, and weighted RMS errors.
- **Course-note status:** `course-note-silent`.
- **External disagreement:** `NS-003` discusses final and max-norm meanings of
  global error; `NS-005` uses a weighted RMS norm for solver control; `NS-009`
  describes generic maximum and RMS measures.
- **Difference type:** Mathematical aggregation and weighting, plus notation.
- **Further evidence needed:** ODE-specific sources that define all three
  reporting metrics at the same nodal grain.
- **First-term impact:** Blocks parts of `global_error`.
- **Deferral:** RMS can be deferred from the first rollout; endpoint and maximum
  distinctions cannot because the current Convergence Study exposes both.

## Round 1 evidence readiness

Evidence indicates that IVP structure, fixed-grid step size, exact versus
numerical values, theoretical order, convergence, and the mathematical core of
absolute stability are ready for Round 2 comparison.

The first runtime candidates are not all equally ready:

- `step_size` has strong, mutually reinforcing evidence, with a small display
  consistency question.
- `stability` requires synthesis of scope, stability-function notation, region
  notation, and its boundary with stiffness and nonlinear convergence.
- `global_error` requires synthesis of signed nodal error, aggregate metrics,
  and local-error scaling.
- `observed_order` requires more ODE-specific evidence about the asymptotic
  region and estimate reliability.

No final sign, symbol, region notation, global-error convention, or canonical
project notation is declared in this inventory.
