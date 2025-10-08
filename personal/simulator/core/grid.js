import { EMPTY } from './constants.js';

export let W, H, mat, level, moved, fireTTL, pressure;
export const cellSize = 6;

export function idx(x, y) { return y * W + x; }
export function inBounds(x, y) { return x >= 0 && x < W && y >= 0 && y < H; }

export function initGrid() {
    mat.fill(EMPTY);
    level.fill(0);
    moved.fill(0);
    fireTTL.fill(0);
    pressure.fill(0);
}

export function resizeGrid(width, height) {
    W = Math.floor(width / cellSize);
    H = Math.floor(height / cellSize);
    mat = new Uint8Array(W * H);
    level = new Uint8Array(W * H);
    moved = new Uint8Array(W * H);
    fireTTL = new Uint8Array(W * H);
    pressure = new Uint8Array(W * H);
   
}
