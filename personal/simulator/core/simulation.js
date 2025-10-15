import { W, H, idx, mat, moved, pressure } from './grid.js';
import { SAND, WATER, FIRE, WOOD, GAS, DSTR, SURG, FISH, LAVA, ROCK, STEEL, LEAF, IVY } from './constants.js';
import { calcPressure, updateWater, balanceLiquids, equilibrateWater, getWaterPhisic } from './materials/water.js';
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
import { updateLeaf } from './materials/leaf.js';
import { updateIvy } from './materials/ivy.js';
const updateFns = {
    [WATER]: updateWater,
    [ROCK]: updateRock,
    [LAVA]: updateLava,
    [SAND]: updateSand,
    [STEEL]: updateSteel,
    [WOOD]: updateWood,
    [LEAF]: updateLeaf,
    [IVY]: updateIvy,
    [GAS]: updateGas,
    [DSTR]: updateDstr,
    [SURG]: updateSurg,
    [FISH]: updateFish,
    [FIRE]: updateFire
};
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
        const rowOffset = y * _W;
        const reverse = y & 1;

        for (let xi = 0; xi < _W; xi++) {
            const x = reverse ? _W - 1 - xi : xi;
            const i = rowOffset + x;

            const t = _mat[i];
            if (!t || _moved[i]) continue; // skip EMPTY

            const fn = updateFns[t];
            if (fn) fn(x, y);

        }
    }
    if (waterPhisic) equilibrateWater();
}
