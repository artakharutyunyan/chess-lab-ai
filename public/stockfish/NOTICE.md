# Stockfish engine

`stockfish-18-lite-single.js` / `.wasm` in this directory are the "lite,
single-threaded" WebAssembly build of the [Stockfish](https://stockfishchess.org/)
chess engine, distributed via the [`stockfish`](https://www.npmjs.com/package/stockfish)
npm package (build [Stockfish.js](https://github.com/nmrugg/stockfish.js) by
Nathan Rugg, based on [Stockfish](https://github.com/official-stockfish/Stockfish)
by T. Romstad, M. Costalba, J. Kiiski, G. Linscott and contributors).

Licensed under the [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html); see
`node_modules/stockfish/Copying.txt` for the full license text. Vendored here
(rather than imported at build time) so the engine and its `.wasm` binary ship
as static files the in-browser Worker can load directly — see
`src/components/Game/engine/stockfish.ts`.

To update: `npm install stockfish@latest`, then copy the new
`bin/stockfish-<version>-lite-single.js` and matching `.wasm` here, renaming to
match, and update the filename referenced in `stockfish.ts`.
