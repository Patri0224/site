class Tower {
    constructor (x, y, options = {}) {
        this.x = x;
        this.y = y;

        this.range = options.range || 80;
        this.damage = options.damage || 10;
        this.fireRate = options.fireRate || 60; // frame tra colpi
        this.fireCooldown = 0;

        this.color = options.color || "blue";
        this.size = options.size || 30; // lato quadrato torre

        // strategia di targeting: "first", "last", "strongest", "weakest", "closest"
        this.targetingMode = options.targetingMode || "first";
    }
    findTarget(enemies) {
        // filtra solo i nemici vivi nel raggio
        let inRange = enemies.filter(e => {
            if (!e.alive) return false;
            let dx = e.x - this.x;
            let dy = e.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            return dist <= this.range;
        });

        if (inRange.length === 0) return null;

        switch (this.targetingMode) {
            case "first": // quello con pathIndex più alto → più avanti
                return inRange.reduce((a, b) =>
                    a.pathIndex > b.pathIndex ? a : b
                );
            case "last": // quello con pathIndex più basso → più indietro
                return inRange.reduce((a, b) =>
                    a.pathIndex < b.pathIndex ? a : b
                );
            case "strongest": // più vita
                return inRange.reduce((a, b) =>
                    a.hp > b.hp ? a : b
                );
            case "weakest": // meno vita
                return inRange.reduce((a, b) =>
                    a.hp < b.hp ? a : b
                );
            case "closest": // più vicino alla torre
                return inRange.reduce((a, b) => {
                    let da = Math.hypot(a.x - this.x, a.y - this.y);
                    let db = Math.hypot(b.x - this.x, b.y - this.y);
                    return da < db ? a : b;
                });
            default:
                return inRange[0];
        }
    }
    update(enemies, projectiles) {
        if (this.fireCooldown > 0) {
            this.fireCooldown--;
            return;
        }

        let target = this.findTarget(enemies);
        if (target) {
            projectiles.push(new Projectile(this.x, this.y, target, this.damage));
            this.fireCooldown = this.fireRate;
        }
    }

    drawRange(ctx) {
        ctx.fillStyle = "rgba(100, 201, 255, 0.06)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(134, 100, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

}

// === TORRI SPECIFICHE ===

class CannonTower extends Tower {
    constructor (x, y, targetingMode) {
        super(x, y, {
            range: 100,
            damage: 20,
            fireRate: 90,
            color: "darkgray",
            size: 15,
            targetingMode: targetingMode || "first"
        });
    }
}

class ArcherTower extends Tower {
    constructor (x, y, targetingMode) {
        super(x, y, {
            range: 70,
            damage: 8,
            fireRate: 30,
            color: "brown",
            size: 13,
            targetingMode: targetingMode || "first"
        });
    }
}

class SniperTower extends Tower {
    constructor (x, y, targetingMode) {
        super(x, y, {
            range: 180,
            damage: 50,
            fireRate: 180,
            color: "black",
            size: 10,
            targetingMode: targetingMode || "first"
        });
    }
}
