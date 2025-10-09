import { W, H, idx, mat, moved, pressure } from './grid.js';
import { SAND, WATER, FIRE, WOOD, GAS, DSTR, SURG, FISH } from './constants.js';
import { calcPressure, updateWater, balanceLiquids, equilibrateWater, updateWaterNoPressure, getWaterPhisic } from './materials/water.js';
import { updateSand } from './materials/sand.js';
import { updateFire } from './materials/fire.js';
import { updateGas } from './materials/gas.js';
import { updateWood } from './materials/wood.js';
import { updateDstr } from './materials/dstr.js';
import { updateSurg } from './materials/surg.js';
import { updateFish } from './materials/fish.js';
export function step() {
    moved.fill(0);

    for (let y = H - 1; y >= 0; y--) {
        if (y % 2)
            for (let x = W - 1; x >= 0; x--) updateBlock(x, y);

        else
            for (let x = 0; x < W; x++) updateBlock(x, y);

    }
    if (getWaterPhisic()) {
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
}
function updateBlock(x, y) {
    switch (mat[y * W + x]) {
        case SAND: updateSand(x, y); break;
        case WATER: if (!getWaterPhisic()) updateWaterNoPressure(x, y); break;
        case WOOD: updateWood(x, y); break;
        case FIRE: updateFire(x, y); break;
        case GAS: updateGas(x, y); break;
        case DSTR: updateDstr(x, y); break;
        case SURG: updateSurg(x, y); break;
        case FISH: updateFish(x, y); break;
    }
}
