import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const APP_DIR = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = dirname(APP_DIR);
const PAGES_DIR = join(SRC_DIR, "pages");

function filesUnder(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe("platform theme tokens", () => {
  it("defines every required semantic token in the centralized theme", () => {
    const theme = readFileSync(join(APP_DIR, "theme.css"), "utf8");
    for (const token of [
      "--color-page-background",
      "--color-surface-primary",
      "--color-surface-raised",
      "--color-surface-inset",
      "--color-text-primary",
      "--color-text-secondary",
      "--color-accent-primary",
      "--color-accent-primary-strong",
      "--color-accent-secondary",
      "--color-border",
      "--color-focus-ring",
      "--color-success",
      "--color-caution",
      "--color-danger",
      "--shadow-card",
      "--texture-decorative",
      "--space-1",
      "--space-8",
      "--radius-sm",
      "--radius-lg",
      "--content-width-platform",
      "--content-width-reading",
      "--layer-platform-modal",
      "--layer-glossary-popover",
      "--color-glossary-underline",
      "--glossary-popover-width",
      "--glossary-popover-min-width",
      "--glossary-popover-max-width",
      "--glossary-viewport-margin",
      "--glossary-trigger-gap",
    ]) {
      expect(theme).toContain(`${token}:`);
    }
    expect(theme).toMatch(/--texture-decorative:\s*none/);
    expect(theme).toMatch(/color-scheme:\s*dark/);
  });

  it("keeps literal colors out of new component CSS", () => {
    const cssFiles = [...filesUnder(APP_DIR), ...filesUnder(PAGES_DIR)].filter(
      (path) => extname(path) === ".css" && !path.endsWith("theme.css")
    );
    const literalColor = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/i;

    for (const file of cssFiles) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(literalColor);
    }

    const platform = readFileSync(join(APP_DIR, "platform.css"), "utf8");
    expect(platform).toContain(":focus-visible");
    expect(platform).toMatch(/overflow-x:\s*hidden/);
    expect(platform).toContain("@media");

    const glossarySurface = readFileSync(
      join(SRC_DIR, "glossary", "surface", "glossarySurface.css"),
      "utf8"
    );
    expect(glossarySurface).toContain("prefers-reduced-motion");
    expect(glossarySurface).toContain("forced-colors");
    expect(glossarySurface).toMatch(/max-height:\s*82dvh/);
    expect(glossarySurface).not.toMatch(literalColor);

    const glossaryPlayground = readFileSync(
      join(SRC_DIR, "dev", "glossary", "glossaryPlayground.css"),
      "utf8"
    );
    expect(glossaryPlayground).toContain("prefers-reduced-motion");
    expect(glossaryPlayground).toContain("forced-colors");
    expect(glossaryPlayground).toMatch(/overflow-wrap:\s*anywhere/);
    expect(glossaryPlayground).not.toMatch(literalColor);
  });

  it("keeps new platform runtime modules outside heavy ODE, Tutor, and math imports", () => {
    const sourceFiles = [...filesUnder(APP_DIR), ...filesUnder(PAGES_DIR)].filter(
      (path) =>
        extname(path) === ".ts" &&
        !path.endsWith(".test.ts") &&
        !path.endsWith(".d.ts")
    );
    const forbidden = [
      "chart.js",
      "../solvers",
      "../methodCatalog",
      "../problemPresets",
      "../convergenceStudy",
      "../convergenceStudyState",
      "../convergenceStudyView",
      "../convergenceTutor",
      "../aiTutor",
      "../aiTutorPanel",
      "mathlive",
      "@cortex-js/compute-engine",
      "editableMathField",
      "../main",
    ];

    for (const file of sourceFiles) {
      const source = readFileSync(file, "utf8");
      for (const dependency of forbidden) {
        const escaped = dependency.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        expect(source, `${file} imports ${dependency}`).not.toMatch(
          new RegExp(`(?:from\\s*|import\\()(["'])${escaped}`)
        );
      }
    }
  });
});
