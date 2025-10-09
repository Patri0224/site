import { inBounds, idx, mat, moved } from '../grid.js';
import { EMPTY, WATER, GAS, LAVA, SAND, ROCK } from '../constants.js';

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
    if (Math.random() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inBounds(nx, ny)) continue;

        const ni = idx(nx, ny);
        const dst = mat[ni];

        // Acqua scende sempre se c’è spazio
        if ((dst === EMPTY || dst === GAS)) {
            if (Math.random() < 0.3) {
                moved[i] = 1;
                return true;
            }
            mat[ni] = LAVA;
            mat[i] = (dst === GAS) ? GAS : EMPTY;
            moved[ni] = 1;
            if (Math.random() < 0.01) mat[ni] = ROCK;
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
        if (Math.random() < 0.01) {
            mat[i] = ROCK;
            moved[i] = true;
            return true;
        }
    }
    let directions = [
        [0, 1],    // giù
        [-1, 0],   // sinistra
        [1, 0],    // destra
        [0, -1]    // su
    ];
    // Scegli una cella a caso tra quelle disponibili
    if (Math.random() > 0.5) directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    for (const [dx, dy] of directions) {
        if (!inBounds(x + dx, y + dy)) continue;
        const di = idx(x + dx, y + dy);
        if (mat[di] === WATER) {
            mat[di] = ROCK;
            moved[di] = 1;
            if (Math.random() < 0.1) mat[i] = ROCK;
            moved[i] = 1;
            return true;
        }
        if (mat[di] === SAND && Math.random < 0.4) {
            mat[di] = ROCK;
            moved[di] = 1;
            if (Math.random() < 0.1) mat[i] = ROCK;
            moved[i] = 1;
            return true;
        }


    }
    return true;
}


