import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./homePage.styles.css";

const FEATURES = [
  { key: "play", to: "/game" },
  { key: "board", to: "/board" },
  { key: "champions", to: "/champions" },
  { key: "rules", to: "/rules" },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <div className="home-photo-backdrop">
        <div className="home-photo-scrim" aria-hidden="true" />

        <section className="home-hero">
          <div className="home-hero-content">
            <h1 className="home-hero-title">{t("home.heroTitle")}</h1>
            <p className="home-hero-tagline">{t("home.heroTagline")}</p>
            <div className="home-hero-ctas">
              <Link to="/game" className="home-cta home-cta--primary">
                {t("home.playNow")}
              </Link>
              <Link to="/rules" className="home-cta home-cta--secondary">
                {t("home.howToPlay")}
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section">
          <h2 className="home-section-heading">{t("home.featuresHeading")}</h2>
          <div className="home-feature-grid">
            {FEATURES.map(({ key, to }) => (
              <Link to={to} className="home-feature-card" key={key}>
                <h3 className="home-feature-title">{t(`home.features.${key}.title`)}</h3>
                <p className="home-feature-body">{t(`home.features.${key}.body`)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
