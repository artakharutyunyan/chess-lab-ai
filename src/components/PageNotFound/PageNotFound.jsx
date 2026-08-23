import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./pageNotFound.styles.css";

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">{t("notFound.title")}</h1>
      <p className="not-found-text">{t("notFound.text")}</p>
      <Link to="/" className="not-found-link">
        {t("notFound.backHome")}
      </Link>
    </div>
  );
};

export default PageNotFound;
