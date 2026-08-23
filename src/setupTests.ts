import "@testing-library/jest-dom";
// Header transitively initializes i18next as an import side effect (via
// LanguagesPopup -> i18n/index.js), which only reliably happens once
// Header itself is in a test's module graph. Import it directly here so
// every component test gets an initialized i18next instance regardless
// of which component it renders, and pin the language so assertions on
// rendered text are deterministic (the app defaults to Armenian when no
// "lng" cookie is set, which jsdom never has).
import { i18n } from "./i18n";

await i18n.changeLanguage("en");
