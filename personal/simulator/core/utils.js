import { mat, level, option1, option2, W, H } from "./grid.js";

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

// salva-load
export function salvaStato() {
    const stato = {
        W,
        H,  
        mat: Array.from(mat),
        level: Array.from(level),
        option1: Array.from(option1),
        option2: Array.from(option2),
        timestamp: Date.now()
    };

    // Comprime i dati in stringa base64 per evitare errori e pesantezza
    const json = JSON.stringify(stato);
    const b64 = btoa(unescape(encodeURIComponent(json)));

    localStorage.setItem("gridState", b64);
    console.log("💾 Stato salvato");
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

        if (!stato.mat || !stato.level) throw new Error("Formato non valido");

        // Copia nei buffer esistenti
        for (let i = 0; i < stato.mat.length; i++) {
            mat[i] = stato.mat[i];
            if (stato.level) level[i] = stato.level[i];
            if (stato.option1) option1[i] = stato.option1[i];
            if (stato.option2) option2[i] = stato.option2[i];
        }

        console.log("✅ Stato caricato");
        return true;
    } catch (err) {
        console.error("Errore nel caricamento dello stato:", err);
        return false;
    }
}
