# ODE Glossary Wave 1 Approval Checklist

**Status:** Maintainer approval recorded; content and Wave 1 design approved;
the E1 attempt stopped incomplete at a confirmed schema mismatch; the generic
rich-model design is complete; implementation and deployment remain
unauthorized.

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
Checked content/design boxes record approval only. Unchecked
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

## 4. Rollout

- [x] E1 boundary/design approved.
- [ ] E1 implementation explicitly authorized.
- [x] E2 boundary/design approved.
- [ ] E2 implementation explicitly authorized.
- [x] E3 mandatory independent review gate approved.
- [ ] E3 execution explicitly authorized.
- [x] Group F2 mandatory review gate approved.
- [ ] Group F2 execution explicitly authorized.
- [x] E1/E2/E3/F2 rollback boundaries approved.
- [x] Release criteria in decision D18 approved.
- [ ] Push explicitly authorized.
- [ ] Preview deployment explicitly authorized.
- [ ] Production deployment explicitly authorized.

## 5. Approved decision record

The 18 decision cards D01 through D18 in the design specification record
maintainer-approved Option A. This approval fixes design and governance only;
it does not authorize E1, E2, E3, F2, push, Preview, or Production action.

## 6. E1 schema-stop record

E1 implementation was authorized after the original Group E0 approval, but
repository inspection stopped the attempt before any source or test change.
The accepted compact `GlossaryEntry` and module override cannot represent all
maintainer-approved card fields. No E1 content, annotation, binding, or
runtime change was created.

The maintainer selected `E1-SCHEMA-01 = Option 2`: extend the generic model and
complete surface before E1. The compact projection is rejected. The rich-model
design is complete, but its implementation requires separate authorization
and independent acceptance. E1 remains incomplete and must restart from the
beginning after that acceptance. The unchecked E1 authorization box above is
not converted into implementation acceptance and is not rechecked by this
design task. E2, E3, F2, push, Preview, and Production remain unauthorized.

## 7. Checked-count declaration

Checked content/design boxes after approval: **163**.

Unchecked implementation/execution/deployment boxes after approval: **7**.

Term rows: **10**.

Annotation rows: **10**.

Architecture rows: **7**.

Rollout rows: **13**.

Checked content/design rows do not authorize implementation. The maintainer
must still explicitly authorize the rich-model implementation, an E1 restart,
E2, E3, and F2 at their separate gates; push, Preview deployment, and
Production deployment also remain separately unauthorized.
