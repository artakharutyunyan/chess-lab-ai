import { canMoveThere, makeMove, type CastlingRights } from "./rules";
import type { Piece, Player, Squares } from "./pieces";

export interface Move {
  start: number;
  end: number;
}

// Fisher-Yates shuffle
function shuffle(passed_in_array: number[]): number[] {
  const array = passed_in_array.slice();
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}
// function to reverse an array
function reverseArray<T>(array: T[]): T[] {
  return array.slice().reverse();
}
// return value of a piece
function getPieceValue(piece: Piece, position: number): number {
  let pieceValue = 0;
  if (piece.ascii == null) return 0;

  // these arrays help adjust the piece's value
  // depending on where the piece is on the board
  var pawnEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
    [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
    [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
    [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ];
  var pawnEvalBlack = reverseArray(pawnEvalWhite);

  var knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
    [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ];

  var bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ];
  var bishopEvalBlack = reverseArray(bishopEvalWhite);

  var rookEvalWhite = [
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
  ];
  var rookEvalBlack = reverseArray(rookEvalWhite);

  var evalQueen = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ];

  var kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
  ];
  var kingEvalBlack = reverseArray(kingEvalWhite);

  let x = Math.floor(position / 8);
  let y = position % 8;

  switch (piece.ascii.toLowerCase()) {
    case "p":
      pieceValue =
        100 +
        10 * (piece.ascii === "p" ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
      break;
    case "r":
      pieceValue =
        525 +
        10 * (piece.ascii === "r" ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
      break;
    case "n":
      pieceValue = 350 + 10 * knightEval[y][x];
      break;
    case "b":
      pieceValue =
        350 +
        10 *
          (piece.ascii === "b" ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
      break;
    case "q":
      pieceValue = 1000 + 10 * evalQueen[y][x];
      break;
    case "k":
      pieceValue =
        10000 +
        10 * (piece.ascii === "k" ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      break;
    default:
      pieceValue = 0;
      break;
  }
  return piece.player === "b" ? pieceValue : -pieceValue;
}

// calculate black's status using piece values
function evaluateBlack(squares: Squares): number {
  let total_eval = 0;
  for (let i = 0; i < 64; i++) total_eval += getPieceValue(squares[i], i);
  return total_eval;
}

// minimax algorithm with alpha-beta pruning for the chess bot
function minimax(
  depth: number,
  is_black_player: boolean,
  alpha: number,
  beta: number,
  squares: Squares,
  RA_of_starts: number[],
  RA_of_ends: number[],
  passant_pos: number,
  castlingRights: CastlingRights
): number {
  const copy_squares = squares.slice();
  if (depth === 0) {
    return evaluateBlack(copy_squares);
  }

  let best_value = is_black_player ? -9999 : 9999;
  // iterate through the possible start positions
  for (let i = 0; i < 64; i++) {
    let start = RA_of_starts[i];
    let isPlayerPiece =
      copy_squares[start].ascii != null &&
      copy_squares[start].player === (is_black_player ? "b" : "w");

    // start should be the position of a piece owned by the player
    if (isPlayerPiece) {
      /* iterate through the possible end positions for each possible start position
       * and use recursion to see what the value of each possible move will be a few moves
       * down the road. if the move being analyzed is black's turn, the value will maximize
       * best_value; but if the move being analyzed is white's turn, the value will minimize
       * best_value
       */
      for (let j = 0; j < 64; j++) {
        let end = RA_of_ends[j];
        if (
          canMoveThere(
            start,
            end,
            copy_squares,
            passant_pos,
            castlingRights
          ) === true
        ) {
          const test_squares = squares.slice();
          // make the move on test board
          const test_squares_2 = makeMove(
            test_squares,
            start,
            end,
            passant_pos
          ).slice();
          // en passant helper
          var passant = 65;
          if (
            test_squares[end].ascii === (is_black_player ? "P" : "p") &&
            start >= (is_black_player ? 8 : 48) &&
            start <= (is_black_player ? 15 : 55) &&
            end - start === (is_black_player ? 16 : -16)
          ) {
            passant = end;
          }

          // black player maximizes value, white player minimizes value
          let value = minimax(
            depth - 1,
            !is_black_player,
            alpha,
            beta,
            test_squares_2,
            RA_of_starts,
            RA_of_ends,
            passant,
            castlingRights
          );
          if (is_black_player) {
            if (value > best_value) best_value = value;
            alpha = Math.max(alpha, best_value); //alpha-beta pruning
            if (best_value >= beta) return best_value;
          } else {
            if (value < best_value) best_value = value;
            beta = Math.min(beta, best_value); //alpha-beta pruning
            if (best_value <= alpha) return best_value;
          }
        }
      }
    }
  }

  return best_value;
}

export interface ChooseBotMoveArgs {
  squares: Squares;
  depth: number;
  passantPos: number;
  castlingRights: CastlingRights;
  avoidMove: Move | null;
  // Which side the bot is playing. evaluateBlack's score is positive-for-
  // black/negative-for-white, so a black bot maximizes it and a white bot
  // minimizes it -- everything below just mirrors on that axis.
  botColor: Player;
}

// Choose the bot's move for the given position by searching `depth` plies
// ahead with minimax. `avoidMove` (a {start, end} pair), when given, is
// skipped as a candidate unless it's the only legal move available -- used
// by the caller to break simple back-and-forth repetition. Returns
// {start, end}, or null if the bot has no legal move (checkmate/stalemate).
export function chooseBotMove({
  squares,
  depth,
  passantPos,
  castlingRights,
  avoidMove,
  botColor,
}: ChooseBotMoveArgs): Move | null {
  const isBlackBot = botColor === "b";
  const copy_squares = squares.slice();
  let rand_start = 100;
  let rand_end = 100;
  let RA_of_starts: number[] = [];
  let RA_of_ends: number[] = [];
  for (let i = 0; i < 64; i++) {
    RA_of_starts.push(i);
    RA_of_ends.push(i);
  }
  RA_of_starts = shuffle(RA_of_starts);
  RA_of_ends = shuffle(RA_of_ends);

  // create array of possible moves
  let moves: number[] = [];
  for (let i = 0; i < 64; i++) {
    let start = RA_of_starts[i];
    let isBotPiece =
      copy_squares[start].ascii != null && copy_squares[start].player === botColor;
    if (isBotPiece) {
      for (let j = 0; j < 64; j++) {
        let end = RA_of_ends[j];
        if (
          canMoveThere(start, end, copy_squares, passantPos, castlingRights) ===
          true
        ) {
          moves.push(start);
          moves.push(end);
        }
      }
    }
  }

  let best_value = isBlackBot ? -9999 : 9999;
  /* iterate through the possible movements and choose the movement from start to end that results in the best
   * position for the bot in terms of value calculated by evaluateBlack; minimax algo lets bot look ahead a few
   * moves and thereby pick the move that results in the best value in the long run
   */
  for (let i = 0; i < moves.length; i += 2) {
    let start = moves[i];
    let end = moves[i + 1];
    // 3-fold repetiton by bot NOT ALLOWED if there are other move options
    if (
      moves.length > 2 &&
      avoidMove &&
      start === avoidMove.start &&
      end === avoidMove.end
    ) {
      continue;
    }

    const test_squares = squares.slice();
    // make the move
    const test_squares_2 = makeMove(
      test_squares,
      start,
      end,
      passantPos
    ).slice();
    // en passant helper
    var passant_pos_after = 65;
    const botPawnAscii = isBlackBot ? "P" : "p";
    const botHomeRankMin = isBlackBot ? 8 : 48;
    const botHomeRankMax = isBlackBot ? 15 : 55;
    const botDoubleStep = isBlackBot ? 16 : -16;
    if (
      test_squares[start].ascii === botPawnAscii &&
      start >= botHomeRankMin &&
      start <= botHomeRankMax &&
      end - start === botDoubleStep
    )
      passant_pos_after = end;

    // board evaluation using mini_max algorithm by looking at future turns
    // (the opponent moves next, so the recursion starts on their ply)
    let board_eval = minimax(
      depth - 1,
      !isBlackBot,
      -1000,
      1000,
      test_squares_2,
      RA_of_starts,
      RA_of_ends,
      passant_pos_after,
      castlingRights
    );
    const better = isBlackBot ? board_eval >= best_value : board_eval <= best_value;
    if (better) {
      best_value = board_eval;
      rand_start = start;
      rand_end = end;
    }
  }

  // rand_end === 100 indicates that the bot is in checkmate/stalemate
  if (rand_end === 100) return null;
  return { start: rand_start, end: rand_end };
}
