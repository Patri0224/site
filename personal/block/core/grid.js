import { margin } from "../main.js";
import { MAX, MIN, SHAPES } from "./blocks.js";
import { blockInserted } from "./logic.js";
import { getColorPreviewBlock, setColorCells } from "./render.js";
export const cells = 8;
export let W, cellSize, board;// { type: 'row'|'col', index, progress }
export function idx(x, y) { return y * cells + x; }
export function inBounds(x, y) { return x >= 0 && x < cells && y >= 0 && y < cells; }
export function doesFit(block, x, y) {
    if (block < MIN || block > MAX) return false;
    for (const [dx, dy] of SHAPES[block]) {
        if (!inBounds(x + dx, y + dy)) return false;
        if (board[idx(x + dx, y + dy)] === 1) return false;
    }
    return true;
}
export function insertBlock(block, x, y) {
    for (const [dx, dy] of SHAPES[block]) {
        board[idx(x + dx, y + dy)] = 1;
        setColorCells(idx(x + dx, y + dy), getColorPreviewBlock())
    }
    blockInserted(block);
}

export function initGrid() {
    board.fill(0);

}

export function resizeGrid(width, height) {
    board = new Uint8Array(cells * cells);
    if (width > height) {
        W = Math.min(height, width * 3 / 4) - margin;
        cellSize = W / cells;
    } else {
        W = Math.min(width, height * 3 / 4) - margin;
        cellSize = W / cells;
    }

}
