// Thin UCI wrapper around the vendored Stockfish engine (see
// public/stockfish/NOTICE.md for what's vendored and why). Runs the engine
// in a Web Worker so a deep search never blocks the UI thread. One instance
// is reused for the lifetime of the app (see the module-level singleton
// below) -- spinning up a fresh ~7MB WASM worker per move would be slow and
// wasteful.

const ENGINE_URL = "/stockfish/stockfish-18-lite-single.js";

// How long to wait for the worker to load the WASM binary and answer
// "readyok" before giving up and letting the caller fall back to the local
// minimax bot (engine/ai.ts). A cold WASM compile is usually well under this
// on any modern device; a browser that can't run WASM at all would otherwise
// hang forever.
const INIT_TIMEOUT_MS = 8000;

// Extra time given to a single search beyond the requested `movetime`
// before giving up on it -- covers postMessage/compute overhead, not just
// the engine's own thinking time.
const SEARCH_TIMEOUT_GRACE_MS = 5000;

export interface GetBestMoveOptions {
  skillLevel: number; // Stockfish's own 0-20 "Skill Level" UCI option.
  moveTimeMs: number;
}

class StockfishClient {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  // Rejects whichever getBestMove call is currently in flight, if any --
  // set only while a search is outstanding. Lets the worker's permanent
  // onerror handler (wired below, once init has already settled) fail that
  // call instead of leaving it hanging forever on a crashed worker.
  private pendingSearchReject: ((err: Error) => void) | null = null;

  private init(): Promise<void> {
    if (this.ready) return this.ready;

    this.ready = new Promise((resolve, reject) => {
      let settled = false;
      const timeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        this.dispose();
        reject(new Error("Stockfish init timed out"));
      }, INIT_TIMEOUT_MS);

      let worker: Worker;
      try {
        worker = new Worker(ENGINE_URL);
      } catch (err) {
        window.clearTimeout(timeout);
        // Reset this.ready (not just reject it) so a later call retries
        // instead of replaying this same rejection for the rest of the
        // session -- matters in environments where Worker exists but this
        // particular construction failed for a transient reason.
        this.dispose();
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      // Stays wired for the worker's whole life, not just until init
      // settles -- a crash mid-search must fail whichever getBestMove call
      // is currently waiting, not just a still-pending init. Without this,
      // a worker that dies *after* becoming ready left getBestMove's own
      // promise with nothing listening for the error, so it never
      // resolved or rejected and the bot's turn hung forever instead of
      // falling back to the local minimax bot.
      worker.onerror = (event) => {
        const message = event.message || "Stockfish worker error";
        if (!settled) {
          settled = true;
          window.clearTimeout(timeout);
          this.dispose();
          reject(new Error(message));
          return;
        }
        this.dispose();
        this.pendingSearchReject?.(new Error(message));
        this.pendingSearchReject = null;
      };

      worker.onmessage = (event: MessageEvent<string>) => {
        if (settled) return;
        if (typeof event.data === "string" && event.data.trim() === "uciok") {
          worker.postMessage("isready");
        } else if (typeof event.data === "string" && event.data.trim() === "readyok") {
          settled = true;
          window.clearTimeout(timeout);
          this.worker = worker;
          resolve();
        }
      };

      worker.postMessage("uci");
    });

    return this.ready;
  }

  private dispose(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }

  // Ask the engine for its best move in `fen`. Resolves with a UCI move
  // string ("e2e4", "e7e8q", ...). Rejects if the engine can't be started,
  // errors mid-search, or doesn't answer within moveTimeMs plus a grace
  // window (caller falls back to the local minimax bot in every case) --
  // never resolves with a "no move" value, since chooseBotMove's null
  // (checkmate/stalemate) case is handled by the caller checking legal
  // moves before invoking this at all, same as it does today.
  async getBestMove(fen: string, { skillLevel, moveTimeMs }: GetBestMoveOptions): Promise<string> {
    await this.init();
    const worker = this.worker;
    if (worker == null) throw new Error("Stockfish worker not available");

    return new Promise((resolve, reject) => {
      let settled = false;

      const finish = (err: Error | null, move?: string) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        worker.removeEventListener("message", onMessage);
        this.pendingSearchReject = null;
        if (err) reject(err);
        else resolve(move as string);
      };

      // Bounds the worst case (a hung/unresponsive worker that never
      // errors and never answers) so a bot turn can never hang forever --
      // Stockfish should answer close to moveTimeMs regardless of skill
      // level, so a generous grace window over that is a safe cap rather
      // than a tight one.
      const timeout = window.setTimeout(() => {
        finish(new Error("Stockfish search timed out"));
      }, moveTimeMs + SEARCH_TIMEOUT_GRACE_MS);

      const onMessage = (event: MessageEvent<string>) => {
        if (typeof event.data !== "string") return;
        const match = event.data.match(/^bestmove (\S+)/);
        if (match == null) return;
        if (match[1] === "(none)") {
          finish(new Error("Stockfish returned no move"));
        } else {
          finish(null, match[1]);
        }
      };
      worker.addEventListener("message", onMessage);
      this.pendingSearchReject = (err) => finish(err);

      worker.postMessage("ucinewgame");
      worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go movetime ${moveTimeMs}`);
    });
  }
}

// Module-level singleton: every caller (execute_bot in Board.jsx) shares one
// worker/one warm WASM instance rather than paying init cost per move.
export const stockfish = new StockfishClient();
