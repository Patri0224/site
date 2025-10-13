import { inBounds, idx, mat, moved, level, pressure, W, exchange, trasform } from '../grid.js';
import { EMPTY, WATER, GAS, FIRE, WOOD, liquidCap } from '../constants.js';
import { fastRandom } from '../utils.js';

export function updateWood(x, y) {
  const i = idx(x, y);
  if (moved[i]) return;

  const neighborsWater = [
    [x - 1, y - 1], [x + 1, y - 1], [x, y - 1]
  ];
  for (const [nx, ny] of neighborsWater) {
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (mat[ni] === WATER) {
      // scambia con l'acqua se sopra
      exchange(i, ni);
      return;
    }
  }
  const neighborsWaterLateral = [
    [x - 1, y], [x + 1, y]
  ];
  const upper = y - 1;
  if (inBounds(x, upper)) {
    const tii = idx(x, upper);
    const dsti = mat[tii];
    // Se spazio vuoto sopra, cade
    if (dsti === EMPTY || dsti === GAS) {
      for (const [nx, ny] of neighborsWaterLateral) {
        if (inBounds(nx, ny)) {
          const ni = idx(nx, ny);
          if (mat[ni] === WATER) {
            exchange(i, tii);
            return;
          }
        }
      }
    }
  }
  const below = y + 1;
  if (inBounds(x, below)) {
    const ti = idx(x, below);
    const dst = mat[ti];
    // Se spazio vuoto sotto, cade
    if (dst === EMPTY || dst === GAS) {
      exchange(i, ti);
      return;
    }
  }

  // Vicino al fuoco: chance di bruciare
  const neighbors = [
    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
  ];

  for (const [nx, ny] of neighbors) {
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (mat[ni] === FIRE && fastRandom() < 0.05) {
      trasform(i, FIRE);
      return;
    }
    if (mat[ni] === GAS && level[ni] > 0) {
      const absorb = Math.max(1, Math.floor(liquidCap * 1)); // 100% per step
      level[ni] -= absorb;
      if (level[ni] <= 0) {
        trasform(ni, EMPTY);
      }
    }

  }
  if (!inBounds(x, y + 1)) return;
  const ni = idx(x, y + 1);
  if (mat[ni] !== WATER) return;
  if (pressure[ni] < 3) return;
  //console.log('pressure pass', x, y, pressure[ni]);
  const stackWood = [];
  let e = 1;
  while (true) {
    if (!inBounds(x, y - e)) break;
    if (mat[idx(x, y - e)] !== WOOD && mat[idx(x, y - e)] !== EMPTY) break;

    if (mat[idx(x, y - e)] === WOOD) {
      //console.log('push wood', x, y - e);
      stackWood.push(idx(x, y - e));
      e++;
    } else {
      if (mat[idx(x, y - e)] === EMPTY) {
        //console.log('check air', x, y - e, pressure[ni], stackWood.length);
        if (stackWood.length * 1.5 < pressure[ni] + 2) {
          //console.log('move wood', x, y - e, pressure[ni], stackWood.length);
          exchange(i, idx(x, y - e));
          moved[idx(x, y - e)] = 1;
          moved[i] = 1;
          moved[stackWood[0]] = 1;
        }
        break;
      }
    }

  }
  return;

}
