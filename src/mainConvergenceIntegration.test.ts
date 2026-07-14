import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const mainSource = readFileSync(new URL("./main.ts", import.meta.url), "utf8");
const appSource = readFileSync(new URL("./ode/odeApp.ts", import.meta.url), "utf8");
const routeSource = readFileSync(
  new URL("./ode/initialValueProblemsRoute.ts", import.meta.url),
  "utf8"
);
const styles = readFileSync(new URL("./style.css", import.meta.url), "utf8");

describe("mountable ODE integration boundaries", () => {
  it("keeps main.ts as a thin compatibility bootstrap", () => {
    expect(mainSource.split(/\r?\n/).length).toBeLessThan(60);
    expect(mainSource).toContain('from "./ode/initialValueProblemsRoute"');
    expect(mainSource).toContain("createCurrentCompatibilitySession()");
    expect(mainSource).toContain("mounted.dispose()");
    for (const forbidden of [
      "chart.js",
      "integrateFirstOrder",
      "runConvergenceStudy",
      "mountEditableMathField",
      "function render",
    ]) {
      expect(mainSource).not.toContain(forbidden);
    }
  });

  it("keeps the route adapter independent from router and store ownership", () => {
    expect(routeSource).toContain('from "./odeApp"');
    expect(routeSource).toContain("getTutorBinding");
    expect(routeSource).not.toContain("appSessionStore");
    expect(routeSource).not.toContain("../app/router");
    expect(routeSource).not.toContain("#app");
  });

  it("retains deferred expression loading and pure Convergence storage", () => {
    expect(appSource).toContain('import("../math/ui/editableMathField")');
    expect(appSource).not.toContain('from "mathlive"');
    expect(appSource).not.toContain("new Map<string, ConvergenceUiState>");
    expect(appSource).toContain("setConvergenceState(");
    expect(appSource).toContain("requestConversationReset();");
  });

  it("contains chart and table overflow without widening the page", () => {
    expect(styles).toMatch(/\.convergence-chart-scroll[\s\S]*overflow-x:\s*auto/);
    expect(styles).toMatch(/\.convergence-chart-region[\s\S]*min-width:\s*520px/);
    expect(styles).not.toMatch(/body\s*\{[^}]*min-width:/);
  });
});
