// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RouteModule } from "../app/contracts";
import { homePage } from "./homePage";
import { odeOverviewPage } from "./odeOverviewPage";
import { linearAlgebraOverviewPage } from "./linearAlgebraOverviewPage";
import { pdeOverviewPage } from "./pdeOverviewPage";
import { aboutPage } from "./aboutPage";
import { notFoundPage } from "./notFoundPage";

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
    expect(target.textContent).toContain("Numerical Analysis Lab");
    expect(target.textContent).toContain("Understand → Compute → Visualize → Analyze");
    expect(target.textContent).toContain("An interactive, AI-assisted platform");
    expect(target.textContent).toContain("Available");
    expect(target.textContent).toContain("In development");
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
    expect(target.querySelector("button")).toBeNull();
  });

  it("describes the available ODE Lab and marks its roadmap as planned", () => {
    const target = mount(odeOverviewPage, "/ode");
    expect(target.textContent).toContain("Initial Value Problems Lab");
    expect(target.textContent).toContain("Open Initial Value Problems Lab");
    for (const item of [
      "Boundary Value Problems",
      "Adaptive Step Size",
      "Stability Regions",
      "Stiff Systems",
    ]) {
      expect(target.textContent).toContain(item);
    }
    expect(target.textContent).toContain("Planned");
    expect(target.textContent).toContain("Linear Algebra");
    expect(target.textContent).toContain("PDE");
  });

  it("keeps Linear Algebra and PDE roadmaps non-runnable", () => {
    const linear = mount(linearAlgebraOverviewPage, "/linear-algebra");
    expect(linear.textContent).toContain("In development");
    for (const item of ["Linear Systems", "Least Squares", "SVD", "Eigenvalues"]) {
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
    expect(pde.querySelector("button, input, textarea, canvas")).toBeNull();
  });

  it("distinguishes the released ODE product from the future platform on About", () => {
    const target = mount(aboutPage, "/about");
    expect(target.textContent).toContain("currently implemented");
    expect(target.textContent).toContain("Initial Value Problems");
    expect(target.textContent).toContain("AI-assisted");
    expect(target.textContent).toContain("planned");
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
