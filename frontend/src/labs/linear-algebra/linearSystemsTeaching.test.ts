// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  GEPP_METHOD_TEACHING_PROFILE,
  createLinearSystemsMethodTeaching,
} from "./linearSystemsTeaching";

function visibleProseText(root: ParentNode): string {
  const copy = root.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("[role='math']").forEach((formula) => formula.remove());
  return copy.textContent ?? "";
}

describe("Linear Systems Teaching v2 method foundation", () => {
  it("makes core roles, method families, statuses, and concepts directly visible", () => {
    const view = createLinearSystemsMethodTeaching();

    expect(view.querySelectorAll("[data-teaching-block]")).toHaveLength(4);
    expect(
      view.querySelector("[data-method-problem].lab-teaching-block")
    ).not.toBeNull();
    expect(
      view.querySelector("[data-selected-method-teaching].lab-teaching-block")
    ).not.toBeNull();
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
    expect(view.querySelectorAll("[data-teaching-concept]")).toHaveLength(8);
    expect(view.textContent).toContain("Permutation matrix");
    expect(view.textContent).toContain("forward substitution");
    expect(view.querySelector("[data-native-math='elimination-multiplier'] mfrac")).not.toBeNull();
  });

  it("does not present planned methods as runnable controls", () => {
    const view = createLinearSystemsMethodTeaching();
    expect(view.querySelector("button")).toBeNull();
    expect(view.textContent).not.toMatch(/SOR|Conjugate Gradient|Cholesky/);
  });

  it("uses the approved technical right-hand-side role wording", () => {
    const view = createLinearSystemsMethodTeaching();
    const rhs = view.querySelector<HTMLElement>("[data-system-role='b']")!;

    expect(rhs.querySelector("h3")?.textContent).toBe("Right-hand side vector");
    expect(rhs.textContent).toContain("known vector of constants");
    expect(rhs.textContent).toContain("target vector that A x must equal");
  });

  it("connects two equations to their structural matrix form", () => {
    const view = createLinearSystemsMethodTeaching();
    const example = view.querySelector<HTMLElement>("[data-linear-system-example]")!;

    expect(example).not.toBeNull();
    expect(example.querySelectorAll("[role='math']")).toHaveLength(2);
    expect(example.querySelector("[data-native-math='two-equation-example'] mtable")).not.toBeNull();
    expect(example.querySelector("[data-native-math='two-equation-matrix-form'] mtable")).not.toBeNull();
    expect(example.textContent).toContain("The same two equations in matrix form");
  });

  it("separates universal teaching from the selected GEPP profile", () => {
    const view = createLinearSystemsMethodTeaching();
    const universal = view.querySelector<HTMLElement>(
      "[data-universal-linear-systems-teaching]"
    )!;
    const selected = view.querySelector<HTMLElement>(
      "[data-selected-method-teaching='gepp']"
    )!;

    expect(universal).not.toBeNull();
    expect(universal.querySelector("[data-system-role='A']")).not.toBeNull();
    expect(universal.querySelector("[data-method-family='direct']")).not.toBeNull();
    expect(universal.querySelector("[data-teaching-concept='pivot']")).toBeNull();
    expect(selected.querySelector("h3")?.textContent).toBe(
      "How Gaussian elimination with partial pivoting works"
    );
    expect(selected.querySelector("[data-teaching-concept='pivot']")).not.toBeNull();
    expect(GEPP_METHOD_TEACHING_PROFILE.id).toBe("gepp");
    expect(GEPP_METHOD_TEACHING_PROFILE.conceptGroups.flatMap((group) => group.concepts))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ id: "pivot" }),
        expect.objectContaining({ id: "forward-substitution" }),
      ]));
    expect(view.querySelectorAll("[data-selected-method-teaching]")).toHaveLength(1);
    expect(view.querySelector("[data-selected-method-teaching='jacobi']")).toBeNull();
    expect(view.querySelector("[data-selected-method-teaching='gauss-seidel']")).toBeNull();
  });

  it("introduces residual meaning and the conditioning boundary before Diagnostics", () => {
    const view = createLinearSystemsMethodTeaching();
    const check = view.querySelector<HTMLElement>("[data-method-result-check]")!;

    expect(check.querySelector("[data-native-math='residual-relation']")).not.toBeNull();
    expect(check.textContent).toContain("measures equation mismatch");
    expect(check.textContent).toContain("sensitive the solution");
    expect(check.textContent).toContain("does not compute a condition number");
    expect(check.textContent).toContain(
      "small residual does not by itself guarantee a small solution error"
    );
  });

  it("explains backward substitution in prose while MathML owns its notation", () => {
    const view = createLinearSystemsMethodTeaching();
    const selected = view.querySelector<HTMLElement>(
      "[data-selected-method-teaching='gepp']"
    )!;
    const backward = selected.querySelector<HTMLElement>(
      "[data-teaching-concept='backward-substitution']"
    )!;
    const relation = selected.querySelector<HTMLElement>(
      "[data-native-math='backward-substitution-relation']"
    )!;

    expect(visibleProseText(selected)).not.toMatch(/U\s+x(?:-|\s)hat/i);
    expect(visibleProseText(selected)).toContain(
      "Solve the upper-triangular system by backward substitution to recover the computed solution."
    );
    expect(visibleProseText(backward)).toContain(
      "Because U is upper triangular, backward substitution recovers the computed solution from bottom to top."
    );
    expect(relation.getAttribute("aria-label")).toBe("U times x hat equals y");
    expect(relation.querySelector("mover")).not.toBeNull();
  });

  it("can replace selected-method presentation without rewriting universal teaching", () => {
    const fixtureProfile = {
      ...GEPP_METHOD_TEACHING_PROFILE,
      id: "fixture-direct-method",
      learnerLabel: "Fixture direct method",
      overview: "Fixture selected-method overview.",
      algorithmSteps: ["Fixture selected-method step."],
      conceptGroups: [],
    };
    const view = createLinearSystemsMethodTeaching(fixtureProfile);

    expect(view.querySelector("[data-universal-linear-systems-teaching] [data-system-role='b']"))
      .not.toBeNull();
    expect(view.querySelector("[data-universal-linear-systems-teaching]")?.textContent)
      .toContain("Direct and iterative methods");
    expect(view.querySelector("[data-selected-method-teaching='fixture-direct-method'] h3")?.textContent)
      .toBe("How Fixture direct method works");
    expect(view.querySelector("[data-selected-method-teaching='fixture-direct-method']")?.textContent)
      .toContain("Fixture selected-method step");
    expect(view.querySelectorAll("[data-method-status='planned']")).toHaveLength(2);
  });
});
