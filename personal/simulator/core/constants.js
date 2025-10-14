export const EMPTY = 0;
export const SAND = 1;
export const WATER = 2;
export const WALL = 3;
export const WOOD = 4;
export const FIRE = 5;
export const GAS = 6;
export const DSTR = 7;
export const SURG = 8;
export const FISH = 9;
export const ROCK = 10;
export const LAVA = 11;
export const LEAF = 12;
export const STEEL = 13;


export const cellSize = 4;
export const maxBrush = 40;
export const NUM_WORKERS = 4;
export const liquidCap = 4;
export const leafDistance = 20;
export const woodDistance = 30;
export const materials = [
    { name: 'Canc', id: EMPTY },
    { name: 'Wall', id: WALL },
    { name: 'Sand', id: SAND },
    { name: 'Rock', id: ROCK },
    { name: 'Lava', id: LAVA },
    { name: 'Water', id: WATER },
    { name: 'Wood', id: WOOD },
    { name: 'Leaf', id: LEAF },
    { name: 'Steel', id: STEEL },
    { name: 'Gas', id: GAS },
    { name: 'Fish', id: FISH },
    { name: 'Fire', id: FIRE },
    { name: 'Sorg', id: SURG },
    { name: 'Destr', id: DSTR },

];

export const matColor = {
    [EMPTY]: '#000814',
    [SAND]: '#d6b370',
    [WATER]: '#5fb7ff',
    [WALL]: '#666666',
    [WOOD]: '#7a4f28',
    [FIRE]: '#ff6b00',
    [GAS]: '#c9f0ff',
    [DSTR]: '#600000',
    [SURG]: '#00366c',
    [FISH]: '#e724c3',
    [ROCK]: '#7e7e7e',
    [LAVA]: '#ff8000',
    [LEAF]: '#2aaa00',
    [STEEL]: '#514a44'


};
export const matColor1 = {
    [EMPTY]: '#000814',
    [SAND]: '#d7bb72',
    [WATER]: '#6ebefe',
    [WALL]: '#666666',
    [WOOD]: '#89582a',
    [FIRE]: '#ff8000',
    [GAS]: '#c9f0ff',
    [DSTR]: '#600000',
    [SURG]: '#034180',
    [FISH]: '#ea28a0',
    [ROCK]: '#878787',
    [LAVA]: '#ff8800',
    [LEAF]: '#2fba00',
    [STEEL]: '#4a4c4d',

};
export const matColor2 = {
    [EMPTY]: '#000814',
    [SAND]: '#d3a856',
    [WATER]: '#55b2ff',
    [WALL]: '#666666',
    [WOOD]: '#714924',
    [FIRE]: '#ff5100',
    [GAS]: '#c9f0ff',
    [DSTR]: '#600000',
    [SURG]: '#002c58',
    [FISH]: '#ba1cce',
    [ROCK]: '#747474',
    [LAVA]: '#ff7300',
    [LEAF]: '#2a8c00',
    [STEEL]: '#4b5354'


};
