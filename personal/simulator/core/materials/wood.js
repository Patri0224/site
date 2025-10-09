import { inBounds, idx, mat, moved, level, pressure, W } from '../grid.js';
import { EMPTY, WATER, GAS, FIRE, WOOD, liquidCap } from '../constants.js';

export function updateWood(x, y) {
  const i = idx(x, y);
  if (moved[i]) return false;

  const neighborsWater = [
    [x - 1, y - 1], [x + 1, y - 1], [x, y - 1]
  ];
  for (const [nx, ny] of neighborsWater) {
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (mat[ni] === WATER) {
      // scambia con l'acqua se sopra
      mat[ni] = WOOD;
      mat[i] = WATER;
      moved[ni] = 1;
      return true;
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
            mat[tii] = WOOD;
            mat[i] = dsti;
            moved[tii] = 1;
            return true;
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
      mat[ti] = WOOD;
      mat[i] = dst;
      moved[ti] = 1;
      return true;
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
    if (mat[ni] === FIRE && Math.random() < 0.05) {
      mat[i] = FIRE;
      moved[i] = 1;
      break;
    }
    if (mat[ni] === GAS && level[ni] > 0) {
      const absorb = Math.max(1, Math.floor(liquidCap * 1)); // 100% per step
      level[ni] -= absorb;
      if (level[ni] <= 0) {
        mat[ni] = EMPTY;
        level[ni] = 0;
        pressure[ni] = 0;
      }
    }

  }
  if (!inBounds(x, y + 1)) return true;
  const ni = idx(x, y + 1);
  if (mat[ni] !== WATER) return true;
  if (pressure[ni] < 3) return true;
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
          /*if (inBounds(x, y - e - 1) && mat[idx(x, y - e - 1)] === EMPTY) {
            e++;
          }*/
          mat[idx(x, y - e)] = WOOD;
          mat[i] = EMPTY;
          moved[idx(x, y - e)] = 1;
          moved[i] = 1;
          moved[stackWood[0]] = 1;
        }
        break;
      }
    }

  }
  return true;

}
