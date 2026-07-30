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
import type {
  GlossaryEntry,
  GlossaryModuleExtension,
  GlossaryTermDisplay,
} from "./glossaryRuntimeTypes";

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

  it("composes rich canonical content with context-only replacement semantics", () => {
    const core = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases: ["Test alias"],
        definition: "Compact definition.",
        fullDefinition: "Canonical complete definition.",
        intuition: "Canonical intuition.",
        whyItMatters: "Canonical reason.",
        assumptionsAndLimits: "Canonical limits.",
        misconception: {
          statement: "Canonical misconception.",
          correction: "Canonical correction.",
        },
        prerequisiteTermIds: ["first_fixture"],
        relatedTerms: [
          { kind: "term", termId: "first_fixture" },
          { kind: "future", label: "Canonical future fixture" },
        ],
        commonlyConfusedTerms: [
          { kind: "term", termId: "second_fixture" },
        ],
        moduleNote: "Canonical module note.",
        tutorTopic: "canonical topic",
      },
      strict
    )!;
    const extension = defineGlossaryModuleExtension(
      {
        moduleId: "ode",
        overrides: [
          {
            termId: "test_term",
            contextualDefinition: "Contextual definition.",
            whyItMattersHere: "Contextual reason.",
            moduleNote: "Contextual module note.",
            tutorTopic: "contextual topic",
            prerequisiteTermIds: [],
            relatedTerms: [
              { kind: "term", termId: "second_fixture" },
              { kind: "future", label: "Contextual future fixture" },
            ],
            commonlyConfusedTerms: [],
          },
        ],
      },
      strict
    )!;
    const registry = createGlossaryRegistry({
      coreEntries: [core, entry("first_fixture"), entry("second_fixture")],
      extensions: [extension],
      policy: strict,
    });
    const termId = defineGlossaryTermId("test_term", strict)!;

    const base = registry.resolve("pde", termId, "Test alias");
    const contextual = registry.resolve("ode", termId, "Test alias");

    expect(base).toMatchObject({
      kind: "resolved",
      entry: {
        definition: "Compact definition.",
        fullDefinition: "Canonical complete definition.",
        intuition: "Canonical intuition.",
        assumptionsAndLimits: "Canonical limits.",
        misconception: {
          statement: "Canonical misconception.",
          correction: "Canonical correction.",
        },
        prerequisiteTermIds: ["first_fixture"],
        relatedTerms: [
          { kind: "term", termId: "first_fixture" },
          { kind: "future", label: "Canonical future fixture" },
        ],
        commonlyConfusedTerms: [
          { kind: "term", termId: "second_fixture" },
        ],
        moduleNote: "Canonical module note.",
      },
    });
    expect(contextual).toMatchObject({
      kind: "resolved",
      entry: {
        definition: "Compact definition.",
        fullDefinition: "Canonical complete definition.",
        intuition: "Canonical intuition.",
        assumptionsAndLimits: "Canonical limits.",
        misconception: {
          statement: "Canonical misconception.",
          correction: "Canonical correction.",
        },
        contextualDefinition: "Contextual definition.",
        whyItMattersHere: "Contextual reason.",
        moduleNote: "Contextual module note.",
        tutorTopic: "contextual topic",
        prerequisiteTermIds: [],
        relatedTerms: [
          { kind: "term", termId: "second_fixture" },
          { kind: "future", label: "Contextual future fixture" },
        ],
        commonlyConfusedTerms: [],
      },
    });
    expect(core.moduleNote).toBe("Canonical module note.");
    expect(core.relatedTerms).toEqual([
      { kind: "term", termId: "first_fixture" },
      { kind: "future", label: "Canonical future fixture" },
    ]);
  });

  it("resolves a module-composed related card by ID with its canonical label", () => {
    const extension = defineGlossaryModuleExtension(
      {
        moduleId: "ode",
        overrides: [
          {
            termId: "test_term",
            moduleNote: "Contextual module note.",
          },
        ],
      },
      strict
    )!;
    const registry = createGlossaryRegistry({
      coreEntries: [entry("test_term", { label: "Canonical test label" })],
      extensions: [extension],
      policy: strict,
    });
    const termId = defineGlossaryTermId("test_term", strict)!;

    expect(registry.resolveById("ode", termId)).toMatchObject({
      id: termId,
      moduleId: "ode",
      display: "Canonical test label",
      label: "Canonical test label",
      moduleNote: "Contextual module note.",
    });
    expect(
      registry.resolveById(
        "ode",
        defineGlossaryTermId("missing_term", strict)!
      )
    ).toBeUndefined();
  });

  it("rejects duplicate module override targets", () => {
    const extension = defineGlossaryModuleExtension(
      {
        moduleId: "ode",
        overrides: [
          { termId: "test_term", moduleNote: "First note." },
          { termId: "test_term", moduleNote: "Second note." },
        ],
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
          code: "duplicate_override_target",
          termId: "test_term",
        }),
      })
    );
  });

  it.each([
    {
      name: "prerequisite",
      field: "prerequisiteTermIds",
      rich: { prerequisiteTermIds: ["missing_fixture"] },
    },
    {
      name: "related term",
      field: "relatedTerms",
      rich: {
        relatedTerms: [{ kind: "term", termId: "missing_fixture" }],
      },
    },
    {
      name: "confused term",
      field: "commonlyConfusedTerms",
      rich: {
        commonlyConfusedTerms: [
          { kind: "term", termId: "missing_fixture" },
        ],
      },
    },
  ])("rejects an unresolved live $name", ({ field, rich }) => {
    const unresolved = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases: [],
        definition: "Definition.",
        whyItMatters: "Reason.",
        tutorTopic: "topic",
        ...rich,
      } as Parameters<typeof defineGlossaryEntry>[0],
      strict
    )!;

    expect(() =>
      createGlossaryRegistry({
        coreEntries: [unresolved],
        policy: strict,
      })
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "unknown_live_reference",
          termId: "test_term",
          relatedTermId: "missing_fixture",
          field,
        }),
      })
    );
  });

  it("accepts future relationships without resolving fake IDs", () => {
    const futureOnly = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases: [],
        definition: "Definition.",
        whyItMatters: "Reason.",
        relatedTerms: [
          { kind: "future", label: "Unavailable fixture concept" },
        ],
        tutorTopic: "topic",
      },
      strict
    )!;
    const registry = createGlossaryRegistry({
      coreEntries: [futureOnly],
      policy: strict,
    });

    expect(
      registry.resolveById("ode", defineGlossaryTermId("test_term", strict)!)
    ).toMatchObject({
      relatedTerms: [
        { kind: "future", label: "Unavailable fixture concept" },
      ],
    });
  });

  it("filters invalid raw live references under production fallback", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const raw = {
      ...entry("test_term"),
      relatedTerms: Object.freeze([
        Object.freeze({
          kind: "term" as const,
          termId: defineGlossaryTermId("missing_fixture", strict)!,
        }),
        Object.freeze({
          kind: "future" as const,
          label: "Future fixture concept",
        }),
      ]),
    };
    const registry = createGlossaryRegistry({
      coreEntries: [raw],
      policy: fallback,
    });

    expect(
      registry.resolveById("ode", defineGlossaryTermId("test_term", strict)!)
    ).toMatchObject({
      relatedTerms: [
        { kind: "future", label: "Future fixture concept" },
      ],
    });
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "unknown_live_reference",
        relatedTermId: "missing_fixture",
      })
    );
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

  it("deeply clones rich records supplied directly to the registry", () => {
    const misconception = {
      statement: "Mutable misconception.",
      correction: "Mutable correction.",
    };
    const prerequisites = [
      defineGlossaryTermId("first_fixture", strict)!,
    ];
    const related = [
      {
        kind: "term" as const,
        termId: defineGlossaryTermId("first_fixture", strict)!,
      },
    ];
    const raw = {
      ...entry("test_term"),
      misconception,
      prerequisiteTermIds: prerequisites,
      relatedTerms: related,
    } as GlossaryEntry;
    const registry = createGlossaryRegistry({
      coreEntries: [raw, entry("first_fixture")],
      policy: strict,
    });

    misconception.statement = "Changed.";
    prerequisites[0] = defineGlossaryTermId("changed_fixture", strict)!;
    related[0]!.termId = defineGlossaryTermId("changed_fixture", strict)!;

    const resolved = registry.resolveById(
      "ode",
      defineGlossaryTermId("test_term", strict)!
    )!;
    expect(resolved.misconception?.statement).toBe("Mutable misconception.");
    expect(resolved.prerequisiteTermIds).toEqual(["first_fixture"]);
    expect(resolved.relatedTerms).toEqual([
      { kind: "term", termId: "first_fixture" },
    ]);
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.misconception)).toBe(true);
    expect(Object.isFrozen(resolved.prerequisiteTermIds)).toBe(true);
    expect(Object.isFrozen(resolved.relatedTerms)).toBe(true);
    expect(Object.isFrozen(resolved.relatedTerms?.[0])).toBe(true);
    expect(() => {
      (
        resolved.relatedTerms as unknown as Array<{
          kind: "term";
          termId: string;
        }>
      )[0]!.termId = "changed_fixture";
    }).toThrow(TypeError);
    expect(
      registry.resolveById(
        "ode",
        defineGlossaryTermId("test_term", strict)!
      )?.relatedTerms
    ).toEqual([{ kind: "term", termId: "first_fixture" }]);
  });

  it("deeply clones rich module overrides supplied directly to the registry", () => {
    const overrideFormula = {
      latex: "m=n",
      accessibleText: "fixture m equals fixture n",
    };
    const overridePrerequisites = [
      defineGlossaryTermId("first_fixture", strict)!,
    ];
    const overrideRelations = [
      {
        kind: "term" as const,
        termId: defineGlossaryTermId("first_fixture", strict)!,
      },
      {
        kind: "future" as const,
        label: "Future override fixture",
      },
    ];
    const rawOverride = {
      termId: defineGlossaryTermId("test_term", strict)!,
      formula: overrideFormula,
      prerequisiteTermIds: overridePrerequisites,
      relatedTerms: overrideRelations,
      moduleNote: "Original module note.",
    };
    const rawExtension = {
      moduleId: "ode",
      overrides: [rawOverride],
    } as GlossaryModuleExtension;
    const registry = createGlossaryRegistry({
      coreEntries: [entry("test_term"), entry("first_fixture")],
      extensions: [rawExtension],
      policy: strict,
    });

    overrideFormula.latex = "changed";
    overridePrerequisites[0] = defineGlossaryTermId(
      "changed_fixture",
      strict
    )!;
    overrideRelations[0]!.termId = defineGlossaryTermId(
      "changed_fixture",
      strict
    )!;
    overrideRelations[1]!.label = "Changed.";
    rawOverride.moduleNote = "Changed.";

    const resolved = registry.resolveById(
      "ode",
      defineGlossaryTermId("test_term", strict)!
    )!;
    expect(resolved).toMatchObject({
      formula: { latex: "m=n" },
      prerequisiteTermIds: ["first_fixture"],
      relatedTerms: [
        { kind: "term", termId: "first_fixture" },
        { kind: "future", label: "Future override fixture" },
      ],
      moduleNote: "Original module note.",
    });
    expect(Object.isFrozen(resolved.formula)).toBe(true);
    expect(Object.isFrozen(resolved.prerequisiteTermIds)).toBe(true);
    expect(Object.isFrozen(resolved.relatedTerms)).toBe(true);
    expect(Object.isFrozen(resolved.relatedTerms?.[0])).toBe(true);
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
