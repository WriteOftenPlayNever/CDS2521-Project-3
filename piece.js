const rs = require("./resources.js");
const eU = require("./enchantment.js");

// PEARL PIECES
const PEARL_PAWN = newPiece("P", "A Pawn", "./img/pearl/pawn.png", 0, "pawn", buildMP(2, [0, 1]), buildMP(1, [1, 1], [-1, 1]), 
    [rs.objCopy(eU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
const PEARL_KNIGHT = newPiece("N", "A Knight", "./img/pearl/knight.png", 0, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
const PEARL_BISHOP = newPiece("B", "A Bishop", "./img/pearl/bishop.png", 0, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
const PEARL_ROOK = newPiece("R", "A Rook", "./img/pearl/rook.png", 0, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
const PEARL_QUEEN = newPiece("Q", "A Queen", "./img/pearl/queen.png", 0, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
const PEARL_KING = newPiece("K", "A King", "./img/pearl/king.png", 0, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);
    
// ONYX PIECES
const ONYX_PAWN = newPiece("p", "A Pawn", "./img/onyx/pawn.png", 1, "pawn", buildMP(2, [0, -1]), buildMP(1, [1, -1], [-1, -1]), 
    [rs.objCopy(eU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
const ONYX_KNIGHT = newPiece("n", "A Knight", "./img/onyx/knight.png", 1, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
const ONYX_BISHOP = newPiece("b", "A Bishop", "./img/onyx/bishop.png", 1, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
const ONYX_ROOK = newPiece("r", "A Rook", "./img/onyx/rook.png", 1, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
const ONYX_QUEEN = newPiece("q", "A Queen", "./img/onyx/queen.png", 1, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
const ONYX_KING = newPiece("k", "A King", "./img/onyx/king.png", 1, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);

// NEUTRAL PIECES
const ARTIFACT = newPiece("A", "An Artifact", "./img/misc/artifact.png", 3, "artifact", buildMP(0, [0, 0]), null, [], [], ["object", "old"]);
const LAKE = newPiece("L", "A Lake", "./img/misc/lake.png", 3, "lake", buildMP(0, [0, 0]), null, [], [], ["structure", "natural", "elemental"]);


function newPiece(char, name, imageDir, affiliation, type, movePattern, attackPattern, enchantments, hats, tags) {
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


function buildMP(range, ...moves) {
    return {
        range: range,
        movement: moves
    }
}



module.exports = {
    newPiece,
    buildMP,
    PEARL_PAWN,
    PEARL_KNIGHT,
    PEARL_BISHOP,
    PEARL_ROOK,
    PEARL_QUEEN,
    PEARL_KING,
    ONYX_PAWN,
    ONYX_KNIGHT,
    ONYX_BISHOP,
    ONYX_ROOK,
    ONYX_QUEEN,
    ONYX_KING,
    ARTIFACT
}