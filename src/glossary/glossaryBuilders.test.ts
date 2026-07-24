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
    const override = {
      termId: "test_term",
      contextualDefinition: "Context.",
      formula: {
        latex: "a=b",
        accessibleText: "a equals b",
      },
    };
    const overrides = [override];
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

    expect(extension.overrides).toEqual([
      {
        termId: "test_term",
        contextualDefinition: "Context.",
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
