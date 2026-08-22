import { describe, expect, it } from "vitest";
import {
  FIRST_ORDER_CATALOG,
  METHOD_CATALOG,
} from "@numerical-t-lab/numerics/ode/method-catalog";
import type { MethodFamily } from "@numerical-t-lab/numerics/ode/solvers";
import { methodTeachingMathContent } from "../../math/ui/methodMathContent";
import { PROBLEM_PRESETS } from "./problemPresets";
import {
  deriveAllOdeMethodTeachingProfiles,
  deriveOdeMethodTeachingProfile,
} from "./odeMethodTeaching";

function profile(family: MethodFamily, currentOrder?: number) {
  return deriveOdeMethodTeachingProfile({ family, currentOrder });
}

function profileText(family: MethodFamily): string {
  const selected = profile(family);
  return [
    selected.coreIdea,
    selected.accessibleVerbalization,
    ...selected.orderedProcess,
    ...selected.requiredState,
    selected.startupHistoryRequirement,
    selected.perStepWork,
    selected.watchPoint,
    selected.accuracyStabilityBoundary,
    selected.whatToObserve,
    ...selected.advancedDetails.map((detail) => detail.text),
  ].join(" ");
}

describe("pure ODE method teaching derivation", () => {
  it("derives exactly eight profiles and structural metadata from the catalog", () => {
    const profiles = deriveAllOdeMethodTeachingProfiles();

    expect(profiles).toHaveLength(8);
    expect(new Set(profiles.map((item) => item.identity.family)).size).toBe(8);
    for (const entry of METHOD_CATALOG) {
      const selected = profiles.find(
        (item) => item.identity.family === entry.family
      )!;
      expect(selected.identity).toEqual({
        family: entry.family,
        displayName: entry.displayName,
        shortLabel: entry.shortLabel,
        runnable: true,
      });
      expect(selected.problemProfile).toBe(
        entry.mode === "first" ? "first_order_ivp" : "second_order_acceleration"
      );
      expect(selected.formation).toBe(
        entry.isImplicit ? "implicit" : "explicit"
      );
      expect(selected.stepStructure).toBe(
        entry.mode === "second"
          ? "staggered"
          : entry.formulaType.startsWith("multistep")
            ? "history"
            : "one_step"
      );
      expect(selected.formulaType).toBe(entry.formulaType);

      if (entry.hasOrderSelector) {
        expect(selected.order).toEqual({
          kind: "configurable",
          supportedMin: entry.orderMin,
          supportedMax: entry.orderMax,
          defaultOrder: entry.orderDefault,
          currentConfiguredOrder: undefined,
        });
      } else {
        expect(selected.order).toEqual({
          kind: "fixed",
          theoreticalOrder: entry.orderOfAccuracy,
        });
      }
    }
  });

  it("derives Compare eligibility only from FIRST_ORDER_CATALOG", () => {
    const expected = new Set(FIRST_ORDER_CATALOG.map((entry) => entry.family));
    for (const entry of METHOD_CATALOG) {
      expect(profile(entry.family).compareEligible).toBe(
        expected.has(entry.family)
      );
    }
    expect(profile("leapfrog").compareEligible).toBe(false);
  });

  it("derives supported/default order from source while preserving supplied family order", () => {
    expect(profile("adams_bashforth", 7).order).toMatchObject({
      supportedMin: 1,
      supportedMax: 8,
      defaultOrder: 2,
      currentConfiguredOrder: 7,
    });
    expect(profile("adams_moulton", 6).order).toMatchObject({
      supportedMin: 1,
      supportedMax: 8,
      defaultOrder: 2,
      currentConfiguredOrder: 6,
    });
    expect(profile("bdf", 5).order).toMatchObject({
      supportedMin: 1,
      supportedMax: 6,
      defaultOrder: 2,
      currentConfiguredOrder: 5,
    });

    profile("rk4");
    expect(profile("adams_bashforth", 7).order).toMatchObject({
      defaultOrder: 2,
      currentConfiguredOrder: 7,
    });
    expect(profile("adams_bashforth").order).toMatchObject({
      defaultOrder: 2,
      currentConfiguredOrder: undefined,
    });
  });

  it("derives suggested presets separately from first-order availability", () => {
    const allPresetIds = PROBLEM_PRESETS.map((preset) => preset.id);

    for (const entry of FIRST_ORDER_CATALOG) {
      const selected = profile(entry.family);
      const family = entry.family as Exclude<MethodFamily, "leapfrog">;
      const expectedSuggested = PROBLEM_PRESETS.filter((preset) =>
        preset.suggestedMethods.includes(family)
      ).map((preset) => preset.id);
      expect(selected.presets.availableIds).toEqual(allPresetIds);
      expect(selected.presets.suggestedIds).toEqual(expectedSuggested);
      expect(selected.presets.suggestedIds).not.toEqual(
        selected.presets.availableIds
      );
    }
  });

  it("keeps Leap-Frog on the current second-order product boundary", () => {
    const leapfrog = profile("leapfrog");

    expect(leapfrog.problemProfile).toBe("second_order_acceleration");
    expect(leapfrog.requiredState.join(" ")).toContain("u0");
    expect(leapfrog.requiredState.join(" ")).toContain("v0");
    expect(leapfrog.requiredState.join(" ")).toContain("a(t, u)");
    expect(leapfrog.compareEligible).toBe(false);
    expect(leapfrog.exactReferenceInputAvailable).toBe(false);
    expect(leapfrog.convergence.available).toBe(false);
    expect(leapfrog.presets).toEqual({ availableIds: [], suggestedIds: [] });
    expect(leapfrog.configurableParameters).toEqual([
      "time_interval",
      "step_size",
      "initial_position",
      "initial_velocity",
      "acceleration",
    ]);
    expect(leapfrog.output.evidenceIds).toEqual([
      "final_position",
      "final_velocity",
      "trajectory",
      "stored_values",
      "method_metadata",
    ]);
  });

  it("captures the Adams-Bashforth, Adams-Moulton, and BDF source-backed distinctions", () => {
    const adamsBashforth = profile("adams_bashforth", 8);
    expect(adamsBashforth.formation).toBe("explicit");
    expect(adamsBashforth.order).toMatchObject({
      supportedMin: 1,
      supportedMax: 8,
    });
    expect(profileText("adams_bashforth")).toContain("slope history");
    expect(profileText("adams_bashforth")).toContain("RK4");
    expect(profileText("adams_bashforth")).toContain("N >= p");

    const adamsMoulton = profile("adams_moulton", 8);
    expect(adamsMoulton.formation).toBe("implicit");
    expect(adamsMoulton.order).toMatchObject({
      supportedMin: 1,
      supportedMax: 8,
    });
    expect(profileText("adams_moulton")).toContain("initial guess");
    expect(profileText("adams_moulton")).toContain("accepted corrected value");
    expect(profileText("adams_moulton")).toContain("UI-default Newton");
    expect(profileText("adams_moulton")).toContain("RK4");

    const bdf = profile("bdf", 6);
    expect(bdf.formation).toBe("implicit");
    expect(bdf.order).toMatchObject({ supportedMin: 1, supportedMax: 6 });
    expect(profileText("bdf")).toContain("solution history");
    expect(profileText("bdf")).toContain("UI-default Newton");
    expect(profileText("bdf")).toContain("theoretical order 6");
    expect(profileText("bdf")).toContain("approximately order 5");
    expect(profileText("bdf")).not.toContain("theoretical order 5");
  });

  it("captures Taylor, RK4, and Backward Euler teaching boundaries", () => {
    expect(profileText("taylor")).toContain("entered right-hand side");
    expect(profileText("taylor")).toContain("estimates internally");
    expect(profileText("taylor")).toContain("five right-hand-side evaluations");
    expect(profile("taylor").configurableParameters).not.toContain(
      "derivative_scale"
    );

    expect(profileText("rk4")).toContain("four stage evaluations");
    expect(profileText("rk4")).toContain("not accepted solution points");

    const backwardEuler = profile("backward_euler");
    expect(backwardEuler.primaryFormula.displayText).toContain(
      "f(tₙ₊₁, uₙ₊₁)"
    );
    expect(profileText("backward_euler")).toContain("UI-default Newton");
    expect(profileText("backward_euler")).toContain("A-stable");
    expect(profileText("backward_euler")).toContain("scalar test equation");
  });

  it("uses only the closed safe readonly formula authority", () => {
    for (const entry of METHOD_CATALOG) {
      const selected = profile(entry.family);
      expect(selected.primaryFormula).toEqual(
        methodTeachingMathContent(entry).formula
      );
      expect(Object.keys(selected.primaryFormula).sort()).toEqual([
        "ariaLabel",
        "displayText",
        "latex",
      ]);
      expect(selected.primaryFormula.ariaLabel).toMatch(/[A-Za-z]/);
      expect(selected.primaryFormula.displayText).not.toBe("");
      expect(selected.primaryFormula).not.toHaveProperty("html");
      expect(selected.primaryFormula).not.toHaveProperty("evaluate");
      expect(selected.primaryFormula).not.toHaveProperty("mathJson");
    }

    const leapfrog = profile("leapfrog").primaryFormula;
    expect(leapfrog.displayText).toContain("v₋₁⁄₂");
    expect(leapfrog.ariaLabel).toContain("half-step velocity");
  });

  it("does not mutate catalogs, presets, selections, supplied order, or derived profiles", () => {
    const catalogBefore = JSON.stringify(METHOD_CATALOG);
    const presetsBefore = JSON.stringify(PROBLEM_PRESETS);
    const selection = Object.freeze({
      family: "adams_bashforth" as const,
      currentOrder: 7,
    });
    const selected = deriveOdeMethodTeachingProfile(selection);

    expect(selection).toEqual({
      family: "adams_bashforth",
      currentOrder: 7,
    });
    expect(selected.order).toMatchObject({ currentConfiguredOrder: 7 });
    expect(JSON.stringify(METHOD_CATALOG)).toBe(catalogBefore);
    expect(JSON.stringify(PROBLEM_PRESETS)).toBe(presetsBefore);
    expect(Object.isFrozen(selected)).toBe(true);
    expect(Object.isFrozen(selected.orderedProcess)).toBe(true);
    expect(Object.isFrozen(selected.primaryFormula)).toBe(true);
  });
});
