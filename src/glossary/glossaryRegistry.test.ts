import { describe, expect, it, vi } from "vitest";
import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryModuleExtension,
  defineGlossaryTermId,
  GlossaryValidationError,
} from "./glossaryBuilders";
import { coreGlossaryEntries } from "./coreGlossary";
import { createGlossaryRegistry } from "./glossaryRegistry";
import type { GlossaryEntry, GlossaryTermDisplay } from "./glossaryRuntimeTypes";

const strict = createGlossaryValidationPolicy({ mode: "strict" });

function entry(
  id: string,
  options: {
    label?: string;
    aliases?: readonly GlossaryTermDisplay[];
    formula?: {
      readonly latex: string;
      readonly accessibleText: string;
      readonly display?: "inline" | "block";
    };
  } = {}
): GlossaryEntry {
  return defineGlossaryEntry(
    {
      id,
      label: options.label ?? `Label ${id}`,
      aliases: options.aliases ?? [],
      definition: `Definition ${id}.`,
      whyItMatters: `Reason ${id}.`,
      formula: options.formula,
      tutorTopic: `Topic ${id}`,
    },
    strict
  )!;
}

describe("Glossary registry", () => {
  it("exports an empty frozen production core", () => {
    expect(coreGlossaryEntries).toEqual([]);
    expect(Object.isFrozen(coreGlossaryEntries)).toBe(true);
  });

  it("rejects duplicate term IDs", () => {
    expect(() =>
      createGlossaryRegistry({
        coreEntries: [entry("test_term"), entry("test_term")],
        policy: strict,
      })
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({ code: "duplicate_term_id" }),
      })
    );
  });

  it("rejects an invalid runtime term ID before registering the entry", () => {
    const invalid = {
      ...entry("test_term"),
      id: "Invalid",
    } as unknown as GlossaryEntry;

    expect(() =>
      createGlossaryRegistry({
        coreEntries: [invalid],
        policy: strict,
      })
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "invalid_term_id",
          termId: "Invalid",
        }),
      })
    );
  });

  it("rejects conflicting exact string aliases without normalizing them", () => {
    expect(() =>
      createGlossaryRegistry({
        coreEntries: [
          entry("first_term", { aliases: ["Exact alias"] }),
          entry("second_term", { aliases: ["Exact alias"] }),
        ],
        policy: strict,
      })
    ).toThrow(GlossaryValidationError);

    const registry = createGlossaryRegistry({
      coreEntries: [
        entry("first_term", { aliases: ["Exact alias"] }),
        entry("second_term", { aliases: ["exact alias"] }),
      ],
      policy: strict,
    });
    expect(
      registry.resolve(
        "ode",
        defineGlossaryTermId("second_term", strict)!,
        "exact alias"
      ).kind
    ).toBe("resolved");
  });

  it("compares math aliases by the latex and accessible-text tuple", () => {
    const shared = {
      kind: "math" as const,
      latex: "q",
      accessibleText: "quantity",
    };
    expect(() =>
      createGlossaryRegistry({
        coreEntries: [
          entry("first_term", { aliases: [shared] }),
          entry("second_term", { aliases: [{ ...shared }] }),
        ],
        policy: strict,
      })
    ).toThrow(GlossaryValidationError);

    const registry = createGlossaryRegistry({
      coreEntries: [
        entry("first_term", { aliases: [shared] }),
        entry("second_term", {
          aliases: [{ ...shared, accessibleText: "other quantity" }],
        }),
      ],
      policy: strict,
    });
    expect(
      registry.resolve(
        "ode",
        defineGlossaryTermId("second_term", strict)!,
        { ...shared, accessibleText: "other quantity" }
      ).kind
    ).toBe("resolved");
  });

  it("rejects unknown override targets", () => {
    const extension = defineGlossaryModuleExtension(
      {
        moduleId: "ode",
        overrides: [{ termId: "missing_term", contextualDefinition: "Context." }],
      },
      strict
    )!;
    expect(() =>
      createGlossaryRegistry({
        coreEntries: [entry("test_term")],
        extensions: [extension],
        policy: strict,
      })
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "unknown_override_target",
          termId: "missing_term",
        }),
      })
    );
  });

  it("resolves core fallback and contextual module overrides", () => {
    const core = entry("test_term", {
      aliases: ["Test alias"],
      formula: {
        latex: "q=r",
        accessibleText: "quantity equals reference",
      },
    });
    const extension = defineGlossaryModuleExtension(
      {
        moduleId: "ode",
        overrides: [
          {
            termId: "test_term",
            contextualDefinition: "ODE-neutral context.",
            whyItMattersHere: "Contextual reason.",
            tutorTopic: "contextual topic",
          },
        ],
      },
      strict
    )!;
    const registry = createGlossaryRegistry({
      coreEntries: [core],
      extensions: [extension],
      policy: strict,
    });
    const termId = defineGlossaryTermId("test_term", strict)!;

    const base = registry.resolve("pde", termId, "Test alias");
    const contextual = registry.resolve("ode", termId, "Test alias");
    expect(base).toMatchObject({
      kind: "resolved",
      entry: {
        contextualDefinition: undefined,
        whyItMattersHere: undefined,
        tutorTopic: "Topic test_term",
        formula: { latex: "q=r" },
      },
    });
    expect(contextual).toMatchObject({
      kind: "resolved",
      entry: {
        contextualDefinition: "ODE-neutral context.",
        whyItMattersHere: "Contextual reason.",
        tutorTopic: "contextual topic",
        formula: { latex: "q=r" },
      },
    });
  });

  it("supports formula replacement and explicit null suppression", () => {
    const core = entry("test_term", {
      formula: {
        latex: "q=r",
        accessibleText: "quantity equals reference",
      },
    });
    const registry = createGlossaryRegistry({
      coreEntries: [core],
      extensions: [
        defineGlossaryModuleExtension(
          {
            moduleId: "ode",
            overrides: [
              {
                termId: "test_term",
                formula: {
                  latex: "q=s",
                  accessibleText: "quantity equals alternate",
                  display: "block",
                },
              },
            ],
          },
          strict
        )!,
        defineGlossaryModuleExtension(
          {
            moduleId: "pde",
            overrides: [{ termId: "test_term", formula: null }],
          },
          strict
        )!,
      ],
      policy: strict,
    });
    const termId = defineGlossaryTermId("test_term", strict)!;

    expect(registry.resolve("ode", termId, "Label test_term")).toMatchObject({
      kind: "resolved",
      entry: { formula: { latex: "q=s", display: "block" } },
    });
    expect(registry.resolve("pde", termId, "Label test_term")).toMatchObject({
      kind: "resolved",
      entry: { formula: undefined },
    });
  });

  it("returns deeply immutable resolution records", () => {
    const registry = createGlossaryRegistry({
      coreEntries: [
        entry("test_term", {
          aliases: [
            {
              kind: "math",
              latex: "q",
              accessibleText: "quantity",
            },
          ],
        }),
      ],
      policy: strict,
    });
    const resolution = registry.resolve(
      "ode",
      defineGlossaryTermId("test_term", strict)!,
      { kind: "math", latex: "q", accessibleText: "quantity" }
    );
    expect(resolution.kind).toBe("resolved");
    expect(Object.isFrozen(resolution)).toBe(true);
    if (resolution.kind === "resolved") {
      expect(Object.isFrozen(resolution.entry)).toBe(true);
      expect(Object.isFrozen(resolution.entry.display)).toBe(true);
      expect(Object.isFrozen(resolution.entry.aliases)).toBe(true);
    }
  });

  it("does not retain externally mutable registry input arrays or nested records", () => {
    const aliases: GlossaryTermDisplay[] = ["Mutable alias"];
    const formula = {
      latex: "q=r",
      accessibleText: "quantity equals reference",
    };
    const raw = {
      id: defineGlossaryTermId("test_term", strict)!,
      label: "Test term",
      aliases,
      definition: "Definition.",
      whyItMatters: "Reason.",
      formula,
      tutorTopic: "topic",
    } as GlossaryEntry;
    const registry = createGlossaryRegistry({
      coreEntries: [raw],
      policy: strict,
    });

    aliases[0] = "Changed alias";
    formula.latex = "changed";

    expect(
      registry.resolve(
        "ode",
        defineGlossaryTermId("test_term", strict)!,
        "Mutable alias"
      )
    ).toMatchObject({
      kind: "resolved",
      entry: { formula: { latex: "q=r" } },
    });
  });

  it("fails closed for unknown terms and reports an equivalent diagnostic once", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const registry = createGlossaryRegistry({
      coreEntries: [entry("test_term")],
      policy: fallback,
    });
    const missing = "missing_term" as ReturnType<typeof defineGlossaryTermId>;

    const first = registry.resolve("ode", missing!, "Readable authored term");
    const second = registry.resolve("ode", missing!, "Readable authored term");
    expect(first).toEqual(
      expect.objectContaining({
        kind: "invalid",
        display: "Readable authored term",
      })
    );
    expect(second.kind).toBe("invalid");
    expect(report).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ code: "unknown_term", termId: "missing_term" })
    );
  });

  it("preserves readable fallback for malformed runtime display data", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const registry = createGlossaryRegistry({
      coreEntries: [entry("test_term")],
      policy: fallback,
    });

    expect(() =>
      registry.resolve(
        "ode",
        defineGlossaryTermId("test_term", strict)!,
        null as unknown as GlossaryTermDisplay
      )
    ).not.toThrow();
    expect(
      registry.resolve(
        "ode",
        defineGlossaryTermId("test_term", strict)!,
        null as unknown as GlossaryTermDisplay
      )
    ).toEqual(
      expect.objectContaining({
        kind: "invalid",
        display: "null",
      })
    );
    expect(report).toHaveBeenCalledTimes(1);
  });
});
