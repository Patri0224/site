import { idx, inBounds, mat, moved, pressure, trasform } from '../grid.js';
import { EMPTY, DSTR } from '../constants.js';
import { fastRandom } from '../utils.js';
export function updateDstr(x, y) {
    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ];
    let e = 0;
    for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) {
            e++;
            continue;
        };
        const ni = idx(nx, ny);
        if (mat[ni] !== EMPTY) {
            trasform(ni, EMPTY);
        } else {
            e++;
        }
    }
    const i = idx(x, y);
    if (e == 4 && fastRandom() < 0.02)
        trasform(i, EMPTY);
}