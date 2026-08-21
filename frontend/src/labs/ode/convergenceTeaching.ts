import type { ReadonlyMathContent } from "../../math/ui/readonlyMath";
import type {
  ConvergenceMetric,
  ConvergenceStudyResult,
  ObservedOrderAssessment,
} from "@numerical-t-lab/numerics/convergence";

export type TeachingSectionId =
  | "what_testing"
  | "exact_solution"
  | "refining_h"
  | "errors"
  | "observed_order"
  | "log_log"
  | "theory_difference"
  | "warnings";

export const CONVERGENCE_ANALYSIS_PURPOSE =
  "We are checking how quickly numerical error decreases as the step size becomes smaller.";

export interface TeachingSectionModel {
  readonly id: TeachingSectionId;
  readonly title: string;
  readonly plainLanguage: string;
  readonly formula: ReadonlyMathContent;
  readonly currentExample: string;
  readonly whyThisMatters: string;
}

export interface ConvergenceTeachingInput {
  readonly methodName: string;
  readonly exactSolutionDisplayText?: string;
  readonly metric?: ConvergenceMetric;
}

export interface ConvergenceConclusionModel {
  readonly heading: "What this experiment found";
  readonly methodName: string;
  readonly theoreticalOrder: number;
  readonly primaryObservedOrder?: number;
  readonly interpretationTitle: string;
  readonly explanation: string;
  readonly evidencePairLabels: readonly string[];
}

function math(latex: string, displayText: string): ReadonlyMathContent {
  return { latex, displayText, ariaLabel: displayText };
}

export function formatTeachingNumber(value: number): string {
  if (!Number.isFinite(value)) return "unavailable";
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  return magnitude < 1e-3 || magnitude >= 1e3
    ? value.toExponential(3)
    : Number(value.toPrecision(4)).toString();
}

function reliableMaximumPair(result: ConvergenceStudyResult): {
  assessment: ObservedOrderAssessment & { value: number };
  coarseError: number;
  fineError: number;
  coarseH: number;
  fineH: number;
} | undefined {
  for (let index = result.levels.length - 1; index >= 1; index -= 1) {
    const fine = result.levels[index]!;
    const assessment = fine.maximumObservedOrder;
    if (
      assessment?.status === "reliable" &&
      assessment.value !== undefined &&
      Number.isFinite(assessment.value)
    ) {
      const coarse = result.levels[index - 1]!;
      return {
        assessment: assessment as ObservedOrderAssessment & { value: number },
        coarseError: coarse.maximumGlobalError,
        fineError: fine.maximumGlobalError,
        coarseH: coarse.stepSize,
        fineH: fine.stepSize,
      };
    }
  }
  return undefined;
}

export function buildConvergenceTeachingSections(
  result: ConvergenceStudyResult,
  input: ConvergenceTeachingInput
): readonly TeachingSectionModel[] {
  const first = result.levels[0]!;
  const last = result.levels.at(-1)!;
  const pair = reliableMaximumPair(result);
  const metric = input.metric ?? "maximum_global";
  const metricName = metric === "maximum_global" ? "maximum global error" : "final-time error";
  const reduction = pair ? pair.coarseError / pair.fineError : undefined;
  const orderExample = pair
    ? `At h = ${formatTeachingNumber(pair.coarseH)}, the maximum global error was ${formatTeachingNumber(pair.coarseError)}. At h = ${formatTeachingNumber(pair.fineH)}, it was ${formatTeachingNumber(pair.fineError)}. The error became about ${formatTeachingNumber(reduction!)} times smaller, giving an observed order of ${formatTeachingNumber(pair.assessment.value)}.`
    : "This study did not produce a reliable adjacent observed order based on maximum global error.";
  const exactDescription = input.exactSolutionDisplayText
    ? `For this study, the supplied exact solution is described as ${input.exactSolutionDisplayText}.`
    : "The supplied exact solution was evaluated on every numerical grid point.";

  return [
    {
      id: "what_testing",
      title: "What are we testing?",
      plainLanguage: CONVERGENCE_ANALYSIS_PURPOSE,
      formula: math("E(h)\\to 0\\quad\\text{as}\\quad h\\to 0", "E of h approaches zero as h approaches zero"),
      currentExample: `${input.methodName} used ${result.levels.length} levels from h = ${formatTeachingNumber(first.stepSize)} to h = ${formatTeachingNumber(last.stepSize)}.`,
      whyThisMatters: "Why this matters: decreasing error is the evidence needed before an observed convergence order is meaningful.",
    },
    {
      id: "exact_solution",
      title: "What is an exact solution?",
      plainLanguage: "An exact solution is a function that satisfies the stated initial value problem and supplies the reference values used to compute numerical error.",
      formula: math("y'(t)=f(t,y(t)),\\qquad y(t_0)=y_0", "y prime of t equals f of t and y of t, with y of t zero equal to y zero"),
      currentExample: exactDescription,
      whyThisMatters: "Why this matters: the experiment compares numerical values with this reference rather than another numerical approximation.",
    },
    {
      id: "refining_h",
      title: "What does refining h mean?",
      plainLanguage: "Each refinement halves the step size and therefore uses more grid points.",
      formula: math("h,\\;\\frac{h}{2},\\;\\frac{h}{4},\\;\\ldots", "h, h divided by 2, h divided by 4, and so on"),
      currentExample: `The study moved from h = ${formatTeachingNumber(first.stepSize)} with ${first.stepCount} steps to h = ${formatTeachingNumber(last.stepSize)} with ${last.stepCount} steps.`,
      whyThisMatters: "Why this matters: comparing adjacent halved grids makes the logarithmic order formula directly interpretable.",
    },
    {
      id: "errors",
      title: "How are final-time error and maximum global error calculated?",
      plainLanguage: "Final-time error checks one endpoint, while maximum global error checks every point on the numerical grid.",
      formula: math(
        "E_{\\mathrm{final}}(h)=|u_N-y(t_{\\mathrm{end}})|,\\qquad E_{\\infty}(h)=\\max_n|u_n-y(t_n)|",
        "final-time error equals the absolute endpoint difference; maximum global error is the largest absolute grid-point difference"
      ),
      currentExample: `At the finest level, final-time error was ${formatTeachingNumber(last.finalTimeError)} and maximum global error was ${formatTeachingNumber(last.maximumGlobalError)} at t = ${formatTeachingNumber(last.maximumErrorTime)}.`,
      whyThisMatters: "Why this matters: a small endpoint error can hide a larger error elsewhere in the interval.",
    },
    {
      id: "observed_order",
      title: "How is observed order calculated?",
      plainLanguage: "Observed order measures how much the error changes when h is halved.",
      formula: math("p_{\\mathrm{obs}}=\\log_2\\!\\left(\\frac{E(h)}{E(h/2)}\\right)", "p observed equals log base 2 of E of h divided by E of h over 2"),
      currentExample: orderExample,
      whyThisMatters: "Why this matters: it connects measured error reduction with the theoretical accuracy of the method.",
    },
    {
      id: "log_log",
      title: "How to read the log-log graph",
      plainLanguage: "On logarithmic axes, the slope shows how error scales with step size.",
      formula: math("E_{\\mathrm{reference}}(h)=C h^p", "reference error equals C times h raised to p"),
      currentExample: `The selected chart metric is ${metricName}; moving to finer levels means moving toward smaller h.`,
      whyThisMatters: "Why this matters: parallel measured and reference slopes provide a visual comparison without claiming a known error constant.",
    },
    {
      id: "theory_difference",
      title: "Why may observed and theoretical orders differ?",
      plainLanguage: "Observed order can differ from the theoretical order before the experiment reaches the asymptotic region or when other numerical effects influence the error data.",
      formula: math("|p_{\\mathrm{obs}}-p|", "the absolute difference between observed order and theoretical order"),
      currentExample: result.interpretation.primaryObservedOrder === undefined
        ? `The theoretical order is ${result.theoreticalOrder}, but no primary reliable observed order based on maximum global error is available.`
        : `The theoretical order is ${result.theoreticalOrder}, while the primary observed order based on maximum global error is ${formatTeachingNumber(result.interpretation.primaryObservedOrder)}.`,
      whyThisMatters: "Why this matters: disagreement is evidence to investigate, not proof of one particular failure cause.",
    },
    {
      id: "warnings",
      title: "Common warnings and misconceptions",
      plainLanguage: "Very small, increasing, or nearly unchanged errors cannot support the same conclusions as a reliable decreasing pair.",
      formula: math("E(h)\\lesssim 100\\,\\varepsilon_{\\mathrm{machine}}\\,\\mathrm{scale}", "E of h is close to one hundred times machine epsilon times the problem scale"),
      currentExample: `This study concluded: ${result.interpretation.title}. ${result.consistencyCheck.statement}`,
      whyThisMatters: "Why this matters: warnings prevent floating-point noise or non-improving refinement from being presented as trustworthy convergence evidence.",
    },
  ];
}

export function buildConvergenceConclusion(
  result: ConvergenceStudyResult,
  methodName: string
): ConvergenceConclusionModel {
  return {
    heading: "What this experiment found",
    methodName,
    theoreticalOrder: result.theoreticalOrder,
    ...(result.interpretation.primaryObservedOrder === undefined
      ? {}
      : { primaryObservedOrder: result.interpretation.primaryObservedOrder }),
    interpretationTitle: result.interpretation.title,
    explanation: result.interpretation.explanation,
    evidencePairLabels: result.interpretation.evidencePairs.map(
      ([coarse, fine]) => `Levels ${coarse + 1}–${fine + 1}`
    ),
  };
}
