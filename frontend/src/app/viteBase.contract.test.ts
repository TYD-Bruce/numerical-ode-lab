import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { build, resolveConfig } from "vite";

let outputDirectory = "";
let indexHtml = "";
let manifest: Record<
  string,
  { file: string; css?: string[]; dynamicImports?: string[] }
> = {};
let emittedCss = "";
let emittedJavaScript = "";

describe("Vite root-base deployment contract", () => {
  beforeAll(async () => {
    const configFile = resolve(process.cwd(), "frontend", "vite.config.ts");
    const config = await resolveConfig({ configFile }, "build");
    expect(config.base).toBe("/");

    outputDirectory = await mkdtemp(join(tmpdir(), "numerical-t-lab-vite-base-"));
    await build({
      configFile,
      logLevel: "silent",
      build: {
        emptyOutDir: true,
        manifest: true,
        outDir: outputDirectory,
      },
    });

    indexHtml = await readFile(join(outputDirectory, "index.html"), "utf8");
    manifest = JSON.parse(
      await readFile(join(outputDirectory, ".vite", "manifest.json"), "utf8"),
    ) as typeof manifest;

    const assetDirectory = join(outputDirectory, "assets");
    const cssFiles = (await readdir(assetDirectory)).filter((file) => file.endsWith(".css"));
    emittedCss = (
      await Promise.all(cssFiles.map((file) => readFile(join(assetDirectory, file), "utf8")))
    ).join("\n");
    const javascriptFiles = (await readdir(assetDirectory)).filter((file) =>
      file.endsWith(".js")
    );
    emittedJavaScript = (
      await Promise.all(
        javascriptFiles.map((file) => readFile(join(assetDirectory, file), "utf8"))
      )
    ).join("\n");
  }, 60_000);

  afterAll(async () => {
    if (outputDirectory) {
      await rm(outputDirectory, { force: true, recursive: true });
    }
  });

  it("configures the public application at the root origin", async () => {
    const config = await resolveConfig(
      { configFile: resolve(process.cwd(), "frontend", "vite.config.ts") },
      "build",
    );
    expect(config.base).toBe("/");
    expect(config.base).not.toBe("./");
  });

  it("emits root-origin entry and stylesheet references", () => {
    expect(indexHtml).toMatch(/(?:src|href)="\/assets\//);
    expect(indexHtml).not.toMatch(/(?:src|href)="\.\/assets\//);
  });

  it("uses the canonical product title in generated HTML", () => {
    expect(indexHtml).toContain("<title>Numerical T Lab</title>");
    expect(indexHtml).not.toContain("<title>Numerical Analysis Lab</title>");
    expect(indexHtml).not.toContain("<title>Numerical ODE Lab</title>");
  });

  it("keeps dynamic chunks measurable in the manifest", () => {
    const entry = manifest["index.html"];
    expect(entry?.file).toMatch(/^assets\//);
    expect(entry?.dynamicImports).toContain(
      "src/labs/ode/initialValueProblemsRoute.ts",
    );
    expect(entry?.dynamicImports).toContain("src/tutor/platformTutorPanel.ts");
    expect(entry?.dynamicImports).toContain(
      "src/glossary/surface/glossarySurfaceRuntime.ts"
    );
    expect(entry?.dynamicImports).toContain(
      "src/labs/linear-algebra/linearSystemsRoute.ts"
    );
  });

  it("excludes the development Glossary route and fixtures from production output", () => {
    const keys = Object.keys(manifest).join("\n");
    expect(keys).not.toContain("glossaryPlaygroundRoute");
    expect(keys).not.toContain("glossaryFixtures");
    expect(keys).not.toContain("glossaryDevelopmentControls");
    expect(keys).not.toContain("glossaryPlayground.css");
    expect(emittedJavaScript).not.toContain(
      "Development fixtures only — not production definitions."
    );
    expect(emittedJavaScript).not.toContain("Replaceable term");
    expect(emittedJavaScript).not.toContain("Glossary Playground laboratory");
    expect(emittedJavaScript).not.toContain(
      "Rich relationship fixture - development only."
    );
    expect(emittedJavaScript).not.toContain("Developer Tools");
    expect(emittedCss).not.toContain(".glossary-playground-laboratory");
  });

  it("excludes the MathML capability spike and unused helper from production output", () => {
    const keys = Object.keys(manifest).join("\n");
    expect(keys).not.toContain("mathmlCapabilityRoute");
    expect(keys).not.toContain("mathmlCapability.css");
    expect(keys).not.toContain("nativeMath");
    expect(emittedJavaScript).not.toContain(
      "Development fixture · Teaching v2 Phase 0"
    );
    expect(emittedJavaScript).not.toContain(
      "A removable browser fixture for authored Linear Systems mathematics."
    );
    expect(emittedCss).not.toContain(".mathml-capability");
  });

  it("excludes the Phase 0 Presentation System fixture from production output", () => {
    const keys = Object.keys(manifest).join("\n");
    expect(keys).not.toContain("presentationSystemRoute");
    expect(keys).not.toContain("presentationSystem.css");
    expect(emittedJavaScript).not.toContain(
      "Phase 0 token calibration — not a product Lab."
    );
    expect(emittedJavaScript).not.toContain("Presentation System v1 — Phase 0");
    expect(emittedCss).not.toContain(".presentation-system-fixture");
  });

  it("uses root-origin URLs for emitted CSS font assets", () => {
    expect(emittedCss).toMatch(/url\(\/assets\/[^)]+\.(?:woff2?|ttf|otf)\)/);
    expect(emittedCss).not.toMatch(/url\(\.\/[^)]+\.(?:woff2?|ttf|otf)\)/);
  });
});
