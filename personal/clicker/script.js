// -------------------- Setup --------------------
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameState = 'menu'; // 'menu', 'playing', 'gameover'
let points = 0;         // punti guadagnati dai nemici

function resize() {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
}
window.addEventListener('resize', resize);
resize();
//-------------------- Game State --------------------
const buttons = [];

function createButton(x, y, width, height, text, onClick) {
    buttons.push({ x, y, width, height, text, onClick });
}
function setupMenuButtons() {
    buttons.length = 0; // svuota eventuali vecchi bottoni

    // Start game
    createButton(canvas.width / 2 - 100, 200, 300, 50, 'Start Game', () => {
        gameState = 'playing';
    });

    // Upgrade max lives
    createButton(canvas.width / 2 - 100, 280, 300, 50, 'Increase Max Lives (5 pts)', () => {
        if (points >= 5 + UpgradeCost) {
            player.lives++;
            points -= 5 + UpgradeCost;
            livesUpgraded++;
            UpgradeCost += 3;
            this.text = `Increase Max Lives (${5 + UpgradeCost} pts)`;
        }
    });

    // Upgrade speed
    createButton(canvas.width / 2 - 100, 360, 300, 50, 'Increase Speed (5 pts)', () => {
        if (points >= 5 + UpgradeCost * 1.1) {
            player.speed += 1;
            points -= 5 + UpgradeCost;
            speedUpgraded++;
            UpgradeCost += 3;
            this.text = `Increase Speed (${5 + UpgradeCost * 1.1} pts)`;

        }
    });
    createButton(canvas.width / 2 - 100, 440, 300, 50, 'Increase Difficulty (10 pts)', () => {
        if (points >= 10 + UpgradeCost) {
            player.speed += 1;
            points -= 10 + UpgradeCost;
            difficultyUpgraded++;
            this.text = `Increase Difficulty (${10 + UpgradeCost} pts)`;
        }
    });

}

let UpgradeCost = 5;
let livesUpgraded = 0;
let speedUpgraded = 0;
let difficultyUpgraded = 0;
// -------------------- Input --------------------

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (gameState === 'menu') {
        // Controllo click su start
        buttons.forEach(btn => {
            if (
                mouseX >= btn.x && mouseX <= btn.x + btn.width &&
                mouseY >= btn.y && mouseY <= btn.y + btn.height
            ) {
                btn.onClick();
            }
        });
    } else if (gameState === 'playing') {
        const dx = mouseX - (player.x + player.size / 2);
        const dy = mouseY - (player.y + player.size / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            player.dx = (dx / dist) * player.speed;
            player.dy = (dy / dist) * player.speed;
        }

        enemies.forEach(enemy => {
            const dx = enemy.x - mouseX;
            const dy = enemy.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < enemy.r + 10 - 10 / (1 + difficultyUpgraded)) {
                points += enemy.lives + (difficultyUpgraded / 5); // punti guadagnati in base alle vite
                enemy.lives--;
            }
        });
    }
});
// -------------------- Player --------------------
const player = {
    x: 200,
    y: 200,
    dx: 0,        // velocità corrente X
    dy: 0,        // velocità corrente Y
    size: 25,
    lives: 3,
    color: '#00b3ff',
    speed: 5
};




function movePlayer() {
    // rallentamento più lento
    player.dx *= 0.995;
    player.dy *= 0.995;

    // muovi player
    player.x += player.dx;
    player.y += player.dy;

    // Ferma il player se la velocità è molto piccola
    if (Math.abs(player.dx) + Math.abs(player.dy) < 0.01) {
        player.dx = 0;
        player.dy = 0;
    }

    // Rimbalzo sui bordi
    if (player.x < 0) {
        player.x = 0;
        player.dx *= -1; // inverti direzione X
    }
    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
        player.dx *= -1;
    }
    if (player.y < 0) {
        player.y = 0;
        player.dy *= -1; // inverti direzione Y
    }
    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
        player.dy *= -1;
    }
}


// -------------------- Enemies --------------------
let enemies = [];
let bullets = [];
let spawnTimer = 0;
let spawnDelay = 300; // frames between spawns (~5 seconds at 60fps)
let time = 0;

function spawnEnemy() {
    const margin = 80;
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { x = Math.random() * canvas.width; y = -margin; }
    if (side === 1) { x = canvas.width + margin; y = Math.random() * canvas.height; }
    if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + margin; }
    if (side === 3) { x = -margin; y = Math.random() * canvas.height; }

    enemies.push({
        x, y,
        r: 20,
        color: 'crimson',
        speed: 1.3 + difficultyUpgraded / 5 + Math.min(time / 1800, 1.5), // speed up slowly
        lives: 1 + difficultyUpgraded / 5 + Math.floor(time / 600),
        shootCooldown: Math.random() * 200 + 80
    });
}


// -------------------- Bullets --------------------
function spawnBullet(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    bullets.push({
        x: from.x,
        y: from.y,
        vx: (dx / dist) * 4.5,
        vy: (dy / dist) * 4.5,
        r: 5,
        color: 'yellow'
    });
}

// -------------------- Update --------------------
function update() {
    time++;
    movePlayer();

    // --- Spawn enemies over time ---
    spawnTimer++;
    if (spawnTimer > spawnDelay) {
        spawnEnemy();
        spawnTimer = 0;

        // slowly decrease delay to make game harder
        if (spawnDelay > 100) spawnDelay -= 10;
    }

    // --- Enemies move toward player ---
    // --- Enemies move toward player ---
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const ex = player.x + player.size / 2 - enemy.x;
        const ey = player.y + player.size / 2 - enemy.y;
        const dist = Math.sqrt(ex * ex + ey * ey);

        enemy.x += (ex / dist) * enemy.speed;
        enemy.y += (ey / dist) * enemy.speed;

        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
            spawnBullet(enemy, { x: player.x + player.size / 2, y: player.y + player.size / 2 });
            enemy.shootCooldown = 150 + Math.random() * 150;
        }

        if (dist < enemy.r + player.size / 2) {
            player.lives--;
            enemies.splice(i, 1);
            continue;
        }

        if (enemy.lives <= 0) enemies.splice(i, 1);
    }


    // --- Move bullets - Collision: bullets hitting player ---
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -20 || b.x > canvas.width + 20 || b.y < -20 || b.y > canvas.height + 20) {
            bullets.splice(i, 1);
            continue;
        }

        const cx = player.x + player.size / 2;
        const cy = player.y + player.size / 2;
        const dx = b.x - cx;
        const dy = b.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < b.r + player.size / 2) {
            player.lives--;
            bullets.splice(i, 1);
            if (player.lives <= 0) {
                resetGame();
                return;
            }
        }
    }

}
// -------------------- Draw --------------------
function drawButtons() {
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    buttons.forEach(btn => {
        // rettangolo
        ctx.fillStyle = '#00b3ff';
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

        // testo
        ctx.fillStyle = 'white';
        ctx.fillText(btn.text, btn.x + btn.width / 2, btn.y + btn.height / 2);
    });
}


// -------------------- Menu --------------------
function drawMenu() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2D Survival Game', canvas.width / 2, 100);

    ctx.font = '25px Arial';
    ctx.fillText('Points: ' + points, canvas.width / 2, 160);

    drawButtons(); // disegna tutti i bottoni creati
}


// -------------------- Game --------------------
function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // enemies
    for (let e of enemies) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.fill();
        // draw lives
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(e.lives, e.x, e.y - 4);
    }

    // bullets
    for (let b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
    }

    // UI
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';  // 👈 Add this line

    const padding = 10;
    ctx.fillText('Enemies: ' + enemies.length, padding, padding);
    ctx.fillText('Lives: ' + player.lives, padding, padding + 25);
    ctx.fillText('Spawn delay: ' + spawnDelay.toFixed(0), padding, padding + 50);
    ctx.fillText('Time: ' + (time / 60).toFixed(1) + 's', padding, padding + 75);
    ctx.fillText('Points: ' + points, padding, padding + 100);


}

// -------------------- Reset --------------------
let gameOver = false;

function resetGame() {
    gameOver = true;
    gameState = 'menu';
    setupMenuButtons();
    setTimeout(() => {
        enemies = [];
        bullets = [];
        player.x = 200;
        player.y = 200;
        player.goalX = 200;
        player.goalY = 200;
        player.lives = 3;
        spawnDelay = 300;
        time = 0;
        gameOver = false;
    }, 1500);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}


// -------------------- Loop --------------------
function loop() {
    if (gameState === 'menu') {
        drawMenu();
        if (gameOver) drawGameOver();
    } else if (gameState === 'playing') {
        update();
        draw();
    }
    requestAnimationFrame(loop);
}
setupMenuButtons();
// spawn initial enemies
for (let i = 0; i < 2; i++) spawnEnemy();
loop();
