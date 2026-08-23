import React from "react";

import whiteKing from "../../../images/white_king.png";
import whiteBishop from "../../../images/white_bishop.png";
import whiteKnight from "../../../images/white_knight.png";
import whitePawn from "../../../images/white_pawn.png";
import whiteQueen from "../../../images/white_queen.png";
import whiteRock from "../../../images/white_rook.png";
import blackKing from "../../../images/black_king.png";
import blackBishop from "../../../images/black_bishop.png";
import blackKnight from "../../../images/black_knight.png";
import blackPawn from "../../../images/black_pawn.png";
import blackQueen from "../../../images/black_queen.png";
import blackRock from "../../../images/black_rook.png";

// Piece Classes ========================================
export class King {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.checked = 0;
    this.in_check = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteKing} className="piece" alt="white king"></img>
      ) : (
        <img src={blackKing} className="piece" alt="black king"></img>
      );
    this.ascii = player === "w" ? "k" : "K";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (row_diff === 1 && col_diff === -1) {
      return true;
    } else if (row_diff === 1 && col_diff === 0) {
      return true;
    } else if (row_diff === 1 && col_diff === 1) {
      return true;
    } else if (row_diff === 0 && col_diff === 1) {
      return true;
    } else if (row_diff === -1 && col_diff === 1) {
      return true;
    } else if (row_diff === -1 && col_diff === 0) {
      return true;
    } else if (row_diff === -1 && col_diff === -1) {
      return true;
    } else if (row_diff === 0 && col_diff === -1) {
      return true;
    } else if (row_diff === 0 && col_diff === 2) {
      return true;
    } else if (row_diff === 0 && col_diff === -2) {
      return true;
    }
    return false;
  }
}
export class Queen {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteQueen} className="piece" alt="white queen"></img>
      ) : (
        <img src={blackQueen} className="piece" alt="black queen"></img>
      );
    this.ascii = player === "w" ? "q" : "Q";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (row_diff > 0 && col_diff === 0) {
      return true;
    } else if (row_diff === 0 && col_diff > 0) {
      return true;
    } else if (row_diff < 0 && col_diff === 0) {
      return true;
    } else if (row_diff === 0 && col_diff < 0) {
      return true;
    } else if (row_diff === col_diff) {
      return true;
    } else if (row_diff === -col_diff) {
      return true;
    }
    return false;
  }
}
export class Knight {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteKnight} className="piece" alt="white knight"></img>
      ) : (
        <img src={blackKnight} className="piece" alt="black knight"></img>
      );
    this.ascii = player === "w" ? "n" : "N";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (row_diff === 1 && col_diff === -2) {
      return true;
    } else if (row_diff === 2 && col_diff === -1) {
      return true;
    } else if (row_diff === 2 && col_diff === 1) {
      return true;
    } else if (row_diff === 1 && col_diff === 2) {
      return true;
    } else if (row_diff === -1 && col_diff === 2) {
      return true;
    } else if (row_diff === -2 && col_diff === 1) {
      return true;
    } else if (row_diff === -2 && col_diff === -1) {
      return true;
    } else if (row_diff === -1 && col_diff === -2) {
      return true;
    }
    return false;
  }
}
export class Bishop {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteBishop} className="piece" alt="white bishop"></img>
      ) : (
        <img src={blackBishop} className="piece" alt="black bishop"></img>
      );
    this.ascii = player === "w" ? "b" : "B";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (row_diff === col_diff) {
      return true;
    } else if (row_diff === -col_diff) {
      return true;
    }
    return false;
  }
}
export class Pawn {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whitePawn} className="piece" alt="white pawn"></img>
      ) : (
        <img src={blackPawn} className="piece" alt="black pawn"></img>
      );
    this.ascii = player === "w" ? "p" : "P";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (this.player === "w") {
      if (col_diff === 0) {
        if (row_diff === 1 || row_diff === 2) return true;
      } else if (col_diff === -1 || col_diff === 1) {
        if (row_diff === 1) return true;
      }
    } else {
      if (col_diff === 0) {
        if (row_diff === -2 || row_diff === -1) return true;
      } else if (col_diff === -1 || col_diff === 1) {
        if (row_diff === -1) return true;
      }
    }
    return false;
  }
}
export class Rook {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon =
      player === "w" ? (
        <img src={whiteRock} className="piece" alt="white rock"></img>
      ) : (
        <img src={blackRock} className="piece" alt="black rock"></img>
      );
    this.ascii = player === "w" ? "r" : "R";
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    var start_row = 8 - Math.floor(start / 8);
    var start_col = (start % 8) + 1;
    var end_row = 8 - Math.floor(end / 8);
    var end_col = (end % 8) + 1;

    var row_diff = end_row - start_row;
    var col_diff = end_col - start_col;

    if (row_diff > 0 && col_diff === 0) {
      return true;
    } else if (row_diff === 0 && col_diff > 0) {
      return true;
    } else if (row_diff < 0 && col_diff === 0) {
      return true;
    } else if (row_diff === 0 && col_diff < 0) {
      return true;
    }
    return false;
  }
}
export class filler_piece {
  constructor(player) {
    this.player = player;
    this.highlight = 0;
    this.possible = 0;
    this.icon = null;
    this.ascii = null;
  }

  // function that defines piece's valid move shape
  can_move(start, end) {
    return false;
  }
}

// initialize the chess board
export function initializeBoard() {
  const squares = Array(64).fill(null);
  // black pawns
  for (let i = 8; i < 16; i++) {
    squares[i] = new Pawn("b");
  }
  // white pawns
  for (let i = 8 * 6; i < 8 * 6 + 8; i++) {
    squares[i] = new Pawn("w");
  }
  // black knights
  squares[1] = new Knight("b");
  squares[6] = new Knight("b");
  // white knights
  squares[56 + 1] = new Knight("w");
  squares[56 + 6] = new Knight("w");
  // black bishops
  squares[2] = new Bishop("b");
  squares[5] = new Bishop("b");
  // white bishops
  squares[56 + 2] = new Bishop("w");
  squares[56 + 5] = new Bishop("w");
  // black rooks
  squares[0] = new Rook("b");
  squares[7] = new Rook("b");
  // white rooks
  squares[56 + 0] = new Rook("w");
  squares[56 + 7] = new Rook("w");
  // black queen & king
  squares[3] = new Queen("b");
  squares[4] = new King("b");
  // white queen & king
  squares[56 + 3] = new Queen("w");
  squares[56 + 4] = new King("w");

  for (let i = 0; i < 64; i++) {
    if (squares[i] == null) squares[i] = new filler_piece(null);
  }

  return squares;
}
