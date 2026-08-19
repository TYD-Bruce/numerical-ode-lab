let problemContextId = 0;

export interface ProblemContextParameter {
  readonly label: string;
  readonly value: string | Node;
}

export interface ProblemContextOptions {
  readonly heading: HTMLHeadingElement;
  readonly statement: Node;
  readonly parameters?: readonly ProblemContextParameter[];
  readonly provenance?: HTMLElement;
  readonly staleNote?: HTMLElement;
}

/**
 * Composes one authored problem snapshot. Supplied nodes are appended by
 * identity and therefore move to this owner. Callers must create a fresh
 * mathematical tree when the same meaning needs another visual owner.
 */
export function createProblemContext(
  options: ProblemContextOptions
): HTMLElement {
  if (!/^H[2-6]$/.test(options.heading.tagName)) {
    throw new Error("ProblemContext requires a native h2-h6 heading.");
  }

  const section = document.createElement("section");
  section.className = "lab-problem-context";
  section.dataset.problemContext = "true";
  if (!options.heading.id) {
    options.heading.id = `lab-problem-context-${++problemContextId}`;
  }
  options.heading.classList.add("lab-problem-context-heading");
  section.setAttribute("aria-labelledby", options.heading.id);

  const statement = document.createElement("div");
  statement.className = "lab-problem-context-statement";
  statement.dataset.problemStatement = "true";
  statement.append(options.statement);
  section.append(options.heading, statement);

  if (options.parameters?.length) {
    const parameters = document.createElement("dl");
    parameters.className = "lab-problem-context-parameters";
    parameters.dataset.problemParameters = "true";
    for (const parameter of options.parameters) {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = parameter.label;
      const value = document.createElement("dd");
      value.dataset.problemParameterValue = "true";
      value.append(parameter.value);
      item.append(term, value);
      parameters.append(item);
    }
    section.append(parameters);
  }

  if (options.provenance) {
    options.provenance.classList.add("lab-problem-context-provenance");
    options.provenance.dataset.problemProvenance = "true";
    section.append(options.provenance);
  }
  if (options.staleNote) {
    options.staleNote.classList.add("lab-problem-context-stale");
    options.staleNote.dataset.problemStaleNote = "true";
    section.append(options.staleNote);
  }
  return section;
}
