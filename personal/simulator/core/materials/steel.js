import { EMPTY, GAS, LAVA, STEEL, WATER, SAND } from '../constants.js';
import { exchange, idx, inBounds, mat, moved, trasform } from '../grid.js';
import { fastRandom } from '../utils.js';


export function updateSteel(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;
    const _mat = mat;
    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
    ];

    let steelNear = 0;
    for (const [nx, ny] of neighbors) {
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (_mat[ni] === LAVA) {
            if (!inBounds(x, y + 1)) return;
            const di = idx(x, y + 1);
            if (_mat[di] === WATER || _mat[di] === LAVA || _mat[di] === EMPTY || _mat[di] === GAS) {
                exchange(i, di);
                return;
            }
        }
        if (_mat[ni] === WATER && fastRandom() < 0.01) {
            trasform(i, SAND);
            return;
        }
        if (_mat[ni] === STEEL) steelNear++;
    }
    if (steelNear < 2) {
        if (!inBounds(x, y + 1)) return;
        const di = idx(x, y + 1);
        if (_mat[di] === WATER || _mat[di] === LAVA || _mat[di] === EMPTY || _mat[di] === GAS) {
            exchange(i, di);
            return;
        }
    }
    return
}