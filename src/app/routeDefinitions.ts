import type { HomeSessionSource, RouteId, RouteModule } from "./contracts";
import { createRouteLoader, type RouteLoader } from "./routeLoader";
import { aboutPage } from "../pages/aboutPage";
import { createHomePage } from "../pages/homePage";
import { linearAlgebraOverviewPage } from "../pages/linearAlgebraOverviewPage";
import { notFoundPage } from "../pages/notFoundPage";
import { odeOverviewPage } from "../pages/odeOverviewPage";
import { pdeOverviewPage } from "../pages/pdeOverviewPage";

export type RouteKind = "page" | "lab";

export interface RouteDefinition {
  id: RouteId;
  path: string | null;
  title: string;
  kind: RouteKind;
  loader: RouteLoader<RouteModule>;
}

export interface MatchedRoute {
  definition: RouteDefinition;
  requestedPathname: string;
}

export interface NormalizedApplicationLocation {
  pathname: string;
  search: string;
  hash: string;
  href: string;
}

export interface DevelopmentRouteDefinitionInput {
  readonly id: Extract<RouteId, "glossary-playground">;
  readonly path: string;
  readonly title: string;
  readonly kind: RouteKind;
  readonly loader: () => Promise<RouteModule>;
}

interface CreateRouteDefinitionsOptions {
  initialValueProblemsLoader?: () => Promise<RouteModule>;
  homeSessionSource?: HomeSessionSource;
  developmentRoutes?: readonly DevelopmentRouteDefinitionInput[];
}

export function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

export function normalizeApplicationLocation(
  input: string,
  origin: string
): NormalizedApplicationLocation {
  const url = new URL(input, origin);
  const pathname = normalizePathname(url.pathname);
  return {
    pathname,
    search: url.search,
    hash: url.hash,
    href: `${pathname}${url.search}${url.hash}`,
  };
}

export function createRouteDefinitions(
  options: CreateRouteDefinitionsOptions = {}
): RouteDefinition[] {
  const initialValueProblemsLoader =
    options.initialValueProblemsLoader ??
    (() => Promise.reject(new Error("The Initial Value Problems Lab is not registered.")));

  const publicRoutes: RouteDefinition[] = [
    {
      id: "home",
      path: "/",
      title: "Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() =>
        Promise.resolve(createHomePage(options.homeSessionSource))
      ),
    },
    {
      id: "ode-overview",
      path: "/ode",
      title: "Numerical ODE | Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() => Promise.resolve(odeOverviewPage)),
    },
    {
      id: "ode-initial-value-problems",
      path: "/ode/initial-value-problems",
      title: "Initial Value Problems Lab | Numerical T Lab",
      kind: "lab",
      loader: createRouteLoader(initialValueProblemsLoader),
    },
    {
      id: "linear-algebra-overview",
      path: "/linear-algebra",
      title: "Numerical Linear Algebra | Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() => Promise.resolve(linearAlgebraOverviewPage)),
    },
    {
      id: "pde-overview",
      path: "/pde",
      title: "Numerical PDE | Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() => Promise.resolve(pdeOverviewPage)),
    },
    {
      id: "about",
      path: "/about",
      title: "About | Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() => Promise.resolve(aboutPage)),
    },
  ];
  const developmentRoutes = (options.developmentRoutes ?? []).map(
    (definition): RouteDefinition => ({
      id: definition.id,
      path: definition.path,
      title: definition.title,
      kind: definition.kind,
      loader: createRouteLoader(definition.loader),
    })
  );

  return [
    ...publicRoutes,
    ...developmentRoutes,
    {
      id: "not-found",
      path: null,
      title: "Page Not Found | Numerical T Lab",
      kind: "page",
      loader: createRouteLoader(() => Promise.resolve(notFoundPage)),
    },
  ];
}

export function matchRoute(
  definitions: readonly RouteDefinition[],
  pathname: string
): MatchedRoute {
  const requestedPathname = normalizePathname(pathname);
  const definition =
    definitions.find((candidate) => candidate.path === requestedPathname) ??
    definitions.find((candidate) => candidate.id === "not-found");

  if (!definition) throw new Error("Route definitions require a Not Found route.");
  return { definition, requestedPathname };
}

export function findRouteById(
  definitions: readonly RouteDefinition[],
  routeId: RouteId
): RouteDefinition | undefined {
  return definitions.find((definition) => definition.id === routeId);
}
