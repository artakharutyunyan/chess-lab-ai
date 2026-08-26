# Stockfish engine

`stockfish-18-lite-single.js` / `.wasm` in this directory are the "lite,
single-threaded" WebAssembly build of the [Stockfish](https://stockfishchess.org/)
chess engine, distributed via version `18.0.8` of the
[`stockfish`](https://www.npmjs.com/package/stockfish) npm package (build
[Stockfish.js](https://github.com/nmrugg/stockfish.js) v18 by Nathan Rugg,
based on [Stockfish](https://github.com/official-stockfish/Stockfish) by
T. Romstad, M. Costalba, J. Kiiski, G. Linscott and contributors).

Licensed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html);
the full license text ships alongside the binaries in this same directory as
[`COPYING`](./COPYING) (copied from the npm package's `Copying.txt`, not
just linked from `node_modules`, since that's what actually ships to
end users). Vendored here (rather than imported at build time) so the
engine and its `.wasm` binary ship as static files the in-browser Worker can
load directly — see `src/components/Game/engine/stockfish.ts`.

**Corresponding source**: this build's prebuilt binaries come from the
`stockfish` npm package; the source that produced them is public at
[nmrugg/stockfish.js](https://github.com/nmrugg/stockfish.js) (the JS/WASM
build tooling, tag/release matching package version `18.0.8`) and
[official-stockfish/Stockfish](https://github.com/official-stockfish/Stockfish)
(the underlying chess engine, Stockfish 18). Neither this app's own source
nor its build process modifies the engine — it's used as-is.

To update: `npm install stockfish@latest`, then copy the new
`bin/stockfish-<version>-lite-single.js` and matching `.wasm` here, renaming
to match; copy the new `Copying.txt` over `COPYING`; and update the filename
referenced in `stockfish.ts` along with the version/links above.
