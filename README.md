# Numerical ODE Lab

**AI-Assisted Educational Solver**

Numerical ODE Lab is a browser-based teaching tool for scalar initial value problems. Choose a numerical method, enter a problem in textbook-style notation, inspect the computed values and plot, compare two first-order methods, and ask the grounded AI Method Tutor about a completed run.

**Live demo:** [numerical-ode-lab-wai.vercel.app](https://numerical-ode-lab-wai.vercel.app/)

## Mathematical input

Step 2 uses a visual MathLive field with a fixed equation prefix. First-order and Compare problems edit only the right-hand side of `y′ =` and allow `t` and `y`. Leap-Frog edits only the acceleration right-hand side of `u″ =` and allows `t` and `u`.

The supported Version 1 subset includes:

- addition, subtraction, multiplication, division, powers, and implicit multiplication;
- fractions, square roots, true superscripts, and parentheses;
- exponential, sine, cosine, tangent, natural logarithm, and absolute value;
- constants e and pi.

For example, users can enter negative y, t minus y, e raised to t, 2 sin(t), y(1−y), a stacked fraction, or a square root without writing JavaScript. A compact toolbar inserts common structures, and **More symbols** opens MathLive's fuller virtual keyboard. The collapsed **Expression details** section shows the current LaTeX display form and a deterministic parsed-expression view; neither is executable source.

Legacy paste compatibility accepts the controlled grammar used by existing problems, including `-y`, `t-y`, `Math.sin(t)-0.1*y`, `-u`, `exp(-t)`, `Math.exp(-t)`, and `Math.PI`. Imported text is parsed into the project-owned AST and normalized back to textbook-style mathematics. Arbitrary JavaScript, global access, assignments, and unapproved `Math.*` properties such as `Math.random()` are intentionally rejected.

The Version 1 interface is English-only. For scalar first-order problems, Step 2 can also accept an optional exact solution using the `t`, `t0`, and `y0` profile. The exact expression is validated by the same project-owned AST pipeline and never changes the original numerical integration.

## Convergence Study

After a successful single-method first-order run with an exact solution, Step 3 offers a default-collapsed **Convergence Study** drawer. Six built-in problems provide exact solutions and teaching guidance: Exponential Decay, Exponential Growth, Linear Forced Equation, Logistic Growth, Oscillatory Forcing, and Stiff Relaxation.

The workflow is:

1. Load a preset or enable **I know the exact solution** and enter a valid exact expression.
2. Run the ordinary simulation; that result remains unchanged.
3. Open **Convergence Study**, choose an independent study base step size and 3–6 binary refinement levels, inspect the fixed-grid preview, and run the study.
4. Compare final-time error with maximum global error, inspect adjacent observed orders, switch the logarithmic chart metric, and read the evidence-based interpretation and teaching sections.

The exact-solution check samples nine points, checks the initial value, and compares a numerical derivative with the ODE. Its visible statement is deliberately: **This is a numerical consistency check, not a formal proof.** A warning can be reviewed and confirmed once for the current study fingerprint; hard finite-value or initial-value mismatches cannot be overridden.

The log-log reference line compares the measured slope with the theoretical order reported by the actual method metadata. It does not claim a known error constant, and the conclusion is not a pass/fail grade. Observed order can differ from theory because a finite experiment may be pre-asymptotic, affected by startup error, near floating-point resolution, or not improving; the app does not claim a specific cause without evidence.

Version 1 does not provide convergence studies for Compare or Leap-Frog, numerical reference solutions, adaptive stepping, exports, or work-precision diagrams.

## Supported methods

| Method | Notes |
|---|---|
| Forward Euler | Explicit, order 1 |
| Backward Euler | Implicit, order 1 |
| Taylor Method (Order 2) | Uses numerical partial derivatives |
| Runge-Kutta 4 | Fixed fourth-order RK |
| Adams-Bashforth (Order p) | Explicit multistep, 1 ≤ p ≤ 8 |
| Adams-Moulton (Order p) | Implicit multistep, 1 ≤ p ≤ 8 |
| BDF (Order p) | Implicit multistep, 1 ≤ p ≤ 6 |
| Leap-Frog | Second-order u″ = a(t,u) |

Multistep methods bootstrap startup values with Runge-Kutta 4 using the same step size.

## Quick start

Requires a current Node.js LTS release.

```bash
git clone https://github.com/TYD-Bruce/numerical-ode-lab.git
cd numerical-ode-lab
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173/`.

For the AI Tutor, start a second terminal:

```bash
npm run dev:api
```

Set `AI_TUTOR_MOCK=true` in `.env.local` for grounded local demo replies, or set a server-side `OPENAI_API_KEY` for live tutoring. Never use a `VITE_` prefix for the OpenAI key because Vite exposes those variables to browser code.

Useful commands:

```bash
npm run test:run
npm run typecheck
npm run typecheck:api
npm run build
npm run verify
npm run preview
```

## Architecture

User expressions follow this boundary:

```text
MathLive field
  -> Compute Engine raw MathJSON adapter
  -> project-owned closed MathAst
  -> profile validation and versioned serialization
  -> explicit numeric evaluator
  -> existing solver function parameters
```

LaTeX and MathJSON are display/adapter data, not numerical authority. Solvers receive numeric closures and do not import MathLive, MathJSON, LaTeX, or DOM code. Tutor math is presentation-only and cannot reach evaluation.

Key locations:

- `src/math/`: AST, validation, canonical serialization, projections, evaluator, adapters, production expression state, and tests.
- `src/math/ui/`: lazy MathLive loading, editable fields, toolbar, validation UI, and read-only rendering.
- `src/main.ts`: three-step application flow and successful-run expression snapshots.
- `src/exactSolution.ts`: numerical exact-solution consistency evidence.
- `src/convergenceStudy.ts`: pure preview, measurement, order, interpretation, chart-model, and runner policy.
- `src/convergenceStudyState.ts`, `src/convergenceStudyView.ts`, `src/convergenceTeaching.ts`: successful-run ownership, drawer rendering, and teaching models.
- `src/convergenceTutor.ts`: current-only serializable Tutor evidence.
- `src/solvers.ts`: numerical integration APIs and algorithms.
- `docs/PROJECT_HANDOFF.md`: durable contributor handoff.
- `docs/NUMERICAL_CONTRACTS.md`: numerical correctness boundaries.

## Current limitations

- Scalar ODEs only; no systems.
- Fixed step sizes only; no adaptive stepping.
- The AI Tutor is enabled for single-method runs, not Compare mode.
- Convergence Study Version 1 is single-method, scalar, first-order, exact-solution-based, and synchronous. It does not cover Compare, Leap-Frog, numerical reference solutions, work-precision, exports, progress, or cancellation.
- MathLive and Compute Engine are deferred until mathematical editing/rendering is requested, but their lazy chunks are substantial.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
