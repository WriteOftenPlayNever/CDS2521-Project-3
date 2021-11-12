import * as game from "./game.js";
import * as bU from "./board.js";
import { players } from "./players.js";

// The game instance is a global variable
let GAME_INSTANCE;


window.preload = function() {
    // The size of a tile of the board is 1/8th of 95% of the height of the screen
    let tileSize = (windowHeight * 0.95)/8;
    // The location of the corner of the board can then be found by this equation
    let corner = createVector((windowWidth - (tileSize * 8))/2, windowHeight * 0.025);

    // The DOM elements for the two dropdown boxes
    const playerSelector = document.getElementById("playerSelector");
    const enemySelector = document.getElementById("enemySelector");

    // Add the players to the dropdown boxes
    for (let playerName in players) {
        // Creation a new "option" element
        let optionTag = document.createElement("option");
        // Set the value to the player name
        optionTag.value = playerName;
        // set the text inside it to the player name
        optionTag.text = playerName;
        // Append it to the selector
        playerSelector.appendChild(optionTag);

        // Creation a new "option" element
        let enemyOptionTag = document.createElement("option");
        // Set the value to the player name
        enemyOptionTag.value = playerName;
        // set the text inside it to the player name
        enemyOptionTag.text = playerName;
        // Append it to the selector
        enemySelector.appendChild(enemyOptionTag);
    }

    // Add a listener on the two dropdown boxes for when they change and call the newGame function
    playerSelector.addEventListener("change", newGame);
    enemySelector.addEventListener("change", newGame);

    // Create the default game instance, between two Suspenders Heathcliff copies
    GAME_INSTANCE = new game.Game(players["Suspenders Heathcliff"], players["Suspenders Heathcliff"], corner, tileSize);
}

// Create the canvas, slightly inside the window bounds
window.setup = function() {
    // canvas takes up 99% of the window space
    createCanvas(windowWidth * 0.99, windowHeight * 0.99);
    // Se the background to white
    background(255);
    

    GAME_INSTANCE.drawToCanvas();
}

window.draw = function() {
    // Reset the canvas
    background(255);
    // Draw the game instance
    GAME_INSTANCE.drawToCanvas();
}

window.mousePressed = function(mouseEvent) {
    // Offload the mouse event to the game
    GAME_INSTANCE.mousePressed();
}

window.mouseReleased = function(mouseEvent) {
    // Offload the mouse event to the game
    GAME_INSTANCE.mouseReleased();
}

function newGame() {
    // Grab the DOM elements for the dropdown boxes
    const playerSelector = document.getElementById("playerSelector");
    const enemySelector = document.getElementById("enemySelector");

    // Create a new game, using the currently selected values from those boxes
    GAME_INSTANCE = new game.Game(
        players[enemySelector.options[enemySelector.selectedIndex].value], 
        players[playerSelector.options[playerSelector.selectedIndex].value], 
        corner, tileSize);
}

