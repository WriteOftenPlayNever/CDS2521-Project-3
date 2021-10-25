import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";
import * as pU from "./piece.js";
import { players } from "./players.js";
import { Evaluator } from "./evaluator.js";



// export function newGame(pearlPlayer, onyxPlayer) {
//     let game = {
//         id: rs.guid(),
//         board: bU.newBoard(8, pearlPlayer, onyxPlayer),
//         pearl: pearlPlayer,
//         onyx: onyxPlayer
//     }

//     circle(200, 100, 0);

//     bU.initialise(game.board, pearlPlayer, onyxPlayer);

//     return game;
// }


export function newGame() {
    let pearlPlayer = players["Anne Passant"];
    let onyxPlayer = players["Json Smythe"];

    let game = {
        board: bU.newBoard(8, pearlPlayer, onyxPlayer),
        pearl: pearlPlayer,
        onyx: onyxPlayer
    }

    circle(200, 100, 0);

    bU.initialise(game.board, pearlPlayer, onyxPlayer);

    return game;
}



