import * as game from "./game.js";
import * as bU from "./board.js";
import { players } from "./players.js";

// The game instance is a global variable
let GAME_INSTANCE;


window.preload = function() {
    let tileSize = (windowHeight * 0.95)/8;
    let corner = createVector((windowWidth - (tileSize * 8))/2, windowHeight * 0.025);

    const playerSelector = document.getElementById("playerSelector");
    const enemySelector = document.getElementById("enemySelector");

    for (let playerName in players) {
        let optionTag = document.createElement("option");
        optionTag.value = playerName;
        optionTag.text = playerName;
        playerSelector.appendChild(optionTag);

        let enemyOptionTag = document.createElement("option");
        enemyOptionTag.value = playerName;
        enemyOptionTag.text = playerName;
        enemySelector.appendChild(enemyOptionTag);
    }

    GAME_INSTANCE = new game.Game(players["Suspenders Heathcliff"], players["Jellybean Zugzwang"], corner, tileSize);
}

window.setup = function() {
    createCanvas(windowWidth * 0.99, windowHeight * 0.99);
    background(255);
    

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

function newGame() {
    const playerSelector = document.getElementById("playerSelector");
    const enemySelector = document.getElementById("enemySelector");

    GAME_INSTANCE = new game.Game(
        players[enemySelector.options[enemySelector.selectedIndex].value], 
        players[playerSelector.options[playerSelector.selectedIndex].value], 
        corner, tileSize);
}

