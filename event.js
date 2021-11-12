
// Event type enum
export const EVENT_TYPES = {
    CREATE: 0,
    MOVE: 1,
    COMMENTARY: 3
}

// Creation event builder
export function newCreation(piece, captured, to, isRest) {
    return {
        type: EVENT_TYPES.CREATE,
        rest: isRest,
        description: null,
        piece: piece,
        captured: captured,
        to: to
    }
}

// move event builder
export function newMove(piece, captured, from, to, isRest) {
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

// commentary event builder
export function newCommentary(description, isRest) {
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

// generalised event builder
export function newEvent(type, isRest, description, piece, captured, from, to) {
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
