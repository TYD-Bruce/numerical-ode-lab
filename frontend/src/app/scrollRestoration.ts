import type { AppSessionStore } from "./appSessionStore";
import type { NavigateOptions, RouteId } from "./contracts";
import type { RouteKind } from "./routeDefinitions";

export interface ScrollRouteIdentity {
  readonly routeId: RouteId;
  readonly kind: RouteKind;
}

export type ScrollNavigation = "initial" | "push" | "replace" | "pop" | "retry";

export interface ScrollRestoration {
  start(): void;
  setCurrentRoute(route: ScrollRouteIdentity | undefined): void;
  captureCurrentRoute(options?: { readonly updateHistory?: boolean }): number;
  createPushedState(currentState?: unknown): Record<string, unknown>;
  resolveRestoration(options: {
    readonly routeId: RouteId;
    readonly kind: RouteKind;
    readonly navigation: ScrollNavigation;
    readonly policy: NavigateOptions["scroll"];
    readonly preservedScroll?: number;
  }): number;
  scheduleRestoration(options: {
    readonly scrollY: number;
    readonly hash: string;
    readonly allowHashTarget: boolean;
    readonly isCurrent: () => boolean;
  }): void;
  resetCurrentRoute(routeId: RouteId): void;
  dispose(): void;
}

interface PlatformHistoryUpdate {
  readonly entryId?: string;
  readonly scrollY?: number;
}

function recordValue(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? { ...value }
    : {};
}

export function normalizeScrollY(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

export function mergePlatformHistoryState(
  currentState: unknown,
  platformUpdate: PlatformHistoryUpdate = {}
): Record<string, unknown> {
  const current = recordValue(currentState);
  const currentPlatform = recordValue(current.numericalAnalysisLab);
  const update = {
    ...platformUpdate,
    ...(Object.prototype.hasOwnProperty.call(platformUpdate, "scrollY")
      ? { scrollY: normalizeScrollY(platformUpdate.scrollY) }
      : {}),
  };
  return {
    ...current,
    numericalAnalysisLab: {
      ...currentPlatform,
      ...update,
    },
  };
}

function historyScroll(state: unknown): number {
  const envelope = recordValue(state);
  return normalizeScrollY(recordValue(envelope.numericalAnalysisLab).scrollY);
}

function historyEntryId(state: unknown): string | undefined {
  const envelope = recordValue(state);
  const entryId = recordValue(envelope.numericalAnalysisLab).entryId;
  return typeof entryId === "string" && entryId.length > 0 ? entryId : undefined;
}

let entrySequence = 0;

function defaultEntryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  entrySequence += 1;
  return `numerical-analysis-lab-${entrySequence}`;
}

export function createScrollRestoration(options: {
  readonly store?: AppSessionStore;
  readonly window?: Window;
  readonly document?: Document;
  readonly readScrollY?: () => number;
  readonly writeScrollY?: (value: number) => void;
  readonly requestFrame?: (callback: FrameRequestCallback) => number;
  readonly cancelFrame?: (handle: number) => void;
  readonly createEntryId?: () => string;
}): ScrollRestoration {
  const browserWindow = options.window ?? window;
  const browserDocument = options.document ?? document;
  const readScrollY = options.readScrollY ?? (() =>
    normalizeScrollY(
      browserDocument.scrollingElement?.scrollTop ?? browserWindow.scrollY
    ));
  const writeScrollY = options.writeScrollY ?? ((value: number) => {
    const normalized = normalizeScrollY(value);
    if (
      browserWindow.navigator.userAgent.toLowerCase().includes("jsdom") ||
      browserWindow.scrollTo.toString().includes("notImplementedMethod")
    ) {
      if (browserDocument.scrollingElement) {
        browserDocument.scrollingElement.scrollTop = normalized;
      }
      return;
    }
    try {
      browserWindow.scrollTo({ top: normalized, left: 0, behavior: "auto" });
    } catch {
      // jsdom and restricted embedded browsers may not implement scrolling.
    }
  });
  const requestFrame = options.requestFrame ?? ((callback: FrameRequestCallback) =>
    typeof browserWindow.requestAnimationFrame === "function"
      ? browserWindow.requestAnimationFrame(callback)
      : browserWindow.setTimeout(() => callback(Date.now()), 0));
  const cancelFrame = options.cancelFrame ?? ((handle: number) => {
    if (typeof browserWindow.cancelAnimationFrame === "function") {
      browserWindow.cancelAnimationFrame(handle);
    } else {
      browserWindow.clearTimeout(handle);
    }
  });
  const createEntryId = options.createEntryId ?? defaultEntryId;
  let currentRoute: ScrollRouteIdentity | undefined;
  let pendingFrame: number | undefined;
  let restorationGeneration = 0;
  let previousScrollRestoration: "auto" | "manual" | undefined;
  let changedBrowserMode = false;
  let started = false;
  let disposed = false;

  const replaceCurrent = (update: PlatformHistoryUpdate): void => {
    browserWindow.history.replaceState(
      mergePlatformHistoryState(browserWindow.history.state, update),
      "",
      browserWindow.location.href
    );
  };

  const saveRouteScroll = (route: ScrollRouteIdentity | undefined, scrollY: number): void => {
    if (route?.kind !== "lab") return;
    const current = options.store?.getRouteSession(route.routeId);
    options.store?.updateRouteSession(route.routeId, {
      ...current,
      scrollPosition: scrollY,
    });
  };

  const capture = (updateHistory = true): number => {
    const scrollY = normalizeScrollY(readScrollY());
    if (updateHistory) replaceCurrent({ scrollY });
    saveRouteScroll(currentRoute, scrollY);
    return scrollY;
  };

  const onScroll = (): void => {
    if (!started || disposed) return;
    cancelPending();
    capture();
  };

  const cancelPending = (): void => {
    restorationGeneration += 1;
    if (pendingFrame === undefined) return;
    cancelFrame(pendingFrame);
    pendingFrame = undefined;
  };

  const service: ScrollRestoration = {
    start(): void {
      if (started || disposed) return;
      started = true;
      const entryId = historyEntryId(browserWindow.history.state) ?? createEntryId();
      replaceCurrent({
        entryId,
        scrollY: 0,
      });
      try {
        if ("scrollRestoration" in browserWindow.history) {
          previousScrollRestoration = browserWindow.history.scrollRestoration;
          browserWindow.history.scrollRestoration = "manual";
          changedBrowserMode =
            browserWindow.history.scrollRestoration === "manual";
        }
      } catch {
        previousScrollRestoration = undefined;
        changedBrowserMode = false;
      }
      browserWindow.addEventListener("scroll", onScroll, { passive: true });
    },
    setCurrentRoute(route): void {
      currentRoute = route;
    },
    captureCurrentRoute(captureOptions = {}): number {
      cancelPending();
      return capture(captureOptions.updateHistory !== false);
    },
    createPushedState(currentState = browserWindow.history.state) {
      return mergePlatformHistoryState(currentState, {
        entryId: createEntryId(),
        scrollY: 0,
      });
    },
    resolveRestoration({
      routeId,
      kind,
      navigation,
      policy = "auto",
      preservedScroll,
    }): number {
      if (navigation === "pop") {
        return historyScroll(browserWindow.history.state);
      }
      if (policy === "top") return 0;
      if (policy === "preserve") return normalizeScrollY(preservedScroll);
      if (kind === "lab" && navigation !== "initial") {
        return normalizeScrollY(
          options.store?.getRouteSession(routeId)?.scrollPosition
        );
      }
      return 0;
    },
    scheduleRestoration({ scrollY, hash, allowHashTarget, isCurrent }): void {
      cancelPending();
      const generation = restorationGeneration;
      let ranSynchronously = false;
      const handle = requestFrame(() => {
        ranSynchronously = true;
        if (generation !== restorationGeneration) return;
        pendingFrame = undefined;
        if (
          disposed ||
          !isCurrent()
        ) return;
        if (allowHashTarget && hash.startsWith("#") && hash.length > 1) {
          let id: string;
          try {
            id = decodeURIComponent(hash.slice(1));
          } catch {
            id = hash.slice(1);
          }
          const target = browserDocument.getElementById(id);
          if (target) {
            target.scrollIntoView({ block: "start" });
            const actual = normalizeScrollY(readScrollY());
            replaceCurrent({ scrollY: actual });
            saveRouteScroll(currentRoute, actual);
            return;
          }
        }
        const normalized = normalizeScrollY(scrollY);
        writeScrollY(normalized);
        replaceCurrent({ scrollY: normalized });
        saveRouteScroll(currentRoute, normalized);
      });
      if (!ranSynchronously) pendingFrame = handle;
    },
    resetCurrentRoute(routeId): void {
      cancelPending();
      const current = options.store?.getRouteSession(routeId);
      options.store?.updateRouteSession(routeId, {
        ...current,
        scrollPosition: 0,
      });
      replaceCurrent({ scrollY: 0 });
      writeScrollY(0);
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      cancelPending();
      browserWindow.removeEventListener("scroll", onScroll);
      if (changedBrowserMode && previousScrollRestoration !== undefined) {
        try {
          browserWindow.history.scrollRestoration = previousScrollRestoration;
        } catch {
          // Readonly-like implementations cannot be restored and must not fail disposal.
        }
      }
    },
  };
  return Object.freeze(service);
}
