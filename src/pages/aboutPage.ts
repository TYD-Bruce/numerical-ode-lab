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
        "Numerical T-Lab is an interactive, AI-assisted environment for learning numerical analysis through guided computational experiments."
      );

      const pillars = document.createElement("section");
      const pillarList = document.createElement("ul");
      const theory = document.createElement("li");
      theory.append(
        createTextElement("strong", "Theory"),
        document.createTextNode(
          " — explains why numerical methods work, including their assumptions, limitations, stability, and error behavior."
        )
      );
      const tools = document.createElement("li");
      tools.append(
        createTextElement("strong", "Tools"),
        document.createTextNode(
          " — provides computation, numerical solvers, visualizations, comparisons, and experiments."
        )
      );
      const teaching = document.createElement("li");
      teaching.append(
        createTextElement("strong", "Teaching"),
        document.createTextNode(
          " — provides guided workflows, the AI Tutor, and beginner-oriented interpretation today. The approved Interactive Glossary framework is planned as the next shared learning capability."
        )
      );
      pillarList.append(theory, tools, teaching);
      pillars.append(
        createTextElement("h2", "Theory · Tools · Teaching"),
        createTextElement(
          "p",
          "The T represents three public pillars that shape the learning experience."
        ),
        pillarList
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

      page.append(pillars, current, future);
    });
  },
};
