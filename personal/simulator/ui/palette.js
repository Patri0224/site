import { EMPTY, SAND, WATER, GAS, WOOD, FIRE, WALL, DSTR, SURG } from '../core/constants.js';
import { setBrushSize, getBrushSize } from './input.js';
export let currentMaterial = SAND;

const materials = [
    { name: 'Canc', id: EMPTY },
    { name: 'Sand', id: SAND },
    { name: 'Water', id: WATER },
    { name: 'Gas', id: GAS },
    { name: 'Wood', id: WOOD },
    { name: 'Fire', id: FIRE },
    { name: 'Wall', id: WALL },
    { name: 'Destr', id: DSTR },
    { name: 'Sorg', id: SURG },

];

export function setupPalette() {
    const container = document.querySelector('#palette');
    container.classList.add('palette');

    // --- palette materiali ---
    materials.forEach(mat => {
        const btn = document.createElement('button');
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

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 1;
    slider.max = 20;
    slider.value = getBrushSize();
    slider.oninput = () => {
        setBrushSize(parseInt(slider.value));
        valueDisplay.textContent = getBrushSize();
    };

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = getBrushSize();

    sizeContainer.append(label, slider, valueDisplay);
    container.appendChild(sizeContainer);
}

