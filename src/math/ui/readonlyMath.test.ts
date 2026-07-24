// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
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

function accessibleRepresentations(
  target: HTMLElement,
  accessibleText: string
): HTMLElement[] {
  return [target, ...target.querySelectorAll<HTMLElement>("*")].filter(
    (element) =>
      element.getAttribute("aria-label") === accessibleText &&
      element.getAttribute("aria-hidden") !== "true"
  );
}

async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe("renderReadonlyMath", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("provides exactly one immediate meaningful, non-tabbable fallback", () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: () => new Promise(() => undefined) });

    expect(target.textContent).toBe(content.displayText);
    expect(target.getAttribute("aria-label")).toBe(content.ariaLabel);
    expect(target.getAttribute("role")).toBe("math");
    expect(target.tabIndex).toBe(-1);
    expect(accessibleRepresentations(target, content.ariaLabel)).toEqual([
      target,
    ]);
  });

  it("transfers accessible ownership to one enhanced child without changing visible math", async () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { display: "block", loadBackend: async () => backend() });
    await settle();

    const math = target.firstElementChild as StaticMathElement;
    expect(math.textContent).toBe(content.latex);
    expect(math.format).toBe("latex");
    expect(math.mode).toBe("displaystyle");
    expect(math.tabIndex).toBe(-1);
    expect(math.getAttribute("aria-label")).toBe(content.ariaLabel);
    expect(math.getAttribute("role")).toBe("math");
    expect(target.hasAttribute("aria-label")).toBe(false);
    expect(target.hasAttribute("role")).toBe(false);
    expect(accessibleRepresentations(target, content.ariaLabel)).toEqual([
      math,
    ]);
  });

  it("keeps one fallback when loading or rendering fails", async () => {
    const loadingTarget = connectedTarget();
    renderReadonlyMath(loadingTarget, content, { loadBackend: async () => { throw new Error("offline"); } });

    const renderingTarget = connectedTarget();
    renderReadonlyMath(renderingTarget, content, { loadBackend: async () => backend(() => { throw new Error("bad latex"); }) });
    await settle();

    expect(loadingTarget.textContent).toBe(content.displayText);
    expect(renderingTarget.textContent).toBe(content.displayText);
    expect(renderingTarget.classList).toContain("readonly-math-fallback");
    expect(
      accessibleRepresentations(loadingTarget, content.ariaLabel)
    ).toEqual([loadingTarget]);
    expect(
      accessibleRepresentations(renderingTarget, content.ariaLabel)
    ).toEqual([renderingTarget]);
  });

  it("contains a synchronous backend-loader failure and retains one fallback", () => {
    const target = connectedTarget();
    expect(() =>
      renderReadonlyMath(target, content, {
        loadBackend: () => {
          throw new Error("backend unavailable");
        },
      })
    ).not.toThrow();

    expect(target.textContent).toBe(content.displayText);
    expect(accessibleRepresentations(target, content.ariaLabel)).toEqual([
      target,
    ]);
  });

  it("restores exactly one fallback after an asynchronous renderer error", async () => {
    const target = connectedTarget();
    renderReadonlyMath(target, content, { loadBackend: async () => backend() });
    await settle();
    target.firstElementChild!.dispatchEvent(new Event("error"));

    expect(target.textContent).toBe(content.displayText);
    expect(target.getAttribute("role")).toBe("math");
    expect(target.getAttribute("aria-label")).toBe(content.ariaLabel);
    expect(accessibleRepresentations(target, content.ariaLabel)).toEqual([
      target,
    ]);
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

  it("prevents an older request or stale handle from replacing newer content", async () => {
    let resolve!: (value: ReadonlyMathBackend) => void;
    const pending = new Promise<ReadonlyMathBackend>((done) => { resolve = done; });
    const target = connectedTarget();
    const stale = renderReadonlyMath(target, content, { loadBackend: () => pending });
    const newer = { latex: "t^2", displayText: "t squared", ariaLabel: "t squared" };
    renderReadonlyMath(target, newer, { loadBackend: () => pending });
    stale.dispose();
    resolve(backend());
    await settle();

    expect(target.firstElementChild?.textContent).toBe("t^2");
    expect(accessibleRepresentations(target, newer.ariaLabel)).toHaveLength(1);
    expect(accessibleRepresentations(target, content.ariaLabel)).toHaveLength(0);
  });

  it("disposes fallback ownership before completion and ignores stale enhancement", async () => {
    let resolve!: (value: ReadonlyMathBackend) => void;
    const pending = new Promise<ReadonlyMathBackend>((done) => { resolve = done; });
    const target = connectedTarget();
    const handle = renderReadonlyMath(target, content, {
      loadBackend: () => pending,
    });

    handle.dispose();
    handle.dispose();
    expect(target.textContent).toBe("");
    expect(target.hasAttribute("role")).toBe(false);
    expect(target.hasAttribute("aria-label")).toBe(false);

    resolve(backend());
    await settle();

    expect(target.textContent).toBe("");
    expect(accessibleRepresentations(target, content.ariaLabel)).toHaveLength(
      0
    );
  });

  it("keeps multiple expressions independently accessible without IDs or shared ownership", async () => {
    const first = connectedTarget();
    const second = connectedTarget();
    const secondContent = {
      latex: "t^2",
      displayText: "t squared",
      ariaLabel: "t squared",
    };
    renderReadonlyMath(first, content, { loadBackend: async () => backend() });
    renderReadonlyMath(second, secondContent, {
      loadBackend: async () => backend(),
    });
    await settle();

    expect(accessibleRepresentations(first, content.ariaLabel)).toHaveLength(1);
    expect(
      accessibleRepresentations(second, secondContent.ariaLabel)
    ).toHaveLength(1);
    expect(first.id).toBe("");
    expect(second.id).toBe("");
  });

  it("caches one dependency import promise", async () => {
    const importer = vi.fn(async () => backend());
    const loader = createCachedMathBackendLoader(importer);
    await Promise.all([loader(), loader(), loader()]);
    expect(importer).toHaveBeenCalledTimes(1);
  });
});
