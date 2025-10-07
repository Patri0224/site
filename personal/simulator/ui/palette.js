import { SAND, WATER, GAS, WOOD, FIRE, WALL } from '../core/constants.js';

export let currentMaterial = SAND;

const materials = [
    { name: 'Sand', id: SAND },
    { name: 'Water', id: WATER },
    { name: 'Gas', id: GAS },
    { name: 'Wood', id: WOOD },
    { name: 'Fire', id: FIRE },
    { name: 'Wall', id: WALL }
];

export function setupPalette() {
    const container = document.querySelector('#palette');
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
}
