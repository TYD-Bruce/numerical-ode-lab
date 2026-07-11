export interface ReadonlyMathContent {
  latex: string;
  displayText: string;
  ariaLabel: string;
}

export type ReadonlyMathDisplay = "inline" | "block";

export interface StaticMathElement extends HTMLElement {
  format: "latex";
  mode: "textstyle" | "displaystyle";
  render(): void;
}

export interface ReadonlyMathBackend {
  createMathSpan(): StaticMathElement;
}

export type ReadonlyMathBackendLoader = () => Promise<ReadonlyMathBackend>;

interface RenderState {
  revision: number;
  content: ReadonlyMathContent;
}

const renderStates = new WeakMap<HTMLElement, RenderState>();

export function createCachedMathBackendLoader(
  importer: () => Promise<ReadonlyMathBackend>
): ReadonlyMathBackendLoader {
  let pending: Promise<ReadonlyMathBackend> | undefined;
  return () => {
    pending ??= importer();
    return pending;
  };
}

const loadDefaultBackend = createCachedMathBackendLoader(async () => {
  const [mathlive] = await Promise.all([
    import("mathlive"),
    import("mathlive/fonts.css"),
    import("mathlive/static.css"),
  ]);
  return {
    createMathSpan: () => new mathlive.MathSpanElement() as StaticMathElement,
  };
});

function showFallback(
  target: HTMLElement,
  content: ReadonlyMathContent,
  display: ReadonlyMathDisplay
): void {
  target.classList.remove("readonly-math-inline", "readonly-math-block");
  target.classList.add("readonly-math", `readonly-math-${display}`, "readonly-math-fallback");
  target.setAttribute("role", "math");
  target.setAttribute("aria-label", content.ariaLabel);
  target.tabIndex = -1;
  target.replaceChildren(document.createTextNode(content.displayText));
}

function isCurrent(
  target: HTMLElement,
  revision: number,
  content: ReadonlyMathContent
): boolean {
  const state = renderStates.get(target);
  return target.isConnected && state?.revision === revision && state.content === content;
}

export function renderReadonlyMath(
  target: HTMLElement,
  content: ReadonlyMathContent,
  options: {
    display?: ReadonlyMathDisplay;
    loadBackend?: ReadonlyMathBackendLoader;
  } = {}
): void {
  const display = options.display ?? "inline";
  const revision = (renderStates.get(target)?.revision ?? 0) + 1;
  renderStates.set(target, { revision, content });
  showFallback(target, content, display);

  const loadBackend = options.loadBackend ?? loadDefaultBackend;
  void loadBackend()
    .then((backend) => {
      if (!isCurrent(target, revision, content)) return;
      const math = backend.createMathSpan();
      math.format = "latex";
      math.mode = display === "block" ? "displaystyle" : "textstyle";
      math.textContent = content.latex;
      math.setAttribute("aria-label", content.ariaLabel);
      math.tabIndex = -1;

      const restore = (): void => {
        if (isCurrent(target, revision, content)) showFallback(target, content, display);
      };
      math.addEventListener("error", restore, { once: true });

      try {
        math.render();
        if (!isCurrent(target, revision, content)) return;
        target.classList.remove("readonly-math-fallback", "readonly-math-inline", "readonly-math-block");
        target.classList.add("readonly-math", `readonly-math-${display}`);
        target.replaceChildren(math);
      } catch {
        restore();
      }
    })
    .catch(() => {
      // The meaningful fallback is already present. Rendering is display-only.
    });
}
