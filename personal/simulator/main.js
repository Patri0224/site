import { initGrid, resizeGrid } from './core/grid.js';
import { step } from './core/simulation.js';
import { drawBrushPreview, render, updateImageData } from './core/renderer.js';
import { setupPalette } from './ui/palette.js';
import { setupInput } from './ui/input.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upperSpace = 55;
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - upperSpace + 1;
    canvas.style.marginTop = upperSpace + "px";
    resizeGrid(canvas.width, canvas.height + 1);
    updateImageData(ctx);
}

window.addEventListener('resize', resize);
resize();
initGrid();

setupPalette();
setupInput(canvas);

let pauseFrame = true; // inizia con il tasto destro premuto

window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'q') pauseFrame = false;
});

window.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'q') pauseFrame = true;
});

let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;
let lastFpsUpdate = performance.now();

function loop() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;

    frameCount++;

    // Update FPS once per second
    if (now - lastFpsUpdate >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = now;
    }
    if (pauseFrame) {
        step();        // aggiorna la simulazione
    }
    render(ctx, 0);   // ridisegna la griglia
    ctx.font = '16px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    drawBrushPreview(ctx);
    requestAnimationFrame(loop); // continua il loop finché il tasto destro è premuto
}

loop();
