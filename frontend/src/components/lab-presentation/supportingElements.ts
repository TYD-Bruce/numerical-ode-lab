export type LabActionRole = "primary" | "secondary" | "quiet" | "danger";

export function applyLabActionRole<T extends HTMLButtonElement | HTMLAnchorElement>(
  control: T,
  role: LabActionRole
): T {
  if (control.tagName !== "BUTTON" && control.tagName !== "A") {
    throw new Error("A Lab action must remain a native button or link.");
  }
  control.classList.add("lab-action", `lab-action-${role}`);
  control.dataset.labActionRole = role;
  return control;
}
