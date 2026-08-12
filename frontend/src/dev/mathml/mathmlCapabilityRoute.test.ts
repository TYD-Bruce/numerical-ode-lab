// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMathmlCapabilityRoute } from "./mathmlCapabilityRoute";

describe("development-only MathML capability route", () => {
  beforeEach(() => document.body.replaceChildren());

  it("renders all eight real Teaching v2 capability cases", () => {
    const target = document.createElement("main");
    document.body.append(target);
    const mounted = createMathmlCapabilityRoute().mount({
      target,
      navigate: vi.fn(),
      location: {
        pathname: "/__dev/mathml-capability",
        search: "",
        hash: "",
      },
    });

    expect(target.querySelector("h1")?.textContent).toBe(
      "MathML Teaching Capability"
    );
    expect(target.querySelectorAll("[data-mathml-case]")).toHaveLength(8);
    expect(target.querySelector("[data-mathml-case='computed-solution'] mover")).not.toBeNull();
    expect(target.querySelectorAll("[data-mathml-case='dense-matrix'] mtr")).toHaveLength(3);
    expect(target.querySelector("[data-mathml-case='multiplier'] mfrac")).not.toBeNull();
    expect(target.querySelectorAll("[data-mathml-case='transformation'] mtable")).toHaveLength(2);
    expect(target.querySelector("[data-mathml-case='infinity-norm'] msup")).not.toBeNull();
    expect(target.querySelector("[data-mathml-case='plu'] math")).not.toBeNull();
    expect(target.querySelector("[data-mathml-case='forward-substitution'] mfrac")).not.toBeNull();
    expect(target.querySelector("[data-mathml-case='backward-substitution'] mover")).not.toBeNull();
    expect(target.querySelectorAll("[role='math']")).toHaveLength(11);
    expect(target.querySelectorAll("[role='math'] > math[aria-hidden='true']")).toHaveLength(11);

    mounted.dispose();
    expect(target.childElementCount).toBe(0);
  });
});
