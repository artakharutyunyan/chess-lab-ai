import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="container flex">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <Link to="/">{t("notFound.backHome")}</Link>
    </div>
  );
};

export default PageNotFound;
