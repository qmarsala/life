import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { init, nextGeneration, previousGeneration, getRandomInt } from './life.js';

CameraControls.install({ THREE: THREE });

let cameraSettings = [-35, 120, -35, 25, 0, 25];
let gridSize = 1000;
let startingTranslation = gridSize * .25;
let count = getRandomInt(100, 2500);
let startingArea = getRandomInt(10, 100);
let size = 3;
let margin = .8;
let tickRate = 100;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xDDFFF7);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1000);
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.setLookAt(...cameraSettings);

function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0])
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose()

    if (obj.material) {
        //in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop])
                return
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose()
        })
        obj.material.dispose()
    }
}

const geometry = new THREE.BoxGeometry(size, size, size);
const material = new THREE.MeshBasicMaterial({
    color: 0xFFA69E,
    opacity: 0.7,
    transparent: true
});
function draw(universe) {
    clearThree(scene);
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe.length; j++) {
            const cell = universe[i][j];
            if (!cell) {
                continue;
            }

            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = (i * (size + margin)) - (startingTranslation * (size + margin));
            cube.position.y = 0;
            cube.position.z = (j * (size + margin)) - (startingTranslation * (size + margin));
            scene.add(cube);
        }
    }
}

function tick() {
    universe = nextGeneration(universe);
    draw(universe);
}

let nextTickIn = tickRate;
let paused = false;
let stop = false;
let currentTimeout;
function life(shouldInit = true) {
    if (shouldInit) {
        universe = init(gridSize, count, startingArea, startingTranslation);
        draw(universe);
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
    return setTimeout(lifeTick, nextTickIn);
}

function resetTickRate(newTickRate) {
    tickRate = 5000 - newTickRate;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    nextTickIn = 1;
    currentTimeout = life(false);
}

function restart() {
    if (currentTimeout != undefined) {
        clearTimeout(currentTimeout);
    }
    cameraControls.setLookAt(...cameraSettings);
    life();
    play();
    currentTimeout = life();
}

function pause() {
    paused = true;
}

function step() {
    if (!paused) {
        pause()
    }

    universe = nextGeneration(universe);
    draw(universe);
}

function back() {
    if (!paused) {
        pause()
    }

    let prevUniverse = previousGeneration();
    if (prevUniverse) {
        universe = prevUniverse;
        draw(universe);
    }
}

function play() {
    paused = false;
    if (currentTimeout == undefined) {
        universe = init(gridSize, count, startingArea, startingTranslation);
        currentTimeout = life();
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

const clock = new THREE.Clock();
function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

let universe = init(gridSize, count, startingArea, startingTranslation);
currentTimeout = life();
draw(universe);
animate();