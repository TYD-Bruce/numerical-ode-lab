import type { LabRouteModule, Navigate } from "./contracts";
import { createAppSessionStore, type AppSessionStore } from "./appSessionStore";
import { createBeforeUnloadHandler } from "./beforeUnload";
import { createAppShell, type AppShell } from "./appShell";
import { createPlatformModuleRegistry } from "./moduleRegistry";
import {
  createPlatformTutorHost,
  type PlatformTutorHost,
} from "./platformTutorHost";
import {
  createPlatformGlossaryHost,
  type PlatformGlossaryHost,
} from "./platformGlossaryHost";
import { createPlatformModalEnvironment } from "./platformModalEnvironment";
import {
  createRouteDefinitions,
  type DevelopmentRouteDefinitionInput,
} from "./routeDefinitions";
import { createPlatformRouter, type PlatformRouter } from "./router";
import {
  createScrollRestoration,
  type ScrollRestoration,
} from "./scrollRestoration";

export interface PlatformBootstrap {
  readonly store: AppSessionStore;
  readonly shell: AppShell;
  readonly tutorHost: PlatformTutorHost;
  readonly glossaryHost: PlatformGlossaryHost;
  readonly router: PlatformRouter;
  readonly scrollRestoration: ScrollRestoration;
  readonly navigate: Navigate;
  dispose(): void;
}

export function createPlatformBootstrap(options: {
  readonly target: HTMLElement;
  readonly store?: AppSessionStore;
  readonly tutorHost?: PlatformTutorHost;
  readonly glossaryHost?: PlatformGlossaryHost;
  readonly initialValueProblemsLoader?: () => Promise<LabRouteModule<unknown>>;
  readonly developmentRoutes?: readonly DevelopmentRouteDefinitionInput[];
}): PlatformBootstrap {
  const store = options.store ?? createAppSessionStore();
  const shell = createAppShell(options.target);
  const modalEnvironment = createPlatformModalEnvironment();
  let glossaryHost: PlatformGlossaryHost;
  const tutorHost =
    options.tutorHost ??
    createPlatformTutorHost({
      target: shell.tutorRegion,
      labTarget: shell.outlet,
      modalEnvironment,
      modalBackground: () => {
        shell.closeMobileMenu();
        return shell.modalBackgroundFor("tutor");
      },
      onBeforeManualOpen: () =>
        glossaryHost?.close({ restoreFocus: false }),
    });
  glossaryHost =
    options.glossaryHost ??
    createPlatformGlossaryHost({
      target: shell.glossaryRegion,
      statusRegion: shell.glossaryStatus,
      modalEnvironment,
      modalBackground: () => {
        shell.closeMobileMenu();
        return shell.modalBackgroundFor("glossary");
      },
      tutorPresentation: tutorHost,
    });
  const scrollRestoration = createScrollRestoration({ store });
  const registry = createPlatformModuleRegistry({
    store,
    tutorHost,
    glossaryHost,
    scrollRestoration,
    initialValueProblemsLoader: options.initialValueProblemsLoader,
  });
  const router = createPlatformRouter({
    shell,
    routes: createRouteDefinitions({
      initialValueProblemsLoader: registry.loadInitialValueProblems,
      homeSessionSource: store,
      developmentRoutes:
        options.developmentRoutes ??
        (import.meta.env.DEV
          ? [
              {
                id: "glossary-playground",
                path: "/__dev/glossary-playground",
                title: "Glossary Playground | Numerical T-Lab",
                kind: "page",
                loader: () => {
                  const modulePath =
                    "../dev/glossary/glossaryPlaygroundRoute.ts";
                  return (
                    import(
                      /* @vite-ignore */
                      modulePath
                    ) as Promise<
                      typeof import("../dev/glossary/glossaryPlaygroundRoute")
                    >
                  ).then(
                    (module) =>
                      module.createGlossaryPlaygroundRoute({ glossaryHost })
                  );
                },
              },
            ]
          : []),
    }),
    scrollRestoration,
    onNavigationStart: () => {
      glossaryHost.close({ restoreFocus: false });
      glossaryHost.disconnect();
      tutorHost.closeMobileForNavigation();
    },
  });
  let disposed = false;
  const handleBeforeUnload = createBeforeUnloadHandler(store);
  window.addEventListener("beforeunload", handleBeforeUnload);
  router.start();

  return Object.freeze({
    store,
    shell,
    tutorHost,
    glossaryHost,
    router,
    scrollRestoration,
    navigate: router.navigate,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.dispose();
      tutorHost.disconnect();
      tutorHost.dispose();
      glossaryHost.disconnect();
      glossaryHost.dispose();
      modalEnvironment.dispose();
      options.target.replaceChildren();
    },
  });
}
