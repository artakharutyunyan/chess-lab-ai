import { Queen, filler_piece, type Player, type Squares } from "./pieces";

// Every *_has_moved flag is 0 or 1, matching the Board state fields they're
// built from (this.state.white_king_has_moved etc.) -- kept as number
// rather than boolean to mirror that shape exactly.
export interface CastlingRights {
  whiteKingHasMoved: number;
  blackKingHasMoved: number;
  leftWhiteRookHasMoved: number;
  rightWhiteRookHasMoved: number;
  leftBlackRookHasMoved: number;
  rightBlackRookHasMoved: number;
}

// apply a move to a squares array and return the resulting array. Pieces
// are mutated in place (matching the rest of this engine's convention) so
// callers that need an independent snapshot must clone first.
export function makeMove(
  squares: Squares,
  start: number,
  end: number,
  passantPos: number
): Squares {
  const copy_squares = squares.slice();
  // castling
  var isKing =
    copy_squares[start].ascii === "k" || copy_squares[start].ascii === "K";
  if (isKing && Math.abs(end - start) === 2) {
    if (end === (copy_squares[start].ascii === "k" ? 62 : 6)) {
      copy_squares[end - 1] = copy_squares[end + 1];
      copy_squares[end - 1].highlight = 1;
      copy_squares[end + 1] = new filler_piece(null);
      copy_squares[end + 1].highlight = 1;
    } else if (end === (copy_squares[start].ascii === "k" ? 58 : 2)) {
      copy_squares[end + 1] = copy_squares[end - 2];
      copy_squares[end + 1].highlight = 1;
      copy_squares[end - 2] = new filler_piece(null);
      copy_squares[end - 2].highlight = 1;
    }
  }

  // en passant
  if (copy_squares[start].ascii?.toLowerCase() === "p") {
    if (end - start === -7 || end - start === 9) {
      // white going up to the right
      if (start + 1 === passantPos)
        copy_squares[start + 1] = new filler_piece(null);
    } else if (end - start === -9 || end - start === 7) {
      // white going up to the left
      if (start - 1 === passantPos)
        copy_squares[start - 1] = new filler_piece(null);
    }
  }

  // make the move
  copy_squares[end] = copy_squares[start];
  copy_squares[end].highlight = 1;
  copy_squares[start] = new filler_piece(null);
  copy_squares[start].highlight = 1;

  // pawn promotion
  if (copy_squares[end].ascii === "p" && end >= 0 && end <= 7) {
    copy_squares[end] = new Queen("w");
    copy_squares[end].highlight = 1;
  }
  if (copy_squares[end].ascii === "P" && end >= 56 && end <= 63) {
    copy_squares[end] = new Queen("b");
    copy_squares[end].highlight = 1;
  }

  return copy_squares;
}

// returns true if castling is allowed
export function castlingAllowed(
  start: number,
  end: number,
  squares: Squares,
  castlingRights: CastlingRights
): boolean {
  const copy_squares = squares.slice();
  var player = copy_squares[start].player;
  var delta_pos = end - start;
  if (start !== (player === "w" ? 60 : 4)) return false;
  if (
    (delta_pos === 2
      ? copy_squares[end + 1].ascii
      : copy_squares[end - 2].ascii) !== (player === "w" ? "r" : "R")
  )
    return false;
  if (
    (player === "w"
      ? castlingRights.whiteKingHasMoved
      : castlingRights.blackKingHasMoved) !== 0
  )
    return false;
  if (player === "w") {
    if (
      (delta_pos === 2
        ? castlingRights.rightWhiteRookHasMoved
        : castlingRights.leftWhiteRookHasMoved) !== 0
    )
      return false;
  } else if (player === "b") {
    if (
      (delta_pos === 2
        ? castlingRights.rightBlackRookHasMoved
        : castlingRights.leftBlackRookHasMoved) !== 0
    )
      return false;
  }

  return true;
}
// returns true if a piece is trying to skip over another piece
export function blockersExist(
  start: number,
  end: number,
  squares: Squares
): boolean {
  var start_row = 8 - Math.floor(start / 8);
  var start_col = (start % 8) + 1;
  var end_row = 8 - Math.floor(end / 8);
  var end_col = (end % 8) + 1;
  let row_diff = end_row - start_row;
  let col_diff = end_col - start_col;
  let row_ctr = 0;
  let col_ctr = 0;
  const copy_squares = squares.slice();

  // return true if the piece in question is skipping over a piece
  while (col_ctr !== col_diff || row_ctr !== row_diff) {
    let position =
      64 - start_row * 8 + -8 * row_ctr + (start_col - 1 + col_ctr);
    if (
      copy_squares[position].ascii != null &&
      copy_squares[position] !== copy_squares[start]
    )
      return true;
    if (col_ctr !== col_diff) {
      if (col_diff > 0) {
        ++col_ctr;
      } else {
        --col_ctr;
      }
    }
    if (row_ctr !== row_diff) {
      if (row_diff > 0) {
        ++row_ctr;
      } else {
        --row_ctr;
      }
    }
  }
  return false;
}
// return true if pawn is not breaking any of its rules
export function goodPawn(
  start: number,
  end: number,
  squares: Squares,
  passantPos: number
): boolean {
  var start_row = 8 - Math.floor(start / 8);
  var start_col = (start % 8) + 1;
  var end_row = 8 - Math.floor(end / 8);
  var end_col = (end % 8) + 1;
  var row_diff = end_row - start_row;
  var col_diff = end_col - start_col;
  const copy_squares = squares.slice();

  // only allow 2 space move if the pawn is in the start position
  if (row_diff === 2 || row_diff === -2) {
    if (copy_squares[start].player === "w" && (start < 48 || start > 55))
      return false;
    if (copy_squares[start].player === "b" && (start < 8 || start > 15))
      return false;
  }
  // cannot move up/down if there is a piece
  if (copy_squares[end].ascii != null) {
    if (col_diff === 0) return false;
  }
  // cannot move diagonally if there is no piece to capture UNLESS it's en passant
  if (row_diff === 1 && col_diff === 1) {
    // white going up and right
    if (copy_squares[end].ascii == null) {
      if (copy_squares[start + 1].ascii !== "P" || passantPos !== start + 1)
        return false;
    }
  } else if (row_diff === 1 && col_diff === -1) {
    // white going up and left
    if (copy_squares[end].ascii == null) {
      if (copy_squares[start - 1].ascii !== "P" || passantPos !== start - 1)
        return false;
    }
  } else if (row_diff === -1 && col_diff === 1) {
    // black going down and right
    if (copy_squares[end].ascii == null) {
      if (copy_squares[start + 1].ascii !== "p" || passantPos !== start + 1)
        return false;
    }
  } else if (row_diff === -1 && col_diff === -1) {
    // black going down and left
    if (copy_squares[end].ascii == null) {
      if (copy_squares[start - 1].ascii !== "p" || passantPos !== start - 1)
        return false;
    }
  }

  return true;
}
// return true if move from start to end is illegal
export function invalidMove(
  start: number,
  end: number,
  squares: Squares,
  passantPos: number,
  castlingRights: CastlingRights
): boolean {
  const copy_squares = squares.slice();
  // if the piece is a bishop, queen, rook, or pawn,
  // it cannot skip over pieces
  var bqrpk =
    copy_squares[start].ascii?.toLowerCase() === "r" ||
    copy_squares[start].ascii?.toLowerCase() === "q" ||
    copy_squares[start].ascii?.toLowerCase() === "b" ||
    copy_squares[start].ascii?.toLowerCase() === "p" ||
    copy_squares[start].ascii?.toLowerCase() === "k";
  let invalid =
    bqrpk === true && blockersExist(start, end, copy_squares) === true;
  if (invalid) return invalid;
  // checking for certain rules regarding the pawn
  var pawn = copy_squares[start].ascii?.toLowerCase() === "p";
  invalid =
    pawn === true && goodPawn(start, end, copy_squares, passantPos) === false;
  if (invalid) return invalid;
  // checking for if castling is allowed
  var king = copy_squares[start].ascii?.toLowerCase() === "k";
  if (king && Math.abs(end - start) === 2)
    invalid =
      castlingAllowed(start, end, copy_squares, castlingRights) === false;

  return invalid;
}
// returns true if there are any possible moves
export function canMoveThere(
  start: number,
  end: number,
  squares: Squares,
  passantPos: number,
  castlingRights: CastlingRights
): boolean {
  const copy_squares = squares.slice();
  if (start === end)
    // cannot move to the position you're already sitting in
    return false;

  // player cannot capture her own piece
  // and piece must be able to physically move from start to end
  var player = copy_squares[start].player;
  if (
    player === copy_squares[end].player ||
    copy_squares[start].can_move(start, end) === false
  )
    return false;
  // player cannot make an invalid move
  if (
    invalidMove(start, end, copy_squares, passantPos, castlingRights) === true
  )
    return false;

  // cannot castle if in check
  var cant_castle =
    copy_squares[start].ascii === (player === "w" ? "k" : "K") &&
    Math.abs(end - start) === 2 &&
    inCheck(player as Player, copy_squares, passantPos, castlingRights);
  if (cant_castle) return false;

  // king cannot castle through check
  if (
    copy_squares[start].ascii === (player === "w" ? "k" : "K") &&
    Math.abs(end - start) === 2
  ) {
    var delta_pos = end - start;
    const test_squares = squares.slice();
    test_squares[start + (delta_pos === 2 ? 1 : -1)] = test_squares[start];
    test_squares[start] = new filler_piece(null);
    if (inCheck(player as Player, test_squares, passantPos, castlingRights))
      return false;
  }

  // player cannot put or keep herself in check
  const check_squares = squares.slice();
  check_squares[end] = check_squares[start];
  check_squares[start] = new filler_piece(null);
  if (check_squares[end].ascii === "p" && end >= 0 && end <= 7) {
    check_squares[end] = new Queen("w");
  } else if (check_squares[end].ascii === "P" && end >= 56 && end <= 63) {
    check_squares[end] = new Queen("b");
  }
  if (
    inCheck(player as Player, check_squares, passantPos, castlingRights) ===
    true
  )
    return false;

  return true;
}

// returns true if player is in check
export function inCheck(
  player: Player,
  squares: Squares,
  passantPos: number,
  castlingRights: CastlingRights
): boolean {
  let king = player === "w" ? "k" : "K";
  let position_of_king: number | null = null;
  const copy_squares = squares.slice();
  for (let i = 0; i < 64; i++) {
    if (copy_squares[i].ascii === king) {
      position_of_king = i;
      break;
    }
  }

  // traverse through the board and determine
  // any of the opponent's pieces can legally take the player's king
  for (let i = 0; i < 64; i++) {
    if (copy_squares[i].player !== player) {
      if (
        copy_squares[i].can_move(i, position_of_king as number) === true &&
        invalidMove(
          i,
          position_of_king as number,
          copy_squares,
          passantPos,
          castlingRights
        ) === false
      )
        return true;
    }
  }
  return false;
}
// return true if player is in stalemate
export function isStalemate(
  player: Player,
  squares: Squares,
  passantPos: number,
  castlingRights: CastlingRights
): boolean {
  if (inCheck(player, squares, passantPos, castlingRights)) return false;

  // if there is even only 1 way to move her piece,
  // the player is not in stalemate
  for (let i = 0; i < 64; i++) {
    if (squares[i].player === player) {
      for (let j = 0; j < 64; j++) {
        if (canMoveThere(i, j, squares, passantPos, castlingRights))
          return false;
      }
    }
  }
  return true;
}
// return true if player is in checkmate
export function isCheckmate(
  player: Player,
  squares: Squares,
  passantPos: number,
  castlingRights: CastlingRights
): boolean {
  if (!inCheck(player, squares, passantPos, castlingRights)) return false;
  // if there is even only 1 way to move her piece,
  // the player is not in checkmate
  for (let i = 0; i < 64; i++) {
    if (squares[i].player === player) {
      for (let j = 0; j < 64; j++) {
        if (canMoveThere(i, j, squares, passantPos, castlingRights))
          return false;
      }
    }
  }
  return true;
}
