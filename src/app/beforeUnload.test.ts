// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { createBeforeUnloadHandler } from "./beforeUnload";
import { createAppSessionStore } from "./appSessionStore";
import { createPlatformBootstrap } from "./platformBootstrap";

afterEach(() => vi.restoreAllMocks());

describe("platform beforeunload", () => {
  it("does nothing without maintained meaningful work and requests the standard warning otherwise", () => {
    let meaningful = false;
    const handler = createBeforeUnloadHandler({
      hasMeaningfulWork: () => meaningful,
    });
    const preventDefault = vi.fn();
    const event = { preventDefault, returnValue: "unchanged" } as unknown as BeforeUnloadEvent;

    handler(event);
    expect(preventDefault).not.toHaveBeenCalled();
    expect(event.returnValue).toBe("unchanged");

    meaningful = true;
    handler(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(event.returnValue).toBe("");
  });

  it("registers exactly one listener and removes that same listener on platform disposal", async () => {
    history.replaceState({}, "", "/");
    const target = document.createElement("div");
    document.body.replaceChildren(target);
    const added: EventListener[] = [];
    const removed: EventListener[] = [];
    const originalAdd = window.addEventListener.bind(window);
    const originalRemove = window.removeEventListener.bind(window);
    vi.spyOn(window, "addEventListener").mockImplementation((type, listener, options) => {
      if (type === "beforeunload") added.push(listener as EventListener);
      originalAdd(type, listener, options);
    });
    vi.spyOn(window, "removeEventListener").mockImplementation((type, listener, options) => {
      if (type === "beforeunload") removed.push(listener as EventListener);
      originalRemove(type, listener, options);
    });

    const store = createAppSessionStore();
    const app = createPlatformBootstrap({ target, store });
    await vi.waitFor(() => expect(app.shell.outlet.querySelector("h1")).not.toBeNull());

    expect(added).toHaveLength(1);
    store.updateTutor("ode", (current) => ({
      ...current,
      items: [
        ...current.items,
        { kind: "message" as const, role: "user" as const, content: "Keep this" },
      ],
    }));
    const preventDefault = vi.fn();
    added[0]?.({ preventDefault, returnValue: "" } as unknown as Event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(app.shell.outlet.querySelector("h1")?.textContent).toBe(
      "Numerical Analysis Lab"
    );
    app.dispose();
    app.dispose();
    expect(removed).toEqual(added);
  });

  it("contains only a maintained Store read and the standard event mutation", () => {
    expect(createBeforeUnloadHandler.toString()).not.toMatch(
      /getSession|querySelector|MathLive|clone|Resume|async|Promise|update/
    );
  });

  it("does not register unload behavior in the Router, Host, Lab adapter, Tutor, or pages", () => {
    const productionSources = import.meta.glob(
      [
        "./router.ts",
        "./platformTutorHost.ts",
        "./labRouteAdapter.ts",
        "../ode/*.ts",
        "../tutor/*.ts",
        "../pages/*.ts",
      ],
      { query: "?raw", import: "default", eager: true }
    );
    for (const [path, source] of Object.entries(productionSources)) {
      expect(String(source), path).not.toContain("beforeunload");
    }
  });
});
