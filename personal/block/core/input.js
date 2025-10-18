// input.js
import { cells, cellSize, doesFit, insertBlock, W } from "./grid.js";
import {
    setPreviewBlock,
    getAvailableBlocks,
    setAvailbleBlocks,
    setColorPreviewBlock,
    getColorAvailableBlocks
} from "./render.js";

export let mouseX = 0;
export let mouseY = 0;
export let dragging = false;
let draggedBlock = 0;
let draggedSlotIndex = -1;

const canvas = document.getElementById('canvas');

// =================== EVENTI MOUSE ===================
canvas.addEventListener("mousemove", e => {
    updatePointer(e.clientX, e.clientY);
}, { passive: true });

canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    handlePointerDown(e.clientX, e.clientY);
}, { passive: true });

canvas.addEventListener("mouseup", e => {
    if (e.button !== 0) return;
    handlePointerUp(e.clientX, e.clientY);
}, { passive: true });

// === TOUCH ===
canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    handlePointerDown(t.clientX, t.clientY);
}, { passive: true });

canvas.addEventListener("touchmove", e => {
    const t = e.touches[0];
    updatePointer(t.clientX, t.clientY);
}, { passive: true });

canvas.addEventListener("touchend", e => {
    if (dragging) handlePointerUp(mouseX, mouseY);
}, { passive: true });


// =================== FUNZIONI COMUNI ===================
function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
}

function handlePointerDown(clientX, clientY) {
    updatePointer(clientX, clientY);
    if (dragging) return;
    const slotIndex = checkClickOnOptions(mouseX, mouseY);
    if (slotIndex >= 0) {
        // Inizio trascinamento da uno slot
        draggedBlock = getAvailableBlocks(slotIndex);
        if (draggedBlock === 0) return;
        dragging = true;
        draggedSlotIndex = slotIndex;
        setPreviewBlock(draggedBlock);
        setColorPreviewBlock(getColorAvailableBlocks(slotIndex));
        setAvailbleBlocks(slotIndex, 0); // slot temporaneamente vuoto
        return;
    }
    /*
        // Se cliccato sulla griglia e c’è un blocco selezionato
        const gx = Math.floor(mouseX / cellSize);
        const gy = Math.floor(mouseY / cellSize);
        const pb = getPreviewBlock();
        if (pb !== 0 && doesFit(pb, gx, gy)) {
            insertBlock(pb, gx, gy);
            setPreviewBlock(0);
        }*/
}

function handlePointerUp(clientX, clientY) {
    updatePointer(clientX, clientY);
    if (!dragging || draggedBlock === 0) return;
    dragging = false;

    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);

    if (doesFit(draggedBlock, gx, gy)) {
        insertBlock(draggedBlock, gx, gy);
        // qui puoi chiamare blockInserted() e controlAvailable()
        setPreviewBlock(0);
    } else {
        // ripristina nello slot originale
        setAvailbleBlocks(draggedSlotIndex, draggedBlock);
        setPreviewBlock(0);
    }

    draggedBlock = 0;
    draggedSlotIndex = -1;
}

// =================== CHECK CLICK SU BLOCCO OPZIONE ===================
function checkClickOnOptions(mx, my) {
    const slotSize = cellSize * 1.8; // deve essere lo stesso del render
    const margin = 20;
    const isLandscape = canvas.width > canvas.height;

    let startX, startY;

    if (isLandscape) {
        // modalità orizzontale → opzioni a destra
        startX = cells * cellSize + margin;
        startY = (W - (slotSize * 4 + margin * 2)) / 2; // 3 blocchi + slot score

        // 3 slot dei blocchi
        for (let i = 0; i < 3; i++) {
            const x = startX;
            const y = startY + i * (slotSize + margin);
            if (mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize) {
                return i;
            }
        }

        // slot punteggio (non selezionabile)
        const yScore = startY + 3 * (slotSize + margin);
        const xScore = startX;
        if (mx >= xScore && mx <= xScore + slotSize && my >= yScore && my <= yScore + slotSize) {
            console.log("Click sullo slot punteggio");
            return -1;
        }

    } else {
        // modalità verticale → opzioni in basso
        startX = (W - (slotSize * 4 + margin * 3)) / 2;
        startY = cells * cellSize + margin;

        // 3 slot dei blocchi
        for (let i = 0; i < 3; i++) {
            const x = startX + i * (slotSize + margin);
            const y = startY;
            if (mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize) {
                return i;
            }
        }

        // slot punteggio (non selezionabile)
        const xScore = startX + 3 * (slotSize + margin);
        const yScore = startY;
        if (mx >= xScore && mx <= xScore + slotSize && my >= yScore && my <= yScore + slotSize) {
            console.log("Click sullo slot punteggio");
            return -1;
        }
    }

    return -1;
}

