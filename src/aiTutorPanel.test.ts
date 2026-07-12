// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatRequest, TutorConvergenceStudy } from "./aiTypes";
import { mountAiTutorPanel, resetTutorConversation } from "./aiTutorPanel";
import { METHOD_CATALOG } from "./methodCatalog";
import type { SolverResult } from "./solvers";

const RESULT: SolverResult = {
  points: [
    { t: 0, y: 1 },
    { t: 0.1, y: 0.9 },
  ],
  metadata: {
    family: "forward_euler",
    displayName: "Forward Euler",
    order: 1,
    isImplicit: false,
    formulaType: "one-step-explicit",
    formulaDisplay: "u next = u + h f",
    notes: [],
  },
};

const STUDY: TutorConvergenceStudy = {
  theoreticalOrder: 1,
  interpretation: {
    kind: "consistent_with_theory",
    title: "Consistent with theory",
    explanation: "The recent orders are stable.",
    primaryObservedOrder: 0.99,
    evidencePairs: [[1, 2]],
  },
  levels: [
    {
      level: 0,
      h: 0.1,
      finalTimeError: 0.01,
      maximumGlobalError: 0.02,
    },
  ],
  consistencyCheck: {
    status: "passed",
    statement: "This is a numerical consistency check, not a formal proof.",
  },
};

async function submit(host: HTMLElement, value: string): Promise<void> {
  const input = host.querySelector<HTMLTextAreaElement>("#ai-input")!;
  input.value = value;
  host.querySelector<HTMLFormElement>("#ai-compose")!.dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );
  await vi.waitFor(() => {
    expect(host.querySelector<HTMLButtonElement>("#ai-send")?.disabled).toBe(false);
  });
}

describe("AI Tutor per-message convergence context", () => {
  beforeEach(() => resetTutorConversation());

  it("reads the getter for every question instead of retaining mount-time state", async () => {
    const host = document.createElement("div");
    document.body.replaceChildren(host);
    let current: TutorConvergenceStudy | undefined;
    const requests: ChatRequest[] = [];
    mountAiTutorPanel(host, {
      enabled: true,
      result: RESULT,
      meta: METHOD_CATALOG.find((item) => item.family === "forward_euler")!,
      problem: {
        kind: "first_order",
        equationDisplay: "y′ = -y",
        t0: 0,
        tEnd: 0.1,
        h: 0.1,
        y0: 1,
      },
      getChart: () => null,
      getConvergenceStudy: () => current,
      sendMessage: async (request) => {
        requests.push(request);
        return { message: "Grounded reply." };
      },
    });

    await submit(host, "Before study");
    current = STUDY;
    await submit(host, "After study");
    current = undefined;
    await submit(host, "After stale");

    expect(requests).toHaveLength(3);
    expect(requests[0]!.context.convergenceStudy).toBeUndefined();
    expect(requests[1]!.context.convergenceStudy).toEqual(STUDY);
    expect(requests[2]!.context.convergenceStudy).toBeUndefined();
  });

  it("keeps user-entered delimiters plain while controlled assistant math remains safe", async () => {
    const host = document.createElement("div");
    document.body.replaceChildren(host);
    mountAiTutorPanel(host, {
      enabled: true,
      result: RESULT,
      meta: METHOD_CATALOG.find((item) => item.family === "forward_euler")!,
      problem: {
        kind: "first_order",
        equationDisplay: "y′ = -y",
        t0: 0,
        tEnd: 0.1,
        h: 0.1,
        y0: 1,
      },
      getChart: () => null,
      sendMessage: async () => ({ message: "Order is \\(p=1\\)." }),
    });

    await submit(host, "Literal \\(user math\\) <img onerror=alert(1)>");
    const messages = host.querySelectorAll(".ai-msg-body");
    expect(messages[0]!.textContent).toContain("\\(user math\\)");
    expect(messages[0]!.querySelector("img")).toBeNull();
    expect(messages[1]!.textContent).toContain("p=1");
    expect(messages[1]!.querySelector("img")).toBeNull();
  });
});
