/**
 * Shared chat handler for Vercel serverless and local Express dev server.
 * OPENAI_API_KEY must only exist in server/serverless environment.
 */

export interface ChatHandlerBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  context: Record<string, unknown>;
}

export interface ChatHandlerResult {
  status: number;
  body: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are an AI tutor inside Numerical ODE Lab, an educational web app for numerical methods for ODEs. Your job is to explain the current computed ODE result using the supplied method metadata and result context. Be mathematically accurate, student-friendly, and concise. Use readable Unicode math notation, not raw LaTeX delimiters. Do not invent coefficients or results that are not in the context. If the user asks for a graph change, return both a short explanation and a structured chart instruction when possible.

Notation (use in answers):
- y′ = f(t, y), y(t₀) = y₀
- h = Δt, tₙ = t₀ + nh
- uₙ ≈ yₙ, fₙ = f(tₙ, uₙ)
- Multistep: uₙ₊₁, fₙ₋ⱼ, αⱼ, βⱼ

Scope: Only discuss the current ODE problem, the selected numerical method, numerical ODE concepts (truncation error, stability, convergence, order of accuracy), coefficients, and graph interpretation for this run. Do not solve unrelated math.

Response format: Reply with exactly one JSON object (no markdown fences, no extra text) with:
- "message": string (2–5 short paragraphs max; Unicode math only, never \\( \\) or \\[ \\] or \\alpha_j)
- "chartInstruction": optional object with type one of "line_chart" | "error_table" | "zoom_range" | "none", plus optional title, xLabel, yLabel, tMin, tMax, includePoints, includeLine, tableRows

If no chart change is needed, omit chartInstruction or set type to "none".`;

const MAX_SERIES_IN_CONTEXT = 24;

function isTruthyEnv(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function isMockMode(): boolean {
  return isTruthyEnv(process.env.AI_TUTOR_MOCK);
}

function ctxString(ctx: Record<string, unknown>, path: string[]): string | undefined {
  let cur: unknown = ctx;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "string" ? cur : undefined;
}

function ctxNumber(ctx: Record<string, unknown>, path: string[]): number | undefined {
  let cur: unknown = ctx;
  for (const key of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "number" && Number.isFinite(cur) ? cur : undefined;
}

function buildMockResponse(
  context: Record<string, unknown>,
  userMessage: string
): { message: string; chartInstruction?: Record<string, unknown> } {
  const methodName =
    ctxString(context, ["method", "displayName"]) ?? "the selected method";
  const family = ctxString(context, ["method", "family"]) ?? "unknown";
  const order = ctxNumber(context, ["method", "order"]);
  const formula =
    ctxString(context, ["method", "formulaDisplay"]) ??
    "see the Method details panel in the app";
  const isImplicit = (context.method as { isImplicit?: boolean } | undefined)
    ?.isImplicit;
  const equation =
    ctxString(context, ["problem", "equationDisplay"]) ?? "y′ = f(t, y)";
  const h = ctxNumber(context, ["problem", "h"]);
  const t0 = ctxNumber(context, ["problem", "t0"]);
  const tEnd = ctxNumber(context, ["problem", "tEnd"]);
  const finalT = ctxNumber(context, ["result", "finalT"]);
  const finalY = ctxNumber(context, ["result", "finalY"]);
  const pointCount = ctxNumber(context, ["result", "pointCount"]);
  const q = userMessage.toLowerCase();

  const orderLine =
    order !== undefined
      ? `For this run, the method is treated as order p = ${order}.`
      : "Check the Method details panel for the order of accuracy p.";

  let message = "";
  let chartInstruction: Record<string, unknown> | undefined;

  if (
    q.includes("zoom") ||
    q.includes("focus") ||
    /t from|time from|graph.*\d/.test(q)
  ) {
    const tMin = t0 ?? 0;
    const tMax =
      q.includes("0 to 2") || q.includes("0–2")
        ? 2
        : (tEnd ?? finalT ?? tMin + 2);
    message = `[Mock tutor] I would narrow the plot to t ∈ [${tMin}, ${tMax}] so you can inspect the solution on that window. The curve still comes from your computed series (${pointCount ?? "?"} points, h = ${h ?? "?"}).\n\nThis is a mock response (AI_TUTOR_MOCK=true) — no OpenAI call was made.`;
    chartInstruction = {
      type: "zoom_range",
      title: `Solution on [${tMin}, ${tMax}]`,
      tMin,
      tMax,
    };
  } else if (q.includes("table") || q.includes("summary")) {
    message = `[Mock tutor] Table summary for ${methodName} on the current IVP:\n\n• Problem: ${equation}\n• Grid: t₀ = ${t0 ?? "?"}, t_end = ${tEnd ?? "?"}, h = ${h ?? "?"}\n• Steps stored: ${pointCount ?? "?"}\n• Final: u ≈ ${finalY?.toFixed(6) ?? "?"} at t = ${finalT?.toFixed(6) ?? "?"}\n\nOpen the “Last 12 values” table below the chart for numeric rows. Mock mode — set AI_TUTOR_MOCK=false and OPENAI_API_KEY for full answers.`;
    chartInstruction = {
      type: "error_table",
      title: "Mock result summary",
      tableRows: [
        { t: finalT ?? "", u: finalY ?? "", method: methodName },
        { h: h ?? "", points: pointCount ?? "", family },
      ],
    };
  } else if (
    q.includes("coefficient") ||
    q.includes("alpha") ||
    q.includes("beta") ||
    q.includes("β")
  ) {
    const coeffs = (context.method as { coefficients?: { alpha?: number[]; beta?: number[] } })
      ?.coefficients;
    const alpha = coeffs?.alpha?.map((v) => v.toFixed(6)).join(", ");
    const beta = coeffs?.beta?.map((v) => v.toFixed(6)).join(", ");
    message = `[Mock tutor] Coefficients for ${methodName} (from your run metadata only):\n\n${alpha ? `α = [${alpha}] (BDF-style stencil on uₙ₊₁₋ⱼ)\n\n` : ""}${beta ? `β = [${beta}] (weights on fₙ₋ⱼ in the Adams form)\n\n` : ""}${!alpha && !beta ? "This method has no α/β arrays in context — typical for one-step schemes.\n\n" : ""}Formula on screen: ${formula}\n\nMock mode — coefficients are not invented beyond what the solver sent.`;
  } else if (
    q.includes("step by step") ||
    q.includes("procedure") ||
    q.includes("explain this method")
  ) {
    message = `[Mock tutor] Step-by-step sketch for ${methodName}:\n\n1. Start from the IVP ${equation} with h = Δt.\n2. At each step, form tₙ = t₀ + nh and approximate values uₙ ≈ y(tₙ).\n3. Apply the update: ${formula}\n4. ${isImplicit ? "Because the method is implicit, the new value satisfies a fixed-point equation in uₙ₊₁ (see app notes)." : "The update is explicit: uₙ₊₁ is computed directly from past u and f values."}\n5. After ${pointCount ?? "N"} points, the run ends near t = ${finalT?.toFixed(4) ?? "?"} with u ≈ ${finalY?.toFixed(6) ?? "?"}.\n\n${orderLine} Mock response only.`;
  } else if (
    q.includes("graph") ||
    q.includes("interpret") ||
    q.includes("plot")
  ) {
    message = `[Mock tutor] The chart shows the approximate solution uₙ versus t for ${methodName}. With ${pointCount ?? "?"} points from t₀ to about t = ${finalT?.toFixed(4) ?? "?"}, the curve reflects how your chosen f and h affect stability and accuracy.\n\nIf the graph looks jagged, try smaller h. If it blows up, the method may be unstable for this step size. Mock mode — no live model analysis.`;
  } else if (
    q.includes("smaller h") ||
    q.includes("step size") ||
    q.includes("refine")
  ) {
    message = `[Mock tutor] With smaller h = Δt, you take more steps over [${t0 ?? "?"}, ${tEnd ?? "?"}], so the local truncation error per step shrinks like O(hᵖ) for order p. Expect a smoother plot and a final value closer to the exact solution (when one exists).\n\nYour current run used h = ${h ?? "?"} and p ≈ ${order ?? "?"}. Mock mode.`;
  } else if (
    q.includes("startup") ||
    q.includes("multistep")
  ) {
    const startup = ctxString(context, ["method", "startupMethod"]);
    message = `[Mock tutor] Multistep methods need history before the main formula applies. ${startup ? `This run lists startup: ${startup}.` : "No startup line in context — likely a one-step method."}\n\nEarly steps build uₙ₋ⱼ and fₙ₋ⱼ so the first full step matches order p. Mock mode.`;
  } else if (
    q.includes("truncation") ||
    q.includes("global error") ||
    q.includes("local error")
  ) {
    message = `[Mock tutor] Local truncation error (LTE) measures one step’s mismatch with the exact flow; global error is the accumulated effect over many steps. For a consistent method of order p, LTE is O(hᵖ⁺¹) and global error is typically O(hᵖ) on a fixed interval.\n\n${orderLine} Mock mode — use a real key for exam-style detail tied to your coefficients.`;
  } else if (q.includes("variable") || q.includes("what does") || q.includes("mean")) {
    message = `[Mock tutor] Symbols for this run:\n\n• t, y: independent time and exact solution in y′ = f(t, y)\n• uₙ: numerical approximation at tₙ; fₙ = f(tₙ, uₙ)\n• h = Δt: step size (${h ?? "?"})\n• ${formula}\n\nAll values above come from your current session. Mock mode.`;
  } else if (q.includes("exam") || q.includes("review")) {
    message = `[Mock tutor] Exam-style recap: You solved ${equation} with ${methodName} on [${t0 ?? "?"}, ${tEnd ?? "?"}] using h = ${h ?? "?"}. The method is ${isImplicit ? "implicit" : "explicit"}. ${orderLine} Final computed value u ≈ ${finalY?.toFixed(6) ?? "?"} at t = ${finalT?.toFixed(6) ?? "?"}.\n\nBe ready to state the update formula, define LTE vs global error, and explain why ${family.includes("bdf") ? "BDF needs iteration" : "this scheme behaves as it does"} for order p. Mock mode.`;
  } else {
    message = `[Mock tutor] You asked about “${userMessage.slice(0, 120)}${userMessage.length > 120 ? "…" : ""}” for ${methodName}.\n\nContext I see: ${equation}; h = ${h ?? "?"}; ${pointCount ?? "?"} points; final u ≈ ${finalY?.toFixed(6) ?? "?"} at t = ${finalT?.toFixed(6) ?? "?"}.\n\n${orderLine}\n\nThis answer is generated locally (AI_TUTOR_MOCK=true). Set OPENAI_API_KEY and AI_TUTOR_MOCK=false for full tutoring.`;
  }

  return { message, chartInstruction };
}

function buildUserContextBlock(context: Record<string, unknown>): string {
  const trimmed = { ...context };
  const result = trimmed.result as Record<string, unknown> | undefined;
  if (result?.seriesFull && Array.isArray(result.seriesFull)) {
    const full = result.seriesFull as unknown[];
    if (full.length > MAX_SERIES_IN_CONTEXT) {
      delete result.seriesFull;
    }
  }
  return JSON.stringify(trimmed, null, 0);
}

function parseModelJson(text: string): {
  message: string;
  chartInstruction?: Record<string, unknown>;
} {
  const trimmed = text.trim();
  try {
    const parsed = JSON.parse(trimmed) as {
      message?: string;
      chartInstruction?: Record<string, unknown>;
    };
    if (typeof parsed.message === "string" && parsed.message.length > 0) {
      return {
        message: parsed.message,
        chartInstruction: parsed.chartInstruction,
      };
    }
  } catch {
    /* fall through */
  }

  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        message?: string;
        chartInstruction?: Record<string, unknown>;
      };
      if (typeof parsed.message === "string") {
        return {
          message: parsed.message,
          chartInstruction: parsed.chartInstruction,
        };
      }
    } catch {
      /* fall through */
    }
  }

  return { message: trimmed };
}

async function callOpenAIResponses(
  apiKey: string,
  input: Array<{ role: string; content: string }>
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      instructions: SYSTEM_PROMPT,
      input,
      text: { format: { type: "json_object" } },
      max_output_tokens: 1200,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    output_text?: string;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof data.output_text === "string" && data.output_text.length > 0) {
    return data.output_text;
  }

  for (const item of data.output ?? []) {
    if (item.type === "message") {
      for (const part of item.content ?? []) {
        if (part.type === "output_text" && part.text) {
          return part.text;
        }
      }
    }
  }

  throw new Error("OpenAI response had no text output.");
}

export async function handleChatRequest(
  body: ChatHandlerBody
): Promise<ChatHandlerResult> {
  if (!body?.messages?.length) {
    return { status: 400, body: { error: "messages array is required." } };
  }
  if (!body.context || typeof body.context !== "object") {
    return { status: 400, body: { error: "context object is required." } };
  }

  const last = body.messages[body.messages.length - 1];
  if (!last || last.role !== "user") {
    return {
      status: 400,
      body: { error: "Last message must be from the user." },
    };
  }

  if (isMockMode()) {
    const mock = buildMockResponse(body.context, last.content);
    const response: Record<string, unknown> = { message: mock.message };
    if (
      mock.chartInstruction &&
      mock.chartInstruction.type !== "none"
    ) {
      response.chartInstruction = mock.chartInstruction;
    }
    return { status: 200, body: response };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error:
          "OPENAI_API_KEY is not configured. Add it to .env.local (local) or your deployment environment. Do not use VITE_ prefixes. Or set AI_TUTOR_MOCK=true to test the UI without OpenAI.",
      },
    };
  }

  const contextBlock = buildUserContextBlock(body.context);
  const history = body.messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const input: Array<{ role: string; content: string }> = [
    {
      role: "user",
      content: `Current lab context (JSON):\n${contextBlock}`,
    },
    {
      role: "assistant",
      content:
        "I have the Numerical ODE Lab context and will explain using only that data.",
    },
    ...history,
    { role: "user", content: last.content },
  ];

  try {
    const raw = await callOpenAIResponses(apiKey, input);
    const parsed = parseModelJson(raw);
    const response: Record<string, unknown> = { message: parsed.message };
    if (
      parsed.chartInstruction &&
      typeof parsed.chartInstruction === "object" &&
      parsed.chartInstruction.type !== "none"
    ) {
      response.chartInstruction = parsed.chartInstruction;
    }
    return { status: 200, body: response };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { status: 502, body: { error: msg } };
  }
}
