import {
  defineGlossaryEntry,
  defineGlossaryModuleExtension,
  defineGlossaryScopeId,
  defineGlossaryTermId,
} from "../../glossary/glossaryBuilders";
import type {
  GlossaryEntry,
  GlossaryFormula,
  GlossaryMathDisplay,
  GlossaryModuleExtension,
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

function requiredEntry(
  input: Parameters<typeof defineGlossaryEntry>[0]
): GlossaryEntry {
  const entry = defineGlossaryEntry(input);
  if (!entry) throw new Error(`Invalid development fixture: ${input.id}`);
  return entry;
}

function requiredExtension(
  input: Parameters<typeof defineGlossaryModuleExtension>[0]
): GlossaryModuleExtension {
  const extension = defineGlossaryModuleExtension(input);
  if (!extension) {
    throw new Error(`Invalid development extension: ${input.moduleId}`);
  }
  return extension;
}

export const GLOSSARY_RICH_FIXTURE_MARKER =
  "Rich relationship fixture - development only.";

export const GLOSSARY_FIXTURE_IDS = Object.freeze({
  sample: requiredTermId("sample_term"),
  dynamic: requiredTermId("dynamic_term"),
  formula: requiredTermId("formula_term"),
  label: requiredTermId("label_term"),
  replacement: requiredTermId("replacement_term"),
  short: requiredTermId("short_term"),
  long: requiredTermId("long_term"),
  alias: requiredTermId("alias_term"),
  plain: requiredTermId("plain_term"),
  table: requiredTermId("table_term"),
});

export const GLOSSARY_FIXTURE_SCOPE_IDS = Object.freeze({
  primary: requiredScopeId("playground_primary"),
  secondary: requiredScopeId("playground_secondary"),
  multi: requiredScopeId("playground_multi"),
  form: requiredScopeId("playground_form"),
  composition: requiredScopeId("playground_composition"),
  replacement: requiredScopeId("playground_replacement"),
  disposable: requiredScopeId("playground_disposable"),
  placementTop: requiredScopeId("playground_placement_top"),
  placementBottom: requiredScopeId("playground_placement_bottom"),
  placementLeft: requiredScopeId("playground_placement_left"),
  placementRight: requiredScopeId("playground_placement_right"),
  placementCenter: requiredScopeId("playground_placement_center"),
  placementNarrow: requiredScopeId("playground_placement_narrow"),
  placementScroll: requiredScopeId("playground_placement_scroll"),
});

export const GLOSSARY_FIXTURE_MATH_ALIAS: GlossaryMathDisplay = Object.freeze({
  kind: "math",
  latex: "q_{fixture}",
  accessibleText: "fixture q",
});

export const GLOSSARY_FIXTURE_ENTRIES: readonly GlossaryEntry[] = Object.freeze([
  requiredEntry({
    id: "sample_term",
    label: "Sample parameter",
    definition:
      "A content-neutral value used to exercise a definition preview.",
    fullDefinition:
      "A content-neutral value used to exercise the full rich-card definition without teaching a production concept.",
    intuition:
      "Think of it as a harmless stand-in that lets reviewers inspect structure and navigation.",
    whyItMatters:
      "It verifies the shared surface without teaching production mathematics.",
    formula: {
      latex: "r_{fixture}=s_{fixture}",
      accessibleText: "fixture r equals fixture s",
      display: "block",
    },
    assumptionsAndLimits:
      "This fixture is valid only as development evidence and carries no mathematical authority.",
    misconception: {
      statement: "The fixture text is approved production content.",
      correction:
        "It exists only on the development route and must remain absent from production output.",
    },
    prerequisiteTermIds: ["short_term"],
    relatedTerms: [
      { kind: "term", termId: "dynamic_term" },
      { kind: "future", label: "Future fixture relationship" },
    ],
    commonlyConfusedTerms: [
      { kind: "term", termId: "plain_term" },
    ],
    moduleNote: GLOSSARY_RICH_FIXTURE_MARKER,
    tutorTopic: "development sample",
  }),
  requiredEntry({
    id: "dynamic_term",
    label: "Changing context",
    definition:
      "A fixture whose surrounding explanation can change while open.",
    whyItMatters:
      "It verifies live context refresh without remounting the card.",
    formula: {
      latex: "c_0=d_0",
      accessibleText: "initial fixture context",
      display: "block",
    },
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
    definition:
      "A fixture term rendered beside, never inside, a native input label.",
    whyItMatters:
      "It verifies that the input keeps its own accessible name and descriptions.",
    tutorTopic: "development form label",
  }),
  requiredEntry({
    id: "replacement_term",
    label: "Replaceable term",
    definition:
      "A fixture whose trigger can be replaced by an explicit transaction.",
    whyItMatters: "It verifies safe anchor transfer without DOM scanning.",
    tutorTopic: "development replacement",
  }),
  requiredEntry({
    id: "short_term",
    label: "Very short fixture",
    definition: "A short fixture.",
    whyItMatters: "It verifies the minimum complete-card shape.",
    tutorTopic: "development short fixture",
  }),
  requiredEntry({
    id: "long_term",
    label: "Deliberately extended fixture label for wrapping checks",
    definition:
      "This long-form fixture deliberately uses several content-neutral sentences so the development surface can demonstrate wrapping, constrained height, and internal scrolling without presenting a real mathematical definition or becoming a production term. Additional neutral prose checks that long uninterrupted reading remains legible, that the header stays reachable, and that the action area remains available after scrolling. Another deliberately repetitive sentence gives narrow and enlarged layouts enough material to exercise their height limits without introducing a real concept, formula, recommendation, or product claim. The final fixture-only sentence exists to guarantee a constrained internal scroll region.",
    whyItMatters:
      "Its intentionally extended explanation exercises readable spacing, reachable actions, and robust layout under narrow viewports, high zoom, and long translated-like text while remaining unmistakably development-only. The content is intentionally redundant so reviewers can inspect scrolling, focus visibility, wrapping, and action reachability without treating any sentence as approved Glossary content.",
    intuition:
      "It is a layout stress sample: deliberately wordy, deliberately neutral, and deliberately disposable.",
    assumptionsAndLimits:
      "It may be used only to inspect development behavior; it is neither a teaching definition nor a source of notation.",
    misconception: {
      statement: "Longer prose makes a fixture authoritative.",
      correction:
        "Length is only a layout test here and does not grant content authority.",
    },
    relatedTerms: [
      { kind: "term", termId: "sample_term" },
      { kind: "future", label: "Future long-form fixture" },
    ],
    moduleNote:
      "This neutral note exercises the optional module-specific section under constrained height.",
    tutorTopic:
      "development-only long Tutor topic for structured handoff inspection without any network request, transcript card, queue, Keep action, or Replace action",
  }),
  requiredEntry({
    id: "alias_term",
    label: "Alias fixture",
    aliases: ["Alternate fixture wording", GLOSSARY_FIXTURE_MATH_ALIAS],
    definition:
      "A neutral entry with explicitly authored text and mathematical display aliases.",
    whyItMatters:
      "It verifies alias validation without automatic text scanning or notation authority.",
    tutorTopic: "development alias fixture",
  }),
  requiredEntry({
    id: "plain_term",
    label: "No-formula fixture",
    definition: "A complete-card fixture with no formula record.",
    whyItMatters:
      "It verifies that the optional formula region remains absent when no formula exists.",
    tutorTopic: "development no-formula fixture",
  }),
  requiredEntry({
    id: "table_term",
    label: "Header fixture",
    definition:
      "A neutral term placed beside table-header text without nesting interactive controls.",
    whyItMatters:
      "It verifies semantic table composition and independent button ownership.",
    tutorTopic: "development table header fixture",
  }),
]);

export const GLOSSARY_FIXTURE_EXTENSION: GlossaryModuleExtension =
  requiredExtension({
    moduleId: "ode",
    overrides: [
      {
        termId: "dynamic_term",
        contextualDefinition:
          "A module-composed development context used before live snapshots replace it.",
        moduleNote:
          "This development-only override proves module notes compose without changing canonical content.",
        prerequisiteTermIds: ["sample_term"],
        relatedTerms: [
          { kind: "term", termId: "short_term" },
          {
            kind: "future",
            label: "Future module-composed fixture",
          },
        ],
        commonlyConfusedTerms: [
          { kind: "term", termId: "plain_term" },
        ],
      },
    ],
  });

export interface GlossaryDynamicContextVariant {
  readonly name: string;
  readonly contextualDefinition: string;
  readonly whyItMattersHere: string;
  readonly formula?: GlossaryFormula | null;
  readonly curatedTutorContext: string;
}

export const GLOSSARY_DYNAMIC_CONTEXT_VARIANTS: readonly GlossaryDynamicContextVariant[] =
  Object.freeze([
    Object.freeze({
      name: "initial",
      contextualDefinition: "Initial changing context.",
      whyItMattersHere:
        "The mounted card is reading the initial curated fixture snapshot.",
      curatedTutorContext: "Initial development context",
    }),
    Object.freeze({
      name: "replacement formula",
      contextualDefinition:
        "Updated changing context. Replacement formula context.",
      whyItMattersHere:
        "The same mounted card received revised copy and a replacement fixture formula.",
      formula: Object.freeze({
        latex: "c_1=d_1",
        accessibleText: "replacement fixture context",
        display: "block" as const,
      }),
      curatedTutorContext: "Replacement-formula development context",
    }),
    Object.freeze({
      name: "formula suppressed",
      contextualDefinition: "Formula-suppressed context.",
      whyItMattersHere:
        "The current snapshot explicitly suppresses the inherited fixture formula.",
      formula: null,
      curatedTutorContext: "Formula-suppressed development context",
    }),
  ]);

export const GLOSSARY_DEVELOPMENT_WARNING =
  "Development fixtures only — not production definitions.";
