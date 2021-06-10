import { LifeSettings } from "./LifeSettings";
import { getRandomInt } from "./randomInt";
import { Universe } from "./Universe";
import { Graphics3D } from "./Graphics3D";

export class Life {
    private started: false;
    private paused: boolean;
    private lastTickAt: Date;

    constructor(
        private settings: LifeSettings,
        private universe: Universe,
        private graphics: Graphics3D) { }

    public play() {
        if (!this.started) {
            this.lastTickAt = new Date();
            this.graphics.animate(() => { return this.tick(); });
        }
        this.paused = false;
    }

    public pause() {
        this.paused = true;
    }

    public restart() {
        this.settings.count = getRandomInt(100, 2500);
        this.settings.startingArea = getRandomInt(10, 100);
        this.universe.init(this.settings);
        this.play();
    }

    public step() {
        if (!this.paused) {
            this.pause()
        }
        this.tick();
    }

    public resetTickRate(value: any) {
        this.settings.tickRate = value;
    }

    private tick() {
        const innerTick = () => {
            this.universe.nextGeneration();
            const currentUniverseState = this.universe.currentState;
            const translation = this.settings.getTranslation();
            this.graphics.draw(currentUniverseState, translation);
        };
        const tickRate = this.settings.tickRate;
        const elapsed = new Date().getTime() - this.lastTickAt.getTime();
        if (elapsed >= tickRate && !this.paused) {
            innerTick();
            this.lastTickAt = new Date();
        }
        return true;
    }
}