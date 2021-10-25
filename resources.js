

const objCopy = object => JSON.parse(JSON.stringify(object));
const grandom = (min, max) => ((Math.random() + Math.random()) / 2) * (max - min) + min;
const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
