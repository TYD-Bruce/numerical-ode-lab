import type {
  MountedRoute,
  Navigate,
  NavigateOptions,
  RouteId,
  RouteLocation,
} from "./contracts";
import type { AppShell } from "./appShell";
import {
  findRouteById,
  matchRoute,
  normalizeApplicationLocation,
  type MatchedRoute,
  type NormalizedApplicationLocation,
  type RouteDefinition,
} from "./routeDefinitions";

interface PlatformHistoryEnvelope {
  [key: string]: unknown;
}

interface PlatformRouterOptions {
  shell: AppShell;
  routes: readonly RouteDefinition[];
  window?: Window;
  document?: Document;
}

interface FailedNavigation {
  match: MatchedRoute;
  location: NormalizedApplicationLocation;
}

export interface PlatformRouter {
  start(): void;
  navigate: Navigate;
  prefetch(routeId: RouteId): void;
  retry(): Promise<void>;
  dispose(): void;
}

function recordValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? { ...value }
    : {};
}

export function mergePlatformHistoryState(
  currentState: unknown,
  platformUpdate: PlatformHistoryEnvelope = {}
): Record<string, unknown> {
  const current = recordValue(currentState);
  const currentPlatform = recordValue(current.numericalAnalysisLab);
  return {
    ...current,
    numericalAnalysisLab: {
      ...currentPlatform,
      ...platformUpdate,
    },
  };
}

export function isInterceptableNavigation(
  event: MouseEvent,
  anchor: HTMLAnchorElement,
  applicationOrigin: string
): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    anchor.hasAttribute("download")
  ) {
    return false;
  }

  const target = anchor.getAttribute("target");
  if (target && target.toLowerCase() !== "_self") return false;

  let destination: URL;
  try {
    destination = new URL(anchor.href, applicationOrigin);
  } catch {
    return false;
  }

  return (
    (destination.protocol === "http:" || destination.protocol === "https:") &&
    destination.origin === applicationOrigin
  );
}

export function createPlatformRouter({
  shell,
  routes,
  window: suppliedWindow,
  document: suppliedDocument,
}: PlatformRouterOptions): PlatformRouter {
  const browserWindow = suppliedWindow ?? window;
  const browserDocument = suppliedDocument ?? document;
  let navigationGeneration = 0;
  let currentMountedRoute: MountedRoute | undefined;
  let failedNavigation: FailedNavigation | undefined;
  let started = false;
  let disposed = false;
  const disposedRoutes = new WeakSet<MountedRoute>();

  const disposeRoute = (mounted: MountedRoute | undefined): void => {
    if (!mounted || disposedRoutes.has(mounted)) return;
    disposedRoutes.add(mounted);
    mounted.dispose();
  };

  const disposeCurrentRoute = (): void => {
    const mounted = currentMountedRoute;
    currentMountedRoute = undefined;
    disposeRoute(mounted);
  };

  const focusCurrentRoute = async (generation: number): Promise<void> => {
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    if (disposed || generation !== navigationGeneration) return;
    const focusTarget =
      shell.outlet.querySelector<HTMLElement>("[data-route-focus], h1") ?? shell.outlet;
    try {
      focusTarget.focus({ preventScroll: true });
    } catch {
      focusTarget.focus();
    }
  };

  const transition = async (
    location: NormalizedApplicationLocation,
    historyMode: "push" | "replace" | "none"
  ): Promise<void> => {
    const generation = ++navigationGeneration;
    failedNavigation = undefined;

    if (historyMode !== "none") {
      const state = mergePlatformHistoryState(browserWindow.history.state);
      if (historyMode === "replace") {
        browserWindow.history.replaceState(state, "", location.href);
      } else {
        browserWindow.history.pushState(state, "", location.href);
      }
    }

    const match = matchRoute(routes, location.pathname);
    disposeCurrentRoute();
    shell.setActiveRoute(match.definition.id);
    browserDocument.title = match.definition.title;
    shell.renderLoading();

    let module;
    try {
      module = await match.definition.loader.load();
    } catch {
      if (disposed || generation !== navigationGeneration) return;
      failedNavigation = { match, location };
      shell.renderFailure(retry);
      return;
    }

    if (disposed || generation !== navigationGeneration) return;

    const routeLocation: RouteLocation = {
      pathname: match.requestedPathname,
      search: location.search,
      hash: location.hash,
    };
    let localMountedRoute: MountedRoute;
    try {
      localMountedRoute = module.mount({
        target: shell.outlet,
        navigate,
        location: routeLocation,
      });
    } catch {
      if (disposed || generation !== navigationGeneration) return;
      failedNavigation = { match, location };
      shell.renderFailure(retry);
      return;
    }

    if (disposed || generation !== navigationGeneration) {
      disposeRoute(localMountedRoute);
      return;
    }
    currentMountedRoute = localMountedRoute;

    if (localMountedRoute.ready) {
      try {
        await localMountedRoute.ready;
      } catch {
        if (disposed || generation !== navigationGeneration) {
          disposeRoute(localMountedRoute);
          return;
        }
        if (currentMountedRoute === localMountedRoute) currentMountedRoute = undefined;
        disposeRoute(localMountedRoute);
        failedNavigation = { match, location };
        shell.renderFailure(retry);
        return;
      }
    }

    if (disposed || generation !== navigationGeneration) {
      disposeRoute(localMountedRoute);
      return;
    }

    shell.navigationSucceeded();
    await focusCurrentRoute(generation);
  };

  const currentLocation = (): NormalizedApplicationLocation =>
    normalizeApplicationLocation(browserWindow.location.href, browserWindow.location.origin);

  const navigate: Navigate = async (
    path: string,
    options: NavigateOptions = {}
  ): Promise<void> => {
    if (disposed) return;
    const destination = new URL(path, browserWindow.location.href);
    if (destination.origin !== browserWindow.location.origin) {
      throw new Error("Platform navigation accepts same-origin application paths only.");
    }
    const location = normalizeApplicationLocation(
      destination.href,
      browserWindow.location.origin
    );
    await transition(location, options.replace ? "replace" : "push");
  };

  async function retry(): Promise<void> {
    if (disposed || !failedNavigation) return;
    const retryTarget = failedNavigation;
    retryTarget.match.definition.loader.evictRejected();
    await transition(retryTarget.location, "none");
  }

  const onPopState = (): void => {
    const location = currentLocation();
    const browserHref = `${browserWindow.location.pathname}${browserWindow.location.search}${browserWindow.location.hash}`;
    if (location.href !== browserHref) {
      browserWindow.history.replaceState(
        mergePlatformHistoryState(browserWindow.history.state),
        "",
        location.href
      );
    }
    void transition(location, "none");
  };

  const anchorFromEvent = (event: Event): HTMLAnchorElement | null => {
    const target = event.target;
    return target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
  };

  const onClick = (event: MouseEvent): void => {
    const anchor = anchorFromEvent(event);
    if (!anchor || !isInterceptableNavigation(event, anchor, browserWindow.location.origin)) {
      return;
    }
    event.preventDefault();
    const destination = new URL(anchor.href);
    void navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  };

  const prefetchFromEvent = (event: Event): void => {
    const anchor = anchorFromEvent(event);
    const routeId = anchor?.dataset.prefetchRouteId as RouteId | undefined;
    if (routeId) prefetch(routeId);
  };

  const prefetch = (routeId: RouteId): void => {
    const definition = findRouteById(routes, routeId);
    if (definition?.kind === "lab") definition.loader.prefetch();
  };

  return {
    start() {
      if (started || disposed) return;
      started = true;
      browserWindow.addEventListener("popstate", onPopState);
      shell.root.addEventListener("click", onClick);
      shell.root.addEventListener("pointerover", prefetchFromEvent);
      shell.root.addEventListener("mouseover", prefetchFromEvent);
      shell.root.addEventListener("focusin", prefetchFromEvent);

      const location = currentLocation();
      const browserHref = `${browserWindow.location.pathname}${browserWindow.location.search}${browserWindow.location.hash}`;
      if (location.href !== browserHref) {
        browserWindow.history.replaceState(
          mergePlatformHistoryState(browserWindow.history.state),
          "",
          location.href
        );
      }
      void transition(location, "none");
    },
    navigate,
    prefetch,
    retry,
    dispose() {
      if (disposed) return;
      disposed = true;
      navigationGeneration += 1;
      browserWindow.removeEventListener("popstate", onPopState);
      shell.root.removeEventListener("click", onClick);
      shell.root.removeEventListener("pointerover", prefetchFromEvent);
      shell.root.removeEventListener("mouseover", prefetchFromEvent);
      shell.root.removeEventListener("focusin", prefetchFromEvent);
      disposeCurrentRoute();
      shell.dispose();
    },
  };
}
