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


export class Game {
    constructor(pearlPlayer, onyxPlayer, boardCorner, tileSize) {
        this.pearlPlayer = pearlPlayer;
        this.onyxPlayer = onyxPlayer;
        this.boardCorner = boardCorner;
        this.tileSize = tileSize;
        this.board = bU.newBoard(8, pearlPlayer, onyxPlayer);

        bU.initialise(this.board, pearlPlayer, onyxPlayer);
    }

    drawToCanvas() {
        noStroke();
        let gameBoard = this.board.gameBoard;
        for (let x = gameBoard.length - 1; x > -1; x--) {
            for (let y = 0; y < gameBoard.length; y++) {
                if ((x + y) % 2 === 0) {
                    fill(255, 218, 179);
                    square(this.boardCorner.x + (x * this.tileSize), this.boardCorner.y + (y * this.tileSize), this.tileSize);
                } else {
                    fill(255);
                    square(this.boardCorner.x + (x * this.tileSize), this.boardCorner.y + (y * this.tileSize), this.tileSize);
                }
            }
        }

        bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize).forEach(tile => {
            loadImage(tile.img, tImg => {
                image(tImg, tile.x, tile.y, 0, this.tileSize * 0.85);
            });
        });
    }
}




