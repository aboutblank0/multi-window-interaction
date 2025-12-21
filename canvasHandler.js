class ScreenCanvas {
  canvas;
  ctx;
  lines = [];
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

  setLines(lines) {
    this.lines = lines.map((newLine, i) => {
      const prev = this.lines[i] || {};
      return {
        targetAngle: newLine.angle,
        targetDistance: newLine.distance,
        currentAngle: prev.currentAngle ?? newLine.angle,
        currentDistance: prev.currentDistance ?? newLine.distance,
      };
    });
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
    if (!this.lines) return;

    const alpha = 0.1; // smoothing factor

    for (const line of this.lines) {
      // Smooth angle using shortest path
      line.currentAngle = this.lerpAngle(
        line.currentAngle,
        line.targetAngle,
        alpha
      );
      line.currentDistance +=
        (line.targetDistance - line.currentDistance) * alpha;

      this.drawLine(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        line.currentDistance,
        line.currentAngle
      );
    }
  }

  lerpAngle(current, target, alpha) {
    let diff = target - current;
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    return current + diff * alpha;
  }

  drawLine(ctx, x, y, length, angle) {
    const endX = x + length * Math.cos(angle);
    const endY = y + length * Math.sin(angle);

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.fill();
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
