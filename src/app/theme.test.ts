// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  createThemeToggle,
  getPlatformTheme,
  initializePlatformTheme,
} from "./theme";

describe("platform theme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("defaults to Light when no supported preference exists", () => {
    expect(initializePlatformTheme()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(getPlatformTheme()).toBe("light");
  });

  it("restores only supported persisted values", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(initializePlatformTheme()).toBe("dark");

    window.localStorage.setItem(THEME_STORAGE_KEY, "system");
    document.documentElement.dataset.theme = "light";
    expect(initializePlatformTheme()).toBe("light");
  });

  it("renders a native accessible toggle and persists both states", () => {
    const changed = vi.fn();
    window.addEventListener(THEME_CHANGE_EVENT, changed);
    const toggle = createThemeToggle();
    document.body.append(toggle.button);

    expect(toggle.button.tagName).toBe("BUTTON");
    expect(toggle.button.type).toBe("button");
    expect(toggle.button.getAttribute("aria-label")).toBe("Switch to dark mode");
    expect(toggle.button.getAttribute("aria-pressed")).toBe("false");
    const moon = toggle.button.querySelector('svg[viewBox="0 0 24 24"]');
    expect(moon?.getAttribute("aria-hidden")).toBe("true");
    expect(moon?.querySelectorAll("path")).toHaveLength(1);
    expect(moon?.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(moon?.querySelector("path")?.hasAttribute("stroke")).toBe(false);
    expect(moon?.querySelector("circle")).toBeNull();
    expect(moon?.querySelector('[class*="star"], [class*="sparkle"]')).toBeNull();

    toggle.button.click();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(toggle.button.getAttribute("aria-label")).toBe("Switch to light mode");
    expect(toggle.button.getAttribute("aria-pressed")).toBe("true");
    expect(toggle.button.querySelector(".platform-theme-icon-sun")).not.toBeNull();
    expect(changed).toHaveBeenCalledOnce();

    toggle.button.click();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    toggle.dispose();
    window.removeEventListener(THEME_CHANGE_EVENT, changed);
  });
});
