// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LabGlossaryBinding } from "../glossary/glossaryController";
import type {
  GlossaryHostPort,
  GlossaryScopeContextSource,
  GlossarySurfaceRequest,
} from "../glossary/glossaryRuntimeTypes";
import { defineGlossaryScopeId, defineGlossaryTermId } from "../glossary/glossaryBuilders";
import type {
  GlossarySurfaceRuntimeModule,
  MountedGlossarySurface,
} from "../glossary/surface/glossarySurfaceRuntime";
import { mountGlossarySurface } from "../glossary/surface/glossarySurfaceRuntime";
import { createPlatformModalEnvironment } from "./platformModalEnvironment";
import { createPlatformGlossaryHost } from "./platformGlossaryHost";

const termId = defineGlossaryTermId("sample_term")!;
const scopeId = defineGlossaryScopeId("sample_scope")!;

function controlledBinding() {
  const identity = Object.freeze({ moduleId: "ode" as const });
  let port: GlossaryHostPort | undefined;
  const disconnect = vi.fn(() => {
    port = undefined;
  });
  const binding: LabGlossaryBinding = {
    moduleId: "ode",
    identity,
    connect(next) {
      port = next;
      return disconnect;
    },
    createScope: vi.fn() as never,
    beginScopeRerender: vi.fn() as never,
    dispose: vi.fn(),
  };
  return {
    binding,
    disconnect,
    get port() {
      return port;
    },
  };
}

function controlledMutableIdentityBinding() {
  let identity = Object.freeze({ moduleId: "ode" as const });
  let port: GlossaryHostPort | undefined;
  const binding: LabGlossaryBinding = {
    moduleId: "ode",
    get identity() {
      return identity;
    },
    connect(next) {
      port = next;
      return () => {
        if (port === next) port = undefined;
      };
    },
    createScope: vi.fn() as never,
    beginScopeRerender: vi.fn() as never,
    dispose: vi.fn(),
  };
  return {
    binding,
    replaceIdentity(): void {
      identity = Object.freeze({ moduleId: "ode" as const });
    },
    get port() {
      return port;
    },
  };
}

function surfaceRequest(
  binding: LabGlossaryBinding,
  trigger: HTMLButtonElement,
  intent: GlossarySurfaceRequest["intent"],
  context?: GlossaryScopeContextSource,
  generation = 1
): GlossarySurfaceRequest {
  const scope = Object.freeze({
    binding: binding.identity,
    moduleId: "ode" as const,
    scopeId,
    generation,
  });
  const identity = Object.freeze({
    binding: binding.identity,
    scope,
    moduleId: "ode" as const,
    scopeId,
    termId,
    scopeGeneration: generation,
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
      definition: "Preview definition.",
      whyItMatters: "Complete explanation.",
      tutorTopic: "sample",
    }),
    ...(context ? { context } : {}),
    intent,
    scopeGeneration: generation,
  });
}

function surfaceModule(events: string[] = []) {
  const dispose = vi.fn();
  const updateContext = vi.fn();
  const reposition = vi.fn<MountedGlossarySurface["reposition"]>(() => true);
  const mount = vi.fn((target: HTMLElement, options: Parameters<GlossarySurfaceRuntimeModule["mountGlossarySurface"]>[1]) => {
    events.push(`mount:${options.mode}`);
    const element = document.createElement("aside");
    element.dataset.glossarySurface = "";
    Object.defineProperty(element, "getBoundingClientRect", {
      value: () => ({
        left: 0,
        right: 360,
        top: 0,
        bottom: 200,
        width: 360,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    target.replaceChildren(element);
    return {
      element,
      updateContext,
      reposition: (...args: Parameters<MountedGlossarySurface["reposition"]>) => {
        element.dataset.glossarySide = "bottom";
        return reposition(...args);
      },
      dispose,
    };
  });
  return {
    module: { mountGlossarySurface: mount } satisfies GlossarySurfaceRuntimeModule,
    mount,
    dispose,
    updateContext,
    reposition,
  };
}

function connectedTrigger(): HTMLButtonElement {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  Object.defineProperty(trigger, "getBoundingClientRect", {
    value: () => ({
      left: 100,
      right: 180,
      top: 100,
      bottom: 130,
      width: 80,
      height: 30,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    }),
  });
  return trigger;
}

type SurfaceClose = (
  reason: "escape" | "explicit-close" | "outside-pointer"
) => void;

function invokeSurfaceClose(
  holder: { readonly current?: SurfaceClose },
  reason: Parameters<SurfaceClose>[0]
): void {
  if (!holder.current) throw new Error("Expected a mounted surface close callback.");
  holder.current(reason);
}

async function openTransferredPinnedSurface() {
  const target = document.createElement("div");
  const outside = document.createElement("button");
  document.body.append(target, outside);
  const controlled = controlledBinding();
  const host = createPlatformGlossaryHost({
    target,
    loadSurface: async () => ({ mountGlossarySurface }),
    isMobile: () => false,
  });
  host.connect(controlled.binding);
  const firstTrigger = connectedTrigger();
  const firstRequest = surfaceRequest(controlled.binding, firstTrigger, {
    kind: "activate",
    pointer: "mouse",
  });
  controlled.port!.requestOpen(firstRequest);
  await vi.waitFor(() =>
    expect(target.querySelector("[data-glossary-surface]")).not.toBeNull()
  );
  const candidate = controlled.port!.beginScopeRerender(
    firstRequest.identity.scope
  )!;
  const replacementTrigger = connectedTrigger();
  const replacement = surfaceRequest(
    controlled.binding,
    replacementTrigger,
    { kind: "activate", pointer: "mouse" },
    undefined,
    2
  );
  controlled.port!.replacementCommitted({
    kind: "transferred",
    previous: candidate,
    replacement: replacement.identity,
  });
  return {
    controlled,
    host,
    target,
    outside,
    firstTrigger,
    firstRequest,
    replacementTrigger,
    replacement,
  };
}

describe("Platform Glossary Host", () => {
  beforeEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
    document.body.style.overflow = "";
  });

  it("is inert before binding and disconnects without disposing the Lab binding", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const loadSurface = vi.fn(async () => runtime.module);
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({ target, loadSurface });

    expect(target.childElementCount).toBe(0);
    expect(loadSurface).not.toHaveBeenCalled();
    host.connect(controlled.binding);
    host.disconnect();

    expect(controlled.disconnect).toHaveBeenCalledOnce();
    expect(controlled.binding.dispose).not.toHaveBeenCalled();
    expect(target.childElementCount).toBe(0);
  });

  it("opens keyboard preview immediately and replaces it with one pinned surface", async () => {
    const target = document.createElement("div");
    const status = document.createElement("p");
    document.body.append(target, status);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      statusRegion: status,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, { kind: "keyboard-focus" })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledTimes(1));
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "keyboard",
      })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledTimes(2));

    expect(runtime.mount.mock.calls[0]![1].mode).toBe("preview");
    expect(runtime.mount.mock.calls[1]![1].mode).toBe("pinned");
    expect(runtime.dispose).toHaveBeenCalledOnce();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("uses 220ms hover open and 300ms leave close with surface-entry cancellation", async () => {
    vi.useFakeTimers();
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    const request = surfaceRequest(controlled.binding, trigger, { kind: "hover" });

    controlled.port!.requestOpen(request);
    await vi.advanceTimersByTimeAsync(219);
    expect(runtime.mount).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(runtime.mount).toHaveBeenCalledOnce();

    controlled.port!.requestClose(request);
    await vi.advanceTimersByTimeAsync(299);
    target.dispatchEvent(new Event("pointerenter"));
    await vi.advanceTimersByTimeAsync(1);
    expect(runtime.dispose).not.toHaveBeenCalled();
    target.dispatchEvent(new Event("pointerleave"));
    await vi.advanceTimersByTimeAsync(300);
    expect(runtime.dispose).toHaveBeenCalledOnce();
    host.dispose();
  });

  it("subscribes only complete surfaces and refreshes the mounted card", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    let listener: (() => void) | undefined;
    const unsubscribe = vi.fn();
    const context: GlossaryScopeContextSource = {
      getSnapshot: vi.fn(() => ({ revision: 1, terms: [] })),
      subscribe: vi.fn((next) => {
        listener = next;
        return unsubscribe;
      }),
    };
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, { kind: "keyboard-focus" }, context)
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());
    expect(context.subscribe).not.toHaveBeenCalled();

    controlled.port!.requestOpen(
      surfaceRequest(
        controlled.binding,
        trigger,
        { kind: "activate", pointer: "mouse" },
        context
      )
    );
    await vi.waitFor(() => expect(context.subscribe).toHaveBeenCalledOnce());
    listener?.();
    expect(runtime.updateContext).toHaveBeenCalled();
    host.close({ restoreFocus: false });
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("suspends Tutor before mobile acquisition and refuses external modals silently", async () => {
    const target = document.createElement("div");
    const background = document.createElement("main");
    document.body.append(background, target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const restoreTutor = vi.fn();
    const tutor = {
      isPresentationVisible: vi.fn(() => true),
      suspendPresentationForGlossary: vi.fn(() => ({
        restore: restoreTutor,
      })),
    };
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => true,
      modalEnvironment: createPlatformModalEnvironment(),
      modalBackground: () => [background],
      tutorPresentation: tutor,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    const blocker = document.createElement("div");
    blocker.setAttribute("aria-modal", "true");
    document.body.append(blocker);

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "touch",
      })
    );
    await Promise.resolve();
    expect(runtime.mount).not.toHaveBeenCalled();
    expect(tutor.suspendPresentationForGlossary).toHaveBeenCalledOnce();
    expect(restoreTutor).toHaveBeenCalledOnce();
    expect(background.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");

    blocker.remove();
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "touch",
      })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());
    expect(tutor.suspendPresentationForGlossary).toHaveBeenCalledTimes(2);
    expect(restoreTutor).toHaveBeenCalledOnce();
    expect(background.hasAttribute("inert")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("rejects stale loader completion and transfers an explicit pinned replacement", async () => {
    let resolve!: (module: GlossarySurfaceRuntimeModule) => void;
    const pending = new Promise<GlossarySurfaceRuntimeModule>((done) => {
      resolve = done;
    });
    const target = document.createElement("div");
    document.body.append(target);
    const staleRuntime = surfaceModule();
    const staleBinding = controlledBinding();
    const staleHost = createPlatformGlossaryHost({
      target,
      loadSurface: () => pending,
      isMobile: () => false,
    });
    staleHost.connect(staleBinding.binding);
    staleBinding.port!.requestOpen(
      surfaceRequest(staleBinding.binding, connectedTrigger(), {
        kind: "keyboard-focus",
      })
    );
    staleHost.disconnect();
    resolve(staleRuntime.module);
    await pending;
    await Promise.resolve();
    expect(staleRuntime.mount).not.toHaveBeenCalled();

    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const firstTrigger = connectedTrigger();
    const firstRequest = surfaceRequest(controlled.binding, firstTrigger, {
      kind: "activate",
      pointer: "mouse",
    });
    controlled.port!.requestOpen(firstRequest);
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());
    const candidate = controlled.port!.beginScopeRerender(firstRequest.identity.scope);
    expect(candidate?.mode).toBe("pinned");
    const replacementTrigger = connectedTrigger();
    const replacement = surfaceRequest(
      controlled.binding,
      replacementTrigger,
      { kind: "activate", pointer: "mouse" },
      undefined,
      2
    );
    controlled.port!.replacementCommitted({
      kind: "transferred",
      previous: candidate!,
      replacement: replacement.identity,
    });

    expect(firstTrigger.hasAttribute("aria-expanded")).toBe(false);
    expect(replacementTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(runtime.dispose).not.toHaveBeenCalled();
  });

  it("closes a transferred pinned surface with Escape and restores replacement focus", async () => {
    const transferred = await openTransferredPinnedSurface();
    transferred.outside.focus();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );

    expect(transferred.target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(transferred.replacementTrigger);
    transferred.host.dispose();
  });

  it("closes a transferred pinned surface explicitly and restores replacement focus", async () => {
    const transferred = await openTransferredPinnedSurface();
    transferred.outside.focus();

    transferred.target
      .querySelector<HTMLButtonElement>("[data-glossary-close]")!
      .click();

    expect(transferred.target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(transferred.replacementTrigger);
    transferred.host.dispose();
  });

  it("closes a transferred pinned surface outside without forcing replacement focus", async () => {
    const transferred = await openTransferredPinnedSurface();
    transferred.outside.focus();

    transferred.outside.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    );

    expect(transferred.target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(transferred.outside);
    transferred.host.dispose();
  });

  it("does not let a stale pre-transfer close callback close a later surface", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const firstTrigger = connectedTrigger();
    const firstRequest = surfaceRequest(controlled.binding, firstTrigger, {
      kind: "activate",
      pointer: "mouse",
    });
    controlled.port!.requestOpen(firstRequest);
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());
    const staleClose = runtime.mount.mock.calls[0]![1].onClose;
    const candidate = controlled.port!.beginScopeRerender(
      firstRequest.identity.scope
    )!;
    const replacementTrigger = connectedTrigger();
    const replacement = surfaceRequest(
      controlled.binding,
      replacementTrigger,
      { kind: "activate", pointer: "mouse" },
      undefined,
      2
    );
    controlled.port!.replacementCommitted({
      kind: "transferred",
      previous: candidate,
      replacement: replacement.identity,
    });
    host.close({ restoreFocus: false });

    const unrelatedTrigger = connectedTrigger();
    controlled.port!.requestOpen(
      surfaceRequest(
        controlled.binding,
        unrelatedTrigger,
        { kind: "activate", pointer: "mouse" },
        undefined,
        3
      )
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledTimes(2));
    staleClose("explicit-close");

    expect(target.childElementCount).toBe(1);
    expect(unrelatedTrigger.getAttribute("aria-expanded")).toBe("true");
    host.dispose();
  });

  it("rebinds replacement trigger watching and ignores the detached old trigger", async () => {
    let frame: FrameRequestCallback | undefined;
    const target = document.createElement("div");
    document.body.append(target);
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => ({ mountGlossarySurface }),
      isMobile: () => false,
      requestAnimationFrame: (callback) => {
        frame = callback;
        return 1;
      },
      cancelAnimationFrame: vi.fn(),
    });
    host.connect(controlled.binding);
    const firstTrigger = connectedTrigger();
    const firstRequest = surfaceRequest(controlled.binding, firstTrigger, {
      kind: "activate",
      pointer: "mouse",
    });
    controlled.port!.requestOpen(firstRequest);
    await vi.waitFor(() =>
      expect(target.querySelector("[data-glossary-surface]")).not.toBeNull()
    );
    const candidate = controlled.port!.beginScopeRerender(
      firstRequest.identity.scope
    )!;
    const replacementTrigger = connectedTrigger();
    const replacement = surfaceRequest(
      controlled.binding,
      replacementTrigger,
      { kind: "activate", pointer: "mouse" },
      undefined,
      2
    );
    controlled.port!.replacementCommitted({
      kind: "transferred",
      previous: candidate,
      replacement: replacement.identity,
    });

    firstTrigger.remove();
    firstTrigger.dispatchEvent(new FocusEvent("blur"));
    document.dispatchEvent(new Event("scroll"));
    frame?.(0);
    expect(target.querySelector("[data-glossary-surface]")).not.toBeNull();

    replacementTrigger.remove();
    document.dispatchEvent(new Event("scroll"));
    frame?.(1);
    expect(target.childElementCount).toBe(0);
    host.dispose();
  });

  it("closes transferred mobile sheets onto each replacement trigger", async () => {
    const target = document.createElement("div");
    const background = document.createElement("main");
    document.body.append(background, target);
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => ({ mountGlossarySurface }),
      isMobile: () => true,
      modalBackground: () => [background],
    });
    host.connect(controlled.binding);

    const openAndTransfer = async (
      originalGeneration: number,
      replacementGeneration: number
    ): Promise<HTMLButtonElement> => {
      const originalTrigger = connectedTrigger();
      const originalRequest = surfaceRequest(
        controlled.binding,
        originalTrigger,
        { kind: "activate", pointer: "touch" },
        undefined,
        originalGeneration
      );
      controlled.port!.requestOpen(originalRequest);
      await vi.waitFor(() =>
        expect(
          target.querySelector('.glossary-surface-mobile-sheet[aria-modal="true"]')
        ).not.toBeNull()
      );
      const candidate = controlled.port!.beginScopeRerender(
        originalRequest.identity.scope
      )!;
      expect(candidate.mode).toBe("mobile-sheet");
      const replacementTrigger = connectedTrigger();
      const replacement = surfaceRequest(
        controlled.binding,
        replacementTrigger,
        { kind: "activate", pointer: "touch" },
        undefined,
        replacementGeneration
      );
      controlled.port!.replacementCommitted({
        kind: "transferred",
        previous: candidate,
        replacement: replacement.identity,
      });
      expect(originalTrigger.hasAttribute("aria-expanded")).toBe(false);
      expect(replacementTrigger.getAttribute("aria-expanded")).toBe("true");
      return replacementTrigger;
    };

    const escapeReplacement = await openAndTransfer(1, 2);
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(escapeReplacement);
    expect(background.hasAttribute("inert")).toBe(false);

    const closeReplacement = await openAndTransfer(3, 4);
    target
      .querySelector<HTMLButtonElement>("[data-glossary-close]")!
      .click();
    expect(target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(closeReplacement);
    expect(background.hasAttribute("inert")).toBe(false);
    host.dispose();
  });

  it("ignores hover requests when the device does not support fine hover", async () => {
    vi.useFakeTimers();
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      canHover: () => false,
    });
    host.connect(controlled.binding);

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, connectedTrigger(), { kind: "hover" })
    );
    await vi.advanceTimersByTimeAsync(220);

    expect(runtime.mount).not.toHaveBeenCalled();
  });

  it("closes preview on document scroll and coalesces pinned repositioning to one frame", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    let frame: FrameRequestCallback | undefined;
    const requestFrame = vi.fn((callback: FrameRequestCallback) => {
      frame = callback;
      return 7;
    });
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
      requestAnimationFrame: requestFrame,
      cancelAnimationFrame: vi.fn(),
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, { kind: "keyboard-focus" })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());

    document.dispatchEvent(new Event("scroll"));
    expect(runtime.dispose).toHaveBeenCalledOnce();

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "mouse",
      })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledTimes(2));
    document.dispatchEvent(new Event("scroll"));
    document.dispatchEvent(new Event("scroll"));
    expect(requestFrame).toHaveBeenCalledOnce();
    frame?.(0);
    expect(target.firstElementChild?.getAttribute("data-glossary-side")).toBe(
      "bottom"
    );
  });

  it("rolls Tutor back and does not mount when an external modal appears during loading", async () => {
    let resolve!: (module: GlossarySurfaceRuntimeModule) => void;
    const pending = new Promise<GlossarySurfaceRuntimeModule>((done) => {
      resolve = done;
    });
    const target = document.createElement("div");
    const background = document.createElement("main");
    document.body.append(background, target);
    const runtime = surfaceModule();
    const restoreTutor = vi.fn();
    const tutor = {
      isPresentationVisible: vi.fn(() => true),
      suspendPresentationForGlossary: vi.fn(() => ({
        restore: restoreTutor,
      })),
    };
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: () => pending,
      isMobile: () => true,
      modalEnvironment: createPlatformModalEnvironment(),
      modalBackground: () => [background],
      tutorPresentation: tutor,
    });
    host.connect(controlled.binding);
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, connectedTrigger(), {
        kind: "activate",
        pointer: "touch",
      })
    );
    const blocker = document.createElement("div");
    blocker.setAttribute("aria-modal", "true");
    document.body.append(blocker);
    resolve(runtime.module);
    await pending;
    await Promise.resolve();

    expect(runtime.mount).not.toHaveBeenCalled();
    expect(tutor.suspendPresentationForGlossary).toHaveBeenCalledOnce();
    expect(restoreTutor).toHaveBeenCalledOnce();
    expect(background.hasAttribute("inert")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("aborts a detached pending trigger and rolls back its Tutor suspension once", async () => {
    let resolve!: (module: GlossarySurfaceRuntimeModule) => void;
    const pendingModule = new Promise<GlossarySurfaceRuntimeModule>((done) => {
      resolve = done;
    });
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const restoreTutor = vi.fn();
    const tutor = {
      isPresentationVisible: vi.fn(() => true),
      suspendPresentationForGlossary: vi.fn(() => ({
        restore: restoreTutor,
      })),
    };
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: () => pendingModule,
      isMobile: () => true,
      tutorPresentation: tutor,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "touch",
      })
    );
    expect(tutor.suspendPresentationForGlossary).toHaveBeenCalledOnce();

    trigger.remove();
    resolve(runtime.module);
    await pendingModule;
    await Promise.resolve();

    expect(runtime.mount).not.toHaveBeenCalled();
    expect(restoreTutor).toHaveBeenCalledOnce();
    expect(target.childElementCount).toBe(0);
    host.close({ restoreFocus: false });
    expect(restoreTutor).toHaveBeenCalledOnce();
  });

  it("cleans a pending suspension when its binding identity becomes stale", async () => {
    let resolve!: (module: GlossarySurfaceRuntimeModule) => void;
    const pendingModule = new Promise<GlossarySurfaceRuntimeModule>((done) => {
      resolve = done;
    });
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const restoreTutor = vi.fn();
    const tutor = {
      isPresentationVisible: vi.fn(() => true),
      suspendPresentationForGlossary: vi.fn(() => ({
        restore: restoreTutor,
      })),
    };
    const controlled = controlledMutableIdentityBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: () => pendingModule,
      isMobile: () => true,
      tutorPresentation: tutor,
    });
    host.connect(controlled.binding);
    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, connectedTrigger(), {
        kind: "activate",
        pointer: "touch",
      })
    );

    controlled.replaceIdentity();
    resolve(runtime.module);
    await pendingModule;
    await Promise.resolve();

    expect(runtime.mount).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(restoreTutor).toHaveBeenCalledOnce());
    host.close({ restoreFocus: false });
    expect(restoreTutor).toHaveBeenCalledOnce();
  });

  it("does not let a stale abort roll back a newer pending request", async () => {
    let resolve!: (module: GlossarySurfaceRuntimeModule) => void;
    const pendingModule = new Promise<GlossarySurfaceRuntimeModule>((done) => {
      resolve = done;
    });
    const target = document.createElement("div");
    document.body.append(target);
    const runtime = surfaceModule();
    const restoreFirst = vi.fn();
    const restoreSecond = vi.fn();
    const tutor = {
      isPresentationVisible: vi.fn(() => true),
      suspendPresentationForGlossary: vi
        .fn()
        .mockReturnValueOnce({ restore: restoreFirst })
        .mockReturnValueOnce({ restore: restoreSecond }),
    };
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: () => pendingModule,
      isMobile: () => true,
      tutorPresentation: tutor,
    });
    host.connect(controlled.binding);
    controlled.port!.requestOpen(
      surfaceRequest(
        controlled.binding,
        connectedTrigger(),
        { kind: "activate", pointer: "touch" },
        undefined,
        1
      )
    );
    const newestTrigger = connectedTrigger();
    controlled.port!.requestOpen(
      surfaceRequest(
        controlled.binding,
        newestTrigger,
        { kind: "activate", pointer: "touch" },
        undefined,
        2
      )
    );

    expect(restoreFirst).toHaveBeenCalledOnce();
    resolve(runtime.module);
    await pendingModule;
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());

    expect(runtime.mount.mock.calls[0]![1].request.trigger).toBe(newestTrigger);
    expect(restoreSecond).not.toHaveBeenCalled();
    expect(newestTrigger.getAttribute("aria-expanded")).toBe("true");
    host.close({ restoreFocus: false });
    expect(restoreSecond).not.toHaveBeenCalled();
  });

  it("restores focus for Escape/Close but not outside-pointer closure", async () => {
    const target = document.createElement("div");
    const outside = document.createElement("button");
    document.body.append(target, outside);
    const closeSurface: { current?: SurfaceClose } = {};
    const runtime = surfaceModule();
    runtime.mount.mockImplementation((surfaceTarget, mountOptions) => {
      closeSurface.current = mountOptions.onClose;
      const element = document.createElement("aside");
      element.id = "focus-surface";
      Object.defineProperty(element, "getBoundingClientRect", {
        value: () => ({
          left: 0, right: 360, top: 0, bottom: 200,
          width: 360, height: 200, x: 0, y: 0, toJSON: () => ({}),
        }),
      });
      surfaceTarget.replaceChildren(element);
      return {
        element,
        updateContext: vi.fn(),
        reposition: vi.fn(() => true),
        dispose: vi.fn(() => element.remove()),
      };
    });
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => false,
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    const open = () =>
      controlled.port!.requestOpen(
        surfaceRequest(controlled.binding, trigger, {
          kind: "activate",
          pointer: "mouse",
        })
      );

    open();
    await vi.waitFor(() => expect(closeSurface.current).toBeTypeOf("function"));
    outside.focus();
    invokeSurfaceClose(closeSurface, "explicit-close");
    expect(document.activeElement).toBe(trigger);

    closeSurface.current = undefined;
    open();
    await vi.waitFor(() => expect(closeSurface.current).toBeTypeOf("function"));
    outside.focus();
    invokeSurfaceClose(closeSurface, "outside-pointer");
    expect(document.activeElement).toBe(outside);
  });

  it("does not reopen a mobile sheet from its own programmatic focus restoration", async () => {
    const target = document.createElement("div");
    const background = document.createElement("main");
    document.body.append(background, target);
    const runtime = surfaceModule();
    const controlled = controlledBinding();
    const host = createPlatformGlossaryHost({
      target,
      loadSurface: async () => runtime.module,
      isMobile: () => true,
      modalBackground: () => [background],
    });
    host.connect(controlled.binding);
    const trigger = connectedTrigger();
    trigger.addEventListener("focus", () => {
      controlled.port?.requestOpen(
        surfaceRequest(controlled.binding, trigger, { kind: "keyboard-focus" })
      );
    });

    controlled.port!.requestOpen(
      surfaceRequest(controlled.binding, trigger, {
        kind: "activate",
        pointer: "touch",
      })
    );
    await vi.waitFor(() => expect(runtime.mount).toHaveBeenCalledOnce());
    runtime.mount.mock.calls[0]![1].onClose("explicit-close");
    await Promise.resolve();
    await Promise.resolve();

    expect(runtime.mount).toHaveBeenCalledOnce();
    expect(target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
    expect(background.hasAttribute("inert")).toBe(false);
  });
});
