import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const aboutPage: RouteModule = {
  mount({ target }) {
    return mountStaticPage(target, (page) => {
      page.classList.add("platform-reading-page");
      appendPageHeading(
        page,
        "About",
        "Numerical Analysis Lab is an educational, AI-assisted environment for learning through guided computational experiments."
      );

      const current = document.createElement("section");
      current.append(
        createTextElement("h2", "What is available now"),
        createTextElement(
          "p",
          "The currently implemented product is the Numerical ODE Initial Value Problems Lab, including fixed-step methods, visual comparison, exact-solution support, and convergence analysis."
        )
      );

      const future = document.createElement("section");
      future.append(
        createTextElement("h2", "Future platform direction"),
        createTextElement(
          "p",
          "The planned platform expands toward Numerical Linear Algebra and Numerical PDE while retaining a computation-first learning cycle and carefully grounded AI assistance. Planned modules are presented as roadmaps, not released tools."
        )
      );

      page.append(current, future);
    });
  },
};
