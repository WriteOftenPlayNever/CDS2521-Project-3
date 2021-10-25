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

    handleGameEvent(event) {
        let eventCount = this.board.eventList.length;

        bU.doEvent(this.board, event);

        for(let i = eventCount; i < this.board.eventList.length; i++) {
            switch (event.type) {
                case evU.EVENT_TYPES.CREATE:
                    this.tiles = bU.toCanvasTiles(this.board, boardCorner, tileSize);

                    this.tiles.forEach(tile => {
                        if (tile.xIndex === event.to[0], tile.yIndex === event.to[1]) {
                            for (let t = 0; t < 100; t++) {
                                setTimeout(rs.setImageAlpha, t * 10, tile.img, (t + 1)/100);
                            }
                        }
                    });

                    break;
                case evU.EVENT_TYPES.MOVE:
                    this.tiles.forEach(tile => {
                        if (tile.xIndex === event.from[0] && tile.yIndex === event.from[1]) {
                            console.log("It found the right tile " + tile.xIndex + " " + tile.yIndex);

                            let beginning = createVector(tile.x, tile.y);
                            let destination = createVector(this.boardCorner + tile.xIndex * this.tileSize,
                                this.boardCorner + tile.yIndex * this.tileSize);
                            let movement = createVector(destination.x - beginning.x, destination.y - beginning.y);
                            for (let t = 0; t < 100; t++) {
                                // console.log("time test");
                                // setTimeout((tile, beginning, movement) => {
                                //     let travelled = movement.mult((t + 1)/100);
                                //     let currentLocation = beginning.add(travelled);
                                //     tile.x = currentLocation.x;
                                //     tile.y = currentLocation.y;
                                // }, t * 10, tile, beginning.copy(), movement.copy());

                                setTimeout((tile) => {
                                    tile.x = destination.x;
                                    tile.y = destination.y;
                                }, 1000, tile);
                            }
                        }
                    });

                    if (event.captured !== null) {

                    }
        
                    break;
                default:
                    break;
            }
        }
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
            if (tImg) {
                if (tile.grabbed) {
                    image(tImg, mouseX - (tImg.width / 2), mouseY - (tImg.height / 2));
                } else {
                    let xOffset = (this.tileSize - tImg.width)/2;
                    let yOffset = (this.tileSize - tImg.height)/2;
                    image(tImg, tile.x + xOffset, tile.y + yOffset);
                }
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
        let boardPosition = this.positionToIndex(mouseX, mouseY);

        this.tiles.forEach(tile => {
            if (tile.grabbed) {
                tile.grabbed = false;

                let pieceMoves = bU.getMovesAt(this.board, tile.xIndex, tile.yIndex);
                let pieceAttacks = bU.getAttacksAt(this.board, tile.xIndex, tile.yIndex);

                pieceMoves.forEach(move => {
                    if (move.to[0] === boardPosition.x && move.to[1] === boardPosition.y) {
                        this.handleGameEvent(move);
                    }
                });

                pieceAttacks.forEach(attack => {
                    if (attack.to[0] === boardPosition.x && attack.to[1] === boardPosition.y) {
                        this.handleGameEvent(attack);
                    }
                });
            }
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




