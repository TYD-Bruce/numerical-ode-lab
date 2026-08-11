import type { LabModuleId } from "../app/contracts";
import type {
  GlossaryScopeId,
  GlossaryTermId,
} from "./glossaryRuntimeTypes";

export interface GlossaryTutorRequest {
  readonly kind: "glossary_term";
  readonly termId: GlossaryTermId;
  readonly moduleId: LabModuleId;
  readonly scopeId: GlossaryScopeId;
  readonly curatedScopeContext?: string;
}

export type GlossaryTutorHandoffResult =
  | { readonly status: "started"; readonly transcriptItemId?: string }
  | { readonly status: "queued" }
  | { readonly status: "replacement-required" }
  | { readonly status: "cancelled" };

export interface GlossaryTutorHandoff {
  askTerm(options: {
    readonly request: GlossaryTutorRequest;
    readonly trigger: HTMLElement;
    readonly preserveDraft: true;
  }): Promise<GlossaryTutorHandoffResult>;
}
