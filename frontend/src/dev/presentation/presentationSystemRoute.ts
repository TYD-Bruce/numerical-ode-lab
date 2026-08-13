import type { RouteModule } from "../../app/contracts";
import {
  createNativeMath,
  mathIdentifier,
  mathMatrix,
  mathNumber,
  mathNumberLiteral,
  mathOperator,
  mathOver,
} from "../../math/nativeMath";
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
        createStatusAndControls()
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
