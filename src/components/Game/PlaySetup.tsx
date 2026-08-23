import { useTranslation } from "react-i18next";
import "./playPanel.styles.css";
import "./playSetup.styles.css";

const MINUTE_OPTIONS = [1, 2, 3, 5, 10, 15, 30];
const HOUR_OPTIONS = [1, 2];

export interface PlaySetupProps {
  humanPlayer: "w" | "b";
  timeControlMs: number;
  onSelectHumanPlayer: (color: "w" | "b") => void;
  onSelectTimeControl: (ms: number) => void;
  onStart: () => void;
}

export default function PlaySetup({
  humanPlayer,
  timeControlMs,
  onSelectHumanPlayer,
  onSelectTimeControl,
  onStart,
}: PlaySetupProps) {
  const { t } = useTranslation();

  return (
    <div className="play-panel play-setup">
      <h2 className="play-setup-title">{t("game.newGame")}</h2>

      <section className="play-setup-section">
        <h3 className="play-setup-label">{t("game.timeControl")}</h3>
        <div className="play-setup-time-grid">
          {MINUTE_OPTIONS.map((minutes) => {
            const ms = minutes * 60 * 1000;
            return (
              <button
                type="button"
                key={ms}
                className={
                  "play-setup-chip" + (timeControlMs === ms ? " play-setup-chip--selected" : "")
                }
                onClick={() => onSelectTimeControl(ms)}
                aria-pressed={timeControlMs === ms}
              >
                {minutes} {t("game.minuteUnit")}
              </button>
            );
          })}
          {HOUR_OPTIONS.map((hours) => {
            const ms = hours * 60 * 60 * 1000;
            return (
              <button
                type="button"
                key={ms}
                className={
                  "play-setup-chip" + (timeControlMs === ms ? " play-setup-chip--selected" : "")
                }
                onClick={() => onSelectTimeControl(ms)}
                aria-pressed={timeControlMs === ms}
              >
                {hours} {t("game.hourUnit")}
              </button>
            );
          })}
        </div>
      </section>

      <section className="play-setup-section">
        <h3 className="play-setup-label">{t("game.playAs")}</h3>
        <div className="play-setup-side-grid">
          <button
            type="button"
            className={
              "play-setup-side" + (humanPlayer === "w" ? " play-setup-side--selected" : "")
            }
            onClick={() => onSelectHumanPlayer("w")}
            aria-pressed={humanPlayer === "w"}
          >
            <span
              className="play-setup-side-glyph play-setup-side-glyph--white"
              aria-hidden="true"
            />
            {t("game.white")}
          </button>
          <button
            type="button"
            className={
              "play-setup-side" + (humanPlayer === "b" ? " play-setup-side--selected" : "")
            }
            onClick={() => onSelectHumanPlayer("b")}
            aria-pressed={humanPlayer === "b"}
          >
            <span
              className="play-setup-side-glyph play-setup-side-glyph--black"
              aria-hidden="true"
            />
            {t("game.black")}
          </button>
        </div>
      </section>

      <button type="button" className="play-setup-start" onClick={onStart}>
        {t("game.start")}
      </button>
    </div>
  );
}
