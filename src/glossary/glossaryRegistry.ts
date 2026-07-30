import type { LabModuleId } from "../app/contracts";
import {
  copyDisplayForFallback,
  copyGlossaryTermDisplay,
  createGlossaryDiagnosticSink,
  readableGlossaryDisplay,
  type GlossaryDiagnosticSink,
  validateTermId,
} from "./glossaryBuilders";
import type {
  GlossaryDiagnostic,
  GlossaryEntry,
  GlossaryMisconception,
  GlossaryModuleExtension,
  GlossaryModuleOverride,
  GlossaryRelatedTerm,
  GlossaryResolution,
  GlossaryTermDisplay,
  GlossaryTermId,
  GlossaryValidationPolicy,
  ResolvedGlossaryEntry,
} from "./glossaryRuntimeTypes";

export interface GlossaryRegistry {
  resolve(
    moduleId: LabModuleId,
    termId: GlossaryTermId,
    display: GlossaryTermDisplay
  ): GlossaryResolution;
  resolveById(
    moduleId: LabModuleId,
    termId: GlossaryTermId
  ): ResolvedGlossaryEntry | undefined;
}

export function createGlossaryRegistry(options: {
  readonly coreEntries: readonly GlossaryEntry[];
  readonly extensions?: readonly GlossaryModuleExtension[];
  readonly policy: GlossaryValidationPolicy;
}): GlossaryRegistry {
  const diagnostics = createGlossaryDiagnosticSink(options.policy);
  const entries = new Map<GlossaryTermId, GlossaryEntry>();
  const aliasOwners = new Map<string, GlossaryTermId>();
  const invalidAliases = new Set<string>();

  for (const inputEntry of [...options.coreEntries]) {
    const id = validateTermId(inputEntry.id, diagnostics);
    if (id === undefined) continue;
    const entry = cloneEntry(inputEntry, id);
    if (entries.has(entry.id)) {
      diagnostics.reject({
        code: "duplicate_term_id",
        termId: entry.id,
      });
      continue;
    }
    entries.set(entry.id, entry);
    for (const display of [entry.label, ...entry.aliases]) {
      const key = displayKey(display);
      const owner = aliasOwners.get(key);
      if (owner !== undefined) {
        invalidAliases.add(termDisplayKey(entry.id, key));
        diagnostics.reject({
          code: "conflicting_alias",
          termId: entry.id,
          display: readableDisplay(display),
        });
        continue;
      }
      aliasOwners.set(key, entry.id);
    }
  }

  const overrides = new Map<LabModuleId, Map<GlossaryTermId, GlossaryModuleOverride>>();
  for (const extension of [...(options.extensions ?? [])]) {
    let moduleOverrides = overrides.get(extension.moduleId);
    if (!moduleOverrides) {
      moduleOverrides = new Map();
      overrides.set(extension.moduleId, moduleOverrides);
    }
    for (const inputOverride of extension.overrides) {
      const termId = validateTermId(
        inputOverride.termId,
        diagnostics
      );
      if (termId === undefined) continue;
      const override = cloneOverride(inputOverride, termId);
      if (!entries.has(override.termId)) {
        diagnostics.reject({
          code: "unknown_override_target",
          termId: override.termId,
        });
        continue;
      }
      if (!moduleOverrides.has(override.termId)) {
        moduleOverrides.set(override.termId, override);
      } else {
        diagnostics.reject({
          code: "duplicate_override_target",
          termId: override.termId,
        });
      }
    }
  }

  for (const [termId, entry] of entries) {
    entries.set(
      termId,
      validateEntryRelationships(entry, entries, diagnostics)
    );
  }
  for (const moduleOverrides of overrides.values()) {
    for (const [termId, override] of moduleOverrides) {
      moduleOverrides.set(
        termId,
        validateOverrideRelationships(override, entries, diagnostics)
      );
    }
  }

  return Object.freeze({
    resolve(
      moduleId: LabModuleId,
      termId: GlossaryTermId,
      display: GlossaryTermDisplay
    ): GlossaryResolution {
      const entry = entries.get(termId);
      if (!entry) {
        const diagnostic = freezeDiagnostic({
          code: "unknown_term",
          termId: String(termId),
        });
        diagnostics.reject(diagnostic);
        return invalidResolution(display, diagnostic);
      }

      const copiedDisplay = copyGlossaryTermDisplay(display, diagnostics, {
        termId,
      });
      if (copiedDisplay === undefined) {
        const diagnostic = freezeDiagnostic({
          code: "invalid_display",
          termId,
          display: readableGlossaryDisplay(display),
        });
        return invalidResolution(display, diagnostic);
      }
      const accepted = [entry.label, ...entry.aliases].some(
        (candidate) => displayKey(candidate) === displayKey(copiedDisplay)
      );
      const invalidAlias = invalidAliases.has(
        termDisplayKey(termId, displayKey(copiedDisplay))
      );
      if (!accepted || invalidAlias) {
        const diagnostic = freezeDiagnostic({
          code: invalidAlias ? "conflicting_alias" : "invalid_display",
          termId,
          display: readableDisplay(copiedDisplay),
        });
        diagnostics.reject(diagnostic);
        return invalidResolution(copiedDisplay, diagnostic);
      }

      const resolved = composeResolvedEntry(
        entry,
        overrides.get(moduleId)?.get(termId),
        moduleId,
        copiedDisplay
      );
      return Object.freeze({ kind: "resolved", entry: resolved });
    },
    resolveById(
      moduleId: LabModuleId,
      termId: GlossaryTermId
    ): ResolvedGlossaryEntry | undefined {
      const entry = entries.get(termId);
      if (!entry) return undefined;
      return composeResolvedEntry(
        entry,
        overrides.get(moduleId)?.get(termId),
        moduleId,
        entry.label
      );
    },
  });
}

function invalidResolution(
  display: GlossaryTermDisplay,
  diagnostic: GlossaryDiagnostic
): GlossaryResolution {
  return Object.freeze({
    kind: "invalid",
    diagnostic,
    display: copyDisplayForFallback(display),
  });
}

function displayKey(display: GlossaryTermDisplay): string {
  return typeof display === "string"
    ? `text\u0000${display}`
    : `math\u0000${display.latex}\u0000${display.accessibleText}`;
}

function termDisplayKey(termId: GlossaryTermId, key: string): string {
  return `${termId}\u0000${key}`;
}

function readableDisplay(display: GlossaryTermDisplay): string {
  return readableGlossaryDisplay(display);
}

function freezeDiagnostic(diagnostic: GlossaryDiagnostic): GlossaryDiagnostic {
  return Object.freeze({ ...diagnostic });
}

function cloneEntry(
  entry: GlossaryEntry,
  id: GlossaryTermId
): GlossaryEntry {
  const aliases = Object.freeze(entry.aliases.map(cloneDisplay));
  const formula = entry.formula
    ? Object.freeze({ ...entry.formula })
    : undefined;
  const misconception = cloneMisconception(entry.misconception);
  const prerequisiteTermIds = cloneTermIds(entry.prerequisiteTermIds);
  const relatedTerms = cloneRelatedTerms(entry.relatedTerms);
  const commonlyConfusedTerms = cloneRelatedTerms(
    entry.commonlyConfusedTerms
  );
  return Object.freeze({
    id,
    label: entry.label,
    aliases,
    definition: entry.definition,
    ...(entry.fullDefinition === undefined
      ? {}
      : { fullDefinition: entry.fullDefinition }),
    ...(entry.intuition === undefined ? {} : { intuition: entry.intuition }),
    whyItMatters: entry.whyItMatters,
    ...(formula === undefined ? {} : { formula }),
    ...(entry.assumptionsAndLimits === undefined
      ? {}
      : { assumptionsAndLimits: entry.assumptionsAndLimits }),
    ...(misconception === undefined ? {} : { misconception }),
    ...(prerequisiteTermIds === undefined ? {} : { prerequisiteTermIds }),
    ...(relatedTerms === undefined ? {} : { relatedTerms }),
    ...(commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
    ...(entry.moduleNote === undefined
      ? {}
      : { moduleNote: entry.moduleNote }),
    tutorTopic: entry.tutorTopic,
  });
}

function cloneOverride(
  override: GlossaryModuleOverride,
  termId: GlossaryTermId
): GlossaryModuleOverride {
  const formula =
    override.formula === undefined || override.formula === null
      ? override.formula
      : Object.freeze({ ...override.formula });
  const prerequisiteTermIds = cloneTermIds(override.prerequisiteTermIds);
  const relatedTerms = cloneRelatedTerms(override.relatedTerms);
  const commonlyConfusedTerms = cloneRelatedTerms(
    override.commonlyConfusedTerms
  );
  return Object.freeze({
    termId,
    ...(override.contextualDefinition === undefined
      ? {}
      : { contextualDefinition: override.contextualDefinition }),
    ...(override.whyItMattersHere === undefined
      ? {}
      : { whyItMattersHere: override.whyItMattersHere }),
    ...(override.formula === undefined ? {} : { formula }),
    ...(override.moduleNote === undefined
      ? {}
      : { moduleNote: override.moduleNote }),
    ...(override.tutorTopic === undefined
      ? {}
      : { tutorTopic: override.tutorTopic }),
    ...(prerequisiteTermIds === undefined ? {} : { prerequisiteTermIds }),
    ...(relatedTerms === undefined ? {} : { relatedTerms }),
    ...(commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
  });
}

function cloneDisplay(display: GlossaryTermDisplay): GlossaryTermDisplay {
  return typeof display === "string"
    ? display
    : Object.freeze({
        kind: "math",
        latex: display.latex,
        accessibleText: display.accessibleText,
      });
}

function composeResolvedEntry(
  entry: GlossaryEntry,
  override: GlossaryModuleOverride | undefined,
  moduleId: LabModuleId,
  display: GlossaryTermDisplay
): ResolvedGlossaryEntry {
  const formula =
    override?.formula === null
      ? undefined
      : cloneFormula(override?.formula ?? entry.formula);
  const misconception = cloneMisconception(entry.misconception);
  const prerequisiteTermIds = cloneTermIds(
    override?.prerequisiteTermIds !== undefined
      ? override.prerequisiteTermIds
      : entry.prerequisiteTermIds
  );
  const relatedTerms = cloneRelatedTerms(
    override?.relatedTerms !== undefined
      ? override.relatedTerms
      : entry.relatedTerms
  );
  const commonlyConfusedTerms = cloneRelatedTerms(
    override?.commonlyConfusedTerms !== undefined
      ? override.commonlyConfusedTerms
      : entry.commonlyConfusedTerms
  );
  return Object.freeze({
    id: entry.id,
    moduleId,
    display: cloneDisplay(display),
    label: entry.label,
    aliases: Object.freeze(entry.aliases.map(cloneDisplay)),
    definition: entry.definition,
    ...(entry.fullDefinition === undefined
      ? {}
      : { fullDefinition: entry.fullDefinition }),
    ...(entry.intuition === undefined ? {} : { intuition: entry.intuition }),
    whyItMatters: entry.whyItMatters,
    contextualDefinition: override?.contextualDefinition,
    whyItMattersHere: override?.whyItMattersHere,
    formula,
    ...(entry.assumptionsAndLimits === undefined
      ? {}
      : { assumptionsAndLimits: entry.assumptionsAndLimits }),
    ...(misconception === undefined ? {} : { misconception }),
    ...(prerequisiteTermIds === undefined ? {} : { prerequisiteTermIds }),
    ...(relatedTerms === undefined ? {} : { relatedTerms }),
    ...(commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
    ...(override?.moduleNote !== undefined
      ? { moduleNote: override.moduleNote }
      : entry.moduleNote === undefined
        ? {}
        : { moduleNote: entry.moduleNote }),
    tutorTopic: override?.tutorTopic ?? entry.tutorTopic,
  });
}

function validateEntryRelationships(
  entry: GlossaryEntry,
  entries: ReadonlyMap<GlossaryTermId, GlossaryEntry>,
  diagnostics: GlossaryDiagnosticSink
): GlossaryEntry {
  const prerequisiteTermIds = validateTermIdList(
    entry.id,
    "prerequisiteTermIds",
    entry.prerequisiteTermIds,
    entries,
    diagnostics
  );
  const relatedTerms = validateRelatedList(
    entry.id,
    "relatedTerms",
    entry.relatedTerms,
    entries,
    diagnostics
  );
  const commonlyConfusedTerms = validateRelatedList(
    entry.id,
    "commonlyConfusedTerms",
    entry.commonlyConfusedTerms,
    entries,
    diagnostics
  );
  return Object.freeze({
    ...entry,
    ...(entry.prerequisiteTermIds === undefined
      ? {}
      : { prerequisiteTermIds }),
    ...(entry.relatedTerms === undefined ? {} : { relatedTerms }),
    ...(entry.commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
  });
}

function validateOverrideRelationships(
  override: GlossaryModuleOverride,
  entries: ReadonlyMap<GlossaryTermId, GlossaryEntry>,
  diagnostics: GlossaryDiagnosticSink
): GlossaryModuleOverride {
  const prerequisiteTermIds = validateTermIdList(
    override.termId,
    "prerequisiteTermIds",
    override.prerequisiteTermIds,
    entries,
    diagnostics
  );
  const relatedTerms = validateRelatedList(
    override.termId,
    "relatedTerms",
    override.relatedTerms,
    entries,
    diagnostics
  );
  const commonlyConfusedTerms = validateRelatedList(
    override.termId,
    "commonlyConfusedTerms",
    override.commonlyConfusedTerms,
    entries,
    diagnostics
  );
  return Object.freeze({
    ...override,
    ...(override.prerequisiteTermIds === undefined
      ? {}
      : { prerequisiteTermIds }),
    ...(override.relatedTerms === undefined ? {} : { relatedTerms }),
    ...(override.commonlyConfusedTerms === undefined
      ? {}
      : { commonlyConfusedTerms }),
  });
}

function validateTermIdList(
  ownerId: GlossaryTermId,
  field: "prerequisiteTermIds",
  values: readonly GlossaryTermId[] | undefined,
  entries: ReadonlyMap<GlossaryTermId, GlossaryEntry>,
  diagnostics: GlossaryDiagnosticSink
): readonly GlossaryTermId[] | undefined {
  if (values === undefined) return undefined;
  const valid: GlossaryTermId[] = [];
  const seen = new Set<string>();
  for (const relatedTermId of values) {
    if (relatedTermId === ownerId) {
      diagnostics.reject({
        code: "self_reference",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    if (seen.has(relatedTermId)) {
      diagnostics.reject({
        code: "duplicate_prerequisite",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    seen.add(relatedTermId);
    if (!entries.has(relatedTermId)) {
      diagnostics.reject({
        code: "unknown_live_reference",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    valid.push(relatedTermId);
  }
  return Object.freeze(valid);
}

function validateRelatedList(
  ownerId: GlossaryTermId,
  field: "relatedTerms" | "commonlyConfusedTerms",
  values: readonly GlossaryRelatedTerm[] | undefined,
  entries: ReadonlyMap<GlossaryTermId, GlossaryEntry>,
  diagnostics: GlossaryDiagnosticSink
): readonly GlossaryRelatedTerm[] | undefined {
  if (values === undefined) return undefined;
  const valid: GlossaryRelatedTerm[] = [];
  const liveIds = new Set<string>();
  const futureLabels = new Set<string>();
  for (const relation of values) {
    if (relation.kind === "future") {
      if (relation.label.trim().length === 0) {
        diagnostics.reject({
          code: "invalid_related_term",
          termId: ownerId,
          field,
        });
        continue;
      }
      if (futureLabels.has(relation.label)) {
        diagnostics.reject({
          code: "duplicate_future_label",
          termId: ownerId,
          field,
          display: relation.label,
        });
        continue;
      }
      futureLabels.add(relation.label);
      valid.push(Object.freeze({ kind: "future", label: relation.label }));
      continue;
    }
    const relatedTermId = relation.termId;
    if (relatedTermId === ownerId) {
      diagnostics.reject({
        code: "self_reference",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    if (liveIds.has(relatedTermId)) {
      diagnostics.reject({
        code: "duplicate_live_reference",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    liveIds.add(relatedTermId);
    if (!entries.has(relatedTermId)) {
      diagnostics.reject({
        code: "unknown_live_reference",
        termId: ownerId,
        relatedTermId,
        field,
      });
      continue;
    }
    valid.push(Object.freeze({ kind: "term", termId: relatedTermId }));
  }
  return Object.freeze(valid);
}

function cloneFormula(
  formula: GlossaryEntry["formula"]
): GlossaryEntry["formula"] {
  return formula === undefined ? undefined : Object.freeze({ ...formula });
}

function cloneMisconception(
  misconception: GlossaryMisconception | undefined
): GlossaryMisconception | undefined {
  return misconception === undefined
    ? undefined
    : Object.freeze({
        statement: misconception.statement,
        correction: misconception.correction,
      });
}

function cloneTermIds(
  termIds: readonly GlossaryTermId[] | undefined
): readonly GlossaryTermId[] | undefined {
  return termIds === undefined ? undefined : Object.freeze([...termIds]);
}

function cloneRelatedTerms(
  relations: readonly GlossaryRelatedTerm[] | undefined
): readonly GlossaryRelatedTerm[] | undefined {
  return relations === undefined
    ? undefined
    : Object.freeze(
        relations.map((relation) =>
          relation.kind === "term"
            ? Object.freeze({ kind: "term" as const, termId: relation.termId })
            : Object.freeze({ kind: "future" as const, label: relation.label })
        )
      );
}

export type { GlossaryDiagnosticSink };
