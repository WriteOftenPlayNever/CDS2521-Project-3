import * as game from "./game.js";

window.preload = function () {
    
}

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    let test = createVector(100, 250);

    stroke(255);
    fill(0);
    circle(test.x, test.y, 50);

    game.newGame();
}

window.draw = function () {

}
