import type {
  LabModuleId,
  LabRouteModule,
  LabSessionMetadata,
  RouteModule,
  RouteId,
} from "./contracts";
import type { AppSessionStore } from "./appSessionStore";
import type { PlatformTutorHost } from "./platformTutorHost";
import type { PlatformGlossaryHost } from "./platformGlossaryHost";
import type { ScrollRestoration } from "./scrollRestoration";

export function createCompleteLabRoute<TSession>(options: {
  readonly moduleId: LabModuleId;
  readonly labModule: LabRouteModule<TSession>;
  readonly store: AppSessionStore;
  readonly tutorHost: PlatformTutorHost;
  readonly glossaryHost: PlatformGlossaryHost;
  readonly routeId: RouteId;
  readonly scrollRestoration: ScrollRestoration;
}): RouteModule {
  const route: RouteModule = {
    mount({ target, navigate }) {
      const initialSession =
        options.store.getLab<TSession>(options.moduleId) ??
        options.labModule.createBeginnerStarterSession();
      let latestMetadata: LabSessionMetadata =
        options.store.getLabMetadata(options.moduleId) ?? {
          labMeaningful: false,
          tutorMeaningful: false,
          meaningful: false,
        };
      let disposed = false;
      const mountedLab = options.labModule.mount({
        target,
        session: initialSession,
        navigate,
        lifecycle: {
          updateSession(session, metadata) {
            if (disposed) return;
            latestMetadata = {
              ...metadata,
              tutorMeaningful: latestMetadata.tutorMeaningful,
              meaningful:
                metadata.labMeaningful || latestMetadata.tutorMeaningful,
              ...(metadata.lastMeaningfulInteraction === undefined &&
              latestMetadata.lastMeaningfulInteraction !== undefined
                ? {
                  lastMeaningfulInteraction:
                      latestMetadata.lastMeaningfulInteraction,
                }
                : {}),
            };
            options.store.setLab(options.moduleId, session, latestMetadata);
          },
          recordMeaningfulInteraction(at) {
            latestMetadata = {
              ...latestMetadata,
              lastMeaningfulInteraction: at,
            };
          },
          applyConfirmedReset(request) {
            if (disposed) return;
            options.tutorHost.invalidateCurrentRequest();
            options.store.resetLabForNewExperiment(
              options.moduleId,
              request.session,
              request.metadata,
              {
                clearTutorConversation: request.clearTutorConversation,
                at: request.at,
                routeId: options.routeId,
              }
            );
            latestMetadata =
              options.store.getLabMetadata(options.moduleId) ?? request.metadata;
            options.scrollRestoration.resetCurrentRoute(options.routeId);
            options.tutorHost.refresh();
          },
        },
      });

      try {
        const glossaryBinding = mountedLab.getGlossaryBinding?.();
        if (glossaryBinding) options.glossaryHost.connect(glossaryBinding);
        options.tutorHost.connect(
          mountedLab.getTutorBinding(),
          options.store.createTutorSessionAccess(options.moduleId)
        );
      } catch (cause) {
        options.glossaryHost.close({ restoreFocus: false });
        options.glossaryHost.disconnect();
        options.tutorHost.disconnect();
        mountedLab.dispose();
        target.replaceChildren();
        throw cause;
      }

      return Object.freeze({
        ready: mountedLab.ready,
        dispose(): void {
          if (disposed) return;
          disposed = true;
          options.glossaryHost.close({ restoreFocus: false });
          options.glossaryHost.disconnect();
          options.tutorHost.closeMobileForNavigation();
          try {
            const resumeSummary = mountedLab.getResumeSummary();
            if (resumeSummary) {
              latestMetadata = { ...latestMetadata, resumeSummary };
            }
            options.store.setLab(
              options.moduleId,
              mountedLab.getSession(),
              latestMetadata
            );
          } finally {
            options.tutorHost.disconnect();
            mountedLab.dispose();
            target.replaceChildren();
          }
        },
      });
    },
  };
  return Object.freeze(route);
}
