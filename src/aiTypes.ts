/** Context sent to /api/chat — grounded in the current solver run. */
export interface ImplicitDiagnosticsContext {
  nonlinearMethod: "newton" | "fixed_point";
  totalIterations: number;
  maxIterationsPerStep: number;
  finalResidual: number;
  maxResidual: number;
  failedSteps: number;
}

export interface TutorObservedOrderAssessment {
  value?: number;
  status:
    | "reliable"
    | "below_resolution"
    | "no_improvement"
    | "negative"
    | "near_zero"
    | "unavailable";
  message: string;
  coarseLevel: number;
  fineLevel: number;
}

export interface TutorConvergenceLevel {
  level: number;
  h: number;
  finalTimeError: number;
  maximumGlobalError: number;
  finalObservedOrder?: TutorObservedOrderAssessment;
  maximumObservedOrder?: TutorObservedOrderAssessment;
}

export interface TutorConvergenceStudy {
  theoreticalOrder: number;
  interpretation: {
    kind:
      | "consistent_with_theory"
      | "approaching_theory"
      | "not_yet_asymptotic"
      | "refinement_not_improving"
      | "order_unavailable";
    title: string;
    explanation: string;
    primaryObservedOrder?: number;
    evidencePairs: Array<[number, number]>;
  };
  levels: TutorConvergenceLevel[];
  consistencyCheck: {
    status: "passed" | "warning";
    maximumNormalizedResidual?: number;
    maximumResidualTime?: number;
    statement: "This is a numerical consistency check, not a formal proof.";
  };
}

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
    implicitDiagnostics?: ImplicitDiagnosticsContext;
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
  convergenceStudy?: TutorConvergenceStudy;
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
  /** True when AI_TUTOR_MOCK is active on the server (public demo). */
  demoMode?: boolean;
}

export type TutorMessage = ChatRequest["messages"][number];
