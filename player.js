const fs = require("fs");
const rs = require("./resources.js");



const readPlayer = (fullName) => {
    let player = null;

    try {
        player = JSON.parse(fs.readFileSync("./players/" + fullName + ".txt", "utf8"));
    } catch (error) {
        console.log("Couldn't find a player by the name of " + fullName);
    }

    return player;
}

const savePlayer = (player) => {
    try {
        fs.writeFileSync("./players/" + player.firstName + " " + player.lastName + ".txt", JSON.stringify(player));
    } catch (error) {
        console.log("Couldn't save player: " + player.firstName + " " + player.lastName + " with error: " + error.toString());
    }
}


//let otherCollated = [<<count>>, otherMoveCount, otherAttackCount, otherDefendCount,
//    otherAdjacency, <<target distance>>, otherFileCount, otherRankCount];

// weights go: value, mobility, attacks, defends, adjacent count, prior moves, target distance, file count, rank count

function generatePlayer(name) {
    let g = (min, max) => Math.floor(rs.grandom(min, max));

    let a1 = n => n === 0 ? [] : [g(-100, 100)].concat(a1(n - 1));
    let a2 = n => n === 0 ? [] : [[g(0, 8), g(0, 8)]].concat(a2(n - 1));
    let favLen = g(1, 10);

    name = name.split(" ");

    let firstName = name.shift();
    let lastName = name.join(" ");

    let thePlayer = {
        firstName: firstName,
        lastName: lastName,
        elo: 1500,
        preferences: {
            pawn: {
                target: [g(0, 8), g(0, 8)],
                weights: [Math.min(g(50, 300), g(50, 300)), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            knight: {
                target: [g(0, 8), g(0, 8)],
                weights: [g(50, 550), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            bishop: {
                target: [g(0, 8), g(0, 8)],
                weights: [Math.min(g(50, 750), g(50, 750)), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            rook: {
                target: [g(0, 8), g(0, 8)],
                weights: [g(50, 950), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            queen: {
                target: [g(0, 8), g(0, 8)],
                weights: [Math.max(g(50, 1300), g(50, 1300)), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            king: {
                target: [g(0, 8), g(0, 8)],
                weights: [10000, g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            },
            other: {
                target: [g(0, 8), g(0, 8)],
                weights: [g(50, 950), g(-50, 50), g(-100, 100), g(-100, 100), g(-100, 100), g(-50, 50), g(-100, 100), g(-50, 50), g(-50, 50)]
            }
        },
        shallowPreferences: {
            verticalSym: g(-50, 50),
            horizontalSym: g(-50, 50),
            rotationalSym: g(-50, 50),
            lowMove: g(-100, 100),
            highMove: g(-100, 100),
            favouredTiles: a2(favLen),
            favouredTilePrefs: a1(favLen),
            popularTilePref: g(-100, 100)
        },
        talents: {
            calculation: Math.max(g(0, 100), g(0, 50)),
            consistency: g(0, 60),
            volatility: Math.min(g(0, 200), g(0, 200)),
            forgetfulness: g(0, 33),
            impulsivity: g(0, 100)
        },
        effects: [],
        openings: {}
    }

    savePlayer(thePlayer);

    return thePlayer;
}


function createRandomPlayer() {
    let names = fs.readFileSync("./players/names.txt", "utf8").split("\n");

    let index = rs.randInt(0, names.length);
    let name = names.splice(index, 1)[0].trim();

    try {
        fs.writeFileSync("./players/names.txt", names.join("\n"));
    } catch (error) {
        console.log(error.toString());
    }

    console.log(name);

    generatePlayer(name);

    return name;
}

module.exports = {
    generatePlayer,
    createRandomPlayer,
    readPlayer,
    savePlayer
}




