# Numerical T-Lab Goals

## Product north star

Numerical T-Lab is an interactive, AI-assisted educational platform for
learning numerical analysis through:

```text
Understand
  → Compute
  → Visualize
  → Analyze
```

The platform should make numerical behavior observable, explainable, and safe
to explore.

**Descriptor:** An Interactive Numerical Analysis Laboratory

**Brand pillars:** Theory · Tools · Teaching

The pillars express the product philosophy: Theory explains why methods work,
Tools make numerical behavior computable and observable, and Teaching provides
guided, beginner-oriented interpretation. The learning cycle above remains the
learner workflow.

## Target learner

The primary learner may know calculus and basic programming but may be new to
numerical-analysis concepts, error reasoning, stability, and convergence
experiments.

## Product principles

- Beginner-first without hiding mathematical meaning.
- Mathematically rigorous and explicit about assumptions.
- Computation-first: learners run, inspect, compare, and refine experiments.
- Transparent error, convergence, stability, and solver diagnostics.
- Safe, human-friendly mathematical input.
- Concepts explained in the context of the learner's current experiment.
- No fake causal, mathematical, numerical, implementation, or release claims.
- Truthful separation between implemented, in-development, and planned work.
- Accessible keyboard, screen-reader, touch, and mobile experiences.
- Shared platform contracts that support multiple numerical modules.
- Privacy-safe use of local/private references; public code and CI remain
  independent of them.

## Long-term modules

| Module | Product status |
|---|---|
| Numerical ODE | Available; Initial Value Problems Lab is complete |
| Numerical Linear Algebra | In development; runnable Lab not yet released |
| Numerical PDE | Planned; runnable Lab not yet released |

## AI Tutor role

The Tutor is a contextual teaching assistant:

- it grounds explanations in the current successful experiment;
- it uses structured, controlled, safe rendering;
- it does not replace numerical verification or solver evidence;
- it keeps sessions isolated by module;
- it must distinguish teaching guidance from proven numerical results.

## Interactive Glossary role

The Glossary will provide:

- quick definitions near curated teaching content;
- module-context explanations;
- an explicit Ask the Tutor handoff;
- canonical content only after evidence and maintainer review;
- author-controlled annotations with no automatic DOM scanning.

## Non-negotiable numerical principles

`docs/NUMERICAL_CONTRACTS.md` is authoritative for fixed-grid behavior,
expression evaluation, nonlinear solves, exact-solution checks, error metrics,
and convergence-study calculations. This document does not duplicate or relax
those contracts.

## Visual direction

The current interface is neutral and theme-ready. A final personal fantasy skin
is future work. Computation readability, accessible contrast, visible focus,
tables, plots, formulas, and diagnostic clarity take priority over decoration.

## Open-source contribution posture

- Contributors may propose notation and definition changes with evidence.
- The official `main` history keeps one coherent canonical notation after
  review.
- Public contributors and normal CI never require private course references.
- Private sources are not redistributed or treated as public proof.
- The maintainer has final review authority for product, notation, and release
  decisions.
