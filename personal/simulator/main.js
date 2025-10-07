import { initGrid, resizeGrid } from './core/grid.js';
import { step } from './core/simulation.js';
import { render } from './core/renderer.js';
import { setupPalette } from './ui/palette.js';
import { setupInput } from './ui/input.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resizeGrid(canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();
initGrid();

setupPalette();
setupInput(canvas);

let rightMouseDown = true; // inizia con il tasto destro premuto

window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'q') rightMouseDown = false;
});

window.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'q') rightMouseDown = true;
});
canvas.addEventListener('contextmenu', e => e.preventDefault()); // disabilita menu contestuale

function loop() {

    if (rightMouseDown) {
        step();        // aggiorna la simulazione
    }
    render(ctx);   // ridisegna la griglia
    requestAnimationFrame(loop); // continua il loop finché il tasto destro è premuto
}

loop();
