// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineGlossaryScopeId, defineGlossaryTermId } from "../glossaryBuilders";
import type {
  GlossaryScopeSnapshot,
  GlossarySurfaceRequest,
  GlossaryTermId,
  ResolvedGlossaryEntry,
} from "../glossaryRuntimeTypes";
import { mountGlossarySurface } from "./glossarySurfaceRuntime";

const termId = defineGlossaryTermId("sample_term")!;
const relatedTermId = defineGlossaryTermId("related_term")!;
const thirdTermId = defineGlossaryTermId("third_term")!;
const missingTermId = defineGlossaryTermId("missing_term")!;
const scopeId = defineGlossaryScopeId("sample_scope")!;

function resolvedEntry(
  id: GlossaryTermId,
  label: string,
  overrides: Partial<ResolvedGlossaryEntry> = {}
): ResolvedGlossaryEntry {
  return Object.freeze({
    id,
    moduleId: "ode",
    display: label,
    label,
    aliases: Object.freeze([]),
    definition: `${label} preview definition.`,
    whyItMatters: `${label} matters.`,
    tutorTopic: `${label} topic`,
    ...overrides,
  });
}

function request(
  trigger: HTMLButtonElement,
  intent: GlossarySurfaceRequest["intent"] = { kind: "hover" },
  options: {
    readonly entry?: ResolvedGlossaryEntry;
    readonly resolve?: (
      termId: GlossaryTermId
    ) => ResolvedGlossaryEntry | undefined;
  } = {}
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
    entry:
      options.entry ??
      resolvedEntry(termId, "Sample parameter", {
        definition: "A short development-only definition.",
        contextualDefinition: "Initial context.",
        whyItMatters:
          "It demonstrates complete surface structure.",
        whyItMattersHere: "Initial relevance.",
        formula: Object.freeze({
          latex: "q=r",
          accessibleText: "q equals r",
        }),
        tutorTopic: "sample",
      }),
    termResolver: Object.freeze({
      resolve: options.resolve ?? (() => undefined),
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
        fullDefinition: "A complete definition that stays hidden.",
        intuition: "An intuition that stays hidden.",
        assumptionsAndLimits: "A limit that stays hidden.",
        relatedTerms: [
          { kind: "future" as const, label: "A hidden future term" },
        ],
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
    expect(target.textContent).not.toContain("complete definition");
    expect(target.textContent).not.toContain("hidden future term");
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

  it("renders rich complete sections in the accepted order with semantic relationships", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const related = resolvedEntry(relatedTermId, "Related fixture");
    const confused = resolvedEntry(thirdTermId, "Confused fixture");
    const rich = resolvedEntry(termId, "Sample parameter", {
      definition: "Short preview only.",
      fullDefinition: "The complete definition.",
      intuition: "A plain-language intuition.",
      contextualDefinition: "A narrower contextual definition.",
      whyItMattersHere: "The contextual reason.",
      formula: Object.freeze({
        latex: "a=b",
        accessibleText: "a equals b",
      }),
      assumptionsAndLimits: "A bounded assumption.",
      misconception: Object.freeze({
        statement: "The tempting misconception.",
        correction: "The careful correction.",
      }),
      moduleNote: "A module-specific note.",
      prerequisiteTermIds: Object.freeze([relatedTermId]),
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: relatedTermId }),
        Object.freeze({
          kind: "future" as const,
          label: "Future fixture concept",
        }),
      ]),
      commonlyConfusedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: thirdTermId }),
      ]),
    });

    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: rich,
        resolve: (id) =>
          id === relatedTermId
            ? related
            : id === thirdTermId
              ? confused
              : undefined,
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });
    const root = mounted.element;

    expect(
      [...root.querySelectorAll("h3")].map((heading) => heading.textContent)
    ).toEqual([
      "Full definition",
      "Plain-language intuition",
      "Why it matters here",
      "Formula",
      "Assumptions and limits",
      "Common misconception",
      "In this Lab",
      "Prerequisites",
      "Related terms",
      "Often confused with",
    ]);
    expect(root.textContent).toContain("The complete definition.");
    expect(root.textContent).not.toContain("Short preview only.");
    expect(root.textContent).toContain(
      "In this context: A narrower contextual definition."
    );
    expect(root.textContent).toContain(
      "Misconception: The tempting misconception."
    );
    expect(root.textContent).toContain("Correction: The careful correction.");
    expect(root.querySelectorAll("ul")).toHaveLength(3);
    expect(
      [...root.querySelectorAll<HTMLButtonElement>(
        "[data-glossary-related-term]"
      )].map((button) => button.textContent)
    ).toEqual(["Related fixture", "Related fixture", "Confused fixture"]);
    const future = root.querySelector("[data-glossary-future-term]");
    expect(future?.textContent).toBe("Future fixture concept");
    expect(future).not.toBeInstanceOf(HTMLButtonElement);
    expect(future?.hasAttribute("tabindex")).toBe(false);
  });

  it("omits every absent optional section for a legacy compact entry", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const compact = resolvedEntry(termId, "Sample parameter", {
      definition: "Compact definition.",
      whyItMatters: "Compact reason.",
    });

    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: compact,
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });

    expect(
      [...mounted.element.querySelectorAll("h3")].map(
        (heading) => heading.textContent
      )
    ).toEqual(["Full definition", "Why it matters here"]);
    expect(mounted.element.textContent).not.toContain(
      "No additional context is available."
    );
  });

  it("uses one-slot A to B to C navigation and focuses the current heading", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const cardC = resolvedEntry(thirdTermId, "Card C");
    const cardB = resolvedEntry(relatedTermId, "Card B", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: thirdTermId }),
      ]),
    });
    const cardA = resolvedEntry(termId, "Card A", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: relatedTermId }),
      ]),
    });
    const resolve = (id: GlossaryTermId) =>
      id === relatedTermId ? cardB : id === thirdTermId ? cardC : undefined;
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: cardA,
        resolve,
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });

    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-related-term]")!
      .click();
    expect(mounted.element.querySelector("h2")?.textContent).toBe("Card B");
    expect(document.activeElement).toBe(
      mounted.element.querySelector("h2")
    );

    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-related-term]")!
      .click();
    expect(mounted.element.querySelector("h2")?.textContent).toBe("Card C");
    expect(mounted.element.querySelector("[data-glossary-back]")).not.toBeNull();

    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-back]")!
      .click();
    expect(mounted.element.querySelector("h2")?.textContent).toBe("Card B");
    expect(mounted.element.querySelector("[data-glossary-back]")).toBeNull();
    expect(document.activeElement).toBe(
      mounted.element.querySelector("h2")
    );
  });

  it("keeps missing and self navigation as focus-preserving no-ops", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const selfCard = resolvedEntry(termId, "Card A", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId }),
        Object.freeze({ kind: "term" as const, termId: missingTermId }),
      ]),
    });
    let missingReads = 0;
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: selfCard,
        resolve: (id) => {
          if (id === termId) return selfCard;
          if (id === missingTermId && missingReads++ === 0) {
            return resolvedEntry(missingTermId, "Vanishing card");
          }
          return undefined;
        },
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });
    const buttons = mounted.element.querySelectorAll<HTMLButtonElement>(
      "[data-glossary-related-term]"
    );
    buttons[0]!.focus();
    buttons[0]!.click();
    expect(mounted.element.querySelector("h2")?.textContent).toBe("Card A");
    expect(document.activeElement).toBe(buttons[0]);
    buttons[1]!.focus();
    buttons[1]!.click();
    expect(mounted.element.querySelector("h2")?.textContent).toBe("Card A");
    expect(document.activeElement).toBe(buttons[1]);
    expect(mounted.element.querySelector("[data-glossary-back]")).toBeNull();
  });

  it("keeps focus on the pinned trigger and bridges only the next forward Tab", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    const following = document.createElement("button");
    trigger.textContent = "Sample parameter";
    following.textContent = "Following control";
    document.body.append(trigger, target, following);
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
    const laterForward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    trigger.dispatchEvent(laterForward);
    expect(laterForward.defaultPrevented).toBe(false);
    following.focus();
    expect(document.activeElement).toBe(following);

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

  it("transfers an unconsumed Tab bridge without rearming a consumed surface", () => {
    const target = document.createElement("div");
    const firstTrigger = document.createElement("button");
    const replacementTrigger = document.createElement("button");
    const laterTrigger = document.createElement("button");
    document.body.append(firstTrigger, replacementTrigger, laterTrigger, target);
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(firstTrigger, {
        kind: "activate",
        pointer: "keyboard",
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });

    mounted.replaceTrigger?.(replacementTrigger);
    replacementTrigger.focus();
    const transferredForward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    replacementTrigger.dispatchEvent(transferredForward);
    expect(transferredForward.defaultPrevented).toBe(true);

    mounted.replaceTrigger?.(laterTrigger);
    mounted.updateContext({ revision: 2, terms: [] });
    mounted.reposition(
      { left: 20, right: 100, top: 100, bottom: 130 },
      { width: 1000, height: 800 }
    );
    laterTrigger.focus();
    const consumedForward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    laterTrigger.dispatchEvent(consumedForward);
    expect(consumedForward.defaultPrevented).toBe(false);
    mounted.dispose();

    const newCycle = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(laterTrigger, {
        kind: "activate",
        pointer: "keyboard",
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });
    laterTrigger.focus();
    const rearmedForward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    laterTrigger.dispatchEvent(rearmedForward);
    expect(rearmedForward.defaultPrevented).toBe(true);
    newCycle.dispose();
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

    mounted.updateContext({
      revision: 3,
      terms: Object.freeze([
        Object.freeze({
          termId,
          formula: null,
        }),
      ]),
    });
    expect(root.querySelector('[role="math"]')).toBeNull();
    expect(
      [...root.querySelectorAll("h3")].map((item) => item.textContent)
    ).not.toContain("Formula");

    mounted.updateContext(snapshot);
    expect(root.querySelectorAll('[role="math"]')).toHaveLength(1);
  });

  it("isolates live context to the original card and reapplies the latest snapshot on Back", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const related = resolvedEntry(relatedTermId, "Related card", {
      contextualDefinition: "Related immutable context.",
      whyItMattersHere: "Related immutable relevance.",
      formula: Object.freeze({
        latex: "b=c",
        accessibleText: "b equals c",
      }),
    });
    const original = resolvedEntry(termId, "Original card", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: relatedTermId }),
      ]),
    });
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: original,
        resolve: (id) => (id === relatedTermId ? related : undefined),
      }),
      onClose: vi.fn(),
      renderMath: mathFallback,
    });
    mounted.updateContext({
      revision: 2,
      terms: Object.freeze([
        Object.freeze({
          termId,
          contextualDefinition: "Original earlier context.",
          whyItMattersHere: "Original earlier relevance.",
        }),
      ]),
    });
    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-related-term]")!
      .click();
    const relatedHeading = mounted.element.querySelector("h2");
    expect(relatedHeading?.textContent).toBe("Related card");

    mounted.updateContext({
      revision: 3,
      terms: Object.freeze([
        Object.freeze({
          termId,
          contextualDefinition: "Original latest context.",
          whyItMattersHere: "Original latest relevance.",
          formula: Object.freeze({
            latex: "x=y",
            accessibleText: "x equals y",
          }),
        }),
      ]),
    });
    expect(mounted.element.textContent).toContain(
      "Related immutable context."
    );
    expect(mounted.element.textContent).not.toContain(
      "Original latest context."
    );
    expect(
      mounted.element.querySelector('[role="math"]')?.getAttribute("aria-label")
    ).toBe("b equals c");

    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-back]")!
      .click();
    expect(mounted.element.textContent).toContain("Original latest context.");
    expect(mounted.element.textContent).toContain(
      "Original latest relevance."
    );
    expect(
      mounted.element.querySelector('[role="math"]')?.getAttribute("aria-label")
    ).toBe("x equals y");
    expect(mounted.element.querySelectorAll('[role="math"]')).toHaveLength(1);
  });

  it("uses the current card for Tutor handoff and preserves pending state across navigation", async () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const related = resolvedEntry(relatedTermId, "Related card");
    const original = resolvedEntry(termId, "Original card", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: relatedTermId }),
      ]),
    });
    let resolveHandoff!: () => void;
    const handoff = new Promise<void>((resolve) => {
      resolveHandoff = resolve;
    });
    const onAskTutor = vi.fn(() => handoff);
    const mounted = mountGlossarySurface(target, {
      mode: "pinned",
      request: request(trigger, { kind: "activate", pointer: "mouse" }, {
        entry: original,
        resolve: (id) => (id === relatedTermId ? related : undefined),
      }),
      onClose: vi.fn(),
      onAskTutor,
      renderMath: mathFallback,
    });
    mounted.updateContext({
      revision: 2,
      terms: Object.freeze([
        Object.freeze({
          termId,
          curatedTutorContext: "Original-only curated context",
        }),
      ]),
    });
    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-ask]")!
      .click();
    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-related-term]")!
      .click();
    const relatedAsk = mounted.element.querySelector<HTMLButtonElement>(
      "[data-glossary-ask]"
    )!;
    expect(relatedAsk.disabled).toBe(true);
    expect(relatedAsk.textContent).toBe("Opening Tutor...");
    expect(onAskTutor).toHaveBeenCalledWith(
      expect.objectContaining({
        termId,
        curatedScopeContext: "Original-only curated context",
      }),
      trigger
    );

    resolveHandoff();
    await handoff;
    await Promise.resolve();
    expect(relatedAsk.disabled).toBe(false);
    relatedAsk.click();
    expect(onAskTutor).toHaveBeenLastCalledWith(
      {
        kind: "glossary_term",
        termId: relatedTermId,
        moduleId: "ode",
        scopeId,
      },
      trigger
    );
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

  it("recalculates the mobile focus trap after a related card adds Back", () => {
    const target = document.createElement("div");
    const trigger = document.createElement("button");
    document.body.append(trigger, target);
    const related = resolvedEntry(relatedTermId, "Related card");
    const original = resolvedEntry(termId, "Original card", {
      relatedTerms: Object.freeze([
        Object.freeze({ kind: "term" as const, termId: relatedTermId }),
      ]),
    });
    const mounted = mountGlossarySurface(target, {
      mode: "mobile-sheet",
      request: request(trigger, { kind: "activate", pointer: "touch" }, {
        entry: original,
        resolve: (id) => (id === relatedTermId ? related : undefined),
      }),
      onClose: vi.fn(),
      onAskTutor: vi.fn(async () => undefined),
      renderMath: mathFallback,
    });
    mounted.element
      .querySelector<HTMLButtonElement>("[data-glossary-related-term]")!
      .click();
    const back = mounted.element.querySelector<HTMLButtonElement>(
      "[data-glossary-back]"
    )!;
    const ask = mounted.element.querySelector<HTMLButtonElement>(
      "[data-glossary-ask]"
    )!;
    ask.focus();
    const forward = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    ask.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(back);
  });
});
