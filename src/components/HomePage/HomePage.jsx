import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./homePage.styles.css";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="background">
      <div className="container hero">
        <h1 className="hero-title">{t("home.title")}</h1>
        <p className="hero-subtitle">{t("home.subtitle")}</p>
        <Link to="/game" className="hero-cta">
          {t("home.cta")}
        </Link>
      </div>
    </div>
  );
}
