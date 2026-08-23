import { useTranslation } from "react-i18next";

import "./boardSettingsPage.styles.css";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import { BOARD_THEMES } from "../Game/boardThemes";
import { PIECE_SETS, getPieceIcon } from "../Game/pieceSets";

export default function BoardSettingsPage() {
  const { t } = useTranslation();
  const { boardThemeId, pieceSetId, setBoardThemeId, setPieceSetId } =
    useBoardSettings();

  return (
    <div className="board-settings-page">
      <h1 className="board-settings-title">{t("boardSettings.title")}</h1>
      <p className="board-settings-intro">{t("boardSettings.intro")}</p>

      <section className="board-settings-section">
        <h2 className="board-settings-heading">
          {t("boardSettings.colorsHeading")}
        </h2>
        <div className="board-theme-grid">
          {BOARD_THEMES.map((theme) => (
            <button
              type="button"
              key={theme.id}
              className={
                "board-theme-option" +
                (theme.id === boardThemeId ? " board-theme-option--selected" : "")
              }
              onClick={() => setBoardThemeId(theme.id)}
              aria-pressed={theme.id === boardThemeId}
            >
              <span className="board-theme-swatch" aria-hidden="true">
                <span style={{ backgroundColor: theme.light }} />
                <span style={{ backgroundColor: theme.dark }} />
                <span style={{ backgroundColor: theme.dark }} />
                <span style={{ backgroundColor: theme.light }} />
              </span>
              <span className="board-theme-name">{t(theme.name)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="board-settings-section">
        <h2 className="board-settings-heading">
          {t("boardSettings.pieceStyleHeading")}
        </h2>
        <div className="piece-set-grid">
          {PIECE_SETS.map((set) => (
            <button
              type="button"
              key={set.id}
              className={
                "piece-set-option" +
                (set.id === pieceSetId ? " piece-set-option--selected" : "")
              }
              onClick={() => setPieceSetId(set.id)}
              aria-pressed={set.id === pieceSetId}
            >
              <span className="piece-set-preview" aria-hidden="true">
                {getPieceIcon("k", set.id)}
                {getPieceIcon("K", set.id)}
              </span>
              <span className="piece-set-name">{t(set.name)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
