# Numerical T-Lab Project Language v1 Handoff

Status: Nine maintainer decisions recorded; terminology, notation, and
teaching-voice standards approved as Version 1.

Runtime/content implementation tracked separately.

## 1. Iteration boundary

Yiding (Bruce) Tian approved all nine project-language decisions on
2026-07-28. This documentation-only iteration promotes:

- [Numerical T-Lab Terminology Standard v1](NUMERICAL_TERMINOLOGY_STANDARD.md);
- [Numerical T-Lab Notation Standard v1](NUMERICAL_NOTATION_STANDARD.md); and
- [Numerical T-Lab Teaching Voice Standard v1](TEACHING_VOICE.md).

The binding choices and completion evidence are in the
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md),
[Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md), and
[Terminology Decisions](TERMINOLOGY_DECISIONS.md).

This iteration does not publish a production Glossary term, definition,
annotation, formula, Tutor card, notation migration, or product-copy change.
It changes no runtime source, tests, CSS, packages, configuration, numerical
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

## 6. Deliberately unreconciled documents

[Content Source Policy](CONTENT_SOURCE_POLICY.md),
[Glossary Catalog](GLOSSARY_CATALOG.md), and
[Project Copy Audit](PROJECT_COPY_AUDIT.md) are unchanged in this commit.

The catalog therefore remains a pre-approval planning draft and can
temporarily contain old `DECISION_REQUIRED` readiness values. That is an
explicit phase boundary, not an alternate standard. The copy audit retains its
43 recommended changes and 12 representative no-change decisions; no
`COPY-*` recommendation is implemented or promoted here.

The next phase must reconcile the catalog and copy audit against the approved
Version 1 standards without creating runtime content.

## 7. Runtime and numerical non-changes

This iteration does not change:

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

The ignored decision artifact records the nine maintainer choices and the
ignored validation report records deterministic checks. Neither is a runtime
dependency or tracked source of public truth.

Documentation validation for this promotion covers:

- exactly nine approved decisions and no deferrals;
- all 18 affected terminology rows resolved;
- 197 terminology IDs with the status counts above;
- exact formulas and boundary language for the nine choices;
- completed approval metadata;
- cross-document relative links;
- privacy and unfinished-marker scans;
- allowed-path and forbidden-path checks;
- `git diff --check`; and
- final branch, commit, and clean-worktree evidence.

No npm test, typecheck, build, browser run, bundle inspection, deployment,
remote contact, push, or external access is required or claimed for this
documentation-only iteration.

## 9. Current review gate

The nine maintainer decisions are recorded and the Numerical T-Lab
terminology, notation, and teaching-voice standards are approved as Version 1.
No runtime or production Glossary content has been authorized. The next phase
is a documentation-only reconciliation of the Glossary catalog and project
copy audit against the approved standards.
