# Cross-Lab Presentation System v1 Design

**Status:** **FROZEN** at `5ee063bf5d33d872305c46d495a84f4e95e128c5`
(tree `1fd08e3d2e9c641f3e6fc148606c33484ea320a2`). Phases 0 through 7 are
complete and Maintainer-accepted. The final Phase 7 audit returned **PASS WITH
P3 CARRY-FORWARD — CROSS-LAB PRESENTATION SYSTEM V1 READY TO FREEZE** with
`P0 = 0`, `P1 = 0`, `P2 = 0`, and `P3 = 2`; `PHASE7-P3-01` and
`PHASE7-P3-02` are closed by the authorized release closeout.

**Date:** 2026-08-12

**Milestone:** Cross-Lab Presentation Sync

**Starting authority:** Linear Systems Teaching v2 maintainer-accepted at `484fc9153de33be7949e82b29386c94fe63d19c8` (tree `509d245adb745d272e2a5c8185fb678b6e15009d`)

**Next gate:** Production release closeout and Production verification from the exact reviewed release commit

## 1. Decision summary

Numerical T Lab should adopt one small, project-owned presentation system for
complete Labs and module overview pages. The system is presentation
architecture, not a feature redesign. It standardizes the shell, workflow,
stage roles, context, result, teaching, evidence, walkthrough, analysis, and
overview hierarchy while leaving each domain responsible for its mathematics,
state, lifecycle, numerical results, and specialized visualization.

The selected system has exactly ten top-level primitives:

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

`LabHeader` is a required structural part exported with `LabShell`, not an
independent top-level primitive. `MethodTeaching` is a governed composition of
`TeachingBlock`. `AdvancedDetails`, `StatusMarker`, `NumericalTable`, and
`ActionGroup` are supporting elements used by the selected primitives. This
keeps the shared set small and avoids inventing components for every card.

The implementation should use vanilla TypeScript DOM helpers and semantic CSS
classes. It must not introduce a framework, styling dependency, or global
monolithic stylesheet.

## 2. Audit basis and evidence boundary

This design is based on direct source inspection plus a fresh current-run
browser audit. Screenshots were stored outside the repository and are not part
of the product or commit. The audit covered:

- `/`, `/about`, `/ode`, `/ode/initial-value-problems`, `/linear-algebra`,
  `/linear-algebra/linear-systems`, and `/pde`;
- paired ODE and Linear Systems Method, Data, Output, and Analysis surfaces;
- ODE single-method Output, Compare, Convergence, Glossary, and Tutor layouts;
- Linear Systems Teaching v2, successful and stale results, row-swap evidence,
  computation walkthrough, row arithmetic, Diagnostics, advanced safeguards,
  controlled pivot failure, and New experiment dialog;
- Light and Dark themes at 1440 x 900 and 390 x 844, plus 320-pixel stress;
- semantic DOM snapshots, current-step states, disclosures, status/alert
  ownership, mathematical accessible owners, page overflow, and console state.

The browser run found no page-level horizontal overflow at 390 or 320 pixels
and no warning/error console records. Local contained scrolling remains in use
for wide workflow and mathematical evidence. This is browser and DOM evidence,
not a claim of screen-reader, typography-engine, or every-browser validation.

Representative external evidence files are:

- `05-ode-method-desktop-light.png` and
  `13-linear-systems-method-desktop-light.png`;
- `06-ode-data-desktop-light.png` and
  `14-linear-systems-data-desktop-light.png`;
- `08-ode-output-desktop-light.png` and
  `15-linear-systems-output-desktop-light.png`;
- `09-ode-convergence-desktop-light.png` and
  `18-linear-systems-diagnostics-desktop-light.png`;
- `02-ode-overview-desktop-light.png` and
  `03-linear-algebra-overview-desktop-light.png`;
- `24-linear-systems-output-mobile-dark.png`,
  `25-linear-systems-computation-320-dark.png`,
  `26-ode-mobile-dark.png`, and `27-ode-compare-mobile-dark.png`.

## 3. Current presentation assessment

### 3.1 ODE visual language

ODE has the stronger exploratory laboratory language. It exposes a broad method
catalog, plain-language method summaries, presets with observations and risk
notes, editable mathematical input, exact-solution support, charts, Compare,
and an unusually complete Convergence experiment. Stage accent colors already
distinguish Method, Data, Output, and Convergence/Analysis. Tutor and Glossary
surfaces demonstrate that the Lab can coexist with platform-owned teaching
tools.

Its weaknesses are structural. The Lab reimplements shell, header, controls,
panels, cards, buttons, forms, disclosures, tables, and spacing inside
`odeApp.ts` and `odeApp.css`. Its three-stage progress display is visually
clear but non-interactive and does not expose the current step with
`aria-current`. The large header, starter explanation, workflow note, and
progress row consume substantial vertical space before Method content. Output
has good data and chart evidence, but the primary answer, problem context,
method teaching, and evidence levels do not form as explicit a hierarchy as
Linear Systems Teaching v2.

### 3.2 Linear Systems visual language

Linear Systems has the stronger teaching and evidence hierarchy. Teaching v2
separates universal domain teaching from the selected GEPP method profile,
uses native MathML as the mathematical owner, re-establishes successful-result
context in Output and Diagnostics, pairs the actual problem with the computed
solution, presents trace-owned transformations, leads Diagnostics with purpose,
and subordinates safeguards under advanced disclosure. Its four-step workflow
uses native buttons, disabled unavailable steps, and `aria-current="step"`.

Its weaknesses are mostly presentation-system isolation. It separately
reimplements the Lab shell, workflow, controls, panels, status markers,
disclosures, tables, and responsive rules in `linearSystemsApp.ts` and
`linearSystems.css`. Dense Teaching v2 and walkthrough surfaces can read as a
long stack of equally weighted cards. The mobile workflow relies on a local
horizontal scroll rail and can show only part of the active step at once. It
does not have an ODE-like visual plot, but no plot should be invented for
symmetry: matrices, transformations, factorization, and residuals are its
correct domain evidence.

### 3.3 Cross-Lab generation gap

The two Labs share product intent but look like adjacent generations:

- different header proportions, eyebrow usage, lede density, and identity
  placement;
- three passive ODE progress pills versus four interactive Linear Systems
  workflow controls;
- different panel geometry, card nesting, border strength, radii, shadows,
  buttons, forms, tables, status treatments, and disclosure styling;
- ODE emphasizes exploration and plotting while Linear Systems emphasizes
  teaching, context, trace, and diagnostic reasoning;
- module overview status is inside the ODE Lab card but outside the Linear
  Algebra and PDE cards;
- matching concepts are implemented by duplicated CSS rather than shared
  semantic primitives.

The system should make the product family recognizable without forcing the
domains into identical content or visualization.

## 4. Best of both

### 4.1 Keep from ODE

- Broad method discovery and concise method-card summaries.
- Preset guidance that tells learners what to observe and what may go wrong.
- Editable textbook-style math with exact-solution support.
- Chart-first time-series evidence with accessible non-chart tables.
- Compare as an explicit shared-problem experiment.
- Convergence as a real Analysis surface with setup, preview, consistency
  check, interpretation, error table, plot, and layered teaching.
- Existing stage-role color vocabulary for Method, Data, Output, and Analysis.
- Platform-owned Tutor and Glossary surfaces remaining outside Lab state.

### 4.2 Keep from Linear Systems

- Interactive workflow navigation with native buttons, availability rules, and
  `aria-current`.
- Universal problem teaching separated from selected-method teaching.
- Successful-snapshot ownership for Output and Diagnostics, including stale
  result clarity.
- A strong primary result pairing the solved problem with the computed answer.
- Native MathML and one controlled accessible owner per mathematical object.
- Trace-owned computation walkthrough with before/operation/after corridors.
- Residual-led Analysis that teaches purpose before arithmetic.
- Advanced engineering safeguards kept subordinate and explicitly qualified.
- Meaning-centered prose, visual mathematics, and accessible speech treated as
  three distinct channels.

### 4.3 Replace in both

- Replace separate Lab shells and headers with one responsive `LabShell` and
  required `LabHeader` pattern.
- Replace divergent progress/workflow geometry with one native, state-aware
  `WorkflowNavigation` contract.
- Replace ad hoc top borders and panel wrappers with `StageSection` roles.
- Replace loosely assembled Output summaries with explicit `ProblemContext`
  and `PrimaryResult` layers.
- Replace one-off teaching and evidence card hierarchies with shared roles that
  permit domain-specific contents.
- Replace duplicated buttons, controls, disclosures, tables, status markers,
  spacing, and focus styles with one semantic presentation language.
- Replace overview-card status placement drift with `ModuleOverview`.
- Replace Analysis-specific framing differences with a shared
  `AnalysisSurface`, while preserving Convergence and Diagnostics semantics.

## 5. Presentation principles

1. **Mathematics first, decoration last.** Visual hierarchy must clarify the
   problem, method, result, evidence, and limits.
2. **Shared roles, domain-owned content.** The system owns composition and
   tokens; Labs own mathematical meaning and state.
3. **One dominant answer per successful attempt.** Supporting factorization,
   trace, chart, or table evidence must not compete with the primary result.
4. **Teach before expanding detail.** Universal context and method meaning
   precede mechanical arithmetic and safeguards.
5. **Stage identity is semantic.** Method, Data, Output, and Analysis roles are
   expressed by labels, structure, and restrained color—not color alone.
6. **Successful evidence is immutable.** Presentation reads the existing
   successful snapshot/result and never reconstructs numerical authority.
7. **Native interaction stays native.** Buttons, links, forms, tables,
   `details`/`summary`, dialogs, headings, and live regions keep their semantics.
8. **Mobile is a composition mode.** It stacks, contains, and prioritizes the
   same information rather than deleting mathematical evidence.
9. **Lazy ownership is product behavior.** Sharing presentation code must not
   make Home or static routes import complete-Lab runtime.
10. **Motion is optional explanation.** Static evidence remains complete and
    authoritative; reduced motion and interruption are first-class.

## 6. Numerical T Lab visual identity

The product should remain recognizable without its logo through seven traits:

1. a thin stage-role rail and matching restrained stage accent;
2. compact technical eyebrows paired with clear, human-scale headings;
3. mathematical typography with one deliberate visual owner per formula;
4. a primary-answer frame that pairs problem context with the computed answer;
5. low-glare layered evidence surfaces with limited nesting depth;
6. structured numerical tables and computation transformation corridors; and
7. text-first status markers plus a consistent high-contrast focus ring.

These traits are functional. No decorative illustrations, ornamental motion,
or domain-themed skins are required.

## 7. Stage-role system

The shared roles are:

| Role | Meaning | Existing ODE mapping | Existing Linear Systems mapping | Future PDE mapping |
|---|---|---|---|---|
| Method | What problem family and numerical method mean | Method catalog and selected method | Universal system teaching and GEPP profile | PDE family, discretization method, stencil family |
| Data | What the learner supplies or selects | interval, step size, initial value, equation, exact solution | dimension, preset, matrix `A`, vector `b` | domain, grid, coefficients, initial/boundary conditions |
| Output | The primary successful numerical answer | single/Compare approximation, chart, stored points | problem, computed solution, factorization evidence | numerical field/solution and primary derived quantity |
| Analysis | Why the answer should be trusted or how it behaves | Convergence Study and error evidence | residual Diagnostics and qualified reference comparison | error, stability, conservation, or diagnostic evidence |

Each role uses a visible text label, a `data-stage-role` attribute, a thin
accent, and tokenized surface/foreground values. The semantic heading order and
workflow state—not color—carry meaning.

## 8. Selected primitive designs

### 8.1 `LabShell`

**Responsibility:** supply complete-Lab width, vertical rhythm, header/action
placement, workflow slot, stage-content slot, and platform-host clearance.

**Content slots:** breadcrumb, `LabHeader`, workflow, stage content, optional
platform-host anchors. `LabHeader` contains optional technical eyebrow, one
`h1`, concise lede, identity/status line, and primary/secondary actions.

**Visual tokens:** Lab max width; compact/wide gutters; header gap; title scale;
action gap; section rhythm; surface and border tokens.

**Accessibility:** exactly one route-focus `h1`; breadcrumb remains a named
navigation landmark; actions are real buttons/links; header ordering follows
DOM reading order; no hidden duplicate title.

**Mobile:** actions stack after title and before lede only when required by
width; long ledes wrap; no absolute positioning; platform Tutor/Glossary Hosts
retain their existing modal/sheet ownership.

**Current owners:** ODE `.shell` and header markup in `odeApp.ts`/
`odeApp.css`; Linear Systems `.linear-systems-shell` and header construction in
`linearSystemsApp.ts`/`linearSystems.css`.

**Future PDE:** accepts a PDE-specific eyebrow, statement, identity, and
actions without knowing domains, grids, or boundary conditions.

**Complexity/risk:** medium/high. Header DOM is tied to route focus, New
experiment, Tutor placement, scroll restoration, and responsive layout.

**Classification:** Lab-shared lazy. `LabHeader` inherits this classification.

### 8.2 `WorkflowNavigation`

**Responsibility:** render ordered Lab stages and communicate current,
available, completed, and unavailable states.

**Content slots:** ordered step descriptors, current key, activation callback,
and optional short stage hint outside the control label.

**Visual tokens:** rail gap, number marker, active/available/disabled surface,
stage accent, focus ring, contained-scroll fade.

**Accessibility:** named `nav` with ordered list; each available step is a
native button; current step uses `aria-current="step"`; unavailable steps are
disabled; activation never invents output; keyboard order matches visual order.

**Mobile:** use one locally contained horizontal rail, programmatically keep
the current item fully visible, and preserve page-level containment. Do not
shrink labels below a readable target or replace buttons with unlabelled dots.

**Current owners:** ODE progress markup in `odeApp.ts` and progress CSS in
`odeApp.css`; Linear Systems workflow builder in `linearSystemsApp.ts` and
`.ls-workflow-*` rules in `linearSystems.css`.

**Future PDE:** can expose Method, Data, Output, Analysis even when individual
PDE implementations add domain-specific stage names later through approved
configuration.

**Complexity/risk:** high. ODE currently treats stages as passive display;
migration must preserve its session transitions and validate which steps are
safe to activate.

**Classification:** Lab-shared lazy.

### 8.3 `StageSection`

**Responsibility:** provide one top-level visual and semantic frame for the
active Method, Data, Output, or Analysis role.

**Content slots:** optional stage eyebrow, heading, intro, actions, status, and
body.

**Visual tokens:** stage accent/soft surface, top rail, section radius, border,
shadow, internal and external rhythm.

**Accessibility:** semantic `section` labelled by its heading; role is always
written in text/DOM; alerts and statuses remain owned by their existing live
regions rather than the section wrapper.

**Mobile:** one column, reduced but not collapsed padding, full-width action
group when needed, no viewport-height assumptions.

**Current owners:** ODE `.workflow-panel` and `.workflow-stage-*`; Linear
Systems `.ls-workflow-panel` and `.ls-stage-*`.

**Future PDE:** wraps any PDE stage without interpreting its content.

**Complexity/risk:** low/medium. The primary risk is excessive nested surfaces
during incremental migration.

**Classification:** Lab-shared lazy.

### 8.4 `ProblemContext`

**Responsibility:** show the authoritative problem that the current result or
analysis belongs to.

**Content slots:** problem heading, mathematical statement, compact parameters,
provenance/identity, and stale-context note.

**Visual tokens:** context soft surface, math inset, metadata grid, stale
border/status treatment.

**Accessibility:** one accessible owner per mathematical object; provenance and
stale language are text; no current draft is paired with a prior result.

**Mobile:** matrix/formula areas use local contained overflow only where
reflow is mathematically unsafe; metadata stacks before horizontal scrolling.

**Current owners:** ODE output equation/stat summary and Convergence exact-
solution setup; Linear Systems successful-result `originalA`, `originalB`, and
Diagnostics context in `linearSystemsApp.ts` plus MathML helpers.

**Future PDE:** PDE statement, domain, boundary/initial conditions, grid, and
parameter summary, all supplied by the PDE Lab.

**Complexity/risk:** medium. It must accept rendered nodes without cloning or
recomputing domain state.

**Classification:** Lab-shared lazy.

### 8.5 `TeachingBlock`

**Responsibility:** establish repeatable teaching hierarchy for a concept,
method, interpretation, misconception, or limitation.

**Content slots:** eyebrow, heading, lead, mathematical objects, definition
list, steps, callout, examples, and optional subordinate disclosures.

**Visual tokens:** teaching surface, readable measure, compact card grid,
formula gap, note/caution accents, heading scale.

**Accessibility:** authored heading order; real lists/definition lists;
mathematical owners retain their renderer contract; visible prose, visual math,
and accessible speech remain distinct.

**Mobile:** teaching grids stack; examples remain adjacent in DOM; no
side-by-side dependency for understanding.

**Current owners:** ODE method cards, Method details, Convergence teaching
disclosures, and preset guidance; Linear Systems `linearSystemsTeaching.ts`,
Method teaching, and Diagnostics explanation.

**MethodTeaching composition:** `TeachingBlock` instances are ordered as
universal problem teaching, method landscape, selected-method profile, and
post-solve interpretation. A domain may omit a layer but may not present a
planned method as runnable.

**Future PDE:** teaches PDE statement, grid/stencil meaning, assumptions,
boundary treatment, and selected method without hard-coded ODE/LA language.

**Complexity/risk:** medium/high. Migration must not rewrite accepted teaching
copy or move method-profile authority into shared code.

**Classification:** Lab-shared lazy.

### 8.6 `PrimaryResult`

**Responsibility:** make the main successful answer visually dominant and
pair it with enough problem context to be understood in place.

**Content slots:** result eyebrow/title, `ProblemContext` reference or compact
problem slot, primary answer, key metrics, stale marker, and optional comparison
answer.

**Visual tokens:** output accent, answer surface, problem/answer grid, large
math/value scale, metric cells, stale overlay border.

**Accessibility:** result heading receives focus after a successful Run under
existing Lab behavior; answer labels are explicit; comparison labels name both
methods; stale status precedes result content and is not color-only.

**Mobile:** problem and answer stack; metric grid becomes one column; large
math is locally contained; source order is problem then answer then metrics.

**Current owners:** ODE single/Compare result summaries and chart intro;
Linear Systems Teaching v2 `Problem and computed solution` surface.

**Future PDE:** pairs the discrete problem/domain summary with the primary
numerical solution view or scalar result.

**Complexity/risk:** high. It touches successful-run focus, Compare, stale
authority, charts, and mathematical layout but must not change result data.

**Classification:** Lab-shared lazy.

### 8.7 `EvidenceBlock`

**Responsibility:** frame supporting numerical evidence at one of three
levels: summary, standard evidence, or advanced evidence.

**Content slots:** heading, lead, formulas, metrics, chart, `NumericalTable`,
status, and optional `AdvancedDetails`.

**Visual tokens:** evidence surface levels, border strength, table header,
monospace numeric cells, evidence gap, local overflow affordance.

**Accessibility:** regions are labelled; tables use caption, row/column headers,
and correct scope; charts require accessible names and adjacent textual/table
evidence; a status does not become a heading unless it starts a real section.

**Mobile:** evidence stacks; tables and wide matrices scroll locally with a
visible containment cue; essential labels stay pinned in the DOM, not through
fragile CSS-only duplication.

**Current owners:** ODE stat cards, method details, chart, values table, and
Convergence evidence; Linear Systems factorization, pivot table, residual and
reference evidence.

**Future PDE:** stencil, grid, error, stability, residual, or conservation
evidence without prescribing a chart.

**Complexity/risk:** medium. It can become a generic-card dumping ground unless
the three evidence levels and nesting limit are enforced.

**Classification:** Lab-shared lazy.

### 8.8 `ComputationWalkthroughShell`

**Responsibility:** organize an ordered, static-first explanation of how a
successful or controlled failed attempt was computed.

**Content slots:** disclosure trigger, authority note, ordered phases, step
cards, before/operation/after corridor, arithmetic details, failure boundary,
and completion evidence.

**Visual tokens:** computation accent, step rail, source/operation/target
markers, corridor gap, contained math surface, detail table.

**Accessibility:** outer trigger uses native disclosure semantics; ordered
headings preserve sequence; static evidence is complete without motion; every
formula/matrix has one accessible owner; controls never claim trace steps that
do not exist.

**Mobile:** corridors stack source, operation, and target in that order;
matrices use local containment only when needed; disclosures do not create
nested focus traps.

**Current owners:** Linear Systems `computationWalkthrough.ts`,
`linearSystemsMath.ts`, `linearSystems.css`, and immutable Computation Trace;
ODE has no equivalent end-to-end walkthrough and is not required to fabricate
one.

**Future PDE:** can organize grid construction, stencil application, time step,
or linear solve evidence only when a future PDE trace supplies it.

**Complexity/risk:** high. Linear Systems Teaching v2 and trace boundaries are
accepted contracts; the primitive may compose existing DOM but never reinterpret
or synthesize trace data.

**Classification:** Lab-shared lazy.

### 8.9 `AnalysisSurface`

**Responsibility:** give every Lab a recognizable place for post-result
reasoning while allowing domain-specific experiments.

**Content slots:** analysis question, setup, controls, consistency/safeguard
status, conclusion, evidence blocks, interpretation teaching, and advanced
details.

**Visual tokens:** analysis accent, setup soft surface, conclusion emphasis,
step cards, control grid, analysis chart/table surface.

**Accessibility:** labelled section; controls use native fieldsets/labels;
conclusions are text and not color-only; asynchronous status retains existing
live-region ownership; disclosures remain keyboard operable.

**Mobile:** setup controls stack; chart/table evidence is locally contained;
conclusion appears before the full evidence table where domain meaning allows.

**Current owners:** ODE `convergenceStudyView.ts`, Convergence teaching, chart,
and `odeApp.css`; Linear Systems Diagnostics rendering in
`linearSystemsApp.ts` and `linearSystems.css`.

**Future PDE:** stability, error, residual, conservation, or refinement study
with PDE-owned controls and evidence.

**Complexity/risk:** high. Convergence is an experiment with its own run state;
Diagnostics is a view of stored evidence. Shared presentation must not imply a
shared lifecycle.

**Classification:** Lab-shared lazy.

### 8.10 `ModuleOverview`

**Responsibility:** give implemented and planned domains one consistent static
overview hierarchy.

**Content slots:** page header, status, summary, Lab/roadmap cards, capabilities,
limitations, and actions.

**Visual tokens:** platform page width, overview card, status placement, action
row, implemented/planned tone.

**Accessibility:** `h1` route focus; semantic links/buttons; status is written
text; planned cards never expose fake runnable controls; exact route and parent
navigation states remain platform-owned.

**Mobile:** cards and actions stack; status remains next to the item it
qualifies; no horizontal scroll.

**Current owners:** `odeOverviewPage.ts`, `linearAlgebraOverviewPage.ts`,
`pdeOverviewPage.ts`, `pageContracts.ts`, and entry-loaded `platform.css`.

**Future PDE:** already supports a planned roadmap state and later an
implemented Lab card without changing complete-Lab ownership.

**Complexity/risk:** low/medium. It is entry-safe, but must remain free of Lab,
solver, chart, Tutor, Glossary, MathLive, and Compute Engine imports.

**Classification:** entry-safe.

## 9. Supporting presentation elements

### 9.1 `AdvancedDetails`

Use native `details`/`summary` for subordinate arithmetic, pivot candidates,
safeguards, assumptions, limitations, and implementation detail. A summary is
a compact text action with shared focus/expanded styling. Advanced content may
contain `EvidenceBlock` level 3, but a top-level result or error must never be
hidden here.

### 9.2 `StatusMarker`

Use a short text label or status bar with semantic tones: neutral, ready,
current, stale, caution, failure, planned. Tone changes border/icon/surface and
text; color is never the sole signal. Live behavior is opt-in and remains with
the Lab's existing status/alert owner. Identity labels such as `Custom · 3 × 3
· result stale` are not automatically live regions.

### 9.3 `NumericalTable`

Use a real table with caption, headers, stable numeric alignment, tabular
figures or the existing numeric face, compact row rhythm, and contained overflow.
Scientific notation remains governed by the Mathematical Presentation contract.
Cards are not a replacement for tabular relationships on mobile.

### 9.4 `ActionGroup`

Use a DOM-order action row with primary, secondary, quiet, and danger roles.
One group has at most one primary action. On mobile, actions wrap or stack to
full width in source order. `New experiment`, Run, next-stage, edit/back, and
open-tool actions keep their behavior and existing owners.

### 9.5 Form-control and disclosure language

All shared controls use the same label rhythm, help/error association, minimum
target, border, focus ring, disabled treatment, and validation status. Domain
editors may retain specialized layouts and custom elements. Native labels,
selects, inputs, buttons, tables, and disclosures remain native; no visual
primitive changes their value or validation logic.

## 10. Chart integration contract

Charts remain domain-local renderers inside `EvidenceBlock` or
`AnalysisSurface` slots. The shared system owns only frame, heading, legend
spacing, loading/failure placement, and responsive containment. It must not
import Chart.js, transform chart data, choose numerical scales, or create a
chart merely for visual symmetry.

Every chart must have:

- a visible heading and accessible name;
- domain-owned data and lifecycle/disposal;
- readable Light/Dark tokens supplied through the existing theme contract;
- adjacent textual interpretation and, where the evidence is tabular, an
  accessible numerical table;
- reduced-motion behavior that does not withhold the final state.

ODE retains Chart.js behind its complete-Lab lazy boundary. Linear Systems is
not required to add a chart. A future PDE Lab may supply its own renderer.

## 11. Typography, spacing, and surface hierarchy

### 11.1 Typography

- Keep the existing project font stack and mathematical renderers.
- Define one fluid Lab `h1`, one stage `h2`, one section `h3`, one compact
  technical eyebrow, one body scale, one small metadata scale, and one numeric
  value style.
- Limit all-uppercase text to short eyebrows/table headers with adequate letter
  spacing; never use it for explanatory prose.
- Keep prose to a readable measure even when the surrounding evidence surface
  is wide.
- Use the existing Mathematical Presentation contract for approximation,
  scientific notation, MathML, readonly math, and accessible ownership.

### 11.2 Spacing and rhythm

Map new semantic tokens to the existing spacing scale rather than adding a
second numeric scale:

- `--lab-space-inline`
- `--lab-space-header`
- `--lab-space-stage`
- `--lab-space-section`
- `--lab-space-block`
- `--lab-space-compact`

External stage rhythm is larger than internal section rhythm; internal section
rhythm is larger than label/control rhythm. Mobile reduces these by token map,
not scattered overrides.

### 11.3 Surfaces and cards

Use at most four levels:

1. page background;
2. `StageSection` shell;
3. primary/teaching/analysis/evidence section;
4. locally necessary metric, math, or transformation inset.

Avoid cards inside cards beyond level 4. Border strength, soft surface, and
spacing—not additional shadows—communicate depth. The primary answer receives
the strongest Output emphasis; ordinary evidence does not.

## 12. Light/Dark token strategy

`frontend/src/app/theme.css` remains the source of shared semantic colors,
spacing, radii, focus, and motion tokens. The presentation system should add
semantic aliases rather than raw color copies:

- stage foreground/accent/soft tokens for Method, Data, Output, Analysis;
- page, stage, section, inset, and elevated surface tokens;
- quiet/strong border tokens;
- current/stale/caution/failure/planned status tokens;
- chart frame/grid/label aliases that domain charts consume;
- focus ring and disabled-state aliases.

Light and Dark values are defined together. Domain CSS may introduce
domain-specific semantic aliases, but it must not redefine shared button,
panel, table, status, or focus colors. Contrast must be verified in rendered
states; token existence alone is not evidence.

## 13. Accessibility contract

The migration must preserve or improve:

- one route-focus `h1` and a coherent heading hierarchy;
- named breadcrumb, workflow, and evidence landmarks;
- native controls and native disabled states;
- `aria-current="step"` on the active workflow button;
- visible focus using the shared focus token;
- explicit labels, descriptions, error relations, alerts, and live-region
  ownership;
- native disclosure semantics and accurate expanded state;
- one accessible owner for each visual mathematical object;
- dialogs/sheets with existing naming, focus containment, Escape, inert
  background, and connected-element focus return;
- status conveyed through wording and structure, not color alone;
- complete static evidence under reduced motion.

ODE's current passive progress semantics are a migration target: the shared
workflow must expose current state and make only actually safe stages
interactive. Linear Systems' accepted semantics are the starting reference.
Automated DOM tests remain necessary but insufficient; each phase needs
keyboard and browser review.

## 14. Mobile contract

At approximately 390 x 844 and at the 320-pixel stress width:

- there is no page-level horizontal overflow;
- header actions, result grids, teaching grids, controls, and analysis setup
  stack in DOM order;
- workflow keeps the active step fully visible within one local contained rail;
- matrices, long formulas, wide tables, and transformation corridors use local
  contained overflow only when semantic reflow is unsafe;
- primary result appears before secondary evidence;
- controls retain usable targets and do not rely on hover;
- Tutor, Glossary, and reset dialogs retain their existing mobile modal/sheet
  owner; and
- no mathematical or diagnostic evidence is omitted merely to fit the width.

## 15. Motion compatibility

Cross-Lab Presentation System v1 does not remount or redesign Motion. The
shared primitives expose stable semantic hooks—stage role, computation source,
operation, target, and change markers—compatible with the existing Visual +
Motion contract. Static DOM remains complete. A later separately authorized
Motion gate may bind to those hooks after the migrated teaching surface is
accepted.

During this milestone:

- no replay controller is mounted;
- no motion timing or easing changes;
- no trace-derived frame reconstruction;
- no animated navigation or decorative transitions;
- no deletion of accepted dormant Motion source merely for CSS cleanup.

## 16. Future PDE compatibility

The system is PDE-compatible because all shared APIs accept authored nodes and
semantic roles rather than ODE equations or Linear Algebra matrices. A future
PDE Lab can provide:

- a PDE statement plus domain/boundary conditions in `ProblemContext`;
- grid and stencil teaching in `TeachingBlock`;
- the numerical field or principal quantity in `PrimaryResult`;
- stencil/grid/error evidence in `EvidenceBlock`;
- trace-owned steps in `ComputationWalkthroughShell` if a future trace exists;
- stability/error/diagnostic work in `AnalysisSurface`.

This design does not create PDE functionality, methods, state, notation,
charts, or numerical contracts. The current PDE route remains a roadmap.

## 17. Target ownership architecture

The intended split is:

```text
frontend/src/app/
  theme.css                         shared semantic tokens, entry-safe
  platform.css                      platform shell and entry-safe page styles

frontend/src/pages/
  moduleOverview.ts                 entry-safe ModuleOverview DOM helper
  odeOverviewPage.ts                ODE overview content
  linearAlgebraOverviewPage.ts      Linear Algebra overview content
  pdeOverviewPage.ts                PDE roadmap content

frontend/src/components/lab-presentation/
  labShell.ts
  workflowNavigation.ts
  stageSection.ts
  problemContext.ts
  teachingBlock.ts
  primaryResult.ts
  evidenceBlock.ts
  computationWalkthroughShell.ts
  analysisSurface.ts
  supportingElements.ts
  labPresentation.css               shared complete-Lab presentation styles

frontend/src/labs/ode/
  odeApp.ts                         ODE composition and behavior
  odeApp.css                        ODE editor/chart/domain-only styles
  convergenceStudyView.ts           ODE Analysis content and lifecycle

frontend/src/labs/linear-algebra/
  linearSystemsApp.ts               Linear Systems composition and behavior
  linearSystemsTeaching.ts          accepted teaching authority
  computationWalkthrough.ts         accepted trace consumer
  linearSystemsMath.ts              accepted MathML composition
  linearSystems.css                 matrix/MathML/domain-only styles
```

Exact file grouping may be adjusted during implementation if focused tests
demonstrate a smaller boundary, but ownership may not move in the opposite
direction. Shared helpers receive DOM/content/configuration; they do not import
Lab sessions, solvers, catalogs, presets, Chart.js, MathLive, Compute Engine,
Tutor, Glossary, or Computation Trace.

### 17.1 Lazy classification

| Primitive | Classification | Entry rule |
|---|---|---|
| `LabShell` / `LabHeader` | Lab-shared lazy | imported only from complete-Lab route graphs |
| `WorkflowNavigation` | Lab-shared lazy | no Router import; callbacks supplied by Lab |
| `StageSection` | Lab-shared lazy | semantic presentation only |
| `ProblemContext` | Lab-shared lazy | accepts rendered nodes/data labels only |
| `TeachingBlock` / MethodTeaching composition | Lab-shared lazy | domain teaching remains domain-local |
| `PrimaryResult` | Lab-shared lazy | no result computation or session import |
| `EvidenceBlock` | Lab-shared lazy | no Chart.js or trace import |
| `ComputationWalkthroughShell` | Lab-shared lazy | trace content supplied by Linear Systems |
| `AnalysisSurface` | Lab-shared lazy | no shared analysis lifecycle |
| `ModuleOverview` | Entry-safe | no Lab/runtime/math dependency |

Supporting elements used only by complete Labs live in the Lab-shared lazy
module. The small status/action styles required by `ModuleOverview` remain in
the entry-safe page layer. The build must prove that shared Lab code is emitted
only after a complete Lab is requested; a shared name is not permission to put
it in the platform entry.

## 18. Visual-debt ledger

| ID | Priority | Current Lab/surface | Mismatch and impact | Target | Phase | Risk |
|---|---|---|---|---|---|---|
| PRESENTATION-SYNC-01 | P2 | Both Lab shells/headers | Separate widths, heading scales, lede/action geometry, and identity placement make Labs look like different products | `LabShell`/`LabHeader` | 1 | High: route focus, Host clearance, and New experiment |
| PRESENTATION-SYNC-02 | P2 | Both workflows | ODE has passive steps without `aria-current`; Linear Systems has native buttons but clips the active step in a narrow rail | `WorkflowNavigation` | 1 | High: ODE transition safety and mobile focus |
| PRESENTATION-SYNC-03 | P2 | ODE Output and Analysis | Strong numerical evidence lacks the explicit context/answer/analysis hierarchy now proven in Teaching v2 | `ProblemContext`, `PrimaryResult`, `AnalysisSurface` | 2, 3, 5 | High: Compare, Convergence, chart, stale/focus behavior |
| PRESENTATION-SYNC-04 | P2 | Both teaching/evidence stacks | Repeated cards have inconsistent importance and excessive nesting, increasing scan cost | `TeachingBlock`, `EvidenceBlock` | 2–5 | Medium: over-abstraction or content rewrite |
| PRESENTATION-SYNC-05 | P2 | Both CSS owners | Buttons, controls, panels, disclosures, tables, focus, spacing, and surfaces are duplicated with raw/local values | tokens and supporting elements | 0–4 | High: cascade and theme regressions |
| PRESENTATION-SYNC-06 | P3 | Module overviews | ODE places Available inside its Lab card while Linear Algebra/PDE place status outside, weakening status-to-item association | `ModuleOverview` | 6 | Low/medium: entry bundle and public copy |
| PRESENTATION-SYNC-07 | P2 | Both status/error/stale states | Equivalent current/stale/caution/failure signals use different geometry and density | `StatusMarker` within stage/result | 2–4 | Medium: live-region duplication |
| PRESENTATION-SYNC-08 | P2 | ODE Convergence / LS Diagnostics | Both are Analysis, but their framing, setup, conclusion, evidence order, and disclosures do not signal a shared product role | `AnalysisSurface` | 5 | High: different domain lifecycles must remain separate |

The ledger is bounded by root cause. It does not classify every local spacing or
color difference as a separate defect.

## 19. Migration requirements

### 19.1 ODE

ODE migration must preserve numerical behavior, coefficient validation,
expression editing, presets, exact solution, charts and chart data, Compare,
Convergence state/budgets/classification, Tutor, Glossary, session state,
meaningful-work detection, New experiment, focus, scroll restoration, disposal,
and all lazy boundaries. Its method catalog and Analysis content remain ODE-
owned. The migration may change markup and CSS classes only at an approved
phase boundary with behavior-focused tests.

### 19.2 Linear Systems

Linear Systems migration must preserve Teaching v2 copy and ordering, method-
profile ownership, native MathML, one accessible formula owner, Computation
Trace evidence, full transformations, residual Diagnostics, stale successful-
snapshot authority, pivot failure evidence, planned-only methods, New
experiment, focus, scroll/session lifecycle, and the paused Motion state. The
shared system may wrap accepted content but may not paraphrase, recompute, or
reclassify it.

### 19.3 Cross-cutting behavior preservation

- no solver, tolerance, budget, fingerprint, or numerical contract change;
- no session schema or runtime handle in pure state;
- failed operations keep the prior successful snapshot;
- no Router import from a Lab or shared Lab primitive;
- no Host ownership move into domain content;
- no eager import of complete-Lab, Tutor, Glossary, Chart.js, MathLive, or
  Compute Engine runtime;
- no production DEV fixture;
- no framework or dependency change.

## 20. Migration sequence

The authoritative repository-grounded sequence is specified in
`../plans/2026-08-12-cross-lab-presentation-system-v1-implementation-plan.md`.
At design level:

1. lock tokens, semantic contracts, and visual regression fixtures;
2. create shared Lab shell, header, workflow, stage, and supporting language;
3. create context, teaching, result, evidence, walkthrough, and analysis
   compositions against fixtures;
4. migrate ODE without behavior change;
5. migrate Linear Systems without Teaching v2/MathML/trace change;
6. align Convergence and Diagnostics as Analysis surfaces;
7. align module overview pages and remove only proven duplicate presentation
   rules;
8. run an independent visual/accessibility/browser/bundle audit.

Each phase stops for review. A later phase is not authorized by approval of an
earlier one.

## 21. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Shared code enters the platform entry | import shared Lab primitives only from both lazy Lab graphs; inspect manifest/static imports after every Lab phase |
| CSS consolidation changes working behavior | migrate one role at a time; retain domain classes until visual/behavior tests pass; delete duplicates only after usage search |
| ODE workflow becomes falsely navigable | define available-step rules from existing ODE state; test keyboard and output availability before enabling a button |
| Teaching v2 is diluted by generic components | pass accepted DOM/content into slots; keep teaching profile, MathML, and walkthrough renderers domain-local |
| Shared `AnalysisSurface` implies shared state | share layout only; Convergence and Diagnostics retain distinct controllers and lifecycle |
| Stale output mixes current inputs | keep `ProblemContext` fed by existing successful snapshots and add explicit stale regression tests |
| Nested generic cards increase rather than reduce noise | enforce the four-level surface limit and evidence levels; review paired screenshots after each migration |
| Mobile local scroll hides the active workflow step | focus/activate with contained `scrollIntoView`; verify 390 and 320 widths without page overflow |
| Motion hooks alter static evidence | ship hooks only; keep Motion unmounted until its separate gate |
| Visual parity causes domain sameness | standardize roles and geometry, not data, charts, formulas, teaching, or analysis lifecycle |

## 22. Non-goals

This design does not:

- change ODE or Linear Systems numerical behavior;
- change Computation Trace, MathML helpers, expression security, or sessions;
- implement PDE functionality;
- remount or redesign Motion;
- add Linear Algebra Tutor or Glossary;
- alter ODE Tutor or Glossary behavior;
- add methods, conditioning diagnostics, adaptive stepping, or new charts;
- introduce React, Vue, Svelte, Tailwind, CSS-in-JS, a UI package, or a new
  dependency;
- change Architecture v1 ownership, routes, deployment, or Production;
- promise pixel identity between domains.

## 23. Acceptance criteria

The design is ready for implementation authorization only when the maintainer
accepts:

- the ten-primitive set and supporting-element boundary;
- the best-of-both decisions and stage-role system;
- the Lab-shared lazy versus entry-safe classification;
- the target ownership architecture and no-framework constraint;
- ODE and Linear Systems behavior-preservation requirements;
- the phased plan and independent final audit gate;
- the bounded visual-debt ledger and non-goals.

No implementation, Motion, Tutor, push, or deployment begins at this design
gate.
