import { W, H, mat, level, pressure,cellSize } from './grid.js';
import { matColor, EMPTY, WATER, GAS, liquidCap } from './constants.js';

export function render(ctx) {
  const px = cellSize;
  ctx.fillStyle = matColor[EMPTY];
  ctx.fillRect(0, 0, W * px, H * px);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const m = mat[i];
      if (m === EMPTY) continue;

      if (m === WATER) {
        let a = Math.min(0.2 * (pressure[i] / 10), 0.6);
        ctx.fillStyle = rgba(matColor[m], 1 - a);
      } else if (m === GAS) {
        let a = 0.1 + 0.2 * (level[i] / liquidCap);
        ctx.fillStyle = rgba(matColor[m], a);
      } else {
        ctx.fillStyle = matColor[m];
      }
      ctx.fillRect(x * px, y * px, px, px);
    }
  }
}

function rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
