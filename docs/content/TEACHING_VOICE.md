# Teaching Voice

Status: Private-source-reviewed draft; maintainer approval pending.

## Product voice

Numerical T-Lab teaches with a calm, precise, encouraging voice. It assumes the
learner can understand real mathematics when each symbol, condition, and
limitation is introduced clearly.

The voice supports the product pillars:

> Theory · Tools · Teaching

and the learning cycle:

> Understand → Compute → Visualize → Analyze

## Core principles

- Begin with the shortest accurate explanation.
- Add detail only when it helps the learner decide, compute, or interpret.
- Define a concept before using it as an explanation.
- Separate mathematical fact, numerical evidence, and heuristic guidance.
- State assumptions and limitations close to the claim they qualify.
- Prefer concrete nouns and verbs over abstract filler.
- Use professional English without sounding bureaucratic.
- Treat warnings as useful information, not as blame.

## Teaching sequence

For a new concept, prefer:

1. **Definition** — what the term means in this context.
2. **Intuition** — a compact mental model that does not replace the definition.
3. **Why it matters** — the computation or interpretation it affects.
4. **Limitation** — where the explanation stops being reliable or complete.

For a workflow, prefer:

1. **Understand** — identify the mathematical problem and assumptions.
2. **Compute** — choose inputs and a method.
3. **Visualize** — inspect the shape, scale, and comparison.
4. **Analyze** — explain error, convergence, stability, or limitations.

## Epistemic language

Use these words deliberately:

- **exact** for a quantity that satisfies the stated mathematical model;
- **numerical** or **approximate** for computed discrete values;
- **theoretical** for an analytically established property under stated
  assumptions;
- **observed** or **empirical** for a quantity estimated from computed data;
- **heuristic** for useful guidance that is not a proof or guarantee;
- **consistent with** when evidence supports but does not prove a conclusion;
- **suggests** when evidence is limited or classification-sensitive.

Avoid:

- “proves” for a plot, finite experiment, or consistency check;
- “always,” “never,” or “guaranteed” without the conditions that make the
  statement true;
- “exact numerical result” when “numerical approximation” is intended;
- “stable” without identifying the relevant stability sense.

## Concision before detail

A good first sentence should usually fit in one or two lines. A learner who
wants more can then read the formula, interpretation, or limitation.

Preferred:

> The final-time error measures the difference at the endpoint only.

Then add:

> It can be small even when the approximation is less accurate earlier in the
> interval, so compare it with the maximum global error.

Avoid opening with a dense paragraph containing every exception.

## Symbols

- Introduce a symbol in words before relying on it.
- Name the object type when it matters: scalar, vector, matrix, function, grid,
  or sequence.
- Keep exact and approximate symbols visibly distinct.
- Read formulas naturally in accessible text; do not expose raw LaTeX as the
  explanation.
- When a symbol is context-dependent, say what it represents here.

Preferred:

> Here, \(h\) is the fixed time-step size.

Avoid:

> Choose \(h\).

when the learner has not yet been told what \(h\) controls.

## Distinctions to preserve

Teaching copy must not collapse:

- error and residual;
- conditioning and algorithmic stability;
- numerical stability and ODE absolute stability;
- consistency and convergence;
- theoretical order and observed order;
- local truncation error and global error;
- final-time error and maximum global error;
- ODE time-step size and PDE grid spacing;
- exact solution and numerical approximation;
- invertibility and good conditioning;
- pivoting and the permutation matrix that records it;
- LU and PLU factorizations;
- algorithm iteration and a time or grid step.

## Buttons and actions

Button labels describe the immediate action:

- **Run**
- **Compare methods**
- **Start convergence study**
- **Try again**
- **New experiment**
- **Open AI Tutor**

Prefer a verb plus a concrete object when the action is not obvious. Do not use
mathematical jargon as a button label unless the surrounding UI already
defines it.

Avoid:

- **Proceed**
- **Submit**
- **Execute**
- **Calculate** when the action also validates, renders, and updates analysis
  and a more specific label is available.

## Helper text

Helper text explains what an input controls or why a constraint exists.

Preferred:

> The interval length must be an integer multiple of the fixed step size.

Avoid:

> Invalid grid.

Helper text should not repeat the label, introduce an unreviewed definition, or
promise an outcome.

## Warnings

A warning describes a recoverable risk, its consequence, and the learner's
choice.

Pattern:

> **What we found.** Why it may affect interpretation. What you can change or
> choose next.

Preferred:

> The exact-solution check found a noticeable mismatch. You can review the
> equation or continue knowing that the convergence results may be misleading.

Avoid:

> Your exact solution is wrong.

Warnings do not claim failure when the operation may continue.

## Errors

An error states:

1. what prevented completion;
2. the relevant constraint;
3. a practical correction when one is known.

Preferred:

> This run needs a fixed grid: \((t_{\mathrm{end}}-t_0)/h\) must be a positive
> integer. Adjust the interval or step size and try again.

Avoid:

> Computation failed.

Do not expose stack traces, internal identifiers, or implementation jargon.

## Results

Results state the quantity, scope, and units or scale where relevant.

Preferred:

> Maximum global error: the largest absolute difference across the computed
> grid.

Avoid:

> Error: 0.003

when the aggregation and reference are not clear.

## Interpretation

Interpretation connects evidence to a cautious conclusion.

Preferred:

> The newest maximum-error orders are approaching the method's theoretical
> order. This is consistent with asymptotic convergence over the tested
> refinements.

Avoid:

> The method has proved its order.

When evidence is below floating-point resolution, stagnant, increasing, or not
yet asymptotic, say so directly without treating the learner's experiment as a
mistake.

## AI Tutor tone

The AI Tutor should:

- answer the learner's immediate question first;
- use the current successful Lab state when available;
- distinguish observed results from general theory;
- show one compact formula or example at a time;
- ask a short follow-up only when it materially improves the explanation;
- acknowledge uncertainty and missing evidence;
- avoid grading, scolding, or pretending to know the learner's intent;
- never imply that generated reasoning changes the numerical result.

Preferred:

> Your maximum error decreased at each refinement, but the newest observed
> order is still below the theoretical value. Try one finer level if the step
> budget allows; the current ratios may not yet be asymptotic.

Avoid:

> You chose the wrong step size.

## Preferred and avoided wording

| Prefer | Avoid | Reason |
|---|---|---|
| numerical approximation | exact numerical value | Preserves exact/approximate status |
| final-time error | error at the end, when used as an unlabeled metric | Names the scope consistently |
| maximum global error | total error | States the aggregation |
| observed order | actual order | The estimate is empirical |
| theoretical order | true order | The property depends on assumptions and method definition |
| time-step size | delta or step without context | Names the controlled spacing |
| nonlinear iteration converged | the method is stable | Distinguishes convergence and stability senses |
| the result is consistent with | the result proves | Avoids overclaiming from finite evidence |
| review this input | fix your mistake | Keeps corrective language neutral |
| unavailable at this resolution | undefined or broken, when the limitation is numerical resolution | Explains the real state |

## Review checklist

Before shipping new teaching copy, verify:

- every technical term has one intended sense;
- symbols are introduced and accessible text matches them;
- exact, approximate, theoretical, observed, and heuristic claims are distinct;
- error, residual, conditioning, stability, and convergence are not conflated;
- warnings and errors identify a useful next action;
- buttons use clear action language;
- conclusions match the available evidence;
- mobile and screen-reader versions preserve the same meaning;
- the copy is English-only unless a separate language strategy is approved.
