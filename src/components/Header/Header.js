import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./header.styles.css";
import LanguagesPopup from "./LanguagesPopup/LanguagesPopup";
import { useOnClickOutside } from "../../helpers/hooks/useOnClickOutside";
import logo from "../../images/logo.png";
import armenian from "../../images/armenia.png";
import russian from "../../images/russia.png";
import english from "../../images/us.png";

function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languageSwitchRef = useRef(null);

  const closePopup = () => setIsOpen(false);
  useOnClickOutside(languageSwitchRef, closePopup);

  return (
    <div className="navbar navbar-inverse navbar-static-top">
      <div className="container">
        <div className="header-wrapper">
          <div className="header-item">
            <Link to="/" className="navbar-brand brand-logo-link">
              <img src={logo} className="brand-logo" alt="World of Chess" />
            </Link>
          </div>
          <div className="header-item">
            <Link to="/" className="navbar-brand">
              {t("header.home")}
            </Link>
          </div>
          <div className="header-item">
            <Link to="/champions" className="navbar-brand">
              {t("header.worldChampions")}
            </Link>
          </div>
          <div className="header-item">
            <Link to="/game" className="navbar-brand">
              {t("header.play")}
            </Link>
          </div>
          <div className="language-switch-wrapper" ref={languageSwitchRef}>
            <button
              type="button"
              className="language-switch-button"
              onClick={() => setIsOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-label={t("header.changeLanguage")}
            >
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
            </button>
            {isOpen && <LanguagesPopup onSelect={closePopup} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
