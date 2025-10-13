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
  const i = idx(x, y);
  if (moved[i]) return;
  let dirs = [
    [x, y + 1],
    [x - 1, y + 1],
    [x + 1, y + 1],
    [x - 1, y],
    [x + 1, y]
  ];
  if ((x + y) % 2) dirs = [[x, y + 1], [x + 1, y + 1], [x - 1, y + 1], [x + 1, y], [x - 1, y]];
  for (const [nx, ny] of dirs) {
    if (ny == y && fastRandom() < 0.3) return;
    if (!inBounds(nx, ny)) continue;
    const ni = idx(nx, ny);
    const dst = _mat[ni];
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
  const visited = new Uint8Array(W * H);
  _pressure.fill(0);

  const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (_mat[i] !== WATER || visited[i]) continue;

      // BFS
      const stack = [i];
      const cells = [];
      visited[i] = 1;

      let minY = y;
      while (stack.length > 0) {
        const ci = stack.pop();
        const cy = Math.floor(ci / W);
        const cx = ci - cy * W;
        if (cy < minY) minY = cy;
        cells.push(ci);

        for (let d = 0; d < 4; d++) {
          const nx = cx + dirs[d][0];
          const ny = cy + dirs[d][1];
          if (!inBounds(nx, ny)) continue;
          const ni = idx(nx, ny);
          if (_mat[ni] === WATER && !visited[ni]) {
            visited[ni] = 1;
            stack.push(ni);
          }
        }
      }

      // Assegna pressione in un singolo pass
      for (const ci of cells) {
        const cy = Math.floor(ci / W);
        _pressure[ci] = (cy - minY + 1);
      }
    }
  }
}

export function equilibrateWater() {
  const _mat = mat;
  const _pressure = pressure;
  const visited = new Uint8Array(W * H);
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (_mat[i] !== WATER || visited[i]) continue;

      const stack = [i];
      const cells = [];
      visited[i] = 1;

      while (stack.length > 0) {
        const ci = stack.pop();
        cells.push(ci);
        const cy = Math.floor(ci / W);
        const cx = ci - cy * W;
        for (let d = 0; d < 4; d++) {
          const nx = cx + dirs[d][0];
          const ny = cy + dirs[d][1];
          if (!inBounds(nx, ny)) continue;
          const ni = idx(nx, ny);
          if (_mat[ni] === WATER && !visited[ni]) {
            visited[ni] = 1;
            stack.push(ni);
          }
        }
      }

      // --- Equilibrio ---
      const stackP1 = [];
      const stackP2 = [];
      for (const ci of cells) {
        const cy = Math.floor(ci / W);
        const cx = ci - cy * W;
        const upi = idx(cx, cy - 1);
        if (inBounds(cx, cy - 1) && _mat[upi] === EMPTY) {
          const p = _pressure[ci];
          if (p <= 2) stackP1.push(ci);
          else if (p > 2 && Math.random() < 0.05) stackP2.push(upi);
        }
      }

      // No sort: scegli casualmente un sottoinsieme
      const limit = Math.min(stackP1.length, stackP2.length, 5);
      for (let n = 0; n < limit; n++) {
        const ci = stackP2[n];
        const ni = stackP1[n];
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
