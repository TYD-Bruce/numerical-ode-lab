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

describe("ODE presentation typography", () => {
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

describe("ODE selected-method presentation ownership", () => {
  it("keeps the selected rail on the shell and one generalized inset on its content", () => {
    const shellRailRule = styles.match(
      /\.ode-selected-method-shell\s*\{[^}]*border-inline-start:[^}]*\}/
    )?.[0];
    const contentRule = rule(".ode-selected-method-content");

    expect(shellRailRule).toContain("border-inline-start");
    expect(shellRailRule).not.toMatch(/\bpadding(?:\s*:|-inline)/);
    expect(contentRule).toContain("padding:");
    expect(contentRule).not.toContain("border-inline-start");
  });

  it("keeps selected teaching under the inset with local math containment and authored mobile flow", () => {
    const lens = rule(".ode-selected-teaching-lens");
    const primaryMath = rule(".ode-method-primary-math");
    const supportingMath = rule(".ode-method-supporting-formula-math");

    expect(lens).toContain("display: grid");
    expect(lens).toContain("min-width: 0");
    expect(lens).not.toContain("border-inline-start");
    expect(primaryMath).toContain("background: var(--lab-surface-inset)");
    expect(supportingMath).toContain("overflow-x: auto");
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.ode-method-diagram-track\s*\{[\s\S]*?flex-direction:\s*column;/
    );
    expect(styles).toMatch(
      /\.ode-method-diagram-predictor_corrector \.ode-method-diagram-branches \.ode-method-diagram-step\s*\{[\s\S]*?border-inline-start:/
    );
    expect(styles).toMatch(
      /\.ode-method-diagram-predictor_corrector \.ode-method-diagram-track\s*\{[\s\S]*?flex-direction:\s*column;/
    );
    expect(styles).toMatch(
      /\.ode-method-diagram-predictor_corrector \.ode-method-diagram-branches\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/
    );
    expect(styles).toMatch(
      /\.ode-method-diagram-solution_history \.ode-method-diagram-step\s*\{[\s\S]*?border-inline-start:/
    );
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.ode-method-diagram-branches\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/
    );
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.ode-method-diagram-predictor_corrector \.ode-method-diagram-branches\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/
    );
    expect(styles).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.ode-method-diagram-staggered_state \[data-diagram-step\]\s*\{[\s\S]*?transform:\s*none;/
    );
    expect(`${lens}${primaryMath}${supportingMath}`).not.toContain(
      "var(--space-5)"
    );
  });
});
