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
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20 15.4A8.5 8.5 0 0 1 8.6 4a7.6 7.6 0 1 0 11.4 11.4Z" />
  </svg>`;

const SUN_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
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
