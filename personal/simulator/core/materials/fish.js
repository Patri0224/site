import { inBounds, idx, mat, moved } from '../grid.js';
import { EMPTY, WATER, GAS, FISH, SAND } from '../constants.js';
import { fastRandom, fastRandomInt } from '../utils.js';

export function updateFish(x, y) {
    const i = idx(x, y);
    if (moved[i]) return false;

    const below = inBounds(x, y + 1) ? idx(x, y + 1) : -1;

    // Caso 1: caduta verso aria o gas
    if (below !== -1 && (mat[below] === EMPTY || mat[below] === GAS)) {
        // cade verso il basso
        if (Math.random() < 0.05) {
            mat[i] = SAND;
            return true;
        }
        [mat[i], mat[below]] = [mat[below], mat[i]];
        moved[i] = true;
        moved[below] = true;
        return true;
    }
    if (fastRandom() < 0.6) return true;
    // Caso 2: pesce in acqua (può muoversi lateralmente o sopra)
    const directions = [
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: 0, dy: -1 }, // sopra
        { dx: 0, dy: +1 }, // sotto
    ];

    // celle candidate solo se sono acqua
    const candidates = directions
        .map(d => ({ nx: x + d.dx, ny: y + d.dy }))
        .filter(pos => inBounds(pos.nx, pos.ny))
        .filter(pos => mat[idx(pos.nx, pos.ny)] === WATER);

    if (candidates.length === 0) {
        if (fastRandom() < 0.4) {
            mat[i] = SAND;
        }
        moved[i] = true;
        return false;
    }

    // Scegli una cella a caso tra quelle disponibili
    const choice = candidates[fastRandomInt(candidates.length)];
    const ni = idx(choice.nx, choice.ny);

    // Muovi il pesce
    [mat[i], mat[ni]] = [mat[ni], mat[i]];
    moved[i] = true;
    moved[ni] = true;

    return true;
}


