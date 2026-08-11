import { describe, expect, it } from "vitest";

import {
  COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT,
  COMPUTATION_TRACE_VERSION,
  createComputationTrace,
} from "./computationTrace";

describe("content-agnostic computation traces", () => {
  it("represents every meaningful step of a bounded finite process", () => {
    const trace = createComputationTrace({
      processKind: "bounded_finite",
      retentionPolicy: "all_meaningful_steps",
      finalStepRetained: true,
      steps: [{ kind: "setup", value: 2 }, { kind: "result", value: 4 }],
    });

    expect(trace).toMatchObject({
      version: COMPUTATION_TRACE_VERSION,
      processKind: "bounded_finite",
      retentionPolicy: "all_meaningful_steps",
      totalMeaningfulStepCount: 2,
      retainedStepCount: 2,
      omittedMiddleWork: false,
      finalStepRetained: true,
    });
    expect(trace.steps).toHaveLength(2);
  });

  it("represents first-five-plus-final retention for a repetitive finite process", () => {
    const trace = createComputationTrace({
      processKind: "repetitive_finite",
      retentionPolicy: "first_five_plus_final_when_distinct",
      totalMeaningfulStepCount: 12,
      finalStepRetained: true,
      steps: [
        { iteration: 0 },
        { iteration: 1 },
        { iteration: 2 },
        { iteration: 3 },
        { iteration: 4 },
        { iteration: 11 },
      ],
    });

    expect(COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT).toBe(5);
    expect(trace).toMatchObject({
      processKind: "repetitive_finite",
      retentionPolicy: "first_five_plus_final_when_distinct",
      totalMeaningfulStepCount: 12,
      retainedStepCount: 6,
      omittedMiddleWork: true,
      finalStepRetained: true,
    });
  });

  it("represents unbounded continuation without claiming a total or final step", () => {
    const trace = createComputationTrace({
      processKind: "unbounded",
      retentionPolicy: "first_five_plus_continuation",
      steps: Array.from(
        { length: COMPUTATION_TRACE_REPRESENTATIVE_STEP_LIMIT },
        (_, index) => ({ index, value: 2 ** index })
      ),
      continuation: {
        kind: "recurrence",
        factor: 2,
      },
    });

    expect(trace).toMatchObject({
      processKind: "unbounded",
      retentionPolicy: "first_five_plus_continuation",
      retainedStepCount: 5,
      omittedMiddleWork: true,
      finalStepRetained: false,
      continuation: { kind: "recurrence", factor: 2 },
    });
    expect("totalMeaningfulStepCount" in trace).toBe(false);
  });

  it("rejects inconsistent finite counts and retention limits", () => {
    expect(() =>
      createComputationTrace({
        processKind: "repetitive_finite",
        retentionPolicy: "first_five_plus_final_when_distinct",
        totalMeaningfulStepCount: 2,
        finalStepRetained: false,
        steps: [{ index: 0 }, { index: 1 }, { index: 2 }],
      })
    ).toThrow(/total meaningful step count/i);

    expect(() =>
      createComputationTrace({
        processKind: "unbounded",
        retentionPolicy: "first_five_plus_continuation",
        steps: Array.from({ length: 6 }, (_, index) => ({ index })),
        continuation: { kind: "recurrence" },
      })
    ).toThrow(/at most 5/i);
  });

  it("defensively copies and deeply freezes trace structures", () => {
    const steps = [{ kind: "sample", values: [1, 2] }];
    const trace = createComputationTrace({
      processKind: "bounded_finite",
      retentionPolicy: "all_meaningful_steps",
      finalStepRetained: true,
      steps,
    });

    expect(trace.steps).not.toBe(steps);
    expect(trace.steps[0]).not.toBe(steps[0]);
    expect(Object.isFrozen(trace)).toBe(true);
    expect(Object.isFrozen(trace.steps)).toBe(true);
    expect(Object.isFrozen(trace.steps[0])).toBe(true);
    expect(Object.isFrozen(trace.steps[0]!.values)).toBe(true);

    steps[0]!.values[0] = 99;
    expect(trace.steps[0]!.values[0]).toBe(1);
    expect(() => (trace.steps as unknown[]).push({})).toThrow();
    expect(() => (trace.steps[0]!.values as number[]).push(3)).toThrow();
  });
});
