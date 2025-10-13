import { inBounds, idx, mat, moved, exchange, option1 } from '../grid.js';
import { EMPTY, WATER, GAS, SAND } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateSand(x, y) {
  const i = idx(x, y);
  if (moved[i]) return;
  const _mat = mat;
  const below = y + 1;
  if (!inBounds(x, below)) return;

  const ti = idx(x, below);
  const dst = _mat[ti];

  // sabbia scende o affonda
  if (dst === EMPTY || dst === GAS) {
    option1[i] = 0;
    if (fastRandom() < 0.05) option1[i] = 1;
    exchange(i, ti);
    return;
  }

  // 💧 sabbia affonda in acqua scambiandosi di posto
  if (dst === WATER) {
    let a = 1;
    if (fastRandom() < 0.5) a = -1;
    if (inBounds(x + a, below)) {
      const tii = idx(x + a, below);
      if (_mat[tii] === EMPTY || _mat[tii] === GAS) {
        exchange(ti, tii);
        exchange(i, ti);
        return;
      } else if (_mat[tii] === WATER && fastRandom() < 0.2) {
        exchange(i, tii);
        return;
      } else {
        exchange(i, ti);
        return;
      }
    }
  }
  if (option1[i] == 1) return;
  // scivola lateralmente
  const dirs = fastRandom() < 0.5 ? [-1, 1] : [1, -1];
  for (const dx of dirs) {
    const nx = x + dx;
    if (!inBounds(nx, below)) continue;
    const ni = idx(nx, below);
    const dst2 = _mat[ni];

    if (dst2 === EMPTY || dst2 === GAS || dst2 === WATER) {
      exchange(i, ni);
      return;
    }
  }
  return;
}
