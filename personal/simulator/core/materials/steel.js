import { EMPTY, GAS, LAVA, STEEL, WATER } from '../constants.js';
import { exchange, idx, inBounds, mat, moved } from '../grid.js';


export function updateSteel(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ];

    let steelNear = 0;
    for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (mat[ni] === LAVA) {
            if (!inBounds(x, y + 1)) return;
            const di = idx(x, y + 1);
            if (mat[di] === WATER || mat[di] === LAVA || mat[di] === EMPTY || mat[di] === GAS) {
                exchange(i, di);
                return;
            }
        }
        if (mat[ni] === WATER && fastRandom() < 0.01) {
            trasform(i, SAND);
            return;
        }
        if (mat[ni] === STEEL) steelNear++;
    }
    if (steelNear < 2) {
        if (!inBounds(x, y + 1)) return;
        const di = idx(x, y + 1);
        if (mat[di] === WATER || mat[di] === LAVA || mat[di] === EMPTY || mat[di] === GAS) {
            exchange(i, di);
            return;
        }
    }
    moved[i] = 1;
    return
}