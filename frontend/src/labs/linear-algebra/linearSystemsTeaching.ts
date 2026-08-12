import {
  createNativeMath,
  mathFraction,
  mathIdentifier,
  mathOperator,
} from "../../math/nativeMath";
import {
  createPluRelation,
  createSystemEquation,
  indexedNode,
  multiplyNodes,
  xHatNode,
} from "./linearSystemsMath";

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

function concept(
  term: string,
  definition: string,
  dataConcept: string
): HTMLElement {
  const item = el("div", undefined, "ls-concept-item");
  item.dataset.teachingConcept = dataConcept;
  item.append(el("dt", term), el("dd", definition));
  return item;
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

export function createLinearSystemsMethodTeaching(): HTMLElement {
  const content = el("div", undefined, "ls-method-v2");

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
    role("A", "Coefficient matrix", "Contains the coefficients that multiply the unknown components."),
    role("x", "Unknown vector", "Contains the values we want to determine."),
    role("b", "Right-hand side", "Contains the known values the equations must match.")
  );
  problem.append(
    el("p", "The problem", "ls-eyebrow"),
    problemHeading,
    createSystemEquation("ls-problem-equation"),
    definition,
    roles
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

  const selected = el("section", undefined, "ls-selected-method");
  selected.dataset.selectedMethod = "gepp";
  const selectedHeading = el("div", undefined, "ls-selected-method-heading");
  selectedHeading.append(
    el("h3", "Gaussian elimination with partial pivoting"),
    status("Available · Used in this Lab", "available")
  );
  const outline = el("ol", undefined, "ls-algorithm-outline");
  [
    "Choose a pivot in the active column.",
    "Swap rows when another available row has the selected pivot.",
    "Use row operations to eliminate entries below the pivot.",
    "Continue column by column until U is upper triangular.",
    "Record the permutations and multipliers in P A = L U.",
    "Solve L y = P b by forward substitution.",
    "Solve U x hat = y by backward substitution, then check the residual.",
  ].forEach((item) => outline.append(el("li", item)));
  selected.append(
    el("p", "Selected runnable method", "ls-eyebrow"),
    selectedHeading,
    el(
      "p",
      "Gaussian elimination reduces the original system to triangular systems whose components can be solved in a known order."
    ),
    outline
  );

  const concepts = el("section", undefined, "ls-method-section ls-concept-path");
  concepts.append(
    el("p", "Concepts in computation order", "ls-eyebrow"),
    el("h3", "What the algorithm records")
  );

  const elimination = el("article", undefined, "ls-concept-band");
  elimination.append(el("h4", "1. Pivot and eliminate"));
  const eliminationTerms = el("dl", undefined, "ls-concept-list");
  eliminationTerms.append(
    concept("Pivot", "The active entry used to eliminate entries below it in the current column.", "pivot"),
    concept("Partial pivoting", "Compare the available magnitudes, choose the first largest entry, and swap rows when needed.", "partial-pivoting"),
    concept("Row operation", "A permitted transformation of rows used to produce an equivalent linear system.", "row-operation"),
    concept("Elimination multiplier", "The scale factor used when subtracting the pivot row from a target row.", "elimination-multiplier")
  );
  elimination.append(eliminationTerms, multiplierFormula());

  const factorization = el("article", undefined, "ls-concept-band");
  factorization.append(
    el("h4", "2. Read the factorization"),
    createPluRelation(false, "ls-concept-formula"),
    el(
      "p",
      "Permutation matrix P records row order, unit lower triangular L records elimination multipliers, and upper triangular U is the final eliminated matrix."
    )
  );

  const solve = el("article", undefined, "ls-concept-band");
  const solveFormulas = el("div", undefined, "ls-concept-formulas");
  solveFormulas.append(forwardRelation(), backwardRelation());
  const solveTerms = el("dl", undefined, "ls-concept-list");
  solveTerms.append(
    concept("Lower triangular", "All entries above the diagonal are zero, so forward substitution solves from top to bottom.", "lower-triangular"),
    concept("Upper triangular", "All entries below the diagonal are zero, so backward substitution solves from bottom to top.", "upper-triangular")
  );
  solve.append(el("h4", "3. Solve the triangular systems"), solveFormulas, solveTerms);
  concepts.append(elimination, factorization, solve);

  content.append(problem, families, selected, concepts);
  return content;
}
