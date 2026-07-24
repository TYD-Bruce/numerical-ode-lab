export type PlatformModalOwner = "tutor" | "glossary";

export interface PlatformModalLease {
  readonly owner: PlatformModalOwner;
  release(): void;
}

export type PlatformModalAcquireResult =
  | {
      readonly status: "acquired";
      readonly lease: PlatformModalLease;
    }
  | {
      readonly status: "blocked";
      readonly reason: "external-modal-active";
    };

export interface PlatformModalEnvironment {
  acquire(options: {
    readonly owner: PlatformModalOwner;
    readonly hostRegion: HTMLElement;
    readonly background: readonly HTMLElement[];
  }): PlatformModalAcquireResult;
  dispose(): void;
}

interface InertSnapshot {
  readonly element: HTMLElement;
  readonly hadAttribute: boolean;
  readonly propertyValue: boolean | undefined;
}

interface ActiveLease {
  readonly identity: object;
  readonly owner: PlatformModalOwner;
  readonly inert: readonly InertSnapshot[];
  readonly bodyOverflow: string;
  readonly scrollY: number;
}

type InertElement = HTMLElement & { inert?: boolean };

function readDocumentScrollY(): number {
  const value = document.scrollingElement?.scrollTop ?? window.scrollY;
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function restoreDocumentScroll(value: number): void {
  if (window.navigator.userAgent.toLowerCase().includes("jsdom")) {
    if (document.scrollingElement) document.scrollingElement.scrollTop = value;
    return;
  }
  try {
    window.scrollTo({ top: value, left: 0, behavior: "auto" });
  } catch {
    // Environments without scrolling still receive DOM restoration.
  }
}

export function hasActiveExternalModal(hostRegion: HTMLElement): boolean {
  return [...document.querySelectorAll<HTMLElement>('[aria-modal="true"]')].some(
    (candidate) =>
      candidate.isConnected &&
      !hostRegion.contains(candidate) &&
      !candidate.hidden &&
      candidate.getAttribute("aria-hidden") !== "true"
  );
}

export function createPlatformModalEnvironment(): PlatformModalEnvironment {
  let active: ActiveLease | undefined;
  let disposed = false;

  const release = (identity: object): void => {
    if (active?.identity !== identity) return;
    const releasing = active;
    active = undefined;
    for (const snapshot of releasing.inert) {
      const element = snapshot.element as InertElement;
      if (snapshot.propertyValue !== undefined) {
        element.inert = snapshot.propertyValue;
      }
      if (snapshot.hadAttribute) {
        snapshot.element.setAttribute("inert", "");
      } else {
        snapshot.element.removeAttribute("inert");
      }
    }
    document.body.style.overflow = releasing.bodyOverflow;
    restoreDocumentScroll(releasing.scrollY);
  };

  const environment: PlatformModalEnvironment = {
    acquire(options): PlatformModalAcquireResult {
      if (
        disposed ||
        active !== undefined ||
        hasActiveExternalModal(options.hostRegion)
      ) {
        return {
          status: "blocked",
          reason: "external-modal-active",
        };
      }

      const background = [
        ...new Set<HTMLElement>(options.background),
      ].filter(
        (element) =>
          element.isConnected &&
          element !== options.hostRegion &&
          !element.contains(options.hostRegion)
      );
      const inert = background.map<InertSnapshot>((element) => {
        const inertElement = element as InertElement;
        return {
          element,
          hadAttribute: element.hasAttribute("inert"),
          propertyValue:
            typeof inertElement.inert === "boolean"
              ? inertElement.inert
              : undefined,
        };
      });
      const identity = {};
      active = {
        identity,
        owner: options.owner,
        inert,
        bodyOverflow: document.body.style.overflow,
        scrollY: readDocumentScrollY(),
      };
      for (const snapshot of inert) {
        const element = snapshot.element as InertElement;
        if (typeof element.inert === "boolean") element.inert = true;
        snapshot.element.setAttribute("inert", "");
      }
      document.body.style.overflow = "hidden";

      return {
        status: "acquired",
        lease: Object.freeze({
          owner: options.owner,
          release(): void {
            release(identity);
          },
        }),
      };
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      if (active) release(active.identity);
    },
  };
  return Object.freeze(environment);
}
