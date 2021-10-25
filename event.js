
const EVENT_TYPES = {
    CREATE: 0,
    MOVE: 1,
    COMMENTARY: 3
}


function newCreation(piece, captured, to, isRest) {
    return {
        type: EVENT_TYPES.CREATE,
        rest: isRest,
        description: null,
        piece: piece,
        captured: captured,
        to: to
    }
}

function newMove(piece, captured, from, to, isRest) {
    return {
        type: EVENT_TYPES.MOVE,
        rest: isRest,
        description: null,
        piece: piece,
        captured: captured,
        from: from,
        to: to
    }
}

function newCommentary(description, isRest) {
    return {
        type: EVENT_TYPES.COMMENTARY,
        rest: isRest,
        description: description,
        piece: null,
        captured: null,
        from: null,
        to: null
    }
}

function newEvent(type, isRest, description, piece, captured, from, to) {
    return {
        type: type,
        rest: isRest,
        description: description,
        piece: piece,
        captured: captured,
        from: from,
        to: to
    }
}


module.exports = {
    newMove,
    newCreation,
    EVENT_TYPES
}
