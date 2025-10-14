import { inBounds, idx, mat, moved, level, pressure, exchange, trasform, option1, option2 } from '../grid.js';
import { EMPTY, WATER, GAS, FIRE, WOOD, liquidCap, STEEL, WALL, ROCK, SAND, woodDistance } from '../constants.js';
import { fastRandom } from '../utils.js';

// --- Vicini predefiniti (non ricreati ogni frame) ---
const NEIGH_FIRE = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [1, -1], [-1, 1], [1, 1],
];

const NEIGH_WATER_AROUND = [
  [0, 1], [-1, 1], [1, 1]    // sotto
];

export function updateWood(x, y) {

  const i = idx(x, y);
  if (moved[i]) return;

  const _mat = mat;
  const _opt = option1;

  // --- 1. Acqua sopra ---
  const upY = y - 1;
  if (upY >= 0) {
    const upIdx = idx(x, upY);
    if (_mat[upIdx] === WATER) {
      if (!_opt[i]) {
        trasform(upIdx, EMPTY);
        _opt[i] = 1;
      }
      exchange(i, upIdx);
      return;
    }
  }

  // --- 2. Acqua laterale con spazio sopra ---
  if (upY >= 0) {
    const upIdx = idx(x, upY);
    const above = _mat[upIdx];
    if (above === EMPTY || above === GAS) {
      let a;
      if (fastRandom() < 0.5)
        a = x - 1;
      else
        a = x + 1;
      if (inBounds(a, y)) {
        const li = idx(a, y);
        if (_mat[li] === WATER) {
          if (!_opt[i]) {
            trasform(li, EMPTY);
            _opt[i] = 1;
          }
          exchange(i, upIdx);
          return;
        }
      }
    }
  }

  // --- 3. Acqua sotto ---
  option2[i] = 0;
  for (let k = 0; k < NEIGH_WATER_AROUND.length; k++) {
    const [dx, dy] = NEIGH_WATER_AROUND[k];
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (_mat[ni] === SAND || _mat[ni] === ROCK || _mat[ni] === WALL || _mat[ni] === STEEL) option2[i] = woodDistance;
    if (_mat[ni] === WATER && !_opt[i]) {
      trasform(ni, EMPTY);
      _opt[i] = 1;
    }
  }
  for (let k = 0; k < NEIGH_FIRE.length; k++) {
    const [dx, dy] = NEIGH_FIRE[k];
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (_mat[ni] === WOOD && option2[i] < (option2[ni] - 1)) {
      option2[i] = option2[ni] - 1;
    }
  }
  // --- 4. Gravità ---
  const downY = y + 1;
  if (inBounds(x, downY)) {
    const di = idx(x, downY);
    const dst = _mat[di];
    if (dst === EMPTY || dst === GAS) {
      exchange(i, di);
      return;
    }
  }

  // --- 5. Fuoco e gas ---
  for (let k = 0; k < NEIGH_FIRE.length; k++) {
    const [dx, dy] = NEIGH_FIRE[k];
    const nx = x + dx, ny = y + dy;
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    const t = _mat[ni];

    if (t === FIRE && fastRandom() < 0.05) {
      trasform(i, FIRE);
      return;
    }
  }

  // --- 6. Propagazione stato "option1" ---
  if (_opt[i] !== 1) {
    for (let k = 0; k < NEIGH_FIRE.length; k++) {
      if (fastRandom() < 0.1) break;
      const [dx, dy] = NEIGH_FIRE[k];
      const nx = x + dx, ny = y + dy;
      if (!inBounds(nx, ny)) continue;
      const ni = idx(nx, ny);
      if (_opt[ni] && _mat[ni] === WOOD) {
        _opt[ni] = 0;
        _opt[i] = 1;
        return;
      }
    }
  }

  // --- 7. Pressione acqua sotto ---
  if (downY < mat.height) {
    const ni = idx(x, downY);
    if (_mat[ni] === WATER && pressure[ni] >= 3) {
      const stack = [];
      let e = 1;

      while (true) {
        const li = idx(x, y - e);
        if (!inBounds(x, y - e)) break;
        const mt = _mat[li];

        if (mt !== WOOD && mt !== EMPTY) break;

        if (mt === WOOD) {
          stack.push(li);
          e++;
        } else {
          // spazio vuoto sopra pila di legno
          if (stack.length * 1.5 < pressure[ni] + 2) {
            exchange(i, li);
            moved[stack[0]] = 1;
            return;
          }
          break;
        }
      }
    }
  }
}
