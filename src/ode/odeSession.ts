import type {
  ModuleTutorSession,
  ResumeSummary,
} from "../app/contracts";
import {
  getConvergenceState,
  removeConvergenceState,
  setConvergenceState,
  type ConvergenceStateRecord,
  type SuccessfulFirstOrderRunSnapshot,
} from "../convergenceStudyState";
import { displayNameFor } from "../methodCatalog";
import { serializeMathAst } from "../math/canonical";
import {
  createEmptyExactExpressionState,
  createDefaultMathExpressionState,
  type PersistedMathExpressionState,
  type PersistedOptionalMathExpressionState,
  type SuccessfulExpressionSnapshot,
} from "../math/problemExpressions";
import {
  createPresetFormState,
  createPresetFormStateFromPreset,
  trackedProblemFieldsEqual,
  type PresetFormState,
} from "../problemPresets";
import type {
  ImplicitDiagnostics,
  MethodFamily,
  SeriesPoint,
  SolverMetadata,
  SolverResult,
} from "../solvers";
import { hasUserTutorMessage } from "../tutor/moduleTutorSession";

export {
  getConvergenceState,
  removeConvergenceState,
  setConvergenceState,
};

export type OdeWorkflowStep = "choose" | "configure" | "results";

export interface OdeSelectedMethod {
  readonly family: MethodFamily;
  readonly order?: number;
}

export type OdeWorkflowSession =
  | { readonly mode: "single" }
  | {
      readonly mode: "compare_pick";
      readonly first: OdeSelectedMethod | null;
    }
  | {
      readonly mode: "compare";
      readonly a: OdeSelectedMethod;
      readonly b: OdeSelectedMethod;
    };

export interface OdeSecondOrderFormState {
  readonly expression: PersistedMathExpressionState;
  readonly u0: string;
  readonly v0: string;
  readonly methodOrderDraft: string;
}

/** Temporary Phase 3 adapter for the private PersistedForm in main.ts. */
export interface OdePersistedFormState {
  readonly t0: string;
  readonly tEnd: string;
  readonly h: string;
  readonly firstExpression: PersistedMathExpressionState;
  readonly secondExpression: PersistedMathExpressionState;
  readonly exactSolutionEnabled: boolean;
  readonly exactExpression: PersistedOptionalMathExpressionState;
  readonly y0: string;
  readonly u0: string;
  readonly v0: string;
  readonly order: string;
}

/** Pure counterpart of the current Tutor ProblemInputs transport shape. */
export interface OdeProblemInputs {
  readonly kind: "first_order" | "second_order";
  readonly equationDisplay: string;
  readonly t0: number;
  readonly tEnd: number;
  readonly h: number;
  readonly y0?: number;
  readonly u0?: number;
  readonly v0?: number;
}

export interface ReadonlySeriesPoint {
  readonly t: number;
  readonly y: number;
  readonly v?: number;
}

export interface ReadonlySolverMetadata {
  readonly displayName: string;
  readonly family: MethodFamily;
  readonly order: number;
  readonly formulaType: string;
  readonly formulaDisplay: string;
  readonly coefficients?: {
    readonly alpha?: readonly number[];
    readonly beta?: readonly number[];
  };
  readonly isImplicit: boolean;
  readonly startupMethod?: string;
  readonly implicitDiagnostics?: Readonly<ImplicitDiagnostics>;
  readonly notes: readonly string[];
}

export interface ReadonlySolverResult {
  readonly points: readonly ReadonlySeriesPoint[];
  readonly metadata: ReadonlySolverMetadata;
}

interface OdeSingleOutput {
  readonly result: ReadonlySolverResult;
  readonly expression: SuccessfulExpressionSnapshot;
  readonly firstOrderRun?: SuccessfulFirstOrderRunSnapshot;
  readonly problemInputs: OdeProblemInputs;
}

interface OdeComparisonOutput {
  readonly a: OdeSelectedMethod;
  readonly b: OdeSelectedMethod;
  readonly resultA: ReadonlySolverResult;
  readonly resultB: ReadonlySolverResult;
  readonly expression: SuccessfulExpressionSnapshot;
}

export interface OdeSessionState {
  readonly version: 1;
  readonly step: OdeWorkflowStep;
  readonly workflow: OdeWorkflowSession;
  readonly selectedMethod: OdeSelectedMethod | null;
  readonly form: PresetFormState;
  readonly secondOrderForm: OdeSecondOrderFormState;
  readonly comparePickError: string;
  readonly output: {
    readonly single?: OdeSingleOutput;
    readonly comparison?: OdeComparisonOutput;
  };
  readonly convergenceByFingerprint: ConvergenceStateRecord;
}

function freezeNumbers(values: number[] | undefined): readonly number[] | undefined {
  return values === undefined ? undefined : Object.freeze([...values]);
}

function createReadonlyMetadata(metadata: SolverMetadata): ReadonlySolverMetadata {
  const coefficients = metadata.coefficients
    ? Object.freeze({
        alpha: freezeNumbers(metadata.coefficients.alpha),
        beta: freezeNumbers(metadata.coefficients.beta),
      })
    : undefined;
  const implicitDiagnostics = metadata.implicitDiagnostics
    ? Object.freeze({ ...metadata.implicitDiagnostics })
    : undefined;
  return Object.freeze({
    ...metadata,
    coefficients,
    implicitDiagnostics,
    notes: Object.freeze([...metadata.notes]),
  });
}

export function createReadonlySolverResult(
  result: SolverResult
): ReadonlySolverResult {
  const points = Object.freeze(
    result.points.map((point: SeriesPoint) => Object.freeze({ ...point }))
  );
  return Object.freeze({
    points,
    metadata: createReadonlyMetadata(result.metadata),
  });
}

export function createBeginnerStarterSession(): OdeSessionState {
  return Object.freeze({
    version: 1 as const,
    step: "choose" as const,
    workflow: Object.freeze({ mode: "single" as const }),
    selectedMethod: Object.freeze({ family: "forward_euler" as const }),
    form: createPresetFormStateFromPreset("exponential_decay"),
    secondOrderForm: Object.freeze({
      expression: createDefaultMathExpressionState("second_order_rhs"),
      u0: "1",
      v0: "0",
      methodOrderDraft: "2",
    }),
    comparePickError: "",
    output: Object.freeze({}),
    convergenceByFingerprint: Object.freeze({}),
  });
}

export function createCurrentCompatibilitySession(): OdeSessionState {
  const rhs = createDefaultMathExpressionState("rhs");
  const exactSolution = createEmptyExactExpressionState();
  return Object.freeze({
    version: 1 as const,
    step: "choose" as const,
    workflow: Object.freeze({ mode: "single" as const }),
    selectedMethod: null,
    form: createPresetFormState({
      rhs,
      exactSolutionEnabled: false,
      exactSolution,
      t0: "0",
      y0: "1",
      tEnd: "5",
      runStepSize: "0.05",
    }),
    secondOrderForm: Object.freeze({
      expression: createDefaultMathExpressionState("second_order_rhs"),
      u0: "1",
      v0: "0",
      methodOrderDraft: "2",
    }),
    comparePickError: "",
    output: Object.freeze({}),
    convergenceByFingerprint: Object.freeze({}),
  });
}

export function selectOdePersistedFormState(
  session: OdeSessionState
): OdePersistedFormState {
  const fields = session.form.current;
  return {
    t0: fields.t0,
    tEnd: fields.tEnd,
    h: fields.runStepSize,
    firstExpression: fields.rhs,
    secondExpression: session.secondOrderForm.expression,
    exactSolutionEnabled: fields.exactSolutionEnabled,
    exactExpression: fields.exactSolution,
    y0: fields.y0,
    u0: session.secondOrderForm.u0,
    v0: session.secondOrderForm.v0,
    order: session.secondOrderForm.methodOrderDraft,
  };
}

function selectedMethodEqual(
  left: OdeSelectedMethod | null,
  right: OdeSelectedMethod | null
): boolean {
  return left?.family === right?.family && left?.order === right?.order;
}

function selectedMethodMatchesMetadata(
  selected: OdeSelectedMethod | null,
  metadata: Pick<ReadonlySolverMetadata, "family" | "order">
): boolean {
  return (
    selected?.family === metadata.family &&
    (selected.order === undefined || selected.order === metadata.order)
  );
}

function workflowCoreEqual(
  left: OdeWorkflowSession,
  right: OdeWorkflowSession
): boolean {
  if (left.mode !== right.mode) return false;
  if (left.mode === "single" && right.mode === "single") return true;
  if (left.mode === "compare_pick" && right.mode === "compare_pick") {
    return selectedMethodEqual(left.first, right.first);
  }
  return (
    left.mode === "compare" &&
    right.mode === "compare" &&
    selectedMethodEqual(left.a, right.a) &&
    selectedMethodEqual(left.b, right.b)
  );
}

export function hasCoreStarterChanges(session: OdeSessionState): boolean {
  const starter = createBeginnerStarterSession();
  return !(
    selectedMethodEqual(session.selectedMethod, starter.selectedMethod) &&
    workflowCoreEqual(session.workflow, starter.workflow) &&
    trackedProblemFieldsEqual(session.form.current, starter.form.current) &&
    session.form.presetId === starter.form.presetId &&
    session.form.customizationSourcePresetId ===
      starter.form.customizationSourcePresetId
  );
}

export function getExperimentIdentity(
  session: OdeSessionState
): "beginner-starter" | "custom-experiment" {
  return hasCoreStarterChanges(session)
    ? "custom-experiment"
    : "beginner-starter";
}

function expressionMatchesSuccessfulRun(
  session: OdeSessionState,
  output: OdeSingleOutput
): boolean {
  const fields = session.form.current;
  const input = output.problemInputs;
  const expression = output.expression;
  if (expression.profile === "second_order_rhs") {
    const secondOrder = session.secondOrderForm;
    return (
      secondOrder.expression.draftLatex === expression.expression.latex &&
      serializeMathAst(
        secondOrder.expression.confirmed.canonicalAst,
        "second_order_rhs"
      ) ===
        serializeMathAst(
          expression.expression.canonicalAst,
          "second_order_rhs"
        ) &&
      Number(fields.t0) === input.t0 &&
      Number(fields.tEnd) === input.tEnd &&
      Number(fields.runStepSize) === input.h &&
      input.kind === "second_order" &&
      Number(secondOrder.u0) === input.u0 &&
      Number(secondOrder.v0) === input.v0
    );
  }
  if (
    fields.rhs.draftLatex !== expression.expression.latex ||
    serializeMathAst(fields.rhs.confirmed.canonicalAst, "rhs") !==
      serializeMathAst(expression.expression.canonicalAst, "rhs") ||
    Number(fields.t0) !== input.t0 ||
    Number(fields.tEnd) !== input.tEnd ||
    Number(fields.runStepSize) !== input.h ||
    (input.kind === "first_order" && Number(fields.y0) !== input.y0) ||
    fields.exactSolutionEnabled !== expression.exactSolutionEnabled
  ) {
    return false;
  }
  if (!fields.exactSolutionEnabled) return true;
  return (
    fields.exactSolution.confirmed !== undefined &&
    expression.exactSolution !== undefined &&
    fields.exactSolution.draftLatex === expression.exactSolution.latex &&
    serializeMathAst(
      fields.exactSolution.confirmed.canonicalAst,
      "exact_solution"
    ) ===
      serializeMathAst(
        expression.exactSolution.canonicalAst,
        "exact_solution"
      )
  );
}

export function hasSuccessfulOutput(session: OdeSessionState): boolean {
  return session.output.single !== undefined || session.output.comparison !== undefined;
}

export function hasUnexecutedCoreDraft(session: OdeSessionState): boolean {
  if (session.output.comparison) {
    return (
      session.workflow.mode !== "compare" ||
      !selectedMethodEqual(session.workflow.a, session.output.comparison.a) ||
      !selectedMethodEqual(session.workflow.b, session.output.comparison.b) ||
      session.form.current.rhs.draftLatex !==
        session.output.comparison.expression.expression.latex
    );
  }
  const output = session.output.single;
  if (!output) return hasCoreStarterChanges(session);
  return (
    !selectedMethodMatchesMetadata(session.selectedMethod, output.result.metadata) ||
    !expressionMatchesSuccessfulRun(session, output)
  );
}

export function hasSuccessfulConvergenceAnalysis(
  session: OdeSessionState
): boolean {
  return Object.values(session.convergenceByFingerprint).some(
    (state) => state.result !== undefined
  );
}

export function computeOdeLabMeaningful(
  session: OdeSessionState,
  tutorSession: ModuleTutorSession
): boolean {
  return (
    hasCoreStarterChanges(session) ||
    hasUnexecutedCoreDraft(session) ||
    session.step !== "choose" ||
    hasSuccessfulOutput(session) ||
    hasSuccessfulConvergenceAnalysis(session) ||
    hasUserTutorMessage(tutorSession)
  );
}

function resumeStepLabel(step: OdeWorkflowStep): ResumeSummary["stepLabel"] {
  if (step === "choose") return "Method";
  if (step === "configure") return "Data";
  return "Output";
}

export function createOdeResumeSummary(
  session: OdeSessionState,
  timestamp: number
): ResumeSummary {
  const convergenceResults = Object.values(session.convergenceByFingerprint).filter(
    (state) => state.result !== undefined
  );
  return Object.freeze({
    moduleId: "ode" as const,
    route: "/ode/initial-value-problems",
    labTitle: "Initial Value Problems Lab",
    stepLabel: resumeStepLabel(session.step),
    ...(session.selectedMethod
      ? {
          methodLabel: displayNameFor(
            session.selectedMethod.family,
            session.selectedMethod.order
          ),
        }
      : {}),
    ...(convergenceResults.length > 0
      ? {
          analysisLabel:
            convergenceResults.some((state) => state.resultStatus === "current")
              ? ("Analysis available" as const)
              : ("Analysis stale" as const),
        }
      : {}),
    lastMeaningfulInteraction: timestamp,
  });
}
