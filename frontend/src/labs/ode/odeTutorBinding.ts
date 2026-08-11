import type { ChartInstruction } from "@numerical-t-lab/contracts/tutor";
import type { OdeTutorProblemInputs } from "./odeTutorTypes";
import type { LabTutorBinding } from "../../app/contracts";
import type { ConvergenceUiState } from "./convergenceStudyState";
import type { ReadonlySolverResult } from "./odeSession";

export const ODE_TUTOR_SUGGESTED_QUESTIONS = Object.freeze([
  "Explain this method step by step.",
  "What does each variable mean?",
  "Why is this method’s theoretical order p?",
  "Explain the coefficients.",
  "Explain the implicit solve diagnostics.",
  "How should I interpret the graph?",
  "What could happen if I used a smaller time-step size h?",
  "Create a table summary of the result.",
] as const);

export interface OdeTutorSource {
  readonly enabled: boolean;
  readonly result?: ReadonlySolverResult;
  readonly problem?: OdeTutorProblemInputs;
  readonly convergenceState?: ConvergenceUiState;
}

export interface OdeTutorBindingControl {
  readonly binding: LabTutorBinding<OdeTutorSource>;
  requestConversationReset(): void;
  dispose(): void;
}

export function createOdeTutorBinding(options: {
  readonly getSource: () => OdeTutorSource;
  readonly prepareForOpen?: () => void;
  readonly applyChartInstruction?: (instruction: ChartInstruction) => void;
}): OdeTutorBindingControl {
  const resetListeners = new Set<() => void>();
  let disposed = false;
  const binding: LabTutorBinding<OdeTutorSource> = Object.freeze({
    moduleId: "ode" as const,
    promptProfile: "ode" as const,
    suggestedQuestions: ODE_TUTOR_SUGGESTED_QUESTIONS,
    getContext: () => options.getSource(),
    prepareForOpen: options.prepareForOpen,
    applyChartInstruction(instruction: unknown): void {
      options.applyChartInstruction?.(instruction as ChartInstruction);
    },
    subscribeConversationReset(listener: () => void): () => void {
      if (disposed) return () => undefined;
      resetListeners.add(listener);
      let subscribed = true;
      return () => {
        if (!subscribed) return;
        subscribed = false;
        resetListeners.delete(listener);
      };
    },
  });

  return Object.freeze({
    binding,
    requestConversationReset(): void {
      if (disposed) return;
      for (const listener of [...resetListeners]) listener();
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      resetListeners.clear();
    },
  });
}
