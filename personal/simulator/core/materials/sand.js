import { inBounds, idx, mat, moved } from '../grid.js';
import { EMPTY, WATER, GAS, SAND } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateSand(x, y) {
  const i = idx(x, y);
  if (moved[i]) return false;

  const below = y + 1;
  if (!inBounds(x, below)) return false;

  const ti = idx(x, below);
  const dst = mat[ti];

  // sabbia scende o affonda
  if (dst === EMPTY || dst === GAS) {
    mat[ti] = SAND;
    mat[i] = (dst === GAS) ? GAS : EMPTY;
    moved[ti] = 1;
    return true;
  }

  // 💧 sabbia affonda in acqua scambiandosi di posto
  if (dst === WATER) {
    let a = 1;
    if (fastRandom() < 0.5) a = -1;
    if (inBounds(x + a, below)) {
      const tii = idx(x + a, below);
      if (mat[tii] === EMPTY || mat[tii] === GAS) {
        mat[ti] = SAND;
        mat[i] = mat[tii];
        moved[ti] = 1;
        mat[tii] = WATER;
        return true;
      } else if (mat[tii] === WATER && fastRandom() < 0.2) {
        mat[tii] = SAND;
        mat[i] = WATER;
        moved[tii] = 1;
        return true;
      } else {
        mat[ti] = SAND;
        mat[i] = WATER;
        moved[ti] = 1;
        return true;
      }
    }
  }
  // scivola lateralmente
  const dirs = fastRandom() < 0.5 ? [-1, 1] : [1, -1];
  for (const dx of dirs) {
    const nx = x + dx;
    if (!inBounds(nx, below)) continue;
    const ni = idx(nx, below);
    const dst2 = mat[ni];

    if (dst2 === EMPTY || dst2 === GAS) {
      mat[ni] = SAND;
      mat[i] = (dst2 === GAS) ? GAS : EMPTY;
      moved[ni] = 1;
      return true;
    }

    if (dst2 === WATER) {
      mat[ni] = SAND;
      mat[i] = WATER;
      moved[ni] = 1;
      return true;
    }
  }
  return false;
}
