export type LabStageRole = "method" | "data" | "output" | "analysis";
export type WorkflowPresentationState =
  | "current"
  | "available"
  | "unavailable";

export interface WorkflowStepDescriptor {
  readonly key: string;
  readonly label: string;
  readonly role: LabStageRole;
  readonly available?: boolean;
  readonly current?: boolean;
  readonly onActivate?: () => void;
}

export interface WorkflowNavigationOptions {
  readonly label: string;
  readonly steps: readonly WorkflowStepDescriptor[];
}

const resizeObservers = new WeakMap<HTMLElement, ResizeObserver>();

export function disposeWorkflowNavigation(
  navigation: HTMLElement | null | undefined
): void {
  if (!navigation) return;
  resizeObservers.get(navigation)?.disconnect();
  resizeObservers.delete(navigation);
}

function revealWithinRail(control: HTMLButtonElement, rail: HTMLElement): void {
  const item = control.closest<HTMLElement>("li");
  if (!item) return;
  const itemStart = item.offsetLeft;
  const itemEnd = itemStart + item.offsetWidth;
  const visibleStart = rail.scrollLeft;
  const visibleEnd = visibleStart + rail.clientWidth;
  if (itemStart < visibleStart) {
    rail.scrollLeft = Math.max(0, itemStart);
    return;
  }
  if (itemEnd > visibleEnd) {
    rail.scrollLeft = Math.min(
      Math.max(0, rail.scrollWidth - rail.clientWidth),
      Math.max(0, itemEnd - rail.clientWidth)
    );
  }
}

export function createWorkflowNavigation(
  options: WorkflowNavigationOptions
): HTMLElement {
  if (options.steps.length === 0) {
    throw new Error("WorkflowNavigation requires at least one stage.");
  }
  if (options.steps.filter((step) => step.current).length !== 1) {
    throw new Error("WorkflowNavigation requires exactly one current stage.");
  }

  const nav = document.createElement("nav");
  nav.className = "lab-workflow-navigation";
  nav.dataset.workflowNavigation = "true";
  nav.setAttribute("aria-label", options.label);
  const rail = document.createElement("div");
  rail.className = "lab-workflow-rail";
  rail.dataset.workflowRail = "true";
  const list = document.createElement("ol");
  let currentControl: HTMLButtonElement | undefined;

  options.steps.forEach((step, index) => {
    const available = step.available !== false;
    if (step.current && !available) {
      throw new Error("The current workflow stage must be available.");
    }
    const item = document.createElement("li");
    item.className = "lab-workflow-item";
    item.dataset.stageRole = step.role;
    const presentationState: WorkflowPresentationState = step.current
      ? "current"
      : available
        ? "available"
        : "unavailable";
    item.dataset.workflowState = presentationState;
    const control = document.createElement("button");
    control.type = "button";
    control.className = `lab-workflow-step lab-workflow-step-${presentationState}`;
    control.dataset.workflowStep = step.key;
    control.dataset.stageRole = step.role;
    control.dataset.workflowState = presentationState;
    control.disabled = !available;
    if (step.current) {
      control.setAttribute("aria-current", "step");
      currentControl = control;
    }
    const number = document.createElement("span");
    number.className = "lab-workflow-number";
    number.textContent = String(index + 1);
    number.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "lab-workflow-label";
    label.textContent = step.label;
    control.append(number, label);
    control.addEventListener("focus", () => revealWithinRail(control, rail));
    control.addEventListener("click", () => {
      if (!available) return;
      step.onActivate?.();
    });
    item.append(control);
    list.append(item);
  });

  rail.append(list);
  nav.append(rail);
  queueMicrotask(() => {
    if (currentControl?.isConnected) revealWithinRail(currentControl, rail);
  });
  if (currentControl && typeof ResizeObserver !== "undefined") {
    const observedControl = currentControl;
    const observer = new ResizeObserver(() => {
      if (!rail.isConnected) {
        observer.disconnect();
        return;
      }
      revealWithinRail(observedControl, rail);
    });
    observer.observe(rail);
    resizeObservers.set(nav, observer);
  }
  return nav;
}
