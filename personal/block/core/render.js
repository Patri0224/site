import { margin } from "../main.js";
import { colors, SHAPES } from "./blocks.js";
import { board, cells, cellSize, doesFit, idx, initGrid, W } from "./grid.js";
import { mouseX, mouseY } from "./input.js";
import { bestScore, score } from "./logic.js";


// buffer per la griglia (W x H)
let availableBlocks = [0, 0, 0]; // indice dei 3 blocchi scelti
let previewBlock = 0;  // blocco selezionato (indice in SHAPES)
let colorCells = [];
let colorAvailableBlocks = [colors[2], colors[3], colors[4]];
let colorpreviewBlock = colors[2];
export function setColorCells(pos, val) { colorCells[pos] = val; }
export function getPreviewBlock() { return previewBlock; }
export function getAvailableBlocks(pos) { return availableBlocks[pos]; }
export function setPreviewBlock(val) { previewBlock = val; }
export function setAvailbleBlocks(pos, val) { availableBlocks[pos] = val; }
export function getColorPreviewBlock() { return colorpreviewBlock; }
export function getColorAvailableBlocks(pos) { return colorAvailableBlocks[pos]; }
export function setColorPreviewBlock(val) { colorpreviewBlock = val; }
export function setColorAvailableBlocks(pos, val) { colorAvailableBlocks[pos] = val; }

export function render(ctx) {
    renderGrid(ctx);
    renderOption(ctx);
    renderPiecePreview(ctx);
}
// =============== GRID PRINCIPALE ===============
function renderGrid(ctx) {
    const bg = hexaToRGB(colors[0]);
    const gridC = hexaToRGB(colors[1]);
    const ma2 = margin / 2;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},${bg.a})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const i = idx(x, y);
            const val = board[i];
            const px = x * cellSize;
            const py = y * cellSize;

            if (val === 1) {
                const c1 = hexaToRGB(colorCells[i]);
                drawCell(ctx, px + ma2, py + ma2, cellSize, c1);
            }

            ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},${gridC.a})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(px + ma2, py + ma2, cellSize, cellSize);
        }
    }
}

// Funzione helper per “abbellire” le singole celle
function drawCell(ctx, x, y, size, color) {
    // piccola riduzione per il bordo
    x++;
    y++;
    size = size - 2;

    // calcolo colori chiari e scuri
    const baseColor = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    const lightColor = `rgba(${Math.min(color.r + 40, 255)},${Math.min(color.g + 40, 255)},${Math.min(color.b + 40, 255)},${color.a})`;
    const darkColor = `rgba(${Math.max(color.r - 40, 0)},${Math.max(color.g - 40, 0)},${Math.max(color.b - 40, 0)},${color.a})`;

    // triangolo chiaro (angoli 00,01,10)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.closePath();
    ctx.fillStyle = lightColor;
    ctx.fill();

    // triangolo scuro (angoli 01,10,11)
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fillStyle = darkColor;
    ctx.fill();

    // linee sottili nere
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    // linea diagonale 00 → 11
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.stroke();
    // linea diagonale 10 → 01
    ctx.beginPath();
    ctx.moveTo(x, y + size);
    ctx.lineTo(x + size, y);
    ctx.stroke();

    // quadratino centrale
    const centerSize = size * 0.75;
    const cx = x + (size - centerSize) / 2;
    const cy = y + (size - centerSize) / 2;
    ctx.fillStyle = baseColor;
    ctx.fillRect(cx, cy, centerSize, centerSize);
}


// =============== OPZIONI BLOCCO (adattiva) ===============
function renderOption(ctx) {
    const slotSize = cellSize * 2; // dimensione di ogni slot
    const margin = 20;
    const isLandscape = ctx.canvas.width > ctx.canvas.height;

    let startX, startY;

    if (isLandscape) {
        // schermo orizzontale → griglia a sinistra, opzioni a destra
        startX = cells * cellSize + margin;
        startY = (W - (slotSize * 4 + margin * 3)) / 2; // 3 blocchi + slot score
        for (let i = 0; i < 3; i++) {
            const y = startY + i * (slotSize + margin);
            const x = startX;
            const color = hexaToRGB(colorAvailableBlocks[i]);
            drawOptionSlot(ctx, x, y, slotSize, availableBlocks[i], color);
        }

        // quarto slot: punteggio
        const yScore = startY + 3 * (slotSize + margin);
        drawScoreSlot(ctx, startX, yScore, slotSize);

    } else {
        // schermo verticale → griglia sopra, opzioni sotto
        startX = (W - (slotSize * 4 + margin * 3)) / 2; // 3 blocchi + slot score
        startY = cells * cellSize + margin;
        for (let i = 0; i < 3; i++) {
            const x = startX + i * (slotSize + margin);
            const y = startY;
            const color = hexaToRGB(colorAvailableBlocks[i]);
            drawOptionSlot(ctx, x, y, slotSize, availableBlocks[i], color);
        }

        // quarto slot: punteggio
        const xScore = startX + 3 * (slotSize + margin);
        drawScoreSlot(ctx, xScore, startY, slotSize);
    }
}

// Funzione helper per disegnare lo “slot punteggio”
function drawScoreSlot(ctx, x, y, size) {
    // sfondo
    ctx.fillStyle = "rgba(50,50,50,0.4)";
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    // testo punteggio
    ctx.fillStyle = "#ffffff";
    ctx.font = `${size / 8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(`Score`, x + size / 2, y + size / 3);
    ctx.fillText(`${score}`, x + size / 2, y + size / 2);

    ctx.fillText(`Best`, x + size / 2, y + size * 0.7);
    ctx.fillText(`${bestScore}`, x + size / 2, y + size * 0.85);
}


// funzione helper per disegnare un singolo slot
function drawOptionSlot(ctx, x, y, slotSize, blockId, color) {
    // contorno slot
    ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, slotSize, slotSize);

    // disegna blocco se presente
    if (blockId != null && SHAPES[blockId]) {
        drawBlock(ctx, SHAPES[blockId], x + slotSize / 2, y + slotSize / 2, cellSize * 0.4, color);
    }
}

// =============== PREVIEW BLOCCO (segue il mouse) ===============
function renderPiecePreview(ctx) {
    if (previewBlock === 0) return;
    const ma2 = margin / 2;
    const shape = SHAPES[previewBlock];
    const color = hexaToRGB(colorpreviewBlock);
    let size = cellSize * 1.1;

    // Calcola le coordinate della cella sotto il mouse
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);

    // Controlla se il blocco può entrare in quella posizione
    const canPlace = doesFit(previewBlock, gx, gy);
    if (canPlace) {
        size = cellSize;
        // Offset per centrare il blocco sulla cella
        const offsetX = gx * cellSize;
        const offsetY = gy * cellSize;

        for (const [dx, dy] of shape) {
            const x = offsetX + dx * size + ma2;
            const y = offsetY + dy * size + ma2;
            drawCell(ctx, x, y, size, color)
        }
    } else {
        for (const [dx, dy] of shape) {
            const x = dx * size - (size / 2) + mouseX;
            const y = dy * size - (size / 2) + mouseY;
            drawCell(ctx, x, y, size, color)
        }
    }
}

// =============== UTILITY PER DISEGNARE UN BLOCCO ===============
function drawBlock(ctx, shape, cx, cy, size, color) {
    // Calcola offset come prima
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [dx, dy] of shape) {
        if (dx < minX) minX = dx;
        if (dx > maxX) maxX = dx;
        if (dy < minY) minY = dy;
        if (dy > maxY) maxY = dy;
    }
    const width = (maxX - minX + 1) * size;
    const height = (maxY - minY + 1) * size;
    const offsetX = cx - width / 2 - minX * size;
    const offsetY = cy - height / 2 - minY * size;

    for (const [dx, dy] of shape) {
        const x = offsetX + dx * size;
        const y = offsetY + dy * size;
        drawCell(ctx, x, y, size, color)
    }
}




// =============== HEXA TO RGBA ===============
export function hexaToRGB(hexa) {
    hexa = hexa.replace('#', '');
    let r, g, b, a = 1;

    if (hexa.length === 8) {
        r = parseInt(hexa.substring(0, 2), 16);
        g = parseInt(hexa.substring(2, 4), 16);
        b = parseInt(hexa.substring(4, 6), 16);
        a = parseInt(hexa.substring(6, 8), 16) / 255;
    } else if (hexa.length === 6) {
        r = parseInt(hexa.substring(0, 2), 16);
        g = parseInt(hexa.substring(2, 4), 16);
        b = parseInt(hexa.substring(4, 6), 16);
    } else {
        throw new Error("Formato colore non valido: " + hexa);
    }

    return { r, g, b, a };
}