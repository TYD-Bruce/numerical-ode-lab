# Mathematical presentation contract

This document governs learner-facing mathematical presentation. It does not
change stored numerical values, numerical algorithms, Computation Trace data,
or editable-input syntax.

## Display Number Policy v1

Formatting is presentation-only. A formatted value must never be reused as
numerical input or replace the binary64 value owned by a result or trace.

- Normalize visible positive and negative zero to `0`.
- Remove unnecessary trailing decimal zeros.
- Choose precision by semantic context: ordinary scalars, matrix/vector
  entries, main computed-solution components, Level-1 multipliers, detailed
  arithmetic, reference detail, residual/error-like diagnostics, and
  threshold diagnostics may require distinct display precision.
- Use one formatting decision for the same semantic quantity within one
  result snapshot.
- Never round a nonzero diagnostic to visible zero. Increase precision or use
  mathematical scientific notation instead.
- Do not expose raw JavaScript exponent notation in mathematical output.
  Render a mantissa, multiplication sign, base ten, and a real superscripted
  exponent as one visually atomic quantity.
- Editable fields may continue to accept documented ordinary `e` notation.

## Mathematical Display Policy v1

Learner-facing component indices, matrix-entry indices, elimination-
multiplier indices, vector indices, norm types, named mathematical qualifiers,
and exponents use structured DOM. Use real `sub` and `sup` elements (or an
equivalent approved lightweight structure), not baseline pseudo-notation,
Unicode subscript glyphs, raw LaTeX, braces, underscores, or carets.

The product uses one-based indices in learner-facing notation even when the
underlying data uses zero-based array indices.

Use `=` for definitions and exact symbolic relationships. Use `≈` when a
displayed substituted operand or result has been rounded. In particular, a
rounded factor comparison is `P A ≈ L U`, while the factorization convention
remains the exact symbolic statement `P A = L U`.

## Accessible formula ownership

Each displayed formula has exactly one accessible owner. The owning element
uses `role="math"` and an explicit learner-meaningful accessible name. Its
structured visual child is hidden from the accessibility tree. Nested script
elements and scientific-notation parts must not create duplicate speech.

Interactive matrix and vector inputs remain separate accessible controls. A
nearby formula owner describes their relationship, such as “A times x equals
b”; the formula must not wrap or replace the controls.

## Stored and displayed evidence

Numerical results and Computation Trace records remain authoritative. A
renderer may select contextual precision and structured notation, but it must
not recompute arithmetic, change evaluation order, or imply that rounded
display values are exact. Detailed presentation may expose more stored
precision when needed to distinguish a nonzero value or explain trace-backed
arithmetic.

The current Linear Systems implementation of these policies is the lightweight
frontend helper `frontend/src/math/structuredMath.ts`. It deliberately has no
MathLive, Compute Engine, ODE, Tutor, Glossary, parser, arbitrary HTML, or
`innerHTML` dependency.
