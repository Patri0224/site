import { inBounds, idx, mat, moved, W, H, exchange, trasform } from '../grid.js';
import { EMPTY, GAS, LAVA, ROCK, WALL, WATER } from '../constants.js';
import { fastRandom } from '../utils.js';
export let isAttached = new Uint8Array(W * H);

export function updateRock(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;
    const _mat = mat;
    // Direzioni con priorità: giù, diagonali, laterali
    const neighbors = [
        [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
    ];
    let near = 0;
    let lavaNear = 0;
    for (const [dx, dy] of neighbors) {
        if (!inBounds(dx, dy)) {
            near = 8;
        } else {
            const l = idx(dx, dy);
            if (_mat[l] === ROCK || _mat[l] === WALL) {
                near++;
            }
            if (_mat[l] === LAVA) {
                lavaNear++;
            }
        }
    }
    if (lavaNear >= 4) {
        // In basso: la roccia si fonde lentamente
        const heat = y / H;
        if (fastRandom() < (0.003 * heat)) {
            trasform(i, LAVA);
            return;
        }

    }
    if (near >= 4) {
        return;
    }
    const below = y + 1;
    if (inBounds(x, below)) {
        const ti = idx(x, below);
        const dst = _mat[ti];
        // Se spazio vuoto sotto, cade
        if (dst === EMPTY || dst === GAS || dst === WATER) {
            exchange(i, ti);
            return;
        }
    }

    return;
}

