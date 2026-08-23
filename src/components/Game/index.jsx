import React from "react";
import { withTranslation } from "react-i18next";

import { Board } from "./Board";
import { useBoardSettings } from "../../context/BoardSettingsContext";
import { getBoardTheme } from "./boardThemes";

const TranslatedBoard = withTranslation()(Board);

// Injects the selected board color pair as CSS custom properties that
// game.styles.css's .white_square/.black_square read (with the classic
// colors as fallback, so nothing changes for anyone who hasn't picked a
// theme). Kept as a thin wrapper so Board.jsx itself -- and the engine it
// drives -- never has to know board color is configurable.
export function Game(props) {
  const { boardThemeId } = useBoardSettings();
  const theme = getBoardTheme(boardThemeId);

  return (
    <div style={{ "--board-light": theme.light, "--board-dark": theme.dark }}>
      <TranslatedBoard {...props} />
    </div>
  );
}
