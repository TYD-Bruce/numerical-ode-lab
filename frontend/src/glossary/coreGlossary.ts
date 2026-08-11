import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  type GlossaryEntryInput,
} from "./glossaryBuilders";
import type { GlossaryEntry } from "./glossaryRuntimeTypes";

const strictContent = createGlossaryValidationPolicy({ mode: "strict" });

function requiredEntry(input: GlossaryEntryInput): GlossaryEntry {
  const entry = defineGlossaryEntry(input, strictContent);
  if (entry === undefined) {
    throw new Error(`Invalid Core Glossary entry: ${input.id}`);
  }
  return entry;
}

export const coreGlossaryEntries: readonly GlossaryEntry[] = Object.freeze([
  requiredEntry({
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
  }),
  requiredEntry({
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
  }),
]);
