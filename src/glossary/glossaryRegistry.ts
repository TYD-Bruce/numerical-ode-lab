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
  GlossaryModuleExtension,
  GlossaryModuleOverride,
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
      }
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

      const override = overrides.get(moduleId)?.get(termId);
      const formula =
        override?.formula === null
          ? undefined
          : override?.formula ?? entry.formula;
      const resolved: ResolvedGlossaryEntry = Object.freeze({
        id: entry.id,
        moduleId,
        display: copiedDisplay,
        label: entry.label,
        aliases: entry.aliases,
        definition: entry.definition,
        whyItMatters: entry.whyItMatters,
        contextualDefinition: override?.contextualDefinition,
        whyItMattersHere: override?.whyItMattersHere,
        formula,
        tutorTopic: override?.tutorTopic ?? entry.tutorTopic,
      });
      return Object.freeze({ kind: "resolved", entry: resolved });
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
  return Object.freeze({
    id,
    label: entry.label,
    aliases,
    definition: entry.definition,
    whyItMatters: entry.whyItMatters,
    ...(formula === undefined ? {} : { formula }),
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
  return Object.freeze({
    termId,
    ...(override.contextualDefinition === undefined
      ? {}
      : { contextualDefinition: override.contextualDefinition }),
    ...(override.whyItMattersHere === undefined
      ? {}
      : { whyItMattersHere: override.whyItMattersHere }),
    ...(override.formula === undefined ? {} : { formula }),
    ...(override.tutorTopic === undefined
      ? {}
      : { tutorTopic: override.tutorTopic }),
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

export type { GlossaryDiagnosticSink };
