import { EMPTY, SAND, WATER, GAS, WOOD, FIRE, WALL, DSTR, SURG, FISH, ROCK, LAVA, LEAF, STEEL, matColor, materials, maxBrush } from '../core/constants.js';
import { pressure } from '../core/grid.js';
import { setWaterPhisic } from '../core/materials/water.js';
import { setBrushSize, getBrushSize } from './input.js';
export let currentMaterial = SAND;
export function openClosePalette() {
    const container = document.querySelector('#palette');
    const content = container.querySelector('.palette-content');
    const toggleBtn = document.querySelector('.palette-toggle');

    if (!content || !toggleBtn) return;

    const isHidden = content.classList.toggle('hidden');

}
export function setupPalette() {
    const container = document.querySelector('#palette');
    container.classList.add('palette');

    // --- pulsante per chiudere/aprire ---
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'palette-toggle';
    toggleBtn.textContent = "☰ Palette materiali"; // menu icon
    document.body.appendChild(toggleBtn);

    let paletteVisible = true;

    toggleBtn.addEventListener('click', () => {
        paletteVisible = !paletteVisible;
        container.classList.toggle('hidden', !paletteVisible);
    });


    // --- contenuto palette in un wrapper per nascondere facilmente ---
    const content = document.createElement('div');
    content.classList.add('palette-content');
    container.appendChild(content);

    // --- palette materiali ---
    materials.forEach(mat => {
        const btn = document.createElement('button');
        const bg = matColor[mat.id] || '#777';
        btn.style.backgroundColor = bg;
        const rgb = hexToRgb(bg);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        btn.style.color = brightness > 128 ? '#000' : '#fff';
        btn.textContent = mat.name;
        btn.onclick = () => {
            currentMaterial = mat.id;
            content.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Chiude la palette dopo la selezione
            paletteVisible = !paletteVisible;
            container.classList.toggle('hidden', !paletteVisible);
        };
        content.appendChild(btn);
    });

    // imposta "Sand" attivo di default
    content.querySelector('button').classList.add('active');

    // --- controlli brush size ---
    const sizeContainer = document.createElement('div');
    sizeContainer.classList.add('brush-controls');

    const label = document.createElement('label');
    label.textContent = 'Brush size: ';

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = getBrushSize();

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = maxBrush + 1;
    slider.value = getBrushSize();
    slider.oninput = () => {
        setBrushSize(parseInt(slider.value));
        valueDisplay.textContent = getBrushSize();
    };

    // --- supporto rotellina del mouse ---
    let scrollActive = false;

    const palette = document.querySelector('#palette');
    const canvas = document.querySelector('canvas');
    palette.addEventListener('mouseenter', () => scrollActive = true);
    palette.addEventListener('mouseleave', () => scrollActive = false);
    canvas.addEventListener('mouseenter', () => scrollActive = true);
    canvas.addEventListener('mouseleave', () => scrollActive = false);

    window.addEventListener('wheel', (e) => {
        if (!scrollActive) return;
        e.preventDefault();

        const delta = Math.sign(e.deltaY);
        let newSize = getBrushSize() - delta;
        newSize = Math.min(maxBrush, Math.max(1, newSize));

        setBrushSize(newSize);
        slider.value = newSize;
        valueDisplay.textContent = newSize;
    }, { passive: false });

    sizeContainer.append(label, slider, valueDisplay);
    content.appendChild(sizeContainer);

    // --- controllo water fisic ---
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('check-controls');

    const label1 = document.createElement('label');
    label1.textContent = 'Water ';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    label1.appendChild(checkbox);
    checkbox.addEventListener('change', () => {
        setWaterPhisic(checkbox.checked);
        pressure.fill(0);
    });

    checkboxContainer.append(label1);
    content.appendChild(checkboxContainer);

    // --- logica toggle ---
    toggleBtn.addEventListener('click', () => {
        const isHidden = content.classList.toggle('hidden');
    });
}

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
