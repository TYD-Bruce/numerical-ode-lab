import type { LabTutorBinding, TutorSessionAccess } from "./contracts";
import { clearTutorConversation, setTutorDesktopOpen } from "../tutor/moduleTutorSession";
import type {
  MountedPlatformTutorPanel,
  PlatformTutorPanelOptions,
} from "../tutor/platformTutorPanel";
import {
  createPlatformModalEnvironment,
  hasActiveExternalModal,
  type PlatformModalEnvironment,
  type PlatformModalLease,
} from "./platformModalEnvironment";

export interface TutorPanelModule {
  mountPlatformTutorPanel(
    target: HTMLElement,
    options: PlatformTutorPanelOptions
  ): MountedPlatformTutorPanel;
}

export interface PlatformTutorHost {
  connect(binding: LabTutorBinding<unknown>, sessionAccess: TutorSessionAccess): void;
  disconnect(): void;
  open(trigger: HTMLElement): Promise<void>;
  close(options?: { restoreFocus?: boolean }): void;
  closeMobileForNavigation(): void;
  suspendPresentationForGlossary(): void;
  isPresentationVisible(): boolean;
  invalidateCurrentRequest(): void;
  refresh(): void;
  dispose(): void;
}

export interface CreatePlatformTutorHostOptions {
  readonly target: HTMLElement;
  readonly labTarget?: HTMLElement;
  readonly loadPanel?: () => Promise<TutorPanelModule>;
  readonly isMobile?: () => boolean;
  readonly modalEnvironment?: PlatformModalEnvironment;
  readonly modalBackground?: () => readonly HTMLElement[];
  readonly onBeforeManualOpen?: () => void;
}

type Connection = {
  binding: LabTutorBinding<unknown>;
  sessionAccess: TutorSessionAccess;
  unsubscribeReset?: () => void;
};

export function createPlatformTutorHost(
  options: CreatePlatformTutorHostOptions
): PlatformTutorHost {
  let connection: Connection | undefined;
  let panel: MountedPlatformTutorPanel | undefined;
  let modulePromise: Promise<TutorPanelModule> | undefined;
  let moduleRejected = false;
  let generation = 0;
  let disposed = false;
  let mobileOpen = false;
  let suspended = false;
  let returnFocus: HTMLElement | undefined;
  let presentation: HTMLElement | undefined;
  let modalLease: PlatformModalLease | undefined;
  const ownsModalEnvironment = options.modalEnvironment === undefined;
  const modalEnvironment =
    options.modalEnvironment ?? createPlatformModalEnvironment();

  const loadPanel = options.loadPanel ?? (() => import("../tutor/platformTutorPanel"));
  const isMobile = options.isMobile ?? (() => window.matchMedia?.("(max-width: 760px)").matches ?? false);

  const releaseMobileEnvironment = (): void => {
    modalLease?.release();
    modalLease = undefined;
    mobileOpen = false;
    options.target.classList.remove("platform-tutor-host-mobile");
  };

  const acquireMobileEnvironment = (): boolean => {
    if (mobileOpen && modalLease) return true;
    const result = modalEnvironment.acquire({
      owner: "tutor",
      hostRegion: options.target,
      background:
        options.modalBackground?.() ??
        (options.labTarget ? [options.labTarget] : []),
    });
    if (result.status === "blocked") return false;
    modalLease = result.lease;
    mobileOpen = true;
    options.target.classList.add("platform-tutor-host-mobile");
    return true;
  };

  const appendLauncher = (): HTMLButtonElement => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn primary platform-tutor-open";
    button.dataset.tutorOpen = "";
    button.textContent = "Open AI Tutor";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => void host.open(button));
    options.target.append(button);
    return button;
  };

  const renderClosed = (): void => {
    panel?.dispose();
    panel = undefined;
    presentation = undefined;
    suspended = false;
    releaseMobileEnvironment();
    options.target.classList.remove("platform-tutor-host-mobile");
    options.target.classList.add("platform-tutor-host");
    options.target.replaceChildren();
    if (!connection || disposed) return;
    appendLauncher();
  };

  const renderLoading = (): HTMLElement => {
    options.target.replaceChildren();
    presentation = document.createElement("div");
    presentation.dataset.tutorPresentation = "";
    const panelShell = document.createElement("aside");
    panelShell.className = "platform-tutor-loading";
    panelShell.setAttribute("aria-label", "AI Method Tutor");
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = "Loading AI Tutor…";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn ghost";
    close.textContent = "Close";
    close.addEventListener("click", () => host.close());
    panelShell.append(status, close);
    presentation.append(panelShell);
    options.target.append(presentation);
    return panelShell;
  };

  const renderFailure = (cause: unknown, openGeneration: number): void => {
    if (disposed || openGeneration !== generation || !connection) return;
    presentation = undefined;
    releaseMobileEnvironment();
    options.target.replaceChildren();
    const failure = document.createElement("aside");
    failure.className = "platform-tutor-failure";
    failure.setAttribute("aria-label", "AI Method Tutor");
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    message.textContent = "The AI Tutor could not load. The Lab is still available.";
    message.title = cause instanceof Error ? cause.message : String(cause);
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn primary";
    retry.textContent = "Retry";
    retry.addEventListener("click", () => {
      if (moduleRejected) {
        modulePromise = undefined;
        moduleRejected = false;
      }
      void host.open(retry);
    });
    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn ghost";
    close.textContent = "Close";
    close.addEventListener("click", () => host.close());
    failure.append(message, retry, close);
    options.target.append(failure);
    retry.focus();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && host.isPresentationVisible()) {
      event.preventDefault();
      host.close();
      return;
    }
    if (!panel) return;
    if (event.key !== "Tab" || !mobileOpen) return;
    const focusable = [...presentation?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    ) ?? []];
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  options.target.addEventListener("keydown", onKeyDown);

  const host: PlatformTutorHost = {
    connect(binding, sessionAccess): void {
      if (disposed) return;
      host.disconnect();
      if (binding.moduleId !== sessionAccess.moduleId) {
        throw new Error("Tutor binding and session access must target the same module.");
      }
      const next: Connection = { binding, sessionAccess };
      next.unsubscribeReset = binding.subscribeConversationReset?.(() => {
        panel?.cancelPending?.();
        sessionAccess.updateSession(clearTutorConversation);
        panel?.refresh?.();
      });
      connection = next;
      generation += 1;
      renderClosed();
      if (!isMobile() && sessionAccess.getSession().desktopOpen) {
        const trigger = options.target.querySelector<HTMLElement>("[data-tutor-open]");
        if (trigger) void host.open(trigger);
      }
    },
    disconnect(): void {
      if (disposed && !connection && !panel) return;
      generation += 1;
      connection?.unsubscribeReset?.();
      connection = undefined;
      panel?.dispose();
      panel = undefined;
      presentation = undefined;
      suspended = false;
      releaseMobileEnvironment();
      options.target.replaceChildren();
    },
    async open(trigger): Promise<void> {
      if (disposed || !connection) return;
      options.onBeforeManualOpen?.();
      const mobile = isMobile();
      if (panel && suspended && presentation) {
        if (mobile && !acquireMobileEnvironment()) return;
        if (!mobile) {
          connection.sessionAccess.updateSession((current) =>
            setTutorDesktopOpen(current, true)
          );
        }
        suspended = false;
        presentation.hidden = false;
        presentation.removeAttribute("aria-hidden");
        presentation.removeAttribute("inert");
        options.target.querySelector("[data-tutor-open]")?.remove();
        const dialog = presentation.querySelector<HTMLElement>(".ai-tutor-panel");
        if (mobile) {
          dialog?.setAttribute("role", "dialog");
          dialog?.setAttribute("aria-modal", "true");
        } else {
          dialog?.removeAttribute("role");
          dialog?.removeAttribute("aria-modal");
        }
        panel.focus();
        return;
      }
      if (mobile && !acquireMobileEnvironment()) return;
      const activeConnection = connection;
      const openGeneration = ++generation;
      returnFocus = trigger;
      activeConnection.binding.prepareForOpen?.();
      if (!mobile) {
        activeConnection.sessionAccess.updateSession((current) =>
          setTutorDesktopOpen(current, true)
        );
      }
      renderLoading();
      if (!modulePromise) {
        modulePromise = loadPanel().catch((cause) => {
          moduleRejected = true;
          throw cause;
        });
      }
      try {
        const loaded = await modulePromise;
        if (
          disposed ||
          openGeneration !== generation ||
          connection !== activeConnection
        ) return;
        if (mobile && hasActiveExternalModal(options.target)) {
          renderClosed();
          return;
        }
        moduleRejected = false;
        presentation?.replaceChildren();
        if (!presentation) return;
        panel = loaded.mountPlatformTutorPanel(presentation, {
          binding: activeConnection.binding,
          sessionAccess: activeConnection.sessionAccess,
          onClose: () => host.close(),
          isCurrent: () =>
            !disposed &&
            generation === openGeneration &&
            connection === activeConnection,
          isPresentationVisible: () => host.isPresentationVisible(),
        });
        if (mobileOpen) {
          const dialog = presentation.querySelector<HTMLElement>(".ai-tutor-panel");
          dialog?.setAttribute("role", "dialog");
          dialog?.setAttribute("aria-modal", "true");
        }
        panel.focus();
      } catch (cause) {
        renderFailure(cause, openGeneration);
      }
    },
    close(closeOptions = {}): void {
      if (disposed) return;
      const wasMobile = mobileOpen;
      generation += 1;
      panel?.dispose();
      panel = undefined;
      presentation = undefined;
      suspended = false;
      releaseMobileEnvironment();
      if (connection && !wasMobile) {
        connection.sessionAccess.updateSession((current) =>
          setTutorDesktopOpen(current, false)
        );
      }
      renderClosed();
      if (closeOptions.restoreFocus !== false) {
        const focusTarget = returnFocus?.isConnected
          ? returnFocus
          : options.target.querySelector<HTMLElement>("[data-tutor-open]");
        focusTarget?.focus();
      }
    },
    closeMobileForNavigation(): void {
      if (mobileOpen) host.close({ restoreFocus: false });
    },
    suspendPresentationForGlossary(): void {
      if (disposed || !panel || !presentation || suspended) return;
      suspended = true;
      presentation.hidden = true;
      presentation.setAttribute("aria-hidden", "true");
      presentation.setAttribute("inert", "");
      const dialog = presentation.querySelector<HTMLElement>(".ai-tutor-panel");
      dialog?.removeAttribute("aria-modal");
      dialog?.removeAttribute("role");
      releaseMobileEnvironment();
      appendLauncher();
    },
    isPresentationVisible(): boolean {
      return Boolean(panel && presentation && !suspended && !presentation.hidden);
    },
    invalidateCurrentRequest(): void {
      panel?.cancelPending?.();
    },
    refresh(): void {
      panel?.refresh?.();
    },
    dispose(): void {
      if (disposed) return;
      host.disconnect();
      disposed = true;
      options.target.removeEventListener("keydown", onKeyDown);
      options.target.replaceChildren();
      if (ownsModalEnvironment) modalEnvironment.dispose();
    },
  };
  return Object.freeze(host);
}
