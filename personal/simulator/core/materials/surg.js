import { idx, inBounds, mat, moved, pressure } from '../grid.js';
import { EMPTY, SURG, WATER } from '../constants.js';

export function updateSurg(x, y) {
    const i = idx(x, y);
    if (!inBounds(x, y - 1)) return;
    let l = idx(x, y - 1);
    if (mat[l] !== EMPTY) return;
    mat[l] = WATER;
    pressure[l] = 1;
    moved[l] = 1;
}
