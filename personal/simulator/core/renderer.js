import { W, H, idx, mat, level, pressure, colorRender, moved, option1, option2 } from './grid.js';
import { matColor, EMPTY, WATER, GAS, liquidCap, matColor1, matColor2, cellSize, WOOD, LEAF, leafDistance } from './constants.js';
import { getBrushSize, mouseX, mouseY, mouseInside } from '../ui/input.js';

let imageData, data, oldPressure;
let offscreenCanvas, offscreenCtx; // buffer per la griglia (W x H)
let maxP = H * cellSize * 0.2;

export function updateImageData(ctx) {
  offscreenCanvas = new OffscreenCanvas(W, H);
  offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: false });

  imageData = offscreenCtx.createImageData(W, H);
  data = imageData.data;

  oldPressure = new Uint16Array(W * H);
  oldPressure.fill(0);
  maxP = H * cellSize * 0.2;
  ctx.imageSmoothingEnabled = false;
}

export function render(ctx, externalChange) {
  const _pressure = pressure;
  const _oldPressure = oldPressure;
  const _option1 = option1;

  for (let i = 0; i < W * H; i++) {
    const m = mat[i];

    if (!externalChange && moved[i] === 0) {
      if (m !== WATER || _pressure[i] === _oldPressure[i]) continue;
    }

    let color;
    switch (colorRender[i]) {
      case 0: color = hexToRGB(matColor[m]); break;
      case 1: color = hexToRGB(matColor1[m]); break;
      case 2: color = hexToRGB(matColor2[m]); break;
    }

    if (m === WATER) {
      const p = _pressure[i];

      const intensity = Math.min(p / maxP, 1);
      const darken = 1 - 0.8 * intensity;
      color.r = Math.round(color.r * darken * 0.8);
      color.g = Math.round(color.g * darken * 0.9);
      color.b = Math.round(color.b * darken * 1);

    } else if (m === GAS) {
      const a = 0.1 + 0.2 * (level[i] / liquidCap);
      color.r = Math.round(color.r * a * 0.8);
      color.g = Math.round(color.g * a * 0.9);
      color.b = Math.round(color.b * a * 1.0);
    }

    const di = i * 4;
    data[di] = color.r;
    data[di + 1] = color.g;
    data[di + 2] = color.b;
    data[di + 3] = 255;
  }

  oldPressure.set(_pressure);

  offscreenCtx.putImageData(imageData, 0, 0);

  // 🔥 Disegna la mini-mappa scalata sul canvas visibile
  ctx.drawImage(offscreenCanvas, 0, 0, W * cellSize, H * cellSize);

  // 🌊 GPU-like overlay (riflessi e scurimento dinamico)
  //applyWaterOverlay(ctx);
}

function applyWaterOverlay(ctx) {
  const t = performance.now() * 0.001; // tempo in secondi
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.save();

  // Ombre dinamiche (scuriscono la parte bassa)
  ctx.globalCompositeOperation = 'multiply';
  ctx.filter = 'contrast(120%) saturate(140%) brightness(95%)';
  ctx.globalAlpha = 0.25 + 0.1 * Math.sin(t * 1.5);

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 30, 80, 0.7)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Riflessi dinamici (bagliori sull'acqua)
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.1;
  ctx.filter = 'blur(1px) brightness(130%)';

  const wave = ctx.createLinearGradient(0, 0, w, 0);
  wave.addColorStop(0, `rgba(180, 200, 255, ${0.3 + 0.2 * Math.sin(t)})`);
  wave.addColorStop(1, `rgba(230, 240, 255, ${0.2 + 0.1 * Math.cos(t * 0.7)})`);
  ctx.fillStyle = wave;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

export function drawBrushPreview(ctx) {
  if (!mouseInside) return;
  const brushSize = getBrushSize();
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
