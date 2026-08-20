// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLabHeader, createLabShell } from "./labShell";
import { createStageSection } from "./stageSection";
import {
  createWorkflowNavigation,
  disposeWorkflowNavigation,
} from "./workflowNavigation";
import { applyLabActionRole } from "./supportingElements";

function breadcrumb(): HTMLElement {
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Breadcrumb");
  const link = document.createElement("a");
  link.href = "/ode";
  link.textContent = "Numerical ODE";
  nav.append(link);
  return nav;
}

function stage(label = "Method"): HTMLElement {
  const section = createStageSection({ role: "method", label });
  section.append(document.createElement("div"));
  return section;
}

describe("shared Lab presentation primitives", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("composes one Lab h1 with breadcrumb, optional eyebrow, lede, identity, and native action ownership", () => {
    const title = document.createElement("h1");
    title.textContent = "A Lab";
    const lede = document.createElement("p");
    lede.textContent = "A concise learner goal.";
    const identity = document.createElement("p");
    identity.textContent = "Custom experiment";
    const action = applyLabActionRole(
      Object.assign(document.createElement("button"), {
        type: "button",
        textContent: "New experiment",
      }),
      "secondary"
    );
    const workflow = createWorkflowNavigation({
      label: "Sample workflow",
      steps: [
        { key: "method", label: "Method", role: "method", current: true },
      ],
    });

    const shell = createLabShell({
      header: createLabHeader({
        breadcrumb: breadcrumb(),
        title,
        lede,
        identity,
        actions: [action],
      }),
      workflow,
      stage: stage(),
    });

    expect(shell.querySelectorAll("h1")).toHaveLength(1);
    expect(shell.querySelector("h1")).toBe(title);
    expect(shell.querySelector("nav[aria-label='Breadcrumb']")).not.toBeNull();
    expect(shell.querySelector("[data-lab-header-eyebrow]")).toBeNull();
    expect(shell.querySelector("[data-lab-header-lede]")).toBe(lede);
    expect(shell.querySelector("[data-lab-header-identity]")?.textContent).toBe(
      "Custom experiment"
    );
    expect(shell.querySelector("[data-lab-header-action]")).toBe(action);
    expect(shell.querySelector("[data-lab-header-actions]")?.children).toHaveLength(
      1
    );
    expect(action.tagName).toBe("BUTTON");
    expect(
      [...shell.querySelector("header")!.children].map((node) =>
        node.getAttribute("data-lab-header-part")
      )
    ).toEqual(["breadcrumb", "title", "lede", "identity"]);
  });

  it("allows the technical eyebrow to be authored without changing DOM ownership", () => {
    const title = document.createElement("h1");
    title.textContent = "A Lab";
    const eyebrow = document.createElement("p");
    eyebrow.textContent = "Technical eyebrow";
    const lede = document.createElement("p");
    lede.textContent = "Learner goal";

    const shell = createLabShell({
      header: createLabHeader({
        breadcrumb: breadcrumb(),
        eyebrow,
        title,
        lede,
      }),
      workflow: createWorkflowNavigation({
        label: "Workflow",
        steps: [
          { key: "method", label: "Method", role: "method", current: true },
        ],
      }),
      stage: stage(),
    });

    expect(shell.querySelector("[data-lab-header-eyebrow]")).toBe(eyebrow);
    expect(shell.querySelector("[data-lab-header-eyebrow]")?.textContent).toBe(
      "Technical eyebrow"
    );
  });

  it("renders ordered variable workflows with native availability and activation semantics", () => {
    const activate = vi.fn();
    const nav = createWorkflowNavigation({
      label: "Lab workflow",
      steps: [
        {
          key: "method",
          label: "Method",
          role: "method",
          available: true,
          current: false,
          onActivate: () => activate("method"),
        },
        {
          key: "data",
          label: "Data",
          role: "data",
          available: true,
          current: true,
          onActivate: () => activate("data"),
        },
        {
          key: "output",
          label: "Output",
          role: "output",
          available: false,
          current: false,
          onActivate: () => activate("output"),
        },
      ],
    });

    expect(nav.tagName).toBe("NAV");
    expect(nav.getAttribute("aria-label")).toBe("Lab workflow");
    expect(nav.querySelector("ol")).not.toBeNull();
    expect(
      [...nav.querySelectorAll<HTMLButtonElement>("button")].map(
        (control) => control.textContent
      )
    ).toEqual(["1Method", "2Data", "3Output"]);
    expect(
      nav.querySelector("[data-workflow-step='data']")?.getAttribute(
        "aria-current"
      )
    ).toBe("step");
    expect(
      nav.querySelector("[data-workflow-step='method']")?.getAttribute(
        "data-workflow-state"
      )
    ).toBe("available");
    expect(
      nav.querySelector("[data-workflow-step='data']")?.getAttribute(
        "data-workflow-state"
      )
    ).toBe("current");
    const unavailable = nav.querySelector<HTMLButtonElement>(
      "[data-workflow-step='output']"
    )!;
    expect(unavailable.disabled).toBe(true);
    expect(unavailable.dataset.workflowState).toBe("unavailable");
    nav.querySelector<HTMLButtonElement>("[data-workflow-step='method']")!.click();
    unavailable.click();
    expect(activate).toHaveBeenCalledTimes(1);
    expect(activate).toHaveBeenCalledWith("method");
  });

  it("supports a four-step workflow and maps domain labels to shared visual roles", () => {
    const nav = createWorkflowNavigation({
      label: "Linear Systems workflow",
      steps: [
        { key: "method", label: "Method", role: "method", current: true },
        { key: "data", label: "Data", role: "data" },
        { key: "output", label: "Output", role: "output", available: false },
        {
          key: "diagnostics",
          label: "Diagnostics",
          role: "analysis",
          available: false,
        },
      ],
    });

    expect(nav.querySelectorAll("li")).toHaveLength(4);
    expect(
      nav
        .querySelector("[data-workflow-step='diagnostics']")
        ?.getAttribute("data-stage-role")
    ).toBe("analysis");
    expect(nav.textContent).toContain("Method");
    expect(nav.textContent).toContain("Diagnostics");
    expect(nav.querySelector("[aria-current='step']")?.textContent).toContain(
      "Method"
    );
    expect(
      new Set(
        [...nav.querySelectorAll<HTMLElement>("[data-workflow-state]")].map(
          (node) => node.dataset.workflowState
        )
      )
    ).toEqual(new Set(["current", "available", "unavailable"]));
  });

  it("uses only current, available, and unavailable workflow state language", async () => {
    const sourceModule = await import("./workflowNavigation.ts?raw");
    const combined = sourceModule.default;

    expect(combined).toContain("dataset.workflowState");
    expect(combined).toContain('"current"');
    expect(combined).toContain('"available"');
    expect(combined).toContain('"unavailable"');
    expect(combined).not.toMatch(/completed|visited|done/i);
  });

  it("keeps current-stage reveal inside the local workflow rail", () => {
    const nav = createWorkflowNavigation({
      label: "Workflow",
      steps: [
        { key: "method", label: "Method", role: "method" },
        { key: "data", label: "Data", role: "data" },
        { key: "output", label: "Output", role: "output", current: true },
      ],
    });
    const rail = nav.querySelector<HTMLElement>("[data-workflow-rail]")!;
    const current = nav.querySelector<HTMLButtonElement>("[aria-current='step']")!;
    const item = current.closest("li")!;
    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
    });
    Object.defineProperties(item, {
      offsetLeft: { configurable: true, value: 420 },
      offsetWidth: { configurable: true, value: 160 },
    });

    current.dispatchEvent(new FocusEvent("focus"));

    expect(rail.scrollLeft).toBe(380);
    expect(nav.classList.contains("lab-workflow-navigation")).toBe(true);
  });

  it("reveals the current stage again when the contained rail resizes", () => {
    let resize!: () => void;
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe = vi.fn();
        disconnect = disconnect;
      }
    );
    const nav = createWorkflowNavigation({
      label: "Workflow",
      steps: [
        { key: "method", label: "Method", role: "method" },
        { key: "data", label: "Data", role: "data" },
        { key: "output", label: "Output", role: "output", current: true },
      ],
    });
    document.body.append(nav);
    const rail = nav.querySelector<HTMLElement>("[data-workflow-rail]")!;
    const item = nav.querySelector("[aria-current='step']")!.closest("li")!;
    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
    });
    Object.defineProperties(item, {
      offsetLeft: { configurable: true, value: 420 },
      offsetWidth: { configurable: true, value: 160 },
    });

    resize();

    expect(rail.scrollLeft).toBe(380);
    expect(disconnect).not.toHaveBeenCalled();

    disposeWorkflowNavigation(nav);

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("creates a labelled native stage section whose title may differ from its visual role", () => {
    const diagnostics = createStageSection({
      role: "analysis",
      label: "Diagnostics",
    });
    const heading = document.createElement("h2");
    heading.textContent = "Diagnostics — check the equation mismatch";
    diagnostics.append(heading);

    expect(diagnostics.tagName).toBe("SECTION");
    expect(diagnostics.dataset.stageRole).toBe("analysis");
    expect(diagnostics.getAttribute("aria-labelledby")).toBe(
      diagnostics.querySelector("[data-stage-label]")?.id
    );
    expect(diagnostics.querySelector("[data-stage-label]")?.textContent).toBe(
      "Diagnostics"
    );
    expect(diagnostics.querySelector("h2")?.textContent).toContain(
      "equation mismatch"
    );
    expect(diagnostics.querySelector("[role='status'], [role='alert']")).toBeNull();
  });

  it("appends supplied mathematical nodes without cloning them", () => {
    const formula = document.createElement("span");
    formula.setAttribute("role", "math");
    formula.setAttribute("aria-label", "A times x equals b");
    const section = createStageSection({
      role: "method",
      label: "Method",
      content: [formula],
    });

    expect(section.querySelector("[role='math']")).toBe(formula);
    expect(section.querySelectorAll("[role='math']")).toHaveLength(1);
  });

  it("keeps shared source free of domain, state, Router, numerical, and deferred tool imports", async () => {
    const modules = await Promise.all([
      import("./labShell.ts?raw"),
      import("./workflowNavigation.ts?raw"),
      import("./stageSection.ts?raw"),
      import("./supportingElements.ts?raw"),
    ]);
    const source = modules.map((module) => module.default).join("\n");

    expect(source).not.toMatch(
      /labs\/(?:ode|linear-algebra)|app\/(?:router|appSessionStore)|@numerical-t-lab|chart\.js|mathlive|compute-engine|Tutor|Glossary|ComputationTrace/
    );
    expect(source).not.toMatch(/cloneNode|innerHTML|outerHTML/);
    expect(source).not.toMatch(/react|vue|svelte/i);
  });
});
