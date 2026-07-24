// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import type { StaticMathElement } from "./readonlyMath";
import { renderTutorMessageContent, segmentTutorMath } from "./tutorMath";

describe("segmentTutorMath", () => {
  it.each([
    ["plain text", [{ kind: "text", text: "plain text" }]],
    ["Order is \\(p=4\\).", [{ kind: "text", text: "Order is " }, { kind: "math", latex: "p=4", display: "inline", displayText: "p=4" }, { kind: "text", text: "." }]],
    ["\\[E(h)=h^p\\]", [{ kind: "math", latex: "E(h)=h^p", display: "block", displayText: "E(h)=h raised to p" }]],
  ])("segments %s deterministically", (value, expected) => {
    expect(segmentTutorMath(value)).toEqual(expected);
  });

  it("handles multiple, mixed, and punctuation-adjacent segments", () => {
    expect(segmentTutorMath("Use \\(h\\), then \\[E=h^p\\]. Finally \\(p\\)!"))
      .toMatchObject([
        { kind: "text", text: "Use " },
        { kind: "math", display: "inline", latex: "h" },
        { kind: "text", text: ", then " },
        { kind: "math", display: "block", latex: "E=h^p" },
        { kind: "text", text: ". Finally " },
        { kind: "math", display: "inline", latex: "p" },
        { kind: "text", text: "!" },
      ]);
  });

  it.each(["Empty \\(\\) remains", "Unclosed \\(x remains", "Stray \\) remains"])(
    "keeps malformed input readable: %s",
    (value) => expect(segmentTutorMath(value)).toEqual([{ kind: "text", text: value }])
  );

  it("lets a valid later segment survive a malformed outer opener", () => {
    expect(segmentTutorMath("Broken \\(outer \\(x\\) tail")).toEqual([
      { kind: "text", text: "Broken \\(outer " },
      { kind: "math", latex: "x", display: "inline", displayText: "x" },
      { kind: "text", text: " tail" },
    ]);
  });

  it("creates readable conservative fallback text without executing Tutor math", () => {
    expect(segmentTutorMath("\\(p_{\\mathrm{obs}}\\approx 3.92\\) and \\(h^p\\)"))
      .toMatchObject([
        { kind: "math", displayText: "p sub obs≈ 3.92" },
        { kind: "text", text: " and " },
        { kind: "math", displayText: "h raised to p" },
      ]);
  });

  it("does not treat an escaped opener as math", () => {
    expect(segmentTutorMath(String.raw`literal \\(x\\) text`)).toEqual([
      { kind: "text", text: String.raw`literal \\(x\\) text` },
    ]);
  });
});

function mockLoader() {
  return async () => ({
    createMathSpan: () => {
      const node = document.createElement("span") as StaticMathElement;
      node.render = () => undefined;
      return node;
    },
  });
}

describe("renderTutorMessageContent", () => {
  it("keeps user delimiters and HTML-looking text inert", () => {
    const target = document.createElement("div");
    document.body.append(target);
    renderTutorMessageContent(target, { role: "user", content: "\\(x\\)\n<img src=x>" }, { loadBackend: mockLoader() });

    expect(target.textContent).toBe("\\(x\\)<img src=x>");
    expect(target.querySelector("img")).toBeNull();
    expect(target.querySelector("br")).not.toBeNull();
  });

  it("uses text nodes, explicit line breaks, and isolated math hosts", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    renderTutorMessageContent(target, { role: "assistant", content: "<b>not HTML</b>\nInline \\(p\\).\n\\[E=h^p\\]" }, { loadBackend: mockLoader() });
    await Promise.resolve();
    await Promise.resolve();

    expect(target.querySelector("b")).toBeNull();
    expect(target.querySelectorAll("br")).toHaveLength(2);
    expect(target.querySelector(".ai-math-inline math-span, .ai-math-inline span")).not.toBeNull();
    expect(target.querySelector(".ai-math-block math-span, .ai-math-block span")).not.toBeNull();
    expect(target.textContent).toContain("not HTML");
  });

  it("keeps controlled Tutor math singly accessible without parent-child duplication", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    renderTutorMessageContent(
      target,
      {
        role: "assistant",
        content: "<script>not executable</script> Inline \\(p=4\\).",
      },
      { loadBackend: mockLoader() }
    );
    await Promise.resolve();
    await Promise.resolve();

    expect(target.querySelector("script")).toBeNull();
    expect(target.textContent).toContain("<script>not executable</script>");
    const host = target.querySelector<HTMLElement>(".ai-math-inline")!;
    const accessible = [
      host,
      ...host.querySelectorAll<HTMLElement>("*"),
    ].filter((element) => element.getAttribute("aria-label") === "p=4");
    expect(accessible).toHaveLength(1);
    expect(accessible[0]?.getAttribute("role")).toBe("math");
    expect(host.hasAttribute("aria-label")).toBe(false);
  });

  it("retains only the failed segment fallback and all surrounding text", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    renderTutorMessageContent(target, { role: "assistant", content: "Before \\(x\\) after" }, { loadBackend: async () => { throw new Error("unavailable"); } });
    await Promise.resolve();

    expect(target.textContent).toBe("Before x after");
    const host = target.querySelector<HTMLElement>(".ai-math-inline")!;
    expect(host.getAttribute("role")).toBe("math");
    expect(host.getAttribute("aria-label")).toBe("x");
    expect(
      [host, ...host.querySelectorAll<HTMLElement>("*")].filter(
        (element) => element.getAttribute("aria-label") === "x"
      )
    ).toHaveLength(1);
  });

  it("does not interpret Markdown-looking text", () => {
    const target = document.createElement("div");
    document.body.append(target);
    renderTutorMessageContent(target, { role: "assistant", content: "**bold** `code` [link](url)" }, { loadBackend: mockLoader() });
    expect(target.textContent).toBe("**bold** `code` [link](url)");
    expect(target.children).toHaveLength(0);
  });
});
