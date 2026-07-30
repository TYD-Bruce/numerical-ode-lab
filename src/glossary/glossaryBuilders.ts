import type { LabModuleId } from "../app/contracts";
import type {
  GlossaryDiagnostic,
  GlossaryEntry,
  GlossaryFormula,
  GlossaryMathDisplay,
  GlossaryMisconception,
  GlossaryModuleExtension,
  GlossaryModuleOverride,
  GlossaryRelatedTerm,
  GlossaryScopeId,
  GlossaryTermDisplay,
  GlossaryTermId,
  GlossaryValidationPolicy,
} from "./glossaryRuntimeTypes";

const GLOSSARY_ID_PATTERN = /^[a-z][a-z0-9_]*$/;

export interface GlossaryFormulaInput {
  readonly latex: unknown;
  readonly accessibleText: unknown;
  readonly display?: unknown;
}

export interface GlossaryEntryInput {
  readonly id: string;
  readonly label: string;
  readonly aliases?: readonly unknown[];
  readonly definition: string;
  readonly fullDefinition?: string;
  readonly intuition?: string;
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormulaInput;
  readonly assumptionsAndLimits?: string;
  readonly misconception?: GlossaryMisconceptionInput;
  readonly prerequisiteTermIds?: readonly string[];
  readonly relatedTerms?: readonly GlossaryRelatedTermInput[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTermInput[];
  readonly moduleNote?: string;
  readonly tutorTopic: string;
}

export interface GlossaryMisconceptionInput {
  readonly statement: string;
  readonly correction: string;
}

export type GlossaryRelatedTermInput =
  | Readonly<{
      kind: "term";
      termId: string;
    }>
  | Readonly<{
      kind: "future";
      label: string;
    }>;

export interface GlossaryModuleOverrideInput {
  readonly termId: string;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormulaInput | null;
  readonly moduleNote?: string;
  readonly tutorTopic?: string;
  readonly prerequisiteTermIds?: readonly string[];
  readonly relatedTerms?: readonly GlossaryRelatedTermInput[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTermInput[];
}

export interface GlossaryModuleExtensionInput {
  readonly moduleId: LabModuleId;
  readonly overrides: readonly GlossaryModuleOverrideInput[];
}

export interface GlossaryDiagnosticSink {
  readonly policy: GlossaryValidationPolicy;
  reject(diagnostic: GlossaryDiagnostic): false;
}

const ENTRY_KEYS = new Set([
  "id",
  "label",
  "aliases",
  "definition",
  "fullDefinition",
  "intuition",
  "whyItMatters",
  "formula",
  "assumptionsAndLimits",
  "misconception",
  "prerequisiteTermIds",
  "relatedTerms",
  "commonlyConfusedTerms",
  "moduleNote",
  "tutorTopic",
]);

const EXTENSION_KEYS = new Set(["moduleId", "overrides"]);

const OVERRIDE_KEYS = new Set([
  "termId",
  "contextualDefinition",
  "whyItMattersHere",
  "formula",
  "moduleNote",
  "tutorTopic",
  "prerequisiteTermIds",
  "relatedTerms",
  "commonlyConfusedTerms",
]);

export class GlossaryValidationError extends Error {
  readonly diagnostic: GlossaryDiagnostic;

  constructor(diagnostic: GlossaryDiagnostic) {
    super(`Glossary validation failed: ${diagnostic.code}`);
    this.name = "GlossaryValidationError";
    this.diagnostic = freezeDiagnostic(diagnostic);
  }
}

export function createGlossaryValidationPolicy(options: {
  readonly mode: GlossaryValidationPolicy["mode"];
  readonly report?: (diagnostic: GlossaryDiagnostic) => void;
}): GlossaryValidationPolicy {
  return Object.freeze({
    mode: options.mode,
    report: options.report ?? (() => undefined),
  });
}

export const defaultGlossaryValidationPolicy =
  createGlossaryValidationPolicy({
    mode: import.meta.env.DEV ? "strict" : "production-fallback",
    report: (diagnostic) => {
      console.warn(`[Glossary:${diagnostic.code}]`, diagnostic);
    },
  });

export function createGlossaryDiagnosticSink(
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryDiagnosticSink {
  const reported = new Set<string>();
  return Object.freeze({
    policy,
    reject(diagnostic: GlossaryDiagnostic): false {
      const frozen = freezeDiagnostic(diagnostic);
      if (policy.mode === "strict") {
        throw new GlossaryValidationError(frozen);
      }
      const key = diagnosticKey(frozen);
      if (!reported.has(key)) {
        reported.add(key);
        policy.report(frozen);
      }
      return false;
    },
  });
}

export function defineGlossaryTermId(
  value: string,
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryTermId | undefined {
  const sink = createGlossaryDiagnosticSink(policy);
  return validateTermId(value, sink);
}

export function defineGlossaryScopeId(
  value: string,
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryScopeId | undefined {
  const sink = createGlossaryDiagnosticSink(policy);
  return validateScopeId(value, sink);
}

export function defineGlossaryEntry(
  input: GlossaryEntryInput,
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryEntry | undefined {
  const sink = createGlossaryDiagnosticSink(policy);
  if (!isPlainDataRecord(input)) {
    sink.reject({ code: "invalid_content_field", field: "entry" });
    return undefined;
  }
  let valid = rejectUnexpectedKeys(input, ENTRY_KEYS, sink, {
    termId: diagnosticDisplay(input.id),
  });
  const id = validateTermId(input.id, sink);
  valid &&= id !== undefined;
  const label = copyGlossaryTermDisplay(input.label, sink, {
    termId: input.id,
  });
  valid &&= typeof label === "string";

  const aliases: GlossaryTermDisplay[] = [];
  for (const alias of input.aliases ?? []) {
    const copied = copyGlossaryTermDisplay(alias, sink, {
      termId: input.id,
    });
    if (copied === undefined) {
      valid = false;
    } else {
      aliases.push(copied);
    }
  }

  const formula =
    input.formula === undefined
      ? undefined
      : copyGlossaryFormula(input.formula, sink, input.id);
  if (input.formula !== undefined && formula === undefined) valid = false;
  const definition = copyNonemptyText(
    input.definition,
    "definition",
    sink,
    input.id
  );
  const fullDefinition = copyOptionalText(
    input.fullDefinition,
    "fullDefinition",
    sink,
    input.id
  );
  const intuition = copyOptionalText(
    input.intuition,
    "intuition",
    sink,
    input.id
  );
  const whyItMatters = copyNonemptyText(
    input.whyItMatters,
    "whyItMatters",
    sink,
    input.id
  );
  const assumptionsAndLimits = copyOptionalText(
    input.assumptionsAndLimits,
    "assumptionsAndLimits",
    sink,
    input.id
  );
  const misconception =
    input.misconception === undefined
      ? undefined
      : copyGlossaryMisconception(input.misconception, sink, input.id);
  const prerequisiteTermIds =
    input.prerequisiteTermIds === undefined
      ? undefined
      : copyGlossaryPrerequisiteIds(
          input.prerequisiteTermIds,
          sink,
          input.id
        );
  const relatedTerms =
    input.relatedTerms === undefined
      ? undefined
      : copyGlossaryRelatedTerms(
          input.relatedTerms,
          "relatedTerms",
          sink,
          input.id
        );
  const commonlyConfusedTerms =
    input.commonlyConfusedTerms === undefined
      ? undefined
      : copyGlossaryRelatedTerms(
          input.commonlyConfusedTerms,
          "commonlyConfusedTerms",
          sink,
          input.id
        );
  const moduleNote = copyOptionalText(
    input.moduleNote,
    "moduleNote",
    sink,
    input.id
  );
  const tutorTopic = copyNonemptyText(
    input.tutorTopic,
    "tutorTopic",
    sink,
    input.id
  );
  valid &&=
    definition !== undefined &&
    whyItMatters !== undefined &&
    tutorTopic !== undefined &&
    (input.fullDefinition === undefined || fullDefinition !== undefined) &&
    (input.intuition === undefined || intuition !== undefined) &&
    (input.assumptionsAndLimits === undefined ||
      assumptionsAndLimits !== undefined) &&
    (input.misconception === undefined || misconception !== undefined) &&
    (input.prerequisiteTermIds === undefined ||
      prerequisiteTermIds !== undefined) &&
    (input.relatedTerms === undefined || relatedTerms !== undefined) &&
    (input.commonlyConfusedTerms === undefined ||
      commonlyConfusedTerms !== undefined) &&
    (input.moduleNote === undefined || moduleNote !== undefined);
  if (
    !valid ||
    id === undefined ||
    typeof label !== "string" ||
    definition === undefined ||
    whyItMatters === undefined ||
    tutorTopic === undefined
  ) {
    return undefined;
  }

  return Object.freeze({
    id,
    label,
    aliases: Object.freeze(aliases),
    definition,
    ...(fullDefinition === undefined ? {} : { fullDefinition }),
    ...(intuition === undefined ? {} : { intuition }),
    whyItMatters,
    ...(formula === undefined ? {} : { formula }),
    ...(assumptionsAndLimits === undefined ? {} : { assumptionsAndLimits }),
    ...(misconception === undefined ? {} : { misconception }),
    ...(prerequisiteTermIds === undefined ? {} : { prerequisiteTermIds }),
    ...(relatedTerms === undefined ? {} : { relatedTerms }),
    ...(commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
    ...(moduleNote === undefined ? {} : { moduleNote }),
    tutorTopic,
  });
}

export function defineGlossaryModuleExtension(
  input: GlossaryModuleExtensionInput,
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryModuleExtension | undefined {
  const sink = createGlossaryDiagnosticSink(policy);
  if (!isPlainDataRecord(input as unknown)) {
    sink.reject({ code: "invalid_content_field", field: "extension" });
    return undefined;
  }
  let valid = rejectUnexpectedKeys(
    input as unknown as Record<string, unknown>,
    EXTENSION_KEYS,
    sink
  );
  if (!Array.isArray(input.overrides)) {
    sink.reject({ code: "invalid_content_field", field: "overrides" });
    return undefined;
  }
  const overrides: GlossaryModuleOverride[] = [];

  for (const inputOverride of input.overrides) {
    if (!isPlainDataRecord(inputOverride as unknown)) {
      sink.reject({ code: "invalid_content_field", field: "override" });
      valid = false;
      continue;
    }
    valid &&= rejectUnexpectedKeys(inputOverride, OVERRIDE_KEYS, sink, {
      termId: diagnosticDisplay(inputOverride.termId),
    });
    const termId = validateTermId(inputOverride.termId, sink);
    const formula =
      inputOverride.formula === undefined || inputOverride.formula === null
        ? inputOverride.formula
        : copyGlossaryFormula(
            inputOverride.formula,
            sink,
            inputOverride.termId
          );
    const contextualDefinition = copyOptionalText(
      inputOverride.contextualDefinition,
      "contextualDefinition",
      sink,
      inputOverride.termId
    );
    const whyItMattersHere = copyOptionalText(
      inputOverride.whyItMattersHere,
      "whyItMattersHere",
      sink,
      inputOverride.termId
    );
    const moduleNote = copyOptionalText(
      inputOverride.moduleNote,
      "moduleNote",
      sink,
      inputOverride.termId
    );
    const tutorTopic = copyOptionalText(
      inputOverride.tutorTopic,
      "tutorTopic",
      sink,
      inputOverride.termId
    );
    const prerequisiteTermIds =
      inputOverride.prerequisiteTermIds === undefined
        ? undefined
        : copyGlossaryPrerequisiteIds(
            inputOverride.prerequisiteTermIds,
            sink,
            inputOverride.termId
          );
    const relatedTerms =
      inputOverride.relatedTerms === undefined
        ? undefined
        : copyGlossaryRelatedTerms(
            inputOverride.relatedTerms,
            "relatedTerms",
            sink,
            inputOverride.termId
          );
    const commonlyConfusedTerms =
      inputOverride.commonlyConfusedTerms === undefined
        ? undefined
        : copyGlossaryRelatedTerms(
            inputOverride.commonlyConfusedTerms,
            "commonlyConfusedTerms",
            sink,
            inputOverride.termId
          );
    if (
      termId === undefined ||
      (inputOverride.formula !== undefined &&
        inputOverride.formula !== null &&
        formula === undefined) ||
      (inputOverride.contextualDefinition !== undefined &&
        contextualDefinition === undefined) ||
      (inputOverride.whyItMattersHere !== undefined &&
        whyItMattersHere === undefined) ||
      (inputOverride.moduleNote !== undefined && moduleNote === undefined) ||
      (inputOverride.tutorTopic !== undefined && tutorTopic === undefined) ||
      (inputOverride.prerequisiteTermIds !== undefined &&
        prerequisiteTermIds === undefined) ||
      (inputOverride.relatedTerms !== undefined &&
        relatedTerms === undefined) ||
      (inputOverride.commonlyConfusedTerms !== undefined &&
        commonlyConfusedTerms === undefined)
    ) {
      valid = false;
      continue;
    }
    overrides.push(
      Object.freeze({
        termId,
        ...(contextualDefinition === undefined
          ? {}
          : { contextualDefinition }),
        ...(whyItMattersHere === undefined
          ? {}
          : { whyItMattersHere }),
        ...(inputOverride.formula === undefined ? {} : { formula }),
        ...(moduleNote === undefined ? {} : { moduleNote }),
        ...(tutorTopic === undefined ? {} : { tutorTopic }),
        ...(prerequisiteTermIds === undefined ? {} : { prerequisiteTermIds }),
        ...(relatedTerms === undefined ? {} : { relatedTerms }),
        ...(commonlyConfusedTerms === undefined
          ? {}
          : { commonlyConfusedTerms }),
      })
    );
  }

  if (!valid) return undefined;
  return Object.freeze({
    moduleId: input.moduleId,
    overrides: Object.freeze(overrides),
  });
}

export function isGlossaryTermId(value: unknown): value is GlossaryTermId {
  return typeof value === "string" && GLOSSARY_ID_PATTERN.test(value);
}

export function isGlossaryScopeId(value: unknown): value is GlossaryScopeId {
  return typeof value === "string" && GLOSSARY_ID_PATTERN.test(value);
}

export function validateTermId(
  value: unknown,
  sink: GlossaryDiagnosticSink
): GlossaryTermId | undefined {
  if (isGlossaryTermId(value)) return value;
  sink.reject({ code: "invalid_term_id", termId: diagnosticDisplay(value) });
  return undefined;
}

export function validateScopeId(
  value: unknown,
  sink: GlossaryDiagnosticSink
): GlossaryScopeId | undefined {
  if (isGlossaryScopeId(value)) return value;
  sink.reject({ code: "invalid_scope_id", scopeId: diagnosticDisplay(value) });
  return undefined;
}

export function copyGlossaryTermDisplay(
  input: unknown,
  sink: GlossaryDiagnosticSink,
  context: {
    readonly termId?: string;
    readonly scopeId?: string;
  } = {}
): GlossaryTermDisplay | undefined {
  if (typeof input === "string") {
    if (input.trim().length > 0) return input;
  } else if (
    isPlainDataRecord(input) &&
    hasOnlyKeys(input, new Set(["kind", "latex", "accessibleText"])) &&
    input.kind === "math" &&
    typeof input.latex === "string" &&
    input.latex.trim().length > 0 &&
    typeof input.accessibleText === "string" &&
    input.accessibleText.trim().length > 0
  ) {
    const display: GlossaryMathDisplay = Object.freeze({
      kind: "math",
      latex: input.latex,
      accessibleText: input.accessibleText,
    });
    return display;
  }
  sink.reject({
    code: "invalid_display",
    ...context,
    display: diagnosticDisplay(input),
  });
  return undefined;
}

export function copyGlossaryFormula(
  input: GlossaryFormulaInput,
  sink: GlossaryDiagnosticSink,
  termId?: string
): GlossaryFormula | undefined {
  if (
    isPlainDataRecord(input) &&
    hasOnlyKeys(
      input,
      new Set(["latex", "accessibleText", "display"])
    ) &&
    typeof input.latex === "string" &&
    input.latex.trim().length > 0 &&
    typeof input.accessibleText === "string" &&
    input.accessibleText.trim().length > 0 &&
    (input.display === undefined ||
      input.display === "inline" ||
      input.display === "block")
  ) {
    return Object.freeze({
      latex: input.latex,
      accessibleText: input.accessibleText,
      ...(input.display === undefined ? {} : { display: input.display }),
    });
  }
  sink.reject({ code: "invalid_formula", termId });
  return undefined;
}

export function copyDisplayForFallback(
  display: unknown
): GlossaryTermDisplay {
  if (typeof display === "string") return display;
  if (isRecord(display)) {
    if (
      display.kind === "math" &&
      typeof display.latex === "string" &&
      typeof display.accessibleText === "string" &&
      display.latex.length > 0 &&
      display.accessibleText.length > 0
    ) {
      return Object.freeze({
        kind: "math",
        latex: display.latex,
        accessibleText: display.accessibleText,
      });
    }
    if (typeof display.accessibleText === "string") {
      return display.accessibleText;
    }
    if (typeof display.latex === "string") return display.latex;
  }
  return String(display);
}

export function readableGlossaryDisplay(display: unknown): string {
  const fallback = copyDisplayForFallback(display);
  return typeof fallback === "string"
    ? fallback
    : fallback.accessibleText;
}

function freezeDiagnostic(
  diagnostic: GlossaryDiagnostic
): GlossaryDiagnostic {
  return Object.freeze({ ...diagnostic });
}

function diagnosticKey(diagnostic: GlossaryDiagnostic): string {
  return [
    diagnostic.code,
    diagnostic.termId ?? "",
    diagnostic.scopeId ?? "",
    diagnostic.display ?? "",
    diagnostic.field ?? "",
    diagnostic.relatedTermId ?? "",
  ].join("\u0000");
}

function diagnosticDisplay(value: unknown): string {
  if (typeof value === "string") return value;
  if (isRecord(value)) {
    if (typeof value.accessibleText === "string") return value.accessibleText;
    if (typeof value.latex === "string") return value.latex;
  }
  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlainDataRecord(
  value: unknown
): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>
): boolean {
  return Object.keys(value).every((key) => allowed.has(key));
}

function rejectUnexpectedKeys(
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  sink: GlossaryDiagnosticSink,
  context: { readonly termId?: string } = {}
): boolean {
  let valid = true;
  for (const field of Object.keys(value)) {
    if (allowed.has(field)) continue;
    sink.reject({
      code: "unexpected_content_field",
      ...context,
      field,
    });
    valid = false;
  }
  return valid;
}

function copyNonemptyText(
  value: unknown,
  field: string,
  sink: GlossaryDiagnosticSink,
  termId?: string
): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  sink.reject({ code: "invalid_content_field", termId, field });
  return undefined;
}

function copyOptionalText(
  value: unknown,
  field: string,
  sink: GlossaryDiagnosticSink,
  termId?: string
): string | undefined {
  return value === undefined
    ? undefined
    : copyNonemptyText(value, field, sink, termId);
}

function copyGlossaryMisconception(
  value: unknown,
  sink: GlossaryDiagnosticSink,
  termId?: string
): GlossaryMisconception | undefined {
  if (!isPlainDataRecord(value)) {
    sink.reject({
      code: "invalid_content_field",
      termId,
      field: "misconception",
    });
    return undefined;
  }
  if (
    !rejectUnexpectedKeys(
      value,
      new Set(["statement", "correction"]),
      sink,
      { termId }
    )
  ) {
    return undefined;
  }
  const statement = copyNonemptyText(
    value.statement,
    "misconception.statement",
    sink,
    termId
  );
  const correction = copyNonemptyText(
    value.correction,
    "misconception.correction",
    sink,
    termId
  );
  if (statement === undefined || correction === undefined) return undefined;
  return Object.freeze({ statement, correction });
}

function copyGlossaryPrerequisiteIds(
  value: unknown,
  sink: GlossaryDiagnosticSink,
  termId?: string
): readonly GlossaryTermId[] | undefined {
  if (!Array.isArray(value)) {
    sink.reject({
      code: "invalid_content_field",
      termId,
      field: "prerequisiteTermIds",
    });
    return undefined;
  }
  const copied: GlossaryTermId[] = [];
  const seen = new Set<string>();
  let valid = true;
  for (const candidate of value) {
    const relatedTermId = validateTermId(candidate, sink);
    if (relatedTermId === undefined) {
      valid = false;
      continue;
    }
    if (relatedTermId === termId) {
      sink.reject({
        code: "self_reference",
        termId,
        relatedTermId,
        field: "prerequisiteTermIds",
      });
      valid = false;
      continue;
    }
    if (seen.has(relatedTermId)) {
      sink.reject({
        code: "duplicate_prerequisite",
        termId,
        relatedTermId,
        field: "prerequisiteTermIds",
      });
      valid = false;
      continue;
    }
    seen.add(relatedTermId);
    copied.push(relatedTermId);
  }
  return valid ? Object.freeze(copied) : undefined;
}

function copyGlossaryRelatedTerms(
  value: unknown,
  field: "relatedTerms" | "commonlyConfusedTerms",
  sink: GlossaryDiagnosticSink,
  termId?: string
): readonly GlossaryRelatedTerm[] | undefined {
  if (!Array.isArray(value)) {
    sink.reject({ code: "invalid_content_field", termId, field });
    return undefined;
  }
  const copied: GlossaryRelatedTerm[] = [];
  const liveIds = new Set<string>();
  const futureLabels = new Set<string>();
  let valid = true;
  for (const candidate of value) {
    if (!isPlainDataRecord(candidate)) {
      sink.reject({ code: "invalid_related_term", termId, field });
      valid = false;
      continue;
    }
    if (candidate.kind === "term") {
      if (
        !hasOnlyKeys(candidate, new Set(["kind", "termId"]))
      ) {
        sink.reject({ code: "invalid_related_term", termId, field });
        valid = false;
        continue;
      }
      const relatedTermId = validateTermId(candidate.termId, sink);
      if (relatedTermId === undefined) {
        valid = false;
        continue;
      }
      if (relatedTermId === termId) {
        sink.reject({
          code: "self_reference",
          termId,
          relatedTermId,
          field,
        });
        valid = false;
        continue;
      }
      if (liveIds.has(relatedTermId)) {
        sink.reject({
          code: "duplicate_live_reference",
          termId,
          relatedTermId,
          field,
        });
        valid = false;
        continue;
      }
      liveIds.add(relatedTermId);
      copied.push(Object.freeze({ kind: "term", termId: relatedTermId }));
      continue;
    }
    if (candidate.kind === "future") {
      if (
        !hasOnlyKeys(candidate, new Set(["kind", "label"])) ||
        typeof candidate.label !== "string" ||
        candidate.label.trim().length === 0
      ) {
        sink.reject({ code: "invalid_related_term", termId, field });
        valid = false;
        continue;
      }
      if (futureLabels.has(candidate.label)) {
        sink.reject({
          code: "duplicate_future_label",
          termId,
          field,
          display: candidate.label,
        });
        valid = false;
        continue;
      }
      futureLabels.add(candidate.label);
      copied.push(
        Object.freeze({ kind: "future", label: candidate.label })
      );
      continue;
    }
    sink.reject({ code: "invalid_related_term", termId, field });
    valid = false;
  }
  return valid ? Object.freeze(copied) : undefined;
}
