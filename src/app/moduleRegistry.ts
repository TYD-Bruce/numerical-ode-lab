import type { LabRouteModule, RouteModule } from "./contracts";
import type { AppSessionStore } from "./appSessionStore";
import type { PlatformTutorHost } from "./platformTutorHost";
import { createCompleteLabRoute } from "./labRouteAdapter";
import type { ScrollRestoration } from "./scrollRestoration";

export interface PlatformModuleRegistry {
  loadInitialValueProblems(): Promise<RouteModule>;
}

export function createPlatformModuleRegistry(options: {
  readonly store: AppSessionStore;
  readonly tutorHost: PlatformTutorHost;
  readonly scrollRestoration: ScrollRestoration;
  readonly initialValueProblemsLoader?: () => Promise<LabRouteModule<unknown>>;
}): PlatformModuleRegistry {
  const loadLab =
    options.initialValueProblemsLoader ??
    (() =>
      import("../ode/initialValueProblemsRoute") as Promise<
        LabRouteModule<unknown>
      >);

  return Object.freeze({
    async loadInitialValueProblems(): Promise<RouteModule> {
      const labModule = await loadLab();
      return createCompleteLabRoute({
        moduleId: "ode",
        labModule,
        store: options.store,
        tutorHost: options.tutorHost,
        routeId: "ode-initial-value-problems",
        scrollRestoration: options.scrollRestoration,
      });
    },
  });
}
