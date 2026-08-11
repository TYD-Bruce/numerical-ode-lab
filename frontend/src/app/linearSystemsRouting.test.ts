// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteModule } from "./contracts";
import { createAppShell } from "./appShell";
import {
  createRouteDefinitions,
  findRouteById,
  matchRoute,
} from "./routeDefinitions";
import { createPlatformRouter } from "./router";

function routeModule(label: string): RouteModule {
  return {
    mount({ target }) {
      const heading = document.createElement("h1");
      heading.dataset.routeFocus = "true";
      heading.textContent = label;
      target.replaceChildren(heading);
      return { dispose: () => heading.remove() };
    },
  };
}

describe("Linear Systems route registration", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState({}, "", "/");
  });

  it("registers the nested route as a complete Lab with its own cached loader", async () => {
    const loader = vi.fn(async () => routeModule("Linear Systems direct route"));
    const routes = createRouteDefinitions({ linearSystemsLoader: loader });
    const definition = findRouteById(routes, "linear-algebra-linear-systems")!;
    expect(definition).toMatchObject({
      path: "/linear-algebra/linear-systems",
      kind: "lab",
      title: "Linear Systems Lab | Numerical T Lab",
    });
    expect(matchRoute(routes, "/linear-algebra/linear-systems/").definition).toBe(
      definition
    );
    await definition.loader.load();
    await definition.loader.load();
    expect(loader).toHaveBeenCalledOnce();
  });

  it("retries the Linear Systems dynamic route after a controlled load failure", async () => {
    const loader = vi
      .fn<() => Promise<RouteModule>>()
      .mockRejectedValueOnce(new Error("temporary chunk failure"))
      .mockResolvedValueOnce(routeModule("Recovered Linear Systems route"));
    const definition = findRouteById(
      createRouteDefinitions({ linearSystemsLoader: loader }),
      "linear-algebra-linear-systems"
    )!;
    await expect(definition.loader.load()).rejects.toThrow("temporary chunk failure");
    await expect(definition.loader.retry()).resolves.toBeDefined();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("supports direct navigation and hard-refresh-style router start at the nested path", async () => {
    history.replaceState({}, "", "/linear-algebra/linear-systems");
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: createRouteDefinitions({
        linearSystemsLoader: async () => routeModule("Linear Systems direct route"),
      }),
    });
    router.start();
    await expect.poll(() => shell.outlet.textContent).toContain(
      "Linear Systems direct route"
    );
    expect(document.title).toBe("Linear Systems Lab | Numerical T Lab");
    expect(
      shell.root
        .querySelector('[data-route-id="linear-algebra-overview"]')
        ?.getAttribute("aria-current")
    ).toBe("location");
    router.dispose();
  });
});
