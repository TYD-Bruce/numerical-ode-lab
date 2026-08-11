// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  createStructuredMath,
  formatMathNumber,
  subscript,
  superscript,
} from "./structuredMath";

describe("lightweight structured mathematical display", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders real scripts with exactly one controlled accessible owner", () => {
    const formula = createStructuredMath(
      [subscript("m", "21"), " = 8.881784 × ", superscript("10", "−16")],
      "m sub 2 1 equals 8.881784 times ten to the minus 16"
    );
    document.body.append(formula);

    expect(formula.getAttribute("role")).toBe("math");
    expect(formula.getAttribute("aria-label")).toBe(
      "m sub 2 1 equals 8.881784 times ten to the minus 16"
    );
    expect(formula.querySelector("sub")?.textContent).toBe("21");
    expect(formula.querySelector("sup")?.textContent).toBe("−16");
    expect(formula.querySelector("[aria-hidden='true']")).not.toBeNull();
    expect(formula.querySelectorAll("[aria-label]")).toHaveLength(0);
  });

  it("formats contextual numbers without changing their stored values", () => {
    const source = 8.881784197001252e-16;
    const formatted = formatMathNumber(source, "diagnostic");

    expect(source).toBe(8.881784197001252e-16);
    expect(formatted.notation).toBe("scientific");
    expect(formatted.text).toContain("× 10");
    expect(formatted.text).not.toContain("e-16");
    expect(formatted.parts.some((part) => typeof part !== "string" && part.kind === "superscript")).toBe(true);
  });

  it("normalizes visible negative zero and trims unnecessary decimal zeros", () => {
    expect(formatMathNumber(-0, "ordinary").text).toBe("0");
    expect(formatMathNumber(2.5, "matrix").text).toBe("2.5");
  });

  it("keeps nonzero diagnostics visible rather than rounding them to zero", () => {
    const formatted = formatMathNumber(Number.MIN_VALUE, "diagnostic");
    expect(formatted.text).not.toBe("0");
    expect(formatted.notation).toBe("scientific");
  });
});
