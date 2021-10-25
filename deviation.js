

const ACTIVATION = {
    START_GAME: 0,
    END_TURN: 1,
    END_GAME: 2
}

// devation effect function template game => ()


function newDeviation(name, description, activation, effect) {
    return {
        name: name,
        description: description,
        activation: activation,
        effect: effect
    }
}


module.exports = {
    ACTIVATION
}
