import { describe, expect, it, beforeEach } from "vitest";
import { ThemePreference } from "./ThemePreference";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

function createRootElement(): HTMLElement {
  const classes = new Set<string>();
  return {
    classList: {
      contains: (name: string) => classes.has(name),
      add: (name: string) => {
        classes.add(name);
      },
      remove: (name: string) => {
        classes.delete(name);
      },
      toggle: (name: string, force?: boolean) => {
        if (force === true) {
          classes.add(name);
        } else if (force === false) {
          classes.delete(name);
        } else if (classes.has(name)) {
          classes.delete(name);
        } else {
          classes.add(name);
        }
      },
    },
  } as HTMLElement;
}

function createMatchMedia(prefersDark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches: prefersDark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      listeners.add(listener);
    },
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      listeners.delete(listener);
    },
    dispatchChange(prefersDarkNext: boolean) {
      mql.matches = prefersDarkNext;
      const event = { matches: prefersDarkNext } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
  return mql;
}

describe("ThemePreference", () => {
  let storage: Storage;
  let root: HTMLElement;
  let matchMedia: ReturnType<typeof createMatchMedia>;

  const getMatchMedia = () => matchMedia as unknown as MediaQueryList;

  beforeEach(() => {
    storage = createMemoryStorage();
    root = createRootElement();
    matchMedia = createMatchMedia(false);
  });

  it("defaults to system when storage is empty", () => {
    const theme = new ThemePreference(storage, root, getMatchMedia);

    expect(theme.getPreference()).toBe("system");
  });

  it("persists preference to storage on set", () => {
    const theme = new ThemePreference(storage, root, getMatchMedia);

    theme.setPreference("dark");

    expect(storage.getItem("todo-app-theme")).toBe("dark");
    expect(new ThemePreference(storage, root, getMatchMedia).getPreference()).toBe(
      "dark",
    );
  });

  it("applies dark class when preference is dark", () => {
    const theme = new ThemePreference(storage, root, getMatchMedia);

    theme.setPreference("dark");

    expect(root.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when preference is light", () => {
    root.classList.add("dark");
    const theme = new ThemePreference(storage, root, getMatchMedia);

    theme.setPreference("light");

    expect(root.classList.contains("dark")).toBe(false);
  });

  it("follows OS dark preference when mode is system", () => {
    matchMedia = createMatchMedia(true);
    const theme = new ThemePreference(storage, root, getMatchMedia);

    theme.setPreference("system");

    expect(root.classList.contains("dark")).toBe(true);
  });

  it("follows OS light preference when mode is system", () => {
    matchMedia = createMatchMedia(false);
    const theme = new ThemePreference(storage, root, getMatchMedia);

    theme.setPreference("system");

    expect(root.classList.contains("dark")).toBe(false);
  });

  it("updates class when OS preference changes while in system mode", () => {
    matchMedia = createMatchMedia(false);
    const theme = new ThemePreference(storage, root, getMatchMedia);
    theme.setPreference("system");

    matchMedia.dispatchChange(true);

    expect(root.classList.contains("dark")).toBe(true);
  });

  it("ignores OS changes when user chose light or dark", () => {
    matchMedia = createMatchMedia(true);
    const theme = new ThemePreference(storage, root, getMatchMedia);
    theme.setPreference("light");

    matchMedia.dispatchChange(true);

    expect(root.classList.contains("dark")).toBe(false);
  });
});
