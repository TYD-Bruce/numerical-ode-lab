// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MountedRoute, RouteModule } from "./contracts";
import { createAppShell } from "./appShell";
import {
  createRouteDefinitions,
  matchRoute,
  normalizeApplicationLocation,
  type RouteDefinition,
} from "./routeDefinitions";
import { createRouteLoader } from "./routeLoader";
import { createPlatformRouter } from "./router";

function moduleWithText(text: string, onDispose = vi.fn()): RouteModule {
  return {
    mount({ target }) {
      const heading = document.createElement("h1");
      heading.tabIndex = -1;
      heading.textContent = text;
      target.replaceChildren(heading);
      return { dispose: onDispose };
    },
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function testRoutes(
  loaders: Partial<Record<RouteDefinition["id"], () => Promise<RouteModule>>> = {}
): RouteDefinition[] {
  const definitions = createRouteDefinitions({
    initialValueProblemsLoader: loaders["ode-initial-value-problems"],
  });
  return definitions.map((definition) => {
    const loader = loaders[definition.id];
    return loader
      ? { ...definition, loader: createRouteLoader(loader) }
      : definition;
  });
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("route matching and normalization", () => {
  const routes = createRouteDefinitions();

  it.each([
    ["/", "home"],
    ["/ode", "ode-overview"],
    ["/ode/initial-value-problems", "ode-initial-value-problems"],
    ["/linear-algebra", "linear-algebra-overview"],
    ["/pde", "pde-overview"],
    ["/about", "about"],
  ] as const)("matches %s exactly", (path, id) => {
    expect(matchRoute(routes, path).definition.id).toBe(id);
  });

  it("normalizes trailing slashes while retaining query and hash", () => {
    expect(
      normalizeApplicationLocation("/ode///?method=euler#results", "https://lab.test")
    ).toEqual({
      pathname: "/ode",
      search: "?method=euler",
      hash: "#results",
      href: "/ode?method=euler#results",
    });
  });

  it("keeps an unknown requested pathname for Not Found", () => {
    const match = matchRoute(routes, "/missing/%3Cscript%3E");
    expect(match.definition.id).toBe("not-found");
    expect(match.requestedPathname).toBe("/missing/%3Cscript%3E");
  });

  it.each([
    ["home", "Numerical Analysis Lab"],
    ["ode-overview", "Numerical ODE | Numerical Analysis Lab"],
    [
      "ode-initial-value-problems",
      "Initial Value Problems Lab | Numerical Analysis Lab",
    ],
    ["linear-algebra-overview", "Numerical Linear Algebra | Numerical Analysis Lab"],
    ["pde-overview", "Numerical PDE | Numerical Analysis Lab"],
    ["about", "About | Numerical Analysis Lab"],
    ["not-found", "Page Not Found | Numerical Analysis Lab"],
  ] as const)("defines the approved title for %s", (id, title) => {
    expect(routes.find((route) => route.id === id)?.title).toBe(title);
  });
});

describe("platform router", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState({ outside: "preserve-me" }, "", "/");
  });

  it("pushes and replaces normalized URLs without overwriting unrelated history state", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({ shell, routes: testRoutes() });
    router.start();
    await settle();

    await router.navigate("/ode/?topic=ivp#intro");
    expect(location.pathname + location.search + location.hash).toBe(
      "/ode?topic=ivp#intro"
    );
    expect(history.state).toMatchObject({
      outside: "preserve-me",
      numericalAnalysisLab: expect.any(Object),
    });

    await router.navigate("/about/", { replace: true });
    expect(location.pathname).toBe("/about");
    expect(history.state.outside).toBe("preserve-me");
    router.dispose();
  });

  it("responds to popstate, updates titles, and routes unknown paths", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({ shell, routes: testRoutes() });
    router.start();
    await settle();

    history.pushState({ outside: true }, "", "/not-a-route");
    const historyLength = history.length;
    window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
    await vi.waitFor(() => {
      expect(document.title).toBe("Page Not Found | Numerical Analysis Lab");
      expect(shell.outlet.textContent).toContain("/not-a-route");
    });
    expect(history.length).toBe(historyLength);
    router.dispose();
  });

  it("normalizes a direct trailing-slash entry with replaceState", async () => {
    history.replaceState({ outside: "kept" }, "", "/about/?source=direct#team");
    const historyLength = history.length;
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({ shell, routes: testRoutes() });

    router.start();
    await vi.waitFor(() => expect(shell.outlet.textContent).toContain("About"));

    expect(location.pathname + location.search + location.hash).toBe(
      "/about?source=direct#team"
    );
    expect(history.length).toBe(historyLength);
    expect(history.state.outside).toBe("kept");
    router.dispose();
  });

  it("renders loading, failure, and safe repeated Retry", async () => {
    let attempt = 0;
    const failingLoader = vi.fn(async () => {
      attempt += 1;
      if (attempt < 3) throw new Error(`failure ${attempt}`);
      return moduleWithText("Recovered route");
    });
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: testRoutes({ "ode-overview": failingLoader }),
    });

    const first = router.navigate("/ode");
    expect(shell.outlet.getAttribute("aria-busy")).toBe("true");
    await first;
    expect(shell.outlet.textContent).toContain("could not load");
    expect(shell.outlet.querySelector("button")?.textContent).toBe("Retry");

    await router.retry();
    expect(shell.outlet.textContent).toContain("could not load");
    await router.retry();
    expect(shell.outlet.textContent).toContain("Recovered route");
    expect(failingLoader).toHaveBeenCalledTimes(3);
    router.dispose();
  });

  it("prevents a stale route load from mounting or replacing a newer route", async () => {
    const routeA = deferred<RouteModule>();
    const routeB = deferred<RouteModule>();
    const mountA = vi.fn();
    const disposeB = vi.fn();
    const moduleA: RouteModule = {
      mount() {
        mountA();
        return { dispose: vi.fn() };
      },
    };
    const moduleB = moduleWithText("Route B", disposeB);
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: testRoutes({
        "ode-overview": () => routeA.promise,
        about: () => routeB.promise,
      }),
    });

    const navigationA = router.navigate("/ode");
    const navigationB = router.navigate("/about");
    routeB.resolve(moduleB);
    await navigationB;
    routeA.resolve(moduleA);
    await navigationA;

    expect(mountA).not.toHaveBeenCalled();
    expect(disposeB).not.toHaveBeenCalled();
    expect(shell.outlet.textContent).toContain("Route B");
    expect(document.title).toBe("About | Numerical Analysis Lab");
    expect(document.activeElement?.textContent).toBe("Route B");
    expect(shell.outlet.hasAttribute("aria-busy")).toBe(false);
    expect(
      shell.root.querySelector('[data-route-id="about"]')?.getAttribute("aria-current")
    ).toBe("page");
    router.dispose();
  });

  it("disposes a stale local mount without touching the current mounted route", async () => {
    const ready = deferred<void>();
    const staleMounted = vi.fn();
    const staleDispose = vi.fn();
    const currentDispose = vi.fn();
    const staleModule: RouteModule = {
      mount(): MountedRoute {
        staleMounted();
        return { ready: ready.promise, dispose: staleDispose };
      },
    };
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: testRoutes({
        "ode-overview": async () => staleModule,
        about: async () => moduleWithText("Current", currentDispose),
      }),
    });

    const staleNavigation = router.navigate("/ode");
    await vi.waitFor(() => expect(staleMounted).toHaveBeenCalledTimes(1));
    await router.navigate("/about");
    ready.resolve();
    await staleNavigation;

    expect(staleDispose).toHaveBeenCalledTimes(1);
    expect(currentDispose).not.toHaveBeenCalled();
    expect(shell.outlet.textContent).toContain("Current");
    router.dispose();
  });
});
