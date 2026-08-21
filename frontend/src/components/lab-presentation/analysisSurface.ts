let analysisSurfaceId = 0;

export type AnalysisSurfaceSlot =
  | "purpose"
  | "setup"
  | "status"
  | "primary-finding"
  | "evidence"
  | "interpretation"
  | "limitation"
  | "advanced-details";

export interface AnalysisSurfaceSection {
  readonly role: AnalysisSurfaceSlot;
  readonly nodes: readonly Node[];
}

export interface AnalysisSurfaceOptions {
  readonly heading: HTMLHeadingElement;
  readonly purpose?: Node;
  readonly setup?: Node;
  readonly status?: Node;
  readonly primaryFinding?: Node;
  readonly evidence?: readonly Node[];
  readonly interpretation?: Node;
  readonly limitation?: Node;
  readonly advancedDetails?: HTMLDetailsElement;
  readonly slotOrder?: readonly AnalysisSurfaceSlot[];
  readonly sections?: readonly AnalysisSurfaceSection[];
}

const DEFAULT_SLOT_ORDER: readonly AnalysisSurfaceSlot[] = [
  "purpose",
  "setup",
  "status",
  "primary-finding",
  "evidence",
  "interpretation",
  "limitation",
  "advanced-details",
];

function createSlot(
  role: AnalysisSurfaceSlot,
  nodes: readonly Node[]
): HTMLElement {
  const slot = document.createElement("div");
  slot.className = `lab-analysis-surface-${role}`;
  slot.dataset.analysisRole = role;
  slot.append(...nodes);
  return slot;
}

/**
 * Composes caller-authored analysis roles without interpreting their meaning.
 * Supplied nodes are appended by identity and retain their existing owners.
 */
export function createAnalysisSurface(
  options: AnalysisSurfaceOptions
): HTMLElement {
  if (!/^H[2-6]$/.test(options.heading.tagName)) {
    throw new Error("AnalysisSurface requires a native h2-h6 heading.");
  }
  if (options.advancedDetails && options.advancedDetails.tagName !== "DETAILS") {
    throw new Error("AnalysisSurface advanced detail must remain native details.");
  }

  const surface = document.createElement("section");
  surface.className = "lab-analysis-surface";
  surface.dataset.analysisSurface = "true";
  if (!options.heading.id) {
    options.heading.id = `lab-analysis-surface-${++analysisSurfaceId}`;
  }
  options.heading.classList.add("lab-analysis-surface-heading");
  surface.setAttribute("aria-labelledby", options.heading.id);
  surface.append(options.heading);

  if (options.sections) {
    for (const section of options.sections) {
      if (section.nodes.length === 0) continue;
      surface.append(createSlot(section.role, section.nodes));
    }
    return surface;
  }

  const slots = new Map<AnalysisSurfaceSlot, HTMLElement>();
  if (options.purpose) {
    slots.set("purpose", createSlot("purpose", [options.purpose]));
  }
  if (options.setup) {
    slots.set("setup", createSlot("setup", [options.setup]));
  }
  if (options.status) {
    slots.set("status", createSlot("status", [options.status]));
  }
  if (options.primaryFinding) {
    slots.set(
      "primary-finding",
      createSlot("primary-finding", [options.primaryFinding])
    );
  }
  if (options.evidence?.length) {
    slots.set("evidence", createSlot("evidence", options.evidence));
  }
  if (options.interpretation) {
    slots.set(
      "interpretation",
      createSlot("interpretation", [options.interpretation])
    );
  }
  if (options.limitation) {
    slots.set("limitation", createSlot("limitation", [options.limitation]));
  }
  if (options.advancedDetails) {
    slots.set(
      "advanced-details",
      createSlot("advanced-details", [options.advancedDetails])
    );
  }

  const requestedOrder = options.slotOrder ?? DEFAULT_SLOT_ORDER;
  const orderedRoles = [...new Set([...requestedOrder, ...DEFAULT_SLOT_ORDER])];
  for (const role of orderedRoles) {
    const slot = slots.get(role);
    if (slot) surface.append(slot);
  }
  return surface;
}
