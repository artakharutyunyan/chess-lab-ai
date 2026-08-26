import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import BoardSettingsFields from "../BoardSettingsPage/BoardSettingsFields";
import "./boardSettingsModal.styles.css";

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M5 5 L15 15 M15 5 L5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// iChess exposes board/piece options as a popup dialog over the board
// rather than a separate page -- this gives that same quick-access pattern
// (opened from a gear button in PlayPanel's controls row) while the
// standalone /board route (BoardSettingsPage.tsx) keeps working too. Both
// share the same option fields (BoardSettingsFields) and the same
// BoardSettingsContext, so a change made here is visible immediately behind
// the dialog and still there if you later visit /board.
export default function BoardSettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("boardSettings.title")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-header">
          <h2 className="settings-modal-title">{t("boardSettings.title")}</h2>
          <button
            type="button"
            className="settings-modal-close"
            onClick={onClose}
            aria-label={t("game.closeSettings")}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="settings-modal-body">
          <BoardSettingsFields />
        </div>
      </div>
    </div>
  );
}
