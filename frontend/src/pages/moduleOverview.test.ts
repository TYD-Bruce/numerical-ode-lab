// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { createModuleOverview } from "./moduleOverview";

function heading(level: "h1" | "h2", text: string): HTMLHeadingElement {
  const node = document.createElement(level);
  node.textContent = text;
  return node;
}

function status(text: string): HTMLSpanElement {
  const node = document.createElement("span");
  node.className = "platform-status platform-status-planned";
  node.textContent = text;
  return node;
}

describe("entry-safe ModuleOverview", () => {
  beforeEach(() => document.body.replaceChildren());

  it("preserves caller nodes and composes the available-module grammar in semantic order", () => {
    const pageHeading = heading("h1", "Numerical Example");
    const summary = document.createElement("p");
    summary.textContent = "A caller-authored module purpose.";
    const itemHeading = heading("h2", "Example Lab");
    const itemStatus = status("Available");
    const description = document.createElement("p");
    description.textContent = "A truthful description.";
    const action = document.createElement("a");
    action.href = "/example/lab";
    action.textContent = "Open Example Lab";
    const supporting = document.createElement("section");
    supporting.append(heading("h2", "Future learning sequence"));

    const overview = createModuleOverview({
      heading: pageHeading,
      summary,
      primaryItem: {
        heading: itemHeading,
        status: itemStatus,
        state: "available",
        content: [description],
        action,
      },
      sections: [supporting],
    });

    expect(overview.dataset.moduleOverview).toBe("true");
    expect(overview.getAttribute("aria-labelledby")).toBe(pageHeading.id);
    expect(overview.querySelector("h1")).toBe(pageHeading);
    expect(overview.querySelector(".module-overview-summary")).toBe(summary);
    expect(overview.querySelector("[data-module-overview-primary] h2")).toBe(
      itemHeading
    );
    expect(overview.querySelector("[data-module-overview-status]")).toBe(
      itemStatus
    );
    expect(overview.querySelector(".module-overview-primary > p")).toBe(
      description
    );
    expect(overview.querySelector(".module-overview-action a")).toBe(action);
    expect(action.tagName).toBe("A");
    expect(action.getAttribute("href")).toBe("/example/lab");
    expect([...overview.children]).toEqual([
      pageHeading.closest("header"),
      itemHeading.closest("section"),
      supporting,
    ]);
    expect(pageHeading.dataset.routeFocus).toBe("true");
    expect(pageHeading.tabIndex).toBe(-1);
    expect(itemHeading.closest("section")?.dataset.moduleState).toBe(
      "available"
    );
  });

  it("supports a planned module without fabricating a runnable action", () => {
    const pageHeading = heading("h1", "Planned module");
    const itemHeading = heading("h2", "Future Labs");
    const plannedStatus = status("Planned");
    const overview = createModuleOverview({
      heading: pageHeading,
      primaryItem: {
        heading: itemHeading,
        status: plannedStatus,
        state: "planned",
        content: [document.createElement("ul")],
      },
    });

    const primary = overview.querySelector<HTMLElement>(
      "[data-module-overview-primary]"
    )!;
    expect(primary.dataset.moduleState).toBe("planned");
    expect(primary.getAttribute("aria-labelledby")).toBe(itemHeading.id);
    expect(primary.querySelector("a, button")).toBeNull();
    expect(overview.querySelector("[role='status'], [aria-live]")).toBeNull();
  });

  it("generates unique local labels while preserving caller-supplied IDs", () => {
    const suppliedHeading = heading("h1", "Supplied ID");
    suppliedHeading.id = "caller-module-title";
    const suppliedItem = heading("h2", "Supplied item ID");
    suppliedItem.id = "caller-item-title";
    const first = createModuleOverview({
      heading: suppliedHeading,
      primaryItem: {
        heading: suppliedItem,
        status: status("Available"),
        state: "available",
      },
    });
    const secondHeading = heading("h1", "Generated ID");
    const secondItem = heading("h2", "Generated item ID");
    const second = createModuleOverview({
      heading: secondHeading,
      primaryItem: {
        heading: secondItem,
        status: status("Planned"),
        state: "planned",
      },
    });

    expect(first.getAttribute("aria-labelledby")).toBe("caller-module-title");
    expect(
      first
        .querySelector("[data-module-overview-primary]")
        ?.getAttribute("aria-labelledby")
    ).toBe("caller-item-title");
    expect(secondHeading.id).toMatch(/^module-overview-title-/);
    expect(secondItem.id).toMatch(/^module-overview-item-title-/);
    expect(secondHeading.id).not.toBe(secondItem.id);
    expect(
      new Set([
        suppliedHeading.id,
        suppliedItem.id,
        secondHeading.id,
        secondItem.id,
      ])
    ).toHaveProperty("size", 4);
    expect(second.querySelectorAll("[id]")).toHaveLength(2);
  });

  it("keeps the source domain-neutral, presentation-only, and free of cloning or parsing", () => {
    const source = readFileSync(
      resolve(process.cwd(), "frontend/src/pages/moduleOverview.ts"),
      "utf8"
    );

    expect(source).not.toMatch(
      /labs\/|@numerical-t-lab|Chart|MathLive|compute-engine|Tutor|Glossary|ComputationTrace|computationTrace|Motion|AppSessionStore|Session|Router/
    );
    expect(source).not.toMatch(/Initial Value Problems|GEPP|Linear Systems|PDE/);
    expect(source).not.toMatch(/cloneNode|innerHTML|outerHTML|DOMParser/);
    expect(source).not.toMatch(/aria-live|role=["']status/);
  });
});
