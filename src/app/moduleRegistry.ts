import type { RouteModule } from "./contracts";

export interface PlatformModuleRegistry {
  loadInitialValueProblems(): Promise<RouteModule>;
}

const phaseOneInitialValueProblemsPlaceholder: RouteModule = {
  mount({ target }) {
    const section = document.createElement("section");
    section.className = "platform-page platform-reading-page";
    const heading = document.createElement("h1");
    heading.tabIndex = -1;
    heading.dataset.routeFocus = "true";
    heading.textContent = "Initial Value Problems Lab";
    const message = document.createElement("p");
    message.textContent =
      "The released Lab is intentionally not mounted by the isolated Phase 1 shell.";
    section.append(heading, message);
    target.replaceChildren(section);
    return {
      dispose() {
        section.remove();
      },
    };
  },
};

export function createPhaseOneModuleRegistry(
  initialValueProblemsLoader: () => Promise<RouteModule> = () =>
    Promise.resolve(phaseOneInitialValueProblemsPlaceholder)
): PlatformModuleRegistry {
  return {
    loadInitialValueProblems: initialValueProblemsLoader,
  };
}
