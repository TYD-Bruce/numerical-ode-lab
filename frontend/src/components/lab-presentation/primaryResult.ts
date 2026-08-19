let primaryResultId = 0;
let resultAnswerId = 0;

export interface PrimaryResultAnswer {
  readonly label: HTMLElement;
  readonly content: Node;
}

export interface PrimaryResultOptions {
  readonly eyebrow?: HTMLElement;
  readonly heading: HTMLHeadingElement;
  readonly status?: HTMLElement;
  readonly statusTone?: "current" | "stale";
  readonly problemContext?: HTMLElement;
  readonly primaryAnswer: PrimaryResultAnswer;
  readonly comparisonAnswer?: PrimaryResultAnswer;
  readonly metrics?: HTMLDListElement;
  readonly visualization?: Node;
}

function createAnswerRegion(
  answer: PrimaryResultAnswer,
  kind: "primary" | "comparison"
): HTMLElement {
  const region = document.createElement("section");
  region.className = `lab-primary-result-answer lab-primary-result-answer-${kind}`;
  region.dataset.resultAnswer = kind;
  if (kind === "primary") region.dataset.primaryAnswer = "true";
  else region.dataset.comparisonAnswer = "true";
  if (!answer.label.id) {
    answer.label.id = `lab-result-answer-${++resultAnswerId}`;
  }
  answer.label.classList.add("lab-primary-result-answer-label");
  region.setAttribute("aria-labelledby", answer.label.id);
  region.append(answer.label, answer.content);
  return region;
}

/**
 * Composes an authored successful answer without reading or transforming its
 * mathematical meaning. Supplied problem, answer, metric, and visualization
 * nodes are moved into this single presentation owner.
 */
export function createPrimaryResult(options: PrimaryResultOptions): HTMLElement {
  if (!/^H[2-6]$/.test(options.heading.tagName)) {
    throw new Error("PrimaryResult requires a native h2-h6 heading.");
  }
  if (options.metrics && options.metrics.tagName !== "DL") {
    throw new Error("PrimaryResult metrics must remain a native dl.");
  }

  const section = document.createElement("section");
  section.className = "lab-primary-result";
  section.dataset.primaryResult = "true";
  if (!options.heading.id) {
    options.heading.id = `lab-primary-result-${++primaryResultId}`;
  }
  options.heading.classList.add("lab-primary-result-heading");
  section.setAttribute("aria-labelledby", options.heading.id);

  if (options.eyebrow) {
    options.eyebrow.classList.add("lab-primary-result-eyebrow");
    options.eyebrow.dataset.primaryResultEyebrow = "true";
    section.append(options.eyebrow);
  }
  section.append(options.heading);
  if (options.status) {
    options.status.classList.add("lab-primary-result-status");
    options.status.dataset.primaryResultStatus = "true";
    options.status.dataset.resultStatusTone = options.statusTone ?? "current";
    section.append(options.status);
  }
  if (options.problemContext) {
    options.problemContext.classList.add("lab-primary-result-problem");
    section.append(options.problemContext);
  }

  const answers = document.createElement("div");
  answers.className = "lab-primary-result-answers";
  answers.dataset.primaryResultAnswers = "true";
  answers.append(createAnswerRegion(options.primaryAnswer, "primary"));
  if (options.comparisonAnswer) {
    section.classList.add("lab-primary-result-comparison");
    answers.append(createAnswerRegion(options.comparisonAnswer, "comparison"));
  }
  section.append(answers);

  if (options.metrics) {
    options.metrics.classList.add("lab-primary-result-metrics");
    options.metrics.dataset.primaryResultMetrics = "true";
    section.append(options.metrics);
  }
  if (options.visualization) {
    const visualization = document.createElement("div");
    visualization.className = "lab-primary-result-visualization";
    visualization.dataset.primaryResultVisualization = "true";
    visualization.append(options.visualization);
    section.append(visualization);
  }
  return section;
}
