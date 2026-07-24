// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlatformGlossaryHost } from "../../app/platformGlossaryHost";
import { createPlatformModalEnvironment } from "../../app/platformModalEnvironment";
import { createGlossaryPlaygroundRoute } from "./glossaryPlaygroundRoute";

describe("minimal Glossary Playground route", () => {
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
    expect(input.getAttribute("aria-describedby")).toBe(
      "glossary-fixture-help glossary-fixture-error"
    );
    expect(
      routeTarget.querySelectorAll('[data-fixture-term-id="sample_term"]')
    ).toHaveLength(1);
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
    sample.click();
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

    mounted.dispose();
    modalEnvironment.dispose();
  });
});
