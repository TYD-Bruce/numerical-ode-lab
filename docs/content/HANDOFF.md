# Numerical Terminology and Teaching-Language Foundation Handoff

Status: Decision packet complete; all choices remain maintainer-pending.

## 1. Iteration boundary

This handoff records the completed draft content foundation built in parallel
with the active Content-Agnostic Interactive Glossary Framework milestone.
The work is research, synthesis, and current-copy audit only. It does not
publish a production Glossary term, definition, annotation, formula, Tutor
card, or notation migration.

The repository started this iteration on local `main` with a clean worktree.
The exact starting and final commit IDs are reported by the task’s post-commit
evidence rather than embedded self-referentially here.

## 2. Public draft package

The iteration created:

- [Content Source Policy](CONTENT_SOURCE_POLICY.md) — abstract source keys,
  priority, conflict handling, locators, copyright boundaries, and approval
  lifecycle.
- [Numerical Terminology Standard](NUMERICAL_TERMINOLOGY_STANDARD.md) — the
  complete merged candidate set admitted by the bounded review method.
- [Numerical Notation Standard](NUMERICAL_NOTATION_STANDARD.md) — proposed
  cross-domain notation and explicit unresolved choices.
- [Teaching Voice](TEACHING_VOICE.md) — learner-facing style, epistemic
  language, warnings, errors, results, and Tutor tone.
- [Glossary Catalog](GLOSSARY_CATALOG.md) — compact planning metadata for all
  merged candidates plus richer drafts for current-product concepts.
- [Project Copy Audit](PROJECT_COPY_AUDIT.md) — current-copy evidence and the
  staged A–F rewrite plan.
- [Terminology Decisions](TERMINOLOGY_DECISIONS.md) — aligned distinctions,
  source-priority draft resolutions, and unresolved maintainer decisions.
- [Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md) — source
  comparisons, viable options, advisory recommendations, migration effects,
  dependencies, scenarios, and blank choice forms for exactly nine decisions.
- [Project Language Approval Checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md)
  — the blank gate record for maintainer choices and later standards promotion.

Every document is a draft pending maintainer approval. None is runtime data or
a production content source.

## 3. Coverage result

The admitted corpus was processed 29/29:

| Source key | Pages | Mapped sections | Processing method | Result |
|---|---:|---:|---|---|
| `NOTES-2025` | 80 | 47 | Embedded outline plus text-layer page metadata | Processed |
| `NLA-CH01` | 12 | 7 | Text layer with font-size heading detection | Processed |
| `NLA-CH02` | 11 | 8 | Text layer with font-size heading detection | Processed |
| `NLA-CH03` | 9 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH04` | 11 | 6 | Text layer with font-size heading detection | Processed |
| `NLA-CH05` | 6 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH06` | 10 | 7 | Text layer with font-size heading detection | Processed |
| `NLA-CH07` | 8 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH08` | 10 | 5 | Text layer with font-size heading detection | Processed |
| `NLA-CH09` | 10 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH10` | 13 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH11` | 5 | 2 | Text layer with font-size heading detection | Processed |
| `NLA-CH12` | 7 | 3 | Text layer with font-size heading detection | Processed |
| `NLA-CH13` | 8 | 2 | Text layer with font-size heading detection | Processed |
| `NLA-CH14` | 14 | 5 | Text layer with font-size heading detection | Processed |
| `NLA-CH15` | 9 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH16` | 17 | 5 | Text layer with font-size heading detection | Processed |
| `NLA-CH17` | 17 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH18` | 10 | 2 | Text layer with font-size heading detection | Processed |
| `NLA-CH19` | 6 | 4 | Text layer with font-size heading detection | Processed |
| `NLA-CH20` | 18 | 6 | Text layer with font-size heading detection | Processed |
| `NLA-CH21` | 8 | 3 | Text layer with font-size heading detection | Processed |
| `NLA-CH22` | 13 | 6 | Text layer with font-size heading detection | Processed |
| `NLA-CH23` | 7 | 3 | Text layer with font-size heading detection | Processed |
| `NLA-CH24` | 19 | 7 | Text layer with font-size heading detection | Processed |
| `NLA-CH25` | 10 | 2 | Text layer with font-size heading detection | Processed |
| `NLA-CH26` | 12 | 2 | Text layer with font-size heading detection | Processed |
| `NLA-CH27` | 13 | 4 | Text layer with font-size heading detection | Processed |
| `CHENEY` | 700 | 70 | Image-only contents mapping plus bounded visual review | Processed with stated limitation |
| **Total** | **1,073** | **234** | — | **29/29 processed** |

No admitted source was unreadable or blocked. The ignored manifest retains the
local basenames and extraction details; tracked documents use abstract source
keys only.

## 4. Candidate and decision results

The section-level pass produced 523 source-level candidate occurrences. After
cross-source merging and project-need completion, the draft contains 197
unique stable candidate IDs with no preferred-name or alias collision.

Candidate readiness:

| Readiness | Count | Meaning |
|---|---:|---|
| `CORE_PROJECT_DRAFT` | 47 | Relevant to current shared or ODE language after review |
| `MODULE_DRAFT` | 89 | Reserved for later Linear Algebra or PDE module work |
| `FUTURE_CANDIDATE` | 31 | Valid later approximation/nonlinear-equation content |
| `DECISION_REQUIRED` | 18 | Candidate wording or scope depends on maintainer choice |
| `DEFERRED` | 8 | Source topic retained without a standalone term proposal |
| `OUT_OF_SCOPE` | 4 | Valid subject outside the current product roadmap |
| **Total** | **197** | — |

The conflict log contains 26 records:

| Conflict status | Count |
|---|---:|
| `ALIGNED` | 13 |
| `PRIORITY_RESOLVED_DRAFT` | 4 |
| `DECISION_REQUIRED` | 9 |
| **Total** | **26** |

The nine maintainer decisions concern signed-error orientation, relative-error
denominator behavior, local-truncation-error normalization, the scope of
global error, stability-function/region notation, observed-order reliability
and asymptotic-region language, the minimum stiffness definition, tolerance
scopes, and vector/matrix typography.

The decision packet resolves the earlier 18-versus-9 counting ambiguity:
18 candidate rows roll up into exactly nine conflict records. It gives every
record a three-source comparison (including explicit source silence), three
viable options, one advisory recommendation with confidence, per-option
migration effects, a proposed-but-unapproved Version 1 rule, examples, and a
blank maintainer form. The dependency order is signed-error orientation,
global-error scope, local-truncation scaling, observed-order reliability,
A-stability notation, stiffness definition, relative-error behavior, tolerance
scopes, then matrix/vector typography. The recommendation set has five
high-confidence, three medium-confidence, and one low-confidence choice. No
recommendation was accepted automatically.

## 5. Current-copy audit result

The audit covered all current non-historical user-facing English copy owners in
the platform pages and shell, IVP Lab, method and preset metadata, grid and
exact-solution messages, Convergence runtime and teaching, Tutor UI and mock
responses, mathematical-input UI, Glossary framework shell, README, and
current behavior/status documents.

It records:

- 43 recommended changes;
- 12 representative no-change decisions;
- no modification to any audited source file.

The highest-risk findings are:

1. The Tutor currently gives two incompatible local-truncation-error orders
   without declaring whether the one-step defect is divided by the step size.
2. Backward Euler is described as “Very stable” without naming the
   absolute-stability scope or test equation.
3. A Compare result uses symbols that resemble numerical-versus-exact error
   while actually comparing two numerical approximations.
4. Result and Tutor point counts are labeled as steps even though the displayed
   value includes the initial grid point.
5. Several Convergence labels shorten metric names or blur theoretical and
   observed order.

The audit is a plan, not authorization. Its implementation groups remain:

- A. Platform and overview copy
- B. Initial Value Problems Lab copy
- C. Convergence/error language
- D. Tutor terminology and voice
- E. Production Glossary content
- F. Final consistency/browser audit

## 6. Private derived evidence

Ignored resumability artifacts retain:

- the 29-source manifest and checkpoint progress;
- the 234-record section map;
- the 197 merged candidate records;
- the 26 conflict records;
- the 55 current-copy evidence records;
- aggregate coverage and limitation counts;
- deterministic draft-generation and validation helpers.

They contain no full raw corpus, persistent page image, source hash, or public
runtime dependency. Temporary visual-review images were removed after the
bounded review.

## 7. Validation evidence

The deterministic content-foundation validator passed with:

- sources: 29;
- pages: 1,073;
- sections: 234;
- unique candidates: 197;
- conflicts: 26;
- decision-required conflicts: 9;
- copy records: 55;
- unknown candidate IDs: 0;
- unknown source keys: 0;
- preferred-name or alias collisions: 0;
- broken relative links: 0;
- privacy-pattern matches: 0;
- unfinished-marker matches: 0;
- malformed mid-word punctuation findings: 0.

The final Git verification for this documentation-only iteration is recorded
in the task report. No npm test, typecheck, build, browser run, bundle
inspection, deployment, remote contact, or push is required or claimed.

## 8. Limitations

- `CHENEY` is image-only. All 70 contents sections were mapped, and four
  conflict-relevant areas received bounded visual review. No bulk OCR was run,
  so secondary concepts that appear only in body pages may be absent.
- Text-layer sources were mapped by headings and scanned with a controlled
  numerical-analysis lexicon. This supports systematic coverage but does not
  replace human line-by-line interpretation of every page.
- Draft definitions are compact original paraphrases. They are not a
  chapter-by-chapter substitute for any source.
- Source priority selected provisional project wording; it did not silently
  resolve mathematically meaningful disagreements.
- No term, notation choice, or copy recommendation becomes product truth
  without maintainer review.

## 9. Explicit non-changes

This iteration did not change:

- runtime TypeScript, HTML behavior, CSS, tests, package or deployment files;
- numerical methods, coefficients, grid rules, tolerances, budgets, error
  metrics, Convergence classifications, or solver metadata;
- App/Lab/Tutor/Glossary ownership, lazy-loading, accessibility, or lifecycle;
- README or historical specs, plans, reviews, and released evidence;
- production Glossary content, ODE annotations, Tutor queue behavior, or
  notation profiles;
- remotes, branches, deployment state, or production.

## 10. Next review gates

The framework gate is already closed with **APPROVED FOR LOCAL FRAMEWORK
RELEASE**. The active content gate is maintainer review of the
[decision packet](MAINTAINER_DECISION_PACKET.md) in dependency order and
recording all required choices in the
[approval checklist](PROJECT_LANGUAGE_APPROVAL_CHECKLIST.md).

After all nine choices are recorded, a separate standards-promotion commit may
update the terminology and notation standards. That approval step does not
itself rewrite product copy, add production Glossary terms or annotations,
change runtime, or authorize an ODE vertical slice. Those later actions still
require their own repository-grounded plan and review gate.
