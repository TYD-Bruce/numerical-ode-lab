import { describe, expect, it } from "vitest";

describe("Tutor first-open import boundary", () => {
  it("keeps the Host lightweight and the ODE Lab free of eager Tutor runtime imports", async () => {
    const [host, app, route] = await Promise.all([
      import("./platformTutorHost.ts?raw"),
      import("../labs/ode/odeApp.ts?raw"),
      import("../labs/ode/initialValueProblemsRoute.ts?raw"),
    ]);
    expect(host.default).toMatch(/import\(["']\.\.\/tutor\/platformTutorPanel["']\)/);
    for (const source of [host.default, app.default, route.default]) {
      expect(source).not.toMatch(/import\s+\{[^}]*\}\s+from ["']\.\.\/tutor\/platformTutorPanel["']/s);
      expect(source).not.toMatch(/from ["']\.\.\/tutor\/tutorClient["']/);
      expect(source).not.toMatch(/from ["']\.\.\/aiTutorPanel["']/);
    }
    expect(host.default).not.toMatch(/from ["']\.\.\/ode\//);
  });

  it("contains no module-global Tutor transcript", async () => {
    const legacy = await import("../tutor/aiTutorPanel.ts?raw");
    const panel = await import("../tutor/platformTutorPanel.ts?raw");
    expect(`${legacy.default}\n${panel.default}`).not.toMatch(
      /let\s+conversation\s*[:=]/
    );
  });

  it("keeps Glossary surface and Tutor imports independent", async () => {
    const glossaryHost = await import("./platformGlossaryHost.ts?raw");
    expect(glossaryHost.default).toMatch(
      /import\(["']\.\.\/glossary\/surface\/glossarySurfaceRuntime["']\)/
    );
    expect(glossaryHost.default).not.toMatch(
      /import\(["']\.\.\/tutor\/platformTutorPanel["']\)/
    );
  });
});
