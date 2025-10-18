import { initGrid, resizeGrid } from './core/grid.js';
import { bestScore, controlAvaible, setScore } from './core/logic.js';
import { render, setAvailbleBlocks, setMa2 } from './core/render.js'; // drawText è una funzione helper per disegnare testo
import { caricaBestScore, salvaBestScore } from './core/utils.js';
export const margin = window.innerWidth / 100;
export let CW, CH;
const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

export const MENU = 1;
const GAME = 2;
export let state = MENU;
export function setState(sta) { state = sta; }
export function gameOver() {
    state = MENU;
    setAvailbleBlocks(0, 0);
    setAvailbleBlocks(1, 0);
    setAvailbleBlocks(2, 0);
    controlAvaible(); // resetta i blocchi disponibili
    salvaBestScore();
}

function resize() {
    canvas.width = window.innerWidth - 2 * margin;
    canvas.height = window.innerHeight - 2 * margin;
    CW = canvas.width;
    CH = canvas.height;
    canvas.style.margin = margin + "px";
    resizeGrid(canvas.width, canvas.height);
    setMa2(margin);
}

window.addEventListener('resize', resize);
resize();
initGrid();

window.addEventListener("beforeunload", salvaBestScore);
window.addEventListener("load", () => {
    if (!caricaBestScore()) {
        console.log("Nessuno stato precedente, avvio nuova simulazione.");
    }
});
// =================== INPUT MENU ===================
canvas.addEventListener('mousedown', e => {
    if (state === MENU) {
        // clicca per iniziare nuova partita
        setScore(0);
        initGrid();
        controlAvaible(); // genera i primi blocchi
        state = GAME;
    }
});
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;
let lastFpsUpdate = performance.now();



// =================== LOOP ===================
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (state === MENU) {
        renderMenu(ctx);
    } else if (state === GAME) {
        render(ctx);
    }
    ctx.font = '30px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 60, 30);
    requestAnimationFrame(loop);
}

caricaBestScore();
loop();

// =================== RENDER MENU ===================
function renderMenu(ctx) {
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, CW, CH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Arial';
    ctx.fillText("SIMPLE BLOCK GAME", CW / 2, CH / 3);

    ctx.font = '30px Arial';
    ctx.fillText("Best Score: " + bestScore, CW / 2, CH / 2);

    ctx.font = '25px Arial';
    ctx.fillText("Click to Start", CW / 2, CH / 2 + 50);
}
