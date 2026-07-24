// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineGlossaryScopeId, defineGlossaryTermId } from "../glossaryBuilders";
import type {
  GlossaryScopeSnapshot,
  GlossarySurfaceRequest,
} from "../glossaryRuntimeTypes";
import { mountGlossarySurface } from "./glossarySurfaceRuntime";

const termId = defineGlossaryTermId("sample_term")!;
const scopeId = defineGlossaryScopeId("sample_scope")!;

function request(
  trigger: HTMLButtonElement,
  intent: GlossarySurfaceRequest["intent"] = { kind: "hover" }
): GlossarySurfaceRequest {
  const binding = Object.freeze({ moduleId: "ode" as const });
  const scope = Object.freeze({
    binding,
    moduleId: "ode" as const,
    scopeId,
    generation: 1,
  });
  const identity = Object.freeze({
    binding,
    scope,
    moduleId: "ode" as const,
    scopeId,
    termId,
    scopeGeneration: 1,
    trigger,
  });
  return Object.freeze({
    identity,
    moduleId: "ode",
    scopeId,
    termId,
    trigger,
    display: "Sample parameter",
    entry: Object.freeze({
      id: termId,
      moduleId: "ode",
      display: "Sample parameter",
      label: "Sample parameter",
      aliases: Object.freeze([]),
      definition: "A short development-only definition.",
      whyItMatters: "It demonstrates complete surface structure.",
      contextualDefinition: "Initial context.",
      whyItMattersHere: "Initial relevance.",
      formula: Object.freeze({
        latex: "q=r",
        accessibleText: "q equals r",
      }),
      tutorTopic: "sample",
    }),
    intent,
    scopeGeneration: 1,
  });
}

function mathFallback(target: HTMLElement, content: { displayText: string; ariaLabel: string }) {
  target.textContent = content.displayText;
  target.setAttribute("role", "math");
  target.setAttribute("aria-label", content.ariaLabel);
  return { dispose: () => target.replaceChildren() };
}

describe("Glossary surface runtime", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders a compact pointer preview silently with safe text construction", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    const status = document.createElement("p");
    status.textContent = "Existing status";
    document.body.append(trigger, target, status);
    const unsafe = request(trigger);
    const withUnsafeDefinition = {
      ...unsafe,
      entry: {
        ...unsafe.entry,
        definition: '<img src=x onerror="alert(1)"> Plain text only.',
      },
    };

    const mounted = mountGlossarySurface(target, {
      mode: "preview",
      request: withUnsafeDefinition,
      statusRegion: status,
      onClose: vi.fn(),
    });

    expect(target.querySelector("[data-glossary-surface]")).toBe(mounted.element);
    expect(target.querySelector("img")).toBeNull();
    expect(target.textContent).toContain("<img src=x");
    expect(target.textContent).toContain("Click or press Enter for more.");
    expect(target.textContent).not.toContain("Why it matters");
    expect(target.querySelector("button")).toBeNull();
    expect(status.textContent).toBe("Existing status");
    mounted.dispose();
  });

  it("announces one current keyboard preview and clears it when pinned", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    const status = document.createElement("p");
    document.body.append(trigger, target, status);
    const keyboardRequest = request(trigger, { kind: "keyboard-focus" });
    const preview = mountGlossarySurface(target, {
      mode: "preview",
      request: keyboardRequest,
      statusRegion: status,
      onClose: vi.fn(),
    });
    expect(status.getAttribute("role")).toBe("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toContain("Sample parameter");

    preview.dispose();
    mountGlossarySurface(target, {
      mode: "pinned",
      request: keyboardRequest,
      statusRegion: status,
      onClose: vi.fn(),
      renderMath: mathFallback,
    });
    expect(status.textContent).toBe("");
  });

  it("keeps focus on the pinned trigger and bridges only the next forward Tab", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    trigger.textContent = "Sample parameter";
    document.body.append(trigger, target);
    trigger.focus();
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "keyboard" }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });

    expect(document.activeElement).toBe(trigger);
    const forward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    trigger.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(
      mounted.element.querySelector("[data-glossary-close]")
    );

    trigger.focus();
    const backward = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    trigger.dispatchEvent(backward);
    expect(backward.defaultPrevented).toBe(false);
    mounted.dispose();
  });

  it("updates complete context and formula without remounting or losing focus", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger),
      onClose: vi.fn(),
      onAskTutor: vi.fn(async () => undefined),
      renderMath: mathFallback,
    });
    const root = mounted.element;
    const ask = root.querySelector<HTMLButtonElement>("[data-glossary-ask]")!;
    ask.focus();
    const snapshot: GlossaryScopeSnapshot = Object.freeze({
      revision: 2,
      terms: Object.freeze([
        Object.freeze({
          termId,
          contextualDefinition: "Updated context.",
          whyItMattersHere: "Updated relevance.",
          formula: Object.freeze({
            latex: "a=b",
            accessibleText: "a equals b",
          }),
          curatedTutorContext: "Latest context",
        }),
      ]),
    });

    mounted.updateContext(snapshot);

    expect(mounted.element).toBe(root);
    expect(document.activeElement).toBe(ask);
    expect(root.textContent).toContain("Updated context.");
    expect(root.textContent).toContain("Updated relevance.");
    expect(root.querySelectorAll('[role="math"]')).toHaveLength(1);
    expect(root.querySelector('[role="math"]')?.getAttribute("aria-label")).toBe(
      "a equals b"
    );
    expect(mounted.reposition(
      { left: 20, right: 100, top: 100, bottom: 130 },
      { width: 1000, height: 800 }
    )).toBe(true);
    expect(root.dataset.glossarySide).toBe("bottom");
  });

  it("shows an ASCII Tutor-opening status while handoff is pending", async () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    let resolveHandoff!: () => void;
    const handoff = new Promise<void>((resolve) => {
      resolveHandoff = resolve;
    });
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger),
      onClose: vi.fn(),
      onAskTutor: () => handoff,
      renderMath: mathFallback,
    });
    const ask = mounted.element.querySelector<HTMLButtonElement>(
      "[data-glossary-ask]"
    )!;

    ask.click();

    expect(ask.disabled).toBe(true);
    expect(ask.textContent).toBe("Opening Tutor...");
    resolveHandoff();
    await handoff;
    await Promise.resolve();
    expect(ask.textContent).toBe("Ask the Tutor");
    mounted.dispose();
  });

  it("reports Escape, explicit Close, and outside pointer distinctly", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    const outside = document.createElement("button");
    document.body.append(trigger, target, outside);
    const onClose = vi.fn();
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger),
      onClose,
      renderMath: mathFallback,
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenLastCalledWith("escape");
    mounted.element.querySelector<HTMLButtonElement>("[data-glossary-close]")!.click();
    expect(onClose).toHaveBeenLastCalledWith("explicit-close");
    outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(onClose).toHaveBeenLastCalledWith("outside-pointer");
    mounted.dispose();
  });

  it("renders a contained mobile dialog whose header stays outside the scroll region", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const mounted = mountGlossarySurface(target, {
      mode: "mobile-sheet",
      request: request(trigger, { kind: "activate", pointer: "touch" }),
      onClose: vi.fn(),
      onAskTutor: vi.fn(async () => undefined),
      renderMath: mathFallback,
    });
    const root = mounted.element;
    const close = root.querySelector<HTMLButtonElement>("[data-glossary-close]")!;
    const ask = root.querySelector<HTMLButtonElement>("[data-glossary-ask]")!;

    expect(root.getAttribute("role")).toBe("dialog");
    expect(root.getAttribute("aria-modal")).toBe("true");
    expect(root.querySelector(":scope > .glossary-surface-header")).not.toBeNull();
    expect(root.querySelector(":scope > .glossary-surface-content")).not.toBeNull();
    expect(document.activeElement).toBe(close);

    ask.focus();
    const forward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    ask.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(close);

    close.focus();
    const backward = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    close.dispatchEvent(backward);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(ask);
  });
});
