import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "./chatHandler";

describe("AI Tutor controlled mathematics prompt", () => {
  it("uses the canonical product and module identity", () => {
    expect(SYSTEM_PROMPT).toContain(
      "the Initial Value Problems Lab in Numerical T-Lab",
    );
    expect(SYSTEM_PROMPT).not.toContain("Numerical Analysis Lab");
    expect(SYSTEM_PROMPT).not.toContain("Numerical ODE Lab");
  });

  it("permits only the approved presentation delimiters", () => {
    expect(SYSTEM_PROMPT).toContain("\\( ... \\)");
    expect(SYSTEM_PROMPT).toContain("\\[ ... \\]");
    expect(SYSTEM_PROMPT).toContain("English plain text");
    expect(SYSTEM_PROMPT).toContain("display instructions only");
  });

  it("forbids unsafe presentation formats and prefers textbook notation", () => {
    expect(SYSTEM_PROMPT).toContain("Do not emit HTML");
    expect(SYSTEM_PROMPT).toContain("unrestricted Markdown");
    expect(SYSTEM_PROMPT).toContain("dollar-sign math");
    expect(SYSTEM_PROMPT).toContain("Math.exp(...)");
  });

  it("grounds convergence explanations in supplied model evidence", () => {
    expect(SYSTEM_PROMPT).toContain("only when convergenceStudy is supplied");
    expect(SYSTEM_PROMPT).toContain("use only its supplied values");
    expect(SYSTEM_PROMPT).toContain("maximum-global-error interpretation");
    expect(SYSTEM_PROMPT).toContain("Final-time error");
    expect(SYSTEM_PROMPT).toContain("Never recalculate or override");
    expect(SYSTEM_PROMPT).toContain("fabricate a missing value");
    expect(SYSTEM_PROMPT).toContain("not a formal proof");
    expect(SYSTEM_PROMPT).toContain("Do not assert a specific cause");
    expect(SYSTEM_PROMPT).toContain("reference line compares slope only");
  });

  it("enforces the approved numerical-language distinctions compactly", () => {
    expect(SYSTEM_PROMPT).toContain("numerical approximation");
    expect(SYSTEM_PROMPT).toContain("time-step size");
    expect(SYSTEM_PROMPT).toContain(
      "Distinguish theoretical method order from observed order"
    );
    expect(SYSTEM_PROMPT).toContain(
      "local truncation error is \\(O(h^{p+1})\\)"
    );
    expect(SYSTEM_PROMPT).toContain("step-normalized local defect");
    expect(SYSTEM_PROMPT).toContain(
      "Distinguish absolute stability from accuracy"
    );
    expect(SYSTEM_PROMPT).toContain("fast and slow behavior");
    expect(SYSTEM_PROMPT).toContain("nonlinear residual");
    expect(SYSTEM_PROMPT).toContain(
      "nonlinear iteration count as diagnostic evidence"
    );
    expect(SYSTEM_PROMPT).toContain(
      "Name the algorithm and controlled quantity for every tolerance"
    );
    expect(SYSTEM_PROMPT).toContain("Reliable evidence is not proof");
    expect(SYSTEM_PROMPT).toContain("never invent values or guarantees");
  });
});
