// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import type { RouteModule } from "./contracts";
import { createAppShell } from "./appShell";
import { createRouteDefinitions } from "./routeDefinitions";
import { createPlatformRouter, isInterceptableNavigation } from "./router";

function clickEvent(overrides: MouseEventInit = {}): MouseEvent {
  return new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    button: 0,
    ...overrides,
  });
}

describe("navigation accessibility", () => {
  beforeEach(() => document.body.replaceChildren());

  it("uses exact page semantics and location semantics for the ODE parent", () => {
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);

    shell.setActiveRoute("ode-overview");
    for (const link of shell.root.querySelectorAll('[data-route-id="ode-overview"]')) {
      expect(link.getAttribute("aria-current")).toBe("page");
    }

    shell.setActiveRoute("ode-initial-value-problems");
    for (const link of shell.root.querySelectorAll('[data-route-id="ode-overview"]')) {
      expect(link.getAttribute("aria-current")).toBe("location");
      expect(link.classList.contains("is-module-active")).toBe(true);
    }

    shell.setActiveRoute("not-found");
    expect(shell.root.querySelector("[aria-current]")).toBeNull();
    expect(shell.root.querySelector(".is-module-active")).toBeNull();
  });

  it("intercepts only unmodified primary same-origin application links", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ode";

    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(true);
    expect(
      isInterceptableNavigation(clickEvent({ ctrlKey: true }), anchor, location.origin)
    ).toBe(false);
    expect(isInterceptableNavigation(clickEvent({ button: 1 }), anchor, location.origin)).toBe(
      false
    );

    anchor.href = "https://example.com/ode";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(false);
    anchor.href = "mailto:teacher@example.com";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(false);
  });

  it("leaves download and targeted links to native browser behavior", () => {
    const anchor = document.createElement("a");
    anchor.href = "/ode";
    anchor.download = "notes.html";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(false);

    anchor.removeAttribute("download");
    anchor.target = "_blank";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(false);
    anchor.target = "course-frame";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(false);
    anchor.target = "_self";
    expect(isInterceptableNavigation(clickEvent(), anchor, location.origin)).toBe(true);
  });

  it("prefetches the complete ODE route once on hover or keyboard focus", async () => {
    history.replaceState({}, "", "/");
    const pending = new Promise<RouteModule>(() => undefined);
    let loadCount = 0;
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: createRouteDefinitions({
        initialValueProblemsLoader: () => {
          loadCount += 1;
          return pending;
        },
      }),
    });
    router.start();
    await expect.poll(() => shell.outlet.textContent).toContain("Numerical Analysis Lab");

    const openLab = shell.outlet.querySelector<HTMLAnchorElement>(
      'a[href="/ode/initial-value-problems"]'
    )!;
    openLab.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    openLab.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(loadCount).toBe(1);

    const roadmap = shell.outlet.querySelector<HTMLAnchorElement>(
      'a[href="/linear-algebra"]'
    )!;
    roadmap.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(loadCount).toBe(1);
    router.dispose();
  });

  it("intercepts a real same-origin primary link and closes the mobile menu after success", async () => {
    history.replaceState({}, "", "/");
    const host = document.createElement("div");
    document.body.append(host);
    const shell = createAppShell(host);
    const router = createPlatformRouter({
      shell,
      routes: createRouteDefinitions(),
    });
    router.start();
    await expect.poll(() => shell.outlet.textContent).toContain("Numerical Analysis Lab");

    const trigger = shell.root.querySelector<HTMLButtonElement>("[data-mobile-menu-trigger]")!;
    trigger.click();
    const odeLink = shell.root.querySelector<HTMLAnchorElement>(
      '.platform-mobile-navigation a[href="/ode"]'
    )!;
    const event = clickEvent();
    odeLink.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    await expect.poll(() => document.title).toBe("Numerical ODE | Numerical Analysis Lab");
    expect(location.pathname).toBe("/ode");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(shell.root.querySelector<HTMLElement>("[data-mobile-menu]")?.hidden).toBe(true);
    router.dispose();
  });
});
