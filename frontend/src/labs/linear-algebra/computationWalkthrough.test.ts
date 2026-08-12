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

function renderedNumbers(owner: ParentNode): string[] {
  return [...owner.querySelectorAll<Element>("[data-math-number]")].map(
    (node) => node.getAttribute("data-display-value") ?? ""
  );
}

function expectedMatrixNumbers(matrix: readonly (readonly number[])[]): string[] {
  return matrix.flatMap((row) =>
    row.map((value) => formatLinearSystemsNumber(value, "matrix"))
  );
}

describe("Linear Systems Teaching v2 computation walkthrough", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders factorization_start, full row-swap snapshots, and trace-owned P b", () => {
    const result = solvePreset("row_swap_required");
    const view = createComputationWalkthrough(result.trace, {
      headingLevel: 3,
      result,
    });
    document.body.append(view);

    const start = result.trace.steps.find(
      (step) => step.kind === "factorization_start"
    );
    const swap = result.trace.steps.find((step) => step.kind === "row_swap");
    const rhs = result.trace.steps.find(
      (step) => step.kind === "right_hand_side_permutation"
    );
    expect(start?.kind).toBe("factorization_start");
    expect(swap?.kind).toBe("row_swap");
    expect(rhs?.kind).toBe("right_hand_side_permutation");
    if (
      start?.kind !== "factorization_start" ||
      swap?.kind !== "row_swap" ||
      rhs?.kind !== "right_hand_side_permutation"
    ) return;

    const initial = view.querySelector<HTMLElement>(
      "[data-trace-kind='factorization_start'] [data-native-math='initial-u']"
    )!;
    expect(initial.querySelector("msup")).not.toBeNull();
    expect(initial.querySelector("mtable")).not.toBeNull();
    expect(renderedNumbers(initial)).toEqual(expectedMatrixNumbers(start.initialU));

    const renderedSwap = view.querySelector<HTMLElement>(
      "[data-trace-kind='row_swap']"
    )!;
    expect(
      renderedNumbers(renderedSwap.querySelector("[data-matrix-state='before']")!)
    ).toEqual(expectedMatrixNumbers(swap.uBefore));
    expect(
      renderedNumbers(renderedSwap.querySelector("[data-matrix-state='after']")!)
    ).toEqual(expectedMatrixNumbers(swap.uAfter));
    expect(
      renderedSwap.querySelector("[data-row-operation='swap'] msub")
    ).not.toBeNull();

    const permutedB = view.querySelector<HTMLElement>(
      "[data-trace-kind='right_hand_side_permutation'] [data-native-math='permuted-rhs']"
    )!;
    expect(permutedB.querySelector("mtable")).not.toBeNull();
    expect(renderedNumbers(permutedB)).toEqual(
      rhs.permutedB.map((value) => formatLinearSystemsNumber(value, "matrix"))
    );
  });

  it("preserves the authoritative factorization-operation order", () => {
    const result = solvePreset("row_swap_required");
    const view = createComputationWalkthrough(result.trace, {
      headingLevel: 3,
      result,
    });
    const expected = result.trace.steps
      .filter((step) =>
        step.kind === "pivot_selection" ||
        step.kind === "row_swap" ||
        step.kind === "elimination" ||
        step.kind === "factorization_complete"
      )
      .map((step) => step.kind);
    const rendered = [
      ...view.querySelectorAll<HTMLElement>(
        "[data-walkthrough-phase='factorization'] [data-trace-kind]"
      ),
    ].map((card) => card.dataset.traceKind);

    expect(rendered).toEqual(expected);
    expect(view.querySelector("[data-replay-computation-step]")).toBeNull();
    expect(view.querySelector("[data-motion-stage]")).toBeNull();
  });

  it("renders elimination exclusively from stored full before/after snapshots", () => {
    const result = solvePreset("starter_3x3");
    const original = result.trace.steps.find((step) => step.kind === "elimination");
    expect(original?.kind).toBe("elimination");
    if (original?.kind !== "elimination") return;
    const uBefore = [
      [91, 92, 93],
      [94, 95, 96],
      [97, 98, 99],
    ] as const;
    const uAfter = [
      [81, 82, 83],
      [84, 85, 86],
      [87, 88, 89],
    ] as const;
    const trace = {
      ...result.trace,
      steps: result.trace.steps.map((step) =>
        step === original ? { ...step, uBefore, uAfter } : step
      ),
    };
    const view = createComputationWalkthrough(trace, { headingLevel: 3 });
    const rendered = view.querySelector<HTMLElement>(
      "[data-trace-kind='elimination']"
    )!;

    expect(
      renderedNumbers(rendered.querySelector("[data-matrix-state='before']")!)
    ).toEqual(expectedMatrixNumbers(uBefore));
    expect(
      renderedNumbers(rendered.querySelector("[data-matrix-state='after']")!)
    ).toEqual(expectedMatrixNumbers(uAfter));
  });

  it("uses structural MathML for the multiplier and binding row operation", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const elimination = view.querySelector<HTMLElement>(
      "[data-trace-kind='elimination']"
    )!;
    const multiplier = elimination.querySelector<HTMLElement>(
      "[data-native-math='elimination-multiplier']"
    )!;
    const rowOperation = elimination.querySelector<HTMLElement>(
      "[data-native-math='row-operation']"
    )!;

    expect(multiplier.querySelectorAll("mfrac").length).toBeGreaterThanOrEqual(2);
    expect(multiplier.querySelectorAll("msub").length).toBeGreaterThanOrEqual(3);
    expect(rowOperation.getAttribute("aria-label")).toMatch(
      /row 2 minus .* times row 1 produces updated row 2/
    );
    expect(rowOperation.textContent).toContain("→");
  });

  it("keeps pivot candidates subordinate and the safeguard out of the main success sequence", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, {
      headingLevel: 3,
      result,
    });
    const phases = [
      ...view.querySelectorAll<HTMLElement>("[data-walkthrough-phase]"),
    ];
    const candidateDetails = view.querySelector<HTMLDetailsElement>(
      "[data-trace-kind='pivot_selection'] details"
    )!;

    expect(phases[0]?.dataset.walkthroughPhase).toBe("start");
    expect(candidateDetails.open).toBe(false);
    expect(candidateDetails.querySelector("summary")?.textContent).toBe(
      "Show pivot candidates"
    );
    expect(view.querySelector("[data-trace-kind='matrix_scale']")).toBeNull();
    expect(view.textContent).not.toContain("Number.EPSILON");
  });

  it("shows factor completion, every stored substitution chain, and final x hat", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, {
      headingLevel: 3,
      result,
    });
    const substitutionSteps = result.trace.steps.filter(
      (step): step is Extract<
        (typeof result.trace.steps)[number],
        { kind: "forward_substitution" | "backward_substitution" }
      > =>
        step.kind === "forward_substitution" ||
        step.kind === "backward_substitution"
    );
    const cards = [
      ...view.querySelectorAll<HTMLElement>(
        "[data-trace-kind='forward_substitution'], [data-trace-kind='backward_substitution']"
      ),
    ];

    expect(
      view.querySelector(
        "[data-trace-kind='factorization_complete'] [data-native-math='factorization-relation']"
      )
    ).not.toBeNull();
    expect(cards).toHaveLength(substitutionSteps.length);
    cards.forEach((card, index) => {
      const step = substitutionSteps[index]!;
      const contributionOrder = [
        ...card.querySelectorAll<HTMLElement>("[data-contribution-column]"),
      ].map((node) => Number(node.dataset.contributionColumn));
      expect(contributionOrder).toEqual(
        step.contributions.map((contribution) => contribution.column)
      );
      expect(
        card
          .querySelector("[data-native-math='substitution-numerator'] [data-math-number]")
          ?.getAttribute("data-display-value")
      ).toBe(formatLinearSystemsNumber(step.numeratorBeforeDivision, "detail"));
      expect(card.querySelector("mfrac")).not.toBeNull();
    });
    const finalSolution = view.querySelector<HTMLElement>(
      ".ls-walkthrough-final-solution [data-native-math='computed-solution']"
    )!;
    expect(finalSolution.querySelector("mover")).not.toBeNull();
    expect(finalSolution.querySelector("mtable")).not.toBeNull();
    expect(renderedNumbers(finalSolution)).toEqual(
      result.xHat.map((value) => formatLinearSystemsNumber(value, "solution"))
    );
  });

  it("shows optional stored substitution aggregates only inside arithmetic detail", () => {
    const result = solvePreset("starter_3x3");
    const step = result.trace.steps.find(
      (item) =>
        item.kind === "forward_substitution" &&
        item.accumulatedKnownTermSum !== undefined
    );
    expect(step?.kind).toBe("forward_substitution");
    if (step?.kind !== "forward_substitution") return;
    const view = createComputationWalkthrough(result.trace, { headingLevel: 3 });
    const card = [
      ...view.querySelectorAll<HTMLElement>(
        "[data-trace-kind='forward_substitution']"
      ),
    ].find((candidate) => candidate.dataset.substitutionRow === String(step.row))!;

    expect(
      card.querySelector("details [data-accumulated-known-term-sum]")
    ).not.toBeNull();
    expect(
      card.querySelector(":scope > [data-accumulated-known-term-sum]")
    ).toBeNull();

    const traceWithoutAggregate = {
      ...result.trace,
      steps: result.trace.steps.map((item) => {
        if (item !== step) return item;
        const { accumulatedKnownTermSum: _omitted, ...rest } = item;
        return rest;
      }),
    };
    const without = createComputationWalkthrough(traceWithoutAggregate, {
      headingLevel: 3,
    });
    const withoutCard = [
      ...without.querySelectorAll<HTMLElement>(
        "[data-trace-kind='forward_substitution']"
      ),
    ].find((candidate) => candidate.dataset.substitutionRow === String(step.row))!;
    expect(
      withoutCard.querySelector("[data-accumulated-known-term-sum]")
    ).toBeNull();
  });

  it("uses one accessible owner for each visual MathML formula", () => {
    const result = solvePreset("starter_3x3");
    const view = createComputationWalkthrough(result.trace, {
      headingLevel: 3,
      result,
    });

    for (const formula of view.querySelectorAll<HTMLElement>("[role='math']")) {
      expect(formula.getAttribute("aria-label")).toBeTruthy();
      const visual = formula.querySelector<MathMLElement>(":scope > math");
      expect(visual?.getAttribute("aria-hidden")).toBe("true");
      expect(formula.querySelectorAll("[aria-label]")).toHaveLength(0);
    }
  });

  it("renders residual evidence and keeps preset comparison conditional", () => {
    const preset = solvePreset("starter_3x3");
    const presetView = createComputationWalkthrough(preset.trace, {
      headingLevel: 3,
      result: preset,
    });
    const residual = presetView.querySelector<HTMLElement>(
      "[data-trace-kind='residual_check']"
    )!;
    expect(residual.querySelector("[data-native-math='matrix-vector-result'] mtable")).not.toBeNull();
    expect(residual.querySelector("[data-native-math='residual-vector'] mtable")).not.toBeNull();
    expect(residual.querySelector("[data-native-math='residual-inf-norm'] msub")).not.toBeNull();
    expect(
      presetView.querySelector("[data-trace-kind='preset_reference_difference']")
    ).not.toBeNull();

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
      result: custom.result,
    });
    expect(
      customView.querySelector("[data-trace-kind='preset_reference_difference']")
    ).toBeNull();
  });

  it("shows only controlled computation evidence through a pivot rejection", () => {
    const failure = solveLinearSystem({
      A: [
        [1, 1],
        [2, 2],
      ],
      b: [2, 4],
    });
    expect(failure.ok).toBe(false);
    if (failure.ok || !failure.error.trace) return;
    const view = createComputationWalkthrough(failure.error.trace, {
      headingLevel: 4,
    });
    const rejected = view.querySelector<HTMLElement>(
      "[data-trace-kind='pivot_selection'] .ls-evidence-stop"
    )!;

    expect(view.querySelector(":scope > h4")?.textContent).toBe(
      "Computation before failure"
    );
    expect(rejected.textContent).toContain("computation stopped");
    expect(rejected.textContent).toContain("does not by itself");
    expect(view.querySelector("[data-trace-kind='factorization_complete']")).toBeNull();
    expect(view.querySelector("[data-trace-kind='backward_substitution']")).toBeNull();
  });

  it("represents bounded omission and unbounded continuation without inventing a final step", () => {
    const finite = createTraceRetentionNotice({
      processKind: "repetitive_finite",
      retentionPolicy: "first_five_plus_final_when_distinct",
      retainedStepCount: 6,
      totalMeaningfulStepCount: 25,
      omittedMiddleWork: true,
      finalStepRetained: true,
    });
    const unbounded = createTraceRetentionNotice({
      processKind: "unbounded",
      retentionPolicy: "first_five_plus_continuation",
      retainedStepCount: 5,
      omittedMiddleWork: true,
      finalStepRetained: false,
      continuation: { recurrence: "structured" },
    });

    expect(finite?.textContent).toContain("6 of 25");
    expect(finite?.textContent).toContain("final evidence is included");
    expect(unbounded?.dataset.traceContinuation).toBe("present");
    expect(unbounded?.textContent).toContain(
      "not represented as having a final step"
    );
  });
});
