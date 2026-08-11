# Numerical T Lab Visual + Motion Language v1

**Status:** Implemented contract

**Version:** 1

**Effective:** 2026-08-11

## 1. Scope and authority

This document is the canonical contract for visual hierarchy, semantic change
markers, and optional motion in Numerical T Lab. It governs presentation only.
It does not change numerical algorithms, Computation Trace, session state,
routing, or mathematical notation.

The [Mathematical Presentation v1 contract](MATHEMATICAL_PRESENTATION.md)
remains authoritative for number display, symbols, equality and approximation,
and accessible formula ownership. When the two contracts meet, mathematical
truth and accessible ownership take precedence over visual effect.

## 2. Visual hierarchy

The platform uses four emphasis levels:

1. **Primary:** problem statement, computed result, and a Lab's main chart.
2. **Secondary:** factors, residual vector, convergence evidence, and the
   immediate explanation supporting the result.
3. **Detail:** candidate values, arithmetic, and trace-owned before/after data.
4. **Status:** selected, stale, unavailable, failed, or changed state.

Position, spacing, weight, and border treatment establish hierarchy before
color. Detail must not compete visually with the computed result. Cross-Lab
Method, Data, Output, and Diagnostics surfaces retain their established stage
identity.

## 3. Semantic state and change markers

The shared marker vocabulary is:

- `selected` — the chosen candidate or active operation;
- `source` — evidence used to produce the next state;
- `target` — the state receiving an operation;
- `changed` — a committed before-to-after difference;
- `solved` — a newly available solved component;
- `maximum` — the selected maximum magnitude.

Every marker includes visible text and a non-color cue such as a leading
border, border style, weight, or underline. Color may reinforce meaning but
must not own it. `stale` and `failed` remain established product status
surfaces, not motion states.

## 4. Motion principles

- Motion explains causality and a committed mathematical state transition.
- Numerical state is committed first; motion visualizes it second.
- Motion consumes result or trace evidence and never creates numerical
  evidence.
- Numerical text is never interpolated through unstored intermediate values.
- Motion never owns session or numerical state.
- Static before, operation, and after evidence remains authoritative.
- Motion is local, bounded, interruptible, optional, and short.
- No understanding or functionality depends on motion.
- Reduced-motion users receive an equally complete static explanation.

Motion does not decorate inactivity. It does not autoplay a computation
walkthrough or delay ordinary experimentation.

## 5. Motion ownership and lifecycle

Ephemeral motion state belongs only to the mounted frontend presentation:

```text
mounted computation presentation
  -> local motion controller
  -> transient DOM classes and transforms
  -> cancellation or disposal
```

Motion state must not enter `packages/numerics`, Computation Trace, a Lab
session, AppSessionStore, Resume metadata, browser history, browser storage,
Tutor state, or Tutor transcript. A remount constructs fresh presentation
state from the already committed result.

## 6. Numerical result and Computation Trace evidence boundary

Computation Trace and immutable numerical results are the evidence authority.
Presentation may select trace-provided rows, indices, operation metadata, and
before/after values. It must not rerun a solver, reconstruct an operation from
final factors, recompute a row, or derive a second numerical timeline.

An animation may move a complete rendered value already present in the trace,
or discretely replace trace-provided before text with trace-provided after
text. Count-up, numeric tweening, and invented intermediate values are
forbidden.

## 7. Automatic versus user-triggered behavior

Automatic motion is limited to short micro-feedback for an interaction or
committed state change. Mathematical transformation motion is user-triggered
through a local **Replay step** control. Walkthroughs do not autoplay.

A future step-through teaching mode requires a separate approved design. It
must remain optional and must not turn normal Run behavior into a timed
sequence.

## 8. Duration tokens

The shared duration vocabulary is deliberately small:

```css
--motion-fast: 140ms;
--motion-state: 220ms;
--motion-transform: 420ms;
```

`fast` supports immediate acknowledgment, `state` supports restrained marker
changes, and `transform` supports a mathematical spatial transformation. A
user-triggered local replay should not exceed about 800ms in total.

## 9. Easing tokens

```css
--ease-standard: cubic-bezier(.2, 0, 0, 1);
--ease-transform: cubic-bezier(.22, 1, .36, 1);
```

The standard curve is used for selection, reveal, and state replacement. The
transform curve is used for measured spatial movement. Bounce, elastic,
overshoot, and playful spring behavior are not part of the product language.

## 10. Reduced-motion behavior

With `prefers-reduced-motion: reduce`, spatial movement and staged delay are
removed. Replay remains operable and resolves immediately to complete static
before, operation, and committed-after evidence with semantic markers. No
function, evidence, control, or focus behavior may be lost.

## 11. Interruption, cancellation, and disposal

Any newer learner action invalidates older presentation motion. Active replay
is cancelled on input edit, Run, preset or dimension change, New experiment,
walkthrough collapse, workflow navigation, route disposal, and rapid replay
restart. Cancellation clears pending frames and timers, removes transient
classes and transforms, and settles any visible replay on its committed trace
after-state. Disposal additionally removes local listeners.

Stale callbacks use local generation identity and may not reapply transient
classes after cancellation. Animation never blocks or queues a state change.

## 12. Approved Linear Systems transformations

Visual + Motion Language v1 approves only:

1. **Row swap:** measured FLIP-style movement makes `R_i <-> R_j` literal by
   moving whole row representations. Labels move with their rows; numeric text
   does not interpolate. P and prior-L evidence remains static.
2. **Elimination:** source and target markers frame the stored row operation;
   the target row changes once from stored before values to stored after
   values, then changed cells receive a short marker.

Pivot selection, substitution, and residual evidence remain static in v1.

## 13. Replay contract

Replay is local to one approved trace step. It never reruns the solver,
creates a result, mutates trace/result/session data, changes meaningful-work
metadata, writes persistence, or enters browser history. A rapid repeat
cancels and restarts only that local presentation. Replay remains keyboard
operable, leaves focus on its button, and does not create live-region chatter.

## 14. Accessibility

Motion is never the sole signal. Static role labels, the row-operation formula,
before/after evidence, changed markers, and understandable button names remain
available. Native buttons own replay interaction and retain visible focus.
Animation does not move focus or generate per-frame announcements. Visual
replay stages are supplementary and do not create duplicate mathematical
accessible owners.

## 15. Mobile behavior

Replay must remain contained at approximately 390px. At very narrow widths,
the presentation favors stacked static evidence over confusing or clipped
spatial movement. Long atomic mathematical expressions use contained local
scrolling when wrapping would damage readability; the document itself must
not overflow horizontally.

## 16. Performance

Use CSS transforms and opacity where possible. A row swap may measure initial
and final rectangles, invert with a transform, play to zero, and clean up.
Batch reads and writes where practical. Do not run continuous animation-frame
numerical updates, animate layout-heavy properties without need, or retain
detached overlays after disposal. No motion dependency is required for v1.

## 17. ODE and PDE extension rules

Future Labs may reuse the same principles only when stored evidence supports a
clear causal state transition. ODE examples include a trace-owned Euler step
or grid-refinement comparison; PDE examples include a stored stencil update or
time-layer transition. Exact and numerical curves must not morph in ways that
imply unstored certainty. High-step-count methods must keep trace generation
bounded under the Computation Trace contract before presentation motion is
considered.

## 18. Explicit negative list

Do not animate page entrances, cards flying in, decorative gradients,
background particles, continuous chart loops, diagnostics appearing, theme
changes, modal theatrics, error shaking, every number change, or counters
counting to a result. Do not add global Replay all, autoplay, P/L synchronized
transformations, chart morphing, canvas/WebGL effects, or a motion library for
the current scope.

## 19. Verification gates

An implementation is acceptable only when focused DOM/lifecycle tests, full
unit verification, TypeScript checks, dependency boundaries, production build,
and diff checks pass. Browser evidence must cover normal motion, keyboard
Replay, rapid replay, cancellation, Light/Dark themes, desktop, approximately
390px mobile, and approximately 320px reflow. Reduced motion must be exercised
in a browser when the available browser surface supports media emulation;
otherwise deterministic DOM tests plus source inspection are required and the
browser limitation must be reported. Manifest review must confirm that the
independently lazy Linear Systems boundary and deferred ODE, Tutor, Glossary,
MathLive, and Compute Engine ownership remain intact.
