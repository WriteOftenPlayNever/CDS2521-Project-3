import * as game from "./game.js";
import * as bU from "./board.js";
import { players } from "./players.js";

let GAME_INSTANCE;

function makeTag(tagName, parentElement, id, _classList, text) {
    const tag = document.createElement(tagName);

    if (id) tag.id = id;
    if (_classList) tag.classList = _classList;
    if (text) tag.append(text);

    parentElement.appendChild(tag);

    return tag;
}

window.preload = function() {
    let tileSize = (windowHeight * 0.95)/8;
    let corner = createVector((windowWidth - (tileSize * 8))/2, windowHeight * 0.025);

    const playerSelector = document.getElementById("playerSelector");

    for (let playerName in players) {
        makeTag(`option value="${playerName}"`, playerSelector, null, null, playerName);
    }

    GAME_INSTANCE = new game.Game(players["Anne Passant"], players["Ophelia Truthy"], corner, tileSize);
}

window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    console.log(bU.getMovesAt(GAME_INSTANCE.board, 0, 1));
    console.log(bU.getMovesAt(GAME_INSTANCE.board, 1, 0));

    console.log(GAME_INSTANCE.board);

    console.log(bU.getMoves(GAME_INSTANCE.board, 0));

    GAME_INSTANCE.drawToCanvas();
}

window.draw = function() {
    background(255);
    GAME_INSTANCE.drawToCanvas();
}

window.mousePressed = function(mouseEvent) {
    GAME_INSTANCE.mousePressed();
}

window.mouseReleased = function(mouseEvent) {
    GAME_INSTANCE.mouseReleased();
}
