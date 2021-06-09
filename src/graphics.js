import * as THREE from 'three';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

let cameraSettings = [-35, 120, -35, 25, 0, 25];
let size = 3;
let margin = .8;
const geometry = new THREE.BoxGeometry(size, size, size);
const material = new THREE.MeshBasicMaterial({
    color: 0xFFA69E,
    opacity: 0.7,
    transparent: true
});

const userSpawnedMaterial = new THREE.MeshBasicMaterial({
    color: 0x7DCFB6,
    opacity: 0.7,
    transparent: true
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xDDFFF7);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1000);
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.setLookAt(...cameraSettings);

const clock = new THREE.Clock();
function animate(preRender) {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    let nextFrame = preRender();
    renderer.render(scene, camera);

    if (nextFrame) {
        requestAnimationFrame(() => animate(preRender));
    }
}

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

function draw(universe, translation) {
    clearThree(scene);
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe.length; j++) {
            const cell = universe[i][j];
            if (!cell.isAlive) {
                continue;
            }

            let cube = new THREE.Mesh(geometry, cell.isUserSpawned ? userSpawnedMaterial : material);
            cube.position.x = (i * (size + margin)) - (translation * (size + margin));
            cube.position.y = 0;
            cube.position.z = (j * (size + margin)) - (translation * (size + margin));
            scene.add(cube);
        }
    }
}

function resetCamera() {
    cameraControls.setLookAt(...cameraSettings);
}

export { animate, draw, resetCamera };