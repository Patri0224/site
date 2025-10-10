import { EMPTY, SAND, WATER, GAS, WOOD, FIRE, WALL, DSTR, SURG, FISH, ROCK, LAVA, LEAF, STEEL, matColor, materials,maxBrush } from '../core/constants.js';
import { pressure } from '../core/grid.js';
import { setWaterPhisic } from '../core/materials/water.js';
import { setBrushSize, getBrushSize } from './input.js';
export let currentMaterial = SAND;



export function setupPalette() {
    const container = document.querySelector('#palette');
    container.classList.add('palette');

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
            document.querySelectorAll('.palette button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        container.appendChild(btn);
    });

    // imposta "Sand" attivo di default
    container.querySelector('button').classList.add('active');

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
    window.addEventListener('wheel', (e) => {
        // opzionale: premi Shift per attivare la modifica (per evitare modifiche accidentali)
        //if (!e.shiftKey) return;

        e.preventDefault(); // evita lo scroll pagina

        const delta = Math.sign(e.deltaY);
        let newSize = getBrushSize() - delta; // su → aumenta, giù → diminuisci
        newSize = Math.min(maxBrush, Math.max(1, newSize));

        setBrushSize(newSize);
        slider.value = newSize;             // sincronizza lo slider
        valueDisplay.textContent = newSize; // aggiorna testo
    });

    sizeContainer.append(label, slider, valueDisplay);
    container.appendChild(sizeContainer);

    // --- controllo water fisic ---
    const checkboxContainer = document.createElement('div');
    sizeContainer.classList.add('check-controls');

    const label1 = document.createElement('label');
    label1.textContent = 'Water ';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true; // opzionale, inizialmente attivo
    label1.appendChild(checkbox);
    checkbox.addEventListener('change', () => {
        setWaterPhisic(checkbox.checked);
        pressure.fill(0);
    });


    checkboxContainer.append(label1);
    container.appendChild(checkboxContainer);
}

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}