import type { LabModuleId } from "../app/contracts";
import type {
  GlossaryDiagnostic,
  GlossaryEntry,
  GlossaryFormula,
  GlossaryMathDisplay,
  GlossaryModuleExtension,
  GlossaryModuleOverride,
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
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormulaInput;
  readonly tutorTopic: string;
}

export interface GlossaryModuleOverrideInput {
  readonly termId: string;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormulaInput | null;
  readonly tutorTopic?: string;
}

export interface GlossaryModuleExtensionInput {
  readonly moduleId: LabModuleId;
  readonly overrides: readonly GlossaryModuleOverrideInput[];
}

export interface GlossaryDiagnosticSink {
  readonly policy: GlossaryValidationPolicy;
  reject(diagnostic: GlossaryDiagnostic): false;
}

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
  const id = validateTermId(input.id, sink);
  let valid = id !== undefined;
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
  if (!valid || id === undefined || typeof label !== "string") return undefined;

  return Object.freeze({
    id,
    label,
    aliases: Object.freeze(aliases),
    definition: input.definition,
    whyItMatters: input.whyItMatters,
    ...(formula === undefined ? {} : { formula }),
    tutorTopic: input.tutorTopic,
  });
}

export function defineGlossaryModuleExtension(
  input: GlossaryModuleExtensionInput,
  policy: GlossaryValidationPolicy = defaultGlossaryValidationPolicy
): GlossaryModuleExtension | undefined {
  const sink = createGlossaryDiagnosticSink(policy);
  const overrides: GlossaryModuleOverride[] = [];
  let valid = true;

  for (const inputOverride of input.overrides) {
    const termId = validateTermId(inputOverride.termId, sink);
    const formula =
      inputOverride.formula === undefined || inputOverride.formula === null
        ? inputOverride.formula
        : copyGlossaryFormula(
            inputOverride.formula,
            sink,
            inputOverride.termId
          );
    if (
      termId === undefined ||
      (inputOverride.formula !== undefined &&
        inputOverride.formula !== null &&
        formula === undefined)
    ) {
      valid = false;
      continue;
    }
    overrides.push(
      Object.freeze({
        termId,
        ...(inputOverride.contextualDefinition === undefined
          ? {}
          : { contextualDefinition: inputOverride.contextualDefinition }),
        ...(inputOverride.whyItMattersHere === undefined
          ? {}
          : { whyItMattersHere: inputOverride.whyItMattersHere }),
        ...(inputOverride.formula === undefined ? {} : { formula }),
        ...(inputOverride.tutorTopic === undefined
          ? {}
          : { tutorTopic: inputOverride.tutorTopic }),
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
    if (input.length > 0) return input;
  } else if (
    isRecord(input) &&
    input.kind === "math" &&
    typeof input.latex === "string" &&
    input.latex.length > 0 &&
    typeof input.accessibleText === "string" &&
    input.accessibleText.length > 0
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
    typeof input.latex === "string" &&
    input.latex.length > 0 &&
    typeof input.accessibleText === "string" &&
    input.accessibleText.length > 0 &&
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
