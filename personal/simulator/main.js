import { initGrid, resizeGrid } from './core/grid.js';
import { step } from './core/simulation.js';
import { drawBrushPreview, render, updateImageData } from './core/renderer.js';
import { setupPalette } from './ui/palette.js';
import { setupInput } from './ui/input.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upperSpace = 55;
let nuovo = true;
let isResize = false;
let posFpsX = canvas.width - 70;
export function inputPresent() {
    isResize = true;
}
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - upperSpace + 1;
    canvas.style.marginTop = upperSpace + "px";
    posFpsX = canvas.width - 70;
    resizeGrid(canvas.width, canvas.height + 1, nuovo);
    updateImageData(ctx);
    isResize = true;
}

window.addEventListener('resize', resize);
resize();
initGrid();

setupPalette();
setupInput(canvas);
nuovo = false;
let pauseFrame = false; // inizia con il tasto destro premuto

window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'q') pauseFrame = true;
});

window.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'q') pauseFrame = false;
});
export function stopFrames() {
    pauseFrame = true;
}
export function resumeFrames() {
    pauseFrame = false;
}
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
        isResize = true;
    }
    if (!pauseFrame) {
        step();        // aggiorna la simulazione
    }
    render(ctx, isResize);   // ridisegna la griglia
    isResize = false;
    ctx.font = '16px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, posFpsX, 20);
    drawBrushPreview(ctx);
    requestAnimationFrame(loop); // continua il loop finché il tasto destro è premuto
}

loop();
