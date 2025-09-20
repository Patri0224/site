class WaveSystem {
    constructor (waves) {
        this.waves = waves;
        this.currentWave = 0;

    }

    update(deltaTime, enemies, path) {

        console.log(this.waves);
        if (this.currentWave >= this.waves.length) return;

        const wave = this.waves[this.currentWave];
        wave.update(deltaTime, enemies, path);

        if (wave.isFinished(enemies)) {
            this.currentWave++;
        }
    }

    allWavesFinished() {
        return this.currentWave >= this.waves.length;
    }
}