

const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
const objCopy = object => JSON.parse(JSON.stringify(object));
const grandom = (min, max) => ((Math.random() + Math.random()) / 2) * (max - min) + min;
const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);


module.exports = {
    guid,
    objCopy,
    grandom,
    randInt
}