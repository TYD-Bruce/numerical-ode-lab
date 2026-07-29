# Numerical T-Lab Teaching Voice Standard v1

Status: Maintainer-approved language standard.

Runtime/content implementation tracked separately.

Approved by Yiding (Bruce) Tian on 2026-07-28 through the nine decisions
recorded in the
[Maintainer Decision Packet](MAINTAINER_DECISION_PACKET.md). This standard
governs future teaching language. It does not rewrite production copy, publish
Glossary content, or change runtime or numerical behavior.

## Binding plain-language principle

> Explain the core idea first in the plainest correct language. Add notation,
> assumptions, and exceptions only where they prevent a real mathematical
> misunderstanding.

For a new concept, prefer this order:

1. **Plain core** — what the idea means in the shortest accurate language.
2. **Why it matters** — the computation or interpretation it affects.
3. **Formula** — symbols introduced in words before they carry the explanation.
4. **Limits and confusions** — assumptions, exceptions, and nearby concepts
   that must remain distinct.

This sequence controls presentation, not mathematical truth. Move a condition
earlier when omitting it would make the first sentence false.

## Product voice

Numerical T-Lab teaches with a calm, precise, encouraging voice. It assumes
that learners can understand real mathematics when each symbol, condition, and
limitation is introduced clearly.

The voice supports:

> Theory · Tools · Teaching

and:

> Understand → Compute → Visualize → Analyze

Use professional English without bureaucratic filler. Treat warnings as useful
information, not blame. Prefer concrete nouns and verbs. Separate mathematical
fact, numerical evidence, and heuristic guidance.

## Decision examples

### Signed nodal and global error

Plain core:

> The nodal error is the numerical value minus the exact value at the same
> grid point.

Then define \(e_n=u_n-y(t_n)\). Explain that global error refers to the
propagated nodal-error family, while final-time and maximum global error are
separately named absolute metrics. Do not call an aggregate “total error.”

### Local truncation error

Plain core:

> Local truncation error measures the one-step defect found by inserting exact
> data into the numerical update.

Then show the update-specific defect and say that an order-\(p\) method has an
unscaled defect of order \(h^{p+1}\). If it is divided by \(h\), call the
result the step-normalized local defect of order \(h^p\). Do not transfer this
ODE normalization silently to PDE spatial discretization.

### Observed order

Plain core:

> Observed order estimates how quickly a named error metric decreases between
> two adjacent refinements.

Then give the metric, refinement pair, value, and evidence status before using
the logarithmic formula. A reliable value can support the primary summary; it
does not prove that the experiment is asymptotic or establish theoretical
order.

### Absolute stability and A-stability

Plain core:

> The absolute-stability region contains the scaled test-equation values that
> the method does not amplify.

Introduce \(z=h\lambda\), then \(u_{n+1}=R(z)u_n\), then
\(\mathcal S=\{z\in\mathbb C:|R(z)|\le1\}\). Explain A-stability by saying
that the closed nonpositive half-plane is contained in this region. Qualify
\(R_M\) and \(\mathcal S_M\) when comparing methods. Avoid “very stable,”
“stable for every problem,” and similar claims.

### Stiffness

Use this canonical plain definition:

> A problem is stiff when it contains both fast and slow behavior, and
> stability forces a numerical method to use a much smaller step size than
> accuracy alone would require.

Then explain why an implicit method can help in some cases. Do not define
stiffness as a large coefficient, a difficult equation, nonlinearity, or the
mere use of an implicit method.

### Relative error

Plain core:

> Relative error compares absolute error with the magnitude of a nonzero
> reference value.

Then show the ratio. If the reference is zero, say relative error is
unavailable and report absolute error or a separately named scaled metric.
Percent error is 100 percent of the relative error.

### Tolerances

Plain core:

> A tolerance is a threshold for a named algorithm and a named controlled
> quantity.

Use “nonlinear update tolerance,” “nonlinear residual tolerance,”
“exact-solution consistency tolerance,” or “Convergence interpretation
tolerance” where applicable. Reserve “adaptive error-control tolerance” for a
future adaptive algorithm. Never imply that a tolerance guarantees global
accuracy.

### Scalars, vectors, and matrices

Plain core:

> The surrounding words and dimensions tell you whether a symbol is a scalar,
> vector, or matrix.

Use italic lowercase variables for scalars and vectors, and italic uppercase
variables for matrices. Do not mix bold and plain styles. Accessible prose
must name object types instead of relying on visual typography.

## Epistemic language

Use:

- **exact** for a quantity satisfying the stated mathematical model;
- **numerical** or **approximate** for computed discrete values;
- **theoretical** for an analytically established property under stated
  assumptions;
- **observed** or **empirical** for a quantity estimated from computed data;
- **heuristic** for useful guidance that is not a proof or guarantee;
- **consistent with** when evidence supports but does not prove a conclusion;
- **suggests** when evidence is limited or classification-sensitive.

Avoid “proves” for a plot, finite experiment, or consistency check. Avoid
“always,” “never,” and “guaranteed” unless the conditions that make the
statement true are present. Do not say “exact numerical result” when
“numerical approximation” is intended. Do not use “stable” without naming the
stability sense.

## Symbols and accessibility

- Introduce a symbol in words before relying on it.
- Name the object type when it matters.
- Keep exact and approximate symbols distinct.
- Read formulas naturally in accessible text; raw LaTeX is not the
  explanation.
- State what a context-dependent symbol represents here.
- Ensure visual typography and screen-reader text convey the same mathematics.

Preferred:

> Here, \(h\) is the fixed time-step size.

Avoid:

> Choose \(h\).

when the learner has not been told what \(h\) controls.

## Distinctions to preserve

Teaching copy must not collapse:

- signed error, absolute error, and residual;
- nodal global error, final-time error, and maximum global error;
- local truncation error and step-normalized local defect;
- theoretical order, observed order, reliable evidence, and asymptotic proof;
- conditioning and algorithmic stability;
- numerical stability, ODE absolute stability, zero-stability, and equilibrium
  stability;
- stiffness and A-stability;
- consistency and convergence;
- ODE time-step size and PDE grid spacing;
- exact solution and numerical approximation;
- nonlinear update and nonlinear residual;
- algorithmic tolerances and error metrics;
- invertibility and good conditioning;
- pivoting and the permutation matrix that records it;
- LU and PLU factorizations; or
- algorithm iteration and a time or grid step.

## Actions, helper text, warnings, and errors

Button labels describe the immediate action. Prefer labels such as **Run**,
**Compare methods**, **Start convergence study**, **Try again**, **New
experiment**, and **Open AI Tutor**. Avoid generic **Proceed**, **Submit**, or
**Execute**.

Helper text explains what an input controls or why a constraint exists:

> The interval length must be an integer multiple of the fixed step size.

A warning describes a recoverable risk, its consequence, and the learner's
choice:

> The exact-solution check found a noticeable mismatch. You can review the
> equation or continue knowing that the convergence results may be misleading.

An error states what prevented completion, the relevant constraint, and a
practical correction:

> This run needs a fixed grid: \((t_{\mathrm{end}}-t_0)/h\) must be a positive
> integer. Adjust the interval or step size and try again.

Do not expose stack traces, internal identifiers, or implementation jargon.

## Results and interpretation

Name the quantity, scope, and units or scale:

> Maximum global error: the largest absolute difference across the computed
> grid.

Connect evidence to a cautious conclusion:

> The newest reliable maximum-error orders are approaching the method's
> theoretical order. This is consistent with asymptotic convergence over the
> tested refinements.

Do not say that a finite experiment “proved” the order. When evidence is below
floating-point resolution, stagnant, increasing, or not yet asymptotic, state
that condition without blaming the learner.

## AI Tutor tone

The AI Tutor should:

- answer the immediate question first;
- use the current successful Lab state when available;
- distinguish observed results from general theory;
- show one compact formula or example at a time;
- ask a follow-up only when it materially improves the explanation;
- acknowledge uncertainty and missing evidence;
- avoid grading, scolding, or pretending to know the learner's intent; and
- never imply that generated reasoning changes the numerical result.

## Preferred and avoided wording

| Prefer | Avoid | Reason |
|---|---|---|
| numerical approximation | exact numerical value | Preserves exact/approximate status |
| final-time error | unlabeled error at the end | Names the metric scope |
| maximum global error | total error | States the aggregation |
| observed order | actual order | The estimate is empirical |
| theoretical order | true order | The property depends on assumptions |
| absolute-stability region | stable region | Names the stability sense |
| time-step size | delta or step without context | Names the controlled spacing |
| nonlinear iteration converged | the method is stable | Keeps convergence and stability distinct |
| the result is consistent with | the result proves | Avoids overclaiming |
| review this input | fix your mistake | Keeps corrective language neutral |
| unavailable at this resolution | broken | Explains the real state |

## Review checklist

Before shipping new teaching copy, verify:

- the plain core comes first unless an earlier condition prevents an incorrect
  statement;
- every technical term has one intended sense;
- symbols are introduced and accessible text matches them;
- exact, approximate, theoretical, observed, and heuristic claims are distinct;
- the preserved mathematical distinctions above remain intact;
- warnings and errors identify a useful next action;
- buttons use clear action language;
- conclusions match the available evidence;
- mobile and screen-reader versions preserve the same meaning; and
- the copy is English-only unless a separate language strategy is approved.

Production copy still requires a separately authorized reconciliation and
implementation task.
