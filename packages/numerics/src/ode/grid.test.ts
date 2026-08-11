import { describe, expect, it } from "vitest";

import { MAX_FIXED_STEPS, validateFixedStepGrid } from "./grid";

describe("fixed-step grid contract", () => {
  it.each([
    [0, 1, 0.1, 10],
    [0.2, 1.2, 0.1, 10],
    [0, 0.3, 0.1, 3],
  ])(
    "accepts the aligned grid t0=%p, tEnd=%p, h=%p",
    (t0, tEnd, h, steps) => {
      expect(validateFixedStepGrid(t0, tEnd, h).steps).toBe(steps);
    }
  );

  it("rejects a grid that would otherwise be silently truncated", () => {
    expect(() => validateFixedStepGrid(0, 1, 0.3)).toThrow(
      "Fixed-step methods require (t_end - t₀) / h to be an integer. Choose a grid-aligned step size h."
    );
  });

  it.each([
    ["t₀", Number.NaN, 1, 0.1],
    ["t₀", Number.POSITIVE_INFINITY, 1, 0.1],
    ["t₀", Number.NEGATIVE_INFINITY, 1, 0.1],
    ["t_end", 0, Number.NaN, 0.1],
    ["t_end", 0, Number.POSITIVE_INFINITY, 0.1],
    ["t_end", 0, Number.NEGATIVE_INFINITY, 0.1],
    ["h", 0, 1, Number.NaN],
    ["h", 0, 1, Number.POSITIVE_INFINITY],
    ["h", 0, 1, Number.NEGATIVE_INFINITY],
  ])("rejects non-finite %s", (_label, t0, tEnd, h) => {
    expect(() => validateFixedStepGrid(t0, tEnd, h)).toThrow("must be finite");
  });

  it("names a non-finite computed time-step count precisely", () => {
    expect(() =>
      validateFixedStepGrid(
        -Number.MAX_VALUE,
        Number.MAX_VALUE,
        Number.MIN_VALUE
      )
    ).toThrow("The computed number of time steps must be finite.");
  });

  it.each([
    [0, 1, 0],
    [0, 1, -0.1],
    [1, 1, 0.1],
    [1, 0, 0.1],
  ])("rejects invalid interval t0=%p, tEnd=%p, h=%p", (t0, tEnd, h) => {
    expect(() => validateFixedStepGrid(t0, tEnd, h)).toThrow();
  });

  it("accepts exactly the maximum step count without allocating points", () => {
    expect(validateFixedStepGrid(0, MAX_FIXED_STEPS, 1).steps).toBe(
      MAX_FIXED_STEPS
    );
  });

  it("accepts one step below the maximum step count", () => {
    expect(validateFixedStepGrid(0, MAX_FIXED_STEPS - 1, 1).steps).toBe(
      MAX_FIXED_STEPS - 1
    );
  });

  it("rejects grids above the maximum step count before integration", () => {
    expect(() => validateFixedStepGrid(0, MAX_FIXED_STEPS + 1, 1)).toThrow(
      `This run requires ${MAX_FIXED_STEPS + 1} steps, above the current limit of ${MAX_FIXED_STEPS}. Increase h or shorten the interval.`
    );
  });
});
