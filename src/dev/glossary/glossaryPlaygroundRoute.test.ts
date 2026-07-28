// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlatformGlossaryHost } from "../../app/platformGlossaryHost";
import { createPlatformModalEnvironment } from "../../app/platformModalEnvironment";
import { createGlossaryPlaygroundRoute } from "./glossaryPlaygroundRoute";

describe("complete Glossary Playground route", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.body.style.overflow = "";
  });

  it("mounts all content-neutral fixtures and the educational label composition", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    const status = document.createElement("p");
    document.body.append(routeTarget, hostTarget, status);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      statusRegion: status,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const route = createGlossaryPlaygroundRoute({ glossaryHost });
    const mounted = route.mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });

    expect(routeTarget.textContent).toContain(
      "Development fixtures only — not production definitions."
    );
    for (const label of [
      "Sample parameter",
      "Changing context",
      "Formula example",
      "Input concept",
      "Replaceable term",
    ]) {
      expect(routeTarget.textContent).toContain(label);
    }
    const input = routeTarget.querySelector<HTMLInputElement>(
      "[data-glossary-fixture-input]"
    )!;
    const nativeLabel = routeTarget.querySelector<HTMLLabelElement>(
      `label[for="${input.id}"]`
    )!;
    const labelTerm = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="label_term"]'
    )!;
    expect(nativeLabel.contains(labelTerm)).toBe(false);
    expect(nativeLabel.textContent).toBe("Fixture input value");
    const describedBy = input.getAttribute("aria-describedby")!.split(" ");
    expect(describedBy).toHaveLength(2);
    expect(describedBy.every((id) => routeTarget.querySelector(`#${id}`))).toBe(
      true
    );
    expect(
      routeTarget.querySelectorAll('[data-fixture-term-id="sample_term"]')
    ).toHaveLength(2);
    expect(routeTarget.querySelector("[data-sample-duplicate]")?.tagName).toBe(
      "SPAN"
    );

    const sample = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="sample_term"]'
    )!;
    sample.focus();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector("[data-glossary-surface]")).not.toBeNull()
    );
    sample.click();
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain("Why it matters here")
    );
    expect(document.activeElement).toBe(sample);

    const dynamic = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="dynamic_term"]'
    )!;
    dynamic.click();
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain("Initial changing context")
    );
    const update = routeTarget.querySelector<HTMLButtonElement>(
      "[data-update-glossary-context]"
    )!;
    update.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(hostTarget.querySelector("[data-glossary-surface]")).not.toBeNull();
    update.click();
    expect(hostTarget.textContent).toContain("Updated changing context");

    routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="long-primary"]'
    )!.click();
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain(
        "The final fixture-only sentence exists to guarantee a constrained internal scroll region."
      )
    );

    mounted.dispose();
    expect(hostTarget.childElementCount).toBe(0);
  });

  it("supports explicit replacement, formula fallback, and mock Tutor handoff without network", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const requests: string[] = [];
    const mounted = createGlossaryPlaygroundRoute({
      glossaryHost,
      onMockTutorRequest: (termId) => requests.push(termId),
    }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });

    const formula = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="formula_term"]'
    )!;
    formula.click();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector('[role="math"]')).not.toBeNull()
    );
    expect(hostTarget.querySelectorAll('[role="math"]')).toHaveLength(1);

    const replacement = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="replacement_term"]'
    )!;
    replacement.click();
    await vi.waitFor(() =>
      expect(replacement.getAttribute("aria-expanded")).toBe("true")
    );
    const replace = routeTarget.querySelector<HTMLButtonElement>(
      "[data-replace-glossary-trigger]"
    )!;
    replace.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(replacement.getAttribute("aria-expanded")).toBe("true");
    replace.click();
    const next = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="replacement_term"]'
    )!;
    expect(next).not.toBe(replacement);
    expect(next.getAttribute("aria-expanded")).toBe("true");

    hostTarget.querySelector<HTMLButtonElement>("[data-glossary-ask]")!.click();
    await vi.waitFor(() => expect(requests).toEqual(["replacement_term"]));
    expect(hostTarget.childElementCount).toBe(0);
    mounted.dispose();
  });

  it("opens a mobile sheet with inert background and silently refuses the external modal simulator", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const modalEnvironment = createPlatformModalEnvironment();
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => true,
      modalEnvironment,
      modalBackground: () => [routeTarget],
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-open-external-modal]"
    )!.click();
    const sample = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-term-id="sample_term"]'
    )!;
    document.body.querySelector<HTMLButtonElement>(
      "[data-attempt-glossary-with-external-modal]"
    )!.click();
    await Promise.resolve();
    expect(hostTarget.childElementCount).toBe(0);
    expect(routeTarget.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");

    document.body.querySelector<HTMLButtonElement>(
      "[data-close-external-modal]"
    )!.click();
    expect(hostTarget.childElementCount).toBe(0);
    sample.click();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector('[role="dialog"]')).not.toBeNull()
    );
    expect(routeTarget.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(routeTarget.querySelector("[data-background-control]")).not.toBeNull();

    hostTarget.querySelector<HTMLButtonElement>(
      "[data-glossary-close]"
    )!.click();
    expect(hostTarget.childElementCount).toBe(0);
    expect(routeTarget.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(sample);

    const dynamic = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="dynamic-primary"]'
    )!;
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-arm-glossary-context-update]"
    )!.click();
    dynamic.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" })
    );
    dynamic.click();
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain("Initial changing context")
    );
    const dynamicSurface = hostTarget.querySelector("[data-glossary-surface]");
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain("Replacement formula context")
    );
    expect(hostTarget.querySelector("[data-glossary-surface]")).toBe(
      dynamicSurface
    );
    expect(document.activeElement).toBe(
      hostTarget.querySelector("[data-glossary-close]")
    );
    hostTarget.querySelector<HTMLButtonElement>(
      "[data-glossary-close]"
    )!.click();
    expect(document.activeElement).toBe(dynamic);

    let replacement = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="replacement-current"]'
    )!;
    replacement.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" })
    );
    replacement.click();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector('[role="dialog"]')).not.toBeNull()
    );
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-repeat-glossary-replacement]"
    )!.click();
    replacement = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="replacement-current"]'
    )!;
    expect(replacement.getAttribute("aria-expanded")).toBe("true");
    hostTarget.querySelector<HTMLButtonElement>(
      "[data-glossary-close]"
    )!.click();
    expect(document.activeElement).toBe(replacement);

    mounted.dispose();
    modalEnvironment.dispose();
  });

  it("organizes the complete neutral fixture matrix without nested interactive controls", () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });

    for (const heading of [
      "How to use this Playground",
      "Core interaction examples",
      "Scope and duplicate behavior",
      "Dynamic context",
      "Replacement lifecycle",
      "Formula and readonly math",
      "Educational label composition",
      "Placement and scrolling matrix",
      "Mobile and modal arbitration",
      "Mock Tutor handoff",
      "Diagnostics and invalid fixtures",
      "Event and request log",
      "Reset controls",
    ]) {
      expect(routeTarget.textContent).toContain(heading);
    }
    expect(routeTarget.textContent).toContain(
      "Glossary Playground laboratory"
    );
    expect(routeTarget.textContent).toContain("Very short fixture");
    expect(routeTarget.textContent).toContain("Long-form fixture");
    expect(routeTarget.textContent).toContain(
      "Deliberately extended fixture label"
    );
    expect(
      routeTarget.querySelector('[data-fixture-instance="math-alias"]')
    ).not.toBeNull();
    expect(
      routeTarget.querySelector('[data-fixture-instance="text-alias"]')
    ).not.toBeNull();
    expect(
      routeTarget.querySelectorAll(
        'label button, button button, a button, button a'
      )
    ).toHaveLength(0);
    const tableTerm = routeTarget.querySelector<HTMLElement>(
      '[data-fixture-instance="table-header"]'
    )!;
    expect(tableTerm.parentElement?.closest("button, a")).toBeNull();
    expect(tableTerm.closest("th")?.getAttribute("scope")).toBe("col");
    expect(
      routeTarget.querySelector("[data-intentionally-unannotated]")?.querySelector(
        ".glossary-term-trigger"
      )
    ).toBeNull();

    mounted.dispose();
  });

  it("cycles live context, suppresses formula display, and preserves the pinned surface", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    const dynamic = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="dynamic-primary"]'
    )!;
    dynamic.click();
    await vi.waitFor(() =>
      expect(hostTarget.textContent).toContain("Initial changing context")
    );
    const surface = hostTarget.querySelector("[data-glossary-surface]");
    const cycle = routeTarget.querySelector<HTMLButtonElement>(
      "[data-cycle-glossary-context]"
    )!;
    cycle.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    cycle.click();
    expect(hostTarget.querySelector("[data-glossary-surface]")).toBe(surface);
    expect(hostTarget.textContent).toContain("Replacement formula context");
    expect(
      hostTarget.querySelector<HTMLElement>(".glossary-formula-section")?.hidden
    ).toBe(false);
    const focused = document.activeElement;

    cycle.click();

    expect(hostTarget.textContent).toContain("Formula-suppressed context");
    expect(
      hostTarget.querySelector<HTMLElement>(".glossary-formula-section")?.hidden
    ).toBe(true);
    expect(document.activeElement).toBe(focused);
    expect(routeTarget.querySelector("[data-playground-state]")?.textContent).toContain(
      "revision"
    );
    mounted.dispose();
  });

  it("supports repeated replacement, detach, fresh scope recreation, diagnostics, logs, and reset", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    let current = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="replacement-current"]'
    )!;
    current.click();
    await vi.waitFor(() =>
      expect(current.getAttribute("aria-expanded")).toBe("true")
    );
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-repeat-glossary-replacement]"
    )!.click();
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-repeat-glossary-replacement]"
    )!.click();
    const replaced = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="replacement-current"]'
    )!;
    expect(replaced).not.toBe(current);
    expect(replaced.getAttribute("aria-expanded")).toBe("true");
    expect(current.isConnected).toBe(false);
    hostTarget.querySelector<HTMLButtonElement>("[data-glossary-close]")!.click();
    expect(document.activeElement).toBe(replaced);

    routeTarget.querySelector<HTMLButtonElement>(
      "[data-detach-glossary-trigger]"
    )!.click();
    expect(
      routeTarget.querySelector('[data-fixture-instance="replacement-current"]')
    ).toBeNull();
    routeTarget.querySelector<HTMLButtonElement>(
      "[data-recreate-glossary-scope]"
    )!.click();
    expect(
      routeTarget.querySelector('[data-fixture-instance="replacement-current"]')
    ).not.toBeNull();

    for (const diagnostic of [
      "invalid_term_id",
      "unknown_term",
      "invalid_display",
      "invalid_formula",
      "duplicate_term_id",
      "conflicting_alias",
    ]) {
      routeTarget.querySelector<HTMLButtonElement>(
        `[data-run-diagnostic="${diagnostic}"]`
      )!.click();
      expect(
        routeTarget.querySelector("[data-diagnostic-list]")?.textContent
      ).toContain(diagnostic);
      expect(
        routeTarget.querySelector("[data-diagnostic-list]")?.textContent
      ).not.toContain("No diagnostics exercised yet.");
    }
    const valid = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="sample-primary"]'
    )!;
    valid.click();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector("[data-glossary-surface]")).not.toBeNull()
    );

    routeTarget.querySelector<HTMLButtonElement>(
      "[data-reset-glossary-fixtures]"
    )!.click();
    expect(hostTarget.childElementCount).toBe(0);
    expect(routeTarget.querySelector("[data-playground-state]")?.textContent).toContain(
      "revision 1"
    );
    expect(routeTarget.querySelector("[data-diagnostic-list]")?.textContent).not.toContain(
      "invalid_term_id"
    );
    mounted.dispose();
  });

  it("keeps only the newest 100 route-local event log entries", () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    const cycle = routeTarget.querySelector<HTMLButtonElement>(
      "[data-cycle-glossary-context]"
    )!;
    const eventLog = routeTarget.querySelector<HTMLOListElement>(
      "[data-playground-log]"
    )!;

    for (let index = 0; index < 99; index += 1) cycle.click();
    expect(eventLog.children).toHaveLength(100);
    expect(eventLog.firstElementChild?.textContent).toContain(
      "Mounted one development Glossary binding."
    );

    cycle.click();
    expect(eventLog.children).toHaveLength(100);
    expect(eventLog.firstElementChild?.textContent).not.toContain(
      "Mounted one development Glossary binding."
    );
    expect(eventLog.lastElementChild?.textContent).toContain(
      "Cycled dynamic context"
    );
    mounted.dispose();
  });

  it("bounds mock Tutor records independently, preserves sequence order, and clears them on reset", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    const dynamic = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="dynamic-primary"]'
    )!;
    const mockLog = routeTarget.querySelector<HTMLOListElement>(
      "[data-mock-tutor-log]"
    )!;

    for (let sequence = 1; sequence <= 25; sequence += 1) {
      dynamic.click();
      await vi.waitFor(() =>
        expect(
          hostTarget.querySelector<HTMLButtonElement>("[data-glossary-ask]")
        ).not.toBeNull()
      );
      hostTarget
        .querySelector<HTMLButtonElement>("[data-glossary-ask]")!
        .click();
      await vi.waitFor(() =>
        expect(mockLog.children).toHaveLength(sequence)
      );
    }
    expect(mockLog.firstElementChild?.textContent).toContain("#1;");
    expect(mockLog.lastElementChild?.textContent).toContain("#25;");

    dynamic.click();
    await vi.waitFor(() =>
      expect(
        hostTarget.querySelector<HTMLButtonElement>("[data-glossary-ask]")
      ).not.toBeNull()
    );
    hostTarget
      .querySelector<HTMLButtonElement>("[data-glossary-ask]")!
      .click();
    await vi.waitFor(() => expect(mockLog.children).toHaveLength(25));
    expect(mockLog.firstElementChild?.textContent).toContain("#2;");
    expect(mockLog.lastElementChild?.textContent).toContain("#26;");
    expect(
      routeTarget.querySelector("[data-playground-log]")?.children.length
    ).toBeLessThanOrEqual(100);

    routeTarget.querySelector<HTMLButtonElement>(
      "[data-clear-mock-tutor-log]"
    )!.click();
    expect(mockLog.textContent).toContain("No mock requests yet.");

    routeTarget.querySelector<HTMLButtonElement>(
      "[data-reset-glossary-fixtures]"
    )!.click();
    expect(
      routeTarget.querySelector("[data-playground-log]")?.children
    ).toHaveLength(1);
    expect(
      routeTarget.querySelector("[data-mock-tutor-log]")?.textContent
    ).toContain("No mock requests yet.");
    mounted.dispose();
  }, 15_000);

  it("uses structured mock Tutor logging, clears it, navigates away, and removes all route authority on disposal", async () => {
    const routeTarget = document.createElement("main");
    const hostTarget = document.createElement("div");
    document.body.append(routeTarget, hostTarget);
    const navigate = vi.fn(async () => undefined);
    const glossaryHost = createPlatformGlossaryHost({
      target: hostTarget,
      loadSurface: () => import("../../glossary/surface/glossarySurfaceRuntime"),
      isMobile: () => false,
    });
    const mounted = createGlossaryPlaygroundRoute({ glossaryHost }).mount({
      target: routeTarget,
      navigate,
      location: {
        pathname: "/__dev/glossary-playground",
        search: "",
        hash: "",
      },
    });
    const dynamic = routeTarget.querySelector<HTMLButtonElement>(
      '[data-fixture-instance="dynamic-primary"]'
    )!;
    dynamic.click();
    await vi.waitFor(() =>
      expect(hostTarget.querySelector("[data-glossary-ask]")).not.toBeNull()
    );
    hostTarget.querySelector<HTMLButtonElement>("[data-glossary-ask]")!.click();
    await vi.waitFor(() =>
      expect(routeTarget.querySelector("[data-mock-tutor-log]")?.textContent).toContain(
        "dynamic_term"
      )
    );
    const mockLog = routeTarget.querySelector("[data-mock-tutor-log]")!;
    expect(mockLog.textContent).toContain("glossary_term");
    expect(mockLog.textContent).toContain("preserveDraft: true");
    expect(mockLog.textContent).toContain("playground_primary");

    routeTarget.querySelector<HTMLButtonElement>(
      "[data-clear-mock-tutor-log]"
    )!.click();
    expect(mockLog.textContent).toContain("No mock requests yet");
    routeTarget.querySelector<HTMLButtonElement>("[data-navigate-away]")!.click();
    expect(navigate).toHaveBeenCalledWith("/about");

    const staleUpdate = routeTarget.querySelector<HTMLButtonElement>(
      "[data-update-glossary-context]"
    )!;
    mounted.dispose();
    staleUpdate.click();
    expect(routeTarget.childElementCount).toBe(0);
    expect(hostTarget.childElementCount).toBe(0);
  });
});
