let img;

function preload() {
    img = loadImage('Language.JPG');
}

function setup() {
    createCanvas(400, 400);
    background(0);
    
    let test = createVector(200, 250);

    stroke(255);
    circle(test.x, test.y, 50);

    image(img, 0, 0, 200, 200);
}

function draw() {

}
