// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountLinearSystemsApp } from "./linearSystemsApp";
import { formatMathNumber } from "../../math/structuredMath";
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

function visibleProseText(root: ParentNode): string {
  const copy = root.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("[role='math']").forEach((formula) => formula.remove());
  return copy.textContent ?? "";
}

function successfulSession(
  session = createLinearSystemsSession()
): LinearSystemsSessionState {
  const outcome = runLinearSystemsSession(session);
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) throw new Error(outcome.error.message);
  return outcome.session;
}

function singularDraft(session = createLinearSystemsSession()): LinearSystemsSessionState {
  return setLinearSystemsWorkflowStep(
    replaceLinearSystemsDraft(session, {
      dimension: 3,
      A: [
        ["1", "1", "1"],
        ["1", "1", "1"],
        ["1", "1", "1"],
      ],
      b: ["3", "3", "3"],
    }),
    "data"
  );
}

describe("Linear Systems Lab Teaching v2 application", () => {
  beforeEach(() => document.body.replaceChildren());

  it("keeps the four-step workflow and renders the Method teaching framework", () => {
    const { target, mounted } = mount();

    expect(target.querySelector("h1")?.textContent).toBe("Linear Systems Lab");
    expect(target.querySelectorAll("[data-workflow-step]")).toHaveLength(4);
    expect(
      target.querySelector("[data-workflow-step='method']")?.getAttribute(
        "aria-current"
      )
    ).toBe("step");
    expect(
      target.querySelector<HTMLButtonElement>("[data-workflow-step='output']")
        ?.disabled
    ).toBe(true);
    expect(
      target.querySelector("[data-method-problem] [data-native-math='system-equation']")
    ).not.toBeNull();
    expect(target.querySelector("[data-linear-system-definition]")?.textContent).toContain(
      "multiple linear equations"
    );
    expect(target.querySelector("[data-system-role='A'] h3")?.textContent).toBe(
      "Coefficient matrix"
    );
    expect(target.querySelector("[data-system-role='x'] h3")?.textContent).toBe(
      "Unknown vector"
    );
    expect(target.querySelector("[data-system-role='b'] h3")?.textContent).toBe(
      "Right-hand side vector"
    );
    expect(target.querySelector("[data-linear-system-example] mtable")).not.toBeNull();
    expect(target.querySelector("[data-selected-method-teaching='gepp'] h3")?.textContent).toBe(
      "How Gaussian elimination with partial pivoting works"
    );
    expect(target.querySelector("[data-method-result-check]")?.textContent).toContain(
      "does not compute a condition number"
    );
    expect(target.querySelector("[data-method-family='direct']")).not.toBeNull();
    expect(target.querySelector("[data-method-family='iterative']")).not.toBeNull();
    expect(target.querySelectorAll("[data-method-status='available']")).toHaveLength(1);
    expect(
      [...target.querySelectorAll("[data-method-status='planned']")].map(
        (badge) => badge.parentElement?.querySelector("strong")?.textContent
      )
    ).toEqual(["Jacobi", "Gauss–Seidel"]);
    expect(target.querySelector("[data-teaching-concept='pivot']")).not.toBeNull();
    expect(
      target.querySelector("[data-teaching-concept='partial-pivoting']")
    ).not.toBeNull();
    expect(
      target.querySelector("[data-native-math='elimination-multiplier'] mfrac")
    ).not.toBeNull();
    expect(
      target.querySelector("[data-native-math='factorization-relation']")
    ).not.toBeNull();
    expect(
      target.querySelector("[data-native-math='forward-substitution-relation']")
    ).not.toBeNull();
    expect(
      target.querySelector("[data-native-math='backward-substitution-relation']")
    ).not.toBeNull();
    mounted.dispose();
  });

  it("moves from Method to editable Data with presets and an accessible MathML equation", () => {
    const { target, mounted } = mount();
    target.querySelector<HTMLButtonElement>(".ls-button-primary")!.click();

    expect(target.querySelector("[data-workflow-panel]")?.getAttribute("data-workflow-panel")).toBe(
      "data"
    );
    expect(
      [...target.querySelectorAll<HTMLSelectElement>("[data-preset-select] option")].map(
        (option) => option.textContent
      )
    ).toEqual(["Starter 3×3", "Row swap required", "Custom"]);
    const equation = target.querySelector<HTMLElement>(
      "[data-equation-editor] [data-native-math='system-equation']"
    )!;
    expect(equation.getAttribute("role")).toBe("math");
    expect(equation.getAttribute("aria-label")).toBe("A times x equals b");
    expect(equation.querySelector(":scope > math[aria-hidden='true'] mrow")).not.toBeNull();
    expect(target.querySelector("[data-equation-data] [data-equation-term='A']")).not.toBeNull();
    expect(target.querySelector("[data-equation-data] [data-equation-term='b']")).not.toBeNull();
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

    dimension.value = "6";
    dimension.dispatchEvent(new Event("change", { bubbles: true }));
    expect(target.querySelectorAll("[data-matrix-a-row]")).toHaveLength(36);
    expect(target.querySelectorAll("[data-vector-b-row]")).toHaveLength(6);
    expect(mounted.getSession().ADraft[5]).toEqual(["", "", "", "", "", ""]);
    mounted.dispose();
  });

  it("reports invalid drafts and focuses the first invalid cell", async () => {
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
    expect(document.activeElement).toBe(first);
    expect(mounted.getSession().latestSuccessfulResult).toBeUndefined();
    mounted.dispose();
  });

  it("moves preset identity to Custom on edit and restores exact authority", () => {
    const { target, mounted } = mount();
    goToData(target);
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "3.5");
    expect(mounted.getSession().selectedPresetId).toBeNull();
    expect(target.querySelector<HTMLSelectElement>("[data-preset-select]")?.value).toBe(
      "custom"
    );
    expect(target.textContent).toContain("No preset reference solution is authoritative");

    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "3.0");
    expect(mounted.getSession().selectedPresetId).toBe("starter_3x3");
    mounted.dispose();
  });

  it("renders the successful MathML result and the static trace-owned walkthrough", async () => {
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
    const computed = target.querySelector<HTMLElement>(
      "[data-native-math='computed-solution']"
    )!;
    expect(computed.querySelector("mover")).not.toBeNull();
    expect(computed.querySelector("mtable")).not.toBeNull();
    expect(computed.querySelectorAll("mtr")).toHaveLength(3);
    expect(computed.getAttribute("aria-label")).toContain("x hat equals");
    const context = target.querySelector<HTMLElement>("[data-output-problem-context]")!;
    expect(context.dataset.resultAuthority).toBe("successful-result");
    expect(context.querySelector("[data-native-math='solved-system']")).not.toBeNull();
    expect(context.querySelectorAll("[data-native-math='solved-system'] mtable")).toHaveLength(3);
    expect(
      [...context.querySelectorAll<HTMLElement>("[data-math-number-context='matrix']")].map(
        (item) => item.getAttribute("data-display-value")
      )
    ).toEqual([
      ...result.originalA.flat().map((value) => formatMathNumber(value, "matrix").text),
      ...result.originalB.map((value) => formatMathNumber(value, "matrix").text),
    ]);
    const primary = target.querySelector<HTMLElement>("[data-primary-result]")!;
    expect(primary.querySelectorAll(":scope > [data-result-part]")).toHaveLength(2);
    expect(primary.querySelector("[data-result-part='problem'] + [data-result-part='solution']"))
      .not.toBeNull();
    for (const factor of ["factor-p", "factor-l", "factor-u"]) {
      expect(target.querySelector(`[data-native-math='${factor}'] mtable`)).not.toBeNull();
    }

    const toggle = target.querySelector<HTMLButtonElement>("[data-show-computation]")!;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    toggle.click();
    expect(target.querySelector("[data-trace-kind='factorization_start'] mtable")).not.toBeNull();
    expect(
      target.querySelector(
        "[data-trace-kind='elimination'] [data-matrix-state='before'] mtable"
      )
    ).not.toBeNull();
    expect(
      target.querySelector(
        "[data-trace-kind='elimination'] [data-matrix-state='after'] mtable"
      )
    ).not.toBeNull();
    expect(
      target.querySelector("[data-trace-kind='right_hand_side_permutation'] mtable")
    ).not.toBeNull();
    expect(target.querySelector("[data-replay-computation-step]")).toBeNull();
    expect(target.querySelector("[data-motion-stage]")).toBeNull();
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);
    expect(recordMeaningfulInteraction).toHaveBeenCalled();
    expect(updateSession).toHaveBeenCalled();
    mounted.dispose();
  });

  it("renders Diagnostics as distinct residual blocks with subordinate safeguards", () => {
    const { target, mounted } = mount(successfulSession());
    target.querySelector<HTMLButtonElement>("[data-workflow-step='diagnostics']")!.click();

    const result = mounted.getSession().latestSuccessfulResult!;
    const context = target.querySelector<HTMLElement>("[data-diagnostics-context]")!;
    expect(context.dataset.resultAuthority).toBe("successful-result");
    expect(context.querySelector("[data-native-math='diagnostic-context-a']")).not.toBeNull();
    expect(context.querySelector("[data-native-math='diagnostic-context-b']")).not.toBeNull();
    expect(context.querySelector("[data-native-math='diagnostic-context-x-hat']")).not.toBeNull();
    expect(context.textContent).toContain("What problem did we solve?");
    expect(context.textContent).toContain("What solution are we checking?");

    expect(
      target.querySelector("[data-diagnostic-meaning] [data-native-math='residual-relation']")
    ).not.toBeNull();
    expect(target.querySelector("[data-diagnostic-meaning]")?.textContent).toContain(
      "how far the computed solution misses the original equations"
    );
    expect(visibleProseText(target.querySelector("[data-diagnostic-meaning]")!)).toContain(
      "If the computed solution satisfies the equations exactly, the residual is zero."
    );
    expect(visibleProseText(target.querySelector("[data-diagnostic-meaning]")!)).not.toMatch(
      /A\s+x(?:-|\s)hat/i
    );
    expect(
      target.querySelector("[data-native-math='residual-ideal']")?.getAttribute("aria-label")
    ).toBe("If A times x hat equals b, then r equals zero");
    expect(target.querySelector("[data-native-math='residual-ideal'] mover")).not.toBeNull();
    const meaning = target.querySelector<HTMLElement>("[data-diagnostic-meaning]")!;
    const firstStep = target.querySelector<HTMLElement>("[data-diagnostic-block='matrix-vector']")!;
    expect(
      Boolean(meaning.compareDocumentPosition(firstStep) & Node.DOCUMENT_POSITION_FOLLOWING)
    ).toBe(true);
    expect(
      target.querySelector(
        "[data-diagnostic-block='matrix-vector'] [data-native-math='matrix-vector-result'] mtable"
      )
    ).not.toBeNull();
    expect(
      target.querySelector(
        "[data-diagnostic-block='residual'] [data-native-math='residual-vector'] mtable"
      )
    ).not.toBeNull();
    expect(
      target.querySelector(
        "[data-diagnostic-block='residual-norm'] [data-native-math='residual-inf-norm'] msub"
      )
    ).not.toBeNull();
    expect(
      target.querySelector("[data-diagnostic-block='matrix-vector'] h3")?.textContent
    ).toBe("Substitute the computed solution");
    expect(visibleProseText(firstStep)).toContain(
      "Substitute the computed solution into the original left-hand side to see what equations it satisfies."
    );
    expect(visibleProseText(firstStep)).not.toMatch(/x-hat|A\s+x(?:-|\s)hat/i);
    expect(target.querySelector("[data-diagnostic-block='residual'] h3")?.textContent).toBe(
      "Find the equation mismatch"
    );
    const residualStep = target.querySelector<HTMLElement>(
      "[data-diagnostic-block='residual']"
    )!;
    expect(visibleProseText(residualStep)).toContain(
      "Compare the original right-hand side with the value produced by the computed solution."
    );
    expect(visibleProseText(residualStep)).not.toMatch(/x-hat|A\s+x(?:-|\s)hat/i);
    expect(
      target.querySelector("[data-diagnostic-block='residual-norm'] h3")?.textContent
    ).toBe("Measure the largest mismatch");
    expect(target.textContent).not.toContain("Compute A times x hat");
    expect(
      target.querySelector("[data-native-math='residual-relation']")?.getAttribute("aria-label")
    ).toBe("r equals b minus A times x hat");
    expect(
      target.querySelector("[data-diagnostic-block='residual-norm'] [data-native-math='residual-inf-norm']")
        ?.getAttribute("aria-label")
    ).toContain("maximum absolute residual component");
    expect(
      [...target.querySelectorAll<HTMLElement>("[data-native-math='matrix-vector-result'] [data-math-number]")].map(
        (item) => item.getAttribute("data-display-value")
      )
    ).toEqual(
      result.trace.steps
        .flatMap((step) =>
          step.kind === "residual_component"
            ? [formatMathNumber(step.matrixVectorValue, "diagnostic").text]
            : []
        )
    );
    expect(target.querySelector("[data-diagnostic-limitation]")?.textContent).toContain(
      "A small residual means a small equation mismatch"
    );
    expect(target.querySelector("[data-diagnostic-limitation]")?.textContent).toContain(
      "does not, by itself, guarantee a small solution error"
    );
    expect(target.querySelector("[data-diagnostic-limitation]")?.textContent).toContain(
      "does not compute a condition number"
    );
    expect(target.querySelector("[data-reference-comparison]")).not.toBeNull();

    const safeguard = target.querySelector<HTMLDetailsElement>(
      "[data-solver-safeguard-details]"
    )!;
    expect(safeguard.open).toBe(false);
    expect(safeguard.querySelectorAll("msub").length).toBeGreaterThanOrEqual(3);
    const implementation = safeguard.querySelector<HTMLDetailsElement>(
      "[data-implementation-detail]"
    )!;
    expect(implementation.open).toBe(false);
    expect(implementation.textContent).toContain("Number.EPSILON");
    mounted.dispose();
  });

  it("omits the preset comparison after custom input changes authority", () => {
    const custom = replaceLinearSystemsDraft(createLinearSystemsSession(), {
      dimension: 2,
      A: [
        ["2", "0"],
        ["0", "4"],
      ],
      b: ["2", "8"],
    });
    const { target, mounted } = mount(successfulSession(custom));
    target.querySelector<HTMLButtonElement>("[data-workflow-step='diagnostics']")!.click();
    expect(target.querySelector("[data-reference-comparison]")).toBeNull();
    mounted.dispose();
  });

  it("preserves the successful snapshot through stale edits and exact restoration", () => {
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
    const staleContext = target.querySelector<HTMLElement>("[data-output-problem-context]")!;
    expect(staleContext.textContent).toContain(
      "This result was produced from the previous successful inputs"
    );
    expect(
      [...staleContext.querySelectorAll<HTMLElement>("[data-math-number-context='matrix']")].map(
        (item) => item.getAttribute("data-display-value")
      )
    ).toEqual([
      ...result!.originalA.flat().map((value) => formatMathNumber(value, "matrix").text),
      ...result!.originalB.map((value) => formatMathNumber(value, "matrix").text),
    ]);
    expect(staleContext.textContent).not.toContain("7");

    target.querySelector<HTMLButtonElement>("[data-workflow-step='diagnostics']")!.click();
    const staleDiagnostics = target.querySelector<HTMLElement>("[data-diagnostics-context]")!;
    expect(
      [...staleDiagnostics.querySelectorAll<HTMLElement>("[data-math-number-context='matrix']")].map(
        (item) => item.getAttribute("data-display-value")
      )
    ).toEqual([
      ...result!.originalA.flat().map((value) => formatMathNumber(value, "matrix").text),
      ...result!.originalB.map((value) => formatMathNumber(value, "matrix").text),
      ...result!.xHat.map((value) => formatMathNumber(value, "matrix").text),
    ]);
    expect(staleDiagnostics.textContent).not.toContain("7");

    target.querySelector<HTMLButtonElement>("[data-workflow-step='data']")!.click();
    input(target, "[data-vector-b-row='0']", "6.0");
    expect(mounted.getSession()).toMatchObject({ resultStatus: "current" });
    expect(mounted.getSession().latestSuccessfulResult).toBe(result);
    mounted.dispose();
  });

  it("keeps pivot rejection qualified and preserves an earlier successful result", () => {
    const priorSession = successfulSession();
    const prior = priorSession.latestSuccessfulResult;
    const { target, mounted } = mount(singularDraft(priorSession));
    runControl(target).click();

    const failure = target.querySelector<HTMLElement>("[data-solve-failure='pivot_rejected']")!;
    expect(failure.textContent).toContain("engineering safeguard");
    expect(failure.textContent).toContain("does not by itself");
    expect(failure.textContent).toContain("formal symbolic proof");
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    expect(mounted.getSession().resultStatus).toBe("stale");

    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    const walkthrough = target.querySelector<HTMLElement>("[data-failure-walkthrough]")!;
    expect(walkthrough.querySelector("[data-trace-kind='pivot_selection']")).not.toBeNull();
    expect(walkthrough.querySelector("[data-trace-kind='forward_substitution']")).toBeNull();
    expect(walkthrough.querySelector("[data-replay-computation-step]")).toBeNull();
    mounted.dispose();
  });

  it("removes failed-attempt evidence on A or b edits without clearing prior Output", () => {
    const priorSession = successfulSession();
    const prior = priorSession.latestSuccessfulResult;
    const { target, mounted } = mount(singularDraft(priorSession));

    runControl(target).click();
    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    expect(target.querySelector("[data-failure-walkthrough]")).not.toBeNull();
    input(target, "[data-matrix-a-row='0'][data-matrix-a-column='0']", "2");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(target.querySelector("[data-failure-walkthrough]")).toBeNull();
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    expect(mounted.getSession().resultStatus).toBe("stale");

    runControl(target).click();
    target.querySelector<HTMLButtonElement>("[data-show-failure-computation]")!.click();
    input(target, "[data-vector-b-row='0']", "4");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(target.querySelector("[data-failure-walkthrough]")).toBeNull();
    expect(mounted.getSession().latestSuccessfulResult).toBe(prior);
    mounted.dispose();
  });

  it("does not invent Output when editing after a failed attempt with no prior success", () => {
    const { target, mounted } = mount(singularDraft());
    runControl(target).click();
    expect(target.querySelector("[data-solve-failure]")).not.toBeNull();
    input(target, "[data-vector-b-row='0']", "4");
    expect(target.querySelector("[data-solve-failure]")).toBeNull();
    expect(mounted.getSession().latestSuccessfulResult).toBeUndefined();
    expect(mounted.getSession().resultStatus).toBe("absent");
    expect(target.textContent).not.toContain("Computed solution");
    mounted.dispose();
  });

  it("uses a subordinate native heading outline for success and failure walkthroughs", () => {
    const successCase = mount(successfulSession());
    successCase.target
      .querySelector<HTMLButtonElement>("[data-show-computation]")!
      .click();
    const success = successCase.target.querySelector<HTMLElement>(
      "[data-computation-walkthrough]"
    )!;
    expect(success.querySelector(":scope > h3")?.textContent).toBe(
      "Computation walkthrough"
    );
    expect(success.querySelector(".ls-walkthrough-phase > h4")).not.toBeNull();
    expect(success.querySelector(".ls-computation-step > h5")).not.toBeNull();
    successCase.mounted.dispose();

    document.body.replaceChildren();
    const failureCase = mount(singularDraft());
    runControl(failureCase.target).click();
    failureCase.target
      .querySelector<HTMLButtonElement>("[data-show-failure-computation]")!
      .click();
    const failure = failureCase.target.querySelector<HTMLElement>(
      "[data-failure-walkthrough]"
    )!;
    expect(failure.querySelector(":scope > h4")?.textContent).toBe(
      "Computation before failure"
    );
    expect(failure.querySelector(".ls-walkthrough-phase > h5")).not.toBeNull();
    expect(failure.querySelector(".ls-computation-step > h6")).not.toBeNull();
    failureCase.mounted.dispose();
  });

  it("resets to Starter 3×3 and disposes idempotently", () => {
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
  });

  it("keeps primary result and Diagnostics height content-driven", () => {
    const css = readFileSync(
      resolve(process.cwd(), "frontend", "src", "labs", "linear-algebra", "linearSystems.css"),
      "utf8"
    );

    expect(css).not.toMatch(/\.ls-primary-result[^}]*min-height\s*:/s);
    expect(css).not.toMatch(/\.ls-diagnostic-block[^}]*min-height\s*:/s);
  });
});
