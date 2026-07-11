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

The Version 1 interface is English-only. Exact-solution input and the Convergence Study are not yet available.

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
- `src/solvers.ts`: numerical integration APIs and algorithms.
- `docs/PROJECT_HANDOFF.md`: durable contributor handoff.
- `docs/NUMERICAL_CONTRACTS.md`: numerical correctness boundaries.

## Current limitations

- Scalar ODEs only; no systems.
- Fixed step sizes only; no adaptive stepping.
- The AI Tutor is enabled for single-method runs, not Compare mode.
- The exact-solution field and Observed Convergence Order experiment remain future milestones.
- MathLive and Compute Engine are deferred until mathematical editing/rendering is requested, but their lazy chunks are substantial.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
