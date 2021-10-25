import * as game from "./game.js";

window.preload = function () {
    
}

window.setup = function () {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    let test = createVector(200, 250);

    stroke(255);
    fill(0);
    circle(test.x, test.y, 50);


    game.createGame(0, 0);
}

window.draw = function () {

}
