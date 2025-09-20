class Wave {
    constructor (config) {
        this.enemyType = config.enemyType;  // classe nemico
        this.count = config.count;          // quanti nemici
        this.delay = config.delay || 1000;  // ms tra spawn
        this.spawned = 0;
        this.timer = 0;
        this.done = false;
    }

    update(deltaTime, enemies, path) {

        if (this.done) return;

        this.timer += deltaTime;

        if (this.spawned < this.count && this.timer >= this.delay) {
            enemies.push(new this.enemyType(path));
            this.spawned++;
            this.timer = 0;
        }

        if (this.spawned >= this.count) {
            this.done = true;
        }
    }
    isFinished(enemies) {
        return this.done && enemies.every(e => !e.alive);
    }
}

