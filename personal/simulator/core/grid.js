import { EMPTY, LAVA, cellSize } from './constants.js';
export let W, H, mat, level, moved, fireTTL, pressure;

export function idx(x, y) { return y * W + x; }
export function inBounds(x, y) { return x >= 0 && x < W && y >= 0 && y < H; }

export function initGrid() {
    mat.fill(EMPTY);
    level.fill(0);
    moved.fill(0);
    fireTTL.fill(0);
    pressure.fill(0);
}

export function resizeGrid(width, height, op) {
    if (op == true) {
        W = Math.floor(width / cellSize);
        H = Math.floor(height / cellSize);
        mat = new Uint8Array(W * H);
        level = new Uint8Array(W * H);
        moved = new Uint8Array(W * H);
        fireTTL = new Uint8Array(W * H);
        pressure = new Uint8Array(W * H);
    } else {
        // Salva i dati precedenti
        const W1 = W, H1 = H;
        const mat1 = mat, level1 = level, moved1 = moved, fireTTL1 = fireTTL, pressure1 = pressure;

        // Crea nuove griglie
        W = Math.floor(width / cellSize);
        H = Math.floor(height / cellSize);
        mat = new Uint8Array(W * H);
        level = new Uint8Array(W * H);
        moved = new Uint8Array(W * H);
        fireTTL = new Uint8Array(W * H);
        pressure = new Uint8Array(W * H);

        // Copia solo l’area che rientra nei limiti di entrambe le griglie
        const minW = Math.min(W, W1);
        const minH = Math.min(H, H1);

        for (let y = 0; y < minH; y++) {
            for (let x = 0; x < minW; x++) {
                const i = y * W + x;
                const i1 = y * W1 + x;
                mat[i] = mat1[i1];
                level[i] = level1[i1];
                moved[i] = moved1[i1];
                fireTTL[i] = fireTTL1[i1];
                pressure[i] = pressure1[i1];
            }
        }
    }

}
