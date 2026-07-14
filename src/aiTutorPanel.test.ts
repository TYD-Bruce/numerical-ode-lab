// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppSessionStore } from "./app/appSessionStore";
import type { LabTutorBinding } from "./app/contracts";
import type { ChatRequest } from "./aiTypes";
import type { OdeTutorSource } from "./ode/odeTutorBinding";
import { createReadonlySolverResult } from "./ode/odeSession";
import { mountPlatformTutorPanel } from "./tutor/platformTutorPanel";
import { appendTutorMessage } from "./tutor/moduleTutorSession";
import { appendNewExperimentDivider } from "./tutor/moduleTutorSession";

const RESULT = createReadonlySolverResult({
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
});

function source(): OdeTutorSource {
  return {
    enabled: true,
    result: RESULT,
    problem: {
      kind: "first_order",
      equationDisplay: "y' = -y",
      t0: 0,
      tEnd: 0.1,
      h: 0.1,
      y0: 1,
    },
  };
}

async function submit(host: HTMLElement, value: string): Promise<void> {
  const input = host.querySelector<HTMLTextAreaElement>("#platform-tutor-input")!;
  input.value = value;
  host.querySelector<HTMLFormElement>(".ai-compose")!.dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true })
  );
  await vi.waitFor(() => {
    expect(host.querySelector<HTMLButtonElement>(".ai-send")?.disabled).toBe(false);
  });
}

describe("shared Tutor panel", () => {
  beforeEach(() => document.body.replaceChildren());

  it("reads fresh binding context and live transcript for every message", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const store = createAppSessionStore();
    const access = store.createTutorSessionAccess("ode");
    let current = source();
    const requests: ChatRequest[] = [];
    const binding: LabTutorBinding<unknown> = {
      moduleId: "ode",
      promptProfile: "ode",
      suggestedQuestions: [],
      getContext: () => current,
    };
    const mounted = mountPlatformTutorPanel(host, {
      binding,
      sessionAccess: access,
      onClose: vi.fn(),
      isCurrent: () => true,
      sendMessage: async (request) => {
        requests.push(request);
        return { message: "Grounded reply." };
      },
    });

    await submit(host, "Before study");
    store.updateTutor("ode", (session) =>
      appendTutorMessage(session, "assistant", "External update")
    );
    current = { ...current };
    await submit(host, "After external update");

    expect(requests).toHaveLength(2);
    expect(requests[1]!.messages.map((item) => item.content)).toContain("External update");
    expect(store.getTutor("ode").items.map((item) => item.kind)).not.toContain("divider-only");
    mounted.dispose();
  });

  it("stores the user message before a request and ignores an aborted completion", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const store = createAppSessionStore();
    let resolve!: (value: { message: string }) => void;
    const response = new Promise<{ message: string }>((done) => { resolve = done; });
    const binding: LabTutorBinding<unknown> = {
      moduleId: "ode",
      promptProfile: "ode",
      suggestedQuestions: [],
      getContext: source,
    };
    const mounted = mountPlatformTutorPanel(host, {
      binding,
      sessionAccess: store.createTutorSessionAccess("ode"),
      onClose: vi.fn(),
      isCurrent: () => true,
      sendMessage: () => response,
    });
    const input = host.querySelector<HTMLTextAreaElement>("#platform-tutor-input")!;
    input.value = "Keep unmatched";
    host.querySelector<HTMLFormElement>(".ai-compose")!.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
    expect(store.getTutor("ode").items).toEqual([
      { kind: "message", role: "user", content: "Keep unmatched" },
    ]);
    mounted.dispose();
    resolve({ message: "Too late" });
    await response;
    await Promise.resolve();
    expect(store.getTutor("ode").items).toHaveLength(1);
  });

  it("keeps controlled user and assistant rendering non-executable", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const store = createAppSessionStore();
    const mounted = mountPlatformTutorPanel(host, {
      binding: {
        moduleId: "ode",
        promptProfile: "ode",
        suggestedQuestions: [],
        getContext: source,
      },
      sessionAccess: store.createTutorSessionAccess("ode"),
      onClose: vi.fn(),
      isCurrent: () => true,
      sendMessage: async () => ({ message: "Order is \\(p=1\\)." }),
    });
    await submit(host, "Literal <img onerror=alert(1)>");
    expect(host.querySelector("img")).toBeNull();
    expect(host.textContent).toContain("p=1");
    mounted.dispose();
  });

  it("renders experiment dividers semantically without submitting them", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const store = createAppSessionStore();
    store.updateTutor("ode", (session) =>
      appendNewExperimentDivider(session, {
        id: "experiment-2",
        body: "The starter state is ready.",
      })
    );
    let request: ChatRequest | undefined;
    const mounted = mountPlatformTutorPanel(host, {
      binding: {
        moduleId: "ode",
        promptProfile: "ode",
        suggestedQuestions: [],
        getContext: source,
      },
      sessionAccess: store.createTutorSessionAccess("ode"),
      onClose: vi.fn(),
      isCurrent: () => true,
      sendMessage: async (next) => {
        request = next;
        return { message: "New answer" };
      },
    });
    expect(host.querySelector(".ai-tutor-divider")?.textContent).toContain(
      "New experiment started"
    );
    await submit(host, "New question");
    expect(request?.messages).toEqual([{ role: "user", content: "New question" }]);
    mounted.dispose();
  });
});
