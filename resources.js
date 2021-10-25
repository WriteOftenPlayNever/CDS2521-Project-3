

export const objCopy = object => JSON.parse(JSON.stringify(object));
export const grandom = (min, max) => ((Math.random() + Math.random()) / 2) * (max - min) + min;
export const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const setImageAlpha = (img, alpha) => {
    img.loadPixels();
    for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {
            let index = (x + y * width) * 4;
            img.pixels[index] = (alpha * 255);
        }
    }
    img.updatePixels();
}

