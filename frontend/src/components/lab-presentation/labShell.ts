import "./labPresentation.css";

export interface LabHeaderOptions {
  readonly breadcrumb: HTMLElement;
  readonly eyebrow?: HTMLElement;
  readonly title: HTMLHeadingElement;
  readonly lede: HTMLElement;
  readonly identity?: HTMLElement;
  readonly actions?: readonly HTMLElement[];
  readonly details?: readonly HTMLElement[];
}

export interface LabShellOptions {
  readonly header: HTMLElement;
  readonly workflow: HTMLElement;
  readonly stage: HTMLElement;
  readonly afterStage?: readonly Node[];
  readonly className?: string;
}

function markHeaderPart(node: HTMLElement, part: string): void {
  node.dataset.labHeaderPart = part;
}

export function createLabHeader(options: LabHeaderOptions): HTMLElement {
  if (options.breadcrumb.tagName !== "NAV") {
    throw new Error("LabShell breadcrumb content must remain a navigation landmark.");
  }
  if (options.title.tagName !== "H1") {
    throw new Error("LabShell requires one native h1 title.");
  }

  const header = document.createElement("header");
  header.className = "lab-header";

  options.breadcrumb.classList.add("lab-breadcrumb");
  options.breadcrumb.dataset.labBreadcrumb = "true";
  markHeaderPart(options.breadcrumb, "breadcrumb");
  header.append(options.breadcrumb);

  if (options.eyebrow) {
    options.eyebrow.classList.add("lab-header-eyebrow");
    options.eyebrow.dataset.labHeaderEyebrow = "true";
    markHeaderPart(options.eyebrow, "eyebrow");
    header.append(options.eyebrow);
  }

  const titleRow = document.createElement("div");
  titleRow.className = "lab-header-title-row";
  markHeaderPart(titleRow, "title");
  options.title.classList.add("lab-header-title");
  titleRow.append(options.title);
  if (options.actions?.length) {
    const actions = document.createElement("div");
    actions.className = "lab-header-actions";
    for (const action of options.actions) {
      action.dataset.labHeaderAction = "true";
      actions.append(action);
    }
    titleRow.append(actions);
  }
  header.append(titleRow);

  options.lede.classList.add("lab-header-lede");
  options.lede.dataset.labHeaderLede = "true";
  markHeaderPart(options.lede, "lede");
  header.append(options.lede);

  if (options.identity) {
    options.identity.classList.add("lab-header-identity");
    options.identity.dataset.labHeaderIdentity = "true";
    markHeaderPart(options.identity, "identity");
    header.append(options.identity);
  }

  for (const detail of options.details ?? []) {
    detail.classList.add("lab-header-detail");
    markHeaderPart(detail, "detail");
    header.append(detail);
  }

  if (header.querySelectorAll("h1").length !== 1) {
    throw new Error("LabHeader must contain exactly one native h1.");
  }

  return header;
}

export function createLabShell(options: LabShellOptions): HTMLElement {
  const shell = document.createElement("div");
  shell.className = `lab-shell${options.className ? ` ${options.className}` : ""}`;
  shell.dataset.labShell = "true";
  shell.append(
    options.header,
    options.workflow,
    options.stage,
    ...(options.afterStage ?? [])
  );

  if (
    options.header.tagName !== "HEADER" ||
    !options.header.classList.contains("lab-header")
  ) {
    throw new Error("LabShell requires its shared LabHeader structure.");
  }
  if (shell.querySelectorAll("h1").length !== 1) {
    throw new Error("LabShell must contain exactly one native h1.");
  }
  return shell;
}
