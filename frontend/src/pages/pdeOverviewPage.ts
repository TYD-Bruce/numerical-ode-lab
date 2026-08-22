import type { RouteModule } from "../app/contracts";
import { createModuleOverview } from "./moduleOverview";
import {
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const pdeOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      const heading = document.createElement("h1");
      heading.textContent = "Numerical PDE";
      const purpose = createTextElement(
        "p",
        "Numerical partial differential equations approximate models that vary across both space and time."
      );
      const roadmapStatus = createTextElement(
        "p",
        "This overview describes future Labs and has no runnable controls."
      );
      const labsHeading = document.createElement("h2");
      labsHeading.textContent = "Future PDE Labs";
      const list = document.createElement("ul");
      for (const item of ["Heat", "Wave", "Poisson"]) {
        const entry = document.createElement("li");
        entry.textContent = `${item} Lab`;
        list.append(entry);
      }

      const concepts = document.createElement("section");
      concepts.className = "platform-reading-section";
      concepts.append(
        createTextElement("h2", "What the module will connect"),
        createTextElement(
          "p",
          "Future experiments will connect finite differences, boundary conditions, stability, and refinement. Spatial discretization also leads naturally to systems from Linear Algebra."
        )
      );
      page.append(
        createModuleOverview({
          heading,
          summary: purpose,
          primaryItem: {
            heading: labsHeading,
            status: createStatus("Planned", "planned"),
            state: "planned",
            statusDetail: roadmapStatus,
            content: [list],
          },
          sections: [concepts],
        })
      );
    });
  },
};
