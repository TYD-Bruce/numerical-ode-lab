# Human-Friendly Math Expressions Design

**Status:** Implemented and verified

**Date:** 2026-07-10

**Scope:** Milestone 1, implemented

**Implementation date:** 2026-07-11

**Implementation record:** Phases 0–5 were delivered in commits `efb6447b815a5121da3c46b67f2c99de60b26e11` through `73780824d0897509c7aa3657fd5b6d403b8c0675`; Phase 6 verification and documentation are recorded by the finalization commit. The verified dependency versions are MathLive 0.110.0 and Compute Engine 0.58.0. The final suite contains 543 passing tests. The production build keeps the main application near 236 kB minified (79 kB gzip) and defers substantial editable/Compute Engine and MathLive chunks; this is a known performance tradeoff, not a correctness limitation.

**Downstream integration note (2026-07-11):** The completed Observed Convergence Order workflow now exposes the already implemented `exact_solution` profile for optional first-order exact-solution input, presets, consistency checks, and convergence studies. Milestone 1 itself remains unchanged: the downstream feature reuses the same project-owned AST, adapters, validation, evaluator, and rendering boundary and introduces no second expression language.

## 1. Purpose

Numerical ODE Lab will replace programmer-facing mathematical input such as `Math.exp(t)`, `Math.sin(t)`, and `y0 * Math.exp(-(t - t0))` with visual, textbook-style editing and display. Users will enter forms such as e raised to t, sin(t), y₀e raised to −(t−t₀), stacked fractions, roots, subscripts, exponents, and absolute values without writing JavaScript.

The UI remains English-only in Version 1. This milestone changes how supported expressions are entered, validated, stored, rendered, and compiled; it does not change any numerical method or its mathematical behavior.

## 2. Milestone sequence and release gate

The approved sequence is:

1. **Milestone 1: Human-Friendly Math Expressions**
2. **Milestone 2: Observed Convergence Order Experiment**

The [Observed Convergence Order Experiment design](./2026-07-10-convergence-study-design.md) depends on this specification. Convergence implementation must not begin until Milestone 1 is implemented, tested, and reviewed.

Milestone 1 exposes visual ODE right-hand-side editing, migrates the existing Leap-Frog acceleration-expression field to the same safe editing system, and adds shared mathematical rendering. It must not expose an exact-solution field, exact-solution switch, convergence drawer, or convergence experiment. It must nevertheless implement and unit-test the `exact_solution` variable profile throughout parsing, validation, canonicalization, serialization, and evaluation so Milestone 2 can reuse the foundation without redesign.

## 3. Version 1 boundaries

### Included

- MathLive math fields for editable ODE expressions.
- MathLive-backed read-only rendering through one shared abstraction.
- MathJSON-to-project-AST conversion as an adapter boundary.
- A closed, project-owned AST, variable-profile validation, deterministic canonical serialization, and explicit numerical evaluation.
- A narrow compatibility importer for approved legacy text forms.
- Gentle editing validation and strict validation checkpoints.
- Accessible field errors, Run error summary, fallback rendering, and English copy.
- Controlled Tutor text/math segmentation.
- Migration of current built-in expressions and formula displays to validated, AST-backed definitions where they represent executable expressions.

### Excluded

- Exact-solution UI and Convergence Study implementation.
- Arbitrary JavaScript, assignments, statements, ternaries, global variables, property traversal, user-defined functions, or arbitrary function calls.
- Matrices, vectors, piecewise expressions, complex values, symbolic differentiation, arbitrary HTML, unrestricted Markdown, or Chinese UI.
- KaTeX or MathJax.
- Changes to solver algorithms, coefficients, grid contracts, implicit iteration, or result semantics.

The implementation will require MathLive as the approved math-field and rendering dependency. This design task does not add it or any other dependency.

## 4. User-facing math editing

Step 2 shows a fixed, non-editable prefix followed by one MathLive field:

```text
y′ = [editable math field]
```

The user edits only the right-hand side f(t,y), not the complete equation. Representative accepted input includes:

- −y
- t−y
- y(1−y)
- e raised to t
- 2 sin(t)
- (t+1)(y−1)

Physical-keyboard entry and the MathLive virtual keyboard remain available. The field must preserve natural caret behavior, selection, undo, and paste behavior supplied by MathLive while application state updates only through the validated expression pipeline.

The existing Leap-Frog form uses the same component with its current acceleration prefix:

```text
u″ = [editable math field]
```

The field continues to edit only a(t,u). This is an internal migration to the `second_order_rhs` profile, not new Leap-Frog functionality. Compare remains a first-order flow and continues to use the `rhs` profile.

Milestone 2 will use the same component with the fixed prefix:

```text
y(t) = [editable math field]
```

That future exact-solution field is specified only as an integration contract and is not rendered or reachable in Milestone 1.

## 5. Expression details

Visual mathematical editing is the default. A collapsed **Expression details** section provides read-only diagnostics for the active expression:

- LaTeX representation.
- Canonical parsed expression.

For displayed mathematics equivalent to y₀e raised to −(t−t₀), the details are:

```text
LaTeX: y_0e^{-(t-t_0)}
Parsed expression: y0 * exp(-(t - t0))
```

The parsed expression is a deterministic human-readable projection of the project AST. It is not executable JavaScript and is never fed to `eval` or `new Function`. The details view is not an alternate editor. Opening it triggers strict validation; on invalid input it shows the field error and retains the last confirmed AST without presenting stale details as current.

## 6. Authoritative representation and data flow

The data flow is:

```text
MathLive
→ MathJSON
→ ODE Lab AST
→ variable-profile and whitelist validation
→ explicit numerical evaluator
```

MathLive owns editing interactions and rendering. MathJSON is an adapter format at the MathLive boundary. Neither is authoritative for numerical meaning, presets, fingerprints, saved canonical state, Tutor grounding, or convergence.

After successful parsing, the project-owned AST is authoritative. LaTeX is retained to restore and display the user's visual input, but it does not define mathematical meaning after validation.

```ts
interface MathExpression {
  latex: string;
  canonicalAst: MathAst;
  displayText: string;
}

interface CompiledMathExpression<Args extends readonly number[]> {
  expression: MathExpression;
  evaluate: (...args: Args) => number;
  canonicalSerialization: string;
}
```

`displayText` is an accessible, English-readable mathematical description generated from the AST, not copied from untrusted input. Runtime code may refine the generic evaluator type, but the separation between authoritative expression data and compiled numerical closure is required.

## 7. Project-owned minimal AST

Version 1 uses a closed discriminated union:

```ts
type MathAst =
  | { kind: "number"; value: number }
  | { kind: "constant"; name: "e" | "pi" }
  | { kind: "variable"; name: "t" | "y" | "u" | "t0" | "y0" }
  | { kind: "negate"; operand: MathAst }
  | { kind: "add"; terms: MathAst[] }
  | { kind: "multiply"; factors: MathAst[] }
  | { kind: "divide"; numerator: MathAst; denominator: MathAst }
  | { kind: "power"; base: MathAst; exponent: MathAst }
  | {
      kind: "function";
      name: "exp" | "sin" | "cos" | "tan" | "sqrt" | "log" | "abs";
      argument: MathAst;
    };
```

No catch-all, raw MathJSON, raw LaTeX, arbitrary call, property, statement, or embedded-code node is allowed. Conversion rejects any MathJSON construct that cannot be represented exactly by this union.

Subtraction canonicalizes to addition plus negation. Explicit and implicit multiplication canonicalize to the same `multiply` node. Nested `add` and `multiply` structure, child order, and grouping are preserved so canonicalization cannot change floating-point evaluation order. The canonicalizer performs no algebraic simplification that changes domains or evaluation order.

## 8. Variable profiles

```ts
type MathVariableProfile =
  | "rhs"
  | "exact_solution"
  | "second_order_rhs";
```

| Profile | Allowed variables | UI availability in Milestone 1 |
|---|---|---|
| `rhs` | `t`, `y` | Exposed in the Step 2 ODE field |
| `exact_solution` | `t`, `t0`, `y0` | Not exposed; parser, validator, canonicalizer, serializer, and evaluator support is unit-tested |
| `second_order_rhs` | `t`, `u` | Exposed only through the existing Leap-Frog acceleration-expression field |

Validation runs after structural conversion and before evaluation. Unknown or disallowed variables produce profile-specific English errors. Examples:

> Unknown variable x. Use only t and y in the ODE right-hand side.

> Variable y is not available in an exact solution. Use only t, t₀, and y₀.

> Unknown variable y. Use only t and u in the Leap-Frog acceleration expression.

The error identifies the actual name and relevant field. It does not expose MathJSON or internal node data.

`second_order_rhs` is required so the existing Leap-Frog user-expression path can leave `new Function` with every other user expression. It is supported by structured parsing, profile validation, canonicalization, serialization, explicit evaluation, legacy import, and tests. It does not add a new equation type, solver, control, or analysis.

## 9. Supported mathematical subset

### Operations and constants

- Addition, subtraction, multiplication, division, and powers.
- Constants e and pi, displayed as e and π.
- Parentheses and grouping.

### Functions

- Exponential `exp`.
- `sin`, `cos`, and `tan`.
- Square root `sqrt`.
- Natural logarithm, represented internally as `log` and always displayed to users as ln.
- Absolute value `abs`.

The shared renderer supports textbook forms including e raised to x, sin x, cos x, tan x, √x, ln x, |x|, stacked fractions, superscripts, and subscripts. The input adapters own exponential recognition: the raw MathJSON adapter maps visual `Power(ExponentialE, x)` and raw `Exp(x)` to `{ kind: "function", name: "exp", argument: x }`, while the legacy adapter maps `exp(x)` and `Math.exp(x)` to the same node. The explicit evaluator dispatches that node to `Math.exp`, and the renderer typesets it as textbook-style e raised to x.

A standalone e remains `{ kind: "constant", name: "e" }`. A general a raised to b remains a `power` node. Critically, the Phase 1/core canonicalizer does not rewrite an already constructed project AST `power(constant("e"), x)` node; only the input adapter can recognize that a raw visual power was the approved textbook exponential form. The canonicalizer also never rewrites an `exp` node to `power(e, x)` because `Math.exp(x)` and `Math.pow(Math.E, x)` are not guaranteed to have identical floating-point results.

## 10. Implicit multiplication

Structured parsing supports standard implicit multiplication:

- 2t
- ty when MathLive/MathJSON structurally identifies separate approved symbols t and y
- 2 sin(t)
- y₀e raised to −t
- (t+1)(y−1)

Implicit multiplication is derived from MathLive/MathJSON structure or the controlled legacy grammar, never regular-expression guessing. The canonical AST uses explicit `multiply` nodes, and Expression details prints `*` between factors so users can inspect the interpretation.

Lexical ambiguity is resolved conservatively. A multi-letter identifier is not automatically split into variables unless the structured input identifies separate symbols or it is an explicitly supported function/legacy token. Unknown identifiers produce errors rather than guessed multiplication.

## 11. Legacy text compatibility

Current saved values and pasted text pass through a narrow compatibility importer before normal AST validation. It accepts only a controlled expression grammar for numbers, approved variables, parentheses, approved operators, approved functions, and these exact aliases:

- `exp(-t)`, `sin(t)`, and `sqrt(t)`.
- `y0 * exp(-(t - t0))` under the `exact_solution` profile.
- `-u` and supported functions of `t` and `u` under the `second_order_rhs` profile.
- `Math.exp(-t)` and `Math.sin(t)`.
- `Math.PI`.

The importer tokenizes and parses this grammar; it does not sanitize with regular expressions and does not execute the string. `exp(x)` and the approved `Math.exp(x)` alias map directly to the project `exp` function node and are re-rendered as textbook-style e raised to x. Other approved `Math` aliases map directly to their corresponding project AST nodes. Imported strings never remain authoritative.

It rejects `window.alert(...)`, `Math.random()`, assignments, statements, ternaries, property traversal outside the explicitly listed `Math.exp`, `Math.sin`, and `Math.PI` aliases, computed properties, and any extra tokens. Additional aliases require an explicit design amendment or implementation-plan decision backed by tests; they are not accepted accidentally through general property access.

## 12. Validation lifecycle and state

Each math field maintains:

```ts
type MathFieldValidationState =
  | { kind: "incomplete"; draftLatex: string; confirmed?: MathExpression }
  | { kind: "ready"; draftLatex: string; confirmed: MathExpression }
  | { kind: "invalid"; draftLatex: string; error: MathExpressionError; confirmed?: MathExpression };
```

While editing, parsing is gentle. Recognized incomplete structures—such as an open fraction, missing exponent slot, unclosed group, or function awaiting an argument—use a neutral state:

> Expression incomplete

> Keep typing to finish the expression

Incomplete or invalid drafts do not replace the last confirmed AST and cannot reach the solver, fingerprints, presets, or AI Tutor. The visible field may retain the draft so the user can finish it.

Strict validation runs on blur, Run, opening Expression details, preset loading, preset undo, and saved-input restoration. Preset and restore failures are controlled application errors rather than silently accepted state.

On success the app:

- Shows a lightweight **Expression ready** state.
- Replaces the confirmed `MathExpression`.
- Updates canonical AST serialization and parsed preview.
- Updates accessible display text.
- Updates the canonical expression component used by fingerprints.

On failure it shows a specific English message. It never exposes stack traces, raw MathJSON, or only the generic phrase “Invalid expression.” Strict validation turns an unfinished draft into a field error such as **Finish the fraction before running.**

## 13. Error presentation and accessibility

Errors appear inline with the field and, after Run is attempted, in a Step 2 summary. The summary heading uses the actual count, for example:

> Fix 2 expressions before running

Each summary item names the field, gives a short error, and moves focus to the corresponding math field. Normal validation does not use modal dialogs.

The implementation uses `aria-invalid`, `aria-describedby`, an announced summary region, visible focus, and stable error IDs. The fixed equation prefix is included in the accessible name so a screen-reader user hears that the field edits the right-hand side of y′. Neutral incomplete state is announced without marking the field invalid until a strict checkpoint.

## 14. Shared read-only rendering

MathLive renders editable fields and read-only mathematics. KaTeX and MathJax are not added. All non-editable math goes through one shared abstraction rather than scattered MathLive DOM manipulation:

```ts
interface ReadonlyMathContent {
  latex: string;
  displayText: string;
  ariaLabel: string;
}
```

The abstraction owns safe construction, MathLive configuration, fallback behavior, and accessibility. Read-only formulas are not editable and are not ordinary tab stops unless an interaction requires focus. They expose accessible fallback text or MathML. If MathLive rendering fails, the component shows `displayText`; rendering failure never changes a validated AST, evaluator, solver input, or numerical result.

Milestone 1 routes Step 3 equation display, method explanations and formulas, preset previews, and controlled Tutor mathematics through this abstraction where mathematical content is present. The same renderer is the required boundary for Milestone 2 numerical and convergence formulas.

## 15. AI Tutor math rendering

Tutor responses remain English plain text with controlled math segments. The response format permits explicit inline `\(...\)` delimiters and, only when needed, block `\[...\]` delimiters. Arbitrary HTML and unrestricted Markdown remain disabled.

For example, a model response may contain:

```text
The observed order is \(p_{\mathrm{obs}}\approx 3.92\).
```

The frontend tokenizes text and math segments with a bounded delimiter parser. Text is rendered as text. Each math segment is parsed/validated for rendering through the shared read-only abstraction and falls back to readable plain text independently; a bad segment does not remove the surrounding Tutor message. Tutor math is never sent to the numerical evaluator and never becomes application expression state.

Tutor prompts require human mathematical forms instead of `Math.exp(...)` when a textbook form exists. Model output cannot introduce executable AST nodes, HTML, scripts, or arbitrary Markdown.

## 16. Math input toolbar

When a relevant editable math field has focus, a compact toolbar shows:

- Fraction.
- Exponent.
- Square root.
- e raised to x.
- sin, cos, tan, and ln.
- Absolute value.
- π.

The toolbar appears only for the active math field and inserts MathLive mathematical structures, not code syntax or source strings. It supports physical-keyboard entry and is English-only. **More symbols** opens the fuller MathLive virtual keyboard and returns focus coherently to the active field.

## 17. Numerical evaluation boundary

The solver receives only numeric evaluators compiled from validated project AST nodes:

```ts
type RhsEvaluator = (t: number, y: number) => number;
type ExactSolutionEvaluator = (t: number, t0: number, y0: number) => number;
type SecondOrderRhsEvaluator = (t: number, u: number) => number;
```

The solver does not depend on MathLive, MathJSON, LaTeX, DOM nodes, rendering components, or draft validation state. Compilation uses exhaustive AST dispatch, never `eval` or `new Function`.

Before dispatch, inputs must be finite under existing numerical contracts. Every operation and function result must be finite. Division by zero, square root of a negative real, logarithm of a non-positive real, tangent at a numerically undefined point when it yields non-finite output, overflow, and any other non-finite result produce controlled English domain errors naming the operation and evaluation point where available. Complex continuation is not attempted.

The evaluator preserves established JavaScript `number` arithmetic for supported real expressions. In particular, the `exp` function node is evaluated with `Math.exp(argument)` rather than `Math.pow(Math.E, argument)`. General `power` nodes use JavaScript power semantics without being treated as exponentials. Replacing expression compilation must not alter integration algorithms or fixed-grid behavior.

## 18. Presets, persistence, and fingerprints

Executable built-in problem expressions migrate from JavaScript-style strings to validated AST-backed definitions with LaTeX and accessible display text. A preset load yields:

- Restorable LaTeX.
- Canonical ODE Lab AST.
- Accessible `displayText`.
- A compiled numeric evaluator for the correct profile.

Milestone 1 migrates currently exposed RHS defaults and any existing built-in RHS values. It does not add or populate future exact-solution preset data; Milestone 2 owns those definitions after reusing the already tested `exact_solution` profile.

Fingerprints use a stable, versioned canonical AST serialization, never raw MathJSON, raw LaTeX, or arbitrary object enumeration. Version 1 serialization obeys these rules:

- Prefix every serialization with `math-ast-v1`.
- Encode each node as a fixed tag followed by length-delimited child encodings; do not depend on object key order.
- Accept only finite numeric literals. Normalize `-0` to `0` and serialize other numbers using JavaScript's shortest round-trip decimal representation.
- Encode constants by canonical names `e` and `pi`, variables by canonical ASCII names, and functions by the closed AST name.
- Normalize subtraction to `add` plus `negate`. Before core canonicalization, the raw MathJSON adapter maps the specific visual pattern e raised to x and raw `Exp(x)` to the `exp` function node, and the legacy adapter does the same for `exp(x)`/`Math.exp(x)`. Never normalize that node to `power(e, x)`.
- Preserve nested `add` and `multiply` grouping and left-to-right semantic input order. Do not flatten or sort commutative terms or factors in Version 1 because regrouping or reordering can change floating-point results and would silently equate expressions beyond the approved rules.
- Encode explicit and implicit multiplication identically after parsing.
- Preserve `divide` and general project-AST `power` structure; do not apply cancellation, constant folding, distributivity, associativity, domain-changing identities, or a core `power(e, x)` rewrite. The adapter-only visual exponential recognition described above occurs before this boundary.

Thus visually different explicit/implicit multiplication can share a fingerprint, while `t+y` and `y+t` remain distinct in Version 1. Future canonical changes require a new version prefix and an explicit saved-state migration.

For exponentials, visual e raised to t, `exp(t)`, and `Math.exp(t)` share the same versioned serialization because each produces the same `exp` function node. Standalone e and general power nodes retain different serializations.

## 19. Security boundary

MathLive and MathJSON are input and rendering tools, not security sandboxes. The trusted numerical boundary consists of:

- The project-owned closed AST.
- Structural whitelist conversion.
- Variable-profile validation.
- Exhaustive explicit evaluation.

The implementation never directly executes LaTeX, MathJSON, legacy pasted JavaScript, Tutor-generated formulas, parsed preview text, or rendering output. Arbitrary global access, assignments, statements, property traversal, and unapproved calls have no representable AST form and are rejected before evaluation.

Rendering and numerical evaluation are separate trust paths: a rendering failure cannot alter meaning, and rendered Tutor content cannot become solver input.

## 20. Architecture and ownership

The implementation plan should preserve focused boundaries equivalent to:

- `mathAst`: AST types, structural invariants, canonicalization, serialization, and display-text projection.
- `mathJsonAdapter`: MathJSON conversion only.
- `legacyExpressionAdapter`: controlled legacy tokenization and parsing only.
- `mathValidation`: variable profiles, supported subset, and controlled errors.
- `mathEvaluator`: pure numeric compilation and domain checks.
- `mathField`: editable MathLive integration and validation lifecycle.
- `readonlyMath`: shared non-editable renderer and fallback.
- `tutorMath`: controlled text/math segmentation only.

Exact filenames may follow repository conventions, but dependency direction is mandatory: UI adapters depend on the project AST; the AST, validator, serializer, and evaluator do not depend on MathLive, MathJSON runtime objects, DOM, Chart.js, Tutor UI, or solvers.

`main.ts` coordinates form and run state but does not own parsing rules, AST dispatch, canonicalization, or rendering policy. Existing solver entry points continue receiving functions.

## 21. Automated test requirements

Tests are deterministic and cover the following.

### Parsing and conversion

- Numbers, variables, constants, unary minus, arithmetic, powers, fractions, every supported function, nested expressions, and grouping.
- Structured implicit multiplication for `2t`, `ty`, `2 sin(t)`, y₀e raised to −t, and adjacent groups.
- MathJSON conversion accepts the closed subset and rejects every unrepresentable node.
- Canonical serialization covers all node types, `-0`, numeric round trips, preserved grouping and term/factor order, canonical `exp` function nodes, and explicit/implicit multiplication equivalence.
- Visual e raised to t, imported `exp(t)`, and imported `Math.exp(t)` produce the same `exp` node and canonical serialization.
- Standalone e remains a constant; a general a raised to b remains a `power` node. Adapter-recognized visual e raised to x becomes `exp(x)`, while a directly constructed project AST `power(constant("e"), x)` remains a power and is not mutated by core canonicalization.

### Variable profiles

- `rhs` accepts `t` and `y`; rejects `t0`, `y0`, `x`, and other names with RHS-specific copy.
- `exact_solution` accepts `t`, `t0`, and `y0`; rejects `y` and unknown names with exact-solution-specific copy.
- `second_order_rhs` accepts `t` and `u`; rejects `y`, `t0`, `y0`, and unknown names with Leap-Frog-specific copy.
- All three profiles pass through parser, validator, canonicalizer, serializer, evaluator, and legacy-import tests. `rhs` and `second_order_rhs` preserve their existing UI roles; `exact_solution` remains unexposed.

### Legacy compatibility

- Accept `exp`, `sin`, `sqrt`, and `y0 * exp(-(t - t0))` in the applicable profile.
- Accept only the approved `Math.exp`, `Math.sin`, and `Math.PI` aliases.
- Confirm `exp(t)` and `Math.exp(t)` import directly to the same canonical `exp` function node as visual e raised to t.
- Reject arbitrary property access, statements, assignments, ternaries, computed properties, `Math.random`, `window.alert`, and trailing tokens.
- Prove accepted legacy text reaches AST evaluation without dynamic execution.

### Validation and evaluation

- Incomplete editing state, valid strict state, unknown variable, unsupported function, missing function argument, invalid structure, and restore/preset validation failure.
- Representative numeric values, implicit multiplication, e, π, natural log, absolute value, nested functions, powers, and fractions.
- The `exp` function node uses `Math.exp` semantics at representative, boundary, overflow, and underflow inputs; tests must not calculate its expected value with `Math.pow(Math.E, x)`.
- A general a raised to b evaluates through the `power` node, while standalone e evaluates through the constant node.
- Non-finite inputs/outputs, division by zero, invalid square root/log domains, and overflow return controlled errors.
- Results agree with current built-in ODE examples at representative finite inputs.

### Rendering and state

- Editable-field LaTeX restoration preserves the confirmed AST.
- Read-only rendering, non-editable/tab behavior, accessible labeling, and display-text fallback.
- Expression details shows LaTeX and canonical parsed text only for the current valid expression.
- Run error summary counts fields, announces itself, and focuses the selected field.
- Preset load/undo, saved restoration, and fingerprint stability use confirmed AST state.
- Tutor segmentation handles inline/block math, malformed delimiters, invalid individual segments, safe fallback, plain text, and no executable handoff.
- Compact toolbar insertion and More symbols target the active field.

### Regression

- All current solver tests remain green.
- Explicit and implicit methods produce unchanged numerical results for equivalent supported expressions.
- Compare continues to use `rhs`. Leap-Frog uses `second_order_rhs`, no longer uses its former `new Function` execution path, and otherwise retains its existing acceleration-expression UX and numerical behavior.
- Production type checks and build succeed.
- No Chinese UI strings are added.
- Milestone 1 exposes no exact-solution or convergence controls.

## 22. Manual browser smoke test

1. Open a first-order method.
2. Confirm the fixed y′ = prefix and editable RHS field.
3. Enter −y.
4. Enter e raised to t with a true superscript.
5. Enter y(1−y) using implicit multiplication.
6. Enter a fraction and square root using the toolbar.
7. Open Expression details and inspect LaTeX and parsed form.
8. Paste `Math.exp(-t)` and confirm textbook-style normalization.
9. Enter an unknown variable and inspect inline plus Run-summary errors.
10. Enter an incomplete fraction and confirm neutral editing state.
11. Blur and confirm strict validation.
12. Run representative explicit and implicit methods and compare expected values.
13. Inspect the Step 3 textbook-style equation display.
14. Test physical-keyboard navigation, toolbar navigation, focus movement, and screen-reader labels.
15. Open More symbols and return focus to the field.
16. Inspect an AI Tutor response containing controlled inline and block math.
17. Force or simulate a rendering failure and confirm readable fallback without changing the numeric result.
18. Confirm no Chinese UI text appears.

Also confirm Compare continues to use the first-order `rhs` profile; the existing Leap-Frog acceleration field accepts `t` and `u` through `second_order_rhs`; both retain their current behavior; legacy saved RHS input restores through the adapter; invalid restored input is controlled; and no exact-solution or convergence UI is present.

## 23. Acceptance criteria

Milestone 1 is ready for review when users can enter the approved first-order RHS subset and existing Leap-Frog acceleration subset in visual MathLive fields, inspect LaTeX and canonical parsed meaning, receive accessible and specific validation feedback, run unchanged numerical methods through explicit AST evaluators, and read textbook-style formulas with robust fallback.

The AST is the single authoritative mathematical representation; MathJSON, LaTeX, legacy text, and Tutor formulas are non-executable adapters or display data. Fingerprints are deterministic and versioned. All three variable profiles are tested: `rhs` remains the first-order/Compare profile, `second_order_rhs` migrates only the existing Leap-Frog field, and `exact_solution` remains unexposed. Canonical exponential expressions use the `exp` function node and `Math.exp` evaluation semantics. No exact-solution or convergence feature is implemented, no new Leap-Frog functionality is added, no Chinese UI is added, and no arbitrary JavaScript reaches the numerical boundary.
