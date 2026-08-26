import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

import { en } from "./translations/en";
import { am } from "./translations/am";
import { ru } from "./translations/ru";

const resources = {
  en,
  am,
  ru,
};

i18n.use(initReactI18next).init({
  resources,
  lng: Cookies.get("lng") || "en",

  keySeparator: ".",

  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
