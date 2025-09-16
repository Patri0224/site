const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// === CLASSI BASE ===



// ======================
// INIZIALIZZAZIONE GRID
// ======================
let grid = new Grid(15, 10, 40); // 15 colonne, 10 righe, celle 40px
createBaseMap(grid);

// ======================
// ARRAY GIOCO
// ======================
let towers = [];
let enemies = [];
let projectiles = [];

// ======================
// PERCORSO NEMICI (semplice esempio)
// ======================
const startCell = { col: 0, row: 5 };
const endCell = { col: 14, row: 5 };
const path = generatePathFromTiles(grid, startCell, endCell);

// ======================
// ONDATA INIZIALE
// ======================
enemies.push(new Enemy(path));
enemies.push(new FastEnemy(path));
enemies.push(new FastEnemy(path));

// ======================
// CLICK PER PIAZZARE TORRI
// ======================
let selectedTowerType = CannonTower; // torre di default

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const col = Math.floor(mouseX / grid.cellSize);
  const row = Math.floor(mouseY / grid.cellSize);
  const tile = grid.getCell(col, row);

  // prima era: tile.type === "empty"
  if (tile && tile.type === "base") {
    tile.setType("blocked"); // torre piazzata
    const towerX = col * grid.cellSize + grid.cellSize / 2;
    const towerY = row * grid.cellSize + grid.cellSize / 2;
    towers.push(new selectedTowerType(towerX, towerY, { targetingMode: "first" }));
  }
});


// ======================
// LOOP PRINCIPALE
// ======================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1️⃣ disegna griglia e tiles
  grid.draw(ctx);

  // 2️⃣ aggiorna e disegna nemici
  enemies.forEach(e => {
    e.update();
    e.draw(ctx);
  });

  // 3️⃣ aggiorna e disegna torri

  towers.forEach(t => {
    t.update(enemies, projectiles);
  });
  towers.forEach(t => {
    t.drawRange(ctx);
  });
  towers.forEach(t => {
    t.draw(ctx);
  });

  // 4️⃣ aggiorna e disegna proiettili
  projectiles.forEach(p => {
    p.update();
    p.draw(ctx);
  });
  projectiles = projectiles.filter(p => p.alive);

  requestAnimationFrame(gameLoop);
}

// ======================
// AVVIO GAME LOOP
// ======================
gameLoop();
