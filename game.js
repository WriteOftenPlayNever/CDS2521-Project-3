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
        // Set all the class data from the constructor
        this.pearlPlayer = pearlPlayer;
        this.onyxPlayer = onyxPlayer;
        this.boardCorner = boardCorner;
        this.tileSize = tileSize;
        // Create a new board
        this.board = bU.newBoard(8, pearlPlayer, onyxPlayer);

        // Initialise the board
        bU.initialise(this, pearlPlayer, onyxPlayer);

        // Get the readout object
        let readout = document.getElementById("readout");

        // Clear the readout when a new game is made
        while (readout.firstChild) {
            readout.removeChild(readout.firstChild);
        }


        // START OF GAME PLAYER DEVIATIONS

        // For each of the pearl player's deviations
        pearlPlayer.effects.forEach(effectName => {
            // Grab the deviation from the file using the name
            let deviation = dU[effectName];
            if (deviation.activation === dU.ACTIVATION.START_GAME) {
                // Activate the deviation effect
                eval(deviation.effect)(this, 0);

                // Create a new <p> tag to contain the readout data for the deviation
                let deviationReadoutTag = document.createElement("p");
                // Set the text tot he name and description of the deviation
                deviationReadoutTag.textContent = deviation.name + ": " + deviation.description;
                // Add it to the DOM
                readout.appendChild(deviationReadoutTag);
            }
        });

        // For each of the onyx player's deviations
        onyxPlayer.effects.forEach(effectName => {
            // Grab the deviaiton from the file using the name
            let deviation = dU[effectName];
            if (deviation.activation === dU.ACTIVATION.START_GAME) {
                // Activate the deviation effect
                eval(deviation.effect)(this, 1);

                // Create a new <p> tag to contain the readout data for the deviation
                let deviationReadoutTag = document.createElement("p");
                // Set the text tot he name and description of the deviation
                deviationReadoutTag.textContent = deviation.name + ": " + deviation.description;
                // Add it to the DOM
                readout.appendChild(deviationReadoutTag);
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
        // Get the current event count
        let eventCount = this.board.eventList.length;

        // Do the given event onto the board
        bU.doEvent(this.board, chosenEvent);

        // If it caused multiple events to exist, iterate over those using eventCount
        for(let i = eventCount; i < this.board.eventList.length; i++) {
            // Current event
            let event = this.board.eventList[i];
            // Millisecond offset to be nice to the canvas
            let offset = (i - eventCount) * 200;

            // Most of the display logic happens to moves
            if (event.type === evU.EVENT_TYPES.MOVE) {
                // iterate over tiles to find the right one
                this.tiles.forEach(tile => {
                    // Found the right one
                    if (tile.xIndex === event.from[0] && tile.yIndex === event.from[1]) {
                        // Create a container for the start location
                        let beginning = {
                            x: tile.x,
                            y: tile.y
                        }

                        // calculate the destination tile
                        let destination = {
                            x: this.boardCorner.x + event.to[0] * this.tileSize,
                            y: this.boardCorner.y + event.to[1] * this.tileSize
                        }

                        // create a makeshift movement vector
                        let movement = {
                            x: destination.x - beginning.x,
                            y: destination.y - beginning.y
                        }

                        // If it's a human move we don't need to show the move in progress, simplifies things
                        if (isHumanMove) {
                            // Set the tile to the destination location
                            tile.x = destination.x;
                            tile.y = destination.y;

                            // in 100 milliseconds, update the canvas
                            setTimeout((game, tiles) => { game.tiles = tiles; }, offset + 100, this, bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize));
                        } else {
                            // Iterate 100 times to create a smooth gradient
                            for (let t = 0; t < 100; t++) {
                                // At 100 intervals, set the location of the tile to t% through the movement
                                setTimeout((tile, beginning, movement) => {
                                    // Use iterator to find the percentage travelled
                                    let travelled = {
                                        x: movement.x * (t + 1)/100,
                                        y: movement.y * (t + 1)/100
                                    }
                                    // calculate the current position vector
                                    let currentLocation = {
                                        x: beginning.x + travelled.x,
                                        y: beginning.y + travelled.y
                                    }
                                    // Move the tile to the correct place
                                    tile.x = currentLocation.x;
                                    tile.y = currentLocation.y;
                                }, offset + (t * 3), tile, rs.objCopy(beginning), rs.objCopy(movement));
                            }

                            // A while later, reset the game tiles
                            setTimeout((tile, game, tiles) => {
                                // Finalise the position of the tile
                                tile.x = destination.x;
                                tile.y = destination.y;

                                // Reset game tiles
                                game.tiles = tiles;
                            }, offset + 350, tile, this, bU.toCanvasTiles(this.board, this.boardCorner, this.tileSize));
                        }

                    }
                });

                // MOVE READOUT STUFF
                // Grab document readout element
                let readout = document.getElementById("readout");
                // Create a new p element
                let moveReadout = document.createElement("p");
                // The file to letter conversion array
                let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                // player name holder to be set later
                let playerName;

                // The human player is always playing as onyx, so we can use that to determine which name to use
                // and construct the full name
                if (isHumanMove) {
                    playerName = this.onyxPlayer.firstName + " " + this.onyxPlayer.lastName;
                } else {
                    playerName = this.pearlPlayer.firstName + " " + this.pearlPlayer.lastName;
                }

                // If a piece was captured, it needs to fade out of existence
                if (event.captured !== null) {
                    this.tiles.forEach(tile => {
                        // Iterate over tiles until the right one is found
                        if (tile.xIndex === event.to[0] && tile.yIndex === event.to[1]) {
                            // Iterate 100 times to create  asmooth gradiient
                            for (let t = 0; t < 100; t++) {
                                // Set the transparency of the image to (100 - t)%
                                setTimeout(rs.setImageAlpha, offset + (t * 3), tile.img, (100 - t + 1)/100);
                            }
                        }
                    });

                    // Construct the sentence saying what the move was and what was captured
                    moveReadout.textContent = playerName + " moved " + event.piece.name + " from " + files[event.from[0]] + [event.from[1] + 1] + 
                        " to " + files[event.to[0]] + [event.to[1] + 1] + " and took " + event.captured.name;
                } else {
                    // Construct the sentence saying what the move was
                    moveReadout.textContent = playerName + " moved " + event.piece.name + " from " + files[event.from[0]] + [event.from[1] + 1] + 
                    " to " + files[event.to[0]] + [event.to[1] + 1];
                }
    

                // Add the sentence to the readout
                readout.appendChild(moveReadout);
            }
        }

        // If it's a human move, we need to calculate and play the CPU move
        if (isHumanMove) {
            // Instantiate a new evaluator instance
            let evaluator = new Evaluator(this.board, this.pearlPlayer, null);

            // Call this funciton again to handle a new game event
            // and feed in the evaluator's chosen move
            // but set it to be a machine move and not a human move
            // also by using setTimeout it avoids some glitchy screen tearing
            setTimeout((moveEvent, game) => {
                game.handleGameEvent(moveEvent, false);
            }, 400, evaluator.chooseMove(3)[1], this);
        }
    }

    drawToCanvas() {
        // Set to noStroke()
        noStroke();
        let gameBoard = this.board.gameBoard;
        // Iterate over board in a strange direction to create the correct orientation
        // This iteration creates the background tiles
        for (let x = gameBoard.length - 1; x > -1; x--) {
            for (let y = 0; y < gameBoard.length; y++) {
                // even squares have colour, odd ones are white
                if ((x + y) % 2 === 0) {
                    // set fill ot purple
                    fill(255, 218, 179);
                    // create square
                    square(this.boardCorner.x + (x * this.tileSize), this.boardCorner.y + (y * this.tileSize), this.tileSize);
                } else {
                    // set fill to white
                    fill(255);
                    // create the square
                    square(this.boardCorner.x + (x * this.tileSize), this.boardCorner.y + (y * this.tileSize), this.tileSize);
                }
            }
        }

        // Iterate over the game tiles
        this.tiles.forEach(tile => {
            // Create the tile image
            let tImg = tile.img;
            // If it exists...
            if (tImg) {
                // If the tile is grabbed, always set it to the mouse location
                if (tile.grabbed) {
                    image(tImg, mouseX - (tImg.width / 2), mouseY - (tImg.height / 2));
                } else {
                    // Otherwise put it in the correct square
                    // Calculate offsets
                    let xOffset = (this.tileSize - tImg.width)/2;
                    let yOffset = (this.tileSize - tImg.height)/2;
                    image(tImg, tile.x + xOffset, tile.y + yOffset);
                }
            }
        });
    }

    // Mouse pressed handler
    mousePressed() {
        // Get the board position, rank and file, of the mouse
        let boardPosition = this.positionToIndex(mouseX, mouseY);

        // Iterate over the tiles until you find the corerct one
        this.tiles.forEach(tile => {
            if (tile.xIndex === boardPosition.x && tile.yIndex === boardPosition.y) {
                // Set the relevant tile to true
                tile.grabbed = true;
            }
        });
    }

    // Mouse released handler
    mouseReleased() {
        // Get the board position, rank and file, of the mouse
        let boardPosition = this.positionToIndex(mouseX, mouseY);
        
        // Iterate over tiles to see if any are grabbed
        this.tiles.forEach(tile => {
            if (tile.grabbed) {
                // Ungrab the tile
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
        // Create location vector
        let posVector = p5.Vector.sub(createVector(x, y), this.boardCorner);
        
        // Use tilesize to figure out board position vector
        let xIndex = Math.floor(posVector.x / this.tileSize);
        let yIndex = Math.floor(posVector.y / this.tileSize);

        // Return board position
        return {
            x: xIndex,
            y: yIndex
        }
    }
    
}




