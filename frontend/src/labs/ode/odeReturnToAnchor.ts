export interface OdeReturnToAnchorOptions {
  readonly target: HTMLElement;
  readonly visibilityAnchor: HTMLElement;
  readonly accessibleName: string;
}

export interface MountedOdeReturnToAnchor {
  readonly element: HTMLButtonElement;
  refresh(): void;
  dispose(): void;
}

const MINIMUM_PAGE_SCROLL = 160;
const LANDSCAPE_EXIT_OFFSET = 96;

export function createOdeReturnToAnchor(
  options: OdeReturnToAnchorOptions
): MountedOdeReturnToAnchor {
  if (!options.target.id) {
    throw new Error("A contextual return target requires a stable id.");
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn ghost ode-return-to-method-selection";
  button.dataset.returnMethodSelection = "true";
  button.setAttribute("aria-label", options.accessibleName);
  button.setAttribute("aria-controls", options.target.id);
  const icon = document.createElement("span");
  icon.className = "ode-return-to-method-selection-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "↑";
  const label = document.createElement("span");
  label.className = "ode-return-to-method-selection-label";
  label.textContent = "Method selection";
  button.append(icon, label);
  button.hidden = true;

  let disposed = false;

  const refresh = (): void => {
    if (
      disposed ||
      !options.target.isConnected ||
      !options.visibilityAnchor.isConnected
    ) {
      button.hidden = true;
      return;
    }
    const landscapeBottom =
      options.visibilityAnchor.getBoundingClientRect().bottom;
    button.hidden =
      window.scrollY < MINIMUM_PAGE_SCROLL ||
      landscapeBottom > LANDSCAPE_EXIT_OFFSET;
  };

  const activate = (): void => {
    if (disposed || !options.target.isConnected) {
      button.hidden = true;
      return;
    }
    button.hidden = true;
    options.target.scrollIntoView?.({ behavior: "auto", block: "start" });
    options.target.focus({ preventScroll: true });
  };

  window.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh);
  button.addEventListener("click", activate);

  return Object.freeze({
    element: button,
    refresh,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
      button.removeEventListener("click", activate);
      button.hidden = true;
    },
  });
}
