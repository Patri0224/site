// ===========================
// MAPPA BASE 15x10
// ===========================
function createBaseMap(grid) {
    // prima inizializzi tutte le celle come 'empty'
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            grid.setType(col, row, "empty");
        }
    }

    // -------------------------
    // definisci percorso nemici (path)
    // -------------------------
    const pathCells = [
        { col: 0, row: 5 },
        { col: 1, row: 5 },
        { col: 2, row: 5 },
        { col: 3, row: 5 },
        { col: 3, row: 6 },
        { col: 3, row: 7 },
        { col: 3, row: 8 },
        { col: 4, row: 8 },
        { col: 5, row: 8 },
        { col: 5, row: 7 },
        { col: 5, row: 6 },
        { col: 5, row: 5 },
        { col: 6, row: 5 },
        { col: 7, row: 5 },
        { col: 8, row: 5 },
        { col: 9, row: 5 },
        { col: 10, row: 5 },
        { col: 11, row: 5 },
        { col: 12, row: 5 },
        { col: 13, row: 5 },
        { col: 14, row: 5 }
    ];

    pathCells.forEach(cell => {
        grid.setType(cell.col, cell.row, "path");
    });

    // -------------------------
    // definisci basi per torri
    // -------------------------
    const baseCells = [
        { col: 2, row: 3 },
        { col: 4, row: 3 },
        { col: 6, row: 3 },
        { col: 8, row: 3 },
        { col: 10, row: 3 },
        { col: 2, row: 7 },
        { col: 4, row: 7 },
        { col: 6, row: 7 },
        { col: 8, row: 7 },
        { col: 10, row: 7 }
    ];

    baseCells.forEach(cell => {
        grid.setType(cell.col, cell.row, "base");
    });

    // -------------------------
    // altre celle possono rimanere 'empty' o 'blocked'
    // -------------------------
}
function generatePathFromTiles(grid, startCell, endCell) {
    const rows = grid.rows;
    const cols = grid.cols;

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));

    const queue = [];
    queue.push(startCell);
    visited[startCell.row][startCell.col] = true;

    const directions = [
        { dr: -1, dc: 0 }, // su
        { dr: 1, dc: 0 },  // giù
        { dr: 0, dc: -1 }, // sinistra
        { dr: 0, dc: 1 }   // destra
    ];

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.col === endCell.col && current.row === endCell.row) break;

        for (let dir of directions) {
            const newRow = current.row + dir.dr;
            const newCol = current.col + dir.dc;

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited[newRow][newCol]
            ) {
                const tile = grid.getCell(newCol, newRow);
                if (tile && tile.type === "path") {
                    visited[newRow][newCol] = true;
                    parent[newRow][newCol] = current;
                    queue.push({ col: newCol, row: newRow });
                }
            }
        }
    }

    // ricostruisci percorso
    const path = [];
    let current = endCell;
    while (current) {
        const tile = grid.getCell(current.col, current.row);
        path.unshift({
            x: current.col * grid.cellSize + grid.cellSize / 2,
            y: current.row * grid.cellSize + grid.cellSize / 2
        });
        current = parent[current.row][current.col];
    }

    // se il percorso non parte da startCell, non esiste
    if (path.length === 0 || path[0].x !== startCell.col * grid.cellSize + grid.cellSize / 2) {
        return null;
    }

    return path;
}

