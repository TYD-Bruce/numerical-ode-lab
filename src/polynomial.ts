/** Coefficients in ascending powers: [c0, c1, c2] => c0 + c1*s + c2*s^2 */

export const COEFF_TOL = 1e-10;

export function approxEqual(a: number, b: number, tol = COEFF_TOL): boolean {
  return Math.abs(a - b) < tol;
}

export function approxEqualArrays(
  a: number[],
  b: number[],
  tol = COEFF_TOL
): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => approxEqual(v, b[i], tol));
}

export function polyAdd(a: number[], b: number[]): number[] {
  const n = Math.max(a.length, b.length);
  const out = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    out[i] = (a[i] ?? 0) + (b[i] ?? 0);
  }
  return trimPoly(out);
}

export function polyScale(a: number[], c: number): number[] {
  if (c === 0) return [0];
  return trimPoly(a.map((v) => v * c));
}

export function polyMultiply(a: number[], b: number[]): number[] {
  if (a.length === 0 || b.length === 0) return [0];
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out[i + j] += a[i]! * b[j]!;
    }
  }
  return trimPoly(out);
}

/** Linear factor (s - root): -root + 1*s */
function polyShift(root: number): number[] {
  return [-root, 1];
}

export function polyDerivative(coeffs: number[]): number[] {
  if (coeffs.length <= 1) return [0];
  const out = coeffs.slice(1).map((c, i) => c * (i + 1));
  return trimPoly(out);
}

export function polyEvaluate(coeffs: number[], x: number): number {
  let sum = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    sum = sum * x + (coeffs[i] ?? 0);
  }
  return sum;
}

export function polyAntiderivative(coeffs: number[]): number[] {
  return [0, ...coeffs.map((c, i) => c / (i + 1))];
}

export function polyIntegrate(coeffs: number[], a: number, b: number): number {
  const F = polyAntiderivative(coeffs);
  return polyEvaluate(F, b) - polyEvaluate(F, a);
}

function trimPoly(c: number[]): number[] {
  let end = c.length;
  while (end > 1 && Math.abs(c[end - 1] ?? 0) < 1e-15) end--;
  return c.slice(0, end);
}

export function lagrangeBasis(nodes: number[], j: number): number[] {
  let poly = [1];
  const xj = nodes[j]!;
  for (let m = 0; m < nodes.length; m++) {
    if (m === j) continue;
    const xm = nodes[m]!;
    const factor = polyScale(polyShift(xm), 1 / (xj - xm));
    poly = polyMultiply(poly, factor);
  }
  return poly;
}

export function integrateLagrangeBasis(
  nodes: number[],
  j: number,
  a = 0,
  b = 1
): number {
  const Lj = lagrangeBasis(nodes, j);
  return polyIntegrate(Lj, a, b);
}

export function derivativeOfLagrangeAt(
  nodes: number[],
  j: number,
  s0 = 0
): number {
  const Lj = lagrangeBasis(nodes, j);
  const dLj = polyDerivative(Lj);
  return polyEvaluate(dLj, s0);
}

export function adamsBashforthCoefficients(order: number): number[] {
  const p = order;
  const nodes = Array.from({ length: p }, (_, j) => -j);
  return Array.from({ length: p }, (_, j) =>
    integrateLagrangeBasis(nodes, j, 0, 1)
  );
}

export function adamsMoultonCoefficients(order: number): number[] {
  const p = order;
  const nodes = [1, ...Array.from({ length: p - 1 }, (_, j) => -j)];
  return Array.from({ length: p }, (_, j) =>
    integrateLagrangeBasis(nodes, j, 0, 1)
  );
}

export function bdfCoefficients(order: number): number[] {
  const p = order;
  const nodes = Array.from({ length: p + 1 }, (_, j) => -j);
  return Array.from({ length: p + 1 }, (_, j) =>
    derivativeOfLagrangeAt(nodes, j, 0)
  );
}
