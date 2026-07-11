import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "./chatHandler";

describe("AI Tutor controlled mathematics prompt", () => {
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
});
