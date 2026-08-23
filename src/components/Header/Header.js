import React, { useState } from "react";
import { Link } from "react-router-dom";
import { i18n } from "../../i18n/index";

import "./header.styles.css";
import LanguagesPopup from "./LanguagesPopup/LanguagesPopup";
import armenian from "../../images/armenia.png";
import russian from "../../images/russia.png";
import english from "../../images/us.png";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handlePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar navbar-inverse navbar-static-top">
      <div className="container">
        <div className="header-wrapper">
          <div className="header-item">
            <Link to="/" className="navbar-brand">
              {i18n.t("header.home")}
            </Link>
          </div>
          <div className="header-item">
            <Link to="/champions" className="navbar-brand">
              {i18n.t("header.worldChampions")}
            </Link>
          </div>
          <div className="header-item">
            <Link to="/game" className="navbar-brand">
              {i18n.t("header.play")}
            </Link>
          </div>
          <div>
            <div className="language-switch-button" onClick={handlePopup}>
              {isOpen && <LanguagesPopup />}
              {i18n.language === "am" && (
                <img
                  className="language-logo"
                  src={armenian}
                  alt="armenian language"
                />
              )}
              {i18n.language === "ru" && (
                <img
                  className="language-logo"
                  src={russian}
                  alt="russian language"
                />
              )}
              {i18n.language === "en" && (
                <img
                  className="language-logo"
                  src={english}
                  alt="english language"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
