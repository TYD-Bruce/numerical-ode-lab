// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import type { HomeSessionSource, ResumeSummary } from "../app/contracts";
import { createHomePage } from "./homePage";

function resume(
  moduleId: ResumeSummary["moduleId"],
  timestamp: number,
  overrides: Partial<ResumeSummary> = {}
): ResumeSummary {
  return {
    moduleId,
    route: moduleId === "ode" ? "/ode/initial-value-problems" : `/${moduleId}`,
    labTitle: `${moduleId} Lab`,
    stepLabel: "Output",
    lastMeaningfulInteraction: timestamp,
    ...overrides,
  };
}

function source(initial: readonly ResumeSummary[] = []) {
  let summaries = initial;
  let listener: (() => void) | undefined;
  const unsubscribe = vi.fn();
  const sessionSource: HomeSessionSource = {
    getResumeSummaries: vi.fn(() => summaries),
    subscribe: vi.fn((next) => {
      listener = next;
      return unsubscribe;
    }),
  };
  return {
    sessionSource,
    unsubscribe,
    update(next: readonly ResumeSummary[]) {
      summaries = next;
      listener?.();
    },
  };
}

describe("Home Resume section", () => {
  it("renders no empty section and subscribes only for the mounted page lifetime", () => {
    const sessions = source();
    const target = document.createElement("div");
    const mounted = createHomePage(sessions.sessionSource).mount({
      target,
      navigate: vi.fn(),
      location: { pathname: "/", search: "", hash: "" },
    });

    expect(target.textContent).not.toContain("Continue your experiment");
    expect(sessions.sessionSource.subscribe).toHaveBeenCalledOnce();
    mounted.dispose();
    mounted.dispose();
    expect(sessions.unsubscribe).toHaveBeenCalledOnce();
  });

  it("renders at most three ordered, safe cards and updates from Store notifications", () => {
    const sessions = source();
    const target = document.createElement("div");
    const mounted = createHomePage(sessions.sessionSource).mount({
      target,
      navigate: vi.fn(),
      location: { pathname: "/", search: "", hash: "" },
    });

    sessions.update([
      resume("ode", 400, {
        labTitle: "Initial Value Problems Lab",
        methodLabel: "Runge–Kutta 4",
        analysisLabel: "Analysis available",
      }),
      resume("linear_algebra", 300, { stepLabel: "Data" }),
      resume("pde", 200, { stepLabel: "Method" }),
      resume("ode", 100, { labTitle: "Duplicate must be ignored" }),
    ]);

    const cards = [...target.querySelectorAll<HTMLElement>("[data-resume-module]")];
    expect(target.textContent).toContain("Continue your experiment");
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.dataset.resumeModule)).toEqual([
      "ode",
      "linear_algebra",
      "pde",
    ]);
    expect(cards[0]?.textContent).toContain("Output · Runge–Kutta 4");
    expect(cards[0]?.textContent).toContain("Analysis available");
    expect(cards[0]?.querySelector("a")?.textContent).toBe("Resume Lab");
    expect(cards[0]?.querySelector("a")?.getAttribute("href")).toBe(
      "/ode/initial-value-problems"
    );
    for (const prohibited of ["-y", "e^(-t)", "t0", "y0", "Tutor message"]) {
      expect(target.textContent).not.toContain(prohibited);
    }

    sessions.update([]);
    expect(target.textContent).not.toContain("Continue your experiment");
    mounted.dispose();
  });
});
