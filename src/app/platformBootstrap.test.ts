// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  LabRouteModule,
  LabTutorBinding,
} from "./contracts";
import { createAppSessionStore } from "./appSessionStore";
import type { PlatformTutorHost } from "./platformTutorHost";
import { createPlatformBootstrap } from "./platformBootstrap";
import { appendTutorMessage, updateTutorDraft } from "../tutor/moduleTutorSession";

interface TestLabSession {
  readonly value: string;
}

const TEST_BINDING: LabTutorBinding<unknown> = {
  moduleId: "ode",
  promptProfile: "ode",
  suggestedQuestions: [],
  getContext: () => ({ enabled: false }),
};

function testLabModule(options: {
  mountedSessions?: TestLabSession[];
  events?: string[];
} = {}): LabRouteModule<TestLabSession> {
  return {
    createBeginnerStarterSession: () => ({ value: "beginner-starter" }),
    mount({ target, session, lifecycle }) {
      let current = session;
      options.mountedSessions?.push(session);
      const heading = document.createElement("h1");
      heading.tabIndex = -1;
      heading.dataset.routeFocus = "true";
      heading.textContent = "Initial Value Problems Lab";
      const value = document.createElement("p");
      value.dataset.testLabValue = "";
      value.textContent = current.value;
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.testLabEdit = "";
      edit.textContent = "Edit test Lab";
      edit.addEventListener("click", () => {
        current = { value: "edited-session" };
        value.textContent = current.value;
        lifecycle?.recordMeaningfulInteraction?.(100);
        lifecycle?.updateSession(current, {
          labMeaningful: true,
          tutorMeaningful: false,
          meaningful: true,
          resumeSummary: {
            moduleId: "ode",
            route: "/ode/initial-value-problems",
            labTitle: "Initial Value Problems Lab",
            stepLabel: "Data",
            lastMeaningfulInteraction: 0,
          },
        });
      });
      target.replaceChildren(heading, value, edit);
      return {
        getSession: () => current,
        getResumeSummary: () => ({
          moduleId: "ode",
          route: "/ode/initial-value-problems",
          labTitle: "Initial Value Problems Lab",
          stepLabel: current.value === "edited-session" ? "Data" : "Method",
          lastMeaningfulInteraction: 0,
        }),
        getTutorBinding: () => TEST_BINDING,
        dispose: () => {
          options.events?.push("lab-dispose");
          target.replaceChildren();
        },
      };
    },
  };
}

function tutorHostSpy(events: string[] = []): PlatformTutorHost {
  return {
    connect: vi.fn(() => events.push("host-connect")),
    disconnect: vi.fn(() => events.push("host-disconnect")),
    open: vi.fn(async () => undefined),
    close: vi.fn(),
    closeMobileForNavigation: vi.fn(() => events.push("host-mobile-close")),
    invalidateCurrentRequest: vi.fn(() => events.push("host-invalidate")),
    refresh: vi.fn(() => events.push("host-refresh")),
    dispose: vi.fn(() => events.push("host-dispose")),
  };
}

async function bootAt(path: string, module = testLabModule()) {
  history.replaceState({}, "", path);
  const target = document.createElement("div");
  document.body.replaceChildren(target);
  const app = createPlatformBootstrap({
    target,
    initialValueProblemsLoader: async () => module,
  });
  await vi.waitFor(() => expect(app.shell.outlet.querySelector("h1")).not.toBeNull());
  return app;
}

describe("public platform bootstrap", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState({}, "", "/");
  });

  it.each([
    ["/", "Numerical T-Lab", "Numerical T-Lab"],
    ["/ode", "Numerical ODE", "Numerical ODE | Numerical T-Lab"],
    [
      "/ode/initial-value-problems",
      "Initial Value Problems Lab",
      "Initial Value Problems Lab | Numerical T-Lab",
    ],
    ["/linear-algebra", "Numerical Linear Algebra", "Numerical Linear Algebra | Numerical T-Lab"],
    ["/pde", "Numerical PDE", "Numerical PDE | Numerical T-Lab"],
    ["/about", "About", "About | Numerical T-Lab"],
    ["/unknown-path", "Page Not Found", "Page Not Found | Numerical T-Lab"],
  ])("boots %s inside the persistent shell", async (path, heading, title) => {
    const app = await bootAt(path);
    expect(app.shell.root.querySelector(".platform-header")).not.toBeNull();
    expect(app.shell.outlet.querySelector("h1")?.textContent).toContain(heading);
    expect(document.title).toBe(title);
    if (path === "/ode/initial-value-problems") {
      expect(app.shell.outlet.textContent).toContain("beginner-starter");
      expect(app.shell.tutorRegion.querySelector("[data-tutor-open]")).not.toBeNull();
      expect(
        app.shell.root
          .querySelector('[data-route-id="ode-overview"]')
          ?.getAttribute("aria-current")
      ).toBe("location");
    } else {
      expect(app.shell.tutorRegion.childElementCount).toBe(0);
    }
    app.dispose();
  });

  it("opens the complete Lab from the ODE overview", async () => {
    const loader = vi.fn(async () => testLabModule());
    history.replaceState({}, "", "/ode");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const app = createPlatformBootstrap({
      target,
      initialValueProblemsLoader: loader,
    });
    await vi.waitFor(() =>
      expect(app.shell.outlet.querySelector("h1")?.textContent).toBe("Numerical ODE")
    );

    app.shell.outlet
      .querySelector<HTMLAnchorElement>('a[href="/ode/initial-value-problems"]')!
      .click();

    await vi.waitFor(() =>
      expect(app.shell.outlet.querySelector("h1")?.textContent).toBe(
        "Initial Value Problems Lab"
      )
    );
    expect(loader).toHaveBeenCalledOnce();
    app.dispose();
  });

  it("shares one loader attempt across Home intent prefetch and navigation", async () => {
    const loader = vi.fn(async () => testLabModule());
    const app = await bootAt("/", testLabModule());
    app.dispose();

    history.replaceState({}, "", "/");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const next = createPlatformBootstrap({ target, initialValueProblemsLoader: loader });
    await vi.waitFor(() => expect(next.shell.outlet.textContent).toContain("Open Lab"));
    const openLab = next.shell.outlet.querySelector<HTMLAnchorElement>(
      '[data-prefetch-route-id="ode-initial-value-problems"]'
    )!;
    openLab.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await next.navigate("/ode/initial-value-problems");
    expect(loader).toHaveBeenCalledOnce();
    next.dispose();
  });

  it("preserves the pure Lab session across internal navigation", async () => {
    Object.defineProperty(document, "scrollingElement", {
      configurable: true,
      value: document.documentElement,
    });
    const mountedSessions: TestLabSession[] = [];
    const app = await bootAt(
      "/ode/initial-value-problems",
      testLabModule({ mountedSessions })
    );
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(app.shell.outlet.querySelector("h1"))
    );
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    app.shell.outlet.querySelector<HTMLButtonElement>("[data-test-lab-edit]")!.click();
    document.documentElement.scrollTop = 725;
    window.dispatchEvent(new Event("scroll"));
    const activity = app.store.getLabMetadata("ode")?.lastMeaningfulInteraction;
    await app.navigate("/");
    await vi.waitFor(() => expect(document.documentElement.scrollTop).toBe(0));
    expect(app.shell.outlet.textContent).toContain("Continue your experiment");
    const resume = app.shell.outlet.querySelector<HTMLAnchorElement>(
      '[data-resume-module="ode"] a'
    )!;
    expect(resume.textContent).toBe("Resume Lab");
    resume.click();
    await vi.waitFor(() =>
      expect(app.shell.outlet.textContent).toContain("edited-session")
    );
    await vi.waitFor(() => expect(document.documentElement.scrollTop).toBe(725));

    expect(mountedSessions).toEqual([
      { value: "beginner-starter" },
      { value: "edited-session" },
    ]);
    expect(app.shell.outlet.textContent).toContain("edited-session");
    expect(app.store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(
      activity
    );
    app.dispose();
  });

  it("owns manual browser scroll restoration for the bootstrap lifetime", async () => {
    Object.defineProperty(history, "scrollRestoration", {
      configurable: true,
      writable: true,
      value: "auto",
    });
    const app = await bootAt("/");
    expect(history.scrollRestoration).toBe("manual");
    expect(history.state.numericalAnalysisLab).toMatchObject({
      entryId: expect.any(String),
      scrollY: 0,
    });
    app.dispose();
    expect(history.scrollRestoration).toBe("auto");
  });

  it("preserves Tutor state and disposes Host before the Lab", async () => {
    const events: string[] = [];
    const store = createAppSessionStore();
    store.updateTutor("ode", (current) =>
      updateTutorDraft(appendTutorMessage(current, "user", "Keep this"), "draft")
    );
    const host = tutorHostSpy(events);
    history.replaceState({}, "", "/ode/initial-value-problems");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const app = createPlatformBootstrap({
      target,
      store,
      tutorHost: host,
      initialValueProblemsLoader: async () => testLabModule({ events }),
    });
    await vi.waitFor(() => expect(events).toContain("host-connect"));
    await app.navigate("/about");

    expect(events.indexOf("host-mobile-close")).toBeLessThan(
      events.indexOf("host-disconnect")
    );
    expect(events.indexOf("host-disconnect")).toBeLessThan(
      events.indexOf("lab-dispose")
    );
    expect(store.getTutor("ode")).toMatchObject({ draftMessage: "draft" });
    expect(store.getTutor("ode").items).toHaveLength(1);
    expect(app.shell.tutorRegion.childElementCount).toBe(0);
    app.dispose();
  });

  it("keeps saved sessions through a failed Lab import and recovers with Retry", async () => {
    const store = createAppSessionStore();
    store.setLab("ode", { value: "saved-session" }, {
      labMeaningful: true,
      tutorMeaningful: false,
      meaningful: true,
      lastMeaningfulInteraction: 75,
      resumeSummary: {
        moduleId: "ode",
        route: "/ode/initial-value-problems",
        labTitle: "Initial Value Problems Lab",
        stepLabel: "Data",
        lastMeaningfulInteraction: 75,
      },
    });
    store.updateTutor("ode", (current) =>
      appendTutorMessage(current, "user", "Saved before failure")
    );
    let attempt = 0;
    history.replaceState({}, "", "/ode/initial-value-problems");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const app = createPlatformBootstrap({
      target,
      store,
      initialValueProblemsLoader: async () => {
        attempt += 1;
        if (attempt === 1) throw new Error("route chunk failed");
        return testLabModule();
      },
    });
    await vi.waitFor(() => expect(app.shell.outlet.textContent).toContain("could not load"));
    expect(store.getTutor("ode").items).toHaveLength(1);
    const activity = store.getLabMetadata("ode")?.lastMeaningfulInteraction;
    expect(store.hasMeaningfulWork()).toBe(true);
    expect(store.getResumeSummaries()).toHaveLength(1);
    await app.router.retry();
    expect(app.shell.outlet.textContent).toContain("saved-session");
    expect(store.getTutor("ode").items).toHaveLength(1);
    expect(store.getLabMetadata("ode")?.lastMeaningfulInteraction).toBe(
      activity
    );
    app.dispose();
  });

  it("does not mount a stale ODE module after navigation changes", async () => {
    let resolve!: (module: LabRouteModule<TestLabSession>) => void;
    const pending = new Promise<LabRouteModule<TestLabSession>>((done) => {
      resolve = done;
    });
    const mountedSessions: TestLabSession[] = [];
    const app = await bootAt("/", testLabModule());
    app.dispose();

    history.replaceState({}, "", "/");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const next = createPlatformBootstrap({
      target,
      initialValueProblemsLoader: () => pending,
    });
    await vi.waitFor(() => expect(next.shell.outlet.textContent).toContain("Open Lab"));
    const odeNavigation = next.navigate("/ode/initial-value-problems");
    await next.navigate("/about");
    resolve(testLabModule({ mountedSessions }));
    await odeNavigation;
    expect(mountedSessions).toHaveLength(0);
    expect(next.shell.outlet.querySelector("h1")?.textContent).toBe("About");
    next.dispose();
  });
});
