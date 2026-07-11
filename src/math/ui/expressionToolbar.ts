export interface ExpressionToolbarTarget {
  insertLatex(template: string): void;
  showMoreSymbols(): void;
}
export interface ExpressionToolbarItem {
  id: string;
  label: string;
  buttonText: string;
  template: string;
}

export const EXPRESSION_TOOLBAR_ITEMS: readonly ExpressionToolbarItem[] = [
  { id: "fraction", label: "Insert fraction", buttonText: "a/b", template: "\\frac{#?}{#?}" },
  { id: "exponent", label: "Insert exponent", buttonText: "x²", template: "^{#?}" },
  { id: "square-root", label: "Insert square root", buttonText: "√", template: "\\sqrt{#?}" },
  { id: "exponential", label: "Insert e raised to x", buttonText: "eˣ", template: "e^{#?}" },
  { id: "sin", label: "Insert sine", buttonText: "sin", template: "\\sin(#?)" },
  { id: "cos", label: "Insert cosine", buttonText: "cos", template: "\\cos(#?)" },
  { id: "tan", label: "Insert tangent", buttonText: "tan", template: "\\tan(#?)" },
  { id: "ln", label: "Insert natural logarithm", buttonText: "ln", template: "\\ln(#?)" },
  { id: "absolute", label: "Insert absolute value", buttonText: "|x|", template: "\\left|#?\\right|" },
  { id: "pi", label: "Insert pi", buttonText: "π", template: "\\pi" },
];

export interface ExpressionToolbarHandle {
  readonly element: HTMLElement;
  setActive(active: boolean): void;
  dispose(): void;
}

export function mountExpressionToolbar(
  container: HTMLElement,
  target: ExpressionToolbarTarget
): ExpressionToolbarHandle {
  const toolbar = document.createElement("div");
  toolbar.className = "expression-toolbar";
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Mathematical expression tools");
  toolbar.hidden = true;

  const listeners: Array<() => void> = [];
  for (const item of EXPRESSION_TOOLBAR_ITEMS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "expression-tool-button";
    button.dataset.expressionTool = item.id;
    button.textContent = item.buttonText;
    button.setAttribute("aria-label", item.label);
    const preserveFocus = (event: MouseEvent): void => event.preventDefault();
    const insert = (): void => target.insertLatex(item.template);
    button.addEventListener("mousedown", preserveFocus);
    button.addEventListener("click", insert);
    listeners.push(() => {
      button.removeEventListener("mousedown", preserveFocus);
      button.removeEventListener("click", insert);
    });
    toolbar.append(button);
  }

  const more = document.createElement("button");
  more.type = "button";
  more.className = "expression-tool-button expression-more-symbols";
  more.textContent = "More symbols";
  more.setAttribute("aria-label", "Open more mathematical symbols");
  const preserveMoreFocus = (event: MouseEvent): void => event.preventDefault();
  const showMore = (): void => target.showMoreSymbols();
  more.addEventListener("mousedown", preserveMoreFocus);
  more.addEventListener("click", showMore);
  listeners.push(() => {
    more.removeEventListener("mousedown", preserveMoreFocus);
    more.removeEventListener("click", showMore);
  });
  toolbar.append(more);
  container.replaceChildren(toolbar);

  return {
    element: toolbar,
    setActive(active) {
      toolbar.hidden = !active;
    },
    dispose() {
      for (const remove of listeners) remove();
      toolbar.remove();
    },
  };
}
