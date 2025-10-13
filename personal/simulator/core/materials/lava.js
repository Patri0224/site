import { inBounds, idx, mat, moved, H, exchange, trasform } from '../grid.js';
import { EMPTY, WATER, GAS, LAVA, SAND, ROCK, STEEL } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateLava(x, y) {
    const i = idx(x, y);
    if (moved[i]) return false;
    // Direzioni con priorità: giù, diagonali, laterali
    let dirs = [
        [0, 1],    // giù
        [-1, 1],   // giù-sinistra
        [1, 1],    // giù-destra
        [-1, 0],   // sinistra
        [1, 0]     // destra
    ];
    // Ordine casuale per evitare bias sinistra/destra
    if (fastRandom() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inBounds(nx, ny)) continue;

        const ni = idx(nx, ny);
        const dst = mat[ni];

        // Lava scende sempre se c’è spazio
        if ((dst === EMPTY || dst === GAS)) {
            exchange(i, ni);
            if (fastRandom() < 0.01) trasform(ni, ROCK);
            return true;
        }
    }

    const directions1 = [
        { dx: -1, dy: 0 }, // sinistra
        { dx: 1, dy: 0 },  // destra
        { dx: 0, dy: -1 }, // sopra
        { dx: 0, dy: +1 }, // sotto
    ];

    // celle candidate solo se sono acqua
    const candidates1 = directions1
        .map(d => ({ nx: x + d.dx, ny: y + d.dy }))
        .filter(pos => inBounds(pos.nx, pos.ny))
        .filter(pos => mat[idx(pos.nx, pos.ny)] === EMPTY);

    if (candidates1.length > 0) {
        if (fastRandom() < 0.01) {
            trasform(i, ROCK);
            return true;
        }
    }
    let lavaNear = 4;
    let directions = [
        [0, 1],    // giù
        [-1, 0],   // sinistra
        [1, 0],    // destra
        [0, -1]    // su
    ];
    // Scegli una cella a caso tra quelle disponibili
    if (fastRandom() > 0.5) directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const di = idx(nx, ny);
        if (mat[di] !== LAVA && mat[di] !== STEEL) lavaNear--;
        if (mat[di] === WATER) {
            trasform(di, ROCK);
            if (fastRandom() < 0.1) trasform(i, ROCK);
            moved[i] = 1;
            return;
        }
        if (mat[di] === SAND && fastRandom() < 0.1) {
            trasform(di, ROCK);
            if (fastRandom() < 0.1) trasform(i, ROCK);;
            moved[i] = 1;
            return;
        }

    }

    /*if (lavaNear < 4 && (fastRandom() * (y * 2 / H + 1)) < 0.01) {
        mat[i] = ROCK;
        moved[i] = 1;
    }*/
    const heat = y / H;

    // In alto: la lava si solidifica più facilmente
    if (lavaNear < 4 && fastRandom() < (0.002 * (1 - heat))) {
        trasform(i, ROCK);
        return;
    }
}


