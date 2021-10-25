const rs = require("./resources.js");
const bU = require("./board.js");
const dU = require("./deviation.js");
const pU = require("./piece.js");
const evU = require("./event.js");


// piece effect function template (event, board) => {}

const TRIGGERS = {
    ON_MOVE: 0,
    ON_CAPTURE: 1,
    ON_DEATH: 2
}

const DOUBLE_MOVE = newEnchanment("Double First Move", TRIGGERS.ON_MOVE, 
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern.range = 1 } }", 
    "(event, _) => { if (event.piece.moveCount === 1) { event.piece.movePattern.range = 2 } }");

const DIG_SITE = newEnchanment("Dig Site", TRIGGERS.ON_CAPTURE, 
    "(event, board) => { if (Math.random() < 0.1) { bU.doEvent(evU.newCreation(rs.objCopy(pU.ARTIFACT), board.gameBoard[event.from[0]][event.from[1]], event.from)) } }",
    "(event, board) => {}");


function newEnchanment(name, trigger, effect, undo) {
    return {
        name: name,
        trigger: trigger,
        effect: effect,
        undo: undo
    }
}








module.exports = {
    TRIGGERS,
    DOUBLE_MOVE,
    DIG_SITE
}
