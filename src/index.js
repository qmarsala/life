import { init, nextGeneration, getRandomInt } from './life.js';
import { animate, draw, resetCamera, updateColorSettings } from './graphics.js';

const slowestTickRate = 5000;
const gridSize = 1000;
const translation = gridSize * .25;
let count = getRandomInt(100, 2500);
let startingArea = getRandomInt(10, 100);
let tickRate = 100;
let paused = false;
let universe = init(gridSize, count, startingArea, translation);
let pendingOperations = [];

const play = () => {
    paused = false;
};
const pause = () => paused = true;
const restart = () => {
    resetCamera();
    count = getRandomInt(100, 2500);
    startingArea = getRandomInt(10, 100);
    universe = init(gridSize, count, startingArea, translation);
    play();
};
const step = () => {
    if (!paused) {
        pause()
    }
    tick();
};
// const back = () => {
//     if (!paused) {
//         pause()
//     }

//     let prevUniverse = previousGeneration();
//     if (prevUniverse) {
//         universe = prevUniverse;
//     }
// };
const resetTickRate = (newTickRate) => tickRate = slowestTickRate - newTickRate;

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

document.getElementById('restart-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    restart();
});

document.getElementById('step-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    step();
});

// document.getElementById('back-btn').addEventListener('click', (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     back();
// });

document.getElementById('speed-control').addEventListener('change', (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetTickRate(event.target.value);
});

document.getElementById('updatecolors-btn').addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newBgColor = document.getElementById('bgcolor-input').value;
    const newColor1 = document.getElementById('color1-input').value;
    const newColor2 = document.getElementById('color2-input').value;
    updateColorSettings({
        bgColor: newBgColor,
        color1: newColor1,
        color2: newColor2
    });
});

document.getElementById('spawn-glider-btn').addEventListener('click', (event) => {
    pendingOperations.push((universe) => {
        let rotateZ = getRandomInt(0, 10) % 2 == 0;
        let rotateX = getRandomInt(0, 10) % 2 == 0;
        let glider = [
            { x: rotateX ? -0 : 0, z: rotateZ ? -1 : 1 },
            { x: rotateX ? -1 : 1, z: rotateZ ? -0 : 0 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -0 : 0 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -1 : 1 },
            { x: rotateX ? -2 : 2, z: rotateZ ? -2 : 2 }
        ];
        let startingPosistion = { x: getRandomInt(0, startingArea * 2) + translation, z: getRandomInt(0, startingArea * 2) + translation };
        glider.forEach(point => {
            let x = startingPosistion.x + point.x;
            let z = startingPosistion.z + point.z;
            universe[x][z] = { isAlive: true, isUserSpawned: true };
        });
    });
});

const tick = () => {
    universe = nextGeneration(universe);
    if (pendingOperations && pendingOperations.length > 0) {
        let op = pendingOperations.pop();
        op(universe)
    }
    draw(universe, translation);
};

let start = new Date();
const life = () => {
    const elapsed = new Date().getTime() - start.getTime();
    if (elapsed >= tickRate && !paused) {
        tick();
        start = new Date();
    }
    return true;
};
animate(life);