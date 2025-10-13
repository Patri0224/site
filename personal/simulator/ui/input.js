import { EMPTY, cellSize, maxBrush } from '../core/constants.js';
import { inBounds, idx, mat, trasform } from '../core/grid.js';
import { inputPresent } from '../main.js';
import { currentMaterial } from './palette.js';

let mouseDown = false;
let brushSize = 20;
let lastPositions = new Map(); // per multi-touch

export function setBrushSize(val) {
  brushSize = Math.max(1, Math.min(val, 40));
}
export function getBrushSize() { return brushSize; }

let sovrascrivi = false;
window.addEventListener('keydown', e => { if (e.shiftKey) sovrascrivi = true; });
window.addEventListener('keyup', e => { if (!e.shiftKey) sovrascrivi = false; });

export let mouseX = 0;
export let mouseY = 0;
export let mouseInside = false;

export function setupInput(canvas) {
  // --- Mouse ---
  canvas.addEventListener('mousemove', e => {
    mouseX = e.clientX - canvas.getBoundingClientRect().left;
    mouseY = e.clientY - canvas.getBoundingClientRect().top;
    mouseInside = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseInside = false;
    lastPositions.clear();
  });

  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) {
      mouseDown = true;
      handleDraw(e.clientX, e.clientY, 'mouse');
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (e.button === 0) {
      mouseDown = false;
      lastPositions.delete('mouse');
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (mouseDown) handleDraw(e.clientX, e.clientY, 'mouse');
  });

  // --- Touch ---
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      handleDraw(touch.clientX, touch.clientY, touch.identifier);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      handleDraw(touch.clientX, touch.clientY, touch.identifier);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    for (const touch of e.changedTouches) {
      lastPositions.delete(touch.identifier);
    }
  });

  canvas.addEventListener('touchcancel', e => {
    for (const touch of e.changedTouches) {
      lastPositions.delete(touch.identifier);
    }
  });
}

// --- Funzione comune per mouse e touch ---
function handleDraw(clientX, clientY, id) {
  const rect = document.querySelector('canvas').getBoundingClientRect();
  const x = Math.floor((clientX - rect.left) / cellSize);
  const y = Math.floor((clientY - rect.top) / cellSize);

  const lastPos = lastPositions.get(id);
  if (!lastPos) {
    drawBrush(x, y);
  } else {
    const dx = x - lastPos.x;
    const dy = y - lastPos.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    for (let i = 0; i <= steps; i++) {
      const nx = Math.round(lastPos.x + (dx * i) / steps);
      const ny = Math.round(lastPos.y + (dy * i) / steps);
      drawBrush(nx, ny);
    }
  }

  lastPositions.set(id, { x, y });
  inputPresent();
}

function drawBrush(x, y) {
  const half = Math.floor(brushSize / 2);
  for (let dy = 0; dy < brushSize; dy++) {
    for (let dx = 0; dx < brushSize; dx++) {
      const nx = x + dx - half;
      const ny = y + dy - half;
      if (!inBounds(nx, ny)) continue;
      const i = idx(nx, ny);
      //if (mat[i] === currentMaterial) continue;
      if (mat[i] === EMPTY || sovrascrivi || currentMaterial === EMPTY) {
        trasform(i, currentMaterial);
      }
    }
  }
}
