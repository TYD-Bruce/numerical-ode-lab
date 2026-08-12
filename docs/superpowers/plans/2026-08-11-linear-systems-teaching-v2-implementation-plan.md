# Linear Systems Teaching v2 Implementation Plan

**Status:** Maintainer-approved; Phase 0 Outcome B (Hybrid) and Phase 1 trace
accepted; Phase 2 static integration implemented and locally verified;
independent Phase 2 product/teaching audit next

**Date:** 2026-08-11

**Authoritative design:**
[Linear Systems Teaching v2 Design](../specs/2026-08-11-linear-systems-teaching-v2-design.md)

**Frozen numerical authority:**
[Numerical contracts](../../contracts/NUMERICAL_CONTRACTS.md)

## 1. Starting point

The design checkpoint starts from `main` at
`4f6c5810c41dbc0342c5e44ce1946478cbb2795f`, tree
`4f2fb65e4b270728e09e97bd578543b1f61772bb`, with a clean worktree.

Existing owners to preserve:

- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts` is the sole
  Gaussian-elimination, PLU, substitution, residual, safeguard, and trace
  producer;
- `frontend/src/labs/linear-algebra/linearSystemsSession.ts` owns editable
  drafts, preset identity, current/stale output, and atomic successful-result
  publication;
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` owns the four-step Lab
  and result/diagnostic surfaces;
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` is a
  presentation-only trace consumer;
- `frontend/src/labs/linear-algebra/computationMotion.ts` owns only mounted
  ephemeral replay state; and
- `frontend/src/math/structuredMath.ts` owns presentation-only number
  formatting and the current single accessible formula-owner pattern.

The route, package layout, Store, Tutor, Glossary, ODE, backend/API, and
deployment boundaries remain frozen.

## 2. Delivery strategy

Use four reviewable phases. Each phase has an explicit rollback point and may
stop without weakening the accepted baseline.

1. Native MathML capability spike and primitive foundation.
2. Authoritative trace snapshot extension.
3. Static Teaching v2 product integration.
4. Motion remount, full verification, and current-state synchronization.

Do not combine Jacobi, Gauss-Seidel, Tutor, Glossary, or unrelated visual work
with any phase.

## 3. Phase 0 — MathML capability spike and primitive foundation

**Result (2026-08-11): Complete.** The implemented DEV-only real-route spike
selects **Outcome B — Hybrid accepted**. Native MathML owns authored
mathematical atoms; controlled DOM/CSS owns responsive transformation
composition and arrow geometry. The helper, fixture route, and fixture CSS are
absent from Production assets, and no current public route or Linear Systems
chunk imports the helper. Desktop, 390-pixel, and 320-pixel Light/Dark browser
evidence passed with one accessible owner per formula and no MathLive or
Compute Engine load.

### Goal

Prove that a tiny project-owned native MathML visual layer can render the
required authored mathematics in the actual Linear Systems route while
preserving one accessible owner and existing lazy boundaries.

### Likely files

- create `frontend/src/math/nativeMath.ts`;
- create `frontend/src/math/nativeMath.test.ts`;
- narrowly update `frontend/src/math/structuredMath.ts` and its test only if
  number-format or owner reuse requires it;
- add a temporary DEV-only route-local probe only if the repository already
  has an accepted exclusion pattern and remove it before the phase commit; and
- update `frontend/src/app/routeBundleOwnership.test.ts` only if a new import
  boundary needs explicit coverage.

### Test-first sequence

1. Assert the approved primitive whitelist: `math`, `mrow`, `mi`, `mn`, `mo`,
   `mtext`, `msub`, `msup`, `msubsup`, `mover`, `mfrac`, `mtable`, `mtr`, and
   `mtd`.
2. Assert no `innerHTML`, raw HTML, raw user LaTeX, parser, MathLive, Compute
   Engine, Tutor, or Glossary import.
3. Assert one wrapper owner with `role="math"` and a complete `aria-label`;
   visual MathML is excluded from duplicate speech.
4. Assert structures for `\hat{x}`, a column vector with explicit delimiters,
   a fraction, a sub/sup expression, and a labelled row-operation arrow.
5. Assert all numbers still use presentation-only `formatMathNumber` output.

### Browser gate

In the real route, verify Light/Dark at 1440 x 900, 390 x 844, and 320 px:

- the hat is centered over `x`;
- brackets scale with a 2-through-6 component vector/matrix;
- fractions and labelled arrows are readable;
- local overflow works without page overflow;
- one accessible owner is exposed per formula; and
- the route does not eagerly load MathLive or Compute Engine.

If the current browser/assistive-technology combination fails materially,
stop. Record the evidence and plan a narrow fallback through the existing
readonly-math infrastructure. Do not build a custom CSS typesetting engine.

### Rollback point

The primitive file and tests are isolated. Reverting the phase restores the
accepted span/sub/sup renderer without touching numerical or Lab state.

## 4. Phase 1 — authoritative trace snapshot extension

**Result (2026-08-11): Complete locally.** The existing numerical loops now
emit the approved immutable initial/full-operation snapshots and the exact
permuted right-hand side consumed by forward substitution. Representative
pre/post projections excluding trace are bit-identical across both presets,
later-`L` swap, pivot tie, dimension boundaries, tiny scaling, pivot rejection,
and non-finite-intermediate cases. The current product renderer remains
unchanged; its focused test explicitly treats the two new standalone records
as producer-owned Phase 1 evidence pending Phase 2.

### Goal

Make the existing single numerical path emit all full matrix states and the
complete permuted right-hand side required by the computation-led walkthrough.

### Files

- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts`
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.test.ts`
- `frontend/src/labs/linear-algebra/linearSystemsSession.test.ts` only for
  traced-result immutability/reference preservation
- `docs/contracts/NUMERICAL_CONTRACTS.md`

### Implemented producer changes

1. Add `factorization_start` containing complete immutable `initialU`.
2. Extend `row_swap` with complete immutable `uBefore` and `uAfter`.
3. Extend `elimination` with complete immutable `uBefore` and `uAfter`.
4. Add `right_hand_side_permutation` containing `originalB`, `permutation`,
   and `permutedB` immediately before forward substitution.

Copy snapshots directly around the existing mutations. Do not call
`solveLinearSystem` recursively, run a second factorization, or reconstruct a
matrix after the solve.

### Focused numerical tests

- `factorization_start.initialU` exactly equals original `A` and shares no
  caller alias;
- every swap snapshot differs only by the authoritative row swap and matches
  the work state consumed by the next operation;
- every elimination `uBefore` contains the stored `targetRowBefore` and
  `pivotRowUsed`, while `uAfter` contains the stored `targetRowAfter`;
- later pivot/swap snapshots preserve prior-column `L` evidence;
- snapshot ordering matches the existing trace ordering for both presets and
  a multiple-swap case;
- `permutedB[i]` exactly equals the value consumed as the forward step’s
  right-hand side;
- pivot-rejected failure trace ends at the rejected selection and retains only
  valid prior snapshots;
- all new arrays are deeply frozen and share no working/input aliases;
- the accepted pivots, `P`, `L`, `U`, permutation, `xHat`, residual,
  diagnostics, fingerprint, reference authority, and failure classification
  are exactly unchanged from the pre-extension behavior.

### Verification

Run the focused Linear Systems numerical/session tests, numerics and frontend
typechecks, the full unit suite, import boundaries, and `git diff --check`.
No browser work is required until Phase 2 consumes the evidence.

### Rollback point

This phase changes only pure evidence fields and their contract. Reverting it
restores the previous trace while leaving the numerical algorithm/results
unchanged.

## 5. Phase 2 — static Teaching v2 integration

**Result (2026-08-12): Complete locally.** The accepted Phase 1 evidence is
now consumed by the production Linear Systems route. Method teaching, native
MathML mathematical objects, full before/operation/after transformations,
explicit `P b`, ordered substitution equations, the final computed solution,
and residual-led Diagnostics are present. Solver safeguards are subordinate
and closed by default. Motion remains deliberately unmounted.

### Goal

Replace the current narrator/table-first teaching surface with the approved
conceptual foundation, full computation transformations, typeset solution,
and separated Diagnostics. Motion remains disabled during this phase.

### Likely files

- `frontend/src/labs/linear-algebra/linearSystemsApp.ts`
- `frontend/src/labs/linear-algebra/linearSystemsApp.test.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.test.ts`
- `frontend/src/labs/linear-algebra/linearSystems.css`
- optionally create
  `frontend/src/labs/linear-algebra/linearSystemsTeaching.ts` and a focused
  test if extracting the method/term teaching model materially improves
  reviewability; do not create a generic content framework
- `frontend/src/app/routeBundleOwnership.test.ts`

### Method step

Implement, in order:

1. `A x=b` problem and explicit `A/x/b` roles;
2. compact linear-system explanation;
3. static Direct versus Iterative comparison;
4. “Available now” selected method and “Planned” Jacobi/Gauss-Seidel entries;
5. algorithm outline; and
6. directly visible key concepts.

Do not create disabled selectors or imply that planned methods run.

### Output step

1. Replace the computed-solution table/label composition with one native
   MathML `\hat{x}=<column vector>` display.
2. Keep final `P/L/U` evidence subordinate to the main solution but visible.
3. Rebuild the walkthrough sequence from the new authoritative records:
   Start, factorization operations, final factors, `P b`, forward
   substitution, backward substitution, final `xHat`, residual, reference.
4. For every row operation, render complete before/operation/after matrices.
   Elimination uses the maintainer-approved learner convention
   `R_i - m_ik R_k -> R_i`: computed row expression first, updated row
   identity second.
5. Keep candidate values and trace inspection tables behind **Show details**
   or **Show arithmetic**.
6. Do not call the solver, patch rows into matrices, or calculate `P b`.

### Diagnostics step

Render separate sections for:

- residual meaning;
- `A xHat` component arithmetic and vector;
- `r=b-A xHat` and vector;
- residual infinity norm and maximum component;
- interpretation/limitation;
- qualified preset comparison; and
- closed **Solver safeguard details**.

Move `Number.EPSILON` into a nested implementation detail only. The default
walkthrough does not contain that identifier.

### Focused DOM tests

- all fifteen required conceptual questions have visible answers on Method;
- statuses clearly distinguish runnable from planned methods;
- computed solution contains native over-accent and matrix structure under one
  accessible owner;
- all factorization operations have complete before/operation/after matrices
  exactly matching trace snapshots;
- no frontend arithmetic or solver call is introduced;
- `P b` uses the explicit trace step;
- forward/backward equations preserve stored contribution order and actual
  sequential grouping;
- residual blocks are distinct and no concatenated arrow chain remains;
- a nonzero diagnostic never displays as zero;
- safeguard disclosure is subordinate/closed and the default walkthrough does
  not expose `Number.EPSILON`;
- preset reference authority, current/stale behavior, failure lifecycle, and
  prior-success preservation remain unchanged;
- heading levels, IDs, disclosure ownership, and formula owners remain valid;
- 2-through-6 dimensions remain renderable.

### Browser gate

Use both presets plus a pivot-threshold failure:

- inspect Method teaching completeness;
- inspect `xHat` typography and factors;
- step through every row swap/elimination matrix transformation;
- inspect full forward/backward calculations;
- inspect Diagnostics precision and hierarchy;
- inspect safeguard/default separation;
- verify keyboard/focus and native disclosure behavior;
- verify Light/Dark, desktop, 390 x 844, and 320-pixel reflow; and
- inspect console, page overflow, accessible ownership, and network/bundle
  evidence.

### Rollback point

Because the session, route, and numerical result union remain stable, the
static presentation can be reverted independently of Phase 1 evidence.

## 6. Phase 3 — motion remount and release verification

### Goal

Reuse the existing accepted motion principles on the new full-matrix layout,
then synchronize current-state documentation and run the complete local gate.

### Likely files

- `frontend/src/labs/linear-algebra/computationMotion.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts`
- their focused tests
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` only if cancellation
  mounts change
- `frontend/src/labs/linear-algebra/linearSystems.css`
- `docs/contracts/MATHEMATICAL_PRESENTATION.md`
- `docs/contracts/VISUAL_MOTION_LANGUAGE.md`
- `docs/architecture/CURRENT_ARCHITECTURE.md` only if implemented ownership
  changes (none is expected)
- `PLAN.md`, `docs/INDEX.md`, `docs/PROJECT_HANDOFF.md`, and README only if the
  approved implementation task authorizes its public/current-state claims

### Motion changes

- row swap: reuse FLIP/cancellation ownership but measure the relevant rows in
  the full matrix presentation;
- elimination: replace once from trace-owned full `uBefore` to full `uAfter`;
- retain static before/operation/after evidence at all times;
- preserve reduced-motion immediate resolution;
- do not animate substitutions, residuals, pivots, page entrances, or number
  interpolation.

### Motion tests/browser evidence

- replay endpoints exactly match the new trace snapshots;
- no matrix/value is reconstructed;
- rapid replay and edit/Run/preset/dimension/collapse/route-leave cancellation
  remain generation-safe;
- focus remains on the Replay control;
- reduced motion retains full static evidence;
- stacked narrow layouts do not attempt ambiguous/clipped spatial movement.

### Complete gate

Run once after focused failures are resolved:

```text
npm.cmd run verify:boundaries
npm.cmd run test:run
npm.cmd run typecheck
npm.cmd run typecheck:api
npm.cmd run build
npm.cmd run verify
git diff --check
git status --short
```

Inspect the Vite manifest before claiming bundle ownership. Confirm Home and
static routes do not eagerly load Linear Systems, and Linear Systems does not
eagerly load ODE, Tutor, Glossary, MathLive, or Compute Engine.

### Rollback point

Motion remains presentation-only and can be disabled/reverted without changing
the accepted static Teaching v2 surface or numerical evidence.

## 7. Documentation and governance

At each authorized phase transition:

- keep `PLAN.md` as the active execution pointer;
- update the single canonical `docs/PROJECT_HANDOFF.md` with exact
  commit/tree, evidence, problems, reusable resolution, and next gate;
- update `docs/INDEX.md` for new authority/status;
- update numerical/mathematical/motion contracts only when implemented
  behavior changes their responsibility; and
- preserve historical reviews and prior checkpoint evidence.

Do not create a feature-specific HANDOFF.

## 8. Deferred method expansion

Jacobi and Gauss-Seidel require a separate approved numerical/product design
after Teaching v2 acceptance. That design must settle:

- supported matrices and any applicability warnings;
- initial guess;
- exact update ordering;
- stopping metric and algorithm-specific tolerance;
- maximum iteration count and non-convergence outcome;
- residual timing and interpretation;
- current/stale/preset fingerprints;
- repetitive-finite trace retention (`first five + final`);
- comparison UI and method identity; and
- browser/accessibility teaching acceptance.

Do not add a generic iteration engine in anticipation.

## 9. Stop conditions

Stop and return to the maintainer if:

- native MathML fails the real-route visual/accessibility spike;
- the trace extension would require changing numerical arithmetic/order;
- a proposed teaching definition conflicts with the canonical project term or
  an unresolved KnowledgeBase decision;
- full matrices cannot be emitted atomically from the existing loops;
- the renderer would need to reconstruct an unstored numerical state;
- a dependency, route, Store, Tutor, Glossary, ODE, backend, or deployment
  change appears necessary; or
- any implementation phase expands into Jacobi/Gauss-Seidel or a new numerical
  claim without separate authorization.

## 10. Exact next gate

Independent Teaching v2 Phase 2 product/teaching audit, followed by Maintainer
Teaching Review. Do not remount motion or implement iterative methods, Tutor,
Glossary, push, or deployment before those gates.
