import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";
import * as enU from "./enchantment.js";
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

        bU.initialise(this, pearlPlayer, onyxPlayer);

        this.tiles = bU.toCanvasTiles(this.board, boardCorner, tileSize);
    }

    handleGameEvent(event, isHumanMove) {
        let eventCount = this.board.eventList.length;

        bU.doEvent(this.board, event);

        for(let i = eventCount; i < this.board.eventList.length; i++) {
            switch (event.type) {
                case evU.EVENT_TYPES.CREATE:
                    this.tiles = bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize);

                    this.tiles.forEach(tile => {
                        if (tile.xIndex === event.to[0] && tile.yIndex === event.to[1]) {
                            for (let t = 0; t < 100; t++) {
                                setTimeout(rs.setImageAlpha, t * 3, tile.img, (t + 1)/100);
                            }
                        }
                    });

                    break;
                case evU.EVENT_TYPES.MOVE:
                    if (isHumanMove) {
                        this.tiles = bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize);
                    } else {
                        this.tiles.forEach(tile => {
                            if (tile.xIndex === event.from[0] && tile.yIndex === event.from[1]) {
                                let beginning = {
                                    x: tile.x,
                                    y: tile.y
                                }
                                let destination = {
                                    x: this.boardCorner.x + event.to[0] * this.tileSize,
                                    y: this.boardCorner.y + event.to[1] * this.tileSize
                                }
                                let movement = {
                                    x: destination.x - beginning.x,
                                    y: destination.y - beginning.y
                                }
                                for (let t = 0; t < 100; t++) {
                                    // console.log("time test");
                                    setTimeout((tile, beginning, movement) => {
                                        let travelled = {
                                            x: movement.x * (t + 1)/100,
                                            y: movement.y * (t + 1)/100
                                        }
                                        let currentLocation = {
                                            x: beginning.x + travelled.x,
                                            y: beginning.y + travelled.y
                                        }
                                        tile.x = currentLocation.x;
                                        tile.y = currentLocation.y;
                                    }, t * 3, tile, rs.objCopy(beginning), rs.objCopy(movement));
                                }
    
                                setTimeout((tile, game, tiles) => {
                                    tile.x = destination.x;
                                    tile.y = destination.y;
    
                                    console.log(tile.x + " " + tile.y);
    
                                    game.tiles = tiles;
                                }, 350, tile, this, bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize));
                            }
                        });
                    }

                    if (event.captured !== null) {
                        this.tiles.forEach(tile => {
                            if (tile.xIndex === event.to[0] && tile.yIndex === event.to[1]) {
                                for (let t = 0; t < 100; t++) {
                                    setTimeout(rs.setImageAlpha, t * 3, tile.img, (100 - t + 1)/100);
                                }
                            }
                        });
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
                        this.handleGameEvent(move, true);
                    }
                });

                pieceAttacks.forEach(attack => {
                    if (attack.to[0] === boardPosition.x && attack.to[1] === boardPosition.y) {
                        this.handleGameEvent(attack, true);
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




