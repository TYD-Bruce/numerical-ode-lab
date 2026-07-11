// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  createCachedMathBackendLoader,
  renderReadonlyMath,
  type ReadonlyMathBackend,
  type ReadonlyMathContent,
  type StaticMathElement,
} from "./readonlyMath";

const content: ReadonlyMathContent = {
  latex: "\\frac{1}{1+t}",
  displayText: "1 divided by the quantity 1 plus t",
  ariaLabel: "1 divided by the quantity 1 plus t",
};

function backend(renderImpl: () => void = () => undefined): ReadonlyMathBackend {
  return {
    createMathSpan: () => {
      const element = document.createElement("span") as StaticMathElement;
      element.render = vi.fn(renderImpl);
      return element;
    },
  };
}

function connectedTarget(): HTMLSpanElement {
  const target = document.createElement("span");
  document.body.append(target);
  return target;
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("renderReadonlyMath", () => {
  it("provides an immediate meaningful, non-tabbable fallback", () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: () => new Promise(() => undefined) });

    expect(target.textContent).toBe(content.displayText);
    expect(target.getAttribute("aria-label")).toBe(content.ariaLabel);
    expect(target.getAttribute("role")).toBe("math");
    expect(target.tabIndex).toBe(-1);
  });

  it("upgrades the fallback through the injected static renderer", async () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { display: "block", loadBackend: async () => backend() });
    await settle();

    const math = target.firstElementChild as StaticMathElement;
    expect(math.textContent).toBe(content.latex);
    expect(math.format).toBe("latex");
    expect(math.mode).toBe("displaystyle");
    expect(math.tabIndex).toBe(-1);
    expect(math.getAttribute("aria-label")).toBe(content.ariaLabel);
  });

  it("keeps the fallback when loading or rendering fails", async () => {
    const loadingTarget = connectedTarget();
    renderReadonlyMath(loadingTarget, content, { loadBackend: async () => { throw new Error("offline"); } });

    const renderingTarget = connectedTarget();
    renderReadonlyMath(renderingTarget, content, { loadBackend: async () => backend(() => { throw new Error("bad latex"); }) });
    await settle();

    expect(loadingTarget.textContent).toBe(content.displayText);
    expect(renderingTarget.textContent).toBe(content.displayText);
    expect(renderingTarget.classList).toContain("readonly-math-fallback");
  });

  it("restores the fallback after an asynchronous renderer error", async () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: async () => backend() });
    await settle();
    target.firstElementChild!.dispatchEvent(new Event("error"));

    expect(target.textContent).toBe(content.displayText);
  });

  it("does not upgrade a target removed before loading completes", async () => {
    let resolve!: (value: ReadonlyMathBackend) => void;
    const pending = new Promise<ReadonlyMathBackend>((done) => { resolve = done; });
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: () => pending });
    target.remove();
    resolve(backend());
    await settle();

    expect(target.textContent).toBe(content.displayText);
  });

  it("prevents an older request from replacing newer content", async () => {
    let resolve!: (value: ReadonlyMathBackend) => void;
    const pending = new Promise<ReadonlyMathBackend>((done) => { resolve = done; });
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: () => pending });
    const newer = { latex: "t^2", displayText: "t squared", ariaLabel: "t squared" };
    renderReadonlyMath(target, newer, { loadBackend: () => pending });
    resolve(backend());
    await settle();

    expect(target.firstElementChild?.textContent).toBe("t^2");
    expect(target.getAttribute("aria-label")).toBe("t squared");
  });

  it("caches one dependency import promise", async () => {
    const importer = vi.fn(async () => backend());
    const loader = createCachedMathBackendLoader(importer);
    await Promise.all([loader(), loader(), loader()]);
    expect(importer).toHaveBeenCalledTimes(1);
  });
});
