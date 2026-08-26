import React, { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./header.styles.css";
import LanguagesPopup from "./LanguagesPopup/LanguagesPopup";
import { useOnClickOutside } from "../../helpers/hooks/useOnClickOutside";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../images/logo.png";
import armenian from "../../images/armenia.png";
import russian from "../../images/russia.png";
import english from "../../images/us.png";

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    // sun (switch to light)
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="5.1" y1="5.1" x2="6.8" y2="6.8" />
          <line x1="17.2" y1="17.2" x2="18.9" y2="18.9" />
          <line x1="5.1" y1="18.9" x2="6.8" y2="17.2" />
          <line x1="17.2" y1="6.8" x2="18.9" y2="5.1" />
        </g>
      </svg>
    );
  }
  // moon (switch to dark)
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function navLinkClass({ isActive }) {
  return "header-link" + (isActive ? " header-link--active" : "");
}

// Some browsers still mark a link/button as :focus-visible after a plain
// mouse click (their "was this keyboard-like" heuristic isn't perfectly
// reliable) -- suppressing focus-from-mousedown keeps the ring for real
// keyboard navigation without it flashing on every click.
function suppressMouseFocusRing(event) {
  event.preventDefault();
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavLinks({ onNavigate }) {
  const { t } = useTranslation();
  return (
    <>
      <NavLink to="/" end className={navLinkClass} onMouseDown={suppressMouseFocusRing} onClick={onNavigate}>
        {t("header.home")}
      </NavLink>
      <NavLink to="/game" className={navLinkClass} onMouseDown={suppressMouseFocusRing} onClick={onNavigate}>
        {t("header.play")}
      </NavLink>
      <NavLink to="/board" className={navLinkClass} onMouseDown={suppressMouseFocusRing} onClick={onNavigate}>
        {t("header.board")}
      </NavLink>
      <NavLink to="/rules" className={navLinkClass} onMouseDown={suppressMouseFocusRing} onClick={onNavigate}>
        {t("header.rules")}
      </NavLink>
      <NavLink to="/champions" className={navLinkClass} onMouseDown={suppressMouseFocusRing} onClick={onNavigate}>
        {t("header.worldChampions")}
      </NavLink>
    </>
  );
}

function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const languageSwitchRef = useRef(null);
  const navRef = useRef(null);

  const closePopup = () => setIsOpen(false);
  const closeNav = () => setIsNavOpen(false);
  useOnClickOutside(languageSwitchRef, closePopup);
  useOnClickOutside(navRef, closeNav);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="brand-logo-link" onMouseDown={suppressMouseFocusRing}>
          <img src={logo} className="brand-logo" alt="ChessLab" draggable={false} />
        </Link>

        <nav className="header-nav">
          <NavLinks />
        </nav>

        <div className="mobile-nav-wrapper" ref={navRef}>
          <button
            type="button"
            className="mobile-nav-button"
            onClick={() => setIsNavOpen((open) => !open)}
            onMouseDown={suppressMouseFocusRing}
            aria-haspopup="true"
            aria-expanded={isNavOpen}
            aria-label={t("header.menu")}
          >
            <HamburgerIcon />
          </button>
          {isNavOpen && (
            <nav className="mobile-nav-panel">
              <NavLinks onNavigate={closeNav} />
            </nav>
          )}
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="theme-toggle-button"
            onClick={toggleTheme}
            onMouseDown={suppressMouseFocusRing}
            aria-label={t(theme === "dark" ? "header.switchToLight" : "header.switchToDark")}
          >
            <ThemeIcon theme={theme} />
          </button>

          <div className="language-switch-wrapper" ref={languageSwitchRef}>
            <button
              type="button"
              className="language-switch-button"
              onClick={() => setIsOpen((open) => !open)}
              onMouseDown={suppressMouseFocusRing}
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
    </header>
  );
}

export default Header;
