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
  createEmptyModuleTutorSession,
  hasUserTutorMessage,
} from "../tutor/moduleTutorSession";

interface StoredLabSession {
  readonly session: unknown;
  readonly metadata: LabSessionMetadata;
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

export function createAppSessionStore(): AppSessionStore {
  let labs: Partial<Record<LabModuleId, StoredLabSession>> = {};
  let tutors: Record<LabModuleId, ModuleTutorSession> = {
    ode: createEmptyModuleTutorSession(),
    linear_algebra: createEmptyModuleTutorSession(),
    pde: createEmptyModuleTutorSession(),
  };
  let routeSessions: Partial<Record<RouteId, RouteSessionMetadata>> = {};
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of [...listeners]) listener();
  };

  const setLab = <T>(
    moduleId: LabModuleId,
    session: T,
    metadata: LabSessionMetadata
  ) => {
    assertPureValue(session);
    assertPureValue(metadata);
    const frozenSession = freezePureValue(session);
    const frozenMetadata = freezePureValue({ ...metadata });
    const current = labs[moduleId];
    if (current?.session === frozenSession && current.metadata === frozenMetadata) return;
    labs = {
      ...labs,
      [moduleId]: Object.freeze({ session: frozenSession, metadata: frozenMetadata }),
    };
    notify();
  };

  const store: AppSessionStore = {
    getLab<T>(moduleId: LabModuleId): T | undefined {
      return labs[moduleId]?.session as T | undefined;
    },
    getLabMetadata(moduleId) {
      return labs[moduleId]?.metadata;
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
    hasMeaningfulWork() {
      return (
        Object.values(labs).some((stored) => stored?.metadata.meaningful) ||
        Object.values(tutors).some(hasUserTutorMessage)
      );
    },
    getResumeSummaries(limit = 3) {
      const summaries = Object.values(labs)
        .filter(
          (stored): stored is StoredLabSession =>
            stored?.metadata.meaningful === true &&
            stored.metadata.resumeSummary !== undefined
        )
        .map((stored) => stored.metadata.resumeSummary!)
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
