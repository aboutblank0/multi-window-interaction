class ScreenCanvas {
  canvas;
  directions = [];

  constructor() {
    this.canvas = document.getElementById("canvas");
    if (!this.canvas) throw new Error("Could not find canvas in html");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext("2d");

    window.addEventListener("resize", this.resizeCanvas);
    setInterval(() => this.update(ctx), 10);
  }

  setArrowDirections(directions) {
    this.directions = directions;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update(ctx) {
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.directions) return;

    for (const direction of this.directions) {
      this.drawArrow(
        ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        1000,
        direction
      );
    }
  }

  drawArrow(ctx, x, y, length, angle) {
    const headLength = 10; // length of arrow head
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(endX, endY);
    ctx.fill();
  }
}
