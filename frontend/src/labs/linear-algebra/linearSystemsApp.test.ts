// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountLinearSystemsApp } from "./linearSystemsApp";
import {
  createLinearSystemsSession,
  replaceLinearSystemsDraft,
  runLinearSystemsSession,
  setLinearSystemsWorkflowStep,
  type LinearSystemsSessionState,
} from "./linearSystemsSession";

function mount(
  initialSession = createLinearSystemsSession(),
  lifecycle: Parameters<typeof mountLinearSystemsApp>[0]["lifecycle"] = undefined
) {
  const target = document.createElement("main");
  document.body.append(target);
  const mounted = mountLinearSystemsApp({
    target,
    initialSession,
    lifecycle,
    now: () => 500,
  });
  return { target, mounted };
}

function goToData(target: HTMLElement): void {
  target
    .querySelector<HTMLButtonElement>("[data-workflow-step='data']")!
    .click();
}

function runControl(target: HTMLElement): HTMLButtonElement {
  return target.querySelector<HTMLButtonElement>("[data-run-linear-system]")!;
}

function input(
  target: HTMLElement,
  selector: string,
  value: string
): HTMLInputElement {
  const control = target.querySelector<HTMLInputElement>(selector)!;
  control.value = value;
  control.dispatchEvent(new Event("input", { bubbles: true }));
  return control;
}

function successfulSession(
  session = createLinearSystemsSession()
): LinearSystemsSessionState {
  const outcome = runLinearSystemsSession(session);
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) throw new Error(outcome.error.message);
  return outcome.session;
}

describe("Linear Systems Lab application", () => {
  beforeEach(() => document.body.replaceChildren());

  it("mounts Starter 3×3 with the approved Method → Data workflow and presets", () => {
    const { target, mounted } = mount();
    expect(target.querySelector("h1")?.textContent).toBe("Linear Systems Lab");
    expect(target.textContent).toContain("Gaussian elimination with partial pivoting");
    expect(target.textContent).toContain("P A = L U");
    expect(target.querySelector("[data-workflow-step='method']")?.getAttribute("aria-current")).toBe(
      "step"
    );
    expect(target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")?.disabled).toBe(
      true
    );
    target.querySelector<HTMLButtonElement>(".ls-button-primary")!.click();
    expect(target.querySelector("[data-workflow-panel]")?.getAttribute("data-workflow-panel")).toBe(
      "data"
    );
    expect(
      [...target.querySelectorAll<HTMLSelectElement>("[data-preset-select] option")].map(
        (option) => option.textContent
      )
    ).toEqual(["Starter 3×3", "Row swap required", "Custom"]);
    expect(mounted.getSession()).toMatchObject({
      step: "data",
      dimension: 3,
      selectedPresetId: "starter_3x3",
      meaningful: false,
    });
    mounted.dispose();
  });

  it("supports dimensions 2 and 6 with complete learner-facing accessible names", () => {
    const { target, mounted } = mount();
    goToData(target);
    const dimension = target.querySelector<HTMLSelectElement>("[data-dimension-select]")!;
    dimension.value = "2";
    dimension.dispatchEvent(new Event("change", { bubbles: true }));
    expect(target.querySelectorAll("[data-matrix-a-row]")).toHaveLength(4);
    expect(
      target
        .querySelector("[data-matrix-a-row='1'][data-matrix-a-column='1']")
        ?.getAttribute("aria-label")
    ).toBe("Matrix A, row 2, column 2");
    expect(target.querySelector("[data-vector-b-row='1']")?.getAttribute("aria-label")).toBe(
      "Vector b, row 2"
    );

    target.querySelector<HTMLSelectElement>("[data-dimension-select]")!.value = "6";
    target
      .querySelector<HTMLSelectElement>("[data-dimension-select]")!
      .dispatchEvent(new Event("change", { bubbles: true }));
    expect(target.querySelectorAll("[data-matrix-a-row]")).toHaveLength(36);
    expect(target.querySelectorAll("[data-vector-b-row]")).toHaveLength(6);
    expect(mounted.getSession().ADraft[5]).toEqual(["", "", "", "", "", ""]);
    mounted.dispose();
  });

  it("reports incomplete, malformed, and non-finite drafts and focuses the first invalid cell", async () => {
    const { target, mounted } = mount();
    goToData(target);
    const first = input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "");
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='1']", "2 + 3");
    input(target, "[data-vector-b-row='0']", "1e309");
    runControl(target).click();
    await Promise.resolve();

    const summary = target.querySelector<HTMLElement>("[data-validation-summary]")!;
    expect(summary.textContent).toContain("is incomplete");
    expect(summary.textContent).toContain("decimal or scientific notation");
    expect(summary.textContent).toContain("must be finite");
    expect(first.getAttribute("aria-invalid")).toBe("true");
    expect(first.getAttribute("aria-describedby")).toMatch(/ls-field-error/);
    expect(document.activeElement).toBe(first);
    expect(mounted.getSession().latestSuccessfulResult).toBeUndefined();
    mounted.dispose();
  });

  it("moves preset identity to Custom on edit and restores authority from exact parsed values", () => {
    const { target, mounted } = mount();
    goToData(target);
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "3.5");
    expect(mounted.getSession().selectedPresetId).toBeNull();
    expect(target.querySelector<HTMLSelectElement>("[data-preset-select]")?.value).toBe("custom");
    expect(target.textContent).toContain("No preset reference solution is authoritative");

    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "3.0");
    expect(mounted.getSession().selectedPresetId).toBe("starter_3x3");
    expect(target.querySelector<HTMLSelectElement>("[data-preset-select]")?.value).toBe(
      "starter_3x3"
    );
    mounted.dispose();
  });

  it("publishes one complete result, renders output/diagnostics, and expands stored computation", async () => {
    const updateSession = vi.fn();
    const recordMeaningfulInteraction = vi.fn();
    const { target, mounted } = mount(createLinearSystemsSession(), {
      updateSession,
      recordMeaningfulInteraction,
    });
    goToData(target);
    runControl(target).click();
    await Promise.resolve();

    const result = mounted.getSession().latestSuccessfulResult!;
    expect(mounted.getSession()).toMatchObject({ step: "output", resultStatus: "current" });
    expect(target.textContent).toContain("Computed solution");
    expect(target.textContent).toContain("Factorization evidence");
    expect(target.textContent).toContain("Difference from preset reference solution");
    expect(target.querySelector("[data-linear-systems-status]")?.textContent).toBe(
      "Linear system solved. Computed solution is ready."
    );
    expect(document.activeElement).toBe(target.querySelector(".ls-result-header h2"));
    expect(target.querySelector("[aria-label='Computed solution x hat']")?.textContent).toContain(
      "-1"
    );
    for (const label of [
      "Permutation matrix P",
      "Unit lower triangular matrix L",
      "Upper triangular matrix U",
    ]) {
      expect(target.querySelector(`[aria-label='${label}']`)).not.toBeNull();
    }

    const toggle = target.querySelector<HTMLButtonElement>("[data-show-computation]")!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    toggle.click();
    expect(target.querySelector("[data-computation-walkthrough]")).not.toBeNull();
    expect(target.textContent).toContain("Matrix scale and pivot threshold");
    expect(target.querySelector("details > summary")?.textContent).toBe("Show arithmetic");
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);
    target.querySelector<HTMLButtonElement>("[data-show-computation]")!.click();
    target.querySelector<HTMLButtonElement>("[data-show-computation]")!.click();
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);

    target.querySelector<HTMLButtonElement>("[data-workflow-step='diagnostics']")!.click();
    expect(target.textContent).toContain("Residual vector");
    expect(target.textContent).toContain("Residual infinity norm");
    expect(target.textContent).toContain("Matrix infinity norm");
    expect(target.textContent).toContain("Pivot acceptance threshold");
    expect(target.textContent).toContain(
      "The residual measures how closely the computed solution satisfies the original equations."
    );
    expect(target.textContent).toContain(
      "A small residual does not necessarily mean a small solution error."
    );
    expect(recordMeaningfulInteraction).toHaveBeenCalled();
    expect(updateSession).toHaveBeenCalled();
    mounted.dispose();
  });

  it("preserves a successful result while stale and makes the same snapshot current after restoration", () => {
    const { target, mounted } = mount();
    goToData(target);
    runControl(target).click();
    const result = mounted.getSession().latestSuccessfulResult;
    target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")!.click();
    input(target, "[data-vector-b-row='0']", "7");
    expect(mounted.getSession()).toMatchObject({ resultStatus: "stale" });
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);
    target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")!.click();
    expect(target.querySelector("[data-result-stale]")).not.toBeNull();

    target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")!.click();
    input(target, "[data-vector-b-row='0']", "6.0");
    expect(mounted.getSession()).toMatchObject({ resultStatus: "current" });
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);
    target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")!.click();
    expect(target.querySelector("[data-result-stale]")).toBeNull();
    mounted.dispose();
  });

  it("shows bounded pivot-failure evidence without replacing the previous success", () => {
    const success = successfulSession();
    const singular = replaceLinearSystemsDraft(success, {
      dimension: 3,
      A: [
        ["1", "1", "1"],
        ["1", "1", "1"],
        ["1", "1", "1"],
      ],
      b: ["3", "3", "3"],
    });
    const initial = setLinearSystemsWorkflowStep(singular, "data");
    const prior = initial.latestSuccessfulResult;
    const { target, mounted } = mount(initial);
    runControl(target).click();

    expect(target.querySelector("[data-solve-failure='pivot_rejected']")?.textContent).toContain(
      "singular or too close to singular for this Lab's pivot acceptance threshold"
    );
    expect(target.textContent).toContain("Computation stopped in pivot column");
    expect(target.textContent).toContain("previous successful Output and Diagnostics remain");
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    expect(mounted.getSession().resultStatus).toBe("stale");

    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    const failure = target.querySelector<HTMLElement>("[data-failure-walkthrough]")!;
    expect(failure).not.toBeNull();
    expect(failure.querySelector("[data-trace-kind='pivot_selection']")).not.toBeNull();
    expect(failure.querySelector("[data-trace-kind='forward_substitution']")).toBeNull();
    expect(failure.textContent).not.toContain("formally singular");
    mounted.dispose();
  });

  it("removes stale failed-attempt UI on A or b edits while preserving prior success", () => {
    const success = successfulSession();
    const singular = replaceLinearSystemsDraft(success, {
      dimension: 3,
      A: [
        ["1", "1", "1"],
        ["1", "1", "1"],
        ["1", "1", "1"],
      ],
      b: ["3", "3", "3"],
    });
    const initial = setLinearSystemsWorkflowStep(singular, "data");
    const prior = initial.latestSuccessfulResult;
    const { target, mounted } = mount(initial);

    runControl(target).click();
    const firstFailure = target.querySelector<HTMLElement>("[data-solve-failure]")!;
    expect(firstFailure.textContent).toContain("Computation stopped in pivot column");
    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    expect(target.querySelector("[data-failure-walkthrough]")).not.toBeNull();

    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "2");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(target.querySelector("[data-failure-walkthrough]")).toBeNull();
    expect(target.textContent).not.toContain("Computation stopped in pivot column");
    expect(target.textContent).not.toContain("Show computation before failure");
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    expect(mounted.getSession().resultStatus).toBe("stale");

    runControl(target).click();
    const secondFailure = target.querySelector<HTMLElement>("[data-solve-failure]")!;
    expect(secondFailure).not.toBe(firstFailure);
    expect(secondFailure.textContent).toContain("Computation stopped in pivot column");
    expect(
      secondFailure.querySelector("[data-show-failure-computation]")?.getAttribute(
        "aria-expanded"
      )
    ).toBe("false");

    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    expect(target.querySelector("[data-failure-walkthrough]")).not.toBeNull();
    input(target, "[data-vector-b-row='0']", "4");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(target.querySelector("[data-failure-walkthrough]")).toBeNull();
    expect(target.textContent).not.toContain("Computation stopped in pivot column");
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    expect(mounted.getSession().resultStatus).toBe("stale");
    mounted.dispose();
  });

  it("clears failed-attempt UI after an edit without inventing Output", () => {
    const singular = replaceLinearSystemsDraft(createLinearSystemsSession(), {
      dimension: 3,
      A: [
        ["1", "1", "1"],
        ["1", "1", "1"],
        ["1", "1", "1"],
      ],
      b: ["3", "3", "3"],
    });
    const { target, mounted } = mount(
      setLinearSystemsWorkflowStep(singular, "data")
    );

    runControl(target).click();
    expect(target.querySelector("[data-solve-failure]")).not.toBeNull();
    input(target, "[data-vector-b-row='0']", "4");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(mounted.getSession().latestSuccessfulResult).toBeUndefined();
    expect(mounted.getSession().resultStatus).toBe("absent");
    expect(target.textContent).not.toContain("Computed solution");
    mounted.dispose();
  });

  it("uses subordinate native headings for successful and failed computation evidence", () => {
    const { target, mounted } = mount();
    goToData(target);
    runControl(target).click();
    target.querySelector<HTMLButtonElement>("[data-show-computation]")!.click();

    const output = target.querySelector<HTMLElement>("[data-workflow-panel='output']")!;
    const successWalkthrough = output.querySelector<HTMLElement>(
      "[data-computation-walkthrough]"
    )!;
    expect(output.querySelector(":scope > header h2")?.textContent).toBe(
      "Computed solution"
    );
    expect(successWalkthrough.querySelector(":scope > h3")?.textContent).toBe(
      "Computation walkthrough"
    );
    expect(successWalkthrough.querySelector(".ls-walkthrough-phase > h4")).not.toBeNull();
    expect(successWalkthrough.querySelector(".ls-computation-step > h5")).not.toBeNull();
    const successToggle = target.querySelector<HTMLButtonElement>("[data-show-computation]")!;
    expect(successToggle.getAttribute("aria-expanded")).toBe("true");
    expect(successToggle.getAttribute("aria-controls")).toBe(successWalkthrough.id);

    target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")!.click();
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "1");
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='1']", "1");
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='2']", "1");
    input(target, "[data-matrix-a-row='1'][data-matrix-a-column='0']", "1");
    input(target, "[data-matrix-a-row='1'][data-matrix-a-column='1']", "1");
    input(target, "[data-matrix-a-row='1'][data-matrix-a-column='2']", "1");
    input(target, "[data-matrix-a-row='2'][data-matrix-a-column='0']", "1");
    input(target, "[data-matrix-a-row='2'][data-matrix-a-column='1']", "1");
    input(target, "[data-matrix-a-row='2'][data-matrix-a-column='2']", "1");
    input(target, "[data-vector-b-row='0']", "3");
    input(target, "[data-vector-b-row='1']", "3");
    input(target, "[data-vector-b-row='2']", "3");
    runControl(target).click();
    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();

    const data = target.querySelector<HTMLElement>("[data-workflow-panel='data']")!;
    const failedAttempt = data.querySelector<HTMLElement>("[data-solve-failure]")!;
    const failureWalkthrough = failedAttempt.querySelector<HTMLElement>(
      "[data-failure-walkthrough]"
    )!;
    expect(data.querySelector(":scope > h2")?.textContent).toContain("Data");
    expect(failedAttempt.querySelector(":scope > h3")?.textContent).toBe(
      "The system was not solved"
    );
    expect(failureWalkthrough.querySelector(":scope > h4")?.textContent).toBe(
      "Computation walkthrough"
    );
    expect(failureWalkthrough.querySelector(".ls-walkthrough-phase > h5")).not.toBeNull();
    expect(failureWalkthrough.querySelector(".ls-computation-step > h6")).not.toBeNull();
    const failureToggle = failedAttempt.querySelector<HTMLButtonElement>(
      "[data-show-failure-computation]"
    )!;
    expect(failureToggle.getAttribute("aria-expanded")).toBe("true");
    expect(failureToggle.getAttribute("aria-controls")).toBe(failureWalkthrough.id);

    const ids = [...target.querySelectorAll<HTMLElement>("[id]")].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    mounted.dispose();
  });

  it("resets to Starter 3×3, clears presentation state, and disposes idempotently", () => {
    const applyConfirmedReset = vi.fn();
    const { target, mounted } = mount(successfulSession(), {
      updateSession: vi.fn(),
      applyConfirmedReset,
    });
    target.querySelector<HTMLButtonElement>("[data-show-computation]")?.click();
    target.querySelector<HTMLButtonElement>("[data-new-experiment]")!.click();
    expect(document.querySelector("[data-new-experiment-dialog]")).not.toBeNull();
    document.querySelector<HTMLButtonElement>("[data-reset-confirm]")!.click();

    expect(mounted.getSession()).toMatchObject({
      step: "method",
      dimension: 3,
      selectedPresetId: "starter_3x3",
      resultStatus: "absent",
      meaningful: false,
    });
    expect(applyConfirmedReset).toHaveBeenCalledWith(
      expect.objectContaining({ clearTutorConversation: true, at: 500 })
    );
    expect(target.querySelector("[data-computation-walkthrough]")).toBeNull();
    mounted.dispose();
    mounted.dispose();
    expect(target.childElementCount).toBe(0);

    const remounted = mountLinearSystemsApp({
      target,
      initialSession: createLinearSystemsSession(),
    });
    expect(target.querySelector("h1")?.textContent).toBe("Linear Systems Lab");
    remounted.dispose();
  });
});
