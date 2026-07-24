import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = resolve(process.cwd(), "src");

function source(path: string): string {
  return readFileSync(resolve(SRC, path), "utf8");
}

function localStaticImports(path: string): string[] {
  const text = source(path);
  const imports = [
    ...text.matchAll(/import\s+(?!type\b)[\s\S]*?from\s+["'](\.[^"']+)["']/g),
    ...text.matchAll(/import\s+["'](\.[^"']+)["']/g),
  ].map((match) => match[1]!);
  return imports.flatMap((specifier) => {
    const base = resolve(SRC, dirname(path), specifier);
    for (const candidate of [`${base}.ts`, `${base}.css`, resolve(base, "index.ts")]) {
      try {
        readFileSync(candidate);
        return [candidate.slice(SRC.length + 1).replaceAll("\\", "/")];
      } catch {
        // Try the next local source candidate.
      }
    }
    return [];
  });
}

function eagerGraph(entry: string): Set<string> {
  const visited = new Set<string>();
  const pending = [entry];
  while (pending.length) {
    const path = pending.pop()!;
    if (visited.has(path)) continue;
    visited.add(path);
    if (!path.endsWith(".ts")) continue;
    pending.push(...localStaticImports(path));
  }
  return visited;
}

describe("public route bundle ownership", () => {
  it("keeps the production entry and bootstrap eager graph platform-only", () => {
    const graph = eagerGraph("main.ts");
    expect([...graph]).toContain("app/platformBootstrap.ts");
    for (const forbidden of [
      "ode/odeApp.ts",
      "ode/initialValueProblemsRoute.ts",
      "solvers.ts",
      "methodCatalog.ts",
      "problemPresets.ts",
      "convergenceStudy.ts",
      "tutor/platformTutorPanel.ts",
      "tutor/tutorClient.ts",
      "aiTutor.ts",
      "math/ui/editableMathField.ts",
    ]) {
      expect(graph.has(forbidden), `${forbidden} leaked into ${[...graph].join(", ")}`).toBe(false);
    }
  });

  it("registers ODE through a dynamic import and no production placeholder", () => {
    const registry = source("app/moduleRegistry.ts");
    expect(registry).toMatch(/import\(["']\.\.\/ode\/initialValueProblemsRoute["']\)/);
    expect(registry).not.toContain("PhaseOne");
    expect(registry).not.toContain("placeholder");
    expect(source("main.ts")).not.toContain("initialValueProblemsRoute");
  });

  it("keeps static pages, shell, Host, and ODE route outside complete Tutor runtime", () => {
    const staticSources = [
      "app/appShell.ts",
      "pages/homePage.ts",
      "pages/odeOverviewPage.ts",
      "pages/linearAlgebraOverviewPage.ts",
      "pages/pdeOverviewPage.ts",
      "pages/aboutPage.ts",
    ].map(source).join("\n");
    expect(staticSources).not.toMatch(/odeApp|initialValueProblemsRoute|platformTutorPanel|tutorClient|aiTutor/);
    expect(source("app/platformTutorHost.ts")).not.toMatch(
      /import\s+\{[^}]*\}\s+from ["']\.\.\/tutor\/platformTutorPanel["']/s
    );
    const odeRoute = source("ode/initialValueProblemsRoute.ts");
    expect(odeRoute).not.toMatch(/platformTutorPanel|tutorClient|aiTutorPanel/);
    expect(source("pages/homePage.ts")).not.toMatch(
      /OdeSessionState|odeSession|initialValueProblemsRoute|AppSessionStore/
    );
    expect(source("app/beforeUnload.ts")).not.toMatch(
      /getSession|odeApp|initialValueProblemsRoute|querySelector|MathLive/
    );
  });

  it("retains MathLive and editable/Compute Engine dynamic imports", () => {
    const app = source("ode/odeApp.ts");
    expect(app).toContain('import("../math/ui/editableMathField")');
    expect(app).not.toMatch(/from ["']mathlive["']/);
    expect(source("math/ui/readonlyMath.ts")).toMatch(/import\(["']mathlive["']\)/);
    expect(source("math/ui/editableMathField.ts")).toContain(
      'from "./mathFieldState"'
    );
    expect(source("math/mathJsonAdapter.ts")).toContain(
      'from "@cortex-js/compute-engine"'
    );
  });

  it("keeps scroll platform-only and New experiment inside the ODE boundary", () => {
    const scroll = source("app/scrollRestoration.ts");
    expect(scroll).not.toMatch(
      /odeApp|initialValueProblemsRoute|Chart|MathLive|localStorage|sessionStorage/
    );
    const odeApp = source("ode/odeApp.ts");
    expect(odeApp).toContain("data-new-experiment");
    expect(odeApp).not.toMatch(
      /AppSessionStore|createPlatformRouter|window\.history|history\.(?:pushState|replaceState)/
    );
    expect(source("app/appSessionStore.ts")).not.toMatch(
      /odeApp|odeSession|initialValueProblemsRoute/
    );
  });

  it("keeps Glossary runtime ownership out of AppSessionStore and the eager platform graph", () => {
    const storeGraph = eagerGraph("app/appSessionStore.ts");
    expect(
      [...storeGraph].filter((path) => path.startsWith("glossary/"))
    ).toEqual([]);

    const contractGraph = eagerGraph("app/contracts.ts");
    expect(
      [...contractGraph].filter((path) => path.startsWith("glossary/"))
    ).toEqual([]);

    const entryGraph = eagerGraph("main.ts");
    expect(
      [...entryGraph].filter((path) => path.startsWith("glossary/"))
    ).toEqual([]);

    const glossaryGraph = eagerGraph("glossary/glossaryController.ts");
    expect(glossaryGraph.has("app/appSessionStore.ts")).toBe(false);
  });
});
