# Numerical T Lab — Project Handoff

This is the durable handoff for future contributors. Use it with the current codebase and the authoritative design and plan; do not rely on prior chat history.

## Cross-Lab Presentation Sync Phase 4 — Linear Systems migration candidate — 2026-08-21

Cross-Lab Presentation Sync Phase 4 is implemented and locally verified as an
audit candidate in implementation commit
`15e04db939938ae01234d67149f832c4efeaad60` (tree
`ed6756791fc5c553a1d39d99dd79cd3aabaa155e`). This candidate starts from the
Maintainer-accepted Phase 3 HEAD
`1e9080f110385fe635885d28cd4a17e810c8421a` (tree
`1dc5b52346fadadf2f92d8ffa2169e7f5dc50cd8`), whose final correction re-audit
passed with `P0 = P1 = P2 = P3 = 0`.

### Implemented presentation composition

Linear Systems keeps its four-stage Method → Data → Output → Diagnostics
workflow. Method now composes only its natural large teaching regions through
shared `TeachingBlock` owners: the problem foundation, method landscape,
selected GEPP teaching, and result-checking boundary. The accepted copy,
ordering, planned Jacobi/Gauss–Seidel status, GEPP profile, structural MathML,
and selected-method concept ownership remain domain-authored.

Successful current and stale Output now have exactly one
`[data-primary-result]` owner, the shared `PrimaryResult`. It contains one
successful-result `ProblemContext` and one computed-solution answer authored
only from immutable `originalA`, `originalB`, and `xHat`. The prior domain
`.ls-primary-result[data-primary-result]` owner is removed. The direct current
and stale regression closes `PHASE2-P3-04`; stale edits continue to show the
previous successful system and answer, never current draft data. Factorization
is secondary `EvidenceBlock` content and retains `P A = L U`, the rounded-entry
comparison warning, all `P`/`L`/`U` matrices, row-swap summary, and pivot table.

`ComputationWalkthroughShell` is now the real rendered outer owner of ordered
phases, ordered steps, and shared Before → Operation → After corridors.
`computationWalkthrough.ts` remains the sole interpreter of Linear Systems
trace kinds and the sole author of captions, complete matrices, the binding
row operation `R_i - m_ik R_k → R_i`, `P b`, forward/backward substitution,
residual evidence, preset qualification, and controlled failure cutoff. The
shell neither imports trace types nor derives numerical meaning. Before/after
labels have one shared accessible owner. Motion remains unimported and
unmounted; no Replay control exists.

Diagnostics remains the top-level analysis `StageSection`; it does not use
`AnalysisSurface`. Its successful context uses `ProblemContext`, its residual
meaning uses one large `TeachingBlock`, its three residual-led steps and
qualified preset comparison use `EvidenceBlock`, and arithmetic/safeguard
disclosures use native closed `AdvancedDetails`. The sequence remains context
→ residual meaning → residual-is-not-solution-error boundary → substitute
`A x̂` → compute `r` → measure `‖r‖∞` → qualified reference comparison
→ subordinate safeguards. `Number.EPSILON` remains nested under the closed
implementation detail.

### Behavior, ownership, and non-changes

GEPP algorithms, tolerances, trace production, result/session schemas,
successful-snapshot identity, failed-run preservation, meaningful-work
tracking, New experiment semantics, route disposal, and focus restoration are
unchanged. Native MathML remains the one visual/accessibility owner for
mathematical atoms. Data editing is unchanged. Linear Systems still exposes no
Tutor or Glossary binding. ODE, Chart.js, Convergence, Tutor, Glossary,
MathLive, Compute Engine, PDE, dependencies, API, Vercel configuration, and
Production state are unchanged.

### Verification and browser evidence

The direct duplicate-owner red gate initially failed exactly two assertions:
current and stale Output still used the old domain primary-result class. After
migration, the focused Phase 4 gate passes 5 files / 57 tests across shared
Phase 2 primitives, Linear Systems Teaching, app, walkthrough, and route-bundle
ownership. It directly proves one shared current/stale primary owner, immutable
successful context, natural shared teaching/evidence owners, shared
walkthrough/corridor ownership, unchanged trace order, controlled failure,
focus, no Motion/Replay, and the independent lazy route graph.

Fresh `npm.cmd run verify` passes:

- import boundaries: 4 owners plus the Vercel adapter;
- full suite: 95 files / 1,277 tests;
- frontend, numerics, contracts, and backend/API typechecks;
- Production build: 109 transformed modules.

Representative emitted raw/gzip changes from the accepted Phase 3 baseline
are:

| Asset | Phase 3 accepted | Phase 4 candidate |
|---|---:|---:|
| Entry JS | 57.27 / 17.72 kB | 57.27 / 17.72 kB |
| Shared Lab workflow/presentation JS | 5.73 / 1.89 kB | 12.84 / 3.21 kB |
| Linear Systems route JS | 71.01 / 21.15 kB | 75.22 / 22.44 kB |
| Linear Systems route CSS | 28.08 / 5.05 kB | 26.45 / 4.97 kB |
| ODE route JS | 303.10 / 96.33 kB | 296.45 / 95.01 kB |

The Phase 4 ODE route CSS is `14.87 / 3.60 kB`. The JS redistribution reflects
both complete Labs consuming the shared presentation graph; it is not an ODE
feature redesign. Static route-graph tests prove the shared inner primitives
remain behind the complete-Lab lazy boundaries,
`ComputationWalkthroughShell` enters only the Linear Systems graph, and the
platform entry remains free of complete-Lab presentation and domain runtime.
No `manualChunks`, dependency, or eager-import change was introduced.

Real-browser verification used the local Vite route at
1440 × 900 in Light and Dark, 390 × 844, and 320 × 844. Method, current Output,
stale Output, expanded walkthrough, Diagnostics, controlled pivot failure, and
cancel-only New experiment behavior had no page-level horizontal overflow.
The desktop corridor showed complete before/operation/after states without
overflow; mobile stacked all three states and contained the long operation
formula locally. Current and stale Output each had exactly one shared primary
owner; stale Output retained the accepted `b = [6, 9, -2]` after editing the
current draft. Controlled failure retained the earlier success and rendered no
forward/backward steps, Motion, or Replay. Diagnostics retained three evidence
steps, closed safeguards, no `AnalysisSurface`, and result-owned context.
Canceling New experiment restored focus to its trigger without resetting.

ODE separately mounted and ran its starter experiment to successful Output
with one shared primary result and one chart. Browser warning/error logs were
empty throughout. This is local browser evidence only; no Preview or Production
deployment was authorized or performed.

### Stop gate

Phase 4 stops here. The exact next gate is **independent Phase 4 Linear Systems
presentation / Teaching v2 / trace-equivalence audit**, followed by
**Maintainer visual review**. Phase 5 `AnalysisSurface` alignment, Motion
remount, Linear Algebra Tutor, Linear Algebra Glossary, PDE work, push, and
deployment remain unauthorized.

## Cross-Lab Presentation Sync Phase 3 — Maintainer accepted — 2026-08-21

The Maintainer formally accepts **Cross-Lab Presentation Sync Phase 3** at
final accepted HEAD `1e9080f110385fe635885d28cd4a17e810c8421a` (tree
`1dc5b52346fadadf2f92d8ffa2169e7f5dc50cd8`). The final independent
correction re-audit passed with `P0 = 0`, `P1 = 0`, `P2 = 0`, and `P3 = 0`.

This acceptance closes the Phase 3 ODE presentation and behavior-equivalence
gate, including its Tutor-launcher lifecycle, current-output authority,
information-hierarchy, visual, peer-alignment, accessibility, lazy-boundary,
and Production-graph corrections. The historical Phase 3 candidate section
below remains exact point-in-time implementation evidence.

`PHASE2-P3-04` is not a Phase 3 defect. It remains the sole open cross-Lab
carry-forward and is owned by the separately authorized Phase 4 Linear Systems
presentation migration. Phase 4 must replace the existing Linear Systems
primary-result presentation identity with one shared `PrimaryResult` owner;
it must not nest or duplicate `[data-primary-result]` ownership.

The exact active gate is **Phase 4 only — Linear Systems inner presentation
migration**. Phase 5 AnalysisSurface alignment, Motion remount, Linear Algebra
Tutor, Linear Algebra Glossary, PDE work, push, and deployment remain
unauthorized.

## Cross-Lab Presentation Sync Phase 3 — ODE migration candidate — 2026-08-19

### Phase 3 independent-audit corrections

The independent Phase 3 ODE presentation / behavior-equivalence audit returned
**BLOCKED — CROSS-LAB PHASE 3 NEEDS CORRECTION** with two findings:
`PHASE3-P1-01` (P1 Tutor launcher lifecycle) and `PHASE3-P3-01` (P3 Return to
current output authority). Both findings are corrected in implementation commit
`0c727358da90f71cc19febfc063c80f0dcfa5ea4` (tree
`0fb0e373fdadcf76a4e7a9cd65c0ea61add70f36`). Phase 3 remains a candidate;
this correction does not self-declare Maintainer acceptance.

`PHASE3-P1-01` originated at the boundary between a stable platform target and
replaceable Lab-authored DOM. `PlatformTutorHost` initially projected its
closed launcher into the current `[data-lab-header-actions]`, but every ordinary
ODE render calls `app.replaceChildren()` on the shell outlet that is also the
Host's stable `labTarget`. The replacement detached both the action group and
launcher while the Host retained only a reference to the detached launcher.
Refresh-only repair was insufficient because method selection, Run, Compare,
and New experiment rerender internally without notifying the platform Host.

The correction remains platform-owned. `PlatformTutorHost` now has one
idempotent launcher-placement reconciler and one `MutationObserver` on the
connected stable `labTarget`. When a valid connection and existing closed-state
launcher exist, the reconciler queries the current live header action group,
moves that same launcher node there, and no-ops when placement is already
correct. If no live group exists, the accepted Tutor rail remains the fallback.
Appending the launcher produces another child-list mutation, but the next
reconciliation observes that the node already has the correct parent and does
nothing; no polling, timer, duplicate owner, Tutor session mutation, or Tutor
runtime load is involved.

Observer ownership follows the Host connection. A new observation starts only
for a connected `labTarget`; connection replacement first disconnects the prior
observer; `disconnect()` and `dispose()` also disconnect it. The callback
captures connection identity and rejects stale ownership. Mutations after
disconnect cannot project a launcher. ODE imports no Host and has no post-render
Host callback.

Open-state behavior is unchanged because opening removes the closed launcher,
leaving the reconciler no node and therefore no authority to project. Browser
and DOM tests replace the Lab subtree while Tutor is open and retain exactly one
panel with zero closed launchers. Closing recreates the closed launcher through
the existing lifecycle, projects it into the newest action group, and restores
focus to that connected node when the original trigger was detached. Existing
Glossary suspension/resume and fallback-rail behavior remain intact.

`PHASE3-P3-01` originated in ODE Data presentation. Workflow Output already
used `hasSuccessfulOutput()`, which matches the current single method/order or
current comparison pair to stored successful evidence, while both Data return
controls used stored-object presence (`lastResult`/`lastCompare`). The controls
now render only when `hasSuccessfulOutput()` is true. Matching Forward Euler
and matching Compare pairs retain **Return to current output**; selecting RK4
after Forward Euler, or choosing a different comparison pair, disables Output
and removes the return control. Stored results, `lastProblemInputs`, matching
logic, session schema, result publication, failed-attempt preservation, and all
numerical values remain unchanged.

Test-first evidence reproduced the defects before implementation. The first
red gate ran two files / 40 tests with four intended failures: repeated real
`labTarget.replaceChildren(newLabDom)` placement, reconnect placement after
disconnect, real ODE rerender placement, and mismatching-method return control.
A second one-file / 23-test red gate reproduced the comparison-pair mismatch.
The final Host/ODE gate passes two files / 42 tests. It covers existing-node
reuse, repeated replacements with no duplicates, open-state replacement,
close into the latest action group, connected focus return, disconnect,
dispose, connection replacement, exactly one observer per active connection,
real ODE method/Run/Compare/New experiment rerenders, matching and mismatching
single output, matching and mismatching Compare output, and stored-result
identity. The expanded lifecycle gate passes eight files / 88 tests across
Tutor Host, Glossary/Tutor integration, route adapter/bootstrap, ODE lifecycle,
route, reset, and Glossary. A pre-existing Glossary/Tutor integration assertion
that no observer existed at all was narrowed to acknowledge the one placement
observer while still proving it cannot auto-restore a blocked Tutor.

Fresh browser verification used the real ODE route. At 1440 × 900 Light,
initial Method, RK4 selection, restored Forward Euler Data, successful Forward
Euler Output, every Compare transition, successful comparison, and confirmed
New experiment each retained exactly one closed launcher in the current header
and zero page overflow. The successful single value remained `0.00377789`; the
comparison remained Forward Euler `0.00377789` and Runge-Kutta 4 `0.00673848`.
Forward Euler success followed by RK4 selection produced disabled Output and no
return control; restoring Forward Euler produced enabled Output and one return
control.

Opening Tutor produced zero launchers and one visible panel. Selecting RK4
while it remained open replaced the Lab header without reprojecting the closed
launcher. Close then produced exactly one launcher inside the newest header and
focused that connected button. Navigation ODE → About removed all Tutor
presentation; browser Back remounted ODE with exactly one current launcher.
At 390 × 844 both actions remained on one row at 44 pixels high; method and
successful-Run rerenders retained one launcher, and the mobile modal Tutor
opened with zero launchers, `aria-modal="true"`, and inert Lab, then closed to
one focused connected launcher. At 320 × 844 the actions wrapped in source
order at approximately `260.02` and `312.02` pixels, remained 44 pixels high,
and the same Method, Run, open, close, and focus checks passed. Both widths had
zero page-level overflow.

Bounded non-regression browser smoke passed. Home's two **Open Lab** actions and
**View roadmap** shared the same `1076.01`-pixel top and 44-pixel height at
1440 × 1000. Linear Systems retained one **New experiment** action, no Tutor
launcher, and zero overflow. The ODE Glossary opened and closed its mobile
definition surface independently while the closed Tutor launcher remained in
the header. Browser warning/error logs were empty.

Focused verification passes eight files / 88 tests. `verify:boundaries` passes
four owners plus the Vercel adapter. The standalone suite and complete
`npm.cmd run verify` pass 95 files / 1,277 tests, all frontend/numerics/contracts
and backend/API typechecks, and the 108-module Production build. The Production
entry retains dynamic imports for ODE, Linear Systems, Tutor, and Glossary; ODE
still dynamically imports editable math, and readonly math still dynamically
imports MathLive. Representative raw/gzip assets are entry `57.27 / 17.72 kB`,
Tutor `12.14 / 4.62 kB`, shared Lab `5.73 / 1.89 kB`, ODE
`303.10 / 96.33 kB`, Linear Systems `71.01 / 21.15 kB`, editable math
`1,143.84 / 308.80 kB`, and MathLive `819.11 / 228.04 kB`. Presentation DEV
route/title markers remain absent from `dist`; the existing large-chunk advisory
is unchanged. `git diff --check` passes.

Durable lifecycle rules are:

1. A platform-owned control projected into Lab-authored DOM must survive
   replacement of that Lab subtree. Projection ownership includes
   reconciliation after target DOM replacement.
2. Platform-owned projection reconciliation must be idempotent and disposed
   with its target. Never solve projection loss by creating duplicate controls.
3. Lab internals do not call platform-host implementation hooks after each
   render merely to repair platform-owned presentation.
4. Secondary navigation controls use the same availability authority as the
   primary workflow. A stored historical result does not by itself make a
   **current output** control valid.

The in-scope Phase 3 correction severity is `P0 = 0`, `P1 = 0`, `P2 = 0`, and
`P3 = 0`. Separately, `PHASE2-P3-04` remains **OPEN / Phase 4** and is not a
Phase 3 remaining defect. No Phase 4 or Phase 5 work started. There is no
numerical, expression-authority, Convergence, Compare numerical, Linear Systems
inner, Computation Trace, Motion, Tutor feature/prompt/API, Glossary model or
content, PDE, dependency, deployment-configuration, push, or deployment change.
The exact next gate is **narrow independent Phase 3 correction re-audit, then
final Maintainer Phase 3 acceptance**.

### Authorization, accepted prerequisite, and result

Cross-Lab Presentation Sync Phase 2 is **MAINTAINER ACCEPTED WITH P3
CARRY-FORWARD** at HEAD `331bea3e695fb59620e7c316a27480549643c6f4`
(tree `9e49edeae9aff206435dca577933046189a86ddc`). Its independent audit
reported `P0 = 0`, `P1 = 0`, `P2 = 0`, and `P3 = 4`. Phase 3 started from
that clean accepted checkpoint and was separately authorized for ODE inner
presentation only.

The Phase 2 findings are disposed as follows:

- `PHASE2-P3-01` is closed: the two shared `font-size: 1rem` declarations now
  use the accepted Phase 0 body typography token;
- `PHASE2-P3-02` is closed: adversarial tests cover multiple generated-ID
  instances, local valid `aria-labelledby` targets, and caller-owned native
  `h2` through `h6` preservation;
- `PHASE2-P3-03` is corrected here: the complete live fixture contains **33
  formula owners**, not 29, and every owner has one direct hidden visual
  MathML tree; and
- `PHASE2-P3-04` remains open for Phase 4. Linear Systems still owns its
  existing `.ls-primary-result[data-primary-result]`; Phase 4 must replace,
  not nest, that identity when its Output migrates.

Phase 3 is implemented and locally verified as a candidate. The carry-forward
closure commits are `249225ea6703dbe53da689b28a67e8cfc35ae91a` (tree
`63089e027935b6e1dea86c685953b28b85fe12b1`) and
`033017fa69d9b4b10edcee0e9449ec752d17d7a9` (tree
`449e26077243c0331b22a852911d59b8d311fb05`). The ODE migration is
`cc6850b75c6102258101a059856870a57e8657f5` (tree
`319fb71e8d769ef50058a9c81b988754039581a7`), followed by the narrow
320-pixel containment correction `e1eefd98480b2f11eb796ea6117e7a428753c62a`
(tree `251220912f44ad28dbe85d56a174e9dde7cea7e4`). The final explicit local
ARIA-target proof is `4c9720b811e2001683e25ff733052b77c2dca67a`
(tree `874b07332625c1f5d2be6fed38c86d5e452b2847`). Phase 3 is not Maintainer
accepted.

### Phase 3 Maintainer visual corrections

The Maintainer's direct visual review opened two P3 presentation findings, and
the narrow correction is implementation commit
`ff01b80c8d570520eb20b345046d5d9343877816` (tree
`b10012675b49146dcac5a56dff60ea0ebdd08076`). `PHASE3-VIS-01` originated in
the ODE-owned `.ode-primary-numeric-value` rule: it used the Phase 0
`--lab-type-numeric-size` hero-scale token even though the value is a technical
primary answer, not a dashboard KPI. The ODE rule now uses the existing fluid
`--lab-type-stage-title-size` token and the accepted technical-font token. It
does not change the `PrimaryResult` structure, accessible label, value,
precision, formatter, or supporting-metric ownership. Primary numerical
importance is expressed through hierarchy, not extreme font size.

`PHASE3-VIS-02` was the combined effect of the shared `NumericalTable` row-
header default and the intentional ODE caller structure: the first cell is a
semantic `<th scope="row">`, so the generic `tbody th` weight of 700 applied;
the ODE numeric rule did not override that inherited presentation. The row
header remains a row header. An ODE-scoped rule now gives both stored-value
`tbody th` and `tbody td` the same regular weight while preserving the caption,
column headers, tabular technical font, alignment, values, precision, row
selection, and local overflow. Peer numerical columns do not receive arbitrary
weight differences, and native table semantics may remain stronger than visual
font weight. No final-row emphasis was introduced.

Fresh browser verification passed successful Forward Euler Output at 1440 ×
900 in Light and Dark, 390 × 844, and 320-pixel stress. The primary value is
30.4 px against 16 px supporting values on desktop, has a content-driven
109.6-pixel answer box, and fluidly reduces to 22.4 px at both narrow widths;
`0.00377789` remains unclipped, visibly primary, and page-contained. Stored
values retain 700-weight column headers while both body columns compute to 400
in desktop Light/Dark and at 390 pixels. The 12 rows remain readable, the table
keeps local horizontal scrolling on mobile, and there is no page-level
overflow. Browser warning/error logs were empty.

The Compare smoke retained balanced 30.4-pixel answers and the unchanged
Forward Euler `0.00377789` / Runge-Kutta 4 `0.00673848` values. The bounded
Linear Systems Output smoke retained one non-nested `data-primary-result`, the
computed solution, existing MathML/factorization presentation, and no ODE
numeric selector; no Linear Systems source or `PHASE2-P3-04` state changed.
Focused verification passed four files / 43 tests. Import boundaries passed,
and the one required complete `npm.cmd run verify` passed 95 files / 1,268
tests, all frontend/numerics/contracts/backend typechecks, and the 108-module
Production build; `git diff --check` passed. No other Phase 3 redesign was
made.

The two Maintainer visual findings are corrected, but Phase 3 remains a
candidate and is not self-declared accepted. Cross-milestone severity remains
`P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 1`; the sole P3 is the out-of-scope
`PHASE2-P3-04`, still open and Phase 4-owned. The exact next gate is
**independent Phase 3 ODE presentation / behavior-equivalence audit**, then
**final Maintainer visual review**.

### Phase 3 Maintainer information-hierarchy refinement

`PHASE3-HIER-01` was a P2 presentation finding: ODE had adopted the shared
LabShell, LabHeader, workflow, and Stage primitives without fully retiring its
older pre-system header copy layers and information placement. The result was
a correct component vocabulary wrapped in a visibly denser hierarchy than the
current Linear Systems reference. The bounded ODE-only correction is
implementation commit `013fb552f09824921a5eda664462df0f0bf2f21f` (tree
`33d1061ac1fc739776dff642fb63d731b52bc448`). No shared primitive or Linear
Systems source required a change.

The ODE header now follows breadcrumb, one `h1`, one concise mathematical
purpose, one compact experiment identity, actions, then workflow. The old
`AI-Assisted Educational Solver` eyebrow was deleted without replacement. The
long purpose now reads: `Explore fixed-step methods for a first-order ordinary
differential equation posed as an initial value problem, then examine error,
convergence, and numerical behavior.` Its two accepted Glossary annotations
remain in the sentence. Existing derived state now presents `Beginner starter
· Forward Euler` or `Custom experiment` as one compact identity owner. The
persistent starter explanation was removed because Method selection and Data
preset guidance already carry its useful teaching intent.

The combined header instruction about familiar mathematical notation and the
`t`/`y` versus `t`/`u` profiles was relocated to the relevant Data editor. The
first-order editor now says `Enter the equation in familiar mathematical
notation. First-order fields use t and y.` The Leap-Frog editor uses the same
lead followed by `Leap-Frog acceleration uses t and u.` The existing editable
field component owns the visible description and includes its ID, together
with the status ID, in the field's `aria-describedby`; this is an information-
placement change only and does not alter expression authority, MathLive,
validation, or variable profiles.

Method now scans as Stage label, `Choose a method`, Compare, and the unchanged
eight-card catalog. The approved Explicit-scheme sentence is no longer a
catalog-wide lead above explicit and implicit choices. Its complete annotated
owner, exact wording, and Glossary binding move together into a compact
`aside` labelled `Explicit method concept` after the method grid. The Compare
entry no longer has a large inset-bar treatment; its behavior, prompt, error
alert, and shared-model meaning are unchanged, with active pick guidance now
owned inside Method instead of LabHeader. Method card identity, descriptions,
order, selection, formulas, annotations, and availability are unchanged.

Fresh paired browser review used the real ODE and Linear Systems routes. At
1440 × 900 in Light, ODE header height fell from 330.9 px to 199.4 px and the
Method Stage top moved from 571.6 px to 440.1 px; the untouched Linear Systems
reference measured 210.4 px and 435.1 px. Both therefore use the same outer
header/workflow/Stage grammar while ODE remains an exploratory method catalog
and Linear Systems remains teaching-focused. Desktop Dark Method and Data
preserved equivalent hierarchy and page containment. At 390 × 844, ODE fell
from a 520.9-pixel header and 732.9-pixel Stage top to 326.0 px and 538.0 px;
Linear Systems remained 280.8 px and 508.8 px. ODE's remaining height reflects
its longer domain purpose and two-line title at that width rather than an extra
slogan or teaching layer. At 320 pixels ODE remained page-contained with a
compact identity, naturally wrapped actions/copy, 403.1-pixel header, and
612.7-pixel Method Stage top. ODE Data at 390 pixels retained readable editor
help and its accessible association. Browser warning/error logs were empty for
both Labs.

The external, uncommitted evidence directory remains
`C:/Users/bruce/.codex/visualizations/2026/08/12/019ff741-984c-7e42-967c-d757d759589a`
and now also contains `phase3-1-ode-method-light`,
`phase3-1-ls-method-light`, `phase3-1-ode-data-light`,
`phase3-1-ls-data-light`, `phase3-1-ode-header-mobile`, and
`phase3-1-ls-header-mobile` PNG evidence.

The browser regression smoke retained the successful Forward Euler
`0.00377789` result, the accepted 30.4-pixel desktop primary-answer size, and
400-weight stored-value row headers and peer cells. Output structure,
formatting, precision, chart, Compare results, and Convergence did not change.
New experiment retained its accessible confirmation dialog and cancellation;
Tutor retained lazy open/close behavior and focus; both Context and relocated
Method Glossary owners opened correctly. Focused verification passed seven
files / 67 tests. The mandatory complete `npm.cmd run verify` passed 95 files /
1,270 tests, all frontend/numerics/contracts/backend typechecks, import
boundaries, and the 108-module Production build. The Production exclusion scan
found no DEV route/path/title markers in built HTML, CSS, or JavaScript, and
`git diff --check` passed.

Durable information-hierarchy rules are:

1. Cross-Lab consistency includes information placement, not only shared
   components and CSS.
2. LabHeader orients the learner; stage-specific teaching belongs in the Stage
   where it is needed.
3. A shared presentation primitive does not justify retaining obsolete pre-
   system wrappers or copy layers around it.
4. Cross-Lab synchronization standardizes information grammar, not domain
   personality.

`PHASE3-HIER-01` is corrected, but Phase 3 remains an implemented and locally
verified candidate and is not self-declared Maintainer accepted. Current
cross-milestone severity is `P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 1`; the sole
P3 remains `PHASE2-P3-04`, still open and Phase 4-owned. The accepted Output
corrections are retained. The exact next gate remains **independent Phase 3
ODE presentation / behavior-equivalence audit**, then **final Maintainer
visual review**.

### Phase 3 peer-alignment polish

The Maintainer identified three peer groups whose semantic roles were already
correct but whose visual baselines drifted with preceding copy or separate
layout ownership. The bounded structural correction is implementation commit
`31f9ccee3d1f9fcf67fd2b1bb80cf389dc55c1ee` (tree
`91192bd4c82c859ec02354bbf08b88c7f0b3ff0d`). It preserves the accepted
hierarchy, typography, copy, routes, status language, action priority,
method-card content, and numerical behavior.

Home module cards already stretched to one equal-height desktop grid row, but
their children remained in normal block flow. `homePage.ts` now gives all
three actions the same `.platform-module-card-action` owner, while
`platform.css` makes `.platform-module-card` a content-driven flex column and
settles that owner with `margin-top: auto`. No spacer, blank content,
copy-specific margin, fixed card height, or PDE-only offset was introduced.
At 1440 × 1000 in both Light and Dark, the Numerical ODE **Open Lab**,
Numerical Linear Algebra **Open Lab**, and Numerical PDE **View roadmap**
controls each measured top `819.17`, bottom `863.17`, height `44.00`, and
vertical center `841.17` pixels inside equal `244.76`-pixel cards. At 390 and
320 pixels the cards stack at their natural individual heights, retain a
16-pixel description-to-action gap, and have no page-level overflow or added
dead space. Primary Open Lab and secondary View roadmap styling, Available /
Planned truth, link semantics, routes, and focus treatment are unchanged.

The ODE header drift had two connected structural causes. `New experiment`
was inside the shared LabHeader action group while the Platform Tutor launcher
was rendered in a separate shell rail; at 390 pixels the launcher consequently
appeared near the end of a 2,290-pixel page instead of in the header. In
addition, legacy domain button classes could override the low-specificity
shared action geometry. `LabHeader` now exposes its existing action group with
`data-lab-header-actions`. `PlatformTutorHost` projects only its closed-state
launcher into that owner when one exists, retains the rail for the loaded
Tutor presentation and for non-LabHeader fallbacks, removes/recreates the
launcher across open, close, suspend, disconnect, and dispose, and restores
focus to the recreated launcher. The launcher remains a native primary button
after the native secondary New experiment button. Shared
`labPresentation.css` now owns header-action flex centering, 44-pixel minimum
height, padding, and radius through `.lab-header-actions > .lab-action`; the
old sticky launcher rule is limited to a direct rail fallback.

At 1440 × 1000 in Light and Dark, both ODE actions measured top `157.79`,
bottom `201.79`, height `44.00`, vertical center `179.79`, 10-pixel radius,
8-pixel block padding, 24-pixel line height, and an intentional `8.00`-pixel
gap. DOM order is exactly **New experiment**, then **Open AI Tutor**. At 390
pixels both remain side-by-side with the same 44-pixel geometry and 8-pixel
gap. At 320 pixels they wrap naturally in that source order at top `260.02`
and `312.02`, remain 44 pixels high, and do not widen the page. Opening and
closing the projected launcher is structurally tested, including focus return.
The current Linear Systems Lab has no Tutor launcher; its bounded shared-style
smoke retained the native secondary New experiment button at 44 pixels high,
10-pixel radius, 8-pixel block padding, zero page overflow, and successful
Cancel focus return. No Linear Systems source changed.

ODE method cards already stretched naturally to each CSS Grid row, but their
scope tags followed variable-length descriptions in normal flow. The existing
shared card renderer now adds the common `.method-scope-tag` owner to every
applicability tag. ODE CSS makes the method card a flex column and gives that
tag owner `margin-top: auto`. There is no per-method class, fixed description
height, universal row height, spacer, transform, absolute position, or copy
change. At 1440 × 1000 in Light and Dark, row 1's four tags all measured top
`810.68`, bottom `834.01`, height `23.33`; row 2's four tags all measured top
`980.68`, bottom `1004.01`, height `23.33`. Row 1 cards remain naturally
`186.67` pixels high and row 2 cards `154.00` pixels high. All eight names,
order, descriptions, first-order text, Leap-Frog second-order text, native
button semantics, selected state, click/keyboard behavior, Glossary
annotations, and Compare behavior remain unchanged. The one bounded adjacent
same-owner effect is beneficial: Compare's method-selection cards use this
same renderer and therefore inherit the same durable tag-footer alignment; no
additional surface was changed.

Mobile browser review at 390 × 844 and 320 × 844 confirmed content-driven Home
cards, equal and comfortable header actions, one-column method cards with each
tag naturally below its own description, expected local workflow-rail
scrolling, and zero page-level overflow. Desktop and mobile browser logs had
zero warnings and zero errors. The external, uncommitted evidence directory is
`C:/Users/bruce/.codex/visualizations/2026/08/12/019ff741-984c-7e42-967c-d757d759589a`
and contains the `phase3-2-home-light.jpg`, `phase3-2-home-dark.jpg`,
`phase3-2-ode-light.jpg`, `phase3-2-ode-dark.jpg`,
`phase3-2-home-390-viewport.jpg`, `phase3-2-ode-390-viewport.jpg`,
`phase3-2-methods-390-viewport.jpg`, `phase3-2-home-320-viewport.jpg`,
`phase3-2-ode-320-viewport.jpg`, and
`phase3-2-linear-systems-smoke.jpg` evidence.

Focused verification passed seven files / 81 tests across Home, shared Lab
presentation, Platform Tutor Host placement/lifecycle, ODE route/lifecycle/New
experiment, and Linear Systems. Import boundaries passed. The required full
`npm.cmd run verify` passed 95 files / 1,271 tests, all
frontend/numerics/contracts/backend typechecks, and the 108-module Production
build; `git diff --check` passed. No numerical, expression, session, Output,
Compare, Convergence, Motion, Tutor-feature, Glossary, PDE, dependency,
deployment, or Phase 4/5 change was made.

Phase 3 remains an implemented and locally verified candidate and is not
self-declared Maintainer accepted. Current cross-milestone severity remains
`P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 1`; the sole P3 is still
`PHASE2-P3-04`, open and Phase 4-owned. The exact next gate remains
**independent Phase 3 ODE presentation / behavior-equivalence audit**, then
**final Maintainer visual review**.

### ODE presentation mapping and domain authority

The real Initial Value Problems Lab now consumes the accepted Phase 2 shared
presentation primitives where its existing evidence naturally maps:

- Method uses one `TeachingBlock` headed **Choose a method** around the
  existing method list and Compare controls. The eight method cards remain
  domain-owned native buttons, retain their order, descriptions, selection,
  and formula rendering, and use subordinate `h3` headings.
- Data keeps its existing form, field labels, presets, MathLive editors,
  exact-solution controls, validation, and Run behavior. Only the existing
  preset teaching is composed as a `TeachingBlock` headed **Preset guidance**;
  no field-card nesting or copy rewrite was added.
- Successful single Output uses one `ProblemContext` before one
  `PrimaryResult`. The context is authored only from the successful expression
  snapshot and the immutable `lastProblemInputs` captured by the successful
  Run; current edited drafts never supply prior-result context. The final
  numerical approximation is the explicit primary answer, followed by compact
  stored-grid-point, final-time, and applicable final-derivative metrics.
- Method metadata/formula uses a standard `EvidenceBlock`; the Chart.js canvas
  uses another standard `EvidenceBlock`; and the last 12 stored values use the
  shared semantic `NumericalTable` inside a standard `EvidenceBlock`. ODE still
  owns metadata, mathematical rendering, chart datasets/options/theme/lifecycle,
  row selection, and numeric formatting.
- Compare uses one shared result-owned `ProblemContext` and one
  `PrimaryResult` containing two explicitly labelled method answers plus the
  neutral absolute-difference metric. Two method evidence blocks, one existing
  two-series chart, and one semantic comparison table follow. It declares no
  winner, and Tutor remains unavailable exactly as before.

The accepted Forward Euler starter still displays `0.00377789`; the browser
Compare run still displays Forward Euler `0.00377789` and RK4 `0.00673848`.
Existing exact-solution entry and Convergence exact/error evidence remain
unchanged; Phase 3 invents no error metric. Successful Run moves focus to the
result `h2` with `preventScroll`. Hydration, ordinary navigation, failed Run,
and return to a stored Output do not create a second result announcement or
replace immutable successful evidence.

No `ComputationWalkthroughShell` is mounted in ODE because ODE has no
authoritative computation trace. Result/grid arrays are not treated as a
trace. Phase 3 adds no `AdvancedDetails`: existing visible method teaching
stays visible and existing native Convergence disclosures remain under the
Convergence owner. Convergence is intentionally not migrated to
`AnalysisSurface`; its state, controls, exact-solution eligibility, preview,
run, classifications, table, chart, teaching, budgets, and lifecycle remain
domain-local pending Phase 5.

### CSS, accessibility, lifecycle, and boundaries

ODE retired the duplicate `.summary`, `.stat*`, `.edu-panel`,
`.problem-equation`, `.chart-section`, `.table-section`, `.table-scroll`, and
broad output-table presentation rules after their shared replacements were
mounted. `odeApp.css` now keeps domain-specific method/preset composition,
editor, formula, Chart.js frame, Compare, Convergence, and ODE numeric
typography. Shared presentation CSS continues to own primitive surfaces,
spacing, status, heading, table, and disclosure language.

A 320-pixel browser stress pass exposed two contained-layout defects. First,
the Convergence host was a min-content grid item wider than its Stage. Second,
Compare's existing 280-pixel minimum method-evidence track widened direct
children inside a 239-pixel content track. The correction adds `min-width: 0`
to the ODE results/Convergence containment chain and changes only the narrow
Compare grid minimum to `minmax(0, 1fr)`. After recheck, both Stages have equal
client/scroll widths, the workflow and numerical table alone retain intended
local horizontal scrolling, and document overflow is zero.

The migrated ODE retains one page `h1`, one current native workflow step, a
stage `h2`, subordinate `h3`/`h4` evidence headings, unique IDs with valid
local labels, one accessible owner per formula, a labelled Primary Result and
Problem Context, a named chart canvas, native caption/header/table semantics,
visible focus, native disclosures, existing Glossary trigger semantics, and
Tutor focus return. This is a structural and browser audit, not screen-reader
certification. Failed Run leaves the prior successful result reachable and
shows attempt-owned validation; matching-output reachability, New experiment,
route remount, scroll capture, session ownership, Chart destruction/recreation,
Tutor, and Glossary lifecycle tests remain green.

### Browser, Linear Systems smoke, and screenshots

Fresh in-app browser review passed desktop Light and Dark, 390-pixel mobile,
and 320-pixel stress for Method, Data, successful single Output, Compare,
chart/table evidence, and current Convergence. The primary answer precedes its
evidence; cards are one column on mobile; context and answers stack without
clipping; Chart.js remains contained; the values table scrolls locally; and
Light/Dark preserve equivalent hierarchy. Tutor and Glossary opened and closed
at 320 pixels without page overflow. Warning/error logs were empty.

A bounded Linear Systems regression smoke confirmed its unmigrated Method,
Output, and Diagnostics presentation at desktop and 390 pixels. The route has
no Replay/Motion mount, remains page-contained, and still exposes the accepted
residual evidence. No Linear Systems inner source was changed, and
`PHASE2-P3-04` was not fixed.

The external, uncommitted evidence directory is:

`C:/Users/bruce/.codex/visualizations/2026/08/12/019ff741-984c-7e42-967c-d757d759589a`

It contains `phase3-ode-method-light`, `phase3-ode-data-light`,
`phase3-ode-output-light`, `phase3-ode-output-dark`,
`phase3-ode-compare-light`, `phase3-ode-chart`,
`phase3-ode-mobile-output`, `phase3-ode-mobile-compare`,
`phase3-ls-method-smoke`, and `phase3-ls-output-smoke` PNG evidence.

### Verification, Production graph, and bundle

The migration-focused gate passed 16 files / 142 tests. The final containment
recheck passed four presentation/ODE/boundary files / 51 tests plus the
Convergence view file / 15 tests; the tightened local-label assertion then
passed its focused file / 12 tests. The standalone full suite and mandatory
`npm.cmd run verify` both pass 94 files / 1,266 tests. Frontend, numerics,
contracts, backend/API typechecks pass; import boundaries remain four owners
plus the Vercel adapter; and `git diff --check` passes.

The Production build transforms 108 modules. The DEV presentation route and
markers are absent from `dist`. The platform entry names the ODE, Linear
Systems, and shared presentation chunks only as dynamic route dependencies;
it does not absorb them. Exact raw/gzip metrics are:

| Asset | Phase 2 accepted | Phase 3 candidate |
|---|---:|---:|
| Entry JS | 56.73 / 17.48 kB | 56.73 / 17.49 kB |
| Platform CSS | 29.51 / 5.39 kB | 29.51 / 5.39 kB |
| Shared Lab JS | 4.54 / 1.59 kB | 5.69 / 1.88 kB |
| Shared Lab CSS | 18.46 / 3.22 kB | 18.50 / 3.22 kB |
| ODE JS | 295.53 / 94.57 kB | 303.72 / 96.53 kB |
| ODE CSS | 14.71 / 3.46 kB | 14.62 / 3.51 kB |
| Linear Systems JS | 71.01 / 21.15 kB | 71.01 / 21.15 kB |
| Linear Systems CSS | 28.08 / 5.05 kB | 28.08 / 5.05 kB |

The ODE JS increase is the real domain's first consumption of the Phase 2
composition code and its new authored DOM assembly. Chart.js remains inside
the ODE route asset rather than a shared/entry asset. The separately emitted
Convergence state asset remains 58.11 / 17.24 kB. Tutor remains separately
deferred at 12.14 / 4.61 kB JS and 6.61 / 1.81 kB CSS; Glossary remains
separately deferred at 10.13 / 3.50 kB JS and 4.83 / 1.31 kB CSS. MathLive and
editable/Compute Engine remain interaction-deferred at 819.11 / 228.04 kB and
1,143.84 / 308.80 kB JS respectively. The existing large-chunk advisory is
unchanged; no `manualChunks`, dependency, or eager-loading change was made.

### Durable rules, remaining findings, and next gate

1. Use a shared primitive only where domain evidence naturally maps to its
   semantic role; cross-Lab consistency does not require every domain to use
   every primitive.
2. An ODE Computation Walkthrough requires authoritative ODE trace evidence;
   grid and result arrays are not retroactively a trace.
3. Output problem context comes from successful evidence authority, never
   unrelated current drafts.
4. Domain visualization remains domain-owned when framed by a shared
   `EvidenceBlock`.
5. Convergence and Diagnostics may share Analysis presentation later without
   sharing state, numerical meaning, or lifecycle.

All in-scope Phase 3 findings found during implementation are corrected.
Current cross-milestone severity is `P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 1`:
the sole P3 is `PHASE2-P3-04`, the explicit out-of-scope carry-forward that
remains Phase 4-owned.

There is no Linear Systems inner migration, AnalysisSurface migration, ODE
Computation Walkthrough, numerical or Computation Trace change,
expression-authority or session-schema change, Motion remount, Tutor or
Glossary feature/content change, PDE work, dependency change, push, Preview,
or Production deployment. The exact next gate is **independent Phase 3 ODE
presentation / behavior-equivalence audit**, then **Maintainer visual
review**. Stop before Phase 4 and Phase 5.

The documentation checkpoint commit containing this candidate record is
reported externally because a commit cannot self-reference its final SHA and
tree.

## Cross-Lab Presentation Sync Phase 2 — Maintainer accepted with P3 carry-forward — 2026-08-19

### Authorization, Phase 1 acceptance, and result

Work started from clean `main` at the Maintainer-accepted Phase 1 final HEAD
`881795715799cde4d41f7bd933303bea4db1f8a8` (tree
`5a64a6973ecddf710cad51c01220f7cacd646bdb`). The independent Phase 1 audit
passed, its full verification passed 93 files / 1,249 tests, and the
Maintainer completed visual review. Cross-Lab Presentation Sync Phase 1 is
therefore **MAINTAINER ACCEPTED**.

That acceptance carried exactly one non-blocking P3,
`PHASE1-VIS-01`, for the non-current workflow visual hierarchy. The
Maintainer separately authorized Phase 2 plus that one correction. Phase 2 is
implemented and locally verified at implementation
commit `6add7174fb160cf4e377664d486905152583e4c2` (tree
`3f7dd9c49106c2e4631c6e01dde789cb051a4178`). The Maintainer subsequently
accepted Phase 2 at HEAD `331bea3e695fb59620e7c316a27480549643c6f4`
(tree `9e49edeae9aff206435dca577933046189a86ddc`) with the independent-audit
result `P0 = 0`, `P1 = 0`, `P2 = 0`, `P3 = 4`. The Phase 3 section above
records the exact disposition of those four carry-forwards.

### Shared primitive ownership and contracts

The following presentation-only source now exists under
`frontend/src/components/lab-presentation/`:

- `problemContext.ts` composes a labelled authoritative problem snapshot from
  an authored heading, mathematical statement, compact parameters,
  provenance, and optional visible stale qualification;
- `teachingBlock.ts` composes optional eyebrow, lead, authored mathematics,
  definition list, ordered steps, examples, limitation, and subordinate
  detail without forcing a card for compact teaching;
- `primaryResult.ts` places visible current/stale text and optional problem
  context before an explicitly labelled main answer, then optional comparison,
  metrics, and visualization evidence in content-driven height;
- `evidenceBlock.ts` supports exactly `summary`, `standard`, and `advanced`
  evidence levels with authored formula, metric, chart, table, status, and
  disclosure slots;
- `supportingElements.ts` now also owns a semantic `NumericalTable` with
  caption, scoped column/row headers, tabular numeric cells, and one local
  overflow frame, plus native closed `AdvancedDetails`/`summary` composition;
- `computationWalkthroughShell.ts` owns ordered authored phases and steps,
  visible Before/Operation/After source order, optional subordinate detail,
  failure boundary, and completion evidence. It neither reconstructs nor
  invents numerical operations and requires no motion or Replay.

All supplied nodes are appended by identity. A mathematical DOM tree has one
parent; if two accessible owners need the same mathematical meaning, the
domain caller must author a fresh visual tree. Shared code does not clone,
serialize, reparse, evaluate, or infer mathematical meaning. It imports no
Router, Store, Lab session/result type, numerical package, solver, preset,
Chart.js, MathLive, Compute Engine, Tutor, Glossary, Computation Trace,
domain math renderer, convergence controller, or Motion controller.

Accessibility contracts are structural: every context/result/evidence/
walkthrough region is labelled by a native heading; Teaching retains native
`dl`/`ol`; Primary Result gives each answer its own visible label;
NumericalTable uses native table semantics; walkthrough phases and steps are
native ordered lists; AdvancedDetails is native `details`/`summary`; and no
automatic live region was introduced. The complete live fixture contains 33
accessible formula owners, each with exactly one direct `aria-hidden="true"`
MathML visual tree, zero unowned MathML trees, and zero duplicate visual
owners.

### Fixture proof and hierarchy verdict

The existing DEV-only `/__dev/presentation-system` route now has one clearly
separated **Phase 2 · Content hierarchy** area. It uses static authored data
only and demonstrates:

- three standalone Problem Contexts for Linear Systems, ODE, and a conceptual
  future PDE, plus one context inside each of three Primary Results;
- one full and one compact Teaching Block;
- dominant Linear Systems and ODE results plus a two-answer Compare result;
- exactly three Evidence Blocks: residual summary, ODE formula/chart standard
  evidence, and subordinate P/L/U advanced evidence;
- one semantic ODE refinement table and three closed advanced disclosures;
- one walkthrough with Linear Systems elimination, an ODE step, and a
  conceptual future-PDE stencil step. Every corridor is source, operation,
  target in that DOM order and the static evidence is complete without
  animation.

The hierarchy verdict is clean: ProblemContext orients, Teaching reads as
content rather than stacked cards, PrimaryResult has the strongest Output
surface, Evidence supports without competing, and AdvancedDetails recedes.
The fixture uses the accepted Method blue, Data teal, Output violet, Analysis
amber, typography, surface, border, spacing, radius, and status tokens. It
adds no palette, font, gradient, animation, framework, or dependency.

### PHASE1-VIS-01 correction and real-Lab regression

`WorkflowNavigation` now exposes only the accepted
`current / available / unavailable` state vocabulary on each item and native
button. Current retains the strongest role-specific tint/rail/label weight;
available is a neutral raised interactive control with calmer border/surface
and bounded hover/focus; unavailable uses lower contrast, dashed borders, and
native `disabled`. Existing `aria-current="step"` and availability callbacks
are unchanged. No `completed`, `visited`, or `done` state, class, or history
meaning was added.

Fresh browser runs verify both real workflows. ODE begins Method current, Data
available, Output unavailable; Data makes Method available and Data current;
a successful Run makes Method/Data available and Output current. Linear
Systems begins Method current, Data available, Output/Diagnostics unavailable;
Data becomes current; a successful Run makes Output current and Diagnostics
available; activating Diagnostics makes it current while Method/Data/Output
remain available. The smoke changed no inner ODE or Linear Systems markup,
copy, mathematics, result authority, lifecycle, or numerical behavior.

### Browser and visual evidence

The Phase 2 fixture passed fresh in-app browser review at 1440 × 900 Light and
Dark, 390 × 844 Light and Dark, and 320-pixel stress. At every width the page
and Phase 2 root have equal scroll/client widths. Primary results remain the
dominant surface, metrics wrap, the context/teaching/evidence grids collapse
without excessive nesting, and walkthrough corridors stack in visible
Before/Operation/After order. At 320, the 663-pixel numerical table scrolls
inside its 271-pixel frame and the one remaining wide formula uses local
`overflow-x: auto`; neither widens the page. Light and Dark use equivalent
hierarchy, all details begin closed, and browser warning/error logs are empty.

Real workflow visual evidence covers desktop Light plus ODE mobile Dark at
390. Current remains unmistakable in all four role colors, available remains
interactive but secondary, and unavailable remains visibly disabled. The
external, uncommitted review packet is:

`C:/Users/bruce/.codex/visualizations/2026/08/12/019ff741-984c-7e42-967c-d757d759589a/phase2-content-hierarchy`

It contains the required `phase2-context-result-light/dark`,
`phase2-teaching-evidence-light/dark`, `phase2-walkthrough-desktop`,
`phase2-mobile-light/dark`, `phase2-320`, `phase2-workflow-ode`, and
`phase2-workflow-ls` PNG files.

### Tests, Production exclusion, and bundle evidence

The test-first red gate failed only on the deliberately missing Phase 2
modules, fixture content, and workflow state metadata. The final focused gate
passes 5 files / 44 tests. It covers primitive structure, node identity,
current/stale text, explicit answer labels, all three evidence levels,
semantic table/disclosure contracts, ordered walkthrough/failure/completion
structure, prohibited imports/framework/cloning, shared route ownership, and
DEV Production exclusion.

The complete `npm.cmd run verify` passes 94 files / 1,262 tests, frontend/
numerics/contracts and backend/API typechecks, import boundaries for four
owners plus the Vercel adapter, and the Production build. The build transforms
104 modules. Exact raw/gzip metrics are:

| Asset | Phase 1 accepted | Phase 2 candidate |
|---|---:|---:|
| Entry JS | 56.73 / 17.49 kB | 56.73 / 17.48 kB |
| Platform CSS | 29.51 / 5.39 kB | 29.51 / 5.39 kB |
| Shared Lab JS | 4.41 / 1.54 kB | 4.54 / 1.59 kB |
| Shared Lab CSS | 7.62 / 1.67 kB | 18.46 / 3.22 kB |
| ODE JS | 295.53 / 94.57 kB | 295.53 / 94.57 kB |
| ODE CSS | 14.71 / 3.46 kB | 14.71 / 3.46 kB |
| Linear Systems JS | 71.01 / 21.15 kB | 71.01 / 21.15 kB |
| Linear Systems CSS | 28.08 / 5.05 kB | 28.08 / 5.05 kB |

The workflow metadata adds only 0.13/0.05 kB raw/gzip to the shared Lab JS.
Phase 2 shared CSS adds 10.84/1.55 kB raw/gzip to the existing Lab-only lazy
stylesheet; it does not enter the platform entry. Static graph tests prove the
new Phase 2 TypeScript modules are absent from the entry, ODE, and Linear
Systems route graphs until later migration. The Production manifest/assets
contain no Presentation System fixture module/style, Phase 2 heading, future
PDE fixture copy, or fixture selector. `git diff --check` passes.

### Problems, resolutions, durable rules, and stop gate

The first 320-pixel browser pass found three long fixture formulas painting a
few pixels beyond their primitive slot while the document itself remained
contained. Root cause was that the new primitive math slots had `max-width`
but did not consistently own local horizontal overflow. The correction adds
local overflow only to Phase 2 problem-statement, primary-answer,
evidence-formula, and walkthrough-corridor math owners. Recheck leaves one
intentionally wide formula locally scrollable and page overflow at zero. No
other visual, structural, accessibility, or boundary finding remains; current
severity is `P0 = P1 = P2 = P3 = 0`.

Durable rules:

1. Shared presentation primitives accept domain-authored content and never
   infer mathematical meaning.
2. Supplied mathematical DOM nodes have one parent; composition appends by
   identity, and callers author fresh trees for additional owners.
3. `PrimaryResult` dominates; `ProblemContext` orients; `EvidenceBlock`
   supports; `AdvancedDetails` stays subordinate.
4. Workflow vocabulary remains `current / available / unavailable` unless a
   domain explicitly owns another semantic state; presentation never invents
   completed history.
5. Phase 2 primitives are proven through authored fixtures before domain Lab
   migration.

At this historical Phase 2 checkpoint there was no real ODE or Linear Systems
inner migration, AnalysisSurface production implementation, numerical/Trace/
session/Teaching v2/native-MathML architecture change, Motion, Tutor,
Glossary, PDE, dependency, push, Preview, or Production deployment. Its former
review gate is superseded by the accepted prerequisite and Phase 3 candidate
record above.
The documentation commit containing this section is reported externally
because a commit cannot self-reference its own final SHA/tree.

## Cross-Lab Presentation Sync Phase 1 — historical shell/workflow audit candidate — 2026-08-12

*This section preserves the pre-audit implementation checkpoint. The Phase 2
section above records the subsequent Phase 1 Maintainer acceptance and
supersedes its former stop-gate language.*

### Authorization, result, and stop gate

The Maintainer formally accepts **Cross-Lab Presentation Sync Phase 0** at
final Phase 0 HEAD `0c392e218dd7006d43811ddc4d7401a0ccb7c495` (tree
`3d0bc052f9a2e58b50aeb67b52ddb36f10dcd994`). Phase 1 was separately
authorized and is now implemented and locally verified as an audit candidate.
It is not Maintainer accepted.

The shared-source commit is `48eef685aab3b31e7e206befde5944c96308f16a`
(tree `6c87027f456cee9a6af247abd731271d4b891f51`). The outer-Lab migration commit is
`d0c77f84ce444afbe418adcbdd94cfca18e1e32b` (tree
`bc6131880e0a57388c45586c4aea948d8a572835`). The exact next gate is
**independent Cross-Lab Presentation Phase 1 shell/workflow audit**, followed
by **Maintainer visual review**. Stop before Phase 2.

### Shared ownership and composition

`frontend/src/components/lab-presentation/` now owns the smallest Phase 1
shared area:

- `labShell.ts` exports the required `LabHeader` structure with authored
  breadcrumb, optional eyebrow, one native route-focus `h1`, lede, identity,
  details, and native actions; `LabShell` places that header before workflow,
  active stage, and optional existing platform/domain-owned nodes;
- `workflowNavigation.ts` renders a named `nav`, ordered list, and variable
  native-button descriptors with `aria-current="step"`, disabled
  unavailability, visible labels/numbers, role metadata, Lab-supplied
  callbacks, and bounded local current-item reveal on focus, construction, and
  rail resize. Its observer has explicit route-render/disposal cleanup;
- `stageSection.ts` owns one native labelled `section` and the shared Method,
  Data, Output, or Analysis visual role without interpreting content;
- `supportingElements.ts` applies Phase 0 action roles to existing native
  buttons/links. Phase 1 uses the secondary role for both New experiment
  actions;
- `labPresentation.css` owns only shared shell/header/workflow/stage and outer
  action geometry. It consumes accepted Phase 0 semantic surface, role,
  border, typography, spacing, radius, control, and focus tokens. It adds no
  palette, decorative gradient, glass, animation, or dependency.

Shared code receives already-authored nodes and does not clone mathematical
content. It imports no Router, Store, domain session, numerical package,
Chart.js, MathLive, Compute Engine, Tutor, Glossary, Computation Trace, or
MathML renderer. Domain live regions remain domain owned; no duplicate live
region was added.

### ODE migration and workflow authority

The ODE-owned `.shell`/`.hero`, title row, breadcrumb, identity, passive
`.steps`/`.pill`, `.panel`, and `.workflow-stage-*` outer presentation is
replaced by the shared header, three-button workflow, and active stage
section. Existing exact header/learner copy, optional technical eyebrow,
Method cards, Data form, editable mathematics, Run, Output, chart, tables,
Compare, Convergence, Tutor, Glossary, statuses, and dialog internals remain
domain owned.

ODE availability derives from existing authority and creates no second state
model:

| Stage | Available when | Activation |
|---|---|---|
| Method | Always | Browse method choices without deleting a successful output |
| Data | Single mode has a selected method, or current mode is Compare | Use the existing configured Data surface |
| Output | A successful single result matches the current selected method/order, or a successful comparison matches the current comparison pair | Reopen the existing successful Output |

Output is disabled before success and after a failed Run. Browsing Method
preserves and can return to the matching successful Output. Selecting a
different method makes the old Output unreachable but preserves the immutable
stored snapshot until an existing successful run replaces it; this avoids both
false reachability and premature result loss. ODE retains exactly three top-
level steps. Convergence did not become a fourth step.

Browser reset checks covered cancel and confirm. Cancel preserved successful
Output; confirm returned to the existing Beginner Starter Method lifecycle and
removed Output availability. Bounded ODE Host checks opened/closed Tutor and a
Glossary definition; focus returned to the connected Open AI Tutor and term
trigger controls. No Tutor or Glossary feature source changed.

### Linear Systems migration and preserved teaching/math

The Linear-Systems-owned `.ls-hero`, breadcrumb/title row/identity,
`.ls-workflow-*`, `.ls-panel`, `.ls-workflow-panel`, and `.ls-stage-*` outer
presentation is replaced by the same shared family. Its existing four-stage
session and callbacks remain authoritative: Method and Data are always
available; Output and Diagnostics require the existing successful snapshot.
Current/stale/failure rules are unchanged. The visible **Diagnostics** title
maps only to the shared `analysis` presentation role.

Universal and selected-method Teaching v2 content, matrix/vector editor,
result context, factorization, transformation corridor, trace-owned static
walkthrough, row arithmetic, residual-led Diagnostics, safeguards, and pivot
failure content are unchanged. A successful browser run retained solution
`[1, 2, −1]` and Diagnostics retained the accepted near-machine residual
`8.881784 × 10^-16`. Native MathML retains one labelled formula owner over one
hidden visual tree; the representative solution/result and residual owners
remain structurally unchanged. Show computation still reveals the existing
static walkthrough and no Replay control appears. Focused tests retain stale
snapshot authority, controlled pivot rejection, failure-evidence cleanup, and
no invented Output after failure.

Linear Systems New experiment cancel preserved Diagnostics and its successful
snapshot. Confirm returned to Starter 3×3 Method with Output and Diagnostics
disabled and the prior result removed through the existing reset authority.

### Browser, accessibility, and visual evidence

Fresh in-app browser verification used actual 1440 × 900-class DOM width,
390 × 844, and 320-pixel stress. Comparable external screenshots cover ODE
and Linear Systems Method/Data/Output in desktop Light, ODE Output and Linear
Systems Method/Output in Dark, Linear Systems Diagnostics, both Labs at 390,
all required Method/Output/Diagnostics states at 320, focus, and the
computation disclosure. Evidence is outside the repository at:

`C:/Users/bruce/.codex/visualizations/2026/08/12/019ff741-984c-7e42-967c-d757d759589a/phase1-shell-sync`

The paired review answers are positive: both Labs now share max width, title
scale, breadcrumb/lede/identity rhythm, workflow geometry, role rails, stage
surface, action hierarchy, and focus language. Neither dominates through an
accidental outer wrapper. ODE retains its exploratory cards, editable math,
chart, Compare, and Convergence character. Linear Systems retains its denser
Teaching v2, MathML, factorization, walkthrough, and diagnostic character.
Mathematical objects and charts remain the evidence; the shared chrome stays
neutral and restrained.

Every checked mobile state has `document.scrollWidth === clientWidth`.
Workflow overflow is contained to the rail; the current Method/Output/
Diagnostics button is fully within the rail at 390 and 320. Header actions
stack, titles wrap, and stage padding remains bounded. An initial desktop-to-
mobile resize exposed a current-step clipping case because construction-time
reveal had already run at desktop width. A rail-scoped `ResizeObserver` now
repeats bounded reveal after width changes and is explicitly disconnected on
render replacement/disposal.

DOM/accessibility evidence confirms one native `h1` per Lab route, named
Breadcrumb and workflow navigation landmarks, ordered native buttons,
disabled unavailable stages, text plus `aria-current` for current state,
visible role labels, labelled stage sections, and unchanged heading/math/live-
region ownership. Actual browser keyboard events focused current workflow
buttons in both Labs. Computed focus outlines were solid 2.66667 px with
Light `rgb(93, 80, 161)` and Dark `rgb(139, 169, 255)` colors. Existing native
inner controls remain keyboard focusable. This is browser/DOM evidence, not a
screen-reader certification. Browser warning/error logs were empty.

Real route leaves and returns restored ODE successful Output and Linear
Systems successful Diagnostics according to their existing in-memory session
contracts. Hidden Lab DOM was not retained; the new workflow resize observer
is part of explicit route-owned cleanup.

### CSS retirement, lazy graph, and bundle evidence

Only duplicated outer selectors were retired after the shared replacement was
mounted, focused tests passed, browser comparison passed, and `rg` found no
remaining owners. Retired ODE selectors include `.hero`,
`.lab-title-actions`, `.ode-breadcrumb`, `.experiment-identity`, `.steps`,
`.pill`, `.arrow`, `.panel`, `.workflow-panel`, and `.workflow-stage-*`.
Retired Linear Systems selectors include `.ls-hero`, `.ls-breadcrumb`,
`.ls-title-row`, `.ls-experiment-identity`, `.ls-workflow-rail`,
`.ls-workflow-step`, `.ls-workflow-number`, `.ls-panel`,
`.ls-workflow-panel`, and `.ls-stage-*`. Domain editor, card, chart, table,
Teaching, MathML, factorization, walkthrough, failure, disclosure, and
Diagnostics rules remain local.

The Production build transforms 104 modules, up from 99. Exact raw/gzip
bundle metrics are:

| Asset | Before Phase 1 | After Phase 1 |
|---|---:|---:|
| Entry JS | 56.64 / 17.45 kB | 56.73 / 17.49 kB |
| Platform CSS | 29.51 / 5.39 kB | 29.51 / 5.39 kB |
| Shared Lab JS | none | 4.41 / 1.54 kB |
| Shared Lab CSS | none | 7.62 / 1.67 kB |
| ODE JS | 293.60 / 94.05 kB | 295.53 / 94.57 kB |
| ODE CSS | 16.59 / 3.85 kB | 14.71 / 3.46 kB |
| Linear Systems JS | 71.11 / 21.06 kB | 71.01 / 21.15 kB |
| Linear Systems CSS | 30.33 / 5.42 kB | 28.08 / 5.05 kB |

The manifest entry dynamically imports both complete Labs and does not import
the shared presentation asset. Both complete-Lab manifests import the same
shared 4.41 kB JS asset and its 7.62 kB CSS. ODE and Linear Systems remain
independently lazy; Chart.js, Tutor, Glossary, MathLive, Compute Engine, and
Computation Trace retain their existing boundaries. No `manualChunks` was
added. The existing large MathLive/Compute Engine warning is unrelated.

Production-exclusion tests continue to prove that
`presentationSystemRoute`, `presentationSystem.css`, fixture marker/body copy,
and fixture selector do not enter Production. Production primitives import
Phase 0 tokens from theme authority, not DEV fixture modules.

### Tests, exact paths, and reusable rules

Focused integration verification passes 13 files / 109 tests. It covers the
9-test shared primitive contract, entry/lazy ownership and real manifest,
ODE route/lifecycle/reset/Tutor/Glossary, Linear Systems app/route/Teaching v2/
walkthrough/MathML, stale and failure authority, and DEV exclusion. The full
suite passes 93 files / 1,249 tests. Import boundaries pass for four owners
plus the Vercel adapter. Frontend, numerics, contracts, backend/API typechecks,
Production build, complete `npm.cmd run verify`, and `git diff --check` pass.

Implementation paths changed exactly:

- shared: `frontend/src/components/lab-presentation/labShell.ts`,
  `workflowNavigation.ts`, `stageSection.ts`, `supportingElements.ts`,
  `labPresentation.css`, and `labPresentation.test.ts`;
- ODE: `frontend/src/labs/ode/odeApp.ts`, `odeApp.css`,
  `initialValueProblemsRoute.test.ts`, `odeLifecycle.test.ts`, and
  `odeGlossary.test.ts`;
- Linear Systems: `frontend/src/labs/linear-algebra/linearSystemsApp.ts`,
  `linearSystems.css`, `linearSystemsApp.test.ts`, and
  `linearSystemsRoute.test.ts`;
- ownership/build tests: `frontend/src/app/routeBundleOwnership.test.ts` and
  `viteBase.contract.test.ts`.

Canonical status paths changed by the verification commit are this handoff,
the accepted design, the implementation plan, `PLAN.md`, `docs/INDEX.md`, and
the narrow current-architecture ownership map. README remains unchanged.

Durable rules:

1. Shared Lab presentation primitives own semantic composition and visual
   roles, never domain state or numerical authority.
2. A shared primitive is not entry-safe merely because it is shared.
   Complete-Lab presentation remains behind complete-Lab lazy routes.
3. Workflow availability is derived from the owning Lab's existing state;
   shared navigation never invents a reachable stage.
4. Domain titles may differ while sharing presentation roles. Diagnostics and
   Convergence may both be Analysis without sharing lifecycle or mathematics.
5. Remove duplicated domain presentation only after its shared replacement is
   mounted, tested, browser-verified, and proven unused.
6. Responsive workflow reveal requires both activation/focus handling and a
   width-change path; contain scrolling to the workflow rail and dispose its
   observer with the owning route.

The implementation encountered no remaining severity finding. The temporary
mobile rail clipping and ODE matching-output reachability questions were
resolved by bounded shared reveal/disposal and domain-derived method/result
matching respectively. `P0 = P1 = P2 = P3 = 0` at handoff.

No Phase 2 primitive, numerical code, Computation Trace, session schema,
Teaching v2 content, MathML architecture, Motion, Tutor feature, Glossary
feature, PDE, dependency, deployment configuration, push, Preview, or
Production deployment changed.

## Cross-Lab Presentation System v1 approval and Phase 0 foundation — 2026-08-12

### Approval and authorization record

Cross-Lab Presentation System v1 is **MAINTAINER APPROVED**. The approved
design commit is `3b77f7133a95bef855c2eb3e3a69db37e16f1e46` (tree
`95908ac5c0a773675bf237d3d49679106a4091f7`). The maintainer separately
authorized Phase 0 after design approval. The Phase 0 foundation implementation
is commit `b81a8dfc8d1ab49be9f07cd3fff59cb5d7c3cf05` (tree
`56b810a3d4e0f5fe9c4f235b9bde0cfdabff06d0`). The final Maintainer visual-
correction implementation is commit
`a196041a49ac3a396e779f3905ff8152f94e603a` (tree
`53a8490db24460c8a708269ba3ba2b9494e09690`).

Phase 0 is **MAINTAINER ACCEPTED** at final Phase 0 HEAD
`0c392e218dd7006d43811ddc4d7401a0ccb7c495` (tree
`3d0bc052f9a2e58b50aeb67b52ddb36f10dcd994`). The Phase 1 section above
supersedes this section's former stop gate; Phase 2+ remains unauthorized.

### Phase 0 Maintainer visual review corrections

The Maintainer visual review identified exactly two fixture findings, both now
closed locally:

- the slogan-like workflow heading and implementation-oriented supporting copy
  were replaced by the direct heading **Workflow roles** and the sentence
  **Method, Data, Output, and Analysis each serve a distinct role in the
  numerical workflow.** The four role samples retain the approved Method,
  Data, Output, and Analysis descriptions;
- the Typography roles **Numeric value** sample visually presented the final
  digit of `2.31 × 10^-14` inconsistently with the rest of the exponent.

The scientific-notation root cause was **A — DEV fixture authored markup
only**. The sample was one plain text node containing Unicode superscript
glyphs (`2.31 × 10⁻¹⁴`), so it had no mathematical superscript structure. No
token CSS, shared formatter output, or accepted native MathML composition
caused the defect. The fixture now reuses the existing project-owned
`mathNumber(2.31e-14, "diagnostic")` path. One labelled `role="math"` owner
contains one `aria-hidden="true"` native MathML tree; its scientific number is
an `mrow` whose `msup` owns base `10` and one exponent child containing the
complete `−14`. The fixture-only numeric specimen rule lets that MathML inherit
the approved numeric type scale. Shared `nativeMath.ts`, `structuredMath.ts`,
production Lab source, number formatting, mathematical semantics, and
accessibility ownership did not change.

Reusable mathematical-presentation rule: **a scientific exponent is one
mathematical superscript subtree, not independently positioned characters.**
Do not use Unicode superscript digits, character-specific offsets, margins,
transforms, or absolute positioning as mathematical authority.

Fresh in-app browser verification covered actual 1440 × 900 Light and Dark,
390 × 844 Dark, and 320-pixel Dark stress layouts. The `−`, `1`, and `4` share
one native `msup` exponent subtree and baseline; the exponent clears the base,
does not clip or create a line-height artifact, and remains equivalent across
themes and mobile widths. The approved workflow wording is present, the two
rejected strings are absent, every checked fixture viewport has zero page-
level overflow, and console warning/error output is empty. A bounded Linear
Systems Diagnostics replay retained its accepted near-machine residual
evidence: `8.881784 × 10^-16` remains one native MathML scientific-number
`mrow` with one `msup`, base `10`, and complete exponent `−16` under one
accessible formula owner. Production mathematical presentation was not
affected.

Focused fixture/token/math/Production-exclusion verification passes 6 files /
28 tests. Import boundaries pass for four owners plus the Vercel adapter. Full
verification passes 92 files / 1,236 tests, all workspace and backend/API
typechecks, and the unchanged 99-module Production build. The generated-
output contract continues to exclude `presentationSystemRoute`,
`presentationSystem.css`, fixture copy, and fixture selectors from Production.
The bounded correction review has no remaining findings:
`P0 = P1 = P2 = P3 = 0`.

### Semantic foundation

`frontend/src/app/theme.css` now owns a mostly additive Cross-Lab vocabulary:

- Method, Data, Output, and Analysis stage roles, each with accent,
  foreground, soft surface, rail/border, and selected treatment;
- page, stage, section, inset, and elevated surfaces, plus quiet, standard,
  and strong borders;
- Lab title, stage title, section title, body, metadata, technical eyebrow,
  numeric, and supporting-copy type roles using the existing DM Sans,
  JetBrains Mono, and mathematical-rendering boundaries;
- inline, header, stage, section, block, and compact semantic spacing mapped
  to the existing scale, with bounded mobile remapping;
- stage, section, control, and compact radii mapped to the existing small
  hierarchy;
- one three-pixel focus language with the existing Light/Dark focus colors;
- neutral, ready, current, stale, caution, failure, and planned text/border/
  surface tones;
- primary, secondary, quiet, and danger action roles plus default, hover,
  active, focus, disabled, and invalid control states.

Existing accepted `--color-*`, spacing, radius, motion, and product selectors
were not changed. Stage identity is intentionally a restrained calibration
rail over neutral structure. Output receives the strongest answer frame.
Analysis reuses the calm amber family as an interpretive role, with wording
and structure carrying meaning before color. The accepted maximum nesting
remains page → stage → section → inset; more shadows or gradients are not a
substitute for hierarchy.

Light remains the existing low-glare Technical Daylight system and Dark
remains its low-luminance technical counterpart. Both themes use the same
semantic relationships rather than independently invented palettes.

### DEV fixture, accessibility, and browser evidence

`/__dev/presentation-system` is a removable internal visual fixture under
`frontend/src/dev/presentation/`. It uses the same `import.meta.env.DEV`,
variable-path, `@vite-ignore` exclusion seam as the accepted MathML capability
fixture. Its stylesheet is fixture-only and it creates no production
`LabShell`, workflow, stage, result, teaching, evidence, or analysis primitive.

The fixture demonstrates the five identity words, all four labelled stage
roles, the four-level surface stack, the complete typography hierarchy,
four project-owned native-MathML objects, an illustrative problem/result
relationship, teaching/evidence/analysis/advanced-detail voices, text-first
statuses, native buttons/input/select/details, disabled/invalid states, and
keyboard focus. It has one `h1`; each visual MathML tree is hidden under one
labelled `role="math"` owner; status meaning is written in text; and no
MathLive or Compute Engine is loaded.

Fresh in-app browser review covered actual 1440 × 900 and 390 × 844 DOM
viewports in Light/Dark, a 320-pixel Light stress state, and focused controls
in both themes. All checked states had document `scrollWidth === clientWidth`,
the focus outline resolved as a solid shared ring in each theme, and console
warning/error output was empty. The visual review found the system technical,
calm, tactile, mathematical, and premium through disciplined alignment,
limited radii, tonal layering, technical metadata, native MathML, and the
calibration rail. An initial fixture-only Output gradient was judged
unnecessary and replaced by one low-glare semantic Output surface.

Representative screenshots remain in an untracked external evidence
directory. The browser viewport control initially exposed a small outer-frame
width offset; the review calibrated against actual DOM `clientWidth` before
capturing evidence. This was a harness detail, not a product issue.

Bounded current-product smokes covered ODE Method and Linear Systems Method in
Light at desktop width. Both retained their existing presentation, route
ownership, and zero page overflow. No Lab design re-review or migration was
performed.

### Verification, bundle, and exclusions

Contract-first development began with the expected two failing files: the new
token vocabulary and fixture module did not exist. The focused final gate
passes 7 files / 50 tests, including tokens, theme behavior, guarded route
injection, bootstrap, route ownership, fixture DOM/accessibility, and a real
temporary Production manifest build. Import boundaries pass for four owners
plus the Vercel adapter. Complete verification passes 92 files / 1,235 tests,
all frontend/numerics/contracts and backend/API typechecks, the Production
build, and boundary checks. `git diff --check` passes.

The Production build transforms 99 modules before and after Phase 0. Entry JS
is unchanged at 56.64 kB raw / 17.45 kB gzip. Shared platform CSS changes from
18.72 / 4.29 kB to 29.51 / 5.39 kB raw/gzip because the Light/Dark semantic
vocabulary is entry-safe CSS. ODE remains an independent 293.60 / 94.05 kB
raw/gzip JS route, and Linear Systems remains an independent 71.11 / 21.06 kB
route. Tutor and Glossary remain deferred dynamic assets.

The temporary Production manifest and generated-asset assertions prove that
`presentationSystemRoute`, `presentationSystem.css`, the fixture selector,
the fixture phase label, and fixture body marker are absent. The seven public
paths are unchanged and `/__dev/presentation-system` matches Not Found unless
explicitly injected. ODE, Linear Systems, Tutor, Glossary, MathLive, and
Compute Engine lazy ownership is unchanged.

No ODE product source, Linear Systems product source, PDE, numerical behavior,
Computation Trace, native MathML architecture, Motion, Tutor, Glossary,
dependency, deployment configuration, push, Preview, or Production deployment
changed. Motion remains paused; Linear Algebra Tutor remains later. Phase 0
self-review closes at `P0 = P1 = P2 = P3 = 0`.

## Cross-Lab Presentation Sync design/audit — historical pre-approval checkpoint — 2026-08-12

This section preserves the exact design/audit checkpoint before maintainer
approval. Its proposed status and next gate are superseded by the Phase 0
record above.

### Accepted prerequisite

Linear Systems Teaching v2 is **MAINTAINER ACCEPTED** at commit
`484fc9153de33be7949e82b29386c94fe63d19c8` (tree
`509d245adb745d272e2a5c8185fb678b6e15009d`). The final teaching-copy audit
passed with `P0 = P1 = P2 = P3 = 0`. Visual + Motion Language v1 remains
paused and unmounted from the accepted static walkthrough. Linear Algebra Tutor
remains a later task. No push, Preview deployment, or Production deployment of
that accepted Teaching v2 state occurred.

This acceptance supersedes the prior handoff's narrow re-audit and final
Maintainer Teaching Acceptance gates. Historical sections below remain exact
point-in-time execution records.

### Problem and browser evidence

The Initial Value Problems and Linear Systems Labs are both strong but express
different presentation generations. ODE leads in exploration, method discovery,
preset guidance, editable math, charts, Compare, Convergence, Tutor, and
Glossary. Linear Systems Teaching v2 leads in universal versus selected-method
teaching, native MathML, authoritative problem/result pairing, immutable stale
context, trace-owned computation, and residual-led Diagnostics. Separate Lab
shells, workflows, controls, surfaces, tables, statuses, disclosures, and CSS
make those strengths feel like different products and duplicate presentation
ownership.

A fresh current-run in-app browser audit covered all seven public routes;
paired ODE/Linear Systems Method, Data, Output, and Analysis surfaces; ODE
Compare, Convergence, Glossary, and Tutor; Linear Systems row-swap, walkthrough,
row arithmetic, Diagnostics, safeguards, stale output, pivot failure, and reset
dialog; 1440 x 900, 390 x 844, and 320-pixel stress; and Light/Dark. Evidence
screenshots remain in a local external audit directory and are not committed.
The audited states showed no page-level horizontal overflow and no browser
warning/error. This is browser/DOM evidence, not a screen-reader or universal
browser claim.

### Authoritative design and plan

The proposed
[Cross-Lab Presentation System v1 design](superpowers/specs/2026-08-12-cross-lab-presentation-system-v1-design.md)
and
[repository-grounded implementation plan](superpowers/plans/2026-08-12-cross-lab-presentation-system-v1-implementation-plan.md)
are the active authorities after maintainer approval. The exact ten top-level
primitives are:

1. `LabShell`
2. `WorkflowNavigation`
3. `StageSection`
4. `ProblemContext`
5. `TeachingBlock`
6. `PrimaryResult`
7. `EvidenceBlock`
8. `ComputationWalkthroughShell`
9. `AnalysisSurface`
10. `ModuleOverview`

`LabHeader` is a required `LabShell` structure. MethodTeaching is a governed
`TeachingBlock` composition. `AdvancedDetails`, `StatusMarker`,
`NumericalTable`, and `ActionGroup` are supporting elements, not extra
top-level abstractions.

Best-of-both decisions:

- keep ODE's method/preset exploration, editable math, chart/table evidence,
  Compare, Convergence, and platform-owned Tutor/Glossary integration;
- keep Linear Systems Teaching v2's explicit problem/method/result teaching,
  MathML, successful-snapshot context, transformation corridor, trace evidence,
  and residual-first Diagnostics;
- replace both Labs' duplicated shell/header/workflow/stage/control/status/
  disclosure/table/surface implementations with shared semantic presentation
  roles while keeping domain content and behavior local.

The stage roles are Method, Data, Output, and Analysis. They map naturally to
future PDE statement/method, grid/boundary data, numerical solution, and
error/stability/diagnostic evidence without implementing PDE. The target uses
entry-safe tokens and `ModuleOverview`, plus Lab-shared lazy vanilla DOM/CSS
primitives imported only by complete-Lab route graphs. ODE and Linear Systems
retain their own editor, chart, MathML, teaching, trace, and analysis owners.

### Migration, debt, and risks

The proposed migration locks tokens; adds shared shell/workflow/stage
primitives; proves context/teaching/result/evidence/walkthrough compositions;
migrates ODE; migrates Linear Systems; aligns Convergence and Diagnostics as
Analysis surfaces; aligns module overviews; and finishes with an independent
visual/accessibility/browser/bundle audit. Every phase has a separate stop gate.

The bounded debt ledger is `PRESENTATION-SYNC-01` through `-08`: separate Lab
shells, divergent workflow semantics/containment, weaker ODE context/result
hierarchy, inconsistent teaching/evidence nesting, duplicated CSS/control
language, overview status drift, divergent status states, and unaligned
Analysis framing. Primary risks are entry-bundle leakage, CSS cascade changes,
false ODE workflow navigation, dilution of Teaching v2, stale-context mixing,
and treating Convergence and Diagnostics as one lifecycle. The design assigns a
specific mitigation and phase to each.

### State, exclusions, and next gate

This iteration changes only the two new design/plan documents plus `PLAN.md`,
`docs/INDEX.md`, and this canonical handoff. No production frontend or CSS,
ODE product, Linear Systems product, PDE, numerical algorithm/contract,
Computation Trace, MathML, Motion, Tutor, Glossary, dependency, route, push, or
deployment changed. `docs/architecture/CURRENT_ARCHITECTURE.md` remains
unchanged because target architecture is not current implementation.

The exact next gate is **maintainer approval of Cross-Lab Presentation System
v1 design**. Do not begin implementation, Motion, or Tutor before that gate.

## Linear Systems final teaching-copy correction — 2026-08-12

The independent final teaching-copy audit returned **BLOCKED — FINAL TEACHING
COPY NEEDS CORRECTION** with `TC-01` and `TC-02` at P2 and `TC-03` at P3.
Work started from clean `main` at
`d51236deeb2e7e6ff4d64af8889b097582464b8b` (tree
`4eb50dec256c80876a98d260f166d46df0fa1ece`). The correction commit is the
commit containing this section; its exact SHA/tree are reported in the task
result because a Git commit cannot contain its own identifier.

### Root cause and corrections

The visual mathematical layer was already correct, but several ordinary
learner-facing strings phonetically verbalized notation that the adjacent
MathML already displayed. That wording blurred three distinct channels:
visible teaching prose, visual mathematics, and accessible speech.

- **TC-01:** Diagnostics now says that an exactly satisfied system has zero
  residual, asks learners to substitute the **computed solution** into the
  original left-hand side, and compares the original right-hand side with the
  value produced by that solution. The existing `A\hat{x}=b => r=0`,
  `A\hat{x}`, and `r=b-A\hat{x}` MathML and their spoken labels remain.
- **TC-02:** the selected-method outline now says to solve the
  upper-triangular system by backward substitution to recover the computed
  solution. Its concept copy explains that the computed solution is recovered
  bottom-to-top. The walkthrough introduces `y` as the intermediate vector,
  uses **5. Backward substitution**, and keeps `U\hat{x}=y` in MathML.
- **TC-03:** backward-substitution steps are **Solve component N** with
  **Component N solved** status. Residual detail tables use
  **Computed-solution component** and the region label **Products contributing
  to row N of the original left-hand side**.

The durable correction rule is: **visible prose explains meaning; MathML
displays mathematics; accessible labels verbalize mathematics.** Before
changing mathematical wording, classify the string as visual prose, visual
mathematics, or accessible speech. Do not apply one wording policy across all
three channels.

### Exact relevant paths

- `frontend/src/labs/linear-algebra/linearSystemsTeaching.ts` and its test;
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` and its test;
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` and its test;
- `docs/contracts/MATHEMATICAL_PRESENTATION.md`;
- `PLAN.md`, `docs/INDEX.md`, and this canonical handoff.

No CSS change was needed. Numerical packages, Computation Trace, Architecture
v1, the MathML renderer architecture, ODE, PDE, Motion, Tutor, Glossary,
Cross-Lab Presentation Sync, dependencies, routes, and deployment files are
unchanged.

### Tests, browser evidence, and problems

The test-first red gate ran 3 files / 35 tests: 32 passed and the three new
channel-aware regressions failed at the expected Method, Walkthrough, and
Diagnostics copy. After correction, that gate passed 3 files / 35 tests. The
expanded focused gate passed 6 files / 53 tests, including native MathML and
session current/stale ownership. Import boundaries passed for four owners plus
the Vercel adapter. Complete `verify` passed 91 files / 1,229 tests, all
frontend/numerics/contracts and backend/API typechecks, and the 99-module
Production build. `git diff --check` passed before commit.

Fresh in-app browser verification used the real local Linear Systems route.
Desktop 1440 x 900 Dark and mobile 390 x 844 Light/Dark covered Method,
computed Output, the expanded walkthrough, and Diagnostics. The visible-prose
inventory found zero inappropriate `x-hat`, `x hat`, or `A x-hat` occurrences.
MathML still contained real `mover` accents, accessible formula labels retained
spoken `x hat`, no raw LaTeX appeared, document scroll width equaled client
width, and the console had no warnings or errors. `Number.EPSILON` remains only
inside the closed nested implementation detail under the closed solver-
safeguard disclosure.

The browser interface did not support the requested `networkidle` wait state.
Resolution: use the supported `domcontentloaded` state, then verify the actual
route through semantic DOM state after Vite reported ready. This was a
verification-harness limitation, not a product defect. Reuse the channel-aware
DOM audit: exclude `role="math"` visual owners when checking ordinary prose,
then inspect their `aria-label` values separately so accessibility speech is
not accidentally treated as visible copy.

### Current state and next gate

The audit finding set is now self-assessed at `P0 = P1 = P2 = P3 = 0`. No
push, Preview deployment, or Production deployment was performed. The exact
next gate is a **narrow independent teaching-copy re-audit**, followed by
**final Maintainer Teaching Acceptance**. Do not begin Cross-Lab Presentation
Sync, Motion Phase 3, or Tutor before those gates.

## Linear Systems maintainer teaching corrections — 2026-08-12

The independent Teaching v2 Phase 2 audit returned **PASS WITH P3
CARRY-FORWARD — READY FOR MAINTAINER TEACHING REVIEW** with
`P0 = P1 = P2 = 0`, `P3 = 2`. Direct Maintainer Teaching Review then supplied
the binding MTC-01 through MTC-06 corrections. Work started from clean `main`
at `af4041dc9530a833baa3bfda4fe829380ff95fcf` (tree
`3af5c8e535692e944133f8cd031282b298ab84f2`). The implementation commit is
`a28abd59cff6bcf203d1b08607e4409dc490ff59` (tree
`754c3e69e3da914480698b1d43666f0ee37c9223`).

### What the correction completed

- **MTC-01:** Method now labels `b` **Right-hand side vector** and teaches
  both required ideas: it is the known vector of constants, and it is the
  target vector that `A x` must equal. This is local Linear Systems teaching
  copy; no Glossary ID was created.
- **MTC-02:** `linearSystemsTeaching.ts` now separates universal domain
  teaching from a small `LinearSystemsMethodTeachingProfile`. The current
  frozen `GEPP_METHOD_TEACHING_PROFILE` owns its method label, overview,
  algorithm steps, concepts, and formula groups. Pivoting, row operations,
  elimination multipliers, `P A = L U`, and triangular solves are therefore
  explicitly selected-method teaching. Jacobi and Gauss-Seidel remain Planned
  cards only: no profile, control, session state, solver, or fake method switch
  was added.
- **MTC-03:** primary Output now pairs the actual successful result's
  `originalA` and `originalB` with an indexed symbolic unknown vector, then
  presents the adjacent native-MathML `xHat` solution. Desktop uses a compact
  two-part layout and narrow screens stack the same mathematical objects.
  Factorization evidence and its mathematical ownership are unchanged.
- **MTC-04:** Diagnostics now begins with a read-only native-MathML summary of
  the successful result's `A`, `b`, and `xHat`. It teaches the purpose of
  `r = b - A xHat` and the ideal `A xHat = b => r = 0` before the arithmetic.
  The steps are **Substitute the computed solution**, **Find the equation
  mismatch**, and **Measure the largest mismatch**. Cards use content-driven
  height and smaller existing-token spacing. Displayed matrix-vector values,
  residual components, and the infinity norm still come only from stored
  trace/result evidence; no frontend numerical reconstruction was added.
- **MTC-05 / TV2-P3-01:** Method now closes with a compact **Checking the
  result** block. It defines residual as equation mismatch, introduces
  conditioning as sensitivity to small data changes, states that the Lab does
  not compute a condition number, and preserves that small residual does not
  by itself guarantee small solution error.
- **MTC-06 / TV2-P3-02:** Method now includes one non-editable authored example
  mapping two equations to an equivalent structural MathML matrix system. It
  is teaching copy only, not a preset or solver input.

For both current and stale results, Output and Diagnostics read only
`latestSuccessfulResult.originalA`, `.originalB`, and `.xHat`. If Data changes,
the stale result keeps its original problem context and receives concise stale
wording; current drafts are never shown beside an older solution. The existing
session/fingerprint owner remains unchanged.

### Exact relevant paths

- `frontend/src/labs/linear-algebra/linearSystemsTeaching.ts` and
  `linearSystemsTeaching.test.ts` — universal/selected-method seam, GEPP
  profile, right-hand-side copy, compact example, and Method result checking;
- `frontend/src/labs/linear-algebra/linearSystemsMath.ts` and
  `linearSystemsMath.test.ts` — structural indexed symbolic vector and
  successful-result `A x = b` MathML composition;
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` and
  `linearSystemsApp.test.ts` — Output/Diagnostics snapshot presentation,
  residual-purpose sequence, density regression, and stale authority;
- `frontend/src/labs/linear-algebra/linearSystems.css` — scoped compact,
  responsive composition using existing product tokens; and
- `PLAN.md`, `docs/INDEX.md`, the Teaching v2 design/plan,
  `docs/PROJECT_HANDOFF.md`, and the concise README Changelog — current-state
  synchronization.

`computationWalkthrough.ts`, `computationMotion.ts`, `packages/numerics`, ODE,
PDE, Tutor, Glossary, routes, dependencies, and Architecture v1 did not change.

### Validation and browser evidence

The test-first red gate had 3 focused files / 25 tests with 16 passing and 9
expected failures covering the missing wording, authored example, profile
boundary, successful-result context, and Diagnostics teaching. After the
correction, the focused gate passes 7 files / 59 tests. The complete suite and
complete `verify` each pass 91 files / 1,227 tests; all workspace and API
typechecks pass; import boundaries pass for four owners plus the Vercel
adapter; `git diff --check` passes; and the Production build remains at 99
transformed modules.

The entry asset remains 56.64 kB raw / 17.45 kB gzip. The independently lazy
Linear Systems assets change from 65.77 kB raw / 19.72 kB gzip JavaScript and
27.47 kB raw / 5.06 kB gzip CSS to 70.95 kB raw / 21.04 kB gzip JavaScript and
30.33 kB raw / 5.42 kB gzip CSS. Manifest evidence keeps the Linear Systems
route as a separate dynamic entry with no static or dynamic imports of its own;
the platform entry still dynamically owns ODE, Linear Systems, Tutor, and
Glossary routes. The Linear Systems asset contains no MathLive, Compute Engine,
Replay/motion-controller, Tutor, or Glossary markers. The DEV MathML fixture is
absent from Production assets.

Fresh in-app browser review covered Starter 3x3 and Row swap required at
1440 x 900 Light, a stale successful result after editing `b`, a custom decimal
2x2 system at 390 x 844 Dark, and 320-pixel stress reflow. Method, Output, and
Diagnostics remained readable with no page-level horizontal overflow; all
native-MathML displays retained one accessible owner; stale Output and
Diagnostics showed the previous successful snapshot; factorization remained
present; safeguard detail stayed closed; no Replay control appeared; and the
console contained no warnings or errors.

### Problems, resolutions, and reusable rules

- The critical stale-state risk was mixing current drafts with the previous
  `xHat`. Resolution: make the successful result object the single context
  source for Output and Diagnostics, and test edited values out of the rendered
  DOM.
- A symbolic MathML node cannot be attached to multiple matrix cells. Resolution:
  clone the authored symbol for each indexed cell while keeping the wrapper as
  the sole accessible owner. Reuse this factory pattern for future authored
  matrix/vector mathematics.
- The in-app browser's evaluated DOM proxies do not expose host constructors
  such as `HTMLInputElement` for `instanceof` checks. Resolution: use semantic
  locators, attributes, text, and measured geometry; this was a browser-harness
  limitation, not a product defect.
- Production continues to report the accepted large deferred MathLive/Compute
  Engine chunk warning. The entry and Linear Systems lazy boundary remain
  intact, so no speculative chunk rewrite was introduced.

Durable teaching rules:

1. Universal Lab-domain teaching and selected-method teaching are separate.
   Algorithm-specific concepts, formulas, and step sequence follow the active
   method profile. When a runnable method is added, its teaching profile must
   be added and selected together with that method.
2. Every Output and Diagnostics surface re-establishes enough authoritative
   problem context that the learner does not need to remember values from an
   earlier workflow step.
3. For stale results, Output/Diagnostics context comes from the successful
   result snapshot that produced the result, never current edited drafts.
4. Result-checking teaching explains why a diagnostic is computed before
   presenting the mechanical arithmetic.
5. A Lab is not teaching-complete until direct Maintainer Teaching Review
   confirms that a first-time learner can understand the problem, method
   framework, computation, and diagnostics.

### Current state and next gate

The two Cursor P3 carry-forwards are closed. The self-audit is
`P0 = P1 = P2 = P3 = 0`. No Cross-Lab Presentation Sync has been implemented;
the recognized future task is to align ODE, Linear Algebra, and future PDE Lab
headers, workflow geometry, context/result hierarchy, teaching/evidence blocks,
diagnostics, and walkthrough primitives after this gate. Motion remains paused
and unmounted. No Tutor, Glossary, runnable method, dependency, push, Preview,
Production deployment, numerical, trace, ODE, PDE, or architecture change is
included.

The exact next gate is **Maintainer Teaching Review of the corrected Linear
Systems Lab**. If accepted, proceed to **Cross-Lab Presentation Sync
design/audit**. Motion remount and Tutor remain later gates. The documentation
commit containing this section is reported externally because a commit cannot
self-reference its own final SHA/tree.

## Linear Systems Teaching v2 Phase 2 — static integration — 2026-08-12

The independent Phase 1 trace audit passed with `P0 = P1 = P2 = P3 = 0`,
and the maintainer accepted that evidence and authorized only Phase 2. Work
started from clean `main` at
`797cab621c2f3eb52a02bc6c508db16aad8403df` (tree
`9ec99ad140b6c640abe867f3576a8bb87e53936f`). Phase 0 Outcome B remains the
presentation authority: native MathML owns authored mathematical objects and
controlled DOM/CSS owns teaching composition. Phase 1 remains the sole source
of matrix snapshots and `P b` evidence.

### What Phase 2 completed

The four-step Method -> Data -> Output -> Diagnostics workflow is preserved.
The learner-facing product is now computation-led:

- Method directly teaches the `A x = b` problem, the roles of `A`, `x`, and
  `b`, a compact linear-system definition, direct versus iterative families,
  Gaussian elimination with partial pivoting as the only available method,
  Jacobi and Gauss-Seidel as planned contrast methods only, the algorithm
  outline, and visible definitions for pivots, row operations, multipliers,
  `P A = L U`, triangular solves, residual, and the conditioning boundary.
- Data presents `A x = b` with the same editable matrix/vector controls,
  presets, validation, fingerprint, and current/stale behavior.
- Output renders a correctly accented `xHat` column vector, subordinate
  `P/L/U` factor evidence, and a static walkthrough driven exclusively by the
  accepted trace. The walkthrough starts at `U^(0) = A`; keeps pivot candidates
  subordinate; shows every row swap and elimination as complete matrix before,
  stored row operation, and complete matrix after; then presents `P b`,
  forward substitution, backward substitution, and the final solution.
- Diagnostics separates the residual story into trace-owned `A xHat`,
  `r = b - A xHat`, the residual vector, and the infinity norm. Interpretation
  explicitly preserves that a small residual is equation mismatch rather than
  proof of a small solution error. Preset-reference comparison remains
  conditional. Matrix scale, pivot threshold, and implementation identifier
  details are subordinate closed disclosures.
- Controlled pivot failure retains qualified non-proof wording and only the
  trace evidence available through the stopping point. Editing invalidated
  input still removes stale failure UI while preserving any prior successful
  result under the existing session fingerprint contract.

Terms are distributed by learner need rather than hidden in a new content
system: problem roles and method families live in Method; operation-specific
terms appear beside the computation; residual/conditioning limitations live
in Diagnostics; implementation-level epsilon naming remains in advanced
safeguard detail. No Glossary record or terminology framework was added.

### Ownership and exact relevant paths

- `frontend/src/math/nativeMath.ts` remains the small project-owned primitive
  builder and now carries semantic numeric-display metadata used by authored
  product formulas.
- `frontend/src/labs/linear-algebra/linearSystemsMath.ts` composes domain
  matrices, vectors, factors, and the computed solution from those primitives.
- `frontend/src/labs/linear-algebra/linearSystemsTeaching.ts` owns the visible
  Method teaching content without creating a general content framework.
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` is the sole
  static trace renderer for the computation sequence.
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` retains four-step,
  lifecycle, Output, failure, and Diagnostics ownership.
- `frontend/src/labs/linear-algebra/linearSystems.css` owns scoped responsive
  composition and native-MathML styling.
- Focused evidence is in the adjacent `linearSystemsMath.test.ts`,
  `linearSystemsTeaching.test.ts`, `computationWalkthrough.test.ts`, and
  `linearSystemsApp.test.ts`, with session and route-boundary regression
  coverage retained.
- Current-state authority is synchronized in `PLAN.md`, `docs/INDEX.md`,
  `docs/architecture/CURRENT_ARCHITECTURE.md`,
  `docs/contracts/MATHEMATICAL_PRESENTATION.md`, the Teaching v2 design/plan,
  this handoff, and the concise README Changelog.

There is no second Gaussian-elimination path. The renderer consumes stored
`initialU`, `uBefore`, `uAfter`, multiplier, permutation, `permutedB`,
substitution, residual, norm, and optional reference records. It does not call
the solver, reconstruct matrix states, reorder arithmetic, or publish rounded
display values as numerical input.

### Static motion-paused state

The existing `computationMotion.ts` implementation remains in the repository,
but the Phase 2 walkthrough no longer imports or mounts it. There are no
Replay controls on the new surface. Static before/operation/after evidence is
complete and authoritative at all viewport sizes. Motion remount remains a
separate decision after teaching acceptance; no motion state enters the trace,
session, Store, history, or persistence.

### Validation and browser evidence

Focused verification passes seven files / 52 tests across MathML primitives,
domain math composition, Method teaching, walkthrough, application/session,
and route bundle ownership. The complete suite passes 91 files / 1,220 tests.
The four-owner-plus-Vercel import-boundary gate, frontend/numerics/contracts
typechecks, backend/API typecheck, production build, complete `verify`, and
`git diff --check` pass.

The production build transforms 99 modules. Before Phase 2, Linear Systems
assets were 63.17 kB raw / 18.49 kB gzip JavaScript and 16.50 kB raw /
3.49 kB gzip CSS. After Phase 2, they are 65.77 kB raw / 19.72 kB gzip
JavaScript and 27.47 kB raw / 5.06 kB gzip CSS. The route remains an
independent dynamic chunk; Home/static entry ownership is unchanged, and the
Linear Systems graph contains neither MathLive, Compute Engine, Tutor,
Glossary, ODE, the DEV MathML fixture, nor the paused motion controller. The
existing large deferred MathLive/Compute Engine warning remains informational.

Required in-app browser review passed in the real local route for Starter
3x3, Row swap required, a custom decimal 2x2 system, and controlled pivot
failure at approximately 1440 x 900, 390 x 844, and 320-pixel stress widths in
Light and Dark. It confirmed proper `xHat` accent/vector rendering, full matrix
transformations, explicit `P b`, substitution structure, distinct Diagnostics,
conditional reference comparison, closed safeguards, qualified failure,
failure-edit lifecycle, keyboard-native disclosures, singular formula
ownership, local narrow-screen containment, no page-level overflow, and no
console warning/error. On first-time-learner self-review, the main algorithm
sequence is understandable without opening raw arithmetic; final acceptance
remains with the independent audit and maintainer review.

### Problems and reusable resolutions

- A DOM or MathML node has exactly one parent. Reusing one `P b` or norm node
  across multiple formula owners silently moves it out of the earlier formula.
  Resolution: use small node factories and create a fresh visual tree for every
  accessible owner. If a formula appears incomplete later, audit node identity
  before changing arithmetic or CSS.
- `overflow-x: auto` can cause Chromium to compute a visible vertical scroll
  affordance when line-height and padding are tight. Resolution: give the
  formula a definite available width, contain horizontal overflow locally,
  clip incidental vertical overflow, and preserve sufficient block padding.
  Do not reduce math size or allow page-level overflow to hide the symptom.
- The previous walkthrough coupled Replay controls to the old row-fragment
  layout. Remounting that controller during a structural teaching rewrite
  would mix two review gates. Resolution: retain the controller source,
  unmount it explicitly, and verify the static evidence independently before a
  later motion task measures the new complete-matrix owners.

Reusable rule: authored math is one accessible wrapper plus one hidden visual
MathML tree; larger responsive relationships are controlled DOM/CSS. Numerical
state always comes from the immutable result/trace, and presentation helpers
must be factories rather than shared mutable node instances.

### Current state and next gate

The Phase 2 implementation/documentation commit is the commit containing this
section; its exact SHA/tree is reported after creation because a commit cannot
self-reference its own hash. The worktree is clean after that commit. No
numerical algorithm, trace-producer behavior, session contract, route,
Architecture v1 boundary, runnable method, Tutor, Glossary, ODE, dependency,
push, or deployment changed.

The exact next gate is **independent Teaching v2 Phase 2 product/teaching
audit**, followed by **Maintainer Teaching Review**. Do not begin Phase 3
motion remount or Linear Algebra Tutor work before those gates.

## Linear Systems Teaching v2 Phase 1 — trace snapshots — 2026-08-11

The maintainer accepted Phase 0 Outcome B and authorized only Teaching v2
Phase 1 from clean `main` at
`05fb3bd431dd9d1b31782dacf7a67cff3556f45b` (tree
`3cf55e6c247b6deb11a08bbc47542a2c5aa45846`). Phase 0's Hybrid architecture
remains fixed: native MathML owns authored mathematical objects and controlled
DOM/CSS owns responsive transformation composition. This checkpoint extends
only the authoritative pure Linear Systems trace; it does not integrate that
evidence into the product UI.

### Implemented evidence and ownership

`packages/numerics/src/linear-algebra/linearSystemsNumerics.ts` remains the
single Gaussian-elimination and solve path. It now emits:

- `factorization_start.initialU`, copied from the defensive `U` work matrix
  before the first pivot search;
- complete `uBefore` and `uAfter` matrices for each `row_swap`, copied
  immediately around the existing authoritative `U` row exchange;
- complete sequential `uBefore` and `uAfter` matrices for every
  `elimination`, copied around that target row's existing update; and
- `right_hand_side_permutation` with original `b`, the authoritative
  permutation, and the same complete `permutedB` vector consumed by forward
  substitution.

The generic trace foundation and its retention policies are unchanged.
Linear Systems remains `bounded_finite` with `all_meaningful_steps`. The
successful result still owns one deeply frozen trace, and the frontend session
continues to preserve that result/trace by reference. No matrix history or
presentation state was added to AppSessionStore.

The maintainer-approved learner convention is now tracked in
`docs/contracts/MATHEMATICAL_PRESENTATION.md`: elimination is presented as the
computed row expression followed by the updated row identity,
`R_i - m_ik R_k -> R_i`. This is a presentation choice, not a change to
arithmetic or a claim that assignment-form textbook notation is incorrect.

### Ordering, failure, and immutability

Successful traces retain actual computation order:

```text
matrix_scale
factorization_start
pivot_selection / row_swap / elimination as executed
factorization_complete
right_hand_side_permutation
forward_substitution
backward_substitution
residual_component / residual_inf_norm
preset_reference_difference when authorized
```

Consecutive operation snapshots chain by value: an operation's `uAfter` is
the next operation's `uBefore`, while each record owns a distinct frozen copy.
Existing row-level swap/elimination evidence agrees with the corresponding
full matrices. A controlled pivot rejection retains `factorization_start` and
all completed operations through the rejected pivot, but no right-hand-side,
substitution, or residual evidence. It remains a failure rather than partial
success.

All new matrices, vectors, rows, and records are defensively copied and deeply
frozen by the existing trace factory. They share no mutable alias with caller
input, returned factors, later snapshots, or producer work arrays. Snapshot
attempted mutation cannot alter historical evidence or the numerical result,
and caller arrays remain mutable after the solve.

### Numerical equivalence and boundedness

Pre-extension and post-extension projections excluding `trace` are
bit-identical for Starter 3x3, Row swap required, a later prior-`L`-column
swap, an equal-magnitude pivot tie, 2x2, 6x6, a very small scaled system,
pivot rejection, and a finite-input non-finite-intermediate case. The existing
exact Starter result regression also remains unchanged. Pivot order/ties,
row-swap count, `P/L/U`, permutation, `xHat`, residual, threshold, reference
comparison, fingerprint, and success/failure classification do not change.

At `n=6`, there are at most 15 elimination records and five row swaps. One
start matrix plus two matrices for each of those 20 operations retains at most
41 complete 6x6 matrices: 1,476 binary64 entries. Adding the three six-entry
right-hand-side/permutation vectors gives 1,494 new numeric values, or 11,952
bytes of raw numeric payload before JavaScript container overhead. This bound
is specific to the approved `n <= 6` Lab and is not a general large-matrix
trace policy.

### Exact relevant paths

- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts`
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.test.ts`
- `frontend/src/labs/linear-algebra/computationWalkthrough.test.ts`
- `docs/contracts/NUMERICAL_CONTRACTS.md`
- `docs/contracts/MATHEMATICAL_PRESENTATION.md`
- `docs/superpowers/specs/2026-08-11-linear-systems-teaching-v2-design.md`
- `docs/superpowers/plans/2026-08-11-linear-systems-teaching-v2-implementation-plan.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`

### Validation

Focused verification passes four files / 73 tests: the generic trace factory,
Linear Systems numerics, frontend session, and current walkthrough boundary.
The complete suite passes 89 files / 1,218 tests. Import boundaries pass for
all four workspace owners plus the Vercel adapter; frontend, numerics,
contracts, and backend/API typechecks pass; `git diff --check` passes; and the
97-module Production build passes. The Linear Systems asset remains an
independently lazy 63.17 kB raw / 18.49 kB gzip JavaScript chunk. Complete
`npm.cmd run verify` passes. The existing large deferred MathLive/Compute
Engine chunk warning remains informational and unrelated to Phase 1.

### Problems and reusable resolutions

- The current walkthrough test assumed every semantic trace kind must already
  be rendered. That would force Phase 2 UI into Phase 1. Resolution: keep the
  product renderer unchanged and narrow the test to distinguish current
  presentation kinds from the two producer-owned Phase 1 standalone records.
- A full row-swap snapshot must describe `U` immediately after its row
  exchange, not merely the later end of the combined `U/P/L` bookkeeping.
  Resolution: capture `uAfter` directly after the existing `U` mutation, then
  continue the unchanged permutation and prior-`L` swaps.
- Repeatable baseline comparison must not modify the worktree or compare the
  intentionally changed trace. Resolution: run the accepted and candidate
  solvers through the same external inline harness and hash the complete
  result/error projection with only `trace` removed.

If another bounded algorithm needs presentation snapshots, emit them at the
authoritative mutation boundary, prove sequential chaining and immutable
ownership, and compare every non-trace field to the accepted baseline. Do not
replay the algorithm or ask a renderer to reconstruct missing state.

### Current state and next gate

The implementation commit for the trace producer is
`7d6668b4aec9af50136039d37e06b74a875f6e3e` (tree
`62c8cd02991032da1e6c2cd94c16d1d08939ef79`). The documentation commit is
the commit containing this section; its exact SHA/tree is reported after
creation because a commit cannot self-reference its own hash.

Motion v1 implementation still exists, but final motion acceptance remains
paused. There is no Teaching v2 UI, MathML product integration, motion remount,
method addition, Tutor, Glossary, dependency, push, or deployment in Phase 1.
The exact next gate is **independent Teaching v2 Phase 1 trace audit**. Do not
begin Phase 2 without that audit and separate maintainer authorization.

## Linear Systems Teaching v2 Phase 0 — MathML capability — 2026-08-11

*Historical Phase 0 checkpoint. The Phase 1 section above supersedes its
authorization and next-gate language without rewriting the evidence below.*

The maintainer approved the Teaching v2 design and plan at
`e6ecfac7ba11d2825d099070345c1d8c35c15596` (tree
`66ad585fb780ff77f663c97d00a7cafebd309db5`) and authorized Phase 0 only.
This checkpoint implements and verifies that capability spike. The commit
containing this section is the Phase 0 commit; its exact SHA and tree are the
task report's ending commit/tree because a commit cannot self-reference its
own hash.

### Outcome and ownership

The exact decision is **Outcome B — Hybrid accepted**.

- Native MathML owns authored mathematical objects: `x-hat`, matrices and
  column vectors, fractions, subscripts/superscripts, the infinity norm,
  scientific notation, PLU, and substitution equations.
- Controlled DOM/CSS owns the larger before/operation/after composition,
  responsive horizontal-to-vertical flow, and arrow geometry.
- Every displayed formula has one `role="math"` owner with one complete
  learner-meaningful `aria-label`; its direct visual MathML child has
  `aria-hidden="true"`. The browser exposed exactly 11 formula owners for 11
  formulas, with no nested label owner.
- `frontend/src/math/nativeMath.ts` is an explicit authored-element helper,
  not a parser or second mathematical AST. It uses the MathML namespace,
  project number formatting, and a closed 14-element primitive union. It uses
  no raw HTML, `innerHTML`, MathLive, Compute Engine, numerical package, Tutor,
  or Glossary dependency.
- `frontend/src/dev/mathml/mathmlCapabilityRoute.ts` and its scoped CSS own the
  removable browser fixture at `/__dev/mathml-capability`. The route is
  injected only when Vite reports DEV and is not a public route.

### Expressions and browser evidence

The real frontend rendered all eight required product-level cases:

1. proper `x-hat` plus a three-component column vector;
2. dense `3 x 3` matrix `A`;
3. indexed elimination multiplier with structural fractions;
4. full matrix before, labelled row operation, and full matrix after;
5. residual infinity norm with structural scientific exponent;
6. `P A = L U` alone and inside a teaching block;
7. grouped forward-substitution fraction; and
8. indexed `x-hat` inside the backward-substitution fraction.

In-app Chromium checks covered 1440 x 900, 390 x 844, and 320-pixel reflow in
Light and Dark. The horizontal transformation became the same three
mathematical objects in one vertical sequence at narrow widths. Document
scroll width equaled client width at each inspected viewport; every fixture
stage also fit without local overflow in these cases. Cambria Math was
available and used as the first scoped math-font choice. Hats, delimiters,
fractions, scripts, negative signs, baselines, and line heights remained
readable, and the console had no warning or error.

Browser asset inventory showed no MathLive or Compute Engine request. The
fixture preserves measurable `mtr`/`mtd` elements plus stable development row
and cell markers, so a later trace-owned full-matrix renderer can support row
measurement and FLIP presentation without mutating MathML numerical content.
Motion was not implemented or remounted.

Screenshots are retained outside the repository under the task's Codex
visualization area. Structural accessible ownership was inspected through the
live DOM and role queries; no assistive-technology speech session was run, so
this checkpoint does not claim full screen-reader certification.

### Production boundary and validation

Focused tests cover the primitive namespace/structure, one-owner rule, all
eight cases, public-route exclusion, unchanged lazy ownership, theme-token
discipline, and Production exclusion. The Production manifest contains no
MathML capability route, fixture CSS, or `nativeMath` entry, and emitted
assets contain neither fixture copy nor fixture CSS. The existing Linear
Systems dynamic route remains independently listed in the entry manifest.

Validation for the checkpoint includes focused tests, import boundaries,
workspace typechecks, Production build/exclusion evidence, complete verify,
and `git diff --check`. Exact totals and command outcomes are recorded in the
task report.

### Problems and reusable resolutions

- The first Vite invocation forwarded the host value as a positional argument
  and selected a busy IPv6 port. Resolution: start the frontend workspace
  command directly with explicit `--host 127.0.0.1 --port 5180`, then use that
  exact loopback endpoint for the in-app browser.
- A failed browser navigation left an internal error document that could not
  safely retarget. Resolution: open one fresh in-app tab after the reachable
  server is confirmed; do not bypass browser URL policy or switch tools.
- The first Production-exclusion assertion looked for the DEV route title,
  but the title literal belongs to guarded route registration even though the
  module, helper, fixture copy, and CSS were absent from assets. Resolution:
  prove the meaningful boundary through manifest keys, fixture body markers,
  CSS selectors, public route matching, and the current lazy graph rather than
  a brittle registration-string assertion.
- Full-page screenshot clipping did not reliably isolate an offscreen card.
  Resolution: scroll the real page to the evidence surface, capture the
  viewport, and inspect the saved file before accepting it.

If this capability is reused, keep mathematical objects in MathML, keep page
composition in controlled DOM/CSS, preserve one accessible owner, and verify
the actual route rather than an isolated data document. Do not add a parser or
load a deferred math runtime for authored Linear Systems copy without a new
gate.

### Exact exclusions and next gate

Phase 0 changes no numerical algorithm or contract, Computation Trace record,
current Linear Systems product presentation, method list, motion behavior,
Tutor, Glossary, dependency, push, deployment, or public route. It does not
begin Phase 1.

The exact next gate is **maintainer acceptance of Outcome B, followed by
separate authorization of Teaching v2 Phase 1: the authoritative Computation
Trace snapshot extension**. Do not begin Phase 1, Teaching v2 integration,
motion remount, Tutor, push, or deployment without that authorization.

## Linear Systems Teaching v2 design — 2026-08-11

*Historical design checkpoint. The Phase 0 section above supersedes its
authorization and next-gate language without rewriting the evidence below.*

The accepted implementation checkpoint entering this documentation task is
`4f6c5810c41dbc0342c5e44ce1946478cbb2795f` (tree
`4f2fb65e4b270728e09e97bd578543b1f61772bb`) on `main` with a clean worktree.
Direct maintainer browser review now establishes that the Linear Systems Lab
is engineering-correct but not teaching-complete. The current numerical core,
Computation Trace, route, lifecycle, accessibility corrections, Mathematical
Presentation v1, and Visual + Motion implementation remain useful checkpoints;
the motion implementation exists, but its final freeze and independent audit
are paused because the computation presentation will change.

The new sole Teaching v2 design authority is
`docs/superpowers/specs/2026-08-11-linear-systems-teaching-v2-design.md`.
The paired repository-grounded execution authority is
`docs/superpowers/plans/2026-08-11-linear-systems-teaching-v2-implementation-plan.md`.
At this checkpoint both were design/planning artifacts and implementation
remained unauthorized until maintainer approval.

### Maintainer findings received

- `LS-TEACH-01`: the current computed solution uses a semantic table plus a
  weak/misplaced text hat rather than a properly typeset `x-hat` column-vector
  equation.
- `LS-TEACH-02`: matrix-scale and pivot-threshold implementation evidence,
  including learner-visible `Number.EPSILON`, wrongly leads the walkthrough
  and obscures the main Gaussian-elimination sequence.
- `LS-TEACH-03`: the current walkthrough narrates operations and shows changed
  rows but does not show the full matrix-before/operation/matrix-after
  computation required by the teaching goal.
- `LS-TEACH-04`: Diagnostics concatenates relationships and gives scale and
  threshold evidence too much visual authority instead of separately teaching
  `A x-hat`, residual, residual vector, norm, and limitation.
- `LS-TEACH-05`: Method names one runnable method but does not visibly teach
  the linear-system roles, direct/iterative framework, row operations, PLU,
  triangular solves, residual, conditioning boundary, and singular/near-
  singular distinction.

Previous correctness reviews did not miss a numerical regression. Their scope
was numerical output, trace ownership, lifecycle, semantic accessibility,
number/notation policy, and bounded motion. They did not claim curriculum
completeness, full equation typesetting, or that changed-row evidence was a
complete visual derivation.

### Design decisions

- Retain Method -> Data -> Output -> Diagnostics; do not add a fifth top-level
  step.
- Keep Gaussian elimination with partial pivoting as the only runnable method.
  Show Jacobi and Gauss-Seidel as planned iterative contrasts only. Their
  initial guess, convergence assumptions, stopping metric/tolerance, iteration
  cap, failure classification, and repetitive-finite trace require a separate
  future numerical/product design.
- Show direct-versus-iterative method families visibly in Method. Core teaching
  copy must not depend on hidden Glossary cards.
- Recommend a tiny project-owned native MathML visual layer for over-accents,
  matrices, fractions, aligned calculations, and labelled arrows while keeping
  the existing one-accessible-owner policy and number formatter. No parser,
  raw HTML, raw user LaTeX, MathJax, KaTeX, or new dependency is approved.
- Require a focused native MathML spike in the actual route before broad
  adoption. The current browser audit proved the span/table limitation, but an
  isolated MathML data-page test was blocked by browser URL policy, so no
  unsupported visual-compatibility claim is recorded.
- Lead the walkthrough with `A`, `b`, `U^(0)=A`, then full trace-owned matrix
  transformations, final `P/L/U`, explicit `P b`, forward substitution,
  backward substitution, final `x-hat`, and residual check.
- Move matrix scale, pivot threshold, accepted-pivot summary, and binary64
  implementation detail into a closed **Solver safeguard details** disclosure.
  The threshold remains unchanged and remains an engineering safeguard rather
  than proof of singularity.
- Redesign Diagnostics as separate `A x-hat`, `r=b-A x-hat`, residual vector,
  infinity norm, interpretation, qualified preset comparison, and advanced
  safeguard blocks.

### Trace finding and smallest extension

Current evidence is sufficient for pivot candidates/selection, multipliers,
final factors, ordered forward/backward substitution, solution result,
residual arithmetic/norm, preset comparison, and controlled pivot failure. It
is insufficient for authoritative full matrix transformation displays: swap
records retain only the affected rows, elimination records retain pivot/target
rows, and `P b` exists only indirectly across the permutation and component
records.

The Teaching v2 design therefore proposes exactly:

1. `factorization_start.initialU`;
2. full immutable `uBefore` and `uAfter` in each `row_swap`;
3. full immutable `uBefore` and `uAfter` in each `elimination`; and
4. one `right_hand_side_permutation` record with original `b`, permutation,
   and complete `permutedB`.

All records must be copied at the existing authoritative loop boundary. No
second Gaussian-elimination pass, frontend reconstruction, arithmetic-order
change, output change, or new numerical claim is permitted. Dimension remains
at most six, so the complete snapshots stay naturally bounded under the
existing Computation Trace policy.

### KnowledgeBase references

Only the high-level canonical retrieval path was used:

- `Knowledge/mathematics/numerical-analysis/INDEX.md`;
- `Knowledge/mathematics/numerical-analysis/NUMERICAL_T_LAB_CROSSWALK.md`;
- `Knowledge/mathematics/numerical-analysis/linear-systems-and-direct-methods/INDEX.md`;
- `Knowledge/mathematics/numerical-analysis/linear-systems-and-direct-methods/CONCEPT.md`;
- `Knowledge/mathematics/numerical-analysis/linear-systems-and-direct-methods/NOTATION_CROSSWALK.md`;
- `Knowledge/mathematics/numerical-analysis/eigenvalues-svd-and-iterative-methods/INDEX.md`;
- `Knowledge/mathematics/numerical-analysis/eigenvalues-svd-and-iterative-methods/CONCEPT.md`;
- `Knowledge/mathematics/numerical-analysis/eigenvalues-svd-and-iterative-methods/NOTATION_CROSSWALK.md`;
- `Knowledge/mathematics/numerical-analysis/floating-point-and-numerical-reliability/INDEX.md`;
- `Knowledge/mathematics/numerical-analysis/floating-point-and-numerical-reliability/CONCEPT.md`; and
- `Knowledge/mathematics/numerical-analysis/floating-point-and-numerical-reliability/NOTATION_CROSSWALK.md`.

No source guide, private PDF, lower-level evidence file, source locator,
extraction artifact, or KnowledgeBase file was opened or changed. The design
also cross-checked the repository's approved terminology standard and Glossary
catalog. Linear Algebra entries remain module drafts/review-required for
future Glossary publication; missing IDs such as right-hand side, elimination
multiplier, triangular matrices, and substitutions are treated as local
teaching role phrases rather than newly invented canonical terms.

### Browser evidence and problems

Bounded in-app browser inspection at desktop and 390 x 844 confirmed the five
underlying design problems: the small table-attached `x-hat` label, threshold-
first walkthrough, learner-visible `Number.EPSILON` calculation, changed-row
rather than full-matrix operations, compressed Diagnostics chain, and one-
method Method surface. Screenshots were retained outside the product
repository for the task report only.

The task-owned frontend initially took slightly longer than the first bounded
listener probe, but the explicit loopback Vite process then became available
and was used successfully. The isolated native-MathML data-page navigation was
rejected by the in-app browser's URL safety policy. The safe resolution is not
to fabricate evidence or switch browser mechanisms: Phase 0 performs a real-
route capability spike and stops if that proof fails.

### Current state and next gate

At this historical checkpoint, the task changed documentation/design only. It modified no file under
`frontend/src`, `packages/numerics`, `packages/contracts`, `backend`, or `api`;
changes no numerical algorithm, Computation Trace record, motion code, CSS,
route, Store, Tutor, Glossary, ODE, PDE, dependency, or deployment
configuration; and performs no push or deployment.

The next gate at this historical checkpoint was **maintainer approval of the
Linear Systems Teaching v2 design and implementation plan**. That approval and
Phase 0 are now recorded in the current section above.

## Visual + Motion Language v1 — 2026-08-11

Visual + Motion Language v1 starts from accepted commit
`302f0369820751c637d57d76bfda03feb1e8ced9` (tree
`128f45a5652b1e2c40b9b48115f807897b29a927`). The contract foundation is
commit `528ea005de0df9dfa75c5cb542c8419d8975f719` (tree
`20e9f0458988cef045bb91d245e9a9858e7ffd59`), and the Linear Systems replay
implementation is commit `c7d8c18bcdf4f3cf9cdec7e8ac9a18f291f23b46` (tree
`939f60a837bf880dce090ab7201c75324cc429c8`). At that checkpoint, the resulting
finding severity was `P0 = P1 = P2 = P3 = 0` and the next gate was an
**independent Visual + Motion audit**, followed by Linear Algebra Tutor work
only after that gate. The Teaching v2 checkpoint above supersedes that next
gate without rewriting its point-in-time evidence.

The new authoritative
`docs/contracts/VISUAL_MOTION_LANGUAGE.md` separates static visual hierarchy,
semantic change markers, presentation motion, numerical evidence, and
accessibility. It establishes three duration tokens, two restrained easing
tokens, an explicit negative list, reduced-motion equivalence, local
cancellation rules, and mounted-presentation ownership. Computation Trace and
immutable numerical results remain the only mathematical evidence authority;
the renderer neither reruns nor reconstructs an algorithm.

The first consuming implementation is limited to Linear Systems row-swap and
elimination cards:

- `frontend/src/labs/linear-algebra/computationMotion.ts` owns one local,
  generation-checked controller per mounted walkthrough. Row swap uses measured
  whole-row transforms; elimination changes once between trace-provided before
  and after rows. Neither path interpolates numerical text or creates a second
  numerical timeline.
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` exposes native
  local **Replay step** buttons only for those two approved operations. Visible
  source/target/change labels and static before/operation/after evidence remain
  understandable without motion. P, L, pivot, substitution, residual, and
  diagnostics evidence remain static.
- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` cancels or disposes
  transient motion before input edits, Run, preset or dimension changes, New
  experiment, render replacement, failure-surface removal, and route disposal.
  Collapse and navigation dispose through the existing mounted walkthrough
  lifecycle. Replay never changes session, meaningful-work, fingerprint,
  current/stale, or successful-result publication state.
- `frontend/src/app/theme.css` owns the minimal platform duration/easing and
  semantic-marker tokens. `frontend/src/labs/linear-algebra/linearSystems.css`
  owns the local stage layout, transform presentation, quiet phase spine,
  reduced-motion behavior, and contained 320-pixel mathematical overflow.
- Focused coverage lives in `frontend/src/app/themeTokens.test.ts`,
  `frontend/src/app/routeBundleOwnership.test.ts`, and the Linear Systems app
  and walkthrough tests beside their sources.

Validation passes the focused gate at 4 files / 40 tests and the complete
suite at 87 files / 1,209 tests. Frontend, numerics, contracts, and backend
typechecks pass; dependency boundaries pass for four owners plus the Vercel
adapter; full `verify`, `git diff --check`, and the 97-module production build
pass. The manifest keeps the Linear Systems route independently lazy with no
static or dynamic child imports. Its assets move from the accepted baseline
56.52 kB raw / 16.47 kB gzip JavaScript and 14.12 kB raw / 3.09 kB gzip CSS to
62.96 kB raw / 18.42 kB gzip JavaScript and 16.50 kB raw / 3.49 kB gzip CSS.
ODE, Tutor, Glossary, MathLive, and Compute Engine remain separately owned.

Bounded in-app browser replay covered Light and Dark themes at 1440 × 900 and
390 x 844, plus 320-pixel reflow. It verified exact stored row-swap and
elimination endpoints, rapid replay, source/target/change markers, local
formula overflow with zero document overflow, focus preservation, and
cancellation on edit, Run, preset, collapse, and route leave. No browser
warning/error remained. The in-app browser does not expose reduced-motion
media emulation, so reduced behavior is supported by deterministic DOM tests
and source inspection rather than claimed as emulated browser evidence.

Problems and reusable resolutions:

- A styled grid replay stage initially overrode the HTML `hidden` behavior and
  left an empty bar before replay. When a hidden element also owns an explicit
  display mode, preserve the platform contract with a local `[hidden] {
  display: none; }` rule and confirm the actual browser DOM before acceptance.
- A structurally changed walkthrough remained in an older hot-reloaded tab.
  For browser verification after markup ownership changes, open a fresh
  cache-busted route and re-inspect containment rather than trusting stale DOM.
- The first local Vite launch listened through an unsuitable host binding for
  the in-app browser. Use an explicit loopback listener for bounded local
  verification and stop the task-owned process afterward.
- Reduced-motion media emulation is unavailable in the current in-app browser.
  Keep the path deterministic at the DOM/controller boundary, verify the
  shipped media rule, and state the browser limitation instead of inventing
  evidence.
- Reusable replay remains safe because committed state changes first, trace
  before/after data is the only display source, and every invalidating action
  cancels a generation-local frontend controller. Reuse that ownership pattern
  instead of adding motion to sessions, history, storage, or numerical code.

No numerical algorithm or contract, Computation Trace, Architecture v1,
Mathematical Presentation v1, route, AppSessionStore, Tutor, Glossary, ODE,
backend/API, dependency, or deployment file changed. Nothing was pushed or
deployed. Preserve this checkpoint and perform the independent motion audit
before beginning Linear Algebra Tutor integration.

## Linear Systems mathematical-readability corrections — 2026-08-11

Implementation commit `d84573c193f369d620982b9def3927d51197344a`
(tree `cd71c5346c0a7da0245414a71daf9f7eec539f06`) closes MR-01 through
MR-09 from the independent mathematical-readability review. MR-09 was
originally reported as P3 and was promoted by maintainer decision to a P2
release requirement because baseline pseudo-notation was mathematically
ambiguous and hostile to read-aloud use. The task result is
`P0 = P1 = P2 = P3 = 0` for this finding set.

Corrections and ownership:

- MR-01 replaces exact equality after rounded substituted arithmetic with
  approximation while preserving exact definitions and symbolic relations.
  The public convention remains `P A = L U`; displayed rounded factors use
  `P A ≈ L U`, and residual components separate the exact definition from the
  rounded diagnostic.
- MR-02 adds contextual, presentation-only number formatting for ordinary,
  matrix/vector, solution, multiplier, detail, reference-detail, diagnostic,
  and threshold contexts. It trims unnecessary zeros, renders visible `-0` as
  `0`, never hides a nonzero diagnostic as zero, and renders exponent notation
  with multiplication and a real superscript.
- MR-03 presents each forward/backward substitution from its trace-owned
  right-hand side through ordered known contributions, stored numerator,
  diagonal division, and resulting component. It does not recompute any
  arithmetic.
- MR-04 gives each major formula one `role="math"` accessible owner with an
  explicit learner-facing name and one hidden structured visual child. The
  Data relationship reads “A times x equals b”; matrix/vector input regions
  retain separate, non-duplicated names.
- MR-05 stacks the Data equation at narrow widths so A, x, equals, and b remain
  discoverable, and converts wide detail tables into labeled semantic rows.
  Page-level horizontal overflow remains absent.
- MR-06 keeps every trace step but moves pivot candidates, before/after matrix
  state, and ordered arithmetic under Show arithmetic. Level 1 now emphasizes
  mathematical purpose, operation, and result without implementation-oriented
  “stored” or “structured evidence” language.
- MR-07 derives the visible preset/result identity directly from the existing
  session fingerprint status after every edit. No second dirty flag or state
  owner was introduced.
- MR-08 preserves pivot-candidate computation order while marking the selected
  row with visible “Selected” text, `aria-current`, weight, and a non-color
  border marker.
- MR-09 uses real DOM `sub`/`sup` structures for indices, norm types, named
  qualifiers, row operations, and scientific exponents. No LaTeX parser,
  Unicode subscript authority, `innerHTML`, MathLive, or Compute Engine was
  added.

The relevant paths are
`frontend/src/math/structuredMath.ts` and its test,
`frontend/src/labs/linear-algebra/computationWalkthrough.ts` and its test,
`frontend/src/labs/linear-algebra/linearSystemsApp.ts` and its test,
`frontend/src/labs/linear-algebra/linearSystems.css`,
`frontend/src/app/routeBundleOwnership.test.ts`, and the new authoritative
`docs/contracts/MATHEMATICAL_PRESENTATION.md`. Numerical packages,
Computation Trace, routes, platform state, backend, ODE, Tutor, Glossary,
dependencies, and deployment files are untouched.

Validation passes the focused readability/session/bundle gate at 5 files / 43
tests and the full suite at 87 files / 1,201 tests. Frontend, numerics,
contracts, and backend typechecks pass; import boundaries pass for four owners
plus the Vercel adapter; `git diff --check` passes; and the production build
passes at 96 modules. A 30-entry manifest build reports the Linear Systems
asset at 56.52 kB raw / 16.47 kB gzip with no static imports; MathLive,
readonly math, ODE, Tutor, and Glossary remain distinct assets.

The dedicated in-app browser replay covered Starter 3×3, Row swap required,
a non-integer Custom edit/run, stale prior Output, controlled second-column
pivot rejection, near-machine residual and reference evidence, Show
computation, Show arithmetic, Light/Dark, 1440 × 900, 390 × 844, and a
320-pixel reflow stress. Evidence included 292 formula owners with zero
ownership violations, 109 structured subscripts, 14 structured superscripts,
an ordered and explicitly selected pivot row, stacked mobile arithmetic, both
Data terms within the viewport, no page-level overflow, no eager forbidden
assets among 39 observed page assets, and no browser warning/error.

Problems and reusable resolutions:

- The existing readonly-math helper starts deferred MathLive enhancement even
  for simple authored notation. For a lightweight Lab needing only controlled
  text, operators, and scripts, use the small safe DOM helper and guard its
  import graph rather than weakening lazy ownership or building another math
  parser.
- Rounded values initially shared one formatter and exact equality, making
  otherwise correct binary64 evidence look inconsistent. Keep stored values
  authoritative, select display precision by semantic context, and pair exact
  symbolic definitions with approximate rounded substitutions.
- The visible hero identity was only rebuilt on the central render path while
  draft edits intentionally avoid rerendering to preserve input focus. Update
  that one derived DOM label from the fingerprint-backed session transition;
  do not add a dirty flag.
- The optional `agent-browser` CLI was not installed, and the first external-
  Chrome fallback stopped because it could not establish safe URL ownership.
  The maintainer explicitly authorized the dedicated in-app browser, which
  supplied the complete local replay without touching the unrelated Chrome
  session. Reuse the in-app browser for isolated local visual verification.

No Tutor, Glossary, animation, dependency, numerical-contract, Computation
Trace, or Architecture v1 change is included. Nothing was pushed or deployed.
The next gate is an **independent mathematical-readability audit**. Do not
begin Tutor integration or motion before that gate.

## Linear Systems v1 independent-audit corrections — 2026-08-11

Implementation commit `d52946f626084fae7bdbed2d5bd018a211b15332`
(tree `03bf0a8a84aacc81b3b626684c6b69ec43d00c99`) closes all findings from
the independent Linear Systems Product Audit. That audit blocked product
integration with `P0 = 0`, `P1 = 0`, `P2 = 2`, and `P3 = 1`: LS1 retained a
rendered failed-attempt surface after an input edit, LS2 hard-coded a global
walkthrough heading hierarchy, and LS3 omitted optional stored substitution-
aggregate evidence. The correction is limited to the Linear Systems frontend
and tests:

- `frontend/src/labs/linear-algebra/linearSystemsApp.ts` and its test now
  invalidate the one failed-attempt owner on every matrix/vector input edit,
  remove the mounted failure surface immediately, clear expanded failure
  presentation, and preserve the existing immutable successful result and
  fingerprint-derived current/stale state. A later failed Run publishes fresh
  failure evidence from that later attempt.
- `frontend/src/labs/linear-algebra/computationWalkthrough.ts` and its test now
  require the mounting owner to supply the native root-heading level. Success
  evidence nests `h3` → `h4` → `h5` below Output; failure evidence nests `h4`
  → `h5` → `h6` below the Data-owned failed-attempt `h3`. Disclosure controls
  retain their existing `aria-expanded`/`aria-controls` ownership and IDs
  remain unique.
- The detailed substitution renderer now shows
  `accumulatedKnownTermSum` only when that optional value exists in the stored
  trace. It remains inside Show arithmetic, is never recomputed, and has no
  fabricated fallback when absent.

Root causes and reusable resolutions:

- LS1 arose because the input handler cleared JavaScript failure state but did
  not reconcile the already-mounted alert. If attempt-scoped presentation is
  invalidated again, clear the single state owner and remove/rerender its
  owned surface in the same input transition; never leave authority and DOM
  on different attempt fingerprints, and never clear an independent prior
  success as collateral.
- LS2 arose because a reusable renderer chose document-level heading tags
  without mount context. Reusable nested presentation must receive semantic
  heading context from its owner and derive subordinate native levels; do not
  repair outlines with ARIA heading roles.
- LS3 arose because presentation consumed the ordered substitution terms but
  not the optional observational aggregate. Optional trace evidence must be
  rendered only from the producer-owned field and omitted silently when the
  producer omits it.

Validation passed: the test-first gate initially failed in the four expected
LS1/LS2/LS3 assertions; the corrected focused gate passed 3 files / 27 tests,
the complete Linear Algebra directory passed 4 files / 30 tests, import
boundaries passed for four owners plus the Vercel adapter, and full `verify`
passed 86 files / 1,193 tests, all frontend/numerics/contracts/backend
typechecks, and the 95-module production build. `git diff --check` passed.
Bounded browser replay at desktop and `390 × 844` confirmed immediate LS1
removal with preserved stale Output, both native heading outlines, keyboard
Enter disclosure behavior, optional LS3 detail placement, no page-level
mobile overflow, and no page errors.

The only task problem was a root npm argument-forwarding attempt that started
Vite on IPv6 localhost and produced a browser network-error page. The
task-owned process was stopped, the frontend workspace was launched directly
with explicit `--host 127.0.0.1 --port 5173`, and the complete browser replay
then passed. Reuse the direct workspace command when exact Vite host/port
arguments are required.

The resulting local project state has `P0 = P1 = P2 = P3 = 0` for these audit
findings. Architecture v1, numerical packages/contracts, Computation Trace
semantics, routes, CSS, Tutor, Glossary, ODE, dependencies, backend, and
deployment configuration are unchanged. Nothing was pushed or deployed.
The next gate is an **independent correction re-audit**, followed by the
separate **mathematical rendering/readability review**. Do not begin Tutor,
animation, or broader visual-polish work at this checkpoint.

## Linear Systems v1 Day 2 product checkpoint — 2026-08-11

Commit `e5e43f2d62ed9b36969679b0c91c318417574d36` implements the first complete
Numerical Linear Algebra Lab at `/linear-algebra/linear-systems` on the frozen
Architecture v1 boundaries. The frontend owns the Method → Data → Output →
Diagnostics workflow, accessible 2-through-6 matrix editor, controlled draft
validation, current/stale presentation, New experiment, Resume metadata, and
responsive Light/Dark UI. The pre-existing numerical package remains the sole
solver, factorization, residual, reference, and Computation Trace authority.

The Computation Walkthrough is a presentation-only trace consumer. It renders
all current semantic trace kinds, preserves stored ordering, offers native
Show computation/Show arithmetic disclosure, respects generic retention
metadata, and shows controlled failure evidence only through a rejected pivot.
It does not call or reconstruct the solver. Failed runs preserve the prior
immutable success; exact fingerprint restoration makes that same result
current again.

Platform integration adds an independent lazy route, parent-section
navigation, intent prefetch, generic optional-Tutor handling, in-memory Store
capture/restoration, privacy-safe Resume labels, and truthful Home/About/Linear
Algebra overview status. The route deliberately has no Linear Algebra Tutor
binding and no Glossary binding. ODE, the accepted ODE Glossary, PDE, backend,
dependencies, and deployment configuration are unchanged.

Day 2 verification:

- focused route/UI/platform gate: 12 files, 95 tests passed;
- full suite: 86 files, 1,189 tests passed;
- frontend, numerics, contracts, and backend TypeScript checks passed;
- four-owner plus Vercel-adapter import-boundary verification passed;
- production build: 95 modules, with a separate Linear Systems JavaScript
  chunk of 44.44 kB raw / 13.58 kB gzip and stylesheet of 11.25 kB raw /
  2.61 kB gzip;
- manifest and browser resource evidence confirmed that Home does not eagerly
  load Linear Systems and that ODE, Tutor, Glossary, MathLive, and Compute
  Engine remain separate/deferred; emitted assets contained no DEV Glossary or
  private-reference markers;
- local desktop and 390 × 844 browser verification covered both presets,
  editing/validation, current/stale restoration, successful and pivot-failed
  traces, arithmetic disclosure, reset, route restore, Resume, Light/Dark,
  keyboard operation, contained overflow, direct nested navigation, console
  health, and an ODE Forward Euler smoke run; and
- `git diff --check` passed. No push, Preview deployment, or Production
  deployment occurred.

Problems found during verification were narrow presentation issues: the shared
screen-reader-only class had previously arrived only with ODE CSS, so the
Linear Systems route now owns its scoped equivalent; narrow factor matrices
needed explicit P/L/U labels and smaller contained cells; and successful Run
needed a focusable result heading plus a controlled live announcement. Each
was corrected inside the Linear Systems frontend and covered by focused tests
and browser recheck.

At this Day 2 checkpoint, the exact next task was separately gated **Linear
Algebra Tutor integration**. The later independent audit and correction
checkpoint above supersede that sequencing: correction re-audit and then the
mathematical rendering/readability review now come first. Do not add Linear
Algebra Glossary content, change numerical contracts, push, or deploy as part
of either gate.

## Architecture v1 migration checkpoint — 2026-08-10

Numerical T Lab now has explicit npm-workspace ownership without a product or
numerical behavior change:

- `frontend/` owns the Vite browser application, platform lifecycle, pages,
  Labs, workflow sessions, Tutor client/panel, Glossary, and browser math;
- `backend/` owns the server Tutor handler and local API entry;
- `packages/numerics/` owns ODE, Convergence, closed-expression, Linear
  Systems, and Computation Trace authority;
- `packages/contracts/` owns only serializable browser/server Tutor DTOs; and
- root `api/chat.ts` remains the thin `/api/chat` Vercel adapter.

Current architecture authority is split deliberately across
[the implemented map](./architecture/CURRENT_ARCHITECTURE.md),
[dependency rules](./architecture/DEPENDENCY_RULES.md),
[deployment architecture](./architecture/DEPLOYMENT_ARCHITECTURE.md), and
[numerical contracts](./contracts/NUMERICAL_CONTRACTS.md). The root commands
remain `dev`, `dev:api`, `test:run`, `typecheck`, `typecheck:api`, `build`, and
`verify`; `verify` now also runs the repository-owned import-boundary checker.

Migration problems and resolutions:

- The solver module previously ran a Vite-specific coefficient diagnostic at
  import time. The diagnostic remains ODE/frontend development ownership and
  runs when the ODE application module loads in DEV; the solver package is now
  DOM/Vite-independent without changing numerical output.
- Vite workspace execution changes its root. `frontend/vite.config.ts`
  explicitly owns `frontend/` and still emits to root `dist/` with base `/`.
- Workspace execution could also change local API environment-file lookup.
  Root `dev:api` invokes `backend/src/dev.ts` directly, preserving repository-
  root `.env.local`/`.env` lookup.
- A server handler move could weaken the Vercel edge. Root `api/chat.ts` stays
  in place and has direct tests for `405` plus `Allow: POST` and exact handler
  status/body forwarding.
- Browser/session TypeScript is not necessarily numerical authority. Editable
  Linear Systems drafts and ODE workflow state remain frontend-owned; only
  algorithms, trace evidence, and immutable presets moved to numerics.
- A broad numerical barrel could eagerly execute unrelated domains. The
  numerical package exposes deliberate subpaths and route-bundle tests protect
  the existing lazy graph.

The migration did not add the Linear Systems route, computation renderer,
Tutor integration, Glossary content, ODE trace, PDE work, dependency upgrade,
push, Preview, or deployment. At that checkpoint, Linear Systems Day 2 was the
next task; it has since been completed on those boundaries as recorded above.

Automated migration evidence is green: 82 test files / 1,168 tests, frontend,
numerics, contracts, and backend TypeScript checks, the 87-module Vite
production build, the four-owner import-boundary check, and `git diff --check`.
The accepted large deferred MathLive/Compute Engine chunk warning remains; no
`manualChunks` or dependency change was introduced merely to silence it.

The
[Architecture v1 migration review](./reviews/2026-08-11-architecture-v1-migration-review.md)
records verdict **ARCHITECTURE V1 LOCALLY MIGRATION-COMPLETE — READY FOR
MAINTAINER ACCEPTANCE**. Manifest evidence retains separate ODE, Tutor,
Glossary, MathLive, and editable/Compute Engine boundaries and contains no DEV
Glossary or private-reference markers. Bounded local browser verification
passed all public routes, unknown-route handling, internal navigation, theme,
IVP Run, Convergence, mock Tutor, Glossary, mobile containment, and console
health. Nothing was pushed or deployed.

**Status (2026-08-01):** Numerical T Lab is locally verified and
Production-verified at `https://numerical-t-lab.vercel.app/`. The GitHub
repositories, Git remotes, existing Vercel project, Git integration, and
canonical domain retain the `numerical-t-lab` slug. The local workspace rename
and reopen are complete at `D:\numerical-t-lab`; Project Identity Migration is
complete. See
[the rename review](./reviews/2026-07-22-numerical-t-lab-rename-review.md).
The separate project-language gate is also complete: Yiding (Bruce) Tian
recorded all nine maintainer decisions on 2026-07-28, and the terminology,
notation, and teaching-voice standards are approved as Version 1. That approval
is documentation governance only. The Glossary catalog and project copy audit
are now reconciled across all 197 stable IDs and 55 copy records, with six
future implementation groups and local validation/traceability. The four ready
Group A records (`COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005`) are
accepted. Group B records `COPY-006` through `COPY-019` and Group C records
`COPY-020` through `COPY-029` are accepted. Group D records `COPY-030` through
`COPY-040` are accepted. Group F1 implements `COPY-043`, completes the
pre-Glossary consistency review, and is accepted as prerequisite state. All
twelve `COPY-NC-*` records remain review-only and have explicit
classifications. The four language findings and
one deterministic Tutor behavior finding from that review are now
`CLOSED_VERIFIED` by the separately authorized two-commit
[pre-Glossary repair](./reviews/2026-07-29-pre-glossary-repair-review.md), with
verdict **PRE-E REPAIR COMPLETE — GROUP E MAY BE PLANNED**. Both repair commits
are accepted prerequisites. The documentation-only
[ODE Glossary Wave 1 design](./superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md),
[ten-card content packet](./content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md),
[approval checklist](./content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md),
and
[readiness review](./reviews/2026-07-29-ode-glossary-wave-1-design-readiness-review.md)
now record verdict **DESIGN AND CONTENT APPROVED — E1 AUTHORIZATION
REQUIRED**. Yiding (Bruce) Tian approved D01–D18 as Option A, all ten cards
with exact revisions, and all ten annotation records on 2026-07-29.
The subsequent authorized E1 attempt stopped before source or test changes
when repository inspection confirmed that the compact Glossary model cannot
represent all approved rich card fields. The maintainer selected
`E1-SCHEMA-01 = Option 2`; the
[rich-model design](./superpowers/specs/2026-07-29-rich-glossary-content-model-design.md),
[field matrix](./content/RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md), and
[readiness review](./reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md)
are complete with verdict **RICH GLOSSARY MODEL DESIGN COMPLETE —
IMPLEMENTATION AUTHORIZATION REQUIRED**. The repository-grounded
[implementation plan](./superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)
and
[plan review](./reviews/2026-07-29-rich-glossary-content-model-plan-review.md)
are complete with verdict **RICH GLOSSARY IMPLEMENTATION PLAN COMPLETE —
AUTHORIZATION REQUIRED**. The subsequently authorized generic implementation
was accepted at `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`, and its
[implementation review](./reviews/2026-07-29-rich-glossary-content-model-implementation-review.md)
records verdict **RICH GLOSSARY MODEL IMPLEMENTED — READY FOR MAINTAINER
ACCEPTANCE** as a point-in-time verdict. The separately authorized fresh E1
restart now contains exactly two inert Core entries, eight inert ODE entries,
two ODE context-only overrides, and ten composed cards. The
[E1 review](./reviews/2026-07-29-ode-glossary-wave-1-e1-content-review.md)
records local verification and verdict **E1 RICH CONTENT IMPLEMENTED AND
INERT — READY FOR MAINTAINER ACCEPTANCE** as its point-in-time verdict. The
maintainer accepted E1 at `08b80522283438a233974456a026a6dbc2a96746`. The
first E2 integration pass stopped before source/test changes at two interaction
contract mismatches. The
[E2 Runtime Contract](./content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
now records `E2-CONTRACT-01`, `E2-CONTRACT-02`, and a complete source-grounded
contract for all ten records. It is the sole implementation authority for E2
interaction details. The separately authorized E2 implementation now creates
exactly one complete-IVP route-instance binding and ten explicit annotations.
The generic production registry remains empty; the accepted ten-card registry
is composed only behind the complete-IVP dynamic route. `/ode` remains plain,
Tutor remains independent, and the maintainer accepted E2 for entry into the
mandatory E3 review at `8c8e90a6abc177132f3e033bdb575f2042b982a9`. The
[E2 integration review](./reviews/2026-07-30-ode-glossary-wave-1-e2-integration-review.md)
records the exact contract, browser, lifecycle, and production-graph evidence.
The independent
[E3 integration review](./reviews/2026-07-30-ode-glossary-wave-1-e3-integration-review.md)
passed the exact committed E1+E2 state with zero P0/P1/P2 findings and no
product-source change. E1, E2, and E3 are accepted. The first mandatory F2
review found two P1 findings (`F2-TUTOR-NOT-001`,
`F2-TUTOR-TERM-001`) and one P2 finding (`F2-ABOUT-STATUS-001`). The
[blocking-corrections review](./reviews/2026-07-30-f2-cross-surface-blocking-corrections-review.md)
records their accepted narrow correction. The fresh corrected-state F2 review
then found `F2-TUTOR-NOT-002` and `F2-ODE-OVERVIEW-TERM-001` at P1, plus
adjacent P3 wording drift `F2-ODE-OVERVIEW-TERM-002`. The
[final terminology corrections review](./reviews/2026-07-30-f2-final-terminology-corrections-review.md)
records their narrow local correction. The final independent F2 review then
found `F2-COMPARE-COUNT-001` and `F2-GOV-STATUS-001`. The
[final count and governance corrections review](./reviews/2026-07-30-f2-final-count-and-governance-corrections-review.md)
records their narrow local correction. All seven known F2 blockers remain
closed. The
[final independent F2 consistency review](./reviews/2026-07-31-ode-glossary-wave-1-final-f2-cross-surface-consistency-review.md)
passed exact commit `451a0cbe5e67afc58b280795dd13d43db09d16af` with
`P0 = P1 = P2 = 0` and no product-source change. F2 is independently passed
pending maintainer acceptance of that review commit.

Separately, the bounded frontend visual-polish pass now has a local
theme/Tutor refinement foundation and final integration audit documented by the
[theme and Tutor refinement review](./reviews/2026-07-31-frontend-theme-and-tutor-refinement-review.md).
The default is a lower-glare Light theme; the pre-polish palette is available
as Dark; chart presentation redraws without numerical recomputation; the
initial brand-focus artifact is corrected; the accepted 40px toggle contains a
solid 24px crescent; the learner-facing display brand is `Numerical T Lab`; and
the Tutor gains a larger, contained transcript/composer layout. Local and Vercel mock settings are
enabled for future Development, Preview, and Production deployments. Product
behavior, numerical contracts, Tutor prompts/mathematical responses, Glossary
content and lifecycle, routes, and production boundaries are unchanged. The
local source commits await maintainer review and have not been pushed or
deployed, so the public Production source baseline remains unchanged. Vercel
requires a future redeployment before the updated environment value can affect
a deployment; no redeployment was triggered.

`E1-BROWSER-EXCEPTION-01` accepts only the unchanged Google Fonts
stylesheet/font request chain for this E1 evidence gate. The source and
starting-HEAD `index.html` blobs are identical at
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`. The pre-existing dependency is
recorded as `BASELINE-EXT-FONT-001` (P3, accepted nonblocking carry-forward,
owner: future Platform/asset-policy review); E1 introduced no external
traffic, and no remediation was performed.
`COPY-003` and `src/pages/homePage.ts` remain review-only and unchanged. These
iterations preserve calculations, classifications, grounding values,
request/API/session behavior, and numerical lifecycle. E2 adds only its
accepted ODE-owned binding, explicit annotations, direct tests, narrow layout,
review, and governance updates. No Tutor handoff or generic Framework redesign
occurred. No push, Preview deployment, or Production deployment was authorized
or performed, so the public deployed site remains unchanged from its
previously deployed commit.

## Linear Systems v1 Day 1 checkpoint — 2026-08-10

The maintainer accepted public baseline
`b58584a5f7a1d5b09874479d3b413a063b94e061`, tree
`406430a598182fbecfb313f68552e44c473c7367`, as the starting point for a
three-day portfolio-grade v1. The production-ready Initial Value Problems Lab
and closed Glossary E1/E2/E3/F2 gates remain accepted and were not reopened.

This checkpoint establishes the authoritative Linear Systems numerical core
without adding a route or visible product behavior. The approved method is
Gaussian elimination with deterministic partial pivoting for dense real
`A x = b`, `2 <= n <= 6`, using the public factorization `P A = L U`. The
product pivot safeguard is
`64 * Number.EPSILON * ||A||_inf`, using the original matrix norm directly.
The implementation performs the required prior-column `L` swap during later
pivots, forward/backward substitution, finite-intermediate checks, original-
data residual diagnostics, and exact approved-preset reference matching.

The exact checkpoint files are:

- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts`
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.test.ts`
- `packages/numerics/src/linear-algebra/linearSystemsPresets.ts`
- `packages/numerics/src/linear-algebra/linearSystemsPresets.test.ts`
- `frontend/src/labs/linear-algebra/linearSystemsSession.ts`
- `frontend/src/labs/linear-algebra/linearSystemsSession.test.ts`
- `docs/superpowers/specs/2026-08-10-linear-systems-lab-v1-design.md`
- `docs/superpowers/plans/2026-08-10-linear-systems-lab-v1-implementation-plan.md`
- `docs/contracts/NUMERICAL_CONTRACTS.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`

Successful numerical results defensively copy input, deeply freeze all exposed
arrays/records, and contain only the approved factors, solution, pivot,
residual, threshold, fingerprint, and optional preset-reference data. The pure
session owns controlled string drafts, selected preset or Custom identity,
input fingerprint, latest immutable successful result, current/stale status,
and meaningful-work state. An edit preserves prior output and marks it stale;
restoring its successful fingerprint makes it current again. A failed run
returns a pure failure record and the unchanged session. A later successful run
atomically replaces the prior snapshot. AppSessionStore, Resume, route, UI,
Tutor, Glossary, and deployment integration remain unimplemented.

Problems encountered and resolved:

- The prior PLAN/INDEX still used pending Glossary gate language although the
  maintainer's current baseline accepts those gates. Current milestone blocks
  now establish Linear Systems v1 and label the detailed Glossary record as
  historical instead of rewriting that evidence.
- The local knowledge packages are retrieval-ready but their exact direct-
  method algorithms remain mathematical-review gated. The maintainer-approved
  task contract therefore supplies the exact algorithm, factor convention,
  and threshold; the knowledge packages were used only to preserve terminology
  and the residual/error/conditioning boundary.
- A solution-only elimination can appear correct while returning an invalid
  `L` after a later row swap. The implementation swaps only the previously
  computed `L` columns and directly tests a later-pivot example plus
  `P A ~= L U`.
- A conventional `max(1, ||A||_inf)` scale would incorrectly reject small
  proportionally sound systems under this product contract. The implementation
  uses the original norm without normalization and tests threshold equality,
  just-above acceptance, direct magnitude scaling, and a `1e-100` system.
- Mutable input/work/result aliases would violate later Store ownership. Input
  and preset data are copied or deeply frozen, and direct mutation/identity
  regressions verify the boundary.

Reusable resolution for future numerical contracts:

1. Declare the public factorization/sign/index convention before coding and
   test its full identity, not only the final solution.
2. Separate the mathematical problem, finite-precision algorithm, project
   engineering safeguard, and safe learner-facing claim.
3. Compute diagnostics from the original problem data and name the equation,
   norm, reference authority, and unavailable conditioning context.
4. Tie result currency and reference authority to one deterministic parsed-
   input fingerprint.
5. Publish immutable success only after the complete operation; preserve it by
   reference across failed attempts and stale drafts.

Validation for this checkpoint:

- focused Linear Systems gate: 3 files, 42 tests passed;
- full unit suite: 80 files, 1,149 tests passed;
- application TypeScript typecheck passed;
- browser automation, production smoke, build/deployment, remote contact,
  push, and KnowledgeBase regeneration were intentionally not run.

The next gate is maintainer acceptance of this Day 1 commit. Day 2 may then
implement route/UI integration behind `/linear-algebra/linear-systems`; Tutor
work remains a later phase after route lifecycle verification.

## Linear Systems v1 Day 1.5 Computation Trace checkpoint — 2026-08-10

Starting from accepted local Day 1 commit
`d323fec9b4752290f0a88723db31f8c89ec4f0c5`, tree
`27895631400cd862e02398b51c43db5625b09249`, this checkpoint establishes the
first platform-level structured Computation Trace contract and makes the pure
Linear Systems core its first producer. No route, renderer, Tutor integration,
ODE trace, AppSessionStore change, browser behavior, dependency, push, or
deployment is included.

The exact checkpoint paths are:

- `packages/numerics/src/trace/computationTrace.ts`
- `packages/numerics/src/trace/computationTrace.test.ts`
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.ts`
- `packages/numerics/src/linear-algebra/linearSystemsNumerics.test.ts`
- `frontend/src/labs/linear-algebra/linearSystemsSession.test.ts`
- `docs/superpowers/specs/2026-08-10-linear-systems-lab-v1-design.md`
- `docs/superpowers/plans/2026-08-10-linear-systems-lab-v1-implementation-plan.md`
- `docs/contracts/NUMERICAL_CONTRACTS.md`
- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`

The generic pure contract distinguishes bounded finite, repetitive finite, and
unbounded processes. It represents all-meaningful-step,
first-five-plus-distinct-final, and first-five-plus-continuation retention;
derives retained counts; validates finite known totals and retention limits;
and defensively copies and deeply freezes semantic steps and continuation
metadata. Linear Systems is bounded at `n <= 6` and retains all approved
meaningful steps.

The one existing numerical path now emits structured records for original-
matrix scale and `tauPivot`, pivot candidates and acceptance, exact row swaps,
each elimination row update, completed `P A = L U` factors, every forward and
backward substitution component, original-data residual arithmetic and norm,
and authorized preset-reference difference. A `pivot_rejected` error may carry
valid evidence through its rejected selection without publishing partial
success. All existing Day 1 numerical fields and session publication,
fingerprint, preset-authority, current/stale, and by-reference snapshot
semantics remain unchanged.

Problems encountered and resolved:

- A second trace-only sum of triangular-solve contributions can overflow even
  when the released sequential `value -= product` path remains finite. Ordered
  products and actual sequential accumulators therefore remain authoritative;
  the separately accumulated sum is included only while finite and never
  changes success/failure classification.
- Failure evidence needed to remain compatible with the existing atomic result
  union. The existing error record gained only an optional immutable trace, and
  only pivot-threshold rejection currently supplies it; no partial success
  shape or session copy was introduced.
- Generic freezing alone could freeze producer-owned input objects or retain
  aliases. The trace factory instead validates/copies pure arrays and records,
  then deeply freezes its own copy.

Reusable resolution for later numerical producers:

1. Emit semantic evidence inside the authoritative numerical loop; never rerun
   or reconstruct an algorithm for presentation.
2. Bound retention at generation time according to process kind.
3. Preserve released arithmetic order and never let trace-only diagnostics
   change numerical acceptance.
4. Keep traces as immutable result-owned pure data; sessions retain them only
   through the existing successful result snapshot.
5. Keep renderers and Tutor presentation/explanation downstream of numerical
   authority.

Validation for this checkpoint:

- focused trace/Linear Systems gate: 3 files, 55 tests passed;
- full unit suite: 81 files, 1,166 tests passed;
- application TypeScript typecheck passed;
- final Git whitespace and authorized-scope checks passed before commit;
- browser automation, Production smoke, Preview/Production deployment,
  remote contact, push, and KnowledgeBase work were intentionally not run.

The next gate is maintainer acceptance of the Day 1.5 trace commit. Day 2 may
then implement the complete route/UI and presentation-only trace renderer;
Tutor work remains a later gate after route lifecycle verification.

## 1. Product and public routes

The learner-facing product is **Numerical T Lab**. The locally implemented
complete Labs are the Initial Value Problems Lab and the Linear Systems Lab.

| Route | Page | Status |
|---|---|---|
| `/` | Platform Home | Available |
| `/ode` | Numerical ODE overview | Available |
| `/ode/initial-value-problems` | Initial Value Problems Lab | Available |
| `/linear-algebra` | Numerical Linear Algebra overview | Available locally |
| `/linear-algebra/linear-systems` | Linear Systems Lab | Available locally |
| `/pde` | Numerical PDE roadmap | Planned |
| `/about` | Platform/project overview | Available |
| any other page path | In-shell Not Found | Available |

Numerical Linear Algebra now has one locally verified runnable Lab; Least
Squares, SVD, and Eigenvalues remain planned, and PDE remains a truthful
roadmap. Linear Algebra Tutor and Glossary integration remain separately
gated. The prior accepted Glossary milestone record begins below. The
[authoritative Glossary design](./superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md)
is approved and committed. Commit 1, the content-agnostic Glossary model and
scope lifecycle, is implemented and accepted after conservative audit.
The readonly-math accessibility prerequisite is locally verified. Commit 3
shared Host/surface/modal infrastructure and a minimal DEV-only Playground are
implemented and locally/browser verified but not deployed. Its prior lifecycle
audit findings have locally verified follow-ups and a final conservative
re-audit verdict of SAFE TO PROCEED. Commit 4 completes the DEV-only Playground
and production-exclusion evidence. The complete framework's first 2026-07-28
adversarial local release review returned **RELEASE BLOCKED** with one P1, one
P2, and one DEV-only P3 finding. All three were narrowly repaired in
`8af3ed80b25a520cfa61fa2d7037dea9ed2899d1`. The
[repeated independent final review](./reviews/2026-07-28-content-agnostic-interactive-glossary-framework-final-review.md)
then returned **APPROVED FOR LOCAL FRAMEWORK RELEASE** with all 40 binding
requirements passing or passing with explicit manual carry-forwards. The
framework is locally accepted as complete; the blocked review remains
unchanged as history. The generic production registry remains empty and has
no eager Wave 1 importer. The deployed Production baseline remains unchanged
and excludes the Playground. The local E2 production build now activates its
accepted ten-card registry only through one complete-IVP route binding; Home,
static pages, and `/ode` remain unannotated.
Nothing was pushed or deployed by the repair or final review.

The documentation-only project-language reconciliation is also complete. It
retains all 197 candidate IDs, reports four required-ID gaps without adding
them, prepares 10 Wave 1 and 13 high-priority Wave 2 rich drafts, and maps all
55 copy records to Groups A–F. The four ready Group A Platform/overview copy
records are accepted; deferred `COPY-003` remains held with the PDE module.
The 14 Group B IVP Method/Data/Output and preset records and the 10 Group C
Convergence/error records are accepted. The 11 Group D Tutor numerical-language
records are accepted. Group F1 implements `COPY-043`, classifies all twelve
review-only records, and completes the accepted pre-Glossary consistency
checkpoint. Its five P2 findings are `CLOSED_VERIFIED`, and both prerequisite
commits are accepted. Group E0 design and content governance now approves
exactly 10 revised Wave 1 cards and 10 complete-Lab annotation records.
The historical E1 schema stop was closed by the accepted generic rich-model
implementation. The fresh E1 restart is locally complete and inert, with
two Core entries, eight ODE entries, two context-only overrides, and ten
composed cards in source. E1 is accepted. The E2 runtime contract is complete
and its separately authorized source/test implementation is accepted through
one complete-IVP binding and ten explicit annotations. Independent E3 review
passed with zero P0/P1/P2 findings and is accepted. The first Group F2 review
found two P1 and one P2 blocking findings, and its correction remains closed.
The fresh corrected-state F2 review found two additional P1 blockers, and the
same `/ode` sentence carried one adjacent P3 wording drift. Those items are
locally corrected. The final review's Compare count and current-state
governance blockers are also locally corrected. All seven known F2 blockers
remain closed. The final independent F2 review passed with zero P0/P1/P2
findings and is pending maintainer acceptance of the F2 review commit.

## 2. Verification baseline

Final Phase 6 local verification used Node 22.23.1, npm 10.9.8, Vite 5.4.21, TypeScript 5.4, and Vitest 2.1.9.

At the final local reopen checkpoint, Cursor/Codex opened the canonical
`D:\numerical-t-lab` workspace. Git remained valid on branch `main`; HEAD
remained `521d8eba2aad3ad361c289e3e4b1e8e2e7ce6f30` across the physical
folder rename; the worktree remained clean; and `origin` and `vercel` retained
the canonical Numerical T-Lab repository URLs. The local typecheck, API
typecheck, build, and verification evidence recorded below remains applicable,
and the migration-closeout commit reruns those automated gates from the
canonical path.

```bash
npm run test:run
npm run typecheck
npm run typecheck:api
npm run build
npm run verify
npm run dev
npm run dev:api
npm run preview
```

The Group A Platform/overview copy iteration passed its focused page suite
(2 files, 9 tests), static route-bundle ownership suite (1 file, 7 tests), and
full `npm.cmd run verify` gate (73 files, 1,028 tests, both TypeScript checks,
and a 79-module production build). Browser review covered `/`, `/about`,
`/ode`, `/linear-algebra`, and `/pde` at 1440 × 900 and 390 × 844. Approved
copy rendered exactly; route status and links remained truthful; current-page
and mobile-menu focus remained visible; and no clipping, horizontal overflow,
malformed encoding, or console warning/error was observed. The entry chunk
grew by 90 raw bytes for copy only, the accepted non-entry chunk inventory and
sizes remained unchanged, and production artifacts still exclude the
DEV-only Glossary Playground and content fixtures. No push or deployment was
performed.

The Group B IVP workflow copy iteration passed its focused suite (6 files,
57 tests) and full `npm.cmd run verify` gate (73 files, 1,031 tests, both
TypeScript checks, and a 79-module production build). A TypeScript AST
non-change audit and direct diff review confirmed that numerical literals,
calculations, grid arithmetic, validation order, method/preset identity and
values, default state, routes, sessions, imports, Tutor, Convergence teaching,
and Glossary ownership did not change. Browser review covered
`/ode/initial-value-problems` at 1440 × 900 and 390 × 844 through Method, Data,
presets, Run, Output, Compare, and representative validation errors, plus a
brief `/ode` regression. Numeric output stayed unchanged; failed reruns
preserved the last successful output; and no clipping, horizontal overflow,
malformed encoding, or console warning/error appeared. The existing shared
ODE/Convergence and lazy IVP chunks grew only by plausible copy deltas
(`+161/+83` and `+285/+62` raw/gzip bytes); no chunk, dynamic import, Glossary
content, ODE binding, or DEV fixture was added. No push or deployment was
performed.

The Group C Convergence/error copy iteration passed its focused suite (5 files,
93 tests) and full `npm.cmd run verify` gate (73 files, 1,033 tests, both
TypeScript checks, and a 79-module production build). A TypeScript AST
comparison matched 8,573 production nodes with strings ignored, proving
unchanged imports, identifiers, operators, numeric/status literals, branches,
calls, and return shapes. Browser review covered reliable and real
below-resolution evidence, metric switching, stale and missing-exact states,
Compare ineligibility, teaching sections, formula accessibility, and
1440×900/390×844 layout without page overflow or console issues. The existing
shared ODE/Convergence and lazy IVP chunks changed only by bounded copy deltas
(`+44/+15` and `+149/+18` raw/gzip bytes). Calculations, classifications,
precedence, tolerances, eligibility, chart data, stored results, Tutor, and
Glossary behavior remain unchanged. No push or deployment was performed.

The Group D Tutor numerical-language iteration passed its focused suite (5
files, 52 tests) and full `npm.cmd run verify` gate (73 files, 1,042 tests, both
TypeScript checks, and a 79-module production build). A strict TypeScript AST
comparison against starting HEAD matched 5,600 nodes and found only 18
authorized text-fragment changes across the three production owners. Request
validation, status/content types, provider URL, `gpt-4o-mini` model, message
roles/order, fetch options, response parsing and shape, demo routing, chart
instructions, session access, grounding values, abort/cancellation, transcript,
panel DOM/listeners/focus, and lazy ownership remain unchanged. Isolated
localhost review at 1440×900 and 390×844 covered the updated questions and
subtitle; smaller-step, graph, theoretical-order, LTE, current/unavailable
Convergence, and nonlinear-diagnostic replies; stale-evidence exclusion after a
new Run; Compare unavailability; focus restoration; wrapping; and page overflow.
The console remained clean. Prompt-only stiffness/tolerance policy and provider
contract cases remain deterministic-test evidence because no new demo route or
real-model request was authorized. The existing Tutor chunk changed by
`+8/-7` raw/gzip bytes, the lazy IVP route by `+27/+3`, and entry raw size
remained unchanged; no chunk, import, dynamic import, network dependency,
Glossary content, or ODE binding was added. No push or deployment was
performed.

The Group F1 pre-Glossary consistency iteration changed only the
editable-field label from “Parsed expression” to “Interpreted expression” and
added its exact focused assertion. The tests-first run failed only that
assertion; the final file passed 13 tests. The required cross-surface suite
passed 13 files and 135 tests, and `npm.cmd run verify` passed 73 files and
1,042 tests, both TypeScript checks, and the 79-module production build.
Source review confirmed no DOM, MathLive, parsing, validation, focus,
virtual-keyboard, accessibility-ownership, or cleanup change. Development and
production-preview browser review covered the public routes and IVP Lab at
1440×900 and 390×844, including accepted A–D copy, Convergence, Tutor demo,
generic Glossary surfaces, `COPY-043`, focus/modal containment, page overflow,
and console health. Production retained eight JavaScript and seven CSS files
with the same normalized 12 static and 5 dynamic import edges. The existing
editable-math chunk changed by only `+5/+4` raw/deterministic-gzip bytes.
Production excludes the DEV route/fixtures and still contains no Glossary term
or ODE binding.

All twelve `COPY-NC-*` records remain review-only. Six are
`CONSISTENT_NO_CHANGE`, five are `CONSISTENT_WITH_LOCAL_CONTEXT`, and
`COPY-NC-012` is `STALE_BUT_NON_BLOCKING` because its audit quotation predates
the current handoff's truthful addition of the absent ODE binding. The
[Group F1 review](./reviews/2026-07-29-pre-glossary-project-language-consistency-review.md)
records four P2 language findings (`F1-LANG-001` through `F1-LANG-004`) and
one P2 demo behavior finding (`F1-BEH-001`). No finding was fixed in F1.

The separately authorized
[pre-Glossary repair](./reviews/2026-07-29-pre-glossary-repair-review.md)
closes all five findings as `CLOSED_VERIFIED` in two commits. The language red
gate failed exactly 14 new assertions while 109 prior assertions passed; its
green gate passed 123 tests. The behavior red gate failed only the exact
`Why is this unstable?` regression while 35 other tests passed; its green gate
passed all 36 tests. The cumulative focused gate passed 10 files and 161
tests, and `npm.cmd run verify` passed 73 files and 1,048 tests, both
TypeScript checks, and the 79-module production build. Local deterministic
demo review at 1440×900 and 390×844 confirmed the repaired teaching, solver,
chart, and Tutor language; retained table/summary behavior; corrected unstable
routing; contained responsive layout; visible focus; and no console warning
or error. Production retained eight JavaScript and seven CSS files and the
same normalized 12-static/5-dynamic import graph. The directly affected
existing Convergence and lazy IVP chunks changed by only `-3/-24` and `+126/+2`
raw/deterministic-gzip bytes. Server-only Tutor strings and the bounded
predicate remain outside browser assets; production still contains no Glossary
term, DEV fixture, or ODE binding. Nothing was pushed or deployed.

`npm run verify` passed on 2026-07-14:

- 60 test files passed;
- 866 tests passed;
- application typecheck passed;
- API typecheck passed;
- production build passed with only the accepted large deferred-chunk warning.

Local browser checks covered Home, every public overview/page, the nested ODE route, direct preview requests, client Not Found, desktop/mobile navigation, mobile Tutor modal behavior, horizontal overflow, lazy asset loading, and console errors. The local mock API returned HTTP 200 with `demoMode: true`; malformed input returned HTTP 400.

The non-production Vercel Preview for commit `2232595cbea57504a9ba2c3e1c949e3d621bd347` was verified at `https://numerical-ode-lab-w-aq5e8owap-bruce-tian.vercel.app` on 2026-07-14. Direct nested routes and refresh, client Not Found, runtime chunk boundaries, mock Tutor, session lifecycle, New experiment flows, mobile overflow, and a clean console passed. Using a temporary Automation Bypass secret, malformed `POST /api/chat` returned HTTP 400 with `application/json; charset=utf-8` and `{ "error": "messages array is required." }`, not `index.html`. The sampled entry JavaScript, platform CSS, and WOFF2 font returned HTTP 200 with `application/javascript`, `text/css`, and `font/woff2` respectively. The temporary secret was removed immediately after sampling and its revocation was confirmed by the restored Vercel Authentication redirect.

The Numerical T-Lab migration Preview
`dpl_9eRKmCZahUxEa34X9H2rUffCZzEr` and Production deployment
`dpl_GwW9hjgJgX86MEB6Co4Eqrxg8utp` both used exact reviewed commit
`ead244ecefb82475414c73e15293184d99e1b78a`. Route, title, identity,
responsive layout, Tutor, lazy-loading, asset, API, and console checks passed.
Production raw sampling confirmed malformed `/api/chat` returns HTTP 400 JSON
and representative JavaScript, CSS, and WOFF2 assets have the expected content
types. `numerical-t-lab.vercel.app` is the verified canonical domain. The
former `numerical-ode-lab-wai.vercel.app` address remains a verified alias
serving the same Production deployment without redirecting the browser.

## 3. Platform architecture

`frontend/src/main.ts` is a thin platform bootstrap. `frontend/src/app/platformBootstrap.ts` composes exactly one:

- project-owned History API router;
- persistent App Shell;
- in-memory `AppSessionStore`;
- lightweight `PlatformTutorHost`;
- route/module registry;
- scroll/history lifecycle service;
- minimal `beforeunload` listener.

Static pages remain in `frontend/src/pages/`. The complete ODE Lab loads through the dynamic route boundary in `frontend/src/app/moduleRegistry.ts`. A generic Lab route adapter obtains or creates the opaque pure Lab session, mounts it, connects its Lab-owned Tutor binding to live Tutor session access, snapshots state on navigation, disconnects the Host before Lab disposal, and retains no hidden Lab DOM.

The platform bootstrap and static pages do not statically import ODE implementation, solvers, Chart.js, Convergence, complete Tutor runtime, ODE Tutor grounding, MathLive, or Compute Engine.

## 4. Session and meaningful-work architecture

`AppSessionStore` owns three independent categories of pure in-memory state:

- Lab sessions by module;
- Tutor sessions by module;
- route/Lab metadata.

The ODE Lab owns and supplies its current `OdeSessionState` and `LabTutorBinding`. It does not import the Store or Tutor Host. Runtime objects such as DOM nodes, Chart instances, MathLive elements, abort controllers, closures, errors, and mounted handles never enter stored state.

Meaningful-work metadata is continuously maintained. A pristine Beginner Starter, Tutor draft, panel open state, scrolling, metric selection, accordion state, and passive remount do not count as meaningful. Core ODE changes, progress beyond Method, successful output, successful Convergence analysis, and submitted user Tutor messages do. Activity timestamps update only for approved meaningful user actions.

Home reads privacy-safe Resume summaries through an injected lightweight service. A summary can contain only module, route, Lab title, Method/Data/Output step, safe method label, current/stale analysis label, and numeric activity time. Equations, input values, numerical results, point arrays, errors, and Tutor text are excluded.

Sessions and Resume cards are **current-tab memory only**. There is no localStorage, sessionStorage, IndexedDB, account, cross-tab state, or persistence. Refresh or tab/browser closure loses all sessions.

The one platform `beforeunload` handler only checks `store.hasMeaningfulWork()`, calls `preventDefault()`, and sets `returnValue` to an empty string. It performs no DOM, MathLive, mounted-Lab snapshot, cloning, reconstruction, or asynchronous work. Internal navigation never shows a custom warning because sessions are preserved.

## 5. Beginner Starter and New experiment

The public first visit to `/ode/initial-value-problems` uses the authoritative Exponential Decay preset:

- Forward Euler;
- Method step;
- `t0 = 0`, `y0 = 1`, `tEnd = 5`, `h = 0.2`;
- RHS `-y`;
- exact solution enabled with `e^(-t)`;
- no output, comparison, Convergence result, or error.

Starter/custom identity is derived from core state rather than a mutable dirty flag.

Confirmed **New experiment** uses that same builder. The user chooses whether to clear Tutor items/draft or preserve them behind a typed “New experiment started” divider; desktop open preference remains intact. The reset zeros:

- visible Lab scroll;
- the per-Lab saved scroll value;
- the namespaced current-history-entry scroll value.

It also invalidates old restoration ownership so a later remount cannot restore the prior experiment position. Cancel and Escape make no changes. Other module sessions remain isolated.

## 6. Scroll and history lifecycle

Platform-owned metadata is merged under `history.state.numericalAnalysisLab`; unrelated state fields are preserved on every push/replace.

- Each history entry has an entry ID and scroll value.
- Back/Forward restores the destination entry.
- Normal forward navigation starts at top.
- Each complete Lab has a saved Lab scroll value for route/Resume return.
- Resume navigation restores the Lab value without changing activity time.
- Focus uses `preventScroll` before the generation-guarded restore.
- Mobile Tutor scroll locking preserves and restores underlying Lab/document scroll.
- New experiment performs the approved triple reset described above.

No browser storage is involved.

## 7. Tutor ownership and security

Ownership is:

```text
Lab -> LabTutorBinding -> Platform Tutor Host
AppSessionStore -> TutorSessionAccess -> Platform Tutor Host
```

The ODE Lab creates fresh grounding from its current successful output for every message. Failed runs retain prior successful grounding. Current/stale Convergence ownership and Compare-disabled behavior are preserved. The binding contains no conversation, panel DOM, Store, or Host reference.

`PlatformTutorHost` owns placement, responsive open/close behavior, focus/scroll/inert handling, lazy-load generation, and request cancellation. The complete panel/networking runtime loads only on first open and always reads/writes through live `TutorSessionAccess`; there is no module-global conversation or stale session snapshot.

User messages are stored before requests. Disconnect, disposal, or connection replacement aborts/invalidates pending work; stale completions cannot append, render, mutate another module, or apply chart instructions. An aborted request may retain the unmatched user message but stores no request handle or transient loading state.

Tutor rendering remains controlled: user content is plain text; assistant math uses the existing non-executable renderer; arbitrary HTML is not trusted; chart instructions are schema-controlled. `/api/chat` remains server-owned, and no browser API key exists.

Ordinary successful ODE Run still clears only that module's Tutor items and draft while preserving desktop-open preference. Failed Run, closing Tutor, route navigation, and remount do not clear the conversation. New experiment uses its separate clear/preserve choice.

## 8. ODE, expression, and numerical contracts

The mountable ODE app owns Method/Data/Output rendering and runtime handles. `getSession()` returns current pure state synchronously and reuses immutable solver-result snapshots rather than recopied point arrays. Full rerender and route disposal destroy Charts, Convergence views, expression handles, delayed generation work, virtual keyboard state, and owned listeners. Disposal is idempotent.

The expression boundary remains:

```text
MathLive draft LaTeX
  -> Compute Engine raw MathJSON
  -> project-owned closed MathAst
  -> profile validation and deterministic serialization
  -> explicit finite numeric evaluator
  -> solver function parameter
```

`MathAst` is numerical authority. LaTeX and raw MathJSON are adapter/display data. Production user expressions use neither `eval` nor `new Function`. Solvers accept numeric closures and do not import MathLive, MathJSON, LaTeX, DOM, or Tutor rendering.

Implemented methods and all fixed-grid, coefficient, Newton, diagnostic, exact-solution, failed-run ownership, comparison, and Convergence rules are unchanged. See `docs/contracts/NUMERICAL_CONTRACTS.md`; Architecture v1 did not modify those contracts because no numerical behavior changed.

## 9. Lazy-loading and final bundle evidence

The final root-base manifest records the entry with dynamic imports to the ODE route and Tutor panel. Local browser asset inventory observed:

- Home: entry JS and platform CSS only (plus external font CSS/favicon);
- ODE navigation: ODE JS/CSS plus the shared ODE/Convergence chunk;
- Tutor open: Tutor JS/CSS;
- entry to Data/math editing: editable/Compute Engine JS/CSS, MathLive JS/CSS, and required fonts.

| Artifact | Raw bytes | Gzip bytes |
|---|---:|---:|
| Initial entry JS | 38,606 | 12,087 |
| Platform CSS | 8,256 | 1,935 |
| ODE route JS | 241,359 | 80,152 |
| ODE route CSS | 11,607 | 3,099 |
| Shared ODE/Convergence/grounding JS | 60,347 | 18,055 |
| Tutor JS | 11,490 | 4,384 |
| Tutor CSS | 2,821 | 930 |
| MathLive JS | 825,514 | 226,675 |
| Editable/Compute Engine JS | 1,144,184 | 306,587 |
| Editable math CSS | 1,756 | 675 |
| MathLive font CSS | 8,027 | 4,230 |
| MathLive static CSS | 18,262 | 7,087 |
| 19 MathLive font files | 256,168 | 256,633 |

The shared `convergenceStudyState` chunk is imported by the ODE route, Tutor panel, and editable field chunk. It contains common numerical/method, expression, read-only math, and Convergence/grounding code. It is requested on ODE navigation, never by initial Home. Tutor open reuses it; its MathLive edge remains dynamic. No measured boundary defect justified `manualChunks`.

For comparison, the pre-platform application entry was approximately 298,639 raw / 96,575 gzip; the Phase 4B entry was approximately 29,322 / 9,360. The final entry is 38,606 / 12,087 after the completed session, Resume, scroll, reset, and release contracts. These are measurements, not claims about network transfer under every hosting/cache configuration.

## 10. Deployment contract

`vite.config.ts` uses `base: "/"` and retains the `/api` development proxy. Generated `index.html`, CSS font URLs, and nested route assets are root-origin safe.

`vercel.json` retains the Vite build/output/framework settings and adds one rewrite from `/(.*)` to `/index.html`. The intended Vercel contract relies on filesystem and function routes resolving before the fallback:

- `/api/chat` reaches `api/chat.ts`;
- `/assets/*` and fonts remain static files;
- known/unknown non-file page paths reach the client router;
- unknown routes render in-shell Not Found without redirecting to `/`.

Contract tests prove the configuration and generated output structurally. The
Numerical T-Lab Preview and Production deployments subsequently proved direct
nested refresh, API/static precedence, unknown-route handling, absence of
redirect/rewrite loops, runtime chunk timing, and console health. Production
raw sampling confirmed API JSON and JavaScript, CSS, and font content types.

## 11. Platform implementation commits

| Commit | Purpose |
|---|---|
| `9a7c5334b0bce5d0d98949ba32ab3f0ab8f8bd6c` | Clarify Platform Shell ownership |
| `dc8dc08f5eb823b02062e064a18f16101d25f834` | Record implementation plan |
| `e8f03f5e86da843418ff489bd273521ab2cfd865` | Router, static shell, and semantic tokens |
| `525201d027296b05157685c3528d620b0e1c9763` | Platform and ODE pure session models |
| `97714594f661d39cd4651a7e76058c09b46a299c` | Mountable Initial Value Problems route |
| `cb80afcbe77e757f2940487015cb8c77f67fa048` | Shared Tutor Host |
| `20ee014c487a63febbebaf781cf4b90e96b7aab0` | Atomic public platform entry switch |
| `865f42bd4b19b85f36e3062b536e20d5de6bf3c3` | Resume and meaningful work |
| `53eba14eaffb2eb083e7c9a523ee21872f120c6f` | Scroll and reset lifecycle |
| `4b236ffa67fd7a4f75abad2afdd0153cd98ead06` | Root-base Vite and Vercel SPA deployment contracts |
| `2232595cbea57504a9ba2c3e1c949e3d621bd347` | README, handoff, design implementation record, and final review |
| `0390c941ae44834b9fc162284b9096968011c1d2` | Keep the Platform Home title inline at desktop widths |

## 12. Known limitations and contributor rules

Known limitations:

- Sessions are memory-only.
- ODE support remains scalar and fixed-step.
- Convergence is synchronous and limited to eligible first-order single-method output with an exact solution.
- Tutor is unavailable for Compare output.
- Deferred MathLive and editable/Compute Engine chunks remain large.
- Linear Algebra and PDE are not runnable Labs.
- The Content-Agnostic Interactive Glossary Framework's four planned phases
  are complete and locally accepted after repeated independent final review.
  Its generic production registry remains empty and the Playground remains
  excluded from production. The local E2 build composes the accepted registry
  only behind one complete-IVP route binding; the deployed Production baseline
  remains unchanged because nothing was pushed or deployed.
- The private-source-reviewed project-language foundation is approved as
  Version 1 after all nine maintainer decisions were recorded. The Glossary
  catalog and project copy audit are reconciled planning documents, and the
  A–F implementation plan is complete. The four ready Group A
  Platform/overview copy records and Groups B through D are accepted;
  `COPY-003` remains held. The maintainer has accepted the pre-Glossary
  language repair commit and Tutor intent-matching repair commit as
  prerequisite state.
  Group E0 design and content governance is complete and maintainer-approved,
  covering ten revised Wave 1 term cards, ten exact annotation records, and
  eighteen Option A decisions. E1 stopped incomplete before source/test work
  at the confirmed schema mismatch. The Option 2 rich-model design, plan, and
  generic implementation are accepted; the fresh E1 restart is accepted and
  inert at `08b80522283438a233974456a026a6dbc2a96746`. The E2 runtime contract
  is complete and locally implemented through one complete-IVP route-instance
  binding and ten annotations. E2 and the independent E3 review are accepted.
  The first F2 review found two P1 and one P2 blocking findings, and its
  correction remains closed. The fresh F2 review found two additional P1
  findings; both are locally corrected, along with one adjacent P3 `/ode`
  wording drift. The final F2 review's Compare count and governance blockers
  are also locally corrected. All seven known F2 blockers remain closed. The
  final independent F2 review passed with zero P0/P1/P2 findings and is
  pending maintainer acceptance of the F2 review commit.
  `COPY-041`, `COPY-042`, `F2-GLOSSARY-VOICE-001`,
  `BASELINE-EXT-FONT-001`, and `F2-EVIDENCE-001` remain nonblocking open
  items.

Contributor rules:

- Preserve UI/adapters -> project AST/validation/evaluator -> numeric closures -> solvers.
- Do not reorder, sort, flatten, fold, or symbolically simplify AST arithmetic; grouping and child order can affect numerical behavior.
- Do not restore dynamic code execution as compatibility.
- Keep Lab, Tutor, Store, Host, and Router ownership directions intact.
- Keep Home/static routes outside ODE, Tutor, MathLive, and Compute Engine runtime graphs.
- Preserve namespaced history state and unrelated fields.
- Keep `beforeunload` minimal and synchronous.
- Run `npm run verify` after changes and add focused tests first.

*Historical Glossary snapshot (last updated 2026-07-30; superseded for current
milestone status by the 2026-08-10 Linear Systems checkpoint above). Project
Identity Migration and prior Production
verification remain complete. The Glossary framework is locally accepted as
complete after all three historical blocked-review findings were repaired and
closed by repeated independent final review. No push, Preview deployment, or
Production deployment was authorized or performed for the local Glossary
work.
The generic production registry still contains no Glossary entries or eager
importer, and the deployed Production baseline remains unchanged. The local
E2 build now supplies one route-owned complete-IVP binding and ten explicit
annotations while `/ode` and static pages remain plain. The Playground remains
excluded from production. All nine project-language
decisions are recorded and the terminology, notation, and teaching-voice
standards are approved as Version 1. The catalog and copy audit are reconciled;
Groups A through D are accepted, and the maintainer has accepted both the
pre-Glossary language repair commit and Tutor intent-matching repair commit as
prerequisite state. `COPY-003` plus `src/pages/homePage.ts` remain review-only
and unchanged. Group E0 design and content governance is complete and
maintainer-approved for ten revised Wave 1 terms, ten annotation records, and
eighteen Option A decisions. The historical E1 schema stop was resolved by
the accepted Option 2 rich-model commit
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`. Fresh E1 is locally implemented
and inert with two Core entries, eight ODE entries, two context-only
overrides, and ten composed cards, and is accepted at
`08b80522283438a233974456a026a6dbc2a96746`. The E2 runtime contract is
complete and locally implemented. E2 is accepted for entry into E3. The exact
committed E1+E2 state passed independent E3 review with zero P0/P1/P2 findings
and no product-source change, and E3 is accepted. The first F2 review found two
P1 and one P2 blocking findings, and its accepted correction remains closed.
The fresh F2 review found two additional P1 blockers; both are locally
corrected, with the adjacent `/ode` wording drift normalized in the same
sentence. The final review's Compare count and governance blockers are also
locally corrected. All seven known F2 blockers are closed, but F2 remains
unpassed. The next gate is maintainer acceptance of the final count and
governance correction commit followed by separate authorization of one final
independent F2 rerun. `COPY-041`, `COPY-042`,
`F2-GLOSSARY-VOICE-001`, `BASELINE-EXT-FONT-001`, and
`F2-EVIDENCE-001` remain nonblocking open items. Push, Preview, and
Production remain unauthorized and unperformed.*
