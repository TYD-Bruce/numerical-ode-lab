// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { createMathExpressionFromLatex } from "../mathJsonAdapter";
import {
  mountEditableMathField,
  type EditableMathBackend,
  type EditableMathElement,
} from "./editableMathField";

interface MockBackend extends EditableMathBackend {
  field: EditableMathElement;
  showVirtualKeyboard: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  focus: ReturnType<typeof vi.fn>;
}

function mockBackend(): MockBackend {
  const field = document.createElement("span") as EditableMathElement;
  field.tabIndex = 0;
  let value = "";
  Object.defineProperty(field, "value", {
    get: () => value,
    set: (next: string) => { value = next; },
    configurable: true,
  });
  field.setValue = (next = "") => { value = next; };
  field.getValue = () => value;
  const nativeFocus = field.focus.bind(field);
  const focus = vi.fn(() => nativeFocus());
  field.focus = focus;
  const insert = vi.fn((template: string) => {
    value += template.replaceAll("#?", "\\placeholder{}");
    field.dispatchEvent(new Event("input"));
    return true;
  });
  field.insert = insert;
  const showVirtualKeyboard = vi.fn(() => true);
  return {
    field,
    focus,
    insert,
    showVirtualKeyboard,
    createMathfield: () => field,
  };
}

function connectedTarget(): HTMLDivElement {
  const target = document.createElement("div");
  document.body.append(target);
  return target;
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function options(backend: MockBackend, overrides: Record<string, unknown> = {}) {
  return {
    fieldId: "rhs-expression",
    fieldLabel: "ODE right-hand side",
    profile: "rhs" as const,
    equationPrefix: { visual: "y′ =", accessible: "y prime equals" },
    initialConfirmed: createMathExpressionFromLatex("-y", "rhs"),
    loadBackend: async () => backend,
    ...overrides,
  };
}

describe("editable MathLive field controller", () => {
  it("mounts a fixed, non-editable prefix and an isolated accessible field", async () => {
    const backend = mockBackend();
    const handle = mountEditableMathField(connectedTarget(), options(backend));
    await settle();

    expect(handle.element.querySelector(".editable-math-prefix")?.textContent).toBe("y′ =");
    expect(handle.element.querySelector(".editable-math-prefix")?.getAttribute("aria-hidden")).toBe("true");
    expect(backend.field.getAttribute("aria-label")).toBe("y prime equals, ODE right-hand side");
    expect(backend.field.getAttribute("aria-describedby")).toBe(
      "rhs-expression-description rhs-expression-status"
    );
    expect(backend.field.mathVirtualKeyboardPolicy).toBe("manual");
    expect(backend.field.value).toBe("-y");
  });

  it("keeps confirmation during neutral incomplete input, then reports strict blur errors", async () => {
    const backend = mockBackend();
    const drafts = vi.fn();
    const confirmations = vi.fn();
    const handle = mountEditableMathField(connectedTarget(), options(backend, {
      onDraftStateChange: drafts,
      onConfirmedExpressionChange: confirmations,
    }));
    await settle();

    backend.field.dispatchEvent(new Event("focus"));
    expect(handle.element.querySelector<HTMLDivElement>(".expression-toolbar")?.hidden)
      .toBe(false);
    backend.field.value = "t^{}";
    backend.field.dispatchEvent(new Event("input"));
    expect(handle.getState().state).toMatchObject({ kind: "incomplete", confirmed: { latex: "-y" } });
    expect(backend.field.hasAttribute("aria-invalid")).toBe(false);
    expect(handle.element.querySelector(".editable-math-status")?.textContent)
      .toContain("Keep typing");
    expect(confirmations).not.toHaveBeenCalled();

    backend.field.dispatchEvent(new Event("blur"));
    await settle();
    expect(handle.getState()).toMatchObject({ strict: true, state: { kind: "invalid" } });
    expect(backend.field.getAttribute("aria-invalid")).toBe("true");
    expect(handle.element.querySelector(".editable-math-status")?.textContent)
      .toBe("Finish the exponent before continuing.");
    expect(drafts).toHaveBeenCalled();
    expect(handle.element.querySelector<HTMLDivElement>(".expression-toolbar")?.hidden)
      .toBe(true);
  });

  it("confirms completed input and exposes current details only", async () => {
    const backend = mockBackend();
    const confirmed = vi.fn();
    const handle = mountEditableMathField(connectedTarget(), options(backend, {
      onConfirmedExpressionChange: confirmed,
    }));
    await settle();
    backend.field.value = "y(1-y)";
    backend.field.dispatchEvent(new Event("input"));

    const details = handle.element.querySelector<HTMLDetailsElement>("details")!;
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    expect(handle.element.querySelector("[data-expression-latex]")?.textContent).toBe("y(1-y)");
    expect(handle.element.querySelector("[data-expression-parsed]")?.textContent)
      .toBe("y * (1 - y)");
    expect(confirmed).toHaveBeenCalled();

    backend.field.value = "t^{}";
    backend.field.dispatchEvent(new Event("input"));
    details.dispatchEvent(new Event("toggle"));
    expect(handle.element.querySelector("[data-expression-latex]")?.textContent).toBe("");
    expect(handle.element.querySelector(".expression-details-message")?.textContent)
      .toContain("Fix the expression");
  });

  it("targets its own toolbar, restores focus, and opens the virtual keyboard safely", async () => {
    const backendA = mockBackend();
    const backendB = mockBackend();
    const first = mountEditableMathField(connectedTarget(), options(backendA));
    const second = mountEditableMathField(connectedTarget(), options(backendB, {
      fieldId: "second-expression",
    }));
    await settle();

    backendA.field.dispatchEvent(new Event("focus"));
    const fraction = first.element.querySelector<HTMLButtonElement>("[data-expression-tool='fraction']")!;
    fraction.click();
    expect(backendA.insert).toHaveBeenCalledWith(
      "\\frac{#?}{#?}",
      expect.objectContaining({ selectionMode: "placeholder", focus: true })
    );
    expect(backendB.insert).not.toHaveBeenCalled();
    expect(backendA.focus).toHaveBeenCalled();

    first.element.querySelector<HTMLButtonElement>(".expression-more-symbols")!.click();
    expect(backendA.showVirtualKeyboard).toHaveBeenCalledWith(backendA.field);
    expect(backendB.showVirtualKeyboard).not.toHaveBeenCalled();
    second.dispose();
  });

  it("keeps desktop focus when the optional virtual keyboard is unavailable", async () => {
    const backend = mockBackend();
    backend.showVirtualKeyboard.mockImplementation(() => {
      throw new Error("keyboard unavailable");
    });
    const handle = mountEditableMathField(connectedTarget(), options(backend));
    await settle();
    backend.field.dispatchEvent(new Event("focus"));
    const more = handle.element.querySelector<HTMLButtonElement>(".expression-more-symbols")!;
    expect(() => more.click()).not.toThrow();
    expect(backend.focus).toHaveBeenCalled();
  });

  it("supports strict restore and all three profiles without exposing application behavior", async () => {
    const cases = [
      ["rhs", "-y", "y′ =", "y prime equals"],
      ["second_order_rhs", "-u", "u″ =", "u double prime equals"],
      ["exact_solution", "y_0e^{-t}", "y(t) =", "y of t equals"],
    ] as const;

    for (const [profile, latex, visual, accessible] of cases) {
      const backend = mockBackend();
      const target = connectedTarget();
      const handle = mountEditableMathField(target, {
        fieldId: `${profile}-field`,
        fieldLabel: "Expression",
        profile,
        equationPrefix: { visual, accessible },
        initialConfirmed: createMathExpressionFromLatex(latex, profile),
        loadBackend: async () => backend,
      });
      await settle();
      expect(handle.getState().state.kind).toBe("ready");
      expect(handle.restoreDraft(latex).strict).toBe(true);
      expect(handle.loadExpression(createMathExpressionFromLatex(latex, profile)).state.kind)
        .toBe("ready");
      handle.dispose();
    }
  });

  it("supports an empty optional field and restores its historical confirmation exactly", async () => {
    const backend = mockBackend();
    const handle = mountEditableMathField(connectedTarget(), {
      fieldId: "exact-field",
      fieldLabel: "Exact solution",
      profile: "exact_solution",
      equationPrefix: { visual: "y(t) =", accessible: "y of t equals" },
      initialDraftLatex: "",
      initialValidation: "gentle",
      loadBackend: async () => backend,
    });
    await settle();
    expect(handle.getState().state.kind).not.toBe("ready");

    const confirmed = createMathExpressionFromLatex("e^{-t}", "exact_solution");
    handle.loadExpression(confirmed);
    expect(handle.getState().state.kind).toBe("ready");
    const restored = handle.restoreState("t^{}", undefined, "gentle");
    expect(restored).toMatchObject({
      strict: false,
      state: { kind: "incomplete", draftLatex: "t^{}", confirmed: undefined },
    });
  });

  it("does not mount a removed or superseded lazy field", async () => {
    let resolve!: (backend: EditableMathBackend) => void;
    const pending = new Promise<EditableMathBackend>((done) => { resolve = done; });
    const firstBackend = mockBackend();
    const secondBackend = mockBackend();
    const target = connectedTarget();
    const first = mountEditableMathField(target, options(firstBackend, { loadBackend: () => pending }));
    mountEditableMathField(target, options(secondBackend, { fieldId: "newer" }));
    await settle();
    resolve(firstBackend);
    await settle();
    expect(target.querySelector("#newer")).toBe(secondBackend.field);
    expect(target.querySelector("#rhs-expression")).toBeNull();
    first.dispose();

    const removedTarget = connectedTarget();
    const removed = mountEditableMathField(removedTarget, options(mockBackend(), { loadBackend: () => pending }));
    removedTarget.remove();
    await settle();
    expect(removed.getMathfield()).toBeUndefined();
  });

  it("retains a controlled fallback when the editable dependency fails to load", async () => {
    const handle = mountEditableMathField(connectedTarget(), options(mockBackend(), {
      loadBackend: async () => { throw new Error("offline"); },
    }));
    await settle();
    expect(handle.getMathfield()).toBeUndefined();
    expect(handle.element.querySelector(".editable-math-host")?.textContent)
      .toBe("The mathematical editor could not be loaded.");
  });

  it("removes field listeners on disposal", async () => {
    const backend = mockBackend();
    const drafts = vi.fn();
    const handle = mountEditableMathField(connectedTarget(), options(backend, {
      onDraftStateChange: drafts,
    }));
    await settle();
    handle.dispose();
    backend.field.value = "t";
    backend.field.dispatchEvent(new Event("input"));
    expect(drafts).not.toHaveBeenCalled();
  });

  it("returns focusable strict issues for the future Run summary", async () => {
    const backend = mockBackend();
    const handle = mountEditableMathField(connectedTarget(), options(backend));
    await settle();
    handle.setDraftLatex("t^{}", "strict");
    const fieldIssue = handle.getIssue();
    expect(fieldIssue).toMatchObject({
      fieldId: "rhs-expression",
      fieldLabel: "ODE right-hand side",
      message: "Finish the exponent before continuing.",
    });
    fieldIssue?.focus();
    expect(backend.focus).toHaveBeenCalled();
  });

  it("normalizes approved legacy paste and rejects unsupported JavaScript", async () => {
    const backend = mockBackend();
    const rejected = vi.fn();
    const handle = mountEditableMathField(connectedTarget(), options(backend, {
      onLegacyPasteError: rejected,
    }));
    await settle();

    const approved = new Event("paste", { cancelable: true });
    Object.defineProperty(approved, "clipboardData", {
      value: { getData: () => "Math.sin(t)-0.1*y" },
    });
    backend.field.dispatchEvent(approved);
    expect(approved.defaultPrevented).toBe(true);
    expect(backend.field.value).toBe("\\sin\\left(t\\right)-\\left(0.1\\cdot y\\right)");
    expect(handle.getState().state.kind).toBe("ready");

    const unsupported = new Event("paste", { cancelable: true });
    Object.defineProperty(unsupported, "clipboardData", {
      value: { getData: () => "Math.random()" },
    });
    backend.field.dispatchEvent(unsupported);
    expect(unsupported.defaultPrevented).toBe(true);
    expect(rejected).toHaveBeenCalledWith(
      expect.objectContaining({ code: "invalid_legacy_expression" })
    );
    expect(handle.getState().state.kind).toBe("ready");
  });
});
