export type EvidenceLevel = "summary" | "standard" | "advanced";

let evidenceBlockId = 0;

export interface EvidenceBlockOptions {
  readonly level: EvidenceLevel;
  readonly heading: HTMLHeadingElement;
  readonly lead?: HTMLElement;
  readonly status?: HTMLElement;
  readonly formulas?: readonly Node[];
  readonly metrics?: HTMLDListElement;
  readonly chart?: Node;
  readonly numericalTable?: HTMLElement;
  readonly advancedDetails?: HTMLDetailsElement;
}

/**
 * Frames authored supporting evidence at one of three semantic levels.
 * Supplied nodes are appended unchanged by identity; renderers and numerical
 * authority remain with the caller.
 */
export function createEvidenceBlock(options: EvidenceBlockOptions): HTMLElement {
  if (!/^H[2-6]$/.test(options.heading.tagName)) {
    throw new Error("EvidenceBlock requires a native h2-h6 heading.");
  }
  if (options.metrics && options.metrics.tagName !== "DL") {
    throw new Error("EvidenceBlock metrics must remain a native dl.");
  }
  if (options.advancedDetails && options.advancedDetails.tagName !== "DETAILS") {
    throw new Error("EvidenceBlock advanced detail must remain native details.");
  }

  const section = document.createElement("section");
  section.className = `lab-evidence-block lab-evidence-${options.level}`;
  section.dataset.evidenceBlock = "true";
  section.dataset.evidenceLevel = options.level;
  if (!options.heading.id) {
    options.heading.id = `lab-evidence-block-${++evidenceBlockId}`;
  }
  options.heading.classList.add("lab-evidence-block-heading");
  section.setAttribute("aria-labelledby", options.heading.id);
  section.append(options.heading);

  if (options.lead) {
    options.lead.classList.add("lab-evidence-block-lead");
    options.lead.dataset.evidenceLead = "true";
    section.append(options.lead);
  }
  if (options.status) {
    options.status.classList.add("lab-evidence-block-status");
    options.status.dataset.evidenceStatus = "true";
    section.append(options.status);
  }
  if (options.formulas?.length) {
    const formulas = document.createElement("div");
    formulas.className = "lab-evidence-block-formulas";
    formulas.dataset.evidenceFormulas = "true";
    formulas.append(...options.formulas);
    section.append(formulas);
  }
  if (options.metrics) {
    options.metrics.classList.add("lab-evidence-block-metrics");
    options.metrics.dataset.evidenceMetrics = "true";
    section.append(options.metrics);
  }
  if (options.chart) {
    const chart = document.createElement("div");
    chart.className = "lab-evidence-block-chart";
    chart.dataset.evidenceChart = "true";
    chart.append(options.chart);
    section.append(chart);
  }
  if (options.numericalTable) {
    options.numericalTable.classList.add("lab-evidence-block-table");
    section.append(options.numericalTable);
  }
  if (options.advancedDetails) {
    section.append(options.advancedDetails);
  }
  return section;
}
