import { inBounds, idx, mat, fireTTL, level, pressure, trasform } from '../grid.js';
import { EMPTY, GAS, WOOD, FIRE, WATER } from '../constants.js';
import { fastRandom, fastRandomInt } from '../utils.js';

export function updateFire(x, y) {
  const i = idx(x, y);

  let spread = false;

  // 1️⃣ Propaga ai vicini di legno
  const neighbors = [
    [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]
  ];

  for (const [nx, ny] of neighbors) {
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    if (mat[ni] === WOOD && fastRandom() < 0.2) { // aumentata probabilità
      trasform(ni, FIRE);
      fireTTL[ni] = 20 + fastRandomInt(40);
      spread = true;
    }
  }

  // 2️⃣ Salire nell’aria solo se non c’è legno vicino e sopra non c’è acqua
  const aboveY = y - 1;
  if (!spread && inBounds(x, aboveY)) {
    const ti = idx(x, aboveY);
    const dst = mat[ti];
    if ((dst === EMPTY || dst === GAS) && fastRandom() < 0.1) { // probabilità maggiore
      trasform(ti, FIRE);
      fireTTL[ti] = 10 + fastRandomInt(20);
    }
  }

  // 3️⃣ Decrementa TTL solo alla fine
  if (fireTTL[i] > 0) {
    fireTTL[i]--;
  }
  if (fireTTL[i] === 0) {
    if (Math.random() < 0.3) {
      trasform(i, GAS);
      level[i] = Math.max(1, fastRandomInt(4));
    } else {
      trasform(i, EMPTY);
    }
  }
  return;
}
