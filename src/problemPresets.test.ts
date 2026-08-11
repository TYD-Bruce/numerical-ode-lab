import { describe, expect, it } from "vitest";
import { compileMathExpression } from "@numerical-t-lab/numerics/expressions/expression";
import { createMathExpressionFromLegacy } from "@numerical-t-lab/numerics/expressions/legacy-adapter";
import {
  createEmptyExactExpressionState,
  createDefaultMathExpressionState,
} from "./math/problemExpressions";
import {
  PROBLEM_PRESETS,
  createPresetFormState,
  isPresetFormDirty,
  loadProblemPreset,
  problemPresetById,
  trackedProblemFieldsEqual,
  undoProblemPreset,
  updatePresetProblemFields,
  type TrackedProblemFields,
} from "./problemPresets";

function initialFields(): TrackedProblemFields {
  return {
    rhs: createDefaultMathExpressionState("rhs"),
    exactSolutionEnabled: false,
    exactSolution: createEmptyExactExpressionState(),
    t0: "0",
    y0: "1",
    tEnd: "5",
    runStepSize: "0.05",
  };
}

describe("first-order problem presets", () => {
  it("defines the six approved immutable presets and run defaults", () => {
    expect(PROBLEM_PRESETS.map(({ id, name, tEnd, recommendedRunStepSize }) => ({
      id,
      name,
      tEnd,
      h: recommendedRunStepSize,
    }))).toEqual([
      { id: "exponential_decay", name: "Exponential Decay", tEnd: 5, h: 0.2 },
      { id: "exponential_growth", name: "Exponential Growth", tEnd: 3, h: 0.1 },
      { id: "linear_forced", name: "Linear Forced Equation", tEnd: 5, h: 0.2 },
      { id: "logistic_growth", name: "Logistic Growth", tEnd: 10, h: 0.25 },
      { id: "oscillatory_forcing", name: "Oscillatory Forcing", tEnd: 6, h: 0.1 },
      { id: "stiff_relaxation", name: "Stiff Relaxation", tEnd: 0.1, h: 0.0005 },
    ]);
    for (const preset of PROBLEM_PRESETS) {
      expect(Object.isFrozen(preset)).toBe(true);
      expect(Object.isFrozen(preset.rhs.canonicalAst)).toBe(true);
      expect(Object.isFrozen(preset.exactSolution.canonicalAst)).toBe(true);
      expect(preset.teachingSummary).not.toBe("");
      expect(preset.observationGuidance).not.toBe("");
      expect(preset.suggestedMethods.length).toBeGreaterThan(0);
      expect(preset.warning).not.toBe("");
    }
    expect(problemPresetById("exponential_decay").teachingSummary).toBe(
      "Basic decay and global error, with coarse-step behavior that can motivate absolute-stability analysis."
    );
    expect(problemPresetById("stiff_relaxation").warning).toBe(
      "Explicit methods require very small steps for the fast mode; this is stability guidance, not a guarantee of a particular run outcome."
    );
  });

  it("stores validated RHS and exact-solution AST meaning", () => {
    const cases = [
      ["exponential_decay", 0.4, 2, -2, Math.exp(-0.4)],
      ["exponential_growth", 0.4, 2, 2, Math.exp(0.4)],
      ["linear_forced", 0.4, 2, -1.6, 0.4 - 1 + 2 * Math.exp(-0.4)],
      ["logistic_growth", 0.4, 0.5, 0.25, 1 / (1 + Math.exp(-0.4))],
      ["oscillatory_forcing", 0.4, 2, Math.cos(0.4), Math.sin(0.4)],
      [
        "stiff_relaxation",
        0.04,
        1,
        -1000 * (1 - Math.cos(0.04)) - Math.sin(0.04),
        Math.cos(0.04),
      ],
    ] as const;
    for (const [id, t, y, rhsValue, exactValue] of cases) {
      const preset = problemPresetById(id);
      expect(compileMathExpression(preset.rhs, "rhs").evaluate(t, y)).toBeCloseTo(rhsValue);
      expect(compileMathExpression(preset.exactSolution, "exact_solution").evaluate(t, 0, preset.y0))
        .toBeCloseTo(exactValue);
    }
  });

  it("loads clean state directly and creates one exact pre-load snapshot", () => {
    const initial = createPresetFormState(initialFields());
    expect(isPresetFormDirty(initial)).toBe(false);
    const loaded = loadProblemPreset(initial, "exponential_decay");

    expect(loaded.current).toMatchObject({
      exactSolutionEnabled: true,
      t0: "0",
      y0: "1",
      tEnd: "5",
      runStepSize: "0.2",
    });
    expect(loaded.presetId).toBe("exponential_decay");
    expect(loaded.customizationSourcePresetId).toBeUndefined();
    expect(isPresetFormDirty(loaded)).toBe(false);
    expect(loaded.undoSnapshot?.current.exactSolutionEnabled).toBe(false);
  });

  it("detects every tracked draft and numeric change, including manual restoration", () => {
    const initial = createPresetFormState(initialFields());
    const variants: TrackedProblemFields[] = [
      { ...initial.current, tEnd: "6" },
      { ...initial.current, exactSolutionEnabled: true },
      {
        ...initial.current,
        rhs: { ...initial.current.rhs, draftLatex: "t^{}", validationKind: "incomplete" },
      },
      {
        ...initial.current,
        exactSolution: { ...initial.current.exactSolution, draftLatex: "x", validationKind: "invalid" },
      },
    ];
    for (const fields of variants) {
      expect(isPresetFormDirty(updatePresetProblemFields(initial, fields))).toBe(true);
    }
    const changed = updatePresetProblemFields(initial, { ...initial.current, y0: "2" });
    const restored = updatePresetProblemFields(changed, initial.current);
    expect(isPresetFormDirty(restored)).toBe(false);
  });

  it("keeps customization identity sticky until an explicit reload", () => {
    const loaded = loadProblemPreset(createPresetFormState(initialFields()), "logistic_growth");
    const edited = updatePresetProblemFields(loaded, { ...loaded.current, y0: "0.6" });
    expect(edited.presetId).toBeUndefined();
    expect(edited.customizationSourcePresetId).toBe("logistic_growth");

    const manuallyRestored = updatePresetProblemFields(edited, loaded.current);
    expect(manuallyRestored.presetId).toBeUndefined();
    expect(manuallyRestored.customizationSourcePresetId).toBe("logistic_growth");
    expect(isPresetFormDirty(manuallyRestored)).toBe(false);

    const reloaded = loadProblemPreset(manuallyRestored, "logistic_growth");
    expect(reloaded.presetId).toBe("logistic_growth");
    expect(reloaded.customizationSourcePresetId).toBeUndefined();
  });

  it("restores one invalid pre-load draft and identity, then consumes undo", () => {
    const first = loadProblemPreset(createPresetFormState(initialFields()), "exponential_growth");
    const customExact = createMathExpressionFromLegacy("y0*exp(-(t-t0))", "exact_solution");
    const customized = updatePresetProblemFields(first, {
      ...first.current,
      exactSolution: {
        profile: "exact_solution",
        draftLatex: "t^{}",
        validationKind: "incomplete",
        confirmed: customExact,
      },
    });
    const second = loadProblemPreset(customized, "linear_forced");
    const undone = undoProblemPreset(second);

    expect(undone.current.exactSolution).toMatchObject({
      draftLatex: "t^{}",
      validationKind: "incomplete",
    });
    expect(undone.customizationSourcePresetId).toBe("exponential_growth");
    expect(undone.undoSnapshot).toBeUndefined();
    expect(undoProblemPreset(undone)).toBe(undone);
    expect(trackedProblemFieldsEqual(undone.current, customized.current)).toBe(true);
  });

  it("replaces the previous undo snapshot on a later load", () => {
    const initial = createPresetFormState(initialFields());
    const decay = loadProblemPreset(initial, "exponential_decay");
    const growth = loadProblemPreset(decay, "exponential_growth");
    const undone = undoProblemPreset(growth);
    expect(undone.presetId).toBe("exponential_decay");
    expect(undone.current.runStepSize).toBe("0.2");
  });
});
