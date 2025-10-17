export const R3O = 1;
export const R4O = 2;
export const R5O = 3;
export const R3V = 4;
export const R4V = 5;
export const R5V = 6;
export const Q2 = 7;
export const Q3 = 8;
export const R23 = 9;
export const R32 = 10;

export const LUR = 11;
export const LUL = 12;
export const LDR = 13;
export const LDL = 14;
export const LRU = 15;
export const LRD = 16;
export const LLU = 17;
export const LLD = 18;

export const SUR = 19;
export const SUL = 20;
export const SRU = 21;
export const SLU = 22;
export const C1 = 23;
export const C2 = 24;
export const C3 = 25;
export const C4 = 26;
export const P14 = 27;
export const P23 = 28;
export const TU = 29;
export const TD = 30;
export const SHAPES = {
    // Rettangoli orizzontali e verticali
    [R3O]: [[-1, 0], [0, 0], [1, 0]],              // 3 orizzontale
    [R4O]: [[-2, 0], [-1, 0], [0, 0], [1, 0]],
    [R5O]: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],

    [R3V]: [[0, -1], [0, 0], [0, 1]],              // 3 verticale
    [R4V]: [[0, -2], [0, -1], [0, 0], [0, 1]],
    [R5V]: [[0, -2], [0, -1], [0, 0], [0, 1], [0, 2]],

    // Quadrati e piccole varianti
    [Q2]: [[-1, -1], [0, -1], [-1, 0], [0, 0]],        // classico blocco 2x2
    [Q3]: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]], // 3x3 pieno

    // R combinati (es. due linee intersecate)
    [R23]: [[0, -1], [1, -1], [0, 0], [1, 0], [0, 1], [1, 1]],       // T verso il basso
    [R32]: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0]],      // T verso l’alto

    // L-shape vari (Up/Down + Left/Right)
    [LUR]: [[0, -2], [0, -1], [0, 0], [1, 0]],
    [LUL]: [[0, -2], [0, -1], [0, 0], [-1, 0]],
    [LDR]: [[0, 2], [0, 1], [0, 0], [1, 0]],
    [LDL]: [[0, 2], [0, 1], [0, 0], [-1, 0]],

    // L rovesciate (R e L invertiti)
    [LRU]: [[2, 0], [1, 0], [0, 0], [0, -1]],
    [LRD]: [[2, 0], [1, 0], [0, 0], [0, 1]],
    [LLU]: [[-2, 0], [-1, 0], [0, 0], [0, -1]],
    [LLD]: [[-2, 0], [-1, 0], [0, 0], [0, 1]],

    // S-shape (zigzag)
    [SUR]: [[0, -1], [0, 0], [-1, 0], [-1, 1]],       // S ruotato verso destra
    [SUL]: [[-1, -1], [-1, 0], [0, 0], [0, 1]],       // S ruotato verso sinistra
    [SRU]: [[1, -1], [0, -1], [0, 0], [-1, 0]],       // Z ruotato in su
    [SLU]: [[-1, -1], [0, -1], [0, 0], [1, 0]],

    // Blocchi quadrati e speciali
    [C1]: [[0, -2], [0, -1], [0, 0], [1, 0], [2, 0]],
    [C2]: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]],
    [C3]: [[-2, 0], [-1, 0], [0, 0], [0, 1], [0, 2]],
    [C4]: [[0, -2], [0, -1], [0, 0], [-1, 0], [-2, 0]],

    // Pezzi personalizzati
    [P14]: [[-1, -1], [0, 0]], // tipo “L lunga”
    [P23]: [[0, 0], [-1, 1]],  // tipo “angolo a scala”
    [TU]: [[-1, -1], [0, -1], [1, -1], [0, 0]],
    [TD]: [[0, 0], [-1, 1], [0, 1], [1, 1]]
};


export const colors = [
    '#161616ff',//background
    '#323232ff',//color grid
    '#10bd00ff',//
    '#0053ceff',
    '#cd1b00ff',
    '#edcd00ff',//
]
