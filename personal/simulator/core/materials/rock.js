import { inBounds, idx, mat, moved, W, H } from '../grid.js';
import { EMPTY, GAS, ROCK, WALL } from '../constants.js';
export let isAttached = new Uint8Array(W * H);

export function updateRock(x, y) {
    const i = idx(x, y);
    if (moved[i]) return false;
    // Direzioni con priorità: giù, diagonali, laterali
    const directions = [
        [0, 1],    // giù
        [-1, 0],   // sinistra
        [1, 0],    // destra
        [0, -1]    // su
    ];
    let near = 0;
    for (const [dx, dy] of directions) {
        if (!inBounds(x + dx, y + dy)) {
            moved[i] = 1;
            return true;
        }
        const l = idx(x + dx, y + dy);
        if (mat[l] === ROCK || mat[l] === WALL) {
            near++;
        }
    }
    if (near >= 3) {
        moved[i] = 1;
        return true;
    }
    const below = y + 1;
    if (inBounds(x, below)) {
        const ti = idx(x, below);
        const dst = mat[ti];
        // Se spazio vuoto sotto, cade
        if (dst === EMPTY || dst === GAS) {
            mat[ti] = ROCK;
            mat[i] = dst;
            moved[ti] = 1;
            return true;
        }
    }
    return true;
}
export function calcAttached(W, H) {
    isAttached.fill(0);
    //mat[y * W + x]
    for (let x = 0; x < W; x++) {
        if (mat[x] == ROCK) isAttached[x] = 1;
    }
    for (let x = 0; x < W; x++) {
        if (mat[(H - 1) * W + x] == ROCK) isAttached[(H - 1) * W + x] = 1;
    }
    for (let y = 0; y < H; y++) {
        if (mat[y * W] == ROCK) isAttached[y * W] = 1;
    }
    for (let y = 0; y < H; y++) {
        if (mat[y * W - (W - 1)] == ROCK) isAttached[y * W - (W - 1)] = 1;
    }
    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
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
        }

    }
}

