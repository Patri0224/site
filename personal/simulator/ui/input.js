import { inBounds, idx, mat, cellSize } from '../core/grid.js';
import { currentMaterial } from './palette.js';

let mouseDown = false;

export function setupInput(canvas) {
  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) {  // 0 = tasto sinistro
      mouseDown = true;
      drawAt(e);
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (e.button === 0) mouseDown = false;
  });

  canvas.addEventListener('mousemove', e => {
    if (mouseDown && e.buttons & 1) { // conferma che il left button è premuto
      drawAt(e);
    }
  });
}

function drawAt(e) {
  const rect = e.target.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  const brushSize = 2; // aumenta qui il raggio del brush (2 = 5x5, 3 = 7x7 ecc.)

  for (let dy = -brushSize; dy <= brushSize; dy++) {
    for (let dx = -brushSize; dx <= brushSize; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (!inBounds(nx, ny)) continue;
      const i = idx(nx, ny);
      mat[i] = currentMaterial;
    }
  }
}


