const initCell = { isOld: false, isAlive: false };
const universe = new Array(200)
    .fill(initCell)
    .map(() => new Array(200)
        .fill(initCell));
let generations = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateCluster(startX, startY) {
    let x = startX;
    let y = startY;
    let clusterSize = 0;
    while (clusterSize < 45) {
        universe[x][y] = { isOld: false, isAlive: true };
        x = getRandomInt(x - 2, x + 2);
        y = getRandomInt(y - 2, y + 2);
        if (x < 0 || x > universe.length){
            x = startX;
        }
        if (y < 0 || y > universe.length){
            y = startY;
        }
        clusterSize++;
    }
}

function init() {
    generateCluster(getRandomInt(25, 50), getRandomInt(25, 50));
    draw();
}

function getNeighbors(i, j) {
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

function draw() {
    let canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.height, canvas.width);

        for (let i = 0; i < universe.length; i++) {
            for (let j = 0; j < universe.length; j++) {
                const cell = universe[i][j];
                if (!cell.isAlive) continue;
                let x = j * 6; // x coordinate
                let y = i * 6; // y coordinate
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillRect(x, y, 5, 5);
            }
        }
    }
}

function life() {
    let stableState = "";
    let repeat = 0;
    let repeatLimit = 25;
    let lifeInterval = setInterval(() => {
        for (let x = 0; x < universe.length; x++) {
            for (let y = 0; y < universe.length; y++) {
                let currentCell = universe[x][y];
                let neighbors = getNeighbors(x, y);
                let liveNeighbors = neighbors.filter(c => c.isAlive).length;
                if (currentCell.isOld) {
                    universe[x][y].isAlive = false;
                }

                if (currentCell.isAlive && liveNeighbors === 2 || liveNeighbors === 3) {
                    universe[x][y].isAlive = true;
                } else if (currentCell.isAlive && liveNeighbors < 2 || liveNeighbors > 3) {
                    universe[x][y].isAlive = false;
                }
                else if (liveNeighbors === 3) {
                    universe[x][y].isAlive = true;
                    universe[x][y].isOld = false;
                } else {
                    universe[x][y].isOld = true;
                }
            }
        }
        generations++;
        draw();

        if (universe.flat().every(c => !c.isAlive)) {
            clearInterval(lifeInterval);
            alert(`universe died after ${generations} generations.  refresh to start over.`);
        }

        let newState = universe.flatMap(c => c.isAlive).join();
        if (stableState === newState) {
            repeat++;
            if (repeat > repeatLimit) {
                clearInterval(lifeInterval);
                alert(`universe has become stable after ${generations} generations.  refresh to start over.`);
            }
        } else {
            stableState = newState;
        }
        console.log('tick');
    }, 250);
}

init();
life();