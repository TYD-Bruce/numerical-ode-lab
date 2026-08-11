import type {
  LinearSystemComputationTrace,
  LinearSystemTraceStep,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import type { ComputationTrace } from "@numerical-t-lab/numerics/trace/computation-trace";
import {
  createMathNumber,
  createStructuredMath,
  formatMathNumber,
  subscript,
  type MathNumberContext,
  type StructuredMathContent,
  type StructuredMathPart,
} from "../../math/structuredMath";
import {
  createEliminationReplayMotion,
  createRowSwapReplayMotion,
} from "./computationMotion";

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

type HeadingLevel = 3 | 4 | 5 | 6;

export interface ComputationWalkthroughOptions {
  readonly headingLevel: 3 | 4;
}

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

function heading(level: HeadingLevel, text: string): HTMLHeadingElement {
  if (level === 3) return element("h3", text);
  if (level === 4) return element("h4", text);
  if (level === 5) return element("h5", text);
  return element("h6", text);
}

type CellContent = string | Node;

function appendContent(target: Node, content: CellContent): void {
  target.appendChild(
    typeof content === "string" ? document.createTextNode(content) : content
  );
}

function math(
  content: StructuredMathContent,
  accessibleText: string,
  dataMath: string,
  className = "ls-inline-math"
): HTMLElement {
  return createStructuredMath(content, accessibleText, { className, dataMath });
}

function number(value: number, context: MathNumberContext): HTMLElement {
  return createMathNumber(value, context);
}

function numberParts(
  value: number,
  context: MathNumberContext
): readonly StructuredMathPart[] {
  return formatMathNumber(value, context).parts;
}

function numberSpeech(value: number, context: MathNumberContext): string {
  return formatMathNumber(value, context).accessibleText;
}

function markDisplayedValue(
  node: HTMLElement,
  value: number,
  context: MathNumberContext
): HTMLElement {
  node.dataset.displayValue = formatLinearSystemsNumber(value, context);
  node.dataset.displayValueContext = context;
  return node;
}

function indexed(
  symbol: string,
  ...indices: number[]
): readonly StructuredMathPart[] {
  return [subscript(symbol, indices.map((index) => index + 1).join(""))];
}

export function formatLinearSystemsNumber(
  value: number,
  context: MathNumberContext = "ordinary"
): string {
  return formatMathNumber(value, context).text;
}

export function createNumericMatrixTable(
  label: string,
  matrix: readonly (readonly number[])[],
  visibleLabel?: CellContent,
  numberContext: MathNumberContext = "matrix"
): HTMLElement {
  const region = element("div", undefined, "ls-matrix-region");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", label);
  region.tabIndex = 0;
  if (visibleLabel) {
    const visible = element("p", undefined, "ls-matrix-visible-label");
    appendContent(visible, visibleLabel);
    region.append(visible);
  }
  const table = element("table", undefined, "ls-numeric-matrix");
  const body = document.createElement("tbody");
  matrix.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((value) => {
      const td = document.createElement("td");
      td.append(number(value, numberContext));
      tr.append(td);
    });
    body.append(tr);
  });
  table.append(body);
  region.append(table);
  return region;
}

function createArithmeticDetails(content: HTMLElement): HTMLDetailsElement {
  const details = element("details", undefined, "ls-arithmetic-details");
  const summary = element("summary", "Show arithmetic");
  details.append(summary, content);
  return details;
}

function paragraph(
  contents: readonly CellContent[],
  className?: string
): HTMLParagraphElement {
  const node = element("p", undefined, className);
  contents.forEach((content) => appendContent(node, content));
  return node;
}

function joinedNumbers(
  values: readonly number[],
  separator: string,
  context: MathNumberContext
): HTMLElement {
  const group = element("span", undefined, "ls-number-expression");
  values.forEach((value, index) => {
    if (index > 0) group.append(document.createTextNode(separator));
    group.append(number(value, context));
  });
  return group;
}

function createDataTable(
  label: string,
  headers: readonly string[],
  rows: readonly (readonly CellContent[])[],
  selectedRowIndex?: number
): HTMLElement {
  const region = element("div", undefined, "ls-table-region");
  region.setAttribute("role", "region");
  region.setAttribute("aria-label", label);
  region.tabIndex = 0;
  const table = element("table", undefined, "ls-evidence-table");
  if (headers.length > 3) table.classList.add("ls-evidence-table-stacked");
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
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    if (rowIndex === selectedRowIndex) {
      tr.dataset.pivotSelected = "true";
      tr.setAttribute("aria-current", "true");
    }
    row.forEach((value, index) => {
      const cell = index === 0 ? document.createElement("th") : document.createElement("td");
      if (cell instanceof HTMLTableCellElement && index === 0) cell.scope = "row";
      cell.dataset.label = headers[index] ?? "Value";
      appendContent(cell, value);
      tr.append(cell);
    });
    body.append(tr);
  });
  table.append(head, body);
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

function stepCard(
  step: LinearSystemTraceStep,
  title: string,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = element("article", undefined, "ls-computation-step");
  card.dataset.traceKind = step.kind;
  card.append(heading(headingLevel, title));
  return card;
}

type ComputationMarkerState =
  | "selected"
  | "source"
  | "target"
  | "changed"
  | "solved"
  | "maximum";

function computationMarker(
  label: string,
  state: ComputationMarkerState
): HTMLSpanElement {
  const marker = element(
    "span",
    label,
    `computation-marker is-${state}`
  );
  marker.dataset.computationMarker = state;
  return marker;
}

function replayControl(kind: "row_swap" | "elimination", label: string): HTMLButtonElement {
  const control = element("button", "Replay step", "ls-button ls-button-ghost ls-replay-step");
  control.type = "button";
  control.dataset.replayComputationStep = kind;
  control.setAttribute("aria-label", label);
  return control;
}

function motionRow(
  label: string,
  values: readonly number[],
  state: "source" | "target" | "changed",
  cellEvidence = false,
  changedIndices: ReadonlySet<number> = new Set()
): HTMLElement {
  const row = element("div", undefined, `ls-motion-row computation-marker is-${state}`);
  row.dataset.motionRow = state;
  row.dataset.motionValues = values.join(",");
  row.append(element("strong", label, "ls-motion-row-label"));
  const cells = element("span", undefined, "ls-motion-cells");
  values.forEach((value, index) => {
    const cell = element(
      "span",
      formatLinearSystemsNumber(value, "detail"),
      "ls-motion-cell"
    );
    if (cellEvidence) cell.dataset.motionCell = "true";
    if (changedIndices.has(index)) cell.classList.add("is-changed");
    cells.append(cell);
  });
  row.append(cells);
  return row;
}

function renderMatrixScale(
  step: Extract<LinearSystemTraceStep, { kind: "matrix_scale" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Matrix scale and pivot threshold", headingLevel);
  const matrixNorm = math(
    [subscript("‖A‖", "∞"), " ≈ ", ...numberParts(step.matrixInfNorm, "ordinary")],
    `the infinity norm of A is approximately ${numberSpeech(step.matrixInfNorm, "ordinary")}`,
    "matrix-inf-norm"
  );
  const tauPivot = markDisplayedValue(
    math(
      [subscript("τ", "pivot"), " ≈ ", ...numberParts(step.tauPivot, "threshold")],
      `tau pivot, the pivot acceptance threshold, is approximately ${numberSpeech(step.tauPivot, "threshold")}`,
      "tau-pivot"
    ),
    step.tauPivot,
    "threshold"
  );
  card.append(
    paragraph([
      `Row ${step.selectedMaximumRow + 1} has the largest absolute row sum, so `,
      matrixNorm,
      ".",
    ]),
    paragraph(["The Lab scales its pivot safeguard to this matrix: ", tauPivot, "."])
  );
  const arithmetic = element("div");
  const thresholdFormulas = element("div", undefined, "ls-contained-math");
  thresholdFormulas.append(
    math(
      [
        subscript("τ", "pivot"),
        " = 64 × Number.EPSILON × ",
        subscript("‖A‖", "∞"),
      ],
      "tau pivot equals 64 times Number epsilon times the infinity norm of A",
      "tau-pivot-definition",
      "ls-formula-line"
    ),
    math(
      [
        subscript("τ", "pivot"),
        " ≈ ",
        ...numberParts(step.pivotUlpFactor, "detail"),
        " × ",
        ...numberParts(step.numberEpsilon, "detail"),
        " × ",
        ...numberParts(step.matrixInfNorm, "detail"),
        " ≈ ",
        ...numberParts(step.tauPivot, "threshold"),
      ],
      `tau pivot is approximately ${numberSpeech(step.pivotUlpFactor, "detail")} times Number epsilon, ${numberSpeech(step.numberEpsilon, "detail")}, times the matrix infinity norm, ${numberSpeech(step.matrixInfNorm, "detail")}, which is approximately ${numberSpeech(step.tauPivot, "threshold")}`,
      "tau-pivot-calculation",
      "ls-formula-line"
    )
  );
  arithmetic.append(
    createDataTable(
      "Matrix infinity norm row sums",
      ["Row", "Absolute terms", "Absolute sum"],
      step.rows.map((row) => [
        String(row.row + 1),
        joinedNumbers(
          row.terms.map((term) => term.absoluteValue),
          " + ",
          "detail"
        ),
        number(row.absoluteSum, "detail"),
      ])
    ),
    thresholdFormulas
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderPivotSelection(
  step: Extract<LinearSystemTraceStep, { kind: "pivot_selection" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Choose the pivot in column ${step.column + 1}`,
    headingLevel
  );
  const selectedCandidateIndex = step.candidates.findIndex(
    (candidate) => candidate.row === step.selectedRow
  );
  const selectedEntry = math(
    [
      ...indexed("U", step.selectedRow, step.column),
      " ≈ ",
      ...numberParts(step.selectedPivotValue, "detail"),
    ],
    `U sub ${step.selectedRow + 1} ${step.column + 1} is approximately ${numberSpeech(step.selectedPivotValue, "detail")}`,
    "matrix-entry"
  );
  const thresholdComparison = math(
    [
      ...numberParts(step.selectedAbsoluteMagnitude, "detail"),
      step.accepted ? " > " : " ≤ ",
      subscript("τ", "pivot"),
      " ≈ ",
      ...numberParts(step.tauPivot, "threshold"),
    ],
    `${numberSpeech(step.selectedAbsoluteMagnitude, "detail")} is ${step.accepted ? "greater than" : "less than or equal to"} tau pivot, approximately ${numberSpeech(step.tauPivot, "threshold")}`,
    "pivot-threshold-comparison"
  );
  card.append(
    paragraph([
      `Row ${step.selectedRow + 1} is the first candidate with the largest magnitude. The selected entry is `,
      selectedEntry,
      ".",
    ]),
    paragraph(
      [
        thresholdComparison,
        step.accepted ? ", so elimination continues." : ", so computation stops here.",
      ],
      step.accepted ? "ls-evidence-ok" : "ls-evidence-stop"
    )
  );
  const arithmetic = element("div");
  arithmetic.append(
    createDataTable(
      `Pivot candidates for column ${step.column + 1}`,
      ["Candidate row", "Candidate entry", "Absolute magnitude", "Status"],
      step.candidates.map((candidate) => [
        String(candidate.row + 1),
        math(
          [
            ...indexed("U", candidate.row, step.column),
            " ≈ ",
            ...numberParts(candidate.value, "detail"),
          ],
          `U sub ${candidate.row + 1} ${step.column + 1} is approximately ${numberSpeech(candidate.value, "detail")}`,
          "matrix-entry"
        ),
        number(candidate.absoluteValue, "detail"),
        candidate.row === step.selectedRow ? "Selected" : "Candidate",
      ]),
      selectedCandidateIndex
    )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderRowSwap(
  step: Extract<LinearSystemTraceStep, { kind: "row_swap" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Row swap: rows ${step.firstRow + 1} and ${step.secondRow + 1}`,
    headingLevel
  );
  card.append(
    math(
      [subscript("R", String(step.firstRow + 1)), " ↔ ", subscript("R", String(step.secondRow + 1))],
      `row ${step.firstRow + 1} swaps with row ${step.secondRow + 1}`,
      "row-operation",
      "ls-formula-line"
    ),
    element(
      "p",
      `The row swap is applied to U and P. Earlier multipliers in L move with their rows only in columns before column ${step.column + 1}.`
    )
  );
  const roleLine = element("div", undefined, "ls-computation-markers");
  roleLine.append(
    computationMarker(`Swap row R${step.firstRow + 1}`, "source"),
    computationMarker(`Swap row R${step.secondRow + 1}`, "target")
  );
  const replay = replayControl(
    "row_swap",
    `Replay row swap for rows ${step.firstRow + 1} and ${step.secondRow + 1}`
  );
  const stage = element("div", undefined, "ls-motion-stage ls-row-swap-motion");
  stage.dataset.motionStage = "row_swap";
  stage.hidden = true;
  stage.setAttribute("aria-hidden", "true");
  card.append(roleLine, replay, stage);
  createRowSwapReplayMotion({
    owner: card,
    control: replay,
    stage,
    renderBefore: () => {
      const rows = step.uRowsBefore.map((row) =>
        motionRow(`Source R${row.row + 1}`, row.values, "source")
      );
      stage.replaceChildren(...rows);
      return rows;
    },
    renderAfter: () => {
      stage.replaceChildren();
      if (
        stage.dataset.motionMode === "reduced" ||
        stage.dataset.motionMode === "compact"
      ) {
        const before = element("div", undefined, "ls-motion-static-state");
        before.append(computationMarker("Before", "source"));
        step.uRowsBefore.forEach((row) => {
          const rendered = motionRow(
            `Source R${row.row + 1}`,
            row.values,
            "source"
          );
          delete rendered.dataset.motionRow;
          rendered.dataset.motionStaticRow = "before";
          before.append(rendered);
        });
        stage.append(
          before,
          computationMarker(
            `R${step.firstRow + 1} ↔ R${step.secondRow + 1}`,
            "selected"
          ),
          computationMarker("After", "changed")
        );
      }
      stage.append(
        ...step.uRowsAfter.map((row) =>
          motionRow(`R${row.row + 1} after`, row.values, "changed")
        )
      );
      stage.append(computationMarker("Rows exchanged", "changed"));
    },
  });
  const arithmetic = element("div");
  const state = element("div", undefined, "ls-row-state-grid");
  state.append(
    createNumericMatrixTable(
      "U rows before the row swap",
      step.uRowsBefore.map((row) => row.values),
      "U rows before"
    ),
    createNumericMatrixTable(
      "U rows after the row swap",
      step.uRowsAfter.map((row) => row.values),
      "U rows after"
    )
  );
  arithmetic.append(
    state,
    createDataTable(
      "Permutation before and after the row swap",
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
        "Earlier L entries moved by the row swap",
        ["State", "Row", "L entries"],
        [
          ...step.lPriorColumnsBefore.map((row) => [
            "Before",
            String(row.row + 1),
            paragraph(
              row.entries.flatMap<CellContent>((entry, index) => [
                ...(index === 0 ? [] : [", "]),
                math(
                  [
                    ...indexed("L", row.row, entry.column),
                    " ≈ ",
                    ...numberParts(entry.value, "detail"),
                  ],
                  `L sub ${row.row + 1} ${entry.column + 1} is approximately ${numberSpeech(entry.value, "detail")}`,
                  "matrix-entry"
                ),
              ]),
              "ls-table-formula-group"
            ),
          ]),
          ...step.lPriorColumnsAfter.map((row) => [
            "After",
            String(row.row + 1),
            paragraph(
              row.entries.flatMap<CellContent>((entry, index) => [
                ...(index === 0 ? [] : [", "]),
                math(
                  [
                    ...indexed("L", row.row, entry.column),
                    " ≈ ",
                    ...numberParts(entry.value, "detail"),
                  ],
                  `L sub ${row.row + 1} ${entry.column + 1} is approximately ${numberSpeech(entry.value, "detail")}`,
                  "matrix-entry"
                ),
              ]),
              "ls-table-formula-group"
            ),
          ]),
        ]
      )
    );
  }
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderElimination(
  step: Extract<LinearSystemTraceStep, { kind: "elimination" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, `Eliminate row ${step.targetRow + 1}`, headingLevel);
  const multiplier = math(
    [
      ...indexed("m", step.targetRow, step.column),
      " = ",
      ...indexed("U", step.targetRow, step.column),
      " / ",
      ...indexed("U", step.pivotRow, step.column),
      " ≈ ",
      ...numberParts(step.multiplier, "multiplier"),
    ],
    `m sub ${step.targetRow + 1} ${step.column + 1}, the elimination multiplier, equals U sub ${step.targetRow + 1} ${step.column + 1} divided by U sub ${step.pivotRow + 1} ${step.column + 1}, approximately ${numberSpeech(step.multiplier, "multiplier")}`,
    "multiplier",
    "ls-formula-line"
  );
  const rowOperation = math(
    [
      subscript("R", String(step.targetRow + 1)),
      " ← ",
      subscript("R", String(step.targetRow + 1)),
      " − ",
      ...indexed("m", step.targetRow, step.column),
      subscript("R", String(step.pivotRow + 1)),
    ],
    `row ${step.targetRow + 1} becomes row ${step.targetRow + 1} minus m sub ${step.targetRow + 1} ${step.column + 1} times row ${step.pivotRow + 1}`,
    "row-operation",
    "ls-formula-line"
  );
  card.append(
    multiplier,
    rowOperation,
    createNumericMatrixTable(
      `Updated U row ${step.targetRow + 1}`,
      [step.targetRowAfter],
      `Updated row ${step.targetRow + 1}`
    )
  );
  const roleLine = element("div", undefined, "ls-computation-markers");
  roleLine.append(
    computationMarker(`Pivot row R${step.pivotRow + 1}`, "source"),
    computationMarker(`Target row R${step.targetRow + 1}`, "target")
  );
  const replay = replayControl(
    "elimination",
    `Replay elimination of row ${step.targetRow + 1} using pivot row ${step.pivotRow + 1}`
  );
  const stage = element("div", undefined, "ls-motion-stage ls-elimination-motion");
  stage.dataset.motionStage = "elimination";
  stage.hidden = true;
  stage.setAttribute("aria-hidden", "true");
  const renderMotionRows = (after: boolean): void => {
    const changedIndices = new Set<number>();
    if (after) {
      step.targetRowBefore.forEach((value, index) => {
        if (!Object.is(value, step.targetRowAfter[index])) changedIndices.add(index);
      });
    }
    const target = motionRow(
      after ? `Changed R${step.targetRow + 1}` : `Target R${step.targetRow + 1}`,
      after ? step.targetRowAfter : step.targetRowBefore,
      after ? "changed" : "target",
      true,
      changedIndices
    );
    target.dataset.motionRow = "target";
    stage.replaceChildren(
      motionRow(`Pivot R${step.pivotRow + 1}`, step.pivotRowUsed, "source"),
      computationMarker(
        `Apply R${step.targetRow + 1} ← R${step.targetRow + 1} − m R${step.pivotRow + 1}`,
        "selected"
      ),
      target
    );
    if (after) stage.append(computationMarker("Changed values", "changed"));
  };
  card.append(roleLine, replay, stage);
  createEliminationReplayMotion({
    owner: card,
    control: replay,
    stage,
    renderBefore: () => renderMotionRows(false),
    renderAfter: () => renderMotionRows(true),
  });
  const arithmetic = element("div");
  arithmetic.append(
    math(
      [
        ...numberParts(step.targetColumnValueBefore, "detail"),
        " ÷ ",
        ...numberParts(step.pivotValue, "detail"),
        " ≈ ",
        ...numberParts(step.multiplier, "multiplier"),
      ],
      `${numberSpeech(step.targetColumnValueBefore, "detail")} divided by ${numberSpeech(step.pivotValue, "detail")} is approximately ${numberSpeech(step.multiplier, "multiplier")}`,
      "elimination-arithmetic",
      "ls-formula-line"
    ),
    createDataTable(
      `Row values for eliminating row ${step.targetRow + 1}`,
      ["Evidence", ...step.targetRowBefore.map((_, index) => `Column ${index + 1}`)],
      [
        ["Target before", ...step.targetRowBefore.map((value) => number(value, "detail"))],
        ["Pivot row used", ...step.pivotRowUsed.map((value) => number(value, "detail"))],
        ["Target after", ...step.targetRowAfter.map((value) => number(value, "detail"))],
      ]
    )
  );
  arithmetic.dataset.roundedArithmetic = "true";
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderFactorizationComplete(
  step: Extract<LinearSystemTraceStep, { kind: "factorization_complete" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Factorization complete", headingLevel);
  card.append(
    paragraph([
      "The computed factors use the public relation ",
      math("P A = L U", "P times A equals L times U", "factorization-relation"),
      ".",
    ]),
    paragraph([
      "For the displayed rounded entries, ",
      math("P A ≈ L U", "P times A is approximately equal to L times U", "rounded-factorization"),
      ".",
    ]),
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
    | Extract<LinearSystemTraceStep, { kind: "backward_substitution" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const forward = step.kind === "forward_substitution";
  const result = forward ? step.resultingY : step.resultingXHat;
  const card = stepCard(
    step,
    `${forward ? "Forward" : "Backward"} substitution, component ${step.row + 1}`,
    headingLevel
  );
  const rhsSymbol: readonly StructuredMathPart[] = forward
    ? [subscript("(P b)", String(step.row + 1))]
    : indexed("y", step.row);
  const diagonalSymbol = indexed(forward ? "L" : "U", step.row, step.row);
  const resultSymbol = indexed(forward ? "y" : "x̂", step.row);
  const chain = element("ol", undefined, "ls-substitution-chain");
  const rhs = element("li");
  rhs.dataset.substitutionStage = "rhs";
  rhs.append(
    math(
      [...rhsSymbol, " ≈ ", ...numberParts(step.rightHandSideValue, "detail")],
      `${forward ? `P b component ${step.row + 1}` : `y sub ${step.row + 1}`} is approximately ${numberSpeech(step.rightHandSideValue, "detail")}`,
      forward ? "permuted-rhs-component" : "y-component"
    )
  );
  const contributions = element("li");
  contributions.dataset.substitutionStage = "contributions";
  if (step.accumulatedKnownTermSum !== undefined) {
    contributions.append(
      math(
        [
          "known contribution sum ≈ ",
          ...numberParts(step.accumulatedKnownTermSum, "detail"),
        ],
        `the known contribution sum is approximately ${numberSpeech(step.accumulatedKnownTermSum, "detail")}`,
        "known-contribution-sum"
      )
    );
  } else {
    contributions.textContent = `${step.contributions.length} known contributions are applied in computation order.`;
  }
  const numerator = element("li");
  numerator.dataset.substitutionStage = "numerator";
  numerator.append(
    math(
      ["numerator ≈ ", ...numberParts(step.numeratorBeforeDivision, "detail")],
      `the numerator is approximately ${numberSpeech(step.numeratorBeforeDivision, "detail")}`,
      "substitution-numerator"
    )
  );
  const diagonal = element("li");
  diagonal.dataset.substitutionStage = "diagonal";
  diagonal.append(
    math(
      [...diagonalSymbol, " ≈ ", ...numberParts(step.diagonalValue, "detail")],
      `${forward ? "L" : "U"} sub ${step.row + 1} ${step.row + 1} is approximately ${numberSpeech(step.diagonalValue, "detail")}`,
      "matrix-entry"
    )
  );
  const solved = element("li");
  solved.dataset.substitutionStage = "result";
  solved.append(
    markDisplayedValue(
      math(
      [...resultSymbol, " ≈ ", ...numberParts(result, "solution")],
      `${forward ? "y" : "x hat"} sub ${step.row + 1} is approximately ${numberSpeech(result, "solution")}`,
      "solution-component"
      ),
      result,
      "solution"
    )
  );
  chain.append(rhs, contributions, numerator, diagonal, solved);
  card.append(chain);
  const arithmetic = element("div");
  arithmetic.append(
    createDataTable(
      `${forward ? "Forward" : "Backward"} substitution contributions for row ${step.row + 1}`,
      ["Known component", "Coefficient", "Known value", "Product", "Accumulator after subtraction"],
      step.contributions.map((contribution) => [
        math(
          indexed(forward ? "y" : "x̂", contribution.column),
          `${forward ? "y" : "x hat"} sub ${contribution.column + 1}`,
          "solution-component"
        ),
        math(
          [
            ...indexed(forward ? "L" : "U", step.row, contribution.column),
            " ≈ ",
            ...numberParts(contribution.coefficient, "detail"),
          ],
          `${forward ? "L" : "U"} sub ${step.row + 1} ${contribution.column + 1} is approximately ${numberSpeech(contribution.coefficient, "detail")}`,
          "matrix-entry"
        ),
        number(contribution.knownValue, "detail"),
        number(contribution.product, "detail"),
        number(contribution.accumulatorAfterSubtraction, "detail"),
      ])
    )
  );
  if (step.accumulatedKnownTermSum !== undefined) {
    const accumulated = paragraph(
      [
        "Accumulated known-term sum: ",
        number(step.accumulatedKnownTermSum, "detail"),
        ".",
      ],
      "ls-formula-line"
    );
    accumulated.dataset.accumulatedKnownTermSum = "true";
    arithmetic.append(accumulated);
  }
  arithmetic.append(
    math(
      [
        ...numberParts(step.numeratorBeforeDivision, "detail"),
        " ÷ ",
        ...numberParts(step.diagonalValue, "detail"),
        " ≈ ",
        ...numberParts(result, "solution"),
      ],
      `${numberSpeech(step.numeratorBeforeDivision, "detail")} divided by ${numberSpeech(step.diagonalValue, "detail")} is approximately ${numberSpeech(result, "solution")}`,
      "substitution-arithmetic",
      "ls-formula-line"
    )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderResidualComponent(
  step: Extract<LinearSystemTraceStep, { kind: "residual_component" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Residual check, component ${step.row + 1}`,
    headingLevel
  );
  card.append(
    math(
      [
        ...indexed("r", step.row),
        " = ",
        ...indexed("b", step.row),
        " − ",
        subscript("(A x̂)", String(step.row + 1)),
      ],
      `r sub ${step.row + 1} equals b sub ${step.row + 1} minus A times x hat component ${step.row + 1}`,
      "residual-component-definition",
      "ls-formula-line"
    ),
    math(
      [
        ...indexed("r", step.row),
        " ≈ ",
        ...numberParts(step.residualComponent, "diagnostic"),
      ],
      `r sub ${step.row + 1} is approximately ${numberSpeech(step.residualComponent, "diagnostic")}`,
      "residual-component",
      "ls-formula-line"
    )
  );
  const arithmetic = element("div");
  arithmetic.append(
    paragraph([
      math(
        [
          subscript("(A x̂)", String(step.row + 1)),
          " ≈ ",
          ...numberParts(step.matrixVectorValue, "detail"),
        ],
        `A times x hat component ${step.row + 1} is approximately ${numberSpeech(step.matrixVectorValue, "detail")}`,
        "matrix-vector-component"
      ),
      "; ",
      math(
        [
          ...indexed("b", step.row),
          " ≈ ",
          ...numberParts(step.originalBValue, "detail"),
        ],
        `b sub ${step.row + 1} is approximately ${numberSpeech(step.originalBValue, "detail")}`,
        "rhs-component"
      ),
      ".",
    ]),
    createDataTable(
        `Residual products for row ${step.row + 1}`,
        ["Column", "A entry", "Computed component", "Product", "Accumulated A x̂"],
        step.terms.map((term) => [
          String(term.column + 1),
          math(
            [
              ...indexed("A", step.row, term.column),
              " ≈ ",
              ...numberParts(term.coefficient, "detail"),
            ],
            `A sub ${step.row + 1} ${term.column + 1} is approximately ${numberSpeech(term.coefficient, "detail")}`,
            "matrix-entry"
          ),
          math(
            [
              ...indexed("x̂", term.column),
              " ≈ ",
              ...numberParts(term.solutionValue, "reference_detail"),
            ],
            `x hat sub ${term.column + 1} is approximately ${numberSpeech(term.solutionValue, "reference_detail")}`,
            "solution-component"
          ),
          number(term.product, "detail"),
          number(term.accumulatedMatrixVectorValue, "detail"),
        ])
      )
  );
  card.append(createArithmeticDetails(arithmetic));
  return card;
}

function renderResidualNorm(
  step: Extract<LinearSystemTraceStep, { kind: "residual_inf_norm" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Take the residual infinity norm", headingLevel);
  const norm = markDisplayedValue(
    math(
      [subscript("‖r‖", "∞"), " ≈ ", ...numberParts(step.residualInfNorm, "diagnostic")],
      `the infinity norm of r is approximately ${numberSpeech(step.residualInfNorm, "diagnostic")}`,
      "residual-inf-norm"
    ),
    step.residualInfNorm,
    "diagnostic"
  );
  card.append(
    paragraph([
      `Component ${step.selectedMaximumRow + 1} has the largest absolute residual, so `,
      norm,
      ".",
    ]),
    createDataTable(
      "Residual infinity norm components",
      ["Row", "Residual", "Absolute value"],
      step.components.map((component) => [
        String(component.row + 1),
        number(component.value, "diagnostic"),
        number(component.absoluteValue, "diagnostic"),
      ])
    )
  );
  return card;
}

function renderPresetReference(
  step: Extract<LinearSystemTraceStep, { kind: "preset_reference_difference" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    "Compare with the preset reference solution",
    headingLevel
  );
  card.append(
    paragraph([
      "Difference from preset reference solution: ",
      number(step.referenceDifferenceInf, "diagnostic"),
      `. The largest component difference occurs at component ${step.selectedMaximumIndex + 1}.`,
    ])
  );
  card.append(
    createArithmeticDetails(
      createDataTable(
        "Preset reference component differences",
        ["Component", "Computed x̂", "Preset reference", "Difference", "Absolute difference"],
        step.components.map((component) => [
          String(component.index + 1),
          math(
            [
              ...indexed("x̂", component.index),
              " ≈ ",
              ...numberParts(component.computedValue, "reference_detail"),
            ],
            `x hat sub ${component.index + 1} is approximately ${numberSpeech(component.computedValue, "reference_detail")}`,
            "solution-component"
          ),
          number(component.referenceValue, "reference_detail"),
          number(component.difference, "diagnostic"),
          number(component.absoluteDifference, "diagnostic"),
        ])
      )
    )
  );
  return card;
}

function phase(
  title: string,
  description: readonly CellContent[],
  steps: readonly LinearSystemTraceStep[],
  headingLevel: HeadingLevel,
  stepHeadingLevel: HeadingLevel
): HTMLElement | undefined {
  if (steps.length === 0) return undefined;
  const section = element("section", undefined, "ls-walkthrough-phase");
  section.append(heading(headingLevel, title), paragraph(description, "ls-muted"));
  for (const step of steps) {
    if (step.kind === "matrix_scale") {
      section.append(renderMatrixScale(step, stepHeadingLevel));
    }
    if (step.kind === "pivot_selection") {
      section.append(renderPivotSelection(step, stepHeadingLevel));
    }
    if (step.kind === "row_swap") section.append(renderRowSwap(step, stepHeadingLevel));
    if (step.kind === "elimination") {
      section.append(renderElimination(step, stepHeadingLevel));
    }
    if (step.kind === "factorization_complete") {
      section.append(renderFactorizationComplete(step, stepHeadingLevel));
    }
    if (step.kind === "forward_substitution") {
      section.append(renderSubstitution(step, stepHeadingLevel));
    }
    if (step.kind === "backward_substitution") {
      section.append(renderSubstitution(step, stepHeadingLevel));
    }
    if (step.kind === "residual_component") {
      section.append(renderResidualComponent(step, stepHeadingLevel));
    }
    if (step.kind === "residual_inf_norm") {
      section.append(renderResidualNorm(step, stepHeadingLevel));
    }
    if (step.kind === "preset_reference_difference") {
      section.append(renderPresetReference(step, stepHeadingLevel));
    }
  }
  return section;
}

export function createComputationWalkthrough(
  trace: LinearSystemComputationTrace,
  options: ComputationWalkthroughOptions
): HTMLElement {
  const phaseHeadingLevel = (options.headingLevel + 1) as HeadingLevel;
  const stepHeadingLevel = (options.headingLevel + 2) as HeadingLevel;
  const walkthrough = element("div", undefined, "ls-computation-walkthrough");
  walkthrough.dataset.computationWalkthrough = "true";
  walkthrough.append(
    heading(options.headingLevel, "Computation walkthrough"),
    element(
      "p",
      "Each step comes from the computation that produced this result. Open Show arithmetic for the underlying values.",
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
      ["The original matrix sets the scale used by the Lab's engineering safeguard."],
      trace.steps.filter((step) => step.kind === "matrix_scale"),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
    phase(
      "2. Factorization and elimination",
      [
        "Pivot decisions, row swaps, and eliminations build ",
        math("P A = L U", "P times A equals L times U", "factorization-relation"),
        " in computation order.",
      ],
      trace.steps.filter((step) => factorizationKinds.has(step.kind)),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
    phase(
      "3. Forward substitution",
      [
        "Solve ",
        math("L y = P b", "L times y equals P times b", "forward-substitution-relation"),
        " from the first row to the last.",
      ],
      trace.steps.filter((step) => step.kind === "forward_substitution"),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
    phase(
      "4. Backward substitution",
      [
        "Solve ",
        math("U x̂ = y", "U times x hat equals y", "backward-substitution-relation"),
        " from the last row to the first.",
      ],
      trace.steps.filter((step) => step.kind === "backward_substitution"),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
    phase(
      "5. Residual check",
      [
        "Use the original A and b to form ",
        math("r = b − A x̂", "r equals b minus A times x hat", "residual-relation"),
        " and ",
        math(subscript("‖r‖", "∞"), "the infinity norm of r", "residual-inf-norm"),
        ".",
      ],
      trace.steps.filter(
        (step) =>
          step.kind === "residual_component" || step.kind === "residual_inf_norm"
      ),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
    phase(
      "6. Preset reference comparison",
      ["This qualified comparison appears only for an authoritative preset fingerprint."],
      trace.steps.filter((step) => step.kind === "preset_reference_difference"),
      phaseHeadingLevel,
      stepHeadingLevel
    ),
  ].filter((section): section is HTMLElement => section !== undefined);
  walkthrough.append(...sections);
  return walkthrough;
}
