import { describe, expect, it } from "vitest";

import {
  adamsBashforthCoefficients,
  adamsMoultonCoefficients,
  bdfCoefficients,
} from "./polynomial";

const COEFFICIENT_TEST_TOL = 1e-12;

function expectCoefficients(actual: number[], expected: number[]): void {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, index) => {
    expect(Math.abs(value - expected[index]!)).toBeLessThan(
      COEFFICIENT_TEST_TOL
    );
  });
}

describe("generated linear multistep coefficients", () => {
  it("generates the reference Adams-Bashforth coefficients", () => {
    expectCoefficients(adamsBashforthCoefficients(1), [1]);
    expectCoefficients(adamsBashforthCoefficients(2), [3 / 2, -1 / 2]);
    expectCoefficients(adamsBashforthCoefficients(3), [
      23 / 12,
      -16 / 12,
      5 / 12,
    ]);
  });

  it("generates the reference Adams-Moulton coefficients", () => {
    expectCoefficients(adamsMoultonCoefficients(1), [1]);
    expectCoefficients(adamsMoultonCoefficients(2), [1 / 2, 1 / 2]);
    expectCoefficients(adamsMoultonCoefficients(3), [
      5 / 12,
      8 / 12,
      -1 / 12,
    ]);
  });

  it("generates the reference BDF coefficients", () => {
    expectCoefficients(bdfCoefficients(1), [1, -1]);
    expectCoefficients(bdfCoefficients(2), [3 / 2, -2, 1 / 2]);
  });
});
