/**
 * Compatibility export for callers that have not yet moved to the shared
 * first-open Tutor runtime. Conversation ownership lives in AppSessionStore.
 */
export {
  mountPlatformTutorPanel,
  type MountedPlatformTutorPanel,
  type PlatformTutorPanelOptions,
} from "./platformTutorPanel";
