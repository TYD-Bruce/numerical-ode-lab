import type {
  LinearSystemComputationTrace,
  LinearSystemTraceStep,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import type { ComputationTrace } from "@numerical-t-lab/numerics/trace/computation-trace";

type TraceRetentionMetadata = Pick<
  ComputationTrace<object, object>,
  | "processKind"
  | "retentionPolicy"
  | "retainedStepCount"
  | "omittedMiddleWork"
  | "finalStepRetained"
> & {
  readonly totalMeaningfulStepCount?: number;
  readonly continuation?: object;
};

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function formatLinearSystemsNumber(value: number): string {
  if (Object.is(value, -0) || value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 1e6 || magnitude < 1e-5) {
    return value.toExponential(6).replace(/\.0+(?=e)/, "");
  }
  return Number(value.toPrecision(9)).toString();
}

export function createNumericMatrixTable(
  label: string,
  matrix: readonly (readonly number[])[],
  visibleLabel?: string
): HTMLElement {
  const region = element("div", undefined, "ls-matrix-region");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", label);
  region.tabIndex = 0;
  if (visibleLabel) {
    region.append(element("p", visibleLabel, "ls-matrix-visible-label"));
  }
  const table = element("table", undefined, "ls-numeric-matrix");
  const caption = element("caption", label, "sr-only");
  const body = document.createElement("tbody");
  matrix.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = formatLinearSystemsNumber(value);
      tr.append(td);
    });
    body.append(tr);
  });
  table.append(caption, body);
  region.append(table);
  return region;
}

function createArithmeticDetails(content: HTMLElement): HTMLDetailsElement {
  const details = element("details", undefined, "ls-arithmetic-details");
  const summary = element("summary", "Show arithmetic");
  details.append(summary, content);
  return details;
}

function createDataTable(
  label: string,
  headers: readonly string[],
  rows: readonly (readonly string[])[]
): HTMLElement {
  const region = element("div", undefined, "ls-table-region");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", label);
  region.tabIndex = 0;
  const table = element("table", undefined, "ls-evidence-table");
  const caption = element("caption", label, "sr-only");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = header;
    headRow.append(th);
  });
  head.append(headRow);
  const body = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((value, index) => {
      const cell = index === 0 ? document.createElement("th") : document.createElement("td");
      if (cell instanceof HTMLTableCellElement && index === 0) cell.scope = "row";
      cell.textContent = value;
      tr.append(cell);
    });
    body.append(tr);
  });
  table.append(caption, head, body);
  region.append(table);
  return region;
}

export function createTraceRetentionNotice(
  trace: TraceRetentionMetadata
): HTMLElement | undefined {
  if (!trace.omittedMiddleWork) return undefined;
  const notice = element("aside", undefined, "ls-trace-retention");
  notice.dataset.traceRetention = trace.retentionPolicy;
  if (trace.processKind === "repetitive_finite") {
    const total = trace.totalMeaningfulStepCount;
    notice.textContent =
      `This walkthrough retains ${trace.retainedStepCount}` +
      (total === undefined ? "" : ` of ${total}`) +
      " meaningful steps. Middle work was omitted by the computation's retention policy" +
      (trace.finalStepRetained ? "; distinct final evidence is included." : ".");
    return notice;
  }
  notice.textContent =
    `This process is not represented as having a final step. The first ${trace.retainedStepCount} sequential computations and structured continuation information are retained.`;
  notice.dataset.traceContinuation = "present";
  return notice;
}

function stepCard(step: LinearSystemTraceStep, title: string): HTMLElement {
  const card = element("article", undefined, "ls-computation-step");
  card.dataset.traceKind = step.kind;
  card.append(element("h4", title));
  return card;
}

function renderMatrixScale(
  step: Extract<LinearSystemTraceStep, { kind: "matrix_scale" }>
): HTMLElement {
  const card = stepCard(step, "Matrix scale and pivot threshold");
  card.append(
    element(
      "p",
      `The largest stored row absolute-sum is row ${step.selectedMaximumRow + 1}: ‖A‖∞ = ${formatLinearSystemsNumber(step.matrixInfNorm)}.`
    ),
    element(
      "p",
      `The Lab's pivot acceptance threshold is τpivot = ${formatLinearSystemsNumber(step.tauPivot)}.`
    )
  );
  const arithmetic = element("div");
  arithmetic.append(
    createDataTable(
      "Matrix infinity norm row sums",
      ["Row", "Stored absolute terms", "Absolute sum"],
      step.rows.map((row) => [
        String(row.row + 1),
        row.terms
          .map(
            (term) =>
              `|${formatLinearSystemsNumber(term.value)}| = ${formatLinearSystemsNumber(term.absoluteValue)}`
          )
          .join(" + "),
        formatLinearSystemsNumber(row.absoluteSum),
      ])
    ),
    element(
      "p",
      `τpivot = ${formatLinearSystemsNumber(step.pivotUlpFactor)} × ${formatLinearSystemsNumber(step.numberEpsilon)} × ${formatLinearSystemsNumber(step.matrixInfNorm)} = ${formatLinearSystemsNumber(step.tauPivot)}`,
      "ls-formula-line"
    )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderPivotSelection(
  step: Extract<LinearSystemTraceStep, { kind: "pivot_selection" }>
): HTMLElement {
  const card = stepCard(step, `Choose the pivot in column ${step.column + 1}`);
  card.append(
    element(
      "p",
      `Row ${step.selectedRow + 1} is the first candidate with the largest absolute magnitude, ${formatLinearSystemsNumber(step.selectedAbsoluteMagnitude)}.`
    ),
    createDataTable(
      `Pivot candidates for column ${step.column + 1}`,
      ["Candidate row", "Stored value", "Absolute magnitude"],
      step.candidates.map((candidate) => [
        String(candidate.row + 1),
        formatLinearSystemsNumber(candidate.value),
        formatLinearSystemsNumber(candidate.absoluteValue),
      ])
    ),
    element(
      "p",
      step.accepted
        ? `${formatLinearSystemsNumber(step.selectedAbsoluteMagnitude)} is greater than τpivot = ${formatLinearSystemsNumber(step.tauPivot)}, so elimination continues.`
        : `${formatLinearSystemsNumber(step.selectedAbsoluteMagnitude)} is not greater than τpivot = ${formatLinearSystemsNumber(step.tauPivot)}, so computation stops here.`,
      step.accepted ? "ls-evidence-ok" : "ls-evidence-stop"
    )
  );
  return card;
}

function renderRowSwap(
  step: Extract<LinearSystemTraceStep, { kind: "row_swap" }>
): HTMLElement {
  const card = stepCard(
    step,
    `Swap row ${step.firstRow + 1} and row ${step.secondRow + 1}`
  );
  card.append(
    element(
      "p",
      `The same exchange is applied to U and P. Previously computed entries of L are exchanged only in columns before column ${step.column + 1}.`
    )
  );
  const state = element("div", undefined, "ls-row-state-grid");
  state.append(
    createNumericMatrixTable(
      "U rows before the exchange",
      step.uRowsBefore.map((row) => row.values),
      "U rows before"
    ),
    createNumericMatrixTable(
      "U rows after the exchange",
      step.uRowsAfter.map((row) => row.values),
      "U rows after"
    )
  );
  card.append(state);
  const arithmetic = element("div");
  arithmetic.append(
    createDataTable(
      "Permutation before and after the row exchange",
      ["State", "Permutation, shown with learner row numbers"],
      [
        ["Before", step.permutationBefore.map((value) => value + 1).join(", ")],
        ["After", step.permutationAfter.map((value) => value + 1).join(", ")],
      ]
    )
  );
  if (step.lPriorColumnsBefore.some((row) => row.entries.length > 0)) {
    arithmetic.append(
      createDataTable(
        "Previously computed L entries moved by the exchange",
        ["State", "Row", "Stored entries"],
        [
          ...step.lPriorColumnsBefore.map((row) => [
            "Before",
            String(row.row + 1),
            row.entries
              .map(
                (entry) =>
                  `L(${row.row + 1}, ${entry.column + 1}) = ${formatLinearSystemsNumber(entry.value)}`
              )
              .join(", "),
          ]),
          ...step.lPriorColumnsAfter.map((row) => [
            "After",
            String(row.row + 1),
            row.entries
              .map(
                (entry) =>
                  `L(${row.row + 1}, ${entry.column + 1}) = ${formatLinearSystemsNumber(entry.value)}`
              )
              .join(", "),
          ]),
        ]
      )
    );
  }
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderElimination(
  step: Extract<LinearSystemTraceStep, { kind: "elimination" }>
): HTMLElement {
  const card = stepCard(step, `Eliminate row ${step.targetRow + 1}`);
  card.append(
    element(
      "p",
      `Multiplier m(${step.targetRow + 1}, ${step.column + 1}) = ${formatLinearSystemsNumber(step.multiplier)}.`
    ),
    element(
      "p",
      `R${step.targetRow + 1} ← R${step.targetRow + 1} − m(${step.targetRow + 1}, ${step.column + 1}) R${step.pivotRow + 1}`,
      "ls-formula-line"
    ),
    createNumericMatrixTable(
      `Updated U row ${step.targetRow + 1}`,
      [step.targetRowAfter]
    )
  );
  const arithmetic = element("div");
  arithmetic.append(
    element(
      "p",
      `${formatLinearSystemsNumber(step.targetColumnValueBefore)} ÷ ${formatLinearSystemsNumber(step.pivotValue)} = ${formatLinearSystemsNumber(step.multiplier)}`,
      "ls-formula-line"
    ),
    createDataTable(
      `Stored row evidence for eliminating row ${step.targetRow + 1}`,
      ["Evidence", ...step.targetRowBefore.map((_, index) => `Column ${index + 1}`)],
      [
        ["Target before", ...step.targetRowBefore.map(formatLinearSystemsNumber)],
        ["Pivot row used", ...step.pivotRowUsed.map(formatLinearSystemsNumber)],
        ["Target after", ...step.targetRowAfter.map(formatLinearSystemsNumber)],
      ]
    )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderFactorizationComplete(
  step: Extract<LinearSystemTraceStep, { kind: "factorization_complete" }>
): HTMLElement {
  const card = stepCard(step, "Factorization complete");
  card.append(
    element("p", "The stored factors now represent the public relation P A = L U."),
    element(
      "p",
      `Permutation order: ${step.permutation.map((row) => row + 1).join(", ")}.`,
      "ls-muted"
    )
  );
  const arithmetic = element("div", undefined, "ls-factor-grid");
  arithmetic.append(
    createNumericMatrixTable("Permutation matrix P", step.P, "P"),
    createNumericMatrixTable("Lower triangular matrix L", step.L, "L"),
    createNumericMatrixTable("Upper triangular matrix U", step.U, "U")
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderSubstitution(
  step:
    | Extract<LinearSystemTraceStep, { kind: "forward_substitution" }>
    | Extract<LinearSystemTraceStep, { kind: "backward_substitution" }>
): HTMLElement {
  const forward = step.kind === "forward_substitution";
  const symbol = forward ? "y" : "x̂";
  const result = forward ? step.resultingY : step.resultingXHat;
  const card = stepCard(
    step,
    `${forward ? "Solve forward for" : "Solve backward for"} ${symbol}${step.row + 1}`
  );
  card.append(
    element(
      "p",
      `${symbol}${step.row + 1} = ${formatLinearSystemsNumber(result)} using diagonal value ${formatLinearSystemsNumber(step.diagonalValue)}.`
    )
  );
  const arithmetic = element("div");
  arithmetic.append(
    createDataTable(
      `${forward ? "Forward" : "Backward"} substitution contributions for row ${step.row + 1}`,
      ["Known component", "Coefficient", "Known value", "Product", "Accumulator after subtraction"],
      step.contributions.map((contribution) => [
        String(contribution.column + 1),
        formatLinearSystemsNumber(contribution.coefficient),
        formatLinearSystemsNumber(contribution.knownValue),
        formatLinearSystemsNumber(contribution.product),
        formatLinearSystemsNumber(contribution.accumulatorAfterSubtraction),
      ])
    ),
    element(
      "p",
      `Numerator ${formatLinearSystemsNumber(step.numeratorBeforeDivision)} ÷ diagonal ${formatLinearSystemsNumber(step.diagonalValue)} = ${formatLinearSystemsNumber(result)}`,
      "ls-formula-line"
    )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderResidualComponent(
  step: Extract<LinearSystemTraceStep, { kind: "residual_component" }>
): HTMLElement {
  const card = stepCard(step, `Check residual component ${step.row + 1}`);
  card.append(
    element(
      "p",
      `(A x̂)${step.row + 1} = ${formatLinearSystemsNumber(step.matrixVectorValue)}, then r${step.row + 1} = ${formatLinearSystemsNumber(step.originalBValue)} − ${formatLinearSystemsNumber(step.matrixVectorValue)} = ${formatLinearSystemsNumber(step.residualComponent)}.`
    )
  );
  card.append(
    createArithmeticDetails(
      createDataTable(
        `Residual products for row ${step.row + 1}`,
        ["Column", "A coefficient", "x̂ value", "Product", "Accumulated A x̂"],
        step.terms.map((term) => [
          String(term.column + 1),
          formatLinearSystemsNumber(term.coefficient),
          formatLinearSystemsNumber(term.solutionValue),
          formatLinearSystemsNumber(term.product),
          formatLinearSystemsNumber(term.accumulatedMatrixVectorValue),
        ])
      )
    )
  );
  return card;
}

function renderResidualNorm(
  step: Extract<LinearSystemTraceStep, { kind: "residual_inf_norm" }>
): HTMLElement {
  const card = stepCard(step, "Take the residual infinity norm");
  card.append(
    element(
      "p",
      `The largest absolute residual component is row ${step.selectedMaximumRow + 1}, so ‖r‖∞ = ${formatLinearSystemsNumber(step.residualInfNorm)}.`
    ),
    createDataTable(
      "Residual infinity norm components",
      ["Row", "Residual", "Absolute value"],
      step.components.map((component) => [
        String(component.row + 1),
        formatLinearSystemsNumber(component.value),
        formatLinearSystemsNumber(component.absoluteValue),
      ])
    )
  );
  return card;
}

function renderPresetReference(
  step: Extract<LinearSystemTraceStep, { kind: "preset_reference_difference" }>
): HTMLElement {
  const card = stepCard(step, "Compare with the preset reference solution");
  card.append(
    element(
      "p",
      `Difference from preset reference solution: ${formatLinearSystemsNumber(step.referenceDifferenceInf)}. The largest stored component difference occurs at index ${step.selectedMaximumIndex + 1}.`
    )
  );
  card.append(
    createArithmeticDetails(
      createDataTable(
        "Preset reference component differences",
        ["Component", "Computed x̂", "Preset reference", "Difference", "Absolute difference"],
        step.components.map((component) => [
          String(component.index + 1),
          formatLinearSystemsNumber(component.computedValue),
          formatLinearSystemsNumber(component.referenceValue),
          formatLinearSystemsNumber(component.difference),
          formatLinearSystemsNumber(component.absoluteDifference),
        ])
      )
    )
  );
  return card;
}

function phase(
  title: string,
  description: string,
  steps: readonly LinearSystemTraceStep[]
): HTMLElement | undefined {
  if (steps.length === 0) return undefined;
  const section = element("section", undefined, "ls-walkthrough-phase");
  section.append(element("h3", title), element("p", description, "ls-muted"));
  for (const step of steps) {
    if (step.kind === "matrix_scale") section.append(renderMatrixScale(step));
    if (step.kind === "pivot_selection") section.append(renderPivotSelection(step));
    if (step.kind === "row_swap") section.append(renderRowSwap(step));
    if (step.kind === "elimination") section.append(renderElimination(step));
    if (step.kind === "factorization_complete") {
      section.append(renderFactorizationComplete(step));
    }
    if (step.kind === "forward_substitution") section.append(renderSubstitution(step));
    if (step.kind === "backward_substitution") section.append(renderSubstitution(step));
    if (step.kind === "residual_component") section.append(renderResidualComponent(step));
    if (step.kind === "residual_inf_norm") section.append(renderResidualNorm(step));
    if (step.kind === "preset_reference_difference") {
      section.append(renderPresetReference(step));
    }
  }
  return section;
}

export function createComputationWalkthrough(
  trace: LinearSystemComputationTrace
): HTMLElement {
  const walkthrough = element("div", undefined, "ls-computation-walkthrough");
  walkthrough.dataset.computationWalkthrough = "true";
  walkthrough.append(
    element("h2", "Computation walkthrough"),
    element(
      "p",
      "These steps present the structured evidence emitted by the numerical computation. The presentation does not rerun the solver.",
      "ls-walkthrough-intro"
    )
  );
  const retention = createTraceRetentionNotice(trace);
  if (retention) walkthrough.append(retention);

  const factorizationKinds = new Set([
    "pivot_selection",
    "row_swap",
    "elimination",
    "factorization_complete",
  ]);
  const sections = [
    phase(
      "1. Matrix scale and pivot threshold",
      "The original matrix sets the scale used by the Lab's engineering safeguard.",
      trace.steps.filter((step) => step.kind === "matrix_scale")
    ),
    phase(
      "2. Factorization and elimination",
      "Pivot decisions, row exchanges, and eliminations build P A = L U in recorded order.",
      trace.steps.filter((step) => factorizationKinds.has(step.kind))
    ),
    phase(
      "3. Forward substitution",
      "Solve L y = P b from the first row to the last.",
      trace.steps.filter((step) => step.kind === "forward_substitution")
    ),
    phase(
      "4. Backward substitution",
      "Solve U x̂ = y from the last row to the first.",
      trace.steps.filter((step) => step.kind === "backward_substitution")
    ),
    phase(
      "5. Residual check",
      "Use the original A and b to form r = b − A x̂ and its infinity norm.",
      trace.steps.filter(
        (step) =>
          step.kind === "residual_component" || step.kind === "residual_inf_norm"
      )
    ),
    phase(
      "6. Preset reference comparison",
      "This qualified comparison appears only for an authoritative preset fingerprint.",
      trace.steps.filter((step) => step.kind === "preset_reference_difference")
    ),
  ].filter((section): section is HTMLElement => section !== undefined);
  walkthrough.append(...sections);
  return walkthrough;
}
