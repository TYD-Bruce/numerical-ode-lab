import type { LabRouteModule, RouteModule } from "./contracts";
import type { AppSessionStore } from "./appSessionStore";
import type { PlatformTutorHost } from "./platformTutorHost";
import type { PlatformGlossaryHost } from "./platformGlossaryHost";
import { createCompleteLabRoute } from "./labRouteAdapter";
import type { ScrollRestoration } from "./scrollRestoration";

export interface PlatformModuleRegistry {
  loadInitialValueProblems(): Promise<RouteModule>;
  loadLinearSystems(): Promise<RouteModule>;
}

export function createPlatformModuleRegistry(options: {
  readonly store: AppSessionStore;
  readonly tutorHost: PlatformTutorHost;
  readonly glossaryHost: PlatformGlossaryHost;
  readonly scrollRestoration: ScrollRestoration;
  readonly initialValueProblemsLoader?: () => Promise<LabRouteModule<unknown>>;
  readonly linearSystemsLoader?: () => Promise<LabRouteModule<unknown>>;
}): PlatformModuleRegistry {
  const loadInitialValueProblemsLab =
    options.initialValueProblemsLoader ??
    (() =>
      import("../labs/ode/initialValueProblemsRoute") as Promise<
        LabRouteModule<unknown>
      >);
  const loadLinearSystemsLab =
    options.linearSystemsLoader ??
    (() =>
      import("../labs/linear-algebra/linearSystemsRoute") as Promise<
        LabRouteModule<unknown>
      >);

  return Object.freeze({
    async loadInitialValueProblems(): Promise<RouteModule> {
      const labModule = await loadInitialValueProblemsLab();
      return createCompleteLabRoute({
        moduleId: "ode",
        labModule,
        store: options.store,
        tutorHost: options.tutorHost,
        glossaryHost: options.glossaryHost,
        routeId: "ode-initial-value-problems",
        scrollRestoration: options.scrollRestoration,
      });
    },
    async loadLinearSystems(): Promise<RouteModule> {
      const labModule = await loadLinearSystemsLab();
      return createCompleteLabRoute({
        moduleId: "linear_algebra",
        labModule,
        store: options.store,
        tutorHost: options.tutorHost,
        glossaryHost: options.glossaryHost,
        routeId: "linear-algebra-linear-systems",
        scrollRestoration: options.scrollRestoration,
      });
    },
  });
}
