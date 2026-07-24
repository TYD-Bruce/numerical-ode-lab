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
    title: "Glossary Playground | Numerical T-Lab",
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
