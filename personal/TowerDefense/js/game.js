const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ======================
// INIZIALIZZAZIONE GRID
// ======================
let grid = new Grid(15, 10, 40); // 15 colonne, 10 righe, celle 40px

// ======================
// ARRAY GIOCO
// ======================
let towers = [];
let enemies = [];
let projectiles = [];
let money = 200;
let lives = 10;



let difficulty = 1;
// ======================
// PERCORSO NEMICI (semplice esempio)
// ======================
let path = generateMap(grid, difficulty);
let waveSystem = new WaveSystem(generateWaves(difficulty));

// ======================
// ONDATA INIZIALE
// ======================
let lastTime = 0;
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
    const towerX = col * grid.cellSize + grid.cellSize / 2;
    const towerY = row * grid.cellSize + grid.cellSize / 2;
    const tower = new selectedTowerType(towerX, towerY, { targetingMode: "first" })
    if (money < tower.price) {
      return;
    } else {
      money -= tower.price;
    }
    tile.setType("blocked"); // torre piazzata
    towers.push(tower);
  }
});


// ======================
// LOOP PRINCIPALE
// ======================
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1️⃣ disegna griglia e tiles
  grid.draw(ctx);

  // 2️⃣ aggiorna e disegna nemici
  // update wave system
  waveSystem.update(deltaTime, enemies, path);

  // update e draw nemici
  for (let e of enemies) {
    e.update();
    e.draw(ctx);
  }
  console.log(enemies);
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
  enemies = enemies.filter(e => e.alive || e.pathIndex < path.length - 1);
  // 5️⃣ disegna UI (soldi, vite, ecc.)
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Money: $${money}`, 10, 20);
  ctx.fillText(`Lives: ${lives}`, 10, 50);
  requestAnimationFrame(gameLoop);
}

// ======================
// AVVIO GAME LOOP
// ======================
requestAnimationFrame(gameLoop);

