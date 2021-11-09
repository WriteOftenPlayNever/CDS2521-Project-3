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
    "(event, board) => { if (Math.random() < 1) { console.log(JSON.stringify(event)); bU.doEvent(evU.newCreation(rs.objCopy(pU.ARTIFACT), board.gameBoard[event.from[0]][event.from[1]], event.from)) } }",
    "(event, board) => {}");


export function newEnchanment(name, trigger, effect, undo) {
    return {
        name: name,
        trigger: trigger,
        effect: effect,
        undo: undo
    }
}






