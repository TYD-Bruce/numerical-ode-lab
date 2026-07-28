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
import { createRouteLoader } from "./routeLoader";
import { createPlatformRouter, type PlatformRouter } from "./router";
import {
  createScrollRestoration,
  type ScrollRestoration,
} from "./scrollRestoration";
import type {
  GlossaryDevelopmentControlsCleanup,
  GlossaryDevelopmentControlsModule,
} from "../dev/glossary/glossaryDevelopmentControls";

const GLOSSARY_PLAYGROUND_PATH = "/__dev/glossary-playground";

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
  readonly enableDevelopmentTools?: boolean;
  readonly loadDevelopmentControls?: () => Promise<
    GlossaryDevelopmentControlsModule
  >;
}): PlatformBootstrap {
  const developmentToolsEnabled =
    import.meta.env.DEV && (options.enableDevelopmentTools ?? true);
  let developmentModuleAttempt:
    | Promise<GlossaryDevelopmentControlsModule>
    | undefined;
  const loadDevelopmentModule =
    (): Promise<GlossaryDevelopmentControlsModule> => {
      if (developmentModuleAttempt) return developmentModuleAttempt;
      const loader =
        options.loadDevelopmentControls ??
        (() => {
          const modulePath =
            "../dev/glossary/glossaryDevelopmentControls.ts";
          return import(
            /* @vite-ignore */
            modulePath
          ) as Promise<GlossaryDevelopmentControlsModule>;
        });
      developmentModuleAttempt = loader().catch((error: unknown) => {
        developmentModuleAttempt = undefined;
        throw error;
      });
      return developmentModuleAttempt;
    };
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
  const routes = createRouteDefinitions({
    initialValueProblemsLoader: registry.loadInitialValueProblems,
    homeSessionSource: store,
    developmentRoutes: developmentToolsEnabled
      ? options.developmentRoutes ?? [
          {
            id: "glossary-playground",
            path: GLOSSARY_PLAYGROUND_PATH,
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
      : [],
  }).map((definition) =>
    developmentToolsEnabled && definition.id === "about"
      ? {
          ...definition,
          loader: createRouteLoader(() =>
            loadDevelopmentModule().then((module) =>
              module.createGlossaryDevelopmentAboutPage({
                playgroundPath: GLOSSARY_PLAYGROUND_PATH,
              })
            )
          ),
        }
      : definition
  );
  const router = createPlatformRouter({
    shell,
    routes,
    scrollRestoration,
    onNavigationStart: () => {
      glossaryHost.close({ restoreFocus: false });
      glossaryHost.disconnect();
      tutorHost.closeMobileForNavigation();
    },
  });
  let disposed = false;
  let disposeDevelopmentControls:
    | GlossaryDevelopmentControlsCleanup
    | undefined;
  const handleBeforeUnload = createBeforeUnloadHandler(store);
  window.addEventListener("beforeunload", handleBeforeUnload);
  router.start();
  if (developmentToolsEnabled) {
    void loadDevelopmentModule()
      .then((module) => {
        if (disposed) return;
        disposeDevelopmentControls = module.installGlossaryDevelopmentControls({
          navigate: router.navigate,
          playgroundPath: GLOSSARY_PLAYGROUND_PATH,
        });
      })
      .catch(() => undefined);
  }

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
      disposeDevelopmentControls?.();
      disposeDevelopmentControls = undefined;
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
