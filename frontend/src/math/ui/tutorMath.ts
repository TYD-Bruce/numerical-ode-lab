import type { TutorMessage } from "@numerical-t-lab/contracts/tutor";
import {
  renderReadonlyMath,
  type ReadonlyMathBackendLoader,
  type ReadonlyMathContent,
} from "./readonlyMath";

export type TutorMathSegment =
  | { kind: "text"; text: string }
  | { kind: "math"; latex: string; display: "inline" | "block"; displayText: string };

const MAX_MATH_SEGMENTS = 32;

function isEscaped(text: string, index: number): boolean {
  let preceding = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i -= 1) preceding += 1;
  return preceding % 2 === 1;
}

function nextOpener(text: string, from: number): number {
  for (let i = from; i < text.length - 1; i += 1) {
    if (text[i] !== "\\" || isEscaped(text, i)) continue;
    if (text[i + 1] === "(" || text[i + 1] === "[") return i;
  }
  return -1;
}

function nextClosing(text: string, token: "\\)" | "\\]", from: number): number {
  for (let i = from; i < text.length - 1; i += 1) {
    if (text.startsWith(token, i) && !isEscaped(text, i)) return i;
  }
  return -1;
}

function appendText(segments: TutorMathSegment[], value: string): void {
  if (!value) return;
  const last = segments.at(-1);
  if (last?.kind === "text") last.text += value;
  else segments.push({ kind: "text", text: value });
}

export function tutorMathFallback(latex: string): string {
  return latex
    .trim()
    .replace(/\\left|\\right/g, "")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\\approx\b/g, "≈")
    .replace(/\\times\b/g, "×")
    .replace(/\\cdot\b/g, "·")
    .replace(/\\pi\b/g, "π")
    .replace(/\\Delta\b/g, "Δ")
    .replace(/\\sin\b/g, "sine")
    .replace(/\\cos\b/g, "cosine")
    .replace(/\\tan\b/g, "tangent")
    .replace(/\\ln\b/g, "natural log")
    .replace(/([A-Za-z0-9])_\{\\mathrm\{([^{}]+)\}\}/g, "$1 sub $2")
    .replace(/([A-Za-z0-9])_\{([^{}]+)\}/g, "$1 sub $2")
    .replace(/([A-Za-z0-9])_([A-Za-z0-9])/g, "$1 sub $2")
    .replace(/([A-Za-z0-9)])\^\{([^{}]+)\}/g, "$1 raised to $2")
    .replace(/([A-Za-z0-9)])\^([A-Za-z0-9])/g, "$1 raised to $2")
    .replace(/\\mathrm\{([^{}]+)\}/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ");
}

export function segmentTutorMath(text: string): TutorMathSegment[] {
  const segments: TutorMathSegment[] = [];
  let cursor = 0;
  let mathCount = 0;

  while (cursor < text.length && mathCount < MAX_MATH_SEGMENTS) {
    const open = nextOpener(text, cursor);
    if (open < 0) break;
    appendText(segments, text.slice(cursor, open));

    const block = text[open + 1] === "[";
    const closeToken = block ? "\\]" : "\\)";
    const contentStart = open + 2;
    const close = nextClosing(text, closeToken, contentStart);
    if (close < 0) {
      appendText(segments, text.slice(open, contentStart));
      cursor = contentStart;
      continue;
    }

    const latex = text.slice(contentStart, close);
    if (!latex.trim()) {
      appendText(segments, text.slice(open, close + 2));
    } else if (nextOpener(latex, 0) >= 0) {
      // Keep the malformed outer opener, then continue so a later valid segment survives.
      appendText(segments, text.slice(open, contentStart));
      cursor = contentStart;
      continue;
    } else {
      segments.push({
        kind: "math",
        latex,
        display: block ? "block" : "inline",
        displayText: tutorMathFallback(latex),
      });
      mathCount += 1;
    }
    cursor = close + 2;
  }

  appendText(segments, text.slice(cursor));
  return segments.length > 0 ? segments : [{ kind: "text", text }];
}

function appendTextWithBreaks(target: HTMLElement, text: string): void {
  text.split("\n").forEach((line, index) => {
    if (index > 0) target.append(document.createElement("br"));
    target.append(document.createTextNode(line));
  });
}

export function renderTutorMessageContent(
  target: HTMLElement,
  message: TutorMessage,
  options: { loadBackend?: ReadonlyMathBackendLoader } = {}
): void {
  target.replaceChildren();
  if (message.role === "user") {
    appendTextWithBreaks(target, message.content);
    return;
  }

  for (const segment of segmentTutorMath(message.content)) {
    if (segment.kind === "text") {
      appendTextWithBreaks(target, segment.text);
      continue;
    }
    const host = document.createElement(segment.display === "block" ? "div" : "span");
    host.classList.add(`ai-math-${segment.display}`);
    target.append(host);
    const content: ReadonlyMathContent = {
      latex: segment.latex,
      displayText: segment.displayText,
      ariaLabel: segment.displayText,
    };
    renderReadonlyMath(host, content, {
      display: segment.display,
      loadBackend: options.loadBackend,
    });
  }
}
