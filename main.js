import * as game from "./game.js";
import { players } from "./players.js";

window.preload = function () {
    
}

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    background(255);

    let tileSize = windowHeight/8;
    let corner = createVector((windowWidth - (tileSize * 8))/2, 0);
    
    let test = new game.Game(players["Anne Passant"], players["Ophelia Truthy"], corner, tileSize);

    test.drawToCanvas();
}

window.draw = function () {

}
