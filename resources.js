

// GENERAL FUNCTIONS
// Copy a JSON object
export const objCopy = object => JSON.parse(JSON.stringify(object));
// A slightly middle weighted random value
export const grandom = (min, max) => ((Math.random() + Math.random()) / 2) * (max - min) + min;
// Random int between bounds
export const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
// Select randomly from a list
export const randSelect = list => list[randInt(0, list.length)];
// Set the alpha of an image
export const setImageAlpha = (img, alpha) => {
    img.loadPixels();
    for (let index = 0; index < img.pixels.length; index++) {
        if ((index % 4) == 3) {
            img.pixels[index] *= alpha;
        }
    }
    img.updatePixels();
}

