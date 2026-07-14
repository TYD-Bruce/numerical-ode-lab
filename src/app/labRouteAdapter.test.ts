// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import type {
  LabLifecycleCallbacks,
  LabRouteModule,
  LabSessionMetadata,
  LabTutorBinding,
  ResumeSummary,
} from "./contracts";
import { createAppSessionStore } from "./appSessionStore";
import { createCompleteLabRoute } from "./labRouteAdapter";
import type { PlatformTutorHost } from "./platformTutorHost";

const binding: LabTutorBinding<unknown> = {
  moduleId: "ode",
  promptProfile: "ode",
  suggestedQuestions: [],
  getContext: () => undefined,
};

function summary(timestamp = 0): ResumeSummary {
  return {
    moduleId: "ode",
    route: "/ode/initial-value-problems",
    labTitle: "Initial Value Problems Lab",
    stepLabel: "Data",
    lastMeaningfulInteraction: timestamp,
  };
}

function metadata(labMeaningful: boolean): LabSessionMetadata {
  return {
    labMeaningful,
    tutorMeaningful: false,
    meaningful: labMeaningful,
    resumeSummary: summary(),
  };
}

function host(): PlatformTutorHost {
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    open: vi.fn(async () => undefined),
    close: vi.fn(),
    closeMobileForNavigation: vi.fn(),
    dispose: vi.fn(),
  };
}

describe("complete Lab meaningful metadata", () => {
  it("maintains activity through core updates without reordering on presentation, remount, or disposal", () => {
    let lifecycle: LabLifecycleCallbacks<{ value: string }> | undefined;
    let current = { value: "starter" };
    const module: LabRouteModule<{ value: string }> = {
      createBeginnerStarterSession: () => current,
      mount(options) {
        lifecycle = options.lifecycle;
        current = options.session;
        options.lifecycle?.updateSession(current, metadata(false));
        return {
          getSession: () => current,
          getResumeSummary: () => summary(),
          getTutorBinding: () => binding,
          dispose: vi.fn(),
        };
      },
    };
    const store = createAppSessionStore();
    const route = createCompleteLabRoute({
      moduleId: "ode",
      labModule: module,
      store,
      tutorHost: host(),
    });
    const target = document.createElement("div");
    const mounted = route.mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/ode/initial-value-problems",
        search: "",
        hash: "",
      },
    });

    current = { value: "edited" };
    lifecycle?.recordMeaningfulInteraction?.(125);
    lifecycle?.updateSession(current, metadata(true));
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(125);
    expect(store.getResumeSummaries()[0]?.lastMeaningfulInteraction).toBe(125);

    lifecycle?.updateSession(current, metadata(true));
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(125);
    mounted.dispose();
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(125);
  });
});
