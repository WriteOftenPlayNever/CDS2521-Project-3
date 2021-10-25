import randInt from "./resources.js";

let img;

function preload() {
    img = loadImage('img/onyx/druid.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    let test = createVector(200, 250);

    stroke(255);
    circle(test.x, test.y, 50);

    image(img, 0, 0, 200, 200);

    console.log(randInt(0, 100));
}

function draw() {

}
