import type {
  HomeSessionSource,
  ResumeSummary,
  RouteModule,
} from "../app/contracts";
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
  const action = document.createElement("div");
  action.className = "platform-module-card-action";
  action.append(options.action);
  card.append(headingRow, createTextElement("p", options.description), action);
  return card;
}

function resumeCard(summary: ResumeSummary): HTMLElement {
  const card = document.createElement("article");
  card.className = "platform-card platform-resume-card";
  card.dataset.resumeModule = summary.moduleId;
  const details = summary.methodLabel
    ? `${summary.stepLabel} · ${summary.methodLabel}`
    : summary.stepLabel;
  card.append(
    createTextElement("h3", summary.labTitle),
    createTextElement("p", details, "platform-resume-details")
  );
  if (summary.analysisLabel) {
    card.append(
      createTextElement(
        "p",
        summary.analysisLabel,
        "platform-resume-analysis"
      )
    );
  }
  if (summary.resultLabel) {
    card.append(
      createTextElement(
        "p",
        summary.resultLabel,
        "platform-resume-analysis"
      )
    );
  }
  card.append(
    createRouteLink("Resume Lab", summary.route, {
      className: "platform-action",
      prefetchRouteId:
        summary.moduleId === "ode"
          ? "ode-initial-value-problems"
          : summary.moduleId === "linear_algebra"
            ? "linear-algebra-linear-systems"
            : undefined,
    })
  );
  return card;
}

function newestUniqueSummaries(
  source: HomeSessionSource
): readonly ResumeSummary[] {
  const seen = new Set<ResumeSummary["moduleId"]>();
  return [...source.getResumeSummaries(3)]
    .sort(
      (a, b) => b.lastMeaningfulInteraction - a.lastMeaningfulInteraction
    )
    .filter((summary) => {
      if (seen.has(summary.moduleId)) return false;
      seen.add(summary.moduleId);
      return true;
    })
    .slice(0, 3);
}

export function createHomePage(sessionSource?: HomeSessionSource): RouteModule {
  return {
    mount({ target }) {
      const mounted = mountStaticPage(target, (page) => {
        appendPageHeading(
          page,
          "Numerical T Lab",
          "An Interactive Numerical Analysis Laboratory"
        );
        const hero = page.querySelector<HTMLElement>(".platform-page-heading")!;
        hero.classList.add("platform-home-hero");
        const descriptor = hero.querySelector("p")!;
        descriptor.classList.add("platform-product-descriptor");
        descriptor.before(
          createTextElement(
            "p",
            "Theory · Tools · Teaching",
            "platform-brand-pillars"
          )
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
            title: "Numerical Linear Algebra",
            status: createStatus("Available", "available"),
            description:
              "Solve small dense linear systems and inspect the numerical evidence behind pivoting, factorization, and residual checks.",
            action: createRouteLink("Open Lab", "/linear-algebra/linear-systems", {
              className: "platform-action",
              prefetchRouteId: "linear-algebra-linear-systems",
            }),
          }),
          moduleCard({
            title: "Numerical ODE",
            status: createStatus("Available", "available"),
            description:
              "Experiment with fixed-step methods for initial value problems and analyze numerical error.",
            action: createRouteLink("Open Lab", "/ode/initial-value-problems", {
              className: "platform-action",
              prefetchRouteId: "ode-initial-value-problems",
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
          createStatus("Available", "available")
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

      const page = target.querySelector<HTMLElement>(".platform-page")!;
      let resumeSection: HTMLElement | undefined;
      const renderResume = (): void => {
        resumeSection?.remove();
        resumeSection = undefined;
        if (!sessionSource) return;
        const summaries = newestUniqueSummaries(sessionSource);
        if (summaries.length === 0) return;
        const section = document.createElement("section");
        section.className = "platform-resume-section";
        section.setAttribute("aria-labelledby", "resume-heading");
        const heading = createTextElement("h2", "Continue your experiment");
        heading.id = "resume-heading";
        const cards = document.createElement("div");
        cards.className = "platform-resume-grid";
        cards.append(...summaries.map(resumeCard));
        section.append(heading, cards);
        page.insertBefore(section, page.children[1] ?? null);
        resumeSection = section;
      };
      renderResume();
      const unsubscribe = sessionSource?.subscribe(renderResume);
      let disposed = false;
      return {
        dispose(): void {
          if (disposed) return;
          disposed = true;
          unsubscribe?.();
          mounted.dispose();
        },
      };
    },
  };
}

export const homePage: RouteModule = createHomePage();
