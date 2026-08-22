import type { RouteModule } from "../app/contracts";
import { createModuleOverview } from "./moduleOverview";
import {
  createRouteLink,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const odeOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      const heading = document.createElement("h1");
      heading.textContent = "Numerical ODE";
      const purpose = createTextElement(
        "p",
        "Numerical ordinary differential equations turn a model of change into a sequence of computable approximations."
      );
      const labHeading = document.createElement("h2");
      labHeading.textContent = "Initial Value Problems Lab";
      const labDescription = createTextElement(
        "p",
        "Compare numerical methods, inspect their computed numerical approximations, and study how error changes as the time-step size is refined."
      );
      const labAction = createRouteLink(
        "Open Initial Value Problems Lab",
        "/ode/initial-value-problems",
        {
          className: "platform-action",
          prefetchRouteId: "ode-initial-value-problems",
        }
      );

      const roadmap = document.createElement("section");
      roadmap.className = "platform-reading-section";
      roadmap.append(createTextElement("h2", "ODE roadmap"));
      const list = document.createElement("ul");
      for (const item of [
        "Boundary Value Problems",
        "Adaptive Step Size",
        "Absolute-stability regions",
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

      page.append(
        createModuleOverview({
          heading,
          summary: purpose,
          primaryItem: {
            heading: labHeading,
            status: createStatus("Available", "available"),
            state: "available",
            content: [labDescription],
            action: labAction,
          },
          sections: [roadmap, connections],
        })
      );
    });
  },
};
