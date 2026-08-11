// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { createAppSessionStore } from "./appSessionStore";
import type { LabModuleId, LabSessionMetadata, ResumeSummary } from "./contracts";
import {
  appendTutorMessage,
  clearTutorConversation,
  setTutorDesktopOpen,
  updateTutorDraft,
} from "../tutor/moduleTutorSession";

function summary(moduleId: LabModuleId, timestamp = 0): ResumeSummary {
  return {
    moduleId,
    route: moduleId === "ode" ? "/ode/initial-value-problems" : `/${moduleId}`,
    labTitle: `${moduleId} Lab`,
    stepLabel: "Method",
    lastMeaningfulInteraction: timestamp,
  };
}

function labMetadata(options: {
  moduleId?: LabModuleId;
  labMeaningful?: boolean;
  timestamp?: number;
} = {}): LabSessionMetadata {
  const labMeaningful = options.labMeaningful ?? false;
  return {
    labMeaningful,
    tutorMeaningful: false,
    meaningful: labMeaningful,
    resumeSummary: summary(options.moduleId ?? "ode"),
    ...(options.timestamp === undefined
      ? {}
      : { lastMeaningfulInteraction: options.timestamp }),
  };
}

describe("maintained meaningful work", () => {
  it("keeps pristine, draft-only, open-state, and assistant-only Tutor state non-meaningful", () => {
    let now = 100;
    const store = createAppSessionStore({ now: () => now });
    store.setLab("ode", { pristine: true }, labMetadata());

    store.updateTutor("ode", (current) => updateTutorDraft(current, "unsent"));
    store.updateTutor("ode", (current) => setTutorDesktopOpen(current, true));
    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "assistant", "Welcome")
    );

    expect(store.hasMeaningfulWork()).toBe(false);
    expect(store.getResumeSummaries()).toEqual([]);
    expect(store.getLabMetadata("ode")).toMatchObject({
      labMeaningful: false,
      tutorMeaningful: false,
      meaningful: false,
    });
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBeUndefined();

    now = 200;
    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "user", "Explain the starter")
    );
    expect(store.getLabMetadata("ode")).toMatchObject({
      labMeaningful: false,
      tutorMeaningful: true,
      meaningful: true,
      lastMeaningfulInteraction: 200,
    });
    expect(Object.isFrozen(store.getLabMetadata("ode"))).toBe(true);
    expect(store.getResumeSummaries()[0]).toMatchObject({
      moduleId: "ode",
      lastMeaningfulInteraction: 200,
    });
  });

  it("timestamps each user submission but not assistant, draft, panel, clear, or passive Lab updates", () => {
    let now = 10;
    const store = createAppSessionStore({ now: () => now });
    const session = { value: "starter" };
    store.setLab("ode", session, labMetadata());

    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "user", "First")
    );
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(10);

    now = 20;
    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "assistant", "Answer")
    );
    store.updateTutor("ode", (current) => updateTutorDraft(current, "draft"));
    store.updateTutor("ode", (current) => setTutorDesktopOpen(current, true));
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(10);

    now = 30;
    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "user", "Second")
    );
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(30);

    store.setLab("ode", session, labMetadata());
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(30);

    now = 40;
    store.updateTutor("ode", clearTutorConversation);
    expect(store.hasMeaningfulWork()).toBe(false);
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(30);
    expect(store.getResumeSummaries()).toEqual([]);
  });

  it("combines Lab and Tutor contributions, sorts one safe summary per module, and applies limits last", () => {
    const store = createAppSessionStore();
    store.setLab(
      "ode",
      { value: 1 },
      labMetadata({ moduleId: "ode", labMeaningful: true, timestamp: 100 })
    );
    store.setLab(
      "linear_algebra",
      { value: 2 },
      labMetadata({
        moduleId: "linear_algebra",
        labMeaningful: true,
        timestamp: 300,
      })
    );
    store.setLab(
      "pde",
      { value: 3 },
      labMetadata({ moduleId: "pde", labMeaningful: true, timestamp: 200 })
    );

    const summaries = store.getResumeSummaries();
    expect(summaries.map((item) => item.moduleId)).toEqual([
      "linear_algebra",
      "pde",
      "ode",
    ]);
    expect(store.getResumeSummaries(2).map((item) => item.moduleId)).toEqual([
      "linear_algebra",
      "pde",
    ]);
    expect(Object.isFrozen(summaries)).toBe(true);
    expect(Object.isFrozen(summaries[0])).toBe(true);
  });

  it("keeps meaningful work but omits summaries without a valid activity timestamp", () => {
    const store = createAppSessionStore();
    store.setLab("ode", { value: 1 }, {
      ...labMetadata({ labMeaningful: true }),
      lastMeaningfulInteraction: Number.NaN,
    });

    expect(store.hasMeaningfulWork()).toBe(true);
    expect(store.getResumeSummaries()).toEqual([]);
  });
});
