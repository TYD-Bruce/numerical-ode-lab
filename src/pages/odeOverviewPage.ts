import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createRouteLink,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const odeOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      appendPageHeading(
        page,
        "Numerical ODE",
        "Numerical ordinary differential equations turn a model of change into a sequence of computable approximations."
      );

      const available = document.createElement("section");
      available.className = "platform-card platform-feature-card";
      const headingRow = document.createElement("div");
      headingRow.className = "platform-card-heading-row";
      headingRow.append(
        createTextElement("h2", "Initial Value Problems Lab"),
        createStatus("Available", "available")
      );
      available.append(
        headingRow,
        createTextElement(
          "p",
          "Compare numerical methods, inspect solution curves, and study how error changes as the step size is refined."
        ),
        createRouteLink(
          "Open Initial Value Problems Lab",
          "/ode/initial-value-problems",
          { className: "platform-action", prefetchCompleteLab: true }
        )
      );

      const roadmap = document.createElement("section");
      roadmap.className = "platform-reading-section";
      roadmap.append(createTextElement("h2", "ODE roadmap"));
      const list = document.createElement("ul");
      for (const item of [
        "Boundary Value Problems",
        "Adaptive Step Size",
        "Stability Regions",
        "Stiff Systems",
      ]) {
        const entry = document.createElement("li");
        entry.append(document.createTextNode(`${item} `), createStatus("Planned", "planned"));
        list.append(entry);
      }
      roadmap.append(list);

      const connections = document.createElement("section");
      connections.className = "platform-reading-section";
      connections.append(
        createTextElement("h2", "Connections across numerical analysis"),
        createTextElement(
          "p",
          "ODE methods use ideas from Linear Algebra when systems are coupled, while PDE discretizations often produce large ODE systems. The Linear Algebra and PDE Labs are planned platform directions."
        )
      );

      page.append(available, roadmap, connections);
    });
  },
};
