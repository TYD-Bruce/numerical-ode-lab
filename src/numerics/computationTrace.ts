export const COMPUTATION_TRACE_VERSION = 1;
export const COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT = 5;

export type ComputationTraceProcessKind =
  | "bounded_finite"
  | "repetitive_finite"
  | "unbounded";

export type ComputationTraceRetentionPolicy =
  | "all_meaningful_steps"
  | "first_five_plus_final_when_distinct"
  | "first_five_plus_continuation";

interface ComputationTraceBase<TStep extends object> {
  readonly version: typeof COMPUTATION_TRACE_VERSION;
  readonly processKind: ComputationTraceProcessKind;
  readonly retentionPolicy: ComputationTraceRetentionPolicy;
  readonly retainedStepCount: number;
  readonly omittedMiddleWork: boolean;
  readonly finalStepRetained: boolean;
  readonly steps: readonly TStep[];
}

export interface BoundedFiniteComputationTrace<TStep extends object>
  extends ComputationTraceBase<TStep> {
  readonly processKind: "bounded_finite";
  readonly retentionPolicy: "all_meaningful_steps";
  readonly totalMeaningfulStepCount: number;
  readonly omittedMiddleWork: false;
}

export interface RepetitiveFiniteComputationTrace<TStep extends object>
  extends ComputationTraceBase<TStep> {
  readonly processKind: "repetitive_finite";
  readonly retentionPolicy: "first_five_plus_final_when_distinct";
  readonly totalMeaningfulStepCount: number;
}

export interface UnboundedComputationTrace<
  TStep extends object,
  TContinuation extends object,
>
  extends ComputationTraceBase<TStep> {
  readonly processKind: "unbounded";
  readonly retentionPolicy: "first_five_plus_continuation";
  readonly omittedMiddleWork: true;
  readonly finalStepRetained: false;
  readonly continuation: TContinuation;
  readonly totalMeaningfulStepCount?: never;
}

export type ComputationTrace<
  TStep extends object,
  TContinuation extends object = never,
> =
  | BoundedFiniteComputationTrace<TStep>
  | RepetitiveFiniteComputationTrace<TStep>
  | UnboundedComputationTrace<TStep, TContinuation>;

export interface BoundedFiniteComputationTraceInput<TStep extends object> {
  readonly processKind: "bounded_finite";
  readonly retentionPolicy: "all_meaningful_steps";
  readonly finalStepRetained: boolean;
  readonly steps: readonly TStep[];
}

export interface RepetitiveFiniteComputationTraceInput<TStep extends object> {
  readonly processKind: "repetitive_finite";
  readonly retentionPolicy: "first_five_plus_final_when_distinct";
  readonly totalMeaningfulStepCount: number;
  readonly finalStepRetained: boolean;
  readonly steps: readonly TStep[];
}

export interface UnboundedComputationTraceInput<
  TStep extends object,
  TContinuation extends object,
> {
  readonly processKind: "unbounded";
  readonly retentionPolicy: "first_five_plus_continuation";
  readonly steps: readonly TStep[];
  readonly continuation: TContinuation;
}

export type ComputationTraceInput<
  TStep extends object,
  TContinuation extends object = never,
> =
  | BoundedFiniteComputationTraceInput<TStep>
  | RepetitiveFiniteComputationTraceInput<TStep>
  | UnboundedComputationTraceInput<TStep, TContinuation>;

function copyAndFreezeTraceData<T>(value: T, active: WeakSet<object>): T {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value !== "object") {
    throw new TypeError("Computation trace data must contain pure structured values.");
  }
  if (active.has(value)) {
    throw new TypeError("Computation trace data must not contain cycles.");
  }

  active.add(value);
  if (Array.isArray(value)) {
    const copy = value.map((entry) => copyAndFreezeTraceData(entry, active));
    active.delete(value);
    return Object.freeze(copy) as T;
  }

  const prototype = Object.getPrototypeOf(value) as object | null;
  if (prototype !== Object.prototype && prototype !== null) {
    active.delete(value);
    throw new TypeError("Computation trace data must use plain records and arrays.");
  }

  const copy: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = copyAndFreezeTraceData(entry, active);
  }
  active.delete(value);
  return Object.freeze(copy) as T;
}

function copiedSteps<TStep extends object>(steps: readonly TStep[]): readonly TStep[] {
  return copyAndFreezeTraceData(steps, new WeakSet<object>());
}

function requireNonnegativeSafeInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${field} must be a nonnegative safe integer.`);
  }
}

/**
 * Creates an immutable, defensively copied computation trace. The factory
 * derives retained counts and enforces the product's bounded retention modes;
 * numerical producers remain responsible for the semantic step records.
 */
export function createComputationTrace<
  TStep extends object,
  TContinuation extends object = never,
>(
  input: ComputationTraceInput<TStep, TContinuation>
): ComputationTrace<TStep, TContinuation> {
  const steps = copiedSteps(input.steps);
  const retainedStepCount = steps.length;

  if (input.processKind === "bounded_finite") {
    if (input.finalStepRetained && retainedStepCount === 0) {
      throw new RangeError("A retained final step requires at least one trace step.");
    }
    return Object.freeze({
      version: COMPUTATION_TRACE_VERSION,
      processKind: input.processKind,
      retentionPolicy: input.retentionPolicy,
      totalMeaningfulStepCount: retainedStepCount,
      retainedStepCount,
      omittedMiddleWork: false as const,
      finalStepRetained: input.finalStepRetained,
      steps,
    });
  }

  if (input.processKind === "repetitive_finite") {
    requireNonnegativeSafeInteger(
      input.totalMeaningfulStepCount,
      "The total meaningful step count"
    );
    if (input.totalMeaningfulStepCount < retainedStepCount) {
      throw new RangeError(
        "The total meaningful step count cannot be smaller than the retained step count."
      );
    }
    const retentionLimit =
      COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT +
      (input.finalStepRetained ? 1 : 0);
    if (retainedStepCount > retentionLimit) {
      throw new RangeError(
        `A repetitive finite trace may retain at most ${retentionLimit} steps under this policy.`
      );
    }
    if (input.finalStepRetained && retainedStepCount === 0) {
      throw new RangeError("A retained final step requires at least one trace step.");
    }
    return Object.freeze({
      version: COMPUTATION_TRACE_VERSION,
      processKind: input.processKind,
      retentionPolicy: input.retentionPolicy,
      totalMeaningfulStepCount: input.totalMeaningfulStepCount,
      retainedStepCount,
      omittedMiddleWork: input.totalMeaningfulStepCount > retainedStepCount,
      finalStepRetained: input.finalStepRetained,
      steps,
    });
  }

  if (retainedStepCount > COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT) {
    throw new RangeError(
      `An unbounded trace may retain at most ${COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT} sequential steps.`
    );
  }
  if (input.continuation === undefined) {
    throw new TypeError("An unbounded trace requires continuation metadata.");
  }
  const continuation = copyAndFreezeTraceData(
    input.continuation,
    new WeakSet<object>()
  );
  return Object.freeze({
    version: COMPUTATION_TRACE_VERSION,
    processKind: input.processKind,
    retentionPolicy: input.retentionPolicy,
    retainedStepCount,
    omittedMiddleWork: true as const,
    finalStepRetained: false as const,
    steps,
    continuation,
  });
}
