import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";


// Evaluator class
export class Evaluator {
    // Set constructor values
    constructor(inBoard, player, givenMoves) {
        this.board = rs.objCopy(inBoard);
        this.player = player;
        this.givenMoves = givenMoves === null ? bU.getMoves(inBoard, inBoard.plies % 2) : givenMoves;
    }

    // Deep static evaluation function
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
                // The piece at location
                let piece = gameBoard[x][y];
                if (piece !== null) {
                    // Increment rank and file counts
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
                // The piece at location
                let piece = gameBoard[x][y];
    
                // If there is such a piece
                if (piece !== null) {
                    // Get the affiliation
                    let affiliation = piece.affiliation;
                    // Get the Moves, Attacks, and Defends at that location
                    let MAD = bU.getMADat(board, x, y);
                    // Set up the adjacency incrementer
                    let adjacency = 0;
    
                    // Create the adjacency loop
                    for (let aX = -1; aX < 2; aX++) {
                        for (let aY = -1; aY < 2; aY++) {
                            let tX = x + aX, tY = y + aY;
                            // If the location is out of bounds, ignore it
                            if (tX < 0 || tX > 7 || tY < 0 || tY > 7) {
                                continue;
                            }
                            // If there is a piece in the adjacent square, increment the adjacency count
                            if (gameBoard[tX][tY] !== null) {
                                adjacency++;
                            }
                        }
                    }
    
                    // Set up the target variable
                    let target = null;
                    // Switch on the piece type
                    switch (piece.type) {
                        // If pawn
                        case "pawn":
                            // Update the target value
                            target = preferences.pawn.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                pawnPearlCount++; // Increment the counter
                                pawnMoveCount += MAD[0].length; // update move count
                                pawnAttackCount += MAD[1].length; // update move tally
                                pawnDefendCount += MAD[2].length; // update the defend tally
                                pawnAdjacency += adjacency; // update the adjacency
                                pawnPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                pawnFileCount += fileCounts[x]; // update file counts
                                pawnRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx // else if black
                                pawnOnyxCount++; // Increment the counter
                                pawnMoveCount -= MAD[0].length; // update move count
                                pawnAttackCount -= MAD[1].length; // update move tally
                                pawnDefendCount -= MAD[2].length; // update the defend tally
                                pawnAdjacency -= adjacency; // update the adjacency
                                pawnOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                pawnFileCount -= fileCounts[x]; // update file counts // decrement file counts
                                pawnRankCount -= rankCounts[y]; // update rank counts // update rank counts
                            }
                            break;
                        case "knight":
                            target = preferences.knight.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                knightPearlCount++; // Increment the counter
                                knightMoveCount += MAD[0].length; // update move count
                                knightAttackCount += MAD[1].length; // update move tally
                                knightDefendCount += MAD[2].length; // update the defend tally
                                knightAdjacency += adjacency; // update the adjacency
                                knightPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                knightFileCount += fileCounts[x]; // update file counts
                                knightRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                knightOnyxCount++; // Increment the counter
                                knightMoveCount -= MAD[0].length; // update move count
                                knightAttackCount -= MAD[1].length; // update move tally
                                knightDefendCount -= MAD[2].length; // update the defend tally
                                knightAdjacency -= adjacency; // update the adjacency
                                knightOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                knightFileCount -= fileCounts[x]; // update file counts
                                knightRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                        case "bishop":
                            target = preferences.bishop.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                bishopPearlCount++; // Increment the counter
                                bishopMoveCount += MAD[0].length; // update move count
                                bishopAttackCount += MAD[1].length; // update move tally
                                bishopDefendCount += MAD[2].length; // update the defend tally
                                bishopAdjacency += adjacency; // update the adjacency
                                bishopPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                bishopFileCount += fileCounts[x]; // update file counts
                                bishopRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                bishopOnyxCount++; // Increment the counter
                                bishopMoveCount -= MAD[0].length; // update move count
                                bishopAttackCount -= MAD[1].length; // update move tally
                                bishopDefendCount -= MAD[2].length; // update the defend tally
                                bishopAdjacency -= adjacency; // update the adjacency
                                bishopOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                bishopFileCount -= fileCounts[x]; // update file counts
                                bishopRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                        case "rook":
                            target = preferences.rook.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                rookPearlCount++; // Increment the counter
                                rookMoveCount += MAD[0].length; // update move count
                                rookAttackCount += MAD[1].length; // update move tally
                                rookDefendCount += MAD[2].length; // update the defend tally
                                rookAdjacency += adjacency; // update the adjacency
                                rookPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                rookFileCount += fileCounts[x]; // update file counts
                                rookRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                rookOnyxCount++; // Increment the counter
                                rookMoveCount -= MAD[0].length; // update move count
                                rookAttackCount -= MAD[1].length; // update move tally
                                rookDefendCount -= MAD[2].length; // update the defend tally
                                rookAdjacency -= adjacency; // update the adjacency
                                rookOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                rookFileCount -= fileCounts[x]; // update file counts
                                rookRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                        case "queen":
                            target = preferences.queen.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                queenPearlCount++; // Increment the counter
                                queenMoveCount += MAD[0].length; // update move count
                                queenAttackCount += MAD[1].length; // update move tally
                                queenDefendCount += MAD[2].length; // update the defend tally
                                queenAdjacency += adjacency; // update the adjacency
                                queenPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                queenFileCount += fileCounts[x]; // update file counts
                                queenRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                queenOnyxCount++; // Increment the counter
                                queenMoveCount -= MAD[0].length; // update move count
                                queenAttackCount -= MAD[1].length; // update move tally
                                queenDefendCount -= MAD[2].length; // update the defend tally
                                queenAdjacency -= adjacency; // update the adjacency
                                queenOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                queenFileCount -= fileCounts[x]; // update file counts
                                queenRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                        case "king":
                            target = preferences.king.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                kingPearlCount++; // Increment the counter
                                kingMoveCount += MAD[0].length; // update move count
                                kingAttackCount += MAD[1].length; // update move tally
                                kingDefendCount += MAD[2].length; // update the defend tally
                                kingAdjacency += adjacency; // update the adjacency
                                kingPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                kingFileCount += fileCounts[x]; // update file counts
                                kingRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                kingOnyxCount++; // Increment the counter
                                kingMoveCount -= MAD[0].length; // update move count
                                kingAttackCount -= MAD[1].length; // update move tally
                                kingDefendCount -= MAD[2].length; // update the defend tally
                                kingAdjacency -= adjacency; // update the adjacency
                                kingOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                kingFileCount -= fileCounts[x]; // update file counts
                                kingRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                        default:
                            target = preferences.other.target;
    
                            // If pearl
                            if (affiliation === 1) {
                                otherPearlCount++; // Increment the counter
                                otherMoveCount += MAD[0].length; // update move count
                                otherAttackCount += MAD[1].length; // update move tally
                                otherDefendCount += MAD[2].length; // update the defend tally
                                otherAdjacency += adjacency; // update the adjacency
                                otherPearlTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                otherFileCount += fileCounts[x]; // update file counts
                                otherRankCount += rankCounts[y]; // update rank counts
                            } else if (affiliation === 0) { // else if onyx
                                otherOnyxCount++; // Increment the counter
                                otherMoveCount -= MAD[0].length; // update move count
                                otherAttackCount -= MAD[1].length; // update move tally
                                otherDefendCount -= MAD[2].length; // update the defend tally
                                otherAdjacency -= adjacency; // update the adjacency
                                otherOnyxTargetDistance += Math.sqrt((target[0] - x)**2 + (target[1] - y)**2); // find target distance and add it
                                otherFileCount -= fileCounts[x]; // update file counts
                                otherRankCount -= rankCounts[y]; // update rank counts
                            }
                            break;
                    }
                }
            }
        }
    
        // 
        // post processing
        // 
        // Set pawn values into array
        let pawnCollated = [pawnPearlCount - pawnOnyxCount, pawnMoveCount, pawnAttackCount, pawnDefendCount, pawnAdjacency,
            (pawnPearlCount === 0 ? 0 : pawnPearlTargetDistance / pawnPearlCount) - (pawnOnyxCount === 0 ? 0 : pawnOnyxTargetDistance / pawnOnyxCount), 
            pawnFileCount, pawnRankCount];
        // Set knight values into array
        let knightCollated = [knightPearlCount - knightOnyxCount, knightMoveCount, knightAttackCount, knightDefendCount, knightAdjacency,
            (knightPearlCount === 0 ? 0 : knightPearlTargetDistance / knightPearlCount) - (knightOnyxCount === 0 ? 0 : knightOnyxTargetDistance / knightOnyxCount), 
            knightFileCount, knightRankCount];
        // Set bishop values into array
        let bishopCollated = [bishopPearlCount - bishopOnyxCount, bishopMoveCount, bishopAttackCount, bishopDefendCount, bishopAdjacency,
            (bishopPearlCount === 0 ? 0 : bishopPearlTargetDistance / bishopPearlCount) - (bishopOnyxCount === 0 ? 0 : bishopOnyxTargetDistance / bishopOnyxCount), 
            bishopFileCount, bishopRankCount];
        // Set rook values into array
        let rookCollated = [rookPearlCount - rookOnyxCount, rookMoveCount, rookAttackCount, rookDefendCount, rookAdjacency,
            (rookPearlCount === 0 ? 0 : rookPearlTargetDistance / rookPearlCount) - (rookOnyxCount === 0 ? 0 : rookOnyxTargetDistance / rookOnyxCount), 
            rookFileCount, rookRankCount];
        // Set queen values into array
        let queenCollated = [queenPearlCount - queenOnyxCount, queenMoveCount, queenAttackCount, queenDefendCount, queenAdjacency,
            (queenPearlCount === 0 ? 0 : queenPearlTargetDistance / queenPearlCount) - (queenOnyxCount === 0 ? 0 : queenOnyxTargetDistance / queenOnyxCount), 
            queenFileCount, queenRankCount];
        // Set king values into array
        let kingCollated = [kingPearlCount - kingOnyxCount, kingMoveCount, kingAttackCount, kingDefendCount, kingAdjacency,
            (kingPearlCount === 0 ? 0 : kingPearlTargetDistance / kingPearlCount) - (kingOnyxCount === 0 ? 0 : kingOnyxTargetDistance / kingOnyxCount), kingFileCount, kingRankCount];
        // Set other's values into array
        let otherCollated = [otherPearlCount - otherOnyxCount, otherMoveCount, otherAttackCount, otherDefendCount, otherAdjacency,
            (otherPearlCount === 0 ? 0 : otherPearlTargetDistance / otherPearlCount) - (otherOnyxCount === 0 ? 0 : otherOnyxTargetDistance / otherOnyxCount), 
            otherFileCount, otherRankCount];
    
    
        // create evaluation variable
        let evaluation = 0;
        // Matrix multiply the evaluations with the preferences of the player
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
        // Set up variables in advance
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
                
                // If there is such a piece
                if (piece !== null) {
                    let opposite = undefined;
    
                    // vertical slice
                    if (y < (size / 2)) {
                        opposite = gameBoard[x][size - 1 - y];
                        if (opposite !== null) {
                            verticalSymCount++; // Increment the counter
                        }
                    }
    
                    // horizontal slice
                    if (x < (size / 2)) {
                        opposite = gameBoard[size - 1 - x][y];
                        if (opposite !== null) {
                            horizontalSymCount++; // Increment the counter
                        }
    
                        
                        // rotational symmetry
                        opposite = gameBoard[size - 1 - x][size - 1 - y];
                        if (opposite !== null) {
                            rotationalSymCount++; // Increment the counter
                        }
                    }
    
                    // lowest and highest move counts
                    let moveCount = piece.moveCount;
                    if (piece.affiliation === 0) { // If pearl
                        // If it's the lowest or highest move, update those
                        if (moveCount < pearlLowestMove) {
                            pearlLowestMove = moveCount;
                        } else if (moveCount > pearlHighestMove) {
                            pearlHighestMove = moveCount;
                        }
                    } else if (piece.affiliation === 1) { // else if onyx
                        // If it's the lowest or highest move, update those
                        if (moveCount < onyxLowestMove) {
                            onyxLowestMove = moveCount;
                        } else if (moveCount > onyxHighestMove) {
                            onyxHighestMove = moveCount;
                        }
                    }
    
                }
            }
        }
    
        // History calculator
        let locations = [];
        board.eventList.forEach(event => {
            // Add each visited location to the list
            if (event.type === evU.EVENT_TYPES.MOVE || event.type === evU.EVENT_TYPES.CREATE) {
                locations.push(event.to);
            }
        });
    
        // For each place a piece has been
        locations.forEach(loc => {
            // If that place is occupied, value whoever is occupying it
            let piece = gameBoard[loc[0]][loc[1]];
            if (piece !== null) {
                if (piece.affiliation === 0) {
                    // calculate preference
                    popularTileEval += shallowPreferences.popularTilePref;
                } else if (piece.affiliation === 1) {
                    // calculate preference
                    popularTileEval -= shallowPreferences.popularTilePref;
                }
            }
        });
    
        // Favoured tiles preference
        for (let i = 0; i < shallowPreferences.favouredTiles.length; i++) {
            // Set up variables
            let location = shallowPreferences.favouredTiles[i];
            let weight = shallowPreferences.favouredTilePrefs[i];
            let piece = gameBoard[location[0]][location[1]];
    
            // If there's a piece on that tile
            if (piece !== null) {
                if (piece.affiliation === 0) {
                    favouredTileEval += weight; // update the evaluation by the weight of that tile
                } else if (piece.affiliation === 1) {
                    favouredTileEval -= weight; // update the evaluation by the weight of that tile
                }
            }
            
        }
    
        // Adjust evaluation to be player-specific
        let playerAdjuster = (board.plies % 2) === 0 ? -1 : 1;
    
        // return the matrix multiplication of the preferences and the evaluations
        return playerAdjuster * shallowPreferences.verticalSym * verticalSymCount + 
            playerAdjuster * shallowPreferences.horizontalSym * horizontalSymCount + 
            playerAdjuster * shallowPreferences.rotationalSym * rotationalSymCount + 
            (shallowPreferences.lowMove * (pearlLowestMove - onyxLowestMove)) + 
            (shallowPreferences.highMove * (pearlHighestMove - onyxHighestMove)) + 
            favouredTileEval + popularTileEval;
    }

    // Quiescent search only considers attacks in the position
    quiescence(alpha, beta, depth) {
        let board = this.board;

        // Set up values for future use
        const staticEval = this.deepStaticEval();
        // Get attacks for iteration
        const attacks = bU.getAttacks(board, board.plies % 2);
    
        // If we're at the bottom, or there are no attacks, or the game is done
        if (depth === 0 || attacks.length === 0 || board.complete) {
            return (Math.max(depth, 1)) * staticEval; // Bail out and return the position eval, weighing it for more recent positions
        }
    
        // Early beta cutoff
        if (staticEval >= beta) {
            return beta;
        }
        // Update alpha using static eval
        if (staticEval > alpha) {
            alpha = staticEval;
        }
    
        // set up eval variable
        let posEval;
    
        // For each attack
        for (let i = 0; i < attacks.length; i++) {
            const attack = attacks[i];
            // Do the attack
            bU.doEvent(board, attack);
            posEval = -this.quiescence(-beta, -alpha, depth - 1); // get the value after that attack, recursively
            bU.undoLastEvent(board); //undo the attack
    
            // beta cutoff
            if (posEval >= beta) {
                return beta;
            }
            // Softmax alpha cutoff
            if (posEval > alpha) {
                alpha = posEval;
            }
        }
    
        return alpha;
    }
 
    // Negamax minimax variant
    negaMax(alpha, beta, depth) {
        let board = this.board;

        // If we're at the bottom, go into short quiescence search
        if (depth === 0 || board.complete) {
            return this.quiescence(alpha, beta, Math.max(depth, 3));
        }
    
        // set bup variables
        let posEval;
        let moves = bU.getMoves(board, board.plies % 2);
    
        // for each move
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            bU.doEvent(board, move); // do the move
            posEval = -this.negaMax(-beta, -alpha, depth - 1); // get the eval of the position recursively
            bU.undoLastEvent(board); // undo the move
    
            // beta cutoff
            if (posEval >= beta) {
                return posEval;
            }
            // Softmax alpha cutoff
            if (posEval > alpha) {
                alpha = posEval;
            }
        }
    
        // Softmax alpha cutoff
        return alpha;
    
    }

    // Top layer negamax that contains move evals
    chooseMove(depth) {
        // Don't calculate if the game is done
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
            // players miss moves by their forgetfulness trait
            if (rs.randInt(0, 100) < forgetfulness) {
                console.log("OOPS MISSED A MOVE " + move.piece.type + " " + move.from.toString() + " to " + move.to.toString());
            } else {
    
                // calculation and consistency talents
                newDepth = Math.min(Math.ceil(((talents.consistency + (rs.randInt(0, talents.calculation)))/100) * depth), depth);
    
    
                // move making, unmaking, and evaluation
                bU.doEvent(board, move);
    
                shallowEval = this.shallowStaticEval(); // shallow preferences

                // The evaluation of this position is the sum of other evals
                posEval = [-this.negaMax(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, newDepth - 1)
                     + rs.randInt(0, talents.volatility) // volatility talent
                     + (shallowEval * (talents.impulsivity / 100)), // impulsivity talent
                     move];
                bU.undoLastEvent(board);
    

                // inline debugging
                // console.log(posEval[0] + " " + move.piece.type + " " + move.from.toString() + " to " + move.to.toString() + (move.captured !== null ? JSON.stringify(move.captured) : ""));
                
                // If this is the best move, choose it
                if (posEval[0] > bestMove[0]) {
                    bestMove = posEval;
                }
    
            }
    
    
        });
    
    
        // return the best move
        return bestMove;
    }
}
