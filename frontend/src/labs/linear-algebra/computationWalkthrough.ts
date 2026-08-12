import type {
  LinearSystemComputationTrace,
  LinearSystemSolveSuccess,
  LinearSystemTraceStep,
} from "@numerical-t-lab/numerics/linear-algebra/linear-systems-numerics";
import type { ComputationTrace } from "@numerical-t-lab/numerics/trace/computation-trace";
import {
  createNativeMath,
  mathFraction,
  mathIdentifier,
  mathNumber,
  mathNumberLiteral,
  mathOperator,
  mathRow,
  mathSubscript,
  mathSuperscript,
  type NativeMathNode,
} from "../../math/nativeMath";
import {
  formatMathNumber,
  type MathNumberContext,
} from "../../math/structuredMath";
import {
  createComputedSolution,
  createNamedMatrix,
  createNamedVector,
  createPluRelation,
  indexedNode,
  multiplyNodes,
  numericMatrixNode,
  numericVectorNode,
  spokenMatrix,
  spokenNumber,
  spokenVector,
  xHatNode,
} from "./linearSystemsMath";

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
  readonly result?: LinearSystemSolveSuccess;
}

type Content = string | Node;

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

function append(target: Node, content: Content): void {
  target.appendChild(
    typeof content === "string" ? document.createTextNode(content) : content
  );
}

function paragraph(
  contents: readonly Content[],
  className?: string
): HTMLParagraphElement {
  const node = element("p", undefined, className);
  contents.forEach((content) => append(node, content));
  return node;
}

function mathDisplay(
  nodes: NativeMathNode | readonly (NativeMathNode | string)[],
  accessibleText: string,
  dataMath: string,
  className = "ls-native-equation"
): HTMLElement {
  return createNativeMath(nodes, accessibleText, {
    className,
    display: "block",
    dataMath,
  });
}

export function formatLinearSystemsNumber(
  value: number,
  context: MathNumberContext = "ordinary"
): string {
  return formatMathNumber(value, context).text;
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

function phase(
  title: string,
  description: string,
  level: HeadingLevel,
  dataPhase: string
): HTMLElement {
  const section = element("section", undefined, "ls-walkthrough-phase ls-v2-phase");
  section.dataset.walkthroughPhase = dataPhase;
  section.append(heading(level, title), element("p", description, "ls-muted"));
  return section;
}

function stepCard(
  step: LinearSystemTraceStep,
  title: string,
  headingLevel: HeadingLevel,
  className = ""
): HTMLElement {
  const card = element(
    "article",
    undefined,
    `ls-computation-step ls-v2-computation-step ${className}`.trim()
  );
  card.dataset.traceKind = step.kind;
  card.append(heading(headingLevel, title));
  return card;
}

function computationMarker(
  label: string,
  state: "selected" | "source" | "target" | "changed" | "solved" | "maximum"
): HTMLSpanElement {
  const marker = element("span", label, `computation-marker is-${state}`);
  marker.dataset.computationMarker = state;
  return marker;
}

function details(summaryText: string, content: HTMLElement): HTMLDetailsElement {
  const disclosure = element("details", undefined, "ls-arithmetic-details");
  disclosure.append(element("summary", summaryText), content);
  return disclosure;
}

function dataTable(
  label: string,
  headers: readonly string[],
  rows: readonly (readonly Content[])[],
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
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = header;
    headRow.append(cell);
  });
  head.append(headRow);
  const body = document.createElement("tbody");
  rows.forEach((values, rowIndex) => {
    const row = document.createElement("tr");
    if (rowIndex === selectedRowIndex) {
      row.dataset.pivotSelected = "true";
      row.setAttribute("aria-current", "true");
    }
    values.forEach((value, columnIndex) => {
      const cell =
        columnIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      if (columnIndex === 0) cell.scope = "row";
      cell.dataset.label = headers[columnIndex] ?? "Value";
      append(cell, value);
      row.append(cell);
    });
    body.append(row);
  });
  table.append(head, body);
  region.append(table);
  return region;
}

function matrixState(
  matrix: readonly (readonly number[])[],
  state: "before" | "after",
  accessiblePrefix: string
): HTMLElement {
  const owner = element("div", undefined, `ls-transformation-state is-${state}`);
  owner.dataset.matrixState = state;
  owner.append(
    computationMarker(state === "before" ? "Before" : "After", state === "before" ? "source" : "changed"),
    createNativeMath(
      numericMatrixNode(matrix, "matrix"),
      `${accessiblePrefix}: matrix with rows ${spokenMatrix(matrix, "matrix")}`,
      {
        className: "ls-transformation-matrix",
        display: "block",
        dataMath: `matrix-${state}`,
      }
    )
  );
  return owner;
}

function initialFactorization(
  step: Extract<LinearSystemTraceStep, { kind: "factorization_start" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Initial working matrix", headingLevel, "ls-initial-state");
  card.append(
    mathDisplay(
      [
        mathSuperscript(mathIdentifier("U"), mathNumberLiteral("0")),
        mathOperator("="),
        mathIdentifier("A"),
        mathOperator("="),
        numericMatrixNode(step.initialU, "matrix"),
      ],
      `U superscript 0 equals A, the matrix with rows ${spokenMatrix(step.initialU, "matrix")}`,
      "initial-u",
      "ls-initial-matrix"
    )
  );
  return card;
}

function pivotSelection(
  step: Extract<LinearSystemTraceStep, { kind: "pivot_selection" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Pivot decision for column ${step.column + 1}`,
    headingLevel,
    "ls-pivot-decision"
  );
  const selectedIndex = step.candidates.findIndex(
    (candidate) => candidate.row === step.selectedRow
  );
  const summary = element("div", undefined, "ls-pivot-summary");
  summary.append(
    computationMarker(`Selected row ${step.selectedRow + 1}`, "selected"),
    paragraph([
      `Column ${step.column + 1}: row ${step.selectedRow + 1} is the first candidate with the largest absolute magnitude, `,
      createNativeMath(
        mathNumber(step.selectedAbsoluteMagnitude, "detail"),
        spokenNumber(step.selectedAbsoluteMagnitude, "detail"),
        { dataMath: "selected-pivot-magnitude" }
      ),
      ".",
    ])
  );
  card.append(summary);
  if (!step.accepted) {
    card.append(
      paragraph(
        [
          "The selected pivot did not clear the Lab's acceptance threshold, so computation stopped. This safeguard result does not by itself constitute a formal symbolic proof that the matrix is singular.",
        ],
        "ls-evidence-stop"
      ),
      mathDisplay(
        [
          mathNumber(step.selectedAbsoluteMagnitude, "detail"),
          mathOperator("≤"),
          mathSubscript(mathIdentifier("τ"), mathIdentifier("pivot")),
          mathOperator("≈"),
          mathNumber(step.tauPivot, "threshold"),
        ],
        `${spokenNumber(step.selectedAbsoluteMagnitude, "detail")} is less than or equal to tau pivot, approximately ${spokenNumber(step.tauPivot, "threshold")}`,
        "pivot-threshold-comparison",
        "ls-safeguard-comparison"
      )
    );
  }
  const candidateDetail = element("div");
  candidateDetail.append(
    dataTable(
      `Pivot candidates for column ${step.column + 1}`,
      ["Candidate row", "Entry", "Absolute magnitude", "Status"],
      step.candidates.map((candidate) => [
        String(candidate.row + 1),
        formatLinearSystemsNumber(candidate.value, "detail"),
        formatLinearSystemsNumber(candidate.absoluteValue, "detail"),
        candidate.row === step.selectedRow ? "Selected" : "Candidate",
      ]),
      selectedIndex
    )
  );
  card.append(details("Show pivot candidates", candidateDetail));
  return card;
}

function swapOperation(
  step: Extract<LinearSystemTraceStep, { kind: "row_swap" }>
): HTMLElement {
  const operation = element("div", undefined, "ls-transformation-operation");
  operation.dataset.rowOperation = "swap";
  const arrow = element("span", undefined, "ls-transformation-arrow");
  arrow.setAttribute("aria-hidden", "true");
  operation.append(
    createNativeMath(
      [
        indexedNode("R", step.firstRow),
        mathOperator("↔"),
        indexedNode("R", step.secondRow),
      ],
      `row ${step.firstRow + 1} swaps with row ${step.secondRow + 1}`,
      { className: "ls-row-operation-math", dataMath: "row-swap-operation" }
    ),
    arrow
  );
  return operation;
}

function rowSwap(
  step: Extract<LinearSystemTraceStep, { kind: "row_swap" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Swap rows ${step.firstRow + 1} and ${step.secondRow + 1}`,
    headingLevel,
    "ls-matrix-transformation"
  );
  const corridor = element("div", undefined, "ls-transformation-corridor");
  corridor.append(
    matrixState(step.uBefore, "before", "U before the row swap"),
    swapOperation(step),
    matrixState(step.uAfter, "after", "U after the row swap")
  );
  card.append(
    paragraph([
      "The selected pivot is moved into the active row. The complete matrices below are the states used by the computation.",
    ]),
    corridor
  );
  const bookkeeping = element("div");
  bookkeeping.append(
    dataTable(
      "Permutation before and after the row swap",
      ["State", "Row order"],
      [
        ["Before", step.permutationBefore.map((value) => value + 1).join(", ")],
        ["After", step.permutationAfter.map((value) => value + 1).join(", ")],
      ]
    )
  );
  if (step.lPriorColumnsBefore.some((row) => row.entries.length > 0)) {
    bookkeeping.append(
      element(
        "p",
        "Previously recorded L entries move with the swapped rows only in columns already completed.",
        "ls-muted"
      )
    );
  }
  card.append(details("Show row-swap bookkeeping", bookkeeping));
  return card;
}

function eliminationOperation(
  step: Extract<LinearSystemTraceStep, { kind: "elimination" }>
): HTMLElement {
  const operation = element("div", undefined, "ls-transformation-operation");
  operation.dataset.rowOperation = "elimination";
  const multiplier = mathDisplay(
    [
      indexedNode("m", step.targetRow, step.column),
      mathOperator("="),
      mathFraction(
        indexedNode("U", step.targetRow, step.column),
        indexedNode("U", step.pivotRow, step.column)
      ),
      mathOperator("≈"),
      mathFraction(
        mathNumber(step.targetColumnValueBefore, "detail"),
        mathNumber(step.pivotValue, "detail")
      ),
      mathOperator("≈"),
      mathNumber(step.multiplier, "multiplier"),
    ],
    `m sub ${step.targetRow + 1} ${step.column + 1} equals U sub ${step.targetRow + 1} ${step.column + 1} divided by U sub ${step.pivotRow + 1} ${step.column + 1}, approximately ${spokenNumber(step.multiplier, "multiplier")}`,
    "elimination-multiplier",
    "ls-multiplier-equation"
  );
  const rowExpression = mathDisplay(
    [
      indexedNode("R", step.targetRow),
      mathOperator("−"),
      multiplyNodes(
        mathRow([
          mathOperator("("),
          mathNumber(step.multiplier, "multiplier"),
          mathOperator(")"),
        ]),
        indexedNode("R", step.pivotRow)
      ),
      mathOperator("→"),
      indexedNode("R", step.targetRow),
    ],
    `row ${step.targetRow + 1} minus ${spokenNumber(step.multiplier, "multiplier")} times row ${step.pivotRow + 1} produces updated row ${step.targetRow + 1}`,
    "row-operation",
    "ls-row-operation-math"
  );
  const arrow = element("span", undefined, "ls-transformation-arrow");
  arrow.setAttribute("aria-hidden", "true");
  operation.append(multiplier, rowExpression, arrow);
  return operation;
}

function elimination(
  step: Extract<LinearSystemTraceStep, { kind: "elimination" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(
    step,
    `Eliminate the entry in row ${step.targetRow + 1}, column ${step.column + 1}`,
    headingLevel,
    "ls-matrix-transformation"
  );
  const markers = element("div", undefined, "ls-computation-markers");
  markers.append(
    computationMarker(`Pivot row R${step.pivotRow + 1}`, "source"),
    computationMarker(`Target row R${step.targetRow + 1}`, "target")
  );
  const corridor = element("div", undefined, "ls-transformation-corridor");
  corridor.append(
    matrixState(step.uBefore, "before", "U before elimination"),
    eliminationOperation(step),
    matrixState(step.uAfter, "after", "U after elimination")
  );
  card.append(markers, corridor);
  const arithmetic = element("div");
  arithmetic.append(
    dataTable(
      `Trace values for eliminating row ${step.targetRow + 1}`,
      ["Evidence", ...step.targetRowBefore.map((_, index) => `Column ${index + 1}`)],
      [
        ["Target before", ...step.targetRowBefore.map((value) => formatLinearSystemsNumber(value, "detail"))],
        ["Pivot row used", ...step.pivotRowUsed.map((value) => formatLinearSystemsNumber(value, "detail"))],
        ["Target after", ...step.targetRowAfter.map((value) => formatLinearSystemsNumber(value, "detail"))],
      ]
    )
  );
  card.append(details("Show row arithmetic", arithmetic));
  return card;
}

function factorizationComplete(
  step: Extract<LinearSystemTraceStep, { kind: "factorization_complete" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Factorization complete", headingLevel, "ls-factorization-complete");
  const factors = element("div", undefined, "ls-factor-grid ls-native-factor-grid");
  factors.append(
    createNamedMatrix("P", step.P, "permutation matrix P", { dataMath: "factor-p" }),
    createNamedMatrix("L", step.L, "unit lower triangular matrix L", { dataMath: "factor-l" }),
    createNamedMatrix("U", step.U, "upper triangular matrix U", { dataMath: "factor-u" })
  );
  card.append(
    createPluRelation(false, "ls-factorization-equation"),
    element(
      "p",
      "The row operations produced upper triangular U; P records row order and L records the elimination multipliers."
    ),
    factors
  );
  return card;
}

function rhsPermutation(
  step: Extract<LinearSystemTraceStep, { kind: "right_hand_side_permutation" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Apply the same row order to b", headingLevel, "ls-rhs-permutation");
  const pb = (): NativeMathNode =>
    multiplyNodes(mathIdentifier("P"), mathIdentifier("b"));
  const equations = element("div", undefined, "ls-rhs-equations");
  equations.append(
    createNamedVector(pb(), step.permutedB, "P times b", {
      dataMath: "permuted-rhs",
      context: "matrix",
    }),
    mathDisplay(
      [
        multiplyNodes(multiplyNodes(mathIdentifier("L"), mathIdentifier("U")), xHatNode()),
        mathOperator("="),
        pb(),
      ],
      "L U times x hat equals P times b",
      "permuted-system"
    ),
    mathDisplay(
      [
        multiplyNodes(mathIdentifier("L"), mathIdentifier("y")),
        mathOperator("="),
        pb(),
      ],
      "L times y equals P times b",
      "forward-substitution-relation"
    )
  );
  card.append(
    element(
      "p",
      "Because the factorization is P A = L U, the transformed right-hand side is P b. Defining U x hat = y leaves the lower-triangular system L y = P b."
    ),
    equations,
    details(
      "Show permutation order",
      element(
        "p",
        `Original row order ${step.originalB.map((_, index) => index + 1).join(", ")} becomes ${step.permutation.map((value) => value + 1).join(", ")}.`
      )
    )
  );
  return card;
}

type SubstitutionStep =
  | Extract<LinearSystemTraceStep, { kind: "forward_substitution" }>
  | Extract<LinearSystemTraceStep, { kind: "backward_substitution" }>;

function symbolicSubstitutionNumerator(
  step: SubstitutionStep,
  forward: boolean
): NativeMathNode {
  let expression: NativeMathNode = forward
    ? mathSubscript(
        mathRow([mathIdentifier("P"), mathOperator("⁢"), mathIdentifier("b")]),
        mathNumberLiteral(String(step.row + 1))
      )
    : indexedNode("y", step.row);
  for (const contribution of step.contributions) {
    const known = forward
      ? indexedNode("y", contribution.column)
      : indexedNode(xHatNode(), contribution.column);
    expression = mathRow([
      mathOperator("("),
      expression,
      mathOperator("−"),
      multiplyNodes(
        indexedNode(forward ? "L" : "U", step.row, contribution.column),
        known
      ),
      mathOperator(")"),
    ]);
  }
  return expression;
}

function numericSubstitutionNumerator(step: SubstitutionStep): NativeMathNode {
  let expression: NativeMathNode = mathNumber(step.rightHandSideValue, "detail");
  for (const contribution of step.contributions) {
    expression = mathRow([
      mathOperator("("),
      expression,
      mathOperator("−"),
      mathOperator("("),
      mathNumber(contribution.coefficient, "detail"),
      mathOperator("·"),
      mathNumber(contribution.knownValue, "detail"),
      mathOperator(")"),
      mathOperator(")"),
    ]);
  }
  return expression;
}

function substitution(
  step: SubstitutionStep,
  headingLevel: HeadingLevel
): HTMLElement {
  const forward = step.kind === "forward_substitution";
  const result = forward ? step.resultingY : step.resultingXHat;
  const symbol = forward ? indexedNode("y", step.row) : indexedNode(xHatNode(), step.row);
  const diagonal = indexedNode(forward ? "L" : "U", step.row, step.row);
  const card = stepCard(
    step,
    `${forward ? "Solve" : "Solve"} ${forward ? `y${step.row + 1}` : `x hat ${step.row + 1}`}`,
    headingLevel,
    "ls-substitution-step"
  );
  card.dataset.substitutionRow = String(step.row);
  const equation = mathDisplay(
    [
      symbol,
      mathOperator("="),
      mathFraction(symbolicSubstitutionNumerator(step, forward), diagonal),
      mathOperator("≈"),
      mathFraction(
        numericSubstitutionNumerator(step),
        mathNumber(step.diagonalValue, "detail")
      ),
      mathOperator("≈"),
      mathNumber(result, "solution"),
    ],
    `${forward ? "y" : "x hat"} component ${step.row + 1} is computed from the stored right-hand side and known contributions, giving ${spokenNumber(result, "solution")}`,
    forward ? "forward-substitution-calculation" : "backward-substitution-calculation",
    "ls-substitution-equation"
  );
  const numerator = paragraph(
    [
      "Stored sequential numerator: ",
      createNativeMath(
        mathNumber(step.numeratorBeforeDivision, "detail"),
        spokenNumber(step.numeratorBeforeDivision, "detail"),
        { dataMath: "substitution-numerator" }
      ),
      ".",
    ],
    "ls-substitution-numerator"
  );
  const solved = computationMarker(
    forward ? `Solved y${step.row + 1} top to bottom` : `Solved x hat ${step.row + 1} bottom to top`,
    "solved"
  );
  card.append(equation, numerator, solved);

  const arithmetic = element("div");
  const rows = step.contributions.map((contribution, order) => {
    const orderCell = element("span", String(order + 1));
    orderCell.dataset.contributionColumn = String(contribution.column);
    return [
      orderCell,
      String(contribution.column + 1),
      formatLinearSystemsNumber(contribution.coefficient, "detail"),
      formatLinearSystemsNumber(contribution.knownValue, "detail"),
      formatLinearSystemsNumber(contribution.product, "detail"),
      formatLinearSystemsNumber(contribution.accumulatorAfterSubtraction, "detail"),
    ];
  });
  arithmetic.append(
    dataTable(
      `${forward ? "Forward" : "Backward"} substitution contributions for row ${step.row + 1}`,
      ["Order", "Known component", "Coefficient", "Known value", "Product", "Accumulator"],
      rows
    )
  );
  if (step.accumulatedKnownTermSum !== undefined) {
    const sum = element("p", undefined, "ls-muted");
    sum.dataset.accumulatedKnownTermSum = "true";
    sum.textContent = `Accumulated known-term sum: ${formatLinearSystemsNumber(step.accumulatedKnownTermSum, "detail")}.`;
    arithmetic.append(sum);
  }
  card.append(details("Show arithmetic", arithmetic));
  return card;
}

function residualPhase(
  components: readonly Extract<LinearSystemTraceStep, { kind: "residual_component" }>[],
  norm: Extract<LinearSystemTraceStep, { kind: "residual_inf_norm" }> | undefined,
  headingLevel: HeadingLevel
): HTMLElement | undefined {
  if (components.length === 0 || !norm) return undefined;
  const card = stepCard(norm, "Check the original equations", headingLevel, "ls-residual-walkthrough");
  card.dataset.traceKind = "residual_check";
  const matrixVector = components.map((step) => step.matrixVectorValue);
  const residual = components.map((step) => step.residualComponent);
  card.append(
    createNamedVector(
      multiplyNodes(mathIdentifier("A"), xHatNode()),
      matrixVector,
      "A times x hat",
      { dataMath: "matrix-vector-result", context: "diagnostic" }
    ),
    mathDisplay(
      [
        mathIdentifier("r"),
        mathOperator("="),
        mathIdentifier("b"),
        mathOperator("−"),
        multiplyNodes(mathIdentifier("A"), xHatNode()),
        mathOperator("="),
        numericVectorNode(residual, "diagnostic"),
      ],
      `r equals b minus A times x hat, the column vector ${spokenVector(residual, "diagnostic")}`,
      "residual-vector",
      "ls-residual-equation"
    ),
    mathDisplay(
      [
        mathSubscript(
          mathRow([
            mathOperator("‖", { fence: true, stretchy: true }),
            mathIdentifier("r"),
            mathOperator("‖", { fence: true, stretchy: true }),
          ]),
          mathIdentifier("∞")
        ),
        mathOperator("="),
        mathNumber(norm.residualInfNorm, "diagnostic"),
      ],
      `the infinity norm of r equals ${spokenNumber(norm.residualInfNorm, "diagnostic")}`,
      "residual-inf-norm",
      "ls-residual-norm-equation"
    ),
    element(
      "p",
      "The residual measures equation mismatch. A small residual does not necessarily mean a small solution error.",
      "ls-diagnostic-limitation"
    )
  );
  const arithmetic = element("div");
  components.forEach((step) => {
    arithmetic.append(
      dataTable(
        `A times x hat products for row ${step.row + 1}`,
        ["Column", "A entry", "x hat component", "Product", "Accumulated value"],
        step.terms.map((term) => [
          String(term.column + 1),
          formatLinearSystemsNumber(term.coefficient, "detail"),
          formatLinearSystemsNumber(term.solutionValue, "reference_detail"),
          formatLinearSystemsNumber(term.product, "detail"),
          formatLinearSystemsNumber(term.accumulatedMatrixVectorValue, "detail"),
        ])
      )
    );
  });
  card.append(details("Show residual arithmetic", arithmetic));
  return card;
}

function presetReference(
  step: Extract<LinearSystemTraceStep, { kind: "preset_reference_difference" }>,
  headingLevel: HeadingLevel
): HTMLElement {
  const card = stepCard(step, "Preset reference comparison", headingLevel, "ls-reference-step");
  card.append(
    paragraph([
      "Difference from preset reference solution: ",
      createNativeMath(
        mathNumber(step.referenceDifferenceInf, "diagnostic"),
        spokenNumber(step.referenceDifferenceInf, "diagnostic"),
        { dataMath: "reference-difference" }
      ),
      ". This is a qualified preset comparison, not an unqualified exact error.",
    ])
  );
  return card;
}

export function createComputationWalkthrough(
  trace: LinearSystemComputationTrace,
  options: ComputationWalkthroughOptions
): HTMLElement {
  const phaseHeadingLevel = (options.headingLevel + 1) as HeadingLevel;
  const stepHeadingLevel = (options.headingLevel + 2) as HeadingLevel;
  const walkthrough = element("div", undefined, "ls-computation-walkthrough ls-computation-walkthrough-v2");
  walkthrough.dataset.computationWalkthrough = "true";
  walkthrough.append(
    heading(
      options.headingLevel,
      options.result ? "Computation walkthrough" : "Computation before failure"
    ),
    element(
      "p",
      "The matrices and arithmetic below come from the computation that produced this attempt. Static evidence remains authoritative.",
      "ls-walkthrough-intro"
    )
  );
  const retention = createTraceRetentionNotice(trace);
  if (retention) walkthrough.append(retention);

  const start = trace.steps.find(
    (step): step is Extract<LinearSystemTraceStep, { kind: "factorization_start" }> =>
      step.kind === "factorization_start"
  );
  if (start) {
    const startSection = phase(
      "1. Start with the original system",
      "Gaussian elimination begins with the original matrix and works toward an upper-triangular U.",
      phaseHeadingLevel,
      "start"
    );
    const original = element("div", undefined, "ls-original-system");
    original.append(
      createNamedMatrix("A", start.initialU, "original coefficient matrix A", {
        dataMath: "original-a",
      })
    );
    const rhs = trace.steps.find(
      (step): step is Extract<LinearSystemTraceStep, { kind: "right_hand_side_permutation" }> =>
        step.kind === "right_hand_side_permutation"
    );
    const originalB = rhs?.originalB ?? options.result?.originalB;
    if (originalB) {
      original.append(
        createNamedVector("b", originalB, "original right-hand-side vector b", {
          dataMath: "original-b",
        })
      );
    }
    startSection.append(
      element("p", "Selected method: Gaussian elimination with partial pivoting.", "ls-selected-method-line"),
      original,
      initialFactorization(start, stepHeadingLevel)
    );
    walkthrough.append(startSection);
  }

  const factorization = phase(
    "2. Pivot and factorize",
    "Each pivot decision supports the complete matrix transformations shown in computation order.",
    phaseHeadingLevel,
    "factorization"
  );
  const factorSteps = trace.steps.filter((step) =>
    step.kind === "pivot_selection" ||
    step.kind === "row_swap" ||
    step.kind === "elimination"
  );
  factorSteps.forEach((step) => {
    if (step.kind === "pivot_selection") {
      factorization.append(pivotSelection(step, stepHeadingLevel));
    } else if (step.kind === "row_swap") {
      factorization.append(rowSwap(step, stepHeadingLevel));
    } else if (step.kind === "elimination") {
      factorization.append(elimination(step, stepHeadingLevel));
    }
  });
  const completed = trace.steps.find(
    (step): step is Extract<LinearSystemTraceStep, { kind: "factorization_complete" }> =>
      step.kind === "factorization_complete"
  );
  if (completed) factorization.append(factorizationComplete(completed, stepHeadingLevel));
  if (factorSteps.length > 0 || completed) walkthrough.append(factorization);

  const rhs = trace.steps.find(
    (step): step is Extract<LinearSystemTraceStep, { kind: "right_hand_side_permutation" }> =>
      step.kind === "right_hand_side_permutation"
  );
  if (rhs) {
    const rhsSection = phase(
      "3. Permute the right-hand side",
      "The same row ordering applied to A must also be applied to b.",
      phaseHeadingLevel,
      "right-hand-side"
    );
    rhsSection.append(rhsPermutation(rhs, stepHeadingLevel));
    walkthrough.append(rhsSection);
  }

  const forwardSteps = trace.steps.filter(
    (step): step is Extract<LinearSystemTraceStep, { kind: "forward_substitution" }> =>
      step.kind === "forward_substitution"
  );
  if (forwardSteps.length > 0) {
    const forward = phase(
      "4. Solve L y = P b",
      "L is lower triangular, so y is solved from top to bottom using already known earlier components.",
      phaseHeadingLevel,
      "forward-substitution"
    );
    forward.append(
      mathDisplay(
        [
          multiplyNodes(mathIdentifier("L"), mathIdentifier("y")),
          mathOperator("="),
          multiplyNodes(mathIdentifier("P"), mathIdentifier("b")),
        ],
        "L times y equals P times b",
        "forward-substitution-relation"
      )
    );
    forwardSteps.forEach((step) => forward.append(substitution(step, stepHeadingLevel)));
    walkthrough.append(forward);
  }

  const backwardSteps = trace.steps.filter(
    (step): step is Extract<LinearSystemTraceStep, { kind: "backward_substitution" }> =>
      step.kind === "backward_substitution"
  );
  if (backwardSteps.length > 0) {
    const backward = phase(
      "5. Solve U x hat = y",
      "U is upper triangular, so x hat is solved from bottom to top using already known later components.",
      phaseHeadingLevel,
      "backward-substitution"
    );
    backward.append(
      mathDisplay(
        [
          multiplyNodes(mathIdentifier("U"), xHatNode()),
          mathOperator("="),
          mathIdentifier("y"),
        ],
        "U times x hat equals y",
        "backward-substitution-relation"
      )
    );
    backwardSteps.forEach((step) => backward.append(substitution(step, stepHeadingLevel)));
    if (options.result) {
      const result = element("section", undefined, "ls-walkthrough-final-solution");
      result.append(
        heading(stepHeadingLevel, "Computed solution"),
        createComputedSolution(options.result.xHat, "ls-walkthrough-solution-math")
      );
      backward.append(result);
    }
    walkthrough.append(backward);
  }

  const residualComponents = trace.steps.filter(
    (step): step is Extract<LinearSystemTraceStep, { kind: "residual_component" }> =>
      step.kind === "residual_component"
  );
  const residualNorm = trace.steps.find(
    (step): step is Extract<LinearSystemTraceStep, { kind: "residual_inf_norm" }> =>
      step.kind === "residual_inf_norm"
  );
  const residual = residualPhase(residualComponents, residualNorm, stepHeadingLevel);
  if (residual) {
    const residualSection = phase(
      "6. Check the residual",
      "Use the original A and b to measure how closely the computed solution satisfies the equations.",
      phaseHeadingLevel,
      "residual"
    );
    residualSection.append(residual);
    const reference = trace.steps.find(
      (step): step is Extract<LinearSystemTraceStep, { kind: "preset_reference_difference" }> =>
        step.kind === "preset_reference_difference"
    );
    if (reference) residualSection.append(presetReference(reference, stepHeadingLevel));
    walkthrough.append(residualSection);
  }

  return walkthrough;
}
