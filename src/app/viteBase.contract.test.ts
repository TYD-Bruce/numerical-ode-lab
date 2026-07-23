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

describe("Vite root-base deployment contract", () => {
  beforeAll(async () => {
    const config = await resolveConfig({}, "build");
    expect(config.base).toBe("/");

    outputDirectory = await mkdtemp(join(tmpdir(), "numerical-analysis-lab-vite-base-"));
    await build({
      configFile: resolve(process.cwd(), "vite.config.ts"),
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
  }, 60_000);

  afterAll(async () => {
    if (outputDirectory) {
      await rm(outputDirectory, { force: true, recursive: true });
    }
  });

  it("configures the public application at the root origin", async () => {
    const config = await resolveConfig({}, "build");
    expect(config.base).toBe("/");
    expect(config.base).not.toBe("./");
  });

  it("emits root-origin entry and stylesheet references", () => {
    expect(indexHtml).toMatch(/(?:src|href)="\/assets\//);
    expect(indexHtml).not.toMatch(/(?:src|href)="\.\/assets\//);
  });

  it("uses the canonical product title in generated HTML", () => {
    expect(indexHtml).toContain("<title>Numerical Analysis Lab</title>");
    expect(indexHtml).not.toContain("<title>Numerical ODE Lab</title>");
  });

  it("keeps dynamic chunks measurable in the manifest", () => {
    const entry = manifest["index.html"];
    expect(entry?.file).toMatch(/^assets\//);
    expect(entry?.dynamicImports).toContain("src/ode/initialValueProblemsRoute.ts");
    expect(entry?.dynamicImports).toContain("src/tutor/platformTutorPanel.ts");
  });

  it("uses root-origin URLs for emitted CSS font assets", () => {
    expect(emittedCss).toMatch(/url\(\/assets\/[^)]+\.(?:woff2?|ttf|otf)\)/);
    expect(emittedCss).not.toMatch(/url\(\.\/[^)]+\.(?:woff2?|ttf|otf)\)/);
  });
});
