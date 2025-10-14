import { EMPTY, LAVA, cellSize } from './constants.js';
import { fastRandomInt } from './utils.js';

export let W, H, mat, level, moved, fireTTL, pressure, option1, colorRender, option2;

export function idx(x, y) { return y * W + x; }
export function inBounds(x, y) { return x >= 0 && x < W && y >= 0 && y < H; }
export function exchange(i, di) {
    const t = mat[i];
    const p = pressure[i];
    const l = level[i];
    const o1 = option1[i];
    const o2 = option2[i];
    const c = colorRender[i];

    mat[i] = mat[di];
    pressure[i] = pressure[di];
    level[i] = level[di];
    option1[i] = option1[di];
    option2[i] = option2[di];
    colorRender[i] = colorRender[di];

    mat[di] = t;
    pressure[di] = p;
    level[di] = l;
    option1[di] = o1;
    option2[di] = o2;
    colorRender[di] = c;
    moved[i] = 1;
    moved[di] = 1;

}
export function trasform(i, material) {
    mat[i] = material;
    pressure[i] = 0;
    level[i] = 0;
    option1[i] = 0;
    option2[i] = 0;
    colorRender[i] = fastRandomInt(3);
    moved[i] = 1;
}

export function initGrid() {
    mat.fill(EMPTY);
    level.fill(0);
    moved.fill(0);
    fireTTL.fill(0);
    pressure.fill(0);
    option1.fill(0);
    option2.fill(0);
    inizializzaColor(W, W * H);

}

export function resizeGrid(width, height, op) {

    if (op == true) {
        W = Math.floor(width / cellSize);
        H = Math.floor(height / cellSize);
        mat = new Uint8Array(W * H);
        level = new Uint8Array(W * H);
        moved = new Uint8Array(W * H);
        fireTTL = new Uint8Array(W * H);
        pressure = new Uint16Array(W * H);
        option1 = new Uint8Array(W * H);
        option2 = new Uint8Array(W * H);
        colorRender = new Uint8Array(W * H);
    } else {
        // Salva i dati precedenti
        const W1 = W, H1 = H;
        const mat1 = mat, level1 = level, moved1 = moved, fireTTL1 = fireTTL, pressure1 = pressure, option11 = option1, option21 = option2, colorRender1 = colorRender;

        // Crea nuove griglie
        W = Math.floor(width / cellSize);
        H = Math.floor(height / cellSize);
        mat = new Uint8Array(W * H);
        level = new Uint8Array(W * H);
        moved = new Uint8Array(W * H);
        fireTTL = new Uint8Array(W * H);
        pressure = new Uint16Array(W * H);
        option1 = new Uint8Array(W * H);
        option2 = new Uint8Array(W * H);
        colorRender = new Uint8Array(W * H);
        inizializzaColor(W1, W * H);

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
                option1[i] = option11[i1];
                option2[i] = option21[i1];
                colorRender[i] = colorRender1[i1];
            }
        }
    }

}
function inizializzaColor(a, lenght) {
    let seed = 1234567890 + a * a;
    let b = 0;
    while (b < lenght) {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        let c = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        colorRender[b] = Math.floor(c * 3);
        b++;
    }
}
