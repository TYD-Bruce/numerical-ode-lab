import type { Navigate, RouteModule } from "../../app/contracts";
import { createAboutPage } from "../../pages/aboutPage";
import {
  createRouteLink,
  createTextElement,
} from "../../pages/pageContracts";

export interface InstallGlossaryDevelopmentControlsOptions {
  readonly navigate: Navigate;
  readonly playgroundPath: string;
  readonly eventTarget?: Window;
  readonly getPathname?: () => string;
}

export type GlossaryDevelopmentControlsCleanup = () => void;

export interface GlossaryDevelopmentControlsModule {
  readonly installGlossaryDevelopmentControls: (
    options: InstallGlossaryDevelopmentControlsOptions
  ) => GlossaryDevelopmentControlsCleanup;
  readonly createGlossaryDevelopmentAboutPage: (options: {
    readonly playgroundPath: string;
  }) => RouteModule;
}

export function installGlossaryDevelopmentControls(
  options: InstallGlossaryDevelopmentControlsOptions
): GlossaryDevelopmentControlsCleanup {
  const eventTarget = options.eventTarget ?? window;
  const getPathname =
    options.getPathname ?? (() => eventTarget.location.pathname);
  let disposed = false;

  const onKeyDown = (event: KeyboardEvent): void => {
    if (
      disposed ||
      event.defaultPrevented ||
      event.repeat ||
      event.altKey ||
      !event.shiftKey ||
      event.ctrlKey === event.metaKey ||
      !isGlossaryShortcutKey(event) ||
      isEditableTarget(event.target) ||
      normalizePathname(getPathname()) ===
        normalizePathname(options.playgroundPath)
    ) {
      return;
    }

    event.preventDefault();
    void options.navigate(options.playgroundPath);
  };

  eventTarget.addEventListener("keydown", onKeyDown);

  return (): void => {
    if (disposed) return;
    disposed = true;
    eventTarget.removeEventListener("keydown", onKeyDown);
  };
}

export function createGlossaryDevelopmentAboutPage(options: {
  readonly playgroundPath: string;
}): RouteModule {
  const base = createAboutPage();
  return Object.freeze({
    mount(mountOptions: Parameters<RouteModule["mount"]>[0]) {
      const mounted = base.mount(mountOptions);
      const page = mountOptions.target.querySelector<HTMLElement>(
        ".platform-reading-page"
      );
      if (!page) return mounted;

      const developerTools = document.createElement("section");
      developerTools.dataset.aboutDeveloperTools = "";
      developerTools.append(
        createTextElement("h2", "Developer Tools"),
        createTextElement(
          "p",
          "These development-only tools review framework behavior. They are not part of the production product."
        ),
        createRouteLink(
          "Open Glossary Playground",
          options.playgroundPath,
          { className: "platform-action platform-action-secondary" }
        )
      );
      page.append(developerTools);
      return mounted;
    },
  });
}

function isGlossaryShortcutKey(event: KeyboardEvent): boolean {
  return event.code === "KeyG" || event.key.toLowerCase() === "g";
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return (
    target.closest("input, textarea, select, math-field") !== null ||
    target.closest(
      '[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]'
    ) !== null
  );
}

function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}
