let walkthroughId = 0;

export interface WalkthroughCorridor {
  readonly source: Node;
  readonly operation: Node;
  readonly target: Node;
}

export interface WalkthroughStep {
  readonly heading: HTMLHeadingElement;
  readonly lead?: HTMLElement;
  readonly corridor?: WalkthroughCorridor;
  readonly content?: readonly Node[];
  readonly advancedDetails?: HTMLDetailsElement;
  readonly classNames?: readonly string[];
  readonly dataAttributes?: Readonly<Record<string, string>>;
}

export interface WalkthroughPhase {
  readonly heading: HTMLHeadingElement;
  readonly lead?: HTMLElement;
  readonly steps: readonly WalkthroughStep[];
  readonly classNames?: readonly string[];
  readonly dataAttributes?: Readonly<Record<string, string>>;
}

export interface ComputationWalkthroughShellOptions {
  readonly heading: HTMLHeadingElement;
  readonly purpose?: HTMLElement;
  readonly phases: readonly WalkthroughPhase[];
  readonly failureBoundary?: HTMLElement;
  readonly completionEvidence?: HTMLElement;
}

function assertHeading(node: HTMLHeadingElement, owner: string): void {
  if (!/^H[2-6]$/.test(node.tagName)) {
    throw new Error(`${owner} requires native h2-h6 headings.`);
  }
}

function corridorPart(
  kind: "source" | "operation" | "target",
  label: string,
  content: Node
): HTMLElement {
  const part = document.createElement("div");
  part.className = `lab-walkthrough-corridor-part lab-walkthrough-${kind}`;
  part.dataset.walkthroughPart = kind;
  const marker = document.createElement("p");
  marker.className = "lab-walkthrough-corridor-label";
  marker.textContent = label;
  part.append(marker, content);
  return part;
}

function applyAuthoredPresentationMetadata(
  owner: HTMLElement,
  classNames: readonly string[] | undefined,
  dataAttributes: Readonly<Record<string, string>> | undefined
): void {
  if (classNames?.length) owner.classList.add(...classNames);
  if (dataAttributes) {
    Object.entries(dataAttributes).forEach(([name, value]) => {
      owner.dataset[name] = value;
    });
  }
}

/**
 * Organizes already-authored ordered computation evidence. The shell never
 * derives steps or values: every supplied node is moved into the stated phase
 * and callers must create fresh mathematical trees for additional owners.
 */
export function createComputationWalkthroughShell(
  options: ComputationWalkthroughShellOptions
): HTMLElement {
  assertHeading(options.heading, "ComputationWalkthroughShell");
  if (options.phases.length === 0) {
    throw new Error("ComputationWalkthroughShell requires an authored phase.");
  }

  const section = document.createElement("section");
  section.className = "lab-computation-walkthrough-shell";
  section.dataset.computationWalkthroughShell = "true";
  if (!options.heading.id) {
    options.heading.id = `lab-computation-walkthrough-${++walkthroughId}`;
  }
  options.heading.classList.add("lab-computation-walkthrough-heading");
  section.setAttribute("aria-labelledby", options.heading.id);
  section.append(options.heading);
  if (options.purpose) {
    options.purpose.classList.add("lab-computation-walkthrough-purpose");
    options.purpose.dataset.walkthroughPurpose = "true";
    section.append(options.purpose);
  }

  const phases = document.createElement("ol");
  phases.className = "lab-walkthrough-phases";
  phases.dataset.walkthroughPhases = "true";
  for (const phase of options.phases) {
    assertHeading(phase.heading, "ComputationWalkthroughShell phase");
    if (phase.steps.length === 0) {
      throw new Error("A walkthrough phase requires an authored step.");
    }
    const phaseItem = document.createElement("li");
    phaseItem.className = "lab-walkthrough-phase";
    applyAuthoredPresentationMetadata(
      phaseItem,
      phase.classNames,
      phase.dataAttributes
    );
    phaseItem.append(phase.heading);
    if (phase.lead) {
      phase.lead.classList.add("lab-walkthrough-phase-lead");
      phaseItem.append(phase.lead);
    }
    const steps = document.createElement("ol");
    steps.className = "lab-walkthrough-steps";
    steps.dataset.walkthroughSteps = "true";
    for (const step of phase.steps) {
      assertHeading(step.heading, "ComputationWalkthroughShell step");
      if (!step.corridor && !step.content?.length) {
        throw new Error("A walkthrough step requires authored static evidence.");
      }
      const stepItem = document.createElement("li");
      stepItem.className = "lab-walkthrough-step";
      applyAuthoredPresentationMetadata(
        stepItem,
        step.classNames,
        step.dataAttributes
      );
      stepItem.append(step.heading);
      if (step.lead) {
        step.lead.classList.add("lab-walkthrough-step-lead");
        stepItem.append(step.lead);
      }
      if (step.corridor) {
        const corridor = document.createElement("div");
        corridor.className = "lab-walkthrough-corridor";
        corridor.dataset.walkthroughCorridor = "true";
        corridor.append(
          corridorPart("source", "Before", step.corridor.source),
          corridorPart("operation", "Operation", step.corridor.operation),
          corridorPart("target", "After", step.corridor.target)
        );
        stepItem.append(corridor);
      }
      if (step.content?.length) {
        const content = document.createElement("div");
        content.className = "lab-walkthrough-step-content";
        content.append(...step.content);
        stepItem.append(content);
      }
      if (step.advancedDetails) {
        if (step.advancedDetails.tagName !== "DETAILS") {
          throw new Error("Walkthrough advanced detail must remain native details.");
        }
        stepItem.append(step.advancedDetails);
      }
      steps.append(stepItem);
    }
    phaseItem.append(steps);
    phases.append(phaseItem);
  }
  section.append(phases);

  if (options.failureBoundary) {
    options.failureBoundary.classList.add("lab-walkthrough-failure");
    options.failureBoundary.dataset.walkthroughFailure = "true";
    section.append(options.failureBoundary);
  }
  if (options.completionEvidence) {
    options.completionEvidence.classList.add("lab-walkthrough-completion");
    options.completionEvidence.dataset.walkthroughCompletion = "true";
    section.append(options.completionEvidence);
  }
  return section;
}
