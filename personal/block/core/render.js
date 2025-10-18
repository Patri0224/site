import { margin } from "../main.js";
import { colors, SHAPES } from "./blocks.js";
import { board, cells, cellSize, doesFit, idx, initGrid, W } from "./grid.js";
import { dragging, mouseX, mouseY } from "./input.js";
import { bestScore, clearingAnimations, score } from "./logic.js";


// buffer per la griglia (W x H)
export let availableBlocks = [0, 0, 0]; // indice dei 3 blocchi scelti
export let previewBlock = 0;  // blocco selezionato (indice in SHAPES)
export let colorCells = [];
export let colorAvailableBlocks = [colors[3], colors[4], colors[5]];
export let colorpreviewBlock = colors[3];
let lastTime = performance.now();
export function setColorCells(pos, val) { colorCells[pos] = val; }
export function getPreviewBlock() { return previewBlock; }
export function getAvailableBlocks(pos) { return availableBlocks[pos]; }
export function setPreviewBlock(val) {
    // if (dragging) return;
    previewBlock = val; console.log("Preview block:", previewBlock, "Dragging:", dragging);
}
export function setAvailbleBlocks(pos, val) { availableBlocks[pos] = val; }
export function getColorPreviewBlock() { return colorpreviewBlock; }
export function getColorAvailableBlocks(pos) { return colorAvailableBlocks[pos]; }
export function setColorPreviewBlock(val) { colorpreviewBlock = val; }
export function setColorAvailableBlocks(pos, val) { colorAvailableBlocks[pos] = val; }

export function render(ctx) {
    const now = performance.now();
    const delta = (now - lastTime) / 1000; // secondi
    lastTime = now;
    renderGrid(ctx, delta);
    renderOption(ctx);
    renderPiecePreview(ctx);
}
// =============== GRID PRINCIPALE ===============
function renderGrid(ctx, delta) {
    const bg = hexaToRGB(colors[0]);         // colore di sfondo griglia
    const gridC = hexaToRGB(colors[1]);      // colore linee griglia
    const gridL = hexaToRGB(colors[2]);      // colore linee griglia
    const ma2 = margin / 2;

    // === SFONDO CANVAS PIÙ CHIARO DELLA GRIGLIA ===
    const lighterBg = `rgba(${Math.min(bg.r + 15, 255)}, ${Math.min(bg.g + 15, 255)}, ${Math.min(bg.b + 15, 255)}, 1)`;
    ctx.fillStyle = lighterBg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // === SFONDO GRIGLIA ===
    ctx.fillStyle = `rgba(${bg.r},${bg.g},${bg.b},${bg.a})`;
    ctx.fillRect(ma2, ma2, cells * cellSize, cells * cellSize);

    // === DISEGNA CELLE ===
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const i = idx(x, y);
            const val = board[i];
            const px = x * cellSize + ma2;
            const py = y * cellSize + ma2;

            if (val === 1) {
                const c1 = hexaToRGB(colorCells[i]);
                drawCell(ctx, px, py, cellSize, c1);
            }
        }
    }

    // === LINEE DELLA GRIGLIA ===
    ctx.lineWidth = 1.2; // un po’ più visibile
    ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},${gridC.a * 1.2})`; // leggermente più marcata

    for (let y = 0; y <= cells; y++) {
        const py = y * cellSize + ma2;
        ctx.beginPath();
        ctx.moveTo(ma2, py);
        ctx.lineTo(cells * cellSize + ma2, py);
        ctx.stroke();
    }

    for (let x = 0; x <= cells; x++) {
        const px = x * cellSize + ma2;
        ctx.beginPath();
        ctx.moveTo(px, ma2);
        ctx.lineTo(px, cells * cellSize + ma2);
        ctx.stroke();
    }

    // === BORDI ESTERNI PIÙ EVIDENTI ===
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${gridL.r * 0.6}, ${gridL.g * 0.6}, ${gridL.b * 0.6}, 1)`;
    ctx.strokeRect(ma2, ma2, cells * cellSize, cells * cellSize);

    // === ANIMAZIONI DI DISSOLVENZA CELLE ===
    for (const anim of clearingAnimations) {
        let fade = 1 - anim.progress;
        let colore = hexaToRGB(anim.color);
        colore.a = fade;
        drawCell(ctx, anim.x * cellSize + ma2, anim.y * cellSize + ma2, cellSize, colore, fade);
    }

    for (let i = clearingAnimations.length - 1; i >= 0; i--) {
        const anim = clearingAnimations[i];
        anim.progress += delta * 2; // velocità dissolvenza
        if (anim.progress >= 1) {
            clearingAnimations.splice(i, 1);
        }
    }
}

let saturation = 1;
export function desaturate() {
    const step = () => {
        saturation = Math.max(0, saturation - 0.02);
        if (saturation > 0) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

export function risaturate() {
    const step = () => {
        saturation = Math.min(1, saturation + 0.02);
        if (saturation < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// Funzione helper per “abbellire” le singole celle
function drawCell(ctx, x, y, size, color) {
    x++;
    y++;
    size -= 2;

    // Applica desaturazione
    const { r, g, b } = color;
    const gray = (r + g + b) / 3;
    const rS = r * saturation + gray * (1 - saturation);
    const gS = g * saturation + gray * (1 - saturation);
    const bS = b * saturation + gray * (1 - saturation);

    // Colori chiaro/scuro e base
    const baseColor = `rgba(${rS},${gS},${bS},${color.a})`;
    const lightColor = `rgba(${Math.min(rS + 40, 255)},${Math.min(gS + 40, 255)},${Math.min(bS + 40, 255)},${color.a})`;
    const darkColor = `rgba(${Math.max(rS - 40, 0)},${Math.max(gS - 40, 0)},${Math.max(bS - 40, 0)},${color.a})`;

    // Triangolo chiaro (00,01,10)
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.closePath();
    ctx.fillStyle = lightColor;
    ctx.fill();

    // Triangolo scuro (01,10,11)
    ctx.beginPath();
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fillStyle = darkColor;
    ctx.fill();

    // Linee diagonali
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();

    // Quadrato centrale
    const csize = size * 0.625;
    const cx = x + (size - csize) / 2;
    const cy = y + (size - csize) / 2;
    ctx.fillStyle = baseColor;
    ctx.fillRect(cx, cy, csize, csize);
}



// =============== OPZIONI BLOCCO (adattiva) ===============
function renderOption(ctx) {
    const slotSize = cellSize * 1.8; // dimensione di ogni slot
    const margin = 20;
    const isLandscape = ctx.canvas.width > ctx.canvas.height;

    let startX, startY;

    if (isLandscape) {
        // schermo orizzontale → griglia a sinistra, opzioni a destra
        startX = cells * cellSize + margin;
        startY = (W - (slotSize * 4 + margin * 2)) / 2; // 3 blocchi + slot score
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

    ctx.fillText(`Score`, x + size / 2, y + size * 0.22);
    ctx.fillText(`${score}`, x + size / 2, y + size * 0.37);

    ctx.fillText(`Best`, x + size / 2, y + size * 0.63);
    ctx.fillText(`${bestScore}`, x + size / 2, y + size * 0.78);
}


// funzione helper per disegnare un singolo slot
function drawOptionSlot(ctx, x, y, slotSize, blockId, color) {
    // contorno slot
    ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},0.6)`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, slotSize, slotSize);

    // disegna blocco se presente
    if (blockId != null && SHAPES[blockId]) {
        drawBlock(ctx, SHAPES[blockId], x + slotSize / 2, y + slotSize / 2, cellSize * 0.3, color);
    }
}

// =============== PREVIEW BLOCCO (segue il mouse) ===============
function renderPiecePreview(ctx) {
    if (previewBlock === 0) return;
    const ma2 = margin / 2;
    const shape = SHAPES[previewBlock];
    const color = hexaToRGB(colorpreviewBlock);
    let size = cellSize;

    // Calcola la cella attualmente sotto il mouse
    const gx = Math.floor((mouseX - margin) / cellSize);
    const gy = Math.floor((mouseY - margin) / cellSize);

    const canPlace = doesFit(previewBlock, gx, gy);

    // Offset per posizionamento (centrato sulla cella in griglia)
    const gridX = gx * cellSize;
    const gridY = gy * cellSize;

    if (canPlace) {
        // Mostra snapping sulla cella
        for (const [dx, dy] of shape) {
            const x = gridX + dx * size;
            const y = gridY + dy * size;
            drawCell(ctx, x, y, size, color);
        }
    } else {
        // Mostra il blocco seguendo il mouse (ma centrato)
        const offsetX = mouseX - size / 2;
        const offsetY = mouseY - size / 2;
        for (const [dx, dy] of shape) {
            const x = offsetX + dx * size;
            const y = offsetY + dy * size;
            drawCell(ctx, x, y, size, color);
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