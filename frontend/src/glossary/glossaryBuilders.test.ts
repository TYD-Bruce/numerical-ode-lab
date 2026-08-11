import { describe, expect, it, vi } from "vitest";
import {
  createGlossaryValidationPolicy,
  defineGlossaryEntry,
  defineGlossaryModuleExtension,
  defineGlossaryScopeId,
  defineGlossaryTermId,
  GlossaryValidationError,
} from "./glossaryBuilders";

const strict = createGlossaryValidationPolicy({ mode: "strict" });

describe("Glossary builders", () => {
  it.each(["term", "step_size", "a1", "scope_2"])(
    "accepts exact stable ID %s",
    (value) => {
      expect(defineGlossaryTermId(value, strict)).toBe(value);
      expect(defineGlossaryScopeId(value, strict)).toBe(value);
    }
  );

  it.each(["", " Step", "step ", "Step", "step-size", "_step", "1step"])(
    "rejects invalid IDs without normalization: %s",
    (value) => {
      expect(() => defineGlossaryTermId(value, strict)).toThrow(
        GlossaryValidationError
      );
      expect(() => defineGlossaryScopeId(value, strict)).toThrow(
        GlossaryValidationError
      );
    }
  );

  it.each([null, 42, { id: "term" }])(
    "rejects non-string IDs without coercion: %o",
    (value) => {
      expect(() =>
        defineGlossaryTermId(value as unknown as string, strict)
      ).toThrow(GlossaryValidationError);
      expect(() =>
        defineGlossaryScopeId(value as unknown as string, strict)
      ).toThrow(GlossaryValidationError);
    }
  );

  it("returns precise typed diagnostics", () => {
    try {
      defineGlossaryTermId("Invalid", strict);
      throw new Error("Expected validation to fail.");
    } catch (cause) {
      expect(cause).toBeInstanceOf(GlossaryValidationError);
      expect((cause as GlossaryValidationError).diagnostic).toEqual({
        code: "invalid_term_id",
        termId: "Invalid",
      });
    }
  });

  it("builds and deeply freezes string/math displays and formulas", () => {
    const mathAlias = {
      kind: "math" as const,
      latex: "q",
      accessibleText: "test quantity",
    };
    const formula = {
      latex: "q = r",
      accessibleText: "test quantity equals reference",
      display: "block" as const,
    };
    const aliases = ["test alias", mathAlias];
    const built = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases,
        definition: "A content-neutral test definition.",
        whyItMatters: "It exercises the framework.",
        formula,
        tutorTopic: "test topic",
      },
      strict
    )!;

    aliases.push("later mutation");
    mathAlias.latex = "changed";
    formula.latex = "changed";

    expect(built.aliases).toEqual([
      "test alias",
      {
        kind: "math",
        latex: "q",
        accessibleText: "test quantity",
      },
    ]);
    expect(built.formula?.latex).toBe("q = r");
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.aliases)).toBe(true);
    expect(Object.isFrozen(built.aliases[1])).toBe(true);
    expect(Object.isFrozen(built.formula)).toBe(true);
  });

  it("copies and deeply freezes every rich entry field", () => {
    const misconception = {
      statement: "The fixture is already complete.",
      correction: "The fixture still needs an explicit review step.",
    };
    const prerequisites = ["first_fixture"];
    const liveRelation = { kind: "term" as const, termId: "second_fixture" };
    const futureRelation = {
      kind: "future" as const,
      label: "Future fixture concept",
    };
    const related = [liveRelation, futureRelation];
    const confused = [
      { kind: "term" as const, termId: "third_fixture" },
    ];
    const built = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases: [],
        definition: "Compact fixture definition.",
        fullDefinition: "Complete fixture-only definition.",
        intuition: "A neutral plain-language explanation.",
        whyItMatters: "It exercises the framework.",
        assumptionsAndLimits: "It is valid only inside this fixture.",
        misconception,
        prerequisiteTermIds: prerequisites,
        relatedTerms: related,
        commonlyConfusedTerms: confused,
        moduleNote: "A neutral module note.",
        tutorTopic: "test topic",
      },
      strict
    )!;

    misconception.statement = "Changed.";
    prerequisites.push("later_fixture");
    liveRelation.termId = "changed_fixture";
    futureRelation.label = "Changed.";
    related.push({ kind: "term", termId: "later_fixture" });
    confused[0]!.termId = "changed_fixture";

    expect(built).toMatchObject({
      fullDefinition: "Complete fixture-only definition.",
      intuition: "A neutral plain-language explanation.",
      assumptionsAndLimits: "It is valid only inside this fixture.",
      misconception: {
        statement: "The fixture is already complete.",
        correction: "The fixture still needs an explicit review step.",
      },
      prerequisiteTermIds: ["first_fixture"],
      relatedTerms: [
        { kind: "term", termId: "second_fixture" },
        { kind: "future", label: "Future fixture concept" },
      ],
      commonlyConfusedTerms: [
        { kind: "term", termId: "third_fixture" },
      ],
      moduleNote: "A neutral module note.",
    });
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.misconception)).toBe(true);
    expect(Object.isFrozen(built.prerequisiteTermIds)).toBe(true);
    expect(Object.isFrozen(built.relatedTerms)).toBe(true);
    expect(Object.isFrozen(built.relatedTerms?.[0])).toBe(true);
    expect(Object.isFrozen(built.relatedTerms?.[1])).toBe(true);
    expect(Object.isFrozen(built.commonlyConfusedTerms)).toBe(true);
    expect(Object.isFrozen(built.commonlyConfusedTerms?.[0])).toBe(true);
  });

  it.each([
    {
      name: "blank optional prose",
      input: { fullDefinition: "   " },
      code: "invalid_content_field",
      field: "fullDefinition",
    },
    {
      name: "malformed misconception",
      input: {
        misconception: {
          statement: "Fixture claim.",
          correction: "",
        },
      },
      code: "invalid_content_field",
      field: "misconception.correction",
    },
    {
      name: "duplicate prerequisite",
      input: {
        prerequisiteTermIds: ["first_fixture", "first_fixture"],
      },
      code: "duplicate_prerequisite",
      field: "prerequisiteTermIds",
    },
    {
      name: "self prerequisite",
      input: { prerequisiteTermIds: ["test_term"] },
      code: "self_reference",
      field: "prerequisiteTermIds",
    },
    {
      name: "duplicate live relation",
      input: {
        relatedTerms: [
          { kind: "term", termId: "first_fixture" },
          { kind: "term", termId: "first_fixture" },
        ],
      },
      code: "duplicate_live_reference",
      field: "relatedTerms",
    },
    {
      name: "duplicate future label",
      input: {
        commonlyConfusedTerms: [
          { kind: "future", label: "Future fixture" },
          { kind: "future", label: "Future fixture" },
        ],
      },
      code: "duplicate_future_label",
      field: "commonlyConfusedTerms",
    },
    {
      name: "self live relation",
      input: {
        commonlyConfusedTerms: [{ kind: "term", termId: "test_term" }],
      },
      code: "self_reference",
      field: "commonlyConfusedTerms",
    },
    {
      name: "blank future label",
      input: { relatedTerms: [{ kind: "future", label: "  " }] },
      code: "invalid_related_term",
      field: "relatedTerms",
    },
  ])("rejects rich entry error: $name", ({ input, code, field }) => {
    expect(() =>
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          aliases: [],
          definition: "Definition.",
          whyItMatters: "Reason.",
          tutorTopic: "topic",
          ...input,
        } as Parameters<typeof defineGlossaryEntry>[0],
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({ code, field }),
      })
    );
  });

  it("rejects unrecognized entry and canonical override fields", () => {
    expect(() =>
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          definition: "Definition.",
          whyItMatters: "Reason.",
          tutorTopic: "topic",
          evidence: { source: "fixture" },
        } as unknown as Parameters<typeof defineGlossaryEntry>[0],
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "unexpected_content_field",
          field: "evidence",
        }),
      })
    );

    expect(() =>
      defineGlossaryModuleExtension(
        {
          moduleId: "ode",
          overrides: [
            {
              termId: "test_term",
              intuition: "A prohibited canonical replacement.",
            },
          ],
        } as unknown as Parameters<typeof defineGlossaryModuleExtension>[0],
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "unexpected_content_field",
          field: "intuition",
        }),
      })
    );
  });

  it("keeps HTML-looking prose as data and rejects non-plain rich records", () => {
    const built = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        definition: "Compact definition.",
        fullDefinition: '<button onclick="unsafe()">Plain text only</button>',
        whyItMatters: "Reason.",
        tutorTopic: "topic",
      },
      strict
    )!;
    expect(built.fullDefinition).toBe(
      '<button onclick="unsafe()">Plain text only</button>'
    );

    class MisconceptionRecord {
      statement = "Class-based statement.";
      correction = "Class-based correction.";
    }
    expect(() =>
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          definition: "Compact definition.",
          whyItMatters: "Reason.",
          misconception: new MisconceptionRecord(),
          tutorTopic: "topic",
        } as unknown as Parameters<typeof defineGlossaryEntry>[0],
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "invalid_content_field",
          field: "misconception",
        }),
      })
    );
    expect(() =>
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          definition: "Compact definition.",
          whyItMatters: "Reason.",
          fullDefinition: () => "Executable value",
          tutorTopic: "topic",
        } as unknown as Parameters<typeof defineGlossaryEntry>[0],
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({
          code: "invalid_content_field",
          field: "fullDefinition",
        }),
      })
    );
  });

  it.each([
    { latex: "", accessibleText: "quantity" },
    { latex: "q", accessibleText: "" },
    { latex: "q", accessibleText: "quantity", display: "wide" },
  ])("rejects invalid formulas before returning a record", (formula) => {
    expect(() =>
      defineGlossaryEntry(
        {
          id: "test_term",
          label: "Test term",
          aliases: [],
          definition: "Definition.",
          whyItMatters: "Reason.",
          formula,
          tutorTopic: "topic",
        },
        strict
      )
    ).toThrowError(
      expect.objectContaining({
        diagnostic: expect.objectContaining({ code: "invalid_formula" }),
      })
    );
  });

  it("rejects empty and malformed displays", () => {
    for (const display of [
      "",
      { kind: "math", latex: "", accessibleText: "quantity" },
      { kind: "math", latex: "q", accessibleText: "" },
    ]) {
      expect(() =>
        defineGlossaryEntry(
          {
            id: "test_term",
            label: "Test term",
            aliases: [display],
            definition: "Definition.",
            whyItMatters: "Reason.",
            tutorTopic: "topic",
          },
          strict
        )
      ).toThrowError(
        expect.objectContaining({
          diagnostic: expect.objectContaining({ code: "invalid_display" }),
        })
      );
    }
  });

  it("copies and freezes module extensions and nested overrides", () => {
    const prerequisites = ["first_fixture"];
    const related = [
      { kind: "term" as const, termId: "second_fixture" },
      { kind: "future" as const, label: "Future fixture concept" },
    ];
    const override = {
      termId: "test_term",
      contextualDefinition: "Context.",
      moduleNote: "Module note.",
      prerequisiteTermIds: prerequisites,
      relatedTerms: related,
      commonlyConfusedTerms: [
        { kind: "term" as const, termId: "third_fixture" },
      ],
      formula: {
        latex: "a=b",
        accessibleText: "a equals b",
      },
    };
    const overrides: Array<
      Parameters<typeof defineGlossaryModuleExtension>[0]["overrides"][number]
    > = [override];
    const extension = defineGlossaryModuleExtension(
      { moduleId: "ode", overrides },
      strict
    )!;

    overrides.push({
      termId: "other_term",
      contextualDefinition: "Other context.",
      formula: {
        latex: "c=d",
        accessibleText: "c equals d",
      },
    });
    override.contextualDefinition = "Changed.";
    override.formula.latex = "changed";
    prerequisites.push("later_fixture");
    related[0]!.termId = "changed_fixture";
    related.push({ kind: "term", termId: "later_fixture" });

    expect(extension.overrides).toEqual([
      {
        termId: "test_term",
        contextualDefinition: "Context.",
        moduleNote: "Module note.",
        prerequisiteTermIds: ["first_fixture"],
        relatedTerms: [
          { kind: "term", termId: "second_fixture" },
          { kind: "future", label: "Future fixture concept" },
        ],
        commonlyConfusedTerms: [
          { kind: "term", termId: "third_fixture" },
        ],
        formula: {
          latex: "a=b",
          accessibleText: "a equals b",
        },
      },
    ]);
    expect(Object.isFrozen(extension)).toBe(true);
    expect(Object.isFrozen(extension.overrides)).toBe(true);
    expect(Object.isFrozen(extension.overrides[0])).toBe(true);
    expect(Object.isFrozen(extension.overrides[0]?.formula)).toBe(true);
    expect(Object.isFrozen(extension.overrides[0]?.prerequisiteTermIds)).toBe(
      true
    );
    expect(Object.isFrozen(extension.overrides[0]?.relatedTerms)).toBe(true);
    expect(Object.isFrozen(extension.overrides[0]?.relatedTerms?.[0])).toBe(
      true
    );
    expect(
      Object.isFrozen(extension.overrides[0]?.commonlyConfusedTerms)
    ).toBe(true);
  });

  it("falls back without throwing and reports an equivalent builder diagnostic once", () => {
    const report = vi.fn();
    const fallback = createGlossaryValidationPolicy({
      mode: "production-fallback",
      report,
    });
    const result = defineGlossaryEntry(
      {
        id: "test_term",
        label: "Test term",
        aliases: ["", ""],
        definition: "Definition.",
        whyItMatters: "Reason.",
        tutorTopic: "topic",
      },
      fallback
    );

    expect(result).toBeUndefined();
    expect(report).toHaveBeenCalledTimes(1);
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ code: "invalid_display", display: "" })
    );
  });
});
