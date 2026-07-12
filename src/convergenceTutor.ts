import type {
  TutorConvergenceStudy,
  TutorObservedOrderAssessment,
} from "./aiTypes";
import type { ObservedOrderAssessment } from "./convergenceStudy";
import {
  currentStudyFingerprint,
  type ConvergenceUiState,
} from "./convergenceStudyState";

function finite(value: number | undefined): value is number {
  return value !== undefined && Number.isFinite(value);
}

function mapAssessment(
  assessment: ObservedOrderAssessment | undefined
): TutorObservedOrderAssessment | undefined {
  if (!assessment) return undefined;
  if (
    !Number.isInteger(assessment.coarseLevel) ||
    !Number.isInteger(assessment.fineLevel) ||
    (assessment.value !== undefined && !finite(assessment.value))
  ) {
    return undefined;
  }
  return {
    ...(assessment.value !== undefined ? { value: assessment.value } : {}),
    status: assessment.status,
    message: assessment.message,
    coarseLevel: assessment.coarseLevel,
    fineLevel: assessment.fineLevel,
  };
}

/**
 * Creates presentation-only Tutor evidence from the current successful study.
 * It deliberately excludes UI state, source expressions, failed attempts, and
 * every executable or parser-owned value.
 */
export function getTutorConvergenceStudy(
  state: ConvergenceUiState | undefined
): TutorConvergenceStudy | undefined {
  const result = state?.result;
  if (!state || !result || state.resultStatus !== "current") return undefined;
  const fingerprint = currentStudyFingerprint(state);
  if (
    !fingerprint ||
    result.configFingerprint !== fingerprint ||
    result.runFingerprint !== state.runFingerprint ||
    result.consistencyCheck.status === "blocked"
  ) {
    return undefined;
  }
  if (
    !finite(result.theoreticalOrder) ||
    !(result.theoreticalOrder > 0) ||
    (result.interpretation.primaryObservedOrder !== undefined &&
      !finite(result.interpretation.primaryObservedOrder)) ||
    (result.consistencyCheck.maximumNormalizedResidual !== undefined &&
      !finite(result.consistencyCheck.maximumNormalizedResidual)) ||
    (result.consistencyCheck.maximumResidualTime !== undefined &&
      !finite(result.consistencyCheck.maximumResidualTime))
  ) {
    return undefined;
  }

  const evidencePairs: Array<[number, number]> = [];
  for (const pair of result.interpretation.evidencePairs) {
    if (!finite(pair[0]) || !finite(pair[1])) return undefined;
    evidencePairs.push([pair[0], pair[1]]);
  }

  const levels: TutorConvergenceStudy["levels"] = [];
  for (const level of result.levels) {
    if (
      !Number.isInteger(level.level) ||
      level.level < 0 ||
      !finite(level.stepSize) ||
      !(level.stepSize > 0) ||
      !finite(level.finalTimeError) ||
      level.finalTimeError < 0 ||
      !finite(level.maximumGlobalError) ||
      level.maximumGlobalError < 0
    ) {
      return undefined;
    }
    const finalObservedOrder = mapAssessment(level.finalObservedOrder);
    const maximumObservedOrder = mapAssessment(level.maximumObservedOrder);
    if (level.finalObservedOrder && !finalObservedOrder) return undefined;
    if (level.maximumObservedOrder && !maximumObservedOrder) return undefined;
    levels.push({
      level: level.level,
      h: level.stepSize,
      finalTimeError: level.finalTimeError,
      maximumGlobalError: level.maximumGlobalError,
      ...(finalObservedOrder ? { finalObservedOrder } : {}),
      ...(maximumObservedOrder ? { maximumObservedOrder } : {}),
    });
  }

  return {
    theoreticalOrder: result.theoreticalOrder,
    interpretation: {
      kind: result.interpretation.kind,
      title: result.interpretation.title,
      explanation: result.interpretation.explanation,
      ...(result.interpretation.primaryObservedOrder !== undefined
        ? { primaryObservedOrder: result.interpretation.primaryObservedOrder }
        : {}),
      evidencePairs,
    },
    levels,
    consistencyCheck: {
      status: result.consistencyCheck.status,
      ...(result.consistencyCheck.maximumNormalizedResidual !== undefined
        ? {
            maximumNormalizedResidual:
              result.consistencyCheck.maximumNormalizedResidual,
          }
        : {}),
      ...(result.consistencyCheck.maximumResidualTime !== undefined
        ? { maximumResidualTime: result.consistencyCheck.maximumResidualTime }
        : {}),
      statement: result.consistencyCheck.statement,
    },
  };
}
