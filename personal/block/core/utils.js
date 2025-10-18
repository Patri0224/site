import { MENU, setState, state } from "../main.js";
import { colors } from "./blocks.js";
import { board, setBoard } from "./grid.js";
import { bestScore, combo, score, setBestScore, setCombo, setScore } from "./logic.js";
import { availableBlocks, colorAvailableBlocks, colorCells, colorpreviewBlock, previewBlock, setAvailbleBlocks, setColorAvailableBlocks, setColorCells, setColorPreviewBlock, setPreviewBlock } from "./render.js";

//rand seed
let seed = 123456789;

export function randSeed(s) {
    seed = s >>> 0;
}

export function fastRandom() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function fastRandomInt(max) {
    return Math.floor(fastRandom() * max);
}
export function salvaStato() {
    const stato = {
        state,
        score,
        bestScore,
        combo,
        board,
        availableBlocks,
        colorAvailableBlocks,
        colorCells,
    };

    try {
        const json = JSON.stringify(stato);
        const b64 = btoa(unescape(encodeURIComponent(json)));
        localStorage.setItem("gridState", b64);
        console.log("💾 Stato salvato");
    } catch (err) {
        console.error("❌ Errore durante il salvataggio:", err);
    }
}

export function caricaStato() {
    const b64 = localStorage.getItem("gridState");
    if (!b64) {
        console.warn("⚠️ Nessuno stato salvato");
        return false;
    }

    try {
        const json = decodeURIComponent(escape(atob(b64)));
        const stato = JSON.parse(json);

        // Validazione minima
        if (!stato.board || !Array.isArray(stato.availableBlocks)) {
            throw new Error("Formato non valido");
        }

        // Copia i dati nello stato corrente
        setState(stato.state ?? MENU);
        setScore(stato.score ?? 0);
        setBestScore(stato.bestScore ?? 0);
        setCombo(stato.combo ?? 0);

        if (!stato.board || !stato.availableBlocks || !stato.colorAvailableBlocks) {
            throw new Error("Formato non valido");
        }

        // ✅ aggiorna i valori principali tramite setter
        setBoard(stato.board);

        for (let i = 0; i < stato.availableBlocks.length; i++) {
            setAvailbleBlocks(i, stato.availableBlocks[i]);
            setColorAvailableBlocks(i, stato.colorAvailableBlocks[i]);
        }

        for (let i = 0; i < stato.colorCells.length; i++) {
            setColorCells(i, stato.colorCells[i]);
        }

        console.log("✅ Stato caricato");
        return true;
    } catch (err) {
        console.error("❌ Errore nel caricamento dello stato:", err);
        return false;
    }
}
