import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createRouteLink,
  createStatus,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const linearAlgebraOverviewPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      appendPageHeading(
        page,
        "Numerical Linear Algebra",
        "Numerical Linear Algebra studies reliable and efficient ways to compute with vectors and matrices."
      );
      const statusLine = document.createElement("p");
      statusLine.append(
        createStatus("Available", "available"),
        document.createTextNode(
          " — one complete Lab is ready for small dense linear systems."
        )
      );

      const available = document.createElement("section");
      available.className = "platform-card platform-feature-card";
      available.append(
        createTextElement("h2", "Linear Systems Lab"),
        createTextElement(
          "p",
          "Solve A x = b with Gaussian elimination and partial pivoting, inspect P A = L U, and check the residual against the original equations."
        ),
        createRouteLink("Open Linear Systems Lab", "/linear-algebra/linear-systems", {
          className: "platform-action",
          prefetchRouteId: "linear-algebra-linear-systems",
        })
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
      page.append(statusLine, available, roadmap);
    });
  },
};
