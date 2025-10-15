import { inputPresent, resumeFrames, stopFrames } from "../main.js";
import {
    EMPTY, SAND, WATER, WALL, WOOD, FIRE, GAS, DSTR, SURG,
    FISH, ROCK, LAVA, LEAF, STEEL, IVY
} from "./constants.js";
import { exchange, H, idx, inBounds, mat, trasform, W } from "./grid.js";
import { fastRandom, fastRandomInt } from "./utils.js";

const MATERIAL_MAP = {
    "empty": EMPTY,
    "sand": SAND,
    "water": WATER,
    "wall": WALL,
    "wood": WOOD,
    "fire": FIRE,
    "gas": GAS,
    "dstr": DSTR,
    "surg": SURG,
    "fish": FISH,
    "rock": ROCK,
    "lava": LAVA,
    "leaf": LEAF,
    "steel": STEEL,
    "ivy": IVY
};
let storiaComandi = [];
// 🔹 converte nome materiale o numero stringa in valore numerico
function matStringToMatNum(m) {
    if (m === undefined) return null;
    if (!isNaN(m)) return parseInt(m);
    const lower = m.toLowerCase();
    return MATERIAL_MAP[lower] ?? null;
}
function StringToNum(m) {
    if (m === undefined) return 0;
    if (!isNaN(m)) return parseInt(m);
}
export function vecchioComando() {
    if (storiaComandi.length > 0)
        return storiaComandi.pop();
    return "";
}
export function eseguiComando(comando) {
    const str = comando.trim().toLowerCase();
    if (!str) return;
    storiaComandi.push(str);
    const strDiv = str.split(/\s+/);
    stopFrames();

    switch (strDiv[0]) {
        case "k":
        case "kill":
            if (strDiv.length == 2)
                kill(matStringToMatNum(strDiv[1]));
            else if (strDiv.length == 3)
                killr(matStringToMatNum(strDiv[1]), parseFloat(strDiv[2]));
            break;
        case "t":
        case "trasform":
        case "transform": // alias
            if (strDiv.length == 3)
                trasformMat(matStringToMatNum(strDiv[1]), matStringToMatNum(strDiv[2]));
            else if (strDiv.length == 4)
                trasformr(matStringToMatNum(strDiv[1]), matStringToMatNum(strDiv[2]), parseFloat(strDiv[3]));
            break;
        case "list":
        case "materials":
            listMaterials();
            break;
        case "e":
        case "terr":
            if (strDiv.length == 2)
                terr(StringToNum(strDiv[1]));
            else if (strDiv.length == 3)
                terrm(StringToNum(strDiv[1]), matStringToMatNum(strDiv[2]));
            break;
        case "ex":
        case "terrx":
            terrEx(StringToNum(strDiv[1]), StringToNum(strDiv[2]));
            break;
        case "c":
        case "count":
            count(matStringToMatNum(strDiv[1]));
            break;
        default:
            console.warn("Comando sconosciuto:", strDiv[0]);
    }

    resumeFrames();
    inputPresent();
}

// 🔹 elimina tutte le celle di un materiale
function kill(materiale) {
    if (materiale == null) return;
    for (let y = 0; y < H; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W; x++) {
            const i = rowOffset + x;
            if (mat[i] === materiale)
                trasform(i, EMPTY);
        }
    }
}

// 🔹 elimina in percentuale casuale
function killr(materiale, val = 50) {
    if (materiale == null) return;
    const rand = val / 100;
    for (let y = 0; y < H; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W; x++) {
            const i = rowOffset + x;
            if (mat[i] === materiale && fastRandom() < rand)
                trasform(i, EMPTY);
        }
    }
}

// 🔹 trasforma tutto un tipo in un altro
function trasformMat(materiale1, materiale2) {
    if (materiale1 == null || materiale2 == null) return;
    for (let y = 0; y < H; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W; x++) {
            const i = rowOffset + x;
            if (mat[i] === materiale1)
                trasform(i, materiale2);
        }
    }
}

// 🔹 trasforma in percentuale casuale
function trasformr(materiale1, materiale2, val = 50) {
    if (materiale1 == null || materiale2 == null) return;
    const rand = val / 100;
    for (let y = 0; y < H; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W; x++) {
            const i = rowOffset + x;
            if (mat[i] === materiale1 && fastRandom() < rand)
                trasform(i, materiale2);
        }
    }
}
const NEIGH = [
    [0, 1], [-1, 1], [1, 1],
    [-1, 0], [1, 0], [0, -1],
    [-1, -1], [1, -1]
];
function terr(val) {
    const rand = val / 100;
    for (let y = 1; y < H - 1; y++) {
        const rowOffset = y * W;
        for (let x = 1; x < W - 1; x++) {
            const i = rowOffset + x;
            if (fastRandom() < rand) {
                const [dx, dy] = NEIGH[fastRandomInt(8)];
                exchange(i, idx(x + dx, y + dy));
            }
        }
    }
}

// 🔹 trasforma in percentuale casuale
function terrm(val, materiale) {
    if (materiale == null) return;
    const rand = val / 100;
    for (let y = 1; y < H - 1; y++) {
        const rowOffset = y * W;
        for (let x = 1; x < W - 1; x++) {
            const i = rowOffset + x;
            if (fastRandom() < rand && mat[i] === materiale) {
                const [dx, dy] = NEIGH[fastRandomInt(8)];
                exchange(i, idx(x + dx, y + dy));
            }
        }
    }
}
function terrEx(val, intensitaMax = 1) {
    const rand = val / 100;
    for (let y = 0; y < H - 0; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W - 0; x++) {
            const i = rowOffset + x;
            if (fastRandom() < rand) {
                const intensita = fastRandomInt(intensitaMax) + 1;
                const dx = fastRandomInt(1 + 2 * intensita) - intensita;
                const dy = fastRandomInt(1 + 2 * intensita) - intensita;
                const ni = idx(x + dx, y + dy);
                if (inBounds(x + dx, y + dy)) exchange(i, ni);
            }
        }
    }
}
function count(materiale) {
    if (materiale == null) return;
    let c = 0;
    for (let y = 0; y < H; y++) {
        const rowOffset = y * W;
        for (let x = 0; x < W; x++) {
            const i = rowOffset + x;
            if (mat[i] === materiale)
                c++;
        }
    }
    console.log("mat count: " + c);
}
// 🔹 mostra in console la lista di materiali
function listMaterials() {
    console.log("=== MATERIALI DISPONIBILI ===");
    Object.entries(MATERIAL_MAP).forEach(([name, value]) => {
        console.log(`${value.toString().padStart(2, " ")} → ${name}`);
    });
    console.log("==============================");
}