// input.js
import { margin } from "../main.js";
import { SHAPES } from "./blocks.js";
import { cells, cellSize, board, idx, doesFit, insertBlock } from "./grid.js";
import {
    setPreviewBlock,
    getPreviewBlock,
    getAvailableBlocks,
    setAvailbleBlocks,
    setColorPreviewBlock,
    getColorAvailableBlocks
} from "./render.js";

// =================== MOUSE TRACKING ===================
export let mouseX = 0;
export let mouseY = 0;
export let dragging = false;
let draggedBlock = 0;
let draggedSlotIndex = -1;

const canvas = document.getElementById('canvas');

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return; // solo tasto sinistro

    // Controlla se cliccato su uno slot di blocco
    const slotIndex = checkClickOnOptions(mouseX, mouseY);
    if (slotIndex >= 0) {
        // start dragging
        dragging = true;
        draggedBlock = getAvailableBlocks(slotIndex);
        draggedSlotIndex = slotIndex;
        setPreviewBlock(draggedBlock);
        setColorPreviewBlock(getColorAvailableBlocks(slotIndex));
        setAvailbleBlocks(slotIndex, 0); // slot vuoto temporaneamente
        return;
    }

    // se non cliccato su slot e c'è un blocco in preview, prova a piazzarlo direttamente
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);
    const pb = getPreviewBlock();
    if (pb !== 0 && doesFit(pb, gx, gy)) {
        insertBlock(pb, gx, gy);
        setPreviewBlock(0);
    }
});

canvas.addEventListener("mouseup", e => {
    if (e.button !== 0) return;
    if (!dragging) return;

    dragging = false;

    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);

    if (doesFit(draggedBlock, gx, gy)) {
        insertBlock(draggedBlock, gx, gy);
        // qui puoi chiamare blockInserted() e controlAvailable()
        setPreviewBlock(0);
    } else {
        // ripristina nello slot da cui è stato preso
        setAvailbleBlocks(draggedSlotIndex, draggedBlock);
        setPreviewBlock(0);
    }

    draggedBlock = 0;
    draggedSlotIndex = -1;
});

// =================== CHECK CLICK SU BLOCCO OPZIONE ===================
function checkClickOnOptions(mx, my) {
    const slotSize = cellSize * 2.5;
    const gap = 20;
    const isLandscape = canvas.width > canvas.height;

    let startX, startY;

    if (isLandscape) {
        startX = cells * cellSize + gap;
        startY = (canvas.height - (slotSize * 4 + gap * 3)) / 2;

        for (let i = 0; i < 3; i++) {
            const x = startX;
            const y = startY + i * (slotSize + gap);
            if (mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize) return i;
        }

        // slot punteggio (solo log)
        const yScore = startY + 3 * (slotSize + gap);
        const xScore = startX;
        if (mx >= xScore && mx <= xScore + slotSize && my >= yScore && my <= yScore + slotSize) {
            console.log("Click sullo slot punteggio");
            return -1;
        }

    } else {
        startX = (canvas.width - (slotSize * 4 + gap * 3)) / 2;
        startY = cells * cellSize + gap;

        for (let i = 0; i < 3; i++) {
            const x = startX + i * (slotSize + gap);
            const y = startY;
            if (mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize) return i;
        }

        const xScore = startX + 3 * (slotSize + gap);
        const yScore = startY;
        if (mx >= xScore && mx <= xScore + slotSize && my >= yScore && my <= yScore + slotSize) {
            console.log("Click sullo slot punteggio");
            return -1;
        }
    }

    return -1;
}
