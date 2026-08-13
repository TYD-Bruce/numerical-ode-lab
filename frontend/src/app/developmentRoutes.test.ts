// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import type { RouteModule } from "./contracts";
import {
  createRouteDefinitions,
  matchRoute,
  type DevelopmentRouteDefinitionInput,
} from "./routeDefinitions";

function developmentRoute(
  loader: () => Promise<RouteModule>
): DevelopmentRouteDefinitionInput {
  return {
    id: "glossary-playground",
    path: "/__dev/glossary-playground",
    title: "Glossary Playground | Numerical T Lab",
    kind: "page",
    loader,
  };
}

function mathmlDevelopmentRoute(
  loader: () => Promise<RouteModule>
): DevelopmentRouteDefinitionInput {
  return {
    id: "mathml-capability",
    path: "/__dev/mathml-capability",
    title: "MathML Teaching Capability | Numerical T Lab",
    kind: "page",
    loader,
  };
}

function presentationDevelopmentRoute(
  loader: () => Promise<RouteModule>
): DevelopmentRouteDefinitionInput {
  return {
    id: "presentation-system",
    path: "/__dev/presentation-system",
    title: "Presentation System v1 | Numerical T Lab",
    kind: "page",
    loader,
  };
}

describe("development route injection", () => {
  it("matches the exact route only when explicitly injected", () => {
    const module: RouteModule = {
      mount: () => ({ dispose: vi.fn() }),
    };
    const injected = createRouteDefinitions({
      developmentRoutes: [developmentRoute(async () => module)],
    });
    const production = createRouteDefinitions();

    expect(
      matchRoute(injected, "/__dev/glossary-playground").definition.id
    ).toBe("glossary-playground");
    expect(
      matchRoute(production, "/__dev/glossary-playground").definition.id
    ).toBe("not-found");
  });

  it("keeps the MathML capability route outside public route definitions", () => {
    const module: RouteModule = {
      mount: () => ({ dispose: vi.fn() }),
    };
    const injected = createRouteDefinitions({
      developmentRoutes: [mathmlDevelopmentRoute(async () => module)],
    });
    const production = createRouteDefinitions();

    expect(
      matchRoute(injected, "/__dev/mathml-capability").definition.id
    ).toBe("mathml-capability");
    expect(
      matchRoute(production, "/__dev/mathml-capability").definition.id
    ).toBe("not-found");
    expect(
      production
        .filter((definition) => definition.path !== null)
        .map((definition) => definition.path)
    ).toEqual([
      "/",
      "/ode",
      "/ode/initial-value-problems",
      "/linear-algebra",
      "/linear-algebra/linear-systems",
      "/pde",
      "/about",
    ]);
  });

  it("keeps the Presentation System fixture outside public route definitions", () => {
    const module: RouteModule = {
      mount: () => ({ dispose: vi.fn() }),
    };
    const injected = createRouteDefinitions({
      developmentRoutes: [presentationDevelopmentRoute(async () => module)],
    });
    const production = createRouteDefinitions();

    expect(
      matchRoute(injected, "/__dev/presentation-system").definition.id
    ).toBe("presentation-system");
    expect(
      matchRoute(production, "/__dev/presentation-system").definition.id
    ).toBe("not-found");
    expect(
      production
        .filter((definition) => definition.path !== null)
        .map((definition) => definition.path)
    ).toEqual([
      "/",
      "/ode",
      "/ode/initial-value-problems",
      "/linear-algebra",
      "/linear-algebra/linear-systems",
      "/pde",
      "/about",
    ]);
  });

  it("shares a development loader attempt and evicts only rejection for Retry", async () => {
    const mounted: RouteModule = {
      mount: () => ({ dispose: vi.fn() }),
    };
    const loader = vi
      .fn<() => Promise<RouteModule>>()
      .mockRejectedValueOnce(new Error("dev chunk failed"))
      .mockResolvedValueOnce(mounted);
    const definition = matchRoute(
      createRouteDefinitions({
        developmentRoutes: [developmentRoute(loader)],
      }),
      "/__dev/glossary-playground"
    ).definition;

    const first = definition.loader.load();
    const shared = definition.loader.load();
    await expect(first).rejects.toThrow("dev chunk failed");
    await expect(shared).rejects.toThrow("dev chunk failed");
    definition.loader.evictRejected();
    await expect(definition.loader.load()).resolves.toBe(mounted);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
