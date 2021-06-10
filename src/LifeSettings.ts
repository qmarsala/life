export class LifeSettings {
    constructor(
        public tickRate: number,
        public gridSize: number,
        public count: number,
        public startingArea: number
    ) { }

    public getTranslation = () => this.gridSize * .25;
}
