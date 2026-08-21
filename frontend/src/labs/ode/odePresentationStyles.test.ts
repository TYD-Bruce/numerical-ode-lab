import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ODE_DIR = dirname(fileURLToPath(import.meta.url));
const styles = readFileSync(join(ODE_DIR, "odeApp.css"), "utf8");

function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = styles.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  expect(match, selector).not.toBeNull();
  return match?.[1] ?? "";
}

describe("ODE Phase 3 presentation typography", () => {
  it("uses an accepted restrained token for the explicitly labelled primary value", () => {
    const primaryValue = rule(".ode-primary-numeric-value");

    expect(primaryValue).toContain(
      "font-size: var(--lab-type-stage-title-size)"
    );
    expect(primaryValue).not.toContain("--lab-type-numeric-size");
  });

  it("gives stored-value row headers and data cells one regular body weight", () => {
    expect(styles).toMatch(
      /\.ode-values-table tbody th,\s*\.ode-values-table tbody td\s*\{[\s\S]*?font-weight:\s*400;/
    );
    expect(styles).not.toMatch(
      /\.ode-values-table[^\{]*(?::last-child|:last-of-type)[^{]*\{/
    );
  });

  it("keeps wide Convergence evidence inside its local scroll frames", () => {
    expect(styles).toMatch(
      /\.ode-convergence-analysis\s+:where\([\s\S]*?\.convergence-analysis-evidence[\s\S]*?\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/
    );
    expect(styles).toMatch(
      /\.ode-convergence-analysis\s+:where\([\s\S]*?\.convergence-results-table,[\s\S]*?\.convergence-chart-section,[\s\S]*?\.convergence-teaching[\s\S]*?\)\s*\{[\s\S]*?min-width:\s*0;/
    );
  });
});
