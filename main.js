import * as game from "./game.js";
import { players } from "./players.js";

let GAME_INSTANCE;

window.preload = function() {
    
}

window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    let tileSize = windowHeight/8;
    let corner = createVector((windowWidth - (tileSize * 8))/2, 0);
    
    GAME_INSTANCE = new game.Game(players["Anne Passant"], players["Ophelia Truthy"], corner, tileSize);

    GAME_INSTANCE.drawToCanvas();
}

window.draw = function() {
    background(0);
    GAME_INSTANCE.drawToCanvas();
}

window.mousePressed = function(mouseEvent) {
    GAME_INSTANCE.mousePressed();
}

window.mouseReleased = function(mouseEvent) {
    GAME_INSTANCE.mouseReleased();
}
