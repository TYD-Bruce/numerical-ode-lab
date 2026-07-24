import {
  renderReadonlyMath,
  type ReadonlyMathHandle,
} from "../../math/ui/readonlyMath";
import type {
  GlossaryScopeSnapshot,
  GlossarySurfaceRequest,
  GlossaryTermContextSnapshot,
} from "../glossaryRuntimeTypes";
import type { GlossaryTutorRequest } from "../glossaryTutorContract";
import {
  placeGlossarySurface,
  type GlossaryRect,
  type GlossaryViewport,
} from "./glossaryPlacement";
import "./glossarySurface.css";

export type GlossarySurfaceMode = "preview" | "pinned" | "mobile-sheet";

export type GlossarySurfaceCloseReason =
  | "escape"
  | "explicit-close"
  | "outside-pointer";

type RenderMath = typeof renderReadonlyMath;

export interface MountGlossarySurfaceOptions {
  readonly mode: GlossarySurfaceMode;
  readonly request: GlossarySurfaceRequest;
  readonly statusRegion?: HTMLElement;
  readonly onClose: (reason: GlossarySurfaceCloseReason) => void;
  readonly onAskTutor?: (
    request: GlossaryTutorRequest,
    trigger: HTMLElement
  ) => Promise<void>;
  readonly renderMath?: RenderMath;
}

export interface MountedGlossarySurface {
  readonly element: HTMLElement;
  updateContext(snapshot: GlossaryScopeSnapshot): void;
  replaceTrigger?(trigger: HTMLButtonElement): void;
  reposition(trigger: GlossaryRect, viewport: GlossaryViewport): boolean;
  dispose(): void;
}

let surfaceSequence = 0;

function visibleDisplay(request: GlossarySurfaceRequest): string {
  return typeof request.display === "string"
    ? request.display
    : request.display.accessibleText;
}

function focusWithoutScroll(element: HTMLElement): void {
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

function currentTermContext(
  request: GlossarySurfaceRequest,
  snapshot: GlossaryScopeSnapshot | undefined
): GlossaryTermContextSnapshot | undefined {
  return snapshot?.terms.find((term) => term.termId === request.termId);
}

export function mountGlossarySurface(
  target: HTMLElement,
  options: MountGlossarySurfaceOptions
): MountedGlossarySurface {
  const complete = options.mode !== "preview";
  const id = `platform-glossary-surface-${++surfaceSequence}`;
  const headingId = `${id}-heading`;
  const root = document.createElement(
    options.mode === "mobile-sheet" ? "section" : "aside"
  );
  root.id = id;
  root.dataset.glossarySurface = "";
  root.className = `glossary-surface glossary-surface-${options.mode}`;
  let disposed = false;
  let latestSnapshot: GlossaryScopeSnapshot | undefined;
  let formulaHandle: ReadonlyMathHandle | undefined;
  let currentTrigger = options.request.trigger;

  if (options.mode === "preview") {
    root.setAttribute("role", "tooltip");
    const label = document.createElement("strong");
    label.className = "glossary-preview-label";
    label.textContent = visibleDisplay(options.request);
    const definition = document.createElement("p");
    definition.textContent = options.request.entry.definition;
    const prompt = document.createElement("p");
    prompt.className = "glossary-preview-prompt";
    prompt.textContent = "Click or press Enter for more.";
    root.append(label, definition, prompt);
    if (
      options.request.intent.kind === "keyboard-focus" &&
      options.statusRegion
    ) {
      options.statusRegion.setAttribute("role", "status");
      options.statusRegion.setAttribute("aria-live", "polite");
      options.statusRegion.textContent = `${visibleDisplay(options.request)}. ${
        options.request.entry.definition
      } Click or press Enter for more.`;
    }
  }

  let contextualText: HTMLParagraphElement | undefined;
  let whyText: HTMLParagraphElement | undefined;
  let formulaSection: HTMLElement | undefined;
  let formulaTarget: HTMLElement | undefined;
  let closeButton: HTMLButtonElement | undefined;
  let askButton: HTMLButtonElement | undefined;

  if (complete) {
    if (options.statusRegion) options.statusRegion.textContent = "";
    root.setAttribute(
      "role",
      options.mode === "mobile-sheet" ? "dialog" : "region"
    );
    if (options.mode === "mobile-sheet") {
      root.setAttribute("aria-modal", "true");
    }
    root.setAttribute("aria-labelledby", headingId);

    const header = document.createElement("header");
    header.className = "glossary-surface-header";
    const heading = document.createElement("h2");
    heading.id = headingId;
    heading.textContent = visibleDisplay(options.request);
    closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn ghost glossary-surface-close";
    closeButton.dataset.glossaryClose = "";
    closeButton.setAttribute("aria-label", "Close definition");
    closeButton.textContent = "Close";
    header.append(heading, closeButton);

    const content = document.createElement("div");
    content.className = "glossary-surface-content";
    if (visibleDisplay(options.request) !== options.request.entry.label) {
      const standard = document.createElement("p");
      standard.className = "glossary-standard-label";
      standard.textContent = `Standard label: ${options.request.entry.label}`;
      content.append(standard);
    }
    const definition = document.createElement("p");
    definition.className = "glossary-core-definition";
    definition.textContent = options.request.entry.definition;
    content.append(definition);

    const contextSection = document.createElement("section");
    const contextHeading = document.createElement("h3");
    contextHeading.textContent = "In this context";
    contextualText = document.createElement("p");
    contextSection.append(contextHeading, contextualText);
    content.append(contextSection);

    const whySection = document.createElement("section");
    const whyHeading = document.createElement("h3");
    whyHeading.textContent = "Why it matters here";
    whyText = document.createElement("p");
    whySection.append(whyHeading, whyText);
    content.append(whySection);

    formulaSection = document.createElement("section");
    formulaSection.className = "glossary-formula-section";
    const formulaHeading = document.createElement("h3");
    formulaHeading.textContent = "Formula example";
    formulaTarget = document.createElement("div");
    formulaTarget.className = "glossary-formula";
    formulaSection.append(formulaHeading, formulaTarget);
    content.append(formulaSection);

    if (options.onAskTutor) {
      const actions = document.createElement("div");
      actions.className = "glossary-surface-actions";
      askButton = document.createElement("button");
      askButton.type = "button";
      askButton.className = "btn primary";
      askButton.dataset.glossaryAsk = "";
      askButton.textContent = "Ask the Tutor";
      actions.append(askButton);
      content.append(actions);
    }
    root.append(header, content);
  }

  const renderContext = (): void => {
    if (!complete || !contextualText || !whyText || !formulaSection || !formulaTarget) {
      return;
    }
    const dynamic = currentTermContext(options.request, latestSnapshot);
    contextualText.textContent =
      dynamic?.contextualDefinition ??
      options.request.entry.contextualDefinition ??
      "No additional context is available.";
    whyText.textContent =
      dynamic?.whyItMattersHere ??
      options.request.entry.whyItMattersHere ??
      options.request.entry.whyItMatters;
    const formula =
      dynamic?.formula === null
        ? undefined
        : dynamic?.formula ?? options.request.entry.formula;
    formulaHandle?.dispose();
    formulaHandle = undefined;
    formulaTarget.replaceChildren();
    formulaSection.hidden = formula === undefined;
    if (formula) {
      formulaHandle = (options.renderMath ?? renderReadonlyMath)(
        formulaTarget,
        {
          latex: formula.latex,
          displayText: formula.accessibleText,
          ariaLabel: formula.accessibleText,
        },
        { display: formula.display ?? "block" }
      );
    }
  };
  renderContext();

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || disposed) return;
    event.preventDefault();
    options.onClose("escape");
  };
  const onOutsidePointer = (event: Event): void => {
    if (
      disposed ||
      options.mode !== "pinned" ||
      !(event.target instanceof Node) ||
      root.contains(event.target) ||
      currentTrigger.contains(event.target)
    ) {
      return;
    }
    options.onClose("outside-pointer");
  };
  const onTriggerTab = (event: KeyboardEvent): void => {
    if (
      disposed ||
      options.mode !== "pinned" ||
      event.key !== "Tab" ||
      event.shiftKey ||
      document.activeElement !== currentTrigger
    ) {
      return;
    }
    const first = root.querySelector<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!first) return;
    event.preventDefault();
    focusWithoutScroll(first);
  };
  const onMobileTab = (event: KeyboardEvent): void => {
    if (
      options.mode !== "mobile-sheet" ||
      event.key !== "Tab" ||
      disposed
    ) {
      return;
    }
    const focusable = [...root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    )];
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      focusWithoutScroll(last);
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      focusWithoutScroll(first);
    }
  };

  closeButton?.addEventListener("click", () =>
    options.onClose("explicit-close")
  );
  askButton?.addEventListener("click", () => {
    if (!options.onAskTutor || !askButton || askButton.disabled) return;
    askButton.disabled = true;
    askButton.textContent = "Opening Tutorâ€¦";
    const dynamic = currentTermContext(options.request, latestSnapshot);
    const tutorRequest: GlossaryTutorRequest = Object.freeze({
      kind: "glossary_term",
      termId: options.request.termId,
      moduleId: options.request.moduleId,
      scopeId: options.request.scopeId,
      ...(dynamic?.curatedTutorContext === undefined
        ? {}
        : { curatedScopeContext: dynamic.curatedTutorContext }),
    });
    void options
      .onAskTutor(tutorRequest, currentTrigger)
      .finally(() => {
        if (!disposed && askButton?.isConnected) {
          askButton.disabled = false;
          askButton.textContent = "Ask the Tutor";
        }
      });
  });
  document.addEventListener("keydown", onEscape);
  document.addEventListener("pointerdown", onOutsidePointer);
  currentTrigger.addEventListener("keydown", onTriggerTab);
  root.addEventListener("keydown", onMobileTab);

  target.replaceChildren(root);
  if (options.mode === "mobile-sheet" && closeButton) {
    focusWithoutScroll(closeButton);
  }

  return Object.freeze({
    element: root,
    updateContext(snapshot: GlossaryScopeSnapshot): void {
      if (disposed || !complete) return;
      latestSnapshot = snapshot;
      renderContext();
    },
    replaceTrigger(trigger: HTMLButtonElement): void {
      if (disposed || trigger === currentTrigger) return;
      currentTrigger.removeEventListener("keydown", onTriggerTab);
      currentTrigger = trigger;
      currentTrigger.addEventListener("keydown", onTriggerTab);
    },
    reposition(trigger: GlossaryRect, viewport: GlossaryViewport): boolean {
      if (disposed || options.mode === "mobile-sheet") return !disposed;
      const rect = root.getBoundingClientRect();
      const placement = placeGlossarySurface({
        triggerConnected: currentTrigger.isConnected,
        trigger,
        surface: { width: rect.width, height: rect.height },
        viewport,
      });
      if (!placement) return false;
      root.style.left = `${placement.left}px`;
      root.style.top = `${placement.top}px`;
      root.style.maxWidth = `${placement.maxWidth}px`;
      root.style.maxHeight = `${placement.maxHeight}px`;
      root.dataset.glossarySide = placement.side;
      return true;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      formulaHandle?.dispose();
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onOutsidePointer);
      currentTrigger.removeEventListener("keydown", onTriggerTab);
      root.removeEventListener("keydown", onMobileTab);
      if (root.parentElement === target) root.remove();
      if (options.statusRegion) options.statusRegion.textContent = "";
    },
  });
}

export type GlossarySurfaceRuntimeModule = Pick<
  typeof import("./glossarySurfaceRuntime"),
  "mountGlossarySurface"
>;
