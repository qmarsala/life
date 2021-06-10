import { Graphics3D } from './Graphics3D';
import { Life } from './life';
import { LifeSettings } from './LifeSettings';
import { getRandomInt } from './randomInt';
import { Universe } from './Universe';

const glider = [
    { x: 0, z: 1 },
    { x: 1, z: 0 },
    { x: 2, z: 0 },
    { x: 2, z: 1 },
    { x: 2, z: 2 }
];

const lifeSettings = new LifeSettings(100, 1000, getRandomInt(100, 2500), getRandomInt(10, 300));
const universe = new Universe(lifeSettings);
const graphics = new Graphics3D();
const life = new Life(lifeSettings, universe, graphics);
life.play();

document.getElementById('play-btn').addEventListener('click', (event) => {
    life.play();
});

document.getElementById('pause-btn').addEventListener('click', (event) => {
    life.pause();
});

document.getElementById('restart-btn').addEventListener('click', (event) => {
    life.restart();
});

document.getElementById('step-btn').addEventListener('click', (event) => {
    life.step();
});

document.getElementById('speed-control').addEventListener('change', (event) => {
    life.resetTickRate(5000 - (<any>event.target).value);
});

document.getElementById('updatecolors-btn').addEventListener('click', (event) => {
    const newBgColor = (<any>document.getElementById('bgcolor-input')).value;
    const newColor1 = (<any>document.getElementById('color1-input')).value;
    const newColor2 = (<any>document.getElementById('color2-input')).value;
    graphics.updateColorSettings({
        bgColor: newBgColor,
        color1: newColor1,
        color2: newColor2
    });
});

document.getElementById('spawn-glider-btn').addEventListener('click', (event) => {
    const startingPosistion = { x: getRandomInt(0, lifeSettings.startingArea * 2), z: getRandomInt(0, lifeSettings.startingArea * 2) };
    const rotateZ = getRandomInt(0, 10) % 2 == 0;
    const rotateX = getRandomInt(0, 10) % 2 == 0;
    const rotatedGlider = glider.map(point => {
        return { x: rotateX ? -point.x : point.x, z: rotateZ ? -point.z : point.z }
    });
    universe.addObject(startingPosistion.x, startingPosistion.z, rotatedGlider)
});