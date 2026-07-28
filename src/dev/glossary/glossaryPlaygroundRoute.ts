import type { PlatformGlossaryHost } from "../../app/platformGlossaryHost";
import type { Navigate, RouteModule } from "../../app/contracts";
import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryTermId,
  GlossaryValidationError,
} from "../../glossary/glossaryBuilders";
import {
  createLabGlossaryBinding,
} from "../../glossary/glossaryController";
import { createGlossaryRegistry } from "../../glossary/glossaryRegistry";
import type {
  GlossaryScopeContextSource,
  GlossaryScopeController,
  GlossaryScopeSnapshot,
  GlossaryTermDisplay,
  GlossaryTermId,
  GlossaryTermRenderResult,
} from "../../glossary/glossaryRuntimeTypes";
import type {
  GlossaryTutorHandoff,
  GlossaryTutorRequest,
} from "../../glossary/glossaryTutorContract";
import {
  GLOSSARY_DEVELOPMENT_WARNING,
  GLOSSARY_DYNAMIC_CONTEXT_VARIANTS,
  GLOSSARY_FIXTURE_ENTRIES,
  GLOSSARY_FIXTURE_IDS,
  GLOSSARY_FIXTURE_MATH_ALIAS,
  GLOSSARY_FIXTURE_SCOPE_IDS,
} from "./glossaryFixtures";
import "./glossaryPlayground.css";

let fixtureInputSequence = 0;

export interface GlossaryPlaygroundRouteOptions {
  readonly glossaryHost: PlatformGlossaryHost;
  readonly onMockTutorRequest?: (termId: string) => void;
}

interface DevelopmentContextController {
  readonly source: GlossaryScopeContextSource;
  getVariantName(): string;
  update(): void;
  cycle(): void;
  dispose(): void;
}

interface MockTutorRecord {
  readonly sequence: number;
  readonly kind: GlossaryTutorRequest["kind"];
  readonly termId: string;
  readonly moduleId: string;
  readonly scopeId: string;
  readonly curatedScopeContext?: string;
  readonly preserveDraft: true;
}

interface MountedPlaygroundSession {
  dispose(): void;
}

interface PlaygroundSessionOptions {
  readonly target: HTMLElement;
  readonly navigate: Navigate;
  readonly glossaryHost: PlatformGlossaryHost;
  readonly onMockTutorRequest?: (termId: string) => void;
  readonly onReset: () => void;
}

function appendInteractiveTerm(
  container: Node,
  scope: GlossaryScopeController,
  termId: GlossaryTermId,
  display: GlossaryTermDisplay,
  instance: string
): GlossaryTermRenderResult {
  const result = scope.createTerm({ termId, display });
  if (result.kind === "interactive") {
    result.node.dataset.fixtureTermId = termId;
    result.node.dataset.fixtureInstance = instance;
  }
  container.appendChild(result.node);
  return result;
}

function createContextSource(
  isCurrent: () => boolean
): DevelopmentContextController {
  let revision = 1;
  let variantIndex = 0;
  let disposed = false;
  const listeners = new Set<() => void>();
  const source: GlossaryScopeContextSource = Object.freeze({
    getSnapshot(): GlossaryScopeSnapshot {
      const variant = GLOSSARY_DYNAMIC_CONTEXT_VARIANTS[variantIndex]!;
      return Object.freeze({
        revision,
        terms: Object.freeze([
          Object.freeze({
            termId: GLOSSARY_FIXTURE_IDS.dynamic,
            contextualDefinition: variant.contextualDefinition,
            whyItMattersHere: variant.whyItMattersHere,
            ...(variant.formula === undefined
              ? {}
              : { formula: variant.formula }),
            curatedTutorContext: variant.curatedTutorContext,
          }),
        ]),
      });
    },
    subscribe(listener: () => void): () => void {
      if (disposed) return () => undefined;
      listeners.add(listener);
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        listeners.delete(listener);
      };
    },
  });

  const publish = (): void => {
    if (disposed || !isCurrent()) return;
    revision += 1;
    for (const listener of [...listeners]) listener();
  };

  return {
    source,
    getVariantName: () =>
      GLOSSARY_DYNAMIC_CONTEXT_VARIANTS[variantIndex]!.name,
    update(): void {
      if (disposed || !isCurrent()) return;
      variantIndex = 1;
      publish();
    },
    cycle(): void {
      if (disposed || !isCurrent()) return;
      variantIndex =
        (variantIndex + 1) % GLOSSARY_DYNAMIC_CONTEXT_VARIANTS.length;
      publish();
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      listeners.clear();
    },
  };
}

function createSection(
  title: string,
  key: string,
  introduction?: string
): HTMLElement {
  const section = document.createElement("section");
  section.className = "platform-card glossary-playground-section";
  section.dataset.playgroundSection = key;
  const heading = document.createElement("h2");
  heading.textContent = title;
  section.append(heading);
  if (introduction) {
    const paragraph = document.createElement("p");
    paragraph.textContent = introduction;
    section.append(paragraph);
  }
  return section;
}

function createControl(label: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn ghost";
  button.textContent = label;
  return button;
}

function createControlGroup(...controls: HTMLElement[]): HTMLElement {
  const group = document.createElement("div");
  group.className = "glossary-playground-controls";
  group.append(...controls);
  return group;
}

function mountPlaygroundSession(
  options: PlaygroundSessionOptions
): MountedPlaygroundSession {
  let active = true;
  let replacementCycle = 0;
  let disposableScopeDisposed = false;
  let inPlaceUpdateArmed = false;
  let pendingInPlaceUpdate: number | undefined;
  let externalModal: HTMLElement | undefined;
  let externalModalClose: (() => void) | undefined;
  const cleanup = new Set<() => void>();
  const events: string[] = [];
  const mockTutorRecords: MockTutorRecord[] = [];
  const strictPolicy = createGlossaryValidationPolicy({ mode: "strict" });
  const registry = createGlossaryRegistry({
    coreEntries: GLOSSARY_FIXTURE_ENTRIES,
    policy: strictPolicy,
  });
  const binding = createLabGlossaryBinding({
    moduleId: "ode",
    registry,
    policy: strictPolicy,
  });
  const isCurrent = (): boolean => active;
  const context = createContextSource(isCurrent);
  const primaryScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.primary,
    context: context.source,
  });
  const secondaryScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.secondary,
  });
  const multiScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.multi,
  });
  const formScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.form,
  });
  const compositionScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.composition,
  });
  let replacementScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.replacement,
  });
  const disposableScope = binding.createScope({
    id: GLOSSARY_FIXTURE_SCOPE_IDS.disposable,
  });

  const root = document.createElement("article");
  root.className =
    "platform-page glossary-playground glossary-playground-laboratory";
  const header = document.createElement("header");
  header.className = "platform-page-heading glossary-playground-header";
  const heading = document.createElement("h1");
  heading.tabIndex = -1;
  heading.dataset.routeFocus = "true";
  heading.textContent = "Glossary Playground";
  const warning = document.createElement("p");
  warning.className = "glossary-playground-warning";
  const warningStrong = document.createElement("strong");
  warningStrong.textContent = GLOSSARY_DEVELOPMENT_WARNING;
  warning.append(warningStrong);
  const summary = document.createElement("p");
  summary.textContent =
    "Glossary Playground laboratory: one development-only route for the complete content-neutral framework matrix.";
  header.append(heading, warning, summary);
  root.append(header);

  const state = document.createElement("p");
  state.className = "glossary-playground-state";
  state.dataset.playgroundState = "";
  state.setAttribute("aria-live", "polite");
  const eventList = document.createElement("ol");
  eventList.dataset.playgroundLog = "";
  const mockTutorList = document.createElement("ol");
  mockTutorList.dataset.mockTutorLog = "";
  const diagnosticsList = document.createElement("ol");
  diagnosticsList.dataset.diagnosticList = "";

  const renderState = (): void => {
    if (!active) return;
    state.textContent = `Context revision ${
      context.source.getSnapshot().revision
    }; context mode ${context.getVariantName()}; replacement cycle ${replacementCycle}; replacement trigger ${
      replacementContainer?.isConnected ? "attached" : "detached"
    }; disposable scope ${
      disposableScopeDisposed ? "disposed" : "active"
    }; mock requests ${mockTutorRecords.length}.`;
  };
  const renderEvents = (): void => {
    if (!active) return;
    eventList.replaceChildren(
      ...events.map((message) => {
        const item = document.createElement("li");
        item.textContent = message;
        return item;
      })
    );
  };
  const log = (message: string): void => {
    if (!active) return;
    events.push(message);
    renderEvents();
  };
  const renderMockTutorLog = (): void => {
    if (!active) return;
    if (mockTutorRecords.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No mock requests yet.";
      mockTutorList.replaceChildren(empty);
      renderState();
      return;
    }
    mockTutorList.replaceChildren(
      ...mockTutorRecords.map((record) => {
        const item = document.createElement("li");
        item.textContent = [
          `#${record.sequence}`,
          `kind: ${record.kind}`,
          `termId: ${record.termId}`,
          `moduleId: ${record.moduleId}`,
          `scopeId: ${record.scopeId}`,
          `preserveDraft: ${record.preserveDraft}`,
          `curatedScopeContext: ${
            record.curatedScopeContext ?? "not supplied"
          }`,
        ].join("; ");
        return item;
      })
    );
    renderState();
  };

  const addListener = <K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (event: HTMLElementEventMap[K]) => void
  ): void => {
    element.addEventListener(type, listener as EventListener);
    cleanup.add(() =>
      element.removeEventListener(type, listener as EventListener)
    );
  };
  const protectOpenSurface = (button: HTMLButtonElement): void => {
    addListener(button, "pointerdown", (event) => event.stopPropagation());
  };

  const howTo = createSection(
    "How to use this Playground",
    "instructions",
    "Focus or hover a dotted term for preview, activate it for the complete surface, then use the controls to exercise context, replacement, modal, and disposal behavior."
  );
  const instructionList = document.createElement("ul");
  for (const instruction of [
    "Keyboard: Tab to a term, press Enter or Space, then use Escape or Close.",
    "Pointer: hover for preview on a fine pointer, move into the preview, or click to pin.",
    "Mobile: activate a term to open the modal sheet and verify contained focus and scroll.",
    "All definitions, labels, formulas, and logs on this page are development fixtures.",
  ]) {
    const item = document.createElement("li");
    item.textContent = instruction;
    instructionList.append(item);
  }
  howTo.append(instructionList, state);
  root.append(howTo);

  const core = createSection(
    "Core interaction examples",
    "core",
    "Short, long, aliased, formula-free, and dynamic records exercise the shared content shape."
  );
  const sampleLine = document.createElement("p");
  sampleLine.append("Primary fixture: ");
  const sampleTerm = appendInteractiveTerm(
    sampleLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.sample,
    "Sample parameter",
    "sample-primary"
  );
  sampleLine.append(". Same-scope duplicate: ");
  const duplicate = primaryScope.createTerm({
    termId: GLOSSARY_FIXTURE_IDS.sample,
    display: "Sample parameter",
  });
  const duplicateWrapper = document.createElement("span");
  duplicateWrapper.dataset.sampleDuplicate = "";
  duplicateWrapper.dataset.sameScopeDuplicate = "";
  duplicateWrapper.append(duplicate.node);
  sampleLine.append(duplicateWrapper, ".");

  const shortLine = document.createElement("p");
  shortLine.append("Very short: ");
  appendInteractiveTerm(
    shortLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.short,
    "Very short fixture",
    "short-primary"
  );
  const longLine = document.createElement("p");
  longLine.append("Long-form fixture: ");
  appendInteractiveTerm(
    longLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.long,
    "Deliberately extended fixture label for wrapping checks",
    "long-primary"
  );
  const plainLine = document.createElement("p");
  plainLine.append("Optional content: ");
  appendInteractiveTerm(
    plainLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.plain,
    "No-formula fixture",
    "plain-primary"
  );
  core.append(sampleLine, shortLine, longLine, plainLine);
  root.append(core);

  const scopes = createSection(
    "Scope and duplicate behavior",
    "scopes",
    "The same stable term is independent in another explicit scope, while later occurrences in one scope remain plain text."
  );
  const otherScopeLine = document.createElement("p");
  otherScopeLine.append("Other scope: ");
  appendInteractiveTerm(
    otherScopeLine,
    secondaryScope,
    GLOSSARY_FIXTURE_IDS.sample,
    "Sample parameter",
    "sample-secondary"
  );
  otherScopeLine.append(". Text alias: ");
  appendInteractiveTerm(
    otherScopeLine,
    secondaryScope,
    GLOSSARY_FIXTURE_IDS.alias,
    "Alternate fixture wording",
    "text-alias"
  );
  const multiLine = document.createElement("p");
  multiLine.append("Multiple terms in one scope: ");
  appendInteractiveTerm(
    multiLine,
    multiScope,
    GLOSSARY_FIXTURE_IDS.short,
    "Very short fixture",
    "multi-short"
  );
  multiLine.append(", ");
  appendInteractiveTerm(
    multiLine,
    multiScope,
    GLOSSARY_FIXTURE_IDS.plain,
    "No-formula fixture",
    "multi-plain"
  );
  const disposableLine = document.createElement("p");
  disposableLine.dataset.disposableScopeContainer = "";
  disposableLine.append("Disposable scope: ");
  appendInteractiveTerm(
    disposableLine,
    disposableScope,
    GLOSSARY_FIXTURE_IDS.label,
    "Input concept",
    "disposable-label"
  );
  const disposeScope = createControl("Dispose demonstration scope");
  disposeScope.dataset.disposeGlossaryScope = "";
  protectOpenSurface(disposeScope);
  addListener(disposeScope, "click", () => {
    if (!active || disposableScopeDisposed) return;
    disposableScopeDisposed = true;
    disposableScope.dispose();
    disposableLine.replaceChildren(
      document.createTextNode("Disposable scope removed.")
    );
    disposeScope.disabled = true;
    log("Disposed the demonstration scope.");
    renderState();
  });
  scopes.append(otherScopeLine, multiLine, disposableLine, disposeScope);
  root.append(scopes);

  const dynamicSection = createSection(
    "Dynamic context",
    "dynamic",
    "Update a pinned card or mobile sheet in place through curated snapshots."
  );
  const dynamicLine = document.createElement("p");
  dynamicLine.append("Live fixture: ");
  const dynamicTerm = appendInteractiveTerm(
    dynamicLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.dynamic,
    "Changing context",
    "dynamic-primary"
  );
  const updateContext = createControl("Update dynamic context");
  updateContext.dataset.updateGlossaryContext = "";
  const cycleContext = createControl("Cycle context revision");
  cycleContext.dataset.cycleGlossaryContext = "";
  const armInPlaceUpdate = createControl("Arm in-place context update");
  armInPlaceUpdate.dataset.armGlossaryContextUpdate = "";
  armInPlaceUpdate.setAttribute("aria-pressed", "false");
  for (const button of [updateContext, cycleContext, armInPlaceUpdate]) {
    protectOpenSurface(button);
  }
  const clearPendingInPlaceUpdate = (): void => {
    if (pendingInPlaceUpdate === undefined) return;
    window.clearTimeout(pendingInPlaceUpdate);
    pendingInPlaceUpdate = undefined;
  };
  cleanup.add(clearPendingInPlaceUpdate);
  const scheduleArmedInPlaceUpdate = (): void => {
    if (
      !active ||
      !inPlaceUpdateArmed ||
      dynamicTerm.kind !== "interactive"
    ) {
      return;
    }
    inPlaceUpdateArmed = false;
    armInPlaceUpdate.setAttribute("aria-pressed", "false");
    clearPendingInPlaceUpdate();
    let attempts = 0;
    const updateWhenSurfaceIsOpen = (): void => {
      if (!active) return;
      if (dynamicTerm.node.getAttribute("aria-expanded") === "true") {
        pendingInPlaceUpdate = undefined;
        context.cycle();
        log(
          `Applied the armed in-place update while the surface was open (${context.getVariantName()}).`
        );
        renderState();
        return;
      }
      attempts += 1;
      if (attempts >= 20) {
        pendingInPlaceUpdate = undefined;
        log("The armed in-place update expired before the surface opened.");
        return;
      }
      pendingInPlaceUpdate = window.setTimeout(updateWhenSurfaceIsOpen, 50);
    };
    pendingInPlaceUpdate = window.setTimeout(updateWhenSurfaceIsOpen, 150);
  };
  if (dynamicTerm.kind === "interactive") {
    addListener(dynamicTerm.node, "click", scheduleArmedInPlaceUpdate);
  }
  addListener(updateContext, "click", () => {
    context.update();
    log("Updated dynamic context to the replacement-formula variant.");
    renderState();
  });
  addListener(cycleContext, "click", () => {
    context.cycle();
    log(`Cycled dynamic context to ${context.getVariantName()}.`);
    renderState();
  });
  addListener(armInPlaceUpdate, "click", () => {
    inPlaceUpdateArmed = !inPlaceUpdateArmed;
    armInPlaceUpdate.setAttribute("aria-pressed", String(inPlaceUpdateArmed));
    if (!inPlaceUpdateArmed) {
      clearPendingInPlaceUpdate();
    }
    log(
      inPlaceUpdateArmed
        ? "Armed one in-place update for the next Changing context activation."
        : "Disarmed the pending in-place context update."
    );
  });
  dynamicSection.append(
    dynamicLine,
    createControlGroup(updateContext, cycleContext, armInPlaceUpdate)
  );
  root.append(dynamicSection);

  const replacementSection = createSection(
    "Replacement lifecycle",
    "replacement",
    "Explicit transactions move the active surface and ARIA ownership to the current trigger without DOM scanning."
  );
  const replacementStage = document.createElement("div");
  replacementStage.className = "glossary-playground-replacement-stage";
  replacementStage.dataset.replacementStage = "";
  let replacementContainer: HTMLParagraphElement | undefined;
  const renderReplacement = (
    scope: GlossaryScopeController,
    moved: boolean
  ): HTMLParagraphElement => {
    const line = document.createElement("p");
    line.className = moved
      ? "glossary-playground-replacement-current is-moved"
      : "glossary-playground-replacement-current";
    line.append(`Current trigger (cycle ${replacementCycle}): `);
    appendInteractiveTerm(
      line,
      scope,
      GLOSSARY_FIXTURE_IDS.replacement,
      "Replaceable term",
      "replacement-current"
    );
    return line;
  };
  replacementContainer = renderReplacement(replacementScope, false);
  replacementStage.append(replacementContainer);

  const replaceTrigger = createControl("Replace trigger");
  replaceTrigger.dataset.replaceGlossaryTrigger = "";
  const repeatReplacement = createControl("Repeat replacement");
  repeatReplacement.dataset.repeatGlossaryReplacement = "";
  const detachTrigger = createControl("Detach current trigger");
  detachTrigger.dataset.detachGlossaryTrigger = "";
  const recreateScope = createControl("Recreate replacement scope");
  recreateScope.dataset.recreateGlossaryScope = "";
  for (const button of [
    replaceTrigger,
    repeatReplacement,
    detachTrigger,
    recreateScope,
  ]) {
    protectOpenSurface(button);
  }

  const replaceCurrent = (reason: string): void => {
    if (!active) return;
    const transaction = binding.beginScopeRerender({
      id: GLOSSARY_FIXTURE_SCOPE_IDS.replacement,
    });
    replacementCycle += 1;
    const next = renderReplacement(
      transaction.scope,
      replacementCycle % 2 === 1
    );
    replacementContainer?.remove();
    replacementStage.append(next);
    replacementContainer = next;
    replacementScope = transaction.scope;
    transaction.commit();
    log(`${reason}; replacement cycle ${replacementCycle}.`);
    renderState();
  };
  addListener(replaceTrigger, "click", () =>
    replaceCurrent("Replaced the current trigger")
  );
  addListener(repeatReplacement, "click", () =>
    replaceCurrent("Repeated the replacement transaction")
  );
  addListener(detachTrigger, "click", () => {
    if (!active || !replacementContainer?.isConnected) return;
    replacementContainer.remove();
    log("Detached the current replacement trigger.");
    renderState();
  });
  addListener(recreateScope, "click", () =>
    replaceCurrent("Recreated the replacement scope")
  );
  replacementSection.append(
    replacementStage,
    createControlGroup(
      replaceTrigger,
      repeatReplacement,
      detachTrigger,
      recreateScope
    )
  );
  root.append(replacementSection);

  const formulaSection = createSection(
    "Formula and readonly math",
    "formula",
    "These records are display-only fixtures. They never evaluate or establish notation."
  );
  const formulaLine = document.createElement("p");
  formulaLine.append("Readonly display fixture: ");
  appendInteractiveTerm(
    formulaLine,
    primaryScope,
    GLOSSARY_FIXTURE_IDS.formula,
    "Formula example",
    "formula-primary"
  );
  const aliasLine = document.createElement("p");
  aliasLine.append("Mathematical display alias: ");
  appendInteractiveTerm(
    aliasLine,
    compositionScope,
    GLOSSARY_FIXTURE_IDS.alias,
    GLOSSARY_FIXTURE_MATH_ALIAS,
    "math-alias"
  );
  formulaSection.append(formulaLine, aliasLine);
  root.append(formulaSection);

  const composition = createSection(
    "Educational label composition",
    "composition",
    "Term triggers are siblings of labels and other controls, never nested interactive descendants."
  );
  const inputId = `glossary-fixture-input-${++fixtureInputSequence}`;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const nativeLabel = document.createElement("label");
  nativeLabel.className = "sr-only";
  nativeLabel.htmlFor = inputId;
  nativeLabel.textContent = "Fixture input value";
  const visibleLabel = document.createElement("p");
  visibleLabel.className = "glossary-playground-visible-label";
  visibleLabel.append("Related ");
  appendInteractiveTerm(
    visibleLabel,
    formScope,
    GLOSSARY_FIXTURE_IDS.label,
    "Input concept",
    "label-primary"
  );
  visibleLabel.append(":");
  const input = document.createElement("input");
  input.id = inputId;
  input.dataset.glossaryFixtureInput = "";
  input.setAttribute("aria-describedby", `${helpId} ${errorId}`);
  const help = document.createElement("p");
  help.id = helpId;
  help.textContent = "Development-only help text.";
  const error = document.createElement("p");
  error.id = errorId;
  error.textContent = "Development-only error relationship.";

  const headingAdjacent = document.createElement("div");
  headingAdjacent.className = "glossary-playground-composition-example";
  const headingAdjacentTitle = document.createElement("h3");
  headingAdjacentTitle.textContent = "Heading-adjacent explanation";
  const headingAdjacentText = document.createElement("p");
  headingAdjacentText.append("Separate explanatory term: ");
  appendInteractiveTerm(
    headingAdjacentText,
    compositionScope,
    GLOSSARY_FIXTURE_IDS.plain,
    "No-formula fixture",
    "heading-adjacent"
  );
  headingAdjacent.append(headingAdjacentTitle, headingAdjacentText);

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.textContent = "Development composition table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerCell = document.createElement("th");
  headerCell.scope = "col";
  headerCell.append("Fixture column ");
  appendInteractiveTerm(
    headerCell,
    compositionScope,
    GLOSSARY_FIXTURE_IDS.table,
    "Header fixture",
    "table-header"
  );
  headerRow.append(headerCell);
  thead.append(headerRow);
  const tbody = document.createElement("tbody");
  const bodyRow = document.createElement("tr");
  const bodyCell = document.createElement("td");
  bodyCell.textContent = "Neutral table value";
  bodyRow.append(bodyCell);
  tbody.append(bodyRow);
  table.append(caption, thead, tbody);

  const unannotated = document.createElement("div");
  unannotated.className = "glossary-playground-controls";
  unannotated.dataset.intentionallyUnannotated = "";
  const normalLink = document.createElement("a");
  normalLink.href = "/about";
  normalLink.textContent = "Normal route link";
  const normalButton = createControl("Normal unannotated button");
  unannotated.append(normalLink, normalButton);
  composition.append(
    nativeLabel,
    visibleLabel,
    input,
    help,
    error,
    headingAdjacent,
    table,
    unannotated
  );
  root.append(composition);

  const placement = createSection(
    "Placement and scrolling matrix",
    "placement",
    "Use the zones below at wide and narrow viewports to reproduce every placement edge and long-card scroll."
  );
  const placementGrid = document.createElement("div");
  placementGrid.className = "glossary-playground-placement-grid";
  const placementCases: readonly [
    string,
    string,
    keyof Pick<
      typeof GLOSSARY_FIXTURE_SCOPE_IDS,
      | "placementTop"
      | "placementBottom"
      | "placementLeft"
      | "placementRight"
      | "placementCenter"
      | "placementNarrow"
      | "placementScroll"
    >,
    GlossaryTermId,
    string
  ][] = [
    [
      "top",
      "Top edge",
      "placementTop",
      GLOSSARY_FIXTURE_IDS.short,
      "Very short fixture",
    ],
    [
      "bottom",
      "Bottom edge",
      "placementBottom",
      GLOSSARY_FIXTURE_IDS.long,
      "Deliberately extended fixture label for wrapping checks",
    ],
    [
      "left",
      "Left edge",
      "placementLeft",
      GLOSSARY_FIXTURE_IDS.alias,
      "Alias fixture",
    ],
    [
      "right",
      "Right edge",
      "placementRight",
      GLOSSARY_FIXTURE_IDS.formula,
      "Formula example",
    ],
    [
      "center",
      "Centered",
      "placementCenter",
      GLOSSARY_FIXTURE_IDS.plain,
      "No-formula fixture",
    ],
    [
      "narrow",
      "Narrow container",
      "placementNarrow",
      GLOSSARY_FIXTURE_IDS.table,
      "Header fixture",
    ],
    [
      "scroll",
      "Scrollable container",
      "placementScroll",
      GLOSSARY_FIXTURE_IDS.dynamic,
      "Changing context",
    ],
  ];
  for (const [key, label, scopeKey, termId, display] of placementCases) {
    const zone = document.createElement("div");
    zone.className = `glossary-playground-placement-zone is-${key}`;
    zone.dataset.placementCase = key;
    const zoneLabel = document.createElement("strong");
    zoneLabel.textContent = label;
    const zoneLine = document.createElement("p");
    zoneLine.append("Open ");
    const scope = binding.createScope({
      id: GLOSSARY_FIXTURE_SCOPE_IDS[scopeKey],
      ...(key === "scroll" ? { context: context.source } : {}),
    });
    appendInteractiveTerm(
      zoneLine,
      scope,
      termId,
      display,
      `placement-${key}`
    );
    zone.append(zoneLabel, zoneLine);
    if (key === "scroll") {
      for (let index = 1; index <= 6; index += 1) {
        const spacer = document.createElement("p");
        spacer.textContent = `Scrollable neutral spacer ${index}.`;
        zone.append(spacer);
      }
    }
    placementGrid.append(zone);
  }
  placement.append(placementGrid);
  root.append(placement);

  const modalSection = createSection(
    "Mobile and modal arbitration",
    "modal",
    "The external simulator blocks a mobile Glossary sheet. Closing it grants no replay authority; activate the term again."
  );
  const externalOpen = createControl("Open external modal simulator");
  externalOpen.dataset.openExternalModal = "";
  const backgroundControl = createControl("Background inert check");
  backgroundControl.dataset.backgroundControl = "";
  const closeExternalModal = (): void => {
    externalModalClose?.();
    externalModalClose = undefined;
    externalModal = undefined;
  };
  const openExternalModal = (): void => {
    if (!active || externalModal) return;
    const backdrop = document.createElement("div");
    backdrop.className =
      "glossary-playground-external-modal new-experiment-backdrop";
    const dialog = document.createElement("section");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "External modal simulator");
    const text = document.createElement("p");
    text.textContent = "This development dialog blocks platform sheets.";
    const attemptGlossary = createControl("Attempt Glossary while modal is open");
    attemptGlossary.dataset.attemptGlossaryWithExternalModal = "";
    const close = createControl("Close simulator");
    close.dataset.closeExternalModal = "";
    const onAttemptGlossary = (): void => {
      if (!active || sampleTerm.kind !== "interactive") return;
      sampleTerm.node.click();
      log("Attempted a Glossary activation while the external modal was open.");
    };
    const onClose = (): void => {
      attemptGlossary.removeEventListener("click", onAttemptGlossary);
      close.removeEventListener("click", onClose);
      backdrop.remove();
      externalModal = undefined;
      externalModalClose = undefined;
      log("Closed the external modal simulator.");
    };
    attemptGlossary.addEventListener("click", onAttemptGlossary);
    close.addEventListener("click", onClose);
    externalModalClose = onClose;
    dialog.append(text, attemptGlossary, close);
    backdrop.append(dialog);
    document.body.append(backdrop);
    externalModal = backdrop;
    close.focus();
    log("Opened the external modal simulator.");
  };
  addListener(externalOpen, "click", openExternalModal);
  addListener(backgroundControl, "click", () => {
    log("The background inert check control was activated.");
  });
  modalSection.append(createControlGroup(externalOpen, backgroundControl));
  root.append(modalSection);

  const tutorSection = createSection(
    "Mock Tutor handoff",
    "tutor",
    "Ask actions use the existing structured contract and this visible development mock. No API, transcript, queue, Keep, or Replace behavior exists here."
  );
  const mockStatus = document.createElement("p");
  mockStatus.dataset.mockTutorStatus = "";
  mockStatus.textContent = "Development mock ready; no request has been recorded.";
  const clearMockTutor = createControl("Clear mock Tutor request log");
  clearMockTutor.dataset.clearMockTutorLog = "";
  protectOpenSurface(clearMockTutor);
  addListener(clearMockTutor, "click", () => {
    mockTutorRecords.splice(0);
    mockStatus.textContent =
      "Development mock ready; no request has been recorded.";
    renderMockTutorLog();
    log("Cleared the mock Tutor request log.");
  });
  tutorSection.append(
    mockStatus,
    createControlGroup(clearMockTutor),
    mockTutorList
  );
  root.append(tutorSection);

  const diagnosticsSection = createSection(
    "Diagnostics and invalid fixtures",
    "diagnostics",
    "Each button intentionally triggers and contains one strict development diagnostic. Valid fixtures remain active."
  );
  const diagnosticControls = document.createElement("div");
  diagnosticControls.className = "glossary-playground-controls";
  const diagnostics = [
    ["invalid_term_id", "Invalid term ID"],
    ["unknown_term", "Unknown term"],
    ["invalid_display", "Invalid display"],
    ["invalid_formula", "Invalid formula metadata"],
    ["duplicate_term_id", "Duplicate fixture metadata"],
    ["conflicting_alias", "Conflicting fixture alias"],
  ] as const;
  let emptyDiagnostic: HTMLLIElement | undefined;
  const appendDiagnostic = (code: string, message: string): void => {
    emptyDiagnostic?.remove();
    emptyDiagnostic = undefined;
    const item = document.createElement("li");
    item.textContent = `${code}: ${message}`;
    diagnosticsList.append(item);
    log(`Contained strict diagnostic ${code}.`);
  };
  const diagnosticEntry = (id: string, alias: string) =>
    defineGlossaryEntry(
      {
        id,
        label: `${id} label`,
        aliases: [alias],
        definition: "Development diagnostic fixture.",
        whyItMatters: "It exists only to exercise strict validation.",
        tutorTopic: "development diagnostic fixture",
      },
      strictPolicy
    )!;
  const runDiagnostic = (code: (typeof diagnostics)[number][0]): void => {
    if (!active) return;
    try {
      switch (code) {
        case "invalid_term_id":
          defineGlossaryTermId("Invalid fixture", strictPolicy);
          break;
        case "unknown_term":
          primaryScope.createTerm({
            termId: defineGlossaryTermId("unknown_fixture", strictPolicy)!,
            display: "Unknown fixture",
          });
          break;
        case "invalid_display":
          primaryScope.createTerm({
            termId: GLOSSARY_FIXTURE_IDS.label,
            display: "",
          });
          break;
        case "invalid_formula":
          defineGlossaryEntry(
            {
              id: "invalid_formula_fixture",
              label: "Invalid formula fixture",
              definition: "Development diagnostic fixture.",
              whyItMatters: "It exists only to exercise strict validation.",
              formula: { latex: "", accessibleText: "" },
              tutorTopic: "development diagnostic fixture",
            },
            strictPolicy
          );
          break;
        case "duplicate_term_id": {
          const duplicateEntry = diagnosticEntry(
            "duplicate_fixture",
            "Duplicate fixture alias"
          );
          createGlossaryRegistry({
            coreEntries: [duplicateEntry, duplicateEntry],
            policy: strictPolicy,
          });
          break;
        }
        case "conflicting_alias":
          createGlossaryRegistry({
            coreEntries: [
              diagnosticEntry("diagnostic_alpha", "Shared diagnostic alias"),
              diagnosticEntry("diagnostic_beta", "Shared diagnostic alias"),
            ],
            policy: strictPolicy,
          });
          break;
      }
      appendDiagnostic(code, "Unexpectedly produced no strict diagnostic.");
    } catch (error) {
      if (error instanceof GlossaryValidationError) {
        appendDiagnostic(
          error.diagnostic.code,
          "Expected strict failure contained by the Playground."
        );
      } else {
        appendDiagnostic(code, `Unexpected error: ${String(error)}`);
      }
    }
  };
  for (const [code, label] of diagnostics) {
    const button = createControl(label);
    button.dataset.runDiagnostic = code;
    protectOpenSurface(button);
    addListener(button, "click", () => runDiagnostic(code));
    diagnosticControls.append(button);
  }
  emptyDiagnostic = document.createElement("li");
  emptyDiagnostic.textContent = "No diagnostics exercised yet.";
  diagnosticsList.append(emptyDiagnostic);
  diagnosticsSection.append(diagnosticControls, diagnosticsList);
  root.append(diagnosticsSection);

  const logSection = createSection(
    "Event and request log",
    "log",
    "Route-local evidence for fixture updates and lifecycle controls. It is cleared on reset or disposal."
  );
  logSection.append(eventList);
  root.append(logSection);

  const resetSection = createSection(
    "Reset controls",
    "reset",
    "Reset rebuilds a fresh binding and scopes. Navigate away exercises ordinary route disposal."
  );
  const reset = createControl("Reset fixture state");
  reset.dataset.resetGlossaryFixtures = "";
  const navigateAway = createControl("Navigate to About");
  navigateAway.dataset.navigateAway = "";
  protectOpenSurface(reset);
  protectOpenSurface(navigateAway);
  addListener(reset, "click", () => {
    if (active) options.onReset();
  });
  addListener(navigateAway, "click", () => {
    if (!active) return;
    log("Navigating away to About.");
    void options.navigate("/about");
  });
  resetSection.append(createControlGroup(reset, navigateAway));
  root.append(resetSection);

  options.target.replaceChildren(root);

  const tutorHandoff: GlossaryTutorHandoff = Object.freeze({
    async askTerm({
      request,
      preserveDraft,
    }: Parameters<GlossaryTutorHandoff["askTerm"]>[0]) {
      if (!active) return { status: "cancelled" as const };
      const record: MockTutorRecord = Object.freeze({
        sequence: mockTutorRecords.length + 1,
        kind: request.kind,
        termId: String(request.termId),
        moduleId: request.moduleId,
        scopeId: String(request.scopeId),
        ...(request.curatedScopeContext === undefined
          ? {}
          : { curatedScopeContext: request.curatedScopeContext }),
        preserveDraft,
      });
      mockTutorRecords.push(record);
      options.onMockTutorRequest?.(record.termId);
      mockStatus.textContent = `Development mock recorded ${record.termId}; no network request was sent.`;
      renderMockTutorLog();
      log(`Recorded mock Tutor handoff for ${record.termId}.`);
      return { status: "started" as const };
    },
  });
  options.glossaryHost.connect(binding, { tutorHandoff });
  log("Mounted one development Glossary binding.");
  renderMockTutorLog();
  renderState();

  return {
    dispose(): void {
      if (!active) return;
      active = false;
      for (const remove of [...cleanup]) remove();
      cleanup.clear();
      options.glossaryHost.close({ restoreFocus: false });
      options.glossaryHost.disconnect();
      closeExternalModal();
      binding.dispose();
      context.dispose();
      events.splice(0);
      mockTutorRecords.splice(0);
      options.target.replaceChildren();
    },
  };
}

export function createGlossaryPlaygroundRoute(
  options: GlossaryPlaygroundRouteOptions
): RouteModule {
  return Object.freeze({
    mount({
      target,
      navigate,
    }: Parameters<RouteModule["mount"]>[0]) {
      let disposed = false;
      let session: MountedPlaygroundSession | undefined;
      const reset = (): void => {
        if (disposed) return;
        session?.dispose();
        if (disposed) return;
        session = mountPlaygroundSession({
          target,
          navigate,
          glossaryHost: options.glossaryHost,
          onMockTutorRequest: options.onMockTutorRequest,
          onReset: reset,
        });
      };
      reset();

      return Object.freeze({
        dispose(): void {
          if (disposed) return;
          disposed = true;
          session?.dispose();
          session = undefined;
        },
      });
    },
  });
}
