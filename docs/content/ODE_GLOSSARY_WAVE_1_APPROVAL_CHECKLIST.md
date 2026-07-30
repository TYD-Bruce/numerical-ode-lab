# ODE Glossary Wave 1 Approval Checklist

**Status:** Maintainer checklist; entirely unchecked.

**Date prepared:** 2026-07-29

This checklist accompanies the
[content packet](ODE_GLOSSARY_WAVE_1_CONTENT_PACKET.md) and
[design specification](../superpowers/specs/2026-07-29-ode-glossary-wave-1-design.md).
Checking every box later records review only. It does not authorize
implementation unless the maintainer separately authorizes the relevant E1,
E2, E3, or F2 task.

## 1. Term content

| Stable ID | Preview approved | Definition approved | Formula approved | Accessible formula approved | Misconception approved | Related terms approved | Module note approved | Tutor topic approved |
|---|---|---|---|---|---|---|---|---|
| `ordinary_differential_equation` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `initial_condition` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `initial_value_problem` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `step_size` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `time_grid` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `numerical_approximation` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `exact_solution` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `explicit_scheme` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `forward_euler_method` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `backward_euler_method` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 2. Annotation map

| Annotation | Exact owner confirmed | Visible text confirmed | No nested trigger | Accessible name approved | Mobile behavior approved | Rerender lifecycle approved | Disposal lifecycle approved |
|---|---|---|---|---|---|---|---|
| `ODE-W1-ANN-001` · `ordinary_differential_equation` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-002` · `initial_value_problem` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-003` · `initial_condition` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-004` · `step_size` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-005` · `time_grid` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-006` · `numerical_approximation` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-007` · `exact_solution` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-008` · `explicit_scheme` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-009` · `forward_euler_method` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| `ODE-W1-ANN-010` · `backward_euler_method` | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## 3. Architecture

- [ ] Core/module ownership is approved for all ten cards.
- [ ] Entry, Home, and static routes remain free of eager ODE/Glossary content.
- [ ] The complete ODE Lab owns one stable binding.
- [ ] No Glossary content or surface state enters `AppSessionStore` or an ODE
  session.
- [ ] Every annotation is explicit; no DOM scan or inferred text replacement
  exists.
- [ ] Runtime data contains no private source material or private evidence
  metadata.
- [ ] The recommended path needs no framework change; any selected alternate
  gap has its exact separate approval.

## 4. Rollout

- [ ] E1 content-only scope is approved by a separate implementation
  authorization.
- [ ] E2 binding/annotation scope is approved by a separate implementation
  authorization.
- [ ] E3 integration review is approved as a separate checkpoint.
- [ ] Group F2 remains mandatory after E3.
- [ ] E1/E2/E3/F2 rollback boundaries are approved.

## 5. Pending decision record

The 18 decision cards D01 through D18 in the design specification remain
unselected. Record the maintainer's choices there before changing this
checklist.

## 6. Checked-count declaration

Checked boxes at packet creation: **0**.

Term rows: **10**.

Annotation rows: **10**.

Architecture rows: **7**.

Rollout rows: **5**.

Checklist completion later does not itself authorize implementation. The
maintainer must still explicitly authorize E1, E2, E3, and F2 at their
separate gates.
