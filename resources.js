

export const objCopy = object => JSON.parse(JSON.stringify(object));
export const grandom = (min, max) => ((Math.random() + Math.random()) / 2) * (max - min) + min;
export const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const randSelect = list => list[randInt(0, list.length)];
export const setImageAlpha = (img, alpha) => {
    img.loadPixels();
    for (let index = 0; index < img.pixels.length; index++) {
        if ((index % 4) == 3) {
            img.pixels[index] *= alpha;
        }
    }
    img.updatePixels();
}

