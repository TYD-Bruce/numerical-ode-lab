import {
  renderReadonlyMath,
  type ReadonlyMathHandle,
} from "../../math/ui/readonlyMath";
import type {
  GlossaryFormula,
  GlossaryRelatedTerm,
  GlossaryScopeSnapshot,
  GlossarySurfaceRequest,
  GlossaryTermContextSnapshot,
  GlossaryTermId,
  ResolvedGlossaryEntry,
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

interface SurfaceCardState {
  readonly entry: ResolvedGlossaryEntry;
  readonly isOriginalAnnotation: boolean;
}

function visibleTermDisplay(
  display: ResolvedGlossaryEntry["display"]
): string {
  return typeof display === "string" ? display : display.accessibleText;
}

function visibleDisplay(request: GlossarySurfaceRequest): string {
  return visibleTermDisplay(request.display);
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
  let tabBridgeAvailable = options.mode === "pinned";
  let handoffPending = false;
  let currentCard: SurfaceCardState | undefined = complete
    ? Object.freeze({
        entry: options.request.entry,
        isOriginalAnnotation:
          options.request.entry.id === options.request.termId,
      })
    : undefined;
  let previousCard: SurfaceCardState | undefined;

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

  let heading: HTMLHeadingElement | undefined;
  let headerActions: HTMLElement | undefined;
  let content: HTMLElement | undefined;
  let contextualText: HTMLParagraphElement | undefined;
  let whyText: HTMLParagraphElement | undefined;
  let formulaSection: HTMLElement | undefined;
  let formulaTarget: HTMLElement | undefined;
  let formulaAnchor: Comment | undefined;
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
    heading = document.createElement("h2");
    heading.id = headingId;
    heading.tabIndex = -1;
    closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn ghost glossary-surface-close";
    closeButton.dataset.glossaryClose = "";
    closeButton.setAttribute("aria-label", "Close definition");
    closeButton.textContent = "Close";
    headerActions = document.createElement("div");
    headerActions.className = "glossary-surface-header-actions";
    headerActions.append(closeButton);
    header.append(heading, headerActions);

    content = document.createElement("div");
    content.className = "glossary-surface-content";
    root.append(header, content);
  }

  const dynamicContext = (
    card: SurfaceCardState
  ): GlossaryTermContextSnapshot | undefined =>
    card.isOriginalAnnotation
      ? currentTermContext(options.request, latestSnapshot)
      : undefined;

  const effectiveFormula = (
    card: SurfaceCardState
  ): GlossaryFormula | undefined => {
    const dynamic = dynamicContext(card);
    return dynamic?.formula === null
      ? undefined
      : dynamic?.formula ?? card.entry.formula;
  };

  const renderFormula = (formula: GlossaryFormula | undefined): void => {
    if (!formulaSection || !formulaTarget || !formulaAnchor) return;
    formulaHandle?.dispose();
    formulaHandle = undefined;
    formulaTarget.replaceChildren();
    if (formula === undefined) {
      formulaSection.remove();
      return;
    }
    if (!formulaSection.parentNode && formulaAnchor.parentNode) {
      formulaAnchor.before(formulaSection);
    }
    formulaHandle = (options.renderMath ?? renderReadonlyMath)(
      formulaTarget,
      {
        latex: formula.latex,
        displayText: formula.accessibleText,
        ariaLabel: formula.accessibleText,
      },
      { display: formula.display ?? "block" }
    );
  };

  const patchContext = (originalOnly: boolean): void => {
    const card = currentCard;
    if (
      disposed ||
      !card ||
      (originalOnly && !card.isOriginalAnnotation) ||
      !contextualText ||
      !whyText
    ) {
      return;
    }
    const dynamic = dynamicContext(card);
    const canonicalDefinition =
      card.entry.fullDefinition ?? card.entry.definition;
    const contextualDefinition =
      dynamic?.contextualDefinition ?? card.entry.contextualDefinition;
    const showContext =
      typeof contextualDefinition === "string" &&
      contextualDefinition.trim().length > 0 &&
      contextualDefinition !== canonicalDefinition;
    contextualText.hidden = !showContext;
    if (showContext) {
      let contextualValue = contextualText.querySelector<HTMLElement>(
        "[data-glossary-context-value]"
      );
      if (!contextualValue) {
        const contextLabel = document.createElement("strong");
        contextLabel.className = "glossary-inline-label";
        contextLabel.textContent = "In this context:";
        contextualValue = document.createElement("span");
        contextualValue.dataset.glossaryContextValue = "";
        contextualText.append(
          contextLabel,
          document.createTextNode(" "),
          contextualValue
        );
      }
      contextualValue.textContent = contextualDefinition;
    } else {
      contextualText.replaceChildren();
    }
    whyText.textContent =
      dynamic?.whyItMattersHere ??
      card.entry.whyItMattersHere ??
      card.entry.whyItMatters;
    renderFormula(effectiveFormula(card));
  };

  const createSection = (
    title: string,
    ...children: Node[]
  ): HTMLElement => {
    const section = document.createElement("section");
    section.className = "glossary-card-section";
    const sectionHeading = document.createElement("h3");
    sectionHeading.textContent = title;
    section.append(sectionHeading, ...children);
    return section;
  };

  const navigateTo = (termId: GlossaryTermId): void => {
    const card = currentCard;
    if (disposed || !card || termId === card.entry.id) return;
    const targetEntry = options.request.termResolver.resolve(termId);
    if (!targetEntry || targetEntry.id === card.entry.id) return;
    previousCard = card;
    currentCard = Object.freeze({
      entry: targetEntry,
      isOriginalAnnotation: targetEntry.id === options.request.termId,
    });
    renderCompleteCard();
    if (heading?.isConnected) focusWithoutScroll(heading);
  };

  const createRelationshipList = (
    relations: readonly GlossaryRelatedTerm[]
  ): HTMLUListElement | undefined => {
    const list = document.createElement("ul");
    list.className = "glossary-relationship-list";
    for (const relation of relations) {
      const item = document.createElement("li");
      if (relation.kind === "future") {
        const future = document.createElement("span");
        future.className = "glossary-future-term";
        future.dataset.glossaryFutureTerm = "";
        future.textContent = relation.label;
        item.append(future);
      } else {
        const targetEntry = options.request.termResolver.resolve(
          relation.termId
        );
        if (!targetEntry) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "glossary-related-term";
        button.dataset.glossaryRelatedTerm = "";
        button.textContent = targetEntry.label;
        button.addEventListener("click", () => navigateTo(relation.termId));
        item.append(button);
      }
      list.append(item);
    }
    return list.childElementCount === 0 ? undefined : list;
  };

  const createPrerequisiteList = (
    ids: readonly GlossaryTermId[]
  ): HTMLUListElement | undefined =>
    createRelationshipList(
      ids.map((termId) => Object.freeze({ kind: "term" as const, termId }))
    );

  const applyAskState = (): void => {
    if (!askButton) return;
    askButton.disabled = handoffPending;
    askButton.textContent = handoffPending
      ? "Opening Tutor..."
      : "Ask the Tutor";
  };

  const requestTutorHandoff = (): void => {
    const card = currentCard;
    if (
      !options.onAskTutor ||
      !askButton ||
      !card ||
      handoffPending ||
      disposed
    ) {
      return;
    }
    handoffPending = true;
    applyAskState();
    const dynamic = dynamicContext(card);
    const tutorRequest: GlossaryTutorRequest = Object.freeze({
      kind: "glossary_term",
      termId: card.entry.id,
      moduleId: options.request.moduleId,
      scopeId: options.request.scopeId,
      ...(card.isOriginalAnnotation &&
      dynamic?.curatedTutorContext !== undefined
        ? { curatedScopeContext: dynamic.curatedTutorContext }
        : {}),
    });
    void options
      .onAskTutor(tutorRequest, currentTrigger)
      .finally(() => {
        handoffPending = false;
        if (!disposed) applyAskState();
      });
  };

  function renderCompleteCard(): void {
    const card = currentCard;
    if (
      disposed ||
      !complete ||
      !card ||
      !heading ||
      !headerActions ||
      !content ||
      !closeButton
    ) {
      return;
    }
    formulaHandle?.dispose();
    formulaHandle = undefined;
    contextualText = undefined;
    whyText = undefined;
    formulaSection = undefined;
    formulaTarget = undefined;
    formulaAnchor = undefined;
    askButton = undefined;

    heading.textContent = visibleTermDisplay(card.entry.display);
    headerActions
      .querySelector("[data-glossary-back]")
      ?.remove();
    if (previousCard) {
      const backButton = document.createElement("button");
      backButton.type = "button";
      backButton.className = "btn ghost glossary-surface-back";
      backButton.dataset.glossaryBack = "";
      backButton.textContent = "Back";
      backButton.addEventListener("click", () => {
        if (!previousCard || disposed) return;
        currentCard = previousCard;
        previousCard = undefined;
        renderCompleteCard();
        if (heading?.isConnected) focusWithoutScroll(heading);
      });
      headerActions.insertBefore(backButton, closeButton);
    }

    content.replaceChildren();
    if (visibleTermDisplay(card.entry.display) !== card.entry.label) {
      const standard = document.createElement("p");
      standard.className = "glossary-standard-label";
      standard.textContent = `Standard label: ${card.entry.label}`;
      content.append(standard);
    }

    const fullDefinition = document.createElement("p");
    fullDefinition.className = "glossary-core-definition";
    fullDefinition.textContent =
      card.entry.fullDefinition ?? card.entry.definition;
    contextualText = document.createElement("p");
    contextualText.className = "glossary-contextual-definition";
    content.append(
      createSection("Full definition", fullDefinition, contextualText)
    );

    if (card.entry.intuition !== undefined) {
      const intuition = document.createElement("p");
      intuition.textContent = card.entry.intuition;
      content.append(createSection("Plain-language intuition", intuition));
    }

    whyText = document.createElement("p");
    content.append(createSection("Why it matters here", whyText));

    formulaAnchor = document.createComment("glossary-formula-anchor");
    formulaSection = createSection("Formula");
    formulaSection.classList.add("glossary-formula-section");
    formulaTarget = document.createElement("div");
    formulaTarget.className = "glossary-formula";
    formulaSection.append(formulaTarget);
    content.append(formulaAnchor);

    if (card.entry.assumptionsAndLimits !== undefined) {
      const assumptions = document.createElement("p");
      assumptions.textContent = card.entry.assumptionsAndLimits;
      content.append(createSection("Assumptions and limits", assumptions));
    }

    if (card.entry.misconception !== undefined) {
      const statement = labeledParagraph(
        "Misconception:",
        card.entry.misconception.statement
      );
      const correction = labeledParagraph(
        "Correction:",
        card.entry.misconception.correction
      );
      content.append(
        createSection("Common misconception", statement, correction)
      );
    }

    if (card.entry.moduleNote !== undefined) {
      const moduleNote = document.createElement("p");
      moduleNote.textContent = card.entry.moduleNote;
      content.append(createSection("In this Lab", moduleNote));
    }

    if (card.entry.prerequisiteTermIds?.length) {
      const prerequisites = createPrerequisiteList(
        card.entry.prerequisiteTermIds
      );
      if (prerequisites) {
        content.append(createSection("Prerequisites", prerequisites));
      }
    }
    if (card.entry.relatedTerms?.length) {
      const related = createRelationshipList(card.entry.relatedTerms);
      if (related) content.append(createSection("Related terms", related));
    }
    if (card.entry.commonlyConfusedTerms?.length) {
      const confused = createRelationshipList(
        card.entry.commonlyConfusedTerms
      );
      if (confused) {
        content.append(createSection("Often confused with", confused));
      }
    }

    if (options.onAskTutor) {
      const actions = document.createElement("div");
      actions.className = "glossary-surface-actions";
      askButton = document.createElement("button");
      askButton.type = "button";
      askButton.className = "btn primary";
      askButton.dataset.glossaryAsk = "";
      askButton.addEventListener("click", requestTutorHandoff);
      actions.append(askButton);
      content.append(actions);
      applyAskState();
    }
    patchContext(false);
  }

  function labeledParagraph(
    label: string,
    value: string
  ): HTMLParagraphElement {
    const paragraph = document.createElement("p");
    const visibleLabel = document.createElement("strong");
    visibleLabel.className = "glossary-inline-label";
    visibleLabel.textContent = label;
    paragraph.append(
      visibleLabel,
      document.createTextNode(` ${value}`)
    );
    return paragraph;
  }

  renderCompleteCard();

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
      !tabBridgeAvailable ||
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
    tabBridgeAvailable = false;
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
      patchContext(true);
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
      tabBridgeAvailable = false;
      handoffPending = false;
      formulaHandle?.dispose();
      formulaHandle = undefined;
      currentCard = undefined;
      previousCard = undefined;
      latestSnapshot = undefined;
      askButton = undefined;
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
