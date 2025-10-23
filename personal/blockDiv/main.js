let state = MENU;
let combo = 0;
let score = 0;
let bestScore = 0;
let grid = [];
let colorGrid = [];
let optionsBlocks = [0, 0, 0];
let colorOptionsBlocks = [];
let selectedOption = -1;
let previewBlock = 0;
let colorPreviewBlock;
let mouseX = 0;
let mouseY = 0;
//listeners 
window.addEventListener("beforeunload", salvaBestScore);
window.addEventListener("load", () => {
    updateLayout();
    if (!caricaBestScore()) {
        console.log("Nessuno stato precedente, avvio nuova simulazione.");
    }
});

window.addEventListener('resize', updateLayout);
document.getElementById('start-button').addEventListener('click', start);
document.getElementById('start-button').addEventListener('touchstart', (e) => {
    e.preventDefault(); // evita doppio evento click + touch
    start();
});
function start() {
    if (state === MENU) {
        MENUSCREEN.style.opacity = '0';
        setTimeout(() => MENUSCREEN.style.display = 'none', 400);
        document.getElementById('game-container').style.display = "flex";
        document.getElementById('best-score-text-game').textContent = "Best: " + bestScore;
        document.getElementById('score-text').textContent = "Score: " + score;
        state = GAME;
        score = 0;
        grid = Array(cells * cells).fill(0);
        colorGrid = Array(cells * cells).fill(null);
        optionsBlocks = [0, 0, 0];
        colorOptionsBlocks = [null, null, null];
        selectedOption = -1;
        previewBlock = 0;
        colorPreviewBlock = null;
        const rect = DIVGRID.getBoundingClientRect();
        mouseX = rect.left + rect.width / 2;
        mouseY = rect.top + rect.height / 2;
        creaGriglia();
        generaOpzioni();
        updateGridDisplay();
        updateOptionsDisplay();
        updatePreviewBlockDisplay();
    }
}
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updatePreviewBlockDisplay();
});
DIVOPTIONS1.addEventListener("mousedown", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    selectOption(1);
});
DIVOPTIONS2.addEventListener("mousedown", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    selectOption(2);
});
DIVOPTIONS3.addEventListener("mousedown", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    selectOption(3);
});
window.addEventListener("mouseup", (e) => {
    //debugger;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (selectedOption !== -1)
        attemptPlaceBlock();
});
window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    updatePreviewBlockDisplay();
}, { passive: true });

DIVOPTIONS1.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    e.preventDefault(); // evita click fantasma
    selectOption(1);
});
DIVOPTIONS2.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    e.preventDefault();
    selectOption(2);
});
DIVOPTIONS3.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    e.preventDefault();
    selectOption(3);
});

window.addEventListener("touchend", (e) => {
    //debugger;
    e.preventDefault();
    if (selectedOption !== -1) attemptPlaceBlock();
});
//listener "q"
window.addEventListener("keydown", (e) => {
    if (e.key === "q" || e.key === "Q") {
        console.log("combo " + combo);
        console.log("score " + score);
        console.log("bestScore " + bestScore);
        console.log("grid " + grid);
        console.log("colorGrid " + colorGrid);
        console.log("optionsBlocks " + optionsBlocks);
        console.log("colorOptionsBlocks " + colorOptionsBlocks);
        console.log("selectedOption " + selectedOption);
        console.log("previewBlock " + previewBlock);
        console.log("colorPreviewBlock " + colorPreviewBlock);
        console.log("mouseX " + mouseX);
        console.log("mouseY " + mouseY);
        console.log("x: " + getGridX(mouseX) + " y: " + getGridY(mouseY));
    }

});

//funzioni di utilità

function idx(x, y) {
    return y * cells + x;
}
function inBounds(x, y) {
    return x >= 0 && x < cells && y >= 0 && y < cells;
}
function doesFit(block, x, y) {
    if (block < MIN || block > MAX) return false;
    for (const [dx, dy] of SHAPES[block]) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inBounds(nx, ny)) return false;
        const cell = grid[idx(nx, ny)];
        if (cell == 1) return false;
    }
    return true;
}
function insertBlock(block, x, y) {
    const color = colorPreviewBlock;
    for (const [dx, dy] of SHAPES[block]) {
        const nx = x + dx;
        const ny = y + dy;
        grid[idx(nx, ny)] = 1;
        colorGrid[idx(nx, ny)] = color;
    }
    optionsBlocks[selectedOption] = 0;
    colorOptionsBlocks[selectedOption] = null;
    selectedOption = -1;
    previewBlock = 0;
    colorPreviewBlock = null;
    updateGridDisplay();
    updateOptionsDisplay();
    updatePreviewBlockDisplay();
    blockInserted(block);
}
function updateGridDisplay() {
    //debugger;
    for (let y = 0; y < cells; y++) {
        for (let x = 0; x < cells; x++) {
            const i = idx(x, y);
            const cell = grid[i];
            const cellDiv = document.getElementById(`cell-${i}`);
            if (cell == 1) {
                cellDiv.style.backgroundColor = colorGrid[i];
                cellDiv.classList.remove('empty');
            } else {
                cellDiv.style.backgroundColor = "#33333300";
                cellDiv.classList.add('empty');
            }
        }
    }
}
function selectOption(optionNumber) {
    selectedOption = optionNumber - 1;
    previewBlock = optionsBlocks[selectedOption];
    colorPreviewBlock = colorOptionsBlocks[selectedOption];
    optionsBlocks[selectedOption] = 0;
    colorOptionsBlocks[selectedOption] = null;
    updateOptionsDisplay();
    updatePreviewBlockDisplay();
}
function deselectOption() {
    if (selectedOption === -1) return;
    optionsBlocks[selectedOption] = previewBlock;
    colorOptionsBlocks[selectedOption] = colorPreviewBlock;
    selectedOption = -1;
    previewBlock = 0;
    colorPreviewBlock = null;
    updateOptionsDisplay();
    updatePreviewBlockDisplay();
}
function attemptPlaceBlock() {
    if (previewBlock === 0 || selectedOption === -1) return;
    if (doesFit(previewBlock, getGridX(mouseX), getGridY(mouseY))) {
        insertBlock(previewBlock, getGridX(mouseX), getGridY(mouseY));
        return;
    }
    deselectOption();
}
function getGridX(screenX) {
    const rect = DIVGRID.getBoundingClientRect();
    const relativeX = screenX - rect.left;
    const cellSize = rect.width / cells;
    return Math.floor(relativeX / cellSize);
}

function getGridY(screenY) {
    const rect = DIVGRID.getBoundingClientRect();
    const relativeY = screenY - rect.top;
    const cellSize = rect.height / cells;
    return Math.floor(relativeY / cellSize);
}

function updatePreviewBlockDisplay() {
    if (previewBlock < MIN || previewBlock > MAX) {
        DIVPREVIEW.style.display = "none";
        return;
    }
    const rect = DIVGRID.getBoundingClientRect();
    DIVPREVIEW.style.display = "grid";
    const shape = SHAPES[previewBlock];
    const minDx = Math.min(...shape.map(([dx]) => dx));
    const maxDx = Math.max(...shape.map(([dx]) => dx));
    const minDy = Math.min(...shape.map(([, dy]) => dy));
    const maxDy = Math.max(...shape.map(([, dy]) => dy));

    const widthCells = maxDx - minDx + 1;
    const heightCells = maxDy - minDy + 1;

    DIVPREVIEW.style.gridTemplateColumns = `repeat(${widthCells}, 1fr)`;
    DIVPREVIEW.style.gridTemplateRows = `repeat(${heightCells}, 1fr)`;
    DIVPREVIEW.innerHTML = '';

    for (let y = minDy; y <= maxDy; y++) {
        for (let x = minDx; x <= maxDx; x++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');

            const isPartOfShape = shape.some(([dx, dy]) => dx === x && dy === y);
            if (isPartOfShape) {
                cellDiv.style.backgroundColor = colorPreviewBlock;
                cellDiv.classList.add('filled');
            } else {
                cellDiv.style.backgroundColor = "transparent";
                cellDiv.classList.add('empty');
            }

            DIVPREVIEW.appendChild(cellDiv);
        }
    }

    const cellSize = rect.width / cells;
    const gridX = getGridX(mouseX);
    const gridY = getGridY(mouseY);

    const widthPx = widthCells * cellSize;
    const heightPx = heightCells * cellSize;
    DIVPREVIEW.style.width = `${widthPx}px`;
    DIVPREVIEW.style.height = `${heightPx}px`;

    let inGrid = true;

    if (!inBounds(gridX, gridY)) inGrid = false;
    if (!doesFit(previewBlock, gridX, gridY)) inGrid = false;

    // 🎯 Allineamento sulla cella in basso a destra
    // 🎯 Allineamento sulla cella in basso a destra (centrato)
    const offsetX = rect.left + (gridX + 1) * cellSize - widthPx;
    const offsetY = rect.top + (gridY + 1) * cellSize - heightPx;


    if (inGrid) {
        DIVPREVIEW.style.left = `${offsetX}px`;
        DIVPREVIEW.style.top = `${offsetY}px`;
        DIVPREVIEW.style.opacity = 0.85;
    } else {
        // segue il mouse, mantenendo l’allineamento in basso a destra
        DIVPREVIEW.style.left = `${mouseX - widthPx + cellSize / 2}px`;
        DIVPREVIEW.style.top = `${mouseY - heightPx + cellSize / 2}px`;
        DIVPREVIEW.style.opacity = 0.4;
    }
}

function salvaBestScore() {
    localStorage.setItem('blockGridBestScore', bestScore.toString());
}
function caricaBestScore() {
    const savedScore = localStorage.getItem('blockGridBestScore');
    if (savedScore !== null) {
        bestScore = parseInt(savedScore, 10);
        return true;
    }
    return false;
}
function creaGriglia() {
    DIVGRID.innerHTML = '';
    DIVGRID.style.gridTemplateColumns = `repeat(${cells}, 1fr)`;
    DIVGRID.style.gridTemplateRows = `repeat(${cells}, 1fr)`;

    for (let i = 0; i < cells * cells; i++) {
        const div = document.createElement('div');
        div.classList.add('cell', 'empty');
        div.id = `cell-${i}`;
        DIVGRID.appendChild(div);
    }
}
function randomBlockByDifficulty(slotIndex) {
    const pool = [];
    if (slotIndex === 0 || slotIndex === 1) {
        for (let i = 1; i <= 10; i++) pool.push(i, i);
        for (let i = 11; i <= 18; i++) if (Math.random() < 0.2) pool.push(i);
        for (let i = 19; i <= 30; i++) if (Math.random() < 0.07) pool.push(i);
    } else {
        for (let i = 1; i <= 18; i++) pool.push(i);
        for (let i = 19; i <= 30; i++) if (Math.random() < 0.5) pool.push(i);
    }
    if (pool.length === 0) return Math.floor(Math.random() * 30) + 1;
    return pool[Math.floor(Math.random() * pool.length)];
}
function generaOpzioni() {
    if (optionsBlocks[0] !== 0 || optionsBlocks[1] !== 0 || optionsBlocks[2] !== 0) {
        updateOptionsDisplay();
        return;
    }
    for (let i = 0; i < 3; i++) {
        const block = randomBlockByDifficulty(i);
        optionsBlocks[i] = block;
        let randomColor = Math.random() * 4 + 3;
        colorOptionsBlocks[i] = colors[Math.floor(randomColor)];
    }
    let diff = 3;
    while (diff > 0) {
        if (!checkAvailableBlocksFit() && score < bestScore) {
            optionsBlocks = [0, 0, 0];
            colorOptionsBlocks = [null, null, null];
            for (let i = 0; i < 3; i++) {
                const block = randomBlockByDifficulty(i);
                optionsBlocks[i] = block;
                let randomColor = Math.random() * 4 + 3;
                colorOptionsBlocks[i] = colors[Math.floor(randomColor)];
            }
        }
        diff--;
    }
    updateOptionsDisplay();
}
function updateOptionsDisplay() {
    const optionDivs = [DIVOPTIONS1, DIVOPTIONS2, DIVOPTIONS3];
    optionDivs.forEach((div, i) => {
        if (optionsBlocks[i] !== 0) {
            div.style.display = "grid";
            const shape = SHAPES[optionsBlocks[i]];
            const minDx = Math.min(...shape.map(([dx]) => dx));
            const maxDx = Math.max(...shape.map(([dx]) => dx));
            const minDy = Math.min(...shape.map(([, dy]) => dy));
            const maxDy = Math.max(...shape.map(([, dy]) => dy));
            const max = Math.max(maxDx - minDx, maxDy - minDy) + 1;

            // Crea una griglia quadrata max × max
            div.style.gridTemplateColumns = `repeat(${max}, 1fr)`;
            div.style.gridTemplateRows = `repeat(${max}, 1fr)`;
            div.innerHTML = '';

            div.style.opacity = "1";
            // Calcola l’offset per centrare la forma dentro il quadrato
            const offsetX = Math.floor((max - (maxDx - minDx + 1)) / 2) - minDx;
            const offsetY = Math.floor((max - (maxDy - minDy + 1)) / 2) - minDy;
            for (let y = 0; y < max; y++) {
                for (let x = 0; x < max; x++) {
                    const cellDiv = document.createElement('div');
                    cellDiv.classList.add('cell');

                    // Confronta coordinate corrette del blocco
                    const gridX = x - offsetX;
                    const gridY = y - offsetY;

                    const isPartOfShape = shape.some(([dx, dy]) => dx === gridX && dy === gridY);
                    if (isPartOfShape) {
                        cellDiv.style.backgroundColor = colorOptionsBlocks[i];
                        cellDiv.classList.remove('empty');
                    } else {
                        cellDiv.style.backgroundColor = "transparent";
                        cellDiv.classList.add('empty');
                    }

                    div.appendChild(cellDiv);
                }
            }
        } else {
            div.style.opacity = "0";
        }
    });
}
function blockInserted(block) {
    //debugger;
    score += SHAPES[block].length;
    if (score > bestScore) {
        bestScore = score;
    }
    generaOpzioni();
    updateOptionsDisplay();



    let clearedRows = [];
    let clearedCols = [];

    for (let row = 0; row < cells; row++) {
        let full = true;
        for (let col = 0; col < cells; col++) {
            if (grid[idx(col, row)] === 0) {
                full = false;
                break;
            }
        }
        if (full) clearedRows.push(row);
    }

    for (let col = 0; col < cells; col++) {
        let full = true;
        for (let row = 0; row < cells; row++) {
            if (grid[idx(col, row)] === 0) {
                full = false;
                break;
            }
        }
        if (full) clearedCols.push(col);
    }

    // 3️⃣ svuota righe e colonne e assegna punti bonus
    const rowBase = 10;
    const colBase = 10;
    if (clearedRows.length + clearedCols.length > 0) {
        // Aggiungi combo proporzionale al numero di righe/colonne eliminate
        combo += (clearedRows.length + clearedCols.length);
    } else {
        // Se non elimini nulla, la combo decresce di molto
        combo = Math.max(0, combo * 0.7);
    }

    // Moltiplicatori di punteggio
    const comboMultiplier = 1 + combo * 0.2; // bonus combo più fluido
    const consecutiveBonus = 1 + combo * 0.1; // bonus per turni consecutivi

    // svuota righe
    clearedRows.forEach(row => {
        for (let col = 0; col < cells; col++) {
            grid[idx(col, row)] = 0;
        }
        score += rowBase * comboMultiplier * consecutiveBonus;
    });

    // svuota colonne
    clearedCols.forEach(col => {
        for (let row = 0; row < cells; row++) {
            grid[idx(col, row)] = 0;
        }
        score += colBase * comboMultiplier * consecutiveBonus;
    });
    // BONUS: griglia completamente vuota
    let isEmpty = true;
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] !== 0) {
            isEmpty = false;
            break;
        }
    }
    if (isEmpty) {
        const emptyBonus = 100; // scegli quanto vuoi dare
        score += emptyBonus;
        console.log("💥 Bonus griglia vuota! +" + emptyBonus + " punti");
    }
    // aggiorna best score
    score = Math.floor(score);
    if (score > bestScore) bestScore = score;
    document.getElementById('score-text').textContent = "Score: " + score;
    document.getElementById('best-score-text-game').textContent = "Best: " + bestScore;
    updateGridDisplay();
    if (!checkAvailableBlocksFit()) {
        desaturateGrid()
        setTimeout(() => {
            if (score > bestScore) {
                bestScore = score;
            }
            risaturateGrid();
            gameOver();
        }, 2200);
    }
}
function updateLayout() {
    const gameContainer = document.getElementById('game-container');
    const optionsWrapper = document.getElementById('options-container');
    const option0 = document.getElementById('option-0');
    if (window.innerWidth > window.innerHeight) {
        gameContainer.style.flexDirection = 'row';
        optionsWrapper.style.flexDirection = 'column';
        optionsWrapper.style.width = '20vmin';
        optionsWrapper.style.height = '90vmin';
        option0.style.fontSize = '1.4rem';
    } else {
        gameContainer.style.flexDirection = 'column';
        optionsWrapper.style.flexDirection = 'row';
        optionsWrapper.style.width = '90vmin';
        optionsWrapper.style.height = '20vmin';
        option0.style.fontSize = '0.8rem';
    }
}
function checkAvailableBlocksFit() {
    let canFit = false;

    for (let i = 0; i < optionsBlocks.length; i++) {
        const block = optionsBlocks[i];
        if (block === 0) continue;
        for (let y = 0; y < cells; y++) {
            for (let x = 0; x < cells; x++) {
                if (doesFit(block, x, y)) {
                    canFit = true;
                    break;
                }
            }
            if (canFit) break;
        }
        if (canFit) break;
    }
    return canFit;

}
function desaturateGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.transition = "filter 2s ease";
        cell.style.filter = "grayscale(100%) brightness(70%)";
    });
}
function risaturateGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.transition = "filter 0.8s ease";
        cell.style.filter = "none";
    });
}
function gameOver() {
    state = MENU;
    MENUSCREEN.style.display = "block";
    DIVPREVIEW.style.display = "fixed";
    MENUSCREEN.style.opacity = '1';
    document.getElementById('game-container').style.display = "none";
    optionsBlocks = [0, 0, 0];
    colorOptionsBlocks = [null, null, null];
    selectedOption = -1;
    previewBlock = 0;
    colorPreviewBlock = null;
    document.getElementById('best-score-text').textContent = "Best Score: " + bestScore;
    salvaBestScore();
}
DIVPREVIEW.style.display = "none";
document.getElementById('game-container').style.display = "none";
caricaBestScore();
document.getElementById('best-score-text').textContent = "Best score: " + bestScore;