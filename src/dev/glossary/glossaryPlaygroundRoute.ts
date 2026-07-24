import type { PlatformGlossaryHost } from "../../app/platformGlossaryHost";
import type { RouteModule } from "../../app/contracts";
import {
  createGlossaryValidationPolicy,
} from "../../glossary/glossaryBuilders";
import { createLabGlossaryBinding } from "../../glossary/glossaryController";
import { createGlossaryRegistry } from "../../glossary/glossaryRegistry";
import type {
  GlossaryScopeContextSource,
  GlossaryScopeController,
  GlossaryScopeSnapshot,
  GlossaryTermId,
  GlossaryTermRenderResult,
} from "../../glossary/glossaryRuntimeTypes";
import type { GlossaryTutorHandoff } from "../../glossary/glossaryTutorContract";
import {
  GLOSSARY_DEVELOPMENT_WARNING,
  GLOSSARY_FIXTURE_ENTRIES,
  GLOSSARY_FIXTURE_IDS,
  GLOSSARY_FIXTURE_SCOPE_IDS,
} from "./glossaryFixtures";

let fixtureInputSequence = 0;

export interface GlossaryPlaygroundRouteOptions {
  readonly glossaryHost: PlatformGlossaryHost;
  readonly onMockTutorRequest?: (termId: string) => void;
}

function appendInteractiveTerm(
  container: HTMLElement,
  scope: GlossaryScopeController,
  termId: GlossaryTermId,
  display: string
): GlossaryTermRenderResult {
  const result = scope.createTerm({ termId, display });
  if (result.kind === "interactive") {
    result.node.dataset.fixtureTermId = termId;
  }
  container.append(result.node);
  return result;
}

function createContextSource(): {
  readonly source: GlossaryScopeContextSource;
  update(): void;
} {
  let revision = 1;
  let updated = false;
  const listeners = new Set<() => void>();
  const snapshot = (): GlossaryScopeSnapshot =>
    Object.freeze({
      revision,
      terms: Object.freeze([
        Object.freeze({
          termId: GLOSSARY_FIXTURE_IDS.dynamic,
          contextualDefinition: updated
            ? "Updated changing context."
            : "Initial changing context.",
          whyItMattersHere: updated
            ? "The mounted card received the new curated fixture snapshot."
            : "The mounted card is reading the initial curated fixture snapshot.",
          curatedTutorContext: updated
            ? "Updated development context"
            : "Initial development context",
        }),
      ]),
    });
  return {
    source: Object.freeze({
      getSnapshot: snapshot,
      subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    }),
    update(): void {
      updated = true;
      revision += 1;
      for (const listener of [...listeners]) listener();
    },
  };
}

export function createGlossaryPlaygroundRoute(
  options: GlossaryPlaygroundRouteOptions
): RouteModule {
  const route: RouteModule = {
    mount({ target }) {
      let disposed = false;
      let externalModal: HTMLElement | undefined;
      const registry = createGlossaryRegistry({
        coreEntries: GLOSSARY_FIXTURE_ENTRIES,
        policy: createGlossaryValidationPolicy({ mode: "strict" }),
      });
      const binding = createLabGlossaryBinding({
        moduleId: "ode",
        registry,
        policy: createGlossaryValidationPolicy({ mode: "strict" }),
      });
      const context = createContextSource();
      const primaryScope = binding.createScope({
        id: GLOSSARY_FIXTURE_SCOPE_IDS.primary,
        context: context.source,
      });
      const formScope = binding.createScope({
        id: GLOSSARY_FIXTURE_SCOPE_IDS.form,
      });
      let replacementScope = binding.createScope({
        id: GLOSSARY_FIXTURE_SCOPE_IDS.replacement,
      });

      const root = document.createElement("section");
      root.className = "platform-page glossary-playground";
      const heading = document.createElement("h1");
      heading.tabIndex = -1;
      heading.dataset.routeFocus = "true";
      heading.textContent = "Glossary Playground";
      const warning = document.createElement("p");
      warning.className = "platform-card";
      const warningStrong = document.createElement("strong");
      warningStrong.textContent = GLOSSARY_DEVELOPMENT_WARNING;
      warning.append(warningStrong);
      const introduction = document.createElement("p");
      introduction.textContent =
        "Use these neutral fixtures to inspect shared preview, card, sheet, lifecycle, and accessibility behavior.";
      root.append(heading, warning, introduction);

      const fixtureSection = document.createElement("section");
      fixtureSection.className = "platform-card";
      const fixtureHeading = document.createElement("h2");
      fixtureHeading.textContent = "Surface fixtures";
      const sampleLine = document.createElement("p");
      sampleLine.append("Primary fixture: ");
      appendInteractiveTerm(
        sampleLine,
        primaryScope,
        GLOSSARY_FIXTURE_IDS.sample,
        "Sample parameter"
      );
      sampleLine.append(". Duplicate in the same scope: ");
      const duplicate = primaryScope.createTerm({
        termId: GLOSSARY_FIXTURE_IDS.sample,
        display: "Sample parameter",
      });
      const duplicateWrapper = document.createElement("span");
      duplicateWrapper.dataset.sampleDuplicate = "";
      duplicateWrapper.append(duplicate.node);
      sampleLine.append(duplicateWrapper, ".");

      const dynamicLine = document.createElement("p");
      dynamicLine.append("Live fixture: ");
      appendInteractiveTerm(
        dynamicLine,
        primaryScope,
        GLOSSARY_FIXTURE_IDS.dynamic,
        "Changing context"
      );
      const updateContext = document.createElement("button");
      updateContext.type = "button";
      updateContext.className = "btn ghost";
      updateContext.dataset.updateGlossaryContext = "";
      updateContext.textContent = "Update dynamic context";
      const preserveOpenSurface = (event: PointerEvent): void => {
        event.stopPropagation();
      };
      updateContext.addEventListener("pointerdown", preserveOpenSurface);
      updateContext.addEventListener("click", context.update);

      const formulaLine = document.createElement("p");
      formulaLine.append("Readonly display fixture: ");
      appendInteractiveTerm(
        formulaLine,
        primaryScope,
        GLOSSARY_FIXTURE_IDS.formula,
        "Formula example"
      );
      fixtureSection.append(
        fixtureHeading,
        sampleLine,
        dynamicLine,
        updateContext,
        formulaLine
      );

      const formSection = document.createElement("section");
      formSection.className = "platform-card";
      const formHeading = document.createElement("h2");
      formHeading.textContent = "Educational label composition";
      const inputId = `glossary-fixture-input-${++fixtureInputSequence}`;
      const nativeLabel = document.createElement("label");
      nativeLabel.className = "sr-only";
      nativeLabel.htmlFor = inputId;
      nativeLabel.textContent = "Fixture input value";
      const visibleLabel = document.createElement("p");
      visibleLabel.append("Related ");
      appendInteractiveTerm(
        visibleLabel,
        formScope,
        GLOSSARY_FIXTURE_IDS.label,
        "Input concept"
      );
      visibleLabel.append(":");
      const input = document.createElement("input");
      input.id = inputId;
      input.dataset.glossaryFixtureInput = "";
      input.setAttribute(
        "aria-describedby",
        "glossary-fixture-help glossary-fixture-error"
      );
      const help = document.createElement("p");
      help.id = "glossary-fixture-help";
      help.textContent = "Development-only help text.";
      const error = document.createElement("p");
      error.id = "glossary-fixture-error";
      error.textContent = "Development-only error relationship.";
      formSection.append(formHeading, nativeLabel, visibleLabel, input, help, error);

      const replacementSection = document.createElement("section");
      replacementSection.className = "platform-card";
      const replacementHeading = document.createElement("h2");
      replacementHeading.textContent = "Explicit replacement transaction";
      const replacementContainer = document.createElement("p");
      replacementContainer.append("Current trigger: ");
      appendInteractiveTerm(
        replacementContainer,
        replacementScope,
        GLOSSARY_FIXTURE_IDS.replacement,
        "Replaceable term"
      );
      const replaceTrigger = document.createElement("button");
      replaceTrigger.type = "button";
      replaceTrigger.className = "btn ghost";
      replaceTrigger.dataset.replaceGlossaryTrigger = "";
      replaceTrigger.textContent = "Replace trigger";
      const onReplace = (): void => {
        const transaction = binding.beginScopeRerender({
          id: GLOSSARY_FIXTURE_SCOPE_IDS.replacement,
        });
        const nextContainer = document.createElement("p");
        nextContainer.append("Current trigger: ");
        appendInteractiveTerm(
          nextContainer,
          transaction.scope,
          GLOSSARY_FIXTURE_IDS.replacement,
          "Replaceable term"
        );
        replacementContainer.replaceWith(nextContainer);
        replacementScope = transaction.scope;
        transaction.commit();
      };
      replaceTrigger.addEventListener("pointerdown", preserveOpenSurface);
      replaceTrigger.addEventListener("click", onReplace);
      replacementSection.append(
        replacementHeading,
        replacementContainer,
        replaceTrigger
      );

      const arbitrationSection = document.createElement("section");
      arbitrationSection.className = "platform-card";
      const arbitrationHeading = document.createElement("h2");
      arbitrationHeading.textContent = "Modal and mock handoff";
      const externalOpen = document.createElement("button");
      externalOpen.type = "button";
      externalOpen.className = "btn ghost";
      externalOpen.dataset.openExternalModal = "";
      externalOpen.textContent = "Open external modal simulator";
      const backgroundControl = document.createElement("button");
      backgroundControl.type = "button";
      backgroundControl.className = "btn ghost";
      backgroundControl.dataset.backgroundControl = "";
      backgroundControl.textContent = "Background inert check";
      const mockStatus = document.createElement("p");
      mockStatus.dataset.mockTutorStatus = "";

      const closeExternalModal = (): void => {
        externalModal?.remove();
        externalModal = undefined;
      };
      const openExternalModal = (): void => {
        if (externalModal) return;
        const backdrop = document.createElement("div");
        backdrop.className = "new-experiment-backdrop";
        const dialog = document.createElement("section");
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-label", "External modal simulator");
        const text = document.createElement("p");
        text.textContent = "This development dialog blocks platform sheets.";
        const close = document.createElement("button");
        close.type = "button";
        close.className = "btn ghost";
        close.dataset.closeExternalModal = "";
        close.textContent = "Close simulator";
        close.addEventListener("click", closeExternalModal);
        dialog.append(text, close);
        backdrop.append(dialog);
        document.body.append(backdrop);
        externalModal = backdrop;
        close.focus();
      };
      externalOpen.addEventListener("click", openExternalModal);
      arbitrationSection.append(
        arbitrationHeading,
        externalOpen,
        backgroundControl,
        mockStatus
      );

      root.append(
        fixtureSection,
        formSection,
        replacementSection,
        arbitrationSection
      );
      target.replaceChildren(root);

      const tutorHandoff: GlossaryTutorHandoff = Object.freeze({
        async askTerm({
          request,
        }: Parameters<GlossaryTutorHandoff["askTerm"]>[0]) {
          options.onMockTutorRequest?.(String(request.termId));
          mockStatus.textContent = `Mock Tutor handoff: ${request.termId}`;
          return { status: "started" as const };
        },
      });
      options.glossaryHost.connect(binding, { tutorHandoff });

      return Object.freeze({
        dispose(): void {
          if (disposed) return;
          disposed = true;
          updateContext.removeEventListener("pointerdown", preserveOpenSurface);
          updateContext.removeEventListener("click", context.update);
          replaceTrigger.removeEventListener("pointerdown", preserveOpenSurface);
          replaceTrigger.removeEventListener("click", onReplace);
          externalOpen.removeEventListener("click", openExternalModal);
          options.glossaryHost.close({ restoreFocus: false });
          options.glossaryHost.disconnect();
          closeExternalModal();
          binding.dispose();
          target.replaceChildren();
        },
      });
    },
  };
  return Object.freeze(route);
}
