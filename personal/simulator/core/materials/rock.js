import { inBounds, idx, mat, moved } from '../grid.js';
import { EMPTY, GAS, ROCK, WALL } from '../constants.js';

export function updateRock(x, y) {
    const i = idx(x, y);
    if (moved[i]) return false;
    // Direzioni con priorità: giù, diagonali, laterali
    const directions = [
        [0, 1],    // giù
        [-1, 0],   // sinistra
        [1, 0],    // destra
        [0, -1]    // su
    ];
    for (const [dx, dy] of directions) {
        if (!inBounds(x + dx, y + dy)) {
            moved[i] = 1;
        }
        const l = idx(x + dx, y + dy);
        if (mat[l] === ROCK || mat[l] === WALL) {
            moved[i] = 1;
            return true;
        }
    }
    const below = y + 1;
    if (inBounds(x, below)) {
        const ti = idx(x, below);
        const dst = mat[ti];
        // Se spazio vuoto sotto, cade
        if (dst === EMPTY || dst === GAS) {
            mat[ti] = ROCK;
            mat[i] = dst;
            moved[ti] = 1;
            return true;
        }
    }
    return true;
}


