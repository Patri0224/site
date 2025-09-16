class Projectile {
  constructor (x, y, target, damage) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 4;
    this.alive = true;
    this.damage = damage || 10;
  }

  update() {
    if (!this.alive || !this.target.alive) {
      this.alive = false;
      return;
    }

    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 5) {
      this.target.hp -= this.damage;
      if (this.target.hp <= 0) {
        this.target.alive = false;
      }
      this.alive = false;
    } else {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}