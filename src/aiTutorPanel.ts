import type { Chart } from "chart.js";
import type { MethodCatalogEntry } from "./methodCatalog";
import type { SolverResult } from "./solvers";
import {
  buildOdeLabContext,
  sanitizeTutorText,
  sendChatMessage,
  SUGGESTED_QUESTIONS,
  isChartInstruction,
  type ProblemInputs,
  type TutorMessage,
} from "./aiTutor";
import type { ChartInstruction } from "./aiTypes";
import { escapeHtml } from "./mathDisplay";

export interface AiTutorPanelOptions {
  enabled: boolean;
  result: SolverResult | null;
  meta: MethodCatalogEntry | null;
  problem: ProblemInputs | null;
  getChart: () => Chart | null;
  onChartInstruction?: (instruction: ChartInstruction) => void;
}

let conversation: TutorMessage[] = [];

export function resetTutorConversation(): void {
  conversation = [];
}

function renderMessages(container: HTMLElement): void {
  if (conversation.length === 0) {
    container.innerHTML =
      '<p class="ai-tutor-empty">Ask a question about this run, method, or plot.</p>';
    return;
  }
  container.innerHTML = conversation
    .map((m) => {
      const role = m.role === "user" ? "You" : "Tutor";
      const cls = m.role === "user" ? "ai-msg-user" : "ai-msg-assistant";
      const body = escapeHtml(sanitizeTutorText(m.content)).replace(
        /\n/g,
        "<br>"
      );
      return `<div class="ai-msg ${cls}"><span class="ai-msg-role">${role}</span><div class="ai-msg-body">${body}</div></div>`;
    })
    .join("");
  container.scrollTop = container.scrollHeight;
}

export function mountAiTutorPanel(
  host: HTMLElement,
  options: AiTutorPanelOptions
): void {
  const { enabled, result, meta, problem, getChart } = options;

  host.innerHTML = `
    <aside class="ai-tutor-panel" aria-label="AI Method Tutor">
      <header class="ai-tutor-header">
        <h3>AI Method Tutor</h3>
        <p class="ai-tutor-sub">Ask about the method, variables, coefficients, stability, accuracy, or graph behavior.</p>
      </header>
      ${
        !enabled
          ? `<p class="ai-tutor-disabled">Run a method first, then ask the AI tutor about the result.</p>`
          : `
      <div class="ai-suggestions" role="group" aria-label="Suggested questions">
        ${SUGGESTED_QUESTIONS.map(
          (q, i) =>
            `<button type="button" class="ai-suggest-btn" data-suggest-idx="${i}">${escapeHtml(q)}</button>`
        ).join("")}
      </div>
      <div class="ai-messages" id="ai-messages" aria-live="polite"></div>
      <p class="ai-error" id="ai-error" hidden role="alert"></p>
      <form class="ai-compose" id="ai-compose">
        <label class="sr-only" for="ai-input">Message</label>
        <textarea id="ai-input" rows="2" placeholder="Ask about this result…" required></textarea>
        <div class="ai-compose-actions">
          <button type="button" class="btn ghost ai-clear" id="ai-clear">Clear chat</button>
          <button type="submit" class="btn primary ai-send" id="ai-send">Send</button>
        </div>
      </form>
      `
      }
    </aside>
  `;

  if (!enabled || !result || !meta || !problem) return;

  const messagesEl = host.querySelector<HTMLDivElement>("#ai-messages")!;
  const errEl = host.querySelector<HTMLParagraphElement>("#ai-error")!;
  const form = host.querySelector<HTMLFormElement>("#ai-compose")!;
  const input = host.querySelector<HTMLTextAreaElement>("#ai-input")!;
  const sendBtn = host.querySelector<HTMLButtonElement>("#ai-send")!;
  const clearBtn = host.querySelector<HTMLButtonElement>("#ai-clear")!;

  renderMessages(messagesEl);

  const setLoading = (on: boolean): void => {
    sendBtn.disabled = on;
    input.disabled = on;
    sendBtn.textContent = on ? "Thinking…" : "Send";
    host.classList.toggle("ai-loading", on);
  };

  const applyChartInstruction = (instruction: ChartInstruction): void => {
    if (options.onChartInstruction) {
      options.onChartInstruction(instruction);
      return;
    }
    const chart = getChart();
    if (!chart || instruction.type === "none") return;

    if (instruction.type === "zoom_range") {
      if (instruction.tMin !== undefined) {
        chart.options.scales = chart.options.scales ?? {};
        const x = (chart.options.scales as { x?: { min?: number; max?: number } }).x ?? {};
        x.min = instruction.tMin;
        if (instruction.tMax !== undefined) x.max = instruction.tMax;
        (chart.options.scales as { x: typeof x }).x = x;
      } else if (instruction.tMax !== undefined) {
        chart.options.scales = chart.options.scales ?? {};
        const x = (chart.options.scales as { x?: { max?: number } }).x ?? {};
        x.max = instruction.tMax;
        (chart.options.scales as { x: typeof x }).x = x;
      }
      if (instruction.title) {
        chart.options.plugins = chart.options.plugins ?? {};
        const title = (chart.options.plugins as { title?: { text?: string } }).title ?? {};
        title.text = instruction.title;
        (chart.options.plugins as { title: typeof title }).title = title;
      }
      chart.update();
      return;
    }

    if (instruction.type === "line_chart") {
      for (const ds of chart.data.datasets) {
        if (instruction.includePoints !== undefined && ds.type === "line") {
          ds.pointRadius = instruction.includePoints ? 3 : 0;
        }
      }
      chart.update();
    }
  };

  async function submitMessage(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || !result || !meta || !problem) return;

    errEl.hidden = true;
    conversation.push({ role: "user", content: trimmed });
    renderMessages(messagesEl);
    input.value = "";
    setLoading(true);

    try {
      const context = buildOdeLabContext(result, problem);
      const response = await sendChatMessage({
        messages: conversation,
        context,
      });
      const answer = sanitizeTutorText(response.message);
      conversation.push({ role: "assistant", content: answer });
      renderMessages(messagesEl);

      if (response.chartInstruction && isChartInstruction(response.chartInstruction)) {
        applyChartInstruction(response.chartInstruction);
      }
    } catch (e) {
      errEl.textContent = e instanceof Error ? e.message : String(e);
      errEl.hidden = false;
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    void submitMessage(input.value);
  });

  clearBtn.addEventListener("click", () => {
    conversation = [];
    errEl.hidden = true;
    renderMessages(messagesEl);
    input.focus();
  });

  host.querySelectorAll<HTMLButtonElement>("[data-suggest-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-suggest-idx"));
      const q = SUGGESTED_QUESTIONS[idx] ?? "";
      input.value = q;
      void submitMessage(q);
    });
  });
}
