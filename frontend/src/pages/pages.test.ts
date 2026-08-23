// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteModule } from "../app/contracts";
import { homePage } from "./homePage";
import { odeOverviewPage } from "./odeOverviewPage";
import { linearAlgebraOverviewPage } from "./linearAlgebraOverviewPage";
import { pdeOverviewPage } from "./pdeOverviewPage";
import { aboutPage, createAboutPage } from "./aboutPage";
import { notFoundPage } from "./notFoundPage";
import { createGlossaryDevelopmentAboutPage } from "../dev/glossary/glossaryDevelopmentControls";

function mount(module: RouteModule, pathname = "/"): HTMLElement {
  const target = document.createElement("main");
  document.body.append(target);
  module.mount({
    target,
    navigate: vi.fn(),
    location: { pathname, search: "", hash: "" },
  });
  return target;
}

describe("static platform pages", () => {
  beforeEach(() => document.body.replaceChildren());

  it("presents truthful Home modules and a non-mandatory learning path", () => {
    const target = mount(homePage);
    expect(target.textContent).toContain("Numerical T Lab");
    expect(target.querySelector(".platform-home-hero h1")?.textContent).toBe(
      "Numerical T Lab"
    );
    expect(
      target.querySelector(".platform-brand-pillars")?.textContent
    ).toBe("Theory · Tools · Teaching");
    expect(
      target.querySelector(".platform-product-descriptor")?.textContent
    ).toBe("An Interactive Numerical Analysis Laboratory");
    expect(target.textContent).toContain("Understand → Compute → Visualize → Analyze");
    expect(target.textContent).not.toMatch(/Numerical Analysis Lab(?!oratory)/);
    expect(target.textContent).toContain("Available");
    expect(target.textContent).not.toContain("In development");
    expect(target.textContent).toContain("Planned");
    expect(target.textContent).toContain("Initial Value Problems");
    expect(target.textContent).toContain("Linear Systems");
    expect(target.textContent).toContain("Heat and Poisson Equations");
    expect(target.textContent).toContain("recommended, not required");
    expect(target.textContent).not.toContain("Continue your experiment");

    const openLab = target.querySelector<HTMLAnchorElement>(
      'a[href="/ode/initial-value-problems"]'
    )!;
    expect(openLab.textContent).toContain("Open Lab");
    expect(openLab.dataset.prefetchRouteId).toBe("ode-initial-value-problems");
    const linearLab = target.querySelector<HTMLAnchorElement>(
      'a[href="/linear-algebra/linear-systems"]'
    )!;
    expect(linearLab.textContent).toContain("Open Lab");
    expect(linearLab.dataset.prefetchRouteId).toBe(
      "linear-algebra-linear-systems"
    );
    const moduleCards = [
      ...target.querySelectorAll<HTMLElement>(".platform-module-card"),
    ];
    expect(moduleCards).toHaveLength(3);
    expect(
      moduleCards.map((card) => ({
        title: card.querySelector("h3")?.textContent,
        status: card.querySelector(".platform-status")?.textContent,
        action: card.querySelector(".platform-module-card-action a")?.textContent,
      }))
    ).toEqual([
      {
        title: "Numerical Linear Algebra",
        status: "Available",
        action: "Open Lab",
      },
      { title: "Numerical ODE", status: "Available", action: "Open Lab" },
      { title: "Numerical PDE", status: "Planned", action: "View roadmap" },
    ]);
    for (const card of moduleCards) {
      const actionOwner = card.querySelector<HTMLElement>(
        ":scope > .platform-module-card-action"
      )!;
      expect(actionOwner.childElementCount).toBe(1);
      expect(actionOwner.firstElementChild?.tagName).toBe("A");
      expect(card.querySelector("br, [data-alignment-spacer]")).toBeNull();
    }
    expect(target.querySelector("button")).toBeNull();
  });

  it("describes the available ODE Lab and marks its roadmap as planned", () => {
    const target = mount(odeOverviewPage, "/ode");
    const availableDescription = target.querySelector(
      ".module-overview-primary > p"
    )?.textContent;
    expect(target.textContent).toContain("Initial Value Problems Lab");
    expect(target.textContent).toContain("Open Initial Value Problems Lab");
    expect(availableDescription).toBe(
      "Compare numerical methods, inspect their computed numerical approximations, and study how error changes as the time-step size is refined."
    );
    expect(availableDescription).not.toContain("inspect solution curves");
    expect(availableDescription).not.toContain(
      "as the step size is refined"
    );
    for (const item of [
      "Boundary Value Problems",
      "Adaptive Step Size",
      "Absolute-stability regions",
      "Stiff Systems",
    ]) {
      expect(target.textContent).toContain(item);
    }
    expect(target.textContent).not.toContain("Stability Regions");
    expect(target.textContent).toContain("Planned");
    expect(target.textContent).toContain("Linear Algebra");
    expect(target.textContent).toContain("PDE");
    expect(target.textContent).toContain(
      "Numerical Linear Algebra now includes the available Linear Systems Lab, while Numerical PDE remains a planned platform direction."
    );
  });

  it("presents the available Linear Systems Lab and keeps remaining roadmaps truthful", () => {
    const linear = mount(linearAlgebraOverviewPage, "/linear-algebra");
    expect(linear.textContent).toContain("Available");
    expect(linear.textContent).toContain("Linear Systems Lab");
    expect(
      linear.querySelector('a[href="/linear-algebra/linear-systems"]')?.textContent
    ).toBe("Open Linear Systems Lab");
    expect(linear.textContent).toContain(
      "One complete Lab is ready for small dense linear systems."
    );
    expect(linear.textContent).not.toMatch(/Tutor|Glossary|Motion/);
    for (const item of ["Least Squares", "SVD", "Eigenvalues"]) {
      expect(linear.textContent).toContain(item);
    }
    expect(linear.querySelector("button, input, textarea, canvas")).toBeNull();

    const pde = mount(pdeOverviewPage, "/pde");
    for (const item of [
      "Planned",
      "Heat",
      "Wave",
      "Poisson",
      "finite differences",
      "boundary conditions",
      "stability",
      "refinement",
      "Linear Algebra",
    ]) {
      expect(pde.textContent).toContain(item);
    }
    expect(pde.textContent).toContain(
      "This overview describes future Labs and has no runnable controls."
    );
    expect(pde.querySelector("button, input, textarea, canvas")).toBeNull();
  });

  it("composes all three module routes through one truthful accessible overview grammar", () => {
    const cases = [
      {
        module: odeOverviewPage,
        path: "/ode",
        title: "Numerical ODE",
        item: "Initial Value Problems Lab",
        status: "Available",
        action: "/ode/initial-value-problems",
      },
      {
        module: linearAlgebraOverviewPage,
        path: "/linear-algebra",
        title: "Numerical Linear Algebra",
        item: "Linear Systems Lab",
        status: "Available",
        action: "/linear-algebra/linear-systems",
      },
      {
        module: pdeOverviewPage,
        path: "/pde",
        title: "Numerical PDE",
        item: "Future PDE Labs",
        status: "Planned",
        action: null,
      },
    ] as const;

    for (const entry of cases) {
      const target = mount(entry.module, entry.path);
      const overview = target.querySelector<HTMLElement>(
        "[data-module-overview='true']"
      )!;
      const primary = overview.querySelector<HTMLElement>(
        "[data-module-overview-primary='true']"
      )!;
      const h1 = overview.querySelectorAll("h1");
      const ids = [...overview.querySelectorAll<HTMLElement>("[id]")].map(
        (node) => node.id
      );

      expect(overview).toBeTruthy();
      expect(h1).toHaveLength(1);
      expect(h1[0]?.textContent).toBe(entry.title);
      expect(overview.getAttribute("aria-labelledby")).toBe(h1[0]?.id);
      expect(primary.querySelector("h2")?.textContent).toBe(entry.item);
      expect(primary.getAttribute("aria-labelledby")).toBe(
        primary.querySelector("h2")?.id
      );
      expect(
        primary.querySelector("[data-module-overview-status]")?.textContent
      ).toBe(entry.status);
      expect(new Set(ids).size).toBe(ids.length);
      expect(overview.querySelector("[role='status'], [aria-live]")).toBeNull();
      if (entry.action) {
        expect(primary.querySelector(`a[href="${entry.action}"]`)).toBeTruthy();
      } else {
        expect(primary.querySelector("a, button")).toBeNull();
      }
    }

    const pde = mount(pdeOverviewPage, "/pde");
    expect(pde.querySelectorAll(".platform-status")).toHaveLength(1);
    expect(pde.textContent).not.toContain("Open PDE Lab");

    const home = mount(homePage, "/");
    expect(home.querySelector("[data-module-overview]")).toBeNull();
  });

  it("distinguishes the released ODE product from the future platform on About", () => {
    const target = mount(aboutPage, "/about");
    const theoryPillar = Array.from(target.querySelectorAll("li")).find(
      (item) => item.querySelector("strong")?.textContent === "Theory"
    );
    const teachingPillar = Array.from(target.querySelectorAll("li")).find(
      (item) => item.querySelector("strong")?.textContent === "Teaching"
    );
    const theoryCopy = theoryPillar?.textContent ?? "";
    const teachingCopy = teachingPillar?.textContent ?? "";
    const currentTeachingCopy = teachingCopy.split("today.")[0];

    expect(target.textContent).toContain("Numerical T Lab");
    expect(target.textContent).toContain("currently implemented");
    expect(target.textContent).toContain("Initial Value Problems");
    expect(target.textContent).toContain("Linear Systems Lab");
    expect(target.textContent).toContain("AI-assisted");
    expect(target.querySelector("h2")?.textContent).toBe(
      "Theory · Tools · Teaching"
    );
    expect(target.textContent).toContain("The T represents three public pillars");
    expect(target.textContent).toContain("Theory");
    expect(target.textContent).toContain("Tools");
    expect(target.textContent).toContain("Teaching");
    expect(currentTeachingCopy).toContain("guided workflows");
    expect(currentTeachingCopy).toContain("AI Tutor");
    expect(currentTeachingCopy).not.toContain("Interactive Glossary");
    expect(teachingCopy).toContain(
      "Reviewed Glossary terms and definitions are currently available only in the complete Initial Value Problems Lab. The Numerical ODE overview and other routes remain unannotated, and no Glossary-to-Tutor handoff is available."
    );
    expect(teachingCopy).not.toContain(
      "No production terms or definitions are published yet."
    );
    expect(teachingCopy).not.toContain("ready for reviewed content integration");
    expect(teachingCopy).not.toContain(
      "approved Interactive Glossary framework is planned"
    );
    expect(theoryCopy).toContain("relevant stability properties");
    expect(theoryCopy).toContain("stated error measures");
    expect(theoryCopy).not.toContain(
      "limitations, stability, and error behavior"
    );
    expect(target.textContent).not.toContain("Tian");
    expect(target.textContent).toContain("Planned");
  });

  it("keeps the production About page unchanged and adds Developer Tools only by option", () => {
    const production = mount(aboutPage, "/about");
    const defaultFactory = mount(createAboutPage(), "/about");
    const development = mount(
      createGlossaryDevelopmentAboutPage({
        playgroundPath: "/__dev/glossary-playground",
      }),
      "/about"
    );

    expect(defaultFactory.innerHTML).toBe(production.innerHTML);
    expect(production.textContent).not.toContain("Developer Tools");
    expect(
      production.querySelector('a[href="/__dev/glossary-playground"]')
    ).toBeNull();
    expect(
      development.querySelectorAll('[data-about-developer-tools]')
    ).toHaveLength(1);
    const link = development.querySelector<HTMLAnchorElement>(
      'a[href="/__dev/glossary-playground"]'
    );
    expect(link?.textContent).toContain("Glossary Playground");
    expect(link?.closest("a")?.querySelector("a, button")).toBeNull();
    expect(development.textContent).toContain("development-only");
  });

  it("renders the unknown pathname as text and offers safe next steps", () => {
    const requestedPath = '/missing/<img src=x onerror="alert(1)">';
    const target = mount(notFoundPage, requestedPath);
    expect(target.textContent).toContain(requestedPath);
    expect(target.querySelector("img")).toBeNull();
    expect(target.querySelector('a[href="/"]')?.textContent).toContain("Home");
    expect(
      target.querySelector('a[href="/ode/initial-value-problems"]')?.textContent
    ).toContain("Initial Value Problems Lab");
  });

  it("returns disposable handles for every static page", () => {
    for (const page of [
      homePage,
      odeOverviewPage,
      linearAlgebraOverviewPage,
      pdeOverviewPage,
      aboutPage,
      notFoundPage,
    ]) {
      const target = document.createElement("main");
      document.body.append(target);
      const handle = page.mount({
        target,
        navigate: vi.fn(),
        location: { pathname: "/", search: "", hash: "" },
      });
      expect(handle.dispose).toEqual(expect.any(Function));
      handle.dispose();
    }
  });
});
