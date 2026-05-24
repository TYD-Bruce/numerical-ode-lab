# Numerical ODE Lab

**AI-Assisted Educational Solver**

Explore numerical methods for initial value problems, compare orders of accuracy, visualize approximate solutions, and ask follow-up questions about each run — in the browser.

Repository: [github.com/TYD-Bruce/numerical-ode-lab](https://github.com/TYD-Bruce/numerical-ode-lab)

## What it does

Numerical ODE Lab is a teaching-oriented web app for **scalar first-order IVPs**

y′ = f(t, y), y(t₀) = y₀

and a separate **Leap-Frog** mode for second-order problems u″ = a(t, u).

You pick a method, enter times, step size, initial data, and a JavaScript expression for f (or a), then view:

- Final numerical values and a time plot (Chart.js)
- Method metadata: formula, coefficients (multistep), implicit/explicit notes
- Optional **compare two methods** on the same problem (first-order only)
- **AI Method Tutor** (Step 3): context-aware chat that explains the current method, coefficients, accuracy, and graph using solver metadata and result data

## Supported methods

| Method | Notes |
|--------|--------|
| Forward Euler | Explicit, order 1 |
| Backward Euler | Implicit, order 1 |
| Taylor Method (Order 2) | Uses numeric partial derivatives |
| Runge-Kutta 4 | Fixed fourth-order RK |
| Adams-Bashforth (Order p) | Explicit multistep, **1 ≤ p ≤ 8**, coefficients from Lagrange integration |
| Adams-Moulton (Order p) | Implicit multistep, **1 ≤ p ≤ 8**, AB predictor + fixed-point correction |
| BDF (Order p) | Implicit multistep, **1 ≤ p ≤ 6** |
| Leap-Frog | Second-order u″ = a(t, u) |

Multistep methods bootstrap startup values with **Runge-Kutta 4** using the same step size h.

## Quick start

Requires [Node.js](https://nodejs.org/) (LTS recommended).

```bash
git clone https://github.com/TYD-Bruce/numerical-ode-lab.git
cd numerical-ode-lab
npm install
```

**Terminal 1 — frontend**

```bash
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173/**).

**Terminal 2 — API (required for the AI tutor)**

```bash
npm run dev:api
```

Vite proxies `/api/chat` to `http://localhost:3001`. Run a simulation, go to **Step 3 · Output**, then use the **AI Method Tutor** panel on the right.

Other scripts:

```bash
npm run build    # TypeScript check + production bundle in dist/
npm run preview  # Serve the production build locally
```

### Example expressions

Use JavaScript syntax with variables `t` and `y` (first-order) or `t` and `u` (Leap-Frog):

| Model | Expression |
|--------|------------|
| Exponential decay | `-y` |
| Linear | `t - y` |
| Damped oscillation | `-0.1*y + Math.sin(t)` |
| Harmonic oscillator (Leap-Frog) | `-u` |

## AI tutor setup

The tutor calls **`POST /api/chat`** on the server so your OpenAI key is never sent to the browser.

1. Copy [`.env.example`](.env.example) to **`.env.local`** (gitignored).
2. Choose one:
   - **Free UI testing:** `AI_TUTOR_MOCK=true` — grounded mock replies, no OpenAI key.
   - **Live tutoring:** `OPENAI_API_KEY=sk-...` (server-side only).
3. **Do not** use `VITE_OPENAI_API_KEY` or any `VITE_` prefix for OpenAI; Vite exposes those to the browser.
4. Restart **`npm run dev:api`** after editing `.env.local` (env is read at startup).

Example `.env.local` for mock mode:

```env
AI_TUTOR_MOCK=true
```

For a **live** local tutor, use `OPENAI_API_KEY` instead and leave `AI_TUTOR_MOCK` unset or `false`.

See **[Deploying a public demo](#deploying-a-public-demo)** for Vercel (mock mode, no API key).

### Port 3001 already in use

Only one `dev:api` instance should listen on port 3001. If you see `EADDRINUSE`:

- Close the other terminal running `npm run dev:api`, or
- On Windows: `netstat -ano | findstr :3001` then `taskkill /PID <pid> /F`
- Or set `API_PORT=3002` in `.env.local` and update the proxy `target` in [`vite.config.ts`](vite.config.ts) to match.

## Deploying a public demo

Use this for a stable link anyone can open (e.g. Vercel). The public demo should use **demo tutor mode** — no OpenAI key and no API cost.

**A.** Push the project to GitHub.

**B.** In [Vercel](https://vercel.com), import the repo [TYD-Bruce/numerical-ode-lab](https://github.com/TYD-Bruce/numerical-ode-lab).

**C.** Confirm build settings (usually auto-detected from [`vercel.json`](vercel.json)):

| Setting | Value |
|---------|--------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**D.** In **Project Settings → Environment Variables** (Production), set:

```env
AI_TUTOR_MOCK=true
```

**E.** Do **not** set `OPENAI_API_KEY` for the public mock demo.

**F.** Deploy. The serverless route [`api/chat.ts`](api/chat.ts) serves `POST /api/chat` on the same domain as the app.

**G.** Copy the Vercel URL (e.g. `https://your-project.vercel.app`) and add it to the GitHub repo **About** website field and optionally at the top of this README.

**Live AI later:** On Vercel, set `OPENAI_API_KEY`, remove `AI_TUTOR_MOCK` or set it to `false`, and redeploy. Never use `VITE_OPENAI_API_KEY`.

**Do not commit** `.env.local`. Secrets belong only in Vercel env settings or local `.env.local`.

## Project layout

```
numerical-ode-lab/
├── api/
│   ├── chat.ts              # Vercel serverless POST /api/chat
│   └── chatHandler.ts       # OpenAI Responses API + AI_TUTOR_MOCK
├── server/
│   └── dev.ts               # Local API for npm run dev:api
├── docs/
│   └── PROJECT_HANDOFF.md   # Durable spec for agents & contributors
├── src/
│   ├── main.ts              # UI flow
│   ├── aiTypes.ts           # Chat / context types
│   ├── aiTutor.ts           # buildOdeLabContext, API client
│   ├── aiTutorPanel.ts      # Step 3 tutor UI
│   ├── solvers.ts           # Integration API
│   ├── polynomial.ts        # AB / AM / BDF coefficient generators
│   ├── methodCatalog.ts     # Display names & formulas
│   ├── coefficientValidation.ts
│   ├── mathDisplay.ts       # Unicode math in HTML
│   └── style.css
├── index.html
├── .env.example
└── package.json
```

## For developers and Cursor agents

**Read [`docs/PROJECT_HANDOFF.md`](docs/PROJECT_HANDOFF.md)** before larger changes. It documents:

- Mathematical notation and UI naming rules (Unicode in UI, ASCII in code)
- Solver architecture and multistep requirements
- Coefficient validation tables
- Known limitations and recommended next tasks

Coefficient self-checks run on load (see the browser console in dev mode).

## Limitations (current)

- Scalar ODEs only (no systems)
- Fixed step size h (no adaptive stepping)
- AI tutor enabled for single-method runs (not compare mode in v1)
- Expression evaluation via `new Function` — suitable for **local learning**, not untrusted public deployment
- UI math is plain Unicode text (no MathJax/KaTeX)

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
