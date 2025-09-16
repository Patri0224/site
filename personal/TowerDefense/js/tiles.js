class Tile {
  constructor(x, y, size, type = "empty") {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
  }

  setType(type) {
    this.type = type;
  }

  draw(ctx) {
    // Disegno base: solo un quadrato
    ctx.fillStyle = this.getColor();
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // Bordo per la griglia
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(this.x, this.y, this.size, this.size);
  }

  // Qui le celle prendono lo stile dal CSS
  getColor() {
    let style = getComputedStyle(document.documentElement);
    switch (this.type) {
      case "empty":
        return style.getPropertyValue("--tile-empty-bg") || "#e0e0e0";
      case "path":
        return style.getPropertyValue("--tile-path-bg") || "#c2a676";
      case "base":
        return style.getPropertyValue("--tile-base-bg") || "#4caf50";
      case "blocked":
        return style.getPropertyValue("--tile-blocked-bg") || "#666";
      default:
        return "#fff";
    }
  }
}
