import type { LabModuleId } from "../app/contracts";

declare const glossaryTermIdBrand: unique symbol;
declare const glossaryScopeIdBrand: unique symbol;

export type GlossaryTermId = string & {
  readonly [glossaryTermIdBrand]: true;
};

export type GlossaryScopeId = string & {
  readonly [glossaryScopeIdBrand]: true;
};

export interface GlossaryFormula {
  readonly latex: string;
  readonly accessibleText: string;
  readonly display?: "inline" | "block";
}

export interface GlossaryMathDisplay {
  readonly kind: "math";
  readonly latex: string;
  readonly accessibleText: string;
}

export type GlossaryTermDisplay = string | GlossaryMathDisplay;

export type GlossaryRelatedTerm =
  | Readonly<{
      kind: "term";
      termId: GlossaryTermId;
    }>
  | Readonly<{
      kind: "future";
      label: string;
    }>;

export interface GlossaryMisconception {
  readonly statement: string;
  readonly correction: string;
}

export interface GlossaryEntry {
  readonly id: GlossaryTermId;
  readonly label: string;
  readonly aliases: readonly GlossaryTermDisplay[];
  readonly definition: string;
  readonly fullDefinition?: string;
  readonly intuition?: string;
  readonly whyItMatters: string;
  readonly formula?: GlossaryFormula;
  readonly assumptionsAndLimits?: string;
  readonly misconception?: GlossaryMisconception;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
  readonly moduleNote?: string;
  readonly tutorTopic: string;
}

export interface GlossaryModuleOverride {
  readonly termId: GlossaryTermId;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula | null;
  readonly moduleNote?: string;
  readonly tutorTopic?: string;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
}

export interface GlossaryModuleExtension {
  readonly moduleId: LabModuleId;
  readonly overrides: readonly GlossaryModuleOverride[];
}

export type GlossaryDiagnosticCode =
  | "invalid_term_id"
  | "invalid_scope_id"
  | "duplicate_term_id"
  | "duplicate_scope_id"
  | "conflicting_alias"
  | "unknown_term"
  | "unknown_override_target"
  | "invalid_display"
  | "invalid_formula"
  | "invalid_content_field"
  | "unexpected_content_field"
  | "invalid_related_term"
  | "duplicate_prerequisite"
  | "duplicate_live_reference"
  | "duplicate_future_label"
  | "self_reference"
  | "unknown_live_reference"
  | "duplicate_override_target"
  | "connection_conflict"
  | "rerender_conflict"
  | "binding_disposed"
  | "scope_disposed";

export interface GlossaryDiagnostic {
  readonly code: GlossaryDiagnosticCode;
  readonly termId?: string;
  readonly scopeId?: string;
  readonly display?: string;
  readonly field?: string;
  readonly relatedTermId?: string;
}

export interface GlossaryValidationPolicy {
  readonly mode: "strict" | "production-fallback";
  report(diagnostic: GlossaryDiagnostic): void;
}

export interface ResolvedGlossaryEntry {
  readonly id: GlossaryTermId;
  readonly moduleId: LabModuleId;
  readonly display: GlossaryTermDisplay;
  readonly label: string;
  readonly aliases: readonly GlossaryTermDisplay[];
  readonly definition: string;
  readonly fullDefinition?: string;
  readonly intuition?: string;
  readonly whyItMatters: string;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula;
  readonly assumptionsAndLimits?: string;
  readonly misconception?: GlossaryMisconception;
  readonly prerequisiteTermIds?: readonly GlossaryTermId[];
  readonly relatedTerms?: readonly GlossaryRelatedTerm[];
  readonly commonlyConfusedTerms?: readonly GlossaryRelatedTerm[];
  readonly moduleNote?: string;
  readonly tutorTopic: string;
}

export type GlossaryResolution =
  | {
      readonly kind: "resolved";
      readonly entry: ResolvedGlossaryEntry;
    }
  | {
      readonly kind: "invalid";
      readonly diagnostic: GlossaryDiagnostic;
      readonly display: GlossaryTermDisplay;
    };

export interface GlossaryTermContextSnapshot {
  readonly termId: GlossaryTermId;
  readonly contextualDefinition?: string;
  readonly whyItMattersHere?: string;
  readonly formula?: GlossaryFormula | null;
  readonly curatedTutorContext?: string;
}

export interface GlossaryScopeSnapshot {
  readonly revision: number;
  readonly terms: readonly GlossaryTermContextSnapshot[];
}

export interface GlossaryScopeContextSource {
  getSnapshot(): GlossaryScopeSnapshot;
  subscribe(listener: () => void): () => void;
}

export interface GlossaryBindingIdentity {
  readonly moduleId: LabModuleId;
}

export interface GlossaryScopeIdentity {
  readonly binding: GlossaryBindingIdentity;
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly generation: number;
}

export interface GlossaryTermIdentity {
  readonly binding: GlossaryBindingIdentity;
  readonly scope: GlossaryScopeIdentity;
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly termId: GlossaryTermId;
  readonly scopeGeneration: number;
  readonly trigger: HTMLButtonElement;
}

export type GlossaryOpenIntent =
  | { readonly kind: "hover" }
  | { readonly kind: "keyboard-focus" }
  | {
      readonly kind: "activate";
      readonly pointer: "mouse" | "touch" | "keyboard";
    };

export interface GlossarySurfaceTermResolver {
  resolve(termId: GlossaryTermId): ResolvedGlossaryEntry | undefined;
}

export interface GlossarySurfaceRequest {
  readonly identity: GlossaryTermIdentity;
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly termId: GlossaryTermId;
  readonly trigger: HTMLButtonElement;
  readonly display: GlossaryTermDisplay;
  readonly entry: ResolvedGlossaryEntry;
  readonly termResolver: GlossarySurfaceTermResolver;
  readonly context?: GlossaryScopeContextSource;
  readonly intent: GlossaryOpenIntent;
  readonly scopeGeneration: number;
}

export interface GlossaryReplacementCandidate {
  readonly mode: "pinned" | "mobile-sheet";
  readonly identity: GlossaryTermIdentity;
}

export type GlossaryReplacementResult =
  | {
      readonly kind: "transferred";
      readonly previous: GlossaryReplacementCandidate;
      readonly replacement: GlossaryTermIdentity;
    }
  | {
      readonly kind: "closed";
      readonly scope: GlossaryScopeIdentity;
      readonly previous?: GlossaryReplacementCandidate;
    };

export interface GlossaryHostPort {
  requestOpen(request: GlossarySurfaceRequest): void;
  requestClose(request: GlossarySurfaceRequest): void;
  beginScopeRerender(
    identity: GlossaryScopeIdentity
  ): GlossaryReplacementCandidate | undefined;
  scopeDisposed(identity: GlossaryScopeIdentity): void;
  replacementCommitted(result: GlossaryReplacementResult): void;
}

export type GlossaryTermRenderResult =
  | {
      readonly kind: "interactive";
      readonly node: HTMLButtonElement;
      dispose(): void;
    }
  | {
      readonly kind: "plain-text";
      readonly node: Text | HTMLElement;
    };

export interface GlossaryScopeController {
  readonly id: GlossaryScopeId;
  createTerm(options: {
    readonly termId: GlossaryTermId;
    readonly display: GlossaryTermDisplay;
  }): GlossaryTermRenderResult;
  dispose(): void;
}

export interface GlossaryScopeRerenderTransaction {
  readonly scope: GlossaryScopeController;
  commit(): void;
  abort(): void;
}
