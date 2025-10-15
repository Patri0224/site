import { EMPTY, WATER, IVY, GAS } from "../constants.js";
import { exchange, idx, inBounds, mat, moved, option1, trasform } from "../grid.js";
import { fastRandom, fastRandomInt } from "../utils.js";

const NEIGH = [
    [0, 1], [-1, 1], [1, 1],
    [-1, 0], [1, 0],
    [0, -1], [-1, -1], [1, -1]
];
export function updateIvy(x, y) {
    const i = idx(x, y);
    if (moved[i]) return;

    const _mat = mat;
    const _opt = option1;
    let nearIvy = false;
    let nearEmpty = [];
    for (let n = 0; n < NEIGH.length; n++) {
        const [dx, dy] = NEIGH[n];
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const ni = idx(nx, ny);
        const t = _mat[ni];


        if (t === WATER && _opt[i] === 0) {
            nearIvy = true;
            trasform(ni, EMPTY);
            _opt[i] = 1;
            continue;
        }
        if (t === EMPTY || t === WATER) {
            nearEmpty.push(ni);
            continue;
        }
        if (t === IVY) {
            nearIvy = true;
            if (_opt[ni] && !_opt[i]) {
                _opt[ni] = 0;
                _opt[i] = 1;
            }
        }
    }

    if (_opt[i] === 1 && fastRandom() < 0.3) {
        if (nearEmpty.length > 2 && (i % 6) === 0) {
            const r = nearEmpty[fastRandomInt(nearEmpty.length)];
            _opt[i] = 0;
            trasform(r, IVY);
        } else if (nearEmpty.length > 3) {
            const r = nearEmpty[fastRandomInt(nearEmpty.length)];
            _opt[i] = 0;
            trasform(r, IVY);
        }
    } else if (_opt[i] === 0 && fastRandom() < 0.01) {
        trasform(i, EMPTY);
        return;
    }
    if (!nearIvy && fastRandom() < 0.05) {
        trasform(i, EMPTY);
        return;
    }
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

}
