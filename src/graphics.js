import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

const cameraSettings = [-35, 120, -35, 25, 0, 25];
const size = 3;
const margin = .8;
const cubeGeometry = new THREE.BoxGeometry(size, size, size);
let colorSettings = {
    color1: "FFA69E",
    color2: "7DCFB6",
    bgColor: "DDFFF7"
}

const createMesh = (color) => new THREE.MeshBasicMaterial({
    color: new THREE.Color(`#${color}`),
    opacity: 0.7,
    transparent: true
});

const updateColorSettings = (newColorSettings) => {
    colorSettings = newColorSettings;
    defaultMaterial = createMesh(colorSettings.color1);
    userSpawnedMaterial = createMesh(colorSettings.color2);
    scene.background = new THREE.Color(`#${colorSettings.bgColor}`);
};

let defaultMaterial = createMesh(colorSettings.color1);
let userSpawnedMaterial = createMesh(colorSettings.color2);



const scene = new THREE.Scene();
scene.background = new THREE.Color(`#${colorSettings.bgColor}`);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1000);
const cameraControls = new CameraControls(camera, renderer.domElement);
cameraControls.setLookAt(...cameraSettings);

const clock = new THREE.Clock();
const updateCamera = () => {
    const delta = clock.getDelta();
    cameraControls.update(delta);
};

const resetCamera = () => {
    cameraControls.setLookAt(...cameraSettings);
};

const clearThree = (obj) => {
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
};

const createCube = (x, z) => {
    const geometry = cubeGeometry.clone()
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, 0, z));
    return geometry;
};

const draw = (universe, translation) => {
    clearThree(scene);
    const userSpawnedGeometries = [];
    const geometries = [];

    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe.length; j++) {
            const cell = universe[i][j];
            if (!cell.isAlive) {
                continue;
            }

            const x = (i * (size + margin)) - (translation * (size + margin));
            const z = (j * (size + margin)) - (translation * (size + margin));
            const cube = createCube(x, z);
            if (cell.isUserSpawned) {
                userSpawnedGeometries.push(cube)
                continue;
            }
            geometries.push(cube);
        }
    }

    if (userSpawnedGeometries.length > 0) {
        const userSpawnedCubeGeometries = BufferGeometryUtils.mergeBufferGeometries(userSpawnedGeometries);
        const userSpawnedMesh = new THREE.Mesh(userSpawnedCubeGeometries, userSpawnedMaterial);
        scene.add(userSpawnedMesh);
    }
    if (geometries.length > 0) {
        const cubeGeometries = BufferGeometryUtils.mergeBufferGeometries(geometries);
        const mesh = new THREE.Mesh(cubeGeometries, defaultMaterial);
        scene.add(mesh);
    }
};

const animate = (preRender) => {
    updateCamera();
    const nextFrame = preRender();
    renderer.render(scene, camera);

    if (nextFrame) {
        requestAnimationFrame(() => animate(preRender));
    }
};
export { animate, draw, resetCamera, updateColorSettings };