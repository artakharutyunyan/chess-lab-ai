import { useTranslation } from "react-i18next";

import "./rulesPage.styles.css";
import { getPieceIcon, type PieceType } from "../Game/pieceSets";

const PIECE_ORDER: PieceType[] = ["king", "queen", "rook", "bishop", "knight", "pawn"];
const ASCII_BY_PIECE: Record<PieceType, string> = {
  king: "k",
  queen: "q",
  rook: "r",
  bishop: "b",
  knight: "n",
  pawn: "p",
};

// Renders a translated body string as one <p> per blank-line-separated
// paragraph -- keeps multi-paragraph sections to a single i18n key instead
// of one key per paragraph.
function Prose({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph, i) => (
        <p key={i} className="rules-body">
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function RulesPage() {
  const { t } = useTranslation();

  return (
    <div className="rules-page">
      <h1 className="rules-title">{t("rules.title")}</h1>
      <p className="rules-intro">{t("rules.intro")}</p>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.objective.title")}</h2>
        <Prose text={t("rules.objective.body")} />
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.boardSetup.title")}</h2>
        <Prose text={t("rules.boardSetup.body")} />
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.pieceMovementTitle")}</h2>
        <div className="rules-piece-grid">
          {PIECE_ORDER.map((piece) => (
            <div className="rules-piece-card" key={piece}>
              <span className="rules-piece-icon" aria-hidden="true">
                {getPieceIcon(ASCII_BY_PIECE[piece], "classic")}
              </span>
              <div>
                <h3 className="rules-piece-name">{t(`game.pieceType.${piece}`)}</h3>
                <p className="rules-piece-body">{t(`rules.pieces.${piece}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.specialMoves.title")}</h2>
        <div className="rules-subsection">
          <h3 className="rules-subheading">{t("rules.specialMoves.castling.title")}</h3>
          <Prose text={t("rules.specialMoves.castling.body")} />
        </div>
        <div className="rules-subsection">
          <h3 className="rules-subheading">{t("rules.specialMoves.enPassant.title")}</h3>
          <Prose text={t("rules.specialMoves.enPassant.body")} />
        </div>
        <div className="rules-subsection">
          <h3 className="rules-subheading">{t("rules.specialMoves.promotion.title")}</h3>
          <Prose text={t("rules.specialMoves.promotion.body")} />
        </div>
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.checkAndMate.title")}</h2>
        <Prose text={t("rules.checkAndMate.body")} />
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.draws.title")}</h2>
        <Prose text={t("rules.draws.body")} />
      </section>

      <section className="rules-section">
        <h2 className="rules-heading">{t("rules.notation.title")}</h2>
        <Prose text={t("rules.notation.body")} />
      </section>
    </div>
  );
}
