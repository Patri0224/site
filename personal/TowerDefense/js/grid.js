class Grid {
    constructor (cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.cells = [];

        for (let y = 0; y < rows; y++) {
            this.cells[y] = [];
            for (let x = 0; x < cols; x++) {
                this.cells[y][x] = new Tile(
                    x * cellSize,
                    y * cellSize,
                    cellSize
                );
            }
        }
    }

    draw(ctx) {
        for (let row of this.cells) {
            for (let tile of row) {
                tile.draw(ctx);
            }
        }
    }

    getCell(col, row) {
        if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return null;
        return this.cells[row][col];
    }

    setType(col, row, type) {
        let cell = this.getCell(col, row);
        if (cell) cell.setType(type);
    }
}
