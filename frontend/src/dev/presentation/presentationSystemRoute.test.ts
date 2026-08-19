// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPresentationSystemRoute } from "./presentationSystemRoute";

const FIXTURE_DIR = dirname(fileURLToPath(import.meta.url));

describe("development-only Presentation System fixture", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders the labelled visual vocabulary with one route heading", () => {
    const target = document.createElement("main");
    document.body.append(target);
    const mounted = createPresentationSystemRoute().mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/presentation-system",
        search: "",
        hash: "",
      },
    });

    expect(target.querySelectorAll("h1")).toHaveLength(1);
    expect(target.querySelector("h1")?.textContent).toBe("Numerical T Lab");
    expect(
      [...target.querySelectorAll<HTMLElement>(".presentation-stage-grid > [data-presentation-stage]")].map(
        (stage) => stage.dataset.presentationStage
      )
    ).toEqual(["method", "data", "output", "analysis"]);
    expect(target.textContent).toContain("Method");
    expect(target.textContent).toContain("Data");
    expect(target.textContent).toContain("Output");
    expect(target.textContent).toContain("Analysis");
    expect(target.textContent).not.toContain("One family, four responsibilities");
    expect(target.textContent).not.toContain("Neutral structure carries the page");
    expect(target.textContent).toContain("Workflow roles");
    expect(target.textContent).toContain(
      "Method, Data, Output, and Analysis each serve a distinct role in the numerical workflow."
    );
    expect(target.textContent).toContain("Choose the numerical approach.");
    expect(target.textContent).toContain("Define the mathematical problem.");
    expect(target.textContent).toContain("Read the computed result.");
    expect(target.textContent).toContain(
      "Interpret accuracy, reliability, and numerical behavior."
    );
    for (const status of ["Ready", "Current", "Stale", "Caution", "Failed", "Planned"]) {
      expect(target.querySelector(`[data-presentation-status='${status.toLowerCase()}']`)?.textContent)
        .toContain(status);
    }
    expect(target.querySelectorAll("[data-surface-level]")).toHaveLength(4);

    mounted.dispose();
    expect(target.childElementCount).toBe(0);
  });

  it("uses native controls and one accessible owner per visual MathML object", () => {
    const target = document.createElement("main");
    document.body.append(target);
    createPresentationSystemRoute().mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/presentation-system",
        search: "",
        hash: "",
      },
    });

    expect(target.querySelectorAll("button").length).toBeGreaterThanOrEqual(5);
    expect(target.querySelector("input")).not.toBeNull();
    expect(target.querySelector("select")).not.toBeNull();
    expect(target.querySelector("details > summary")).not.toBeNull();
    expect(target.querySelector("button:disabled")).not.toBeNull();
    const owners = target.querySelectorAll<HTMLElement>("[role='math']");
    expect(owners.length).toBeGreaterThanOrEqual(2);
    for (const owner of owners) {
      expect(owner.getAttribute("aria-label")).toBeTruthy();
      expect(owner.querySelectorAll(":scope > math[aria-hidden='true']")).toHaveLength(1);
    }
  });

  it("demonstrates every Phase 2 primitive with authored cross-domain content", () => {
    const target = document.createElement("main");
    document.body.append(target);
    createPresentationSystemRoute().mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/presentation-system",
        search: "",
        hash: "",
      },
    });

    expect(target.textContent).toContain("Phase 2 · Content hierarchy");
    for (const title of [
      "Problem Context",
      "Teaching Block",
      "Primary Result",
      "Evidence levels",
      "Numerical Table",
      "Advanced Details",
      "Computation Walkthrough shell",
    ]) {
      expect(target.textContent).toContain(title);
    }
    expect(target.querySelectorAll("[data-problem-context]")).toHaveLength(6);
    expect(target.textContent).toContain("Linear system snapshot");
    expect(target.textContent).toContain("Initial value problem");
    expect(target.textContent).toContain("Future PDE composition");
    expect(target.querySelectorAll("[data-teaching-block]").length).toBeGreaterThanOrEqual(2);
    expect(target.querySelectorAll("[data-primary-result]")).toHaveLength(3);
    expect(
      [...target.querySelectorAll<HTMLElement>("[data-evidence-level]")].map(
        (block) => block.dataset.evidenceLevel
      )
    ).toEqual(["summary", "standard", "advanced"]);
    expect(target.querySelector("table caption")?.textContent).toBe(
      "ODE refinement evidence"
    );
    expect(target.querySelector("details[data-advanced-details]")).not.toBeNull();
    expect(target.querySelector("[data-computation-walkthrough-shell]")).not.toBeNull();
    expect(
      [...target.querySelectorAll("[data-walkthrough-part]")].map((part) =>
        part.getAttribute("data-walkthrough-part")
      )
    ).toEqual([
      "source",
      "operation",
      "target",
      "source",
      "operation",
      "target",
      "source",
      "operation",
      "target",
    ]);
  });

  it("owns the complete scientific exponent as one accessible MathML formula", () => {
    const target = document.createElement("main");
    document.body.append(target);
    createPresentationSystemRoute().mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/presentation-system",
        search: "",
        hash: "",
      },
    });

    const row = [...target.querySelectorAll<HTMLElement>(".presentation-type-row")].find(
      (candidate) => candidate.textContent?.includes("Numeric value")
    );
    const owner = row?.querySelector<HTMLElement>("[data-math='numeric-value']");
    const script = owner?.querySelector("msup");
    const [base, exponent] = script ? [...script.children] : [];

    expect(row).toBeDefined();
    expect(row?.querySelectorAll("[role='math']")).toHaveLength(1);
    expect(owner?.getAttribute("role")).toBe("math");
    expect(owner?.getAttribute("aria-label")).toBe(
      "2.31 times ten to the minus 14"
    );
    expect(owner?.querySelectorAll(":scope > math[aria-hidden='true']")).toHaveLength(1);
    expect(script?.children).toHaveLength(2);
    expect(base?.textContent).toBe("10");
    expect(exponent?.textContent).toBe("−14");
    expect(exponent?.textContent).toContain("−");
    expect(exponent?.textContent).toContain("14");
    expect(
      [...(script?.parentElement?.childNodes ?? [])]
        .filter((node) => node !== script)
        .some((node) => node.textContent?.includes("4"))
    ).toBe(false);
  });

  it("stays authored, removable, and independent from eager math or external assets", () => {
    const source = readFileSync(join(FIXTURE_DIR, "presentationSystemRoute.ts"), "utf8");
    const css = readFileSync(join(FIXTURE_DIR, "presentationSystem.css"), "utf8");

    expect(source).not.toMatch(/mathlive|compute-engine|innerHTML|https?:\/\//i);
    expect(source).toMatch(
      /createProblemContext|createTeachingBlock|createPrimaryResult|createEvidenceBlock|createComputationWalkthroughShell/
    );
    expect(source).not.toMatch(
      /labs\/(?:ode|linear-algebra)|@numerical-t-lab|chart\.js|mathlive|compute-engine|ComputationTrace|computationMotion/
    );
    expect(css).not.toMatch(/@import\s|url\s*\(|#[0-9a-f]{3,8}\b|\brgba?\s*\(/i);
    expect(css).toContain("forced-colors");
    expect(css).toContain("overflow-x: auto");
  });
});
