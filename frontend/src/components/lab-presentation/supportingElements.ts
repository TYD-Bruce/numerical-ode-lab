export type LabActionRole = "primary" | "secondary" | "quiet" | "danger";

export interface AdvancedDetailsOptions {
  readonly summary: string | HTMLElement;
  readonly content: readonly Node[];
}

export interface NumericalTableColumn {
  readonly label: string;
  readonly numeric?: boolean;
}

export interface NumericalTableRow {
  readonly label: string;
  readonly cells: readonly (string | Node)[];
}

export interface NumericalTableOptions {
  readonly caption: string;
  readonly rowHeader: string;
  readonly columns: readonly NumericalTableColumn[];
  readonly rows: readonly NumericalTableRow[];
}

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

/** Creates a subordinate native disclosure, closed by default. */
export function createAdvancedDetails(
  options: AdvancedDetailsOptions
): HTMLDetailsElement {
  const details = document.createElement("details");
  details.className = "lab-advanced-details";
  details.dataset.advancedDetails = "true";
  const summary =
    typeof options.summary === "string"
      ? Object.assign(document.createElement("summary"), {
          textContent: options.summary,
        })
      : options.summary;
  if (summary.tagName !== "SUMMARY") {
    throw new Error("AdvancedDetails requires a native summary.");
  }
  summary.classList.add("lab-advanced-details-summary");
  details.append(summary, ...options.content);
  return details;
}

/**
 * Builds a semantic numerical table inside one local horizontal containment
 * owner. Supplied cell nodes are appended by identity; mathematical matrices
 * belong in a mathematical renderer rather than this table.
 */
export function createNumericalTable(
  options: NumericalTableOptions
): HTMLElement {
  if (options.columns.length === 0) {
    throw new Error("NumericalTable requires at least one value column.");
  }
  for (const row of options.rows) {
    if (row.cells.length !== options.columns.length) {
      throw new Error("NumericalTable rows must match the declared columns.");
    }
  }

  const frame = document.createElement("div");
  frame.className = "lab-numerical-table-frame";
  frame.dataset.numericalTableContainment = "local";
  const table = document.createElement("table");
  table.className = "lab-numerical-table";
  const caption = document.createElement("caption");
  caption.textContent = options.caption;
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const column of [
    { label: options.rowHeader, numeric: false },
    ...options.columns,
  ]) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = column.label;
    if (column.numeric) cell.dataset.numeric = "true";
    headRow.append(cell);
  }
  head.append(headRow);

  const body = document.createElement("tbody");
  for (const row of options.rows) {
    const tableRow = document.createElement("tr");
    const label = document.createElement("th");
    label.scope = "row";
    label.textContent = row.label;
    tableRow.append(label);
    row.cells.forEach((value, index) => {
      const cell = document.createElement("td");
      if (options.columns[index]?.numeric) cell.dataset.numeric = "true";
      cell.append(value);
      tableRow.append(cell);
    });
    body.append(tableRow);
  }
  table.append(caption, head, body);
  frame.append(table);
  return frame;
}
