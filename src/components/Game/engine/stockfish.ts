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

export interface GetBestMoveOptions {
  skillLevel: number; // Stockfish's own 0-20 "Skill Level" UCI option.
  moveTimeMs: number;
}

class StockfishClient {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;

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

      worker.onerror = (event) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        this.dispose();
        reject(new Error(event.message || "Stockfish worker error"));
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
  // string ("e2e4", "e7e8q", ...). Rejects if the engine can't be started
  // (caller falls back to the local minimax bot) -- never resolves with a
  // "no move" value, since chooseBotMove's null (checkmate/stalemate) case
  // is handled by the caller checking legal moves before invoking this at
  // all, same as it does today.
  async getBestMove(fen: string, { skillLevel, moveTimeMs }: GetBestMoveOptions): Promise<string> {
    await this.init();
    const worker = this.worker;
    if (worker == null) throw new Error("Stockfish worker not available");

    return new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent<string>) => {
        if (typeof event.data !== "string") return;
        const match = event.data.match(/^bestmove (\S+)/);
        if (match == null) return;
        worker.removeEventListener("message", onMessage);
        if (match[1] === "(none)") {
          reject(new Error("Stockfish returned no move"));
        } else {
          resolve(match[1]);
        }
      };
      worker.addEventListener("message", onMessage);

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
