import { W, H, idx, mat, moved, pressure } from './grid.js';
import { SAND, WATER, FIRE, WOOD, GAS } from './constants.js';
import { calcPressure, updateWater, balanceLiquids, equilibrateWater } from './materials/water.js';
import { updateSand } from './materials/sand.js';
import { updateFire } from './materials/fire.js';
import { updateGas } from './materials/gas.js';
import { updateWood } from './materials/wood.js';

export function step() {
    moved.fill(0);

    for (let y = H - 1; y >= 0; y--) {
        for (let x = 0; x < W; x++) {
            switch (mat[y * W + x]) {
                case SAND: updateSand(x, y); break;
                //case WATER: updateWater(x, y); break;
                case WOOD: updateWood(x, y); break;
                case FIRE: updateFire(x, y); break;
                case GAS: updateGas(x, y); break;
            }
        }
    }
    pressure.fill(0);
    calcPressure();
    balanceLiquids();
    for (let y = H - 1; y >= 0; y--) {
        if (y % 2)
            for (let x = W - 1; x >= 0; x--) {
                if (mat[y * W + x] === WATER) {
                    updateWater(x, y);
                }
            }
        else
            for (let x = 0; x < W; x++) {
                if (mat[y * W + x] === WATER) {
                    updateWater(x, y);
                }
            }
    }
    equilibrateWater();
}
