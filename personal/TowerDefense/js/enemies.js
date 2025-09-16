class Enemy {
    constructor (path, options = {}) {
        this.x = path[0].x;
        this.y = path[0].y;
        this.path = path;
        this.pathIndex = 0;

        // valori base modificabili
        this.speed = options.speed || 1;
        this.maxHp = options.hp || 30;
        this.hp = this.maxHp;
        this.reward = options.reward || 5;

        this.alive = true;
        this.radius = options.radius || 10; // dimensione nemico
        this.color = options.color || "red";
    }

    update() {
        if (!this.alive) return;

        if (this.pathIndex >= this.path.length) {
            // fine percorso
            this.alive = false;
            return;
        }

        const targetPoint = this.path[this.pathIndex];
        const dx = targetPoint.x - this.x;
        const dy = targetPoint.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            // arrivo al punto, passo al prossimo
            this.x = targetPoint.x;
            this.y = targetPoint.y;
            this.pathIndex++;
        } else {
            // muovi verso il punto
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }



    draw(ctx) {
        if (!this.alive) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // barra vita
        ctx.fillStyle = "green";
        ctx.fillRect(
            this.x - this.radius,
            this.y - this.radius - 6,
            (this.hp / this.maxHp) * (this.radius * 2),
            4
        );
    }
}

// === CLASSI SPECIFICHE DI NEMICI ===

class FastEnemy extends Enemy {
    constructor (path) {
        super(path, {
            speed: 2,
            hp: 20,
            reward: 3,
            radius: 8,
            color: "orange"
        });
    }
}

class TankEnemy extends Enemy {
    constructor (path) {
        super(path, {
            speed: 0.6,
            hp: 100,
            reward: 10,
            radius: 14,
            color: "darkgreen"
        });
    }
}

class BossEnemy extends Enemy {
    constructor (path) {
        super(path, {
            speed: 1,
            hp: 300,
            reward: 50,
            radius: 20,
            color: "purple"
        });
    }
}
