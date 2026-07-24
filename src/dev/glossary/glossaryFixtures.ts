import {
  defineGlossaryEntry,
  defineGlossaryScopeId,
  defineGlossaryTermId,
} from "../../glossary/glossaryBuilders";
import type {
  GlossaryEntry,
  GlossaryScopeId,
  GlossaryTermId,
} from "../../glossary/glossaryRuntimeTypes";

function requiredTermId(value: string): GlossaryTermId {
  const id = defineGlossaryTermId(value);
  if (!id) throw new Error(`Invalid development fixture term ID: ${value}`);
  return id;
}

function requiredScopeId(value: string): GlossaryScopeId {
  const id = defineGlossaryScopeId(value);
  if (!id) throw new Error(`Invalid development fixture scope ID: ${value}`);
  return id;
}

function requiredEntry(input: Parameters<typeof defineGlossaryEntry>[0]): GlossaryEntry {
  const entry = defineGlossaryEntry(input);
  if (!entry) throw new Error(`Invalid development fixture: ${input.id}`);
  return entry;
}

export const GLOSSARY_FIXTURE_IDS = Object.freeze({
  sample: requiredTermId("sample_term"),
  dynamic: requiredTermId("dynamic_term"),
  formula: requiredTermId("formula_term"),
  label: requiredTermId("label_term"),
  replacement: requiredTermId("replacement_term"),
});

export const GLOSSARY_FIXTURE_SCOPE_IDS = Object.freeze({
  primary: requiredScopeId("playground_primary"),
  form: requiredScopeId("playground_form"),
  replacement: requiredScopeId("playground_replacement"),
});

export const GLOSSARY_FIXTURE_ENTRIES: readonly GlossaryEntry[] = Object.freeze([
  requiredEntry({
    id: "sample_term",
    label: "Sample parameter",
    definition: "A content-neutral value used to exercise a definition preview.",
    whyItMatters: "It verifies the shared surface without teaching production mathematics.",
    tutorTopic: "development sample",
  }),
  requiredEntry({
    id: "dynamic_term",
    label: "Changing context",
    definition: "A fixture whose surrounding explanation can change while open.",
    whyItMatters: "It verifies live context refresh without remounting the card.",
    tutorTopic: "development dynamic context",
  }),
  requiredEntry({
    id: "formula_term",
    label: "Formula example",
    definition: "A display-only fixture for the safe readonly formula boundary.",
    whyItMatters: "It verifies readable fallback and deferred enhancement.",
    formula: {
      latex: "s=v",
      accessibleText: "fixture symbol equals fixture value",
      display: "block",
    },
    tutorTopic: "development formula",
  }),
  requiredEntry({
    id: "label_term",
    label: "Input concept",
    definition: "A fixture term rendered beside, never inside, a native input label.",
    whyItMatters: "It verifies that the input keeps its own accessible name and descriptions.",
    tutorTopic: "development form label",
  }),
  requiredEntry({
    id: "replacement_term",
    label: "Replaceable term",
    definition: "A fixture whose trigger can be replaced by an explicit transaction.",
    whyItMatters: "It verifies safe anchor transfer without DOM scanning.",
    tutorTopic: "development replacement",
  }),
]);

export const GLOSSARY_DEVELOPMENT_WARNING =
  "Development fixtures only — not production definitions.";
