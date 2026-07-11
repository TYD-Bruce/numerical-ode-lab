// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { mountExpressionErrorSummary } from "./expressionErrorSummary";

describe("expression error summary", () => {
  it("stays hidden with no expression issues", () => {
    const container = document.createElement("div");
    const summary = mountExpressionErrorSummary(container);
    summary.render([]);
    expect(summary.element.hidden).toBe(true);
  });

  it("uses singular and plural counts and safe text construction", () => {
    const container = document.createElement("div");
    const summary = mountExpressionErrorSummary(container);
    summary.render([
      { fieldId: "rhs", fieldLabel: "ODE right-hand side", message: "<b>Finish it</b>", focus: vi.fn() },
    ], true);
    expect(summary.element.querySelector("h3")?.textContent).toBe("Fix 1 expression before running");
    expect(summary.element.querySelector("b")).toBeNull();
    expect(summary.element.getAttribute("role")).toBe("alert");

    summary.render([
      { fieldId: "rhs", fieldLabel: "RHS", message: "First", focus: vi.fn() },
      { fieldId: "accel", fieldLabel: "Acceleration", message: "Second", focus: vi.fn() },
    ]);
    expect(summary.element.querySelector("h3")?.textContent).toBe("Fix 2 expressions before running");
  });

  it("focuses the selected field without using a modal", () => {
    const container = document.createElement("div");
    const focus = vi.fn();
    const summary = mountExpressionErrorSummary(container);
    summary.render([{ fieldId: "rhs", fieldLabel: "RHS", message: "Finish it", focus }]);
    container.querySelector<HTMLButtonElement>("button")!.click();
    expect(focus).toHaveBeenCalledOnce();
    expect(container.querySelector("dialog")).toBeNull();
  });
});
