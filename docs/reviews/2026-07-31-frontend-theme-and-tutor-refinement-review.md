Frontend skill loaded: `frontend-design` — `C:\Users\bruce\.codex\skills\frontend-design\SKILL.md`

# Codex Theme and Tutor Refinement Review

## 1. Metadata

- Date: 2026-07-31
- Repository: `D:\numerical-t-lab`
- Branch: `main`
- Task: one bounded refinement of the existing local visual-polish commit
- Starting HEAD: `3fa31fb916da9aab6183792e9b2af7629b608b67`
- Pre-polish palette authority: `b0f44a540d04a85a5468f99fcb8c700baa80d422`
- Starting `origin/main`: `b0f44a540d04a85a5468f99fcb8c700baa80d422`
- Evidence status: locally implemented, fully verified, and Chrome-reviewed; awaiting maintainer visual review

## 2. Starting state

The pre-edit gate passed exactly: branch `main`; HEAD `3fa31fb916da9aab6183792e9b2af7629b608b67`; parent and `origin/main` `b0f44a540d04a85a5468f99fcb8c700baa80d422`; clean worktree; expected remotes present. No reset, stash, amend, rebase, merge, revert, cherry-pick, fetch, pull, or history rewrite was performed.

## 3. Frontend skill

The dedicated `frontend-design` skill at `C:\Users\bruce\.codex\skills\frontend-design\SKILL.md` was loaded completely and applied. It guided the restrained scientific palette, token-first implementation, clear workflow hierarchy, deliberately limited decoration, and avoidance of generic SaaS or glassmorphism treatment.

Chrome review used `chrome:control-chrome` at `C:\Users\bruce\.codex\plugins\cache\openai-bundled\chrome\26.727.51351\skills\control-chrome\SKILL.md`. The Vercel environment update followed `vercel:env-vars` at `C:\Users\bruce\.codex\plugins\cache\openai-curated-remote\vercel\0.21.4\skills\env-vars\SKILL.md`.

## 4. Maintainer feedback

The first polish was visually clean but too bright and uniformly flat. This pass lowers glare, restores the original dark character as an option, strengthens Method/Data/Output/Convergence identity, removes the initial brand focus artifact, and makes the Tutor transcript the dominant working region. It preserves the existing structure, learner copy, workflow, routes, and mathematical ownership.

## 5. Initial-focus root cause

On a fresh pointer-based production hard load before editing, the recorded focus state was:

- `document.activeElement`: route heading element
- tag: `h1`
- classes: none
- accessible name: `Numerical T-Lab`
- attributes: `tabindex="-1"` and `data-route-focus="true"`
- focus owner/caller: `createPlatformRouter().transition()` calling `focusCurrentRoute()` for the `initial` navigation type

The shared `:focus-visible` selector then correctly drew an outline around that programmatically focused heading, producing the unwanted initial frame. No `autofocus` attribute or brand-link focus call caused the artifact.

The router now skips route-owner focus only for initial bootstrap navigation. Internal route transitions retain heading focus. A Chrome hard load now leaves focus on `body`; the first keyboard Tab focuses the `Numerical T-Lab` brand link with a visible `2.66667px` outline. Direct router and bootstrap regression tests protect both behaviors; no outline is globally removed.

## 6. Light-theme direction

The default Light theme is a lower-glare scientific workspace:

| Role | Value |
|---|---|
| Canvas | `#e8edf3` |
| Primary surface | `#f7f9fc` |
| Raised surface | `#ffffff` |
| Primary text | `#182235` |
| Secondary text | `#526071` |
| Border | `#bcc8d6` |
| Primary blue | `#315e9d` |
| Reference teal | `#2e7975` |
| Theory violet | `#675b96` |
| Convergence amber | `#865516` |

Pure white is reserved for bounded raised surfaces, not the page canvas. Moderate borders and restrained shadows carry hierarchy without recreating the first pass's glare.

## 7. Dark-theme recovery source

The Dark theme was recovered directly from `git show b0f44a540d04a85a5468f99fcb8c700baa80d422:src/app/theme.css`. Its defining values remain `#0b1020` canvas, `#121a33` primary surface, `#171f3a` raised surface, `#0f152b` inset surface, `#e9eefc` text, `#9fb2df` secondary text, `#6c8cff` blue, and `#7ae2a8` green/teal, including the original `#1c2a55` radial character. Violet, focus, status, disabled, and selected-state derivatives were normalized into the same shared token system for consistency and accessibility. There is no copied second stylesheet.

## 8. Token architecture

`src/app/theme.css` retains shared structural tokens in `:root` and defines all visual values under exactly `html[data-theme="light"]` and `html[data-theme="dark"]`. Both themes own canvas, surfaces, text levels, borders, focus, actions, semantic states, disabled controls, workflow accents, chart roles, scrim, shadows, and signature gradients. Component CSS consumes these roles rather than branching by theme. No framework, dependency, external font, icon library, or parallel theme system was added.

## 9. Theme toggle and persistence

The rightmost desktop header control after About is a native button containing local inline SVG only. Narrow layouts keep the icon-only control next to Menu. Light presents a moon with `Switch to dark mode`; Dark presents a sun with `Switch to light mode`. `aria-pressed` tracks Dark activation, and native Enter/Space behavior was confirmed in Chrome.

Only `light` and `dark` are accepted in `localStorage` key `numerical-t-lab-theme`; absent or invalid state defaults to Light. A small guarded inline bootstrap in `index.html` applies the saved value before stylesheet/module startup, preventing a wrong-theme first paint. Chrome confirmed persistence across reload; source-level tests protect the pre-main bootstrap position and allowed-value behavior.

## 10. Theme-aware charts

Primary and convergence charts resolve colors from current theme tokens. The ODE route listens for the narrow theme event and recolors existing datasets, axes, titles, legends, tooltips, grids, fills, and canvas presentation before `chart.update("none")`. Single, second-variable, Compare, and exact/reference roles remain distinct. Convergence destroys and recreates only its Chart instance from the existing successful study state.

Theme changes do not call a solver, replace result points, change axis bounds, alter titles, mark meaningful Lab work, or change Compare/Convergence state. The lifecycle test proves successful point identity and bounds remain unchanged while the existing chart redraws, and confirms listener disposal.

## 11. Section hierarchy

The shell now uses a cool canvas and quiet raised hero; module cards have restrained role distinctions; the learning cycle remains instructional rather than decorative. The IVP title aligns with a single `New experiment`/`Open AI Tutor` action cluster. Workflow panels carry restrained colored rails and tints: Method blue, Data teal, Output violet, and Convergence amber. Progress pills, form groups, output summary, stat tiles, Compare summary, tables, and convergence drawer have clearer boundaries.

Compare method cards preserve `aria-pressed` and `is-selected` and add a check-circle marker, so selection is not color-only. No method-card semantics or workflow transitions changed.

## 12. Tutor redesign

Desktop uses a flex-column panel with target width `clamp(440px, 36vw, 560px)` and target height `min(820px, calc(100dvh - 24px))`, capped against the real shell clearance so the entire composer and action row remain visible. The compact sticky header is followed by compact two-column suggestions, a dominant independently scrolling transcript with a practical `360px` minimum, an inline status/error region, and a sticky composer. The textarea grows from 56px to a bounded 144px; Clear chat is secondary and Send remains primary.

After the first user message, suggestions close behind a one-line `Suggested questions` disclosure. The transcript uses message surfaces rather than an input-like box, wraps long content safely, and has a narrow unobtrusive scrollbar. At `1440 × 900`, Chrome measured a `494 × 812` panel, `518.5px` post-message transcript, and fully visible action row.

Mobile uses a `92dvh` bottom sheet. At `390 × 844`, Chrome measured a contained `351 × 776` panel, approximately `405px` empty transcript or `485px` post-message transcript, and visible composer actions ending within the viewport. At `720 × 450`, the panel remained contained and independently scrollable. Existing inert background, modal ownership, Escape, focus trap/return, and scroll lock remain unchanged.

## 13. Mock configuration

The ignored local `D:\numerical-t-lab\.env.local` contains `AI_TUTOR_MOCK=true`; no unrelated value was printed or changed, and `git check-ignore` confirms the file remains excluded. A bounded local API process loaded that setting, bound only to `127.0.0.1`, and returned a real mock Tutor response without contacting a live model.

The existing Numerical T-Lab Vercel project had `AI_TUTOR_MOCK` already present for All Environments, with its previous value masked and not revealed. The value was set to boolean text `true` for Development, Preview, and Production through the existing All Environments target. No other variable, project setting, domain, or Git integration was changed.

## 14. Safe error behavior

Learner-facing configuration failure now uses exactly:

> AI Tutor is temporarily unavailable. Please try again later.

The client converts all non-success API responses to that safe message, and the server returns the same public text for missing provider configuration while retaining diagnostics in server logs. Tests prove learner UI and API responses omit internal environment names and local/Vercel setup instructions. The Chrome mock transcript likewise contained none of those internal names.

## 15. Desktop evidence

Chrome reviewed the fresh production build at `1440 × 900` in both themes across `/`, `/about`, `/ode`, and `/ode/initial-value-problems`. IVP evidence covers Method, Forward Data, Backward Data, Single Output, Compare Output, Convergence, selected method, chart recoloring, pinned Glossary, Tutor empty, and Tutor after one local mock response. The brand has no hard-load frame, theme persists, result values survive theme changes, charts remain legible, the Tutor composer remains visible, root overflow is absent, and no app console warning/error appeared.

The production `/__dev/glossary-playground` route rendered Page Not Found as required.

## 16. Mobile evidence

Chrome reviewed the same product routes and representative IVP, Glossary, and Tutor states at `390 × 844` in both themes, plus the compact `720 × 450` viewport. The Glossary sheet measured approximately `375 × 692` within the captured content viewport and ended at the viewport bottom. The Tutor sheet retains sticky header/composer, an independent transcript, compact disclosure, and full action visibility. No root horizontal overflow was found. Effective desktop zoom geometry was also reviewed at `1800 × 1125` (80% equivalent) and `720 × 450` (200% equivalent), both without root overflow.

## 17. Accessibility and contrast

Representative calculated contrast ratios are:

- Light primary text/surface `15.09:1`; secondary `6.09:1`; tertiary `4.64:1`.
- Light blue/white `6.52:1`; teal/white `5.11:1`; violet/white `5.98:1`; amber/white `6.32:1`.
- Light danger on its surface `5.36:1`; disabled text on disabled surface `4.56:1`.
- Dark primary text/surface `14.82:1`; secondary `8.11:1`; tertiary `6.21:1`.
- Dark blue/surface `5.59:1`; teal `10.87:1`; violet `7.96:1`; amber `12.07:1`; danger `8.47:1`; disabled `5.29:1`.

Focus remains visible, keyboard navigation is preserved, selection and status meaning have non-color cues, reduced-motion rules cover modified transitions, and forced-color rules restore Canvas/CanvasText/Highlight ownership. Mobile modal containment and focus lifecycle tests remain green.

## 18. Tests

- Focused theme/focus/chart/Tutor/API suite: 10 files, 135 tests passed.
- Full `npm.cmd run verify`: 77 files, 1,107 tests passed.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run typecheck:api`: passed.
- `git diff --check`: passed.

Coverage includes default Light, persistence, labels, keyboard toggle, no-flash bootstrap structure, initial hard-load focus, route focus, chart redraw without result mutation, method selection, Tutor open/close, disclosure collapse, composer structure, safe error, Glossary/modal lifecycle, routes, and production DEV exclusion.

## 19. Build/bundle

The production build passed with 87 transformed modules. The entry is `54.57 kB` raw / `16.99 kB` gzip; the complete IVP chunk is `292.96 kB` raw / `93.82 kB` gzip; Tutor is `12.14 kB` raw / `4.61 kB` gzip plus `6.61 kB` CSS / `1.81 kB` gzip. Route, Tutor, Glossary, MathLive, and Compute Engine lazy ownership tests remain green. Only the accepted deferred MathLive/Compute Engine large-chunk warning remains.

## 20. Vercel environment update

- Variable: `AI_TUTOR_MOCK`
- Targets: Development, Preview, Production through All Environments
- Previous presence/state: present; value masked and not revealed
- New boolean state: `true`
- Redeployment: required for the change to affect a deployment

No redeployment, Preview, or Production deployment was triggered.

## 21. Exact files

Source and tests:

- `index.html`
- `src/app/theme.ts` (new)
- `src/app/theme.test.ts` (new)
- `src/app/theme.css`
- `src/app/themeTokens.test.ts`
- `src/app/appShell.ts`
- `src/app/appShell.test.ts`
- `src/app/platform.css`
- `src/app/router.ts`
- `src/app/router.test.ts`
- `src/app/platformBootstrap.test.ts`
- `src/style.css`
- `src/ode/odeApp.ts`
- `src/ode/odeLifecycle.test.ts`
- `src/convergenceStudyView.ts`
- `src/glossary/surface/glossarySurface.css`
- `src/tutor/platformTutorPanel.ts`
- `src/tutor/tutor.css`
- `src/tutor/tutorClient.ts`
- `src/aiTutorPanel.test.ts`
- `api/chatHandler.ts`
- `api/chatHandler.test.ts`

Documentation:

- `PLAN.md`
- `docs/INDEX.md`
- `docs/PROJECT_HANDOFF.md`
- `docs/reviews/2026-07-31-frontend-theme-and-tutor-refinement-review.md`

Ignored local-only evidence/configuration:

- `.env.local`
- `references/derived/frontend-polish-v2/before/`
- `references/derived/frontend-polish-v2/light/`
- `references/derived/frontend-polish-v2/dark/`
- `references/derived/frontend-polish-v2/tutor/`

## 22. Explicit non-changes

No numerical algorithm, coefficient, grid, result, validation, Store, session, persistence, History API, routing, learner copy, Tutor prompt, Tutor mathematical response, Tutor request contract, Glossary content, annotation, binding, order, lifecycle, accessible name, package, lockfile, dependency, font, external resource, Vercel project/domain/Git integration, COPY-041, COPY-042, or private repository changed. Theme switches do not mark meaningful Lab work. No source was pushed and no application deployment occurred.

## 23. Findings

- P0: none.
- P1: none.
- P2: none open.
- P3: none open. Chrome review exposed desktop Tutor shell clearance and Light disabled-text contrast below the desired target; both were corrected before final verification and evidence capture.

## 24. Verdict

**FRONTEND THEME AND TUTOR REFINEMENT COMPLETE — READY FOR VISUAL REVIEW**

## 25. Push/deployment status

The refinement is included in one local commit with subject `Refine themes and Tutor experience`. It has not been pushed. No Preview or Production deployment was created. The only remote mutation was the explicitly authorized Vercel `AI_TUTOR_MOCK=true` environment update, which requires a future deployment before it can affect runtime behavior.
