import * as rs from "./resources.js";
import * as piU from "./piece.js";
import * as dU from "./deviation.js";
import * as evU from "./event.js";
import * as enU from "./enchantment.js";



export function doEvent(board, event) {
    let from = event.from;
    let to = event.to;

    board.eventList.push(event);

    switch (event.type) {
        case evU.EVENT_TYPES.CREATE:

            board.gameBoard[to[0]][to[1]] = event.piece;
            
            break;
        case evU.EVENT_TYPES.MOVE:

            // update board
            if (event.rest) {
                board.plies++;
            }
            board.gameBoard[from[0]][from[1]] = null;
            board.gameBoard[to[0]][to[1]] = event.piece;
            if (event.captured !== null) {
                if (event.captured.type === "king") {
                    board.complete = true;
                }
            }

            // update piece data
            event.piece.moveCount++;

            // do move enchantments
            event.piece.enchantments.forEach(enchant => {
                if (enchant.trigger === enU.TRIGGERS.ON_MOVE) {
                    eval(enchant.effect)(event, board);
                } 
                if (enchant.trigger === enU.TRIGGERS.ON_CAPTURE && event.captured !== null) {
                    eval(enchant.effect)(event, board);
                }
            })

            // do capture enchantments
            if (event.captured !== null) {
                event.captured.enchantments.forEach(enchant => {
                    if (enchant.trigger === enU.TRIGGERS.ON_DEATH) {
                        eval(enchant.effect)(event, board);
                    } 
                })
            }

            break;
        default:
            break;
    }
}

export function undoLastEvent(board) {
    let event = board.eventList.pop();

    if (event === undefined) {
        return;
    }

    let from = event.from;
    let to = event.to;

    switch (event.type) {
        case evU.EVENT_TYPES.CREATE:

            board.gameBoard[to[0]][to[1]] = event.captured;
            
            break;
        case evU.EVENT_TYPES.MOVE:

            // undo capture enchantments
            if (event.captured !== null) {
                event.captured.enchantments.forEach(enchant => {
                    if (enchant.trigger === enU.TRIGGERS.ON_DEATH) {
                        eval(enchant.undo)(event, board);
                    } 
                })
            }

            // do move enchantments
            event.piece.enchantments.forEach(enchant => {
                if (enchant.trigger === enU.TRIGGERS.ON_MOVE) {
                    eval(enchant.undo)(event, board);
                } 
                if (enchant.trigger === enU.TRIGGERS.ON_CAPTURE && event.captured !== null) {
                    eval(enchant.undo)(event, board);
                }
            })

            // revert piece data
            event.piece.moveCount--;

            // revert board
            if (event.captured !== null) {
                if (event.captured.type === "king") {
                    board.complete = false;
                }
            }
            board.gameBoard[from[0]][from[1]] = event.piece;
            board.gameBoard[to[0]][to[1]] = event.captured;
            if (event.rest) {
                board.plies--;
            }

            break;
        default:
            break;
    }

    return event;
}

export function undoLastMove(board) {
    while (undoLastEvent(board).rest === false);
}


export function getMoves(board, affiliation) {
    let moves = [];
    let gameBoard = board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            
            if (piece === null) {
                continue;
            }

            if (piece.affiliation !== affiliation) {
                continue;
            }

            let mp = piece.movePattern;
            mp.movement.forEach(movementType => {
                for (let i = 1; i <= mp.range; i++) {
                    let destinationX = x + (i * movementType[0]);
                    let destinationY = y + (i * movementType[1]);


                    if (destinationX < gameBoard.length && 
                        destinationY < gameBoard[0].length &&
                        destinationX > -1 &&
                        destinationY > -1) {


                        let destinationPiece = gameBoard[destinationX][destinationY];
                        
                        if (destinationPiece === null) {
                            moves.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                        } else {
                            break;
                        }
                    }
                }
            })

            
            let ap = piece.attackPattern;
            ap.movement.forEach(movementType => {
                for (let i = 1; i <= ap.range; i++) {
                    let destinationX = x + (i * movementType[0]);
                    let destinationY = y + (i * movementType[1]);
        
                    if (destinationX < gameBoard.length && 
                        destinationY < gameBoard[0].length &&
                        destinationX > -1 &&
                        destinationY > -1) {
        
        
                        let destinationPiece = gameBoard[destinationX][destinationY];

                        if (destinationPiece !== null) {
                            if (destinationPiece.affiliation !== affiliation) {
                                moves.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                            }
                            break;
                        }
                    }
                }
            })
        }
        
    }

    return moves;
}

export function getAttacks(board, affiliation) {
    let attacks = [];
    let gameBoard = board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            
            if (piece === null) {
                continue;
            }

            if (piece.affiliation !== affiliation) {
                continue;
            }

            let mp = piece.attackPattern;
            mp.movement.forEach(movementType => {
                for (let i = 1; i <= mp.range; i++) {
                    let destinationX = x + (i * movementType[0]);
                    let destinationY = y + (i * movementType[1]);


                    if (destinationX < gameBoard.length && 
                        destinationY < gameBoard[0].length &&
                        destinationX > -1 &&
                        destinationY > -1) {


                        let destinationPiece = gameBoard[destinationX][destinationY];
                        
                        if (destinationPiece !== null) {
                            if (destinationPiece.affiliation !== affiliation) {
                                attacks.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                            }
                            break;
                        }
                    }
                }
            })
        }
        
    }

    return attacks;
}

export function getMovesAt(board, x, y) {
    let gameBoard = board.gameBoard;
    let piece = gameBoard[x][y];
    let moves = [];

    if (piece === null) {
        return moves;
    }

    let mp = piece.movePattern;
    mp.movement.forEach(movementType => {
        for (let i = 1; i <= mp.range; i++) {
            let destinationX = x + (i * movementType[0]);
            let destinationY = y + (i * movementType[1]);

            if (destinationX < gameBoard.length && 
                destinationY < gameBoard[0].length &&
                destinationX > -1 &&
                destinationY > -1) {


                let destinationPiece = gameBoard[destinationX][destinationY];
                
                if (destinationPiece === null) {
                    moves.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                } else {
                    break;
                }
            }
        }
    })

    return moves;
}

export function getAttacksAt(board, x, y) {
    let gameBoard = board.gameBoard;
    let piece = gameBoard[x][y];
    let moves = [];

    if (piece === null) {
        return moves;
    }

    let mp = piece.movePattern;

    mp.movement.forEach(movementType => {
        for (let i = 1; i <= mp.range; i++) {
            let destinationX = x + (i * movementType[0]);
            let destinationY = y + (i * movementType[1]);

            if (destinationX < gameBoard.length && 
                destinationY < gameBoard[0].length &&
                destinationX > -1 &&
                destinationY > -1) {


                let destinationPiece = gameBoard[destinationX][destinationY];
                
                if (destinationPiece !== null) {
                    if (destinationPiece.affiliation !== piece.affiliation) {
                        moves.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                    }
                    break;
                }
            }
        }
    })

    return moves;
}

export function getDefendsAt(board, x, y) {
    let gameBoard = board.gameBoard;
    let piece = gameBoard[x][y];
    let moves = [];

    if (piece === null) {
        return moves;
    }

    let mp = piece.movePattern;

    mp.movement.forEach(movementType => {
        for (let i = 1; i <= mp.range; i++) {
            let destinationX = x + (i * movementType[0]);
            let destinationY = y + (i * movementType[1]);

            if (destinationX < gameBoard.length && 
                destinationY < gameBoard[0].length &&
                destinationX > -1 &&
                destinationY > -1) {


                let destinationPiece = gameBoard[destinationX][destinationY];
                
                if (destinationPiece !== null) {
                    if (destinationPiece.affiliation === affiliation) {
                        moves.push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                    }
                    break;
                }
            }
        }
    })
}

export function getMADat(board, x, y) {
    let gameBoard = board.gameBoard;
    let piece = gameBoard[x][y];
    let MAD = [[], [], []];

    if (piece === null) {
        return MAD;
    }

    let mp = piece.movePattern;

    mp.movement.forEach(movementType => {
        for (let i = 1; i <= mp.range; i++) {
            let destinationX = x + (i * movementType[0]);
            let destinationY = y + (i * movementType[1]);

            if (destinationX < gameBoard.length && 
                destinationY < gameBoard[0].length &&
                destinationX > -1 &&
                destinationY > -1) {


                let destinationPiece = gameBoard[destinationX][destinationY];
                
                if (destinationPiece === null) {
                    MAD[0].push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                } else if (destinationPiece.affiliation === piece.affiliation) {
                    MAD[2].push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                    break;
                } else if (destinationPiece.affiliation !== piece.affiliation) {
                    MAD[1].push(evU.newMove(piece, destinationPiece, [x, y], [destinationX, destinationY], true));
                    break;
                }
            }
        }
    })

    return MAD;
}



export function newBoard(boardSize) {
    let tiles = [];
    for (let i = 0; i < boardSize; i++) {
        let file = [];
        for (let j = 0; j < boardSize; j++) {
            file.push(null);
        }

        tiles.push(file);
    }

    let setup = {
        gameBoard: tiles,
        complete: false,
        plies: 0,
        eventList: []
    }


    return setup;
}

export function initialise(board, pearlPlayer, onyxPlayer) {
    let gameBoard = board.gameBoard;

    // PEARL PAWNS
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i][1] = rs.objCopy(piU.PEARL_PAWN);
    }

    // ONYX PAWNS
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i][gameBoard.length - 2] = rs.objCopy(piU.ONYX_PAWN);
    }

    // PEARL ROOK/KNIGHTS
    gameBoard[0][0] = rs.objCopy(piU.PEARL_ROOK);
    gameBoard[gameBoard.length - 1][0] = rs.objCopy(piU.PEARL_ROOK);
    gameBoard[1][0] = rs.objCopy(piU.PEARL_KNIGHT);
    gameBoard[gameBoard.length - 2][0] = rs.objCopy(piU.PEARL_KNIGHT);

    // ONYX ROOK/KNIGHTS
    gameBoard[0][gameBoard.length - 1] = rs.objCopy(piU.ONYX_ROOK);
    gameBoard[gameBoard.length - 1][gameBoard.length - 1] = rs.objCopy(piU.ONYX_ROOK);
    gameBoard[1][gameBoard.length - 1] = rs.objCopy(piU.ONYX_KNIGHT);
    gameBoard[gameBoard.length - 2][gameBoard.length - 1] = rs.objCopy(piU.ONYX_KNIGHT);


    let kingX = Math.floor(gameBoard.length / 2);


    // PEARL KING SQUAD
    gameBoard[kingX][0] = rs.objCopy(piU.PEARL_KING);
    gameBoard[kingX - 1][0] = rs.objCopy(piU.PEARL_QUEEN);
    gameBoard[kingX - 2][0] = rs.objCopy(piU.PEARL_BISHOP);
    gameBoard[kingX + 1][0] = rs.objCopy(piU.PEARL_BISHOP);


    // ONYX KING SQUAD
    gameBoard[kingX][gameBoard.length - 1] = rs.objCopy(piU.ONYX_KING);
    gameBoard[kingX - 1][gameBoard.length - 1] = rs.objCopy(piU.ONYX_QUEEN);
    gameBoard[kingX - 2][gameBoard.length - 1] = rs.objCopy(piU.ONYX_BISHOP);
    gameBoard[kingX + 1][gameBoard.length - 1] = rs.objCopy(piU.ONYX_BISHOP);



    // START OF GAME PLAYER DEVIATIONS
    pearlPlayer.effects.forEach(effect => {
        if (effect.activation === dU.ACTIVATION.START_GAME) {
            effect.activate(0, setup);
        }
    });

    onyxPlayer.effects.forEach(effect => {
        if (effect.activation === dU.ACTIVATION.START_GAME) {
            effect.activate(1, setup);
        }
    });
}

export function toDisplayString(board) {
    let gameBoard = board.gameBoard;
    let boardString = "";

    for (let x = gameBoard.length - 1; x > -1; x--) {
        for (let y = 0; y < gameBoard.length; y++) {
            let tileString = gameBoard[y][x] === null ? "." : gameBoard[y][x].char;
            boardString = boardString.concat(tileString.concat(" "));
        
        }
        boardString = boardString.concat("\n");
    }

    return boardString;
}

export function toCanvasTiles(board, boardCorner, tileSize) {
    let gameBoard = board.gameBoard;
    let tiles = [];

    for (let x = gameBoard.length - 1; x > -1; x--) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                
                let newTile = {
                    xIndex: x,
                    yIndex: y,
                    x: boardCorner.x + (x * tileSize),
                    y: boardCorner.y + (y * tileSize),
                    img: null,
                    grabbed: false
                };

                loadImage(piece.image, tImg => {
                    if (tImg.width > tImg.height) {
                        tImg.resize(tileSize * 0.9, 0);
                    } else {
                        tImg.resize(0, tileSize * 0.9);
                    }

                    newTile.img = tImg;
                });

                tiles.push(newTile);
            }
        }
    }

    return tiles;
}