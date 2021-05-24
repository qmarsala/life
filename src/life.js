const initCell = { isOld: false, isAlive: false };
const universe = new Array(1000)
    .fill(initCell)
    .map(() => new Array(1000)
        .fill(initCell));
let generations = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateCluster(tX, tY) {
    let clusterSize = getRandomInt(1, 7);
    if (clusterSize < 2) clusterSize = 2;
    while (clusterSize > 1) {
        let x = getRandomInt(0, clusterSize);
        let y = getRandomInt(0, clusterSize);
        universe[x + tX][y + tY] = { isOld: false, isAlive: true };
        clusterSize--;
    }
}

function init() {
    let i = 0;
    while (i <= 2) {
        generateCluster(0, 0);
        generateCluster(50, 50);
        i++;
    }
    draw();
}

function getNeighbors(myArray, i, j) {
    let rowLimit = myArray.length - 1;
    let columnLimit = myArray[0].length - 1;
    let neighbors = [];

    for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if (x !== i || y !== j) {
                neighbors.push(myArray[x][y]);
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
    let lifeInterval = setInterval(() => {
        for (let x = 0; x < universe.length; x++) {
            for (let y = 0; y < universe.length; y++) {
                let currentCell = universe[x][y];
                let neighbors = getNeighbors(universe, x, y);
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
    }, 100);
}

init();
life();
