import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type {
  ConvergenceLevelResult,
  ConvergenceStudyResult,
} from "./convergenceStudy";
import {
  buildConvergenceConclusion,
  buildConvergenceTeachingSections,
  formatTeachingNumber,
  type TeachingSectionId,
} from "./convergenceTeaching";

const PASSED_CHECK: ConvergenceStudyResult["consistencyCheck"] = {
  status: "passed",
  statement: "This is a numerical consistency check, not a formal proof.",
  sampleCount: 9,
  initialValueDifference: 0,
  maximumNormalizedResidual: 1e-10,
  maximumResidualTime: 0,
  probes: [],
  issues: [],
};

function level(
  index: number,
  maximumError: number,
  finalError: number,
  maximumOrder?: number
): ConvergenceLevelResult {
  return {
    level: index,
    stepSize: 0.2 / 2 ** index,
    stepCount: 5 * 2 ** index,
    finalNumericalValue: Math.exp(-1) + finalError,
    finalExactValue: Math.exp(-1),
    finalTimeError: finalError,
    finalResolutionThreshold: 1e-14,
    maximumGlobalError: maximumError,
    maximumErrorTime: 0.6,
    maximumResolutionThreshold: 1e-14,
    ...(index === 0
      ? {}
      : {
          finalObservedOrder: {
            status: "reliable" as const,
            value: 3.8,
            message: "Reliable final-time order.",
            coarseLevel: index - 1,
            fineLevel: index,
          },
          maximumObservedOrder:
            maximumOrder === undefined
              ? {
                  status: "below_resolution" as const,
                  message:
                    "The measured error is too close to floating-point resolution for a reliable observed-order estimate.",
                  coarseLevel: index - 1,
                  fineLevel: index,
                }
              : {
                  status: "reliable" as const,
                  value: maximumOrder,
                  message: "Reliable maximum-error order.",
                  coarseLevel: index - 1,
                  fineLevel: index,
                },
        }),
  };
}

function result(withReliableOrder = true): ConvergenceStudyResult {
  return {
    configFingerprint: "study",
    runFingerprint: "run",
    theoreticalOrder: 4,
    consistencyCheck: PASSED_CHECK,
    levels: [
      level(0, 8.2e-5, 5e-5),
      level(1, 5.1e-6, 3e-6, withReliableOrder ? 4.006 : undefined),
      level(2, 3.2e-7, 2e-7, withReliableOrder ? 3.995 : undefined),
    ],
    interpretation: withReliableOrder
      ? {
          kind: "consistent_with_theory",
          title: "Observed order is consistent with theory",
          explanation: "Recent maximum-error orders are stable.",
          primaryObservedOrder: 3.995,
          evidencePairs: [
            [0, 1],
            [1, 2],
          ],
        }
      : {
          kind: "order_unavailable",
          title: "Observed order is unavailable",
          explanation: "The errors reached floating-point resolution.",
          evidencePairs: [],
        },
  };
}

describe("convergence teaching sections", () => {
  it("builds all eight approved sections with complete trusted content", () => {
    const sections = buildConvergenceTeachingSections(result(), {
      methodName: "Runge-Kutta 4",
      exactSolutionDisplayText: "e raised to negative t",
      metric: "final_time",
    });
    const expectedIds: TeachingSectionId[] = [
      "what_testing",
      "exact_solution",
      "refining_h",
      "errors",
      "observed_order",
      "log_log",
      "theory_difference",
      "warnings",
    ];
    expect(sections.map((section) => section.id)).toEqual(expectedIds);
    expect(sections.map((section) => section.formula.latex)).toEqual([
      "E(h)\\to 0\\quad\\text{as}\\quad h\\to 0",
      "y'(t)=f(t,y(t)),\\qquad y(t_0)=y_0",
      "h,\\;\\frac{h}{2},\\;\\frac{h}{4},\\;\\ldots",
      "E_{\\mathrm{final}}(h)=|u_N-y(t_{\\mathrm{end}})|,\\qquad E_{\\infty}(h)=\\max_n|u_n-y(t_n)|",
      "p_{\\mathrm{obs}}=\\log_2\\!\\left(\\frac{E(h)}{E(h/2)}\\right)",
      "E_{\\mathrm{reference}}(h)=C h^p",
      "|p_{\\mathrm{obs}}-p|",
      "E(h)\\lesssim 100\\,\\varepsilon_{\\mathrm{machine}}\\,\\mathrm{scale}",
    ]);
    for (const section of sections) {
      expect(section.title).not.toBe("");
      expect(section.plainLanguage).toMatch(/[.!?]$/);
      expect(section.formula.latex).not.toBe("");
      expect(section.formula.displayText).not.toBe("");
      expect(section.formula.ariaLabel).toBe(section.formula.displayText);
      expect(section.currentExample).not.toBe("");
      expect(section.whyThisMatters).toMatch(/^Why this matters:/);
    }
  });

  it("uses current finite values and safe exact-solution display text", () => {
    const sections = buildConvergenceTeachingSections(result(), {
      methodName: "RK4",
      exactSolutionDisplayText: "user supplied exact display",
    });
    const observed = sections.find((section) => section.id === "observed_order")!;
    expect(observed.currentExample).toContain("5.100e-6");
    expect(observed.currentExample).toContain("3.200e-7");
    expect(observed.currentExample).toContain("15.94 times smaller");
    expect(observed.currentExample).toContain("3.995");
    expect(observed.currentExample).toContain("giving an observed order of 3.995");
    expect(observed.currentExample).toContain("the maximum global error was");
    expect(observed.currentExample).not.toContain("measured order");
    expect(observed.currentExample).not.toContain("the maximum error was");
    const exact = sections.find((section) => section.id === "exact_solution")!;
    expect(exact.plainLanguage).toBe(
      "An exact solution is a function that satisfies the stated initial value problem and supplies the reference values used to compute numerical error."
    );
    expect(exact.currentExample).toContain("user supplied exact display");
    expect(exact.formula.latex).not.toContain("user supplied");
  });

  it("uses the approved error metric names, accessible formula text, and asymptotic language", () => {
    const sections = buildConvergenceTeachingSections(result(), {
      methodName: "RK4",
    });
    const errors = sections.find((section) => section.id === "errors")!;
    expect(errors.title).toBe(
      "How are final-time error and maximum global error calculated?"
    );
    expect(errors.formula.displayText).toBe(
      "final-time error equals the absolute endpoint difference; maximum global error is the largest absolute grid-point difference"
    );
    expect(errors.plainLanguage).toBe(
      "Final-time error checks one endpoint, while maximum global error checks every point on the numerical grid."
    );
    const theory = sections.find((section) => section.id === "theory_difference")!;
    expect(theory.plainLanguage).toBe(
      "Observed order can differ from the theoretical order before the experiment reaches the asymptotic region or when other numerical effects influence the error data."
    );
    expect(theory.currentExample).toBe(
      "The theoretical order is 4, while the primary observed order based on maximum global error is 3.995."
    );
    expect(theory.plainLanguage).not.toContain("asymptotic range");
    expect(theory.currentExample).not.toContain(
      "primary measured maximum-error order"
    );
    expect(
      sections.find((section) => section.id === "log_log")!.whyThisMatters
    ).toContain("parallel measured and reference slopes");
    expect(JSON.stringify(sections)).not.toMatch(/\btotal error\b|\bactual order\b/);
  });

  it("reports unavailable order honestly and distinguishes the selected metric", () => {
    const sections = buildConvergenceTeachingSections(result(false), {
      methodName: "RK4",
      metric: "maximum_global",
    });
    expect(
      sections.find((section) => section.id === "observed_order")!.currentExample
    ).toContain(
      "did not produce a reliable adjacent observed order based on maximum global error"
    );
    expect(sections.find((section) => section.id === "log_log")!.currentExample).toContain(
      "maximum global error"
    );
    expect(
      sections.find((section) => section.id === "theory_difference")!.currentExample
    ).toBe(
      "The theoretical order is 4, but no primary reliable observed order based on maximum global error is available."
    );
  });
});

describe("convergence conclusion", () => {
  it("uses display levels and preserves the primary measured order", () => {
    const conclusion = buildConvergenceConclusion(result(), "Runge-Kutta 4");
    expect(conclusion).toEqual({
      heading: "What this experiment found",
      methodName: "Runge-Kutta 4",
      theoreticalOrder: 4,
      primaryObservedOrder: 3.995,
      interpretationTitle: "Observed order is consistent with theory",
      explanation: "Recent maximum-error orders are stable.",
      evidencePairLabels: ["Levels 1–2", "Levels 2–3"],
    });
    expect(JSON.stringify(conclusion)).not.toMatch(/pass|fail|color/i);
  });

  it("distinguishes absent primary order from zero", () => {
    expect(buildConvergenceConclusion(result(false), "RK4")).not.toHaveProperty(
      "primaryObservedOrder"
    );
    const zero = result();
    const zeroResult: ConvergenceStudyResult = {
      ...zero,
      interpretation: { ...zero.interpretation, primaryObservedOrder: 0 },
    };
    expect(buildConvergenceConclusion(zeroResult, "RK4").primaryObservedOrder).toBe(0);
  });
});

describe("teaching model boundaries", () => {
  it("formats finite numbers deterministically without exposing non-finite values", () => {
    expect(formatTeachingNumber(0)).toBe("0");
    expect(formatTeachingNumber(0.000012345)).toBe("1.234e-5");
    expect(formatTeachingNumber(12.3456)).toBe("12.35");
    expect(formatTeachingNumber(Number.POSITIVE_INFINITY)).toBe("unavailable");
  });

  it("remains pure data without DOM, Chart.js, or renderer invocation", () => {
    const source = readFileSync(new URL("./convergenceTeaching.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/chart\.js|document\.|window\.|innerHTML|renderReadonlyMath/);
    expect(source).not.toMatch(/mathlive|aiTutor|Mathfield/);
  });
});
