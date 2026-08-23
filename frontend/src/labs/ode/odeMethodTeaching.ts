import {
  FIRST_ORDER_CATALOG,
  METHOD_CATALOG,
  catalogByFamily,
  type MethodCatalogEntry,
} from "@numerical-t-lab/numerics/ode/method-catalog";
import type { MethodFamily } from "@numerical-t-lab/numerics/ode/solvers";
import type { ReadonlyMathContent } from "../../math/ui/readonlyMath";
import {
  methodTeachingMathContent,
  methodTeachingSupportingMathContent,
  type MethodTeachingSupportingFormula,
} from "../../math/ui/methodMathContent";
import {
  ODE_METHOD_CONCEPTS,
  configuredOrderAdvancedDetailsFor,
  teachingContentFor,
  type OdeMethodConcept,
  type OdeMethodTeachingContent,
} from "./odeMethodTeachingContent";
import { PROBLEM_PRESETS, type ProblemPresetId } from "./problemPresets";

type FirstOrderMethodFamily = Exclude<MethodFamily, "leapfrog">;

export type OdeMethodProblemProfile =
  | "first_order_ivp"
  | "second_order_acceleration";

export type OdeMethodStepStructure = "one_step" | "history" | "staggered";

export type OdeMethodConfigurableParameter =
  | "time_interval"
  | "step_size"
  | "initial_value"
  | "right_hand_side"
  | "optional_exact_reference"
  | "order"
  | "initial_position"
  | "initial_velocity"
  | "acceleration";

export type OdeMethodOutputEvidenceId =
  | "final_approximation"
  | "final_position"
  | "final_velocity"
  | "trajectory"
  | "stored_values"
  | "method_metadata"
  | "nonlinear_diagnostics"
  | "startup_and_coefficients";

export type OdeMethodOrder =
  | {
      readonly kind: "fixed";
      readonly theoreticalOrder: number;
    }
  | {
      readonly kind: "configurable";
      readonly supportedMin: number | undefined;
      readonly supportedMax: number | undefined;
      readonly defaultOrder: number | undefined;
      readonly currentConfiguredOrder: number | undefined;
    };

export interface OdeMethodTeachingSelection {
  readonly family: MethodFamily;
  readonly currentOrder?: number;
}

export interface OdeMethodTeachingLearnerProfile
  extends OdeMethodTeachingContent {
  readonly identity: {
    readonly family: MethodFamily;
    readonly displayName: string;
    readonly shortLabel: string;
    readonly runnable: true;
  };
  readonly problemProfile: OdeMethodProblemProfile;
  readonly formation: "explicit" | "implicit";
  readonly stepStructure: OdeMethodStepStructure;
  readonly formulaType: string;
  readonly order: OdeMethodOrder;
  readonly compareEligible: boolean;
  readonly presets: {
    readonly availableIds: readonly ProblemPresetId[];
    readonly suggestedIds: readonly ProblemPresetId[];
  };
  readonly exactReferenceInputAvailable: boolean;
  readonly output: {
    readonly available: true;
    readonly evidenceIds: readonly OdeMethodOutputEvidenceId[];
  };
  readonly convergence:
    | {
        readonly available: true;
        readonly requiresExactReference: true;
        readonly scope: "single_first_order";
      }
    | {
        readonly available: false;
        readonly reason: "second_order_profile";
      };
  readonly configurableParameters: readonly OdeMethodConfigurableParameter[];
  readonly primaryFormula: ReadonlyMathContent;
  readonly supportingFormulas: readonly MethodTeachingSupportingFormula[];
  readonly selectedConcepts: readonly OdeMethodConcept[];
}

/** @deprecated Use the explicit learner-safe profile type. */
export type OdeMethodTeachingProfile = OdeMethodTeachingLearnerProfile;

export type OdeMethodConfiguredOrders = Readonly<
  Partial<Record<MethodFamily, number>>
>;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

function stepStructure(entry: MethodCatalogEntry): OdeMethodStepStructure {
  if (entry.mode === "second") return "staggered";
  return entry.formulaType.startsWith("multistep") ? "history" : "one_step";
}

function orderMetadata(
  entry: MethodCatalogEntry,
  currentOrder: number | undefined
): OdeMethodOrder {
  if (entry.hasOrderSelector) {
    return {
      kind: "configurable",
      supportedMin: entry.orderMin,
      supportedMax: entry.orderMax,
      defaultOrder: entry.orderDefault,
      currentConfiguredOrder: currentOrder,
    };
  }
  if (typeof entry.orderOfAccuracy !== "number") {
    throw new Error(`Missing fixed theoretical order for ${entry.family}.`);
  }
  return { kind: "fixed", theoreticalOrder: entry.orderOfAccuracy };
}

function isFirstOrderFamily(
  entry: MethodCatalogEntry
): entry is MethodCatalogEntry & {
  readonly family: FirstOrderMethodFamily;
  readonly mode: "first";
} {
  return entry.mode === "first";
}

function presetMetadata(entry: MethodCatalogEntry): {
  readonly availableIds: readonly ProblemPresetId[];
  readonly suggestedIds: readonly ProblemPresetId[];
} {
  if (!isFirstOrderFamily(entry)) {
    return { availableIds: [], suggestedIds: [] };
  }
  return {
    availableIds: PROBLEM_PRESETS.map((preset) => preset.id),
    suggestedIds: PROBLEM_PRESETS.filter((preset) =>
      preset.suggestedMethods.includes(entry.family)
    ).map((preset) => preset.id),
  };
}

function configurableParameters(
  entry: MethodCatalogEntry
): readonly OdeMethodConfigurableParameter[] {
  if (entry.mode === "second") {
    return [
      "time_interval",
      "step_size",
      "initial_position",
      "initial_velocity",
      "acceleration",
    ];
  }
  return [
    "time_interval",
    "step_size",
    "initial_value",
    "right_hand_side",
    "optional_exact_reference",
    ...(entry.hasOrderSelector ? (["order"] as const) : []),
  ];
}

function outputEvidence(
  entry: MethodCatalogEntry
): readonly OdeMethodOutputEvidenceId[] {
  if (entry.mode === "second") {
    return [
      "final_position",
      "final_velocity",
      "trajectory",
      "stored_values",
      "method_metadata",
    ];
  }
  return [
    "final_approximation",
    "trajectory",
    "stored_values",
    "method_metadata",
    ...(entry.isImplicit ? (["nonlinear_diagnostics"] as const) : []),
    ...(entry.hasOrderSelector
      ? (["startup_and_coefficients"] as const)
      : []),
  ];
}

function primaryFormula(entry: MethodCatalogEntry): ReadonlyMathContent {
  const formula = methodTeachingMathContent(entry).formula;
  if (!formula) {
    throw new Error(`Missing safe readonly method formula: ${entry.family}`);
  }
  return { ...formula };
}

export function deriveOdeMethodTeachingProfile(
  selection: Readonly<OdeMethodTeachingSelection>
): OdeMethodTeachingLearnerProfile {
  const entry = catalogByFamily(selection.family);
  const content = teachingContentFor(entry.family);
  const firstOrder = FIRST_ORDER_CATALOG.some(
    (candidate) => candidate.family === entry.family
  );
  const profile: OdeMethodTeachingLearnerProfile = {
    coreIdea: content.coreIdea,
    accessibleVerbalization: content.accessibleVerbalization,
    formulaAnatomy: content.formulaAnatomy.map((part) => ({ ...part })),
    orderedProcess: [...content.orderedProcess],
    requiredState: [...content.requiredState],
    startupHistoryRequirement: content.startupHistoryRequirement,
    perStepWork: content.perStepWork,
    strength: content.strength,
    watchPoint: content.watchPoint,
    accuracyStabilityBoundary: content.accuracyStabilityBoundary,
    whatToObserve: content.whatToObserve,
    outputEvidenceGuidance: content.outputEvidenceGuidance,
    convergenceGuidance: content.convergenceGuidance,
    commonMisconception: { ...content.commonMisconception },
    advancedDetails: [
      ...content.advancedDetails,
      ...configuredOrderAdvancedDetailsFor(
        entry.family,
        selection.currentOrder
      ),
    ].map((detail) => ({ ...detail })),
    selectedConceptIds: [...content.selectedConceptIds],
    ...(content.staticDiagram
      ? {
          staticDiagram: {
            kind: content.staticDiagram.kind,
            title: content.staticDiagram.title,
            caption: content.staticDiagram.caption,
            steps: content.staticDiagram.steps.map((step) => ({ ...step })),
          },
        }
      : {}),
    identity: {
      family: entry.family,
      displayName: entry.displayName,
      shortLabel: entry.shortLabel,
      runnable: true,
    },
    problemProfile:
      entry.mode === "first"
        ? "first_order_ivp"
        : "second_order_acceleration",
    formation: entry.isImplicit ? "implicit" : "explicit",
    stepStructure: stepStructure(entry),
    formulaType: entry.formulaType,
    order: orderMetadata(entry, selection.currentOrder),
    compareEligible: firstOrder,
    presets: presetMetadata(entry),
    exactReferenceInputAvailable: firstOrder,
    output: { available: true, evidenceIds: outputEvidence(entry) },
    convergence: firstOrder
      ? {
          available: true,
          requiresExactReference: true,
          scope: "single_first_order",
        }
      : { available: false, reason: "second_order_profile" },
    configurableParameters: configurableParameters(entry),
    primaryFormula: primaryFormula(entry),
    supportingFormulas: methodTeachingSupportingMathContent(entry.family).map(
      (formula) => ({
        id: formula.id,
        title: formula.title,
        content: { ...formula.content },
      })
    ),
    selectedConcepts: content.selectedConceptIds.map((id) => ({
      ...ODE_METHOD_CONCEPTS[id],
    })),
  };
  return deepFreeze(profile);
}

export function deriveAllOdeMethodTeachingProfiles(
  currentOrders: OdeMethodConfiguredOrders = {}
): readonly OdeMethodTeachingLearnerProfile[] {
  return Object.freeze(
    METHOD_CATALOG.map((entry) =>
      deriveOdeMethodTeachingProfile({
        family: entry.family,
        currentOrder: currentOrders[entry.family],
      })
    )
  );
}
