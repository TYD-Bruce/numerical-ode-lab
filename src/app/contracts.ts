export type RouteId =
  | "home"
  | "ode-overview"
  | "ode-initial-value-problems"
  | "linear-algebra-overview"
  | "pde-overview"
  | "about"
  | "not-found";

export type LabModuleId = "ode" | "linear_algebra" | "pde";

export interface ResumeSummary {
  readonly moduleId: LabModuleId;
  readonly route: string;
  readonly labTitle: string;
  readonly stepLabel: "Method" | "Data" | "Output";
  readonly methodLabel?: string;
  readonly analysisLabel?: "Analysis available" | "Analysis stale";
  readonly lastMeaningfulInteraction: number;
}

export interface LabSessionMetadata {
  readonly meaningful: boolean;
  readonly resumeSummary?: ResumeSummary;
  readonly lastMeaningfulInteraction?: number;
}

export interface RouteSessionMetadata {
  readonly scrollPosition?: number;
  readonly lastMeaningfulInteraction?: number;
}

export type TutorTranscriptItem =
  | {
      readonly kind: "message";
      readonly role: "user" | "assistant";
      readonly content: string;
    }
  | {
      readonly kind: "divider";
      readonly id: string;
      readonly title: "New experiment started";
      readonly body: string;
    };

export interface ModuleTutorSession {
  readonly items: readonly TutorTranscriptItem[];
  readonly draftMessage: string;
  readonly desktopOpen: boolean;
}

export interface TutorSessionAccess {
  readonly moduleId: LabModuleId;
  getSession(): ModuleTutorSession;
  updateSession(
    update: (current: ModuleTutorSession) => ModuleTutorSession
  ): void;
}

export type TutorPromptProfile = "ode" | "linear_algebra" | "pde";

export interface LabTutorBinding<TContext> {
  readonly moduleId: LabModuleId;
  readonly promptProfile: TutorPromptProfile;
  readonly suggestedQuestions: readonly string[];
  getContext(): TContext | undefined;
  prepareForOpen?(): void;
}

export interface ConfirmedLabReset<TSession> {
  readonly session: TSession;
  readonly metadata: LabSessionMetadata;
}

export interface LabLifecycleCallbacks<TSession> {
  updateSession(
    session: TSession,
    metadata: LabSessionMetadata
  ): void;
  recordMeaningfulInteraction?(at: number): void;
  applyConfirmedReset?(request: ConfirmedLabReset<TSession>): void;
}

export interface NavigateOptions {
  replace?: boolean;
  scroll?: "auto" | "top" | "preserve";
}

export type Navigate = (
  path: string,
  options?: NavigateOptions
) => Promise<void>;

export interface RouteLocation {
  pathname: string;
  search: string;
  hash: string;
}

export interface MountedRoute {
  ready?: Promise<void>;
  dispose(): void;
}

export interface RouteModule {
  mount(options: {
    target: HTMLElement;
    navigate: Navigate;
    location: RouteLocation;
  }): MountedRoute;
}
