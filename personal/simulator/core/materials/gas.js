import { inBounds, idx, mat, moved, level, exchange } from '../grid.js';
import { EMPTY, WATER, GAS, liquidCap } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateGas(x, y) {
  const i = idx(x, y);
  if (moved[i]) return false;

  const above = y - 1;
  if (inBounds(x, above)) {
    const ti = idx(x, above);
    const dst = mat[ti];
    // Gas rises, displacing water if needed
    if (dst === EMPTY || dst === WATER) {
      exchange(i, ti);
      return true;
    }
  }

  // Move sideways if blocked
  const dirs = fastRandom() < 0.5 ? [-1, 1] : [1, -1];
  for (const dx of dirs) {
    const nx = x + dx;
    if (!inBounds(nx, y)) continue;
    const ni = idx(nx, y);
    if (mat[ni] === EMPTY) {
      exchange(i, ni);
      return true;
    } else if (mat[ni] === GAS) {
      // flow proportional to level difference
      const diff = level[i] - level[ni];
      if (diff > 1) {
        const amt = Math.floor(diff / 2);
        level[i] -= amt;
        level[ni] += amt;
        moved[ni] = 1;
        return true;
      }
    }
  }
  return false;
}
