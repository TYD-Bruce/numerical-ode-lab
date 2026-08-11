import type {
  LabModuleId,
  LabSessionMetadata,
  ModuleTutorSession,
  ResumeSummary,
  RouteId,
  RouteSessionMetadata,
  TutorSessionAccess,
} from "./contracts";
import {
  appendNewExperimentDivider,
  clearTutorConversation,
  createEmptyModuleTutorSession,
  hasUserTutorMessage,
} from "../tutor/moduleTutorSession";

interface StoredLabSession {
  readonly session: unknown;
  readonly labMeaningful: boolean;
  readonly resumeCandidate?: ResumeSummary;
}

export interface AppSessionStore {
  getLab<T>(moduleId: LabModuleId): T | undefined;
  getLabMetadata(moduleId: LabModuleId): LabSessionMetadata | undefined;
  setLab<T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ): void;
  getTutor(moduleId: LabModuleId): ModuleTutorSession;
  updateTutor(
    moduleId: LabModuleId,
    update: (current: ModuleTutorSession) => ModuleTutorSession
  ): void;
  createTutorSessionAccess(moduleId: LabModuleId): TutorSessionAccess;
  getRouteSession(routeId: RouteId): RouteSessionMetadata | undefined;
  updateRouteSession(routeId: RouteId, update: RouteSessionMetadata): void;
  resetLab<T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ): void;
  resetLabForNewExperiment<T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata,
    options: {
      readonly clearTutorConversation: boolean;
      readonly at: number;
      readonly routeId?: RouteId;
    }
  ): void;
  hasMeaningfulWork(): boolean;
  getResumeSummaries(limit?: number): readonly ResumeSummary[];
  subscribe(listener: () => void): () => void;
}

function pureValueError(detail: string): TypeError {
  return new TypeError(`App session state must be a pure value: ${detail}`);
}

function isRuntimePlatformObject(value: object): boolean {
  const constructors = [
    typeof Node === "undefined" ? undefined : Node,
    typeof EventTarget === "undefined" ? undefined : EventTarget,
    typeof AbortController === "undefined" ? undefined : AbortController,
    typeof AbortSignal === "undefined" ? undefined : AbortSignal,
  ];
  return constructors.some(
    (constructor) => constructor !== undefined && value instanceof constructor
  );
}

function inspectPureValue(value: unknown, ancestors: Set<object>): void {
  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return;
  }
  if (typeof value === "function" || typeof value === "symbol") {
    throw pureValueError(`${typeof value}s are runtime values`);
  }
  if (typeof value !== "object") {
    throw pureValueError(`unsupported ${typeof value}`);
  }
  if (ancestors.has(value)) {
    throw pureValueError("cyclic objects are not supported");
  }
  if (isRuntimePlatformObject(value)) {
    throw pureValueError("DOM and browser runtime objects are not supported");
  }

  const prototype = Object.getPrototypeOf(value);
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) {
    throw pureValueError("state must use arrays or plain objects");
  }

  ancestors.add(value);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key === "symbol") {
      throw pureValueError("symbol-keyed fields are not supported");
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor?.get || descriptor?.set) {
      throw pureValueError("accessor properties are not supported");
    }
    inspectPureValue(descriptor?.value, ancestors);
  }
  ancestors.delete(value);
}

/**
 * Pure store values are primitives, arrays, and plain data records only. The
 * assertion walks structure without cloning it and rejects runtime ownership.
 */
export function assertPureValue(value: unknown): void {
  inspectPureValue(value, new Set());
}

function freezePureValue<T>(value: T, visited = new Set<object>()): T {
  if (value === null || typeof value !== "object" || visited.has(value)) return value;
  visited.add(value);
  for (const key of Reflect.ownKeys(value)) {
    freezePureValue(Object.getOwnPropertyDescriptor(value, key)?.value, visited);
  }
  return Object.freeze(value);
}

function sameRouteMetadata(
  a: RouteSessionMetadata | undefined,
  b: RouteSessionMetadata
): boolean {
  return (
    a?.scrollPosition === b.scrollPosition &&
    a?.lastMeaningfulInteraction === b.lastMeaningfulInteraction
  );
}

function userMessageCount(session: ModuleTutorSession): number {
  return session.items.filter(
    (item) => item.kind === "message" && item.role === "user"
  ).length;
}

function sameResumeSummary(
  a: ResumeSummary | undefined,
  b: ResumeSummary | undefined
): boolean {
  return (
    a === b ||
    (a?.moduleId === b?.moduleId &&
      a?.route === b?.route &&
      a?.labTitle === b?.labTitle &&
      a?.stepLabel === b?.stepLabel &&
      a?.methodLabel === b?.methodLabel &&
      a?.analysisLabel === b?.analysisLabel &&
      a?.resultLabel === b?.resultLabel &&
      a?.lastMeaningfulInteraction === b?.lastMeaningfulInteraction)
  );
}

function sameLabMetadata(
  a: LabSessionMetadata | undefined,
  b: LabSessionMetadata
): boolean {
  return (
    a?.labMeaningful === b.labMeaningful &&
    a?.tutorMeaningful === b.tutorMeaningful &&
    a?.meaningful === b.meaningful &&
    a?.lastMeaningfulInteraction === b.lastMeaningfulInteraction &&
    sameResumeSummary(a?.resumeSummary, b.resumeSummary)
  );
}

function latestTimestamp(
  current: number | undefined,
  proposed: number | undefined
): number | undefined {
  const validCurrent =
    Number.isFinite(current) && current! >= 0 ? current : undefined;
  const validProposed =
    Number.isFinite(proposed) && proposed! >= 0 ? proposed : undefined;
  if (validCurrent === undefined) return validProposed;
  if (validProposed === undefined) return validCurrent;
  return Math.max(validCurrent, validProposed);
}

export function createAppSessionStore(
  options: { readonly now?: () => number } = {}
): AppSessionStore {
  let labs: Partial<Record<LabModuleId, StoredLabSession>> = {};
  let labMetadata: Partial<Record<LabModuleId, LabSessionMetadata>> = {};
  let tutors: Record<LabModuleId, ModuleTutorSession> = {
    ode: createEmptyModuleTutorSession(),
    linear_algebra: createEmptyModuleTutorSession(),
    pde: createEmptyModuleTutorSession(),
  };
  let routeSessions: Partial<Record<RouteId, RouteSessionMetadata>> = {};
  const listeners = new Set<() => void>();
  let dividerSequence = 0;

  const notify = () => {
    for (const listener of [...listeners]) listener();
  };

  const updateMaintainedMetadata = (
    moduleId: LabModuleId,
    contribution: {
      readonly labMeaningful: boolean;
      readonly resumeCandidate?: ResumeSummary;
      readonly proposedTimestamp?: number;
    },
    tutorMeaningful: boolean
  ): boolean => {
    const current = labMetadata[moduleId];
    const lastMeaningfulInteraction = latestTimestamp(
      current?.lastMeaningfulInteraction,
      contribution.proposedTimestamp
    );
    const meaningful = contribution.labMeaningful || tutorMeaningful;
    const resumeSummary =
      meaningful &&
      contribution.resumeCandidate &&
      lastMeaningfulInteraction !== undefined
        ? freezePureValue({
            ...contribution.resumeCandidate,
            lastMeaningfulInteraction,
          })
        : undefined;
    const next = freezePureValue({
      labMeaningful: contribution.labMeaningful,
      tutorMeaningful,
      meaningful,
      ...(resumeSummary ? { resumeSummary } : {}),
      ...(lastMeaningfulInteraction === undefined
        ? {}
        : { lastMeaningfulInteraction }),
    });
    if (sameLabMetadata(current, next)) return false;
    labMetadata = { ...labMetadata, [moduleId]: next };
    return true;
  };

  const setLab = <T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ) => {
    assertPureValue(session);
    assertPureValue(metadata);
    const frozenSession = freezePureValue(session);
    const current = labs[moduleId];
    const incomingCandidate = metadata.resumeSummary
      ? freezePureValue({ ...metadata.resumeSummary })
      : undefined;
    const resumeCandidate = sameResumeSummary(
      current?.resumeCandidate,
      incomingCandidate
    )
      ? current?.resumeCandidate
      : incomingCandidate;
    const labChanged =
      current?.session !== frozenSession ||
      current?.labMeaningful !== metadata.labMeaningful ||
      current?.resumeCandidate !== resumeCandidate;
    if (labChanged) {
      labs = {
        ...labs,
        [moduleId]: Object.freeze({
          session: frozenSession,
          labMeaningful: metadata.labMeaningful,
          ...(resumeCandidate ? { resumeCandidate } : {}),
        }),
      };
    }
    const metadataChanged = updateMaintainedMetadata(
      moduleId,
      {
        labMeaningful: metadata.labMeaningful,
        resumeCandidate,
        proposedTimestamp: metadata.lastMeaningfulInteraction,
      },
      hasUserTutorMessage(tutors[moduleId])
    );
    if (labChanged || metadataChanged) notify();
  };

  const store: AppSessionStore = {
    getLab<T>(moduleId: LabModuleId): T | undefined {
      return labs[moduleId]?.session as T | undefined;
    },
    getLabMetadata(moduleId) {
      return labMetadata[moduleId];
    },
    setLab,
    getTutor(moduleId) {
      return tutors[moduleId];
    },
    updateTutor(moduleId, update) {
      const current = tutors[moduleId];
      const next = update(current);
      if (next === current) return;
      assertPureValue(next);
      const frozen = freezePureValue(next);
      tutors = { ...tutors, [moduleId]: frozen };
      const storedLab = labs[moduleId];
      updateMaintainedMetadata(
        moduleId,
        {
          labMeaningful: storedLab?.labMeaningful ?? false,
          resumeCandidate: storedLab?.resumeCandidate,
          ...(userMessageCount(frozen) > userMessageCount(current)
            ? { proposedTimestamp: (options.now ?? Date.now)() }
            : {}),
        },
        hasUserTutorMessage(frozen)
      );
      notify();
    },
    createTutorSessionAccess(moduleId) {
      return Object.freeze({
        moduleId,
        getSession: () => store.getTutor(moduleId),
        updateSession: (
          update: (current: ModuleTutorSession) => ModuleTutorSession
        ) => store.updateTutor(moduleId, update),
      });
    },
    getRouteSession(routeId) {
      return routeSessions[routeId];
    },
    updateRouteSession(routeId, update) {
      const current = routeSessions[routeId];
      if (sameRouteMetadata(current, update)) return;
      assertPureValue(update);
      const frozen = freezePureValue({ ...update });
      routeSessions = { ...routeSessions, [routeId]: frozen };
      notify();
    },
    resetLab: setLab,
    resetLabForNewExperiment(moduleId, session, metadata, resetOptions) {
      assertPureValue(session);
      assertPureValue(metadata);
      const frozenSession = freezePureValue(session);
      const resumeCandidate = metadata.resumeSummary
        ? freezePureValue({ ...metadata.resumeSummary })
        : undefined;
      const currentTutor = tutors[moduleId];
      dividerSequence += 1;
      const nextTutor = resetOptions.clearTutorConversation
        ? clearTutorConversation(currentTutor)
        : appendNewExperimentDivider(currentTutor, {
            id: `new-experiment-${resetOptions.at}-${dividerSequence}`,
            body:
              "Earlier messages refer to the previous experiment. New answers use the current experiment.",
          });
      const tutorMeaningful = hasUserTutorMessage(nextTutor);
      const meaningful = metadata.labMeaningful || tutorMeaningful;
      const timestamp = meaningful && tutorMeaningful
        ? latestTimestamp(undefined, resetOptions.at)
        : undefined;
      const resumeSummary =
        meaningful && resumeCandidate && timestamp !== undefined
          ? freezePureValue({
              ...resumeCandidate,
              lastMeaningfulInteraction: timestamp,
            })
          : undefined;
      labs = {
        ...labs,
        [moduleId]: Object.freeze({
          session: frozenSession,
          labMeaningful: metadata.labMeaningful,
          ...(resumeCandidate ? { resumeCandidate } : {}),
        }),
      };
      tutors = { ...tutors, [moduleId]: freezePureValue(nextTutor) };
      labMetadata = {
        ...labMetadata,
        [moduleId]: freezePureValue({
          labMeaningful: metadata.labMeaningful,
          tutorMeaningful,
          meaningful,
          ...(resumeSummary ? { resumeSummary } : {}),
          ...(timestamp === undefined
            ? {}
            : { lastMeaningfulInteraction: timestamp }),
        }),
      };
      if (resetOptions.routeId) {
        const currentRoute = routeSessions[resetOptions.routeId];
        routeSessions = {
          ...routeSessions,
          [resetOptions.routeId]: freezePureValue({
            ...currentRoute,
            scrollPosition: 0,
          }),
        };
      }
      notify();
    },
    hasMeaningfulWork() {
      return Object.values(labMetadata).some((metadata) => metadata?.meaningful);
    },
    getResumeSummaries(limit = 3) {
      const summaries = Object.values(labMetadata)
        .filter(
          (metadata): metadata is LabSessionMetadata & {
            readonly resumeSummary: ResumeSummary;
            readonly lastMeaningfulInteraction: number;
          } =>
            metadata?.meaningful === true &&
            metadata.resumeSummary !== undefined &&
            Number.isFinite(metadata.lastMeaningfulInteraction) &&
            metadata.lastMeaningfulInteraction! >= 0
        )
        .map((metadata) => metadata.resumeSummary)
        .sort(
          (a, b) => b.lastMeaningfulInteraction - a.lastMeaningfulInteraction
        )
        .slice(0, Math.max(0, limit));
      return Object.freeze(summaries);
    },
    subscribe(listener) {
      listeners.add(listener);
      let subscribed = true;
      return () => {
        if (!subscribed) return;
        subscribed = false;
        listeners.delete(listener);
      };
    },
  };

  return store;
}
