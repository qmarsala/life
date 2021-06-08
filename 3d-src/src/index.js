import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { init, nextGeneration } from './life.js';


CameraControls.install({ THREE: THREE });

let gridSize = 1000;
let count = 15000;
let size = 1;
let margin = .1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xDDFFF7);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 15);
const cameraControls = new CameraControls(camera, renderer.domElement);

const material = new THREE.MeshBasicMaterial({
    color: 0xFFA69E,
    opacity: 0.5,
    transparent: true
    // wireframe: true
});
const geometry = new THREE.BoxGeometry(size, size, size);

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

function draw(universe) {
    clearThree(scene);
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe.length; j++) {
            const cell = universe[i][j];
            if (!cell) continue;

            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = (i * (size + margin)) - 10;
            cube.position.y = (j * (size + margin)) - 10;
            cube.position.z = 0;
            scene.add(cube);
        }
    }
}

let universe = init(gridSize, count, 45);
draw(universe);

setInterval(() => {
    universe = nextGeneration(universe);
    draw(universe);
}, 100);

const clock = new THREE.Clock();
(function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();