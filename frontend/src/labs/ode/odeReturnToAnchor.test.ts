// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOdeReturnToAnchor } from "./odeReturnToAnchor";

function setScrollY(value: number): void {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
  });
}

function rectWithBottom(bottom: number): DOMRect {
  return {
    x: 0,
    y: bottom - 100,
    width: 800,
    height: 100,
    top: bottom - 100,
    right: 800,
    bottom,
    left: 0,
    toJSON: () => ({}),
  };
}

describe("ODE contextual return-to-anchor presentation", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setScrollY(0);
  });

  it("reveals a native quiet control only after the landscape is meaningfully behind the learner", () => {
    const landscape = document.createElement("section");
    const heading = document.createElement("h2");
    heading.id = "ode-method-landscape-heading";
    heading.tabIndex = -1;
    landscape.append(heading);
    document.body.append(landscape);

    let landscapeBottom = 640;
    vi.spyOn(landscape, "getBoundingClientRect").mockImplementation(() =>
      rectWithBottom(landscapeBottom)
    );
    const scrollIntoView = vi.fn();
    Object.defineProperty(heading, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    const mounted = createOdeReturnToAnchor({
      target: heading,
      visibilityAnchor: landscape,
      accessibleName: "Back to method selection",
    });
    document.body.append(mounted.element);
    mounted.refresh();

    expect(mounted.element).toBeInstanceOf(HTMLButtonElement);
    expect(mounted.element.type).toBe("button");
    expect(mounted.element.getAttribute("aria-label")).toBe(
      "Back to method selection"
    );
    expect(mounted.element.getAttribute("aria-controls")).toBe(heading.id);
    expect(mounted.element.hidden).toBe(true);

    setScrollY(720);
    landscapeBottom = 72;
    window.dispatchEvent(new Event("scroll"));
    expect(mounted.element.hidden).toBe(false);

    mounted.element.click();
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
    expect(document.activeElement).toBe(heading);
    expect(mounted.element.hidden).toBe(true);

    mounted.dispose();
  });

  it("removes every window listener and ignores detached targets after disposal", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const landscape = document.createElement("section");
    const heading = document.createElement("h2");
    heading.id = "ode-method-landscape-heading";
    heading.tabIndex = -1;
    landscape.append(heading);
    document.body.append(landscape);
    const getBoundingClientRect = vi
      .spyOn(landscape, "getBoundingClientRect")
      .mockReturnValue(rectWithBottom(48));

    setScrollY(800);
    const mounted = createOdeReturnToAnchor({
      target: heading,
      visibilityAnchor: landscape,
      accessibleName: "Back to method selection",
    });
    document.body.append(mounted.element);
    mounted.refresh();
    expect(mounted.element.hidden).toBe(false);
    expect(addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    mounted.dispose();
    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
    expect(mounted.element.hidden).toBe(true);

    const readsAfterDispose = getBoundingClientRect.mock.calls.length;
    landscape.remove();
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("resize"));
    expect(getBoundingClientRect).toHaveBeenCalledTimes(readsAfterDispose);
    mounted.element.click();
    expect(document.activeElement).not.toBe(heading);
  });
});
