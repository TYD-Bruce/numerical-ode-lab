export interface GlossaryRect {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

export interface GlossaryDimensions {
  readonly width: number;
  readonly height: number;
}

export interface GlossaryViewport {
  readonly width: number;
  readonly height: number;
}

export interface GlossaryPlacement {
  readonly side: "top" | "bottom";
  readonly left: number;
  readonly top: number;
  readonly maxWidth: number;
  readonly maxHeight: number;
}

export interface GlossaryPlacementOptions {
  readonly triggerConnected: boolean;
  readonly trigger: GlossaryRect;
  readonly surface: GlossaryDimensions;
  readonly viewport: GlossaryViewport;
  readonly gap?: number;
  readonly margin?: number;
}

const PREFERRED_WIDTH = 360;
const MINIMUM_WIDTH = 288;
const MAXIMUM_WIDTH = 420;
const MAXIMUM_HEIGHT = 560;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteNonnegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function placeGlossarySurface(
  options: GlossaryPlacementOptions
): GlossaryPlacement | undefined {
  const margin = options.margin ?? 12;
  const gap = options.gap ?? 8;
  const viewportWidth = finiteNonnegative(options.viewport.width);
  const viewportHeight = finiteNonnegative(options.viewport.height);
  const trigger = options.trigger;

  if (
    !options.triggerConnected ||
    trigger.bottom < -margin ||
    trigger.top > viewportHeight + margin ||
    trigger.right < -margin ||
    trigger.left > viewportWidth + margin
  ) {
    return undefined;
  }

  const maxWidth = Math.max(
    0,
    Math.min(MAXIMUM_WIDTH, viewportWidth - margin * 2)
  );
  const minimumWidth = Math.min(MINIMUM_WIDTH, maxWidth);
  const measuredWidth =
    finiteNonnegative(options.surface.width) || PREFERRED_WIDTH;
  const surfaceWidth = clamp(measuredWidth, minimumWidth, maxWidth);
  const globalMaxHeight = Math.max(
    0,
    Math.min(MAXIMUM_HEIGHT, viewportHeight * 0.7)
  );
  const measuredHeight = finiteNonnegative(options.surface.height);
  const availableBottom = Math.max(
    0,
    viewportHeight - margin - trigger.bottom - gap
  );
  const availableTop = Math.max(0, trigger.top - margin - gap);
  const side =
    measuredHeight <= availableBottom || availableBottom >= availableTop
      ? "bottom"
      : "top";
  const sideAvailable = side === "bottom" ? availableBottom : availableTop;
  const maxHeight = Math.min(globalMaxHeight, sideAvailable);
  const visibleHeight = Math.min(measuredHeight, maxHeight);
  const left = clamp(
    trigger.left,
    margin,
    Math.max(margin, viewportWidth - margin - surfaceWidth)
  );
  const top =
    side === "bottom"
      ? trigger.bottom + gap
      : Math.max(margin, trigger.top - gap - visibleHeight);

  return Object.freeze({
    side,
    left,
    top,
    maxWidth,
    maxHeight,
  });
}
