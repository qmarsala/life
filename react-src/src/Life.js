import React, { useEffect, useReducer, useState } from 'react'
import './Life.css';
import Canvas from './Canvas';

const init = (area = 30, count = 100, startingTranslation = 15) => {
    let rows = 200;
    let cols = 200;
    if (area > rows - startingTranslation) area = rows - startingTranslation;
    if (count < 2) count = 2;

    let universe = [];
    for (let x = 0; x < rows; x++) {
        universe[x] = [];
        for (let y = 0; y < cols; y++) {
            universe[x][y] = false;
        }
    }
    let i = 0;
    while (i < count) {
        universe[getRandomInt(0, area) + startingTranslation][getRandomInt(0, area) + startingTranslation] = true;
        i++;
    }
    return universe;
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const reducer = (currentUniverse) => {
    const getNeighbors = (i, j) => {
        let rowLimit = currentUniverse.length - 1;
        let columnLimit = currentUniverse[0].length - 1;
        let neighbors = [];

        for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
            for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
                if (x !== i || y !== j) {
                    neighbors.push(currentUniverse[x][y]);
                }
            }
        }
        return neighbors;
    }

    let nextUniverse = [];
    for (let x = 0; x < currentUniverse.length; x++) {
        nextUniverse[x] = [];
        for (let y = 0; y < currentUniverse.length; y++) {
            let neighbours = getNeighbors(x, y);
            let neighboursAlive = neighbours.filter(c => c).length;
            let cellIsAlive = currentUniverse[x][y];

            if (cellIsAlive && (neighboursAlive < 2 || neighboursAlive > 3)) {
                nextUniverse[x][y] = false;
            }
            else if (cellIsAlive && (neighboursAlive === 2 || neighboursAlive === 3)) {
                nextUniverse[x][y] = true;
            }
            else if (!cellIsAlive && neighboursAlive === 3) {
                nextUniverse[x][y] = true;
            } else {
                nextUniverse[x][y] = false;
            }
        }
    }

    return nextUniverse;
}

function Life(props) {
    const [universe, dispatch] = useReducer(reducer,
        init(props.area, props.count, props.startingTranslation));
    const [timerID, setTimerID] = useState(null);

    useEffect(() => {
        let timer = setInterval(() => {
            dispatch({});
        }, props.tickRate);
        setTimerID(timer);
        return () => clearInterval(timerID);
    }, []);

    return (
        <Canvas
            id="life-canvas"
            universe={universe}
            lifeColor={props.lifeColor}
            universeColor={props.universeColor}></Canvas>
    );
}

export default Life;