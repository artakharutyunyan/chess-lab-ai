import React from "react";

import "./championsList.styles.css";
import champions from "./constants";
import { useTranslation } from "react-i18next";

function ChampionsList() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className="flex">
        <h1>{t("championsList.header")}</h1>
        <p>{t("championsList.text")}</p>
        <div className="wrapper">
          {champions.map((champion) => (
            <div key={champion.id} className="date-and-img">
              <div className="header">
                <div>{t(champion.name)}</div>
                <div>{champion.date}</div>
              </div>
              <img src={champion.img} alt="" className="img" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChampionsList;
