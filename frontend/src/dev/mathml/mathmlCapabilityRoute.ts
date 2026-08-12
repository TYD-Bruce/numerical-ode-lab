import type { RouteModule } from "../../app/contracts";
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
} from "../../math/nativeMath";
import "./mathmlCapability.css";

function xHat() {
  return mathOver(mathIdentifier("x"), mathOperator("^"));
}

function indexed(base: string, index: string) {
  return mathSubscript(mathIdentifier(base), mathNumberLiteral(index));
}

function multiply(left: Element, right: Element) {
  return mathRow([left, mathOperator("⁢"), right]);
}

function numericMatrix(values: readonly (readonly number[])[]) {
  return mathMatrix(
    values.map((row) => row.map((value) => mathNumber(value, "matrix")))
  );
}

function createCase(
  id: string,
  title: string,
  note: string,
  content: Node
): HTMLElement {
  const section = document.createElement("section");
  section.className = "mathml-capability-case";
  section.dataset.mathmlCase = id;
  const heading = document.createElement("h2");
  heading.textContent = title;
  const explanation = document.createElement("p");
  explanation.textContent = note;
  const stage = document.createElement("div");
  stage.className = "mathml-capability-stage";
  stage.append(content);
  section.append(heading, explanation, stage);
  return section;
}

function computedSolutionCase(): HTMLElement {
  return createCase(
    "computed-solution",
    "1. Computed solution",
    "Primary acceptance case: one accented symbol and one column vector.",
    createNativeMath(
      [
        xHat(),
        mathOperator("="),
        numericMatrix([[1], [2], [-1]]),
      ],
      "x hat equals the column vector 1, 2, minus 1",
      { className: "mathml-capability-hero-formula", display: "block" }
    )
  );
}

function denseMatrixCase(): HTMLElement {
  return createCase(
    "dense-matrix",
    "2. Dense matrix",
    "A mathematical matrix, not an input spreadsheet.",
    createNativeMath(
      [
        mathIdentifier("A"),
        mathOperator("="),
        numericMatrix([
          [3, 1, -1],
          [2, 4, 1],
          [-1, 2, 5],
        ]),
      ],
      "A equals the matrix with rows 3, 1, minus 1; 2, 4, 1; minus 1, 2, 5",
      { display: "block" }
    )
  );
}

function multiplierCase(): HTMLElement {
  return createCase(
    "multiplier",
    "3. Elimination multiplier",
    "Structural indices and fractions remain compact enough for a walkthrough.",
    createNativeMath(
      [
        indexed("m", "21"),
        mathOperator("="),
        mathFraction(indexed("U", "21"), indexed("U", "11")),
        mathOperator("="),
        mathFraction(mathNumberLiteral("2"), mathNumberLiteral("3")),
      ],
      "m sub 2 1 equals U sub 2 1 divided by U sub 1 1 equals two thirds",
      { display: "block" }
    )
  );
}

function transformationCase(): HTMLElement {
  const composition = document.createElement("div");
  composition.className = "mathml-transformation";
  const before = createNativeMath(
    numericMatrix([
      [3, 1, -1],
      [2, 4, 1],
      [-1, 2, 5],
    ]),
    "before: matrix with rows 3, 1, minus 1; 2, 4, 1; minus 1, 2, 5",
    { className: "mathml-transformation-matrix", display: "block" }
  );
  const operationWrap = document.createElement("div");
  operationWrap.className = "mathml-transformation-operation";
  const arrow = document.createElement("span");
  arrow.className = "mathml-transformation-arrow";
  arrow.setAttribute("aria-hidden", "true");
  const operation = createNativeMath(
    [
      indexed("R", "2"),
      mathOperator("←"),
      indexed("R", "2"),
      mathOperator("−"),
      mathFraction(mathNumberLiteral("2"), mathNumberLiteral("3")),
      indexed("R", "1"),
    ],
    "row 2 becomes row 2 minus two thirds of row 1"
  );
  operationWrap.append(arrow, operation);
  const after = createNativeMath(
    mathMatrix([
      [mathNumberLiteral("3"), mathNumberLiteral("1"), mathNumberLiteral("−1")],
      [
        mathNumberLiteral("0"),
        mathFraction(mathNumberLiteral("10"), mathNumberLiteral("3")),
        mathFraction(mathNumberLiteral("5"), mathNumberLiteral("3")),
      ],
      [mathNumberLiteral("−1"), mathNumberLiteral("2"), mathNumberLiteral("5")],
    ]),
    "after: matrix with rows 3, 1, minus 1; 0, ten thirds, five thirds; minus 1, 2, 5",
    { className: "mathml-transformation-matrix", display: "block" }
  );
  composition.append(before, operationWrap, after);

  return createCase(
    "transformation",
    "4. Matrix transformation",
    "Hybrid composition: MathML owns mathematical objects; controlled CSS owns responsive flow and arrow geometry.",
    composition
  );
}

function normCase(): HTMLElement {
  const norm = mathSubscript(
    mathRow([
      mathOperator("‖", { fence: true, stretchy: true }),
      mathIdentifier("r"),
      mathOperator("‖", { fence: true, stretchy: true }),
    ]),
    mathIdentifier("∞")
  );
  return createCase(
    "infinity-norm",
    "5. Infinity norm",
    "The scientific value remains one mathematical object.",
    createNativeMath(
      [norm, mathOperator("="), mathNumber(8.881784e-16, "diagnostic")],
      "the infinity norm of r equals 8.881784 times ten to the minus 16",
      { display: "block" }
    )
  );
}

function pluCase(): HTMLElement {
  const group = document.createElement("div");
  group.className = "mathml-plu-variants";
  const formula = () =>
    createNativeMath(
      [
        multiply(mathIdentifier("P"), mathIdentifier("A")),
        mathOperator("="),
        multiply(mathIdentifier("L"), mathIdentifier("U")),
      ],
      "P A equals L U"
    );
  group.append(formula());
  const teachingBlock = document.createElement("div");
  teachingBlock.className = "mathml-teaching-block";
  const label = document.createElement("strong");
  label.textContent = "Factorization result";
  teachingBlock.append(label, formula());
  group.append(teachingBlock);
  return createCase(
    "plu",
    "6. PLU factorization",
    "The same mathematical atom works alone and inside a teaching block.",
    group
  );
}

function forwardSubstitutionCase(): HTMLElement {
  const pb = mathSubscript(
    mathRow([mathIdentifier("P"), mathOperator("⁢"), mathIdentifier("b")]),
    mathNumberLiteral("2")
  );
  const knownTerm = multiply(indexed("L", "21"), indexed("y", "1"));
  return createCase(
    "forward-substitution",
    "7. Forward substitution",
    "Grouped subscripts and precedence remain explicit.",
    createNativeMath(
      [
        indexed("y", "2"),
        mathOperator("="),
        mathFraction(
          mathRow([
            mathOperator("("),
            pb,
            mathOperator("−"),
            knownTerm,
            mathOperator(")"),
          ]),
          indexed("L", "22")
        ),
      ],
      "y sub 2 equals open parenthesis P b sub 2 minus L sub 2 1 times y sub 1 close parenthesis divided by L sub 2 2",
      { display: "block" }
    )
  );
}

function backwardSubstitutionCase(): HTMLElement {
  const knownTerm = multiply(
    indexed("U", "23"),
    mathSubscript(xHat(), mathNumberLiteral("3"))
  );
  return createCase(
    "backward-substitution",
    "8. Backward substitution",
    "The hat remains correctly attached when the symbol is also indexed.",
    createNativeMath(
      [
        mathSubscript(xHat(), mathNumberLiteral("2")),
        mathOperator("="),
        mathFraction(
          mathRow([
            mathOperator("("),
            indexed("y", "2"),
            mathOperator("−"),
            knownTerm,
            mathOperator(")"),
          ]),
          indexed("U", "22")
        ),
      ],
      "x hat sub 2 equals open parenthesis y sub 2 minus U sub 2 3 times x hat sub 3 close parenthesis divided by U sub 2 2",
      { display: "block" }
    )
  );
}

export function createMathmlCapabilityRoute(): RouteModule {
  return {
    mount({ target }) {
      const page = document.createElement("article");
      page.className = "platform-page mathml-capability";
      const heading = document.createElement("header");
      heading.className = "platform-page-heading mathml-capability-heading";
      const eyebrow = document.createElement("p");
      eyebrow.className = "mathml-capability-eyebrow";
      eyebrow.textContent = "Development fixture · Teaching v2 Phase 0";
      const title = document.createElement("h1");
      title.tabIndex = -1;
      title.dataset.routeFocus = "true";
      title.textContent = "MathML Teaching Capability";
      const intro = document.createElement("p");
      intro.textContent =
        "A removable browser fixture for authored Linear Systems mathematics. It does not replace the current product presentation.";
      heading.append(eyebrow, title, intro);
      const cases = document.createElement("div");
      cases.className = "mathml-capability-grid";
      cases.append(
        computedSolutionCase(),
        denseMatrixCase(),
        multiplierCase(),
        transformationCase(),
        normCase(),
        pluCase(),
        forwardSubstitutionCase(),
        backwardSubstitutionCase()
      );
      page.append(heading, cases);
      target.replaceChildren(page);

      return {
        dispose(): void {
          target.replaceChildren();
        },
      };
    },
  };
}
