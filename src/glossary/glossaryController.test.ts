// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryScopeId,
  defineGlossaryTermId,
  GlossaryValidationError,
} from "./glossaryBuilders";
import { createLabGlossaryBinding } from "./glossaryController";
import { createGlossaryRegistry } from "./glossaryRegistry";
import type {
  GlossaryHostPort,
  GlossaryReplacementCandidate,
  GlossaryReplacementResult,
  GlossaryScopeContextSource,
  GlossarySurfaceRequest,
} from "./glossaryRuntimeTypes";

const strict = createGlossaryValidationPolicy({ mode: "strict" });
const termId = defineGlossaryTermId("test_term", strict)!;
const scopeId = defineGlossaryScopeId("test_scope", strict)!;

function registry() {
  return createGlossaryRegistry({
    coreEntries: [
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          aliases: [],
          definition: "Content-neutral definition.",
          whyItMatters: "Content-neutral reason.",
          tutorTopic: "test topic",
        },
        strict
      )!,
    ],
    policy: strict,
  });
}

function hostPort(candidate?: () => GlossaryReplacementCandidate | undefined) {
  const requests: GlossarySurfaceRequest[] = [];
  const results: GlossaryReplacementResult[] = [];
  const port: GlossaryHostPort = {
    requestOpen: vi.fn((request) => requests.push(request)),
    requestClose: vi.fn(),
    beginScopeRerender: vi.fn(() => candidate?.()),
    scopeDisposed: vi.fn(),
    replacementCommitted: vi.fn((result) => results.push(result)),
  };
  return { port, requests, results };
}

function openTerm(
  binding: ReturnType<typeof createLabGlossaryBinding>,
  id = scopeId
) {
  const scope = binding.createScope({ id });
  const term = scope.createTerm({ termId, display: "Test term" });
  expect(term.kind).toBe("interactive");
  if (term.kind !== "interactive") throw new Error("Expected an interactive term.");
  term.node.click();
  return { scope, term };
}

describe("Lab Glossary binding", () => {
  it("has stable identity and permits scope creation before connection", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const identity = binding.identity;
    const first = binding.createScope({
      id: defineGlossaryScopeId("first_scope", strict)!,
    });
    const second = binding.createScope({
      id: defineGlossaryScopeId("second_scope", strict)!,
    });
    expect(binding.identity).toBe(identity);
    expect(first.createTerm({ termId, display: "Test term" }).kind).toBe(
      "interactive"
    );
    expect(second.createTerm({ termId, display: "Test term" }).kind).toBe(
      "interactive"
    );
  });

  it("allows one active port and does not silently replace it", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const first = hostPort();
    const second = hostPort();
    binding.connect(first.port);
    expect(() => binding.connect(second.port)).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({ code: "connection_conflict" }),
      })
    );

    openTerm(binding);
    expect(first.requests).toHaveLength(1);
    expect(second.requests).toHaveLength(0);
  });

  it("uses identity-safe idempotent disconnects", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const first = hostPort();
    const second = hostPort();
    const disconnectFirst = binding.connect(first.port);
    disconnectFirst();
    const disconnectSecond = binding.connect(second.port);
    disconnectFirst();

    openTerm(binding);
    expect(first.requests).toHaveLength(0);
    expect(second.requests).toHaveLength(1);
    disconnectSecond();
    disconnectSecond();
  });

  it("turns a fallback double connection into a safe no-op", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: fallback,
    });
    const first = hostPort();
    const second = hostPort();
    binding.connect(first.port);
    const rejectedDisconnect = binding.connect(second.port);
    rejectedDisconnect();
    openTerm(binding);

    expect(first.requests).toHaveLength(1);
    expect(second.requests).toHaveLength(0);
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ code: "connection_conflict" })
    );
  });

  it("retains context by reference without taking surface subscription ownership", () => {
    const unsubscribe = vi.fn();
    const context: GlossaryScopeContextSource = {
      getSnapshot: () => ({ revision: 1, terms: [] }),
      subscribe: vi.fn(() => unsubscribe),
    };
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const connected = hostPort();
    binding.connect(connected.port);
    const scope = binding.createScope({ id: scopeId, context });
    const term = scope.createTerm({ termId, display: "Test term" });
    if (term.kind !== "interactive") throw new Error("Expected an interactive term.");
    term.node.click();

    expect(connected.requests[0]?.context).toBe(context);
    expect(context.subscribe).not.toHaveBeenCalled();
    scope.dispose();
    expect(unsubscribe).not.toHaveBeenCalled();
  });

  it("commits a matching pinned replacement", () => {
    let candidate: GlossaryReplacementCandidate | undefined;
    const connected = hostPort(() => candidate);
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    binding.connect(connected.port);
    openTerm(binding);
    candidate = {
      mode: "pinned",
      identity: connected.requests[0]!.identity,
    };

    const transaction = binding.beginScopeRerender({ id: scopeId });
    const replacement = transaction.scope.createTerm({
      termId,
      display: "Test term",
    });
    transaction.commit();
    transaction.commit();

    expect(replacement.kind).toBe("interactive");
    expect(connected.results).toHaveLength(1);
    expect(connected.results[0]).toMatchObject({
      kind: "transferred",
      previous: candidate,
      replacement: { termId: "test_term" },
    });
  });

  it.each([
    ["mismatched", true],
    ["absent", false],
  ])("closes on %s replacement", (_label, addReplacement) => {
    let candidate: GlossaryReplacementCandidate | undefined;
    const connected = hostPort(() => candidate);
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    binding.connect(connected.port);
    openTerm(binding);
    candidate = {
      mode: "mobile-sheet",
      identity: {
        ...connected.requests[0]!.identity,
        termId: defineGlossaryTermId("other_term", strict)!,
      },
    };

    const transaction = binding.beginScopeRerender({ id: scopeId });
    if (addReplacement) {
      transaction.scope.createTerm({ termId, display: "Test term" });
    }
    transaction.commit();

    expect(connected.results.at(-1)).toMatchObject({ kind: "closed" });
  });

  it("closes a structurally matching candidate that is not the registered identity", () => {
    let candidate: GlossaryReplacementCandidate | undefined;
    const connected = hostPort(() => candidate);
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    binding.connect(connected.port);
    openTerm(binding);
    candidate = {
      mode: "pinned",
      identity: {
        ...connected.requests[0]!.identity,
        trigger: document.createElement("button"),
      },
    };

    const transaction = binding.beginScopeRerender({ id: scopeId });
    transaction.scope.createTerm({ termId, display: "Test term" });
    transaction.commit();

    expect(connected.results.at(-1)).toMatchObject({ kind: "closed" });
  });

  it("aborts and disposes the replacement scope", () => {
    const connected = hostPort();
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    binding.connect(connected.port);
    openTerm(binding);
    const transaction = binding.beginScopeRerender({ id: scopeId });
    transaction.abort();
    transaction.abort();

    expect(connected.results).toHaveLength(1);
    expect(connected.results[0]).toMatchObject({ kind: "closed" });
    expect(() =>
      transaction.scope.createTerm({ termId, display: "Test term" })
    ).toThrow(GlossaryValidationError);
  });

  it("isolates stale transactions from later scopes", () => {
    const connected = hostPort();
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    binding.connect(connected.port);
    openTerm(binding);
    const transaction = binding.beginScopeRerender({ id: scopeId });
    binding.dispose();
    transaction.commit();
    transaction.abort();

    expect(connected.results).toEqual([]);
    expect(() =>
      transaction.scope.createTerm({ termId, display: "Test term" })
    ).toThrow(GlossaryValidationError);
  });

  it("rejects simultaneous transactions in strict mode", () => {
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    openTerm(binding);
    binding.beginScopeRerender({ id: scopeId });
    expect(() => binding.beginScopeRerender({ id: scopeId })).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({ code: "rerender_conflict" }),
      })
    );
  });

  it("safely closes a simultaneous transaction in fallback mode", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const connected = hostPort();
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: fallback,
    });
    binding.connect(connected.port);
    openTerm(binding);
    const first = binding.beginScopeRerender({ id: scopeId });
    const rejected = binding.beginScopeRerender({ id: scopeId });

    expect(connected.results.at(-1)).toMatchObject({ kind: "closed" });
    expect(
      rejected.scope.createTerm({ termId, display: "Test term" }).kind
    ).toBe("plain-text");
    expect(report).toHaveBeenCalledTimes(1);
    first.commit();
    expect(connected.results).toHaveLength(1);
  });

  it("disposes binding-owned scopes, listeners, connections, and transactions once", () => {
    const connected = hostPort();
    const binding = createLabGlossaryBinding({
      moduleId: "ode",
      registry: registry(),
      policy: strict,
    });
    const disconnect = binding.connect(connected.port);
    const { term } = openTerm(binding);
    const transaction = binding.beginScopeRerender({ id: scopeId });
    binding.dispose();
    binding.dispose();
    disconnect();
    term.node.click();
    transaction.commit();

    expect(connected.requests).toHaveLength(1);
    expect(connected.results).toEqual([]);
    expect(() => binding.createScope({ id: scopeId })).toThrow(
      GlossaryValidationError
    );
  });
});
