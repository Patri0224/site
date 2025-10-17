// input.js
import { margin } from "../main.js";
import { SHAPES } from "./blocks.js";
import { cells, cellSize, doesFit, insertBlock } from "./grid.js";
import {
    setPreviewBlock,
    getPreviewBlock,
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

    const slotIndex = checkClickOnOptions(mouseX, mouseY);
    if (slotIndex >= 0) {
        // Inizio trascinamento da uno slot
        dragging = true;
        draggedBlock = getAvailableBlocks(slotIndex);
        draggedSlotIndex = slotIndex;
        setPreviewBlock(draggedBlock);
        setColorPreviewBlock(getColorAvailableBlocks(slotIndex));
        setAvailbleBlocks(slotIndex, 0); // slot temporaneamente vuoto
        return;
    }

    // Se cliccato sulla griglia e c’è un blocco selezionato
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);
    const pb = getPreviewBlock();
    if (pb !== 0 && doesFit(pb, gx, gy)) {
        insertBlock(pb, gx, gy);
        setPreviewBlock(0);
    }
}

function handlePointerUp(clientX, clientY) {
    updatePointer(clientX, clientY);
    if (!dragging) return;

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
    } else {
        startX = (canvas.width - (slotSize * 4 + gap * 3)) / 2;
        startY = cells * cellSize + gap;

        for (let i = 0; i < 3; i++) {
            const x = startX + i * (slotSize + gap);
            const y = startY;
            if (mx >= x && mx <= x + slotSize && my >= y && my <= y + slotSize) return i;
        }
    }

    return -1;
}
