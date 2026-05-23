import type { SeriesPoint, SolverResult } from "./solvers";
import type {
  ChartInstruction,
  ChatRequest,
  ChatResponse,
  OdeLabContext,
  TutorMessage,
} from "./aiTypes";

const SERIES_FULL_THRESHOLD = 80;
const SERIES_PREVIEW_COUNT = 20;

export const SUGGESTED_QUESTIONS = [
  "Explain this method step by step.",
  "What does each variable mean?",
  "Why is the order of accuracy p?",
  "Explain the coefficients.",
  "How should I interpret the graph?",
  "What would happen if I used a smaller h?",
  "Create a table summary of the result.",
] as const;

export interface ProblemInputs {
  kind: "first_order" | "second_order";
  equationDisplay: string;
  t0: number;
  tEnd: number;
  h: number;
  y0?: number;
  u0?: number;
  v0?: number;
}

function sampleSeries(points: SeriesPoint[], max: number): SeriesPoint[] {
  if (points.length <= max) return points;
  const out: SeriesPoint[] = [];
  const lastIdx = points.length - 1;
  for (let i = 0; i < max; i++) {
    const idx = Math.round((i / (max - 1)) * lastIdx);
    out.push(points[idx]!);
  }
  return out;
}

function seriesBounds(points: SeriesPoint[]): {
  tMin: number;
  tMax: number;
  yMin: number;
  yMax: number;
} {
  let tMin = points[0]!.t;
  let tMax = tMin;
  let yMin = points[0]!.y;
  let yMax = yMin;
  for (const p of points) {
    tMin = Math.min(tMin, p.t);
    tMax = Math.max(tMax, p.t);
    yMin = Math.min(yMin, p.y);
    yMax = Math.max(yMax, p.y);
  }
  return { tMin, tMax, yMin, yMax };
}

function toSeriesRow(p: SeriesPoint): { t: number; y: number; v?: number } {
  const row: { t: number; y: number; v?: number } = { t: p.t, y: p.y };
  if (p.v !== undefined) row.v = p.v;
  return row;
}

export function buildOdeLabContext(
  result: SolverResult,
  problem: ProblemInputs
): OdeLabContext {
  const series = result.points;
  const last = series[series.length - 1]!;
  const bounds = seriesBounds(series);
  const small = series.length <= SERIES_FULL_THRESHOLD;

  const resultBlock: OdeLabContext["result"] = {
    finalT: last.t,
    finalY: last.y,
    pointCount: series.length,
    seriesPreview: sampleSeries(series, SERIES_PREVIEW_COUNT).map(toSeriesRow),
    ...bounds,
  };
  if (last.v !== undefined) resultBlock.finalV = last.v;
  if (small) resultBlock.seriesFull = series.map(toSeriesRow);

  const md = result.metadata;
  return {
    problem: {
      kind: problem.kind,
      equationDisplay: problem.equationDisplay,
      t0: problem.t0,
      tEnd: problem.tEnd,
      h: problem.h,
      ...(problem.y0 !== undefined ? { y0: problem.y0 } : {}),
      ...(problem.u0 !== undefined ? { u0: problem.u0 } : {}),
      ...(problem.v0 !== undefined ? { v0: problem.v0 } : {}),
    },
    method: {
      displayName: md.displayName,
      family: md.family,
      order: md.order,
      isImplicit: md.isImplicit,
      startupMethod: md.startupMethod,
      formulaDisplay: md.formulaDisplay,
      coefficients: md.coefficients,
      notes: md.notes,
    },
    result: resultBlock,
  };
}

export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = (await res.json()) as ChatResponse & { error?: string };

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : `Chat request failed (${res.status})`
    );
  }

  if (typeof data.message !== "string") {
    throw new Error("Invalid response from tutor API.");
  }

  return data;
}

/** Strip common LaTeX delimiters if the model returns them anyway. */
export function sanitizeTutorText(text: string): string {
  return text
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/\\alpha_j/g, "αⱼ")
    .replace(/\\beta_j/g, "βⱼ")
    .replace(/u_\{n\+1\}/g, "uₙ₊₁")
    .replace(/f_\{n-j\}/g, "fₙ₋ⱼ")
    .trim();
}

export function isChartInstruction(
  value: unknown
): value is ChartInstruction {
  if (!value || typeof value !== "object") return false;
  const t = (value as ChartInstruction).type;
  return (
    t === "line_chart" ||
    t === "error_table" ||
    t === "zoom_range" ||
    t === "none"
  );
}

export type { TutorMessage, OdeLabContext, ChartInstruction };
