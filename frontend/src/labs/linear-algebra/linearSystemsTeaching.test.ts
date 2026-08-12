// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { createLinearSystemsMethodTeaching } from "./linearSystemsTeaching";

describe("Linear Systems Teaching v2 method foundation", () => {
  it("makes core roles, method families, statuses, and concepts directly visible", () => {
    const view = createLinearSystemsMethodTeaching();

    expect(view.querySelectorAll("[data-system-role]")).toHaveLength(3);
    expect(view.querySelector("[data-linear-system-definition]")?.textContent).toContain(
      "multiple linear equations"
    );
    expect(view.querySelector("[data-method-family='direct']")?.textContent).toContain(
      "Gaussian elimination"
    );
    expect(view.querySelector("[data-method-family='iterative']")?.textContent).toContain(
      "successive approximations"
    );
    expect(view.querySelectorAll("[data-method-status='available']")).toHaveLength(1);
    expect(view.querySelectorAll("[data-method-status='planned']")).toHaveLength(2);
    expect(view.querySelectorAll("[data-teaching-concept]")).toHaveLength(6);
    expect(view.textContent).toContain("Permutation matrix");
    expect(view.textContent).toContain("forward substitution");
    expect(view.querySelector("[data-native-math='elimination-multiplier'] mfrac")).not.toBeNull();
  });

  it("does not present planned methods as runnable controls", () => {
    const view = createLinearSystemsMethodTeaching();
    expect(view.querySelector("button")).toBeNull();
    expect(view.textContent).not.toMatch(/SOR|Conjugate Gradient|Cholesky/);
  });
});
