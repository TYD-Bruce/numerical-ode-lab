import type { MountedRoute, RouteModule } from "../app/contracts";

export type StaticPageModule = RouteModule;

export function mountStaticPage(
  target: HTMLElement,
  render: (page: HTMLElement) => void
): MountedRoute {
  const page = document.createElement("article");
  page.className = "platform-page";
  render(page);
  target.replaceChildren(page);
  return {
    dispose() {
      page.remove();
    },
  };
}

export function appendPageHeading(
  page: HTMLElement,
  title: string,
  introduction?: string
): void {
  const header = document.createElement("header");
  header.className = "platform-page-heading";
  const heading = document.createElement("h1");
  heading.tabIndex = -1;
  heading.dataset.routeFocus = "true";
  heading.textContent = title;
  header.append(heading);
  if (introduction) {
    const paragraph = document.createElement("p");
    paragraph.textContent = introduction;
    header.append(paragraph);
  }
  page.append(header);
}

export function createTextElement(
  tagName: "p" | "h2" | "h3" | "li" | "span" | "strong",
  text: string,
  className?: string
): HTMLElement {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

export function createRouteLink(
  label: string,
  href: string,
  options: {
    className?: string;
    prefetchRouteId?: Extract<
      import("../app/contracts").RouteId,
      "ode-initial-value-problems" | "linear-algebra-linear-systems"
    >;
  } = {}
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (options.className) link.className = options.className;
  if (options.prefetchRouteId) {
    link.dataset.prefetchRouteId = options.prefetchRouteId;
  }
  return link;
}

export function createStatus(label: string, tone: "available" | "development" | "planned") {
  const status = createTextElement("span", label, `platform-status platform-status-${tone}`);
  return status;
}
