# Numerical T-Lab Project Language v1 Approval Checklist

Status: Completed maintainer approval record.

Yiding (Bruce) Tian completed this checklist on 2026-07-28. Approval records
content-governance choices only. It does not modify runtime behavior, product
copy, tests, numerical contracts, or production Glossary content.

## 1. Preconditions

- [x] The
  [Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md) was reviewed in
  dependency order.
- [x] Exactly nine decision forms contain an explicit maintainer choice.
- [x] No decision is split across incompatible options.
- [x] Module-specific exceptions are narrow and explicit.
- [x] Source priority informed the choices without substituting for
  mathematical judgment.
- [x] Numerical contracts and current solver behavior remain unchanged.
- [x] Production Glossary content and an ODE Glossary binding remain
  unauthorized.

## 2. Nine-decision sign-off

| Order | Decision ID | Selected choice | Binding rule recorded | Exception or boundary | Maintainer | Date |
|---:|---|---|---|---|---|---|
| 1 | `signed_error_orientation` | Option A | \(e_n=u_n-y(t_n)\) | Aggregate metrics remain absolute | Yiding (Bruce) Tian | 2026-07-28 |
| 2 | `global_error_scope` | Option A | Propagated nodal-error family; scalars named | No “total error”; PDE norms stay module-specific | Yiding (Bruce) Tian | 2026-07-28 |
| 3 | `local_truncation_scaling` | Option A | Unscaled LTE \(O(h^{p+1})\); normalized defect \(O(h^p)\) | PDE spatial truncation remains module-specific | Yiding (Bruce) Tian | 2026-07-28 |
| 4 | `observed_order_reliability` | Option A | Metric, pair, value, and status travel together | Only reliable values drive the summary | Yiding (Bruce) Tian | 2026-07-28 |
| 5 | `a_stability_boundary` | Custom Option AB | \(z\), \(R\), \(\mathcal S\), closed half-plane | Qualify symbols by method when needed | Yiding (Bruce) Tian | 2026-07-28 |
| 6 | `stiffness_definition` | Option A | Fast/slow behavior plus stability restriction | Plain-first teaching modifier is binding | Yiding (Bruce) Tian | 2026-07-28 |
| 7 | `relative_error_denominator` | Option A | Nonzero reference magnitude | Unavailable at zero; separately name scaled metrics | Yiding (Bruce) Tian | 2026-07-28 |
| 8 | `tolerance_scopes` | Option A | Name algorithm and controlled quantity | Adaptive error-control remains future | Yiding (Bruce) Tian | 2026-07-28 |
| 9 | `matrix_vector_typography` | Option A | Plain italic; case, dimensions, and prose | Accessibility never relies on typography alone | Yiding (Bruce) Tian | 2026-07-28 |

- [x] Every selected choice matches its completed decision card.
- [x] The custom A-stability choice is recorded as Custom Option AB rather
  than silently recast as a packet recommendation.
- [x] No decision is deferred.

## 3. Cross-decision consistency

- [x] The signed-error orientation and global-error rule are compatible.
- [x] Final-time and maximum global errors remain absolute, separately named
  metrics.
- [x] Local-truncation order matches its normalization.
- [x] Observed-order language names the error metric and preserves the released
  reliability status.
- [x] A-stability uses the closed nonpositive half-plane and an explicitly
  defined \(\mathcal S\).
- [x] Stiffness is not equated with implicitness or reduced to A-stability.
- [x] Relative-error zero behavior does not silently change the denominator.
- [x] Tolerance labels name the controlled quantity and algorithm.
- [x] Vector/matrix formulas and accessible text use the same object-type
  policy.
- [x] Error/residual, conditioning/stability, ODE/PDE spacing, and LU/PLU
  distinctions remain intact.
- [x] The documented incompatible signed-error combination was not adopted.

## 4. Standards promotion

- [x] Only affected terminology rows were changed.
- [x] All 18 formerly blocked terminology rows were resolved without changing
  stable term IDs.
- [x] Accepted aliases, avoided wording, and context boundaries were promoted.
- [x] Unrelated draft, future, deferred, and out-of-scope terminology rows
  retain their readiness status.
- [x] Signed/global error, LTE, observed order, stability, relative error,
  tolerance, and typography rules appear in the notation standard.
- [x] Released final-time and maximum-global-error formulas remain unchanged.
- [x] The teaching standard contains the binding plain-language principle and
  the preferred plain core → why → formula → limits/confusions sequence.
- [x] Preferred and avoided teaching examples cover all nine decisions.
- [x] The three standards are labeled maintainer-approved Version 1 without
  claiming runtime implementation.

## 5. Deferred reconciliation boundary

- [x] `GLOSSARY_CATALOG.md` is intentionally unchanged in this commit.
- [x] Its draft rows may temporarily retain pre-approval decision statuses
  until the next documentation-only reconciliation.
- [x] No draft catalog row was converted into runtime registry data.
- [x] Production Glossary Wave 1 still requires a separate content plan and
  authorization.
- [x] `PROJECT_COPY_AUDIT.md` is intentionally unchanged in this commit.
- [x] No `COPY-*` record was marked ready and no source copy was changed.
- [x] The next phase will reconcile the catalog and copy audit against the
  approved standards before any implementation task.

## 6. Runtime-content authorization boundary

- [x] This approval is documentation-only.
- [x] No runtime registry entry, ODE annotation, or Glossary binding is
  authorized.
- [x] No Tutor prompt, response, queue, Keep/Replace, or model behavior is
  authorized.
- [x] No Platform, IVP, Convergence, preset, method-card, or other product copy
  change is authorized.
- [x] No solver, grid, error metric, tolerance, classification, or numerical
  contract change is authorized.
- [x] No persistence, Store, package, configuration, deployment, push, remote
  contact, or external access is authorized.

## 7. Validation

- [x] Exactly nine approved decision records are present and none is deferred.
- [x] All affected term IDs and notation rules resolve to tracked records.
- [x] Cross-document relative links resolve.
- [x] No private path, basename, hash, screenshot, raw extraction, or
  substantial private quotation appears in the tracked diff.
- [x] No approved decision is described as implemented runtime behavior.
- [x] Standards and teaching voice are approved; the unchanged catalog and copy
  audit are explicitly identified as pending reconciliation.
- [x] `git diff --check` passes.
- [x] The diff contains only files authorized by the standards-promotion task.
- [x] Documentation-only validation makes no browser, build, test-suite, or
  deployment claim.

## 8. Approval metadata

```text
Approval scope: Documentation governance — Numerical T-Lab project language v1
Approved decision IDs: signed_error_orientation, global_error_scope,
  local_truncation_scaling, observed_order_reliability, a_stability_boundary,
  stiffness_definition, relative_error_denominator, tolerance_scopes,
  matrix_vector_typography
Deferred decision IDs: none
Module-specific exceptions: PDE truncation and norms remain module-specific;
  adaptive error-control tolerance remains future; method stability symbols
  are qualified when needed
Maintainer: Yiding (Bruce) Tian
Review date: 2026-07-28
Starting commit: 15eeb427fc42ae378db7dc696ac3047fdcc0b84d
Standards-promotion commit: pending this commit
Notes: No runtime or production Glossary content authorized
```

- [x] The metadata names the exact starting commit reviewed.
- [x] No decision is deferred.
- [x] The approval record contains no private-source path or hash.

## 9. Next phase

The next task is a documentation-only reconciliation of
`GLOSSARY_CATALOG.md` and `PROJECT_COPY_AUDIT.md` against the approved Version 1
standards. Platform, IVP, Convergence, Tutor, and production Glossary changes
remain separate future tasks, each requiring its own scope, tests,
numerical-non-change checks, commit boundary, and review gate.
