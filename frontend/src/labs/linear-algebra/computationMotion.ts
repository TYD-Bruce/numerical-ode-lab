export interface ComputationMotionController {
  replay(): void;
  cancel(): void;
  dispose(): void;
}

interface RowSwapReplayOptions {
  readonly owner: HTMLElement;
  readonly control: HTMLButtonElement;
  readonly stage: HTMLElement;
  readonly renderBefore: () => readonly HTMLElement[];
  readonly renderAfter: () => void;
}

interface EliminationReplayOptions {
  readonly owner: HTMLElement;
  readonly control: HTMLButtonElement;
  readonly stage: HTMLElement;
  readonly renderBefore: () => void;
  readonly renderAfter: () => void;
}

const motionControllers = new WeakMap<HTMLElement, ComputationMotionController>();

function register(
  owner: HTMLElement,
  controller: ComputationMotionController
): ComputationMotionController {
  owner.dataset.computationMotionOwner = "true";
  motionControllers.set(owner, controller);
  return controller;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prefersCompactSwap(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 22rem)").matches
  );
}

function durationMs(element: HTMLElement, token: string, fallback: number): number {
  const raw = getComputedStyle(element).getPropertyValue(token).trim();
  const match = raw.match(/^([0-9]*\.?[0-9]+)(ms|s)$/);
  if (!match) return fallback;
  const value = Number(match[1]);
  return match[2] === "s" ? value * 1000 : value;
}

function requestFrame(callback: FrameRequestCallback): number {
  if (typeof globalThis.requestAnimationFrame === "function") {
    return globalThis.requestAnimationFrame(callback);
  }
  return window.setTimeout(() => callback(performance.now()), 16);
}

function cancelFrame(handle: number): void {
  if (typeof globalThis.cancelAnimationFrame === "function") {
    globalThis.cancelAnimationFrame(handle);
    return;
  }
  window.clearTimeout(handle);
}

function ownersWithin(scope: ParentNode): HTMLElement[] {
  const owners: HTMLElement[] = [];
  if (
    scope instanceof HTMLElement &&
    scope.dataset.computationMotionOwner === "true"
  ) {
    owners.push(scope);
  }
  owners.push(
    ...scope.querySelectorAll<HTMLElement>("[data-computation-motion-owner='true']")
  );
  return owners;
}

export function cancelComputationMotions(scope: ParentNode): void {
  ownersWithin(scope).forEach((owner) => motionControllers.get(owner)?.cancel());
}

export function disposeComputationMotions(scope: ParentNode): void {
  ownersWithin(scope).forEach((owner) => {
    motionControllers.get(owner)?.dispose();
    motionControllers.delete(owner);
  });
}

export function createRowSwapReplayMotion(
  options: RowSwapReplayOptions
): ComputationMotionController {
  let disposed = false;
  let generation = 0;
  let frameHandles: number[] = [];
  let finishTimer: number | undefined;

  const clearScheduledWork = (): void => {
    frameHandles.forEach(cancelFrame);
    frameHandles = [];
    if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    finishTimer = undefined;
  };

  const settle = (state: "settled" | "cancelled" | "disposed"): void => {
    clearScheduledWork();
    options.renderAfter();
    options.stage
      .querySelectorAll<HTMLElement>("[data-motion-row]")
      .forEach((row) => {
        row.classList.remove("is-motion-moving");
        row.style.removeProperty("transform");
        row.style.removeProperty("transition");
      });
    options.stage.dataset.motionState = state;
  };

  const replay = (): void => {
    if (disposed) return;
    generation += 1;
    const run = generation;
    clearScheduledWork();
    options.stage.hidden = false;
    options.stage.dataset.motionState = "preparing";
    const rows = [...options.renderBefore()];
    const reduced = prefersReducedMotion();
    const compact = prefersCompactSwap();
    options.stage.dataset.motionMode = reduced
      ? "reduced"
      : compact
        ? "compact"
        : "animated";
    if (reduced || compact || rows.length !== 2) {
      settle("settled");
      return;
    }

    const frame = requestFrame(() => {
      if (disposed || generation !== run) return;
      const firstRects = rows.map((row) => row.getBoundingClientRect());
      options.stage.append(rows[1], rows[0]);
      const reorderedRows = [rows[1], rows[0]];
      const lastRects = reorderedRows.map((row) => row.getBoundingClientRect());
      reorderedRows.forEach((row, index) => {
        const originalIndex = row === rows[0] ? 0 : 1;
        const deltaY = firstRects[originalIndex].top - lastRects[index].top;
        row.style.transition = "none";
        row.style.transform = `translateY(${deltaY}px)`;
      });
      void options.stage.offsetHeight;
      const movingFrame = requestFrame(() => {
        if (disposed || generation !== run) return;
        reorderedRows.forEach((row) => {
          row.classList.add("is-motion-moving");
          row.style.removeProperty("transition");
          row.style.transform = "translateY(0)";
        });
        options.stage.dataset.motionState = "moving";
      });
      frameHandles.push(movingFrame);
    });
    frameHandles.push(frame);
    finishTimer = window.setTimeout(() => {
      if (disposed || generation !== run) return;
      settle("settled");
    }, durationMs(options.stage, "--motion-transform", 420));
  };

  const onReplay = (): void => replay();
  options.control.addEventListener("click", onReplay);

  const controller: ComputationMotionController = {
    replay,
    cancel(): void {
      if (disposed) return;
      generation += 1;
      if (!options.stage.hidden) settle("cancelled");
    },
    dispose(): void {
      if (disposed) return;
      generation += 1;
      settle("disposed");
      disposed = true;
      options.control.removeEventListener("click", onReplay);
    },
  };
  return register(options.owner, controller);
}

export function createEliminationReplayMotion(
  options: EliminationReplayOptions
): ComputationMotionController {
  let disposed = false;
  let generation = 0;
  let frameHandle: number | undefined;
  let replacementTimer: number | undefined;
  let finishTimer: number | undefined;

  const clearScheduledWork = (): void => {
    if (frameHandle !== undefined) cancelFrame(frameHandle);
    if (replacementTimer !== undefined) window.clearTimeout(replacementTimer);
    if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    frameHandle = undefined;
    replacementTimer = undefined;
    finishTimer = undefined;
  };

  const settle = (state: "settled" | "cancelled" | "disposed"): void => {
    clearScheduledWork();
    options.renderAfter();
    options.stage.classList.remove("is-motion-moving");
    options.stage.dataset.motionState = state;
  };

  const replay = (): void => {
    if (disposed) return;
    generation += 1;
    const run = generation;
    clearScheduledWork();
    options.stage.hidden = false;
    options.stage.dataset.motionState = "preparing";
    options.renderBefore();
    const reduced = prefersReducedMotion();
    options.stage.dataset.motionMode = reduced ? "reduced" : "animated";
    if (reduced) {
      settle("settled");
      return;
    }

    frameHandle = requestFrame(() => {
      if (disposed || generation !== run) return;
      options.stage.classList.add("is-motion-moving");
      options.stage.dataset.motionState = "operating";
    });
    replacementTimer = window.setTimeout(() => {
      if (disposed || generation !== run) return;
      options.renderAfter();
      options.stage.dataset.motionState = "replaced";
    }, durationMs(options.stage, "--motion-fast", 140));
    finishTimer = window.setTimeout(() => {
      if (disposed || generation !== run) return;
      settle("settled");
    }, durationMs(options.stage, "--motion-transform", 420));
  };

  const onReplay = (): void => replay();
  options.control.addEventListener("click", onReplay);

  const controller: ComputationMotionController = {
    replay,
    cancel(): void {
      if (disposed) return;
      generation += 1;
      if (!options.stage.hidden) settle("cancelled");
    },
    dispose(): void {
      if (disposed) return;
      generation += 1;
      settle("disposed");
      disposed = true;
      options.control.removeEventListener("click", onReplay);
    },
  };
  return register(options.owner, controller);
}
