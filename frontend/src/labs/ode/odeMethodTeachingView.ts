import { renderReadonlyMath } from "../../math/ui/readonlyMath";
import type { OdeMethodTeachingLearnerProfile } from "./odeMethodTeaching";

export function hasCompleteMethodTeachingLens(
  profile: OdeMethodTeachingLearnerProfile
): boolean {
  return (
    (profile.problemProfile === "first_order_ivp" &&
      (profile.stepStructure === "one_step" ||
        profile.stepStructure === "history")) ||
    (profile.problemProfile === "second_order_acceleration" &&
      profile.stepStructure === "staggered")
  );
}

function sectionHeading(text: string): HTMLHeadingElement {
  const heading = document.createElement("h3");
  heading.textContent = text;
  return heading;
}

function subsectionHeading(text: string): HTMLHeadingElement {
  const heading = document.createElement("h4");
  heading.textContent = text;
  return heading;
}

function renderPrimaryMathematics(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-method-primary-math";
  section.dataset.methodPrimaryMath = "true";

  const label = document.createElement("p");
  label.className = "ode-method-teaching-label";
  label.textContent = "Defining mathematics";
  const heading = sectionHeading(
    profile.stepStructure === "history"
      ? "The defining history relation"
      : profile.stepStructure === "staggered"
        ? "The central staggered update"
        : "The rule for one step"
  );
  const formula = document.createElement("div");
  formula.className = "ode-selected-method-formula ode-method-primary-formula";
  formula.dataset.selectedMethodFormula = "true";
  formula.dataset.primaryMethodFormula = "true";
  renderReadonlyMath(formula, profile.primaryFormula, { display: "block" });
  const explanation = document.createElement("p");
  explanation.className = "ode-method-formula-verbalization";
  explanation.textContent = profile.accessibleVerbalization;

  section.append(label, heading, formula, explanation);
  return section;
}

function renderStaticDiagram(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement | undefined {
  const diagram = profile.staticDiagram;
  if (!diagram) return undefined;

  const figure = document.createElement("figure");
  figure.className = `ode-method-diagram ode-method-diagram-${diagram.kind}`;
  figure.dataset.methodTeachingDiagram = diagram.kind;
  const diagramId = `${profile.identity.family}-${diagram.kind}`;

  const title = document.createElement("p");
  title.className = "ode-method-diagram-title";
  title.textContent = diagram.title;
  title.id = `ode-method-diagram-${diagramId}-title`;
  const caption = document.createElement("figcaption");
  caption.textContent = diagram.caption;
  caption.id = `ode-method-diagram-${diagramId}-description`;
  figure.setAttribute("aria-labelledby", title.id);
  figure.setAttribute("aria-describedby", caption.id);

  const track = document.createElement("div");
  track.className = "ode-method-diagram-track";
  track.dataset.diagramTrack = "true";
  track.setAttribute("aria-hidden", "true");

  const renderStep = (
    step: (typeof diagram.steps)[number]
  ): HTMLElement => {
    const node = document.createElement("div");
    node.className = "ode-method-diagram-step";
    node.dataset.diagramStep = step.id;
    const stepLabel = document.createElement("span");
    stepLabel.className = "ode-method-diagram-step-label";
    stepLabel.textContent = step.label;
    const stepTitle = document.createElement("strong");
    stepTitle.textContent = step.title;
    const detail = document.createElement("span");
    detail.className = "ode-method-diagram-step-detail";
    detail.textContent = step.detail;
    node.append(stepLabel, stepTitle, detail);
    return node;
  };

  const renderConnector = (label = "→"): HTMLElement => {
    const connector = document.createElement("span");
    connector.className = "ode-method-diagram-connector";
    connector.textContent = label;
    return connector;
  };

  if (diagram.kind === "predictor_corrector" && diagram.steps.length === 5) {
    const [history, predictor, relation, correction, accepted] = diagram.steps;
    const branches = document.createElement("div");
    branches.className = "ode-method-diagram-branches";
    branches.dataset.diagramBranches = "true";
    branches.append(renderStep(predictor!), renderStep(relation!));
    track.append(
      renderStep(history!),
      renderConnector("⇉"),
      branches,
      renderConnector("⇢"),
      renderStep(correction!),
      renderConnector(),
      renderStep(accepted!)
    );
  } else {
    for (const [index, step] of diagram.steps.entries()) {
      if (index > 0) track.append(renderConnector());
      track.append(renderStep(step));
    }
  }

  figure.append(title, caption, track);
  return figure;
}

function renderSupportingMathematics(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement | undefined {
  if (profile.supportingFormulas.length === 0) return undefined;

  const section = document.createElement("section");
  section.className = "ode-method-supporting-math";
  section.dataset.methodSupportingMath = "true";
  section.append(
    sectionHeading(
      profile.supportingFormulas.length === 1
        ? "Supporting equation"
        : "Supporting equations"
    )
  );

  const formulas = document.createElement("div");
  formulas.className = "ode-method-supporting-math-list";
  for (const formulaModel of profile.supportingFormulas) {
    const item = document.createElement("div");
    item.className = "ode-method-supporting-formula";
    item.dataset.supportingMethodFormula = formulaModel.id;
    const title = document.createElement("p");
    title.className = "ode-method-supporting-formula-title";
    title.textContent = formulaModel.title;
    const formula = document.createElement("div");
    formula.className = "ode-method-supporting-formula-math";
    renderReadonlyMath(formula, formulaModel.content, { display: "block" });
    item.append(title, formula);
    formulas.append(item);
  }
  section.append(formulas);
  return section;
}

function renderFormulaAnatomy(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-method-formula-anatomy";
  section.dataset.methodFormulaAnatomy = "true";
  section.append(sectionHeading("Read the formula"));

  const anatomy = document.createElement("dl");
  for (const part of profile.formulaAnatomy) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = part.label;
    const meaning = document.createElement("dd");
    meaning.textContent = part.meaning;
    item.append(term, meaning);
    anatomy.append(item);
  }
  section.append(anatomy);
  return section;
}

function renderUpdateProcess(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-method-update";
  section.dataset.methodUpdateProcess = "true";
  section.append(sectionHeading("One update, in order"));

  const process = document.createElement("ol");
  for (const step of profile.orderedProcess) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = step;
    item.append(text);
    process.append(item);
  }
  section.append(process);
  return section;
}

function orderLabel(profile: OdeMethodTeachingLearnerProfile): string {
  if (profile.order.kind === "fixed") {
    return `Theoretical order ${profile.order.theoreticalOrder}`;
  }
  return `Supported theoretical orders ${profile.order.supportedMin}–${profile.order.supportedMax}; current order ${profile.order.currentConfiguredOrder}`;
}

function currentOrderStartupGuidance(
  profile: OdeMethodTeachingLearnerProfile
): string | undefined {
  if (
    profile.stepStructure !== "history" ||
    profile.order.kind !== "configurable" ||
    profile.order.currentConfiguredOrder === undefined
  ) {
    return undefined;
  }
  const currentOrder = profile.order.currentConfiguredOrder;
  if (currentOrder === 1) {
    return "For current order 1, no preliminary RK4 startup approximation is required.";
  }
  const startupCount = currentOrder - 1;
  const startupLabel =
    startupCount === 1
      ? "1 RK4 startup approximation fills"
      : `${startupCount} RK4 startup approximations fill`;
  return `For current order ${currentOrder}, ${startupLabel} the history before the first history-based update.`;
}

function renderPracticalFacts(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-method-practical-facts";
  section.dataset.methodPracticalFacts = "true";
  section.append(sectionHeading("What the step uses"));

  const grid = document.createElement("div");
  grid.className = "ode-method-practical-facts-grid";

  const order = document.createElement("div");
  order.append(subsectionHeading("Implemented order"));
  const orderText = document.createElement("p");
  orderText.textContent = orderLabel(profile);
  order.append(orderText);

  const state = document.createElement("div");
  state.append(subsectionHeading("Required state"));
  const stateList = document.createElement("ul");
  for (const value of profile.requiredState) {
    const item = document.createElement("li");
    item.textContent = value;
    stateList.append(item);
  }
  state.append(stateList);

  const work = document.createElement("div");
  work.append(subsectionHeading("Work per step"));
  const workText = document.createElement("p");
  workText.textContent = profile.perStepWork;
  work.append(workText);

  const startup = document.createElement("div");
  startup.append(subsectionHeading("History and startup"));
  const currentStartup = currentOrderStartupGuidance(profile);
  if (currentStartup) {
    const currentStartupText = document.createElement("p");
    currentStartupText.dataset.currentOrderStartup = "true";
    currentStartupText.textContent = currentStartup;
    startup.append(currentStartupText);
  }
  const startupText = document.createElement("p");
  startupText.textContent = profile.startupHistoryRequirement;
  startup.append(startupText);

  grid.append(order, state, work, startup);
  section.append(grid);
  return section;
}

function renderInterpretationBoundaries(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-method-interpretation";
  section.dataset.methodInterpretation = "true";
  section.append(sectionHeading("Interpret the method carefully"));

  const rows = document.createElement("div");
  rows.className = "ode-method-interpretation-rows";
  for (const [title, text] of [
    ["Teaching strength", profile.strength],
    ["Watch point", profile.watchPoint],
    ["Accuracy and stability", profile.accuracyStabilityBoundary],
  ] as const) {
    const row = document.createElement("div");
    row.append(subsectionHeading(title));
    const copy = document.createElement("p");
    copy.textContent = text;
    row.append(copy);
    rows.append(row);
  }

  const misconception = document.createElement("div");
  misconception.className = "ode-method-misconception";
  misconception.append(subsectionHeading("Common misconception"));
  const incorrect = document.createElement("p");
  incorrect.className = "ode-method-misconception-incorrect";
  incorrect.textContent = `Incorrect: ${profile.commonMisconception.incorrect}`;
  const correction = document.createElement("p");
  correction.textContent = profile.commonMisconception.correction;
  misconception.append(incorrect, correction);
  rows.append(misconception);

  section.append(rows);
  return section;
}

function renderAdvancedDetails(
  profile: OdeMethodTeachingLearnerProfile
): HTMLDetailsElement | undefined {
  if (profile.advancedDetails.length === 0) return undefined;

  const details = document.createElement("details");
  details.className = "ode-method-advanced-details";
  details.dataset.methodAdvancedDetails = "true";
  const summary = document.createElement("summary");
  summary.textContent = "Implementation details";
  const body = document.createElement("div");
  body.className = "ode-method-advanced-details-body";
  for (const detail of profile.advancedDetails) {
    const item = document.createElement("section");
    item.append(subsectionHeading(detail.title));
    const text = document.createElement("p");
    text.textContent = detail.text;
    item.append(text);
    body.append(item);
  }
  details.append(summary, body);
  return details;
}

function renderSelectedConcepts(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-selected-method-concepts";
  section.dataset.selectedMethodConcepts = "true";
  section.append(sectionHeading("Selected-method concepts"));
  const lead = document.createElement("p");
  lead.className = "ode-method-section-lead";
  lead.textContent =
    "These are the ideas needed to interpret this update and its later evidence.";
  const concepts = document.createElement("dl");
  concepts.className = "ode-method-concept-list";
  for (const concept of profile.selectedConcepts) {
    const item = document.createElement("div");
    item.dataset.methodConcept = concept.id;
    const term = document.createElement("dt");
    term.textContent = concept.title;
    const definition = document.createElement("dd");
    definition.textContent = concept.definition;
    item.append(term, definition);
    concepts.append(item);
  }
  section.append(lead, concepts);
  return section;
}

function renderAfterSolve(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  const section = document.createElement("section");
  section.className = "ode-selected-method-after-solve";
  section.dataset.selectedMethodAfterSolve = "true";
  section.append(sectionHeading("After the solve — what to inspect"));
  const lead = document.createElement("p");
  lead.className = "ode-method-section-lead";
  lead.textContent = profile.whatToObserve;

  const evidence = document.createElement("dl");
  evidence.className = "ode-method-after-solve-list";
  for (const [title, text] of [
    ["Output", profile.outputEvidenceGuidance],
    ["Convergence, when eligible", profile.convergenceGuidance],
  ] as const) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = title;
    const definition = document.createElement("dd");
    definition.textContent = text;
    item.append(term, definition);
    evidence.append(item);
  }
  section.append(lead, evidence);
  return section;
}

export function renderOdeMethodTeachingLens(
  profile: OdeMethodTeachingLearnerProfile
): HTMLElement {
  if (!hasCompleteMethodTeachingLens(profile)) {
    throw new Error(
      `Complete method teaching is unavailable for ${profile.identity.family}.`
    );
  }

  const lens = document.createElement("div");
  lens.className = `ode-selected-teaching-lens ode-selected-teaching-lens-${profile.identity.family}`;
  lens.dataset.selectedMethodDeepLens = profile.identity.family;

  lens.append(renderPrimaryMathematics(profile));
  const diagram = renderStaticDiagram(profile);
  if (diagram) lens.append(diagram);
  const supportingMathematics = renderSupportingMathematics(profile);
  if (supportingMathematics) lens.append(supportingMathematics);

  const explanation = document.createElement("div");
  explanation.className = "ode-method-explanation-layout";
  explanation.append(
    renderFormulaAnatomy(profile),
    renderUpdateProcess(profile)
  );
  lens.append(
    explanation,
    renderPracticalFacts(profile),
    renderInterpretationBoundaries(profile)
  );
  const details = renderAdvancedDetails(profile);
  if (details) lens.append(details);
  lens.append(renderSelectedConcepts(profile), renderAfterSolve(profile));
  return lens;
}
