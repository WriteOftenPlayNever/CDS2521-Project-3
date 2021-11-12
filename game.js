import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";
import * as dU from "./deviation.js";
import * as enU from "./enchantment.js";
import * as pU from "./piece.js";
import { players } from "./players.js";
import { Evaluator } from "./evaluator.js";
// Import statements ^


export class Game {
    constructor(pearlPlayer, onyxPlayer, boardCorner, tileSize) {
        this.pearlPlayer = pearlPlayer;
        this.onyxPlayer = onyxPlayer;
        this.boardCorner = boardCorner;
        this.tileSize = tileSize;
        this.board = bU.newBoard(8, pearlPlayer, onyxPlayer);

        bU.initialise(this, pearlPlayer, onyxPlayer);


        // START OF GAME PLAYER DEVIATIONS
        pearlPlayer.effects.forEach(effectName => {
            let deviation = dU[effectName];
            if (deviation.activation === dU.ACTIVATION.START_GAME) {
                eval(deviation.effect)(this, 0);
            }
        });

        onyxPlayer.effects.forEach(effectName => {
            let deviation = dU[effectName];
            if (deviation.activation === dU.ACTIVATION.START_GAME) {
                eval(deviation.effect)(this, 1);
            }
        });


        // White has to play the first move, so fire up an evaluator
        let evaluator = new Evaluator(this.board, pearlPlayer, null);
        
        // Handle the game event for the move chosen by the evaluator
        bU.doEvent(this.board, evaluator.chooseMove(3)[1]);

        // Show the tiles to the player
        this.tiles = bU.toCanvasTiles(this.board, boardCorner, tileSize);
    }

    handleGameEvent(chosenEvent, isHumanMove) {
        let eventCount = this.board.eventList.length;

        bU.doEvent(this.board, chosenEvent);

        for(let i = eventCount; i < this.board.eventList.length; i++) {
            let event = this.board.eventList[i];
            let offset = (i - eventCount) * 100;
            switch (event.type) {
                case evU.EVENT_TYPES.MOVE:
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

                            if (isHumanMove) {
                                tile.x = destination.x;
                                tile.y = destination.y;

                                setTimeout((game, tiles) => { game.tiles = tiles; }, offset + 100, this, bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize));
                            } else {
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
                                    }, offset + (t * 3), tile, rs.objCopy(beginning), rs.objCopy(movement));
                                }

                                setTimeout((tile, game, tiles) => {
                                    tile.x = destination.x;
                                    tile.y = destination.y;
    
                                    console.log(tile.x + " " + tile.y);
    
                                    game.tiles = tiles;
                                }, offset + 350, tile, this, bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize));
                            }


                        }
                    });
                    

                    if (event.captured !== null) {
                        this.tiles.forEach(tile => {
                            if (tile.xIndex === event.to[0] && tile.yIndex === event.to[1]) {
                                for (let t = 0; t < 100; t++) {
                                    setTimeout(rs.setImageAlpha, offset + (t * 3), tile.img, (100 - t + 1)/100);
                                }
                            }
                        });
                    }
        
                    break;
                default:
                    break;
            }
        }

        // If it's a human move, we need to calculate and play the CPU move
        if (isHumanMove) {
            // Instantiate a new evaluator instance
            let evaluator = new Evaluator(this.board, this.pearlPlayer, null);

            // Call this funciton again to handle a new game event
            // and feed in the evaluator's chosen move
            // but set it to be a machine move and not a human move
            this.handleGameEvent(evaluator.chooseMove(3)[1], false);
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

                // Get the piece from the tile you were grabbing
                let piece = this.board.gameBoard[tile.xIndex][tile.yIndex];

                // Only proceeed if it were a dark piece
                if (piece.affiliation === 1) {
                    // Get the moves and attacks of the piece
                    let pieceMoves = bU.getMovesAt(this.board, tile.xIndex, tile.yIndex);
                    let pieceAttacks = bU.getAttacksAt(this.board, tile.xIndex, tile.yIndex);
    
                    // Check if any of the moves were valid
                    pieceMoves.forEach(move => {
                        // If there's a valid move
                        if (move.to[0] === boardPosition.x && move.to[1] === boardPosition.y) {
                            // Play that move
                            this.handleGameEvent(move, true);
                        }
                    });
    
                    // Check if any of the attacks were valid
                    pieceAttacks.forEach(attack => {
                        // If there's a valid attack
                        if (attack.to[0] === boardPosition.x && attack.to[1] === boardPosition.y) {
                            // Play that attack
                            this.handleGameEvent(attack, true);
                        }
                    });
                }
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




