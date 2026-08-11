import type { MathVariableProfile } from "@numerical-t-lab/numerics/expressions/ast";
import type { MathExpression } from "@numerical-t-lab/numerics/expressions/expression";
import type { MathExpressionError } from "@numerical-t-lab/numerics/expressions/errors";
import { projectParsedExpression } from "@numerical-t-lab/numerics/expressions/projection";
import { mountExpressionToolbar, type ExpressionToolbarHandle } from "./expressionToolbar";
import type { ExpressionFieldIssue } from "./expressionErrorSummary";
import {
  validateMathFieldDraft,
  importLegacyMathFieldExpression,
  type MathFieldSnapshot,
} from "./mathFieldState";
import { loadMathLiveModule } from "./readonlyMath";
import "./editableMathField.css";

export interface EditableMathElement extends HTMLElement {
  value: string;
  mathVirtualKeyboardPolicy: "auto" | "manual" | "sandboxed" | "off";
  setValue(value?: string, options?: { silenceNotifications?: boolean }): void;
  getValue?(format?: "latex"): string;
  insert(
    latex: string,
    options?: {
      selectionMode?: "placeholder" | "after" | "before" | "item";
      focus?: boolean;
      feedback?: boolean;
    }
  ): boolean;
  focus(): void;
}

export interface MathVirtualKeyboardApi {
  visible: boolean;
  show(options?: { animate?: boolean }): void;
  hide(options?: { animate?: boolean }): void;
}

export interface EditableMathBackend {
  initializeAfterMountEvent?: boolean;
  createMathfield(): EditableMathElement;
  /** Toggle the MathLive virtual keyboard; returns false when unavailable. */
  showVirtualKeyboard(field: EditableMathElement): boolean;
  /** Hide the virtual keyboard if present; safe when unavailable. */
  hideVirtualKeyboard(): boolean;
}

function readMathVirtualKeyboard(): MathVirtualKeyboardApi | undefined {
  try {
    const keyboard = (window as Window & {
      mathVirtualKeyboard?: MathVirtualKeyboardApi;
    }).mathVirtualKeyboard;
    return keyboard;
  } catch {
    return undefined;
  }
}

export type EditableMathBackendLoader = () => Promise<EditableMathBackend>;

export interface EditableEquationPrefix {
  visual: string;
  accessible: string;
}

export interface EditableMathFieldOptions {
  fieldId: string;
  fieldLabel: string;
  profile: MathVariableProfile;
  equationPrefix: EditableEquationPrefix;
  initialConfirmed?: MathExpression;
  initialDraftLatex?: string;
  initialValidation?: "gentle" | "strict";
  description?: string;
  descriptionId?: string;
  errorId?: string;
  toolbarEnabled?: boolean;
  loadBackend?: EditableMathBackendLoader;
  onDraftStateChange?: (snapshot: MathFieldSnapshot) => void;
  onConfirmedExpressionChange?: (expression: MathExpression) => void;
  onLegacyPasteError?: (error: MathExpressionError) => void;
}

export interface EditableMathFieldHandle {
  readonly element: HTMLElement;
  getState(): MathFieldSnapshot;
  getMathfield(): EditableMathElement | undefined;
  setDraftLatex(latex: string, validation?: "gentle" | "strict"): MathFieldSnapshot;
  loadExpression(expression: MathExpression): MathFieldSnapshot;
  restoreState(
    draftLatex: string,
    confirmed: MathExpression | undefined,
    validation?: "gentle" | "strict"
  ): MathFieldSnapshot;
  restoreDraft(latex: string): MathFieldSnapshot;
  validateStrict(): MathFieldSnapshot;
  getIssue(): ExpressionFieldIssue | undefined;
  focus(): void;
  dispose(): void;
}

const activeMounts = new WeakMap<HTMLElement, object>();

const loadDefaultEditableBackend: EditableMathBackendLoader = async () => {
  const mathlive = await loadMathLiveModule();
  return {
    initializeAfterMountEvent: true,
    createMathfield: () => new mathlive.MathfieldElement() as EditableMathElement,
    showVirtualKeyboard(field) {
      try {
        field.focus();
        const keyboard = readMathVirtualKeyboard();
        if (!keyboard) return false;
        if (keyboard.visible) keyboard.hide({ animate: true });
        else keyboard.show({ animate: true });
        return true;
      } catch {
        return false;
      }
    },
    hideVirtualKeyboard() {
      try {
        const keyboard = readMathVirtualKeyboard();
        if (!keyboard) return false;
        if (keyboard.visible) keyboard.hide({ animate: true });
        return true;
      } catch {
        return false;
      }
    },
  };
};

function statusText(snapshot: MathFieldSnapshot): string {
  if (snapshot.state.kind === "ready") return "Expression ready";
  if (snapshot.state.kind === "incomplete") {
    return "Expression incomplete. Keep typing to finish the expression.";
  }
  return snapshot.state.error.message;
}

function readFieldLatex(field: EditableMathElement): string {
  return field.getValue?.("latex") ?? field.value;
}

function looksLikeLegacyPlainText(source: string): boolean {
  return source.trim() !== "" && !source.includes("\\") && !source.includes("$");
}

function mustRejectLegacyPaste(source: string): boolean {
  return /(?:Math\.|window|globalThis|document|constructor|prototype|[;=?\[\]{}])/.test(
    source
  );
}

export function mountEditableMathField(
  target: HTMLElement,
  options: EditableMathFieldOptions
): EditableMathFieldHandle {
  const token = {};
  activeMounts.set(target, token);
  let disposed = false;
  let field: EditableMathElement | undefined;
  let toolbar: ExpressionToolbarHandle | undefined;
  let confirmed: MathExpression | undefined = options.initialConfirmed;
  let draft = options.initialDraftLatex ?? options.initialConfirmed?.latex ?? "";
  let snapshot = validateMathFieldDraft(
    draft,
    options.profile,
    confirmed,
    options.initialValidation !== "gentle"
  );
  if (snapshot.state.kind === "ready") confirmed = snapshot.state.confirmed;

  const wrapper = document.createElement("div");
  wrapper.className = "editable-math-field";
  wrapper.dataset.mathProfile = options.profile;

  const row = document.createElement("div");
  row.className = "editable-math-row";
  const prefix = document.createElement("span");
  prefix.className = "editable-math-prefix";
  prefix.textContent = options.equationPrefix.visual;
  prefix.setAttribute("aria-hidden", "true");
  const fieldHost = document.createElement("span");
  fieldHost.className = "editable-math-host";
  fieldHost.textContent = "Loading mathematical editor…";
  row.append(prefix, fieldHost);

  const description = document.createElement("p");
  description.id = options.descriptionId ?? `${options.fieldId}-description`;
  description.className = "editable-math-description";
  description.textContent = options.description ?? "Enter a supported mathematical expression.";

  const status = document.createElement("p");
  status.id = options.errorId ?? `${options.fieldId}-status`;
  status.className = "editable-math-status";
  status.setAttribute("aria-live", "polite");

  const toolbarHost = document.createElement("div");
  toolbarHost.className = "expression-toolbar-host";

  const details = document.createElement("details");
  details.className = "expression-details";
  const summary = document.createElement("summary");
  summary.textContent = "Expression details";
  const detailsMessage = document.createElement("p");
  detailsMessage.className = "expression-details-message";
  const values = document.createElement("dl");
  const latexLabel = document.createElement("dt");
  latexLabel.textContent = "LaTeX";
  const latexValue = document.createElement("dd");
  const latexCode = document.createElement("code");
  latexCode.dataset.expressionLatex = "";
  latexValue.append(latexCode);
  const parsedLabel = document.createElement("dt");
  parsedLabel.textContent = "Interpreted expression";
  const parsedValue = document.createElement("dd");
  const parsedCode = document.createElement("code");
  parsedCode.dataset.expressionParsed = "";
  parsedValue.append(parsedCode);
  values.append(latexLabel, latexValue, parsedLabel, parsedValue);
  details.append(summary, detailsMessage, values);
  wrapper.append(row, description, status, toolbarHost, details);
  target.replaceChildren(wrapper);

  const accessibleLabel = `${options.equationPrefix.accessible}, ${options.fieldLabel}`;

  const renderState = (): void => {
    status.textContent = statusText(snapshot);
    status.className = "editable-math-status";
    status.removeAttribute("role");
    field?.removeAttribute("aria-invalid");
    if (snapshot.state.kind === "ready") status.classList.add("is-ready");
    else if (snapshot.strict && snapshot.state.kind === "invalid") {
      status.classList.add("is-error");
      status.setAttribute("role", "alert");
      field?.setAttribute("aria-invalid", "true");
    } else status.classList.add("is-neutral");

    const current = snapshot.state.kind === "ready" ? snapshot.state.confirmed : undefined;
    values.hidden = !current;
    detailsMessage.hidden = Boolean(current);
    if (current) {
      detailsMessage.textContent = "";
      latexCode.textContent = current.latex;
      parsedCode.textContent = projectParsedExpression(current.canonicalAst, options.profile);
    } else {
      detailsMessage.textContent = "Fix the expression to view its current details.";
      latexCode.textContent = "";
      parsedCode.textContent = "";
    }
  };

  const updateState = (next: MathFieldSnapshot, notify = true): MathFieldSnapshot => {
    snapshot = next;
    draft = next.state.draftLatex;
    if (next.state.kind === "ready") {
      confirmed = next.state.confirmed;
      if (notify) options.onConfirmedExpressionChange?.(next.state.confirmed);
    }
    renderState();
    if (notify) options.onDraftStateChange?.(next);
    return next;
  };

  const validate = (strict: boolean, notify = true): MathFieldSnapshot =>
    updateState(validateMathFieldDraft(draft, options.profile, confirmed, strict), notify);

  const setDraft = (
    latex: string,
    validation: "gentle" | "strict" = "gentle"
  ): MathFieldSnapshot => {
    draft = latex;
    if (field && readFieldLatex(field) !== latex) {
      field.setValue(latex, { silenceNotifications: true });
    }
    return validate(validation === "strict");
  };

  const focus = (): void => field?.focus();

  const detailsToggle = (): void => {
    if (details.open) validate(true);
  };
  const wrapperFocusOut = (): void => {
    queueMicrotask(() => {
      if (!wrapper.contains(document.activeElement)) toolbar?.setActive(false);
    });
  };
  details.addEventListener("toggle", detailsToggle);
  renderState();

  const loadBackend = options.loadBackend ?? loadDefaultEditableBackend;
  void loadBackend()
    .then((backend) => {
      if (disposed || !target.isConnected || activeMounts.get(target) !== token) return;
      const nextField = backend.createMathfield();
      field = nextField;
      nextField.id = options.fieldId;
      nextField.className = "editable-math-input";
      nextField.mathVirtualKeyboardPolicy = "manual";
      nextField.setAttribute("aria-label", accessibleLabel);
      nextField.setAttribute("aria-describedby", `${description.id} ${status.id}`);
      nextField.value = draft;

      const onInput = (): void => {
        draft = readFieldLatex(nextField);
        validate(false);
      };
      const onChange = (): void => {
        draft = readFieldLatex(nextField);
        validate(false);
      };
      const onFocus = (): void => toolbar?.setActive(true);
      const onBlur = (): void => {
        draft = readFieldLatex(nextField);
        validate(true);
        queueMicrotask(() => {
          if (!wrapper.contains(document.activeElement)) toolbar?.setActive(false);
        });
      };
      const onPaste = (event: Event): void => {
        const clipboard = (event as ClipboardEvent).clipboardData;
        const source = clipboard?.getData("text/plain") ?? "";
        if (!looksLikeLegacyPlainText(source)) return;
        const imported = importLegacyMathFieldExpression(source, options.profile);
        if (imported.kind === "ready") {
          event.preventDefault();
          setDraft(imported.expression.latex, "strict");
          return;
        }
        if (mustRejectLegacyPaste(source)) {
          event.preventDefault();
          options.onLegacyPasteError?.(imported.error);
        }
      };
      nextField.addEventListener("input", onInput);
      nextField.addEventListener("change", onChange);
      nextField.addEventListener("focus", onFocus);
      nextField.addEventListener("blur", onBlur);
      nextField.addEventListener("paste", onPaste);
      let initialized = false;
      const initializeValue = (): void => {
        if (initialized) return;
        initialized = true;
        nextField.setValue(draft, { silenceNotifications: true });
      };
      if (backend.initializeAfterMountEvent) {
        nextField.addEventListener("mount", initializeValue, { once: true });
      }
      fieldHost.replaceChildren(nextField);
      if (!backend.initializeAfterMountEvent) initializeValue();

      if (options.toolbarEnabled !== false) {
        toolbar = mountExpressionToolbar(toolbarHost, {
          insertLatex(template) {
            nextField.focus();
            nextField.insert(template, {
              selectionMode: "placeholder",
              focus: true,
              feedback: false,
            });
            draft = readFieldLatex(nextField);
            validate(false);
          },
          showMoreSymbols() {
            nextField.focus();
            try {
              backend.showVirtualKeyboard(nextField);
            } catch {
              // Desktop entry remains available when the virtual keyboard is unavailable.
            }
          },
        });
      }
      renderState();
      wrapper.addEventListener("focusout", wrapperFocusOut);

      const disposeListeners = (): void => {
        nextField.removeEventListener("input", onInput);
        nextField.removeEventListener("change", onChange);
        nextField.removeEventListener("focus", onFocus);
        nextField.removeEventListener("blur", onBlur);
        nextField.removeEventListener("paste", onPaste);
        nextField.removeEventListener("mount", initializeValue);
        try {
          backend.hideVirtualKeyboard();
        } catch {
          // Disposal must not throw when the optional keyboard API is unavailable.
        }
      };
      wrapper.addEventListener("math-field-dispose", disposeListeners, { once: true });
    })
    .catch(() => {
      if (!disposed && activeMounts.get(target) === token) {
        fieldHost.textContent = "The mathematical editor could not be loaded.";
      }
    });

  return {
    element: wrapper,
    getState: () => snapshot,
    getMathfield: () => field,
    setDraftLatex: setDraft,
    loadExpression(expression) {
      confirmed = expression;
      return setDraft(expression.latex, "strict");
    },
    restoreState(draftLatex, restoredConfirmed, validation = "strict") {
      confirmed = restoredConfirmed;
      return setDraft(draftLatex, validation);
    },
    restoreDraft(latex) {
      return setDraft(latex, "strict");
    },
    validateStrict() {
      if (field) draft = readFieldLatex(field);
      return validate(true);
    },
    getIssue() {
      if (!snapshot.strict || snapshot.state.kind !== "invalid") return undefined;
      return {
        fieldId: options.fieldId,
        fieldLabel: options.fieldLabel,
        message: snapshot.state.error.message,
        focus,
      };
    },
    focus,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (activeMounts.get(target) === token) activeMounts.delete(target);
      details.removeEventListener("toggle", detailsToggle);
      wrapper.removeEventListener("focusout", wrapperFocusOut);
      wrapper.dispatchEvent(new Event("math-field-dispose"));
      toolbar?.dispose();
      wrapper.remove();
    },
  };
}
