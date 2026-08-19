// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { createComputationWalkthroughShell } from "./computationWalkthroughShell";
import { createEvidenceBlock } from "./evidenceBlock";
import { createPrimaryResult } from "./primaryResult";
import { createProblemContext } from "./problemContext";
import {
  createAdvancedDetails,
  createNumericalTable,
} from "./supportingElements";
import { createTeachingBlock } from "./teachingBlock";

function heading(level: 2 | 3 | 4 | 5, text: string): HTMLHeadingElement {
  const node = document.createElement(`h${level}`);
  node.textContent = text;
  return node;
}

function paragraph(text: string): HTMLParagraphElement {
  const node = document.createElement("p");
  node.textContent = text;
  return node;
}

function mathOwner(label: string): HTMLElement {
  const owner = document.createElement("span");
  owner.setAttribute("role", "math");
  owner.setAttribute("aria-label", label);
  const visual = document.createElementNS(
    "http://www.w3.org/1998/Math/MathML",
    "math"
  );
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = label;
  owner.append(visual);
  return owner;
}

describe("Phase 2 Lab presentation primitives", () => {
  beforeEach(() => document.body.replaceChildren());

  it("labels ProblemContext, retains supplied math by identity, and exposes visible stale provenance", () => {
    const title = heading(3, "Linear system snapshot");
    const formula = mathOwner("A times x equals b");
    const provenance = paragraph("Starter system · successful Run 04");
    const stale = paragraph("Stale result · Data has changed since this run.");
    const parameterValue = mathOwner("three by three");
    const context = createProblemContext({
      heading: title,
      statement: formula,
      parameters: [{ label: "System size", value: parameterValue }],
      provenance,
      staleNote: stale,
    });

    expect(context.tagName).toBe("SECTION");
    expect(context.getAttribute("aria-labelledby")).toBe(title.id);
    expect(context.querySelector("[data-problem-statement] > [role='math']")).toBe(
      formula
    );
    expect(context.querySelectorAll("[role='math']")).toHaveLength(2);
    expect(context.querySelector("[data-problem-parameter-value]")).toContain(
      parameterValue
    );
    expect(context.querySelector("[data-problem-provenance]")).toBe(provenance);
    expect(context.querySelector("[data-problem-stale-note]")).toBe(stale);
    expect(context.textContent).toContain("Stale result");
    expect(context.querySelector("[role='status'], [role='alert']")).toBeNull();
  });

  it("builds a TeachingBlock from optional authored meaning, math, definitions, steps, examples, limitation, and detail", () => {
    const title = heading(3, "Why the pivot matters");
    const eyebrow = paragraph("Core meaning");
    const lead = paragraph("The pivot anchors the next elimination step.");
    const formula = mathOwner("row two minus multiplier times row one");
    const definitions = document.createElement("dl");
    definitions.append(
      Object.assign(document.createElement("dt"), { textContent: "Pivot" }),
      Object.assign(document.createElement("dd"), {
        textContent: "The active entry used for elimination.",
      })
    );
    const steps = document.createElement("ol");
    steps.append(
      Object.assign(document.createElement("li"), { textContent: "Select" }),
      Object.assign(document.createElement("li"), { textContent: "Eliminate" })
    );
    const example = paragraph("Example · compare candidate magnitudes first.");
    const limitation = paragraph("A pivot safeguard is not a proof of singularity.");
    const detailBody = paragraph("The threshold scales with the original matrix.");
    const advanced = createAdvancedDetails({
      summary: "Implementation detail",
      content: [detailBody],
    });
    const teaching = createTeachingBlock({
      eyebrow,
      heading: title,
      lead,
      math: [formula],
      definitions,
      steps,
      examples: [example],
      limitation,
      advancedDetails: advanced,
    });

    expect(teaching.getAttribute("aria-labelledby")).toBe(title.id);
    expect(teaching.querySelector("[data-teaching-eyebrow]")).toBe(eyebrow);
    expect(teaching.querySelector("[data-teaching-lead]")).toBe(lead);
    expect(teaching.querySelector("[data-teaching-math] > [role='math']")).toBe(
      formula
    );
    expect(teaching.querySelector("dl[data-teaching-definitions]")).toBe(
      definitions
    );
    expect(teaching.querySelector("ol[data-teaching-steps]")).toBe(steps);
    expect(teaching.querySelector("[data-teaching-example]")).toBe(example);
    expect(teaching.querySelector("[data-teaching-limitation]")).toBe(
      limitation
    );
    expect(teaching.querySelector("details[data-advanced-details]")).toBe(
      advanced
    );
  });

  it("allows a compact TeachingBlock without mandatory card layers", () => {
    const title = heading(3, "One useful distinction");
    const lead = paragraph("Residual measures equation mismatch.");
    const teaching = createTeachingBlock({ heading: title, lead });

    expect(teaching.children).toHaveLength(2);
    expect(teaching.querySelector("article, aside, details, dl, ol, ul")).toBeNull();
    expect(teaching.dataset.teachingBlock).toBe("true");
  });

  it("orders PrimaryResult status and problem context before one explicitly labelled answer", () => {
    const problemHeading = heading(4, "Problem");
    const problem = createProblemContext({
      heading: problemHeading,
      statement: mathOwner("A times x equals b"),
    });
    const resultHeading = heading(3, "Problem and computed solution");
    const status = paragraph("Current result");
    const answerLabel = paragraph("Computed solution");
    const answer = mathOwner("x hat equals one, two, minus one");
    const metrics = document.createElement("dl");
    metrics.append(
      Object.assign(document.createElement("dt"), { textContent: "Residual" }),
      Object.assign(document.createElement("dd"), { textContent: "2.31 × 10^-14" })
    );
    const result = createPrimaryResult({
      heading: resultHeading,
      status,
      problemContext: problem,
      primaryAnswer: { label: answerLabel, content: answer },
      metrics,
    });

    const children = [...result.children];
    expect(result.getAttribute("aria-labelledby")).toBe(resultHeading.id);
    expect(children.indexOf(status)).toBeLessThan(children.indexOf(problem));
    expect(children.indexOf(problem)).toBeLessThan(
      children.indexOf(result.querySelector("[data-primary-result-answers]")!)
    );
    const answerRegion = result.querySelector<HTMLElement>("[data-primary-answer]")!;
    expect(answerRegion.getAttribute("aria-labelledby")).toBe(answerLabel.id);
    expect(answerRegion.querySelector("[role='math']")).toBe(answer);
    expect(result.querySelector("[data-primary-result-metrics]")).toBe(metrics);
    expect(result.querySelectorAll("[role='math']")).toHaveLength(2);
  });

  it("keeps comparison answer labels explicit and supports visible stale text", () => {
    const firstLabel = paragraph("Forward Euler");
    const secondLabel = paragraph("Runge–Kutta 4");
    const stale = paragraph("Stale comparison · run again after changing Data.");
    const result = createPrimaryResult({
      heading: heading(3, "Method comparison"),
      status: stale,
      statusTone: "stale",
      primaryAnswer: {
        label: firstLabel,
        content: mathOwner("Forward Euler answer 0.12"),
      },
      comparisonAnswer: {
        label: secondLabel,
        content: mathOwner("Runge Kutta answer 0.14"),
      },
    });

    expect(result.querySelector("[data-primary-result-status]")).toBe(stale);
    expect(stale.dataset.resultStatusTone).toBe("stale");
    expect(result.textContent).toContain("Stale comparison");
    expect(result.querySelectorAll("[data-result-answer]")).toHaveLength(2);
    expect(result.querySelector("[data-primary-answer] > :first-child")).toBe(
      firstLabel
    );
    expect(result.querySelector("[data-comparison-answer] > :first-child")).toBe(
      secondLabel
    );
  });

  it("distinguishes exactly three EvidenceBlock levels and retains a chart slot by identity", () => {
    const chart = document.createElement("figure");
    chart.setAttribute("aria-label", "Authored error chart frame");
    const blocks = (["summary", "standard", "advanced"] as const).map(
      (level, index) =>
        createEvidenceBlock({
          level,
          heading: heading(3, `${level} evidence`),
          lead: paragraph(`Evidence level ${index + 1}`),
          chart: level === "standard" ? chart : undefined,
        })
    );

    expect(blocks.map((block) => block.dataset.evidenceLevel)).toEqual([
      "summary",
      "standard",
      "advanced",
    ]);
    for (const block of blocks) {
      expect(block.getAttribute("aria-labelledby")).toBe(
        block.querySelector("h3")?.id
      );
    }
    expect(blocks[1]?.querySelector("[data-evidence-chart] > figure")).toBe(chart);
  });

  it("creates a contained semantic NumericalTable with caption, scoped headers, and numeric cells", () => {
    const error = mathOwner("two point three one times ten to the minus fourteen");
    const frame = createNumericalTable({
      caption: "Refinement evidence",
      rowHeader: "Level",
      columns: [
        { label: "Step size", numeric: true },
        { label: "Maximum error", numeric: true },
      ],
      rows: [
        { label: "0", cells: ["0.2", "0.031"] },
        { label: "1", cells: ["0.1", error] },
      ],
    });

    const table = frame.querySelector("table")!;
    expect(frame.dataset.numericalTableContainment).toBe("local");
    expect(table.querySelector("caption")?.textContent).toBe("Refinement evidence");
    expect(table.querySelectorAll("thead th[scope='col']")).toHaveLength(3);
    expect(table.querySelectorAll("tbody th[scope='row']")).toHaveLength(2);
    expect(table.querySelectorAll("td[data-numeric='true']")).toHaveLength(4);
    expect(table.querySelector("tbody [role='math']")).toBe(error);
  });

  it("uses native closed AdvancedDetails with a native summary", () => {
    const body = paragraph("Arithmetic detail remains subordinate.");
    const details = createAdvancedDetails({
      summary: "Show arithmetic detail",
      content: [body],
    });

    expect(details.tagName).toBe("DETAILS");
    expect(details.open).toBe(false);
    expect(details.querySelector(":scope > summary")?.textContent).toBe(
      "Show arithmetic detail"
    );
    expect(details.lastChild).toBe(body);
  });

  it("renders ordered walkthrough phases and source-operation-target corridors without inventing evidence", () => {
    const before = mathOwner("matrix before");
    const operation = mathOwner("row two minus one half row one");
    const after = mathOwner("matrix after");
    const failure = paragraph("Failure boundary · no later step is claimed.");
    const completion = paragraph("Completion evidence · solution recovered.");
    const shell = createComputationWalkthroughShell({
      heading: heading(3, "Computation walkthrough"),
      purpose: paragraph("Follow the stored operation sequence."),
      phases: [
        {
          heading: heading(4, "Factorization"),
          steps: [
            {
              heading: heading(5, "Eliminate entry below the pivot"),
              corridor: { source: before, operation, target: after },
            },
          ],
        },
        {
          heading: heading(4, "Solve"),
          steps: [
            {
              heading: heading(5, "Recover the solution"),
              content: [paragraph("Use the accepted substitution evidence.")],
            },
          ],
        },
      ],
      failureBoundary: failure,
      completionEvidence: completion,
    });

    expect(shell.querySelectorAll(":scope > ol > li")).toHaveLength(2);
    expect(
      [...shell.querySelectorAll("[data-walkthrough-part]")].map((node) =>
        node.getAttribute("data-walkthrough-part")
      )
    ).toEqual(["source", "operation", "target"]);
    expect(shell.querySelector("[data-walkthrough-part='source'] [role='math']")).toBe(
      before
    );
    expect(shell.querySelector("[data-walkthrough-part='operation'] [role='math']")).toBe(
      operation
    );
    expect(shell.querySelector("[data-walkthrough-part='target'] [role='math']")).toBe(
      after
    );
    expect(shell.querySelector("[data-walkthrough-failure]")).toBe(failure);
    expect(shell.querySelector("[data-walkthrough-completion]")).toBe(completion);
  });

  it("keeps Phase 2 sources presentation-only and free of node cloning, Motion, and Trace authority", async () => {
    const modules = await Promise.all([
      import("./problemContext.ts?raw"),
      import("./teachingBlock.ts?raw"),
      import("./primaryResult.ts?raw"),
      import("./evidenceBlock.ts?raw"),
      import("./computationWalkthroughShell.ts?raw"),
      import("./supportingElements.ts?raw"),
    ]);
    const source = modules.map((module) => module.default).join("\n");

    expect(source).not.toMatch(
      /labs\/(?:ode|linear-algebra)|app\/(?:router|appSessionStore)|@numerical-t-lab|chart\.js|mathlive|compute-engine|Tutor|Glossary|ComputationTrace|computationTrace|computationMotion|MotionController|convergenceStudy/
    );
    expect(source).not.toMatch(/cloneNode|innerHTML|outerHTML|XMLSerializer/);
    expect(source).not.toMatch(/react|vue|svelte/i);
  });
});
