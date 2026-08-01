Frontend skill loaded: `frontend-design` — `C:\Users\bruce\.codex\skills\frontend-design\SKILL.md`

# Codex Frontend Visual Polish Review

## 1. Metadata

- Date: 2026-07-31
- Task: one bounded visual-polish pass
- Repository: `D:\numerical-t-lab`
- Branch: `main`
- Starting HEAD and `origin/main`: `b0f44a540d04a85a5468f99fcb8c700baa80d422`
- User-reported current Production source tree: `e48ae8b9f39eed17a54336261450bc81a7bef414`
- Evidence status: locally implemented, fully verified, and Chrome-reviewed; awaiting maintainer visual review

## 2. Authorization

The pass changes existing theme tokens, component styling, chart presentation,
one method-card state hook, direct tests, and this review/governance record.
It does not authorize or perform a push, Preview deployment, Production
deployment, dependency change, information-architecture change, or behavior
change.

## 3. Starting state

The pre-edit gate passed exactly: branch `main`; HEAD and `origin/main`
`b0f44a540d04a85a5468f99fcb8c700baa80d422`; clean worktree; expected remotes
present. No fetch, reset, stash, amend, rebase, merge, revert, cherry-pick, or
history rewrite was performed.

## 4. Frontend skill used

The dedicated `frontend-design` skill at
`C:\Users\bruce\.codex\skills\frontend-design\SKILL.md` was loaded completely
and applied. Its influence is visible in the coherent “technical daylight”
direction, one restrained signature data-ink rule, token-first palette work,
and deliberate avoidance of generic SaaS decoration.

Chrome review used the separate `chrome:control-chrome` skill at
`C:\Users\bruce\.codex\plugins\cache\openai-bundled\chrome\26.727.40816\skills\control-chrome\SKILL.md`.

## 5. Visual inventory

| Surface | Current problem | Intended visual adjustment | Source owner |
|---|---|---|---|
| Application canvas and header | Near-black canvas and heavy shell | Light cool canvas, white content surfaces, compact navy instrument rail | `src/app/theme.css`, `src/app/platform.css` |
| Platform pages | Low separation among headings, cards, and learning cycle | Stronger hierarchy, more whitespace, pale instructional band, restrained elevation | `src/app/platform.css` |
| IVP Method/Data/Output | Dense nested dark panels and weak control grouping | White panels, pale grouped regions, clearer stages, inputs, actions, statistics | `src/style.css` |
| Method selection | First Compare pick depended mainly on explanatory text | Persistent pressed semantics, thicker border, inset selection marker, tinted surface | `src/ode/odeApp.ts`, `src/style.css` |
| Editable math | Dark field interiors and hard-coded dark constants | White editable surfaces, stronger boundaries, semantic focus/error/status tokens | `src/math/ui/editableMathField.css` |
| Charts and tables | Light-on-dark labels and low-contrast grid/table treatment | Theme-resolved blue/teal/violet/amber roles, quiet grids, navy tooltip, pale tables | `src/convergenceStudyView.ts`, `src/ode/odeApp.ts`, `src/style.css` |
| Glossary | Dark popover/sheet and dense rich-card sections | White elevated card, pale header/formulas, teal contextual band, contained scrolling | `src/glossary/surface/glossarySurface.css` |
| Tutor | Dark gradient panel and inset transcript | White shared surface, soft transcript, bordered messages, clearer composer | `src/tutor/tutor.css` |
| DEV Playground | No independent theme ownership needed | Continue inheriting the shared tokens; production exclusion unchanged | existing Playground styles and route gate |

The inventory covered `index.html`, shared/theme CSS, Platform and page owners,
ODE, editable math, Glossary, Tutor, DEV Playground, chart configuration,
responsive rules, reduced-motion rules, and forced-color rules before editing.

## 6. Design direction

The chosen direction is **technical daylight**: a cool paper-like canvas,
white laboratory surfaces, dark slate type, a navy header, brighter controlled
blue actions, teal exact/reference accents, and restrained violet theory
accents. A thin blue-to-cyan-to-violet data-ink rule provides the sole shell
signature. The result remains mathematical and instrument-like without being
dark, neon, playful, glass-heavy, or overdecorated.

Protected invariants were all public routes (`/`, `/about`, `/ode`,
`/ode/initial-value-problems`, `/linear-algebra`, `/pde`), learner copy,
numerical output, chart labels, method flow, form ownership, Glossary bindings
and lifecycle, Tutor behavior, mobile modal/focus return, production DEV-route
exclusion, and route/Tutor/MathLive lazy ownership.

## 7. Theme/token changes

`src/app/theme.css` now declares a light color scheme and centralizes page,
primary/raised/inset/soft/accent surfaces; primary/secondary/tertiary text;
accent, focus, border, disabled, status, header, scrim, shadow, canvas, data-ink,
and chart roles. The existing spacing model remains, radii are modestly softer,
and the Platform content width increases from `77.5rem` to `84rem` for more
breathing room. No parallel theme system or theme toggle was introduced.

## 8. Shell and navigation

The shell uses the cool canvas gradient while the compact navy header remains
the only large dark accent. Header links have clearer hover/current separation,
the data-ink rule marks the shell boundary, route spacing is more generous,
and mobile navigation retains its existing structure and semantics. The home
learning cycle is a pale instructional band rather than a dark panel.

## 9. Cards and panels

Platform and IVP panels now use near-white surfaces, subtle borders, consistent
radii, and restrained layered shadows. Method cards, roadmap cards, result
statistics, formula regions, and instructional panels have clearer internal
grouping without converting every text block into a card.

## 10. Forms and controls

Inputs, selects, editable math, and the Tutor composer use white surfaces and
stronger borders. Focus uses a visible violet ring plus border change. Primary
actions use accessible blue with white text; secondary/ghost controls retain
visible boundaries. Disabled controls use a distinct gray surface and readable
slate text. Error, warning, success, and informational regions use both border
or shape cues and semantic color.

## 11. Method/Data/Output

Progress stages are clearer, with the active stage filled and labeled. Compare
method cards now expose `aria-pressed` and the first selected method retains an
`is-selected` class with a two-pixel outline and inset marker. Data grouping,
helper text, presets, output statistics, Compare summaries, Convergence, and
New experiment controls were visually clarified. Run behavior, numerical
snapshots, reset ownership, and all accepted labels remain unchanged.

## 12. Charts and tables

Chart colors are resolved from centralized CSS variables at mount time with
stable fallbacks. Numerical approximation uses blue, second-variable or exact
roles use teal, theoretical convergence uses dashed violet, and the second
Compare method uses amber. Axes use dark slate, grids are quiet, tooltips use
navy with light text, and the approximation fill is pale blue. Tables retain
their labels and local horizontal scrolling, with pale headers and scoped zebra
rows. The required labels remain exactly unchanged.

## 13. Glossary

The trigger remains text-like with its dotted interactive affordance. Desktop
preview/pinned cards and the mobile sheet now share a white elevated surface,
soft header, pale formula containment, teal contextual definition band, and
long-card internal scrolling. Terms, definitions, order, annotations,
accessible names, focus behavior, one-level navigation, Single-only Output
annotation, Compare plain behavior, future text, and Tutor boundary are
unchanged.

## 14. Tutor

Only shared surface styling changed: the panel is white with restrained depth,
the transcript is softly tinted, suggestion chips and message boundaries are
clearer, and the composer retains a strong field boundary. No Tutor copy,
prompt, request, response, state, API, or Glossary connection changed. Chrome
opened and closed the panel without submitting a request.

## 15. Desktop review

Chrome reviewed the fresh production build at `1440 × 900` for `/`, `/about`,
`/ode`, `/ode/initial-value-problems`, and the production
`/__dev/glossary-playground` boundary. Reviewed IVP states included initial and
selected Method, Forward and Backward Data, successful Single Output, Compare
Output, Convergence Study, pinned Glossary card, and Tutor open. The result is
visibly brighter with no dominant dark workflow region, lost selected state,
root overflow, or app console warning/error. The DEV route rendered Page Not
Found as required.

## 16. Mobile review

Chrome reviewed the same product routes and workflow states at `390 × 844`.
The root remained overflow-free; deliberately wide tables/charts remained
inside their local scrollers. The Glossary sheet measured approximately
`375 × 692` CSS pixels within the captured content viewport and ended exactly
at the viewport bottom. The Tutor panel measured approximately `351 × 776`
CSS pixels with safe top/bottom containment. No text, formula, card, or control
escaped the layout.

## 17. Accessibility

Representative contrast ratios against white are: primary text `15.53:1`,
secondary text `6.20:1`, primary blue `5.17:1`, white on strong blue `6.70:1`,
teal `5.47:1`, warning on its pale surface `5.09:1`, and danger on its pale
surface `5.89:1`. Focus is visible; selection and statuses do not depend on
color alone; disabled controls remain legible; reduced-motion rules disable
the added transitions; forced-color rules restore Canvas/CanvasText/Highlight
ownership. A `720 × 450` reflow check representing 200% desktop zoom found no
root horizontal overflow on About or the IVP route.

## 18. Automated verification

- Focused visual/route/lifecycle set: 13 files, 149 tests passed.
- Full `npm.cmd run verify`: 76 files, 1,098 tests passed.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run typecheck:api`: passed.
- `git diff --check`: passed.

The first broad focused run exposed a stale full-module test mock that omitted
the new chart-theme export. It was corrected to preserve real exports while
mocking only the mounted view, then the focused and full suites passed.

## 19. Bundle/build result

The production build passed with 86 transformed modules. The main entry
remains `52.90 kB` raw / `16.35 kB` gzip. The complete IVP chunk is
`291.72 kB` raw / `93.41 kB` gzip. Route, Tutor, Glossary, MathLive, and
Compute Engine ownership remains lazy and passed the bundle-ownership tests.
Only the already accepted deferred large-chunk warning remains.

## 20. Explicit non-changes

No routes, learner copy, solver or numerical behavior, chart data, validation,
Tutor behavior, Glossary content/bindings/lifecycle, store/session/history,
persistence, meaningful-work behavior, API behavior, package/lockfile,
dependency, external asset, font chain, configuration, Vercel setting,
deployment repository, COPY-041, or COPY-042 changed. No external image,
font, analytics, or host was added; the existing Google Fonts chain remains
unchanged.

## 21. Before/after evidence paths

Ignored and untracked local evidence is stored under:

- `references/derived/frontend-polish/before/`
- `references/derived/frontend-polish/after/`

The folders contain named desktop/mobile route and state screenshots,
including Method/Data/Single/Compare/Convergence, Glossary, Tutor, and the
production DEV-route boundary. Screenshots and build output are not committed.

## 22. Findings

- P0: none.
- P1: none.
- P2: none.
- P3: none open. The stale chart-view test mock found during focused
  verification was corrected before final verification.

## 23. Verdict

**FRONTEND VISUAL POLISH COMPLETE — READY FOR MAINTAINER REVIEW**

## 24. Remote-operation status

No fetch, pull, push, Preview deployment, Production deployment, private
deployment-repository access, or external account operation was performed.
This review and the visual changes are intended for one local commit only.
