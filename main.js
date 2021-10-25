let img;

function preload() {
    img = loadImage('img/onyx/druid.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    let test = createVector(200, 250);

    stroke(255);
    fill(0);
    circle(test.x, test.y, randInt(20, 80));

    image(img, 0, 0, 200, 200);

    
}

function draw() {

}
