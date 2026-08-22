import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { METHOD_CATALOG } from "@numerical-t-lab/numerics/ode/method-catalog";
import type { MethodFamily } from "@numerical-t-lab/numerics/ode/solvers";
import {
  ODE_METHOD_CONCEPTS,
  ODE_METHOD_TEACHING_CONTENT,
  teachingContentFor,
} from "./odeMethodTeachingContent";

function learnerText(family: MethodFamily): string {
  const content = teachingContentFor(family);
  return [
    content.coreIdea,
    content.accessibleVerbalization,
    ...content.formulaAnatomy.flatMap((part) => [part.label, part.meaning]),
    ...content.orderedProcess,
    ...content.requiredState,
    content.startupHistoryRequirement,
    content.perStepWork,
    content.strength,
    content.watchPoint,
    content.accuracyStabilityBoundary,
    content.whatToObserve,
    content.outputEvidenceGuidance,
    content.convergenceGuidance,
    content.commonMisconception.incorrect,
    content.commonMisconception.correction,
    ...content.advancedDetails.flatMap((detail) => [detail.title, detail.text]),
  ].join(" ");
}

describe("reviewed ODE method teaching content", () => {
  it("defines exactly one complete profile for every catalog family and no unknown profile", () => {
    const catalogFamilies = METHOD_CATALOG.map((entry) => entry.family);
    const contentFamilies = Object.keys(ODE_METHOD_TEACHING_CONTENT);

    expect(contentFamilies).toHaveLength(8);
    expect(new Set(contentFamilies).size).toBe(8);
    expect(new Set(contentFamilies)).toEqual(new Set(catalogFamilies));
    expect(() => teachingContentFor("unknown_method" as MethodFamily)).toThrow(
      "Missing reviewed ODE method teaching content"
    );
  });

  it("keeps every learner record complete and concept-linked", () => {
    const knownConcepts = new Set(Object.keys(ODE_METHOD_CONCEPTS));

    for (const entry of METHOD_CATALOG) {
      const content = teachingContentFor(entry.family);
      expect(content.coreIdea).not.toBe("");
      expect(content.accessibleVerbalization).not.toBe("");
      expect(content.formulaAnatomy.length).toBeGreaterThan(1);
      expect(content.orderedProcess.length).toBeGreaterThan(2);
      expect(content.requiredState.length).toBeGreaterThan(0);
      expect(content.startupHistoryRequirement).not.toBe("");
      expect(content.perStepWork).not.toBe("");
      expect(content.strength).not.toBe("");
      expect(content.watchPoint).not.toBe("");
      expect(content.accuracyStabilityBoundary).not.toBe("");
      expect(content.whatToObserve).not.toBe("");
      expect(content.outputEvidenceGuidance).not.toBe("");
      expect(content.convergenceGuidance).not.toBe("");
      expect(content.commonMisconception.incorrect).not.toBe("");
      expect(content.commonMisconception.correction).not.toBe("");
      expect(content.selectedConceptIds.length).toBeGreaterThanOrEqual(4);
      expect(content.selectedConceptIds.length).toBeLessThanOrEqual(6);
      expect(
        content.selectedConceptIds.every((id) => knownConcepts.has(id))
      ).toBe(true);
    }
  });

  it("keeps one stable, complete concept record behind every selected concept ID", () => {
    const concepts = Object.entries(ODE_METHOD_CONCEPTS);

    expect(concepts.length).toBeGreaterThan(10);
    expect(new Set(concepts.map(([, concept]) => concept.id)).size).toBe(
      concepts.length
    );
    for (const [id, concept] of concepts) {
      expect(concept.id).toBe(id);
      expect(concept.title).not.toBe("");
      expect(concept.definition).not.toBe("");
      expect(Object.isFrozen(concept)).toBe(true);
    }
  });

  it("records the accepted implicit, BDF6, Taylor, RK4, and Leap-Frog boundaries", () => {
    const backwardEuler = learnerText("backward_euler");
    expect(backwardEuler).toContain("new endpoint");
    expect(backwardEuler).toContain("Newton");
    expect(backwardEuler).toContain("scalar test equation");
    expect(backwardEuler).toContain("A-stable");

    const adamsMoulton = learnerText("adams_moulton");
    expect(adamsMoulton).toContain("Adams-Bashforth predictor");
    expect(adamsMoulton).toContain("initial guess");
    expect(adamsMoulton).toContain("accepted corrected value");
    expect(adamsMoulton).toContain("UI-default Newton");

    const bdf = learnerText("bdf");
    expect(bdf).toContain("solution history");
    expect(bdf).toContain("theoretical order 6");
    expect(bdf).toContain("approximately order 5");
    expect(bdf).not.toContain("theoretical order 5");

    const taylor = learnerText("taylor");
    expect(taylor).toContain("entered right-hand side");
    expect(taylor).toContain("estimates internally");
    expect(taylor).toContain("centered approximations");
    expect(taylor).toContain("five right-hand-side evaluations");
    expect(taylor).toContain("implementation detail");

    const rk4 = learnerText("rk4");
    expect(rk4).toContain("four stage evaluations");
    expect(rk4).toContain("not accepted solution points");

    const leapfrog = learnerText("leapfrog");
    expect(leapfrog).toContain("half-step velocity");
    expect(leapfrog).toContain("whole-step position");
    expect(leapfrog).toContain("full-step velocity");
    expect(leapfrog).toContain("update used by the current Lab");
    expect(leapfrog).toContain("velocity-dependent acceleration");
  });

  it("excludes stale fixed-point teaching and unsupported broad claims", () => {
    const allLearnerText = METHOD_CATALOG.map((entry) =>
      learnerText(entry.family)
    ).join(" ");

    expect(allLearnerText.toLowerCase()).not.toContain("fixed-point");
    expect(allLearnerText).not.toMatch(
      /\b(best|fastest|most accurate|most stable|always stable|unconditionally stable|universally stable|superior to)\b/i
    );
    expect(allLearnerText).not.toContain("all stiff problems");
    expect(allLearnerText).not.toMatch(
      /maintainer|binding addendum|authorization|review gate/i
    );
  });

  it("keeps the pure teaching owners free of forbidden runtime and execution imports", () => {
    const source = [
      readFileSync(new URL("./odeMethodTeachingContent.ts", import.meta.url), "utf8"),
      readFileSync(new URL("./odeMethodTeaching.ts", import.meta.url), "utf8"),
    ].join("\n");
    const importedSpecifiers = [
      ...source.matchAll(/\bfrom\s+["']([^"']+)["']/g),
      ...source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']/g),
    ].map((match) => match[1] ?? "");
    const forbidden = [
      "odeApp",
      "odeSession",
      "chart.js",
      "Router",
      "AppSessionStore",
      "PlatformTutorHost",
      "/tutor/",
      "GlossaryHost",
      "glossarySurface",
      "mathlive",
      "MathLive",
      "compute-engine",
      "convergenceStudyView",
      "convergenceStudyState",
      "compileProductionExpression",
      "compileMathExpression",
      "expressions/evaluator",
      "MathJSON",
    ];

    for (const marker of forbidden) {
      expect(importedSpecifiers.join("\n")).not.toContain(marker);
    }
    expect(source).not.toMatch(
      /\bdocument\.[A-Za-z_$]|\bwindow\.[A-Za-z_$]|innerHTML|new Function|\beval\s*\(/
    );
  });
});
