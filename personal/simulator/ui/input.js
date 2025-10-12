import { EMPTY, cellSize, maxBrush } from '../core/constants.js';
import { inBounds, idx, mat, level, pressure, option1, trasform } from '../core/grid.js';
import { currentMaterial } from './palette.js';

let mouseDown = false;
let brushSize = 20;// aumenta qui il raggio del brush (2 = 3x3, 3 = 4x4 ecc.)
export function setBrushSize(val) {
  if (val < 1) {
    brushSize = 1;
    return;
  }
  if (val > 40) {
    brushSize = 40;
    return;
  }
  brushSize = val;
}
export function getBrushSize() {
  return brushSize;
}


let sovrascrivi = false;// aumenta qui il raggio del brush (2 = 3x3, 3 = 4x4 ecc.)
window.addEventListener('keydown', e => {
  if (e.shiftKey) sovrascrivi = true;
});

window.addEventListener('keyup', e => {
  if (!e.shiftKey) sovrascrivi = false;
});
export let mouseX = 0;
export let mouseY = 0;
export let mouseInside = false;

export function setupInput(canvas) {
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseInside = true;
  });


  canvas.addEventListener('mouseleave', () => {
    mouseInside = false;
    lastX = null;
    lastY = null;
  });
  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) {  // 0 = tasto sinistro
      mouseDown = true;
      drawAt(e);
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (e.button === 0) {
      mouseDown = false;
      lastX = null;
      lastY = null;
    }
  });


  canvas.addEventListener('mousemove', e => {
    if (mouseDown && e.buttons & 1) { // conferma che il left button è premuto
      drawAt(e);
    }
  });
  // ... (resto del tuo input esistente)
}
let lastX = null;
let lastY = null;
function drawAt(e) {
  const rect = e.target.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  if (lastX === null || lastY === null) {
    drawBrush(x, y);
  } else {
    // Interpolazione lineare tra last e current
    const dx = x - lastX;
    const dy = y - lastY;
    const steps = Math.max(Math.abs(dx), Math.abs(dy)); // pixel distance
    for (let i = 0; i <= steps; i++) {
      const nx = Math.round(lastX + (dx * i) / steps);
      const ny = Math.round(lastY + (dy * i) / steps);
      drawBrush(nx, ny);
    }
  }

  lastX = x;
  lastY = y;
}
function drawBrush(x, y) {
  const half = Math.floor(brushSize / 2);

  for (let dy = 0; dy < brushSize; dy++) {
    for (let dx = 0; dx < brushSize; dx++) {
      const nx = x + dx - half;
      const ny = y + dy - half;
      if (!inBounds(nx, ny)) continue;
      const i = idx(nx, ny);
      if (mat[i] === EMPTY || sovrascrivi || currentMaterial === EMPTY) {
        trasform(i, currentMaterial);
      }
    }
  }
}


