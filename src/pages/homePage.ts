import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createRouteLink,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

function moduleCard(options: {
  title: string;
  status: HTMLElement;
  description: string;
  action: HTMLAnchorElement;
}): HTMLElement {
  const card = document.createElement("article");
  card.className = "platform-card platform-module-card";
  const headingRow = document.createElement("div");
  headingRow.className = "platform-card-heading-row";
  headingRow.append(createTextElement("h3", options.title), options.status);
  card.append(headingRow, createTextElement("p", options.description), options.action);
  return card;
}

export const homePage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      appendPageHeading(
        page,
        "Numerical Analysis Lab",
        "An interactive, AI-assisted platform for learning numerical analysis through computation, visualization, error analysis, and guided experiments."
      );

      const cycle = document.createElement("section");
      cycle.className = "platform-learning-cycle";
      cycle.setAttribute("aria-labelledby", "learning-cycle-title");
      const cycleHeading = createTextElement("h2", "A practical learning cycle");
      cycleHeading.id = "learning-cycle-title";
      cycle.append(
        cycleHeading,
        createTextElement("p", "Understand → Compute → Visualize → Analyze")
      );

      const modules = document.createElement("section");
      modules.setAttribute("aria-labelledby", "module-heading");
      const modulesHeading = createTextElement("h2", "Explore the modules");
      modulesHeading.id = "module-heading";
      const cards = document.createElement("div");
      cards.className = "platform-card-grid";
      cards.append(
        moduleCard({
          title: "Numerical ODE",
          status: createStatus("Available", "available"),
          description:
            "Experiment with fixed-step methods for initial value problems and analyze numerical error.",
          action: createRouteLink("Open Lab", "/ode/initial-value-problems", {
            className: "platform-action",
            prefetchCompleteLab: true,
          }),
        }),
        moduleCard({
          title: "Numerical Linear Algebra",
          status: createStatus("In development", "development"),
          description:
            "Build intuition for the matrix computations that support numerical models.",
          action: createRouteLink("View roadmap", "/linear-algebra", {
            className: "platform-action platform-action-secondary",
          }),
        }),
        moduleCard({
          title: "Numerical PDE",
          status: createStatus("Planned", "planned"),
          description:
            "Connect discretization, stability, and refinement to spatially varying systems.",
          action: createRouteLink("View roadmap", "/pde", {
            className: "platform-action platform-action-secondary",
          }),
        })
      );
      modules.append(modulesHeading, cards);

      const path = document.createElement("section");
      path.className = "platform-reading-section";
      const pathHeading = createTextElement("h2", "Recommended Learning Path");
      const list = document.createElement("ol");
      const first = createTextElement("li", "Initial Value Problems");
      const second = document.createElement("li");
      second.append(
        document.createTextNode("Linear Systems "),
        createStatus("Future Lab", "development")
      );
      const third = document.createElement("li");
      third.append(
        document.createTextNode("Heat and Poisson Equations "),
        createStatus("Future Labs", "planned")
      );
      list.append(first, second, third);
      path.append(
        pathHeading,
        createTextElement(
          "p",
          "This sequence is recommended, not required. Start wherever your questions are strongest."
        ),
        list
      );

      page.append(cycle, modules, path);
    });
  },
};
