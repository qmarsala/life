const initCell = { isOld: false, isAlive: false, age: 0 };
const universe = [];
let generations = 0;
let lifeInterval;
let status = '';
let area = 50;
let count = 75;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function init() {
    area = document.getElementById('areaInput').value;
    count = document.getElementById('countInput').value;
    if (area > 200) area = 200;
    if (count < 10) count = 10;

    for (let x = 0; x < 200; x++) {
        universe[x] = new Array();
        for (let y = 0; y < 200; y++) {
            universe[x][y] = { isOld: false, isAlive: false };
        }
    }
    let i = 0;
    while (i < count) {
        universe[getRandomInt(0, area)][getRandomInt(0, area)] = { isOld: false, isAlive: true };
        i++;
    }
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
                let x = j * 6;
                let y = i * 6;
                ctx.fillStyle = 'rgb(200, 200, 200)';
                if (cell.age > 10) {
                    ctx.fillStyle = 'rgb(255, 165, 0)';
                }
                if (cell.age > 100) {
                    ctx.fillStyle = 'rgb(255, 0, 0)';
                }
                ctx.fillRect(x, y, 5, 5);
            }
        }
    }
}

function life() {
    clearInterval(lifeInterval);

    init();

    lifeInterval =
        setInterval(() => {
            for (let x = 0; x < universe.length; x++) {
                for (let y = 0; y < universe.length; y++) {
                    let currentCell = universe[x][y];
                    let neighbors = getNeighbors(x, y);
                    let liveNeighbors = neighbors.filter(c => c.isAlive).length;
                    if (currentCell.isOld) {
                        universe[x][y].isAlive = false;
                    }

                    if (currentCell.isAlive) {
                        if (liveNeighbors < 2 || liveNeighbors > 3) {
                            universe[x][y].isAlive = false;
                        }
                    } else if (liveNeighbors === 3) {
                        universe[x][y].isAlive = true;
                        universe[x][y].isOld = false;
                        universe[x][y].age = 0;
                    } else {
                        universe[x][y].isOld = true;
                    }
                    universe[x][y].age++;
                }
            }
            generations++;
            draw();

            if (universe.flat().every(c => !c.isAlive)) {
                init();
            }
            console.log('tick');
        }, 100);
}

life();