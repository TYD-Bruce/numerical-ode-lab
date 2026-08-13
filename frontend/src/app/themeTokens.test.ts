import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const APP_DIR = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = dirname(APP_DIR);
const PAGES_DIR = join(SRC_DIR, "pages");

function themeBlock(theme: string, name: "light" | "dark"): string {
  const match = theme.match(
    new RegExp(
      `html\\[data-theme=["']${name}["']\\]\\s*\\{([\\s\\S]*?)(?=\\n\\}|$)`
    )
  );
  expect(match, `${name} theme block`).not.toBeNull();
  return match?.[1] ?? "";
}

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
      "--color-surface-soft",
      "--color-surface-accent",
      "--color-text-primary",
      "--color-text-secondary",
      "--color-accent-primary",
      "--color-accent-primary-strong",
      "--color-accent-secondary",
      "--color-accent-theory",
      "--color-accent-cyan",
      "--color-border",
      "--color-border-strong",
      "--color-focus-ring",
      "--color-success",
      "--color-caution",
      "--color-danger",
      "--color-success-surface",
      "--color-caution-surface",
      "--color-danger-surface",
      "--color-disabled-text",
      "--color-disabled-surface",
      "--color-on-accent",
      "--color-header-background",
      "--color-header-text",
      "--color-method-accent",
      "--color-data-accent",
      "--color-output-accent",
      "--color-convergence-accent",
      "--color-chart-primary",
      "--color-chart-secondary",
      "--color-chart-theory",
      "--color-chart-compare",
      "--color-chart-text",
      "--color-chart-grid",
      "--shadow-card",
      "--shadow-popover",
      "--background-page-canvas",
      "--background-data-ink",
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
      "--motion-fast",
      "--motion-state",
      "--motion-transform",
      "--ease-standard",
      "--ease-transform",
    ]) {
      expect(theme).toContain(`${token}:`);
    }
    expect(theme).toMatch(/--texture-decorative:\s*none/);
    expect(theme).toContain('html[data-theme="light"]');
    expect(theme).toContain('html[data-theme="dark"]');
    expect(theme).toMatch(/color-scheme:\s*light/);
    expect(theme).toMatch(/color-scheme:\s*dark/);
    expect(theme).toMatch(/--motion-fast:\s*140ms/);
    expect(theme).toMatch(/--motion-state:\s*220ms/);
    expect(theme).toMatch(/--motion-transform:\s*420ms/);
    expect(theme).toContain(".computation-marker");
    for (const state of [
      "is-selected",
      "is-source",
      "is-target",
      "is-changed",
      "is-solved",
      "is-maximum",
    ]) {
      expect(theme).toContain(`.${state}`);
    }
  });

  it("defines the complete Phase 0 Lab presentation vocabulary without domain coupling", () => {
    const theme = readFileSync(join(APP_DIR, "theme.css"), "utf8");
    const light = themeBlock(theme, "light");
    const dark = themeBlock(theme, "dark");
    const stages = ["method", "data", "output", "analysis"];
    const stageRoles = ["accent", "foreground", "surface", "border", "selected"];

    for (const stage of stages) {
      for (const role of stageRoles) {
        const token = `--lab-stage-${stage}-${role}`;
        expect(light, `Light ${token}`).toContain(`${token}:`);
        expect(dark, `Dark ${token}`).toContain(`${token}:`);
      }
    }

    const stageTokenIdentifiers = [
      ...theme.matchAll(/--lab-stage-[a-z-]+(?=:)/g),
    ].map(([identifier]) => identifier);
    expect(stageTokenIdentifiers).not.toHaveLength(0);
    expect(stageTokenIdentifiers.join("\n")).not.toMatch(/ode|linear-systems|pde/);

    for (const surface of ["page", "stage", "section", "inset", "elevated"]) {
      expect(light).toContain(`--lab-surface-${surface}:`);
      expect(dark).toContain(`--lab-surface-${surface}:`);
    }
    for (const border of ["quiet", "standard", "strong"]) {
      expect(light).toContain(`--lab-border-${border}:`);
      expect(dark).toContain(`--lab-border-${border}:`);
    }
    for (const role of [
      "lab-title",
      "stage-title",
      "section-title",
      "body",
      "metadata",
      "eyebrow",
      "numeric",
      "supporting",
    ]) {
      expect(theme).toContain(`--lab-type-${role}-size:`);
    }
    for (const space of ["inline", "header", "stage", "section", "block", "compact"]) {
      expect(theme).toMatch(
        new RegExp(`--lab-space-${space}:\\s*var\\(--space-(?:1|2|3|4|6|8|12)\\)`)
      );
    }
    for (const radius of ["stage", "section", "control", "compact"]) {
      expect(theme).toMatch(
        new RegExp(`--lab-radius-${radius}:\\s*var\\(--radius-(?:sm|md|lg)\\)`)
      );
    }
    for (const status of [
      "neutral",
      "ready",
      "current",
      "stale",
      "caution",
      "failure",
      "planned",
    ]) {
      for (const role of ["foreground", "border", "surface"]) {
        const token = `--lab-status-${status}-${role}:`;
        expect(light).toContain(token);
        expect(dark).toContain(token);
      }
    }
    for (const action of ["primary", "secondary", "quiet", "danger"]) {
      for (const role of ["foreground", "border", "background"]) {
        const token = `--lab-action-${action}-${role}:`;
        expect(light).toContain(token);
        expect(dark).toContain(token);
      }
    }
    for (const state of ["default", "hover", "active", "focus", "disabled", "invalid"]) {
      expect(theme).toContain(`--lab-control-${state}-`);
    }
    expect(theme).toContain("--lab-focus-ring-color:");
    expect(theme).toMatch(/--lab-focus-ring-width:\s*3px/);
    expect(theme).not.toMatch(/@import\s|url\s*\(/i);
  });

  it("boots the supported saved theme before the application module", () => {
    const index = readFileSync(join(dirname(SRC_DIR), "index.html"), "utf8");
    expect(index).toContain('const key = "numerical-t-lab-theme"');
    expect(index).toContain('saved === "light" || saved === "dark"');
    expect(index.indexOf("document.documentElement.dataset.theme"))
      .toBeLessThan(index.indexOf('src="/src/main.ts"'));
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
    expect(platform).toMatch(
      /\.platform-theme-toggle\s*\{[^}]*width:\s*40px[^}]*height:\s*40px/s
    );
    expect(platform).toMatch(
      /\.platform-theme-toggle svg\s*\{[^}]*width:\s*24px[^}]*height:\s*24px/s
    );

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

    const mathmlCapability = readFileSync(
      join(SRC_DIR, "dev", "mathml", "mathmlCapability.css"),
      "utf8"
    );
    expect(mathmlCapability).toContain("forced-colors");
    expect(mathmlCapability).toMatch(/overflow-x:\s*auto/);
    expect(mathmlCapability).not.toMatch(literalColor);
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
