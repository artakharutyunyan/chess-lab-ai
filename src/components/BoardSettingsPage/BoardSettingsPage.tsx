import { useTranslation } from "react-i18next";

import "./boardSettingsPage.styles.css";
import BoardSettingsFields from "./BoardSettingsFields";

export default function BoardSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="board-settings-page">
      <h1 className="board-settings-title">{t("boardSettings.title")}</h1>
      <p className="board-settings-intro">{t("boardSettings.intro")}</p>
      <BoardSettingsFields />
    </div>
  );
}
