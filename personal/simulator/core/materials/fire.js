import { inBounds, idx, mat, fireTTL, level, pressure } from '../grid.js';
import { EMPTY, GAS, WOOD, FIRE, WATER } from '../constants.js';

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
    if (mat[ni] === WOOD && Math.random() < 0.2) { // aumentata probabilità
      mat[ni] = FIRE;
      fireTTL[ni] = 20 + Math.floor(Math.random() * 40);
      level[ni] = 0;
      pressure[ni] = 0;
      spread = true;
    }
  }

  // 2️⃣ Salire nell’aria solo se non c’è legno vicino e sopra non c’è acqua
  const aboveY = y - 1;
  if (!spread && inBounds(x, aboveY)) {
    const ti = idx(x, aboveY);
    const dst = mat[ti];
    if ((dst === EMPTY || dst === GAS) && Math.random() < 0.1) { // probabilità maggiore
      mat[ti] = FIRE;
      fireTTL[ti] = 10 + Math.floor(Math.random() * 20);
      level[ti] = 0;
      pressure[ti] = 0;
    }
  }

  // 3️⃣ Decrementa TTL solo alla fine
  if (fireTTL[i] > 0) {
    fireTTL[i]--;
  }
  if (fireTTL[i] === 0) {
    if (Math.random() < 0.3) {
      mat[i] = GAS;
      level[i] = Math.max(1, Math.floor(Math.random() * 4));
    } else {
      mat[i] = EMPTY;
      level[i] = 0;
      pressure[i] = 0;
    }
  }
}
