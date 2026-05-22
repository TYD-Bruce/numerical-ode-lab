import {
  adamsBashforthCoefficients,
  adamsMoultonCoefficients,
  approxEqualArrays,
  bdfCoefficients,
} from "./polynomial";

export function runCoefficientValidation(): void {
  const checks: { name: string; ok: boolean }[] = [];

  checks.push({
    name: "AB p=1",
    ok: approxEqualArrays(adamsBashforthCoefficients(1), [1]),
  });
  checks.push({
    name: "AB p=2",
    ok: approxEqualArrays(adamsBashforthCoefficients(2), [1.5, -0.5]),
  });
  checks.push({
    name: "AB p=3",
    ok: approxEqualArrays(adamsBashforthCoefficients(3), [
      23 / 12,
      -16 / 12,
      5 / 12,
    ]),
  });

  checks.push({
    name: "AM p=1",
    ok: approxEqualArrays(adamsMoultonCoefficients(1), [1]),
  });
  checks.push({
    name: "AM p=2",
    ok: approxEqualArrays(adamsMoultonCoefficients(2), [0.5, 0.5]),
  });
  checks.push({
    name: "AM p=3",
    ok: approxEqualArrays(adamsMoultonCoefficients(3), [
      5 / 12,
      8 / 12,
      -1 / 12,
    ]),
  });

  checks.push({
    name: "BDF p=1",
    ok: approxEqualArrays(bdfCoefficients(1), [1, -1]),
  });
  checks.push({
    name: "BDF p=2",
    ok: approxEqualArrays(bdfCoefficients(2), [1.5, -2, 0.5]),
  });

  const failed = checks.filter((c) => !c.ok);
  if (failed.length > 0) {
    console.error(
      "[Numerical ODE Lab] Coefficient validation failed:",
      failed.map((f) => f.name)
    );
  } else if (import.meta.env.DEV) {
    console.info("[Numerical ODE Lab] Coefficient validation passed.");
  }
}

/** y' = y, y(0)=1, exact y(1)=e — sanity check for decreasing h. */
export function runSanityCheck(): void {
  const e = Math.E;
  const hs = [0.2, 0.1, 0.05];
  const errors: number[] = [];
  for (const h of hs) {
    const n = Math.round(1 / h);
    let y = 1;
    for (let i = 0; i < n; i++) y = y + h * y;
    errors.push(Math.abs(y - e));
  }
  if (errors[1]! < errors[0]! && errors[2]! < errors[1]!) {
    if (import.meta.env.DEV) {
      console.info("[Numerical ODE Lab] Forward Euler sanity check: error decreases with h.");
    }
  }
}
