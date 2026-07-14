/** Plain Unicode math for UI (no LaTeX delimiters). */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatCoefficients(
  alpha?: readonly number[],
  beta?: readonly number[]
): string {
  const parts: string[] = [];
  if (beta?.length) {
    parts.push(`β = [${beta.map(formatNum).join(", ")}]`);
  }
  if (alpha?.length) {
    parts.push(`α = [${alpha.map(formatNum).join(", ")}]`);
  }
  return parts.join("    ");
}

function formatNum(v: number): string {
  const r = Math.round(v * 1e12) / 1e12;
  if (Math.abs(r - Math.round(r)) < 1e-10) return String(Math.round(r));
  return r.toFixed(6).replace(/\.?0+$/, "");
}
