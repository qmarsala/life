const universe = [];
let generations = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateCluster(transform) {
    let clusterSize = getRandomInt(1, 7);
    if (clusterSize < 2) clusterSize = 2;
    while (clusterSize > 1) {
        let x = getRandomInt(0, clusterSize);
        let y = getRandomInt(0, clusterSize);
        universe[x + transform.x][y + transform.y] = { isOld: false, isAlive: true };
        clusterSize--;
    }
}

function init() {
    for (let x = 0; x < 100; x++) {
        universe[x] = new Array();
        for (let y = 0; y < 100; y++) {
            universe[x][y] = { isOld: false, isAlive: false };
        }
    }

    let i = 0;
    let transforms = [
        { x: 0, y: 0 },
        { x: getRandomInt(10, 20), y: getRandomInt(10, 20) },
        { x: getRandomInt(10, 40), y: getRandomInt(10, 40) },
        { x: getRandomInt(10, 60), y: getRandomInt(10, 60) },
        { x: getRandomInt(10, 70), y: getRandomInt(10, 70) },
    ];
    while (i <= 20) {
        for (let t = 0; t < transforms.length; t++) {
            generateCluster(transforms[t]);
        }
        i++;
    }
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

function life() {
    for (let x = 0; x < universe.length; x++) {
        for (let y = 0; y < universe.length; y++) {
            let currentCell = universe[x][y];
            let neighbors = getNeighbors(universe, x, y);
            let liveNeighbors = neighbors.filter(c => c.isAlive).length;
            if (currentCell.isOld) {
                universe[x][y].isAlive = false;
            }

            if (currentCell.isAlive) {
                if (liveNeighbors === 2 || liveNeighbors === 3) {
                    universe[x][y].isOld = true;
                } else {
                    universe[x][y].isAlive = false;
                }
            } else {
                if (liveNeighbors === 3) {
                    universe[x][y].isAlive = true;
                    universe[x][y].isOld = false;
                }
            }
        }
    }
    generations++;
    draw();
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
                let x = 10 + j * 11; // x coordinate
                let y = 10 + i * 11; // y coordinate
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillRect(x, y, 10, 10);
            }
        }
    }
}

init();
draw();
setInterval(life, 100);