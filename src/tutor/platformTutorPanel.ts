import type {
  LabTutorBinding,
  TutorSessionAccess,
  TutorTranscriptItem,
} from "../app/contracts";
import type { ChatRequest, ChatResponse } from "../aiTypes";
import { buildOdeLabContext, isChartInstruction, sanitizeTutorText } from "../aiTutor";
import { getTutorConvergenceStudy } from "../convergenceTutor";
import { renderTutorMessageContent } from "../math/ui/tutorMath";
import type { OdeTutorSource } from "../ode/odeTutorBinding";
import {
  appendTutorMessage,
  clearTutorConversation,
  messagesForTutorRequest,
  updateTutorDraft,
} from "./moduleTutorSession";
import { sendTutorMessage } from "./tutorClient";
import "./tutor.css";

export interface PlatformTutorPanelOptions {
  readonly binding: LabTutorBinding<unknown>;
  readonly sessionAccess: TutorSessionAccess;
  readonly onClose: () => void;
  readonly isCurrent: () => boolean;
  readonly sendMessage?: (
    request: ChatRequest,
    signal: AbortSignal
  ) => Promise<ChatResponse>;
}

export interface MountedPlatformTutorPanel {
  dispose(): void;
  focus(): void;
  refresh?(): void;
  cancelPending?(): void;
}

function renderTranscript(
  container: HTMLElement,
  items: readonly TutorTranscriptItem[]
): void {
  container.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "ai-tutor-empty";
    empty.textContent = "Ask a question about this run, method, or plot.";
    container.append(empty);
    return;
  }
  for (const transcriptItem of items) {
    if (transcriptItem.kind === "divider") {
      const divider = document.createElement("section");
      divider.className = "ai-tutor-divider";
      divider.setAttribute("aria-label", transcriptItem.title);
      const title = document.createElement("strong");
      title.textContent = transcriptItem.title;
      const body = document.createElement("p");
      body.textContent = transcriptItem.body;
      divider.append(title, body);
      container.append(divider);
      continue;
    }
    const item = document.createElement("div");
    item.className = `ai-msg ${transcriptItem.role === "user" ? "ai-msg-user" : "ai-msg-assistant"}`;
    const role = document.createElement("span");
    role.className = "ai-msg-role";
    role.textContent = transcriptItem.role === "user" ? "You" : "Tutor";
    const body = document.createElement("div");
    body.className = "ai-msg-body";
    item.append(role, body);
    container.append(item);
    renderTutorMessageContent(body, {
      role: transcriptItem.role,
      content:
        transcriptItem.role === "assistant"
          ? sanitizeTutorText(transcriptItem.content)
          : transcriptItem.content,
    });
  }
  container.scrollTop = container.scrollHeight;
}

function odeRequestContext(binding: LabTutorBinding<unknown>) {
  if (binding.promptProfile !== "ode") return undefined;
  const source = binding.getContext() as OdeTutorSource | undefined;
  if (!source?.enabled || !source.result || !source.problem) return undefined;
  return buildOdeLabContext(
    source.result as never,
    source.problem,
    getTutorConvergenceStudy(source.convergenceState)
  );
}

export function mountPlatformTutorPanel(
  target: HTMLElement,
  options: PlatformTutorPanelOptions
): MountedPlatformTutorPanel {
  let disposed = false;
  let requestGeneration = 0;
  let requestController: AbortController | undefined;
  let refresh = (): void => undefined;
  let cancelPending = (): void => undefined;
  const bindingIdentity = options.binding;
  const moduleId = options.sessionAccess.moduleId;

  target.innerHTML = `
    <aside class="ai-tutor-panel" aria-label="AI Method Tutor">
      <header class="ai-tutor-header">
        <div class="ai-tutor-title-row">
          <h3>AI Method Tutor</h3>
          <span class="ai-demo-badge" data-tutor-demo hidden>Demo mode</span>
          <button type="button" class="btn ghost ai-tutor-close" data-tutor-close aria-label="Close AI Tutor">Close</button>
        </div>
        <p class="ai-tutor-sub">Ask about the method, variables, coefficients, stability, accuracy, or graph behavior.</p>
      </header>
      <div class="ai-tutor-content" data-tutor-content></div>
    </aside>`;

  const content = target.querySelector<HTMLElement>("[data-tutor-content]")!;
  const source = options.binding.getContext() as OdeTutorSource | undefined;
  if (!source?.enabled) {
    const unavailable = document.createElement("p");
    unavailable.className = "ai-tutor-disabled";
    unavailable.textContent =
      source && !source.enabled
        ? "Tutor is unavailable for comparison output. Run one method to ask about its result."
        : "Run a method first, then ask the AI Tutor about the result.";
    content.append(unavailable);
  } else {
    const suggestions = document.createElement("div");
    suggestions.className = "ai-suggestions";
    suggestions.setAttribute("role", "group");
    suggestions.setAttribute("aria-label", "Suggested questions");
    options.binding.suggestedQuestions.forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ai-suggest-btn";
      button.textContent = question;
      button.dataset.tutorSuggestion = question;
      suggestions.append(button);
    });
    const messages = document.createElement("div");
    messages.className = "ai-messages";
    messages.setAttribute("role", "log");
    messages.setAttribute("aria-label", "Tutor conversation");
    messages.setAttribute("aria-live", "polite");
    const error = document.createElement("p");
    error.className = "ai-error";
    error.hidden = true;
    error.setAttribute("role", "alert");
    const form = document.createElement("form");
    form.className = "ai-compose";
    const label = document.createElement("label");
    label.className = "sr-only";
    label.htmlFor = "platform-tutor-input";
    label.textContent = "Message";
    const input = document.createElement("textarea");
    input.id = "platform-tutor-input";
    input.rows = 2;
    input.required = true;
    input.placeholder = "Ask about this result…";
    input.value = options.sessionAccess.getSession().draftMessage;
    const actions = document.createElement("div");
    actions.className = "ai-compose-actions";
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "btn ghost ai-clear";
    clear.textContent = "Clear chat";
    const send = document.createElement("button");
    send.type = "submit";
    send.className = "btn primary ai-send";
    send.textContent = "Send";
    actions.append(clear, send);
    form.append(label, input, actions);
    content.append(suggestions, messages, error, form);

    const render = (): void => {
      if (disposed || !options.isCurrent()) return;
      renderTranscript(messages, options.sessionAccess.getSession().items);
      if (document.activeElement !== input) {
        input.value = options.sessionAccess.getSession().draftMessage;
      }
    };
    refresh = render;
    const setLoading = (loading: boolean): void => {
      if (disposed) return;
      send.disabled = loading;
      input.disabled = loading;
      send.textContent = loading ? "Thinking…" : "Send";
      target.classList.toggle("ai-loading", loading);
    };
    cancelPending = (): void => {
      requestGeneration += 1;
      requestController?.abort();
      requestController = undefined;
      error.hidden = true;
      setLoading(false);
    };
    const submit = async (text: string): Promise<void> => {
      const trimmed = text.trim();
      if (!trimmed || disposed || !options.isCurrent()) return;
      error.hidden = true;
      options.sessionAccess.updateSession((current) =>
        updateTutorDraft(appendTutorMessage(current, "user", trimmed), "")
      );
      input.value = "";
      render();
      requestController?.abort();
      const controller = new AbortController();
      requestController = controller;
      const request = ++requestGeneration;
      const context = odeRequestContext(options.binding);
      if (!context) return;
      setLoading(true);
      try {
        const response = await (options.sendMessage ?? sendTutorMessage)(
          { messages: messagesForTutorRequest(options.sessionAccess.getSession()), context },
          controller.signal
        );
        if (
          disposed ||
          controller.signal.aborted ||
          request !== requestGeneration ||
          !options.isCurrent() ||
          bindingIdentity !== options.binding ||
          moduleId !== options.sessionAccess.moduleId
        ) return;
        options.sessionAccess.updateSession((current) =>
          appendTutorMessage(current, "assistant", sanitizeTutorText(response.message))
        );
        target.querySelector<HTMLElement>("[data-tutor-demo]")!.hidden = !response.demoMode;
        render();
        if (response.chartInstruction && isChartInstruction(response.chartInstruction)) {
          options.binding.applyChartInstruction?.(response.chartInstruction);
        }
      } catch (cause) {
        if (disposed || controller.signal.aborted || request !== requestGeneration || !options.isCurrent()) return;
        error.textContent = cause instanceof Error ? cause.message : String(cause);
        error.hidden = false;
      } finally {
        if (!disposed && request === requestGeneration && options.isCurrent()) {
          setLoading(false);
          input.focus();
        }
      }
    };

    input.addEventListener("input", () => {
      options.sessionAccess.updateSession((current) => updateTutorDraft(current, input.value));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      void submit(input.value);
    });
    clear.addEventListener("click", () => {
      requestController?.abort();
      requestGeneration += 1;
      options.sessionAccess.updateSession(clearTutorConversation);
      error.hidden = true;
      render();
      input.focus();
    });
    suggestions.addEventListener("click", (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-tutor-suggestion]");
      if (button) void submit(button.dataset.tutorSuggestion ?? "");
    });
    render();
  }

  target.querySelector<HTMLButtonElement>("[data-tutor-close]")!.addEventListener(
    "click",
    options.onClose
  );

  return Object.freeze({
    dispose(): void {
      if (disposed) return;
      disposed = true;
      requestGeneration += 1;
      requestController?.abort();
      requestController = undefined;
      target.replaceChildren();
    },
    focus(): void {
      target.querySelector<HTMLElement>("textarea, button")?.focus();
    },
    refresh(): void {
      refresh();
    },
    cancelPending(): void {
      cancelPending();
    },
  });
}

export type TutorPanelModule = Pick<
  typeof import("./platformTutorPanel"),
  "mountPlatformTutorPanel"
>;
