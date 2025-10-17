import { gameOver } from '../main.js';
import { colors, SHAPES } from './blocks.js';
import { board, cells, doesFit, idx } from './grid.js';
import { getAvailableBlocks, setAvailbleBlocks, setColorAvailableBlocks } from './render.js';
import { fastRandomInt } from './utils.js';

export let score = 0;
export let combo = 0; // combo attuale
export let bestScore = 0;
export function setScore(val) { score = val; }
export function setBestScore(val) { bestScore = val; }
export function blockInserted(blockId) {
    if (!blockId || !board) return;

    const shape = SHAPES[blockId];
    if (!shape) return;

    // 1️⃣ punti base: 1 punto per ogni cella del pezzo
    const basePoints = shape.length;
    score += basePoints;

    // 2️⃣ controlla righe e colonne piene
    let clearedRows = [];
    let clearedCols = [];

    // righe
    for (let row = 0; row < cells; row++) {
        let full = true;
        for (let col = 0; col < cells; col++) {
            if (board[idx(col, row)] === 0) {
                full = false;
                break;
            }
        }
        if (full) clearedRows.push(row);
    }

    // colonne
    for (let col = 0; col < cells; col++) {
        let full = true;
        for (let row = 0; row < cells; row++) {
            if (board[idx(col, row)] === 0) {
                full = false;
                break;
            }
        }
        if (full) clearedCols.push(col);
    }

    // 3️⃣ svuota righe e colonne e assegna punti bonus
    const rowPoints = 10; // punti per ogni riga
    const colPoints = 10; // punti per ogni colonna

    // combo multiplier: +0.5 per ogni riga/colonna extra nella stessa mossa
    let multiplier = 1 + (clearedRows.length + clearedCols.length - 1) * 0.5 + 1 / 10 * combo;

    // svuota righe
    clearedRows.forEach(row => {
        for (let col = 0; col < cells; col++) {
            board[idx(col, row)] = 0;
        }
        score += rowPoints * multiplier;
    });

    // svuota colonne
    clearedCols.forEach(col => {
        for (let row = 0; row < cells; row++) {
            board[idx(col, row)] = 0;
        }
        score += colPoints * multiplier;
    });

    // aggiorna combo
    combo = clearedRows.length + clearedCols.length / 2;
    controlAvaible();
    checkAvailableBlocksFit();
}


// Genera un blocco casuale dato un range di difficoltà
function randomBlockByDifficulty(slotIndex) {
    // slotIndex: 0, 1 o 2 (puoi usarlo per dare più difficoltà ai primi 2 slot e lasciare il 3 più casuale)
    const pool = [];

    // slot 0 e 1: difficoltà controllata
    if (slotIndex === 0 || slotIndex === 1) {
        // blocchi comuni
        for (let i = 1; i <= 10; i++) pool.push(i, i); // raddoppiamo per probabilità più alta
        // blocchi medi
        for (let i = 11; i <= 18; i++) if (Math.random() < 0.2) pool.push(i);
        // blocchi rari
        for (let i = 19; i <= 30; i++) if (Math.random() < 0.07) pool.push(i);
    } else {
        // slot 2: qualsiasi blocco con probabilità uniforme
        for (let i = 1; i <= 18; i++) pool.push(i);
        for (let i = 19; i <= 30; i++) if (Math.random() < 0.5) pool.push(i);
    }

    // fallback in caso di pool vuoto
    if (pool.length === 0) return Math.floor(Math.random() * 30) + 1;

    return pool[Math.floor(Math.random() * pool.length)];
}


export function controlAvaible() {
    // controlla se ci sono blocchi disponibili
    let a = [getAvailableBlocks(0), getAvailableBlocks(1), getAvailableBlocks(2)]
    if (a.some(b => b !== 0)) return;

    // slot vuoti → generiamo nuovi blocchi
    const newBlocks = [];

    // Primo pezzo facile (1–4 celle)
    newBlocks.push(randomBlockByDifficulty(0));

    // Secondo pezzo medio (5–6 celle)
    newBlocks.push(randomBlockByDifficulty(1));

    // Terzo pezzo casuale (qualsiasi difficoltà)
    newBlocks.push(randomBlockByDifficulty(2));

    // assegna ai 3 slot
    for (let i = 0; i < 3; i++) {
        setAvailbleBlocks(i, newBlocks[i]);
        setColorAvailableBlocks(i, colors[fastRandomInt(4) + 2]);
    }
}
export function checkAvailableBlocksFit() {
    let canFit = false;
    let a = [getAvailableBlocks(0), getAvailableBlocks(1), getAvailableBlocks(2)];
    for (let i = 0; i < a.length; i++) {
        const block = a[i];
        if (block === 0) continue; // slot vuoto
        // Scorri tutta la griglia per vedere se il blocco può entrare
        for (let y = 0; y < cells; y++) {
            for (let x = 0; x < cells; x++) {
                if (doesFit(block, x, y)) {
                    canFit = true;
                    break;
                }
            }
            if (canFit) break;
        }
        if (canFit) break;
    }

    if (!canFit) {
        // Nessun blocco può entrare → game over

        setTimeout(() => {
            if (score > bestScore) {
                bestScore = score;
            }
            gameOver();
        }, 3000);
    }

    // eventualmente si può chiamare initGrid() o mostrare un popup
}
