export interface ExpressionFieldIssue {
  fieldId: string;
  fieldLabel: string;
  message: string;
  focus: () => void;
}
export interface ExpressionErrorSummaryHandle {
  readonly element: HTMLElement;
  render(issues: readonly ExpressionFieldIssue[], announce?: boolean): void;
  dispose(): void;
}

export function mountExpressionErrorSummary(
  container: HTMLElement,
  id = "expression-error-summary"
): ExpressionErrorSummaryHandle {
  const section = document.createElement("section");
  section.id = id;
  section.className = "expression-error-summary";
  section.hidden = true;
  section.tabIndex = -1;
  section.setAttribute("aria-live", "assertive");
  section.setAttribute("aria-atomic", "true");
  container.replaceChildren(section);

  const render = (issues: readonly ExpressionFieldIssue[], announce = false): void => {
    section.replaceChildren();
    section.hidden = issues.length === 0;
    section.removeAttribute("role");
    if (issues.length === 0) return;

    const heading = document.createElement("h3");
    heading.textContent = `Fix ${issues.length} ${issues.length === 1 ? "expression" : "expressions"} before running`;
    const list = document.createElement("ul");
    for (const issue of issues) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.fieldId = issue.fieldId;
      button.textContent = `${issue.fieldLabel}: ${issue.message}`;
      button.addEventListener("click", issue.focus, { once: true });
      item.append(button);
      list.append(item);
    }
    section.append(heading, list);
    if (announce) section.setAttribute("role", "alert");
  };

  return {
    element: section,
    render,
    dispose() {
      section.remove();
    },
  };
}
