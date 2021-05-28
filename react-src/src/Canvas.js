
import React, { useRef, useEffect } from 'react'

const resizeCanvas = (canvas) => {
    const { width, height } = canvas.getBoundingClientRect()
    if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window
        const context = canvas.getContext('2d')
        canvas.width = width * ratio
        canvas.height = height * ratio
        context.scale(ratio, ratio)
        return true
    }

    return false
};

const Canvas = props => {
    const canvasRef = useRef(null)
    const { universe, lifeColor, universeColor, ...rest } = props;
    const draw = (ctx, universe) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.canvas.style.backgroundColor = universeColor;
        let padding = 50;
        let size = 5;
        let margin = 1;
        for (let i = 0; i < universe.length; i++) {
            for (let j = 0; j < universe.length; j++) {
                const cell = universe[i][j];
                if (!cell) continue;

                let x = (j * (size + margin)) - padding;
                let y = (i * (size + margin)) - padding;
                ctx.fillStyle = lifeColor;
                ctx.fillRect(x, y, size, size);
            }
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        resizeCanvas(canvas);

        draw(context, universe);
    }, [universe])

    return <canvas ref={canvasRef} {...rest} />
}

export default Canvas