# Numerical Notation Research Handoff

## Status

Research is in progress. Milestone 2A-1, Round 1 has produced an initial
evidence inventory for review. The inventory is non-canonical and has no
runtime impact.

## Current branch and HEAD

- Branch: `main`, per the user's final branch steering
- Starting HEAD for this iteration:
  `2134a0f18b923b5eaf648638a7f5c4b558a5c3f5`
- This handoff is recorded by the commit named
  `Start numerical notation research`; the exact resulting commit is reported
  by Git after the commit is created.
- No push was requested or performed.

A local research branch was briefly created at the starting HEAD before the
main-only steering arrived. It received no commits. Work then continued on
`main`.

## Current phase

Milestone 2A-1, Round 1 — Numerical Notation Evidence Inventory. Work stops
after this committed iteration for user review.

## Overall objective

Build a verifiable foundation for a future numerical notation standard and
Interactive Term Glossary without changing numerical behavior, runtime
notation, Tutor behavior, or UI. Round 1 collects and classifies evidence only;
Round 2 will synthesize decisions after user steering.

## Completed this iteration

- Established the private-reference boundary and repository ignore rules.
- Placed the available private note at the required ignored repository-relative
  location and retained only an empty tracked placeholder in the private
  directory.
- Documented the public/private reference policy.
- Scanned the private note's structure, mapped its ODE chapters, and performed
  targeted definition and consistency review for all requested foundation
  topics.
- Inventoried representative public UI, Tutor, documentation, accessible-text,
  source, internal-field, and regression-test locations.
- Classified current project evidence by audience and prospective treatment.
- Admitted one private and ten public candidate sources with permanent `NS-*`
  IDs.
- Built the topic evidence matrix and recorded unresolved conflicts without
  adopting notation.
- Added a public-facing README Changelog entry.

## Course-note sections reviewed

The private note was reviewed by locator only; no private prose, images, hash,
or absolute local path is recorded here.

- Table of contents and ODE/PDE chapter boundary
- Chapter 2: Background on ODEs
- §3.1: Euler's method
- §3.2: Taylor methods
- §3.3: Runge–Kutta methods
- §3.4: Absolute stability
- §3.5: Backward Euler
- §4.1–§4.7: Multistep methods through BDF methods
- ODE locator range: PDF pages 5–38, printed pages 3–36

## Public sources admitted

- `NS-001`: MIT 18.330 ODE chapter
- `NS-002`: Duke Math 361S ODE lecture notes
- `NS-003`: Driscoll and Braun, *Fundamentals of Numerical Computation*
- `NS-004`: NTNU ODE stability notes
- `NS-005`: SUNDIALS CVODE user guide
- `NS-006`: Michael T. Heath/UIUC ODE Error Estimation module
- `NS-007`: James Demmel/UC Berkeley ODE lecture notes
- `NS-008`: NASA Glenn grid-convergence guidance
- `NS-009`: UMBC numerical error-measure course page
- `NS-010`: SciPy `solve_ivp` API reference

Complete records, locators, topics, roles, tiers, URLs, and independence notes
are in the Candidate Source Inventory. The private course note is
`NS-PRIVATE-001` and is never counted as public evidence.

## Current project inventory progress

Representative authoritative coverage is complete for:

- Method cards and formula rendering
- Run and Compare Data forms
- Output summaries, tables, and charts
- Convergence Study teaching, metrics, table, chart, and conclusion
- Beginner Starter and New experiment
- Problem teaching text and stiff-relaxation guidance
- Accessible math fallbacks and chart/table descriptions
- Tutor suggestions, ODE grounding, Mock Tutor content, API context, and
  convergence material
- Current numerical contracts, project handoff, implemented design
  specifications, and historical reviews
- Grid, solver, nonlinear iteration, convergence, Tutor, and accessibility
  regression tests

Any future display migration requires a fresh implementation-wide search so
visible and accessible representations remain synchronized.

## Evidence strengths

- Strong: IVP structure, scalar/vector distinction, fixed grid and step size,
  exact/numerical values, theoretical order, convergence, test equation, and
  the mathematical core of absolute stability.
- Strong but definition-sensitive: local versus global error.
- Moderate: endpoint/maximum/RMS metric boundaries, observed order, asymptotic
  region, stability-function notation, residual scope, and stiffness.
- Public-source independence is adequate for the Round 1 foundation: sources
  span separate U.S. and international universities, an open textbook,
  government guidance, and independent scientific-computing projects.

## Evidence gaps and blockers

- `step_size`: evidence appears ready for synthesis; current Run and Compare
  labels use equivalent but nonuniform forms.
- `stability`: blocked by the boundary among absolute stability, A-stability,
  stiff-problem suitability, and nonlinear convergence; stability-function and
  region symbols vary or are absent.
- `global_error`: blocked by signed-error direction, the distinction among
  nodal error, error vectors, endpoint error, and maximum error, and normalized
  versus unscaled local truncation error.
- `observed_order`: blocked by private-note silence, symbol variation, and
  insufficient ODE-specific evidence about asymptotic-range reliability.
- Residual and tolerance evidence must separate nonlinear iteration stopping
  from adaptive IVP error control.
- The course note does not define endpoint, maximum, RMS, observed-order,
  residual, or tolerance terminology, and its treatment of stiffness is
  contextual rather than general.

## User-approved process decisions

- Work continues on `main` only; no separate research branch is required.
- Files inside `references` may be moved or modified to establish the requested
  private-reference layout.
- The private-note boundary remains in force: the note is review-only and is
  not committed, copied into documentation, quoted substantially, hashed,
  screenshotted for publication, or redistributed.
- No push is authorized.
- Round 1 remains evidence collection only; no notation decision IDs or runtime
  work are authorized.

## Files changed

- `.gitignore`
- `README.md`
- `references/README.md`
- `references/private/.gitkeep`
- `docs/research/numerical-notation-evidence-inventory.md`
- `docs/research/HANDOFF.md`

The private PDF is present locally under the ignored private-reference boundary
and is not part of the changed-file or commit set.

## Verification performed

- `npm.cmd run verify`: passed
  - 60 Vitest files passed
  - 868 tests passed
  - frontend TypeScript check passed
  - API TypeScript check passed
  - production Vite build passed
- `git diff --check`: passed
- Private PDF tracking check: not tracked
- Private ignore check: the required PDF is covered by
  `references/private/*`
- Private manifest/hash tracking check: no matching tracked file
- Private-review render cleanup: temporary page renderings were removed
- Scope check: only `.gitignore`, `README.md`, the two research documents, the
  references policy, and the private-directory placeholder are included
- Forbidden Round 1 document check: no numerical notation standard, notation
  decision file, or notation source register exists
- Runtime scope check: no source, API, test, package, Vite, Vercel, dependency,
  numerical, UI, Tutor, or runtime-bundle file changed
- Placeholder check: no unfinished placeholders appear in the changed
  documentation
- README check: exactly one Changelog section exists and its entry explicitly
  says research is in progress and no canonical notation or runtime Glossary
  content has been released

## Exact next actions

1. Obtain user review of the four first-term readiness assessments and the
   questions below.
2. On the next steering iteration, verify `main` and a clean worktree, then
   reread this handoff, the evidence inventory, and the latest README Changelog
   entry.
3. If authorized, deepen ODE-specific evidence for observed order and the
   asymptotic region, and add a classical-source stiffness comparison.
4. Build a Round 2 comparison of definition boundaries and candidate symbols
   without renumbering any `NS-*` source.
5. Create notation decisions only when the user explicitly begins Round 2.
6. Update the same inventory, this handoff, and the README Changelog; verify and
   commit one coherent iteration without pushing.

## Questions for the next steering round

1. Should Round 2 begin after review, or should Round 1 first admit another
   ODE-specific source on observed order and asymptotic-range detection?
2. Should the first `global_error` synthesis cover both endpoint and maximum
   metrics, or keep the aggregate metrics as separately mapped concepts?
3. Should the first `stability` synthesis include stiffness and nonlinear
   convergence boundaries in the same decision record, or only record
   cross-links to later terms?
4. For source weighting in Round 2, should the private course-note convention
   remain the leading internal convention when public sources use an equally
   valid alternative definition, such as step-normalized local truncation
   error?

## Commit history for this research branch

The project is using `main` rather than a dedicated research branch.

| Commit | Message | Research content |
|---|---|---|
| Starting baseline `2134a0f` | Existing project history | Parent of the initial notation-research iteration |
| Commit containing this handoff | `Start numerical notation research` | Milestone 2A-1 Round 1 inventory, private boundary, handoff, and Changelog |
