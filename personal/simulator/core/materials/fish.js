import { inBounds, idx, mat, moved, trasform, exchange } from '../grid.js';
import { EMPTY, WATER, GAS, FISH, SAND } from '../constants.js';
import { fastRandom, fastRandomInt } from '../utils.js';

export function updateFish(x, y) {
    const i = idx(x, y);
    if (moved[i]) return false;

    const below = inBounds(x, y + 1) ? idx(x, y + 1) : -1;

    // Caso 1: caduta verso aria o gas
    if (below !== -1 && (mat[below] === EMPTY || mat[below] === GAS)) {
        // cade verso il basso
        if (fastRandom() < 0.05) {
            trasform(i, SAND);
            return;
        }
        exchange(i, below);
        moved[i] = true;
        return;
    }
    if (fastRandom() < 0.6) return;
    // Caso 2: pesce in acqua (può muoversi lateralmente o sopra)
    const directions = [
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: 0, dy: -1 }, // sopra
        { dx: 0, dy: 1 }, // sotto
    ];

    // celle candidate solo se sono acqua
    const candidates = directions
        .map(d => ({ nx: x + d.dx, ny: y + d.dy }))
        .filter(pos => inBounds(pos.nx, pos.ny))
        .filter(pos => mat[idx(pos.nx, pos.ny)] === WATER);

    if (candidates.length === 0) {
        if (fastRandom() < 0.1) {
            trasform(i, SAND);
        }
        moved[i] = true;
        return false;
    }

    // Scegli una cella a caso tra quelle disponibili
    const choice = candidates[fastRandomInt(candidates.length)];
    const ni = idx(choice.nx, choice.ny);

    // Muovi il pesce
    exchange(i, ni);
    return;
}


