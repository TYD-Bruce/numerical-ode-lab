# ODE Glossary Wave 1 E1 Content Review

## 1. Metadata

- Group: `E1 — Inert Rich Content`
- Prepared: 2026-07-29
- Completed: 2026-07-30
- Starting branch: `main`
- Starting HEAD:
  `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`
- Starting commit: `Extend Glossary rich content model`
- Scope: two inert Core cards, eight inert ODE cards, two ODE context-only
  overrides, direct tests, narrow registry-test ownership correction,
  governance, and evidence
- Production activation: excluded
- Push/deployment: excluded

## 2. Maintainer acceptance of the generic prerequisite

The maintainer accepted
`6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e` as the rich-model starting HEAD
for fresh E1 work. The generic runtime types, builders, validation,
composition, scope resolver, complete-card renderer, and surface-local
navigation were therefore treated as established framework contracts rather
than reopened by E1.

## 3. Fresh restart authorization

The maintainer separately authorized a fresh E1 restart against the accepted
rich-model HEAD. The earlier schema-blocked E1 attempt had produced no source
or test changes. This iteration started from the exact accepted HEAD on
`main`, with a clean worktree and no E1 source/test files present.

The later narrow ownership amendment `E1-TEST-OWNERSHIP-01 = APPROVED`
authorized removal of only the obsolete Core-empty assertion and its unused
import from `src/glossary/glossaryRegistry.test.ts`.

## 4. Starting state

The required starting checks established:

- branch `main`;
- HEAD `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`;
- clean worktree;
- production Glossary registry entry count `0`;
- production importer count for Core/ODE Wave 1 content `0`;
- ODE annotation count `0`;
- ODE Glossary binding count `0`;
- no E1 source or test changes.

The starting `index.html` blob was
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`.

## 5. Prior worktree non-reuse

No blocked or abandoned E1 worktree was resumed. The rich content and direct
tests were authored from the clean accepted rich-model HEAD. The later
completion task preserved that already verified, uncommitted E1 worktree; it
did not reset, discard, stash, or recreate it.

## 6. Inertness precondition

Before adding content, the production registry was empty and production had
no importer for either content module. The exact tests were added first and
failed because the two Core entries, eight ODE entries, extension, and
composition did not yet exist. Remaining registry/framework tests, including
the production-empty contracts, continued to pass.

## 7. Exact rich-field mapping

The approved packet fields map to runtime content as follows:

- canonical name to `label`;
- approved alternatives to `aliases`;
- compact preview to `definition`;
- complete explanation to `fullDefinition`;
- intuition to `intuition`;
- significance to `whyItMatters`;
- notation to `formula.latex`, `formula.accessibleText`, and block display;
- boundaries to `assumptionsAndLimits`;
- misconception pair to `misconception.statement` and
  `misconception.correction`;
- prerequisites to `prerequisiteTermIds`;
- live/future links to the discriminated `relatedTerms` and
  `commonlyConfusedTerms` unions;
- ODE-specific note to `moduleNote`;
- approved Tutor teaching prompt to `tutorTopic`.

The two ODE overrides use only fields permitted by the generic extension
contract. They do not redefine stable IDs, canonical labels, aliases,
canonical preview/full definitions, intuition, assumptions, misconceptions,
or Tutor topics.

## 8. Runtime content versus governance

Only approved learner-facing card data required by the rich runtime model was
promoted into source. Source locators, approval state, decision IDs, private
reference paths, annotation design records, planned owners, and rollout
metadata remain in governance documents. Runtime content contains no
functions, DOM nodes, HTML, executable math, evidence metadata, or private
material.

## 9. Core entries

`src/glossary/coreGlossary.ts` exports exactly two deeply frozen entries:

1. `numerical_approximation`
2. `explicit_scheme`

The Core tests directly own their exact canonical labels, aliases, preview and
full definitions, intuition, canonical significance, formulas and accessible
text, assumptions/limits, misconception statement/correction, empty canonical
relationship sets where approved, Tutor topics, plain-data safety, and deep
immutability.

## 10. ODE entries

`src/ode/odeGlossaryContent.ts` exports exactly eight deeply frozen ODE-owned
entries:

1. `ordinary_differential_equation`
2. `initial_condition`
3. `initial_value_problem`
4. `step_size`
5. `time_grid`
6. `exact_solution`
7. `forward_euler_method`
8. `backward_euler_method`

Every rich field is asserted against the approved packet in the direct ODE
content test.

## 11. ODE context-only overrides

The module exports exactly two overrides:

1. `numerical_approximation`
2. `explicit_scheme`

The tests prove that the overrides add only approved ODE context, formula,
prerequisite, relationship, confusion, and module-note fields. Canonical Core
content remains byte-for-byte stable through composition.

## 12. Exact ten-card composition

Composing the two Core entries, eight ODE entries, and ODE extension produces
exactly ten distinct resolved cards. No eleventh card or unresolved live
relationship exists.

Required counts:

| Contract | Count |
|---|---:|
| Core entries | 2 |
| ODE entries | 8 |
| ODE overrides | 2 |
| Composed cards | 10 |
| Production registry entries | 0 |
| Production Core/ODE content importers | 0 |
| Annotations | 0 |
| ODE bindings | 0 |

## 13. Teaching order

The exact composed order is:

1. `ordinary_differential_equation`
2. `initial_condition`
3. `initial_value_problem`
4. `step_size`
5. `time_grid`
6. `numerical_approximation`
7. `exact_solution`
8. `explicit_scheme`
9. `forward_euler_method`
10. `backward_euler_method`

## 14. Formula and accessibility evidence

Every approved formula is stored as display-only LaTeX with a distinct,
human-readable `accessibleText` string. Direct tests compare all ten
normalized formula/accessibility pairs exactly. Cards without a canonical
Core formula receive one only through the approved ODE context override. No
raw mathematical content becomes executable numerical state, and no HTML
renderer is introduced.

## 15. Prerequisites and relationships

The direct composition test proves:

- every live prerequisite and live relation resolves to one of the ten cards;
- no card points to itself;
- prerequisite lists contain no duplicates;
- related/confused lists contain no duplicate live or future keys;
- approved future concepts remain inert labels rather than term IDs;
- composition preserves the approved dependency direction.

## 16. `implicit_scheme`

`implicit_scheme` is not registered, not present as a stable live term ID, and
not resolvable from the ten-card registry. The phrase “implicit scheme”
remains approved future text in Backward Euler/explicit-scheme relationships.
It therefore renders as noninteractive future language only after a later
authorized activation.

## 17. Misconception evidence

Every card owns the exact approved misconception statement and correction.
The tests compare both fields, preventing a partial assertion that would
retain only the warning or only the correction.

## 18. Immutability

Both content arrays, the module extension, all nested formulas,
misconceptions, relationship arrays/objects, and composed resolved cards are
deeply frozen by the generic builders/composer. Direct mutation attempts throw
`TypeError`, and subsequent exact-content comparisons remain unchanged.

## 19. Privacy and safety

Recursive plain-data checks reject functions and DOM nodes and forbid
activation/evidence keys such as annotation, binding, host, injector,
production, source, and source locator. Serialized content contains no HTML,
private-reference path, annotation ID, Host name, binding name, or Tutor
injector name. Formulas remain safe readonly display data.

## 20. Test ownership correction

The only change in `src/glossary/glossaryRegistry.test.ts` is:

- removal of the import:

```ts
import { coreGlossaryEntries } from "./coreGlossary";
```

- removal of the exact obsolete assertion:

```ts
it("exports an empty frozen production core", () => {
  expect(coreGlossaryEntries).toEqual([]);
  expect(Object.isFrozen(coreGlossaryEntries)).toBe(true);
});
```

All duplicate-ID, validation, composition, resolution, fallback, and
production-empty registry tests remain intact. The exact two-entry Core
content contract moved to `src/glossary/coreGlossary.test.ts`. Tests proving
that the actual production registry is empty were not removed or weakened,
and no production registry source changed.

## 21. Focused tests

The final focused source gate ran:

```text
npm.cmd run test:run -- src/glossary/coreGlossary.test.ts
  src/glossary/glossaryBuilders.test.ts
  src/glossary/glossaryRegistry.test.ts
  src/glossary/glossaryController.test.ts
  src/glossary/glossaryScope.test.ts
  src/glossary/glossarySurfaceLoader.test.ts
  src/glossary/surface/glossarySurfaceRuntime.test.ts
  src/glossary/surface/glossaryPlacement.test.ts
  src/ode/odeGlossaryContent.test.ts
  src/app/viteBase.contract.test.ts
```

Result: 10 files and 117 tests passed. All remaining registry tests passed.

## 22. Application and API typechecks

Both required TypeScript gates passed:

- application typecheck: passed;
- API typecheck: passed.

## 23. Full verification

`npm.cmd run verify` passed from the final E1 source state:

- 75 test files;
- 1,087 tests;
- application typecheck;
- API typecheck;
- production build;
- 79 transformed modules.

The only build warning was the accepted deferred large-chunk warning. No test
was skipped, weakened, snapshotted broadly, or tolerance-adjusted.

## 24. Import-graph evidence

Production import inspection found:

- no production import of `src/glossary/coreGlossary.ts`;
- no production import of `src/ode/odeGlossaryContent.ts`;
- no `getGlossaryBinding` owner in ODE;
- no production annotation owner;
- production registry initialization remains empty;
- the existing DEV-only registry path remains the only registry population
  path.

Thus the source modules are importable by their direct tests but absent from
the production dependency graph.

## 25. Artifact evidence

The clean-baseline and final production manifests remain structurally
identical:

| Evidence | Baseline | E1 |
|---|---:|---:|
| Transformed modules | 79 | 79 |
| Manifest entries | 29 | 29 |
| JavaScript chunks | 8 | 8 |
| CSS chunks | 7 | 7 |
| Static import edges | 12 | 12 |
| Dynamic import edges | 5 | 5 |

Key artifacts remained:

- entry `index-CWWlDVVJ.js`: 52,815 raw / 16,275 gzip bytes;
- Glossary surface `glossarySurfaceRuntime-CWJ7fhPp.js`: 10,132 raw /
  3,488 gzip bytes;
- ODE route `initialValueProblemsRoute-BkpcAhjz.js`: 242,024 raw /
  80,273 gzip bytes.

Neither E1 content module appears in the production manifest. Searches found
zero Wave 1 preview-definition, full-definition, rich DEV fixture, or
Playground markers. The pre-existing `exact_solution` identifier remains in
the unchanged ODE artifact; identical chunk identity proves E1 did not add a
new content owner.

## 26. Exact desktop review

The fresh production build was reviewed at exactly `1440 × 900` on `/`,
`/about`, `/ode`, `/ode/initial-value-problems`, and the production
`/__dev/glossary-playground` path.

Evidence:

- no Glossary trigger or surface appeared;
- no horizontal overflow appeared;
- `/about` exposed no Developer Tools entry;
- `/ode` remained static and unannotated;
- the production DEV path rendered Page Not Found with no Playground content;
- browser warning/error logs were empty.

## 27. Exact mobile review

The same fresh production build was reviewed at exactly `390 × 844` across the
same route set.

Evidence:

- no Glossary trigger, popover, or sheet appeared;
- no horizontal overflow or clipped route content appeared;
- `/about` exposed no Developer Tools entry;
- the production DEV path remained Page Not Found;
- browser warning/error logs were empty.

## 28. Interactive production-browser review

On the production-build IVP route, the review selected the unique Forward
Euler method control and ran the simulation. The existing result rendered as
`Forward Euler · results` with final value `0.00377789`. The interaction
created no Glossary trigger/surface and did not change route behavior,
console health, or the external-request boundary.

## 29. Browser evidence exception

`E1-BROWSER-EXCEPTION-01 = APPROVED`.

The E1 browser condition is “no E1-introduced external traffic,” not “no
external traffic.” The accepted baseline is:

- starting HEAD:
  `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`;
- starting `index.html` blob:
  `912cca340efa743ea0d2ceaa2dac7e0234a889bc`;
- current `index.html` blob:
  `912cca340efa743ea0d2ceaa2dac7e0234a889bc`;
- `index.html` is absent from the E1 diff.

Observed normalized external chain:

| Host | Path/resource category | Request type | Initiator | In starting baseline | E1 changed source owner |
|---|---|---|---|---|---|
| `fonts.googleapis.com` | `/css2`, DM Sans and JetBrains Mono family query | stylesheet | unchanged document `<link rel="stylesheet">` in `index.html` | yes | no |
| `fonts.gstatic.com` | versioned `/s/.../*.woff2` resources referenced by the Google stylesheet | font | stylesheet `@font-face` chain | yes | no |

The unchanged document also contains preconnect hints for both permitted
hosts. No other external hostname appeared. No request was initiated by E1
source. The audited totals are:

```text
new external host introduced by E1 = 0
new external request owner introduced by E1 = 0
E1 fetch/XHR/beacon/WebSocket request = 0
```

Accurate conclusion:

> No E1-introduced external traffic was observed. The only external requests
> were the unchanged, pre-existing Google Fonts stylesheet/font chain accepted
> under E1-BROWSER-EXCEPTION-01.

## 30. Baseline carry-forward

`BASELINE-EXT-FONT-001 — P3 — accepted nonblocking carry-forward`

- Owner: future Platform/asset-policy review.
- Scope: unchanged Google Fonts stylesheet and direct font-resource chain.
- Privacy characteristic: the browser may disclose ordinary request metadata,
  including IP address and user agent, to the font provider.
- E1 effect: E1 did not introduce, alter, or require this dependency.
- Correctness: the dependency is not required for Glossary content,
  composition, validation, or inertness.
- Remediation: none in E1; local or system font replacement requires a
  separately authorized decision.

This exception is evidence-specific and does not approve the dependency for
all future releases.

## 31. Closure of prior evidence limitations

The rich-model implementation review's prior browser limitations are closed
for E1 by the exact 1440 × 900 and 390 × 844 production-build review and the
interactive Forward Euler run. The external-traffic wording is narrowed only
by `E1-BROWSER-EXCEPTION-01`; `BASELINE-EXT-FONT-001` remains visible as a
future carry-forward.

## 32. Structural diff and explicit non-changes

Authorized source/test changes are limited to:

- `src/glossary/coreGlossary.ts`;
- `src/glossary/coreGlossary.test.ts`;
- `src/glossary/glossaryRegistry.test.ts`;
- `src/ode/odeGlossaryContent.ts`;
- `src/ode/odeGlossaryContent.test.ts`.

No change was made to runtime types, builders, the production registry, scope,
Glossary surface code, ODE app, Platform, Tutor, Store/session, numerical
methods/contracts, CSS, packages, lockfiles, configuration, API,
`index.html`, deployment, or dependencies. There are no annotations,
bindings, routes, Host changes, session changes, pushes, or deployments.

## 33. Findings

| Severity | Count | Result |
|---|---:|---|
| P0 | 0 | none |
| P1 | 0 | none |
| P2 | 0 | none |
| P3 E1 source defects | 0 | none |
| P3 accepted baseline carry-forwards | 1 | `BASELINE-EXT-FONT-001` |

The carry-forward is not an E1 source defect and is nonblocking for inert
content acceptance.

## 34. Verdict

**E1 RICH CONTENT IMPLEMENTED AND INERT — READY FOR MAINTAINER ACCEPTANCE**

## 35. E2 status and next gate

E2, E3, and F2 remain unauthorized. No annotation, ODE binding, surface copy,
or production activation may begin from this review.

E1 has been freshly implemented from the accepted rich-model HEAD and locally
verified as complete inert content. All ten approved rich cards exist in
source, but no production Glossary behavior is visible. The pre-existing
Google Fonts request chain was accepted only as a narrowly documented browser
evidence exception; E1 introduced no external traffic. E2 remains
unauthorized. The next gate is maintainer acceptance of the E1 commit and its
evidence package before any annotation or ODE binding work begins.
