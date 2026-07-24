// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryScopeId,
  defineGlossaryTermId,
  GlossaryValidationError,
} from "./glossaryBuilders";
import { createLabGlossaryBinding } from "./glossaryController";
import { createGlossaryRegistry } from "./glossaryRegistry";
import type {
  GlossaryHostPort,
  GlossarySurfaceRequest,
  GlossaryTermDisplay,
  GlossaryTermId,
} from "./glossaryRuntimeTypes";

const strict = createGlossaryValidationPolicy({ mode: "strict" });

function registry(policy = strict) {
  return createGlossaryRegistry({
    coreEntries: [
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          aliases: [
            "Visible alias",
            {
              kind: "math",
              latex: "q",
              accessibleText: "test quantity",
            },
          ],
          definition: "Content-neutral definition.",
          whyItMatters: "Content-neutral reason.",
          tutorTopic: "test topic",
        },
        strict
      )!,
    ],
    policy,
  });
}

function port() {
  const requests: GlossarySurfaceRequest[] = [];
  const value: GlossaryHostPort = {
    requestOpen: vi.fn((request) => requests.push(request)),
    requestClose: vi.fn(),
    beginScopeRerender: vi.fn(() => undefined),
    scopeDisposed: vi.fn(),
    replacementCommitted: vi.fn(),
  };
  return { value, requests };
}

function createTerm(
  scope: ReturnType<ReturnType<typeof createLabGlossaryBinding>["createScope"]>,
  display: GlossaryTermDisplay = "Visible alias"
) {
  return scope.createTerm({
    termId: defineGlossaryTermId("test_term", strict)!,
    display,
  });
}

describe("Glossary scopes", () => {
  it("enhances only the first occurrence per explicit scope", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const firstScope = binding.createScope({
      id: defineGlossaryScopeId("first_scope", strict)!,
    });
    const secondScope = binding.createScope({
      id: defineGlossaryScopeId("second_scope", strict)!,
    });

    const first = createTerm(firstScope);
    const duplicate = createTerm(firstScope);
    const crossScope = createTerm(secondScope);

    expect(first.kind).toBe("interactive");
    expect(duplicate.kind).toBe("plain-text");
    expect(duplicate.node.textContent).toBe("Visible alias");
    expect(crossScope.kind).toBe("interactive");
  });

  it("creates a native semantic button for string and math displays", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const stringScope = binding.createScope({
      id: defineGlossaryScopeId("string_scope", strict)!,
    });
    const mathScope = binding.createScope({
      id: defineGlossaryScopeId("math_scope", strict)!,
    });
    const stringTerm = createTerm(stringScope);
    const mathTerm = createTerm(mathScope, {
      kind: "math",
      latex: "q",
      accessibleText: "test quantity",
    });

    expect(stringTerm.kind).toBe("interactive");
    expect(mathTerm.kind).toBe("interactive");
    if (stringTerm.kind === "interactive" && mathTerm.kind === "interactive") {
      expect(stringTerm.node).toBeInstanceOf(HTMLButtonElement);
      expect(stringTerm.node.type).toBe("button");
      expect(stringTerm.node.textContent).toBe("Visible alias");
      expect(stringTerm.node.hasAttribute("aria-controls")).toBe(false);
      expect(stringTerm.node.hasAttribute("aria-expanded")).toBe(false);
      expect(mathTerm.node.textContent).toBe("test quantity");
    }
  });

  it("does not reserve a term when strict validation fails", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });

    expect(() =>
      scope.createTerm({
        termId: "Invalid" as GlossaryTermId,
        display: "Visible alias",
      })
    ).toThrow(GlossaryValidationError);
    expect(createTerm(scope).kind).toBe("interactive");
  });

  it("preserves readable fallback without reserving or adding listeners", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(fallback),
      policy: fallback,
    });
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });
    const invalid = scope.createTerm({
      termId: defineGlossaryTermId("test_term", strict)!,
      display: "Readable authored term",
    });
    const valid = createTerm(scope);

    expect(invalid.kind).toBe("plain-text");
    expect(invalid.node).toBeInstanceOf(Text);
    expect(invalid.node.textContent).toBe("Readable authored term");
    invalid.node.dispatchEvent(new Event("pointerenter"));
    invalid.node.dispatchEvent(new Event("focus"));
    invalid.node.dispatchEvent(new Event("click"));
    expect(valid.kind).toBe("interactive");
    expect(report).toHaveBeenCalled();
  });

  it("is a no-op before connection and forwards only fresh future interactions", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });
    const term = createTerm(scope);
    expect(term.kind).toBe("interactive");
    if (term.kind !== "interactive") return;

    term.node.dispatchEvent(new Event("pointerenter"));
    term.node.dispatchEvent(new FocusEvent("focus"));
    term.node.click();

    const connected = port();
    binding.connect(connected.value);
    expect(connected.requests).toEqual([]);

    term.node.dispatchEvent(new Event("pointerenter"));
    term.node.dispatchEvent(new FocusEvent("focus"));
    term.node.click();

    expect(connected.requests.map((request) => request.intent.kind)).toEqual([
      "hover",
      "keyboard-focus",
      "activate",
    ]);
  });

  it("removes listeners and transient ARIA state on trigger disposal", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const connected = port();
    binding.connect(connected.value);
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });
    const term = createTerm(scope);
    expect(term.kind).toBe("interactive");
    if (term.kind !== "interactive") return;
    term.node.setAttribute("aria-controls", "future-surface");
    term.node.setAttribute("aria-expanded", "true");
    term.dispose();
    term.dispose();

    term.node.dispatchEvent(new Event("pointerenter"));
    term.node.click();
    expect(term.node.hasAttribute("aria-controls")).toBe(false);
    expect(term.node.hasAttribute("aria-expanded")).toBe(false);
    expect(connected.requests).toEqual([]);
  });

  it("disposes scopes idempotently and rejects later creation", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const connected = port();
    binding.connect(connected.value);
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });
    const term = createTerm(scope);
    scope.dispose();
    scope.dispose();

    expect(connected.value.scopeDisposed).toHaveBeenCalledTimes(1);
    if (term.kind === "interactive") {
      term.node.dispatchEvent(new Event("pointerenter"));
    }
    expect(connected.requests).toEqual([]);
    expect(() => createTerm(scope)).toThrow(GlossaryValidationError);
  });

  it("creates duplicate plain text with no stale ARIA relationship", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const connected = port();
    binding.connect(connected.value);
    const scope = binding.createScope({
      id: defineGlossaryScopeId("test_scope", strict)!,
    });
    createTerm(scope);
    const duplicate = createTerm(scope);

    expect(duplicate.kind).toBe("plain-text");
    expect(duplicate.node).toBeInstanceOf(Text);
    expect((duplicate.node as Text).parentElement).toBeNull();
    duplicate.node.dispatchEvent(new Event("pointerenter"));
    duplicate.node.dispatchEvent(new Event("click"));
    expect(connected.requests).toEqual([]);
  });
});
