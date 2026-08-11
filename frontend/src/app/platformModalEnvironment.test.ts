// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlatformModalEnvironment } from "./platformModalEnvironment";

describe("PlatformModalEnvironment", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.body.style.overflow = "";
    Object.defineProperty(document, "scrollingElement", {
      configurable: true,
      value: document.documentElement,
    });
    document.documentElement.scrollTop = 0;
  });

  it("owns one lease and restores exact inert, overflow, and scroll state", () => {
    const backgroundA = document.createElement("main");
    const backgroundB = document.createElement("aside");
    const host = document.createElement("section");
    backgroundB.setAttribute("inert", "");
    document.body.style.overflow = "clip";
    document.documentElement.scrollTop = 280;
    document.body.append(backgroundA, backgroundB, host);
    const environment = createPlatformModalEnvironment();

    const result = environment.acquire({
      owner: "tutor",
      hostRegion: host,
      background: [backgroundA, backgroundB],
    });

    expect(result.status).toBe("acquired");
    expect(backgroundA.hasAttribute("inert")).toBe(true);
    expect(backgroundB.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    document.documentElement.scrollTop = 0;
    if (result.status === "acquired") result.lease.release();

    expect(backgroundA.hasAttribute("inert")).toBe(false);
    expect(backgroundB.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("clip");
    expect(document.documentElement.scrollTop).toBe(280);
  });

  it("refuses an active external modal without focus, inert, scroll, or lease effects", () => {
    const background = document.createElement("main");
    const host = document.createElement("section");
    const blocker = document.createElement("div");
    blocker.setAttribute("role", "dialog");
    blocker.setAttribute("aria-modal", "true");
    const focused = document.createElement("button");
    document.body.append(background, host, blocker, focused);
    focused.focus();
    document.documentElement.scrollTop = 90;
    const environment = createPlatformModalEnvironment();

    const result = environment.acquire({
      owner: "glossary",
      hostRegion: host,
      background: [background],
    });

    expect(result).toEqual({
      status: "blocked",
      reason: "external-modal-active",
    });
    expect(document.activeElement).toBe(focused);
    expect(background.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.scrollTop).toBe(90);
  });

  it("does not replay a blocked request and allows only a later fresh acquisition", () => {
    const background = document.createElement("main");
    const host = document.createElement("section");
    const blocker = document.createElement("div");
    blocker.setAttribute("aria-modal", "true");
    document.body.append(background, host, blocker);
    const environment = createPlatformModalEnvironment();

    expect(environment.acquire({
      owner: "glossary",
      hostRegion: host,
      background: [background],
    }).status).toBe("blocked");
    blocker.remove();
    expect(background.hasAttribute("inert")).toBe(false);

    const later = environment.acquire({
      owner: "glossary",
      hostRegion: host,
      background: [background],
    });
    expect(later.status).toBe("acquired");
    if (later.status === "acquired") later.lease.release();
  });

  it("prevents a stale lease from releasing a newer owner", () => {
    const background = document.createElement("main");
    const tutorHost = document.createElement("section");
    const glossaryHost = document.createElement("section");
    document.body.append(background, tutorHost, glossaryHost);
    const environment = createPlatformModalEnvironment();
    const tutor = environment.acquire({
      owner: "tutor",
      hostRegion: tutorHost,
      background: [background, glossaryHost],
    });
    expect(tutor.status).toBe("acquired");
    if (tutor.status !== "acquired") return;
    tutor.lease.release();

    const glossary = environment.acquire({
      owner: "glossary",
      hostRegion: glossaryHost,
      background: [background, tutorHost],
    });
    expect(glossary.status).toBe("acquired");
    tutor.lease.release();

    expect(background.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    if (glossary.status === "acquired") glossary.lease.release();
  });

  it("releases the current owner idempotently on dispose", () => {
    const background = document.createElement("main");
    const host = document.createElement("section");
    document.body.append(background, host);
    const environment = createPlatformModalEnvironment();
    const result = environment.acquire({
      owner: "tutor",
      hostRegion: host,
      background: [background],
    });
    expect(result.status).toBe("acquired");

    environment.dispose();
    environment.dispose();
    if (result.status === "acquired") result.lease.release();

    expect(background.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(vi.fn()).not.toHaveBeenCalled();
  });
});
