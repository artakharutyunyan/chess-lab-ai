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

// Coarse piece values for move *ordering* only (not the leaf evaluation
// above, which already includes positional tables) -- just enough to rank
// "queen takes pawn" below "pawn takes queen".
const ORDERING_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

function orderingValue(ascii: string | null): number {
  if (ascii == null) return 0;
  return ORDERING_VALUE[ascii.toLowerCase()] ?? 0;
}

// Every legal move for `player`, captures first (highest-value victim,
// then lowest-value attacker, i.e. MVV-LVA) and quiet moves after in
// whatever order `starts`/`ends` (shuffled once by the caller) put them.
//
// This doesn't change what minimax finds -- alpha-beta still proves the
// exact same result either way -- it changes how much of the tree gets
// pruned before that result is proven. Trying the likely-best move (a
// capture) first tightens alpha/beta immediately, so the rest of that
// node's siblings get cut off faster. That's what makes the deeper
// iterative-deepening passes in chooseBotMove affordable at all.
function orderedLegalMoves(
  squares: Squares,
  player: Player,
  passantPos: number,
  castlingRights: CastlingRights,
  starts: number[],
  ends: number[]
): Move[] {
  const scored: { start: number; end: number; score: number }[] = [];
  for (const start of starts) {
    if (squares[start].ascii == null || squares[start].player !== player) continue;
    for (const end of ends) {
      if (!canMoveThere(start, end, squares, passantPos, castlingRights)) continue;
      const victim = orderingValue(squares[end].ascii);
      const attacker = orderingValue(squares[start].ascii);
      const score = victim > 0 ? 100 + victim * 10 - attacker : 0;
      scored.push({ start, end, score });
    }
  }
  // Stable sort: ties (all quiet moves score 0) keep the shuffled order
  // above, so quiet-move choice still varies from game to game.
  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ start, end }) => ({ start, end }));
}

// minimax algorithm with alpha-beta pruning for the chess bot
function minimax(
  depth: number,
  is_black_player: boolean,
  alpha: number,
  beta: number,
  squares: Squares,
  starts: number[],
  ends: number[],
  passant_pos: number,
  castlingRights: CastlingRights,
  deadline: number
): number {
  if (depth === 0) {
    return evaluateBlack(squares);
  }

  const mover: Player = is_black_player ? "b" : "w";
  const moves = orderedLegalMoves(squares, mover, passant_pos, castlingRights, starts, ends);
  if (moves.length === 0) {
    // No legal move (checkmate or stalemate). Not otherwise scored
    // specially here -- pre-existing behavior -- just evaluate as-is.
    return evaluateBlack(squares);
  }

  let best_value = is_black_player ? -9999 : 9999;
  // iterate through the possible moves, best-looking (captures) first;
  // if the move being analyzed is black's turn, the value maximizes
  // best_value, but if white's turn, the value minimizes best_value
  for (const { start, end } of moves) {
    // Time's up: stop exploring this node's remaining siblings and
    // return whatever's been found so far. Checked once per move (not
    // per leaf) -- cheap relative to the move itself, and still fires
    // often enough that a single node can't run away with the clock.
    if (performance.now() >= deadline) break;

    const test_squares = squares.slice();
    // make the move on test board
    const test_squares_2 = makeMove(test_squares, start, end, passant_pos).slice();
    // en passant helper
    let passant = 65;
    if (
      test_squares[start].ascii === (is_black_player ? "P" : "p") &&
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
      starts,
      ends,
      passant,
      castlingRights,
      deadline
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

  return best_value;
}

export interface DifficultyPreset {
  maxDepth: number;
  timeBudgetMs: number;
}

// See docs/PLAY-PAGE-SPEC.md sibling discussion -- depth is the only real
// strength lever this engine has, and depth cost grows fast with no
// transposition table. These were picked from measured search times
// (see chooseBotMove's iterative deepening below) so "hard" stays
// responsive rather than picking a depth and hoping.
export const DIFFICULTY_PRESETS: Record<"easy" | "medium" | "hard", DifficultyPreset> = {
  easy: { maxDepth: 1, timeBudgetMs: 50 },
  medium: { maxDepth: 3, timeBudgetMs: 300 },
  hard: { maxDepth: 6, timeBudgetMs: 1500 },
};

export interface ChooseBotMoveArgs {
  squares: Squares;
  // Iterative deepening: search depth 1, then 2, then 3..., stopping once
  // either maxDepth is reached or timeBudgetMs has elapsed (checked
  // between passes, not mid-search -- so the actual worst case is bounded
  // by one extra pass's cost, not to the millisecond, but never spirals
  // the way a bare fixed depth could).
  maxDepth: number;
  timeBudgetMs: number;
  passantPos: number;
  castlingRights: CastlingRights;
  avoidMove: Move | null;
  // Which side the bot is playing. evaluateBlack's score is positive-for-
  // black/negative-for-white, so a black bot maximizes it and a white bot
  // minimizes it -- everything below just mirrors on that axis.
  botColor: Player;
}

// Choose the bot's move for the given position. `avoidMove` (a
// {start, end} pair), when given, is skipped as a candidate unless it's
// the only legal move available -- used by the caller to break simple
// back-and-forth repetition. Returns {start, end}, or null if the bot has
// no legal move (checkmate/stalemate).
export function chooseBotMove({
  squares,
  maxDepth,
  timeBudgetMs,
  passantPos,
  castlingRights,
  avoidMove,
  botColor,
}: ChooseBotMoveArgs): Move | null {
  const isBlackBot = botColor === "b";
  const starts = shuffle(Array.from({ length: 64 }, (_, i) => i));
  const ends = shuffle(Array.from({ length: 64 }, (_, i) => i));

  let rootMoves = orderedLegalMoves(squares, botColor, passantPos, castlingRights, starts, ends);
  if (rootMoves.length > 1 && avoidMove) {
    const filtered = rootMoves.filter(
      (m) => !(m.start === avoidMove.start && m.end === avoidMove.end)
    );
    if (filtered.length > 0) rootMoves = filtered;
  }
  if (rootMoves.length === 0) return null;

  let bestMove: Move = rootMoves[0];
  const deadline = performance.now() + timeBudgetMs;

  for (let depth = 1; depth <= maxDepth; depth++) {
    // Always complete depth 1 (cheap, and guarantees a real move even if
    // the budget is already gone) -- only the deeper passes are optional.
    if (depth > 1 && performance.now() >= deadline) break;

    let bestValue = isBlackBot ? -9999 : 9999;
    let bestMoveThisDepth = rootMoves[0];
    const scored: { start: number; end: number; value: number }[] = [];

    for (const { start, end } of rootMoves) {
      // Same rationale as inside minimax: stop once time is up rather
      // than committing to searching every remaining root candidate.
      // rootMoves[0] (this depth's or the previous depth's best-so-far)
      // is always a safe fallback, so bailing here never leaves bestMove
      // unset.
      if (performance.now() >= deadline) break;

      const test_squares = squares.slice();
      const test_squares_2 = makeMove(test_squares, start, end, passantPos).slice();

      let passantPosAfter = 65;
      const botPawnAscii = isBlackBot ? "P" : "p";
      const botHomeRankMin = isBlackBot ? 8 : 48;
      const botHomeRankMax = isBlackBot ? 15 : 55;
      const botDoubleStep = isBlackBot ? 16 : -16;
      if (
        test_squares[start].ascii === botPawnAscii &&
        start >= botHomeRankMin &&
        start <= botHomeRankMax &&
        end - start === botDoubleStep
      ) {
        passantPosAfter = end;
      }

      // board evaluation using the mini_max algorithm by looking ahead
      // (the opponent moves next, so the recursion starts on their ply)
      const value = minimax(
        depth - 1,
        !isBlackBot,
        -1000,
        1000,
        test_squares_2,
        starts,
        ends,
        passantPosAfter,
        castlingRights,
        deadline
      );
      scored.push({ start, end, value });
      const better = isBlackBot ? value >= bestValue : value <= bestValue;
      if (better) {
        bestValue = value;
        bestMoveThisDepth = { start, end };
      }
    }

    bestMove = bestMoveThisDepth;
    // Best-move-first for the next (deeper) pass: the move that looked
    // best at this depth is very likely still near-best one ply deeper,
    // so trying it first prunes the rest of that pass fast (this is
    // where most of iterative deepening's speedup actually comes from).
    scored.sort((a, b) => (isBlackBot ? b.value - a.value : a.value - b.value));
    rootMoves = scored.map(({ start, end }) => ({ start, end }));

    if (performance.now() >= deadline) break;
  }

  return bestMove;
}
