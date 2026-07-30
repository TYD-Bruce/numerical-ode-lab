import { describe, expect, it } from "vitest";
import { coreGlossaryEntries } from "./coreGlossary";

const expectedCoreEntries = [
  {
    id: "numerical_approximation",
    label: "Numerical approximation",
    aliases: ["numerical solution"],
    definition:
      "A numerical approximation is a computed value intended to estimate an exact mathematical quantity.",
    fullDefinition:
      "A numerical approximation is a value computed by a numerical method to estimate an exact mathematical quantity. It is distinct from the exact quantity, the error in the approximation, and any residual of an equation.",
    intuition:
      "It is the method's computed value at one grid time, not a claim that the exact value has been found.",
    whyItMatters:
      "It is distinct from the exact quantity, the error in the approximation, and any residual of an equation.",
    formula: {
      latex: "u_n\\approx y(t_n)",
      accessibleText: "u sub n approximately equals y of t sub n.",
      display: "block",
    },
    assumptionsAndLimits:
      "u_n and y(t_n) refer to the same grid time. The approximation symbol expresses intent, not a certified error bound.",
    misconception: {
      statement: "u_n is the exact solution at t_n.",
      correction:
        "u_n is computed by the numerical method; its difference from a stated reference is an error, not the approximation itself.",
    },
    tutorTopic:
      "Explain what a displayed u_n represents and distinguish it from exact value, error, and residual.",
  },
  {
    id: "explicit_scheme",
    label: "Explicit scheme",
    aliases: ["explicit method"],
    definition:
      "An explicit scheme computes the next numerical approximation directly from quantities already known.",
    fullDefinition:
      "An explicit scheme computes the next numerical approximation directly from quantities that are already known before the update. Explicitness describes how the update is formed; it does not by itself determine the method's accuracy order or absolute stability.",
    intuition:
      "Known values go in, and the next value comes out without solving a new equation for that value.",
    whyItMatters:
      "Explicitness describes how the update is formed; it does not by itself determine the method's accuracy order or absolute stability.",
    assumptionsAndLimits:
      "The quantities on the right are already known for the stated update. Explicit does not mean first-order, inaccurate, unsuitable, or exact.",
    misconception: {
      statement: "explicit means the exact solution has an explicit formula.",
      correction:
        "explicit describes how the numerical update computes its next approximation.",
    },
    tutorTopic:
      "Identify which current quantities are known before the selected explicit update is evaluated.",
  },
] as const;

function expectDeeplyFrozen(value: unknown): void {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return;
  }

  expect(Object.isFrozen(value)).toBe(true);
  for (const nested of Object.values(value as Record<string, unknown>)) {
    expectDeeplyFrozen(nested);
  }
}

describe("Core Glossary content", () => {
  it("owns exactly the two approved reusable entries with exact rich content", () => {
    expect(coreGlossaryEntries).toHaveLength(2);
    expect(coreGlossaryEntries.map(({ id }) => id)).toEqual([
      "numerical_approximation",
      "explicit_scheme",
    ]);
    expect(coreGlossaryEntries).toEqual(expectedCoreEntries);
  });

  it("keeps formulas paired with their exact accessible text", () => {
    expect(coreGlossaryEntries[0]?.formula).toEqual({
      latex: "u_n\\approx y(t_n)",
      accessibleText: "u sub n approximately equals y of t sub n.",
      display: "block",
    });
    expect(coreGlossaryEntries[1]?.formula).toBeUndefined();
  });

  it("keeps ODE-only context out of canonical Core records", () => {
    for (const entry of coreGlossaryEntries) {
      const record = entry as unknown as Record<string, unknown>;
      expect(record.contextualDefinition).toBeUndefined();
      expect(record.whyItMattersHere).toBeUndefined();
      expect(entry.moduleNote).toBeUndefined();
      expect(entry.prerequisiteTermIds).toBeUndefined();
      expect(entry.relatedTerms).toBeUndefined();
      expect(entry.commonlyConfusedTerms).toBeUndefined();
    }

    const serialized = JSON.stringify(coreGlossaryEntries);
    expect(serialized).not.toContain("In this Lab");
    expect(serialized).not.toContain("current IVP Lab");
    expect(serialized).not.toContain("Forward Euler");
    expect(serialized).not.toContain("Backward Euler");
  });

  it("exports deeply immutable plain data", () => {
    expectDeeplyFrozen(coreGlossaryEntries);
    expect(() => {
      (
        coreGlossaryEntries as unknown as Array<{
          label: string;
        }>
      )[0]!.label = "Changed";
    }).toThrow(TypeError);
    expect(() => {
      (
        coreGlossaryEntries[0]!.misconception as {
          statement: string;
        }
      ).statement = "Changed";
    }).toThrow(TypeError);
    expect(coreGlossaryEntries).toEqual(expectedCoreEntries);
  });
});
