# Content-Agnostic Interactive Glossary Framework Release Review

## 1. Title and metadata

| Field | Value |
|---|---|
| Review date | 2026-07-28 |
| Review type | Adversarial local framework release review |
| Verdict | **RELEASE BLOCKED** |
| Starting branch | `main` |
| Starting HEAD | `8ce77b2c9a2e2e6df1138e9798114400041335a5` |
| Reviewed runtime range | `38447a462bcc2878f087ab0c4013287a800cd58f` through `8ce77b2c9a2e2e6df1138e9798114400041335a5`, excluding the unrelated intermediate content-foundation commit |
| Starting worktree | Clean, including untracked non-ignored files |
| External state | No fetch, pull, push, deployment, account, remote, or live Tutor/model access |
| Production-content authority | Not granted |

This document records the release verdict for the implemented framework and
DEV-only verification environment. It does not approve production terms,
definitions, notation, annotations, or an ODE Glossary binding.

## 2. Executive verdict

**RELEASE BLOCKED**

The framework has strong architecture, production isolation, modal/Tutor
coordination, accessibility foundations, and automated coverage. The focused
framework gate passed 199 tests, the full repository gate passed 1,022 tests,
both TypeScript checks passed, and the fresh production build and manifest
inspection passed.

Release is nevertheless blocked by two independently reproduced runtime
defects:

1. A scope replaced while its lazy surface is still loading can leave the
   loading request authoritative. If its obsolete trigger remains connected,
   the late load mounts a surface for the disposed scope and assigns ARIA
   ownership to the obsolete trigger.
2. The desktop pinned-card Tab bridge is not one-shot. Returning focus to the
   trigger and pressing forward Tab again is intercepted again.

The first is P1 because it violates binding/scope authority and stale-work
protection. The second is a substantive P2 keyboard defect that must be
corrected before production term integration. One DEV-only P3 finding records
unbounded event and mock-request logs.

## 3. Review scope

The review traced the complete framework:

```text
model and builders
-> registry
-> scope and controller
-> annotation lifecycle
-> readonly math
-> surface loader and placement
-> preview, pinned card, and mobile sheet
-> modal environment and Tutor arbitration
-> Platform Host and Lab adapter
-> DEV Playground, About entry, and shortcut
-> production route/source/build exclusion
```

Evidence came from current source, current tests, Git history, a fresh build and
manifest, emitted marker searches, in-memory runtime reproductions, an isolated
localhost development session, and a localhost production preview. Earlier
audit packages were treated as background evidence only.

Out of scope:

- production mathematical content;
- the ODE vertical slice;
- terminology or notation decisions;
- real Tutor/network integration;
- push, deployment, or production verification;
- changes to runtime, tests, CSS, packages, numerical code, or configuration.

## 4. Commit inventory

| Commit | Role in the reviewed framework |
|---|---|
| `38447a462bcc2878f087ab0c4013287a800cd58f` | Adds the immutable model, builders, registry, scope/controller lifecycle, optional Lab seam, and focused tests. |
| `bce6ce74798d07cdbb522e56c015f567c1a6153d` | Corrects readonly-math accessible ownership before Glossary surfaces use it. |
| `e30c41cc2507f18c7c8ed5ca725305900008c78f` | Adds the shared Host, loader, placement, surface runtime, modal environment, Tutor coordination, and initial DEV harness. |
| `491ff411d2f4cd277e1c641b462d09f0c4bc1b6e` | Corrects shared-surface lifecycle defects found by conservative audit. |
| `18c754955ad1c5ae01fdc8ab68ac54331b9f5529` | Removes deferred Tutor auto-restore and corrects pre-mount abort cleanup. |
| `8ce77b2c9a2e2e6df1138e9798114400041335a5` | Completes the DEV Playground, development controls, About entry, shortcut, fixture matrix, and production-exclusion evidence. |

`3ef0f670dbac73b420ae757c2d1b2e07845e8c12` is a separate draft
content-foundation commit. It was not treated as framework runtime evidence and
does not authorize production content.

The previous Cursor runtime re-audit reported **SAFE TO PROCEED** with
`P0 = P1 = P2 = P3 = 0` for Commit 3 and its two lifecycle follow-ups. The
maintainer-supplied Commit 4 audit package reported a green implementation
gate and production exclusion. Both were read, but their claims were
independently checked. Neither prior package exercised the two blocking paths
reproduced here.

## 5. Authoritative requirements

The binding requirements were derived from:

- the [approved design](../superpowers/specs/2026-07-22-content-agnostic-interactive-glossary-framework-design.md);
- the [repository-grounded implementation plan](../superpowers/plans/2026-07-23-content-agnostic-interactive-glossary-framework-implementation-plan.md);
- the current repository operating contract;
- the explicit final-review acceptance matrix.

The design governs behavior and ownership. The implementation plan governs
repository seams, tests, lifecycle sequencing, lazy boundaries, and release
evidence. Current source and observed behavior take precedence over status
claims.

## 6. Requirements traceability matrix

Statuses total 40 requirements:

- PASS: 34
- PASS WITH CARRY-FORWARD: 3
- PARTIAL: 1
- FAIL: 2

| ID | Requirement and authority | Implementation evidence | Test/browser evidence | Status | Notes |
|---|---|---|---|---|---|
| R01 | Content-agnostic immutable metadata model (design 12-16; plan model section) | `glossaryRuntimeTypes.ts`; `glossaryBuilders.ts` | `glossaryBuilders.test.ts` | PASS | Records are copied/frozen and contain no UI/runtime handles. |
| R02 | Core/module separation | `coreGlossary.ts`; `createGlossaryRegistry()` | Registry and source-graph tests | PASS | Module extensions are separately registered. |
| R03 | Empty immutable production core | `CORE_GLOSSARY_ENTRIES` | Source inspection and production marker scan | PASS | Empty and frozen. |
| R04 | Deterministic term resolution | `createGlossaryRegistry().resolve()` | 12 registry tests | PASS | Core, module, display, and dynamic layers remain explicit. |
| R05 | Module override constraints | `defineGlossaryModuleExtension()`; registry construction | Builder/registry override tests | PASS | Unknown targets diagnose; unrelated terms cannot be overwritten. |
| R06 | Strict DEV validation and controlled production fallback | Validation policy and diagnostic sink | Builder, registry, scope, and Playground diagnostics | PASS | DEV remains loud; production fails closed to readable text. |
| R07 | Explicit scope ownership | `createGlossaryScope()`; `createLabGlossaryBinding()` | Scope/controller tests | PASS | No DOM scanning or global term inference. |
| R08 | First occurrence enhanced | Scope `createTerm()` | Scope tests and live Playground | PASS | One native button per term per scope. |
| R09 | Same-scope duplicates remain plain text | Scope occurrence set | Scope tests and live Playground | PASS | Duplicate retained readable authored text. |
| R10 | Cross-scope independence | Separate scope controllers | Scope tests and live Playground | PASS | Same term can be interactive in another scope. |
| R11 | Annotation semantics and accessible composition | Native trigger creation; Playground sibling composition | Scope/Playground tests; live label/table inspection | PASS WITH CARRY-FORWARD | No nested controls or broken input descriptions; no live screen-reader, forced-colors, or 200% zoom session was available. |
| R12 | Educational-label composition | Playground native label plus sibling term | Playground tests and browser DOM | PASS | Input name and help/error relations remained intact. |
| R13 | Dynamic context subscription and in-place update | Host snapshot subscription; surface `updateContext()` | Host/surface/Playground tests; stable live surface ID | PASS | Definition, relevance, formula replacement/suppression, and Tutor context are supported. |
| R14 | Stale context callbacks cannot cross active identity | Active surface identity, binding identity, unsubscribe | Host tests and source state trace | PASS | Fresh snapshots are read only while the exact active surface remains current. |
| R15 | Active replacement transaction transfer | Controller transaction; Host `handleReplacement()` | Controller/Host/Playground tests; live repeated transfer | PASS | Current mounted pinned/mobile surfaces transfer ARIA and anchor authority. |
| R16 | Replacement during pending lazy load is safe | Host `beginScopeRerender()` and loader completion | Independent deferred-load reproduction | FAIL | Loading state is omitted from the replacement candidate and can mount for a disposed scope. See GLF-REL-001. |
| R17 | Trigger connectivity/offscreen safety | `triggerIsUsable()`; placement close path | Host and placement tests | PASS | Detached/far-offscreen active triggers close. |
| R18 | Desktop preview behavior | Host hover/focus timers and preview surface | Host/surface tests; keyboard browser evidence | PASS WITH CARRY-FORWARD | Fine-pointer move tooling did not synthesize the live hover event; deterministic timer tests passed. |
| R19 | Desktop pinned-card behavior | Host pinned mode; surface runtime | Host/surface tests; live pin, long scroll, placement | PASS | Focus remains on trigger and complete content is scrollable. |
| R20 | One-shot next-Tab bridge | Surface `onTriggerTab()` | Independent two-Tab reproduction | FAIL | The handler has no consumed state and intercepts every eligible forward Tab. See GLF-REL-002. |
| R21 | Viewport-safe desktop placement | `placeGlossarySurface()` and surface CSS | Placement tests; 1440 and 768 measurements | PASS | 360/288/420 widths, margins, gap, height, and edge flipping agree. |
| R22 | Mobile modal sheet | Surface runtime and modal lease | Host/modal/Playground tests; live 390 x 844 sheet | PASS WITH CARRY-FORWARD | Dialog naming, inertness, lock, containment, Escape, and restoration passed; no real touch/coarse device was available. |
| R23 | Shared lazy surface attempt | `createGlossarySurfaceLoader()` | Loader tests; manifest and browser resource sequence | PASS | Pending and fulfilled attempts are shared. |
| R24 | Retry and stale generations | Loader Retry; Host request generation | Loader/Host tests | PASS | Rejection is retryable and stale ordinary requests cannot mount; R16 is the scoped replacement exception. |
| R25 | Readonly formula ownership | `renderReadonlyMath()` and surface formula handle | Readonly, Tutor, ODE, Convergence, and surface tests | PASS | One accessible owner and deferred enhancement. |
| R26 | Structured Tutor handoff contract | `glossaryTutorContract.ts`; surface request creation | Surface and integration tests; live mock log | PASS | Stable term/module/scope and curated context only. |
| R27 | Tutor suspension order and retained panel | Tutor/Glossary Host integration | Tutor Host and Host-to-Host integration tests | PASS | Panel, draft, transcript, preference, and pending work remain mounted. |
| R28 | Modal lease and arbitration | `PlatformModalEnvironment`; external-modal guard | Modal, Host, Tutor, integration tests; live refusal | PASS | Identity leases, exact restoration, no replay, no stacked modal. |
| R29 | Focus restoration policy | Host `closeInternal()` and replacement current trigger | Host/surface tests; live mobile Escape/current trigger | PASS | Explicit/Escape restore; route/outside/scroll paths do not force restoration. |
| R30 | Route/Lab/platform disposal | Lab adapter, bootstrap, Hosts, binding/scope disposal | Adapter/bootstrap/Host/controller tests; live reset/nav/back | PASS | Disposal is ordered and idempotent with no Store ownership. |
| R31 | One actual DEV framework harness | Playground route using actual Host/binding | Playground tests and browser asset/DOM evidence | PASS | No parallel surface implementation. |
| R32 | Neutral fixture and diagnostic matrix | DEV fixtures and 13 sections | Seven Playground tests; live 13-section count | PASS | Ten neutral IDs cover short/long/formula/alias/scope/composition/placement cases. |
| R33 | Bounded DEV event/request logs | Route-local `events` and `mockTutorRecords` | Source inspection | PARTIAL | Reset/disposal clear them, but pushes are unbounded during a mount. See GLF-REL-003. |
| R34 | DEV controls lifecycle | Cached DEV module and cleanup | 19 shortcut tests; bootstrap tests | PASS | One listener, stale-install guard, idempotent cleanup. |
| R35 | DEV About entry only | About factory plus DEV composition | Page/development route tests; dev and production preview | PASS | Exactly one semantic DEV section; production About unchanged. |
| R36 | Keyboard shortcut and editable exclusions | `installGlossaryDevelopmentControls()` | 19 tests; live Ctrl+Shift+G and input exclusion | PASS | Ctrl/Meta, key/code, modifiers, repeat, current route, and editables covered. |
| R37 | Production route/source/build exclusion | DEV injection behind `import.meta.env.DEV` | Route/source-graph/manifest tests; fresh marker scan and preview | PASS | No DEV route, payload, CSS, About marker, or shortcut in production. |
| R38 | No production terms and no ODE binding | Empty core; ODE mounted route omits optional binding | Source tests; dev/production ODE browser checks | PASS | Host remains inert in product routes. |
| R39 | No persistence or meaningful-work integration | Glossary absent from Store and session types | Source-graph and Store boundary inspection | PASS | All state is transient. |
| R40 | No real Tutor/network behavior | Mock handoff only | Source/security scan; live mock and asset evidence | PASS | No fetch/API/transcript/queue/Keep/Replace behavior. |

## 7. Architecture and ownership assessment

### Model and registry

The model is domain-neutral and contains strings, readonly formula metadata,
stable IDs, source ownership metadata, contextual supplements, and Tutor topic
metadata. It contains no DOM nodes, Hosts, Store types, ODE state, functions,
subscriptions, or network handles.

Builders defensively copy and freeze nested data. Registry resolution is
deterministic. Exact alias conflicts and duplicate IDs are diagnosed. Strict
mode throws before mutation; production fallback reports once per owning
diagnostic seam and returns readable non-interactive text. DEV fixtures build a
separate registry and cannot mutate the empty production core.

### Scope and controller

Explicit Lab-owned bindings create explicit scope controllers. Scope-local
first occurrence, cross-scope independence, native trigger semantics,
idempotent disposal, conflict handling, and active-surface replacement are
well structured. There is no route-global term singleton.

The material exception is pending lazy work: disposing an old scope inside
`beginScopeRerender()` does not notify the Host's loading path, and the Host
does not consult loading state when opening the replacement window. This
breaks the otherwise sound identity boundary.

### Platform

Bootstrap owns one `PlatformGlossaryHost` and one shared
`PlatformModalEnvironment`. The current Lab supplies no Glossary binding, so
production remains inert. The generic Lab adapter connects the optional binding
after mount and closes/disconnects Glossary before session capture, Tutor
disconnect, and Lab disposal. Glossary state never enters `AppSessionStore`.

The DEV Playground connects its real binding to the bootstrap-owned Host. It
does not instantiate a second Host or bypass the controller for surface
manipulation.

## 8. Annotation and composition assessment

The trigger is a native `button[type="button"]` with authored readable text and
no layout wrapper. Same-scope duplicates are plain text. Valid open state owns
`aria-controls` and `aria-expanded`; close, scope disposal, and active
replacement remove old ownership in the tested mounted-surface paths.

The Playground input retains a native label and two `aria-describedby`
relationships. The Glossary trigger is a sibling, not a child of the label.
The table retains caption, row, cell, `th`, and `scope="col"` semantics. The
header term is not nested in another interactive control. The intentionally
unannotated link and button remain unchanged. Live DOM inspection found zero
matches for nested `label button`, `button button`, `a button`, or `button a`.

Enter/Space use native button activation. Escape and Close are explicit.
Shift+Tab is not intercepted on desktop. The one-shot forward-Tab contract is
not met; see GLF-REL-002.

## 9. Context and replacement lifecycle

Preview reads static content and does not subscribe. Pinned and mobile complete
surfaces read and subscribe to current snapshots. Live evidence showed an
armed update retaining the same surface ID while changing the contextual
definition, why-it-matters copy, formula, and revision. Formula suppression
removed the accessible math content. Focus remained stable. Close and disposal
unsubscribe through exact active-surface ownership.

Active mounted replacement is otherwise strong:

- surface identity remains stable;
- old trigger ARIA is cleared;
- the new trigger receives ARIA and placement authority;
- watcher ownership moves;
- repeated desktop/mobile replacement is covered;
- Close/Escape restoration targets the current trigger;
- stale active-surface callbacks are identity checked.

Pending replacement is not strong. A deferred loader, a connected obsolete
trigger, and a committed replacement produced:

```text
obsoleteTriggerConnected = true
obsoleteTriggerExpanded = "true"
replacementTriggerExpanded = null
mountedSurfaceCount = 1
```

That is direct proof that the disposed scope retained late mount authority.

## 10. Surface modes and placement

### Desktop preview

The Host differentiates fine-pointer hover delay from immediate keyboard-focus
preview. Preview does not move focus, subscribe, acquire a modal lease, or make
background content inert. Tests cover the 220 ms open timer, 300 ms close
timer, pointer entry cancellation, replacement by another term, document
scroll dismissal, and stale timers. The selected browser's pointer-move
operation did not synthesize the preview event, so no live hover claim is made.

### Desktop pinned card

Live 1440 x 900 evidence observed a 360 px card entirely inside the viewport,
focus on the trigger after pin, complete content, and no document overflow.
At 768 x 1024, the long card was 360 px wide, stayed inside the 12 px viewport
margin, exposed the Close action, and had `478` px client height versus `957`
px scroll height. Escape, explicit close, outside-pointer, document-scroll,
reposition, and offscreen behavior have focused tests.

The next-Tab bridge enters Close, but it is reusable rather than one-shot.

### Mobile sheet

At 390 x 844 the live sheet had:

- `role="dialog"`;
- `aria-modal="true"`;
- a valid heading relationship;
- Close initially focused;
- four platform regions inert;
- body overflow set to `hidden`;
- no horizontal document overflow;
- Shift+Tab wrapping from Close to Ask the Tutor;
- Tab wrapping from Ask the Tutor to Close;
- Escape restoring the connected trigger and exact modal environment state.

The external simulator remained the only dialog after an attempted Glossary
activation. Closing it created no delayed replay. A fresh activation could
open normally.

### Placement agreement

Algorithm, CSS tokens, tests, and live measurements agree on:

- preferred width `360`;
- minimum width `288`;
- maximum width `min(420, viewport - 24)`;
- 12 px viewport margin;
- 8 px trigger gap;
- maximum height `min(70dvh, 560px)`;
- bottom preference with top/side fallback;
- narrow viewport constraints;
- offscreen-trigger close;
- internal scrolling without document reposition.

## 11. Modal and Tutor lifecycle

`PlatformModalEnvironment` uses an exclusive identity lease. A stale release
cannot unlock a newer owner. It captures and restores pre-existing inert
properties/attributes, body overflow, and scroll position. Failed acquisition
has no side effect, and disposal releases current ownership.

Integrated tests establish the required Tutor-to-Glossary order:

1. identify the visible Tutor presentation;
2. hide/inert it and remove active dialog semantics;
3. release its modal lease;
4. check the product-neutral external-modal guard;
5. load the surface lazily;
6. recheck the guard;
7. acquire the Glossary lease;
8. mount the sheet.

The retained Tutor panel keeps transcript, draft, preference, and pending
request state. Hidden completion cannot focus the panel. Closing Glossary does
not automatically reopen Tutor. Manual Tutor open first closes Glossary without
term-focus restoration, then reuses the retained panel after successful lease
acquisition.

Failed/aborted Glossary paths restore only the exact suspension that still owns
authority. There is no observer, timer, polling loop, queued restore, delayed
replay, or automatic reopen. The prior P1 deferred-restore and P2 abort-cleanup
defects have direct integration regressions. GLF-REL-001 is a distinct
scope-replacement abort gap.

## 12. Lazy-loading and failure recovery

The loader shares one pending/fulfilled attempt. Rejection alone permits Retry.
Ordinary stale generation, binding disconnect, unusable trigger, external
modal appearing during mobile load, route leave, and Platform disposal prevent
mount and clean matching suspension state.

The fresh production manifest records exactly three dynamic imports from the
entry:

- complete ODE route;
- Tutor panel;
- Glossary surface runtime.

The Glossary runtime imports its own CSS and the shared readonly helper.
Readonly math dynamically imports MathLive only when enhancement is required.
DEV route, fixtures, controls, and Playground CSS have no production manifest
entry.

The missing pending-scope replacement invalidation is a release blocker. Retry
itself showed no infinite loop or duplicate-surface issue in the focused tests.

## 13. DEV Playground assessment

The Playground is one route with one fixture registry, one actual framework
binding, and the actual Platform Host. Its ten neutral term IDs and 13 sections
cover:

- short and long definitions;
- long why-it-matters text and long labels;
- formula, replacement formula, formula suppression, and no formula;
- text and mathematical aliases;
- multiple scopes and same-scope duplicates;
- context revisions;
- repeated replacement;
- top/bottom/left/right/center/narrow/scroll placement;
- input-label and table-header composition;
- plain and intentionally unannotated controls;
- six contained strict diagnostics;
- local mock Tutor handoff;
- modal refusal, reset, disposal, and navigation.

The warning is explicit and no production terminology or content-foundation
module is imported. Invalid fixtures remain contained and valid fixtures
continue afterward. Reset disposes before mounting a new session; live
navigation away/back restored a fresh revision-1 state with no surface, inert
region, or duplicated section.

The delayed armed-update work is bounded and cleared. The `events` and
`mockTutorRecords` arrays are not bounded during a single mount, producing the
P3 GLF-REL-003 finding.

## 14. Development controls and About entry

The shortcut implementation and 19 direct tests cover Ctrl+Shift+G,
Meta+Shift+G, `KeyG`, case-insensitive `g`, repeat, Alt, conflicting
Ctrl+Meta, already-prevented events, missing modifiers, input, textarea,
select, contenteditable and descendants, `math-field` and descendants,
same-route refusal, one listener, and idempotent cleanup.

Live development evidence navigated from About to the Playground with
Ctrl+Shift+G. With the fixture input focused, the shortcut did not navigate.
Shadow-DOM keyboard retargeting to the `math-field` host is compatible with the
current filter and its tested descendant contract.

Development About adds exactly one semantic Developer Tools section and one
link to the exact DEV route. Production `aboutPage` has no static DEV import,
floating button, or placeholder. Production preview contained neither the
section nor its route link.

## 15. Production-exclusion evidence

Fresh production evidence established:

- `/` rendered normal Home;
- `/about` had no Developer Tools text or DEV link;
- Ctrl+Shift+G on production About did nothing;
- `/__dev/glossary-playground` rendered in-shell Page Not Found;
- `/ode` rendered normal Numerical ODE with zero Glossary triggers/surfaces;
- the production entry graph excludes registry, scope, surface runtime, DEV
  fixtures, Tutor panel, and MathLive from eager Home;
- production dynamically exposes the surface runtime only as an inert
  first-request boundary;
- the manifest has no DEV keys, imports, dynamic imports, or CSS;
- emitted JS/CSS contained zero matches for all requested DEV markers;
- production core is empty;
- current ODE route omits `getGlossaryBinding`;
- product routes have no visible Glossary behavior.

Markers searched with zero production matches:

```text
Glossary Playground
Developer Tools
Development-only
sample_term
dynamic_term
formula_term
replacement_term
glossaryDevelopmentControls
glossaryPlaygroundRoute
glossaryPlayground.css
```

## 16. Bundle and performance evidence

Fresh exact raw/gzip byte counts:

| Asset | Raw bytes | Gzip bytes |
|---|---:|---:|
| Main JS | 52,536 | 16,236 |
| Main CSS | 9,518 | 2,240 |
| Glossary surface JS | 6,735 | 2,425 |
| Glossary surface CSS | 2,203 | 783 |
| Readonly math JS | 2,080 | 922 |
| Tutor JS | 11,697 | 4,450 |
| Tutor CSS | 3,322 | 1,026 |
| MathLive JS | 825,514 | 228,041 |
| Editable-math JS | 1,144,224 | 308,799 |
| Editable-math CSS | 1,756 | 676 |
| Complete ODE JS | 241,437 | 80,303 |
| Complete ODE CSS | 11,636 | 3,106 |

DEV-only source payload observed in the development route was 55,748 raw source
bytes across the Playground route, fixtures, controls, and Playground CSS.
Those files have zero production emitted bytes.

The accepted Commit 3 record was 51.80 kB raw / 15.95 kB gzip for the main
entry. The current 52.51/16.24 kB result reproduces the documented bounded
increase of approximately 0.71 kB raw / 0.29 kB gzip from the guarded
development/About bootstrap seam. No DEV payload appeared eagerly.

The large MathLive/editable-math warning remains pre-existing, separately
deferred, and unchanged in architectural ownership. No manual chunking or
dependency change is warranted by this review.

## 17. Security and privacy assessment

Framework and DEV source were searched for:

```text
innerHTML
outerHTML
insertAdjacentHTML
eval(
new Function
fetch(
XMLHttpRequest
WebSocket
EventSource
localStorage
sessionStorage
indexedDB
```

The scoped search found:

- test-only fixture setup using `document.body.innerHTML`;
- the existing Tutor panel's controlled, interpolation-free static
  `target.innerHTML` shell;
- `fetch("/api/chat")` in the independently lazy ordinary Tutor client.

Glossary model, registry, scope, controller, Host, surface, and DEV runtime
construct dynamic text with controlled DOM APIs and `textContent`/text nodes.
The Playground mock never imports or invokes the ordinary Tutor client.
Formula output uses the approved readonly path. There is no arbitrary
Markdown/HTML execution, code evaluation, network-capable mock, real Glossary
Tutor request, persistence, Store entry, private reference dependency,
content-foundation runtime import, private path/hash, or route-controlled
execution.

Diagnostics and visible logs are rendered as text. Mock records contain only
fixture sequence/kind/term/module/scope/context fields.

## 18. Accessibility assessment

Strong evidence:

- native text-like buttons and visible focus hooks;
- accessible authored trigger names;
- ARIA ownership only during valid open state in covered active paths;
- label/input/help/error ownership preserved;
- semantic table/header composition;
- one readonly formula accessibility owner;
- complete mobile dialog naming;
- labelled Close action;
- mobile inertness, scroll lock, and focus containment;
- Escape/current-trigger restoration;
- reduced-motion and forced-colors CSS contracts;
- no horizontal overflow at 1440, 768, or 390 widths.

Blocking evidence:

- the pinned-card next-Tab bridge is not consumed once;
- pending replacement can assign ARIA ownership to an obsolete trigger.

Unsupported live modes were not overstated: the selected browser exposed
viewport control but not page zoom, screen-reader output, reduced-motion
emulation, forced-colors emulation, or real touch/coarse/hybrid device input.

## 19. Browser evidence matrix

All controlled top-level navigation used new isolated tabs and
`http://127.0.0.1` only. Local servers were stopped after review.

| Surface | Size | Observed evidence | Result |
|---|---:|---|---|
| DEV Home | 1440 x 900 | Normal Home, no Glossary trigger | PASS |
| DEV About | 1440 x 900 | Exactly one Developer Tools section and exact route link | PASS |
| DEV direct Playground | 1440 x 900 | Warning, ten fixture IDs, 13 sections, neutral content | PASS |
| DEV shortcut | 1440 x 900 | Ctrl+Shift+G navigation; input-focused exclusion | PASS |
| Desktop card | 1440 x 900 | Pin, 360 px placement, no overflow, context update, formula suppression, active replacement, local mock | PASS except one-shot Tab |
| Compact card | 768 x 1024 | Stable controls/labels, long-card internal scroll, visible Close, no overflow | PASS |
| Mobile sheet | 390 x 844 | Named dialog, Close focus, inert/lock, Tab wraps, Escape restore, no overflow | PASS |
| Mobile arbitration | 390 x 844 | External modal refusal, no stacked dialog, no replay | PASS |
| Reset/navigation | 390 x 844 | Fresh revision-1 reset, About navigation, back remount, no stale surface/inert | PASS |
| DEV ODE | 390 x 844 | Normal ODE overview, no binding/trigger | PASS |
| Production Home | 1440 x 900 | Main JS/CSS only plus pre-existing font link | PASS |
| Production About | 1440 x 900 | No DEV section/link; shortcut inert | PASS |
| Production DEV path | 1440 x 900 | Page Not Found, no fixtures | PASS |
| Production ODE | 1440 x 900 | Normal ODE overview, no Glossary trigger/surface | PASS |

Console warning/error logs were empty in development and production preview.
No Tutor/API request was sent.

The page asset inventory reported the pre-existing external Google Fonts
stylesheet declared by `index.html`. No external page was opened and no
external resource was intentionally inspected. The browser surface did not
offer request interception, so this review does not claim that the
pre-existing stylesheet request was programmatically blocked.

## 20. Automated verification

### Focused framework gate

The requested command named three files that do not exist:

- `glossaryModel.test.ts` was mapped to `glossaryBuilders.test.ts`;
- annotation behavior was covered by `glossaryScope.test.ts`,
  `glossaryController.test.ts`, and the Playground route test;
- `src/glossary/readonlyMath.test.ts` was mapped to
  `src/math/ui/readonlyMath.test.ts`.

Result:

```text
22 test files passed
199 tests passed
```

### Full verification

`npm.cmd run verify` passed:

```text
73 test files passed
1,022 tests passed
application typecheck passed
API typecheck passed
production build passed
79 modules transformed
```

An additional `npm.cmd run build -- --manifest` produced the inspectable fresh
manifest. The only build warning was the accepted deferred large-chunk warning.

`git diff --check` and a clean `git status --short` passed before documentation
work.

### Independent runtime proof

Without creating or modifying a tracked test, the current TypeScript modules
were loaded through Vite's in-memory SSR loader under jsdom.

Pinned Tab proof:

```text
firstPrevented = true
firstFocus = "Close"
secondPrevented = true
secondFocus = "Close"
```

Pending replacement proof:

```text
obsoleteTriggerConnected = true
obsoleteTriggerExpanded = "true"
replacementTriggerExpanded = null
mountedSurfaceCount = 1
```

These are failing release evidence even though the committed suites pass.

## 21. Test-quality assessment

Strongest protection:

- builder/registry immutability and validation matrices;
- scope first-occurrence and disposal behavior;
- controller transaction success/conflict/stale transaction tests;
- loader shared attempt/retry/stale generation tests;
- modal exact restoration and stale-lease tests;
- Host timer, modal refusal, abort, placement, context, and lifecycle tests;
- Tutor Host-to-Host regressions for prior P1 defects;
- adapter/bootstrap disposal ordering;
- production source graph and manifest contract tests;
- Playground composition, mobile, diagnostics, reset, and disposal tests;
- readonly formula ownership across Glossary, Tutor, ODE, and Convergence.

Concrete weak spots:

1. `platformGlossaryHost.test.ts` does not combine a deferred loader with a
   committed scope replacement while the obsolete connected trigger remains
   in DOM.
2. The surface test named “bridges only the next forward Tab” asserts the first
   forward Tab and one Shift+Tab, but never asserts a second forward Tab.
3. Playground tests clear logs on reset/disposal but do not establish a
   per-mount cap.

Some source-graph tests are intentionally structural and would not detect
browser geometry. Browser measurements supplemented them. jsdom cannot validate
real custom-element rendering, visual focus, page zoom, or physical touch.

The first two weak spots allowed release-blocking behavior to coexist with a
fully green suite.

## 22. Documentation consistency

Before this review, `PLAN.md` and `docs/INDEX.md` correctly said the full
release review was pending, while `docs/PROJECT_HANDOFF.md` was materially
stale: it still described the final Commit 3 re-audit as the next gate and
Commit 4 as unauthorized. This blocked-review iteration updates only the
minimum status text needed to record the completed review and its blockers.

`ARCHITECTURE.md` accurately describes the implemented components and
production exclusion at a structural level. Its general reference to stale
guards does not claim that every stale path has passed release review, so it is
not modified. The approved design and implementation plan remain historical
authoritative records and are not rewritten after implementation.

The content foundation remains a separate maintainer-review draft and is not
promoted.

## 23. Findings

### GLF-REL-001 - P1 - A replaced scope can retain pending lazy-load authority

- **Location:** `src/app/platformGlossaryHost.ts`,
  `activeIdentityMatches()` around line 91,
  `handleReplacement()` around line 572, and Host-port
  `beginScopeRerender()` around line 655; paired with
  `src/glossary/glossaryController.ts`,
  `beginScopeRerender()` around lines 171-225.
- **Violated requirement:** binding/scope/lazy generations must reject stale
  callbacks; replacement during pending lazy load must be safe; a disposed
  scope must not retain surface authority.
- **Proof:** Host `beginScopeRerender()` inspects only `active`, not `loading`.
  The controller disposes the old scope, builds a replacement, and reports a
  closed result keyed to the replacement scope when no active candidate
  existed. Host loading cleanup compares the old loading scope with that new
  scope, so it does not close. `activeIdentityMatches()` confirms only binding,
  module, and self-consistent request generation; it cannot tell that the
  request's scope has been replaced. The independent deferred-load
  reproduction mounted one surface and set `aria-expanded="true"` on the
  obsolete connected trigger while the replacement trigger had no ownership.
- **Impact:** stale content can mount after its scope has been disposed, with
  ARIA and anchor authority assigned to the wrong occurrence. The framework is
  not safe for future production content under all approved rerender
  lifecycles.
- **Smallest correction:** invalidate/abort loading work for the old scope when
  `beginScopeRerender()` starts, or carry the old scope identity through the
  transaction result so loading cleanup can close it. Add a deferred-loader
  regression proving that a connected obsolete trigger cannot mount after
  commit, abort, disconnect, or later replacement.
- **Blocks framework release:** Yes.
- **Blocks production content:** Yes.
- **Maintainer decision required:** No; this is a contract defect.

### GLF-REL-002 - P2 - The pinned-card Tab bridge is not one-shot

- **Location:** `src/glossary/surface/glossarySurfaceRuntime.ts`,
  `onTriggerTab()` around lines 244-260; insufficient regression in
  `glossarySurfaceRuntime.test.ts` around line 131.
- **Violated requirement:** the next forward Tab after pin enters the card once;
  the bridge is consumed; later forward Tab behavior is natural; Shift+Tab
  remains natural.
- **Proof:** the handler has no consumed flag and calls `preventDefault()` on
  every eligible forward Tab while the trigger is focused. Direct runtime
  reproduction returned `defaultPrevented=true` and focused Close on both the
  first and second forward Tab. The existing test never sends a second forward
  Tab.
- **Impact:** keyboard and assistive-technology users who return focus to the
  trigger are forced back into the card rather than continuing in authored
  document order.
- **Smallest correction:** keep one mounted-surface boolean for bridge
  availability, consume it before the first redirect, and add a regression
  proving the second forward Tab is not prevented while Shift+Tab remains
  untouched.
- **Blocks framework release:** Yes under the substantive-P2 policy.
- **Blocks production content:** Yes.
- **Maintainer decision required:** No; expected behavior is explicit.

### GLF-REL-003 - P3 - DEV event and mock-request logs are unbounded per mount

- **Location:** `src/dev/glossary/glossaryPlaygroundRoute.ts`, arrays around
  lines 199-200 and unconditional pushes around lines 289 and 1132.
- **Violated requirement:** the Playground event/request log is bounded.
- **Proof:** reset and disposal clear the arrays, but no maximum length or
  eviction exists during a long-running mount.
- **Impact:** repeated diagnostic, replacement, context, or mock actions can
  grow DEV-only memory and DOM without bound. Production is unaffected.
- **Smallest correction:** cap each route-local list to a documented small
  maximum, evict oldest entries, retain monotonic sequence labels, and test
  the cap plus reset.
- **Blocks framework release:** No by itself.
- **Blocks production content:** No by itself.
- **Maintainer decision required:** Only for the preferred cap value.

Finding totals:

```text
P0 = 0
P1 = 1
P2 = 1
P3 = 1
```

## 24. Accepted limitations and carry-forwards

These limitations are non-blocking relative to the three concrete findings,
but must be repeated after repair:

- no live screen-reader session;
- no live 200% page zoom;
- no reduced-motion or forced-colors emulation;
- no physical touch/coarse/hybrid device;
- in-app pointer movement did not synthesize the fine-pointer preview event;
- the pre-existing Google Fonts stylesheet remained visible in the browser
  asset inventory because request interception was unavailable.

Source, CSS, deterministic tests, and responsive live evidence reduce these
risks, but do not convert them into unsupported live claims.

## 25. Explicit non-changes

This review makes no change to:

- production runtime source;
- tests or test expectations;
- CSS;
- package or lock files;
- Vite/Vercel/deployment configuration;
- numerical, solver, expression, Convergence, or ODE source;
- `AppSessionStore`, persistence, history, Resume, or meaningful work;
- Tutor API/network behavior;
- the draft content foundation;
- private references;
- production terms, definitions, notation, aliases, annotations, or bindings.

Nothing was fetched, pulled, pushed, deployed, installed, or sent to a remote.
No external account, billing meter, browser history, existing user tab,
credential, clipboard, download, or live Tutor/model request was accessed.

## 26. Release decision

**RELEASE BLOCKED**

Production exclusion is proven and automated verification is green, but those
facts cannot override the independently reproduced P1 stale-scope mount and P2
keyboard-flow defect. The framework must not be marked locally accepted or
complete, and production Glossary content remains unauthorized.

## 27. Next authorized phase

Required repair gate:

> Authorize one narrow runtime repair task to invalidate pending lazy surface
> work when its scope enters replacement, make the pinned-card next-Tab bridge
> one-shot, add focused regressions for both defects, and optionally bound the
> DEV logs. Then rerun the full framework release review from the repair commit.
> Production Glossary content, the ODE vertical slice, and terminology/notation
> integration remain unauthorized until that review passes.
