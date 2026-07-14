import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./main.ts", import.meta.url), "utf8");

describe("compatibility-root Tutor composition", () => {
  it("composes the existing ODE Lab with an isolated store and shared Host", () => {
    expect(source).toContain("createCurrentCompatibilitySession()");
    expect(source).toContain("createAppSessionStore()");
    expect(source).toContain("createPlatformTutorHost({");
    expect(source).toContain("mounted.getTutorBinding()");
    expect(source).toContain('store.createTutorSessionAccess("ode")');
    expect(source).not.toContain("createAppShell");
    expect(source).not.toContain("Platform Home");
  });

  it("uses the required Host/Lab cleanup ordering", () => {
    const close = source.indexOf("tutorHost.close(");
    const disconnect = source.indexOf("tutorHost.disconnect()");
    const labDispose = source.indexOf("mounted.dispose()");
    const hostDispose = source.indexOf("tutorHost.dispose()");
    expect(close).toBeGreaterThan(-1);
    expect(close).toBeLessThan(disconnect);
    expect(disconnect).toBeLessThan(labDispose);
    expect(labDispose).toBeLessThan(hostDispose);
  });
});
