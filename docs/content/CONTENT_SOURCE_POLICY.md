# Content Source Policy

Status: Private-source-reviewed draft; maintainer approval pending.

## Purpose

This policy governs the draft terminology, notation, teaching-language, and
project-copy foundation for Numerical T-Lab. It defines how private evidence
may inform public project-written drafts without making private material a
runtime, CI, contribution, or publication dependency.

This policy is the working methodology for the draft stage. The terminology
and notation choices produced under it are not maintainer-approved product
decisions.

## Admitted source keys

Public content-foundation documents may refer only to these abstract keys:

- `NOTES-2025`
- `NLA-CH01` through `NLA-CH27`
- `CHENEY`

The keys identify evidence families without publishing local filenames,
filesystem locations, hashes, download metadata, or copies of source material.

## Draft source priority

When sources use different but mathematically valid terminology or notation,
the draft preference order is:

1. `NOTES-2025`
2. `NLA-CH01` through `NLA-CH27`
3. `CHENEY`
4. maintainer decision

Priority selects a draft project preference; it does not determine
mathematical truth. A lower-priority source may expose an important distinction
or a limitation that the higher-priority source does not discuss.

## Conflict policy

Evidence is classified as:

- `ALIGNED` when the sources support the same practical distinction;
- `PRIORITY_RESOLVED_DRAFT` when source priority supports a provisional project
  choice without maintainer approval;
- `DECISION_REQUIRED` when alternatives change meaning, scope, formula,
  interpretation, or migration impact;
- `DEFERRED` when the concept is valid but unnecessary for the present product
  or planned module boundary.

The draft must not merge disagreements silently, average competing wording, or
present a provisional choice as a maintainer decision. Every
`DECISION_REQUIRED` item must appear in
[Terminology Decisions](TERMINOLOGY_DECISIONS.md).

## Locator policy

Public evidence locators may contain:

- an admitted source key;
- chapter and section;
- printed page or PDF page;
- equation, theorem, or definition number when useful.

Locators should be short and representative. Public files must not include a
private path, private basename, file hash, screenshot, raw extraction, or
identifying acquisition metadata.

## Copyright and paraphrase policy

All project definitions, explanations, examples, warnings, and recommendations
must be written in original Numerical T-Lab language.

The content foundation must not:

- copy a source paragraph or theorem statement;
- reproduce an exercise;
- publish a screenshot or page image;
- publish raw extracted text;
- act as a chapter-by-chapter substitute for a source;
- include more than 20 consecutive source words in tracked output.

Short mathematical names, standard formulas, and compact locators may be used
when necessary to identify a concept. Prose must be paraphrased and synthesized
from the evidence record.

## Private and public boundary

Private source files and derived working artifacts remain ignored by Git.
Normal application code, tests, builds, CI, public documentation links, and
future Glossary runtime data must not read or depend on them.

Tracked documents may contain only:

- project-written synthesis;
- abstract source keys and short locators;
- draft decisions and explicit unresolved questions;
- coverage counts that do not expose private file identity or hashes.

Private working artifacts may contain compact paraphrases and locators, but not
full raw corpus text or persistent page images.

## Approval lifecycle

1. Collect source-grounded candidates and conflicts.
2. Draft terminology, notation, teaching voice, and copy recommendations.
3. Cross-check IDs, aliases, formulas, locators, and unresolved decisions.
4. Obtain maintainer review of every `DECISION_REQUIRED` item and any proposed
   production term.
5. Record accepted decisions in a later maintainer-authorized iteration.
6. Plan and review production-copy or Glossary-content changes separately.
7. Implement production changes only under an approved runtime/content plan.

Completing this draft does not authorize a project-wide copy refactor,
production Glossary entries, ODE annotations, Tutor queue behavior, or any
runtime change.

## Change control

New private evidence must receive a new abstract source key under a separately
authorized review. Existing keys remain stable. A change in draft terminology
must update the terminology standard, notation standard when relevant,
Glossary catalog, decision log, copy audit, and content handoff together.
