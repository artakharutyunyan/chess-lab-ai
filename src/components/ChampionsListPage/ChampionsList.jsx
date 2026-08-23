import React from "react";

import "./championsList.styles.css";
import champions from "./constants";
import { useTranslation } from "react-i18next";

function ChampionsList() {
  const { t } = useTranslation();
  return (
    <div className="champions-page">
      <h1 className="champions-title">{t("championsList.header")}</h1>
      <p className="champions-intro">{t("championsList.text")}</p>
      <div className="champions-grid">
        {champions.map((champion) => (
          <div key={champion.id} className="champion-card">
            <img
              src={champion.img}
              alt={t(champion.name)}
              className="champion-photo"
            />
            <div className="champion-name">{t(champion.name)}</div>
            <div className="champion-date">{champion.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChampionsList;
