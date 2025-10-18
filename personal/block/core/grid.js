import { margin } from "../main.js";
import { cells, MAX, MIN, SHAPES } from "./blocks.js";
import { blockInserted } from "./logic.js";
import { getColorPreviewBlock, setCellSize, setColorCells } from "./render.js";
export let W, cellSize, board;// { type: 'row'|'col', index, progress }
export function setBoard(val) {
    board.splice(0, board.length, ...val);
}
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
    board = new Uint8Array(cells * cells);
    board.fill(0);

}

export function resizeGrid(width, height) {

    if (width > height) {
        W = Math.min(height, width * 3 / 4) - margin;
        cellSize = W / cells;
    } else {
        W = Math.min(width, height * 3 / 4) - margin;
        cellSize = W / cells;
    }
    setCellSize(cellSize);

}
