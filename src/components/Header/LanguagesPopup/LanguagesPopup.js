import React from "react";
import Cookies from "js-cookie";

import "./languagesPopup.styles.css";
import { languages } from "./constants";
import { i18n } from "../../../i18n/index.js";

const LanguagesPopup = () => {
  const switchLanguage = (lang) => {
    Cookies.set("lng", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="languages">
      {languages.map(
        (item) =>
          i18n.language !== item.id && (
            <div
              className="languageContainer"
              onClick={() => {
                switchLanguage(item.id);
              }}
              key={item.id}
            >
              <img src={item.flag} alt="" className="flag" />
              <div className="text">{item.text}</div>
            </div>
          )
      )}
    </div>
  );
};

export default LanguagesPopup;
