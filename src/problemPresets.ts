import type { MethodFamily } from "./solvers";
import { serializeMathAst } from "./math/canonical";
import type { MathExpression } from "./math/expression";
import { createMathExpressionFromLegacy } from "./math/legacyAdapter";
import type {
  PersistedMathExpressionState,
  PersistedOptionalMathExpressionState,
} from "./math/problemExpressions";

export type ProblemPresetId =
  | "exponential_decay"
  | "exponential_growth"
  | "linear_forced"
  | "logistic_growth"
  | "oscillatory_forcing"
  | "stiff_relaxation";

type FirstOrderMethodFamily = Exclude<MethodFamily, "leapfrog">;

export interface ProblemPreset {
  readonly id: ProblemPresetId;
  readonly name: string;
  readonly rhs: MathExpression;
  readonly exactSolution: MathExpression;
  readonly t0: number;
  readonly y0: number;
  readonly tEnd: number;
  readonly recommendedRunStepSize: number;
  readonly teachingSummary: string;
  readonly observationGuidance: string;
  readonly suggestedMethods: readonly FirstOrderMethodFamily[];
  readonly warning: string;
  readonly explicitStepGuidance?: string;
}

export interface TrackedProblemFields {
  readonly rhs: PersistedMathExpressionState;
  readonly exactSolutionEnabled: boolean;
  readonly exactSolution: PersistedOptionalMathExpressionState;
  readonly t0: string;
  readonly y0: string;
  readonly tEnd: string;
  readonly runStepSize: string;
}

interface PresetStateSnapshot {
  readonly current: TrackedProblemFields;
  readonly baseline: TrackedProblemFields;
  readonly presetId?: ProblemPresetId;
  readonly customizationSourcePresetId?: ProblemPresetId;
}

export interface PresetFormState extends PresetStateSnapshot {
  readonly undoSnapshot?: PresetStateSnapshot;
}

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
};

function expression(source: string, profile: "rhs" | "exact_solution"): MathExpression {
  return deepFreeze(createMathExpressionFromLegacy(source, profile));
}

function definePreset(value: ProblemPreset): ProblemPreset {
  return deepFreeze(value);
}

export const PROBLEM_PRESETS: readonly ProblemPreset[] = deepFreeze([
  definePreset({
    id: "exponential_decay",
    name: "Exponential Decay",
    rhs: expression("-y", "rhs"),
    exactSolution: expression("exp(-t)", "exact_solution"),
    t0: 0,
    y0: 1,
    tEnd: 5,
    recommendedRunStepSize: 0.2,
    teachingSummary: "Basic decay, global error, and stability.",
    observationGuidance: "Watch how the numerical solution approaches zero and how coarse explicit steps can distort the decay.",
    suggestedMethods: ["forward_euler", "taylor", "rk4", "backward_euler"],
    warning: "Unusually large explicit steps may distort the decay, create oscillations, or make values grow.",
  }),
  definePreset({
    id: "exponential_growth",
    name: "Exponential Growth",
    rhs: expression("y", "rhs"),
    exactSolution: expression("exp(t)", "exact_solution"),
    t0: 0,
    y0: 1,
    tEnd: 3,
    recommendedRunStepSize: 0.1,
    teachingSummary: "Error growth with solution magnitude.",
    observationGuidance: "Compare relative shape with absolute error as the exact solution becomes larger.",
    suggestedMethods: ["forward_euler", "taylor", "rk4"],
    warning: "Absolute numerical error can grow as the solution magnitude grows, even when the overall trend is correct.",
  }),
  definePreset({
    id: "linear_forced",
    name: "Linear Forced Equation",
    rhs: expression("t-y", "rhs"),
    exactSolution: expression("t-1+2*exp(-t)", "exact_solution"),
    t0: 0,
    y0: 1,
    tEnd: 5,
    recommendedRunStepSize: 0.2,
    teachingSummary: "A nonhomogeneous linear equation combining transient and forcing behavior.",
    observationGuidance: "Look for the decaying transient together with the growing linear response to the forcing.",
    suggestedMethods: ["taylor", "rk4", "adams_bashforth", "adams_moulton"],
    warning: "Coarse steps may obscure the transient component near the start of the interval.",
  }),
  definePreset({
    id: "logistic_growth",
    name: "Logistic Growth",
    rhs: expression("y*(1-y)", "rhs"),
    exactSolution: expression("1/(1+exp(-t))", "exact_solution"),
    t0: 0,
    y0: 0.5,
    tEnd: 10,
    recommendedRunStepSize: 0.25,
    teachingSummary: "Nonlinearity, saturation, and equilibrium approach.",
    observationGuidance: "Watch the growth slow as the solution approaches its equilibrium value of one.",
    suggestedMethods: ["forward_euler", "rk4", "backward_euler"],
    warning: "Coarse explicit steps may overshoot or distort the saturation behavior.",
  }),
  definePreset({
    id: "oscillatory_forcing",
    name: "Oscillatory Forcing",
    rhs: expression("cos(t)", "rhs"),
    exactSolution: expression("sin(t)", "exact_solution"),
    t0: 0,
    y0: 0,
    tEnd: 6,
    recommendedRunStepSize: 0.1,
    teachingSummary: "Periodic solution and endpoint-versus-interval error behavior.",
    observationGuidance: "Compare errors across the interval; endpoint cancellation can make final-time error unusually small.",
    suggestedMethods: ["taylor", "rk4", "adams_bashforth", "adams_moulton"],
    warning: "Coarse grids may under-resolve the periodic behavior, while endpoint cancellation can hide larger interval-wide errors.",
  }),
  definePreset({
    id: "stiff_relaxation",
    name: "Stiff Relaxation",
    rhs: expression("-1000*(y-cos(t))-sin(t)", "rhs"),
    exactSolution: expression("cos(t)", "exact_solution"),
    t0: 0,
    y0: 1,
    tEnd: 0.1,
    recommendedRunStepSize: 0.0005,
    teachingSummary: "Stiffness, absolute stability, and implicit-method diagnostics.",
    observationGuidance: "Compare explicit stability restrictions with the behavior and nonlinear diagnostics of implicit methods.",
    suggestedMethods: ["backward_euler", "adams_moulton", "bdf"],
    warning: "Explicit methods require very small steps for the fast mode; this is stability guidance, not a guarantee of a particular run outcome.",
    explicitStepGuidance: "Linear stability guidance: Forward Euler and Taylor 2 need h below about 0.002 on the fast mode; RK4 needs h below about 0.0028. Do not infer instability without running the method.",
  }),
]);

const byId = new Map(PROBLEM_PRESETS.map((preset) => [preset.id, preset]));

export function problemPresetById(id: ProblemPresetId): ProblemPreset {
  const preset = byId.get(id);
  if (!preset) throw new Error(`Unknown problem preset: ${id}`);
  return preset;
}

function cloneFields(fields: TrackedProblemFields): TrackedProblemFields {
  return {
    ...fields,
    rhs: { ...fields.rhs },
    exactSolution: { ...fields.exactSolution },
  };
}

function expressionStateKey(
  state: PersistedMathExpressionState | PersistedOptionalMathExpressionState
): string {
  const confirmed = state.confirmed
    ? serializeMathAst(state.confirmed.canonicalAst, state.profile)
    : null;
  return JSON.stringify([state.profile, state.draftLatex, state.validationKind, confirmed]);
}

export function trackedProblemFieldsEqual(
  left: TrackedProblemFields,
  right: TrackedProblemFields
): boolean {
  return (
    expressionStateKey(left.rhs) === expressionStateKey(right.rhs) &&
    left.exactSolutionEnabled === right.exactSolutionEnabled &&
    expressionStateKey(left.exactSolution) === expressionStateKey(right.exactSolution) &&
    left.t0 === right.t0 &&
    left.y0 === right.y0 &&
    left.tEnd === right.tEnd &&
    left.runStepSize === right.runStepSize
  );
}

export function createPresetFormState(fields: TrackedProblemFields): PresetFormState {
  return { current: cloneFields(fields), baseline: cloneFields(fields) };
}

export function isPresetFormDirty(state: PresetFormState): boolean {
  return !trackedProblemFieldsEqual(state.current, state.baseline);
}

export function updatePresetProblemFields(
  state: PresetFormState,
  fields: TrackedProblemFields
): PresetFormState {
  if (trackedProblemFieldsEqual(state.current, fields)) return state;
  const source = state.presetId ?? state.customizationSourcePresetId;
  return {
    ...state,
    current: cloneFields(fields),
    presetId: undefined,
    customizationSourcePresetId: source,
  };
}

function fieldsFromPreset(preset: ProblemPreset): TrackedProblemFields {
  return {
    rhs: {
      profile: "rhs",
      draftLatex: preset.rhs.latex,
      validationKind: "ready",
      confirmed: preset.rhs,
    },
    exactSolutionEnabled: true,
    exactSolution: {
      profile: "exact_solution",
      draftLatex: preset.exactSolution.latex,
      validationKind: "ready",
      confirmed: preset.exactSolution,
    },
    t0: String(preset.t0),
    y0: String(preset.y0),
    tEnd: String(preset.tEnd),
    runStepSize: String(preset.recommendedRunStepSize),
  };
}

export function createPresetFormStateFromPreset(
  id: ProblemPresetId
): PresetFormState {
  const fields = fieldsFromPreset(problemPresetById(id));
  return {
    current: cloneFields(fields),
    baseline: cloneFields(fields),
    presetId: id,
    customizationSourcePresetId: undefined,
  };
}

export function loadProblemPreset(
  state: PresetFormState,
  id: ProblemPresetId
): PresetFormState {
  const fields = fieldsFromPreset(problemPresetById(id));
  const undoSnapshot: PresetStateSnapshot = {
    current: cloneFields(state.current),
    baseline: cloneFields(state.baseline),
    presetId: state.presetId,
    customizationSourcePresetId: state.customizationSourcePresetId,
  };
  return {
    current: cloneFields(fields),
    baseline: cloneFields(fields),
    presetId: id,
    customizationSourcePresetId: undefined,
    undoSnapshot,
  };
}

export function undoProblemPreset(state: PresetFormState): PresetFormState {
  if (!state.undoSnapshot) return state;
  return {
    current: cloneFields(state.undoSnapshot.current),
    baseline: cloneFields(state.undoSnapshot.baseline),
    presetId: state.undoSnapshot.presetId,
    customizationSourcePresetId: state.undoSnapshot.customizationSourcePresetId,
  };
}
