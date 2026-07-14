import type {
  LabModuleId,
  LabRouteModule,
  LabSessionMetadata,
  RouteModule,
} from "./contracts";
import type { AppSessionStore } from "./appSessionStore";
import type { PlatformTutorHost } from "./platformTutorHost";

export function createCompleteLabRoute<TSession>(options: {
  readonly moduleId: LabModuleId;
  readonly labModule: LabRouteModule<TSession>;
  readonly store: AppSessionStore;
  readonly tutorHost: PlatformTutorHost;
}): RouteModule {
  const route: RouteModule = {
    mount({ target, navigate }) {
      const initialSession =
        options.store.getLab<TSession>(options.moduleId) ??
        options.labModule.createBeginnerStarterSession();
      let latestMetadata: LabSessionMetadata =
        options.store.getLabMetadata(options.moduleId) ?? { meaningful: false };
      let disposed = false;
      const mountedLab = options.labModule.mount({
        target,
        session: initialSession,
        navigate,
        lifecycle: {
          updateSession(session, metadata) {
            if (disposed) return;
            latestMetadata = metadata;
            options.store.setLab(options.moduleId, session, metadata);
          },
          recordMeaningfulInteraction(at) {
            latestMetadata = {
              ...latestMetadata,
              meaningful: true,
              lastMeaningfulInteraction: at,
            };
          },
          applyConfirmedReset(request) {
            if (disposed) return;
            latestMetadata = request.metadata;
            options.store.resetLab(
              options.moduleId,
              request.session,
              request.metadata
            );
          },
        },
      });

      try {
        options.tutorHost.connect(
          mountedLab.getTutorBinding(),
          options.store.createTutorSessionAccess(options.moduleId)
        );
      } catch (cause) {
        mountedLab.dispose();
        target.replaceChildren();
        throw cause;
      }

      return Object.freeze({
        ready: mountedLab.ready,
        dispose(): void {
          if (disposed) return;
          disposed = true;
          options.tutorHost.closeMobileForNavigation();
          try {
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
