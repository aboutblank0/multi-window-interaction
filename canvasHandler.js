class ScreenCanvas {
  canvas;
  ctx;
  arrows = [];
  rafId = null;

  constructor() {
    this.canvas = document.getElementById("canvas");
    if (!this.canvas) throw new Error("Could not find canvas in html");

    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas = this.resizeCanvas.bind(this);
    window.addEventListener("resize", this.resizeCanvas);

    this.resizeCanvas();
    this.loop();
  }

  setArrows(arrows) {
    this.arrows = arrows;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  loop = () => {
    this.update();
    this.rafId = requestAnimationFrame(this.loop);
  };

  update() {
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!this.arrows) return;

    for (const arrow of this.arrows) {
      this.drawArrow(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        arrow.distance,
        arrow.angle
      );
    }
  }

  drawArrow(ctx, x, y, length, angle) {
    const headLength = 10;
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

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
    ctx.closePath();
    ctx.fill();
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
