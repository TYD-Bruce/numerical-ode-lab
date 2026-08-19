let teachingBlockId = 0;

export interface TeachingBlockOptions {
  readonly eyebrow?: HTMLElement;
  readonly heading: HTMLHeadingElement;
  readonly lead?: HTMLElement;
  readonly math?: readonly Node[];
  readonly definitions?: HTMLDListElement;
  readonly steps?: HTMLOListElement;
  readonly examples?: readonly HTMLElement[];
  readonly limitation?: HTMLElement;
  readonly advancedDetails?: HTMLDetailsElement;
}

/**
 * Establishes teaching order without interpreting the authored content.
 * Every supplied node is appended by identity; repeated mathematics requires
 * a fresh caller-authored visual tree for each accessible owner.
 */
export function createTeachingBlock(options: TeachingBlockOptions): HTMLElement {
  if (!/^H[2-6]$/.test(options.heading.tagName)) {
    throw new Error("TeachingBlock requires a native h2-h6 heading.");
  }
  if (options.definitions && options.definitions.tagName !== "DL") {
    throw new Error("TeachingBlock definitions must remain a native dl.");
  }
  if (options.steps && options.steps.tagName !== "OL") {
    throw new Error("TeachingBlock steps must remain a native ol.");
  }
  if (options.advancedDetails && options.advancedDetails.tagName !== "DETAILS") {
    throw new Error("TeachingBlock advanced detail must remain native details.");
  }

  const section = document.createElement("section");
  section.className = "lab-teaching-block";
  section.dataset.teachingBlock = "true";
  if (!options.heading.id) {
    options.heading.id = `lab-teaching-block-${++teachingBlockId}`;
  }
  options.heading.classList.add("lab-teaching-block-heading");
  section.setAttribute("aria-labelledby", options.heading.id);

  if (options.eyebrow) {
    options.eyebrow.classList.add("lab-teaching-block-eyebrow");
    options.eyebrow.dataset.teachingEyebrow = "true";
    section.append(options.eyebrow);
  }
  section.append(options.heading);
  if (options.lead) {
    options.lead.classList.add("lab-teaching-block-lead");
    options.lead.dataset.teachingLead = "true";
    section.append(options.lead);
  }
  if (options.math?.length) {
    const math = document.createElement("div");
    math.className = "lab-teaching-block-math";
    math.dataset.teachingMath = "true";
    math.append(...options.math);
    section.append(math);
  }
  if (options.definitions) {
    options.definitions.classList.add("lab-teaching-block-definitions");
    options.definitions.dataset.teachingDefinitions = "true";
    section.append(options.definitions);
  }
  if (options.steps) {
    options.steps.classList.add("lab-teaching-block-steps");
    options.steps.dataset.teachingSteps = "true";
    section.append(options.steps);
  }
  if (options.examples?.length) {
    const examples = document.createElement("div");
    examples.className = "lab-teaching-block-examples";
    for (const example of options.examples) {
      example.dataset.teachingExample = "true";
      examples.append(example);
    }
    section.append(examples);
  }
  if (options.limitation) {
    options.limitation.classList.add("lab-teaching-block-limitation");
    options.limitation.dataset.teachingLimitation = "true";
    section.append(options.limitation);
  }
  if (options.advancedDetails) {
    section.append(options.advancedDetails);
  }
  return section;
}
