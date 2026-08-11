import { describe, expect, it } from "vitest";
import { serializeMathAst } from "@numerical-t-lab/numerics/expressions/canonical";
import {
  createPresetFormStateFromPreset,
  problemPresetById,
  updatePresetProblemFields,
} from "../problemPresets";
import {
  createBeginnerStarterSession,
  getExperimentIdentity,
  hasCoreStarterChanges,
} from "./odeSession";

describe("Beginner Starter", () => {
  it("reuses the authoritative Exponential Decay preset and Forward Euler", () => {
    const preset = problemPresetById("exponential_decay");
    const session = createBeginnerStarterSession();

    expect(session.version).toBe(1);
    expect(session.step).toBe("choose");
    expect(session.workflow).toEqual({ mode: "single" });
    expect(session.selectedMethod).toEqual({ family: "forward_euler" });
    expect(session.form).toEqual(createPresetFormStateFromPreset("exponential_decay"));
    expect(session.form.presetId).toBe("exponential_decay");
    expect(session.form.current).toMatchObject({
      t0: "0",
      y0: "1",
      tEnd: "5",
      runStepSize: "0.2",
      exactSolutionEnabled: true,
    });
    expect(
      serializeMathAst(session.form.current.rhs.confirmed.canonicalAst, "rhs")
    ).toBe(serializeMathAst(preset.rhs.canonicalAst, "rhs"));
    expect(
      serializeMathAst(
        session.form.current.exactSolution.confirmed!.canonicalAst,
        "exact_solution"
      )
    ).toBe(serializeMathAst(preset.exactSolution.canonicalAst, "exact_solution"));
    expect(preset.teachingSummary).toBe(
      "Basic decay and global error, with coarse-step behavior that can motivate absolute-stability analysis."
    );
    expect(session.comparePickError).toBe("");
    expect(session.output).toEqual({});
    expect(session.convergenceByFingerprint).toEqual({});
  });

  it("derives starter identity from core values rather than a mutable dirty flag", () => {
    const starter = createBeginnerStarterSession();
    expect(getExperimentIdentity(starter)).toBe("beginner-starter");
    expect(hasCoreStarterChanges(starter)).toBe(false);

    const changedMethod = {
      ...starter,
      selectedMethod: { family: "rk4" as const },
    };
    expect(getExperimentIdentity(changedMethod)).toBe("custom-experiment");

    const changedFields = {
      ...starter,
      form: updatePresetProblemFields(starter.form, {
        ...starter.form.current,
        runStepSize: "0.1",
      }),
    };
    expect(getExperimentIdentity(changedFields)).toBe("custom-experiment");
  });

  it("ignores presentation-only state when deriving experiment identity", () => {
    const starter = createBeginnerStarterSession();
    const presentationOnly = {
      ...starter,
      step: "results" as const,
      convergenceByFingerprint: {
        example: {
          runFingerprint: "example",
          drawerOpen: true,
          baseStepSizeDraft: "0.2",
          refinementLevelsDraft: "3",
          resultStatus: "absent" as const,
          chartMetric: "final_time" as const,
          accordionOpen: {
            what_testing: true,
            exact_solution: false,
            refining_h: false,
            errors: false,
            observed_order: false,
            log_log: false,
            theory_difference: false,
            warnings: true,
          },
        },
      },
    };

    expect(getExperimentIdentity(presentationOnly)).toBe("beginner-starter");
  });
});
