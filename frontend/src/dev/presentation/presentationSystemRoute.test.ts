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

  it("stays authored, removable, and independent from eager math or external assets", () => {
    const source = readFileSync(join(FIXTURE_DIR, "presentationSystemRoute.ts"), "utf8");
    const css = readFileSync(join(FIXTURE_DIR, "presentationSystem.css"), "utf8");

    expect(source).not.toMatch(/mathlive|compute-engine|innerHTML|https?:\/\//i);
    expect(source).not.toMatch(/LabShell|WorkflowNavigation|StageSection|PrimaryResult/);
    expect(css).not.toMatch(/@import\s|url\s*\(|#[0-9a-f]{3,8}\b|\brgba?\s*\(/i);
    expect(css).toContain("forced-colors");
    expect(css).toContain("overflow-x: auto");
  });
});
