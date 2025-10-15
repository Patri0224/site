import { EMPTY, FIRE, GAS, LEAF, leafDistance, liquidCap, WOOD, woodDistance } from "../constants.js";
import { exchange, idx, inBounds, level, mat, moved, option1, trasform, option2, W } from "../grid.js";
import { fastRandom, fastRandomInt } from "../utils.js";

const NEIGH = [
    [0, 1], [-1, 1], [1, 1],
    [-1, 0], [1, 0], [0, -1],
    [-1, -1], [1, -1]
];
const woodTooNearGround = (woodDistance * 4) / 5;

export function updateLeaf(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    const _mat = mat;
    const _opt = option1;
    const _opt2 = option2;

    let nearEmpty = [];
    _opt2[i] = 0;
    let radDim = 0;
    // --- Primo ciclo: aggiornamento vicini e propagazione stati ---
    for (let n = 0; n < NEIGH.length; n++) {
        const [dx, dy] = NEIGH[n];
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        const t = _mat[ni];

        if (t === EMPTY) {
            nearEmpty.push(ni);
            continue;
        }

        if (t === WOOD) {
            const opt2n = _opt2[ni];
            if (opt2n > 0 && opt2n < woodTooNearGround) {
                _opt2[i] = leafDistance;
                if (_opt[ni] && !_opt[i]) {
                    _opt[ni] = 0;
                    _opt[i] = 1;
                }
            }
            continue;
        }

        if (t === LEAF) {
            const opt2n = _opt2[ni];
            if (opt2n > 0 && _opt2[i] < opt2n - 1) {
                if (dx === 0 || ny % 2 === 0 || dy < 1)
                    _opt2[i] = opt2n - 1;
                else
                    _opt2[i] = opt2n - 2;
            }
            if (_opt[ni] && !_opt[i]) {
                _opt[ni] = 0;
                _opt[i] = 1;
            }
        }
    }

    // --- Secondo ciclo: interazioni con fuoco e gas ---
    for (let n = 0; n < NEIGH.length; n++) {
        const [dx, dy] = NEIGH[n];
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        const t = _mat[ni];

        if (t === FIRE) {
            if (fastRandom() < 0.05) {
                trasform(i, FIRE);
                return;
            }
        } else if (t === GAS) {
            const lv = level[ni];
            if (lv > 0) {
                const absorb = liquidCap | 0; // equivalente a Math.floor(liquidCap)
                level[ni] = lv - absorb;
                if (level[ni] <= 0) trasform(ni, EMPTY);
            }
        }
    }

    // --- Movimento / caduta ---
    if (_opt2[i] === 0) {
        const downY = y + 1;
        // Giù, giù-sx, giù-dx
        const dirs = [[x, downY], [x - 1, downY], [x + 1, downY]];
        const [nx, ny] = dirs[fastRandomInt(3)];
        if (inBounds(nx, ny)) {
            const ni = idx(nx, ny);
            const dst = _mat[ni];
            if (dst === EMPTY || dst === GAS) {
                exchange(i, ni);
                return;
            }
        }

        if (fastRandom() < 0.05) {
            trasform(i, EMPTY);
            return;
        }
    }

    // --- Generazione nuova foglia ---
    if (_opt[i] === 1 && fastRandom() < 0.03 && nearEmpty.length > 2 && (i % 6) === 0) {
        const r = nearEmpty[fastRandomInt(nearEmpty.length)];
        _opt[i] = 0;
        trasform(r, LEAF);
    }
    if (_opt[i] === 1 && fastRandom() < 0.03 && nearEmpty.length > 3) {
        const r = nearEmpty[fastRandomInt(nearEmpty.length)];
        _opt[i] = 0;
        trasform(r, LEAF);
    }
}
