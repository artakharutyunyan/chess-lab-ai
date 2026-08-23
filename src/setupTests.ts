import "@testing-library/jest-dom";
// Header transitively initializes i18next as an import side effect (via
// LanguagesPopup -> i18n/index.js), which only reliably happens once
// Header itself is in a test's module graph. Import it directly here so
// every component test gets an initialized i18next instance regardless
// of which component it renders, and pin the language so assertions on
// rendered text are deterministic (the app defaults to Armenian when no
// "lng" cookie is set, which jsdom never has).
import { i18n } from "./i18n";

// Under this Node/jsdom combination, window.localStorage comes back
// undefined in tests (Node's own experimental localStorage global shadows
// jsdom's and needs a --localstorage-file flag we don't want to depend on).
// ThemeContext needs a working localStorage, so polyfill a minimal one.
if (typeof window !== "undefined" && !window.localStorage) {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();
    get length() {
      return this.store.size;
    }
    clear() {
      this.store.clear();
    }
    getItem(key: string) {
      return this.store.has(key) ? this.store.get(key)! : null;
    }
    key(index: number) {
      return Array.from(this.store.keys())[index] ?? null;
    }
    removeItem(key: string) {
      this.store.delete(key);
    }
    setItem(key: string, value: string) {
      this.store.set(key, String(value));
    }
  }
  Object.defineProperty(window, "localStorage", {
    value: new MemoryStorage(),
    writable: true,
  });
}

await i18n.changeLanguage("en");
