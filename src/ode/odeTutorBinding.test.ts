import { describe, expect, it, vi } from "vitest";
import {
  createOdeTutorBinding,
  ODE_TUTOR_SUGGESTED_QUESTIONS,
} from "./odeTutorBinding";

describe("Lab-owned ODE Tutor binding", () => {
  it("uses theoretical-order and qualified time-step-size questions", () => {
    expect(ODE_TUTOR_SUGGESTED_QUESTIONS).toContain(
      "Why is this method’s theoretical order p?"
    );
    expect(ODE_TUTOR_SUGGESTED_QUESTIONS).toContain(
      "What could happen if I used a smaller time-step size h?"
    );
    expect(ODE_TUTOR_SUGGESTED_QUESTIONS).not.toContain(
      "Why is the order of accuracy p?"
    );
    expect(ODE_TUTOR_SUGGESTED_QUESTIONS).not.toContain(
      "What would happen if I used a smaller h?"
    );
    expect(Object.isFrozen(ODE_TUTOR_SUGGESTED_QUESTIONS)).toBe(true);
  });

  it("reads fresh source state, hides the math keyboard, and owns no conversation", () => {
    let source: { readonly enabled: boolean } = { enabled: false };
    const prepare = vi.fn();
    const control = createOdeTutorBinding({ getSource: () => source, prepareForOpen: prepare });

    expect(control.binding.moduleId).toBe("ode");
    expect(control.binding.promptProfile).toBe("ode");
    expect(control.binding.getContext()).toBe(source);
    source = { enabled: true } as const;
    expect(control.binding.getContext()).toBe(source);
    control.binding.prepareForOpen?.();
    expect(prepare).toHaveBeenCalledOnce();
    expect(control.binding).not.toHaveProperty("conversation");
    expect(control.binding).not.toHaveProperty("sessionAccess");
  });

  it("publishes ordinary-Run reset requests without knowing the store or Host", () => {
    const control = createOdeTutorBinding({ getSource: () => ({ enabled: false }) });
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribe = control.binding.subscribeConversationReset?.(first);
    control.binding.subscribeConversationReset?.(second);

    control.requestConversationReset();
    unsubscribe?.();
    control.requestConversationReset();

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledTimes(2);
  });
});
