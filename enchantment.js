import * as rs from "./resources.js";
import * as bU from "./board.js";
import * as evU from "./event.js";
import * as pU from "./piece.js";


// piece effect function template (event, board) => {}

export const TRIGGERS = {
    ON_MOVE: 0,
    ON_CAPTURE: 1,
    ON_DEATH: 2
}

export const DOUBLE_MOVE = newEnchanment("Double First Move", TRIGGERS.ON_MOVE, 
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern.range = 1 } }", 
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern.range = 2 } }");

export const DIG_SITE = newEnchanment("Dig Site", TRIGGERS.ON_CAPTURE, 
    "(event, board) => { console.log(JSON.stringify(event)); bU.doEvent(board, evU.newCreation(rs.objCopy(pU.ARTIFACT), board.gameBoard[event.from[0]][event.from[1]], event.from, false)) }",
    "(_, __) => {}");

export const PROMOTES = newEnchanment("Promotes", TRIGGERS.ON_MOVE,
    `(event, board) => {
        let target = event.piece.affiliation === 0 ? board.gameBoard.length - 1 : 0;
        if (event.to[1] === target) {
            let queen = event.piece.affiliation === 0 ? rs.objCopy(pU.PEARL_QUEEN) : rs.objCopy(pU.ONYX_QUEEN);
            let promotionEvent = evU.newCreation(queen, board.gameBoard[event.to[0]][event.to[1]], event.to, false);
            bU.doEvent(board, promotionEvent);
        }
    }`,
    "(_, __) => {}");

export const HIEROPHANT = newEnchanment("Hierophant", TRIGGERS.ON_MOVE,
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern = pU.buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]) } }", 
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern = pU.buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]) } }");

export const WINDUP = newEnchanment("Windup", TRIGGERS.ON_MOVE,
    "(event, _) => { if (event.piece.movePattern.range > 1) { event.piece.movePattern.range-- ; event.piece.attackPattern.range--; } }", 
    "(event, _) => { event.piece.movePattern.range++; event.piece.attackPattern.range++; }");

export const SPAWN = newEnchanment("Spawn", TRIGGERS.ON_CAPTURE, 
    `(event, board) => {
        if (event.piece.affiliation === 0) {
            let spawnEvent = evU.newCreation(rs.objCopy(pU.PEARL_PAWN), board.gameBoard[event.from[0]][event.from[1]], event.from, false);
            bU.doEvent(board, spawnEvent);
        } else {
            let spawnEvent = evU.newCreation(rs.objCopy(pU.ONYX_PAWN), board.gameBoard[event.from[0]][event.from[1]], event.from, false);
            bU.doEvent(board, spawnEvent);
        }
    }`,
    `(_, __) => {}`);

export const SPAWN_SPECIFIC = (piece) => newEnchanment("Spawn from " + piece.name, TRIGGERS.ON_CAPTURE,
        `(event, board) => {
            if (event.caputured.type === '${piece.type}') {
                if (event.piece.affiliation === 0) {
                    board.gameBoard[event.from[0]][event.from[1]] = rs.objCopy(pU.PEARL_PAWN);
                } else {
                    board.gameBoard[event.from[0]][event.from[1]] = rs.objCopy(pU.ONYX_PAWN);
                }
            }
        }`,
        `(_, __) => {}`);


export function newEnchanment(name, trigger, effect, undo) {
    return {
        name: name,
        trigger: trigger,
        effect: effect,
        undo: undo
    }
}






