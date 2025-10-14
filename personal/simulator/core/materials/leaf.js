import { EMPTY, FIRE, GAS, LEAF, leafDistance, liquidCap, WOOD } from "../constants.js";
import { exchange, idx, inBounds, level, mat, moved, option1, trasform, option2 } from "../grid.js";
import { fastRandom, fastRandomInt } from "../utils.js";

const NEIGH = [
    [0, 1], [-1, 1], [1, 1],
    [-1, 0], [1, 0], [0, -1],
    [-1, -1], [1, -1]
];

export function updateLeaf(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    const _mat = mat;
    const _opt = option1;
    const _opt2 = option2;
    let nearEmpty = [];
    _opt2[i] = 0;
    for (const [dx, dy] of NEIGH) {
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        if (_mat[ni] === EMPTY) nearEmpty.push(ni);
        if (_mat[ni] === WOOD && _opt2[ni] > 0) {
            _opt2[i] = leafDistance;
            if (_opt[ni] === 1 && _opt[i] === 0) {
                _opt[ni] = 0;
                _opt[i] = 1;
            }
        }
        if (_mat[ni] === LEAF) {
            if (_opt2[ni] > 0 && _opt2[i] < (_opt2[ni] - 1))
                _opt2[i] = _opt2[ni] - 1;
            if (_opt[ni] === 1 && _opt[i] === 0) {
                _opt[ni] = 0;
                _opt[i] = 1;
            }
        }
    }


    for (let k = 0; k < NEIGH.length; k++) {
        const [dx, dy] = NEIGH[k];
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        const t = _mat[ni];

        if (t === FIRE && fastRandom() < 0.05) {
            trasform(i, FIRE);
            return;
        }

        if (t === GAS && level[ni] > 0) {
            const absorb = Math.max(1, Math.floor(liquidCap));
            level[ni] -= absorb;
            if (level[ni] <= 0) trasform(ni, EMPTY);
        }
    }

    if (_opt2[i] === 0) {
        const downY = y + 1;
        const choices = [
            [x, downY],       // giù
            [x - 1, downY],   // giù-sinistra
            [x + 1, downY]    // giù-destra
        ];

        // scegli casualmente una delle 3 direzioni
        const [nx, ny] = choices[Math.floor(fastRandom() * 3)];

        if (inBounds(nx, ny)) {
            const ni = idx(nx, ny);
            const dst = _mat[ni];
            if (dst === EMPTY || dst === GAS) {
                exchange(i, ni);
                return;
            }
        }

        if (fastRandom() < 0.05)
            trasform(i, EMPTY);
    }


    if (_opt[i] === 1 && fastRandom() < 0.03) {
        const l = nearEmpty.length;
        if (l !== 0) {
            let r = nearEmpty[fastRandomInt(l)]
            _opt[i] = 0;
            trasform(r, LEAF);
            return;
        }
    }

}