import * as rs from "./resources.js";
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


export function newDeviation(name, description, activation, effect) {
    return {
        name: name,
        description: description,
        activation: activation,
        effect: effect
    }
}

