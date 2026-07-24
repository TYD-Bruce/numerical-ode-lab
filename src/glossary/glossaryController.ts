import type { LabModuleId } from "../app/contracts";
import {
  createGlossaryDiagnosticSink,
  defaultGlossaryValidationPolicy,
  validateScopeId,
} from "./glossaryBuilders";
import type { GlossaryRegistry } from "./glossaryRegistry";
import {
  createDisabledGlossaryScope,
  createGlossaryScope,
  type InternalGlossaryScope,
} from "./glossaryScope";
import type {
  GlossaryBindingIdentity,
  GlossaryHostPort,
  GlossaryReplacementCandidate,
  GlossaryReplacementResult,
  GlossaryScopeContextSource,
  GlossaryScopeController,
  GlossaryScopeId,
  GlossaryScopeRerenderTransaction,
  GlossaryTermIdentity,
  GlossaryValidationPolicy,
} from "./glossaryRuntimeTypes";

export interface LabGlossaryBinding {
  readonly moduleId: LabModuleId;
  readonly identity: GlossaryBindingIdentity;
  connect(port: GlossaryHostPort): () => void;
  createScope(options: {
    readonly id: GlossaryScopeId;
    readonly context?: GlossaryScopeContextSource;
  }): GlossaryScopeController;
  beginScopeRerender(options: {
    readonly id: GlossaryScopeId;
    readonly context?: GlossaryScopeContextSource;
  }): GlossaryScopeRerenderTransaction;
  dispose(): void;
}

interface ActiveConnection {
  readonly port: GlossaryHostPort;
  readonly token: object;
}

interface InternalTransaction {
  readonly public: GlossaryScopeRerenderTransaction;
  invalidate(): void;
}

export function createLabGlossaryBinding(options: {
  readonly moduleId: LabModuleId;
  readonly registry: GlossaryRegistry;
  readonly policy?: GlossaryValidationPolicy;
}): LabGlossaryBinding {
  const diagnostics = createGlossaryDiagnosticSink(
    options.policy ?? defaultGlossaryValidationPolicy
  );
  const identity: GlossaryBindingIdentity = Object.freeze({
    moduleId: options.moduleId,
  });
  const scopes = new Map<GlossaryScopeId, InternalGlossaryScope>();
  const generations = new Map<GlossaryScopeId, number>();
  const transactions = new Map<GlossaryScopeId, InternalTransaction>();
  let connection: ActiveConnection | undefined;
  let disposed = false;

  const getPort = (): GlossaryHostPort | undefined => connection?.port;

  const createInternalScope = (scopeOptions: {
    readonly id: GlossaryScopeId;
    readonly context?: GlossaryScopeContextSource;
  }): InternalGlossaryScope => {
    const generation = (generations.get(scopeOptions.id) ?? 0) + 1;
    generations.set(scopeOptions.id, generation);
    const scope = createGlossaryScope({
      moduleId: options.moduleId,
      binding: identity,
      id: scopeOptions.id,
      generation,
      registry: options.registry,
      context: scopeOptions.context,
      diagnostics,
      getPort,
      onDisposed: (disposedScope) => {
        if (scopes.get(scopeOptions.id) === disposedScope) {
          scopes.delete(scopeOptions.id);
        }
      },
    });
    scopes.set(scopeOptions.id, scope);
    return scope;
  };

  const rejectUnavailableScope = (
    id: GlossaryScopeId,
    code: "binding_disposed" | "duplicate_scope_id" | "rerender_conflict"
  ): GlossaryScopeController => {
    diagnostics.reject({ code, scopeId: String(id) });
    return createDisabledGlossaryScope(id, diagnostics, true);
  };

  const binding: LabGlossaryBinding = {
    moduleId: options.moduleId,
    identity,
    connect(port): () => void {
      if (disposed) {
        diagnostics.reject({ code: "binding_disposed" });
        return () => undefined;
      }
      if (connection) {
        diagnostics.reject({ code: "connection_conflict" });
        return () => undefined;
      }
      const active: ActiveConnection = Object.freeze({
        port,
        token: Object.freeze({}),
      });
      connection = active;
      let disconnected = false;
      return () => {
        if (disconnected) return;
        disconnected = true;
        if (connection?.token === active.token) connection = undefined;
      };
    },
    createScope(scopeOptions): GlossaryScopeController {
      if (disposed) {
        return rejectUnavailableScope(scopeOptions.id, "binding_disposed");
      }
      const id = validateScopeId(scopeOptions.id, diagnostics);
      if (id === undefined) {
        return createDisabledGlossaryScope(scopeOptions.id, diagnostics);
      }
      if (transactions.has(id)) {
        return rejectUnavailableScope(id, "rerender_conflict");
      }
      if (scopes.has(id)) {
        return rejectUnavailableScope(id, "duplicate_scope_id");
      }
      return createInternalScope({ id, context: scopeOptions.context }).controller;
    },
    beginScopeRerender(scopeOptions): GlossaryScopeRerenderTransaction {
      if (disposed) {
        const scope = rejectUnavailableScope(
          scopeOptions.id,
          "binding_disposed"
        );
        return inertTransaction(scope);
      }
      const id = validateScopeId(scopeOptions.id, diagnostics);
      if (id === undefined) {
        return inertTransaction(
          createDisabledGlossaryScope(scopeOptions.id, diagnostics)
        );
      }
      const existingTransaction = transactions.get(id);
      if (existingTransaction) {
        if (diagnostics.policy.mode === "strict") {
          diagnostics.reject({ code: "rerender_conflict", scopeId: id });
        }
        existingTransaction.public.abort();
        diagnostics.reject({ code: "rerender_conflict", scopeId: id });
        return inertTransaction(createDisabledGlossaryScope(id, diagnostics));
      }

      const oldScope = scopes.get(id);
      const connectionAtBegin = connection;
      const candidate =
        oldScope && connectionAtBegin
          ? connectionAtBegin.port.beginScopeRerender(oldScope.identity)
          : undefined;
      const candidateWasRegistered =
        candidate !== undefined &&
        oldScope?.findTermIdentity(candidate.identity.termId) ===
          candidate.identity;
      oldScope?.disposeForReplacement();
      const replacement = createInternalScope({
        id,
        context: scopeOptions.context,
      });
      let active = true;

      const finish = (): boolean => {
        if (!active) return false;
        active = false;
        if (transactions.get(id) === internal) transactions.delete(id);
        return true;
      };
      const notifyClosed = (): void => {
        if (connectionAtBegin && connection === connectionAtBegin) {
          connectionAtBegin.port.replacementCommitted(
            Object.freeze({
              kind: "closed",
              scope: replacement.identity,
              ...(candidate === undefined ? {} : { previous: candidate }),
            })
          );
        }
      };

      const transaction: GlossaryScopeRerenderTransaction = Object.freeze({
        scope: replacement.controller,
        commit(): void {
          if (!finish()) return;
          if (!connectionAtBegin || connection !== connectionAtBegin) return;
          const replacementIdentity = matchingReplacement(
            candidate,
            oldScope,
            replacement,
            scopes,
            identity,
            options.moduleId,
            candidateWasRegistered
          );
          const result: GlossaryReplacementResult =
            candidate && replacementIdentity
              ? Object.freeze({
                  kind: "transferred",
                  previous: candidate,
                  replacement: replacementIdentity,
                })
              : Object.freeze({
                  kind: "closed",
                  scope: replacement.identity,
                  ...(candidate === undefined ? {} : { previous: candidate }),
                });
          connectionAtBegin.port.replacementCommitted(result);
        },
        abort(): void {
          if (!finish()) return;
          if (scopes.get(id) === replacement) {
            replacement.disposeWithoutNotification();
          }
          notifyClosed();
        },
      });
      const internal: InternalTransaction = {
        public: transaction,
        invalidate(): void {
          if (!finish()) return;
          if (scopes.get(id) === replacement) {
            replacement.disposeWithoutNotification();
          }
        },
      };
      transactions.set(id, internal);
      return transaction;
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      connection = undefined;
      for (const transaction of [...transactions.values()]) {
        transaction.invalidate();
      }
      transactions.clear();
      for (const scope of [...scopes.values()]) {
        scope.disposeWithoutNotification();
      }
      scopes.clear();
    },
  };
  return Object.freeze(binding);
}

function matchingReplacement(
  candidate: GlossaryReplacementCandidate | undefined,
  oldScope: InternalGlossaryScope | undefined,
  replacement: InternalGlossaryScope,
  scopes: ReadonlyMap<GlossaryScopeId, InternalGlossaryScope>,
  binding: GlossaryBindingIdentity,
  moduleId: LabModuleId,
  candidateWasRegistered: boolean
): GlossaryTermIdentity | undefined {
  if (
    !candidate ||
    !candidateWasRegistered ||
    (candidate.mode !== "pinned" && candidate.mode !== "mobile-sheet") ||
    !oldScope ||
    candidate.identity.binding !== binding ||
    candidate.identity.scope !== oldScope.identity ||
    candidate.identity.moduleId !== moduleId ||
    candidate.identity.scopeId !== oldScope.identity.scopeId ||
    candidate.identity.scopeGeneration !== oldScope.identity.generation ||
    scopes.get(replacement.identity.scopeId) !== replacement
  ) {
    return undefined;
  }
  const next = replacement.findTermIdentity(candidate.identity.termId);
  if (
    !next ||
    next.binding !== binding ||
    next.scope !== replacement.identity ||
    next.moduleId !== moduleId ||
    next.scopeId !== candidate.identity.scopeId ||
    next.termId !== candidate.identity.termId ||
    next.scopeGeneration !== replacement.identity.generation
  ) {
    return undefined;
  }
  return next;
}

function inertTransaction(
  scope: GlossaryScopeController
): GlossaryScopeRerenderTransaction {
  return Object.freeze({
    scope,
    commit: () => undefined,
    abort: () => scope.dispose(),
  });
}

export type {
  GlossaryHostPort,
  GlossaryScopeContextSource,
  GlossaryScopeRerenderTransaction,
};
