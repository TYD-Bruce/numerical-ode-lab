import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface VercelConfiguration {
  $schema?: string;
  buildCommand?: string;
  outputDirectory?: string;
  framework?: string;
  redirects?: unknown[];
  rewrites?: Array<{ source?: string; destination?: string }>;
}

const configuration = JSON.parse(
  readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"),
) as VercelConfiguration;

describe("Vercel SPA routing contract", () => {
  it("retains the Vite build and output settings", () => {
    expect(configuration).toMatchObject({
      $schema: "https://openapi.vercel.sh/vercel.json",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      framework: "vite",
    });
  });

  it("uses one catch-all rewrite to index.html and no redirect", () => {
    expect(configuration.rewrites).toEqual([
      { source: "/(.*)", destination: "/index.html" },
    ]);
    expect(configuration.redirects).toBeUndefined();
  });

  it("does not add explicit API or asset rewrites ahead of the fallback", () => {
    const rewrites = configuration.rewrites ?? [];
    expect(rewrites.some(({ source }) => source?.startsWith("/api"))).toBe(false);
    expect(rewrites.some(({ source }) => source?.startsWith("/assets"))).toBe(false);
  });

  it("keeps filesystem/function precedence as a deployed-platform check", () => {
    // This structural test deliberately does not simulate Vercel precedence.
    // A deployed preview must still smoke-test /api/chat and emitted assets.
    expect(configuration.rewrites?.at(-1)).toEqual({
      source: "/(.*)",
      destination: "/index.html",
    });
  });
});
