const cells = 8;
const MENU = 1;
const GAME = 2;
const DIVGRID = document.getElementById("grid-container");
const DIVOPTIONS0 = document.getElementById("option-0");
const DIVOPTIONS1 = document.getElementById("option-1");
const DIVOPTIONS2 = document.getElementById("option-2");
const DIVOPTIONS3 = document.getElementById("option-3");
const DIVPREVIEW = document.getElementById("preview-block");
const MENUSCREEN = document.getElementById("menu-screen");
const MIN = 1;
const MAX = 30;


const R3O = 1;
const R4O = 2;
const R5O = 3;
const R3V = 4;
const R4V = 5;
const R5V = 6;
const Q2 = 7;
const Q3 = 8;
const R23 = 9;
const R32 = 10;

const LUR = 11;
const LUL = 12;
const LDR = 13;
const LDL = 14;
const LRU = 15;
const LRD = 16;
const LLU = 17;
const LLD = 18;

const SUR = 19;
const SUL = 20;
const SRU = 21;
const SLU = 22;
const C1 = 23;
const C2 = 24;
const C3 = 25;
const C4 = 26;
const P14 = 27;
const P23 = 28;
const TU = 29;
const TD = 30;
const SHAPES = {
    // Rettangoli orizzontali e verticali
    [R3O]: [[-2, 0], [-1, 0], [0, 0]],              // 3 orizzontale
    [R4O]: [[-3, 0], [-2, 0], [-1, 0], [0, 0]],
    [R5O]: [[-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0]],

    [R3V]: [[0, -2], [0, -1], [0, 0]],              // 3 verticale
    [R4V]: [[0, -3], [0, -2], [0, -1], [0, 0]],
    [R5V]: [[0, -4], [0, -3], [0, -2], [0, -1], [0, 0]],

    // Quadrati e piccole varianti
    [Q2]: [[-1, -1], [0, -1], [-1, 0], [0, 0]],        // classico blocco 2x2
    [Q3]: [[-2, -2], [-1, -2], [0, -2], [-2, -1], [-1, -1], [0, -1], [-2, 0], [-1, 0], [0, 0]], // 3x3 pieno

    // R combinati (es. due linee intersecate)
    [R23]: [[0, -2], [-1, -2], [0, 0], [-1, 0], [0, -1], [-1, -1]],
    [R32]: [[-2, -1], [-1, -1], [0, -1], [-2, 0], [-1, 0], [0, 0]],

    // L-shape vari (Up/Down + Left/Right)
    [LUR]: [[-1, -2], [-1, -1], [-1, 0], [0, 0]],
    [LUL]: [[0, -2], [0, -1], [0, 0], [-1, 0]],
    [LDR]: [[-1, 0], [-1, -1], [-1, -2], [0, -2]],
    [LDL]: [[0, 0], [0, -1], [0, -2], [-1, -2]],

    // L rovesciate (R e L invertiti)
    [LRU]: [[0, 0], [-1, 0], [-2, 0], [-2, -1]],
    [LRD]: [[0, -1], [-1, -1], [-2, -1], [-2, 0]],
    [LLU]: [[-2, 0], [-1, 0], [0, 0], [0, -1]],
    [LLD]: [[-2, -1], [-1, -1], [0, -1], [0, 0]],

    // S-shape (zigzag)
    [SUR]: [[0, -2], [0, -1], [-1, -1], [-1, 0]],       // S ruotato verso destra
    [SUL]: [[-1, -2], [-1, -1], [0, -1], [0, 0]],       // S ruotato verso sinistra
    [SRU]: [[0, -1], [-1, -1], [-1, 0], [-2, 0]],       // Z ruotato in su
    [SLU]: [[-2, -1], [-1, -1], [-1, 0], [0, 0]],

    // Blocchi quadrati e speciali
    [C1]: [[-2, -2], [-2, -1], [-2, 0], [-1, 0], [0, 0]],
    [C2]: [[-2, -2], [-2, -1], [-2, 0], [-1, -2], [0, -2]],
    [C3]: [[-2, -2], [-1, -2], [0, -2], [0, -1], [0, 0]],
    [C4]: [[0, -2], [0, -1], [0, 0], [-1, 0], [-2, 0]],

    // Pezzi personalizzati
    [P14]: [[-1, -1], [0, 0]], // tipo “L lunga”
    [P23]: [[-1, 0], [0, -1]],  // tipo “angolo a scala”
    [TU]: [[-2, -1], [-1, -1], [0, -1], [-1, 0]],
    [TD]: [[-1, -1], [-2, 0], [-1, 0], [0, 0]]
};


const colors = [
    '#161616ff',//background
    '#323232ff',//color grid
    '#595959ff',//color estgrid
    '#10bd00ff',//
    '#0053ceff',
    '#cd1b00ff',
    '#edcd00ff',//
];
const interiorCell=`<div class="cell"></div>`;