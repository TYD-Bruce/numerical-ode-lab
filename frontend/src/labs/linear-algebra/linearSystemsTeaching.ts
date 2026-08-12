import {
  createNativeMath,
  mathFraction,
  mathIdentifier,
  mathNumberLiteral,
  mathOperator,
  mathRow,
  mathTable,
} from "../../math/nativeMath";
import {
  createPluRelation,
  createSolvedSystemEquation,
  createSystemEquation,
  indexedNode,
  multiplyNodes,
  xHatNode,
} from "./linearSystemsMath";

export interface LinearSystemsTeachingConcept {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
}

export interface LinearSystemsMethodTeachingGroup {
  readonly id: string;
  readonly title: string;
  readonly concepts: readonly LinearSystemsTeachingConcept[];
  readonly formula: "multiplier" | "plu" | "triangular-solves";
}

export interface LinearSystemsMethodTeachingProfile {
  readonly id: string;
  readonly learnerLabel: string;
  readonly family: "direct" | "iterative";
  readonly overview: string;
  readonly algorithmSteps: readonly string[];
  readonly conceptGroups: readonly LinearSystemsMethodTeachingGroup[];
}

export const GEPP_METHOD_TEACHING_PROFILE: LinearSystemsMethodTeachingProfile =
  Object.freeze({
    id: "gepp",
    learnerLabel: "Gaussian elimination with partial pivoting",
    family: "direct",
    overview:
      "Gaussian elimination reduces the original system to triangular systems whose components can be solved in a known order.",
    algorithmSteps: Object.freeze([
      "Choose a pivot in the active column.",
      "Swap rows when another available row has the selected pivot.",
      "Use row operations to eliminate entries below the pivot.",
      "Continue column by column until U is upper triangular.",
      "Record the permutations and multipliers in P A = L U.",
      "Solve L y = P b by forward substitution.",
      "Solve U x hat = y by backward substitution, then check the residual.",
    ]),
    conceptGroups: Object.freeze([
      Object.freeze({
        id: "pivot-elimination",
        title: "1. Pivot and eliminate",
        formula: "multiplier" as const,
        concepts: Object.freeze([
          Object.freeze({
            id: "pivot",
            term: "Pivot",
            definition:
              "The active entry used to eliminate entries below it in the current column.",
          }),
          Object.freeze({
            id: "partial-pivoting",
            term: "Partial pivoting",
            definition:
              "Compare the available magnitudes, choose the first largest entry, and swap rows when needed.",
          }),
          Object.freeze({
            id: "row-operation",
            term: "Row operation",
            definition:
              "A permitted transformation of rows used to produce an equivalent linear system.",
          }),
          Object.freeze({
            id: "elimination-multiplier",
            term: "Elimination multiplier",
            definition:
              "The scale factor used when subtracting the pivot row from a target row.",
          }),
        ]),
      }),
      Object.freeze({
        id: "factorization",
        title: "2. Read the factorization",
        formula: "plu" as const,
        concepts: Object.freeze([
          Object.freeze({
            id: "permutation-matrix",
            term: "Permutation matrix",
            definition: "P records how the rows were reordered during pivoting.",
          }),
          Object.freeze({
            id: "plu-factorization",
            term: "PLU factorization",
            definition:
              "P A = L U records row order in P, elimination multipliers in L, and the final upper-triangular matrix in U.",
          }),
        ]),
      }),
      Object.freeze({
        id: "triangular-solves",
        title: "3. Solve the triangular systems",
        formula: "triangular-solves" as const,
        concepts: Object.freeze([
          Object.freeze({
            id: "forward-substitution",
            term: "Lower triangular and forward substitution",
            definition:
              "With zeros above the diagonal, solve L y = P b from top to bottom.",
          }),
          Object.freeze({
            id: "backward-substitution",
            term: "Upper triangular and backward substitution",
            definition:
              "With zeros below the diagonal, solve U x hat = y from bottom to top.",
          }),
        ]),
      }),
    ]),
  });

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function role(
  symbol: "A" | "x" | "b",
  name: string,
  description: string
): HTMLElement {
  const item = el("article", undefined, "ls-system-role");
  item.dataset.systemRole = symbol;
  item.append(
    createNativeMath(mathIdentifier(symbol), symbol, {
      className: "ls-role-symbol",
      dataMath: `system-role-${symbol}`,
    }),
    el("h3", name),
    el("p", description)
  );
  return item;
}

function status(label: string, state: "available" | "planned"): HTMLElement {
  const badge = el("span", label, `ls-method-status is-${state}`);
  badge.dataset.methodStatus = state;
  return badge;
}

function concept(item: LinearSystemsTeachingConcept): HTMLElement {
  const definition = el("div", undefined, "ls-concept-item");
  definition.dataset.teachingConcept = item.id;
  definition.append(el("dt", item.term), el("dd", item.definition));
  return definition;
}

function multiplierFormula(): HTMLElement {
  return createNativeMath(
    [
      indexedNode("m", 1, 0),
      mathOperator("="),
      mathFraction(indexedNode("U", 1, 0), indexedNode("U", 0, 0)),
    ],
    "m sub 2 1 equals U sub 2 1 divided by U sub 1 1",
    { className: "ls-concept-formula", dataMath: "elimination-multiplier" }
  );
}

function forwardRelation(): HTMLElement {
  return createNativeMath(
    [
      multiplyNodes(mathIdentifier("L"), mathIdentifier("y")),
      mathOperator("="),
      multiplyNodes(mathIdentifier("P"), mathIdentifier("b")),
    ],
    "L times y equals P times b",
    { className: "ls-concept-formula", dataMath: "forward-substitution-relation" }
  );
}

function backwardRelation(): HTMLElement {
  return createNativeMath(
    [
      multiplyNodes(mathIdentifier("U"), xHatNode()),
      mathOperator("="),
      mathIdentifier("y"),
    ],
    "U times x hat equals y",
    { className: "ls-concept-formula", dataMath: "backward-substitution-relation" }
  );
}

function createTwoEquationExample(): HTMLElement {
  const example = el("article", undefined, "ls-linear-system-example");
  example.dataset.linearSystemExample = "true";
  const equations = createNativeMath(
    mathTable([
      [
        mathRow([
          multiplyNodes(mathNumberLiteral("2"), indexedNode("x", 0)),
          mathOperator("+"),
          indexedNode("x", 1),
          mathOperator("="),
          mathNumberLiteral("5"),
        ]),
      ],
      [
        mathRow([
          indexedNode("x", 0),
          mathOperator("−"),
          multiplyNodes(mathNumberLiteral("3"), indexedNode("x", 1)),
          mathOperator("="),
          mathNumberLiteral("−1"),
        ]),
      ],
    ]),
    "two x 1 plus x 2 equals 5; x 1 minus three x 2 equals minus 1",
    {
      className: "ls-two-equation-reading",
      display: "block",
      dataMath: "two-equation-example",
    }
  );
  const matrixForm = createSolvedSystemEquation(
    [
      [2, 1],
      [1, -3],
    ],
    [5, -1],
    {
      className: "ls-two-equation-matrix-form",
      dataMath: "two-equation-matrix-form",
    }
  );
  example.append(
    el("p", "Read two equations as one system", "ls-example-label"),
    equations,
    el("p", "The same two equations in matrix form", "ls-example-bridge"),
    matrixForm
  );
  return example;
}

function createUniversalTeaching(): HTMLElement {
  const universal = el("div", undefined, "ls-universal-teaching");
  universal.dataset.universalLinearSystemsTeaching = "true";

  const problem = el("section", undefined, "ls-method-problem");
  problem.dataset.methodProblem = "true";
  const problemHeading = el("h2", "What are we solving?");
  problemHeading.tabIndex = -1;
  const definition = el(
    "p",
    "A linear system is a collection of multiple linear equations written together in the compact form A x = b.",
    "ls-method-definition"
  );
  definition.dataset.linearSystemDefinition = "true";
  const roles = el("div", undefined, "ls-system-roles");
  roles.append(
    role(
      "A",
      "Coefficient matrix",
      "Contains the coefficients that multiply the unknown components."
    ),
    role("x", "Unknown vector", "Contains the values we want to determine."),
    role(
      "b",
      "Right-hand side vector",
      "The known vector of constants on the right-hand side. It is the target vector that A x must equal."
    )
  );
  problem.append(
    el("p", "The problem", "ls-eyebrow"),
    problemHeading,
    createSystemEquation("ls-problem-equation"),
    definition,
    roles,
    createTwoEquationExample()
  );

  const families = el("section", undefined, "ls-method-section");
  families.append(
    el("p", "The method landscape", "ls-eyebrow"),
    el("h3", "Direct and iterative methods")
  );
  const familyLayout = el("div", undefined, "ls-method-families");
  const direct = el("article", undefined, "ls-method-family is-direct");
  direct.dataset.methodFamily = "direct";
  direct.append(
    el("h4", "Direct methods"),
    el(
      "p",
      "Transform or factorize the finite system, then solve the resulting simpler systems. Gaussian elimination is the direct method used here."
    )
  );
  const iterative = el("article", undefined, "ls-method-family is-iterative");
  iterative.dataset.methodFamily = "iterative";
  const planned = el("ul", undefined, "ls-planned-methods");
  const jacobi = el("li");
  jacobi.append(el("strong", "Jacobi"), status("Planned", "planned"));
  const gaussSeidel = el("li");
  gaussSeidel.append(el("strong", "Gauss–Seidel"), status("Planned", "planned"));
  planned.append(jacobi, gaussSeidel);
  iterative.append(
    el("h4", "Iterative methods"),
    el(
      "p",
      "Start from an approximation and generate successive approximations. A future run also needs a stopping rule and may stop without convergence."
    ),
    planned
  );
  familyLayout.append(direct, iterative);
  families.append(familyLayout);
  universal.append(problem, families);
  return universal;
}

function renderProfileFormula(
  formula: LinearSystemsMethodTeachingGroup["formula"]
): readonly HTMLElement[] {
  if (formula === "multiplier") return [multiplierFormula()];
  if (formula === "plu") return [createPluRelation(false, "ls-concept-formula")];
  return [forwardRelation(), backwardRelation()];
}

function createSelectedMethodTeaching(
  profile: LinearSystemsMethodTeachingProfile
): HTMLElement {
  const selected = el("section", undefined, "ls-selected-method");
  selected.dataset.selectedMethod = profile.id;
  selected.dataset.selectedMethodTeaching = profile.id;
  const selectedHeading = el("div", undefined, "ls-selected-method-heading");
  selectedHeading.append(
    el("h3", `How ${profile.learnerLabel} works`),
    status("Available · Used in this Lab", "available")
  );
  const outline = el("ol", undefined, "ls-algorithm-outline");
  profile.algorithmSteps.forEach((item) => outline.append(el("li", item)));
  selected.append(
    el("p", "Selected runnable method", "ls-eyebrow"),
    selectedHeading,
    el("p", profile.overview),
    outline
  );

  const concepts = el("div", undefined, "ls-concept-path");
  concepts.append(el("p", "Selected-method concepts", "ls-eyebrow"));
  profile.conceptGroups.forEach((group) => {
    const band = el("article", undefined, "ls-concept-band");
    band.dataset.methodConceptGroup = group.id;
    const terms = el("dl", undefined, "ls-concept-list");
    group.concepts.forEach((item) => terms.append(concept(item)));
    const formulas = el("div", undefined, "ls-concept-formulas");
    formulas.append(...renderProfileFormula(group.formula));
    band.append(el("h4", group.title), terms, formulas);
    concepts.append(band);
  });
  selected.append(concepts);
  return selected;
}

function createResultCheckingTeaching(): HTMLElement {
  const checking = el("section", undefined, "ls-method-section ls-result-checking");
  checking.dataset.methodResultCheck = "true";
  checking.append(
    el("p", "After the solve", "ls-eyebrow"),
    el("h3", "Checking the result"),
    createNativeMath(
      [
        mathIdentifier("r"),
        mathOperator("="),
        mathIdentifier("b"),
        mathOperator("−"),
        multiplyNodes(mathIdentifier("A"), xHatNode()),
      ],
      "r equals b minus A times x hat",
      { className: "ls-concept-formula", dataMath: "residual-relation" }
    ),
    el(
      "p",
      "The residual measures equation mismatch: it checks how closely the computed solution satisfies the original equations."
    ),
    el(
      "p",
      "Conditioning describes how sensitive the solution can be to small changes in the problem data. This Lab does not compute a condition number, so a small residual does not by itself guarantee a small solution error."
    )
  );
  return checking;
}

export function createLinearSystemsMethodTeaching(
  methodProfile: LinearSystemsMethodTeachingProfile = GEPP_METHOD_TEACHING_PROFILE
): HTMLElement {
  const content = el("div", undefined, "ls-method-v2");
  content.append(
    createUniversalTeaching(),
    createSelectedMethodTeaching(methodProfile),
    createResultCheckingTeaching()
  );
  return content;
}
