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

function tick() {
    universe = nextGeneration(universe);
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

life();
draw(universe, translation);
animate();