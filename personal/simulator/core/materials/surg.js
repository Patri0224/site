import { idx, inBounds, mat, moved, pressure, trasform } from '../grid.js';
import { EMPTY, SURG, WATER } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateSurg(x, y) {
    const i = idx(x, y);
    if (!inBounds(x, y - 1)) {
        trasform(i, WATER);
        return;
    }

    let l = idx(x, y - 1);
    if (mat[l] === EMPTY) {
        trasform(l, WATER);
        return;
    }


    let e = 0;
    let w = 0;
    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ];
    for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) {
            trasform(i, WATER);
            return;
        }
        const ni = idx(nx, ny);
        if (mat[ni] === SURG) e++;
        if (mat[ni] === WATER) w++;
    }
    if ((e > 0 || w == 4) && fastRandom() < 0.1) trasform(i, WATER);
    return;
}
