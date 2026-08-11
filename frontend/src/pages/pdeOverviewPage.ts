import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const pdeOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      appendPageHeading(
        page,
        "Numerical PDE",
        "Numerical partial differential equations approximate models that vary across both space and time."
      );
      const statusLine = document.createElement("p");
      statusLine.append(
        createStatus("Planned", "planned"),
        document.createTextNode(
          " — this overview describes future Labs and has no runnable controls."
        )
      );

      const labs = document.createElement("section");
      labs.className = "platform-card platform-feature-card";
      labs.append(createTextElement("h2", "Future PDE Labs"));
      const list = document.createElement("ul");
      for (const item of ["Heat", "Wave", "Poisson"]) {
        const entry = document.createElement("li");
        entry.append(
          document.createTextNode(`${item} Lab `),
          createStatus("Planned", "planned")
        );
        list.append(entry);
      }
      labs.append(list);

      const concepts = document.createElement("section");
      concepts.className = "platform-reading-section";
      concepts.append(
        createTextElement("h2", "What the module will connect"),
        createTextElement(
          "p",
          "Future experiments will connect finite differences, boundary conditions, stability, and refinement. Spatial discretization also leads naturally to systems from Linear Algebra."
        )
      );
      page.append(statusLine, labs, concepts);
    });
  },
};
