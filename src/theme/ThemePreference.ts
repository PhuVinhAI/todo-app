export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "todo-app-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const VALID_MODES: ThemeMode[] = ["system", "light", "dark"];

function parseStored(value: string | null): ThemeMode {
  if (value && VALID_MODES.includes(value as ThemeMode)) {
    return value as ThemeMode;
  }
  return "system";
}

export class ThemePreference {
  private preference: ThemeMode;
  private mediaListener: ((event: MediaQueryListEvent) => void) | null = null;
  private readonly storage: Storage;
  private readonly root: HTMLElement;
  private readonly getMatchMedia: (query: string) => MediaQueryList;

  constructor(
    storage: Storage,
    root: HTMLElement,
    getMatchMedia: (query: string) => MediaQueryList = (query) =>
      window.matchMedia(query),
  ) {
    this.storage = storage;
    this.root = root;
    this.getMatchMedia = getMatchMedia;
    this.preference = parseStored(storage.getItem(STORAGE_KEY));
    this.apply();
    this.attachMediaListener();
  }

  getPreference(): ThemeMode {
    return this.preference;
  }

  setPreference(mode: ThemeMode): void {
    this.preference = mode;
    this.storage.setItem(STORAGE_KEY, mode);
    this.apply();
    this.attachMediaListener();
  }

  apply(): void {
    const isDark =
      this.preference === "dark" ||
      (this.preference === "system" && this.getMatchMedia(DARK_QUERY).matches);

    this.root.classList.toggle("dark", isDark);
  }

  private attachMediaListener(): void {
    this.detachMediaListener();

    if (this.preference !== "system") {
      return;
    }

    const mql = this.getMatchMedia(DARK_QUERY);
    this.mediaListener = () => this.apply();
    mql.addEventListener("change", this.mediaListener);
  }

  private detachMediaListener(): void {
    if (!this.mediaListener) {
      return;
    }

    this.getMatchMedia(DARK_QUERY).removeEventListener("change", this.mediaListener);
    this.mediaListener = null;
  }
}

let singleton: ThemePreference | null = null;

export function initTheme(
  storage: Storage = localStorage,
  root: HTMLElement = document.documentElement,
): ThemePreference {
  if (!singleton) {
    singleton = new ThemePreference(storage, root);
  }
  return singleton;
}

export function getThemePreference(): ThemePreference {
  if (!singleton) {
    return initTheme();
  }
  return singleton;
}
