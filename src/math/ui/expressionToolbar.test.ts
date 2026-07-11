// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { EXPRESSION_TOOLBAR_ITEMS, mountExpressionToolbar } from "./expressionToolbar";

describe("expression toolbar", () => {
  it("contains the approved English controls and structural templates", () => {
    expect(EXPRESSION_TOOLBAR_ITEMS.map((item) => item.id)).toEqual([
      "fraction",
      "exponent",
      "square-root",
      "exponential",
      "sin",
      "cos",
      "tan",
      "ln",
      "absolute",
      "pi",
    ]);
    expect(EXPRESSION_TOOLBAR_ITEMS.find((item) => item.id === "fraction")?.template)
      .toBe("\\frac{#?}{#?}");
    expect(EXPRESSION_TOOLBAR_ITEMS.find((item) => item.id === "exponential")?.template)
      .toBe("e^{#?}");
  });

  it("inserts only through its assigned active-field target", () => {
    const container = document.createElement("div");
    const insertLatex = vi.fn();
    const showMoreSymbols = vi.fn();
    const toolbar = mountExpressionToolbar(container, { insertLatex, showMoreSymbols });
    toolbar.setActive(true);

    const fraction = container.querySelector<HTMLButtonElement>("[data-expression-tool='fraction']")!;
    fraction.click();
    expect(insertLatex).toHaveBeenCalledWith("\\frac{#?}{#?}");

    container.querySelector<HTMLButtonElement>(".expression-more-symbols")!.click();
    expect(showMoreSymbols).toHaveBeenCalledOnce();
  });

  it("is hidden without an active field, keyboard-operable, and disposable", () => {
    const container = document.createElement("div");
    const insertLatex = vi.fn();
    const toolbar = mountExpressionToolbar(container, {
      insertLatex,
      showMoreSymbols: vi.fn(),
    });
    expect(toolbar.element.hidden).toBe(true);
    toolbar.setActive(true);
    const exponent = container.querySelector<HTMLButtonElement>("[data-expression-tool='exponent']")!;
    exponent.focus();
    exponent.click();
    expect(insertLatex).toHaveBeenCalledWith("^{#?}");
    toolbar.dispose();
    expect(container.children).toHaveLength(0);
  });
});
