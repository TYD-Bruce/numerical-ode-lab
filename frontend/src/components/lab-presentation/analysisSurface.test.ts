// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import { createAnalysisSurface } from "./analysisSurface";

function heading(level: 2 | 3 | 4 | 5 | 6, text: string): HTMLHeadingElement {
  const node = document.createElement(`h${level}`);
  node.textContent = text;
  return node;
}

function paragraph(text: string): HTMLParagraphElement {
  const node = document.createElement("p");
  node.textContent = text;
  return node;
}

describe("AnalysisSurface", () => {
  beforeEach(() => document.body.replaceChildren());

  it("labels the region and composes every optional authored role by identity", () => {
    const title = heading(3, "Residual analysis");
    const purpose = paragraph("Check the equation mismatch.");
    const setup = paragraph("Successful result context.");
    const status = paragraph("Current analysis.");
    const primaryFinding = paragraph("Residual infinity norm: 2.3e-14.");
    const firstEvidence = paragraph("Computed matrix-vector product.");
    const secondEvidence = document.createElement("table");
    const interpretation = paragraph("The equation mismatch is small.");
    const limitation = paragraph("Residual is not solution error.");
    const details = document.createElement("details");
    details.append(Object.assign(document.createElement("summary"), {
      textContent: "Advanced details",
    }));

    const surface = createAnalysisSurface({
      heading: title,
      purpose,
      setup,
      status,
      primaryFinding,
      evidence: [firstEvidence, secondEvidence],
      interpretation,
      limitation,
      advancedDetails: details,
    });

    expect(surface.tagName).toBe("SECTION");
    expect(surface.dataset.analysisSurface).toBe("true");
    expect(surface.getAttribute("aria-labelledby")).toBe(title.id);
    expect(surface.querySelector(":scope > .lab-analysis-surface-heading")).toBe(title);
    expect(surface.querySelector("[data-analysis-role='purpose'] > :first-child")).toBe(purpose);
    expect(surface.querySelector("[data-analysis-role='setup'] > :first-child")).toBe(setup);
    expect(surface.querySelector("[data-analysis-role='status'] > :first-child")).toBe(status);
    expect(surface.querySelector("[data-analysis-role='primary-finding'] > :first-child"))
      .toBe(primaryFinding);
    expect(
      [...surface.querySelector("[data-analysis-role='evidence']")!.children]
    ).toEqual([firstEvidence, secondEvidence]);
    expect(surface.querySelector("[data-analysis-role='interpretation'] > :first-child"))
      .toBe(interpretation);
    expect(surface.querySelector("[data-analysis-role='limitation'] > :first-child"))
      .toBe(limitation);
    expect(surface.querySelector("[data-analysis-role='advanced-details'] > details"))
      .toBe(details);
    expect(details.open).toBe(false);
    expect(surface.querySelector("[role='status'], [role='alert'], [aria-live]")).toBeNull();
  });

  it("supports caller-authored role order without inventing missing analysis content", () => {
    const purpose = paragraph("Why we check.");
    const limitation = paragraph("A residual is not solution error.");
    const evidence = paragraph("Residual vector.");
    const finding = paragraph("Residual infinity norm.");
    const surface = createAnalysisSurface({
      heading: heading(2, "Diagnostics — check the equation mismatch"),
      purpose,
      primaryFinding: finding,
      evidence: [evidence],
      limitation,
      slotOrder: ["purpose", "limitation", "evidence", "primary-finding"],
    });

    expect(
      [...surface.querySelectorAll<HTMLElement>(":scope > [data-analysis-role]")].map(
        (slot) => slot.dataset.analysisRole
      )
    ).toEqual(["purpose", "limitation", "evidence", "primary-finding"]);

    const empty = createAnalysisSurface({ heading: heading(4, "Not run") });
    expect(empty.children).toHaveLength(1);
    expect(empty.querySelector("[data-analysis-role]")).toBeNull();
    expect(empty.textContent).toBe("Not run");
  });

  it("supports repeated caller-authored evidence slots when the accepted story needs them", () => {
    const firstEvidence = paragraph("Substitution and mismatch evidence.");
    const finding = paragraph("Largest mismatch.");
    const interpretation = paragraph("Interpret the mismatch.");
    const qualifiedReference = paragraph("Qualified reference evidence.");
    const surface = createAnalysisSurface({
      heading: heading(2, "Diagnostics"),
      sections: [
        { role: "evidence", nodes: [firstEvidence] },
        { role: "primary-finding", nodes: [finding] },
        { role: "interpretation", nodes: [interpretation] },
        { role: "evidence", nodes: [qualifiedReference] },
      ],
    });

    expect(
      [...surface.querySelectorAll<HTMLElement>(":scope > [data-analysis-role]")].map(
        (slot) => slot.dataset.analysisRole
      )
    ).toEqual(["evidence", "primary-finding", "interpretation", "evidence"]);
    expect(surface.querySelectorAll("[data-analysis-role='evidence']")).toHaveLength(2);
    expect(surface.querySelectorAll("[data-analysis-role='evidence']")[0]?.firstChild)
      .toBe(firstEvidence);
    expect(surface.querySelectorAll("[data-analysis-role='evidence']")[1]?.firstChild)
      .toBe(qualifiedReference);
  });

  it("keeps generated labels unique and preserves caller-supplied h2 through h6", () => {
    const surfaces = ([2, 3, 4, 5, 6] as const).map((level) => {
      const title = heading(level, `Analysis h${level}`);
      const surface = createAnalysisSurface({ heading: title });
      expect(surface.querySelector(":scope > :first-child")).toBe(title);
      expect(title.tagName).toBe(`H${level}`);
      return surface;
    });
    const labels = surfaces.map((surface) => surface.getAttribute("aria-labelledby"));
    expect(labels.every(Boolean)).toBe(true);
    expect(new Set(labels).size).toBe(surfaces.length);
    labels.forEach((id, index) => {
      expect(surfaces[index]?.querySelector(`[id='${id}']`)).not.toBeNull();
    });
  });

  it("stays presentation-only and free of cloning, inference, and domain authority", async () => {
    const source = (await import("./analysisSurface.ts?raw")).default;

    expect(source).not.toMatch(
      /labs\/(?:ode|linear-algebra)|@numerical-t-lab|chart\.js|mathlive|compute-engine|Router|Session|Controller|Tutor|Glossary|ComputationTrace|convergence|residual|condition number|tauPivot|exact solution/i
    );
    expect(source).not.toMatch(
      /cloneNode|innerHTML|outerHTML|XMLSerializer|JSON\.stringify|createElementNS/
    );
    expect(source).not.toMatch(/aria-live|role\s*=\s*["'](?:status|alert)["']/);
    expect(source).not.toMatch(/react|vue|svelte/i);
  });
});
