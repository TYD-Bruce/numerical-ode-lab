// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
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
    expect(view.textContent).toContain("The presentation does not rerun the solver");
    expect(view.textContent).not.toContain('"kind"');
    expect(view.textContent).not.toContain('"steps"');
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
});
