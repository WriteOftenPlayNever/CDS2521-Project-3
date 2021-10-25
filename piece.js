import * as rs from "./resources.js";
import * as eU from "./enchantment.js";

// PEARL PIECES
export const PEARL_PAWN = newPiece("P", "A Pawn", "./img/pearl/pawn.png", 0, "pawn", buildMP(2, [0, 1]), buildMP(1, [1, 1], [-1, 1]), 
    [rs.objCopy(eU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
export const PEARL_KNIGHT = newPiece("N", "A Knight", "./img/pearl/knight.png", 0, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
export const PEARL_BISHOP = newPiece("B", "A Bishop", "./img/pearl/bishop.png", 0, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
export const PEARL_ROOK = newPiece("R", "A Rook", "./img/pearl/rook.png", 0, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
export const PEARL_QUEEN = newPiece("Q", "A Queen", "./img/pearl/queen.png", 0, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
export const PEARL_KING = newPiece("K", "A King", "./img/pearl/king.png", 0, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);
    
// ONYX PIECES
export const ONYX_PAWN = newPiece("p", "A Pawn", "./img/onyx/pawn.png", 1, "pawn", buildMP(2, [0, -1]), buildMP(1, [1, -1], [-1, -1]), 
    [rs.objCopy(eU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
export const ONYX_KNIGHT = newPiece("n", "A Knight", "./img/onyx/knight.png", 1, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
export const ONYX_BISHOP = newPiece("b", "A Bishop", "./img/onyx/bishop.png", 1, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
export const ONYX_ROOK = newPiece("r", "A Rook", "./img/onyx/rook.png", 1, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
export const ONYX_QUEEN = newPiece("q", "A Queen", "./img/onyx/queen.png", 1, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
export const ONYX_KING = newPiece("k", "A King", "./img/onyx/king.png", 1, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);

// NEUTRAL PIECES
export const ARTIFACT = newPiece("A", "An Artifact", "./img/misc/artifact.png", 3, "artifact", buildMP(0, [0, 0]), null, [], [], ["object", "old"]);
export const LAKE = newPiece("L", "A Lake", "./img/misc/lake.png", 3, "lake", buildMP(0, [0, 0]), null, [], [], ["structure", "natural", "elemental"]);


export function newPiece(char, name, imageDir, affiliation, type, movePattern, attackPattern, enchantments, hats, tags) {
    return {
        char: char,
        name: name,
        image: imageDir,
        affiliation: affiliation,
        type: type,
        moveCount: 0,
        movePattern: movePattern,
        attackPattern: attackPattern === null ? movePattern : attackPattern,
        enchantments: enchantments,
        hats: hats,
        tags: tags
    }
}


export function buildMP(range, ...moves) {
    return {
        range: range,
        movement: moves
    }
}
