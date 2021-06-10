import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE });

export class Graphics3D {
    private cameraSettings = [-35, 120, -35, 25, 0, 25];
    private size = 3;
    private margin = .8;
    private cubeGeometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    private colorSettings: any;
    private scene: THREE.Scene;
    private defaultMaterial: THREE.MeshBasicMaterial;
    private userSpawnedMaterial: THREE.MeshBasicMaterial;
    private renderer: THREE.WebGLRenderer
    private camera;
    private cameraControls;
    private clock: THREE.Clock;

    constructor() {
        this.scene = new THREE.Scene();
        this.updateColorSettings({
            color1: "FFA69E",
            color2: "7DCFB6",
            bgColor: "DDFFF7"
        });

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
        this.resetCamera();

        this.clock = new THREE.Clock();
    }

    public draw(universe: any[][], translation: number) {
        this.clearThree(this.scene);
        const userSpawnedGeometries = [];
        const geometries = [];

        for (let i = 0; i < universe.length; i++) {
            for (let j = 0; j < universe.length; j++) {
                const cell = universe[i][j];
                if (!cell.isAlive) {
                    continue;
                }

                const x = (i * (this.size + this.margin)) - (translation * (this.size + this.margin));
                const z = (j * (this.size + this.margin)) - (translation * (this.size + this.margin));
                const cube = this.createCube(x, z);
                if (cell.isUserSpawned) {
                    userSpawnedGeometries.push(cube)
                    continue;
                }
                geometries.push(cube);
            }
        }

        if (userSpawnedGeometries.length > 0) {
            const userSpawnedCubeGeometries = BufferGeometryUtils.mergeBufferGeometries(userSpawnedGeometries);
            const userSpawnedMesh = new THREE.Mesh(userSpawnedCubeGeometries, this.userSpawnedMaterial);
            this.scene.add(userSpawnedMesh);
        }
        if (geometries.length > 0) {
            const cubeGeometries = BufferGeometryUtils.mergeBufferGeometries(geometries);
            const mesh = new THREE.Mesh(cubeGeometries, this.defaultMaterial);
            this.scene.add(mesh);
        }
    }

    public animate(preRender: () => boolean) {
        this.updateCamera();
        const nextFrame = preRender();
        this.renderer.render(this.scene, this.camera);

        if (nextFrame) {
            requestAnimationFrame(() => this.animate(preRender));
        }
    }

    public resetCamera() {
        this.cameraControls.setLookAt(
            this.cameraSettings[0],
            this.cameraSettings[1],
            this.cameraSettings[2],
            this.cameraSettings[3],
            this.cameraSettings[4],
            this.cameraSettings[5],
        );
    }

    public updateColorSettings(newColorSettings: any) {
        this.colorSettings = newColorSettings;
        this.defaultMaterial = this.createMesh(this.colorSettings.color1);
        this.userSpawnedMaterial = this.createMesh(this.colorSettings.color2);
        this.scene.background = new THREE.Color(`#${this.colorSettings.bgColor}`);
    }

    private updateCamera() {
        const delta = this.clock.getDelta();
        this.cameraControls.update(delta);
    }

    private clearThree(obj: any) {
        while (obj.children.length > 0) {
            this.clearThree(obj.children[0])
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

    private createCube(x: number, z: number) {
        const geometry = this.cubeGeometry.clone()
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, 0, z));
        return geometry;
    }

    private createMesh(color: string) {
        return new THREE.MeshBasicMaterial({
            color: new THREE.Color(`#${color}`),
            opacity: 0.7,
            transparent: true
        });
    }
}