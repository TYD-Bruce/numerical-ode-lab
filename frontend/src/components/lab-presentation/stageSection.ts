import type { LabStageRole } from "./workflowNavigation";

let stageSectionId = 0;

export interface StageSectionOptions {
  readonly role: LabStageRole;
  readonly label: string;
  readonly content?: readonly Node[];
}

export function createStageSection(options: StageSectionOptions): HTMLElement {
  const section = document.createElement("section");
  section.className = "lab-stage-section";
  section.dataset.stageRole = options.role;
  const label = document.createElement("p");
  label.className = "lab-stage-label";
  label.dataset.stageLabel = "true";
  label.id = `lab-stage-label-${++stageSectionId}`;
  label.textContent = options.label;
  section.setAttribute("aria-labelledby", label.id);
  section.append(label, ...(options.content ?? []));
  return section;
}
