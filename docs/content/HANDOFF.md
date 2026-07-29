# Numerical T-Lab Project Language v1 Handoff

Status: Project Language Standard v1 approved; Glossary catalog, copy audit,
implementation groups, and traceability reconciled.

Runtime/content implementation tracked separately.

## 1. Iteration boundary

Yiding (Bruce) Tian approved all nine project-language decisions on
2026-07-28. The first documentation-only iteration promoted:

- [Numerical T-Lab Terminology Standard v1](NUMERICAL_TERMINOLOGY_STANDARD.md);
- [Numerical T-Lab Notation Standard v1](NUMERICAL_NOTATION_STANDARD.md); and
- [Numerical T-Lab Teaching Voice Standard v1](TEACHING_VOICE.md).

The binding choices and completion evidence are in the
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md),
[Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md), and
[Terminology Decisions](TERMINOLOGY_DECISIONS.md).

The follow-up documentation-only reconciliation now completes:

- all 197 rows in the [Glossary Catalog](GLOSSARY_CATALOG.md), with separate
  language, relevance, runtime-readiness, and wave dimensions;
- all 55 records in the [Project Copy Audit](PROJECT_COPY_AUDIT.md), with exact
  replacement copy, source/test/browser traceability, and no decision block;
- rich planning drafts for all 10 Wave 1 terms and 13 high-priority Wave 2
  terms; and
- the six-group
  [Project Language Implementation Plan](PROJECT_LANGUAGE_IMPLEMENTATION_PLAN.md).

Neither iteration publishes a production Glossary term, definition,
annotation, formula, Tutor card, notation migration, or product-copy change.
They change no runtime source, tests, CSS, packages, configuration, numerical
contract, deployment, or remote state.

## 2. Approved decisions

| Decision | Recorded choice | Version 1 result |
|---|---|---|
| Signed error | Option A | \(e_n=u_n-y(t_n)\); declare the orientation; aggregates remain absolute |
| Global error | Option A | Propagated nodal-error family; concrete scalars use named nodes or aggregations; no “total error” |
| Local truncation error | Option A | Unscaled LTE is \(O(h^{p+1})\); divided quantity is the step-normalized local defect \(O(h^p)\) |
| Observed order | Option A | Metric, adjacent pair, finite value, and status travel together; only reliable values drive the primary summary |
| A-stability | Custom Option AB | \(z=h\lambda\), \(u_{n+1}=R(z)u_n\), \(\mathcal S=\{z\in\mathbb C:|R(z)|\le1\}\), closed nonpositive half-plane contained in \(\mathcal S\) |
| Stiffness | Option A | Fast and slow behavior plus a stability-driven step restriction; binding plain-first teaching modifier |
| Relative error | Option A | Nonzero reference magnitude; unavailable at zero; separately name scaled metrics; percent is \(100\%\) |
| Tolerance | Option A | Name the algorithm and controlled quantity; adaptive error-control wording remains future |
| Typography | Option A | Italic lowercase scalars/vectors and italic uppercase matrices; dimensions and prose are authoritative |

No decision is deferred. The recorded set is internally compatible. Released
final-time and maximum-global-error formulas, observed-order classifications,
tolerances, and numerical behavior are unchanged.

## 3. Teaching modifier

The binding cross-project rule is:

> Explain the core idea first in the plainest correct language. Add notation,
> assumptions, and exceptions only where they prevent a real mathematical
> misunderstanding.

The preferred sequence is plain core → why it matters → formula → limits and
confusions.

## 4. Terminology result

The terminology standard retains 197 stable candidate IDs. The 18 rows that
previously rolled up to the nine maintainer decisions are no longer
`DECISION_REQUIRED`.

| Readiness | Count after promotion |
|---|---:|
| `CORE_PROJECT_DRAFT` | 63 |
| `MODULE_DRAFT` | 91 |
| `FUTURE_CANDIDATE` | 31 |
| `DECISION_REQUIRED` | 0 |
| `DEFERRED` | 8 |
| `OUT_OF_SCOPE` | 4 |
| **Total** | **197** |

These statuses describe content readiness, not approval of the language
standard and not runtime implementation. Stable IDs and unrelated readiness
rows remain unchanged.

The historical conflict comparison retains 26 records:

- 13 already-aligned distinctions;
- 4 source-priority draft resolutions; and
- 9 formerly decision-required records now superseded by the approved
  resolution index.

## 5. Evidence baseline retained

The bounded content review admitted and processed 29/29 sources:

- 1,073 pages;
- 234 mapped sections;
- 523 source-level candidate occurrences;
- 197 merged stable candidate IDs; and
- 26 conflict records.

Tracked documentation uses abstract source keys and bounded locators only. No
private path, basename, hash, screenshot, raw extraction, or substantial
quotation is published. Private PDFs were not reopened for this promotion.

## 6. Reconciled catalog and copy audit

[Content Source Policy](CONTENT_SOURCE_POLICY.md) remains unchanged and
authoritative for evidence handling. The catalog and copy audit are now
reconciled against Project Language Standard v1.

The catalog:

- retains exactly 197 stable IDs;
- has zero decision-blocked rows;
- records 27 `V1_APPROVED`, 158 `DRAFT_UNAFFECTED`, 8 `DEFERRED`, and
  4 `OUT_OF_SCOPE` language statuses;
- preserves relevance counts of 63 core, 91 module, 31 future, 8 deferred, and
  4 out of scope;
- maps every row to a runtime-readiness status and one planned wave without
  authorizing runtime; and
- reports four required-ID gaps without adding them:
  `step_normalized_local_defect`, `test_equation`, and
  `scaled_stability_parameter`, plus the future Linear Systems prerequisite
  `positive_definite_matrix`.

The 27 `V1_APPROVED` catalog rows include the 18 formerly decision-blocked
rows plus 9 already-ready terms whose approved wording, formula, or distinction
is directly governed by those same Version 1 decisions.

The copy audit retains all 55 stable records: 40 are
`READY_FOR_IMPLEMENTATION`, 2 `REQUIRES_CONTENT_WAVE`, 1
`DEFERRED_BY_MODULE`, and 12 `NO_CHANGE`; none is obsolete or
decision-blocked. No `COPY-*` recommendation is implemented here.

## 7. Runtime and numerical non-changes

The approval and reconciliation iterations do not change:

- runtime TypeScript, API code, HTML behavior, CSS, tests, dependencies,
  package files, or deployment configuration;
- solver methods, coefficients, startup rules, grid/alignment rules,
  tolerances, budgets, exact-solution checks, error metrics, Convergence
  classifications, or solver metadata;
- App, Lab, Tutor, Store, Router, or Glossary ownership and lifecycle;
- Glossary registry entries, ODE annotations, Lab Glossary binding, Tutor
  queue behavior, Keep/Replace behavior, or notation profiles;
- Platform, IVP, Convergence, preset, method-card, Tutor, or other product copy;
- README, approved framework specs/plans/reviews, or private source policy; or
- branches, remotes, Preview, Production, or deployment state.

The locally accepted Content-Agnostic Interactive Glossary Framework remains
content-neutral. Production still contains no Glossary terms, annotations, ODE
binding, or visible Glossary behavior.

## 8. Local artifacts and validation

Ignored structured reconciliation artifacts record the complete catalog, wave
plan, copy audit, implementation groups, traceability, and deterministic
validation report. They extend the earlier decision artifacts but remain local
review aids, not runtime dependencies or tracked sources of public truth.

Documentation validation for this reconciliation covers:

- exactly 197 stable IDs and no duplicate/invalid alias;
- zero decision-blocked catalog or copy rows;
- all Version 1 affected terms, formulas, status dimensions, dependencies, and
  planned waves;
- all Wave 1 and selected Wave 2 rich drafts;
- all 55 copy records, exact replacements, rule/term/file/test/group
  references, and browser requirements;
- six complete implementation groups and machine-checkable traceability;
- approved-standard byte integrity, relative links, privacy,
  unfinished-marker, and cross-document consistency scans;
- allowed tracked paths and the absence of runtime/test changes;
- `git diff --check`; and
- final branch, commit, and clean-worktree evidence.

No npm test, typecheck, build, browser run, bundle inspection, deployment,
remote contact, push, or external access is required or claimed for this
documentation-only iteration.

## 9. Current review gate

The nine maintainer decisions are recorded and the Numerical T-Lab
terminology, notation, and teaching-voice standards are approved as Version 1.
The Glossary catalog and project copy audit are reconciled, and the A–F
implementation plan is complete. No recommendation, runtime content, or
production Glossary behavior has been implemented. The next authorized phase
is a separately scoped implementation of Group A, Platform and overview copy,
followed by focused tests and browser review. That phase covers ready records
`COPY-001`, `COPY-002`, `COPY-004`, and `COPY-005`; `COPY-003` remains
deferred with the PDE module.
