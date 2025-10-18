import { gameOver } from '../main.js';
import { colors, SHAPES } from './blocks.js';
import { board, cells, doesFit, idx } from './grid.js';
import { colorCells, desaturate, getAvailableBlocks, risaturate, setAvailbleBlocks, setColorAvailableBlocks } from './render.js';
import { fastRandomInt } from './utils.js';

export let score = 0;
export let combo = 0; // combo attuale
export let bestScore = 0;
export let clearingAnimations = [];
export function setScore(val) { score = val; }
export function setBestScore(val) { bestScore = val; }
export function setCombo(val) { combo = val; }
export function blockInserted(blockId) {
    if (!blockId || !board) return;
    const shape = SHAPES[blockId];
    if (!shape) return;

    // 1️⃣ punti base: più celle nel pezzo → più punti
    const basePoints = shape.length;
    score += basePoints;

    // 2️⃣ controlla righe e colonne piene
    let clearedRows = [];
    let clearedCols = [];

    for (let row = 0; row < cells; row++) {
        if (board.slice(row * cells, row * cells + cells).every(v => v !== 0)) {
            clearedRows.push(row);
        }
    }
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
    const rowBase = 10;
    const colBase = 10;

    // Combina bonus per righe + colonne: più ce ne sono in un turno, più punti
    const comboMultiplier = 1 + (clearedRows.length + clearedCols.length - 1) * 0.5;
    const consecutiveBonus = 1 + combo * 0.3; // bonus extra per combo di turni consecutivi

    // svuota righe
    clearedRows.forEach(row => {
        for (let col = 0; col < cells; col++) {
            const i = idx(col, row);
            clearingAnimations.push({ progress: 0, x: col, y: row, color: colorCells[i] });
            board[i] = 0;
        }
        score += rowBase * comboMultiplier * consecutiveBonus;
    });

    // svuota colonne
    clearedCols.forEach(col => {
        for (let row = 0; row < cells; row++) {
            const i = idx(col, row);
            clearingAnimations.push({ progress: 0, x: col, y: row, color: colorCells[i] });
            board[i] = 0;
        }
        score += colBase * comboMultiplier * consecutiveBonus;
    });

    // Aggiorna combo: più righe/colonne in un turno → combo maggiore
    combo = (clearedRows.length + clearedCols.length) * 1.5;

    // Salva bestScore immediatamente se superato
    if (score > bestScore) bestScore = score;

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
        setColorAvailableBlocks(i, colors[fastRandomInt(4) + 3]);
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
        desaturate()
        setTimeout(() => {
            if (score > bestScore) {
                bestScore = score;
            }
            risaturate();
            gameOver();
        }, 3000);
    }

    // eventualmente si può chiamare initGrid() o mostrare un popup
}
