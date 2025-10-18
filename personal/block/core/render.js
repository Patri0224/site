import { colors, SHAPES, cells } from "./blocks.js";
import { board, doesFit, idx, W } from "./grid.js";
import { mouseX, mouseY } from "./input.js";
import { bestScore, clearingAnimations, score } from "./logic.js";

// ==================== BUFFERS ====================
export let availableBlocks = [0, 0, 0]; // indice dei 3 blocchi scelti
export let previewBlock = 0;            // blocco selezionato (indice in SHAPES)
export let colorCells = [];
export let colorAvailableBlocks = [colors[3], colors[4], colors[5]];
export let colorpreviewBlock = colors[3];
// ==================== GETTER / SETTER ====================
export function setColorCells(pos, val) { colorCells[pos] = val; }
export function getPreviewBlock() { return previewBlock; }
export function getAvailableBlocks(pos) { return availableBlocks[pos]; }
export function setPreviewBlock(val) { previewBlock = val; }
export function setAvailbleBlocks(pos, val) { availableBlocks[pos] = val; }
export function getColorPreviewBlock() { return colorpreviewBlock; }
export function getColorAvailableBlocks(pos) { return colorAvailableBlocks[pos]; }
export function setColorPreviewBlock(val) { colorpreviewBlock = val; }
export function setColorAvailableBlocks(pos, val) { colorAvailableBlocks[pos] = val; }

// ==================== CACHE COLORI ====================
const bgRGB = hexaToRGB(colors[0]);
const gridCRGB = hexaToRGB(colors[1]);
const gridLRGB = hexaToRGB(colors[2]);

const gradientCache = {};
function getGradient(ctx, color, alpha) {
    const key = `${color.r},${color.g},${color.b}`;
    if (!gradientCache[key]) {
        const csize = cellSize * 0.625;
        const gradient = ctx.createLinearGradient(0, 0, csize, csize);
        gradient.addColorStop(0, `rgba(${Math.min(color.r + 50, 255)},${Math.min(color.g + 50, 255)},${Math.min(color.b + 50, 255)},${alpha})`);
        gradient.addColorStop(1, `rgba(${color.r},${color.g},${color.b},${alpha})`);
        gradientCache[key] = gradient;
    }
    return gradientCache[key];
}
// ==================== PRECOMPILA CELLE ====================

const precompiledCells = {};
const precompiledCellsOption = {};

export function precompileCells(ctx, size = cellSize) {
    for (const colorHex of colors.slice(3, 7)) { // scegli tu quanti
        const color = hexaToRGB(colorHex);

        // Crea un canvas temporaneo per la cella
        const off = document.createElement('canvas');
        off.width = size;
        off.height = size;
        const offCtx = off.getContext('2d');

        // Disegna la cella come nel drawCell originale
        drawCell(offCtx, 0, 0, size, color);

        // Crea un ImageBitmap (più veloce di <canvas>)
        createImageBitmap(off).then(img => {
            precompiledCells[colorHex] = img;
        });
    }
    for (const colorHex of colors.slice(3, 7)) { // scegli tu quanti
        const color = hexaToRGB(colorHex);

        // Crea un canvas temporaneo per la cella
        const off = document.createElement('canvas');
        off.width = size * 0.3;
        off.height = size * 0.3;
        const offCtx = off.getContext('2d');

        // Disegna la cella come nel drawCell originale
        drawCell(offCtx, 0, 0, size * 0.3, color);

        // Crea un ImageBitmap (più veloce di <canvas>)
        createImageBitmap(off).then(img => {
            precompiledCellsOption[colorHex] = img;
        });
    }
}

// ==================== PRECOMPUTE POSITIONS ====================
let ma2 = 0;
let margin = 0;
let cellSize = 10;
let cellPositions = Array.from({ length: cells }, (_, i) => i * cellSize + ma2);
export function setMa2(val) {
    margin = val;
    ma2 = val / 2;
    cellPositions = Array.from({ length: cells }, (_, i) => i * cellSize + ma2);
}
export function setCellSize(val) {
    cellSize = val;
    cellPositions = Array.from({ length: cells }, (_, i) => i * cellSize + ma2);
}
let lastTime = performance.now();
let saturation = 1;

// ==================== MAIN RENDER ====================
export function render(ctx) {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    renderGrid(ctx, delta);
    renderOption(ctx);
    renderPiecePreview(ctx);
}

// ==================== GRID ====================
function renderGrid(ctx, delta) {
    // sfondo canvas
    const lighterBg = `rgba(${Math.min(bgRGB.r + 15, 255)}, ${Math.min(bgRGB.g + 15, 255)}, ${Math.min(bgRGB.b + 15, 255)},1)`;
    ctx.fillStyle = lighterBg;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // sfondo griglia
    ctx.fillStyle = `rgba(${bgRGB.r},${bgRGB.g},${bgRGB.b},${bgRGB.a})`;
    ctx.fillRect(ma2, ma2, cells * cellSize, cells * cellSize);

    // celle
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const i = idx(x, y);
            if (board[i] === 1) {
                const colorHex = colorCells[i];
                const img = precompiledCells[colorHex];
                if (img) {
                    ctx.drawImage(img, cellPositions[x], cellPositions[y], cellSize, cellSize);
                } else {
                    // fallback finché l'immagine non è pronta
                    const c = hexaToRGB(colorHex);
                    drawCell(ctx, cellPositions[x], cellPositions[y], cellSize, c);
                }

            }
        }
    }

    // linee griglia
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(${gridCRGB.r},${gridCRGB.g},${gridCRGB.b},${gridCRGB.a * 1.2})`;
    for (let y = 0; y <= cells; y++) {
        const py = cellPositions[y] || cells * cellSize + ma2;
        ctx.beginPath();
        ctx.moveTo(ma2, py);
        ctx.lineTo(cells * cellSize + ma2, py);
        ctx.stroke();
    }
    for (let x = 0; x <= cells; x++) {
        const px = cellPositions[x] || cells * cellSize + ma2;
        ctx.beginPath();
        ctx.moveTo(px, ma2);
        ctx.lineTo(px, cells * cellSize + ma2);
        ctx.stroke();
    }

    // bordi esterni
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${gridLRGB.r * 0.6},${gridLRGB.g * 0.6},${gridLRGB.b * 0.6},1)`;
    ctx.strokeRect(ma2, ma2, cells * cellSize, cells * cellSize);
    for (const anim of clearingAnimations) {
        let fade = 1 - anim.progress;
        let colore = hexaToRGB(anim.color);
        colore.a = fade;
        drawCell(ctx, anim.x * cellSize + ma2, anim.y * cellSize + ma2, cellSize, colore);
        ctx.globalAlpha = 1;
    }
    // Rimuovi gli elementi completati
    for (let i = clearingAnimations.length - 1; i >= 0; i--) {
        const anim = clearingAnimations[i];
        anim.progress += delta * 2;
        if (anim.progress >= 1) clearingAnimations.splice(i, 1);
    }

}

// ==================== DESATURA / RISATURA ====================
export function desaturate() {
    const step = () => { saturation = Math.max(0, saturation - 0.02); if (saturation > 0) requestAnimationFrame(step); };
    requestAnimationFrame(step);
}
export function risaturate() {
    const step = () => { saturation = Math.min(1, saturation + 0.02); if (saturation < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
}

// ==================== DRAW CELL ====================
function drawCell(ctx, x, y, size, color) {
    x++; y++; size -= 2;
    const { r, g, b, a } = color;
    const gray = (r + g + b) / 3;
    const rS = r * saturation + gray * (1 - saturation);
    const gS = g * saturation + gray * (1 - saturation);
    const bS = b * saturation + gray * (1 - saturation);

    const baseColor = `rgba(${rS},${gS},${bS},${a})`;
    const lightColor = `rgba(${Math.min(rS + 40, 255)},${Math.min(gS + 40, 255)},${Math.min(bS + 40, 255)},${a})`;
    const darkColor = `rgba(${Math.max(rS - 40, 0)},${Math.max(gS - 40, 0)},${Math.max(bS - 40, 0)},${a})`;

    // triangoli
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.closePath();
    ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 3; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
    ctx.fillStyle = lightColor; ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.beginPath();
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size); ctx.lineTo(x + size, y + size); ctx.closePath();
    ctx.fillStyle = darkColor; ctx.fill();

    // linee diagonali
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
    ctx.stroke();

    // quadrato centrale
    const csize = size * 0.625;
    const cx = x + (size - csize) / 2;
    const cy = y + (size - csize) / 2;
    const gradient = getGradient(ctx, { r: rS, g: gS, b: bS }, a);
    // Applica fade dell'animazione
    ctx.globalAlpha = a;  // 'a' qui è il fade del clearingAnimation
    ctx.fillStyle = gradient;
    ctx.fillRect(cx, cy, csize, csize);
    ctx.strokeStyle = `rgba(${Math.max(rS - 50, 0)},${Math.max(gS - 50, 0)},${Math.max(bS - 50, 0)},${a})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx, cy, csize, csize);

    // dettagli angoli
    const dotSize = size * 0.08;
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(x + size * 0.2, y + size * 0.2, dotSize, dotSize);
    ctx.fillRect(x + size * 0.75, y + size * 0.75, dotSize, dotSize);
}

// ==================== OPZIONI BLOCCO ====================
function renderOption(ctx) {
    const slotSize = cellSize * 1.8;
    const margin = 20;
    const isLandscape = ctx.canvas.width > ctx.canvas.height;
    let startX, startY;

    if (isLandscape) {
        startX = cells * cellSize + margin;
        startY = (W - (slotSize * 4 + margin * 2)) / 2;
        for (let i = 0; i < 3; i++) {
            const y = startY + i * (slotSize + margin);
            const x = startX;
            drawOptionSlot(ctx, x, y, slotSize, availableBlocks[i], colorAvailableBlocks[i]);
        }
        drawScoreSlot(ctx, startX, startY + 3 * (slotSize + margin), slotSize);
    } else {
        startX = (W - (slotSize * 4 + margin * 3)) / 2;
        startY = cells * cellSize + margin;
        for (let i = 0; i < 3; i++) {
            const x = startX + i * (slotSize + margin);
            const y = startY;
            drawOptionSlot(ctx, x, y, slotSize, availableBlocks[i], colorAvailableBlocks[i]);
        }
        drawScoreSlot(ctx, startX + 3 * (slotSize + margin), startY, slotSize);
    }
}

function drawScoreSlot(ctx, x, y, size) {
    ctx.fillStyle = "rgba(50,50,50,0.4)"; ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, size, size);
    ctx.fillStyle = "#fff"; ctx.font = `${size / 8}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Score", x + size / 2, y + size * 0.22);
    ctx.fillText(`${score}`, x + size / 2, y + size * 0.37);
    ctx.fillText("Best", x + size / 2, y + size * 0.63);
    ctx.fillText(`${bestScore}`, x + size / 2, y + size * 0.78);
}

function drawOptionSlot(ctx, x, y, slotSize, blockId, color) {
    let colord = hexaToRGB(color);
    ctx.strokeStyle = `rgba(${colord.r},${colord.g},${colord.b},0.6)`;
    ctx.lineWidth = 2; ctx.strokeRect(x, y, slotSize, slotSize);
    if (blockId != null && SHAPES[blockId]) drawBlock(ctx, SHAPES[blockId], x + slotSize / 2, y + slotSize / 2, cellSize * 0.3, color);
}

// ==================== PREVIEW BLOCCO ====================
function renderPiecePreview(ctx) {
    if (!previewBlock) return;
    const shape = SHAPES[previewBlock];
    const color = hexaToRGB(colorpreviewBlock);
    const size = cellSize;

    const gx = Math.floor((mouseX - margin) / cellSize);
    const gy = Math.floor((mouseY - margin) / cellSize);
    const canPlace = doesFit(previewBlock, gx, gy);
    const gridX = gx * cellSize;
    const gridY = gy * cellSize;
    const offsetX = canPlace ? gridX : mouseX - size / 2;
    const offsetY = canPlace ? gridY : mouseY - size / 2;

    for (const [dx, dy] of shape) {
        const img = precompiledCells[colorpreviewBlock];
        if (img) {
            ctx.drawImage(img, offsetX + dx * size, offsetY + dy * size, size, size);
        } else {
            drawCell(ctx, offsetX + dx * size, offsetY + dy * size, size, color);
        }
    }
}

// ==================== DRAW BLOCK ====================
function drawBlock(ctx, shape, cx, cy, size, color) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [dx, dy] of shape) {
        if (dx < minX) minX = dx; if (dx > maxX) maxX = dx;
        if (dy < minY) minY = dy; if (dy > maxY) maxY = dy;
    }
    const width = (maxX - minX + 1) * size;
    const height = (maxY - minY + 1) * size;
    const offsetX = cx - width / 2 - minX * size;
    const offsetY = cy - height / 2 - minY * size;
    for (const [dx, dy] of shape) {
        const img = precompiledCellsOption[color];
        if (img) {
            ctx.drawImage(img, offsetX + dx * size, offsetY + dy * size, size, size);
        } else {
            drawCell(ctx, offsetX + dx * size, offsetY + dy * size, size, hexaToRGB(color));
        }
    }
}

// ==================== HEXA TO RGBA ====================
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
    } else throw new Error("Formato colore non valido: " + hexa);
    return { r, g, b, a };
}
