import type { LabRouteModule, Navigate } from "./contracts";
import { createAppSessionStore, type AppSessionStore } from "./appSessionStore";
import { createBeforeUnloadHandler } from "./beforeUnload";
import { createAppShell, type AppShell } from "./appShell";
import { createPlatformModuleRegistry } from "./moduleRegistry";
import {
  createPlatformTutorHost,
  type PlatformTutorHost,
} from "./platformTutorHost";
import { createRouteDefinitions } from "./routeDefinitions";
import { createPlatformRouter, type PlatformRouter } from "./router";

export interface PlatformBootstrap {
  readonly store: AppSessionStore;
  readonly shell: AppShell;
  readonly tutorHost: PlatformTutorHost;
  readonly router: PlatformRouter;
  readonly navigate: Navigate;
  dispose(): void;
}

export function createPlatformBootstrap(options: {
  readonly target: HTMLElement;
  readonly store?: AppSessionStore;
  readonly tutorHost?: PlatformTutorHost;
  readonly initialValueProblemsLoader?: () => Promise<LabRouteModule<unknown>>;
}): PlatformBootstrap {
  const store = options.store ?? createAppSessionStore();
  const shell = createAppShell(options.target);
  const tutorHost =
    options.tutorHost ??
    createPlatformTutorHost({
      target: shell.tutorRegion,
      labTarget: shell.outlet,
    });
  const registry = createPlatformModuleRegistry({
    store,
    tutorHost,
    initialValueProblemsLoader: options.initialValueProblemsLoader,
  });
  const router = createPlatformRouter({
    shell,
    routes: createRouteDefinitions({
      initialValueProblemsLoader: registry.loadInitialValueProblems,
      homeSessionSource: store,
    }),
  });
  let disposed = false;
  const handleBeforeUnload = createBeforeUnloadHandler(store);
  window.addEventListener("beforeunload", handleBeforeUnload);
  router.start();

  return Object.freeze({
    store,
    shell,
    tutorHost,
    router,
    navigate: router.navigate,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.dispose();
      tutorHost.disconnect();
      tutorHost.dispose();
      options.target.replaceChildren();
    },
  });
}
