import type { LabModuleId } from "../app/contracts";
import {
  copyGlossaryTermDisplay,
  readableGlossaryDisplay,
  type GlossaryDiagnosticSink,
  validateTermId,
} from "./glossaryBuilders";
import type { GlossaryRegistry } from "./glossaryRegistry";
import type {
  GlossaryBindingIdentity,
  GlossaryHostPort,
  GlossaryOpenIntent,
  GlossaryScopeContextSource,
  GlossaryScopeController,
  GlossaryScopeId,
  GlossaryScopeIdentity,
  GlossarySurfaceRequest,
  GlossaryTermDisplay,
  GlossaryTermIdentity,
  GlossaryTermRenderResult,
  GlossaryTermId,
} from "./glossaryRuntimeTypes";

export interface InternalGlossaryScope {
  readonly controller: GlossaryScopeController;
  readonly identity: GlossaryScopeIdentity;
  findTermIdentity(termId: string): GlossaryTermIdentity | undefined;
  disposeForReplacement(): void;
  disposeWithoutNotification(): void;
}

export function createGlossaryScope(options: {
  readonly moduleId: LabModuleId;
  readonly binding: GlossaryBindingIdentity;
  readonly id: GlossaryScopeId;
  readonly generation: number;
  readonly registry: GlossaryRegistry;
  readonly context?: GlossaryScopeContextSource;
  readonly diagnostics: GlossaryDiagnosticSink;
  readonly getPort: () => GlossaryHostPort | undefined;
  readonly onDisposed: (scope: InternalGlossaryScope) => void;
}): InternalGlossaryScope {
  const identity: GlossaryScopeIdentity = Object.freeze({
    binding: options.binding,
    moduleId: options.moduleId,
    scopeId: options.id,
    generation: options.generation,
  });
  const enhanced = new Set<string>();
  const terms = new Map<string, GlossaryTermIdentity>();
  const disposeTerms = new Set<(notifyPort: boolean) => void>();
  const termResolver = Object.freeze({
    resolve: (termId: GlossaryTermId) =>
      options.registry.resolveById(options.moduleId, termId),
  });
  let disposed = false;
  let context = options.context;

  const disposeInternal = (
    notifyScope: boolean,
    notifyTerms: boolean
  ): void => {
    if (disposed) return;
    disposed = true;
    for (const disposeTerm of [...disposeTerms]) disposeTerm(notifyTerms);
    disposeTerms.clear();
    enhanced.clear();
    terms.clear();
    context = undefined;
    options.onDisposed(internal);
    if (notifyScope) options.getPort()?.scopeDisposed(identity);
  };

  const controller: GlossaryScopeController = Object.freeze({
    id: options.id,
    createTerm(termOptions: {
      readonly termId: GlossaryTermId;
      readonly display: GlossaryTermDisplay;
    }): GlossaryTermRenderResult {
      if (disposed) {
        options.diagnostics.reject({
          code: "scope_disposed",
          scopeId: options.id,
          termId: String(termOptions.termId),
        });
        return plainText(termOptions.display);
      }

      const validTermId = validateTermId(
        termOptions.termId,
        options.diagnostics
      );
      const display = copyGlossaryTermDisplay(
        termOptions.display,
        options.diagnostics,
        {
          termId: String(termOptions.termId),
          scopeId: options.id,
        }
      );
      if (validTermId === undefined || display === undefined) {
        return plainText(termOptions.display);
      }

      const resolution = options.registry.resolve(
        options.moduleId,
        validTermId,
        display
      );
      if (resolution.kind === "invalid") {
        return plainText(termOptions.display);
      }
      if (enhanced.has(validTermId)) return plainText(display);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "glossary-term-trigger";
      button.textContent = readableGlossaryDisplay(display);

      const termIdentity: GlossaryTermIdentity = Object.freeze({
        binding: options.binding,
        scope: identity,
        moduleId: options.moduleId,
        scopeId: options.id,
        termId: validTermId,
        scopeGeneration: options.generation,
        trigger: button,
      });
      let termDisposed = false;
      let lastPointer: "mouse" | "touch" | undefined;
      let lastRequest: GlossarySurfaceRequest | undefined;

      const requestOpen = (intent: GlossaryOpenIntent): void => {
        if (termDisposed || disposed) return;
        const port = options.getPort();
        if (!port) return;
        const request: GlossarySurfaceRequest = Object.freeze({
          identity: termIdentity,
          moduleId: options.moduleId,
          scopeId: options.id,
          termId: validTermId,
          trigger: button,
          display,
          entry: resolution.entry,
          termResolver,
          ...(context === undefined ? {} : { context }),
          intent: Object.freeze(intent),
          scopeGeneration: options.generation,
        });
        lastRequest = request;
        port.requestOpen(request);
      };
      const onPointerEnter = (): void => requestOpen({ kind: "hover" });
      const onFocus = (): void => requestOpen({ kind: "keyboard-focus" });
      const onPointerDown = (event: Event): void => {
        const pointerType = (event as PointerEvent).pointerType;
        lastPointer = pointerType === "touch" ? "touch" : "mouse";
      };
      const onClick = (event: MouseEvent): void => {
        const pointer =
          lastPointer ?? (event.detail === 0 ? "keyboard" : "mouse");
        lastPointer = undefined;
        requestOpen({ kind: "activate", pointer });
      };

      button.addEventListener("pointerenter", onPointerEnter);
      button.addEventListener("focus", onFocus);
      button.addEventListener("pointerdown", onPointerDown);
      button.addEventListener("click", onClick);

      const disposeTerm = (notifyPort: boolean): void => {
        if (termDisposed) return;
        termDisposed = true;
        button.removeEventListener("pointerenter", onPointerEnter);
        button.removeEventListener("focus", onFocus);
        button.removeEventListener("pointerdown", onPointerDown);
        button.removeEventListener("click", onClick);
        button.removeAttribute("aria-controls");
        button.removeAttribute("aria-expanded");
        button.classList.remove("glossary-term-trigger-active");
        disposeTerms.delete(disposeTerm);
        if (terms.get(validTermId) === termIdentity) {
          terms.delete(validTermId);
        }
        if (notifyPort && lastRequest) {
          options.getPort()?.requestClose(lastRequest);
        }
        lastRequest = undefined;
      };

      enhanced.add(validTermId);
      terms.set(validTermId, termIdentity);
      disposeTerms.add(disposeTerm);

      return Object.freeze({
        kind: "interactive",
        node: button,
        dispose: () => disposeTerm(true),
      });
    },
    dispose(): void {
      disposeInternal(true, true);
    },
  });

  const internal: InternalGlossaryScope = {
    controller,
    identity,
    findTermIdentity(termId): GlossaryTermIdentity | undefined {
      return terms.get(termId);
    },
    disposeForReplacement(): void {
      disposeInternal(false, false);
    },
    disposeWithoutNotification(): void {
      disposeInternal(false, false);
    },
  };
  return internal;
}

export function createDisabledGlossaryScope(
  id: GlossaryScopeId,
  diagnostics: GlossaryDiagnosticSink,
  initiallyDisposed = false
): GlossaryScopeController {
  let disposed = initiallyDisposed;
  return Object.freeze({
    id,
    createTerm(options: {
      readonly termId: GlossaryTermId;
      readonly display: GlossaryTermDisplay;
    }): GlossaryTermRenderResult {
      if (disposed) {
        diagnostics.reject({
          code: "scope_disposed",
          scopeId: id,
          termId: String(options.termId),
        });
      }
      return plainText(options.display);
    },
    dispose(): void {
      disposed = true;
    },
  });
}

function plainText(display: GlossaryTermDisplay): GlossaryTermRenderResult {
  return Object.freeze({
    kind: "plain-text",
    node: document.createTextNode(readableGlossaryDisplay(display)),
  });
}
