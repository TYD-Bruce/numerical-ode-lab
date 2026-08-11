// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { solveLinearSystem } from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import { linearSystemsPresetById } from "@numerical-t-lab/numerics/linear-algebra/linear-systems-presets";
import {
  createComputationWalkthrough,
  createTraceRetentionNotice,
  formatLinearSystemsNumber,
} from "./computationWalkthrough";

function solvePreset(id: "starter_3x3" | "row_swap_required") {
  const preset = linearSystemsPresetById(id);
  const outcome = solveLinearSystem({ A: preset.A, b: preset.b });
  expect(outcome.ok).toBe(true);
  if (!outcome.ok) throw new Error(outcome.error.message);
  return outcome.result;
}

describe("Linear Systems computation walkthrough", () => {
  beforeEach(() => document.body.replaceChildren());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders every successful semantic trace kind as presentation evidence", () => {
    const result = solvePreset("row_swap_required");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);

    const renderedKinds = [...view.querySelectorAll<HTMLElement>("[data-trace-kind]")].map(
      (item) => item.dataset.traceKind
    );
    expect(new Set(renderedKinds)).toEqual(
      new Set(result.trace.steps.map((step) => step.kind))
    );
    for (const kind of [
      "matrix_scale",
      "pivot_selection",
      "row_swap",
      "elimination",
      "factorization_complete",
      "forward_substitution",
      "backward_substitution",
      "residual_component",
      "residual_inf_norm",
      "preset_reference_difference",
    ]) {
      expect(renderedKinds).toContain(kind);
    }
    expect(view.textContent).toContain("P A = L U");
    expect(view.textContent).toContain("Each step comes from the computation that produced this result");
    expect(view.textContent).not.toContain('"kind"');
    expect(view.textContent).not.toContain('"steps"');
    expect(view.textContent).not.toMatch(/structured evidence|exact stored result|stored row evidence/i);
  });

  it("preserves pivot candidates, elimination, substitution, and residual order from trace", () => {
    const result = solvePreset("row_swap_required");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const firstPivot = result.trace.steps.find(
      (step) => step.kind === "pivot_selection"
    );
    expect(firstPivot?.kind).toBe("pivot_selection");
    if (firstPivot?.kind !== "pivot_selection") return;
    const pivotRows = [
      ...view
        .querySelector<HTMLElement>("[data-trace-kind='pivot_selection']")!
        .querySelectorAll("tbody tr"),
    ].map((row) => row.querySelector("th")?.textContent);
    expect(pivotRows).toEqual(
      firstPivot.candidates.map((candidate) => String(candidate.row + 1))
    );
    const selected = view.querySelector<HTMLElement>(
      "[data-trace-kind='pivot_selection'] [data-pivot-selected='true']"
    );
    expect(selected?.textContent).toContain("Selected");
    expect(selected?.getAttribute("aria-current")).toBe("true");

    const firstElimination = result.trace.steps.find(
      (step) => step.kind === "elimination"
    );
    expect(firstElimination?.kind).toBe("elimination");
    if (firstElimination?.kind !== "elimination") return;
    const elimination = view.querySelector<HTMLElement>(
      "[data-trace-kind='elimination']"
    )!;
    expect(elimination.textContent).toContain(
      formatLinearSystemsNumber(firstElimination.multiplier)
    );
    firstElimination.targetRowAfter.forEach((value) =>
      expect(elimination.textContent).toContain(formatLinearSystemsNumber(value))
    );

    const forwardRows = result.trace.steps.flatMap((step) =>
      step.kind === "forward_substitution" ? [step.row + 1] : []
    );
    const renderedForwardRows = [
      ...view.querySelectorAll<HTMLElement>("[data-trace-kind='forward_substitution'] h5"),
    ].map((heading) => Number(heading.textContent?.match(/(\d+)$/)?.[1]));
    expect(renderedForwardRows).toEqual(forwardRows);

    const backwardRows = result.trace.steps.flatMap((step) =>
      step.kind === "backward_substitution" ? [step.row + 1] : []
    );
    const renderedBackwardRows = [
      ...view.querySelectorAll<HTMLElement>("[data-trace-kind='backward_substitution'] h5"),
    ].map((heading) => Number(heading.textContent?.match(/(\d+)$/)?.[1]));
    expect(renderedBackwardRows).toEqual(backwardRows);

    const residual = result.trace.steps.find(
      (step) => step.kind === "residual_component"
    );
    expect(residual?.kind).toBe("residual_component");
    if (residual?.kind !== "residual_component") return;
    const products = [
      ...view
        .querySelector<HTMLElement>("[data-trace-kind='residual_component']")!
        .querySelectorAll("tbody tr"),
    ].map((row) => row.querySelector("th")?.textContent);
    expect(products).toEqual(residual.terms.map((term) => String(term.column + 1)));
  });

  it("shows stored arithmetic behind native details and keeps reference comparison conditional", () => {
    const starter = solvePreset("starter_3x3");
    const starterView = createComputationWalkthrough(starter.trace, {
      headingLevel: 3,
    });
    expect(starterView.querySelectorAll("details > summary").length).toBeGreaterThan(0);
    expect(
      [...starterView.querySelectorAll("details > summary")].every(
        (summary) => summary.textContent === "Show arithmetic"
      )
    ).toBe(true);
    expect(starterView.textContent).toContain(
      "Difference from preset reference solution"
    );

    const custom = solveLinearSystem({
      A: [
        [2, 0],
        [0, 4],
      ],
      b: [2, 8],
    });
    expect(custom.ok).toBe(true);
    if (!custom.ok) return;
    const customView = createComputationWalkthrough(custom.result.trace, {
      headingLevel: 3,
    });
    expect(customView.textContent).not.toContain(
      "Difference from preset reference solution"
    );
    expect(
      customView.querySelector("[data-trace-kind='preset_reference_difference']")
    ).toBeNull();
  });

  it("shows optional stored substitution aggregates only in detailed arithmetic", () => {
    const starter = solvePreset("starter_3x3");
    const forward = starter.trace.steps.find(
      (step) =>
        step.kind === "forward_substitution" &&
        step.accumulatedKnownTermSum !== undefined
    );
    expect(forward?.kind).toBe("forward_substitution");
    if (forward?.kind !== "forward_substitution") return;

    const view = createComputationWalkthrough(starter.trace, { headingLevel: 3 });
    const card = [...view.querySelectorAll<HTMLElement>(
      "[data-trace-kind='forward_substitution']"
    )].find((candidate) =>
      candidate.querySelector("h5")?.textContent?.endsWith(String(forward.row + 1))
    )!;
    const accumulated = card.querySelector<HTMLElement>(
      "details [data-accumulated-known-term-sum]"
    )!;
    expect(accumulated).not.toBeNull();
    expect(card.querySelector(":scope > [data-accumulated-known-term-sum]")).toBeNull();
    expect(accumulated.textContent).toContain(
      formatLinearSystemsNumber(forward.accumulatedKnownTermSum!)
    );

    const withoutAggregate = starter.trace.steps.map((step) => {
      if (step !== forward) return step;
      const { accumulatedKnownTermSum: _omitted, ...rest } = step;
      return rest;
    });
    const withoutView = createComputationWalkthrough(
      {
        ...starter.trace,
        steps: withoutAggregate,
      },
      { headingLevel: 3 }
    );
    const withoutCard = [...withoutView.querySelectorAll<HTMLElement>(
      "[data-trace-kind='forward_substitution']"
    )].find((candidate) =>
      candidate.querySelector("h5")?.textContent?.endsWith(String(forward.row + 1))
    )!;
    expect(
      withoutCard.querySelector("[data-accumulated-known-term-sum]")
    ).toBeNull();
  });

  it("uses structured indices, named subscripts, powers, and single formula owners", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);

    const matrixNorm = view.querySelector<HTMLElement>("[data-math='matrix-inf-norm']")!;
    const residualNorm = view.querySelector<HTMLElement>("[data-math='residual-inf-norm']")!;
    const tau = view.querySelector<HTMLElement>("[data-math='tau-pivot']")!;
    const multiplier = view.querySelector<HTMLElement>("[data-math='multiplier']")!;
    const matrixEntry = view.querySelector<HTMLElement>("[data-math='matrix-entry']")!;
    const component = view.querySelector<HTMLElement>("[data-math='solution-component']")!;
    const rowOperation = view.querySelector<HTMLElement>("[data-math='row-operation']")!;
    const scientific = view.querySelector<HTMLElement>("[data-math-number='scientific']")!;

    expect(matrixNorm.querySelector("sub")?.textContent).toBe("∞");
    expect(residualNorm.querySelector("sub")?.textContent).toBe("∞");
    expect(tau.querySelector("sub")?.textContent).toBe("pivot");
    expect(multiplier.querySelector("sub")).not.toBeNull();
    expect(matrixEntry.querySelector("sub")).not.toBeNull();
    expect(component.querySelector("sub")).not.toBeNull();
    expect(rowOperation.querySelectorAll("sub").length).toBeGreaterThan(1);
    expect(scientific.querySelector("sup")).not.toBeNull();
    for (const formula of view.querySelectorAll<HTMLElement>("[role='math']")) {
      expect(formula.getAttribute("aria-label")).toBeTruthy();
      expect(formula.querySelector(":scope > [aria-hidden='true']")).not.toBeNull();
      expect(formula.querySelectorAll("[aria-label]")).toHaveLength(0);
    }
  });

  it("uses approximation for rounded arithmetic and retains exact symbolic definitions", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const elimination = view.querySelector<HTMLElement>("[data-trace-kind='elimination']")!;
    const multiplier = elimination.querySelector<HTMLElement>("[data-math='multiplier']")!;
    const roundedArithmetic = elimination.querySelector<HTMLElement>(
      "details [data-rounded-arithmetic]"
    )!;

    expect(multiplier.textContent).toContain("=");
    expect(roundedArithmetic.textContent).toContain("≈");
    expect(roundedArithmetic.textContent).not.toMatch(/2\s*÷\s*3\s*=/);
  });

  it("starts every substitution chain from the stored right-hand side", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const steps = result.trace.steps.filter(
      (step): step is Extract<
        (typeof result.trace.steps)[number],
        { kind: "forward_substitution" | "backward_substitution" }
      > => step.kind === "forward_substitution" || step.kind === "backward_substitution"
    );
    const cards = [...view.querySelectorAll<HTMLElement>(
      "[data-trace-kind='forward_substitution'], [data-trace-kind='backward_substitution']"
    )];

    expect(cards).toHaveLength(steps.length);
    cards.forEach((card, index) => {
      const firstStage = card.querySelector<HTMLElement>("[data-substitution-stage='rhs']")!;
      expect(firstStage).not.toBeNull();
      expect(firstStage.textContent).toContain(
        formatLinearSystemsNumber(steps[index]!.rightHandSideValue, "detail")
      );
      expect(card.querySelector("[data-substitution-stage='numerator']")).not.toBeNull();
      expect(card.querySelector("[data-substitution-stage='diagonal']")).not.toBeNull();
      expect(card.querySelector("[data-substitution-stage='result']")).not.toBeNull();
    });
  });

  it("avoids baseline pseudo-notation and raw JavaScript exponent notation", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });

    const walker = document.createTreeWalker(view, NodeFilter.SHOW_TEXT);
    const textNodes: string[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode.textContent ?? "");
    const primaryText = textNodes.join("\n");
    expect(primaryText).not.toMatch(/e-\d+/i);
    expect(primaryText).not.toContain("τpivot");
    expect(primaryText).not.toMatch(/m\(\d+,\s*\d+\)/);
    expect(primaryText).not.toMatch(/(?:x̂|y|r)\d/);
    expect(primaryText).not.toContain("‖r‖∞");
    expect(primaryText).not.toContain("‖A‖∞");
    expect(primaryText).not.toMatch(/[\\{}]|\^[-−]?\d/);
  });

  it("represents finite omission and unbounded continuation metadata without inventing a final step", () => {
    const finite = createTraceRetentionNotice({
      processKind: "repetitive_finite",
      retentionPolicy: "first_five_plus_final_when_distinct",
      retainedStepCount: 6,
      totalMeaningfulStepCount: 25,
      omittedMiddleWork: true,
      finalStepRetained: true,
    });
    expect(finite?.textContent).toContain("6 of 25");
    expect(finite?.textContent).toContain("final evidence is included");

    const unbounded = createTraceRetentionNotice({
      processKind: "unbounded",
      retentionPolicy: "first_five_plus_continuation",
      retainedStepCount: 5,
      omittedMiddleWork: true,
      finalStepRetained: false,
      continuation: { recurrence: "retained structured metadata" },
    });
    expect(unbounded?.textContent).toContain("not represented as having a final step");
    expect(unbounded?.dataset.traceContinuation).toBe("present");
    expect(unbounded?.textContent).not.toContain("retained structured metadata");
  });

  it("offers local Replay only for row swaps and eliminations with static semantic cues", () => {
    const result = solvePreset("row_swap_required");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);

    const replayableSteps = result.trace.steps.filter(
      (step) => step.kind === "row_swap" || step.kind === "elimination"
    );
    const replayButtons = [
      ...view.querySelectorAll<HTMLButtonElement>("[data-replay-computation-step]"),
    ];
    expect(replayButtons).toHaveLength(replayableSteps.length);
    replayButtons.forEach((control) => {
      expect(control.type).toBe("button");
      expect(control.textContent).toBe("Replay step");
      expect(control.getAttribute("aria-label")).toMatch(
        /^Replay (?:row swap|elimination)/
      );
    });
    for (const card of view.querySelectorAll<HTMLElement>("[data-trace-kind]")) {
      const shouldReplay =
        card.dataset.traceKind === "row_swap" ||
        card.dataset.traceKind === "elimination";
      expect(card.querySelector("[data-replay-computation-step]") !== null).toBe(
        shouldReplay
      );
    }
    expect(
      view.querySelector("[data-trace-kind='row_swap'] .computation-marker.is-source")
        ?.textContent
    ).toMatch(/Swap row R\d/);
    expect(
      view.querySelector("[data-trace-kind='row_swap'] .computation-marker.is-target")
        ?.textContent
    ).toMatch(/Swap row R\d/);
    expect(
      view.querySelector("[data-trace-kind='elimination'] .computation-marker.is-source")
        ?.textContent
    ).toMatch(/Pivot row R\d/);
    expect(
      view.querySelector("[data-trace-kind='elimination'] .computation-marker.is-target")
        ?.textContent
    ).toMatch(/Target row R\d/);
  });

  it("replays trace-owned row-swap rows locally without mutating the trace or focus", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 0)
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    const result = solvePreset("row_swap_required");
    const traceBefore = JSON.stringify(result.trace);
    const rowSwap = result.trace.steps.find((step) => step.kind === "row_swap");
    expect(rowSwap?.kind).toBe("row_swap");
    if (rowSwap?.kind !== "row_swap") return;
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);
    const card = view.querySelector<HTMLElement>("[data-trace-kind='row_swap']")!;
    const replay = card.querySelector<HTMLButtonElement>(
      "[data-replay-computation-step='row_swap']"
    )!;
    const stage = card.querySelector<HTMLElement>("[data-motion-stage='row_swap']")!;
    replay.focus();
    replay.click();

    expect(stage.hidden).toBe(false);
    expect(stage.dataset.motionState).toBe("preparing");
    expect(
      [...stage.querySelectorAll<HTMLElement>("[data-motion-row]")].map(
        (row) => row.dataset.motionValues
      )
    ).toEqual(rowSwap.uRowsBefore.map((row) => row.values.join(",")));
    replay.click();
    await vi.runAllTimersAsync();

    expect(stage.dataset.motionState).toBe("settled");
    expect(
      [...stage.querySelectorAll<HTMLElement>("[data-motion-row]")].map(
        (row) => row.dataset.motionValues
      )
    ).toEqual(rowSwap.uRowsAfter.map((row) => row.values.join(",")));
    expect(stage.querySelectorAll("[data-motion-overlay]")).toHaveLength(0);
    expect(document.activeElement).toBe(replay);
    expect(JSON.stringify(result.trace)).toBe(traceBefore);
  });

  it("replaces elimination values discretely from trace evidence and supports reduced motion", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 0)
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    const result = solvePreset("row_swap_required");
    const elimination = result.trace.steps.find((step) => step.kind === "elimination");
    expect(elimination?.kind).toBe("elimination");
    if (elimination?.kind !== "elimination") return;
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);
    const card = view.querySelector<HTMLElement>("[data-trace-kind='elimination']")!;
    const replay = card.querySelector<HTMLButtonElement>(
      "[data-replay-computation-step='elimination']"
    )!;
    const stage = card.querySelector<HTMLElement>("[data-motion-stage='elimination']")!;
    replay.focus();
    replay.click();

    expect(stage.hidden).toBe(false);
    expect(stage.dataset.motionMode).toBe("reduced");
    expect(stage.dataset.motionState).toBe("settled");
    expect(stage.style.transform).toBe("");
    expect(
      stage.querySelector<HTMLElement>("[data-motion-row='target']")?.dataset
        .motionValues
    ).toBe(elimination.targetRowAfter.join(","));
    expect(
      [...stage.querySelectorAll<HTMLElement>("[data-motion-cell]")].map(
        (cell) => cell.textContent
      )
    ).toEqual(
      elimination.targetRowAfter.map((value) =>
        formatLinearSystemsNumber(value, "detail")
      )
    );
    expect(stage.querySelector(".is-changed")?.textContent).toContain("Changed");
    expect(
      [...stage.querySelectorAll<HTMLElement>("[data-motion-cell]")].map(
        (cell) => cell.classList.contains("is-changed")
      )
    ).toEqual(
      elimination.targetRowAfter.map(
        (value, index) => !Object.is(value, elimination.targetRowBefore[index])
      )
    );
    expect(card.querySelector("[data-math='row-operation']")).not.toBeNull();
    expect(document.activeElement).toBe(replay);
    await vi.runAllTimersAsync();
    expect(stage.dataset.motionState).toBe("settled");
  });

  it("uses only stored before and after values during normal elimination replay", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(0), 0)
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    const result = solvePreset("row_swap_required");
    const resultBefore = JSON.stringify(result);
    const elimination = result.trace.steps.find((step) => step.kind === "elimination");
    expect(elimination?.kind).toBe("elimination");
    if (elimination?.kind !== "elimination") return;
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    document.body.append(view);
    const card = view.querySelector<HTMLElement>("[data-trace-kind='elimination']")!;
    const stage = card.querySelector<HTMLElement>("[data-motion-stage='elimination']")!;
    const replay = card.querySelector<HTMLButtonElement>(
      "[data-replay-computation-step='elimination']"
    )!;
    replay.click();

    const targetValues = (): string[] =>
      [...stage.querySelectorAll<HTMLElement>("[data-motion-cell]")].map(
        (cell) => cell.textContent ?? ""
      );
    const before = elimination.targetRowBefore.map((value) =>
      formatLinearSystemsNumber(value, "detail")
    );
    const after = elimination.targetRowAfter.map((value) =>
      formatLinearSystemsNumber(value, "detail")
    );
    expect(targetValues()).toEqual(before);
    await vi.advanceTimersByTimeAsync(140);
    expect(targetValues()).toEqual(after);
    await vi.runAllTimersAsync();
    expect(stage.dataset.motionState).toBe("settled");
    expect(targetValues()).toEqual(after);
    expect(stage.querySelector("[aria-label^='Permutation matrix']")).toBeNull();
    expect(view.querySelector("[aria-live]")).toBeNull();
    expect(JSON.stringify(result)).toBe(resultBefore);
  });

  it("marks long threshold mathematics for contained 320px presentation", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const threshold = view.querySelector<HTMLElement>(
      "[data-trace-kind='matrix_scale'] [data-math='tau-pivot-calculation']"
    );
    expect(threshold?.closest(".ls-contained-math")).not.toBeNull();
    expect(
      view
        .querySelector("[data-math='tau-pivot-definition']")
        ?.closest(".ls-contained-math")
    ).toBe(threshold?.closest(".ls-contained-math"));
  });
});
