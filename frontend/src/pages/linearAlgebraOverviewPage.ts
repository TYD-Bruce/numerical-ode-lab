import type { RouteModule } from "../app/contracts";
import { createModuleOverview } from "./moduleOverview";
import {
  createRouteLink,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const linearAlgebraOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      const heading = document.createElement("h1");
      heading.textContent = "Numerical Linear Algebra";
      const purpose = createTextElement(
        "p",
        "Numerical Linear Algebra studies reliable and efficient ways to compute with vectors and matrices."
      );
      const labHeading = document.createElement("h2");
      labHeading.textContent = "Linear Systems Lab";
      const availability = createTextElement(
        "p",
        "One complete Lab is ready for small dense linear systems."
      );
      const labDescription = createTextElement(
        "p",
        "Solve A x = b with Gaussian elimination and partial pivoting, inspect P A = L U, and check the residual against the original equations."
      );
      const labAction = createRouteLink(
        "Open Linear Systems Lab",
        "/linear-algebra/linear-systems",
        {
          className: "platform-action",
          prefetchRouteId: "linear-algebra-linear-systems",
        }
      );
      const roadmap = document.createElement("section");
      roadmap.className = "platform-reading-section";
      roadmap.append(createTextElement("h2", "Future learning sequence"));
      const list = document.createElement("ul");
      for (const item of ["Least Squares", "SVD", "Eigenvalues"]) {
        const entry = document.createElement("li");
        entry.append(document.createTextNode(`${item} `), createStatus("Planned", "planned"));
        list.append(entry);
      }
      roadmap.append(list);
      page.append(
        createModuleOverview({
          heading,
          summary: purpose,
          primaryItem: {
            heading: labHeading,
            status: createStatus("Available", "available"),
            state: "available",
            statusDetail: availability,
            content: [labDescription],
            action: labAction,
          },
          sections: [roadmap],
        })
      );
    });
  },
};
