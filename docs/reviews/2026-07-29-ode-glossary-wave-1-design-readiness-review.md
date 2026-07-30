# ODE Glossary Wave 1 Design and Content Approval Review

## 1. Metadata

| Field | Value |
|---|---|
| Date | 2026-07-29 |
| Task | Record Group E0 maintainer approval for ODE Glossary Wave 1 |
| Starting branch | `main` |
| Starting HEAD | `535a742dd1d2b0a8cb309b01fe287253cd74eecc` |
| Accepted prerequisites | `55db8e717c517f90d08911e4324c77c50c3d854f`; `23f0ca817e136b5ed75b4c8324b9a85139aae2be`; `535a742dd1d2b0a8cb309b01fe287253cd74eecc` |
| Maintainer | Yiding (Bruce) Tian |
| Approval scope | ODE Glossary Wave 1 design and content governance |
| Review type | Documentation-only approval record |
| Runtime impact | None |
| Production content impact | None |
| Remote/deployment impact | None |

**Current reconciliation note (2026-07-30):** This review's original verdict
is preserved as point-in-time Group E0 evidence. E1 is now accepted at
`08b80522283438a233974456a026a6dbc2a96746`. The
[E2 Runtime Contract](../content/ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md)
is the sole implementation authority for E2 interaction details. E2 source
implementation is incomplete and requires fresh maintainer reauthorization.

## 2. Reviewed packet

- [ODE Glossary Wave 1 Content Packet](../content/ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md)
- [ODE Glossary Wave 1 Approval Checklist](../content/ODE_GLOSSARY_WAVE_1_APPROVAL_CHECKLIST.md)
- [ODE Glossary Wave 1 Design](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md)
- approved Project Language Standard v1 documents;
- reconciled 197-ID Glossary Catalog and 55-record copy audit;
- accepted pre-Glossary consistency and repair reviews;
- accepted Glossary framework design, final review, current contracts, and
  direct tests;
- current ODE route, Method/Data/Output render owners, lifecycle, and lazy
  boundaries.

## 3. Content completeness

PASS.

The packet contains exactly ten cards and no eleventh stable ID. Every card
has all 29 required fields: identity, language, scope, dependencies,
confusions, preview, full definition, intuition, current-Lab relevance,
formula/accessibility, limits, misconception, module/Tutor notes, annotations,
runtime/content ownership, evidence, recommendation, and recorded maintainer
approval fields.

The refined cards start from the catalog's existing rich drafts. All ten are
`APPROVED_WITH_REVISIONS` with the exact maintainer wording recorded in the
content packet. They remain documentation governance and do not claim runtime
authority.

## 4. Mathematical consistency

PASS.

- ODE uses the current scalar first-order form
  \(y'(t)=f(t,y(t))\) and distinguishes equation, solution, PDE, and systems.
- IVP combines the equation with \(y(t_0)=y_0\) and makes no unconditional
  existence or uniqueness claim.
- Initial condition identifies both \(t_0\) and \(y_0\).
- Time-step size uses \(h=t_{n+1}-t_n>0\), fixed-grid alignment, and no
  automatic-accuracy guarantee.
- Time grid uses \(t_n=t_0+nh\), distinguishes \(N\) steps from \(N+1\)
  stored points, and makes no adaptive-grid claim.
- Numerical approximation uses \(u_n\approx y(t_n)\) and separates exact
  value, error, and residual.
- Exact solution must satisfy the full IVP; the current consistency check is
  numerical evidence, not proof.
- Explicit scheme is separated from accuracy, stability, and an explicit exact
  formula.
- Forward Euler uses the released update, theoretical order 1 under the usual
  assumptions, and qualified stability language.
- Backward Euler uses the released implicit update, theoretical order 1 under
  the usual assumptions, A-stability only for the scalar test equation, and
  separates accuracy, absolute stability, and nonlinear iteration.

No solver coefficient, tolerance, grid rule, classification, or numerical
behavior is changed.

## 5. Teaching Voice consistency

PASS.

Each preview is one plain sentence. Each full definition begins with the
direct meaning and adds only distinctions that prevent real misunderstanding.
Intuition follows the definition rather than replacing it. “Why it matters”
text is tied to implemented IVP behavior. Claims use bounded language and do
not advertise unsupported ODE systems, adaptive grids, proof, or guaranteed
improvement.

## 6. Stable-ID and prerequisite consistency

PASS.

All ten IDs exist in the 197-term catalog and are assigned to
`WAVE_1_CURRENT_ODE`. There are no duplicates, renamed IDs, or new IDs.

The review order changes only to respect the catalog dependency
`ordinary_differential_equation + initial_condition ->
initial_value_problem`. `time_grid` follows `step_size`; computed \(u_n\)
follows the grid; Forward Euler follows `explicit_scheme`.

Approved Option A keeps the missing standalone `implicit_scheme` card
explicitly documented as non-clickable future related text. It is not a live
prerequisite or link.

## 7. `implicit_scheme` decision

APPROVED — OPTION A.

Option A retains ten terms and makes Backward Euler self-contained. Option B
expands to eleven and requires a new catalog/content/annotation/validation
scope. Option C removes Backward Euler and changes the exact set.

The maintainer selected Option A because it is mathematically complete without
inventing a broken related-term control.

## 8. Annotation precision

PASS.

The map contains exactly ten records and all 21 required fields. Every record
names a real current route file and owner:

- `DEFAULT_LEDE` / `mountOdeApp.render`;
- `mountOdeApp.renderChoosePanel`;
- `mountOdeApp.renderForm`;
- `mountOdeApp.renderCompareForm`;
- `mountOdeApp.mountResults`.

Existing visible strings are identified separately from exact new companion
copy. New copy is not described as current behavior. The map records exact
trigger text, surrounding context, surface, scope, responsive behavior,
accessible name, keyboard behavior, rerender/disposal behavior, result
survival, MathLive exclusion, duplicate policy, dependency, and approved
status.

## 9. Annotation density

PASS.

The approved distribution is two Lab-context, one Method, six Data, and one
Output annotations. One card has one primary annotation. Repeated mentions
remain plain text under first-occurrence-per-scope policy.

Rejected targets are explicit:

- static `/ode`;
- the linked breadcrumb;
- method-card buttons;
- native-label interiors;
- editable MathLive and raw formula tokens;
- chart canvas content;
- raw table/numeric cells;
- diagnostics and errors;
- Tutor transcript/API content.

The packet also records the under-annotation cost: `/ode` stays inert and
Forward/Backward cards appear only after method selection.

## 10. Core/module ownership

PASS.

The approved split is two reusable core entries
(`numerical_approximation`, `explicit_scheme`) and eight ODE entries. ODE
context uses the current module-override fields rather than duplicating core
authority.

`step_size` and `exact_solution` were evaluated and kept ODE-owned because
their required Wave 1 card meanings are explicitly temporal/IVP-specific.
This avoids claiming cross-module reuse before future module review.

## 11. Lazy-loading safety

PASS AS A DESIGN.

E1 data remains unreferenced and therefore absent from the entry, static, and
ODE runtime graphs. E2 imports the composition only from `src/ode/odeApp.ts`,
which is already inside the dynamic complete-Lab boundary. The existing Host
remains the only eager Glossary coordinator; the surface runtime remains
dynamic until first open; readonly MathLive remains deferred; Tutor remains
independently deferred.

Future E1/E2 must prove this with source graph, production manifest/Rollup
graph, emitted marker, and browser Network evidence. No current build claim is
made from documentation alone.

## 12. Lifecycle safety

PASS AS A DESIGN.

One binding is created per ODE mount. Four explicit scopes participate in an
all-or-abort render transaction. No DOM scan finds replacements. Exact
same-scope/same-term transfers are delegated to the accepted framework.

The accepted route order remains:

```text
Host close
-> Host disconnect
-> session capture
-> Tutor disconnect
-> Lab disposal
-> binding/scope/trigger disposal
-> route DOM clear
```

Glossary state remains transient and outside Lab/Store/history/Resume state.
New experiment uses normal rerender behavior and creates no separate Glossary
reset or persistence path.

## 13. Accessibility

PASS AS A DESIGN WITH FUTURE BROWSER GATES.

The map creates no nested interactive controls. Form input labels remain
independent from sibling term buttons. Method selection cards remain intact
native buttons. Editable math is excluded. Trigger names are visible text,
keyboard activation is native, and mobile behavior uses the already accepted
single modal environment.

E2 still requires DOM relationship tests and desktop/mobile browser evidence.
E3 and F2 must repeat focus, dismissal, modal, overflow, and cross-surface
checks. No live screen-reader or physical-touch evidence is claimed here.

## 14. Tutor boundary

PASS.

The current Host can accept a generic Tutor handoff, but the production Lab
adapter supplies none. Approved Option A therefore retains Tutor-topic
metadata while injecting no handoff and showing no Ask action. It adds no
request, queue, card, transcript item, schema, API, session, or automatic
behavior.

A later explicit handoff or queue design is a separate product decision. This
packet does not treat the development mock as production capability.

## 15. Implementation split and rollback

PASS.

- E1 is pure reviewed data and validation, with no route import or visibility.
- E2 is exact ODE composition, ten annotations, binding, and focused
  integration.
- E3 is a mandatory independent review of committed E1+E2 state and
  introduces no feature or content changes.
- F2 is a later mandatory cross-surface consistency review.

E1 can be reverted without visible behavior. E2 can be reverted while leaving
E1 inert. A blocked E3 can hold or roll back E2. F2 findings map back to
focused E1/E2 corrections. No monolithic Group E commit is authorized.

## 16. Framework-gap result

PASS FOR THE APPROVED PATH.

No framework modification is required for complete-Lab Wave 1.

Two exact optional gaps are documented:

1. `/ode` is a static route and has no Lab-owned binding lifecycle.
2. A production Ask the Tutor action lacks an approved handoff injector.

The approved path excludes both. Selecting either alternate requires a
separate maintainer-authorized design; neither is silently folded into E2.

## 17. Private-source and copyright safety

PASS.

The packet is original project-authored paraphrase based on tracked approved
standards, catalog drafts, current source, contracts, and reviews. It contains
no private path, basename, hash, manifest, screenshot, extraction, or
substantial quotation. Runtime design includes no evidence metadata or private
dependency.

## 18. Approved decisions

All 18 design cards record maintainer-approved Option A:

1. exact set;
2. `implicit_scheme`;
3. teaching order;
4. core/ODE ownership;
5. override policy;
6. density;
7. repeats;
8. `/ode`;
9. Method;
10. Data;
11. Output;
12. editable MathLive;
13. Tutor;
14. E1;
15. E2;
16. E3;
17. F2;
18. activation criteria.

The checklist has 163 checked content/design boxes and seven unchecked
implementation, execution, push, and deployment boxes. No architecture,
annotation, Tutor, content-governance, or rollout-design decision remains
pending.

## 19. Implementation readiness

At this review checkpoint, the design, ten term cards, exact ownership,
companion copy, ten annotation records, and staged rollout policy were
approved, while E1 implementation still required a separate maintainer
decision.

Current status: E1 is accepted. The reconciled E2 runtime contract is complete,
but E2 source/test implementation requires fresh maintainer reauthorization.
E3 requires completed E2. F2 remains separate and mandatory.

## 20. Explicit non-changes

This design iteration changes no:

- runtime TypeScript, API, test, CSS, package, lockfile, config, or deployment
  file;
- production Glossary entry, formula record, annotation, alias, binding,
  trigger, surface, or content;
- framework model, registry, scope, Host, surface, loader, modal, focus, or
  lifecycle behavior;
- ODE method, grid, result, chart, session, Store, Router, Tutor, API,
  persistence, meaningful-work, Resume, or beforeunload behavior;
- private reference;
- branch, remote, Preview, Production, push, or deployment state.

## 21. Local validation result

PASS.

- Final approval aggregate validator: 52 of 52 checks passed.
- Catalog registry: 197 of 197 IDs parsed uniquely; all ten approved Wave 1
  IDs are present.
- Packet: ten 29-field cards approved with revisions and ten approved 21-field
  annotations.
- Design: eighteen complete Option A decision cards and the complete exact
  annotation map.
- Checklist: 163 checked content/design boxes and seven unchecked
  implementation/execution/deployment boxes.
- Current-source ownership: every named annotation file and owner resolved.
- All 132 relative Markdown links, privacy markers, status consistency,
  authorized tracked paths, and ignored-artifact checks passed.
- The other 187 catalog registry rows are byte-identical to starting HEAD.
- `git diff --check` passed.
- No npm, typecheck, build, browser, bundle, deployment, remote, or external
  check was required or claimed for this documentation-only packet.

## 22. Verdict

## DESIGN AND CONTENT APPROVED — E1 AUTHORIZATION REQUIRED

The content, annotation, ownership, lifecycle, accessibility, lazy-loading,
Tutor, rollout, validation, and rollback design was approved at this
point-in-time checkpoint. No production entry, annotation, binding, or Tutor
integration existed.

## 23. E2 runtime-contract reconciliation

PASS.

`E2-CONTRACT-01` fixes the Method helper as:

> Explicit scheme: the next numerical approximation is computed directly from
> quantities already known before the update.

Only `Explicit scheme` is interactive. The colon and trailing explanation are
plain text in one noninteractive helper above the method grid and outside
every method-selection button.

`E2-CONTRACT-02` supersedes the old D11 Single/Compare owner-transfer sentence.
`ODE-W1-ANN-006` belongs only to the successful Single summary label `Final
numerical approximation`. Compare Output remains plain and creates no trigger
for that record.

The source-grounded audit in the E2 Runtime Contract covers all ten records and
confirms ten exact mappings, owners, trigger texts, state/mode contracts,
lifecycle contracts, and direct test owners, with no unresolved copy, owner,
or active policy conflict. Existing `mountOdeApp` render owners and the
optional route binding/Host lifecycle are sufficient; no generic framework
change is required.

E2 source implementation remains incomplete and requires fresh maintainer
reauthorization. E3 and Group F2 execution, push, Preview, and Production
remain unauthorized.

## E2 RUNTIME CONTRACT COMPLETE — IMPLEMENTATION REAUTHORIZATION REQUIRED
