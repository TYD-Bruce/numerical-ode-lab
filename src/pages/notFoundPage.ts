import type { RouteModule } from "../app/contracts";
import {
  appendPageHeading,
  createRouteLink,
  createTextElement,
  mountStaticPage,
} from "./pageContracts";

export const notFoundPage: RouteModule = {
  mount({ target, location }) {
    return mountStaticPage(target, (page) => {
      page.classList.add("platform-reading-page");
      appendPageHeading(
        page,
        "Page Not Found",
        "That address does not match a page in the Numerical Analysis Lab."
      );
      const requested = document.createElement("p");
      requested.append(document.createTextNode("Requested path: "));
      const path = document.createElement("code");
      path.textContent = location.pathname;
      requested.append(path);

      const actions = document.createElement("div");
      actions.className = "platform-action-row";
      actions.append(
        createRouteLink("Home", "/", { className: "platform-action" }),
        createRouteLink("Initial Value Problems Lab", "/ode/initial-value-problems", {
          className: "platform-action platform-action-secondary",
          prefetchCompleteLab: true,
        })
      );

      page.append(
        requested,
        createTextElement("p", "Choose one of these destinations to continue."),
        actions
      );
    });
  },
};
