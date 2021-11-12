import * as rs from "./resources.js";
import * as pU from "./piece.js";
import * as bU from "./board.js";
import * as evU from "./event.js";
import * as enU from "./enchantment.js";

export const ACTIVATION = {
    START_GAME: 0,
    END_TURN: 1,
    END_GAME: 2
}

// devation effect function template game => ()
export const HACKING = newDeviation("Hacking", "At the start of the game, an enemy non-pawn is turned into a pawn.", ACTIVATION.START_GAME, 
`(game, affiliation) => { 
    let board = game.board, 
        gameBoard = game.board.gameBoard, 
        locations = [],
        player = affiliation === 0 ? game.pearlPlayer : game.onyxPlayer;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation != affiliation && piece.type != "king" && piece.type != "pawn") {
                    locations.push([x, y]);
                }
            }
        }
    }
    let thePawn = affiliation === 0 ? rs.objCopy(pU.ONYX_PAWN) : rs.objCopy(pU.PEARL_PAWN);
    let target = rs.randSelect(locations);
    let captured = gameBoard[target[0]][target[1]];
    bU.doEvent(board, evU.newCreation(thePawn, captured, target, false));
    bU.doEvent(board, evU.newCommentary(player.firstName + " " + player.lastName + "\'s hacked into the mainframe and turned "
         + captured.name + " into a pawn.", false));
}`);

export const ARCHAEOLOGY = newDeviation("Archaeology", "When friendly rooks capture a piece, it leaves behind an Artefact.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && piece.type == "rook") {
                    piece.enchantments.push(rs.objCopy(enU.DIG_SITE));
                }
            }
        }
    }
}`);

export const HEAVY_CAVALRY = newDeviation("Heavy Cavalry", "No knights, elephants instead.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && piece.type == "knight") {
                    gameBoard[x][y] = affiliation == 0 ? rs.objCopy(pU.PEARL_ELEPHANT) : rs.objCopy(pU.ONYX_ELEPHANT);
                }
            }
        }
    }
}`);

export const MILITANT_THEOCRACY = newDeviation("Militant Theocracy", "No knights, no rooks, only bishops.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "knight" || piece.type == "rook")) {
                    gameBoard[x][y] = affiliation == 0 ? rs.objCopy(pU.PEARL_BISHOP) : rs.objCopy(pU.ONYX_BISHOP);
                }
            }
        }
    }
}`);

export const GARDENING = newDeviation("Gardening", "When the queen or bishop capture a piece, they plant a flower.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "queen" || piece.type == "bishop")) {
                    piece.enchantments.push(rs.objCopy(enU.GARDENER));
                }
            }
        }
    }
}`)

export const VALKYRIES = newDeviation("Valkyries", "Instead of bishops, the royals are flanked by valkyries.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "bishop")) {
                    gameBoard[x][y] = affiliation == 0 ? rs.objCopy(pU.PEARL_VALKYRIE) : rs.objCopy(pU.ONYX_VALKYRIE);
                }
            }
        }
    }
}`);

export const CRAB_ARMY = newDeviation("Crab Army", "An undersea invasion!", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "pawn")) {
                    gameBoard[x][y] = affiliation == 0 ? rs.objCopy(pU.PEARL_CRAB) : rs.objCopy(pU.ONYX_CRAB);
                }
            }
        }
    }
}`)

export const INSCRUTABLE_ORB = newDeviation("Inscrutable Orb", "There is an orb that cannot be scrute.", ACTIVATION.START_GAME,
`(game, affiliation) => { 
    let board = game.board, 
        gameBoard = game.board.gameBoard, 
        locations = [],

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && piece.type != "king" && piece.type != "pawn") {
                    locations.push([x, y]);
                }
            }
        }
    }
    let theOrb = affiliation === 0 ? rs.objCopy(pU.ONYX_INSCRUTABLE_ORB) : rs.objCopy(pU.PEARL_INSCRUTABLE_ORB);
    let target = rs.randSelect(locations);
    gameBoard[target[0]][target[1]] = theOrb;
}`)

export const MISSILE_DEFENSE = newDeviation("Missile Defense", "Two of the pawns have been replaced with missiles.", ACTIVATION.START_GAME, 
`(game, affiliation) => { 
    let board = game.board, 
        gameBoard = game.board.gameBoard, 
        locations = [],

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && piece.type == "pawn") {
                    locations.push([x, y]);
                }
            }
        }
    }
    let firstMissile = affiliation === 0 ? rs.objCopy(pU.ONYX_MISSILE) : rs.objCopy(pU.PEARL_MISSILE);
    let secondMissile = affiliation === 0 ? rs.objCopy(pU.ONYX_MISSILE) : rs.objCopy(pU.PEARL_MISSILE);
    let firstTarget = rs.randSelect(locations);
    let secondTarget = rs.randSelect(locations);
    gameBoard[firstTarget[0]][firstTarget[1]] = firstMissile;
    gameBoard[secondTarget[0]][secondTarget[1]] = secondMissile;
}`)

export const SCRAMBLED = newDeviation("Scrambled", "The back row has been scrambled.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard,
        rank = affiliation === 0 ? 0 : 7; // If white, first rank, otherwise 8th

    // Swap the positions of pieces on that rank 12 times
    for (let i = 0; i < 12; i++) {
        // Choose two random x values
        let x1 = rs.randInt(0, 8);
        let x2 = rs.randInt(0, 8);
        // Hold the value to be swapped
        let swapHolder = gameBoard[x1][rank];
        // Set the pieces to each other's locaitons, using the swapholder
        gameBoard[x1][rank] = gameBoard[x2][rank];
        gameBoard[x2][rank] = swapHolder;
    }
}`);

export const TROJAN_HORSE = newDeviation("Trojan Horse", "There are secret troops inside the knight.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "knight")) {
                    piece.enchantments.push(rs.objCopy(enU.SPAWN));
                }
            }
        }
    }
}`);

export const ANNIHILATION = newDeviation("Annihilation", "If a non-pawn captures an enemy piece of the same type, it Hadronises.", ACTIVATION.START_GAME,
    `(game, affiliation) => {
        let board = game.board, 
        gameBoard = game.board.gameBoard, 
        player = affiliation === 0 ? game.pearl.player : game.onyx.player;

        for (let x = 0; x < gameBoard.length; x++) {
            for (let y = 0; y < gameBoard.length; y++) {
                let piece = gameBoard[x][y];
                if (piece != null) {
                    if (piece.affiliation == affiliation && piece.type != "king" && piece.type != "pawn") {
                        piece.enchantments.push(enU.SPAWN_SPECIFIC(piece));
                    }
                }
            }
        }
    }`);

export const GOD_KING = newDeviation("God King.", "The king moves like a bishop for its first move.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "king")) {
                    piece.enchantments.push(rs.objCopy(enU.HIEROPHANT));
                }
            }
        }
    }
}`) ;

export const E6 = newDeviation("E6", "There is a pawn on e6.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    if (affiliation === 0) {
        gameBoard[4][5] = rs.objCopy(pU.PEARL_PAWN);
    } else {
        gameBoard[4][5] = rs.objCopy(pU.ONYX_PAWN);
    }
}`)

export const MILITOCRACY = newDeviation("Militocracy", "No bishops, no rooks, only knights.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "bishop" || piece.type == "rook")) {
                    gameBoard[x][y] = affiliation == 0 ? rs.objCopy(pU.PEARL_KNIGHT) : rs.objCopy(pU.ONYX_KNIGHT);
                }
            }
        }
    }
}`);

export const REVOLUTIONARIES = newDeviation("Revolutionaries", "The queen is dead, and the population is roused to action.", ACTIVATION.START_GAME,
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && (piece.type == "queen")) {
                    gameBoard[x][y] = null; // Queen removed
                }
            }
        }
    }

    if (affiliation) {
        for (let i = 0; i < 4; i++) {
            gameBoard[rs.randInt(0, 8)][5] = rs.objCopy(pU.ONYX_PAWN);
        }
    } else {
        for (let i = 0; i < 4; i++) {
            gameBoard[rs.randInt(0, 8)][2] = rs.objCopy(pU.PEARL_PAWN);
        }
    }
}`);

export const CAVALRY_TACTICS = newDeviation("Cavalry Tactics", "When knights capture, they'll move back to safety.", ACTIVATION.START_GAME, 
`(game, affiliation) => {
    let gameBoard = game.board.gameBoard;

    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            let piece = gameBoard[x][y];
            if (piece != null) {
                if (piece.affiliation == affiliation && piece.type == "knight") {
                    piece.enchantments.push(rs.objCopy(enU.SKIRMISH));
                }
            }
        }
    }
}`);


export function newDeviation(name, description, activation, effect) {
    return {
        name: name,
        description: description,
        activation: activation,
        effect: effect
    }
}

