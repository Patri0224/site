import { WATER, GAS, EMPTY } from '../constants.js';
import { W, H, idx, inBounds, mat, moved, pressure } from '../grid.js';

let waterPhisic = true;
export function setWaterPhisic(val) {
  waterPhisic = val;
}
export function getWaterPhisic() {
  return waterPhisic;
}
// -----------------------------
// UPDATE WATER (usa la pressione)
// -----------------------------
export function updateWater(x, y) {
  const i = idx(x, y);
  if (moved[i]) return;

  const p = pressure[i];
  if (p === 0) return;

  // Direzioni con priorità: giù, diagonali, laterali
  let dirs = [
    [0, 1],    // giù
    [-1, 1],   // giù-sinistra
    [1, 1],    // giù-destra
    [-1, 0],   // sinistra
    [1, 0]     // destra
  ];

  // Ordine casuale per evitare bias sinistra/destra
  if (Math.random() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];

  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny)) continue;

    const ni = idx(nx, ny);
    const dst = mat[ni];

    // Acqua scende sempre se c’è spazio
    if ((dst === EMPTY || dst === GAS)) {
      mat[ni] = WATER;
      mat[i] = (dst === GAS) ? GAS : EMPTY;
      moved[ni] = 1;
      return;
    }
    if (dst === WATER) {
      const diff = p - pressure[ni];
      if (Math.abs(diff) > 1) {
        const flow = Math.sign(diff);
        pressure[i] -= flow;
        pressure[ni] += flow;
        moved[ni] = 1;
        return;
      }
    }
  }

}
export function updateWaterNoPressure(x, y) {
  const i = idx(x, y);
  if (moved[i]) return;
  // Direzioni con priorità: giù, diagonali, laterali
  let dirs = [
    [0, 1],    // giù
    [-1, 1],   // giù-sinistra
    [1, 1],    // giù-destra
    [-1, 0],   // sinistra
    [1, 0]     // destra
  ];
  // Ordine casuale per evitare bias sinistra/destra
  if (Math.random() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny)) continue;

    const ni = idx(nx, ny);
    const dst = mat[ni];

    // Acqua scende sempre se c’è spazio
    if ((dst === EMPTY || dst === GAS)) {
      mat[ni] = WATER;
      mat[i] = (dst === GAS) ? GAS : EMPTY;
      moved[ni] = 1;
      return;
    }
  }

}


// -----------------------------
// CALCOLO PRESSIONE
// -----------------------------
export function calcPressure() {
  const visited = new Uint8Array(W * H);
  pressure.fill(0);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (mat[i] !== WATER || visited[i]) continue;

      // --- BFS per il bacino corrente ---
      const stack = [i];
      const cells = [];
      visited[i] = 1;

      while (stack.length > 0) {
        const ci = stack.pop();
        cells.push(ci);
        const cx = ci % W;
        const cy = Math.floor(ci / W);

        for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const nx = cx + dx, ny = cy + dy;
          if (!inBounds(nx, ny)) continue;
          const ni = idx(nx, ny);
          if (dy !== 0) {
            const leftWall = inBounds(cx - 1, cy) && mat[idx(cx - 1, cy)] === EMPTY;
            const rightWall = inBounds(cx + 1, cy) && mat[idx(cx + 1, cy)] === EMPTY;
            if (leftWall && rightWall) continue; // colonna stretta, non unire i bacini
          }
          if (mat[ni] === WATER && !visited[ni]) {
            visited[ni] = 1;
            stack.push(ni);
          }
        }
      }

      // --- Calcolo pressione per il bacino ---
      let minY = Infinity;
      for (const ci of cells) {
        const cy = Math.floor(ci / W);
        if (cy < minY) minY = cy;
      }

      for (const ci of cells) {
        const cy = Math.floor(ci / W);
        const depth = cy - minY;
        pressure[ci] = Math.max(1, depth + 1);
      }
    }
  }
}
export function equilibrateWater() {
  const visited = new Uint8Array(W * H);
  visited.fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (mat[i] !== WATER || visited[i]) continue;

      // --- BFS per il bacino corrente ---
      const stack = [i];
      const cells = [];
      visited[i] = 1;

      while (stack.length > 0) {
        const ci = stack.pop();
        cells.push(ci);
        const cx = ci % W;
        const cy = Math.floor(ci / W);

        for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const nx = cx + dx, ny = cy + dy;
          if (!inBounds(nx, ny)) continue;
          const ni = idx(nx, ny);
          if (mat[ni] === WATER && !visited[ni]) {
            visited[ni] = 1;
            stack.push(ni);
          }
        }
      }
      const stackP1 = [];
      const stackP2 = [];
      for (const ci of cells) {
        let x = ci % W;
        let y = Math.floor(ci / W);
        if (inBounds(x, y - 1)) {
          const ni = idx(x, y - 1);
          if (mat[ni] === EMPTY) {
            if (pressure[ci] <= 2)
              stackP1.push({ i: ci, pressure: pressure[ci] });
            else if (pressure[ci] > 2 && Math.random() < 0.05)
              stackP2.push({ i: ni, pressure: pressure[ci] });
          }
        }
      }
      stackP2.sort((a, b) => b.pressure - a.pressure);
      stackP1.sort((a, b) => a.pressure - b.pressure);
      //console.log(stackP1.length, stackP2.length);
      let l = Math.max(stackP1.length / 10, 5);
      for (const entry of stackP2) {
        if (stackP1.length === 0) break;
        if (l-- <= 0) break;
        const entry1 = stackP1.pop();
        const ni = entry1.i;
        const ci = entry.i;
        mat[ni] = EMPTY;
        mat[ci] = WATER;
        moved[ni] = 1;
        moved[ci] = 1;
        pressure[ni] = 0;
        pressure[ci] = 2;
      }
    }
  }
}


// -----------------------------
// BILANCIAMENTO LATERALE (smooth)
// -----------------------------
export function balanceLiquids() {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (mat[i] !== WATER) continue;

      for (const dx of [-1, 1]) {
        const nx = x + dx;
        if (!inBounds(nx, y)) continue;
        const ni = idx(nx, y);
        if (mat[ni] === WATER) {
          const diff = pressure[i] - pressure[ni];
          if (Math.abs(diff) > 1) {
            const flow = Math.sign(diff);
            pressure[i] -= flow;
            pressure[ni] += flow;
          }
        }
      }
    }
  }
}
