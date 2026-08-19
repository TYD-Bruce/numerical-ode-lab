import type { RouteModule } from "../../app/contracts";
import { createComputationWalkthroughShell } from "../../components/lab-presentation/computationWalkthroughShell";
import { createEvidenceBlock } from "../../components/lab-presentation/evidenceBlock";
import { createPrimaryResult } from "../../components/lab-presentation/primaryResult";
import { createProblemContext } from "../../components/lab-presentation/problemContext";
import {
  createAdvancedDetails,
  createNumericalTable,
} from "../../components/lab-presentation/supportingElements";
import { createTeachingBlock } from "../../components/lab-presentation/teachingBlock";
import {
  createNativeMath,
  mathFraction,
  mathIdentifier,
  mathMatrix,
  mathNumber,
  mathNumberLiteral,
  mathOperator,
  mathOver,
  mathRow,
  mathSubscript,
  mathSuperscript,
} from "../../math/nativeMath";
import "../../components/lab-presentation/labPresentation.css";
import "./presentationSystem.css";

type StageRole = "method" | "data" | "output" | "analysis";

function textElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function specimenHeading(
  index: string,
  title: string,
  description: string
): HTMLElement {
  const header = document.createElement("header");
  header.className = "presentation-specimen-heading";
  const eyebrow = textElement("p", "presentation-eyebrow", index);
  const heading = textElement("h2", "presentation-stage-title", title);
  const intro = textElement("p", "presentation-supporting", description);
  header.append(eyebrow, heading, intro);
  return header;
}

function phaseTwoSpecimenHeading(
  index: string,
  title: string,
  description: string
): HTMLElement {
  const header = document.createElement("header");
  header.className = "presentation-specimen-heading";
  header.append(
    textElement("p", "presentation-eyebrow", index),
    textElement("h3", "presentation-section-title", title),
    textElement("p", "presentation-supporting", description)
  );
  return header;
}

function createIdentity(): HTMLElement {
  const header = document.createElement("header");
  header.className = "presentation-fixture-header";
  const record = document.createElement("div");
  const eyebrow = textElement(
    "p",
    "presentation-eyebrow",
    "Internal visual fixture · Cross-Lab Presentation Sync"
  );
  const title = textElement("h1", "presentation-lab-title", "Numerical T Lab");
  title.tabIndex = -1;
  title.dataset.routeFocus = "true";
  const descriptor = textElement(
    "p",
    "presentation-fixture-descriptor",
    "Presentation System v1 — Phase 0"
  );
  const note = textElement(
    "p",
    "presentation-supporting",
    "Phase 0 token calibration — not a product Lab."
  );
  record.append(eyebrow, title, descriptor, note);

  const words = document.createElement("ul");
  words.className = "presentation-identity-words";
  words.setAttribute("aria-label", "Presentation design qualities");
  for (const word of ["Technical", "Calm", "Tactile", "Mathematical", "Premium"]) {
    words.append(textElement("li", "", word));
  }
  header.append(record, words);
  return header;
}

function createStageRoles(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-fixture-section";
  section.append(
    specimenHeading(
      "01 · Workflow roles",
      "Workflow roles",
      "Method, Data, Output, and Analysis each serve a distinct role in the numerical workflow."
    )
  );
  const stages = document.createElement("div");
  stages.className = "presentation-stage-grid";
  const definitions: readonly [StageRole, string, string, string][] = [
    ["method", "01", "Method", "Choose the numerical approach."],
    ["data", "02", "Data", "Define the mathematical problem."],
    ["output", "03", "Output", "Read the computed result."],
    [
      "analysis",
      "04",
      "Analysis",
      "Interpret accuracy, reliability, and numerical behavior.",
    ],
  ];
  for (const [role, index, title, copy] of definitions) {
    const stage = document.createElement("article");
    stage.className = "presentation-stage-specimen";
    stage.dataset.presentationStage = role;
    const row = document.createElement("div");
    row.className = "presentation-stage-label";
    row.append(
      textElement("span", "presentation-stage-index", index),
      textElement("span", "presentation-stage-state", "Selected treatment")
    );
    stage.append(
      row,
      textElement("h3", "presentation-section-title", title),
      textElement("p", "presentation-supporting", copy)
    );
    stages.append(stage);
  }
  section.append(stages);
  return section;
}

function createSurfaceStack(): HTMLElement {
  const canvas = document.createElement("div");
  canvas.className = "presentation-surface presentation-surface-page";
  canvas.dataset.surfaceLevel = "0";
  canvas.append(textElement("span", "presentation-surface-label", "Level 0 · Page"));
  const stage = document.createElement("div");
  stage.className = "presentation-surface presentation-surface-stage";
  stage.dataset.surfaceLevel = "1";
  stage.append(textElement("span", "presentation-surface-label", "Level 1 · Stage"));
  const section = document.createElement("div");
  section.className = "presentation-surface presentation-surface-section";
  section.dataset.surfaceLevel = "2";
  section.append(textElement("span", "presentation-surface-label", "Level 2 · Section"));
  const inset = document.createElement("div");
  inset.className = "presentation-surface presentation-surface-inset";
  inset.dataset.surfaceLevel = "3";
  inset.append(
    textElement("span", "presentation-surface-label", "Level 3 · Mathematical inset"),
    createNativeMath(
      [
        mathIdentifier("A"),
        mathOperator("⁢"),
        mathIdentifier("x"),
        mathOperator("="),
        mathIdentifier("b"),
      ],
      "A x equals b",
      { display: "block", dataMath: "surface-sample" }
    )
  );
  section.append(inset);
  stage.append(section);
  canvas.append(stage);
  return canvas;
}

function createTypographyLedger(): HTMLElement {
  const ledger = document.createElement("div");
  ledger.className = "presentation-type-ledger";
  const rows: readonly [string, string, string | HTMLElement][] = [
    ["Lab title", "presentation-type-lab-title", "Initial Value Problems Lab"],
    ["Stage title", "presentation-type-stage-title", "Output"],
    ["Section title", "presentation-type-section-title", "Problem and computed solution"],
    ["Teaching body", "presentation-type-body", "A pivot is the active entry used to eliminate entries below it."],
    ["Metadata", "presentation-type-metadata", "Gaussian elimination · 3 × 3 system"],
    ["Technical eyebrow", "presentation-type-eyebrow", "RUN 04 · CURRENT SNAPSHOT"],
    [
      "Numeric value",
      "presentation-type-numeric",
      createNativeMath(
        mathNumber(2.31e-14, "diagnostic"),
        "2.31 times ten to the minus 14",
        {
          className: "presentation-type-numeric",
          dataMath: "numeric-value",
        }
      ),
    ],
    ["Supporting", "presentation-type-supporting", "Residual infinity norm"],
  ];
  for (const [label, className, sample] of rows) {
    const row = document.createElement("div");
    row.className = "presentation-type-row";
    row.append(
      textElement("span", "presentation-type-label", label),
      typeof sample === "string" ? textElement("span", className, sample) : sample
    );
    ledger.append(row);
  }
  return ledger;
}

function createFoundations(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-fixture-section";
  section.append(
    specimenHeading(
      "02 · Hierarchy",
      "Four surface levels, one readable voice",
      "Tonal steps and spacing do the structural work before shadow or decoration."
    )
  );
  const grid = document.createElement("div");
  grid.className = "presentation-foundation-grid";
  const surface = document.createElement("section");
  surface.setAttribute("aria-labelledby", "presentation-surface-title");
  const surfaceTitle = textElement("h3", "presentation-section-title", "Surface hierarchy");
  surfaceTitle.id = "presentation-surface-title";
  surface.append(surfaceTitle, createSurfaceStack());
  const type = document.createElement("section");
  type.setAttribute("aria-labelledby", "presentation-type-title");
  const typeTitle = textElement("h3", "presentation-section-title", "Typography roles");
  typeTitle.id = "presentation-type-title";
  type.append(typeTitle, createTypographyLedger());
  grid.append(surface, type);
  section.append(grid);
  return section;
}

function xHat(): Element {
  return mathOver(mathIdentifier("x"), mathOperator("^"));
}

function createResultSpecimen(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-result-specimen";
  section.dataset.presentationStage = "output";
  const heading = document.createElement("header");
  heading.className = "presentation-result-heading";
  heading.append(
    textElement("p", "presentation-eyebrow", "03 · Illustrative output"),
    textElement("h2", "presentation-stage-title", "Problem and computed solution"),
    textElement("span", "presentation-current-marker", "Current result")
  );
  const relationship = document.createElement("div");
  relationship.className = "presentation-result-relationship";
  const problem = document.createElement("section");
  problem.className = "presentation-result-problem";
  problem.append(
    textElement("h3", "presentation-section-title", "Problem"),
    textElement("p", "presentation-supporting", "Solve the authored linear system."),
    createNativeMath(
      [
        mathIdentifier("A"),
        mathOperator("⁢"),
        mathIdentifier("x"),
        mathOperator("="),
        mathIdentifier("b"),
      ],
      "A x equals b",
      { display: "block", dataMath: "problem" }
    )
  );
  const answer = document.createElement("section");
  answer.className = "presentation-result-answer";
  answer.append(
    textElement("p", "presentation-eyebrow", "Computed solution"),
    createNativeMath(
      [
        xHat(),
        mathOperator("="),
        mathMatrix([
          [mathNumberLiteral("1")],
          [mathNumberLiteral("2")],
          [mathNumberLiteral("-1")],
        ]),
      ],
      "x hat equals the column vector 1, 2, minus 1",
      {
        className: "presentation-answer-math",
        display: "block",
        dataMath: "computed-solution",
      }
    ),
    textElement("p", "presentation-type-metadata", "Residual ‖r‖∞ · 2.31 × 10⁻¹⁴")
  );
  relationship.append(problem, answer);
  section.append(heading, relationship);
  return section;
}

function createMeaningSurfaces(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-fixture-section";
  section.append(
    specimenHeading(
      "04 · Meaning",
      "Teaching, evidence, and interpretation",
      "Each voice is distinct without turning every paragraph into another card."
    )
  );
  const grid = document.createElement("div");
  grid.className = "presentation-meaning-grid";

  const teaching = document.createElement("article");
  teaching.className = "presentation-meaning-surface presentation-meaning-teaching";
  teaching.append(
    textElement("p", "presentation-eyebrow", "Teaching"),
    textElement("h3", "presentation-section-title", "Why the pivot matters"),
    textElement(
      "p",
      "presentation-type-body",
      "A pivot is the active entry used to eliminate entries below it. A stable method checks that this value is usable before dividing."
    )
  );

  const evidence = document.createElement("article");
  evidence.className = "presentation-meaning-surface presentation-meaning-evidence";
  const metrics = document.createElement("dl");
  metrics.className = "presentation-metrics";
  for (const [term, value] of [["Rows", "3"], ["Elimination steps", "2"]]) {
    const item = document.createElement("div");
    item.append(
      textElement("dt", "presentation-type-supporting", term),
      textElement("dd", "presentation-type-numeric", value)
    );
    metrics.append(item);
  }
  const details = document.createElement("details");
  details.className = "presentation-details";
  details.append(
    textElement("summary", "", "Advanced detail"),
    textElement(
      "p",
      "presentation-supporting",
      "The residual is computed from the original system, not the transformed rows."
    )
  );
  evidence.append(
    textElement("p", "presentation-eyebrow", "Evidence"),
    textElement("h3", "presentation-section-title", "Computation record"),
    metrics,
    details
  );

  const analysis = document.createElement("article");
  analysis.className = "presentation-meaning-surface presentation-meaning-analysis";
  analysis.append(
    textElement("p", "presentation-eyebrow", "Analysis"),
    textElement("h3", "presentation-section-title", "What does the residual show?"),
    textElement(
      "p",
      "presentation-type-body",
      "The residual measures equation mismatch. Here it is close to machine precision, so the computed solution is consistent with the original system."
    ),
    textElement("p", "presentation-analysis-conclusion", "Interpretation · Strong agreement")
  );
  grid.append(teaching, evidence, analysis);
  section.append(grid);
  return section;
}

function formula(
  content: Element | readonly (Element | string)[],
  accessibleText: string,
  dataMath: string
): HTMLElement {
  return createNativeMath(content, accessibleText, {
    display: "block",
    dataMath,
  });
}

function matrix(values: readonly (readonly (number | string)[])[]): Element {
  return mathMatrix(
    values.map((row) =>
      row.map((value) => mathNumberLiteral(String(value)))
    )
  );
}

function metrics(
  entries: readonly (readonly [string, string | Node])[]
): HTMLDListElement {
  const list = document.createElement("dl");
  for (const [label, value] of entries) {
    const item = document.createElement("div");
    const description = document.createElement("dd");
    description.append(value);
    item.append(textElement("dt", "", label), description);
    list.append(item);
  }
  return list;
}

function linearSystemContext(headingLevel: "h4" | "h5"): HTMLElement {
  return createProblemContext({
    heading: textElement(
      headingLevel,
      "",
      headingLevel === "h4" ? "Linear system snapshot" : "Problem"
    ),
    statement: formula(
      [
        matrix([
          [3, 1],
          [1, 2],
        ]),
        mathOperator("⁢"),
        mathIdentifier("x"),
        mathOperator("="),
        matrix([[5], [4]]),
      ],
      "The matrix 3 1, 1 2 times x equals the column vector 5, 4",
      `phase2-linear-context-${headingLevel}`
    ),
    parameters: [
      { label: "System size", value: "2 × 2" },
      { label: "Method", value: "Gaussian elimination with partial pivoting" },
    ],
    provenance: textElement(
      "p",
      "",
      "Successful Run 04 · Starter teaching snapshot"
    ),
    staleNote:
      headingLevel === "h4"
        ? textElement(
            "p",
            "",
            "Stale result · current Data differs from this successful snapshot."
          )
        : undefined,
  });
}

function odeContext(headingLevel: "h4" | "h5"): HTMLElement {
  const differentialEquation = mathRow([
    mathIdentifier("y"),
    mathOperator("′"),
    mathOperator("="),
    mathIdentifier("f"),
    mathOperator("("),
    mathIdentifier("t"),
    mathOperator(","),
    mathIdentifier("y"),
    mathOperator(")"),
  ]);
  const initialCondition = mathRow([
    mathIdentifier("y"),
    mathOperator("("),
    mathSubscript(mathIdentifier("t"), mathNumberLiteral("0")),
    mathOperator(")"),
    mathOperator("="),
    mathSubscript(mathIdentifier("y"), mathNumberLiteral("0")),
  ]);
  return createProblemContext({
    heading: textElement(
      headingLevel,
      "",
      headingLevel === "h4" ? "Initial value problem" : "Problem"
    ),
    statement: formula(
      [differentialEquation, mathOperator(","), initialCondition],
      "y prime equals f of t and y, with y at t zero equal to y zero",
      `phase2-ode-context-${headingLevel}`
    ),
    parameters: [
      {
        label: "Interval",
        value: createNativeMath(
          [
            mathNumberLiteral("0"),
            mathOperator("≤"),
            mathIdentifier("t"),
            mathOperator("≤"),
            mathNumberLiteral("5"),
          ],
          "t from 0 through 5",
          { dataMath: `phase2-ode-interval-${headingLevel}` }
        ),
      },
      { label: "Step size", value: "0.2" },
      { label: "Method", value: "Forward Euler" },
    ],
    provenance: textElement("p", "", "Exponential decay · authored fixture"),
  });
}

function pdeContext(): HTMLElement {
  return createProblemContext({
    heading: textElement("h4", "", "Future PDE composition"),
    statement: formula(
      [
        mathSubscript(mathIdentifier("u"), mathIdentifier("t")),
        mathOperator("="),
        mathIdentifier("α"),
        mathSubscript(mathIdentifier("u"), mathRow([mathIdentifier("x"), mathIdentifier("x")])),
      ],
      "u sub t equals alpha times u sub x x",
      "phase2-pde-context"
    ),
    parameters: [
      {
        label: "Domain",
        value: createNativeMath(
          [
            mathNumberLiteral("0"),
            mathOperator("≤"),
            mathIdentifier("x"),
            mathOperator("≤"),
            mathNumberLiteral("1"),
          ],
          "x from 0 through 1",
          { dataMath: "phase2-pde-domain" }
        ),
      },
      { label: "Boundary summary", value: "Fixed values at both endpoints" },
    ],
    provenance: textElement(
      "p",
      "",
      "Conceptual fixture only · no PDE implementation"
    ),
  });
}

function createPhaseTwoProblemContexts(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.1 · Context",
      "Problem Context",
      "The successful mathematical problem stays visible without competing with the answer."
    )
  );
  const grid = document.createElement("div");
  grid.className = "presentation-phase-two-context-grid";
  grid.append(linearSystemContext("h4"), odeContext("h4"), pdeContext());
  section.append(grid);
  return section;
}

function createPhaseTwoTeaching(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.2 · Teaching",
      "Teaching Block",
      "Meaning and limits lead; mechanics stay ordered and subordinate."
    )
  );
  const definitions = document.createElement("dl");
  for (const [term, description] of [
    ["Pivot", "The active entry used to eliminate entries below it."],
    ["Multiplier", "The factor that scales the pivot row before subtraction."],
  ]) {
    definitions.append(
      textElement("dt", "", term),
      textElement("dd", "", description)
    );
  }
  const steps = document.createElement("ol");
  for (const copy of [
    "Compare the candidate magnitudes.",
    "Select the first largest candidate.",
    "Eliminate entries below the pivot.",
  ]) {
    steps.append(textElement("li", "", copy));
  }
  const teaching = createTeachingBlock({
    eyebrow: textElement("p", "", "Core meaning"),
    heading: textElement("h4", "", "Why the pivot matters"),
    lead: textElement(
      "p",
      "",
      "A usable pivot anchors one elimination column and keeps the next division within the Lab's accepted safeguard."
    ),
    math: [
      formula(
        [
          mathSubscript(mathIdentifier("R"), mathNumberLiteral("2")),
          mathOperator("−"),
          mathFraction(mathNumberLiteral("1"), mathNumberLiteral("3")),
          mathSubscript(mathIdentifier("R"), mathNumberLiteral("1")),
          mathOperator("→"),
          mathSubscript(mathIdentifier("R"), mathNumberLiteral("2")),
        ],
        "row two minus one third row one becomes row two",
        "phase2-teaching-operation"
      ),
    ],
    definitions,
    steps,
    examples: [
      textElement(
        "p",
        "",
        "Example · a row swap can place a larger-magnitude entry in the pivot position."
      ),
    ],
    limitation: textElement(
      "p",
      "",
      "A pivot safeguard is an engineering acceptance rule, not a proof of singularity."
    ),
    advancedDetails: createAdvancedDetails({
      summary: "Implementation detail",
      content: [
        textElement(
          "p",
          "",
          "The threshold scales with the original matrix and remains domain-owned evidence."
        ),
      ],
    }),
  });
  const compact = createTeachingBlock({
    eyebrow: textElement("p", "", "Compact teaching"),
    heading: textElement("h4", "", "Residual and solution error differ"),
    lead: textElement(
      "p",
      "",
      "Residual measures equation mismatch; it does not by itself measure solution error."
    ),
  });
  const grid = document.createElement("div");
  grid.className = "presentation-phase-two-teaching-grid";
  grid.append(teaching, compact);
  section.append(grid);
  return section;
}

function createPhaseTwoPrimaryResults(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.3 · Answer",
      "Primary Result",
      "One successful answer dominates; context and metrics explain what it belongs to."
    )
  );
  const linearResult = createPrimaryResult({
    eyebrow: textElement("p", "", "Linear Systems · Output"),
    heading: textElement("h4", "", "Problem and computed solution"),
    status: textElement("p", "", "Current result"),
    problemContext: linearSystemContext("h5"),
    primaryAnswer: {
      label: textElement("p", "", "Computed solution"),
      content: formula(
        [
          xHat(),
          mathOperator("="),
          matrix([[1], [2]]),
        ],
        "x hat equals the column vector one, two",
        "phase2-linear-answer"
      ),
    },
    metrics: metrics([
      [
        "Residual infinity norm",
        createNativeMath(
          mathNumber(2.31e-14, "diagnostic"),
          "2.31 times ten to the minus 14",
          { dataMath: "phase2-linear-residual" }
        ),
      ],
      [
        "Factorization",
        createNativeMath(
          [
            mathIdentifier("P"),
            mathIdentifier("A"),
            mathOperator("="),
            mathIdentifier("L"),
            mathIdentifier("U"),
          ],
          "P A equals L U",
          { dataMath: "phase2-linear-factorization" }
        ),
      ],
    ]),
  });
  const odeResult = createPrimaryResult({
    eyebrow: textElement("p", "", "ODE · Output"),
    heading: textElement("h4", "", "Final numerical approximation"),
    status: textElement("p", "", "Current result"),
    problemContext: odeContext("h5"),
    primaryAnswer: {
      label: textElement("p", "", "Approximation at t = 5"),
      content: formula(
        [
          mathIdentifier("u"),
          mathOperator("("),
          mathNumberLiteral("5"),
          mathOperator(")"),
          mathOperator("≈"),
          mathNumberLiteral("0.32768"),
        ],
        "u at 5 is approximately 0.32768",
        "phase2-ode-answer"
      ),
    },
    metrics: metrics([
      ["Stored points", "26"],
      ["Method", "Forward Euler"],
    ]),
  });
  const compareProblem = createProblemContext({
    heading: textElement("h5", "", "Shared problem"),
    statement: formula(
      [
        mathIdentifier("y"),
        mathOperator("′"),
        mathOperator("="),
        mathOperator("−"),
        mathIdentifier("y"),
      ],
      "y prime equals negative y",
      "phase2-compare-problem"
    ),
    parameters: [{ label: "Endpoint", value: "t = 5" }],
  });
  const comparison = createPrimaryResult({
    eyebrow: textElement("p", "", "Compare · Output"),
    heading: textElement("h4", "", "Two methods, one problem"),
    status: textElement("p", "", "Current comparison"),
    problemContext: compareProblem,
    primaryAnswer: {
      label: textElement("p", "", "Forward Euler"),
      content: formula(
        mathNumberLiteral("0.32768"),
        "Forward Euler answer 0.32768",
        "phase2-compare-euler"
      ),
    },
    comparisonAnswer: {
      label: textElement("p", "", "Runge–Kutta 4"),
      content: formula(
        mathNumberLiteral("0.36788"),
        "Runge Kutta 4 answer 0.36788",
        "phase2-compare-rk4"
      ),
    },
  });
  const variants = document.createElement("div");
  variants.className = "presentation-phase-two-result-grid";
  variants.append(odeResult, comparison);
  section.append(linearResult, variants);
  return section;
}

function createChartPlaceholder(): HTMLElement {
  const figure = document.createElement("figure");
  figure.className = "presentation-authored-chart";
  figure.setAttribute("aria-label", "Authored maximum-error chart frame");
  const plot = document.createElement("div");
  plot.className = "presentation-authored-chart-plot";
  plot.setAttribute("aria-hidden", "true");
  for (const height of ["34%", "52%", "73%", "88%"] as const) {
    const point = document.createElement("span");
    point.style.setProperty("--fixture-point-height", height);
    plot.append(point);
  }
  figure.append(
    textElement("figcaption", "", "Maximum error decreases under refinement"),
    plot
  );
  return figure;
}

function createPhaseTwoEvidence(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.4 · Evidence",
      "Evidence levels",
      "Summary, standard, and advanced evidence have deliberately different authority."
    )
  );
  const evidence = document.createElement("div");
  evidence.className = "presentation-phase-two-evidence-grid";
  evidence.append(
    createEvidenceBlock({
      level: "summary",
      heading: textElement("h4", "", "Residual check"),
      lead: textElement(
        "p",
        "",
        "The stored residual is near machine precision for this snapshot."
      ),
      formulas: [
        formula(
          [
            mathIdentifier("r"),
            mathOperator("="),
            mathIdentifier("b"),
            mathOperator("−"),
            mathIdentifier("A"),
            xHat(),
          ],
          "r equals b minus A times x hat",
          "phase2-residual-formula"
        ),
      ],
    }),
    createEvidenceBlock({
      level: "standard",
      heading: textElement("h4", "", "ODE method evidence"),
      lead: textElement(
        "p",
        "",
        "A static chart frame and formula show where domain-owned evidence fits."
      ),
      formulas: [
        formula(
          [
            mathSubscript(mathIdentifier("u"), mathRow([mathIdentifier("n"), mathOperator("+"), mathNumberLiteral("1")])),
            mathOperator("="),
            mathSubscript(mathIdentifier("u"), mathIdentifier("n")),
            mathOperator("+"),
            mathIdentifier("h"),
            mathIdentifier("f"),
            mathOperator("("),
            mathSubscript(mathIdentifier("t"), mathIdentifier("n")),
            mathOperator(","),
            mathSubscript(mathIdentifier("u"), mathIdentifier("n")),
            mathOperator(")"),
          ],
          "u sub n plus 1 equals u sub n plus h times f of t sub n and u sub n",
          "phase2-ode-method-evidence"
        ),
      ],
      chart: createChartPlaceholder(),
    }),
    createEvidenceBlock({
      level: "advanced",
      heading: textElement("h4", "", "Factorization evidence"),
      lead: textElement(
        "p",
        "",
        "P, L, and U support the answer without competing with it."
      ),
      formulas: [
        formula(
          [
            mathIdentifier("P"),
            mathIdentifier("A"),
            mathOperator("="),
            mathIdentifier("L"),
            mathIdentifier("U"),
          ],
          "P A equals L U",
          "phase2-factorization-evidence"
        ),
      ],
      advancedDetails: createAdvancedDetails({
        summary: "Factor detail",
        content: [
          textElement(
            "p",
            "",
            "Matrices remain authored mathematical objects, not a generic table grid."
          ),
        ],
      }),
    })
  );
  section.append(evidence);
  return section;
}

function createPhaseTwoNumericalTable(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.5 · Tabular evidence",
      "Numerical Table",
      "Real headers and local containment preserve wide numerical relationships."
    ),
    createNumericalTable({
      caption: "ODE refinement evidence",
      rowHeader: "Level",
      columns: [
        { label: "Step size", numeric: true },
        { label: "Final approximation", numeric: true },
        { label: "Final-time error", numeric: true },
        { label: "Observed order", numeric: true },
      ],
      rows: [
        { label: "0", cells: ["0.2", "0.32768", "0.04020", "—"] },
        { label: "1", cells: ["0.1", "0.34868", "0.01920", "1.07"] },
        {
          label: "2",
          cells: [
            "0.05",
            "0.35849",
            createNativeMath(
              mathNumber(9.39e-3, "diagnostic"),
              "9.39 times ten to the minus 3",
              { dataMath: "phase2-table-error" }
            ),
            "1.03",
          ],
        },
      ],
    })
  );
  return section;
}

function createPhaseTwoAdvancedDetails(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.6 · Disclosure",
      "Advanced Details",
      "Assumptions and safeguards remain available without hiding the main result."
    ),
    createAdvancedDetails({
      summary: "Solver safeguard details",
      content: [
        textElement(
          "p",
          "",
          "The pivot threshold is an engineering safeguard scaled by the original matrix."
        ),
        textElement(
          "p",
          "",
          "A rejected pivot stops the attempt without replacing a prior successful result."
        ),
      ],
    })
  );
  return section;
}

function rowOperationFormula(): HTMLElement {
  return formula(
    [
      mathSubscript(mathIdentifier("R"), mathNumberLiteral("2")),
      mathOperator("−"),
      mathFraction(mathNumberLiteral("1"), mathNumberLiteral("2")),
      mathSubscript(mathIdentifier("R"), mathNumberLiteral("1")),
      mathOperator("→"),
      mathSubscript(mathIdentifier("R"), mathNumberLiteral("2")),
    ],
    "row two minus one half row one becomes row two",
    "phase2-walkthrough-row-operation"
  );
}

function createPhaseTwoWalkthrough(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-phase-two-section";
  section.append(
    phaseTwoSpecimenHeading(
      "P2.7 · Ordered evidence",
      "Computation Walkthrough shell",
      "The shell hosts authored static evidence and never reconstructs a numerical sequence."
    )
  );
  const shell = createComputationWalkthroughShell({
    heading: textElement("h4", "", "Three compatible computation shapes"),
    purpose: textElement(
      "p",
      "",
      "Each phase preserves source, operation, and target order without motion."
    ),
    phases: [
      {
        heading: textElement("h5", "", "Linear Systems · elimination"),
        steps: [
          {
            heading: textElement("h6", "", "Eliminate the entry below the pivot"),
            corridor: {
              source: formula(
                matrix([
                  [2, 1],
                  [1, 3],
                ]),
                "matrix before elimination",
                "phase2-walkthrough-linear-before"
              ),
              operation: rowOperationFormula(),
              target: formula(
                matrix([
                  [2, 1],
                  [0, 2.5],
                ]),
                "matrix after elimination",
                "phase2-walkthrough-linear-after"
              ),
            },
          },
        ],
      },
      {
        heading: textElement("h5", "", "ODE · one time step"),
        steps: [
          {
            heading: textElement("h6", "", "Advance from one stored time level"),
            corridor: {
              source: formula(
                mathSubscript(mathIdentifier("u"), mathIdentifier("n")),
                "u sub n",
                "phase2-walkthrough-ode-before"
              ),
              operation: formula(
                [
                  mathOperator("+"),
                  mathIdentifier("h"),
                  mathIdentifier("f"),
                  mathOperator("("),
                  mathSubscript(mathIdentifier("t"), mathIdentifier("n")),
                  mathOperator(","),
                  mathSubscript(mathIdentifier("u"), mathIdentifier("n")),
                  mathOperator(")"),
                ],
                "add h times f of t sub n and u sub n",
                "phase2-walkthrough-ode-operation"
              ),
              target: formula(
                mathSubscript(
                  mathIdentifier("u"),
                  mathRow([
                    mathIdentifier("n"),
                    mathOperator("+"),
                    mathNumberLiteral("1"),
                  ])
                ),
                "u sub n plus 1",
                "phase2-walkthrough-ode-after"
              ),
            },
          },
        ],
      },
      {
        heading: textElement("h5", "", "Future PDE · conceptual grid step"),
        steps: [
          {
            heading: textElement("h6", "", "Apply an authored stencil relationship"),
            corridor: {
              source: formula(
                mathSuperscript(mathIdentifier("u"), mathIdentifier("n")),
                "u at time level n",
                "phase2-walkthrough-pde-before"
              ),
              operation: formula(
                [
                  mathIdentifier("Δ"),
                  mathIdentifier("t"),
                  mathIdentifier("L"),
                  mathOperator("("),
                  mathSuperscript(mathIdentifier("u"), mathIdentifier("n")),
                  mathOperator(")"),
                ],
                "delta t times L of u at time level n",
                "phase2-walkthrough-pde-operation"
              ),
              target: formula(
                mathSuperscript(
                  mathIdentifier("u"),
                  mathRow([
                    mathIdentifier("n"),
                    mathOperator("+"),
                    mathNumberLiteral("1"),
                  ])
                ),
                "u at time level n plus 1",
                "phase2-walkthrough-pde-after"
              ),
            },
          },
        ],
      },
    ],
    completionEvidence: textElement(
      "p",
      "",
      "Static evidence complete · no Replay or motion controller required."
    ),
  });
  section.append(shell);
  return section;
}

function createPhaseTwoFixture(): HTMLElement {
  const phase = document.createElement("section");
  phase.className = "presentation-phase-two";
  phase.setAttribute("aria-labelledby", "presentation-phase-two-title");
  const header = document.createElement("header");
  header.className = "presentation-phase-two-header";
  header.append(
    textElement("p", "presentation-eyebrow", "Authored compositional fixture"),
    Object.assign(
      textElement("h2", "presentation-stage-title", "Phase 2 · Content hierarchy"),
      { id: "presentation-phase-two-title" }
    ),
    textElement(
      "p",
      "presentation-supporting",
      "Context orients, teaching explains, the result answers, evidence supports, and advanced detail recedes."
    )
  );
  phase.append(
    header,
    createPhaseTwoProblemContexts(),
    createPhaseTwoTeaching(),
    createPhaseTwoPrimaryResults(),
    createPhaseTwoEvidence(),
    createPhaseTwoNumericalTable(),
    createPhaseTwoAdvancedDetails(),
    createPhaseTwoWalkthrough()
  );
  return phase;
}

function createStatusAndControls(): HTMLElement {
  const section = document.createElement("section");
  section.className = "presentation-fixture-section";
  section.append(
    specimenHeading(
      "05 · Interaction",
      "States that speak before they signal",
      "Text owns meaning; tone, border, and focus reinforce it."
    )
  );
  const grid = document.createElement("div");
  grid.className = "presentation-interaction-grid";
  const statuses = document.createElement("section");
  statuses.className = "presentation-status-panel";
  statuses.append(textElement("h3", "presentation-section-title", "Status tones"));
  const statusList = document.createElement("div");
  statusList.className = "presentation-status-list";
  const statusDefinitions: readonly [string, string][] = [
    ["ready", "Ready · inputs complete"],
    ["current", "Current · result matches data"],
    ["stale", "Stale · run again to update"],
    ["caution", "Caution · inspect the pivot"],
    ["failed", "Failed · no result replaced"],
    ["planned", "Planned · future capability"],
  ];
  for (const [status, copy] of statusDefinitions) {
    const marker = textElement("span", "presentation-status", copy);
    marker.dataset.presentationStatus = status;
    statusList.append(marker);
  }
  statuses.append(statusList);

  const controls = document.createElement("section");
  controls.className = "presentation-control-panel";
  controls.append(textElement("h3", "presentation-section-title", "Actions and controls"));
  const actions = document.createElement("div");
  actions.className = "presentation-actions";
  for (const [role, label] of [
    ["primary", "Run method"],
    ["secondary", "Load preset"],
    ["quiet", "Clear"],
    ["danger", "Confirm reset"],
  ] as const) {
    const button = textElement("button", `presentation-action presentation-action-${role}`, label);
    button.type = "button";
    actions.append(button);
  }
  const disabled = textElement("button", "presentation-action presentation-action-secondary", "Unavailable");
  disabled.type = "button";
  disabled.disabled = true;
  actions.append(disabled);

  const fields = document.createElement("div");
  fields.className = "presentation-fields";
  const inputLabel = textElement("label", "presentation-field", "Tolerance");
  const input = document.createElement("input");
  input.type = "text";
  input.value = "1e-10";
  inputLabel.append(input);
  const selectLabel = textElement("label", "presentation-field", "Method family");
  const select = document.createElement("select");
  for (const optionLabel of ["Direct", "Iterative"]) {
    const option = document.createElement("option");
    option.textContent = optionLabel;
    select.append(option);
  }
  selectLabel.append(select);
  const invalidLabel = textElement("label", "presentation-field", "Invalid sample");
  const invalid = document.createElement("input");
  invalid.type = "text";
  invalid.value = "zero pivot";
  invalid.setAttribute("aria-invalid", "true");
  invalidLabel.append(invalid);
  fields.append(inputLabel, selectLabel, invalidLabel);
  controls.append(actions, fields);
  grid.append(statuses, controls);
  section.append(grid);
  return section;
}

export function createPresentationSystemRoute(): RouteModule {
  return {
    mount({ target }) {
      const page = document.createElement("article");
      page.className = "platform-page presentation-system-fixture";
      page.append(
        createIdentity(),
        createStageRoles(),
        createFoundations(),
        createResultSpecimen(),
        createMeaningSurfaces(),
        createStatusAndControls(),
        createPhaseTwoFixture()
      );
      target.replaceChildren(page);

      return {
        dispose(): void {
          target.replaceChildren();
        },
      };
    },
  };
}
