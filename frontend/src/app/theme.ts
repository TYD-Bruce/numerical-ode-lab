export type PlatformTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "numerical-t-lab-theme";
export const THEME_CHANGE_EVENT = "numerical-t-lab:themechange";

function isPlatformTheme(value: string | null | undefined): value is PlatformTheme {
  return value === "light" || value === "dark";
}

function storedTheme(): PlatformTheme | undefined {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPlatformTheme(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function getPlatformTheme(): PlatformTheme {
  const current = document.documentElement.dataset.theme;
  return isPlatformTheme(current) ? current : "light";
}

export function initializePlatformTheme(): PlatformTheme {
  const theme = storedTheme() ?? getPlatformTheme();
  document.documentElement.dataset.theme = theme;
  return theme;
}

export function setPlatformTheme(
  theme: PlatformTheme,
  options: { persist?: boolean; announce?: boolean } = {}
): void {
  document.documentElement.dataset.theme = theme;
  if (options.persist !== false) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still applies for this page when storage is unavailable.
    }
  }
  if (options.announce !== false) {
    window.dispatchEvent(
      new CustomEvent<PlatformTheme>(THEME_CHANGE_EVENT, { detail: theme })
    );
  }
}

const MOON_ICON = `
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M9.53 1.72a.75.75 0 0 1 .16.82A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.46-.69.75.75 0 0 1 .98.98A10.5 10.5 0 1 1 8.71 1.56a.75.75 0 0 1 .82.16Z"
      clip-rule="evenodd"
    />
  </svg>`;

const SUN_ICON = `
  <svg class="platform-theme-icon platform-theme-icon-sun" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
    <circle class="platform-theme-icon-fill" cx="14" cy="14" r="5.2" />
    <path class="platform-theme-icon-rays" d="M14 2.7v3.2M14 22.1v3.2M2.7 14h3.2M22.1 14h3.2M6 6l2.3 2.3M19.7 19.7 22 22M6 22l2.3-2.3M19.7 8.3 22 6" />
  </svg>`;

export function createThemeToggle(): {
  readonly button: HTMLButtonElement;
  dispose(): void;
} {
  initializePlatformTheme();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "platform-theme-toggle";
  button.dataset.themeToggle = "true";

  const render = (): void => {
    const dark = getPlatformTheme() === "dark";
    const label = dark ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(dark));
    button.title = label;
    button.innerHTML = dark ? SUN_ICON : MOON_ICON;
  };
  const onClick = (): void => {
    setPlatformTheme(getPlatformTheme() === "light" ? "dark" : "light");
    render();
  };
  const onThemeChange = (): void => render();

  button.addEventListener("click", onClick);
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  render();

  return Object.freeze({
    button,
    dispose(): void {
      button.removeEventListener("click", onClick);
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    },
  });
}
