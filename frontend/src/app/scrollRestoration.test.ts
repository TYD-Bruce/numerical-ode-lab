// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppSessionStore } from "./appSessionStore";
import {
  createScrollRestoration,
  mergePlatformHistoryState,
} from "./scrollRestoration";

describe("platform scroll restoration", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState(
      { outside: "keep", numericalAnalysisLab: { future: "keep-too" } },
      "",
      "/"
    );
  });

  it("creates stable namespaced entry metadata and preserves unrelated fields", () => {
    const replace = vi.spyOn(history, "replaceState");
    const store = createAppSessionStore();
    let scrollY = 480;
    const service = createScrollRestoration({
      store,
      readScrollY: () => scrollY,
      writeScrollY: vi.fn(),
      createEntryId: () => "entry-1",
    });

    service.start();
    expect(history.state).toEqual({
      outside: "keep",
      numericalAnalysisLab: {
        future: "keep-too",
        entryId: "entry-1",
        scrollY: 0,
      },
    });
    service.setCurrentRoute({
      routeId: "ode-initial-value-problems",
      kind: "lab",
    });
    expect(service.captureCurrentRoute()).toBe(480);
    expect(history.state.numericalAnalysisLab).toMatchObject({
      future: "keep-too",
      entryId: "entry-1",
      scrollY: 480,
    });
    expect(store.getRouteSession("ode-initial-value-problems")).toEqual({
      scrollPosition: 480,
    });
    expect(replace).toHaveBeenCalled();
    service.dispose();
  });

  it("creates a unique pushed entry and normalizes invalid scroll values", () => {
    const merged = mergePlatformHistoryState(
      {
        outside: true,
        numericalAnalysisLab: { entryId: "old", scrollY: 12, future: 3 },
      },
      { entryId: "new", scrollY: Number.NaN }
    );
    expect(merged).toEqual({
      outside: true,
      numericalAnalysisLab: { entryId: "new", scrollY: 0, future: 3 },
    });
    history.replaceState(merged, "", "/");
    let sequence = 0;
    const service = createScrollRestoration({
      store: createAppSessionStore(),
      createEntryId: () => `entry-${++sequence}`,
    });
    service.start();
    const currentEntry = history.state.numericalAnalysisLab.entryId;
    const pushed = service.createPushedState(history.state);
    expect(
      (pushed.numericalAnalysisLab as { entryId: string }).entryId
    ).not.toBe(currentEntry);
    expect(pushed).toMatchObject({
      outside: true,
      numericalAnalysisLab: { future: 3, scrollY: 0 },
    });
    service.dispose();
  });

  it("prefers popstate entry scroll and normal Lab re-entry uses saved Lab scroll", () => {
    history.replaceState(
      { numericalAnalysisLab: { entryId: "home-entry", scrollY: 300 } },
      "",
      "/"
    );
    const store = createAppSessionStore();
    store.updateRouteSession("ode-initial-value-problems", {
      scrollPosition: 900,
    });
    const service = createScrollRestoration({ store });
    service.start();
    history.replaceState(
      mergePlatformHistoryState(history.state, { scrollY: 300 }),
      "",
      location.href
    );

    expect(
      service.resolveRestoration({
        routeId: "ode-initial-value-problems",
        kind: "lab",
        navigation: "push",
        policy: "auto",
      })
    ).toBe(900);
    expect(
      service.resolveRestoration({
        routeId: "ode-initial-value-problems",
        kind: "lab",
        navigation: "pop",
        policy: "auto",
      })
    ).toBe(300);
    expect(
      service.resolveRestoration({
        routeId: "about",
        kind: "page",
        navigation: "push",
        policy: "preserve",
        preservedScroll: 125,
      })
    ).toBe(125);
    expect(
      service.resolveRestoration({
        routeId: "ode-initial-value-problems",
        kind: "lab",
        navigation: "push",
        policy: "top",
      })
    ).toBe(0);
    service.dispose();
  });

  it("focuses before a guarded restoration and rejects stale frames", () => {
    const frames: FrameRequestCallback[] = [];
    const writes: number[] = [];
    const service = createScrollRestoration({
      store: createAppSessionStore(),
      requestFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelFrame: vi.fn(),
      writeScrollY: (value) => writes.push(value),
    });
    service.start();
    let current = true;
    service.scheduleRestoration({
      scrollY: 640,
      hash: "",
      allowHashTarget: true,
      isCurrent: () => current,
    });
    current = false;
    frames.shift()?.(0);
    expect(writes).toEqual([]);

    current = true;
    service.scheduleRestoration({
      scrollY: 320,
      hash: "",
      allowHashTarget: true,
      isCurrent: () => current,
    });
    frames.shift()?.(0);
    expect(writes).toEqual([320]);
    service.dispose();
  });

  it("uses a valid pushed hash target but lets popstate retain entry priority", () => {
    const target = document.createElement("section");
    target.id = "analysis-target";
    target.scrollIntoView = vi.fn();
    document.body.append(target);
    const frames: FrameRequestCallback[] = [];
    const write = vi.fn();
    const service = createScrollRestoration({
      store: createAppSessionStore(),
      requestFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      writeScrollY: write,
    });
    service.start();
    service.scheduleRestoration({
      scrollY: 0,
      hash: "#analysis-target",
      allowHashTarget: true,
      isCurrent: () => true,
    });
    frames.shift()?.(0);
    expect(target.scrollIntoView).toHaveBeenCalledOnce();

    service.scheduleRestoration({
      scrollY: 250,
      hash: "#analysis-target",
      allowHashTarget: false,
      isCurrent: () => true,
    });
    frames.shift()?.(0);
    expect(write).toHaveBeenLastCalledWith(250);
    service.dispose();
  });

  it("sets manual browser restoration, restores it, and triple-resets without pushing", () => {
    Object.defineProperty(history, "scrollRestoration", {
      configurable: true,
      writable: true,
      value: "auto",
    });
    history.replaceState(
      {
        outside: "keep",
        numericalAnalysisLab: { entryId: "same-entry", scrollY: 700, future: 1 },
      },
      "",
      "/ode/initial-value-problems?x=1#data"
    );
    const store = createAppSessionStore();
    store.updateRouteSession("ode-initial-value-problems", {
      scrollPosition: 700,
    });
    const write = vi.fn();
    const frames: FrameRequestCallback[] = [];
    const push = vi.spyOn(history, "pushState");
    const service = createScrollRestoration({
      store,
      writeScrollY: write,
      requestFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelFrame: vi.fn(),
    });
    service.start();
    expect(history.scrollRestoration).toBe("manual");

    service.scheduleRestoration({
      scrollY: 700,
      hash: "",
      allowHashTarget: true,
      isCurrent: () => true,
    });

    service.resetCurrentRoute("ode-initial-value-problems");
    frames.shift()?.(0);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith(0);
    expect(store.getRouteSession("ode-initial-value-problems")).toEqual({
      scrollPosition: 0,
    });
    expect(history.state).toMatchObject({
      outside: "keep",
      numericalAnalysisLab: {
        entryId: "same-entry",
        scrollY: 0,
        future: 1,
      },
    });
    expect(location.pathname + location.search + location.hash).toBe(
      "/ode/initial-value-problems?x=1#data"
    );
    expect(push).not.toHaveBeenCalled();
    expect(
      service.resolveRestoration({
        routeId: "ode-initial-value-problems",
        kind: "lab",
        navigation: "pop",
        policy: "auto",
      })
    ).toBe(0);
    expect(
      service.resolveRestoration({
        routeId: "ode-initial-value-problems",
        kind: "lab",
        navigation: "push",
        policy: "auto",
      })
    ).toBe(0);
    service.dispose();
    expect(history.scrollRestoration).toBe("auto");
  });

  it("does not throw when browser scrollRestoration is readonly-like", () => {
    const previous = Object.getOwnPropertyDescriptor(history, "scrollRestoration");
    Object.defineProperty(history, "scrollRestoration", {
      configurable: true,
      get: () => "auto",
      set: () => {
        throw new TypeError("readonly");
      },
    });
    const service = createScrollRestoration({ store: createAppSessionStore() });
    expect(() => service.start()).not.toThrow();
    expect(() => service.dispose()).not.toThrow();
    if (previous) {
      Object.defineProperty(history, "scrollRestoration", previous);
    } else {
      Reflect.deleteProperty(history, "scrollRestoration");
    }
  });
});
