export interface OdeTutorProblemInputs {
  kind: "first_order" | "second_order";
  equationDisplay: string;
  t0: number;
  tEnd: number;
  h: number;
  y0?: number;
  u0?: number;
  v0?: number;
}
