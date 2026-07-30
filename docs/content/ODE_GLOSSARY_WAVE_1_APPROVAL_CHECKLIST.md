# ODE Glossary Wave 1 Approval Checklist

**Status:** Maintainer approval recorded; content and Wave 1 design approved;
the generic rich model and E1 are accepted. The E2 runtime contract is
complete and locally implemented pending maintainer acceptance. E3/F2, push,
Preview, and Production remain unauthorized.

**Date prepared:** 2026-07-29

**Maintainer:** Yiding (Bruce) Tian

**Review date:** 2026-07-29

**Approval scope:** ODE Glossary Wave 1 design and content governance

This checklist accompanies the
[content packet](ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md) and
[design specification](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md).
The later schema prerequisite is recorded by the
[rich-model design](../superpowers/specs/2026-07-29-rich-glossary-content-model-design.md),
[field matrix](RICH_GLOSSARY_CONTENT_FIELD_MATRIX.md), and
[design-readiness review](../reviews/2026-07-29-rich-glossary-content-model-design-readiness-review.md).
The executable planning boundary is recorded by the
[rich-model implementation plan](../superpowers/plans/2026-07-29-rich-glossary-content-model-implementation-plan.md)
and
[plan review](../reviews/2026-07-29-rich-glossary-content-model-plan-review.md).
The resulting local implementation evidence is recorded by the
[rich-model implementation review](../reviews/2026-07-29-rich-glossary-content-model-implementation-review.md).
The fresh E1 implementation evidence is recorded by the
[E1 content review](../reviews/2026-07-29-ode-glossary-wave-1-e1-content-review.md).
The exact interaction contract for all ten E2 annotations is the
[E2 Runtime Contract](ODE_GLOSSARY_WAVE_1_E2_RUNTIME_CONTRACT.md).
The local implementation evidence is recorded by the
[E2 integration review](../reviews/2026-07-30-ode-glossary-wave-1-e2-integration-review.md).
Checked content/design/contract boxes record approval only. Unchecked
implementation/execution/deployment boxes require separate maintainer
authorization.

## 1. Term content

| Stable ID | Preview approved | Definition approved | Formula approved | Accessible formula approved | Misconception approved | Related terms approved | Module note approved | Tutor topic approved |
|---|---|---|---|---|---|---|---|---|
| `ordinary_differential_equation` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `initial_condition` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `initial_value_problem` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `step_size` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `time_grid` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `numerical_approximation` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `exact_solution` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `explicit_scheme` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `forward_euler_method` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `backward_euler_method` | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [x] |

## 2. Annotation map

| Annotation | Exact owner confirmed | Visible text confirmed | No nested trigger | Accessible name approved | Mobile behavior approved | Rerender lifecycle approved | Disposal lifecycle approved |
|---|---|---|---|---|---|---|---|
| `ODE-W1-ANN-001` · `ordinary_differential_equation` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-002` · `initial_value_problem` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-003` · `initial_condition` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-004` · `step_size` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-005` · `time_grid` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-006` · `numerical_approximation` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-007` · `exact_solution` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-008` · `explicit_scheme` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-009` · `forward_euler_method` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |
| `ODE-W1-ANN-010` · `backward_euler_method` | [x] | [x] | [x] | [x] | [x] | [x] | [x] |

## 3. Architecture

- [x] Core/module ownership is approved for all ten cards.
- [x] Entry, Home, and static routes remain free of eager ODE/Glossary content.
- [x] The approved E2 design assigns one stable binding to the complete ODE
  Lab.
- [x] No Glossary content or surface state enters `AppSessionStore` or an ODE
  session.
- [x] Every annotation is explicit; no DOM scan or inferred text replacement
  exists.
- [x] Runtime data contains no private source material or private evidence
  metadata.
- [x] The confirmed rich-field schema gap rejects a compact projection; the
  generic model/surface design is the current prerequisite and has a separate
  implementation gate.

## 4. Generic rich-model prerequisite

- [x] Generic rich-model design and repository-grounded plan complete.
- [x] Generic rich-model implementation explicitly authorized and locally
  verified.
- [x] Generic rich-model implementation accepted at
  `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e`.

These prerequisite records did not by themselves authorize E1 content work;
the fresh E1 authorization is recorded separately below.

## 5. Rollout

- [x] E1 boundary/design approved.
- [x] E1 implementation explicitly authorized.
- [x] E1 implementation locally complete and inert.
- [x] E1 implementation accepted at
  `08b80522283438a233974456a026a6dbc2a96746`.
- [x] E2 boundary/design approved.
- [x] E2 runtime contract reconciled by `E2-CONTRACT-01` and
  `E2-CONTRACT-02`.
- [x] E2 source/test implementation freshly reauthorized.
- [x] E2 source/test implementation locally complete and verified.
- [ ] E2 implementation maintainer-accepted.
- [x] E3 mandatory independent review gate approved.
- [ ] E3 execution explicitly authorized.
- [x] Group F2 mandatory review gate approved.
- [ ] Group F2 execution explicitly authorized.
- [x] E1/E2/E3/F2 rollback boundaries approved.
- [x] Release criteria in decision D18 approved.
- [ ] Push explicitly authorized.
- [ ] Preview deployment explicitly authorized.
- [ ] Production deployment explicitly authorized.

## 6. Approved decision record

The 18 decision cards D01 through D18 in the design specification record
maintainer-approved Option A. This approval fixes design and governance. E1 is
separately accepted. E2 source/test implementation was later separately
authorized and is locally complete pending maintainer acceptance. This record
does not authorize E3, F2, push, Preview, or Production action.

## 7. Historical E1 schema-stop and fresh restart record

The first E1 implementation authorization after Group E0 stopped during
repository inspection before any source or test change.
The accepted compact `GlossaryEntry` and module override cannot represent all
maintainer-approved card fields. No E1 content, annotation, binding, or
runtime change was created.

The maintainer selected `E1-SCHEMA-01 = Option 2`: extend the generic model and
complete surface before E1. The compact projection is rejected. The rich-model
design and repository-grounded implementation plan are complete. Their
subsequently authorized content-neutral implementation is locally complete
with point-in-time verdict **RICH GLOSSARY MODEL IMPLEMENTED — READY FOR
MAINTAINER ACCEPTANCE**. The maintainer accepted that generic implementation
at `6ef085d0b0271a5e7ed5a9f64ef4e6a05b5f257e` and separately authorized a
fresh E1 restart.

Fresh E1 now owns exactly two inert Core entries, eight inert ODE entries, two
ODE context-only overrides, and ten composed cards. The production registry
entry count, Core-content production importer count, annotation count, and ODE
binding count remain zero. E1 is accepted at
`08b80522283438a233974456a026a6dbc2a96746`. The separately authorized E2
source/test implementation is locally complete through one complete-IVP
route-instance binding and ten explicit annotations. `/ode` remains plain,
Tutor remains independent, and the generic production registry remains empty.
E2 awaits maintainer acceptance. E3, F2, push, Preview, and Production remain
unauthorized.

`E1-BROWSER-EXCEPTION-01` permits only the unchanged Google Fonts
stylesheet/font chain from `index.html` for the E1 browser evidence. The
starting and current blobs are both
`912cca340efa743ea0d2ceaa2dac7e0234a889bc`. The baseline dependency is
`BASELINE-EXT-FONT-001` (P3, accepted nonblocking carry-forward, owner: future
Platform/asset-policy review). E1 introduced no external traffic.

The same unchanged dependency is the only permitted external chain in the E2
browser gate. No E2-introduced external traffic was observed, and no
remediation was performed.

## 8. Checked-count declaration

Checked approval, prerequisite, authorization, acceptance, contract, and
local-completion boxes: **172**.

Unchecked implementation/execution/deployment boxes: **6**.

Term rows: **10**.

Annotation rows: **10**.

Architecture rows: **7**.

Generic prerequisite rows: **3**.

Rollout rows: **18**.

Checked content/design/contract rows do not authorize later implementation.
The maintainer must accept E2 before a separately authorized E3 review. E3 and
F2 execution, push, Preview deployment, and Production deployment remain
unauthorized.
