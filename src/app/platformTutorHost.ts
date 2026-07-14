import type { LabTutorBinding, TutorSessionAccess } from "./contracts";
import { clearTutorConversation, setTutorDesktopOpen } from "../tutor/moduleTutorSession";
import type {
  MountedPlatformTutorPanel,
  PlatformTutorPanelOptions,
} from "../tutor/platformTutorPanel";

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
  dispose(): void;
}

export interface CreatePlatformTutorHostOptions {
  readonly target: HTMLElement;
  readonly labTarget?: HTMLElement;
  readonly loadPanel?: () => Promise<TutorPanelModule>;
  readonly isMobile?: () => boolean;
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
  let returnFocus: HTMLElement | undefined;
  let savedScrollY = 0;
  let previousBodyOverflow = "";

  const loadPanel = options.loadPanel ?? (() => import("../tutor/platformTutorPanel"));
  const isMobile = options.isMobile ?? (() => window.matchMedia?.("(max-width: 760px)").matches ?? false);

  const restoreMobileEnvironment = (): void => {
    if (!mobileOpen) return;
    mobileOpen = false;
    options.target.classList.remove("platform-tutor-host-mobile");
    options.labTarget?.removeAttribute("inert");
    document.body.style.overflow = previousBodyOverflow;
    if (savedScrollY !== 0) {
      try {
        window.scrollTo({ top: savedScrollY, left: 0, behavior: "auto" });
      } catch {
        // Environments without scrolling still receive the DOM cleanup.
      }
    }
  };

  const renderClosed = (): void => {
    panel?.dispose();
    panel = undefined;
    restoreMobileEnvironment();
    options.target.classList.remove("platform-tutor-host-mobile");
    options.target.classList.add("platform-tutor-host");
    options.target.replaceChildren();
    if (!connection || disposed) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn primary platform-tutor-open";
    button.dataset.tutorOpen = "";
    button.textContent = "Open AI Tutor";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => void host.open(button));
    options.target.append(button);
  };

  const renderLoading = (): HTMLElement => {
    options.target.replaceChildren();
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
    options.target.append(panelShell);
    return panelShell;
  };

  const renderFailure = (cause: unknown, openGeneration: number): void => {
    if (disposed || openGeneration !== generation || !connection) return;
    restoreMobileEnvironment();
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

  const enableMobileEnvironment = (): void => {
    if (mobileOpen) return;
    mobileOpen = true;
    savedScrollY = window.scrollY;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    options.labTarget?.setAttribute("inert", "");
    options.target.classList.add("platform-tutor-host-mobile");
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && (panel || mobileOpen)) {
      event.preventDefault();
      host.close();
      return;
    }
    if (!panel) return;
    if (event.key !== "Tab" || !mobileOpen) return;
    const focusable = [...options.target.querySelectorAll<HTMLElement>(
      'button:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )];
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
      restoreMobileEnvironment();
      options.target.replaceChildren();
    },
    async open(trigger): Promise<void> {
      if (disposed || !connection) return;
      const activeConnection = connection;
      const openGeneration = ++generation;
      returnFocus = trigger;
      activeConnection.binding.prepareForOpen?.();
      const mobile = isMobile();
      if (mobile) {
        enableMobileEnvironment();
      } else {
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
        moduleRejected = false;
        options.target.replaceChildren();
        panel = loaded.mountPlatformTutorPanel(options.target, {
          binding: activeConnection.binding,
          sessionAccess: activeConnection.sessionAccess,
          onClose: () => host.close(),
          isCurrent: () =>
            !disposed &&
            generation === openGeneration &&
            connection === activeConnection,
        });
        if (mobileOpen) {
          const dialog = options.target.querySelector<HTMLElement>(".ai-tutor-panel");
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
      restoreMobileEnvironment();
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
    dispose(): void {
      if (disposed) return;
      host.disconnect();
      disposed = true;
      options.target.removeEventListener("keydown", onKeyDown);
      options.target.replaceChildren();
    },
  };
  return Object.freeze(host);
}
