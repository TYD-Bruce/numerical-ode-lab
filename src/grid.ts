/**
 * Browser-safe cap for scalar point storage and Chart.js rendering.
 * Larger runs can allocate large arrays and make the UI unresponsive.
 */
export const MAX_FIXED_STEPS = 100_000;

/**
 * Allows a small number of IEEE-754 rounding errors in (tEnd - t0) / h.
 * 32 ulps accepts ordinary decimal grids such as 0.3 / 0.1 without
 * accepting materially misaligned grids such as 1 / 0.3.
 */
export const GRID_ALIGNMENT_ULPS = 32;

export interface FixedStepGrid {
  steps: number;
}

export function withinFloatingPointTolerance(
  actual: number,
  expected: number,
  ulps = GRID_ALIGNMENT_ULPS
): boolean {
  return (
    Math.abs(actual - expected) <=
    ulps * Number.EPSILON * Math.max(1, Math.abs(actual), Math.abs(expected))
  );
}

function assertFiniteInput(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite.`);
  }
}

export function validateFixedStepGrid(
  t0: number,
  tEnd: number,
  h: number
): FixedStepGrid {
  assertFiniteInput(t0, "Start time t₀");
  assertFiniteInput(tEnd, "End time t_end");
  assertFiniteInput(h, "Step size h");

  if (!(tEnd > t0)) {
    throw new Error("End time t_end must be greater than start time t₀.");
  }
  if (!(h > 0)) {
    throw new Error("Step size h must be positive.");
  }

  const rawSteps = (tEnd - t0) / h;
  const roundedSteps = Math.round(rawSteps);
  if (!Number.isFinite(rawSteps) || !Number.isFinite(roundedSteps)) {
    throw new Error("Fixed-step grid size must be finite.");
  }
  if (
    !withinFloatingPointTolerance(rawSteps, roundedSteps) ||
    roundedSteps < 1
  ) {
    throw new Error(
      "Fixed-step methods require (t_end - t₀) / h to be an integer. Choose a grid-aligned step size h."
    );
  }
  if (roundedSteps > MAX_FIXED_STEPS) {
    throw new Error(
      `This run requires ${roundedSteps} steps, above the current limit of ${MAX_FIXED_STEPS}. Increase h or shorten the interval.`
    );
  }

  const firstStep = t0 + h - t0;
  if (!(t0 + h > t0) || !withinFloatingPointTolerance(firstStep, h)) {
    throw new Error(
      "Step size h is too small to advance the floating-point time grid from t₀."
    );
  }

  return { steps: roundedSteps };
}
