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

        this.tiles = bU.toCanvasTiles(this.board, boardCorner, tileSize);
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

        this.tiles.forEach(tile => {
            let tImg = tile.img;
            if (tile.grabbed) {
                image(tImg, mouseX - (tImg.width / 2), mouseY - (tImg.height / 2));
            } else {
                let xOffset = (this.tileSize - tImg.width)/2;
                let yOffset = (this.tileSize - tImg.height)/2;
                image(tImg, tile.x + xOffset, tile.y + yOffset);
            }
        });
    }

    mousePressed() {
        let boardPosition = this.positionToIndex(mouseX, mouseY);
        
        this.tiles.forEach(tile => {
            if (tile.xIndex === boardPosition.x && tile.yIndex === boardPosition.y) {
                tile.grabbed = true;
            }
        });
    }

    mouseReleased() {
        this.tiles.forEach(tile => {
            tile.grabbed = false;
        });
    }

    positionToIndex(x, y) {
        let posVector = p5.Vector.sub(createVector(x, y), this.boardCorner);
        
        let xIndex = Math.floor(posVector.x / this.tileSize);
        let yIndex = Math.floor(posVector.y / this.tileSize);

        return {
            x: xIndex,
            y: yIndex
        }
    }
    
}




