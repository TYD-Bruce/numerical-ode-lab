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
and exponents use structured DOM or the approved native-MathML authored-math
layer. Use structural subscript, superscript, over-accent, fraction, and matrix
elements, not baseline pseudo-notation, Unicode subscript glyphs, raw LaTeX,
braces, underscores, or carets.

The product uses one-based indices in learner-facing notation even when the
underlying data uses zero-based array indices.

Use `=` for definitions and exact symbolic relationships. Use `≈` when a
displayed substituted operand or result has been rounded. In particular, a
rounded factor comparison is `P A ≈ L U`, while the factorization convention
remains the exact symbolic statement `P A = L U`.

### Linear Systems Teaching v2 row-operation convention

The learner-facing elimination walkthrough presents the computed row
expression first and points to the updated row identity:

`R_i - m_ik R_k -> R_i`.

For example, the mathematical display is equivalent to
`R_2 - (2/3) R_1 -> R_2`. This is Numerical T Lab's walkthrough convention;
it does not claim that the common assignment form
`R_i <- R_i - m_ik R_k` or other textbook row-operation notation is
incorrect. The convention changes presentation only and does not alter trace
arithmetic, stored row identities, or the Gaussian-elimination algorithm.

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

Linear Systems Teaching v2 uses the small project-owned
`frontend/src/math/nativeMath.ts` primitive builder for authored mathematical
objects and domain composition helpers in
`frontend/src/labs/linear-algebra/linearSystemsMath.ts`. Native MathML owns
accents, matrices/vectors, fractions, scripts, and compact algebra; controlled
DOM/CSS owns responsive teaching layout such as matrix-before, row operation,
and matrix-after. The earlier lightweight
`frontend/src/math/structuredMath.ts` remains valid for existing structured
presentations. Neither path introduces MathLive, Compute Engine, ODE, Tutor,
Glossary, a parser, arbitrary HTML, or `innerHTML` into the Linear Systems
route.
