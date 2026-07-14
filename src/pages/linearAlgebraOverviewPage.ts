import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
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
        createStatus("In development", "development"),
        document.createTextNode(
          " — this module is a roadmap today and does not yet contain runnable controls."
        )
      );

      const roadmap = document.createElement("section");
      roadmap.className = "platform-card platform-feature-card";
      roadmap.append(
        createTextElement("h2", "Planned learning sequence"),
        createTextElement(
          "p",
          "Linear Systems is the first planned Lab and will establish the shared matrix workflow."
        )
      );
      const list = document.createElement("ul");
      for (const item of ["Linear Systems", "Least Squares", "SVD", "Eigenvalues"]) {
        const entry = document.createElement("li");
        entry.append(document.createTextNode(`${item} `), createStatus("Planned", "planned"));
        list.append(entry);
      }
      roadmap.append(list);
      page.append(statusLine, roadmap);
    });
  },
};
