import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";



export class Evaluator {
    constructor(inBoard, player, givenMoves) {
        this.board = rs.objCopy(inBoard);
        this.player = player;
        this.givenMoves = givenMoves === null ? bU.getMoves(inBoard, inBoard.plies % 2) : givenMoves;
    }

    deepStaticEval() {
        //
        // variables
        // 
        const preferences = this.player.preferences;
        let board = this.board;
        let gameBoard = board.gameBoard;
        let fileCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0], rankCounts = [0, 0, 0, 0, 0, 0, 0, 0];
        let pawnPearlCount = 0, pawnOnyxCount = 0, pawnMoveCount = 0, pawnAttackCount = 0, pawnDefendCount = 0, pawnAdjacency = 0,
            pawnPearlTargetDistance = 0, pawnOnyxTargetDistance = 0, pawnFileCount = 0, pawnRankCount = 0;
        let knightPearlCount = 0, knightOnyxCount = 0, knightMoveCount = 0, knightAttackCount = 0, knightDefendCount = 0, knightAdjacency = 0,
            knightPearlTargetDistance = 0, knightOnyxTargetDistance = 0, knightFileCount = 0, knightRankCount = 0;
        let bishopPearlCount = 0, bishopOnyxCount = 0, bishopMoveCount = 0, bishopAttackCount = 0, bishopDefendCount = 0, bishopAdjacency = 0,
            bishopPearlTargetDistance = 0, bishopOnyxTargetDistance = 0, bishopFileCount = 0, bishopRankCount = 0;
        let rookPearlCount = 0, rookOnyxCount = 0, rookMoveCount = 0, rookAttackCount = 0, rookDefendCount = 0, rookAdjacency = 0,
            rookPearlTargetDistance = 0, rookOnyxTargetDistance = 0, rookFileCount = 0, rookRankCount = 0;
        let queenPearlCount = 0, queenOnyxCount = 0, queenMoveCount = 0, queenAttackCount = 0, queenDefendCount = 0, queenAdjacency = 0,
            queenPearlTargetDistance = 0, queenOnyxTargetDistance = 0, queenFileCount = 0, queenRankCount = 0;
        let kingPearlCount = 0, kingOnyxCount = 0, kingMoveCount = 0, kingAttackCount = 0, kingDefendCount = 0, kingAdjacency = 0,
            kingPearlTargetDistance = 0, kingOnyxTargetDistance = 0, kingFileCount = 0, kingRankCount = 0;
        let otherPearlCount = 0, otherOnyxCount = 0, otherMoveCount = 0, otherAttackCount = 0, otherDefendCount = 0, otherAdjacency = 0,
            otherPearlTargetDistance = 0, otherOnyxTargetDistance = 0, otherFileCount = 0, otherRankCount = 0;
    
        
    
    
        // 
        // pre processing
        // 
        for (let x = gameBoard.length - 1; x > -1; x--) {
            for (let y = 0; y < gameBoard.length; y++) {
                let piece = gameBoard[x][y];
                if (piece !== null) {
                    fileCounts[x]++;
                    rankCounts[y]++;
                }
            }
        }
    

        // 
        // important iteration
        // 
        for (let x = gameBoard.length - 1; x > -1; x--) {
            for (let y = 0; y < gameBoard.length; y++) {
                let piece = gameBoard[x][y];
    
                if (piece !== null) {
                    let affiliation = piece.affiliation;
                    let MAD = bU.getMADat(board, x, y);
                    let adjacency = 0;
    
                    for (let aX = -1; aX < 2; aX++) {
                        for (let aY = -1; aY < 2; aY++) {
                            let tX = x + aX, tY = y + aY;
                            if (tX < 0 || tX > 7 || tY < 0 || tY > 7) {
                                continue;
                            }
                            if (gameBoard[tX][tY] !== null) {
                                adjacency++;
                            }
                        }
                    }
    
                    let target = null;
                    switch (piece.type) {
                        case "pawn":
                            target = preferences.pawn.target;
    
                            if (affiliation === 1) {
                                pawnPearlCount++;
                                pawnMoveCount += MAD[0].length;
                                pawnAttackCount += MAD[1].length;
                                pawnDefendCount += MAD[2].length;
                                pawnAdjacency += adjacency;
                                pawnPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                pawnFileCount += fileCounts[x];
                                pawnRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                pawnOnyxCount++;
                                pawnMoveCount -= MAD[0].length;
                                pawnAttackCount -= MAD[1].length;
                                pawnDefendCount -= MAD[2].length;
                                pawnAdjacency -= adjacency;
                                pawnOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                pawnFileCount -= fileCounts[x];
                                pawnRankCount -= rankCounts[y];
                            }
                            break;
                        case "knight":
                            target = preferences.knight.target;
    
                            if (affiliation === 1) {
                                knightPearlCount++;
                                knightMoveCount += MAD[0].length;
                                knightAttackCount += MAD[1].length;
                                knightDefendCount += MAD[2].length;
                                knightAdjacency += adjacency;
                                knightPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                knightFileCount += fileCounts[x];
                                knightRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                knightOnyxCount++;
                                knightMoveCount -= MAD[0].length;
                                knightAttackCount -= MAD[1].length;
                                knightDefendCount -= MAD[2].length;
                                knightAdjacency -= adjacency;
                                knightOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                knightFileCount -= fileCounts[x];
                                knightRankCount -= rankCounts[y];
                            }
                            break;
                        case "bishop":
                            target = preferences.bishop.target;
    
                            if (affiliation === 1) {
                                bishopPearlCount++;
                                bishopMoveCount += MAD[0].length;
                                bishopAttackCount += MAD[1].length;
                                bishopDefendCount += MAD[2].length;
                                bishopAdjacency += adjacency;
                                bishopPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                bishopFileCount += fileCounts[x];
                                bishopRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                bishopOnyxCount++;
                                bishopMoveCount -= MAD[0].length;
                                bishopAttackCount -= MAD[1].length;
                                bishopDefendCount -= MAD[2].length;
                                bishopAdjacency -= adjacency;
                                bishopOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                bishopFileCount -= fileCounts[x];
                                bishopRankCount -= rankCounts[y];
                            }
                            break;
                        case "rook":
                            target = preferences.rook.target;
    
                            if (affiliation === 1) {
                                rookPearlCount++;
                                rookMoveCount += MAD[0].length;
                                rookAttackCount += MAD[1].length;
                                rookDefendCount += MAD[2].length;
                                rookAdjacency += adjacency;
                                rookPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                rookFileCount += fileCounts[x];
                                rookRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                rookOnyxCount++;
                                rookMoveCount -= MAD[0].length;
                                rookAttackCount -= MAD[1].length;
                                rookDefendCount -= MAD[2].length;
                                rookAdjacency -= adjacency;
                                rookOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                rookFileCount -= fileCounts[x];
                                rookRankCount -= rankCounts[y];
                            }
                            break;
                        case "queen":
                            target = preferences.queen.target;
    
                            if (affiliation === 1) {
                                queenPearlCount++;
                                queenMoveCount += MAD[0].length;
                                queenAttackCount += MAD[1].length;
                                queenDefendCount += MAD[2].length;
                                queenAdjacency += adjacency;
                                queenPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                queenFileCount += fileCounts[x];
                                queenRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                queenOnyxCount++;
                                queenMoveCount -= MAD[0].length;
                                queenAttackCount -= MAD[1].length;
                                queenDefendCount -= MAD[2].length;
                                queenAdjacency -= adjacency;
                                queenOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                queenFileCount -= fileCounts[x];
                                queenRankCount -= rankCounts[y];
                            }
                            break;
                        case "king":
                            target = preferences.king.target;
    
                            if (affiliation === 1) {
                                kingPearlCount++;
                                kingMoveCount += MAD[0].length;
                                kingAttackCount += MAD[1].length;
                                kingDefendCount += MAD[2].length;
                                kingAdjacency += adjacency;
                                kingPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                kingFileCount += fileCounts[x];
                                kingRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                kingOnyxCount++;
                                kingMoveCount -= MAD[0].length;
                                kingAttackCount -= MAD[1].length;
                                kingDefendCount -= MAD[2].length;
                                kingAdjacency -= adjacency;
                                kingOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                kingFileCount -= fileCounts[x];
                                kingRankCount -= rankCounts[y];
                            }
                            break;
                        default:
                            target = preferences.other.target;
    
                            if (affiliation === 1) {
                                otherPearlCount++;
                                otherMoveCount += MAD[0].length;
                                otherAttackCount += MAD[1].length;
                                otherDefendCount += MAD[2].length;
                                otherAdjacency += adjacency;
                                otherPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                otherFileCount += fileCounts[x];
                                otherRankCount += rankCounts[y];
                            } else if (affiliation === 0) {
                                otherOnyxCount++;
                                otherMoveCount -= MAD[0].length;
                                otherAttackCount -= MAD[1].length;
                                otherDefendCount -= MAD[2].length;
                                otherAdjacency -= adjacency;
                                otherOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2);
                                otherFileCount -= fileCounts[x];
                                otherRankCount -= rankCounts[y];
                            }
                            break;
                    }
                }
            }
        }
    
        // 
        // post processing
        // 
        let pawnCollated = [pawnPearlCount - pawnOnyxCount, pawnMoveCount, pawnAttackCount, pawnDefendCount, pawnAdjacency,
            (pawnPearlCount === 0 ? 0 : pawnPearlTargetDistance / pawnPearlCount) - (pawnOnyxCount === 0 ? 0 : pawnOnyxTargetDistance / pawnOnyxCount), 
            pawnFileCount, pawnRankCount];
        let knightCollated = [knightPearlCount - knightOnyxCount, knightMoveCount, knightAttackCount, knightDefendCount, knightAdjacency,
            (knightPearlCount === 0 ? 0 : knightPearlTargetDistance / knightPearlCount) - (knightOnyxCount === 0 ? 0 : knightOnyxTargetDistance / knightOnyxCount), 
            knightFileCount, knightRankCount];
        let bishopCollated = [bishopPearlCount - bishopOnyxCount, bishopMoveCount, bishopAttackCount, bishopDefendCount, bishopAdjacency,
            (bishopPearlCount === 0 ? 0 : bishopPearlTargetDistance / bishopPearlCount) - (bishopOnyxCount === 0 ? 0 : bishopOnyxTargetDistance / bishopOnyxCount), 
            bishopFileCount, bishopRankCount];
        let rookCollated = [rookPearlCount - rookOnyxCount, rookMoveCount, rookAttackCount, rookDefendCount, rookAdjacency,
            (rookPearlCount === 0 ? 0 : rookPearlTargetDistance / rookPearlCount) - (rookOnyxCount === 0 ? 0 : rookOnyxTargetDistance / rookOnyxCount), 
            rookFileCount, rookRankCount];
        let queenCollated = [queenPearlCount - queenOnyxCount, queenMoveCount, queenAttackCount, queenDefendCount, queenAdjacency,
            (queenPearlCount === 0 ? 0 : queenPearlTargetDistance / queenPearlCount) - (queenOnyxCount === 0 ? 0 : queenOnyxTargetDistance / queenOnyxCount), 
            queenFileCount, queenRankCount];
        let kingCollated = [kingPearlCount - kingOnyxCount, kingMoveCount, kingAttackCount, kingDefendCount, kingAdjacency,
            (kingPearlCount === 0 ? 0 : kingPearlTargetDistance / kingPearlCount) - (kingOnyxCount === 0 ? 0 : kingOnyxTargetDistance / kingOnyxCount), kingFileCount, kingRankCount];
        let otherCollated = [otherPearlCount - otherOnyxCount, otherMoveCount, otherAttackCount, otherDefendCount, otherAdjacency,
            (otherPearlCount === 0 ? 0 : otherPearlTargetDistance / otherPearlCount) - (otherOnyxCount === 0 ? 0 : otherOnyxTargetDistance / otherOnyxCount), 
            otherFileCount, otherRankCount];
    
    
        let evaluation = 0;
        for (let i = 0; i < pawnCollated.length; i++) {
            evaluation += pawnCollated[i] * preferences.pawn.weights[i];
            evaluation += knightCollated[i] * preferences.knight.weights[i];
            evaluation += bishopCollated[i] * preferences.bishop.weights[i];
            evaluation += rookCollated[i] * preferences.rook.weights[i];
            evaluation += queenCollated[i] * preferences.queen.weights[i];
            evaluation += kingCollated[i] * preferences.king.weights[i];
            evaluation += otherCollated[i] * preferences.other.weights[i];
        }
        


        // 
        // return evaluation;
        // 
        return board.plies % 2 === 0 ? -evaluation : evaluation;
    }

    shallowStaticEval() {
        let board = this.board;
        let shallowPreferences = this.player.shallowPreferences;
        let gameBoard = this.board.gameBoard;
        let popularTileEval = 0, pearlLowestMove = Number.POSITIVE_INFINITY, onyxLowestMove = Number.POSITIVE_INFINITY, 
            pearlHighestMove = Number.NEGATIVE_INFINITY, onyxHighestMove = Number.NEGATIVE_INFINITY,
            verticalSymCount = 0, horizontalSymCount = 0, rotationalSymCount = 0, favouredTileEval = 0;
    
    
        // board iteration
        let size = gameBoard.length;
        for (let x = size - 1; x > -1; x--) {
            for (let y = 0; y < size; y++) {
                let piece = gameBoard[x][y];
                
                if (piece !== null) {
                    let opposite = undefined;
    
                    // vertical slice
                    if (y < (size / 2)) {
                        opposite = gameBoard[x][size - 1 - y];
                        if (opposite !== null) {
                            verticalSymCount++;
                        }
                    }
    
                    // horizontal slice
                    if (x < (size / 2)) {
                        opposite = gameBoard[size - 1 - x][y];
                        if (opposite !== null) {
                            horizontalSymCount++;
                        }
    
                        
                        // rotational symmetry
                        opposite = gameBoard[size - 1 - x][size - 1 - y];
                        if (opposite !== null) {
                            rotationalSymCount++;
                        }
                    }
    
                    // lowest and highest move counts
                    let moveCount = piece.moveCount;
                    if (piece.affiliation === 0) {
                        if (moveCount < pearlLowestMove) {
                            pearlLowestMove = moveCount;
                        } else if (moveCount > pearlHighestMove) {
                            pearlHighestMove = moveCount;
                        }
                    } else if (piece.affiliation === 1) {
                        if (moveCount < onyxLowestMove) {
                            onyxLowestMove = moveCount;
                        } else if (moveCount > onyxHighestMove) {
                            onyxHighestMove = moveCount;
                        }
                    }
    
                }
            }
        }
    
        let locations = [];
        board.eventList.forEach(event => {
            if (event.type === evU.EVENT_TYPES.MOVE || event.type === evU.EVENT_TYPES.CREATE) {
                locations.push(event.to);
            }
        });
    
        locations.forEach(loc => {
            let piece = gameBoard[loc[0]][loc[1]];
            if (piece !== null) {
                if (piece.affiliation === 0) {
                    popularTileEval += shallowPreferences.popularTilePref;
                } else if (piece.affiliation === 1) {
                    popularTileEval -= shallowPreferences.popularTilePref;
                }
            }
        });
    
        for (let i = 0; i < shallowPreferences.favouredTiles.length; i++) {
            let location = shallowPreferences.favouredTiles[i];
            let weight = shallowPreferences.favouredTilePrefs[i];
            let piece = gameBoard[location[0]][location[1]];
    
            if (piece !== null) {
                if (piece.affiliation === 0) {
                    favouredTileEval += weight;
                } else if (piece.affiliation === 1) {
                    favouredTileEval -= weight;
                }
            }
            
        }
    
        let playerAdjuster = (board.plies % 2) === 0 ? -1 : 1;
    
        return playerAdjuster * shallowPreferences.verticalSym * verticalSymCount + 
            playerAdjuster * shallowPreferences.horizontalSym * horizontalSymCount + 
            playerAdjuster * shallowPreferences.rotationalSym * rotationalSymCount + 
            (shallowPreferences.lowMove * (pearlLowestMove - onyxLowestMove)) + 
            (shallowPreferences.highMove * (pearlHighestMove - onyxHighestMove)) + 
            favouredTileEval + popularTileEval;
    }

    quiescence(alpha, beta, depth) {
        let board = this.board;

        const staticEval = this.deepStaticEval();
        const attacks = bU.getAttacks(board, board.plies % 2);
    
        if (depth === 0 || attacks.length === 0 || board.complete) {
            return (Math.max(depth, 1)) * staticEval;
        }
    
        if (staticEval >= beta) {
            return beta;
        }
        if (staticEval > alpha) {
            alpha = staticEval;
        }
    
    
        let posEval;
    
        for (let i = 0; i < attacks.length; i++) {
            const attack = attacks[i];
            bU.doEvent(board, attack);
            posEval = -this.quiescence(-beta, -alpha, depth - 1);
            bU.undoLastEvent(board);
    
            if (posEval >= beta) {
                return beta;
            }
            if (posEval > alpha) {
                alpha = posEval;
            }
        }
    
        return alpha;
    }
 
    negaMax(alpha, beta, depth) {
        let board = this.board;

        if (depth === 0 || board.complete) {
            return this.quiescence(alpha, beta, Math.max(depth, 3));
        }
    
        let posEval;
        let moves = bU.getMoves(board, board.plies % 2);
    
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            bU.doEvent(board, move);
            posEval = -this.negaMax(-beta, -alpha, depth - 1);
            bU.undoLastEvent(board);
    
            if (posEval >= beta) {
                return posEval;
            }
            if (posEval > alpha) {
                alpha = posEval;
            }
        }
    
        return alpha;
    
    }

    chooseMove(depth) {
        if (depth === 0 || this.board.complete) {
            return null;
        }

        //
        // Variables
        //
        let board = this.board;
        let player = this.player;
        let givenMoves = this.givenMoves;

        const talents = player.talents;
        const forgetfulness = Math.sqrt(talents.forgetfulness);

        let posEval, shallowEval, newDepth;
        let bestMove = [Number.NEGATIVE_INFINITY, null];
        givenMoves = givenMoves === null ? bU.getMoves(board, board.plies % 2) : givenMoves;


        //
        // The move loop
        //
        bU.getMoves(board, board.plies % 2).forEach(move => {
    
    
            // forgetfulness talent
            if (rs.randInt(0, 100) < forgetfulness) {
                console.log("OOPS MISSED A MOVE " + move.piece.type + " " + move.from.toString() + " to " + move.to.toString());
            } else {
    
                // calculation and consistency talents
                newDepth = Math.min(Math.ceil(((talents.consistency + (rs.randInt(0, talents.calculation)))/100) * depth), depth);
    
    
                // move making, unmaking, and evaluation
                bU.doEvent(board, move);
    
                shallowEval = this.shallowStaticEval(); // shallow preferences

                // console.log(newDepth);
                posEval = [-this.negaMax(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, newDepth - 1)
                     + rs.randInt(0, talents.volatility) // volatility talent
                     + (shallowEval * (talents.impulsivity / 100)), // impulsivity talent
                     move];
                bU.undoLastEvent(board);
    

                // cheeky inline debugging
                // console.log(posEval[0] + " " + move.piece.type + " " + move.from.toString() + " to " + move.to.toString() + (move.captured !== null ? JSON.stringify(move.captured) : ""));
                
                if (posEval[0] > bestMove[0]) {
                    bestMove = posEval;
                }
    
            }
    
    
        });
    
    
    
        return bestMove;
    }
}
