// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppSessionStore } from "./appSessionStore";
import type { LabTutorBinding } from "./contracts";
import { createPlatformTutorHost } from "./platformTutorHost";
import { createPlatformModalEnvironment } from "./platformModalEnvironment";
import { appendTutorMessage, updateTutorDraft } from "../tutor/moduleTutorSession";
import { createOdeTutorBinding } from "../ode/odeTutorBinding";
import { mountPlatformTutorPanel } from "../tutor/platformTutorPanel";

function binding(moduleId: "ode" = "ode"): LabTutorBinding<unknown> {
  return {
    moduleId,
    promptProfile: "ode",
    suggestedQuestions: [],
    getContext: () => ({ enabled: true }),
  };
}

describe("Platform Tutor Host", () => {
  beforeEach(() => document.body.replaceChildren());

  it("preserves the shell-owned placement class when it renders", () => {
    const target = document.createElement("aside");
    target.className = "platform-tutor-region";
    document.body.append(target);
    const store = createAppSessionStore();
    const host = createPlatformTutorHost({ target });

    host.connect(binding(), store.createTutorSessionAccess("ode"));

    expect(target.classList).toContain("platform-tutor-region");
    expect(target.classList).toContain("platform-tutor-host");
    host.dispose();
  });

  it("loads the complete panel only on first open and reuses the fulfilled attempt", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const mount = vi.fn(() => ({ dispose: vi.fn(), focus: vi.fn() }));
    const loadPanel = vi.fn(async () => ({ mountPlatformTutorPanel: mount }));
    const store = createAppSessionStore();
    const host = createPlatformTutorHost({ target, loadPanel, isMobile: () => false });
    host.connect(binding(), store.createTutorSessionAccess("ode"));

    expect(loadPanel).not.toHaveBeenCalled();
    const trigger = target.querySelector<HTMLButtonElement>("[data-tutor-open]")!;
    await host.open(trigger);
    host.close();
    await host.open(trigger);

    expect(loadPanel).toHaveBeenCalledOnce();
    expect(mount).toHaveBeenCalledTimes(2);
  });

  it("keeps one contained composer after repeated open and close", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    const host = createPlatformTutorHost({
      target,
      isMobile: () => false,
      loadPanel: async () => ({ mountPlatformTutorPanel }),
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));

    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    const firstPanel = target.querySelector<HTMLElement>(".ai-tutor-panel")!;
    expect(firstPanel.querySelector(".ai-tutor-content > .ai-compose")).not.toBeNull();
    expect(target.querySelectorAll(".ai-tutor-panel")).toHaveLength(1);

    host.close();
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    const secondPanel = target.querySelector<HTMLElement>(".ai-tutor-panel")!;
    expect(secondPanel).not.toBe(firstPanel);
    expect(secondPanel.querySelector(".ai-tutor-content > .ai-compose")).not.toBeNull();
    expect(target.querySelectorAll(".ai-tutor-panel")).toHaveLength(1);
    host.dispose();
  });

  it("uses live session access and preserves transcript/draft across disconnect", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    let receivedAccess: ReturnType<typeof store.createTutorSessionAccess> | undefined;
    const host = createPlatformTutorHost({
      target,
      isMobile: () => false,
      loadPanel: async () => ({
        mountPlatformTutorPanel: (_target, options) => {
          receivedAccess = options.sessionAccess;
          return { dispose: vi.fn(), focus: vi.fn() };
        },
      }),
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLButtonElement>("[data-tutor-open]")!);
    store.updateTutor("ode", (current) =>
      updateTutorDraft(appendTutorMessage(current, "user", "Keep me"), "draft")
    );

    expect(receivedAccess?.getSession()).toBe(store.getTutor("ode"));
    host.disconnect();
    expect(store.getTutor("ode")).toMatchObject({ draftMessage: "draft" });
    expect(store.getTutor("ode").items).toHaveLength(1);
  });

  it("ignores a stale lazy-load completion after disconnect", async () => {
    let resolve!: (module: { mountPlatformTutorPanel: ReturnType<typeof vi.fn> }) => void;
    const pending = new Promise<{ mountPlatformTutorPanel: ReturnType<typeof vi.fn> }>(
      (done) => { resolve = done; }
    );
    const mount = vi.fn(() => ({ dispose: vi.fn(), focus: vi.fn() }));
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    const host = createPlatformTutorHost({ target, loadPanel: () => pending });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    const opening = host.open(target.querySelector<HTMLButtonElement>("[data-tutor-open]")!);
    host.disconnect();
    resolve({ mountPlatformTutorPanel: mount });
    await opening;

    expect(mount).not.toHaveBeenCalled();
  });

  it("retries only a rejected panel load without clearing Tutor state", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    store.updateTutor("ode", (current) => appendTutorMessage(current, "user", "Persist"));
    const mount = vi.fn(() => ({ dispose: vi.fn(), focus: vi.fn() }));
    const loadPanel = vi
      .fn<() => Promise<{ mountPlatformTutorPanel: typeof mount }>>()
      .mockRejectedValueOnce(new Error("chunk unavailable"))
      .mockResolvedValueOnce({ mountPlatformTutorPanel: mount });
    const host = createPlatformTutorHost({ target, loadPanel, isMobile: () => false });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    expect(target.textContent).toContain("Retry");
    target.querySelector<HTMLButtonElement>(".platform-tutor-failure .primary")!.click();
    await vi.waitFor(() => expect(mount).toHaveBeenCalledOnce());
    expect(loadPanel).toHaveBeenCalledTimes(2);
    expect(store.getTutor("ode").items).toHaveLength(1);
  });

  it("consumes Lab reset requests for only the connected module and preserves open state", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    store.updateTutor("ode", (current) =>
      updateTutorDraft(appendTutorMessage(current, "user", "Clear me"), "draft")
    );
    store.updateTutor("pde", (current) => appendTutorMessage(current, "user", "Keep PDE"));
    const control = createOdeTutorBinding({ getSource: () => ({ enabled: false }) });
    const refresh = vi.fn();
    const cancelPending = vi.fn();
    const host = createPlatformTutorHost({
      target,
      isMobile: () => false,
      loadPanel: async () => ({
        mountPlatformTutorPanel: () => ({
          dispose: vi.fn(),
          focus: vi.fn(),
          refresh,
          cancelPending,
        }),
      }),
    });
    host.connect(control.binding, store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    control.requestConversationReset();

    expect(store.getTutor("ode")).toEqual({ items: [], draftMessage: "", desktopOpen: true });
    expect(store.getTutor("pde").items).toHaveLength(1);
    expect(cancelPending).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("locks and restores the Lab for a mobile sheet without changing desktop preference", async () => {
    const target = document.createElement("div");
    const lab = document.createElement("main");
    document.body.append(lab, target);
    const store = createAppSessionStore();
    Object.defineProperty(document, "scrollingElement", {
      configurable: true,
      value: document.documentElement,
    });
    document.documentElement.scrollTop = 320;
    const host = createPlatformTutorHost({
      target,
      labTarget: lab,
      isMobile: () => true,
      loadPanel: async () => ({
        mountPlatformTutorPanel: (panelTarget) => {
          const panel = document.createElement("aside");
          panel.className = "ai-tutor-panel";
          panelTarget.append(panel);
          return { dispose: vi.fn(), focus: vi.fn() };
        },
      }),
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    expect(lab.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(target.querySelector("[role=dialog]")?.getAttribute("aria-modal")).toBe("true");
    document.documentElement.scrollTop = 0;
    host.closeMobileForNavigation();
    expect(lab.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(store.getTutor("ode").desktopOpen).toBe(false);
    expect(document.documentElement.scrollTop).toBe(320);
  });

  it("silently refuses an external modal and requires a later fresh open", async () => {
    const target = document.createElement("div");
    const lab = document.createElement("main");
    const blocker = document.createElement("div");
    blocker.setAttribute("role", "dialog");
    blocker.setAttribute("aria-modal", "true");
    document.body.append(lab, target, blocker);
    const focused = document.createElement("button");
    blocker.append(focused);
    focused.focus();
    const store = createAppSessionStore();
    const mount = vi.fn(() => ({ dispose: vi.fn(), focus: vi.fn() }));
    const loadPanel = vi.fn(async () => ({ mountPlatformTutorPanel: mount }));
    const host = createPlatformTutorHost({
      target,
      labTarget: lab,
      modalEnvironment: createPlatformModalEnvironment(),
      modalBackground: () => [lab],
      isMobile: () => true,
      loadPanel,
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    const trigger = target.querySelector<HTMLElement>("[data-tutor-open]")!;

    await host.open(trigger);

    expect(loadPanel).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(focused);
    expect(lab.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(target.querySelector("[data-tutor-open]")).not.toBeNull();

    blocker.remove();
    expect(loadPanel).not.toHaveBeenCalled();
    await host.open(trigger);
    expect(mount).toHaveBeenCalledOnce();
    host.dispose();
  });

  it("suspends a mounted Tutor before releasing its modal lease and reuses it on manual open", async () => {
    const target = document.createElement("div");
    const lab = document.createElement("main");
    document.body.append(lab, target);
    const store = createAppSessionStore();
    store.updateTutor("ode", (current) =>
      updateTutorDraft(appendTutorMessage(current, "user", "Preserve me"), "draft")
    );
    const dispose = vi.fn();
    const focus = vi.fn();
    const mount = vi.fn((panelTarget: HTMLElement) => {
      const panel = document.createElement("aside");
      panel.className = "ai-tutor-panel";
      panelTarget.append(panel);
      return { dispose, focus };
    });
    const host = createPlatformTutorHost({
      target,
      labTarget: lab,
      modalEnvironment: createPlatformModalEnvironment(),
      modalBackground: () => [lab],
      isMobile: () => true,
      loadPanel: async () => ({ mountPlatformTutorPanel: mount }),
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);

    host.suspendPresentationForGlossary();

    const presentation = target.querySelector<HTMLElement>("[data-tutor-presentation]")!;
    expect(dispose).not.toHaveBeenCalled();
    expect(host.isPresentationVisible()).toBe(false);
    expect(presentation.hidden).toBe(true);
    expect(presentation.getAttribute("aria-hidden")).toBe("true");
    expect(presentation.hasAttribute("inert")).toBe(true);
    expect(target.querySelector('[aria-modal="true"]')).toBeNull();
    expect(lab.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(store.getTutor("ode")).toMatchObject({ draftMessage: "draft" });
    expect(store.getTutor("ode").items).toHaveLength(1);

    const launcher = target.querySelector<HTMLElement>("[data-tutor-open]")!;
    await host.open(launcher);

    expect(mount).toHaveBeenCalledOnce();
    expect(host.isPresentationVisible()).toBe(true);
    expect(presentation.hidden).toBe(false);
    expect(presentation.hasAttribute("inert")).toBe(false);
    expect(presentation.querySelector('[aria-modal="true"]')).not.toBeNull();
    expect(focus).toHaveBeenCalledTimes(2);

    host.close();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("keeps ordinary disconnect disposal behavior after suspension", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const store = createAppSessionStore();
    const dispose = vi.fn();
    const cancelPending = vi.fn();
    const host = createPlatformTutorHost({
      target,
      isMobile: () => false,
      loadPanel: async () => ({
        mountPlatformTutorPanel: (panelTarget) => {
          const panel = document.createElement("aside");
          panel.className = "ai-tutor-panel";
          panelTarget.append(panel);
          return { dispose, focus: vi.fn(), cancelPending };
        },
      }),
    });
    host.connect(binding(), store.createTutorSessionAccess("ode"));
    await host.open(target.querySelector<HTMLElement>("[data-tutor-open]")!);
    host.suspendPresentationForGlossary();

    host.disconnect();

    expect(dispose).toHaveBeenCalledOnce();
    expect(target.childElementCount).toBe(0);
  });
});
