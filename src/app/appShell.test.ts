// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { createAppShell } from "./appShell";

describe("app shell", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders persistent navigation plus empty Tutor and Glossary host regions", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);

    expect(shell.root.querySelector("header")?.textContent).toContain(
      "Numerical T-Lab"
    );
    expect(shell.root.querySelector('nav[aria-label="Primary"]')).not.toBeNull();
    expect(shell.outlet.tagName).toBe("MAIN");
    expect(shell.root.querySelector("[data-platform-tutor-host]")?.children).toHaveLength(0);
    expect(shell.glossaryRegion.children).toHaveLength(0);
    expect(shell.glossaryStatus.getAttribute("role")).toBe("status");
    expect(shell.glossaryStatus.getAttribute("aria-live")).toBe("polite");
    expect(shell.root.textContent).not.toContain("AI Tutor");
    const toggle = shell.root.querySelector<HTMLButtonElement>("[data-theme-toggle]")!;
    expect(toggle.getAttribute("aria-label")).toBe("Switch to dark mode");
    expect(toggle.closest(".platform-header-actions")?.querySelector("nav"))
      .toBe(shell.root.querySelector('nav[aria-label="Primary"]'));
  });

  it("returns modal background siblings without including an active Host ancestor", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);

    expect(shell.modalBackgroundFor("tutor")).toContain(shell.outlet);
    expect(shell.modalBackgroundFor("tutor")).toContain(shell.glossaryRegion);
    expect(shell.modalBackgroundFor("tutor")).not.toContain(shell.tutorRegion);
    expect(shell.modalBackgroundFor("glossary")).toContain(shell.tutorRegion);
    expect(shell.modalBackgroundFor("glossary")).not.toContain(shell.glossaryRegion);
    for (const background of shell.modalBackgroundFor("glossary")) {
      expect(background.contains(shell.glossaryRegion)).toBe(false);
    }
  });

  it("provides an accessible mobile menu with Escape and explicit close", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const trigger = shell.root.querySelector<HTMLButtonElement>("[data-mobile-menu-trigger]")!;
    const menu = shell.root.querySelector<HTMLElement>("[data-mobile-menu]")!;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(menu.hidden).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(menu.hidden).toBe(true);

    trigger.click();
    shell.root.querySelector<HTMLButtonElement>("[data-mobile-menu-close]")!.click();
    expect(menu.hidden).toBe(true);
  });

  it("closes the mobile menu after a successful navigation signal", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const trigger = shell.root.querySelector<HTMLButtonElement>("[data-mobile-menu-trigger]")!;
    trigger.click();

    shell.navigationSucceeded();

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
