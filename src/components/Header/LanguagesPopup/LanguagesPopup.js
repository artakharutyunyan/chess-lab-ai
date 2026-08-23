import React from "react";
import Cookies from "js-cookie";

import "./languagesPopup.styles.css";
import { languages } from "./constants";
import { i18n } from "../../../i18n/index.js";

const LanguagesPopup = ({ onSelect }) => {
  const switchLanguage = (lang) => {
    Cookies.set("lng", lang);
    i18n.changeLanguage(lang);
    if (onSelect) onSelect();
  };

  return (
    <div className="languages">
      {languages.map(
        (item) =>
          i18n.language !== item.id && (
            <button
              type="button"
              className="languageContainer"
              onClick={() => {
                switchLanguage(item.id);
              }}
              key={item.id}
            >
              <img src={item.flag} alt={item.text} className="flag" />
              <div className="text">{item.text}</div>
            </button>
          )
      )}
    </div>
  );
};

export default LanguagesPopup;
