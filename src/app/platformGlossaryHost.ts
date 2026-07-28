import type { LabGlossaryBinding } from "../glossary/glossaryController";
import {
  createGlossarySurfaceLoader,
  type GlossarySurfaceLoader,
} from "../glossary/glossarySurfaceLoader";
import type { GlossaryTutorHandoff } from "../glossary/glossaryTutorContract";
import type {
  GlossaryHostPort,
  GlossaryReplacementCandidate,
  GlossaryReplacementResult,
  GlossaryScopeIdentity,
  GlossarySurfaceRequest,
  GlossaryTermIdentity,
} from "../glossary/glossaryRuntimeTypes";
import type {
  GlossarySurfaceMode,
  GlossarySurfaceRuntimeModule,
  MountedGlossarySurface,
} from "../glossary/surface/glossarySurfaceRuntime";
import {
  createPlatformModalEnvironment,
  hasActiveExternalModal,
  type PlatformModalEnvironment,
  type PlatformModalLease,
} from "./platformModalEnvironment";
import type { PlatformTutorPresentationSuspension } from "./platformTutorHost";

export interface PlatformGlossaryHost {
  connect(
    binding: LabGlossaryBinding,
    options?: { readonly tutorHandoff?: GlossaryTutorHandoff }
  ): void;
  disconnect(): void;
  close(options?: { readonly restoreFocus?: boolean }): void;
  dispose(): void;
}

export interface CreatePlatformGlossaryHostOptions {
  readonly target: HTMLElement;
  readonly statusRegion?: HTMLElement;
  readonly loadSurface?: () => Promise<GlossarySurfaceRuntimeModule>;
  readonly isMobile?: () => boolean;
  readonly canHover?: () => boolean;
  readonly modalEnvironment?: PlatformModalEnvironment;
  readonly modalBackground?: () => readonly HTMLElement[];
  readonly tutorPresentation?: {
    isPresentationVisible(): boolean;
    suspendPresentationForGlossary():
      | PlatformTutorPresentationSuspension
      | undefined;
  };
  readonly requestAnimationFrame?: (callback: FrameRequestCallback) => number;
  readonly cancelAnimationFrame?: (handle: number) => void;
}

interface Connection {
  readonly binding: LabGlossaryBinding;
  readonly disconnectBinding: () => void;
  readonly tutorHandoff?: GlossaryTutorHandoff;
}

interface ActiveSurface {
  readonly identity: object;
  request: GlossarySurfaceRequest;
  readonly mode: GlossarySurfaceMode;
  readonly mounted: MountedGlossarySurface;
  unsubscribe?: () => void;
  modalLease?: PlatformModalLease;
}

interface LoadingSurface {
  readonly request: GlossarySurfaceRequest;
  readonly mode: GlossarySurfaceMode;
  readonly generation: number;
  tutorSuspension?: PlatformTutorPresentationSuspension;
}

function sameTermIdentity(
  left: GlossaryTermIdentity,
  right: GlossaryTermIdentity
): boolean {
  return (
    left.binding === right.binding &&
    left.scope === right.scope &&
    left.termId === right.termId &&
    left.scopeGeneration === right.scopeGeneration &&
    left.trigger === right.trigger
  );
}

function activeIdentityMatches(
  request: GlossarySurfaceRequest,
  connection: Connection | undefined
): boolean {
  return Boolean(
    connection &&
      request.identity.binding === connection.binding.identity &&
      request.moduleId === connection.binding.moduleId &&
      request.scopeGeneration === request.identity.scopeGeneration &&
      request.identity.scope.binding === connection.binding.identity
  );
}

function triggerIsUsable(
  request: GlossarySurfaceRequest,
  connection: Connection | undefined
): boolean {
  const trigger = request.trigger;
  if (
    !activeIdentityMatches(request, connection) ||
    !trigger.isConnected ||
    trigger.disabled ||
    trigger.hidden ||
    trigger.getAttribute("aria-hidden") === "true" ||
    trigger.closest("[hidden], [aria-hidden=true], [inert]")
  ) {
    return false;
  }
  const rect = trigger.getBoundingClientRect();
  return !(
    rect.bottom < -12 ||
    rect.top > window.innerHeight + 12 ||
    rect.right < -12 ||
    rect.left > window.innerWidth + 12
  );
}

function focusWithoutScroll(element: HTMLElement): void {
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

export function createPlatformGlossaryHost(
  options: CreatePlatformGlossaryHostOptions
): PlatformGlossaryHost {
  let connection: Connection | undefined;
  let active: ActiveSurface | undefined;
  let loading: LoadingSurface | undefined;
  let requestGeneration = 0;
  let openTimer: ReturnType<typeof setTimeout> | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let animationFrame: number | undefined;
  let disposed = false;
  let globalsConnected = false;
  let watchedRequest: GlossarySurfaceRequest | undefined;
  let suppressedFocusTrigger: HTMLButtonElement | undefined;
  const ownsModalEnvironment = options.modalEnvironment === undefined;
  const modalEnvironment =
    options.modalEnvironment ?? createPlatformModalEnvironment();
  const isMobile =
    options.isMobile ??
    (() => window.matchMedia?.("(max-width: 760px)").matches ?? false);
  const canHover =
    options.canHover ??
    (() =>
      window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? true);
  const requestFrame =
    options.requestAnimationFrame ?? window.requestAnimationFrame.bind(window);
  const cancelFrame =
    options.cancelAnimationFrame ?? window.cancelAnimationFrame.bind(window);
  const loader: GlossarySurfaceLoader<GlossarySurfaceRuntimeModule> =
    createGlossarySurfaceLoader(
      options.loadSurface ??
        (() => import("../glossary/surface/glossarySurfaceRuntime"))
    );

  const clearOpenTimer = (): void => {
    if (openTimer === undefined) return;
    clearTimeout(openTimer);
    openTimer = undefined;
  };
  const clearCloseTimer = (): void => {
    if (closeTimer === undefined) return;
    clearTimeout(closeTimer);
    closeTimer = undefined;
  };
  const clearAnimationFrame = (): void => {
    if (animationFrame === undefined) return;
    cancelFrame(animationFrame);
    animationFrame = undefined;
  };
  const clearTriggerState = (request: GlossarySurfaceRequest): void => {
    request.trigger.removeAttribute("aria-controls");
    request.trigger.removeAttribute("aria-expanded");
    request.trigger.classList.remove("glossary-term-trigger-active");
  };
  const rollbackTutorSuspension = (pending: LoadingSurface): void => {
    const suspension = pending.tutorSuspension;
    pending.tutorSuspension = undefined;
    suspension?.restore();
  };
  const abortLoadingSurface = (pending: LoadingSurface): void => {
    if (loading !== pending) return;
    loading = undefined;
    requestGeneration += 1;
    if (watchedRequest === pending.request) unwatchTrigger();
    rollbackTutorSuspension(pending);
  };

  function unwatchTrigger(): void {
    watchedRequest?.trigger.removeEventListener(
      "pointerleave",
      onTriggerPointerLeave
    );
    watchedRequest?.trigger.removeEventListener("blur", onTriggerBlur);
    watchedRequest = undefined;
  }

  function watchTrigger(request: GlossarySurfaceRequest): void {
    if (watchedRequest === request) return;
    unwatchTrigger();
    watchedRequest = request;
    request.trigger.addEventListener("pointerleave", onTriggerPointerLeave);
    request.trigger.addEventListener("blur", onTriggerBlur);
  }

  function onTriggerPointerLeave(): void {
    const request = watchedRequest;
    clearOpenTimer();
    if (!request || active?.request !== request || active.mode !== "preview") {
      return;
    }
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      closeTimer = undefined;
      closeInternal(false, request);
    }, 300);
  }

  function onTriggerBlur(): void {
    const request = watchedRequest;
    if (request && active?.request === request && active.mode === "preview") {
      closeInternal(false, request);
    }
  }

  function disconnectGlobals(): void {
    if (!globalsConnected) return;
    globalsConnected = false;
    document.removeEventListener("scroll", onDocumentScroll, true);
    window.removeEventListener("resize", onResize);
    options.target.removeEventListener("pointerenter", onSurfacePointerEnter);
    options.target.removeEventListener("pointerleave", onSurfacePointerLeave);
  }

  function connectGlobals(): void {
    if (globalsConnected) return;
    globalsConnected = true;
    document.addEventListener("scroll", onDocumentScroll, true);
    window.addEventListener("resize", onResize);
    options.target.addEventListener("pointerenter", onSurfacePointerEnter);
    options.target.addEventListener("pointerleave", onSurfacePointerLeave);
  }

  function closeInternal(
    restoreFocus: boolean,
    expectedRequest?: GlossarySurfaceRequest
  ): void {
    if (
      expectedRequest &&
      active?.request !== expectedRequest &&
      loading?.request !== expectedRequest
    ) {
      return;
    }
    const closingRequest = active?.request ?? loading?.request;
    const closingLoading = loading;
    clearOpenTimer();
    clearCloseTimer();
    clearAnimationFrame();
    requestGeneration += 1;
    active?.unsubscribe?.();
    active?.mounted.dispose();
    active?.modalLease?.release();
    if (closingRequest) clearTriggerState(closingRequest);
    active = undefined;
    loading = undefined;
    unwatchTrigger();
    disconnectGlobals();
    options.target.replaceChildren();
    if (closingLoading) rollbackTutorSuspension(closingLoading);
    if (
      restoreFocus &&
      closingRequest &&
      triggerIsUsable(closingRequest, connection)
    ) {
      const trigger = closingRequest.trigger;
      suppressedFocusTrigger = trigger;
      focusWithoutScroll(trigger);
      queueMicrotask(() => {
        if (suppressedFocusTrigger === trigger) {
          suppressedFocusTrigger = undefined;
        }
      });
    }
  }

  function closeMountedSurface(
    restoreFocus: boolean,
    expectedSurfaceIdentity: object
  ): void {
    if (active?.identity !== expectedSurfaceIdentity) return;
    closeInternal(restoreFocus);
  }

  function applyPlacement(surface: ActiveSurface): boolean {
    if (surface.mode === "mobile-sheet") return true;
    if (!triggerIsUsable(surface.request, connection)) {
      closeInternal(false, surface.request);
      return false;
    }
    const positioned = surface.mounted.reposition(
      surface.request.trigger.getBoundingClientRect(),
      {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    );
    if (!positioned) {
      closeInternal(false, surface.request);
      return false;
    }
    return true;
  }

  function scheduleReposition(): void {
    if (!active || active.mode !== "pinned" || animationFrame !== undefined) {
      return;
    }
    animationFrame = requestFrame(() => {
      animationFrame = undefined;
      if (active?.mode === "pinned") applyPlacement(active);
    });
  }

  function onDocumentScroll(event: Event): void {
    if (
      event.target instanceof Node &&
      options.target.contains(event.target)
    ) {
      return;
    }
    if (active?.mode === "preview") {
      closeInternal(false, active.request);
    } else if (active?.mode === "pinned") {
      scheduleReposition();
    }
  }

  function onResize(): void {
    if (!active) return;
    const nextMode: GlossarySurfaceMode = isMobile()
      ? "mobile-sheet"
      : active.mode === "preview"
        ? "preview"
        : "pinned";
    if (nextMode !== active.mode) {
      const request = active.request;
      closeInternal(false);
      void openSurface(request, nextMode);
    } else if (active.mode === "pinned") {
      scheduleReposition();
    }
  }

  function renderFailure(failed: LoadingSurface, cause: unknown): void {
    if (
      disposed ||
      loading !== failed ||
      failed.generation !== requestGeneration
    ) {
      return;
    }
    rollbackTutorSuspension(failed);
    const failure = document.createElement("aside");
    failure.className = "glossary-surface glossary-surface-failure";
    failure.setAttribute("role", "alert");
    const message = document.createElement("p");
    message.textContent =
      "The definition could not load. You can retry without leaving the Lab.";
    message.title = cause instanceof Error ? cause.message : String(cause);
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn primary";
    retry.textContent = "Retry";
    retry.addEventListener("click", () => {
      void openSurface(failed.request, failed.mode, true);
    });
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn ghost";
    close.textContent = "Close";
    close.addEventListener("click", () => closeInternal(true));
    failure.append(message, retry, close);
    options.target.replaceChildren(failure);
  }

  function mountLoadedSurface(
    module: GlossarySurfaceRuntimeModule,
    pending: LoadingSurface
  ): void {
    if (
      disposed ||
      loading !== pending ||
      pending.generation !== requestGeneration ||
      !activeIdentityMatches(pending.request, connection) ||
      !triggerIsUsable(pending.request, connection)
    ) {
      abortLoadingSurface(pending);
      return;
    }
    if (pending.mode === "mobile-sheet" && hasActiveExternalModal(options.target)) {
      abortLoadingSurface(pending);
      return;
    }

    let modalLease: PlatformModalLease | undefined;
    if (pending.mode === "mobile-sheet") {
      const background = options.modalBackground?.() ?? [];
      if (hasActiveExternalModal(options.target)) {
        abortLoadingSurface(pending);
        return;
      }
      const acquired = modalEnvironment.acquire({
        owner: "glossary",
        hostRegion: options.target,
        background,
      });
      if (acquired.status === "blocked") {
        abortLoadingSurface(pending);
        return;
      }
      modalLease = acquired.lease;
    }

    const currentConnection = connection;
    const surfaceIdentity = Object.freeze({});
    const mounted = module.mountGlossarySurface(options.target, {
      mode: pending.mode,
      request: pending.request,
      statusRegion: options.statusRegion,
      onClose: (reason) =>
        closeMountedSurface(
          reason === "escape" || reason === "explicit-close",
          surfaceIdentity
        ),
      ...(currentConnection?.tutorHandoff
        ? {
            onAskTutor: async (request, trigger) => {
              const handoff = currentConnection.tutorHandoff;
              closeInternal(false);
              await handoff?.askTerm({
                request,
                trigger,
                preserveDraft: true,
              });
            },
          }
        : {}),
    });
    if (
      disposed ||
      loading !== pending ||
      pending.generation !== requestGeneration
    ) {
      mounted.dispose();
      modalLease?.release();
      abortLoadingSurface(pending);
      return;
    }
    active = {
      identity: surfaceIdentity,
      request: pending.request,
      mode: pending.mode,
      mounted,
      ...(modalLease ? { modalLease } : {}),
    };
    pending.tutorSuspension = undefined;
    loading = undefined;
    pending.request.trigger.setAttribute("aria-controls", mounted.element.id);
    pending.request.trigger.setAttribute("aria-expanded", "true");
    pending.request.trigger.classList.add("glossary-term-trigger-active");
    connectGlobals();

    if (pending.mode !== "preview" && pending.request.context) {
      const source = pending.request.context;
      mounted.updateContext(source.getSnapshot());
      const expected = active;
      active.unsubscribe = source.subscribe(() => {
        if (
          active !== expected ||
          !activeIdentityMatches(active.request, connection)
        ) {
          return;
        }
        active.mounted.updateContext(source.getSnapshot());
      });
    }
    if (pending.mode !== "mobile-sheet") applyPlacement(active);
  }

  async function openSurface(
    request: GlossarySurfaceRequest,
    mode: GlossarySurfaceMode,
    retry = false
  ): Promise<void> {
    if (
      disposed ||
      !activeIdentityMatches(request, connection) ||
      !triggerIsUsable(request, connection)
    ) {
      return;
    }
    closeInternal(false);
    let tutorSuspension: PlatformTutorPresentationSuspension | undefined;
    if (
      mode === "mobile-sheet" &&
      options.tutorPresentation?.isPresentationVisible()
    ) {
      tutorSuspension =
        options.tutorPresentation.suspendPresentationForGlossary();
    }
    if (mode === "mobile-sheet" && hasActiveExternalModal(options.target)) {
      tutorSuspension?.restore();
      return;
    }
    watchTrigger(request);
    const pending: LoadingSurface = {
      request,
      mode,
      generation: ++requestGeneration,
      ...(tutorSuspension ? { tutorSuspension } : {}),
    };
    loading = pending;
    const loadRequest = {
      generation: pending.generation,
      isCurrent: (generation: number) =>
        !disposed &&
        loading === pending &&
        generation === requestGeneration &&
        activeIdentityMatches(request, connection),
      mount: (module: GlossarySurfaceRuntimeModule) =>
        mountLoadedSurface(module, pending),
    };
    try {
      const result = await (
        retry ? loader.retry(loadRequest) : loader.load(loadRequest)
      );
      if (result === "stale") abortLoadingSurface(pending);
    } catch (cause) {
      renderFailure(pending, cause);
    }
  }

  function onSurfacePointerEnter(): void {
    clearCloseTimer();
  }

  function onSurfacePointerLeave(): void {
    if (active?.mode !== "preview") return;
    clearCloseTimer();
    const request = active.request;
    closeTimer = setTimeout(() => {
      closeTimer = undefined;
      closeInternal(false, request);
    }, 300);
  }

  function handleReplacement(result: GlossaryReplacementResult): void {
    if (result.kind === "closed") {
      if (
        active?.request.identity.scope === result.scope ||
        loading?.request.identity.scope === result.scope ||
        (result.previous &&
          active &&
          sameTermIdentity(active.request.identity, result.previous.identity))
      ) {
        closeInternal(false);
      }
      return;
    }
    if (
      !active ||
      !sameTermIdentity(active.request.identity, result.previous.identity) ||
      result.replacement.binding !== connection?.binding.identity
    ) {
      return;
    }
    clearTriggerState(active.request);
    const replacementRequest: GlossarySurfaceRequest = Object.freeze({
      ...active.request,
      identity: result.replacement,
      trigger: result.replacement.trigger,
      scopeGeneration: result.replacement.scopeGeneration,
    });
    active.request = replacementRequest;
    active.mounted.replaceTrigger?.(result.replacement.trigger);
    watchTrigger(replacementRequest);
    result.replacement.trigger.setAttribute(
      "aria-controls",
      active.mounted.element.id
    );
    result.replacement.trigger.setAttribute("aria-expanded", "true");
    result.replacement.trigger.classList.add("glossary-term-trigger-active");
    if (active.mode === "pinned") applyPlacement(active);
  }

  const port: GlossaryHostPort = Object.freeze({
    requestOpen(request: GlossarySurfaceRequest): void {
      if (!activeIdentityMatches(request, connection)) return;
      if (
        request.intent.kind === "keyboard-focus" &&
        suppressedFocusTrigger === request.trigger
      ) {
        suppressedFocusTrigger = undefined;
        return;
      }
      watchTrigger(request);
      clearOpenTimer();
      clearCloseTimer();
      if (request.intent.kind === "hover") {
        if (!canHover()) return;
        openTimer = setTimeout(() => {
          openTimer = undefined;
          void openSurface(request, "preview");
        }, 220);
        return;
      }
      const mode: GlossarySurfaceMode =
        request.intent.kind === "activate" &&
        (request.intent.pointer === "touch" || isMobile())
          ? "mobile-sheet"
          : request.intent.kind === "activate"
            ? "pinned"
            : isMobile()
              ? "mobile-sheet"
              : "preview";
      void openSurface(request, mode);
    },
    requestClose(request: GlossarySurfaceRequest): void {
      clearOpenTimer();
      const surface = active;
      if (!surface || surface.request !== request || surface.mode !== "preview") {
        return;
      }
      clearCloseTimer();
      closeTimer = setTimeout(() => {
        closeTimer = undefined;
        closeInternal(false, request);
      }, 300);
    },
    beginScopeRerender(
      identity: GlossaryScopeIdentity
    ): GlossaryReplacementCandidate | undefined {
      const surface = active;
      const pending = loading;
      if (pending?.request.identity.scope === identity) {
        abortLoadingSurface(pending);
        options.target.replaceChildren();
      }
      if (
        watchedRequest?.identity.scope === identity &&
        surface?.request !== watchedRequest
      ) {
        if (surface) {
          clearOpenTimer();
          unwatchTrigger();
          watchTrigger(surface.request);
        } else {
          closeInternal(false);
        }
      }
      if (!surface || surface.request.identity.scope !== identity) {
        return undefined;
      }
      if (surface.mode === "preview") {
        closeInternal(false, surface.request);
        return undefined;
      }
      return Object.freeze({
        mode: surface.mode,
        identity: surface.request.identity,
      });
    },
    scopeDisposed(identity: GlossaryScopeIdentity): void {
      if (
        active?.request.identity.scope === identity ||
        loading?.request.identity.scope === identity
      ) {
        closeInternal(false);
      }
    },
    replacementCommitted(result: GlossaryReplacementResult): void {
      handleReplacement(result);
    },
  });

  const host: PlatformGlossaryHost = {
    connect(binding, connectOptions = {}): void {
      if (disposed) return;
      host.disconnect();
      const disconnectBinding = binding.connect(port);
      connection = {
        binding,
        disconnectBinding,
        ...(connectOptions.tutorHandoff
          ? { tutorHandoff: connectOptions.tutorHandoff }
          : {}),
      };
    },
    disconnect(): void {
      suppressedFocusTrigger = undefined;
      closeInternal(false);
      const current = connection;
      connection = undefined;
      current?.disconnectBinding();
    },
    close(closeOptions = {}): void {
      closeInternal(closeOptions.restoreFocus !== false);
    },
    dispose(): void {
      if (disposed) return;
      host.disconnect();
      disposed = true;
      disconnectGlobals();
      if (ownsModalEnvironment) modalEnvironment.dispose();
      options.target.replaceChildren();
    },
  };
  return Object.freeze(host);
}
