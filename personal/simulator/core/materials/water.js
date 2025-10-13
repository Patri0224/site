import { WATER, GAS, EMPTY } from '../constants.js';
import { W, H, idx, inBounds, mat, moved, pressure, exchange } from '../grid.js';
import { fastRandom } from '../utils.js';

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
  const _mat = mat;
  const _moved = moved;
  const _pressure = pressure;
  const i = idx(x, y);
  if (_moved[i]) return;

  const p = _pressure[i];
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
  if (fastRandom() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];

  for (const [dx, dy] of dirs) {
    if (dy == 0 && fastRandom() < 0.3) return;
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny)) continue;

    const ni = idx(nx, ny);
    const dst = _mat[ni];

    // Acqua scende sempre se c’è spazio
    if ((dst === EMPTY || dst === GAS)) {
      exchange(i, ni);
      return;
    }
  }
  return;
}
export function updateWaterNoPressure(x, y) {

  const _mat = mat;
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
  if (fastRandom() > 0.5) dirs = [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]];
  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (!inBounds(nx, ny)) continue;

    const ni = idx(nx, ny);
    const dst = _mat[ni];

    // Acqua scende sempre se c’è spazio
    if ((dst === EMPTY || dst === GAS)) {
      exchange(i, ni);
      return;
    }
  }
  return;
}


// -----------------------------
// CALCOLO PRESSIONE
// -----------------------------
export function calcPressure() {
  const _mat = mat;
  const _pressure = pressure;
  const visited = new Uint16Array(W * H);
  _pressure.fill(0);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (_mat[i] !== WATER || visited[i]) continue;

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
            const leftWall = inBounds(cx - 1, cy) && _mat[idx(cx - 1, cy)] === EMPTY;
            const rightWall = inBounds(cx + 1, cy) && _mat[idx(cx + 1, cy)] === EMPTY;
            if (leftWall && rightWall) continue; // colonna stretta, non unire i bacini
          }
          if (_mat[ni] === WATER && !visited[ni]) {
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
        _pressure[ci] = Math.max(1, depth + 1);
      }
    }
  }
}
export function equilibrateWater() {
  const _mat = mat;
  const _pressure = pressure;
  const visited = new Uint16Array(W * H);
  visited.fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (_mat[i] !== WATER || visited[i]) continue;

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
          if (_mat[ni] === WATER && !visited[ni]) {
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
          if (_mat[ni] === EMPTY) {
            if (_pressure[ci] <= 2)
              stackP1.push({ i: ci, _pressure: _pressure[ci] });
            else if (_pressure[ci] > 2 && Math.random() < 0.05)
              stackP2.push({ i: ni, _pressure: _pressure[ci] });
          }
        }
      }
      stackP2.sort((a, b) => b._pressure - a._pressure);
      stackP1.sort((a, b) => a._pressure - b._pressure);
      //console.log(stackP1.length, stackP2.length);
      let l = Math.max(stackP1.length / 10, 5);
      for (const entry of stackP2) {
        if (stackP1.length === 0) break;
        if (l-- <= 0) break;
        const entry1 = stackP1.pop();
        const ni = entry1.i;
        const ci = entry.i;
        exchange(ni, ci);
        _pressure[ni] = 0;
        _pressure[ci] = 2;
      }
    }
  }
}


// -----------------------------
// BILANCIAMENTO LATERALE (smooth)
// -----------------------------
export function balanceLiquids() {
  const _mat = mat;
  const _pressure = pressure;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (_mat[i] !== WATER) continue;

      for (const dx of [-1, 1]) {
        const nx = x + dx;
        if (!inBounds(nx, y)) continue;
        const ni = idx(nx, y);
        if (_mat[ni] === WATER) {
          const diff = _pressure[i] - _pressure[ni];
          if (Math.abs(diff) > 1) {
            const flow = Math.sign(diff);
            _pressure[i] -= flow;
            _pressure[ni] += flow;
          }
        }
      }
    }
  }
}
