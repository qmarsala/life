function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getNeighbors(universe, i, j) {
    let rowLimit = universe.length - 1;
    let columnLimit = universe[0].length - 1;
    let neighbors = [];

    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if (x !== i || y !== j) {
                neighbors.push(universe[x][y]);
            }
        }
    }
    return neighbors;
}

function init() {
    document.getElementById('population').innerHTML = '0';
    document.getElementById('generation').innerHTML = '0';
    area = document.getElementById('areaInput').value;
    count = document.getElementById('countInput').value;
    if (area > 200) area = 200;
    if (count < 10) count = 10;

    let universe = [];
    for (let x = 0; x < 200; x++) {
        universe[x] = new Array();
        for (let y = 0; y < 200; y++) {
            universe[x][y] = false;
        }
    }
    let i = 0;
    while (i < count) {
        universe[getRandomInt(0, area)][getRandomInt(0, area)] = { isOld: false, isAlive: true };
        i++;
    }
    return universe;
}

function nextGeneration(currentUniverse) {
    if (!currentUniverse) {
        return init();
    }

    let nextUniverse = [];
    for (let x = 0; x < currentUniverse.length; x++) {
        nextUniverse[x] = new Array();
        for (let y = 0; y < currentUniverse.length; y++) {
            let neighbours = getNeighbors(currentUniverse, x, y);
            let neighbourAlive = neighbours.filter(c => c).length;

            if (currentUniverse[x][y] && neighbourAlive < 2 || neighbourAlive > 3) {
                nextUniverse[x][y] = false;
                continue;
            }
            if (currentUniverse[x][y] && neighbourAlive === 2 || neighbourAlive === 3) {
                nextUniverse[x][y] = true;
                continue;
            }
            if (!currentUniverse[x][y] && neighbourAlive === 3) {
                nextUniverse[x][y] = true;
                continue;
            }
            nextUniverse[x][y] = false;
        }
    }

    return nextUniverse;
}

function draw(universe) {
    let bgColor = document.getElementById('bgColorInput').value;
    let color = document.getElementById('colorInput').value;
    let canvas = document.getElementById('canvas');
    if (!color || color[0] != '#') {
        color = "#2A9D8F"
    }
    if (!bgColor || bgColor[0] != '#') {
        bgColor = "#264653"
    }
    canvas.style.backgroundColor = bgColor;
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.height, canvas.width);

        for (let i = 0; i < universe.length; i++) {
            for (let j = 0; j < universe.length; j++) {
                const cell = universe[i][j];
                if (!cell) continue;

                let x = j * 6;
                let y = i * 6;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 5, 5);
            }
        }
    }
}

let mainLifeInterval = null;
function life() {
    if (mainLifeInterval) { clearInterval(mainLifeInterval); }
    let universe = init();
    let generation = 0;
    let population = 0;
    let stableCounter = 0;
    document.getElementById('population-wrapper').style.backgroundColor = '#fff';
    draw(universe);

    mainLifeInterval = setInterval(() => {
        let nextUniverse = nextGeneration(universe);
        draw(nextUniverse);

        universe = nextUniverse;
        generation++;
        let newPopulation = universe.flat().filter(x => x).length;
        if (newPopulation === population) {
            stableCounter++;
            if (stableCounter > 50) { 
                document.getElementById('population-wrapper').style.backgroundColor = '#70E000';
            }
        }
        population = newPopulation;
        document.getElementById('population').innerHTML = population;
        document.getElementById('generation').innerHTML = generation;
    }, 150);
}