/** Context sent to /api/chat — grounded in the current solver run. */
export interface OdeLabContext {
  problem: {
    kind: "first_order" | "second_order";
    equationDisplay: string;
    t0: number;
    tEnd: number;
    h: number;
    y0?: number;
    u0?: number;
    v0?: number;
  };
  method: {
    displayName: string;
    family: string;
    order?: number;
    isImplicit: boolean;
    startupMethod?: string;
    formulaDisplay?: string;
    coefficients?: {
      alpha?: number[];
      beta?: number[];
    };
    notes?: string[];
  };
  result: {
    finalT: number;
    finalY: number;
    finalV?: number;
    pointCount: number;
    seriesPreview: Array<{ t: number; y: number; v?: number }>;
    seriesFull?: Array<{ t: number; y: number; v?: number }>;
    tMin?: number;
    tMax?: number;
    yMin?: number;
    yMax?: number;
  };
}

export interface ChartInstruction {
  type: "line_chart" | "error_table" | "zoom_range" | "none";
  title?: string;
  xLabel?: string;
  yLabel?: string;
  tMin?: number;
  tMax?: number;
  includePoints?: boolean;
  includeLine?: boolean;
  tableRows?: Array<Record<string, string | number>>;
}

export interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  context: OdeLabContext;
}

export interface ChatResponse {
  message: string;
  chartInstruction?: ChartInstruction;
}

export type TutorMessage = ChatRequest["messages"][number];
