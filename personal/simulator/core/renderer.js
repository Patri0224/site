import { W, H, idx, mat, level, pressure } from './grid.js';
import { matColor, EMPTY, WATER, GAS, liquidCap, matColor1, matColor2, cellSize } from './constants.js';
import { getBrushSize } from '../ui/input.js';
import { mouseX, mouseY, mouseInside } from '../ui/input.js';

let imageData;
let data;

export function updateImageData(ctx) {
  imageData = ctx.createImageData(W * cellSize, H * cellSize);
  data = imageData.data;
}

export function render(ctx, f) {
  // reset dei pixel
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  data.fill(rgba(matColor[EMPTY], 1)); // sfondo nero, oppure riempi subito con matColor[EMPTY]

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      const m = mat[i];
      if (m === EMPTY) continue;

      let color;
      switch (quickMix3(x, y, i + f)) {
        case 0: color = hexToRGB(matColor[m]); break;
        case 1: color = hexToRGB(matColor1[m]); break;
        case 2: color = hexToRGB(matColor2[m]); break;

      }
      let alpha = 255;

      if (m === WATER) {
        const a = Math.min(0.2 * (pressure[i] / 25), 0.7);
        alpha = Math.round((1 - a) * 255);
      } else if (m === GAS) {
        const a = 0.1 + 0.2 * (level[i] / liquidCap);
        alpha = Math.round(a * 255);
      }

      // scrivi il colore su un quadrato cellSize x cellSize
      for (let dy = 0; dy < cellSize; dy++) {
        for (let dx = 0; dx < cellSize; dx++) {
          const px = x * cellSize + dx;       // pixel X
          const py = y * cellSize + dy;       // pixel Y
          const idxData = (py * W * cellSize + px) * 4;
          data[idxData] = color.r;
          data[idxData + 1] = color.g;
          data[idxData + 2] = color.b;
          data[idxData + 3] = alpha;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function quickMix3(a, b, c) {
  let v = (a * 73856093) ^ (b * 19349663) ^ (c * 83492791);
  v ^= v >>> 11;
  v ^= v * 2654435761;
  return (v >>> 0) % 3;
}
export function drawBrushPreview(ctx) {
  if (!mouseInside) return;
  let brushSize = getBrushSize();

  const x = Math.floor(mouseX / cellSize);
  const y = Math.floor(mouseY / cellSize);
  const half = Math.floor(brushSize / 2);

  const size = brushSize * cellSize;
  const px = (x - half) * cellSize;
  const py = (y - half) * cellSize;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px + 0.5, py + 0.5, size, size);
  ctx.restore();
}


function hexToRGB(hex) {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}
function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
/*
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const m = mat[i];
      if (m === EMPTY) continue;

      if (m === WATER) {
        let a = Math.min(0.2 * (pressure[i] / 15), 0.8);
        ctx.fillStyle = rgba(matColor[m], 1 - a);
      } else if (m === GAS) {
        let a = 0.1 + 0.2 * (level[i] / liquidCap);
        ctx.fillStyle = rgba(matColor[m], a);
      } else {
        ctx.fillStyle = matColor[m];
      }
      ctx.fillRect(x * px, y * px, px, px);
    }
  }*/