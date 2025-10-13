import { W, H, idx, mat, moved, pressure } from './grid.js';
import { SAND, WATER, FIRE, WOOD, GAS, DSTR, SURG, FISH, LAVA, ROCK, STEEL } from './constants.js';
import { calcPressure, updateWater, balanceLiquids, equilibrateWater, updateWaterNoPressure, getWaterPhisic } from './materials/water.js';
import { updateSand } from './materials/sand.js';
import { updateFire } from './materials/fire.js';
import { updateGas } from './materials/gas.js';
import { updateWood } from './materials/wood.js';
import { updateDstr } from './materials/dstr.js';
import { updateSurg } from './materials/surg.js';
import { updateFish } from './materials/fish.js';
import { updateLava } from './materials/lava.js';
import { updateRock } from './materials/rock.js';
import { updateSteel } from './materials/steel.js';

export function step() {
    const _W = W;
    const _H = H;
    const _mat = mat;
    const _moved = moved;
    const _pressure = pressure;
    const waterPhisic = getWaterPhisic();

    _moved.fill(0);
    if (waterPhisic) {
        _pressure.fill(0);
        calcPressure();
        balanceLiquids();
    }

    for (let y = _H - 1; y >= 0; y--) {
        if (y & 1) {
            for (let x = _W - 1; x >= 0; x--) {
                const i = y * _W + x;
                const t = _mat[i];
                if (!t) continue; // skip EMPTY

                switch (t) {
                    case WATER:
                        if (waterPhisic) updateWater(x, y);
                        else updateWaterNoPressure(x, y);
                        break;
                    case ROCK: updateRock(x, y); break;
                    case LAVA: updateLava(x, y); break;
                    case SAND: updateSand(x, y); break;
                    case STEEL: updateSteel(x, y); break;
                    case WOOD: updateWood(x, y); break;
                    case GAS: updateGas(x, y); break;
                    case DSTR: updateDstr(x, y); break;
                    case SURG: updateSurg(x, y); break;
                    case FISH: updateFish(x, y); break;
                    case FIRE: updateFire(x, y); break;
                }
            }
        } else {
            for (let x = 0; x < _W; x++) {
                const i = y * _W + x;
                const t = _mat[i];
                if (!t) continue;
                switch (t) {
                    case WATER:
                        if (waterPhisic) updateWater(x, y);
                        else updateWaterNoPressure(x, y);
                        break;
                    case ROCK: updateRock(x, y); break;
                    case LAVA: updateLava(x, y); break;
                    case SAND: updateSand(x, y); break;
                    case STEEL: updateSteel(x, y); break;
                    case WOOD: updateWood(x, y); break;
                    case GAS: updateGas(x, y); break;
                    case DSTR: updateDstr(x, y); break;
                    case SURG: updateSurg(x, y); break;
                    case FISH: updateFish(x, y); break;
                    case FIRE: updateFire(x, y); break;
                }
            }
        }
    }

    if (waterPhisic) equilibrateWater();
}
