import * as rs from "./resources.js";
import * as enU from "./enchantment.js";


//
// PIECE DATA
//

// PEARL PIECES
export const PEARL_PAWN = newPiece("P", "a pawn", "./img/pearl/pawn.png", 0, "pawn", buildMP(2, [0, 1]), buildMP(1, [1, 1], [-1, 1]), 
    [rs.objCopy(enU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
export const PEARL_KNIGHT = newPiece("N", "a knight", "./img/pearl/knight.png", 0, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
export const PEARL_BISHOP = newPiece("B", "a bishop", "./img/pearl/bishop.png", 0, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
export const PEARL_ROOK = newPiece("R", "a rook", "./img/pearl/rook.png", 0, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
export const PEARL_QUEEN = newPiece("Q", "a queen", "./img/pearl/queen.png", 0, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
export const PEARL_KING = newPiece("K", "a king", "./img/pearl/king.png", 0, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);
export const PEARL_FLOWER = newPiece("F", "a flower", "./img/pearl/flower.png", 0, "flower", buildMP(0, [0, 0]), buildMP(1, [1, 1], [-1, 1], [1, -1], [-1, -1]), 
        [], [], ["natural", "plant"]);
export const PEARL_INSCRUTABLE_ORB = newPiece("Ø", "Inscrutable Orb", "./img/pearl/orb.png", 0, "inscrutable", buildMP(1, [[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-1,-2],[-1,2],[0,-2],[0,2],[1,-2],[1,2],[2,-2],[2,-1],[2,0],[2,1],[2,2]]), null, 
        [], [], ["magic", "science", "object"]);
export const PEARL_CRAB = newPiece("C", "a crab", "./img/pearl/crab.png", 0, "crab", buildMP(1, [0, 1], [-1, 0], [1, 0]), buildMP(2, [-1, 0], [1, 0]), 
        [], [], ["animal", "armoured", "aquatic", "proletariat"]);
export const PEARL_ELEPHANT = newPiece("E", "an elephant", "./img/pearl/elephant.png", 0, "elephant", buildMP(1, [-2, 2], [2, 2], [2, -2], [-2, -2]), null,
        [], [], ["military", "animal"]);
export const PEARL_VALKYRIE = newPiece("V", "a valkyrie", "./img/pearl/valkyrie.png", 0, "valkyrie", buildMP(3, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
        [], [], ["military", "armoured", "flying", "magic"]);
export const PEARL_MISSILE = newPiece("M", "A Missile", "./img/pearl/missile.png", 0, "missile", buildMP(3, [0, 1]), buildMP(3, [0, 1]), 
        [], [], ["military"]);
    
// ONYX PIECES
export const ONYX_PAWN = newPiece("p", "a pawn", "./img/onyx/pawn.png", 1, "pawn", buildMP(2, [0, -1]), buildMP(1, [1, -1], [-1, -1]), 
    [rs.objCopy(enU.DOUBLE_MOVE)], [], ["military", "proletariat"]);
export const ONYX_KNIGHT = newPiece("n", "a knight", "./img/onyx/knight.png", 1, "knight", buildMP(1, [2, 1], [-1, 2], [2, -1], [-1, -2], [-2, 1], [1, 2], [-2, -1], [1, -2]), null, 
    [], [], ["military", "animal", "armoured"]);
export const ONYX_BISHOP = newPiece("b", "a bishop", "./img/onyx/bishop.png", 1, "bishop", buildMP(8, [1, 1], [-1, 1], [1, -1], [-1, -1]), null, [], [], ["magic", "religious"]);
export const ONYX_ROOK = newPiece("r", "a rook", "./img/onyx/rook.png", 1, "rook", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1]), null, [], [], ["military", "structure", "armoured"]);
export const ONYX_QUEEN = newPiece("q", "a queen", "./img/onyx/queen.png", 1, "queen", buildMP(8, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null, 
    [], [], ["noble"]);
export const ONYX_KING = newPiece("k", "a king", "./img/onyx/king.png", 1, "king", buildMP(1, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
    [], [], ["noble"]);
export const ONYX_FLOWER = newPiece("f", "a flower", "./img/onyx/flower.png", 1, "flower", buildMP(0, [0, 0]), buildMP(1, [1, 1], [-1, 1], [1, -1], [-1, -1]), 
        [], [], ["natural", "plant"]);
export const ONYX_INSCRUTABLE_ORB = newPiece("ø", "Inscrutable Orb", "./img/onyx/orb.png", 1, "inscrutable", buildMP(1, [[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-1,-2],[-1,2],[0,-2],[0,2],[1,-2],[1,2],[2,-2],[2,-1],[2,0],[2,1],[2,2]]), null, 
        [], [], ["magic", "science", "aquatic", "object"]);
export const ONYX_CRAB = newPiece("c", "a crab", "./img/onyx/crab.png", 1, "crab", buildMP(1, [0, -1], [-1, 0], [1, 0]), buildMP(2, [-1, 0], [1, 0]), 
        [], [], ["animal", "armoured", "aquatic", "proletariat"]);
export const ONYX_ELEPHANT = newPiece("e", "an elephant", "./img/onyx/elephant.png", 1, "elephant", buildMP(1, [-2, 2], [2, 2], [2, -2], [-2, -2]), null,
        [], [], ["military", "animal"]);
export const ONYX_VALKYRIE = newPiece("v", "a valkyrie", "./img/onyx/valkyrie.png", 1, "valkyrie", buildMP(3, [1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, 1], [1, -1], [-1, -1]), null,
        [], [], ["military", "armoured", "flying", "magic"]);
export const ONYX_MISSILE = newPiece("M", "a Missile", "./img/onyx/missile.png", 0, "missile", buildMP(3, [0, -1]), buildMP(3, [0, -1]), 
        [], [], ["military"]);

// NEUTRAL PIECES
export const ARTIFACT = newPiece("A", "An Artifact", "./img/misc/artifact.png", 3, "artifact", buildMP(0, [0, 0]), null, [], [], ["object", "old"]);
export const LAKE = newPiece("L", "A Lake", "./img/misc/lake.png", 3, "lake", buildMP(0, [0, 0]), null, [], [], ["structure", "natural", "elemental"]);


// Piece JSON builder
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

// Piece movepattern builder
export function buildMP(range, ...moves) {
    return {
        range: range,
        movement: moves
    }
}
