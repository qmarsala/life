import { init, nextGeneration, previousGeneration, getRandomInt } from './life.js';
import { animate, draw, resetCamera } from './graphics.js';

const slowestTickRate = 5000;
const gridSize = 1000;
const translation = gridSize * .25;
const count = getRandomInt(100, 2500);
const startingArea = getRandomInt(10, 100);
let tickRate = 100;
let nextTickIn = tickRate;
let paused = false;
let stop = false;
let currentTimeout;
let universe = init(gridSize, count, startingArea, translation);
let pendingOperations = [];

function tick() {
    universe = nextGeneration(universe);
    if (pendingOperations && pendingOperations.length > 0) {
        let op = pendingOperations.pop();
        op(universe)
    }
    draw(universe, translation);
}

function life(shouldInit = true) {
    if (shouldInit) {
        universe = init(gridSize, count, startingArea, translation);
        draw(universe, translation);
    }
    const lifeTick = () => {
        if (stop) {
            return;
        }

        let start = new Date();

        if (!paused) {
            tick();
        }

        const elapsed = new Date().getTime() - start.getTime();
        nextTickIn = tickRate - elapsed;
        if (nextTickIn < 1) {
            nextTickIn = 1;
        }
        currentTimeout = setTimeout(lifeTick, nextTickIn);
    };
    lifeTick();
}

function resetTickRate(newTickRate) {
    tickRate = slowestTickRate - newTickRate;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    nextTickIn = 1;
    life(false);
}

function restart() {
    if (currentTimeout != undefined) {
        clearTimeout(currentTimeout);
    }
    resetCamera();
    life();
    play();
}

function pause() {
    paused = true;
}

function step() {
    if (!paused) {
        pause()
    }

    universe = nextGeneration(universe);
    draw(universe, translation);
}

function back() {
    if (!paused) {
        pause()
    }

    let prevUniverse = previousGeneration();
    if (prevUniverse) {
        universe = prevUniverse;
        draw(universe, translation);
    }
}

function play() {
    paused = false;
    if (currentTimeout == undefined) {
        universe = init(gridSize, count, startingArea, translation);
        life();
    }
}

document.getElementById('restart-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    restart();
});

document.getElementById('play-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    play();
});

document.getElementById('pause-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    pause();
});

document.getElementById('step-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    step();
});

document.getElementById('back-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    back();
});

document.getElementById('speed-control').addEventListener('change', (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetTickRate(event.target.value);
});

document.getElementById('spawn-glider-btn').addEventListener('click', (event) => {
    pendingOperations.push((universe) => {
        let rotateZ = getRandomInt(0,10) % 2 == 0;
        let rotateX = getRandomInt(0,10) % 2 == 0;
        let glider = [
            { x: rotateX ? -0 : 0, z: rotateZ ? -1 : 1 },
            { x: rotateX ? -1 : 1, z: rotateZ ? -0 : 0 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -0 : 0 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -1 : 1 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -2 : 2 }
        ];
        let startingPosistion = {x: getRandomInt(0,startingArea * 2) + translation, z: getRandomInt(0,startingArea * 2) + translation};
        glider.forEach(point => {
            let x = startingPosistion.x + point.x;
            let z = startingPosistion.z + point.z;
            universe[x][z] = { isAlive: true, isUserSpawned: true };
        });
    });
});

life();
draw(universe, translation);
animate();