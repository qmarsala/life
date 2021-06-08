let history = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getNeighbors(universe, i, j) {
    let gridSize = universe.length - 1;
    let neighbors = [];

    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, gridSize); x++) {
        for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, gridSize); y++) {
            if (x !== i || y !== j) {
                neighbors.push(universe[x][y]);
            }
        }
    }
    return neighbors;
}

function init(gridSize, count, startingArea, startingTranslation) {
    if (startingArea > gridSize - startingTranslation) startingArea = gridSize - startingTranslation;
    if (count < 3) count = 3;

    let universe = [];
    for (let x = 0; x < gridSize; x++) {
        universe[x] = new Array();
        for (let y = 0; y < gridSize; y++) {
            universe[x][y] = false;
        }
    }
    let i = 0;
    while (i < count) {
        universe[getRandomInt(0, startingArea) + startingTranslation][getRandomInt(0, startingArea) + startingTranslation] = true;
        i++;
    }
    return universe;
}

function nextGeneration(currentUniverse) {
    if (!currentUniverse) {
        return init();
    }

    history.push(currentUniverse);
    if (history.length > 15) {
        history = history.slice(Math.max(history.length - 15, 1))
    }

    let nextUniverse = [];
    for (let x = 0; x < currentUniverse.length; x++) {
        nextUniverse[x] = new Array();
        for (let y = 0; y < currentUniverse.length; y++) {
            let neighbours = getNeighbors(currentUniverse, x, y);
            let neighboursAlive = neighbours.filter(c => c).length;
            let cellIsAlive = currentUniverse[x][y];

            if (cellIsAlive && neighboursAlive < 2 || neighboursAlive > 3) {
                nextUniverse[x][y] = false;
            }
            else if (cellIsAlive && neighboursAlive === 2 || neighboursAlive === 3) {
                nextUniverse[x][y] = true;
            }
            else if (!cellIsAlive && neighboursAlive === 3) {
                nextUniverse[x][y] = true;
            } else {
                nextUniverse[x][y] = false;
            }
        }
    }

    return nextUniverse;
}

function previousGeneration() {
    return history.length > 1 
        ? history.pop()
        : undefined;
}

export { init, nextGeneration, previousGeneration, getRandomInt };