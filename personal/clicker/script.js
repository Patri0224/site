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
    createButton(canvas.width / 2 - 100, 200, 200, 50, 'Start Game', () => {
        gameState = 'playing';
    });

    // Upgrade max lives
    createButton(canvas.width / 2 - 140, 280, 280, 50, '', () => {
        if (points >= 5 + UpgradeCost) {
            player.lives++;
            points -= 5 + UpgradeCost;
            livesUpgraded++;
            UpgradeCost += 3;
        }
    });

    // Upgrade speed
    createButton(canvas.width / 2 - 140, 360, 280, 50, '', () => {
        if (points >= 5 + UpgradeCost * 1.1) {
            player.speed++;
            points -= 5 + UpgradeCost * 1.1;
            points = Math.floor(points);
            speedUpgraded++;
            UpgradeCost += 3;
        }
    });

    // Upgrade damage
    createButton(canvas.width / 2 - 140, 440, 280, 50, '', () => {
        if (points >= 10 + UpgradeCost * 1.5) {
            player.damage++;
            points -= 10 + UpgradeCost * 1.5;            
            points = Math.floor(points);
            damageUpgraded++;
            UpgradeCost += 3;
        }
    });

    // Increase difficulty
    createButton(canvas.width / 2 - 140, 520, 280, 50, '', () => {
        if (points >= 10 + UpgradeCost) {
            points -= 10 + UpgradeCost;
            difficultyUpgraded++;
        }
    });

    // Debug
    createButton(canvas.width / 2 - 100, 600, 200, 50, 'Debug', () => {
        debug = !debug;
    });
}

// Aggiorna il testo dei bottoni dinamicamente
function updateButtonTexts() {
    buttons[1].text = `Max Lives (Level ${livesUpgraded}, Cost ${5 + UpgradeCost})`;
    buttons[2].text = `Speed (Level ${speedUpgraded}, Cost ${Math.floor(5 + UpgradeCost * 1.1)})`;
    buttons[3].text = `Damage (Level ${damageUpgraded}, Cost ${Math.floor(10 + UpgradeCost * 1.5)})`;
    buttons[4].text = `Difficulty (Level ${difficultyUpgraded}, Cost ${10 + UpgradeCost})`;
}

function drawButtons() {
    updateButtonTexts(); // aggiorna testo prima di disegnare

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

let debug = false;
// -------------------- Variables --------------------
let UpgradeCost = 5;
let livesUpgraded = 0;
let speedUpgraded = 0;
let damageUpgraded = 0;
let difficultyUpgraded = 0;
let playerTimeouts = [];
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

        // Cancella eventuali timeout precedenti
        playerTimeouts.forEach(id => clearTimeout(id));
        playerTimeouts = [];

        // Imposta fdx/fdy subito
        const dx = mouseX - player.x;
        const dy = mouseY - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            player.fdx = (dx / dist) * player.speed;
            player.fdy = (dy / dist) * player.speed;
        }

        // Programma aggiornamenti futuri
        [250, 500, 750].forEach(delay => {
            const id = setTimeout(() => {
                const dx2 = mouseX - player.x;
                const dy2 = mouseY - player.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 > 100) {
                    const factor = 0.95; // frazione della velocità
                    player.fdx = (dx2 / dist2) * player.speed * factor;
                    player.fdy = (dy2 / dist2) * player.speed * factor;
                }
            }, delay);
            playerTimeouts.push(id);
        });



        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const dx = enemy.x - mouseX;
            const dy = enemy.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < enemy.r + 10 - 10 / (1 + difficultyUpgraded)) {
                // infligge danno
                enemy.lives--;

                // punti bonus leggeri per colpo
                points += 0.5 + (difficultyUpgraded / 10);

                if (enemy.lives <= 0) {
                    // nemico ucciso

                    spawnExplosion(enemy.x, enemy.y, enemy.color);
                    points += 1 + (difficultyUpgraded / 5);
                    // 💥 Spara proiettili in tutte le direzioni
                    const bulletCount = 3 + difficultyUpgraded;
                    const startAngle = Math.random() * Math.PI * 2; // angolo iniziale casuale
                    for (let j = 0; j < bulletCount; j++) {
                        const angle = startAngle + (Math.PI * 2 * j) / bulletCount;
                        bullets.push({
                            x: enemy.x,
                            y: enemy.y,
                            vx: Math.cos(angle) * 3.5,
                            vy: Math.sin(angle) * 3.5,
                            r: 5,
                            color: 'orange'
                        });
                    }

                    enemies.splice(i, 1);
                }
            }
        }

    }
});
//effects
let effects = [];

function spawnExplosion(x, y, color) {
    const count = 10 + Math.random() * 10;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        effects.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 4 + 2,
            alpha: 1,
            color
        });
    }
}

function updateEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const p = effects[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= 0.02;
        if (p.alpha <= 0) effects.splice(i, 1);
    }
}

function drawEffects() {
    for (let p of effects) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,200,0,${p.alpha})`; // giallo/arancio esplosione
        ctx.fill();
    }
}

// -------------------- Player --------------------
const player = {
    x: 200,
    y: 200,
    dx: 0,        // velocità corrente X
    dy: 0,        // velocità corrente Y
    fdx: 0,
    fdy: 0,
    r: 13,   // dimensione del player
    lives: 3 + livesUpgraded, // vite iniziali
    color: '#00b3ff',
    speed: 5 + speedUpgraded, // velocità base
    damage: 1 + damageUpgraded // danno base
};




function movePlayer() {
    // Graduale interpolazione verso la direzione target
    const smoothing = 0.05; // più basso = più lento, più alto = più rapido

    player.fdx *= 0.995;
    player.fdy *= 0.995;

    player.dx += (player.fdx - player.dx) * smoothing;
    player.dy += (player.fdy - player.dy) * smoothing;

    // Aggiorna la posizione
    player.x += player.dx;
    player.y += player.dy;
    if (Math.abs(player.fdx) + Math.abs(player.fdy) < 0.01) {
        player.fdx = 0;
        player.fdy = 0;
    }
    // Ferma il player se è molto vicino alla velocità target (per evitare oscillazioni)
    if (Math.abs(player.dx - player.fdx) < 0.01 && Math.abs(player.dy - player.fdy) < 0.01) {
        player.dx = player.fdx;
        player.dy = player.fdy;
    }

    // Rimbalzo sui bordi
    if (player.x - player.r < 0) {
        player.x = player.r;
        player.dx = -player.dx;
        player.fdx = -player.fdx;
    }
    if (player.x + player.r > canvas.width) {
        player.x = canvas.width - player.r;
        player.dx = -player.dx;
        player.fdx = -player.fdx;
    }
    if (player.y - player.r < 0) {
        player.y = player.r;
        player.dy = -player.dy;
        player.fdy = -player.fdy;
    }
    if (player.y + player.r > canvas.height) {
        player.y = canvas.height - player.r;
        player.dy = -player.dy;
        player.fdy = -player.fdy;
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
        speed: 1.3 + difficultyUpgraded / 5 + Math.min(time / 1800, 1.5),
        lives: 1 + difficultyUpgraded / 5 + Math.floor(time / 600) * 2,
        vx: 0,
        vy: 0,
        shootCooldown: Math.random() * 200 + 80 - difficultyUpgraded * 10 - Math.floor(time / 1200) * 5
    });
}

function updateEnemies() {

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        const ex = player.x - enemy.x;
        const ey = player.y - enemy.y;
        const dist = Math.sqrt(ex * ex + ey * ey);
        let dx = ex / dist;
        let dy = ey / dist;

        // Piccolo rumore direzionale
        dx += (Math.random() - 0.5) * 0.2;
        dy += (Math.random() - 0.5) * 0.2;
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;

        const tooClose = 150;
        const safeDistance = 400;

        let targetVx = 0;
        let targetVy = 0;

        if (dist < tooClose) {
            const fleeFactor = (tooClose - dist) / tooClose;
            targetVx = -dx * enemy.speed * (1 + fleeFactor) * (1 + difficultyUpgraded / 5) / 2;
            targetVy = -dy * enemy.speed * (1 + fleeFactor) * (1 + difficultyUpgraded / 5) / 2;
        } else if (dist > safeDistance) {
            targetVx = dx * enemy.speed * 0.5;
            targetVy = dy * enemy.speed * 0.5;
        } else {
            targetVx = dx * enemy.speed * 0.2;
            targetVy = dy * enemy.speed * 0.2;
        }

        // Movimento fluido: il nemico si avvicina lentamente alla velocità target
        enemy.vx += (targetVx - enemy.vx) * 0.05;
        enemy.vy += (targetVy - enemy.vy) * 0.05;

        // Aggiorna posizione
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        // --- Limiti schermo: se sono entrati, non possono più uscire ---
        if (enemy.x - enemy.r < 0) {
            enemy.x = enemy.r;
            enemy.vx = Math.abs(enemy.vx) * 0.5; // rimbalzo morbido
        }
        if (enemy.x + enemy.r > canvas.width) {
            enemy.x = canvas.width - enemy.r;
            enemy.vx = -Math.abs(enemy.vx) * 0.5;
        }
        if (enemy.y - enemy.r < 0) {
            enemy.y = enemy.r;
            enemy.vy = Math.abs(enemy.vy) * 0.5;
        }
        if (enemy.y + enemy.r > canvas.height) {
            enemy.y = canvas.height - enemy.r;
            enemy.vy = -Math.abs(enemy.vy) * 0.5;
        }

        // --- shooting ---
        enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0) {
            spawnBullet(enemy, { x: player.x, y: player.y });
            enemy.shootCooldown = 150 + Math.random() * 150 - difficultyUpgraded * 10 - Math.floor(time / 1200) * 5;
        }

        // --- collisione con player ---
        if (dist < enemy.r + player.r) {
            enemy.lives -= player.damage;
            let impactSpeed = 2 + Math.random() * 1;
            const nx = ex / dist;
            const ny = ey / dist;

            const overlap = (enemy.r + player.r) - dist;
            player.x += nx * overlap;
            player.y += ny * overlap;

            if (enemy.lives <= 0) {
                spawnExplosion(enemy.x, enemy.y, enemy.color);
                points += 1 + (difficultyUpgraded / 5);
                enemies.splice(i, 1);
                impactSpeed += 1;
            } else {
                player.lives--;
                impactSpeed -= 1;
                if (player.lives <= 0) {
                    resetGame();
                    return;
                }
                enemy.vx *= 1.2;
                enemy.vy *= 1.2;
            }
            player.dx = nx * impactSpeed;
            player.dy = ny * impactSpeed;
        }
    }
}
function drawEnemies() {
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
        if (debug) {
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
            ctx.lineTo(e.x + e.vx * 30, e.y + e.vy * 60);
            ctx.strokeStyle = 'orange'; // colore linea
            ctx.lineWidth = 2;           // spessore
            ctx.stroke();
        }
    }
}
// -------------------- Bullets --------------------
function spawnBullet(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    bullets.push({
        x: from.x,
        y: from.y,
        vx: (dx / dist) * 4.5 + (Math.random() - 0.5) * 1.5 + (difficultyUpgraded / 10),
        vy: (dy / dist) * 4.5 + (Math.random() - 0.5) * 1.5 + (difficultyUpgraded / 10),
        r: 5,
        color: 'yellow'
    });
}
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];

        // Movimento
        b.x += b.vx;
        b.y += b.vy;

        // Attrito: rallenta pian piano
        b.vx *= 0.993; // più basso = rallenta più in fretta
        b.vy *= 0.993;

        // Rimbalzo sui bordi
        if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = -b.vx * 0.9; // perde un po' di velocità
        }
        if (b.x + b.r > canvas.width) {
            b.x = canvas.width - b.r;
            b.vx = -b.vx * 0.9;
        }
        if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = -b.vy * 0.9;
        }
        if (b.y + b.r > canvas.height) {
            b.y = canvas.height - b.r;
            b.vy = -b.vy * 0.9;
        }

        // Se è troppo lento → sparisce
        if (Math.abs(b.vx) + Math.abs(b.vy) < 0.5 - (difficultyUpgraded / 20)) {
            bullets.splice(i, 1);
        }

        // Collisione con il player
        const dx = b.x - player.x;
        const dy = b.y - player.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < b.r + player.r) {
            player.lives--;
            bullets.splice(i, 1);
        }
    }
}
function drawBullets() {
    for (let b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        if (debug) {
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x + b.vx * 10, b.y + b.vy * 10);
            ctx.strokeStyle = 'red'; // colore linea
            ctx.lineWidth = 2;           // spessore
            ctx.stroke();
        }
    }
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

    updateEnemies();

    updateBullets();

    updateEffects();

    if (player.lives <= 0 && !gameOver) {
        resetGame();
        return;
    }
}
// -------------------- Draw --------------------



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
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    if (debug) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + player.fdx * 10, player.y + player.fdy * 10);
        ctx.strokeStyle = 'yellow'; // colore linea
        ctx.lineWidth = 2;           // spessore
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + player.dx * 10, player.y + player.dy * 10);
        ctx.strokeStyle = 'red'; // colore linea
        ctx.lineWidth = 2;           // spessore
        ctx.stroke();

    }

    // enemies
    drawEnemies();

    // bullets
    drawBullets()

    // effects
    drawEffects();

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
