let moduleOverviewId = 0;
let moduleOverviewItemId = 0;

export type ModuleOverviewState = "available" | "planned";

export interface ModuleOverviewPrimaryItem {
  readonly heading: HTMLHeadingElement;
  readonly status: HTMLElement;
  readonly state: ModuleOverviewState;
  readonly statusDetail?: HTMLElement;
  readonly content?: readonly Node[];
  readonly action?: HTMLAnchorElement | HTMLButtonElement;
}

export interface ModuleOverviewOptions {
  readonly heading: HTMLHeadingElement;
  readonly summary?: HTMLElement;
  readonly primaryItem: ModuleOverviewPrimaryItem;
  readonly sections?: readonly HTMLElement[];
}

/**
 * Composes one static module overview from caller-authored content. Supplied
 * nodes move into the overview by identity; this helper owns presentation and
 * association only.
 */
export function createModuleOverview(
  options: ModuleOverviewOptions
): HTMLElement {
  if (options.heading.tagName !== "H1") {
    throw new Error("ModuleOverview requires a native h1 page heading.");
  }
  if (!/^H[2-6]$/.test(options.primaryItem.heading.tagName)) {
    throw new Error("ModuleOverview primary items require a native h2-h6 heading.");
  }

  const overview = document.createElement("div");
  overview.className = "module-overview";
  overview.dataset.moduleOverview = "true";

  if (!options.heading.id) {
    options.heading.id = `module-overview-title-${++moduleOverviewId}`;
  }
  options.heading.tabIndex = -1;
  options.heading.dataset.routeFocus = "true";
  overview.setAttribute("aria-labelledby", options.heading.id);

  const header = document.createElement("header");
  header.className = "platform-page-heading module-overview-header";
  header.append(options.heading);
  if (options.summary) {
    options.summary.classList.add("module-overview-summary");
    header.append(options.summary);
  }

  const primary = document.createElement("section");
  primary.className = "platform-card module-overview-primary";
  primary.dataset.moduleOverviewPrimary = "true";
  primary.dataset.moduleState = options.primaryItem.state;
  if (!options.primaryItem.heading.id) {
    options.primaryItem.heading.id =
      `module-overview-item-title-${++moduleOverviewItemId}`;
  }
  primary.setAttribute("aria-labelledby", options.primaryItem.heading.id);

  const headingRow = document.createElement("div");
  headingRow.className = "module-overview-heading-row";
  options.primaryItem.status.classList.add("module-overview-status");
  options.primaryItem.status.dataset.moduleOverviewStatus = "true";
  headingRow.append(options.primaryItem.heading, options.primaryItem.status);
  primary.append(headingRow);

  if (options.primaryItem.statusDetail) {
    options.primaryItem.statusDetail.classList.add(
      "module-overview-status-detail"
    );
    primary.append(options.primaryItem.statusDetail);
  }
  if (options.primaryItem.content?.length) {
    primary.append(...options.primaryItem.content);
  }
  if (options.primaryItem.action) {
    const action = document.createElement("div");
    action.className = "module-overview-action";
    action.append(options.primaryItem.action);
    primary.append(action);
  }

  overview.append(header, primary, ...(options.sections ?? []));
  return overview;
}
