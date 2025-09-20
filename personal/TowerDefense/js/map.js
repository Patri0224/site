function generateRandomPath(grid, difficulty) {
    const cols = grid.cols;
    const rows = grid.rows;

    let start = { col: 0, row: Math.floor(rows / 2) };
    let end = { col: cols - 1, row: Math.floor(rows / 2) };

    let path = [start];
    let current = { ...start };

    const maxTurns = Math.floor(3 + difficulty * 2); // più difficile → più curve
    const segmentLength = Math.floor(cols / (2 + difficulty)); // più difficile → più segmenti corti

    let turns = 0;
    while (turns < maxTurns && current.col < end.col) {
        let dir = Math.random() < 0.5 ? "right" : "updown";
        let steps = Math.floor(segmentLength * (0.8 + Math.random() * 0.4));

        if (dir === "right") {
            for (let i = 0; i < steps && current.col < cols - 1; i++) {
                current.col++;
                path.push({ ...current });
            }
        } else {
            let verticalDir = Math.random() < 0.5 ? -1 : 1;
            for (let i = 0; i < steps; i++) {
                if (current.row + verticalDir >= 0 && current.row + verticalDir < rows) {
                    current.row += verticalDir;
                    path.push({ ...current });
                }
            }
        }
        turns++;
    }

    // collega al punto finale
    while (current.col < end.col) {
        current.col++;
        path.push({ ...current });
    }

    return path;
}
function generateWaves(difficulty) {
    let waves = [];
    let baseCount = Math.floor(5 + difficulty * 3);
    let enemyTypes = [BaseEnemy];

    if (difficulty > 2) enemyTypes.push(FastEnemy);
    if (difficulty > 4) enemyTypes.push(TankEnemy);
    if (difficulty > 6) enemyTypes.push(BossEnemy);

    for (let i = 0; i < 5; i++) {
        let count = baseCount + i * Math.floor(1 + difficulty);
        let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        waves.push(
            new Wave({
                enemyType: type,
                count: count,
                delay: Math.max(200, 1000 - difficulty * 50)
            })
        );
    }
    return waves;
}

function generateMap(grid, difficulty) {
    // genera percorso
    let path = generateRandomPath(grid, difficulty);
    path.forEach(p => {
        let tile = grid.getCell(p.col, p.row);
        if (tile) tile.setType("path");
    });


    return path;
}
