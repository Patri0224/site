import { idx, inBounds, mat, moved, pressure } from '../grid.js';
import { EMPTY, DSTR } from '../constants.js';

export function updateDstr(x, y) {
    const i = idx(x, y);
    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ];

    for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (mat[ni] !== EMPTY && Math.random() < 0.20) {
            mat[ni] = EMPTY;
            moved[ni] = 1;
            break;
        }
    }
}