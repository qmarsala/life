import { LifeSettings } from "./LifeSettings";
import { getRandomInt } from "./randomInt";

export class Universe {
    private currentUniverseState: any[][];
    private objectAddQueue: any[];

    constructor(private settings: LifeSettings) {
        this.init(settings);
    }

    public get currentState(): any[][] {
        return this.currentUniverseState;
    }

    public nextGeneration(): void {
        let nextUniverse = [];
        const gridSize = this.settings.gridSize;
        for (let x = 0; x < gridSize; x++) {
            nextUniverse[x] = new Array();
            for (let y = 0; y < gridSize; y++) {
                let neighbours = this.getNeighbors(x, y);
                let neighboursAlive = neighbours.filter(c => c && c.isAlive).length;
                let hasUserSpawnedNeighbours = neighbours.filter(c => c && c.isUserSpawned).length > 0;
                let cellIsAlive = this.currentUniverseState[x][y].isAlive;
                let isUserSpawned = hasUserSpawnedNeighbours;

                if (cellIsAlive && neighboursAlive < 2 || neighboursAlive > 3) {
                    nextUniverse[x][y] = { isAlive: false, isUserSpawned: false };
                }
                else if (cellIsAlive && neighboursAlive === 2 || neighboursAlive === 3) {
                    nextUniverse[x][y] = { isAlive: true, isUserSpawned: isUserSpawned };
                }
                else if (!cellIsAlive && neighboursAlive === 3) {
                    nextUniverse[x][y] = { isAlive: true, isUserSpawned: isUserSpawned };
                } else {
                    nextUniverse[x][y] = { isAlive: false, isUserSpawned: false };
                }
            }
        }
        this.currentUniverseState = nextUniverse;

        if (this.objectAddQueue && this.objectAddQueue.length > 0) {
            const objectAddOp = this.objectAddQueue.pop();
            objectAddOp();
        }
    }

    public addObject(startX: number, startZ: number, template: any[]) {
        const translation = this.settings.getTranslation();
        this.objectAddQueue.push(() => {
            template.forEach(point => {
                let x = (startX + point.x) + translation;
                let z = (startZ + point.z) + translation;
                this.currentUniverseState[x][z] = { isAlive: true, isUserSpawned: true };
            });
        })
    }

    public init(initSettings: any): void {
        this.objectAddQueue = new Array();
        this.settings = initSettings;
        const gridSize = this.settings.gridSize;
        const startingTranslation = this.settings.getTranslation();
        let count = this.settings.count;
        let startingArea = this.settings.startingArea;

        if (startingArea > gridSize - startingTranslation)
            startingArea = gridSize - startingTranslation;
        if (count < 3)
            count = 3;

        let universe = [];
        for (let x = 0; x < gridSize; x++) {
            universe[x] = new Array();
            for (let y = 0; y < gridSize; y++) {
                universe[x][y] = { isAlive: false, isUserSpawned: false };
            }
        }
        let i = 0;
        while (i < count) {
            universe[getRandomInt(0, startingArea) + startingTranslation][getRandomInt(0, startingArea) + startingTranslation]
                = { isAlive: true, isUserSpawned: false };
            i++;
        }
        this.currentUniverseState = universe;
    }

    private getNeighbors(i: number, j: number): any[] {
        const gridSize = this.settings.gridSize;
        const neighbors = [];

        for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, gridSize); x++) {
            for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, gridSize); y++) {
                if (x !== i || y !== j) {
                    if ((this.currentUniverseState[x] && this.currentUniverseState[x][y]))
                        neighbors.push(this.currentUniverseState[x][y]);
                }
            }
        }
        return neighbors;
    }
}
