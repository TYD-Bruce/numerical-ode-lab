# Numerical T-Lab Project Language Approval Checklist

Status: Maintainer sign-off template; no decision is approved by this file.

Approval records content-governance choices only. Completing this checklist
does not modify runtime behavior, product copy, tests, numerical contracts, or
production Glossary content. Every implementation or copy change requires a
separate authorized task and commit.

## 1. Preconditions

- [ ] The
  [Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md) has been reviewed
  in dependency order.
- [ ] Exactly nine decision forms contain an explicit maintainer choice.
- [ ] No decision remains internally split across incompatible options.
- [ ] Module-specific exceptions are written narrowly.
- [ ] Source priority was considered without treating majority vote as
  mathematical proof.
- [ ] Numerical contracts and current solver behavior remain unchanged.
- [ ] Production Glossary content and an ODE Glossary binding remain
  unauthorized.

## 2. Nine-decision sign-off table

| Order | Decision ID | Selected option or Defer | Preferred term/notation recorded | Exceptions recorded | Maintainer initials | Date |
|---:|---|---|---|---|---|---|
| 1 | `signed_error_orientation` |  |  |  |  |  |
| 2 | `global_error_scope` |  |  |  |  |  |
| 3 | `local_truncation_scaling` |  |  |  |  |  |
| 4 | `observed_order_reliability` |  |  |  |  |  |
| 5 | `a_stability_boundary` |  |  |  |  |  |
| 6 | `stiffness_definition` |  |  |  |  |  |
| 7 | `relative_error_denominator` |  |  |  |  |  |
| 8 | `tolerance_scopes` |  |  |  |  |  |
| 9 | `matrix_vector_typography` |  |  |  |  |  |

- [ ] Every selected option matches the corresponding completed card.
- [ ] No checkbox was treated as selected merely because it is the Codex
  recommendation.
- [ ] Every Defer choice states which publication or implementation gates it
  blocks.

## 3. Cross-decision consistency check

- [ ] A chosen signed-error orientation is compatible with the global-error
  formula.
- [ ] Final-time and maximum global errors remain absolute, separately named
  metrics.
- [ ] Local truncation order matches the chosen normalization.
- [ ] Observed-order copy names its error metric and preserves reliability
  status.
- [ ] A-stability boundary wording matches the chosen region definition.
- [ ] The stiffness definition does not equate stiffness with implicitness.
- [ ] Relative-error zero behavior does not silently change the denominator.
- [ ] Tolerance labels name the controlled quantity and algorithm.
- [ ] Vector/matrix formulas and accessible text use the same object-type
  policy.
- [ ] Already-aligned distinctions - error/residual,
  conditioning/stability, ODE/PDE spacing, and LU/PLU - remain intact.
- [ ] The incompatible combination documented in the packet was not adopted.

## 4. Terminology-standard promotion checklist

- [ ] Update only affected rows in
  `docs/content/NUMERICAL_TERMINOLOGY_STANDARD.md`.
- [ ] Replace `DECISION_REQUIRED` only where the recorded choice fully resolves
  the affected term.
- [ ] Preserve stable term IDs and accepted aliases.
- [ ] Add avoided wording and module-specific context rules from the approved
  cards.
- [ ] Keep unrelated draft, deferred, future, and out-of-scope rows unchanged.
- [ ] Mark the standard's new lifecycle status precisely; do not call runtime
  content implemented.

## 5. Notation-standard promotion checklist

- [ ] Apply the selected signed-error orientation.
- [ ] Apply the selected global-error object and aggregate symbols.
- [ ] Apply the selected local-truncation normalization.
- [ ] Apply the selected observed-order and asymptotic-region policy.
- [ ] Apply the selected stability-function, region, and half-plane rule.
- [ ] Apply the selected scalar/vector/matrix typography.
- [ ] Keep released final-time and maximum-global-error formulas unchanged
  unless a separately approved numerical-contract task exists.
- [ ] Keep source-code identifiers outside the display-notation contract.

## 6. Teaching-voice promotion checklist

- [ ] Add preferred and avoided examples from each approved card.
- [ ] Keep exact, approximate, theoretical, observed, and heuristic claims
  distinct.
- [ ] Keep residual and solution error distinct.
- [ ] Use qualified stability and tolerance language.
- [ ] Ensure compact UI labels have longer accessible explanations where
  needed.
- [ ] Keep Tutor language evidence-bounded and free of automatic guarantees.

## 7. Glossary-catalog promotion checklist

- [ ] Promote only term rows whose governing decisions are approved.
- [ ] Keep every production candidate tied to a stable term ID and explicit
  scope.
- [ ] Reconcile formulas, aliases, related terms, misconceptions, and
  prerequisites against the promoted standards.
- [ ] Do not convert draft rows directly into runtime registry data.
- [ ] Do not add unreviewed production definitions, notation profiles, or
  source-audit runtime.
- [ ] Require a separate Production Glossary Wave 1 content plan and
  authorization.

## 8. Project-copy audit reconciliation

- [ ] Map each approved rule to the affected `COPY-*` records.
- [ ] Mark recommendations ready only when every governing decision is
  approved.
- [ ] Re-scan current source at the implementation starting commit.
- [ ] Separate Platform/overview, IVP, Convergence, Tutor, and Glossary copy
  into coherent reviewable commits.
- [ ] Update expected-copy tests only with the corresponding approved copy
  change.
- [ ] Preserve current numerical classifications, tolerances, and solver
  metadata.

## 9. Runtime-content authorization boundary

- [ ] This approval is understood to be documentation-only.
- [ ] No runtime registry entry is authorized by this checklist.
- [ ] No ODE annotation or Glossary binding is authorized.
- [ ] No Tutor prompt, response, queue, Keep/Replace, or model behavior is
  authorized.
- [ ] No Platform, IVP, Convergence, or method-card copy change is authorized.
- [ ] No solver, grid, error metric, tolerance, classification, or numerical
  contract change is authorized.
- [ ] No persistence, Store, package, configuration, deployment, push, or
  external access is authorized.

## 10. Required validation

- [ ] Exactly nine approved/deferred decision records are present.
- [ ] All affected term IDs and notation rules resolve to tracked records.
- [ ] Cross-document links resolve.
- [ ] No private path, basename, hash, screenshot, raw extraction, or long
  quotation appears in tracked files.
- [ ] No decision is described as runtime behavior.
- [ ] Standards, catalog, and voice statuses agree.
- [ ] `git diff --check` passes.
- [ ] The diff contains only files authorized by the standards-promotion task.
- [ ] Verification is proportional to the later touched files; documentation
  approval alone does not claim browser or runtime evidence.

## 11. Approval metadata

```text
Approval scope:
Approved decision IDs:
Deferred decision IDs:
Module-specific exceptions:
Maintainer:
Review date:
Starting commit:
Standards-promotion commit:
Notes:
```

- [ ] The metadata names the exact repository commit reviewed.
- [ ] Any deferred decision has an explicit blocked gate and follow-up owner.
- [ ] The approval record does not contain private-source paths or hashes.

## 12. Next implementation commits

After the separate standards-promotion commit is accepted, prepare explicit
tasks in this order:

1. Glossary-catalog and copy-audit reconciliation, documentation only.
2. Platform and overview copy.
3. IVP Method/Data/Output and preset copy.
4. Convergence labels, explanations, and focused tests.
5. Tutor language, grounding expectations, and focused tests.
6. Production Glossary Wave 1 design/content integration.
7. Future Linear Algebra/PDE notation work only when the owning module design
   authorizes it.

Each task must define its own scope, tests, numerical non-changes, browser
evidence where applicable, commit boundary, and review gate. Nothing in this
checklist authorizes those commits automatically.
